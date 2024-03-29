import 'dart:math';
import "dart:core";

import 'classes/point.dart';
import 'classes/vector.dart';

/*
  sources:
  https://github.com/bit101/CodingMath
  https://www.gamedev.net/articles/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
  https://en.wikipedia.org/wiki/B%C3%A9zier_curve
  https://en.wikipedia.org/wiki/Cycloid

*/

double lerp(double x, double y, double t) {
  return x + (y - x) * t;
}

double inverseLerp(double x, double y, double weight) {
  return (weight - x) / (y - x);
}

double remap(
    double iMin, double iMax, double oMin, double oMax, double weight) {
  return lerp(oMin, oMax, inverseLerp(iMin, iMax, weight));
}

//Automatically check if x is between val1 and val2 (where max and min are checked again)
bool inRangeTrueMaxMin(double val1, double val2, double x) {
  return min(val1, val2) <= x && x <= max(val1, val2);
}

double distance(Point p1, Point p2) {
  double dx = p1.x - p2.x;
  double dy = p1.y - p2.y;
  return sqrt(dx * dx + dy * dy);
}

///Check if the radius of the circle is smaller than the distance between the two points
bool circlesColliding(Circle c1, Circle c2) {
  return c1.radius + c2.radius >= distance(c1, c2);
}

bool circlesPointColliding(Point p, Circle c) {
  return c.radius > distance(p, c);
}

bool rectanglePointColliding(Point point, Rectangle rectangle) {
  return (inRangeTrueMaxMin(
          point.x, rectangle.x, rectangle.x + rectangle.width) &&
      inRangeTrueMaxMin(point.y, rectangle.y, rectangle.y + rectangle.height));
}

num roundToPlaces(num number, num pos) {
  num newPos = pow(10, pos);
  return (number * newPos).round() / newPos;
}

//This is very useful for snapping to grids and stuff
//Nearest can be like the grid xy size or something
//By dividing by the nearest value, you can get the nearest multiple of the nearest value
/*
  example:
  nearest = 40
  num = 113
  nearestMultiple = nearest * (num / nearest).round()
  nearestMultiple = 40 * (113 / 40).round()
  nearestMultiple = 40 * (2.825).round()
  nearestMultiple = 40 * 3
  nearestMultiple = 120 (the nearest multiple of 40)
*/
num roundNearest(value, nearest) {
  return (value / nearest).round() * nearest;
}

Point quadraticBezier(Point p0, Point p1, Point p2, double t, Point pFinal) {
  /**
   * You can prove the equation below by expanding the following 
   * lerp = (x, y, t) => (1-t) * x + t * y;
   *
   * pB = lerp(p0, p1, t);
   * pA = lerp(p1, p2, t);
   * pFinal = lerp(pA, pB, t);
   */

  pFinal.x = pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  pFinal.y = pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  return pFinal;
}

Point cubicBezier(Point p0, Point p1, Point p2, Point p3, int t, Point pFinal) {
  pFinal.x = pow(1 - t, 3) * p0.x +
      pow(1 - t, 2) * 3 * t * p1.x +
      (1 - t) * 3 * t * t * p2.x +
      t * t * t * p3.x;
  pFinal.y = pow(1 - t, 3) * p0.y +
      pow(1 - t, 2) * 3 * t * p1.y +
      (1 - t) * 3 * t * t * p2.y +
      t * t * t * p3.y;

  return pFinal;
}

Point cycloid(double x, double y, double theta, double radius) {
  //The -1 is just to make the circle go the other way
  //The -1 is not included here for simplicity
  //we use ctx.translate(0, canvas.height / 2) to make the circle go the other way instead
  //cos and sin are switched just because we want to flip the circle to make curve face up
  return Point((theta - sin(theta)) * radius, cos(1 - theta) * radius);
}

//Returns N points between low and high
List<double> range(double low, double high, int n) {
  List<double> arr = [];

  for (double i = low; i < n; i++) {
    arr.add(lerp(low, high, i / n));
    //or arr.add(low + (high - low) * i / n);
  }
  /*
    or 
    for (int i = low; i < high; i+=high/n) {
      arr.add(i);
    }
  */

  return arr;
}

num randomRange(num min, num max) {
  num range = max - min;
  return min + Random().nextDouble() * range;
}

int randomInt(int min, int max) {
  int range = max - min + 1;
  return (min + Random().nextDouble() * range).floor();
}

double hookesLaw(double x, double y, double k) {
  return (y - x) * k;
}

void springTo(Point origin, Point target, double constant, double friction) {
  final double dx = target.x - origin.x;
  final double dy = target.y - origin.y;

  final double distance = sqrt(dx * dx + dy * dy);

  final double springForceX = distance * constant;
  final double springForceY = distance * constant;

  origin.vx += (dx / distance) * springForceX;
  origin.vy += (dy / distance) * springForceY;

  origin.vx *= friction;
  origin.vy *= friction;

  origin.x += origin.vx;
  origin.y += origin.vy;
}

double dotProduct(Vector v1, Vector v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

double angleBetween(Vector v1, Vector v2) {
  return acos(dotProduct(v1, v2) / (v1.length * v2.length));
}

// Result of combining the standard forms of
// the p0, p1 line and p2, p3 line.
Vector lineIntersect(Vector p0, Vector p1, Vector p2, Vector p3) {
  final A1 = p1.y - p0.y;
  final B1 = p0.x - p1.x;
  final C1 = A1 * p0.x + B1 * p0.y;
  final A2 = p3.y - p2.y;
  final B2 = p2.x - p3.x;
  final C2 = A2 * p2.x + B2 * p2.y;

  final denominator = A1 * B2 - A2 * B1;

  return Vector(
    x: (B2 * C1 - B1 * C2) / denominator,
    y: (A1 * C2 - A2 * C1) / denominator,
  );
}
