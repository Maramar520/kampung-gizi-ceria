import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

async function load(path){
 const code=readFileSync(new URL('../'+path,import.meta.url),'utf8');
 return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}
const {LearningSystem,QUIZ_QUESTIONS,quizForDay,FOOD_GROUPS,FOOD_OPTIONS,PLATE_STEPS,
 inspectPlate,normalizeLearning,REWARDS,LEARNING_SOURCE}=await load('src/systems/LearningSystem.js');
const {GameState,defaults,SAVE_KEY}=await load('src/systems/GameState.js');
const storage=new Map();
globalThis.localStorage={
 getItem:k=>storage.get(k)??null,
 setItem:(k,v)=>storage.set(k,String(v)),
 removeItem:k=>storage.delete(k)
};
const make=()=>{storage.clear();return new GameState();};
test('Isi Piringku follows 1/2 vegetables and fruit, 1/2 staple and protein',()=>{
 assert.equal(PLATE_STEPS.length,4);
 assert.equal(FOOD_GROUPS.pokok.share,2);
 assert.equal(FOOD_GROUPS.lauk.share,1);
 assert.equal(FOOD_GROUPS.sayur.share,2);
 assert.equal(FOOD_GROUPS.buah.share,1);
 assert.equal(Object.values(FOOD_GROUPS).reduce((n,v)=>n+v.share,0),6);
 assert.match(LEARNING_SOURCE,/ayosehat.kemkes.go.id/);
 const ids=new Set(FOOD_OPTIONS.map(x=>x.id));
 assert.equal(ids.size,FOOD_OPTIONS.length);
});
test('three simple correct-answer quiz questions each in-game day',()=>{
 assert.ok(QUIZ_QUESTIONS.length>=6);
 for(const q of QUIZ_QUESTIONS){
  assert.equal(q.choices.length,4);
  assert.ok(q.correct>=0&&q.correct<4);
  assert.ok(q.feedback.length>20);
 }
 assert.equal(quizForDay(1).length,3);
 assert.notDeepEqual(quizForDay(1).map(q=>q.id),quizForDay(2).map(q=>q.id));
});
test('plate does not accept missing, invalid, or incorrect food groups',()=>{
 assert.equal(inspectPlate({}).complete,false);
 assert.equal(inspectPlate({pokok:'telur',lauk:'nasi',sayur:'bayam',buah:'pisang'}).complete,false);
 const done=inspectPlate({pokok:'nasi',lauk:'telur',sayur:'bayam',buah:'pisang'});
 assert.equal(done.complete,true);
 for(const p of PLATE_STEPS)assert.equal(done.groups[p].valid,true);
 assert.equal(inspectPlate({pokok:'jagung',lauk:'ikan',sayur:'kangkung',buah:'jeruk'}).complete,true);
});
test('reward grants exactly once per activity per day even on repeated completion',()=>{
 const state=make(),learning=new LearningSystem(state);
 const quizIds=learning.questions().map(q=>q.id);
 const menu={pokok:'nasi',lauk:'telur',sayur:'wortel',buah:'pisang'};
 const first=learning.quizFinished(quizIds);
 assert.deepEqual([first.stars,first.coins],[REWARDS.quiz.stars,REWARDS.quiz.coins]);
 assert.equal(learning.quizFinished(quizIds),null);
 const plate=learning.plateFinished(menu);
 assert.deepEqual([plate.stars,plate.coins],[REWARDS.plate.stars,REWARDS.plate.coins]);
 assert.equal(learning.plateFinished(menu),null);
 assert.equal(state.data.coins,100+REWARDS.quiz.coins+REWARDS.plate.coins);
 assert.equal(state.data.learning.stars,5);
 assert.equal(state.data.learning.quiz.completed,1);
 assert.equal(state.data.learning.plate.completed,1);
 state.data.day++;
 assert.ok(learning.quizFinished(learning.questions().map(q=>q.id)));
 assert.ok(learning.plateFinished(menu));
 assert.equal(learning.stars,10);
});
test('incorrect quiz answers or plate give no rewards and never remove coins',()=>{
 const state=make(),learning=new LearningSystem(state);
 assert.equal(learning.quizFinished(['invalid']),null);
 assert.equal(learning.quizFinished(learning.questions().slice(0,2).map(q=>q.id)),null);
 assert.equal(learning.plateFinished({pokok:'telur',lauk:'telur'}),null);
 assert.equal(learning.claim('quiz',false),null);
 assert.equal(state.data.coins,100);
 assert.equal(learning.stars,0);
});
test('save v1.5 remains intact and new stars survive reload and reset',()=>{
 storage.clear();
 storage.set(SAVE_KEY,JSON.stringify({x:446,y:291,coins:73,day:4,done:true,
  inventory:{bayam:2},social:{friends:{nia:{hearts:3,lastTalkDay:3}}}}));
 const state=new GameState(),learning=new LearningSystem(state);
 assert.equal(state.data.coins,73);
 assert.equal(state.data.done,true);
 assert.equal(state.data.social.friends.nia.hearts,3);
 assert.equal(learning.stars,0);
 const reward=learning.quizFinished(learning.questions().map(q=>q.id));
 assert.ok(reward);
 const reloaded=new GameState(),again=new LearningSystem(reloaded);
 assert.equal(again.stars,3);
 assert.equal(again.quizFinished(again.questions().map(q=>q.id)),null);
 assert.equal(reloaded.data.social.friends.nia.hearts,3);
 reloaded.reset();
 assert.equal(again.stars,0);
 assert.equal(reloaded.data.coins,100);
 assert.equal(defaults().learning.stars,0);
});
test('corrupted learning values normalize safely',()=>{
 const x=normalizeLearning({stars:-8,quiz:{completed:9999999,lastRewardDay:'hello'},
  plate:{completed:2,lastRewardDay:-5}});
 assert.equal(x.stars,0);
 assert.equal(x.quiz.lastRewardDay,0);
 assert.equal(x.quiz.completed,99999);
 assert.equal(x.plate.completed,2);
 assert.equal(x.plate.lastRewardDay,0);
});
