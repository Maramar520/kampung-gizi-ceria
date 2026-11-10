import {GameState} from './systems/GameState.js';
import {WorldScene} from './scenes/WorldScene.js?v=v242-brown-road';
import {UIScene} from './scenes/UIScene.js?v=v229-education';
// Sesuaikan rasio kanvas dengan layar, bukan menyisakan bar biru di samping.
// Tinggi dunia tetap 600 unit agar ukuran karakter dan kontrol tetap konsisten.
const viewportSize=()=>({width:Math.max(600,Math.round(600*window.innerWidth/Math.max(1,window.innerHeight))),height:600});
const initialSize=viewportSize();
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:initialSize.width,height:initialSize.height,pixelArt:true,backgroundColor:'#a4cd91',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[WorldScene,UIScene]});
window.addEventListener('resize',()=>{const size=viewportSize();game.scale.resize(size.width,size.height);});
game.state=new GameState();
game.dialogOpen=false;

// Browser QA bridge, disabled on the published GitHub Pages site.
if(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa')){
  window.__kampungQA=game;
}

// === NUTRIVILLE: progress loading dan tampilkan permainan setelah scene siap ===
const loading=document.getElementById('nutrivilleLoading');
const progress=document.getElementById('nvProgressFill');
const status=document.getElementById('nvLoadingStatus');
let ready=false;
const finishLoading=()=>{
 if(ready)return;
 ready=true;
 if(progress)progress.style.width='100%';
 if(status)status.textContent='Selamat bermain di NutriVille!';
 if(loading){loading.classList.add('is-ready');loading.addEventListener('transitionend',()=>loading.remove(),{once:true});setTimeout(()=>loading.remove(),800);}
};
// Scene Phaser selesai dibuat dan kanvas sudah dapat ditampilkan.
game.events.once(Phaser.Core.Events.READY,()=>{
 if(progress)progress.style.width='70%';
 if(status)status.textContent='Menyiapkan karakter dan kampung...';
 const world=game.scene.getScene('WorldScene');
 if(world.sys.isActive())finishLoading();
 else world.events.once(Phaser.Scenes.Events.CREATE,finishLoading);
});
if(progress)progress.style.width='28%';
if(status)status.textContent='Memuat dunia NutriVille...';
// Jika aset gagal dimuat, tampilkan pesan agar pemain tidak menunggu tanpa kepastian.
setTimeout(()=>{if(!ready&&status)status.textContent='Memuat lebih lama dari biasanya. Coba segarkan halaman jika belum terbuka.';},15000);
