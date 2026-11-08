// Écran QA isolé : créé uniquement à la demande, après la construction normale.
import {copyFile} from 'node:fs/promises';
await copyFile(new URL('../tests/fixtures/psy-preview.html',import.meta.url),new URL('../dist/qa-psy.html',import.meta.url));
console.log('Écran de contrôle : dist/qa-psy.html (données de test en mémoire).');
