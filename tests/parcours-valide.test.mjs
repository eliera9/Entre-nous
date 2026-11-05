import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
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

test('un paragraphe développé distingue date, lieu, motif et ressenti',()=>{
 const p=importText("## MOI AUJOURD’HUI\n- Ville : Rennes.\n- Depuis : Juin 2024. J’ai déménagé pour rejoindre mon compagnon. Je suis encore en train de trouver mes repères.");
 assert.deepEqual(p.proposals.ville.rows[0],{place:'Rennes',since:'Juin 2024',why:'J’ai déménagé pour rejoindre mon compagnon.'});
 assert.match(p.proposals.ville_bien.detail,/repères/);assert.ok(!p.proposals.ville.rows[0].since.includes('compagnon'));
});
test('emploi actuel et anciennes études ne deviennent pas deux activités actuelles',()=>{
 const p=importText('## MOI AUJOURD’HUI\n- Travail ou études : Je suis libraire et je travaille depuis mon domicile. Auparavant, j’ai étudié le droit.');
 assert.equal(p.proposals.job.rows[0].title,'libraire');assert.deepEqual(p.proposals.trav.selected,['Je travaille']);
 assert.equal(p.proposals.job.rows[0].since,undefined);
 assert.equal(p.proposals.et_quoi,undefined);assert.match(p.proposals.pa_moments.detail,/droit/);
});
test('études et emploi explicitement actuels peuvent coexister',()=>{
 const p=importText('## MOI AUJOURD’HUI\n- Travail ou études : Je suis étudiant en architecture et je travaille dans une librairie.');
 assert.deepEqual(p.proposals.trav.selected,['J’étudie','Je travaille']);assert.match(p.proposals.et_quoi.rows[0].study,/architecture/);assert.match(p.proposals.job.rows[0].title,/librairie/);
});
test('une personne sans emploi n’est pas transformée en salariée',()=>{
 const p=importText('## MOI AUJOURD’HUI\n- Travail ou études : Je suis sans emploi actuellement.');
 assert.equal(p.proposals.job,undefined);assert.ok(!p.proposals.trav.selected.includes('Je travaille'));
});
test('les ligatures et les animaux ne créent pas de faux membres de famille',()=>{
 const p=importText('## MOI AUJOURD’HUI\n- Animaux : Moka, surnommée Biscotte | Chatte | Câline | Elle vit avec nous.\n## MES PROCHES\n- Proche : Moka, dite Biscotte | Notre chatte | Depuis deux ans | Des câlins | Des jeux.\n- Proche : Zoé | Ma petite sœur | Depuis sa naissance | Nous nous parlons peu. | Nos jeux.');
 assert.equal(p.proposals.an_quel.rows.length,1);assert.equal(p.proposals.an_quel.rows[0].species,'Chatte');
 assert.equal(p.proposals.pr_noms.rows[0].name,'Zoé');assert.equal(p.proposals.pr_autre,undefined);
});
test('une ancienne amitié ne suffit pas à déclarer une amitié proche actuelle',()=>{
 const p=importText('## MES PROCHES\n- Proche : Léa | Ancienne meilleure amie | Depuis le lycée | Amitié terminée | Nos sorties.');
 assert.equal(p.proposals.pr_amis,undefined);assert.match(p.proposals.pr_amie_nom.rows[0].bond,/Amitié passée/);assert.equal(p.proposals.pr_amie_nom.rows[0].since,'Depuis le lycée');
});
test('les étapes, souvenirs et dates de couple gardent leurs champs respectifs',()=>{
 const p=importText('## MON PASSÉ\n- Passage : Mon adolescence | 2012 | 2018 | Nantes | Élève | Mes amis | Un déménagement | La musique.\n- Souvenir : Peluche | Sans petit nom particulier | Depuis mon enfance | Je la garde.\n## NOTRE HISTOIRE\n- Dates importantes : juin 2024 : notre rencontre ; été 2025 : voyage.\n- Chapitre : Notre première rencontre | Juin 2024 | Une promenade. | — | Au parc | — | — | — | Été | De la joie | Nos échanges.');
 assert.deepEqual(p.proposals.pa_moments.rows[0],{event:'Mon adolescence',date:'2012 → 2018'});
 assert.equal(p.proposals.pa_objet.rows[0].name,undefined);assert.equal(p.proposals.hi_dates.rows[0].when,'2024-06');assert.equal(p.proposals.hi_dates.rows[1].when,'été 2025');
 assert.equal(p.proposals.hi_rdv.rows[0].place,'Au parc');assert.equal(p.proposals.hi_souvenir.rows[0].title,'Notre première rencontre');
});
test('une envie d’écrire ne devient pas un loisir déjà pratiqué',()=>{
 const p=importText('## MOI AUJOURD’HUI\n- Loisirs et passion : La lecture et les jeux vidéo. Je rêve d’écrire un roman.');
 assert.deepEqual(p.proposals.loisirs.selected,['Lire','Jouer aux jeux vidéo']);assert.deepEqual(p.proposals.ecrit.selected,['J’aimerais essayer']);
});
test('les phrases du réveil et les difficultés d’endormissement restent séparées',()=>{
 const p=importText('## MOI AUJOURD’HUI\n- Journées, rituels et sommeil : Mes matins commencent avec un câlin. J’aime les soirées au calme. Mon sommeil est parfois difficile et je me réveille fatiguée.');
 assert.equal(p.proposals.rev.detail,'Mes matins commencent avec un câlin.');assert.deepEqual(p.proposals.sommeil.selected,['ça dépend des soirs']);assert.equal(p.proposals.boisson,undefined);
 assert.ok(!p.proposals.moment?.selected.includes('le soir, quand je rentre'));
});
test('qualités, émotions et nuances du couple sont réparties sans crise inventée',()=>{
 const p=importText('## MON INTÉRIEUR\n- Ma plus grande qualité : L’écoute et la loyauté.\n- Ce qui me met en colère : Le mensonge.\n- Une phrase qui me guide : Rester libre.\n## NOTRE HISTOIRE\n- Ce qu’elle aime chez lui ou elle : Sa tendresse. Je pense lui apporter mon soutien.\n- Ce qui est plus dur : Nous discutons calmement. Les câlins nous aident à nous réconcilier.');
 assert.deepEqual(p.proposals.in_qualite.selected,['L’écoute','La loyauté']);assert.match(p.proposals.in_valeurs.detail,/Rester libre/);
 assert.equal(p.proposals.hi_aime_chez.detail,'Sa tendresse.');assert.equal(p.proposals.hi_apporte.detail,'Je pense lui apporter mon soutien.');assert.match(p.proposals.hi_retrouver.detail,/réconcilier/);assert.equal(p.proposals.hi_perdre,undefined);
});

