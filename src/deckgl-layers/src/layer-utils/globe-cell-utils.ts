// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {WebMercatorViewport} from '@deck.gl/core';

/**
 * deck.gl's aggregation cell layers (GridCellLayer / HexagonCellLayer) position
 * each cell in flat mercator "common space" (a 2D XY plane) and then draw it with
 * `project_common_position_to_clipspace`, which only multiplies by the
 * view-projection matrix. Under `_GlobeView` this leaves the cells on the flat XY
 * plane that passes through the center of the globe instead of on its surface
 * (the base ColumnLayer works on the globe because it feeds real lng/lat through
 * `project_position` -> `project_globe_`; the aggregation cell shaders skip that).
 *
 * To fix this we remap the already-computed flat common-space vertex position back
 * to lng/lat (inverse Web Mercator) and then onto the sphere with the same math
 * `project_globe_` uses for geographic layers. Because we remap every vertex of the
 * cell footprint (not just the centroid), the flat quad/hexagon naturally curves
 * onto the surface. Elevation (extruded cells, stored in `geometry.position.z` in
 * common units) is added along the radius so columns rise radially off the globe.
 *
 * The remap is gated by a `globeMode` uniform so 2D/3D mercator rendering is
 * byte-for-byte unchanged.
 *
 * `WORLD_SCALE`, `PI`, `GLOBE_RADIUS` and `project.commonOrigin` are all provided
 * by deck.gl's project shader module which these layers include.
 */

// deck.gl 9 / luma 9 sets custom uniforms via UBO-backed shader modules (there is
// no Model.setUniforms). This minimal module exposes the globe-mode flag.
const globeCellUniforms = {
  name: 'globeCell',
  vs: `layout(std140) uniform globeCellUniforms {
  float globeMode;
} globeCellProps;
`,
  uniformTypes: {
    globeMode: 'f32'
  }
} as const;

const GLOBE_CELL_DECL = /* glsl */ `
// Inverse of deck.gl project_mercator_: flat common XY -> lng/lat (degrees).
vec2 kepler_commonToLngLat(vec2 commonXY) {
  float lng = degrees(commonXY.x / WORLD_SCALE - PI);
  float lat = degrees(2.0 * atan(exp(commonXY.y / WORLD_SCALE - PI)) - PI * 0.5);
  return vec2(lng, lat);
}

// Same math as deck.gl project_globe_. elevationCommon is in common units already
// (GLOBE_RADIUS space), matching how project_globe_ scales z off EARTH_RADIUS.
vec3 kepler_lngLatToGlobe(vec2 lngLat, float elevationCommon) {
  float lambda = radians(lngLat.x);
  float phi = radians(lngLat.y);
  float cosPhi = cos(phi);
  float D = GLOBE_RADIUS + elevationCommon;
  return vec3(
    sin(lambda) * cosPhi,
    -cos(lambda) * cosPhi,
    sin(phi)
  ) * D;
}
`;

/**
 * Rewrites a grid/hexagon cell vertex shader so that, in globe mode, the final
 * clip-space position is derived from the sphere surface instead of the flat XY
 * plane. In 2D/3D mode the original path is kept unchanged.
 */
export function addGlobeCellProjection(vs: string, type: string): string {
  const decl = `${GLOBE_CELL_DECL}\nvoid main(void) {`;
  const withDecl = vs.includes('void main(void) {') ? vs.replace('void main(void) {', decl) : vs;

  const target = 'gl_Position = project_common_position_to_clipspace(geometry.position);';
  if (!withDecl.includes(target)) {
    // Shader shape changed in a deck.gl update; leave the original so we don't crash.
    // eslint-disable-next-line no-console
    console.error(`Cannot edit ${type} globe cell shader`);
    return withDecl;
  }

  return withDecl.replace(
    target,
    `if (globeCellProps.globeMode > 0.5) {
      vec2 lngLat = kepler_commonToLngLat(geometry.position.xy + project.commonOrigin.xy);
      vec3 globePos = kepler_lngLatToGlobe(lngLat, geometry.position.z);
      geometry.position = vec4(globePos, 1.0);
    }
    gl_Position = project_common_position_to_clipspace(geometry.position);`
  );
}

