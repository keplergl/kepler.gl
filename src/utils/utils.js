// Copyright (c) 2018 Uber Technologies, Inc.
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
export function generateHashId(count) {
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
 * whether is an object
 * @returns {boolean} - yes or no
 */
export function isPlainObject(obj) {
  return (
    obj === Object(obj) && typeof obj !== 'function' && !Array.isArray(obj)
  );
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
