import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=async p=>import('data:text/javascript;base64,'+Buffer.from(readFileSync(new URL('../'+p,import.meta.url),'utf8')).toString('base64'));
const {FestivalSystem,isFestivalDay,nextFestivalDay,featuredCrop,normalizeFestival}=await load('src/systems/FestivalSystem.js');
const {GardenSystem,CROPS,CROP_IDS,normalizeGarden,plotStage}=await load('src/systems/GardenSystem.js');
const {GameState,SAVE_KEY}=await load('src/systems/GameState.js');
const {rainyRoute,dryReturnRoute,isInsideShelter}=await load('src/world/ShelterRoutes.js');
const {LAYOUT,OBSTACLES,canStand}=await load('src/world/WorldGeometry.js');
const db=new Map();globalThis.localStorage={getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)};
const fresh=()=>{db.clear();const s=new GameState();return s;};
test('festival every four game days with preview of next date',()=>{
 assert.equal(isFestivalDay(1),false);assert.equal(isFestivalDay(3),true);
 assert.equal(isFestivalDay(7),true);assert.equal(isFestivalDay(11),true);
 assert.equal(isFestivalDay(5),false);
 assert.equal(nextFestivalDay(1),3);assert.equal(nextFestivalDay(3),3);
 assert.equal(nextFestivalDay(4),7);
 assert.equal(new Set(Array.from({length:7},(_,i)=>featuredCrop(i+1))).size,7);
});
test('festival registration, answer and reward are protected from repeat claims',()=>{
 const s=fresh(),f=new FestivalSystem(s),start=s.data.coins;
 assert.equal(f.join(),false);assert.equal(f.celebrate(),null);
 s.data.day=3;assert.equal(f.active,true);
 assert.equal(f.quiz(f.question.correct),false,'must register');
 assert.equal(f.join(),true);assert.equal(f.join(),false);
 assert.equal(f.quiz((f.question.correct+1)%3),false,'wrong answer is not rewarded');
 assert.equal(f.quiz(f.question.correct),true);
 const reward=f.celebrate();assert.deepEqual(reward,{coins:35,stars:4});
 assert.equal(s.data.coins,start+35);
 assert.equal(f.celebrate(),null);assert.equal(f.quiz(f.question.correct),false);
 assert.equal(f.data.celebratedDays.filter(x=>x===3).length,1);
 s.data.day=7;assert.equal(f.join(),true);
 assert.equal(f.quiz(f.question.correct),true);
 assert.ok(f.celebrate());
 assert.equal(f.data.celebratedDays.length,2);
});
test('daily chosen crop harvest bonus once per in-game day',()=>{
 const s=fresh(),f=new FestivalSystem(s),id=f.featured;
 assert.equal(f.harvest('invalid'),null);
 assert.deepEqual(f.harvest(id),{coins:9,stars:1});
 assert.equal(f.harvest(id),null);
 s.data.day=2;assert.deepEqual(f.harvest(f.featured),{coins:9,stars:1});
 assert.equal(f.data.harvestBonusCount,2);
});
test('three new vegetables work without changing three existing plot locations',()=>{
 const s=fresh(),garden=new GardenSystem(s);
 assert.deepEqual(['selada','brokoli','labu'].map(id=>CROPS[id].days),[1,2,3]);
 assert.equal(CROP_IDS.length,7);
 assert.equal(garden.view.plots.length,3);
 const ids=['selada','brokoli','labu'];
 for(let i=0;i<3;i++)assert.equal(garden.plant(i,ids[i]),true);
 for(let i=0;i<3;i++)assert.equal(garden.water(i),true);
 s.data.day=2;assert.equal(garden.view.plots[0].stage,'ready');
 assert.equal(garden.view.plots[1].stage,'growing');
 assert.equal(garden.harvest(0),true);
 assert.equal(s.data.inventory.selada,2);
 s.data.day=3;assert.equal(garden.view.plots[1].stage,'ready');
 assert.equal(garden.harvest(1),true);assert.equal(s.data.inventory.brokoli,3);
 s.data.day=4;assert.equal(garden.view.plots[2].stage,'ready');
 assert.equal(garden.harvest(2),true);assert.equal(s.data.inventory.labu,3);
 assert.ok(OBSTACLES.length>=34,'original walls retained alongside coastal obstacles');
 assert.deepEqual([LAYOUT.garden.x,LAYOUT.garden.y,LAYOUT.garden.w,LAYOUT.garden.h],[258,59,131,79]);
});
test('old saved farms and all v1.9 progress migrate with festival state intact',()=>{
 db.clear();db.set(SAVE_KEY,JSON.stringify({day:6,coins:40,garden:{seeds:2,seedsByCrop:{bayam:2,wortel:1,tomat:2,kangkung:3},plots:[{crop:'wortel',plantedDay:5,watered:true},null,null]},
  decor:{owned:['plant'],slots:{corner:'plant'}},restaurant:{day:6,served:true,completed:2},
  learning:{stars:9},social:{friends:{nia:{hearts:4,lastTalkDay:5}}}}));
 const s=new GameState(),garden=new GardenSystem(s),f=new FestivalSystem(s);
 assert.equal(s.data.coins,40);assert.equal(s.data.decor.slots.corner,'plant');
 assert.equal(s.data.restaurant.completed,2);assert.equal(s.data.learning.stars,9);
 assert.equal(s.data.social.friends.nia.hearts,4);
 assert.equal(garden.view.plots[0].crop,'wortel');
 assert.equal(garden.view.seedsByCrop.kangkung,3);
 assert.ok(garden.view.seedsByCrop.brokoli>=0);
 assert.equal(f.status.next,7);assert.equal(f.status.joined,false);
 assert.equal(f.data.harvestBonusDay,0);
 s.reset();assert.equal(f.data.celebratedDays.length,0);
});
test('Nia night route ends inside market, and exit follows market door',()=>{
 const path=rainyRoute('nia');assert.ok(isInsideShelter('nia',path.at(-1)));
 const start={x:405,y:317};
 const route=[start,...path];
 for(let i=1;i<route.length;i++){
  const a=route[i-1],b=route[i],count=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3);
  for(let j=0;j<=count;j++){
   const x=a.x+(b.x-a.x)*j/count,y=a.y+(b.y-a.y)*j/count;
   assert.ok(canStand(x,y),`Nia crossed wall at ${x},${y}`);
  }
 }
 const exit=dryReturnRoute('nia',path.at(-1));
 assert.ok(exit.at(-1).y<339);
 const scene=readFileSync(new URL('../src/scenes/WorldScene.js',import.meta.url),'utf8');
 assert.match(scene,/niaSheltering=raining\|\|phase===3/);
 assert.match(scene,/if\(phase===3\)/);
 assert.match(scene,/setRoutine\(\[\.\.\.prefix,\.\.\.rainyRoute\('nia'\)\]/);
});