/**
 * deck.gl 9's Grid/Hexagon aggregation compute bin positions and the cell layer's
 * "common space" from `this.context.viewport`. Under `_GlobeView` that common space
 * is the globe's 3D-projected space (projectFlat is identity on lng/lat, positions
 * bin off the sphere-projected XY), which both mis-bins data and — combined with the
 * flat cell shader — drops cells onto the plane through the globe center.
 *
 * We sidestep this by running `_updateBinOptions` with a WebMercatorViewport that
 * matches the current globe camera. That makes binning, `cellOriginCommon` /
 * `cellSizeCommon` (or `radiusCommon` / `hexOriginCommon`) and the cell shader's
 * flat position all live in genuine Web Mercator common space, which the cell shader
 * remap (`addGlobeCellProjection`) then curves back onto the sphere. In 2D/3D mode
 * this is a no-op.
 *
 * `callSuper` runs deck.gl's original `_updateBinOptions` while the viewport is
 * temporarily swapped. The swap is synchronous and restored in `finally`.
 */
export function runBinOptionsWithMercatorViewport(layer: any, callSuper: () => void): void {
  const viewport = layer.context?.viewport;
  const isGlobe = Boolean(viewport?.resolution);
  if (!isGlobe) {
    callSuper();
    return;
  }

  const mercatorViewport = new WebMercatorViewport({
    width: viewport.width,
    height: viewport.height,
    longitude: viewport.longitude,
    latitude: viewport.latitude,
    zoom: viewport.zoom
  });

  const originalViewport = layer.context.viewport;
  layer.context.viewport = mercatorViewport;
  try {
    callSuper();
  } finally {
    layer.context.viewport = originalViewport;
  }
}

/**
 * Wraps a deck.gl aggregation cell layer class (GridCellLayer / HexagonCellLayer)
 * with a subclass that injects the globe surface remap into its vertex shader.
 *
 * We create the subclass dynamically from whatever default class deck.gl provides
 * to `getSubLayerClass` so we don't have to import the (non-public) cell layer
 * classes directly. Results are cached per base class so deck.gl sees a stable
 * layer class across renders (layers are recreated every frame) and shader
 * compilation / sublayer diffing stays stable.
 */
const globeCellClassCache = new WeakMap<object, object>();

type LayerConstructor = {new (...args: any[]): any; layerName?: string};

export function makeGlobeCellLayerClass<T extends LayerConstructor>(
  BaseCellLayer: T,
  type: string
): T {
  const cached = globeCellClassCache.get(BaseCellLayer);
  if (cached) {
    return cached as T;
  }

  class GlobeCellLayer extends (BaseCellLayer as {new (...args: any[]): any}) {
    getShaders() {
      const shaders = (super.getShaders as () => any)();
      return {
        ...shaders,
        vs: addGlobeCellProjection(shaders.vs, type),
        modules: [...(shaders.modules || []), globeCellUniforms]
      };
    }

    draw(opts: any) {
      const globeMode = (this.context.viewport as any).resolution ? 1.0 : 0.0;
      // GridCellLayer / HexagonCellLayer render through a single fillModel and set
      // their own module props in draw(); set ours first so it merges (setProps is
      // per-module). deck.gl 9 has no Model.setUniforms — uniforms go through
      // shaderInputs UBO modules.
      const model = (this.state as any).fillModel;
      if (model?.shaderInputs) {
        model.shaderInputs.setProps({globeCell: {globeMode}});
      }
      (super.draw as (o: any) => void)(opts);
    }
  }
  (GlobeCellLayer as unknown as {layerName: string}).layerName = `Globe${type}CellLayer`;
  globeCellClassCache.set(BaseCellLayer, GlobeCellLayer);
  return GlobeCellLayer as unknown as T;
}
