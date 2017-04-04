function Bonus_alien(x,y,dir) {

  this.x = x;
  this.y = y;
  this.r = 15;
  this.dir = dir;
  this.destroyed = false;

  this.show = function() {

    fill(255,100,120);
    ellipse(this.x, this.y, this.r*2, this.r*2);

  }

  this.move = function() {

    this.x += this.dir*3;
  }

}
