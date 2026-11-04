import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext,Script} from 'node:vm';
const source=await readFile(new URL('../recovery-sheet.js',import.meta.url),'utf8');
function fixture(make){
 const nodes={},timers=[],copies=[];let root,closed=0,copyFails=false;
 const node=()=>({hidden:false,disabled:false,textContent:'',style:{setProperty(){}},classList:{add(){},remove(){},contains(){return true}},setAttribute(){},focus(){},addEventListener(){}});
 const app={inert:false};
 const document={activeElement:node(),getElementById:()=>app,querySelector:()=>node(),body:{appendChild(){}},createElement(){
  root=node();root.remove=()=>root.removed=true;
  Object.defineProperty(root,'innerHTML',{set(html){for(const match of html.matchAll(/<([a-z0-9]+)([^>]*\bid="([^"]+)"[^>]*)>/g)){nodes[match[3]]=Object.assign(node(),{tagName:match[1].toUpperCase(),hidden:/\bhidden\b/.test(match[2]),disabled:/\bdisabled\b/.test(match[2])})}}});
  root.querySelector=selector=>selector==='button'?Object.values(nodes).find(n=>n.tagName==='BUTTON'):nodes[selector.slice(1)];root.querySelectorAll=()=>Object.values(nodes).filter(n=>n.tagName==='BUTTON');return root;
 }};
 const window={__vaultMakeSecours:make,matchMedia:()=>({matches:false})};
 runInNewContext(source,{window,document,getComputedStyle:()=>({getPropertyValue:()=>''}),navigator:{clipboard:{async writeText(value){if(copyFails)throw Error('clipboard');copies.push(value)}}},requestAnimationFrame:fn=>fn(),setTimeout(fn){timers.push(fn)}});
 const api=window.__enOpenRecovery({onClose(){closed++}});
 return {nodes,app,copies,window,api,get root(){return root},get closed(){return closed},copyFailure(){copyFails=true},flush(){timers.splice(0).forEach(fn=>fn())}};
}
const settle=async()=>{await Promise.resolve();await Promise.resolve()};
test('le volet masque le code et bloque la confirmation jusqu’à la sauvegarde réelle',async()=>{
 let resolve;const f=fixture(()=>new Promise(r=>resolve=r));
 assert.equal(f.nodes['en-seccp'].disabled,true);assert.equal(f.nodes['en-secok'].disabled,true);assert.equal(f.nodes['en-secv'].textContent,'…');assert.equal(f.app.inert,true);
 resolve('ABCD-EFGH-JKLM-NPQR');await settle();
 assert.equal(f.nodes['en-secv'].textContent,'ABCD-EFGH-JKLM-NPQR');assert.equal(f.nodes['en-secok'].disabled,false);
 await f.nodes['en-seccp'].onclick();assert.deepEqual(f.copies,['ABCD-EFGH-JKLM-NPQR']);assert.equal(f.nodes['en-seccp'].textContent,'✓ Copié');
 f.nodes['en-secok'].onclick();f.nodes['en-secok'].onclick();f.flush();assert.equal(f.closed,1);assert.equal(f.app.inert,false);
});
test('une sauvegarde échouée affiche une erreur et peut être relancée',async()=>{
 let fail=true;const f=fixture(async()=>{if(fail)throw Error('storage');return 'RETRY-KEY'});await settle();
 assert.equal(f.nodes['en-secok'].disabled,true);assert.equal(f.nodes['en-secretry'].hidden,false);assert.match(f.nodes['en-secstatus'].textContent,/pas pu être enregistré/);
 fail=false;await f.nodes['en-secretry'].onclick();assert.equal(f.nodes['en-secv'].textContent,'RETRY-KEY');assert.equal(f.nodes['en-secok'].disabled,false);
});
test('plus tard ne ferme qu’une fois et une génération tardive ne réécrit pas le volet fermé',async()=>{
 let resolve;const f=fixture(()=>new Promise(r=>resolve=r));f.nodes['en-seclt'].onclick();f.nodes['en-seclt'].onclick();f.flush();resolve('LATE-KEY');await settle();
 assert.equal(f.closed,1);assert.equal(f.nodes['en-secv'].textContent,'…');assert.equal(f.app.inert,false);
});
test('une copie refusée ne prétend pas avoir copié le code',async()=>{
 const f=fixture(async()=>'COPY-KEY');await settle();f.copyFailure();await f.nodes['en-seccp'].onclick();assert.equal(f.copies.length,0);assert.match(f.nodes['en-secstatus'].textContent,/pas fonctionné/);
});
test('le volet se compile et reste disponible hors ligne',async()=>{
 new Script(source);const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');for(const name of ['recovery-sheet.js','recovery-sheet.css'])assert.ok(sw.includes('"'+name+'"'));
});
