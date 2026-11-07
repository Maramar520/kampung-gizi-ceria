import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=async path=>import('data:text/javascript;base64,'+
 Buffer.from(readFileSync(new URL('../'+path,import.meta.url),'utf8')).toString('base64'));
const {TimeWeatherSystem,PHASES,PHASE_SECONDS,weatherForDay,normalizeTime,describeTime}=await load('src/systems/TimeWeatherSystem.js');
const {GameState,SAVE_KEY}=await load('src/systems/GameState.js');
const {LAYOUT,INTERACTIONS,OBSTACLES}=await load('src/world/WorldGeometry.js');
const map=new Map();
globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),
 removeItem:k=>map.delete(k)};
test('four phases include a persistent night, returning to morning after sleeping',()=>{
 map.clear();const state=new GameState(),clock=new TimeWeatherSystem(state);
 assert.deepEqual(PHASES,['Pagi','Siang','Sore','Malam']);
 assert.equal(PHASE_SECONDS,35);
 assert.equal(clock.phase,0);
 for(const expected of [1,2,3]){
  for(let i=0;i<PHASE_SECONDS;i++)clock.advance(1000);
  assert.equal(clock.phase,expected);
 }
 for(let i=0;i<PHASE_SECONDS*4;i++)clock.advance(1000);
 assert.equal(clock.phase,3,'night must not automatically increment the day');
 assert.equal(state.data.day,1);
 state.data.day++;
 clock.startDay();
 assert.equal(clock.phase,0);
 assert.equal(clock.weather,'Hujan');
});
test('weather is deterministic for a game day and reset supports legacy saves',()=>{
 assert.equal(weatherForDay(1),'Cerah');
 assert.equal(weatherForDay(2),'Hujan');
 assert.equal(weatherForDay(3),'Cerah');
 assert.equal(weatherForDay(5),'Berawan');
 assert.equal(normalizeTime({phase:8,weather:'Hujan'},1).phase,0);
 assert.equal(normalizeTime({phase:3,weather:'Cerah'},2).weather,'Hujan');
 assert.match(describeTime({phase:3,weather:'Hujan'}).label,/Malam.*Hujan/);
 map.clear();map.set(SAVE_KEY,JSON.stringify({day:2,coins:33,done:true,
  social:{friends:{nia:{hearts:4,lastTalkDay:1}}},learning:{stars:7}}));
 const state=new GameState(),clock=new TimeWeatherSystem(state);
 assert.equal(state.data.coins,33);
 assert.equal(state.data.done,true);
 assert.equal(state.data.social.friends.nia.hearts,4);
 assert.equal(state.data.learning.stars,7);
 assert.equal(clock.weather,'Hujan');
 assert.equal(clock.phase,0);
});
test('rain waters planted plots automatically but cannot create plants or coins',()=>{
 map.clear();const state=new GameState();
 const plot={crop:'bayam',plantedDay:2,watered:false};
 state.data.day=2;state.data.garden.plots[0]=plot;
 const coins=state.data.coins,clock=new TimeWeatherSystem(state);
 assert.equal(clock.rainWater(),0,'constructor already waters plants');
 assert.equal(plot.watered,true);
 state.data.garden.plots[1]={crop:'tomat',plantedDay:2,watered:false};
 assert.equal(clock.advance(16),false);
 assert.equal(state.data.garden.plots[1].watered,true);
 assert.equal(state.data.garden.plots[2],null);
 assert.equal(state.data.coins,coins);
 state.data.day=3;clock.startDay();
 state.data.garden.plots[2]={crop:'bayam',plantedDay:3,watered:false};
 clock.advance(16);assert.equal(state.data.garden.plots[2].watered,false);
});
test('clock persists phase through reload and reset clears it',()=>{
 map.clear();const state=new GameState(),clock=new TimeWeatherSystem(state);
 assert.equal(clock.setPhase(3),true);
 const saved=new GameState(),again=new TimeWeatherSystem(saved);
 assert.equal(again.phase,3);
 assert.equal(again.setPhase(99),false);
 saved.reset();again.startDay();assert.equal(again.phase,0);
});
test('NPC daily routines and visual layers do not change original map or collisions',()=>{
 assert.deepEqual([LAYOUT.home.x,LAYOUT.village.x,LAYOUT.pond.x,LAYOUT.market.y,LAYOUT.restaurant.y,LAYOUT.store.x],
 [45,500,805,339,339,806]);
 assert.equal(INTERACTIONS.length,14);
 assert.equal(OBSTACLES.length,34);
 const world=readFileSync(new URL('../src/scenes/WorldScene.js',import.meta.url),'utf8');
 assert.match(world,/this\.clock\.phase/);
 assert.match(world,/phase===3/);
 assert.match(world,/raining/);
 assert.match(world,/new WeatherArt/);
});
