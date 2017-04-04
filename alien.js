function Alien(x, y) {
  this.x = x;
  this.y = y;
  this.r = 15;
  this.hp = 3;
  this.color = 255;
  this.destroyed = false;

  this.show = function() {

    if (this.hp > 0) {
      fill(0,this.color,120);
      ellipse(this.x, this.y, this.r*2, this.r*2);
    }
  }

  this.destroy = function() {
    this.destroyed = true;
  }

  this.move = function(dir) {
    this.x += dir;
  }

  this.move_closer = function() {
    this.y += 15;
  }

  this.lose_hp = function() {
    this.hp--;
    this.color -= 80;
    if (this.hp <= 0) {
      this.destroyed = true;
    }
    fill(0,this.color,120);
  }

  this.hits = function(ship) {

    if (this.y+this.r >= height-120 && (ship.x <= this.x+this.r && ship.x >= this.x-this.r)) {
      this.destroyed = true;
      this.r = 0;
      return true;
    } else {
      return false;
    }

  }
}
