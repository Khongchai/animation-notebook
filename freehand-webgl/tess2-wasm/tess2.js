// Ergonomic wrapper around the Emscripten-built libtess2 module.
// Usage:
//   import { createTess2 } from './tess2.js';
//   const Tess2 = await createTess2();
//   const res = Tess2.tesselate({ contours: [...], windingRule: Tess2.WINDING_NONZERO,
//                                 elementType: Tess2.POLYGONS, polySize: 3, vertexSize: 2 });

import Tess2Module from './tess2_core.mjs';

export async function createTess2() {
  const Module = await Tess2Module();

  const WINDING_ODD         = 0;
  const WINDING_NONZERO     = 1;
  const WINDING_POSITIVE    = 2;
  const WINDING_NEGATIVE    = 3;
  const WINDING_ABS_GEQ_TWO = 4;

  const POLYGONS           = 0;
  const CONNECTED_POLYGONS = 1;
  const BOUNDARY_CONTOURS  = 2;

  const TESS_UNDEF = 0xFFFFFFFF | 0; // ~0 as int32

  const {
    _tessNewTess, _tessDeleteTess, _tessAddContour, _tessTesselate,
    _tessGetVertexCount, _tessGetVertices, _tessGetVertexIndices,
    _tessGetElementCount, _tessGetElements, _tessGetStatus,
    _malloc, _free,
  } = Module;

  function tesselate({
    contours,
    windingRule = WINDING_ODD,
    elementType = POLYGONS,
    polySize = 3,
    vertexSize = 2,
    normal = null,
  }) {
    const tess = _tessNewTess(0);
    if (!tess) throw new Error('tessNewTess failed');

    const allocations = [];
    try {
      for (const contour of contours) {
        // contour is a flat array [x0,y0,x1,y1,...] (length = nverts * vertexSize)
        const nverts = contour.length / vertexSize;
        const bytes = contour.length * 4;
        const ptr = _malloc(bytes);
        allocations.push(ptr);
        // Write floats into the WASM heap.
        Module.HEAPF32.set(contour, ptr >> 2);
        _tessAddContour(tess, vertexSize, ptr, vertexSize * 4, nverts);
      }

      let normalPtr = 0;
      if (normal) {
        normalPtr = _malloc(12);
        allocations.push(normalPtr);
        Module.HEAPF32.set(normal, normalPtr >> 2);
      }

      const ok = _tessTesselate(tess, windingRule, elementType, polySize, vertexSize, normalPtr);
      if (!ok) {
        const status = _tessGetStatus(tess);
        throw new Error(`tessTesselate failed, status=${status}`);
      }

      const nverts = _tessGetVertexCount(tess);
      const nelems = _tessGetElementCount(tess);
      const vertsPtr = _tessGetVertices(tess);
      const elemsPtr = _tessGetElements(tess);
      const vindsPtr = _tessGetVertexIndices(tess);

      // Copy out of WASM heap — the heap can be reallocated, and we're
      // about to free the tess object anyway.
      const vertices = new Float32Array(
        Module.HEAPF32.buffer, vertsPtr, nverts * vertexSize
      ).slice();

      const elementStride = elementType === CONNECTED_POLYGONS ? polySize * 2
                          : elementType === BOUNDARY_CONTOURS ? 2
                          : polySize;
      const elements = new Int32Array(
        Module.HEAP32.buffer, elemsPtr, nelems * elementStride
      ).slice();

      const vertexIndices = new Int32Array(
        Module.HEAP32.buffer, vindsPtr, nverts
      ).slice();

      return { vertices, vertexIndices, vertexCount: nverts,
               elements, elementCount: nelems };
    } finally {
      for (const p of allocations) _free(p);
      _tessDeleteTess(tess);
    }
  }

  return {
    tesselate,
    WINDING_ODD, WINDING_NONZERO, WINDING_POSITIVE, WINDING_NEGATIVE, WINDING_ABS_GEQ_TWO,
    POLYGONS, CONNECTED_POLYGONS, BOUNDARY_CONTOURS,
    TESS_UNDEF,
  };
}
