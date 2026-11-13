// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getPositionFromHexValue, maybeHexToGeo} from './position-utils';
import {RowDataContainer} from './row-data-container';

const SAN_FRANCISCO_CELL = '8928308280fffff';
const SAN_JOSE_CELL = '85283473fffffff';

function expectSanFranciscoPosition(position: number[] | null) {
  expect(position).toHaveLength(2);
  expect(position?.[0]).toBeCloseTo(-122.418459, 5);
  expect(position?.[1]).toBeCloseTo(37.776702, 5);
}

describe('getPositionFromHexValue', () => {
  test('returns a cell center in longitude/latitude order for layer accessors', () => {
    expectSanFranciscoPosition(getPositionFromHexValue(SAN_FRANCISCO_CELL));
  });

  test.each(['', 'not-an-h3-cell', '37.776702', '0', null, undefined])(
    'returns null for an invalid or missing cell: %p',
    token => {
      expect(getPositionFromHexValue(token)).toBeNull();
    }
  );
});

describe('maybeHexToGeo', () => {
  const lat = {value: 'latitude', fieldIdx: 2};
  const lng = {value: 'longitude', fieldIdx: 0};

  test.each([
    [-122, 'unused', SAN_FRANCISCO_CELL],
    [SAN_FRANCISCO_CELL, 'unused', 37]
  ])('accepts an H3 cell in either configured coordinate column: %p', (...row) => {
    const data = new RowDataContainer({rows: [row]});
    expectSanFranciscoPosition(maybeHexToGeo(data, {index: 0}, lat, lng));
  });

  test('uses the requested row and configured field indexes rather than adjacent columns', () => {
    const data = new RowDataContainer({
      rows: [
        [SAN_FRANCISCO_CELL, 'unused', 37],
        [SAN_JOSE_CELL, SAN_FRANCISCO_CELL, 37]
      ]
    });
    const position = maybeHexToGeo(data, {index: 1}, lat, lng);
    expect(position).toHaveLength(2);
    expect(position?.[0]).toBeCloseTo(-121.976376, 5);
    expect(position?.[1]).toBeCloseTo(37.345793, 5);
  });

  test.each([
    [-122.4, 'unused', 37.7],
    [0, 'unused', 0],
    [null, 'unused', undefined],
    ['-122.4', 'unused', '37.7'],
    ['invalid', 'unused', 37.7],
    [-122.4, 'unused', 'invalid']
  ])('returns null when no coordinate contains a valid H3 cell: %p', (...row) => {
    const data = new RowDataContainer({rows: [row]});
    expect(maybeHexToGeo(data, {index: 0}, lat, lng)).toBeNull();
  });
});
