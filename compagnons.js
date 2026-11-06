(()=>{
// Début du modèle du compagnon : données JSON du coffre existant.
const SPECIES=['chat','panda','lapin','chien'];
function normalizeCompanion(raw={}){
 const bySpecies={};
 for(const key of SPECIES){const old=raw.bySpecies?.[key]||{};bySpecies[key]={name:typeof old.name==='string'?old.name.replace(/[<>]/g,'').slice(0,30):'',traits:[...new Set((Array.isArray(old.traits)?old.traits:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<3))].sort()};}
 return {selected:SPECIES.includes(raw.selected)?raw.selected:'chat',bySpecies,deferred:!!raw.deferred,confirmed:!!raw.confirmed};
}
async function confirmCompanion(state,key,name,save){
 if(!SPECIES.includes(key))throw Error('Compagnon inconnu');
 const previous={selected:state.selected,confirmed:state.confirmed};
 state.selected=key;state.bySpecies[key].name=String(name).replace(/[<>]/g,'').trim().slice(0,30);state.confirmed=true;
 try{await save();}catch(error){Object.assign(state,previous);throw error;}
 return state.selected;
}
// Fin du modèle du compagnon.

window.__enInitCompanions=()=>{
 const root=document.getElementById('mv');
 const assets={"chat": {"video": "illus/companions/chat-wake.mp4", "awake": "illus/companions/chat-awake.webp", "sleep": "illus/companions/chat-sleep.webp"}, "panda": {"video": "illus/companions/panda-wake.mp4", "awake": "illus/companions/panda-awake.webp", "sleep": "illus/companions/panda-sleep.webp"}, "lapin": {"video": "illus/companions/lapin-wake.mp4", "awake": "illus/companions/lapin-awake.webp", "sleep": "illus/companions/lapin-sleep.webp"}, "chien": {"video": "illus/companions/chien-wake.mp4", "awake": "illus/companions/chien-awake.webp", "sleep": "illus/companions/chien-sleep.webp"}};
 if(!root||root.dataset.companionReady)return;root.dataset.companionReady='1';
 const info={
  chat:{label:'le chat',names:['Plume','Mochi','Biscotte'],facets:[['Tendre','heart','Je t’écoute, même quand les mots viennent doucement.'],['Curieux','sparkles','Et si on regardait ça d’un peu plus près ?'],['Complice','feather','Les petites victoires aussi, ça se partage.']]},
  panda:{label:'le panda',names:['Bambou','Nuage','Pompon'],facets:[['Paisible','moon','On peut ralentir. Rien ne presse ici.'],['Réconfortant','heart','Tu peux déposer un peu de ce qui pèse.'],['Patient','leaf','On trouvera les mots à ton rythme.']]},
  lapin:{label:'le lapin',names:['Caramel','Noisette','Câlin'],facets:[['Délicat','feather','On peut y aller tout doucement.'],['Attentif','sparkles','Les petites choses comptent aussi, tu sais.'],['Rassurant','heart','Tu choisis ce que tu as envie de partager.']]},
  chien:{label:'le chiot',names:['Biscuit','Cannelle','Filou'],facets:[['Chaleureux','sun','Je suis content de te retrouver, comme tu es.'],['Fidèle','heart','On reprendra le fil quand tu en auras envie.'],['Encourageant','sparkles','Un petit pas, c’est déjà quelque chose.']]}
 };
 const state=window.__enKeep('companion',{});Object.assign(state,normalizeCompanion(state));window.__enCompanionState=state;
 const flush=()=>window.__vaultPushNow();
 window.__mvLater=state.deferred;
 Object.defineProperty(window,'__pet',{configurable:true,get:()=>state.selected,set:key=>{if(SPECIES.includes(key)){state.selected=key;syncAvatars();flush().catch(()=>{});}}});
 Object.defineProperty(window,'__petName',{configurable:true,get:()=>state.bySpecies[state.selected].name,set:name=>{state.bySpecies[state.selected].name=String(name||'').replace(/[<>]/g,'').slice(0,30);syncAvatars();flush().catch(()=>{});}});
 window.__getCompanionTraits=()=>state.bySpecies[state.selected].traits.map(i=>info[state.selected].facets[i][0]);
// Les huit portraits jour/nuit sont réservés aux bulles de dialogue :
 // ne pas toucher aux illustrations de la page de choix du compagnon (#mv).
 function syncAvatars(){
  const avatar=document.getElementById('vpet');if(avatar)avatar.src='illus/dort-'+state.selected+'.webp';
  const small=document.getElementById('mvsm');if(small)small.src='illus/eveil-'+state.selected+'.webp';
  document.querySelectorAll('button.sbplume').forEach(button=>{
   button.setAttribute('aria-label','Parler à '+(state.bySpecies[state.selected].name||'ton compagnon'));
   if(button.closest('#mv'))return;
   const image=button.querySelector('img');if(!image)return;
   const isNight=document.documentElement.classList.contains('en-nuit')||!!button.closest('.nuit');
   const wanted='illus/avatars-compagnons/'+state.selected+'-'+(isNight?'nuit':'jour')+'.svg';
   if(image.getAttribute('src')!==wanted)image.setAttribute('src',wanted);
  });
  window.__enSyncBubbleAvatars?.();
 }
 syncAvatars();document.addEventListener('DOMContentLoaded',syncAvatars);
 // Certaines bulles sont créées seulement à l'ouverture de leur page.
 const app=document.getElementById('en-app');
 if(app){
  new MutationObserver(records=>{
   if(records.some(record=>Array.from(record.addedNodes).some(node=>
    node.nodeType===1&&(node.matches?.('button.sbplume')||node.querySelector?.('button.sbplume'))
   )))syncAvatars();
  }).observe(app,{childList:true,subtree:true});
 }
 // La sélection du thème met à jour les bulles déjà visibles.
 new MutationObserver(syncAvatars).observe(document.documentElement,{attributes:true,attributeFilter:['class']});

 root.querySelectorAll('.cf-page').forEach((page,index)=>{
  const portrait=page.querySelector('.cf-portrait'),scene=page.querySelector('.cf-scene');
  const video=page.querySelector('.cf-film'),poster=page.querySelector('.cf-poster'),facets=page.querySelector('.cf-facets'),words=page.querySelector('.cf-words'),error=page.querySelector('.cf-error');
  const frame=page.querySelector('.cf-disclosure'),invitePanel=page.querySelector('.cf-invitation-panel'),bubblePanel=page.querySelector('.cf-bubble-panel'),invitation=page.querySelector('.cf-invitation');
  const bubble=page.querySelector('.cf-bubble'),style=page.closest('[data-motion]').dataset.motion;
  const input=page.querySelector('.cf-name'),suggestions=page.querySelector('.cf-suggestions'),confirmation=page.querySelector('.cf-confirmation');
  const drafts=Object.fromEntries(SPECIES.map(k=>[k,state.bySpecies[k].name]));
  async function persistDraft(){state.bySpecies[animal]={name:drafts[animal],traits:[...chosen[animal]].sort()};try{await flush();error.hidden=true;}catch{error.textContent='Tes choix sont encore ici, mais leur sauvegarde a échoué. Réessaie avant de quitter cette page.';error.hidden=false;}}
  function clearConfirmation(){confirmation.hidden=true;confirmation.textContent='';}
  function updateSuggestions(){suggestions.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===input.value)));}
  const chosen=Object.fromEntries(SPECIES.map(k=>[k,new Set(state.bySpecies[k].traits)]));
  let animal=state.selected,isOpen=false,mediaToken=0,motionToken=0,animations=[];
  bubble.id='fd-bubble-'+index;scene.setAttribute('aria-controls',bubble.id);invitation.setAttribute('aria-controls',bubble.id);
  function setOpen(open,animate=true,returnFocus=false){
   if(open===isOpen&&animate)return;
   const start=frame.getBoundingClientRect().height;
   const id=++motionToken;animations.forEach(a=>a.cancel());animations=[];
   isOpen=open;portrait.dataset.open=String(open);scene.setAttribute('aria-expanded',String(open));invitation.setAttribute('aria-expanded',String(open));
   const target=open?bubblePanel:invitePanel,previous=open?invitePanel:bubblePanel;
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('en-anim')==='0';
   if(!animate||reduced){
    invitePanel.hidden=open;bubblePanel.hidden=!open;
    [invitePanel,bubblePanel].forEach(p=>{p.style.position='relative';p.style.top='';});frame.style.height='';frame.style.overflowY='';
    if(returnFocus)scene.focus();return;
   }
   target.hidden=false;previous.hidden=false;
   target.style.position='relative';target.style.top='';
   previous.style.position='absolute';previous.style.top='10px';
   frame.style.height=start+'px';frame.style.overflowY='clip';frame.style.overflowX='visible';
   const end=target.getBoundingClientRect().height+10;
   const duration=style==='label'?420:340;
   const easing='cubic-bezier(.22,1,.36,1)';
   animations.push(frame.animate([{height:start+'px'},{height:end+'px'}],{duration,easing,fill:'forwards'}));
   const exit=style==='note'?'translateX(-8px)':style==='label'?'translateY(-2px) scale(.97)':'translateY(-5px)';
   animations.push(previous.animate([{opacity:1,transform:'none'},{opacity:0,transform:exit}],{duration:140,easing:'ease-out',fill:'forwards'}));
   let enter;
   if(style==='label'&&open){enter=[{opacity:0,clipPath:'inset(0 12% 75% round 24px)',transform:'translateY(-2px)'},{opacity:1,clipPath:'inset(0 0 0 round 20px)',transform:'none'}];}
   else enter=[{opacity:0,transform:style==='note'?'translateX(9px)':'translateY(6px)'},{opacity:1,transform:'none'}];
   animations.push(target.animate(enter,{duration:duration-60,delay:60,easing,fill:'both'}));
   Promise.allSettled(animations.map(a=>a.finished)).then(()=>{
    if(id!==motionToken)return;
    previous.hidden=true;[previous,target].forEach(p=>{p.style.position='relative';p.style.top='';});
    animations.forEach(a=>a.cancel());animations=[];frame.style.height='';frame.style.overflowY='';frame.style.overflowX='';
   });
   if(returnFocus)scene.focus();
  }
  function renderWords(){
   words.replaceChildren();const indices=[...chosen[animal]].sort((a,b)=>a-b);
   if(!indices.length){const p=document.createElement('p');p.className='cf-empty';p.textContent='Choisis une ou plusieurs facettes.';words.append(p);return;}
   indices.forEach(i=>{const p=document.createElement('p');p.className='cf-quote';p.textContent='« '+info[animal].facets[i][2]+' »';words.append(p);});
  }
  function renderFacets(){
   facets.replaceChildren();
   info[animal].facets.forEach(([text],i)=>{
    const label=document.createElement('label');label.className='cf-facet cursor-interaction';
    const check=document.createElement('input');check.type='checkbox';check.className='cf-check';check.checked=chosen[animal].has(i);
    check.addEventListener('change',()=>{if(check.checked)chosen[animal].add(i);else chosen[animal].delete(i);renderWords();clearConfirmation();persistDraft();});
    const chip=document.createElement('span');chip.className='cf-chip';chip.append(check,document.createTextNode(text));label.append(chip);facets.append(label);
   });renderWords();
  }
  async function selectAnimal(key,play){
   const current=++mediaToken;video.pause();page.dataset.awake='false';animal=key;setOpen(false,false);error.hidden=true;
   page.querySelectorAll('.cf-animal').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.animal===key)));
   poster.src=assets[key].awake;poster.alt='Ton compagnon '+key+' dans son arche';poster.hidden=false;video.hidden=true;renderFacets();clearConfirmation();
   input.value=drafts[key];suggestions.replaceChildren();
   info[key].names.forEach(name=>{const b=document.createElement('button');b.type='button';b.className='cf-suggestion cursor-interaction';b.textContent=name;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{input.value=name;drafts[animal]=name;clearConfirmation();updateSuggestions();persistDraft();});suggestions.append(b);});
   updateSuggestions();
   if(!play||window.matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('en-anim')==='0')return;
   page.dataset.awake='true';video.src=assets[key].video;video.muted=true;video.currentTime=0;video.hidden=false;poster.hidden=true;
   try{await video.play();}catch{if(current===mediaToken){video.hidden=true;poster.hidden=false;error.hidden=false;}}
  }
  page.querySelectorAll('.cf-animal').forEach(b=>b.addEventListener('click',()=>selectAnimal(b.dataset.animal,true)));
  scene.addEventListener('click',()=>setOpen(true));invitation.addEventListener('click',()=>setOpen(true));
  page.querySelector('.cf-close').addEventListener('click',()=>setOpen(false,true,true));
  page.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen){setOpen(false,true,true);e.preventDefault();}});
  input.addEventListener('input',()=>{drafts[animal]=input.value;updateSuggestions();clearConfirmation();persistDraft();});
  page.querySelector('.cf-confirm').addEventListener('click',async()=>{
   const button=page.querySelector('.cf-confirm');if(button.disabled)return;button.disabled=true;clearConfirmation();error.hidden=true;
   state.bySpecies[animal]={name:input.value,traits:[...chosen[animal]].sort()};state.deferred=!!window.__mvLater;
   try{await confirmCompanion(state,animal,input.value,flush);
    syncAvatars();
    video.pause();window.__enShow(state.deferred?'home':'mv2');
   }catch{error.textContent='Ton choix n’a pas pu être enregistré. Garde cette page ouverte et réessaie.';error.hidden=false;}
   finally{button.disabled=false;}
  });
  selectAnimal(state.selected,false);
  let visible=false;new MutationObserver(()=>{const on=root.classList.contains('en-on');if(on&&!visible)selectAnimal(state.selected,true);if(!on)video.pause();visible=on;}).observe(root,{attributes:true,attributeFilter:['class']});
 });
};
})();
