var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
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

function init(){
 	var platforms;
	var player;
	var cursors;
	var stars;
	var scoreText;
	var bomb;
	var over;

	var vie_1;
	var vie_2
	var vie_3;
}
var vie = 3;
var save_touch =1 ;
var save_saut = 2;

var velo= 300;
var save_dash = 2;
var save_touch_droit = 1;


function preload(){
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
}



function create(){
	this.add.image(400,300,'background');
	vie_1 = this.physics.add.staticGroup();
	vie_2 = this.physics.add.staticGroup();
	vie_3 = this.physics.add.staticGroup();
	vie_1.create(750, 16, 'vie_1');
	vie_2.create(765, 16, 'vie_2');
	vie_3.create(780, 16, 'vie_3');
	vie_text = this.add.text(680,6, 'Vie : ', {fontSize: '20px', fill:'#000'});
// add key boost

boost = this.input.keyboard.addKey('NUMPAD_ZERO');

	platforms = this.physics.add.staticGroup();
	platforms.create(355,568,'sol').setScale(3).refreshBody();
	platforms.create(650,350,'sol');
	platforms.create(50,250,'sol');

	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);

	cursors = this.input.keyboard.createCursorKeys();

	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 5}),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key:'stop',
		frames: [{key: 'stop', frame:0}],
		frameRate: 20
	});

	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});

	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update(){
	if(cursors.left.isDown){
		velo = -300;
		player.anims.play('left', true);
		if (boost.isUp) {
					player.setVelocityX(velo);
		}
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		velo = 300;
		if (boost.isUp) {
					player.setVelocityX(velo);
		}
		player.anims.play('left', true);
		player.setFlipX(false);
	}
	else if(cursors.right.isUp && cursors.left.isUp){
		player.anims.play('stop', true);
		player.setVelocityX(0);
		save_touch_droit = 1;
	}

	if(cursors.up.isDown && save_saut > 0 && save_touch == 1){
		player.setVelocityY(-330);
		save_saut -=1;
		save_touch -=1;
		if (save_saut == 1) {
			player.setVelocityY(-250);
		}
		if (save_saut == 0) {
			player.setVelocityY(-250);
		}
	}
	if (cursors.up.isUp) {
		save_touch = 1;
	}
	if (cursors.up.isUp && player.body.touching.down) {
		save_saut = 2;

	}

	if (boost.isDown && cursors.left.isDown && save_dash > 0 && save_touch_droit == 1 || boost.isDown && cursors.right.isDown && save_dash > 0 && save_touch_droit == 1) {
		save_dash -=1;
		save_touch_droit -=1;
		if (save_dash >= 1) {
			velo = velo*2;
			player.setVelocityX(velo);

		}
	}

	var velo_bomb_x = (player.x < 300) ?
	Phaser.Math.Between(-400, -800):
	Phaser.Math.Between(100,800);
	bombs.setVelocityX(velo_bomb_x);

}
function hitBomb(player, bomb){
	vie -= 1;
	player.x = 300;
	player.y = 20;
	if (vie == 2) {
		vie_3.destroy(true);
	}
	if (vie == 1) {
		vie_2.destroy(true);
	}
	if (vie == 0) {
		vie_1.destroy(true);
		vie_text.destroy(true);
		player.y = -150;
		this.physics.pause();
		gameOver=true;
		over = this.add.text(130,220, 'Game Over', {fontSize: '100px', fill:'#000'});
	}

}

function collectStar(player, star){
	star.disableBody(true,true);
	if (save_dash < 5) {
			save_dash = save_dash +2;
	}

	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		var x = (player.x < 400) ?
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		var velo_bomb_x = (player.x < 300) ?
		Phaser.Math.Between(-400, -800):
		Phaser.Math.Between(100,800);
		bombs.setVelocityX(velo_bomb_x);
	}
}
