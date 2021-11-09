//Assume starting point of vector is at (0, 0).
class Vector {
  _x = 0;
  _y = 1;

  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  setX(value) {
    this._x = value;
  }
  getX() {
    return this._x;
  }

  setY(value) {
    this._y = value;
  }
  getY() {
    return this._y;
  }

  setAngle(angle) {
    const length = this.getLength();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }
  getAngle() {
    return Math.atan2(this._y, this._x);
  }

  setLength(length) {
    const angle = this.getAngle();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }
  getLength() {
    return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
  }

  add(vectorToAdd) {
    return new Vector(
      this._x + vectorToAdd.getX(),
      this._y + vectorToAdd.getY()
    );
  }

  subtract(vectorToSubtract) {
    return new Vector(
      this._x - vectorToSubtract.getX(),
      this._y - vectorToSubtract.getY()
    );
  }

  multiply(scalar) {
    return new Vector(this._x * scalar, this._y * scalar);
  }

  divide(scalar) {
    return new Vector(this._x / scalar, this._y / scalar);
  }

  copy(vector) {
    this = vector;
  }
}



