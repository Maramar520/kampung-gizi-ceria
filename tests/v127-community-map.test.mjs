import test from 'node:test';import assert from 'node:assert/strict';
import {socialEvent,CommunitySocialSystem} from '../src/systems/CommunitySocialSystem.js';
import {MAP_PLACES,mapScale} from '../src/ui/VillageMiniMap.js';
import {WORLD_WIDTH,WORLD_HEIGHT,SPAWN,canStand} from '../src/world/WorldGeometry.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
test('social events rotate, stop in rain/night and reward once daily',()=>{
 assert.equal(socialEvent(1,0,'Hujan'),null);assert.equal(socialEvent(1,3,'Cerah'),null);
 assert.notEqual(socialEvent(1,0,'Cerah').id,socialEvent(2,0,'Cerah').id);
 const state={data:{day:1,coins:0,learning:{stars:0},timeWeather:{phase:0,weather:'Cerah'}},save(){this.saves=(this.saves||0)+1;}};
 const sys=new CommunitySocialSystem(state);assert.ok(sys.join());assert.equal(sys.join(),null);
 assert.equal(state.saves,1);assert.equal(state.data.learning.stars,1);
});
test('birthday rewards cannot be collected twice and persist across loads',()=>{
 const state={data:{day:19,coins:0},save(){}};
 const sys=new CommunitySocialSystem(state);
 assert.equal(sys.birthdayReward('nia',(id,day)=>id==='nia'&&day===19),true);
 assert.equal(sys.birthdayReward('nia',(id,day)=>id==='nia'&&day===19),false);
 assert.equal(new CommunitySocialSystem(state).birthdayReward('nia',()=>true),false);
 assert.equal(state.data.coins,8);
});
test('mini map covers three eastern homes, main destinations and coast',()=>{
 for(const id of ['niaHome','arifHome','linaHome','beach','library','restaurant','plaza'])assert.ok(MAP_PLACES.some(p=>p.id===id));
 assert.deepEqual(mapScale(WORLD_WIDTH,WORLD_HEIGHT,344,170),{x:344,y:170});
 assert.ok(canStand(SPAWN.x,SPAWN.y));assert.ok(canStand(760,600));
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
});
