import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const source=await readFile(new URL('../sw.js',import.meta.url),'utf8');
async function range(value){
 const events={};runInNewContext(source,{URL,Response,location:{origin:'https://journal.test'},self:{addEventListener(n,f){events[n]=f}},caches:{match:async()=>new Response(new Uint8Array([0,1,2,3,4,5,6,7,8,9]))}});
 let response;events.fetch({request:new Request('https://journal.test/illus/companions/chat-wake.mp4',{headers:{Range:value}}),respondWith(p){response=p}});return response;
}
test('une vidéo enregistrée se lit par portions, sans connexion',async()=>{
 const part=await range('bytes=2-5');assert.equal(part.status,206);assert.equal(part.headers.get('Content-Range'),'bytes 2-5/10');assert.deepEqual([...new Uint8Array(await part.arrayBuffer())],[2,3,4,5]);
 const suffix=await range('bytes=-3');assert.deepEqual([...new Uint8Array(await suffix.arrayBuffer())],[7,8,9]);
});
test('une portion invalide ne renvoie pas une fausse vidéo complète',async()=>{
 for(const value of ['bytes=99-','bytes=8-2','bytes=-0','bytes='])assert.equal((await range(value)).status,416);
});
