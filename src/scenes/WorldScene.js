import {INTERACTIONS,nearestInteraction,SPAWN,canStand,LAYOUT,DOORS} from '../world/WorldGeometry.js?v=v223-names';
import {createTextures,buildWorld} from '../world/WorldArt.js?v=v223-names';
import {Player} from '../entities/Player.js?v=coast-v118';
import {NPC} from '../entities/NPC.js?v=v176-clean';
import {GardenSystem} from '../systems/GardenSystem.js';
import {GardenArt} from '../world/GardenArt.js';
import {FarmArt} from '../world/FarmArt.js?v=v147-school-pond';
import {AmbientArt} from '../world/AmbientArt.js';
import {DailyLifeSystem} from '../systems/DailyLifeSystem.js';
import {CoastSystem} from '../systems/CoastSystem.js?v=v121-expedition';
import {CoastExpeditionSystem} from '../systems/CoastExpeditionSystem.js';
import {FriendEvents} from '../systems/FriendEvents.js';
import {ActionAnimator,ACTION_DURATION} from '../systems/ActionAnimator.js';
import {SocialSystem} from '../systems/SocialSystem.js?v=v224-friends';
import {MissionSystem} from '../systems/MissionSystem.js';
import {TimeWeatherSystem} from '../systems/TimeWeatherSystem.js?v=v123-time-speed';
import {WeatherArt} from '../world/WeatherArt.js?v=v158-weather-sea-height';
import {rainyRoute,dryReturnRoute,isInsideShelter} from '../world/ShelterRoutes.js';
import {workRoute,rainWorkRoute} from '../world/NpcWorkRoutes.js?v=v123-rain-workers';
import {HomeDecorSystem} from '../systems/HomeDecorSystem.js';
import {HomeDecorArt} from '../world/HomeDecorArt.js';
import {RestaurantOrderSystem} from '../systems/RestaurantOrderSystem.js?v=guests-20261108';
import {RestaurantCustomer} from '../systems/RestaurantCustomer.js?v=v124-customer';
import {FestivalSystem} from '../systems/FestivalSystem.js';
import {TownExpansionArt} from '../world/TownExpansionArt.js?v=v197-townhall';
import {SouthCoastArt} from '../world/SouthCoastArt.js?v=v222-beach-palm';
import {SchoolArt} from '../world/SchoolArt.js?v=v200-classroom';
import {EastHomesArt} from '../world/EastHomesArt.js?v=v210-clinic';
import {residentHomeRoute,residentLeaveHomeRoute,residentHomeActivity,homePosition} from '../world/ResidentHomeRoutes.js';
import {MarineWildlifeArt} from '../world/MarineWildlifeArt.js';
import {MarineEducationSystem} from '../systems/MarineEducationSystem.js';
import {VillageLifeSystem} from '../systems/VillageLifeSystem.js';
import {WeekendVillageSystem} from '../systems/WeekendVillageSystem.js';
import {CommunitySocialSystem} from '../systems/CommunitySocialSystem.js';
import {VillageWeatherDetails} from '../world/VillageWeatherDetails.js?v=v189-soft-dots';
import {MayorMissionSystem} from '../systems/MayorMissionSystem.js';

