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

const {model,createLifeLogic,migrateApprovedAnswers,createApprovedImport}=win.__enApprovedLifeTools;
const logic=createLifeLogic(model);
const importText=(portrait='',discussion='')=>createApprovedImport(model,portrait,discussion,parsePortrait,tpl,[]);
const structured=answers=>`=== REPONSES_ENTRE_NOUS_V1 ===\n${JSON.stringify({version:1,answers})}\n=== FIN_REPONSES_ENTRE_NOUS_V1 ===`;
const answer=(selected=[],detail='')=>({selected,detail,rows:[],state:'answered',verified:true});

test('le modèle validé conserve 199 questions sources dans 143 écrans',()=>{
 assert.equal(Object.keys(model.steps).length,143);
 const ids=Object.values(model.steps).flatMap(s=>s.source_ids);
 assert.equal(ids.length,199);assert.equal(new Set(ids).size,199);
 assert.equal(model.chapters.reduce((n,c)=>n+c.themes.length,0),39);
 for(const id of ids)assert.ok(model.steps[model.canonical[id]||id]);
});
test('travail et études et plus de quatre loisirs ouvrent toutes leurs branches',()=>{
 const values={trav:answer(['Je travaille','J’étudie']),loisirs:answer(['Lire','Faire du sport','Jouer aux jeux vidéo','Écrire','Faire de la photo'])};
 const path=logic.path('moi',values).map(x=>x.id);
 for(const id of ['job','et_quoi','lire_genre','sport_quel','jeux','ecrit','photo'])assert.ok(path.includes(id),id);
 assert.equal(logic.toggle(model.steps.trav,['Je travaille'],'J’étudie').length,2);
});
test('les refus ferment les branches et la précision seule ne valide pas une date',()=>{
 const p=logic.path('moi',{trav:answer(['Je préfère ne pas en parler'])}).map(x=>x.id);
 assert.ok(!p.includes('job'));assert.ok(!p.includes('et_quoi'));
 assert.ok(!logic.meaningful({selected:[],detail:'',rows:[{precision:'Une date exacte',_dates:{}}]}));
 assert.ok(logic.meaningful({selected:[],detail:'',rows:[{when:'2024'}]}));
});
test('la migration préserve les champs regroupés, les brouillons et les animaux',()=>{
 const previous={sessions:{moi:{answers:{ville:{fields:{ville:'Lyon',depuis:'2020'}},ville_why:{text:'Un nouveau départ'},v3_animaux:{animals:[{nom:'Moka',espece:'chat',status:'actuel'},{nom:'Nala',status:'ancien',souvenir:'Disparue'}]}},draft:{id:'job',fields:{title:'Libraire'},text:'Encore à préciser'}}}};
 const migrated=migrateApprovedAnswers(model,previous,{});
 assert.deepEqual(migrated.answers.ville.rows[0],{place:'Lyon',since:'2020',why:'Un nouveau départ'});
 assert.equal(migrated.drafts.job.rows[0].title,'Libraire');
 assert.equal(migrated.answers.an_quel.rows[0].name,'Moka');
 assert.match(migrated.answers.an_eu_nom.rows[0].situation,/Disparue/);
 assert.equal(previous.sessions.moi.answers.ville.fields.ville,'Lyon');
});
test('un export prépare les bons champs sans les marquer vérifiés',()=>{
 const p=importText(structured([{id:'ville',rows:[{place:'Lyon',since:2020}],detail:'Au calme'},{id:'loisirs',selected:['Lire','Écrire']}]));
 assert.equal(p.count,2);assert.equal(p.proposals.ville.rows[0].since,'2020');
 assert.equal(p.proposals.ville.verified,false);assert.equal(p.proposals.ville.sources[0].kind,'export');
 assert.deepEqual(p.proposals.loisirs.selected,['Lire','Écrire']);
 assert.equal(p.proposals.ville.rows[0].why,undefined);
});
test('les dernières réponses directes priment sur une synthèse plus ancienne',()=>{
 const p=importText("## MOI AUJOURD’HUI\n- Journées, rituels et sommeil : Des difficultés anciennes.",'QUESTION 001\nComment est ton sommeil en ce moment ?\nRÉPONSE\nJe dors mieux.');
 assert.equal(p.proposals.sommeil.detail,'Je dors mieux.');
 assert.equal(p.proposals.sommeil.sources[0].kind,'discussion');
});
test('les noms, dates inconnues et décès ne sont pas inventés',()=>{
 const p=importText(structured([{id:'pa_objet',rows:[{object:'Nounours bleu',since:'Petite enfance'}]},{id:'an_eu_nom',rows:[{name:'Nala',situation:'Disparue'}]}]));
 assert.equal(p.proposals.pa_objet.rows[0].name,undefined);
 assert.equal(p.proposals.an_eu_nom.rows[0].situation,'Disparue');
 assert.ok(!JSON.stringify(p.proposals).includes('décès'));
});
test('les dates invalides restent du texte et les fiches nulles sont ignorées',()=>{
 const p=importText(structured([{id:'hi_dates',rows:[null,{event:'Souvenir',precision:'Une date exacte',when:'2025-02-31'},{event:'Autre',precision:'Un mois et une année',when:'2020-13'}]}]));
 assert.equal(p.proposals.hi_dates.rows.length,2);
 for(const r of p.proposals.hi_dates.rows)assert.equal(r.precision,'Une période, avec mes mots');
 assert.equal(p.proposals.hi_dates.rows[0].when,'2025-02-31');
});
test('les choix incompatibles restent à départager dans le texte',()=>{
 const step=Object.values(model.steps).find(s=>s.exclusive.length&&s.ideas.length>1);
 const exclusive=step.exclusive[0],other=step.ideas.find(v=>v!==exclusive);
 const p=importText(structured([{id:step.id,selected:[exclusive,other]}]));
 assert.deepEqual(p.proposals[step.id].selected,[]);assert.match(p.proposals[step.id].detail,/départager/);
 assert.ok(p.warnings.length);assert.equal(p.proposals[step.id].writingOpen,true);
});
test('un bloc malformé ou des identifiants inconnus ne cassent pas l’import',()=>{
 assert.ok(importText('=== REPONSES_ENTRE_NOUS_V1 ===\n{\n=== FIN_REPONSES_ENTRE_NOUS_V1 ===').warnings.length);
 const p=importText(structured([{id:'__proto__',detail:'non'},{id:'inconnue',detail:'non'},{id:'ville',rows:[{place:'Lyon'}]}]));
 assert.equal(p.count,1);assert.equal(p.proposals.ville.rows[0].place,'Lyon');assert.ok(p.warnings.length);
});
test('le texte non attribué est conservé et les refus restent reportés',()=>{
 const raw='Un récit qui ne correspond pas à un champ précis.';
 assert.equal(importText(raw).portraitText,raw);
 const p=importText('','QUESTION 001\nComment est ton sommeil ?\nRÉPONSE\nJe préfère ne pas en parler.');
 assert.equal(p.proposals.sommeil.state,'paused');assert.equal(p.proposals.sommeil.verified,false);
});
