import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {questions} from '../src/data.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
await mkdir('output',{recursive:true});
try{
 for(const width of [320,390,1280]){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:width===320?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>requests.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://127.0.0.1:4178/games/pri-kom/');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{localStorage.setItem('merkazim_integration_probe','untouched');sessionStorage.setItem('other_game_probe','untouched');});
  async function activate(locator){if(width!==320){await locator.click();return;}for(let n=0;n<100;n++){if(await locator.evaluate(el=>el===document.activeElement)){await page.keyboard.press('Enter');return;}await page.keyboard.press('Tab');}throw new Error('Control unreachable by Tab');}
  const contrast=await page.evaluate(()=>{const lum=h=>h.match(/\w\w/g).map(x=>{const v=parseInt(x,16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);return (lum('F0EADC')+.05)/(lum('0B7074')+.05);});assert.ok(contrast>=4.5);
  assert.equal(await page.locator('#brand').getAttribute('href'),'https://svoimgolosom.co.il/');assert.equal(await page.locator('#registration').getAttribute('href'),'https://svoimgolosom.co.il/qmYm#join');
  await activate(page.locator('#privacy'));assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);await page.keyboard.press('Escape');
  await activate(page.locator('#start'));
  const ids=[];let correct=0;
  for(let i=0;i<8;i++){
   const text=await page.locator('h1').innerText(),q=questions.find(q=>q.question===text);assert.ok(q);ids.push(q.id);
   assert.equal(await page.locator('.option').count(),4);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(i===0){await activate(page.locator('#hint'));assert.equal(await page.locator('.option:disabled').count(),2);}
   const right=width!==320||i%2===0;let button=right?page.getByRole('button',{name:q.correct,exact:false}):page.locator('.option:not(:disabled)').filter({hasNotText:q.correct}).first();if(right)correct++;
   await activate(button);await page.locator('.story-card').waitFor();await activate(page.locator('.story details summary'));assert.equal(await page.locator('.sources a').count(),q.sources.length);
   assert.equal(await page.locator('.answer-heading h1').innerText(),q.correct);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(i===0&&width===390){await page.screenshot({path:'output/story-mobile.png',fullPage:true});}
   await activate(page.locator('#next'));
  }
  assert.equal(new Set(ids).size,8);assert.equal(await page.locator('.result h1').innerText(),`${correct} из 8`);assert.equal(await page.locator('.timeline-item').count(),8);
  const years=await page.locator('.timeline-year').allTextContents();assert.deepEqual(years,[...years].sort());
  await activate(page.locator('.timeline-item summary').first());if(width===390)await page.screenshot({path:'output/result-mobile.png',fullPage:true});
  assert.deepEqual(await page.evaluate(()=>({local:localStorage.getItem('merkazim_integration_probe'),localCount:localStorage.length,session:sessionStorage.getItem('other_game_probe'),sessionCount:sessionStorage.length,cookie:document.cookie})),{local:'untouched',localCount:1,session:'untouched',sessionCount:1,cookie:''});
  await activate(page.locator('#again'));assert.equal(await page.locator('.option').count(),4);assert.equal(await page.locator('#hint').isEnabled(),true);
  await page.reload();assert.equal(await page.locator('#start').count(),1);
  assert.ok(requests.every(u=>u.startsWith('http://127.0.0.1:4178/games/pri-kom/')));assert.deepEqual(errors,[]);console.log(`PASS ${width}px: full round, score ${correct}/8, history, hint, keyboard, replay, privacy, CSP, no external requests.`);await context.close();
 }
}finally{await browser.close();}
