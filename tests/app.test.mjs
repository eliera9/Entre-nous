import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { Script, runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import { setImmediate } from 'node:timers/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('tous les scripts de l’application se compilent', () => {
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 50);
  scripts.forEach((m, i) => new Script(m[1], { filename: `inline-${i}.js` }));
});

test('les illustrations, polices et icônes référencées existent', async () => {
  const refs = new Set([...html.matchAll(/(?:src=["']|url\(["']?)([^"')\s<>]+)/g)]
    .map(m => m[1]).filter(x => /^(fonts|illus|icons)\//.test(x) && /\.(?:webp|jpe?g|png|woff2)$/.test(x) && !/[${}]/.test(x)));
  for (const path of refs) await access(new URL(`../${path}`, import.meta.url));
});

const start = html.indexOf('const b64=');
const end = html.indexOf('/* ---------- coffre v2', start);
const core = html.slice(start, end);
function cryptoAPI() {
  return runInNewContext(`const enc=new TextEncoder(),dec=new TextDecoder(),ITER=310000;${core};({b64,ub64,seal,open,deriveKey})`, {
    TextEncoder, TextDecoder, Uint8Array, btoa, atob, crypto: webcrypto,
  });
}

test('un journal de plusieurs Mo se chiffre et se relit sans débordement', async () => {
  const { b64, ub64, seal, open } = cryptoAPI();
  const raw = webcrypto.getRandomValues(new Uint8Array(60000));
  assert.deepEqual(Array.from(ub64(b64(raw))), Array.from(raw));
  const key = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  const journal = { texte: 'Écrire sans perdre mes mots. 🌸\n'.repeat(50000) };
  const box = await seal(key, journal);
  const result = await open(key, box);
  assert.equal(result.texte, journal.texte);
  assert.equal(JSON.stringify(box).includes('Écrire'), false);
});

test('un mauvais code et un coffre altéré ne se déchiffrent pas', async () => {
  const { deriveKey, seal, open, b64, ub64 } = cryptoAPI();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey('6048', salt);
  const box = await seal(key, { texte: 'Donnée fictive de test' });
  const wrong = await deriveKey('6049', salt);
  await assert.rejects(() => open(wrong, box));
  const corrupted = ub64(box.ct); corrupted[0] ^= 1;
  await assert.rejects(() => open(key, { ...box, ct: b64(corrupted) }));
});

test('les sauvegardes concurrentes se rangent dans l’ordre et reprennent après un échec', async () => {
  const saveCode = html.slice(html.indexOf('function save(force){'), html.indexOf('setInterval(()=>{if(DEK)save()}'));
  const writes = [];
  let current = 'premier', failNext = false;
  const save = runInNewContext(`let ENROLL={active:false},DEK={},W={code:{}},META={},M={ls:{}},last='',dirty=true,saving=null;
    ${saveCode};save`, {
    snapshot: () => ({ texte: current }),
    seal: async (key, data) => { await new Promise(r => setTimeout(r, 5)); return { texte: data.st.texte }; },
    dbPut: async (key, rec) => { if (failNext) { failNext = false; throw Error('disque plein'); } writes.push(rec.box.texte); },
    KEY: 'v1', CLOUD: { push() {} },
    document: { createElement: () => ({ setAttribute() {}, remove() {} }), body: { appendChild() {} } },
    setTimeout: () => 0,
  });
  const first = save(true);
  await new Promise(r => setTimeout(r, 1));
  current = 'deuxième'; const second = save(true);
  await Promise.all([first, second]);
  assert.deepEqual(writes, ['premier', 'deuxième']);
  failNext = true; await assert.rejects(() => save(true));
  current = 'récupéré'; await save(true);
  assert.equal(writes.at(-1), 'récupéré');
});

test('une sauvegarde au démarrage conserve les retours avant l’ouverture d’Après', async () => {
  const savedAfter = {
    sessions: [{ id: 'seance-test', free: 'Retour fictif', freeHtml: '<b>Retour fictif</b>' }],
    deletedCalendarKeys: ['cal:7'],
  };
  const register = html.match(/window\.__enKeep=\(k,o\)=>\{[^\n]+\};/)[0];
  const snapshotCode = html.slice(html.indexOf('function snapshot(){'), html.indexOf('setInterval(()=>{if(DEK)save()}'));
  let onDisk;
  const app = runInNewContext(`
    const M={ls:{},st:{'psy-after-v1':savedAfter}},LIVE={},ENROLL={active:false},W={code:{}},DEK={},META={};
    let dirty=false,saving=null;
    const REEL=()=>true;
    const window={};
    ${register}
    ${snapshotCode}
    window.__enKeep('rg', { prenom: 'Test' });
    ({save, keep: window.__enKeep})
  `, {
    savedAfter,
    seal: async (_, data) => JSON.stringify(data),
    dbPut: async (_, record) => { onDisk = JSON.parse(record.box); },
    KEY: 'v1', CLOUD: { push() {} },
  });
  await app.save();
  assert.deepEqual(onDisk.st['psy-after-v1'], savedAfter);
  const after = app.keep('psy-after-v1', { sessions: [] });
  assert.equal(after.sessions[0].free, 'Retour fictif');
  after.sessions[0].free = 'Retour complété';
  await app.save();
  assert.equal(onDisk.st['psy-after-v1'].sessions[0].free, 'Retour complété');
});

test('la sauvegarde automatique démarre à la saisie et attend les changements en cours', async () => {
  const code = html.slice(html.indexOf('let autosavePending='), html.indexOf('window.__enEnrollmentState='));
  const writes = [];
  const releases = [];
  let value = 'Une ligne';
  const autosave = runInNewContext(`const window={};${code};window.__vaultAutosave`, {
    save() {
      writes.push(value);
      return new Promise((resolve, reject) => releases.push({ resolve, reject }));
    },
  });
  const first = autosave();
  assert.deepEqual(writes, ['Une ligne']);
  value = 'Deux lignes';
  assert.equal(autosave(), first);
  value = 'Dernière ligne';
  assert.equal(autosave(), first);
  releases[0].resolve();
  await setImmediate();
  assert.deepEqual(writes, ['Une ligne', 'Dernière ligne']);
  releases[1].reject(new Error('Disque indisponible'));
  await assert.rejects(first, /Disque indisponible/);
  const retry = autosave();
  releases[2].resolve();
  await retry;
  assert.deepEqual(writes, ['Une ligne', 'Dernière ligne', 'Dernière ligne']);
});

test('le cache hors ligne ne supprime pas les caches des autres applications', async () => {
  const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  assert.match(sw, /startsWith\('entre-nous-'\)/);
  new Script(sw);
});
