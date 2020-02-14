/* eslint-disable max-statements */
/* eslint-disable complexity */
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

/*****************************************************
 * This file is an adapted from mapshaper
 * https://github.com/mbloch/mapshaper
 * https://mapshaper.org/
 *****************************************************/
import {default as Console} from 'global/console';

export function isNumber(obj) {
  // return toString.call(obj) == '[object Number]'; // ie8 breaks?
  return obj !== null && obj.constructor === Number;
}

export function isString(obj) {
  return obj !== null && obj.toString === String.prototype.toString;
  // TODO: replace w/ something better.
}

export function isArray(obj) {
  return Array.isArray(obj);
}

export function isInteger(obj) {
  return isNumber(obj) && (obj | 0) === obj;
}

export function isObject(obj) {
  return obj === Object(obj); // via underscore
}
export function stringLooksLikeJSON(str) {
  return /^\s*[{[]/.test(String(str));
}

export function arrayToIndex(arr, val) {
  var init = arguments.length > 1;
  return arr.reduce((index, key) => {
    index[key] = init ? val : true;
    return index;
  }, {});
}

export function contains(container, item) {
  if (isString(container)) {
    return container.indexOf(item) !== -1;
  } else if (isArray(container)) {
    return container.indexOf(item) !== -1;
  }
  Console.warn('Expected Array or String argument');
}

export function difference(arr, other) {
  var index = arrayToIndex(other);
  return arr.filter(el => {
    return !Object.prototype.hasOwnProperty.call(index, el);
  });
}

export function regexEscape(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
