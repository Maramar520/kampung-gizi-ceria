// v1.9 — furniture in fixed safe decorative spots in the existing player home.
// Slots are cosmetic only: they never modify world collision geometry.
export const DECOR_ITEMS=Object.freeze({
 carpet:{name:'Karpet bunga',emoji:'🌼',price:18,color:0xe1b0a5},
 plant:{name:'Tanaman hias',emoji:'🪴',price:12,color:0x78ae83},
 lamp:{name:'Lampu belajar',emoji:'💡',price:22,color:0xf0d38e},
 books:{name:'Rak buku kecil',emoji:'📚',price:26,color:0x9b83b5},
 cushion:{name:'Bantal lucu',emoji:'🛋️',price:15,color:0xb3c8db}
});
export const DECOR_SLOTS=Object.freeze([
 {id:'corner',name:'Sudut kiri',x:125,y:116},
 {id:'window',name:'Dekat jendela',x:154,y:91},
 {id:'desk',name:'Sudut belajar',x:141,y:151}
]);
export function defaultDecor(){return {owned:[],slots:{corner:null,window:null,desk:null}};}
export function normalizeDecor(raw){
 const result=defaultDecor();
 if(!raw||typeof raw!=='object')return result;
 result.owned=Array.isArray(raw.owned)?[...new Set(raw.owned.filter(id=>Object.hasOwn(DECOR_ITEMS,id)))]:[];
 for(const slot of DECOR_SLOTS){
  const id=raw.slots?.[slot.id];
  result.slots[slot.id]=result.owned.includes(id)?id:null;
 }
 // No duplicate piece can be placed in two slots at once.
 const used=new Set();
 for(const slot of DECOR_SLOTS){
  const id=result.slots[slot.id];
  if(id&&used.has(id))result.slots[slot.id]=null;
  if(id)used.add(id);
 }
 return result;
}
export class HomeDecorSystem{
 constructor(state){this.state=state;state.data.decor=normalizeDecor(state.data.decor);}
 get data(){return this.state.data.decor;}
 buy(id){
  const item=DECOR_ITEMS[id],s=this.state.data;
  if(!item||this.data.owned.includes(id)||s.coins<item.price)return false;
  s.coins-=item.price;
  this.data.owned.push(id);
  this.state.save();return true;
 }
 place(slotId,id){
  const slot=DECOR_SLOTS.find(s=>s.id===slotId),data=this.data;
  if(!slot||(id!==null&&!data.owned.includes(id)))return false;
  for(const [key,value] of Object.entries(data.slots))if(key!==slotId&&value===id&&id!==null)return false;
  data.slots[slotId]=id;
  this.state.save();return true;
 }
 view(){return DECOR_SLOTS.map(slot=>({...slot,item:this.data.slots[slot.id],
  label:this.data.slots[slot.id]?DECOR_ITEMS[this.data.slots[slot.id]].name:'Kosong'}));}
}
