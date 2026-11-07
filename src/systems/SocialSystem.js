// v1.5: persahabatan sederhana. Tidak membuat save key baru dan tidak memengaruhi quest utama.
export const FRIEND_IDS=Object.freeze(['sari','chef','tani','nia']);
export const FRIENDS=Object.freeze({
 sari:{name:'Bu Sari',emoji:'👩',place:'Jalan kampung dan rumah warga'},
 chef:{name:'Chef Bimo',emoji:'👨‍🍳',place:'Restoran sehat'},
 tani:{name:'Pak Tani',emoji:'👨‍🌾',place:'Kebun dan kandang ayam'},
 nia:{name:'Nia',emoji:'👧',place:'Dekat pasar dan rumah warga'}
});
export const MAX_HEARTS=5;
export const DIALOGUES=Object.freeze({
 sari:[
  ['Selamat pagi! Sarapan bergizi membantu kita beraktivitas.','Siang ini kamu sudah makan sayur?','Sore yang nyaman untuk membantu tetangga!'],
  ['Pagi yang cerah! Ingat minum air putih.','Terima kasih sudah menjaga kampung tetap ceria.','Istirahat yang cukup supaya besok kembali bersemangat.']
 ],
 chef:[
  ['Selamat pagi! Hari ini kita belajar mengenal bahan makanan.','Coba lihat resep yang sudah kamu buka di buku.','Sore hari cocok untuk merencanakan menu besok.'],
  ['Pagi ini ada sayur segar dari kebun!','Protein bisa kita peroleh dari telur atau ikan.','Terima kasih sudah rajin mencoba resep baru.']
 ],
 tani:[
  ['Halo! Tanaman perlu air dan perhatian.','Daun hijau tumbuh lebih baik setelah disiram.','Besok coba periksa petak yang sudah ditanam!'],
  ['Pagi ini cocok untuk menanam kangkung.','Wortel dan tomat perlu dua hari untuk panen.','Jangan lupa merawat ayam sebelum tidur.']
 ],
 nia:[
  ['Halo, ayo jelajahi kampung bersama!','Aku suka melihat warna-warni sayuran di pasar.','Sore ini kita bisa menebak manfaat makanan.'],
  ['Selamat pagi! Mau belajar memilih bekal?','Buah dan sayur punya warna yang beragam, ya.','Besok kita bermain lagi, sampai jumpa!']
 ]
});
export function defaultSocial(){
 return {friends:Object.fromEntries(FRIEND_IDS.map(id=>[id,{hearts:0,lastTalkDay:0}]))};
}
const positiveInt=value=>Number.isSafeInteger(value)&&value>=0?value:0;
export function normalizeSocial(raw){
 const result=defaultSocial();
 for(const id of FRIEND_IDS){
  const v=raw?.friends?.[id]??{};
  result.friends[id]={
   hearts:Math.min(MAX_HEARTS,positiveInt(v.hearts)),
   lastTalkDay:positiveInt(v.lastTalkDay)
  };
 }
 return result;
}
export function heartDisplay(value){
 const n=Math.min(MAX_HEARTS,positiveInt(value));
 return '❤️'.repeat(n)+'🤍'.repeat(MAX_HEARTS-n);
}
export function dialogueFor(id,day,phase=0){
 const list=DIALOGUES[id];if(!list)return '';
 const safeDay=Math.max(1,positiveInt(day));
 const safePhase=Math.max(0,Math.min(2,Math.floor(Number(phase)||0)));
 return list[(safeDay-1)%list.length][safePhase];
}
export class SocialSystem {
 constructor(state){
  this.state=state;
  this.ensure();
 }
 ensure(){
  if(!this.state.data.social)this.state.data.social=defaultSocial();
  else this.state.data.social=normalizeSocial(this.state.data.social);
  return this.state.data.social;
 }
 profile(id){
  if(!FRIENDS[id])return null;
  const entry=this.ensure().friends[id];
  return {id,...FRIENDS[id],...entry,heartsDisplay:heartDisplay(entry.hearts),
   talkedToday:entry.lastTalkDay===this.state.data.day};
 }
 greet(id,phase=0){
  if(!FRIENDS[id])return null;
  const p=this.profile(id),day=Math.max(1,positiveInt(this.state.data.day));
  let gained=false;
  if(!p.talkedToday){
   const entry=this.state.data.social.friends[id];
   entry.lastTalkDay=day;
   if(entry.hearts<MAX_HEARTS){entry.hearts++;gained=true;}
   this.state.save();
  }
  return {...this.profile(id),gained,dialogue:dialogueFor(id,day,phase)};
 }
 all(){return FRIEND_IDS.map(id=>this.profile(id));}
}
