import test from 'node:test';
import assertStrict from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const controller=readFileSync(new URL('../psy-approved.js',import.meta.url),'utf8');
const first=readFileSync(new URL('../psy-premiere-validee.js',import.meta.url),'utf8');
const ongoing=readFileSync(new URL('../psy-suivi-valide.js',import.meta.url),'utf8');
const helper=controller.slice(controller.indexOf(' /* En-tête des questions :'),controller.indexOf(' if(!global.document)return;'));
function verifyHeaderNavigation(){

class Element{
 constructor(tag){this.tagName=tag.toUpperCase();this.className='';this.children=[];this.attributes={};this.dataset={};this.events={};this.style={setProperty:(key,value)=>this.style[key]=value};this.textContent='';this.parentElement=null;this.hidden=false;this.classList={add:(...names)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...names])].join(' ');},remove:(...names)=>{this.className=this.className.split(' ').filter(x=>!names.includes(x)).join(' ');},contains:name=>this.className.split(' ').includes(name),toggle:(name,force)=>{const has=this.className.split(' ').includes(name),next=force===undefined?!has:force;next?this.classList.add(name):this.classList.remove(name);return next;}};}
 append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
 prepend(node){node.parentElement=this;this.children.unshift(node);}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(key,value){this.attributes[key]=String(value);}
 getAttribute(key){return this.attributes[key]??null;}
 removeAttribute(key){delete this.attributes[key];}
 addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
 click(){for(const fn of this.events.click||[])fn();}
 focus(){this.focused=true;}
 scrollIntoView(){this.scrolled=true;}
 closest(selector){for(let el=this;el;el=el.parentElement)if(selector[0]==='#'?el.id===selector.slice(1):el.className.split(' ').includes(selector.slice(1)))return el;return null;}
 set innerHTML(value){this.markup=value;this.children=[];for(const action of ['back','home']){const button=new Element('button');button.setAttribute('data-action',action);this.append(button);}}
 querySelector(selector){const match=el=>{const a=selector.match(/^\[([^=]+)="([^"]+)"\]$/);if(a)return el.getAttribute(a[1])===a[2];return selector[0]==='.'?el.className.split(' ').includes(selector.slice(1)):el.tagName.toLowerCase()===selector;};for(const node of this.children){if(match(node))return node;const found=node.querySelector(selector);if(found)return found;}return null;}
}
const document={createElement:tag=>new Element(tag)};
function assert(value,message){if(!value)throw Error(message);}


const global={};(new Function('global',helper))(global);
const parent=new Element('section');let backs=0,homes=0;
const heading=global.__enMountPsyQuestionHeader(parent,{document,journey:'Ma première séance',title:'Ce que je traverse',intro:'Une introduction conservée',position:0,total:5,onBack:()=>backs++,onHome:()=>homes++});
assert(parent.children[0]===heading.node,'Header is first');
assert(heading.node.querySelector('.np-title').textContent==='Ce que je traverse','Title');
assert(heading.node.querySelector('.np-chapter').textContent==='Ma première séance','Journey');
assert(heading.node.querySelector('.np-position').textContent==='Page 1 sur 5','Initial page');
assert(heading.node.querySelector('.np-progress').children.length===5,'Five segments');
heading.update({position:3,completed:[true,false,false,false,false]});
assert(heading.node.querySelector('.np-position').textContent==='Page 4 sur 5','Updated page');
assert(heading.node.querySelector('.np-progress').getAttribute('aria-valuenow')==='4','Accessible position');
assert(heading.node.querySelector('.np-progress').children.filter(x=>x.classList.contains('is-current')).length===2,'Current and completed pages');
heading.backButton.click();heading.homeButton.click();assert(backs===1&&homes===1,'Distinct navigation');
heading.update({position:99,total:2});assert(heading.node.querySelector('.np-position').textContent==='Page 2 sur 2','Bounded position');
heading.update({intro:''});assert(heading.node.querySelector('.fq-dialogue').hidden,'Empty introduction hidden');
const paper=new Element('section'),header=global.__enMountPsyQuestionHeader(paper,{document,journey:'J’ai déjà un suivi',total:5,onBack(){},onHome(){}});
const headingCode=ongoing.slice(ongoing.indexOf('  function hideQuestionHeader()'),ongoing.indexOf('  const showStep ='));
const route=new Function('paper','questionHeader',headingCode+';return {renderQuestionHeader,hideQuestionHeader};')(paper,header);
for(const [key,step,page] of [['commencement',1,1],['commencement',2,2],['parcours',1,3],['present',1,4],['next',1,5]]){
 route.renderQuestionHeader(key,step);assert(header.node.querySelector('.np-position').textContent==='Page '+page+' sur 5','Ongoing page '+key+step);assert(!header.node.hidden,'Question header visible');
}
route.hideQuestionHeader();assert(header.node.hidden&&!paper.classList.contains('psy-question-page'),'Recap and overview retain original header');
let saveCallback=null,lastRoute=null,backClicks=0;
const host=new Element('div'),oldBack=new Element('button');oldBack.setAttribute('data-back','');oldBack.addEventListener('click',()=>backClicks++);host.append(oldBack);
host.querySelector=selector=>selector==='[data-back]'?oldBack:null;
const env={document,chapterInfo:[['traverse','Ce que je traverse']],chapterRows:new Map(),questionHeaders:new Map(),config:{onSaveThen:fn=>saveCallback=fn},path:['entry','traverse'],show:(id)=>lastRoute=id,host,app:new Element('div'),pages:new Element('main'),screens:new Map(),globalThis:global,el:(tag,cls,text)=>{const node=new Element(tag);node.className=cls;node.textContent=text;return node;}};
const createCode=first.slice(first.indexOf('function createScreen('),first.indexOf('function ensureScreen('));
const create=new Function('env','with(env){'+createCode+';return createScreen;}')(env);
const screen=create('traverse','Ce que je traverse','Mon introduction');
assert(screen.classList.contains('psy-question-page'),'Native layout on first route');
const firstHeading=env.questionHeaders.get('traverse');firstHeading.homeButton.click();assert(!!saveCallback&&lastRoute===null,'Home waits for save');saveCallback();assert(lastRoute==='hub','Home returns to rubrics after save');firstHeading.backButton.click();assert(backClicks===1,'Back uses existing route history');
return {headerChecks:10,ongoingPages:5,firstNavigationChecks:4};

}
test('les en-têtes Psy conservent la pagination, le retour et la sauvegarde avant de revenir aux rubriques',()=>{
 assertStrict.deepEqual(verifyHeaderNavigation(),{headerChecks:10,ongoingPages:5,firstNavigationChecks:4});
});
