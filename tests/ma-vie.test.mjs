import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext, Script } from 'node:vm';

const source = await readFile(new URL('../ma-vie-parcours.js', import.meta.url), 'utf8');
function catalog(profile = {}) {
  return runInNewContext(source + '; __enVieChapters', {})({ P: profile, A: (m, f) => f });
}

test('les chapitres disposent des thèmes validés et de questions exécutables', () => {
  new Script(source);
  const { chapters, nodes } = catalog();
  const counts = { proches: 6, passe: 7, int: 10, histoire: 9 };
  for (const [id, count] of Object.entries(counts)) {
    const chapter = chapters[id];
    assert.equal(chapter.themes.length, count);
    assert.equal(chapter.names.length, count);
    for (const theme of chapter.themes) for (const key of theme) {
      assert.ok(nodes[key], `question absente : ${key}`);
      assert.ok(typeof nodes[key].q === 'string' || typeof nodes[key].q === 'function');
    }
  }
});

test('toutes les relances aboutissent à une question déclarée', () => {
  const { nodes } = catalog({ partenaire: 'Prénom fictif' });
  for (const [id, node] of Object.entries(nodes)) {
    const choices = typeof node.c === 'function' ? node.c() : node.c || [];
    for (const choice of [...choices, 'oui', 'non', 'réponse libre']) {
      for (const target of node.then?.(choice) || []) assert.ok(nodes[target], `${id} → ${target}`);
    }
  }
});

test('refuser de parler d’un sujet sensible ne lance pas de relance intime', () => {
  const { nodes } = catalog();
  assert.deepEqual(Array.from(nodes.pr_manque.then('je préfère passer')), []);
  assert.deepEqual(Array.from(nodes.pa_epreuves.then('je préfère passer')), []);
  assert.deepEqual(Array.from(nodes.pa_epreuves_choix.then('pour plus tard')), []);
  assert.equal(catalog({ in_corps: 'je préfère ne pas en parler' }).nodes.in_corps_bien.skip(), true);
});

test('un psy déjà renseigné dans l’inscription n’est pas redemandé', () => {
  const factory = runInNewContext(source + '; __enVieChapters', { __enGet: () => ({ psy: 'oui' }) });
  assert.equal(factory({ P: {}, A: (m, f) => f }).nodes.in_psy.skip(), true);
});

test('les parcours utilisent les informations données sans ajouter de nom', () => {
  const empty = catalog();
  assert.ok(!JSON.stringify(empty.chapters).includes('Thomas'));
  assert.ok(!empty.nodes.pr_rencontrer.q().includes('Toulouse'));
  assert.ok(catalog({ villeNom: 'Ville fictive' }).nodes.pr_rencontrer.q().includes('Ville fictive'));
});

