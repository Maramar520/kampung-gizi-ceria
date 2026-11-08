// v1.22: fauna pantai prosedural, bergerak di habitat tanpa memengaruhi tabrakan pemain.
export class MarineWildlifeArt{
 constructor(scene){
  this.scene=scene;this.creatures=[
   {type:'crab',x:340,y:677,baseX:340,baseY:677,range:35,speed:.65,phase:0},
   {type:'crab',x:603,y:665,baseX:603,baseY:665,range:22,speed:.92,phase:1.6},
   {type:'turtle',x:1020,y:690,baseX:1020,baseY:690,range:26,speed:.24,phase:2.2},
   {type:'fish',x:855,y:752,baseX:855,baseY:752,range:44,speed:.54,phase:0.4},
   {type:'fish',x:1000,y:806,baseX:1000,baseY:806,range:35,speed:.72,phase:2.8}
  ];
  this.graphics=scene.add.graphics().setDepth(700);
 }
 update(now,weather,phase){
  const g=this.graphics;g.clear();
  const dark=phase===3,storm=weather==='Hujan',t=now/1000;
  for(const c of this.creatures){
   // Hewan mencari perlindungan ketika hujan, penyu dan kepiting beristirahat malam.
   if(storm&&c.type!=='fish')continue;
   if(dark&&c.type==='crab')continue;
   const wave=Math.sin(t*c.speed+c.phase),x=c.baseX+wave*c.range;
   const y=c.baseY+Math.sin(t*c.speed*.7+c.phase)*3;
   c.x=x;c.y=y;
   if(c.type==='crab'){
    g.fillStyle(0xdc765f);g.fillEllipse(x,y,19,12);
    g.fillStyle(0xf2b0a0);g.fillCircle(x-6,y-5,3);g.fillCircle(x+6,y-5,3);
    g.lineStyle(2,0xbd604e);for(const d of [-1,1])for(const dy of [-1,1])g.lineBetween(x+d*9,y,x+d*15,y+dy*5);
   }else if(c.type==='turtle'){
    g.fillStyle(0x79b89a);g.fillEllipse(x,y,30,20);
    g.fillStyle(0x4d9379);g.fillEllipse(x,y,19,15);
    g.fillStyle(0xa2d1a9);g.fillCircle(x+18,y,6);
    for(const d of [-1,1]){g.fillEllipse(x-9,y+d*11,9,5);g.fillEllipse(x+9,y+d*11,9,5);}
    g.fillStyle(0x254a3e);g.fillCircle(x+21,y-2,1.3);
   }else{
    g.fillStyle(0xffd28d);g.fillEllipse(x,y,19,10);
    g.fillTriangle(x-9,y,x-17,y-7,x-17,y+7);
    g.fillStyle(0x375f68);g.fillCircle(x+5,y-1,1.4);
   }
  }
 }
}
