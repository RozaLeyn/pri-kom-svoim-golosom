import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
async function walk(dir){const out=[];for(const f of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${f.name}`;out.push(...f.isDirectory()?await walk(p):[p]);}return out;}
const files=await walk('dist');const html=await readFile('dist/index.html','utf8');
assert.ok(html.includes('https://info.svoimgolosom.co.il/games/pri-kom/preview.png'));
const preview=await readFile('dist/preview.png');assert.equal(preview.readUInt32BE(16),1733);assert.equal(preview.readUInt32BE(20),908);
for(const file of files){
 assert.ok(!/\.(ttf|otf|eot)$/i.test(file),`Forbidden font: ${file}`);
 assert.ok(!/(^|\/)\.env/.test(file),`Private environment file: ${file}`);
 if(!['.html','.css','.js'].includes(extname(file)))continue;
 const s=await readFile(file,'utf8');
 assert.ok(!/\beval\s*\(|new\s+Function\b|\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|document\.cookie/.test(s),`Runtime restriction: ${file}`);
 assert.ok(!/\son\w+\s*=\s*["']/.test(s),`Inline handler: ${file}`);
 if(file.endsWith('.html'))assert.ok([...s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].every(m=>/\bsrc=/.test(m[1])&&!m[2].trim()));
 const resourceRefs=[...s.matchAll(/\bsrc=["']([^"']+)["']/g),...s.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g),...s.matchAll(/\b(?:from|import)\s*['"]([^'"]+)['"]/g)];
 for(const [,ref] of resourceRefs){assert.ok(ref.startsWith('./')||ref.startsWith('../'),`Non-local resource in ${file}: ${ref}`);const base=file.endsWith('.js')&&ref.startsWith('./assets/')?'dist':dirname(file);await stat(resolve(base,ref));}
}
const total=(await Promise.all(files.map(f=>stat(f)))).reduce((s,f)=>s+f.size,0);
assert.ok(total-preview.length<1024*1024,'Game assets excluding social cover exceed 1 MB');
assert.ok(preview.length<5*1024*1024,'Social cover exceeds 5 MB');
console.log(`Integration passed: ${files.length} static files, ${(total/1024).toFixed(0)} KB including 1733×908 preview. No network, storage, inline scripts, secret files or unlicensed font formats.`);
