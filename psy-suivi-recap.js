/* Le récapitulatif lit les formulaires existants : aucune interprétation des réponses. */
(function(global){
 'use strict';
 const CHAPTERS=[
  {id:'commencement',title:'Quand tout a commencé',short:'Au début',fields:['psyf-qtc-reason','psyf-qtc-hopes','psyf-qtc-feelings']},
  {id:'parcours',title:'Le chemin déjà parcouru',short:'Le chemin',fields:['psyf-parcours-topics','psyf-parcours-moments']},
  {id:'present',title:'Là où j’en suis',short:'Aujourd’hui',fields:['psyf-present-feeling','psyf-present-changes']},
  {id:'next',title:'Ce que j’aimerais pour la suite',short:'La suite',fields:['psyf-next-wishes']}
 ];
 const checked=menu=>menu?[...menu.querySelectorAll('input')].filter(input=>input.checked).map(input=>input.parentElement.querySelector('span')?.textContent.trim()||'').filter(Boolean):[];
 function collect(root){
  const chapters=CHAPTERS.map(chapter=>({...chapter,questions:chapter.fields.map(id=>{
   const input=root.querySelector('#'+id),section=input.closest('.psyf-question');
   const label=section.querySelector('label[for="'+id+'"]'),title=(label?.textContent||'').replace(/^\s*\d+\s*/,'').trim();
   const answers=checked(section.querySelector(':scope > .psyf-reason-help .psyf-reason-menu'));
   const followups=[...section.querySelectorAll('.psyf-followup')].filter(node=>!node.hidden).map(node=>({title:node.querySelector('.psyf-followup-question')?.textContent.trim()||'',answers:checked(node.querySelector('.psyf-reason-menu')),notes:node.querySelector('[data-psy-note-key]')?.value.trim()||''})).filter(item=>item.answers.length||item.notes);
   return {title,answers,notes:input.value.trim(),followups};
  }).filter(item=>item.answers.length||item.notes||item.followups.length)}));
  const unknown=root.querySelector('[data-forgot]').checked;
  const period=unknown?'Je ne sais plus':[root.querySelector('#psyf-qtc-month').value,root.querySelector('#psyf-qtc-year').value].filter(Boolean).join(' ');
  if(period)chapters[0].questions.unshift({title:'Quand as-tu commencé à voir ta psy ?',answers:[period],notes:'',followups:[]});
  return chapters;
 }
 global.__enFollowupRecapModel={collect,chapters:CHAPTERS};
 global.__enMountFollowupRecap=function(options){
  const {document,root,paper,themes,forms,state}=options;
  const el=(tag,cls='',text)=>{const node=document.createElement(tag);node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  const pencil=()=>{const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML='<path d="m16 3 5 5L8 21H3v-5L16 3Z M13 6l5 5"/>';return svg;};
  let active=CHAPTERS.some(chapter=>chapter.id===state.recapTab)?state.recapTab:'commencement',visible=false,editing=false,anchors=[];
  const screen=el('section','psy-recap');screen.hidden=true;screen.setAttribute('aria-label','Le récapitulatif de mon suivi');screen.dataset.followupRecap='';paper.append(screen);
  const actions=el('footer','psy-hub-actions');actions.setAttribute('aria-label','Actions de mon suivi');
  const opener=el('button','psy-recap-open cursor-interaction','Confirmer');opener.type='button';opener.dataset.openFollowupRecap='';
  const later=el('button','psy-hub-later cursor-interaction','Je reviendrai plus tard');later.type='button';later.dataset.followupLater='';later.addEventListener('click',()=>{(options.onLater||options.onExit)();});
  actions.append(opener,later);themes.querySelector('[data-chapters]').after(actions);
  opener.addEventListener('click',()=>options.saveThen(()=>open()));
  function selectTab(id,focus=false){active=id;state.recapTab=id;for(const button of screen.querySelectorAll('[data-recap-tab]')){const selected=button.dataset.recapTab===id;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;if(selected){if(focus)button.focus();button.scrollIntoView({inline:'nearest',block:'nearest'});}}
   for(const panel of screen.querySelectorAll('[data-recap-panel]'))panel.hidden=panel.dataset.recapPanel!==id;
  }
  function answerList(parent,answers){if(!answers.length)return;const list=el('ul','psy-recap-answers');for(const answer of answers)list.append(el('li','',answer));parent.append(list);}
  function note(parent,text){if(!text)return;const paragraph=el('p','psy-recap-note'),label=el('span','psy-recap-note-label','Mes notes');paragraph.append(label,document.createTextNode(text));parent.append(paragraph);}
  function restoreForms(){if(!editing)return;for(const {node,anchor,hidden} of anchors){anchor.replaceWith(node);node.hidden=hidden;}anchors=[];editing=false;screen.classList.remove('psy-recap-editing');}
  function heading(isEditing){const head=el('div','psy-recap-head'),title=el('h3','psy-recap-title',isEditing?'MODIFIER MON SUIVI':'MON RÉCAPITULATIF'),button=el('button','psy-recap-pencil cursor-interaction');button.type='button';button.dataset.editFollowupRecap='';button.setAttribute('aria-label',isEditing?'Enregistrer les modifications':'Modifier tout mon suivi');button.append(pencil());button.addEventListener('click',()=>isEditing?finishEdit():edit());head.append(title,button);screen.append(head);}
  function render(){
   screen.replaceChildren();heading(false);
   const tabs=el('div','psy-recap-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Rubriques du récapitulatif');screen.append(tabs);
   for(const chapter of collect(root)){
    const button=el('button','psy-recap-tab cursor-interaction',chapter.short);button.type='button';button.dataset.recapTab=chapter.id;button.id='psy-recap-tab-'+chapter.id;button.setAttribute('role','tab');button.setAttribute('aria-controls','psy-recap-panel-'+chapter.id);button.addEventListener('click',()=>selectTab(chapter.id));button.addEventListener('keydown',event=>{const delta=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;if(!delta)return;event.preventDefault();selectTab(CHAPTERS[(CHAPTERS.findIndex(item=>item.id===active)+delta+CHAPTERS.length)%CHAPTERS.length].id,true);});tabs.append(button);
    const panel=el('div','psy-recap-panel');panel.id='psy-recap-panel-'+chapter.id;panel.dataset.recapPanel=chapter.id;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);panel.append(el('h4','psy-recap-chapter',chapter.title));
    if(!chapter.questions.length)panel.append(el('p','psy-recap-empty','Tu peux compléter cette rubrique quand tu le souhaites.'));
    for(const question of chapter.questions){const block=el('section','psy-recap-question');block.append(el('p','psy-recap-prompt',question.title));answerList(block,question.answers);note(block,question.notes);for(const followup of question.followups){const details=el('div','psy-recap-followup');details.append(el('p','psy-recap-followup-title',followup.title));answerList(details,followup.answers);note(details,followup.notes);block.append(details);}panel.append(block);}screen.append(panel);
   }
   const summary=themes.querySelector('[data-summary-text]')?.value.trim();if(summary){const folder=el('details','psy-recap-summary'),label=el('summary','cursor-interaction','Mon résumé déposé');folder.append(label,el('p','psy-recap-note',summary));screen.append(folder);}
   const back=el('button','psy-recap-back cursor-interaction','Retour à mon espace psy');back.type='button';back.addEventListener('click',options.onExit);screen.append(back);selectTab(active);
  }
  function open(focus=true){restoreForms();visible=true;root.hidden=false;themes.hidden=true;forms.forEach(node=>node.hidden=true);options.title('MON SUIVI');screen.hidden=false;render();if(focus)screen.querySelector('[data-edit-followup-recap]').focus({preventScroll:true});options.onViewChange();}
  function close(){restoreForms();visible=false;screen.hidden=true;}
  function edit(){
   screen.replaceChildren();heading(true);editing=true;screen.classList.add('psy-recap-editing');
   forms.forEach((node,index)=>{const anchor=document.createComment('emplacement du formulaire');node.before(anchor);anchors.push({node,anchor,hidden:node.hidden});const folder=el('details','psy-recap-edit-folder'),summary=el('summary','cursor-interaction',CHAPTERS[index].title);folder.open=CHAPTERS[index].id===active;folder.append(summary,node);node.hidden=false;for(const step of node.querySelectorAll('[data-step]'))step.hidden=false;screen.append(folder);});
   const done=el('button','psy-recap-save cursor-interaction','Enregistrer les modifications');done.type='button';done.addEventListener('click',finishEdit);screen.append(done);screen.querySelector('[data-edit-followup-recap]').focus({preventScroll:true});
  }
  function finishEdit(){options.saveThen(()=>{restoreForms();open(false);screen.querySelector('[data-edit-followup-recap]').focus({preventScroll:true});});}
  options.backButton.addEventListener('click',event=>{if(!visible)return;event.preventDefault();event.stopImmediatePropagation();if(editing)finishEdit();else options.saveThen(()=>{close();options.onThemes();});},true);
  return {open,close,get visible(){return visible;},get editing(){return editing;},get tab(){return active;},collect:()=>collect(root)};
 };
})(globalThis);
