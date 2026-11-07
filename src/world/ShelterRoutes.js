// v1.8.1 — protected walkways for rainy-weather shelters.
// Coordinates refer to existing six-block map: no new roads or building positions.
export const RAIN_HOME={
 sari:[{x:448,y:281},{x:760,y:281},{x:760,y:319},{x:869,y:319},{x:869,y:355},{x:869,y:451},{x:851,y:461}],
 tani:[{x:404,y:260},{x:448,y:281},{x:760,y:281},{x:760,y:319},{x:869,y:319},{x:869,y:355},{x:869,y:451},{x:891,y:461}],
 nia:[{x:448,y:281},{x:405,y:318},{x:211,y:318},{x:211,y:354},{x:211,y:375}]
};
export const SHELTER_DESTINATIONS={
 sari:{x:851,y:461,building:'store'},
 tani:{x:891,y:461,building:'store'},
 nia:{x:211,y:375,building:'market'}
};
export function rainyRoute(id){return (RAIN_HOME[id]||[]).map(p=>({...p}));}
export function isInsideShelter(id,pos){
 if(!pos||!SHELTER_DESTINATIONS[id])return false;
 if(id==='nia')return pos.x>=190&&pos.x<=243&&pos.y>=342&&pos.y<=390;
 return pos.x>=823&&pos.x<=913&&pos.y>=347&&pos.y<=527;
}
export function dryReturnRoute(id,pos){
 if(!RAIN_HOME[id])return [];
 if(id==='nia'){
  // The market opens north towards the crossroads.
  if(pos.x>=190&&pos.x<=243&&pos.y>=340)return [
   {x:211,y:339},{x:211,y:318},{x:405,y:318}];
  return [{x:405,y:318}];
 }
 // Exit the family home through the existing north door, then follow the roads.
 const street=[{x:760,y:319},{x:760,y:281},{x:448,y:281}];
 if(id==='tani')street.push({x:404,y:260},{x:403,y:232});
 if(pos.x>=818&&pos.y>=342)return [{x:869,y:451},{x:869,y:355},
  {x:869,y:319},...street];
 if(pos.x>=785&&pos.y>=310)return [{x:869,y:319},...street];
 if(pos.x>=760)return [...street];
 if(pos.x>448)return [{x:448,y:281},...(id==='tani'?[{x:404,y:260},{x:403,y:232}]:[])];
 return id==='tani'?[{x:404,y:260},{x:403,y:232}]:[{x:448,y:281}];
}
