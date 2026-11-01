import Phaser from 'phaser';

const WIDTH = 1280;
const HEIGHT = 720;

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  create() {
    const g = this.add.graphics();

    // Sky
    g.fillGradientStyle(0x67c9ff, 0x67c9ff, 0xd7f5ff, 0xd7f5ff);
    g.fillRect(0, 0, WIDTH, HEIGHT);

    // Sun
    g.fillStyle(0xffe58a);
    g.fillCircle(1060, 115, 62);

    // Distant hills
    g.fillStyle(0x8ed5a1);
    g.fillEllipse(280, 590, 850, 330);
    g.fillEllipse(1030, 600, 850, 300);

    // Ground
    g.fillStyle(0x5fba65);
    g.fillRect(0, 590, WIDTH, 130);
    g.fillStyle(0x408b49);
    g.fillRect(0, 620, WIDTH, 100);

    // Static ground supports the physical tower blocks.
    this.matter.add.rectangle(640, 640, 1280, 100, {
      isStatic: true,
      friction: 0.9
    });

    this.drawTower(280, 590, 0x58caff);
    this.drawTower(1000, 590, 0xff6767);

    // Temporary physics test: click or tap to launch a stone.
    this.input.on('pointerdown', (pointer) => {
      const stone = this.add.circle(110, 390, 18, 0x444b5a);
      this.matter.add.gameObject(stone, {
        shape: { type: 'circle', radius: 18 },
        restitution: 0.35,
        friction: 0.5
      });

      const dx = pointer.worldX - 110;
      const dy = pointer.worldY - 390;
      const length = Math.max(1, Math.hypot(dx, dy));

      stone.setVelocity(
        (dx / length) * 20,
        (dy / length) * 20
      );
    });

    this.add.text(640, 35, 'TOWER CLASH', {
      fontFamily: 'Arial',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#24445c',
      strokeThickness: 7
    }).setOrigin(0.5);

    this.add.text(640, 94, 'Battlefield Prototype', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#24445c'
    }).setOrigin(0.5);
  }

  drawTower(x, groundY, crystalColor) {
    const g = this.add.graphics();

    const blockWidth = 62;
    const blockHeight = 44;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        const bx = x - 93 + col * blockWidth;
        const by = groundY - (row + 1) * blockHeight;

        const color = (row + col) % 2 ? 0xb67b45 : 0xd29b60;
        const block = this.add.rectangle(
          bx + (blockWidth - 3) / 2,
          by + (blockHeight - 3) / 2,
          blockWidth - 3,
          blockHeight - 3,
          color
        );

        block.setStrokeStyle(2, 0x78502f);

        this.matter.add.gameObject(block, {
          friction: 0.85,
          frictionStatic: 1,
          restitution: 0.02,
          density: 0.002
        });
      }
    }

    // Crystal core
    const cy = groundY - 115;

    g.fillStyle(crystalColor, 0.3);
    g.fillCircle(x, cy, 40);

    g.fillStyle(crystalColor);
    g.fillPoints([
      { x, y: cy - 32 },
      { x: x + 23, y: cy },
      { x, y: cy + 32 },
      { x: x - 23, y: cy }
    ], true);

    g.lineStyle(3, 0xffffff);
    g.strokePoints([
      { x, y: cy - 32 },
      { x: x + 23, y: cy },
      { x, y: cy + 32 },
      { x: x - 23, y: cy }
    ], true);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#14243d',
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BattleScene]
});
