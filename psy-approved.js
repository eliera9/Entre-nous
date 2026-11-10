/* Parcours Psy validés : même coffre, mêmes personnes, aucun profil de démonstration. */
(function (global) {
 'use strict';
 const clone=value=>JSON.parse(JSON.stringify(value));
 const usable=value=>value&&!value.declined&&!(value.imported&&value.verified===false);
 function activityFromLife(life={}) {
  const record=life.pagesV2?.answers?.['007'];let activities=[];
  if(usable(record)) activities=(record.selected||[]).flatMap(value=>({0:['work'],1:['studies'],2:['seeking'],3:['pause'],4:['other']}[String(value)]||[]));
  if(!record){const draft=life.drafts?.trav,old=draft?.selected?.length?draft:life.answers?.trav||draft;if(usable(old))for(const label of old.selected||[]){if(/travaille|en emploi/i.test(label))activities.push('work');if(/étud|formation/i.test(label))activities.push('studies');if(/recherche|cherche ma voie/i.test(label))activities.push('seeking');if(/pause/i.test(label))activities.push('pause');}}
  if(activities.some(value=>['pause','seeking','other'].includes(value))&&activities.some(value=>['work','studies'].includes(value)))activities=[];return {activities:[...new Set(activities)]};
 }
 function preparationText(first={}) {
  return Object.entries(first.questions||{}).map(([key,q])=>{
   const selected=new Set(q.selected||[]),drafts=new Map(q.drafts||[]);
   const lines=(q.entries||[]).filter(entry=>selected.has(entry.id)).map(entry=>[entry.answer,drafts.get(entry.id)].filter(Boolean).join(' — '));
   if(q.free?.trim())lines.push(q.free.trim());
   return {key,title:q.question||key,text:lines.join('\n')};
  }).filter(item=>item.text);
 }
 function mergeSnapshot(previous,next){return {...previous,...next,questions:{...previous.questions,...next.questions},fields:{...previous.fields,...next.fields},notes:{...previous.notes,...next.notes},menus:{...previous.menus,...next.menus}};}
 function importPreparation(previous={}){
  const first={questions:{},timeline:clone(previous.history||[]),unknown:String(previous.freeUnknown||'')};
  for(const [key,value] of Object.entries(previous.questions||{})){
   const custom=clone(value.customEntries||[]).map(entry=>({...entry,custom:true}));
   const entries=new Map(custom.map(entry=>[String(entry.id),entry]));
   for(const [id,prompt] of Object.entries(value.promptByAnswer||{}))entries.set(id,{...entries.get(id),id,prompt});
   first.questions[key]={...clone(value),drafts:Array.isArray(value.drafts)?clone(value.drafts):Object.entries(value.drafts||{}),custom,entries:[...entries.values()]};
  }
  return first;
 }
 global.__enPsyModel={activityFromLife,preparationText,mergeSnapshot,importPreparation};
 /* Ne remplacer que les nouvelles icônes du formulaire ouvert, une seule fois. */
 global.__enPsyIcons=function(root,size=16){const library=global.lucide;if(!library||!root)return 0;let count=0;for(const node of root.querySelectorAll('i[data-lucide]')){const name=node.getAttribute('data-lucide').replace(/(^|-)(\w)/g,(_,dash,letter)=>letter.toUpperCase()),icon=library.icons[name];if(!icon)continue;const attrs=Object.fromEntries([...node.attributes].map(attr=>[attr.name,attr.value]));node.replaceWith(library.createElement([icon[0],{...icon[1],...attrs,width:size,height:size},icon[2]]));count++;}return count;};

 /* En-tête des questions : composition commune avec Faire connaissance. */
 global.__enMountPsyQuestionHeader=function(parent,options){
  const doc=options.document||global.document;
  const make=(tag,className,text)=>{const element=doc.createElement(tag);element.className=className;if(text!==undefined)element.textContent=text;return element;};
  const node=make('header','psy-question-header'),top=make('div','fh-top');
  top.innerHTML="<button type=\"button\" class=\"cursor-interaction\" data-action=\"back\" aria-label=\"Retour à Faire connaissance\" data-tooltip=\"Retour à Faire connaissance\"><span><img class=\"day\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODA2Qjc1IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtMTUgNi02IDYgNiA2Ii8+PC9zdmc+\" alt=\"\"><img class=\"night\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQkZBOEI2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtMTUgNi02IDYgNiA2Ii8+PC9zdmc+\" alt=\"\"></span></button><button type=\"button\" class=\"cursor-interaction\" data-action=\"home\" aria-label=\"Enregistrer et revenir à Faire connaissance\" data-tooltip=\"Enregistrer et revenir à Faire connaissance\"><span><img class=\"day\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODA2Qjc1IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCAxMWw4LTYgOCA2TTYgMTB2OWgxMnYtOU0xMCAxOXYtNWg0djUiLz48L3N2Zz4=\" alt=\"\"><img class=\"night\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQkZBOEI2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCAxMWw4LTYgOCA2TTYgMTB2OWgxMnYtOU0xMCAxOXYtNWg0djUiLz48L3N2Zz4=\" alt=\"\"></span></button>";
  const back=top.querySelector('[data-action="back"]'),home=top.querySelector('[data-action="home"]');
  back.classList.add('en-journey-back');back.removeAttribute('data-tooltip');home.removeAttribute('data-tooltip');
  home.setAttribute('aria-label','Enregistrer et revenir aux rubriques');
  back.addEventListener('click',()=>options.onBack());home.addEventListener('click',()=>options.onHome());
  const chapter=make('p','np-chapter'),title=make('h2','np-title'),position=make('p','np-position'),bar=make('div','np-progress');
  position.setAttribute('aria-live','polite');bar.setAttribute('role','progressbar');
  const dialogue=make('div','fq-dialogue'),avatar=make('span','fq-avatar pp-avatar'),intro=make('p','fq-question');
  dialogue.setAttribute('aria-label','Introduction du sujet et compagnon');avatar.setAttribute('role','img');avatar.setAttribute('aria-label',global.__petName||'Ton compagnon');
  const pet=global.__pet||global.__enCompanionState?.selected||'chat',night=!!parent.closest?.('.nuit');
  avatar.style.setProperty('background-image','url("illus/avatars-compagnons/'+pet+'-'+(night?'nuit':'jour')+'.svg")');
  dialogue.append(avatar,intro);node.append(top,chapter,title,position,bar,dialogue);parent.prepend(node);
  let state={journey:'',title:'',intro:'',position:0,total:1,completed:[],backLabel:'Revenir aux rubriques',...options};
  function update(patch={}){
   state={...state,...patch};const total=Math.max(1,Math.trunc(Number(state.total)||1)),index=Math.max(0,Math.min(total-1,Math.trunc(Number(state.position)||0)));
   chapter.textContent=state.journey;title.textContent=state.title;const pageLabel='Page '+(index+1)+' sur '+total;if(position.textContent!==pageLabel)position.textContent=pageLabel;
   back.setAttribute('aria-label',state.backLabel);node.setAttribute('aria-label',state.journey+' — '+state.title);
   intro.textContent=state.intro;dialogue.hidden=!state.intro;bar.replaceChildren();
   for(let i=0;i<total;i++){const tick=make('span',i===index||state.completed?.[i]?'is-current':'');tick.setAttribute('aria-hidden','true');bar.append(tick);}
   bar.setAttribute('aria-label',position.textContent);bar.setAttribute('aria-valuemin','1');bar.setAttribute('aria-valuemax',String(total));bar.setAttribute('aria-valuenow',String(index+1));bar.setAttribute('aria-valuetext',position.textContent);
  }
  update();return {node,backButton:back,homeButton:home,update};
 };

 if(!global.document)return;
 let initialized=false,state,bridge,body,phone,view=null,first=null,ongoing=null,active='',signature='',timer,pending=null,disposed=[];
 const clean=()=>{for(const dispose of disposed)dispose();disposed=[];};
 function scopedDocument(container){return new Proxy(document,{get(target,key){if(key==='getElementById')return id=>container.querySelector('[id="'+String(id).replace(/"/g,'\\"')+'"]')||target.getElementById(id);if(key==='addEventListener')return(type,fn,options)=>{target.addEventListener(type,fn,options);disposed.push(()=>target.removeEventListener(type,fn,options));};const value=target[key];return typeof value==='function'?value.bind(target):value;}});}
 function life(){const value=global.__enGet('lifeform-approved-v1')||{};value.pagesV2||={version:2,answers:{},people:{},lastPage:{},completed:[],seen:{}};value.pagesV2.people||={};for(const category of ['family','friends','partner'])value.pagesV2.people[category]||={selected:[],pools:{},activeId:null};return value;}
 function synchronize(){if(first)state.first=mergeSnapshot(state.first,first.snapshot());if(ongoing)state.ongoing=mergeSnapshot(state.ongoing,ongoing.snapshot());state.active=active;state.updatedAt=Date.now();}
 function status(message,error=false,retryAction=null){let node=view?.querySelector('[data-psy-save-message]');if(!node&&view){node=document.createElement('div');node.dataset.psySaveMessage='';node.setAttribute('role','status');node.className='psy-save-message';view.append(node);}if(node){node.replaceChildren();node.hidden=!message;if(message)node.append(document.createTextNode(message));if(error){const retry=document.createElement('button');retry.type='button';retry.textContent='Réessayer';retry.onclick=()=>retryAction?retryAction():save().catch(()=>{});node.append(retry);}}}
 async function save(){synchronize();clearTimeout(timer);if(pending)await pending.catch(()=>{});const operation=Promise.resolve().then(()=>global.__vaultPushNow());pending=operation;try{await operation;status('');}catch(error){status('Tes mots restent ouverts. L’enregistrement a échoué.',true);throw error;}finally{if(pending===operation)pending=null;}}
 const later=()=>{synchronize();clearTimeout(timer);timer=setTimeout(()=>save().catch(()=>{}),500);};
 async function leave(callback){try{await save();}catch{return;}try{callback();}catch(error){console.error('Ouverture du parcours Psy impossible',error);status('Le formulaire n’a pas pu s’ouvrir. Tes réponses sont conservées.',true,()=>{deactivate();if(bridge.openEntry)bridge.openEntry();else bridge.redraw();});}}
 function chrome(){if(!view)return;const night=phone.classList.contains('nuit');view.style.colorScheme=night?'dark':'light';const selected=global.__pet||global.__enCompanionState?.selected||'chat',name=global.__petName||'ton compagnon';for(const node of view.querySelectorAll('.pp-avatar,.se-avatar,.psyf-avatar')){node.style.setProperty('background-image','url("illus/avatars-compagnons/'+selected+'-'+(night?'nuit':'jour')+'.svg")','important');node.setAttribute('aria-label',name);} }
 function select(kind){active=kind;state.active=kind;view.querySelector('[data-psy-first]').hidden=kind!=='first';view.querySelector('[data-psy-ongoing]').hidden=kind!=='ongoing';chrome();phone.scrollTop=0;}
 function showFirst(page='entry'){if(!first)first=global.__enMountFirstPsy(view.querySelector('[data-psy-first]'),{document:scopedDocument(view.querySelector('[data-psy-first]')),state:state.first,life:life(),initialPage:page,onExit:()=>leave(()=>{deactivate();bridge.exit();}),onOngoing:()=>leave(()=>showOngoing('main')),onNavigate:id=>navigate(id),onPeopleChanged:()=>document.dispatchEvent(new Event('en-life-people-changed')),onSaveThen:callback=>leave(callback),onConfirm:async data=>{state.first=mergeSnapshot(state.first,data);bridge.syncPreparation(preparationText(state.first),state.first);await save();}});else first.show(page);select('first');later();}
 function menu(){let panel=view.querySelector('.psy-floating-menu');if(panel){panel.remove();return;}panel=document.createElement('nav');panel.className='psy-floating-menu';panel.setAttribute('aria-label','Menu');for(const [label,id] of [['Fermer','close'],['Accueil','home'],['Mon journal','mj'],['Faire connaissance','mvfiche'],['Psy','psy']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>{panel.remove();if(id==='psy')leave(()=>showFirst('entry'));else if(id!=='close')navigate(id);};panel.append(button);}view.append(panel);panel.querySelector('button').focus();}
 function showOngoing(page='main'){if(!ongoing)ongoing=global.__enMountFollowupPsy(view.querySelector('[data-psy-ongoing]'),{document:scopedDocument(view.querySelector('[data-psy-ongoing]')),state:state.ongoing,activity:activityFromLife(life()),initialPage:page,onFinish:callback=>leave(()=>{callback();later();}),onExit:()=>leave(()=>showFirst('entry')),onLater:()=>leave(()=>{deactivate();bridge.exit();}),onNavigate:id=>navigate(id),onMenu:menu});else ongoing.show(page);select('ongoing');later();}
 function navigate(id){leave(()=>{deactivate();global.__enShow(id);});}
 function deactivate(){if(!view)return;synchronize();clean();phone.classList.remove('psy-approved-active','psy-question-view');view.remove();view=null;first=null;ongoing=null;active='';signature='';}
 function migrate(){
  const previous=global.__enKeep('psy-preparation-v1',{});if(!state.preparationMigrationVersion){if(previous.questions){state.preparationArchive=clone(previous);const imported=importPreparation(previous);state.first={...imported,...state.first,questions:{...imported.questions,...state.first.questions},timeline:state.first.timeline?.length?state.first.timeline:imported.timeline,unknown:state.first.unknown||imported.unknown};}state.preparationMigrationVersion=1;}
  if(state.migrationVersion)return;const old=bridge.snapshot();state.legacyArchive=clone({first:old.first,sv:old.sv});const p=old.first?.p||{},q=state.first.questions;
  const add=(key,values)=>{const text=values.map(value=>Array.isArray(value)?value.join(', '):value).filter(value=>typeof value==='string'&&value.trim()).join('\n');if(text&&!q[key])q[key]={selected:[],drafts:[],free:text};};
  add('topics',[p.pq_th,p.pq_a,p.pq_b,p.pq_c]);add('attentes:attentes',[p.at_th,p.at_a,p.at_b,p.at_c]);add('histoire:meaning',[p.hi_a]);add('confort',[p.pe_a,p.pe_b,p.pe_j]);
  if(!state.first.timeline?.length&&Array.isArray(p.hi_tl))state.first.timeline=p.hi_tl.map((item,index)=>({id:'legacy:'+index,period:String(item.y||''),label:String(item.t||'')})).filter(item=>item.label);
  add('pratique',[p.pr_own]);const sv=old.sv||{},fields=state.ongoing.fields;
  for(const [key,value] of Object.entries({'psyf-qtc-month':sv.mo,'psyf-qtc-year':sv.an,'psyf-qtc-reason':sv.why,'psyf-parcours-topics':sv.ab,'psyf-present-changes':sv.sv,'psyf-next-wishes':sv.sus}))if(typeof value==='string'&&value.trim()&&!fields[key])fields[key]=value;
  state.migrationVersion=1;
 }
 function render(route){if(!initialized)return false;if(!phone.classList.contains('en-on')){deactivate();return false;}const mapping={intro:['first','entry'],firstr:['first','hub'],firsthub:['first','hub'],fpage:['first',({pq:'traverse',at:'attentes',hi:'histoire',pe:'confort',pr:'pratique'}[route.k]||'hub')],raconter:['ongoing','main'],suivi:['ongoing','main']},target=mapping[route.v];
  if(!target){deactivate();return false;}const sig=JSON.stringify(route);if(view&&sig===signature){chrome();return true;}
  if(view)deactivate();signature=sig;view=document.createElement('div');view.className='psy-approved-host';view.innerHTML='<div data-psy-first></div><div data-psy-ongoing hidden></div>';body.replaceChildren(view);phone.classList.add('psy-approved-active');
  for(const type of ['input','change','click','submit'])view.addEventListener(type,later);if(target[0]==='first')showFirst(target[1]);else showOngoing(target[1]);return true;
 }
 function init(){if(initialized||!global.__enPsyApprovedReady||!global.__enPsyBridge)return;initialized=true;bridge=global.__enPsyBridge;phone=bridge.root;body=bridge.body;state=global.__enKeep('psy-approved-v1',{version:1,first:{questions:{}},ongoing:{fields:{},notes:{},menus:{}}});state.first||={questions:{}};state.first.questions||={};state.ongoing||={fields:{},notes:{},menus:{}};state.ongoing.fields||={};migrate();let visible=phone.classList.contains('en-on');new MutationObserver(()=>{const now=phone.classList.contains('en-on'),changed=now!==visible;visible=now;if(changed&&!now&&view){synchronize();save().catch(()=>{});}if(changed&&now){deactivate();if(bridge.openEntry)bridge.openEntry();else bridge.redraw();}chrome();}).observe(phone,{attributes:true,attributeFilter:['class']});
  const previous=global.__enShow;global.__enShow=function(id){const dest=typeof id==='string'?id:id?.id;if(view&&dest!=='psy')return leave(()=>{deactivate();return previous(id);});return previous(id);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&view)save().catch(()=>{});});bridge.redraw();
 }
 global.__enApprovedPsy={init,render,save,getState:()=>state};if(global.__enPsyApprovedReady)init();
})(globalThis);
