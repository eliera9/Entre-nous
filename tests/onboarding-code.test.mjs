import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext,Script} from 'node:vm';
const source=await readFile(new URL('../onboarding-code-recovery.js',import.meta.url),'utf8');
function fixture(save=async()=>{}){
 const elements={},timers=[];let active=true,haptics=0;
 const element=id=>elements[id]||=( {hidden:true,textContent:'',children:[],dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(name,fn){this[name]=fn},querySelectorAll(){return []},getBoundingClientRect(){return {}},getAnimations(){return []},focus(){}} );
 element('o3d').children=Array.from({length:4},()=>element(Symbol()));
 const document={hidden:false,getElementById:element,addEventListener(name,fn){this[name]=fn}};
 const window={__vaultSetCode:save,__vaultHasSecours:()=>false,__enSecours:close=>{window.recoveryClose=close}};
 runInNewContext(source,{window,document,navigator:{vibrate(ms){assert.equal(ms,20);haptics++}},setTimeout(fn,ms){const t={fn,ms};timers.push(t);return t},clearTimeout(t){if(t)t.cancel=true}});
 const api=window.__enInitCode({onChange(){},isActive:()=>active});
 const click=key=>element('o3p').click({target:{closest:()=>({dataset:{key}})}});
 const tick=async()=>{const t=timers.shift();if(t&&!t.cancel)await t.fn()};
 const enter=async code=>{for(const key of code)click(key);await tick()};
 return {elements,window,document,api,click,tick,enter,timers,setActive(value){active=value},get haptics(){return haptics}};
}
test('le quatrième chiffre confirme automatiquement et une différence conserve le premier code',async()=>{
 let calls=0;const f=fixture(async()=>calls++);
 await f.enter('1234');assert.equal(f.elements.o3t.textContent,'Encore une fois');
 await f.enter('9999');assert.match(f.elements.o3feedback.textContent,/différentes/);assert.equal(calls,0);
 await f.enter('1234');assert.equal(calls,1);assert.equal(f.elements.o3success.hidden,false);
});
test('aucun succès avant la sauvegarde effective et les doubles saisies restent bloquées',async()=>{
 let resolve,calls=0;const f=fixture(()=>{calls++;return new Promise(r=>resolve=r)});
 await f.enter('0123');for(const key of '0123')f.click(key);const pending=f.tick();
 assert.equal(f.api.busy,true);assert.equal(f.api.ready,false);assert.equal(f.elements.o3success.hidden,true);
 for(const key of '9999')f.click(key);f.api.continue();assert.equal(calls,1);
 resolve();await pending;assert.equal(f.elements.o3success.hidden,false);assert.equal(f.elements.o3success.hidden,false);
 await f.tick();assert.equal(f.haptics,1);
 f.api.continue();assert.equal(f.window.recoveryClose,undefined);assert.equal(f.timers[0].ms,2000);await f.tick();assert.equal(f.elements.o3b.hidden,true);assert.equal(f.elements.o3success.hidden,false);f.window.recoveryClose();assert.equal(f.elements.o3b.hidden,false);
});
test('un échec de sauvegarde permet de confirmer à nouveau sans annoncer une réussite',async()=>{
 let fail=true;const f=fixture(async()=>{if(fail)throw new Error('storage')});
 await f.enter('1234');await f.enter('1234');assert.equal(f.api.ready,false);assert.equal(f.elements.o3success.hidden,true);assert.match(f.elements.o3feedback.textContent,/pas pu être enregistré/);
 fail=false;await f.enter('1234');assert.equal(f.elements.o3success.hidden,false);
});
test('quitter efface une saisie partielle et annule la vibration à venir',async()=>{
 const f=fixture();f.click('1');f.api.leave();assert.equal(f.elements.o3t.textContent,'Un code, rien qu’à toi');
 await f.enter('4321');await f.enter('4321');f.api.leave();await f.tick();assert.equal(f.haptics,0);
});
test('le module se compile et reste disponible hors ligne',async()=>{
 new Script(source);const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');for(const path of ['onboarding-code-recovery.js','onboarding-code.css'])assert.ok(sw.includes('"'+path+'"'));
});

test('la pause de deux secondes commence après la vraie fin des animations',async()=>{
 let finish;const animation=new Promise(resolve=>finish=resolve),f=fixture();
 f.elements.o3success.getAnimations=()=>[{finished:animation}];
 await f.enter('1234');await f.enter('1234');await f.tick();
 assert.equal(f.api.ready,false);assert.equal(f.timers.some(timer=>timer.ms===2000),false);
 finish();await new Promise(resolve=>setImmediate(resolve));
 assert.equal(f.timers[0].ms,2000);await f.tick();assert.equal(typeof f.window.recoveryClose,'function');
});
test('revenir en arrière annule l’ouverture différée et revenir sur la page la relance',async()=>{
 const f=fixture();await f.enter('1234');await f.enter('1234');f.api.leave();await f.tick();await f.tick();assert.equal(f.window.recoveryClose,undefined);
 f.api.enter();await Promise.resolve();await Promise.resolve();await f.tick();await f.tick();assert.equal(typeof f.window.recoveryClose,'function');
});
