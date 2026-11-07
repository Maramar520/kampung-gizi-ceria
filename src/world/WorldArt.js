import {OBSTACLES,LAYOUT} from './WorldGeometry.js';

// v1.4: semua sprite dan pose kegiatan digambar secara prosedural.
// Kunci tekstur sprite lama dipertahankan agar posisi, NPC, dan save tetap kompatibel.
export const CHARACTER_ACTIONS=Object.freeze(['sleep','water','harvest','cook','fish','plant']);
export function createTextures(scene){
 const g=scene.make.graphics({x:0,y:0},false);
 const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const palette={
  player:{shirt:0x7caad3,shade:0x4c83b0,hair:0x594536,skin:0xf3c8a5,accent:0xe4c184},
  sari:{shirt:0xe4a18c,shade:0xc67877,hair:0x674637,skin:0xf1cba5,accent:0xf0d5a9},
  chef:{shirt:0xf0eee4,shade:0xc4d7cd,hair:0x665041,skin:0xf1c6a4,accent:0x8abc9d},
  tani:{shirt:0x8fb47b,shade:0x517c56,hair:0x594633,skin:0xeac39e,accent:0xd6b171},
  nia:{shirt:0xe6b4c3,shade:0xb67d9f,hair:0x473746,skin:0xf2caa9,accent:0xf5d78f}
 };
 const draw=(name,dir,frame,action=null)=>{
  const p=palette[name],walk=frame!==0&&!action,step=walk?(frame===1?2:-2):0;
  const bounce=walk?(frame===1?-1:1):0;
  const side=dir==='side',back=dir==='up';
  // Bayangan tidak bergerak vertikal; tubuhnya bergerak agar langkah terasa hidup.
  rect(5,42,26,3,0x5d8f6a);
  rect(8,43,21,2,0x7eaf82);
  rect(9+step,35,8,9,0x4a576b);
  rect(19-step,35,8,9,0x4a576b);
  rect(9+step,41,8,3,0x3b4152);
  rect(19-step,41,8,3,0x3b4152);
  // Pakaian anak chibi: kerah, ikat pinggang dan detail kancing.
  rect(7,23+bounce,23,15,p.shade);
  rect(9,23+bounce,19,12,p.shirt);
  rect(11,23+bounce,12,3,0xffeedc);
  rect(17,26+bounce,3,3,p.accent);
  rect(16,32+bounce,5,2,0xf2d4a2);
  // Gerakan tangan disesuaikan per aksi.
  const armY=action==='water'||action==='fish'||action==='cook'?18:
   action==='harvest'||action==='plant'?29:24;
  const armRaise=action==='water'||action==='fish'||action==='cook';
  rect(4,armY+bounce,6,12,p.skin);
  rect(28,armRaise?18+bounce:24+bounce,5,12,p.skin);
  rect(5,armY+2+bounce,3,6,0xdca987);
  // Kepala besar dan rambut berlapis untuk proporsi chibi.
  rect(7,4+bounce,23,21,p.skin);
  rect(9,6+bounce,19,17,0xf6d5b5);
  if(back){
   rect(6,2+bounce,25,18,p.hair);
   rect(9,15+bounce,19,5,0x6d503b);
   rect(12,5+bounce,13,4,0x937155);
  }else{
   rect(6,1+bounce,25,10,p.hair);
   rect(6,8+bounce,5,12,p.hair);
   rect(side?7:27,8+bounce,4,9,p.hair);
   rect(11,3+bounce,14,3,0x91745b);
   rect(side?21:12,15+bounce,3,4,0x41362f);
   if(!side)rect(23,15+bounce,3,4,0x41362f);
   rect(side?21:14,20+bounce,9,2,0xd99186);
   rect(9,19+bounce,4,3,0xe8a69b);
   if(!side)rect(27,19+bounce,3,3,0xe8a69b);
  }
  // Karakter berbeda: rambut Bu Sari, celemek koki, dan tas pemain.
  if(name==='sari'){
   if(!back){rect(5,9+bounce,4,17,p.hair);rect(29,10+bounce,4,14,p.hair);}
   rect(12,34+bounce,13,3,0xb56f68);
   rect(11,28+bounce,15,6,0xf4beaa);
  }else if(name==='chef'){
   rect(7,1+bounce,24,7,0xffffff);
   rect(10,bounce,18,4,0xffffff);
   rect(9,7+bounce,19,4,0xdfebe5);
   rect(12,27+bounce,15,12,0xfffaf0);
   rect(13,30+bounce,3,9,0xd1dcd5);
   rect(22,29+bounce,3,3,p.accent);
   rect(22,35+bounce,3,3,p.accent);
  }else if(name==='tani'){
   // Topi jerami dan sepatu bot Pak Tani, unik dari karakter pemain.
   rect(3,4+bounce,33,5,0xc5a36f);
   rect(10,-1+bounce,18,8,0xe5c58b);
   rect(13,1+bounce,12,3,0xf8e0a2);
   rect(11,28+bounce,16,8,0x6c9772);
   rect(12,35+bounce,6,5,0x765b46);
   rect(21,35+bounce,6,5,0x765b46);
  }else if(name==='nia'){
   // Kepang pendek, pita dan tas sekolah kecil.
   if(!back){rect(4,11+bounce,5,17,p.hair);rect(29,12+bounce,5,16,p.hair);}
   rect(24,5+bounce,8,4,0xf2cb84);
   rect(26,2+bounce,4,9,0xf5dc9d);
   rect(10,30+bounce,18,9,0xe2a7ba);
   rect(24,27+bounce,8,9,0xc9936c);
   rect(26,29+bounce,4,4,0xf1d5a0);
  }else{
   rect(back?20:9,24+bounce,4,13,0xcaa66f);
   if(!back){rect(22,29+bounce,6,8,0x977252);rect(23,31+bounce,3,3,0xe4ba86);}
   rect(11,26+bounce,4,7,0x5b8abd);
  }
  if(action==='sleep'){
   // Mata terpejam dan selimut malam, bukan teleportasi player.
   rect(11,16+bounce,7,2,0x514039);
   rect(22,16+bounce,6,2,0x514039);
   rect(8,29,22,8,0xb0c7bf);
   rect(13,32,6,3,0xe4eedc);
  }
  if(action==='water'){
   // Penyiram di tangan kanan; garis air biru berayun.
   rect(28,17,8,7,0x79a7b5);
   rect(30,14,4,4,0xc3e0e0);
   rect(33,22,3,4,0x77c4de);
   if(frame>0){rect(34,29,2,6,0x74bad9);rect(29,34,3,5,0x81ccdf);}
  }
  if(action==='harvest'){
   rect(26,27,10,10,0x9e764b);
   rect(27,24,8,4,0xcaa36a);
   rect(29,20,3,5,0x5c9c60);
   if(frame>0)rect(33,18,4,6,0x7ab56a);
  }
  if(action==='plant'){
   rect(28,32,6,6,0x8b6549);
   rect(29,27,4,7,0x559f61);
   if(frame>0)rect(34,35,3,4,0xc3a275);
  }
  if(action==='cook'){
   rect(28,16,8,6,0x9ea9a5);
   rect(31,13,2,3,0xffffff);
   rect(30,23,6,2,0xdfbc79);
   if(frame>0){rect(32,9,3,5,0xf8d2a2);rect(27,7,2,4,0xf9d9b0);}
  }
  if(action==='fish'){
   rect(29,14,3,11,0x8c6b4c);
   rect(31,12,7,2,0xb7ab84);
   rect(37,14,2,18,0x91c3d6);
   if(frame>0)rect(36,33,4,4,0xdfeee7);
  }
 };
 for(const name of Object.keys(palette)){
  for(const dir of ['down','up','side']){
   for(const frame of [0,1,2]){
    g.clear();draw(name,dir,frame);
    g.generateTexture(name+'-'+dir+'-'+frame,42,48);
   }
  }
 }
 for(const action of CHARACTER_ACTIONS){
  for(const frame of [0,1,2]){
   g.clear();draw('player','down',frame,action);
   g.generateTexture('player-action-'+action+'-'+frame,42,48);
  }
 }
 g.destroy();
}

