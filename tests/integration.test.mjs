import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('campaign handoff includes share metadata and npm font package',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 assert.ok(html.includes('https://info.svoimgolosom.co.il/games/pri-kom/preview.png'));
 assert.ok(html.includes('property="og:image"'));
 const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
 assert.equal(pkg.dependencies['@fontsource/geologica'],'5.3.0');
 const ignore=await readFile(new URL('../.gitignore',import.meta.url),'utf8');
 assert.ok(ignore.includes('*.ttf'));assert.ok(ignore.includes('*.otf'));
});
test('static entry has local modules and no inline scripts or handlers',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 assert.ok(html.includes('lang="ru"'));assert.ok(html.includes('type="module" src="./src/app.js"'));assert.ok([...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].every(m=>!m[1].trim()));assert.ok(!/\son\w+=/.test(html));assert.ok(!/(?:src|href)="\/(?!\/)/.test(html));
 assert.match(html,/<div class="brand-row">/);assert.match(html,/<div id="game-status" class="game-status" hidden>/);
 assert.match(html,/<div class="registration"><span>Идёшь голосовать\?<\/span><a id="registration"/);
});
test('runtime does not store, track or transmit answers',async()=>{
 for(const f of ['app.js','core.js','config.js']){const code=await readFile(new URL(`../src/${f}`,import.meta.url),'utf8');assert.ok(!/localStorage|sessionStorage|document\.cookie|\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|eval\s*\(/.test(code));}
});
