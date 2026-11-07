// v1.0 Procedural mini-farm and pond within existing WorldScene.
export class FarmArt{
 constructor(scene){
  this.scene=scene;
  const g=scene.add.graphics().setDepth(-60);
  const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const frame=(x,y,w,h,bg,edge)=>{rect(x-3,y-3,w+6,h+6,edge);rect(x,y,w,h,bg);};
  // Penanda kontras dan pelataran menghadap jalan utama.
  frame(690,47,231,143,0x9dbd81,0x5c8655);
  rect(687,171,237,9,0xcca97a);
  rect(785,182,42,26,0xe7cb91);
  rect(795,188,21,13,0xf2dba8);
    // Chicken coop: north-east corner, beyond the restaurant.
  frame(714,71,182,105,0xc1d4a1,0x98784e);
  for(let x=713;x<=899;x+=19){rect(x,69,5,14,0xa97b54);rect(x,172,5,10,0xa97b54);}
  for(let y=84;y<168;y+=21){rect(712,y,7,6,0xd3ac7b);rect(892,y,7,6,0xd3ac7b);}
  frame(746,87,104,54,0xd6a66e,0x926543);
  rect(742,78,111,12,0xb96759);rect(751,69,93,12,0xcf8066);
  rect(762,101,24,25,0x6c5845);rect(770,114,8,12,0xe8c98e);
  rect(807,100,24,17,0x8b6c52);rect(817,101,5,14,0xc6a475);
  rect(759,148,35,13,0xd8ba7c);rect(766,152,12,5,0xf9edba);
  rect(802,151,27,8,0x98734d);rect(805,147,20,6,0xc1a16f);
  // Bibir kolam berwarna biru kontras agar terlihat dari jauh.
  frame(683,497,205,84,0x71aab4,0x426d79);
    // Fish pond: lower-right, safely off the central walkways.
  frame(697,509,174,68,0x8cc1bd,0x688985);
  frame(708,516,152,54,0x64aab6,0x497e88);
  rect(721,531,35,3,0xa7d9cf);rect(795,549,45,3,0x9dd3d2);
  rect(738,561,17,2,0xbbe9dd);rect(817,526,24,2,0xaedfd7);
  for(const [x,y] of [[706,516],[855,521],[709,565],[851,562]]){rect(x,y,14,7,0xada18c);rect(x+3,y+1,8,3,0xd0c6a5);}
  // Titik pantul, rumpun teratai, dan tepian kolam memperjelas batas air.
  for(const [x,y] of [[729,529],[814,554],[744,559]]){rect(x-5,y,17,4,0x4d9287);rect(x,y-4,10,6,0x8ebc74);rect(x+3,y-5,3,3,0xd8dca8);}
  rect(695,490,41,7,0xd8b98b);rect(700,492,30,2,0xf3dab0);
  // Fishing dock and bucket.
  frame(767,489,42,33,0xc69d6e,0x8c6e52);
  for(let y=493;y<522;y+=8)rect(769,y,38,2,0x956e4d);
  frame(825,487,16,18,0x9ab6b7,0x657c86);
  // Papan petunjuk di area jalan dan penanda permanen kedua lokasi.
  frame(875,430,50,18,0xf2daa5,0x8f704a);
  rect(879,435,42,8,0xb68c63);
  // Ornamen tetap: jerami, jendela kandang, rerumputan tepi kolam.
  for(let x=739;x<889;x+=31){rect(x,164,18,3,0xe2c68e);rect(x+6,160,9,3,0xf0d59a);}
  rect(793,110,8,11,0xf4ddb2);rect(797,110,2,11,0x916f55);
  for(let x=699;x<885;x+=35){rect(x,581,10,4,0x6f9b70);rect(x+3,578,3,6,0x8bb47b);}
  // Ripples stay decorative and never influence swimming/collision.
  this.graphics=g;
  this.pondRipples=scene.add.graphics().setDepth(-56);
  this.chickens=[];
  for(const [x,y] of [[770,150],[824,151],[866,139]]){
   const c=scene.add.text(x,y,'🐔',{fontSize:'30px'}).setOrigin(.5).setDepth(28);
   this.chickens.push(c);
  }
  this.fish=scene.add.text(748,543,'🐟',{fontSize:'29px'}).setOrigin(.5).setDepth(28);
  this.coopLabel=scene.add.text(808,44,'🐔 KANDANG AYAM',{fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',color:'#5c5640',backgroundColor:'#fff0cf',padding:{x:4,y:2}}).setOrigin(.5).setDepth(500);
  this.pondLabel=scene.add.text(784,588,'🎣 KOLAM IKAN',{fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',color:'#496769',backgroundColor:'#fff0cf',padding:{x:4,y:2}}).setOrigin(.5).setDepth(500);
 }
 update(time){
  for(let i=0;i<this.chickens.length;i++){
   const c=this.chickens[i];c.setY([150,151,139][i]+Math.sin(time/480+i*2)*3);
   c.setFlipX(Math.sin(time/950+i*3)>0);
  }
  this.fish.setX(748+Math.sin(time/780)*36).setFlipX(Math.cos(time/780)<0);
  const ripples=this.pondRipples;ripples.clear();
  for(const [x,y,shift] of [[729,538,0],[809,548,1.4]]){
   const size=8+(time/250+shift*13)%15;
   ripples.lineStyle(2,0xc5e9de,.5+Math.sin(time/620+shift)*.2);
   ripples.strokeEllipse(x,y,size*2,Math.max(3,size*.55));
  }
 }
 destroy(){for(const s of [...this.chickens,this.fish,this.coopLabel,this.pondLabel])s.destroy();this.pondRipples.destroy();this.graphics.destroy();}
}
