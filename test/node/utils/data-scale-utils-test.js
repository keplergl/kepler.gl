// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'lodash/cloneDeep';
import {format as d3Format} from 'd3-format';

import {
  getOrdinalDomain,
  getQuantileDomain,
  getLinearDomain,
  getLogDomain,
  createDataContainer,
  getThresholdsFromQuantiles,
  getDomainStepsbyZoom,
  getQuantLabelFormat,
  getHistogramDomain,
  getQuantLegends,
  getCategoricalColorMap
} from '@kepler.gl/utils';
import {StateWFilesFiltersLayerColor} from 'test/helpers/mock-state';
import {SCALE_FUNC} from '@kepler.gl/constants';

function numberSort(a, b) {
  return a - b;
}

test('DataScaleUtils -> getOrdinalDomain', t => {
  const data = [['a'], ['a'], ['b'], [undefined], [null], [0], null];

  function valueAccessor(d, dc) {
    return dc.valueAt(d.index, 0);
  }

  t.deepEqual(
    getOrdinalDomain(createDataContainer(data), valueAccessor),
    [0, 'a', 'b'],
    'should get correct ordinal domain'
  );

  t.end();
});

test('DataScaleUtils -> getQuantileDomain', t => {
  const data = ['a', 'b', 'c', 'b', undefined, null];
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 'a'}, {value: 'b'}, {value: 'b'}];

  t.deepEqual(
    getQuantileDomain(data, undefined, undefined),
    ['a', 'b', 'b', 'c'],
    'should get correct quantile domain'
  );

  t.deepEqual(
    getQuantileDomain(quanData, undefined, numberSort),
    [0, 1, 1, 2, 3, 4],
    'should get correct quantile domain'
  );

  t.deepEqual(
    getQuantileDomain(values, valueAccessor),
    ['a', 'b', 'b'],
    'should get correct quantile domain'
  );

  t.end();
});

test('DataScaleUtils -> getLinearDomain', t => {
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 1}, {value: 0}, {value: -3}];

  t.deepEqual(getLinearDomain(quanData, undefined), [0, 4], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, 10]), [10, 10], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, undefined]), [10, 10], 'should get correct Linear domain');

  t.deepEqual(
    getLinearDomain([undefined, undefined, null]),
    [0, 1],
    'should get correct Linear domain'
  );

  t.deepEqual(getLinearDomain(values, valueAccessor), [-3, 1], 'should get correct Linear domain');

  t.end();
});

test('DataScaleUtils -> getLogDomain', t => {
  function valueAccessor(d) {
    return d.value;
  }

  t.deepEqual(
    getLogDomain([{value: 1}, {value: 0}, {value: -3}], valueAccessor),
    [-3, 1],
    'should get correct Log domain with negative numbers'
  );

  t.deepEqual(
    getLogDomain([{value: 1}, {value: 0}, {value: 3}], valueAccessor),
    [0.00001, 3],
    'should not contain a 0 in domain'
  );

  t.deepEqual(
    getLogDomain([], valueAccessor),
    [0.00001, 1],
    'should have undefined domain for empty set'
  );

  t.end();
});

test('DataScaleUtils -> getThresholdsFromQuantiles', t => {
  t.deepEqual(
    getThresholdsFromQuantiles([0, 1, 2, 3, 4, 5], 3),
    [1.6666666666666665, 3.333333333333333],
    'should get correct thresholds from quantiles'
  );

  t.deepEqual(
    getThresholdsFromQuantiles([0, 1, 2, 3, 4, 5], 1),
    [],
    'should get correct thresholds from quantiles'
  );

  t.deepEqual(
    getThresholdsFromQuantiles([0, 1, 2, 3, 4, 5], undefined),
    [0, 5],
    'should get correct thresholds from quantiles'
  );
  t.end();
});

test('DataScaleUtils -> getDomainStepsbyZoom', t => {
  const domain = [
    [0, 1],
    [0, 2],
    [0, 3]
  ];
  const steps = [0, 2, 4];
  [
    {z: 0, expected: [0, 1]},
    {z: 0.5, expected: [0, 1]},
    {z: 1, expected: [0, 1]},
    {z: 1.2, expected: [0, 1]},
    {z: 2, expected: [0, 2]},
    {z: 3.5, expected: [0, 2]},
    {z: 4, expected: [0, 3]},
    {z: 4.5, expected: [0, 3]},
    {z: 10, expected: [0, 3]}
  ].forEach(({z, expected}) => {
    t.deepEqual(
      getDomainStepsbyZoom(domain, steps, z),
      expected,
      `should get correct domain from zoom ${z}`
    );
  });

  t.end();
});

