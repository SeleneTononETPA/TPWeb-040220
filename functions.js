
function damageCristal(){
  pv_cristal-=5*dps_cristal;
  if(pv_cristal<0){pv_cristal=0;}
  text_pvcristal.setText(pv_cristal);
  score += 10;
  text_score.setText('score: '+score);
}

function spawn_spectre(){
  var i_spawn = Phaser.Math.Between(0,3);
  if (i_spawn<2){
    var spectre = spectres.create( spawn_spot[i_spawn][0], spawn_spot[i_spawn][1], 'spectre').setSize(63,94).setOffset(3,66);
    spectre.setVelocityX(70);
    spectre.anims.play('spectre_walk', true);
    timer.delay *=0.99;
  }else {
    var spectre = spectres.create( spawn_spot[i_spawn][0], spawn_spot[i_spawn][1], 'spectre').setSize(63,94).setOffset(63,66);
    spectre.setFlipX(true);
    spectre.setVelocityX(-70);
    spectre.anims.play('spectre_walk', true);
    timer.delay *=0.99;
  }
  }
  function spawn_carte(){
    carte_setDispo(1);
    var i_spawn = Phaser.Math.Between(0,2);
    }

function contactCristal(cristal, spectre){
  spectre.body.setVelocityX(0);
  if (spectre.body.facing == 11){
    spectre.setSize(60,94).setOffset(65,66);
  }else{
    spectre.setSize(60,94).setOffset(2,66);
  }
  spectre.anims.play('spectre_hit');

}

function spectre_near_cristal(spectres){
  dps_cristal=0 ;
  for (var i = 0; i < spectres.children.entries.length; i++) {
    if (Phaser.Math.Difference(spectres.children.entries[i].body.center.x,cristal.body.center.x)<80){
      range = spectres.children.entries[i].body.center.x-player.body.center.x;
      dps_cristal++;
    }
  }
}

function att_spectre(){
  var range;
  for (var i = 0; i < spectres.children.entries.length; i++) {
    if (Phaser.Math.Difference(spectres.children.entries[i].body.center.y,player.body.center.y)<20){
      if (Phaser.Math.Difference(spectres.children.entries[i].body.center.x,player.body.center.x)<80){
        spectres.children.entries[i].anims.stop();
        spectres.children.entries[i].anims.play('spectre_death');
        spectres.remove(spectres.children.entries[i]);
        score += 10;
      	text_score.setText('score: '+score);
      }
    }
  }
}
function pylons_activation(){
  if (carte_dispo == 1){
    var kills = 0;
    for (var i = 0; i < pylons.children.entries.length; i++) {
      for (var j = 0; j < spectres.children.entries.length; j++)
      if (Phaser.Math.Difference(pylons.children.entries[i].body.center.x,spectres.children.entries[j].body.center.x)<100){
        spectres.children.entries[j].anims.stop();
        spectres.children.entries[j].anims.play('spectre_death');
        spectres.remove(spectres.children.entries[j]);
        score += 10;
        text_score.setText('score: '+score);
        kills ++;
        if (kills ==40) {
          carte_setDispo(0);
          return ;
        }
      }
    }
    carte_setDispo(0);
  }
}

function carte_setDispo(x) {
  for (var i = 0; i < cartes.children.entries.length; i++) {
    cartes.children.entries[i].setActive(x);
    cartes.children.entries[i].setVisible(x);
  }
  carte_dispo = x;
}
