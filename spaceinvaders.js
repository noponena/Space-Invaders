var ship;
var aliens;
var laser_beams;
var alien_laser_beams;
var super_laser_beams;
var bonus_aliens;
var alien_row = [];
var moved;
var dir;
var can_shoot;
var aliens_in_a_row = 8;
var alien_rows = 5;
var move_closer;
var reset_button;
var start_button;
var game_over;
var shoot;
var bonus;
var bonus_lasers;
var shoot_delay;
var score;
var shots_fired;
var time_elapsed;
var time_penalty;
var started;
var paused;
var pause_button;
var framerate;
var save_button;
var load_button;
var submit_button;
var text;

function setup() {
    framerate = 40;
    paused = false;
    started = false;
    time_penalty = 0;
    score = 0;
    time_elapsed = 1;
    shots_fired = 0;
    laser_beams = [];
    alien_laser_beams = [];
    super_laser_beams = [];
    bonus_aliens = [];
    aliens = [];
    shoot_delay = 0;
    bonus_lasers = 0;
    bonus = 0;
    shoot = 0;
    game_over = false;
    aliens = new Array(4);
    dir = 1;
    moved = 0;
    can_shoot = true;
    move_closer = 0;
    createCanvas(600,700);
    ship = new Ship();
    frameRate(framerate);

    start_button = createButton("Start");
    start_button.position(50 + 60, 635);
    start_button.mousePressed(startGame);

    pause_button = createButton("Pause");
    pause_button.position(50 + 60, 660);
    pause_button.mousePressed(pauseGame);

    save_button = createButton("Save");
    save_button.position(370 + 60, 630);
    save_button.mousePressed(saveGameState);

    load_button = createButton("Load");
    load_button.position(370 + 60, 655);
    load_button.mousePressed(request_loading);

    submit_button = createButton("Submit score");
    submit_button.position(370 + 60, 680);
    submit_button.mousePressed(submitScore);

    for (var i = 0; i < alien_rows; i++) {

      aliens[i] = new Array(5);
    }

    for (var i = 0; i < alien_rows;i++) {
      for (var j = 0; j < aliens_in_a_row;j++) {
        if (i % 2 == 0) {
          aliens[i][j] = new Alien(j*50-25+120,i*50+60);

        } else {
          aliens[i][j] = new Alien(j*50+25+120,i*50+60);
        }
      }
    }
}


