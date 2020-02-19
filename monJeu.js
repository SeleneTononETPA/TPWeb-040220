var config = {
  width: 800,
  height: 600,
  physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Scene1, Scene2]
  }

var game = new Phaser.Game(config);
