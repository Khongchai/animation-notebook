# WebGL Model View Projection

TODO

# Texel

A "texture pixel" - a single pixel within a texture, just like how a pixel is to an image. Instead of being mapped directly to screen pixels, a texel's data is mapped to a location in the coordiante space of the 3D object being modeled.

# The w dimension

https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection

# History for the Matrix Multiplication

Matrix multiplication is defined as it is so that it reflects the composition of linear maps.

Matrix multiplication is a symbolic way of substituting one linear change of variables into another one.

If x′=ax+by and y′=cx+dy, and x′′=a′x′+b′y′ and y′′=c′x′+d′y′ then we can plug the first pair of formulas into the second to express x′′ and y′′ in terms of x and y:

x′′=a′x′+b′y′=a′(ax+by)+b′(cx+dy)=(a′a+b′c)x+(a′b+b′d)y
and
y′′=c′x′+d′y′=c′(ax+by)+d′(cx+dy)=(c′a+d′c)x+(c′b+d′d)y.

# Attributes and Buffer

Buffers are arrays of binary data you upload to the GPU. Usually buffers contain things like positions, normals, texture coordinates, vertex colors, etc although you're free to put anything you want in them.

https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

https://stackoverflow.com/questions/27148273/what-is-the-logic-of-binding-buffers-in-webgl

# Remember to read theory after having learned the practice.
