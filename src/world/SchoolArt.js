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
  rect(s.x-3,s.y-3,s.w+6,s.h+6,0x997457);
  rect(s.x,s.y,s.w,s.h,0xf8e6c7);
  for(let y=s.y+20;y<s.y+s.h-12;y+=19)rect(s.x+9,y,s.w-18,2,0xe9cfa7);
  const wall=0xb68168;
  rect(s.x,s.y,s.w,11,wall);
  rect(s.x,s.y,11,s.h,wall);
  rect(s.x+s.w-11,s.y,11,s.h,wall);
  rect(s.x,s.y+s.h-11,37,11,wall);
  rect(s.x+89,s.y+s.h-11,37,11,wall);
  // Ambang pintu selatan 52 px, tepat pada jalan menuju sekolah.
  rect(s.x+37,s.y+s.h-5,52,7,0xe7d6ae);
  rect(s.x+15,s.y+18,96,31,0x795d46);
  rect(s.x+20,s.y+23,86,21,0x527b64);
  rect(s.x+25,s.y+31,57,3,0xf6e8bf);
  for(const [x,y] of [[826,124],[882,124],[826,170],[882,170]]){
   rect(x-9,y-5,31,12,0xb58b62);
   rect(x-5,y+9,8,6,0x907054);
  }
  rect(899,59,21,33,0xa77c5a);
  for(let i=0;i<3;i++)rect(903+i*5,66,4,19,[0xa9c68c,0xf0bd8a,0xb8b6d8][i]);
  // Lampu dinding sekolah, cahaya hangat tanpa menghalangi ruang kelas.
  const lamps=scene.add.graphics().setDepth(640);
  for(const [lx,ly] of [[820,94],[918,94]]){
   lamps.fillStyle(0xffe8a0,.13).fillCircle(lx,ly,24);
   lamps.fillStyle(0xffe8a0,.24).fillCircle(lx,ly,13);
   lamps.fillStyle(0x745b43).fillRect(lx-6,ly-7,12,4);
   lamps.fillStyle(0xfff0b5).fillRoundedRect(lx-5,ly-4,10,10,3);
  }
 }
}
