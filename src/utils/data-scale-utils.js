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

import {notNullorUndefined, unique} from './data-utils';
import {extent} from 'd3-array';

/**
 * return quantile domain for an array of data
 * @param {array} data
 * @param {function | undefined} valueAccessor
 * @param {function | undefined} sortFunc
 * @returns {array} domain
 */
export function getQuantileDomain(data, valueAccessor, sortFunc) {
  const values =
    typeof valueAccessor === 'function' ? data.map(valueAccessor) : data;

  return values.filter(notNullorUndefined).sort(sortFunc);
}

/**
 * return ordinal domain for an array of data
 * @param {array} data
 * @param {function} valueAccessor
 * @returns {array} domain
 */
export function getOrdinalDomain(data, valueAccessor) {
  const values =
    typeof valueAccessor === 'function' ? data.map(valueAccessor) : data;

  return unique(values).filter(notNullorUndefined).sort();
}

/**
 * return linear domain for an array of data
 * @param {Array} data
 * @param {function} valueAccessor
 * @returns {Array} domain
 */
export function getLinearDomain(data, valueAccessor = null) {
  const range =
    typeof valueAccessor === 'function'
      ? extent(data, valueAccessor)
      : extent(data);

  return range.map((d, i) => (d === undefined ? i : d));
}

/**
 * return linear domain for an array of data. A log scale domain cannot contain 0
 * @param {Array} data
 * @param {function} valueAccessor
 * @returns {Array} domain
 */
export function getLogDomain(data, valueAccessor) {
  const [d0, d1] = getLinearDomain(data, valueAccessor);

  return [d0 === 0 ? 1e-5 : d0, d1];
}
