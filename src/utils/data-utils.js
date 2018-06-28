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

import moment from 'moment';
import assert from 'assert';
import {ALL_FIELD_TYPES} from 'constants/default-settings';

const MAX_LATITUDE = 90;
const MIN_LATITUDE = -90;
const MAX_LONGITUDE = 180;
const MIN_LONGITUDE = -180;

/**
 * simple getting unique values of an array
 *
 * @param {array} values
 * @returns {array} unique values
 */
export function unique(values) {
  const results = [];
  values.forEach(v => {
    if (!results.includes(v) && v !== null && v !== undefined) {
      results.push(v);
    }
  });

  return results;
}

/* eslint-disable max-statements */
/**
 * return center of map from given points
 * @param {array} layers
 * @param {string} dataId
 * @returns {object} coordinates of map center, empty if not found
 */
export function findMapBounds(layers) {
  // find bounds in formatted layerData
  // take ALL layers into account when finding map bounds
  const availableLayerBounds = layers.reduce((res, l) => {
    if (l.meta && l.meta.bounds) {
      res.push(l.meta.bounds);
    }
    return res;
  }, [])
  // return null if no layer is available
  if (availableLayerBounds.length === 0) {
    return null;
  }
  // merge bounds in each layer
  const newBounds = availableLayerBounds.reduce((res, b) => {
    return [
      Math.min(res[0], b[0]),
      Math.min(res[1], b[1]),
      Math.max(res[2], b[2]),
      Math.max(res[3], b[3])
    ];
  }, [MAX_LONGITUDE, MAX_LATITUDE, MIN_LONGITUDE, MIN_LATITUDE]);
  return newBounds;
}
/* eslint-enable max-statements */

export function getLatLngBounds(points, idx, limit) {
  const lats = points
    .map(d => Array.isArray(d) && d[idx])
    .filter(Number.isFinite)
    .sort(numberSort);

  if (!lats.length) {
    return null;
  }
  // use 99 percentile to filter out outliers
  // clamp to limit
  return [
    Math.max(lats[Math.floor(0.01 * (lats.length - 1))], limit[0]),
    Math.min(lats[Math.ceil(0.99 * (lats.length - 1))], limit[1])
  ];
}

export function getSampleData(data, sampleSize = 500) {
  const sampleStep = Math.max(Math.floor(data.length / sampleSize), 1);
  const output = [];
  for (let i = 0; i < data.length; i += sampleStep) {
    output.push(data[i]);
  }

  return output;
}

export function maybeToDate(isTime, fieldIdx, format, d) {
  if (isTime) {
    if (notNullorUndefined(d[fieldIdx])) {
      return typeof d[fieldIdx] === 'string'
        ? moment.utc(d[fieldIdx], format).valueOf()
        : format === 'x' ? d[fieldIdx] * 1000 : d[fieldIdx];
    }

    return null;
  }

  return d[fieldIdx];
}

export function notNullorUndefined(d) {
  return d !== undefined && d !== null;
}

export function isPlainObject(obj) {
  return (
    obj === Object(obj) && typeof obj !== 'function' && !Array.isArray(obj)
  );
}

export function numberSort(a, b) {
  return a - b;
}

export function getSortingFunction(fieldType) {
  switch (fieldType) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
    case ALL_FIELD_TYPES.timestamp:
      return numberSort;
    default:
      return undefined;
  }
}

/**
 * round number with exact number of decimals
 * return as a string
 * @param {number} num
 * @param {number} decimals
 * @returns {string} - a rounded number in string format
 */
export function preciseRound(num, decimals) {
  const t = Math.pow(10, decimals);
  return (
    Math.round(
      num * t +
        (decimals > 0 ? 1 : 0) *
          (Math.sign(num) * (10 / Math.pow(100, decimals)))
    ) / t
  ).toFixed(decimals);
}

/**
 * get number of decimals to round to for slider from step
 * @param {number} step
 * @returns {number} - number of decimal
 */
export function getRoundingDecimalFromStep(step) {
  if (isNaN(step)) {
    assert('step is not a number');
    assert(step);
  }

  const splitZero = step.toString().split('.');
  if (splitZero.length === 1) {
    return 0;
  }
  return splitZero[1].length;
}

/**
 * round the value to step for the slider
 * @param {number} minValue
 * @param {number} step
 * @param {number} val
 * @returns {number} - rounded number
 */
export function roundValToStep(minValue, step, val) {
  if (isNaN(step)) {
    return val;
  }

  const decimal = getRoundingDecimalFromStep(step);
  const steps = Math.floor((val - minValue) / step);
  let remain = val - (steps * step + minValue);

  // has to round because javascript turns 0.1 into 0.9999999999999987
  remain = Number(preciseRound(remain, 8));

  let closest;
  if (remain === 0) {
    closest = val;
  } else if (remain < step / 2) {
    closest = steps * step + minValue;
  } else {
    closest = (steps + 1) * step + minValue;
  }

  // precise round return a string rounded to the defined decimal
  const rounded = preciseRound(closest, decimal);

  return Number(rounded);
}
