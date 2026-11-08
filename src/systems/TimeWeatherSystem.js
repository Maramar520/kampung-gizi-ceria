// v1.7 — waktu kampung mengikuti waktu bermain, bukan cuaca/lokasi dunia nyata.
// 4 fase masing-masing 35 detik; malam bertahan sampai pemain tidur.
// Cuaca deterministik menurut hari supaya save lama dan progres kebun konsisten.
export const PHASES=Object.freeze(['Pagi','Siang','Sore','Malam']);
export const PHASE_SECONDS=35;
export const TIME_SPEEDS=Object.freeze([1,2,4]);
export function normalizeTimeSpeed(value){return TIME_SPEEDS.includes(value)?value:1;}
export function weatherForDay(day){
 const n=Math.max(1,Number.isSafeInteger(day)?day:1);
 return n%5===0?'Berawan':n%3===2?'Hujan':'Cerah';
}
export function defaultTime(day=1){
 return {phase:0,weather:weatherForDay(day)};
}
export function normalizeTime(raw,day=1){
 return {phase:Number.isInteger(raw?.phase)&&raw.phase>=0&&raw.phase<4?raw.phase:0,
  weather:weatherForDay(day)};
}
export function describeTime(time){
 const phase=PHASES[time.phase]||PHASES[0],weather=time.weather||'Cerah';
 const icon=time.phase===3?'🌙':weather==='Hujan'?'🌧️':weather==='Berawan'?'☁️':
  time.phase===2?'🌇':time.phase===1?'☀️':'🌤️';
 return {phase,weather,icon,label:icon+' '+phase+' · '+weather};
}
export class TimeWeatherSystem{
 constructor(state,garden){
  this.state=state;this.garden=garden;
  state.data.timeWeather=normalizeTime(state.data.timeWeather,state.data.day);
  state.data.timeSpeed=normalizeTimeSpeed(state.data.timeSpeed);
  this.elapsed=0;this.lastDay=state.data.day;
  this.rainWater();
 }
 get data(){return this.state.data.timeWeather;}
 get speed(){return normalizeTimeSpeed(this.state.data.timeSpeed);}
 setSpeed(speed){if(!TIME_SPEEDS.includes(speed))return false;this.state.data.timeSpeed=speed;this.state.save();return true;}
 get phase(){return this.data.phase;}
 get weather(){return this.data.weather;}
 get description(){return describeTime(this.data);}
 rainWater(){
  if(this.weather!=='Hujan')return 0;
  let n=0;
  const plots=this.state.data.garden?.plots||[];
  for(const plot of plots){
   if(plot&&!plot.watered){plot.watered=true;n++;}
  }
  if(n)this.state.save();
  return n;
 }
 advance(deltaMs){
  if(this.lastDay!==this.state.data.day){this.startDay();return true;}
  this.rainWater();
  if(!Number.isFinite(deltaMs)||deltaMs<=0||this.phase>=3)return false;
  this.elapsed+=Math.min(deltaMs,1000)*this.speed;
  if(this.elapsed<PHASE_SECONDS*1000)return false;
  this.elapsed-=PHASE_SECONDS*1000;
  this.data.phase=Math.min(3,this.phase+1);
  this.state.save();
  return true;
 }
 startDay(){
  this.lastDay=this.state.data.day;
  this.state.data.timeWeather=defaultTime(this.lastDay);
  this.elapsed=0;
  this.rainWater();
  this.state.save();
 }
 setPhase(phase){ // development/automated QA, not a player-facing clock shortcut.
  if(!Number.isInteger(phase)||phase<0||phase>3)return false;
  this.data.phase=phase;this.elapsed=0;this.state.save();return true;
 }
}
