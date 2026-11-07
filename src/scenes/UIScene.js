import {CROPS,CROP_IDS} from '../systems/GardenSystem.js';
import {INGREDIENTS,STEPS,RECIPES,RECIPE_IDS,missingFor,knownRecipe,CookingSystem} from '../systems/CookingSystem.js';
import {QuestSystem} from '../systems/QuestSystem.js';
import {CookingMinigame} from '../systems/CookingMinigame.js';
import {PlayerNotebook} from '../ui/PlayerNotebook.js';
const $=id=>document.getElementById(id);
export class UIScene extends Phaser.Scene {
 constructor(){super('UIScene')}
 create(){this.state=this.game.state;this.cooking=new CookingSystem(this.state);this.minigame=new CookingMinigame(this);this.quest=new QuestSystem(this.state);this.world=this.scene.get('WorldScene');this.garden=this.world.garden;this.dailyLife=this.world.dailyLife;this.social=this.world.social;this.game.dialogOpen=false;this.notebook=new PlayerNotebook({state:this.state,onClose:()=>{this.game.dialogOpen=false;this.world.keysHeld.clear();}});this.refresh();this.game.events.on('action',this.action,this);this.game.events.on('close-dialog',this.close,this);$('action').onclick=()=>this.action();$('friendsButton').onclick=()=>this.socialOverview();document.querySelectorAll('[data-find-place]').forEach(button=>{
 button.addEventListener('click',()=>{
  this.world.highlightPlace(button.dataset.findPlace);
  this.note(button.dataset.findPlace==='coop'?'🐔 Kandang ayam berada di sebelah kebun, dekat rumah pemain.':'🎣 Kolam ikan berada di blok kanan atas peta.');
 });
});$('unstuck').onclick=()=>{this.close();this.world.keysHeld.clear();this.state.data.x=446;this.state.data.y=291;this.world.player.sprite.setPosition(446,291);this.refresh();this.note('Karakter kembali ke jalan. Progres tetap aman!');};$('close').onclick=()=>this.close();document.querySelectorAll('[data-open-notebook]').forEach(button=>button.addEventListener('click',()=>this.openNotebook(button.dataset.openNotebook)));
this.keyboardNotebookHandler=event=>{
 if(event.repeat||event.altKey||event.ctrlKey||event.metaKey)return;
 const target=event.target;
 if(target&&(target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName)))return;
 const key=event.key.toLowerCase();
 if(key==='f'){event.preventDefault();this.socialOverview();return;}
 const tab={i:'inventory',r:'recipes',j:'journal'}[key];
 if(tab){event.preventDefault();this.openNotebook(tab);}
};
window.addEventListener('keydown',this.keyboardNotebookHandler);this.events.once('shutdown',()=>window.removeEventListener('keydown',this.keyboardNotebookHandler));$('reset').onclick=()=>{if(confirm('Reset semua progres game?')){this.state.reset();this.world.player.sprite.setPosition(446,291);this.world.keysHeld.clear();this.world.sari.sprite.setPosition(448,281);this.close();this.refresh();this.note('Progres direset!')}};document.querySelectorAll('[data-dir]').forEach(button=>{const dir=button.dataset.dir;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);this.world.keysHeld.add(dir)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,()=>this.world.keysHeld.delete(dir))});this.time.addEvent({delay:500,loop:true,callback:()=>this.refresh()})}
 refresh(){const s=this.state.data;for(const id of ['coins','energy','carb','protein','vitamin','day'])$(id).textContent=s[id];$('status').textContent=this.state.status;$('phase').textContent=this.world?.dailyPhase||'Pagi';$('quest').textContent=this.quest.description;this.state.save();this.notebook?.refresh();this.world?.gardenArt?.render();this.updateInteractionHint()}
 updateInteractionHint(){
  const element=$('interactionHelp');if(!element||!this.world)return;
  const id=this.world.getNearest();
  const zone=this.world.zones.find(z=>z.id===id);
  const label=zone?.label;
  element.classList.toggle('near',!!id&&!this.game.dialogOpen);
  element.textContent=id&&!this.game.dialogOpen
    ?'✨ Dekat '+label+' — tekan E atau tombol AKSI untuk berinteraksi!'
    :'🧭 Jelajahi kampung dengan WASD / panah atau tombol arah, lalu dekati lokasi dan tekan AKSI.';
 }
 note(message){const toast=$('toast');toast.textContent=message;toast.classList.add('visible');if(this.toastTimeout)this.toastTimeout.remove(false);this.toastTimeout=this.time.delayedCall(2700,()=>{toast.classList.remove('visible');this.toastTimeout=null;});}
 show(title,message,actions=[],extra=''){this.world.keysHeld.clear();this.game.dialogOpen=true;$('dialogTitle').textContent=title;$('message').textContent=message;$('cookVisual').innerHTML=extra;$('choices').replaceChildren();for(const a of actions){const b=document.createElement('button');b.textContent=a.label;b.onclick=a.fn;$('choices').appendChild(b)}$('dialog').classList.remove('hidden')}
 openNotebook(tab){
  if(this.game.dialogOpen&&!this.notebook.visible)return;
  this.world.keysHeld.clear();
  this.game.dialogOpen=true;
  this.notebook.open(tab);
 }
 close(){if(this.notebook?.visible){this.notebook.close();return;}this.minigame.stop();this.game.dialogOpen=false;$('dialog').classList.add('hidden');if(this.cookTween){this.cookTween.stop();this.cookTween=null}}
 market(){
  const items=[
   ...Object.entries({beras:12,telur:15,bayam:10,wortel:14,tomat:15,kangkung:12}).map(([id,price])=>({
    label:'Beli '+id+' — '+price+' KC',fn:()=>{
     const s=this.state.data;if(s.coins<price){this.note('Koin tidak cukup!');return;}
     s.coins-=price;s.inventory[id]=(s.inventory[id]||0)+1;this.refresh();this.market();
     this.note('Berhasil membeli '+id);
    }})),
   ...CROP_IDS.map(id=>({label:CROPS[id].emoji+' Bibit '+CROPS[id].name+' — '+CROPS[id].price+' KC',fn:()=>{
    if(!this.garden.buySeeds(1,id)){this.note('Koin tidak cukup.');return;}
    this.refresh();this.market();this.note('Bibit '+CROPS[id].name+' ditambahkan!');
   }}))
  ];
  this.show('🧺 Pasar Tradisional','Beli bahan masakan atau bibit. Sayuran juga dapat ditanam di kebun!',items);
 }
 storeMenu(){
  const products=[['beras',14,'🍚'],['telur',17,'🥚'],['bayam',12,'🥬'],['tomat',17,'🍅']];
  const items=products.map(([id,price,icon])=>({label:icon+' '+id+' · '+price+' KC',fn:()=>{
   if(this.state.data.coins<price){this.note('Koin tidak cukup.');return;}
   this.state.data.coins-=price;
   this.state.data.inventory[id]=(this.state.data.inventory[id]||0)+1;
   this.refresh();this.storeMenu();this.note('Berhasil belanja di swalayan!');
  }}));
  this.show('🏪 Toko Swalayan','Toko modern menyediakan bahan kebutuhan. Harga berbeda dengan pasar tradisional.',items);
 }
 friendsLine(id){
  const p=this.social.greet(id,this.world.phaseIndex??0);
  if(!p)return '';
  return p.dialogue+'\n'+p.heartsDisplay+(p.gained?' · +1 hati hari ini!':' · Sudah menyapa hari ini.');
 }
 friendMenu(id){
  const p=this.social.profile(id);
  if(!p)return;
  const greeting=this.friendsLine(id);
  const tip=id==='tani'?'Tips: siram tanaman lalu tidur agar tumbuh.':
   'Tips: cek buku resep dan coba beragam sayur setiap hari.';
  this.show(p.emoji+' '+p.name,greeting+'\n'+tip,[
   {label:'🤝 Lihat daftar teman',fn:()=>this.socialOverview()},
   {label:'Sampai jumpa!',fn:()=>this.close()}
  ]);
  this.refresh();
 }
 socialOverview(){
  if(this.game.dialogOpen&&!(!$('dialog').classList.contains('hidden')))return;
  const cards=this.social.all().map(p=>'<div class="social-friend"><div><strong>'+
   p.emoji+' '+p.name+'</strong><small>'+p.place+'</small></div>'+
   '<span class="social-hearts" aria-label="'+p.hearts+' dari 5 hati">'+p.heartsDisplay+'</span></div>').join('');
  this.show('🤝 Buku Pertemanan','Sapa tiap warga maksimal sekali per hari untuk menambah satu hati. Tidur untuk memulai hari baru.',[
   {label:'Tutup buku teman',fn:()=>this.close()}
  ],'<div class="social-overview">'+cards+'</div><p class="social-notice">❤️ Maksimal 5 hati per teman. Tidak memerlukan koin atau data pribadi.</p>');
 }
 villageMenu(){
  this.show('🏘️ Rumah Warga','Selamat datang! Ini rumah tetangga yang bagian dalamnya bisa dilihat tanpa berpindah scene. Bu Sari dapat ditemui di jalan kampung.',[
   {label:'Kembali berjalan',fn:()=>this.close()}
  ]);
 }
 gardenMenu(){
  const view=this.garden.view;
  const names={empty:'Kosong',dry:'Belum disiram',growing:'Sedang tumbuh',ready:'Siap panen'};
  const icons=view.plots.map(p=>'<div class="garden-plot '+p.stage+'"><span>'+p.emoji+'</span><b>Petak '+(p.index+1)+'</b><small>'+(p.name||'Tanah kosong')+'</small><small>'+names[p.stage]+(p.daysLeft?' · '+p.daysLeft+' hari':'')+'</small></div>').join('');
  const actions=[];
  for(const p of view.plots){
   if(p.stage==='empty'){
    for(const id of CROP_IDS)if(view.seedsByCrop[id]>0){
     actions.push({label:CROPS[id].emoji+' Tanam '+CROPS[id].name+' · Petak '+(p.index+1),fn:()=>{
      if(!this.garden.plant(p.index,id)){this.note('Bibit tidak tersedia.');return;}
      this.world.playInteraction('plant');this.refresh();this.gardenMenu();
     }});
    }
   }else if(p.stage==='dry'){
    actions.push({label:'💧 Siram '+p.name+' · Petak '+(p.index+1),fn:()=>{
     if(this.garden.water(p.index)){this.world.playInteraction('water');this.refresh();this.gardenMenu();}
    }});
   }else if(p.stage==='ready'){
    actions.push({label:p.emoji+' Panen '+p.name+' · Petak '+(p.index+1),fn:()=>{
     if(this.garden.harvest(p.index)){
      this.world.playInteraction('harvest');this.refresh();this.gardenMenu();
      this.note('Panen '+p.name+': +2 hasil, +1 bibit!');
     }
    }});
   }
  }
  if(!actions.length)actions.push({label:'🌙 Tunggu sampai panen',fn:()=>{this.close();this.note('Gunakan kasur untuk memulai hari berikutnya.');}});
  const seeds=CROP_IDS.map(id=>CROPS[id].emoji+' '+CROPS[id].name+': '+view.seedsByCrop[id]).join(' · ');
  this.show('🌿 Kebun Sayur','Hari '+this.state.data.day+' · '+seeds+'.\nTanam, siram, tidur di rumah, lalu panen! Wortel dan tomat perlu 2 hari.',actions,'<div class="garden-preview">'+icons+'</div>');
 }
 coopMenu(){
  const status=this.dailyLife.status;
  const actions=[];
  if(!status.fedToday&&!status.eggsCollected)actions.push({label:'🌾 Beri pakan ayam — 3 KC',fn:()=>{
   if(!this.dailyLife.feed()){this.note('Tidak cukup koin atau sudah diberi pakan.');return;}
   this.world.playInteraction('coop');this.refresh();this.coopMenu();
  }});
  if(status.eggsReady)actions.push({label:'🥚 Kumpulkan 2 telur',fn:()=>{
   if(!this.dailyLife.collectEggs())return;
   this.world.playInteraction('coop');this.refresh();this.coopMenu();this.note('Berhasil! +2 telur masuk tas.');
  }});
  if(!actions.length)actions.push({label:'🌙 Cek lagi besok',fn:()=>{this.close();this.note('Tidur di rumah agar ayam siap menghasilkan telur lagi.');}});
  const msg=status.eggsCollected?'Telur hari ini sudah diambil.':
   status.eggsReady?'Ayam selesai diberi makan. Dua telur siap dikumpulkan!':
   'Ayam perlu diberi makan 3 KC sebelum menghasilkan telur hari ini.';
  this.show('🐔 Kandang Ayam','Hari '+status.day+' · '+msg+' Telur dapat digunakan untuk memasak.',actions,
   '<div class="farm-preview">🐔 🐔 🥚</div>');
 }
 pondMenu(){
  const status=this.dailyLife.status;
  if(!status.fishReady)return this.show('🎣 Kolam Ikan','Kamu sudah mendapatkan ikan hari ini. Datang lagi setelah tidur di rumah.',[{label:'Tutup',fn:()=>this.close()}],'<div class="farm-preview">🌊 🐟 🌊</div>');
  const actions=[{label:'🎣 Lempar kail ('+status.casts+'/3)',fn:()=>{
   const result=this.dailyLife.cast();
   this.world.playInteraction('fish');this.refresh();
   if(result.success){
    this.show('🐟 Ikan tertangkap!','Selamat! +1 ikan masuk ke tas. Kolam bisa dipancing lagi besok.',[{label:'Selesai',fn:()=>this.close()}],'<div class="farm-preview">🎣 🐟 ✨</div>');
   }else this.pondMenu();
  }}];
  this.show('🎣 Kolam Ikan','Tekan Lempar Kail 3 kali untuk mendapatkan seekor ikan. Maksimal satu ikan per hari.',actions,
   '<div class="farm-preview">🌊 🐟 🌿</div>');
 }
 chooseRecipe(){
  const s=this.state.data;
  const actions=RECIPE_IDS.map(id=>{
   const r=RECIPES[id],known=knownRecipe(s,id),missing=missingFor(s,id);
   return {label:r.emoji+' '+r.name+(known?(missing.length?' · kurang bahan':' · siap'):' · terkunci'),fn:()=>{
    if(!known)return this.show('🔒 Resep terkunci','Pelajari resep ini dari Chef Bimo.');
    if(id==='nasi-telur-sayur'&&s.cooked)return this.show('🍛 Masakan Quest','Hidangan untuk Bu Sari sudah siap. Antarkan dulu.');
    if(missing.length)return this.show('🧺 Bahan belum lengkap','Masih butuh: '+missing.join(', ')+'. Cari di pasar atau kebun.');
    this.activeRecipe=id;this.cookStep(0);
   }};
  });
  this.show('🍳 Pilih Menu Masakan','Pilih resep yang sudah kamu pelajari. Hidangan baru memberi poin gizi di dalam game.',actions);
 }
 chefMenu(){
  const greeting=this.friendsLine('chef');
  const actions=RECIPE_IDS.map(id=>({
   label:'📖 Pelajari '+RECIPES[id].name+(knownRecipe(this.state.data,id)?' ✓':''),
   fn:()=>{this.cooking.learn(id);this.refresh();this.chefMenu();this.note('Resep '+RECIPES[id].name+' dipelajari!');}
  }));
  this.show('👨‍🍳 Chef Bimo',greeting+'\nAyo belajar menu dari hasil kebun! Pilih resep untuk dipelajari.',actions);
 }
 cookStep(step=0){
  const id=this.activeRecipe||'nasi-telur-sayur',recipe=RECIPES[id];
  if(step===3){
   if(!this.cooking.finishRecipe(id))return this.show('Dapur','Resep atau bahan belum lengkap.');
   this.refresh();this.world.playInteraction('cook');
   return this.show('🎉 Masakan berhasil!',recipe.emoji+' '+recipe.name+' selesai! '+(id==='nasi-telur-sayur'?'Antarkan ke Bu Sari.':'Poin gizi bertambah!'),[{label:'Selesai',fn:()=>this.close()}],'<div class="cookstage" style="font-size:48px">'+recipe.emoji+'</div>');
  }
  const title=['Cuci bahan','Masak di dapur','Selesaikan masakan'][step];
  this.show('🍳 '+recipe.name+' · '+(step+1)+'/3',title+' · Selesaikan tantangan memasak.',[],'');
  this.minigame.mount(step,()=>{
   this.world.playInteraction('cook');this.note('Tahap '+(step+1)+' berhasil!');
   this.cookStep(step+1);
  },recipe);
 }
 action(){
  if(this.game.dialogOpen)return;
  const id=this.world.getNearest(),s=this.state.data;
  if(id)this.world.playInteraction(id);
  if(!id)return this.note('Dekati tempat atau NPC lalu tekan E / AKSI.');
  if(id==='market')return this.market();
  if(id==='store')return this.storeMenu();
  if(id==='village')return this.villageMenu();
  if(id==='garden')return this.gardenMenu();
  if(id==='coop')return this.coopMenu();
  if(id==='pond')return this.pondMenu();
  if(id==='tani'||id==='nia')return this.friendMenu(id);
  if(id==='chef')return this.chefMenu();
  if(id==='stove')return this.chooseRecipe();
  if(id==='npc'){
   const greeting=this.friendsLine('sari');
   if(s.done)return this.show('👩‍🌾 Bu Sari',greeting+'\nTerima kasih! Kamu boleh terus berkebun dan mencoba resep lain.');
   if(!s.cooked)return this.show('👩‍🌾 Bu Sari',greeting+'\nTolong buatkan Nasi Telur Sayur. Bahan bisa dibeli atau dipanen dari kebun.');
   if(this.quest.complete()){this.refresh();return this.show('🏆 Quest selesai!',greeting+'\nTerima kasih! Hadiah 50 Koin Ceria telah diterima.');}
  }
  if(id==='bed')return this.show('🛏️ Kasur','Tidur untuk mengisi energi dan memajukan pertumbuhan tanaman.',[{label:'🌙 Tidur hingga pagi',fn:()=>{
   this.world.playInteraction('sleep');s.energy=100;s.day++;this.refresh();
   this.show('☀️ Selamat pagi!','Hari '+s.day+' dimulai. Periksa kebunmu untuk melihat sayuran yang siap dipanen!');
  }}]);
 }
}
