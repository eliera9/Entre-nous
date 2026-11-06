import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../ma-vie-validee.js',import.meta.url),'utf8');
const win={};new Function('window',source)(win);
const {model,createLifeDecision,createLifeLogic}=win.__enApprovedLifeTools;
const logic=createLifeLogic(model);
const draft={selected:['Avec mon ou ma partenaire'],detail:'Un brouillon',rows:[{name:'Prénom fictif'}],ideasOpen:true};
test('ne pas répondre est conservé comme choix terminé sans ouvrir de relances',()=>{
 const committed=createLifeDecision(draft,{declined:true});
 assert.equal(committed.state,'answered');assert.equal(committed.declined,true);assert.equal(committed.verified,true);
 assert.deepEqual(logic.followers('avec',committed),[]);
 const saved=JSON.parse(JSON.stringify(committed));assert.equal(saved.declined,true);
 assert.equal(draft.declined,undefined);assert.notEqual(committed.rows,draft.rows);
});
test('répondre plus tard reste en attente sans avancer la progression du thème',()=>{
 const answers={ville:createLifeDecision(draft),ville_bien:createLifeDecision(draft),avec:createLifeDecision(draft,{paused:true})};
 assert.equal(answers.avec.state,'paused');assert.equal(answers.avec.declined,false);
 assert.equal(logic.progress('moi',answers).filled,0);assert.equal(logic.progress('moi',answers).paused,1);
 answers.avec=createLifeDecision({...draft,selected:[]},{declined:true});assert.equal(logic.progress('moi',answers).filled,1);
});
test('on peut remplacer son refus par une réponse sans garder le marqueur de refus',()=>{
 const declined=createLifeDecision(draft,{declined:true});const answered=createLifeDecision({...declined,selected:['Je vis seul']});
 assert.equal(answered.declined,false);assert.ok(logic.followers('avec',answered).includes('solo_plait'));
});
