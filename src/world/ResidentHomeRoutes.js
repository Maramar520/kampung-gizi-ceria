// v1.26: jalur penghuni rumah timur, melewati jalan utama dan pintu terbuka.
import {EAST_HOMES} from './EastHomesArt.js';
export const HOME_RESIDENTS=Object.freeze(['nia','arif','lina']);
export function homePosition(id){const h=EAST_HOMES[id];return h?{x:h.x+h.w/2,y:h.y+136}:null;}
export function residentHomeRoute(id,npc,activity='💤 Tidur'){
 const h=EAST_HOMES[id];if(!h)return [];
 const x=h.x+h.w/2,home=homePosition(id);
 if(npc.x>=h.x&&npc.x<=h.x+h.w&&npc.y<235)return [{...home,activity,pause:3}];
 const route=[];
 // Keluar dari pasar melalui pintu utara; dari perpustakaan lewat pintu selatan.
 if(id==='nia'&&npc.x>=39&&npc.x<=393&&npc.y>=339){route.push({x:211,y:365},{x:211,y:339},{x:211,y:318},{x:211,y:281});}
 else if(id==='nia'&&npc.x>=500&&npc.x<=714&&npc.y<239){route.push({x:608,y:208},{x:608,y:237},{x:608,y:281});}
 else if(npc.x<1340&&npc.y>310){route.push({x:1155,y:npc.y},{x:1155,y:345},{x:1155,y:281});}
 else if(npc.x<1340&&npc.y<239){route.push({x:1155,y:208},{x:1155,y:238},{x:1155,y:281});}
 else if(npc.x<1340&&npc.y<261)route.push({x:npc.x,y:281});
 route.push({x,y:281},{x,y:247},{x,y:220},{...home,activity,pause:3});
 return route;
}
export function residentLeaveHomeRoute(id,destination){
 const h=EAST_HOMES[id];if(!h)return [];
 const x=h.x+h.w/2;
 return [{x,y:220},{x,y:247},{x,y:281},{x:1155,y:281},
  ...(destination?.y>345?[{x:1155,y:345}]:[]),...(destination?[destination]:[])];
}
export function residentHomeActivity(id,phase,raining){
 if(phase===3)return '💤 Tidur';
 if(raining)return ({nia:'📖 Membaca di rumah',arif:'🧹 Membersihkan rumah',lina:'🌿 Merawat tanaman'})[id];
 return ({nia:'🎒 Menyiapkan bekal',arif:'🍳 Menyiapkan sarapan',lina:'🌷 Menyiram bunga'})[id];
}
