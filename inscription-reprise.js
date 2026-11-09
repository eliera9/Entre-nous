/* Reprise locale d'une inscription inachevée ; la clé temporaire n'est jamais synchronisée. */
(function(global){
 'use strict';
 const DRAFT_KEY='inscription-en-cours-v1';
 const ROUTES=['onb','mvintro','mv','mv2','mv3','mvai','mvret'];
 function createDraftStore({crypto,get,put}){
  let key=null;
  const encoder=new TextEncoder(),decoder=new TextDecoder();
  async function encode(payload,owner=null){
   key||=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
   const iv=crypto.getRandomValues(new Uint8Array(12)),bytes=encoder.encode(JSON.stringify(payload));
   const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,bytes);
   return {version:1,owner:owner||null,key,iv,ciphertext};
  }
  async function read(owner=null,vault=null){
   const record=await get(DRAFT_KEY);if(!record||record.version!==1||record.owner!==(owner||null))return null;
   const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:record.iv},record.key,record.ciphertext);
   const payload=JSON.parse(decoder.decode(data));
   if(payload.progress?.active!==true||!ROUTES.includes(payload.progress.screen)||typeof payload.dek!=='string')return null;
   if((payload.vaultAt??null)!==(vault?.at??null))return null;
   key=record.key;return payload;
  }
  return {encode,read,async write(payload,owner=null){const record=await encode(payload,owner);await put(DRAFT_KEY,record);return record;}};
 }
 global.__enEnrollmentTools={DRAFT_KEY,ROUTES,createDraftStore};
 if(!global.document)return;
 let installed=false,restoring=false;
 function capture(){
  const progress=global.__enEnrollmentState?.();if(!progress?.active||restoring)return;
  const onb=document.getElementById('onb'),current=document.querySelector('#en-app .phone.en-on');
  if(current&&ROUTES.includes(current.id))progress.screen=current.id;
  if(current?.id==='onb')progress.step=Number(onb.dataset.enStep)||0;
  const name=document.getElementById('o2in'),nickname=document.getElementById('o2nick');
  progress.identity={name:name?.value||'',nickname:nickname?.value||'',nicknameOpen:!!document.getElementById('o2nick-details')?.open,birth:[...document.querySelectorAll('#onb .o2pills select')].map(input=>input.value)};
  const life=global.__enGet?.('lifeform-approved-v1');if(life){progress.chapter=life.selected||'moi';progress.page=life.pagesV2?.lastPage?.[progress.chapter]||null;}
  global.__enCaptureLifeDraft?.();
 }
 function backButton(id,label,action){
  const page=document.getElementById(id);if(!page||page.querySelector(':scope > [data-journey-back]'))return;
  const button=document.createElement('button');button.type='button';button.className='en-journey-back';button.dataset.journeyBack='';button.textContent='‹';button.setAttribute('aria-label',label);button.addEventListener('click',action);page.prepend(button);
 }
 global.__enCaptureEnrollment=capture;
 global.__enInitEnrollmentUI=function(){
  if(installed)return;installed=true;
  const onb=document.getElementById('onb'),back=document.getElementById('obk');if(onb&&back)onb.prepend(back);
  backButton('mvintro','Retour à l’inscription',()=>{if(global.__enEnrollmentState?.().active)global.__enOnboardingReturnIdentity?.();else global.__enShow('home');});
  backButton('mv','Revenir à la page précédente',()=>global.__enShow(global.__enEnrollmentState?.().active?'mvintro':'mvfiche'));
  const progress=global.__enEnrollmentState?.();
  if(progress?.active){
   restoring=true;
   const identity=progress.identity||{};
   for(const [id,value] of [['o2in',identity.name],['o2nick',identity.nickname]]){const input=document.getElementById(id);if(input&&typeof value==='string')input.value=value;}
   const nicknameDetails=document.getElementById('o2nick-details');if(nicknameDetails)nicknameDetails.open=!!identity.nicknameOpen;
   [...document.querySelectorAll('#onb .o2pills select')].forEach((input,index)=>{if(identity.birth?.[index]!==undefined){input.value=identity.birth[index];input.classList.toggle('set',input.value!=='');}});
   const screen=progress.screen,step=progress.step;
   if(screen==='mv3'&&global.__mvopen)global.__mvopen(progress.chapter||'moi');
   else if(ROUTES.includes(screen))global.__enShow(screen);
   if(screen==='onb')global.__enOnboardingSetStep?.(step);
   restoring=false;global.__enEnrollmentReady?.();
  }
  const update=event=>{if(!global.__enEnrollmentState?.().active)return;if(event?.target?.closest?.('#o3p,input[type="password"]'))return;capture();global.__enEnrollmentChanged?.();};
  for(const type of ['input','change','click'])document.addEventListener(type,update);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){capture();global.__vaultPushNow?.();}});
  global.addEventListener('pagehide',capture);
 };
})(globalThis);
