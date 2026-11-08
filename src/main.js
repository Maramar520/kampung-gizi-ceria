import {GameState} from './systems/GameState.js';
import {WorldScene} from './scenes/WorldScene.js?v=v127-community-map';
import {UIScene} from './scenes/UIScene.js?v=v127-community-map';
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:600,pixelArt:true,backgroundColor:'#91c881',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[WorldScene,UIScene]});
game.state=new GameState();
game.dialogOpen=false;

// Browser QA bridge, disabled on the published GitHub Pages site.
if(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa')){
  window.__kampungQA=game;
}
