// UI v0.7, tetap menggunakan GameState, CookingSystem dan QuestSystem yang ada.
// Tidak menambah key LocalStorage baru; hanya membaca state dan menampilkannya.
export const ITEM_INFO=Object.freeze({
  beras:{name:'Beras',emoji:'🍚',type:'Karbohidrat',source:'Pasar',price:12},
  telur:{name:'Telur',emoji:'🥚',type:'Protein',source:'Pasar',price:15},
  bayam:{name:'Bayam',emoji:'🥬',type:'Sayuran',source:'Pasar atau Kebun',price:10},
  wortel:{name:'Wortel',emoji:'🥕',type:'Sayuran',source:'Pasar atau Kebun',price:14},
  tomat:{name:'Tomat',emoji:'🍅',type:'Sayuran',source:'Pasar atau Kebun',price:15},
  kangkung:{name:'Kangkung',emoji:'🥬',type:'Sayuran',source:'Pasar atau Kebun',price:12},
  ikan:{name:'Ikan',emoji:'🐟',type:'Protein',source:'Kolam Ikan',price:0}
});
export const RECIPE={id:'nasi-telur-sayur',name:'Nasi Telur Sayur',emoji:'🍛',
  ingredients:['beras','telur','bayam'],teacher:'Chef Bimo di restoran',
  benefits:'Dalam game: karbo +25, protein +20, vitamin +25.',
  steps:['Cuci bayam 5 kali','Tahan tombol untuk memasak nasi','Balik telur 2 kali pada zona hijau']
};
export const EXTRA_RECIPES=[
 {id:'sup-wortel-tomat',name:'Sup Wortel Tomat',emoji:'🥣',ingredients:['wortel','tomat']},
 {id:'tumis-kangkung',name:'Tumis Kangkung',emoji:'🥬',ingredients:['kangkung','telur']},
 {id:'nasi-sayur-warna',name:'Nasi Sayur Pelangi',emoji:'🍚',ingredients:['beras','wortel','tomat','kangkung']},
 {id:'ikan-tomat',name:'Ikan Panggang Tomat',emoji:'🐟',ingredients:['ikan','tomat']}
];
export function recipeCatalog(data){
 const base=recipeView(data);
 return [base,...EXTRA_RECIPES.map(r=>{
  const ingredients=r.ingredients.map(id=>({id,...ITEM_INFO[id],quantity:Math.max(0,Number(data.inventory?.[id])||0),need:1,enough:(data.inventory?.[id]||0)>=1}));
  const known=!!data.recipesKnown?.[r.id];
  return {...r,known,ready:ingredients.every(i=>i.enough),ingredients,canCook:known&&ingredients.every(i=>i.enough),steps:RECIPE.steps};
 })];
}
export function inventoryView(data){
  return Object.entries(ITEM_INFO).map(([id,info])=>({
    id,...info,quantity:Math.max(0,Number(data.inventory?.[id])||0)
  }));
}
export function recipeView(data){
  const ingredients=inventoryView(data).filter(item=>RECIPE.ingredients.includes(item.id));
  const ready=ingredients.every(i=>i.quantity>=1);
  return { ...RECIPE,known:!!data.recipeKnown,ready,cooked:!!data.cooked,
    ingredients:ingredients.map(i=>({...i,need:1,enough:i.quantity>=1})),
    canCook:!!data.recipeKnown&&ready&&!data.cooked};
}
export function questView(data){
  const inv=inventoryView(data).filter(item=>RECIPE.ingredients.includes(item.id));
  const all=inv.every(i=>i.quantity>=1);
  const done=!!data.done;
  return {
    title:'Bantuan Bu Sari',
    steps:[
      {id:'learn',label:'Pelajari resep dari Chef Bimo',done:!!data.recipeKnown||done,hint:'Temui Chef Bimo di restoran bagian tengah bawah.'},
      {id:'shop',label:'Kumpulkan beras, telur, dan bayam',done:all||!!data.cooked||done,hint:'Beli bahan di pasar atau tanam bayam di kebun kiri atas.'},
      {id:'cook',label:'Masak Nasi Telur Sayur',done:!!data.cooked||done,hint:'Pergi ke kompor di dalam rumah.'},
      {id:'deliver',label:'Antarkan masakan kepada Bu Sari',done,hint:'Temui Bu Sari di jalan kampung.'}
    ],
    completed:done,
    coinsReward:50
  };
}

