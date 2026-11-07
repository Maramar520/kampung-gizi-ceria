// Koordinat tetap dari v0.5. Digunakan oleh render, navigasi, dan tes.
export const WORLD_WIDTH=960;
export const WORLD_HEIGHT=600;
export const SPAWN={x:480,y:530};
export const WALLS=[
 {x:258,y:90,w:364,h:13},{x:258,y:90,w:13,h:265},{x:609,y:90,w:13,h:265},
 {x:258,y:343,w:156,h:12},{x:466,y:343,w:156,h:12},
 {x:53,y:212,w:213,h:12},{x:53,y:212,w:12,h:130},{x:253,y:212,w:12,h:130},
 {x:703,y:211,w:210,h:12},{x:703,y:211,w:12,h:140},{x:901,y:211,w:12,h:140}
];
export const FURNITURE=[
 {x:289,y:137,w:68,h:93},{x:511,y:153,w:83,h:66},
 {x:423,y:250,w:86,h:53},{x:80,y:259,w:120,h:31},{x:746,y:268,w:116,h:30}
];
export const OBSTACLES=[...WALLS,...FURNITURE];
export const INTERACTIONS=[
 {id:'bed',x:320,y:188,r:60,label:'Kasur'},
 {id:'stove',x:553,y:190,r:62,label:'Kompor'},
 {id:'market',x:155,y:323,r:83,label:'Pasar'},
 {id:'npc',x:350,y:476,r:65,label:'Bu Sari'},
 {id:'chef',x:810,y:310,r:78,label:'Chef Bimo'}
];
export function canStand(x,y,obstacles=OBSTACLES){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<15||x>945||y<35||y>580)return false;
 return !obstacles.some(o=>x+9>o.x&&x-9<o.x+o.w&&y+5>o.y&&y-5<o.y+o.h);
}
export function nearestInteraction(position,zones=INTERACTIONS){
 let result=null,shortest=Infinity;
 for(const z of zones){
  const d=Math.hypot(position.x-z.x,position.y-z.y);
  if(d<z.r&&d<shortest){result=z;shortest=d;}
 }
 return result;
}
