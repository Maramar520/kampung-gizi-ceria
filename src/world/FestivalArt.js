// v1.10: temporary festival ribbons/lanterns in the existing market.
// No building, collision, spawn, road or entrance changes.
export class FestivalArt {
 constructor(scene,festival){
  this.scene=scene;this.festival=festival;
  this.graphics=scene.add.graphics().setDepth(75);
  this.title=scene.add.text(210,345,'🎉 FESTIVAL GIZI CERIA',{
   fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',
   color:'#654b39',backgroundColor:'#fff0c4',padding:{x:6,y:4}
  }).setOrigin(.5).setDepth(800);
  this.visible=null;this.last=0;
  this.update(0);
  scene.events.once('shutdown',()=>this.destroy());
 }
 update(time){
  const active=this.festival.active;
  if(this.visible===active&&time-this.last<150)return;
  this.visible=active;this.last=time;
  this.title.setVisible(active);
  const g=this.graphics;g.clear();
  if(!active)return;
  g.lineStyle(3,0xe8c486,.9).lineBetween(62,352,355,352);
  for(let n=0;n<12;n++){
   const x=69+n*25;
   g.fillStyle([0xeaa7a8,0xf6d58b,0xb0d6b0,0xb9c3e9][n%4],.85);
   g.fillTriangle(x,354,x+17,354,x+9,367);
  }
  const flicker=.75+.25*Math.sin(time/360);
  for(const [x,y] of [[85,379],[319,378],[103,492],[299,492]]){
   g.fillStyle(0xffe9a1,.16*flicker).fillCircle(x,y,17);
   g.fillStyle(0xf3c76c,.8).fillRoundedRect(x-4,y-6,8,12,3);
  }
 }
 destroy(){this.graphics.destroy();this.title.destroy();}
}
