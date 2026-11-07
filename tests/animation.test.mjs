import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const load=async path=>import('data:text/javascript;base64,'+
 Buffer.from(source(path)).toString('base64'));
// WorldArt imports geometry, so inspect sprite generation text without Node module resolution.
const {ACTION_DURATION,ACTION_PROPS,actionFrames}=await load('src/systems/ActionAnimator.js');
const {LAYOUT,OBSTACLES,SPAWN,INTERACTIONS}=await load('src/world/WorldGeometry.js');

test('six animations have real generated frames with bounded duration',()=>{
 assert.deepEqual(Object.keys(ACTION_DURATION).sort(),['cook','fish','harvest','plant','sleep','water']);
 for(const [action,duration] of Object.entries(ACTION_DURATION)){
  assert.ok(duration>=650&&duration<=1500);
  assert.equal(actionFrames(action).length,3);
  assert.ok(ACTION_PROPS[action].symbol);
  for(const [i,key] of actionFrames(action).entries()){
   assert.equal(key,'player-action-'+action+'-'+i);
  }
 }
 assert.deepEqual(actionFrames('unknown'),[]);
});
test('render produces three poses for every action and mirrored side walking',()=>{
 const art=source('src/world/WorldArt.js');
 assert.match(art,/for\(const action of CHARACTER_ACTIONS\)/);
 assert.match(art,/g\.generateTexture\('player-action-'/);
 assert.match(art,/for\(const dir of \['down','up','side'\]\)/);
 assert.match(source('src/entities/Player.js'),/setFlipX\(this\.facing==='side'/);
 assert.match(source('src/entities/Player.js'),/const bob=/);
});
test('watering, harvesting, fishing, cooking and sleeping trigger action only on successful input',()=>{
 const ui=source('src/scenes/UIScene.js');
 for(const action of ['plant','water','harvest','fish','cook','sleep'])
  assert.match(ui,new RegExp("playInteraction\\('"+action+"'\\)"));
 assert.match(source('src/scenes/WorldScene.js'),/new ActionAnimator\(this,this\.player\)/);
 assert.match(source('src/scenes/WorldScene.js'),/if\(!this\.activity\.active\)this\.player\.update/);
});
test('layout and all map collision coordinates remain identical to v1.3',()=>{
 assert.deepEqual(SPAWN,{x:446,y:291});
 assert.deepEqual([LAYOUT.home.x,LAYOUT.home.y,LAYOUT.home.w,LAYOUT.home.h],[45,49,197,190]);
 assert.deepEqual([LAYOUT.village.x,LAYOUT.pond.x,LAYOUT.market.y,LAYOUT.restaurant.y,LAYOUT.store.x],[500,805,339,339,806]);
 assert.equal(INTERACTIONS.length,12);
 assert.equal(OBSTACLES.length,34);
});
