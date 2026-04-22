// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GridLayer, GridLayerPickingInfo} from '@deck.gl/aggregation-layers';
import {GetPickingInfoParams, PickingInfo, Viewport} from '@deck.gl/core';
import {buildAggregatedBinMap} from '../layer-utils/aggregation-utils';

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
  // (see https://github.com/keplergl/kepler.gl/issues/3381).
  //
  // deck.gl does not expose a public hook for post-aggregation data, and props
  // are Object.freeze()'d so we cannot suppress the parent's callback.  Instead
  // we let the parent fire its [min, max] call, then immediately fire a second
  // enriched call with per-bin values (aggregatedBins) and, for quantile scale,
  // the full sorted domain.  The second call overwrites the first downstream in
  // _onLayerSetDomain.
  //
  // This can be removed once deck.gl exposes a richer post-aggregation callback
  // or makes _onAggregationUpdate / AttributeWithScale part of the public API.
  _onAggregationUpdate({channel}: {channel: number}) {
    (GridLayer.prototype as any)._onAggregationUpdate.call(this, {channel});

    if (channel === 0) {
      const props = (this as any).getCurrentLayer().props;
      const {aggregator} = this.state as any;
      const result = aggregator.getResult(0);
      const binValues = result?.value;
      if (binValues && aggregator.binCount > 0) {
        const domain = aggregator.getResultDomain(0);
        const aggregatedBins = buildAggregatedBinMap(binValues, aggregator.binCount);
        let enrichedDomain = domain;
        if (props.colorScaleType === 'quantile') {
          enrichedDomain = Array.from(binValues as Float32Array)
            .slice(0, aggregator.binCount)
            .filter(Number.isFinite)
            .sort((a: number, b: number) => a - b);
        }
        props.onSetColorDomain({domain: enrichedDomain, aggregatedBins});
      }
    }
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
