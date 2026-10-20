import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    this.add.text(400, 65, 'ORIONIS FIRST', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 110, 'FIRST PLAYABLE PROTOTYPE', {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#9fb7cf'
    }).setOrigin(0.5);

    this.add.rectangle(400, 510, 800, 20, 0x33465b);
    this.player = this.add.rectangle(400, 475, 32, 50, 0x39c8ed);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.text(400, 555, 'LEFT / RIGHT ARROWS TO MOVE', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  update(time, delta) {
    const speed = 300;
    const distance = speed * delta / 1000;

    if (this.cursors.left.isDown) {
      this.player.x -= distance;
    } else if (this.cursors.right.isDown) {
      this.player.x += distance;
    }

    this.player.x = Phaser.Math.Clamp(this.player.x, 16, 784);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#101827',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: MainScene
});
