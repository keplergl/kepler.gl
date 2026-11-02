// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// CPU grid aggregation and mesh generation for the custom Contour layer's 3D
// surface mode.
//
// deck.gl's ContourLayer aggregates points on the GPU and only exposes contour
// geometry, so the surface is rebuilt from the original points here. The grid
// holds point counts (a density field), or the per-cell mean of a numeric weight
// column; the layer normalizes it to a height before building the mesh.

export const DEFAULT_ELEVATION_SCALE = 3000;

// A custom smoothing value is allowed in the UI; cap the work so an accidental
// very large entry cannot freeze the render loop.
export const MAX_SMOOTHING_PASSES = 100;

// 256 x 256 keeps the CPU mesh small enough for a demo.
export const MAX_GRID_CELLS = 256 * 256;

const METERS_PER_DEGREE_LAT = 111320;

// Deep blue -> teal -> green -> sand -> white.
const COLOR_STOPS = [
  [0, [24, 60, 110]],
  [0.2, [30, 110, 140]],
  [0.4, [60, 150, 100]],
  [0.6, [150, 180, 80]],
  [0.8, [210, 180, 110]],
  [1, [245, 245, 240]]
];

// Light from the northwest at 45 degrees, in the local east/north/up frame.
const LIGHT_DIRECTION = normalize3([-0.5, 0.5, Math.SQRT1_2]);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalize3(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function sampleColor(normalized) {
  const t = clamp(normalized, 0, 1);
  for (let i = 1; i < COLOR_STOPS.length; i++) {
    const [upperT, upperColor] = COLOR_STOPS[i];
    if (t <= upperT) {
      const [lowerT, lowerColor] = COLOR_STOPS[i - 1];
      const f = upperT === lowerT ? 0 : (t - lowerT) / (upperT - lowerT);
      return [
        lowerColor[0] + (upperColor[0] - lowerColor[0]) * f,
        lowerColor[1] + (upperColor[1] - lowerColor[1]) * f,
        lowerColor[2] + (upperColor[2] - lowerColor[2]) * f
      ];
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][1];
}

function hexToRgb(hex) {
  if (typeof hex !== 'string') {
    return null;
  }
  const value = hex.replace('#', '').trim();
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(value)) {
    return null;
  }
  const expanded = value.length === 3 ? value.replace(/(.)/g, '$1$1') : value;
  const int = parseInt(expanded, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/**
 * Normalize a color range's color list to RGB triples.
 * @param {Array<string | [number, number, number]> | null | undefined} colors
 * @returns {Array<[number, number, number]> | null}
 */
export function paletteToRgb(colors) {
  if (!Array.isArray(colors) || colors.length === 0) {
    return null;
  }
  const palette = colors
    .map(color => (Array.isArray(color) ? color : hexToRgb(color)))
    .filter(Boolean);
  return palette.length ? palette : null;
}

/**
 * Sample a palette at a normalized position. Palette colors are treated as
 * evenly spaced stops.
 * @param {number} normalized
 * @param {Array<[number, number, number]> | null} palette
 * @returns {[number, number, number] | null}
 */
export function samplePaletteColor(normalized, palette) {
  if (!palette || palette.length === 0) {
    return null;
  }
  if (palette.length === 1) {
    return palette[0];
  }

  const position = clamp(normalized, 0, 1) * (palette.length - 1);
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.min(palette.length - 1, lowerIndex + 1);
  const fraction = position - lowerIndex;
  const lower = palette[lowerIndex];
  const upper = palette[upperIndex];

  return [
    lower[0] + (upper[0] - lower[0]) * fraction,
    lower[1] + (upper[1] - lower[1]) * fraction,
    lower[2] + (upper[2] - lower[2]) * fraction
  ];
}

function blurAxis(src, dst, cols, rows, horizontal) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sum = 0;
      for (let k = -1; k <= 1; k++) {
        // Clamp to the edge so every source cell distributes its full value:
        // the blur then conserves total mass even at the extent boundary.
        const xx = clamp(horizontal ? x + k : x, 0, cols - 1);
        const yy = clamp(horizontal ? y : y + k, 0, rows - 1);
        sum += src[yy * cols + xx];
      }
      dst[y * cols + x] = sum / 3;
    }
  }
}

