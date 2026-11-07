import {OBSTACLES} from './WorldGeometry.js';
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
  // Semua interior digambar langsung di WorldScene. Tidak ada perpindahan scene.
  const ground = scene.add.graphics().setDepth(-100);
  const deco = scene.add.graphics().setDepth(-75);
  const ink = 0x6c624e, cream = 0xfff4d5;
  const r = (g,x,y,w,h,c) => { g.fillStyle(c,1); g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); };
  const outline = (g,x,y,w,h,c,edge=ink,t=3) => { r(g,x-t,y-t,w+t*2,h+t*2,edge); r(g,x,y,w,h,c); };
  const sign = (s,x,y,size=15,color='#584e41') => scene.add.text(x,y,s,{
    fontFamily:'monospace',fontSize:size+'px',fontStyle:'bold',
    color,backgroundColor:'#fff2d3',padding:{x:5,y:3}
  }).setOrigin(.5).setDepth(500);
  const flower = (x,y,c=0xfbf0c3) => {
    r(ground,x-1,y-4,2,6,0x568c56);
    r(ground,x-4,y-7,8,4,c);r(ground,x-2,y-9,4,8,c);r(ground,x-1,y-6,2,2,0xe3b855);
  };
  const pebble=(x,y)=>{r(ground,x,y,6,3,0xdec79e);r(ground,x+2,y-1,3,1,0xffedc9)};
  const bush=(x,y)=> {
    r(ground,x-15,y,30,8,0x567f55);
    r(ground,x-12,y-9,24,14,0x609963);
    r(ground,x-6,y-14,15,13,0x85b874);
    r(ground,x+4,y-8,4,3,0xc2d9a0);
  };
  const tree=(x,y)=> {
    r(deco,x-7,y,14,29,0x947045);r(deco,x-4,y+3,5,16,0xb18a55);
    outline(deco,x-25,y-22,51,30,0x58885a,0x3c714d,2);
    r(deco,x-20,y-33,40,20,0x6ba86b);r(deco,x-12,y-40,26,14,0x80bb79);
    r(deco,x-17,y-23,8,4,0xa2d08a);r(deco,x+6,y-30,7,4,0xa2d08a);
    r(deco,x-3,y-20,4,4,0xe9b66f);
  };
  const flowerBox=(x,y,w)=> {
    outline(deco,x,y,w,15,0xb07d55,0x785c45,2);
    for(let i=9;i<w-5;i+=13){r(deco,x+i,y-8,3,11,0x659b5d);r(deco,x+i-4,y-10,10,6,i%2?0xf4c2a7:0xf4df89);}
  };
  const rug=(x,y,w,h,color)=> {
    outline(deco,x,y,w,h,color,0xc5a782,3);
    for(let q=x+11;q<x+w-8;q+=16){r(deco,q,y+7,7,3,0xffe8c1);r(deco,q,y+h-10,7,3,0xffe8c1);}
  };
  const plant=(x,y)=>{
    r(deco,x-6,y-1,13,12,0xac7963);r(deco,x-4,y+3,9,3,0xe7af88);
    r(deco,x-2,y-22,4,23,0x528a62);
    r(deco,x-13,y-18,12,8,0x6ea46d);r(deco,x+2,y-22,12,9,0x6fae71);
    r(deco,x-6,y-28,11,12,0x90c284);
  };
  const floor=(x,y,w,h,c,detail)=>{
    outline(ground,x,y,w,h,c,0x956e58,3);
    for(let py=y+13;py<y+h-9;py+=23) {
      r(ground,x+8,py,w-16,2,detail);
      for(let px=x+(py%2?20:36);px<x+w-10;px+=61)r(ground,px,py-10,2,10,detail);
    }
  };
  const wall=(x,y,w,h,c)=>{r(deco,x,y,w,h,0x785b49);r(deco,x+2,y+2,w-4,h-4,c)};
  const house=(x,y,w,h,floorColor,trim)=> {
    floor(x,y,w,h,floorColor,0xe5c39d);
    // Cutaway: hanya dinding atas dan sisi, bagian depan memiliki bukaan lebar.
    wall(x,y,w,13,trim);wall(x,y,12,h,trim);wall(x+w-12,y,12,h,trim);
    wall(x,y+h-12,(w-52)/2,12,trim);
    wall(x+(w+52)/2,y+h-12,(w-52)/2,12,trim);
    r(deco,x+(w-52)/2,y+h-7,52,5,0xd2a170);
    r(deco,x+13,y+15,w-26,3,0xfff4d4);
    for(let q=0;q<3;q++){r(deco,x+27+q*24,y+3,13,5,0xd5a478);}
  };
  const shelf=(x,y,w=66)=>{
    outline(deco,x,y,w,28,0xb78458,0x795b47,2);
    r(deco,x+5,y+4,w-10,4,0xe6bc81);
    for(let i=0;i<Math.floor((w-10)/11);i++){r(deco,x+8+i*11,y+10,6,14,[0x89ae83,0xf1bc76,0x9cb4cb][i%3]);}
    r(deco,x+5,y+21,w-10,3,0x805e48);
  };
  const table=(x,y,w,h,color=0xc69465)=>{
    outline(deco,x,y,w,h,color,0x805d46,3);
    r(deco,x+4,y+3,w-8,4,0xe3b98b);
    r(deco,x+8,y+h-5,9,5,0x88634c);r(deco,x+w-18,y+h-5,9,5,0x88634c);
  };
  const chair=(x,y)=>{
    outline(deco,x,y,20,19,0xd5ad7d,0x86644e,2);
    r(deco,x+4,y+4,12,10,0xeacf9f);
  };
  // Padang rumput pastel dengan variasi rerumputan yang konsisten.
  r(ground,0,0,960,600,0x9dcb86);
  for(let y=6;y<600;y+=16)for(let x=8;x<960;x+=18){
    const n=(x*13+y*29)%19;
    if(n<8){r(ground,x,y,3,5,n%2?0x82bb79:0x88bd78);r(ground,x+5,y+2,2,3,0xb5d798);}
  }
  // Lintasan kampung: tetap pada koordinat v0.3 agar NPC & quest tak berpindah.
  outline(ground,432,350,96,251,0xebd8b1,0xc8b58b,1);
  outline(ground,0,425,960,65,0xebd8b1,0xc8b58b,1);
  outline(ground,126,351,75,99,0xebd8b1,0xc8b58b,1);
  outline(ground,775,349,75,100,0xebd8b1,0xc8b58b,1);
  // v1.1: jalan memutar ke kandang. Jalur di sisi kanan restoran tetap dapat dilalui.
  outline(ground,922,190,23,236,0xf0dabb,0xc5a880,1);
  outline(ground,851,186,93,22,0xf0dabb,0xc5a880,1);
  for(let y=217;y<416;y+=29){r(ground,929,y,11,3,0xddc39d);}
  for(let x=864;x<929;x+=23){r(ground,x,194,13,3,0xdac19c);}
  // Titian kecil dari jalan desa menuju dermaga kolam.
  for(let x=749;x<831;x+=18){r(ground,x,491,13,4,0xdfbd8f);}

  for(let x=16;x<950;x+=65){r(ground,x,455,22,3,0xd8bd94);pebble(x+27,468);}
  for(let y=369;y<594;y+=44){r(ground,467,y,26,3,0xd8bd94);}
  for(const [x,y] of [[24,387],[225,389],[643,379],[931,402],[116,510],[716,521]])bush(x,y);
  for(const [x,y,c] of [[31,361,0xf2b8ac],[211,519,0xf3e6a7],[680,406,0xd8bbeb],[605,543,0xffe3ae],[878,519,0xffe3ae],[27,494,0xffd3bd],[683,540,0xf3b6b0]])flower(x,y,c);
  for(const [x,y] of [[46,558],[81,539],[229,557],[630,569],[674,564],[908,574]])pebble(x,y);
  // Kebun mini: bedeng sayur rapi dan pagar kayu.
  sign('KEBUN SAYUR',131,55,14);
  outline(ground,24,78,192,110,0xc2a17a,0x877554,3);
  for(let row=0;row<3;row++)for(let col=0;col<5;col++){
    const x=36+col*36,y=85+row*32;
    r(ground,x,y,27,23,0x8d684b);r(ground,x+3,y+3,21,17,0xab7a53);
    r(ground,x+7,y+9,6,7,0x4b9258);r(ground,x+14,y+5,8,13,0x6cae69);
    r(ground,x+12,y+4,4,7,(row+col)%2?0xb7d06d:0xf0a362);
  }
  for(let x=19;x<=223;x+=24){r(deco,x,189,5,13,0x946f4d);r(deco,x,194,18,4,0xd0ac79);}
  // Rumah dollhouse: ubin dan dinding tetap tampak dari luar.
  house(258,90,364,265,0xf6dfbb,0xb88067);
  sign('RUMAH CERIA',440,73,17);
  // Zona kasur, dapur, sudut makan. Jangan mengubah hitbox lama.
  rug(277,121,115,125,0xdbb3a1);
  // Kasur sesuai posisi collider asli x289..357 / y137..230.
  outline(deco,289,137,68,93,0x9cafc7,0x647d91,3);
  r(deco,298,145,50,23,0xfff4e1);r(deco,304,150,39,10,0xfefefe);
  r(deco,298,172,50,48,0xc3d6e0);
  r(deco,301,186,44,4,0xe6eff0);r(deco,303,203,42,3,0xe6eff0);
  shelf(391,130,67);
  plant(381,223);
  // Kabinet dapur di dinding belakang.
  shelf(520,114,77);
  // Kompor x511..594 / y153..219.
  outline(deco,511,153,83,66,0x9cb1a2,0x657c6b,3);
  r(deco,516,157,73,12,0xdce4d3);
  for(const x of [528,562]){outline(deco,x,176,21,20,0x394d50,0x647173,2);r(deco,x+6,181,9,8,0x697675);}
  r(deco,521,206,64,8,0x738d7a);r(deco,533,210,4,3,0xe2d1ab);r(deco,567,210,4,3,0xe2d1ab);
  rug(396,236,134,82,0xa8c3a2);
  table(423,250,86,53);
  r(deco,433,263,24,16,0xf8ead5);r(deco,439,267,12,7,0xd6dbbb);
  r(deco,475,264,22,17,0xfbf3df);r(deco,482,270,8,8,0xe4ab61);
  chair(396,265);chair(519,265);
  // Jendela depan, rak sepatu, dan keset di sisi pintu.
  outline(deco,272,270,31,48,0xa2b9bc,0x7c715e,2);
  r(deco,286,274,3,40,0xfff4d7);r(deco,275,293,25,3,0xfff4d7);
  flowerBox(554,323,43);
  r(deco,421,353,38,7,0x916e50);r(deco,429,358,23,5,0xc99b68);
  // Pasar tradisional terbuka, tirai kanopi warna-warni.
  house(53,212,213,140,0xf4dda7,0xb67a5c);
  sign('PASAR SEGAR',160,190,16);
  for(let i=0;i<9;i++){
    r(deco,55+i*23,201,23,12,i%2?0xffe7bc:0xe18b80);
    r(deco,55+i*23,211,23,4,i%2?0xc6a471:0xb26b65);
  }
  shelf(84,230,113);
  // Meja pasar tetap sesuai hitbox x80..200, y259..290
  table(80,259,120,31,0xc18d58);
  for(let x=91;x<191;x+=22){r(deco,x,252,14,9,0x719d57);r(deco,x+3,247,8,6,x%2?0xebae5f:0x9cbd70);}
  outline(deco,208,244,34,54,0x9ab37a,0x718b60,2);
  r(deco,213,251,24,7,0xd1e1aa);r(deco,213,264,24,7,0xd1e1aa);
  flowerBox(66,323,65);
  sign('BELANJA  E',163,321,12);
  // Restoran gizi: meja koki, piring dan sudut makan.
  house(703,211,210,140,0xefd5bb,0xb77e60);
  sign('RESTORAN GIZI',808,190,15);
  for(let i=0;i<9;i++){
    r(deco,705+i*23,200,23,13,i%2?0xffe8b5:0xd48771);
    r(deco,705+i*23,211,23,4,i%2?0xcaa07f:0xa86659);
  }
  shelf(720,234,68);
  rug(725,304,147,31,0xe6baa2);
  table(746,268,116,30,0xb8835e);
  for(let x=763;x<=837;x+=36){
    outline(deco,x,257,19,15,0xe7e5d3,0xb9b9a6,1);
    r(deco,x+6,261,7,6,x%2?0x84b47c:0xe7a86e);
  }
  r(deco,733,280,7,25,0x8d6d56);r(deco,866,280,7,25,0x8d6d56);
  plant(887,320);
  // Pohon dan lampu jalan: visual only, tidak menghalangi jalur pemain.
  for(const [x,y] of [[656,105],[667,169],[928,105],[37,544],[915,541]])tree(x,y);
  for(const [x,y] of [[236,410],[643,440],[890,414]]) {
    r(deco,x,y,5,26,0x6d725b);
    outline(deco,x-5,y-11,15,13,0xffdf9c,0x946d4f,2);
    r(deco,x-2,y-8,9,5,0xfff4c8);
  }
  sign('BU SARI • MISI',337,397,12);
  // Detail furnitur tambahan yang tidak mengubah collision atau tata letak.
  // Rak sepatu, selimut bermotif, ubin dapur, teko, dan pot masak.
  for(let i=0;i<4;i++){
    r(deco,302+i*11,184+(i%2)*6,7,3,0xfff7ed);
    r(deco,525+i*16,139,10,3,0xe9c89a);
  }
  r(deco,529,173,21,3,0x768f7e);
  r(deco,534,168,11,6,0x8ea0a2);
  r(deco,538,165,3,3,0xe7e9d7);
  r(deco,556,171,14,6,0xb9b7ae);
  r(deco,560,168,6,3,0xeee2bf);
  r(deco,448,253,22,5,0xe8c49b);
  r(deco,455,258,13,3,0x965f49);
  r(deco,286,284,2,33,0xfffcdf);
  r(deco,281,293,15,2,0xfffcdf);
  // Anyaman keranjang dan tumpukan sayur di pasar.
  for(let i=0;i<5;i++){
    const x=86+i*21;
    r(deco,x,268,17,12,0xb9804f);
    r(deco,x+2,270,13,7,0xe0ad66);
    for(let j=0;j<3;j++)r(deco,x+4+j*4,266-(j%2)*4,5,5,i%2?0xe9b56c:0x77ad67);
    r(deco,x+5,279,11,2,0x8b603f);
  }
  // Papan menu dan tempat duduk pada restoran.
  outline(deco,797,228,70,26,0x5b786b,0x654f44,2);
  r(deco,804,236,41,2,0xf9e8c5);r(deco,804,242,33,2,0xf9e8c5);
  r(deco,847,235,10,10,0xe3b66f);
  r(deco,717,323,23,6,0x986f55);
  r(deco,719,315,4,9,0xb78e69);
  r(deco,740,319,5,5,0xb78e69);
  // Bunga hias di ambang jendela rumah.
  for(let i=0;i<4;i++) {
    r(deco,274+i*6,271,3,5,0x76a16b);
    r(deco,272+i*6,268,6,5,i%2?0xf7cb91:0xf2a7ad);
  }
  // Hitbox dan titik interaksi tersentral di WorldGeometry.js.
  return OBSTACLES;

}
