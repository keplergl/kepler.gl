// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Window from 'global/window';
import {capitalizeFirstLetter} from './strings';

/**
 * Generate a hash string based on string
 * @param str
 * @returns
 */
export function generateHashIdFromString(str: string): string {
  // generate hash string based on string
  let hash = 0;
  let i;
  let chr;
  let len;
  if (str.length === 0) return hash.toString();
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Detect chrome
 * @returns {boolean} - yes or no
 */
export function isChrome(): boolean {
  // Chrome 1+
  return Window.chrome && Window.chrome.webstore;
}

/**
 * Convert camel style names to title
 * strokeColor -> Stroke Color
 * @param {string} str
 * @returns {string}
 */
export function camelToTitle(str: string): string {
  const breakWord = str.replace(/([A-Z])/g, ' $1');
  return capitalizeFirstLetter(breakWord);
}

/**
 * Convert names to camel style
 * Stroke Color -> strokeColor
 * @param {string} str
 * @returns {string}
 */
export const camelize = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (Number(match) === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

/**
 * immutably insert value to an Array or Object
 * @param {Array|Object} obj
 * @param {Number|String} key
 * @param {*} value
 * @returns {Array|Object}
 */
export const insertValue = <T extends any[] | object>(
  obj: T,
  key: number | string,
  value: any
): T => {
  if (Array.isArray(obj) && typeof key === 'number') {
    return [...obj.slice(0, key), value, ...obj.slice(key + 1, obj.length)] as T;
  }

  return {...obj, [key]: value};
};

/**
 * check if value is a loose object including a plain object, array, function
 * @param {*} value
 */
export function isObject(value): boolean {
  return value !== null && (typeof value === 'object' || typeof value === 'function');
}

/**
 * whether is an object
 * @returns {boolean} - yes or no
 */
export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return obj === Object(obj) && typeof obj !== 'function' && !Array.isArray(obj);
}

const setPath = <T extends any[] | object>(
  [key, ...next]: (string | number)[],
  value: any,
  obj: object | any[]
): T => {
  // is Object allows js object, array and function
  if (!isObject(obj)) {
    return obj as T;
  }

  if (next.length === 0) {
    return insertValue(obj, key, value) as T;
  }

  // @ts-ignore
  return insertValue(
    obj,
    key,
    setPath(next, value, Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : {})
  );
};

/**
 * Immutable version of _.set
 * @param {Array<String|Number>} path
 * @param {*} value
 * @param {Object} obj
 * @returns {Object}
 */
// @ts-ignore
export const set = <T extends any[] | object>(path: (string | number)[], value: any, obj: T): T =>
  obj === null ? obj : setPath(path, value, obj);

type ErrorObject = {
  error?: any;
  err?: any;
  message?: any;
};

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong';

/**
 * Get error information of unknown type
 * Extracts as much human readable information as possible
 * Ensure result is an Error object suitable for throw or promise rejection
 *
 * @private
 * @param {*}  err - Unknown error
 * @return {string} - human readable error msg
 */
export function getError(
  err?: Error | ErrorObject | string,
  defaultMessage: string = DEFAULT_ERROR_MESSAGE
): string {
  if (!err) {
    return defaultMessage;
  }

  if (typeof err === 'string') {
    return err;
  } else if (err instanceof Error) {
    return err.message;
  } else if (typeof err === 'object') {
    return Object.prototype.hasOwnProperty.call(err, 'message')
      ? getError(err.message)
      : Object.prototype.hasOwnProperty.call(err, 'error')
      ? getError(err.error)
      : Object.prototype.hasOwnProperty.call(err, 'err')
      ? getError(err.err)
      : JSON.stringify(err);
  }

  return defaultMessage;
}

export function arrayInsert<T>(arr: T[], index: number, val: T): T[] {
  if (!Array.isArray(arr)) {
    return arr;
  }

  return [...arr.slice(0, index), val, ...arr.slice(index)];
}

export function hasMobileWidth(breakPointValues: {palm: number; desk: number}): boolean {
  const mobileWidth = Window.matchMedia(`(max-width: ${breakPointValues.palm}px)`);
  return mobileWidth.matches;
}

export function hasPortableWidth(breakPointValues: {palm: number; desk: number}): boolean {
  const mobileWidth = Window.matchMedia(`(max-width: ${breakPointValues.desk}px)`);
  return mobileWidth.matches;
}

export function isTest(): boolean {
  return globalThis.process?.env?.NODE_ENV === 'test';
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

export function isFunction(func: unknown): boolean {
  return typeof func === 'function';
}

export function findById(id: string): <X extends {id: string}>(arr: X[]) => X | undefined {
  return arr => arr.find(a => a.id === id);
}

/**
 * Returns array difference from
 */
export function arrayDifference<X extends {id: string}>(source: X[]): (compare: X[]) => X[] {
  const initial: X[] = [];
  return compare =>
    source.reduce((acc, element) => {
      const foundElement = findById(element.id)(compare);
      return foundElement ? [...acc, foundElement] : acc;
    }, initial);
}
