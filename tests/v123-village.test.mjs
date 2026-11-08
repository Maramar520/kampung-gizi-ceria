import test from 'node:test';
import assert from 'node:assert/strict';
import {VillageLifeSystem,MARKET_GOODS,COMMUNITY_EVENTS} from '../src/systems/VillageLifeSystem.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
import {canStand} from '../src/world/WorldGeometry.js';
test('v1.23 daily market stock, discount, orders and persistence',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 const state={data:{day:1,coins:300,inventory:{},learning:{stars:0}},save(){this.saved=true;}};
 const life=new VillageLifeSystem(state),id=life.featured;
 assert.ok(life.price(id)<MARKET_GOODS[id]);
 const initial=life.stock(id);assert.ok(initial>0);
 assert.equal(life.buy(id),true);assert.equal(life.stock(id),initial-1);
 assert.equal(state.data.inventory[id],1);
 const order=life.order;state.data.inventory[order.id]=1;
 assert.equal(life.fulfill(),true);assert.equal(life.fulfill(),false);
 const event=life.todayEvent;assert.ok(COMMUNITY_EVENTS.includes(event));
 assert.equal(life.joinEvent(),true);assert.equal(life.joinEvent(),false);
 const restored={data:JSON.parse(JSON.stringify(state.data)),save(){}};
 const next=new VillageLifeSystem(restored);
 assert.equal(next.orderDone,true);assert.equal(next.eventDone,true);
 assert.equal(next.stock(id),initial-1);
 restored.data.day=2;assert.equal(next.orderDone,false);assert.equal(next.eventDone,false);
 assert.ok(next.stock(id)>0);
});
test('v1.23 preserves connected beach road',()=>{
 for(let y=540;y<=795;y+=5)assert.equal(canStand(760,y),true,'road blocked at '+y);
});
