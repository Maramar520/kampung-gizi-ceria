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

export class WorldScene extends Phaser.Scene {
 constructor(){super('WorldScene');this.keysHeld=new Set();}
 create(){
  createTextures(this);
  const obstacles=buildWorld(this);
  this.garden=new GardenSystem(this.game.state);
  this.gardenArt=new GardenArt(this,this.garden);
  this.dailyLife=new DailyLifeSystem(this.game.state);
  this.farmArt=new FarmArt(this);
  this.ambientArt=new AmbientArt(this);
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
  const subject=kind==='npc'?this.sari.sprite:kind==='chef'?this.chef.sprite:this.player.sprite;
  if(!subject?.active)return;
  const x=subject.x,y=subject.y;
  this.tweens.killTweensOf(subject);
  subject.setScale(1);
  this.tweens.add({targets:subject,scaleX:1.12,scaleY:.88,duration:110,yoyo:true,
   ease:'Sine.easeOut',onComplete:()=>subject.setScale(1)});
  const emoji={stove:'🍳',market:'🧺',bed:'💤',chef:'📖',garden:'🌱',
   coop:'🥚',pond:'🎣',store:'🛒',village:'🏡',npc:'✨'}[kind]||'✨';
  const puff=this.add.text(x,y-47,emoji,{fontSize:'22px'}).setOrigin(.5).setDepth(2200);
  this.tweens.add({targets:puff,y:y-77,alpha:0,duration:650,
   ease:'Sine.easeOut',onComplete:()=>puff.destroy()});
 }
 updateRoutines(){
  const phase=Math.floor(this.time.now/30000)%3,day=this.game.state.data.day;
  const key=day+'-'+phase;
  if(this.routineKey===key)return;
  this.routineKey=key;
  // Semua jalur NPC berada di jalan tengah. Tidak memotong dinding atau kolam.
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
  this.sari.setRoutine(a.points,'BU SARI');
  this.chef.setRoutine(chefPlans[phase],'');
  this.dailyPhase=['Pagi','Siang','Sore'][phase];
 }
 highlightPlace(id){
  const markers={
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
  return nearestInteraction(d,this.zones.map(z=>z.id==='npc'?{...z,x:this.sari.x,y:this.sari.y}:
   z.id==='chef'?{...z,x:this.chef.x,y:this.chef.y}:z))?.id??null;
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
  this.gardenArt.render();this.farmArt.update(this.time.now);
  this.ambientArt.update(this.time.now);this.updateRoutines();
  if(!this.game.dialogOpen){
   const dt=Math.min(delta/1000,.05);
   if(!this.activity.active)this.player.update(dt,this.keysHeld);
   this.sari.update(dt);this.chef.update(dt);
  }
  const id=this.getNearest();
  this.prompt.setVisible(!!id&&!this.game.dialogOpen);
  if(id){
   const z=this.zones.find(q=>q.id===id);
   const npc=id==='npc'?this.sari:id==='chef'?this.chef:null;
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
