//TODO => build again for your proj but with wasm
const COLORS = ["crimson", "purple", "navy", "darkgreen", "burlywood"];
class Quadtree {
  constructor(currentNodeLevel, rectangularBound, drawingContext = null) {
    this.MAX_OBJECTS = 1;
    this.MAX_LEVELS = 5;

    this.currentNodeLevel = currentNodeLevel;
    this.rectangularBound = rectangularBound;
    this.objects = [];
    this.nodes = []; // array of 4 sub-nodes
    this.drawingContext = drawingContext;
    this.mass = 0;
    this.centerOfMass = {
      x: 0,
      y: 0,
    };
    //random color from rgb

    this._drawRectangularBound();
  }

  clear() {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes.length) {
        this.nodes[i].clear();
      }
    }
    this.nodes = [];
    this.objects = [];
    this.mass = 0;
    this.centerOfMass = {
      x: 0,
      y: 0,
    };
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
    const isInternalNode = this.nodes.length > 0;
    if (isInternalNode) {
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

  retrieveCenterOfMassesToGravitateTo(objectToCheck, theta) {
    const objToReturn = [];
    const pushToObjIfMassNotZero = (obj) => obj.mass && objToReturn.push(obj);

    if (this.nodes.length == 0) {
      const distance = objectToCheck.distanceTo(this.centerOfMass);

      if (this.rectangularBound.width / distance < theta) {
        this._drawLine(
          objectToCheck,
          this.centerOfMass,
          objectToCheck,
          this.mass
        );

        pushToObjIfMassNotZero({
          mass: this.mass,
          x: this.centerOfMass.x,
          y: this.centerOfMass.y,
        });

        return objToReturn;
      } else {
        for (let i = 0; i < this.objects.length; i++) {
          this._drawLine(
            objectToCheck,
            this.objects[i],
            objectToCheck.mass,
            this.objects[i].mass
          ); // debug
          pushToObjIfMassNotZero(this.objects[i]);
        }

        return objToReturn;
      }
    }

    for (let i = 0, len = this.nodes.length; i < len; i++) {
      const distance = objectToCheck.distanceTo(this.nodes[i].centerOfMass);

      if (this.nodes[i].rectangularBound.width / distance < theta) {
        this._drawLine(
          objectToCheck,
          this.nodes[i].centerOfMass,
          objectToCheck.mass,
          this.nodes[i].mass
        ); // debug
        pushToObjIfMassNotZero({
          x: this.nodes[i].centerOfMass.x,
          y: this.nodes[i].centerOfMass.y,
          mass: this.nodes[i].mass,
        });
      }
      //calculate separate bodies.
      else {
        const massesToGravitateTo = this.nodes[
          i
        ].retrieveCenterOfMassesToGravitateTo(objectToCheck, theta);

        for (let i = 0, length = massesToGravitateTo.length; i < length; i++) {
          // this._drawLine(objectToCheck, massesToGravitateTo[i]); // debug
          pushToObjIfMassNotZero(massesToGravitateTo[i]);
        }
      }
    }

    return objToReturn;
  }

  retrieveMassDataFromChildrenNodes() {
    if (this.nodes.length == 0) {
      this.mass = 0;
      this.centerOfMass = { x: 0, y: 0 };
      for (let i = 0; i < this.objects.length; i++) {
        this.updateLeafNodesCenterOfMass(this.objects[i]);
      }
      this._drawMassData();
      return;
    }

    let massData = {
      mass: 0,
      x: 0,
      y: 0,
    };
    for (let i = 0, length = this.nodes.length; i < length; i++) {
      this.nodes[i].retrieveMassDataFromChildrenNodes();
      massData.mass += this.nodes[i].mass;
      massData.x += this.nodes[i].centerOfMass.x * this.nodes[i].mass;
      massData.y += this.nodes[i].centerOfMass.y * this.nodes[i].mass;
    }
    massData.x /= massData.mass;
    massData.y /= massData.mass;
    this.centerOfMass = { x: massData.x, y: massData.y };
    this.mass = massData.mass;
    this._drawMassData();
  }

  updateLeafNodesCenterOfMass(p) {
    const newMassData = {
      x: 0,
      y: 0,
      mass: 0,
    };
    newMassData.mass = this.mass + p.mass;

    newMassData.x =
      (this.centerOfMass.x * this.mass + p.x * p.mass) / newMassData.mass;
    newMassData.y =
      (this.centerOfMass.y * this.mass + p.y * p.mass) / newMassData.mass;

    this.centerOfMass = { x: newMassData.x, y: newMassData.y };
    this.mass = newMassData.mass;
  }

  _drawMassData() {
    if (this.drawingContext && this.mass) {
      this.drawingContext.strokeStyle = COLORS[this.currentNodeLevel];
      this.drawingContext.beginPath();
      this.drawingContext.arc(
        this.centerOfMass.x,
        this.centerOfMass.y,
        this.mass * 2 + 5,
        0,
        2 * Math.PI
      );
      this.drawingContext.stroke();
    }
  }

  _drawLine(p1, p2, p1Mass, p2Mass) {
    // if (this.drawingContext && p1Mass && p2Mass) {
    //   this.drawingContext.strokeStyle = "orange";
    //   this.drawingContext.beginPath();
    //   this.drawingContext.moveTo(p1.x, p1.y);
    //   this.drawingContext.lineTo(p2.x, p2.y);
    //   this.drawingContext.stroke();
    // }
  }

  _drawRectangularBound() {
    if (this.drawingContext) {
      this.drawingContext.strokeStyle = COLORS[this.currentNodeLevel];
      this.drawingContext.beginPath();
      this.drawingContext.rect(
        this.rectangularBound.x,
        this.rectangularBound.y,
        this.rectangularBound.width,
        this.rectangularBound.height
      );
      this.drawingContext.stroke();
    }
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
