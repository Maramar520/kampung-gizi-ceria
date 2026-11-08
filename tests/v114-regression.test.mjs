import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SAVE_KEY} from '../src/systems/GameState.js';
import {LAYOUT,DOORS} from '../src/world/WorldGeometry.js';
import {RestaurantOrderSystem} from '../src/systems/RestaurantOrderSystem.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('legacy save and map unchanged',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 assert.deepEqual([LAYOUT.restaurant.x,LAYOUT.restaurant.y,DOORS.restaurant.x,DOORS.restaurant.y],[500,339,607,339]);
});
test('restaurant payment only once',()=>{
 const state={data:{day:1,coins:10,learning:{stars:0},restaurant:{day:1,prepared:'sup-wortel-tomat',served:false,completed:0}},save(){}};
 const orders=new RestaurantOrderSystem(state);
 assert.equal(orders.serve().coins,32);
 assert.equal(orders.serve(),null);
 assert.equal(state.data.coins,42);
});
test('customer route and town hall board present',()=>{
 const npc=read('src/systems/RestaurantCustomer.js');
 assert.match(npc,/arriving/);assert.match(npc,/ordering/);assert.match(npc,/eating/);assert.match(npc,/leaving/);
 const ui=read('src/scenes/UIScene.js');
 assert.match(ui,/Papan Misi Kepala Desa/);
 assert.match(ui,/festivalMenu\(\)/);
 assert.doesNotMatch(ui,/menghias pasar/);
});
