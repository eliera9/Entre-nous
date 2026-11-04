/* Entre nous · le code de secours n'est affiché qu'après sa sauvegarde. */
(()=>{
let current=null;
window.__enOpenRecovery=({onClose}={})=>{
 if(current)return current;
 const el=document.createElement('div');el.id='en-sec';el.className='en-sh en-recovery-sheet';
 const screen=document.querySelector('#en-app .phone.en-on'),style=screen&&getComputedStyle(screen);
 const colors={'--recovery-bg':style?.getPropertyValue('--sbg').trim()||'#F5E0D3','--recovery-ink':style?.getPropertyValue('--sink').trim()||'#6B3F55','--recovery-muted':style?.getPropertyValue('--smuted').trim()||'#7A5566','--recovery-line':style?.getPropertyValue('--sline').trim()||'#D9B0B5'};
 for(const [key,value] of Object.entries(colors))el.style.setProperty(key,value);
 el.style.setProperty('--recovery-accent',screen?.classList.contains('nuit')?'#C6A0B1':'#7C536A');
 el.innerHTML=`<section class="in" role="dialog" aria-modal="true" aria-labelledby="en-sect" aria-describedby="en-secs"><span class="en-sec-grip" aria-hidden="true"></span><h2 class="t" id="en-sect" tabindex="-1">Un oubli, ça arrive</h2><p class="s" id="en-secs">Ton code de secours te permettra de retrouver ton journal si tu oublies tes 4 chiffres.</p><p class="k">Code de secours</p><div class="cd" id="en-secv">…</div><p class="en-sec-note">Garde-le dans un endroit sûr, à l’abri des regards.</p><button type="button" class="b ol" id="en-seccp" disabled>Copier mon code</button><button type="button" class="b" id="en-secok" disabled>Je l’ai gardé</button><button type="button" class="lk" id="en-seclt">Je le ferai plus tard</button><p class="en-sec-status" id="en-secstatus" role="status" aria-live="polite">Préparation de ton code…</p><button type="button" class="b ol" id="en-secretry" hidden>Réessayer</button></section>`;
 document.body.appendChild(el);
 const $=id=>el.querySelector('#'+id),app=document.getElementById('en-app'),previousInert=app?.inert,previousFocus=document.activeElement;
 if(app)app.inert=true;
 let closed=false,closing=false,code='',generation=0;
 const close=()=>{
  if(closing)return;closing=true;closed=true;++generation;el.classList.remove('on');
  setTimeout(()=>{el.remove();current=null;if(app)app.inert=previousInert;if(typeof onClose==='function')onClose();else if(previousFocus?.isConnected&&!previousFocus.disabled)previousFocus.focus()},window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?0:300);
 };
 const controller={close};current=controller;
 requestAnimationFrame(()=>{if(closed)return;el.classList.add('on');$('en-sect').focus({preventScroll:true})});
 async function prepare(){
  const attempt=++generation;code='';$('en-secv').textContent='…';$('en-seccp').disabled=true;$('en-secok').disabled=true;$('en-secretry').hidden=true;$('en-secstatus').setAttribute('role','status');$('en-secstatus').textContent='Préparation de ton code…';
  try{
   const value=await window.__vaultMakeSecours();if(closed||attempt!==generation)return;
   code=value;$('en-secv').textContent=code;$('en-seccp').disabled=false;$('en-secok').disabled=false;$('en-secstatus').textContent='';
  }catch{
   if(closed||attempt!==generation)return;$('en-secv').textContent='—';$('en-secstatus').setAttribute('role','alert');$('en-secstatus').textContent='Ton code de secours n’a pas pu être enregistré. Réessaie en gardant cette page ouverte.';$('en-secretry').hidden=false;
  }
 }
 $('en-seccp').onclick=async()=>{if(!code||closed)return;try{await navigator.clipboard.writeText(code);if(closed)return;$('en-seccp').textContent='✓ Copié';$('en-secstatus').textContent='Ton code a été copié.'}catch{if(!closed)$('en-secstatus').textContent='La copie n’a pas fonctionné. Tu peux sélectionner le code pour le copier.'}};
 $('en-secok').onclick=()=>{if(code)close()};$('en-seclt').onclick=close;$('en-secretry').onclick=prepare;
 el.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return}
  if(event.key!=='Tab')return;
  const buttons=[...el.querySelectorAll('button')].filter(button=>!button.disabled&&!button.hidden),first=buttons[0],last=buttons.at(-1);
  if(!buttons.includes(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus()}else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 prepare();return controller;
};
})();
