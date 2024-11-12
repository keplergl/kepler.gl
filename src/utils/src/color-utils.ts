// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ColorRange} from '@kepler.gl/constants';
import {HexColor, RGBColor} from '@kepler.gl/types';
import {rgb as d3Rgb} from 'd3-color';
import {interpolate} from 'd3-interpolate';
import {arrayInsert, arrayMove} from './utils';

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
 * @param colorRange
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
  const newColors = colorRange?.colors.slice().reverse();
  const updated = replaceColorsInColorRange(colorRange, newColors);
  updated.reversed = reversed;

  return updated;
}

/**
 * Whether color range has custom color map
 */
export function hasColorMap(colorRange: ColorRange): boolean {
  return Array.isArray(colorRange.colorMap) && Boolean(colorRange.colorMap.length);
}

/**
 * given a list of rgb arrays it will generate a linear gradient css rule
 * @param direction
 * @param colors
 * @return
 */
export function createLinearGradient(direction: string, colors: RGBColor[]): string {
  const step = parseFloat((100.0 / colors.length).toFixed(2));
  const bands = colors.map((rgb, index) => {
    return `rgba(${rgb.join(',')}, 1) ${step * index}%, rgba(${rgb.join(',')}, 1) ${
      step * (index + 1)
    }%`;
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

export function interpolateHex(hex1, hex2) {
  return d3Rgb(interpolate(hex1, hex2)(0.5))
    .hex()
    .toUpperCase();
}

export function addNewQuantativeColorBreakAtIndex(colorMap, index, newColors) {
  if (!Array.isArray(colorMap) || !colorMap.length) {
    return colorMap;
  }

  if (colorMap.length < 2) {
    // less then 2, add 1 at end
    // however shouldn't allow delete when there are 2
    return newColors.map((c, i) => (i === 0 ? colorMap[i] : [null, c]));
  }

  // breaks should be 1 less than colors
  const breaks = colorMap.map(cm => cm[0]).slice(0, colorMap.length - 1);

  // insert new break
  const newValue =
    index >= breaks.length - 1
      ? breaks[breaks.length - 1] +
        (breaks.length > 1 ? breaks[breaks.length - 1] - breaks[breaks.length - 2] : 0)
      : (breaks[index] + breaks[index + 1]) / 2;

  const newBreaks = arrayInsert(breaks, index + 1, newValue);

  // asign breaks to color
  return newColors.map((c, i) =>
    i === newColors.length - 1 ? [null, c] : [newBreaks[i] === undefined ? null : newBreaks[i], c]
  );
}

/**
 * Add a new color to custom palette
 */
export function addCustomPaletteColor(customPalette: ColorRange, index: number): ColorRange {
  const {colors, colorMap} = customPalette;
  const update: Partial<ColorRange> = {};

  const newColor =
    index === colors.length - 1 ? colors[index] : interpolateHex(colors[index], colors[index + 1]);

  update.colors = arrayInsert(colors, index + 1, newColor);

  // add color to colorMap
  if (colorMap) {
    update.colorMap = addNewQuantativeColorBreakAtIndex(colorMap, index, update.colors);
  }

  return {
    ...customPalette,
    ...update
  };
}

function replaceColorsInColorRange(colorRange, newColors) {
  const oldColors = colorRange.colors;
  const updated = {
    ...colorRange,
    colors: newColors
  };

  // update color map
  // keep value, replace color
  if (Array.isArray(updated.colorMap)) {
    updated.colorMap = updated.colorMap.map((cm, i) => [cm[0], newColors[i]]);
  }
  // update colorlegends
  // keep value, replace color
  if (updated.colorLegends) {
    updated.colorLegends = Object.keys(updated.colorLegends).reduce((accu, key) => {
      const colorIdx = oldColors.findIndex(c => c === key);
      const newColor = newColors[colorIdx];

      return newColor
        ? {
            ...accu,
            [newColor]: updated.colorLegends[key]
          }
        : accu;
    }, {});
  }

  return updated;
}

/**
 * Sort custom palette
 */
export function sortCustomPaletteColor(
  customPalette: ColorRange,
  oldIndex: number,
  newIndex: number
): ColorRange {
  const {colors} = customPalette;

  const newColors = arrayMove(colors, oldIndex, newIndex);
  const update = replaceColorsInColorRange(customPalette, newColors);

  // @ts-ignore
  return {
    ...customPalette,
    ...update
  };
}

/**
 * remove a color in custom palette at index
 */
export function removeCustomPaletteColor(customPalette: ColorRange, index: number): ColorRange {
  const {colors, colorMap, colorLegends} = customPalette;
  const oldValue = colors[index];
  const update: Partial<ColorRange> = {};
  update.colors = [...colors];

  if (update.colors.length > 1) {
    update.colors.splice(index, 1);
  }
  // update color map
  if (Array.isArray(colorMap)) {
    // find colorMap index
    const colorMapIndex = colorMap.findIndex(cm => cm[1] === oldValue);
    if (colorMapIndex > 0) {
      update.colorMap = [...colorMap];
      update.colorMap.splice(colorMapIndex, 1);
    }
  }
  // update color legend
  if (colorLegends?.[oldValue]) {
    update.colorLegends = {...colorLegends};
    delete update.colorLegends[oldValue];
  }

  return {
    ...customPalette,
    ...update
  };
}

/**
 * Update a color in custom palette at index
 */
export function updateCustomPaletteColor(
  customPalette: ColorRange,
  index: number,
  newValue: HexColor
): ColorRange {
  const {colors} = customPalette;
  const hex = newValue.toUpperCase();
  const newColors = [...colors];
  newColors[index] = hex;

  const update = replaceColorsInColorRange(customPalette, newColors);

  // @ts-ignore
  return {
    ...customPalette,
    ...update
  };
}

/**
 * Update color range, copy over colorMap and colorLegends
 */
export function updateColorRange(oldColorRange: ColorRange, newColorRange: ColorRange): ColorRange {
  const colorRange = {
    ...newColorRange,
    colors: oldColorRange.colors,
    ...(oldColorRange.colorMap ? {colorMap: oldColorRange.colorMap} : {}),
    ...(oldColorRange.colorLegends ? {colorLegends: oldColorRange.colorLegends} : {})
  };

  return replaceColorsInColorRange(colorRange, newColorRange.colors);
}
