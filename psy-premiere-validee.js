(function(){'use strict';
const TEMPLATE="\n<div id=\"psy-plus-tard-centre\" class=\"\" aria-label=\"Parcours Psy corrigé avec Plus tard en pilule centrée\">\n<div id=\"pp-later-pill\" data-later-style=\"pill\" class=\"dossier-folders elegance-editorial history-badge return-pill\">\n  <div class=\"pp-stage\">\n    <section class=\"pp-app\" aria-label=\"Parcours de préparation de ma première séance\">\n      <header class=\"pp-header\">\n        <div class=\"pp-header-left\"><button type=\"button\" class=\"pp-icon cursor-interaction\" data-menu-button aria-label=\"Ouvrir le menu latéral\" aria-controls=\"pp-later-pill-menu\" aria-expanded=\"false\"><i data-lucide=\"menu\" aria-hidden=\"true\"></i></button><button type=\"button\" class=\"pp-icon cursor-interaction\" data-back aria-label=\"Revenir à la page précédente\"><i data-lucide=\"chevron-left\" aria-hidden=\"true\"></i></button></div>\n        <button type=\"button\" class=\"pp-pet cursor-interaction\" data-pet aria-label=\"Ouvrir la bulle de Plume\" aria-controls=\"pp-later-pill-pet-bubble\" aria-expanded=\"false\"><span class=\"pp-avatar\" role=\"img\" aria-label=\"Plume, les pattes agrippées à son cercle\"></span></button>\n        <div class=\"pp-title\"><h2 data-app-title>MON ESPACE PSY</h2><span class=\"pp-ornament\" aria-hidden=\"true\"><i></i>✦<i></i></span></div>\n      </header>\n      <div class=\"pp-pet-bubble\" id=\"pp-later-pill-pet-bubble\" hidden><p>Tu peux noter ici ce que tu veux lui dire, avant que ça s’envole.</p><button type=\"button\" class=\"pp-quiet cursor-interaction\" data-pet-close>Fermer</button></div>\n      <main data-pages>\n        <section class=\"pp-screen\" data-page-key=\"entry\">\n          <div class=\"pp-entry-intro\"><h3>Ton suivi, à ton rythme</h3><p>Ici, tu peux préparer tes séances, garder ce qui compte et voir le chemin parcouru.</p></div>\n          <button type=\"button\" class=\"pp-entry-card cursor-interaction\" data-start><span class=\"pp-entry-symbol\"><i data-lucide=\"heart\" aria-hidden=\"true\"></i></span><span><strong>Je commence mon suivi</strong><small>Préparer ma première séance.</small></span><i data-lucide=\"chevron-right\" aria-hidden=\"true\"></i></button>\n          <button type=\"button\" class=\"pp-entry-card cursor-interaction\" data-ongoing><span class=\"pp-entry-symbol\"><i data-lucide=\"message-circle\" aria-hidden=\"true\"></i></span><span><strong>J’ai déjà un suivi</strong><small>Raconter ce qu’on a déjà abordé.</small></span><i data-lucide=\"chevron-right\" aria-hidden=\"true\"></i></button>\n          <button type=\"button\" class=\"pp-later cursor-interaction\" data-later>Plus tard</button>\n        </section>\n        <section class=\"pp-screen\" data-page-key=\"hub\" hidden>\n          <div class=\"pp-welcome\"><span class=\"pp-avatar\" role=\"img\" aria-label=\"Plume\"></span><p>Une première séance, c’est surtout faire connaissance, parler de ce qui t’amène et poser tes questions. On prépare quelques mots ensemble, tout doucement ?</p></div>\n          <div data-chapters></div>\n          <footer class=\"pp-bottom-actions pp-actions-wide\" aria-label=\"Actions de ma préparation\">\n            <button type=\"button\" class=\"pp-footer-primary cursor-interaction\" data-preparation-action=\"confirm\">Confirmer</button>\n            <button type=\"button\" class=\"pp-footer-secondary cursor-interaction\" data-preparation-action=\"later\">Je reviendrai plus tard</button>\n          </footer>\n        </section>\n      </main>\n      <button type=\"button\" class=\"pp-menu-scrim cursor-interaction\" data-menu-scrim aria-label=\"Fermer le menu latéral\" hidden></button>\n      <nav class=\"pp-menu\" id=\"pp-later-pill-menu\" aria-label=\"Menu latéral\" hidden><button type=\"button\" class=\"pp-quiet cursor-interaction\" data-menu-close>Fermer le menu</button><button type=\"button\" class=\"pp-menu-link cursor-interaction\" data-outside=\"Accueil\">Accueil</button><button type=\"button\" class=\"pp-menu-link cursor-interaction\" data-outside=\"Mon journal\">Mon journal</button><button type=\"button\" class=\"pp-menu-link cursor-interaction\" data-life-view>Mon espace</button><button type=\"button\" class=\"pp-menu-link pp-current cursor-interaction\" data-menu-psy aria-current=\"page\">Psy</button></nav>\n      <p class=\"pp-sr\" role=\"status\" aria-live=\"polite\" data-app-status></p>\n    </section>\n  </div>\n  <p class=\"pp-preview-status\" role=\"status\" aria-live=\"polite\" data-save-status></p>\n  \n  <template data-timeline-template>\n<section class=\"ht-area\" aria-label=\"Les repères de mon histoire\">\n  <p class=\"ht-title\">Les repères de mon histoire</p>\n  <div class=\"ht-list\" data-history-list></div>\n  <p class=\"ht-empty\" data-history-empty>Quelques étapes, même sans date précise.</p>\n  <details class=\"ht-fold\" data-history-add-fold><summary class=\"cursor-interaction\">Ajouter un repère<i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary>\n    <form data-history-add>\n      <div class=\"ht-fields\"><label>Période<input type=\"text\" name=\"period\" placeholder=\"Un âge, une année…\" data-history-period></label><label>Mon repère<input type=\"text\" name=\"label\" placeholder=\"Quelques mots…\" data-history-label required></label></div>\n      <button type=\"submit\" class=\"ht-soft cursor-interaction\">Ajouter ce repère</button>\n    </form>\n  </details>\n  <details class=\"ht-fold\"><summary class=\"cursor-interaction\">Depuis « Faire connaissance »<i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary>\n    <div class=\"ht-imports\" data-history-imports></div>\n    <button type=\"button\" class=\"ht-soft cursor-interaction\" data-history-import disabled>Ajouter les repères choisis</button>\n  </details>\n  <p class=\"ht-message\" role=\"status\" aria-live=\"polite\" data-history-status></p>\n</section>\n\n  </template>\n  <template data-question-template>\n    <section class=\"ac-product simple-product flow-inline pp-question\">\n      <div data-main><div class=\"ac-question\"><p class=\"ac-prompt\"><span class=\"ac-number\" data-number></span><span data-question></span></p><span class=\"pp-sr\" data-choices-hint>Plusieurs choix possibles.</span></div>\n        <div class=\"ac-response-row\"><div class=\"ac-carousel\" data-carousel role=\"region\" aria-roledescription=\"carrousel\" aria-label=\"Réponses proposées, deux par deux\"></div></div>\n        <div class=\"pp-pager-row\"><div class=\"ac-pagination\"><input type=\"range\" class=\"ac-page-range cursor-interaction\" min=\"0\" max=\"0\" step=\"1\" value=\"0\" data-pager aria-label=\"Parcourir les réponses\"><div class=\"ac-marks\" data-marks aria-hidden=\"true\"></div></div><span data-pager-extra></span></div>\n        <details class=\"free-fold\" data-main-fold><summary class=\"cursor-interaction\"><span data-free-label>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><label class=\"pp-sr\" data-free-input-label>Ma réponse, avec mes mots</label><textarea class=\"ac-free\" rows=\"2\" placeholder=\"Avec mes mots…\" data-free></textarea><div data-free-extra></div></details>\n        <button type=\"button\" class=\"simple-open cursor-interaction\" data-open aria-expanded=\"false\">En dire un peu plus</button>\n      </div>\n      <section class=\"simple-exchange\" data-exchange hidden><header class=\"exchange-header\"><button type=\"button\" class=\"simple-close cursor-interaction\" data-close><i class=\"close-icon\" data-lucide=\"x\" aria-hidden=\"true\"></i><span class=\"close-label\">Revenir aux réponses</span></button></header><div class=\"ac-question\"><p class=\"ac-prompt\"><span class=\"ac-number\" data-followup-number></span><span data-followup-title></span></p></div>\n        <details class=\"free-fold\" data-draft-fold><summary class=\"cursor-interaction\"><span data-draft-label>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><label class=\"pp-sr\" data-draft-input-label>Ma réponse à cette relance</label><textarea class=\"ac-free\" rows=\"3\" placeholder=\"Avec mes mots…\" data-draft></textarea></details>\n        <nav class=\"followup-navigation\" data-followup-nav aria-label=\"Parcourir les relances\" hidden><button type=\"button\" class=\"followup-step cursor-interaction\" data-previous><i data-lucide=\"chevron-left\" aria-hidden=\"true\"></i>Précédent</button><span class=\"followup-position\" data-position></span><button type=\"button\" class=\"followup-step cursor-interaction\" data-next>Suivant<i data-lucide=\"chevron-right\" aria-hidden=\"true\"></i></button></nav>\n      </section><p class=\"pp-sr\" role=\"status\" aria-live=\"polite\" data-status></p>\n    </section>\n  </template>\n  <template data-person-template>\n    <div class=\"pp-person-overlay\" hidden><button type=\"button\" class=\"pp-person-scrim cursor-interaction\" aria-label=\"Fermer l’ajout d’un proche\" data-person-close></button><section class=\"pp-person-sheet\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Ajouter un proche\"><div class=\"pp-person-head\"><p>Ajouter un proche</p><button type=\"button\" class=\"pp-plain-icon cursor-interaction\" aria-label=\"Fermer\" data-person-close><i data-lucide=\"x\" aria-hidden=\"true\"></i></button></div><form data-person-form><div class=\"pp-person-fields\"><label>Prénom<input type=\"text\" autocomplete=\"off\" placeholder=\"Son prénom…\" data-person-name required></label><div class=\"pp-role-field\"><span>Votre lien</span><button type=\"button\" class=\"pp-role-toggle cursor-interaction\" data-role-toggle aria-haspopup=\"listbox\" aria-expanded=\"false\"><span data-role-label>Choisir…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></button><div class=\"pp-role-menu\" data-role-menu hidden><input type=\"search\" placeholder=\"Rechercher un lien…\" aria-label=\"Rechercher un lien familial\" data-role-search><div role=\"listbox\" aria-label=\"Votre lien\" data-role-options></div><p class=\"pp-role-empty\" data-role-empty hidden>Aucun lien trouvé.</p></div></div></div><label class=\"pp-other-link\" data-other-link hidden>Préciser le lien<input type=\"text\" placeholder=\"Votre lien…\" data-other-name></label><p class=\"pp-form-error\" role=\"alert\" data-person-error hidden></p><button type=\"submit\" class=\"pp-soft cursor-interaction\">Ajouter ce proche</button></form></section></div>\n  </template>\n</div>\n</div>\n\n\n";
window.__enMountFirstPsy=function(container,config){
const document=config.document;container.innerHTML=TEMPLATE;

const LIFE_PARTNER_ROLES={couple:'current',seeing:'current',complex:'current','past-love':'past',none:'none',skip:'unknown'};
const LIFE_BOUNDARIES=['oui','ça dépend','très difficilement'];
const LIFE_NO_REASONS=['La peur de décevoir','La culpabilité','La peur du conflit','Le réflexe de faire plaisir','La difficulté à trouver les mots'];
const LIFE_SUPPORT=['De l’écoute','De la tendresse','Du calme','Du temps pour moi','Une présence sans chercher une solution'];
function lifeAnswer(state,number,choices){
 const record=state?.answers?.[number];
 if(!record||record.declined||(record.imported&&record.verified===false))return null;
 const selected=(record.selected||[]).map(value=>{
  const key=String(value);return /^\d+$/.test(key)?choices[Number(key)]:choices.includes(key)?key:null;
 }).filter(Boolean);
 const text=String(record.text||'').trim();return selected.length||text?{selected,text}:null;
}
function psyContextFromLife(stored){
 const state=stored?.pagesV2||{},partner=state.people?.partner;
 const roles=Array.from(new Set(partner?.selected||[]));
 const role=roles.length===1&&Object.prototype.hasOwnProperty.call(LIFE_PARTNER_ROLES,roles[0])?roles[0]:null;
 let mode=role?LIFE_PARTNER_ROLES[role]:'unknown',person=null;
 if(mode==='current'||mode==='past'){
  const kind=mode==='past'?'past-partner':'partner',pool=Array.isArray(partner?.pools?.[kind])?partner.pools[kind]:[];
  const usable=pool.filter(value=>value?.uid&&!(value.imported&&value.verified===false));
  person=usable.find(value=>value.uid===partner.activeId)||(usable.length===1?usable[0]:null);
  if(pool.length&&!usable.length)mode='unknown';
 }
 if(mode==='none'||mode==='unknown')person=null;
 const boundary=lifeAnswer(state,'141',LIFE_BOUNDARIES);
 const gateClosed=!!state.answers?.['141']?.declined||!boundary?.selected.some(value=>value==='ça dépend'||value==='très difficilement');
 const barriers=gateClosed?null:lifeAnswer(state,'N02',LIFE_NO_REASONS);
 const support=mode==='current'?lifeAnswer(state,'N06',LIFE_SUPPORT):null;
 return {role,mode,personUid:person?.uid||null,name:String(person?.name||'').trim(),boundary,barriers,support,
  contextKey:person?.uid?'person:'+person.uid:'unbound:'+mode};
}
function adaptAffectiveModel(baseModel,stored){
 const context=psyContextFromLife(stored),entries=baseModel.entries.map(entry=>({...entry}));
 const {mode,name}=context;
 if(name&&mode==='current'){
  entries[0].prompt='Avec '+name+', ou dans un autre lien important pour toi, quel moment t’a fait du bien ?';
 }else if(name&&mode==='past'){
  entries[0].prompt='En pensant à '+name+', ou à une autre histoire, quel moment te revient ?';
 }else if(mode==='none'){
  entries[0].prompt='Qu’aimerais-tu me raconter d’un lien que tu as vécu ou de ce que tu aimerais vivre ?';
 }else{
  entries[0].prompt='Qu’aimerais-tu me raconter d’un moment ou d’un lien qui t’a fait du bien ?';
 }
 // Le statut ne permet pas d’attribuer une tension ou une rupture à une personne.
 entries[1].prompt='Qu’aimerais-tu me raconter d’un échange difficile, dans un lien actuel ou passé ?';
 entries[2].prompt='Qu’aimerais-tu me confier de cette distance ou de cette séparation, à ton rythme ?';
 entries[7].prompt=mode==='past'?'Dans un lien passé, quelle place avais-tu pour tes moments à toi ?':'Quels moments à toi aimerais-tu garder dans un lien amoureux ?';
 if(mode!=='current'){
  entries[8].answer='Exprimer mes envies';
  entries[8].prompt=mode==='past'?'Qu’aimerais-tu me raconter de la place que tes envies avaient dans un lien passé ?':'Qu’aimerais-tu pouvoir partager de tes envies dans un lien amoureux ?';
  entries[10].answer='La place que je laisse à mes besoins';
  entries[10].prompt='Qu’aimerais-tu pouvoir préserver pour toi dans un lien amoureux ?';
 }
 if(context.barriers){
  const known=context.barriers.selected.includes('La peur de décevoir')?'Tu m’as déjà parlé de la peur de décevoir.':'Tu m’as déjà parlé de ce qui peut rendre le « non » difficile.';
  entries[9].prompt=known+' Y a-t-il une situation affective que tu aimerais ajouter aujourd’hui ?';
 }else if(context.boundary?.selected.includes('oui')){
  entries[9].prompt='Tu m’as dit que tu arrives à dire non. Un moment plus délicat te revient-il ?';
 }
 if(context.support){
  entries[10].prompt='Tu m’as déjà parlé du soutien dont tu as besoin dans les moments difficiles. Qu’aimerais-tu ajouter ou préciser aujourd’hui ?';
 }
 return {question:baseModel.question,entries,context};
}

function friendContextFromLife(stored){
 const saved=stored?.pagesV2?.people?.friends,roles=new Set(saved?.selected||[]);
 if(!saved||roles.has('none')||roles.has('skip'))return {current:[],past:[],hasDetails:false,hasPastDetails:false};
 const hasDetails=person=>[...Object.values(person.responses||{}),...Object.values(person.shared||{})].some(answer=>!answer?.declined&&((answer?.selected||[]).length||String(answer?.text||'').trim()));
 const read=(role,kind)=>{
  if(!roles.has(role))return [];
  const pool=Array.isArray(saved.pools?.[kind])?saved.pools[kind]:[];
  return pool.filter(person=>person?.uid&&!(person.imported&&person.verified===false)).map(person=>({uid:person.uid,name:String(person.name||'').trim(),hasDetails:hasDetails(person)}));
 };
 const current=read('current','friend'),past=read('past','past-friend');
 return {current,past,hasDetails:[...current,...past].some(person=>person.hasDetails),hasPastDetails:past.some(person=>person.hasDetails)};
}
function adaptFriendModel(base,stored,key){
 const context=friendContextFromLife(stored),entries=base.entries.map(entry=>({...entry}));let question=base.question;
 if((key==='aujourdhui'||key==='ensemble')&&context.hasDetails){
  question='Qu’aimerais-tu ajouter aujourd’hui à ce que tu m’as déjà raconté de tes amitiés ?';
  const person=context.current.length===1?context.current[0]:null;
  entries[0].prompt=person?.name?'Avec '+person.name+', ou dans une autre amitié, quel moment aimerais-tu ajouter ici ?':'Quel moment d’amitié aimerais-tu ajouter à ce que tu m’as déjà raconté ?';
 }
 if((key==='evolution'||key==='ensemble')&&context.hasPastDetails){
  if(key!=='ensemble')question='Qu’aimerais-tu ajouter sur les liens d’amitié qui ont changé dans ta vie ?';
  const person=context.past.length===1?context.past[0]:null,index=key==='ensemble'?4:0;
  if(person?.name)entries[index].prompt='En pensant à '+person.name+', ou à une autre amitié, qu’aimerais-tu ajouter sur ce qui a changé ?';
 }
 return {question,entries,context};
}

function activityContextFromLife(stored){
 const answers=stored?.pagesV2?.answers||{};
 const read=number=>{const answer=answers[number];return answer&&!answer.declined&&!(answer.imported&&answer.verified===false)?answer:null};
 const status=read('007'),ids=new Set((status?.selected||[]).map(String));
 const working=ids.has('0'),studying=ids.has('1'),other=[...ids].some(id=>['2','3','4'].includes(id));
 // Conflicting retained branches stay neutral; follow only explicitly active branches.
 const known=!!status&&(working||studying||other)&&!(other&&(working||studying));
 const context=known?(working&&studying?'both':working?'work':studying?'study':ids.size===1&&ids.has('3')?'pause':'other'):'neutral';
 const detailIds=context==='work'?['008','009']:context==='study'?['016','017']:context==='both'?['008','009','016','017']:context==='pause'||context==='other'?['019']:[];
 const feeling=read('009'),feelings=new Set((feeling?.selected||[]).map(String));
 if(context==='work'||context==='both'){if(feelings.has('0')||feelings.has('1'))detailIds.push('010');if(feelings.has('1')||feelings.has('2'))detailIds.push('011')}
 const hasDetails=detailIds.some(number=>{const a=read(number);return a&&((a.selected||[]).length||String(a.text||'').trim()||Object.values(a.fields||{}).some(value=>String(value||'').trim()))});
 const futureIds=context==='work'?['012']:context==='study'?['018']:context==='both'?['012','018']:[];
 if((context==='work'||context==='both')&&(read('012')?.selected||[]).some(id=>['1','2','3'].includes(String(id))))futureIds.push('013');
 const hasFuture=futureIds.some(number=>{const a=read(number);return a&&((a.selected||[]).length||String(a.text||'').trim())});
 return {context,hasDetails,hasFuture};
}
function adaptActivityModel(base,stored,key){
 const context=activityContextFromLife(stored),entries=base.entries.map(entry=>({...entry}));let question=base.question;
 if(key==='quotidien'){
  const questions={work:'Qu’aimerais-tu me raconter de ce que tu vis dans ton travail ?',study:'Qu’aimerais-tu me raconter de ce que tu vis dans tes études ?',both:'Qu’aimerais-tu me raconter de la place du travail et des études dans ta vie ?',pause:'Comment vis-tu cette période de pause, en ce moment ?'};
  question=questions[context.context]||question;
  if(context.hasDetails)question='Qu’aimerais-tu ajouter à ce que tu m’as déjà confié sur '+(context.context==='work'?'ton travail':context.context==='study'?'tes études':'ta situation actuelle')+' ?';
  const setting={work:'au travail',study:'dans tes études',both:'dans ton travail ou tes études',pause:'pendant cette pause'}[context.context];
  if(setting)entries[2].prompt='Qu’aimerais-tu me raconter d’un échange qui t’a marqué '+setting+' ?';
 }
 if(key==='suite'&&context.hasFuture)question='Parmi les envies dont tu m’as déjà parlé, ou d’autres qui sont venues depuis, qu’aimerais-tu explorer ici ?';
 return {question,entries,context};
}

function adaptCombinedActivityModel(base,stored){
 const daily=adaptActivityModel({question:base.question,entries:base.entries.slice(0,4)},stored,'quotidien');
 const future=adaptActivityModel({question:base.question,entries:base.entries.slice(4)},stored,'suite');
 const context=daily.context;
 const questions={
  work:'Qu’aimerais-tu me raconter de ton travail et de tes envies pour la suite ?',
  study:'Qu’aimerais-tu me raconter de tes études et de tes envies pour la suite ?',
  both:'Qu’aimerais-tu me confier du travail, des études et de la place qu’ils prennent dans ta vie ?',
  pause:'Qu’aimerais-tu me confier de cette pause et de tes questions pour la suite ?'
 };
 let question=questions[context.context]||base.question;
 if(context.hasDetails||context.hasFuture)question='Qu’aimerais-tu ajouter aujourd’hui à ce que tu m’as déjà confié sur ta situation ou tes envies ?';
 if(context.hasFuture)future.entries[1].prompt='Qu’aimerais-tu préciser ou ajouter à tes envies de changement, aujourd’hui ?';
 return {question,entries:[...daily.entries,...future.entries],context};
}

function adaptEmotionModel(base,stored,key){
 const answers=stored?.pagesV2?.answers||{};
 const read=number=>{const answer=answers[number];return answer&&!answer.declined&&!(answer.imported&&answer.verified===false)?answer:null};
 const meaningful=answer=>!!answer&&((answer.selected||[]).length>0||String(answer.text||'').trim().length>0);
 const emotions=read('142'),supports=read('051');
 const entries=base.entries.map(entry=>({...entry}));let question=base.question;
 if(key==='ressenti'&&meaningful(emotions))question='Qu’aimerais-tu ajouter aujourd’hui à ce que tu m’as déjà confié sur tes émotions ?';
 const hasSupport=!!supports&&((supports.selected||[]).some(id=>['0','1','2','3','4'].includes(String(id)))||String(supports.text||'').trim().length>0);
 if(key==='besoins'&&hasSupport){
  question='En pensant à ce qui t’aide déjà, ou à un autre besoin, qu’est-ce qui te ferait du bien aujourd’hui ?';
  entries[0].prompt='Parmi ce qui t’aide déjà, ou quelque chose de nouveau, qu’aimerais-tu retrouver pour souffler un peu ?';
 }
 // Known answers guide the invitation; no emotion is preselected or treated as current.
 return {question,entries};
}

function adaptCombinedEmotionModel(base,stored){
 const feelings=adaptEmotionModel({question:base.question,entries:base.entries.slice(0,4)},stored,'ressenti');
 const moments=adaptEmotionModel({question:base.question,entries:base.entries.slice(4,8)},stored,'moments');
 const needs=adaptEmotionModel({question:base.question,entries:base.entries.slice(8)},stored,'besoins');
 return {
  question:feelings.question!==base.question?base.historyQuestion:base.question,
  entries:[...feelings.entries,...moments.entries,...needs.entries]
 };
}

function adaptConfidenceModel(base,stored,key){
 const answers=stored?.pagesV2?.answers||{};
 const read=number=>{const answer=answers[number];return answer&&!answer.declined&&!(answer.imported&&answer.verified===false)?answer:null};
 const confidence=read('137'),qualities=read('138');
 const meaningful=answer=>!!answer&&((answer.selected||[]).length>0||String(answer.text||'').trim().length>0);
 const entries=base.entries.map(entry=>({...entry}));let question=base.question;
 if(key==='soi'&&meaningful(confidence))question='Qu’aimerais-tu ajouter aujourd’hui à ce que tu m’as déjà confié sur ta confiance en toi ?';
 const knownQualities=!!qualities&&((qualities.selected||[]).some(id=>['0','1','2','3','4'].includes(String(id)))||String(qualities.text||'').trim().length>0);
 if(key==='soi'&&knownQualities)entries[2].prompt='Qu’aimerais-tu ajouter sur ce qui t’aide, ou te freine, pour reconnaître tes qualités ?';
 // Previously shared confidence is context, never a current score or a selected Psy answer.
 return {question,entries};
}

function adaptChangeModel(base,stored,key){
 const entries=base.entries.map(entry=>({...entry}));
 if(key==='changements'){
  const activity=activityContextFromLife(stored);
  if(activity.hasDetails||activity.hasFuture)entries[1].prompt='En repensant à ce que tu m’as déjà confié sur ton activité ou tes envies, qu’aimerais-tu ajouter sur ce changement ?';
 }
 // A known job, address or relationship never implies a change; no option is selected.
 return {question:base.question,entries};
}

function historyCandidatesFromLife(stored){
 const saved=stored?.pagesV2?.answers?.['113'];
 if(!saved||saved.declined||(saved.imported&&saved.verified===false))return [];
 return (saved.records||[]).flatMap((record,index)=>{
  if(!record||record.declined||(record.imported&&record.verified===false))return [];
  const place=String(record.place||'').trim(),period=String(record.period||'').trim();
  return place?[{sourceId:'113:'+index,period,label:'Grandir à '+place}]:[];
 });
}
function mountHistoryTimeline(host,stored){
 const $=selector=>host.querySelector(selector),list=$('[data-history-list]'),empty=$('[data-history-empty]'),form=$('[data-history-add]'),periodInput=$('[data-history-period]'),labelInput=$('[data-history-label]'),importList=$('[data-history-imports]'),importButton=$('[data-history-import]'),status=$('[data-history-status]');
 const entries=(config.state.timeline||[]).map(entry=>({...entry})),selected=new Set(),candidates=historyCandidatesFromLife(stored);let serial=Math.max(0,...entries.map(entry=>Number(String(entry.id).split(':').at(-1))||0));
 const element=(tag,className,text)=>{const node=document.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node};
 const iconButton=(icon,label,handler)=>{const b=element('button','ht-icon cursor-interaction');b.type='button';b.setAttribute('aria-label',label);const i=element('i','');i.dataset.lucide=icon;i.setAttribute('aria-hidden','true');b.append(i);b.addEventListener('click',handler);return b};
 function icons(){globalThis.__enPsyIcons?.(host,16)}
 function renderImports(){
  importList.replaceChildren();
  candidates.forEach(candidate=>{
   const already=entries.some(entry=>entry.sourceId===candidate.sourceId),label=element('label','ht-import'),input=element('input','cursor-interaction');input.type='checkbox';input.checked=selected.has(candidate.sourceId);input.disabled=already;
   const text=element('span','',candidate.period?candidate.period+' · '+candidate.label:candidate.label);label.append(input,text);if(already)label.append(element('small','','Déjà ajouté'));
   input.addEventListener('change',()=>{if(input.checked)selected.add(candidate.sourceId);else selected.delete(candidate.sourceId);importButton.disabled=!selected.size});importList.append(label);
  });
  if(!candidates.length)importList.append(element('p','ht-empty','Aucun repère disponible pour le moment.'));
  importButton.disabled=!selected.size;
 }
 function render(){
  list.replaceChildren();empty.hidden=entries.length>0;
  entries.forEach(entry=>{
   const row=element('div','ht-row'),mark=element('i','ht-mark'),content=element('div','ht-content'),head=element('div','ht-head');mark.dataset.lucide='sparkles';mark.setAttribute('aria-hidden','true');
   if(entry.period)head.append(element('span','ht-period',entry.period));head.append(element('span','ht-label',entry.label));content.append(head);
   if(entry.sourceId)content.append(element('small','ht-origin','Faire connaissance'));
   const edit=element('details','ht-edit'),summary=element('summary','cursor-interaction','Modifier'),editor=element('form','ht-editor'),fields=element('div','ht-fields');
   const pLabel=element('label','','Période'),pInput=element('input',''),tLabel=element('label','','Mon repère'),tInput=element('input','');pInput.type=tInput.type='text';pInput.value=entry.draftPeriod??entry.period;tInput.value=entry.draftLabel??entry.label;tInput.required=true;pLabel.append(pInput);tLabel.append(tInput);fields.append(pLabel,tLabel);
   pInput.addEventListener('input',()=>entry.draftPeriod=pInput.value);tInput.addEventListener('input',()=>entry.draftLabel=tInput.value);
   const save=element('button','ht-soft cursor-interaction','Enregistrer');save.type='submit';editor.append(fields,save);edit.append(summary,editor);content.append(edit);
   editor.addEventListener('submit',event=>{event.preventDefault();if(!tInput.value.trim())return;entry.period=pInput.value.trim();entry.label=tInput.value.trim();delete entry.draftLabel;delete entry.draftPeriod;render();status.textContent='Repère modifié.'});
   const remove=iconButton('trash-2','Retirer le repère : '+entry.label,()=>{entries.splice(entries.indexOf(entry),1);selected.delete(entry.sourceId);render();status.textContent='Repère retiré de cette préparation.'});row.append(mark,content,remove);list.append(row);
  });renderImports();icons();
 }
 form.addEventListener('submit',event=>{event.preventDefault();const label=labelInput.value.trim();if(!label){labelInput.focus();return}entries.push({id:'local:'+ ++serial,period:periodInput.value.trim(),label});periodInput.value='';labelInput.value='';render();labelInput.focus();status.textContent='Repère ajouté.'});
 importButton.addEventListener('click',()=>{const additions=candidates.filter(candidate=>selected.has(candidate.sourceId)&&!entries.some(entry=>entry.sourceId===candidate.sourceId));additions.forEach(candidate=>entries.push({id:'import:'+candidate.sourceId,...candidate}));selected.clear();render();status.textContent=additions.length+' repère'+(additions.length>1?'s':'')+' ajouté'+(additions.length>1?'s':'')+'.'});
 render();return {entries,candidates,refresh:render};
}

const SHARED_DATA={"topics":[{"id":"family","label":"Ma famille"},{"id":"love","label":"Ma vie affective"},{"id":"friends","label":"Mes amitiés"},{"id":"work","label":"Mon travail ou mes études"},{"id":"feelings","label":"Mes émotions"},{"id":"confidence","label":"Ma confiance en moi"},{"id":"event","label":"Un événement difficile"},{"id":"change","label":"Un changement dans ma vie"},{"id":"health","label":"Ma santé ou mon corps"},{"id":"unknown","label":"Je ne sais pas encore"}],"familyRoles":[{"id":"mother","label":"Ma mère"},{"id":"father","label":"Mon père"},{"id":"sister","label":"Ma sœur"},{"id":"brother","label":"Mon frère"},{"id":"child","label":"Mon enfant"},{"id":"grandmother","label":"Ma grand-mère"},{"id":"grandfather","label":"Mon grand-père"},{"id":"aunt","label":"Ma tante"},{"id":"uncle","label":"Mon oncle"},{"id":"cousin","label":"Un cousin ou une cousine"},{"id":"other","label":"Un autre proche"}],"family":{"question":"Qu’as-tu envie de me raconter de ta famille ?","entries":[{"id":"relations","answer":"Mes relations avec mes proches"},{"id":"communication","answer":"Notre façon de communiquer"},{"id":"place","answer":"Ma place dans la famille"},{"id":"changements","answer":"Les changements dans ma famille"}]},"relations":{"question":"Quand tu penses à votre lien, qu’est-ce qui te vient et comment te sens-tu ?","entries":[{"answer":"Je me sens en confiance","prompt":"Qu’est-ce qui te donne confiance pour être toi-même et compter sur cette personne ?"},{"answer":"Je ressens des tensions","prompt":"Quelle situation ou quel moment te revient quand tu penses à ces tensions ?"},{"answer":"Je ressens de la distance","prompt":"Comment cette distance se manifeste-t-elle entre vous ?"},{"answer":"Ce lien me fait du bien","prompt":"Quels moments te font du bien avec cette personne, et qu’est-ce qu’ils t’apportent ?"},{"answer":"Des échanges difficiles","prompt":"Qu’est-ce qui est difficile à dire ou à entendre dans vos échanges ?"},{"answer":"Ce qui change dans notre lien","prompt":"Comment décrirais-tu votre lien avant et aujourd’hui ?"},{"answer":"J’ai du mal à mettre des mots sur ce lien","prompt":"Un petit détail, un mot, une image ou un moment te vient-il quand tu penses à votre lien ?"},{"answer":"Ce qui nous rapproche","prompt":"Qu’est-ce que vous aimez partager ensemble ?"},{"answer":"Ce qui me pèse","prompt":"Qu’est-ce qui te fatigue ou te demande beaucoup d’énergie dans ce lien ?"}]},"familyModels":{"communication":{"question":"Qu’est-ce qui rend certains sujets faciles à aborder en famille, et d’autres plus délicats ?","entries":[{"answer":"On prend le temps de s’écouter","prompt":{"answer":"On prend le temps de s’écouter","prompt":"Y a-t-il un moment où tu as senti qu’on t’écoutait vraiment ?"}},{"answer":"La discussion devient vite tendue","prompt":{"answer":"La discussion devient vite tendue","prompt":"Qu’as-tu envie de me raconter d’une discussion qui a été difficile pour toi ?"}},{"answer":"On préfère éviter certains sujets","prompt":{"answer":"On préfère éviter certains sujets","prompt":"Y a-t-il un sujet que tu aimerais me confier, même si c’est délicat en famille ?"}},{"answer":"On arrive à parler de nos différences","prompt":{"answer":"On arrive à parler de nos différences","prompt":"Qu’est-ce qui vous aide à vous écouter, même quand vous n’êtes pas d’accord ?"}},{"answer":"Je peux dire ce que je ressens","prompt":{"answer":"Je peux dire ce que je ressens","prompt":"Qu’est-ce qui t’aide à te sentir à l’aise pour dire ce que tu ressens ?"}},{"answer":"J’hésite à donner mon avis","prompt":{"answer":"J’hésite à donner mon avis","prompt":"Y a-t-il quelque chose que tu aimerais dire, mais que tu hésites à partager ?"}},{"answer":"J’ai peur de la réaction","prompt":{"answer":"J’ai peur de la réaction","prompt":"Qu’est-ce qui t’inquiète dans la réaction que ta famille pourrait avoir ?"}},{"answer":"Je peux expliquer mes choix","prompt":{"answer":"Je peux expliquer mes choix","prompt":"Un moment te revient où tu as pu expliquer un choix important pour toi ?"}},{"answer":"Mes émotions et mes besoins","prompt":{"answer":"Mes émotions et mes besoins","prompt":"Comment ça se passe pour toi quand tu parles de tes émotions ou de tes besoins ?"}},{"answer":"Mes choix et mes projets","prompt":{"answer":"Mes choix et mes projets","prompt":"Quand tu parles d’un choix ou d’un projet qui te tient à cœur, comment ça se passe ?"}},{"answer":"Nos désaccords","prompt":{"answer":"Nos désaccords","prompt":"Quand vous n’êtes pas d’accord, comment se passe la discussion pour toi ?"}},{"answer":"Notre histoire familiale","prompt":{"answer":"Notre histoire familiale","prompt":"Qu’aimerais-tu me raconter de votre histoire familiale, même en quelques mots ?"}}]},"place":{"question":"Qu’aimerais-tu me raconter de ta place dans ta famille ?","entries":[{"answer":"Je me sens à ma place","prompt":"Y a-t-il un moment où tu as senti que tu avais vraiment ta place ?"},{"answer":"Je me sens parfois à l’écart","prompt":"Qu’aimerais-tu me raconter des moments où tu te sens à l’écart ?"},{"answer":"J’ai du mal à être moi-même","prompt":"Qu’aimerais-tu pouvoir montrer de toi plus librement ?"},{"answer":"Ça dépend des personnes","prompt":"Avec qui est-ce plus facile d’être toi-même, et avec qui est-ce plus délicat ?"},{"answer":"J’écoute et je soutiens","prompt":"Qu’as-tu envie de me raconter des moments où les autres viennent se confier à toi ?"},{"answer":"J’essaie d’apaiser les tensions","prompt":"Quand tu essaies d’apaiser les tensions, comment te sens-tu, toi ?"},{"answer":"Je prends beaucoup de choses en charge","prompt":"De quoi t’occupes-tu souvent pour les autres, et comment le vis-tu ?"},{"answer":"Je reste plutôt en retrait","prompt":"Quand tu restes en retrait, comment le vis-tu, toi ?"},{"answer":"Je peux faire mes propres choix","prompt":"Un choix qui te ressemble te vient-il, que tu as pu faire pour toi ?"},{"answer":"J’ai du mal à dire non","prompt":"Y a-t-il un non que tu aimerais pouvoir dire plus facilement ?"},{"answer":"Je fais souvent passer les autres avant moi","prompt":"Qu’aimerais-tu garder un peu plus pour toi : du temps, de l’énergie, ou autre chose ?"},{"answer":"Je garde mes envies pour moi","prompt":"Y a-t-il une envie à toi que tu aimerais me confier ici ?"}]},"changements":{"question":"Qu’aimerais-tu me raconter de ce qui a changé dans ta famille et de ce que tu ressens ?","entries":[{"answer":"Une arrivée ou un nouveau lien","prompt":"Qu’aimerais-tu me raconter de cette arrivée ou de ce nouveau lien ?"},{"answer":"Une séparation ou un éloignement","prompt":"Qu’aimerais-tu me raconter de cette séparation ou de cet éloignement, à ton rythme ?"},{"answer":"Le décès d’un proche","prompt":"De cette personne, qu’aimerais-tu me raconter, même en quelques mots ?"},{"answer":"Un changement de vie ou de quotidien","prompt":"Qu’est-ce qui a changé dans votre quotidien et que tu aimerais me raconter ?"},{"answer":"Ça m’a fait du bien","prompt":"Qu’est-ce que ce changement t’a apporté de bon, à toi ?"},{"answer":"Je ressens un manque","prompt":"Qu’est-ce qui te manque et dont tu aimerais me parler ?"},{"answer":"J’ai du mal à trouver mes repères","prompt":"Qu’aimerais-tu retrouver pour te sentir un peu plus à l’aise aujourd’hui ?"},{"answer":"Je m’adapte petit à petit","prompt":"Qu’est-ce qui devient un peu plus facile pour toi, même doucement ?"}]}},"topicModels":{"love":{"question":"Qu’aimerais-tu me raconter de l’amour et de la place qu’il prend dans ta vie ?","entries":[{"answer":"Des moments qui me font du bien","prompt":"Y a-t-il un petit moment partagé qui t’a fait du bien et que tu aimerais me raconter ?"},{"answer":"Des tensions ou des incompréhensions","prompt":"Qu’as-tu envie de me raconter d’un moment où vous avez eu du mal à vous comprendre ?"},{"answer":"Une rupture ou un éloignement","prompt":"Qu’aimerais-tu me confier de cette distance ou de cette séparation, à ton rythme ?"},{"answer":"La solitude me pèse","prompt":"Qu’aimerais-tu me raconter des moments où la solitude te pèse ?"},{"answer":"Me sentir en confiance","prompt":"Qu’est-ce qui t’aide à te sentir en confiance avec quelqu’un ?"},{"answer":"Pouvoir être moi-même","prompt":"Qu’aimerais-tu qu’une personne découvre de toi, à ta façon ?"},{"answer":"Partager de l’affection et de la tendresse","prompt":"Quels gestes ou petits moments de tendresse te font du bien ?"},{"answer":"Garder du temps et de l’espace pour moi","prompt":"Quels moments à toi aimerais-tu garder, même quand tu partages ta vie avec quelqu’un ?"},{"answer":"Je peux dire ce dont j’ai envie","prompt":"Y a-t-il une envie que tu arrives à partager et que tu aimerais me raconter ?"},{"answer":"J’ai du mal à dire non","prompt":"Y a-t-il une situation où tu aimerais pouvoir dire non plus facilement ?"},{"answer":"Je fais parfois passer l’autre avant moi","prompt":"Qu’aimerais-tu que l’autre comprenne mieux de tes envies ou de tes besoins ?"},{"answer":"L’intimité ou la sexualité me questionne","prompt":"Qu’aimerais-tu me confier sur l’intimité ou la sexualité, même en quelques mots ?"}]},"friends":{"question":"Qu’aimerais-tu me raconter de tes amitiés et de ce que tu y vis ?","entries":[{"answer":"Des moments qui me font du bien","prompt":"Y a-t-il un moment d’amitié qui t’a fait du bien et que tu aimerais me raconter ?"},{"answer":"Le besoin de partager plus de moments","prompt":"Quels moments aimerais-tu pouvoir partager un peu plus souvent ?"},{"answer":"Des tensions ou des non-dits","prompt":"Y a-t-il un échange ou un silence qui te reste en tête et dont tu aimerais parler ?"},{"answer":"La solitude me pèse","prompt":"Dans les moments où la solitude te pèse, qu’aimerais-tu me confier ?"},{"answer":"Une amitié qui s’est éloignée","prompt":"Qu’aimerais-tu me raconter de la façon dont ce lien a changé, à ton rythme ?"},{"answer":"Une rupture amicale","prompt":"De cette amitié, qu’aimerais-tu me raconter aujourd’hui, même en quelques mots ?"},{"answer":"L’envie de reprendre contact","prompt":"Qu’aimerais-tu retrouver ou partager à nouveau dans cette amitié ?"},{"answer":"Un nouveau lien qui se construit","prompt":"Qu’as-tu envie de découvrir ou de partager dans ce nouveau lien ?"},{"answer":"Je peux être moi-même","prompt":"Qu’est-ce qui te fait sentir que tu peux être toi-même dans une amitié ?"},{"answer":"Je fais souvent le premier pas","prompt":"Quand c’est souvent toi qui proposes, comment le vis-tu, toi ?"},{"answer":"Je donne beaucoup sans toujours recevoir","prompt":"Qu’aimerais-tu recevoir un peu plus dans tes amitiés ?"},{"answer":"J’ai du mal à exprimer mes besoins","prompt":"Y a-t-il un besoin ou une envie que tu aimerais pouvoir dire plus facilement ?"}]},"work":{"question":"Qu’aimerais-tu me confier de ta situation aujourd’hui et de la suite ?","entries":[{"answer":"Des moments qui me font du bien","prompt":"Quel moment t’a fait du bien et te revient aujourd’hui ?"},{"answer":"La pression et les attentes","prompt":"Y a-t-il un moment où tu as senti qu’on attendait beaucoup de toi ?"},{"answer":"Les relations avec les autres","prompt":"Qu’aimerais-tu me raconter d’un échange qui t’a marqué dans ce cadre ?"},{"answer":"La fatigue ou le découragement","prompt":"Qu’est-ce qui te prend le plus d’énergie en ce moment ?"},{"answer":"Un changement récent","prompt":"Qu’est-ce que ce changement a apporté dans ton quotidien, pour toi ?"},{"answer":"L’envie de changer de voie","prompt":"Qu’aimerais-tu trouver dans une autre voie ?"},{"answer":"Une recherche d’emploi ou de formation","prompt":"Comment vis-tu cette recherche, en ce moment ?"},{"answer":"Des inquiétudes pour la suite","prompt":"Quelle question sur la suite prend le plus de place dans tes pensées ?"}]},"feelings":{"label":"Ce que tu traverses","question":"Quand tu penses à ce que tu traverses, qu’est-ce que tu ressens ?","historyQuestion":"En repensant à ce que tu m’as confié, qu’aimerais-tu ajouter sur ce que tu ressens aujourd’hui ?","entries":[{"answer":"Une émotion qui prend beaucoup de place","prompt":"Quelle est cette émotion, et comment la vis-tu en ce moment ?"},{"answer":"Plusieurs émotions en même temps","prompt":"Quelles émotions se mêlent en toi, même si elles semblent se contredire ?"},{"answer":"Des moments de joie ou de légèreté","prompt":"Quel moment t’a fait sourire ou t’a donné le cœur plus léger ?"},{"answer":"Du mal à savoir ce que je ressens","prompt":"Un mot, une sensation ou une image pourrait-il raconter un peu ce que tu vis ?"},{"answer":"Une réaction qui me surprend","prompt":"Qu’aimerais-tu me raconter d’un moment où ta réaction t’a surpris ?"},{"answer":"Des émotions que je garde pour moi","prompt":"Qu’est-ce que tu gardes en toi et que tu aimerais pouvoir confier ici ?"},{"answer":"Des émotions qui débordent","prompt":"Quand tout devient trop intense, qu’est-ce qui se passe pour toi ?"},{"answer":"Des moments où je ne ressens plus grand-chose","prompt":"Comment vis-tu ces moments où tu ressens peu de choses ?"},{"answer":"Retrouver un peu de calme","prompt":"Qu’est-ce qui pourrait t’offrir un petit moment de répit aujourd’hui ?"},{"answer":"Une écoute sans jugement","prompt":"Qu’aimerais-tu que l’on entende ou comprenne de ce que tu vis ?"},{"answer":"Pouvoir exprimer ce que je ressens","prompt":"Quels mots aimerais-tu pouvoir laisser sortir, même tout doucement ?"},{"answer":"Comprendre ce qui se passe en moi","prompt":"Qu’aimerais-tu mieux comprendre dans ce que tu ressens ?"}]},"confidence":{"question":"Qu’aimerais-tu me confier de ta confiance en toi, aujourd’hui ?","entries":[{"answer":"Je doute de ma valeur","prompt":"Dans quels moments as-tu du mal à sentir que tu comptes, toi aussi ?"},{"answer":"Je me parle durement","prompt":"Quels mots te viennent envers toi-même quand quelque chose est difficile ?"},{"answer":"J’ai du mal à reconnaître mes qualités","prompt":"Y a-t-il une qualité que les autres voient en toi et que tu as du mal à t’accorder ?"},{"answer":"Je reconnais mieux ce dont je suis capable","prompt":"Quel moment t’a permis de voir quelque chose de beau ou de solide en toi ?"},{"answer":"La peur du jugement","prompt":"Y a-t-il un moment où la peur du regard des autres t’a empêché de faire ce que tu souhaitais ?"},{"answer":"Je me compare aux autres","prompt":"Quand tu te compares, qu’est-ce qui te touche le plus ?"},{"answer":"Le besoin que l’on me rassure","prompt":"Dans quels moments aurais-tu besoin d’entendre des mots qui te rassurent ?"},{"answer":"Le sentiment de devoir faire mes preuves","prompt":"Qu’aimerais-tu me raconter d’un moment où tu as senti que tu devais prouver ta valeur ?"},{"answer":"La peur de me tromper","prompt":"Y a-t-il une envie que la peur de te tromper te fait mettre de côté ?"},{"answer":"Du mal à faire mes propres choix","prompt":"Qu’est-ce qui rend certains choix difficiles pour toi ?"},{"answer":"L’envie d’oser davantage","prompt":"Quel petit pas aimerais-tu pouvoir faire pour toi ?"},{"answer":"Des petits pas qui m’encouragent","prompt":"Quel petit pas aimerais-tu garder en tête pour te rappeler que tu avances ?"}]},"event":{"question":"Qu’aimerais-tu me confier de cet événement et de ce que tu vis aujourd’hui, à ton rythme ?","entries":[{"answer":"Une perte ou une séparation","prompt":"Qu’aimerais-tu me confier de ce que cette perte ou cette séparation représente pour toi ?"},{"answer":"Une épreuve liée à ma santé","prompt":"Qu’aimerais-tu que l’on comprenne de ce que tu as vécu ?"},{"answer":"Une expérience qui m’a fait du mal","prompt":"Sans avoir à raconter les détails, qu’aimerais-tu me confier de ce que tu as vécu ?"},{"answer":"Un autre événement","prompt":"Quels mots aimerais-tu poser ici pour commencer à en parler ?"},{"answer":"Des émotions qui reviennent","prompt":"Quand tu y repenses, qu’aimerais-tu me confier de ce que tu ressens ?"},{"answer":"Des souvenirs qui s’imposent","prompt":"Quand ces souvenirs reviennent, comment le vis-tu, toi ?"},{"answer":"Un quotidien qui a changé","prompt":"Qu’est-ce qui a changé dans tes journées et que tu aimerais évoquer ici ?"},{"answer":"Un regard différent sur moi ou les autres","prompt":"Qu’est-ce qui a changé dans la façon dont tu te vois ou dont tu te sens avec les autres ?"},{"answer":"Trouver les mots peu à peu","prompt":"Y a-t-il un mot ou une sensation que tu aimerais simplement poser ici ?"},{"answer":"Pouvoir choisir ce que je raconte","prompt":"Qu’aimerais-tu que l’on respecte dans ta façon d’en parler ?"},{"answer":"Une présence qui me rassure","prompt":"Qu’est-ce qui t’aiderait à te sentir en confiance avec la personne qui t’écoute ?"},{"answer":"Du soutien dans mon quotidien","prompt":"Dans quels moments un peu de soutien te ferait-il du bien ?"}]},"change":{"question":"Qu’aimerais-tu me raconter de ce qui change dans ta vie et de la façon dont tu le vis ?","entries":[{"answer":"Un déménagement ou un nouveau cadre de vie","prompt":"Qu’est-ce qui est différent pour toi depuis ce changement de lieu ou de cadre ?"},{"answer":"Un changement au travail ou dans mes études","prompt":"Qu’aimerais-tu me raconter de cette nouvelle situation dans ton travail ou tes études ?"},{"answer":"Un changement dans mes liens","prompt":"Comment vis-tu cette évolution dans tes liens ?"},{"answer":"Une autre étape de ma vie","prompt":"Qu’aimerais-tu me confier de cette étape et de sa place dans ta vie ?"},{"answer":"De l’enthousiasme et des envies","prompt":"Qu’est-ce qui te donne envie d’avancer ou t’apporte de la joie dans ce changement ?"},{"answer":"De l’inquiétude face à l’inconnu","prompt":"Quand tu penses à ce qui t’attend, qu’est-ce qui t’inquiète le plus ?"},{"answer":"Du mal à laisser certaines choses derrière moi","prompt":"Qu’est-ce que tu aimerais garder de ce qui était là avant ?"},{"answer":"Des sentiments qui se mélangent","prompt":"Quelles émotions se côtoient en toi quand tu penses à ce changement ?"},{"answer":"Un rythme à retrouver","prompt":"À quoi ressemblerait un quotidien dans lequel tu pourrais souffler un peu ?"},{"answer":"De nouveaux liens à créer","prompt":"De quels liens ou moments partagés aurais-tu envie dans cette nouvelle étape ?"},{"answer":"Des habitudes qui me rassurent","prompt":"Quelle petite habitude te ferait du bien dans cette nouvelle étape ?"},{"answer":"Du temps pour m’adapter","prompt":"Qu’aimerais-tu pouvoir t’accorder sans te presser ?"}]},"health":{"question":"Qu’aimerais-tu me confier de ce que tu vis avec ta santé ou ton corps, en ce moment ?","entries":[{"answer":"Des douleurs ou de l’inconfort","prompt":"Qu’aimerais-tu que l’on comprenne de la place que cela prend dans tes journées ?"},{"answer":"De la fatigue","prompt":"Qu’est-ce qui est le plus difficile pour toi dans les moments de fatigue ?"},{"answer":"Des questions ou des inquiétudes","prompt":"Quelle question ou quelle inquiétude aimerais-tu pouvoir déposer ici ?"},{"answer":"Un suivi ou des examens","prompt":"Qu’aimerais-tu me confier de la façon dont tu vis ce suivi ou ces examens ?"},{"answer":"Le regard que je porte sur mon corps","prompt":"Quand tu penses à ton corps, quels mots te viennent ?"},{"answer":"Le regard ou les remarques des autres","prompt":"Y a-t-il une parole ou un regard qui t’a touché et dont tu aimerais me parler ?"},{"answer":"Du mal à écouter mes sensations","prompt":"Dans quels moments est-ce difficile de savoir ce que ton corps te fait ressentir ?"},{"answer":"Des moments où je me sens bien dans mon corps","prompt":"Qu’aimerais-tu me raconter d’un moment où tu t’es senti bien dans ton corps ?"},{"answer":"Adapter mon rythme","prompt":"Qu’aimerais-tu pouvoir alléger ou faire à ton rythme dans tes journées ?"},{"answer":"Pouvoir parler de ce que je vis","prompt":"Qu’aimerais-tu pouvoir dire, et que l’on entende vraiment ?"},{"answer":"Une présence ou une aide concrète","prompt":"Quelle présence ou quel petit geste t’aiderait au quotidien ?"},{"answer":"Garder une place pour ce qui me fait du bien","prompt":"À quoi aimerais-tu pouvoir faire un peu plus de place dans ta vie ?"}]}},"unknown":{"label":"Je ne sais pas encore","type":"free-writing","intro":"Tu peux laisser quelques mots ici, sans choisir de sujet.","question":null,"choices":[],"followups":[],"freeField":{"label":"Avec mes mots…","placeholder":"Ce qui me vient…","collapsible":true,"initiallyOpen":true,"preserveDraftWhenCollapsed":true},"returnLabel":"Revenir aux rubriques"},"attentes":{"intro":"On peut poser ce que tu espères du suivi, même par petits pas.","questions":{"attentes":{"question":"Qu’aimerais-tu que ce suivi t’apporte ?","entries":[{"answer":"Mieux me comprendre","prompt":"Qu’aimerais-tu mieux comprendre dans ta façon de vivre ou de ressentir les choses ?"},{"answer":"Retrouver un peu d’apaisement","prompt":"Qu’aimerais-tu que ce suivi t’aide à alléger ?"},{"answer":"Me faire davantage confiance","prompt":"Qu’aimerais-tu t’autoriser plus facilement ?"},{"answer":"Poser mes limites","prompt":"Quelle limite aimerais-tu pouvoir poser plus sereinement ?"},{"answer":"Faire évoluer une situation ou un lien","prompt":"Qu’aimerais-tu voir évoluer, pour toi, dans cette situation ou ce lien ?"},{"answer":"Trouver des repères pour les moments difficiles","prompt":"Qu’aimerais-tu trouver dans ce suivi pour traverser ces moments avec un peu plus de soutien ?"}]},"reperes":{"question":"Quel petit signe te ferait dire que ce suivi t’aide ?","entries":[{"answer":"Me sentir plus libre de parler","prompt":"Qu’est-ce que tu aimerais pouvoir dire plus librement ?"},{"answer":"Retrouver de l’énergie pour ce qui compte","prompt":"À quoi aimerais-tu pouvoir consacrer un peu plus d’énergie ?"},{"answer":"Réagir avec plus de recul","prompt":"Dans quel moment aimerais-tu pouvoir prendre un peu plus de recul ?"},{"answer":"Faire des choix qui me ressemblent","prompt":"Quel choix aimerais-tu pouvoir faire en t’écoutant davantage ?"},{"answer":"Me sentir plus à l’aise dans mes liens","prompt":"Qu’est-ce qui te ferait sentir plus à l’aise dans tes liens ?"},{"answer":"Je ne sais pas encore","prompt":null}]}}},"histoire":{"intro":"On peut garder quelques repères de ton histoire, sans tout raconter.","questions":{"histoire":{"question":"Qu’aimerais-tu que l’on comprenne de ton histoire ?","entries":[{"answer":"Ce qui a compté pour moi","prompt":"Qu’aimerais-tu que l’on retienne de ce qui a compté pour toi ?"},{"answer":"Ce qui m’a aidé à avancer","prompt":"Qu’est-ce qui t’a aidé à avancer et que tu aimerais partager ici ?"},{"answer":"Ce qui me suit encore aujourd’hui","prompt":"Quelle place cela prend-il dans ta vie aujourd’hui ?"},{"answer":"Ce qui a changé ma façon de voir les choses","prompt":"Qu’est-ce qui a changé dans ta façon de voir la vie, ou de te voir toi ?"},{"answer":"Une part de moi que l’on connaît peu","prompt":"Qu’aimerais-tu laisser découvrir de toi, avec tes mots ?"},{"answer":"Je ne souhaite rien ajouter pour l’instant","prompt":null}]}}},"pratique":{"intro":"On peut garder ici les questions que tu aimerais poser, même les plus simples.","question":"Qu’aimerais-tu éclaircir avant de commencer ?","entries":[{"answer":"Le prix d’une séance","prompt":"Quel est le tarif d’une séance et quels moyens de paiement acceptez-vous ?"},{"answer":"Les possibilités de remboursement","prompt":"Existe-t-il une possibilité de remboursement dans ma situation ?"},{"answer":"La durée et le rythme des séances","prompt":"Combien de temps dure une séance et comment choisit-on leur fréquence ?"},{"answer":"La confidentialité des échanges","prompt":"Comment fonctionne la confidentialité de nos échanges, et quelles en sont les limites ?"},{"answer":"La façon de travailler ensemble","prompt":"Comment travaillez-vous et comment déciderons-nous de ce qui peut m’aider ?"},{"answer":"Les rendez-vous et les annulations","prompt":"Comment prendre, déplacer ou annuler un rendez-vous ?"},{"answer":"Les échanges entre les séances","prompt":"Puis-je vous contacter entre deux séances, et dans quel cadre ?"},{"answer":"Le déroulement de la première séance","prompt":"Comment se déroule généralement une première séance avec vous ?"}]},"confort":{"intro":"On peut préparer ce qui te rassure, pour avancer à ton rythme en séance.","question":"Qu’est-ce qui t’aiderait à te sentir à l’aise pendant la séance ?","answers":["Du temps pour trouver mes mots","La possibilité de faire une pause","Des questions pour m’aider à commencer","Pouvoir m’appuyer sur mes notes","Dire quand un sujet est trop difficile","Ne pas avoir à tout raconter tout de suite"],"multiple":true,"followups":[],"freeField":{"label":"Avec mes mots…","placeholder":"Ce qui m’aiderait à me sentir bien…","collapsible":true}}};
function mountPreview(instanceId,editAccess,dossierLayout,presentation,freeLabel,returnLabel){
const moiDossiersOpen=new Set(['histoire','confort']);
function renderMoiDossier(panel,id,title){
 const folder=el('details','ds-sheet ds-moi-folder'),summary=el('summary','ds-dossier-title cursor-interaction'),content=el('div','ds-sheet-content');folder.dataset.moiDossier=id;folder.open=moiDossiersOpen.has(id);
 const number=el('span','rc-chapter-number',String(chapterInfo.findIndex(([key])=>key===id)+1).padStart(2,'0'));number.setAttribute('aria-hidden','true');summary.append(number,el('span','rc-chapter-title',title),icon('chevron-down'));folder.append(summary,content);
 folder.addEventListener('toggle',()=>{if(folder.open)moiDossiersOpen.add(id);else moiDossiersOpen.delete(id)});
 function question(key,showQuestion=true){const q=questions.get(key);if(!hasRecapContent(q))return;const group=el('section','ds-moi-question');group.dataset.moiQuestion=key;if(showQuestion)group.append(el('p','ds-context-question',q.model.question));renderDossierContent(group,{key});content.append(group)}
 if(id==='attentes')Object.keys(DATA.attentes.questions).forEach(key=>question('attentes:'+key));
 if(id==='histoire'){
  if(timeline?.entries.length){const list=el('ul','rc-landmarks');for(const entry of timeline.entries){const row=el('li');if(entry.period)row.append(el('span','rc-period',entry.period));row.append(el('span','rc-landmark-title',entry.label));list.append(row)}content.append(list)}
  question('histoire:meaning');
 }
 if(id==='pratique'){
  const q=questions.get('pratique');if(q){for(const entry of q.entries.filter(item=>q.selected.has(item.id))){const pair=el('section','ds-answer');pair.dataset.sourceQuestion='pratique';pair.dataset.answerId=entry.id;pair.append(el('p','ds-answer-label',entry.prompt||entry.answer));const note=q.drafts.get(entry.id);if(String(note||'').trim()){const paragraph=el('p','ds-note',note);paragraph.dataset.noteFor=entry.id;pair.append(paragraph)}content.append(pair)}if(q.free.trim()){const paragraph=el('p','ds-free');paragraph.append(el('span','ds-free-label',freeLabel?freeLabel+' : ':''),el('span','ds-written',q.free));content.append(paragraph)}}
 }
 if(id==='confort')question('confort',false);
 if(content.children.length)panel.append(folder);
}
function completeMoiPanel(panel){
 if(!panel)return;
 if(topicsQuestion?.free.trim()){
  const fold=el('details','ds-sheet ds-moi-folder'),summary=el('summary','ds-dossier-title cursor-interaction','Avec mes mots'),content=el('div','ds-sheet-content');fold.dataset.moiDossier='libre';summary.append(icon('chevron-down'));content.append(el('p','ds-free',topicsQuestion.free));fold.append(summary,content);panel.append(fold);
 }
 if(!panel.children.length)panel.append(el('p','rc-empty','Tes réponses personnelles apparaîtront ici au fil de ta préparation.'));
}

const dossierSelection=new Map();
function renderDossierContent(parent,record){
 const q=record.key?questions.get(record.key):null;
 if(record.free!==undefined){const paragraph=el('p','ds-free');paragraph.append(el('span','ds-free-label',freeLabel?freeLabel+' : ':''),el('span','ds-written',record.free));parent.append(paragraph);return}
 if(!q)return;
 const selected=q.entries.filter(entry=>q.selected.has(entry.id)&&(!record.entryId||entry.id===record.entryId));
 for(const entry of selected){
  const pair=el('div','ds-answer');pair.dataset.sourceQuestion=record.key;pair.dataset.answerId=entry.id;
  if(!record.entryId){const label=el('p','ds-answer-label',entry.answer);if(entry.prompt)label.setAttribute('data-tooltip',entry.prompt);pair.append(label)}
  const note=q.drafts.get(entry.id);if(String(note||'').trim()){const paragraph=el('p','ds-note',note);paragraph.dataset.noteFor=entry.id;pair.append(paragraph)}
  parent.append(pair);
 }
 if(!record.entryId&&q.free.trim()){const paragraph=el('p','ds-free');paragraph.append(el('span','ds-free-label',freeLabel?freeLabel+' : ':''),el('span','ds-written',q.free));parent.append(paragraph)}
}
function renderDossierCollection(parent,topicId,records){
 if(!records.length)return;
 const container=el('div','ds-collection');container.dataset.dossierTopic=topicId;
 let active=dossierSelection.get(topicId);if(!records.some(record=>record.id===active))active=records[0].id;dossierSelection.set(topicId,active);
 if(dossierLayout==='tabs'&&records.length>1){
  const nav=el('div','ds-navigation'),panels=new Map(),buttons=new Map();nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Personnes et sujets dans '+(DATA.topics.find(topic=>topic.id===topicId)?.label||topicId));container.append(nav);
  function activate(id){dossierSelection.set(topicId,id);for(const [key,panel] of panels)panel.hidden=key!==id;for(const [key,button] of buttons)button.setAttribute('aria-selected',String(key===id))}
  records.forEach((record,index)=>{
   const uid=instanceId+'-dossier-'+ ++sequence,button=el('button','ds-tab cursor-interaction',record.title),panel=el('section','ds-sheet');button.type='button';button.id=uid+'-tab';panel.id=uid+'-panel';button.setAttribute('role','tab');button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-selected',String(record.id===active));button.dataset.dossierId=record.id;panel.dataset.dossierId=record.id;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);panel.hidden=record.id!==active;renderDossierContent(panel,record);buttons.set(record.id,button);panels.set(record.id,panel);button.addEventListener('click',()=>activate(record.id));button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?records.length-1:(index+(event.key==='ArrowRight'?1:-1)+records.length)%records.length;activate(records[next].id);buttons.get(records[next].id).focus()});nav.append(button);container.append(panel);
  });
 }else{
  for(const record of records){
   const section=el(dossierLayout==='folders'?'details':'section','ds-sheet');section.dataset.dossierId=record.id;
   if(dossierLayout==='folders'){const summary=el('summary','ds-dossier-title cursor-interaction',record.title);summary.append(icon('chevron-down'));section.append(summary);section.open=record.id===active}
   else section.append(el('h5','ds-dossier-title',record.title));
   const content=el('div','ds-sheet-content');renderDossierContent(content,record);section.append(content);container.append(section);
  }
 }
 parent.append(container);
}
function renderTraverseFamily(group){
 if(!familyQuestion)return;
 const records=[];
 for(const branch of familyQuestion.entries.filter(entry=>familyQuestion.selected.has(entry.id))){
  if(branch.id==='relations'){
   if(peopleQuestion){for(const id of peopleQuestion.selected){const person=peopleQuestion.entries.find(entry=>entry.id===id);if(person)records.push({id:'person:'+person.id,title:person.answer,key:'person:'+person.id})}
    if(peopleQuestion.free.trim())records.push({id:'people:free',title:'À propos de mes proches',free:peopleQuestion.free});
   }
  }else records.push({id:'family:'+branch.id,title:branch.answer,key:'family:'+branch.id});
 }
 if(familyQuestion.free.trim())records.push({id:'family:free',title:'À propos de ma famille',free:familyQuestion.free});
 renderDossierCollection(group,'family',records);
}
function renderTopicDossiers(group,topicId){
 const key='topic:'+topicId,q=questions.get(key);if(!q)return;
 const records=hasRecapContent(q)?[{id:key,title:q.model.question,key}]:[];
 renderDossierCollection(group,topicId,records);
}

const host=document.getElementById(instanceId),app=host.querySelector('.pp-app'),pages=host.querySelector('[data-pages]'),status=host.querySelector('[data-app-status]'),previewStatus=host.querySelector('[data-save-status]');
const DATA=JSON.parse(JSON.stringify(SHARED_DATA));
const life=config.life;
const questions=new Map(),screens=new Map(),topicSections=new Map(),familySections=new Map(),personSections=new Map(),chapterRows=new Map();
let path=['entry',...(config.initialPage&&config.initialPage!=='entry'?[config.initialPage]:[])],sequence=10000,timeline=null,peopleQuestion=null,familyQuestion=null,topicsQuestion=null,freeUnknown=null,closeActivePerson=null;
const chapterInfo=[['traverse','Ce que je traverse'],['attentes','Ce que j’aimerais changer'],['histoire','Un peu de moi'],['pratique','Ce que j’aimerais savoir'],['confort','Pour me sentir bien']];
const chapterSubtitles={traverse:'ce qui t’amène à faire ce premier pas',attentes:'tes besoins, tes envies, tes espoirs',histoire:'ton histoire, les moments qui comptent',pratique:'ce que tu aimerais demander à ta psy',confort:'tes besoins, ce qui te rassure'};
function el(tag,className='',text){const node=document.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node}
function icon(name){const i=el('i');i.dataset.lucide=name;i.setAttribute('aria-hidden','true');return i}
function icons(){globalThis.__enPsyIcons?.(host,16)}
function quiet(text,handler){const b=el('button','pp-quiet cursor-interaction',text);b.type='button';b.addEventListener('click',handler);return b}
function welcome(parent,text){const row=el('div','pp-welcome'),avatar=el('span','pp-avatar');avatar.setAttribute('role','img');avatar.setAttribute('aria-label','Plume');row.append(avatar,el('p','',text));parent.append(row)}
function disclosure(parent,title){const d=el('details','pp-topic'),s=el('summary','cursor-interaction');s.append(el('span','',title),icon('chevron-down'));d.append(s);parent.append(d);return d}
function modelFromPairs(question,answers,prompts=[]){return {question,entries:answers.map((answer,index)=>({id:String(index),answer,prompt:prompts[index]||null}))}}

function mountQuestion(parent,key,model,opts={}){
 if(questions.has(key))return questions.get(key);
 const root=host.querySelector('[data-question-template]').content.firstElementChild.cloneNode(true),$=selector=>root.querySelector(selector);
 const uid=instanceId+'-q-'+ ++sequence,free=$('[data-free]'),mainFold=$('[data-main-fold]'),open=$('[data-open]'),exchange=$('[data-exchange]'),draft=$('[data-draft]'),draftFold=$('[data-draft-fold]'),pager=$('[data-pager]'),viewport=$('[data-carousel]'),marks=$('[data-marks]'),note=$('[data-status]');
 const state={key,root,model,entries:[],selected:new Set(config.state.questions?.[key]?.selected||[]),drafts:new Map(config.state.questions?.[key]?.drafts||[]),free:config.state.questions?.[key]?.free||'',page:config.state.questions?.[key]?.page||0,active:config.state.questions?.[key]?.active||null,exploring:false,number:opts.number||'01',get answered(){return !!this.selected.size||!!this.free.trim()}};
 const selectedEntries=()=>state.entries.filter(entry=>state.selected.has(entry.id)),followups=()=>selectedEntries().filter(entry=>entry.prompt&&!opts.noRelances);
 $('[data-number]').textContent=state.number;$('[data-question]').textContent=model.question;
 viewport.id=uid+'-choices';const choicesHint=$('[data-choices-hint]');if(choicesHint){choicesHint.id=uid+'-hint';viewport.setAttribute('aria-describedby',choicesHint.id)}pager.setAttribute('aria-controls',viewport.id);exchange.id=uid+'-exchange';open.setAttribute('aria-controls',exchange.id);$('[data-followup-title]').id=uid+'-followup';exchange.setAttribute('aria-labelledby',uid+'-followup');
 free.id=uid+'-free';$('[data-free-input-label]').setAttribute('for',free.id);draft.id=uid+'-draft';$('[data-draft-input-label]').setAttribute('for',draft.id);
 if(opts.practical){open.textContent='Mes questions à poser';$('[data-draft-label]').textContent='Noter la réponse';draft.placeholder='La réponse que je souhaite garder…';$('[data-draft-input-label]').textContent='La réponse à cette question';$('[data-free-label]').textContent='Ma question, avec mes mots…';free.placeholder='Ce que j’aimerais lui demander…';$('[data-close] .close-label').textContent='Revenir aux questions'}
 if(opts.freePlaceholder)free.placeholder=opts.freePlaceholder;free.value=state.free;
 function sync(){exchange.hidden=!state.exploring;mainFold.hidden=state.exploring;open.hidden=!followups().length||state.exploring;open.setAttribute('aria-expanded',String(state.exploring))}
 function closeExchange(focus=true){state.exploring=false;sync();if(focus&&!open.hidden)open.focus()}
 function updateExchange(){const list=followups();if(!list.length){closeExchange(false);return}if(!list.some(entry=>entry.id===state.active))state.active=list[0].id;const index=list.findIndex(entry=>entry.id===state.active),entry=list[index];$('[data-followup-title]').textContent=entry.prompt;$('[data-followup-number]').textContent=state.number+'.'+(index+1);draft.value=state.drafts.get(state.active)||'';$('[data-followup-nav]').hidden=list.length<2;$('[data-previous]').disabled=index===0;$('[data-next]').disabled=index===list.length-1;$('[data-position]').textContent=(index+1)+' / '+list.length}
 function show(announce=false){
  const total=Math.max(1,Math.ceil(state.entries.length/2));state.page=Math.max(0,Math.min(total-1,state.page));root.querySelectorAll('[data-pair]').forEach(node=>node.hidden=Number(node.dataset.pair)!==state.page);root.querySelectorAll('[data-choice]').forEach(node=>node.setAttribute('aria-pressed',String(state.selected.has(node.dataset.choice))));root.querySelectorAll('[data-marker]').forEach(node=>node.dataset.current=String(Number(node.dataset.marker)===state.page));pager.value=String(state.page);pager.setAttribute('aria-valuetext','Page '+(state.page+1)+' sur '+total+' : '+state.entries.slice(state.page*2,state.page*2+2).map(entry=>entry.answer).join(', '));if(state.exploring)updateExchange();sync();if(announce)note.textContent=state.entries.slice(state.page*2,state.page*2+2).map(entry=>entry.answer).join(', ');
 }
 function notify(id,isSelected){opts.onSelection?.(state,id,isSelected)}
 function choose(id){id=String(id);if(state.selected.has(id))state.selected.delete(id);else{if(opts.exclusive?.(id))state.selected.clear();else if(opts.exclusive)for(const chosen of [...state.selected])if(opts.exclusive(chosen))state.selected.delete(chosen);state.selected.add(id)}show();note.textContent=state.selected.size+' réponse'+(state.selected.size>1?'s':'')+' choisie'+(state.selected.size>1?'s':'');notify(id,state.selected.has(id))}
 function setEntries(nextEntries){
  state.entries=nextEntries.map((entry,index)=>{const id=String(entry.id??index),previous=state.entries.find(item=>item.id===id)||config.state.questions?.[key]?.entries?.find(item=>item.id===id),prompt=String(state.drafts.get(id)||'').trim()&&typeof previous?.prompt==='string'?previous.prompt:entry.prompt;return {...entry,id,prompt:prompt&&typeof prompt==='object'?String(prompt.prompt||''):prompt};});const count=Math.max(1,Math.ceil(state.entries.length/2)),width=Math.max(56,16+(count-1)*10),thumb=width-(count-1)*10;root.style.setProperty('--ac-pager-count',String(count));root.style.setProperty('--ac-pager-width',width+'px');root.style.setProperty('--ac-pager-thumb',thumb+'px');root.style.setProperty('--ac-pager-inset',thumb/2+'px');pager.max=String(count-1);viewport.replaceChildren();marks.replaceChildren();
  for(let pageIndex=0;pageIndex<count;pageIndex++){const pair=el('div','ac-page');pair.dataset.pair=String(pageIndex);pair.setAttribute('role','group');pair.setAttribute('aria-label',(pageIndex+1)+' sur '+count);state.entries.slice(pageIndex*2,pageIndex*2+2).forEach(entry=>{const b=el('button','ac-choice cursor-interaction');b.type='button';b.dataset.choice=entry.id;const check=el('span','ac-check','✓');check.setAttribute('aria-hidden','true');const label=entry.answer.length>90?entry.answer.slice(0,87)+'…':entry.answer;b.append(el('span','',label),check);if(label!==entry.answer)b.setAttribute('data-tooltip',entry.answer);b.addEventListener('click',()=>choose(entry.id));pair.append(b)});viewport.append(pair);const marker=el('span','ac-marker');marker.dataset.marker=String(pageIndex);marks.append(marker)}show();
 }
 pager.addEventListener('input',event=>{state.page=Number(event.target.value);show(true)});
 let origin=null,suppressClick=false;viewport.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse')origin={x:event.clientX,y:event.clientY}});viewport.addEventListener('pointercancel',()=>origin=null);viewport.addEventListener('pointerup',event=>{if(!origin)return;const dx=event.clientX-origin.x,dy=event.clientY-origin.y;origin=null;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){const total=Math.max(1,Math.ceil(state.entries.length/2));state.page=(state.page+(dx<0?1:-1)+total)%total;suppressClick=true;show(true);setTimeout(()=>suppressClick=false,0)}});viewport.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false}},true);
 free.addEventListener('input',()=>state.free=free.value);draft.addEventListener('input',()=>state.drafts.set(state.active,draft.value));open.addEventListener('click',()=>{if(!followups().length)return;state.exploring=true;updateExchange();draftFold.open=true;sync();$('[data-close]').focus()});$('[data-close]').addEventListener('click',()=>closeExchange());
 function step(delta){const list=followups(),index=list.findIndex(entry=>entry.id===state.active)+delta;if(index<0||index>=list.length)return;state.active=list[index].id;updateExchange();note.textContent=list[index].prompt}
 $('[data-previous]').addEventListener('click',()=>step(-1));$('[data-next]').addEventListener('click',()=>step(1));root.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.exploring){event.preventDefault();closeExchange()}});
 state.setEntries=setEntries;state.show=show;state.choose=choose;state.select=id=>{id=String(id);if(!state.selected.has(id))choose(id)};
 if(opts.practical){const add=el('button','pp-soft cursor-interaction','Ajouter ma question');add.type='button';$('[data-free-extra]').append(add);add.addEventListener('click',()=>{const text=free.value.trim();if(!text){free.focus();note.textContent='Écris quelques mots pour ajouter ta question.';return}let entry=state.entries.find(item=>item.custom&&item.prompt===text);if(!entry){entry={id:'custom:'+Date.now().toString(36)+':'+ ++sequence,answer:text,prompt:text,custom:true};setEntries([...state.entries,entry])}state.selected.add(entry.id);state.active=entry.id;state.page=Math.floor(state.entries.findIndex(item=>item.id===entry.id)/2);free.value='';state.free='';show();open.focus();note.textContent='Ta question est ajoutée et sélectionnée.'})}
 parent.append(root);questions.set(key,state);setEntries([...(model.entries||[]),...(config.state.questions?.[key]?.custom||[])]);return state;
}

function familyChoices(){
 const saved=life.pagesV2.people.family,roles=new Set(saved.selected||[]),stopped=roles.has('none')||roles.has('skip'),result=[],seen=new Set();
 for(const role of DATA.familyRoles){const pool=!stopped&&roles.has(role.id)?saved.pools?.[role.id]||[]:[],usable=pool.filter(person=>person?.uid&&!person.declined&&!(person.imported&&person.verified===false)&&!seen.has(person.uid));if(usable.length){for(const person of usable){seen.add(person.uid);result.push({id:person.uid,answer:String(person.name||'').trim()||role.label,kind:role.id,person})}}else result.push({id:'role:'+role.id,answer:role.label,kind:role.id})}return result;
}

function addPersonSheet(question){
 const owner=question.root;owner.classList.add('pp-person-owner');const overlay=host.querySelector('[data-person-template]').content.firstElementChild.cloneNode(true),$=selector=>overlay.querySelector(selector),button=el('button','pp-plain-icon cursor-interaction');button.type='button';button.setAttribute('aria-label','Ajouter un proche');button.setAttribute('aria-expanded','false');button.append(icon('user-round-plus'));question.root.querySelector('.ac-response-row').append(button);question.root.classList.add('pp-people-question');owner.append(overlay);
 const form=$('[data-person-form]'),name=$('[data-person-name]'),toggle=$('[data-role-toggle]'),menu=$('[data-role-menu]'),search=$('[data-role-search]'),options=$('[data-role-options]'),error=$('[data-person-error]');let kind='',opening=false;
 menu.id=instanceId+'-role-menu-'+ ++sequence;toggle.setAttribute('aria-controls',menu.id);toggle.setAttribute('aria-label','Votre lien');
 const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 function menuOpen(value){menu.hidden=!value;toggle.setAttribute('aria-expanded',String(value));owner.classList.toggle('pp-role-open',value);if(value)search.focus()}
 function closeSheet(){menuOpen(false);overlay.hidden=true;owner.classList.remove('pp-sheet-open');button.setAttribute('aria-expanded','false');question.root.querySelector('[data-main]').inert=false;opening=false;closeActivePerson=null;button.focus()}
 function refreshOptions(){const query=normalize(search.value);let count=0;options.querySelectorAll('[data-role]').forEach(node=>{node.hidden=!normalize(node.textContent).includes(query);node.setAttribute('aria-selected',String(node.dataset.role===kind));if(!node.hidden)count++});$('[data-role-empty]').hidden=count>0}
 DATA.familyRoles.forEach(role=>{const option=el('button','pp-role-option cursor-interaction',role.label);option.type='button';option.dataset.role=role.id;option.setAttribute('role','option');option.setAttribute('aria-selected','false');option.addEventListener('click',()=>{kind=role.id;$('[data-role-label]').textContent=role.label;$('[data-other-link]').hidden=kind!=='other';menuOpen(false);toggle.focus();refreshOptions()});options.append(option)});
 button.addEventListener('click',()=>{opening=true;closeActivePerson=closeSheet;overlay.hidden=false;owner.classList.add('pp-sheet-open');button.setAttribute('aria-expanded','true');question.root.querySelector('[data-main]').inert=true;name.focus()});overlay.querySelectorAll('[data-person-close]').forEach(node=>node.addEventListener('click',closeSheet));toggle.addEventListener('click',()=>menuOpen(menu.hidden));search.addEventListener('input',refreshOptions);
 overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();if(!menu.hidden){menuOpen(false);toggle.focus()}else closeSheet()}if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)&&!menu.hidden){const choices=Array.from(options.querySelectorAll('[data-role]')).filter(node=>!node.hidden),activeIndex=choices.indexOf(document.activeElement);if(!choices.length)return;event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?choices.length-1:event.key==='ArrowDown'?(activeIndex+1)%choices.length:(activeIndex-1+choices.length)%choices.length;choices[index].focus()}if(event.key==='Tab'&&opening){const list=Array.from(overlay.querySelectorAll('button,input')).filter(node=>!node.disabled&&node.getClientRects().length),first=list[0],last=list[list.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
 form.addEventListener('submit',event=>{event.preventDefault();const firstName=name.value.trim();if(!firstName||!kind){error.textContent='Ajoute son prénom et choisis votre lien.';error.hidden=false;return}const family=life.pagesV2.people.family,person={uid:'psy-added:'+Date.now().toString(36)+':'+ ++sequence,kind,name:firstName,age:'',custom:kind==='other'?$('[data-other-name]').value.trim():'',responses:{},shared:{},openTopics:['portrait'],verified:true};family.selected=family.selected.filter(role=>role!=='none'&&role!=='skip');if(!family.selected.includes(kind))family.selected.push(kind);(family.pools[kind]||=[]).push(person);family.activeId=person.uid;config.onPeopleChanged?.();question.setEntries(familyChoices());question.select(person.uid);question.page=Math.floor(question.entries.findIndex(entry=>entry.id===person.uid)/2);question.show();name.value='';$('[data-other-name]').value='';kind='';$('[data-role-label]').textContent='Choisir…';$('[data-other-link]').hidden=true;error.hidden=true;search.value='';refreshOptions();closeSheet();renderTestProfile();status.textContent=firstName+' a été ajouté à tes proches et sélectionné dans Psy.'});
 return {button,overlay};
}

function ensureFamily(parent){
 familyQuestion=mountQuestion(parent,'family',DATA.family,{number:'01.1',noRelances:true,onSelection:()=>syncFamily(parent)});
 return familyQuestion;
}
function syncPeople(parent){
 const selected=peopleQuestion.selected;for(const [id,section] of personSections)section.hidden=!selected.has(id);
 for(const entry of peopleQuestion.entries.filter(item=>selected.has(item.id))){let section=personSections.get(entry.id);if(!section){section=disclosure(parent,entry.answer);section.open=true;personSections.set(entry.id,section);mountQuestion(section,'person:'+entry.id,DATA.relations,{number:'01.1.2'})}}
 icons();
}
function syncFamily(parent){
 for(const [id,section] of familySections)section.hidden=!familyQuestion.selected.has(id);
 for(const entry of familyQuestion.entries.filter(item=>familyQuestion.selected.has(item.id))){let section=familySections.get(entry.id);if(!section){section=disclosure(parent,entry.answer);section.open=true;familySections.set(entry.id,section);if(entry.id==='relations'){peopleQuestion=mountQuestion(section,'people',{question:'De qui as-tu envie de me parler ?',entries:familyChoices()},{number:'01.1.1',noRelances:true,onSelection:()=>syncPeople(section)});addPersonSheet(peopleQuestion);syncPeople(section)}else mountQuestion(section,'family:'+entry.id,DATA.familyModels[entry.id],{number:'01.'+(familyQuestion.entries.indexOf(entry)+1)})}}
 icons();
}

function adaptedTopic(id){
 const model=DATA.topicModels[id];if(id==='love')return adaptAffectiveModel(model,life);if(id==='friends')return adaptFriendModel(model,life,'ensemble');if(id==='work')return adaptCombinedActivityModel(model,life);if(id==='feelings')return adaptCombinedEmotionModel(model,life);if(id==='confidence')return adaptConfidenceModel(model,life,'soi');if(id==='change')return adaptChangeModel(model,life,'changements');return model;
}
function syncTopics(parent){
 for(const [id,section] of topicSections)section.hidden=!topicsQuestion.selected.has(id);
 for(const topic of DATA.topics.filter(item=>topicsQuestion.selected.has(item.id))){let section=topicSections.get(topic.id);if(!section){section=disclosure(parent,topic.label);section.open=true;topicSections.set(topic.id,section);if(topic.id==='family'){ensureFamily(section);syncFamily(section);}else if(topic.id==='unknown'){const box=el('div','pp-free-only');box.append(el('p','',DATA.unknown.intro));const fold=el('details','free-fold');fold.open=true;const summary=el('summary','cursor-interaction');summary.append(el('span','','Avec mes mots…'),icon('chevron-down'));freeUnknown=el('textarea','ac-free');freeUnknown.rows=4;freeUnknown.value=config.state.unknown||'';freeUnknown.placeholder=DATA.unknown.freeField.placeholder;freeUnknown.setAttribute('aria-label','Mes mots, sans sujet précis');fold.append(summary,freeUnknown);box.append(fold,quiet('Revenir aux rubriques',()=>{topicsQuestion.root.querySelector('[data-pager]').focus();topicsQuestion.root.scrollIntoView({block:'nearest'})}));section.append(box)}else mountQuestion(section,'topic:'+topic.id,adaptedTopic(topic.id),{number:String(DATA.topics.indexOf(topic)+1).padStart(2,'0')+'.1'})}}
 icons();
}

function hasRecapContent(q){return !!q&&(q.selected.size>0||q.free.trim().length>0)}
function recapText(parent,text,label){
 if(!String(text||'').trim())return false;
 if(label)parent.append(el('p','rc-label',label));
 parent.append(el('p','rc-note',text));return true;
}
function recapQuestion(parent,key,options={}){
 const q=questions.get(key);if(!hasRecapContent(q))return false;
 const block=el('div','rc-question');
 if(options.showQuestion!==false)block.append(el('p','rc-question-title',q.model.question));
 const selected=q.entries.filter(entry=>q.selected.has(entry.id));
 if(selected.length){const list=el('ul','rc-choices');for(const entry of selected)list.append(el('li','',entry.answer));block.append(list)}
 recapText(block,q.free);
 for(const entry of selected){const draft=q.drafts.get(entry.id);if(String(draft||'').trim())recapText(block,draft,entry.prompt||entry.answer)}
 parent.append(block);return true;
}
const recapEditAccess=editAccess;
let recapActiveTheme=null,recapInlineEditor=null;
function recapGlobalAction(editing=false){
 const button=quiet(editing?'Terminer':'Modifier ma préparation',()=>editing?finishRecapEdit():editWholeRecap());
 button.dataset.globalRecapEdit='';button.classList.add('rc-global-action');button.setAttribute('aria-expanded',String(editing));
 if(recapEditAccess==='pencil'&&!editing){button.textContent='';button.append(icon('square-pen'));button.classList.add('rc-global-pencil');button.setAttribute('aria-label','Modifier toute ma préparation');button.setAttribute('data-tooltip','Modifier ma préparation')}
 return button;
}
function recapPageHeading(screen,editing=false){
 const title=el('p','pp-section-title rc-page-title','MA PRÉPARATION');
 if(recapEditAccess==='pencil'){const row=el('div','rc-page-bar');row.append(title,recapGlobalAction(editing));screen.append(row)}
 else{screen.append(title);if(recapEditAccess==='top')screen.append(recapGlobalAction(editing))}
}
function finishRecapEdit(refresh=true){
 if(!recapInlineEditor)return;
 if(closeActivePerson)closeActivePerson();
 const sources=recapInlineEditor.sources;recapInlineEditor=null;
 for(const source of sources){source.remove();source.classList.remove('rc-inline-source');source.hidden=true;pages.append(source)}
 updateHub();
 if(refresh){renderRecap(screens.get('recap'));icons();screens.get('recap').querySelector('[data-global-recap-edit]')?.focus();status.textContent='Toute ta préparation est mise à jour dans cette vue et dans ton carnet.'}
}
function editWholeRecap(){
 const screen=screens.get('recap');if(!screen||recapInlineEditor)return;
 screen.replaceChildren();recapPageHeading(screen,true);
 const sources=[];recapInlineEditor={sources};
 for(const [id,title] of chapterInfo){
  const section=el('details','rc-global-chapter'),summary=el('summary','rc-global-summary cursor-interaction'),number=el('span','rc-chapter-number',String(chapterInfo.findIndex(([key])=>key===id)+1).padStart(2,'0'));
  number.setAttribute('aria-hidden','true');summary.append(number,el('span','rc-chapter-title',title),icon('chevron-down'));section.append(summary);section.dataset.editSection=id;
  const source=ensureScreen(id);source.remove();source.hidden=false;source.classList.add('rc-inline-source');sources.push(source);section.append(source);screen.append(section);
 }
 if(recapEditAccess==='bottom')screen.append(recapGlobalAction(true));
 icons();screen.querySelector('[data-global-recap-edit]')?.focus();status.textContent='Toute ta préparation est modifiable ici. Ouvre les rubriques que tu souhaites ajuster.';
}
function renderRecap(screen){
 screen.replaceChildren();recapPageHeading(screen);
 let count=0,recapThemeHeader=null,moiPanel=null;
 function chapter(id,title,body){
  if(id!=='traverse'){if(moiPanel&&body.children.length)renderMoiDossier(moiPanel,id,title);return}
  if(!body.children.length)return;
  const section=el('section','rc-chapter'),head=el('div','rc-heading'),chapterNumber=String(chapterInfo.findIndex(([key])=>key===id)+1).padStart(2,'0');
  section.setAttribute('data-recap-chapter',id);
  const heading=el('h3'),number=el('span','rc-chapter-number',chapterNumber);number.setAttribute('aria-hidden','true');heading.setAttribute('aria-label','Chapitre '+chapterNumber+' — '+title);heading.append(number,el('span','rc-chapter-title',title));
  head.hidden=recapActiveTheme==='moi';head.append(heading);if(id==='traverse'&&recapThemeHeader)section.append(recapThemeHeader);section.append(head,body);screen.append(section);count++;
 }
 const traverse=el('div','rc-body');
 {
  const activeTopics=[{id:'moi',label:'Moi'},...DATA.topics.filter(item=>topicsQuestion?.selected.has(item.id))],themePanels=new Map(),themeButtons=new Map();
  if(!activeTopics.some(topic=>topic.id===recapActiveTheme))recapActiveTheme=activeTopics[0]?.id||null;
  const themeNav=el('div','rc-theme-tabs');
  if(activeTopics.length>1){themeNav.setAttribute('role','tablist');themeNav.setAttribute('aria-label','Thèmes de ma préparation');recapThemeHeader=themeNav}
  function activateTheme(id){recapActiveTheme=id;const heading=screen.querySelector('[data-recap-chapter="traverse"] .rc-heading');if(heading)heading.hidden=id==='moi';for(const [key,panel] of themePanels)panel.hidden=key!==id;for(const [key,button] of themeButtons)button.setAttribute('aria-selected',String(key===id));themeButtons.get(id)?.scrollIntoView({block:'nearest',inline:'nearest'})}
  for(const topic of activeTopics){
   const group=el('section','rc-topic');
   if(activeTopics.length>1){
    const tab=el('button','rc-theme-tab cursor-interaction');tab.type='button';tab.append(el('span','rc-theme-label',topic.label));tab.id=host.id+'-recap-tab-'+topic.id;group.id=host.id+'-recap-panel-'+topic.id;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',group.id);tab.setAttribute('aria-selected',String(topic.id===recapActiveTheme));group.setAttribute('role','tabpanel');group.setAttribute('aria-labelledby',tab.id);group.hidden=topic.id!==recapActiveTheme;themePanels.set(topic.id,group);themeButtons.set(topic.id,tab);themeNav.append(tab);tab.addEventListener('click',()=>activateTheme(topic.id));
    tab.addEventListener('keydown',event=>{const keys=['ArrowRight','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;event.preventDefault();const index=activeTopics.findIndex(item=>item.id===topic.id),next=event.key==='Home'?0:event.key==='End'?activeTopics.length-1:(index+(event.key==='ArrowRight'?1:-1)+activeTopics.length)%activeTopics.length;activateTheme(activeTopics[next].id);themeButtons.get(activeTopics[next].id).focus()});
   }else{const themeHeading=el('h4','rc-subtitle');themeHeading.append(el('span','rc-theme-label',topic.label));recapThemeHeader=themeHeading}
   if(topic.id==='moi'){moiPanel=group;group.dataset.moiPanel=''}
   else if(topic.id==='unknown'){if(!recapText(group,freeUnknown?.value))group.append(el('p','rc-pending','Un espace libre à retrouver quand tu le souhaites.'))}
   else if(topic.id==='family')renderTraverseFamily(group);
   else renderTopicDossiers(group,topic.id);
   traverse.append(group);
  }
 }
 chapter('traverse','Ce que je traverse',traverse);
 const attentes=el('div','rc-body');Object.keys(DATA.attentes.questions).forEach(key=>recapQuestion(attentes,'attentes:'+key));chapter('attentes','Ce que j’aimerais changer',attentes);
 const histoire=el('div','rc-body');
 if(timeline?.entries.length){const list=el('ul','rc-landmarks');for(const entry of timeline.entries){const row=el('li');if(entry.period)row.append(el('span','rc-period',entry.period));row.append(el('span','rc-landmark-title',entry.label));list.append(row)}histoire.append(list)}
 recapQuestion(histoire,'histoire:meaning');chapter('histoire','Un peu de moi',histoire);
 const pratique=el('div','rc-body'),pq=questions.get('pratique');
 if(pq){for(const entry of pq.entries.filter(item=>pq.selected.has(item.id))){const block=el('div','rc-question');block.append(el('p','rc-question-title',entry.prompt||entry.answer));recapText(block,pq.drafts.get(entry.id),'Réponse notée');pratique.append(block)}recapText(pratique,pq.free,'Ma question, avec mes mots')}
 chapter('pratique','Ce que j’aimerais savoir',pratique);
 const confort=el('div','rc-body');recapQuestion(confort,'confort',{showQuestion:false});chapter('confort','Pour me sentir bien',confort);
 completeMoiPanel(moiPanel);
 if(!count){screen.append(el('p','rc-empty','Tu n’as encore rien ajouté à cette préparation. Tu peux commencer par une rubrique ou quelques mots libres.'))}
 if(recapEditAccess==='bottom')screen.append(recapGlobalAction());
 const back=quiet(returnLabel,()=>{path=['entry'];show('entry',false);app.scrollIntoView({block:'start'});host.querySelector('[data-start]')?.focus({preventScroll:true})});back.dataset.returnPsy='';back.classList.add('rc-back');screen.append(back);screen.querySelector('.rc-theme-tab[aria-selected="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});
}

function createScreen(id,title,intro){const section=el('section','pp-screen');section.dataset.pageKey=id;section.hidden=true;section.append(el('p','pp-section-title',title.toUpperCase()));if(intro)welcome(section,intro);pages.append(section);screens.set(id,section);return section}
function ensureScreen(id){
 if(screens.has(id))return screens.get(id);
 if(id==='recap')return createScreen(id,'Ma préparation');
 const info=chapterInfo.find(([key])=>key===id);if(!info)return null;
 if(id==='traverse'){const screen=createScreen(id,info[1],'On peut poser ce que tu vis et ce qui t’amène à consulter, tout doucement.');topicsQuestion=mountQuestion(screen,'topics',{question:'De quoi aimerais-tu parler ?',entries:DATA.topics.map(topic=>({id:topic.id,answer:topic.label}))},{number:'01',noRelances:true,exclusive:topicId=>topicId==='unknown',onSelection:()=>syncTopics(screen)});syncTopics(screen);return screen}
 if(id==='attentes'){const screen=createScreen(id,info[1],DATA.attentes.intro);Object.entries(DATA.attentes.questions).forEach(([key,model],index)=>{const box=index?el('div','pp-module-split'):screen;if(index)screen.append(box);mountQuestion(box,'attentes:'+key,model,{number:String(index+1).padStart(2,'0')})});return screen}
 if(id==='histoire'){const screen=createScreen(id,info[1],DATA.histoire.intro);const wrap=host.querySelector('[data-timeline-template]').content.cloneNode(true);screen.append(wrap);timeline=mountHistoryTimeline(screen,life);const divider=el('div','pp-module-split');screen.append(divider);mountQuestion(divider,'histoire:meaning',DATA.histoire.questions.histoire,{number:'01'});return screen}
 if(id==='pratique'){const screen=createScreen(id,info[1],DATA.pratique.intro);mountQuestion(screen,'pratique',{question:DATA.pratique.question,entries:DATA.pratique.entries},{number:'01',practical:true});return screen}
 if(id==='confort'){const screen=createScreen(id,info[1],DATA.confort.intro);mountQuestion(screen,'confort',modelFromPairs(DATA.confort.question,DATA.confort.answers),{number:'01',noRelances:true,freePlaceholder:DATA.confort.freeField.placeholder});return screen}
}

function progress(id){
 const checks=[];const add=key=>checks.push(questions.get(key)?.answered||false);
 if(id==='traverse'){add('topics');if(topicsQuestion)for(const topicId of topicsQuestion.selected){if(topicId==='unknown')checks.push(!!freeUnknown?.value.trim());else if(topicId==='family'){add('family');if(familyQuestion)for(const branchId of familyQuestion.selected){if(branchId==='relations'){add('people');if(peopleQuestion)for(const personId of peopleQuestion.selected)add('person:'+personId)}else add('family:'+branchId)}}else add('topic:'+topicId)}}
 if(id==='attentes')Object.keys(DATA.attentes.questions).forEach(key=>add('attentes:'+key));
 if(id==='histoire'){checks.push(!!timeline?.entries.length);add('histoire:meaning')}
 if(id==='pratique')add('pratique');if(id==='confort')add('confort');
 const answered=checks.filter(Boolean).length,total=checks.length;
 return {answered,total,percent:total?Math.round(answered/total*100):0};
}
function updateHub(){for(const [id,row] of chapterRows){const {answered,total,percent}=progress(id),track=row.querySelector('[data-progress-track]');row.querySelector('[data-progress-fill]').style.width=percent+'%';track.setAttribute('aria-valuenow',String(percent));track.setAttribute('aria-valuetext',answered+' / '+total+' questions renseignées');row.querySelector('[data-progress-value]').textContent=answered+' / '+total}}
function closeChrome(){if(closeActivePerson)closeActivePerson();host.querySelector('#'+instanceId+'-menu').hidden=true;host.querySelector('[data-menu-scrim]').hidden=true;host.querySelector('[data-menu-button]').setAttribute('aria-expanded','false');host.querySelector('#'+instanceId+'-pet-bubble').hidden=true;host.querySelector('[data-pet]').setAttribute('aria-expanded','false');pages.inert=false}
function show(id,push=true){config.state.route=id;if(recapInlineEditor)finishRecapEdit(false);const screen=ensureScreen(id)||screens.get(id);if(!screen)return;closeChrome();if(push&&path.at(-1)!==id)path.push(id);for(const [key,node] of screens)node.hidden=key!==id;host.querySelector('[data-app-title]').textContent=id==='entry'?'MON ESPACE PSY':'MA PREMIÈRE SÉANCE';if(id==='hub')updateHub();if(id==='recap')renderRecap(screen);icons();status.textContent=id==='recap'?'Le récapitulatif de ma préparation.':id==='hub'?'Les rubriques de préparation.':id==='entry'?'Mon espace Psy.':chapterInfo.find(([key])=>key===id)?.[1]||'Ma première séance.'}


pages.querySelectorAll('[data-page-key]').forEach(node=>screens.set(node.dataset.pageKey,node));
chapterInfo.forEach(([id,title])=>{const b=el('button','pp-chapter mvc cursor-interaction');b.type='button';const heading=el('span','mvch');heading.append(el('b','pp-chapter-title',title));const row=el('span','pp-progress-row mvpr'),track=el('span','pp-progress-track mvpg'),fill=el('i'),value=el('em','pp-percent mvcnt','0 / '+progress(id).total);track.dataset.progressTrack='';track.setAttribute('role','progressbar');track.setAttribute('aria-label','Progression de '+title);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow','0');fill.dataset.progressFill='';fill.style.width='0%';track.append(fill);value.dataset.progressValue='';row.append(track,value);b.append(heading,el('small','pp-chapter-subtitle',chapterSubtitles[id]),row);b.addEventListener('click',()=>show(id));host.querySelector('[data-chapters]').append(b);chapterRows.set(id,b)});
host.querySelector('[data-start]').addEventListener('click',()=>show('hub'));host.querySelector('[data-back]').addEventListener('click',()=>{if(closeActivePerson){closeActivePerson();return}if(recapInlineEditor){finishRecapEdit();return}if(path.length>1){path.pop();show(path.at(-1),false)}else config.onExit()});
host.querySelector('[data-ongoing]').addEventListener('click',()=>config.onOngoing());host.querySelector('[data-later]').addEventListener('click',()=>config.onExit());
host.querySelector('[data-menu-button]').addEventListener('click',()=>{const open=host.querySelector('#'+instanceId+'-menu').hidden;closeChrome();host.querySelector('#'+instanceId+'-menu').hidden=!open;host.querySelector('[data-menu-scrim]').hidden=!open;host.querySelector('[data-menu-button]').setAttribute('aria-expanded',String(open));pages.inert=open;if(open)host.querySelector('[data-menu-close]').focus()});
for(const selector of ['[data-menu-close]','[data-menu-scrim]'])host.querySelector(selector).addEventListener('click',()=>{closeChrome();host.querySelector('[data-menu-button]').focus()});
host.querySelector('[data-menu-psy]').addEventListener('click',()=>{path=['entry'];show('entry',false)});host.querySelectorAll('[data-outside]').forEach(b=>b.addEventListener('click',()=>{closeChrome();config.onNavigate(b.dataset.outside==='Accueil'?'home':'mj')}));host.querySelector('[data-life-view]').addEventListener('click',()=>{closeChrome();config.onNavigate('mvfiche')});
host.querySelector('[data-pet]').addEventListener('click',()=>{const open=host.querySelector('#'+instanceId+'-pet-bubble').hidden;closeChrome();host.querySelector('#'+instanceId+'-pet-bubble').hidden=!open;host.querySelector('[data-pet]').setAttribute('aria-expanded',String(open))});host.querySelector('[data-pet-close]').addEventListener('click',()=>{closeChrome();host.querySelector('[data-pet]').focus()});host.addEventListener('keydown',event=>{if(event.key==='Escape'&&(!host.querySelector('#'+instanceId+'-menu').hidden||!host.querySelector('#'+instanceId+'-pet-bubble').hidden)){event.preventDefault();closeChrome()}});
host.querySelectorAll('[data-preparation-action]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.preparationAction==='confirm'){config.onConfirm(snapshot()).then(()=>{previewStatus.textContent='';show('recap');app.scrollIntoView({block:'start'});screens.get('recap').querySelector('button')?.focus({preventScroll:true})}).catch(()=>{})}else config.onExit()}));
chapterInfo.forEach(([id])=>ensureScreen(id));show(config.initialPage||config.state.route||'entry',false);


const sharedRoot=host;
const commonStyles={
 page:{font:'Cormorant SC',size:16,color:'Taupe rosé'},
 chapter:{font:'Cormorant Garamond',size:20,color:'Aubergine'},
 theme:{font:'Cormorant Garamond',size:15,color:'Aubergine'},
 branch:{font:'Cormorant Garamond',size:17,color:'Prune'},
 person:{font:'Cormorant Garamond',size:18,color:'Prune'},
 question:{font:'Cormorant Garamond',size:17,color:'Prune'},
 answer:{font:'Cormorant Garamond',size:17,color:'Prune'},
 words:{font:'Cormorant Garamond',size:17,color:'Prune'},
 label:{font:'Cormorant Garamond',size:15,color:'Taupe rosé'}
};
const commonPalettes={'Aubergine':['#68465d','#e6c8dc'],'Taupe rosé':['#7a5566','#c9a7b6'],'Prune':['#6b3f55','#efd6e0']};
function applyCommonStyles(){
 for(const [key,style] of Object.entries(commonStyles)){
  sharedRoot.style.setProperty('--common-'+key+'-font',"'"+style.font+"',Georgia,serif");
  sharedRoot.style.setProperty('--common-'+key+'-size',style.size+'px');
  const pair=commonPalettes[style.color];sharedRoot.style.setProperty('--common-'+key+'-color','light-dark('+pair[0]+','+pair[1]+')');
 }
}
commonStyles.question.size=15;commonStyles.answer.size=16;if(presentation==='paper'){commonStyles.answer.font='Newsreader';commonStyles.answer.size=15;}
applyCommonStyles();
if(false){
 function registerCommonGroup(container,label,groups){
  container.setAttribute('aria-label',label);const controls=new Tweak({container,onChange:applyCommonStyles});
  for(const [key,title] of groups){const style=commonStyles[key];
   controls.addSelect(style,'font',{label:title+' · police',options:['Cormorant Garamond','Cormorant SC','Newsreader'],reference:'common.'+key+'.font'});
   controls.addSlider(style,'size',{label:title+' · taille',min:12,max:26,step:1,unit:'px',reference:'common.'+key+'.size'});
   controls.addSelect(style,'color',{label:title+' · couleur',options:Object.keys(commonPalettes),reference:'common.'+key+'.color'});
  }
 }
 registerCommonGroup(sharedRoot,'Titres principaux · réglages partagés',[['page','Titre de page'],['chapter','Titres de chapitre']]);
 registerCommonGroup(app,'Onglets et sous-titres · réglages partagés',[['theme','Onglets'],['branch','Sous-rubriques'],['person','Prénoms'],['question','Questions']]);
 registerCommonGroup(pages,'Réponses et notes · réglages partagés',[['answer','Choix de réponse'],['words','Mots écrits'],['label','Repères et relances']]);
}


function snapshot(){
 const data={questions:{},timeline:(timeline?.entries||[]).map(item=>({...item})),unknown:freeUnknown?.value||'',route:config.state.route||path.at(-1)||'entry'};
 for(const [key,q] of questions)data.questions[key]={selected:[...q.selected],drafts:[...q.drafts],free:q.free,page:q.page,active:q.active,question:q.model.question,entries:q.entries.map(entry=>({id:entry.id,answer:entry.answer,prompt:typeof entry.prompt==='string'?entry.prompt:'',custom:!!entry.custom})),custom:q.entries.filter(entry=>entry.custom)};
 return data;
}
return {show,snapshot,host};

}

return mountPreview('pp-later-pill','pencil','folders','editorial','Mes notes','Retour à mon espace psy');




};})();
