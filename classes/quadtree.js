//from https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
class Quadtree {
  constructor(currentNodeLevel, rectangularBounds) {
    this.MAX_OBJECTS = 10;
    this.MAX_LEVELS = 5;

    this.currentNodeLevel = currentNodeLevel;
    this.rectangularBounds = rectangularBounds;
    this.objects = [];
    this.nodes = []; // array of 4 sub-nodes
  }

  clear() {
    this.nodes = [];
    this.objects = [];
  }

  // split the node into 4 sub-nodes
  split() {
    const subWidth = this.rectangularBounds.width / 2;
    const subHeight = this.rectangularBounds.height / 2;
    const x = this.rectangularBounds.x;
    const y = this.rectangularBounds.y;

    this.nodes[0] = new Quadtree(
      level + 1,
      new Rectangle(x + subWidth, y, subWidth, subHeight)
    );
    this.nodes[1] = new Quadtree(
      level + 1,
      new Rectangle(x, y, subWidth, subHeight)
    );
    this.nodes[2] = new Quadtree(
      level + 1,
      new Rectangle(x, y + subHeight, subWidth, subHeight)
    );
    this.nodes[3] = new Quadtree(
      level + 1,
      new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight)
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
      const index = _getIndex(newObject);
      if (index != -1) {
        this.nodes[index].insert(newObject);

        return;
      }
    }

    //If this point is reached, then the node is empty and we can insert the object into this (the parent) node;
    this.objects.add(newObject);

    const canSplit =
      this.objects.length > this.MAX_OBJECTS &&
      this.currentNodeLevel < this.MAX_LEVELS;
    if (canSplit) {
      this.nodes.length == 0 && this.split();

      const objectsLength = this.objects.length;
      for (let i = 0; i < objectsLength; i++) {
        const index = this._getIndex(this.objects[i]);
        index != -1 && this.nodes[index].insert(this.objects.splice(i, 1)[0]);
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
    verticalMidpoint =
      this.rectangularBounds.x + this.rectangularBounds.width / 2;
    horizontalMidPoint =
      this.rectangularBounds.y + this.rectangularBounds.height / 2;

    const objY = newObject.y;
    const objX = newObject.x;

    const canfitTop = objY < horizontalMidPoint;
    const canfitBottom = objY > horizontalMidPoint;
    const canfitLeft = objX < verticalMidpoint;
    const canfitRight = objX > verticalMidpoint;

    if (canfitTop && canfitLeft) {
      return 1;
    } else if (canfitTop && canfitRight) {
      return 2;
    } else if (canfitBottom && canfitLeft) {
      return 3;
    } else if (canfitBottom && canfitRight) {
      return 4;
    } else {
      return -1;
    }
  }
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
