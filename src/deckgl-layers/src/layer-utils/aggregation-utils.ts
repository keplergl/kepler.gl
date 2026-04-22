// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {AggregatedBin} from '@kepler.gl/types';

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
