import window from 'global/window';

/**
 * Generate a hash string based on number of character
 * @param {number} count
 * @returns {string} hash string
 */
export function generateHashId(count) {
  return Math.random().toString(36).substr(count);
}

/**
 * Detect chrome
 * @returns {boolean} - yes or no
 */
export function isChrome() {
  // Chrome 1+
  return window.chrome && window.chrome.webstore;
}

/**
 * whether is an object
 * @returns {boolean} - yes or no
 */
export function isPlainObject(obj) {
  return obj === Object(obj) && typeof obj !== 'function' && !Array.isArray(obj);
}

/**
 * whether null or undefined
 * @returns {boolean} - yes or no
 */
export function notNullorUndefined(d) {
  return d !== undefined && d !== null;
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}