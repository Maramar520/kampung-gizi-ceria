// Run: node --test tests/v120-regression.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {canStand} from '../src/world/WorldGeometry.js';
import {FRIEND_IDS} from '../src/systems/SocialSystem.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
import {restaurantPathClear,RESTAURANT_ENTRY,RESTAURANT_EXIT} from '../src/systems/RestaurantCustomer.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const routeClear=points=>points.every((point,i)=>{
 if(!i)return canStand(point.x,point.y);
 const prev=points[i-1],n=Math.max(1,Math.ceil(Math.hypot(point.x-prev.x,point.y-prev.y)/2));
 return Array.from({length:n+1},(_,j)=>canStand(prev.x+(point.x-prev.x)*j/n,prev.y+(point.y-prev.y)*j/n)).every(Boolean);
});
test('original save and resident-only friends preserved',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 assert.equal(FRIEND_IDS.includes('riko'),false);
 assert.equal(FRIEND_IDS.length,8);
});
test('beach visitors walk from beach through legal doors to shelters',()=>{
 assert.equal(routeClear([{x:430,y:652},{x:430,y:585},{x:448,y:585},{x:448,y:319},{x:211,y:319},{x:211,y:355}]),true);
 assert.equal(routeClear([{x:955,y:662},{x:955,y:585},{x:760,y:585},{x:760,y:319},{x:869,y:319},{x:869,y:355}]),true);
 assert.equal(routeClear([{x:1120,y:778},{x:1080,y:775},{x:1060,y:786}]),true);
});
test('restaurant path avoids furniture and visitor remains seated while eating',()=>{
 assert.equal(restaurantPathClear([{x:607,y:281},...RESTAURANT_ENTRY]),true);
 assert.equal(restaurantPathClear([{x:690,y:476},...RESTAURANT_EXIT]),true);
 const code=read('src/systems/RestaurantCustomer.js');
 assert.match(code,/if\(!\['ordering','eating','paying'\]\.includes\(this\.stage\)\)this\.npc\.update\(dt\)/);
});
test('mobile action, birthday calendar and NPC route updates remain wired',()=>{
 const ui=read('src/scenes/UIScene.js'),world=read('src/scenes/WorldScene.js');
 assert.match(ui,/\$\('action'\)\.onclick=\(\)=>this\.action\(\)/);
 assert.match(ui,/birthdayCalendarMenu\(\)/);
 assert.match(world,/this\.beachVisitors\.forEach/);
 assert.match(world,/visitor\.walkable=/);
});
