import {GameState} from './systems/GameState.js';
import {WorldScene} from './scenes/WorldScene.js';
import {UIScene} from './scenes/UIScene.js';
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:600,pixelArt:true,backgroundColor:'#91c881',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[WorldScene,UIScene]});
game.state=new GameState();
game.dialogOpen=false;
