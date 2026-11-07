// v1.10 — festival hosted in the existing traditional market, every fourth game day.
// Daily featured harvest can reward once per day; festival itself rewards only once per event.
export const FESTIVAL_INTERVAL=4;
export const FESTIVAL_START=3;
export const FEATURED_CROPS=Object.freeze(['bayam','wortel','selada','tomat','brokoli','kangkung','labu']);
export const FESTIVAL_QUESTIONS=Object.freeze([
 {question:'Brokoli dan bayam termasuk kelompok apa?',choices:['Sayuran','Makanan pokok','Lauk'],correct:0,
  feedback:'Betul! Sayuran membantu kita mendapat serat, vitamin, dan mineral.'},
 {question:'Mengapa kita perlu makan makanan beragam?',choices:['Agar tidak perlu air','Untuk memperoleh berbagai zat gizi','Supaya tidak perlu sarapan'],correct:1,
  feedback:'Betul! Makan beragam membantu mendapatkan zat gizi yang berbeda-beda.'},
 {question:'Labu dan wortel adalah contoh ...',choices:['Minuman','Peralatan masak','Sayuran'],correct:2,
  feedback:'Betul! Labu dan wortel dapat menjadi bagian dari menu sayuran.'}
]);
const safe=(n,max=999999)=>Number.isSafeInteger(n)&&n>=0?Math.min(n,max):0;
export function isFestivalDay(day){return Number.isSafeInteger(day)&&day>=FESTIVAL_START&&(day-FESTIVAL_START)%FESTIVAL_INTERVAL===0;}
export function nextFestivalDay(day){
 const n=Math.max(1,safe(day));
 if(n<=FESTIVAL_START)return FESTIVAL_START;
 return FESTIVAL_START+Math.ceil((n-FESTIVAL_START)/FESTIVAL_INTERVAL)*FESTIVAL_INTERVAL;
}
export function featuredCrop(day){return FEATURED_CROPS[(Math.max(1,safe(day))-1)%FEATURED_CROPS.length];}
export function festivalQuestion(day){return FESTIVAL_QUESTIONS[Math.floor((Math.max(FESTIVAL_START,safe(day))-FESTIVAL_START)/FESTIVAL_INTERVAL)%FESTIVAL_QUESTIONS.length];}
export function defaultFestival(){return {harvestBonusDay:0,harvestBonusCount:0,joinedDays:[],quizPassedDay:0,celebratedDays:[],communityDays:[],cookingDays:[]};}
export function normalizeFestival(raw){
 const state=defaultFestival();
 if(!raw||typeof raw!=='object')return state;
 state.harvestBonusDay=safe(raw.harvestBonusDay);
 state.harvestBonusCount=safe(raw.harvestBonusCount);
 state.joinedDays=Array.isArray(raw.joinedDays)?[...new Set(raw.joinedDays.filter(isFestivalDay))].slice(-150):[];
 state.quizPassedDay=safe(raw.quizPassedDay);
 state.celebratedDays=Array.isArray(raw.celebratedDays)?
  [...new Set(raw.celebratedDays.filter(isFestivalDay))].slice(-150):[];
 state.communityDays=Array.isArray(raw.communityDays)?[...new Set(raw.communityDays.filter(isFestivalDay))].slice(-150):[];
 state.cookingDays=Array.isArray(raw.cookingDays)?[...new Set(raw.cookingDays.filter(isFestivalDay))].slice(-150):[];
 return state;
}
export class FestivalSystem{
 constructor(state){this.state=state;state.data.festival=normalizeFestival(state.data.festival);}
 get data(){return this.state.data.festival;}
 get day(){return this.state.data.day;}
 get active(){return isFestivalDay(this.day);}
 get featured(){return featuredCrop(this.day);}
 get next(){return nextFestivalDay(this.day);}
 get question(){return festivalQuestion(this.day);}
 get status(){return {day:this.day,active:this.active,next:this.next,featured:this.featured,
  joined:this.data.joinedDays.includes(this.day),
  quizPassed:this.data.quizPassedDay===this.day,
  celebrated:this.data.celebratedDays.includes(this.day),
  communityDone:this.data.communityDays.includes(this.day),cookingDone:this.data.cookingDays.includes(this.day)};}
 award(coins,stars){
  this.state.data.coins+=coins;
  this.state.data.learning??={stars:0};
  this.state.data.learning.stars=(this.state.data.learning.stars||0)+stars;
 }
 harvest(crop){
  if(crop!==this.featured||this.data.harvestBonusDay===this.day)return null;
  this.data.harvestBonusDay=this.day;
  this.data.harvestBonusCount++;
  this.award(9,1);this.state.save();
  return {coins:9,stars:1};
 }
 join(){
  if(!this.active||this.data.joinedDays.includes(this.day))return false;
  this.data.joinedDays.push(this.day);
  this.state.save();return true;
 }
 quiz(choice){
  if(!this.active||!this.data.joinedDays.includes(this.day)||this.status.celebrated)return false;
  if(choice!==this.question.correct)return false;
  this.data.quizPassedDay=this.day;this.state.save();return true;
 }
 // Festival side activities are independent of the existing quiz reward.
 communityHelp(){
  if(!this.active||!this.status.joined||this.status.communityDone)return null;
  this.data.communityDays.push(this.day);this.award(12,2);this.state.save();
  return {coins:12,stars:2};
 }
 cookingContest(choice){
  if(!this.active||!this.status.joined||this.status.cookingDone||choice!==1)return null;
  this.data.cookingDays.push(this.day);this.award(18,2);this.state.save();
  return {coins:18,stars:2};
 }
 celebrate(){
  if(!this.active||!this.status.joined||!this.status.quizPassed||this.status.celebrated)return null;
  this.data.celebratedDays.push(this.day);
  this.award(35,4);
  this.state.save();return {coins:35,stars:4};
 }
}