function smoothGrid(grid, cols, rows, passes) {
  if (passes <= 0) {
    return grid;
  }
  let a = Float32Array.from(grid);
  const b = new Float32Array(grid.length);
  for (let p = 0; p < passes; p++) {
    blurAxis(a, b, cols, rows, true);
    blurAxis(b, a, cols, rows, false);
  }
  return a;
}

/**
 * Aggregate lng/lat points into a regular grid.
 *
 * Rows run north -> south so the grid maps directly to a north-up mesh.
 * `bounds` is [west, south, east, north] in lng/lat.
 *
 * @param {Array<[number, number]>} points
 * @param {{
 *   cellSizeMeters: number,
 *   smoothing?: number,
 *   weights?: number[],
 *   aggregation?: 'SUM' | 'MEAN'
 * }} options
 *   `weights` is optional. With no weights the grid holds point counts; with
 *   weights (for example an elevation column) SUM accumulates them and MEAN
 *   averages them per cell.
 * @returns {null | {
 *   grid: Float32Array,
 *   cols: number,
 *   rows: number,
 *   bounds: [number, number, number, number],
 *   maxValue: number,
 *   dLng: number,
 *   dLat: number
 * }}
 */
export function computeDensityGrid(
  points,
  {cellSizeMeters, smoothing = 0, weights, aggregation = 'SUM'}
) {
  if (!Array.isArray(points) || points.length === 0 || !(cellSizeMeters > 0)) {
    return null;
  }

  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lng, lat] of points) {
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      continue;
    }
    west = Math.min(west, lng);
    east = Math.max(east, lng);
    south = Math.min(south, lat);
    north = Math.max(north, lat);
  }
  if (!Number.isFinite(west)) {
    return null;
  }

  const centerLat = (south + north) / 2;
  const metersPerDegreeLng =
    METERS_PER_DEGREE_LAT * Math.max(0.01, Math.cos((centerLat * Math.PI) / 180));
  let dLat = cellSizeMeters / METERS_PER_DEGREE_LAT;
  let dLng = cellSizeMeters / metersPerDegreeLng;
  let cols = Math.max(2, Math.ceil((east - west) / dLng) + 1);
  let rows = Math.max(2, Math.ceil((north - south) / dLat) + 1);

  // Coarsen the grid until it fits the cap. The safety factor avoids a
  // one-cell overflow from Math.ceil on each dimension.
  let guard = 0;
  while (cols * rows > MAX_GRID_CELLS && guard++ < 8) {
    const scale = Math.sqrt((cols * rows) / MAX_GRID_CELLS) * 1.02;
    dLat *= scale;
    dLng *= scale;
    cols = Math.max(2, Math.ceil((east - west) / dLng) + 1);
    rows = Math.max(2, Math.ceil((north - south) / dLat) + 1);
  }

  const gridWest = west;
  const gridNorth = north;
  const gridSouth = gridNorth - (rows - 1) * dLat;
  const gridEast = gridWest + (cols - 1) * dLng;
  const grid = new Float32Array(cols * rows);
  const counts = aggregation === 'MEAN' ? new Uint32Array(cols * rows) : null;

  for (let i = 0; i < points.length; i++) {
    const [lng, lat] = points[i];
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      continue;
    }
    const x = clamp(Math.round((lng - gridWest) / dLng), 0, cols - 1);
    const y = clamp(Math.round((gridNorth - lat) / dLat), 0, rows - 1);
    const cellIndex = y * cols + x;
    if (weights) {
      const weight = weights[i];
      // A missing weight is a missing observation: skip it in both the sum
      // and the count instead of turning it into a weight of 1.
      if (!Number.isFinite(weight)) {
        continue;
      }
      grid[cellIndex] += weight;
    } else {
      grid[cellIndex] += 1;
    }
    if (counts) {
      counts[cellIndex] += 1;
    }
  }

  if (counts) {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = counts[i] > 0 ? grid[i] / counts[i] : 0;
    }
  }

  const passes = Math.min(MAX_SMOOTHING_PASSES, Math.max(0, Math.round(smoothing)));
  const smoothed = smoothGrid(grid, cols, rows, passes);
  let minValue = Infinity;
  let maxValue = -Infinity;
  for (let i = 0; i < smoothed.length; i++) {
    if (smoothed[i] < minValue) {
      minValue = smoothed[i];
    }
    if (smoothed[i] > maxValue) {
      maxValue = smoothed[i];
    }
  }
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    minValue = 0;
    maxValue = 0;
  }

  return {
    grid: smoothed,
    cols,
    rows,
    bounds: [gridWest, gridSouth, gridEast, gridNorth],
    minValue,
    maxValue,
    dLng,
    dLat
  };
}