const el=(tag,className,text)=>{
 const node=document.createElement(tag);
 if(className)node.className=className;
 if(text!==undefined)node.textContent=text;
 return node;
};
export class PlayerNotebook {
 constructor({state,onClose}) {
  this.state=state;
  this.onClose=onClose;
  this.root=document.getElementById('notebook');
  this.content=document.getElementById('notebookContent');
  this.heading=document.getElementById('notebookTitle');
  this.tabs=[...document.querySelectorAll('[data-tab]')];
  this.active='inventory';
  this.visible=false;
  this.lastSignature=null;
  this.tabs.forEach(button=>button.addEventListener('click',()=>this.open(button.dataset.tab)));
  document.getElementById('notebookClose').addEventListener('click',()=>this.close());
  this.root.addEventListener('click',event=>{if(event.target===this.root)this.close()});
 }
 open(tab='inventory'){
  if(!['inventory','recipes','journal'].includes(tab))tab='inventory';
  this.active=tab;
  this.lastSignature=null;
  this.visible=true;
  this.root.classList.remove('hidden');
  this.root.setAttribute('aria-hidden','false');
  this.render();
  const active=this.tabs.find(t=>t.dataset.tab===tab);
  if(active)active.focus({preventScroll:true});
 }
 close(){
  if(!this.visible)return;
  this.visible=false;
  this.root.classList.add('hidden');
  this.root.setAttribute('aria-hidden','true');
  this.onClose?.();
 }
 refresh(){
  if(!this.visible)return;
  const signature=JSON.stringify({tab:this.active,inventory:this.state.data.inventory,coins:this.state.data.coins,garden:this.state.data.garden,activities:this.state.data.activities,recipeKnown:this.state.data.recipeKnown,recipesKnown:this.state.data.recipesKnown,cooked:this.state.data.cooked,done:this.state.data.done});
  if(signature!==this.lastSignature)this.render();
 }
 render(){
  const data=this.state.data;
  this.lastSignature=JSON.stringify({tab:this.active,inventory:data.inventory,coins:data.coins,garden:data.garden,activities:data.activities,recipeKnown:data.recipeKnown,recipesKnown:data.recipesKnown,cooked:data.cooked,done:data.done});
  const names={inventory:'🎒 Tas Bahan',recipes:'📖 Buku Resep',journal:'📋 Jurnal Quest'};
  this.heading.textContent=names[this.active];
  this.tabs.forEach(b=>{
   const selected=b.dataset.tab===this.active;
   b.classList.toggle('selected',selected);
   b.setAttribute('aria-selected',String(selected));
  });
  this.content.replaceChildren();
  if(this.active==='inventory')this.renderInventory(data);
  else if(this.active==='recipes')this.renderRecipe(data);
  else this.renderQuest(data);
 }
 renderInventory(data){
  const intro=el('p','notebook-note','Koleksi bahan makananmu. Beli bahan di pasar, lalu gunakan untuk memasak.');
  this.content.appendChild(intro);
  const grid=el('div','inventory-grid');
  for(const item of inventoryView(data)){
   const card=el('article','item-card'+(item.quantity?' owned':' empty'));
   card.append(el('div','item-emoji',item.emoji));
   card.append(el('strong','',item.name));
   card.append(el('span','item-count',item.quantity+' buah'));
   card.append(el('small','',item.type+' · '+item.price+' KC'));
   grid.append(card);
  }
  const crops=[['bayam','🥬',5],['wortel','🥕',7],['tomat','🍅',8],['kangkung','🥬',6]];
  for(const [id,emoji,price] of crops){
   const seedCard=el('article','item-card owned');
   seedCard.append(el('div','item-emoji','🌱'));
   seedCard.append(el('strong','','Bibit '+ITEM_INFO[id].name));
   const count=data.garden?.seedsByCrop?.[id]??(id==='bayam'?(data.garden?.seeds??3):1);
   seedCard.append(el('span','item-count',count+' bibit'));
   seedCard.append(el('small','',emoji+' Tanam di kebun · '+price+' KC'));
   grid.append(seedCard);
  }
  this.content.append(grid);
  const plots=Array.isArray(data.garden?.plots)?data.garden.plots:[];
  const growing=plots.filter(p=>p?.crop).length;
  this.content.append(el('p','notebook-note','🌿 Kebun: '+growing+' dari 3 petak terisi. Siram dan tidur untuk memanen.'));
  this.content.append(el('p','notebook-note','🐔 Telur dapat dikumpulkan dari kandang ayam setelah memberi pakan. 🐟 Ikan diperoleh dengan memancing di kolam.'));

  this.content.append(el('p','notebook-tip','🪙 Koin Ceria: '+data.coins+' · 🧺 Bahan dan bibit ada di pasar.'));
 }
 renderRecipe(data){
  this.content.append(el('p','notebook-note','Pilih menu yang ingin dipelajari dari Chef Bimo. Hasil kebun bisa menjadi bahan masakan.'));
  for(const recipe of recipeCatalog(data)){
   const cover=el('div','recipe-cover');
   cover.append(el('span','recipe-emoji',recipe.emoji));
   const details=el('div','recipe-info');
   details.append(el('h3','',recipe.name));
   details.append(el('p','recipe-status',recipe.known?(recipe.canCook?'✅ Siap dimasak':'✅ Resep dipelajari'):'🔒 Belum dipelajari'));
   cover.append(details);this.content.append(cover);
   if(!recipe.known){
    this.content.append(el('p','notebook-note','👨‍🍳 Temui Chef Bimo untuk membuka resep ini.'));
    continue;
   }
   const grid=el('div','ingredient-grid');
   for(const item of recipe.ingredients){
    const card=el('div','ingredient'+(item.enough?' enough':' missing'));
    card.append(el('span','',item.emoji+' '+item.name));
    card.append(el('b','',item.quantity+' / '+item.need+(item.enough?' ✓':' !')));
    grid.append(card);
   }
   this.content.append(grid);
   this.content.append(el('p','notebook-note',recipe.canCook?'🍳 Semua bahan lengkap. Masak di kompor rumah.':'🧺 Kumpulkan bahan dari pasar atau kebun.'));
  }
  this.content.append(el('p','notebook-tip','Nilai karbohidrat, protein dan vitamin adalah poin dalam permainan.'));
 }
 renderQuest(data){
  const quest=questView(data);
  this.content.append(el('p','notebook-note',quest.completed?'🏆 Misi sudah selesai!':'Ikuti petunjuk ini satu per satu. Tidak perlu terburu-buru!'));
  const list=el('ol','quest-steps');
  const firstPending=quest.steps.find(x=>!x.done)?.id;
  for(const step of quest.steps){
   const li=el('li','quest-step'+(step.done?' done':step.id===firstPending?' current':''));
   li.append(el('span','step-mark',step.done?'✓':step.id===firstPending?'➜':'○'));
   const copy=el('div','quest-copy');
   copy.append(el('strong','',step.label));
   if(!step.done)copy.append(el('small','',step.hint));
   li.append(copy);list.append(li);
  }
  this.content.append(list);
  this.content.append(el('p','notebook-tip',quest.completed?'🏆 Hadiah 50 Koin Ceria telah diterima.':'🎁 Hadiah misi: '+quest.coinsReward+' Koin Ceria'));
 }
}
