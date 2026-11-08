import {INTERACTIONS,nearestInteraction,SPAWN,canStand,LAYOUT,DOORS} from '../world/WorldGeometry.js';
import {createTextures,buildWorld} from '../world/WorldArt.js';
import {Player} from '../entities/Player.js';
import {NPC} from '../entities/NPC.js';
import {GardenSystem} from '../systems/GardenSystem.js';
import {GardenArt} from '../world/GardenArt.js';
import {FarmArt} from '../world/FarmArt.js';
import {AmbientArt} from '../world/AmbientArt.js';
import {DailyLifeSystem} from '../systems/DailyLifeSystem.js';
import {ActionAnimator,ACTION_DURATION} from '../systems/ActionAnimator.js';
import {SocialSystem} from '../systems/SocialSystem.js';
import {MissionSystem} from '../systems/MissionSystem.js';
import {TimeWeatherSystem} from '../systems/TimeWeatherSystem.js';
import {WeatherArt} from '../world/WeatherArt.js';
import {rainyRoute,dryReturnRoute,isInsideShelter} from '../world/ShelterRoutes.js';
import {workRoute} from '../world/NpcWorkRoutes.js';
import {HomeDecorSystem} from '../systems/HomeDecorSystem.js';
import {HomeDecorArt} from '../world/HomeDecorArt.js';
import {RestaurantOrderSystem} from '../systems/RestaurantOrderSystem.js';
import {RestaurantCustomer} from '../systems/RestaurantCustomer.js';
import {FestivalSystem} from '../systems/FestivalSystem.js';
import {TownExpansionArt} from '../world/TownExpansionArt.js?v=terrain-20261108';
import {MayorMissionSystem} from '../systems/MayorMissionSystem.js';

