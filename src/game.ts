import "phaser";
import { MainScene } from "./scenes/mainScene";

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: MainScene
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
