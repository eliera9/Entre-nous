import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../psy-approved.js',import.meta.url),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
function model(){const context=vm.createContext({});vm.runInContext(script,context);return context.__enPsyModel;}
test('Psy suit les activités explicitement déclarées sans supposer des études ou un travail',()=>{
 const {activityFromLife}=model(),read=selected=>plain(activityFromLife({pagesV2:{answers:{'007':{selected}}}})).activities;
 assert.deepEqual(read(['0']),['work']);assert.deepEqual(read(['1']),['studies']);assert.deepEqual(read(['0','1']),['work','studies']);assert.deepEqual(read(['3']),['pause']);assert.deepEqual(read(['2']),['seeking']);assert.deepEqual(read(['0','3']),[]);assert.deepEqual(plain(activityFromLife()).activities,[]);
});
test('une réponse refusée ou importée sans vérification ne devient pas du contexte Psy',()=>{
 const {activityFromLife}=model();for(const flags of [{declined:true},{imported:true,verified:false}]){const life={pagesV2:{answers:{'007':{selected:['0'],...flags}}},answers:{trav:{selected:['Je travaille']}}};assert.deepEqual(plain(activityFromLife(life)).activities,[]);}
 assert.deepEqual(plain(activityFromLife({pagesV2:{answers:{'008':{fields:{title:'Ancien emploi'}}}}})).activities,[]);
});
test('les brouillons et les réponses de branches refermées survivent à un nouvel instantané',()=>{
 const {mergeSnapshot}=model();const previous={questions:{'person:1':{selected:['a'],drafts:[['a','Mes mots']]}},notes:{'03:a':'Un détail'},menus:{'03-a':['Une idée']}};
 const next=plain(mergeSnapshot(previous,{questions:{topics:{selected:['family']}},notes:{'04:b':'Autre détail'},menus:{'04-b':['Un ressenti']}}));
 assert.equal(next.questions['person:1'].drafts[0][1],'Mes mots');assert.deepEqual(next.menus['03-a'],['Une idée']);assert.equal(next.notes['03:a'],'Un détail');assert.deepEqual(previous.questions['person:1'].selected,['a']);
});
test('le mode séance reçoit seulement les réponses choisies, leurs notes et le champ libre',()=>{
 const {preparationText}=model();const output=plain(preparationText({questions:{pratique:{question:'Mes questions',entries:[{id:'a',answer:'Le tarif ?'},{id:'b',answer:'La durée ?'}],selected:['a'],drafts:[['a','Réponse conservée'],['b','Brouillon masqué']],free:'Une autre question'}}}));
 assert.equal(output[0].text,'Le tarif ? — Réponse conservée\nUne autre question');assert.equal(output[0].text.includes('Brouillon masqué'),false);
});
test('la reprise conserve les anciens écrits et ne confond pas la dernière séance avec les attentes',()=>{
 const old={first:{p:{pq_th:['Ma famille'],pq_a:'Des mots déjà écrits',pr_own:['Ma question'],hi_tl:[{y:'2020',t:'Un repère'}]}},sv:{mo:'Juillet',an:'2025',why:'Mon contexte',dm:'octobre',dj:'10',ab:'Des sujets'}};const initial=plain(old),live={};
 const context={document:{addEventListener(){}},MutationObserver:class{observe(){}},__enPsyApprovedReady:true,__enGet:()=>null,__enKeep:(key,value)=>(live[key]||=value),__enShow(){},__enPsyBridge:{root:{classList:{contains:()=>false}},body:{},snapshot:()=>old,redraw(){}}};vm.createContext(context);vm.runInContext(script,context);
 const saved=plain(context.__enApprovedPsy.getState());assert.deepEqual(old,initial);assert.deepEqual(saved.legacyArchive,initial);assert.match(saved.first.questions.topics.free,/Ma famille/);assert.equal(saved.first.timeline[0].label,'Un repère');assert.equal(saved.ongoing.fields['psyf-qtc-year'],'2025');assert.equal(saved.ongoing.fields['psyf-qtc-hopes'],undefined);assert.equal(saved.first.questions.pratique.free,'Ma question');
});
test('les nouveaux parcours et leurs assets sont publiés et disponibles hors ligne',()=>{
 const root=new URL('../',import.meta.url),index=readFileSync(new URL('index.html',root),'utf8'),sw=readFileSync(new URL('sw.js',root),'utf8'),build=readFileSync(new URL('scripts/build.mjs',root),'utf8');
 for(const file of ['psy-approved.js','psy-premiere-validee.js','psy-suivi-valide.js','psy-suivi-recap.js','psy-approved.css','vendor/lucide.min.js']){assert.ok(index.includes(file));assert.ok(sw.includes(file));assert.ok(build.includes(file));}
 for(const file of ['psy-premiere-validee.js','psy-suivi-valide.js','psy-suivi-recap.js']){const source=readFileSync(new URL(file,root),'utf8');assert.equal(source.includes("activities: ['work']"),false);assert.equal(source.includes('demo-added:'),false);new vm.Script(source);}
});
test('les icônes Psy se dessinent une seule fois sans reparcourir toute l’application',()=>{
 const context=vm.createContext({});vm.runInContext(script,context);let drawing=0,globalScans=0,replaced=false;
 context.lucide={icons:{ChevronLeft:['svg',{},[]]},createElement(icon){drawing++;return {icon};},createIcons(){globalScans++;}};
 const node={getAttribute:()=> 'chevron-left',attributes:[{name:'data-lucide',value:'chevron-left'}],replaceWith(){replaced=true;}},root={querySelectorAll(selector){assert.equal(selector,'i[data-lucide]');return replaced?[]:[node];}};
 assert.equal(context.__enPsyIcons(root),1);assert.equal(context.__enPsyIcons(root),0);assert.equal(drawing,1);assert.equal(globalScans,0);
});
test('Psy ne construit aucun formulaire quand sa page est encore fermée',()=>{
 let mounts=0;const context={document:{addEventListener(){}},MutationObserver:class{observe(){}},__enPsyApprovedReady:true,__enGet:()=>null,__enKeep:(key,value)=>value,__enShow(){},__enMountFirstPsy(){mounts++;},__enPsyBridge:{root:{classList:{contains:()=>false}},body:{},snapshot:()=>({first:{p:{}},sv:{}}),redraw(){}}};vm.createContext(context);vm.runInContext(script,context);assert.equal(context.__enApprovedPsy.render({v:'intro'}),false);assert.equal(mounts,0);
});
test('ouvrir Psy pour un suivi existant conserve le mode et les réponses enregistrées',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8'),body=html.match(/openEntry\(\)\{(S\.stack=\[\{v:'intro'\}\];render\(1\))\}/)?.[1];assert.ok(body);
 const S={mode:'vide',stack:[],first:{p:{pq_a:'Un écrit conservé'}},sv:{why:'Un contexte conservé'},notes:[{t:'Une note'}]};let rendered=0;vm.runInNewContext(body,{S,render(){rendered++;}});assert.equal(rendered,1);assert.equal(S.mode,'vide');assert.equal(S.first.p.pq_a,'Un écrit conservé');assert.equal(S.sv.why,'Un contexte conservé');assert.equal(S.notes[0].t,'Une note');assert.equal(S.stack[0].v,'intro');
});

