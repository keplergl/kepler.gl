// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {bisectLeft} from 'd3-array';

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
