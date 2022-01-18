//Bug: most likely wrong quadrant assignment
class Quadtree {
  constructor(currentNodeLevel, rectangularBound, drawingContext = null) {
    this.MAX_OBJECTS = 2;
    this.MAX_LEVELS = 8;

    this.currentNodeLevel = currentNodeLevel;
    this.rectangularBound = rectangularBound;
    this.objects = [];
    this.nodes = []; // array of 4 sub-nodes
    this.drawingContext = drawingContext;

    if (drawingContext) {
      drawingContext.strokeStyle = "darkgreen";
      drawingContext.beginPath();
      drawingContext.rect(
        rectangularBound.x,
        rectangularBound.y,
        rectangularBound.width,
        rectangularBound.height
      );
      drawingContext.stroke();
    }
  }

  clear() {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes.length) {
        this.nodes[i].clear();
      }
    }
    this.nodes = [];
    this.objects = [];
  }

  split() {
    const halfWidth = this.rectangularBound.width / 2;
    const halfHeight = this.rectangularBound.height / 2;
    const x = this.rectangularBound.x;
    const y = this.rectangularBound.y;

    this.nodes[0] = new Quadtree(
      this.currentNodeLevel + 1,
      new RectangularBound(x + halfWidth, y, halfWidth, halfHeight),
      this.drawingContext
    );
    this.nodes[1] = new Quadtree(
      this.currentNodeLevel + 1,
      new RectangularBound(x, y, halfWidth, halfHeight),
      this.drawingContext
    );
    this.nodes[2] = new Quadtree(
      this.currentNodeLevel + 1,
      new RectangularBound(x, y + halfHeight, halfWidth, halfHeight),
      this.drawingContext
    );
    this.nodes[3] = new Quadtree(
      this.currentNodeLevel + 1,
      new RectangularBound(
        x + halfWidth,
        y + halfHeight,
        halfWidth,
        halfHeight
      ),
      this.drawingContext
    );
  }

  insert(newObject) {
    if (this.nodes.length > 0) {
      const index = this._getIndex(newObject);
      if (index != -1) {
        this.nodes[index].insert(newObject);

        return;
      }
    }

    this.objects.push(newObject);
    const canSplit =
      this.objects.length > this.MAX_OBJECTS &&
      this.currentNodeLevel < this.MAX_LEVELS;
    if (canSplit) {
      this.nodes.length == 0 && this.split();

      let length = this.objects.length;
      for (let i = 0; i < length; i++) {
        const index = this._getIndex(this.objects[0]);
        if (index != -1) {
          const removedObject = this.objects.shift();
          this.nodes[index].insert(removedObject);
        }
      }
    }
  }

  retrieve(objectToCheck) {
    const index = this._getIndex(objectToCheck);
    if (index != -1 && this.nodes.length > 0) {
      return this.nodes[index].retrieve(objectToCheck);
    }

    return this.objects;
  }

  _getIndex(newObject) {
    const verticalMidPoint =
      this.rectangularBound.x + this.rectangularBound.width / 2;
    const horizontalMidPoint =
      this.rectangularBound.y + this.rectangularBound.height / 2;

    const objY = newObject.y;
    const objX = newObject.x;
    const objRadius = newObject.radius;

    const canfitTop = objY + objRadius < horizontalMidPoint;
    const canfitBottom = !canfitTop;
    const canfitLeft = objX + objRadius < verticalMidPoint;
    const canfitRight = !canfitLeft;

    if (canfitTop && canfitRight) {
      return 0;
    } else if (canfitTop && canfitLeft) {
      return 1;
    } else if (canfitBottom && canfitLeft) {
      return 2;
    } else if (canfitBottom && canfitRight) {
      return 3;
    } else {
      return -1;
    }
  }
}

class RectangularBound {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
