import "./vector.dart";

class Particle {
  Vector position;
  Vector velocity;
  
  Particle(double x, double y, double speed, double direction): position = new Vector(x: x, y: y), velocity = new Vector() {
    velocity.setLength(speed);
    velocity.setAngle(direction);
  }
}


