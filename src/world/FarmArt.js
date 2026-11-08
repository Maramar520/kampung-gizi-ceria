// Kandang di area rumah pemain (kiri atas); kolam di blok kanan atas.
import {LAYOUT} from './WorldGeometry.js';
export class FarmArt {
 constructor(scene){
  const g=scene.add.graphics().setDepth(-61);
  const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const frame=(x,y,w,h,c,e)=>{rect(x-2,y-2,w+4,h+4,e);rect(x,y,w,h,c);};
  const coop=LAYOUT.coop,pond=LAYOUT.pond;
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
  // Kolam air kanan atas, pembatas dan dermaga menghadap jalan horizontal.
  frame(pond.x,pond.y,pond.w,pond.h,0x99c3b8,0x567f77);
  frame(816,82,105,129,0x66a9b4,0x437d8a);
  for(let y=88;y<205;y+=24){
   rect(824,y+3,20,3,0xa0d6d5);rect(874,y+14,28,3,0x8ed0d0);
  }
  for(const [x,y] of [[818,93],[910,100],[815,205],[909,202]]){
   rect(x,y,11,7,0xd2bd9c);rect(x+3,y+2,6,3,0xf1dcc0);
  }
  for(const [x,y] of [[842,119],[890,171]]){
   rect(x,y,18,5,0x508f86);rect(x+4,y-4,11,8,0x86bc73);rect(x+8,y-6,4,4,0xe7c6a7);
  }
  // Dermaga menjadi lokasi memancing; papan tidak menghalangi jalan.
  frame(848,214,42,31,0xc59c70,0x806146);
  for(let y=217;y<241;y+=7)rect(851,y,36,2,0x9c7651);
  rect(894,228,13,15,0x9bb8bd);
  rect(897,230,7,5,0xe4e4d3);
  this.sceneDailyStatus=()=>scene.dailyLife?.status;
  this.graphics=g;
  this.feedBowl=scene.add.text(331,229,'🥣',{fontSize:'16px'}).setOrigin(.5).setDepth(50).setVisible(false);
  this.eggBasket=scene.add.text(355,230,'🥚',{fontSize:'18px'}).setOrigin(.5).setDepth(51).setVisible(false);
  this.ripples=scene.add.graphics().setDepth(-57);
  this.chickens=[[278,224],[369,223],[377,188]].map(([x,y])=>
   scene.add.text(x,y,'🐔',{fontSize:'22px'}).setOrigin(.5).setDepth(40)
  );
  this.fish=scene.add.text(872,145,'🐟',{fontSize:'22px'}).setOrigin(.5).setDepth(40);
  this.coopLabel=scene.add.text(325,155,'🐔',{fontSize:'16px'}).setOrigin(.5).setDepth(600);
  this.pondLabel=scene.add.text(868,67,'KOLAM IKAN',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#3d6770',backgroundColor:'#f8edcb',padding:{x:4,y:2}}).setOrigin(.5).setDepth(600);
 }
 update(time){
  const farm=this.sceneDailyStatus?.()||null;
  if(farm){this.feedBowl.setVisible(farm.fedToday);this.eggBasket.setVisible(farm.eggsReady);}

  for(let i=0;i<this.chickens.length;i++){
   const c=this.chickens[i];
   c.y=[224,223,188][i]+Math.sin(time/550+i*3)*3;
   c.setFlipX(Math.sin(time/870+i*2)>0);
  }
  this.fish.x=872+Math.sin(time/750)*23;
  this.fish.setFlipX(Math.cos(time/750)<0);
  const g=this.ripples;g.clear();
  for(const [x,y,k] of [[838,161,0],[895,120,1.7]]){
   const d=10+((time/220+k*5)%14);
   g.lineStyle(2,0xc5e7df,.65);
   g.strokeEllipse(x,y,d*2,Math.max(4,d*.65));
  }
 }
 destroy(){
  this.graphics.destroy();this.ripples.destroy();
  for(const obj of [...this.chickens,this.fish,this.coopLabel,this.pondLabel,this.feedBowl,this.eggBasket])obj.destroy();
 }
}
