export class NPC {
 constructor(scene,{x,y,name,texture,stops}){
  this.scene=scene;this.texture=texture;this.name=name;this.facing='down';this.stops=stops||[];this.index=0;
  this.sprite=scene.add.image(x,y,texture+'-down-0').setOrigin(.5,.76);
  this.label=name?scene.add.text(x,y-45,name,{fontFamily:'monospace',fontSize:'13px',color:'#345b43',fontStyle:'bold'}).setOrigin(.5):null;
 }
 get x(){return this.sprite.x}get y(){return this.sprite.y}
 setRoutine(stops,label){if(stops?.length){this.stops=stops;this.index=0;}if(label&&this.label)this.label.setText(label);}
 update(dt){
  let walking=false,dx=0,dy=0;
  if(this.stops.length){
   const target=this.stops[this.index];dx=target.x-this.x;dy=target.y-this.y;
   const d=Math.hypot(dx,dy);
   if(d<3)this.index=(this.index+1)%this.stops.length;
   else{
    walking=true;
    const step=Math.min(d,34*dt);
    this.sprite.setPosition(this.x+dx/d*step,this.y+dy/d*step);
    this.facing=Math.abs(dx)>Math.abs(dy)?'side':dy<0?'up':'down';
   }
  }
  const frame=walking?1+Math.floor(this.scene.time.now/220)%2:0;
  this.sprite.setTexture(this.texture+'-'+this.facing+'-'+frame);
  this.sprite.setFlipX(this.facing==='side'&&dx<0).setDepth(this.y+1);
  if(this.label)this.label.setPosition(this.x,this.y-45).setDepth(900);
 }
}
