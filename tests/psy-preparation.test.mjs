import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import dom from './helpers/psy-dom.cjs';
const copy=x=>JSON.parse(JSON.stringify(x));
const source=fs.readFileSync(new URL('../psy-preparation.js',import.meta.url),'utf8');
const storeSource=fs.readFileSync(new URL('../psy-preparation-store.js',import.meta.url),'utf8');
function environment(){const window={},context=vm.createContext({window,console,crypto:webcrypto,setTimeout:()=>1,clearTimeout(){},document:null});vm.runInContext(storeSource,context);vm.runInContext(source,context);return {window,context};}
function mount(env,saved,life,save=async()=>{}){
 const root=dom.parseHTML(env.window.__enPsyPreparationTemplate);env.context.document=dom.documentFor(root);
 let title='',peopleChanges=0;
 const config={stored:saved,life:()=>life,title:v=>title=v,save,peopleChanged:()=>peopleChanges++,scrollTop(){},avatar(){},ongoing(){},later(){}};
 const controller=env.window.__enMountPsyPreparation(root,config);
 return {root,controller,get title(){return title},get peopleChanges(){return peopleChanges}};
}
const input=(node,value)=>{node.value=value;node.fire('input')};
test('migration additive : les anciens écrits, choix et dates sont conservés sans données fictives',()=>{
 const e=environment(),old={p:{pq_a:'Un texte <personnel>',pq_th:['ma famille'],at_a:'Une attente',hi_tl:[{y:'2020',t:'Mon événement'}],pr_q1:1,pr_own:['Ma question ?'],pr_o0:1},done:{hi:1}};
 const state=e.window.__enPsyPreparationStore.createPreparation(old);
 assert.deepEqual(copy(state.legacyArchive),old);assert.equal(state.history[0].label,'Mon événement');assert(state.questions.topics.free.includes('Un texte <personnel>'));assert.equal(state.questions.pratique.customEntries.length,2);assert.equal(state.questions.pratique.customEntries[1].prompt,'Ma question ?');assert.deepEqual(old.p.hi_tl,[{y:'2020',t:'Mon événement'}]);
});
test('réouverture : choix multiples, relances, champs libres et récapitulatif reprennent exactement les mots',async()=>{
 const e=environment(),saved=e.window.__enPsyPreparationStore.createPreparation(),life=e.window.__enPsyPreparationStore.ensureLife({});let saves=0;
 const a=mount(e,saved,life,async()=>saves++),c=a.controller;
 c.show('hub');c.show('traverse');c.questions.get('topics').choose('family');c.questions.get('family').choose('relations');c.questions.get('people').choose('role:mother');
 const person=c.questions.get('person:role:mother');person.choose('0');person.choose('1');input(person.root.querySelector('[data-free]'),'Mes mots\n<aucun HTML>');person.drafts.set('0','Une précision exacte');
 c.show('attentes');c.questions.get('attentes:attentes').choose('0');c.show('confort');c.questions.get('confort').choose('0');
 assert.equal(await c.flush(),true);assert.equal(saves,1);
 const b=mount(e,copy(saved),life),r=b.controller,restored=r.questions.get('person:role:mother');
 assert.deepEqual([...restored.selected],['0','1']);assert.equal(restored.free,'Mes mots\n<aucun HTML>');assert.equal(restored.drafts.get('0'),'Une précision exacte');
 r.show('recap');assert(b.root.textContent.includes('Une précision exacte'));assert(b.root.textContent.includes('<aucun HTML>'));
 restored.choose('0');r.show('recap');assert(!b.root.textContent.includes('Une précision exacte'));assert.equal(restored.drafts.get('0'),'Une précision exacte');
 assert.equal(b.root.querySelectorAll('.ac-info').length,0);assert.equal(b.root.querySelectorAll('[data-global-recap-edit]').length,1);
 b.root.querySelector('[data-global-recap-edit]').click();assert.equal(b.root.querySelectorAll('[data-edit-section]').length,5);assert.equal(r.back(),true);assert.equal(r.path.at(-1),'recap');
});
test('ajouter un proche écrit dans le même objet canonique Ma vie et sélectionne son identifiant stable',async()=>{
 const e=environment(),saved=e.window.__enPsyPreparationStore.createPreparation(),life=e.window.__enPsyPreparationStore.ensureLife({}),a=mount(e,saved,life),c=a.controller;
 c.questions.get('topics').choose('family');c.questions.get('family').choose('relations');const q=c.questions.get('people'),overlay=q.root.querySelector('.pp-person-overlay');
 input(overlay.querySelector('[data-person-name]'),'Cam test');overlay.querySelector('[data-role="father"]').click();overlay.querySelector('[data-person-form]').fire('submit');
 const person=life.pagesV2.people.family.pools.father[0];assert.equal(person.name,'Cam test');assert(q.selected.has(person.uid));assert.equal(a.peopleChanges,1);assert.equal(q.root.querySelector('[aria-label="Ajouter un proche"]').parent,q.root.querySelector('.ac-response-row'));
 await c.flush();const b=mount(e,copy(saved),life);assert(b.controller.questions.get('people').selected.has(person.uid));
 person.name='Prénom corrigé';b.controller.refreshContext();assert(b.root.textContent.includes('Prénom corrigé'));
});
test('questions personnelles ajoutées et repères : pas de collision après réouverture, édition Psy indépendante',async()=>{
 const e=environment(),saved=e.window.__enPsyPreparationStore.createPreparation(),life=e.window.__enPsyPreparationStore.ensureLife({pagesV2:{answers:{'113':{records:[{place:'Ville test',period:'Enfance'}]}},people:{}}});
 let a=mount(e,saved,life),q=a.controller.questions.get('pratique');input(q.root.querySelector('[data-free]'),'Une question ?');q.root.querySelector('.pp-soft').click();const id=[...q.selected][0];await a.controller.flush();
 a=mount(e,copy(saved),life);q=a.controller.questions.get('pratique');assert(q.entries.some(entry=>entry.id===id));input(q.root.querySelector('[data-free]'),'Une autre question ?');q.root.querySelector('.pp-soft').click();assert.equal(new Set(q.entries.map(entry=>entry.id)).size,q.entries.length);
 const screen=a.controller.screens.get('histoire');input(screen.querySelector('[data-history-label]'),'Mon repère exact');input(screen.querySelector('[data-history-period]'),'Un jour');screen.querySelector('[data-history-add]').fire('submit');await a.controller.flush();
 const b=mount(e,copy(a.controller.snapshot()),life);assert(b.root.textContent.includes('Mon repère exact'));assert.equal(life.pagesV2.answers['113'].records[0].place,'Ville test');
});
test('échec de sauvegarde : les écrits restent présents et une nouvelle tentative enregistre',async()=>{
 const e=environment(),saved=e.window.__enPsyPreparationStore.createPreparation(),life=e.window.__enPsyPreparationStore.ensureLife({});let fail=true;
 const {root,controller:c}=mount(e,saved,life,async()=>{if(fail)throw Error('Quota')});input(c.questions.get('confort').root.querySelector('[data-free]'),'À conserver');
 assert.equal(await c.flush(),false);assert.equal(root.querySelector('.psy-save-error').hidden,false);assert.equal(saved.questions.confort.free,'À conserver');fail=false;assert.equal(await c.flush(),true);assert.equal(root.querySelector('.psy-save-error').hidden,true);
});
test('le contexte décliné ou importé sans validation ne personnalise pas les questions',()=>{
 const e=environment(),tools=e.window.__enPsyPreparationTools;
 const life={pagesV2:{answers:{'141':{selected:['0']},N02:{selected:['0']},'113':{imported:true,verified:false,records:[{place:'Secret'}]}},people:{partner:{selected:['couple'],pools:{partner:[{uid:'p',name:'Inconnu',imported:true,verified:false}]}}}}};
 assert.equal(tools.psyContextFromLife(life).name,'');assert.equal(tools.psyContextFromLife(life).barriers,null);assert.equal(tools.historyCandidatesFromLife(life).length,0);
});
test('fichiers chargés avant les contrôleurs, inclus dans build et cache, sans fixtures ni dépendance distante',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
 for(const name of ['psy-approved.js','psy-premiere-validee.js','psy-suivi-valide.js','psy-suivi-recap.js','psy-approved.css']){assert(html.includes(name));assert(build.includes(name));assert(sw.includes(name));}
 const current=fs.readFileSync(new URL('../psy-approved.js',import.meta.url),'utf8');
 assert(current.includes("__enKeep('psy-preparation-v1',{})"));assert(current.includes('importPreparation(previous)'));
 assert(!html.includes('src="psy-preparation.js"'));assert(!source.includes('fiction:'));assert(!source.includes('Tweak'));assert(!source.includes('profils fictifs'));
});
test('un changement de partenaire ne réattribue pas une note déjà rédigée à une autre personne',async()=>{
 const e=environment(),saved=e.window.__enPsyPreparationStore.createPreparation(),life=e.window.__enPsyPreparationStore.ensureLife({pagesV2:{answers:{},people:{partner:{selected:['couple'],activeId:'one',pools:{partner:[{uid:'one',name:'Personne A',verified:true}]}}}}});
 const {controller:c}=mount(e,saved,life);c.questions.get('topics').choose('love');const q=c.questions.get('topic:love');q.choose('0');q.root.querySelector('[data-open]').click();input(q.root.querySelector('[data-draft]'),'Un souvenir associé à A');assert(q.entries[0].prompt.includes('Personne A'));await c.flush();
 life.pagesV2.people.partner={selected:['couple'],activeId:'two',pools:{partner:[{uid:'two',name:'Personne B',verified:true}]}};
 const b=mount(e,copy(saved),life);b.controller.refreshContext();const restored=b.controller.questions.get('topic:love');assert(restored.entries[0].prompt.includes('Personne A'));assert(!restored.entries[0].prompt.includes('Personne B'));assert.equal(restored.drafts.get('0'),'Un souvenir associé à A');
});
test('Ma vie synchronise ses rôles et sa fiche affichée, sans écraser le proche ajouté depuis Psy',()=>{
 const text=fs.readFileSync(new URL('../ma-vie-pages.js',import.meta.url),'utf8'),start=text.indexOf("  docListener('en-life-people-changed'"),end=text.indexOf("\n  if(!visible().includes(active))",start),listeners={};
 const savedPeople={selected:['mother','father'],activeId:'new'},pools={mother:[{uid:'old'}],father:[{uid:'new',name:'Ajout test'}]},selected=new Set(['mother']);let refreshed=0;
 const context={category:'family',selected,savedPeople,pools,active:pools.mother[0],docListener:(event,fn)=>listeners[event]=fn,renderEntry:()=>refreshed++,renderPeople:()=>refreshed++,renderProfile:()=>refreshed++};vm.runInNewContext(text.slice(start,end),context);listeners['en-life-people-changed']();
 assert.deepEqual([...selected],['mother','father']);assert.equal(context.active.uid,'new');assert.equal(refreshed,3);
});
