import {GameState} from './systems/GameState.js';
import {WorldScene} from './scenes/WorldScene.js?v=v225-nurse';
import {UIScene} from './scenes/UIScene.js?v=v225-nurse';
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
