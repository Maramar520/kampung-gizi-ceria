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
  const game=window.__kampungQA,world=game.scene.getScene('WorldScene');
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
 // Verify actual keyboard movement before using the QA teleport bridge.
 const yBefore=await page.evaluate(()=>window.__kampungQA.state.data.y);
 await page.locator('#game canvas').click({position:{x:470,y:300}});
 let yAfter=yBefore;
 for(let attempt=0;attempt<3;attempt++){
  await page.keyboard.down('w');await sleep(450);await page.keyboard.up('w');
  yAfter=await page.evaluate(()=>window.__kampungQA.state.data.y);
  if(yAfter<yBefore-8)break;
  await sleep(230);
 }
 assert.ok(yAfter<yBefore-8,'W key must move the player north after canvas receives focus');
 await mkdir('qa-artifacts',{recursive:true});
 await page.screenshot({path:'qa-artifacts/desktop-map.png',fullPage:true});
 // v1.7: advance only the in-game clock (QA bridge), render night without moving buildings.
 await page.evaluate(()=>{
  const world=window.__kampungQA.scene.getScene('WorldScene');
  world.clock.setPhase(3);
  world.weatherArt.update(world.time.now,true);
  world.updateRoutines();
  world.scene.get('UIScene').refresh();
 });
 assert.match(await page.locator('#weather').textContent(),/Malam/);
 await page.screenshot({path:'qa-artifacts/desktop-night.png',fullPage:true});
 await page.evaluate(()=>{
  const world=window.__kampungQA.scene.getScene('WorldScene');
  world.clock.setPhase(0);world.weatherArt.update(world.time.now,true);world.updateRoutines();
 });

 await page.locator('[data-open-notebook="inventory"]').click();
 await page.locator('#notebook:not(.hidden)').waitFor();
 assert.match(await page.locator('#notebookTitle').textContent(),/Tas/);
 await page.keyboard.press('Escape');
 await page.locator('#notebook').waitFor({state:'hidden'});

 // Visit all ten zones of the original SVG layout, using real UI actions.
 for(const z of [
  [320,141,'Kebun'],[208,374,'Pasar'],[619,465,'Chef'],
  [128,162,'Kasur'],[194,161,'Menu|Masakan'],
  [325,221,'Kandang'],[869,246,'Kolam'],
  [869,373,'Toko Swalayan'],[607,205,'Rumah Warga'],[650,135,'Perpustakaan']]){
   await actionAt(page,z[0],z[1],z[2]);
   await close(page);
 }
 // v1.5: two new villagers and one-heart-per-day interactions.
 for(const [id,title] of [['tani','Pak Tani'],['nia','Nia']]){
  const position=await page.evaluate(id=>{
   const n=window.__kampungQA.scene.getScene('WorldScene')[id];
   return {x:n.x,y:n.y};
  },id);
  await actionAt(page,position.x,position.y,title);
  assert.match(await page.locator('#message').textContent(),/1 hati hari ini/);
  await close(page);
  const again=await page.evaluate(id=>{
   const n=window.__kampungQA.scene.getScene('WorldScene')[id];
   return {x:n.x,y:n.y};
  },id);
  await actionAt(page,again.x,again.y,title);
  assert.match(await page.locator('#message').textContent(),/Sudah menyapa hari ini/);
  await close(page);
 }
 await page.locator('#friendsButton').click();
 await page.locator('#dialog:not(.hidden)').waitFor();
 assert.match(await page.locator('#dialogTitle').textContent(),/Buku Pertemanan/);
 assert.equal(await page.locator('.social-friend').count(),5);
 assert.equal(await page.locator('.social-hearts').count(),5);
 await close(page);
 // v1.8 — help Kak Rani sort vegetable books; wrong shelf can be retried.
 const raniLocation=await page.evaluate(()=>{
  const n=window.__kampungQA.scene.getScene('WorldScene').rani;return {x:n.x,y:n.y};
 });
 await actionAt(page,raniLocation.x,raniLocation.y,'Kak Rani');
 await page.getByRole('button',{name:/Bantu merapikan buku/}).click();
 await page.getByRole('button',{name:/Rak Peralatan Memasak/}).click();
 assert.match(await page.locator('#dialogTitle').textContent(),/Coba lagi/);
 await page.getByRole('button',{name:/Coba rak lainnya/}).click();
 await page.getByRole('button',{name:/Rak Sayuran/}).click();
 assert.equal((await gameData()).missions.progress.help,1);
 await page.getByRole('button',{name:/Kembali ke Kak Rani/}).click();
 await close(page);
 // v1.6 — nutrition quiz through actual buttons, including wrong-answer retry.
 await page.locator('#learningButton').click();
 assert.match(await page.locator('#dialogTitle').textContent(),/Pergi ke Perpustakaan Gizi/);
 await close(page);
 // Kuis and Isi Piringku are now accessed inside the open library room.
 await actionAt(page,650,135,'Perpustakaan Gizi');
 await page.getByRole('button',{name:/Kuis makanan bergizi/}).click();
 let firstWrong=true;
 for(let i=0;i<3;i++){
  const correct=await page.evaluate(index=>{
   const learning=window.__kampungQA.scene.getScene('UIScene').learning;
   return learning.questions()[index].correct;
  },i);
  if(firstWrong){
   await page.locator('#choices button').nth((correct+1)%4).click();
   assert.match(await page.locator('#dialogTitle').textContent(),/coba lagi/i);
   await page.getByRole('button',{name:/Coba pilihan lain/}).click();
   firstWrong=false;
  }
  await page.locator('#choices button').nth(correct).click();
  assert.match(await page.locator('#dialogTitle').textContent(),/Jawaban tepat/);
  await page.locator('#choices button').first().click();
 }
 assert.equal((await gameData()).learning.stars,3);
 assert.equal((await gameData()).learning.quiz.completed,1);
 await page.getByRole('button',{name:/Kembali ke menu belajar/}).click();
 await page.getByRole('button',{name:/Isi Piringku/}).click();
 const plateChoices=['Nasi','Telur','Kangkung','Pisang'];
 for(const name of plateChoices){
  assert.equal(await page.locator('.plate-piece').count(),6);
  await page.getByRole('button',{name:new RegExp(name)}).click();
  assert.match(await page.locator('#dialogTitle').textContent(),/Bagus!/);
  await page.locator('#choices button').first().click();
 }
 assert.match(await page.locator('#dialogTitle').textContent(),/Isi Piringku Selesai/);
 assert.equal((await gameData()).learning.stars,5);
 assert.equal((await gameData()).learning.plate.completed,1);
 const coinsAfterLearning=(await gameData()).coins;
 await page.getByRole('button',{name:/Kembali belajar/}).click();
 await page.getByRole('button',{name:/Kuis Gizi/}).click();
 for(let i=0;i<3;i++){
  const correct=await page.evaluate(index=>window.__kampungQA.scene.getScene('UIScene').learning.questions()[index].correct,i);
  await page.locator('#choices button').nth(correct).click();
  await page.locator('#choices button').first().click();
 }
 assert.equal((await gameData()).learning.stars,5);
 assert.equal((await gameData()).coins,coinsAfterLearning);
 await close(page);
 // v1.8: learning is a daily task, claimed once, with permanent badge.
 await page.locator('#missionsButton').click();
 assert.match(await page.locator('#dialogTitle').textContent(),/Misi Harian/);
 await page.getByRole('button',{name:/Klaim Belajar gizi/}).click();
 assert.equal((await gameData()).missions.claimed.includes('learn'),true);
 await page.getByRole('button',{name:/Klaim Membantu Kak Rani/}).click();
 assert.equal((await gameData()).missions.claimed.includes('help'),true);
 await page.getByRole('button',{name:/Lencana Pencapaian/}).click();
 await page.getByRole('button',{name:/Klaim Pembaca Gizi/}).click();
 assert.equal((await gameData()).missions.achievements.includes('first-learning'),true);
 await close(page);
 // v1.4: play actions through actual dialogs, then verify the rendered pose.
 await actionAt(page,320,141,'Kebun');
 await page.getByRole('button',{name:/Tanam Bayam.*Petak 1/}).click();
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').activity.active),'plant');
 await page.getByRole('button',{name:/Siram Bayam.*Petak 1/}).click();
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').activity.active),'water');
 await close(page);
 // Misi tanam milik hari pertama; klaim sebelum tidur mengganti hari.
 await page.locator('#missionsButton').click();
 await page.getByRole('button',{name:/Klaim Menanam satu bibit/}).click();
 assert.equal((await gameData()).missions.claimed.includes('plant'),true);
 await close(page);
 await actionAt(page,128,162,'Kasur');
 await page.getByRole('button',{name:/Tidur hingga pagi/}).click();
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').activity.active),'sleep');
 assert.match(await page.locator('#weather').textContent(),/Pagi.*Hujan/);
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').clock.weather),'Hujan');

 // A new day enables another greeting and the heart survives game saves.
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').social.profile('tani').hearts),1);
 await close(page);
 const farmerNow=await page.evaluate(()=>{
  const n=window.__kampungQA.scene.getScene('WorldScene').tani;
  return {x:n.x,y:n.y};
 });
 await actionAt(page,farmerNow.x,farmerNow.y,'Pak Tani');
 assert.match(await page.locator('#message').textContent(),/\+1 hati hari ini/);
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').social.profile('tani').hearts),2);
 await close(page);
 await actionAt(page,320,141,'Kebun');
 await page.getByRole('button',{name:/Panen Bayam.*Petak 1/}).click();
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').activity.active),'harvest');
 await close(page);
 await page.locator('#missionsButton').click();
 await page.getByRole('button',{name:/Klaim Memanen sayuran/}).click();
 assert.equal((await gameData()).missions.claimed.includes('harvest'),true);
 await close(page);

 const currentSari=await page.evaluate(()=>{
  const n=window.__kampungQA.scene.getScene('WorldScene').sari;
  return {x:n.x,y:n.y};
 });
 await actionAt(page,currentSari.x,currentSari.y,'Bu Sari');
 await close(page);

 // Real keyboard interaction: shop and learn recipe.
 await actionAt(page,208,374,'Pasar');
 for(const name of ['beras','telur','bayam'])
  await page.getByRole('button',{name:new RegExp('Beli '+name+' ') }).first().click();
 await close(page);
 await actionAt(page,619,466,'Chef');
 await page.getByRole('button',{name:/Pelajari Nasi Telur Sayur/}).click();
 await close(page);
 assert.equal((await gameData()).recipeKnown,true);

 // Cooking input requires real click, hold, and timing.
 await actionAt(page,194,161,'Menu');
 await page.getByRole('button',{name:/Nasi Telur Sayur.*siap/}).click();
 for(let i=0;i<5;i++)await page.locator('#miniButton').click();
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').activity.active),'cook');
 await page.waitForFunction(()=>document.querySelector('#dialogTitle')?.textContent?.includes('2/3'));
 let area=await page.locator('#miniButton').boundingBox();
 await page.mouse.move(area.x+area.width/2,area.y+area.height/2);
 await page.mouse.down();await sleep(2300);await page.mouse.up();
 await page.waitForFunction(()=>document.querySelector('#dialogTitle')?.textContent?.includes('3/3'),null,{timeout:5000});
 for(let i=0;i<160;i++){
  const complete=await page.evaluate(()=>{
   const title=document.querySelector('#dialogTitle')?.textContent||'';
   if(title.includes('berhasil'))return true;
   const marker=document.getElementById('timingMarker');
   const button=document.getElementById('miniButton');
   if(marker&&button){
    const pos=parseFloat(marker.style.left||'0');
    if(pos>=39&&pos<=61)button.click();
   }
   return false;
  });
  if(complete)break;
  await sleep(40);
 }
 assert.match(await page.locator('#dialogTitle').textContent(),/berhasil/i);
 await close(page);
 assert.equal((await gameData()).cooked,true);
 const sari=await page.evaluate(()=>{
  const npc=window.__kampungQA.scene.getScene('WorldScene').sari;
  return {x:npc.x,y:npc.y};
 });
 await actionAt(page,sari.x,sari.y,'Quest selesai');
 await close(page);
 assert.equal((await gameData()).done,true);

 // Visit daily activities as a player.
 await actionAt(page,325,221,'Kandang');
 await page.getByRole('button',{name:/Beri pakan ayam/}).click();
 await page.getByRole('button',{name:/Kumpulkan 2 telur/}).click();
 await close(page);
 await actionAt(page,869,246,'Kolam');
 await page.getByRole('button',{name:/Lempar kail/}).click();
 assert.equal(await page.evaluate(()=>window.__kampungQA.scene.getScene('WorldScene').activity.active),'fish');
 for(let i=1;i<3;i++){
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
 // Regression for v1.1 screenshot: quest previously had a narrow column.
 const questLayout=await page.evaluate(()=>{
  const quest=document.getElementById('quest').getBoundingClientRect();
  const bottom=document.querySelector('.bottom').getBoundingClientRect();
  return {questWidth:quest.width,bottomWidth:bottom.width,questHeight:quest.height};
 });
 assert.ok(questLayout.questWidth>=questLayout.bottomWidth*.92,
  'Mobile quest must fill the available row, not squeeze beside action buttons');
 assert.ok(questLayout.questHeight<260,'Mobile quest should not stretch into an excessively tall column');

 await page.locator('[data-dir="up"]').tap();
 await page.locator('#learningButton').tap();
 assert.match(await page.locator('#dialogTitle').textContent(),/Pergi ke Perpustakaan Gizi/);
 await page.locator('#close').tap();
 await page.locator('#dialog').waitFor({state:'hidden'});
 await moveTo(page,650,135);
 await page.locator('#action').tap();
 assert.match(await page.locator('#dialogTitle').textContent(),/Perpustakaan Gizi/);
 await page.getByRole('button',{name:/Tantangan Isi Piringku/}).tap();
 assert.equal(await page.locator('.plate-piece').count(),6);
 await page.getByRole('button',{name:/Nasi/}).tap();
 await page.getByRole('button',{name:/Isi bagian berikutnya/}).tap();
 assert.equal(await page.locator('.plate-piece').count(),6);
 await page.locator('#close').tap();
 await page.locator('#dialog').waitFor({state:'hidden'});
 await page.locator('#missionsButton').tap();
 assert.match(await page.locator('#dialogTitle').textContent(),/Misi Harian/);
 await page.locator('#close').tap();
 await page.locator('#dialog').waitFor({state:'hidden'});
 await page.locator('#friendsButton').tap();
 assert.match(await page.locator('#dialogTitle').textContent(),/Buku Pertemanan/);
 assert.equal(await page.locator('.social-friend').count(),5);
 await page.locator('#close').tap();
 await page.locator('#dialog').waitFor({state:'hidden'});
 // Mobile: tap the real AKSI button beside Nia and close the full-screen dialog.
 const niaMobile=await page.evaluate(()=>{
  const n=window.__kampungQA.scene.getScene('WorldScene').nia;
  return {x:n.x,y:n.y};
 });
 await moveTo(page,niaMobile.x,niaMobile.y);
 await page.locator('#action').tap();
 await page.locator('#dialog:not(.hidden)').waitFor();
 assert.match(await page.locator('#dialogTitle').textContent(),/Nia/);
 await page.locator('#close').tap();
 await page.locator('#dialog').waitFor({state:'hidden'});
 await page.locator('[data-open-notebook="journal"]').tap();
 assert.match(await page.locator('#notebookTitle').textContent(),/Jurnal/);
 await page.locator('#notebookClose').tap();
 await page.locator('#notebook').waitFor({state:'hidden'});
 assert.match(await page.locator('#weather').textContent(),/Pagi/);
 await page.evaluate(()=>{
  const world=window.__kampungQA.scene.getScene('WorldScene');
  world.clock.setPhase(3);world.weatherArt.update(world.time.now,true);
  world.updateRoutines();world.scene.get('UIScene').refresh();
 });
 assert.match(await page.locator('#weather').textContent(),/Malam/);
 await page.screenshot({path:'qa-artifacts/mobile-night.png',fullPage:true});
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
