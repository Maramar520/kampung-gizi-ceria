import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SAVE_KEY} from '../src/systems/GameState.js';
import {LAYOUT} from '../src/world/WorldGeometry.js';
import {MayorMissionSystem} from '../src/systems/MayorMissionSystem.js';
import {RESTAURANT_ENTRY,RESTAURANT_EXIT,restaurantPathClear} from '../src/systems/RestaurantCustomer.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('old save and six-block map remain intact',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 assert.deepEqual([LAYOUT.home.x,LAYOUT.restaurant.x,LAYOUT.plaza.x],[45,500,1005]);
});
test('restaurant path avoids furniture in both directions',()=>{
 assert.ok(restaurantPathClear([{x:607,y:281},...RESTAURANT_ENTRY]));
 assert.ok(restaurantPathClear([{x:690,y:470},...RESTAURANT_EXIT]));
});
test('mayor farming and coop rewards can be claimed only once',()=>{
 const state={data:{day:2,coins:0,learning:{stars:0},garden:{plots:[{crop:'bayam',plantedDay:2,watered:true}]},activities:{coop:{fedDay:2}},plazaActivities:{days:[]},festival:{communityDays:[]}},save(){}};
 const missions=new MayorMissionSystem(state);
 for(const id of ['farm','coop']){
  assert.ok(missions.claim(id));assert.equal(missions.claim(id),null);
 }
 assert.equal(state.data.coins,24);
});
test('chickens shelter during rain and night',()=>{
 const art=read('src/world/FarmArt.js');
 assert.match(art,/shelter\.rain\|\|shelter\.night/);
});
test('no map or sidebar and touch controls retained',()=>{
 const html=read('index.html');
 assert.doesNotMatch(html,/<canvas id="minimap"/);
 assert.doesNotMatch(html,/<aside class="minimap-wrap"/);
 assert.match(html,/class="dpad"/);
 assert.match(html,/id="action"/);
});
test('festival remains exclusive to Alun-Alun',()=>{
 const ui=read('src/scenes/UIScene.js');
 assert.match(ui,/Bantu warga menghias Alun-Alun/);
 assert.doesNotMatch(ui,/menghias pasar/);
});
