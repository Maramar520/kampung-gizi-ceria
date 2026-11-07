export class NPC {
 constructor(scene,{x,y,name,texture,stops}){this.scene=scene;this.name=name;this.sprite=scene.add.image(x,y,texture).setOrigin(.5,.76);this.label=scene.add.text(x,y-45,name,{fontFamily:'monospace',fontSize:'13px',color:'#345b43',fontStyle:'bold'}).setOrigin(.5);this.stops=stops||[];this.index=0}
 get x(){return this.sprite.x}get y(){return this.sprite.y}
 update(dt){if(this.stops.length){const target=this.stops[this.index],dx=target.x-this.x,dy=target.y-this.y,d=Math.hypot(dx,dy);if(d<3)this.index=(this.index+1)%this.stops.length;else{const step=Math.min(d,34*dt);this.sprite.setPosition(this.x+dx/d*step,this.y+dy/d*step)}}this.sprite.setDepth(this.y+1);this.label.setPosition(this.x,this.y-45).setDepth(900)}
}
