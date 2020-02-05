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
}

function preload(){
	this.load.image('fond','assets/fond.png');
	this.load.image('etoile','assets/star.png');
	this.load.image('sol','assets/platform.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/dude.png',{frameWidth: 32, frameHeight: 48});
}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
<<<<<<< Updated upstream
	platforms.create(400,568,'sol').setScale(2).refreshBody();
	platforms.create(600,400,'sol');
	platforms.create(50,250,'sol');
=======
	platforms.create(400,590,'sol');
	platforms.create(600,500,'platform');
	platforms.create(100,500,'platform');
	platforms.create(50,270,'platform');
	platforms.create(380,380,'platform');
	platforms.create(600,260,'platform');
	platforms.create(450,150,'platform');
>>>>>>> Stashed changes
	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
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
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(false);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(true);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
<<<<<<< Updated upstream
		player.setVelocityY(-330);
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
=======
		player.setVelocityY(-200);
	} else if(cursors.up.isDown && player.body.velocity.y>-50 && jump==1){
		player.setVelocityY(-200)
		jump = 0;
	}
	if(1){
		stars.children.iterate(function(child){
			if(Math.sqrt(Math.pow(child.x-player.x, 2)+Math.pow(child.y-player.y, 2))<200){
					score += 10;
					scoreText.setText('score: '+score);
					child.disableBody(true,true);
			}
		});
		bombs.children.iterate(function(child){
			if(Math.sqrt(Math.pow(child.x-player.x, 2)+Math.pow(child.y-player.y, 2))<200){
					child.disableBody(true,true);
				}
		})
	}
>>>>>>> Stashed changes
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
}