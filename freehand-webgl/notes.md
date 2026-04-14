# Freehand → WebGL: concepts & terms

A map of everything we touched, in rough order of the journey.

---

## 1. WebGL basics

WebGL is a low-level GPU API in the browser. Unlike Canvas2D (`ctx.fillPath()`),
it has **no built-in drawing primitives** — you upload vertex data and write
GPU programs (shaders) to draw anything.

### The minimum pipeline

Every draw call needs:

1. A **vertex buffer** — a `Float32Array` of positions uploaded to the GPU.
2. A **vertex shader** — a tiny GLSL program that runs once per vertex,
   outputs `gl_Position` in clip space.
3. A **fragment shader** — runs once per pixel inside each triangle, outputs
   `gl_FragColor`.
4. A **draw call** — `gl.drawArrays(gl.TRIANGLES, 0, count)`.

### Clip space

WebGL's coordinate system is `-1..1` on both axes, with `y` pointing up.
To draw in pixel coordinates, the vertex shader converts:

```glsl
vec2 clip = (pixelPos / resolution) * 2.0 - 1.0;
gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0); // flip y
```

### Attributes vs uniforms

- **Attribute**: per-vertex data (e.g. `a_position`).
- **Uniform**: constant for the whole draw call (e.g. `u_color`, `u_resolution`).

### Why so much ceremony?

WebGL is verbose because everything — shader compilation, program linking,
buffer binding, attribute pointers — must be set up manually. It's the price
for direct GPU access. For non-GPU-specific drawing, Canvas2D is much simpler.

---

## 2. perfect-freehand

A library that turns mouse/pen input points into a **pretty stroke outline**,
handling pressure, smoothing, and variable thickness.

- Input: array of `[x, y, pressure]` points.
- Output: a closed polygon (array of `[x, y]` points) tracing the stroke boundary.
- `getStroke(points, options)` → outline points.
- `getSvgPathFromStroke(outline)` → an SVG path string (`M … Q … T … Z`)
  that approximates the outline with smooth quadratic curves.

### SVG path commands we see

- `M x,y` — move to.
- `Q cx,cy x,y` — quadratic Bézier (control, endpoint).
- `T x,y` — smooth quadratic (control auto-reflected from previous).
- `Z` — close path.

---

## 3. The triangulation problem

GPUs only draw **triangles**. To render a filled polygon, we must break it
into triangles first = **triangulation** / **tessellation**.

There are several algorithms, each with different strengths and failure modes.

### Convex hull

The smallest convex polygon containing all points — imagine a rubber band
snapped around a set of nails.

### Convex vs concave

- **Convex**: no dents, every interior angle ≤ 180°.
- **Concave**: has at least one dent.

### Why this matters for stroke rendering

Stroke outlines are almost always **concave** (think of a curved line or a `C`).

---

## 4. Delaunator

- Input: a point cloud.
- Output: Delaunay triangulation **of the convex hull** of those points.
- Fast, but the wrong tool for stroke outlines: it fills in concavities.
  Drawing a `C` gives you a filled blob, because the hull is a blob.

Good for: point clouds, Voronoi diagrams, mesh generation from scattered points.
Bad for: outlined shapes.

---

## 5. Ear clipping & earcut

An algorithm for triangulating an **ordered polygon** (not a point cloud).
Finds an "ear" — 3 consecutive vertices forming a triangle that lies inside
the polygon — snips it off, repeats.

- Respects concavities.
- `earcut` (Mapbox) is the standard JS implementation.
- Input: a flat array of boundary coordinates `[x0,y0, x1,y1, ...]`.
- Output: triangle indices.

**Limitation**: assumes a **simple polygon** (no self-crossings). Given a
self-intersecting polygon, output is undefined — stray triangles, flicker.

---

## 6. Self-intersections

At sharp corners, perfect-freehand's left and right edge offsets can cross,
turning the outline into a figure-8 instead of a simple loop:

```
   ←─ outer edge
        ╲
         ╲    ╱─ outer edge
          ╲  ╱
           ╳     ← self-intersection
```

This breaks earcut. Symptoms:
- Stray triangles around sharp corners.
- Triangles flicker while drawing (the crossing point moves each frame,
  and the tessellation flips with it).

Two ways to fix:

1. Pre-process: run the polygon through a boolean-union step (e.g.
   `polygon-clipping`) to resolve intersections into simple polygons.
2. Use a **winding-rule tessellator** that handles self-intersections natively.

---

## 7. Winding rules

A way to decide "which regions are inside the polygon" when the boundary
crosses itself.

- Draw a ray from a test point to infinity.
- Count how many times the polygon boundary crosses the ray, with direction.
- **NONZERO rule**: point is inside if the signed count is nonzero.
- **EVEN-ODD rule**: point is inside if the count is odd.
- **POSITIVE / NEGATIVE**: variants using signed counts.

This lets a tessellator turn a self-intersecting polygon into a clean
triangulation of the union (NONZERO) or the XOR (EVEN-ODD) automatically.

---

## 8. libtess.js / tess2.js

JS ports of old OpenGL polygon tessellators. Support winding rules.

### libtess.js

- Port of GLU's 1990s tessellator.
- Callback-based API (C-style): you register callbacks for `VERTEX_DATA`,
  `BEGIN`, `ERROR`, `COMBINE`, `EDGE_FLAG` — results stream through them.
- The `COMBINE` callback is called when the tessellator invents a new vertex
  at a self-intersection; you return the data to attach to it.
- Registering an empty `EDGE_FLAG` callback forces `GL_TRIANGLES` output
  (no strips/fans). A side-effect trick from the GLU API.

### tess2.js

- Newer port of Mikko Mononen's `libtess2` (C rewrite of GLU tess).
- Cleaner API: one `Tess2.tesselate({...})` call, returns `{ vertices, elements }`.
- ~2–3× faster than libtess.js.
- Same winding-rule model — drop-in conceptually.

### The whole pipeline

```
mouse points
  → perfect-freehand.getStroke()       // outline with sharp-corner self-intersections
  → getSvgPathFromStroke()             // smooth SVG path string
  → parseSvgPathToPoints()             // back to [x,y] array
  → Tess2.tesselate({ NONZERO })       // resolve intersections, get triangles
  → gl.drawArrays(TRIANGLES)           // paint with trivial shaders
```

---

## 9. Other tools we mentioned but didn't use

- **Triangle** (Shewchuk, C) — constrained Delaunay, very fast, has a WASM
  port (`triangle-wasm`). Requires a simple polygon.
- **cdt2d** — constrained Delaunay in JS.
- **poly2tri** — C++/JS, simple polygons only.
- **polygon-clipping** — boolean ops on polygons. Useful as a preprocessor
  before a simple-polygon triangulator.

---

## 10. Bare imports, npm, Vite

- **Bare import**: `import foo from "foo"`. The browser can't resolve these
  by itself — it needs a full path or a URL.
- **Import map** (`<script type="importmap">`): tells the browser where
  bare specifiers live (e.g. via esm.sh). Works without a build tool.
- **Vite**: dev server that rewrites bare imports to `/node_modules/...`
  paths on the fly and serves them over HTTP. That's why `npm run dev`
  is required for our setup.

---

## 11. Performance note (for later)

Re-tessellating on every `pointermove` is wasteful. When you want smoother
drawing of complex strokes:

- **Cache completed strokes.** Tessellate once on `pointerup`, store the
  triangle buffer, reuse on redraws. Only re-tess the currently-drawing
  stroke.
- Only after caching would swapping engines (tess2 → WASM) matter.
