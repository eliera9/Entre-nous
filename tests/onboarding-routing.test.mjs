import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const start=html.indexOf("(function(){const o=document.getElementById('onb'),src="),end=html.indexOf('</script>',start);
const controller=html.slice(start,end);
function fixture(){
 const nodes={},routes=[],timers=[];let left=0;
 function node(id){return nodes[id]||=( {id,value:'Exemple',dataset:{},hidden:true,style:{getPropertyValue(){return ''},setProperty(){}},classList:{contains(name){return id==='onb'&&name==='en-on'&&!routes.length},toggle(){}},setAttribute(){},toggleAttribute(){},addEventListener(name,fn){this.listeners||={};this.listeners[name]=fn},querySelectorAll(){return []},click(){return this.onclick?.()},getBoundingClientRect(){return {left:0}}} )}
 const document={getElementById:node,querySelector:()=>node('obar'),querySelectorAll:()=>[node('dot0'),node('dot1'),node('dot2')]};
 const window={__enSetAuthLayout(){},__enInitCode(){return {ready:true,busy:false,leave(){left++},enter(){},continue(){}}},__enShow:id=>routes.push(id),__tourStart(){throw Error('visite automatique interdite')}};
 const context={document,window,MutationObserver:class{observe(){}},setTimeout(fn){timers.push(fn)}};runInNewContext(controller,context);
 return {nodes,node,window,document,routes,timers,context,get left(){return left}};
}
test('Plus tard après le code ouvre directement Faire connaissance, une seule fois',()=>{
 const f=fixture();f.node('o1guest').onclick();f.node('ogo').onclick();f.node('o3later').onclick();f.node('o3later').onclick();assert.deepEqual(f.routes,['mvintro']);assert.equal(f.left,1);assert.equal(f.node('o3on').onclick,undefined);
});
test('une activation Face ID réussie rejoint aussi Faire connaissance sans page de visite',async()=>{
 const f=fixture();let enrolled=0;f.window.__fidOk=async()=>true;f.window.__fidEnroll=async()=>{enrolled++};
 const begin=html.indexOf("(function(){const on=document.getElementById('o3on');if(!on)return;const b=on.closest('.o3b');"),finish=html.indexOf('})();',begin)+5;
 const face=f.node('o3on');face.closest=()=>null;face.classList.add=()=>{};
 runInNewContext(html.slice(begin,finish),f.context);
 await face.listeners.click({stopImmediatePropagation(){},preventDefault(){}});f.timers.forEach(fn=>fn());assert.equal(enrolled,1);assert.deepEqual(f.routes,['mvintro']);
});
test('la page supprimée et la visite différée ne font plus partie de l’inscription',()=>{
 assert.equal(html.includes('id="o4skip"'),false);assert.equal(html.includes('class="ost o4"'),false);assert.equal(html.includes('__enTourLater'),false);assert.ok(html.includes("if(e.target.closest('#tourtog'))window.__tourStart()"));assert.ok(html.includes('id="mvintro"'));
});
