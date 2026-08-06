// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, project32, COORDINATE_SYSTEM} from '@deck.gl/core';
import {HeatmapLayer as DeckGLHeatmapLayer} from '@deck.gl/aggregation-layers';
import {Model} from '@luma.gl/engine';
import {TextureTransform} from '@luma.gl/engine';
import {editShader} from '@kepler.gl/deckgl-layers';
import KeplerHeatmapLayer from '../heatmap-layer/deck-heatmap-layer';
import {MAX_ISOLINE_LEVELS, isolineFragmentShader, isolineShaderModule} from './isoline-shader';

// ---------------------------------------------------------------------------
// Shared vertex shader (identical to deck.gl's stock TriangleLayer vertex,
// just renamed to avoid confusion)
// ---------------------------------------------------------------------------

const TRIANGLE_VS = `\
#version 300 es
#define SHADER_NAME isoline-triangle-vertex-shader
uniform sampler2D maxTexture;
in vec3 positions;
in vec2 texCoords;
out vec2 vTexCoords;
out float vIntensityMin;
out float vIntensityMax;
void main(void) {
  gl_Position = project_position_to_clipspace(positions, vec3(0.0), vec3(0.0));
  vTexCoords = texCoords;
  vec4 maxTex = texture(maxTexture, vec2(0.5));
  float maxValue = isoTriangle.aggregationMode < 0.5 ? maxTex.r : maxTex.g;
  float minValue = maxValue * isoTriangle.threshold;
  if (isoTriangle.colorDomain[1] > 0.) {
    maxValue = isoTriangle.colorDomain[1];
    minValue = isoTriangle.colorDomain[0];
  }
  vIntensityMax = isoTriangle.intensity / maxValue;
  vIntensityMin = isoTriangle.intensity / minValue;
}
`;

const GLOBE_VS = `\
#version 300 es
#define SHADER_NAME isoline-globe-triangle-vertex-shader
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
  vec4 maxTex = texture(maxTexture, vec2(0.5));
  float maxValue = isoTriangle.aggregationMode < 0.5 ? maxTex.r : maxTex.g;
  float minValue = maxValue * isoTriangle.threshold;
  if (isoTriangle.colorDomain[1] > 0.) {
    maxValue = isoTriangle.colorDomain[1];
    minValue = isoTriangle.colorDomain[0];
  }
  vIntensityMax = isoTriangle.intensity / maxValue;
  vIntensityMin = isoTriangle.intensity / minValue;
}
`;

// ---------------------------------------------------------------------------
// isoTriangle uniform block — same scalars as deck.gl's stock TriangleLayer
// but with a different name to avoid the 'triangle' module namespace collision
// ---------------------------------------------------------------------------

const ISO_TRIANGLE_BLOCK = `\
layout(std140) uniform isoTriangleUniforms {
  float aggregationMode;
  vec2  colorDomain;
  float intensity;
  float threshold;
} isoTriangle;
`;

const isoTriangleUniforms = {
  name: 'isoTriangle',
  vs: ISO_TRIANGLE_BLOCK,
  fs: ISO_TRIANGLE_BLOCK,
  uniformTypes: {
    aggregationMode: 'f32',
    colorDomain: 'vec2<f32>',
    intensity: 'f32',
    threshold: 'f32'
  }
} as any;

// ---------------------------------------------------------------------------
// Helpers to build 1-D GPU textures for level data
// ---------------------------------------------------------------------------

/**
 * Create a MAX_LEVELS×1 R32F texture for threshold values.
 * Returns null if device doesn't support float textures.
 */
