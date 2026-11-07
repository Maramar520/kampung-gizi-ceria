export const INGREDIENTS=[['beras',12],['telur',15],['bayam',10]];
export const STEPS=[{title:'Cuci bayam',desc:'Bersihkan sayuran.',emoji:'🥬',button:'Cuci bayam'},{title:'Masak nasi',desc:'Masak nasi dengan bantuan orang dewasa.',emoji:'🍚',button:'Masak nasi'},{title:'Olah telur',desc:'Masak telur sampai matang.',emoji:'🍳',button:'Olah telur'}];
export const RECIPES=Object.freeze({
 'nasi-telur-sayur':{id:'nasi-telur-sayur',name:'Nasi Telur Sayur',emoji:'🍛',ingredients:['beras','telur','bayam'],energy:10,nutrition:{carb:25,protein:20,vitamin:25},description:'Menu utama untuk quest Bu Sari.'},
 'sup-wortel-tomat':{id:'sup-wortel-tomat',name:'Sup Wortel Tomat',emoji:'🥣',ingredients:['wortel','tomat'],energy:6,nutrition:{carb:4,protein:2,vitamin:24},description:'Sup hangat dengan sayur berwarna-warni.'},
 'tumis-kangkung':{id:'tumis-kangkung',name:'Tumis Kangkung',emoji:'🥬',ingredients:['kangkung','telur'],energy:6,nutrition:{carb:3,protein:13,vitamin:18},description:'Kangkung dan telur untuk menu beragam.'},
 'nasi-sayur-warna':{id:'nasi-sayur-warna',name:'Nasi Sayur Pelangi',emoji:'🍚',ingredients:['beras','wortel','tomat','kangkung'],energy:8,nutrition:{carb:22,protein:4,vitamin:30},description:'Perpaduan nasi dan tiga warna sayuran.'}
});
export const RECIPE_IDS=Object.keys(RECIPES);
export function knownRecipe(state,id){return id==='nasi-telur-sayur'?!!state.recipeKnown:!!state.recipesKnown?.[id];}
export function missingFor(state,id){
 const r=RECIPES[id];if(!r)return [];
 return r.ingredients.filter(item=>(state.inventory?.[item]||0)<1);
}
export class CookingSystem{
 constructor(state){this.state=state;}
 get missing(){return missingFor(this.state.data,'nasi-telur-sayur');}
 finish(){return this.finishRecipe('nasi-telur-sayur');}
 finishRecipe(id){
  const s=this.state.data,r=RECIPES[id];
  if(!r||!knownRecipe(s,id)||missingFor(s,id).length)return false;
  if(id==='nasi-telur-sayur'&&s.cooked)return false;
  // Batasi sekali memasak ketika hidangan quest sudah menunggu penyerahan.
  for(const item of r.ingredients)s.inventory[item]--;
  s.energy=Math.max(0,s.energy-r.energy);
  for(const [key,amount] of Object.entries(r.nutrition))s[key]=Math.min(100,s[key]+amount);
  if(id==='nasi-telur-sayur')s.cooked=true;
  else s.lastDish=id;
  this.state.save();return true;
 }
 learn(id){
  if(!RECIPES[id])return false;
  const s=this.state.data;
  if(id==='nasi-telur-sayur')s.recipeKnown=true;
  else {s.recipesKnown??={};s.recipesKnown[id]=true;}
  this.state.save();return true;
 }
}
