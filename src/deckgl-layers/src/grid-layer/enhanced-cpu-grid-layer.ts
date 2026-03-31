// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GridLayer, GridLayerPickingInfo} from '@deck.gl/aggregation-layers';
import {GetPickingInfoParams, PickingInfo, Viewport} from '@deck.gl/core';

interface GridInternalState {
  cellOriginCommon?: [number, number];
  cellSizeCommon?: [number, number];
  aggregatorViewport?: Viewport & {unprojectFlat(xy: number[]): number[]};
}

interface GridPickingObject {
  col: number;
  row: number;
  cellOutline?: number[][];
  [key: string]: unknown;
}

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

  getPickingInfo(params: GetPickingInfoParams): PickingInfo {
    const info = super.getPickingInfo(params) as GridLayerPickingInfo<Record<string, unknown>>;
    if (info.object) {
      const {cellOriginCommon, cellSizeCommon, aggregatorViewport} = this
        .state as unknown as GridInternalState;
      const coverage = this.props.coverage ?? 1;
      if (!cellOriginCommon || !cellSizeCommon || !aggregatorViewport) {
        console.error(
          'ScaleEnhancedGridLayer: expected internal state properties ' +
            '(cellOriginCommon, cellSizeCommon, aggregatorViewport) are missing. ' +
            'Hover outline will not be shown. This may indicate a deck.gl version change.'
        );
        return info;
      }
      const {col, row} = info.object as GridPickingObject;
      if (typeof col !== 'number' || typeof row !== 'number') return info;
      const cx = (col + 0.5) * cellSizeCommon[0] + cellOriginCommon[0];
      const cy = (row + 0.5) * cellSizeCommon[1] + cellOriginCommon[1];
      const hw = 0.5 * coverage * cellSizeCommon[0];
      const hh = 0.5 * coverage * cellSizeCommon[1];

      (info.object as GridPickingObject).cellOutline = [
        aggregatorViewport.unprojectFlat([cx - hw, cy - hh]),
        aggregatorViewport.unprojectFlat([cx + hw, cy - hh]),
        aggregatorViewport.unprojectFlat([cx + hw, cy + hh]),
        aggregatorViewport.unprojectFlat([cx - hw, cy + hh]),
        aggregatorViewport.unprojectFlat([cx - hw, cy - hh])
      ];
    }
    return info;
  }
}

ScaleEnhancedGridLayer.layerName = 'ScaleEnhancedGridLayer';
