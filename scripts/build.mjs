import { cp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const path of ['index.html', 'inscription-reprise.js', 'inscription-reprise.css', 'psy-approved.js', 'psy-premiere-validee.js', 'psy-suivi-valide.js', 'psy-suivi-recap.js', 'psy-approved.css', 'vendor/lucide.min.js', 'accueil-valide.js', 'accueil-valide.css', 'avatars-bulles.js', 'avatars-bulles.css', 'compagnons.js', 'compagnons.css', 'onboarding-valide.css', 'auth-connexion.css', 'auth-connexion.js', 'profil-identite.js', 'profil-identite.css', 'onboarding-code-recovery.js', 'onboarding-code.css', 'code-placement.css', 'recovery-sheet.js', 'recovery-sheet.css', 'vendor/LICENSE-lucide', 'manifest.webmanifest', 'sw.js', 'ma-vie-parcours.js', 'ma-vie-validee.js', 'ma-vie-validee.css', 'ma-vie-pages.js', 'ma-vie-pages.css', 'fonts', 'icons', 'illus']) {
  await cp(resolve(root, path), resolve(dist, path), { recursive: true });
}
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const digest = createHash('sha256').update(html);
for (const path of ['inscription-reprise.js', 'inscription-reprise.css', 'psy-approved.js', 'psy-premiere-validee.js', 'psy-suivi-valide.js', 'psy-suivi-recap.js', 'psy-approved.css', 'vendor/lucide.min.js', 'accueil-valide.js', 'accueil-valide.css', 'avatars-bulles.js', 'avatars-bulles.css', 'compagnons.js', 'compagnons.css', 'onboarding-valide.css', 'ma-vie-parcours.js', 'ma-vie-validee.js', 'ma-vie-validee.css', 'ma-vie-pages.js', 'ma-vie-pages.css', 'auth-connexion.js', 'auth-connexion.css', 'profil-identite.js', 'profil-identite.css', 'onboarding-code-recovery.js', 'onboarding-code.css', 'code-placement.css', 'recovery-sheet.js', 'recovery-sheet.css', 'illus/carnet-plume-connexion.png', 'illus/lock-branche-rose.webp', 'icons/image-plus.svg', 'icons/trash-2.svg']) digest.update(await readFile(resolve(root, path)));
for (const path of (await readdir(resolve(root, 'illus/companions'))).sort()) digest.update(await readFile(resolve(root, 'illus/companions', path)));
for (const path of (await readdir(resolve(root, 'illus/avatars-compagnons'))).sort()) digest.update(await readFile(resolve(root, 'illus/avatars-compagnons', path)));
for (const path of (await readdir(resolve(root, 'illus/accueil-valide'))).sort()) digest.update(await readFile(resolve(root, 'illus/accueil-valide', path)));
for (const folder of ['illus/psy-valides','fonts/psy-valides']) for (const path of (await readdir(resolve(root,folder))).sort()) digest.update(await readFile(resolve(root,folder,path)));
const version = digest.digest('hex').slice(0, 12);
const sw = await readFile(resolve(root, 'sw.js'), 'utf8');
await writeFile(resolve(dist, 'sw.js'), sw.replace(/const V='[^']+'/, `const V='entre-nous-${version}'`));
// GitHub Pages sert la racine du dépôt : son sw.js porte aussi la version, pour que chaque mise à jour remplace l'ancien cache
await writeFile(resolve(root, 'sw.js'), sw.replace(/const V='[^']+'/, `const V='entre-nous-${version}'`));
console.log('Entre nous : application prête dans dist/.');
