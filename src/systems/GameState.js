export const SAVE_KEY='kampung-gizi-pixel-v02';
export const defaults=()=>({x:446,y:291,coins:100,energy:80,carb:40,protein:30,vitamin:25,day:1,inventory:{},garden:{seeds:3,seedsByCrop:{bayam:3,wortel:1,tomat:1,kangkung:1},plots:[null,null,null]},activities:{coop:{lastCollectedDay:0,fedDay:0},pond:{lastFishedDay:0,casts:0}},social:{friends:{sari:{hearts:0,lastTalkDay:0},chef:{hearts:0,lastTalkDay:0},tani:{hearts:0,lastTalkDay:0},nia:{hearts:0,lastTalkDay:0}}},learning:{stars:0,quiz:{lastRewardDay:0,completed:0},plate:{lastRewardDay:0,completed:0}},timeWeather:{phase:0,weather:'Cerah'},missions:{day:1,progress:{plant:0,harvest:0,cook:0,friend:0,learn:0},claimed:[],totals:{},achievements:[]},cooked:false,done:false,recipeKnown:false});
export class GameState {
 constructor(){this.data=defaults();try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');this.data={...this.data,...saved,inventory:{...saved.inventory}}}catch{}}
 save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.data))}catch{}}
 reset(){this.data=defaults();this.save()}
 get status(){const s=this.data;return s.energy<20?'Lemas':Math.min(s.carb,s.protein,s.vitamin)>=50&&s.energy>=40?'Bugar':'Normal'}
}
