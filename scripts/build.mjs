import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
await mkdir(dist, { recursive: true });
for (const path of ['index.html', 'manifest.webmanifest', 'sw.js', 'fonts', 'icons', 'illus']) {
  await cp(resolve(root, path), resolve(dist, path), { recursive: true });
}
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const version = createHash('sha256').update(html).digest('hex').slice(0, 12);
const sw = await readFile(resolve(root, 'sw.js'), 'utf8');
await writeFile(resolve(dist, 'sw.js'), sw.replace(/const V='[^']+'/, `const V='entre-nous-${version}'`));
console.log('Entre nous : application prête dans dist/.');
