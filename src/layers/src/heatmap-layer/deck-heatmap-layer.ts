// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HeatmapLayer as DeckGLHeatmapLayer} from '@deck.gl/aggregation-layers';
import {Layer, WebMercatorViewport, project32, COORDINATE_SYSTEM} from '@deck.gl/core';
import {Model} from '@luma.gl/engine';
import {editShader, insertBefore} from '@kepler.gl/deckgl-layers';

/**
 * Custom deck.gl HeatmapLayer subclass that patches GPU shaders
 * to match the visual appearance of the previous Mapbox GL heatmap layer.
 *
 * These patches ensure that existing saved maps render identically after
 * the migration from Mapbox heatmap to deck.gl heatmap.
 *
 * Two shader patches are applied:
 *
 * 1. Weights fragment shader (kernel):
 *    - Divides Gaussian kernel output by 8.5 and clips small values
 *      to remove visible hard edges at the radius boundary.
 *    - Changes the distance input from `2. * dist` to `dist` to
 *      correctly map the kernel falloff to the configured radius.
 *
 * 2. Max-weights fragment shader:
 *    - Forces the red channel to 1.0, because Mapbox assumes
 *      a max weight of 1.0 when sampling the color ramp.
 *
 * Additionally, the layer removes the `layerUniforms` (layer) shader module
 * from the weights and max-weights transform shaders. This module injects a
 * uniform block containing `uniform float opacity;` which violates the GLSL
 * ES 3.0 spec (storage qualifiers are not allowed inside uniform blocks) and
 * causes shader compilation failures on strict mobile GPU drivers (e.g. Mali,
 * Adreno on Samsung Galaxy devices). The opacity uniform is not used in these
 * transform passes so removing it is safe.
 *
 * The patching is applied in _createWeightsTransform rather than only in
 * getShaders, because the legacy AggregationLayer.updateState() calls
 * getShaders({}) (with no fs) and then passes the raw shader imports to
 * updateShaders → _createWeightsTransform, bypassing the getShaders patching.
 *
 * # Globe support
 *
 * The stock deck.gl HeatmapLayer only works in a flat WebMercator viewport.
 * It computes the density texture bounds by unprojecting the four screen
 * corners of the *current* viewport, and it renders the final result as a flat
 * 4-vertex quad. Neither of these works on a globe: the screen corners don't
 * unproject to a meaningful lng/lat box, and a flat quad does not conform to
 * the sphere.
 *
 * To support globe mode this layer, when `globeMode` + `densityBounds` are
 * provided:
 *
 * 1. Renders the density texture using a *fixed* WebMercator viewport built
 *    from the layer's data bounds (`densityBounds`), instead of the live globe
 *    viewport. This makes the offscreen density render behave exactly like the
 *    2D top-down case, but framed around the data rather than the screen.
 *
 * 2. Renders the final texture with a subdivided (tessellated) mesh spanning
 *    the same data bounds, so that each vertex is projected onto the globe by
 *    deck.gl's `project_position_to_clipspace`. This is the same technique
 *    deck.gl's BitmapLayer uses to bend a flat image around the sphere.
 */
export default class KeplerHeatmapLayer extends DeckGLHeatmapLayer {
  static defaultProps = {
    ...DeckGLHeatmapLayer.defaultProps,
    // kepler.gl extensions to support globe mode
    globeMode: false,
    // [minLng, minLat, maxLng, maxLat] of the data, used to frame the density texture in globe mode
    densityBounds: null
  };

  // Cached fixed density viewport (keyed by bounds) so we don't rebuild it on
  // every update/render. Not stored in layer state to avoid setState-in-render.
  private _densityViewport: WebMercatorViewport | null = null;
  private _densityViewportKey: string | null = null;

  // Cached globe render mesh, so its identity stays stable across frames (only
  // rebuilt when the density bounds or the globe resolution change).
  private _globeMesh: HeatmapMesh | null = null;
  private _globeMeshKey: string | null = null;

  _createWeightsTransform(shaders: any) {
    if (shaders.fs?.includes('gaussianKDE')) {
      let fs = editShader(
        shaders.fs,
        'fs',
        'return pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666);',
        `float value = pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666) / 8.5;
          return max(value - 0.00443, 0.0);`
      );
      fs = editShader(fs, 'fs', '2. * dist', 'dist');
      fs = editShader(fs, 'fs', 'DECKGL_FILTER_COLOR(fragColor, geometry);', '');
      shaders = {...shaders, fs};
    }

    if (shaders.modules) {
      shaders = {
        ...shaders,
        modules: shaders.modules.filter((m: any) => (m?.name || m) !== 'layer')
      };
    }

    super._createWeightsTransform(shaders);
  }

