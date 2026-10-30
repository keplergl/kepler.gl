// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {findDefaultColorFieldWithValues} from '@kepler.gl/utils';
import type {KeplerTable} from '@kepler.gl/table';
import type Layer from './base-layer';

/** Apply optional color defaults only when initializing a new layer. */
export function applyDefaultColorField(
  layer: Layer,
  dataset: KeplerTable,
  channel = 'color'
): void {
  const previousConfig = layer.config;
  const {field} = layer.visualChannels[channel];
  if (previousConfig[field]) {
    return;
  }

  try {
    const colorField = findDefaultColorFieldWithValues(dataset);
    if (colorField) {
      layer.updateLayerConfig({[field]: colorField});
      layer.updateLayerVisualChannel(dataset, channel);
    }
  } catch {
    // Automatic coloring must not prevent initialization or leave a partial domain.
    layer.config = previousConfig;
  }
}
