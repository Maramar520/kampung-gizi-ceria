// v1.0 Daily activities. Progress follows in-game days (sleeping), not real-world clocks.
export function defaultActivities(){return {coop:{lastCollectedDay:0,fedDay:0},pond:{lastFishedDay:0,casts:0}};}
export function normalizeActivities(raw){
 const initial=defaultActivities(),obj=raw&&typeof raw==='object'?raw:{};
 const safe=(v)=>Number.isSafeInteger(Number(v))&&Number(v)>0?Number(v):0;
 return {coop:{lastCollectedDay:safe(obj.coop?.lastCollectedDay),fedDay:safe(obj.coop?.fedDay)},
 pond:{lastFishedDay:safe(obj.pond?.lastFishedDay),casts:Math.min(2,safe(obj.pond?.casts))}};
}
export function dailyStatus(data){
 const a=normalizeActivities(data.activities),day=data.day;
 return {day,eggsReady:a.coop.fedDay===day&&a.coop.lastCollectedDay!==day,
 fedToday:a.coop.fedDay===day,eggsCollected:a.coop.lastCollectedDay===day,
 fishReady:a.pond.lastFishedDay!==day,casts:a.pond.casts};
}
export class DailyLifeSystem{
 constructor(state){this.state=state;this.state.data.activities=normalizeActivities(this.state.data.activities);}
 get status(){return dailyStatus(this.state.data);}
 feed(){
  const s=this.state.data,st=this.status;
  if(st.fedToday||st.eggsCollected||s.coins<3)return false;
  s.coins-=3;s.activities.coop.fedDay=s.day;this.state.save();return true;
 }
 collectEggs(){
  const s=this.state.data;if(!this.status.eggsReady)return false;
  s.inventory.telur=(s.inventory.telur||0)+2;
  s.activities.coop.lastCollectedDay=s.day;this.state.save();return true;
 }
 cast(){
  const s=this.state.data;if(!this.status.fishReady)return {success:false,casts:this.status.casts};
  s.activities.pond.casts++;
  if(s.activities.pond.casts<3){this.state.save();return {success:false,casts:s.activities.pond.casts};}
  s.inventory.ikan=(s.inventory.ikan||0)+1;
  s.activities.pond.casts=0;s.activities.pond.lastFishedDay=s.day;
  this.state.save();return {success:true,casts:3};
 }
}
