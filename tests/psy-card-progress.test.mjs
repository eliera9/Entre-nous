import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const first=readFileSync(new URL('../psy-premiere-validee.js',import.meta.url),'utf8');
const ongoing=readFileSync(new URL('../psy-suivi-valide.js',import.meta.url),'utf8');
function firstProgress(overrides={}){
 const context=vm.createContext({questions:new Map(),DATA:{attentes:{questions:{attentes:{},reperes:{}}}},topicsQuestion:null,familyQuestion:null,peopleQuestion:null,timeline:null,freeUnknown:null,...overrides});
 vm.runInContext(first.slice(first.indexOf('function progress(id){'),first.indexOf('function updateHub(){')),context);
 return id=>JSON.parse(JSON.stringify(context.progress(id)));
}
test('les cartes vierges comptent les questions réelles de chaque rubrique',()=>{
 const progress=firstProgress();
 for(const [id,total] of [['traverse',1],['attentes',2],['histoire',2],['pratique',1],['confort',1]])assert.deepEqual(progress(id),{answered:0,total,percent:0});
});
test('les questions conditionnelles comptent seulement les branches actuellement choisies',()=>{
 const questions=new Map(['topics','family','people','person:mother','topic:work'].map(key=>[key,{answered:true}]));
 const topicsQuestion={selected:new Set(['family'])},familyQuestion={selected:new Set(['relations'])},peopleQuestion={selected:new Set(['mother','father'])};
 const progress=firstProgress({questions,topicsQuestion,familyQuestion,peopleQuestion});
 assert.deepEqual(progress('traverse'),{answered:4,total:5,percent:80});
 topicsQuestion.selected=new Set(['work']);
 assert.deepEqual(progress('traverse'),{answered:2,total:2,percent:100});
 topicsQuestion.selected.clear();
 assert.deepEqual(progress('traverse'),{answered:1,total:1,percent:100});
});
test('les repères et les réponses restaurées sont pris en compte séparément',()=>{
 const progress=firstProgress({timeline:{entries:[{label:'Un repère'}]},questions:new Map([['histoire:meaning',{answered:false}],['attentes:attentes',{answered:true}],['attentes:reperes',{answered:false}]])});
 assert.deepEqual(progress('histoire'),{answered:1,total:2,percent:50});
 assert.deepEqual(progress('attentes'),{answered:1,total:2,percent:50});
});
test('un retour aux rubriques du suivi conserve les compteurs et la largeur de progression',()=>{
 const chapters=['commencement','parcours','present','next'].map(id=>({id})),chapterDetails={commencement:{total:4},parcours:{total:2},present:{total:2},next:{total:1}};
 const rows=new Map(chapters.map(({id})=>{const nodes={'[data-track]':{attributes:{},setAttribute(key,value){this.attributes[key]=value;}},'[data-fill]':{style:{}},'[data-percent]':{textContent:''}};return [id,{dataset:{},querySelector:selector=>nodes[selector]}];}));
 const themes={querySelector:selector=>rows.get(selector.match(/data-chapter="([^"]+)"/)[1])};
 const context=vm.createContext({chapters,chapterDetails,rows,themes});
 vm.runInContext(ongoing.slice(ongoing.indexOf('  const syncMainProgress ='),ongoing.indexOf('  function updateProgress()'))+'\nglobalThis.sync=syncMainProgress;',context);
 vm.runInContext(ongoing.slice(ongoing.indexOf(' function refresh(){'),ongoing.indexOf(' function openChapter(')),context);
 for(const [id,answered,total,percent] of [['commencement',3,4,75],['parcours',1,2,50],['present',0,2,0],['next',1,1,100]]){
  context.sync(id,answered,total);context.refresh();
  const row=rows.get(id);
  assert.equal(row.querySelector('[data-percent]').textContent,answered+' / '+total);
  assert.equal(row.querySelector('[data-fill]').style.width,percent+'%');
  assert.equal(row.querySelector('[data-track]').attributes['aria-valuenow'],String(percent));
  assert.equal(row.querySelector('[data-track]').attributes['aria-valuetext'],answered+' / '+total+' questions renseignées');
 }
});
