// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ShaderModule} from '@luma.gl/shadertools';

export const WATER_UNIFORMS = `
uniform waterUniforms {
  vec2 size;
  float dt;
  float rain;
  float cellSize;
  float openBoundary;
} water;
`;

export const waterModule = {
  name: 'water',
  fs: WATER_UNIFORMS,
  uniformTypes: {size: 'vec2<f32>', dt: 'f32', rain: 'f32', cellSize: 'f32', openBoundary: 'f32'}
} as const satisfies ShaderModule;

export const CAPTURE_FS = `#version 300 es
precision highp float;
uniform sampler2D capturedDepth;
in vec2 coordinate;
out vec4 fragColor;
void main() {
  float d = texture(capturedDepth, coordinate).r;
  fragColor = vec4(20000.0 - d * 32000.0, 0.0, 0.0, d < 1.0 ? 1.0 : 0.0);
}`;

export const heightFilterModule = {
  name: 'heightFilter',
  fs: `uniform heightFilterUniforms {
  vec2 size;
  float strength;
} heightFilter;`,
  uniformTypes: {size: 'vec2<f32>', strength: 'f32'}
} as const satisfies ShaderModule;

// A 5x5 Gaussian blur clipped to the original height: small peaks are lowered,
// but depressions never fill. Invalid samples neither contribute nor become land.
export const SMOOTH_HEIGHT_FS = `#version 300 es
precision highp float;
uniform sampler2D terrain;
in vec2 coordinate;
out vec4 fragColor;
float weight(int offset) {
  if (offset == 0) return 6.0;
  if (offset == -1 || offset == 1) return 4.0;
  return 1.0;
}
void main() {
  vec4 center = texture(terrain, coordinate);
  if (center.a < 0.5) { fragColor = center; return; }
  float delta = 0.0;
  float totalWeight = 0.0;
  for (int y = -2; y <= 2; y++) {
    for (int x = -2; x <= 2; x++) {
      vec2 p = coordinate + vec2(float(x), float(y)) / heightFilter.size;
      if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) continue;
      vec4 neighbor = texture(terrain, p);
      if (neighbor.a < 0.5) continue;
      float w = weight(x) * weight(y);
      delta += w * (neighbor.r - center.r);
      totalWeight += w;
    }
  }
  fragColor = center;
  fragColor.r += min(0.0, delta / totalWeight) * clamp(heightFilter.strength, 0.0, 1.0);
}`;

// Conservative diffusive routing, not a momentum/shallow-water solver.
// RGBA are outgoing water depths toward east, west, north, south for this step.
// Each edge receives at most a quarter of the surface difference for stability.
// Share the available water across outgoing edges, so a single steep route can
// carry the full depth instead of reserving three quarters for other directions.
export const FLUX_FS = `#version 300 es
precision highp float;
uniform sampler2D terrain;
uniform sampler2D state;
in vec2 coordinate;
out vec4 fragColor;
float flow(vec2 offset, float ground, float depth) {
  vec2 p = coordinate + offset / water.size;
  if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) {
    return 0.0;
  }
  vec4 neighbor = texture(terrain, p);
  // Missing terrain is a wall, never an invented zero-elevation drain.
  if (neighbor.a < 0.5) return 0.0;
  float otherDepth = water.openBoundary > 0.5 && neighbor.g > 0.5
    ? 0.0 : texture(state, p).r + water.rain * water.dt;
  // Outside these bounds the transfer already saturates at zero or depth.
  // Clamping also prevents GPU optimizers from regrouping this subtraction
  // with tiny water depths and losing them at large absolute terrain heights.
  float groundDifference = clamp(ground - neighbor.r, -depth, otherDepth + 3.0 * depth);
  float surfaceDifference = groundDifference + (depth - otherDepth);
  return min(depth, max(0.0, surfaceDifference) * 0.25);
}
void main() {
  vec4 ground = texture(terrain, coordinate);
  if (ground.a < 0.5) { fragColor = vec4(0.0); return; }
  // Open perimeter cells are outlets: stored water and rain leave the area,
  // instead of accumulating behind a slow, cell-size-dependent edge leak.
  if (water.openBoundary > 0.5 && ground.g > 0.5) { fragColor = vec4(0.0); return; }
  float depth = texture(state, coordinate).r + water.rain * water.dt;
  float rate = min(1.0, water.dt * 120.0 / water.cellSize);
  vec4 outgoing = vec4(flow(vec2(1, 0), ground.r, depth),
    flow(vec2(-1, 0), ground.r, depth), flow(vec2(0, 1), ground.r, depth),
    flow(vec2(0, -1), ground.r, depth));
  float total = dot(outgoing, vec4(1.0));
  if (total > depth) outgoing *= depth / total;
  fragColor = rate * outgoing;
  // Do not send a sub-ULP amount that cannot be deducted from the donor's float
  // depth: repeatedly crediting it to a shallow receiver would create water.
  fragColor *= step(vec4(depth * 1.1920929e-7), fragColor);
}`;

