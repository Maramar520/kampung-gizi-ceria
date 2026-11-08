// Pantai selatan: peta lama tidak diubah, kawasan baru dimulai pada y=600.
export class SouthCoastArt {
 constructor(scene){
  const g=scene.add.graphics().setDepth(-110);
  const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  // Pantai berpasir, batas pantai berlekuk, dan laut biru pastel.
  rect(0,600,1340,112,0xf3dba5);
  rect(0,710,1340,140,0x65bfd0);
  for(let x=0;x<1340;x+=30){
   const y=703+Math.round(Math.sin(x*.035)*5);
   rect(x,y,30,9,0x9ddcdb);
   rect(x,y+10,30,3,0xd6f0dc);
  }
  // Pasir dan rumput di tepi kampung.
  rect(0,600,1340,17,0xa4cd91);
  for(let x=18;x<1340;x+=47){
   rect(x,627+(x%5)*9,5,3,0xe3c58e);
   rect(x+12,670+(x%7)*3,3,3,0xffedca);
  }
  // Jalan masuk dari jalan tengah lama menuju pantai dan dermaga.
  rect(736,585,49,61,0xead5af);
  rect(735,646,56,54,0xe7cb95);
  // Dermaga kayu panjang, terhubung dari pasir ke laut.
  rect(733,695,60,111,0x896b50);
  rect(739,692,48,113,0xc99566);
  for(let y=699;y<803;y+=13)rect(741,y,44,3,0xa97a55);
  for(let y=702;y<805;y+=32){
   rect(729,y,10,13,0x73573f);rect(787,y,10,13,0x73573f);
  }
  // Ombak lembut, ikan dan buih air di sekitar dermaga.
  for(let i=0;i<36;i++){
   const x=24+(i*83)%1290,y=731+(i*41)%106;
   if(x>711&&x<818)continue;
   rect(x,y,15+(i%3)*6,2,i%2?0xb4e7e6:0x85d5dc);
  }
  for(const [x,y] of [[118,765],[331,799],[1040,760],[1218,814]]){
   rect(x,y,13,4,0x4b9da9);rect(x+11,y-2,5,8,0x4b9da9);
  }
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
