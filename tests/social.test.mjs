import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const moduleFrom=async path=>{
 const source=readFileSync(new URL('../'+path,import.meta.url),'utf8');
 return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
};
const {GameState,SAVE_KEY,defaults}=await moduleFrom('src/systems/GameState.js');
const {SocialSystem,FRIEND_IDS,FRIENDS,MAX_HEARTS,normalizeSocial,heartDisplay,dialogueFor}=await moduleFrom('src/systems/SocialSystem.js');
const store=new Map();
globalThis.localStorage={
 getItem:k=>store.get(k)??null,
 setItem:(k,v)=>store.set(k,String(v)),
 removeItem:k=>store.delete(k)
};
test('four NPCs have unique names and preserved original game save key',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 assert.deepEqual(FRIEND_IDS,['sari','chef','tani','nia']);
 assert.equal(new Set(Object.values(FRIENDS).map(p=>p.name)).size,4);
 assert.equal(defaults().social.friends.nia.hearts,0);
});
test('old saves without social data migrate without deleting quest and inventory',()=>{
 store.clear();
 store.set(SAVE_KEY,JSON.stringify({coins:34,day:3,inventory:{telur:2},recipeKnown:true,done:true}));
 const g=new GameState();
 const social=new SocialSystem(g);
 assert.equal(g.data.coins,34);
 assert.equal(g.data.inventory.telur,2);
 assert.equal(g.data.done,true);
 assert.equal(social.all().length,4);
 assert.ok(social.all().every(p=>p.hearts===0));
 const p=social.greet('tani',0);
 assert.equal(p.hearts,1);
 assert.equal(JSON.parse(store.get(SAVE_KEY)).social.friends.tani.hearts,1);
});
test('one heart per NPC per in-game day and maximum five hearts',()=>{
 store.clear();
 const g=new GameState(),social=new SocialSystem(g);
 assert.equal(social.greet('nia',0).gained,true);
 assert.equal(social.greet('nia',2).gained,false);
 assert.equal(social.profile('nia').hearts,1);
 assert.equal(social.profile('tani').hearts,0);
 for(let day=2;day<=8;day++){
  g.data.day=day;
  social.greet('nia',1);
 }
 assert.equal(social.profile('nia').hearts,MAX_HEARTS);
 assert.equal(social.greet('nia',2).gained,false);
 assert.equal(social.profile('nia').lastTalkDay,8);
 assert.equal(social.profile('tani').hearts,0);
});
test('daily dialogues vary by NPC, day and phase',()=>{
 assert.notEqual(dialogueFor('nia',1,0),dialogueFor('nia',1,1));
 assert.notEqual(dialogueFor('nia',1,0),dialogueFor('nia',2,0));
 assert.notEqual(dialogueFor('tani',1,0),dialogueFor('chef',1,0));
 assert.equal(dialogueFor('unknown',1,0),'');
 assert.equal(heartDisplay(0),'🤍'.repeat(5));
 assert.equal(heartDisplay(5),'❤️'.repeat(5));
});
test('corrupt friendship data is safely normalized and reset clears hearts',()=>{
 assert.deepEqual(normalizeSocial({friends:{sari:{hearts:999,lastTalkDay:-4}}}).friends.sari,
  {hearts:5,lastTalkDay:0});
 const g=new GameState(),social=new SocialSystem(g);
 social.greet('tani');
 g.reset();
 assert.equal(social.profile('tani').hearts,0);
 assert.equal(social.greet('tani').hearts,1);
});
test('NPC patrol routes stay on walkable paths and map is unchanged',async()=>{
 const {canStand,LAYOUT,OBSTACLES}=await moduleFrom('src/world/WorldGeometry.js');
 for(const [name,points] of Object.entries({
  tani:[[403,189],[402,230],[407,247],[400,201],[405,226],[407,249],[398,248],[399,208],[402,204]],
  nia:[[405,317],[414,282],[484,282],[483,315],[405,316],[412,286],[482,286],[479,314],[412,280],[481,280],[479,252],[417,280]]
 })){
  for(const [x,y] of points){
   assert.equal(canStand(x,y,OBSTACLES),true,name+' patrol point '+x+','+y);
  }
 }
 assert.deepEqual([LAYOUT.home.x,LAYOUT.village.x,LAYOUT.pond.x,LAYOUT.market.y,LAYOUT.restaurant.y,LAYOUT.store.x],
  [45,500,805,339,339,806]);
 assert.equal(OBSTACLES.length,34);
});