function draw() {

  if (time_elapsed % 200 == 0) {

    time_penalty++;
  }

  if (!paused && started) {

    advance();
  }

  if (game_over) {

    gameOver();
    started = false;
    return;
  }

  if (check_victory()) {

    if (started) {
      score += 50;
    }

    gameOver();
    started = false;
    return;
  }

  if (bonus == 250) {
    var dir_;
    var k = Math.floor((Math.random() * 2) + 1);
    if (k == 1) {
      dir_ = 1;
      generateBonusAlien(0,20,dir_);
    }
    else {
        dir_ = -1;
        generateBonusAlien(width,20,dir_);
    }

    bonus = 0;

  }

  if (!can_shoot) {
    shoot_delay++;

    if (shoot_delay >= 30) {

      shoot_delay = 0;
      can_shoot = true;
    }
  }

  if (moved == 50) {
    moved = 0;
    dir *= -1;
  }

  if (shoot == 120) {
    aliensShoot();
    shoot = 0;
  }

  background(51);

  fill(75,75,75);
  rect(0,height-99,width,101);

  if (!started) {
    return;
  }

  destroyBonusAliens();

  score = check_score() - shots_fired - time_penalty;
  if (score < 0) {
    score = 0;
  }


  bonus_shots();
  for (var i = 0; i < bonus_aliens.length;i++) {
    bonus_aliens[i].show();
    if (!paused) {
      bonus_aliens[i].move();
    }

  }


  displayScore();

  alienHits(aliens,ship);
  bonus_shots();
  ship.show();
  for (var i = 0; i < laser_beams.length;i++) {
    if (!laser_beams[i].destroyed) {
      laser_beams[i].show(255,0,0);
      if (!paused) {
        laser_beams[i].move(-1);
      }
    }
  }

  for (var i = 0; i < super_laser_beams.length;i++) {
    if (true) {
      super_laser_beams[i].show();

      if (!paused) {
        super_laser_beams[i].move();
      }
    }
  }


  for (var i = 0; i < alien_laser_beams.length;i++) {
    alien_laser_beams[i].show(200,200,0);
    if (!paused) {
      alien_laser_beams[i].move(1);
    }

    if (alien_laser_beams[i].hits_ship(ship)) {
      game_over = true;
    }
    if (alien_laser_beams[i].y >= height-100) {
      alien_laser_beams.splice(i, 1);
    }
  }


  for (var j = 0;j < aliens.length;j++) {
    for (var k = 0;k < aliens[j].length;k++) {
      if (true) {
        for (var i = 0; i < laser_beams.length;i++) {
          if ((laser_beams[i].hits(aliens[j][k]))) {
            aliens[j][k].lose_hp();
            laser_beams.splice(i, 1);
        }

      }

      for (var h = 0; h < super_laser_beams.length;h++) {
        if (super_laser_beams[h].hits(aliens[j][k]) && !aliens[j][k].destroyed) {

          aliens[j][k].lose_hp();
          }
        }
      }
      }
    }


    for (var i = 0; i < bonus_aliens.length; i++) {

      for (var j = 0; j < laser_beams.length;j++) {

        if (laser_beams[j].hits_bonus(bonus_aliens[i])) {

          if (bonus_lasers < 3) {
            bonus_lasers++;
          }
          laser_beams.splice(j, 1)
        }
    }
  }


  for (var i = 0; i < laser_beams.length; i++) {

    if (laser_beams[i].y <= 0) {
      laser_beams.splice(i,1);
    }
  }


  for (var i = 0; i < super_laser_beams.length; i++) {

    if (super_laser_beams[i].y <= 0) {
      super_laser_beams.splice(i,1);
    }
  }


  for (var j = 0;j < aliens.length;j++) {
    for (var k = 0;k < aliens[j].length;k++) {
      if (!aliens[j][k].destroyed) {
        aliens[j][k].show();

        if (!paused) {
          if (j % 2 == 0) {
            aliens[j][k].move(dir);
          } else {
            aliens[j][k].move(dir*-1);
          }
        }
      }
    }
  }


  if (move_closer == 200) {
    for (var j = 0;j < aliens.length;j++) {
      for (var k = 0;k < aliens[j].length;k++) {
        aliens[j][k].move_closer();
      }
    }
    move_closer = 0;
  }
}

function aliensShoot() {

  for (var i = 0; i < aliens.length; i++) {

    for (var j = 0; j < aliens[i].length; j++) {

      if (i < aliens.length-1) {
        if (aliens[i+1][j].destroyed && !aliens[i][j].destroyed) {

          if (Math.floor((Math.random() * 2) + 1) == 1) {
            var laser = new Laser(aliens[i][j].x,aliens[i][j].y);
            alien_laser_beams.push(laser);
          }

        }

      } else {
        if (!aliens[i][j].destroyed) {
          if (Math.floor((Math.random() * 2) + 1) == 1) {
            var laser = new Laser(aliens[i][j].x,aliens[i][j].y);
            alien_laser_beams.push(laser);
          }
        }

      }

    }
  }
}

function displayScore() {

  if (!game_over) {
    fill(185,85,75);
    textSize(24);
    text("Score: " + score,255,660);
  }

}


function gameOver() {

  background(51);

  fill(75,75,75);
  rect(0,height-99,width,101);

  fill(185,85,75);
  textSize(24);
  text(" Game over!\nYou scored: " + score,210,650);
}

