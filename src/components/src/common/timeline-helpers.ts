// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {clamp} from '@kepler.gl/utils';

export function rangesEqual(
  a: [number, number] | null,
  b: [number, number] | null,
  eps = 1
): boolean {
  if (!a || !b) {
    return false;
  }
  return Math.abs(a[0] - b[0]) <= eps && Math.abs(a[1] - b[1]) <= eps;
}

export function clampRange(
  [start, end]: [number, number],
  [min, max]: [number, number]
): [number, number] {
  const clampedStart = clamp([min, max], start);
  let clampedEnd = clamp([min, max], end);
  if (clampedEnd <= clampedStart) {
    clampedEnd = Math.min(max, clampedStart + 1);
  }
  return [clampedStart, clampedEnd];
}

export function clampWindowToDomain(
  windowStart: number,
  windowEnd: number,
  domainRange: [number, number]
): [number, number] {
  const [domainStart, domainEnd] = domainRange;
  let nextStart = clamp(domainRange, windowStart);
  let nextEnd = clamp(domainRange, windowEnd);
  if (nextEnd <= nextStart) {
    const width = Math.max(windowEnd - windowStart, 1);
    const maxStart = Math.max(domainStart, domainEnd - width);
    nextStart = clamp([domainStart, maxStart], windowStart);
    nextEnd = nextStart + width;
    if (nextEnd > domainEnd) {
      nextEnd = domainEnd;
      nextStart = Math.max(domainStart, nextEnd - width);
    }
  }
  if (nextEnd <= nextStart) {
    nextEnd = Math.min(domainEnd, nextStart + 1);
  }
  return [nextStart, nextEnd];
}
