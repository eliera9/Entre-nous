import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../psy-approved.js',import.meta.url),'utf8');
const copy=value=>JSON.parse(JSON.stringify(value));
function model(){const context={};vm.createContext(context);vm.runInContext(script,context);return context.__enPsyModel;}

test('le raccourci retrouve le parcours explicite, les anciens brouillons et un formulaire encore vide',()=>{
 const {resumeDestination:resume}=model();
 assert.equal(resume({}),'entry');assert.equal(resume({active:'first',first:{route:'entry',questions:{topics:{selected:[],free:'',drafts:[]}}}}),'entry');
 assert.equal(resume({active:'ongoing'}),'ongoing');assert.equal(resume({active:'first',first:{route:'hub'}}),'first');
 assert.equal(resume({first:{questions:{topics:{drafts:{a:'Des mots conservés'}}}}}),'first');
 assert.equal(resume({ongoing:{notes:{a:'Une relance conservée'}}}),'ongoing');
 assert.equal(resume({preferredForm:'ongoing',active:'first',first:{route:'entry'}}),'ongoing');
 assert.equal(resume({preferredForm:'first',ongoing:{fields:{reason:'Un ancien texte'}}}),'first');
});

class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attrs={};this.events={};this.style={setProperty(){}};this.className='';this.classes=new Set();this.classList={contains:name=>this.classes.has(name),add:(...names)=>names.forEach(name=>this.classes.add(name)),remove:(...names)=>names.forEach(name=>this.classes.delete(name))};}
 append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 after(node){const parent=this.parentElement;node.parentElement=parent;parent.children.splice(parent.children.indexOf(this)+1,0,node);}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(node=>node!==this);}
 setAttribute(key,value){this.attrs[key]=String(value);}
 getAttribute(key){return this.attrs[key]??null;}
 addEventListener(type,fn){(this.events[type]||=[]).push(fn);}
 click(){for(const fn of this.events.click||[])fn({stopPropagation(){}});}
 focus(){this.focused=true;}
 querySelectorAll(){return [];}
 querySelector(selector){const wanted=selector.includes('psmsb')?'psmsb':null;for(const node of this.children){if(wanted&&node.className===wanted)return node;if(selector==='[data-psy-form-shortcut]'&&node.dataset.psyFormShortcut!==undefined)return node;if(selector==='[data-psy-save-message]'&&node.dataset.psySaveMessage!==undefined)return node;if(node.selector===selector)return node;const nested=node.querySelector(selector);if(nested)return nested;}return null;}
 set innerHTML(value){this.markup=value;if(value.includes('data-psy-first')){for(const selector of ['[data-psy-first]','[data-psy-ongoing]']){const node=new Element();node.selector=selector;this.append(node);}}}
}
function fixture(saved={}){
 const phone=new Element(),body=new Element(),right=new Element(),mode=new Element('button'),pet=new Element('button');mode.className='psmsb';right.append(mode,pet);phone.append(right,body);phone.classList.add('en-on');
 let api,saves=0,failed=false,firstConfig,ongoingConfig,firstState,ongoingState;
 const mounts=[],observers=[];
 const document={createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text}),addEventListener(){},removeEventListener(){}};
 const state={version:1,migrationVersion:1,preparationMigrationVersion:1,first:{questions:{}},ongoing:{fields:{},notes:{},menus:{}},...copy(saved)};
 const context={document,MutationObserver:class{constructor(callback){observers.push(callback);}observe(){}},setTimeout(){return 1;},clearTimeout(){},console,__enPsyApprovedReady:true,__enGet:()=>null,__enKeep:(key,value)=>key==='psy-approved-v1'?state:value,__enShow(){},async __vaultPushNow(){saves++;if(failed)throw Error('save failed');},
  __enMountFirstPsy(host,config){firstConfig=config;firstState=copy(config.state);firstState.route=config.initialPage;mounts.push(['first',config.initialPage]);return {snapshot:()=>copy(firstState),show(page){firstState.route=page;mounts.push(['first',page]);}};},
  __enMountFollowupPsy(host,config){ongoingConfig=config;ongoingState=copy(config.state);ongoingState.route=config.initialPage;mounts.push(['ongoing',config.initialPage]);return {snapshot:()=>copy(ongoingState),show(page){ongoingState.route=page;mounts.push(['ongoing',page]);}};},
  __enPsyBridge:{root:phone,body,snapshot:()=>({first:{},sv:{}}),syncPreparation(){},redraw(){if(api)api.render({v:'tabs'});},openEntry(){api.render({v:'intro'});},exit(){api.render({v:'tabs'});}}
 };
 vm.createContext(context);vm.runInContext(script,context);api=context.__enApprovedPsy;
 return {context,api,phone,right,mode,pet,state,mounts,visit(){phone.classList.remove('en-on');observers.forEach(callback=>callback());phone.classList.add('en-on');observers.forEach(callback=>callback());},fail(value){failed=value;},get saves(){return saves;},get firstConfig(){return firstConfig;},get ongoingConfig(){return ongoingConfig;},get firstState(){return firstState;},get ongoingState(){return ongoingState;}};
}

test('le bouton s’ajoute une fois après Mode séance et garde Plume à sa place',()=>{
 const f=fixture(),button=f.phone.querySelector('[data-psy-form-shortcut]');assert.ok(button);assert.deepEqual(f.right.children,[f.mode,button,f.pet]);assert.equal(button.getAttribute('aria-label'),'Ouvrir mon formulaire psy');
 assert.equal(f.context.__enMountPsyFormShortcut(f.phone,()=>{}),button);assert.equal(button.events.click.length,1);assert.equal(f.right.children.length,3);
 button.click();assert.deepEqual(f.mounts.at(-1),['first','entry']);assert.equal(f.saves,0);
});