/**
 * Build a north-up triangle mesh from the grid.
 *
 * Heights and per-vertex colors are baked here. Colors come from the
 * hypsometric ramp, multiplied by a simple northwest hillshade so the surface
 * reads as relief even with lighting disabled.
 *
 * The mesh is laid out for deck.gl's LNGLAT coordinate system: positions are
 * [lng, lat, meters], rows run north -> south, and x runs west -> east.
 *
 * @param {{
 *   grid: Float32Array,
 *   cols: number,
 *   rows: number,
 *   bounds: [number, number, number, number],
 *   maxValue: number,
 *   dLng: number,
 *   dLat: number
 * }} gridInfo
 * @param {number} elevationScale maximum surface height in meters
 * @param {Array<string | [number, number, number]> | null} [colorRange]
 *   Optional color range (e.g. `layer.config.visConfig.colorRange.colors`).
 * @returns {{
 *   positions: Float32Array,
 *   colors: Float32Array,
 *   indices: Uint32Array,
 *   vertexCount: number,
 *   triangleCount: number
 * }}
 */
export function buildSurfaceMesh(gridInfo, elevationScale, colorRange) {
  const {grid, cols, rows, bounds, minValue = 0, maxValue, dLng, dLat} = gridInfo;
  const [west, south, east, north] = bounds;
  const range = maxValue - minValue;
  const heightScale = range > 0 ? elevationScale / range : 0;
  const vertexCount = cols * rows;
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const palette = paletteToRgb(colorRange);

  const centerLat = (south + north) / 2;
  const metersPerDegreeLng =
    METERS_PER_DEGREE_LAT * Math.max(0.01, Math.cos((centerLat * Math.PI) / 180));
  const dxMeters = Math.max(1, dLng * metersPerDegreeLng);
  const dyMeters = Math.max(1, dLat * METERS_PER_DEGREE_LAT);

  for (let y = 0; y < rows; y++) {
    const lat = north - y * dLat;
    for (let x = 0; x < cols; x++) {
      const index = y * cols + x;
      const offset = index * 3;
      const normalized = range > 0 ? clamp((grid[index] - minValue) / range, 0, 1) : 0;
      const height = (grid[index] - minValue) * heightScale;

      positions[offset] = west + x * dLng;
      positions[offset + 1] = lat;
      positions[offset + 2] = height;

      const eastHeight = (grid[y * cols + Math.min(cols - 1, x + 1)] - minValue) * heightScale;
      const westHeight = (grid[y * cols + Math.max(0, x - 1)] - minValue) * heightScale;
      const northHeight = (grid[Math.max(0, y - 1) * cols + x] - minValue) * heightScale;
      const southHeight = (grid[Math.min(rows - 1, y + 1) * cols + x] - minValue) * heightScale;

      const dzdx = (eastHeight - westHeight) / (2 * dxMeters);
      const dzdy = (northHeight - southHeight) / (2 * dyMeters);
      const normalLength = Math.hypot(dzdx, dzdy, 1);
      const shade = clamp(
        (-dzdx / normalLength) * LIGHT_DIRECTION[0] +
          (-dzdy / normalLength) * LIGHT_DIRECTION[1] +
          (1 / normalLength) * LIGHT_DIRECTION[2],
        0,
        1
      );
      const brightness = 0.45 + 0.55 * shade;
      const [r, g, b] = samplePaletteColor(normalized, palette) || sampleColor(normalized);

      colors[offset] = (r / 255) * brightness;
      colors[offset + 1] = (g / 255) * brightness;
      colors[offset + 2] = (b / 255) * brightness;
    }
  }

  const indices = new Uint32Array((cols - 1) * (rows - 1) * 6);
  let cursor = 0;
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const topLeft = y * cols + x;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + cols;
      const bottomRight = bottomLeft + 1;

      indices[cursor++] = topLeft;
      indices[cursor++] = bottomLeft;
      indices[cursor++] = topRight;
      indices[cursor++] = topRight;
      indices[cursor++] = bottomLeft;
      indices[cursor++] = bottomRight;
    }
  }

  return {
    positions,
    colors,
    indices,
    vertexCount,
    triangleCount: indices.length / 3
  };
}

