export class QuestSystem {
 constructor(state){this.state=state}
 get description(){
  const s=this.state.data;
  const items=['beras','telur','bayam'].map(id=>id+': '+(s.inventory[id]||0)).join(' · ');
  if(s.done)return '🏆 Quest selesai! Bu Sari sudah menerima hidangan. Hadiah +50 Koin Ceria.';
  if(s.cooked)return '🍽️ Nasi Telur Sayur siap! Cari Bu Sari di jalan kampung dan tekan E untuk menyerahkan.';
  if(!s.recipeKnown)return '📖 Tujuan: Temui Chef Bimo di restoran kanan untuk belajar resep. Bahan: '+items;
  const missing=['beras','telur','bayam'].filter(id=>(s.inventory[id]||0)<1);
  if(missing.length)return '🧺 Tujuan: Beli '+missing.join(', ')+' di pasar kiri. Bahan: '+items;
  return '🍳 Tujuan: Semua bahan lengkap! Masuk rumah melalui pintu tengah, dekati kompor, tekan E dan masak.';
 }
 complete(){const s=this.state.data;if(s.done||!s.cooked)return false;s.done=true;s.cooked=false;s.coins+=50;this.state.save();return true}
}
