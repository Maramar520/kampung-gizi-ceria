import {INGREDIENTS,STEPS,CookingSystem} from '../systems/CookingSystem.js';
import {QuestSystem} from '../systems/QuestSystem.js';
import {CookingMinigame} from '../systems/CookingMinigame.js';
import {PlayerNotebook} from '../ui/PlayerNotebook.js';
const $=id=>document.getElementById(id);
export class UIScene extends Phaser.Scene {
 constructor(){super('UIScene')}
 create(){this.state=this.game.state;this.cooking=new CookingSystem(this.state);this.minigame=new CookingMinigame(this);this.quest=new QuestSystem(this.state);this.world=this.scene.get('WorldScene');this.game.dialogOpen=false;this.notebook=new PlayerNotebook({state:this.state,onClose:()=>{this.game.dialogOpen=false;this.world.keysHeld.clear();}});this.refresh();this.game.events.on('action',this.action,this);this.game.events.on('close-dialog',this.close,this);$('action').onclick=()=>this.action();$('unstuck').onclick=()=>{this.close();this.world.keysHeld.clear();this.state.data.x=480;this.state.data.y=530;this.world.player.sprite.setPosition(480,530);this.refresh();this.note('Karakter kembali ke jalan. Progres tetap aman!');};$('close').onclick=()=>this.close();document.querySelectorAll('[data-open-notebook]').forEach(button=>button.addEventListener('click',()=>this.openNotebook(button.dataset.openNotebook)));
this.keyboardNotebookHandler=event=>{
 if(event.repeat||event.altKey||event.ctrlKey||event.metaKey)return;
 const target=event.target;
 if(target&&(target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName)))return;
 const key=event.key.toLowerCase();
 const tab={i:'inventory',r:'recipes',j:'journal'}[key];
 if(tab){event.preventDefault();this.openNotebook(tab);}
};
window.addEventListener('keydown',this.keyboardNotebookHandler);this.events.once('shutdown',()=>window.removeEventListener('keydown',this.keyboardNotebookHandler));$('reset').onclick=()=>{if(confirm('Reset semua progres game?')){this.state.reset();this.world.player.sprite.setPosition(480,530);this.world.keysHeld.clear();this.world.sari.sprite.setPosition(350,476);this.close();this.refresh();this.note('Progres direset!')}};document.querySelectorAll('[data-dir]').forEach(button=>{const dir=button.dataset.dir;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);this.world.keysHeld.add(dir)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,()=>this.world.keysHeld.delete(dir))});this.time.addEvent({delay:500,loop:true,callback:()=>this.refresh()})}
 refresh(){const s=this.state.data;for(const id of ['coins','energy','carb','protein','vitamin','day'])$(id).textContent=s[id];$('status').textContent=this.state.status;$('quest').textContent=this.quest.description;this.state.save();this.notebook?.refresh()}
 note(message){$('toast').textContent=message;this.time.delayedCall(3000,()=>{$('toast').textContent='WASD / panah untuk bergerak • E untuk interaksi'})}
 show(title,message,actions=[],extra=''){this.game.dialogOpen=true;$('dialogTitle').textContent=title;$('message').textContent=message;$('cookVisual').innerHTML=extra;$('choices').replaceChildren();for(const a of actions){const b=document.createElement('button');b.textContent=a.label;b.onclick=a.fn;$('choices').appendChild(b)}$('dialog').classList.remove('hidden')}
 openNotebook(tab){
  if(this.game.dialogOpen&&!this.notebook.visible)return;
  this.world.keysHeld.clear();
  this.game.dialogOpen=true;
  this.notebook.open(tab);
 }
 close(){if(this.notebook?.visible){this.notebook.close();return;}this.minigame.stop();this.game.dialogOpen=false;$('dialog').classList.add('hidden');if(this.cookTween){this.cookTween.stop();this.cookTween=null}}
 market(){this.show('🧺 Pasar Tradisional','Pilih bahan segar untuk Nasi Telur Sayur.',INGREDIENTS.map(([id,price])=>({label:`Beli ${id} — ${price} KC`,fn:()=>{const s=this.state.data;if(s.coins<price){this.note('Koin tidak cukup!');return}s.coins-=price;s.inventory[id]=(s.inventory[id]||0)+1;this.refresh();this.market();this.note('Berhasil membeli '+id)}})))}
 cookStep(step=0){
  if(step===STEPS.length){
   if(!this.cooking.finish())return this.show('Dapur','Bahan belum lengkap. Silakan mulai ulang proses memasak.');
   this.refresh();
   this.world.playInteraction('stove');
   return this.show('🎉 Hidangan selesai!','Nasi Telur Sayur berhasil dibuat! Karbo +25, Protein +20, Vitamin +25. Antarkan ke Bu Sari.',[{label:'Selesai',fn:()=>this.close()}],'<div class="cookstage" style="font-size:48px">🍚 🥚 🥬</div>');
  }
  const stage=STEPS[step];
  this.show('🍳 Memasak — tahap '+(step+1)+'/3','Selesaikan tantangan: '+stage.title+'.',[], '');
  this.minigame.mount(step,()=>{
   this.world.playInteraction('stove');
   this.note('Tahap '+(step+1)+' berhasil!');
   // Progres minigame hanya berlaku di sesi ini; bahan dipakai setelah semua tahap.
   this.cookStep(step+1);
  });
 }
 action(){if(this.game.dialogOpen)return;const id=this.world.getNearest();const s=this.state.data;if(id)this.world.playInteraction(id);if(!id)return this.note('Dekati tempat atau NPC lalu tekan E / AKSI.');if(id==='market')return this.market();if(id==='chef')return this.show('👨‍🍳 Chef Bimo','Halo! Menu beragam menggabungkan sumber karbohidrat, protein, dan sayur. Resep Nasi Telur Sayur gratis!',[{label:s.recipeKnown?'Resep sudah dipelajari':'📖 Pelajari resep',fn:()=>{s.recipeKnown=true;this.refresh();this.show('📖 Resep terbuka','1 beras + 1 telur + 1 bayam. Pulang dan gunakan kompor rumah!')}}]);if(id==='stove'){if(!s.recipeKnown)return this.show('🍳 Dapur','Belum punya resep. Temui Chef Bimo.');if(s.cooked)return this.show('🍳 Dapur','Masakan sudah siap. Bawa kepada Bu Sari.');if(this.cooking.missing.length)return this.show('🍳 Dapur','Bahan kurang: '+this.cooking.missing.join(', ')+'. Belanja dahulu.');return this.cookStep()}if(id==='npc'){if(s.done)return this.show('👩‍🌾 Bu Sari','Terima kasih! Kamu sudah membantu menyusun menu beragam.');if(!s.cooked)return this.show('👩‍🌾 Bu Sari','Tolong buatkan Nasi Telur Sayur. Beli beras, telur, bayam di pasar, belajar resep dari Chef Bimo, lalu masak di rumah.');if(this.quest.complete()){this.refresh();return this.show('🏆 Quest selesai!','Terima kasih! Kamu mendapatkan 50 Koin Ceria. Makan beragam membantu tubuh memperoleh berbagai zat gizi.')}}if(id==='bed')return this.show('🛏️ Kasur','Istirahat untuk memulihkan energi dan memulai hari baru.',[{label:'🌙 Tidur hingga pagi',fn:()=>{s.energy=100;s.day++;this.refresh();this.show('☀️ Selamat pagi!','Energi pulih dan hari baru dimulai. Progres quest tetap tersimpan.')}}])}
}
