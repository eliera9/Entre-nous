import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext, Script } from 'node:vm';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const resolver=html.split('\n').find(line=>line.startsWith('window.__P=()=>'));
function display(profile){
 const window={__P0:()=>profile.prenom||''};
 runInNewContext(resolver,{window,LIVE:{rg:{o:profile}}});return window.__P();
}
test('le choix du prénom reste prioritaire même quand un surnom est enregistré',()=>{
 const profile={prenom:'Camille',petit:'Cami',appellation:0};
 assert.equal(display(profile),'Camille');
 profile.appellation=1;assert.equal(display(profile),'Cami');
 profile.appellation=0;assert.equal(display(profile),'Camille');
 assert.equal(profile.petit,'Cami');assert.equal(profile.prenom,'Camille');
});
test('les anciens carnets gardent leur petit nom et un surnom vide reprend le prénom',()=>{
 assert.equal(display({prenom:'Camille',petit:'Cami'}),'Cami');
 assert.equal(display({prenom:'Camille',petit:'',appellation:1}),'Camille');
 assert.equal(display({prenom:'Camille'}),'Camille');
 assert.equal(display({prenom:'Camille',petit:'<Cami>',appellation:1}),'Cami');
});
test('la sauvegarde du carnet conserve les deux noms, le choix et les informations existantes',()=>{
 const profile={prenom:'Camille',petit:'Cami',appellation:1,naiss:[4,2,45],psy:'oui'};
 const start=html.indexOf('function snapshot(){'),end=html.indexOf("let last='';",start);
 const snapshot=runInNewContext(html.slice(start,end)+';snapshot',{LIVE:{rg:{o:profile,fields:'*'}}});
 const restored=JSON.parse(JSON.stringify(snapshot())).rg;
 assert.deepEqual(restored,profile);assert.equal(display(restored),'Cami');
 restored.appellation=0;assert.equal(display(restored),'Camille');
});
test('le contrôleur d’identité et ses styles restent disponibles hors ligne',async()=>{
 const source=await readFile(new URL('../profil-identite.js',import.meta.url),'utf8');new Script(source);
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 for(const name of ['profil-identite.js','profil-identite.css'])assert.ok(sw.includes('"'+name+'"'));
});
