// v1.19: hadiah, ulang tahun dan persahabatan memakai save key permainan yang sama.
export const BIRTHDAYS=Object.freeze({sari:4,chef:9,tani:14,nia:19,rani:24,arif:7,lina:12,mayor:17,riko:22});
export const GIFT_IDS=Object.freeze(['apel','wortel','bayam','tomat','ikan','telur','kerang']);
const safe=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export function normalizeFriendEvents(raw){
 const x=raw&&typeof raw==='object'?raw:{};
 const gifts={};
 for(const [id,day] of Object.entries(x.gifts||{}))if(Object.hasOwn(BIRTHDAYS,id))gifts[id]=safe(day);
 return {gifts};
}
export function birthdayToday(id,day){return BIRTHDAYS[id]===((day-1)%28)+1;}
export class FriendEvents {
 constructor(state){this.state=state;this.state.data.friendEvents=normalizeFriendEvents(this.state.data.friendEvents);}
 gift(id,item,social){
  const d=this.state.data,day=d.day;
  if(!Object.hasOwn(BIRTHDAYS,id)||!GIFT_IDS.includes(item))return {ok:false,reason:'Hadiah tidak tersedia.'};
  if(this.state.data.friendEvents.gifts[id]===day)return {ok:false,reason:'Sudah memberi hadiah hari ini.'};
  if((d.inventory[item]||0)<1)return {ok:false,reason:'Barang belum ada di tas.'};
  const p=social.profile(id);
  if(!p)return {ok:false,reason:'Teman belum dikenal.'};
  d.inventory[item]--;
  this.state.data.friendEvents.gifts[id]=day;
  const bonus=birthdayToday(id,day)?2:1;
  const entry=social.ensure().friends[id];
  entry.hearts=Math.min(5,entry.hearts+bonus);
  this.state.save();
  return {ok:true,birthday:bonus===2,hearts:entry.hearts};
 }
}
