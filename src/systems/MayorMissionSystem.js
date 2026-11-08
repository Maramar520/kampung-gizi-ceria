// Versioned add-on stored inside existing save; old save key remains untouched.
export const MAYOR_TASKS=Object.freeze([
 {id:'move',name:'Ikut senam di Alun-Alun',coins:16,stars:2},
 {id:'festival',name:'Bantu warga saat festival',coins:24,stars:3},
 {id:'farm',name:'Rawat tanaman di kebun',coins:12,stars:1},
 {id:'coop',name:'Beri makan ayam',coins:12,stars:1}
]);
const dayList=v=>Array.isArray(v)?[...new Set(v.filter(n=>Number.isSafeInteger(n)&&n>0))].slice(-120):[];
export class MayorMissionSystem{
 constructor(state){this.state=state;const d=state.data.mayorMissions||{};
  state.data.mayorMissions={claimedMove:dayList(d.claimedMove),claimedFestival:dayList(d.claimedFestival),claimedFarm:dayList(d.claimedFarm),claimedCoop:dayList(d.claimedCoop)};
 }
 get day(){return this.state.data.day;}
 get progress(){const d=this.state.data;
  return {move:!!d.plazaActivities?.days?.includes(this.day),
   festival:!!d.festival?.communityDays?.includes(this.day),
   farm:!!d.garden?.plots?.some(p=>p?.watered&&p.plantedDay===this.day),
   coop:d.activities?.coop?.fedDay===this.day};
 }
 get status(){const p=this.progress,m=this.state.data.mayorMissions;
  return MAYOR_TASKS.map(t=>({...t,done:p[t.id],claimed:m[({move:'claimedMove',festival:'claimedFestival',farm:'claimedFarm',coop:'claimedCoop'})[t.id]].includes(this.day)}));
 }
 claim(id){const t=this.status.find(t=>t.id===id);
  if(!t||!t.done||t.claimed)return null;
  const key=({move:'claimedMove',festival:'claimedFestival',farm:'claimedFarm',coop:'claimedCoop'})[id];
  this.state.data.mayorMissions[key].push(this.day);
  this.state.data.mayorMissions[key]=dayList(this.state.data.mayorMissions[key]);
  this.state.data.coins+=t.coins;
  this.state.data.learning??={stars:0};
  this.state.data.learning.stars=(this.state.data.learning.stars||0)+t.stars;
  this.state.save();return {coins:t.coins,stars:t.stars};
 }
}
