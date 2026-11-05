import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {runInNewContext,Script} from 'node:vm';
const js=await readFile(new URL('../compagnons.js',import.meta.url),'utf8');
const model=js.slice(js.indexOf('const SPECIES='),js.indexOf('// Fin du modèle'));
const {normalizeCompanion,confirmCompanion}=runInNewContext(model+';({normalizeCompanion,confirmCompanion})');
test('les facettes et petits noms de chaque compagnon survivent à une sauvegarde JSON',()=>{
 const state=normalizeCompanion({selected:'chien',bySpecies:{chat:{name:'Plume',traits:[0,2]},chien:{name:'Biscuit',traits:[0,1,2]}},deferred:true,confirmed:true});
 const restored=normalizeCompanion(JSON.parse(JSON.stringify(state)));
 assert.equal(restored.selected,'chien');assert.equal(restored.bySpecies.chat.name,'Plume');
 assert.deepEqual(Array.from(restored.bySpecies.chat.traits),[0,2]);
 assert.deepEqual(Array.from(restored.bySpecies.chien.traits),[0,1,2]);assert.equal(restored.deferred,true);
});
test('une ancienne espèce ou des facettes invalides ne cassent pas la reprise du coffre',()=>{
 const state=normalizeCompanion({selected:'herisson',bySpecies:{chat:{name:'<Plume>',traits:[0,0,-1,3,'1',2]}}});
 assert.equal(state.selected,'chat');assert.equal(state.bySpecies.chat.name,'Plume');
 assert.deepEqual(Array.from(state.bySpecies.chat.traits),[0,2]);assert.equal(Object.keys(state.bySpecies).length,4);
});
test('la confirmation attend la sauvegarde et reste récupérable après un échec',async()=>{
 const state=normalizeCompanion();let finish;let done=false;
 const pending=confirmCompanion(state,'chien',' Biscuit ',()=>new Promise(resolve=>finish=resolve)).then(()=>done=true);
 await Promise.resolve();assert.equal(done,false);finish();await pending;assert.equal(state.confirmed,true);
 await assert.rejects(()=>confirmCompanion(state,'lapin','Caramel',async()=>{throw Error('disque plein')}));
 assert.equal(state.selected,'chien');assert.equal(state.confirmed,true);
});
test('les illustrations et contrôleurs validés sont inclus dans le cache et la construction',async()=>{
 new Script(js);
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 const build=await readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 for(const species of ['chat','panda','lapin','chien'])for(const suffix of ['wake.mp4','awake.webp','sleep.webp']){
  const path=`illus/companions/${species}-${suffix}`;await access(new URL('../'+path,import.meta.url));assert.ok(sw.includes(path));
 }
 for(const path of ['compagnons.js','compagnons.css','onboarding-valide.css']){assert.ok(html.includes(path));assert.ok(sw.includes(path));assert.ok(build.includes(path));}
});
