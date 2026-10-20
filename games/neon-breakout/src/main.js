import Phaser from 'phaser';

const W = 800;
const H = 600;

const COLORS = [
  0xff4da6,
  0xa855f7,
  0x6366f1,
  0x22d3ee,
  0x34d399
];

class NeonBreakout extends Phaser.Scene {
  constructor() {
    super('NeonBreakout');
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.remaining = 0;
    this.gameState = 'ready';
    this.savedVelocity = { x: 130, y: -350 };

    this.cameras.main.setBackgroundColor('#080c1c');

    this.createBackground();
    this.createTextures();
    this.createInterface();

    this.physics.world.setBounds(10, 95, 780, 470);
    this.physics.world.setBoundsCollision(
      true, true, true, false
    );

    this.paddle = this.physics.add.image(
      W / 2, 525, 'paddle'
    );

    this.paddle.setImmovable(true);
    this.paddle.body.setAllowGravity(false);

    this.ball = this.physics.add.image(
      W / 2, 505, 'ball'
    );

    this.ball.setBounce(1, 1);
    this.ball.setCollideWorldBounds(true);
    this.ball.body.setAllowGravity(false);
    this.ball.setMaxVelocity(650, 650);

    this.bricks = this.physics.add.staticGroup();

    this.physics.add.collider(
      this.ball,
      this.paddle,
      this.hitPaddle,
      null,
      this
    );

    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.hitBrick,
      null,
      this
    );

    this.keys = this.input.keyboard.addKeys(
      'LEFT,RIGHT,A,D,SPACE'
    );

    this.input.keyboard.on(
      'keydown-SPACE',
      () => this.action()
    );

    this.input.on('pointerdown', () => {
      if (this.gameState !== 'playing') {
        this.action();
      }
    });

