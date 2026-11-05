import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const moduleSource=fs.readFileSync(new URL('../ma-vie-validee.js',import.meta.url),'utf8');
const win={};new Function('window',moduleSource)(win);
const {parsePortrait,mergePortrait,toggleChoice,refused,unknown}=win.__enLifeTools;
const tpl="## MOI AUJOURD'HUI\n- Ville :\n- Depuis :\n## MES PROCHES\n- Proche :";
test('un portrait partiel conserve les proches et ignore les valeurs inconnues',()=>{
 const parsed=parsePortrait("## MOI AUJOURD’HUI\n- Ville : Lyon\n- Depuis : —\n## MES PROCHES\n- Proche : Exemple A | amitié\n- Proche : Exemple B | famille",tpl);
 assert.deepEqual(parsed.moi,[['Ville','Lyon']]);assert.equal(parsed.proches.length,2);
});
test('le texte libre et les précisions multilignes restent disponibles',()=>{
 assert.equal(parsePortrait('Un texte sans titre.',tpl).autres[0][1],'Un texte sans titre.');
 assert.equal(parsePortrait("## MOI AUJOURD'HUI\n- Ville : Lyon\net les alentours",tpl).moi[0][1],'Lyon\net les alentours');
});
test('une ancienne valeur est préservée sans choix explicite de remplacement',()=>{
 const old={moi:[['Ville','Paris']]},incoming={moi:[['Ville','Lyon']]};
 assert.equal(mergePortrait(old,incoming,new Set()).moi[0][1],'Paris');
 assert.equal(mergePortrait(old,incoming,new Set(['moi:VILLE'])).moi[0][1],'Lyon');
 assert.equal(old.moi[0][1],'Paris');
});
test('les réponses multiples respectent les choix exclusifs et les refus',()=>{
 assert.deepEqual(toggleChoice(['Lire'],'Jouer',false),['Lire','Jouer']);
 assert.deepEqual(toggleChoice(['Lire'],'pas maintenant',false),['pas maintenant']);
 assert.deepEqual(toggleChoice(['oui'],'non',true),['non']);
 assert.ok(refused('Je préfère ne pas en parler'));assert.ok(unknown('je ne sais pas trop'));
});
test('les branches travail et études et les loisirs multiples restent accessibles',()=>{
 const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const start=index.indexOf("(function(){const chat=document.getElementById('mvchat')");
 const end=index.indexOf('const LIFE=',start);
 assert.ok(start>=0&&end>start);
 const definitions=index.slice(start,end).replace(/^\(function\(\)\{/,'')+'return {N,CHAPTERS,P,addStory,hobbiesIn};';
 const app={__profil:{},__accord:'f'};
 new Function('globalThis',fs.readFileSync(new URL('../ma-vie-parcours.js',import.meta.url),'utf8'))(app);
 const model=new Function('window','document',definitions)(app,{getElementById:()=>null});
 const a=moduleSource.indexOf('N.loisirs.q='),b=moduleSource.indexOf(' let chapter=',a);
 new Function('N','P','model',moduleSource.slice(a,b))(model.N,model.P,model);
 const work=model.N.trav.then('je travaille\nj’étudie');assert.ok(work.includes('job'));assert.ok(work.includes('et_quoi'));
 const hobbies=model.N.loisirs.then('lire\nles jeux vidéo\nles séries\nla photo\nla musique');
 for(const id of ['lire_genre','jeux','serie','photo','mus'])assert.ok(hobbies.includes(id));
 assert.ok(Object.keys(model.N).length>=199);
});