export class WorldScene extends Phaser.Scene {
 constructor(){super('WorldScene');this.keysHeld=new Set();}
 create(){
  createTextures(this);
  const obstacles=buildWorld(this);
  this.garden=new GardenSystem(this.game.state);
  this.clock=new TimeWeatherSystem(this.game.state,this.garden);
  this.gardenArt=new GardenArt(this,this.garden);
  this.dailyLife=new DailyLifeSystem(this.game.state);
  this.social=new SocialSystem(this.game.state);
  this.missions=new MissionSystem(this.game.state);
  this.decor=new HomeDecorSystem(this.game.state);
  this.restaurantOrders=new RestaurantOrderSystem(this.game.state);
  this.festival=new FestivalSystem(this.game.state);
  this.mayorMissions=new MayorMissionSystem(this.game.state);
  this.decorArt=new HomeDecorArt(this,this.decor);
  this.farmArt=new FarmArt(this);
  this.ambientArt=new AmbientArt(this);
  this.weatherArt=new WeatherArt(this,this.clock);
  this.townArt=new TownExpansionArt(this,this.festival);
  this.player=new Player(this,this.game.state,obstacles);this.activity=new ActionAnimator(this,this.player);
  if(!canStand(this.game.state.data.x,this.game.state.data.y)){
   Object.assign(this.game.state.data,SPAWN);
   this.player.sprite.setPosition(SPAWN.x,SPAWN.y);
   this.game.state.save();
  }
  this.sari=new NPC(this,{x:448,y:281,name:'BU SARI',texture:'sari',stops:[
   {x:448,y:281},{x:410,y:281},{x:410,y:313},{x:448,y:313}
  ]});
  this.chef=new NPC(this,{x:618,y:468,name:'',texture:'chef',stops:[
   {x:618,y:468},{x:668,y:468},{x:668,y:505},{x:616,y:505}
  ]});
  // Dua warga baru, hanya berjalan pada jalan setapak yang sudah ada.
  this.tani=new NPC(this,{x:403,y:189,name:'PAK TANI',texture:'tani',stops:[
   {x:403,y:189},{x:402,y:230},{x:407,y:247},{x:400,y:201}
  ]});
  this.nia=new NPC(this,{x:405,y:317,name:'NIA',texture:'nia',stops:[
   {x:405,y:317},{x:414,y:282},{x:484,y:282},{x:483,y:315}
  ]});
  this.rani=new NPC(this,{x:692,y:207,name:'KAK RANI',texture:'rani',stops:[{x:692,y:207},{x:692,y:186},{x:692,y:207}]});
  this.mayor=new NPC(this,{x:1204,y:180,name:'KEPALA DESA',texture:'mayor',stops:[{x:1204,y:180}]});
  this.wargaA=new NPC(this,{x:1200,y:452,name:'WARGA LINA',texture:'nia',stops:[{x:1200,y:452}]});
  this.wargaB=new NPC(this,{x:1080,y:471,name:'WARGA ARIF',texture:'tani',stops:[{x:1080,y:471}]});
  this.restaurantCustomer=new RestaurantCustomer(this);
  this.zones=INTERACTIONS;
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
  this.cameras.main.setBounds(0,0,1340,600);
  this.cameras.main.startFollow(this.player.sprite,true,.12,.12);
  this.cameras.main.setZoom(1);
  this.game.events.emit('world-ready',this);
  this.scene.launch('UIScene');
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
   coop:'🥚',pond:'🎣',store:'🏡',village:'🏡',npc:'✨',tani:'🌱',nia:'💬',library:'📚',rani:'📖',mayor:'🏛️',plaza:'🎪',townHall:'🏛️'}[kind]||'✨';
  const puff=this.add.text(x,y-47,emoji,{fontSize:'22px'}).setOrigin(.5).setDepth(2200);
  this.tweens.add({targets:puff,y:y-77,alpha:0,duration:650,
   ease:'Sine.easeOut',onComplete:()=>puff.destroy()});
 }
 npcById(id){
  return ({npc:this.sari,chef:this.chef,tani:this.tani,nia:this.nia,rani:this.rani,mayor:this.mayor,arif:this.wargaB,lina:this.wargaA})[id]||null;
 }
 updateRoutines(){
  const phase=this.clock.phase,day=this.game.state.data.day;
  const raining=this.clock.weather==='Hujan';
  this.phaseIndex=phase;
  this.dailyPhase=this.clock.description.phase;
  // Saat hujan, rute tidak direset ketika jam berubah: NPC harus benar-benar
  // mencapai interior, kemudian berhenti di sana sampai hujan usai.
  const niaSheltering=raining||phase===3;
  const key=day+'-'+(raining?'rain':phase)+'-'+this.clock.weather;
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
  this.mayor.setRoutine(mayorRoute,'KEPALA DESA',!raining&&phase!==3);
  const sheltered=raining||phase===3;
  const plazaLoopA=[{x:1200,y:452,activity:this.festival.active?'🎪 Menonton lomba':'🤸 Senam',pause:2},
   {x:1200,y:480},{x:1245,y:480,activity:'🌳 Bersantai',pause:2},{x:1245,y:452}];
  const plazaLoopB=[{x:1080,y:471,activity:this.festival.active?'🥗 Menyiapkan stan':'🧹 Merawat taman',pause:2},
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
  this.wargaA.setRoutine(sheltered?shelterRoute(this.wargaA,1200):
   [...toPlaza(this.wargaA),...plazaLoopA], 'WARGA LINA',!sheltered);
  this.wargaB.setRoutine(sheltered?shelterRoute(this.wargaB,1105):
   [...toPlaza(this.wargaB),...plazaLoopB], 'WARGA ARIF',!sheltered);
  const justStoppedRaining=this.lastRaining===true&&!raining&&phase!==3;
  this.lastRaining=raining;
  this.routineKey=key;
  if(raining){
   // A villager already inside a shelter stays inside; villagers at work
   // leave through their current building's door before taking the road.
   for(const [id,npc,label] of [['sari',this.sari,'BU SARI'],
    ['tani',this.tani,'PAK TANI'],['nia',this.nia,'NIA']]){
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
   this.chef.setRoutine([{x:618,y:468},{x:618,y:476},{x:618,y:468}],'');
   this.rani.setRoutine([{x:692,y:197},{x:692,y:211}],'KAK RANI');
   return;
  }
  if(justStoppedRaining){
   this.sari.nextJobRoute=null;this.tani.nextJobRoute=null;this.nia.nextJobRoute=null;
   this.sari.setRoutine(dryReturnRoute('sari',this.sari),'BU SARI',false);
   this.tani.setRoutine(dryReturnRoute('tani',this.tani),'PAK TANI',false);
   this.nia.setRoutine(dryReturnRoute('nia',this.nia),'NIA',false);
   this.chef.setRoutine([{x:618,y:468},{x:667,y:468}],'');
   this.rani.setRoutine([{x:692,y:186},{x:692,y:209}],'KAK RANI');
   return;
  }
  // Malam tanpa hujan: Nia benar-benar berjalan ke dalam pasar.
  // Jika ia berada di perpustakaan, keluar melalui pintu sebelum menuju pasar.
  if(phase===3){
   const n=this.nia;
   if(isInsideShelter('nia',n)){
    n.setRoutine([{x:n.x,y:n.y}],'NIA',false);
   }else{
    let prefix=[];
    if(n.x>500&&n.x<715&&n.y<245)
     prefix=[{x:608,y:208},{x:608,y:237},{x:608,y:281}];
    else if(n.x<390&&n.y>340)prefix=[{x:211,y:339},{x:211,y:318}];
    n.setRoutine([...prefix,...rainyRoute('nia')],'NIA',false);
   }
   n.nextJobRoute=null;
  }
  // v1.9: jalur kerja melewati pintu yang sama dengan pemain dan
  // berhenti di pos kegiatan (kebun, pasar, dapur, perpustakaan).
  for(const [id,npc] of [['sari',this.sari],['tani',this.tani],
   ['nia',this.nia],['chef',this.chef],['rani',this.rani]]){
   if(id==='nia'&&phase===3)continue;
   // Festival diselenggarakan hanya di alun-alun; rutinitas kerja lama tetap berjalan.
   const route=workRoute(id,phase);
   let prefix=[];
   if(id==='nia'&&leavingNiaShelter&&isInsideShelter('nia',npc)){
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
   const label=({sari:'BU SARI',tani:'PAK TANI',nia:'NIA',chef:'',rani:'KAK RANI'})[id];
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
   pond:{x:869,y:155,title:'🎣 KOLAM · KANAN ATAS',yLabel:263},
   plaza:{x:1164,y:427,title:'🌳 ALUN-ALUN KAMPUNG',yLabel:360},
   townHall:{x:1155,y:180,title:'🏛️ BALAI KOTA',yLabel:95},
   festival:{x:1164,y:395,title:'🎉 FESTIVAL · ALUN-ALUN',yLabel:310}
  };
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
  this.ambientArt.update(this.time.now);this.weatherArt.update(this.time.now,changed);this.townArt.update(this.time.now);this.updateRoutines();
  if(!this.game.dialogOpen){
   const dt=Math.min(delta/1000,.05);
   if(!this.activity.active)this.player.update(dt,this.keysHeld);
   this.sari.update(dt);this.chef.update(dt);
   this.tani.update(dt);this.nia.update(dt);this.rani.update(dt);this.mayor.update(dt);this.wargaA.update(dt);this.wargaB.update(dt);this.restaurantCustomer.update(dt);
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
   const z=this.zones.find(q=>q.id===id);
   const npc=this.npcById(id);
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