function keyPressed() {
  if (key === ' ' && can_shoot && !paused) {
    if (score > 0) {
      shots_fired++;
    }
    can_shoot = false;
    var laser = new Laser(ship.give_x()+10, height-120);
    laser_beams.push(laser);

  }

  if (keyCode === 82 && can_shoot) {

    if (bonus_lasers > 0 && !paused) {

      can_shoot = false;
      var super_laser = new Super_laser(ship.give_x()+10, height-120);
      bonus_lasers--;
      super_laser_beams.push(super_laser);
    }
  }

  if (keyCode === 80) {

    pauseGame();
  }

  if (keyCode === RIGHT_ARROW && !paused) {
    ship.move_right(20);

  } else if (keyCode === LEFT_ARROW && !paused) {
    ship.move_left(20);
  }
}

function alienHits(aliens_,ship_) {

  for (var i = 0; i < aliens_.length;i++) {

    for (var j = 0; j < aliens_[i].length;j++) {

      if (aliens_[i][j].hits(ship_) || aliens_[i][j].y >= height-115) {
        game_over = true;
      }
    }
  }
}

function generateBonusAlien(x,y,dir) {

  var bonus_alien_ = new Bonus_alien(x,y,dir);
  bonus_aliens.push(bonus_alien_);
}

function destroyBonusAliens() {

  for (var i = 0; i < bonus_aliens.length; i++) {

    if (bonus_aliens[i].destroyed) {
      bonus_aliens.splice(i, 1);
    }
  }
}

function bonus_shots() {

  for (var i = 0; i < bonus_lasers;i++) {

    fill(255,90,155);
    ellipse(50,625+25*i, 15*3, 15);
  }
}


function check_victory() {

  for (var i = 0; i < aliens.length;i++) {

    for (var j = 0; j < aliens[i].length;j++) {

      if (!aliens[i][j].destroyed) {

        return false;
      }
    }
  }

  return true;
}

function check_score() {

  var _score = 0;
  for (var i = 0; i < aliens.length;i++) {

    for (var j = 0; j < aliens[i].length;j++) {

      if (aliens[i][j].destroyed) {

        _score += 10;
      }
    }
  }
  return _score;
}


function startGame() {

  setup();
  started = true;
}

function pauseGame() {

  if (paused) {
    paused = false;
  } else {
    paused = true;
  }
}


function advance() {

   moved += 1;
   bonus += 1;
   shoot++;
   time_elapsed++;
   move_closer++;

 }


function submitScore() {

  var msg = {
    "messageType": "SCORE",
    "score": score
  };

  window.parent.postMessage(msg, "*");
}


 function saveGameState() {

   var serializedAliens = [];
   var a = 0;

   for (var i = 0; i < aliens.length; i++ ) {

     for (var j = 0; j < aliens[i].length; j++) {

       serializedAliens[a] = [aliens[i][j].x, aliens[i][j].y, aliens[i][j].hp,
                              aliens[i][j].destroyed];
       a++;

     }
   }

   var msg = {
     "messageType": "SAVE",
     "gameState": {
       "locations": {
         "aliens": serializedAliens,
         "ship": ship.x
       },
       "bonus_lasers": bonus_lasers

     }
   };

   window.parent.postMessage(msg, "*");
 }


 function request_loading() {

  var msg = {
    "messageType": "LOAD_REQUEST",
  };
  window.parent.postMessage(msg, "*");
 }


 function loadGameState(ship_location, alien_locations, bonus) {

   ship.x = ship_location;
   bonus_lasers = bonus;
   var a = 0;

   for (var i = 0; i < aliens.length; i++) {

     for (var j = 0; j < aliens[i].length; j++) {

       aliens[i][j].x = ship_location[a][0];
       aliens[i][j].y = ship_location[a][1];
       aliens[i][j].hp = ship_location[a][2];
       aliens[i][j].destroyed = ship_location[a][3];
       a++;
     }
   }
 }
