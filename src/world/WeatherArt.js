// v1.7 — visual weather overlay, no new spritesheets, scenes, collisions, or assets.
// Weather and lighting must cover the full expanded 1340x600 world.
import {WORLD_WIDTH,WORLD_HEIGHT} from './WorldGeometry.js';
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
  this.update(0,true);
 }
 update(ms,force=false){
  if(!force&&ms-this.last<90)return;
  this.last=ms;
  const {phase,weather}=this.timeWeather;
  const signature=phase+'-'+weather;
  const g=this.atmosphere;
  if(force||this.lastSignature!==signature){
   this.lastSignature=signature;g.clear();
   const tint=TINTS[phase]||TINTS[0];
   g.fillStyle(tint.color,tint.alpha).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
   if(weather==='Berawan')g.fillStyle(0x7f9da8,.10).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
   if(weather==='Hujan')g.fillStyle(0x42668e,.19).fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
  }
  const d=this.details;d.clear();
  if(phase===3){
   // Cahaya lampu kecil dan bintang lembut. Tidak menutupi interaksi.
   for(const [x,y] of [[139,72],[605,76],[211,361],[607,360],[869,354],[1155,85],[1155,344],[1280,454]]){
    d.fillStyle(0xffd490,.12).fillCircle(x,y,24);
    d.fillStyle(0xffefae,.8).fillRect(x-3,y-2,6,5);
   }
   if(weather!=='Hujan')for(let i=0;i<22;i++){
    const x=23+i*61,y=21+(i%3)*18;
    d.fillStyle(0xfff3d0,.2+.3*(1+Math.sin(ms/510+i))/2);
    d.fillRect(x,y,2,3);
   }
  }else if(phase===2){
   d.fillStyle(0xffdbab,.11);
   d.fillEllipse(94,16,210,43);
  }else if(phase===0){
   d.fillStyle(0xfff1bc,.10);
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
 destroy(){this.atmosphere.destroy();this.rain.destroy();this.details.destroy();}
}