test('la version GitHub précédente conserve choix, relances, questions personnelles et repères',()=>{
 const previous={questions:{topics:{selected:['family'],drafts:{},free:'Mes mots'},'person:role:mother':{selected:['0','1'],drafts:{0:'Une précision',1:'Un brouillon'},promptByAnswer:{0:'Mon ancien lien'},free:'Mon texte'},pratique:{selected:['custom:abc'],drafts:{'custom:abc':'Sa réponse'},customEntries:[{id:'custom:abc',answer:'Ma question',prompt:'Ma question'}]}},history:[{id:'one',period:'2020',label:'Mon repère'}],freeUnknown:'À retrouver',confirmed:true};
 const original=plain(previous),imported=plain(model().importPreparation(previous));
 assert.deepEqual(previous,original);assert.deepEqual(imported.questions.topics.selected,['family']);assert.deepEqual(imported.questions['person:role:mother'].drafts,[['0','Une précision'],['1','Un brouillon']]);assert.equal(imported.questions['person:role:mother'].entries[0].prompt,'Mon ancien lien');assert.equal(imported.questions.pratique.custom[0].custom,true);assert.equal(imported.timeline[0].label,'Mon repère');assert.equal(imported.unknown,'À retrouver');
 const existing={version:1,first:{questions:{topics:{free:'Une réponse plus récente'}}},ongoing:{fields:{},notes:{},menus:{}},migrationVersion:1},live={};
 const context={document:{addEventListener(){}},MutationObserver:class{observe(){}},__enPsyApprovedReady:true,__enGet:()=>null,__enKeep:(key,value)=>(live[key]||=(key==='psy-approved-v1'?plain(existing):key==='psy-preparation-v1'?plain(previous):value)),__enShow(){},__enPsyBridge:{root:{classList:{contains:()=>false}},body:{},snapshot:()=>({}),redraw(){}}};vm.createContext(context);vm.runInContext(script,context);
 const saved=plain(context.__enApprovedPsy.getState());assert.equal(saved.first.questions.topics.free,'Une réponse plus récente');assert.equal(saved.first.questions.pratique.drafts[0][1],'Sa réponse');assert.deepEqual(saved.preparationArchive,original);assert.equal(saved.preparationMigrationVersion,1);assert.deepEqual(plain(live['psy-preparation-v1']),original);
});
