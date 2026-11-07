import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Repo uses browser ES modules; load self-contained geometry as data URL in Node.
const code=readFileSync(new URL('../src/world/WorldGeometry.js',import.meta.url),'utf8');
const {canStand,nearestInteraction,INTERACTIONS,OBSTACLES,SPAWN}=await import(
  'data:text/javascript;base64,'+Buffer.from(code).toString('base64')
);

test('spawn and all goal approaches remain outside walls',()=>{
  assert.ok(canStand(SPAWN.x,SPAWN.y));
  assert.equal(canStand(320,180),false); // bed
  assert.equal(canStand(553,190),false); // stove
  assert.equal(canStand(480,345),false); // south wall of house
  assert.equal(canStand(440,345),true); // 52 px central door
  assert.ok(INTERACTIONS.length>=5);
});

test('walking through the open house doorway is reachable from outdoor spawn',()=>{
  // Grid BFS uses the same 18x10 collision extents as the Player class.
  const step=5,visited=new Set(),queue=[[SPAWN.x,SPAWN.y]];
  const key=(x,y)=>x+','+y;visited.add(key(...queue[0]));
  let cursor=0,reachable=false;
  while(cursor<queue.length){
    const [x,y]=queue[cursor++];
    if(x>=435&&x<=445&&y>=320&&y<=335){reachable=true;break;}
    for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
      const nx=x+dx,ny=y+dy,k=key(nx,ny);
      if(!visited.has(k)&&canStand(nx,ny,OBSTACLES)){
        visited.add(k);queue.push([nx,ny]);
      }
    }
  }
  assert.equal(reachable,true,'pemain harus bisa masuk rumah tanpa scene/loading');
});

test('all five interactions are reachable by walking, not only by standing through walls',()=>{
  const step=5,queue=[[SPAWN.x,SPAWN.y]],seen=new Set([SPAWN.x+','+SPAWN.y]);
  let cursor=0;
  const hits=new Set();
  while(cursor<queue.length && hits.size<INTERACTIONS.length){
    const [x,y]=queue[cursor++];
    for(const z of INTERACTIONS){
      if(Math.hypot(x-z.x,y-z.y)<z.r)hits.add(z.id);
    }
    for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
      const nx=x+dx,ny=y+dy,k=nx+','+ny;
      if(!seen.has(k)&&canStand(nx,ny)){seen.add(k);queue.push([nx,ny]);}
    }
  }
  assert.deepEqual([...hits].sort(),INTERACTIONS.map(z=>z.id).sort());
});

test('nearest interaction picks closer NPC and ignores distant zones',()=>{
  const p={x:350,y:476};
  const closest=nearestInteraction(p);
  assert.equal(closest.id,'npc');
  assert.equal(nearestInteraction({x:680,y:560}),null);
});
