function Ship() {
  this.x = width/2;

  this.a = this.x;
  this.b = this.x+20;
  this.c = this.x+10;


  this.show = function() {
    fill(155,222,255);
    triangle(this.x, height-100, this.x+20, height-100, this.x+10, height-120);
  }

  this.move_right = function(dir) {
    if (this.x < width-20) {
      this.x += dir;
    }
  }

  this.move_left = function(dir) {
    if (this.x >= 20) {

      this.x -= dir;
    }

  }

  this.give_x = function() {
    return this.x;
  }


}
