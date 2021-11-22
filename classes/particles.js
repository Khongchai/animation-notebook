class Particle {
  position = null;
  velocity = null;
  gravity = null;
  mass = 1;
  radius = 0;

  constructor(x, y, magnitude, direction, gravity) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.velocity.setLength(magnitude);
    this.velocity.setAngle(direction);
    this.gravity = new Vector(0, gravity || 0);
  }

  update() {
    //This line makes stuff accelerates
    this.velocity = this.velocity.add(this.gravity);
    this.position = this.position.add(this.velocity);
  }

  angleTo(p) {
    return Math.atan2(
      p.position.getY() - this.position.getY(),
      p.position.getX() - this.position.getX()
    );
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

    return this.gravity;
  }
}