  getShaders(shaders: any) {
    const result = super.getShaders(shaders);

    if (result.fs?.includes('outTexture.r / max(1.0, outTexture.a)')) {
      // Max-weights fragment shader: force max value to 1.0
      result.fs = insertBefore(
        result.fs,
        'fs',
        'fragColor.g = outTexture.r / max(1.0, outTexture.a);',
        'fragColor.r = 1.0;\n  '
      );
      if (result.modules) {
        result.modules = result.modules.filter((m: any) => (m?.name || m) !== 'layer');
      }
    }

    return result;
  }

  /**
   * True when the layer should render for a globe: globe mode is enabled and
   * valid data bounds were provided to frame the density texture.
   */
  _isGlobeHeatmap(): boolean {
    const {globeMode, densityBounds} = this.props as any;
    return Boolean(globeMode && densityBounds && this._getDensityViewport());
  }

  /**
   * Build (and cache) a fixed WebMercator viewport framing the data bounds.
   *
   * This viewport is completely independent of the current globe camera. It is
   * used only to drive the offscreen density texture render, so the density
   * texture is stable while the user rotates/zooms the globe.
   */
  _getDensityViewport(): WebMercatorViewport | null {
    const {densityBounds} = this.props as any;
    if (!densityBounds) {
      return null;
    }

    const [minLng, minLat, maxLng, maxLat] = densityBounds;
    if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) {
      return null;
    }

    // Clamp latitudes to WebMercator limits so fitBounds stays valid.
    const MAX_LAT = 85.051129;
    const south = Math.max(Math.min(minLat, maxLat), -MAX_LAT);
    const north = Math.min(Math.max(minLat, maxLat), MAX_LAT);
    const west = Math.min(minLng, maxLng);
    const east = Math.max(minLng, maxLng);

    const cacheKey = `${west},${south},${east},${north}`;
    if (this._densityViewportKey === cacheKey && this._densityViewport) {
      return this._densityViewport;
    }

    // Use a reasonably large offscreen frame so the density render has enough
    // resolution regardless of the current globe zoom.
    const width = 1024;
    const height = 1024;

    let viewport: WebMercatorViewport;
    try {
      viewport = new WebMercatorViewport({
        width,
        height,
        longitude: (west + east) / 2,
        latitude: (south + north) / 2,
        zoom: 0
      }).fitBounds(
        [
          [west, south],
          [east, north]
        ],
        {width, height, padding: 0}
      );
    } catch (e) {
      return null;
    }

