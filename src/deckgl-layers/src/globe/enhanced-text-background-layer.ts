// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Copy of EnhancedMultiIconLayer for deck.gl's text-background sublayer. Same inject,
// different base class, so far-side label backgrounds are culled with the glyphs.
// @ts-ignore _TextBackgroundLayer is an experimental, underscore-prefixed deck.gl export whose named type binding isn't reliably resolvable through the package barrel under this project's module resolution. Access it off the namespace with a loose type.
import {_TextBackgroundLayer as TextBackgroundLayer} from '@deck.gl/layers';

import {injectGlobeBackfaceCull} from './globe-backface-cull';

export default class EnhancedTextBackgroundLayer extends (TextBackgroundLayer as any) {
  static layerName = 'EnhancedTextBackgroundLayer';

  getShaders() {
    return injectGlobeBackfaceCull(super.getShaders());
  }
}
