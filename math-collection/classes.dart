class Point {
  double x;
  double y;

  Point(this.x, this.y);
}

class Circle extends Point {
  double radius;

  Circle(this.radius, double x, double y) : super(x, y);
}

class Rectangle extends Point {
  double width;
  double height;

  Rectangle(this.width, this.height, double x, double y)
      : super(x, y);
}
