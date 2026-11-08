import {canStand} from '../world/WorldGeometry.js?v=beach-access-20261108';
export class Player{
 constructor(scene,state,obstacles){
  this.scene=scene;this.state=state;this.obstacles=obstacles;
  this.facing='down';this.lastFrame=-1;this.lastFacing=null;
  this.walking=false;this.lastDust=-Infinity;
  const s=state.data;
  this.sprite=scene.add.image(s.x,s.y,'player-down-0').setOrigin(.5,.76).setDepth(s.y+1);
 }
 blocked(x,y){return !canStand(x,y,this.obstacles);}
 update(dt,keys){
  const s=this.state.data;
  let dx=Number(keys.has('right'))-Number(keys.has('left'));
  let dy=Number(keys.has('down'))-Number(keys.has('up'));
  const len=Math.hypot(dx,dy);
  const moving=len>0;
  if(moving){
   this.facing=Math.abs(dx)>Math.abs(dy)?'side':dy<0?'up':'down';
   const speed=this.state.status==='Lemas'?95:this.state.status==='Bugar'?170:150;
   dx=dx/len*speed*dt;
   dy=dy/len*speed*dt;
   if(!this.blocked(s.x+dx,s.y))s.x+=dx;
   if(!this.blocked(s.x,s.y+dy))s.y+=dy;
  }
  this.walking=moving;
  // Langkah 0 / 1 / 2 menjaga idle dan pose berlawanan secara konsisten.
  const time=this.scene.time.now;
  const frame=moving?1+Math.floor(time/145)%2:0;
  if(this.lastFrame!==frame||this.lastFacing!==this.facing){
   this.sprite.setTexture('player-'+this.facing+'-'+frame);
   this.lastFrame=frame;this.lastFacing=this.facing;
  }
  // Bob lembut hanya menggeser gambar; world state dan hitbox tetap di tanah.
  const bob=moving?(Math.floor(time/145)%2===0?-1:0):0;
  this.sprite.setFlipX(this.facing==='side'&&dx<0)
   .setPosition(s.x,s.y+bob).setDepth(s.y+1);
  if(moving&&time-this.lastDust>380){
   this.lastDust=time;
   const dust=this.scene.add.circle(s.x-4,s.y+7,2,0xe3d2ad,.55).setDepth(s.y-3);
   this.scene.tweens.add({targets:dust,x:s.x-9,y:s.y+4,alpha:0,duration:350,
    onComplete:()=>dust.destroy()});
  }
 }
}