function createLevelsTexture(device: any, values: number[]): any {
  const data = new Float32Array(MAX_ISOLINE_LEVELS);
  for (let i = 0; i < Math.min(values.length, MAX_ISOLINE_LEVELS); i++) {
    data[i] = values[i];
  }
  try {
    return device.createTexture({
      width: MAX_ISOLINE_LEVELS,
      height: 1,
      format: 'r32float',
      data,
      sampler: {minFilter: 'nearest', magFilter: 'nearest', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge'}
    });
  } catch (e) {
    // Fallback: try rgba32float with data in red channel
    try {
      const rgba = new Float32Array(MAX_ISOLINE_LEVELS * 4);
      for (let i = 0; i < MAX_ISOLINE_LEVELS; i++) rgba[i * 4] = data[i];
      return device.createTexture({
        width: MAX_ISOLINE_LEVELS,
        height: 1,
        format: 'rgba32float',
        data: rgba,
        sampler: {minFilter: 'nearest', magFilter: 'nearest', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge'}
      });
    } catch (e2) {
      return null;
    }
  }
}

/**
 * Create a MAX_LEVELS×1 RGBA32F texture for color data.
 * colors: array of [r,g,b,a] each in [0..1].
 */
function createColorsTexture(device: any, colors: [number, number, number, number][]): any {
  const data = new Float32Array(MAX_ISOLINE_LEVELS * 4);
  for (let i = 0; i < Math.min(colors.length, MAX_ISOLINE_LEVELS); i++) {
    data[i * 4 + 0] = colors[i][0];
    data[i * 4 + 1] = colors[i][1];
    data[i * 4 + 2] = colors[i][2];
    data[i * 4 + 3] = colors[i][3];
  }
  try {
    return device.createTexture({
      width: MAX_ISOLINE_LEVELS,
      height: 1,
      format: 'rgba32float',
      data,
      sampler: {minFilter: 'nearest', magFilter: 'nearest', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge'}
    });
  } catch (e) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 2-D IsolineTriangleLayer  (flat / WebMercator)
// ---------------------------------------------------------------------------

class IsolineTriangleLayer extends Layer<any> {
  static layerName = 'IsolineTriangleLayer';

  declare state: {
    model?: Model;
    levelsTexture?: any;
    bandColorsTexture?: any;
    lineColorsTexture?: any;
  } & Layer['state'];

  getShaders() {
    return super.getShaders({
      vs: TRIANGLE_VS,
      fs: isolineFragmentShader,
      modules: [project32, isoTriangleUniforms, isolineShaderModule]
    });
  }

  initializeState({device}: any) {
    const model = this._getModel(device);
    const levelsTexture = createLevelsTexture(device, this.props.levels ?? []);
    const bandColorsTexture = createColorsTexture(device, this.props.bandColors ?? []);
    const lineColorsTexture = createColorsTexture(device, this.props.lineColors ?? []);
    this.setState({model, levelsTexture, bandColorsTexture, lineColorsTexture});
  }

  finalizeState(context: any) {
    super.finalizeState(context);
    this.state.levelsTexture?.destroy();
    this.state.bandColorsTexture?.destroy();
    this.state.lineColorsTexture?.destroy();
  }

  updateState(params: any): void {
    super.updateState(params);
    const {props, oldProps, changeFlags} = params;
    if (changeFlags.extensionsChanged) {
      this.state.model?.destroy();
      this.setState({model: this._getModel(params.context.device)});
    }
    // Update level textures when data changes
    if (props.levels !== oldProps.levels || props.bandColors !== oldProps.bandColors || props.lineColors !== oldProps.lineColors) {
      const device = params.context.device;
      this.state.levelsTexture?.destroy();
      this.state.bandColorsTexture?.destroy();
      this.state.lineColorsTexture?.destroy();
      this.setState({
        levelsTexture: createLevelsTexture(device, props.levels ?? []),
        bandColorsTexture: createColorsTexture(device, props.bandColors ?? []),
        lineColorsTexture: createColorsTexture(device, props.lineColors ?? [])
      });
    }
  }

  _getModel(device: any): Model {
    const {vertexCount, data} = this.props;
    return new Model(device, {
      ...this.getShaders(),
      id: this.props.id,
      attributes: (data as any).attributes,
      bufferLayout: [
        {name: 'positions', format: 'float32x3'},
        {name: 'texCoords', format: 'float32x2'}
      ],
      topology: 'triangle-strip',
      vertexCount
    });
  }

  draw() {
    const {model, levelsTexture, bandColorsTexture, lineColorsTexture} = this.state as any;
    if (!model) return;

    const {
      aggregationMode, colorDomain, intensity, threshold,
      maxTexture, weightsTexture,
      levelCount, showFill, showLines, lineWidthPx
    } = this.props;

    if (!weightsTexture || !maxTexture) return;
    if (!levelsTexture || !bandColorsTexture || !lineColorsTexture) return;

    model.shaderInputs.setProps({
      isoTriangle: {
        aggregationMode, colorDomain, intensity, threshold,
        maxTexture, weightsTexture
      },
      isoline: {
        levelCount: levelCount ?? 0,
        showFill: showFill ? 1.0 : 0.0,
        showLines: showLines ? 1.0 : 0.0,
        lineWidthPx: lineWidthPx ?? 1.5,
        // Texture bindings: keys NOT in uniformTypes → treated as texture bindings by luma.gl
        levelsTexture,
        bandColorsTexture,
        lineColorsTexture
      }
    });
    model.draw(this.context.renderPass);
  }
}

// ---------------------------------------------------------------------------
// Globe IsolineTriangleLayer (subdivided mesh for globe mode)
// ---------------------------------------------------------------------------

type IsolineMesh = {
  positions: Float64Array;
  texCoords: Float32Array;
  indices: Uint32Array;
  vertexCount: number;
};

class IsolineGlobeTriangleLayer extends Layer<any> {
  static layerName = 'IsolineGlobeTriangleLayer';

  declare state: {
    model?: Model;
    mesh?: IsolineMesh;
    levelsTexture?: any;
    bandColorsTexture?: any;
    lineColorsTexture?: any;
  } & Layer['state'];

  getShaders() {
    return super.getShaders({
      vs: GLOBE_VS,
      fs: isolineFragmentShader,
      modules: [project32, isoTriangleUniforms, isolineShaderModule]
    });
  }

  initializeState() {
    const attributeManager = this.getAttributeManager();
    attributeManager?.remove(['instancePickingColors']);
    const noAlloc = true;
    attributeManager?.add({
      indices: {
        size: 1, isIndexed: true,
        update: (attr: any) => (attr.value = this.state.mesh?.indices ?? null), noAlloc
      },
      positions: {
        size: 3, type: 'float64' as any, fp64: this.use64bitPositions(),
        update: (attr: any) => (attr.value = this.state.mesh?.positions ?? null), noAlloc
      },
      texCoords: {
        size: 2,
        update: (attr: any) => (attr.value = this.state.mesh?.texCoords ?? null), noAlloc
      }
    });

    const device = (this.context as any).device;
    this.setState({
      mesh: this.props.mesh,
      model: this._getModel(),
      levelsTexture: createLevelsTexture(device, this.props.levels ?? []),
      bandColorsTexture: createColorsTexture(device, this.props.bandColors ?? []),
      lineColorsTexture: createColorsTexture(device, this.props.lineColors ?? [])
    });
  }

  finalizeState(context: any) {
    super.finalizeState(context);
    this.state.levelsTexture?.destroy();
    this.state.bandColorsTexture?.destroy();
    this.state.lineColorsTexture?.destroy();
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

    if (props.mesh !== oldProps.mesh && props.mesh) {
      const mesh = props.mesh as IsolineMesh;
      this.state.model?.setVertexCount(mesh.vertexCount);
      const oldMesh = this.state.mesh;
      for (const key of Object.keys(mesh) as (keyof IsolineMesh)[]) {
        if (oldMesh && oldMesh[key] !== mesh[key]) {
          attributeManager?.invalidate(key as string);
        }
      }
      this.setState({mesh});
    }

    if (props.levels !== oldProps.levels || props.bandColors !== oldProps.bandColors || props.lineColors !== oldProps.lineColors) {
      const device = params.context.device;
      this.state.levelsTexture?.destroy();
      this.state.bandColorsTexture?.destroy();
      this.state.lineColorsTexture?.destroy();
      this.setState({
        levelsTexture: createLevelsTexture(device, props.levels ?? []),
        bandColorsTexture: createColorsTexture(device, props.bandColors ?? []),
        lineColorsTexture: createColorsTexture(device, props.lineColors ?? [])
      });
    }
  }

  _getModel(): Model {
    return new Model((this.context as any).device, {
      ...this.getShaders(),
      id: this.props.id,
      bufferLayout: this.getAttributeManager()?.getBufferLayouts(),
      topology: 'triangle-list',
      isInstanced: false
    });
  }

  draw(): void {
    const {model, levelsTexture, bandColorsTexture, lineColorsTexture} = this.state as any;
    if (!model) return;

    const {
      aggregationMode, colorDomain, intensity, threshold,
      maxTexture, weightsTexture,
      levelCount, showFill, showLines, lineWidthPx
    } = this.props;

    if (!weightsTexture || !maxTexture) return;
    if (!levelsTexture || !bandColorsTexture || !lineColorsTexture) return;

    model.shaderInputs.setProps({
      isoTriangle: {
        aggregationMode, colorDomain, intensity, threshold,
        maxTexture, weightsTexture
      },
      isoline: {
        levelCount: levelCount ?? 0,
        showFill: showFill ? 1.0 : 0.0,
        showLines: showLines ? 1.0 : 0.0,
        lineWidthPx: lineWidthPx ?? 1.5,
        levelsTexture,
        bandColorsTexture,
        lineColorsTexture
      }
    });
    model.draw(this.context.renderPass);
  }
}

// ---------------------------------------------------------------------------
// Main DeckIsolineLayer
// ---------------------------------------------------------------------------

export default class DeckIsolineLayer extends KeplerHeatmapLayer {
  static layerName = 'DeckIsolineLayer';

  static defaultProps = {
    ...(KeplerHeatmapLayer as any).defaultProps,
    levelCount: 6,
    levels: {type: 'array', value: []},
    bandColors: {type: 'array', value: []},
    lineColors: {type: 'array', value: []},
    showFill: true,
    showLines: true,
    lineWidthPx: 1.5
  };

  // Globe mesh cache (kept off-state to avoid triggering re-renders)
  private _globeIsolineMesh: IsolineMesh | null = null;
  private _globeIsolineMeshKey: string | null = null;

  /**
   * Override KeplerHeatmapLayer.getShaders to skip the `fragColor.r = 1.0`
   * patch on the max-weights shader.  That patch forces the normalization
   * denominator to 1.0, which collapses all values in a dense region to 1.0
   * and creates a solid plateau.  For isolines we need the *actual* per-frame
   * maximum so that `vIntensityMax = intensity / maxValue` correctly spreads
   * the weights across [0, 1] before threshold comparisons.
   *
   * We still keep the `layer` module removal that KeplerHeatmapLayer also
   * does, because without it the aggregation-layers package fails to link
   * shaders on some mobile GPUs.
   */
  getShaders(shaders: any) {
    // Bypass KeplerHeatmapLayer.getShaders → call DeckGLHeatmapLayer directly.
    const result = (DeckGLHeatmapLayer.prototype.getShaders as any).call(this, shaders);
    // Retain the module-removal side-effect (mobile GPU safety).
    if (result?.modules) {
      result.modules = result.modules.filter((m: any) => (m?.name || m) !== 'layer');
    }
    return result;
  }

  /**
   * Override the KDE weights-accumulation transform for MAX/MIN aggregation.
   *
   * SUM/MEAN (inherited behaviour):
   *   blend = 'add'  → each point accumulates  weight × gaussianKDE(dist)
   *   The final texel holds the summed/mean weighted density.
   *
   * MAX/MIN (new):
   *   blend = 'max'/'min' → each point emits its raw field value unchanged;
   *   WebGL picks the maximum/minimum across all overlapping points.
   *   The Gaussian spread is removed — each point only writes to its own
   *   texel — so the result is a spatial max/min field value map rather
   *   than a kernel density estimate.
   */
  _createWeightsTransform(shaders: any) {
    const aggregation = (this.props as any).aggregation as string;

    if (aggregation !== 'MAX') {
      // SUM/MEAN: default KeplerHeatmapLayer pipeline (Gaussian KDE + additive blend).
      super._createWeightsTransform(shaders);
      return;
    }

    // MAX: same Gaussian spread as SUM/MEAN but blend operation is 'max' so
    // each texel retains only the highest weight × kernel value.

    // weightUniforms is not publicly exported from @deck.gl/aggregation-layers,
    // so we reproduce the module inline (identical to heatmap-layer-uniforms.ts).
    const weightUniformsModule = {
      name: 'weight',
      vs: `layout(std140) uniform weightUniforms {
  vec4 commonBounds;
  float radiusPixels;
  float textureWidth;
  float weightsScale;
} weight;`,
      uniformTypes: {
        commonBounds: 'vec4<f32>',
        radiusPixels: 'f32',
        textureWidth: 'f32',
        weightsScale: 'f32'
      }
    };

    // Apply the same kernel patches KeplerHeatmapLayer uses for SUM/MEAN so
    // the spread radius looks identical across all four aggregation modes.
    let useFs = shaders.fs as string;
    if (useFs?.includes('gaussianKDE')) {
      useFs = editShader(
        useFs, 'fs',
        'return pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666);',
        `float value = pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666) / 8.5;
          return max(value - 0.00443, 0.0);`
      );
      useFs = editShader(useFs, 'fs', '2. * dist', 'dist');
      useFs = editShader(useFs, 'fs', 'DECKGL_FILTER_COLOR(fragColor, geometry);', '');
    }

    const filteredModules = (shaders.modules || []).filter(
      (m: any) => (m?.name || m) !== 'layer'
    );

    const blendOp = 'max';
    const {weightsTexture} = this.state as any;
    (this.state as any).weightsTransform?.destroy();

    const weightsTransform = new TextureTransform(this.context.device, {
      id: `${this.id}-weights-transform`,
      ...shaders,
      fs: useFs,
      bufferLayout: this.getAttributeManager()!.getBufferLayouts(),
      vertexCount: 1,
      targetTexture: weightsTexture,
      parameters: {
        depthWriteEnabled: false,
        blend: true,
        blendColorOperation: blendOp,
        blendAlphaOperation: blendOp,
        blendColorSrcFactor: 'one',
        blendColorDstFactor: 'one',
        blendAlphaSrcFactor: 'one',
        blendAlphaDstFactor: 'one'
      },
      topology: 'point-list',
      modules: [...filteredModules, weightUniformsModule]
    } as any);

    this.setState({weightsTransform});
  }

  renderLayers(): any {
    if (this._isGlobeHeatmap()) {
      return this._renderGlobeIsolineLayers();
    }
    return this._render2DIsolineLayers();
  }

  _render2DIsolineLayers(): any {
    const state = this.state as any;
    const {weightsTexture, triPositionBuffer, triTexCoordBuffer, maxWeightsTexture, colorDomain} = state;

    if (!weightsTexture || !triPositionBuffer || !triTexCoordBuffer || !maxWeightsTexture) {
      return null;
    }

    const props = this.props as any;
    const {updateTriggers, intensity, threshold, aggregation, levelCount, levels, bandColors, lineColors, showFill, showLines, lineWidthPx} = props;

    return new IsolineTriangleLayer(
      this.getSubLayerProps({id: 'isoline-triangle', updateTriggers}),
      {
        data: {attributes: {positions: triPositionBuffer, texCoords: triTexCoordBuffer}, length: 4},
        vertexCount: 4,
        maxTexture: maxWeightsTexture,
        weightsTexture,
        aggregationMode: aggregation === 'MEAN' ? 1 : 0,
        colorDomain: colorDomain ?? [0, 0],
        intensity: intensity ?? 1,
        threshold: threshold ?? 0.001,
        levelCount: levelCount ?? 0,
        levels: levels ?? [],
        bandColors: bandColors ?? [],
        lineColors: lineColors ?? [],
        showFill: showFill !== false,
        showLines: showLines !== false,
        lineWidthPx: lineWidthPx ?? 1.5
      }
    );
  }

  _renderGlobeIsolineLayers(): any {
    const state = this.state as any;
    const {weightsTexture, maxWeightsTexture, colorDomain, worldBounds, normalizedCommonBounds} = state;

    if (!weightsTexture || !maxWeightsTexture || !worldBounds || !normalizedCommonBounds) return null;

    const densityViewport = this._getDensityViewport();
    if (!densityViewport) return null;

    const props = this.props as any;
    const {updateTriggers, intensity, threshold, aggregation, levelCount, levels, bandColors, lineColors, showFill, showLines, lineWidthPx} = props;

    const resolution = (this.context.viewport as any).resolution;
    const meshKey = `${worldBounds.join(',')}|${resolution}`;
    if (!this._globeIsolineMesh || this._globeIsolineMeshKey !== meshKey) {
      this._globeIsolineMesh = createGlobeIsolineMesh(worldBounds, normalizedCommonBounds, densityViewport, resolution);
      this._globeIsolineMeshKey = meshKey;
    }

    const GlobeLayerClass = this.getSubLayerClass('globe-isoline-triangle', IsolineGlobeTriangleLayer);
    return new GlobeLayerClass(
      this.getSubLayerProps({id: 'globe-isoline-triangle', updateTriggers}),
      {
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        data: {length: 1},
        mesh: this._globeIsolineMesh,
        maxTexture: maxWeightsTexture,
        weightsTexture,
        aggregationMode: aggregation === 'MEAN' ? 1 : 0,
        colorDomain: colorDomain ?? [0, 0],
        intensity: intensity ?? 1,
        threshold: threshold ?? 0.001,
        levelCount: levelCount ?? 0,
        levels: levels ?? [],
        bandColors: bandColors ?? [],
        lineColors: lineColors ?? [],
        showFill: showFill !== false,
        showLines: showLines !== false,
        lineWidthPx: lineWidthPx ?? 1.5
      }
    );
  }
}

// ---------------------------------------------------------------------------
// Globe mesh builder
// ---------------------------------------------------------------------------

function getTexCoord(
  densityViewport: any,
  normalizedCommonBounds: [number, number, number, number],
  lng: number,
  lat: number
): [number, number] {
  const common = densityViewport.projectPosition([lng, lat, 0]);
  const [xMin, yMin, xMax, yMax] = normalizedCommonBounds;
  return [(common[0] - xMin) / (xMax - xMin), (common[1] - yMin) / (yMax - yMin)];
}

function createGlobeIsolineMesh(
  worldBounds: [number, number, number, number],
  normalizedCommonBounds: [number, number, number, number],
  densityViewport: any,
  resolution?: number
): IsolineMesh {
  const [minLng, minLat, maxLng, maxLat] = worldBounds;

  if (!resolution) {
    const corners = [[minLng, minLat], [minLng, maxLat], [maxLng, maxLat], [maxLng, minLat]];
    const positions = new Float64Array(12);
    const texCoords = new Float32Array(8);
    for (let i = 0; i < corners.length; i++) {
      positions[i * 3] = corners[i][0]; positions[i * 3 + 1] = corners[i][1]; positions[i * 3 + 2] = 0;
      const tc = getTexCoord(densityViewport, normalizedCommonBounds, corners[i][0], corners[i][1]);
      texCoords[i * 2] = tc[0]; texCoords[i * 2 + 1] = tc[1];
    }
    return {positions, texCoords, indices: new Uint32Array([0, 2, 1, 0, 3, 2]), vertexCount: 6};
  }

  const lngSpan = Math.abs(maxLng - minLng);
  const latSpan = Math.abs(maxLat - minLat);
  const uCount = Math.max(2, Math.ceil(lngSpan / resolution) + 1);
  const vCount = Math.max(2, Math.ceil(latSpan / resolution) + 1);
  const vertexCount = (uCount - 1) * (vCount - 1) * 6;
  const indices = new Uint32Array(vertexCount);
  const texCoords = new Float32Array(uCount * vCount * 2);
  const positions = new Float64Array(uCount * vCount * 3);

  let vertex = 0, index = 0;
  for (let u = 0; u < uCount; u++) {
    for (let v = 0; v < vCount; v++) {
      const lng = minLng + (u / (uCount - 1)) * (maxLng - minLng);
      const lat = minLat + (v / (vCount - 1)) * (maxLat - minLat);
      positions[vertex * 3] = lng; positions[vertex * 3 + 1] = lat; positions[vertex * 3 + 2] = 0;
      const tc = getTexCoord(densityViewport, normalizedCommonBounds, lng, lat);
      texCoords[vertex * 2] = tc[0]; texCoords[vertex * 2 + 1] = tc[1];
      if (u > 0 && v > 0) {
        indices[index++] = vertex - vCount; indices[index++] = vertex - vCount - 1;
        indices[index++] = vertex - 1; indices[index++] = vertex - vCount;
        indices[index++] = vertex - 1; indices[index++] = vertex;
      }
      vertex++;
    }
  }
  return {positions, texCoords, indices, vertexCount};
}
