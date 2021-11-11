class Particle {
  _position = null;
  _velocity = null;
  _gravity = null;

  constructor(x, y, magnitude, direction, gravity) {
    this._position = new Vector(x, y);
    this._velocity = new Vector(0, 0);
    this._velocity.setLength(magnitude);
    this._velocity.setAngle(direction);
    this._gravity = new Vector(0, gravity || 0);
  }
  update() {
    //This line makes stuff accelerates
    this._velocity = this._velocity.add(this._gravity);
    this._position = this._position.add(this._velocity);
  }
}
