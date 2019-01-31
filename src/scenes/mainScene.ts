export class MainScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Sprite;
  private playerSpeed: number;
  private enemyMinSpeed: number;
  private enemyMaxSpeed: number;
  private enemyMinY: number;
  private enemyMaxY: number;
  private goal: Phaser.GameObjects.Sprite;
  private enemy: Phaser.GameObjects.Sprite & { speed?: number };
  private enemies: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.playerSpeed = 3;
    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 3;
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
  }

  preload(): void {
    // Load images
    this.load.image("background", "./src/assets/background.png");
    this.load.image("player", "./src/assets/player.png");
    this.load.image("enemy", "./src/assets/dragon.png");
    this.load.image("goal", "./src/assets/treasure.png");
  }

  create(): void {
    let bg = this.add.sprite(0, 0, "background");
    bg.setOrigin(0, 0);

    this.player = this.add.sprite(
      40,
      (this.sys.game.config.height as number) / 2,
      "player"
    );
    this.player.setScale(0.5);

    this.goal = this.add.sprite(
      (this.sys.game.config.width as number) - 80,
      (this.sys.game.config.height as number) / 2,
      "goal"
    );
    this.goal.setScale(0.6);

    this.enemies = this.add.group({
      key: "enemy",
      repeat: 4,
      setXY: {
        x: 90,
        y: 100,
        stepX: 100,
        stepY: 20
      }
    });

    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

    Phaser.Actions.Call(
      this.enemies.getChildren(),
      (enemy: Phaser.GameObjects.Sprite & { speed?: number }) => {
        // set flip
        enemy.flipX = true;

        // set enemy speed
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed =
          this.enemyMinSpeed +
          Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = dir * speed;
      },
      this
    );
  }

  update(): void {
    if (this.input.activePointer.isDown) {
      // player walks
      this.player.x += this.playerSpeed;
    }

    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
      console.log("yay!");
      this.scene.restart();
    }

    const enemies = this.enemies.getChildren();

    enemies.forEach((enemy: Phaser.GameObjects.Sprite & { speed?: number }) => {
      enemy.y += enemy.speed;
      const conditionUp = enemy.speed < 0 && enemy.y <= this.enemyMinY;
      const conditionDown = enemy.speed > 0 && enemy.y >= this.enemyMaxY;

      if (conditionDown || conditionUp) {
        enemy.speed *= -1;
      }

      //check enemy overlap

      let enemyRect = enemy.getBounds();

      if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
        console.log("GAME OVEEEEER");
        this.scene.restart();
      }
    });
  }
}
