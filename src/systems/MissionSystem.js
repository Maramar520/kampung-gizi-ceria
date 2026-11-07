// v1.8 — daily activity milestones and one-time achievement rewards.
// All counts are game events; rendering menus never awards progress.
export const MISSION_DEFS=Object.freeze([
 {id:'plant',emoji:'🌱',title:'Menanam satu bibit',target:1,stars:1,coins:8},
 {id:'harvest',emoji:'🥬',title:'Memanen sayuran',target:1,stars:2,coins:10},
 {id:'cook',emoji:'🍳',title:'Memasak satu hidangan',target:1,stars:2,coins:12},
 {id:'friend',emoji:'🤝',title:'Menyapa seorang warga',target:1,stars:1,coins:8},
 {id:'help',emoji:'📚',title:'Membantu Kak Rani merapikan buku',target:1,stars:2,coins:10},
 {id:'learn',emoji:'📚',title:'Belajar gizi di perpustakaan',target:1,stars:2,coins:10}
]);
export const ACHIEVEMENTS=Object.freeze([
 {id:'first-plant',title:'Sahabat Kebun',emoji:'🌿',event:'plant',target:1,stars:3,coins:15},
 {id:'first-harvest',title:'Panen Ceria',emoji:'🥕',event:'harvest',target:1,stars:3,coins:15},
 {id:'first-dish',title:'Koki Kecil',emoji:'👩‍🍳',event:'cook',target:1,stars:3,coins:15},
 {id:'first-friend',title:'Teman Baik',emoji:'💞',event:'friend',target:1,stars:3,coins:15},
 {id:'first-help',title:'Penolong Perpustakaan',emoji:'📚',event:'help',target:1,stars:3,coins:15},
 {id:'first-learning',title:'Pembaca Gizi',emoji:'📖',event:'learn',target:1,stars:3,coins:15},
 {id:'daily-hero',title:'Bintang Kampung',emoji:'🏆',event:'claimed',target:5,stars:5,coins:25}
]);
const safe=n=>Number.isSafeInteger(n)&&n>=0?Math.min(n,100000):0;
export function defaultMissions(day=1){
 return {day,progress:Object.fromEntries(MISSION_DEFS.map(m=>[m.id,0])),
  claimed:[],totals:{},achievements:[]};
}
export function normalizeMissions(raw,day=1){
 const s=defaultMissions(day);
 if(raw&&typeof raw==='object'){
  s.day=safe(raw.day)||day;
  for(const def of MISSION_DEFS)s.progress[def.id]=Math.min(def.target,safe(raw.progress?.[def.id]));
  s.claimed=Array.isArray(raw.claimed)?[...new Set(raw.claimed.filter(id=>MISSION_DEFS.some(x=>x.id===id)))]:[];
  s.totals=Object.fromEntries(Object.entries(raw.totals||{}).filter(([k])=>[...MISSION_DEFS.map(x=>x.id),'claimed'].includes(k)).map(([k,v])=>[k,safe(v)]));
  s.achievements=Array.isArray(raw.achievements)?[...new Set(raw.achievements.filter(id=>ACHIEVEMENTS.some(x=>x.id===id)))]:[];
 }
 // Never transfer yesterday's unclaimed mission progress to another day.
 if(s.day!==day){s.day=day;s.progress=defaultMissions(day).progress;s.claimed=[];}
 return s;
}
export class MissionSystem {
 constructor(state){this.state=state;this.state.data.missions=normalizeMissions(state.data.missions,state.data.day);}
 get data(){
  if(this.state.data.missions?.day!==this.state.data.day)this.state.data.missions=normalizeMissions(this.state.data.missions,this.state.data.day);
  return this.state.data.missions;
 }
 progress(id){return this.data.progress[id]||0;}
 record(id){
  const def=MISSION_DEFS.find(m=>m.id===id);if(!def)return false;
  const d=this.data;
  d.progress[id]=Math.min(def.target,d.progress[id]+1);
  d.totals[id]=safe((d.totals[id]||0)+1);
  this.state.save();return true;
 }
 award(stars,coins){
  this.state.data.learning??={stars:0};
  this.state.data.learning.stars=safe((this.state.data.learning.stars||0)+stars);
  this.state.data.coins=safe((this.state.data.coins||0)+coins);
 }
 claim(id){
  const d=this.data,def=MISSION_DEFS.find(m=>m.id===id);
  if(!def||this.progress(id)<def.target||d.claimed.includes(id))return null;
  d.claimed.push(id);d.totals.claimed=safe((d.totals.claimed||0)+1);
  this.award(def.stars,def.coins);this.state.save();
  return {stars:def.stars,coins:def.coins};
 }
 claimAchievement(id){
  const d=this.data,def=ACHIEVEMENTS.find(a=>a.id===id);
  if(!def||d.achievements.includes(id)||(d.totals[def.event]||0)<def.target)return null;
  d.achievements.push(id);this.award(def.stars,def.coins);this.state.save();
  return {stars:def.stars,coins:def.coins};
 }
 daily(){return MISSION_DEFS.map(def=>({...def,count:this.progress(def.id),claimed:this.data.claimed.includes(def.id)}));}
 badges(){return ACHIEVEMENTS.map(def=>({...def,earned:this.data.achievements.includes(def.id),
  ready:(this.data.totals[def.event]||0)>=def.target}));}
}
