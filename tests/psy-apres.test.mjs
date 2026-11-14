import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../psy-apres.js', import.meta.url), 'utf8');
const model = () => {
  const context = { crypto: webcrypto, __enKeep: (key, state) => state };
  const api = 'globalThis.__enPsyAfter = {';
  vm.runInNewContext(source.replace(api,
    'globalThis.model = { calendarOccurrences, migrate, syncCalendar, modeContext, updateHistory }; ' + api),
  context);
  return { ...context.model, after: context.__enPsyAfter };
};
const plain = value => JSON.parse(JSON.stringify(value));

test('Après reprend les occurrences passées du calendrier, sans doublons ni rendez-vous futurs', () => {
  const { calendarOccurrences, syncCalendar } = model();
  const now = new Date(2026, 10, 11, 14);
  const calendar = [
    { id: 1, t: 'psy', y: 2026, m: 9, d: 28, h: 16, rep: 1 },
    { id: 2, t: 'psy', y: 2026, m: 10, d: 11, h: 18 },
    { id: 3, t: 'rdv', y: 2026, m: 10, d: 4 },
  ];
  assert.deepEqual(plain(calendarOccurrences(calendar, now)).map(item => item.date), ['2026-10-28', '2026-11-04']);
  const state = { sessions: [] };
  assert.equal(syncCalendar(state, calendar, now), true);
  assert.equal(syncCalendar(state, calendar, now), false);
  state.sessions[0].free = 'Mes mots';
  syncCalendar(state, [], now);
  assert.equal(state.sessions.length, 1);
  assert.equal(state.sessions[0].free, 'Mes mots');
});

test('le retour d’une ancienne séance conserve notes, sujets cochés, texte et repères', () => {
  const { migrate, syncCalendar, updateHistory } = model();
  const state = { sessions: [] };
  const history = [{ id: 'ancienne', jl: 'lundi 9 novembre 2026', prev: ['Sujet préparé'], suj: ['Sujet préparé'],
    notes: [['NOTE', '18:14', 'Une note']], apres: { parler: 'Un sujet' } }];
  const legacy = { msDone: true, sessionDate: '2026-11-05', msNotes: { x: [['12:00', 'Une autre note']] },
    msSubjects: [{ id: 'x', t: 'Un autre sujet' }], msCk: { x: true },
    ap: { vrac: 'Écriture libre', ressens: { sel: ['pensive'] }, pasAdded: [{ t: 'Une piste' }] } };
  assert.equal(migrate(state, history, legacy), true);
  assert.equal(migrate(state, history, legacy), false);
  syncCalendar(state, [{ id: 4, t: 'psy', y: 2026, m: 10, d: 9 }], new Date(2026, 10, 11));
  assert.equal(state.sessions.length, 2);
  const [old, draft] = state.sessions;
  assert.equal(old.completed, true);
  assert.equal(old.calendarKey, 'cal:4');
  assert.equal(draft.free, 'Écriture libre');
  assert.deepEqual(plain(draft.rubrics.apres.choices), ['pensive']);
  assert.deepEqual(plain(draft.topics), [{ text: 'Un autre sujet', checked: true }]);
  assert.equal(draft.notes[0].text, 'Une autre note');
  updateHistory(history, draft);
  updateHistory(history, draft);
  assert.equal(history.length, 2);
  assert.equal(history[0].afterId, draft.id);
});

test('les ressources d’Après se chargent au démarrage, à la publication et hors ligne', () => {
  for (const file of ['index.html', 'scripts/build.mjs', 'sw.js']) {
    const content = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
    assert.match(content, /psy-apres-ecriture\.js/);
    assert.match(content, /psy-apres\.js/);
    assert.match(content, /psy-apres\.css/);
  }
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.indexOf('src="psy-apres-ecriture.js"') < html.indexOf('src="psy-apres.js"'));
});

test('un retour validé peut retrouver les éléments conservés dans l’historique', () => {
  const { migrate } = model();
  const state = { sessions: [] };
  const history = [{
    id: 'apres-seance-test', afterId: 'seance-test', date: '2026-11-11', q: 'Mon titre',
    prev: ['Sujet préparé'], suj: ['Premier sujet', 'Autre sujet'],
    apres: { parler: 'Premier sujet\nAutre sujet' },
  }];
  assert.equal(migrate(state, history, {}), true);
  const [session] = state.sessions;
  assert.equal(session.id, 'seance-test');
  assert.equal(session.title, 'Mon titre');
  assert.equal(session.completed, true);
  assert.deepEqual(plain(session.topics), [{ text: 'Sujet préparé', checked: false }]);
  assert.deepEqual(plain(session.rubrics.aborde.paragraphs), ['Premier sujet', 'Autre sujet']);
});


