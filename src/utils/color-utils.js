/**
 * get r g b from hex code
 *
 * @param {string} hex
 * @returns {array} array of r g bs
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return [r, g, b];
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
