// Sekolah Gizi menggantikan kolam ikan di blok kanan atas.
// Pintu di selatan menghadap jalan horizontal y=261–310.
export const SCHOOL={x:805,y:53,w:126,h:183,doorX:868,doorY:236};
export class SchoolArt{
 constructor(scene){
  const s=SCHOOL;
  const g=scene.add.graphics().setDepth(42);
  const p=scene.add.graphics().setDepth(-60);
  const rect=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  p.fillStyle(0xead5af);p.fillRect(845,236,46,26);
  // v2.0: ruang kelas cozy, seluruh dekorasi tetap dalam batas sekolah lama.
  rect(s.x-3,s.y-3,s.w+6,s.h+6,0x997457);
  rect(s.x,s.y,s.w,s.h,0xf9e9d1);
  for(let y=s.y+19;y<s.y+s.h-12;y+=17)rect(s.x+9,y,s.w-18,2,0xe7ceb1);
  const wall=0xb68168;
  rect(s.x,s.y,s.w,11,wall);rect(s.x,s.y,11,s.h,wall);
  rect(s.x+s.w-11,s.y,11,s.h,wall);
  rect(s.x,s.y+s.h-11,37,11,wall);rect(s.x+89,s.y+s.h-11,37,11,wall);
  rect(s.x+37,s.y+s.h-5,52,7,0xe7d6ae);
  // Papan tulis besar: kelompok makanan bergizi dan ilustrasi Isi Piringku.
  rect(821,70,94,42,0x85654d);rect(825,74,86,34,0x527b64);
  rect(832,81,52,3,0xf4eacb);rect(832,89,37,3,0xe9dba7);
  g.fillStyle(0xf8edd8);g.fillCircle(896,91,11);
  g.fillStyle(0x83b96f);g.fillCircle(891,88,4);
  g.fillStyle(0xe5b26f);g.fillCircle(900,95,4);
  // Meja guru dan buku pelajaran di sisi kiri atas.
  rect(817,118,39,15,0xc0916c);rect(820,122,33,7,0xe0b18b);
  rect(825,115,12,6,0xf8ebd5);rect(839,115,10,6,0x94b5c1);
  // Dua baris meja murid, koridor tengah bebas untuk bergerak.
  for(const [x,y] of [[819,150],[881,150],[819,192],[881,192]]){
   rect(x,y,33,15,0x98734f);rect(x+2,y+2,29,9,0xd4a779);
   rect(x+5,y+4,12,5,0xf7ebd4);rect(x+20,y+4,7,5,0xa3bd94);
   rect(x+4,y+15,7,7,0x80664e);rect(x+22,y+15,7,7,0x80664e);
  }
  // Rak buku, pojok baca, dan pajangan edukasi.
  rect(899,116,22,34,0xa77c5a);
  for(let i=0;i<4;i++)rect(902+i*4,121,4,22,[0xa9c68c,0xf0bd8a,0xb8b6d8,0x8fb5cc][i]);
  rect(817,213,28,10,0x9fbe9c);rect(820,215,22,5,0xe5c2a1);
  rect(893,215,23,9,0xc6a78d);rect(897,210,15,6,0x83b97c);
  // Lampu fisik dihapus; titik cahaya malam digambar oleh VillageWeatherDetails.
 }
}
