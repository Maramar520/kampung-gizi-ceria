// Pantai selatan: peta lama tidak diubah, kawasan baru dimulai pada y=600.
export class SouthCoastArt {
 constructor(scene){
  // Tampil di atas tanah kampung (-100), namun tetap di bawah dekorasi (-75).
  // Dengan begitu sambungan jalan pada y=565–600 tidak tertutup lapisan tanah.
  const g=scene.add.graphics().setDepth(-90);
  const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  // Pantai berpasir, batas pantai berlekuk, dan laut biru pastel.
  rect(0,600,1720,112,0xf3dba5);
  rect(0,710,1720,490,0x65bfd0);
  for(let x=0;x<1720;x+=30){
   const y=703+Math.round(Math.sin(x*.035)*5);
   rect(x,y,30,9,0x9ddcdb);
   rect(x,y+10,30,3,0xd6f0dc);
  }
  // Pasir dan rumput di tepi kampung.
  rect(0,600,1720,17,0xf3dba5);
  for(let x=18;x<1720;x+=47){
   rect(x,627+(x%5)*9,5,3,0xe3c58e);
   rect(x+12,670+(x%7)*3,3,3,0xffedca);
  }
  // Jalan masuk dari jalan tengah lama menuju pantai dan dermaga.
  // Jalur utama x=736–785 diteruskan tanpa celah hingga bibir dermaga.
  rect(736,565,49,81,0xead5af);
  rect(735,646,56,54,0xe7cb95);
  for(let y=574;y<693;y+=24)rect(757,y,4,13,0xf5e3bf);
  // Dermaga kayu panjang, terhubung dari pasir ke laut.
  rect(733,695,60,111,0x896b50);
  rect(739,692,48,113,0xc99566);
  for(let y=699;y<803;y+=13)rect(741,y,44,3,0xa97a55);
  for(let y=702;y<805;y+=32){
   rect(729,y,10,13,0x73573f);rect(787,y,10,13,0x73573f);
  }
  // Ombak lembut, ikan dan buih air di sekitar dermaga.
  for(let i=0;i<36;i++){
   const x=24+(i*83)%1670,y=731+(i*41)%106;
   if(x>711&&x<818)continue;
   rect(x,y,15+(i%3)*6,2,i%2?0xb4e7e6:0x85d5dc);
  }
  for(const [x,y] of [[118,765],[331,799],[1040,760],[1218,814]]){
   rect(x,y,13,4,0x4b9da9);rect(x+11,y-2,5,8,0x4b9da9);
  }
  // Buih ombak putih kecil menyebar hingga laut bagian selatan saat zoom out.
  // Posisi deterministik agar tidak berkedip saat kamera bergerak.
  for(let i=0;i<155;i++){
   const x=17+(i*127+Math.floor(i/13)*43)%1680;
   const y=732+(i*79+Math.floor(i/11)*31)%452;
   if(y<845&&x>995&&x<1195)continue; // jangan menutupi pulau kecil
   const width=8+(i%4)*4;
   rect(x,y,width,2,i%3===0?0xf3ffff:0xd5f3f1);
   if(i%4===0)rect(x+4,y+4,Math.max(5,width-9),2,0xb7e8e8);
  }
  // Ikan kecil berbentuk pixel, dengan ekor segitiga sederhana.
  for(let i=0;i<31;i++){
   const x=38+(i*181+Math.floor(i/7)*29)%1630;
   const y=750+(i*103+Math.floor(i/5)*19)%427;
   if(y<850&&x>1005&&x<1195)continue;
   const c=i%3===0?0x397e94:i%3===1?0x4a9ca7:0x7ab6ba;
   rect(x,y,11,5,c);
   rect(x+11,y+1,4,3,c);
   rect(x-4,y-3,4,4,c);
   rect(x-4,y+4,4,4,c);
   rect(x+7,y+1,2,2,0xe7f5e9);
  }
  // Pulau kecil yang bisa dikunjungi dengan perahu, terpisah dari dermaga.
  g.fillStyle(0xe9d69e);g.fillRoundedRect(1020,723,160,112,36);
  g.fillStyle(0xa7cf8c);g.fillRoundedRect(1040,737,120,76,26);
  for(const [x,y] of [[1055,753],[1140,785]]){
   rect(x,y,7,31,0xa4774d);
   g.fillStyle(0x6caa78);g.fillCircle(x-9,y-6,16);g.fillCircle(x+10,y-12,17);
  }
  scene.add.text(1054,810,'🏝️ PULAU KECIL',{fontFamily:'monospace',fontSize:'12px',color:'#6e6546',backgroundColor:'#fff1cf',padding:{x:4,y:2}}).setDepth(600);
  // Perahu menunggu di samping dermaga.
  g.fillStyle(0x8d684b);g.fillEllipse(822,727,42,20);
  rect(820,702,3,23,0x755b45);
  g.fillStyle(0xfff0d6);g.fillTriangle(824,704,824,724,845,724);
  // Payung pantai, kursi santai, kelapa dan dekorasi.
  for(const [x,y] of [[170,657],[1130,650]]){
   rect(x,y+4,4,30,0x9a7959);
   g.fillStyle(0xf1a6a0);g.fillCircle(x+2,y,23);
   rect(x-20,y-3,44,5,0xffd3b2);
   rect(x+31,y+15,42,8,0xb98c61);
  }
  for(const [x,y] of [[74,639],[1273,638]]){
   rect(x,y,9,44,0xa4774d);
   g.fillStyle(0x68ad77);g.fillCircle(x-13,y-5,20);g.fillCircle(x+12,y-10,22);g.fillCircle(x+2,y-24,19);
  }
  scene.add.text(620,619,'🏖️ PANTAI SELATAN',{fontFamily:'monospace',fontSize:'15px',fontStyle:'bold',color:'#715b43',backgroundColor:'#fff1cf',padding:{x:6,y:4}}).setDepth(600);
  scene.add.text(757,764,'🎣',{fontSize:'27px'}).setOrigin(.5).setDepth(600);
  scene.add.text(813,695,'DERMAGA',{fontFamily:'monospace',fontSize:'12px',color:'#5e5745',backgroundColor:'#fff0c9',padding:{x:4,y:2}}).setDepth(600);
 }
}
