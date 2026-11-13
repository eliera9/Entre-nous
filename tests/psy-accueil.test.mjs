import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const clone = value => JSON.parse(JSON.stringify(value));

function app(initial = { version: 1, sessions: [], migrated: true }) {
  const state = clone(initial);
  const context = vm.createContext({ crypto: webcrypto, __enKeep: () => state });
  for (const path of ['psy-apres.js', 'psy-accueil.js']) vm.runInContext(source(path), context);
  return { state, returns: context.__enPsyAfter, home: context.__enPsyHome };
}

test('l’Éphéméride montre le prochain rendez-vous et les séances à poursuivre, sans les séances archivées', () => {
  const { home } = app();
  const sessions = [
    { id: 'old', date: '2026-11-01', completed: true },
    { id: 'draft', date: '2026-11-04', modeDraft: { note: 'En cours' } },
    { id: 'return', date: '2026-11-03', fromMode: true },
    { id: 'next', date: '2026-11-22' },
    { id: 'later', date: '2026-11-23' },
  ];
  const next = { session: sessions[3], date: sessions[3].date, time: '10:00' };
  const cards = home.cardsFor(sessions, next, '2026-11-12', '09:30');
  assert.deepEqual(clone(cards.map(({ id, kind }) => [id, kind])), [
    ['next', 'upcoming'], ['draft', 'current'], ['return', 'return'],
  ]);
});

test('la carte compacte avec la date du jour apparaît quand aucune séance n’est prévue ou à poursuivre', () => {
  const { home } = app();
  const carousel = { addEventListener() {} };
  const root = { querySelector: () => carousel };
  home.mount(root, [], {});
  assert.match(carousel.innerHTML, /Aujourd’hui/);
  assert.match(carousel.innerHTML, /title-card-empty/);
  assert.match(carousel.innerHTML, /Pas de séance prévue/);
  assert.match(carousel.innerHTML, /Ajouter un rendez-vous/);
  assert.match(carousel.innerHTML, /data-a="enaddpsy"/);

  const upcoming = { id: 'next', kind: 'upcoming', date: '2026-11-19', calendarTime: '10:00' };
  home.mount(root, [upcoming], {});
  assert.match(carousel.innerHTML, /Prochain rendez-vous/);
  assert.match(carousel.innerHTML, /10 h 00/);
  assert.doesNotMatch(carousel.innerHTML, /Aucune séance à poursuivre|Pas de séance prévue|title-card-empty/);
  assert.match(carousel.innerHTML, /data-k="prep"/);

  home.mount(root, [upcoming, { id: 'draft', kind: 'current', date: '2026-11-11' }], {});
  assert.doesNotMatch(carousel.innerHTML, /Aucune séance à poursuivre|Pas de séance prévue|title-card-empty/);
});

test('seul du texte dans Mes notes fait apparaître une séance en cours', () => {
  const { home, returns } = app();
  returns.prepare({}, [], []);
  const session = returns.createModeSession('2026-11-11');
  session.modeDraft = { note: ' \n ', notesOpen: true,
    subjects: [{ id: 'topic', t: 'Sujet préparé' }], checked: ['topic'] };
  const cards = () => home.cardsFor([session], null, '2026-11-13', '10:58');
  assert.equal(home.hasModeNotes(session), false);
  assert.equal(cards().length, 0);

  session.modeDraft.note = '  Quelques mots  ';
  assert.equal(home.hasModeNotes(session), true);
  assert.equal(cards()[0].kind, 'current');

  session.modeDraft.note = '';
  session.free = 'Retour déjà commencé';
  assert.equal(cards()[0].kind, 'return');
});

