import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runInNewContext} from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const identity=fs.readFileSync(new URL('../profil-identite.js',import.meta.url),'utf8');
const resolver=html.split('\n').find(line=>line.startsWith('window.__P=()=>'));
function fixture(rg){
 const events=[],names=[];const document={getElementById:()=>null,addEventListener(){},dispatchEvent:event=>events.push(event.type)};
 const window={__enGet:key=>key==='rg'?rg:null,__P0:()=>rg.prenom||'',__vaultName:name=>names.push(name)};
 runInNewContext(resolver,{window,LIVE:{rg:{o:rg}}});
 runInNewContext(identity,{window,document,Event:class{constructor(type){this.type=type}}});
 return{window,events,names};
}
const answer=name=>({state:'answered',verified:true,rows:[{name}]});
test('une appellation confirmée dans le formulaire devient le nom utilisé dans toute l’app',()=>{
 const rg={prenom:'Camille',appellation:0},f=fixture(rg);
 assert.equal(f.window.__enApplyFormName(answer('Cami')) ,true);
 assert.equal(f.window.__P(),'Cami');assert.equal(rg.prenom,'Camille');assert.equal(rg.petit,'Cami');assert.equal(rg.appellation,1);
 assert.deepEqual(f.names,['Cami']);assert.deepEqual(f.events,['en-identity-change']);
});
test('un import non vérifié ou une question passée ne change pas le nom choisi',()=>{
 const f=fixture({prenom:'Camille',petit:'Cami',appellation:1});
 assert.equal(f.window.__enApplyFormName({...answer('Autre'),verified:false},{force:true}),false);
 assert.equal(f.window.__enApplyFormName({...answer('Autre'),state:'paused'},{force:true}),false);
 assert.equal(f.window.__P(),'Cami');assert.equal(f.events.length,0);
});
test('la migration ne remplace pas une préférence existante et ne réimpose pas un ancien surnom',()=>{
 const rg={prenom:'Camille',petit:'Cam',appellation:0},f=fixture(rg);
 f.window.__enApplyFormName(answer('Cami'));assert.equal(f.window.__P(),'Camille');assert.equal(rg.formNameApplied,'Cami');
 f.window.__enApplyFormName(answer('Cami'));assert.equal(f.window.__P(),'Camille');
 f.window.__enApplyFormName(answer('Cami'),{force:true});assert.equal(f.window.__P(),'Cami');
 rg.appellation=0;f.window.__enApplyFormName(answer('Cami'));assert.equal(f.window.__P(),'Camille');
});
test('le retour au prénom et un surnom composé restent cohérents',()=>{
 const rg={prenom:'Camille',petit:'Cam',appellation:1},f=fixture(rg);
 f.window.__enApplyFormName(answer('Mon petit cœur'),{force:true});assert.equal(f.window.__P(),'Mon petit cœur');
 f.window.__enApplyFormName(answer('Camille'),{force:true});assert.equal(f.window.__P(),'Camille');assert.equal(rg.petit,'Mon petit cœur');
 rg.petit='   ';rg.appellation=1;assert.equal(f.window.__P(),'Camille');
});
test('le verrou enregistre le même nom que les écrans, même si une ancienne réponse de formulaire existe',async()=>{
 const source=html.slice(html.indexOf('function save(force){'),html.indexOf('setInterval(()=>{if(DEK)save()}'));
 const rg={prenom:'Camille',petit:'Mon petit cœur',appellation:1},f=fixture(rg),records=[];
 const state={rg,'lifeform-approved-v1':{answers:{surnom:answer('Ancien surnom')}}};
 const save=runInNewContext(`let ENROLL={active:false},DEK={},W={code:{}},META={nm:'Ancien prénom'},M={ls:{}},last='',dirty=true,saving=null;${source};save`,{
  snapshot:()=>state,seal:async()=>({}),dbPut:async(key,rec)=>records.push(rec),KEY:'v1',CLOUD:{push(){}},setTimeout:()=>0,
  document:{createElement:()=>({setAttribute(){},remove(){}}),body:{appendChild(){}}}
 });
 await save(true);assert.equal(records.at(-1).nm,f.window.__P());assert.equal(records.at(-1).nm,'Mon petit cœur');
 rg.appellation=0;await save(true);assert.equal(records.at(-1).nm,f.window.__P());assert.equal(records.at(-1).nm,'Camille');
});
