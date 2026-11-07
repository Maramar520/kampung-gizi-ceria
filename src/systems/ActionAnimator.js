// Animasi v1.4: pose pixel art diputar menggunakan Phaser Clock.
// Tidak mengubah koordinat, collision, inventori, atau status quest.
export const ACTION_DURATION=Object.freeze({
 sleep:1250,water:1050,harvest:970,plant:1000,cook:1250,fish:1180
});
export const ACTION_PROPS=Object.freeze({
 sleep:{symbol:'💤',color:0xc0b9de},
 water:{symbol:'💧',color:0x87d4e7},
 harvest:{symbol:'✨',color:0xc6df8a},
 plant:{symbol:'🌱',color:0xa7cc7c},
 cook:{symbol:'♨️',color:0xf4c38b},
 fish:{symbol:'💦',color:0x97d3dc}
});
export function actionFrames(action){
 return ACTION_DURATION[action]===undefined?[]:[0,1,2].map(i=>'player-action-'+action+'-'+i);
}
export class ActionAnimator{
 constructor(scene,player){
  this.scene=scene;
  this.player=player;
  this.timer=null;
  this.endTimer=null;
  this.effects=[];
  this.active=null;
  this.scene.events.once('shutdown',()=>this.stop());
 }
 stop(){
  if(this.timer){this.timer.remove(false);this.timer=null;}
  if(this.endTimer){this.endTimer.remove(false);this.endTimer=null;}
  for(const p of this.effects){
   this.scene.tweens.killTweensOf(p);
   p.destroy();
  }
  this.effects=[];
  if(this.active){
   this.active=null;
   this.player.sprite.setScale(1).setAngle(0);
   this.player.sprite.setTexture('player-'+this.player.facing+'-0');
  }
 }
 play(action){
  const frames=actionFrames(action);
  if(!frames.length)return false;
  this.stop();
  this.active=action;
  let step=0;
  const sprite=this.player.sprite;
  const draw=()=>{
   if(!sprite.active)return;
   sprite.setTexture(frames[step%frames.length]);
   sprite.setFlipX(this.player.facing==='side'&&sprite.flipX);
   step++;
  };
  draw();
  this.timer=this.scene.time.addEvent({delay:170,loop:true,callback:draw});
  const {symbol,color}=ACTION_PROPS[action];
  const x=sprite.x,y=sprite.y;
  if(action==='sleep'){
   const z=this.scene.add.text(x+15,y-47,'Z z z',{fontSize:'15px',color:'#726c9f',fontStyle:'bold'})
    .setOrigin(.5).setDepth(1900);
   this.effects.push(z);
   this.scene.tweens.add({targets:z,y:y-89,alpha:0,duration:1150});
  }else{
   const effect=this.scene.add.text(x+24,y-38,symbol,{fontSize:'22px'}).setOrigin(.5).setDepth(1900);
   this.effects.push(effect);
   this.scene.tweens.add({targets:effect,x:x+36,y:y-75,alpha:0,duration:900});
   if(action==='fish'){
    const ripple=this.scene.add.circle(x+30,y-5,4,color,.25).setStrokeStyle(2,color,.75).setDepth(1800);
    this.effects.push(ripple);
    this.scene.tweens.add({targets:ripple,scale:4,alpha:0,duration:1000});
   }else if(action==='water'){
    for(let i=0;i<3;i++){
     const drop=this.scene.add.circle(x+25+i*5,y-23,3,color,.9).setDepth(1900);
     this.effects.push(drop);
     this.scene.tweens.add({targets:drop,y:y-3+i*3,alpha:0,delay:i*120,duration:550});
    }
   }
  }
  this.endTimer=this.scene.time.delayedCall(ACTION_DURATION[action],()=>this.stop());
  return true;
 }
}