test('Plus tard puis le raccourci gardent le suivi choisi, les champs et les relances après rechargement',async()=>{
 const f=fixture({active:'ongoing',ongoing:{fields:{year:'2025'},notes:{reason:'Mes mots'},menus:{reason:['Ma famille']}}});
 f.api.resume();assert.deepEqual(f.mounts.at(-1),['ongoing','main']);f.ongoingState.notes.reason='Mes mots complétés';
 await f.ongoingConfig.onLater();assert.equal(f.state.preferredForm,'ongoing');assert.equal(f.state.ongoing.notes.reason,'Mes mots complétés');
 const restored=fixture(copy(f.state));restored.phone.querySelector('[data-psy-form-shortcut]').click();assert.deepEqual(restored.mounts.at(-1),['ongoing','main']);assert.equal(restored.ongoingState.fields.year,'2025');assert.equal(restored.ongoingState.notes.reason,'Mes mots complétés');assert.deepEqual(restored.ongoingState.menus.reason,['Ma famille']);
});

test('choisir une première séance sans encore répondre reste mémorisé après Plus tard',async()=>{
 const f=fixture();f.api.resume();f.firstState.route='hub';await f.firstConfig.onExit();assert.equal(f.state.preferredForm,'first');
 const restored=fixture(copy(f.state));restored.api.resume();assert.deepEqual(restored.mounts.at(-1),['first','hub']);
});

test('après Plus tard les visites suivantes gardent l’accueil Psy et son bouton de reprise',async()=>{
 const f=fixture({preferredForm:'ongoing'});f.api.resume();await f.ongoingConfig.onLater();assert.equal(f.state.entryDismissed,true);
 const before=f.mounts.length;f.visit();assert.equal(f.mounts.length,before);assert.equal(f.phone.classList.contains('psy-approved-active'),false);
 const restored=fixture(copy(f.state));restored.visit();assert.equal(restored.mounts.length,0);restored.phone.querySelector('[data-psy-form-shortcut]').click();assert.deepEqual(restored.mounts.at(-1),['ongoing','main']);
});

test('un échec d’enregistrement garde le formulaire ouvert avant de reprendre le parcours',async()=>{
 const f=fixture({preferredForm:'first',first:{questions:{topics:{free:'Un brouillon'}}}});f.api.resume();f.firstState.questions.topics.free='Un brouillon complété';const before=f.mounts.length;
 f.fail(true);await f.api.resume();assert.equal(f.mounts.length,before);assert.equal(f.state.first.questions.topics.free,'Un brouillon complété');
 f.fail(false);await f.api.resume();assert.deepEqual(f.mounts.at(-1),['first','hub']);assert.equal(f.firstState.questions.topics.free,'Un brouillon complété');
});

test('après confirmation de première séance le raccourci ouvre uniquement le récapitulatif modifiable',async()=>{
 const f=fixture({preferredForm:'first',first:{questions:{topics:{free:'Des mots confirmés'}}}});f.api.resume();
 await f.firstConfig.onConfirm(copy(f.firstState));assert.equal(f.state.first.confirmed,true);await f.firstConfig.onExit();
 const restored=fixture(copy(f.state));restored.api.resume();assert.deepEqual(restored.mounts.at(-1),['first','recap']);assert.equal(restored.firstConfig.isConfirmed(),true);assert.equal(restored.firstState.questions.topics.free,'Des mots confirmés');
});

test('après confirmation du suivi existant le raccourci ouvre le récapitulatif avec ses dernières modifications',async()=>{
 const f=fixture({preferredForm:'ongoing',ongoing:{fields:{reason:'Mes mots'},notes:{},menus:{}}});f.api.resume();let opened=false;
 await f.ongoingConfig.onConfirm(()=>{opened=true;});assert.equal(opened,true);assert.equal(f.state.ongoing.confirmed,true);
 f.ongoingState.fields.reason='Mes mots modifiés dans le récapitulatif';await f.ongoingConfig.onRecapExit();
 const restored=fixture(copy(f.state));restored.api.resume();assert.deepEqual(restored.mounts.at(-1),['ongoing','recap']);assert.equal(restored.ongoingState.fields.reason,'Mes mots modifiés dans le récapitulatif');
});

test('une confirmation échouée ne transforme pas le brouillon en formulaire terminé',async()=>{
 for(const kind of ['first','ongoing']){
  const f=fixture({preferredForm:kind});f.api.resume();f.fail(true);let opened=false;
  if(kind==='first')await assert.rejects(f.firstConfig.onConfirm(copy(f.firstState)));
  else await f.ongoingConfig.onConfirm(()=>{opened=true;});
  assert.equal(opened,false);assert.equal(f.state[kind].confirmed,undefined);
  assert.equal(f.context.__enPsyModel.resumePage(f.state,kind),kind==='first'?'hub':'main');
 }
});

test('un récapitulatif déjà validé par une ancienne version reste directement accessible',()=>{
 for(const kind of ['first','ongoing']){
  const saved={preferredForm:kind,[kind]:kind==='first'?{route:'recap',questions:{}}:{route:'recap',fields:{},notes:{},menus:{}}};
  const f=fixture(saved);assert.equal(f.state[kind].confirmed,true);f.api.resume();assert.deepEqual(f.mounts.at(-1),[kind,'recap']);
 }
});
