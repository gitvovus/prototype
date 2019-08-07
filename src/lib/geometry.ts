import * as THREE from 'three';

/**
 * Disposes geometry and materials of given object and all it's children, recursively.
 * For each object, checks, if object has a geometry and/or materials, and calls dispose() for it.
 * @param root root object to dispose.
 */
export function dispose(root: THREE.Object3D) {
  root.traverse(child => {
    const x: any = child;
    if (x.geometry) {
      x.geometry.dispose();
    }
    if (x.material) {
      if (x.material instanceof THREE.Material) {
        x.material.dispose();
      } else {
        for (const material of x.material) {
          material.dispose();
        }
      }
    }
  });
}

export function getColor(object: THREE.Object3D) {
  return (object as any).material.color.getHex();
}

export function setColor(object: THREE.Object3D, value: number) {
  (object as any).material.color.setHex(value);
}

/**
 * Utility, creates coordinate axes, colored with red, green, blue.
 * @returns THREE.Group, containing created axes.
 */
export function axes(): THREE.Group {
  const ox = new THREE.BufferGeometry();
  ox.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0]), 3));
  const oy = new THREE.BufferGeometry();
  oy.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 0, 1, 0]), 3));
  const oz = new THREE.BufferGeometry();
  oz.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 1]), 3));
  const group = new THREE.Group();
  group.add(
    new THREE.LineSegments(ox, new THREE.LineBasicMaterial({ color: 0x800000 })),
    new THREE.LineSegments(oy, new THREE.LineBasicMaterial({ color: 0x008000 })),
    new THREE.LineSegments(oz, new THREE.LineBasicMaterial({ color: 0x000080 })),
  );
  return group;
}

// helper for cube()
function index(segments: number, x: number, y: number, z: number) {
  const side = 2 * segments;
  const capSide = 2 * segments - 1;
  const sideStart = capSide * capSide;
  const perimeter = 8 * segments;
  const topStart = sideStart + perimeter * (side + 1);

  if (y === -segments) {
    return sideStart + (x + segments) + (z + segments) * perimeter;
  } else if (x === segments) {
    return sideStart + side + (y + segments) + (z + segments) * perimeter;
  } else if (y === segments) {
    return sideStart + 2 * side + (segments - x) + (z + segments) * perimeter;
  } else if (x === -segments) {
    return sideStart + 3 * side + (segments - y) + (z + segments) * perimeter;
  } else if (z === -segments) {
    return (y + segments - 1) * capSide + (x + segments - 1);
  } else { // z === segments
    return topStart + (y + segments - 1) * capSide + (x + segments - 1);
  }
}

