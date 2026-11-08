import test from 'node:test';
import assert from 'node:assert/strict';
import {LAYOUT,INTERACTIONS,canStand,WORLD_WIDTH,SPAWN} from '../src/world/WorldGeometry.js';
import {EAST_HOMES} from '../src/world/EastHomesArt.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
test('three separate homes are east of the existing six blocks and reachable from road',()=>{
 assert.equal(WORLD_WIDTH,1720);
 for(const id of ['nia','arif','lina']){
  const h=EAST_HOMES[id];
  assert.ok(h.x>1340);
  assert.ok(canStand(h.x+h.w/2,260));
  assert.ok(canStand(h.x+h.w/2,240));
  assert.ok(canStand(h.x+h.w/2,205));
  assert.ok(INTERACTIONS.some(z=>z.id===id+'Home'));
 }
 assert.ok(canStand(1340,281));
 assert.ok(canStand(760,600));
 assert.ok(canStand(SPAWN.x,SPAWN.y));
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
});
