//Simplified version of Vector
class Point {
  double x;
  double y;
  double vx;
  double vy;

  Point(this.x, this.y, {this.vx = 0, this.vy = 0});
}

class Circle extends Point {
  double radius;

  Circle(this.radius, double x, double y) : super(x, y);
}

class Rectangle extends Point {
  double width;
  double height;

  Rectangle(this.width, this.height, double x, double y) : super(x, y);
}
