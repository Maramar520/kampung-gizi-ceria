// v1.2 ambient particles; visual-only and no extra collision or assets.
export class AmbientArt {
 constructor(scene){
  this.scene=scene;this.graphics=scene.add.graphics().setDepth(-54);
  this.lastDraw=-Infinity;
  this.leaves=[
   {x:640,y:108,phase:0},{x:663,y:135,phase:2},{x:908,y:103,phase:1},
   {x:25,y:536,phase:4},{x:905,y:515,phase:3},{x:218,y:383,phase:2},
   {x:675,y:387,phase:1},{x:229,y:548,phase:5}
  ];
 }
 update(time){
  if(time-this.lastDraw<100)return;
  this.lastDraw=time;
  const g=this.graphics;g.clear();
  for(const leaf of this.leaves){
   const cycle=(time/1000+leaf.phase)%5;
   const x=leaf.x+Math.sin(time/640+leaf.phase)*7+cycle*2;
   const y=leaf.y+cycle*5-8;
   g.fillStyle(leaf.phase%2?0xb9d08b:0xe6d29b,.8);
   g.fillRect(Math.round(x),Math.round(y),5,3);
   g.fillStyle(0x679f72,.8);
   g.fillRect(Math.round(x+2),Math.round(y+3),2,2);
  }
  // Delicate sparkle on the windows and around the vegetable garden.
  for(const [x,y,p] of [[300,267,0],[177,82,1],[687,99,2]]){
   const a=.18+.12*(1+Math.sin(time/440+p*3));
   g.fillStyle(0xfff7d6,a);
   g.fillRect(x,y,3,3);
  }
 }
 destroy(){this.graphics.destroy();}
}