const {createLifeReviewState,prepareImportReviewDraft}=win.__enApprovedLifeTools;
const savedProposal=(value,verified=false)=>({...answer([],value),verified,imported:true,sources:[{kind:'export',text:value}]});
test('la reprise conserve le curseur et les réponses vérifiées après chiffrement',async()=>{
 const stored={answers:{ville:savedProposal('Rennes',true),job:savedProposal('Libraire'),pa_objet:savedProposal('Un carnet')},drafts:{job:{...savedProposal('Libraire en temps partiel'),edited:true}},lastQuestion:{}};
 const tracker=createLifeReviewState(model,stored);tracker.remember('moi','job',true);
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const start=html.indexOf('const b64='),end=html.indexOf('/* ---------- coffre v2',start);
 const {seal,open}=runInNewContext(`const enc=new TextEncoder(),dec=new TextDecoder(),ITER=310000;${html.slice(start,end)};({seal,open})`,{TextEncoder,TextDecoder,Uint8Array,btoa,atob,crypto:webcrypto});
 const key=await webcrypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 const restored=JSON.parse(JSON.stringify(await open(key,await seal(key,{st:{'lifeform-approved-v1':stored}})))).st['lifeform-approved-v1'];
 const resumed=createLifeReviewState(model,restored);
 assert.equal(resumed.resume(),'job');assert.equal(restored.drafts.job.detail,'Libraire en temps partiel');assert.equal(restored.answers.ville.verified,true);
 assert.equal(resumed.previous('job'),'ville');assert.equal(resumed.next('job'),'pa_objet');assert.ok(resumed.path('moi').some(x=>x.id==='ville'));
});
test('un retour arrière reste possible entre les chapitres après réouverture',()=>{
 const stored={answers:{job:savedProposal('Libraire',true),pa_objet:savedProposal('Un carnet')},drafts:{}};
 let tracker=createLifeReviewState(model,stored);tracker.remember('passe','pa_objet',true);
 const restored=JSON.parse(JSON.stringify(stored));tracker=createLifeReviewState(model,restored);
 assert.equal(tracker.resume(),'pa_objet');assert.equal(tracker.previous('pa_objet'),'job');assert.equal(tracker.location('job').chapter,'moi');
 assert.equal(tracker.pending().length,1);
});
test('une position normale utilise l’identifiant de question plutôt que son ancien indice',()=>{
 const stored={answers:{},drafts:{},lastQuestion:{moi:'job'}};
 const tracker=createLifeReviewState(model,stored);
 assert.equal(tracker.normalPosition('moi',[{id:'ville'},{id:'avec'},{id:'trav'},{id:'job'}],0),3);
 assert.equal(tracker.normalPosition('moi',[{id:'ville'},{id:'job'}],0),1);
});
test('la vérification terminée garde ses réponses pour une simple relecture',()=>{
 const stored={answers:{ville:savedProposal('Rennes',true),job:savedProposal('Libraire',true)},drafts:{}};
 const tracker=createLifeReviewState(model,stored);tracker.remember('moi','job',true);tracker.finish();
 const restored=JSON.parse(JSON.stringify(stored)),again=createLifeReviewState(model,restored);
 assert.equal(again.pending().length,0);assert.equal(again.resume(),'ville');assert.deepEqual(again.sync(),['ville','job']);
 assert.equal(restored.answers.job.detail,'Libraire');assert.equal(restored.answers.job.verified,true);
});
test('la relecture du texte garde le plan, les remplacements et les volets ouverts',()=>{
 const state={revision:2};const plan=importText(structured([{id:'ville',rows:[{place:'Rennes'}]}]));
 const review=prepareImportReviewDraft(state,{plan,incoming:{moi:[['Ville','Rennes']]},provider:'chatgpt',scope:null});
 review.replaceQuestions=['ville'];review.replaceKeys=['moi:VILLE'];review.openSections=[0,2];
 const restored=JSON.parse(JSON.stringify(state));
 assert.equal(restored.review.stage,'preview');assert.equal(restored.review.plan.proposals.ville.rows[0].place,'Rennes');
 assert.deepEqual(restored.review.replaceQuestions,['ville']);assert.deepEqual(restored.review.replaceKeys,['moi:VILLE']);assert.deepEqual(restored.review.openSections,[0,2]);
 prepareImportReviewDraft(restored,{plan,incoming:restored.review.incoming,provider:'chatgpt',scope:null});assert.deepEqual(restored.review.replaceQuestions,['ville']);
 restored.revision++;restored.review.stage='editing';prepareImportReviewDraft(restored,{plan,incoming:{},provider:'chatgpt',scope:null});assert.deepEqual(restored.review.replaceQuestions,[]);
});
test('les anciens imports et les brouillons corrigés rejoignent la reprise sans réimporter',()=>{
 const stored={answers:{ville:savedProposal('Rennes',true),job:savedProposal('Libraire',true)},drafts:{job:{...savedProposal('Libraire à mi-temps',true),edited:true}}};
 const tracker=createLifeReviewState(model,stored);assert.deepEqual(tracker.pending(),['job']);assert.equal(tracker.resume(),'job');
 tracker.review.order.push('inconnue');assert.ok(!tracker.sync().includes('inconnue'));
 assert.equal(stored.answers.ville.detail,'Rennes');
});
