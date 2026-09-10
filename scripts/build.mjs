import {cp,mkdir,rm} from 'node:fs/promises';
import './prepare-fonts.mjs';
await rm('dist',{recursive:true,force:true}); await mkdir('dist');
for(const path of ['index.html','style.css','src','assets'])await cp(path,`dist/${path}`,{recursive:true});
await cp('public','dist',{recursive:true});
console.log('Static build ready: dist/ (relative paths, /games/pri-kom/ compatible)');