test('un brouillon vide conserve le prochain rendez-vous et le retour d’un rendez-vous passé', () => {
  const { home } = app();
  const upcoming = { id: 'upcoming', date: '2026-11-13', calendarKey: 'cal:1', calendarTime: '11:00', modeDraft: { note: '' } };
  const past = { id: 'past', date: '2026-11-13', calendarKey: 'cal:2', calendarTime: '08:00', modeDraft: { note: '' } };
  const next = { session: upcoming, date: upcoming.date, time: upcoming.calendarTime };
  const cards = home.cardsFor([upcoming, past], next, '2026-11-13', '10:58');
  assert.deepEqual(clone(cards.map(({ id, kind }) => [id, kind])), [['upcoming', 'upcoming'], ['past', 'return']]);
});

test('l’historique regroupe les séances sous le mois abrégé et conserve leurs accès', () => {
  const { home } = app();
  const records = [
    { id: 'archive-15', date: '2026-10-15', title: 'Deuxième ligne' },
    { id: 'archive-29', date: '2026-10-29', title: 'Première ligne' },
  ];
  const html = home.render({ records, items: [] });
  assert.equal((html.match(/<h4>Oct\. 2026<\/h4>/g) || []).length, 1);
  assert.match(html, /<h4>Oct\. 2026<\/h4>\s*<div class="history-month-rows">/);
  assert.match(html, /data-a="session-archive" data-i="archive-29"[\s\S]*data-a="session-archive" data-i="archive-15"/);
  assert.match(html, /data-a="psy-page" data-k="seances"/);
});

test('un rendez-vous déplacé conserve sa fiche et sa préparation', () => {
  const { returns } = app();
  const event = { id: 1, t: 'psy', y: 2099, m: 10, d: 19, h: 10, mi: 0 };
  returns.prepare({}, [], [event]);
  const session = returns.appointment({ e: event, dt: new Date(2099, 10, 19) }, true);
  session.preparation = { notes: [{ t: 'Préparation à conserver' }] };
  event.d = 21;
  event.h = 11;
  returns.prepare({}, [], [event]);
  assert.equal(returns.appointment({ e: event, dt: new Date(2099, 10, 21) }).id, session.id);
  assert.equal(session.date, '2099-11-21');
  assert.equal(session.calendarTime, '11:00');
  assert.equal(session.preparation.notes[0].t, 'Préparation à conserver');
});

test('deux séances le même jour conservent chacune leurs notes et leur identifiant après réouverture', () => {
  const date = '2020-11-04';
  const calendar = [10, 15].map(h => ({ id: h, t: 'psy', y: 2020, m: 10, d: 4, h, mi: 0 }));
  const { state, returns } = app();
  const [morning, afternoon] = returns.prepare({}, [], calendar);
  const draft = { date, note: 'Note du matin', subjects: [{ id: 'm', t: 'Sujet du matin' }], checked: ['m'] };
  morning.modeDraft = draft;
  afternoon.modeDraft = { date, note: 'Note de l’après-midi' };
  const restored = app(state);
  const [left, right] = restored.returns.prepare({}, [], calendar);
  assert.equal(left.id, morning.id);
  assert.equal(right.id, afternoon.id);
  delete left.modeDraft;
  restored.returns.recordMode({}, { sessionDate: date, msNotes: { me: [['10:17', draft.note]] },
    msSubjects: draft.subjects, msCk: { m: true } }, [], calendar, left.id, draft);
  assert.equal(left.notes[0].text, 'Note du matin');
  assert.equal(left.fromMode, true);
  assert.equal(right.modeDraft.note, 'Note de l’après-midi');
  assert.equal(right.notes.length, 0);
});

test('un ancien brouillon sans identifiant reste séparé si deux rendez-vous partagent sa date', () => {
  const { returns, state } = app();
  const events = [10, 15].map(h => ({ id: h, t: 'psy', y: 2020, m: 10, d: 4, h }));
  returns.prepare({}, [], events);
  const legacy = returns.migrateModeDraft({ date: '2020-11-04', note: 'Brouillon existant', subjects: [], checked: [] });
  assert.equal(state.sessions.length, 3);
  assert.equal(legacy.modeDraft.note, 'Brouillon existant');
  assert.equal(state.sessions.filter(item => item.modeDraft).length, 1);
});
