// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import quickInsertionSort from './quick-insertion-sort';

// Compare the whole array, not just adjacent pairs: values must neither be lost
// nor duplicated while the numeric sort mutates its input.
function expectNumericSort(values: number[]) {
  const expected = [...values].sort((a, b) => a - b);
  quickInsertionSort(values);
  expect(values).toEqual(expected);
}

describe('quickInsertionSort', () => {
  test.each([
    {name: 'empty', values: []},
    {name: 'singleton', values: [42]},
    {name: 'reversed pair', values: [2, 1]},
    {name: 'sorted pair', values: [1, 2]},
    {name: 'mixed magnitudes and fractions', values: [10, 2, 100, 1, -10, -2, 0, 0.5, -0.25]},
    {name: 'equal values', values: [4, 4, 4, 4]},
    {name: 'repeated values', values: [3, -2, 3, 0, -2, 3, 0]}
  ])('sorts $name in place', ({values}) => {
    expectNumericSort(values);
  });

  // Exercise inputs on both sides of the small-partition cutoff, plus multiple
  // partition levels. Deterministic values keep failures reproducible.
  test.each([15, 16, 17, 31, 32, 33, 257, 1024])(
    'preserves numeric order and multiplicities for %i values',
    length => {
      const ascending = Array.from({length}, (_, index) => index - length / 2);
      const shuffled = Array.from({length}, (_, index) => ((index * 73) % 101) / 4 - 12);
      const repeated = Array.from({length}, (_, index) => (index % 5) - 2);
      const inputs = [
        ascending,
        [...ascending].reverse(),
        shuffled,
        repeated,
        Array(length).fill(7)
      ];

      inputs.forEach(expectNumericSort);
    }
  );
});
