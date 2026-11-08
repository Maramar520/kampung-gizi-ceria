import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LAYOUT,WORLD_WIDTH,canStand} from '../src/world/WorldGeometry.js';
const source=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('east road physically connects six-block main road to both destinations',()=>{
 const art=source('src/world/TownExpansionArt.js');
 assert.match(art,/rect\(948,261,392,49/);
 assert.match(art,/rect\(1134,227,42,122/);
 assert.equal(WORLD_WIDTH,1340);
 for(const [x,y] of [[948,281],[960,281],[1155,281],[1155,250],[1155,320],[1155,345]])
  assert.equal(canStand(x,y),true,'road should be walkable at '+x+','+y);
 assert.equal(LAYOUT.plaza.x,1005);assert.equal(LAYOUT.townHall.x,1025);
});
test('festival market decorations and market-only actions are absent',()=>{
 const scene=source('src/scenes/WorldScene.js'),ui=source('src/scenes/UIScene.js');
 assert.doesNotMatch(scene,/new FestivalArt\(/);
 assert.doesNotMatch(ui,/menghias pasar|Kembali ke Pasar/);
 assert.match(ui,/menghias Alun-Alun/);
 assert.match(source('src/world/TownExpansionArt.js'),/PANGGUNG FESTIVAL/);
});
test('new version and map controls are exposed for desktop and mobile',()=>{
 const html=source('index.html');
 for(const id of ['goEast','goWest','townOverview'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.doesNotMatch(html,/id="minimap"/);
 assert.match(source('src/scenes/UIScene.js'),/cam\.startFollow\(this\.world\.player\.sprite/);
});
