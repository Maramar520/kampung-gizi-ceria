// v1.5: persahabatan sederhana. Tidak membuat save key baru dan tidak memengaruhi quest utama.
export const FRIEND_IDS=Object.freeze(['sari','chef','tani','nia','rani','arif','lina','mayor','lia','sela','refal','dino','nurse','doctor','dimas']);
export const FRIENDS=Object.freeze({
 sari:{name:'Bu Sari',emoji:'👩',place:'Jalan kampung; pulang ke rumah kanan bawah saat hujan'},
 chef:{name:'Chef Bimo',emoji:'👨‍🍳',place:'Restoran sehat'},
 tani:{name:'Pak Yanto',emoji:'👨‍🌾',place:'Kebun dan kandang; pulang ke rumah kanan bawah saat hujan'},
 nia:{name:'Nia',emoji:'👧',place:'Jalan kampung; berteduh di pasar saat hujan'},
 rani:{name:'Kak Rani',emoji:'👩‍🏫',place:'Perpustakaan gizi di Rumah Warga'},
 arif:{name:'Arif',emoji:'👨',place:'Alun-Alun Kampung'},
 lina:{name:'Lina',emoji:'👩',place:'Alun-Alun Kampung'},
 mayor:{name:'Kepala Desa Arif',emoji:'🏛️',place:'Balai Desa'},
 lia:{name:'Bu Guru Lia',emoji:'👩‍🏫',place:'Sekolah Gizi'},
 sela:{name:'Sela',emoji:'👧',place:'Sekolah Gizi'},
 refal:{name:'Refal',emoji:'👦',place:'Sekolah Gizi'},
 dino:{name:'Nelayan Dino',emoji:'🎣',place:'Pantai dan Rumah Lina'},
 nurse:{name:'Perawat Dina',emoji:'👩‍⚕️',place:'Puskesmas'},
 doctor:{name:'Dokter Maya',emoji:'🩺',place:'Puskesmas'},
 dimas:{name:'Dimas',emoji:'🧑',place:'Puskesmas'}
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
 ],
 arif:[['Halo! Ayo olahraga ringan di alun-alun.','Berjalan kaki membantu tubuh tetap aktif.','Sore ini enak untuk menyapa tetangga!']],
 lina:[['Halo! Aku suka menanam bunga di alun-alun.','Jangan lupa makan sayuran berwarna-warni.','Ayo menjaga kebersihan kampung bersama!']],
 mayor:[['Selamat datang di Balai Desa!','Terima kasih sudah membantu warga.','Kampung sehat dibangun bersama-sama!']],
 lia:[['Selamat pagi! Ayo belajar bekal sehat.','Apa manfaat sayur dan buah?','Terima kasih sudah rajin belajar!']],
 sela:[['Halo! Ayo belajar bersama.','Aku suka membaca buku gizi.','Sampai jumpa besok!']],
 refal:[['Pagi! Siap belajar?','Ayo bermain sambil belajar sehat.','Sampai besok!']],
 dino:[['Pagi! Aku mau memeriksa jala.','Laut bersih membuat ikan sehat.','Aku akan beristirahat di Rumah Lina.']],
 nurse:[['Selamat datang di Puskesmas.','Cuci tangan sebelum pemeriksaan, ya.','Terima kasih sudah membantu pasien.']],
 doctor:[['Halo! Yuk belajar menjaga kesehatan.','Makan beragam dan cukup istirahat.','Jangan ragu meminta bantuan petugas.']],
 dimas:[['Halo, aku Dimas.','Aku sedang menunggu pemeriksaan.','Terima kasih sudah menyapa!']],
 rani:[
  ['Selamat pagi! Buku gizi sedang menunggu.','Kita bisa belajar Isi Piringku bersama.','Bacalah satu hal baru sebelum pulang!'],
  ['Ayo membaca tentang sayur dan buah.','Coba jawab kuis makanan sehat di rak buku.','Buku gizi bisa dibaca lagi besok.']
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
export function dialogueFor(id,day,phase=0,weather='Cerah',hearts=0){
 const list=DIALOGUES[id];if(!list)return '';
 const safeDay=Math.max(1,positiveInt(day));
 const safePhase=Math.max(0,Math.min(3,Math.floor(Number(phase)||0)));
 if(weather==='Hujan'&&safePhase!==3){
  return ({sari:'Hujan turun! Aku menyiapkan makanan hangat sambil berteduh.',chef:'Saat hujan, sup hangat dan makanan bergizi cocok untuk pelanggan.',tani:'Air hujan membantu menyiram kebun. Kita tunggu cuaca membaik.',nia:'Aku membantu pedagang di dalam pasar agar tidak kehujanan.',rani:'Cuaca hujan paling nyaman untuk membaca buku di perpustakaan.',arif:'Aku berteduh dulu. Kerja bakti dilanjutkan setelah hujan.',lina:'Bunga-bunga mendapat air hujan. Aku menunggu di tempat teduh.',mayor:'Kegiatan luar ruangan ditunda sampai hujan reda.'})[id]||'Ayo berteduh saat hujan!';
 }
 if(safePhase===3){
  return {sari:'Sudah malam. Besok pagi kita lanjutkan kegiatan sehat, ya!',
   chef:'Dapur sudah tenang. Tidur cukup agar siap memasak besok.',
   tani:'Malam tiba, tanaman beristirahat. Besok kita cek kebun lagi.',
   nia:'Langit sudah gelap. Selamat malam, sampai besok!',
   rani:'Perpustakaan mulai sepi. Ayo baca sebentar lalu istirahat!',
   arif:'Sudah malam, sampai bertemu besok di alun-alun!',
   lina:'Selamat malam! Besok kita rawat taman lagi.',
   mayor:'Balai Desa tutup untuk hari ini. Sampai besok!'}[id]||'Selamat malam!';
 }
 const line=list[(safeDay-1)%list.length][safePhase];
 return hearts>=4?line+' Senang sekali kita sudah akrab!':line;
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
  return {...this.profile(id),gained,dialogue:dialogueFor(id,day,phase,this.state.data.timeWeather?.weather,p.hearts)};
 }
 all(){return FRIEND_IDS.map(id=>this.profile(id));}
}
