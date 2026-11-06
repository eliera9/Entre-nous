/* Accueil validé avec Eli : les données restent dans le coffre existant. */
(()=>{
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const dayKey=(date=new Date())=>date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
 const word=v=>v<15?'Très bas':v<30?'Bas':v<44?'Plutôt bas':v<57?'Neutre':v<71?'Plutôt bien':v<86?'Bien':'Très bien';
 const palette=['#a99cc4','#c3b3d6','#e6d3dc','#e9bcc4','#d99aa8'];
 function color(value){const x=Math.max(0,Math.min(100,Number(value)||0))/25,k=Math.min(3,Math.floor(x)),f=x-k;return 'rgb('+[1,3,5].map(i=>Math.round(parseInt(palette[k].slice(i,i+2),16)*(1-f)+parseInt(palette[k+1].slice(i,i+2),16)*f)).join(',')+')';}
 function toggleFeeling(values,value){if(value==='pas grand-chose')return values.includes(value)?[]:[value];const next=values.filter(x=>x!=='pas grand-chose');return next.includes(value)?next.filter(x=>x!==value):next.concat(value);}
 const DAILY='Une pensée qui tourne, quelque chose à raconter, ou juste un petit passage… je suis là.';
 const WELCOME='Bienvenue dans ton petit espace. Tu veux que je te fasse découvrir les lieux ? On fait le tour ensemble, tranquillement.';
 function moodMessage(value){return value<44?'Merci de me le confier. Tu peux en rester là, ou poser quelques mots si tu en as envie.':value<57?'Pas besoin de chercher quelque chose de particulier à raconter. Ce qui te vient a sa place ici.':'Si tu as envie de garder une trace de ce moment, tu peux le raconter ici.';}
 window.__enAccueilTools={dayKey,word,color,toggleFeeling,moodMessage,DAILY,WELCOME};
 window.__enInitAccueil=function(){
  const H=document.getElementById('home');if(!H||H.dataset.accueilValide)return;H.dataset.accueilValide='true';
  const $=s=>H.querySelector(s),body=$('.body'),header=$('.heph'),oldMood=$('#humeur'),writing=$('.wr');
  if(!body||!header||!oldMood||!writing)return;
  const keep=window.__enKeep||((key,value)=>value),stored=keep('accueil-valide-v1',{version:1,invitationSeen:false,tourComplete:false});
  const save=()=>Promise.resolve(window.__vaultPushNow?.()).catch(()=>{});
  const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
  const motion=()=>!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches&&load('en-anim',1)!==0;
  const night=()=>H.classList.contains('nuit')||document.documentElement.classList.contains('en-nuit');
  const petAsset=()=>{const kind=['chat','panda','lapin','chien'].includes(window.__pet)?window.__pet:'chat';return 'illus/avatars-compagnons/'+kind+'-'+(night()?'nuit':'jour')+'.svg';};
  const ICON={close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'};

  /* Le moteur d’humeur historique conserve son historique et ses sauvegardes. */
  oldMood.classList.add('av-legacy');oldMood.setAttribute('aria-hidden','true');oldMood.inert=true;
  const mood=document.createElement('section');mood.className='av-mood';mood.setAttribute('aria-label','Ton humeur');
  mood.innerHTML='<div class="av-ornament" aria-hidden="true"><img src="illus/accueil-valide/etoile-du-nord.png" alt=""></div><h2 class="av-question">Comment te sens-tu ?</h2><div class="av-edit"><output for="av-range">Neutre</output><div class="av-slider"><div class="av-track" aria-hidden="true"></div><input id="av-range" type="range" min="0" max="100" value="50" aria-label="Mon humeur"></div><button type="button" class="av-note">Noter mon humeur</button></div><div class="av-saved" hidden><button type="button" class="av-status" aria-label="Modifier mon humeur"><i aria-hidden="true"></i><span></span></button><p class="av-response">Prends ton temps. Tu peux me raconter ce qui te vient.</p></div>';
  oldMood.before(mood);
  const oldRange=$('#mood'),oldOK=$('#mood-ok'),range=mood.querySelector('input');
  const initial=load('en-acc-hum',null),today=dayKey();let value=initial?.day===today?Number(initial.v):50,saved=initial?.day===today;
  if(!Number.isFinite(value))value=50;
  const cards=[...writing.querySelectorAll('.wc')],kinds=['raconter','guider','vider'];
  cards.sort((a,b)=>kinds.findIndex(k=>a.querySelector('img')?.getAttribute('src')?.includes('ecrire-'+k))-kinds.findIndex(k=>b.querySelector('img')?.getAttribute('src')?.includes('ecrire-'+k))).forEach(c=>writing.append(c));
  function labelCards(){const labels=[['Me raconter','Tout ce qui vient'],['Être guidée','Pas à pas'],['Vider mon sac','Sans filtre']];cards.forEach((card,i)=>{card.classList.remove('pick');const title=card.querySelector('b'),sub=card.querySelector('span');if(title&&title.textContent!==labels[i][0])title.textContent=labels[i][0];if(sub&&sub.textContent!==labels[i][1])sub.textContent=labels[i][1];});}
  function renderMood(){
   mood.style.setProperty('--av-mood-color',color(value));mood.style.setProperty('--av-position',value/100);writing.style.setProperty('--av-mood-color',color(value));range.value=String(value);range.setAttribute('aria-valuetext',word(value));
   mood.querySelector('output').textContent=word(value);mood.querySelector('.av-question').textContent=saved?'Ton humeur du moment':'Comment te sens-tu ?';
   mood.querySelector('.av-edit').hidden=saved;mood.querySelector('.av-saved').hidden=!saved;
   mood.querySelector('.av-status span').textContent=word(value)+(night()?', ce soir.':', aujourd’hui.');
   labelCards();
  }
  let animationFrame=0;
  function inviteCards(){cancelAnimationFrame(animationFrame);writing.classList.remove('av-invited');if(motion())animationFrame=requestAnimationFrame(()=>{animationFrame=requestAnimationFrame(()=>writing.classList.add('av-invited'));});}
  range.addEventListener('input',()=>{value=Number(range.value);renderMood();});
  mood.querySelector('.av-note').addEventListener('click',()=>{oldRange.value=String(value);oldRange.dispatchEvent(new Event('input',{bubbles:true}));oldOK.click();});
  oldOK.addEventListener('click',()=>{value=Number(oldRange.value);saved=true;renderMood();inviteCards();context={kind:'mood',value,day:dayKey()};save();});
  mood.querySelector('.av-status').addEventListener('click',()=>{saved=false;renderMood();range.focus({preventScroll:true});});
  new MutationObserver(labelCards).observe(writing,{subtree:true,childList:true,characterData:true});
  renderMood();

  /* Les quatre dessins sont les mêmes sur les onglets qui partagent la barre. */
  const navIcons={home:'accueil',mj:'journal',mvfiche:'espace',psy:'psy'};
  document.querySelectorAll('#en-app .nav.nav2').forEach(nav=>{
   nav.classList.add('av-nav');nav.parentElement.classList.add('av-nav-page');
   [...nav.children].filter(el=>el.matches('[data-nav],span')).forEach((item,index)=>{
    const key=item.dataset.nav||['home','mj','mvfiche','psy'][index],name=navIcons[key];if(!name)return;
    const art=document.createElement('i');art.className='av-nav-art';art.setAttribute('aria-hidden','true');art.style.setProperty('--av-nav-art','url("illus/accueil-valide/nav-'+name+'-line-art.png")');item.prepend(art);
   });
   const plus=nav.querySelector('.navw');if(plus)plus.innerHTML=ICON.plus;
  });

  let context={kind:'daily'},bubble=null,guide=null,pendingStep=null,feedback=null,closingTimer=0;
  const companion=()=>$('.hpl');
  function closeBubble(focus=true){if(!bubble)return;bubble.remove();bubble=null;companion()?.setAttribute('aria-expanded','false');if(focus)companion()?.focus({preventScroll:true});}
  function eventMessage(){const event=$('.hev');if(!event||event.classList.contains('none'))return null;const title=event.querySelector('.n')?.textContent.trim(),when=event.querySelector('.w')?.textContent.trim();return title&&when?title+' '+when+'. Tu peux noter ce que tu aimerais garder en tête.':null;}
  function companionMessage(){if(context.day&&context.day!==dayKey())context={kind:'daily'};if(context.kind==='step')return 'Voilà un petit pas de fait.';if(context.kind==='mood')return moodMessage(context.value);return eventMessage()||DAILY;}
  function positionBubble(){if(!bubble)return;const button=companion();if(!button)return;const h=H.getBoundingClientRect(),r=button.getBoundingClientRect(),scale=h.width/H.offsetWidth||1;const top=(r.bottom-h.top)/scale+10;const max=Math.max(12,H.clientHeight-bubble.offsetHeight-12);bubble.style.top=Math.max(12,Math.min(top,max))+'px';}
  function openBubble(invitation=false){
   closeBubble(false);if(guide||feedback)return;
   const node=document.createElement('section');node.className='av-bubble';node.setAttribute('role','dialog');node.setAttribute('aria-label','Un mot de ton compagnon');
   const petName=window.__petName||({chat:'Plume',panda:'Panda',lapin:'Lapin',chien:'Chien'}[window.__pet||'chat']);
   node.innerHTML='<p class="av-signature"></p><button type="button" class="av-dismiss" aria-label="Fermer la bulle">'+ICON.close+'</button><p class="av-message"></p>'+(invitation?'<div class="av-bubble-actions"><button type="button" class="av-primary">Oui, montre-moi</button><button type="button" class="av-later">Plus tard</button></div>':'');
   node.querySelector('.av-signature').textContent=petName;node.querySelector('.av-message').textContent=invitation?WELCOME:companionMessage();
   H.append(node);bubble=node;companion()?.setAttribute('aria-expanded','true');node.querySelector('.av-dismiss').onclick=()=>closeBubble();
   node.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeBubble();}});
   if(invitation){stored.invitationSeen=true;save();node.querySelector('.av-primary').onclick=startTour;node.querySelector('.av-later').onclick=()=>closeBubble();}
   positionBubble();window.__enSyncChrome?.();
  }
  H.addEventListener('click',e=>{if(e.target.closest('.hpl')){e.preventDefault();e.stopImmediatePropagation();if(bubble)closeBubble();else{openBubble();bubble?.querySelector('.av-dismiss').focus();}}else if(bubble&&!e.target.closest('.av-bubble'))closeBubble(false);},true);
  const previousPlume=window.__plumeBub;window.__plumeBub=(phone,button)=>phone===H?openBubble():previousPlume?.(phone,button);

  /* Invitation à la première arrivée seulement ; aucun accès dans la bulle quotidienne. */
  function welcome(){if(!stored.invitationSeen&&!stored.tourComplete&&H.classList.contains('en-on')&&!document.getElementById('en-lock')&&!guide&&!feedback)openBubble(true);}
  function inertChildren(except){return [...H.children].filter(el=>el!==except).map(el=>{const previous=el.inert;el.inert=true;return [el,previous];});}
  function restoreInert(list){list.forEach(([el,previous])=>{if(el.isConnected)el.inert=previous;});}
  function trap(e,node){if(e.key!=='Tab')return;const buttons=[...node.querySelectorAll('button,input,textarea')].filter(el=>!el.hidden&&!el.disabled&&!el.closest('[hidden]'));const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
  const tourSteps=()=>[
   {el:mood,text:'Ici, tu peux noter comment tu te sens. Tu peux aussi simplement passer, sans rien remplir.'},
   {el:writing,text:'Pour écrire, choisis ce qui te convient : te raconter, être guidée, ou vider ton sac.'},
   {el:$('.av-nav'),text:'En bas, tu retrouves ton journal, ton espace personnel et ton espace psy. Le + te permet de commencer à écrire.'},
   {el:companion(),text:'Et moi, tu me retrouves ici. Touche-moi quand tu as envie d’un petit mot. Tu peux maintenant explorer à ton rythme.'}
  ].filter(step=>step.el);
  function stopTour(complete=false){if(!guide)return;if(complete){stored.tourComplete=true;save();}const current=guide;guide=null;current.node.remove();restoreInert(current.inert);companion()?.focus({preventScroll:true});window.__enSyncChrome?.();}
  function placeTour(){
   if(!guide)return;const current=guide,step=current.steps[current.index],el=step.el;
   const sc=el.closest('.body');if(sc){const er=el.getBoundingClientRect(),sr=sc.getBoundingClientRect();if(er.top<sr.top+16||er.bottom>sr.bottom-16)sc.scrollTop+=(er.top+er.bottom-sr.top-sr.bottom)/2;}
   const hr=H.getBoundingClientRect(),r=el.getBoundingClientRect(),scale=hr.width/H.offsetWidth||1,pad=5;
   const x=(r.left-hr.left)/scale-pad,y=(r.top-hr.top)/scale-pad,w=r.width/scale+pad*2,h=r.height/scale+pad*2;
   Object.assign(current.spot.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px',borderRadius:el===companion()?'50%':'25px'});
   const th=current.tip.offsetHeight,above=y-th-18,below=y+h+18;
   current.tip.style.top=Math.max(12,Math.min(above>=12?above:below,H.clientHeight-th-12))+'px';
  }
  function paintTour(){if(!guide)return;const current=guide,last=current.index===current.steps.length-1;current.tip.querySelector('.av-signature').textContent=(window.__petName||'Plume')+' · '+(current.index+1)+' / '+current.steps.length;current.tip.querySelector('.av-message').textContent=current.steps[current.index].text;current.next.textContent=last?'À moi de découvrir':'Continuer';placeTour();}
  function startTour(){
   if(stored.tourComplete||guide)return;stored.invitationSeen=true;save();closeBubble(false);
   const steps=tourSteps();if(!steps.length)return;
   const node=document.createElement('div');node.className='av-tour';node.innerHTML='<span class="av-tour-spot" aria-hidden="true"></span><section class="av-bubble av-tour-tip" role="dialog" aria-modal="true" aria-label="Visite avec ton compagnon"><p class="av-signature"></p><button type="button" class="av-dismiss" aria-label="Quitter la visite">'+ICON.close+'</button><p class="av-message" aria-live="polite"></p><div class="av-bubble-actions"><button type="button" class="av-primary">Continuer</button><button type="button" class="av-later">Arrêter la visite</button></div></section>';
   H.append(node);const tip=node.querySelector('.av-tour-tip'),next=tip.querySelector('.av-primary');guide={node,tip,next,spot:node.querySelector('.av-tour-spot'),steps,index:0,inert:inertChildren(node)};
   next.onclick=()=>{if(!guide)return;if(guide.index===guide.steps.length-1)stopTour(true);else{guide.index++;paintTour();next.focus({preventScroll:true});}};
   tip.querySelector('.av-dismiss').onclick=tip.querySelector('.av-later').onclick=()=>stopTour();
   node.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();stopTour();}else trap(e,tip);});paintTour();next.focus({preventScroll:true});
  }
  window.__tourStart=startTour;

  /* La réalisation reste acquise, même si le ressenti est laissé pour plus tard. */
  const FEELINGS=['soulagée','fière','apaisée','mitigée','fatiguée','pas grand-chose'];
  function cancelPendingStep(){if(!pendingStep)return;clearTimeout(pendingStep.timer);const release=pendingStep.release;pendingStep=null;release();}
  window.__enAccueilPas=(p,release)=>{
   cancelPendingStep();if(feedback){release();return;}context={kind:'step',day:dayKey()};closeBubble(false);
   const row=[...H.querySelectorAll('.acpp .ck')].find(button=>button.dataset.i===String(p.id));row?.classList.add('av-ticked');
   const token={release,timer:0};pendingStep=token;save();token.timer=setTimeout(()=>{if(pendingStep!==token)return;pendingStep=null;if(!H.classList.contains('en-on')){release();return;}openFeedback(p,release);},motion()?160:0);
  };
  function openFeedback(p,release){
   const node=document.createElement('div');node.className='av-feedback';if(!motion())node.classList.add('av-still');
   node.innerHTML='<div class="av-step-dim"></div><section class="av-step-sheet" role="dialog" aria-modal="true" aria-labelledby="av-step-message"><span class="av-grab" aria-hidden="true"></span><button type="button" class="av-dismiss" aria-label="Fermer">'+ICON.close+'</button><div class="av-step-word"><img src="'+petAsset()+'" alt="Ton compagnon"><p id="av-step-message">Voilà un petit pas de fait.</p></div><div class="av-step-question">Comment tu te sens, maintenant ?<button type="button" class="av-info" aria-label="Information : réponse facultative" aria-expanded="false" aria-controls="av-step-hint"><span>i</span></button><span class="av-hint" id="av-step-hint" hidden>Si tu veux.</span></div><div class="av-feelings">'+FEELINGS.map(f=>'<button type="button" data-feeling="'+escape(f)+'" aria-pressed="false">'+ICON.check+'<span>'+escape(f)+'</span></button>').join('')+'</div><textarea class="av-free" rows="1" placeholder="Avec tes mots…" aria-label="Avec tes mots"></textarea><button type="button" class="av-primary av-confirm">Confirmer</button><button type="button" class="av-later">Plus tard</button></section>';
   node.querySelector('textarea').id='av-step-note-'+encodeURIComponent(String(p.id));
   node.querySelector('.av-confirm').dataset.a='save';
   H.append(node);const sheet=node.querySelector('.av-step-sheet'),inert=inertChildren(node),selection=[],previousOverflow=body.style.overflowY;body.style.overflowY='hidden';
   const current={node,p,release,inert,previousOverflow,closing:false,selection};feedback=current;
   function close(confirm=false){
    if(current.closing)return;current.closing=true;
    if(confirm){const note=node.querySelector('textarea').value.trim();p.feelings=selection.slice();p.feelNote=note;p.feel=[...selection,note].filter(Boolean).join(' · ');window.__PP?.emit();save();}
    node.classList.remove('av-open');
    closingTimer=setTimeout(()=>{if(feedback!==current)return;feedback=null;node.remove();restoreInert(inert);body.style.overflowY=previousOverflow;release();companion()?.focus({preventScroll:true});window.__enSyncChrome?.();},motion()?300:0);
   }
   current.close=close;node.querySelector('.av-dismiss').onclick=node.querySelector('.av-later').onclick=node.querySelector('.av-step-dim').onclick=()=>close();node.querySelector('.av-confirm').onclick=()=>close(true);
   node.querySelectorAll('[data-feeling]').forEach(button=>button.onclick=()=>{selection.splice(0,selection.length,...toggleFeeling(selection,button.dataset.feeling));node.querySelectorAll('[data-feeling]').forEach(b=>b.setAttribute('aria-pressed',String(selection.includes(b.dataset.feeling))));});
   const info=node.querySelector('.av-info'),hint=node.querySelector('.av-hint');info.onclick=()=>{hint.hidden=!hint.hidden;info.setAttribute('aria-expanded',String(!hint.hidden));};
   node.querySelector('textarea').oninput=e=>{e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px';};
   node.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();if(!hint.hidden){hint.hidden=true;info.setAttribute('aria-expanded','false');info.focus();}else close();}else trap(e,sheet);});
   requestAnimationFrame(()=>{if(feedback===current&&!current.closing){node.classList.add('av-open');node.querySelector('.av-dismiss').focus({preventScroll:true});}});
  }
  function finishFeedbackImmediately(){if(!feedback)return;const current=feedback;feedback=null;clearTimeout(closingTimer);current.node.remove();restoreInert(current.inert);body.style.overflowY=current.previousOverflow;current.release();}
  let wasHome=H.classList.contains('en-on');
  new MutationObserver(()=>{const active=H.classList.contains('en-on');renderMood();positionBubble();if(!active){closeBubble(false);stopTour();cancelPendingStep();finishFeedbackImmediately();}else if(!wasHome)welcome();wasHome=active;}).observe(H,{attributes:true,attributeFilter:['class']});
  new MutationObserver(()=>{if(!document.getElementById('en-lock'))welcome();}).observe(document.body,{childList:true});
  const resize=()=>{positionBubble();placeTour();};new ResizeObserver(resize).observe(H);body.addEventListener('scroll',resize,{passive:true});window.addEventListener('resize',resize);
  if(document.fonts)document.fonts.ready.then(resize);
  welcome();
 };
})();
