import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../src/data.js';
import {createGame, answer, next, hint, score} from '../src/core.js';

test('eight approved, sourced, unambiguous questions',()=>{
 assert.equal(questions.length,8); assert.equal(new Set(questions.map(q=>q.id)).size,8);
 for(const q of questions){assert.equal(new Set(q.options).size,4); assert.ok(q.options.includes(q.correct)); assert.ok(q.story.length>=2); assert.ok(q.sources.every(s=>s.url.startsWith('https://')));}
 assert.ok(questions.some(q=>q.id==='snow')); assert.ok(questions.some(q=>q.id==='ptitim'));
 assert.ok(!questions.some(q=>['beresheet','television'].includes(q.id)));
});
test('one hint hides two wrong choices and cannot be reused',()=>{
 const s=createGame(questions); hint(s); const q=s.deck[0]; assert.equal(s.hidden.length,2); assert.ok(!s.hidden.includes(q.correct));
 answer(s,q.correct); next(s); hint(s); assert.equal(s.hidden.length,0); assert.equal(s.hintUsed,true);
});
test('answers cannot be overwritten, invalid choices ignored, finish exactly at eight',()=>{
 const s=createGame(questions); next(s); assert.equal(s.index,0); answer(s,'invalid'); assert.equal(s.answers.length,0);
 for(let i=0;i<8;i++){const q=s.deck[i]; answer(s,q.correct); answer(s,q.options.find(x=>x!==q.correct)); assert.equal(s.answers.length,i+1); next(s);}
 assert.equal(s.done,true); assert.equal(score(s),8); next(s); assert.equal(s.index,7);
});
test('wrong answers stay wrong and hidden answers cannot be selected',()=>{
 const s=createGame(questions); hint(s); answer(s,s.hidden[0]); assert.equal(s.answers.length,0);
 const q=s.deck[0]; answer(s,q.options.find(x=>x!==q.correct&&!s.hidden.includes(x))); assert.equal(score(s),0); assert.equal(s.answers[0].hint,true);
});
