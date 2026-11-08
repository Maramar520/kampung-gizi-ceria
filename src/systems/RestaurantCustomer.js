// v1.14: visual restaurant visitor; payment is handled exclusively by RestaurantOrderSystem.
import {NPC} from '../entities/NPC.js';
const ENTRY=[{x:607,y:313},{x:607,y:351},{x:670,y:351},{x:670,y:463}];
const EXIT=[{x:670,y:351},{x:607,y:351},{x:607,y:313},{x:607,y:281}];
export class RestaurantCustomer {
 constructor(scene){
  this.scene=scene;this.day=0;this.stage='';this.wait=0;
  this.npc=new NPC(scene,{x:607,y:281,name:'PELANGGAN',texture:'nia',stops:[{x:607,y:281}]});
  this.npc.sprite.setVisible(false);
  this.npc.label?.setVisible(false);
  this.npc.activityText.setVisible(false);
  this.update(0);
 }
 get status(){return this.stage;}
 update(dt){
  const {day}=this.scene.game.state.data;
  const served=this.scene.restaurantOrders.status.served;
  if(this.day!==day){
   this.day=day;this.stage=served?'done':'arriving';this.wait=0;
   this.npc.sprite.setPosition(607,281);
   this.npc.sprite.setVisible(!served);this.npc.label?.setVisible(!served);
   if(!served)this.npc.setRoutine([...ENTRY,{x:670,y:470,activity:'🧾 Memesan makanan',pause:2}],'PELANGGAN',false);
  }
  if(this.stage==='done')return;
  if(this.stage==='arriving'&&this.npc.finished){this.stage='ordering';this.npc.setRoutine([{x:670,y:470,activity:'🍽️ Menunggu hidangan',pause:2}],'PELANGGAN',false);}
  if(this.stage==='ordering'&&served){this.stage='eating';this.wait=5;this.npc.setRoutine([{x:670,y:470,activity:'😋 Menikmati makanan',pause:3}],'PELANGGAN',false);}
  if(this.stage==='eating'){
   this.wait-=dt;
   if(this.wait<=0){this.stage='leaving';this.npc.setRoutine(EXIT,'PELANGGAN',false);}
  }
  if(this.stage==='leaving'&&this.npc.finished){this.stage='done';this.npc.sprite.setVisible(false);this.npc.label?.setVisible(false);this.npc.activityText.setVisible(false);}
  this.npc.update(dt);
 }
}
