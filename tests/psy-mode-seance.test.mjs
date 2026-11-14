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

test('le récap enregistre la saisie avant l’ajout à Mes petits pas, sans doublon en cas de nouvel essai', async () => {
  const personal = { id: 'personnel', t: 'Une action personnelle', f: 'soin' };
  const other = { id: 'autre', t: 'Une autre séance', f: 'psy', sessionId: 'autre' };
  const legacy = { id: 'ancien', t: 'Un pas déjà publié', f: 'soin', sessionId: 'seance', done: 1 };
  const items = [personal, other, legacy];
  const route = { tab: 'petit-pas' };
  let attempts = 0;
  let exits = 0;
  let confirm;
  const button = { disabled: false, addEventListener: (_, listener) => { confirm = listener; } };
  const scope = {
    window: {
      __PP: { items, emit() {} },
      __vaultAutosave: async () => { if (++attempts === 1) throw new Error('Coffre indisponible'); },
      __enPsyBridge: { exit() { exits++; } },
    },
    S: { get pas() { return items.filter(step => step.f === 'psy'); } },
    crypto: { randomUUID: () => 'test' },
    cur: () => route,
    esc: value => value,
  };
  const source = html.slice(html.indexOf('const sessionStepOrigins='), html.indexOf('function tPas()'));
  const { mount, view, save } = runInNewContext(source +
    '({ mount: mountSessionSteps, view: sessionSteps, save: saveSessionStepRecap })', scope);
  const session = { id: 'seance', date: '2026-11-14' };

  save(session, [
    { id: 'ancien', t: 'Un pas reformulé', origin: 'psy' },
    { id: 'nouveau', t: '  Tester une idée  ', origin: 'seule' },
    { id: 'vide', t: '  ', origin: '' },
  ], []);
  assert.equal(items.length, 3);
  assert.equal(legacy.t, 'Un pas reformulé');
  assert.equal(legacy.done, 1);
  assert.equal(legacy.f, 'soin');
  assert.match(view(session), /Un pas reformulé.*Par ma psy/);
  assert.match(view(session), /Tester une idée.*Seule/);
  assert.doesNotMatch(view(session), /Une autre séance|Une action personnelle/);
  assert.match(view(session, true), /Ajouter un petit pas/);
  assert.match(view(session, true), />Enregistrer</);

  mount({ isConnected: true, querySelector: selector => selector === 'form' ? null : button }, session, route);
  await confirm();
  assert.equal(exits, 0);
  assert.equal(button.disabled, false);
  await confirm();

  assert.equal(exits, 1);
  assert.equal(items.length, 4);
  assert.deepEqual(plain(items[0]), {
    id: 'nouveau', sessionId: 'seance', t: 'Tester une idée', origin: 'seule',
    why: '', r: '', rep: 'une fois', when: 'CETTE SEMAINE', done: 0, f: 'psy', fam: 'psy',
  });
  assert.equal(items[1], personal);
  assert.equal(items[2], other);
  assert.equal(session.pendingSteps, undefined);
  assert.match(view(session), /Un pas reformulé[\s\S]*Tester une idée/);

  save(session, [{ id: 'nouveau', t: 'Tester une idée', origin: 'seule' }], ['ancien']);
  assert.equal(items.length, 3);
  assert.doesNotMatch(view(session), /Un pas reformulé/);
});

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
  const avant = html.slice(html.indexOf('function archivedAvantTopics('), html.indexOf('function aborder()'));
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
  const avant = html.slice(html.indexOf('function archivedAvantTopics('), html.indexOf('function aborder()'));
  const render = runInNewContext(preparation + avant + ';tAvant', context);
  assert.match(render(true), /Sujet conservé/);
  assert.match(render(true), /Préparer ma séance/);
  assert.equal(session.preparation.notes[0], note);
  assert.deepEqual(plain(session.preparation.prep.stars), []);
});

test('Avant affiche seulement le message de préparation vide dans une séance terminée', () => {
  const model = {};
  const script = html.slice(html.indexOf('function archivedAvantTopics('), html.indexOf('function aborder()'));
  const context = {
    S: { notes: [], prep: { stars: new Set() } },
    activeSession: () => model.item, upcomingPsy: () => null,
  };
  runInNewContext(avantSource, context);
  const render = runInNewContext(script + ';tAvant', { ...context, window: context, esc: String });
  const pencil = /<button[^>]+data-a="prepgo"[^>]+aria-label="Modifier"[^>]*>\s*<svg/;
  assert.match(render(), pencil);
  model.item = { date: '2026-11-17', completed: true };
  for (const prep of [undefined, {writing: {mode: 'guided'}}, {gen: '  '}]) {
    model.item.preparation = { notes: [], prep };
    const archived = render(true, true);
    assert.match(archived, /Aucune préparation enregistrée pour cette séance\./);
    assert.match(archived, /data-a="avant-date"/);
    assert.doesNotMatch(archived, /data-a="(?:prepgo|avant-archive-writing)"/);
  }
  model.item.preparation = { notes: [], prep: { gen: 'Texte déjà rédigé' } };
  assert.match(render(true, true), /data-a="avant-archive-writing">Ma préparation<\/button>/);
  model.item.preparation.prep = { writing: { answers: { evenements: { choices: ['Une conversation'] } } } };
  assert.match(render(true, true), /data-a="avant-archive-writing"/);
  model.item.preparation = { notes: [{ id: '1', t: 'Sujet préparé' }] };
  assert.match(render(true, true), /Sujet préparé/);
  assert.match(render(true, true), pencil);
});

test('toucher Avant sur une fiche terminée sans préparation reste sur la fiche', () => {
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
  const topics = html.slice(html.indexOf('function archivedAvantTopics('), html.indexOf('function emptyAvantPreparation('));
  const act = runInNewContext(topics + `(a, d) => { switch(a) {${source}} }`, context);
  act('session-tab', { k: 'avant' });
  assert.equal(route.tab, 'avant');
  assert.deepEqual(calls, ['fiche']);
  item.preparation = { prep: { writing: { mode: 'guided' } } };
  act('session-tab', { k: 'avant' });
  assert.equal(calls.pop(), 'fiche');
  item.preparation.prep.gen = 'Texte déjà écrit';
  act('session-tab', { k: 'avant' });
  assert.equal(calls.pop(), 'fiche');
  item.preparation = { notes: [{ id: '1', t: 'Sujet préparé' }] };
  act('session-tab', { k: 'avant' });
  assert.equal(calls.pop(), 'rédaction');
  assert.equal(item.completed, true);
});
