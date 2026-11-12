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

test('l’absence de séance à poursuivre est visible avec et sans prochain rendez-vous', () => {
  const { home } = app();
  const carousel = { addEventListener() {} };
  const root = { querySelector: () => carousel };
  home.mount(root, [], {});
  assert.match(carousel.innerHTML, /Aujourd’hui/);
  assert.match(carousel.innerHTML, /Aucune séance à poursuivre/);
  assert.match(carousel.innerHTML, /data-a="enaddpsy"/);

  const upcoming = { id: 'next', kind: 'upcoming', date: '2026-11-19', calendarTime: '10:00' };
  home.mount(root, [upcoming], {});
  assert.match(carousel.innerHTML, /Prochain rendez-vous/);
  assert.match(carousel.innerHTML, /10 h 00/);
  assert.match(carousel.innerHTML, /Aucune séance à poursuivre/);
  assert.match(carousel.innerHTML, /data-k="prep"/);

  home.mount(root, [upcoming, { id: 'draft', kind: 'current', date: '2026-11-11' }], {});
  assert.doesNotMatch(carousel.innerHTML, /Aucune séance à poursuivre/);
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
