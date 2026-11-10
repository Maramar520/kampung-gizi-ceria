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
  // Jalan utama, akses Balai Kota, dan jalur alun-alun satu garis tengah x=1155.
  const road=0xead5af,roadMark=0xd7b88f,roadHighlight=0xeedbb7;
  const plazaCX=1155,plazaRoadW=44,plazaTop=344,plazaBottom=544;
  // Jalan utama mendatar tetap tersambung dengan kampung lama.
  // Satu bidang jalan utuh melintasi Alun-Alun sampai Puskesmas, tanpa seam antar layer.
  rect(948,261,392,49,road);
  // Akses utara tepat sejajar dengan jalan vertikal di dalam alun-alun.
  rect(plazaCX-plazaRoadW/2,227,plazaRoadW,plazaBottom-227,road);
  rect(1125,15,60,50,road);
  for(let x=966;x<1340;x+=58)rect(x,282,25,3,roadMark);
  // Marka di sumbu tengah, berhenti saat melintasi jalan utama dan simpang alun-alun.
  for(let y=238;y<plazaBottom-10;y+=38){
   if((y>=261&&y<310)||(y>=417&&y<461))continue;
   rect(plazaCX-2,y,4,17,roadHighlight);
  }
  // Balai Kota baru: renovasi visual di footprint lama x=1025..1285,y=65..238.
  // Interior terbuka; pintu selatan x=1129..1181 dan jalur NPC tetap bebas.
  rect(1025,65,260,173,0xf5dfc5);
  // Lantai kayu terang dengan pola ubin halus.
  for(let y=79;y<227;y+=20){
   rect(1036,y,238,2,0xe4bf9d);
   for(let x=1042+((y/20|0)%2)*14;x<1267;x+=38)rect(x,y+5,2,12,0xebceb1);
  }
  // Bingkai bangunan dan atap dekoratif pendek agar interior tetap terlihat.
  rect(1025,65,260,12,0x947b69);
  rect(1033,67,244,5,0xb88c74);
  for(let x=1043;x<1268;x+=25)rect(x,68,13,3,0xf3d9ae);
  rect(1025,65,11,173,0x987764);rect(1274,65,11,173,0x987764);
  rect(1025,227,104,11,0x987764);rect(1181,227,104,11,0x987764);
  // Keset pintu dan jalan masuk menyatu dengan jalur menuju alun-alun.
  rect(1132,225,46,9,0xd6ad80);rect(1135,238,40,12,road);
  // Papan informasi dan lemari arsip di sisi kiri, tidak menutupi papan misi.
  rect(1043,119,65,44,0xbaa083);rect(1048,124,55,34,0xf8ecd4);
  for(let i=0;i<3;i++){rect(1053,129+i*9,40,3,[0xa3b8a0,0xd9b38b,0xa7b5d0][i]);}
  rect(1043,177,43,38,0x9d8068);
  for(let y=184;y<=205;y+=11){rect(1049,y,31,7,0xcbb096);rect(1063,y+2,5,2,0x80694f);}
  // Meja pelayanan administrasi, kursi tunggu, dan pot tanaman.
  rect(1190,113,70,26,0xa97d5b);rect(1195,117,60,16,0xd4ad83);
  rect(1200,108,22,7,0xf5ebd5);rect(1235,107,13,10,0x91b5a6);
  for(const [x,y] of [[1204,172],[1241,172],[1204,201],[1241,201]]){
   rect(x-12,y-6,24,10,0xb48d6c);rect(x-10,y+4,5,7,0x8e6d55);rect(x+5,y+4,5,7,0x8e6d55);
  }
  rect(1250,195,16,17,0x9b8067);rect(1247,185,22,13,0x78a77b);
  g.fillStyle(0x93c491);g.fillCircle(1258,185,10);
  // Lambang desa di dinding belakang, tanpa tulisan besar di atas bangunan.
  g.fillStyle(0xe7c88a);g.fillCircle(1155,91,14);
  g.fillStyle(0x6b9e77);g.fillCircle(1155,91,9);
  rect(1151,85,8,11,0xf8ead2);
  // Ruang tengah sengaja kosong untuk Kepala Desa, pejalan pantai, dan interaksi.
  // Renovasi alun-alun hanya dalam footprint lama x=1005..1307, y=344..544.
  // Rumah Pak Tani & Bu Sari ada di blok barat, tidak disentuh.
  const path=0xe8cbb0,stone=0xf3dfc7,hedge=0x5e9b63;
  rect(1012,352,286,185,0x83b77b);
  // Tepi taman dan lantai ubin, tetap ada pintu masuk dari jalan utara.
  rect(1020,360,270,168,path);
  for(let y=365;y<527;y+=17)for(let x=1025;x<1287;x+=18){
   rect(x,y,16,15,(Math.floor(x/18)+Math.floor(y/17))%2?0xeed7be:stone);
  }
  // Jalan masuk dari simpang utama, tersambung ke tengah taman.
  rect(1133,310,44,108,road);
  rect(1133,353,44,175,stone);
  rect(1020,428,270,32,stone);
  // Jalur masuk selatan tetap terbuka, tidak ada pagar yang menutupnya.
  rect(1133,528,44,16,road);
  // Air mancur bundar di pusat taman.
  g.fillStyle(0x6b9877);g.fillCircle(1155,444,43);
  g.fillStyle(0xe9d9ae);g.fillCircle(1155,444,39);
  g.fillStyle(0x5c9eb8);g.fillCircle(1155,444,32);
  g.fillStyle(0x8acbda);g.fillCircle(1155,444,24);
  g.fillStyle(0xe1f5ee);g.fillCircle(1155,444,8);
  g.fillStyle(0xffffff,.9);g.fillCircle(1153,437,4);
  // Empat kebun bunga simetris, menyisakan jalur jalan dan tempat duduk.
  for(const [fx,fy] of [[1064,403],[1246,403],[1064,482],[1246,482]]){
   rect(fx-28,fy-17,56,34,0x5d9560);
   rect(fx-24,fy-13,48,26,0x8bc47d);
   for(let i=0;i<9;i++){
    const xx=fx-18+(i%3)*17, yy=fy-9+Math.floor(i/3)*9;
    g.fillStyle([0xf4a5b5,0xffe19b,0xe6b7ef][i%3]);g.fillCircle(xx,yy,4);
   }
  }
  // Bangku di sisi utara dan selatan taman.
  for(const [bx,by] of [[1076,376],[1234,376],[1076,512],[1234,512]]){
   rect(bx-22,by-6,44,9,0xa77e55);rect(bx-19,by+3,6,8,0x856448);rect(bx+13,by+3,6,8,0x856448);
  }
  // Pohon berbunga di sudut, tidak menutup jalan utama.
  for(const [tx,ty] of [[1037,378],[1272,378],[1037,509],[1272,509]]){
   g.fillStyle(0x7d694f);g.fillRect(tx-3,ty,6,14);
   g.fillStyle(0x6eab72);g.fillCircle(tx,ty-7,19);
   g.fillStyle(0xe9a6c3);g.fillCircle(tx,ty-12,15);
   g.fillStyle(0xf5c4d8);g.fillCircle(tx-5,ty-17,8);
  }
  // Pagar tanaman rendah, dengan bukaan pintu utara dan selatan.
  for(let x=1012;x<1298;x+=14){
   if(x>=1128&&x<=1180)continue;
   rect(x,344,12,7,hedge);rect(x,537,12,7,hedge);
  }
  for(let y=355;y<530;y+=15){rect(1006,y,7,12,hedge);rect(1298,y,7,12,hedge);}
  // Bendera festival dan panggung lama tetap menggunakan mekanisme event.
  rect(1279,458,4,42,0x8c826c);rect(1283,458,18,11,0xe8a78e);
  // Interactive mayor mission board inside the town hall (access via E at Balai Kota).
  rect(1042,102,94,8,0x7d644d);rect(1046,80,86,31,0xd6b787);
  rect(1052,86,73,3,0xf8eed6);rect(1052,93,61,3,0xf8eed6);
  this.missionBoard=scene.add.text(1089,72,'📋 MISI HARIAN',{fontFamily:'monospace',fontSize:'11px',fontStyle:'bold',color:'#604b37',backgroundColor:'#fff0ca',padding:{x:3,y:2}}).setOrigin(.5).setDepth(550);
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
