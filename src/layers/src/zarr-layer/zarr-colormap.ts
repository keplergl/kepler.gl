// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {hexToRgb} from '@kepler.gl/utils';

export type ZarrColormapOptions = {
  /** Value range mapped onto the full color ramp. Values outside it are clamped. */
  rescale: [number, number];
  /** Hex colors of the ramp, coarsest first. */
  colors: string[];
  /** Value rendered transparent, in addition to NaN and the array fill value. */
  nodataValue?: number;
  /**
   * Interpolate between ramp stops instead of snapping to the nearest one.
   * Continuous data reads better interpolated; categorical data does not.
   */
  interpolate?: boolean;
};

export type ZarrTileImage = {
  width: number;
  height: number;
  /** RGBA, 4 bytes per pixel, row major from the top-left of the tile. */
  data: Uint8ClampedArray;
};

type Rgb = [number, number, number];

function toRgbRamp(colors: string[]): Rgb[] {
  const ramp: Rgb[] = [];
  for (const color of colors) {
    const rgb = hexToRgb(color);
    if (rgb) {
      ramp.push([rgb[0], rgb[1], rgb[2]]);
    }
  }
  return ramp;
}

/**
 * Map a 0-1 position onto the ramp. `interpolate` blends adjacent stops;
 * otherwise the position snaps to the containing band, which keeps discrete
 * class values from bleeding into each other.
 */
function sampleRamp(ramp: Rgb[], t: number, interpolate: boolean): Rgb {
  if (ramp.length === 1) {
    return ramp[0];
  }
  if (!interpolate) {
    const index = Math.min(ramp.length - 1, Math.floor(t * ramp.length));
    return ramp[index];
  }
  const scaled = t * (ramp.length - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(ramp.length - 1, lower + 1);
  const frac = scaled - lower;
  const from = ramp[lower];
  const to = ramp[upper];
  return [
    from[0] + (to[0] - from[0]) * frac,
    from[1] + (to[1] - from[1]) * frac,
    from[2] + (to[2] - from[2]) * frac
  ];
}

/**
 * Colorize a single-band Zarr chunk into an RGBA buffer.
 *
 * Done on the CPU rather than in a shader: a chunk is at most a few hundred
 * pixels square, and this keeps the color ramp identical to every other kepler
 * layer without maintaining a second shader pipeline.
 */
export function applyZarrColormap(
  values: ArrayLike<number | bigint>,
  width: number,
  height: number,
  options: ZarrColormapOptions
): ZarrTileImage {
  const pixelCount = width * height;
  const data = new Uint8ClampedArray(pixelCount * 4);
  const ramp = toRgbRamp(options.colors);

  if (ramp.length === 0 || pixelCount === 0) {
    return {width, height, data};
  }

  const [min, max] = options.rescale;
  const span = max - min;
  const {nodataValue, interpolate = true} = options;

  for (let i = 0; i < pixelCount; i++) {
    const raw = i < values.length ? Number(values[i]) : Number.NaN;
    if (!Number.isFinite(raw) || (nodataValue !== undefined && raw === nodataValue)) {
      continue;
    }
    // A degenerate rescale range would divide by zero; put everything at the
    // bottom of the ramp instead of producing NaN colors.
    const t = span > 0 ? Math.min(1, Math.max(0, (raw - min) / span)) : 0;
    const [r, g, b] = sampleRamp(ramp, t, interpolate);
    const offset = i * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = 255;
  }

  return {width, height, data};
}

/**
 * Fall back to a sensible rescale range when the store advertises none.
 * Scans the chunk so the first tiles are not rendered as a flat color.
 */
export function estimateZarrDataRange(
  values: ArrayLike<number | bigint>,
  nodataValue?: number
): [number, number] | null {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < values.length; i++) {
    const raw = Number(values[i]);
    if (!Number.isFinite(raw) || (nodataValue !== undefined && raw === nodataValue)) {
      continue;
    }
    if (raw < min) {
      min = raw;
    }
    if (raw > max) {
      max = raw;
    }
  }
  if (min === Number.POSITIVE_INFINITY || min === max) {
    return null;
  }
  return [min, max];
}
