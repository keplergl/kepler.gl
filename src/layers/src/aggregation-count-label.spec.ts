// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  formatPointCount,
  isPointCountLabel,
  createPointCountLabelField
} from './aggregation-count-label';

describe('formatPointCount', () => {
  test('keeps small counts and abbreviates thousands and millions', () => {
    expect(formatPointCount(0)).toBe('0');
    expect(formatPointCount(1)).toBe('1');
    expect(formatPointCount(999)).toBe('999');
    expect(formatPointCount(1000)).toBe('1k');
    expect(formatPointCount(1499)).toBe('1.5k');
    expect(formatPointCount(9940)).toBe('9.9k');
    expect(formatPointCount(9950)).toBe('10k');
    expect(formatPointCount(15000)).toBe('15k');
    expect(formatPointCount(1_500_000)).toBe('1.5m');
    expect(formatPointCount(12_000_000)).toBe('12m');
    expect(formatPointCount(Number.NaN)).toBe('');
  });
});

describe('isPointCountLabel', () => {
  test('matches only the synthetic point-count field', () => {
    expect(isPointCountLabel({field: createPointCountLabelField()})).toBe(true);
    expect(isPointCountLabel({field: {name: 'pointCount', fieldIdx: 3}})).toBe(false);
    expect(isPointCountLabel({field: null})).toBe(false);
  });
});
