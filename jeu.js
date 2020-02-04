var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

var score = 0;
var platforms;

var player;
var jump;
var nVies = 3;

var cursors; 
var stars;
var scoreText;
var bomb;



function preload(){
	this.load.image('background','asset/sky.png');	
	this.load.image('sol','asset/platform.png');
	this.load.spritesheet('perso','asset/perso.png',{frameWidth: 32, frameHeight: 32});

	this.load.image('etoile','asset/star.png');
	this.load.image('bomb','asset/bomb.png');

		
}




function create(){
	this.add.image(400,300,'background');

	/*Platformes*/
	platforms = this.physics.add.staticGroup();
	platforms.create(50,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(160,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(330,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(420,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(600,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(700,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(690,370,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(200,270,'sol').setScale(0.75,0.5).refreshBody();
	
	/*Joueur*/
	player = this.physics.add.sprite(100, 500, 'perso').setScale(2);
	player.setCollideWorldBounds(true);
	this.physics.add.collider(player,platforms);
	this.physics.add.collider(player,platforms);
		//Vie
		//Animation du joueur
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 6}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});
	
	/*Creation des input directionnelles*/
	cursors = this.input.keyboard.createCursorKeys(); 
	
		
	
	/*Collectible*/
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	/*Textes*/
		//Score
	scoreText = this.add.text(600, 16, '0 ', { fontSize: '32px', fill: '#000' });

	/*Ennemi*/
		//Bombes
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
	
}



function update(){

	/*Déplacement*/
		//Courir
	if(cursors.down.isDown && cursors.left.isDown)
	{
		player.setVelocityX(-500);
	}

	if(cursors.down.isDown && cursors.right.isDown)
	{
		player.setVelocityX(500);
	}



		//Saut
	if(player.body.touching.down)
	{
		jump = 0;
	}

    if (cursors.up.isDown && player.body.touching.down) 
 	{
   		player.setVelocityY(-350);
  	 	jump = 1;
 	}
     
   	if (cursors.up.isDown && jump == 1) 
    {
        player.setVelocityY(-350);

    }

		//Droite et gauche
	if(cursors.left.isDown)
	{
		player.setVelocityX(-200);
		player.anims.play('left', true);
		player.setFlipX(true);

		if(cursors.down.isDown && cursors.left.isDown)
		{
			player.setVelocityX(-500);
		}
	}
	else if(cursors.right.isDown)
	{
		player.setVelocityX(200);
		player.anims.play('left', true);
		player.setFlipX(false);

		if(cursors.down.isDown && cursors.right.isDown)
		{
			player.setVelocityX(500);
		}
	}
	else
	{
		player.setVelocityX(0);
		player.anims.play('stop', true);
	}

	
}



function hitBomb(player, bomb){
	bomb.disableBody(true, true);

	this.physics.pause();
    player.setTint(0xff0000);
   	gameOverText.visible = true;
   	newGameText.visible = true;
   	gameOver = true;
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


