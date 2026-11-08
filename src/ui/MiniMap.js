import {LAYOUT,WORLD_WIDTH,WORLD_HEIGHT} from '../world/WorldGeometry.js';
// Read-only overview: tapping highlights a place; no teleport or save mutations.
export class MiniMap{
 constructor(world){
  this.world=world;this.canvas=document.getElementById('minimap');
  this.ctx=this.canvas?.getContext('2d');
  this.locations=[{id:'home',x:145,y:145,name:'Rumah'},{id:'library',x:610,y:145,name:'Perpustakaan'},
   {id:'market',x:211,y:420,name:'Pasar'},{id:'restaurant',x:607,y:420,name:'Restoran'},
   {id:'store',x:869,y:420,name:'Rumah Tani'},{id:'townHall',x:1155,y:160,name:'Balai Kota'},
   {id:'plaza',x:1155,y:420,name:'Alun-Alun'}];
  this.canvas?.addEventListener('click',e=>{
   const r=this.canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*WORLD_WIDTH,
    y=(e.clientY-r.top)/r.height*WORLD_HEIGHT;
   const place=this.locations.reduce((a,b)=>Math.hypot(x-b.x,y-b.y)<Math.hypot(x-a.x,y-a.y)?b:a);
   if(!['plaza','townHall','library','coop','pond','festival'].includes(place.id)){
    // Pilihan lokasi lain tetap dapat dinavigasi lewat kamera tanpa marker.
   }else this.world.highlightPlace(place.id);
   const cam=this.world.cameras.main;
   cam.stopFollow();cam.centerOn(place.x,place.y);
   if(this.restoreCamera)this.restoreCamera.remove(false);
   this.restoreCamera=this.world.time.delayedCall(2300,()=>{
    if(cam.zoom>=.95)cam.startFollow(this.world.player.sprite,true,.12,.12);
    this.restoreCamera=null;
   });
  });
 }
 render(){
  if(!this.ctx)return;
  const c=this.ctx,w=this.canvas.width,h=this.canvas.height,sx=w/WORLD_WIDTH,sy=h/WORLD_HEIGHT;
  c.clearRect(0,0,w,h);c.fillStyle='#a6ce96';c.fillRect(0,0,w,h);
  c.fillStyle='#e6d5ac';c.fillRect(0,261*sy,w,49*sy);
  for(const x of [448,760])c.fillRect((x-17)*sx,0,34*sx,h);
  // Jalan timur bercabang dari jalan utama menuju Balai Kota dan Alun-Alun.
  c.fillRect(1134*sx,227*sy,42*sx,122*sy);
  const colors={home:'#f0d6b7',village:'#e7d7c4',market:'#e7b6a1',restaurant:'#efb68d',store:'#e7d1ae',townHall:'#c4d9e8',plaza:'#85b98b',garden:'#78a65e',coop:'#bc9773',pond:'#78b9d8'};
  for(const [name,color] of Object.entries(colors)){
   const b=LAYOUT[name];if(!b)continue;
   c.fillStyle=color;c.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);
   c.strokeStyle='#65876b';c.strokeRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);
  }
  c.font='bold 9px sans-serif';c.fillStyle='#354b3c';
  c.fillText('KAMPUNG LAMA',10,11);c.fillText('BALAI KOTA',207,12);c.fillText('ALUN-ALUN',206,112);
  const phase=this.world.clock?.phase??0,weather=this.world.clock?.weather;
  if(phase===3){c.fillStyle='rgba(19,38,76,.33)';c.fillRect(0,0,w,h);}
  else if(phase===2){c.fillStyle='rgba(235,137,96,.14)';c.fillRect(0,0,w,h);}
  if(weather==='Hujan'){c.fillStyle='rgba(61,106,151,.16)';c.fillRect(0,0,w,h);}
  const p=this.world.player.sprite;
  c.beginPath();c.arc(p.x*sx,p.y*sy,4,0,Math.PI*2);c.fillStyle='#2875e1';c.fill();
  c.lineWidth=1.5;c.strokeStyle='#ffffff';c.stroke();
 }
}
