import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=async path=>import('data:text/javascript;base64,'+Buffer.from(
 readFileSync(new URL('../'+path,import.meta.url),'utf8')).toString('base64'));
const {HomeDecorSystem,DECOR_SLOTS,DECOR_ITEMS,normalizeDecor}=await load('src/systems/HomeDecorSystem.js');
const {RestaurantOrderSystem,RESTAURANT_ORDERS,orderForDay,normalizeRestaurant}=await load('src/systems/RestaurantOrderSystem.js');
const {GameState,SAVE_KEY}=await load('src/systems/GameState.js');
const {LAYOUT,OBSTACLES,INTERACTIONS,canStand}=await load('src/world/WorldGeometry.js');
const {WORK_ROUTES}=await load('src/world/NpcWorkRoutes.js');
const db=new Map();
globalThis.localStorage={getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)};
const fresh=()=>{db.clear();const state=new GameState();return state;};
test('new systems preserve v1.8 save, inventory, library, shelters and layout',()=>{
 db.clear();db.set(SAVE_KEY,JSON.stringify({day:3,coins:85,inventory:{wortel:2},
  social:{friends:{rani:{hearts:3,lastTalkDay:2}}},missions:{claimed:['learn']},learning:{stars:7}}));
 const state=new GameState();new HomeDecorSystem(state);new RestaurantOrderSystem(state);
 assert.equal(state.data.coins,85);assert.equal(state.data.inventory.wortel,2);
 assert.equal(state.data.social.friends.rani.hearts,3);
 assert.equal(state.data.learning.stars,7);
 assert.deepEqual([LAYOUT.home.x,LAYOUT.village.x,LAYOUT.store.x,LAYOUT.store.y],[45,500,806,339]);
 assert.ok(OBSTACLES.length>=34,'original walls retained alongside coastal obstacles');
 assert.ok(INTERACTIONS.length>=15,'original interactions retained alongside new zones');
 assert.ok(INTERACTIONS.some(x=>x.id==='restaurant-kitchen'));
});
test('furniture purchase is once per item and never allows negative coins or free items',()=>{
 const state=fresh(),decor=new HomeDecorSystem(state);
 assert.equal(decor.buy('invalid'),false);
 assert.equal(decor.place('corner','plant'),false);
 assert.equal(decor.buy('plant'),true);
 assert.equal(state.data.coins,100-DECOR_ITEMS.plant.price);
 assert.equal(decor.buy('plant'),false);
 assert.equal(decor.place('corner','plant'),true);
 assert.equal(decor.place('window','plant'),false);
 assert.equal(decor.place('window','invalid'),false);
 assert.equal(decor.place('corner',null),true);
 assert.equal(decor.place('window','plant'),true);
 assert.equal(decor.data.slots.window,'plant');
 assert.equal(decor.view().length,3);
 assert.ok(DECOR_SLOTS.every(s=>s.x>=LAYOUT.home.x&&s.x<=LAYOUT.home.x+LAYOUT.home.w));
});
test('decor migration normalizes bogus slots, duplicates, and reset',()=>{
 const state=fresh(),decor=new HomeDecorSystem(state);
 const bad=normalizeDecor({owned:['plant','plant','bad'],slots:{corner:'plant',window:'plant',desk:'bad'}});
 assert.deepEqual(bad.owned,['plant']);
 assert.equal(bad.slots.corner,'plant');assert.equal(bad.slots.window,null);
 decor.buy('books');decor.place('desk','books');
 const reload=new GameState(),restored=new HomeDecorSystem(reload);
 assert.equal(restored.data.slots.desk,'books');
 reload.reset();
 assert.equal(restored.data.slots.desk,null);
});
test('customer orders rotate by day, and delivery only pays after matching cooking',()=>{
 const state=fresh(),restaurant=new RestaurantOrderSystem(state);
 assert.equal(RESTAURANT_ORDERS.length,4);
 assert.equal(restaurant.order.recipe,'sup-wortel-tomat');
 assert.equal(restaurant.serve(),null);
 assert.equal(restaurant.onCook('tumis-kangkung'),false);
 assert.equal(restaurant.onCook('sup-wortel-tomat'),true);
 assert.equal(restaurant.onCook('sup-wortel-tomat'),false);
 const before=state.data.coins;
 const receipt=restaurant.serve();
 assert.deepEqual([receipt.coins,receipt.stars],[32,2]);
 assert.equal(state.data.coins,before+32);
 assert.equal(restaurant.serve(),null);
 assert.equal(restaurant.onCook('sup-wortel-tomat'),false);
 assert.equal(restaurant.status.completed,1);
 state.data.day=2;
 assert.equal(restaurant.order.recipe,'tumis-kangkung');
 assert.equal(restaurant.status.prepared,false);
 assert.equal(restaurant.status.served,false);
 assert.equal(restaurant.status.completed,1);
 assert.equal(restaurant.onCook(restaurant.order.recipe),true);
 assert.equal(restaurant.serve().coins,36);
});
test('prepared dishes and served status persist safely; new day rejects old dish',()=>{
 const state=fresh(),orders=new RestaurantOrderSystem(state);
 orders.onCook(orders.order.recipe);
 const reload=new GameState(),again=new RestaurantOrderSystem(reload);
 assert.equal(again.status.prepared,true);
 reload.data.day=2;
 assert.equal(again.status.prepared,false);
 assert.equal(again.serve(),null);
 assert.equal(normalizeRestaurant({day:2,prepared:'wrong',served:false,completed:-1},2).prepared,null);
});
test('NPC job paths do not cross walls, tables or the pond',()=>{
 const isClearSegment=(a,b)=>{
  const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/4));
  for(let i=0;i<=steps;i++){
   const x=a.x+(b.x-a.x)*i/steps,y=a.y+(b.y-a.y)*i/steps;
   assert.ok(canStand(x,y),`NPC went through collision at ${x.toFixed(1)},${y.toFixed(1)}`);
  }
 };
 for(const [id,phases] of Object.entries(WORK_ROUTES)){
  for(const route of phases){
   for(let i=1;i<route.length;i++)isClearSegment(route[i-1],route[i]);
   if(route!==phases[3])isClearSegment(route.at(-1),route[0]);
  }
 }
});
test('NPC schedules have four phases, unique workstation pauses and safe endpoints',()=>{
 assert.deepEqual(Object.keys(WORK_ROUTES).sort(),['chef','nia','rani','sari','tani']);
 for(const [id,phases] of Object.entries(WORK_ROUTES)){
  assert.equal(phases.length,4,id);
  for(const route of phases){
   assert.ok(route.length>=2,id);
   assert.ok(route.some(p=>p.activity&&p.pause>0),id+' must work at a waypoint');
   for(const p of route)assert.equal(canStand(p.x,p.y),true,id+' blocked at '+p.x+','+p.y);
  }
 }
});
