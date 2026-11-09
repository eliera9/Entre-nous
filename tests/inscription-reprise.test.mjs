import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../inscription-reprise.js',import.meta.url),'utf8'),html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function tools(){const ctx={TextEncoder,TextDecoder};vm.createContext(ctx);vm.runInContext(source,ctx);return ctx.__enEnrollmentTools;}
const payload=()=>({progress:{active:true,screen:'mv3',step:2,chapter:'proches',page:'famille',identity:{name:'Prénom test',birth:['4','','']}},data:{ls:{'en-reel':'1'},st:{draft:'Des mots conservés'}},dek:Buffer.alloc(32,7).toString('base64'),wraps:{code:null,sec:null},vaultAt:null});
function database(){const values=new Map();const api=tools();return {values,api,store:()=>api.createDraftStore({crypto:webcrypto,get:async key=>values.get(key),put:async(key,value)=>values.set(key,structuredClone(value))})};}
test('une inscription avant choix du code se rouvre avec son écran, sa date partielle et ses mots',async()=>{
 const db=database(),data=payload();await db.store().write(data);const restored=await db.store().read();assert.deepEqual(JSON.parse(JSON.stringify(restored)),data);assert.equal(restored.wraps.code,null);assert.equal(restored.progress.identity.birth[1],'');
 const record=db.values.get(db.api.DRAFT_KEY);assert.equal(record.key.extractable,false);assert.equal(record.data,undefined);assert.equal(record.dek,undefined);assert.equal(record.progress,undefined);assert.equal(record.name,undefined);assert.ok(record.ciphertext.byteLength);assert.equal(JSON.stringify(record).includes('Des mots conservés'),false);
});
test('la reprise est limitée au même compte et à la même version locale du coffre',async()=>{
 const db=database(),data=payload();data.vaultAt=123;data.wraps.code={salt:'test'};await db.store().write(data,'compte-a');assert.equal(await db.store().read('compte-b',{at:123}),null);assert.equal(await db.store().read(null,{at:123}),null);assert.equal(await db.store().read('compte-a',{at:124}),null);assert.equal(await db.store().read('compte-a',null),null);assert.deepEqual(JSON.parse(JSON.stringify(await db.store().read('compte-a',{at:123}))),data);
});
test('un brouillon terminé ou altéré ne permet pas de contourner le code du carnet',async()=>{
 const db=database(),data=payload();data.progress.active=false;await db.store().write(data);assert.equal(await db.store().read(),null);data.progress.active=true;await db.store().write(data);const record=db.values.get(db.api.DRAFT_KEY),bytes=new Uint8Array(record.ciphertext);bytes[0]^=1;record.ciphertext=bytes.buffer;await assert.rejects(()=>db.store().read());
});
function atomicDatabase(values){let fail=false;const db={transaction(){const ops=[],tx={objectStore(){return {put(value,key){ops.push(['put',key,value]);},delete(key){ops.push(['delete',key]);}}}};queueMicrotask(()=>{if(fail){fail=false;tx.error=Error('échec simulé');tx.onabort();return;}for(const [type,key,value]of ops)if(type==='put')values.set(key,structuredClone(value));else values.delete(key);tx.oncomplete();});return tx;}};return {idb:async()=>db,fail(){fail=true;}};}
test('la fin sauvegarde le coffre et supprime la clé de reprise dans une seule transaction',async()=>{
 const db=database();db.values.set('v1',{at:1});db.values.set(db.api.DRAFT_KEY,{old:true});const atomic=atomicDatabase(db.values);const start=html.indexOf('async function dbWriteEntries('),end=html.indexOf('async function backupPayload(',start);const write=vm.runInNewContext(html.slice(start,end)+';dbWriteEntries',{idb:atomic.idb,STORE:'coffre',ENROLL_KEY:db.api.DRAFT_KEY});
 atomic.fail();await assert.rejects(()=>write([['v1',{at:2}]],true));assert.equal(db.values.get('v1').at,1);assert.ok(db.values.has(db.api.DRAFT_KEY));await write([['v1',{at:2}]],true);assert.equal(db.values.get('v1').at,2);assert.equal(db.values.has(db.api.DRAFT_KEY),false);
});
async function bootFixture(db,owner=null){
 const calls=[];const start=html.indexOf('async function boot(){'),end=html.indexOf("if(document.readyState==='loading')",start);const ctx={crypto:webcrypto,ENROLL:{active:false},enrollmentStore:null,M:{ls:{},st:{}},META:{},W:{},DEK:null,DEKRAW:null,last:'',KEY:'v1',recoveryPage:async()=>false,dbGet:async key=>db.values.get(key),dbPut:async(key,value)=>db.values.set(key,value),CLOUD:{session:async()=>owner?{user:{id:owner}}:null},navigator:{onLine:false},mount(first){calls.push({type:'mount',first});},runScripts(){calls.push({type:'scripts'});},useDek:async key=>calls.push({type:'dek',key}),newDek:async()=>calls.push({type:'new-dek'}),save:async()=>{},lockUI(){calls.push({type:'lock'});},__enEnrollmentTools:db.api,__enKeep:(key,value)=>value,setTimeout:()=>0,console};ctx.window=ctx;vm.createContext(ctx);const boot=vm.runInContext(html.slice(start,end)+';boot',ctx);await boot();return {ctx,calls};
}
test('le démarrage reprend un brouillon actif sans afficher le clavier du code',async()=>{
 const db=database();await db.store().write(payload());const {ctx,calls}=await bootFixture(db);assert.equal(calls.some(call=>call.type==='lock'),false);assert.equal(calls.some(call=>call.type==='mount'),true);assert.equal(ctx.ENROLL.screen,'mv3');assert.equal(ctx.ENROLL.chapter,'proches');assert.equal(ctx.M.st.draft,'Des mots conservés');assert.equal(ctx.ENROLL.restoring,true);
});
test('un carnet terminé et un changement de compte passent toujours par le déverrouillage',async()=>{
 const db=database();db.values.set('v1',{at:123,box:{}});let result=await bootFixture(db);assert.equal(result.calls.some(call=>call.type==='lock'),true);const data=payload();data.vaultAt=123;await db.store().write(data,'compte-a');result=await bootFixture(db,'compte-b');assert.equal(result.calls.some(call=>call.type==='lock'),true);assert.equal(result.calls.some(call=>call.type==='mount'),false);
});
test('la suppression des aides laisse les choix multiples et les commandes de retour disponibles',()=>{
 const grouped=readFileSync(new URL('../ma-vie-pages.js',import.meta.url),'utf8');assert.equal(grouped.includes("el('span','ec-info-mark','i')"),false);assert.equal(grouped.includes('prev.disabled=position===0'),false);assert.ok(grouped.includes('prev.disabled=false'));assert.ok(grouped.includes('multiple:true'));assert.ok(grouped.includes('if(showApp||!STATE.lastPage[chapter.id])'));
 for(const file of ['inscription-reprise.js','inscription-reprise.css']){assert.ok(html.includes(file));assert.ok(readFileSync(new URL('../sw.js',import.meta.url),'utf8').includes(file));}
});
test('les frappes avant le code sont conservées, puis Plus tard referme définitivement la reprise automatique',async()=>{
 const db=database(),atomic=atomicDatabase(db.values),DEK=await webcrypto.subtle.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);
 const context={ENROLL:{...payload().progress,startedAt:1},DEK,DEKRAW:Buffer.from(await webcrypto.subtle.exportKey('raw',DEK)).toString('base64'),W:{code:null,sec:null},META:{},M:{ls:{'en-reel':'1'},st:{}},last:'',dirty:true,saving:null,KEY:'v1',ENROLL_KEY:db.api.DRAFT_KEY,STORE:'coffre',idb:atomic.idb,enrollmentStore:db.store(),CLOUD:{session:async()=>null,push(){}},setTimeout:()=>0,document:{createElement:()=>({setAttribute(){},remove(){}}),body:{appendChild(){}}}};
 context.seal=async(key,value)=>{const iv=webcrypto.getRandomValues(new Uint8Array(12)),ct=await webcrypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(value)));return {iv:Buffer.from(iv).toString('base64'),ct:Buffer.from(ct).toString('base64')};};context.window=context;
 vm.createContext(context);const writeStart=html.indexOf('async function dbWriteEntries('),writeEnd=html.indexOf('async function backupPayload(',writeStart);vm.runInContext(html.slice(writeStart,writeEnd),context);
 vm.runInContext(html.slice(html.indexOf('function enrollmentMeta(){'),html.indexOf('function snapshot(){')),context);context.snapshot=()=>({rg:{prenom:'Prénom test'},texte:'Une réponse en cours','inscription-progress-v1':context.enrollmentMeta()});
 vm.runInContext(html.slice(html.indexOf('function save(force){'),html.indexOf('setInterval(()=>{if(DEK)save()}')),context);
 await context.save(true);assert.equal(db.values.has('v1'),false);assert.equal((await db.store().read()).data.st.texte,'Une réponse en cours');
 context.W.code={fixture:'code enveloppé'};await context.save(true);const initialVault=db.values.get('v1');assert.equal((await db.store().read(null,initialVault)).progress.active,true);
 const finishStart=html.indexOf('window.__enCompleteEnrollment='),finishEnd=html.indexOf('\n/* Couleur visible',finishStart);vm.runInContext(html.slice(finishStart,finishEnd),context);
 atomic.fail();assert.equal(await context.__enCompleteEnrollment('later'),false);assert.equal(context.ENROLL.active,true);assert.ok(db.values.has(db.api.DRAFT_KEY));
 assert.equal(await context.__enCompleteEnrollment('later'),true);assert.equal(db.values.has(db.api.DRAFT_KEY),false);assert.equal(await db.store().read(null,db.values.get('v1')),null);
 const vault=db.values.get('v1'),decoded=JSON.parse(new TextDecoder().decode(await webcrypto.subtle.decrypt({name:'AES-GCM',iv:Buffer.from(vault.box.iv,'base64')},DEK,Buffer.from(vault.box.ct,'base64'))));assert.equal(decoded.st.texte,'Une réponse en cours');assert.equal(decoded.st['inscription-progress-v1'].active,false);
});
