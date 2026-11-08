import {LAYOUT,WORLD_WIDTH,WORLD_HEIGHT} from '../world/WorldGeometry.js?v=v127-minimap';
export const MAP_PLACES=Object.freeze([
 {id:'home',label:'Rumah Pemain',x:143,y:240,color:'#d37d7d'},
 {id:'garden',label:'Kebun',x:322,y:138,color:'#5d9b63'},
 {id:'library',label:'Perpustakaan',x:608,y:237,color:'#9a82c0'},
 {id:'market',label:'Pasar',x:211,y:319,color:'#d7a054'},
 {id:'restaurant',label:'Restoran',x:607,y:319,color:'#db857a'},
 {id:'plaza',label:'Alun-Alun',x:1155,y:345,color:'#6b9b8c'},
 {id:'niaHome',label:'Rumah Nia',x:1420,y:247,color:'#d783a0'},
 {id:'arifHome',label:'Rumah Arif',x:1530,y:247,color:'#79a26e'},
 {id:'linaHome',label:'Rumah Lina',x:1640,y:247,color:'#a08ac8'},
 {id:'beach',label:'Pantai',x:760,y:620,color:'#58a7c5'}
]);
export function mapScale(x,y,w,h){return {x:x/WORLD_WIDTH*w,y:y/WORLD_HEIGHT*h};}
export function createVillageMiniMap(canvas,world,onSelect){
 const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 const w=canvas.width,h=canvas.height;
 function draw(){
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#a8d29b';ctx.fillRect(0,0,w,h);
  const box=(x,y,bw,bh,color)=>{const p=mapScale(x,y,w,h);ctx.fillStyle=color;ctx.fillRect(p.x,p.y,bw/WORLD_WIDTH*w,bh/WORLD_HEIGHT*h);};
  box(0,600,1720,110,'#f3dba5');box(0,710,1720,140,'#6abdd2');
  box(0,261,1720,49,'#e6cfaa');box(736,0,49,700,'#e6cfaa');box(1135,0,40,600,'#e6cfaa');
  for(const [id,b] of Object.entries(LAYOUT)){
   if(!b||!('w'in b)||id==='roads')continue;
   box(b.x,b.y,b.w,b.h,id.includes('Home')?'#f3d9cf':'#e9c6a2');
  }
  ctx.font='bold 10px sans-serif';ctx.textAlign='center';
  for(const place of MAP_PLACES){
   const p=mapScale(place.x,place.y,w,h);ctx.fillStyle=place.color;
   ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();
  }
  const player=world.player?.sprite;if(player){
   const p=mapScale(player.x,player.y,w,h);ctx.fillStyle='#ffffff';ctx.strokeStyle='#284b38';ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();ctx.stroke();
  }
 }
 function select(event){
  const rect=canvas.getBoundingClientRect();
  const x=(event.clientX-rect.left)/rect.width*w,y=(event.clientY-rect.top)/rect.height*h;
  const place=MAP_PLACES.map(p=>({...p,d:Math.hypot(mapScale(p.x,p.y,w,h).x-x,mapScale(p.x,p.y,w,h).y-y)})).sort((a,b)=>a.d-b.d)[0];
  if(place)onSelect(place);
 }
 canvas.addEventListener('click',select);
 const interval=window.setInterval(draw,400);draw();
 return ()=>{window.clearInterval(interval);canvas.removeEventListener('click',select);};
}
