/* Photo, prénom et surnom : le choix fait sur cette page est celui du carnet. */
(() => {
 'use strict';
 function install(){
  const onb=document.getElementById('onb'),profile=window.__enGet&&window.__enGet('rg');
  if(!onb||!document.getElementById('en-app')||!profile||onb.dataset.identityInstalled)return;
  const first=document.getElementById('o2in'),nickname=document.getElementById('o2nick');
  if(!first||!nickname)return;
  onb.dataset.identityInstalled='1';
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
