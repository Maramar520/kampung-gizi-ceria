import test from 'node:test';
import assert from 'node:assert/strict';
import {MarineEducationSystem,MARINE_LESSONS} from '../src/systems/MarineEducationSystem.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
import {canStand} from '../src/world/WorldGeometry.js';
test('v1.22 keeps existing save key, roads and old save fields',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 for(let y=540;y<=795;y+=5)assert.equal(canStand(760,y),true,'beach road blocked at '+y);
 const state={data:{day:4,coins:100,inventory:{kerang:2},coast:{lastShellDay:4}},save(){this.saved=true;}};
 const marine=new MarineEducationSystem(state);
 assert.equal(state.data.inventory.kerang,2);
 assert.equal(state.data.coast.lastShellDay,4);
 assert.equal(marine.lessons.length,3);
 assert.equal(marine.answer(0,1).correct,false);
 assert.equal(state.data.coins,100);
 assert.deepEqual(marine.answer(0,0),{correct:true,reward:10});
 assert.deepEqual(marine.answer(0,0),{correct:true,reward:0});
 assert.equal(marine.helpBayu(),true);
 assert.equal(marine.helpBayu(),false);
 assert.equal(state.data.coins,122);
 const restored={data:JSON.parse(JSON.stringify(state.data)),save(){}};
 const next=new MarineEducationSystem(restored);
 assert.equal(next.lessons[0].completed,true);
 assert.equal(next.canHelpBayu,false);
 restored.data.day=5;
 assert.equal(next.helpBayu(),true);
});
test('all conservation lessons have valid answers and explanation',()=>{
 for(const l of MARINE_LESSONS){
  assert.ok(l.answers.length>=3);
  assert.ok(l.correct>=0&&l.correct<l.answers.length);
  assert.ok(l.explain.length>20);
 }
});
