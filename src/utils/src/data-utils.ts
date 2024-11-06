// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import assert from 'assert';
import {format as d3Format} from 'd3-format';
import moment from 'moment-timezone';

import {
  ALL_FIELD_TYPES,
  TOOLTIP_FORMATS,
  TOOLTIP_FORMAT_TYPES,
  TOOLTIP_KEY,
  TooltipFormat
} from '@kepler.gl/constants';
import {Field, Millisecond} from '@kepler.gl/types';

import {snapToMarks} from './plot';
import {isPlainObject} from './utils';

export type FieldFormatter = (value: any) => string;

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

export function clamp([min, max]: [number, number], val = 0): number {
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
export function timeToUnixMilli(value: string | number | Date, format: string): Millisecond | null {
  if (notNullorUndefined(value)) {
    if (typeof value === 'string') {
      return moment.utc(value, format).valueOf();
    }
    if (typeof value === 'number') {
      return format === 'x' ? value * 1000 : value;
    }
    if (value instanceof Date) {
      return value.valueOf();
    }
  }
  return null;
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
export function isNumber(d: unknown): d is number {
  return Number.isFinite(d);
}

/**
 * whether object has property
 * @param {string} prop
 * @returns {boolean} - yes or no
 */
export function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
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
 * round a giving number at most 4 decimal places
 * e.g. 10 -> 10, 1.12345 -> 1.2345, 2.0 -> 2
 */
export function roundToFour(num: number): number {
  // @ts-expect-error
  return Number(`${Math.round(`${num}e+4`)}e-4`);
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

  const stepStr = step.toString();

  // in case the step is a very small number e.g. 1e-7, return decimal e.g. 7 directly
  const splitExponential = stepStr.split('e-');
  if (splitExponential.length === 2) {
    const coeffZero = splitExponential[0].split('.');
    const coeffDecimal = coeffZero.length === 1 ? 0 : coeffZero[1].length;
    return parseInt(splitExponential[1], 10) + coeffDecimal;
  }

  const splitZero = stepStr.split('.');
  if (splitZero.length === 1) {
    return 0;
  }
  return splitZero[1].length;
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
    // Use in slider, given a number and an array of numbers, return the nears number from the array
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

export const floatFormatter = v => (isNumber(v) ? String(roundToFour(v)) : '');

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
      : '',
  [ALL_FIELD_TYPES.geoarrow]: d => d,
  [ALL_FIELD_TYPES.object]: JSON.stringify,
  [ALL_FIELD_TYPES.array]: JSON.stringify
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

/**
 * Get the value format based on field and format options
 * Used in render tooltip value
 * @param format
 * @param field
 */
export function getFormatter(
  format: string | Record<string, string> | null,
  field?: Field
): FieldFormatter {
  if (!format) {
    return defaultFormatter;
  }
  const tooltipFormat = Object.values(TOOLTIP_FORMATS).find(f => f[TOOLTIP_KEY] === format);

  if (tooltipFormat) {
    return applyDefaultFormat(tooltipFormat as TooltipFormat);
  } else if (typeof format === 'string' && field) {
    return applyCustomFormat(format, field);
  }

  return defaultFormatter;
}

export function getColumnFormatter(
  field: Pick<Field, 'type'> & Partial<Pick<Field, 'format' | 'displayFormat'>>
): FieldFormatter {
  const {format, displayFormat} = field;

  if (!format && !displayFormat) {
    return FIELD_DISPLAY_FORMAT[field.type];
  }
  const tooltipFormat = Object.values(TOOLTIP_FORMATS).find(f => f[TOOLTIP_KEY] === displayFormat);

  if (tooltipFormat) {
    return applyDefaultFormat(tooltipFormat);
  } else if (typeof displayFormat === 'string' && field) {
    return applyCustomFormat(displayFormat, field);
  } else if (typeof displayFormat === 'object') {
    return applyValueMap(displayFormat);
  }

  return defaultFormatter;
}

export function applyValueMap(format) {
  return v => format[v];
}

export function applyDefaultFormat(tooltipFormat: TooltipFormat): (v: any) => string {
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
      return (v: boolean) => (v ? '1' : '0');
    case 'yn':
      return (v: boolean) => (v ? 'yes' : 'no');
    default:
      return defaultFormatter;
  }
}
// Allow user to specify custom tooltip format via config
export function applyCustomFormat(format, field: {type?: string}): FieldFormatter {
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

function formatLargeNumber(n) {
  // SI-prefix with 4 significant digits
  return d3Format('.4~s')(n);
}

export function formatNumber(n: number, type?: string): string {
  switch (type) {
    case ALL_FIELD_TYPES.integer:
      if (n < 0) {
        return `-${formatNumber(-n, 'integer')}`;
      }
      if (n < 1000) {
        return `${Math.round(n)}`;
      }
      if (n < 10 * 1000) {
        return d3Format(',')(Math.round(n));
      }
      return formatLargeNumber(n);
    case ALL_FIELD_TYPES.real:
      if (n < 0) {
        return `-${formatNumber(-n, 'number')}`;
      }
      if (n < 1000) {
        return d3Format('.4~r')(n);
      }
      if (n < 10 * 1000) {
        return d3Format(',.2~f')(n);
      }
      return formatLargeNumber(n);

    default:
      return formatNumber(n, 'real');
  }
}

const transformation = {
  Y: Math.pow(10, 24),
  Z: Math.pow(10, 21),
  E: Math.pow(10, 18),
  P: Math.pow(10, 15),
  T: Math.pow(10, 12),
  G: Math.pow(10, 9),
  M: Math.pow(10, 6),
  k: Math.pow(10, 3),
  h: Math.pow(10, 2),
  da: Math.pow(10, 1),
  d: Math.pow(10, -1),
  c: Math.pow(10, -2),
  m: Math.pow(10, -3),
  μ: Math.pow(10, -6),
  n: Math.pow(10, -9),
  p: Math.pow(10, -12),
  f: Math.pow(10, -15),
  a: Math.pow(10, -18),
  z: Math.pow(10, -21),
  y: Math.pow(10, -24)
};

/**
 * Convert a formatted number from string back to number
 */
export function reverseFormatNumber(str: string): number {
  let returnValue: number | null = null;
  const strNum = str.trim().replace(/,/g, '');
  Object.entries(transformation).forEach(d => {
    if (strNum.includes(d[0])) {
      returnValue = parseFloat(strNum) * d[1];
      return true;
    }
    return false;
  });

  // if no transformer found, convert to nuber regardless
  return returnValue === null ? Number(strNum) : returnValue;
}

/**
 * Format epoch milliseconds with a format string
 * @type timezone
 */
export function datetimeFormatter(
  timezone?: string | null
): (format?: string) => (ts: number) => string {
  return timezone
    ? format => ts => moment.utc(ts).tz(timezone).format(format)
    : // return empty string instead of 'Invalid date' if ts is undefined/null
      format => ts => ts ? moment.utc(ts).format(format) : '';
}

export function notNullOrUndefined(d: any): boolean {
  return d !== undefined && d !== null;
}
