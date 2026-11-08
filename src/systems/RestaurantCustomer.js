// v1.15 — restaurant visitor follows the door corridor, sits, eats, pays and leaves.
// Rewards and saved completion remain exclusively in RestaurantOrderSystem.
import {NPC} from '../entities/NPC.js';
import {FURNITURE,LAYOUT} from '../world/WorldGeometry.js';
export const RESTAURANT_SEAT={x:690,y:470};
export const RESTAURANT_ENTRY=[{x:607,y:319},{x:607,y:351},{x:690,y:351},{...RESTAURANT_SEAT}];
export const RESTAURANT_EXIT=[{x:690,y:351},{x:607,y:351},{x:607,y:319},{x:607,y:281}];
// A visible NPC is not allowed to walk through tables or outside the restaurant.
export function restaurantPathClear(points){
 const blockers=FURNITURE.filter(o=>o.x>=LAYOUT.restaurant.x&&o.x<LAYOUT.restaurant.x+LAYOUT.restaurant.w);
 const segmentClear=(a,b)=>{
  const distance=Math.hypot(a.x-b.x,a.y-b.y),steps=Math.max(1,Math.ceil(distance/3));
  for(let i=0;i<=steps;i++){
   const x=a.x+(b.x-a.x)*i/steps,y=a.y+(b.y-a.y)*i/steps;
   if(blockers.some(o=>x>=o.x-7&&x<=o.x+o.w+7&&y>=o.y-5&&y<=o.y+o.h+5))return false;
  }
  return true;
 };
 return points.every((p,i)=>!i||segmentClear(points[i-1],p));
}
export class RestaurantCustomer {
 constructor(scene){
  this.scene=scene;this.day=0;this.stage='';this.wait=0;this.orderWait=0;
  this.npc=new NPC(scene,{x:607,y:281,name:'PELANGGAN',texture:'nia',stops:[{x:607,y:281}]});
  this.visitors=['Tamu Dita','Tamu Riko','Tamu Maya','Tamu Beni'];
  this.chair=scene.add.text(RESTAURANT_SEAT.x,RESTAURANT_SEAT.y+10,'🪑',{fontSize:'21px'}).setOrigin(.5).setDepth(RESTAURANT_SEAT.y-2);
  this.meal=scene.add.text(RESTAURANT_SEAT.x-22,RESTAURANT_SEAT.y-24,'🍲',{fontSize:'20px'}).setOrigin(.5).setDepth(1600).setVisible(false);
  this.npc.sprite.setVisible(false);this.npc.label?.setVisible(false);this.npc.activityText.setVisible(false);
  this.update(0);
 }
 get status(){return this.stage;}
 setStage(stage,route,activity){
  this.stage=stage;
  if(route)this.npc.setRoutine(route,this.scene.restaurantOrders.order.customer.toUpperCase(),false);
  if(activity){this.npc.activity=activity;this.npc.workPause=2;}
 }
 update(dt){
  const {day}=this.scene.game.state.data;
  const served=this.scene.restaurantOrders.status.served;
  if(this.day!==day){
   this.day=day;this.wait=0;this.orderWait=0;this.stage=served?'done':'arriving';
   const guest=this.scene.restaurantOrders.order.customer;
   this.npc.texture=({'Tamu Dita':'nia','Tamu Riko':'tani','Tamu Maya':'sari','Tamu Beni':'rani'})[guest]||'nia';
   this.npc.label?.setText(guest.toUpperCase());
   this.npc.sprite.setTexture(this.npc.texture+'-down-0');
   this.npc.sprite.setPosition(607,281);this.npc.sprite.setVisible(!served);this.npc.label?.setVisible(!served);
   this.npc.activityText.setVisible(false);this.meal.setVisible(false);
   if(!served)this.npc.setRoutine(RESTAURANT_ENTRY,guest.toUpperCase(),false);
  }
  if(this.stage==='done')return;
  // Serving while the guest is walking never teleports them through furniture.
  if(this.stage==='arriving'&&this.npc.finished)this.setStage('ordering',null,'🧾 Memesan makanan');
  if(this.stage==='ordering'&&!served){
   this.orderWait+=dt;
   this.npc.activity=this.orderWait>18?'⌛ Menunggu hidangan sehat':'🧾 Menunggu pesanan';
  }
  if(this.stage==='ordering'&&served){this.wait=5;this.setStage('eating',null,'😋 Menikmati makanan');this.meal.setVisible(true);}
  // A seated guest must stay in their seat while eating and paying.
  // Do not advance the walking route while seated.
  if(this.stage==='eating'){
   this.wait-=dt;
   if(this.wait<=0){this.meal.setVisible(false);this.wait=1.8;this.setStage('paying',null,'🪙 Membayar pesanan');}
  }else if(this.stage==='paying'){
   this.wait-=dt;
   if(this.wait<=0)this.setStage('leaving',RESTAURANT_EXIT);
  }
  if(!['ordering','eating','paying'].includes(this.stage))this.npc.update(dt);
  if(['ordering','eating','paying'].includes(this.stage)){
   // Seated silhouette: chair behind the guest and reduced sprite height.
   this.npc.sprite.setScale(1,.78).setDepth(RESTAURANT_SEAT.y+1);
   this.npc.sprite.setPosition(RESTAURANT_SEAT.x,RESTAURANT_SEAT.y+6);
   this.npc.label?.setPosition(RESTAURANT_SEAT.x,RESTAURANT_SEAT.y-45);
   this.npc.activityText.setText(this.npc.activity).setPosition(RESTAURANT_SEAT.x,RESTAURANT_SEAT.y-70).setVisible(true);
  }else {this.npc.sprite.setScale(1,1);this.npc.activityText.setVisible(false);}
  if(this.stage==='leaving'&&this.npc.finished){
   this.stage='done';this.npc.sprite.setVisible(false);this.npc.label?.setVisible(false);this.npc.activityText.setVisible(false);
  }
 }
}
