// v1.21 — Buku Ekspedisi Pantai: pencapaian sekali klaim, kompatibel dengan save lama.
export const COAST_BADGES=Object.freeze([
 {id:'shell',title:'🐚 Penjelajah Kerang',description:'Kumpulkan 3 kerang di pantai',target:3,reward:15},
 {id:'clean',title:'🧹 Sahabat Pantai',description:'Bersihkan pantai pada 3 hari berbeda',target:3,reward:20},
 {id:'fish',title:'🐟 Ahli Ikan Laut',description:'Temukan 2 jenis ikan laut berbeda',target:2,reward:25},
 {id:'island',title:'🏝️ Penjelajah Pulau',description:'Berkunjung ke Pulau Kecil 3 kali',target:3,reward:20}
]);
export class CoastExpeditionSystem{
 constructor(state,coast){
  this.state=state;this.coast=coast;
  const raw=state.data.coastExpedition;
  state.data.coastExpedition={claimed:Array.isArray(raw?.claimed)?[...new Set(raw.claimed.filter(id=>COAST_BADGES.some(b=>b.id===id)))]:[]};
 }
 progress(id){
  const c=this.coast.data;
  switch(id){
   case 'shell':return c.shellsCollected||0;
   case 'clean':return c.beachCleanups||0;
   case 'fish':return new Set(c.catches||[]).size;
   case 'island':return c.islandVisits||0;
   default:return 0;
  }
 }
 get badges(){return COAST_BADGES.map(b=>({...b,progress:Math.min(b.target,this.progress(b.id)),claimed:this.state.data.coastExpedition.claimed.includes(b.id)}));}
 claim(id){
  const badge=COAST_BADGES.find(b=>b.id===id);
  if(!badge||this.state.data.coastExpedition.claimed.includes(id)||this.progress(id)<badge.target)return false;
  this.state.data.coastExpedition.claimed.push(id);
  this.state.data.coins+=badge.reward;
  this.state.save();
  return true;
 }
}
