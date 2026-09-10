// Optional editorial tool; the checked-in PNG is used by build without a browser.
import {readFile,mkdir} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const uri=async(path,mime)=>`data:${mime};base64,${(await readFile(path)).toString('base64')}`;
const [logo,character,cyrillic,latin]=await Promise.all([uri('assets/logo.jpg','image/jpeg'),uri('assets/character.png','image/png'),uri('assets/fonts/geologica-cyrillic-700-normal.woff2','font/woff2'),uri('assets/fonts/geologica-latin-700-normal.woff2','font/woff2')]);
const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html lang="ru"><meta charset="utf-8"><style>@font-face{font-family:G;src:url('${cyrillic}');font-weight:700;unicode-range:U+0400-052F}@font-face{font-family:G;src:url('${latin}');font-weight:700}*{box-sizing:border-box}body{margin:0;background:#F0EADC;color:#153825;font-family:G,sans-serif;font-weight:700;width:1200px;height:630px;padding:50px 64px}.logo{width:200px;mix-blend-mode:multiply}h1{font-size:116px;line-height:1;margin:38px 0 24px;letter-spacing:-6px}h1 span{color:#EF454E}p{font-size:35px;line-height:1.4;margin:0}.label{margin-top:40px;font-size:22px;background:#36BDC2;display:inline-block;padding:15px 26px;border-radius:40px}.character{position:absolute;width:300px;height:360px;object-fit:contain;right:50px;top:210px}</style><img class="logo" src="${logo}" alt="Своим голосом"><h1>При ком<span>?</span></h1><p>Событие помнишь.<br>А кто тогда был премьером?</p><div class="label">8 событий · 4 имени · неожиданные истории</div><img class="character" src="${character}" alt=""></html>`);
 await page.evaluate(()=>document.fonts.ready);await mkdir('public',{recursive:true});await page.screenshot({path:'public/preview.png'});
}finally{await browser.close();}