test('Pendant remplace et efface les anciennes notes sans dupliquer la note en cours', () => {
  const { after } = model();
  const history = [{
    id: 'ancienne', date: '2026-11-09', q: 'Séance passée',
    prev: ['Mon sujet'], suj: ['Mon sujet'],
    notes: [['NOTE', '14:00', 'Première note'], ['NOTE', '14:01', 'À effacer'], ['NOTE', '14:02', 'Dernière note']],
  }];
  const [session] = after.prepare({}, history, []);
  const draft = {
    note: 'Dernière note réécrite',
    noteHtml: '<strong>Dernière note réécrite</strong>',
    replacesLegacyNote: 'Dernière note',
    noteEdits: { 0: { text: 'Première note réécrite', html: '' }, 1: { text: '', html: '' } },
  };
  const mode = {
    sessionDate: session.date, msSubjects: [{ id: 'topic', t: 'Mon sujet' }], msCk: {},
    msNotes: { me: [['14:03', draft.note]] },
  };

  after.recordMode({}, mode, history, [], session.id, draft);

  assert.deepEqual(plain(session.notes).map(note => note.text), ['Première note réécrite', 'Dernière note réécrite']);
  assert.equal(session.notes[1].html, draft.noteHtml);
  assert.equal(session.topics[0].checked, false);
  assert.equal(session.completed, true);
  assert.equal(session.finishedModeDraft.noteEdits, undefined);
  assert.deepEqual(plain(history[0].notes).map(note => note[2]), ['Première note réécrite', 'Dernière note réécrite']);
});

test('Pendant renomme un sujet coché dans une séance existante sans garder l’ancien intitulé', () => {
  const { after } = model();
  const history = [{
    id: 'ancienne', date: '2026-11-09', q: 'Séance passée',
    prev: ['Mon sujet', 'Sujet inchangé'],
    suj: ['Mon sujet'],
  }];
  const [session] = after.prepare({}, history, []);
  const draft = {
    subjects: [{ id: 'a', t: 'Mon sujet', editedTitle: 'Mon sujet reformulé' }, { id: 'b', t: 'Sujet inchangé' }],
    checked: ['a'],
    note: '',
  };
  const mode = {
    sessionDate: session.date,
    msSubjects: [{ id: 'a', t: 'Mon sujet reformulé' }, { id: 'b', t: 'Sujet inchangé' }],
    msCk: { a: true },
  };

  after.recordMode({}, mode, history, [], session.id, draft);

  assert.deepEqual(plain(session.topics), [
    { text: 'Mon sujet reformulé', checked: true },
    { text: 'Sujet inchangé', checked: false },
  ]);
  assert.deepEqual(plain(session.finishedModeDraft.subjects), mode.msSubjects);
  assert.deepEqual(plain(history[0].prev), ['Mon sujet reformulé', 'Sujet inchangé']);
});

test('Pendant conserve la mise en forme d’un sujet entre deux confirmations', () => {
  const { after } = model();
  const history = [{ id: 'ancienne', date: '2026-11-09', prev: ['Mon sujet'] }];
  const [session] = after.prepare({}, history, []);
  const html = '<strong>Mon sujet</strong>';
  const draft = { subjects: [{ id: 'a', t: 'Mon sujet', html }], checked: ['a'], note: '' };
  const mode = { sessionDate: session.date, msSubjects: draft.subjects, msCk: { a: true } };

  after.recordMode({}, mode, history, [], session.id, draft);

  assert.deepEqual(plain(session.topics), [{ text: 'Mon sujet', checked: true, html }]);
  assert.deepEqual(plain(session.finishedModeDraft.subjects), mode.msSubjects);
  assert.deepEqual(plain(history[0].prev), ['Mon sujet']);

  const reopened = { ...draft, subjects: [{ id: 'a', t: 'Mon sujet' }] };
  after.recordMode({}, { ...mode, msSubjects: reopened.subjects }, history, [], session.id, reopened);

  assert.deepEqual(plain(session.topics), [{ text: 'Mon sujet', checked: true }]);
  assert.deepEqual(plain(session.finishedModeDraft.subjects), reopened.subjects);
});
