import {OBSTACLES,LAYOUT} from './WorldGeometry.js';
const C={grass:0x91c881,road:0xe8d1a4,wall:0x986e57};
export function createTextures(scene){
 const g=scene.make.graphics({x:0,y:0},false);
 const r=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h)};
 const characters=[
  ['player',0x77a6da,0x554135,0xf3c69e,false],
  ['sari',0xd98e7b,0x654634,0xeabd94,false],
  ['chef',0xe9e5d6,0x654b36,0xf0c49c,true]
 ];
 // Sprites are generated at runtime: 4 directions, two alternating walking poses.
 for(const [name,shirt,hair,skin,chefHat] of characters){
  for(const direction of ['down','up','side']){
   for(const frame of [0,1,2]){
    g.clear();
    const moving=frame!==0,leg=frame===1?2:-2;
    r(4,42,24,3,0x5c8d65); // soft pixel shadow
    // Boots and legs alternate on each step so NPCs really walk.
    r(9+(moving?leg:0),35,7,9,0x5c677e);
    r(19-(moving?leg:0),35,7,9,0x5c677e);
    r(7,22,21,15,shirt);
    r(5,24+(frame===1?2:0),5,11,skin);
    r(27,24+(frame===2?2:0),4,11,skin);
    r(8,5,20,20,skin);
    if(direction==='up'){
     r(7,1,22,15,hair);r(9,13,18,6,hair);
    }else if(direction==='side'){
     r(8,1,20,9,hair);r(8,8,5,9,hair);
     r(22,16,3,3,0x4d3b31);r(27,17,3,3,skin);
    }else{
     r(7,1,22,8,hair);r(7,7,4,8,hair);r(25,7,4,8,hair);
     r(12,16,3,3,0x433831);r(22,16,3,3,0x433831);
     r(15,21,7,2,0xc08074);
    }
    // Outline wajah, sorot rambut, motif baju dan detail sepatu per karakter.
    r(8,5,2,14,0x7e5945);
    if(direction==='down'){
      r(11,4,11,2,0x876a54);
      r(12,15,2,2,0xffffff);r(22,15,2,2,0xffffff);
      r(10,22,4,2,0xe7a493);r(24,22,4,2,0xe7a493);
    }else if(direction==='up'){
      r(11,3,15,2,0x8f6d51);r(13,12,12,2,0x49362e);
    }else{r(12,4,10,2,0x91745b);r(21,15,2,2,0xffffff);}
    r(7,23,21,3,0xffffff);
    r(14,26,7,7,0xf4dba5);
    r(16,27,3,3,name==='sari'?0xd67975:name==='chef'?0x8db7a3:0x82a8cf);
    r(9+(moving?leg:0),42,7,2,0x393e52);
    r(19-(moving?leg:0),42,7,2,0x393e52);
    if(name==='sari'){
      r(8,27,5,9,0xf0b7a2);r(22,27,5,9,0xf0b7a2);
      if(direction==='down')r(7,4,2,14,0x654634);
      r(12,33,13,4,0xbd736c);
    }
    if(name==='player'){
      // Tas selempang dan garis kantong dari bahan pixel art.
      if(direction==='up')r(19,24,9,10,0x947257);
      else {r(9,26,15,3,0xe6bc88);r(20,30,6,7,0xb99168);}
      r(11,24,3,12,0x5b83b6);
      r(24,24,3,12,0x5b83b6);
    }
    if(chefHat){
      r(8,1,21,5,0xffffff);r(11,0,15,3,0xffffff);
      r(10,7,17,4,0xdde7dc);
      r(13,26,11,12,0xfaf6e8);
      r(13,27,2,12,0xd5dfd4);
      r(19,29,3,3,0x9fc9a3);
      r(19,35,3,3,0x9fc9a3);
    }
    g.generateTexture(name+'-'+direction+'-'+frame,36,48);
   }
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
 table(533,395,145,36,0xb98961);
 for(let x=548;x<671;x+=35){frame(deco,x,383,20,15,0xf5ecdb,0xb2a79b,1);r(deco,x+6,387,8,6,x%2?0x80aa7b:0xe5b073);}
 table(522,482,49,31,0xd3a881);table(639,481,51,31,0xd3a881);
 frame(deco,630,366,60,21,0x58796b,0x745944,2);
 r(deco,636,373,42,2,0xf5e9c2);r(deco,637,379,34,2,0xf5e9c2);
 flowerBox(505,524,73);
 // TOKO SWALAYAN: blok kanan bawah, interior berbeda dari pasar.
 room('store',0xe7e4cb,0x8aa78b,true);
 label('TOKO SWALAYAN',867,322,12);
 frame(deco,825,389,84,35,0x9cbaa2,0x6d8c7e,2);
 for(let x=831;x<905;x+=13){r(deco,x,395,9,20,[0xe6ae6f,0xa8c0db,0xf0d19d][Math.floor(x/13)%3]);}
 shelf(822,449,94);shelf(824,499,89);
 r(deco,820,363,31,17,0xa7d3d8);r(deco,824,366,22,4,0xe7f5e7);
 frame(deco,882,364,35,17,0xc5a56e,0x887450,2);
 label('MINIMARKET',870,541,11);
 return OBSTACLES;
}
