import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/world/WorldGeometry.js',import.meta.url),'utf8');
const {canStand,nearestInteraction,INTERACTIONS,OBSTACLES,SPAWN,LAYOUT,DOORS}=await import(
 'data:text/javascript;base64,'+Buffer.from(source).toString('base64'));

function reachableFromSpawn(){
 const step=5,queue=[[SPAWN.x,SPAWN.y]],seen=new Set([SPAWN.x+','+SPAWN.y]);
 let i=0;
 while(i<queue.length){
  const [x,y]=queue[i++];
  for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
   const nx=x+dx,ny=y+dy,k=nx+','+ny;
   if(!seen.has(k)&&canStand(nx,ny,OBSTACLES)){seen.add(k);queue.push([nx,ny]);}
  }
 }
 return queue;
}
const nearby=(positions,point,radius=25)=>positions.some(([x,y])=>
 Math.hypot(x-point.x,y-point.y)<radius);
test('susunan denah SVG: rumah + kebun + ternak / warga / kolam, kemudian pasar / restoran / swalayan',()=>{
 assert.ok(LAYOUT.home.x<LAYOUT.garden.x);
 assert.ok(LAYOUT.garden.x<LAYOUT.village.x);
 assert.ok(LAYOUT.village.x<LAYOUT.pond.x);
 assert.ok(LAYOUT.market.x<LAYOUT.restaurant.x);
 assert.ok(LAYOUT.restaurant.x<LAYOUT.store.x);
 for(const id of ['home','village','pond'])assert.ok(LAYOUT[id].y<LAYOUT.roads.crossY);
 for(const id of ['market','restaurant','store'])assert.ok(LAYOUT[id].y>LAYOUT.roads.crossY);
 assert.ok(LAYOUT.garden.x>=LAYOUT.home.x+LAYOUT.home.w);
 assert.ok(LAYOUT.coop.x>=LAYOUT.home.x+LAYOUT.home.w);
});
test('spawn, jalan silang, dan furniture merupakan hitbox valid',()=>{
 assert.ok(canStand(SPAWN.x,SPAWN.y));
 assert.equal(canStand(90,133),false); // kasur
 assert.equal(canStand(195,125),false); // kompor
 assert.equal(canStand(859,140),false); // air kolam
 assert.equal(canStand(445,281),true); // jalan pusat
 assert.ok(canStand(DOORS.home.x,DOORS.home.y-7));
 assert.ok(canStand(DOORS.market.x,DOORS.market.y+9));
 assert.ok(canStand(DOORS.village.x,DOORS.village.y-6));
});
test('pintu rumah, rumah warga, pasar, restoran dan swalayan terhubung dengan jalan',()=>{
 const positions=reachableFromSpawn();
 for(const [id,target] of Object.entries(DOORS))
  assert.ok(nearby(positions,target,18),'Pintu '+id+' tak dapat dicapai dari jalan');
 // Bagian dalam bangunan bisa dilalui, bukan hanya depan pintu.
 for(const pos of [{x:137,y:187},{x:610,y:178},{x:211,y:373},{x:668,y:481},{x:893,y:449}])
  assert.ok(nearby(positions,pos,17),'Interior tak dapat dimasuki dekat '+JSON.stringify(pos));
});
test('semua 14 titik interaksi dapat dicapai tanpa menembus dinding dan air',()=>{
 const walkable=reachableFromSpawn();
 assert.equal(INTERACTIONS.length,14);
 for(const z of INTERACTIONS){
  assert.ok(nearby(walkable,z,z.r),'Zona '+z.id+' tidak dapat dicapai');
 }
});
test('pilih titik interaksi terdekat dan abaikan area yang terlalu jauh',()=>{
 assert.equal(nearestInteraction({x:448,y:281}).id,'npc');
 assert.equal(nearestInteraction({x:870,y:365}).id,'store');
 assert.equal(nearestInteraction({x:325,y:216}).id,'coop');
 assert.equal(nearestInteraction({x:680,y:575}),null);
});
