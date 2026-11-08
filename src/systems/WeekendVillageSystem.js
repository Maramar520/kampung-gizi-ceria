// v1.24 — kegiatan akhir pekan berlangsung di Alun-Alun, tanpa mengubah denah.
export const WEEKEND_EVENTS=Object.freeze([
 {id:'market',name:'🧺 Pasar Pagi Warga',description:'Belajar memilih sayur segar bersama Bu Sari.',coins:12,stars:1},
 {id:'cleanup',name:'🧹 Kerja Bakti Kampung',description:'Bersihkan alun-alun bersama Lina dan Arif.',coins:15,stars:1},
 {id:'cooking',name:'🥗 Lomba Menu Sehat',description:'Rancang menu bergizi bersama Chef Bimo.',coins:18,stars:2}
]);
export function isWeekend(day){return Number.isSafeInteger(day)&&day>0&&(day%7===6||day%7===0);}
export function weekendEvent(day){return isWeekend(day)?WEEKEND_EVENTS[(Math.floor((day-1)/7))%WEEKEND_EVENTS.length]:null;}
export class WeekendVillageSystem{
 constructor(state){this.state=state;const raw=state.data.weekendVillage;state.data.weekendVillage={claimed:Array.isArray(raw?.claimed)?[...new Set(raw.claimed.filter(Number.isSafeInteger))].slice(-120):[]};}
 get event(){return weekendEvent(this.state.data.day);}
 get completed(){return this.state.data.weekendVillage.claimed.includes(this.state.data.day);}
 join(){const event=this.event;if(!event||this.completed)return null;
  this.state.data.weekendVillage.claimed.push(this.state.data.day);
  this.state.data.weekendVillage.claimed=this.state.data.weekendVillage.claimed.slice(-120);
  this.state.data.coins+=event.coins;
  this.state.data.learning??={stars:0};
  this.state.data.learning.stars=(this.state.data.learning.stars||0)+event.stars;
  this.state.save();return event;
 }
}
