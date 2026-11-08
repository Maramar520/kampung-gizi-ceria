// Sekolah Gizi v1.46 di lahan kosong tepi kampung, tanpa mengubah enam blok.
export const SCHOOL={x:1390,y:570,w:270,h:125,doorX:1525,doorY:570};
export class SchoolArt{
 constructor(scene){
  const g=scene.add.graphics().setDepth(45);
  const p=scene.add.graphics().setDepth(-78);
  const r=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const s=SCHOOL;
  // Halaman sekolah dari pintu Puskesmas ke arah selatan; bangunan berada di tanah pasir kosong.
  p.fillStyle(0xead5af);p.fillRect(1500,555,50,20);
  r(s.x-5,s.y-5,s.w+10,s.h+10,0x9d785c);
  r(s.x,s.y,s.w,s.h,0xf8e6c7);
  for(let y=s.y+19;y<s.y+s.h-8;y+=19)r(s.x+8,y,s.w-16,2,0xe9cfa7);
  r(s.x,s.y,109,11,0xb68168);r(s.x+161,s.y,109,11,0xb68168);
  r(s.x,s.y,11,s.h,0xb68168);r(s.x+s.w-11,s.y,11,s.h,0xb68168);
  r(s.x,s.y+s.h-11,s.w,11,0xb68168);
  r(s.x+109,s.y-5,52,12,0xe7d6ae);
  // Papan tulis, meja belajar, kursi, rak buku.
  r(s.x+18,s.y+17,100,35,0x795d46);r(s.x+23,s.y+22,90,25,0x527b64);
  r(s.x+29,s.y+29,55,3,0xf6e8bf);
  for(const [x,y] of [[s.x+32,s.y+72],[s.x+95,s.y+72],[s.x+173,s.y+72],[s.x+225,s.y+72]]){
   r(x-15,y-6,35,13,0xb58b62);r(x-11,y+9,8,6,0x907054);
  }
  r(s.x+216,s.y+17,32,39,0xa77c5a);
  for(let i=0;i<4;i++)r(s.x+220+i*6,s.y+24,5,23,[0xa9c68c,0xf0bd8a,0xb8b6d8,0xf3e3a1][i]);
  scene.add.text(s.x+45,s.y-17,'🏫 SEKOLAH GIZI',{fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:'#355b48',backgroundColor:'#fff3d4',padding:{x:4,y:3}}).setDepth(650);
 }
}
