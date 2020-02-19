class Scene1 extends Phaser.Scene {
  constructor() {
    super('premiere_scene');

  }

  init(data){

  }

  preload(){
    this.load.image('background','assets/background.png');
  	//this.load.image('fond','assets/fond.png');
  	this.load.image('etoile','assets/gem.png');
  	this.load.image('sol','assets/platform.png');
  	this.load.image('bomb','assets/boule.png');
  	this.load.spritesheet('perso','assets/sprite.png',{frameWidth: 19, frameHeight: 22});
  	this.load.spritesheet('stop', 'assets/stop.png', {frameWidth: 18 , frameHeight: 22});
  	this.load.image('vie_1', 'assets/hp.png');
  	this.load.image('vie_2', 'assets/hp.png');
  	this.load.image('vie_3', 'assets/hp.png');
  	this.load.spritesheet('gem_or', 'assets/gem_or.png', {frameWidth: 10, frameHeight: 15});

  }


  create(){
    this.score = 0;
    this.platforms;
    this.player;
    this.cursors;
    this.stars;
    this.scoreText;
    this.bomb;
    this.over;


    this.vie_1;
    this.vie_2;
    this.vie_3;

    this.gem_ors;

    this.vie = 3;
    this.save_touch = 1;
    this.save_saut = 2;
    this.velo = 300;
    this.save_dash = 2;
    this.save_touch_droit = 1;

    this.resistance = 0;


    this.add.image(400,300, 'background');

    this.vie_1 = this.physics.add.staticGroup();
    this.vie_2 = this.physics.add.staticGroup();
    this.vie_3 = this.physics.add.staticGroup();

    this.vie_1.create(750, 16, 'vie_1');
    this.vie_2.create(765, 16, 'vie_2');
    this.vie_3.create(780, 16, 'vie_3');

    this.vie_text = this.add.text(680, 6, 'Vie : ', {fontSize: '20px', fill:'#000'});


    this.boost = this.input.keyboard.addKey('NUMPAD_ZERO');

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(355, 568, 'sol').setScale(3).refreshBody();
    this.platforms.create(650, 350, 'sol');
    this.platforms.create(50, 250, 'sol');

    this.player = this.physics.add.sprite(100, 450, 'perso');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 5}),
      frameRate: 10,
      repeat: -1
    });


    this.anims.create({
      key: 'stop',
      frames: [{key: 'stop', frame: 0}],
      frameRate: 20
    });

    this.stars = this.physics.add.group({
      key: 'etoile',
      repeat: 5,
      setXY: {x:12, y:0, stepX: 150}
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.scoreText = this.add.text(16,16, 'Score : 0', {fontSize: '32px', fill: '#000'});
    this.bombs  = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    this.anims.create({
      key: 'gem_or',
      frames: this.anims.generateFrameNumbers('gem_or', {start: 0, end: 3}),
      frameRate: 30,
      repeat: -1
    });


    this.gem_ors = this.physics.add.group({
      key: 'gem_or',
      setXY: {x:-120, y: 0},
    });

    this.gem_ors.playAnimation('gem_or');

    this.physics.add.collider(this.gem_ors, this.platforms);
    this.physics.add.overlap(this.player, this.gem_ors, this.collectGem_or, null, this);


    }


  update(){
    if (this.cursors.left.isDown) {
      this.velo = -300;
      this.player.anims.play('left', true);
      if (this.boost.isUp) {
        this.player.setVelocityX(this.velo);
      }
      this.player.setFlipX(true);
    }
    else if (this.cursors.right.isDown) {
      this.velo = 300;
      if (this.boost.isUp) {
        this.player.setVelocityX(this.velo);
      }
      this.player.anims.play('left', true);
      this.player.setFlipX(false);
    }
    else if (this.cursors.right.isUp && this.cursors.left.isUp) {
      this.player.anims.play('stop', true);
      this.player.setVelocityX(0);
      this.save_touch_droit = 1;
    }

    if (this.cursors.up.isDown && this.save_saut > 0 && this.save_touch == 1) {
      this.save_saut -=1;
      this.save_touch -=1;

      if (this.save_saut == 1) {
        this.player.setVelocityY(-250);
      }
      if (this.save_saut == 0) {
        this.player.setVelocityY(-250);
      }
    }

    if (this.cursors.up.isUp) {
      this.save_touch = 1;
    }
    if (this.cursors.up.isUp && this.player.body.touching.down) {
      this.save_saut = 2;
    }

    if (this.boost.isDown && this.cursors.left.isDown && this.save_dash > 0 && this.save_touch_droit == 1 || this.boost.isDown && this.cursors.right.isDown && this.save_dash > 0 && this.save_touch_droit == 1) {
      this.save_dash -=1;
      this.save_touch_droit -=1;
      if (this.save_dash >=1) {
        this.velo = this.velo *2;
        this.player.setVelocityX(this.velo);
      }
    }

    this.velo_bomb_x = (this.player.x < 300) ?
    Phaser.Math.Between(-400, -800):
    Phaser.Math.Between(100, 800);
    this.bombs.setVelocityX(this.velo_bomb_x);

  }


  hitBomb(player, bomb){
    if (this.resistance <=0) {
      this.vie -= 1;
    }
    if (this.resistance > 0) {
      this.resistance -= 1;
    }
    this.player.x = 300;
    this.player.y = 20;


    this.alea = Phaser.Math.Between(1,2);
    if (this.alea == 1 && this.vie !=0) {
      this.x_gem = Phaser.Math.Between(0,800);
      this.gem_crea = this.gem_ors.create(this.x_gem, 16, 'gem_or');
      this.gem_ors.playAnimation('gem_or');
    }

    if (this.vie == 2) {
      this.vie_3.destroy(true);
    }
    if (this.vie == 1) {
      this.vie_2.destroy(true);
    }
    if (this.vie == 0) {
      this.vie_1.destroy(true);
      this.vie_text.destroy(true);
      this.player.y = -150;
      this.physics.pause();
      this.gameOver = true;
      this.over = this.add.text(130, 220, 'Game Over', {fontSize: '100px', fill: '#000'});
    }


  }

  collectStar(player, star){
    star.disableBody(true, true);
    if(this.save_dash < 5){
      this.save_dash = this.save_dash +2;
    }

    this.score +=10;
    this.scoreText.setText('Score : '+ this.score);

    if (this.stars.countActive(true)===0) {
      this.stars.children.iterate(function(child){
      child.enableBody(true, child.x, 0, true, true);
      });


    this.x = (this.player.x < 400) ?
    Phaser.Math.Between(400,800):
    Phaser.Math.Between(0, 400);
    this.bomb = this.bombs.create(this.x, 16, 'bomb');
    this.bomb.setBounce(1);
    this.bomb.setCollideWorldBounds(true);
    this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    this.velo_bomb_x = (this.player.x < 300) ?
    Phaser.Math.Between(-400, 800):
    Phaser.Math.Between(100, 800);
    this.bombs.setVelocityX(this.velo_bomb_x);
  }
}

collectGem_or(player, gem_or){
  gem_or.disableBody(true, true);
  this.resistance +=1;
  console.log(this.resistance);
}


}
