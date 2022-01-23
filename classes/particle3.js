//Optimized particle; not using a vector class
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
  springs = [];
  gravitationPoints = [];

  constructor(x, y, magnitude, direction, gravity = 0) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(direction) * magnitude;
    this.vy = Math.sin(direction) * magnitude;
    this.gravity = gravity;
  }

  addGravitationPoint(p) {
    //We need to remove first because we don't want to add the same point twice.
    this.removeGravitationPoint(p);
    this.gravitationPoints.push(p);
  }

  removeGravitationPoint(p) {
    this.gravitationPoints = this.gravitationPoints.filter((g) => g.p !== p);
  }

  //Instead of calling this, call use quadtree
  handleGravitation() {
    this.gravitationPoints.forEach((gp) => {
      this.gravitateTo(gp);
    });
  }

  addSpring(point, k, length = 0) {
    this.removeSpring(point);
    this.springs.push({ point, k, length });
  }

  removeSpring(p) {
    this.springs = this.springs.filter((s) => s.point !== p);
  }

  handleSprings() {
    this.springs.forEach((s) => {
      this.springTo(s.point, s.k, s.length);
    });
  }

  update() {
    this.vx = this.vx * this.friction;
    //this optimization limits gravity to the y axis.
    this.vy = this.vy * this.friction + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.handleSprings();
    this.handleGravitation();
  }

  angleTo(p) {
    return Math.atan2(p.y - this.y, p.x - this.x);
  }

  distanceTo(p) {
    const floorRes = Math.abs(
      p.x * p.x - this.x * this.x + p.y * p.y - this.y * this.y
    );
    const dis = Math.sqrt(floorRes);
    return dis;
  }

  gravitateTo(p) {
    const distanceX = p.x - this.x;
    const distanceY = p.y - this.y;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
    const distance = Math.sqrt(distanceSquared);
    const force = p.mass / distanceSquared;
    //Instead of doing this, we can skip the sqrt and just do the division.
    //This is a very small optimization, but it's a good one.
    // const angle = this.angleTo(p);
    // const ax = force * Math.cos(angle);
    // const ay = force * Math.sin(angle);

    const ax = distanceX / distance;
    const ay = distanceY / distance;

    //For center of gravities, radius can be null
    const targetRadius = p.radius ? p.radius : this.radius;
    const colliding = this.radius + targetRadius >= distance;
    if (!colliding) {
      this.vx += ax * force;
      this.vy += ay * force;
    }
  }

  getSpeed() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  getAngle() {
    return Math.atan2(this.vy, this.vx);
  }

  setSpeed(speed) {
    const heading = this.getAngle();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  }

  setAngle(heading) {
    const speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  }

  springTo(point, k, length) {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - length;
    const springForce = distance * k;
    this.vx += (dx / distance) * springForce;
    this.vy += (dy / distance) * springForce;
  }
}
