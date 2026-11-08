// Kawasan hunian baru di sebelah kanan Alun-Alun; tiga rumah dengan interior terbuka.
export const EAST_HOMES=Object.freeze({
 nia:{x:1370,y:65,w:100,h:170,name:'RUMAH NIA',emoji:'🌼',color:0xf5d6dc},
 arif:{x:1480,y:65,w:100,h:170,name:'RUMAH ARIF',emoji:'🌿',color:0xd4e5c1},
 lina:{x:1590,y:65,w:100,h:170,name:'RUMAH LINA',emoji:'🌷',color:0xe6d9f2}
});
export class EastHomesArt{
 constructor(scene){
  const g=scene.add.graphics().setDepth(-84);
  const r=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  r(1340,0,380,600,0xa4cd91);
  for(let y=12;y<600;y+=22)for(let x=1345;x<1720;x+=25)r(x,y,3,4,0x7eaf73);
  // Sambungan jalan ke timur dari jalan utama lama dan cabang ke tiga rumah.
  r(1300,261,420,49,0xead5af);
  for(const h of Object.values(EAST_HOMES)){
   const cx=h.x+h.w/2;
   r(cx-18,230,36,32,0xead5af);
   r(h.x,h.y,h.w,h.h,h.color);
   for(let y=h.y+20;y<h.y+h.h-12;y+=22)r(h.x+8,y,h.w-16,2,0xe4c6ac);
   r(h.x,h.y,h.w,8,0x94745f);r(h.x,h.y,8,h.h,0x94745f);
   r(h.x+h.w-8,h.y,8,h.h,0x94745f);
   r(h.x,h.y+h.h-8,32,8,0x94745f);
   r(h.x+68,h.y+h.h-8,32,8,0x94745f);
   // Kasur, lemari, meja belajar, tanaman, dan ruang tengah.
   r(h.x+12,h.y+34,26,48,0xb5a1cb);r(h.x+15,h.y+38,20,12,0xfff5db);
   r(h.x+53,h.y+29,30,12,0x9b7658);
   r(h.x+57,h.y+34,22,4,0xf3e7ce);
   r(h.x+52,h.y+94,29,25,0xb88b65);
   r(h.x+57,h.y+99,20,12,0xffeed5);
   g.fillStyle(0x76a56f);g.fillCircle(h.x+19,h.y+126,10);
   scene.add.text(cx,h.y+12,h.emoji+' '+h.name,{fontFamily:'monospace',fontSize:'10px',color:'#594b43',backgroundColor:'#fff8dc',padding:{x:2,y:2}}).setOrigin(.5).setDepth(550);
  }
  // Jalur selatan menuju pantai tetap terbuka, tidak ditimpa bangunan.
  r(1340,600,380,112,0xf3dba5);
  r(1340,710,380,140,0x65bfd0);
  for(let x=1340;x<1720;x+=30){const y=703+Math.round(Math.sin(x*.035)*5);r(x,y,30,9,0x9ddcdb);r(x,y+10,30,3,0xd6f0dc);}
  r(1340,600,380,17,0xa4cd91);
 }
}
