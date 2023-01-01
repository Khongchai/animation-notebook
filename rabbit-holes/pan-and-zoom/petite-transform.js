// TODO Move everything here first and then throttle.
class PetiteTransform {
  #getCurrentScale = () => 0;
  #draw = () => {};
  #globalOffset = {
    dx: 0,
    dy: 0,
    dz: 1,
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
  #zoomScale = {
    prev: 1,
    cur: 1,
  };

  /**
   *
   * @param {() => number} currentScale a callback that returns the current scale factor of the canvas.
   * @param {() => any} draw a callback that updates the screen. This method will be throttled to match the frame rate of the browser
   *                    as if it is running in a `requestAnimationFrame` loop.
   */
  constructor(currentScale, draw) {
    this.#draw = draw;
    this.#getCurrentScale = currentScale;
    this.#globalOffset = {
      dx: 0,
      dy: 0,
      dz: 1,
    };

    // TODO setup event listeners and clear when appropriate.
  }

  get currentTransform() {
    return { ...this.#globalOffset };
  }

  /**
   * @param {MouseEvent} e
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
   * @param {MouseEvent} e
   */
  #onmousemove(e) {
    if (this.#isMouseDown) {
      const dx = e.x - this.#panOffset.prev.x;
      const dy = e.y - this.#panOffset.prev.y;

      this.#globalOffset.dx = dx / this.#getCurrentScale();
      this.#globalOffset.dy = dy / this.#getCurrentScale();
      this.#panOffset.prev.x = e.x;
      this.#panOffset.prev.y = e.y;

      this.#throttledDraw();

      //TODO will the throttling affect
      this.#globalOffset.dx = 0;
      this.#globalOffset.dy = 0;
    }
  }

  /**
   *
   * @param {MouseEvent} e
   */
  #onwheel(e) {
    const change = -e.deltaY * 0.0005;
    this.#globalOffset.dz = 1 + change;
    this._calculateZoomOffset(this.#getCurrentScale(), change, e.x, e.y);

    this.#throttledDraw();

    // reset the offset dz
    globalOffset.dz = 1;
  }

  // TODO
  #throttledDraw() {}
}

// Tiny code snippet that can be used to obtain the transform of the canvas.
// TODO
const globalOffset = {
  dx: 0,
  dy: 0,
  dz: 1,
};

const _panOffset = {
  prev: {
    x: 0,
    y: 0,
  },
  // For keeping track of how much translation we have already done to the canvas.
  cur: {
    x: 0,
    y: 0,
  },
  onmousedown: function (e) {
    this.isDown = true;
    this.prev.x = e.x - this.cur.x;
    this.prev.y = e.y - this.cur.y;
  },
  onmouseup: function (e) {
    this.isDown = false;
  },
  onmousemove: function (e) {
    if (this.isDown) {
      const dx = e.x - this.prev.x;
      const dy = e.y - this.prev.y;

      globalOffset.dx = dx / zoomOffset.getCurrentZoomLevel();
      globalOffset.dy = dy / zoomOffset.getCurrentZoomLevel();
      this.prev.x = e.x;
      this.prev.y = e.y;

      draw();

      globalOffset.dx = 0;
      globalOffset.dy = 0;
    }
  },
  isDown: false,
};

const _zoomOffset = {
  prev: 1,
  cur: 1,
  // Assume that .a and .d are the same
  getCurrentZoomLevel: () => ctx.getTransform().a,

  // Instead of referring to the globalOffset, refer to ctx's current transformation.
  // Basically, that's like the source of truth now.
  _calculateZoomOffset: function (currentZoom, zoomChange, sx, sy) {
    // Get the previous transform.
    const { e, f } = ctx.getTransform();
    const wx = (sx - e) / currentZoom;
    const wy = (sy - f) / currentZoom;
    console.log(wx);
    globalOffset.dx = -wx * zoomChange;
    globalOffset.dy = -wy * zoomChange;
  },
  onwheel: function (e) {
    let change = -e.deltaY * 0.0005;
    globalOffset.dz = 1 + change;
    this._calculateZoomOffset(this.getCurrentZoomLevel(), change, e.x, e.y);

    draw();

    // reset the offset dz
    globalOffset.dz = 1;
  },
};
