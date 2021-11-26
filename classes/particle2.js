class Particle {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;

  gravity = null;
  mass = 1;
  radius = 0;
  bounce = -1;
  friction = 1;

  constructor(x, y, magnitude, direction, gravity) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(direction) * magnitude;
    this.vy = Math.sin(direction) * magnitude;
    this.gravity = gravity || 0;
  }

  accelerate(ax, ay) {
    this.vx += ax;
    this.vy += ay;
  }

  update() {
    this.vx = this.vx * this.friction;
    //this optimization limits gravity to the y axis.
    this.vy = this.vy * this.friction + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
  }

  //TODO continue optimizing from here.
  angleTo(p) {
    return Math.atan2(p.y - this.y, p.x - this.x);
  }

  distanceTo(p) {
    return Math.sqrt(
      Math.pow(p.position.getX() - this.position.getX(), 2) +
        Math.pow(p.position.getY() - this.position.getY(), 2)
    );
  }

  gravitateTo(p) {
    const angle = this.angleTo(p);
    const distance = this.distanceTo(p);

    //We're not using the gravitational constant here because we're not trying to simulate the real world
    this.gravity.setLength(p.mass / distance ** 2);
    this.gravity.setAngle(angle);
  }
}
