// v1.36 — rumah Nia, Arif, Lina dibuat ulang dari nol.
// Koordinat rumah dan pintu dipertahankan untuk collision serta rute NPC.
export const EAST_HOMES=Object.freeze({
 nia:{x:1370,y:65,w:100,h:170,name:'RUMAH NIA',emoji:'🌼',color:0xe7b3ba},
 arif:{x:1480,y:65,w:100,h:170,name:'RUMAH ARIF',emoji:'🌿',color:0x9cba8b},
 lina:{x:1590,y:65,w:100,h:170,name:'RUMAH LINA',emoji:'🌷',color:0xc5a6d5}
});
export class EastHomesArt{
 constructor(scene){
  // Lapisan tanah setara dengan TownExpansionArt (rumput Alun-Alun).
  const ground=scene.add.graphics().setDepth(-85);
  const path=scene.add.graphics().setDepth(-84);
  // Semua isi rumah ada pada SATU graphics foreground: lantai tidak dapat
  // tertutup oleh tekstur rumput, dekorasi atau objek terrain lain.
  const houses=scene.add.graphics().setDepth(40);
  const gardens=scene.add.graphics().setDepth(42);
  const rect=(g,x,y,w,h,c)=>{g.fillStyle(c,1);g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const frame=(g,x,y,w,h,c,edge=0x78583e,t=3)=>{
   rect(g,x-t,y-t,w+2*t,h+2*t,edge);rect(g,x,y,w,h,c);
  };
  const flower=(g,x,y,c)=>{
   rect(g,x,y,2,8,0x639463);rect(g,x-3,y-4,8,7,c);
   rect(g,x-1,y-2,3,3,0xffe8a7);
  };
  // Kawasan hijau tetap sama dengan kampung lama, di luar rumah saja.
  // Batas rumput sama persis dengan Alun-Alun dan seluruh pantai: y=600.
  // Jangan membuat pita pasir/rumput tersendiri di bawah Puskesmas.
  rect(ground,1340,0,380,600,0xa4cd91);
  const inHouse=(x,y)=>Object.values(EAST_HOMES).some(h=>x>=h.x-13&&x<h.x+h.w+13&&y>=h.y-17&&y<h.y+h.h+13);
  // Gunakan grid rumput yang menerus dari Alun-Alun (awal x=957, langkah 19).
  for(let y=9;y<600;y+=17)for(let x=957;x<1720;x+=19){
   if(x<1340)continue;
   if(!inHouse(x,y)&&(x*7+y*11)%17<7){
    rect(ground,x,y,3,5,0x74b075);rect(ground,x+5,y+2,2,3,0xb9d899);
   }
  }
  // Jalan utama dan jalan masuk tidak berubah.
  frame(path,1340,261,380,49,0xead5af,0xd3b18a,2);
  for(let x=1350;x<1720;x+=58)rect(path,x,282,25,3,0xd7b88f);
  // === JALAN PENGHUBUNG ALUN-ALUN → PUSKESMAS ===
  // Rute membelok alami di luar dinding Puskesmas, lalu tersambung ke pintu utara.
  // Tanpa menambah collision; seluruh lintasan berada di area yang bisa dilewati.
  const trail=0xead5af,edge=0xd7b88f,detail=0xf2dfbc;
  // Keluar dari sisi timur Alun-Alun, menyatu dengan jalur vertikal.
  rect(path,1298,373,71,28,edge);
  rect(path,1298,376,71,22,trail);
  // Tikungan ke utara di antara Alun-Alun dan Puskesmas.
  rect(path,1340,317,29,81,edge);
  rect(path,1343,317,23,81,trail);
  // Cabang mendatar menuju akses pintu Puskesmas di x=1504..1556.
  rect(path,1355,313,179,27,edge);
  rect(path,1355,316,179,21,trail);
  // Sedikit batu pijakan, bukan marka jalan lurus yang kaku.
  for(const [x,y] of [[1315,384],[1353,358],[1353,331],[1391,326],[1434,327],[1477,325]]){
   rect(path,x,y,8,3,detail);
  }
  for(const [id,h] of Object.entries(EAST_HOMES)){
   const {x,y,w,h:height,name,emoji,color}=h,cx=x+w/2;
   rect(path,cx-18,235,36,28,0xf0d9b7);
   // PONDASI dan lantai kayu solid: seluruh persegi panjang rumah tertutup.
   rect(houses,x-9,y-9,w+18,height+18,0x77523b);
   rect(houses,x-5,y-5,w+10,height+10,0xb9885d);
   rect(houses,x,y,w,height,0xf6dfbd);
   // Papan kayu horizontal, identik gaya rumah lama.
   for(let yy=y+17;yy<y+height-9;yy+=22)
    rect(houses,x+6,yy,w-12,2,0xe8c29c);
   // Dinding mengikuti persis trim rumah pemain lama (#b68168), pintu 52px.
   rect(houses,x,y,w,11,0xb68168);
   rect(houses,x,y,11,height,0xb68168);
   rect(houses,x+w-11,y,11,height,0xb68168);
   rect(houses,x,y+height-11,24,11,0xb68168);
   rect(houses,x+76,y+height-11,24,11,0xb68168);
   rect(houses,cx-26,y+height-5,52,7,0xe4c28a);
   rect(houses,cx-24,y+height+3,48,5,0x9f7552);
   // Detail dinding identik dengan fungsi room() pada WorldArt.js.
   rect(houses,x+11,y+15,w-22,3,0xfff4d7);
   for(let px=x+21;px<x+w-18;px+=25)rect(houses,px,y+4,12,4,0xf0c49d);
   // Atap pendek cutaway: interior rumah terlihat seluruhnya.
   rect(houses,x-5,y-15,w+10,15,0x72533e);
   rect(houses,x-3,y-13,w+6,11,color);
   for(let i=0;i<7;i++)rect(houses,x+4+i*14,y-9,9,2,0xfbe9d3);
   // Jendela dan interior khusus setiap penghuni.
   frame(houses,x+15,y+38,28,49,0xa7bfcc,0x775f52,2);
   rect(houses,x+19,y+43,20,11,0xfff5de);
   rect(houses,x+19,y+58,20,24,id==='nia'?0xe6b4bd:id==='arif'?0xa3bd98:0xc8b3d9);
   frame(houses,x+58,y+36,24,34,0xc59b70,0x826047,2);
   rect(houses,x+62,y+43,16,3,0xf2d4a3);
   for(let i=0;i<3;i++)rect(houses,x+62+i*6,y+51,5,13,[0x9bb98c,0xe6ba7c,0x9ab3ce][i]);
   frame(houses,x+53,y+95,32,20,0xb98a5e,0x76563e,2);
   rect(houses,x+58,y+100,22,4,0xf4d3a0);
   frame(houses,x+62,y+125,15,12,0x9c7856,0x73543c,2);
   frame(houses,x+16,y+111,12,12,0xb48961,0x78543e,2);
   rect(houses,x+19,y+105,6,8,0x6c9c65);
   rect(houses,x+18,y+102,9,5,0x8dbb7b);
   rect(houses,x+40,y+132,23,18,id==='nia'?0xe4b0b5:id==='arif'?0xb0c99b:0xd3b5d9);
   // Aksen personal: buku, tanaman, atau vas bunga.
   if(id==='nia'){
    rect(houses,x+54,y+80,28,11,0xf3d3a0);
    rect(houses,x+59,y+83,18,3,0xa28ab7);
   }else if(id==='arif'){
    for(let i=0;i<3;i++){
     rect(houses,x+56+i*9,y+79,7,11,0x947050);
     rect(houses,x+57+i*9,y+75,5,7,0x78a975);
    }
   }else{
    rect(houses,x+56,y+80,26,10,0xd3b6d6);
    for(let i=0;i<3;i++)flower(houses,x+61+i*8,y+80,[0xeab1ad,0xf5d38e,0xe7b1d7][i]);
   }
   // Bedeng bunga di halaman depan, bukan di lantai rumah.
   rect(gardens,x+2,241,23,6,0xa67a52);
   rect(gardens,x+75,241,23,6,0xa67a52);
   flower(gardens,x+12,239,color);
   flower(gardens,x+87,239,0xf4d28d);
   // Lampu fisik rumah dihapus; penerangan malam menggunakan titik cahaya lembut.
  }
  // PUSKESMAS: memanfaatkan lahan kosong di tenggara rumah warga.
  // Interior terbuka dan lantai krem seperti rumah lainnya.
  const hx=1400,hy=345,hw=260,hh=210;
  frame(houses,hx-8,hy-8,hw+16,hh+16,0xc6a17c,0x78543d,4);
  rect(houses,hx,hy,hw,hh,0xf6dfbd);
  for(let yy=hy+24;yy<hy+hh-9;yy+=22)rect(houses,hx+10,yy,hw-20,2,0xe8c29c);
  const wall=0xb68168;
  // Pintu utama di UTARA menghadap jalan, celah 52px di tengah.
  rect(houses,hx,hy,104,12,wall);
  rect(houses,hx+156,hy,104,12,wall);
  rect(houses,hx,hy,12,hh,wall);
  rect(houses,hx+hw-12,hy,12,hh,wall);
  // Dinding selatan ditutup: akses pemain dari jalan utama di utara.
  rect(houses,hx,hy+hh-12,hw,12,wall);
  rect(houses,hx+104,hy-5,52,7,0xe4c28a);
  rect(houses,hx+104,hy+2,52,4,0xf3ddba);
  // Kanopi dibagi dua agar tidak menutupi pintu dan jalur masuk.
  rect(houses,hx-4,hy-19,108,20,0x6f958d);
  rect(houses,hx+156,hy-19,108,20,0x6f958d);
  rect(houses,hx,hy-16,104,14,0xbadcd2);
  rect(houses,hx+156,hy-16,104,14,0xbadcd2);
  rect(houses,hx+117,hy-17,26,17,0xfff8ef);
  rect(houses,hx+127,hy-15,6,13,0xdb7774);
  rect(houses,hx+122,hy-10,16,5,0xdb7774);
  // Jalan setapak tepat di tengah pintu (x=1530), melewati pondasi.
  // Digambar di layer rumah agar tidak tertutup pondasi coklat.
  rect(houses,hx+104,hy-9,52,10,0xead5af);
  rect(houses,hx+104,hy+1,52,11,0xf6dfbd);
  rect(houses,hx+106,hy-3,48,3,0xe4c28a);
  // v2.1: puskesmas baru, interior cutaway pada footprint lama.
  // Resepsionis kiri dan antrean: lorong pintu tengah x=1504..1556 tetap lapang.
  frame(houses,hx+17,hy+39,84,34,0xc69b70,0x84624b,3);
  rect(houses,hx+23,hy+43,72,9,0xe7c39c);
  rect(houses,hx+28,hy+35,23,7,0xfaf0da);
  rect(houses,hx+65,hy+35,16,9,0x92b8ae);
  for(const y of [hy+100,hy+131]){
   rect(houses,hx+22,y,63,12,0x8eb9b1);
   rect(houses,hx+27,y+12,7,9,0x876b53);
   rect(houses,hx+72,y+12,7,9,0x876b53);
  }
  // Poster edukasi cuci tangan dan jadwal pemeriksaan.
  frame(houses,hx+17,hy+167,77,24,0xf6e9d2,0x9e8065,2);
  for(let i=0;i<3;i++)rect(houses,hx+24,hy+173+i*5,58-i*11,2,[0x80ac9a,0xe5b47c,0xa3b5cb][i]);
  // Ruang pemeriksaan kanan: sekat rendah tidak menghalangi pintu.
  rect(houses,hx+140,hy+39,7,53,0xcba88b);
  rect(houses,hx+140,hy+131,7,26,0xcba88b);
  // Tempat tidur pasien, bantal dan selimut.
  frame(houses,hx+159,hy+57,79,43,0xe9f0ed,0x8aaba9,3);
  rect(houses,hx+163,hy+61,22,35,0xffffff);
  rect(houses,hx+187,hy+61,47,35,0xa4d2c4);
  rect(houses,hx+192,hy+66,37,5,0xd3e9df);
  // Timbangan, alat ukur tinggi dan meja pemeriksaan.
  frame(houses,hx+163,hy+123,39,19,0xc4d6d1,0x809f9b,2);
  rect(houses,hx+169,hy+127,27,9,0xf1f3e9);
  rect(houses,hx+218,hy+113,5,46,0x9bb9b1);
  for(let yy=hy+118;yy<hy+154;yy+=7)rect(houses,hx+218,yy,8,2,0x6d958f);
  frame(houses,hx+159,hy+170,76,25,0xc9a47c,0x876a51,2);
  rect(houses,hx+169,hy+164,24,8,0xf9efda);
  rect(houses,hx+205,hy+165,14,7,0x8eb2a1);
  // Lemari obat dan kotak P3K.
  frame(houses,hx+104,hy+39,23,51,0xf9f3dc,0x8e7664,2);
  for(let yy of [hy+49,hy+64,hy+79])rect(houses,hx+108,yy,15,4,0x91b6a2);
  rect(houses,hx+185,hy+19,23,23,0xffffff);
  rect(houses,hx+194,hy+23,5,15,0xe38a87);
  rect(houses,hx+189,hy+28,15,5,0xe38a87);
  // Jalur akses dari jalan utama.
  // Jalan dari tepi selatan jalan utama (y=309) hingga ambang pintu (y=345).
  rect(path,1504,307,52,38,0xead5af);
  rect(path,1528,309,4,30,0xd8b68b);
  rect(path,1510,342,40,4,0xe4c28a);
  // Papan nama di samping pintu, bukan tepat di jalur karakter.

  // Lampu fisik Puskesmas dihapus; penerangan malam menggunakan titik cahaya lembut.
  // Pantai timur tetap mengikuti sambungan pantai versi sebelumnya.
  rect(path,1340,600,380,112,0xf3dba5);
  rect(path,1340,710,380,140,0x65bfd0);
  // Alun-Alun berakhir di y=544, rumput ke pantai y=600 = 56 px.
  // Puskesmas berakhir di y=555; agar lebarnya juga 56 px, batas pasir di y=611.
  // Hamparan tambahan menggunakan warna dan pola rumput Alun-Alun yang sama.
  rect(path,1340,600,380,11,0xa4cd91);
  for(let y=604;y<611;y+=17)for(let x=957;x<1720;x+=19){
   if(x<1340)continue;
   if((x*7+y*11)%17<7){rect(path,x,y,3,5,0x74b075);rect(path,x+5,y+2,2,3,0xb9d899);}
  }
  for(let x=1340;x<1720;x+=30){
   const y=703+Math.round(Math.sin(x*.035)*5);
   rect(path,x,y,30,9,0x9ddcdb);
   rect(path,x,y+10,30,3,0xd6f0dc);
  }
  for(let x=1355;x<1720;x+=47){
   rect(path,x,627+(x%5)*9,5,3,0xe3c58e);
   rect(path,x+12,670+(x%7)*3,3,3,0xffedca);
  }
 }
}