export const UPDATE_FS = `#version 300 es
precision highp float;
uniform sampler2D terrain;
uniform sampler2D state;
uniform sampler2D flux;
in vec2 coordinate;
out vec4 fragColor;
vec4 neighborFlux(vec2 offset) {
  vec2 p = coordinate + offset / water.size;
  if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) return vec4(0.0);
  return texture(flux, p);
}
void main() {
  vec4 ground = texture(terrain, coordinate);
  if (ground.a < 0.5) { fragColor = vec4(0.0); return; }
  // Absorb incoming flow as well as existing water at open outlets.
  if (water.openBoundary > 0.5 && ground.g > 0.5) { fragColor = vec4(0, 0, 0, 1); return; }
  vec4 outgoing = texture(flux, coordinate);
  float incoming = neighborFlux(vec2(1, 0)).g + neighborFlux(vec2(-1, 0)).r
    + neighborFlux(vec2(0, 1)).a + neighborFlux(vec2(0, -1)).b;
  float depth = texture(state, coordinate).r + water.rain * water.dt;
  fragColor = vec4(max(0.0, depth + incoming - dot(outgoing, vec4(1.0))), 0, 0, 1);
}`;

const SURFACE_UNIFORMS = `
uniform waterSurfaceUniforms {
  mat4 matrix;
  float span;
  float units;
  float resolution;
  vec3 color;
  float opacity;
} waterSurface;
`;

export const surfaceModule = {
  name: 'waterSurface',
  vs: SURFACE_UNIFORMS,
  fs: SURFACE_UNIFORMS,
  uniformTypes: {
    matrix: 'mat4x4<f32>',
    span: 'f32',
    units: 'f32',
    resolution: 'f32',
    color: 'vec3<f32>',
    opacity: 'f32'
  }
} as const satisfies ShaderModule;

export const SURFACE_VS = `#version 300 es
precision highp float;
uniform sampler2D terrain;
uniform sampler2D state;
out vec2 vUV;
out float vDepth;
out float vValid;
void main() {
  int n = int(waterSurface.resolution) - 1;
  int cell = gl_VertexID / 6;
  int corner = gl_VertexID - cell * 6;
  vec2 offset = vec2(0);
  if (corner == 1 || corner == 4) offset = vec2(1, 0);
  if (corner == 2 || corner == 3) offset = vec2(0, 1);
  if (corner == 5) offset = vec2(1, 1);
  vUV = (vec2(cell - (cell / n) * n, cell / n) + offset + 0.5) / waterSurface.resolution;
  vec4 ground = texture(terrain, vUV);
  vDepth = texture(state, vUV).r;
  vValid = ground.a;
  vec3 position = vec3((vUV - 0.5) * waterSurface.span,
    (ground.r + vDepth) * waterSurface.units);
  gl_Position = waterSurface.matrix * vec4(position, 1);
}`;

export const SURFACE_FS = `#version 300 es
precision highp float;
uniform sampler2D terrain;
uniform sampler2D state;
in vec2 vUV;
in float vDepth;
in float vValid;
out vec4 fragColor;
float height(vec2 uv) { return texture(terrain, uv).r + texture(state, uv).r; }
void main() {
  if (vDepth < 0.002 || vValid < 0.999) discard;
  vec2 d = vec2(1.0 / waterSurface.resolution, 0);
  float dx = height(vUV + d.xy) - height(vUV - d.xy);
  float dy = height(vUV + d.yx) - height(vUV - d.yx);
  float cellSize = waterSurface.span / (waterSurface.units * waterSurface.resolution);
  vec3 normal = normalize(vec3(-dx, -dy, 2.0 * cellSize));
  float light = 0.65 + 0.35 * max(0.0, dot(normal, normalize(vec3(-0.4, 0.5, 1))));
  float alpha = waterSurface.opacity * smoothstep(0.002, 0.1, vDepth);
  fragColor = vec4(waterSurface.color * light * alpha, alpha);
}`;
