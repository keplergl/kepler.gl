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

import assert from 'assert';
import {
  ALL_FIELD_TYPES,
  TOOLTIP_FORMATS,
  TOOLTIP_FORMAT_TYPES,
  TOOLTIP_KEY
} from '@kepler.gl/constants';
import {format as d3Format} from 'd3-format';
import {bisectLeft} from 'd3-array';
import moment from 'moment-timezone';

import {Millisecond, Field} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {Bounds} from 'reducers/map-state-updaters';
import {DataContainerInterface} from './table-utils/data-container-interface';

export type FieldFormatter = (value: any) => string;

const MAX_LATITUDE = 90;
const MIN_LATITUDE = -90;
const MAX_LONGITUDE = 180;
const MIN_LONGITUDE = -180;

/**
 * simple getting unique values of an array
 *
 * @param values
 * @returns unique values
 */
export function unique<T>(values: T[]) {
  const results: T[] = [];
  const uniqueSet = new Set(values);
  uniqueSet.forEach(v => {
    if (notNullorUndefined(v)) {
      results.push(v);
    }
  });
  return results;
}

/**
 * return center of map from given points
 * @param layers
 * @returns coordinates of map center, empty if not found
 */
export function findMapBounds(layers: Layer[]): Bounds | null {
  // find bounds in formatted layerData
  // take ALL layers into account when finding map bounds
  const availableLayerBounds: Bounds | [] = layers.reduce((res, l) => {
    // @ts-expect-error
    if (l.meta && l.meta.bounds) {
      // @ts-expect-error
      res.push(l.meta.bounds);
    }
    return res;
  }, []);
  // return null if no layer is available
  if (availableLayerBounds.length === 0) {
    return null;
  }
  // merge bounds in each layer
  const newBounds = (availableLayerBounds as Bounds).reduce(
    (res, b) => {
      return [
        Math.min(res[0], b[0]),
        Math.min(res[1], b[1]),
        Math.max(res[2], b[2]),
        Math.max(res[3], b[3])
      ];
    },
    [MAX_LONGITUDE, MAX_LATITUDE, MIN_LONGITUDE, MIN_LATITUDE]
  );
  // @ts-expect-error
  return newBounds;
}

export function getLatLngBounds(
  points: number[][],
  idx: number,
  limit: [number, number]
): [number, number] | null {
  const lats = points
    .map(d => Number(Array.isArray(d)) && d[idx])
    .filter(Number.isFinite)
    .sort(numberSort);

  if (!lats.length) {
    return null;
  }

  // clamp to limit
  return [Math.max(lats[0], limit[0]), Math.min(lats[lats.length - 1], limit[1])];
}

export function clamp([min, max]: [number, number], val: number = 0): number {
  return val <= min ? min : val >= max ? max : val;
}

export function getSampleData(data, sampleSize = 500, getValue = d => d) {
  const sampleStep = Math.max(Math.floor(data.length / sampleSize), 1);
  const output: any[] = [];
  for (let i = 0; i < data.length; i += sampleStep) {
    output.push(getValue(data[i]));
  }

  return output;
}

/**
 * Convert different time format to unix milliseconds
 */
export function timeToUnixMilli(value: string | number, format: string): Millisecond | null {
  if (notNullorUndefined(value)) {
    return typeof value === 'string'
      ? moment.utc(value, format).valueOf()
      : format === 'x'
      ? value * 1000
      : value;
  }
  return null;
}

export function maybeToDate(
  isTime: boolean,
  fieldIdx: number,
  format: string,
  dc: DataContainerInterface,
  d: {index: number}
) {
  if (isTime) {
    return timeToUnixMilli(dc.valueAt(d.index, fieldIdx), format);
  }

  return dc.valueAt(d.index, fieldIdx);
}

/**
 * whether null or undefined
 */
export function notNullorUndefined<T extends NonNullable<any>>(d: T | null | undefined): d is T {
  return d !== undefined && d !== null;
}

/**
 * Whether d is a number, this filtered out NaN as well
 */
export function isNumber(d: any): boolean {
  return Number.isFinite(d);
}

/**
 * whether is an object
 * @returns {boolean} - yes or no
 */
export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return obj === Object(obj) && typeof obj !== 'function' && !Array.isArray(obj);
}

/**
 * whether object has property
 * @param {string} prop
 * @returns {boolean} - yes or no
 */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export function numberSort(a: number, b: number): number {
  return a - b;
}

export function getSortingFunction(fieldType: string): typeof numberSort | undefined {
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
 */
export function preciseRound(num: number, decimals: number): string {
  const t = Math.pow(10, decimals);
  return (
    Math.round(
      num * t + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))
    ) / t
  ).toFixed(decimals);
}

/**
 * get number of decimals to round to for slider from step
 * @param step
 * @returns- number of decimal
 */
