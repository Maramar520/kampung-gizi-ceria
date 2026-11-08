// v1.23 — pasar harian deterministik dan pesanan warga. Data tersimpan dalam save lama.
export const MARKET_GOODS=Object.freeze({beras:12,telur:15,bayam:10,wortel:14,tomat:15,kangkung:12,selada:14,brokoli:19,labu:21});
export const COMMUNITY_EVENTS=Object.freeze([
 {id:'senam',title:'🤸 Senam Bersama',reward:10,stars:1},
 {id:'masak',title:'🥗 Memasak Sehat Bersama',reward:14,stars:1},
 {id:'bakti',title:'🧹 Kerja Bakti Kampung',reward:12,stars:1}
]);
const safe=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export class VillageLifeSystem{
 constructor(state){
  this.state=state;const raw=state.data.villageLife||{};
  state.data.villageLife={purchases:raw.purchases&&typeof raw.purchases==='object'?{...raw.purchases}:{},
   fulfilledDays:Array.isArray(raw.fulfilledDays)?raw.fulfilledDays.filter(Number.isSafeInteger).slice(-120):[],
   eventDays:raw.eventDays&&typeof raw.eventDays==='object'?{...raw.eventDays}:{}};
 }
 get day(){return this.state.data.day;}
 get data(){return this.state.data.villageLife;}
 get featured(){return Object.keys(MARKET_GOODS)[(this.day-1)%Object.keys(MARKET_GOODS).length];}
 price(id){const base=MARKET_GOODS[id];return base==null?null:Math.max(1,base-(id===this.featured?Math.ceil(base*.25):0));}
 stock(id){if(!(id in MARKET_GOODS))return 0;return Math.max(0,3+((this.day+Object.keys(MARKET_GOODS).indexOf(id)*3)%4)-safe(this.data.purchases[this.day+':'+id]));}
 buy(id){
  const price=this.price(id);if(price==null||this.stock(id)<1||this.state.data.coins<price)return false;
  this.state.data.coins-=price;this.state.data.inventory[id]=(this.state.data.inventory[id]||0)+1;
  const key=this.day+':'+id;this.data.purchases[key]=safe(this.data.purchases[key])+1;
  this.state.save();return true;
 }
 get order(){const ids=Object.keys(MARKET_GOODS);const id=ids[(this.day*3)%ids.length];return {id,amount:1,reward:MARKET_GOODS[id]+10};}
 get orderDone(){return this.data.fulfilledDays.includes(this.day);}
 fulfill(){
  if(this.orderDone)return false;const {id,amount,reward}=this.order;
  if((this.state.data.inventory[id]||0)<amount)return false;
  this.state.data.inventory[id]-=amount;this.state.data.coins+=reward;
  this.data.fulfilledDays.push(this.day);this.data.fulfilledDays=this.data.fulfilledDays.slice(-120);
  this.state.save();return true;
 }
 get todayEvent(){return COMMUNITY_EVENTS[(this.day-1)%COMMUNITY_EVENTS.length];}
 get eventDone(){return this.data.eventDays[this.day]===this.todayEvent.id;}
 joinEvent(){
  if(this.eventDone)return false;const event=this.todayEvent;
  this.data.eventDays[this.day]=event.id;
  this.state.data.coins+=event.reward;
  this.state.data.learning??={stars:0};this.state.data.learning.stars=(this.state.data.learning.stars||0)+event.stars;
  this.state.save();return true;
 }
}