function cubeBase(radius: number, segments: number = 1) {
  const capVertices = (2 * segments - 1) * (2 * segments - 1);
  const sideVertices = 8 * segments * (2 * segments + 1);
  const numVertices = 2 * capVertices + sideVertices;

  const vertices = new Float32Array(3 * numVertices);

  const p = new THREE.Vector3(0, 0, -radius);
  let v = 0;
  // vertices: bottom
  for (let y = 1 - segments; y < segments; ++y) {
    for (let x = 1 - segments; x < segments; ++x) {
      p.x = x * radius / segments;
      p.y = y * radius / segments;
      vertices[v++] = p.x;
      vertices[v++] = p.y;
      vertices[v++] = p.z;
    }
  }
  // vertices: sides
  for (let z = -segments; z <= segments; ++z) {
    p.z = z * radius / segments;
    p.y = -radius;
    for (let x = -segments; x < segments; ++x) {
      p.x = x * radius / segments;
      vertices[v++] = p.x;
      vertices[v++] = p.y;
      vertices[v++] = p.z;
    }
    p.x = radius;
    for (let y = -segments; y < segments; ++y) {
      p.y = y * radius / segments;
      vertices[v++] = p.x;
      vertices[v++] = p.y;
      vertices[v++] = p.z;
    }
    p.y = radius;
    for (let x = segments; x > -segments; --x) {
      p.x = x * radius / segments;
      vertices[v++] = p.x;
      vertices[v++] = p.y;
      vertices[v++] = p.z;
    }
    p.x = -radius;
    for (let y = segments; y > -segments; --y) {
      p.y = y * radius / segments;
      vertices[v++] = p.x;
      vertices[v++] = p.y;
      vertices[v++] = p.z;
    }
  }
  // vertices: top
  p.z = radius;
  for (let y = 1 - segments; y < segments; ++y) {
    for (let x = 1 - segments; x < segments; ++x) {
      p.x = x * radius / segments;
      p.y = y * radius / segments;
      vertices[v++] = p.x;
      vertices[v++] = p.y;
      vertices[v++] = p.z;
    }
  }

  const numCells = 24 * segments * segments;
  const indices = new Uint32Array(6 * numCells);
  let i = 0;
  // indices: bottom
  for (let y = -segments; y < segments; ++y) {
    for (let x = -segments; x < segments; ++x) {
      const i00 = index(segments, x, y, -segments);
      const i10 = index(segments, x + 1, y, -segments);
      const i01 = index(segments, x, y + 1, -segments);
      const i11 = index(segments, x + 1, y + 1, -segments);
      if (x < 0 === y < 0) {
        indices[i++] = i00;
        indices[i++] = i01;
        indices[i++] = i11;
        indices[i++] = i00;
        indices[i++] = i11;
        indices[i++] = i10;
      } else {
        indices[i++] = i10;
        indices[i++] = i00;
        indices[i++] = i01;
        indices[i++] = i10;
        indices[i++] = i01;
        indices[i++] = i11;
      }
    }
  }
  // indices: side
  for (let z = -segments; z < segments; ++z) {
    for (let x = -segments; x < segments; ++x) {
      const i00 = index(segments, x, -segments, z);
      const i10 = index(segments, x + 1, -segments, z);
      const i01 = index(segments, x, -segments, z + 1);
      const i11 = index(segments, x + 1, -segments, z + 1);
      if (x < 0 === z < 0) {
        indices[i++] = i00;
        indices[i++] = i11;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
      } else {
        indices[i++] = i10;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
        indices[i++] = i01;
      }
    }
    for (let y = -segments; y < segments; ++y) {
      const i00 = index(segments, segments, y, z);
      const i10 = index(segments, segments, y + 1, z);
      const i01 = index(segments, segments, y, z + 1);
      const i11 = index(segments, segments, y + 1, z + 1);
      if (y < 0 === z < 0) {
        indices[i++] = i00;
        indices[i++] = i11;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
      } else {
        indices[i++] = i10;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
        indices[i++] = i01;
      }
    }
    for (let x = segments; x > -segments; --x) {
      const i00 = index(segments, x, segments, z);
      const i10 = index(segments, x - 1, segments, z);
      const i01 = index(segments, x, segments, z + 1);
      const i11 = index(segments, x - 1, segments, z + 1);
      if (x > 0 === z < 0) {
        indices[i++] = i00;
        indices[i++] = i11;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
      } else {
        indices[i++] = i10;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
        indices[i++] = i01;
      }
    }
    for (let y = segments; y > -segments; --y) {
      const i00 = index(segments, -segments, y, z);
      const i10 = index(segments, -segments, y - 1, z);
      const i01 = index(segments, -segments, y, z + 1);
      const i11 = index(segments, -segments, y - 1, z + 1);
      if (y > 0 === z < 0) {
        indices[i++] = i00;
        indices[i++] = i11;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
      } else {
        indices[i++] = i10;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
        indices[i++] = i01;
      }
    }
  }
  // indices: top
  for (let y = -segments; y < segments; ++y) {
    for (let x = -segments; x < segments; ++x) {
      const i00 = index(segments, x, y, segments);
      const i10 = index(segments, x + 1, y, segments);
      const i01 = index(segments, x, y + 1, segments);
      const i11 = index(segments, x + 1, y + 1, segments);
      if (x < 0 === y < 0) {
        indices[i++] = i00;
        indices[i++] = i11;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
      } else {
        indices[i++] = i10;
        indices[i++] = i01;
        indices[i++] = i00;
        indices[i++] = i10;
        indices[i++] = i11;
        indices[i++] = i01;
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Create cube geometry.
 * @param radius cube radius (half-side lingth).
 * @param segments subdivision number, should be greater then zero.
 * Cube sides will be subdivided into 2 * segments parts for each coordinate axis.
 * @returns cube geometry.
 */
export function cube(radius: number, segments: number = 1) {
  const geometry = cubeBase(radius, segments);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Create sphere geometry, by projecting vertices of the cube to sphere.
 * @param radius sphere radius.
 * @param segments subdivision number, should be greater then zero.
 * Cube sides will be subdivided into 2 * segments parts for each coordinate axis.
 * @returns sphere geometry.
 */
export function sphere(radius: number, segments: number = 1) {
  const geometry = cubeBase(radius, segments);
  const vertices = geometry.getAttribute('position').array as Float32Array;

  const p = 4 / Math.PI;
  const s = Math.sqrt(0.5) / radius;
  const v = new THREE.Vector3();
  for (let i = 0, length = vertices.length; i < length; i += 3) {
    v.x = Math.asin(s * vertices[i + 0]) * p;
    v.y = Math.asin(s * vertices[i + 1]) * p;
    v.z = Math.asin(s * vertices[i + 2]) * p;
    const k = radius / v.length();
    vertices[i + 0] = v.x * k;
    vertices[i + 1] = v.y * k;
    vertices[i + 2] = v.z * k;
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Helper for grid-like geometry.
 * Creates array of vertices using given generator function,
 * to be used in geometry of THREE.Mesh or THREE.LineSegments
 * @param sizeX grid cells count on X axis.
 * @param sizeY grid cells count on Y axis.
 * @param f generator function, for given (x, y) computes vertex coordinate.
 * @returns Float32Array of vertices.
 */
export function gridVertices(sizeX: number, sizeY: number, f: (x: number, y: number) => THREE.Vector3) {
  const vertices = new Float32Array(3 * (sizeX + 1) * (sizeY + 1));
  let i = 0;
  for (let y = 0; y <= sizeY; ++y) {
    for (let x = 0; x <= sizeX; ++x) {
      const v = f(x, y);
      vertices[i++] = v.x;
      vertices[i++] = v.y;
      vertices[i++] = v.z;
    }
  }
  return vertices;
}

/**
 * Helper for grid-like geometry.
 * Creates array of indices to be used in geometry of THREE.LineSegments.
 * @param sizeX grid cells count on X axis.
 * @param sizeY grid cells count on Y axis.
 * @returns Uint32Array of indices.
 */
export function gridIndices(sizeX: number, sizeY: number) {
  const indices = new Uint32Array(2 * (sizeX * (sizeY + 1) + sizeY * (sizeX + 1)));
  let i = 0;
  for (let y = 0; y <= sizeY; ++y) {
    for (let x = 0; x < sizeX; ++x) {
      indices[i++] = y * (sizeX + 1) + x;
      indices[i++] = y * (sizeX + 1) + x + 1;
    }
  }
  for (let x = 0; x <= sizeX; ++x) {
    for (let y = 0; y < sizeY; ++y) {
      indices[i++] = y * (sizeX + 1) + x;
      indices[i++] = (y + 1) * (sizeX + 1) + x;
    }
  }
  return indices;
}

/**
 * Helper for grid-like geometry.
 * Creates array of indices to be used in geometry of THREE.Mesh.
 * @param sizeX grid cells count on X axis.
 * @param sizeY grid cells count on Y axis.
 * @returns Uint32Array of indices.
 */
export function meshIndices(sizeX: number, sizeY: number) {
  const indices = new Uint32Array(6 * sizeX * sizeY);
  let i = 0;
  for (let y = 0; y < sizeY; ++y) {
    for (let x = 0; x < sizeX; ++x) {
      const i0 = x + y * (sizeX + 1);
      const i1 = i0 + sizeX + 1;
      indices[i++] = i0;
      indices[i++] = i1 + 1;
      indices[i++] = i1;
      indices[i++] = i0;
      indices[i++] = i0 + 1;
      indices[i++] = i1 + 1;
    }
  }
  return indices;
}

export function cylinderGridIndices(sizeR: number, sizeL: number) {
  const indices = new Uint32Array(2 * sizeR * (sizeL + sizeL + 1));
  let i = 0;
  for (let y = 0; y <= sizeL; ++y) {
    for (let x = 0; x < sizeR - 1; ++x) {
      indices[i++] = y * sizeR + x;
      indices[i++] = y * sizeR + x + 1;
    }
    indices[i++] = y * sizeR + sizeR - 1;
    indices[i++] = y * sizeR;
  }
  for (let x = 0; x < sizeR; ++x) {
    for (let y = 0; y < sizeL; ++y) {
      indices[i++] = y * sizeR + x;
      indices[i++] = (y + 1) * sizeR + x;
    }
  }
  return indices;
}

/**
 * Creates grid-like geometry for THREE.LineSegments.
 * @param sizeX grid cells count on X axis.
 * @param sizeY grid cells count on Y axis.
 * @param f generator function, for given (x, y) computes vertex coordinate.
 * @returns geometry.
 */
export function grid(sizeX: number, sizeY: number, f: (x: number, y: number) => THREE.Vector3) {
  const vertices = gridVertices(sizeX, sizeY, f);
  const indices = gridIndices(sizeX, sizeY);
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  return geometry;
}

/**
 * Creates grid-like geometry for THREE.Mesh.
 * @param sizeX grid cells count on X axis.
 * @param sizeY grid cells count on Y axis.
 * @param f generator function, for given (x, y) computes vertex coordinate.
 * @returns geometry.
 */
export function mesh(sizeX: number, sizeY: number, f: (x: number, y: number) => THREE.Vector3) {
  const vertices = gridVertices(sizeX, sizeY, f);
  const indices = meshIndices(sizeX, sizeY);
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates grid-like geometry for THREE.Mesh.
 * Adds 'height' attribute to geometry, to make it usable with terrain material.
 * @param sizeX grid cells count on X axis.
 * @param sizeY grid cells count on Y axis.
 * @param f generator function, for given (x, y) computes vertex coordinate.
 * @returns geometry.
 */
export function terrain(sizeX: number, sizeY: number, f: (x: number, y: number) => THREE.Vector3) {
  const geometry = mesh(sizeX, sizeY, f);
  const vertices = geometry.getAttribute('position').array;
  const heights = new Float32Array((sizeX + 1) * (sizeY + 1));
  for (let j = 0, length = vertices.length / 3; j < length; ++j) {
    heights[j] = vertices[3 * j + 2];
  }
  geometry.addAttribute('height', new THREE.Float32BufferAttribute(heights, 1));
  return geometry;
}

/**
 * Creates cylinder-like geometry for THREE.LineSegments.
 * It has closed shape along sizeR, and open shape along sizeL.
 * @param sizeR radial-direction's grid cells count (iterable as x).
 * @param sizeL length-direction's grid cells count (iterable as y).
 * @param f generator function, for given (x, y) computes vertex coordinate.
 * @returns geometry.
 */
export function cylinderGrid(sizeR: number, sizeL: number, f: (x: number, y: number) => THREE.Vector3) {
  const vertices = gridVertices(sizeR - 1, sizeL, f);
  const indices = cylinderGridIndices(sizeR, sizeL);
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  return geometry;
}
