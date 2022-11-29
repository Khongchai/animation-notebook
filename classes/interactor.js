/**
 * Just a simple and quick interactor that helps interact with a pointer.
 *
 * Usage:
 *
 * const interactor = Interactor.pointer({
 *  objects: [p0, p1, p2, p3, o1, o2, o3], // all objects should extend something that has an x an a y
 *  pointerMoveCallback: ({object, currentPointerPos}) => doSomething(object, currentPointerPos),
 *  pointerDownCallback: ({object, currentPointerPos}) => ...
 *  pointerUpCallback: ({object, currentPointerPos}) => ...
 * });
 */
class Interactor {
  objects = [];
  pointer = null;
  isMouseDown = false;

  _handleIntersection(whenIntersectedCallback) {
    const intersectedObject = this._checkIntersection();
    if (intersectedObject) {
      whenIntersectedCallback(intersectedObject);
    }
  }

  // Simple circle check
  _checkIntersection() {
    for (let i = 0; i < this.objects.length; i++) {
      const dist = Math.sqrt(
        Math.pow(this.pointer.x - this.objects[i].x, 2) +
          Math.pow(this.pointer.y - this.objects[i].y, 2)
      );
      const boundary =
        this.objects[i].radius || this.objects[i].side / 2 || 100;
      const isIntersecting = dist < boundary;
      if (isIntersecting) return this.objects[i];
    }

    return null;
  }

  static pointer({
    objects,
    pointerMoveCallback,
    pointerDownCallback,
    pointerUpCallback,
  }) {
    // Just point to those objects
    const interactor = new Interactor();
    interactor.objects = objects;

    if (pointerMoveCallback) {
      document.addEventListener("mousemove", function (e) {
        interactor.pointer = {
          x: e.x,
          y: e.y,
        };

        interactor._handleIntersection((object) =>
          pointerMoveCallback({
            object,
            currentPointPos: interactor.pointer,
          })
        );
      });
    }

    if (pointerDownCallback) {
      document.addEventListener("mousedown", function (e) {
        interactor.pointer = {
          x: e.x,
          y: e.y,
        };

        interactor._handleIntersection((object) =>
          pointerDownCallback({
            object,
            currentPointPos: interactor.pointer,
          })
        );
      });
    }

    if (pointerUpCallback) {
      document.addEventListener("mouseup", (e) => {
        interactor.pointer = {
          x: e.x,
          y: e.y,
        };

        interactor._handleIntersection((object) =>
          pointerUpCallback({
            object,
            currentPointPos: interactor.pointer,
          })
        );
      });
    }
  }
}
