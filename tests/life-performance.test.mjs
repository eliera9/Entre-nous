import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../ma-vie-pages.js',import.meta.url),'utf8');
const enrollment=readFileSync(new URL('../inscription-reprise.js',import.meta.url),'utf8');
const slice=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));

test('les icônes de Faire connaissance ne redessinent ni les SVG existants ni les autres pages',()=>{
 const context={window:{}};vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('window.__enGroupedLifeData=')),context);
 let replacements=0,scans=0;const existing={type:'svg'};
 const placeholder={getAttribute:()=> 'chevron-down',attributes:[{name:'aria-hidden',value:'true'}],replaceWith(node){replacements++;assert.equal(node.icon[1]['aria-hidden'],'true');}};
 context.lucide={icons:{ChevronDown:['svg',{},[]]},createElement:icon=>({icon}),createIcons(){throw Error('global scan');}};
 const root={querySelectorAll(selector){assert.equal(selector,'i[data-lucide]');scans++;return replacements?[]:[placeholder];},existing};
 assert.equal(context.window.__enLifeIcons(root),1);assert.equal(context.window.__enLifeIcons(root),0);assert.equal(replacements,1);assert.equal(root.existing,existing);assert.equal(scans,2);
});

class Node{
 constructor(tag='div'){this.tag=tag;this.children=[];this.attrs={};this.events={};this.hidden=false;}
 append(...nodes){this.children.push(...nodes);}
 setAttribute(key,value){this.attrs[key]=String(value);}
 getAttribute(key){return this.attrs[key]??null;}
 addEventListener(type,fn){(this.events[type]||=[]).push(fn);}
 fire(type,event={}){for(const fn of this.events[type]||[])fn(event);}
 focus(){this.focused=true;}
 querySelectorAll(){return this.children.filter(node=>node.tag==='button'&&!node.disabled);}
 querySelector(selector){return this.querySelectorAll().find(node=>selector==='[aria-pressed="true"]'?node.attrs['aria-pressed']==='true':true)||null;}
}
test('cent reconstructions de menus gardent un seul écouteur et ferment seulement les menus ouverts',()=>{
 const handlers=[],openDropdowns=new Set(),connected=new Set();
 const env={openDropdowns,root:{contains:menu=>connected.has(menu)},docListener(type,fn){assert.equal(type,'click');handlers.push(fn);},el:tag=>new Node(tag),button:()=>new Node('button'),icon:()=>new Node('i'),nextId:0,document:{}};
 const shared=slice(" docListener('click',event=>{"," class GroupedResizeObserver");
 const dropdown=slice(' function dropdown(', ' function timeFields(');
 const create=new Function('env','with(env){'+shared+dropdown+';return dropdown;}')(env);
 let last;
 for(let i=0;i<100;i++){
  const holder=new Node();last=create(holder,{label:'Idées',options:[{id:'a',label:'A'},{id:'b',label:'B'}],selected:[],multiple:true,keepOpen:true,onChange(values){env.values=values;}});
  const menu=holder.children[1];connected.add(menu);last.open();connected.delete(menu);
  handlers[0]({composedPath:()=>[last.trigger]});assert.equal(openDropdowns.size,0);
 }
 assert.equal(handlers.length,1);
 const holder=new Node();const menu=create(holder,{label:'Idées',options:[{id:'a',label:'A'},{id:'b',label:'B'}],selected:[],multiple:true,keepOpen:true,onChange(values){env.values=values;}});
 connected.add(holder.children[1]);menu.open();handlers[0]({composedPath:()=>[],ecOpenMenuTriggers:[menu.trigger]});assert.equal(menu.trigger.attrs['aria-expanded'],'true');
 const list=holder.children[1].children[0];list.children[0].fire('click');list.children[1].fire('click');assert.deepEqual(env.values,['a','b']);assert.equal(openDropdowns.size,1);
 handlers[0]({composedPath:()=>[]});assert.equal(openDropdowns.size,0);assert.equal(menu.trigger.attrs['aria-expanded'],'false');
 menu.open();holder.fire('keydown',{key:'Escape',stopPropagation(){}});assert.equal(openDropdowns.size,0);assert.ok(menu.trigger.focused);
});

test('un brouillon préparé une fois reste sauvegardable après un échec et reçoit les nouvelles saisies',async()=>{
 const dirtyNumbers=new Set(['001']),dirtyCategories=new Set(['family']),stored={drafts:{}},STATE={answers:{'001':{text:'Mes mots'}},people:{family:{text:'Une relance'}}};
 let conversions=0,peopleSnapshots=0,saves=0;
 const env={dirtyNumbers,dirtyCategories,personSnapshots:{family(){peopleSnapshots++;}},STORE:{writeGeneric(stored,state,app,number){conversions++;stored.drafts[number]={detail:state.answers[number].text};}},config:{stored,async save(){saves++;if(saves===1)throw Error('disk');}},STATE,APP:{},writePeople(){stored.drafts.family={detail:STATE.people.family.text};},clearTimeout(){},saveTimer:null,saveQueue:Promise.resolve(),photoReads:new Set(),showSaveStatus(){}};
 const snapshot=slice(' function snapshot(){',' function writePeople('),persist=slice(' function persistDraft(){',' const nodeVisible=');
 const api=new Function('env','with(env){'+snapshot+persist+';return {snapshot,persistDraft};}')(env);
 assert.equal(await api.persistDraft(),false);assert.equal(dirtyNumbers.size,0);assert.equal(dirtyCategories.size,0);assert.equal(stored.drafts['001'].detail,'Mes mots');
 assert.equal(await api.persistDraft(),true);assert.equal(conversions,1);assert.equal(peopleSnapshots,1);assert.equal(stored.drafts.family.detail,'Une relance');
 STATE.answers['001'].text='Mes mots complétés';dirtyNumbers.add('001');assert.equal(await api.persistDraft(),true);assert.equal(conversions,2);assert.equal(peopleSnapshots,1);assert.equal(stored.drafts['001'].detail,'Mes mots complétés');assert.equal(stored.pagesV2,STATE);
});

test('la saisie de l’inscription ne convertit pas le formulaire entier mais la sauvegarde finale le fait',()=>{
 const events={},progress={active:true},identity={name:'Alex'},document={getElementById:id=>id==='o2in'?{value:identity.name}:null,querySelector:()=>({id:'mv3'}),querySelectorAll:()=>[],addEventListener(type,fn){events[type]=fn;}};
 let snapshots=0,changes=0;
 const context={document,TextEncoder,TextDecoder,__enEnrollmentState:()=>progress,__enCaptureLifeDraft:()=>snapshots++,__enEnrollmentChanged:()=>changes++,addEventListener(){}};vm.createContext(context);vm.runInContext(enrollment,context);context.__enInitEnrollmentUI();
 for(let i=0;i<20;i++){identity.name+='a';events.input({target:{closest:()=>null}});}
 assert.equal(changes,20);assert.equal(snapshots,0);assert.equal(progress.identity.name,identity.name);
 context.__enCaptureEnrollment();assert.equal(snapshots,1);
 document.hidden=true;events.visibilitychange();assert.equal(snapshots,2);
});