test('DataScaleUtils -> getQuantLabelFormat', t => {
  const fieldType = 'real';
  const domain = [1, 2];

  const format = getQuantLabelFormat(domain, fieldType);

  t.deepEqual(format(0), '0', 'should get correct quant label format for 0');
  t.deepEqual(format(null), 'no value', 'should get correct quant label format for null');
  t.deepEqual(format(undefined), 'no value', 'should get correct quant label format for undefined');
  t.deepEqual(format(1.0), '1', 'should get correct quant label format for number');

  t.end();
});

test('DataScaleUtils -> getHistogramDomain', t => {
  let aggregatedBins = [
    {i: 0, value: 1, count: 1},
    {i: 1, value: 2, count: 1},
    {i: 2, value: 3, count: 1},
    {i: 3, value: 4, count: 1}
  ];
  let histogramDomain = getHistogramDomain({aggregatedBins});

  t.deepEqual(histogramDomain, [1, 4, 2.5]);

  aggregatedBins = null;
  histogramDomain = getHistogramDomain({aggregatedBins});

  t.deepEqual(histogramDomain, [0, 0, 0]);

  // test dataset
  const InitialState = cloneDeep(StateWFilesFiltersLayerColor);
  const {layers, datasets} = InitialState.visState;
  const pointLayer = layers[0];
  const dataset = datasets[pointLayer.config.dataId];
  const field = dataset.fields[6];
  const fieldValueAccessor = idx => dataset.getValue(field.name, idx);

  histogramDomain = getHistogramDomain({dataset, fieldValueAccessor});
  t.deepEqual(histogramDomain, [1, 12124, 912.2857142857143]);

  t.end();
});

