var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
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
var vie = 3;

function init(){
 	var platforms;
	var player;
	var cursors; 
	var stars;
	var scoreText;
	var nombreVie;
	var bomb;
	var vie;
	var item;
}

function preload(){
	this.load.image('background','assets/sky.png');	
	this.load.image('item','assets/item.png');	
	this.load.image('fond','assets/fond.png');
	this.load.image('etoile','assets/star.png');
	this.load.image('sol','assets/platform.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/dude.png',{frameWidth:77, frameHeight:80});
}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,600,'sol').setScale(4).refreshBody();
	platforms.create(600,400,'sol');
	platforms.create(50,250,'sol');
	
	player = this.physics.add.sprite(100,450,'perso').setSize(65, 65);
	player.setCollideWorldBounds(true);
	//player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);

	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 20,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});
	
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:7,
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	nombreVie = this.add.text(550,16, 'vie: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
		item = this.physics.add.group({
		key: 'item',
		repeat:0,
		setXY: {x:12,y:0,stepX:70}
	});
	this.physics.add.collider(item,platforms);
	this.physics.add.overlap(player,item,collectItem,null,this);
	
	
}



function update(){
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-650);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(650);
		player.anims.play('left', true);
		player.setFlipX(false);
	}
	else if(cursors.down.isDown){
		player.setVelocityX(0);
		player.setVelocityY(1500);
		player.anims.play('left', true);
		player.setFlipX(false);

	}

	else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-750);
	} 
	
}

function hitBomb(player, bomb){
	nombreVie.setText('vie: '+vie);
	vie--;
	if(vie<0){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;
	}
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	nombreVie.setText('vie: '+vie);
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
function collectItem(player, item){
	item.disableBody(true,true);
	vie += 1;
	nombreVie.setText('vie: '+vie);
	
}