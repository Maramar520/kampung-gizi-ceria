// Peta v1.3: denah SVG asli (360×270) dipetakan ke world 960×600.
// Tiga kolom / dua baris dipisahkan jalan x≈448, x≈760, dan y≈282.
export const WORLD_WIDTH=1340, WORLD_HEIGHT=850;
export const SPAWN={x:446,y:291};
export const LAYOUT=Object.freeze({
 home:{x:45,y:49,w:197,h:190},
 garden:{x:258,y:59,w:131,h:79},
 coop:{x:264,y:150,w:123,h:88},
 village:{x:500,y:49,w:214,h:190},
 pond:{x:805,y:53,w:126,h:183},
 market:{x:39,y:339,w:354,h:206},
 restaurant:{x:500,y:339,w:214,h:206},
 store:{x:806,y:339,w:126,h:206},
 townHall:{x:1025,y:65,w:260,h:173},plaza:{x:1005,y:344,w:302,h:200},
 roads:{crossY:281,leftX:448,rightX:760}
});
export const DOORS=Object.freeze({
 home:{x:140,y:237},
 village:{x:608,y:237},
 market:{x:211,y:339},
 restaurant:{x:607,y:339},
 store:{x:869,y:339},townHall:{x:1155,y:238}
});
const rectangle=(x,y,w,h)=>({x,y,w,h});
function houseWalls({x,y,w,h},topEntrance=false){
 const door=52,left=(w-door)/2;
 const result=[rectangle(x,y,11,h),rectangle(x+w-11,y,11,h)];
 if(topEntrance){
  result.push(rectangle(x,y,left,11),rectangle(x+left+door,y,w-left-door,11));
  result.push(rectangle(x,y+h-11,w,11));
 }else{
  result.push(rectangle(x,y,w,11));
  result.push(rectangle(x,y+h-11,left,11),rectangle(x+left+door,y+h-11,w-left-door,11));
 }
 return result;
}
export const WALLS=[
 ...houseWalls(LAYOUT.home),...houseWalls(LAYOUT.village),
 ...houseWalls(LAYOUT.townHall),...houseWalls(LAYOUT.market,true),...houseWalls(LAYOUT.restaurant,true),...houseWalls(LAYOUT.store,true)
];
export const FURNITURE=[
 rectangle(68,99,51,81), // kasur
 rectangle(171,107,47,46), // kompor
 rectangle(144,174,55,30), // meja rumah
 rectangle(551,106,54,40), // meja warga
 rectangle(84,392,204,35), // lapak pasar
 rectangle(533,395,102,36), // meja restoran
 rectangle(1082,114,46,25),
 rectangle(819,393,34,51)  // kasur rumah Pak Tani dan Bu Sari
];
export const NEW_WORLD_OBSTACLES=[
 rectangle(292,168,72,42), // bangunan kandang; halamannya tetap dapat dilalui
 rectangle(816,82,105,129), // air kolam (dermaga di sisi bawah)
 rectangle(0,709,734,141), // laut: hanya dermaga yang dapat diinjak
 rectangle(791,709,549,141) // laut di kanan dermaga
];
export const OBSTACLES=[...WALLS,...FURNITURE,...NEW_WORLD_OBSTACLES];
export const INTERACTIONS=[
 {id:'sea-fishing',x:761,y:768,r:45,label:'Memancing di Dermaga'},
 {id:'beach',x:680,y:651,r:65,label:'Pantai Selatan'},
 {id:'plaza',x:1164,y:427,r:92,label:'Alun-Alun Kampung'},
 {id:'townHall',x:1155,y:198,r:75,label:'Balai Kota'},
 {id:'mayor',x:1204,y:180,r:45,label:'Kepala Desa'},
 {id:'arif',x:1080,y:471,r:37,label:'Warga Arif'},
 {id:'lina',x:1200,y:452,r:37,label:'Warga Lina'},
 {id:'bed',x:99,y:161,r:49,label:'Kasur'},
 {id:'stove',x:194,y:160,r:55,label:'Kompor'},
 {id:'market',x:208,y:376,r:81,label:'Pasar'},
 {id:'npc',x:450,y:283,r:65,label:'Bu Sari'},
 {id:'chef',x:616,y:456,r:75,label:'Chef Bimo'},
 {id:'restaurant-kitchen',x:687,y:442,r:33,label:'Dapur Restoran'},
 {id:'garden',x:320,y:142,r:75,label:'Kebun Sayur'},
 {id:'coop',x:325,y:217,r:74,label:'Kandang Ayam'},
 {id:'pond',x:871,y:230,r:75,label:'Kolam Ikan'},
 {id:'store',x:869,y:364,r:65,label:'Rumah Pak Tani & Bu Sari'},
 {id:'village',x:606,y:207,r:67,label:'Perpustakaan'},
 {id:'tani',x:403,y:189,r:45,label:'Pak Tani'},
 {id:'nia',x:405,y:317,r:43,label:'Nia'},
 {id:'library',x:651,y:136,r:53,label:'Perpustakaan Gizi'},
 {id:'rani',x:692,y:207,r:39,label:'Kak Rani'}
];
export function canStand(x,y,obstacles=OBSTACLES){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<15||x>1325||y<35||y>825)return false;
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
