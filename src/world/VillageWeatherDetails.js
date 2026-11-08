// v1.23: genangan dan cahaya kampung tanpa perubahan geometri atau collision.
export class VillageWeatherDetails{
 constructor(scene){this.graphics=scene.add.graphics().setDepth(1060);}
 update(ms,weather,phase){
  const g=this.graphics;g.clear();
  if(weather==='Hujan'){
   for(const [x,y,w] of [[455,296,26],[756,295,32],[447,581,29],[760,591,27],[1150,286,31],[895,570,25]]){
    g.fillStyle(0x6d9db1,.24).fillEllipse(x,y,w,7);
    g.lineStyle(1,0xc3e6e8,.35).strokeEllipse(x,y,w,7);
    const ripple=(ms/240)%9;
    g.lineStyle(1,0xe1f1e9,.25).strokeEllipse(x,y,6+ripple,2+ripple*.25);
   }
  }
  if(phase===3){
   // Titik terang malam, tanpa gambar lampu dinding atau papan nama.
   // Sekolah, Puskesmas, serta rumah Nia, Arif, dan Lina.
   for(const [x,y] of [[834,112],[898,112],[1450,401],[1530,414],[1608,401],[1418,164],[1528,164],[1638,164]]){
    g.fillStyle(0xffe4a0,.11).fillCircle(x,y,29);
    g.fillStyle(0xffedb1,.22).fillCircle(x,y,15);
    g.fillStyle(0xfff4cc,.8).fillCircle(x,y,3);
   }
   for(const [x,y] of [[445,265],[760,260],[1155,265],[760,575],[608,326],[211,325]]){
    g.fillStyle(0xffd58a,.12).fillEllipse(x,y+8,45,18);
    g.fillStyle(0xffe8ac,.65).fillCircle(x,y,3);
   }
  }
 }
 destroy(){this.graphics.destroy();}
}
