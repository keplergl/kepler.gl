// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {rgb as d3Rgb} from 'd3-color';
import {ColorRange} from '@kepler.gl/constants';
import {HexColor, RGBColor} from '@kepler.gl/types';

/**
 * get r g b from hex code
 *
 * @param hex
 * @returns array of r g bs
 */
export function hexToRgb(hex: string): RGBColor {
  const result = isHexColor(hex);

  if (!result) {
    return [0, 0, 0];
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return [r, g, b];
}

export function isHexColor(hex: string): RegExpExecArray | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result;
}

function PadNum(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * get hex from r g b
 *
 * @param rgb
 * @returns hex string
 */
export function rgbToHex([r, g, b]: RGBColor): HexColor {
  return `#${[r, g, b].map(n => PadNum(n)).join('')}`.toUpperCase();
}

/**
 * Get color group name by parsing name, discard step in the name
 * e.g. Global Warming 6 -> Global Warming
 *
 * @param {Object} colorRange
 * @return {string | null}
 */
export function getColorGroupByName(colorRange: ColorRange): string | null {
  if (!colorRange || typeof colorRange.name !== 'string') {
    return null;
  }

  return colorRange.name.replace(/\b[^a-zA-Z]+$/, '');
}

/**
 * Get a reversed colorRange
 * @param reversed
 * @param colorRange
 */
export function reverseColorRange(reversed: boolean, colorRange: ColorRange): ColorRange | null {
  if (!colorRange) return null;
  // if (colorRange.reversed) return colorRange;
  return {
    ...colorRange,
    reversed,
    colors: colorRange.colors.slice().reverse()
  };
}

/**
 * given a list of rgb arrays it will generate a linear gradient css rule
 * @param direction
 * @param colors
 * @return
 */
export function createLinearGradient(direction: string, colors: RGBColor[]) {
  const step = parseFloat((100.0 / colors.length).toFixed(2));
  const bands = colors.map((rgb, index) => {
    return `rgba(${rgb.join(',')}, 1) ${step * index}%, rgba(${rgb.join(',')}, 1) ${step *
      (index + 1)}%`;
  });

  return `linear-gradient(to ${direction}, ${bands.join(',')})`;
}

/**
 * Convert color to RGB
 */
export function colorMaybeToRGB(color: unknown): RGBColor | null {
  if (isRgbColor(color)) {
    return color as RGBColor;
  }

  if (typeof color === 'string') {
    const rgbObj = d3Rgb(color);
    if (Number.isFinite(rgbObj?.r) && Number.isFinite(rgbObj?.g) && Number.isFinite(rgbObj?.b)) {
      return [rgbObj.r, rgbObj.g, rgbObj.b];
    }
  }

  return null;
}

/**
 * Whether color is rgb
 * @returns
 */
export function isRgbColor(color: unknown): boolean {
  return Boolean(
    color &&
      Array.isArray(color) &&
      color.length === 3 &&
      color.every(n => Number.isFinite(n) && n <= 255 && n >= 0)
  );
}

/**
 * Take color values in 0-255 range and map to [0, 1]
 */
export function normalizeColor(color: number[]): number[] {
  return color.map(component => component / 255.0);
}
