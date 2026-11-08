// node --test tests/v118-coast.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {canStand,nearestInteraction,INTERACTIONS} from '../src/world/WorldGeometry.js';
import {CoastSystem,SEA_FISH} from '../src/systems/CoastSystem.js';

test('jalan lama terhubung ke pantai dan dermaga; laut dalam terhalang',()=>{
 for(const y of [550,580,600,650,690,710,760,800])assert.equal(canStand(760,y),true,'x=760 y='+y);
 assert.equal(canStand(1100,770),true,'pulau dapat dijelajahi');
 assert.equal(canStand(990,770),false,'laut tidak dapat dilalui');
 assert.equal(nearestInteraction({x:760,y:767},INTERACTIONS)?.id,'sea-fishing');
 assert.equal(nearestInteraction({x:1100,y:770},INTERACTIONS)?.id,'island');
});
test('memancing laut, koleksi, dan misi tidak menggandakan hadiah',()=>{
 const state={data:{day:1,inventory:{},coins:10},save(){}};
 const c=new CoastSystem(state);
 assert.equal(c.cast().success,false);assert.equal(c.cast().success,false);
 assert.equal(c.cast().success,true);assert.equal(c.cast().already,true);
 assert.equal(state.data.inventory.ikan,1);
 assert.equal(c.shell(),true);assert.equal(c.shell(),false);
 assert.equal(c.clean(),true);assert.equal(c.clean(),false);
 assert.equal(state.data.coins,22);
 state.data.day=7;
 c.cast();c.cast();assert.equal(c.cast().fish.id,SEA_FISH[2].id);
 assert.equal(c.claimFestival(),true);assert.equal(c.claimFestival(),false);
 assert.equal(state.data.coins,47);
});
test('data coast lama aman dan penyimpanan lain tidak terganggu',()=>{
 const state={data:{day:3,inventory:{telur:4},coins:5,coast:{casts:99,catches:['invalid','ikan-kakap']}},save(){}};
 const c=new CoastSystem(state);
 assert.equal(c.status.casts,2);
 assert.equal(c.status.collection.find(x=>x.id==='ikan-kakap').count,1);
 assert.equal(state.data.inventory.telur,4);
});
