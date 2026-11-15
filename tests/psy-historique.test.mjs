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
const entries = history.prepare(records, record => record.date);
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
