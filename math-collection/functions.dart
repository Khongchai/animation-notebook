import 'dart:math';

import 'classes/point.dart';

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
