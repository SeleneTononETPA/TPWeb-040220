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
var jump = 1;

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
	this.load.image('platform','assets/platform.png');
	this.load.image('sol','assets/sol.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/dude.png',{frameWidth: 11, frameHeight: 35});
	this.load.spritesheet('persoleft','assets/dudeleft.png',{frameWidth: 21, frameHeight: 35});
}



function create(){
	this.add.image(400,300,'fond');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,590,'sol');
	platforms.create(600,500,'platform');
	platforms.create(100,500,'platform');
	platforms.create(50,250,'platform');
	platforms.create(380,400,'platform');
	platforms.create(600,300,'platform');
	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('persoleft', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: this.anims.generateFrameNumbers('perso', {start: 1, end: 4}),
		frameRate: 2,
		repeat : -1
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
		player.anims.play('left', true);
		player.setVelocityX(-200);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(200);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	if(player.body.touching.down){
	jump = 1;
	}
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-200);
	} else if(cursors.up.isDown && player.body.velocity.y>-50 && jump==1){
		player.setVelocityY(-200)
		jump = 0;
	}

	
}
function hitBomb(player, bomb){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
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
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}