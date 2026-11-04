/* Entre nous · création du code, sans conserver les chiffres dans le DOM. */
(()=>{
window.__enInitCode=({onChange,isActive})=>{
 const $=id=>document.getElementById(id),a=$('o3a'),success=$('o3success'),face=$('o3b'),pad=$('o3p'),title=$('o3t'),sub=$('o3s'),feedback=$('o3feedback'),dots=[...$('o3d').children];
 let first='',current='',confirm=false,busy=false,saved=false,phase='entry',timer,pulse;
 const api={get ready(){return phase==='success'},get busy(){return busy},leave,continue:next};
 function render(){
  a.hidden=phase!=='entry';success.hidden=phase!=='success';
  title.textContent=confirm?'Encore une fois':'Un code, rien qu’à toi';
  sub.textContent=confirm?'Confirme les 4 chiffres que tu viens de choisir.':'4 chiffres pour retrouver ton espace.';
  dots.forEach((dot,i)=>dot.classList.toggle('on',i<current.length));
  $('o3d').setAttribute('aria-label',`${current.length} chiffre${current.length>1?'s':''} sur 4`);
  pad.querySelectorAll('button').forEach(button=>button.disabled=busy);
  a.setAttribute('aria-busy',String(busy));onChange();
 }
 function stopPulse(){clearTimeout(pulse);success.classList.remove('playing')}
 function leave(){
  stopPulse();if(busy||saved)return;
  clearTimeout(timer);first='';current='';confirm=false;feedback.textContent='';render();
 }
 function next(){
  if(phase!=='success'||busy)return;
  stopPulse();busy=true;onChange();
  const faceStep=()=>{busy=false;phase='face';success.hidden=true;face.hidden=false;onChange()};
  if(window.__vaultHasSecours&&!window.__vaultHasSecours()&&window.__enSecours)window.__enSecours(faceStep);
  else faceStep();
 }
 async function complete(){
  if(!confirm){first=current;current='';confirm=true;busy=false;feedback.textContent='';render();return}
  if(current!==first){current='';busy=false;feedback.textContent='Les deux saisies sont différentes. Réessaie.';render();return}
  feedback.textContent='Enregistrement…';render();
  try{
   if(typeof window.__vaultSetCode!=='function')throw new Error('vault-unavailable');
   await window.__vaultSetCode(first,{deferRecovery:true});
   saved=true;first='';current='';busy=false;phase='success';feedback.textContent='';render();
   success.classList.add('playing');
   pulse=setTimeout(()=>{if(!isActive()||document.hidden||phase!=='success')return;try{if(typeof navigator.vibrate==='function')navigator.vibrate(20)}catch{}},220);
  }catch{
   current='';busy=false;feedback.textContent='Ton code n’a pas pu être enregistré. Garde cette page ouverte et confirme-le à nouveau.';render();
  }
 }
 function key(value){
  if(busy||phase!=='entry'||!isActive())return;
  if(value==='Backspace'){current=current.slice(0,-1);feedback.textContent='';render();return}
  if(!/^\d$/.test(value)||current.length>=4)return;
  feedback.textContent='';current+=value;if(current.length===4){busy=true;timer=setTimeout(complete,250)}render();
 }
 pad.addEventListener('click',event=>{const button=event.target.closest('button');if(button)key(button.dataset.key)});
 document.addEventListener('keydown',event=>{if(!isActive()||phase!=='entry'||event.altKey||event.ctrlKey||event.metaKey)return;if(/^\d$/.test(event.key)||event.key==='Backspace'){event.preventDefault();key(event.key)}});
 render();return api;
};
})();
