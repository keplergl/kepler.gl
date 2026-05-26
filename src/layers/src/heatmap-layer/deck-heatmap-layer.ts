// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HeatmapLayer as DeckGLHeatmapLayer} from '@deck.gl/aggregation-layers';
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
 */
export default class KeplerHeatmapLayer extends DeckGLHeatmapLayer {
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
        result.modules = result.modules.filter(
          (m: any) => (m?.name || m) !== 'layer'
        );
      }
    }

    return result;
  }
}

KeplerHeatmapLayer.layerName = 'HeatmapLayer';
