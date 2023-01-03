// TODO :
// Simplify API find a way to simplify things further
// Managed mode, where the lib manages all canvas transformations.
// Check if the listeners are actually being removed.
class PetiteTransform {
  /**
   * @type {() => {x: number, y: number, z: number}} `x` is the x offset, `y` the y offset, and `z` the zoom scale.
   */
  #getTransformReference;
  // TODO
  #easeFactor = 1;
  #cumulatedTransform = {
    dx: 0,
    dy: 0,
    dz: 1,
    total: {
      pos: { x: 0, y: 0, z: 1 },
      update: function ({ dx, dy, dz }) {
        // Apply translation first.
        // This is the dot product of the existing matrix and the incoming matrix.
        this.pos.x = this.pos.x + dx * this.pos.z;
        this.pos.y = this.pos.y + dy * this.pos.z;
        this.pos.z *= dz;
      },
    },
    /**
     * Self-explanatory.
     *
     * @type {(x?: number, y?: number, z?: number) => void}
     */
    setTransform: function (x = this.dx, y = this.dy, z = this.dz) {
      this.dx = x;
      this.dy = y;
      this.dz = z;
    },
    /**
     * Like `setTransform`, but instead of replacing the values, increment them instead.
     *
     * This is to cache all values in-between frames when called from an animation loop.
     *
     * @type {(x?: number, y?: number, z?: number) => void}
     */
    setTransformIncrement: function (x = 0, y = 0, z = 0) {
      this.dx += x;
      this.dy += y;
      this.dz += z;
    },
    /**
     * Spoonfeed the client only once and then close until more values are set.
     * This is to prevent any translation method in an animation frame from applying the
     * same transform twice. If you need the same transform in multiple places, store it in a variable somewhere.
     *
     * @type {() => {dx: number, dy: number, dz: number}}
     */
    getTransform: function () {
      const returnVal = { dx: this.dx, dy: this.dy, dz: this.dz };

      this.dx = 0;
      this.dy = 0;
      this.dz = 1;

      this.total.update(returnVal);

      return returnVal;
    },
  };
  #isMouseDown = false;
  #panOffset = {
    prev: {
      x: 0,
      y: 0,
    },
    cur: {
      x: 0,
      y: 0,
    },
  };
  /**
   * @type {{type: string, callback: () => any}[]}
   */
  #listenersRefs = [];

  /**
   *
   * @param {{transformReference?: () => {x: number, y: number, z: number}, devicePixelRatio?: number, easeFactor?: 1, manageZoom?: boolean, managePan?: boolean}}
   * `transformReference` a callback that returns the current transform of the canvas.
   * This sets up the two different modes, the relative mode, which uses the reference to the current transform outside
   * the control of this canvas, and the absolute mode, which does not care about anything else and will treat itself as the source of the transformational truth.
   * `devicePixelRatio` The device pixel ratio that you set your canvas to. It is
   * vital that this matches what you have set for your canvas.
   * `easeFactor` the t in (a + (b - a) * t) of the linear interpolation equation.
   * where t is <= 1 and >= 0. If t is less than 1, repeated call to the `currenTransform` method will yield
   * a different value.
   * `manageZoom` whether or not to have this set up the zoom listener.
   * `managePan` whether or not to have this set up the pan listener.
   */
  constructor({
    transformReference,
    devicePixelRatio = 1,
    easeFactor = 1,
    managePan = true,
    manageZoom = true,
  }) {
    this.#easeFactor = easeFactor;
    if (transformReference) {
      this.#getTransformReference = transformReference;
    } else {
      const total = this.#cumulatedTransform.total;
      this.#getTransformReference = () => ({
        x: total.pos.x,
        y: total.pos.y,
        z: total.pos.z,
      });
    }

    this.#cumulatedTransform.setTransform(0, 0, 1);

    if (managePan) {
      this.#addEventListener("mousedown", (e) => {
        this.#onmousedown({
          x: e.x * devicePixelRatio,
          y: e.y * devicePixelRatio,
        });
      });

      this.#addEventListener("mousemove", (e) => {
        this.onpan({
          x: e.x * devicePixelRatio,
          y: e.y * devicePixelRatio,
        });
      });

      this.#addEventListener("mouseup", (e) => {
        this.#onmouseup({
          x: e.x * devicePixelRatio,
          y: e.y * devicePixelRatio,
        });
      });
    }

    if (manageZoom) {
      this.#addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();

          this.#onwheel({
            x: e.x * devicePixelRatio,
            y: e.y * devicePixelRatio,
            deltaY: e.deltaY,
          });
        },
        { passive: false }
      );
    }
  }

  /**
   * Returns the cumulated transform throughout the lifecyle of this canvas.
   *
   * Useful for when you want to sync multiple canvases to one transform while switching between them.
   *
   * @returns {{x: number, y: number, z: number}}
   */
  get cumulatedTransform() {
    return this.#cumulatedTransform.total.pos;
  }

  /**
   * Call this when you would like to remove all event listeners.
   */
  dispose() {
    this.#listenersRefs.forEach((obj) =>
      document.removeEventListener(obj.type, obj.callback, obj.options)
    );
  }

  /**
   * Returns a change in the transform.
   *
   * Note that if you use a method that resets the transformation matrix
   * like `ctx.setTransform` instead of something like `ctx.transform` or
   * `ctx.translate`, the transformations will not work correctly.
   *
   * @type {() => {dx: number, dy: number, dz: number}}
   */
  get currentTransform() {
    return this.#cumulatedTransform.getTransform();
  }

  #addEventListener(type, callback, options) {
    document.addEventListener(type, callback, options);
    this.#listenersRefs.push({ type, callback, options });
  }

  /**
   * @param {{x: number, y: number}} e
   */
  #onmousedown(e) {
    this.#isMouseDown = true;
    this.#panOffset.prev.x = e.x - this.#panOffset.cur.x;
    this.#panOffset.prev.y = e.y - this.#panOffset.cur.y;
  }

  #onmouseup() {
    this.#isMouseDown = false;
  }

  /**
   * @param {{x: number, y: number}} e
   */
  onpan(e) {
    if (this.#isMouseDown) {
      const dx = e.x - this.#panOffset.prev.x;
      const dy = e.y - this.#panOffset.prev.y;

      const globalDx = dx / this.#getTransformReference().z;
      const globalDy = dy / this.#getTransformReference().z;
      this.#panOffset.prev.x = e.x;
      this.#panOffset.prev.y = e.y;

      this.#cumulatedTransform.setTransformIncrement(globalDx, globalDy);
    }
  }

  /**
   * @param {{x: number, y: number, deltaY: number}} e
   */
  #onwheel(e) {
    const change = -e.deltaY * 0.0005;
    const { x, y, z } = this.#getTransformReference();

    // Grab the world space position of the cursor so that we can calculate
    // later how much to offset the canvas by after zooming.
    const wx = (e.x - x) / z;
    const wy = (e.y - y) / z;

    this.#cumulatedTransform.setTransform(
      -wx * change,
      -wy * change,
      1 + change
    );
  }
}
