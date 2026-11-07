// v0.9 — empat sayuran di tiga petak, kompatibel dengan save v0.8.
export const PLOT_COUNT=3, STARTER_SEEDS=3, SEED_PRICE=5, HARVEST_AMOUNT=2;
export const CROPS=Object.freeze({
 bayam:{name:'Bayam',emoji:'🥬',price:5,days:1,yield:2},
 wortel:{name:'Wortel',emoji:'🥕',price:7,days:2,yield:2},
 tomat:{name:'Tomat',emoji:'🍅',price:8,days:2,yield:2},
 kangkung:{name:'Kangkung',emoji:'🥬',price:6,days:1,yield:2}
});
export const CROP_IDS=Object.keys(CROPS);
export function defaultGarden(){return {seeds:STARTER_SEEDS,seedsByCrop:{bayam:STARTER_SEEDS,wortel:1,tomat:1,kangkung:1},plots:Array(PLOT_COUNT).fill(null)};}
const qty=(x,fallback=0)=>Number.isFinite(Number(x))?Math.max(0,Math.floor(Number(x))):fallback;
export function normalizeGarden(raw){
 const base=defaultGarden();
 if(!raw||typeof raw!=='object')return base;
 // Save lama hanya menyimpan garden.seeds dan tiga petak bayam.
 const seeds=qty(raw.seeds,STARTER_SEEDS);
 base.seedsByCrop=Object.fromEntries(CROP_IDS.map(id=>[id,qty(raw.seedsByCrop?.[id],id==='bayam'?seeds:1)]));
 base.seeds=base.seedsByCrop.bayam;
 const list=Array.isArray(raw.plots)?raw.plots:[];
 base.plots=Array.from({length:PLOT_COUNT},(_,i)=>{
  const plot=list[i];if(!plot||!CROPS[plot.crop])return null;
  return {crop:plot.crop,plantedDay:Math.max(1,qty(plot.plantedDay,1)),watered:!!plot.watered};
 });
 return base;
}
export function plotStage(plot,day){
 if(!plot)return 'empty';
 if(!plot.watered)return 'dry';
 if(day>=plot.plantedDay+CROPS[plot.crop].days)return 'ready';
 return 'growing';
}
export function gardenView(data){
 const garden=normalizeGarden(data.garden);
 return {seeds:garden.seeds,seedsByCrop:{...garden.seedsByCrop},plots:garden.plots.map((plot,index)=>({
  index,crop:plot?.crop??null,name:plot?CROPS[plot.crop].name:null,emoji:plot?CROPS[plot.crop].emoji:'🟫',
  stage:plotStage(plot,Number(data.day)||1),watered:!!plot?.watered,
  plantedDay:plot?.plantedDay??null,
  daysLeft:plot?Math.max(0,plot.plantedDay+CROPS[plot.crop].days-(Number(data.day)||1)):0
 }))};
}
export class GardenSystem{
 constructor(state){this.state=state;this.state.data.garden=normalizeGarden(this.state.data.garden);}
 get view(){return gardenView(this.state.data);}
 get day(){return this.state.data.day;}
 save(){this.state.save();}
 plot(index){return Number.isInteger(index)&&index>=0&&index<PLOT_COUNT?this.state.data.garden.plots[index]:undefined;}
 sync(){this.state.data.garden.seeds=this.state.data.garden.seedsByCrop.bayam;}
 plant(index,crop='bayam'){
  const garden=this.state.data.garden;
  if(!CROPS[crop]||this.plot(index)!==null||garden.seedsByCrop[crop]<1)return false;
  garden.plots[index]={crop,plantedDay:this.day,watered:false};
  garden.seedsByCrop[crop]--;this.sync();this.save();return true;
 }
 water(index){
  const plot=this.plot(index);if(!plot||plot.watered)return false;
  plot.watered=true;this.save();return true;
 }
 harvest(index){
  const plot=this.plot(index);
  if(!plot||plotStage(plot,this.day)!=='ready')return false;
  const garden=this.state.data.garden,crop=plot.crop;
  this.state.data.inventory[crop]=(this.state.data.inventory[crop]||0)+CROPS[crop].yield;
  garden.seedsByCrop[crop]+=1;garden.plots[index]=null;
  this.sync();this.save();return true;
 }
 buySeeds(count=1,crop='bayam'){
  const s=this.state.data;
  if(!CROPS[crop]||!Number.isInteger(count)||count<1||s.coins<CROPS[crop].price*count)return false;
  s.coins-=CROPS[crop].price*count;s.garden.seedsByCrop[crop]+=count;
  this.sync();this.save();return true;
 }
}
