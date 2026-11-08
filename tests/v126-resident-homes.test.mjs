import test from 'node:test';
import assert from 'node:assert/strict';
import {residentHomeRoute,residentLeaveHomeRoute,residentHomeActivity,homePosition} from '../src/world/ResidentHomeRoutes.js';
import {canStand,SPAWN,WORLD_WIDTH} from '../src/world/WorldGeometry.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
test('each resident has a reachable home with a clear door and main road',()=>{
 for(const id of ['nia','arif','lina']){
  const h=homePosition(id);
  assert.ok(canStand(h.x,h.y),'interior '+id);
  assert.ok(canStand(h.x,220),'door '+id);
  assert.ok(canStand(h.x,281),'road '+id);
  const route=residentHomeRoute(id,{x:1155,y:450});
  assert.deepEqual(route.at(-1).x,h.x);
  assert.deepEqual(route.at(-1).y,h.y);
  assert.equal(route.at(-1).activity,'💤 Tidur');
  assert.equal(residentLeaveHomeRoute(id).at(-1).x,1155);
  assert.equal(residentHomeActivity(id,3,false),'💤 Tidur');
  assert.notEqual(residentHomeActivity(id,1,true),'💤 Tidur');
 }
});
test('old map, coast road, and save key stay compatible',()=>{
 assert.equal(WORLD_WIDTH,1720);
 assert.ok(canStand(SPAWN.x,SPAWN.y));
 assert.ok(canStand(760,600));
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
});