/**
 * Marching-squares contour segments for the same grid, elevated to the
 * surface height so they drape over the DEM instead of lying at z = 0.
 *
 * Each path is a two-point segment `[lng, lat, z]`. Segments are kept separate
 * rather than joined, which keeps the algorithm small and is fine for the
 * demo-sized grids.
 *
 * @param {{
 *   grid: Float32Array,
 *   cols: number,
 *   rows: number,
 *   bounds: [number, number, number, number],
 *   minValue: number,
 *   maxValue: number,
 *   dLng: number,
 *   dLat: number
 * }} gridInfo
 * @param {number} elevationScale maximum surface height in meters
 * @param {number} contourCount number of evenly spaced levels
 * @returns {Array<Array<[number, number, number]>>}
 */
export function buildContourPaths(gridInfo, elevationScale, contourCount = 8) {
  const {grid, cols, rows, bounds, minValue = 0, maxValue, dLng, dLat} = gridInfo;
  const range = maxValue - minValue;
  if (!grid || cols < 2 || rows < 2 || !(range > 0)) {
    return [];
  }

  const count = Math.max(1, Math.min(30, Math.round(contourCount || 8)));
  const [west, , , north] = bounds;
  const heightScale = range > 0 ? elevationScale / range : 0;
  // Keep the lines just above the triangulated surface to avoid z-fighting.
  const zOffset = Math.max(1, elevationScale * 0.001);
  const paths = [];

  for (let levelIndex = 1; levelIndex <= count; levelIndex++) {
    const level = minValue + (range * levelIndex) / (count + 1);
    const z = (level - minValue) * heightScale + zOffset;

    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        const topLeft = grid[y * cols + x];
        const topRight = grid[y * cols + x + 1];
        const bottomRight = grid[(y + 1) * cols + x + 1];
        const bottomLeft = grid[(y + 1) * cols + x];

        const lng0 = west + x * dLng;
        const lng1 = west + (x + 1) * dLng;
        const lat0 = north - y * dLat;
        const lat1 = north - (y + 1) * dLat;
        const intersections = [];

        const addEdgeIntersection = (v0, v1, from, to) => {
          if ((v0 < level && v1 >= level) || (v0 >= level && v1 < level)) {
            const t = v0 === v1 ? 0 : (level - v0) / (v1 - v0);
            intersections.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
          }
        };

        addEdgeIntersection(topLeft, topRight, [lng0, lat0], [lng1, lat0]);
        addEdgeIntersection(topRight, bottomRight, [lng1, lat0], [lng1, lat1]);
        addEdgeIntersection(bottomLeft, bottomRight, [lng0, lat1], [lng1, lat1]);
        addEdgeIntersection(topLeft, bottomLeft, [lng0, lat0], [lng0, lat1]);

        if (intersections.length === 2) {
          paths.push([
            [intersections[0][0], intersections[0][1], z],
            [intersections[1][0], intersections[1][1], z]
          ]);
        } else if (intersections.length === 4) {
          // Saddle case: pair the two crossings in the same way along the
          // cell edges. This is an approximation, sufficient for a display.
          paths.push([
            [intersections[0][0], intersections[0][1], z],
            [intersections[1][0], intersections[1][1], z]
          ]);
          paths.push([
            [intersections[2][0], intersections[2][1], z],
            [intersections[3][0], intersections[3][1], z]
          ]);
        }
      }
    }
  }

  return paths;
}
