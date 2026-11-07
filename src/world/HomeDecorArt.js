import {DECOR_ITEMS,DECOR_SLOTS} from '../systems/HomeDecorSystem.js';
// Permanent lightweight visual layer, always inside original house footprint.
export class HomeDecorArt {
 constructor(scene,decor){
  this.scene=scene;this.decor=decor;
  this.graphics=scene.add.graphics().setDepth(60);
  this.labels=DECOR_SLOTS.map(slot=>scene.add.text(slot.x,slot.y,'',{
   fontFamily:'sans-serif',fontSize:'23px'
  }).setOrigin(.5).setDepth(62));
  scene.events.once('shutdown',()=>this.destroy());
  this.render();
 }
 render(){
  this.graphics.clear();
  const data=this.decor.data.slots;
  for(let i=0;i<DECOR_SLOTS.length;i++){
   const slot=DECOR_SLOTS[i],item=DECOR_ITEMS[data[slot.id]];
   this.labels[i].setText(item?.emoji||'');
   if(!item)continue;
   this.graphics.fillStyle(0x725e51,.13).fillEllipse(slot.x,slot.y+10,23,7);
   if(data[slot.id]==='carpet'){
    this.graphics.fillStyle(item.color,.65).fillRoundedRect(slot.x-15,slot.y-9,30,22,6);
   }
  }
 }
 destroy(){this.graphics.destroy();this.labels.forEach(t=>t.destroy());}
}
