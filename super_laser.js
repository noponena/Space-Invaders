function Super_laser(x, y) {
  this.x = x;
  this.y = y;
  this.r = 15;
  this.destroyed = false;


  this.show = function() {
    fill(255,90,155);
    ellipse(this.x,this.y, this.r, this.r*3);
  }

  this.hits = function(alien) {
    var d = dist(this.x, this.y, alien.x, alien.y);

    if (d < this.r + alien.r) {
      this.destroyed = true;
      return true;
    } else {
      return false;
    }
  }
  this.move = function() {
    this.y += -6;
  }

}
