// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Piecewise-linear mapping utilities for non-linear slider behavior.
 *
 * When a slider's useful values are concentrated in a sub-range, these functions
 * allow that sub-range (the "focus range") to occupy a larger fraction of the
 * slider's physical width, giving finer control over sensitive values.
 *
 * The slider is split into up to three zones:
 *   [min, focusMin] — "before" zone
 *   [focusMin, focusMax] — "focus" zone (gets focusWeight of the width)
 *   [focusMax, max] — "after" zone
 *
 * The before and after zones share (1 - focusWeight) proportionally to their
 * value span relative to the total non-focus span.
 */

export type SliderScaleConfig = {
  focusRange: [number, number];
  focusWeight: number;
};

/**
 * Computes the position-space boundaries for the three zones.
 * Returns [beforeEnd, focusEnd] where:
 *   before zone occupies [0, beforeEnd]
 *   focus zone occupies [beforeEnd, focusEnd]
 *   after zone occupies [focusEnd, 1]
 */
function getZoneBoundaries(
  min: number,
  max: number,
  config: SliderScaleConfig
): [number, number] {
  const {focusRange, focusWeight} = config;
  const [focusMin, focusMax] = focusRange;

  const beforeSpan = Math.max(0, focusMin - min);
  const afterSpan = Math.max(0, max - focusMax);
  const nonFocusSpan = beforeSpan + afterSpan;

  // When focusRange covers the entire slider span, treat as full-width focus (linear)
  if (nonFocusSpan === 0) {
    return [0, 1];
  }

  const nonFocusWeight = 1 - focusWeight;
  const beforeWeight = (beforeSpan / nonFocusSpan) * nonFocusWeight;

  const beforeEnd = beforeWeight;
  const focusEnd = beforeWeight + focusWeight;

  return [beforeEnd, focusEnd];
}

/**
 * Maps a real value to a normalized position [0, 1] using piecewise-linear scaling.
 */
export function valueToPosition(
  value: number,
  min: number,
  max: number,
  config: SliderScaleConfig
): number {
  const {focusRange} = config;
  const [focusMin, focusMax] = focusRange;

  if (max === min) return 0;

  const v = Math.max(min, Math.min(max, value));
  const [beforeEnd, focusEnd] = getZoneBoundaries(min, max, config);

  if (v < focusMin) {
    // Before zone: map [min, focusMin] -> [0, beforeEnd]
    const span = focusMin - min;
    if (span === 0) return 0;
    return ((v - min) / span) * beforeEnd;
  } else if (v <= focusMax) {
    // Focus zone: map [focusMin, focusMax] -> [beforeEnd, focusEnd]
    const span = focusMax - focusMin;
    if (span === 0) return beforeEnd;
    return beforeEnd + ((v - focusMin) / span) * (focusEnd - beforeEnd);
  } else {
    // After zone: map [focusMax, max] -> [focusEnd, 1]
    const span = max - focusMax;
    if (span === 0) return 1;
    return focusEnd + ((v - focusMax) / span) * (1 - focusEnd);
  }
}

/**
 * Maps a normalized position [0, 1] back to a real value using piecewise-linear scaling.
 * Inverse of valueToPosition.
 */
export function positionToValue(
  position: number,
  min: number,
  max: number,
  config: SliderScaleConfig
): number {
  const {focusRange} = config;
  const [focusMin, focusMax] = focusRange;

  if (max === min) return min;

  const p = Math.max(0, Math.min(1, position));
  const [beforeEnd, focusEnd] = getZoneBoundaries(min, max, config);

  if (p < beforeEnd) {
    // Before zone: map [0, beforeEnd] -> [min, focusMin]
    const span = focusMin - min;
    if (beforeEnd === 0) return min;
    return min + (p / beforeEnd) * span;
  } else if (p <= focusEnd) {
    // Focus zone: map [beforeEnd, focusEnd] -> [focusMin, focusMax]
    const span = focusMax - focusMin;
    const zoneWeight = focusEnd - beforeEnd;
    if (zoneWeight === 0) return focusMin;
    return focusMin + ((p - beforeEnd) / zoneWeight) * span;
  } else {
    // After zone: map [focusEnd, 1] -> [focusMax, max]
    const span = max - focusMax;
    const zoneWeight = 1 - focusEnd;
    if (zoneWeight === 0) return max;
    return focusMax + ((p - focusEnd) / zoneWeight) * span;
  }
}

/**
 * Creates a scale config object if valid focus parameters are provided.
 * Returns null if no focus config is provided, indicating linear behavior.
 */
export function createSliderScale(
  focusRange?: [number, number],
  focusWeight?: number
): SliderScaleConfig | null {
  if (
    !focusRange ||
    focusWeight == null ||
    !Number.isFinite(focusWeight) ||
    !Number.isFinite(focusRange[0]) ||
    !Number.isFinite(focusRange[1]) ||
    focusWeight <= 0 ||
    focusWeight >= 1
  ) {
    return null;
  }
  return {focusRange, focusWeight};
}
