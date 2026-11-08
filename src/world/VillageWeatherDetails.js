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
   // Cahaya interior jelas seperti titik terang rumah pemain, tanpa objek lampu.
   // Ditempatkan di ruang kosong setiap bangunan supaya tidak tertutup furnitur.
   const buildingGlow=[
    [825,88],[905,88],               // Sekolah Gizi
    [1435,385],[1540,385],[1618,385], // Puskesmas
    [1395,89],[1445,89],            // Rumah Nia
    [1505,89],[1555,89],            // Rumah Arif
    [1615,89],[1665,89]             // Rumah Lina
   ];
   const pulse=1+Math.sin(ms/850)*.045;
   for(const [x,y] of buildingGlow){
    g.fillStyle(0xffd779,.22).fillCircle(x,y,35*pulse);
    g.fillStyle(0xffe5a0,.36).fillCircle(x,y,22*pulse);
    g.fillStyle(0xfff1c0,.62).fillCircle(x,y,11*pulse);
    g.fillStyle(0xfffbe2,1).fillCircle(x,y,4);
   }
   for(const [x,y] of [[445,265],[760,260],[1155,265],[760,575],[608,326],[211,325]]){
    g.fillStyle(0xffd58a,.12).fillEllipse(x,y+8,45,18);
    g.fillStyle(0xffe8ac,.65).fillCircle(x,y,3);
   }
  }
 }
 destroy(){this.graphics.destroy();}
}
