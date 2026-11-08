// v1.27 — acara sosial dan hadiah ulang tahun. Menambah field save, tidak mengganti key.
export const SOCIAL_EVENTS=Object.freeze([
 {id:'picnic',name:'🧺 Piknik Menu Sehat',description:'Pilih bekal dengan sayur, buah, lauk dan air putih.',coins:12},
 {id:'exercise',name:'🤸 Senam Bersama',description:'Bergerak aktif lalu istirahat dan minum air putih.',coins:10},
 {id:'dinner',name:'🥗 Makan Bersama',description:'Belajar membagi Isi Piringku dengan warga.',coins:14}
]);
export function socialEvent(day,phase,weather){
 if(weather==='Hujan'||phase===3||!Number.isSafeInteger(day)||day<1)return null;
 return SOCIAL_EVENTS[(day-1)%SOCIAL_EVENTS.length];
}
export class CommunitySocialSystem{
 constructor(state){this.state=state;const old=state.data.communitySocial||{};
  state.data.communitySocial={joined:Array.isArray(old.joined)?old.joined.filter(Number.isSafeInteger).slice(-100):[],
   birthdays:old.birthdays&&typeof old.birthdays==='object'?old.birthdays:{}};
 }
 get event(){const d=this.state.data;return socialEvent(d.day,d.timeWeather?.phase??0,d.timeWeather?.weather||'Cerah');}
 get joined(){return this.state.data.communitySocial.joined.includes(this.state.data.day);}
 join(){const event=this.event;if(!event||this.joined)return null;
  const d=this.state.data;d.communitySocial.joined.push(d.day);d.communitySocial.joined=d.communitySocial.joined.slice(-100);
  d.coins+=event.coins;d.learning??={stars:0};d.learning.stars=(d.learning.stars||0)+1;this.state.save();return event;
 }
 birthdayReward(id,birthdayToday){
  const d=this.state.data;if(!birthdayToday(id,d.day))return false;
  const key=String(d.day);if(d.communitySocial.birthdays[id]===key)return false;
  d.communitySocial.birthdays[id]=key;d.coins+=8;this.state.save();return true;
 }
}
