// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {AggregatedBin, ColorMap} from '@kepler.gl/types';

/**
 * Build a Record<index, AggregatedBin> from the raw Float32Array of per-bin
 * aggregated values returned by deck.gl 9's CPUAggregator/WebGLAggregator.
 * The resulting map is compatible with the format kepler.gl expects for
 * histogram rendering and color-scale selector.
 */
export function buildAggregatedBinMap(
  binValues: ArrayLike<number>,
  binCount: number
): Record<number, AggregatedBin> {
  const bins: Record<number, AggregatedBin> = {};
  for (let i = 0; i < binCount; i++) {
    const val = binValues[i];
    if (Number.isFinite(val)) {
      bins[i] = {i, value: val, counts: 1};
    }
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
