import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runInNewContext} from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=html.indexOf('/* Couleur visible au-dessus de la page'),end=html.indexOf('function viewportBounds()',start);
const code=html.slice(start,end);
function fixture(){
 const classes=new Set();const node=(type,bg)=>({nodeType:1,type,bg,style:{backgroundColor:''},classList:{contains:c=>type==='root'?classes.has(c):false},matches:s=>type==='app'?s.includes('#en-app'):type==='phone'?s.includes('.phone'):type==='lock'?s.includes('#en-lock'):false});
 const root=node('root'),body=node('body'),app=node('app'),phone=node('phone','rgb(255, 248, 243)'),lock=node('lock','rgb(42, 30, 38)'),meta={content:''};let showingLock=false,lockOut=false,observer;const events={},frames=[];
 lock.classList.contains=c=>c==='out'&&lockOut;
 const document={documentElement:root,body,hidden:false,querySelector:s=>s.startsWith('#en-app')?phone:meta,getElementById:id=>id==='en-app'?app:id==='en-lock'&&showingLock?lock:null,addEventListener:(name,fn)=>events[name]=fn};
 const win={};runInNewContext(code,{window:win,document,getComputedStyle:e=>({backgroundColor:e.bg}),requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},MutationObserver:class{constructor(fn){observer=fn}observe(){}},addEventListener:(name,fn)=>events[name]=fn});
 const flush=()=>{for(const fn of frames.splice(0))fn();};flush();return{win,root,body,app,phone,lock,meta,classes,events,frames,flush,mutate:target=>observer([{type:'attributes',target}]),lockOn:()=>{showingLock=true},lockOut:()=>{lockOut=true}};
}
test('le fond de page, la zone haute et la couleur système sont identiques',()=>{
 const f=fixture();for(const node of[f.root,f.body,f.app])assert.equal(node.style.backgroundColor,f.phone.bg);assert.equal(f.meta.content,f.phone.bg);
});
test('un changement de thème sur la racine resynchronise la couleur',()=>{
 const f=fixture();f.classes.add('en-nuit');f.phone.bg='rgb(42, 30, 38)';f.mutate(f.root);f.flush();
 assert.equal(f.body.style.backgroundColor,f.phone.bg);assert.equal(f.app.style.backgroundColor,f.phone.bg);assert.equal(f.meta.content,f.phone.bg);
});
test('le retour après verrouillage et le chargement des styles corrigent le fond',()=>{
 const f=fixture();f.phone.bg='rgb(245, 224, 211)';f.events.pageshow();f.flush();assert.equal(f.meta.content,f.phone.bg);
 f.phone.bg='rgb(255, 248, 243)';f.events.load({target:{matches:()=>true}});f.flush();assert.equal(f.app.style.backgroundColor,f.phone.bg);
 f.phone.bg='rgb(42, 30, 38)';f.events.visibilitychange();f.flush();assert.equal(f.body.style.backgroundColor,f.phone.bg);
});
test('le code prend sa couleur puis rend la main à la page ouverte',()=>{
 const f=fixture();f.lockOn();f.win.__enSyncChrome();assert.equal(f.meta.content,f.lock.bg);
 f.lockOut();f.win.__enSyncChrome();assert.equal(f.meta.content,f.phone.bg);
});
test('plusieurs changements pendant la même image ne bouclent pas',()=>{
 const f=fixture();f.mutate(f.root);f.mutate(f.phone);f.mutate(f.body);assert.equal(f.frames.length,1);f.flush();assert.equal(f.frames.length,0);
});
test('le code conserve Bonjour et Bonsoir suivis du prénom du carnet',()=>{
 const a=html.indexOf(' el.innerHTML=`',html.indexOf('function lockUI(')),b=html.indexOf('`;\n document.body.appendChild(el)',a);
 const template=html.slice(a+' el.innerHTML='.length,b+1);
 const render=new Function('nuit','nm','meta','onFid','mo','sa','J','d','MO','return '+template);
 const date={getDay:()=>4,getDate:()=>5,getMonth:()=>10};
 const args=[{},null,'soir','automne',['','','','','jeudi'],date,Array.from({length:12},(_,i)=>i===10?'novembre':'')];
 assert.match(render(true,' Camille',...args),/Bonsoir, Camille<\/p>/);assert.match(render(false,' Camille',...args),/Bonjour, Camille<\/p>/);
 assert.match(render(true,'',...args),/>Bonsoir<\/p>/);assert.ok(!template.includes('Te revoilà'));
});
test('l’accueil du code reprend l’appellation explicitement vérifiée dans le formulaire',async()=>{
 const saveCode=html.slice(html.indexOf('function save(force){'),html.indexOf('setInterval(()=>{if(DEK)save()}'));
 const records=[];let verified=true;
 const save=runInNewContext(`let DEK={},W={code:{}},META={nm:'Prénom initial'},M={ls:{}},last='',dirty=true,saving=null;${saveCode};save`,{
  snapshot:()=>({'lifeform-approved-v1':{answers:{surnom:{state:'answered',verified,rows:[{name:'Camille'}]}}}}),
  seal:async()=>({}),dbPut:async(key,record)=>records.push(record),KEY:'v1',CLOUD:{push(){}},setTimeout:()=>0,
  document:{createElement:()=>({setAttribute(){},remove(){}}),body:{appendChild(){}}}
 });
 await save(true);assert.equal(records.at(-1).nm,'Camille');verified=false;await save(true);assert.equal(records.at(-1).nm,'Prénom initial');
});