    this._densityViewport = viewport;
    this._densityViewportKey = cacheKey;
    return viewport;
  }

  updateState(opts: any) {
    if (!this._isGlobeHeatmap()) {
      super.updateState(opts);
      return;
    }

    // In globe mode the density texture is framed by the fixed data-bounds
    // viewport, not the live globe camera. Swap the viewport everywhere the base
    // layer reads it from during update:
    //   - `this.context.viewport` and `opts.context.viewport`: used by the
    //     density math (`_updateBounds`, `_worldToCommonBounds`) and by change
    //     detection (`_getChangeFlags` reads `opts.context.viewport.zoom`).
    //   - `this.internalState.viewport`: TAKES PRIORITY in `Layer.projectPosition`
    //     (`this.internalState.viewport || this.context.viewport`) and is what
    //     deck.gl assigns to `context.viewport` at the start of every update. If
    //     we don't swap it too, the data points are projected with the globe
    //     viewport and land outside the density texture, producing an empty map.
    const densityViewport = this._getDensityViewport();
    if (!densityViewport) {
      super.updateState(opts);
      return;
    }

    const internalState = this.internalState as any;
    const originalContextViewport = this.context.viewport;
    const originalOptsViewport = opts.context?.viewport;
    const originalInternalViewport = internalState?.viewport;
    (this.context as any).viewport = densityViewport;
    if (opts.context) {
      opts.context.viewport = densityViewport;
    }
    if (internalState) {
      internalState.viewport = densityViewport;
    }

    try {
      // Cancel any pending (2D-style) debounced weightmap update; the density
      // is regenerated synchronously here against the fixed viewport.
      const {updateTimer} = this.state as any;
      if (updateTimer) {
        clearTimeout(updateTimer);
        this.setState({updateTimer: null});
      }
      super.updateState(opts);
    } finally {
      (this.context as any).viewport = originalContextViewport;
      if (opts.context) {
        opts.context.viewport = originalOptsViewport;
      }
      if (internalState) {
        internalState.viewport = originalInternalViewport;
      }
    }
  }

  renderLayers(): any {
    if (!this._isGlobeHeatmap()) {
      return super.renderLayers();
    }

    const {
      weightsTexture,
      maxWeightsTexture,
      colorTexture,
      colorDomain,
      worldBounds,
      normalizedCommonBounds
    } = this.state as any;
    const {updateTriggers, intensity, threshold, aggregation} = this.props as any;

    if (
      !weightsTexture ||
      !colorTexture ||
      !maxWeightsTexture ||
      !worldBounds ||
      !normalizedCommonBounds
    ) {
      return null;
    }

    const densityViewport = this._getDensityViewport();
    if (!densityViewport) {
      return null;
    }

    const AGGREGATION_MODE: Record<string, number> = {SUM: 0, MEAN: 1};

    // Build (and memoize) the tessellated mesh spanning the exact region
    // covered by the density texture (`worldBounds`, already aspect-corrected by
    // the base layer). Texture coordinates are computed the same way deck.gl's
    // flat heatmap does: project each vertex through the density viewport and
    // normalize against `normalizedCommonBounds`. This correctly handles the
    // non-linear Web Mercator latitude mapping of the density texture.
    const resolution = this.context.viewport.resolution;
    const meshKey = `${worldBounds.join(',')}|${resolution}`;
    if (this._globeMeshKey !== meshKey || !this._globeMesh) {
      this._globeMesh = createGlobeHeatmapMesh(
        worldBounds as [number, number, number, number],
        normalizedCommonBounds as [number, number, number, number],
        densityViewport,
        resolution
      );
      this._globeMeshKey = meshKey;
    }
    const mesh = this._globeMesh;

    const GlobeTriangleLayerClass = this.getSubLayerClass(
      'globe-triangle',
      GlobeHeatmapTriangleLayer
    );

    return new GlobeTriangleLayerClass(
      this.getSubLayerProps({
        id: 'globe-triangle-layer',
        updateTriggers
      }),
      {
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        data: {length: 1},
        mesh,
        maxTexture: maxWeightsTexture,
        colorTexture,
        aggregationMode: AGGREGATION_MODE[aggregation] || 0,
        weightsTexture,
        intensity,
        threshold,
        colorDomain
      }
    );
  }
}

KeplerHeatmapLayer.layerName = 'HeatmapLayer';

type HeatmapMesh = {
  positions: Float64Array;
  texCoords: Float32Array;
  indices: Uint32Array;
  vertexCount: number;
};

/**
 * Get texture coordinate of a common-space point inside a common bounds box.
 * Mirrors deck.gl's heatmap `getTextureCoordinates`.
 */
function getTextureCoordinate(
  commonPoint: number[],
  commonBounds: [number, number, number, number]
): [number, number] {
  const [xMin, yMin, xMax, yMax] = commonBounds;
  return [(commonPoint[0] - xMin) / (xMax - xMin), (commonPoint[1] - yMin) / (yMax - yMin)];
}

/**
 * Build a mesh covering the world-space rectangle `[minLng, minLat, maxLng,
 * maxLat]` that the density texture spans. When a `resolution` is provided
 * (globe / non-linear viewports set `viewport.resolution`), the quad is
 * subdivided into a grid so it conforms to the sphere.
 *
 * Each vertex's texture coordinate is computed by projecting its world position
 * through the fixed density viewport and normalizing against the density
 * texture's common bounds — identical to how deck.gl's flat heatmap samples the
 * density texture, so the visual result matches 2D top-down mode.
 */
