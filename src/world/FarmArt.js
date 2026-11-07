// v1.0 Procedural mini-farm and pond within existing WorldScene.
export class FarmArt{
 constructor(scene){
  this.scene=scene;
  const g=scene.add.graphics().setDepth(-61);
  const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const frame=(x,y,w,h,bg,edge)=>{rect(x-3,y-3,w+6,h+6,edge);rect(x,y,w,h,bg);};
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
  // Fish pond: lower-right, safely off the central walkways.
  frame(697,509,174,68,0x8cc1bd,0x688985);
  frame(708,516,152,54,0x64aab6,0x497e88);
  rect(721,531,35,3,0xa7d9cf);rect(795,549,45,3,0x9dd3d2);
  rect(738,561,17,2,0xbbe9dd);rect(817,526,24,2,0xaedfd7);
  for(const [x,y] of [[706,516],[855,521],[709,565],[851,562]]){rect(x,y,14,7,0xada18c);rect(x+3,y+1,8,3,0xd0c6a5);}
  // Fishing dock and bucket.
  frame(767,489,42,33,0xc69d6e,0x8c6e52);
  for(let y=493;y<522;y+=8)rect(769,y,38,2,0x956e4d);
  frame(825,487,16,18,0x9ab6b7,0x657c86);
  this.graphics=g;
  this.chickens=[];
  for(const [x,y] of [[783,160],[833,160],[863,144]]){
   const c=scene.add.text(x,y,'🐔',{fontSize:'24px'}).setOrigin(.5).setDepth(-40);
   this.chickens.push(c);
  }
  this.fish=scene.add.text(748,543,'🐟',{fontSize:'23px'}).setOrigin(.5).setDepth(-40);
  this.coopLabel=scene.add.text(808,56,'KANDANG AYAM',{fontFamily:'monospace',fontSize:'14px',fontStyle:'bold',color:'#5c5640',backgroundColor:'#fff0cf',padding:{x:4,y:2}}).setOrigin(.5).setDepth(500);
  this.pondLabel=scene.add.text(784,585,'KOLAM IKAN',{fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:'#496769',backgroundColor:'#fff0cf',padding:{x:4,y:2}}).setOrigin(.5).setDepth(500);
 }
 update(time){
  for(let i=0;i<this.chickens.length;i++){
   const c=this.chickens[i];c.setY([160,160,144][i]+Math.sin(time/480+i*2)*3);
   c.setFlipX(Math.sin(time/950+i*3)>0);
  }
  this.fish.setX(748+Math.sin(time/780)*36).setFlipX(Math.cos(time/780)<0);
 }
 destroy(){for(const s of [...this.chickens,this.fish,this.coopLabel,this.pondLabel])s.destroy();this.graphics.destroy();}
}
