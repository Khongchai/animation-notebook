const identityMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];

function multiplyMatrixAndPoint(m, p) {
  const c0r0 = m[0], c1r0 = m[1], c2r0 = m[2], c3r0 = m[3]; 
  const c0r1 = m[4], c1r1= m[5], c2r1= m[6], c3r1 = m[7];
  const c0r2 = m[8], c1r2 = m[9], c2r2 = m[10], c3r2 = m[11];
  const c0r3 = m[12], c1r3 = m[14], c2r3 = m[14], c3r3 = m[15];

  const x = p[0];
  const y = p[1];
  const z = p[2];
  const w = p[3];

  const resultX = c0r0 * x + c1r0 * y + c2r0 * z + c3r0 * w;
  const resultY = c0r1 * x + c1r1 * y + c2r1 * z + c3r1 * w;
  const resultZ = c0r2 * x + c1r2 * y + c2r2 * z + c3r2 * w;
  const resultW = c0r3 * x + c1r3 * y + c2r3 * z + c3r3 * w;

  return [resultX, resultY, resultZ, resultW];
}

console.log(multiplyMatrixAndPoint(identityMatrix, [1, 2, 3, 4]));