import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = vm.createContext({});
vm.runInContext(readFileSync(new URL('../psy-petits-pas.js', import.meta.url), 'utf8'), context);
const steps = context.__enPsySteps;

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
