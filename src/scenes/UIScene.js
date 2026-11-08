import {LearningSystem,FOOD_GROUPS,FOOD_OPTIONS,PLATE_STEPS,inspectPlate,LEARNING_SOURCE} from '../systems/LearningSystem.js';
import {DECOR_ITEMS,DECOR_SLOTS} from '../systems/HomeDecorSystem.js';
import {CROPS,CROP_IDS} from '../systems/GardenSystem.js';
import {INGREDIENTS,STEPS,RECIPES,RECIPE_IDS,missingFor,knownRecipe,CookingSystem} from '../systems/CookingSystem.js';
import {QuestSystem} from '../systems/QuestSystem.js';
import {CookingMinigame} from '../systems/CookingMinigame.js';
import {PlayerNotebook} from '../ui/PlayerNotebook.js';
import {BIRTHDAYS,birthdayToday,GIFT_IDS} from '../systems/FriendEvents.js';
const $=id=>document.getElementById(id);
export class UIScene extends Phaser.Scene {
 constructor(){super('UIScene')}
 create(){this.state=this.game.state;this.cooking=new CookingSystem(this.state);this.minigame=new CookingMinigame(this);this.quest=new QuestSystem(this.state);this.world=this.scene.get('WorldScene');this.garden=this.world.garden;this.dailyLife=this.world.dailyLife;this.social=this.world.social;this.missions=this.world.missions;this.learning=new LearningSystem(this.state);this.game.dialogOpen=false;this.notebook=new PlayerNotebook({state:this.state,onClose:()=>{this.game.dialogOpen=false;this.world.keysHeld.clear();}});this.refresh();this.game.events.on('action',this.action,this);this.game.events.on('close-dialog',this.close,this);$('action').onclick=()=>this.action();$('friendsButton').onclick=()=>this.socialOverview();$('learningButton').onclick=()=>this.libraryGuide();$('missionsButton').onclick=()=>this.missionsMenu();$('decorButton').onclick=()=>this.decorMenu();$('festivalButton').onclick=()=>this.festivalGuide();$('calendarButton').onclick=()=>this.calendarMenu();$('calendarHud').onclick=()=>this.calendarMenu();
$('townOverview').onclick=()=>{const cam=this.world.cameras.main;const overview=cam.zoom>=.95;if(overview){cam.stopFollow();cam.setZoom(.68);cam.centerOn(670,300);}else{cam.setZoom(1);cam.startFollow(this.world.player.sprite,true,.12,.12);} $('townOverview').textContent=overview?'🔎 Kembali ke Karakter':'🗺️ Lihat Seluruh Peta';this.note(overview?'Mode peta penuh aktif. Tekan kembali untuk mengikuti karakter.':'Kamera kembali mengikuti karakter.');};
const travel=(x,y,label)=>{this.close();this.world.keysHeld.clear();this.state.data.x=x;this.state.data.y=y;this.world.player.sprite.setPosition(x,y);const cam=this.world.cameras.main;cam.setZoom(1);cam.startFollow(this.world.player.sprite,true,.12,.12);cam.centerOn(x,y);$('townOverview').textContent='🗺️ Lihat Seluruh Peta';this.refresh();this.note(label);};
$('goEast').onclick=()=>travel(1155,281,'🏛️ Balai Kota di utara, alun-alun di selatan. Ikuti jalan!');
$('goWest').onclick=()=>travel(760,281,'🏡 Kembali ke kawasan enam blok lama.');document.querySelectorAll('[data-find-place]').forEach(button=>{
 button.addEventListener('click',()=>{
  this.world.highlightPlace(button.dataset.findPlace);
  this.note(button.dataset.findPlace==='coop'?'🐔 Kandang ayam berada di sebelah kebun, dekat rumah pemain.':
   button.dataset.findPlace==='library'?'📚 Perpustakaan berada di blok tengah atas, masuk dari jalan tengah.':'🎣 Kolam ikan berada di blok kanan atas peta.');
 });
});$('unstuck').onclick=()=>{this.close();this.world.keysHeld.clear();this.state.data.x=446;this.state.data.y=291;this.world.player.sprite.setPosition(446,291);this.refresh();this.note('Karakter kembali ke jalan. Progres tetap aman!');};$('close').onclick=()=>this.close();document.querySelectorAll('[data-open-notebook]').forEach(button=>button.addEventListener('click',()=>this.openNotebook(button.dataset.openNotebook)));
this.keyboardNotebookHandler=event=>{
 if(event.repeat||event.altKey||event.ctrlKey||event.metaKey)return;
 const target=event.target;
 if(target&&(target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName)))return;
 const key=event.key.toLowerCase();
 if(key==='f'){event.preventDefault();this.socialOverview();return;}
 if(key==='g'){event.preventDefault();this.libraryGuide();return;}
 if(key==='m'){event.preventDefault();this.missionsMenu();return;}
 if(key==='h'){event.preventDefault();this.decorMenu();return;}
 if(key==='v'){event.preventDefault();this.festivalGuide();return;}
 if(key==='k'){event.preventDefault();this.calendarMenu();return;}
 const tab={i:'inventory',r:'recipes',j:'journal'}[key];
 if(tab){event.preventDefault();this.openNotebook(tab);}
};
window.addEventListener('keydown',this.keyboardNotebookHandler);this.events.once('shutdown',()=>window.removeEventListener('keydown',this.keyboardNotebookHandler));$('reset').onclick=()=>{if(confirm('Reset semua progres game?')){this.state.reset();this.world.clock.startDay();this.world.player.sprite.setPosition(446,291);this.world.keysHeld.clear();this.world.sari.sprite.setPosition(448,281);this.close();this.refresh();this.note('Progres direset!')}};document.querySelectorAll('[data-dir]').forEach(button=>{const dir=button.dataset.dir;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);this.world.keysHeld.add(dir)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,()=>this.world.keysHeld.delete(dir))});this.time.addEvent({delay:500,loop:true,callback:()=>this.refresh()})}
 refresh(){const s=this.state.data;for(const id of ['coins','energy','carb','protein','vitamin','day'])$(id).textContent=s[id];$('status').textContent=this.state.status;$('stars').textContent=this.learning?.stars??0;$('phase').textContent=this.world?.clock?.description.phase||'Pagi';$('weather').textContent=this.world?.clock?.description.label||'🌤️ Pagi · Cerah';$('quest').textContent=this.quest.description;this.state.save();this.notebook?.refresh();this.world?.gardenArt?.render();this.updateInteractionHint()}
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
  const featured=this.world.festival.status;
  const items=[
   {label:'📍 Lihat lokasi Festival di Alun-Alun',fn:()=>this.festivalGuide()},
   ...Object.entries({beras:12,telur:15,bayam:10,wortel:14,tomat:15,kangkung:12,selada:14,brokoli:19,labu:21}).map(([id,price])=>({
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
  this.show('🧺 Pasar Tradisional','Beli bahan masakan atau bibit. Sayuran juga dapat ditanam di kebun! '+(featured.active?'🎉 Festival berlangsung di Alun-Alun, bukan di pasar!':'Festival berikutnya hari '+featured.next+'.'),items);
 }
 calendarMenu(){
  const day=Math.max(1,Number(this.state.data.day)||1);
  const festival=this.world.festival;
  const start=Math.floor((day-1)/28)*28+1;
  const cells=Array.from({length:28},(_,i)=>{
   const d=start+i,active=d===day,event=(d>=3&&(d-3)%4===0);
   const birthdays=Object.entries(BIRTHDAYS).filter(([,birthday])=>birthday===(d-1)%28+1);
   return '<div class="calendar-day'+(active?' today':'')+(event?' festival':'')+'"'+(active?' aria-current="date"':'')+'>'+d+'<small>'+(active?'Hari ini':birthdays.length?'🎂':event?'🎉':'&nbsp;')+'</small></div>';
  }).join('');
  const phase=this.world.clock.description;
  this.show('📅 Kalender Kampung','Hari '+day+' · '+phase.phase+' · '+phase.weather+'. Festival Kampung Sehat berikutnya pada hari '+festival.next+' di Alun-Alun. Kalender mengikuti hari permainan dan berganti saat pemain tidur.',[
   {label:'🎂 Ulang tahun warga',fn:()=>this.birthdayCalendarMenu()},
   {label:'🎉 Jadwal festival',fn:()=>this.festivalGuide()},
   {label:'🏛️ Misi Balai Kota',fn:()=>this.mayorMissionMenu()},
   {label:'Tutup',fn:()=>this.close()}
  ],'<div class="calendar-sheet" aria-label="Kalender 28 hari permainan">'+cells+'</div><div class="calendar-legend">🟩 Hari ini · 🎉 Hari festival · Satu halaman = 28 hari permainan</div>');
 }
 birthdayCalendarMenu(){
  const names={sari:'Bu Sari',chef:'Chef Bimo',tani:'Pak Tani',nia:'Nia',rani:'Kak Rani',arif:'Warga Arif',lina:'Warga Lina',mayor:'Kepala Desa'};
  const lines=Object.entries(BIRTHDAYS).filter(([id])=>names[id]).sort((a,b)=>a[1]-b[1]).map(([id,day])=>'🎂 Hari '+day+' · '+names[id]);
  this.show('🎂 Ulang Tahun Warga','Kalender berulang setiap 28 hari permainan. Berikan hadiah saat ulang tahun untuk bonus hati.\\n'+lines.join('\\n'),[
   {label:'Kembali ke kalender',fn:()=>this.calendarMenu()}
  ]);
 }
 festivalGuide(){
  const status=this.world.festival.status;
  this.show('🎪 Festival Kampung Sehat',
   status.active?'Hari ini festival berlangsung di Alun-Alun Kampung! Datang ke kawasan timur dan tekan E / AKSI.':
    'Festival berikutnya berlangsung pada hari '+status.next+' di Alun-Alun Kampung (sebelah timur). Tidur untuk berganti hari.',[
    {label:'📍 Tunjukkan alun-alun',fn:()=>{this.close();this.world.highlightPlace('festival');}},
    {label:'Kembali bermain',fn:()=>this.close()}
   ],'<div class="festival-banner">🎈 🥕 🥬 🎉 🍅</div>');
 }
 festivalMenu(){
  const f=this.world.festival,info=f.status;
  if(!info.active)return this.festivalGuide();
  let message='Selamat datang di Festival Kampung Sehat! Ada permainan mengenal makanan dan kegiatan warga di alun-alun. ';
  if(info.celebrated)message+='Hadiah festival hari ini sudah kamu ambil. Acara berikutnya hari '+(this.state.data.day+4)+'.';
  else if(info.quizPassed)message+='Kamu sudah menjawab benar! Ambil hadiah festivalmu.';
  else if(info.joined)message+='Ayo jawab tantangan gizi untuk memperoleh hadiah.';
  else message+='Daftar sebagai peserta dan jawab tantangan gizi. Tidak ada biaya.';
  const actions=[];
  if(!info.joined)actions.push({label:'🎟️ Ikut festival',fn:()=>{
   f.join();this.refresh();this.festivalMenu();
  }});
  if(info.joined&&!info.quizPassed&&!info.celebrated)
   actions.push({label:'🧠 Kuis festival',fn:()=>this.festivalQuiz()});
  if(info.quizPassed&&!info.celebrated)
   actions.push({label:'🎁 Ambil hadiah 35 KC + 4 ⭐',fn:()=>{
    const reward=f.celebrate();
    if(reward)this.note('Hadiah festival! +'+reward.coins+' KC +'+reward.stars+' ⭐');
    this.refresh();this.festivalMenu();
   }});
  if(info.joined&&!info.communityDone)actions.push({label:'🤝 Bantu warga menghias Alun-Alun',fn:()=>{
   const reward=f.communityHelp();if(reward)this.note('Terima kasih! +12 KC +2 ⭐');
   this.refresh();this.festivalMenu();
  }});
  if(info.joined&&!info.cookingDone)actions.push({label:'🍲 Lomba menu gizi seimbang',fn:()=>this.festivalCookingContest()});
  if(info.communityDone)message+=' Dekorasi Alun-Alun sudah dibantu. ';
  if(info.cookingDone)message+=' Lomba memasak sudah selesai. ';
  actions.push({label:'🌳 Kembali ke Alun-Alun',fn:()=>this.plazaMenu()});
  this.show('🎉 Festival Kampung Sehat · Hari '+this.state.data.day,message,actions,
   '<div class="festival-banner">🎈 🥕 🥬 🎉 🍅</div>');
 }
 festivalCookingContest(){
  this.show('🍲 Lomba Menu Sehat','Chef Bimo mengajakmu memilih menu dengan beragam kelompok makanan. Mana yang paling seimbang?',[
   {label:'A. Nasi saja',fn:()=>this.festivalCookingAnswer(0)},
   {label:'B. Nasi, ikan, sayur dan buah',fn:()=>this.festivalCookingAnswer(1)},
   {label:'C. Minuman manis saja',fn:()=>this.festivalCookingAnswer(2)}
  ]);
 }
 festivalCookingAnswer(choice){
  const reward=this.world.festival.cookingContest(choice);
  this.refresh();
  this.show(reward?'🏆 Menu Seimbang!':'🌱 Coba Lagi',
   reward?'Hebat! Makanan beragam membantu memenuhi kebutuhan gizi. +18 KC +2 ⭐':'Pilih makanan pokok, lauk, sayur, dan buah agar lebih beragam.',[
    {label:reward?'Kembali ke Festival':'Coba lagi',fn:()=>reward?this.festivalMenu():this.festivalCookingContest()}
   ]);
 }
 festivalQuiz(){
  const f=this.world.festival,q=f.question;
  this.show('🧠 Kuis Festival Gizi',q.question,q.choices.map((choice,i)=>({
   label:String.fromCharCode(65+i)+'. '+choice,
   fn:()=>{
    const correct=f.quiz(i);
    this.show(correct?'🌟 Jawaban benar!':'🌱 Ayo mencoba lagi',
     correct?q.feedback:'Belum tepat. Pilih lagi, ya! Tidak ada penalti.',[
      {label:correct?'Kembali ke festival':'Coba lagi',
       fn:()=>correct?this.festivalMenu():this.festivalQuiz()}
     ]);
   }
  })));
 }
 plazaMenu(){
  const active=this.world.festival.active;
  this.show('🌳 Alun-Alun Kampung',active?
   'Festival Kampung Sehat sedang berlangsung! Warga berkumpul di dekat air mancur dan panggung kegiatan.':
   'Selamat datang di alun-alun! Ada air mancur, bangku taman dan tempat warga berkumpul. Festival diadakan setiap empat hari permainan.',[
    {label:active?'🎪 Ikut Festival Kampung Sehat':'📅 Jadwal festival',fn:()=>active?this.festivalMenu():this.festivalGuide()},
    {label:'🤸 Senam dan kegiatan warga',fn:()=>this.plazaActivity()},
    {label:'Tutup',fn:()=>this.close()}
   ]);
 }
 plazaActivity(){
  const day=this.state.data.day;
  this.state.data.plazaActivities??={days:[]};
  const days=this.state.data.plazaActivities.days;
  if(days.includes(day))return this.show('🌳 Aktivitas Warga','Kamu sudah ikut kegiatan hari ini. Sampai besok!',[
   {label:'Kembali',fn:()=>this.plazaMenu()}]);
  this.show('🤸 Aktivitas Warga','Ikuti gerakan ringan bersama warga, lalu istirahat dan minum air putih.',[
   {label:'✨ Ikut kegiatan (+8 KC, +1 ⭐)',fn:()=>{
    days.push(day);this.state.data.plazaActivities.days=days.slice(-120);
    this.state.data.coins+=8;this.state.data.learning??={stars:0};
    this.state.data.learning.stars=(this.state.data.learning.stars||0)+1;
    this.state.save();this.refresh();this.plazaMenu();
   }},{label:'Kembali',fn:()=>this.plazaMenu()}
  ]);
 }
 townHallMenu(){
  this.show('🏛️ Balai Kota','Selamat datang di Balai Kota! Ruang pelayanan, meja kerja, dan papan pengumuman terlihat langsung di dalam Balai Kota.',[
   {label:'📋 Papan Misi Kepala Desa',fn:()=>this.mayorMissionMenu()},
   {label:'📋 Pengumuman Festival',fn:()=>this.festivalGuide()},
   {label:'🌳 Kegiatan Alun-Alun',fn:()=>this.plazaMenu()},
   {label:'Tutup',fn:()=>this.close()}
  ]);
 }
 mayorMissionMenu(){
  const tasks=this.world.mayorMissions.status;
  this.show('📋 Misi Kepala Desa','Selesaikan kegiatan warga dan kembali ke Balai Kota untuk mengambil hadiah. Hadiah hanya dapat diambil satu kali per hari.',[
   ...tasks.map(t=>({label:(t.claimed?'✅ ':t.done?'🎁 ':'▫️ ')+t.name+' · '+t.coins+' KC + '+t.stars+' ⭐',fn:()=>{
    const prize=this.world.mayorMissions.claim(t.id);
    if(prize){this.refresh();this.note('Misi selesai! +'+prize.coins+' KC +'+prize.stars+' ⭐');}
    else this.note(t.claimed?'Hadiah sudah diambil hari ini.':'Selesaikan aktivitasnya dahulu.');
    this.mayorMissionMenu();
   }})),
   {label:'Kembali ke Balai Kota',fn:()=>this.townHallMenu()}
  ]);
 }
 mayorMenu(){
  const greeting=this.friendsLine('mayor');
  this.show('🏛️ Kepala Desa',greeting+'\nHalo! Mari menjaga kampung tetap bersih, aktif bergerak, dan makan makanan beragam. Festival Kampung Sehat diadakan di alun-alun!',[
   {label:'🤝 Buku Pertemanan',fn:()=>this.socialOverview()},
   {label:'📋 Papan Misi Balai Kota',fn:()=>this.mayorMissionMenu()},
   {label:'📅 Lihat festival',fn:()=>this.festivalGuide()},
   {label:'🌳 Kegiatan warga',fn:()=>this.plazaMenu()},
   {label:'Sampai jumpa',fn:()=>this.close()}
  ]);
 }
 familyHomeMenu(){
  const rain=this.world.clock.weather==='Hujan';
  this.show('🏡 Rumah Pak Tani & Bu Sari',
   'Ini rumah keluarga Pak Tani dan Bu Sari di blok kanan bawah. Interiornya terlihat langsung dari peta. '+
   (rain?'Sekarang hujan, Pak Tani dan Bu Sari berteduh di sini.':'Saat hujan, Pak Tani dan Bu Sari pulang ke rumah ini.')+
   ' Nia akan berteduh di Pasar Tradisional saat hujan.',[
    {label:'👨‍🌾 Cari Pak Tani dan Bu Sari',fn:()=>{
     this.close();
     this.note(rain?'Keduanya sedang berjalan menuju atau berada di dalam rumah.':'Temui mereka saat berjalan di kampung; mereka pulang saat hujan.');
    }},
    {label:'🎁 Berkunjung dan memberi hadiah Bu Sari',fn:()=>this.giftMenu('sari')},
    {label:'🥕 Berkunjung dan memberi hadiah Pak Tani',fn:()=>this.giftMenu('tani')},
    {label:'Kembali ke kampung',fn:()=>this.close()}
   ],'<div class="farm-preview">🏠 🛏️ 🪴</div>');
 }
 friendsLine(id){
  const p=this.social.greet(id,this.world.phaseIndex??0);
  if(!p)return '';
  if(p.gained)this.missions.record('friend');
  return p.dialogue+'\n'+p.heartsDisplay+(p.gained?' · +1 hati hari ini!':' · Sudah menyapa hari ini.');
 }
 libraryGuide(){
  if(this.notebook?.visible)return;
  this.show('📚 Pergi ke Perpustakaan Gizi',
   'Perpustakaan berada di blok tengah atas. Masuk dari jalan tengah, dekati rak buku dan temui Kak Rani untuk belajar bersama.',[
    {label:'📍 Tunjukkan perpustakaan',fn:()=>{this.close();this.world.highlightPlace('library');}},
    {label:'Tutup petunjuk',fn:()=>this.close()}
   ],'<div class="learning-celebrate">🏘️ 📚 👩‍🏫</div>');
 }
 libraryMenu(){
  this.show('📚 Perpustakaan Gizi',
   'Selamat datang di sudut baca! Pilih kegiatan membaca dan belajar bersama Kak Rani. Jawaban salah boleh dicoba kembali.',[
    {label:'🧠 Kuis makanan bergizi',fn:()=>this.startQuiz()},
    {label:'🍽️ Tantangan Isi Piringku',fn:()=>this.startPlate()},
    {label:'📗 Baca buku tentang kelompok makanan',fn:()=>this.readNutritionBook()},
    {label:'Tutup perpustakaan',fn:()=>this.close()}
   ],'<div class="library-banner">📚 📗 🥕 🥚 🍊</div>');
 }
 librarianMenu(){
  const greeting=this.friendsLine('rani');
  this.show('👩‍🏫 Kak Rani · Pustakawan',
   greeting+'\nAyo belajar tentang gizi dari buku dan permainan di perpustakaan!',[
    {label:'📚 Pilih kegiatan belajar',fn:()=>this.libraryMenu()},
    {label:'🧹 Bantu merapikan buku'+(this.missions.progress('help')?' ✓':''),fn:()=>this.helpRani()},
    {label:'🤝 Lihat buku pertemanan',fn:()=>this.socialOverview()},
    {label:'Sampai jumpa',fn:()=>this.close()}
   ]);
  this.refresh();
 }
 helpRani(){
  if(this.missions.progress('help')){
   return this.show('📚 Buku sudah rapi','Terima kasih! Kamu sudah membantu Kak Rani hari ini. Ayo kembali besok untuk tugas baru.',[
    {label:'Kembali ke Kak Rani',fn:()=>this.librarianMenu()}
   ]);
  }
  this.show('🧹 Bantu Kak Rani','Kak Rani menemukan buku tentang wortel dan bayam. Buku itu sebaiknya ditaruh di rak mana?',[
   {label:'🥬 Rak Sayuran',fn:()=>{
    this.missions.record('help');this.refresh();
    this.show('✨ Terima kasih, Penolong Buku!','Benar! Wortel dan bayam termasuk sayuran. Misi membantu warga bertambah.',[
     {label:'📋 Lihat misi harian',fn:()=>this.missionsMenu()},
     {label:'Kembali ke Kak Rani',fn:()=>this.librarianMenu()}
    ]);
   }},
   {label:'🍳 Rak Peralatan Memasak',fn:()=>this.show('💡 Coba lagi','Wortel dan bayam adalah sayuran, bukan peralatan masak.',[
    {label:'Coba rak lainnya',fn:()=>this.helpRani()}
   ])}
  ]);
 }
 readNutritionBook(){
  this.show('📗 Buku Gizi Ceria',
   'Makanan pokok memberi energi, lauk menjadi sumber protein, dan sayur serta buah menyumbang serat, vitamin, dan mineral. Yuk makan beragam dan minum air putih!',[
    {label:'🧠 Coba kuis setelah membaca',fn:()=>this.startQuiz()},
    {label:'Kembali ke rak buku',fn:()=>this.libraryMenu()}
   ],'<div class="nutrition-tip">🍚 Makanan pokok · 🐟 Lauk · 🥬 Sayur · 🍊 Buah<br><small>Isi Piringku: setengah piring sayur dan buah, setengah lagi makanan pokok dan lauk.</small></div>');
 }
 missionsMenu(){
  if(this.notebook?.visible)return;
  const items=this.missions.daily();
  const html='<div class="mission-grid">'+items.map(m=>'<div class="mission-card">'+m.emoji+
   ' <strong>'+m.title+'</strong><small>'+m.count+'/'+m.target+
   (m.claimed?' · ✓ Hadiah diambil':' · '+m.stars+' ⭐ +'+m.coins+' KC')+'</small></div>').join('')+'</div>';
  const available=items.filter(m=>m.count>=m.target&&!m.claimed);
  this.show('📋 Misi Harian · Hari '+this.state.data.day,
   'Lakukan kegiatan kampung. Klaim hadiah setelah misi selesai. Misi baru dimulai ketika tidur.',[
    ...available.map(m=>({label:'🎁 Klaim '+m.title,fn:()=>{
     const gift=this.missions.claim(m.id);
     if(gift)this.note('Misi selesai! +'+gift.stars+' ⭐ dan +'+gift.coins+' KC');
     this.refresh();this.missionsMenu();
    }})),
    {label:'🏅 Lihat Lencana Pencapaian',fn:()=>this.achievementMenu()},
    {label:'Tutup',fn:()=>this.close()}
   ],html);
 }
 achievementMenu(){
  const list=this.missions.badges();
  const cards='<div class="mission-grid">'+list.map(a=>'<div class="mission-card">'+
   a.emoji+' <strong>'+a.title+'</strong><small>'+
   (a.earned?'🏅 Sudah diperoleh':a.ready?'🎁 Siap diklaim':'🔒 Belum terbuka')+
   '</small></div>').join('')+'</div>';
  this.show('🏅 Lencana Kampung Ceria',
   'Pencapaian hanya bisa diklaim satu kali sepanjang permainan.',[
    ...list.filter(a=>a.ready&&!a.earned).map(a=>({label:'🎁 Klaim '+a.title,fn:()=>{
     const prize=this.missions.claimAchievement(a.id);
     if(prize)this.note('Lencana baru! +'+prize.stars+' ⭐ +'+prize.coins+' KC');
     this.refresh();this.achievementMenu();
    }})),
    {label:'Kembali ke misi harian',fn:()=>this.missionsMenu()},
    {label:'Tutup',fn:()=>this.close()}
   ],cards);
 }
 learningMenu(){
  if(this.notebook?.visible)return;
  const day=this.state.data.day;
  this.show('📚 Belajar Gizi di Perpustakaan','Hari '+day+' · Bintang belajar: '+this.learning.stars+
   '\nPilih kuis atau susun piring seimbang. Salah menjawab boleh mencoba lagi, tanpa mengurangi koin.',[
   {label:'🧠 Kuis Gizi (3 pertanyaan)'+(this.learning.canClaim('quiz')?' · hadiah tersedia':' ✓ selesai hari ini'),fn:()=>this.startQuiz()},
   {label:'🍽️ Tantangan Isi Piringku'+(this.learning.canClaim('plate')?' · hadiah tersedia':' ✓ selesai hari ini'),fn:()=>this.startPlate()},
   {label:'Tutup',fn:()=>this.close()}
  ],'<div class="nutrition-tip">🍽️ Pedoman: ½ piring sayur dan buah, ½ lainnya makanan pokok dan lauk.<small>Belajar dari panduan Isi Piringku Kementerian Kesehatan RI. Ini permainan belajar, bukan takaran pribadi.</small></div>');
 }
 startQuiz(){
  this.quizProgress={index:0,correct:[]};
  this.quizQuestion();
 }
 quizQuestion(){
  const questions=this.learning.questions(),p=this.quizProgress;
  if(!p)return this.learningMenu();
  if(p.index>=questions.length){
   const reward=this.learning.quizFinished(p.correct);
   this.missions.record('learn');this.refresh();
   return this.show('🎉 Kuis Gizi Selesai!',
    reward?'Hebat! +'+reward.stars+' ⭐ dan +'+reward.coins+' Koin Ceria.':
     'Hebat, semua pertanyaan selesai! Hadiah harian sudah pernah kamu ambil. Coba lagi besok.',[
      {label:'Kembali ke menu belajar',fn:()=>this.learningMenu()},
      {label:'Selesai',fn:()=>this.close()}
     ],'<div class="learning-celebrate">🌟 🧠 🌟</div>');
  }
  const q=questions[p.index];
  const actions=q.choices.map((choice,i)=>({label:String.fromCharCode(65+i)+'. '+choice,fn:()=>this.quizAnswer(i)}));
  this.show('🧠 Kuis Gizi · '+(p.index+1)+' / '+questions.length,q.question,actions,
   '<div class="nutrition-tip">💡 Pikirkan kelompok makanan yang paling sesuai. Kamu boleh mencoba lagi jika salah.</div>');
 }
 quizAnswer(choice){
  const p=this.quizProgress,q=this.learning.questions()[p?.index];
  if(!q)return this.learningMenu();
  const correct=q.correct===choice;
  if(correct){
   if(!p.correct.includes(q.id))p.correct.push(q.id);
   p.index++;
  }
  this.show(correct?'✅ Jawaban tepat!':'🌱 Yuk coba lagi',q.feedback,[
   {label:correct?(p.index>=this.learning.questions().length?'⭐ Lihat hasil':'Pertanyaan berikutnya'):'Coba pilihan lain',
    fn:()=>this.quizQuestion()}
  ],'<div class="learning-celebrate">'+(correct?'🌟 🎉':'🌱 💡')+'</div>');
 }
 startPlate(){
  this.plateSelection={};
  this.plateQuestion(0);
 }
 platePreview(){
  const selected=this.plateSelection||{},tokens=[];
  for(const id of PLATE_STEPS){
   const count=FOOD_GROUPS[id].share;
   const item=FOOD_OPTIONS.find(o=>o.id===selected[id]);
   for(let i=0;i<count;i++)tokens.push('<div class="plate-piece '+id+'"><span>'+
    (item?.emoji||FOOD_GROUPS[id].emoji)+'</span><small>'+(item?.name||FOOD_GROUPS[id].name)+'</small></div>');
  }
  return '<div class="plate-preview" aria-label="Piring enam bagian">'+tokens.join('')+
   '</div><p class="plate-explain">2 bagian makanan pokok · 1 lauk · 2 sayur · 1 buah</p>';
 }
 plateQuestion(index=0){
  if(index>=PLATE_STEPS.length){
   const evaluation=inspectPlate(this.plateSelection);
   const reward=this.learning.plateFinished(this.plateSelection);
   if(evaluation.complete)this.missions.record('learn');this.refresh();
   return this.show('🍽️ Isi Piringku Selesai!',
    evaluation.complete?(reward?'Keren! +'+reward.stars+' ⭐ dan +'+reward.coins+' Koin Ceria.':
      'Piringmu sudah seimbang! Hadiah hari ini sudah didapat. Bisa belajar lagi besok.'):
      'Masih ada kelompok yang perlu diperbaiki. Ayo coba lagi.',[
       {label:'Kembali belajar',fn:()=>this.learningMenu()},
       {label:'Selesai',fn:()=>this.close()}
      ],this.platePreview());
  }
  const group=PLATE_STEPS[index],g=FOOD_GROUPS[group];
  // Menawarkan pilihan berbagai kelompok supaya keputusan anak benar-benar diuji.
  const choices={
   pokok:['nasi','ikan','bayam','pisang'],
   lauk:['jeruk','telur','jagung','wortel'],
   sayur:['tahu','pepaya','kangkung','nasi'],
   buah:['bayam','ikan','jagung','pisang']
  }[group];
  this.show('🍽️ Isi Piringku · '+(index+1)+' / 4',
   'Pilih makanan untuk kelompok '+g.name+'. '+g.hint,
   choices.map(id=>{
    const item=FOOD_OPTIONS.find(x=>x.id===id);
    return {label:item.emoji+' '+item.name,fn:()=>this.plateChoose(index,id)};
   }),this.platePreview());
 }
 plateChoose(index,id){
  const group=PLATE_STEPS[index],item=FOOD_OPTIONS.find(x=>x.id===id);
  if(!item)return this.plateQuestion(index);
  if(item.group!==group){
   return this.show('🌱 Hampir benar!',''+item.name+' termasuk kelompok '+
    FOOD_GROUPS[item.group].name+'. Coba pilih makanan untuk '+FOOD_GROUPS[group].name+'.',[
    {label:'Coba lagi',fn:()=>this.plateQuestion(index)}
   ],this.platePreview());
  }
  this.plateSelection[group]=id;
  this.show('✅ Bagus!',item.name+' cocok sebagai '+FOOD_GROUPS[group].name+'.',[
   {label:index===3?'Lihat hasil piring':'Isi bagian berikutnya',fn:()=>this.plateQuestion(index+1)}
  ],this.platePreview());
 }
 friendMenu(id){
  const p=this.social.profile(id);
  if(!p)return;
  const greeting=this.friendsLine(id);
  const tip=id==='tani'?'Tips: siram tanaman lalu tidur agar tumbuh.':
   'Tips: cek buku resep dan coba beragam sayur setiap hari.';
  const birthday=birthdayToday(id,this.state.data.day);
  this.show(p.emoji+' '+p.name,greeting+'\n'+tip+(birthday?'\n🎂 Hari ini ulang tahunnya!':''),[
   {label:'🎁 Beri hadiah',fn:()=>this.giftMenu(id)},
   {label:id==='tani'?'🌿 Belajar kelompok sayuran':'🎒 Tantangan bekal bergizi',fn:()=>this.libraryGuide()},
   {label:'🤝 Lihat daftar teman',fn:()=>this.socialOverview()},
   {label:'Sampai jumpa!',fn:()=>this.close()}
  ]);
  this.refresh();
 }
 giftMenu(id){
  const p=this.social.profile(id);
  const available=GIFT_IDS.filter(item=>(this.state.data.inventory[item]||0)>0);
  this.show('🎁 Hadiah untuk '+p.name,'Pilih satu bahan makanan dari tas. Hadiah biasa +1 hati, hadiah ulang tahun +2 hati. Maksimal satu hadiah per teman per hari.',[
   ...available.map(item=>({label:'🎁 '+item+' ('+this.state.data.inventory[item]+')',fn:()=>{
    const result=this.world.friendEvents.gift(id,item,this.social);
    this.refresh();this.show(result.ok?'🎉 Hadiah diterima!':'Hadiah belum bisa diberikan',result.ok?
     p.name+' senang menerima '+item+'! '+(result.birthday?'Bonus ulang tahun! ':'')+'Sekarang '+result.hearts+'/5 hati.':result.reason,
     [{label:'Kembali',fn:()=>this.friendMenu(id)}]);
   }})),
   {label:'Kembali',fn:()=>this.friendMenu(id)}
  ]);
 }
 socialOverview(){
  if(this.notebook?.visible)return;
  if(this.game.dialogOpen&&$('dialog').classList.contains('hidden'))return;
  const cards=this.social.all().map(p=>'<div class="social-friend"><div><strong>'+
   p.emoji+' '+p.name+'</strong><small>'+p.place+'</small></div>'+
   '<span class="social-hearts" aria-label="'+p.hearts+' dari 5 hati">'+p.heartsDisplay+'</span></div>').join('');
  this.show('🤝 Buku Pertemanan','Sapa tiap warga maksimal sekali per hari untuk menambah satu hati. Tidur untuk memulai hari baru.',[
   {label:'Tutup buku teman',fn:()=>this.close()}
  ],'<div class="social-overview">'+cards+'</div><p class="social-notice">❤️ Maksimal 5 hati per teman. Tidak memerlukan koin atau data pribadi.</p>');
 }
 villageMenu(){
  this.show('📚 Perpustakaan','Selamat datang di perpustakaan! Interior dan ruang baca terlihat langsung dari peta. Temui Kak Rani atau dekati rak buku untuk belajar gizi.',[
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
      this.missions.record('plant');this.world.playInteraction('plant');this.refresh();this.gardenMenu();
     }});
    }
   }else if(p.stage==='dry'){
    actions.push({label:'💧 Siram '+p.name+' · Petak '+(p.index+1),fn:()=>{
     if(this.garden.water(p.index)){this.world.playInteraction('water');this.refresh();this.gardenMenu();}
    }});
   }else if(p.stage==='ready'){
    actions.push({label:p.emoji+' Panen '+p.name+' · Petak '+(p.index+1),fn:()=>{
     if(this.garden.harvest(p.index)){
      this.missions.record('harvest');
      const bonus=this.world.festival.harvest(p.crop);
      this.world.playInteraction('harvest');this.refresh();this.gardenMenu();
      if(bonus)this.note('Panen pilihan hari ini! +'+bonus.coins+' KC dan +'+bonus.stars+' ⭐');
      if(!bonus)this.note('Panen '+p.name+': +'+CROPS[p.crop].yield+' hasil, +1 bibit!');
     }
    }});
   }
  }
  if(!actions.length)actions.push({label:'🌙 Tunggu sampai panen',fn:()=>{this.close();this.note('Gunakan kasur untuk memulai hari berikutnya.');}});
  const seeds=CROP_IDS.map(id=>CROPS[id].emoji+' '+CROPS[id].name+': '+view.seedsByCrop[id]).join(' · ');
  const weatherTip=this.world.clock.weather==='Hujan'?' 🌧️ Hujan menyiram tanaman secara otomatis.':'';
  const featuredCrop=CROPS[this.world.festival.featured];
  const dayTip=' 🌟 Tanaman pilihan hari ini: '+featuredCrop.name+' (bonus panen sekali/hari).';
  this.show('🌿 Kebun Sayur','Hari '+this.state.data.day+' · '+seeds+'.\nTanam, siram, tidur di rumah, lalu panen! Setiap sayuran memiliki waktu tumbuh berbeda.'+weatherTip+dayTip,actions,'<div class="garden-preview">'+icons+'</div>');
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
 seaFishingMenu(){
  const coast=this.world.coast,st=coast.status;
  if(!st.fishReady)return this.show('🎣 Dermaga Laut','Kamu sudah memancing hari ini. Lihat koleksi ikan atau kembali besok.',[
   {label:'🐟 Koleksi ikan laut',fn:()=>this.seaCollectionMenu()},
   {label:'Tutup',fn:()=>this.close()}]);
  this.show('🎣 Memancing di Laut','Mini-game: perhatikan arah tarikan ikan. Pilih arah yang tepat tiga kali untuk mendapat ikan. Jatah ini terpisah dari Kolam Ikan.',[
   {label:'🎣 Mulai menarik kail ('+st.casts+'/3)',fn:()=>this.fishingChallenge()},
   {label:'📖 Koleksi ikan',fn:()=>this.seaCollectionMenu()},
   {label:'Tutup',fn:()=>this.close()}
  ],'<div class="farm-preview">🌊 🎣 🐟 🌊</div>');
 }
 fishingChallenge(){
  const coast=this.world.coast;
  if(!coast.status.fishReady)return this.seaFishingMenu();
  const dirs=['⬅️ Kiri','⬆️ Atas','➡️ Kanan'];
  const correct=(this.state.data.day+coast.status.casts)%3;
  this.show('🎣 Ikan sedang menarik kail!','Ikuti arah tarikan ikan: '+dirs[correct]+'. Pilih arah yang sama untuk mengendalikan kail.',[
   ...dirs.map((label,i)=>({label,fn:()=>{
    if(i!==correct)return this.show('🌊 Ikan menghindar!','Arah belum tepat. Coba lagi, kesempatanmu tidak berkurang.',[
     {label:'🎣 Coba lagi',fn:()=>this.fishingChallenge()}]);
    const result=coast.cast();this.refresh();this.world.playInteraction('fish');
    if(result.success)this.show('🐟 Tangkapan Laut!',result.fish.emoji+' '+result.fish.name+' · '+result.fish.rarity+'. +1 ikan untuk memasak dan koleksi laut.',[
     {label:'📖 Lihat koleksi',fn:()=>this.seaCollectionMenu()},
     {label:'Selesai',fn:()=>this.close()}]);
    else this.seaFishingMenu();
   }})),
   {label:'Batalkan',fn:()=>this.close()}
  ]);
 }
 seaCollectionMenu(){
  const list=this.world.coast.status.collection;
  this.show('📖 Koleksi Ikan Laut',list.map(f=>f.emoji+' '+f.name+' · '+f.rarity+' · tertangkap '+f.count+' kali').join('\\n'),[
   {label:'Kembali ke dermaga',fn:()=>this.seaFishingMenu()},
   {label:'Tutup',fn:()=>this.close()}
  ]);
 }
 beachMenu(){
  const coast=this.world.coast,st=coast.status;
  this.show('🏖️ Pantai Selatan','Kumpulkan kerang, bersihkan pantai, atau berlayar dari dermaga. Festival memancing setiap hari ke-7.',[
   {label:'🐚 Cari kerang'+(st.shellReady?'':' ✓'),fn:()=>{
    if(coast.shell()){this.refresh();this.note('🐚 +1 kerang masuk ke tas!');}else this.note('Kerang hari ini sudah dikumpulkan.');
    this.beachMenu();
   }},
   {label:'🧹 Bersihkan sampah pantai'+(st.cleanReady?'':' ✓'),fn:()=>{
    if(coast.clean()){this.refresh();this.note('Pantai bersih! +12 Koin Ceria.');}else this.note('Pantai sudah bersih hari ini.');
    this.beachMenu();
   }},
   {label:'🎪 Festival Memancing',fn:()=>this.beachFestivalMenu()},
   {label:'📖 Koleksi ikan',fn:()=>this.seaCollectionMenu()},
   {label:'Tutup',fn:()=>this.close()}
  ],'<div class="farm-preview">🌴 🐚 🏖️ 🌊</div>');
 }
 beachFestivalMenu(){
  const coast=this.world.coast,st=coast.status;
  this.show('🎪 Festival Memancing Pantai',st.festivalToday?
   'Festival berlangsung hari ini! Tangkap setidaknya satu ikan laut untuk mendapat hadiah 25 Koin Ceria.':
   'Festival diadakan setiap hari ke-7 permainan. Festival berikutnya hari '+(this.state.data.day+(7-this.state.data.day%7))+'.',[
   ...(st.festivalToday?[{label:'🎁 Ambil hadiah festival'+(st.festivalClaimed?' ✓':''),fn:()=>{
    if(coast.claimFestival()){this.refresh();this.note('Festival selesai! +25 Koin Ceria.');}
    else this.note(st.festivalClaimed?'Hadiah hari ini sudah diambil.':'Tangkap ikan laut terlebih dahulu.');
    this.beachFestivalMenu();
   }}]:[]),
   {label:'Kembali ke pantai',fn:()=>this.beachMenu()}
  ]);
 }
 boatMenu(){
  this.show('⛵ Perahu Dermaga','Naik perahu ke Pulau Kecil? Perjalanan gratis dan tidak menghapus progres.',[
   {label:'🏝️ Berlayar ke Pulau Kecil',fn:()=>{
    this.world.coast.visitIsland();this.close();this.state.data.x=1100;this.state.data.y=770;
    this.world.player.sprite.setPosition(1100,770);this.state.save();this.refresh();this.note('🏝️ Selamat datang di Pulau Kecil!');
   }},
   {label:'Batal',fn:()=>this.close()}
  ]);
 }
 islandMenu(){
  const ready=this.world.coast.status.treasureReady;
  this.show('🏝️ Pulau Kecil','Jelajahi pulau, cari harta karun harian, dan temui Nelayan Bayu. Perahu siap membawamu kembali ke dermaga.',[
   {label:'🧰 Cari peti harta karun'+(ready?'':' ✓'),fn:()=>{
    const found=this.world.coast.treasure();this.refresh();
    this.show(found?'🪙 Harta karun ditemukan!':'🧰 Peti kosong',found?'+8 Koin Ceria! Coba lagi besok.':'Peti sudah diperiksa hari ini.',[
     {label:'Kembali ke pulau',fn:()=>this.islandMenu()}]);
   }},
   {label:'⛵ Kembali ke dermaga',fn:()=>{
    this.close();this.state.data.x=761;this.state.data.y=697;
    this.world.player.sprite.setPosition(761,697);this.state.save();this.refresh();this.note('Kembali ke dermaga.');
   }},
   {label:'Menjelajah pulau',fn:()=>this.close()}
  ]);
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
 decorMenu(){
  const owned=this.world.decor.data.owned;
  const slots=this.world.decor.view();
  const overview='<div class="decor-board">'+slots.map(slot=>'<div class="decor-slot"><strong>'+
   slot.name+'</strong><span>'+ (slot.item?DECOR_ITEMS[slot.item].emoji:'▫️') +
   '</span><small>'+slot.label+'</small></div>').join('')+'</div>';
  this.show('🏡 Dekorasi Rumah Pemain',
   'Hias rumahmu dengan Koin Ceria. Pilih perabot, lalu tentukan sudut rumah. Dekorasi tidak menghalangi jalan.',
   [...Object.entries(DECOR_ITEMS).filter(([id])=>!owned.includes(id)).map(([id,item])=>({
    label:item.emoji+' Beli '+item.name+' · '+item.price+' KC',
    fn:()=>{if(!this.world.decor.buy(id)){this.note('Koin belum cukup.');return;}
     this.refresh();this.decorMenu();this.note('Perabot berhasil dibeli!');}
   })),
   ...DECOR_SLOTS.map(slot=>({label:'🎨 Atur '+slot.name,fn:()=>this.decorSlotMenu(slot.id)})),
   {label:'Kembali ke kasur',fn:()=>this.bedMenu()}
   ],overview);
 }
 decorSlotMenu(slotId){
  const slot=DECOR_SLOTS.find(s=>s.id===slotId);
  if(!slot)return this.decorMenu();
  const owned=this.world.decor.data.owned,placed=this.world.decor.data.slots;
  const choices=owned.filter(id=>!Object.entries(placed).some(([key,value])=>key!==slotId&&value===id));
  this.show('🎨 '+slot.name,'Pilih hiasan yang sudah dimiliki untuk sudut ini.',[
   ...choices.map(id=>({label:DECOR_ITEMS[id].emoji+' '+DECOR_ITEMS[id].name,
    fn:()=>{this.world.decor.place(slotId,id);this.world.decorArt.render();this.refresh();this.decorMenu();}})),
   {label:'▫️ Kosongkan sudut',fn:()=>{
    this.world.decor.place(slotId,null);this.world.decorArt.render();this.refresh();this.decorMenu();
   }},
   {label:'Kembali',fn:()=>this.decorMenu()}
  ]);
 }
 bedMenu(){
  this.show('🛏️ Kasur & Rumah Pemain',
   'Kamu bisa tidur untuk memulai hari baru atau menghias rumah menggunakan Koin Ceria.',[
    {label:'🏠 Hias rumah',fn:()=>this.decorMenu()},
    {label:'🌙 Tidur hingga pagi',fn:()=>{
     const s=this.state.data;this.world.playInteraction('sleep');
     s.energy=100;s.day++;this.world.clock.startDay();this.refresh();
     this.show('☀️ Selamat pagi!','Hari '+s.day+' dimulai. '+
      (this.world.clock.weather==='Hujan'?'Hari ini hujan! Tanaman di kebun tersiram secara otomatis.':
       'Periksa kebunmu untuk melihat sayuran yang siap dipanen!'));
    }}
   ]);
 }
 restaurantMenu(){
  const status=this.world.restaurantOrders.status,order=status.order;
  const recipe=RECIPES[order.recipe],known=knownRecipe(this.state.data,order.recipe);
  const missing=missingFor(this.state.data,order.recipe);
  const summary='👤 Pelanggan NPC: '+(this.world.restaurantCustomer?.status==='arriving'?'sedang berjalan menuju meja':this.world.restaurantCustomer?.status==='ordering'?'sudah duduk dan menunggu pesanan':this.world.restaurantCustomer?.status==='eating'?'sedang duduk dan menikmati makanan':this.world.restaurantCustomer?.status==='paying'?'sedang membayar pesanan':this.world.restaurantCustomer?.status==='leaving'?'sedang meninggalkan restoran':'pesanan selesai')+'.\n'+order.customer+' memesan '+recipe.name+'.\nBahan: '+recipe.ingredients.join(', ')+
   '.\nHadiah: '+order.coins+' Koin Ceria + '+order.stars+' ⭐.\n'+
   (status.served?'Pesanan hari ini sudah selesai!':
    status.prepared?'Masakan sudah siap diantar kepada Chef Bimo.':
    'Masak resep ini di kompor rumah atau dapur restoran, kemudian antarkan ke Chef Bimo.');
  const buttons=[];
  if(!status.served&&status.prepared)buttons.push({label:'🍽️ Antar pesanan kepada pelanggan',fn:()=>{
   const reward=this.world.restaurantOrders.serve();
   if(reward){this.refresh();this.note('Pesanan diterima! Pembayaran tercatat +'+reward.coins+' KC +'+reward.stars+' ⭐');}
   this.restaurantMenu();
  }});
  if(!status.served&&!status.prepared){
   if(!known)buttons.push({label:'📖 Pelajari resep pesanan',fn:()=>{
    this.cooking.learn(order.recipe);this.refresh();this.restaurantMenu();
   }});
   buttons.push({label:'🍳 Memasak di dapur restoran',fn:()=>{
    if(!known)return this.show('📖 Pelajari dahulu','Temui Chef Bimo dan pelajari resep sebelum memasak.',[
     {label:'Kembali',fn:()=>this.restaurantMenu()}]);
    if(missing.length)return this.show('🧺 Bahan belum lengkap','Cari bahan: '+missing.join(', ')+'. Beli di Pasar Tradisional atau panen dari kebun.',[
     {label:'Kembali',fn:()=>this.restaurantMenu()}]);
    this.activeRecipe=order.recipe;this.cookStep(0);
   }});
  }
  buttons.push({label:'Kembali ke Chef Bimo',fn:()=>this.chefMenu()});
  this.show('🍽️ Pesanan Restoran Sehat',summary,buttons,
   '<div class="order-ticket">'+recipe.emoji+' <strong>'+recipe.name+'</strong> · '+order.customer+
   (status.served?' ✅ Selesai':status.prepared?' 🍽️ Siap disajikan':' 🧾 Menunggu')+'</div>');
 }
 chefMenu(){
  const greeting=this.friendsLine('chef');
  const actions=[{label:'🧾 Lihat pesanan warga hari ini',fn:()=>this.restaurantMenu()},
   {label:'📚 Kuis kelompok makanan di perpustakaan',fn:()=>this.libraryGuide()},...RECIPE_IDS.map(id=>({
   label:'📖 Pelajari '+RECIPES[id].name+(knownRecipe(this.state.data,id)?' ✓':''),
   fn:()=>{this.cooking.learn(id);this.refresh();this.chefMenu();this.note('Resep '+RECIPES[id].name+' dipelajari!');}
  }))];
  this.show('👨‍🍳 Chef Bimo',greeting+'\nAyo belajar menu dari hasil kebun! Pilih resep untuk dipelajari.',actions);
 }
 cookStep(step=0){
  const id=this.activeRecipe||'nasi-telur-sayur',recipe=RECIPES[id];
  if(step===3){
   if(!this.cooking.finishRecipe(id))return this.show('Dapur','Resep atau bahan belum lengkap.');
   const forOrder=this.world.restaurantOrders.onCook(id);
   this.missions.record('cook');this.refresh();this.world.playInteraction('cook');
   return this.show('🎉 Masakan berhasil!',recipe.emoji+' '+recipe.name+' selesai! '+
    (forOrder?'Pesanan restoran sudah siap. Antarkan kepada Chef Bimo.':
     id==='nasi-telur-sayur'?'Antarkan ke Bu Sari.':'Poin gizi bertambah!'),[
    ...(forOrder?[{label:'🧾 Lihat tiket pesanan',fn:()=>this.restaurantMenu()}]:[]),
    {label:'Selesai',fn:()=>this.close()}],'<div class="cookstage" style="font-size:48px">'+recipe.emoji+'</div>');
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
  if(id==='plaza')return this.plazaMenu();
  if(id==='townHall')return this.townHallMenu();
  if(id==='mayor')return this.mayorMenu();
  if(id==='arif'||id==='lina')return this.friendMenu(id);
  if(id==='market')return this.market();
  if(id==='store')return this.familyHomeMenu();
  if(id==='village')return this.villageMenu();
  if(id==='library')return this.libraryMenu();
  if(id==='rani')return this.librarianMenu();
  if(id==='garden')return this.gardenMenu();
  if(id==='coop')return this.coopMenu();
  if(id==='pond')return this.pondMenu();
  if(id==='sea-fishing')return this.seaFishingMenu();
  if(id==='boat')return this.boatMenu();
  if(id==='island')return this.islandMenu();
  if(id==='bayu')return this.show('🎣 Nelayan Bayu','Halo! Aku menjaga Pulau Kecil. Cobalah memancing di dermaga dan cari peti harta karun setiap hari.',[
   {label:'🏝️ Jelajahi pulau',fn:()=>this.islandMenu()},
   {label:'Sampai jumpa',fn:()=>this.close()}
  ]);
  if(id==='beach')return this.beachMenu();
  if(id==='tani'||id==='nia')return this.friendMenu(id);
  if(id==='chef')return this.chefMenu();
  if(id==='stove')return this.chooseRecipe();
  if(id==='restaurant-kitchen')return this.chooseRecipe();
  if(id==='npc'){
   const greeting=this.friendsLine('sari');
   if(s.done)return this.show('👩‍🌾 Bu Sari',greeting+'\nTerima kasih! Kamu boleh terus berkebun dan mencoba resep lain.',[
    {label:'🍽️ Belajar Isi Piringku di perpustakaan',fn:()=>this.libraryGuide()},
    {label:'Sampai jumpa',fn:()=>this.close()}
   ]);
   
   if(!s.cooked)return this.show('👩‍🌾 Bu Sari',greeting+'\nTolong buatkan Nasi Telur Sayur. Bahan bisa dibeli atau dipanen dari kebun.',[
    {label:'🍽️ Latihan Isi Piringku',fn:()=>this.startPlate()},
    {label:'Baik, Bu Sari!',fn:()=>this.close()}
   ]);
   if(this.quest.complete()){this.refresh();return this.show('🏆 Quest selesai!',greeting+'\nTerima kasih! Hadiah 50 Koin Ceria telah diterima.');}
  }
  if(id==='bed')return this.bedMenu();
 }
}