export class WorldScene extends Phaser.Scene {
 constructor(){super('WorldScene');this.keysHeld=new Set();}
 create(){
  try {
  this.createPlayerTextures=()=>createTextures(this,true);
  createTextures(this);
  const obstacles=buildWorld(this);
  this.garden=new GardenSystem(this.game.state);
  this.clock=new TimeWeatherSystem(this.game.state,this.garden);
  this.gardenArt=new GardenArt(this,this.garden);
  this.dailyLife=new DailyLifeSystem(this.game.state);
  this.coast=new CoastSystem(this.game.state);
  this.coastExpedition=new CoastExpeditionSystem(this.game.state,this.coast);
  this.marineEducation=new MarineEducationSystem(this.game.state);
  this.villageLife=new VillageLifeSystem(this.game.state);
  this.weekendVillage=new WeekendVillageSystem(this.game.state);
  this.communitySocial=new CommunitySocialSystem(this.game.state);
  this.social=new SocialSystem(this.game.state);
  this.friendEvents=new FriendEvents(this.game.state);
  this.missions=new MissionSystem(this.game.state);
  this.decor=new HomeDecorSystem(this.game.state);
  this.restaurantOrders=new RestaurantOrderSystem(this.game.state);
  this.festival=new FestivalSystem(this.game.state);
  this.mayorMissions=new MayorMissionSystem(this.game.state);
  this.decorArt=new HomeDecorArt(this,this.decor);
  this.farmArt=new FarmArt(this);
  this.ambientArt=new AmbientArt(this);
  this.weatherArt=new WeatherArt(this,this.clock);
  this.villageWeatherDetails=new VillageWeatherDetails(this);
  this.townArt=new TownExpansionArt(this,this.festival);
  this.southCoastArt=new SouthCoastArt(this);
  this.eastHomesArt=new EastHomesArt(this);this.schoolArt=new SchoolArt(this);
  this.marineWildlifeArt=new MarineWildlifeArt(this);
  this.player=new Player(this,this.game.state,obstacles);this.activity=new ActionAnimator(this,this.player);
  if(!canStand(this.game.state.data.x,this.game.state.data.y)){
   Object.assign(this.game.state.data,SPAWN);
   this.player.sprite.setPosition(SPAWN.x,SPAWN.y);
   this.game.state.save();
  }
  this.sari=new NPC(this,{x:448,y:281,name:'BU SARI',texture:'sari',stops:[
   {x:448,y:281},{x:410,y:281},{x:410,y:313},{x:448,y:313}
  ]});
  this.chef=new NPC(this,{x:618,y:468,name:'CHEF BIMO',texture:'chef',stops:[
   {x:618,y:468},{x:668,y:468},{x:668,y:505},{x:616,y:505}
  ]});
  // Dua warga baru, hanya berjalan pada jalan setapak yang sudah ada.
  this.tani=new NPC(this,{x:403,y:189,name:'PAK YANTO',texture:'tani',stops:[
   {x:403,y:189},{x:402,y:230},{x:407,y:247},{x:400,y:201}
  ]});
  this.nia=new NPC(this,{x:405,y:317,name:'NIA',texture:'nia',stops:[
   {x:405,y:317},{x:414,y:282},{x:484,y:282},{x:483,y:315}
  ]});
  this.rani=new NPC(this,{x:692,y:207,name:'KAK RANI',texture:'rani',stops:[{x:692,y:207},{x:692,y:186},{x:692,y:207}]});
  this.mayor=new NPC(this,{x:1204,y:180,name:'KEPALA DESA ARIF',texture:'mayor',stops:[{x:1204,y:180}]});
  this.wargaA=new NPC(this,{x:1200,y:452,name:'LINA',texture:'nia',stops:[{x:1200,y:452}]});
  this.wargaB=new NPC(this,{x:1080,y:471,name:'ARIF',texture:'tani',stops:[{x:1080,y:471}]});
  // Staf puskesmas dan warga pasien bergerak sesuai fase waktu.
  this.clinicDoctor=new NPC(this,{x:1520,y:450,name:'DOKTER MAYA',texture:'rani',stops:[{x:1520,y:450}]});
  this.clinicNurse=new NPC(this,{x:1460,y:410,name:'PERAWAT MAYA',texture:'sari',stops:[{x:1460,y:410}]});
  this.clinicPatient=new NPC(this,{x:1530,y:385,name:'DIMAS',texture:'tani',stops:[{x:1530,y:385}]});
  // Semua petugas/pasien menggunakan collision yang sama dengan pemain.
  for(const npc of [this.clinicDoctor,this.clinicNurse,this.clinicPatient])npc.walkable=(x,y)=>canStand(x,y);
  this.schoolTeacher=new NPC(this,{x:839,y:106,name:'BU GURU LIA',texture:'rani',stops:[{x:839,y:106}]});
  this.schoolStudents=[
   new NPC(this,{x:1420,y:247,name:'SELA',texture:'nia',stops:[{x:1420,y:247}]}),
   new NPC(this,{x:1530,y:247,name:'REFAL',texture:'tani',stops:[{x:1530,y:247}]})
  ];
  for(const npc of [this.schoolTeacher,...this.schoolStudents])npc.walkable=(x,y)=>canStand(x,y);
  this.schoolRoutineKey='';
  this.clinicRoutineKey='';
  this.restaurantCustomer=new RestaurantCustomer(this);
  this.beachVisitors=[
   new NPC(this,{x:430,y:652,name:'MAWAR',texture:'nia',stops:[{x:430,y:652},{x:530,y:652},{x:560,y:684},{x:430,y:652}]}),
   new NPC(this,{x:955,y:662,name:'PEJALAN PANTAI',texture:'tani',stops:[{x:955,y:662},{x:1000,y:682},{x:935,y:677},{x:955,y:662}]})
  ];
  for(const visitor of this.beachVisitors)visitor.walkable=(x,y)=>canStand(x,y);
  this.fisherman=new NPC(this,{x:1120,y:778,name:'NELAYAN DINO',texture:'tani',stops:[
   {x:1120,y:778,activity:'🎣 Memeriksa jala',pause:2},{x:1080,y:775},{x:1060,y:786,activity:'🐚 Mencari kerang',pause:2},{x:1120,y:778}
  ]});
  this.fisherman.walkable=(x,y)=>canStand(x,y);
  this.zones=[...INTERACTIONS,
   ...[['lia','Bu Guru Lia'],['sela','Sela'],['refal','Refal'],['nurse','Perawat Maya'],['doctor','Dokter Maya'],['dimas','Dimas']].map(([id,label])=>({id,x:0,y:0,r:30,label}))
  ];
  this.guide=this.add.text(0,0,'',{fontFamily:'monospace',fontSize:'13px',color:'#ffffff',
   backgroundColor:'#557d57',padding:{x:6,y:4}}).setOrigin(.5).setDepth(1600);
  this.prompt=this.add.text(0,0,'',{fontFamily:'monospace',fontSize:'13px',color:'#446047',
   backgroundColor:'#fff4d5',padding:{x:7,y:4}}).setOrigin(.5).setDepth(1500);
  const keyMap={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',
    w:'up',a:'left',s:'down',d:'right'};
  this.input.keyboard.on('keydown',e=>{
   const key=keyMap[e.key]||keyMap[e.key.toLowerCase()];
   if(key){e.preventDefault();this.keysHeld.add(key);}
   if(e.key.toLowerCase()==='e'&&!e.repeat){e.preventDefault();this.game.events.emit('action');}
   if(e.key==='Escape')this.game.events.emit('close-dialog');
  });
  this.input.keyboard.on('keyup',e=>{
   const key=keyMap[e.key]||keyMap[e.key.toLowerCase()];
   if(key)this.keysHeld.delete(key);
  });
  window.addEventListener('blur',()=>this.keysHeld.clear());
  // Area di luar tepi peta saat zoom out menggunakan warna daratan, bukan biru laut.
   this.cameras.main.setBackgroundColor('#a4cd91');
  this.cameras.main.setBounds(0,0,1720,1200);
  this.cameras.main.startFollow(this.player.sprite,true,.12,.12);
  this.cameras.main.setZoom(1);
  // Geser peta dengan drag mouse / sentuhan pada area permainan.
  // Tidak mengubah posisi pemain atau progres yang tersimpan.
  this.mapDrag=null;
  this.mapDragDetached=false;
  const cam=this.cameras.main;
  this.input.on('pointerdown',pointer=>{
   if(this.game.dialogOpen||pointer.button!==0)return;
   this.mapDrag={id:pointer.id,x:pointer.x,y:pointer.y,moved:false};
  });
  this.input.on('pointermove',pointer=>{
   const drag=this.mapDrag;
   if(!drag||drag.id!==pointer.id||!pointer.isDown)return;
   const dx=pointer.x-drag.x,dy=pointer.y-drag.y;
   if(!drag.moved&&Math.hypot(dx,dy)<5)return;
   if(!drag.moved){cam.stopFollow();this.mapDragDetached=true;drag.moved=true;}
   // Batasi geser agar kamera tidak memperlihatkan area di luar peta.
   const viewW=cam.width/cam.zoom,viewH=cam.height/cam.zoom;
   cam.scrollX=Phaser.Math.Clamp(cam.scrollX-dx/cam.zoom,0,Math.max(0,1720-viewW));
   cam.scrollY=Phaser.Math.Clamp(cam.scrollY-dy/cam.zoom,0,Math.max(0,1200-viewH));
   drag.x=pointer.x;drag.y=pointer.y;
  });
  const release=pointer=>{if(this.mapDrag?.id===pointer.id)this.mapDrag=null;};
  this.input.on('pointerup',release);
  this.input.on('pointerupoutside',release);
  // Klik dua kali pada peta untuk kembali mengikuti karakter.
  this.input.on('pointerdown',pointer=>{
   if(pointer.button!==0||this.game.dialogOpen)return;
   const now=this.time.now;
   if(this.lastMapClick&&now-this.lastMapClick<320){
    cam.startFollow(this.player.sprite,true,.12,.12);
    this.mapDragDetached=false;
   }
   this.lastMapClick=now;
  });
  this.game.events.emit('world-ready',this);
  this.scene.launch('UIScene');
  } catch(error) {
   console.error('Kampung Gizi Ceria: world create failed',error);
   window.dispatchEvent(new ErrorEvent('error',{message:'WorldScene: '+(error?.stack||error),error}));
   throw error;
  }
 }
 playInteraction(kind){
  if(Object.hasOwn(ACTION_DURATION,kind))return this.activity.play(kind);
  const subject=this.npcById(kind)?.sprite||this.player.sprite;
  if(!subject?.active)return;
  const x=subject.x,y=subject.y;
  this.tweens.killTweensOf(subject);
  subject.setScale(1);
  this.tweens.add({targets:subject,scaleX:1.12,scaleY:.88,duration:110,yoyo:true,
   ease:'Sine.easeOut',onComplete:()=>subject.setScale(1)});
  const emoji={stove:'🍳',market:'🧺',bed:'💤',chef:'📖',garden:'🌱',
   coop:'🥚',store:'🏡',village:'🏡',npc:'✨',tani:'🌱',nia:'💬',library:'📚',rani:'📖',mayor:'🏛️',plaza:'🎪',townHall:'🏛️'}[kind]||'✨';
  const puff=this.add.text(x,y-47,emoji,{fontSize:'22px'}).setOrigin(.5).setDepth(2200);
  this.tweens.add({targets:puff,y:y-77,alpha:0,duration:650,
   ease:'Sine.easeOut',onComplete:()=>puff.destroy()});
 }
 npcById(id){
  return ({npc:this.sari,chef:this.chef,tani:this.tani,nia:this.nia,rani:this.rani,mayor:this.mayor,arif:this.wargaB,lina:this.wargaA,lia:this.schoolTeacher,sela:this.schoolStudents[0],refal:this.schoolStudents[1],dino:this.fisherman,nurse:this.clinicNurse,doctor:this.clinicDoctor,dimas:this.clinicPatient})[id]||null;
 }
 updateRoutines(){
  const phase=this.clock.phase,day=this.game.state.data.day;
  const raining=this.clock.weather==='Hujan';
  this.phaseIndex=phase;
  this.dailyPhase=this.clock.description.phase;
  // Saat hujan, rute tidak direset ketika jam berubah: NPC harus benar-benar
  // mencapai interior, kemudian berhenti di sana sampai hujan usai.
  const niaSheltering=raining||phase===3;
  // Sertakan fase juga ketika hujan agar transisi malam -> pagi tidak tertahan.
  const key=day+'-'+phase+'-'+this.clock.weather;
  const leavingNiaShelter=this.niaSheltering===true&&!niaSheltering;
  this.niaSheltering=niaSheltering;
  if(this.routineKey===key)return;
  // Rute pintu Balai Kota -> jalan utama -> alun-alun; tidak melintasi dinding.
  const hallToSquare=[{x:1155,y:208},{x:1155,y:238},{x:1155,y:281},
   {x:1155,y:345},{x:1155,y:395}];
  const squareToHall=[{x:1155,y:345},{x:1155,y:281},{x:1155,y:238},
   {x:1155,y:208},{x:1204,y:180}];
  const mayorInside=this.mayor.x>=1025&&this.mayor.x<=1285&&this.mayor.y<238;
  const mayorOutside=this.mayor.y>238;
  const mayorRoute=(raining||phase===3)?
   (mayorInside?[{x:1204,y:180,activity:'🏛️ Administrasi',pause:2}]:
    [...squareToHall,{x:1204,y:180,activity:'🏛️ Administrasi',pause:2}]):
   [{x:1204,y:180},...hallToSquare.map((p,i)=>i===4?{...p,activity:this.festival.active?'🎉 Memimpin festival':'🌳 Menyapa warga',pause:2}:p),
    ...squareToHall];
  this.mayor.setRoutine(mayorRoute,'KEPALA DESA ARIF',!raining&&phase!==3);
  const sheltered=raining||phase===3;
  const socialVisit=!sheltered&&phase===2&&day%3===1;
  const weekend=this.weekendVillage.event;
  const plazaLoopA=[{x:1200,y:452,activity:this.festival.active?'🎪 Menonton lomba':weekend?'🎈 Kegiatan akhir pekan':socialVisit?'💬 Menyapa Arif':'🤸 Senam',pause:2},
   {x:1200,y:480},{x:1245,y:480,activity:'🌳 Bersantai',pause:2},{x:1245,y:452}];
  const plazaLoopB=[{x:1080,y:471,activity:this.festival.active?'🥗 Menyiapkan stan':weekend?'🧺 Membantu acara warga':socialVisit?'💬 Menyapa Lina':'🧹 Merawat taman',pause:2},
   {x:1080,y:500},{x:1110,y:500},{x:1110,y:471}];
  const shelterRoute=(npc,destination)=>{
   if(npc.y<238&&npc.x>=1025)return [{x:destination,y:180,activity:'🏛️ Berteduh',pause:3}];
   const points=[];
   // Keluar dari alun-alun lewat jalur tengah, kemudian masuk melalui pintu.
   if(npc.y>345)points.push({x:1155,y:npc.y},{x:1155,y:345});
   points.push({x:1155,y:281},{x:1155,y:238},{x:1155,y:208},
    {x:destination,y:180,activity:'🏛️ Berteduh',pause:3});
   return points;
  };
  const toPlaza=npc=>{
   if(npc.y<238)return [{x:1155,y:208},{x:1155,y:238},{x:1155,y:281},{x:1155,y:345}];
   if(npc.y<345)return [{x:1155,y:345}];
   return [];
  };
  if(socialVisit){
   // Bertemu dan menyapa di jalan Alun-Alun, bukan berjalan di tempat.
   plazaLoopA.push({x:1155,y:452,activity:'👋 Halo Arif!',pause:2},{x:1200,y:452});
   plazaLoopB.push({x:1155,y:471,activity:'👋 Halo Lina!',pause:2},{x:1080,y:471});
  }
  // v1.26: Lina dan Arif pulang ke rumah sendiri saat hujan/malam,
  // lalu keluar lewat pintu dan kembali bekerja di Alun-Alun saat pagi.
  for(const [id,npc,label,loop] of [
   ['lina',this.wargaA,'LINA',plazaLoopA],
   ['arif',this.wargaB,'ARIF',plazaLoopB]]){
   const visitFriend=!sheltered&&phase===2&&((id==='arif'&&day%3===2)||(id==='lina'&&day%3===0));
   const friend=id==='arif'?'lina':'arif',friendHome=homePosition(friend);
   const friendVisitRoute=visitFriend?[{x:1155,y:452},{x:1155,y:345},{x:1155,y:281},
    {x:friendHome.x,y:281},{x:friendHome.x,y:247},{x:friendHome.x,y:220},
    {...friendHome,activity:'🏡 Berkunjung ke '+(friend==='lina'?'Lina':'Arif'),pause:3},
    {x:friendHome.x,y:220},{x:friendHome.x,y:247},{x:friendHome.x,y:281},
    {x:1155,y:281},{x:1155,y:345}]:[];
   const home=homePosition(id),inside=npc.x>home.x-48&&npc.x<home.x+48&&npc.y<235;
   const activity=residentHomeActivity(id,phase,raining);
   if(sheltered){
    npc.setRoutine(inside?[{...home,activity,pause:3}]:residentHomeRoute(id,npc,activity),label,false);
   }else{
    const prefix=inside?residentLeaveHomeRoute(id):toPlaza(npc);
    npc.setRoutine([...prefix,...friendVisitRoute,...loop],label,true);
   }
  }
  const justStoppedRaining=this.lastRaining===true&&!raining&&phase!==3;
  this.lastRaining=raining;
  this.routineKey=key;
  // Nia juga tinggal di kawasan timur. Hujan/malam: pulang ke rumah.
  // Saat pagi: keluar dari rumah melalui jalan timur sebelum kembali bekerja.
  const niaHome=homePosition('nia');
  const niaInside=this.nia.x>niaHome.x-48&&this.nia.x<niaHome.x+48&&this.nia.y<235;
  if(niaSheltering){
   this.nia.setRoutine(niaInside?[{...niaHome,activity:residentHomeActivity('nia',phase,raining),pause:3}]:
    residentHomeRoute('nia',this.nia,residentHomeActivity('nia',phase,raining)),'NIA',false);
   this.nia.nextJobRoute=null;
  }
  if(raining){
   // A villager already inside a shelter stays inside; villagers at work
   // leave through their current building's door before taking the road.
   for(const [id,npc,label] of [['sari',this.sari,'BU SARI'],
    ['tani',this.tani,'PAK YANTO']]){
    let prefix=[];
    if(isInsideShelter(id,npc)){
     npc.setRoutine([{x:npc.x,y:npc.y}],label,false);
     npc.nextJobRoute=null;
     continue;
    }
    if((id==='sari'||id==='nia')&&npc.x<393&&npc.y>=340)
     prefix=[{x:211,y:339},{x:211,y:318}];
    else if(id==='sari'&&npc.x>=500&&npc.x<=714&&npc.y>=339)
     prefix=[{x:607,y:339},{x:607,y:319},{x:448,y:281}];
    else if(id==='nia'&&npc.x>=500&&npc.x<=714&&npc.y<239)
     prefix=[{x:608,y:208},{x:608,y:237},{x:608,y:281}];
    npc.setRoutine([...prefix,...rainyRoute(id)],label,false);
    npc.nextJobRoute=null;
   }
   this.chef.setRoutine(rainWorkRoute('chef'),'',false);
   this.rani.setRoutine(rainWorkRoute('rani'),'KAK RANI',false);
   return;
  }
  if(justStoppedRaining){
   this.sari.nextJobRoute=null;this.tani.nextJobRoute=null;this.nia.nextJobRoute=null;
   this.sari.setRoutine(dryReturnRoute('sari',this.sari),'BU SARI',false);
   this.tani.setRoutine(dryReturnRoute('tani',this.tani),'PAK YANTO',false);
   if(niaInside)this.nia.setRoutine([...residentLeaveHomeRoute('nia'),...workRoute('nia',phase)],'NIA',false);
   // Setelah hujan, kembali ke rute kerja sesuai fase saat ini.
   // Jangan mengulang rute pendek yang membuat NPC terlihat mondar-mandir.
   this.chef.setRoutine(workRoute('chef',phase),'',phase!==3);
   this.rani.setRoutine(workRoute('rani',phase),'KAK RANI',phase!==3);
   return;
  }
  // v1.9: jalur kerja melewati pintu yang sama dengan pemain dan
  // berhenti di pos kegiatan (kebun, pasar, dapur, perpustakaan).
  for(const [id,npc] of [['sari',this.sari],['tani',this.tani],
   ['nia',this.nia],['chef',this.chef],['rani',this.rani]]){
   if(id==='nia'&&niaSheltering)continue;
   // Festival diselenggarakan hanya di alun-alun; rutinitas kerja lama tetap berjalan.
   const route=workRoute(id,phase);
   let prefix=[];
   if(id==='nia'&&niaInside){
    prefix=residentLeaveHomeRoute('nia');
   }else if(id==='nia'&&leavingNiaShelter&&isInsideShelter('nia',npc)){
    prefix=dryReturnRoute('nia',npc);
   }else if((id==='sari'||id==='tani')&&npc.x>817&&npc.y>340){
    prefix=dryReturnRoute(id,npc);
   }else if((id==='sari'||id==='nia')&&npc.x<392&&npc.y>340){
    prefix=[{x:211,y:339},{x:211,y:318},
     {x:id==='sari'?448:405,y:id==='sari'?281:317}];
   }else if(id==='sari'&&npc.x>500&&npc.x<714&&npc.y>339){
    prefix=[{x:607,y:339},{x:607,y:319},{x:448,y:281}];
   }else if(id==='nia'&&npc.x>500&&npc.x<714&&npc.y<239){
    prefix=[{x:608,y:208},{x:608,y:237},{x:608,y:281},{x:448,y:281},{x:405,y:317}];
   }
   const label=({sari:'BU SARI',tani:'PAK YANTO',nia:'NIA',chef:'CHEF BIMO',rani:'KAK RANI'})[id];
   if(prefix.length){
    npc.setRoutine([...prefix,...route],label,false);
    npc.nextJobRoute={route,label};
   }else{
    npc.setRoutine(route,label,phase!==3);
    npc.nextJobRoute=null;
   }
  }
  this.phaseIndex=phase;
  this.dailyPhase=this.clock.description.phase;
 }
 highlightPlace(id){
  const markers={
   library:{x:650,y:130,title:'📚 PERPUSTAKAAN GIZI',yLabel:75},
   coop:{x:325,y:194,title:'🐔 TERNAK · SEBELAH RUMAH',yLabel:248},
   school:{x:868,y:145,title:'🏫 SEKOLAH GIZI',yLabel:263},
   plaza:{x:1164,y:427,title:'🌳 ALUN-ALUN KAMPUNG',yLabel:360},
   townHall:{x:1155,y:180,title:'🏛️ BALAI KOTA',yLabel:95},
   festival:{x:1164,y:395,title:'🎉 FESTIVAL · ALUN-ALUN',yLabel:310}
  };
  if(id==='plaza'||id==='townHall'||id==='festival')return;
  const p=markers[id];if(!p)return;
  this.keysHeld.clear();
  if(this.landmarkCircle){this.tweens.killTweensOf(this.landmarkCircle);this.landmarkCircle.destroy();}
  if(this.landmarkLabel){this.tweens.killTweensOf(this.landmarkLabel);this.landmarkLabel.destroy();}
  this.landmarkCircle=this.add.circle(p.x,p.y,56,0xffe49c,.23).setStrokeStyle(6,0xfff1a6).setDepth(2000);
  this.landmarkLabel=this.add.text(p.x,p.yLabel,p.title,{fontFamily:'monospace',fontSize:'12px',
   fontStyle:'bold',color:'#31402e',backgroundColor:'#fff1b1',padding:{x:7,y:5}}).setOrigin(.5).setDepth(2001);
  this.tweens.add({targets:this.landmarkCircle,scale:1.3,alpha:0,duration:2100,
   onComplete:()=>{this.landmarkCircle?.destroy();this.landmarkCircle=null;}});
  this.tweens.add({targets:this.landmarkLabel,alpha:0,delay:1700,duration:500,
   onComplete:()=>{this.landmarkLabel?.destroy();this.landmarkLabel=null;}});
 }
 getNearest(){
  const d=this.game.state.data;
  const bayuNear=Math.hypot(d.x-this.fisherman.x,d.y-this.fisherman.y)<34;
  if(bayuNear)return 'bayu';
  return nearestInteraction(d,this.zones.map(z=>{
   const npc=this.npcById(z.id);
   return npc?{...z,x:npc.x,y:npc.y}:z;
  }))?.id??null;
 }
 getGoal(){
  const s=this.game.state.data;
  if(s.done)return null;
  if(s.cooked)return {x:this.sari.x,y:this.sari.y,label:'Bu Sari'};
  if(!s.recipeKnown)return {x:618,y:454,label:'Restoran'};
  const missing=['beras','telur','bayam'].filter(id=>(s.inventory[id]||0)<1);
  if(missing.includes('beras'))return {x:208,y:333,label:'Pasar'};
  if(missing.includes('telur')){
   const status=this.dailyLife.status;
   return status.eggsCollected?{x:208,y:333,label:'Pasar'}:{x:326,y:236,label:'Ternak'};
  }
  if(missing.includes('bayam')){
   const plots=this.garden.view.plots;
   const waiting=plots.some(p=>p.stage==='growing')&&!plots.some(p=>p.stage==='ready'||p.stage==='dry'||p.stage==='empty');
   if(waiting)return {x:140,y:222,label:'Tidur di rumah'};
   if(this.garden.view.seeds>0||plots.some(p=>p.stage!=='empty'))return {x:322,y:139,label:'Kebun'};
   return {x:208,y:333,label:'Pasar'};
  }
  return {x:193,y:162,label:'Kompor'};
 }
 update(_time,delta){
  const changed=this.clock.advance(this.game.dialogOpen?0:delta);
  this.gardenArt.render();this.farmArt.update(this.time.now);
  this.ambientArt.update(this.time.now);this.weatherArt.update(this.time.now,changed);this.villageWeatherDetails.update(this.time.now,this.clock.weather,this.clock.phase);this.townArt.update(this.time.now);this.updateRoutines();
  // Sekolah: berangkat melalui jalan utama, masuk lewat pintu utara,
  // belajar, bermain di alun-alun, lalu kembali ke rumah saat malam.
  const schoolShelter=this.clock.weather==='rain'||this.clock.weather==='hujan'||this.clock.phase>=2;
  const schoolKey=this.game.state.data.day+'-'+this.clock.phase+'-'+schoolShelter;
  if(this.schoolRoutineKey!==schoolKey){
   this.schoolRoutineKey=schoolKey;
   const schoolOpen=!schoolShelter&&(this.clock.phase===0||this.clock.phase===1);
   this.schoolTeacher.setRoutine(schoolOpen?[
    {x:839,y:106,activity:'📚 Mengajar gizi',pause:3},
    {x:854,y:106,activity:'🧼 Mengajar kebersihan',pause:3},
    {x:839,y:106}
   ]:[{x:839,y:106,activity:'📚 Menyiapkan materi',pause:3}],'BU GURU LIA',schoolOpen);
   this.schoolStudents.forEach((npc,i)=>{
    const homeX=i===0?1420:1530;
    const schoolRoute=[{x:homeX,y:247},{x:homeX,y:281},{x:1340,y:281},{x:960,y:281},{x:868,y:281},{x:868,y:250},{x:868,y:222},{x:868,y:195},{x:850+i*36,y:169,activity:'✏️ Belajar',pause:3},{x:868,y:195},{x:868,y:250},{x:868,y:281},{x:960,y:281},{x:1340,y:281},{x:homeX,y:281},{x:homeX,y:247}];
    // Berteduh dan istirahat di dalam rumah Pak Yanto dan Bu Sari saat hujan/sore/malam.
    const shelterRoute=[{x:868,y:250},{x:868,y:281},{x:868,y:322},{x:869,y:353},{x:848+i*38,y:374,activity:'🏡 Istirahat / berteduh',pause:3}];
    npc.setRoutine(schoolOpen?schoolRoute:shelterRoute,i===0?'SELA':'REFAL',schoolOpen);
   });;
  }
  const clinicOpen=this.clock.phase!==3;
  const clinicKey=this.game.state.data.day+'-'+this.clock.phase;
  if(this.clinicRoutineKey!==clinicKey){
   this.clinicRoutineKey=clinicKey;
   this.clinicDoctor.setRoutine(clinicOpen?[
    {x:1520,y:450,activity:'🩺 Memeriksa pasien',pause:2},
    {x:1580,y:450,activity:'📋 Mencatat hasil',pause:2},
    {x:1580,y:495},{x:1520,y:495}
   ]:[{x:1520,y:450,activity:'🌙 Puskesmas tutup',pause:3}],'DOKTER MAYA',clinicOpen);
   this.clinicNurse.setRoutine(clinicOpen?[
    {x:1460,y:410,activity:'📋 Pendaftaran',pause:2},
    {x:1480,y:410},{x:1480,y:460,activity:'💊 Menyiapkan obat',pause:2},
    {x:1460,y:460}
   ]:[{x:1460,y:410,activity:'🌙 Istirahat',pause:3}],'PERAWAT MAYA',clinicOpen);
   // Rute wajib melalui pintu utara (1530,345), bukan menembus dinding.
   // Masuk -> daftar -> tunggu -> periksa -> keluar lewat pintu yang sama.
   // Pasien tetap berada di Puskesmas: antre -> diperiksa -> istirahat.
   // Tidak lagi berjalan pulang keluar bangunan pada akhir siklus.
   this.clinicPatient.setRoutine([
    {x:1530,y:385,activity:'📋 Menunggu pendaftaran',pause:3},
    {x:1530,y:455},
    {x:1470,y:475,activity:'🪑 Menunggu giliran',pause:5},
    {x:1530,y:455},
    {x:1565,y:455,activity:'🩺 Diperiksa dokter',pause:5},
    {x:1530,y:455},
    {x:1530,y:385,activity:'🏥 Menunggu di Puskesmas',pause:4}
   ],'DIMAS',true);
  }
  if(!this.game.dialogOpen){
   const dt=Math.min(delta/1000,.05);
   this.schoolTeacher.update(dt);for(const student of this.schoolStudents)student.update(dt);
   this.clinicDoctor.update(dt);this.clinicNurse.update(dt);this.clinicPatient.update(dt);
   if(!this.activity.active)this.player.update(dt,this.keysHeld);
   this.sari.update(dt);this.chef.update(dt);
   this.tani.update(dt);this.nia.update(dt);this.rani.update(dt);this.mayor.update(dt);this.wargaA.update(dt);this.wargaB.update(dt);this.restaurantCustomer.update(dt);
   // Rute pengunjung melalui jalan kampung dan pintu bangunan saat hujan/malam.
   const beachOpen=this.clock.weather!=='Hujan'&&this.clock.phase!==3;
   if(this.beachRoutineOpen!==beachOpen){
    this.beachRoutineOpen=beachOpen;
    this.beachVisitors.forEach((visitor,i)=>{
     // Kedua pengunjung pantai berlindung di Balai Kota saat hujan/malam.
     // Pejalan Pantai menuju Balai Kota melalui pintu selatan (1155,238).
     const shelter=i===0?
      [{x:430,y:585},{x:448,y:585},{x:448,y:281},{x:960,y:281},{x:1155,y:281},{x:1155,y:245},{x:1155,y:210}]:
      [{x:955,y:585},{x:960,y:585},{x:960,y:281},{x:1155,y:281},{x:1155,y:245},{x:1155,y:210}];
     const leisure=i===0?
      [{x:430,y:652},{x:530,y:652,activity:'🏖️ Bermain pasir',pause:2},{x:560,y:684},{x:430,y:652}]:
      [{x:955,y:662},{x:1000,y:682,activity:'🐚 Mengamati kerang',pause:2},{x:935,y:677},{x:955,y:662}];
     const sheltered=visitor.x>1025&&visitor.x<1285&&visitor.y>65&&visitor.y<238;
     const leave=sheltered?[...shelter.slice(0,-1).reverse(),leisure[0]]:[leisure[0]];
     const route=beachOpen?[...leave,...leisure]:shelter.map((point,j)=>j===shelter.length-1?
      {...point,activity:'🏛️ Istirahat / berteduh di Balai Kota',pause:3}:point);
     visitor.setRoutine(route,visitor.name,beachOpen);
    });
   }
   for(const visitor of this.beachVisitors)visitor.update(dt);
   // Nelayan Dino pulang ke Rumah Lina saat hujan atau malam.
   // Rute melalui jalan kampung, bukan memotong rumah atau laut.
   const fisherShelter=this.clock.weather==='Hujan'||this.clock.weather==='hujan'||this.clock.weather==='rain'||this.clock.phase===3;
   if(this.fisherShelter!==fisherShelter){
    this.fisherShelter=fisherShelter;
    const atLina=this.fisherman.x>=1590&&this.fisherman.x<=1690&&this.fisherman.y<235;
    const atCoast=this.fisherman.y>600;
    const toLina=[
     ...(atCoast?[{x:1120,y:778},{x:1120,y:600},{x:1155,y:585}]:[]),
     {x:1155,y:345},{x:1155,y:281},{x:1640,y:281},
     {x:1640,y:247},{x:1640,y:220},
     {x:1640,y:201,activity:'🏡 Istirahat / berteduh di Rumah Lina',pause:4}
    ];
    const toBeach=[
     ...(atLina?[{x:1640,y:220},{x:1640,y:247},{x:1640,y:281}]:[]),
     {x:1155,y:281},{x:1155,y:345},{x:1155,y:585},{x:1120,y:600},
     {x:1120,y:778,activity:'🎣 Memeriksa jala',pause:2},
     {x:1080,y:775},{x:1060,y:786,activity:'🐚 Mencari kerang',pause:2},{x:1120,y:778}
    ];
    this.fisherman.setRoutine(fisherShelter?(atLina?[toLina[toLina.length-1]]:toLina):toBeach,'NELAYAN DINO',!fisherShelter);
   }
   this.fisherman.update(dt);

   // Once a villager has exited an interior through its door, begin the
   // normal repeating workday without teleporting or cutting across walls.
   for(const npc of [this.sari,this.tani,this.nia,this.chef,this.rani,this.mayor]){
    if(npc.finished&&npc.nextJobRoute){
     const {route,label}=npc.nextJobRoute;
     npc.nextJobRoute=null;npc.setRoutine(route,label,true);
    }
   }
  }
  const id=this.getNearest();
  this.prompt.setVisible(!!id&&!this.game.dialogOpen);
  if(id){
   const z=this.zones.find(q=>q.id===id)||{id:'bayu',label:'Nelayan Dino',x:this.fisherman.x,y:this.fisherman.y};
   const npc=id==='bayu'?this.fisherman:this.npcById(id);
   this.prompt.setPosition(npc?npc.x:z.x,(npc?npc.y:z.y)-63);
   this.prompt.setText('E / AKSI · '+z.label);
  }
  const goal=this.getGoal();
  if(this.game.dialogOpen||!goal){this.guide.setVisible(false);return;}
  const s=this.game.state.data,dx=goal.x-s.x,dy=goal.y-s.y,d=Math.hypot(dx,dy);
  const arrow=Math.abs(dx)>Math.abs(dy)?(dx<0?'←':'→'):(dy<0?'↑':'↓');
  this.guide.setVisible(d>105&&!id);
  if(d>105&&!id)this.guide.setText(arrow+' '+goal.label).setPosition(
   Phaser.Math.Clamp(s.x,75,1260),Phaser.Math.Clamp(s.y-61,24,548));
 }
}
