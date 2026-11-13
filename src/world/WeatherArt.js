// v1.7 — visual weather overlay, no new spritesheets, scenes, collisions, or assets.
// Weather and lighting must cover the full expanded 1340x600 world.
import {WORLD_WIDTH,WORLD_HEIGHT} from './WorldGeometry.js?v=v158-weather-sea-height';
const TINTS=[
 {color:0xffdf98,alpha:.07},
 {color:0xffefbe,alpha:.025},
 {color:0xef9c87,alpha:.15},
 {color:0x162c58,alpha:.42}
];
export class WeatherArt{
 constructor(scene,timeWeather){
  this.scene=scene;this.timeWeather=timeWeather;
  this.atmosphere=scene.add.graphics().setDepth(1100);
  this.rain=scene.add.graphics().setDepth(1175);
  this.details=scene.add.graphics().setDepth(1160);
  this.last=-Infinity;this.lastSignature='';
  this.previousPhase=this.timeWeather.phase;
  this.phaseFade=null;
  this.dawnStart=null;
  this.dawnVeil=scene.add.graphics().setDepth(1190);
  this.update(0,true);
 }
 update(ms,force=false){
  if(!force&&ms-this.last<90)return;
  this.last=ms;
  const {phase,weather}=this.timeWeather;
  const signature=phase+'-'+weather;
  const g=this.atmosphere;
  if(this.previousPhase!==phase){
   if(this.previousPhase===3&&phase===0){
    this.dawnStart=ms;this.phaseFade=null;
   }else{
    this.phaseFade={from:this.previousPhase,start:ms};
    this.dawnStart=null;
   }
   this.previousPhase=phase;
  }
  const dawnProgress=this.dawnStart===null?1:Math.min(1,Math.max(0,(ms-this.dawnStart)/4200));
  const dawnActive=this.dawnStart!==null&&dawnProgress<1;
  const dawnFinished=this.dawnStart!==null&&!dawnActive;
  if(dawnFinished)this.dawnStart=null;
  if(force||this.lastSignature!==signature||dawnActive||dawnFinished){
   this.lastSignature=signature;g.clear();
   const tint=TINTS[phase]||TINTS[0];
   if(dawnActive){
    // Malam memudar perlahan menjadi pagi, bukan berganti warna seketika.
    const night=TINTS[3];
    g.fillStyle(night.color,night.alpha*(1-dawnProgress)).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
    g.fillStyle(tint.color,tint.alpha*dawnProgress).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
    g.fillStyle(0xffdfac,.075*Math.sin(Math.PI*dawnProgress)).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
   }else g.fillStyle(tint.color,tint.alpha).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);

   // Warna area di luar batas peta harus sama dengan laut yang terkena
   // pencahayaan waktu dan cuaca (agar tidak ada garis beda warna saat zoom out).
   const mix=(rgb,overlay,alpha)=>{
    const a=[rgb>>16&255,rgb>>8&255,rgb&255];
    const b=[overlay>>16&255,overlay>>8&255,overlay&255];
    return (Math.round(a[0]*(1-alpha)+b[0]*alpha)<<16)|
           (Math.round(a[1]*(1-alpha)+b[1]*alpha)<<8)|
            Math.round(a[2]*(1-alpha)+b[2]*alpha);
   };
   let ocean=mix(0x65bfd0,tint.color,tint.alpha);
   if(dawnActive){
    ocean=mix(0x65bfd0,TINTS[3].color,TINTS[3].alpha*(1-dawnProgress));
    ocean=mix(ocean,tint.color,tint.alpha*dawnProgress);
   }
   if(weather==='Berawan')ocean=mix(ocean,0x7f9da8,.10);
   if(weather==='Hujan')ocean=mix(ocean,0x42668e,.19);
   this.scene.cameras.main.setBackgroundColor(ocean);

   if(weather==='Berawan')g.fillStyle(0x7f9da8,.10).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
   if(weather==='Hujan')g.fillStyle(0x42668e,.19).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
  }
  const veil=this.dawnVeil;veil.clear();
  if(this.phaseFade){
   const t=Math.min(1,Math.max(0,(ms-this.phaseFade.start)/1800));
   if(t>=1)this.phaseFade=null;
   else{
    const old=TINTS[this.phaseFade.from]||TINTS[0];
    veil.fillStyle(old.color,old.alpha*(1-t)).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
   }
  }
  const d=this.details;d.clear();
  const nightVisibility=phase===3?1:dawnActive?1-dawnProgress:0;
  if(nightVisibility>0){
   // Lampu dan bintang meredup mengikuti munculnya cahaya pagi.
   for(const [x,y] of [[139,72],[605,76],[211,361],[607,360],[869,354],[1155,85],[1155,344],[1280,454]]){
    d.fillStyle(0xffd490,.12*nightVisibility).fillCircle(x,y,24);
    d.fillStyle(0xffefae,.8*nightVisibility).fillRect(x-3,y-2,6,5);
   }
   if(weather!=='Hujan')for(let i=0;i<22;i++){
    const x=23+i*61,y=21+(i%3)*18;
    d.fillStyle(0xfff3d0,(.2+.3*(1+Math.sin(ms/510+i))/2)*nightVisibility);
    d.fillRect(x,y,2,3);
   }
  }
  if(phase===2){
   d.fillStyle(0xffdbab,.11);
   d.fillEllipse(94,16,210,43);
  }else if(phase===0){
   d.fillStyle(0xfff1bc,.10*(dawnActive?dawnProgress:1));
   d.fillEllipse(80,28,190,58);
  }
  if(weather==='Berawan'||weather==='Hujan'){
   const cloud=weather==='Hujan'?0x718da1:0xf3f0e4;
   for(let i=0;i<6;i++){
    const x=(145+i*225+ms/95)%(WORLD_WIDTH+140)-70,y=18+(i%2)*18;
    d.fillStyle(cloud,weather==='Hujan'?.35:.48);
    d.fillEllipse(x,y,96,23);
    d.fillEllipse(x-18,y+5,68,18);
   }
  }
  const rain=this.rain;rain.clear();
  if(weather!=='Hujan')return;
  for(let i=0;i<165;i++){
   const x=(i*97+ms*.26+(i%7)*14)%(WORLD_WIDTH+20)-10;
   const y=(i*53+ms*.47+(i%5)*31)%(WORLD_HEIGHT+20)-10;
   rain.lineStyle(2,0xa6d9ec,.40);
   rain.lineBetween(x,y,x-5,y+14);
  }
 }
 destroy(){this.atmosphere.destroy();this.rain.destroy();this.details.destroy();this.dawnVeil.destroy();}
}
