// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HexagonLayer, HexagonLayerPickingInfo} from '@deck.gl/aggregation-layers';
import {GetPickingInfoParams, PickingInfo, Viewport} from '@deck.gl/core';
import {buildAggregatedBinMap, classifyBinsByCustomBreaks} from '../layer-utils/aggregation-utils';

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
// @ts-expect-error -- overriding private _onAggregationUpdate to enrich the onSetColorDomain callback
export default class ScaleEnhancedHexagonLayer extends HexagonLayer<any> {
  static defaultProps = {
    ...HexagonLayer.defaultProps,
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
    (HexagonLayer.prototype as any)._onAggregationUpdate.call(this, {channel});

    if (channel === 0) {
      const props = (this as any).getCurrentLayer().props;
      const {aggregator} = this.state as any;
      const result = aggregator.getResult(0);
      const binValues = result?.value as Float32Array | undefined;
      if (binValues && aggregator.binCount > 0) {
        // Snapshot raw values so renderLayers() can re-classify when colorMap changes.
        this.setState({rawColorBinValues: Float32Array.from(binValues.subarray(0, aggregator.binCount))});

        const domain = aggregator.getResultDomain(0);
        const aggregatedBins = buildAggregatedBinMap(binValues, aggregator.binCount);

        if (props.colorMap) {
          classifyBinsByCustomBreaks(
            (this.state as any).colors, aggregator.binCount, props.colorMap, binValues
          );
        }

        let enrichedDomain = domain;
        if (props.colorScaleType === 'quantile') {
          enrichedDomain = Array.from(binValues)
            .slice(0, aggregator.binCount)
            .filter(Number.isFinite)
            .sort((a: number, b: number) => a - b);
        }
        props.onSetColorDomain({domain: enrichedDomain, aggregatedBins});
      }
    }
  }

  renderLayers() {
    // Re-classify when custom colorMap changes between renders without re-aggregation.
    const props = (this as any).getCurrentLayer().props;
    const {colors, rawColorBinValues, aggregator} = this.state as any;
    if (
      props.colorMap &&
      colors &&
      rawColorBinValues &&
      aggregator?.binCount > 0
    ) {
      classifyBinsByCustomBreaks(colors, aggregator.binCount, props.colorMap, rawColorBinValues);
    }
    return (HexagonLayer.prototype as any).renderLayers.call(this);
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
