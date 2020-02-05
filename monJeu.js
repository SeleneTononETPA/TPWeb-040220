var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var savesaut = 0;
var veriftouche = 1;

function init(){
 	var platforms;
	var player;
	var cursors;
	var stars;
	var scoreText;
	var bomb;
}

function preload(){
	this.load.image('fond','assets/fond.png');
	this.load.image('etoile','assets/star.png');
	this.load.image('platform','assets/platform1.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/perso.png',{frameWidth: 50, frameHeight: 37});
}



function create(){
	this.add.image(400,300,'fond');

	platforms = this.physics.add.staticGroup();
	platforms.create(100,600,'platform');
	platforms.create(300,600,'platform');
	platforms.create(500,600,'platform');
	platforms.create(700,600,'platform');
	platforms.create(100,450,'platform');
	platforms.create(400,300,'platform');
	platforms.create(700,150,'platform');

	player = this.physics.add.sprite(100,550,'perso');
	player.setCollideWorldBounds(true);
	player.body.setGravityY(1000);
	this.physics.add.collider(player,platforms);

	cursors = this.input.keyboard.createCursorKeys();

	this.anims.create({
		key:'right',
		frames: this.anims.generateFrameNumbers('perso', {start: 8, end: 13}),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key:'stop',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 5,
		repeat: -1
	});

	this.anims.create({
		key:'jump',
		frames: this.anims.generateFrameNumbers('perso', {start: 14, end: 23}),
		frameRate: 20,
		repeat: -1
	});

	stars = this.physics.add.group({
		key: 'etoile',
		repeat: 11,
		setXY: {x:12,y:0,stepX:70}
	});

	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update() {
	if (cursors.right.isDown) {
		player.anims.play('right', true);
		player.setVelocityX(300);
		player.setFlipX(false);
	} else if (cursors.left.isDown) {
		player.setVelocityX(-300);
		player.anims.play('right', true);
		player.setFlipX(true);
	} else {
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}

	if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-700);
  } else if (cursors.down.isDown && !player.body.touching.down) {
    player.setVelocityY(2000);
    player.anims.play('stop', true);
  }
  if (!player.body.touching.down) {
    player.anims.play('jump', true);
  }


	if (savesaut === 0 && player.body.touching.down && cursors.up.isDown) {
		player.anims.play('jump', true);
		player.setVelocityY(-500);
		savesaut = 1;
		veriftouche = 0;
	} else if (cursors.down.isDown && !player.body.touching.down) {
    player.setVelocityY(2000);
    player.anims.play('stop', true);
	}
	if (cursors.up.isUp) {
		veriftouche = 1;
	}
	if (savesaut === 1 && cursors.up.isDown && veriftouche === 1) {
		player.setVelocityY(-500);
		savesaut = 0;
	}



}

function hitBomb(player, bomb){
	this.physics.pause();
	player.setTint(0xff0000);
	gameOver=true;
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		var x = (player.x < 400) ? Phaser.Math.Between(400,800) :	Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 400), 10);
	}
}
