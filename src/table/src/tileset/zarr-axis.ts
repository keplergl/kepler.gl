// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ZarrAxisConfig, ZarrDimensionInfo, ZarrVariableInfo} from '@kepler.gl/constants';

export type ZarrAxisFrame = {
  /** Numeric slider position; categorical/duplicate values use ordinal positions. */
  value: number;
  label: string;
  /** Original array indices, independent of axis sorting and display labels. */
  selection: Record<string, number>;
};

export type ZarrAxis = {
  label: string;
  dimensions: string[];
  frames: ZarrAxisFrame[];
  error?: string;
};

const MAX_FRAMES = 100_000;
const DAY_MS = 86_400_000;

export function isExplicitZarrAxis(axis?: ZarrAxisConfig): boolean {
  return Boolean(axis?.kind && axis.kind !== 'auto');
}

export function getZarrAxisDimensions(axis?: ZarrAxisConfig): string[] {
  switch (axis?.kind) {
    case 'dimension':
      return [axis.dimension];
    case 'forecast':
      // The forecast run is pinned. Only the lead varies during playback.
      return [axis.leadTime];
    default:
      return [];
  }
}

export function getZarrForecastAxes(variable: ZarrVariableInfo): ZarrAxisConfig[] {
  const dims = variable.nonSpatialDims;
  const references = dims.filter(
    d => d.kind === 'time' && d.standardName === 'forecast_reference_time'
  );
  const leads = dims.filter(d => d.standardName === 'forecast_period');
  return references.flatMap(reference =>
    leads.map(lead => ({
      kind: 'forecast' as const,
      referenceTime: reference.name,
      leadTime: lead.name
    }))
  );
}

export function formatZarrCoordinate(dimension: ZarrDimensionInfo, index: number): string {
  const value = dimension.values?.[index];
  if (value === undefined || (typeof value === 'number' && !Number.isFinite(value))) {
    return String(index);
  }
  if (dimension.kind === 'time' && typeof value === 'number') {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : String(index);
  }
  return typeof value === 'number' ? String(Number(value.toPrecision(12))) : String(value);
}

function durationMilliseconds(units?: string): number | undefined {
  return {
    seconds: 1000,
    second: 1000,
    s: 1000,
    minutes: 60_000,
    minute: 60_000,
    hours: 3_600_000,
    hour: 3_600_000,
    days: DAY_MS,
    day: DAY_MS,
    milliseconds: 1,
    millisecond: 1,
    microseconds: 0.001,
    microsecond: 0.001
  }[units?.toLowerCase() ?? ''];
}

/**
 * A small, per-variable table of playable slices. Never expands unrelated
 * dimensions (ensemble, band, scenario, etc.) or raster pixels into rows.
 */
export function getZarrAxis(
  variable: ZarrVariableInfo | null | undefined,
  config?: ZarrAxisConfig,
  pins: Record<string, number> = {}
): ZarrAxis {
  const dimensions = getZarrAxisDimensions(config);
  const empty = (error?: string): ZarrAxis => ({label: '', dimensions, frames: [], error});
  if (!variable || !isExplicitZarrAxis(config) || config?.kind === 'off') return empty();
  const source = variable.nonSpatialDims.find(d => d.name === dimensions[0]);
  if (!source) {
    return empty('Choose a dimension belonging to this variable.');
  }
  if (!Number.isSafeInteger(source.size) || source.size < 0) {
    return empty('The selected axis has an invalid dimension size.');
  }
  const size = source.size;
  if (!size) return empty('The selected axis has no values.');
  if (size > MAX_FRAMES) return empty('The selected axis has too many frames for playback.');

  let frames: ZarrAxisFrame[] = [];
  let label = dimensions.join(' / ');
  let ordinal = false;
  if (config?.kind === 'dimension') {
    const dim =
      source.name === variable.timeDimension?.name ? {...source, kind: 'time' as const} : source;
    label = dim.units && dim.kind !== 'time' ? `${dim.name} (${dim.units})` : dim.name;
    ordinal = dim.kind === 'category' || !dim.values;
    for (let index = 0; index < dim.size; index++) {
      const value = dim.values ? dim.values[index] : index;
      if (value === undefined || (typeof value === 'number' && !Number.isFinite(value))) continue;
      if (dim.kind === 'time' && !Number.isFinite(new Date(Number(value)).getTime())) continue;
      ordinal ||= typeof value !== 'number';
      frames.push({
        value: typeof value === 'number' ? value : index,
        label: formatZarrCoordinate(dim, index),
        selection: {[dim.name]: index}
      });
    }
  } else if (config?.kind === 'forecast') {
    const reference = variable.nonSpatialDims.find(d => d.name === config.referenceTime);
    const lead = source;
    const index = Math.max(
      0,
      Math.min(
        reference ? reference.size - 1 : 0,
        Number.isFinite(pins[config.referenceTime]) ? Math.round(pins[config.referenceTime]) : 0
      )
    );
    const start = reference?.values?.[index];
    const scale = durationMilliseconds(lead.units);
    if (
      reference?.kind !== 'time' ||
      typeof start !== 'number' ||
      !scale ||
      reference.name === lead.name
    ) {
      return empty(
        'Valid time requires a decoded reference time and a lead time with duration units.'
      );
    }
    label = `Valid time (${reference.name} + ${lead.name})`;
    for (let i = 0; i < lead.size; i++) {
      const offset = lead.values?.[i];
      const value = typeof offset === 'number' ? start + offset * scale : NaN;
      if (!Number.isFinite(value) || !Number.isFinite(new Date(value).getTime())) continue;
      frames.push({
        value,
        label: new Date(value).toISOString(),
        selection: {[reference.name]: index, [lead.name]: i}
      });
    }
  }
  if (!ordinal) frames.sort((a, b) => a.value - b.value);
  // Keep every slice even when coordinate labels/values repeat.
  if (ordinal || new Set(frames.map(f => f.value)).size !== frames.length) {
    frames = frames.map((frame, index) => ({...frame, value: index}));
  }
  return {
    label,
    dimensions,
    frames,
    ...(frames.length ? {} : {error: 'The selected axis has no usable coordinates.'})
  };
}
