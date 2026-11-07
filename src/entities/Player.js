export class Player {
 constructor(scene,state,obstacles){this.scene=scene;this.state=state;this.obstacles=obstacles;const s=state.data;this.sprite=scene.add.image(s.x,s.y,'player').setDepth(s.y);this.sprite.setOrigin(.5,.76)}
 blocked(x,y){if(x<15||x>945||y<35||y>580)return true;return this.obstacles.some(o=>x+9>o.x&&x-9<o.x+o.w&&y+5>o.y&&y-5<o.y+o.h)}
 update(dt,keys){const s=this.state.data;let dx=Number(keys.has('right'))-Number(keys.has('left')),dy=Number(keys.has('down'))-Number(keys.has('up'));const len=Math.hypot(dx,dy)||1;const speed=this.state.status==='Lemas'?95:this.state.status==='Bugar'?170:150;dx=dx/len*speed*dt;dy=dy/len*speed*dt;if(!this.blocked(s.x+dx,s.y))s.x+=dx;if(!this.blocked(s.x,s.y+dy))s.y+=dy;this.sprite.setPosition(s.x,s.y).setDepth(s.y+1);this.sprite.setScale(keys.size?1+Math.sin(this.scene.time.now/90)*.018:1)}
}
