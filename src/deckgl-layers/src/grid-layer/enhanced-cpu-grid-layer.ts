// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GridLayer} from '@deck.gl/aggregation-layers';

/**
 * In deck.gl 9, GridLayer natively supports CPU aggregation via gpuAggregation: false,
 * custom getColorValue/getElevationValue accessors, percentile filtering, and scale types.
 * The custom CPUAggregator override from deck.gl 8 is no longer needed.
 */
export default class ScaleEnhancedGridLayer extends GridLayer<any> {
  static defaultProps = {
    ...GridLayer.defaultProps,
    gpuAggregation: false
  };
}

ScaleEnhancedGridLayer.layerName = 'ScaleEnhancedGridLayer';
