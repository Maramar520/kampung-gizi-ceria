import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const moduleFromSource=async path=>import('data:text/javascript;base64,'+Buffer.from(source(path)).toString('base64'));
const {GameState,defaults,SAVE_KEY}=await moduleFromSource('src/systems/GameState.js');
const {CookingSystem,INGREDIENTS}=await moduleFromSource('src/systems/CookingSystem.js');
const {QuestSystem}=await moduleFromSource('src/systems/QuestSystem.js');

let store=new Map();
globalThis.localStorage={
 getItem:key=>store.get(key)??null,
 setItem:(key,value)=>store.set(key,String(value)),
 removeItem:key=>store.delete(key)
};

test('pemain lama menggunakan key LocalStorage yang sama',()=>{
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
 store.clear();
 const game=new GameState();
 assert.equal(game.data.coins,100);
 game.data.coins=65;
 game.save();
 const restored=new GameState();
 assert.equal(restored.data.coins,65);
});

test('memasak hanya memakai bahan ketika resep dan ketiga bahan lengkap',()=>{
 store.clear();
 const state=new GameState();
 const cooking=new CookingSystem(state);
 const before=state.data.energy;
 assert.equal(cooking.finish(),false);
 assert.equal(state.data.energy,before);
 state.data.recipeKnown=true;
 assert.equal(cooking.finish(),false);
 for(const [ingredient] of INGREDIENTS)state.data.inventory[ingredient]=1;
 assert.deepEqual(cooking.missing,[]);
 assert.equal(cooking.finish(),true);
 assert.equal(state.data.cooked,true);
 for(const [ingredient] of INGREDIENTS)assert.equal(state.data.inventory[ingredient],0);
 assert.equal(state.data.carb,65);
 assert.equal(state.data.protein,50);
 assert.equal(state.data.vitamin,50);
 assert.equal(state.data.energy,before-10);
 assert.equal(cooking.finish(),false);
});

test('hadiah quest diberikan tepat sekali',()=>{
 store.clear();
 const state=new GameState();
 const quest=new QuestSystem(state);
 assert.equal(quest.complete(),false);
 state.data.cooked=true;
 assert.equal(quest.complete(),true);
 assert.equal(state.data.coins,150);
 assert.equal(state.data.done,true);
 assert.equal(quest.complete(),false);
 assert.equal(state.data.coins,150);
});

test('integrasi minigame masih mempertahankan tiga input pemain berbeda',()=>{
 const mini=source('src/systems/CookingMinigame.js');
 assert.match(mini,/step===0/);
 assert.match(mini,/step===1/);
 assert.match(mini,/pointerdown/);
 assert.match(mini,/timing-track/);
 assert.match(mini,/click/);
 assert.match(source('src/scenes/UIScene.js'),/this\.minigame\.mount/);
 assert.match(source('src/scenes/WorldScene.js'),/playInteraction/);
 assert.match(source('src/world/WorldArt.js'),/room\('home'/);
 assert.match(source('src/world/WorldArt.js'),/room\('village'/);
 assert.match(source('src/world/WorldArt.js'),/room\('store'/);
});