test('un voile de fenêtre est composé avec le fond de la page, y compris les couleurs CSS modernes',()=>{
 const {chromeVisibleBackground}=runInNewContext(code+';({chromeVisibleBackground})',{window:{},document:{documentElement:{},body:{},querySelector:()=>null,getElementById:()=>null,addEventListener(){},elementsFromPoint:()=>[veil,phone]},getComputedStyle:e=>e.css,requestAnimationFrame:()=>1,MutationObserver:class{observe(){}},addEventListener(){}});
 const phone={getBoundingClientRect:()=>({left:0,top:32,width:390}),contains:()=>true};
 const veil={css:{backgroundColor:'color(srgb 0.2 0.1 0.15 / 0.3)',opacity:'1'},parentElement:phone};
 // Les objets sont fournis par la fermeture de la fonction simulant le hit-test.
 assert.equal(chromeVisibleBackground(phone,'rgb(245, 224, 211)'),'rgb(187, 164, 159)');
 veil.css.backgroundColor='rgb(42, 30, 38)';assert.equal(chromeVisibleBackground(phone,'rgb(245, 224, 211)'),'rgb(42, 30, 38)');
 veil.css.opacity='0';assert.equal(chromeVisibleBackground(phone,'rgb(245, 224, 211)'),'rgb(245, 224, 211)');
});

test('la zone système iOS ne réduit pas la hauteur du carnet, même si un champ est encore focalisé',()=>{
 const start=html.indexOf('function keyboardViewport('),end=html.indexOf('if(window.visualViewport){',start);
 const source=html.slice(start,end),values=new Map([['--en-viewport-height','797px'],['--en-viewport-top','47px']]);
 const root={clientHeight:844,style:{setProperty:(key,value)=>values.set(key,value),removeProperty:key=>values.delete(key)}};
 const document={documentElement:root,activeElement:{tagName:'BODY'}},viewport={height:797,offsetTop:47,scale:1};
 const {viewportBounds}=runInNewContext(source+';({viewportBounds})',{window:{visualViewport:viewport},document,innerHeight:844});
 viewportBounds();assert.equal(values.size,0);
 document.activeElement={tagName:'INPUT'};viewportBounds();assert.equal(values.size,0);
 viewport.height=460;viewportBounds();assert.equal(values.get('--en-viewport-height'),'460px');assert.equal(values.get('--en-viewport-top'),'47px');
 viewport.height=797;viewportBounds();assert.equal(values.size,0);
});

test('le zoom et la barre du navigateur ne sont pas pris pour un clavier',()=>{
 const start=html.indexOf('function keyboardViewport('),end=html.indexOf('function viewportBounds()',start);
 const {keyboardViewport}=runInNewContext(html.slice(start,end)+';({keyboardViewport})');
 assert.equal(keyboardViewport({height:690,offsetTop:47,scale:1},844,false),null);
 assert.equal(keyboardViewport({height:400,offsetTop:100,scale:2},844,true),null);
 const landscape=keyboardViewport({height:210,offsetTop:0,scale:1},390,true);
 assert.equal(landscape.height,210);assert.equal(landscape.top,0);
});
