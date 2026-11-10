import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
async function load(path){
 const src=readFileSync(new URL('../'+path,import.meta.url),'utf8');
 return import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
}
const {GameState,SAVE_KEY}=await load('src/systems/GameState.js');
const {MissionSystem,MISSION_DEFS,ACHIEVEMENTS,normalizeMissions}=await load('src/systems/MissionSystem.js');
const {canStand,LAYOUT,OBSTACLES,INTERACTIONS,SPAWN}=await load('src/world/WorldGeometry.js');
const db=new Map();
globalThis.localStorage={getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)};
const fresh=()=>{db.clear();const state=new GameState();return{state,mission:new MissionSystem(state)};};
test('ten daily tasks and ten one-off achievements',()=>{
 assert.deepEqual(MISSION_DEFS.map(x=>x.id),['plant','harvest','cook','friend','help','learn','plant-more','harvest-more','cook-more','friend-more']);
 assert.equal(ACHIEVEMENTS.length,10);
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size,10);
});
test('mission progress only increments when actual event is recorded; daily claim cannot be farmed',()=>{
 const {state,mission}=fresh(),coins=state.data.coins;
 assert.equal(mission.claim('plant'),null);
 assert.equal(mission.record('fake'),false);
 assert.equal(mission.record('plant'),true);
 assert.equal(mission.progress('plant'),1);
 const r=mission.claim('plant');
 assert.deepEqual(r,{stars:1,coins:8});
 assert.equal(state.data.coins,coins+8);
 assert.equal(state.data.learning.stars,1);
 assert.equal(mission.claim('plant'),null);
 mission.record('plant');
 assert.equal(mission.progress('plant'),1);
 assert.equal(mission.claim('plant'),null);
});
test('new day refreshes mission progress but keeps lifelong achievements',()=>{
 const {state,mission}=fresh();
 mission.record('harvest');mission.claim('harvest');
 mission.record('friend');mission.claim('friend');
 assert.ok(mission.claimAchievement('first-harvest'));
 assert.equal(mission.claimAchievement('first-harvest'),null);
 const dayOne=mission.daily();
 assert.equal(dayOne.find(x=>x.id==='harvest').claimed,true);
 state.data.day=2;
 assert.equal(mission.progress('harvest'),0);
 assert.equal(mission.data.claimed.length,0);
 assert.equal(mission.data.totals.harvest,1);
 assert.equal(mission.badges().find(x=>x.id==='first-harvest').earned,true);
 mission.record('harvest');
 assert.ok(mission.claim('harvest'));
});
test('achievement once only and cumulative five claimed missions unlock hero badge',()=>{
 const {state,mission}=fresh();
 for(const x of MISSION_DEFS.filter(x=>!x.event)){mission.record(x.id);assert.ok(mission.claim(x.id));}
 assert.equal(mission.data.totals.claimed,6);
 assert.equal(mission.badges().find(x=>x.id==='daily-hero').ready,true);
 const before=state.data.learning.stars;
 assert.ok(mission.claimAchievement('daily-hero'));
 assert.equal(state.data.learning.stars,before+5);
 assert.equal(mission.claimAchievement('daily-hero'),null);
 assert.equal(mission.claimAchievement('invalid'),null);
});
test('helping Kak Rani has its own mission and once-only badge',()=>{
 const {state,mission}=fresh();
 assert.equal(mission.claim('help'),null);
 assert.equal(mission.record('help'),true);
 assert.equal(mission.progress('help'),1);
 assert.ok(mission.claim('help'));
 assert.equal(mission.claim('help'),null);
 assert.ok(mission.claimAchievement('first-help'));
 assert.equal(mission.claimAchievement('first-help'),null);
 state.data.day++;
 assert.equal(mission.progress('help'),0);
 assert.equal(mission.badges().find(a=>a.id==='first-help').earned,true);
});
test('existing v1.7 save still loads and gains mission defaults without reset',()=>{
 db.clear();
 db.set(SAVE_KEY,JSON.stringify({day:4,coins:41,done:true,inventory:{bayam:3},
  learning:{stars:12,quiz:{completed:2,lastRewardDay:3},plate:{completed:1,lastRewardDay:3}},
  social:{friends:{nia:{hearts:2,lastTalkDay:3}}}}));
 const state=new GameState(),mission=new MissionSystem(state);
 assert.equal(state.data.day,4);
 assert.equal(state.data.coins,41);
 assert.equal(state.data.done,true);
 assert.equal(state.data.inventory.bayam,3);
 assert.equal(state.data.learning.stars,12);
 assert.equal(state.data.social.friends.nia.hearts,2);
 assert.equal(mission.data.day,4);
 mission.record('learn');mission.claim('learn');
 const loaded=new GameState(),restored=new MissionSystem(loaded);
 assert.equal(restored.data.claimed.includes('learn'),true);
 assert.equal(restored.progress('learn'),1);
 loaded.reset();
 assert.equal(restored.progress('learn'),0);
 assert.equal(restored.data.claimed.length,0);
 assert.equal(loaded.data.learning.stars,0);
});
test('malformed legacy mission state never creates invalid rewards',()=>{
 const normalized=normalizeMissions({day:2,progress:{plant:9},claimed:['plant','plant','bad'],
  totals:{cook:-7,claimed:4},achievements:['first-plant','not-real']},2);
 assert.equal(normalized.progress.plant,1);
 assert.deepEqual(normalized.claimed,['plant']);
 assert.equal(normalized.totals.cook,0);
 assert.deepEqual(normalized.achievements,['first-plant']);
 assert.equal(normalizeMissions({day:1,progress:{cook:1},claimed:['cook']},2).progress.cook,0);
});
test('library and librarian in existing house; original walls remain unchanged',()=>{
 assert.ok(OBSTACLES.length>=34,'original walls retained alongside coastal obstacles');
 assert.deepEqual([LAYOUT.home.x,LAYOUT.village.x,LAYOUT.school.x,LAYOUT.market.y,LAYOUT.restaurant.y,LAYOUT.store.x],
  [45,500,805,339,339,806]);
 assert.ok(INTERACTIONS.length>=15,'original interactions retained alongside new zones');
 assert.ok(INTERACTIONS.find(z=>z.id==='library'&&z.x>LAYOUT.village.x&&z.x<LAYOUT.village.x+LAYOUT.village.w));
 assert.equal(canStand(692,207),true);
 for(const [x,y] of [[692,186],[692,191],[692,197],[692,207],[692,209],[692,211],[692,213]])
  assert.equal(canStand(x,y),true,'Kak Rani route '+x+','+y);
 assert.equal(canStand(SPAWN.x,SPAWN.y),true);
});
