// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {AggregatedBin, ColorMap} from '@kepler.gl/types';

/**
 * Build a Record<index, AggregatedBin> from the raw Float32Array of per-bin
 * aggregated values returned by deck.gl 9's CPUAggregator/WebGLAggregator.
 * The resulting map is compatible with the format kepler.gl expects for
 * histogram rendering and color-scale selector.
 */
/**
 * Histogram / custom-break UI does not need one object per cell. Building a
 * Record of ~2M bins and writing it through Redux freezes the map (~600ms).
 */
const MAX_AGGREGATED_BINS_FOR_UI = 8192;

export function buildAggregatedBinMap(
  binValues: ArrayLike<number>,
  binCount: number,
  aggregator?: any
): Record<number, AggregatedBin> {
  const bins: Record<number, AggregatedBin> = {};
  const counts: ArrayLike<number> | null | undefined =
    aggregator?.getBinCounts?.() ?? aggregator?.result?.counts;
  const stride =
    binCount > MAX_AGGREGATED_BINS_FOR_UI ? Math.ceil(binCount / MAX_AGGREGATED_BINS_FOR_UI) : 1;
  let j = 0;
  for (let i = 0; i < binCount; i += stride) {
    const val = binValues[i];
    const count = counts ? counts[i] : aggregator?.getBin?.(i)?.count ?? 0;
    bins[j] = {i: j, value: val, counts: count};
    j++;
  }
  return bins;
}

/**
 * Classify raw per-bin aggregated values into break indices according to
 * a custom colorMap, and patch the deck.gl internal `state.colors` so the
 * GPU shader renders the correct color for each bin.
 *
 * Custom breaks define thresholds [t0, t1, …, t_{N-2}] for N colors:
 *   color 0: value < t0
 *   color i: t_{i-1} <= value < t_i
 *   color N-1: value >= t_{N-2}
 *
 * We replace the values in `state.colors.attribute` / `state.colors.input`
 * with integer break indices [0 … N-1].  Combined with `colorScaleType: 'quantize'`
 * and `colorDomain: [0, N-1]`, the shader's linear interpolation maps each index
 * to the correct color texture pixel.
 *
 * `rawValues` must be the original aggregated values (not previously classified).
 */
export function classifyBinsByCustomBreaks(
  stateColors: any,
  binCount: number,
  colorMap: ColorMap,
  rawValues: Float32Array
): void {
  if (!rawValues || binCount === 0) return;

  const thresholds: number[] = [];
  for (const entry of colorMap) {
    if (typeof entry[0] === 'number' && Number.isFinite(entry[0])) {
      thresholds.push(entry[0]);
    }
  }
  thresholds.sort((a, b) => a - b);

  const numColors = colorMap.length;
  const classified = new Float32Array(rawValues.length);
  for (let i = 0; i < binCount; i++) {
    const v = rawValues[i];
    if (!Number.isFinite(v)) {
      classified[i] = NaN;
      continue;
    }
    let idx = numColors - 1;
    for (let t = 0; t < thresholds.length; t++) {
      if (v < thresholds[t]) {
        idx = t;
        break;
      }
    }
    classified[i] = idx;
  }
  for (let i = binCount; i < classified.length; i++) {
    classified[i] = NaN;
  }

  const classifiedAttr = {value: classified, type: 'float32', size: 1};
  stateColors.input = classifiedAttr;
  stateColors.attribute = classifiedAttr;
}

// ---------------------------------------------------------------------------
// Shared _onAggregationUpdate / renderLayers logic for ScaleEnhanced* layers
// ---------------------------------------------------------------------------
//
// deck.gl 9's _onAggregationUpdate is private and its onSetColorDomain
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

/**
 * Enriched _onAggregationUpdate implementation shared by ScaleEnhancedHexagonLayer
 * and ScaleEnhancedGridLayer.
 *
 * @param layer       The enhanced layer instance (`this`)
 * @param ParentClass The deck.gl parent class (HexagonLayer or GridLayer)
 * @param channel     The aggregation channel index passed by deck.gl
 */