export function getRoundingDecimalFromStep(step: number): number {
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
 * Use in slider, given a number and an array of numbers, return the nears number from the array
 * @param value
 * @param marks
 */
export function snapToMarks(value: number, marks: number[]): number {
  // always use bin x0
  const i = bisectLeft(marks, value);
  if (i === 0) {
    return marks[i];
  } else if (i === marks.length) {
    return marks[i - 1];
  }
  const idx = marks[i] - value < value - marks[i - 1] ? i : i - 1;
  return marks[idx];
}

/**
 * If marks is provided, snap to marks, if not normalize to step
 * @param val
 * @param minValue
 * @param step
 * @param marks
 */
export function normalizeSliderValue(
  val: number,
  minValue: number,
  step: number,
  marks?: number[]
): number {
  if (marks && marks.length) {
    return snapToMarks(val, marks);
  }

  return roundValToStep(minValue, step, val);
}

/**
 * round the value to step for the slider
 * @param minValue
 * @param step
 * @param val
 * @returns - rounded number
 */
export function roundValToStep(minValue: number, step: number, val: number): number {
  if (!isNumber(step) || !isNumber(minValue)) {
    return val;
  }

  const decimal = getRoundingDecimalFromStep(step);
  const steps = Math.floor((val - minValue) / step);
  let remain = val - (steps * step + minValue);

  // has to round because javascript turns 0.1 into 0.9999999999999987
  remain = Number(preciseRound(remain, 8));

  let closest: number;
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

/**
 * Get the value format based on field and format options
 * Used in render tooltip value
 */
export const defaultFormatter: FieldFormatter = v => (notNullorUndefined(v) ? String(v) : '');

export const FIELD_DISPLAY_FORMAT: {
  [key: string]: FieldFormatter;
} = {
  [ALL_FIELD_TYPES.string]: defaultFormatter,
  [ALL_FIELD_TYPES.timestamp]: defaultFormatter,
  [ALL_FIELD_TYPES.integer]: defaultFormatter,
  [ALL_FIELD_TYPES.real]: defaultFormatter,
  [ALL_FIELD_TYPES.boolean]: defaultFormatter,
  [ALL_FIELD_TYPES.date]: defaultFormatter,
  [ALL_FIELD_TYPES.geojson]: d =>
    typeof d === 'string'
      ? d
      : isPlainObject(d)
      ? JSON.stringify(d)
      : Array.isArray(d)
      ? `[${String(d)}]`
      : ''
};

/**
 * Parse field value and type and return a string representation
 */
export const parseFieldValue = (value: any, type: string): string => {
  if (!notNullorUndefined(value)) {
    return '';
  }

  return FIELD_DISPLAY_FORMAT[type] ? FIELD_DISPLAY_FORMAT[type](value) : String(value);
};

const arrayMoveMutate = <T>(array: T[], from: number, to: number) => {
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

/**
 *
 * @param array
 * @param from
 * @param to
 */
export const arrayMove = <T>(array: T[], from: number, to: number) => {
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
};

/**
 * Get the value format based on field and format options
 * Used in render tooltip value
 * @param format
 * @param field
 */
export function getFormatter(
  format: string | Record<string, string>,
  field?: Field
): FieldFormatter {
  if (!format) {
    return defaultFormatter;
  }
  const tooltipFormat = Object.values(TOOLTIP_FORMATS).find(f => f[TOOLTIP_KEY] === format);

  if (tooltipFormat) {
    return applyDefaultFormat(tooltipFormat);
  } else if (typeof format === 'string' && field) {
    return applyCustomFormat(format, field);
  }

  return defaultFormatter;
}

export function applyDefaultFormat(tooltipFormat) {
  if (!tooltipFormat || !tooltipFormat.format) {
    return defaultFormatter;
  }

  switch (tooltipFormat.type) {
    case TOOLTIP_FORMAT_TYPES.DECIMAL:
      return d3Format(tooltipFormat.format);
    case TOOLTIP_FORMAT_TYPES.DATE:
    case TOOLTIP_FORMAT_TYPES.DATE_TIME:
      return datetimeFormatter(null)(tooltipFormat.format);
    case TOOLTIP_FORMAT_TYPES.PERCENTAGE:
      return v => `${d3Format(TOOLTIP_FORMATS.DECIMAL_DECIMAL_FIXED_2.format)(v)}%`;
    case TOOLTIP_FORMAT_TYPES.BOOLEAN:
      return getBooleanFormatter(tooltipFormat.format);
    default:
      return defaultFormatter;
  }
}

export function getBooleanFormatter(format: string): FieldFormatter {
  switch (format) {
    case '01':
      return (v: Boolean) => (v ? '1' : '0');
    case 'yn':
      return (v: Boolean) => (v ? 'yes' : 'no');
    default:
      return defaultFormatter;
  }
}
// Allow user to specify custom tooltip format via config
export function applyCustomFormat(format, field): FieldFormatter {
  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      return d3Format(format);
    case ALL_FIELD_TYPES.date:
    case ALL_FIELD_TYPES.timestamp:
      return datetimeFormatter(null)(format);
    default:
      return v => v;
  }
}

/**
 * Format epoch milliseconds with a format string
 * @type timezone
 */
export function datetimeFormatter(
  timezone?: string | null
): (format?: string) => (ts: number) => string {
  return timezone
    ? format => ts =>
        moment
          .utc(ts)
          .tz(timezone)
          .format(format)
    : format => ts => moment.utc(ts).format(format);
}
