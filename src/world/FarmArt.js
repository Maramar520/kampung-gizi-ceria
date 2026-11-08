// Kandang di area rumah pemain (kiri atas); kolam di blok kanan atas.
import {LAYOUT} from './WorldGeometry.js';
export class FarmArt {
 constructor(scene){
  const g=scene.add.graphics().setDepth(-61);
  const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const frame=(x,y,w,h,c,e)=>{rect(x-2,y-2,w+4,h+4,e);rect(x,y,w,h,c);};
  const coop=LAYOUT.coop;
  frame(coop.x,coop.y,coop.w,coop.h,0xb1c991,0x71865e);
  // Kandang pagar, pintu di selatan dan ruang depan untuk pemain.
  for(let x=coop.x+5;x<coop.x+coop.w-7;x+=16){
   rect(x,coop.y+5,5,10,0xa37b53);
   if(x<coop.x+39||x>coop.x+85)rect(x,coop.y+coop.h-11,5,10,0xa37b53);
  }
  rect(286,159,85,12,0xc78665);rect(295,150,67,14,0xe0a080);
  frame(292,168,72,42,0xc9ab7e,0x8b6349);
  frame(320,180,18,27,0x785f4e,0xa77b57);
  rect(324,188,10,12,0x564d40);rect(309,175,12,9,0xf5dfb4);
  rect(355,178,4,26,0xb18d62);
  for(const [x,y] of [[275,215],[348,220]]){rect(x,y,21,9,0xa37d5b);rect(x+4,y-4,14,7,0xe9d29f);}
  this.sceneDailyStatus=()=>scene.dailyLife?.status;
  this.sceneWeather=()=>({rain:scene.clock?.weather==='Hujan',night:scene.clock?.phase===3});
  this.graphics=g;
  this.feedBowl=scene.add.text(331,229,'🥣',{fontSize:'16px'}).setOrigin(.5).setDepth(50).setVisible(false);
  this.eggBasket=scene.add.text(355,230,'🥚',{fontSize:'18px'}).setOrigin(.5).setDepth(51).setVisible(false);
  this.ripples=scene.add.graphics().setDepth(-57);
  this.chickens=[[278,224],[369,223],[377,188]].map(([x,y])=>
   scene.add.text(x,y,'🐔',{fontSize:'22px'}).setOrigin(.5).setDepth(40)
  );
  this.coopLabel=scene.add.text(325,155,'🐔',{fontSize:'16px'}).setOrigin(.5).setDepth(600);
 }
 update(time){
  const farm=this.sceneDailyStatus?.()||null;
  if(farm){this.feedBowl.setVisible(farm.fedToday);this.eggBasket.setVisible(farm.eggsReady);}

  const shelter=this.sceneWeather();
  for(let i=0;i<this.chickens.length;i++){
   const c=this.chickens[i];
   // Walk across the pen while dry; retreat inside the coop in rain or at night.
   if(shelter.rain||shelter.night){
    c.setPosition(319+i*8,197+i*2).setVisible(i===0);
   }else{
    const base=[[278,224],[369,223],[377,188]][i];
    c.setPosition(base[0]+Math.sin(time/1200+i*2.3)*9,base[1]+Math.sin(time/550+i*3)*3).setVisible(true);
   }
   c.setFlipX(Math.sin(time/870+i*2)>0);
  }

 }
 destroy(){
  this.graphics.destroy();this.ripples.destroy();
  for(const obj of [...this.chickens,this.coopLabel,this.feedBowl,this.eggBasket])obj.destroy();
 }
}
