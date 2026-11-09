/* Photo, prénom et surnom : le choix fait sur cette page est celui du carnet. */
(() => {
 'use strict';
 function applyFormName(answer,{force=false}={}){
  const profile=window.__enGet?.('rg');
  if(!profile||answer?.state!=='answered'||answer.verified!==true)return false;
  const name=String(answer.rows?.[0]?.name||'').replace(/[<>"&]/g,'').trim().slice(0,50);
  if(!name||(!force&&profile.formNameApplied===name))return false;
  const firstMigration=profile.formNameApplied===undefined;
  profile.formNameApplied=name;
  // Un choix déjà configuré dans les réglages reste prioritaire lors de la migration.
  if(!force&&firstMigration&&String(profile.petit||'').trim())return false;
  if(name===String(profile.prenom||'').trim())profile.appellation=0;
  else{profile.petit=name;profile.appellation=1;}
  window.__vaultName?.(window.__P());
  document.dispatchEvent(new Event('en-identity-change'));
  return true;
 }
 window.__enApplyFormName=applyFormName;
 function install(){
  const onb=document.getElementById('onb'),profile=window.__enGet&&window.__enGet('rg');
  if(!onb||!document.getElementById('en-app')||!profile||onb.dataset.identityInstalled)return;
  const first=document.getElementById('o2in'),nickname=document.getElementById('o2nick');
  if(!first||!nickname)return;
  onb.dataset.identityInstalled='1';
  applyFormName(window.__enGet?.('lifeform-approved-v1')?.answers?.surnom);
  const details=document.getElementById('o2nick-details'),choice=document.getElementById('o2name-choice');
  const greeting=document.getElementById('o2name-greeting'),radios=[...choice.querySelectorAll('input')];
  if(profile.appellation===undefined)profile.appellation=profile.petit?1:0;
  nickname.value=String(profile.petit||'');
  let pending;
  function persist(){
   if(window.__vaultName)window.__vaultName(window.__P());
   clearTimeout(pending);pending=setTimeout(()=>{if(window.__vaultReady&&window.__vaultReady())window.__vaultPushNow();},250);
  }
  function render(){
   if(document.activeElement!==first&&profile.prenom!==undefined)first.value=String(profile.prenom||'');
   if(document.activeElement!==nickname)nickname.value=String(profile.petit||'');
   const hasNickname=!!String(profile.petit||'').trim();
   choice.hidden=!hasNickname;
   radios.forEach(r=>{r.checked=Number(r.value)===(profile.appellation===1&&hasNickname?1:0)});
   const name=window.__P();greeting.hidden=!hasNickname||!name;
   greeting.textContent=name?'« Bonjour '+name+' »':'';
   document.querySelectorAll('.sbn,.rgnm').forEach(node=>node.textContent=name);
  }
  function change(){document.dispatchEvent(new Event('en-identity-change'));}
  nickname.addEventListener('input',()=>{profile.petit=nickname.value.trim();if(!profile.petit)profile.appellation=0;change()});
  first.addEventListener('input',()=>{profile.prenom=first.value.trim();change()});
  radios.forEach(r=>r.addEventListener('change',()=>{if(!r.checked)return;profile.appellation=Number(r.value);change()}));
  document.addEventListener('en-identity-change',render);
  document.addEventListener('en-identity-change',persist);
  // Ouvrir/replier ne modifie ni le surnom saisi, ni le choix d'appellation.
  details.addEventListener('toggle',render);
  render();
 }
 window.__enInitIdentity=install;
 document.addEventListener('DOMContentLoaded',install);
 install();
})();

/* Les valeurs restent dans les champs natifs utilisés par le profil et son brouillon. */
(() => {
 'use strict';
 window.__enInitBirthDropdowns=()=>{
  const holder=document.querySelector('#onb .o2pills');if(!holder)return;
  if(holder.__birthMenus){holder.__birthMenus.refresh();return;}
  const menus=[];
  const closeAll=()=>menus.forEach(item=>item.close());
  for(const [index,select] of [...holder.querySelectorAll('select')].entries()){
   const field=document.createElement('div'),trigger=document.createElement('button'),value=document.createElement('span'),arrow=document.createElement('span'),menu=document.createElement('div'),options=document.createElement('div');
   const label=select.getAttribute('aria-label')||['Jour','Mois','Année'][index];
   field.className='o2date-field';trigger.type='button';trigger.className='o2date-trigger';arrow.className='o2date-chevron';arrow.setAttribute('aria-hidden','true');
   menu.id='o2date-menu-'+index;menu.className='o2date-menu';menu.hidden=true;menu.setAttribute('role','listbox');menu.setAttribute('aria-label',label);options.className='o2date-options';
   trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',menu.id);
   select.before(field);field.append(select,trigger,menu);trigger.append(value,arrow);menu.append(options);select.hidden=true;
   const buttons=[];
   function refresh(){const selected=[...select.options].find(option=>option.value===select.value),placeholder=select.options[0]?.textContent||label;value.textContent=select.value!==''&&selected?selected.textContent:placeholder;trigger.classList.toggle('set',select.value!=='');trigger.setAttribute('aria-label',select.value!==''?label+' : '+value.textContent:label);for(const button of buttons)button.setAttribute('aria-selected',String(button.dataset.value===select.value));}
   function close(focus=false){menu.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus({preventScroll:true});}
   function open(focus=false){closeAll();refresh();menu.hidden=false;trigger.setAttribute('aria-expanded','true');const chosen=buttons.find(button=>button.dataset.value===select.value)||buttons[0];if(chosen){options.scrollTop=Math.max(0,chosen.offsetTop-options.offsetTop-options.clientHeight/2+chosen.offsetHeight/2);if(focus)chosen.focus({preventScroll:true});}}
   for(const option of [...select.options].filter(option=>option.value!==''&&!option.disabled)){
    const button=document.createElement('button'),text=document.createElement('span'),check=document.createElement('span');button.type='button';button.className='o2date-option';button.dataset.value=option.value;button.setAttribute('role','option');button.tabIndex=-1;text.textContent=option.textContent;check.className='o2date-check';check.textContent='✓';check.setAttribute('aria-hidden','true');button.append(text,check);options.append(button);buttons.push(button);
    button.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));refresh();close(true);});
   }
   trigger.addEventListener('click',()=>menu.hidden?open():close());
   trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();open(true);}});
   options.addEventListener('keydown',event=>{const at=buttons.indexOf(document.activeElement);const next=event.key==='ArrowDown'?Math.min(at+1,buttons.length-1):event.key==='ArrowUp'?Math.max(at-1,0):event.key==='Home'?0:event.key==='End'?buttons.length-1:-1;if(next>=0){event.preventDefault();buttons[next]?.focus();}});
   field.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){event.preventDefault();event.stopPropagation();close(true);}});
   select.addEventListener('change',refresh);menus.push({field,close,refresh});refresh();
  }
  document.addEventListener('click',event=>menus.forEach(item=>{if(!item.field.contains(event.target))item.close();}));
  holder.__birthMenus={refresh:()=>menus.forEach(item=>item.refresh())};
 };
})();
