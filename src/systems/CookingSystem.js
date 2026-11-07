export const INGREDIENTS=[['beras',12],['telur',15],['bayam',10]];
export const STEPS=[{title:'Cuci bayam',desc:'Bersihkan bayam sebelum dimasak.',emoji:'🥬',button:'Cuci bayam'},{title:'Masak nasi',desc:'Masak beras menjadi nasi. Memasak sungguhan harus didampingi orang dewasa.',emoji:'🍚',button:'Masak nasi'},{title:'Olah telur',desc:'Telur matang siap disajikan bersama nasi dan bayam.',emoji:'🍳',button:'Olah telur'}];
export class CookingSystem {
 constructor(state){this.state=state}
 get missing(){return INGREDIENTS.filter(([id])=>(this.state.data.inventory[id]||0)<1).map(([id])=>id)}
 finish(){const s=this.state.data;if(!s.recipeKnown||s.cooked||this.missing.length)return false;for(const [id] of INGREDIENTS)s.inventory[id]--;s.cooked=true;s.energy=Math.max(0,s.energy-10);s.carb=Math.min(100,s.carb+25);s.protein=Math.min(100,s.protein+20);s.vitamin=Math.min(100,s.vitamin+25);this.state.save();return true}
}