test('DataScaleUtils -> getQuantLegends', t => {
  // scale, labelFormat
  const labelFormat = d3Format('.1s');
  const domain = [3.1, 5.2, 7.3];

  const scaleFunction = SCALE_FUNC.threshold().domain(domain).range(domain);
  scaleFunction.scaleType = 'linear';

  const legends = getQuantLegends(scaleFunction, labelFormat);

  const expectedColorBreaks = [
    {data: 3.1, label: 'NaN to 3', range: [undefined, 3.1], inputs: [NaN, 3]},
    {data: 5.2, label: '3 to 5', range: [3.1, 5.2], inputs: [3, 5]},
    {data: 7.3, label: '5 to 7', range: [5.2, 7.3], inputs: [5, 7]}
  ];

  t.deepEqual(legends, expectedColorBreaks, 'should create correct threshold legends');

  const customDomain = [3.1, 5.2, 7.3, null];
  const customScaleFunction = SCALE_FUNC.threshold().domain(customDomain).range(customDomain);
  customScaleFunction.scaleType = 'custom';
  const customLegends = getQuantLegends(customScaleFunction, labelFormat);

  const expectedCustomColorBreaks = [
    {data: 3.1, label: 'Less than 3.1', range: [undefined, 3.1], inputs: [null, 3.1]},
    {data: 5.2, label: '3.1 to 5.2', range: [3.1, 5.2], inputs: [3.1, 5.2]},
    {data: 7.3, label: '5.2 to 7.3', range: [5.2, 7.3], inputs: [5.2, 7.3]},
    {data: null, label: '7.3 or more', range: [7.3, null], inputs: [7.3, null]}
  ];

  t.deepEqual(
    customLegends,
    expectedCustomColorBreaks,
    'should create correct threshold legends from custom breaks'
  );
  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> basic functionality', t => {
  // Test empty inputs
  t.deepEqual(
    getCategoricalColorMap([], []),
    [],
    'should return empty array for empty colors and domain'
  );

  // Test empty colors with domain
  t.deepEqual(
    getCategoricalColorMap([], ['a', 'b']),
    [],
    'should return empty array for empty colors'
  );

  // Test empty domain with colors
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], []),
    [
      [null, '#ff0000'],
      [null, '#00ff00']
    ],
    'should return colors with null values for empty domain'
  );

  // Test single color, single value
  t.deepEqual(
    getCategoricalColorMap(['#ff0000'], ['a']),
    [['a', '#ff0000']],
    'should map single value to single color'
  );

  // Test single color, multiple values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000'], ['a', 'b', 'c']),
    [[['a', 'b', 'c'], '#ff0000']],
    'should assign all values as array to single color when domain is larger'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> equal colors and domain', t => {
  // Test equal number of colors and domain values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['a', 'b', 'c']),
    [
      ['a', '#ff0000'],
      ['b', '#00ff00'],
      ['c', '#0000ff']
    ],
    'should map each value to corresponding color when counts are equal'
  );

  // Test with numbers
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [2, 1]),
    [
      [1, '#ff0000'],
      [2, '#00ff00']
    ],
    'should map sorted numeric values to colors'
  );

  // Test with mixed types (should be sorted)
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], [2, 'a', 1]),
    [
      [1, '#ff0000'],
      [2, '#00ff00'],
      ['a', '#0000ff']
    ],
    'should sort mixed types and map to colors'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> more colors than domain', t => {
  // Test more colors than domain values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['a', 'b']),
    [
      ['a', '#ff0000'],
      ['b', '#00ff00'],
      [null, '#0000ff']
    ],
    'should assign values one-to-one and leave extra colors with null'
  );

  // Test with single domain value and multiple colors
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['z']),
    [
      ['z', '#ff0000'],
      [null, '#00ff00'],
      [null, '#0000ff']
    ],
    'should assign single value to first color and leave others null'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> more domain than colors', t => {
  // Test more domain values than colors
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['a', 'b', 'c', 'd']),
    [
      ['a', '#ff0000'],
      [['b', 'c', 'd'], '#00ff00']
    ],
    'should assign remaining values as array to last color'
  );

  // Test with many domain values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['a', 'b', 'c', 'd', 'e', 'f']),
    [
      ['a', '#ff0000'],
      ['b', '#00ff00'],
      [['c', 'd', 'e', 'f'], '#0000ff']
    ],
    'should assign first values one-to-one up to penultimate color, then aggregate rest'
  );

  // Test with numeric values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [5, 1, 3, 2, 4]),
    [
      [1, '#ff0000'],
      [[2, 3, 4, 5], '#00ff00']
    ],
    'should sort numeric values and aggregate excess to last color'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> data types and null handling', t => {
  // Test with null and undefined values in domain
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['a', null, 'b', undefined]),
    [
      ['a', '#ff0000'],
      ['b', '#00ff00']
    ],
    'should filter out null and undefined from domain'
  );

  // Test with only null/undefined in domain
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [null, undefined]),
    [
      [null, '#ff0000'],
      [null, '#00ff00']
    ],
    'should return colors with null values when domain only contains null/undefined'
  );

  // Test with zero value
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [0, 1, 2]),
    [
      [0, '#ff0000'],
      [[1, 2], '#00ff00']
    ],
    'should handle zero as valid value'
  );

  // Test with boolean values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [true, false]),
    [
      [false, '#ff0000'],
      [true, '#00ff00']
    ],
    'should handle boolean values and sort them correctly'
  );

  // Test with string numbers
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['1', '10', '2']),
    [
      ['1', '#ff0000'],
      [['10', '2'], '#00ff00']
    ],
    'should treat string numbers as strings and sort lexicographically'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> duplicate values', t => {
  // Test with duplicate values in domain (should be deduplicated)
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['a', 'b', 'a', 'b', 'c']),
    [
      ['a', '#ff0000'],
      [['b', 'c'], '#00ff00']
    ],
    'should deduplicate domain values and sort them'
  );

  // Test with all duplicate values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['a', 'a', 'a']),
    [
      ['a', '#ff0000'],
      [null, '#00ff00']
    ],
    'should handle all duplicate values correctly'
  );

  // Test with numeric duplicates
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [1, 2, 1, 3, 2]),
    [
      [1, '#ff0000'],
      [[2, 3], '#00ff00']
    ],
    'should deduplicate and sort numeric values'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> sorting behavior', t => {
  // Test string sorting
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['zebra', 'apple', 'banana']),
    [
      ['apple', '#ff0000'],
      ['banana', '#00ff00'],
      ['zebra', '#0000ff']
    ],
    'should sort strings alphabetically'
  );

  // Test numeric sorting (JavaScript default sort converts to strings)
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], [10, 2, 1]),
    [
      [1, '#ff0000'],
      [10, '#00ff00'],
      [2, '#0000ff']
    ],
    'should sort numbers lexicographically (as strings)'
  );

  // Test lexicographic sorting with multi-digit numbers
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [100, 20, 3]),
    [
      [100, '#ff0000'],
      [[20, 3], '#00ff00']
    ],
    'should sort multi-digit numbers lexicographically: 100 comes before 20'
  );

  // Test mixed string-number sorting (numbers come first when converted to strings)
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['b', 1, 'a', 2]),
    [
      [1, '#ff0000'],
      [2, '#00ff00'],
      [['a', 'b'], '#0000ff']
    ],
    'should sort mixed types with numbers first'
  );

  // Test case sensitivity
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['B', 'a', 'A', 'b']),
    [
      ['A', '#ff0000'],
      [['B', 'a', 'b'], '#00ff00']
    ],
    'should be case sensitive in sorting'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> edge cases', t => {
  // Test with empty string
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['', 'a', 'b']),
    [
      ['', '#ff0000'],
      [['a', 'b'], '#00ff00']
    ],
    'should handle empty string as valid value'
  );

  // Test with whitespace strings
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [' ', '  ', 'a']),
    [
      [' ', '#ff0000'],
      [['  ', 'a'], '#00ff00']
    ],
    'should handle whitespace strings as distinct values'
  );

  // Test with very long arrays
  const longDomain = Array.from({length: 100}, (_, i) => `item${i}`);
  const result = getCategoricalColorMap(['#ff0000', '#00ff00'], longDomain);
  t.equal(result.length, 2, 'should handle large domain arrays');
  t.equal(result[0][0], 'item0', 'should assign first value correctly for large arrays');
  t.true(
    Array.isArray(result[1][0]),
    'should aggregate remaining values into array for large domains'
  );
  t.equal(result[1][0].length, 99, 'should aggregate correct number of remaining values');

  // Test with nested arrays/objects in domain (Set doesn't deduplicate by content)
  const nestedArray = ['nested'];
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [nestedArray, 'string', nestedArray]),
    [
      [nestedArray, '#ff0000'],
      ['string', '#00ff00']
    ],
    'should handle complex types in domain (same reference gets deduplicated)'
  );

  // Test with different array instances (no deduplication)
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], [['nested'], 'string', ['nested']]),
    [
      [['nested'], '#ff0000'],
      [['nested', 'string'], '#00ff00']
    ],
    'should not deduplicate arrays with same content but different references'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> real-world scenarios', t => {
  // Test typical categorical data (countries)
  const countries = ['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina'];
  const countryColors = ['#ff0000', '#00ff00', '#0000ff'];
  t.deepEqual(
    getCategoricalColorMap(countryColors, countries),
    [
      ['Argentina', '#ff0000'],
      ['Brazil', '#00ff00'],
      [['Canada', 'Mexico', 'USA'], '#0000ff']
    ],
    'should handle typical country categorical data'
  );

  // Test status/category data
  const statuses = ['active', 'inactive', 'pending', 'archived'];
  const statusColors = ['#28a745', '#dc3545', '#ffc107', '#6c757d'];
  t.deepEqual(
    getCategoricalColorMap(statusColors, statuses),
    [
      ['active', '#28a745'],
      ['archived', '#dc3545'],
      ['inactive', '#ffc107'],
      ['pending', '#6c757d']
    ],
    'should handle status/category data with exact color mapping'
  );

  // Test product categories
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  const categoryColors = ['#ff6b6b', '#4ecdc4'];
  t.deepEqual(
    getCategoricalColorMap(categoryColors, categories),
    [
      ['Books', '#ff6b6b'],
      [['Clothing', 'Electronics', 'Home & Garden', 'Sports'], '#4ecdc4']
    ],
    'should handle product categories with insufficient colors'
  );

  // Test age groups (numeric ranges as strings)
  const ageGroups = ['18-25', '26-35', '36-45', '46-55', '55+'];
  const ageColors = ['#e8f5e8', '#a8d8a8', '#68b968'];
  t.deepEqual(
    getCategoricalColorMap(ageColors, ageGroups),
    [
      ['18-25', '#e8f5e8'],
      ['26-35', '#a8d8a8'],
      [['36-45', '46-55', '55+'], '#68b968']
    ],
    'should handle age group ranges correctly'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> color format variations', t => {
  // Test with different color formats (hex colors)
  t.deepEqual(
    getCategoricalColorMap(['#FF0000', '#00FF00', '#0000FF'], ['a', 'b', 'c']),
    [
      ['a', '#FF0000'],
      ['b', '#00FF00'],
      ['c', '#0000FF']
    ],
    'should handle uppercase hex colors'
  );

  // Test with short hex colors
  t.deepEqual(
    getCategoricalColorMap(['#f00', '#0f0', '#00f'], ['x', 'y', 'z']),
    [
      ['x', '#f00'],
      ['y', '#0f0'],
      ['z', '#00f']
    ],
    'should handle short hex color format'
  );

  // Test with named colors (if the function accepts them)
  t.deepEqual(
    getCategoricalColorMap(['red', 'green', 'blue'], ['first', 'second', 'third']),
    [
      ['first', 'red'],
      ['second', 'green'],
      ['third', 'blue']
    ],
    'should handle named color strings'
  );

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> stress tests', t => {
  // Test with single color and many domain values
  const manyValues = Array.from({length: 50}, (_, i) => `value${i}`);
  const singleColorResult = getCategoricalColorMap(['#ff0000'], manyValues);
  t.equal(singleColorResult.length, 1, 'should return single color mapping for many values');
  t.true(
    Array.isArray(singleColorResult[0][0]),
    'should aggregate all values into array for single color'
  );
  t.equal(singleColorResult[0][0].length, 50, 'should contain all 50 values in the array');
  t.equal(singleColorResult[0][0][0], 'value0', 'should have first sorted value at start of array');

  // Test with many colors and single domain value
  const manyColors = Array.from({length: 20}, (_, i) => `#${i.toString(16).padStart(6, '0')}`);
  const singleValueResult = getCategoricalColorMap(manyColors, ['onlyValue']);
  t.equal(singleValueResult.length, 20, 'should return all colors when only one domain value');
  t.equal(singleValueResult[0][0], 'onlyValue', 'should assign value to first color');
  for (let i = 1; i < 20; i++) {
    t.equal(singleValueResult[i][0], null, `color ${i} should have null value`);
  }

  // Test performance with moderately large datasets
  const largeDomain = Array.from({length: 1000}, (_, i) => `item${i}`);
  const largeColors = Array.from({length: 10}, (_, i) => `#color${i}`);
  const largeResult = getCategoricalColorMap(largeColors, largeDomain);
  t.equal(largeResult.length, 10, 'should handle large datasets efficiently');
  t.true(Array.isArray(largeResult[9][0]), 'should aggregate many values to last color');

  t.end();
});

test('DataScaleUtils -> getCategoricalColorMap -> boundary conditions', t => {
  // Test with exactly 2 colors and 2 values (boundary case)
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['b', 'a']),
    [
      ['a', '#ff0000'],
      ['b', '#00ff00']
    ],
    'should handle boundary case of 2 colors and 2 values'
  );

  // Test with exactly 3 colors and 3 values
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['z', 'a', 'm']),
    [
      ['a', '#ff0000'],
      ['m', '#00ff00'],
      ['z', '#0000ff']
    ],
    'should handle boundary case of 3 colors and 3 values'
  );

  // Test transitioning from equal to more domains than colors
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00'], ['a', 'b', 'c']),
    [
      ['a', '#ff0000'],
      [['b', 'c'], '#00ff00']
    ],
    'should transition correctly from equal to excess domain values'
  );

  // Test transitioning from more colors to equal
  t.deepEqual(
    getCategoricalColorMap(['#ff0000', '#00ff00', '#0000ff'], ['b', 'a']),
    [
      ['a', '#ff0000'],
      ['b', '#00ff00'],
      [null, '#0000ff']
    ],
    'should transition correctly from excess colors to matching'
  );

  t.end();
});
