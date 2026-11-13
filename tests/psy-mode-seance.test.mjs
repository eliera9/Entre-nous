import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const script = await readFile(new URL('../psy-mode-seance.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const avantSource = await readFile(new URL('../psy-avant.js', import.meta.url), 'utf8');
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
  const avant = html.slice(html.indexOf('function avantPreparationLine('), html.indexOf('function aborder()'));
  const render = runInNewContext(avant + ';tAvant', {
    S: { mode: 'first', notes: [], prep: { stars: new Set() } },
    activeSession: () => null, upcomingPsy: () => null,
    window: { __enPsyAvant: { dateLine: () => '', editButton: () => '' } },
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

test('Avant ouvre une séance déjà enregistrée avec des sujets et sans objet de rédaction', () => {
  const note = { id: '1', t: 'Sujet conservé', o: 'NOTE' };
  const session = { date: '2026-11-17', preparation: { notes: [note] } };
  const context = {
    S: {},
    activeSession: () => session,
    esc: String,
    newPrep: () => ({ stars: new Set() }),
    Set,
  };
  runInNewContext(avantSource, context);
  context.window = context;
  const preparation = html.slice(html.indexOf('function ensurePreparationStars('), html.indexOf('function psySessions('));
  const avant = html.slice(html.indexOf('function avantPreparationLine('), html.indexOf('function sessionTextList('));
  const render = runInNewContext(preparation + avant + ';tAvant', context);
  assert.match(render(true), /Sujet conservé/);
  assert.match(render(true), /Préparer ma séance/);
  assert.equal(session.preparation.notes[0], note);
  assert.deepEqual(plain(session.preparation.prep.stars), []);
});

test('la rédaction d’Avant reste accessible dans une séance archivée sans texte', () => {
  const model = {};
  const script = html.slice(html.indexOf('function avantPreparationLine('), html.indexOf('function sessionTextList('));
  const context = {
    S: { notes: [], prep: { stars: new Set() } },
    activeSession: () => model.item, upcomingPsy: () => null,
  };
  runInNewContext(avantSource, context);
  const render = runInNewContext(script + ';tAvant', { ...context, window: context, esc: String });
  const pencil = /<button[^>]+data-a="prepgo"[^>]+aria-label="Modifier"[^>]*>\s*<svg/;
  assert.match(render(), pencil);
  model.item = { date: '2026-11-17', completed: true };
  const archived = render(true, true);
  assert.match(archived, pencil);
  assert.match(archived, /data-a="avant-date"/);
  assert.match(archived, /data-a="prepgo">Préparer ma séance<\/button>/);
  model.item.preparation = { notes: [], prep: { gen: 'Texte déjà rédigé' } };
  assert.match(render(true, true), /data-a="avant-archive-writing">Ma préparation<\/button>/);
});

test('toucher Avant ouvre directement la rédaction vide de la fiche confirmée', () => {
  const route = { v: 'archive', tab: 'apres' };
  const item = { completed: true };
  const calls = [];
  const context = {
    S: { ap: {} },
    cur: () => route,
    activeSession: () => item,
    openAvantWriting: () => calls.push('rédaction'),
    render: () => calls.push('fiche'),
    B: { querySelector: () => null },
  };
  runInNewContext(avantSource, context);
  context.window = context;
  const source = html.slice(html.indexOf(" case'session-tab':"), html.indexOf(" case'calrdv':"));
  const act = runInNewContext(`(a, d) => { switch(a) {${source}} }`, context);
  act('session-tab', { k: 'avant' });
  assert.equal(route.tab, 'avant');
  assert.deepEqual(calls, ['rédaction']);
  item.preparation = { prep: { writing: { mode: 'guided' } } };
  act('session-tab', { k: 'avant' });
  assert.equal(calls.pop(), 'rédaction');
  item.preparation.prep.gen = 'Texte déjà écrit';
  act('session-tab', { k: 'avant' });
  assert.equal(calls.pop(), 'fiche');
  assert.equal(item.completed, true);
});
