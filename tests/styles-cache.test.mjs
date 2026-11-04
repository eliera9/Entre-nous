import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const source=await readFile(new URL('../sw.js',import.meta.url),'utf8');
async function stylesheet(online,path='code-placement.css'){
 const events={},stored=[];let options,request;
 const fresh={ok:true,body:'centré',clone(){return {...this}}},old={body:'hors ligne'};
 runInNewContext(source,{location:{origin:'https://journal.test'},self:{location:{origin:'https://journal.test'},addEventListener(name,fn){events[name]=fn}},URL,Response,fetch:async(r,opt)=>{request=r;options=opt;if(!online)throw Error('offline');return fresh},caches:{open:async()=>({put:(...args)=>stored.push(args)}),match:async()=>old}});
 let result;events.fetch({request:{method:'GET',url:'https://journal.test/Entre-nous/'+path,mode:'cors'},respondWith(promise){result=promise}});
 const response=await result;return {response,stored,options,request};
}
test('les styles publiés prennent le pas sur une ancienne version en cache',async()=>{
 const {response,stored,options}=await stylesheet(true);
 assert.equal(response.body,'centré');assert.equal(options.cache,'no-cache');assert.equal(stored.length,1);
});
test('les styles déjà enregistrés restent disponibles sans connexion',async()=>{
 const {response}=await stylesheet(false);assert.equal(response.body,'hors ligne');
});
test('le placement validé reste inclus dans la page et le cache hors ligne',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');assert.ok(html.includes('href="code-placement.css"'));assert.ok(source.includes('"code-placement.css"'));
});

test('le nouveau contrôleur du code se met aussi à jour sans réutiliser un ancien script',async()=>{const {response,options}=await stylesheet(true,'onboarding-code-recovery.js');assert.equal(response.body,'centré');assert.equal(options.cache,'no-cache')});