export function buildWorld(scene) {
 const ground=scene.add.graphics().setDepth(-100);
 const deco=scene.add.graphics().setDepth(-75);
 const r=(g,x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const frame=(g,x,y,w,h,c,edge=0x88694c,t=3)=>{r(g,x-t,y-t,w+t*2,h+t*2,edge);r(g,x,y,w,h,c);};
 const label=(str,x,y,size=13)=>scene.add.text(x,y,str,{
  fontFamily:'monospace',fontSize:size+'px',fontStyle:'bold',color:'#574d3e',
  backgroundColor:'#fff3d4',padding:{x:5,y:3}
 }).setOrigin(.5).setDepth(550);
 const tuft=(x,y)=>{r(ground,x,y,3,5,0x74b075);r(ground,x+5,y+2,2,3,0xb9d899);};
 const flower=(x,y,c)=>{r(ground,x,y,2,8,0x5b9867);r(ground,x-4,y-3,10,5,c);r(ground,x-1,y-6,4,9,c);r(ground,x,y-2,2,2,0xf9e39d);};
 const bush=(x,y)=>{r(ground,x-13,y,26,8,0x4f8356);r(ground,x-10,y-9,22,15,0x6fae70);r(ground,x-4,y-14,12,9,0x8fc985);};
 const tree=(x,y)=>{r(deco,x-5,y,10,19,0x916f4e);frame(deco,x-19,y-26,40,29,0x6d9f65,0x578751,2);r(deco,x-12,y-33,28,14,0x8cc67d);r(deco,x-8,y-18,8,3,0xb5dc9b);};
 const flowerBox=(x,y,w)=>{frame(deco,x,y,w,10,0xb9885d,0x836149,2);for(let p=x+8;p<x+w-4;p+=14){r(deco,p,y-8,3,10,0x629961);r(deco,p-4,y-10,10,6,((p/14)|0)%2?0xeaa9aa:0xf2db95);}};
 const shelf=(x,y,w)=>{frame(deco,x,y,w,27,0xc09162,0x87634a,2);r(deco,x+4,y+6,w-8,3,0xf1c999);for(let p=x+7;p<x+w-8;p+=11)r(deco,p,y+11,7,12,[0xa1b98b,0xe8b779,0x91b1c7][Math.floor(p/11)%3]);r(deco,x+4,y+23,w-8,3,0x80624b);};
 const table=(x,y,w,h,c=0xc39261)=>{frame(deco,x,y,w,h,c,0x785941,3);r(deco,x+5,y+4,w-10,4,0xf2c997);r(deco,x+8,y+h-5,7,5,0x937153);r(deco,x+w-15,y+h-5,7,5,0x937153);};
 const room=(key,c,trim,topEntrance=false)=>{
  const b=LAYOUT[key];frame(ground,b.x,b.y,b.w,b.h,c,0x9e7757,3);
  for(let y=b.y+23;y<b.y+b.h-10;y+=22){r(ground,b.x+8,y,b.w-16,2,0xe8c29c);}
  const {x,y,w,h}=b, gap=52,half=(w-gap)/2;
  r(deco,x,y,11,h,trim);r(deco,x+w-11,y,11,h,trim);
  if(topEntrance){
   r(deco,x,y,half,11,trim);r(deco,x+half+gap,y,w-half-gap,11,trim);
   r(deco,x,y+h-11,w,11,trim);r(deco,x+half,y-4,gap,8,0xe4c28a);
  }else{
   r(deco,x,y,w,11,trim);
   r(deco,x,y+h-11,half,11,trim);r(deco,x+half+gap,y+h-11,w-half-gap,11,trim);
   r(deco,x+half,y+h-5,gap,7,0xe4c28a);
  }
  r(deco,x+11,y+15,w-22,3,0xfff4d7);
  for(let p=x+21;p<x+w-18;p+=25)r(deco,p,y+4,12,4,0xf0c49d);
 };
 // Aksen hijau tenang dan akses kampung sama persis dengan komposisi 3 kolom × 2 baris.
 r(ground,0,0,960,600,0xa4cd91);
 for(let y=9;y<600;y+=17)for(let x=7;x<960;x+=19)if((x*7+y*11)%17<7)tuft(x,y);
 // JALAN dari denah: jalan silang y=282, dua jalan vertikal x=448 dan x=760.
 frame(ground,418,15,61,570,0xead5af,0xd3b18a,2);
 frame(ground,736,15,49,570,0xead5af,0xd3b18a,2);
 frame(ground,8,261,944,49,0xead5af,0xd3b18a,2);
 for(let x=20;x<955;x+=58){r(ground,x,282,25,3,0xd7b88f);}
 for(let y=28;y<570;y+=38){r(ground,446,y,4,17,0xeedbb7);r(ground,759,y,3,17,0xeedbb7);}
 // jalur masuk tambahan yang jelas, tanpa menutupi blok denah.
 for(const [x,y,w,h] of [[124,235,43,29],[595,237,27,28],[192,307,37,34],[590,308,35,34],[859,308,24,34]]){
  r(ground,x,y,w,h,0xf0d9b7);
  for(let a=x+5;a<x+w-4;a+=17)r(ground,a,y+7,8,3,0xdfbb91);
 }
 // Sudut taman di blok yang tidak menghalangi jalan.
 for(const [x,y] of [[21,243],[401,248],[486,245],[724,245],[940,246],[24,568],[400,563],[483,565],[728,565],[939,562]])bush(x,y);
 for(const [x,y] of [[18,45],[943,58],[18,384],[946,390],[397,44]])tree(x,y);
 for(const [x,y,c] of [[31,323,0xf2b7a0],[407,319,0xf4da8d],[485,308,0xe2acd0],[728,309,0xffd59e],[942,323,0xe3c3ec],[25,574,0xffd69c],[709,572,0xf8bac3]])flower(x,y,c);
 // RUMAH PEMAIN di kiri atas: potongan interior terbuka sepanjang permainan.
 room('home',0xf6dfbd,0xb68168);
 label('RUMAH PEMAIN',144,32,14);
 frame(deco,68,99,51,81,0xa3bacd,0x718a9b,3);
 r(deco,76,105,36,19,0xfff9ea);r(deco,77,128,34,45,0xc4dcda);
 for(let row=0;row<3;row++)for(let col=0;col<2;col++)r(deco,79+col*17,135+row*11,15,9,(row+col)%2?0xe9d1bf:0xa9c4bc);
 shelf(132,78,73);shelf(165,171,52);
 // kompor tetap di dalam hitbox pada denah kiri atas
 frame(deco,171,107,47,46,0x91ada2,0x668071,3);
 for(const x of [181,199]){frame(deco,x,115,13,14,0x43545b,0x778c86,1);r(deco,x+4,118,6,6,0x697a74);}
 r(deco,175,142,39,7,0xe4ddc9);
 table(144,174,55,30);r(deco,155,181,17,12,0xf9f4e8);r(deco,176,182,13,9,0xe4a874);
 r(deco,120,182,17,17,0xdab38a);r(deco,123,186,10,7,0xf3d4a4);
 flowerBox(58,219,58);
 r(deco,60,191,13,19,0xb88165);r(deco,63,189,7,4,0x6ea16b);
 // KEBUN kecil di sebelah kanan rumah, tetap 3 petak interaktif.
 const garden=LAYOUT.garden;
 frame(ground,garden.x,garden.y,garden.w,garden.h,0xbdab83,0x8c7756,2);
 label('KEBUN',322,45,13);
 for(let y=60;y<=141;y+=15){r(deco,254,y,4,8,0xc49b70);r(deco,387,y,4,8,0xc49b70);}
 for(let x=261;x<388;x+=21){r(deco,x,58,5,10,0xb58b5f);}
 // PETERNAKAN menempel di area rumah, bukan di pojok kanan peta.
 label('TERNAK',325,150,12);
 // RUMAH WARGA bagian tengah atas — interior terbuka, bukan label placeholder.
 room('village',0xf2dcbf,0xa98265);
 label('RUMAH WARGA',606,32,14);
 frame(deco,551,106,54,40,0xceb48f,0x947255,3);
 r(deco,557,114,41,11,0xfaf4e6);r(deco,557,130,41,6,0xa9c5b8);
 shelf(626,83,67);table(630,169,50,32,0xc19a73);
 r(deco,648,177,16,12,0xfff0d7);
 flowerBox(509,220,70);
 frame(deco,509,86,27,36,0xa4c6cc,0x9b7861,2);
 r(deco,521,88,3,32,0xfff4d6);r(deco,511,102,23,3,0xfff4d6);
 // KOLAM di kanan atas ditambahkan di FarmArt sesuai pond footprint.
 // PASAR TRADISIONAL: blok kiri bawah dengan meja dan 2 kios berbeda.
 room('market',0xf3ddb4,0xb57c63,true);
 label('PASAR TRADISIONAL',210,322,14);
 for(let i=0;i<13;i++){r(deco,48+i*26,336,26,9,i%2?0xffe7bc:0xe18e83);}
 shelf(72,364,126);shelf(233,367,123);
 table(84,392,204,35,0xb8865a);
 for(let x=95;x<282;x+=22){r(deco,x,386,16,9,0x82aa65);r(deco,x+3,382,10,6,(x%3)?0xeab073:0xa9c57d);}
 for(let x=94;x<283;x+=25){r(deco,x,412,19,10,0xa5784d);r(deco,x+3,406,12,8,0xe3b774);}
 table(94,465,107,26,0xc49c70);table(226,466,103,25,0xc49c70);
 for(const [x,y] of [[114,453],[265,451],[295,445]]){r(deco,x,y,19,13,0xdab47d);r(deco,x+5,y-6,10,8,0x74ad65);}
 flowerBox(59,529,92);
 // RESTORAN SEHAT: blok tengah bawah, interior bebas dimasuki dari jalan.
 room('restaurant',0xf3d6bc,0xb88269,true);
 label('RESTORAN SEHAT',607,322,14);
 for(let i=0;i<9;i++)r(deco,504+i*24,335,24,9,i%2?0xf8e6b2:0xc98274);
 shelf(515,360,64);
 table(533,395,102,36,0xb98961);
 for(let x=543;x<631;x+=30){frame(deco,x,383,20,15,0xf5ecdb,0xb2a79b,1);r(deco,x+6,387,8,6,x%2?0x80aa7b:0xe5b073);}
 table(522,482,49,31,0xd3a881);table(639,481,51,31,0xd3a881);
 frame(deco,630,366,60,21,0x58796b,0x745944,2);
 r(deco,636,373,42,2,0xf5e9c2);r(deco,637,379,34,2,0xf5e9c2);
 flowerBox(505,524,73);
 // TOKO SWALAYAN: blok kanan bawah, interior berbeda dari pasar.
 room('store',0xe7e4cb,0x8aa78b,true);
 label('TOKO SWALAYAN',867,322,12);
 frame(deco,831,389,55,35,0x9cbaa2,0x6d8c7e,2);
 for(let x=836;x<882;x+=12){r(deco,x,395,9,20,[0xe6ae6f,0xa8c0db,0xf0d19d][Math.floor(x/13)%3]);}
 shelf(822,449,94);shelf(824,499,89);
 r(deco,820,363,31,17,0xa7d3d8);r(deco,824,366,22,4,0xe7f5e7);
 frame(deco,882,364,35,17,0xc5a56e,0x887450,2);
 label('MINIMARKET',870,541,11);
 return OBSTACLES;
}
