// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {AnnotationElevation, ElevationUnit} from '@kepler.gl/types';

export const ELEVATION_UNIT_METERS: Readonly<Record<ElevationUnit, number>> = {
  m: 1,
  km: 1000,
  ft: 0.3048
};

export const DEFAULT_ANNOTATION_ELEVATION: Readonly<AnnotationElevation> = {
  value: null,
  unit: 'm',
  datum: 'unknown',
  reference: null,
  display: 'altitude',
  outputUnit: 'km',
  precision: 2,
  guide: 'dashed',
  marker: 'ring'
};

const isUnit = (value: unknown): value is ElevationUnit =>
  value === 'm' || value === 'km' || value === 'ft';
const isDatum = (value: unknown): value is string =>
  typeof value === 'string' && Boolean(value.trim()) && value.length <= 64;

/** Invalid measurements never become zero or an inferred datum. */
export function normalizeAnnotationElevation(value: unknown): AnnotationElevation | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as AnnotationElevation;
  if (
    !(input.value === null || (typeof input.value === 'number' && Number.isFinite(input.value))) ||
    !isUnit(input.unit) ||
    !isDatum(input.datum) ||
    !isUnit(input.outputUnit) ||
    !Number.isInteger(input.precision) ||
    input.precision < 0 ||
    input.precision > 6 ||
    !['altitude', 'relative', 'both'].includes(input.display) ||
    !['none', 'solid', 'dashed'].includes(input.guide) ||
    !['none', 'dot', 'ring'].includes(input.marker)
  )
    return undefined;
  const reference = input.reference;
  if (
    reference !== null &&
    (!reference ||
      typeof reference.value !== 'number' ||
      !Number.isFinite(reference.value) ||
      !isUnit(reference.unit) ||
      !isDatum(reference.datum) ||
      (reference.displayZ !== undefined && !Number.isFinite(reference.displayZ)))
  )
    return undefined;
  const field = input.field;
  if (
    field !== undefined &&
    (!field ||
      typeof field.dataId !== 'string' ||
      !field.dataId.trim() ||
      typeof field.name !== 'string' ||
      !field.name.trim())
  )
    return undefined;
  return {
    value: input.value,
    unit: input.unit,
    datum: input.datum.trim(),
    ...(field ? {field: {dataId: field.dataId, name: field.name}} : {}),
    reference: reference
      ? {
          value: reference.value,
          unit: reference.unit,
          datum: reference.datum.trim(),
          ...(reference.displayZ !== undefined ? {displayZ: reference.displayZ} : {})
        }
      : null,
    display: input.display,
    outputUnit: input.outputUnit,
    precision: input.precision,
    guide: input.guide,
    marker: input.marker
  };
}

export function getElevationReferenceStatus(elevation: AnnotationElevation): string | null {
  if (!elevation.reference) return 'Ground reference unavailable';
  if (
    elevation.datum.toLowerCase() === 'unknown' ||
    elevation.reference.datum.toLowerCase() === 'unknown'
  ) {
    return 'Vertical datum unknown';
  }
  if (elevation.datum.toLowerCase() !== elevation.reference.datum.toLowerCase()) {
    return 'Vertical references do not match';
  }
  return null;
}

export function getAnnotationElevationLabels(elevation: AnnotationElevation): string[] {
  const {value, unit, datum, reference, outputUnit, precision, display} = elevation;
  const meters = value === null ? null : value * ELEVATION_UNIT_METERS[unit];
  const format = (height: number) =>
    `${(height / ELEVATION_UNIT_METERS[outputUnit]).toFixed(precision)} ${outputUnit}`;
  const labels: string[] = [];
  if (display !== 'relative') {
    labels.push(
      meters === null || !Number.isFinite(meters)
        ? 'Elevation unavailable'
        : `${format(meters)} ${
            datum.toLowerCase() === 'unknown'
              ? '(vertical datum unknown)'
              : `above ${datum.toUpperCase() === 'MSL' ? 'sea level' : datum}`
          }`
    );
  }
  if (display !== 'altitude') {
    const status = getElevationReferenceStatus(elevation);
    const difference =
      meters === null || !reference
        ? null
        : meters - reference.value * ELEVATION_UNIT_METERS[reference.unit];
    labels.push(
      status ??
        (difference === null || !Number.isFinite(difference)
          ? 'Elevation unavailable'
          : `${format(difference)} above reference`)
    );
  }
  if (display === 'altitude' && elevation.guide !== 'none') {
    const status = getElevationReferenceStatus(elevation);
    if (status) labels.push(status);
  }
  return labels;
}
