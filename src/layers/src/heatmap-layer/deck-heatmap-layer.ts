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
 */
export default class KeplerHeatmapLayer extends DeckGLHeatmapLayer {
  getShaders(shaders: any) {
    const result = super.getShaders(shaders);

    if (shaders.fs?.includes('gaussianKDE')) {
      // Weights fragment shader: adjust kernel to match Mapbox heatmap layer
      let fs = editShader(
        result.fs,
        'fs',
        'return pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666);',
        `float value = pow(2.71828, -u*u/0.05555)/(1.77245385*0.166666) / 8.5;
          return max(value - 0.00443, 0.0);`
      );
      fs = editShader(fs, 'fs', '2. * dist', 'dist');
      result.fs = fs;
    } else if (shaders.fs?.includes('outTexture.r / max(1.0, outTexture.a)')) {
      // Max-weights fragment shader: force max value to 1.0
      result.fs = insertBefore(
        result.fs,
        'fs',
        'fragColor.g = outTexture.r / max(1.0, outTexture.a);',
        'fragColor.r = 1.0;\n  '
      );
    }

    return result;
  }
}

KeplerHeatmapLayer.layerName = 'HeatmapLayer';
