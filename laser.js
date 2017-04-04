function Laser(x, y) {
  this.x = x;
  this.y = y;
  this.r = 5;
  this.move_speed = 10;
  this.destroyed = false;


  this.show = function(r,g,b) {
    fill(r,g,b);
    ellipse(this.x,this.y, this.r, this.r*3);
  }

  this.hits = function(alien) {

    if (alien.destroyed) {
      return false;
    }
    var d = dist(this.x, this.y, alien.x, alien.y);

    if (d < this.r + alien.r) {
      this.destroyed = true;
      return true;
    } else {
      return false;
    }
  }

  this.hits_bonus = function(bonus_alien) {

    var d = dist(this.x, this.y, bonus_alien.x, bonus_alien.y);

    if (d < this.r + bonus_alien.r) {
      bonus_alien.destroyed = true;

      this.destroyed = true;
      return true;
    } else {
      return false;
    }
  }

  this.move = function(dir) {
    this.y += this.move_speed*dir;
  }

  this.hits_ship = function(ship) {

    if (this.y >= height-105 && (this.x >= ship.x && this.x <= ship.x+15)) {
      return true;
    } else {
      return false;
    }
  }

}
