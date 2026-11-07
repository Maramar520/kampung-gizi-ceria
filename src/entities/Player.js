import {canStand} from '../world/WorldGeometry.js';
export class Player {
 constructor(scene,state,obstacles){
  this.scene=scene;this.state=state;this.obstacles=obstacles;this.facing='down';this.lastFrame=-1;
  const s=state.data;this.sprite=scene.add.image(s.x,s.y,'player-down-0').setOrigin(.5,.76).setDepth(s.y);
 }
 blocked(x,y){return !canStand(x,y,this.obstacles)}
 update(dt,keys){
  const s=this.state.data;
  let dx=Number(keys.has('right'))-Number(keys.has('left')),dy=Number(keys.has('down'))-Number(keys.has('up'));
  const len=Math.hypot(dx,dy);const moving=len>0;
  if(moving){
   this.facing=Math.abs(dx)>Math.abs(dy)?'side':dy<0?'up':'down';
   const speed=this.state.status==='Lemas'?95:this.state.status==='Bugar'?170:150;
   dx=dx/len*speed*dt;dy=dy/len*speed*dt;
   if(!this.blocked(s.x+dx,s.y))s.x+=dx;
   if(!this.blocked(s.x,s.y+dy))s.y+=dy;
  }
  const frame=moving?1+Math.floor(this.scene.time.now/160)%2:0;
  if(this.lastFrame!==frame || this.lastFacing!==this.facing){
   this.sprite.setTexture('player-'+this.facing+'-'+frame);
   this.lastFrame=frame;this.lastFacing=this.facing;
  }
  this.sprite.setFlipX(this.facing==='side'&&dx<0).setPosition(s.x,s.y).setDepth(s.y+1);
 }
}
