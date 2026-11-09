import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const copy = x => JSON.parse(JSON.stringify(x));
function between(start, end) {
  const a = html.indexOf(start);
  assert.ok(a >= 0, start);
  const b = html.indexOf(end, a);
  assert.ok(b > a, end);
  return html.slice(a, b);
}

function calendar(saved = [], pages = []) {
  const source = between('let uid=1;const E=[', 'let view=');
  return runInNewContext(`${source};({E, PG, MD, syncJournal})`, {
    window: {
      __enKeepArr(k, list) { list.splice(0, list.length, ...copy(saved)); },
      __DSH() { throw Error('Une date enregistrée ne doit pas être décalée'); },
      __MJ: { days: pages },
    },
  });
}

test('le calendrier conserve les rendez-vous et les récurrences après plusieurs ouvertures', () => {
  const saved = [
    { id: 1, t: 'rdv', n: 'Rendez-vous test', y: 2026, m: 10, d: 9, h: 9, mi: 30 },
    { id: 2, t: 'psy', n: 'Suivi test', y: 2026, m: 10, d: 12, h: 18, rep: 2 },
  ];
  const once = copy(calendar(saved).E);
  assert.deepEqual(once, saved);
  assert.deepEqual(copy(calendar(once).E), saved);
});

test('un calendrier vide ne contient aucun extrait ni aucune humeur inventée', () => {
  const c = calendar(); c.syncJournal();
  assert.deepEqual(copy(c.PG), {});
  assert.deepEqual(copy(c.MD), {});
});

test('le calendrier montre le vrai journal puis retire une page devenue secrète', () => {
  const pages = [{ d: '2026-11-04', v: 82, moodSet: 1, parts: [{ f: 'raconter', x: 'Texte fictif réellement écrit' }] }];
  const c = calendar([], pages); c.syncJournal();
  assert.match(c.PG['2026-10-4'][1], /Texte fictif réellement écrit/);
  assert.equal(c.PG['2026-10-4'][2], '2026-11-04');
  assert.equal(c.MD['2026-10-4'].length, 1);
  pages.length = 0; c.syncJournal();
  assert.deepEqual(copy(c.PG), {});
  assert.deepEqual(copy(c.MD), {});
});

function psy(saved) {
  const source = between('let S;\nfunction reset(mode)', 'function sessionLabel(');
  return runInNewContext(`${source};({S, snapshot:psySnapshot})`, {
    window: { __enLive(k, snapshot) { return saved; } },
  });
}

test('le suivi Psy, les choix multiples et la préparation survivent à un aller-retour JSON', () => {
  const first = psy();
  first.S.sv.why = 'Motif fictif'; first.S.sv.ry = 'chaque semaine';
  first.S.prep.start = 'Phrase de préparation fictive'; first.S.prep.stars.add('n-test');
  first.S.ap.ressens.sel.add('calme'); first.S.ap.ressens.sel.add('fière');
  first.S.ap.retiens.a = 'Phrase fictive de séance';
  first.S.msDone = true; first.S.sessionDate = '2026-11-04';
  first.S.msSubjects = [{ id: 'n-test', t: 'Un sujet fictif' }];
  const restored = psy(copy(first.snapshot()));
  assert.equal(restored.S.sv.why, 'Motif fictif');
  assert.equal(restored.S.sv.ry, 'chaque semaine');
  assert.equal(restored.S.prep.start, 'Phrase de préparation fictive');
  assert.equal(restored.S.prep.stars.has('n-test'), true);
  assert.deepEqual([...restored.S.ap.ressens.sel], ['calme', 'fière']);
  assert.equal(restored.S.ap.retiens.a, 'Phrase fictive de séance');
  assert.equal(restored.S.msDone, true);
  assert.equal(restored.S.sessionDate, '2026-11-04');
  assert.equal(restored.S.msSubjects[0].t, 'Un sujet fictif');
});

test('une ancienne sauvegarde Psy reste lisible sans les nouveaux champs', () => {
  const r = psy({ mode: 'vide', notes: [{ id: 'n1', t: 'Ancienne note fictive' }], pas: [] });
  assert.equal(r.S.notes[0].t, 'Ancienne note fictive');
  assert.equal(r.S.prep.stars.size, 0);
  assert.equal(r.S.ap.ressens.sel.size, 0);
  assert.equal(r.S.msDone, false);
});

