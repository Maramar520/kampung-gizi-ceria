import {INTERACTIONS,nearestInteraction,SPAWN,canStand} from '../world/WorldGeometry.js';
import {createTextures,buildWorld} from '../world/WorldArt.js';
import {Player} from '../entities/Player.js';
import {NPC} from '../entities/NPC.js';
import {GardenSystem} from '../systems/GardenSystem.js';
import {GardenArt} from '../world/GardenArt.js';
import {FarmArt} from '../world/FarmArt.js';
import {DailyLifeSystem} from '../systems/DailyLifeSystem.js';
export class WorldScene extends Phaser.Scene {
 constructor(){super('WorldScene');this.keysHeld=new Set()}
 create(){createTextures(this);const walls=buildWorld(this);this.garden=new GardenSystem(this.game.state);this.gardenArt=new GardenArt(this,this.garden);this.dailyLife=new DailyLifeSystem(this.game.state);this.farmArt=new FarmArt(this);this.player=new Player(this,this.game.state,walls);if(!canStand(this.game.state.data.x,this.game.state.data.y)){Object.assign(this.game.state.data,SPAWN);this.player.sprite.setPosition(SPAWN.x,SPAWN.y);this.game.state.save();}this.sari=new NPC(this,{x:350,y:476,name:'BU SARI',texture:'sari',stops:[{x:350,y:476},{x:345,y:415},{x:388,y:415},{x:387,y:480}]});this.chef=new NPC(this,{x:813,y:330,name:'',texture:'chef'});this.zones=INTERACTIONS;this.guide=this.add.text(0,0,'',{fontFamily:'monospace',fontSize:'13px',color:'#ffffff',backgroundColor:'#557d57',padding:{x:6,y:4}}).setOrigin(.5).setDepth(1600);this.prompt=this.add.text(0,0,'E / AKSI',{fontFamily:'monospace',fontSize:'13px',color:'#446047',backgroundColor:'#fff4d5',padding:{x:7,y:4}}).setOrigin(.5).setDepth(1500);this.input.keyboard.on('keydown',e=>{const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',a:'left',s:'down',d:'right'};const key=map[e.key]||map[e.key.toLowerCase()];if(key){e.preventDefault();this.keysHeld.add(key)}if(e.key.toLowerCase()==='e'&&!e.repeat){e.preventDefault();this.game.events.emit('action')}if(e.key==='Escape')this.game.events.emit('close-dialog')});this.input.keyboard.on('keyup',e=>{const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',a:'left',s:'down',d:'right'};const key=map[e.key]||map[e.key.toLowerCase()];if(key)this.keysHeld.delete(key)});window.addEventListener('blur',()=>this.keysHeld.clear());this.cameras.main.setBounds(0,0,960,600);this.cameras.main.startFollow(this.player.sprite,true,.12,.12);this.cameras.main.setZoom(1);this.game.events.emit('world-ready',this);this.scene.launch('UIScene')}
 playInteraction(kind){
  const subject=(kind==='npc'?this.sari.sprite:kind==='chef'?this.chef.sprite:this.player.sprite);
  if(!subject||!subject.active)return;
  const x=subject.x,y=subject.y;
  // Animasi kecil saat interaksi, tanpa scene baru atau memindah karakter.
  this.tweens.killTweensOf(subject);
  subject.setScale(1);
  this.tweens.add({targets:subject,scaleX:1.12,scaleY:.88,duration:110,yoyo:true,
    ease:'Sine.easeOut',onComplete:()=>subject.setScale(1)});
  const glyph=kind==='stove'?'🍳':kind==='market'?'🧺':kind==='bed'?'💤':kind==='chef'?'📖':kind==='garden'?'🌱':kind==='coop'?'🥚':kind==='pond'?'🎣':'✨';
  const puff=this.add.text(x,y-48,glyph,{fontSize:'22px'}).setOrigin(.5).setDepth(2200);
  this.tweens.add({targets:puff,y:y-80,alpha:0,duration:650,
    ease:'Sine.easeOut',onComplete:()=>puff.destroy()});
 }
 updateRoutines(){
  const day=this.game.state.data.day;
  const phase=Math.floor(this.time.now/30000)%3;
  const key=day+'-'+phase;
  if(this.routineKey===key)return;
  this.routineKey=key;
  const sariPlans=[
   {label:'BU SARI · JALAN',points:[{x:350,y:476},{x:345,y:415},{x:388,y:415},{x:387,y:480}]},
   {label:'BU SARI · KEBUN',points:[{x:350,y:418},{x:295,y:418},{x:280,y:396},{x:350,y:418}]},
   {label:'BU SARI · PASAR',points:[{x:352,y:459},{x:261,y:463},{x:260,y:406},{x:351,y:460}]}
  ];
  const chefPlans=[
   {label:'',points:[{x:813,y:330},{x:845,y:330},{x:813,y:330}]},
   {label:'',points:[{x:785,y:334},{x:852,y:334},{x:785,y:334}]},
   {label:'',points:[{x:822,y:328},{x:785,y:328},{x:822,y:328}]}
  ];
  const shift=day%2;
  const a=sariPlans[(phase+shift)%3],b=chefPlans[phase];
  this.sari.setRoutine(a.points,a.label);
  this.chef.setRoutine(b.points,b.label);
  this.dailyPhase=['Pagi','Siang','Sore'][phase];
 }
 getNearest(){
  const s=this.game.state.data;
  return nearestInteraction(s,this.zones.map(z=>z.id==='npc'?{...z,x:this.sari.x,y:this.sari.y}:z))?.id??null;
 }
 getGoal(){
  const s=this.game.state.data;
  if(s.done)return null;
  if(s.cooked)return {x:this.sari.x,y:this.sari.y,label:'Bu Sari'};
  if(!s.recipeKnown)return {x:810,y:347,label:'Chef Bimo'};
  const missing=['beras','telur','bayam'].filter(id=>(s.inventory[id]||0)<1);
  if(missing.includes('beras'))return {x:155,y:359,label:'Pasar'};
  if(missing.includes('telur')){
   const status=this.dailyLife.status;
   if(status.eggsReady||!status.eggsCollected)return {x:803,y:195,label:'Kandang Ayam'};
   return {x:155,y:359,label:'Pasar'};
  }
  if(missing.includes('bayam')){
   const plots=this.garden.view.plots;
   const waiting=plots.some(p=>p.stage==='growing')&&!plots.some(p=>p.stage==='ready'||p.stage==='dry'||p.stage==='empty');
   if(waiting)return {x:440,y:316,label:'Tidur di rumah'};
   if(this.garden.view.seeds>0||plots.some(p=>p.stage!=='empty'))return {x:120,y:212,label:'Kebun'};
   return {x:155,y:359,label:'Pasar (bibit)'};
  }
  return {x:553,y:229,label:'Kompor'};
 }
 update(_time,delta){
  this.gardenArt.render();this.farmArt.update(this.time.now);this.updateRoutines();
  if(!this.game.dialogOpen){
    const dt=Math.min(delta/1000,.05);
    this.player.update(dt,this.keysHeld);
    this.sari.update(dt);this.chef.update(dt);
  }
  const id=this.getNearest();
  this.prompt.setVisible(!!id&&!this.game.dialogOpen);
  if(id){
    const z=this.zones.find(q=>q.id===id);
    this.prompt.setPosition(id==='npc'?this.sari.x:z.x,(id==='npc'?this.sari.y:z.y)-75);
    this.prompt.setText('E / AKSI · '+z.label);
  }
  const goal=this.getGoal();
  if(this.game.dialogOpen||!goal){this.guide.setVisible(false);return;}
  const s=this.game.state.data;
  const dx=goal.x-s.x,dy=goal.y-s.y,d=Math.hypot(dx,dy);
  const arrow=Math.abs(dx)>Math.abs(dy)?(dx<0?'←':'→'):(dy<0?'↑':'↓');
  this.guide.setVisible(d>105);
  if(d>105)this.guide.setText(arrow+' '+goal.label).setPosition(
    Phaser.Math.Clamp(s.x,70,890),
    Phaser.Math.Clamp(s.y-61,24,548)
  );
 }
}
