// v1.6 — mini-game edukasi gizi SD, berpijak pada pedoman "Isi Piringku" Kemenkes.
// Piring dianalogikan menjadi 6 bagian: 2 makanan pokok, 1 lauk, 2 sayur, 1 buah.
// Ini alat belajar sederhana, bukan saran medis atau takaran individual.
export const LEARNING_SOURCE='https://ayosehat.kemkes.go.id/isi-piringku-kebutuhan-gizi-harian-seimbang';
export const REWARDS=Object.freeze({quiz:{stars:3,coins:15},plate:{stars:2,coins:10}});
export const FOOD_GROUPS=Object.freeze({
 pokok:{name:'Makanan pokok',emoji:'🍚',hint:'Sumber tenaga untuk belajar dan bermain.',share:2},
 lauk:{name:'Lauk-pauk',emoji:'🥚',hint:'Membantu tubuh tumbuh dan memperbaiki jaringan.',share:1},
 sayur:{name:'Sayuran',emoji:'🥬',hint:'Menyumbang serat, vitamin, dan mineral.',share:2},
 buah:{name:'Buah-buahan',emoji:'🍌',hint:'Menyumbang vitamin, mineral, dan serat.',share:1}
});
export const FOOD_OPTIONS=Object.freeze([
 {id:'nasi',name:'Nasi',emoji:'🍚',group:'pokok'},
 {id:'jagung',name:'Jagung',emoji:'🌽',group:'pokok'},
 {id:'telur',name:'Telur',emoji:'🥚',group:'lauk'},
 {id:'ikan',name:'Ikan',emoji:'🐟',group:'lauk'},
 {id:'tahu',name:'Tahu',emoji:'🟨',group:'lauk'},
 {id:'bayam',name:'Bayam',emoji:'🥬',group:'sayur'},
 {id:'wortel',name:'Wortel',emoji:'🥕',group:'sayur'},
 {id:'kangkung',name:'Kangkung',emoji:'🌿',group:'sayur'},
 {id:'pisang',name:'Pisang',emoji:'🍌',group:'buah'},
 {id:'pepaya',name:'Pepaya',emoji:'🍈',group:'buah'},
 {id:'jeruk',name:'Jeruk',emoji:'🍊',group:'buah'}
]);
export const QUIZ_QUESTIONS=Object.freeze([
 {id:'q1',question:'Nasi termasuk kelompok makanan apa?',choices:['Makanan pokok','Lauk-pauk','Sayuran','Buah-buahan'],correct:0,feedback:'Nasi adalah makanan pokok yang memberi tenaga.'},
 {id:'q2',question:'Contoh lauk yang menjadi sumber protein adalah ...',choices:['Bayam','Jeruk','Telur','Nasi'],correct:2,feedback:'Telur adalah lauk sumber protein. Ikan dan tahu juga sumber protein.'},
 {id:'q3',question:'Menurut Isi Piringku, bagian piring untuk sayur dan buah bersama-sama adalah ...',choices:['Hanya sedikit sekali','Setengah piring','Semua piring','Tidak perlu'],correct:1,feedback:'Setengah piring untuk sayur dan buah. Setengah lainnya untuk makanan pokok dan lauk.'},
 {id:'q4',question:'Apa yang sebaiknya dilakukan sebelum makan?',choices:['Langsung bermain','Mencuci tangan dengan sabun','Tidak minum air','Melewatkan sayur'],correct:1,feedback:'Cuci tangan dengan sabun sebelum makan untuk membantu menjaga kebersihan.'},
 {id:'q5',question:'Wortel dan bayam paling cocok masuk kelompok ...',choices:['Lauk-pauk','Makanan pokok','Buah-buahan','Sayuran'],correct:3,feedback:'Wortel dan bayam adalah sayuran yang memberi serat, vitamin, dan mineral.'},
 {id:'q6',question:'Mengapa kita perlu makan berbagai jenis makanan?',choices:['Karena satu makanan sudah cukup','Supaya tidak perlu minum','Agar mendapat beragam zat gizi','Karena sayur tidak penting'],correct:2,feedback:'Tidak ada satu makanan yang memenuhi seluruh kebutuhan zat gizi. Makan beragam itu penting.'}
]);
const safeInt=(value,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(value)&&value>=0?Math.min(max,value):0;
export function defaultLearning(){
 return {stars:0,quiz:{lastRewardDay:0,completed:0},plate:{lastRewardDay:0,completed:0}};
}
export function normalizeLearning(raw){
 const base=defaultLearning();
 if(!raw||typeof raw!=='object')return base;
 base.stars=safeInt(raw.stars,999999);
 for(const id of ['quiz','plate']){
  base[id].lastRewardDay=safeInt(raw[id]?.lastRewardDay);
  base[id].completed=safeInt(raw[id]?.completed,99999);
 }
 return base;
}
export const PLATE_STEPS=['pokok','lauk','sayur','buah'];
export function quizForDay(day){
 const n=Math.max(1,safeInt(day));
 const offset=(n-1)%QUIZ_QUESTIONS.length;
 return [0,1,2].map(i=>QUIZ_QUESTIONS[(offset+i)%QUIZ_QUESTIONS.length]);
}
export function inspectPlate(selections){
 const choices=selections&&typeof selections==='object'?selections:{};
 const result={};let all=true;
 for(const id of PLATE_STEPS){
  const item=FOOD_OPTIONS.find(x=>x.id===choices[id]);
  const valid=!!item&&item.group===id;
  result[id]={valid,item:item??null};
  if(!valid)all=false;
 }
 return {complete:all,groups:result};
}
export class LearningSystem{
 constructor(state){
  this.state=state;
  this.state.data.learning=normalizeLearning(this.state.data.learning);
 }
 get data(){return this.state.data.learning;}
 get stars(){return this.data.stars;}
 get day(){return Math.max(1,safeInt(this.state.data.day));}
 questions(){return quizForDay(this.day);}
 canClaim(kind){return !!REWARDS[kind]&&this.data[kind].lastRewardDay!==this.day;}
 claim(kind,valid){
  if(valid!==true||!this.canClaim(kind))return null;
  const reward=REWARDS[kind],entry=this.data[kind];
  entry.lastRewardDay=this.day;
  entry.completed++;
  this.data.stars+=reward.stars;
  this.state.data.coins+=reward.coins;
  this.state.save();
  return {...reward,starsTotal:this.stars};
 }
 quizFinished(correctIds){
  const needed=this.questions().map(q=>q.id);
  const all=Array.isArray(correctIds)&&needed.every(id=>correctIds.includes(id));
  return this.claim('quiz',all);
 }
 plateFinished(selections){
  return this.claim('plate',inspectPlate(selections).complete);
 }
}
