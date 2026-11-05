import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {runInNewContext,Script} from 'node:vm';
const source=await readFile(new URL('../avatars-bulles.js',import.meta.url),'utf8');
const model=source.slice(source.indexOf('const BUBBLE_CONTEXTS='),source.indexOf('// Fin du modèle'));
const {avatarAsset,nightPalette,eligible}=runInNewContext(model+';({avatarAsset,nightPalette,eligible})');
test('les quatre compagnons ont chacun une image jour et une image nuit, disponibles hors ligne',async()=>{
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 for(const animal of ['chat','panda','lapin','chien'])for(const night of [false,true]){
  const expected=`illus/avatars-compagnons/${animal}-${night?'nuit':'jour'}.svg`;
  assert.equal(avatarAsset(`illus/eveil-${animal}.webp`,night),expected);
  assert.equal(avatarAsset(`https://journal.test/Entre-nous/${expected}`,!night),expected.replace(night?'-nuit.svg':'-jour.svg',night?'-jour.svg':'-nuit.svg'));
  await access(new URL('../'+expected,import.meta.url));assert.ok(sw.includes(expected));
  const svg=await readFile(new URL('../'+expected,import.meta.url),'utf8');assert.ok(svg.includes('data:image/webp;base64,'));assert.ok(svg.includes(night?'#2A1E26':'#F5E0D3'));
 }
 new Script(source);
});
test('les images personnelles et les scènes de la page de choix ne sont pas remplacées',()=>{
 for(const src of ['blob:photo','data:image/png;base64,photo','illus/companions/chat-awake.webp','illus/companions/chien-wake.mp4','illus/eveil-herisson.webp'])assert.equal(avatarAsset(src,false),null);
 assert.equal(eligible({closest:s=>s==='#mv'?{}:{}}),false);
 assert.equal(eligible({closest:()=>null}),false);
 assert.equal(eligible({closest:s=>s==='#mv'?null:{}}),true);
});
test('la version suit le thème de la page, sans dépendre du thème de la page précédente',()=>{
 assert.equal(nightPalette('phone nuit','#F5E0D3'),true);assert.equal(nightPalette('phone','#2A1E26'),true);
 assert.equal(nightPalette('phone','rgb(42, 30, 38)'),true);assert.equal(nightPalette('phone','#F5E0D3'),false);
});
