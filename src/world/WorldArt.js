import {OBSTACLES,LAYOUT} from './WorldGeometry.js';

// v1.4: semua sprite dan pose kegiatan digambar secara prosedural.
// Kunci tekstur sprite lama dipertahankan agar posisi, NPC, dan save tetap kompatibel.
export const CHARACTER_ACTIONS=Object.freeze(['sleep','water','harvest','cook','fish','plant']);
export function createTextures(scene,onlyPlayer=false){
 const appearance=scene.game.state?.data?.character||{};
 const shirts={biru:[0x7caad3,0x4c83b0],merah:[0xe6a0a0,0xb86e79],hijau:[0x91c493,0x578d65],ungu:[0xb9a3df,0x8973b8],kuning:[0xf0d28b,0xc6a25c]};
 const shirt=shirts[appearance.shirt]||shirts.biru;
 const g=scene.make.graphics({x:0,y:0},false);
 const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const palette={
  player:{shirt:shirt[0],shade:shirt[1],hair:0x594536,skin:0xf3c8a5,accent:0xe4c184},
  sari:{shirt:0xe4a18c,shade:0xc67877,hair:0x674637,skin:0xf1cba5,accent:0xf0d5a9},
  chef:{shirt:0xf0eee4,shade:0xc4d7cd,hair:0x665041,skin:0xf1c6a4,accent:0x8abc9d},
  tani:{shirt:0x8fb47b,shade:0x517c56,hair:0x594633,skin:0xeac39e,accent:0xd6b171},
  nia:{shirt:0xe6b4c3,shade:0xb67d9f,hair:0x473746,skin:0xf2caa9,accent:0xf5d78f},
  mayor:{shirt:0x708ca8,shade:0x4b6586,hair:0x49413c,skin:0xe9c19e,accent:0xe8d58c},
  rani:{shirt:0xa6a9d6,shade:0x747ab3,hair:0x51404c,skin:0xeec7a7,accent:0xf0d595}
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
  // Rambut pemain disesuaikan dengan jenis kelamin, tanpa menutupi mata.
  if(name==='player'&&appearance.gender==='perempuan'){
   if(back){rect(5,9+bounce,5,21,p.hair);rect(29,9+bounce,5,21,p.hair);}
   else{rect(4,9+bounce,5,21,p.hair);rect(29,9+bounce,5,21,p.hair);}
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
   // Topi jerami dan sepatu bot Pak Yanto, unik dari karakter pemain.
   rect(3,4+bounce,33,5,0xc5a36f);
   rect(10,-1+bounce,18,8,0xe5c58b);
   rect(13,1+bounce,12,3,0xf8e0a2);
   rect(11,28+bounce,16,8,0x6c9772);
   rect(12,35+bounce,6,5,0x765b46);
   rect(21,35+bounce,6,5,0x765b46);
  }else if(name==='rani'){
   // Pustakawan dengan kacamata, celemek ungu, dan buku kecil.
   if(!back){rect(10,14+bounce,8,6,0x655769);rect(21,14+bounce,8,6,0x655769);
    rect(17,15+bounce,5,2,0xd5d0be);rect(12,16+bounce,4,3,0xe8e2ce);rect(23,16+bounce,4,3,0xe8e2ce);}
   rect(11,29+bounce,17,9,0x8c8fc2);
   rect(28,26+bounce,8,12,0x9fb6bc);rect(30,28+bounce,4,7,0xf4eed2);
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
 for(const name of (onlyPlayer?['player']:Object.keys(palette))){
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
 }).setOrigin(.5).setDepth(550).setVisible(false);
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
 // Lampu fisik rumah pemain dihapus; furnitur dan interior tetap utuh.
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
 // PERPUSTAKAAN GIZI BARU v2.2: tetap memakai ruang dan pintu lama.
 room('village',0xf6e4c9,0xa98265);
 label('PERPUSTAKAAN GIZI',606,32,13);
 // Rak buku berwarna-warni sepanjang dinding atas dan sisi kiri.
 for(const [x,y,w] of [[523,80,81],[623,80,71],[516,115,70]]){
  frame(deco,x,y,w,30,0xb98b62,0x856249,3);
  for(let i=0;i<Math.floor((w-9)/10);i++)r(deco,x+6+i*10,y+6,7,17,[0x91b6a2,0xe4b47f,0xa8a0ca,0xe1a2a2,0x9bbdd2][i%5]);
  r(deco,x+4,y+25,w-8,3,0x805d47);
 }
 // Meja baca kelompok dengan buku terbuka dan alat tulis.
 table(624,164,64,34,0xc49b75);
 r(deco,637,172,17,13,0xfaf0dd);r(deco,655,172,17,13,0xfaf0dd);
 r(deco,654,173,2,13,0xbfa68a);r(deco,645,177,5,2,0x9eb6a1);
 // Pojok baca: karpet, bantal dan buku bergambar.
 frame(deco,547,166,60,34,0xb6d0b6,0x8ba88f,2);
 for(const [x,y,c] of [[552,173,0xe9b9a4],[579,183,0xc3b7dc]])frame(deco,x,y,19,13,c,0xa58f88,2);
 r(deco,573,171,12,9,0xf9f1d7);r(deco,579,171,2,9,0xd8bd8f);
 // Papan edukasi Isi Piringku dan tanaman hias.
 frame(deco,619,120,71,30,0x668d7d,0x84634d,2);
 r(deco,625,126,38,3,0xf8e9cc);r(deco,625,133,27,3,0xf8e9cc);
 r(deco,666,127,17,15,0xf5e8d1);r(deco,670,130,7,6,0x83b56f);
 flowerBox(509,220,70);
 frame(deco,509,86,10,35,0x9cbdad,0x83664c,2);
 r(deco,511,79,6,10,0x74a96f);
 // KOLAM di kanan atas ditambahkan di FarmArt sesuai pond footprint.
 // PASAR TRADISIONAL BARU: tetap pada blok lama dan pintu utara tetap terbuka.
 room('market',0xf4ddbd,0xb57c63,true);
 label('PASAR TRADISIONAL',210,322,14);
 // Detail atap/kanopi warna-warni pada sisi atas, tanpa menutup akses.
 for(let i=0;i<14;i++)r(deco,51+i*24,337,23,9,i%2?0xf5e8cb:0xd98e85);
 // Rak belakang berisi aneka sayur, buah, dan bumbu.
 frame(deco,111,358,191,47,0xa57a55,0x87664d,3);
 for(let j=0;j<2;j++)for(let i=0;i<9;i++){
  const x=120+i*19,y=365+j*17;
  r(deco,x,y,15,12,0xb98a5d);
  r(deco,x+2,y+2,11,8,[0x7fae65,0xe9aa57,0xe6c35d,0xa6bf77,0xd88972][(i+j)%5]);
 }
 // Kios kiri dan kanan, tengah tetap kosong sebagai lorong pejalan.
 for(const [x,awning] of [[58,0xd78380],[286,0x7abac5]]){
  r(deco,x,404,45,8,0x936a4e);
  for(let i=0;i<5;i++)r(deco,x+i*9,399,9,9,i%2?0xfff2dc:awning);
  r(deco,x+3,416,39,33,0xb78c63);
  for(let row=0;row<2;row++)for(let col=0;col<3;col++){
   const cx=x+7+col*11,cy=419+row*13;
   r(deco,cx,cy,9,10,0xcda477);
   r(deco,cx+2,cy+1,6,7,[0x83ad64,0xf1bc58,0xe08b5f][(row+col)%3]);
  }
 }
 // Meja hasil panen bagian bawah, tanpa menghalangi pintu di tengah sisi utara.
 for(const [x,w] of [[85,98],[233,94]]){
  table(x,474,w,29,0xbd9269);
  for(let i=0;i<4;i++){
   const bx=x+9+i*21;
   r(deco,bx,464,17,12,0xa87b4f);
   r(deco,bx+3,460,11,9,[0x80ae63,0xf2c458,0xe59b6d,0xa5c778][i]);
  }
 }
 // Peti, tanaman dan bunga di sudut pasar; jalur utama tetap lapang.
 for(const [x,y] of [[62,510],[337,510]]){
  r(deco,x,y,29,19,0xb48b63);r(deco,x+4,y+4,21,11,0xd8b48a);
  r(deco,x+8,y-7,13,12,0x80ad70);
 }
 flowerBox(113,527,55);flowerBox(270,527,48);
 // RESTORAN GIZI SEHAT BARU v1.99: renovasi visual di footprint asli.
 // Pintu utara x~607, dapur interaktif x=687,y=442, dan area gerak NPC tidak berubah.
 room('restaurant',0xf6e2c9,0xb88269,true);
 label('RESTORAN GIZI SEHAT',607,322,13);
 // Kanopi pastel di fasad, mengikuti bentuk bangunan lama.
 for(let i=0;i<9;i++)r(deco,504+i*24,335,24,9,i%2?0xffe9d1:0xdb9584);
 // Dapur terbuka di sisi kanan: rak bahan, meja racik, kompor, dan piring.
 shelf(639,359,58);
 frame(deco,636,394,63,26,0xc4946c,0x926a50,3);
 for(const [x,c] of [[645,0x7eac6b],[662,0xe7b36e],[680,0xd88f79]]){
  r(deco,x,398,13,12,0xf4e8d2);r(deco,x+4,401,6,6,c);
 }
 // Kompor di sisi kanan bawah agar titik interaksi dapur tetap dapat didekati.
 frame(deco,657,468,42,33,0x98aaa4,0x728a84,3);
 for(const x of [668,687]){r(deco,x-5,476,13,13,0x465f5e);r(deco,x-2,479,7,7,0xb9c9c4);}
 // Etalase makanan sehat di kiri, dengan sayur, protein, dan buah.
 frame(deco,515,367,107,41,0xc89a72,0x99704e,3);
 r(deco,519,371,99,7,0xf9ebd6);
 for(let i=0;i<5;i++){
  const x=522+i*19;
  r(deco,x,383,15,16,0xf1e6cf);
  r(deco,x+3,386,9,9,[0x85b96b,0xe5ad65,0xe39a88,0xa6c781,0xe9c35f][i]);
 }
 // Meja kasir di sisi kiri, lorong tengah menuju dapur tetap terbuka.
 table(518,425,73,25,0xc99a73);
 r(deco,530,418,20,10,0xf6e7d0);r(deco,556,419,16,8,0x8daaa0);
 // Dua set meja makan di sudut bawah, bukan di jalur masuk.
 for(const [x,y] of [[532,482],[620,482]]){
  table(x,y,54,29,0xd0a27c);
  r(deco,x+21,y+8,13,11,0xf9eddd);
  r(deco,x+25,y+11,6,5,0x83b46d);
  r(deco,x+4,y-11,18,8,0xae8868);r(deco,x+4,y+30,18,8,0xae8868);
 }
 // Papan menu sehat dan tanaman hias.
 frame(deco,634,364,64,22,0x638677,0x87664c,2);
 for(let i=0;i<3;i++)r(deco,641,370+i*5,43-i*7,2,0xf8ead1);
 flowerBox(505,524,73);flowerBox(646,524,52);
 // RUMAH PAK YANTO & BU SARI, blok kanan bawah.
 // Denah luar dan pintu masuk tidak berubah; interior terbuka seperti rumah pemain.
 room('store',0xf1dec4,0xa17f67,true);
 label('RUMAH PAK YANTO',869,319,11);
 label('& BU SARI',869,334,11);
 // Tempat tidur di kiri, kursi dan tanaman di kanan. Tengah kosong agar NPC bisa masuk.
 frame(deco,819,393,34,51,0xa7c9bb,0x6e938b,3);
 r(deco,824,397,24,12,0xf9f1e2);
 r(deco,825,413,22,25,0xb5d6c4);
 r(deco,825,438,22,4,0xe5c49b);
 table(887,390,24,18,0xc39169);
 r(deco,891,395,14,6,0xf5e4c7);
 frame(deco,886,489,26,24,0xcdb38d,0x927357,2);
 r(deco,892,496,14,11,0xe8d8b6);
 r(deco,824,487,11,24,0x9b734f);
 r(deco,826,481,8,12,0x6a9f6b);
 flowerBox(842,521,50);
 label('RUMAH KELUARGA',869,545,10);
 return OBSTACLES;
}
