import Phaser from 'phaser';

class AwakeningScene extends Phaser.Scene {
  constructor() {
    super('Awakening');
  }

  preload() {
    this.load.image(
      'awakening-background',
      'assets/level1/awakening-background.png'
    );
    this.load.image(
      'orion-explorer',
      'assets/level1/orion-explorer-preview.png'
    );
  }

  create() {
    const width = 960;
    const height = 540;

    this.cameras.main.setBackgroundColor('#090d1c');

    this.add.image(
      width / 2,
      height / 2,
      'awakening-background'
    ).setDisplaySize(width, height);

    const platform = this.add.graphics();
    platform.fillStyle(0x183b52);
    platform.fillRect(0, 460, width, 80);
    platform.fillStyle(0x37d9ef);
    platform.fillRect(0, 455, width, 5);

    const explorer = this.add.container(150, 420);
    const sprite = this.add.image(0, 0, 'orion-explorer');
    sprite.setDisplaySize(28, 40);
    explorer.add(sprite);

    this.explorer = explorer;
    this.facingDirection = 1;
    this.projectiles = [];
    this.fireCooldown = 0;
    this.fireKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.J
    );
    this.cursors = this.input.keyboard.createCursorKeys();
    this.moveKeys = this.input.keyboard.addKeys('A,D');
    this.gravityDirection = 1;
    this.verticalVelocity = 0;
    this.gravityAcceleration = 900;
    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.add.graphics()
      .fillStyle(0x17384d)
      .fillRect(0, 0, width, 15)
      .fillStyle(0x37d9ef)
      .fillRect(0, 15, width, 5);

    this.gravityLabel = this.add.text(
      20, 35, 'GRAVITY: DOWN',
      { fontFamily: 'Arial', fontSize: '16px', color: '#fbbf24' }
    );

    // Level 1: first energy barrier.
    this.laser = this.add.rectangle(
      480, 325, 14, 260, 0xff3978, 0.85
    );
    this.laser.setStrokeStyle(3, 0xffa1c0);

    this.tweens.add({
      targets: this.laser,
      alpha: 0.45,
      duration: 450,
      yoyo: true,
      repeat: -1
    });