function createGlobeHeatmapMesh(
  worldBounds: [number, number, number, number],
  normalizedCommonBounds: [number, number, number, number],
  densityViewport: WebMercatorViewport,
  resolution?: number
): HeatmapMesh {
  const [minLng, minLat, maxLng, maxLat] = worldBounds;

  const texCoordAt = (lng: number, lat: number): [number, number] =>
    getTextureCoordinate(densityViewport.projectPosition([lng, lat, 0]), normalizedCommonBounds);

  if (!resolution) {
    // corners: [minLng,minLat], [minLng,maxLat], [maxLng,maxLat], [maxLng,minLat]
    const corners = [
      [minLng, minLat],
      [minLng, maxLat],
      [maxLng, maxLat],
      [maxLng, minLat]
    ];
    const positions = new Float64Array(12);
    const texCoords = new Float32Array(8);
    for (let i = 0; i < corners.length; i++) {
      positions[i * 3 + 0] = corners[i][0];
      positions[i * 3 + 1] = corners[i][1];
      positions[i * 3 + 2] = 0;
      const tc = texCoordAt(corners[i][0], corners[i][1]);
      texCoords[i * 2 + 0] = tc[0];
      texCoords[i * 2 + 1] = tc[1];
    }
    return {
      positions,
      texCoords,
      indices: new Uint32Array([0, 2, 1, 0, 3, 2]),
      vertexCount: 6
    };
  }

  const lngSpan = Math.abs(maxLng - minLng);
  const latSpan = Math.abs(maxLat - minLat);
  const uCount = Math.max(2, Math.ceil(lngSpan / resolution) + 1);
  const vCount = Math.max(2, Math.ceil(latSpan / resolution) + 1);

  const vertexCount = (uCount - 1) * (vCount - 1) * 6;
  const indices = new Uint32Array(vertexCount);
  const texCoords = new Float32Array(uCount * vCount * 2);
  const positions = new Float64Array(uCount * vCount * 3);

  let vertex = 0;
  let index = 0;
  for (let u = 0; u < uCount; u++) {
    const ut = u / (uCount - 1);
    for (let v = 0; v < vCount; v++) {
      const vt = v / (vCount - 1);
      const lng = minLng + ut * (maxLng - minLng);
      const lat = minLat + vt * (maxLat - minLat);
      positions[vertex * 3 + 0] = lng;
      positions[vertex * 3 + 1] = lat;
      positions[vertex * 3 + 2] = 0;
      const tc = texCoordAt(lng, lat);
      texCoords[vertex * 2 + 0] = tc[0];
      texCoords[vertex * 2 + 1] = tc[1];
      if (u > 0 && v > 0) {
        indices[index++] = vertex - vCount;
        indices[index++] = vertex - vCount - 1;
        indices[index++] = vertex - 1;
        indices[index++] = vertex - vCount;
        indices[index++] = vertex - 1;
        indices[index++] = vertex;
      }
      vertex++;
    }
  }

  return {positions, texCoords, indices, vertexCount};
}

const globeTriangleVs = `\
#version 300 es
#define SHADER_NAME globe-heatmap-triangle-layer-vertex-shader
uniform sampler2D maxTexture;
in vec3 positions;
in vec3 positions64Low;
in vec2 texCoords;
out vec2 vTexCoords;
out float vIntensityMin;
out float vIntensityMax;
void main(void) {
  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0));
  vTexCoords = texCoords;
  vec4 maxTexture = texture(maxTexture, vec2(0.5));
  float maxValue = triangle.aggregationMode < 0.5 ? maxTexture.r : maxTexture.g;
  float minValue = maxValue * triangle.threshold;
  if (triangle.colorDomain[1] > 0.) {
    maxValue = triangle.colorDomain[1];
    minValue = triangle.colorDomain[0];
  }
  vIntensityMax = triangle.intensity / maxValue;
  vIntensityMin = triangle.intensity / minValue;
}
`;

const globeTriangleFs = `\
#version 300 es
#define SHADER_NAME globe-heatmap-triangle-layer-fragment-shader
precision highp float;
uniform sampler2D weightsTexture;
uniform sampler2D colorTexture;
in vec2 vTexCoords;
in float vIntensityMin;
in float vIntensityMax;
out vec4 fragColor;
vec4 getLinearColor(float value) {
  float factor = clamp(value * vIntensityMax, 0., 1.);
  vec4 color = texture(colorTexture, vec2(factor, 0.5));
  color.a *= min(value * vIntensityMin, 1.0);
  return color;
}
void main(void) {
  vec4 weights = texture(weightsTexture, vTexCoords);
  float weight = weights.r;
  if (triangle.aggregationMode > 0.5) {
    weight /= max(1.0, weights.a);
  }
  if (weight <= 0.) {
    discard;
  }
  vec4 linearColor = getLinearColor(weight);
  linearColor.a *= layer.opacity;
  fragColor = linearColor;
}
`;

