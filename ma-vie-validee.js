/* Entre nous — parcours validé du 5 novembre 2026. Données dans le coffre existant. */
(()=>{
'use strict';
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,'');
const TITLES={moi:'Moi aujourd’hui',proches:'Mes proches',passe:'Mon passé',int:'Mon intérieur',histoire:'Notre histoire',autres:'Ton texte'};
const CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
const CROSS='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const refused=t=>/^(je prefere (passer|ne pas|pas)|pas maintenant|plus tard|non merci|je ne souhaite pas)/i.test(String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,''));
const unknown=t=>/^(je (ne )?sais (vraiment )?pas(?: trop)?|aucune idee|—)$/i.test(String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,''));
const empty=v=>!String(v||'').trim()||/^[—–\-\s|]+$/.test(String(v));
function toggleChoice(values,value,single){
 if(values.includes(value))return values.filter(x=>x!==value);
 const exclusive=v=>refused(v)||unknown(v)||/^(non\b|rien\b|aucun|pas (encore|pour le moment|vraiment en ce moment))/i.test(v);
 return single||exclusive(value)?[value]:values.filter(x=>!exclusive(x)).concat(value);
}
function parsePortrait(raw,template){
 const heads={};Object.entries(TITLES).forEach(([k,v])=>{heads[norm(v)]=k;});
 const keys={};let c=null;
 String(template||'').split('\n').forEach(l=>{const h=l.match(/^##\s*(.+)/);if(h){c=heads[norm(h[1])];return;}const m=l.match(/^-\s*([^:]+):/);if(c&&m&&!keys[norm(m[1])])keys[norm(m[1])]=[c,m[1].trim()];});
 const out={};let sec=null,last=null;
 for(let line of String(raw||'').replace(/\r/g,'').split('\n')){
  line=line.replace(/\*\*|__|`/g,'').replace(/^\s*>+\s*/,'').trim();
  if(!line||/^[-=_*]{3,}$/.test(line)||/^===.*===$/.test(line))continue;
  const title=line.replace(/^#{1,6}\s*/,'').replace(/^\d+[.)]\s*/,'').replace(/[:：]\s*$/,'');
  if(heads[norm(title)]&&title.length<45){sec=heads[norm(title)];last=null;continue;}
  const bare=line.replace(/^[-•*–—▪◦·]\s+|^\d+[.)]\s+/,'');
  const match=bare.match(/^([^:|]{2,80}?)\s*[:：]\s*(.*)$/);
  const known=match&&keys[norm(match[1])];
  if(known&&!sec)sec=known[0];
  if(!sec)sec='autres';
  if(!match&&last&&!/^[-•*–—▪◦·]\s+/.test(line)&&/^[a-zàâéèêëîïôùûüç|(,;]/.test(bare)){last[1]+='\n'+bare;continue;}
  const value=match?match[2].trim():bare;
  if(empty(value)){last=null;continue;}
  const row=[match?(known?known[1]:match[1].trim()):null,value];
  (out[sec]||(out[sec]=[])).push(row);last=row;
 }
 return out;
}
const repeated=key=>/^(PROCHE|MOMENT|PASSAGE|SOUVENIR|CHAPITRE)$/.test(norm(key));
function mergePortrait(existing,incoming,replaceKeys){
 const out=JSON.parse(JSON.stringify(existing||{}));
 for(const [sec,rows] of Object.entries(incoming||{})){
  const a=out[sec]||(out[sec]=[]);
  for(const row of rows){
   if(a.some(x=>norm(x[0])===norm(row[0])&&x[1]===row[1]))continue;
   const i=row[0]&&!repeated(row[0])?a.findIndex(x=>norm(x[0])===norm(row[0])):-1;
   if(i<0)a.push([...row]);else if(replaceKeys&&replaceKeys.has(sec+':'+norm(row[0])))a[i]=[...row];
  }
 }
 return out;
}
window.__enLifeTools={parsePortrait,mergePortrait,toggleChoice,refused,unknown};
window.__enInitLifeV3=function(){
 if(window.__enLifeV3Ready)return;
 const model=window.__enLifeModel;
 if(!model)return;
 window.__enLifeV3Ready=true;
 const N=model.nodes,C=model.chapters,P=model.profile,legacy=model.state;
 const $=id=>document.getElementById(id),go=id=>window.__enShow(id);
 const keep=(k,v)=>window.__enKeep?window.__enKeep(k,v):v;
 const S=keep('lifeform-v3',{version:3,selected:legacy.selected||'moi',sessions:{}});
 const importState=keep('life-import-v3',{portrait:'',discussion:'',archives:[]});
 const save=()=>Promise.resolve(window.__vaultPushNow&&window.__vaultPushNow());
 const safeSave=()=>save().catch(()=>{});
 const pet=()=>{const night=$('mv2').classList.contains('nuit')||document.documentElement.classList.contains('en-nuit');return 'illus/avatars-compagnons/'+(window.__pet||'chat')+'-'+(night?'nuit':'jour')+'.svg';};
 const header=(title,back,extra)=>'<div class="lv-header"><button type="button" class="lv-back" data-lv="'+back+'" aria-label="Retour à Faire connaissance"><span>'+CHEV+'</span></button><p>'+esc(title)+'</p>'+(extra||'<span></span>')+'</div>';
 const single=new Set(['ville_bien','coeur','solo_plait','coloc','parents','job_aime','job_futur','et_annee','et_plait','sommeil','mots_toi','surnom','part_hist','pr_fratrie','pr_maman','pr_papa','pr_amour','pr_amitie_perdue','pr_manque','pr_complique','pa_enfance','pa_ecole','in_accomp']);
 N.loisirs.q='Quand tu as du temps rien qu’à toi, tu aimes faire quoi ?';
 N.loisirs.c=['lire','dessiner','le sport','la musique','cuisiner','me balader','les jeux vidéo','la photo','jardiner','les séries','créer','écrire'];
 N.loisirs.then=a=>{const hobbies=model.hobbiesIn(a);P.hobbies=hobbies.map(h=>h[1]);return [...new Set(hobbies.flatMap(h=>h[2]))];};
 const originalTrav=N.trav.then;
 N.trav.then=a=>{const ids=[];if(/travail|emploi|salar|independant|alternance/i.test(a.normalize('NFD').replace(/[\u0300-\u036f]/g,'')))ids.push('job','job_jour','job_duree','job_aime','job_futur');if(/etudi|etude|alternance|fac\b|ecole|master|licence|bts|lycee/i.test(a.normalize('NFD').replace(/[\u0300-\u036f]/g,'')))ids.push('et_quoi','et_annee','et_plait','et_apres');return ids.length?ids:originalTrav(a);};
 N.part_hist.q='Souhaites-tu raconter votre histoire dans un chapitre à part, à ton rythme ?';
 N.ville.q='Pour commencer, où vis-tu aujourd’hui ?';
 N.ville.fields=[{key:'ville',label:'Ta ville ou ton coin de vie',alias:'villeNom'},{key:'depuis',label:'Depuis quand ?',alias:'ville_depuis',hint:'Une année, une période ou une date approximative suffisent.'}];
 N.ville.then=a=>/arriv|nouve|recent|quelques mois/i.test(a.normalize('NFD').replace(/[\u0300-\u036f]/g,''))?['ville_why']:[];
 N.part_nom.q='Raconte-moi un peu votre histoire, pour commencer.';
 N.part_nom.fields=[{key:'nom',label:'Son prénom ou le nom que tu souhaites utiliser',alias:'partenaire'},{key:'depuis',label:'Vous êtes ensemble depuis…',alias:'part_duree',hint:'Tu peux rester approximative ou approximatif.'},{key:'rencontre',label:'Comment vous êtes-vous rencontrés ?',alias:'part_renc'}];
 N.avec.then=a=>{P.avec=a;const ids=[];if(/couple|partenaire|copain|copine|mari|femme|compagn/i.test(a))ids.push('part_nom','part_hist');if(/solo|seul/i.test(a))ids.push('solo_plait','coeur');if(/coloc/i.test(a))ids.push('coloc','coeur');if(/famille|enfant/i.test(a))ids.push('fam_qui');if(/parent/i.test(a))ids.push('parents','coeur');return [...new Set(ids.length?ids:['coeur'])];};
 N.an.q='Des animaux partagent-ils ta vie, aujourd’hui ou dans tes souvenirs ?';
 N.an.c=['oui, aujourd’hui','j’en ai eu auparavant','pas pour le moment'];
 N.an.then=a=>/oui|aujourd|auparavant|j.en ai eu/i.test(a)?['v3_animaux']:[];
 N.v3_animaux={q:'Tu peux me présenter chacun d’eux, avec ce que tu souhaites raconter.',kind:'animals'};
 let chapter=C[S.selected]?S.selected:'moi',session=null,currentDraft=null;
 const form=$('mv3'),overview=$('mv2'),aiPage=$('mvai');
 [overview,form,aiPage].forEach(p=>p.classList.add('en-life-page'));
 // Les cartes validées restent celles de l’application ; seule leur présentation est affinée.
 const back=overview.querySelector('.mvbk');back.innerHTML='<span>'+CHEV+'</span>';back.classList.add('lv-back');back.onclick=()=>go('mv');
 const later=overview.querySelector('.mvlat2');later.textContent='Je reviendrai plus tard';later.onclick=()=>{safeSave();go('home');};
 const access=document.createElement('details');access.className='lv-access';access.innerHTML='<summary>Me raconter avec une IA</summary>';
 const aiLinks=overview.querySelector('.mvai');aiLinks.replaceChildren();
 ['chatgpt','claude'].forEach((who,i)=>{if(i)aiLinks.append(document.createTextNode(' · '));const b=document.createElement('button');b.type='button';b.dataset.ai=who;b.textContent=who==='chatgpt'?'ChatGPT':'Claude';b.onclick=()=>openAI(who,null);aiLinks.append(b);});
 aiLinks.before(access);access.append(aiLinks);
 function read(v){return typeof v==='function'?v():v;}
 function getSession(id){
  if(S.sessions[id])return S.sessions[id];
  const old=legacy.sessions[id];
  return S.sessions[id]={th:old?.th||0,indices:old?.indices?[...old.indices]:C[id].themes.map(()=>0),queue:[...(old?.queue||[])],cur:old?.curId||null,history:[],seen:[],answers:{},draft:null,done:!!old?.done,legacyDraft:old?.draft||''};
 }
 function progress(){
  for(const card of overview.querySelectorAll('.mvc')){
   const id=card.dataset.c,def=C[id];if(!def)continue;
   const st=S.sessions[id]||legacy.sessions[id],n=st?.done?def.themes.length:Math.min(st?.th||0,def.themes.length);
   const bar=card.querySelector('.mvpg i'),count=card.querySelector('.mvcnt');
   if(bar)bar.style.width=Math.round(n/def.themes.length*100)+'%';if(count)count.textContent=n+' / '+def.themes.length;
  }
 }
 function snapshot(){return {th:session.th,indices:[...session.indices],queue:[...session.queue],seen:[...session.seen],cur:session.cur};}
 function nextQuestion(){
  const themes=C[chapter].themes;
  for(let tries=0;tries<600;tries++){
   let id;
   if(session.queue.length)id=session.queue.shift();
   else{
    if(session.th>=themes.length){session.cur=null;session.done=true;return;}
    const a=themes[session.th],i=session.indices[session.th]||0;
    if(i>=a.length){session.th++;continue;}
    id=a[i];session.indices[session.th]=i+1;
   }
   if(!N[id]||session.seen.includes(id))continue;
   session.seen.push(id);
   const known=typeof P[id]==='string'&&P[id].trim();
   if(known){
    if(!refused(known)&&!unknown(known)&&N[id].then){try{session.queue.unshift(...(N[id].then(known)||[]));}catch(e){}}
    continue;
   }
   if(N[id].name&&P[N[id].name]&&!N[id].fields)continue;
   session.cur=id;session.done=false;return;
  }
  throw new Error('Le parcours ne peut pas avancer. Tes réponses sont conservées.');
 }
 function openChapter(id){
  if(!C[id])return;
  if(session&&currentDraft){session.draft=currentDraft;}
  chapter=id;S.selected=id;session=getSession(id);
  if(!session.cur&&!session.done)nextQuestion();
  renderForm();progress();go('mv3');safeSave();
 }
 function draftFor(id){
  if(session.draft?.id===id)return session.draft;
  const old=session.answers[id];
  const d=old?JSON.parse(JSON.stringify(old)):{id,choices:[],text:session.legacyDraft||'',fields:{},animals:[]};
  session.legacyDraft='';d.id=id;d.choices=d.choices||[];d.fields=d.fields||{};d.animals=d.animals||[];
  if(N[id].fields)for(const field of N[id].fields)if(!d.fields[field.key]&&P[field.alias])d.fields[field.key]=P[field.alias];
  if(N[id].kind==='animals'&&!d.animals.length)d.animals.push({status:'actuel',nom:'',espece:'',depuis:'',caractere:'',souvenir:''});
  session.draft=d;return d;
 }
 function fieldMarkup(f,value,tag){
  const key=f.key,control=tag==='textarea'?'<textarea data-field="'+esc(key)+'" rows="3">'+esc(value)+'</textarea>':'<input type="text" data-field="'+esc(key)+'" value="'+esc(value)+'" autocomplete="off">';
  return '<label class="lv-field">'+esc(f.label)+control+(f.hint?'<small>'+esc(f.hint)+'</small>':'')+'</label>';
 }
 function animalMarkup(d){
  return d.animals.map((animal,i)=>'<fieldset class="lv-animal" data-animal-index="'+i+'"><legend>Compagnon '+(i+1)+'</legend><label class="lv-field">Dans ta vie<select data-animal-field="status"><option value="actuel"'+(animal.status==='actuel'?' selected':'')+'>Aujourd’hui</option><option value="ancien"'+(animal.status==='ancien'?' selected':'')+'>Dans mes souvenirs</option></select></label>'+[['nom','Son prénom ou son petit nom'],['espece','Son espèce'],['depuis','Une date ou une période, si tu le souhaites'],['caractere','Son caractère'],['souvenir','Ce que tu souhaites raconter de votre histoire']].map(([key,label])=>'<label class="lv-field">'+label+'<input type="text" data-animal-field="'+key+'" value="'+esc(animal[key])+'" autocomplete="off"></label>').join('')+(i?'<button type="button" class="lv-link" data-remove-animal="'+i+'">Retirer cette fiche</button>':'')+'</fieldset>').join('')+'<button type="button" class="lv-link" data-add-animal>Ajouter un autre animal</button>';
 }
 function responseText(d){
  const items=[...d.choices];
  if(N[d.id]?.fields)for(const f of N[d.id].fields)if(String(d.fields[f.key]||'').trim())items.push(f.label+' : '+d.fields[f.key].trim());
  if(N[d.id]?.kind==='animals')for(const a of d.animals)if(a.nom||a.espece||a.souvenir)items.push([a.status==='ancien'?'Dans mes souvenirs':'Aujourd’hui',a.nom,a.espece,a.depuis,a.caractere,a.souvenir].filter(Boolean).join(' | '));
  if(d.text?.trim())items.push(d.text.trim());
  return items.join('\n');
 }
 function renderForm(){
  if(session.done){
   currentDraft=null;
   form.innerHTML=header(C[chapter].title,'chapters')+'<div class="lv-scroll"><div class="lv-question"><img class="lv-avatar" src="'+pet()+'" alt=""><p class="lv-bubble">Merci pour ce que tu as choisi de me confier. Tu peux revenir sur tes réponses quand tu le souhaites.</p></div><p class="lv-status">Ce chapitre est parcouru, à ton rythme.</p></div><div class="lv-footer"><button type="button" class="lv-back" data-lv="previous" aria-label="Revoir la question précédente"><span>'+CHEV+'</span></button><button type="button" class="lv-primary" data-lv="chapters">Revenir aux chapitres</button></div>';
   bindForm();return;
  }
  const id=session.cur,n=N[id];if(!n)return;
  const d=currentDraft=draftFor(id),options=read(n.c)||[];
  const hasFields=!!n.fields||n.kind==='animals';
  const solo=!options.length&&!hasFields;
  const fields=n.kind==='animals'?animalMarkup(d):n.fields?'<div class="lv-fields">'+n.fields.map(f=>fieldMarkup(f,d.fields[f.key]||'')).join('')+'</div>':'';
  const choiceHTML=options.length?'<details class="lv-fold lv-ideas"><summary>Choisis ce qui te ressemble, '+((single.has(id)||n.chipsOnly)?'une idée.':'une ou plusieurs idées.')+'</summary><div class="lv-options">'+options.map((v,i)=>'<button type="button" class="lv-option" data-choice="'+i+'" aria-pressed="'+d.choices.includes(v)+'"><span>'+esc(v)+'</span><span class="lv-dot" aria-hidden="true"></span></button>').join('')+'</div></details>':'';
  form.innerHTML=header(C[chapter].title,'chapters','<button type="button" class="lv-link" data-lv="ai" aria-label="Raconter ce chapitre avec une IA">✦</button>')+'<div class="lv-progress" role="progressbar" aria-label="Progression du chapitre" aria-valuemin="0" aria-valuemax="'+C[chapter].themes.length+'" aria-valuenow="'+session.th+'"><i style="width:'+Math.round(session.th/C[chapter].themes.length*100)+'%"></i></div><div class="lv-scroll"><p class="lv-theme">'+esc(C[chapter].names[Math.min(session.th,C[chapter].names.length-1)])+'</p><div class="lv-question"><img class="lv-avatar" src="'+pet()+'" alt="Ton compagnon"><p class="lv-bubble">'+esc(read(n.q))+'</p></div><div class="lv-response">'+fields+choiceHTML+'<details class="lv-fold lv-writing"'+(solo||d.text?' open':'')+'><summary>Avec tes mots, si tu en as envie.</summary><div class="lv-editor"><textarea rows="5" aria-label="Ta réponse libre" placeholder="Ce que tu souhaites raconter…">'+esc(d.text)+'</textarea></div></details></div><button type="button" class="lv-link" data-lv="skip">Je préfère passer</button><p class="lv-status" role="status"></p></div><div class="lv-footer"><button type="button" class="lv-back" data-lv="previous" aria-label="Question précédente"'+(session.history.length?'':' disabled')+'><span>'+CHEV+'</span></button><button type="button" class="lv-primary" data-lv="continue"'+(responseText(d)?'':' disabled')+'>Continuer</button></div>';
  form.querySelectorAll('[data-choice]').forEach(b=>{b.onclick=()=>{d.choices=toggleChoice(d.choices,options[+b.dataset.choice],single.has(id)||!!n.chipsOnly);form.querySelectorAll('[data-choice]').forEach(x=>x.setAttribute('aria-pressed',d.choices.includes(options[+x.dataset.choice])));changed();};});
  form.querySelectorAll('[data-field]').forEach(input=>input.addEventListener('input',()=>{d.fields[input.dataset.field]=input.value;changed();}));
  form.querySelectorAll('[data-animal-field]').forEach(input=>input.addEventListener('input',()=>{d.animals[+input.closest('[data-animal-index]').dataset.animalIndex][input.dataset.animalField]=input.value;changed();}));
  form.querySelectorAll('[data-remove-animal]').forEach(b=>b.onclick=()=>{d.animals.splice(+b.dataset.removeAnimal,1);renderForm();changed();});
  const add=form.querySelector('[data-add-animal]');if(add)add.onclick=()=>{d.animals.push({status:'actuel',nom:'',espece:'',depuis:'',caractere:'',souvenir:''});renderForm();changed();};
  const writing=form.querySelector('.lv-editor textarea');writing.addEventListener('input',()=>{d.text=writing.value;writing.style.height='auto';writing.style.height=writing.scrollHeight+'px';changed();});
  form.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(form.querySelector('.lv-writing').open){writing.style.height='auto';writing.style.height=writing.scrollHeight+'px';}}));
  bindForm();
 }
 function changed(){session.draft=currentDraft;const b=form.querySelector('[data-lv="continue"]');if(b)b.disabled=!responseText(currentDraft);safeSave();}
 function bindForm(){form.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{switch(b.dataset.lv){case'chapters':if(currentDraft)session.draft=currentDraft;safeSave();progress();go('mv2');break;case'ai':openAI('chatgpt',chapter);break;case'continue':answer(false);break;case'skip':answer(true);break;case'previous':previous();break;}});}
 async function answer(skip){
  if(!session.cur)return;
  const id=session.cur,d=currentDraft,raw=skip?'Je préfère passer':responseText(d);
  if(!raw)return;
  session.history.push({before:snapshot(),id});
  session.answers[id]={...JSON.parse(JSON.stringify(d)),skipped:skip};
  P[id]=raw;
  const n=N[id];
  if(!skip){
   if(n.fields)for(const f of n.fields)if(Object.prototype.hasOwnProperty.call(d.fields,f.key))P[f.alias]=String(d.fields[f.key]||'').trim();
   if(n.name&&!n.fields&&!refused(raw)&&!unknown(raw))P[n.name]=raw.trim();
   if(n.set&&!refused(raw)&&!unknown(raw))P[n.set]=raw;
   if(n.kind==='animals'){P.animauxDetails=JSON.parse(JSON.stringify(d.animals));const a=d.animals.find(x=>x.status==='actuel'&&(x.nom||x.espece));if(a){if(a.nom)P.animal=a.nom;if(a.espece)P.espece=a.espece;P.animaux='oui';}P.animauxAnciens=d.animals.filter(x=>x.status==='ancien');}
   if(!refused(raw)&&!unknown(raw)&&n.then){try{session.queue.unshift(...[...new Set(n.then(raw)||[])].filter(x=>!session.seen.includes(x)));}catch(e){form.querySelector('.lv-status').textContent='Ta réponse est conservée. Tu peux continuer.';}}
   if(id==='part_hist'&&/^oui/i.test(raw)){model.addStory();progress();}
   if(window.__enLifeLog)window.__enLifeLog({c:chapter,ct:C[chapter].title,id,q:read(n.q),a:raw});
  }
  session.cur=null;session.draft=null;currentDraft=null;
  nextQuestion();renderForm();progress();
  if(window.__enFiche)window.__enFiche();
  safeSave();
 }
 function previous(){
  if(currentDraft)session.answers[currentDraft.id]=JSON.parse(JSON.stringify(currentDraft));
  const h=session.history.pop();if(!h)return;
  Object.assign(session,h.before);session.cur=h.id;session.done=false;
  session.draft=JSON.parse(JSON.stringify(session.answers[h.id]||{id:h.id,choices:[],text:'',fields:{},animals:[]}));
  renderForm();safeSave();
 }
 window.__mvopen=openChapter;window.__mvstart=()=>openChapter(chapter);window.__mvselected=()=>S.selected;window.__mvchapter=()=>chapter;
 overview.querySelector('#mvcards').onclick=e=>{const card=e.target.closest('.mvc');if(card)openChapter(card.dataset.c);};
 progress();

 // IA : une page de départ, deux volets bas, une relecture avant toute importation.
 let who='chatgpt',scope=null,modal=null,focusBefore=null,prepared='',incoming=null;
 const names={chatgpt:'ChatGPT',claude:'Claude'},urls={chatgpt:'https://chatgpt.com/',claude:'https://claude.ai/new'};
 function aiHeader(){return header('Avec '+names[who],'ai-back');}
 function bindAIBack(){const b=aiPage.querySelector('[data-lv="ai-back"]');if(b)b.onclick=()=>{closeModal(false);go('mv2');};}
 function openAI(provider,chapterScope){
  closeModal(false);who=provider==='claude'?'claude':'chatgpt';scope=chapterScope||null;
  window.__aiScope=scope;window.__aiWho=who;
  aiPage.innerHTML=aiHeader()+'<div class="lv-ai-body lv-ai-content"><p class="lv-theme">Faire connaissance</p><div class="lv-question"><img class="lv-avatar" src="'+pet()+'" alt="Ton compagnon"><p class="lv-bubble">Je te prépare un message pour continuer cet échange dans '+names[who]+', à ton rythme.</p></div><p>Quand tu souhaites revenir, demande « mon portrait » dans la discussion, puis copie le texte obtenu.</p><p>Tu pourras le rapporter ici. La conversation complète reste facultative.</p><div class="lv-ai-actions"><button type="button" class="lv-primary" data-prepare>Préparer mon échange</button><button type="button" class="lv-link" data-return>J’en reviens : coller mon portrait</button></div></div>';
  bindAIBack();aiPage.querySelector('[data-prepare]').onclick=openPrep;aiPage.querySelector('[data-return]').onclick=openReturn;go('mvai');
 }
 function closeModal(restore=true){
  if(!modal)return;
  modal.remove();modal=null;aiPage.classList.remove('en-ovl');
  [...aiPage.children].forEach(x=>x.inert=false);
  if(restore&&focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
 }
 function openModal(title,body,foot){
  closeModal(false);focusBefore=document.activeElement;
  modal=document.createElement('div');modal.className='lv-modal';
  modal.innerHTML='<section class="lv-sheet" role="dialog" aria-modal="true" aria-labelledby="lv-dialog-title"><span class="lv-grab" aria-hidden="true"></span><div class="lv-sheet-head"><h2 id="lv-dialog-title">'+esc(title)+'</h2><button type="button" class="lv-close" aria-label="Fermer le volet">'+CROSS+'</button></div><div class="lv-sheet-body">'+body+'</div><div class="lv-sheet-foot">'+foot+'<p class="lv-status" role="status" aria-live="polite"></p></div></section>';
  [...aiPage.children].forEach(x=>x.inert=true);aiPage.append(modal);aiPage.classList.add('en-ovl');
  modal.querySelector('.lv-close').onclick=()=>closeModal();modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  modal.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();closeModal();return;}
   if(e.key!=='Tab')return;
   const a=[...modal.querySelectorAll('button:not(:disabled),a[href],textarea,input,select,summary')].filter(x=>!x.hidden&&x.getClientRects().length);
   if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1)?.focus();}
   else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0]?.focus();}
  });
  modal.querySelector('.lv-close').focus({preventScroll:true});
  return modal;
 }
 function preparePrompt(){
  let text=window.__aiPrompt(scope);
  const me=window.__P?window.__P():'';
  text=text.replace(' Je m’appelle '+me+'.','').replace(" Je m'appelle "+me+'.','');
  return text;
 }
 function openPrep(){
  prepared=preparePrompt();
  const m=openModal('Préparer mon échange','<p>Voici le message complet à copier dans '+names[who]+'.</p><label class="lv-field">Le message<textarea class="lv-prompt" readonly aria-label="Message complet pour l’IA">'+esc(prepared)+'</textarea></label>','<button type="button" class="lv-primary" data-copy>Copier le message</button><a class="lv-link" href="'+urls[who]+'" target="_blank" rel="noopener noreferrer">Ouvrir '+names[who]+'</a>');
  m.querySelector('[data-copy]').onclick=async()=>{
   try{await navigator.clipboard.writeText(prepared);m.querySelector('.lv-status').textContent='Le message est copié. Tu peux le coller dans '+names[who]+'.';}
   catch(e){const ta=m.querySelector('textarea');ta.focus();ta.select();m.querySelector('.lv-status').textContent='Sélectionne le message puis utilise « Copier ».';}
  };
 }
 function openReturn(){
  const m=openModal('J’en reviens','<p>Rapporte ce que tu souhaites garder. Tu pourras le relire juste après.</p><label class="lv-field">Ton portrait<textarea data-import="portrait" placeholder="Colle ici le portrait donné par ton IA…">'+esc(importState.portrait)+'</textarea></label><label class="lv-file">Choisir un fichier .txt<input type="file" accept=".txt,.text,text/plain" data-file="portrait" aria-label="Choisir le fichier texte du portrait"></label><details class="lv-fold"><summary>Garder aussi la discussion — facultatif</summary><label class="lv-field">La discussion<textarea data-import="discussion" placeholder="Colle la discussion, si tu souhaites la garder…">'+esc(importState.discussion)+'</textarea></label><label class="lv-file">Choisir un fichier .txt<input type="file" accept=".txt,.text,text/plain" data-file="discussion" aria-label="Choisir le fichier texte de la discussion"></label></details>','<button type="button" class="lv-primary" data-review'+(importState.portrait.trim()?'':' disabled')+'>Vérifier mon portrait</button>');
  const changedImport=()=>{m.querySelector('[data-review]').disabled=!importState.portrait.trim();safeSave();};
  m.querySelectorAll('[data-import]').forEach(ta=>ta.addEventListener('input',()=>{importState[ta.dataset.import]=ta.value;changedImport();}));
  m.querySelectorAll('[data-file]').forEach(input=>input.addEventListener('change',async()=>{
   const f=input.files?.[0];if(!f)return;
   const status=m.querySelector('.lv-status');
   if(!/\.(txt|text)$/i.test(f.name)&&f.type!=='text/plain'){status.textContent='Choisis un fichier texte .txt.';input.value='';return;}
   if(f.size>2*1024*1024){status.textContent='Ce fichier dépasse 2 Mo. Tu peux coller un extrait ou choisir un fichier plus petit.';input.value='';return;}
   try{const text=await f.text();if(!m.isConnected)return;const key=input.dataset.file;importState[key]=text;m.querySelector('[data-import="'+key+'"]').value=text;status.textContent='Fichier chargé : '+f.name;changedImport();}
   catch(e){status.textContent='Le fichier n’a pas pu être lu. Ton texte précédent est conservé.';}
   input.value='';
  }));
  m.querySelector('[data-review]').onclick=()=>{incoming=parsePortrait(importState.portrait,window.__enPortraitTpl);closeModal(false);reviewPortrait();};
 }
 function reviewPortrait(){
  const replaceKeys=new Set(),existing=window.__portrait||{};
  const groups=Object.entries(incoming||{}).filter(([,rows])=>rows.length);
  aiPage.innerHTML=aiHeader()+'<div class="lv-ai-body lv-review"><h2>Relire mon portrait</h2><p>Voici les éléments de ton texte. Tu peux les relire avant de les garder.</p>'+groups.map(([sec,rows],i)=>'<details class="lv-fold"'+(i===0?' open':'')+'><summary>'+esc(TITLES[sec]||sec)+' · '+rows.length+' élément'+(rows.length>1?'s':'')+'</summary><div class="lv-facts">'+rows.map(([label,value])=>{
   const old=label&&!repeated(label)?(existing[sec]||[]).find(x=>norm(x[0])===norm(label)&&x[1]!==value):null;
   const key=sec+':'+norm(label);
   return '<p>'+(label?'<b>'+esc(label)+'</b>':'')+esc(value)+'</p>'+(old?'<label><input type="checkbox" data-replace="'+esc(key)+'"><span>Mettre à jour cette ligne du portrait, auparavant : « '+esc(old[1])+' »</span></label>':'');
  }).join('')+'</div></details>').join('')+'<details class="lv-fold"><summary>Relire le texte complet</summary><div class="lv-editor"><textarea readonly aria-label="Portrait original complet">'+esc(importState.portrait)+'</textarea></div></details>'+(importState.discussion.trim()?'<details class="lv-fold"><summary>La discussion jointe</summary><div class="lv-editor"><textarea readonly aria-label="Discussion jointe">'+esc(importState.discussion)+'</textarea></div></details>':'')+'<p class="lv-status" data-save-status role="status" aria-live="polite"></p><div class="lv-ai-actions"><button type="button" class="lv-link" data-edit>Modifier mon texte</button><button type="button" class="lv-primary" data-keep>Garder mon portrait</button></div></div>';
  bindAIBack();
  aiPage.querySelectorAll('[data-replace]').forEach(input=>input.onchange=()=>{if(input.checked)replaceKeys.add(input.dataset.replace);else replaceKeys.delete(input.dataset.replace);});
  aiPage.querySelector('[data-edit]').onclick=openReturn;
  aiPage.querySelector('[data-keep]').onclick=async e=>{
   const b=e.currentTarget;if(b.disabled)return;b.disabled=true;
   try{
    window.__portrait=mergePortrait(window.__portrait,incoming,replaceKeys);
    const archive={portrait:importState.portrait,discussion:importState.discussion,provider:who,at:Date.now()};
    if(!importState.archives.some(x=>x.portrait===archive.portrait&&x.discussion===archive.discussion))importState.archives.push(archive);
    const conversation=importState.discussion.trim();
    if(conversation&&window.__enConvAdd&&!(window.__enConvs?.()||[]).some(x=>x.txt===conversation))window.__enConvAdd({w:'Ma vie · faire connaissance',src:who==='claude'?'claude':'gpt',txt:conversation});
    if(window.__enFichePortrait)window.__enFichePortrait(true);
    await save();
    aiPage.innerHTML=aiHeader()+'<div class="lv-ai-body"><h2>C’est gardé</h2><p>Ton portrait et les textes que tu as choisis sont conservés dans ton carnet.</p><button type="button" class="lv-primary" data-saved-back>Revenir à Faire connaissance</button></div>';
    bindAIBack();aiPage.querySelector('[data-saved-back]').onclick=()=>go('mv2');
   }catch(error){b.disabled=false;aiPage.querySelector('[data-save-status]').textContent='L’enregistrement n’a pas abouti. Tes textes sont conservés ici : tu peux réessayer.';}
  };
 }
 window.__aiOpen=openAI;window.__mvAI=()=>who;window.__mvaiShare=openPrep;
 const oldShow=window.__enShow;
 window.__enShow=function(id){
  const key=typeof id==='string'?id:id?.id;
  if(key==='mv3'&&!session){openChapter(S.selected||'moi');return;}
  if(key==='mvai'&&!aiPage.querySelector('.lv-ai-body')){openAI(who,scope);return;}
  if(key!=='mvai'&&modal)closeModal(false);
  oldShow(id);
 };
 document.addEventListener('visibilitychange',()=>{if(session&&currentDraft)session.draft=currentDraft;});

 // Visite : les vrais repères de l’accueil, à la demande.
 const H=$('home');let tourState=null;
 function stopTour(restore=true){
  if(!tourState)return;
  const st=tourState;tourState=null;st.overlay.remove();
  st.inert.forEach(([el,value])=>{if(el.isConnected)el.inert=value;});
  if(restore&&st.focus?.isConnected)st.focus.focus({preventScroll:true});
 }
 function guideSteps(){
  const nav=t=>[...H.querySelectorAll('.nav span,.nav button')].find(x=>x.textContent.trim()===t);
  return [
   {el:H.querySelector('.wr'),title:'Tes mots, à ta façon',text:'Tu peux te raconter librement, suivre une piste ou vider ton sac. Choisis ce qui te fait du bien aujourd’hui.'},
   {el:nav('Journal'),title:'Retrouver tes pages',text:'Dans ton Journal, tes pages se retrouvent par thème et par mois. Tu peux les relire quand tu en as envie.'},
   {el:nav('Mon espace'),title:'Un espace à toi',text:'Tes souvenirs, ton calendrier et ton carnet secret sont réunis ici, dans Mon espace.'},
   {el:nav('Psy'),title:'Pour tes séances',text:'Si tu es accompagnée ou accompagné, cet espace t’aide à préparer tes séances, garder tes notes et retrouver tes petits pas.'},
   {el:H.querySelector('.hpl'),title:'Je reste tout près',text:'Tu me retrouves ici, en haut à droite. Touche-moi pour un mot doux ou un coup de main. Tu peux maintenant explorer à ton rythme.'}
  ].filter(x=>x.el&&x.el.getClientRects().length&&getComputedStyle(x.el).display!=='none');
 }
 function placeTour(){
  if(!tourState)return;
  const st=tourState,step=st.steps[st.index],el=step.el,sc=el.closest('.body');
  if(sc&&sc!==H&&sc.scrollHeight>sc.clientHeight){
   const er=el.getBoundingClientRect(),sr=sc.getBoundingClientRect();
   if(er.top<sr.top+12||er.bottom>sr.bottom-12)sc.scrollTop+=(er.top+er.bottom-sr.top-sr.bottom)/2;
  }
  const hr=H.getBoundingClientRect(),scale=hr.width/H.offsetWidth||1,r=el.getBoundingClientRect(),pad=5;
  const x=(r.left-hr.left)/scale-pad,y=(r.top-hr.top)/scale-pad,w=r.width/scale+pad*2,h=r.height/scale+pad*2;
  Object.assign(st.spot.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px',borderRadius:el.classList.contains('hpl')?'50%':'16px'});
  const th=st.tip.offsetHeight,above=y-th-19,below=y+h+19;
  const top=y>H.clientHeight/2?above:below;
  st.tip.style.top=Math.max(12,Math.min(top,H.clientHeight-th-12))+'px';
 }
 function paintTour(){
  if(!tourState)return;
  const st=tourState,step=st.steps[st.index],last=st.index===st.steps.length-1;
  st.tip.querySelector('.lv-counter').textContent='Visite guidée · '+(st.index+1)+' / '+st.steps.length;
  st.tip.querySelector('h2').textContent=step.title;st.tip.querySelector('p').textContent=step.text;
  st.prev.hidden=st.index===0;st.next.textContent=last?'À moi d’explorer':'Suivant';
  placeTour();
 }
 function startTour(){
  stopTour(false);go('home');
  const steps=guideSteps();if(!steps.length)return;
  const focus=document.activeElement,inert=[...H.children].map(el=>[el,el.inert]);
  inert.forEach(([el])=>el.inert=true);
  const o=document.createElement('div');o.className='lv-guide';o.innerHTML='<span class="lv-spot" aria-hidden="true"></span><section class="lv-tip" role="dialog" aria-modal="true" aria-labelledby="lv-tour-title" aria-describedby="lv-tour-text"><div class="lv-tip-head"><span class="lv-counter"></span><button type="button" class="lv-close" aria-label="Quitter la visite">'+CROSS+'</button></div><div class="lv-bubbleline"><img src="'+pet()+'" alt="Ton compagnon"><div><h2 id="lv-tour-title"></h2><p id="lv-tour-text" aria-live="polite"></p></div></div><div class="lv-guide-actions"><button type="button" class="lv-back" aria-label="Étape précédente"><span>'+CHEV+'</span></button><button type="button" class="lv-primary">Suivant</button></div></section>';
  H.append(o);
  const tip=o.querySelector('.lv-tip'),prev=tip.querySelector('.lv-back'),next=tip.querySelector('.lv-primary'),quit=tip.querySelector('.lv-close');
  tourState={overlay:o,spot:o.querySelector('.lv-spot'),tip,prev,next,index:0,steps,inert,focus};
  quit.onclick=()=>stopTour();prev.onclick=()=>{if(tourState&&tourState.index){tourState.index--;paintTour();next.focus();}};
  next.onclick=()=>{if(!tourState)return;if(tourState.index<steps.length-1){tourState.index++;paintTour();next.focus();}else stopTour();};
  o.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();stopTour();return;}
   if(e.key==='Tab'){
    if(e.shiftKey&&document.activeElement===quit){e.preventDefault();next.focus();}
    else if(!e.shiftKey&&document.activeElement===next){e.preventDefault();quit.focus();}
   }
  });
  paintTour();next.focus({preventScroll:true});
 }
 window.__tourStart=startTour;
 if(H){
  const launch=document.createElement('button');launch.type='button';launch.className='lv-tour-launch';launch.textContent='Visite guidée';launch.onclick=startTour;
  const write=H.querySelector('.wr');if(write)write.after(launch);else H.querySelector('.body')?.append(launch);
  new MutationObserver(()=>{if(tourState&&!H.classList.contains('en-on'))stopTour(false);}).observe(H,{attributes:true,attributeFilter:['class']});
  new ResizeObserver(placeTour).observe(H);window.addEventListener('resize',placeTour);
 }
};
})();
