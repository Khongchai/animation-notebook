import 'dart:math';

import "./classes.dart";

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
      return (
        inRangeTrueMaxMin(point.x, rectangle.x, rectangle.x + rectangle.width) &&
        inRangeTrueMaxMin(point.y, rectangle.y, rectangle.y + rectangle.height)
      );
    }
