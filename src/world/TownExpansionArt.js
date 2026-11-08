// Eastern district: open-interior town hall and festival square, no external assets.
export class TownExpansionArt {
 constructor(scene,festival){
  this.festival=festival;
  const g=scene.add.graphics().setDepth(-85);
  const rect=(x,y,w,h,color)=>{g.fillStyle(color);g.fillRect(x,y,w,h);};
  // Same base grass and procedural grass tufts as the original six-block district.
  rect(960,0,380,600,0xa4cd91);
  for(let y=9;y<600;y+=17)for(let x=957;x<1340;x+=19){
   if((x*7+y*11)%17<7){rect(x,y,3,5,0x74b075);rect(x+5,y+2,2,3,0xb9d899);}
  }
  // Sambungan jalan: tutup celah 8px antara jalan lama (sampai x=952)
  // dan kawasan timur; simpang tegak lurus menghubungkan dua tujuan.
  rect(948,261,392,49,0xead5af);
  rect(1134,227,42,122,0xead5af);
  for(let x=966;x<1328;x+=58)rect(x,282,25,3,0xd7b88f);
  for(let y=244;y<345;y+=32)rect(1152,y,5,14,0xeedbb7);
  // Existing horizontal road continues east; north/south paths join both new places.
  // Jalur utama sudah digambar menyambung di atas, tanpa celah.
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
  // Alun-alun lawn matches the old kampung grass; paths and decorations stay in place.
  rect(1005,344,302,200,0xa4cd91);
  rect(1015,354,282,180,0xa4cd91);
  for(let y=361;y<529;y+=17)for(let x=1022;x<1293;x+=19){
   if((x*7+y*11)%17<7){rect(x,y,3,5,0x74b075);rect(x+5,y+2,2,3,0xb9d899);}
  }
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
  // Interactive mayor mission board inside the town hall (access via E at Balai Kota).
  rect(1042,102,94,8,0x7d644d);rect(1046,80,86,31,0xd6b787);
  rect(1052,86,73,3,0xf8eed6);rect(1052,93,61,3,0xf8eed6);
  this.missionBoard=scene.add.text(1089,72,'📋 MISI HARIAN',{fontFamily:'monospace',fontSize:'11px',fontStyle:'bold',color:'#604b37',backgroundColor:'#fff0ca',padding:{x:3,y:2}}).setOrigin(.5).setDepth(550);
  this.banner=scene.add.text(1155,82,'🏛️ BALAI KOTA',{fontFamily:'monospace',fontSize:'15px',fontStyle:'bold',color:'#4c5940',backgroundColor:'#fff1d2',padding:{x:5,y:3}}).setOrigin(.5).setDepth(550);
  this.title=scene.add.text(1155,327,'🌳 ALUN-ALUN KAMPUNG',{fontFamily:'monospace',fontSize:'14px',fontStyle:'bold',color:'#456049',backgroundColor:'#fff1d2',padding:{x:5,y:3}}).setOrigin(.5).setDepth(550);
  this.fest=scene.add.text(1155,370,'🎪 FESTIVAL KAMPUNG SEHAT',{fontFamily:'monospace',fontSize:'12px',color:'#654b39',backgroundColor:'#ffe3ae',padding:{x:4,y:3}}).setOrigin(.5).setDepth(550);
  this.eventGraphics=scene.add.graphics().setDepth(70);
  this.eventTitle=scene.add.text(1200,395,'🎤 PANGGUNG FESTIVAL',{fontFamily:'monospace',fontSize:'11px',color:'#674d3c',backgroundColor:'#fff0b6',padding:{x:4,y:2}}).setOrigin(.5).setDepth(750);
  this.update(0);
 }
 update(time=0){
  const active=this.festival.active;this.fest.setVisible(active);this.eventTitle.setVisible(active);
  const g=this.eventGraphics;g.clear();if(!active)return;
  // Panggung, stan makanan sehat dan umbul-umbul muncul pada hari festival.
  const r=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  r(1170,398,94,24,0xa77b55);r(1174,402,86,15,0xd3aa75);
  for(let i=0;i<5;i++){r(1174+i*17,392,15,8,i%2?0xf5d58e:0xe6a0a0);}
  for(const [x,y,label] of [[1016,454,'🥕'],[1255,454,'🥗']]){
   r(x,y,41,28,0xb78c61);r(x-3,y-11,47,13,0xe7a7a2);
   r(x+4,y+5,32,6,0xf6e1ad);
  }
  g.lineStyle(2,0xe5bb85,1);g.lineBetween(1015,351,1296,351);
  for(let i=0;i<15;i++){const x=1018+i*19;
   g.fillStyle([0xf0b2b4,0xf6dc96,0x9bc6ab][i%3]);
   g.fillTriangle(x,353,x+15,353,x+7,363);
  }
  g.fillStyle(0xffe2a5,.4+.2*Math.sin(time/400));g.fillCircle(1210,411,11);
 }
}
