// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-ignore _MultiIconLayer is an experimental, underscore-prefixed deck.gl export whose named type binding isn't reliably resolvable through the package barrel under this project's module resolution. Access it off the namespace with a loose type.
import {_MultiIconLayer as MultiIconLayer} from '@deck.gl/layers';

import {injectGlobeBackfaceCull} from './globe-backface-cull';

export default class EnhancedMultiIconLayer extends (MultiIconLayer as any) {
  static layerName = 'EnhancedMultiIconLayer';

  getShaders() {
    return injectGlobeBackfaceCull(super.getShaders());
  }
}
