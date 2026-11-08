// v1.18: kegiatan pantai disimpan di state lama tanpa mengganti SAVE_KEY.
export const SEA_FISH=Object.freeze([
 {id:'ikan-kembung',name:'Ikan Kembung',emoji:'🐟',rarity:'Umum'},
 {id:'ikan-kakap',name:'Ikan Kakap',emoji:'🐠',rarity:'Tidak umum'},
 {id:'ikan-tuna',name:'Ikan Tuna',emoji:'🐟',rarity:'Langka'}
]);
const safe=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export function normalizeCoast(raw){
 const c=raw&&typeof raw==='object'?raw:{};
 return {lastFishDay:safe(c.lastFishDay),casts:Math.min(2,safe(c.casts)),
  catches:Array.isArray(c.catches)?c.catches.filter(id=>SEA_FISH.some(f=>f.id===id)).slice(-100):[],
  lastShellDay:safe(c.lastShellDay),lastCleanDay:safe(c.lastCleanDay),
  islandVisits:safe(c.islandVisits),festivalDays:Array.isArray(c.festivalDays)?c.festivalDays.filter(safe).slice(-100):[]};
}
export class CoastSystem {
 constructor(state){this.state=state;this.state.data.coast=normalizeCoast(this.state.data.coast);}
 get data(){return this.state.data.coast;}
 get day(){return this.state.data.day;}
 get festivalToday(){return this.day%7===0;}
 get status(){return {fishReady:this.data.lastFishDay!==this.day,casts:this.data.casts,
  shellReady:this.data.lastShellDay!==this.day,cleanReady:this.data.lastCleanDay!==this.day,
  festivalToday:this.festivalToday,festivalClaimed:this.data.festivalDays.includes(this.day),
  collection:SEA_FISH.map(f=>({...f,count:this.data.catches.filter(id=>id===f.id).length}))};}
 cast(){
  if(!this.status.fishReady)return {success:false,already:true};
  this.data.casts++;
  if(this.data.casts<3){this.state.save();return {success:false,casts:this.data.casts};}
  // Deterministic daily catch so saved games and reloads never reroll a reward.
  const species=SEA_FISH[this.day%7===0?2:this.day%3===0?1:0];
  this.data.casts=0;this.data.lastFishDay=this.day;this.data.catches.push(species.id);
  this.state.data.inventory.ikan=(this.state.data.inventory.ikan||0)+1;
  this.state.save();return {success:true,fish:species};
 }
 shell(){
  if(!this.status.shellReady)return false;
  this.data.lastShellDay=this.day;
  this.state.data.inventory.kerang=(this.state.data.inventory.kerang||0)+1;
  this.state.save();return true;
 }
 clean(){
  if(!this.status.cleanReady)return false;
  this.data.lastCleanDay=this.day;this.state.data.coins+=12;
  this.state.save();return true;
 }
 visitIsland(){this.data.islandVisits++;this.state.save();}
 claimFestival(){
  if(!this.festivalToday||this.status.festivalClaimed||!this.data.catches.length)return false;
  this.data.festivalDays.push(this.day);this.state.data.coins+=25;this.state.save();return true;
 }
}