test('sortir une page du carnet secret conserve son texte et ses médias sans doublon', () => {
  const journal = { today: '2026-11-04', days: [] };
  const restore = runInNewContext(`${between('function restoreSecretPage(page)', 'function onClick(e)')};restoreSecretPage`, {
    window: { __MJ: journal },
  });
  const page = { id: 's-test', d: '2026-11-04', t: 'Titre fictif', x: 'Texte fictif', mood: ['calme'], media: [{ k: 'voc', id: 'audio-test', s: 3 }] };
  assert.equal(restore(page), true); assert.equal(restore(page), true);
  assert.equal(journal.days.length, 1); assert.equal(journal.days[0].parts.length, 1);
  assert.equal(journal.days[0].parts[0].x, 'Titre fictif\n\nTexte fictif');
  assert.deepEqual(copy(journal.days[0].parts[0].media), page.media);
  assert.equal(journal.todayWritten, true);
  assert.equal(page.x, 'Texte fictif');
});

test('un transfert impossible laisse la page secrète intacte', () => {
  const restore = runInNewContext(`${between('function restoreSecretPage(page)', 'function onClick(e)')};restoreSecretPage`, { window: {} });
  const page = { id: 's-test', x: 'À conserver' };
  assert.equal(restore(page), false); assert.equal(page.x, 'À conserver');
});

test('réenregistrer un bilan Psy met la séance à jour sans créer un doublon', () => {
  const window = {};
  const source = between('window.__enPsySeance=(L,ap)=>', 'window.__enNextPsy=nextPsy');
  runInNewContext(source, { window, MOL: Array(12).fill('mois'), JL: Array(7).fill('jour') });
  const list = [], ap = { date: '2026-11-04', retiens: { a: 'Phrase test' }, ressens: { sel: new Set(['calme']) }, subjects: ['Sommeil'], notes: [['Sommeil', '18:20', 'Note fictive']] };
  window.__enPsySeance(list, ap); ap.retiens.a = 'Phrase corrigée'; window.__enPsySeance(list, ap);
  assert.equal(list.length, 1); assert.match(list[0].q, /Phrase corrigée/);
  assert.equal(list[0].y, 2026); assert.match(list[0].jl, /4 mois 2026/);
  assert.deepEqual(list[0].suj, ['Sommeil']); assert.equal(list[0].notes.length, 1);
});

test('un changement d’écran explicite reste possible après une animation retardée', () => {
  const source = between('Element.prototype.scrollIntoView=function(o)', '\n\n/* ---------- lancer');
  const routes = [], scrolls = [];
  class Element { closest() { return this.root || this; } }
  const root = new Element(), child = new Element(); child.root = root;
  runInNewContext(source, { Element, cur: {}, lastIn: 0, Date: { now: () => 60000 }, show: ph => routes.push(ph), SIV: { call(el) { scrolls.push(el); } } });
  child.scrollIntoView(); assert.equal(routes.length, 0);
  root.scrollIntoView(); assert.equal(routes.length, 1); assert.equal(routes[0], root);
});

test('une sauvegarde complète garde les médias chiffrés et exclut la session de connexion', async () => {
  const source = between('async function backupPayload(record)', '\n/* ---------- chiffrement');
  const records = new Map([
    ['v1', { v: 2, w: { code: {} }, box: { iv: 'iv', ct: 'texte-chiffré-fictif' } }],
    ['m:audio123', new Uint8Array([7, 8, 9]).buffer],
    ['session', { access_token: 'SESSION-FICTIVE-À-EXCLURE' }],
  ]);
  const api = runInNewContext(`${source};({backupPayload,restoreVaultRecord})`, {
    KEY: 'v1',
    b64: bytes => Buffer.from(bytes).toString('base64'),
    ub64: value => Uint8Array.from(Buffer.from(value, 'base64')),
    dbEntries: async () => [...records],
    dbGet: async k => records.get(k),
    dbWriteEntries: async entries => { for (const [k, v] of entries) records.set(k, v); },
  });
  const payload = await api.backupPayload(records.get('v1'));
  assert.equal(payload.medias.audio123, 'BwgJ');
  assert.equal(JSON.stringify(payload).includes('SESSION-FICTIVE'), false);
  assert.equal(Object.keys(payload.medias).length, 1);
  await assert.rejects(() => api.backupPayload(null));
});

