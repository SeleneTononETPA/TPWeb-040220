var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
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
	var gems;
	var scoreText;
	var rochers;
}

function preload(){
	this.load.image('ciel','assets/skies.png');
	this.load.image('mer','assets/sea.png');
	this.load.image('nuages','assets/clouds.png');
	this.load.image('groundFond','assets/far-grounds.png');
	this.load.image('gems','assets/gems.png');
	this.load.image('sol','assets/sol.png');
	this.load.image('rochers','assets/rochers.png');
	this.load.image('arbre','assets/arbre.png');
	this.load.image('platehaute','assets/platehaute.png');
	this.load.spritesheet('perso','assets/personne.png',{frameWidth: 25, frameHeight: 50});
}



function create(){
	this.add.image(400,300,'ciel');
	this.add.image(100,400,'nuages');
	this.add.image(400,400,'nuages');
	this.add.image(800,500,'nuages');
	this.add.image(400,500,'groundFond');
	this.add.image(200,485,'arbre');
	this.add.image(300,620,'mer');


	platforms = this.physics.add.staticGroup();
	platforms.create(300,588,'platehaute');
	platforms.create(400,588,'platehaute');
	platforms.create(100,588,'sol');
	platforms.create(600,588,'sol');
//	platforms.create(600,400,'platehaute');
//	platforms.create(50,250,'platehaute');

	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0);
	player.body.setGravityY(100);
	this.physics.add.collider(player,platforms);

	cursors = this.input.keyboard.createCursorKeys();

	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 5}),
		frameRate: 5,
		repeat: -1
	});

	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:0}],
		frameRate: 10
	});

	gems = this.physics.add.group({
		key: 'gems',
		repeat:10,
		setXY: {x:12,y:0,stepX:70}
	});


	this.physics.add.collider(gems, platforms);
	this.physics.add.overlap(player,gems,collectGems,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	rochers = this.physics.add.group();
	this.physics.add.collider(rochers,platforms);
	this.physics.add.collider(player,rochers, hitRochers, null, this);

}



function update(){
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-150);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(150);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}

	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-200);
	}

}
function hitRochers(player, rochers){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;
}

function collectGems(player, gem){
	gem.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if (gems.countActive(true) === 0){
		gems.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		var x = (player.x < 400) ?
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var rocher = rochers.create(x, 16, 'rochers');
		rocher.setBounce(1);
		rocher.setCollideWorldBounds(true);
		rocher.setVelocity(Phaser.Math.Between(-200, 200), 20);

}
}
