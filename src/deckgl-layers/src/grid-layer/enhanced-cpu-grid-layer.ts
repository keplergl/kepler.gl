// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GridLayer} from '@deck.gl/aggregation-layers';

/**
 * In deck.gl 9, GridLayer natively supports CPU aggregation via gpuAggregation: false,
 * custom getColorValue/getElevationValue accessors, percentile filtering, and scale types.
 * The custom CPUAggregator override from deck.gl 8 is no longer needed.
 *
 * We override getPickingInfo to add `cellOutline` — an array of [lng, lat] coordinates
 * computed in common space so the outline aligns with rendered cells at all latitudes.
 */
export default class ScaleEnhancedGridLayer extends GridLayer<any> {
  static defaultProps = {
    ...GridLayer.defaultProps,
    gpuAggregation: false
  };

  getPickingInfo(params: any) {
    const info = super.getPickingInfo(params);
    if (info.object) {
      const {cellOriginCommon, cellSizeCommon, aggregatorViewport} = this.state as any;
      const coverage = this.props.coverage ?? 1;
      if (cellOriginCommon && cellSizeCommon && aggregatorViewport) {
        const {col, row} = info.object;
        // Cell center in common space
        const cx = (col + 0.5) * cellSizeCommon[0] + cellOriginCommon[0];
        const cy = (row + 0.5) * cellSizeCommon[1] + cellOriginCommon[1];
        const hw = 0.5 * coverage * cellSizeCommon[0]; // half-width
        const hh = 0.5 * coverage * cellSizeCommon[1]; // half-height

        info.object.cellOutline = [
          aggregatorViewport.unprojectFlat([cx - hw, cy - hh]),
          aggregatorViewport.unprojectFlat([cx + hw, cy - hh]),
          aggregatorViewport.unprojectFlat([cx + hw, cy + hh]),
          aggregatorViewport.unprojectFlat([cx - hw, cy + hh]),
          aggregatorViewport.unprojectFlat([cx - hw, cy - hh])
        ];
      }
    }
    return info;
  }
}

ScaleEnhancedGridLayer.layerName = 'ScaleEnhancedGridLayer';
