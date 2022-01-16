//from https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

//Max objects still not very accurate....for some reason.
//TODO => modify this for circles first and see if that fixes the problem.
//To ensure that it really is a problem with this, first make one static circle and one moveable circle and test all the edges.

//POssible bug, you are not checking if the object extends beyond the bounding square, when the object does, it should be included
// as a child of both bounding area.

//TODO => to use with gravity, you also need to take into account other objects's center of mass.
class Quadtree {
  //Better one would be to just pass a callback that draws something based on the provided
  //RectangularBound.
  constructor(currentNodeLevel, rectangularBound, drawingContext) {
    this.MAX_OBJECTS = 4;
    this.MAX_LEVELS = 6;

    this.currentNodeLevel = currentNodeLevel;
    this.rectangularBound = rectangularBound;
    this.objects = [];
    this.nodes = []; // array of 4 sub-nodes
    this.drawingContext = drawingContext;

    drawingContext.strokeStyle = "green";
    drawingContext.beginPath();
    drawingContext.rect(
      rectangularBound.x,
      rectangularBound.y,
      rectangularBound.width,
      rectangularBound.height
    );
    drawingContext.stroke();
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

  // split the node into 4 sub-nodes
  split() {
    const halfWidth = this.rectangularBound.width / 2;
    const halfHeight = this.rectangularBound.height / 2;
    const x = this.rectangularBound.x;
    const y = this.rectangularBound.y;

    //Position of quadrants = standard cartesian coordinates
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

  /*
   * Insert the object into the quadtree. If the node
   * exceeds the capacity, it will split and add all
   * objects to their corresponding nodes.
   */
  insert(newObject) {
    //If the node is not empty, then get the index and insert the object into the node
    if (this.nodes.length > 0) {
      const index = this._getIndex(newObject);
      if (index != -1) {
        this.nodes[index].insert(newObject);

        return;
      }
    }

    //If this point is reached, then the node is empty and we can insert the object into this (the parent) node;
    this.objects.push(newObject);

    const canSplit =
      this.objects.length > this.MAX_OBJECTS &&
      this.currentNodeLevel < this.MAX_LEVELS;
    if (canSplit) {
      this.nodes.length == 0 && this.split();

      for (let i = 0; i < this.objects.length; i++) {
        const index = this._getIndex(this.objects[i]);
        if (index != -1) {
          this.nodes[index].insert(this.objects.splice(i, 1)[0]);
        }
      }
    }
  }

  /*
   * Return all objects that could collide with the given object
   */
  retrieve(objectToCheck) {
    const index = this._getIndex(objectToCheck);
    if (index != -1 && this.nodes.length > 0) {
      return this.nodes[index].retrieve(objectToCheck);
    }

    return this.objects;
  }

  //TODO => Use enum flags when refactoring to TypeScript.
  /*
   * Util func
   * Get the index of the node that the object belongs to.
   * Return -1 if cannot be placed in any node and put in the root node(parent node) instead.
   */
  _getIndex(newObject) {
    const verticalMidpoint =
      this.rectangularBound.x + this.rectangularBound.width / 2;
    const horizontalMidPoint =
      this.rectangularBound.y + this.rectangularBound.height / 2;

    const objY = newObject.y;
    const objX = newObject.x;

    const canfitTop = objY < horizontalMidPoint;
    const canfitBottom = objY > horizontalMidPoint;
    const canfitLeft = objX < verticalMidpoint;
    const canfitRight = objX > verticalMidpoint;

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
