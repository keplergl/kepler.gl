// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Analyzer, DATA_TYPES} from 'type-analyzer';

import {Field} from '@kepler.gl/types';

export function notNullorUndefined<T extends NonNullable<any>>(d: T | null | undefined): d is T {
  return d !== undefined && d !== null;
}

/**
 * Check if string is a valid Well-known binary (WKB) in HEX format
 * https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry
 *
 * @param str input string
 * @returns true if string is a valid WKB in HEX format
 */
export function isHexWkb(str: string | null): boolean {
  if (!str) return false;
  // check if the length of the string is even and is at least 10 characters long
  if (str.length < 10 || str.length % 2 !== 0) {
    return false;
  }
  // check if first two characters are 00 or 01
  if (!str.startsWith('00') && !str.startsWith('01')) {
    return false;
  }
  // check if the rest of the string is a valid hex
  return /^[0-9a-fA-F]+$/.test(str.slice(2));
}

/**
 * Converts non-arrays to arrays.  Leaves arrays alone.  Converts
 * undefined values to empty arrays ([] instead of [undefined]).
 * Otherwise, just returns [item] for non-array items.
 *
 * @param {*} item
 * @returns {array} boom! much array. very indexed. so useful.
 */
export function toArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  }

  if (typeof item === 'undefined' || item === null) {
    return [];
  }

  return [item];
}

/**
 * Move an array item to a different position. Returns a new array with the item moved to the new position.
 */
export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);

  return newArray;
}

/**
 * Check whether geojson linestring's 4th coordinate is 1) not timestamp 2) unix time stamp 3) real date time
 * @param timestamps array to be tested if its elements are timestamp
 * @returns the type of timestamp: unix/datetime/invalid(not timestamp)
 */
export function containValidTime(timestamps: string[]): Field | null {
  const formattedTimeStamps = timestamps.map(ts => ({ts}));
  const ignoredDataTypes = Object.keys(DATA_TYPES).filter(
    type => ![DATA_TYPES.TIME, DATA_TYPES.DATETIME, DATA_TYPES.DATE].includes(type)
  );

  // ignore all types but TIME to improve performance
  const analyzedType = Analyzer.computeColMeta(formattedTimeStamps, [], {ignoredDataTypes})[0];

  if (!analyzedType || analyzedType.category !== 'TIME') {
    return null;
  }
  return analyzedType;
}
