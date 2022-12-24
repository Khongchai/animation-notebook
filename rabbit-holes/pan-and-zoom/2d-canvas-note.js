// Code from: https://codepen.io/amir-s/pen/jzqZdG?editors=0111

let canvas, circles;
const controls = {
  view: {x: 0, y: 0, zoom: 1},
  viewPos: { prevX: null,  prevY: null,  isDragging: false },
}

function setup() {
	canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e))
  circles = Circle.create(100)
}

function draw() {
	background(100)
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom)
  circles.forEach(circle => circle.show());
}

class Controls {
  static zoom(controls) {
    function worldZoom(e) {
      const {x, y, deltaY} = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = 0.05;
      const zoom = 1 * direction * factor;

      //controls.view.x is essentially the previous offset.
      // we are transforming things into the world space.
      // x -> cursor pos in screen space
      // y -> cursor pos in screen space
      // same for wx and wy
      const wx = (x-controls.view.x)/(controls.view.zoom);
      const wy = (y-controls.view.y)/(controls.view.zoom);
      
      const offsetX = wx*zoom;
      const offsetY = wy*zoom;
      console.log(offsetX, offsetY);
      
      // view.x and view.y are basically what we are gonna use as the zoom centers.
      controls.view.x -= offsetX;
      controls.view.y -= offsetY;
      controls.view.zoom += zoom;
    }

    return {worldZoom}
  }
}


class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, 15, 15);
  }
  
  static create(count) {
    return Array.from(Array(count), () => {
      const x = random(-500, width + 500);
      const y = random(-500, height + 500);
      return new this(x, y);
    })
  }
}