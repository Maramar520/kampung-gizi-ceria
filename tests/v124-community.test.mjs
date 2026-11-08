import test from 'node:test';
import assert from 'node:assert/strict';
import {isWeekend,weekendEvent,WeekendVillageSystem} from '../src/systems/WeekendVillageSystem.js';
import {dialogueFor} from '../src/systems/SocialSystem.js';
import {restaurantPathClear,RESTAURANT_ENTRY,RESTAURANT_EXIT} from '../src/systems/RestaurantCustomer.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
test('weekend events rotate and reward only once per day',()=>{
 assert.equal(isWeekend(5),false);assert.equal(isWeekend(6),true);assert.equal(isWeekend(7),true);
 assert.notEqual(weekendEvent(6).id,weekendEvent(13).id);
 const state={data:{day:6,coins:10,learning:{stars:0}},save(){this.saved=(this.saved||0)+1;}};
 const system=new WeekendVillageSystem(state);
 const event=system.join();assert.ok(event);assert.equal(state.data.coins,10+event.coins);
 assert.equal(system.join(),null);assert.equal(state.saved,1);
 state.data.day=7;assert.ok(system.join());
 const reload=new WeekendVillageSystem(state);assert.equal(reload.completed,true);
});
test('dialogue changes with weather and friendship without losing normal dialogue',()=>{
 assert.match(dialogueFor('rani',1,0,'Hujan'),/hujan|Cuaca/i);
 assert.match(dialogueFor('chef',1,0,'Cerah',4),/akrab/);
 assert.match(dialogueFor('nia',1,3,'Cerah'),/malam/i);
});
test('existing restaurant route and save key remain',()=>{
 assert.equal(restaurantPathClear(RESTAURANT_ENTRY),true);
 assert.equal(restaurantPathClear(RESTAURANT_EXIT),true);
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
});
