// node --test tests/v119-life.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {canStand,nearestInteraction,INTERACTIONS} from '../src/world/WorldGeometry.js';
import {CoastSystem} from '../src/systems/CoastSystem.js';
import {FriendEvents,birthdayToday} from '../src/systems/FriendEvents.js';
import {SocialSystem} from '../src/systems/SocialSystem.js';
import {SAVE_KEY} from '../src/systems/GameState.js';

test('save key unchanged and old friendship survives new social features',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 const state={data:{day:4,coins:5,inventory:{apel:1},social:{friends:{sari:{hearts:2,lastTalkDay:2}}}},save(){}};
 const social=new SocialSystem(state),events=new FriendEvents(state);
 assert.equal(social.profile('sari').hearts,2);
 assert.equal(birthdayToday('sari',4),true);
 assert.equal(events.gift('sari','apel',social).ok,true);
 assert.equal(social.profile('sari').hearts,4);
 assert.equal(events.gift('sari','apel',social).ok,false);
 assert.equal(state.data.inventory.apel,0);
 assert.equal(state.data.coins,5);
});
test('island treasure can only be claimed once per day',()=>{
 const state={data:{day:1,coins:0,inventory:{}},save(){}};
 const coast=new CoastSystem(state);
 assert.equal(coast.treasure(),true);
 assert.equal(coast.treasure(),false);
 assert.equal(state.data.coins,8);
 state.data.day=2;
 assert.equal(coast.treasure(),true);
 assert.equal(state.data.coins,16);
});
test('beach and dock reachable, water blocked, boat and island interactive',()=>{
 for(const y of [560,600,650,690,710,760,800])assert.equal(canStand(760,y),true,'y='+y);
 assert.equal(canStand(990,770),false);
 assert.equal(canStand(1100,770),true);
 assert.equal(nearestInteraction({x:761,y:707},INTERACTIONS).id,'boat');
 assert.equal(nearestInteraction({x:1100,y:775},INTERACTIONS).id,'island');
});

test('main road stays walkable through the beach and pier connection',()=>{
 for(let y=540;y<=795;y+=5)assert.equal(canStand(760,y),true,'main beach access blocked at y='+y);
});
