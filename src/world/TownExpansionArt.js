// Eastern district: open-interior town hall and festival square, no external assets.
export class TownExpansionArt {
 constructor(scene,festival){
  this.festival=festival;
  const g=scene.add.graphics().setDepth(-85);
  const rect=(x,y,w,h,color)=>{g.fillStyle(color);g.fillRect(x,y,w,h);};
  rect(960,0,380,600,0xa4cd91);
  // Existing horizontal road continues east; north/south paths join both new places.
  rect(960,261,380,49,0xead5af);rect(1134,238,42,106,0xead5af);
  rect(1125,15,60,50,0xead5af);
  // Balai Kota: cutaway interior, door open at bottom centre.
  rect(1025,65,260,173,0xf1dec5);
  for(let y=86;y<220;y+=23)rect(1037,y,237,2,0xe2bf9e);
  rect(1025,65,260,11,0x9b8069);rect(1025,65,11,173,0x9b8069);
  rect(1274,65,11,173,0x9b8069);
  rect(1025,227,104,11,0x9b8069);rect(1181,227,104,11,0x9b8069);
  rect(1082,114,46,25,0xb88c61);rect(1090,119,30,9,0xe8d6b7);
  rect(1192,105,62,14,0x9c7a56);
  for(let i=0;i<5;i++)rect(1198+i*10,96,7,14,[0xa1bd91,0xe6b57b,0xa2b5cf][i%3]);
  rect(1054,177,43,22,0xc5a77d);rect(1059,181,32,12,0xf7e9cd);
  rect(1224,174,32,30,0x92b59a);rect(1230,168,20,12,0x76a878);
  // Alun-alun: fountain, flowerbeds, benches, flag and event space.
  rect(1005,344,302,200,0xd3c6a0);rect(1015,354,282,180,0xb9d59e);
  rect(1142,344,44,200,0xe9d8b5);rect(1005,417,302,31,0xe9d8b5);
  g.fillStyle(0x92b8b4);g.fillCircle(1068,394,29);
  g.fillStyle(0x5e9db7);g.fillCircle(1068,394,23);
  g.fillStyle(0xd4e8df);g.fillCircle(1068,394,9);
  for(const [x,y] of [[1038,481],[1242,390],[1242,489]]){
   rect(x-24,y-5,48,10,0xa77e55);rect(x-21,y+5,7,10,0x856448);rect(x+14,y+5,7,10,0x856448);
  }
  for(const [x,y] of [[1028,364],[1282,364],[1028,520],[1282,520]]){
   g.fillStyle(0x619766);g.fillCircle(x,y,15);
   g.fillStyle(0x86b979);g.fillCircle(x-3,y-5,12);
  }
  for(let i=0;i<16;i++){
   const x=1018+(i%8)*38,y=356+Math.floor(i/8)*172;
   g.fillStyle(i%2?0xf2b6ad:0xf4d98a);g.fillCircle(x,y,4);
  }
  rect(1268,405,4,61,0x8c826c);rect(1272,405,24,15,0xe8a78e);
  this.banner=scene.add.text(1155,82,'🏛️ BALAI KOTA',{fontFamily:'monospace',fontSize:'15px',fontStyle:'bold',color:'#4c5940',backgroundColor:'#fff1d2',padding:{x:5,y:3}}).setOrigin(.5).setDepth(550);
  this.title=scene.add.text(1155,327,'🌳 ALUN-ALUN KAMPUNG',{fontFamily:'monospace',fontSize:'14px',fontStyle:'bold',color:'#456049',backgroundColor:'#fff1d2',padding:{x:5,y:3}}).setOrigin(.5).setDepth(550);
  this.fest=scene.add.text(1155,370,'🎪 FESTIVAL KAMPUNG SEHAT',{fontFamily:'monospace',fontSize:'12px',color:'#654b39',backgroundColor:'#ffe3ae',padding:{x:4,y:3}}).setOrigin(.5).setDepth(550);
  this.update(0);
 }
 update(){this.fest.setVisible(this.festival.active);}
}
