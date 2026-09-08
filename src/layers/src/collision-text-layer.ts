// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {console as Console} from 'global/window';
import {TextLayer, _TextBackgroundLayer as TextBackgroundLayer} from '@deck.gl/layers';
import type {FilterContext} from '@deck.gl/core';

/**
 * CollisionFilterExtension samples geometry.worldPosition (the geographic
 * anchor). Kepler's labels are shifted with getPixelOffset / non-centered
 * anchors, so that sample misses the glyphs and every label is culled.
 *
 * PointLabelLayer's approach: draw an expanded text background in the
 * collision pass so the hit area still covers the anchor, then hide that
 * background in the color pass.
 */
class CollisionTextBackgroundLayer extends TextBackgroundLayer {
  static layerName = 'CollisionTextBackgroundLayer';

  getShaders() {
    const shaders = super.getShaders();
    let vs = shaders.vs as string;
    if (!vs.includes('textBackground.padding.') || !vs.includes('void main(void) {')) {
      Console.error('Cannot edit text-background-layer shader for collision');
      return shaders;
    }
    vs = vs.split('textBackground.padding.').join('_padding.');
    vs = vs.replace(
      'void main(void) {',
      `void main(void) {
  vec4 _padding = textBackground.padding + instancePixelOffsets.xyxy * vec4(1.0, 1.0, -1.0, -1.0);`
    );
    return {...shaders, vs};
  }
}

export default class CollisionTextLayer<
  DataT = any,
  ExtraProps extends {} = {}
> extends TextLayer<DataT, ExtraProps> {
  static layerName = 'CollisionTextLayer';

  getSubLayerClass(subLayerId: string, DefaultLayerClass: any): any {
    if (subLayerId === 'background') {
      return CollisionTextBackgroundLayer;
    }
    return super.getSubLayerClass(subLayerId, DefaultLayerClass);
  }

  filterSubLayer({layer, renderPass}: FilterContext): boolean {
    const isBackground = layer.id.includes('background');
    if (renderPass === 'collision') {
      return isBackground;
    }
    return !isBackground;
  }
}
