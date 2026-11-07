// Chromium end-to-end smoke test. Runs against a local static server, not GitHub Pages.
// Use: npm install --no-save playwright && npx playwright install chromium && node tests/browser-smoke.mjs
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';

const PORT=8765, URL='http://127.0.0.1:'+PORT+'/?qa=1';
const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=n=>new Promise(resolve=>setTimeout(resolve,n));
async function serverReady(){
 for(let attempt=0;attempt<80;attempt++){
  try{const response=await fetch(URL);if(response.ok)return;}catch{}
  await sleep(150);
 }
 throw Error('Local HTTP server never became ready');
}
const errors=[];
async function waitGame(page){
 page.on('pageerror',err=>errors.push(err.message));
 await page.goto(URL,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__kampungQA?.scene?.getScene?.('UIScene')?.scene?.isActive?.(),null,{timeout:30000});
 await page.waitForFunction(()=>document.querySelector('#coins')?.textContent?.length>0);
}
async function moveTo(page,x,y){
 await page.evaluate(({x,y})=>{
  const game=window.__kampungQA,world=game.scene.get('WorldScene');
  game.state.data.x=x;game.state.data.y=y;
  world.keysHeld.clear();world.player.sprite.setPosition(x,y);
 },{x,y});
}
async function actionAt(page,x,y,dialogName){
 await moveTo(page,x,y);
 await page.keyboard.press('e');
 await page.locator('#dialog:not(.hidden)').waitFor();
 if(dialogName)assert.match(await page.locator('#dialogTitle').textContent(),new RegExp(dialogName,'i'));
}
async function close(page){await page.locator('#close').click();await page.locator('#dialog').waitFor({state:'hidden'});}
async function testDesktop(browser){
 const context=await browser.newContext({viewport:{width:1280,height:850},deviceScaleFactor:1});
 const page=await context.newPage();
 await waitGame(page);
 const gameData=()=>page.evaluate(()=>({...window.__kampungQA.state.data}));
 const dimensions=await page.evaluate(()=>({canvas:document.querySelector('#game canvas')?.getBoundingClientRect().toJSON(),viewport:innerWidth}));
 assert.ok(dimensions.canvas.width<=dimensions.viewport);
 await mkdir('qa-artifacts',{recursive:true});
 await page.screenshot({path:'qa-artifacts/desktop-map.png',fullPage:true});
 await page.locator('[data-open-notebook="inventory"]').click();
 await page.locator('#notebook:not(.hidden)').waitFor();
 assert.match(await page.locator('#notebookTitle').textContent(),/Tas/);
 await page.keyboard.press('Escape');
 await page.locator('#notebook').waitFor({state:'hidden'});

 // Visit all eight action zones, not just shortcut names.
 for(const z of [
  [120,203,'Kebun'],[155,335,'Pasar'],[810,330,'Chef'],
  [320,242,'Kasur'],[553,233,'Dapur|Menu|Masakan'],
  [350,477,'Bu Sari'],[803,194,'Kandang'],[769,486,'Kolam']]){
   await actionAt(page,z[0],z[1],z[2]);
   await close(page);
 }

 // Real keyboard interaction: shop and learn recipe.
 await actionAt(page,155,335,'Pasar');
 for(const name of ['beras','telur','bayam'])
  await page.getByRole('button',{name:new RegExp('Beli '+name+' ') }).first().click();
 await close(page);
 await actionAt(page,810,330,'Chef');
 await page.getByRole('button',{name:/Pelajari Nasi Telur Sayur/}).click();
 await close(page);
 assert.equal((await gameData()).recipeKnown,true);

 // Cooking input requires real click, hold, and timing.
 await actionAt(page,553,233,'Menu');
 await page.getByRole('button',{name:/Nasi Telur Sayur.*siap/}).click();
 for(let i=0;i<5;i++)await page.locator('#miniButton').click();
 await page.waitForFunction(()=>document.querySelector('#dialogTitle')?.textContent?.includes('2/3'));
 let area=await page.locator('#miniButton').boundingBox();
 await page.mouse.move(area.x+area.width/2,area.y+area.height/2);
 await page.mouse.down();await sleep(2300);await page.mouse.up();
 await page.waitForFunction(()=>document.querySelector('#dialogTitle')?.textContent?.includes('3/3'),null,{timeout:5000});
 for(let i=0;i<90;i++){
  const state=await page.locator('#dialogTitle').textContent();
  if(state.includes('berhasil'))break;
  const pos=await page.locator('#timingMarker').evaluate(el=>parseFloat(el.style.left||'0'));
  if(pos>=40&&pos<=60)await page.locator('#miniButton').click();
  await sleep(75);
 }
 assert.match(await page.locator('#dialogTitle').textContent(),/berhasil/i);
 await close(page);
 assert.equal((await gameData()).cooked,true);
 await actionAt(page,350,477,'Quest selesai');
 await close(page);
 assert.equal((await gameData()).done,true);

 // Visit daily activities as a player.
 await actionAt(page,803,194,'Kandang');
 await page.getByRole('button',{name:/Beri pakan ayam/}).click();
 await page.getByRole('button',{name:/Kumpulkan 2 telur/}).click();
 await close(page);
 await actionAt(page,769,486,'Kolam');
 for(let i=0;i<3;i++){
  await page.getByRole('button',{name:/Lempar kail/}).click();
 }
 await page.getByRole('button',{name:/Selesai/}).click();
 await page.locator('#dialog').waitFor({state:'hidden'});
 const inventory=await gameData();
 assert.equal(inventory.inventory.telur,2);
 assert.equal(inventory.inventory.ikan,1);
 await page.screenshot({path:'qa-artifacts/desktop-after-quest.png',fullPage:true});
 await context.close();
}
async function testMobile(browser){
 const context=await browser.newContext({...devices['Pixel 7'],viewport:{width:393,height:852}});
 const page=await context.newPage();
 await waitGame(page);
 const dpad=await page.locator('[data-dir="up"]').boundingBox();
 const action=await page.locator('#action').boundingBox();
 assert.ok(dpad.width>=44&&dpad.height>=44,'D-pad touch target too small');
 assert.ok(action.height>=44,'Action touch target too small');
 const layout=await page.evaluate(()=>({
  documentWidth:document.documentElement.scrollWidth,
  viewport:document.documentElement.clientWidth,
  canvas:document.querySelector('#game canvas').getBoundingClientRect().width
 }));
 assert.ok(layout.documentWidth<=layout.viewport+2,'Page horizontally overflows viewport');
 assert.ok(layout.canvas<=layout.viewport,'Game canvas exceeds mobile viewport');
 await page.locator('[data-dir="up"]').tap();
 await page.locator('[data-open-notebook="journal"]').tap();
 assert.match(await page.locator('#notebookTitle').textContent(),/Jurnal/);
 await page.locator('#notebookClose').tap();
 await page.locator('#notebook').waitFor({state:'hidden'});
 await page.screenshot({path:'qa-artifacts/mobile-map.png',fullPage:true});
 await context.close();
}
await serverReady();
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 await testDesktop(browser);
 await testMobile(browser);
 assert.deepEqual(errors,[],'Uncaught browser errors');
 console.log('PASS desktop full quest + farming/fishing and mobile touch layout');
}catch(error){console.error('Browser QA failed:',error);process.exitCode=1;}
finally{await browser.close();server.kill('SIGTERM');}
