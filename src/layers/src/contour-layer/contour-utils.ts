// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {contours} from 'd3-contour';
import {Feature, MultiPolygon} from 'geojson';

/** Samples are cell centers. Null values retain the grid position as no-data. */
export type ScalarSample = {longitude: number; latitude: number; value: number | null};
export type ScalarGrid = {
  width: number;
  height: number;
  longitude: number;
  latitude: number;
  stepLng: number;
  stepLat: number;
  values: Float64Array;
};
export type ContourFeature = Feature<
  MultiPolygon,
  {threshold: number; below: boolean; rank: number}
>;
export type ContourOptions = {
  smoothing: number;
  levels: number;
  below: boolean;
  domain?: [number, number];
};

const MAX_AXIS = 512;

function gridAxis(values: number[]): {origin: number; step: number; length: number} {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  if (sorted.length < 2) {
    throw new Error('Contours need at least two distinct latitudes and longitudes.');
  }
  // The smallest separation also preserves entirely missing rows/columns.
  let step = Infinity;
  for (let i = 1; i < sorted.length; i++) step = Math.min(step, sorted[i] - sorted[i - 1]);
  const origin = sorted[0];
  const length = Math.round((sorted[sorted.length - 1] - origin) / step) + 1;
  if (length > MAX_AXIS) {
    throw new Error(
      'Contour grids support up to 512 samples per axis. Use a coarser regular grid.'
    );
  }
  if (
    sorted.some(
      value => Math.abs((value - origin) / step - Math.round((value - origin) / step)) > 0.001
    )
  ) {
    throw new Error('Contours require regularly spaced longitude/latitude samples.');
  }
  return {origin, step, length};
}

export function buildScalarGrid(samples: ScalarSample[]): ScalarGrid | null {
  const located = samples.filter(
    d =>
      Number.isFinite(d.longitude) &&
      Number.isFinite(d.latitude) &&
      Math.abs(d.longitude) <= 180 &&
      Math.abs(d.latitude) < 90
  );
  if (!located.length) return null;
  const x = gridAxis(located.map(d => d.longitude));
  const y = gridAxis(located.map(d => d.latitude));
  if ((x.length - 1) * x.step > 180) {
    throw new Error(
      'This contour prototype requires a regional grid that does not cross the antimeridian.'
    );
  }
  const values = new Float64Array(x.length * y.length).fill(NaN);
  const counts = new Uint32Array(values.length);
  for (const d of located) {
    if (typeof d.value !== 'number' || !Number.isFinite(d.value)) continue;
    const col = Math.round((d.longitude - x.origin) / x.step);
    const row = Math.round((d.latitude - y.origin) / y.step);
    const i = row * x.length + col;
    // Repeated measurements at a cell represent an average, never density.
    const count = ++counts[i];
    values[i] = count === 1 ? d.value : values[i] + (d.value - values[i]) / count;
  }
  return {
    width: x.length,
    height: y.length,
    longitude: x.origin,
    latitude: y.origin,
    stepLng: x.step,
    stepLat: y.step,
    values
  };
}

/** Separable, normalized Gaussian smoothing. Missing samples remain missing. */
export function smoothScalarGrid(grid: ScalarGrid, sigma: number): Float64Array {
  if (!Number.isFinite(sigma) || sigma <= 0) return grid.values;
  const boundedSigma = Math.min(sigma, 6);
  const radius = Math.ceil(boundedSigma * 3);
  const kernel = Array.from({length: radius * 2 + 1}, (_, i) =>
    Math.exp(-0.5 * ((i - radius) / boundedSigma) ** 2)
  );
  let numerator = Float64Array.from(grid.values, value => (Number.isFinite(value) ? value : 0));
  let denominator = Float64Array.from(grid.values, value => (Number.isFinite(value) ? 1 : 0));
  for (const horizontal of [true, false]) {
    const nextNumerator = new Float64Array(grid.values.length);
    const nextDenominator = new Float64Array(grid.values.length);
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        const i = row * grid.width + col;
        for (let offset = -radius; offset <= radius; offset++) {
          const x = col + (horizontal ? offset : 0);
          const y = row + (horizontal ? 0 : offset);
          if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) continue;
          const j = y * grid.width + x;
          const weight = kernel[offset + radius];
          nextNumerator[i] += numerator[j] * weight;
          nextDenominator[i] += denominator[j] * weight;
        }
      }
    }
    numerator = nextNumerator;
    denominator = nextDenominator;
  }
  return Float64Array.from(grid.values, (value, i) =>
    Number.isFinite(value) && denominator[i] > 0 ? numerator[i] / denominator[i] : NaN
  );
}

export function generateContours(
  grid: ScalarGrid | null,
  options: ContourOptions
): ContourFeature[] {
  if (!grid) return [];
  const values = smoothScalarGrid(grid, options.smoothing);
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    if (Number.isFinite(value)) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  if (!Number.isFinite(min)) return [];
  const count = Number.isFinite(options.levels)
    ? Math.max(2, Math.min(20, Math.round(options.levels)))
    : 7;
  const domain = options.domain;
  if (domain && (!domain.every(Number.isFinite) || domain[0] >= domain[1])) {
    throw new Error('Contour minimum must be less than maximum.');
  }
  if (!domain && min === max) return [];
  // Auto levels lie inside the range to avoid a rectangle at the field boundary.
  const thresholds = Array.from({length: count}, (_, i) =>
    domain
      ? domain[0] + ((domain[1] - domain[0]) * i) / (count - 1)
      : min + ((max - min) * (i + 1)) / (count + 1)
  );
  const sign = options.below ? -1 : 1;
  const input = Array.from(values, value => (Number.isFinite(value) ? value * sign : NaN));
  // d3-contour v3's built-in interpolation produces NaN vertices beside no-data.
  // Stitch the rings first, then interpolate only edges with two valid samples.
  // Unknown-cell boundaries retain their cell-edge midpoint and remain holes.
  const geometries = contours()
    .size([grid.width, grid.height])
    .smooth(false)
    .thresholds(thresholds.map(value => value * sign).sort((a, b) => a - b))(input);
  return geometries
    .filter(geometry => geometry.coordinates.length > 0)
    .map((geometry, rank) => ({
      type: 'Feature',
      properties: {threshold: geometry.value * sign, below: options.below, rank},
      geometry: {
        type: 'MultiPolygon',
        coordinates: geometry.coordinates.map(polygon =>
          polygon.map(ring =>
            ring.map(([x, y]) => {
              const col = Math.floor(x);
              const row = Math.floor(y);
              const b = input[row * grid.width + col];
              if (x > 0 && x < grid.width && Number.isInteger(x)) {
                const a = input[row * grid.width + col - 1];
                if (Number.isFinite(a) && Number.isFinite(b) && a !== b)
                  x += (geometry.value - a) / (b - a) - 0.5;
              }
              if (y > 0 && y < grid.height && Number.isInteger(y)) {
                const a = input[(row - 1) * grid.width + col];
                if (Number.isFinite(a) && Number.isFinite(b) && a !== b)
                  y += (geometry.value - a) / (b - a) - 0.5;
              }
              return [
                grid.longitude + (x - 0.5) * grid.stepLng,
                grid.latitude + (y - 0.5) * grid.stepLat
              ];
            })
          )
        )
      }
    }));
}
