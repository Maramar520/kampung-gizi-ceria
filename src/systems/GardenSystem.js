// Kebun sayur v0.8: tiga petak bayam. Pertumbuhan mengikuti hari game, bukan jam nyata.
// Simpan dalam GameState agar aman ketika tab ditutup.
export const PLOT_COUNT=3;
export const STARTER_SEEDS=3;
export const SEED_PRICE=5;
export const HARVEST_AMOUNT=2;
export function defaultGarden(){return {seeds:STARTER_SEEDS,plots:Array(PLOT_COUNT).fill(null)};}
export function normalizeGarden(raw){
 const base=defaultGarden();
 if(!raw||typeof raw!=='object')return base;
 const seeds=Number(raw.seeds);
 base.seeds=Number.isFinite(seeds)?Math.max(0,Math.floor(seeds)):STARTER_SEEDS;
 const list=Array.isArray(raw.plots)?raw.plots:[];
 base.plots=Array.from({length:PLOT_COUNT},(_,i)=>{
  const plot=list[i];
  if(!plot||plot.crop!=='bayam')return null;
  const day=Number(plot.plantedDay);
  return {crop:'bayam',plantedDay:Number.isFinite(day)?Math.max(1,Math.floor(day)):1,watered:!!plot.watered};
 });
 return base;
}
export function plotStage(plot,day){
 if(!plot)return 'empty';
 if(!plot.watered)return 'dry';
 if(day>plot.plantedDay)return 'ready';
 return 'growing';
}
export function gardenView(data){
 const garden=normalizeGarden(data.garden);
 return {seeds:garden.seeds,plots:garden.plots.map((plot,index)=>({
  index,stage:plotStage(plot,data.day),watered:!!plot?.watered,plantedDay:plot?.plantedDay??null
 }))};
}
export class GardenSystem {
 constructor(state){this.state=state;this.state.data.garden=normalizeGarden(this.state.data.garden);}
 get view(){return gardenView(this.state.data);}
 get day(){return this.state.data.day;}
 save(){this.state.save();}
 plot(index){return Number.isInteger(index)&&index>=0&&index<PLOT_COUNT?this.state.data.garden.plots[index]:undefined;}
 plant(index){
  const s=this.state.data, garden=s.garden;
  if(this.plot(index)!==null||garden.seeds<1)return false;
  garden.plots[index]={crop:'bayam',plantedDay:s.day,watered:false};
  garden.seeds--;this.save();return true;
 }
 water(index){
  const plot=this.plot(index);
  if(!plot||plot.watered)return false;
  plot.watered=true;this.save();return true;
 }
 harvest(index){
  const plot=this.plot(index);
  if(!plot||plotStage(plot,this.day)!=='ready')return false;
  const s=this.state.data;
  s.inventory.bayam=(s.inventory.bayam||0)+HARVEST_AMOUNT;
  s.garden.seeds+=1; // Satu benih kembali setelah panen untuk siklus berikutnya.
  s.garden.plots[index]=null;
  this.save();return true;
 }
 buySeeds(count=1){
  const s=this.state.data;
  if(!Number.isInteger(count)||count<1||s.coins<SEED_PRICE*count)return false;
  s.coins-=SEED_PRICE*count;s.garden.seeds+=count;
  this.save();return true;
 }
}
