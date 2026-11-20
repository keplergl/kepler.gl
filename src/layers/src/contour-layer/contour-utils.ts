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
  // Original sample-grid extent, excluding any smoothing halo.
  sampleExtent?: {width: number; height: number; left: number; bottom: number};
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
const MAX_SMOOTHING_SIGMA = 6;
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
  aggregation: 'MEAN' | 'COUNT' = 'MEAN'
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
  // Fit the longer axis to the selected resolution, with square geographic cells.
  // Coincident points have no extent; use a minimal 2x2 grid with one-meter spacing.
  const size = span > 0 ? span / (axis - 1) : 1;
  const stepLng = size / metersPerDegreeLng;
  const stepLat = size / METERS_PER_DEGREE_LAT;
  // Clamp roundoff on the longer axis; pad a degenerate shorter axis to two cells.
  const width = Math.max(2, Math.min(axis, Math.ceil(spanX / size) + 1));
  const height = Math.max(2, Math.min(axis, Math.ceil(spanY / size) + 1));
  const values = new Float64Array(width * height);
  const counts = new Uint32Array(values.length);
  for (const sample of located) {
    // Resolve half-cell ties consistently despite roundoff when rescaling an extent.
    const col = Math.min(width - 1, Math.round((sample.longitude - west) / stepLng + 1e-10));
    const row =
      height - 1 - Math.min(height - 1, Math.round((north - sample.latitude) / stepLat + 1e-10));
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
    longitude: west,
    latitude: north - (height - 1) * stepLat,
    stepLng,
    stepLat,
    values
  };
}

/**
 * Zero is the empty-cell value for point aggregation. Surround the original
 * samples with enough zero cells for the finite Gaussian kernel to finish its
 * falloff before marching squares closes the contours against the grid edge.
 */
export function smoothPointContourGrid(grid: ScalarGrid, sigma: number): ScalarGrid {
  if (!Number.isFinite(sigma) || sigma <= 0) return grid;
  const first = grid.values[0];
  // Preserve constant fields, including their implicit-level behavior.
  if (grid.values.every(value => value === first)) return grid;
  const halo = Math.ceil(Math.min(sigma, MAX_SMOOTHING_SIGMA) * 3) + 1;
  // Do not extend the grid farther than valid globe coordinates. Leave room
  // for marching squares' half-cell boundary outside the last sample.
  const available = (distance: number, step: number) =>
    Math.max(0, Math.min(halo, Math.floor(distance / step - 0.5)));
  const left = available(grid.longitude + 180, grid.stepLng);
  const right = available(180 - grid.longitude - (grid.width - 1) * grid.stepLng, grid.stepLng);
  const bottom = available(grid.latitude + 90, grid.stepLat);
  const top = available(90 - grid.latitude - (grid.height - 1) * grid.stepLat, grid.stepLat);
  if (left + right + bottom + top === 0) {
    return {...grid, values: smoothScalarGrid(grid, sigma)};
  }
  const width = grid.width + left + right;
  const height = grid.height + bottom + top;
  const values = new Float64Array(width * height);
  const padded = {
    ...grid,
    width,
    height,
    longitude: grid.longitude - left * grid.stepLng,
    latitude: grid.latitude - bottom * grid.stepLat,
    sampleExtent: {width: grid.width, height: grid.height, left, bottom},
    values
  };
  if (!grid.values.every(Number.isFinite)) {
    for (let row = 0; row < grid.height; row++) {
      values.set(
        grid.values.subarray(row * grid.width, (row + 1) * grid.width),
        (row + bottom) * width + left
      );
    }
    return {...padded, values: smoothScalarGrid(padded, sigma)};
  }

  // The halo contains only zeros. Convolve the source rows first, then read
  // only those rows in the vertical pass. Unlike the generic missing-data
  // path, finite point grids need just one denominator per axis position.
  const radius = halo - 1;
  const kernel = gaussianKernel(radius, Math.min(sigma, MAX_SMOOTHING_SIGMA));
  const weightsFor = (size: number) =>
    Float64Array.from({length: size}, (_, i) => {
      let sum = 0;
      for (let j = Math.max(0, i - radius); j <= Math.min(size - 1, i + radius); j++) {
        sum += kernel[j - i + radius];
      }
      return sum;
    });
  const horizontalWeights = weightsFor(width);
  const horizontal = new Float64Array(width * grid.height);
  for (let x = 0; x < width; x++) {
    const start = Math.max(0, x - left - radius);
    const end = Math.min(grid.width - 1, x - left + radius);
    for (let row = 0; row < grid.height; row++) {
      let sum = 0;
      for (let col = start; col <= end; col++) {
        sum += grid.values[row * grid.width + col] * kernel[col + left - x + radius];
      }
      horizontal[row * width + x] = sum / horizontalWeights[x];
    }
  }
  const verticalWeights = weightsFor(height);
  for (let y = 0; y < height; y++) {
    const start = Math.max(0, y - bottom - radius);
    const end = Math.min(grid.height - 1, y - bottom + radius);
    for (let row = start; row <= end; row++) {
      const factor = kernel[row + bottom - y + radius] / verticalWeights[y];
      for (let x = 0; x < width; x++) {
        values[y * width + x] += horizontal[row * width + x] * factor;
      }
    }
  }
  return padded;
}

const gaussianKernel = (radius: number, sigma: number) =>
  Array.from({length: radius * 2 + 1}, (_, i) => Math.exp(-0.5 * ((i - radius) / sigma) ** 2));

/** Separable, normalized Gaussian smoothing. Missing samples remain missing. */
export function smoothScalarGrid(grid: ScalarGrid, sigma: number): Float64Array {
  if (!Number.isFinite(sigma) || sigma <= 0) return grid.values;
  // A constant field is already smooth. Avoid convolution roundoff changing
  // membership at an explicit threshold equal to that value; retain no-data cells.
  const first = grid.values.find(Number.isFinite);
  if (grid.values.every(value => !Number.isFinite(value) || value === first)) return grid.values;
  const boundedSigma = Math.min(sigma, MAX_SMOOTHING_SIGMA);
  const radius = Math.ceil(boundedSigma * 3);
  const kernel = gaussianKernel(radius, boundedSigma);
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
  // The halo supplies falloff, not observations. Derive automatic levels
  // from the original cells, without lowering the range to the added zeros.
  const {left, bottom, width, height} = grid.sampleExtent ?? {left: 0, bottom: 0, ...grid};
  for (let y = bottom; y < bottom + height; y++) {
    const end = y * grid.width + left + width;
    for (let index = end - width; index < end; index++) {
      const value = values[index];
      if (Number.isFinite(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
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
