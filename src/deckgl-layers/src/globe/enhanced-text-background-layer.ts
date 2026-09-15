// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-ignore _TextBackgroundLayer is an experimental, underscore-prefixed deck.gl export whose named type binding isn't reliably resolvable through the package barrel under this project's module resolution. Access it off the namespace with a loose type.
import {_TextBackgroundLayer as TextBackgroundLayer} from '@deck.gl/layers';

import {injectGlobeBackfaceCull} from './globe-backface-cull';

/**
 * Background sublayer for globe-mode text labels. The glyphs are culled on the far side
 * of the globe by EnhancedMultiIconLayer; without the same treatment here the background
 * quad of a far-side label would still show through the planet as an empty box.
 */
export default class EnhancedTextBackgroundLayer extends (TextBackgroundLayer as any) {
  static layerName = 'EnhancedTextBackgroundLayer';

  getShaders() {
    return injectGlobeBackfaceCull(super.getShaders());
  }
}
