import {test} from 'node:test';
import assert from 'node:assert/strict';
import {headerState} from '../src/header.js';

test('start screen hides the game title, counter and progress',()=>{
 assert.deepEqual(headerState({screen:'intro',index:0,answers:[],total:8}),{
  visible:false,title:'',counter:'',showProgress:false,segments:[]
 });
});

test('question header shows game name, current count and answer states',()=>{
 assert.deepEqual(headerState({screen:'play',index:2,answers:[{correct:true},{correct:false}],total:8}),{
  visible:true,title:'При ком?',counter:'3 из 8',showProgress:true,
  segments:['correct','incorrect','current','pending','pending','pending','pending','pending']
 });
});

test('result header replaces the counter label and hides progress',()=>{
 assert.deepEqual(headerState({screen:'result',index:7,answers:[],total:8}),{
  visible:true,title:'При ком?',counter:'результат',showProgress:false,segments:[]
 });
});
