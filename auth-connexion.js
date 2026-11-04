/* Accueil et volet e-mail : données réelles uniquement, sans stockage des mots de passe. */
(() => {
 'use strict';
 /* Règles indépendantes du rendu, également vérifiées dans les tests. */
 function validateAuth(data){
  const errors=[];const email=String(data.email||'').trim();
  if(!email)errors.push(['email','Indique ton adresse e-mail.']);
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.push(['email','Vérifie le format de ton adresse e-mail.']);
  if(!data.recovery){
   if(!data.password)errors.push(['password','Indique ton mot de passe.']);
   else if(data.mode==='new'&&data.password.length<8)errors.push(['password','Choisis un mot de passe de 8 caractères minimum.']);
   if(data.mode==='new'){
    if(!data.confirmation)errors.push(['confirm','Confirme ton mot de passe.']);
    else if(data.confirmation!==data.password)errors.push(['confirm','Les deux mots de passe sont différents.']);
   }
  }
  return errors;
 }
 const CONFIRMATION_MESSAGE='L’inscription sans confirmation e-mail n’est pas encore disponible. Tu peux utiliser un compte existant ou continuer en invité.';
 async function authenticate(C,data){
  const mail=String(data.email).trim();
  if(data.mode==='new'){
   const config=typeof C.settings==='function'?await C.settings():null;
   if(config&&config.mailer_autoconfirm===false)throw new Error(CONFIRMATION_MESSAGE);
   const result=await C.signUp(mail,data.password);
   if(result&&result.confirm)throw new Error(CONFIRMATION_MESSAGE);
  }else await C.signIn(mail,data.password);
  const session=await C.session();
  if(!session||!session.user||String(session.user.email||'').toLowerCase()!==mail.toLowerCase())throw new Error('La connexion n’a pas pu être confirmée. Réessaie.');
  const record=await C.pull();
  return {kind:record&&record.box?'vault':data.mode==='new'?'new':'empty',record,session};
 }
 /* Fin des règles indépendantes du rendu. */
 function install(){
  const onb=document.getElementById('onb'),C=window.__enCloud;
  if(!onb||!document.getElementById('en-app')||!C||onb.dataset.authInstalled)return;
  onb.dataset.authInstalled='1';onb.classList.add('en-auth-ready');
  const $=id=>onb.querySelector('#'+id);
  const overlay=$('en-mail-overlay'),sheet=$('en-mail-sheet'),welcome=onb.querySelector('.o1');
  const form=$('en-mail-form'),panel=$('en-mail-panel'),tabs=$('en-mail-tabs');
  const heading=$('en-mail-title'),submit=$('en-mail-submit');
  const email=$('en-mail-address'),password=$('en-mail-password'),confirmation=$('en-mail-confirm');
  const passwordField=$('en-field-password'),confirmField=$('en-field-confirm'),hint=$('en-password-hint');
  const forgot=$('en-mail-forgot'),returnButton=$('en-mail-return');
  const outcome=$('en-mail-outcome'),outcomeTitle=$('en-mail-outcome-title'),outcomeText=$('en-mail-outcome-text'),outcomeNext=$('en-mail-outcome-next'),outcomeBack=$('en-mail-outcome-back');
  const emailButton=$('en-auth-email'),googleButton=$('en-auth-google'),guest=$('o1guest');
  const modeButtons=[...onb.querySelectorAll('[data-mail-mode]')],eyeButtons=[...onb.querySelectorAll('[data-eye]')];
  const fields={email,password,confirm:confirmation},errorIds={email:'en-error-email',password:'en-error-password',confirm:'en-error-confirm'};
  let opened=false,mode='new',view='form',busy=false,completion=null,opener=null,operation=0;
  const initialGoogleText=googleButton.textContent;
  function status(message){const el=$('en-auth-status');el.textContent=message;el.hidden=!message;}
  function serviceMessage(error){
   if(navigator.onLine===false)return 'Tu es hors ligne. Reconnecte-toi pour accéder à ton compte.';
   const message=String(error&&error.message||'');
   if(/failed to fetch|network|load failed/i.test(message))return 'Le service de connexion est momentanément inaccessible. Réessaie ; tes saisies restent dans ce volet.';
   return message||'La demande n’a pas pu être terminée. Réessaie.';
  }
  function syncChrome(){if(window.__enSyncChrome)window.__enSyncChrome();}
  function syncAuthTheme(){onb.classList.toggle('en-auth-night',document.documentElement.classList.contains('en-nuit'));syncChrome();}
  new MutationObserver(syncChrome).observe(onb,{attributes:true,attributeFilter:['class','style','data-en-step']});
  new MutationObserver(syncAuthTheme).observe(document.documentElement,{attributes:true,attributeFilter:['class']});syncAuthTheme();
  function keyboardBounds(){
   if(!opened)return;const viewport=window.visualViewport;
   if(!viewport){sheet.style.bottom='';sheet.style.maxHeight='';return;}
   const bounds=onb.getBoundingClientRect(),bottom=Math.max(0,bounds.bottom-(viewport.offsetTop+viewport.height));
   sheet.style.bottom=bottom+'px';sheet.style.maxHeight=Math.max(160,Math.min(650,viewport.height-60))+'px';
  }
  if(window.visualViewport){window.visualViewport.addEventListener('resize',keyboardBounds);window.visualViewport.addEventListener('scroll',keyboardBounds);}
  window.addEventListener('resize',()=>{keyboardBounds();syncChrome();});
  const info=$('en-guest-info'),guestNote=$('en-guest-note');
  info.onclick=()=>{guestNote.hidden=!guestNote.hidden;info.setAttribute('aria-expanded',String(!guestNote.hidden));};
  function clearError(key){const el=$(errorIds[key]);el.textContent='';el.hidden=true;fields[key].setAttribute('aria-invalid','false');}
  function clearErrors(){Object.keys(fields).forEach(clearError);$('en-mail-server-error').textContent='';$('en-mail-server-error').hidden=true;}
  function formError(message){const el=$('en-mail-server-error');el.textContent=message;el.hidden=false;}
  function fieldError(key,message){const el=$(errorIds[key]);el.textContent=message;el.hidden=false;fields[key].setAttribute('aria-invalid','true');}
  function hidePasswords(){
   password.type='password';confirmation.type='password';
   eyeButtons.forEach(button=>{button.textContent='Voir';button.setAttribute('aria-pressed','false');button.setAttribute('aria-label',button.dataset.eye==='en-mail-confirm'?'Afficher la confirmation du mot de passe':'Afficher le mot de passe');});
  }
  function setBusy(value){
   busy=value;submit.disabled=value;
   [...modeButtons,...eyeButtons,email,password,confirmation,forgot].forEach(control=>{control.disabled=value;});
   form.setAttribute('aria-busy',String(value));
   submit.textContent=value?(view==='recovery'?'Envoi en cours…':mode==='new'?'Création en cours…':'Connexion en cours…'):(view==='recovery'?'Envoyer le lien':'Continuer');
  }
  function render(){
   const recovery=view==='recovery',completed=view==='outcome';
   heading.textContent=recovery?'Mot de passe oublié ?':'Connexion par e-mail';
   tabs.hidden=recovery||completed;panel.hidden=completed;outcome.hidden=!completed;returnButton.hidden=!recovery;
   passwordField.hidden=recovery;confirmField.hidden=recovery||mode!=='new';hint.hidden=recovery||mode!=='new';forgot.hidden=recovery||mode!=='back';
   modeButtons.forEach(button=>button.setAttribute('aria-selected',String(button.dataset.mailMode===mode)));
   panel.setAttribute('role',recovery?'region':'tabpanel');panel.setAttribute('aria-labelledby',recovery?'en-mail-title':mode==='new'?'en-tab-new':'en-tab-back');
   password.autocomplete=mode==='new'?'new-password':'current-password';password.placeholder=mode==='new'?'Choisis ton mot de passe':'Ton mot de passe';
   setBusy(busy);keyboardBounds();
  }
  function openMail(){
   operation++;opener=document.activeElement;mode='new';view='form';completion=null;setBusy(false);
   email.value='';password.value='';confirmation.value='';clearErrors();hidePasswords();
   opened=true;overlay.hidden=false;welcome.inert=true;welcome.setAttribute('aria-hidden','true');sheet.scrollTop=0;status('');render();email.focus({preventScroll:true});
   const current=operation;
   if(typeof C.settings==='function')C.settings().then(config=>{onb.dataset.emailConfirmation=config.mailer_autoconfirm===true?'disabled':config.mailer_autoconfirm===false?'required':'unknown';if(current===operation&&opened&&mode==='new'&&config.mailer_autoconfirm===false)formError(CONFIRMATION_MESSAGE);}).catch(()=>{});
  }
  function closeMail(){
   operation++;opened=false;setBusy(false);overlay.hidden=true;welcome.inert=false;welcome.removeAttribute('aria-hidden');
   email.value='';password.value='';confirmation.value='';hidePasswords();clearErrors();sheet.style.bottom='';sheet.style.maxHeight='';
   if(opener&&opener.isConnected)opener.focus({preventScroll:true});
  }
  $('en-mail-close').onclick=closeMail;
  overlay.onclick=event=>{if(event.target===overlay)closeMail();};
  modeButtons.forEach(button=>button.onclick=()=>{if(busy)return;mode=button.dataset.mailMode;view='form';clearErrors();password.value='';confirmation.value='';hidePasswords();render();});
  eyeButtons.forEach(button=>button.onclick=()=>{
   const input=$(button.dataset.eye),visible=input.type==='password';input.type=visible?'text':'password';button.textContent=visible?'Masquer':'Voir';button.setAttribute('aria-pressed',String(visible));button.setAttribute('aria-label',(visible?'Masquer':'Afficher')+(button.dataset.eye==='en-mail-confirm'?' la confirmation du mot de passe':' le mot de passe'));
  });
  Object.entries(fields).forEach(([key,input])=>input.addEventListener('input',()=>clearError(key)));
  forgot.onclick=()=>{operation++;setBusy(false);view='recovery';clearErrors();password.value='';confirmation.value='';hidePasswords();render();sheet.scrollTop=0;email.focus({preventScroll:true});};
  returnButton.onclick=()=>{operation++;setBusy(false);view='form';mode='back';clearErrors();render();email.focus({preventScroll:true});};
  async function finishAuthentication(result,request){
   if(request!==operation||!opened)return;
   if(result.kind==='vault'){
    await window.__vaultAdopt(result.record);return;
   }
   window.__enMail=result.session.user.email;
   if(window.__enPend){delete window.__enPend.m;delete window.__enPend.p;delete window.__enPend.at;}
   if(result.kind==='new'){
    closeMail();window.__enOnboardingAdvance();return;
   }
   completion='empty';view='outcome';outcomeTitle.textContent='Ton compte est connecté';outcomeText.textContent='Aucun carnet n’est encore enregistré en ligne pour ce compte. Souhaites-tu en commencer un ?';outcomeNext.textContent='Créer mon carnet';outcomeBack.hidden=false;render();outcomeNext.focus({preventScroll:true});
  }
  form.onsubmit=async event=>{
   event.preventDefault();if(busy||!opened||view==='outcome')return;clearErrors();
   const data={mode,email:email.value,password:password.value,confirmation:confirmation.value,recovery:view==='recovery'};
   const errors=validateAuth(data);if(errors.length){errors.forEach(([key,message])=>fieldError(key,message));fields[errors[0][0]].focus({preventScroll:true});return;}
   setBusy(true);const request=++operation;
   try{
    if(data.recovery){
     await C.recover(data.email.trim());if(request!==operation||!opened)return;
     completion='recovery';view='outcome';outcomeTitle.textContent='Consulte tes e-mails';outcomeText.textContent='Si un compte correspond à cette adresse, tu recevras un lien pour choisir un nouveau mot de passe.';outcomeNext.textContent='Revenir à la connexion';outcomeBack.hidden=true;password.value='';confirmation.value='';hidePasswords();render();outcomeNext.focus({preventScroll:true});
    }else await finishAuthentication(await authenticate(C,data),request);
   }catch(error){if(request===operation&&opened)formError(serviceMessage(error));}
   finally{if(request===operation&&opened)setBusy(false);}
  };
  outcomeNext.onclick=()=>{
   if(completion==='recovery'){view='form';mode='back';clearErrors();render();email.focus({preventScroll:true});return;}
   if(completion==='empty'){closeMail();window.__enOnboardingAdvance();}
  };
  outcomeBack.onclick=()=>{view='form';mode='back';clearErrors();password.value='';confirmation.value='';render();email.focus({preventScroll:true});};
  emailButton.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();openMail();},true);
  googleButton.addEventListener('click',event=>{
   event.preventDefault();event.stopImmediatePropagation();status('');googleButton.disabled=true;googleButton.textContent='Ouverture de Google…';
   try{C.google();}catch(error){googleButton.disabled=false;googleButton.textContent=initialGoogleText;status(serviceMessage(error));}
  },true);
  onb.addEventListener('keydown',event=>{
   if(!opened)return;if(event.key==='Escape'){event.preventDefault();closeMail();return;}
   if(event.key!=='Tab')return;
   const controls=[...sheet.querySelectorAll('button,input')].filter(control=>!control.disabled&&!control.closest('[hidden]'));const first=controls[0],last=controls[controls.length-1];
   if(!first)return;if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  async function resumeGoogle(){
   if(!window.__enOAuthReturn)return;window.__enOAuthReturn=false;
   if(!onb.classList.contains('en-on'))return;
   try{
    const session=await C.session();if(!session||!session.user)throw new Error('La connexion Google n’a pas pu être confirmée. Réessaie.');
    googleButton.disabled=true;googleButton.textContent='Connexion en cours…';const record=await C.pull();
    if(record&&record.box){await window.__vaultAdopt(record);return;}
    window.__enMail=session.user.email;window.__enOnboardingAdvance();
   }catch(error){status(serviceMessage(error));googleButton.disabled=false;googleButton.textContent=initialGoogleText;}
  }
  if(window.__enOAuthError){status(window.__enOAuthError);window.__enOAuthError='';}
  render();resumeGoogle();
  window.addEventListener('pageshow',()=>{googleButton.disabled=false;googleButton.textContent=initialGoogleText;syncChrome();});
 }
 window.__enInitConnexion=install;
 if(document.getElementById('en-app'))install();
})();
