export class QuestSystem {
 constructor(state){this.state=state}
 get description(){const s=this.state.data;return s.done?'🏆 Quest Bu Sari selesai! Hadiah +50 KC.':'🎯 Quest: Masak Nasi Telur Sayur untuk Bu Sari. Inventori: '+['beras','telur','bayam'].map(id=>`${id} ${s.inventory[id]||0}`).join(' • ')+(s.cooked?' • 🍽️ Masakan siap':'')}
 complete(){const s=this.state.data;if(s.done||!s.cooked)return false;s.done=true;s.cooked=false;s.coins+=50;this.state.save();return true}
}
