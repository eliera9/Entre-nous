import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {runInNewContext,Script} from 'node:vm';

const source=await readFile(new URL('../accueil-valide.js',import.meta.url),'utf8');
const window={};runInNewContext(source,{window});
const tools=window.__enAccueilTools;

test('plusieurs ressentis coexistent et pas grand-chose reste exclusif',()=>{
 let selected=[];selected=tools.toggleFeeling(selected,'soulagée');selected=tools.toggleFeeling(selected,'fière');
 assert.deepEqual(Array.from(selected),['soulagée','fière']);
 selected=tools.toggleFeeling(selected,'pas grand-chose');assert.deepEqual(Array.from(selected),['pas grand-chose']);
 selected=tools.toggleFeeling(selected,'apaisée');assert.deepEqual(Array.from(selected),['apaisée']);
 selected=tools.toggleFeeling(selected,'apaisée');assert.equal(selected.length,0);
});

test('la journée utilise la date locale, y compris près de minuit',()=>{
 const date={getFullYear:()=>2026,getMonth:()=>10,getDate:()=>6};
 assert.equal(tools.dayKey(date),'2026-11-06');
 assert.equal(tools.word(0),'Très bas');assert.equal(tools.word(50),'Neutre');assert.equal(tools.word(100),'Très bien');
 assert.equal(tools.color(0),'rgb(169,156,196)');assert.equal(tools.color(100),'rgb(217,154,168)');
 assert.equal(tools.color(-20),tools.color(0));assert.equal(tools.color(120),tools.color(100));
});

test('les mots du compagnon restent liés à l’humeur déclarée',()=>{
 assert.match(tools.moodMessage(10),/Merci de me le confier/);
 assert.match(tools.moodMessage(50),/Pas besoin de chercher/);
 assert.match(tools.moodMessage(90),/garder une trace/);
 assert.equal(tools.DAILY,'Une pensée qui tourne, quelque chose à raconter, ou juste un petit passage… je suis là.');
 assert.doesNotMatch(tools.DAILY,/visite|faire le tour/i);
 new Script(source);
});

test('tous les nouveaux éléments sont construits et disponibles hors ligne',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 const build=await readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 for(const name of ['accueil-valide.js','accueil-valide.css']){assert.ok(html.includes(name));assert.ok(sw.includes(name));assert.ok(build.includes(name));}
 for(const name of ['etoile-du-nord.png','nav-accueil-line-art.png','nav-journal-line-art.png','nav-espace-line-art.png','nav-psy-line-art.png']){
  const path='illus/accueil-valide/'+name;await access(new URL('../'+path,import.meta.url));assert.ok(sw.includes(path));
 }
 assert.ok(build.includes("readdir(resolve(root, 'illus/accueil-valide'))"));
});
