// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {contours} from 'd3-contour';
import Delaunator from 'delaunator';
import {Feature, MultiPolygon} from 'geojson';

/** Scalar measurements. In grid mode, positions are cell centers and nulls remain no-data. */
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

export type ContourInputMode = 'auto' | 'grid' | 'points';

// Only grid-layout failures may fall back to interpolation. Geographic errors must surface.
class ScalarGridLayoutError extends Error {}

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

function gridAxis(values: number[]): {origin: number; step: number; length: number} {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  if (sorted.length < 2) {
    throw new ScalarGridLayoutError(
      'Contours need at least two distinct latitudes and longitudes.'
    );
  }
  // The smallest separation also preserves entirely missing rows/columns.
  let step = Infinity;
  for (let i = 1; i < sorted.length; i++) step = Math.min(step, sorted[i] - sorted[i - 1]);
  const origin = sorted[0];
  const length = Math.round((sorted[sorted.length - 1] - origin) / step) + 1;
  if (length > MAX_AXIS) {
    throw new ScalarGridLayoutError(
      'Contour grids support up to 512 samples per axis. Use a coarser regular grid.'
    );
  }
  if (
    sorted.some(
      value => Math.abs((value - origin) / step - Math.round((value - origin) / step)) > 0.001
    )
  ) {
    throw new ScalarGridLayoutError(
      'Contours require regularly spaced longitude/latitude samples.'
    );
  }
  return {origin, step, length};
}

export function buildScalarGrid(samples: ScalarSample[]): ScalarGrid | null {
  const located = samples.filter(hasValidPosition);
  if (!located.length) return null;
  regionalBounds(located);
  const x = gridAxis(located.map(d => d.longitude));
  const y = gridAxis(located.map(d => d.latitude));
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

/** Keep supported lattices (including holes) intact; interpolate only when requested/needed. */
export function buildContourGrid(
  samples: ScalarSample[],
  mode: ContourInputMode = 'auto',
  resolution = 192
): ScalarGrid | null {
  if (mode === 'grid') return buildScalarGrid(samples);
  if (mode === 'auto') {
    try {
      return buildScalarGrid(samples);
    } catch (error) {
      if (!(error instanceof ScalarGridLayoutError)) throw error;
    }
  }
  return interpolateScalarSamples(samples, resolution);
}

/** Linear interpolation over Delaunay triangles; never extrapolate beyond the sample hull. */
export function interpolateScalarSamples(
  samples: ScalarSample[],
  resolution = 192
): ScalarGrid | null {
  const unique = new Map<string, ScalarSample & {value: number; count: number}>();
  for (const sample of samples) {
    if (
      !hasValidPosition(sample) ||
      typeof sample.value !== 'number' ||
      !Number.isFinite(sample.value)
    )
      continue;
    const key = `${sample.longitude},${sample.latitude}`;
    const point = unique.get(key);
    if (point) {
      point.count++;
      point.value += (sample.value - point.value) / point.count;
    } else {
      unique.set(key, {...sample, value: sample.value, count: 1});
    }
  }
  const points = [...unique.values()];
  if (!points.length) return null;
  const {west, east, south, north} = regionalBounds(points);
  const insufficient =
    'Interpolation needs at least three distinct, non-collinear samples with valid values.';
  if (points.length < 3 || west === east || south === north) throw new Error(insufficient);

  // Regional equirectangular coordinates correct the longitude/latitude aspect ratio.
  const scaleX = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const spanX = (east - west) * scaleX;
  const spanY = north - south;
  const span = Math.max(spanX, spanY);
  const size = Number.isFinite(resolution)
    ? Math.max(32, Math.min(256, Math.round(resolution)))
    : 192;
  const width = Math.max(2, Math.round(((size - 1) * spanX) / span) + 1);
  const height = Math.max(2, Math.round(((size - 1) * spanY) / span) + 1);
  const coords = new Float64Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    coords[2 * i] = ((points[i].longitude - west) * scaleX) / span;
    coords[2 * i + 1] = (points[i].latitude - south) / span;
  }
  const {triangles} = new Delaunator(coords);
  if (!triangles.length) throw new Error(insufficient);
  const values = new Float64Array(width * height).fill(NaN);
  const stepX = spanX / span / (width - 1);
  const stepY = spanY / span / (height - 1);
  const tolerance = 1e-10;
  // Rasterize each triangle's bounding box, rather than searching every point for every cell.
  for (let t = 0; t < triangles.length; t += 3) {
    const ia = triangles[t];
    const ib = triangles[t + 1];
    const ic = triangles[t + 2];
    const ax = coords[2 * ia];
    const ay = coords[2 * ia + 1];
    const bx = coords[2 * ib];
    const by = coords[2 * ib + 1];
    const cx = coords[2 * ic];
    const cy = coords[2 * ic + 1];
    const denominator = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    if (denominator === 0) continue;
    const col0 = Math.max(0, Math.ceil(Math.min(ax, bx, cx) / stepX - tolerance));
    const col1 = Math.min(width - 1, Math.floor(Math.max(ax, bx, cx) / stepX + tolerance));
    const row0 = Math.max(0, Math.ceil(Math.min(ay, by, cy) / stepY - tolerance));
    const row1 = Math.min(height - 1, Math.floor(Math.max(ay, by, cy) / stepY + tolerance));
    for (let row = row0; row <= row1; row++) {
      for (let col = col0; col <= col1; col++) {
        const x = col * stepX;
        const y = row * stepY;
        const a = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / denominator;
        const b = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / denominator;
        const c = 1 - a - b;
        if (a < -tolerance || b < -tolerance || c < -tolerance) continue;
        // Clamp round-off at triangle edges to keep values within their samples' range.
        const wa = Math.max(0, a);
        const wb = Math.max(0, b);
        const wc = Math.max(0, c);
        values[row * width + col] =
          (wa * points[ia].value + wb * points[ib].value + wc * points[ic].value) / (wa + wb + wc);
      }
    }
  }
  return {
    width,
    height,
    longitude: west,
    latitude: south,
    stepLng: (east - west) / (width - 1),
    stepLat: (north - south) / (height - 1),
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
