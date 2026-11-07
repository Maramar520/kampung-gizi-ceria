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
import {rainyRoute,dryReturnRoute} from '../world/ShelterRoutes.js';

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
  this.farmArt=new FarmArt(this);
  this.ambientArt=new AmbientArt(this);
  this.weatherArt=new WeatherArt(this,this.clock);
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
  this.cameras.main.setBounds(0,0,960,600);
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
   coop:'🥚',pond:'🎣',store:'🏡',village:'🏡',npc:'✨',tani:'🌱',nia:'💬',library:'📚',rani:'📖'}[kind]||'✨';
  const puff=this.add.text(x,y-47,emoji,{fontSize:'22px'}).setOrigin(.5).setDepth(2200);
  this.tweens.add({targets:puff,y:y-77,alpha:0,duration:650,
   ease:'Sine.easeOut',onComplete:()=>puff.destroy()});
 }
 npcById(id){
  return ({npc:this.sari,chef:this.chef,tani:this.tani,nia:this.nia,rani:this.rani})[id]||null;
 }
 updateRoutines(){
  const phase=this.clock.phase,day=this.game.state.data.day;
  const raining=this.clock.weather==='Hujan';
  this.phaseIndex=phase;
  this.dailyPhase=this.clock.description.phase;
  // Saat hujan, rute tidak direset ketika jam berubah: NPC harus benar-benar
  // mencapai interior, kemudian berhenti di sana sampai hujan usai.
  const key=day+'-'+(raining?'rain':phase)+'-'+this.clock.weather;
  if(this.routineKey===key)return;
  const justStoppedRaining=this.lastRaining===true&&!raining;
  this.lastRaining=raining;
  this.routineKey=key;
  if(raining){
   this.sari.setRoutine(rainyRoute('sari'),'BU SARI',false);
   this.tani.setRoutine(rainyRoute('tani'),'PAK TANI',false);
   this.nia.setRoutine(rainyRoute('nia'),'NIA',false);
   this.chef.setRoutine([{x:618,y:468},{x:618,y:476},{x:618,y:468}],'');
   this.rani.setRoutine([{x:692,y:197},{x:692,y:211}],'KAK RANI');
   return;
  }
  if(justStoppedRaining){
   this.sari.setRoutine(dryReturnRoute('sari',this.sari),'BU SARI',false);
   this.tani.setRoutine(dryReturnRoute('tani',this.tani),'PAK TANI',false);
   this.nia.setRoutine(dryReturnRoute('nia',this.nia),'NIA',false);
   this.chef.setRoutine([{x:618,y:468},{x:667,y:468}],'');
   this.rani.setRoutine([{x:692,y:186},{x:692,y:209}],'KAK RANI');
   return;
  }
  // Cuaca cerah: rutinitas biasa memakai jalur yang sudah ada.
  const sariPlans=[
   {label:'BU SARI · BERJALAN',points:[{x:448,y:281},{x:410,y:281},{x:410,y:315},{x:448,y:315}]},
   {label:'BU SARI · WARGA',points:[{x:448,y:280},{x:479,y:280},{x:479,y:245},{x:448,y:245}]},
   {label:'BU SARI · PASAR',points:[{x:448,y:300},{x:416,y:300},{x:416,y:332},{x:448,y:332}]}
  ];
  const chefPlans=[
   [{x:618,y:468},{x:667,y:468},{x:667,y:505},{x:618,y:505}],
   [{x:617,y:480},{x:652,y:480},{x:652,y:517},{x:617,y:517}],
   [{x:618,y:448},{x:660,y:448},{x:660,y:490},{x:618,y:490}]
  ];
  const a=sariPlans[(phase+day%2)%3];
  this.sari.setRoutine(phase===3?[{x:478,y:245},{x:478,y:263},{x:478,y:245}]:raining?
   [{x:449,y:277},{x:462,y:277},{x:462,y:283}]:a.points,'BU SARI');
  this.chef.setRoutine(phase===3?[{x:617,y:480},{x:617,y:506},{x:625,y:506}]:chefPlans[phase], '');
  const taniRoutes=[
   [{x:403,y:189},{x:401,y:217},{x:408,y:243},{x:403,y:198}],
   [{x:405,y:226},{x:407,y:249},{x:398,y:248},{x:399,y:208}],
   [{x:402,y:204},{x:401,y:238},{x:408,y:248},{x:403,y:193}]
  ];
  const niaRoutes=[
   [{x:405,y:316},{x:412,y:286},{x:482,y:286},{x:479,y:314}],
   [{x:412,y:280},{x:481,y:280},{x:479,y:252},{x:417,y:280}],
   [{x:405,y:312},{x:419,y:287},{x:483,y:287},{x:470,y:316}]
  ];
  this.tani.setRoutine(phase===3?[{x:402,y:232},{x:403,y:235},{x:402,y:232}]:raining?
   [{x:405,y:241},{x:403,y:232},{x:407,y:241}]:taniRoutes[(phase+day%2)%3],'PAK TANI');
  this.nia.setRoutine(phase===3?[{x:478,y:277},{x:479,y:283},{x:478,y:277}]:raining?
   [{x:414,y:283},{x:421,y:283},{x:414,y:283}]:niaRoutes[phase%3],'NIA');
  this.rani.setRoutine(phase===3?
   [{x:692,y:208},{x:692,y:213}]:
   raining?[{x:692,y:197},{x:692,y:211}]:
   [{x:692,y:186},{x:692,y:209},{x:692,y:191}],'KAK RANI');
  this.phaseIndex=phase;
  this.dailyPhase=this.clock.description.phase;
 }
 highlightPlace(id){
  const markers={
   library:{x:650,y:130,title:'📚 PERPUSTAKAAN GIZI',yLabel:75},
   coop:{x:325,y:194,title:'🐔 TERNAK · SEBELAH RUMAH',yLabel:248},
   pond:{x:869,y:155,title:'🎣 KOLAM · KANAN ATAS',yLabel:263}
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
  this.ambientArt.update(this.time.now);this.weatherArt.update(this.time.now,changed);this.updateRoutines();
  if(!this.game.dialogOpen){
   const dt=Math.min(delta/1000,.05);
   if(!this.activity.active)this.player.update(dt,this.keysHeld);
   this.sari.update(dt);this.chef.update(dt);
   this.tani.update(dt);this.nia.update(dt);this.rani.update(dt);
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
   Phaser.Math.Clamp(s.x,75,880),Phaser.Math.Clamp(s.y-61,24,548));
 }
}
