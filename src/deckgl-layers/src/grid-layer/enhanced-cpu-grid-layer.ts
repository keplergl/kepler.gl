// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GridLayer, GridLayerPickingInfo} from '@deck.gl/aggregation-layers';
import {GetPickingInfoParams, Layer, PickingInfo, Viewport} from '@deck.gl/core';
import {enrichedAggregationUpdate, enrichedRenderLayers} from '../layer-utils/aggregation-utils';
import {
  makeGlobeCellLayerClass,
  runBinOptionsWithMercatorViewport
} from '../layer-utils/globe-cell-utils';

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
 *
 * We also override _onAggregationUpdate to send per-bin aggregated values through
 * onSetColorDomain so the legend can compute proper quantile/custom breaks.
 */
// @ts-expect-error -- overriding private _onAggregationUpdate to enrich the onSetColorDomain callback
export default class ScaleEnhancedGridLayer extends GridLayer<any> {
  static defaultProps = {
    ...GridLayer.defaultProps,
    gpuAggregation: false
  };

  // HACK: deck.gl 9's _onAggregationUpdate is private and its onSetColorDomain
  // callback only provides [min, max].  That is sufficient for quantize/linear
  // scales but d3.scaleQuantile needs the *full sorted array* of bin values to
  // compute correct break points — without it the legend labels are wrong
  _onAggregationUpdate({channel}: {channel: number}) {
    enrichedAggregationUpdate(this, GridLayer, channel);
  }

  renderLayers() {
    return enrichedRenderLayers(this, GridLayer);
  }

  // In globe mode, run deck.gl's bin/common-space setup under a WebMercatorViewport
  // so binning and the cell shader's flat common space are genuine Web Mercator, which
  // the globe cell subclass then remaps onto the sphere surface. No-op in 2D/3D mode.
  _updateBinOptions() {
    runBinOptionsWithMercatorViewport(this, () =>
      (GridLayer.prototype as any)._updateBinOptions.call(this)
    );
  }

  // deck.gl's GridCellLayer positions cells in flat common space, which lands them
  // on the XY plane through the globe center. Swap in a globe-aware subclass that
  // curves cells onto the sphere surface (no-op in 2D/3D mode).
  getSubLayerClass<T extends Layer>(subLayerId: string, DefaultLayerClass: {new (...args: any[]): T}) {
    const resolved = super.getSubLayerClass(subLayerId, DefaultLayerClass);
    if (subLayerId === 'cells') {
      return makeGlobeCellLayerClass(
        resolved as unknown as {new (...args: any[]): T},
        'grid'
      ) as unknown as {
        new (...args: any[]): T;
      };
    }
    return resolved;
  }

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
