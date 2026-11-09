import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const window={};
vm.runInNewContext(readFileSync(new URL('../ma-vie-validee.js',import.meta.url),'utf8'),{window});
const {finishKnowledge}=window.__enLifeTools;
test('Confirmer attend le brouillon puis la fin de l’inscription avant de revenir à l’accueil',async()=>{
 const calls=[];let saved;
 const task=finishKnowledge({saveDraft:()=>new Promise(resolve=>{saved=resolve;}),isEnrollmentActive:()=>true,completeEnrollment:async reason=>{calls.push(reason);return true;},show:id=>calls.push(id),reason:'completed'});
 assert.deepEqual(calls,[]);saved(true);assert.equal(await task,true);assert.deepEqual(calls,['completed','home']);
});
test('un brouillon refusé, une sauvegarde échouée ou une inscription non finalisée garde le formulaire ouvert',async()=>{
 for(const failure of ['false','reject','incomplete']){
  const routes=[];let completions=0;
  const task=finishKnowledge({saveDraft:async()=>{if(failure==='reject')throw Error('Stockage indisponible');return failure!=='false';},isEnrollmentActive:()=>true,completeEnrollment:async()=>{completions++;return false;},show:id=>routes.push(id),reason:'completed'});
  if(failure==='reject')await assert.rejects(task);else assert.equal(await task,false);
  assert.deepEqual(routes,[]);assert.equal(completions,failure==='incomplete'?1:0);
 }
});
test('Je reviendrai plus tard conserve sa destination et un carnet déjà créé garde son inscription terminée',async()=>{
 for(const active of [true,false]){
  const calls=[];
  assert.equal(await finishKnowledge({saveDraft:async()=>{calls.push('save');return true;},isEnrollmentActive:()=>active,completeEnrollment:async reason=>{calls.push(reason);return true;},show:id=>calls.push(id),reason:'later'}),true);
  assert.deepEqual(calls,active?['save','later','home']:['save','home']);
 }
});
