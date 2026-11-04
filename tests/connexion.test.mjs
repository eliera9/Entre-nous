import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { Script, runInNewContext } from 'node:vm';

const js=await readFile(new URL('../auth-connexion.js',import.meta.url),'utf8');
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const rules=js.slice(js.indexOf('function validateAuth('),js.indexOf('/* Fin des règles indépendantes'));
const {validateAuth,authenticate}=runInNewContext(`${rules};({validateAuth,authenticate})`);
const data={mode:'new',email:'exemple@domaine.fr',password:'Exemple-fictif',confirmation:'Exemple-fictif'};
function cloud(overrides={}){
 const calls=[];
 const C={
  settings:async()=>{calls.push('settings');return {mailer_autoconfirm:true};},
  signUp:async()=>{calls.push('signup');return {ok:true};},
  signIn:async()=>{calls.push('signin');return {ok:true};},
  session:async()=>{calls.push('session');return {user:{email:data.email}};},
  pull:async()=>{calls.push('pull');return null;},
  ...overrides,
 };
 return {C,calls};
}
test('le contrôleur externe se compile et ses ressources sont incluses hors ligne',async()=>{
 new Script(js);for(const path of ['auth-connexion.css','auth-connexion.js','illus/carnet-plume-connexion.png']){
  await access(new URL('../'+path,import.meta.url));
  assert.ok((await readFile(new URL('../sw.js',import.meta.url),'utf8')).includes('"'+path+'"'));
 }
 assert.match(html,/prompt=select_account/);
 assert.doesNotMatch(js,/localStorage|sessionStorage|__enKeep/);
});
test('l’inscription vérifie les trois champs et la concordance du mot de passe',()=>{
 assert.equal(validateAuth(data).length,0);
 assert.deepEqual(Array.from(validateAuth({...data,email:'',password:'',confirmation:''}),x=>x[0]),['email','password','confirm']);
 assert.equal(validateAuth({...data,confirmation:'autre-fictif'})[0][0],'confirm');
 assert.equal(validateAuth({...data,password:'court',confirmation:'court'})[0][0],'password');
 assert.equal(validateAuth({...data,email:'invalide'})[0][0],'email');
});
test('la reconnexion et la récupération ne subissent pas les règles de création',()=>{
 assert.equal(validateAuth({...data,mode:'back',password:'abc',confirmation:''}).length,0);
 assert.equal(validateAuth({recovery:true,email:data.email}).length,0);
});
test('une confirmation e-mail encore requise bloque avant de créer un compte',async()=>{
 const {C,calls}=cloud({settings:async()=>({mailer_autoconfirm:false})});
 await assert.rejects(()=>authenticate(C,data),/sans confirmation e-mail/);assert.deepEqual(calls,[]);
});
test('une inscription sans session ne fait pas poursuivre la personnalisation',async()=>{
 const {C,calls}=cloud({signUp:async()=>({confirm:true})});
 await assert.rejects(()=>authenticate(C,data),/sans confirmation e-mail/);assert.equal(calls.includes('session'),false);assert.equal(calls.includes('pull'),false);
});
test('un compte nouveau vérifié peut poursuivre sans confirmation par e-mail',async()=>{
 const {C,calls}=cloud();const result=await authenticate(C,data);
 assert.equal(result.kind,'new');assert.deepEqual(calls,['settings','signup','session','pull']);
});
test('la session doit correspondre à l’adresse effectivement saisie',async()=>{
 const {C,calls}=cloud({session:async()=>({user:{email:'autre@domaine.fr'}})});
 await assert.rejects(()=>authenticate(C,data),/confirmée/);assert.equal(calls.includes('pull'),false);
});
test('une reconnexion échouée ne recherche ni ne crée de carnet',async()=>{
 const {C,calls}=cloud({signIn:async()=>{throw Error('identifiants incorrects');}});
 await assert.rejects(()=>authenticate(C,{...data,mode:'back'}),/incorrects/);assert.deepEqual(calls,[]);
});
test('le carnet existant est repris et une erreur de lecture ne déclenche pas de création',async()=>{
 const record={box:{iv:'fictif',ct:'fictif'},w:{code:{}}};
 const good=cloud({pull:async()=>record});const result=await authenticate(good.C,{...data,mode:'back'});
 assert.equal(result.kind,'vault');assert.equal(result.record,record);assert.equal(good.calls.includes('signup'),false);
 const failing=cloud({pull:async()=>{throw Error('service indisponible');}});
 await assert.rejects(()=>authenticate(failing.C,{...data,mode:'back'}),/indisponible/);
});
test('un compte sans carnet demande un choix explicite au lieu de remplacer des données',async()=>{
 const {C}=cloud();const result=await authenticate(C,{...data,mode:'back'});assert.equal(result.kind,'empty');
});
test('les saisies du volet e-mail sont exclues des brouillons, même en mode Voir',()=>{
 const a=html.indexOf('function eligible(el)'),b=html.indexOf('function keyOf(el)',a);
 const eligible=runInNewContext(html.slice(a,b)+';eligible');
 assert.equal(eligible({tagName:'INPUT',type:'text',closest(selector){return selector==='.phone'?{}:selector.includes('#en-mail-overlay')?{}:null;}}),false);
});