const triangleUniformBlock = `\
layout(std140) uniform triangleUniforms {
  float aggregationMode;
  vec2 colorDomain;
  float intensity;
  float threshold;
} triangle;
`;

const globeTriangleUniforms = {
  name: 'triangle',
  vs: triangleUniformBlock,
  fs: triangleUniformBlock,
  uniformTypes: {
    aggregationMode: 'f32',
    colorDomain: 'vec2<f32>',
    intensity: 'f32',
    threshold: 'f32'
  }
} as any;

/**
 * Renders the heatmap density texture as an (optionally subdivided) mesh that
 * conforms to the globe. It reuses the same density → color-ramp mapping as
 * deck.gl's flat heatmap TriangleLayer, but with an indexed, tessellated mesh
 * whose LNGLAT positions deck.gl projects onto the sphere.
 *
 * The attribute/mesh wiring mirrors deck.gl's BitmapLayer (indexed geometry via
 * the AttributeManager with `noAlloc` update callbacks).
 */
class GlobeHeatmapTriangleLayer extends Layer<any> {
  static layerName = 'GlobeHeatmapTriangleLayer';

  declare state: {
    model?: Model;
    mesh?: HeatmapMesh;
  } & Layer['state'];

  getShaders() {
    return super.getShaders({
      vs: globeTriangleVs,
      fs: globeTriangleFs,
      modules: [project32, globeTriangleUniforms]
    });
  }

  initializeState() {
    const attributeManager = this.getAttributeManager();
    // Not pickable; drop the picking-color attribute the base layer adds.
    attributeManager?.remove(['instancePickingColors']);
    const noAlloc = true;
    attributeManager?.add({
      indices: {
        size: 1,
        isIndexed: true,
        update: attribute => (attribute.value = this.state.mesh?.indices ?? null),
        noAlloc
      },
      positions: {
        size: 3,
        type: 'float64',
        fp64: this.use64bitPositions(),
        update: attribute => (attribute.value = this.state.mesh?.positions ?? null),
        noAlloc
      },
      texCoords: {
        size: 2,
        update: attribute => (attribute.value = this.state.mesh?.texCoords ?? null),
        noAlloc
      }
    });

    this.setState({
      mesh: this.props.mesh,
      model: this._getModel()
    });
  }

  updateState(params: any): void {
    super.updateState(params);
    const {props, oldProps, changeFlags} = params;
    const attributeManager = this.getAttributeManager();

    if (changeFlags.extensionsChanged) {
      this.state.model?.destroy();
      this.setState({model: this._getModel()});
      attributeManager?.invalidateAll();
    }

    // The parent rebuilds the mesh whenever bounds/viewport change and passes
    // it in via the `mesh` prop.
    if (props.mesh !== oldProps.mesh && props.mesh) {
      const oldMesh = this.state.mesh;
      const mesh = props.mesh as HeatmapMesh;
      this.state.model?.setVertexCount(mesh.vertexCount);
      for (const key of Object.keys(mesh) as (keyof HeatmapMesh)[]) {
        if (oldMesh && oldMesh[key] !== mesh[key]) {
          attributeManager?.invalidate(key as string);
        }
      }
      this.setState({mesh});
    }
  }

  _getModel(): Model {
    return new Model(this.context.device, {
      ...this.getShaders(),
      id: this.props.id,
      bufferLayout: this.getAttributeManager()?.getBufferLayouts(),
      topology: 'triangle-list',
      isInstanced: false
    });
  }

  draw(): void {
    const {model} = this.state;
    const {
      aggregationMode,
      colorDomain,
      intensity,
      threshold,
      colorTexture,
      maxTexture,
      weightsTexture
    } = this.props;
    if (!model || !weightsTexture || !colorTexture || !maxTexture) {
      return;
    }
    model.shaderInputs.setProps({
      triangle: {
        aggregationMode,
        colorDomain,
        intensity,
        threshold,
        // Textures are not declared in `uniformTypes`, so they are treated as
        // bindings and bound to the matching sampler uniforms by name.
        colorTexture,
        maxTexture,
        weightsTexture
      }
    });
    model.draw(this.context.renderPass);
  }
}
