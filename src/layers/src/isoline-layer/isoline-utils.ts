// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {contours} from 'd3-contour';
import {HexColor, RGBColor} from '@kepler.gl/types';
import {hexToRgb} from '@kepler.gl/utils';
import {MAX_ISOLINE_LEVELS} from './isoline-shader';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IsoLevel = {
  /** Normalized weight threshold [0..1] */
  threshold: number;
  /** Index of this level (0 = lowest) */
  index: number;
};

export type IsoLineFeature = {
  level: number;
  index: number;
  /** Array of [lng, lat] polyline segments from marching squares */
  coordinates: [number, number][][];
};

/** Decoded per-level color arrays ready to send to the shader */
export type IsolineColors = {
  /** RGBA [0..1] fill color for each band (above level i) */
  bandColors: [number, number, number, number][];
  /** RGBA [0..1] stroke color for each level line */
  lineColors: [number, number, number, number][];
};

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

/**
 * Convert a kepler.gl ColorRange (array of hex strings) into per-level RGBA
 * arrays suitable for GPU shader uniforms.
 *
 * bandColors[i]  = color of the filled region above level i
 * lineColors[i]  = color of the isoline stroke at level i (slightly darker)
 */
export function buildIsolineColors(
  hexColors: HexColor[],
  levelCount: number,
  opacity: number
): IsolineColors {
  const n = Math.min(levelCount, MAX_ISOLINE_LEVELS);
  const bandColors: [number, number, number, number][] = [];
  const lineColors: [number, number, number, number][] = [];

  for (let i = 0; i < n; i++) {
    // Map level index evenly from the first to the last palette color.
    // With n levels we need n sample points spanning [0, paletteSize-1]:
    //   t = i / (n - 1)  spans 0→1 (clamped to 0 when n=1)
    // This ensures level 0 always picks color[0] and the top level always
    // picks the last palette color, regardless of how many levels are shown.
    const t = n > 1 ? i / (n - 1) : 0;
    const colorIdx = Math.round(t * (hexColors.length - 1));
    const rgb: RGBColor = hexToRgb(hexColors[colorIdx]) ?? [0, 0, 0];
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const a = opacity;

    bandColors.push([r, g, b, a]);
    // Make the stroke slightly darker / more opaque for contrast
    lineColors.push([r * 0.7, g * 0.7, b * 0.7, Math.min(1, a * 1.2)]);
  }

  return {bandColors, lineColors};
}

// ---------------------------------------------------------------------------
// Level-threshold computation
// ---------------------------------------------------------------------------

/**
 * Compute normalized thresholds [0..1] for n iso-levels.
 *
 * KDE weight distributions are heavily skewed: most of the density mass sits
 * close to the maximum, so linearly-spaced thresholds leave a large unmapped
 * gap at the top (producing a flat plateau of the highest color). Using a
 * square-root scale pushes thresholds toward 1.0, placing more rings in the
 * high-density centre and fewer in the sparse outer fringe.
 *
 * Linear  (n=6): 0.14  0.29  0.43  0.57  0.71  0.86
 * Sqrt    (n=6): 0.38  0.53  0.66  0.76  0.85  0.93  ← more rings near max
 */
export function computeLevelThresholds(levelCount: number): number[] {
  const n = Math.max(1, Math.min(levelCount, MAX_ISOLINE_LEVELS));
  const thresholds: number[] = [];
  for (let i = 1; i <= n; i++) {
    // Even linear spacing — now that KDE weights are properly normalised to
    // [0..1] by dividing by the actual per-frame maximum (not the hardcoded
    // 1.0 from KeplerHeatmapLayer), linear thresholds distribute bands evenly
    // across the true density range.
    thresholds.push(i / (n + 1));
  }
  return thresholds;
}

// ---------------------------------------------------------------------------
// CPU marching-squares pass (for picking & labels)
// ---------------------------------------------------------------------------

/**
 * Read the weights texture pixels from the deck.gl device and return a
 * flat Float32Array of normalized weight values.
 *
 * The weights texture is an RGBA float texture where the red channel holds
 * the raw KDE weight. We normalise by the max weight so values are in [0,1].
 *
 * @param device  – luma.gl Device (this.context.device in a deck.gl layer)
 * @param weightsTexture  – luma.gl Texture from heatmap state
 * @param maxWeightsTexture  – luma.gl Texture (1×1, holds max weight in .r/.g)
 * @param size  – texture width = height (e.g. 512)
 * @param aggregationMode  – 0 = SUM, 1 = MEAN
 * @returns Float32Array of length size*size with values in [0, 1], or null on failure
 */
