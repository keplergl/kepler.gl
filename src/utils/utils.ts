// Copyright (c) 2022 Uber Technologies, Inc.
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

import window from 'global/window';

/**
 * Generate a hash string based on number of character
 * @param {number} count
 * @returns {string} hash string
 */
export function generateHashId(count = 6) {
  return Math.random()
    .toString(36)
    .substr(count);
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
 * Capitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirstLetter(str) {
  return typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

/**
 * Convert camel style names to title
 * strokeColor -> Stroke Color
 * @param {string} str
 * @returns {string}
 */
export function camelToTitle(str) {
  const breakWord = str.replace(/([A-Z])/g, ' $1');
  return capitalizeFirstLetter(breakWord);
}

/**
 * Convert names to camel style
 * Stroke Color -> strokeColor
 * @param {string} str
 * @returns {string}
 */
export const camelize = str => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (Number(match) === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

/**
 * Returns the img url for a given map export option
 * @param mode export option
 * @return {string} url
 */
export function getHTMLMapModeTileUrl(mode) {
  return `https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/map-${mode.toLowerCase()}-mode.png`;
}

/**
 * Converts non-arrays to arrays.  Leaves arrays alone.  Converts
 * undefined values to empty arrays ([] instead of [undefined]).
 * Otherwise, just returns [item] for non-array items.
 *
 * @param {*} item
 * @returns {array} boom! much array. very indexed. so useful.
 */
export function toArray(item) {
  if (Array.isArray(item)) {
    return item;
  }

  if (typeof item === 'undefined' || item === null) {
    return [];
  }

  return [item];
}

/**
 * immutably insert value to an Array or Object
 * @param {Array|Object} obj
 * @param {Number|String} key
 * @param {*} value
 * @returns {Array|Object}
 */
export const insertValue = (obj, key, value) => {
  if (Array.isArray(obj) && typeof key === 'number') {
    return [...obj.slice(0, key), value, ...obj.slice(key + 1, obj.length)];
  }

  return {...obj, [key]: value};
};

/**
 * check if value is a loose object including a plain object, array, function
 * @param {*} value
 */
export function isObject(value) {
  return value !== null && (typeof value === 'object' || typeof value === 'function');
}

const setPath = ([key, ...next], value, obj) => {
  // is Object allows js object, array and function
  if (!isObject(obj)) {
    return obj;
  }

  if (next.length === 0) {
    return insertValue(obj, key, value);
  }

  // @ts-ignore
  return insertValue(obj, key, setPath(next, value, obj.hasOwnProperty(key) ? obj[key] : {}));
};

/**
 * Immutable version of _.set
 * @param {Array<String|Number>} path
 * @param {*} value
 * @param {Object} obj
 * @returns {Object}
 */
// @ts-ignore
export const set = (path, value, obj) => (obj === null ? obj : setPath(path, value, obj));

/**
 * Get error information of unknown type
 * Extracts as much human readable information as possible
 * Ensure result is an Error object suitable for throw or promise rejection
 *
 * @private
 * @param {*}  err - Unknown error
 * @return {string} - human readable error msg
 */
export function getError(err) {
  if (!err) {
    return 'Something went wrong';
  }

  if (typeof err === 'string') {
    return err;
  } else if (err instanceof Error) {
    return err.message;
  } else if (typeof err === 'object') {
    return err.error
      ? getError(err.error)
      : err.err
      ? getError(err.err)
      : err.message
      ? getError(err.message)
      : JSON.stringify(err);
  }

  // @ts-ignore
  return null;
}

export function arrayInsert(arr, index, val) {
  if (!Array.isArray(arr)) {
    return arr;
  }

  return [...arr.slice(0, index), val, ...arr.slice(index)];
}

export function isTest() {
  return process?.env?.NODE_ENV === 'test';
}

/**
 * Filters an object by an arbitrary predicate
 * Returns a new object containing all elements that match the predicate
 * @param {Object} obj Object to be filtered
 * @param {Function} predicate Predicate by which the object will be filtered
 * @returns {Object}
 */
export function filterObjectByPredicate(obj, predicate) {
  return Object.entries(obj).reduce(
    (acc, entry) => (predicate(entry[0], entry[1]) ? {...acc, [entry[0]]: entry[1]} : acc),
    {}
  );
}
