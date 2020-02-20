class Scene2 extends Phaser.Scene {
  constructor() {
    super('deuxieme_scene');

  }

  init(data){
    this.save_x = data.x;
    this.save_y = data.y;
    this.vie = data.vie;
    this.score = data.score;
  }

  preload(){
    this.load.image('background','assets/background.png');
  	//this.load.image('fond','assets/fond.png');
  	this.load.image('etoile','assets/gem.png');
  	this.load.image('sol','assets/platform.png');
  	this.load.spritesheet('perso','assets/sprite.png',{frameWidth: 19, frameHeight: 22});
  	this.load.spritesheet('stop', 'assets/stop.png', {frameWidth: 18 , frameHeight: 22});
  	this.load.spritesheet('gem_or', 'assets/gem_or.png', {frameWidth: 10, frameHeight: 15});
    this.load.spritesheet('ennemie','assets/ennemie.png',{frameWidth: 21, frameHeight: 23});

  }


  create(){
    this.platforms;
    this.player;
    this.cursors;
    this.stars;

    this.over;


    this.gem_ors;

    this.save_touch = 1;
    this.save_saut = 2;
    this.velo = 300;
    this.save_dash = 2;
    this.save_touch_droit = 1;

    this.resistance = 0;


    this.add.image(400,300, 'background');



    this.boost = this.input.keyboard.addKey('NUMPAD_ZERO');

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(355, 568, 'sol').setScale(3).refreshBody();
    this.platforms.create(650, 350, 'sol');
    this.platforms.create(50, 250, 'sol');

    this.player = this.physics.add.sprite(100, 450, 'perso');
    this.player.x = this.save_x;
    this.player.y = this.save_y;
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.physics.add.collider(this.player, this.platforms);

    this.ennemie_1 = this.physics.add.sprite(60, 480, 'ennemie');
    this.ennemie_1.setCollideWorldBounds(true);
    this.ennemie_1.setBounce(0.2);
    this.physics.add.collider(this.ennemie_1, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 5}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'left_ennemie',
      frames: this.anims.generateFrameNumbers('ennemie', {start: 0, end: 5}),
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
    this.physics.add.collider(this.player, this.ennemie_1, this.hitEnnemi, null, this);
    this.physics.add.collider(this.ennemie_1, this.player, this.hitEnnemi, null, this);




    var text;
    var timedEvent;

      this.initialTime = 30;

      text = this.add.text(32, 32, 'Temps: ' + this.initialTime, {fontSize: '20px', fill:'#000'});


      timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

      function formatTime(seconds){
          // Minutes
          var minutes = Math.floor(seconds/60);
          // Seconds
          var partInSeconds = seconds%60;

          partInSeconds = partInSeconds.toString().padStart(2,'0');
          return `${minutes}:${partInSeconds}`;
      }

      function onEvent ()
      {
          if(this.initialTime > 0){
                  this.initialTime -= 1;
          text.setText('Temps: ' + formatTime(this.initialTime));
          }
          if(this.initialTime <= 0){
            this.player.y = -150;
            this.physics.pause();
            this.gameOver = true;
            this.over = this.add.text(130, 220, 'Game Over', {fontSize: '100px', fill: '#000'});
          }

      }



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

    if (this.boost.isDown && this.cursors.left.isDown && this.save_dash > 0 && this.save_touch_droit == 1 || this.boost.isDown && this.cursors.right.isDown && this.save_dash > 0 && this.save_touch_droit == 1) {
      this.save_dash -=1;
      this.save_touch_droit -=1;
      if (this.save_dash >=1) {
        this.velo = this.velo *2;
        this.player.setVelocityX(this.velo);
      }
    }



    if (this.ennemie_1.x >= this.player.x) {
      this.tweens.add({
        targets: this.ennemie_1,
        x:0,
        duration: 5000,
        ease:'Linear',

      });
      this.ennemie_1.anims.play('left_ennemie', true);

      this.ennemie_1.setFlipX(true);

  }

    else if (this.ennemie_1.x < this.player.x) {
      this.tweens.add({
        targets: this.ennemie_1,
        x:750,
        duration: 5000,
        ease: 'Linear',
      });
      this.ennemie_1.anims.play('left_ennemie', true);
      this.ennemie_1.setFlipX(false);
    }

  }


  collectStar(player, star){
    star.disableBody(true, true);
    if(this.save_dash < 5){
      this.save_dash = this.save_dash +2;
    }


    if (this.stars.countActive(true)===0) {
      this.player.y = -150;
      this.physics.pause();
      this.gameOver = true;
      this.over = this.add.text(130, 220, 'Victory !!! ', {fontSize: '100px', fill: '#000'});

        this.initialTime = 10000000;


  }
}

collectGem_or(player, gem_or){
  gem_or.disableBody(true, true);
  this.resistance +=1;
  console.log(this.resistance);
}

hitEnnemi(player, ennemi_1){
  this.player.setVelocityY(-450);
}


}
