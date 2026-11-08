import test from 'node:test';
import assert from 'node:assert/strict';
import {LAYOUT,WORLD_WIDTH,SPAWN,canStand,INTERACTIONS,nearestInteraction} from '../src/world/WorldGeometry.js';
test('eastern expansion preserves original six-block footprints and save spawn',()=>{
 assert.equal(WORLD_WIDTH,1340);
 assert.deepEqual(SPAWN,{x:446,y:291});
 assert.deepEqual(LAYOUT.market,{x:39,y:339,w:354,h:206});
 assert.deepEqual(LAYOUT.restaurant,{x:500,y:339,w:214,h:206});
 assert.deepEqual(LAYOUT.store,{x:806,y:339,w:126,h:206});
});
test('east road, hall doorway and plaza can be walked to; walls stay solid',()=>{
 for(const p of [[980,281],[1155,281],[1155,238],[1155,208],[1155,395],[1204,180]])
  assert.equal(canStand(...p),true,'expected walkable '+p);
 assert.equal(canStand(1028,125),false);
 assert.equal(canStand(1085,117),false);
 assert.equal(canStand(1335,281),false);
});
test('plaza, mayor and town hall are interactive',()=>{
 for(const id of ['plaza','mayor','townHall'])assert.ok(INTERACTIONS.some(z=>z.id===id));
 assert.equal(nearestInteraction({x:1155,y:395})?.id,'plaza');
});
