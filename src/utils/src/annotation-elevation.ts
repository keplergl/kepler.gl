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

export const DEFAULT_MAP_HEIGHT_ELEVATION: Readonly<AnnotationElevation> = {
  ...DEFAULT_ANNOTATION_ELEVATION,
  source: 'map',
  outputUnit: 'm'
};

const isUnit = (value: unknown): value is ElevationUnit =>
  value === 'm' || value === 'km' || value === 'ft';
const isDatum = (value: unknown): value is string =>
  typeof value === 'string' && Boolean(value.trim()) && value.length <= 64;

/** Invalid measurements never become zero or an inferred datum. */
export function normalizeAnnotationElevation(
  value: unknown,
  anchorPoint?: readonly number[]
): AnnotationElevation | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as AnnotationElevation;
  if (
    (input.source !== undefined && !['map', 'measurement'].includes(input.source)) ||
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
  const terrain = reference?.source === 'terrain';
  if (
    reference !== null &&
    (!reference ||
      !(
        (typeof reference.value === 'number' && Number.isFinite(reference.value)) ||
        (terrain && reference.value === null)
      ) ||
      (reference.source !== undefined && !['manual', 'terrain'].includes(reference.source)) ||
      !isUnit(reference.unit) ||
      (terrain && reference.unit !== 'm') ||
      !isDatum(reference.datum) ||
      (reference.displayZ !== undefined && !Number.isFinite(reference.displayZ)) ||
      (terrain &&
        reference.coordinate !== undefined &&
        (!Array.isArray(reference.coordinate) ||
          reference.coordinate.length !== 2 ||
          !reference.coordinate.every(Number.isFinite))) ||
      (terrain &&
        reference.sourceId !== undefined &&
        (typeof reference.sourceId !== 'string' || !reference.sourceId.trim())))
  )
    return undefined;
  const staleTerrain =
    terrain &&
    anchorPoint &&
    (!reference?.coordinate ||
      reference.coordinate[0] !== anchorPoint[0] ||
      reference.coordinate[1] !== anchorPoint[1]);
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
    ...(input.source !== undefined ? {source: input.source} : {}),
    value: input.value,
    unit: input.unit,
    datum: input.datum.trim(),
    ...(field ? {field: {dataId: field.dataId, name: field.name}} : {}),
    reference: reference
      ? {
          ...(reference.source !== undefined ? {source: reference.source} : {}),
          value: staleTerrain ? null : reference.value,
          unit: reference.unit,
          datum: reference.datum.trim(),
          ...(!staleTerrain &&
          reference.displayZ !== undefined &&
          (!terrain || reference.value !== null)
            ? {displayZ: reference.displayZ}
            : {}),
          ...(terrain && !staleTerrain && reference.coordinate
            ? {coordinate: [...reference.coordinate] as [number, number]}
            : {}),
          ...(terrain && !staleTerrain && reference.sourceId !== undefined
            ? {sourceId: reference.sourceId}
            : {})
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
  if (elevation.source === 'map') return null;
  if (!elevation.reference || elevation.reference.value === null)
    return 'Ground reference unavailable';
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

export function getAnnotationElevationLabels(
  elevation: AnnotationElevation,
  anchorHeight?: number
): string[] {
  const {value, unit, datum, reference, outputUnit, precision, display} = elevation;
  const meters = value === null ? null : value * ELEVATION_UNIT_METERS[unit];
  const format = (height: number) =>
    `${(height / ELEVATION_UNIT_METERS[outputUnit]).toFixed(precision)} ${outputUnit}`;
  if (elevation.source === 'map') {
    return [
      anchorHeight === undefined || !Number.isFinite(anchorHeight)
        ? 'Map height unavailable'
        : `${format(anchorHeight)} above map zero`
    ];
  }
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
      meters === null || !reference || reference.value === null
        ? null
        : meters - reference.value * ELEVATION_UNIT_METERS[reference.unit];
    labels.push(
      status ??
        (difference === null || !Number.isFinite(difference)
          ? 'Elevation unavailable'
          : `${format(difference)} above reference`)
    );
  }
  if (display === 'altitude' && elevation.guide !== 'none' && reference) {
    const status = getElevationReferenceStatus(elevation);
    if (status) labels.push(status);
  }
  return labels;
}