    this.createLevel();
    this.resetBall();
    this.updateHud();
  }

  createBackground() {
    const g = this.add.graphics();

    g.lineStyle(1, 0x18223d, 0.5);

    for (let x = 0; x <= W; x += 40) {
      g.lineBetween(x, 0, x, H);
    }

    for (let y = 0; y <= H; y += 40) {
      g.lineBetween(0, y, W, y);
    }

    const border = this.add.graphics();
    border.lineStyle(2, 0x22d3ee, 0.65);
    border.strokeRoundedRect(10, 95, 780, 470, 8);
  }

  createTextures() {
    const paddle = this.make.graphics({
      x: 0, y: 0
    });

    paddle.fillStyle(0x22d3ee, 1);
    paddle.fillRoundedRect(0, 0, 112, 18, 8);
    paddle.generateTexture('paddle', 112, 18);
    paddle.destroy();

    const ball = this.make.graphics({
      x: 0, y: 0
    });

    ball.fillStyle(0xffffff, 1);
    ball.fillCircle(9, 9, 9);
    ball.generateTexture('ball', 18, 18);
    ball.destroy();

    COLORS.forEach((color, index) => {
      const brick = this.make.graphics({
        x: 0, y: 0
      });

      brick.fillStyle(color, 1);
      brick.fillRoundedRect(0, 0, 84, 24, 5);
      brick.generateTexture(
        'brick' + index, 84, 24
      );
      brick.destroy();
    });
  }

  createInterface() {
    this.add.text(
      400, 26,
      'ORIONIS // NEON BREAKOUT',
      {
        fontFamily: 'monospace',
        fontSize: '23px',
        fontStyle: 'bold',
        color: '#22d3ee'
      }
    ).setOrigin(0.5);

    this.hud = this.add.text(
      28, 65, '',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff'
      }
    );

    this.message = this.add.text(
      400, 355, '',
      {
        fontFamily: 'monospace',
        fontSize: '21px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#080c1c',
        padding: {
          x: 18,
          y: 14
        }
      }
    ).setOrigin(0.5).setDepth(20);

    this.add.text(
      400, 583,
      'MOUSE / TOUCH / ARROWS | SPACE: START / PAUSE',
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#7486a8'
      }
    ).setOrigin(0.5);
  }

  createLevel() {
    this.bricks.clear(true, true);
    this.remaining = 0;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        const x = 92 + col * 88;
        const y = 145 + row * 32;

        const brick = this.bricks.create(
          x,
          y,
          'brick' + row
        );

        brick.refreshBody();
        this.remaining++;
      }
    }
  }

  updateHud() {
    this.hud.setText(
      'SCORE ' +
      String(this.score).padStart(5, '0') +
      '     LIVES ' + this.lives +
      '     LEVEL ' + this.level
    );
  }

  resetBall() {
    this.gameState = 'ready';
    this.ball.body.stop();

    this.ball.setPosition(
      this.paddle.x,
      505
    );

    this.message.setText(
      'LEVEL ' + this.level +
      '\nTAP / SPACE TO LAUNCH'
    );

    this.message.setVisible(true);
  }

  action() {
    if (this.gameState === 'over') {
      this.scene.restart();
      return;
    }

    if (this.gameState === 'ready') {
      this.gameState = 'playing';
      this.message.setVisible(false);

      const speed = Math.min(
        340 + this.level * 25,
        520
      );

      this.ball.setVelocity(
        Phaser.Math.Between(-160, 160),
        -speed
      );

      return;
    }

    if (this.gameState === 'playing') {
      this.savedVelocity = {
        x: this.ball.body.velocity.x,
        y: this.ball.body.velocity.y
      };

      this.gameState = 'paused';
      this.ball.body.stop();

      this.message.setText(
        'PAUSED\nSPACE / TAP TO RESUME'
      ).setVisible(true);

      return;
    }

    if (this.gameState === 'paused') {
      this.gameState = 'playing';
      this.message.setVisible(false);

      this.ball.setVelocity(
        this.savedVelocity.x,
        this.savedVelocity.y
      );
    }
  }

  hitPaddle(ball, paddle) {
    const offset = Phaser.Math.Clamp(
      (ball.x - paddle.x) / 56,
      -1,
      1
    );

    const speed = Math.min(
      600,
      Math.max(
        350,
        ball.body.velocity.length()
      )
    );

    const vx = offset * speed * 0.85;

    const vy = -Math.sqrt(
      Math.max(
        10000,
        speed * speed - vx * vx
      )
    );

    ball.setVelocity(vx, vy);
  }

  hitBrick(ball, brick) {
    if (!brick.active) return;

    const x = brick.x;
    const y = brick.y;
    const key = brick.texture.key;

    brick.disableBody(true, true);

    this.remaining--;
    this.score += 10 * this.level;
    this.updateHud();

    const index = Number(
      key.replace('brick', '')
    );

    const flash = this.add.circle(
      x,
      y,
      14,
      COLORS[index] ?? 0xffffff,
      0.8
    );

    this.tweens.add({
      targets: flash,
      scale: 2.5,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });

    if (this.remaining === 0) {
      this.level++;
      this.createLevel();
      this.resetBall();
      this.updateHud();
    }
  }

  update() {
    const pointer = this.input.activePointer;
    let target = this.paddle.x;

    if (this.keys.LEFT.isDown ||
        this.keys.A.isDown) {
      target -= 9;
    } else if (
      this.keys.RIGHT.isDown ||
      this.keys.D.isDown
    ) {
      target += 9;
    } else if (
      pointer.x >= 0 &&
      pointer.x <= W
    ) {
      target = pointer.x;
    }

    this.paddle.setX(
      Phaser.Math.Clamp(target, 70, 730)
    );

    this.paddle.body.updateFromGameObject();

    if (this.gameState === 'ready') {
      this.ball.setPosition(
        this.paddle.x,
        505
      );
    }

    if (this.gameState !== 'playing') {
      return;
    }

    if (Math.abs(this.ball.body.velocity.x) < 65) {
      this.ball.setVelocityX(
        this.ball.body.velocity.x < 0
          ? -90
          : 90
      );
    }

    if (this.ball.y > 585) {
      this.lives--;
      this.updateHud();

      if (this.lives <= 0) {
        this.gameState = 'over';
        this.ball.body.stop();

        this.message.setText(
          'GAME OVER\nSCORE ' +
          this.score +
          '\nTAP / SPACE TO RESTART'
        ).setVisible(true);
      } else {
        this.resetBall();
      }
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#080c1c',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  scene: NeonBreakout
});
