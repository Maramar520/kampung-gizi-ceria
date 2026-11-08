import test from 'node:test';
import assert from 'node:assert/strict';
import {CoastSystem} from '../src/systems/CoastSystem.js';
import {CoastExpeditionSystem} from '../src/systems/CoastExpeditionSystem.js';
import {SAVE_KEY} from '../src/systems/GameState.js';

test('v1.21 keeps old save key and legacy coast fields',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 const state={data:{day:1,coins:100,inventory:{},coast:{lastShellDay:0,lastCleanDay:0,catches:['ikan-kembung'],islandVisits:2}},save(){}};
 const coast=new CoastSystem(state),exp=new CoastExpeditionSystem(state,coast);
 assert.equal(exp.progress('island'),2);
 assert.equal(exp.progress('shell'),0);
 assert.equal(coast.shell(),true);
 assert.equal(coast.clean(),true);
 assert.equal(exp.progress('shell'),1);
 assert.equal(exp.progress('clean'),1);
 assert.equal(exp.claim('shell'),false);
 coast.visitIsland();
 assert.equal(exp.claim('island'),true);
 assert.equal(exp.claim('island'),false);
 assert.equal(state.data.coins,132);
 const saved=JSON.parse(JSON.stringify(state.data));
 const next={data:saved,save(){}};
 const restored=new CoastExpeditionSystem(next,new CoastSystem(next));
 assert.equal(restored.claim('island'),false);
 assert.equal(restored.badges.find(b=>b.id==='island').claimed,true);
});
test('v1.21 fishing badge rewards unique species only',()=>{
 const state={data:{day:1,coins:0,inventory:{},coast:{catches:['ikan-kembung','ikan-kembung','ikan-kakap']}},save(){}};
 const exp=new CoastExpeditionSystem(state,new CoastSystem(state));
 assert.equal(exp.progress('fish'),2);
 assert.equal(exp.claim('fish'),true);
 assert.equal(state.data.coins,25);
 assert.equal(exp.claim('fish'),false);
});