    this.add.text(480, 42, 'DANGER', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#ff8bab'
    }).setOrigin(0.5);

    this.respawnCount = 0;
    this.respawnLabel = this.add.text(20, 65, 'RESTARTS: 0', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#cbd5e1'
    });

    // Level 1 security lockdown: three independent Sentinel Drones.
    this.sentinels = [];

    const dronePositions = [
      { x: 620, y: 160, range: 55, duration: 1700 },
      { x: 700, y: 280, range: 45, duration: 2100 },
      { x: 680, y: 405, range: 80, duration: 1800 }
    ];

    for (const config of dronePositions) {
      const drone = this.add.container(config.x, config.y);

      const body = this.add.ellipse(
        0, 0, 40, 28, 0x263c57
      ).setStrokeStyle(3, 0x55d9ef);

      const eye = this.add.circle(0, 0, 7, 0xff3978);
      const leftWing = this.add.rectangle(
        -25, 0, 12, 8, 0x526d85
      );
      const rightWing = this.add.rectangle(
        25, 0, 12, 8, 0x526d85
      );

      drone.add([leftWing, rightWing, body, eye]);
      this.sentinels.push(drone);

      this.tweens.add({
        targets: drone,
        x: config.x + config.range,
        duration: config.duration,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Level 1 exit portal.
    this.portal = this.add.rectangle(
      870, 415, 44, 80, 0x22c55e, 0.35
    );
    this.portal.setStrokeStyle(4, 0x86efac);

    this.tweens.add({
      targets: this.portal,
      alpha: 0.5,
      duration: 650,
      yoyo: true,
      repeat: -1
    });

    this.add.text(870, 355, 'EXIT', {
      fontFamily: 'Arial',
      fontSize: '17px',
      color: '#86efac'
    }).setOrigin(0.5);

    this.levelComplete = false;
    this.restartKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );

    this.add.text(width / 2, 65, 'ORIONINSIST', {
      fontFamily: 'Arial',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#e5f8ff'
    }).setOrigin(0.5);

    this.add.text(width / 2, 110, 'GRAVITY SHIFT — LEVEL 1: THE AWAKENING', {
      fontFamily: 'Arial',
      fontSize: '17px',
      color: '#55d9ef'
    }).setOrigin(0.5);

    this.add.text(width / 2, 505, 'First scene prototype — gameplay coming next', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#b7c6d9'
    }).setOrigin(0.5);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart();
      return;
    }

    if (this.levelComplete) {
      return;
    }

    const speed = 240;
    let direction = 0;

    if (this.cursors.left.isDown || this.moveKeys.A.isDown) {
      direction -= 1;
    }
    if (this.cursors.right.isDown || this.moveKeys.D.isDown) {
      direction += 1;
    }

    this.explorer.x = Phaser.Math.Clamp(
      this.explorer.x + direction * speed * delta / 1000,
      14,
      946
    );

    if (direction !== 0) {
      this.facingDirection = direction;
    }

    // Fire cyan energy bolts in the last movement direction.
    this.fireCooldown = Math.max(0, this.fireCooldown - delta);

    if (this.fireKey.isDown && this.fireCooldown === 0) {
      const bolt = this.add.rectangle(
        this.explorer.x + this.facingDirection * 20,
        this.explorer.y,
        16,
        5,
        0x55f5ff
      );
      bolt.setStrokeStyle(1, 0xffffff);
      this.projectiles.push({
        sprite: bolt,
        velocity: this.facingDirection * 520
      });
      this.fireCooldown = 220;
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.sprite.x += projectile.velocity * delta / 1000;

      // Energy bolts destroy whichever Sentinel Drone they hit.
      let hitDrone = false;

      for (const drone of this.sentinels) {
        if (
          drone.active &&
          Phaser.Geom.Intersects.RectangleToRectangle(
            projectile.sprite.getBounds(),
            drone.getBounds()
          )
        ) {
          this.tweens.killTweensOf(drone);
          drone.destroy();
          projectile.sprite.destroy();
          this.projectiles.splice(i, 1);
          hitDrone = true;
          break;
        }
      }

      if (hitDrone) {
        continue;
      }

      if (projectile.sprite.x < -20 || projectile.sprite.x > 980) {
        projectile.sprite.destroy();
        this.projectiles.splice(i, 1);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
      this.gravityDirection *= -1;
      this.gravityLabel.setText(
        this.gravityDirection === 1 ? 'GRAVITY: DOWN' : 'GRAVITY: UP'
      );
    }

    const dt = Math.min(delta / 1000, 0.05);
    this.verticalVelocity +=
      this.gravityDirection * this.gravityAcceleration * dt;

    this.verticalVelocity = Phaser.Math.Clamp(
      this.verticalVelocity, -380, 380
    );

    this.explorer.y += this.verticalVelocity * dt;

    const ceilingY = 40;
    const floorY = 435;

    if (this.explorer.y < ceilingY) {
      this.explorer.y = ceilingY;
      this.verticalVelocity = 0;
    }

    if (this.explorer.y > floorY) {
      this.explorer.y = floorY;
      this.verticalVelocity = 0;
    }

    this.explorer.setRotation(
      this.gravityDirection === 1 ? 0 : Math.PI
    );

    // Collision between explorer and energy barrier.
    const playerBounds = this.explorer.getBounds();
    const laserBounds = this.laser.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(
      playerBounds, this.portal.getBounds()
    )) {
      this.levelComplete = true;
      this.add.rectangle(480, 270, 680, 190, 0x090d1c, 0.94)
        .setStrokeStyle(3, 0x86efac);

      this.add.text(480, 245, 'LEVEL 1 COMPLETE', {
        fontFamily: 'Arial',
        fontSize: '34px',
        fontStyle: 'bold',
        color: '#86efac'
      }).setOrigin(0.5);

      this.add.text(480, 300, 'THE AWAKENING — Press R to restart', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#e5f8ff'
      }).setOrigin(0.5);

      return;
    }

    // Contact with any live Sentinel Drone causes a respawn.
    const droneCollision = this.sentinels.some(
      drone =>
        drone.active &&
        Phaser.Geom.Intersects.RectangleToRectangle(
          playerBounds,
          drone.getBounds()
        )
    );

    if (
      droneCollision ||
      Phaser.Geom.Intersects.RectangleToRectangle(
        playerBounds, laserBounds
      )
    ) {
      this.explorer.setPosition(150, 435);
      this.verticalVelocity = 0;
      this.gravityDirection = 1;
      this.explorer.setRotation(0);
      this.gravityLabel.setText('GRAVITY: DOWN');
      this.respawnCount += 1;
      this.respawnLabel.setText(
        'RESTARTS: ' + this.respawnCount
      );
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#090d1c',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [AwakeningScene]
});
