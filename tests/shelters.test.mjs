import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=async path=>import('data:text/javascript;base64,'+
 Buffer.from(readFileSync(new URL('../'+path,import.meta.url),'utf8')).toString('base64'));
const {canStand,LAYOUT,DOORS,OBSTACLES,INTERACTIONS}=await load('src/world/WorldGeometry.js');
const {rainyRoute,dryReturnRoute,isInsideShelter,SHELTER_DESTINATIONS}=await load('src/world/ShelterRoutes.js');

function segmentIsWalkable(a,b,name){
 const steps=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3);
 for(let i=0;i<=steps;i++){
  const k=i/Math.max(1,steps),x=a.x+(b.x-a.x)*k,y=a.y+(b.y-a.y)*k;
  assert.ok(canStand(x,y,OBSTACLES),name+' crossed a wall at '+x.toFixed(1)+','+y.toFixed(1));
 }
}
test('family home replaces shop in exact original lower-right block with original door',()=>{
 assert.deepEqual([LAYOUT.store.x,LAYOUT.store.y,LAYOUT.store.w,LAYOUT.store.h],[806,339,126,206]);
 assert.deepEqual(DOORS.store,{x:869,y:339});
 assert.equal(INTERACTIONS.find(z=>z.id==='store').label,'Rumah Pak Tani & Bu Sari');
 assert.equal(OBSTACLES.length,34);
 assert.ok(canStand(869,373));
 assert.ok(canStand(851,461));
 assert.ok(canStand(891,461));
 assert.equal(canStand(832,416),false,'new family bed blocks player');
});
test('Pak Tani and Bu Sari follow street and pass through family house front door',()=>{
 for(const [id,start] of [['sari',{x:448,y:281}],['tani',{x:403,y:189}]]){
  const path=rainyRoute(id);
  assert.ok(path.length>=6);
  assert.ok(path.some(p=>p.x===DOORS.store.x&&p.y>=339));
  const route=[start,...path];
  for(let i=1;i<route.length;i++)segmentIsWalkable(route[i-1],route[i],id+' rain');
  assert.ok(isInsideShelter(id,route.at(-1)),id+' must finish inside home');
  assert.equal(SHELTER_DESTINATIONS[id].building,'store');
 }
});
test('Nia walks into the traditional market from its existing top entrance',()=>{
 const route=[{x:405,y:317},...rainyRoute('nia')];
 for(let i=1;i<route.length;i++)segmentIsWalkable(route[i-1],route[i],'nia rain');
 assert.ok(route.some(p=>p.x===DOORS.market.x&&p.y>DOORS.market.y));
 assert.ok(isInsideShelter('nia',route.at(-1)));
 assert.equal(SHELTER_DESTINATIONS.nia.building,'market');
});
test('dry-weather home exits follow the existing door, without crossing furniture',()=>{
 for(const id of ['sari','tani','nia']){
  const home=SHELTER_DESTINATIONS[id];
  const path=[home,...dryReturnRoute(id,home)];
  for(let i=1;i<path.length;i++)segmentIsWalkable(path[i-1],path[i],id+' dry');
  assert.ok(!isInsideShelter(id,path.at(-1)));
 }
});
test('original six blocks and non-store interactions remain untouched',()=>{
 assert.deepEqual([LAYOUT.home.x,LAYOUT.village.x,LAYOUT.pond.x,LAYOUT.market.y,LAYOUT.restaurant.y],
  [45,500,805,339,339]);
 for(const id of ['bed','stove','market','npc','chef','garden','coop','pond','village','tani','nia','library','rani'])
  assert.ok(INTERACTIONS.some(z=>z.id===id));
 assert.equal(INTERACTIONS.length,15);
});
