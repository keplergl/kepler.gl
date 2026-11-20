// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {contours} from 'd3-contour';
import {Feature, MultiPolygon} from 'geojson';

/** Point observations; missing weights are skipped when calculating cell means. */
export type ScalarSample = {longitude: number; latitude: number; value: number | null};
export type ScalarGrid = {
  width: number;
  height: number;
  longitude: number;
  latitude: number;
  stepLng: number;
  stepLat: number;
  values: Float64Array;
  /** One empty cell around the samples, when the resolution and extent permit. */
  border?: 1;
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

const MAX_GRID_AXIS = 256;
const METERS_PER_DEGREE_LAT = 111320;

function hasValidPosition(d: ScalarSample): boolean {
  return (
    Number.isFinite(d.longitude) &&
    Number.isFinite(d.latitude) &&
    Math.abs(d.longitude) <= 180 &&
    Math.abs(d.latitude) < 90
  );
}

function regionalBounds(samples: ScalarSample[]) {
  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;
  for (const d of samples) {
    west = Math.min(west, d.longitude);
    east = Math.max(east, d.longitude);
    south = Math.min(south, d.latitude);
    north = Math.max(north, d.latitude);
  }
  if (east - west > 180) {
    throw new Error(
      'This contour prototype requires regional samples that do not cross the antimeridian.'
    );
  }
  return {west, east, south, north};
}

/**
 * Bin points into the nearest geographic cells, fitting the grid resolution to
 * the sample bounds.
 * Empty cells are zero; a weight selects MEAN, otherwise
 * each point contributes one count. Rows run south to north for contour rendering.
 */
export function buildContourGrid(
  samples: ScalarSample[],
  resolution = 64,
  aggregation: 'MEAN' | 'COUNT' = 'MEAN',
  reserveBorder = true
): ScalarGrid | null {
  if (!Number.isFinite(resolution) || resolution < 2) {
    throw new Error('Contour grid resolution must be a finite number of at least 2 cells.');
  }
  const located = samples.filter(
    sample =>
      hasValidPosition(sample) &&
      (aggregation === 'COUNT' ||
        (typeof sample.value === 'number' && Number.isFinite(sample.value)))
  );
  if (!located.length) return null;
  const {west, east, south, north} = regionalBounds(located);
  const metersPerDegreeLng =
    METERS_PER_DEGREE_LAT * Math.max(0.01, Math.cos((((south + north) / 2) * Math.PI) / 180));
  const axis = Math.min(MAX_GRID_AXIS, Math.round(resolution));
  const spanX = (east - west) * metersPerDegreeLng;
  const spanY = (north - south) * METERS_PER_DEGREE_LAT;
  const span = Math.max(spanX, spanY);
  // Reserve a zero ring inside the selected allocation. The outer observations
  // lie on the first and last interior cells, so an N-cell axis uses N - 3
  // sample intervals. Two interior cells are required to anchor an extent.
  const gridLayout = (border: 0 | 1) => {
    const innerAxis = axis - 2 * border;
    const size = span > 0 ? span / (innerAxis - 1) : 1;
    const stepLng = size / metersPerDegreeLng;
    const stepLat = size / METERS_PER_DEGREE_LAT;
    const innerWidth = Math.max(2, Math.min(innerAxis, Math.ceil(spanX / size) + 1));
    const innerHeight = Math.max(2, Math.min(innerAxis, Math.ceil(spanY / size) + 1));
    return {
      border,
      innerWidth,
      innerHeight,
      width: innerWidth + 2 * border,
      height: innerHeight + 2 * border,
      longitude: west - border * stepLng,
      latitude: north - (innerHeight - 1 + border) * stepLat,
      stepLng,
      stepLat
    };
  };
  let layout = gridLayout(reserveBorder && axis >= 4 ? 1 : 0);
  // Don't make legacy near-pole or date-line extents wrap because of padding.
  if (
    layout.border &&
    (layout.longitude - layout.stepLng / 2 < -180 ||
      layout.longitude + (layout.width - 0.5) * layout.stepLng > 180 ||
      layout.latitude - layout.stepLat / 2 < -90 ||
      layout.latitude + (layout.height - 0.5) * layout.stepLat > 90)
  ) {
    layout = gridLayout(0);
  }
  const {border, innerWidth, innerHeight, width, height, longitude, latitude, stepLng, stepLat} =
    layout;
  const values = new Float64Array(width * height);
  const counts = new Uint32Array(values.length);
  for (const sample of located) {
    // Resolve half-cell ties consistently despite roundoff when rescaling an extent.
    const col =
      border + Math.min(innerWidth - 1, Math.round((sample.longitude - west) / stepLng + 1e-10));
    const row =
      border +
      innerHeight -
      1 -
      Math.min(innerHeight - 1, Math.round((north - sample.latitude) / stepLat + 1e-10));
    const index = row * width + col;
    const count = ++counts[index];
    // Incremental means avoid accumulating a large sum of weights.
    values[index] =
      aggregation === 'COUNT'
        ? count
        : count === 1
        ? sample.value!
        : values[index] * ((count - 1) / count) + sample.value! / count;
  }
  return {
    width,
    height,
    longitude,
    latitude,
    stepLng,
    stepLat,
    values,
    ...(border ? {border} : {})
  };
}

/** Separable, normalized Gaussian smoothing. Missing samples remain missing. */
export function smoothScalarGrid(grid: ScalarGrid, sigma: number): Float64Array {
  if (!Number.isFinite(sigma) || sigma <= 0) return grid.values;
  // A constant field is already smooth. Avoid convolution roundoff changing
  // membership at an explicit threshold equal to that value; retain no-data cells.
  const first = grid.values.find(Number.isFinite);
  if (grid.values.every(value => !Number.isFinite(value) || value === first)) return grid.values;
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
  const values = Float64Array.from(grid.values, (value, i) =>
    Number.isFinite(value) && denominator[i] > 0 ? numerator[i] / denominator[i] : NaN
  );
  // Keep the empty boundary even when smoothing spreads an interior peak.
  // Otherwise low thresholds would still reach the edge of the fixed grid.
  if (grid.border) {
    values.fill(0, 0, grid.width);
    values.fill(0, (grid.height - 1) * grid.width);
    for (let row = 1; row < grid.height - 1; row++) {
      values[row * grid.width] = 0;
      values[(row + 1) * grid.width - 1] = 0;
    }
  }
  return values;
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
  // Interpolation and normalized smoothing can introduce a few ULPs of variation
  // in a constant field. Scale the tolerance to the values, without an absolute
  // floor that would discard meaningful variation in very small scalar units.
  const roundoff = Math.max(Math.abs(min), Math.abs(max)) * Number.EPSILON * 32;
  if (!domain && max - min <= roundoff) return [];
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
