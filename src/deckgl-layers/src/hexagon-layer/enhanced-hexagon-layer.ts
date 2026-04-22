// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HexagonLayer, HexagonLayerPickingInfo} from '@deck.gl/aggregation-layers';
import {GetPickingInfoParams, PickingInfo, Viewport} from '@deck.gl/core';
import {buildAggregatedBinMap} from '../layer-utils/aggregation-utils';

const THIRD_PI = Math.PI / 3;
const HexbinVertices = Array.from({length: 6}, (_, i) => {
  const angle = i * THIRD_PI;
  return [Math.sin(angle), -Math.cos(angle)];
});

function getHexbinCentroid(id: [number, number], radius: number): [number, number] {
  const DIST_X = 2 * Math.sin(THIRD_PI);
  const DIST_Y = 1.5;
  return [(id[0] + (id[1] & 1) / 2) * radius * DIST_X, id[1] * radius * DIST_Y];
}

interface HexInternalState {
  radiusCommon?: number;
  hexOriginCommon?: [number, number];
  aggregatorViewport?: Viewport & {unprojectFlat(xy: number[]): number[]};
}

interface HexPickingObject {
  col: number;
  row: number;
  cellOutline?: number[][];
  [key: string]: unknown;
}

/**
 * In deck.gl 9, HexagonLayer natively supports CPU aggregation via gpuAggregation: false,
 * custom getColorValue/getElevationValue accessors, percentile filtering, and scale types.
 *
 * We override getPickingInfo to add `cellOutline` — an array of [lng, lat] coordinates
 * computed in common space so the outline aligns with rendered cells at all latitudes.
 *
 * We also override _onAggregationUpdate to send per-bin aggregated values through
 * onSetColorDomain so the legend can compute proper quantile/custom breaks.
 */
export default class ScaleEnhancedHexagonLayer extends HexagonLayer<any> {
  static defaultProps = {
    ...HexagonLayer.defaultProps,
    gpuAggregation: false
  };

  _onAggregationUpdate({channel}: {channel: number}) {
    // Delegate to the parent which handles internal state (AttributeWithScale)
    // and fires onSetColorDomain with [min, max].
    (HexagonLayer.prototype as any)._onAggregationUpdate.call(this, {channel});

    if (channel === 0) {
      // The parent already called onSetColorDomain([min, max]).
      // Now fire it again with the enriched format {domain, aggregatedBins}
      // so the legend can compute proper quantile breaks from the full bin data.
      const props = (this as any).getCurrentLayer().props;
      const {aggregator} = this.state as any;
      const result = aggregator.getResult(0);
      const binValues = result?.value;
      if (binValues && aggregator.binCount > 0) {
        const domain = aggregator.getResultDomain(0);
        const aggregatedBins = buildAggregatedBinMap(binValues, aggregator.binCount);
        // For quantile scale, pass the full sorted array of bin values as domain
        // so d3.scaleQuantile can compute proper quantile breaks.
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
    const info = super.getPickingInfo(params) as HexagonLayerPickingInfo<Record<string, unknown>>;
    if (info.object) {
      const {radiusCommon, hexOriginCommon, aggregatorViewport} = this
        .state as unknown as HexInternalState;
      const coverage = this.props.coverage ?? 1;
      if (!radiusCommon || !aggregatorViewport) {
        console.error(
          'ScaleEnhancedHexagonLayer: expected internal state properties ' +
            '(radiusCommon, aggregatorViewport) are missing. ' +
            'Hover outline will not be shown. This may indicate a deck.gl version change.'
        );
        return info;
      }
      const {col, row} = info.object as HexPickingObject;
      if (typeof col !== 'number' || typeof row !== 'number') return info;
      const centroid = getHexbinCentroid([col, row], radiusCommon);
      const ox = hexOriginCommon?.[0] ?? 0;
      const oy = hexOriginCommon?.[1] ?? 0;
      const r = radiusCommon * coverage;

      const outline: number[][] = [];
      for (let i = 0; i < 6; i++) {
        const vx = centroid[0] + r * HexbinVertices[i][0] + ox;
        const vy = centroid[1] + r * HexbinVertices[i][1] + oy;
        outline.push(aggregatorViewport.unprojectFlat([vx, vy]));
      }
      outline.push(outline[0]);
      (info.object as HexPickingObject).cellOutline = outline;
    }
    return info;
  }
}

ScaleEnhancedHexagonLayer.layerName = 'ScaleEnhancedHexagonLayer';