test('la restauration du coffre et des vocaux garde un retour au carnet précédent', async () => {
  const source = between('async function backupPayload(record)', '\n/* ---------- chiffrement');
  const previous = { v: 2, w: { code: {} }, box: { iv: 'ancien', ct: 'ancien-chiffré' } };
  const writes = [];
  const api = runInNewContext(`${source};({restoreVaultRecord})`, {
    ENROLL: {},KEY: 'v1', ub64: value => Uint8Array.from(Buffer.from(value, 'base64')),
    dbGet: async () => previous,
    dbWriteEntries: async entries => writes.push(entries),
  });
  await api.restoreVaultRecord({ app: 'Entre nous', type: 'coffre', v: 2, w: { code: {} }, box: { iv: 'nouveau', ct: 'nouveau-chiffré' }, medias: { audio123: 'BwgJ' } });
  assert.equal(writes.length, 1, 'une seule transaction pour tout restaurer');
  assert.deepEqual(copy(writes[0].map(x => x[0])), ['m:audio123', 'v1', 'restore-previous']);
  assert.deepEqual([...new Uint8Array(writes[0][0][1])], [7, 8, 9]);
  assert.equal(writes[0][2][1], previous);
});

test('un fichier invalide ne remplace pas le coffre actuel', async () => {
  const source = between('async function backupPayload(record)', '\n/* ---------- chiffrement');
  let writes = 0;
  const api = runInNewContext(`${source};({restoreVaultRecord})`, {
    KEY: 'v1', dbGet: async () => ({}), dbWriteEntries: async () => { writes++; },
  });
  await assert.rejects(() => api.restoreVaultRecord({ app: 'Autre application' }));
  await assert.rejects(() => api.restoreVaultRecord({ app: 'Entre nous', type: 'coffre', v: 2, box: { iv: 'x', ct: 'y' } }));
  assert.equal(writes, 0);
});

test('les thèmes personnalisés sont enregistrés et restaurés avec leurs identifiants', () => {
  const source = between('const TH=window.__MJTH=', 'const D=window.__MJ=');
  const stored = [{ id: 'theme-test', n: 'Mon thème fictif' }];
  let snapshot;
  const window = { __enLive(k, fn) { assert.equal(k, 'mjthemes'); snapshot = fn; return stored; } };
  runInNewContext(source, { window });
  assert.deepEqual(copy(window.__MJTH), stored);
  window.__MJTH.push({ id: 'autre-test', n: 'Autre thème' });
  assert.equal(copy(snapshot())[1].id, 'autre-test');
});

test('Après reste accessible après une vraie fin de séance dans un carnet vide', () => {
  const source = between('function tApres()', 'function allNotes()');
  const render = runInNewContext(`${source};tApres`, {
    S: { mode: 'vide', msDone: true, ap: { parts: {} }, ph: {} }, SEANCES: [],
    pasD: () => true, allNotes: () => [], sessionLabel: () => '4 NOVEMBRE', fold: () => '', esc: x => x,
  });
  assert.match(render(), /Par parties/);
  assert.match(render(), /En vrac/);
  assert.doesNotMatch(render(), /Après ta séance, tu pourras/);
});

test('une séance avec seulement Ce que je retiens reste lisible dans l’historique', () => {
  const source = between('function vSeance(o)', '/* ---------- ÉVOLUTION ---------- */');
  const session = { id: 's-test', emo: [], star: '', jl: 'mercredi 4 novembre 2026', q: 'Phrase fictive', prev: [], notes: [], apres: { parler: '', retiens: 'Ce que je retiens fictif' } };
  const render = runInNewContext(`${source};vSeance`, {
    S: { seTab: 'apres' }, SEANCES: [session], seList: () => [session], perle: () => '', esc: String,
    partsRows: (done, s) => 'CARTE CONSERVÉE : '+s.apres.retiens,
  });
  assert.match(render({ i: 's-test' }), /CARTE CONSERVÉE : Ce que je retiens fictif/);
  assert.doesNotMatch(render({ i: 's-test' }), /Rien n'a été écrit/);
});
