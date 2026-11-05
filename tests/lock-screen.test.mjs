import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runInNewContext,Script} from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=html.slice(html.indexOf('function createUnlockController('),html.indexOf('function lockUI('));
function fixture(overrides={}){
 let time=1000,record=null,cleared=0,opened=0;const timers=new Map();let id=0;
 const defaults={now:()=>time,setTimeout:fn=>{timers.set(++id,fn);return id},clearTimeout:id=>timers.delete(id),readAttempts:async()=>record,writeAttempts:async value=>{record=value},clearAttempts:async()=>{cleared++},verifyCode:async()=>false,verifyRecovery:async()=>false,verifyBiometric:async()=>false,onUnlocked:()=>opened++};
 const create=runInNewContext(source+';createUnlockController',{setTimeout,clearTimeout});
 const c=create({...defaults,...overrides});return{c,get record(){return record},get opened(){return opened},get cleared(){return cleared},get timers(){return timers},tick(ms){time+=ms;const queue=[...timers.values()];timers.clear();queue.forEach(fn=>fn())}};
}
async function pin(c,value='1234'){let result;for(const digit of value)result=c.input(digit);await result;}
test('la saisie attend le chargement du compteur et une attente persistée bloque les nouvelles vérifications',async()=>{
 let release,calls=0;const f=fixture({readAttempts:()=>new Promise(r=>release=r),verifyCode:async()=>{calls++;return true}});
 await pin(f.c);assert.equal(calls,0);assert.equal(f.c.view().busy,true);
 release({n:5,until:31000});await f.c.initialized;assert.equal(f.c.view().remaining,30);await pin(f.c);assert.equal(calls,0);
 f.tick(30000);assert.equal(f.c.view().blocked,false);await pin(f.c);assert.equal(calls,1);assert.equal(f.opened,1);assert.equal(f.cleared,1);
});
test('quatre chiffres déclenchent une seule vérification et ne sont pas exposés dans la vue',async()=>{
 let release,calls=0,value;const f=fixture({verifyCode:code=>{calls++;value=code;return new Promise(r=>release=r)}});await f.c.initialized;
 f.c.input('1');f.c.input('x');f.c.input('2');f.c.remove();assert.equal(f.c.view().count,1);f.c.input('2');f.c.input('3');const pending=f.c.input('4');f.c.input('5');f.c.biometric();
 assert.equal(calls,1);assert.equal(value,'1234');assert.ok(!JSON.stringify(f.c.view()).includes('1234'));release(true);await pending;assert.equal(f.c.view().count,0);assert.equal(f.opened,1);await pin(f.c);assert.equal(calls,1);
});
test('une erreur technique et une annulation biométrique rendent la saisie disponible sans ajouter un mauvais essai',async()=>{
 const f=fixture({verifyCode:async()=>{throw Error('storage')},verifyBiometric:async()=>{throw Error('cancel')}});await f.c.initialized;
 await pin(f.c);assert.equal(f.c.view().busy,false);assert.match(f.c.view().message,/réessayer/);assert.equal(f.record,null);
 await f.c.biometric();assert.equal(f.c.view().busy,false);assert.equal(f.c.view().error,false);assert.match(f.c.view().message,/utiliser ton code/);f.c.input('8');assert.equal(f.c.view().count,1);
});
test('le cinquième échec est enregistré et impose trente secondes même après réouverture',async()=>{
 const f=fixture();await f.c.initialized;for(let i=0;i<5;i++)await pin(f.c);
 assert.equal(f.record.n,5);assert.equal(f.record.until,31000);assert.equal(f.c.view().blocked,true);
 const next=fixture({readAttempts:async()=>f.record});await next.c.initialized;assert.equal(next.c.view().remaining,30);next.tick(30000);assert.equal(next.c.view().blocked,false);next.c.dispose();assert.equal(next.timers.size,0);
});
test('le dixième échec impose cinq minutes',async()=>{
 const f=fixture({readAttempts:async()=>({n:9,until:0})});await f.c.initialized;await pin(f.c);assert.equal(f.record.n,10);assert.equal(f.c.view().remaining,300);
});
test('un échec de stockage bloque la saisie puis réenregistre exactement le même essai au réessai',async()=>{
 let writes=0,record;const f=fixture({writeAttempts:async value=>{writes++;if(writes===1)throw Error('disk');record=value}});await f.c.initialized;await pin(f.c);assert.equal(f.c.view().ready,false);assert.equal(f.c.view().retry,true);await pin(f.c);assert.equal(writes,1);
 await f.c.retry();assert.equal(f.c.view().ready,true);assert.equal(record.n,1);assert.equal(writes,2);
});
test('un chargement échoué peut être relancé sans initialisations concurrentes',async()=>{
 let reads=0,release;const f=fixture({readAttempts:async()=>{reads++;if(reads===1)throw Error('disk');return new Promise(r=>release=r)}});await f.c.initialized;assert.equal(f.c.view().retry,true);
 const retry=f.c.retry();await f.c.retry();assert.equal(reads,2);release(null);await retry;assert.equal(f.c.view().ready,true);
});
test('le code de secours est normalisé et son envoi reste unique',async()=>{
 let calls=0,release,value;const f=fixture({verifyRecovery:code=>{calls++;value=code;return new Promise(r=>release=r)}});await f.c.initialized;await f.c.recovery('court');assert.equal(calls,0);
 const pending=f.c.recovery('abcd-efgh-jklm-npqr');await f.c.recovery('ABCD-EFGH-JKLM-NPQR');assert.equal(calls,1);assert.equal(value,'ABCDEFGHJKLMNPQR');release(false);await pending;assert.equal(f.record.n,1);assert.equal(f.c.view().busy,false);assert.match(f.c.view().message,/secours ne correspond pas/);f.c.clear();assert.equal(f.c.view().message,'Ton code, rien que pour toi');
});
test('une réponse tardive ne rouvre pas un écran supprimé',async()=>{
 let release;const f=fixture({verifyCode:()=>new Promise(r=>release=r)});await f.c.initialized;f.c.input('1');f.c.input('2');f.c.input('3');const pending=f.c.input('4');f.c.dispose();release(true);await pending;assert.equal(f.opened,0);assert.equal(f.timers.size,0);
});
test('les scripts de la page se compilent et le volet garde ses commandes accessibles',()=>{
 for(const match of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)){if(!match[1].includes('application/json'))new Script(match[2]);}
 assert.match(html,/id="en-sh" hidden><div class="in" role="dialog" aria-modal="true"/);assert.match(html,/id="en-restore">REPRENDRE UNE SAUVEGARDE<\/button>/);assert.ok(html.includes("delete wipe.dataset.c"));assert.ok(html.includes("document.removeEventListener('keydown',keyboard)"));
});