export function enrichedAggregationUpdate(layer: any, ParentClass: any, channel: number): void {
  (ParentClass.prototype as any)._onAggregationUpdate.call(layer, {channel});

  if (channel !== 0) return;

  const props = layer.getCurrentLayer().props;
  const {aggregator} = layer.state;
  const result = aggregator.getResult(0);
  const binValues = result?.value as Float32Array | undefined;
  if (!binValues || aggregator.binCount <= 0) return;

  const binCount = aggregator.binCount;
  layer.setState({
    rawColorBinValues: binValues.length === binCount ? binValues : binValues.subarray(0, binCount)
  });

  if (props.colorMap) {
    classifyBinsByCustomBreaks(layer.state.colors, binCount, props.colorMap, binValues);
  }

  const domain = aggregator.getResultDomain(0);
  const colorScaleType = props.colorScaleType;
  const onSetColorDomain = props.onSetColorDomain;
  // Legend/Redux must not run in this frame: allocating ~2M bin objects and
  // dispatching them keeps the spinner up while the map ignores input.
  requestAnimationFrame(() => {
    const aggregatedBins = buildAggregatedBinMap(binValues, binCount, aggregator);
    let enrichedDomain: number[] | [number, number] = domain;
    if (colorScaleType === 'quantile') {
      enrichedDomain = Object.values(aggregatedBins)
        .map(b => b.value)
        .filter(Number.isFinite)
        .sort((a: number, b: number) => a - b);
    }
    onSetColorDomain?.({domain: enrichedDomain, aggregatedBins});
  });
}

export type DisplayedAggregationLayout = {
  cellSizeCommon?: [number, number];
  cellOriginCommon?: [number, number];
  radiusCommon?: number;
  hexOriginCommon?: [number, number];
};

/**
 * Layout used to draw the currently visible bins. While a worker job is in
 * flight this is the origin/size the last result was computed with, not the
 * layer's already-updated `cellSizeCommon` / `radiusCommon`.
 */
export function getDisplayedAggregationLayout(layer: any): DisplayedAggregationLayout {
  const displayed = layer.state?.aggregator?.displayedBinOptions as
    | DisplayedAggregationLayout
    | null
    | undefined;
  if (displayed) return displayed;
  return {
    cellSizeCommon: layer.state?.cellSizeCommon,
    cellOriginCommon: layer.state?.cellOriginCommon,
    radiusCommon: layer.state?.radiusCommon,
    hexOriginCommon: layer.state?.hexOriginCommon
  };
}

/**
 * Shared renderLayers() wrapper that re-classifies bins when custom colorMap
 * changes between renders without triggering a full re-aggregation.
 *
 * While async aggregation is pending, Grid/Hex cell layers must keep using the
 * binOptions that match the last bins. Cells are placed as `origin + col * size`;
 * drawing old col/row ids at the new worldUnitSize looks like the grid is
 * scaling around the origin.
 *
 * @param layer       The enhanced layer instance (`this`)
 * @param ParentClass The deck.gl parent class (HexagonLayer or GridLayer)
 * @returns The sublayers returned by the parent's renderLayers()
 */
export function enrichedRenderLayers(layer: any, ParentClass: any): any {
  const props = layer.getCurrentLayer().props;
  const {colors, rawColorBinValues, aggregator} = layer.state;
  if (props.colorMap && colors && rawColorBinValues && aggregator?.binCount > 0) {
    classifyBinsByCustomBreaks(colors, aggregator.binCount, props.colorMap, rawColorBinValues);
  }

  const displayed = aggregator?.displayedBinOptions as
    | DisplayedAggregationLayout
    | null
    | undefined;
  if (!displayed) {
    return (ParentClass.prototype as any).renderLayers.call(layer);
  }

  const saved = {
    cellSizeCommon: layer.state.cellSizeCommon,
    cellOriginCommon: layer.state.cellOriginCommon,
    radiusCommon: layer.state.radiusCommon,
    hexOriginCommon: layer.state.hexOriginCommon
  };
  if (displayed.cellSizeCommon) {
    layer.state.cellSizeCommon = displayed.cellSizeCommon;
    layer.state.cellOriginCommon = displayed.cellOriginCommon;
  }
  if (displayed.radiusCommon != null) {
    layer.state.radiusCommon = displayed.radiusCommon;
    layer.state.hexOriginCommon = displayed.hexOriginCommon;
  }
  try {
    return (ParentClass.prototype as any).renderLayers.call(layer);
  } finally {
    Object.assign(layer.state, saved);
  }
}
