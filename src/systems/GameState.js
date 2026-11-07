export const SAVE_KEY='kampung-gizi-pixel-v02';
export const defaults=()=>({x:480,y:530,coins:100,energy:80,carb:40,protein:30,vitamin:25,day:1,inventory:{},garden:{seeds:3,seedsByCrop:{bayam:3,wortel:1,tomat:1,kangkung:1},plots:[null,null,null]},cooked:false,done:false,recipeKnown:false});
export class GameState {
 constructor(){this.data=defaults();try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');this.data={...this.data,...saved,inventory:{...saved.inventory}}}catch{}}
 save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.data))}catch{}}
 reset(){this.data=defaults();this.save()}
 get status(){const s=this.data;return s.energy<20?'Lemas':Math.min(s.carb,s.protein,s.vitamin)>=50&&s.energy>=40?'Bugar':'Normal'}
}
