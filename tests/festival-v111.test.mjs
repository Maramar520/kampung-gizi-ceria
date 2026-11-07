import test from 'node:test';
import assert from 'node:assert/strict';
import {FestivalSystem,normalizeFestival} from '../src/systems/FestivalSystem.js';
const make=(day,festival)=>{
 const data={day,coins:100,learning:{stars:0},festival};
 const state={data,save(){this.saved=(this.saved||0)+1;}};
 return {state,system:new FestivalSystem(state)};
};
test('v1.11 activities are locked outside festival and before joining',()=>{
 const a=make(2);assert.equal(a.system.communityHelp(),null);
 const b=make(3);assert.equal(b.system.communityHelp(),null);
 assert.equal(b.system.cookingContest(1),null);
});
test('v1.11 activities reward once and survive reload without changing old rewards',()=>{
 const {state,system}=make(3);
 assert.equal(system.join(),true);
 assert.deepEqual(system.communityHelp(),{coins:12,stars:2});
 assert.equal(system.communityHelp(),null);
 assert.equal(system.cookingContest(0),null);
 assert.deepEqual(system.cookingContest(1),{coins:18,stars:2});
 assert.equal(system.cookingContest(1),null);
 assert.equal(state.data.coins,130);
 assert.equal(state.data.learning.stars,4);
 const reload=make(3,JSON.parse(JSON.stringify(state.data.festival))).system;
 assert.equal(reload.communityHelp(),null);
 assert.equal(reload.cookingContest(1),null);
 assert.equal(reload.quiz(0),true);
 assert.deepEqual(reload.celebrate(),{coins:35,stars:4});
});
test('v1.10 saves without v1.11 fields normalize and future festival resets daily lock',()=>{
 const old={joinedDays:[3],quizPassedDay:3,celebratedDays:[3]};
 assert.deepEqual(normalizeFestival(old).communityDays,[]);
 const {state,system}=make(7,old);
 assert.equal(system.join(),true);
 assert.ok(system.communityHelp());
 assert.ok(system.cookingContest(1));
 assert.equal(state.data.festival.celebratedDays.includes(3),true);
});
