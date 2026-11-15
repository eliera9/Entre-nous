import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = vm.createContext({});
vm.runInContext(readFileSync(new URL('../psy-historique.js', import.meta.url), 'utf8'), context);
vm.runInContext(readFileSync(new URL('../psy-petits-pas.js', import.meta.url), 'utf8'), context);
const steps = context.__enPsySteps;

test('les idées de Plume sont proposées dans l’ajout seulement', () => {
  const add = steps.editor({}, true);
  const edit = steps.editor({ t: 'Un pas commencé' }, false);
  assert.match(add, /DES IDÉES DE PLUME/);
  assert.match(add, /data-a="edidea" data-t="Envoyer un message à mon frère"/);
  assert.doesNotMatch(edit, /DES IDÉES DE PLUME|data-a="edidea"/);
  assert.match(edit, /Un pas commencé/);
  for (const html of [add, edit]) {
    assert.match(html, /Sujets principaux[\s\S]+Date prévue[\s\S]+Fréquence[\s\S]+Rappel/);
  }
});

test('les dates prévues distinguent aujourd’hui, demain et les dates sans échéance', () => {
  assert.equal(steps.plannedLabel('2026-11-15', '2026-11-15'), 'Aujourd’hui');
  assert.equal(steps.plannedLabel('2027-01-01', '2026-12-31'), 'Demain');
  assert.equal(steps.plannedLabel('2026-11-17', '2026-11-15'), 'mardi 17 novembre');
  assert.equal(steps.plannedLabel('2026-02-30', '2026-11-15'), '');
  assert.equal(steps.plannedLabel(undefined, '2026-11-15'), '');
});

test('une semaine à cheval sur deux mois respecte le mois réel de chaque réalisation', () => {
  const older = { id: 'older', completedOn: '2026-10-29' };
  const newer = { id: 'newer' };
  steps.complete(newer, '', '2026-11-01');
  const legacy = { id: 'legacy', day: 'MARDI' };
  const { months, undated } = steps.groupCompleted([older, legacy, newer]);
  assert.deepEqual([...months.keys()], ['2026-11', '2026-10']);
  assert.equal(months.get('2026-11').get('2026-10-26')[0], newer);
  assert.equal(months.get('2026-10').get('2026-10-26')[0], older);
  assert.equal(undated[0], legacy);
});

test('les périodes et les sujets se combinent, selon la date pertinente pour chaque onglet', () => {
  const active = { id: 'active', t: 'Écrire', plannedDate: '2026-12-01', subjects: ['Émotions'] };
  const done = { id: 'done', t: 'Relire', done: 1, plannedDate: '2026-10-30', completedOn: '2026-11-13', subjects: ['Famille'], feel: 'fière' };
  const legacy = { id: 'legacy', t: 'Marcher', done: 1 };
  const items = [active, done, legacy];
  const filters = { periods: ['2026-11', '2026-12'], subjects: ['Famille', 'Émotions'] };
  const options = { items, filters, archive: {} };
  assert.equal(steps.matches(active, filters), true);
  assert.equal(steps.matches(done, { ...filters, periods: ['2026-10'] }), false);
  assert.equal(steps.matches(legacy, filters), false);
  assert.deepEqual(Array.from(steps.periodOptions(items), ([key]) => key), ['2026-12', '2026-11']);
  assert.match(steps.renderContent(options), /Écrire/);
  const finished = steps.renderContent({ ...options, tab: 'done' });
  assert.match(finished, /datetime="2026-11-13">13 nov\.<\/time> · « fière »/);
  assert.doesNotMatch(finished, /Fait le|Marcher/);
  assert.match(steps.renderContent({ ...options, filters: {}, tab: 'done' }), /Date non renseignée[\s\S]+Marcher/);
});

test('un rappel facultatif respecte la date, l’heure et la fréquence choisies', () => {
  const now = new Date(2026, 10, 15, 18, 0);
  const date = (day, hour, minute) => new Date(2026, 10, day, hour, minute).getTime();
  const single = { r: '19 h 35', rep: '' };
  assert.equal(steps.reminderStart({ r: '', rep: '', plannedDate: '2026-11-16' }, null, now), '');
  assert.equal(steps.reminderStart(single, null, now), '2026-11-15');
  assert.equal(steps.reminderStart({ ...single, r: '00 h 30' }, null, now), '2026-11-16');
  assert.deepEqual(Array.from(steps.reminderSchedule({ ...single, plannedDate: '2026-11-17' }, now, 14)), [date(17, 19, 35)]);
  const recurring = { r: '20:15', rep: 'chaque semaine', reminderStartsOn: '2026-11-16' };
  assert.deepEqual(Array.from(steps.reminderSchedule(recurring, now, 14)), [date(16, 20, 15), date(23, 20, 15)]);
  const until = { ...recurring, rep: "jusqu'à la séance" };
  assert.deepEqual(Array.from(steps.reminderSchedule(until, now, 14, '2026-11-18')), [date(16, 20, 15), date(17, 20, 15)]);
  assert.deepEqual(Array.from(steps.reminderSchedule({ r: '21 h', rep: 'une fois' }, now, 14)), [date(15, 21, 0)]);
});
