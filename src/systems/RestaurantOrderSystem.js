// v1.9 — customer orders use actual cooking, never duplicate ingredient removal.
// The order rotates with the game day; only one reward can be claimed per day.
export const RESTAURANT_ORDERS=Object.freeze([
 {recipe:'sup-wortel-tomat',customer:'Nia',coins:32,stars:2},
 {recipe:'tumis-kangkung',customer:'Bu Sari',coins:36,stars:2},
 {recipe:'ikan-tomat',customer:'Pak Tani',coins:42,stars:3},
 {recipe:'nasi-sayur-warna',customer:'Kak Rani',coins:48,stars:3}
]);
const safe=(n)=>Number.isSafeInteger(n)&&n>=0?Math.min(n,999999):0;
export function orderForDay(day){
 return RESTAURANT_ORDERS[(Math.max(1,safe(day))-1)%RESTAURANT_ORDERS.length];
}
export function defaultRestaurant(day=1){
 return {day,prepared:null,served:false,completed:0};
}
export function normalizeRestaurant(raw,day=1){
 const value=defaultRestaurant(day);
 if(!raw||typeof raw!=='object')return value;
 value.completed=safe(raw.completed);
 if(raw.day===day){
  value.prepared=raw.prepared===orderForDay(day).recipe?raw.prepared:null;
  value.served=raw.served===true;
  if(value.served)value.prepared=null;
 }
 return value;
}
export class RestaurantOrderSystem{
 constructor(state){this.state=state;state.data.restaurant=normalizeRestaurant(state.data.restaurant,state.data.day);}
 get data(){
  if(this.state.data.restaurant?.day!==this.state.data.day)
   this.state.data.restaurant=normalizeRestaurant(this.state.data.restaurant,this.state.data.day);
  return this.state.data.restaurant;
 }
 get order(){return orderForDay(this.state.data.day);}
 get status(){return {order:this.order,prepared:this.data.prepared===this.order.recipe,
  served:this.data.served,completed:this.data.completed};}
 onCook(id){
  if(id!==this.order.recipe||this.data.served||this.data.prepared)return false;
  this.data.prepared=id;
  this.state.save();return true;
 }
 serve(){
  const s=this.status;if(!s.prepared||s.served)return null;
  this.data.prepared=null;this.data.served=true;this.data.completed++;
  this.state.data.coins+=s.order.coins;
  this.state.data.learning??={stars:0};
  this.state.data.learning.stars=(this.state.data.learning.stars||0)+s.order.stars;
  this.state.save();
  return {coins:s.order.coins,stars:s.order.stars,customer:s.order.customer};
 }
}
