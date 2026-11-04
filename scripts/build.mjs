import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
await mkdir(dist, { recursive: true });
for (const path of ['index.html', 'auth-connexion.css', 'auth-connexion.js', 'profil-identite.js', 'profil-identite.css', 'onboarding-code.js', 'onboarding-code.css', 'code-placement.css', 'manifest.webmanifest', 'sw.js', 'ma-vie-parcours.js', 'fonts', 'icons', 'illus']) {
  await cp(resolve(root, path), resolve(dist, path), { recursive: true });
}
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const digest = createHash('sha256').update(html);
for (const path of ['ma-vie-parcours.js', 'auth-connexion.js', 'auth-connexion.css', 'profil-identite.js', 'profil-identite.css', 'onboarding-code.js', 'onboarding-code.css', 'code-placement.css', 'illus/carnet-plume-connexion.png']) digest.update(await readFile(resolve(root, path)));
const version = digest.digest('hex').slice(0, 12);
const sw = await readFile(resolve(root, 'sw.js'), 'utf8');
await writeFile(resolve(dist, 'sw.js'), sw.replace(/const V='[^']+'/, `const V='entre-nous-${version}'`));
// GitHub Pages sert la racine du dépôt : son sw.js porte aussi la version, pour que chaque mise à jour remplace l'ancien cache
await writeFile(resolve(root, 'sw.js'), sw.replace(/const V='[^']+'/, `const V='entre-nous-${version}'`));
console.log('Entre nous : application prête dans dist/.');
