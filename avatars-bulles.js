/* Les avatars des conversations ; le choix du compagnon conserve ses scènes. */
(()=>{
// Début du modèle des avatars.
const BUBBLE_CONTEXTS='.lv-question,.lv-bubbleline,.mvring,.gring,.sbplume,.ps-bub,.ps-yay,.bub,.rgov .a,.rgcard,.acps .pl,.ps-lk,.lv-question,.lv-bubbleline,.en-dialogue';
function avatarAsset(source,night){
 const match=String(source||'').match(/(?:^|\/)illus\/(?:eveil-(chat|panda|lapin|chien)(?:-nuit)?\.webp|avatars-compagnons\/(chat|panda|lapin|chien)-(?:jour|nuit)\.svg)(?:[?#].*)?$/);
 return match?'illus/avatars-compagnons/'+(match[1]||match[2])+'-'+(night?'nuit':'jour')+'.svg':null;
}
function nightPalette(className,background){return /(?:^|\s)nuit(?:\s|$)/.test(className||'')||/^(?:#2a1e26|rgb\(42,30,38\))$/i.test(String(background||'').replace(/\s/g,''));}
function eligible(image){return !image.closest('#mv')&&!!image.closest(BUBBLE_CONTEXTS);}
// Fin du modèle des avatars.
let installed=false,scheduled=false;
function normalize(image){
 if(!eligible(image))return;
 const phone=image.closest('.phone'),theme=phone||document.documentElement;
 const night=phone?nightPalette(phone.className,getComputedStyle(phone).getPropertyValue('--sbg')):theme.classList.contains('en-nuit');
 let asset=avatarAsset(image.getAttribute('src'),night);if(!asset)return;
 const selected=window.__pet;if(['chat','panda','lapin','chien'].includes(selected))asset='illus/avatars-compagnons/'+selected+'-'+(night?'nuit':'jour')+'.svg';
 if(image.getAttribute('src')!==asset)image.setAttribute('src',asset);
 if(!image.classList.contains('en-bubble-avatar'))image.classList.add('en-bubble-avatar');
 const frame=image.closest('.mvring,.gring,.sbplume,.rgov .a,.rgcard>span:first-child');
 if(frame&&!frame.classList.contains('en-avatar-frame'))frame.classList.add('en-avatar-frame');
}
function scan(){scheduled=false;document.querySelectorAll('#en-app img').forEach(normalize);}
window.__enSyncBubbleAvatars=scan;
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(scan);}}
function install(){
 if(installed)return;installed=true;
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','class','style']});
 scan();
}
window.__enInitBubbleAvatars=install;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
