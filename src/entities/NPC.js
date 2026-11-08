export class NPC {
 constructor(scene,{x,y,name,texture,stops}){
  this.scene=scene;this.texture=texture;this.name=name;this.facing='down';this.stops=stops||[];this.index=0;this.loop=true;this.finished=false;this.workPause=0;this.activity='';
  this.sprite=scene.add.image(x,y,texture+'-down-0').setOrigin(.5,.76);
  this.activityText=scene.add.text(x,y-69,'',{fontFamily:'monospace',fontSize:'11px',color:'#315544',backgroundColor:'#fff5d8',padding:{x:4,y:3}}).setOrigin(.5).setDepth(1750).setVisible(false);
  this.label=name?scene.add.text(x,y-45,name,{fontFamily:'monospace',fontSize:'13px',color:'#345b43',fontStyle:'bold'}).setOrigin(.5):null;
 }
 get x(){return this.sprite.x}get y(){return this.sprite.y}
 setRoutine(stops,label,loop=true){
  if(stops?.length){this.stops=stops;this.index=0;this.loop=loop;this.finished=false;this.workPause=0;this.activity='';}
  if(label&&this.label)this.label.setText(label);
 }
 update(dt){
  if(this.workPause>0){
   this.workPause=Math.max(0,this.workPause-dt);
   this.activityText.setText(this.activity).setPosition(this.x,this.y-70).setVisible(!!this.activity).setDepth(1750);
   const frame=Math.floor(this.scene.time.now/450)%2;
   this.sprite.setTexture(this.texture+'-'+this.facing+'-'+frame)
    .setDepth(this.y+1);
   if(this.label)this.label.setPosition(this.x,this.y-45).setDepth(900);
   return;
  }
  // Pekerjaan rumah dan tidur tetap terlihat setelah mencapai pos akhir.
  const last=this.stops[this.stops.length-1];
  const resting=this.finished&&!this.loop&&!!last?.activity;
  this.activityText.setText(resting?last.activity:'').setPosition(this.x,this.y-70).setVisible(resting);
  let walking=false,dx=0,dy=0;
  if(this.stops.length&&!this.finished){
   const target=this.stops[this.index];dx=target.x-this.x;dy=target.y-this.y;
   const d=Math.hypot(dx,dy);
   if(d<3){
    if(target.pause){
     this.workPause=Math.min(3,Math.max(0,target.pause));
     this.activity=target.activity||'';
    }
    if(this.index===this.stops.length-1&&!this.loop)this.finished=true;
    else this.index=(this.index+1)%this.stops.length;
   }
   else{
    walking=true;
    const step=Math.min(d,34*dt);
    // Pindahkan koordinat sprite sungguhan; animasi kaki mengikuti perpindahan.
    const nx=this.x+dx/d*step,ny=this.y+dy/d*step;
    if(!this.walkable||this.walkable(nx,ny))this.sprite.setPosition(nx,ny);
    else {this.finished=true;walking=false;this.activity='🚧 Jalan terhalang';}
    this.facing=Math.abs(dx)>Math.abs(dy)?'side':dy<0?'up':'down';
   }
  }
  const frame=walking?1+Math.floor(this.scene.time.now/220)%2:0;
  this.sprite.setTexture(this.texture+'-'+this.facing+'-'+frame);
  this.sprite.setFlipX(this.facing==='side'&&dx<0).setDepth(this.y+1);
  if(this.label)this.label.setPosition(this.x,this.y-45).setDepth(900);
 }
}
