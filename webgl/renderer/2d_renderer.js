// Home-grown 2d webgl renderer inspired by Google's PROXX renderer.

class Renderer {
  constructor({
    
  }) {}

  /**
   * @param {(delta: number) => void} callback
   */
  _draw(callback) {
    let then = 0;

    function _draw(now) {
      now *= 0.001;
      const delta = now - then;
      then = now;

      callback(delta);

      requestAnimationFrame(_draw);
    }

    requestAnimationFrame(_draw);
  }
}

class ShaderMeta {
  #meshes = [];
  #uniforms = [];
  #gl;
  #canvas;
  #counts;

  draw() {
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
    this.#gl.drawElements(
      this.#gl.TRIANGLES,
      this._opts.indices.length,
      this.#gl.UNSIGNED_SHORT,
      0
    );
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this._opts.scaling;
    this.canvas.height = rect.height * this._opts.scaling;
    this.setUniform2f("iResolution", [this.canvas.width, this.canvas.height]);
    this._gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}
