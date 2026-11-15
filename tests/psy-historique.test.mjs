import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source('psy-historique.js'), context);
const history = context.__enPsyHistory;
const records = [
  { id: 'older', date: '2025-09-03', q: 'Mon rythme', suj: ['Travail', 'Santé'] },
  { id: 'recent', date: '2026-10-16', q: 'Mettre des mots', suj: ['Ma sœur', 'le deuil'], recapPhrases: ['Un repère retrouvé'] },
  { id: 'previous', date: '2026-09-08', q: 'Prendre du recul', prev: ['Dire non', 'Intimité'] },
  { id: 'no-date', q: 'Première séance' },
];
const storedSubjects = {
  'session:older': ['Travail', 'Santé'],
  'session:recent': ['Famille', 'Deuil et pertes'],
  'session:previous': ['Limites personnelles', 'Intimité'],
};
const entries = history.prepare(records, record => record.date, storedSubjects);
const ids = rows => Array.from(rows, row => row.record.id);
const selection = values => ({ query: '', periods: [], subjects: [], ...values });

test('les archives sont triées par date et les séances sans date restent accessibles', () => {
  assert.deepEqual(ids(entries), ['recent', 'previous', 'older', 'no-date']);
  assert.deepEqual(Array.from(history.periodChoices(entries), entry => entry[0]), ['2026-10', '2026-09', '2026', '2025-09', '2025']);
});
test('une recherche trouve la phrase du récap et les thèmes saisis, même avec des accents différents', () => {
  assert.deepEqual(ids(history.filtered(entries, selection({ query: 'repere retrouve' }), [])), ['recent']);
  assert.deepEqual(ids(history.filtered(entries, selection({ query: 'soeur' }), [])), ['recent']);
  assert.deepEqual(ids(history.filtered(entries, selection({ query: 'intimite' }), [])), ['previous']);
});
test('les périodes et sujets sont cumulables et se combinent avec la recherche', () => {
  const state = selection({ periods: ['2026-09', '2026-10'], subjects: ['Famille', 'Limites personnelles'] });
  assert.deepEqual(ids(history.filtered(entries, state, [])), ['recent', 'previous']);
  assert.deepEqual(ids(history.filtered(entries, { ...state, query: 'soeur' }, [])), ['recent']);
  assert.deepEqual(ids(history.filtered(entries, selection({ periods: ['2025'], subjects: ['Santé'] }), [])), ['older']);
});
test('les favoris ignorent les filtres actifs sans les effacer', () => {
  const state = selection({ query: 'recul', periods: ['2026'], subjects: ['Intimité'] });
  assert.deepEqual(ids(history.filtered(entries, { ...state, favoritesOnly: true }, ['older', 'recent'])), ['recent', 'older']);
  assert.deepEqual(ids(history.filtered(entries, state, ['older', 'recent'])), ['previous']);
});
test('le parcours Tout voir charge l’historique et ses ressources restent disponibles hors ligne', () => {
  assert.match(source('psy-accueil.js'), /data-a="psy-page" data-k="seances"/);
  const index = source('index.html');
  assert.match(index, /seances:\['Mes séances',tSeances\]/);
  assert.match(index, /__enPsyHistory\.mount\(ph,history,/);
  for (const file of ['psy-historique.js', 'psy-historique.css']) {
    assert.ok(index.includes(file));
    assert.ok(source('sw.js').includes(file));
    assert.ok(source('scripts/build.mjs').includes(file));
  }
});

test('les notes anciennes restent consultables et recherchables sans devenir des sujets principaux', () => {
  const old = { id: 'legacy', date: '2025-09-03', q: 'Séance', suj: ['Une note détaillée sur ma famille.'] };
  const [entry] = history.prepare([old], record => record.date);
  assert.deepEqual(Array.from(entry.subjects), []);
  assert.deepEqual(ids(history.filtered([entry], selection({ subjects: ['Famille'] }), [])), []);
  assert.deepEqual(ids(history.filtered([entry], selection({ query: 'note détaillée' }), [])), ['legacy']);
});
test('les sujets s’enregistrent par séance dans le coffre et une erreur permet de réessayer', async () => {
  const store = { favorites: ['recent'] };
  const env = vm.createContext({ __enKeep: () => store, __vaultAutosave: async () => {} });
  vm.runInContext(source('psy-historique.js'), env);
  const api = env.__enPsyHistory;
  await api.saveSubjects('recent', ['Intimité', 'Famille', 'Intimité', 'Texte libre']);
  assert.deepEqual(Array.from(store.subjectsBySession['session:recent']), ['Famille', 'Intimité']);
  assert.deepEqual(store.favorites, ['recent']);
  env.__vaultAutosave = async () => { throw new Error('coffre indisponible'); };
  await assert.rejects(api.saveSubjects('recent', ['Émotions']));
  assert.deepEqual(Array.from(store.subjectsBySession['session:recent']), ['Famille', 'Intimité']);
  env.__vaultAutosave = async () => {};
  await api.saveSubjects('recent', []);
  assert.deepEqual(Array.from(store.subjectsBySession['session:recent']), []);
});
