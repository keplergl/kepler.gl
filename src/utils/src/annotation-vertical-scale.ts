// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {AnnotationVerticalScale} from '@kepler.gl/types';
import {ELEVATION_UNIT_METERS} from './annotation-elevation';

export const DEFAULT_ANNOTATION_VERTICAL_SCALE: Readonly<AnnotationVerticalScale> = {
  min: 0,
  max: 1000,
  tickSpacing: 250,
  unit: 'm',
  precision: 0
};

/** Bound geometry and text work before allocating tick arrays. */
export function normalizeAnnotationVerticalScale(
  value: unknown
): AnnotationVerticalScale | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const scale = value as AnnotationVerticalScale;
  const {min, max, tickSpacing, unit, precision, displayMin, displayMax} = scale;
  if (
    ![min, max, tickSpacing].every(Number.isFinite) ||
    max <= min ||
    tickSpacing <= 0 ||
    !['m', 'km', 'ft'].includes(unit) ||
    !Number.isInteger(precision) ||
    precision < 0 ||
    precision > 6
  )
    return undefined;
  const intervals = (max - min) / tickSpacing;
  if (!Number.isFinite(intervals) || Math.ceil(intervals) > 100 || min + tickSpacing === min)
    return undefined;
  if ((displayMin === undefined) !== (displayMax === undefined)) return undefined;
  const bottom = displayMin ?? min * ELEVATION_UNIT_METERS[unit];
  const top = displayMax ?? max * ELEVATION_UNIT_METERS[unit];
  if (
    !Number.isFinite(bottom) ||
    !Number.isFinite(top) ||
    top <= bottom ||
    !Number.isFinite(top - bottom)
  )
    return undefined;
  return {
    min,
    max,
    tickSpacing,
    unit,
    precision,
    ...(displayMin !== undefined ? {displayMin, displayMax} : {})
  };
}

export function getAnnotationVerticalScaleTicks(scale: AnnotationVerticalScale) {
  const normalized = normalizeAnnotationVerticalScale(scale);
  if (!normalized) return [];
  const {min, max, tickSpacing, unit, precision} = normalized;
  const bottom = normalized.displayMin ?? min * ELEVATION_UNIT_METERS[unit];
  const top = normalized.displayMax ?? max * ELEVATION_UNIT_METERS[unit];
  const count = Math.floor((max - min) / tickSpacing);
  const values = Array.from({length: count + 1}, (_, i) => min + i * tickSpacing);
  // The top is always an endpoint, even when the interval does not divide the range.
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(min), Math.abs(max)) * 4;
  if (Math.abs(values[values.length - 1] - max) <= tolerance) values[values.length - 1] = max;
  else values.push(max);
  return values.map(value => ({
    value,
    height: bottom + ((value - min) / (max - min)) * (top - bottom),
    label: `${value.toFixed(precision)} ${unit}`
  }));
}
