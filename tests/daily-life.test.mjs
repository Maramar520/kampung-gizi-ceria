import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=async path=>import('data:text/javascript;base64,'+Buffer.from(readFileSync(new URL('../'+path,import.meta.url),'utf8')).toString('base64'));
const {DailyLifeSystem,normalizeActivities,dailyStatus}=await load('src/systems/DailyLifeSystem.js');
const {CookingSystem,RECIPES}=await load('src/systems/CookingSystem.js');
const {INTERACTIONS,canStand,SPAWN,OBSTACLES}=await load('src/world/WorldGeometry.js');
const createState=()=>({data:{day:1,coins:100,inventory:{},carb:40,protein:30,vitamin:25,energy:80,recipesKnown:{'ikan-tomat':true},activities:{coop:{lastCollectedDay:0,fedDay:0},pond:{lastFishedDay:0,casts:0}}},save(){}});
test('old saves gain safe chicken and pond defaults',()=>{
 const a=normalizeActivities();
 assert.equal(a.coop.fedDay,0);assert.equal(a.pond.casts,0);
 assert.equal(normalizeActivities({pond:{casts:200}}).pond.casts,2);
 assert.equal(dailyStatus({day:1,activities:null}).fishReady,true);
});
test('feeding chickens costs 3 coins and produces only two eggs per day',()=>{
 const state=createState(),life=new DailyLifeSystem(state);
 assert.equal(life.collectEggs(),false);
 assert.equal(life.feed(),true);
 assert.equal(state.data.coins,97);
 assert.equal(life.feed(),false);
 assert.equal(life.collectEggs(),true);
 assert.equal(state.data.inventory.telur,2);
 assert.equal(life.collectEggs(),false);
 state.data.day=2;
 assert.equal(life.feed(),true);
 assert.equal(life.collectEggs(),true);
 assert.equal(state.data.inventory.telur,4);
});
test('fishing requires three casts and is capped to one fish per day',()=>{
 const state=createState(),life=new DailyLifeSystem(state);
 assert.equal(life.cast().success,false);
 assert.equal(life.cast().success,false);
 assert.equal(life.cast().success,true);
 assert.equal(state.data.inventory.ikan,1);
 assert.equal(life.cast().success,false);
 state.data.day=2;
 for(let n=0;n<3;n++)life.cast();
 assert.equal(state.data.inventory.ikan,2);
});
test('caught fish can be used in a recipe without completing original quest',()=>{
 const state=createState(),life=new DailyLifeSystem(state),cooking=new CookingSystem(state);
 for(let n=0;n<3;n++)life.cast();
 state.data.inventory.tomat=1;
 assert.deepEqual(RECIPES['ikan-tomat'].ingredients,['ikan','tomat']);
 assert.equal(cooking.finishRecipe('ikan-tomat'),true);
 assert.equal(state.data.inventory.ikan,0);
 assert.equal(state.data.inventory.tomat,0);
 assert.equal(state.data.protein,52);
 assert.notEqual(state.data.cooked,true);
});
test('coop and pond interaction positions are reachable without stepping onto water',()=>{
 const step=5,queue=[[SPAWN.x,SPAWN.y]],seen=new Set([SPAWN.x+','+SPAWN.y]),hits=new Set();
 let offset=0;
 while(offset<queue.length&&hits.size<2){
  const [x,y]=queue[offset++];
  for(const z of INTERACTIONS.filter(z=>z.id==='coop'||z.id==='pond')){
   if(Math.hypot(x-z.x,y-z.y)<z.r)hits.add(z.id);
  }
  for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
   const nx=x+dx,ny=y+dy,k=nx+','+ny;
   if(!seen.has(k)&&canStand(nx,ny,OBSTACLES)){seen.add(k);queue.push([nx,ny]);}
  }
 }
 assert.deepEqual([...hits].sort(),['coop','pond']);
 assert.equal(canStand(750,545),false);
 assert.equal(canStand(780,495),true);
});
