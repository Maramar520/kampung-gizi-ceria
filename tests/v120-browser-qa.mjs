// Browser regression: real Chromium desktop + Pixel 7 touch emulation.
// Run from repo root: node tests/v120-browser-qa.mjs
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium,devices} from 'playwright';
import {mkdir} from 'node:fs/promises';
const port=8766,url='http://127.0.0.1:'+port+'/?qa=1';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
async function ready(){for(let i=0;i<100;i++){try{if((await fetch(url)).ok)return;}catch{}await sleep(150);}throw Error('HTTP server unavailable');}
async function boot(page){await page.goto(url);await page.waitForFunction(()=>window.__kampungQA?.scene?.getScene('UIScene')?.scene?.isActive?.(),null,{timeout:30000});}
async function setPosition(page,x,y){await page.evaluate(([x,y])=>{const g=window.__kampungQA,w=g.scene.getScene('WorldScene');g.state.data.x=x;g.state.data.y=y;w.player.sprite.setPosition(x,y);w.keysHeld.clear();},[x,y]);}
async function run(name,opts,mobile){
 const context=await browser.newContext(opts),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await boot(page);
 // Pastikan jalan Alun-Alun → Puskesmas benar-benar dibuat di scene.
 const road=await page.evaluate(()=>{
  const w=window.__kampungQA.scene.getScene('WorldScene'),g=w.clinicMainRoad;
  return {exists:!!g,visible:g?.visible,depth:g?.depth,width:w.cameras.main._bounds?.width};
 });
 assert.ok(road.exists&&road.visible&&road.depth>=0,'Jalan utama Puskesmas tidak ter-render');
 assert.ok(road.width>=1720,'Peta timur harus mencakup Puskesmas');
 await mkdir('qa-artifacts',{recursive:true});
 await setPosition(page,1500,290);
 await page.screenshot({path:'qa-artifacts/v120-'+name+'-puskesmas-road.png',fullPage:true});
 await setPosition(page,650,135);
 if(mobile)await page.locator('#action').tap();else await page.keyboard.press('e');
 await page.locator('#dialog:not(.hidden)').waitFor({timeout:5000});
 assert.match(await page.locator('#dialogTitle').textContent(),/Perpustakaan/i);
 await page.locator('#close').click();
 await page.locator('#dialog').waitFor({state:'hidden'});
 const positions=await page.evaluate(()=>{
  const w=window.__kampungQA.scene.getScene('WorldScene'),npc=w.beachVisitors[0],start={x:npc.x,y:npc.y};
  npc.setRoutine([{x:430,y:652},{x:530,y:652}],npc.name,false);
  for(let i=0;i<80;i++)npc.update(.05);
  return {start,end:{x:npc.x,y:npc.y},player:{x:w.player.sprite.x,y:w.player.sprite.y}};
 });
 assert.ok(positions.end.x>positions.start.x+30,'NPC must actually move across the map');
 // Save progress and reload; original localStorage key must remain unchanged.
 await page.evaluate(()=>{const s=window.__kampungQA.state;s.data.coins=137;s.data.inventory.apel=3;s.save();});
 await page.reload();await page.waitForFunction(()=>window.__kampungQA?.scene?.getScene('UIScene')?.scene?.isActive?.(),null,{timeout:30000});
 const save=await page.evaluate(()=>({coins:window.__kampungQA.state.data.coins,apel:window.__kampungQA.state.data.inventory.apel,key:localStorage.getItem('kampung-gizi-pixel-v02')}));
 assert.equal(save.coins,137);assert.equal(save.apel,3);assert.ok(save.key);
 const dims=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,canvas:document.querySelector('#game canvas').getBoundingClientRect().width}));
 assert.ok(dims.canvas<=dims.viewport+2,'Canvas overflows viewport');
 if(mobile)assert.ok(dims.width<=dims.viewport+2,'Mobile page horizontally overflows');
 assert.deepEqual(errors,[],'Uncaught browser errors');
 await mkdir('qa-artifacts',{recursive:true});
 await page.screenshot({path:'qa-artifacts/v120-'+name+'.png',fullPage:true});
 console.log('PASS',name,'E/AKSI, NPC movement, localStorage save/reload, viewport');
 await context.close();
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await run('desktop',{viewport:{width:1280,height:850}},false);
 await run('mobile',{...devices['Pixel 7'],viewport:{width:393,height:852}},true);
}catch(e){console.error('FAIL v1.20 browser QA',e);process.exitCode=1;}
finally{await browser?.close();server.kill('SIGTERM');}
