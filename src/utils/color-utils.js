// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * get r g b from hex code
 *
 * @param {string} hex
 * @returns {import('reducers/types').RGBColor} array of r g bs
 */
export function hexToRgb(hex) {
  const result = isHexColor(hex);

  if (!result) {
    return [0, 0, 0];
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return [r, g, b];
}

export function isHexColor(hex) {
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
 * @param {array} rgb
 * @returns {string} hex string
 */
export function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map(n => PadNum(n)).join('')}`.toUpperCase();
}

/**
 * Get color group name by parsing name, discard step in the name
 * e.g. Global Warming 6 -> Global Warming
 *
 * @param {Object} colorRange
 * @return {string | null}
 */
export function getColorGroupByName(colorRange) {
  if (!colorRange || typeof colorRange.name !== 'string') {
    return null;
  }

  return colorRange.name.replace(/\b[^a-zA-Z]+$/, '');
}

/**
 * Get a reversed colorRange
 * @param {Boolean} reversed
 * @param {Object} colorRange
 */
export function reverseColorRange(reversed, colorRange) {
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
 * @param {Array} colors
 * @return {string}
 */
export function createLinearGradient(direction, colors) {
  const step = parseFloat((100.0 / colors.length).toFixed(2));
  const bands = colors.map((rgb, index) => {
    return `rgba(${rgb.join(',')}, 1) ${step * index}%, rgba(${rgb.join(',')}, 1) ${step *
      (index + 1)}%`;
  });

  return `linear-gradient(to ${direction}, ${bands.join(',')})`;
}
