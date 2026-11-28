// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  DEFAULT_ANNOTATION_VERTICAL_SCALE as defaults,
  getAnnotationVerticalScaleTicks as ticks,
  normalizeAnnotationVerticalScale as normalize
} from './annotation-vertical-scale';

test('signed labels remain independent of shifted and exaggerated drawing heights', () => {
  expect(
    ticks({
      ...defaults,
      min: -1,
      max: 1,
      tickSpacing: 1,
      unit: 'km',
      precision: 2,
      displayMin: 0,
      displayMax: 6000
    })
  ).toEqual([
    {value: -1, height: 0, label: '-1.00 km'},
    {value: 0, height: 3000, label: '0.00 km'},
    {value: 1, height: 6000, label: '1.00 km'}
  ]);
  expect(
    ticks({...defaults, min: -100, max: 100, tickSpacing: 100, unit: 'ft'}).map(t => t.height)
  ).toEqual([-30.48, 0, 30.48]);
});

test('includes both endpoints for uneven and fractional intervals without duplicate ticks', () => {
  expect(ticks({...defaults, max: 10, tickSpacing: 3}).map(t => t.value)).toEqual([0, 3, 6, 9, 10]);
  expect(ticks({...defaults, max: 0.3, tickSpacing: 0.1, precision: 1}).map(t => t.label)).toEqual([
    '0.0 m',
    '0.1 m',
    '0.2 m',
    '0.3 m'
  ]);
  expect(ticks({...defaults, tickSpacing: 2000}).map(t => t.value)).toEqual([0, 1000]);
  expect(ticks({...defaults, tickSpacing: 10})).toHaveLength(101);
});

test.each([
  null,
  {},
  [],
  {...defaults, max: 0},
  {...defaults, min: NaN},
  {...defaults, max: Infinity},
  {...defaults, tickSpacing: 0},
  {...defaults, tickSpacing: -1},
  {...defaults, tickSpacing: 0.001},
  {...defaults, unit: 'yards'},
  {...defaults, precision: 7},
  {...defaults, precision: 1.5},
  {...defaults, displayMin: 0},
  {...defaults, displayMin: 10, displayMax: 0},
  {...defaults, displayMin: 0, displayMax: Infinity}
])('rejects unsafe or incomplete scale %j', value => {
  expect(normalize(value)).toBeUndefined();
  expect(ticks(value as any)).toEqual([]);
});
