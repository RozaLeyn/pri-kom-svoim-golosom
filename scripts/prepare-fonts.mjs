import {cp,mkdir} from 'node:fs/promises';
await mkdir('assets/fonts',{recursive:true});
for(const subset of ['cyrillic','latin'])for(const weight of [400,700]){
 const name=`geologica-${subset}-${weight}-normal.woff2`;
 await cp(`node_modules/@fontsource/geologica/files/${name}`,`assets/fonts/${name}`);
}
await cp('node_modules/@fontsource/geologica/LICENSE','assets/fonts/Geologica-LICENSE.txt');