export function readKDETexture(
  device: any,
  weightsTexture: any,
  maxWeightsTexture: any,
  size: number,
  aggregationMode: number
): Float32Array | null {
  try {
    // Read max weight texture (1×1 pixel)
    const maxBuf = device.readPixelsToArrayWebGL
      ? device.readPixelsToArrayWebGL(maxWeightsTexture)
      : null;
    let maxVal = 1;
    if (maxBuf && maxBuf.length >= 2) {
      maxVal = aggregationMode < 0.5 ? maxBuf[0] : maxBuf[1];
    }
    if (!maxVal || maxVal <= 0) return null;

    // Read weights texture (size×size pixels, RGBA float)
    const rawBuf = device.readPixelsToArrayWebGL
      ? device.readPixelsToArrayWebGL(weightsTexture)
      : null;
    if (!rawBuf) return null;

    const out = new Float32Array(size * size);
    for (let i = 0; i < size * size; i++) {
      out[i] = Math.min(1, rawBuf[i * 4] / maxVal); // red channel
    }
    return out;
  } catch (e) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Coordinate conversion helpers
// ---------------------------------------------------------------------------

/**
 * Convert a pixel index in the weights texture to a [lng, lat] coordinate.
 *
 * The weights texture maps linearly from (0,0) → (minLng, maxLat) to
 * (size-1, size-1) → (maxLng, minLat) (note: y is flipped — row 0 = top = maxLat).
 *
 * @param px  – pixel column (0..size-1)
 * @param py  – pixel row (0..size-1)
 * @param size  – texture size (square)
 * @param bounds  – [minLng, minLat, maxLng, maxLat]
 */
function pixelToLngLat(
  px: number,
  py: number,
  size: number,
  bounds: [number, number, number, number]
): [number, number] {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const lng = minLng + (px / (size - 1)) * (maxLng - minLng);
  // Row 0 corresponds to maxLat (texture y is flipped w.r.t. latitude)
  const lat = maxLat - (py / (size - 1)) * (maxLat - minLat);
  return [lng, lat];
}

// ---------------------------------------------------------------------------
// Marching squares via d3-contour
// ---------------------------------------------------------------------------

/**
 * Run d3-contour's marching-squares algorithm on the CPU copy of the KDE
 * texture and return per-level polylines in geographic coordinates.
 *
 * The returned features are used for:
 *   1. Picking: invisible PathLayer sublayers whose pick index → level
 *   2. Labels: TextLayer positioned at label-anchor points along each level
 *
 * @param weightsBuffer  – Float32Array[size*size] with values in [0, 1]
 * @param size           – texture width = height
 * @param thresholds     – normalized level thresholds (sorted ascending)
 * @param bounds         – [minLng, minLat, maxLng, maxLat] geographic extent of texture
 */
export function buildPickingLines(
  weightsBuffer: Float32Array,
  size: number,
  thresholds: number[],
  bounds: [number, number, number, number]
): IsoLineFeature[] {
  if (!weightsBuffer || weightsBuffer.length === 0 || thresholds.length === 0) {
    return [];
  }

  const contourGenerator = contours()
    .size([size, size])
    .thresholds(thresholds);

  const features: IsoLineFeature[] = [];

  // d3-contour returns filled polygons (MultiPolygon) — we want the boundary
  // lines, so we extract the outer rings of each polygon.
  const contourFeatures = contourGenerator(Array.from(weightsBuffer));

  for (let i = 0; i < contourFeatures.length; i++) {
    const cf = contourFeatures[i];
    const threshold = thresholds[i];
    if (!cf || !cf.coordinates) continue;

    const coords: [number, number][][] = [];

    // cf.coordinates is MultiPolygon: [polygon, ...] where polygon = [ring, ...]
    for (const polygon of cf.coordinates) {
      for (const ring of polygon) {
        const line: [number, number][] = ring.map(([px, py]) =>
          pixelToLngLat(px, py, size, bounds)
        );
        if (line.length >= 2) {
          coords.push(line);
        }
      }
    }

    if (coords.length > 0) {
      features.push({level: threshold, index: i, coordinates: coords});
    }
  }

  return features;
}

// ---------------------------------------------------------------------------
// Label anchor computation
// ---------------------------------------------------------------------------

/**
 * For each isoline level, find the midpoint of the longest polyline segment
 * to use as a label anchor position.
 *
 * @returns Array of [lng, lat] positions, one per level (or null if no lines)
 */
export function buildLabelAnchors(
  lines: IsoLineFeature[]
): ([number, number] | null)[] {
  return lines.map(feature => {
    let bestLen = -1;
    let bestMidpoint: [number, number] | null = null;

    for (const ring of feature.coordinates) {
      if (ring.length < 2) continue;
      // Compute total arc length
      let len = 0;
      for (let i = 1; i < ring.length; i++) {
        const dx = ring[i][0] - ring[i - 1][0];
        const dy = ring[i][1] - ring[i - 1][1];
        len += Math.sqrt(dx * dx + dy * dy);
      }
      if (len > bestLen) {
        bestLen = len;
        // Midpoint by arc length
        const half = len / 2;
        let acc = 0;
        for (let i = 1; i < ring.length; i++) {
          const dx = ring[i][0] - ring[i - 1][0];
          const dy = ring[i][1] - ring[i - 1][1];
          const segLen = Math.sqrt(dx * dx + dy * dy);
          if (acc + segLen >= half) {
            const t = (half - acc) / segLen;
            bestMidpoint = [ring[i - 1][0] + t * dx, ring[i - 1][1] + t * dy];
            break;
          }
          acc += segLen;
        }
        if (!bestMidpoint) bestMidpoint = ring[Math.floor(ring.length / 2)];
      }
    }

    return bestMidpoint;
  });
}

// ---------------------------------------------------------------------------
// Flatten polylines for PathLayer
// ---------------------------------------------------------------------------

/**
 * Flatten the per-level IsoLineFeatures into PathLayer-compatible data rows.
 * Each row has `path` (array of [lng, lat]) and `levelIndex` for pick lookup.
 */
export function buildPathLayerData(
  lines: IsoLineFeature[]
): {path: [number, number][]; levelIndex: number; level: number}[] {
  const rows: {path: [number, number][]; levelIndex: number; level: number}[] = [];
  for (const feature of lines) {
    for (const ring of feature.coordinates) {
      if (ring.length >= 2) {
        rows.push({path: ring, levelIndex: feature.index, level: feature.level});
      }
    }
  }
  return rows;
}
