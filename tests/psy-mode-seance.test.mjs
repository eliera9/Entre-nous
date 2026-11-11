import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const script = await readFile(new URL('../psy-mode-seance.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const context = {};
runInNewContext(script, context);
const { newDraft } = context.__enPsyModeSession;
const plain = value => JSON.parse(JSON.stringify(value));

test('le Mode séance ouvre un carnet neuf avec une liste vide et les notes repliées', () => {
  assert.deepEqual(plain(newDraft([], new Set(), null, [])), {
    subjects: [], checked: [], note: '', notesOpen: false,
  });
});

test('seules les réponses choisies et les sujets préparés passent en Mode séance', () => {
  const notes = [{ id: '1', t: 'Premier sujet' }, { id: '2', t: 'Mon sujet prioritaire' }];
  const first = { questions: {
    topics: { entries: [{ id: 'a', answer: 'Sujet choisi' }, { id: 'b', answer: 'Sujet non choisi' }], selected: ['a'] },
    pratique: { free: 'Question écrite' },
    confort: { free: 'Une préférence de cadre' },
  } };
  const draft = newDraft(notes, new Set(['2']), first, [{ id: 'question:a', t: 'question écrite' }]);
  assert.deepEqual(plain(draft.subjects).map(subject => subject.t), [
    'Mon sujet prioritaire', 'Premier sujet', 'Sujet choisi', 'Question écrite',
  ]);
  assert.equal(draft.checked.length, 0);
});

test('Avant et Mes dépôts n’ajoutent aucune entrée d’exemple au carnet', () => {
  const avant = html.slice(html.indexOf('function tAvant()'), html.indexOf('function aborder()'));
  const render = runInNewContext(avant + ';tAvant', {
    S: { mode: 'first', notes: [] }, window: { __enPsyEph: () => '' }, aborder: () => '',
  });
  assert.match(render(), /Rien à aborder/);
  assert.doesNotMatch(render(), /DEPUIS TA DERNIÈRE SÉANCE|Thomas/);

  const start = html.indexOf('function render(){const all=[...(window.__deposes');
  const end = html.indexOf('\nlet ALL=', start);
  const list = {};
  const deposits = runInNewContext(html.slice(start, end) + ';render', { window: { __deposes: [] }, list });
  assert.deepEqual(plain(deposits()), []);
  assert.match(list.innerHTML, /Rien de déposé/);
});
