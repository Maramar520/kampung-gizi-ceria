// v1.28: rumah timur menyatu dengan gaya pixel-art kampung lama.
// Koordinat, pintu, collision, rutinitas NPC, dan penyimpanan tidak berubah.
export const EAST_HOMES=Object.freeze({
 nia:{x:1370,y:65,w:100,h:170,name:'RUMAH NIA',emoji:'🌼',color:0xf5d6dc},
 arif:{x:1480,y:65,w:100,h:170,name:'RUMAH ARIF',emoji:'🌿',color:0xd4e5c1},
 lina:{x:1590,y:65,w:100,h:170,name:'RUMAH LINA',emoji:'🌷',color:0xe6d9f2}
});
export class EastHomesArt{
 constructor(scene){
  const ground=scene.add.graphics().setDepth(-99);
  const roads=scene.add.graphics().setDepth(-89);
  const floor=scene.add.graphics().setDepth(20);
  const deco=scene.add.graphics().setDepth(21);
  const rect=(g,x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const frame=(g,x,y,w,h,c,edge=0x88694c,t=3)=>{
   rect(g,x-t,y-t,w+t*2,h+t*2,edge);rect(g,x,y,w,h,c);
  };
  const tuft=(x,y)=>{rect(ground,x,y,3,5,0x74b075);rect(ground,x+5,y+2,2,3,0xb9d899);};
  const flower=(x,y,c)=>{rect(deco,x,y,2,8,0x5b9867);rect(deco,x-4,y-3,10,5,c);rect(deco,x-1,y-6,4,9,c);rect(deco,x,y-2,2,2,0xf9e39d);};
  const bush=(x,y)=>{rect(deco,x-13,y,26,8,0x4f8356);rect(deco,x-10,y-9,22,15,0x6fae70);rect(deco,x-4,y-14,12,9,0x8fc985);};
  const tree=(x,y)=>{rect(deco,x-5,y,10,19,0x916f4e);frame(deco,x-19,y-26,40,29,0x6d9f65,0x578751,2);rect(deco,x-12,y-33,28,14,0x8cc67d);rect(deco,x-8,y-18,8,3,0xb5dc9b);};
  const furniture=(x,y,w,h,c,edge=0x88694c)=>frame(deco,x,y,w,h,c,edge,2);
  // Rumput dan tekstur identik dengan buildWorld() pada enam blok lama.
  rect(ground,1340,0,380,600,0xa4cd91);
  // Jangan gambar sehelai rumput pun di tapak ketiga rumah.
  const inHome=(x,y)=>Object.values(EAST_HOMES).some(h=>
   x>=h.x-12&&x<=h.x+h.w+12&&y>=h.y-14&&y<=h.y+h.h+14);
  for(let y=9;y<600;y+=17)for(let x=1345;x<1720;x+=19)
   if(!inHome(x,y)&&(x*7+y*11)%17<7)tuft(x,y);
  // Jalan lama berlanjut tanpa celah. Tepi, tekstur, dan warna sama.
  frame(roads,1340,261,380,49,0xead5af,0xd3b18a,2);
  for(let x=1350;x<1720;x+=58)rect(roads,x,282,25,3,0xd7b88f);
  for(const [id,h] of Object.entries(EAST_HOMES)){
   const {x,y,w,emoji,name}=h,cx=x+w/2;
   // Jalan pendek menuju pintu di sisi selatan, tepat di tengah.
   rect(roads,cx-18,230,36,33,0xf0d9b7);
   for(let j=0;j<2;j++)rect(roads,cx-13+j*17,243,8,3,0xdfbb91);
   // Bingkai rumah seperti fungsi room() pada kampung lama.
   // Pondasi coklat dibuat sebagai objek solid terpisah, tidak bisa tertutup
   // tekstur rumput dari Graphics lain atau perubahan urutan rendering.
   scene.add.rectangle(cx,y+h/2,w+20,h+20,0x76523a).setDepth(17);
   scene.add.rectangle(cx,y+h/2,w+12,h+12,0xb9885d).setDepth(18);
   scene.add.rectangle(cx,y+h/2,w,h,({nia:0xc99b72,arif:0xc49a71,lina:0xd0a27c})[id]).setDepth(19);
   // Alas coklat kayu seperti pondasi rumah-rumah kampung lama, di bawah lantai interior.
   rect(floor,x-10,y-10,w+20,h+20,0x78543c);
   rect(floor,x-7,y-7,w+14,h+14,0xb9885d);
   rect(floor,x-4,y-4,w+8,h+8,0xd1a576);
   // Lantai kayu solid berada di atas lapisan rumput; tidak boleh transparan.
   frame(floor,x,y,w,h,({nia:0xc99b72,arif:0xc49a71,lina:0xd0a27c})[id],0x896247,3);
   for(let yy=y+23;yy<y+h-10;yy+=22)rect(floor,x+8,yy,w-16,2,0x9f7554);
   const trim=({nia:0xb68168,arif:0x9a7658,lina:0xa27b70})[id];
   rect(deco,x,y,11,h,trim);rect(deco,x+w-11,y,11,h,trim);
   rect(deco,x,y,w,11,trim);
   // Dinding selatan sengaja terputus 52px untuk jalur NPC dan pemain.
   rect(deco,x,y+h-11,24,11,trim);rect(deco,x+76,y+h-11,24,11,trim);
   rect(deco,cx-26,y+h-5,52,7,0xe4c28a);
   // Ambang pintu coklat dan dua anak tangga menuju halaman.
   rect(deco,cx-25,y+h+2,50,5,0xa67a55);
   rect(deco,cx-21,y+h+7,42,5,0xc69b6e);
   rect(deco,x+11,y+15,w-22,3,0xfff4d7);
   for(let xx=x+21;xx<x+w-18;xx+=25)rect(deco,xx,y+4,12,4,0xf0c49d);
   // Atap genteng warna khas tiap rumah, bagian interior tetap terbuka.
   const roof=({nia:0xc87983,arif:0x789b70,lina:0x9b83bb})[id];
   rect(deco,x-4,y-13,w+8,15,0x735c52);
   rect(deco,x-2,y-11,w+4,11,roof);
   for(let xx=x+4;xx<x+w-5;xx+=13){
    rect(deco,xx,y-8,9,2,0xffe9cb);
    rect(deco,xx+4,y-2,9,2,0x765c54);
   }
   rect(deco,x+33,y+17,34,6,roof);
   rect(deco,x+37,y+23,26,3,0xffe9cb);
   // Interior terbuka: tempat tidur, selimut, lemari, rak, meja, kursi.
   furniture(x+14,y+37,29,51,0xa3bacd,0x718a9b);
   rect(deco,x+19,y+42,19,12,0xfff9ea);
   rect(deco,x+18,y+57,21,25,({nia:0xe5b6ca,arif:0xa9c4bc,lina:0xc3b2d8})[id]);
   rect(deco,x+19,y+63,19,3,0xf3e2cf);
   furniture(x+57,y+36,25,35,0xc09162,0x87634a);
   rect(deco,x+60,y+43,19,3,0xf1c999);
   for(let i=0;i<3;i++)rect(deco,x+61+i*6,y+49,5,14,[0xa1b98b,0xe8b779,0x91b1c7][i]);
   furniture(x+54,y+96,31,19,0xc39261,0x785941);
   rect(deco,x+59,y+100,21,4,0xf2c997);
   furniture(x+64,y+120,14,11,0x9b7658);
   rect(deco,x+18,y+110,9,13,0xb9885d);
   rect(deco,x+20,y+106,5,7,0x629961);
   rect(deco,x+16,y+103,13,6,0x8fc985);
   // Jendela dengan cahaya dan karpet kecil di ruang tengah.
   rect(deco,x+47,y+12,24,8,0xfaf0c8);rect(deco,x+58,y+12,2,8,0x9dbaaa);
   rect(floor,x+39,y+134,24,18,0xe6c9a2);
   rect(deco,x+42,y+137,18,12,({nia:0xeabac3,arif:0xc0d3a7,lina:0xd5c3e4})[id]);
   // Interior personal: meja baca Nia, bibit Arif, bunga Lina.
   if(id==='nia'){
    rect(deco,x+55,y+78,25,13,0xf3d2a0);
    rect(deco,x+59,y+81,17,3,0xe7a0a7);
    rect(deco,x+62,y+85,11,3,0x8b9dc7);
   }else if(id==='arif'){
    rect(deco,x+51,y+78,30,13,0x9c7957);
    for(let i=0;i<3;i++)rect(deco,x+56+i*8,y+75,5,12,[0x80b66b,0xe3c176,0x7aa6bc][i]);
   }else{
    rect(deco,x+51,y+77,30,14,0xd9c1e3);
    for(let i=0;i<3;i++)flower(x+58+i*9,y+84,[0xf2b7a0,0xf4da8d,0xe2acd0][i]);
   }
   // Taman depan tanpa menghalangi pintu.
   flower(x+14,247,({nia:0xf2b7a0,arif:0xf4da8d,lina:0xe2acd0})[id]);
   flower(x+86,251,0xffd59e);
   rect(deco,x+3,237,23,7,0xb9885d);
   rect(deco,x+74,237,23,7,0xb9885d);
   for(const fx of [x+10,x+20,x+80,x+90]){
    rect(deco,fx,232,2,8,0x629961);
    rect(deco,fx-3,230,8,5,id==='nia'?0xf2b7a0:id==='arif'?0xf4da8d:0xe2acd0);
   }
   scene.add.text(cx,y+12,emoji+' '+name,{
    fontFamily:'monospace',fontSize:'10px',fontStyle:'bold',color:'#574d3e',
    backgroundColor:'#fff3d4',padding:{x:3,y:2}
   }).setOrigin(.5).setDepth(550);
  }
  // Tambahan variasi rerumputan di halaman selatan.
  for(let y=327;y<570;y+=31)for(let x=1375;x<1690;x+=39){
   if((x+y)%4===0)flower(x,y,(x%3===0)?0xf2b7a0:0xf4da8d);
   else if((x+y)%3===0){rect(ground,x,y,6,2,0xb9d899);rect(ground,x+3,y-3,2,5,0x74b075);}
  }
  // Hiasan mengikuti palet semak, bunga dan pohon dari kawasan lama.
  for(const [x,y] of [[1356,245],[1710,245],[1356,564],[1710,564]])bush(x,y);
  for(const [x,y] of [[1363,43],[1701,45],[1363,493],[1701,493]])tree(x,y);
  for(const [x,y,c] of [[1355,329,0xf2b7a0],[1710,332,0xe2acd0],[1394,565,0xffd59e],[1660,568,0xf8bac3]])flower(x,y,c);
  // Perpanjangan pantai mengikuti SouthCoastArt, tidak menimpa jalan.
  rect(roads,1340,600,380,112,0xf3dba5);
  rect(roads,1340,710,380,140,0x65bfd0);
  rect(roads,1340,600,380,17,0xa4cd91);
  for(let x=1340;x<1720;x+=30){
   const y=703+Math.round(Math.sin(x*.035)*5);
   rect(roads,x,y,30,9,0x9ddcdb);rect(roads,x,y+10,30,3,0xd6f0dc);
  }
  for(let x=1355;x<1720;x+=47){
   rect(roads,x,627+(x%5)*9,5,3,0xe3c58e);
   rect(roads,x+12,670+(x%7)*3,3,3,0xffedca);
  }
 }
}
