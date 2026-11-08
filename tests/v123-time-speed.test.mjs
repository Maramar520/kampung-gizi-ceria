import test from 'node:test';
import assert from 'node:assert/strict';
import {TimeWeatherSystem,PHASE_SECONDS,normalizeTimeSpeed} from '../src/systems/TimeWeatherSystem.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
function clock(speed){const state={data:{day:1,timeSpeed:speed,garden:{plots:[]}},save(){}};return new TimeWeatherSystem(state,null);}
test('time speeds persist and affect phase progression',()=>{
 for(const speed of [1,2,4]){
  const c=clock(speed);assert.equal(c.speed,speed);
  for(let i=0;i<PHASE_SECONDS*1000/speed/100;i++)c.advance(100);
  assert.equal(c.phase,1,'speed '+speed);
  assert.equal(c.setSpeed(3),false);
  assert.equal(c.setSpeed(2),true);
  assert.equal(c.speed,2);
 }
 assert.equal(normalizeTimeSpeed(99),1);
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
});
test('night still waits for sleep',()=>{
 const c=clock(4);c.setPhase(3);for(let i=0;i<1000;i++)c.advance(1000);assert.equal(c.phase,3);
 c.state.data.day=2;c.advance(0);assert.equal(c.phase,0);assert.equal(c.speed,4);
});
