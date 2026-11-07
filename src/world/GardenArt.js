// Lapisan pertumbuhan di WorldScene. Tidak membuat scene atau world terpisah.
// Tiga petak di sebelah timur rumah pemain sesuai denah SVG: x258..389, y59..138.
export const GARDEN_PLOTS=[
 {x:267,y:74,w:34,h:47},
 {x:309,y:74,w:34,h:47},
 {x:351,y:74,w:32,h:47}
];
export class GardenArt {
 constructor(scene,garden){
  this.scene=scene;this.garden=garden;
  this.graphics=scene.add.graphics().setDepth(-58);
  this.lastSignature='';
  this.render();
 }
 render(force=false){
  const view=this.garden.view;
  const signature=JSON.stringify(view);
  if(!force&&signature===this.lastSignature)return;
  this.lastSignature=signature;
  const g=this.graphics;
  g.clear();
  const rect=(x,y,w,h,color)=>{g.fillStyle(color,1);g.fillRect(x,y,w,h);};
  for(const plot of view.plots){
   const a=GARDEN_PLOTS[plot.index], center=a.x+a.w/2;
   rect(a.x-3,a.y-3,a.w+6,a.h+6,0x846047);
   rect(a.x,a.y,a.w,a.h,0xb48a61);
   rect(a.x+3,a.y+3,a.w-6,a.h-6,0x936d4c);
   for(let row=0;row<5;row++)rect(a.x+7,a.y+10+row*9,a.w-14,2,0x684e39);
   // Label angka petak di papan kayu kecil.
   rect(center-9,a.y+a.h+5,18,12,0x76583f);
   rect(center-7,a.y+a.h+7,14,8,0xe5c28b);
   if(plot.stage==='empty'){
    // Benih belum ditanam; tambahkan titik tanah kosong.
    for(let i=0;i<4;i++)rect(center-12+i*7,a.y+29+(i%2)*5,3,3,0xc69d74);
   }else{
    const high=plot.stage==='ready';
    const crop=plot.crop||'bayam';
    const sprouts=plot.stage==='dry'?7:plot.stage==='growing'?15:24;
    for(const x of [center-12,center,center+12]){
     rect(x-2,a.y+45-sprouts,4,sprouts,0x4d8e52);
     rect(x-11,a.y+37-sprouts,10,8,high?0x80c66f:0x73ac69);
     rect(x+2,a.y+33-sprouts,10,8,high?0x92cd72:0x75aa6c);
     if(high){
      rect(x-8,a.y+26-sprouts,13,7,0x559856);
      rect(x-4,a.y+23-sprouts,7,5,0xb1d579);
     }
    }
    if(high&&crop==='wortel')for(const x of [center-12,center,center+12]){rect(x-4,a.y+35,8,13,0xe79e4a);rect(x-2,a.y+36,4,5,0xf9bf72);}
    if(high&&crop==='tomat')for(const x of [center-12,center,center+12]){rect(x-5,a.y+22,10,10,0xd96057);rect(x-2,a.y+21,4,3,0x4c8c56);}
    if(high&&crop==='kangkung')for(const x of [center-12,center,center+12]){rect(x-8,a.y+16,16,8,0x4a9159);rect(x-6,a.y+10,12,8,0x6ab96e);}
    if(plot.watered){
     for(const x of [a.x+6,a.x+33])rect(x,a.y+51,5,3,0x8ab7cf);
    }
   }
   const color=plot.stage==='ready'?0xecc966:plot.stage==='growing'?0x90c2d6:plot.stage==='dry'?0xd6a16e:0xf5d6a4;
   rect(a.x+3,a.y+3,a.w-6,4,color);
  }
 }
 destroy(){this.graphics.destroy();}
}
