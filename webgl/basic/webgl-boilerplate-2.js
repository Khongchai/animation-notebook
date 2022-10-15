// A more readable version.

// Using this: import init from ../where_this_is as shaderInit
// shaderInit(gl, vertex, fragment);
/**
 *
 * @param {!WebGLRenderingContext} gl
 * @param {!string} string
 * @param {!number} type
 * @returns
 */
function _compileShader(gl, type, string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, string);
  gl.compileShader(shader);
  return shader;
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {{vertex: string, fragment: string}} parameters
 */
export default function init(gl, parameters) {
  const { vertex, fragment } = parameters;

  const glVertex = _compileShader(gl, gl.VERTEX_SHADER, vertex);
  const glFragment = _compileShader(gl, gl.FRAGMENT_SHADER, fragment);

  const program = gl.createProgram();

  gl.attachShader(program, glVertex);
  gl.attachShader(program, glFragment);

  gl.linkProgram(program);

  return gl.createProgram(gl, glVertex, glFragment);
}
