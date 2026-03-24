// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HexagonLayer} from '@deck.gl/aggregation-layers';

/**
 * In deck.gl 9, HexagonLayer natively supports CPU aggregation via gpuAggregation: false,
 * custom getColorValue/getElevationValue accessors, percentile filtering, and scale types.
 * The custom CPUAggregator override from deck.gl 8 is no longer needed.
 */
export default class ScaleEnhancedHexagonLayer extends HexagonLayer<any> {
  static defaultProps = {
    ...HexagonLayer.defaultProps,
    gpuAggregation: false
  };
}

ScaleEnhancedHexagonLayer.layerName = 'ScaleEnhancedHexagonLayer';
