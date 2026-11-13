import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../psy-apres.js', import.meta.url), 'utf8');
const between = (start, end) => script.slice(script.indexOf(start), script.indexOf(end));
const { syncCalendar, deleteSession } = runInNewContext(
  between('  const dayKey', '  function legacyDate') +
  between('  function syncCalendar', '  let state;') +
  between('  function deleteSession', '  function mountEditor') +
  ';({syncCalendar, deleteSession})',
  { crypto: { randomUUID: (() => { let id = 0; return () => String(++id); })() } }
);

test('une séance supprimée dans Après retire son récapitulatif et ne revient pas du calendrier', () => {
  const calendar = [{ id: 12, t: 'psy', y: 2026, m: 10, d: 6, rep: 1 }];
  const now = new Date(2026, 10, 15, 14);
  const state = { sessions: [] };
  syncCalendar(state, calendar, now);
  const [first, next] = state.sessions;
  first.historyId = 'ancien-bilan';
  const history = [{ id: 'ancien-bilan' }, { id: 'autre', afterId: next.id }];
  assert.equal(deleteSession(state, history, first), true);
  assert.deepEqual(history.map(item => item.id), ['autre']);
  const restored = JSON.parse(JSON.stringify(state));
  syncCalendar(restored, calendar, now);
  assert.deepEqual(restored.sessions.map(item => item.date), [next.date]);
  assert.equal(calendar.length, 1);
});

test('la suppression d’une séance ajoutée à la main cible uniquement son propre retour', () => {
  const session = { id: 'manuel', date: '2026-11-06' };
  const other = { id: 'autre', date: session.date };
  const state = { sessions: [session, other] };
  const history = [{ id: 'apres-autre' }, { id: 'apres-manuel', afterId: 'manuel' }];
  assert.equal(deleteSession(state, history, session), true);
  assert.equal(deleteSession(state, history, session), false);
  assert.deepEqual(state.sessions, [other]);
  assert.deepEqual(history.map(item => item.id), ['apres-autre']);
});
