import {cp, readFile, rm, writeFile} from 'node:fs/promises';

// Keep the campaign export intact when publishing the standalone Sites copy.
await rm('out', {recursive: true, force: true});
await cp('dist', 'out', {recursive: true});
const entry = 'out/index.html';
const html = await readFile(entry, 'utf8');
await writeFile(entry, html.replace(
  'https://info.svoimgolosom.co.il/games/pri-kom/preview.png',
  'https://pri-kom-svoim-golosom.rozaleyn.chatgpt.site/preview.png',
));
