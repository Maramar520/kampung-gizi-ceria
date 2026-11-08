import test from 'node:test';
import assert from 'node:assert/strict';
import {MayorMissionSystem} from '../src/systems/MayorMissionSystem.js';
function setup(day=3,previous={}){const data={day,coins:20,learning:{stars:0},plazaActivities:{days:[]},festival:{communityDays:[]},...previous};return {data,save(){this.saved=(this.saved||0)+1}};}
test('old save receives mission defaults without losing fields',()=>{
 const state=setup(3,{inventory:{bayam:2}}),system=new MayorMissionSystem(state);
 assert.deepEqual(state.data.mayorMissions,{claimedMove:[],claimedFestival:[]});
 assert.equal(state.data.inventory.bayam,2);
 assert.equal(system.claim('move'),null);
});
test('plaza mission pays once and is repeatable next day',()=>{
 const state=setup();const system=new MayorMissionSystem(state);
 state.data.plazaActivities.days.push(3);
 assert.deepEqual(system.claim('move'),{coins:16,stars:2});
 assert.equal(system.claim('move'),null);
 assert.equal(state.data.coins,36);
 state.data.day=4;state.data.plazaActivities.days.push(4);
 assert.deepEqual(system.claim('move'),{coins:16,stars:2});
});
test('festival mission only pays after real community help',()=>{
 const state=setup(),system=new MayorMissionSystem(state);
 assert.equal(system.claim('festival'),null);
 state.data.festival.communityDays.push(3);
 assert.deepEqual(system.claim('festival'),{coins:24,stars:3});
 assert.equal(system.claim('festival'),null);
});
