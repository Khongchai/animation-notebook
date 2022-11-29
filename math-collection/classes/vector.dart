import 'dart:math';

class Vector {
  double _x;
  double _y;

  Vector({double x = 1, double y = 0})
      : this._x = x,
        this._y = y;

  setX(double value) => this._x = value;
  double get x {
    return this._x;
  }

  setY(double value) => this._y = value;
  double get y {
    return this._y;
  }

  setAngle(double angle) {
    this._x = cos(angle) * this.length;
    this._y = sin(angle) * this.length;
  }

  double get angle {
    return atan2(this._y, this._x);
  }

  setLength(double length) {
    this._x = cos(this.angle) * length;
    this._y = sin(this.angle) * length;
  }

  double get length {
    return sqrt(pow(this._x, 2) + pow(this._y, 2));
  }

  Vector add(Vector vectorToAdd) {
    return new Vector(x: this._x + vectorToAdd.x, y: this._y + vectorToAdd.y);
  }

  Vector subtract(Vector vectorToSubtract) {
    return new Vector(
        x: this._x - vectorToSubtract.x, y: this._y - vectorToSubtract.y);
  }

  Vector multiply(double scalar) {
    return new Vector(x: this._x * scalar, y: this._y * scalar);
  }

  Vector divide(double scalar) {
    return new Vector(x: this._x / scalar, y: this._y / scalar);
  }

  void copy(Vector vector) {
    this._x = vector.x;
    this._y = vector.y;
  }
}


