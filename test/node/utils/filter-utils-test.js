// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import test from 'tape';
import moment from 'moment';
import testData, {testFields} from 'test/fixtures/test-csv-data';

import {
  FILTER_TYPES,
  adjustValueToFilterDomain,
  isDataMatchFilter,
  getFieldDomain,
  getTimestampFieldDomain,
  getDefaultFilter,
  getDatasetIndexForFilter,
  getDatasetFieldIndexForFilter
} from 'utils/filter-utils';

import {processCsvData} from 'processors/data-processor';

/* eslint-disable max-statements */
test('filterUtils -> adjustValueToFilterDomain', t => {
  // TODO: needs id
  const rangeFilter = getDefaultFilter();
  rangeFilter.type = FILTER_TYPES.range;
  rangeFilter.domain = [0, 1];

  t.deepEqual(
    adjustValueToFilterDomain([0, 0.5], rangeFilter),
    [0, 0.5],
    'should return value matched to range filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain([-1, 0.5], rangeFilter),
    [0, 0.5],
    'should return value adjust to range filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain([0.1, 1.5], rangeFilter),
    [0.1, 1],
    'should return value adjust to range filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain([1.1, 2], rangeFilter),
    [0, 1],
    'should return value adjust to range filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain(null, rangeFilter),
    [0, 1],
    'should return value adjust to range filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain([undefined, 0.5], rangeFilter),
    [0, 0.5],
    'should return value adjust to range filter'
  );

  // TODO needs id
  const multiSelectFilter = getDefaultFilter();
  multiSelectFilter.type = FILTER_TYPES.multiSelect;
  multiSelectFilter.domain = ['a', 'b', 'c'];

  t.deepEqual(
    adjustValueToFilterDomain(['a', 'b'], multiSelectFilter),
    ['a', 'b'],
    'should return value matched to multiSelect filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain(['a', 'b', 'd'], multiSelectFilter),
    ['a', 'b'],
    'should return value matched to multiSelect filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain(['a', 'b', null], multiSelectFilter),
    ['a', 'b'],
    'should return value matched to multiSelect filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain(null, multiSelectFilter),
    [],
    'should return [] if nothing matched to multiSelect filter'
  );

  t.deepEqual(
    adjustValueToFilterDomain([1, 2], multiSelectFilter),
    [],
    'should return [] if nothing matched to multiSelect filter'
  );

  // TODO needs id
  const selectFilter = getDefaultFilter();
  selectFilter.type = FILTER_TYPES.select;
  selectFilter.domain = ['a', 'b', 'c'];

  t.equal(
    adjustValueToFilterDomain('a', selectFilter),
    'a',
    'should return value matched to select filter'
  );

  t.equal(
    adjustValueToFilterDomain(['a', 'b'], selectFilter),
    true,
    'should return true if nothing matched to select filter'
  );

  t.equal(
    adjustValueToFilterDomain(null, selectFilter),
    true,
    'should return true if nothing matched to select filter'
  );

  t.end();
});

test('filterUtils -> getFieldDomain.time', async t => {
  const data = testData;
  const expectedFields = testFields;

  const {fields, rows} = await processCsvData(data);

  t.deepEqual(fields, expectedFields, 'should get corrent field type');
  testGetTimeFieldDomain(rows, fields, t);
  testIsTimeDataMatchFilter(rows, fields, t);

  t.end();
});

function testGetTimeFieldDomain(rows, allFields, t) {
  const test_cases = [
    {
      name: 'default',
      input: getFieldDomain(rows, allFields[0]).domain,
      output: [
        moment.utc('2016-09-17 00:09:55').valueOf(),
        moment.utc('2016-09-17 00:30:08').valueOf()
      ],
      msg: '2016-09-17 00:30:08'
    },
    {
      name: 'epoch',
      input: getFieldDomain(rows, allFields[4]).domain,
      output: [
        moment.utc(1472688000000).valueOf(),
        moment.utc(1472774400000).valueOf()
      ],
      msg: 1472688000000
    },
    {
      name: 'T',
      input: getFieldDomain(rows, allFields[7]).domain,
      output: [
        moment.utc('2016-09-23T00:00:00.000Z').valueOf(),
        moment.utc('2016-09-23T08:00:00.000Z').valueOf()
      ],
      msg: '2016-09-23T00:00:00.000Z'
    },
    {
      name: 'UTC',
      input: getFieldDomain(rows, allFields[8]).domain,
      output: [
        moment.utc('2016-10-01 09:41:39+00:00').valueOf(),
        moment.utc('2016-10-01 10:01:54+00:00').valueOf()
      ],
      msg: '2016-10-01 09:41:39+00:00'
    },
    {
      name: 'local',
      input: getFieldDomain(rows, allFields[9]).domain,
      output: [
        moment.utc('2016-10-01 09:41:39+00:00').valueOf(),
        moment.utc('2016-10-01 17:01:54+00:00').valueOf()
      ],
      msg: '2016-10-01 09:41:39+00:00'
    }
  ];

  test_cases.forEach(tc =>
    t.deepEqual(
      tc.input,
      tc.output,
      `should process correct domian for timestamp ${tc.msg}`
    )
  );
}

function testIsTimeDataMatchFilter(rows, fields, t) {

  const timeStringFilter = {
    fieldIdx: [0],
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-09-17 00:09:55').valueOf(),
      moment.utc('2016-09-17 00:20:08').valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[10], timeStringFilter, 10, fields[timeStringFilter.fieldIdx[0]]),
    true,
    `${rows[10][0]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[15], timeStringFilter, 15, fields[timeStringFilter.fieldIdx[0]]),
    false,
    `${rows[15][0]} should be outside the range`
  );

  const epochFilter = {
    fieldIdx: [4],
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc(1472688000000).valueOf(),
      moment.utc(1472734400000).valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[10], epochFilter, 10, fields[epochFilter.fieldIdx[0]]),
    true,
    `${rows[10][1]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[15], epochFilter, 15, fields[epochFilter.fieldIdx[0]]),
    false,
    `${rows[15][1]} should be outside the range`
  );

  const tzFilter = {
    fieldIdx: [7],
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-09-23T00:00:00.000Z').valueOf(),
      moment.utc('2016-09-23T06:00:00.000Z').valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[10], tzFilter, 10, fields[tzFilter.fieldIdx[0]]),
    true,
    `${rows[10][7]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[23], tzFilter, 10, fields[tzFilter.fieldIdx[0]]),
    false,
    `${rows[23][7]} should be outside the range`
  );

  const utcFilter = {
    fieldIdx: [8],
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-10-01 09:45:39+00:00').valueOf(),
      moment.utc('2016-10-01 10:00:00+00:00').valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[6], utcFilter, 6, fields[utcFilter.fieldIdx[0]]),
    false,
    `${rows[0][8]} should be outside the range`
  );

  t.equal(
    isDataMatchFilter(rows[4], utcFilter, 4, fields[utcFilter.fieldIdx[0]]),
    true,
    `${rows[4][8]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[23], utcFilter, 23, fields[utcFilter.fieldIdx[0]]),
    false,
    `${rows[23][8]} should be outside the range`
  );
}

test('filterUtils -> getTimestampFieldDomain', t => {
  /* eslint-disable func-style */
  const valueAccessor = d => moment.utc(d).valueOf();
  /* eslint-enable func-style */

  const timeData = {
    no: {
      input: 0.5,
      expect: {
        domain: [0, 1],
        step: 0.05,
        histogram: [
          {count: 0, x0: 0, x1: 0.05},
          {count: 0, x0: 0.05, x1: 0.1},
          {count: 0, x0: 0.1, x1: 0.15},
          {count: 0, x0: 0.15, x1: 0.2},
          {count: 0, x0: 0.2, x1: 0.25},
          {count: 0, x0: 0.25, x1: 0.3},
          {count: 0, x0: 0.3, x1: 0.35},
          {count: 0, x0: 0.35, x1: 0.4},
          {count: 0, x0: 0.4, x1: 0.45},
          {count: 0, x0: 0.45, x1: 0.5},
          {count: 0, x0: 0.5, x1: 0.55},
          {count: 0, x0: 0.55, x1: 0.6},
          {count: 0, x0: 0.6, x1: 0.65},
          {count: 0, x0: 0.65, x1: 0.7},
          {count: 0, x0: 0.7, x1: 0.75},
          {count: 0, x0: 0.75, x1: 0.8},
          {count: 0, x0: 0.8, x1: 0.85},
          {count: 0, x0: 0.85, x1: 0.9},
          {count: 0, x0: 0.9, x1: 0.95},
          {count: 0, x0: 0.95, x1: 1},
          {count: 0, x0: 1, x1: 1}
        ],
        enlargedHistogram: [
          {count: 0, x0: 0, x1: 0.01},
          {count: 0, x0: 0.01, x1: 0.02},
          {count: 0, x0: 0.02, x1: 0.03},
          {count: 0, x0: 0.03, x1: 0.04},
          {count: 0, x0: 0.04, x1: 0.05},
          {count: 0, x0: 0.05, x1: 0.06},
          {count: 0, x0: 0.06, x1: 0.07},
          {count: 0, x0: 0.07, x1: 0.08},
          {count: 0, x0: 0.08, x1: 0.09},
          {count: 0, x0: 0.09, x1: 0.1},
          {count: 0, x0: 0.1, x1: 0.11},
          {count: 0, x0: 0.11, x1: 0.12},
          {count: 0, x0: 0.12, x1: 0.13},
          {count: 0, x0: 0.13, x1: 0.14},
          {count: 0, x0: 0.14, x1: 0.15},
          {count: 0, x0: 0.15, x1: 0.16},
          {count: 0, x0: 0.16, x1: 0.17},
          {count: 0, x0: 0.17, x1: 0.18},
          {count: 0, x0: 0.18, x1: 0.19},
          {count: 0, x0: 0.19, x1: 0.2},
          {count: 0, x0: 0.2, x1: 0.21},
          {count: 0, x0: 0.21, x1: 0.22},
          {count: 0, x0: 0.22, x1: 0.23},
          {count: 0, x0: 0.23, x1: 0.24},
          {count: 0, x0: 0.24, x1: 0.25},
          {count: 0, x0: 0.25, x1: 0.26},
          {count: 0, x0: 0.26, x1: 0.27},
          {count: 0, x0: 0.27, x1: 0.28},
          {count: 0, x0: 0.28, x1: 0.29},
          {count: 0, x0: 0.29, x1: 0.3},
          {count: 0, x0: 0.3, x1: 0.31},
          {count: 0, x0: 0.31, x1: 0.32},
          {count: 0, x0: 0.32, x1: 0.33},
          {count: 0, x0: 0.33, x1: 0.34},
          {count: 0, x0: 0.34, x1: 0.35},
          {count: 0, x0: 0.35, x1: 0.36},
          {count: 0, x0: 0.36, x1: 0.37},
          {count: 0, x0: 0.37, x1: 0.38},
          {count: 0, x0: 0.38, x1: 0.39},
          {count: 0, x0: 0.39, x1: 0.4},
          {count: 0, x0: 0.4, x1: 0.41},
          {count: 0, x0: 0.41, x1: 0.42},
          {count: 0, x0: 0.42, x1: 0.43},
          {count: 0, x0: 0.43, x1: 0.44},
          {count: 0, x0: 0.44, x1: 0.45},
          {count: 0, x0: 0.45, x1: 0.46},
          {count: 0, x0: 0.46, x1: 0.47},
          {count: 0, x0: 0.47, x1: 0.48},
          {count: 0, x0: 0.48, x1: 0.49},
          {count: 0, x0: 0.49, x1: 0.5},
          {count: 0, x0: 0.5, x1: 0.51},
          {count: 0, x0: 0.51, x1: 0.52},
          {count: 0, x0: 0.52, x1: 0.53},
          {count: 0, x0: 0.53, x1: 0.54},
          {count: 0, x0: 0.54, x1: 0.55},
          {count: 0, x0: 0.55, x1: 0.56},
          {count: 0, x0: 0.56, x1: 0.57},
          {count: 0, x0: 0.57, x1: 0.58},
          {count: 0, x0: 0.58, x1: 0.59},
          {count: 0, x0: 0.59, x1: 0.6},
          {count: 0, x0: 0.6, x1: 0.61},
          {count: 0, x0: 0.61, x1: 0.62},
          {count: 0, x0: 0.62, x1: 0.63},
          {count: 0, x0: 0.63, x1: 0.64},
          {count: 0, x0: 0.64, x1: 0.65},
          {count: 0, x0: 0.65, x1: 0.66},
          {count: 0, x0: 0.66, x1: 0.67},
          {count: 0, x0: 0.67, x1: 0.68},
          {count: 0, x0: 0.68, x1: 0.69},
          {count: 0, x0: 0.69, x1: 0.7},
          {count: 0, x0: 0.7, x1: 0.71},
          {count: 0, x0: 0.71, x1: 0.72},
          {count: 0, x0: 0.72, x1: 0.73},
          {count: 0, x0: 0.73, x1: 0.74},
          {count: 0, x0: 0.74, x1: 0.75},
          {count: 0, x0: 0.75, x1: 0.76},
          {count: 0, x0: 0.76, x1: 0.77},
          {count: 0, x0: 0.77, x1: 0.78},
          {count: 0, x0: 0.78, x1: 0.79},
          {count: 0, x0: 0.79, x1: 0.8},
          {count: 0, x0: 0.8, x1: 0.81},
          {count: 0, x0: 0.81, x1: 0.82},
          {count: 0, x0: 0.82, x1: 0.83},
          {count: 0, x0: 0.83, x1: 0.84},
          {count: 0, x0: 0.84, x1: 0.85},
          {count: 0, x0: 0.85, x1: 0.86},
          {count: 0, x0: 0.86, x1: 0.87},
          {count: 0, x0: 0.87, x1: 0.88},
          {count: 0, x0: 0.88, x1: 0.89},
          {count: 0, x0: 0.89, x1: 0.9},
          {count: 0, x0: 0.9, x1: 0.91},
          {count: 0, x0: 0.91, x1: 0.92},
          {count: 0, x0: 0.92, x1: 0.93},
          {count: 0, x0: 0.93, x1: 0.94},
          {count: 0, x0: 0.94, x1: 0.95},
          {count: 0, x0: 0.95, x1: 0.96},
          {count: 0, x0: 0.96, x1: 0.97},
          {count: 0, x0: 0.97, x1: 0.98},
          {count: 0, x0: 0.98, x1: 0.99},
          {count: 0, x0: 0.99, x1: 1},
          {count: 0, x0: 1, x1: 1}
        ],
        mappedValue: []
      }
    },
    zero: {
      input: ['2016-10-01 09:45:39', '2016-10-01 09:45:39'],
      expect: {
        domain: [1475315139000, 1475315139000],
        mappedValue: [1475315139000, 1475315139000],
        histogram: [{count: 2, x0: 1475315139000, x1: 1475315139000}],
        enlargedHistogram: [{count: 2, x0: 1475315139000, x1: 1475315139000}],
        step: 0.05
      }
    },
    tiny: {
      input: [
        '2016-10-01 09:45:39.001',
        '2016-10-01 09:45:39.002',
        '2016-10-01 09:45:39.003'
      ],
      expect: {
        domain: [1475315139001, 1475315139003],
        mappedValue: [1475315139001, 1475315139002, 1475315139003],
        histogram: [
          {count: 1, x0: 1475315139000, x1: 1475315139200},
          {count: 0, x0: 1475315139200, x1: 1475315139400},
          {count: 0, x0: 1475315139400, x1: 1475315139600},
          {count: 0, x0: 1475315139600, x1: 1475315139800},
          {count: 0, x0: 1475315139800, x1: 1475315140000},
          {count: 0, x0: 1475315140000, x1: 1475315140200},
          {count: 0, x0: 1475315140200, x1: 1475315140400},
          {count: 0, x0: 1475315140400, x1: 1475315140600},
          {count: 0, x0: 1475315140600, x1: 1475315140800},
          {count: 0, x0: 1475315140800, x1: 1475315141000},
          {count: 0, x0: 1475315141000, x1: 1475315141200},
          {count: 0, x0: 1475315141200, x1: 1475315141400},
          {count: 0, x0: 1475315141400, x1: 1475315141600},
          {count: 0, x0: 1475315141600, x1: 1475315141800},
          {count: 0, x0: 1475315141800, x1: 1475315142000},
          {count: 0, x0: 1475315142000, x1: 1475315142200},
          {count: 0, x0: 1475315142200, x1: 1475315142400},
          {count: 0, x0: 1475315142400, x1: 1475315142600},
          {count: 0, x0: 1475315142600, x1: 1475315142800},
          {count: 0, x0: 1475315142800, x1: 1475315143000},
          {count: 0, x0: 1475315143000, x1: 1475315143200},
          {count: 0, x0: 1475315143200, x1: 1475315143400},
          {count: 0, x0: 1475315143400, x1: 1475315143600},
          {count: 0, x0: 1475315143600, x1: 1475315143800},
          {count: 0, x0: 1475315143800, x1: 1475315144000},
          {count: 0, x0: 1475315144000, x1: 1475315144200},
          {count: 0, x0: 1475315144200, x1: 1475315144400},
          {count: 0, x0: 1475315144400, x1: 1475315144600},
          {count: 0, x0: 1475315144600, x1: 1475315144800},
          {count: 0, x0: 1475315144800, x1: 1475315145000},
          {count: 1, x0: 1475315145000, x1: 1475315145000}
        ],
        enlargedHistogram: [
          {count: 1, x0: 1475315139001, x1: 1475315139001.02},
          {count: 0, x0: 1475315139001.02, x1: 1475315139001.04},
          {count: 0, x0: 1475315139001.04, x1: 1475315139001.06},
          {count: 0, x0: 1475315139001.06, x1: 1475315139001.08},
          {count: 0, x0: 1475315139001.08, x1: 1475315139001.1},
          {count: 0, x0: 1475315139001.1, x1: 1475315139001.12},
          {count: 0, x0: 1475315139001.12, x1: 1475315139001.14},
          {count: 0, x0: 1475315139001.14, x1: 1475315139001.16},
          {count: 0, x0: 1475315139001.16, x1: 1475315139001.18},
          {count: 0, x0: 1475315139001.18, x1: 1475315139001.2},
          {count: 0, x0: 1475315139001.2, x1: 1475315139001.22},
          {count: 0, x0: 1475315139001.22, x1: 1475315139001.24},
          {count: 0, x0: 1475315139001.24, x1: 1475315139001.26},
          {count: 0, x0: 1475315139001.26, x1: 1475315139001.28},
          {count: 0, x0: 1475315139001.28, x1: 1475315139001.3},
          {count: 0, x0: 1475315139001.3, x1: 1475315139001.32},
          {count: 0, x0: 1475315139001.32, x1: 1475315139001.34},
          {count: 0, x0: 1475315139001.34, x1: 1475315139001.36},
          {count: 0, x0: 1475315139001.36, x1: 1475315139001.38},
          {count: 0, x0: 1475315139001.38, x1: 1475315139001.4},
          {count: 0, x0: 1475315139001.4, x1: 1475315139001.42},
          {count: 0, x0: 1475315139001.42, x1: 1475315139001.44},
          {count: 0, x0: 1475315139001.44, x1: 1475315139001.46},
          {count: 0, x0: 1475315139001.46, x1: 1475315139001.48},
          {count: 0, x0: 1475315139001.48, x1: 1475315139001.5},
          {count: 0, x0: 1475315139001.5, x1: 1475315139001.52},
          {count: 0, x0: 1475315139001.52, x1: 1475315139001.54},
          {count: 0, x0: 1475315139001.54, x1: 1475315139001.56},
          {count: 0, x0: 1475315139001.56, x1: 1475315139001.58},
          {count: 0, x0: 1475315139001.58, x1: 1475315139001.6},
          {count: 0, x0: 1475315139001.6, x1: 1475315139001.62},
          {count: 0, x0: 1475315139001.62, x1: 1475315139001.64},
          {count: 0, x0: 1475315139001.64, x1: 1475315139001.66},
          {count: 0, x0: 1475315139001.66, x1: 1475315139001.68},
          {count: 0, x0: 1475315139001.68, x1: 1475315139001.7},
          {count: 0, x0: 1475315139001.7, x1: 1475315139001.72},
          {count: 0, x0: 1475315139001.72, x1: 1475315139001.74},
          {count: 0, x0: 1475315139001.74, x1: 1475315139001.76},
          {count: 0, x0: 1475315139001.76, x1: 1475315139001.78},
          {count: 0, x0: 1475315139001.78, x1: 1475315139001.8},
          {count: 0, x0: 1475315139001.8, x1: 1475315139001.82},
          {count: 0, x0: 1475315139001.82, x1: 1475315139001.84},
          {count: 0, x0: 1475315139001.84, x1: 1475315139001.86},
          {count: 0, x0: 1475315139001.86, x1: 1475315139001.88},
          {count: 0, x0: 1475315139001.88, x1: 1475315139001.9},
          {count: 0, x0: 1475315139001.9, x1: 1475315139001.92},
          {count: 0, x0: 1475315139001.92, x1: 1475315139001.94},
          {count: 0, x0: 1475315139001.94, x1: 1475315139001.96},
          {count: 0, x0: 1475315139001.96, x1: 1475315139001.98},
          {count: 0, x0: 1475315139001.98, x1: 1475315139002},
          {count: 1, x0: 1475315139002, x1: 1475315139002.02},
          {count: 0, x0: 1475315139002.02, x1: 1475315139002.04},
          {count: 0, x0: 1475315139002.04, x1: 1475315139002.06},
          {count: 0, x0: 1475315139002.06, x1: 1475315139002.08},
          {count: 0, x0: 1475315139002.08, x1: 1475315139002.1},
          {count: 0, x0: 1475315139002.1, x1: 1475315139002.12},
          {count: 0, x0: 1475315139002.12, x1: 1475315139002.14},
          {count: 0, x0: 1475315139002.14, x1: 1475315139002.16},
          {count: 0, x0: 1475315139002.16, x1: 1475315139002.18},
          {count: 0, x0: 1475315139002.18, x1: 1475315139002.2},
          {count: 0, x0: 1475315139002.2, x1: 1475315139002.22},
          {count: 0, x0: 1475315139002.22, x1: 1475315139002.24},
          {count: 0, x0: 1475315139002.24, x1: 1475315139002.26},
          {count: 0, x0: 1475315139002.26, x1: 1475315139002.28},
          {count: 0, x0: 1475315139002.28, x1: 1475315139002.3},
          {count: 0, x0: 1475315139002.3, x1: 1475315139002.32},
          {count: 0, x0: 1475315139002.32, x1: 1475315139002.34},
          {count: 0, x0: 1475315139002.34, x1: 1475315139002.36},
          {count: 0, x0: 1475315139002.36, x1: 1475315139002.38},
          {count: 0, x0: 1475315139002.38, x1: 1475315139002.4},
          {count: 0, x0: 1475315139002.4, x1: 1475315139002.42},
          {count: 0, x0: 1475315139002.42, x1: 1475315139002.44},
          {count: 0, x0: 1475315139002.44, x1: 1475315139002.46},
          {count: 0, x0: 1475315139002.46, x1: 1475315139002.48},
          {count: 0, x0: 1475315139002.48, x1: 1475315139002.5},
          {count: 0, x0: 1475315139002.5, x1: 1475315139002.52},
          {count: 0, x0: 1475315139002.52, x1: 1475315139002.54},
          {count: 0, x0: 1475315139002.54, x1: 1475315139002.56},
          {count: 0, x0: 1475315139002.56, x1: 1475315139002.58},
          {count: 0, x0: 1475315139002.58, x1: 1475315139002.6},
          {count: 0, x0: 1475315139002.6, x1: 1475315139002.62},
          {count: 0, x0: 1475315139002.62, x1: 1475315139002.64},
          {count: 0, x0: 1475315139002.64, x1: 1475315139002.66},
          {count: 0, x0: 1475315139002.66, x1: 1475315139002.68},
          {count: 0, x0: 1475315139002.68, x1: 1475315139002.7},
          {count: 0, x0: 1475315139002.7, x1: 1475315139002.72},
          {count: 0, x0: 1475315139002.72, x1: 1475315139002.74},
          {count: 0, x0: 1475315139002.74, x1: 1475315139002.76},
          {count: 0, x0: 1475315139002.76, x1: 1475315139002.78},
          {count: 0, x0: 1475315139002.78, x1: 1475315139002.8},
          {count: 0, x0: 1475315139002.8, x1: 1475315139002.82},
          {count: 0, x0: 1475315139002.82, x1: 1475315139002.84},
          {count: 0, x0: 1475315139002.84, x1: 1475315139002.86},
          {count: 0, x0: 1475315139002.86, x1: 1475315139002.88},
          {count: 0, x0: 1475315139002.88, x1: 1475315139002.9},
          {count: 0, x0: 1475315139002.9, x1: 1475315139002.92},
          {count: 0, x0: 1475315139002.92, x1: 1475315139002.94},
          {count: 0, x0: 1475315139002.94, x1: 1475315139002.96},
          {count: 0, x0: 1475315139002.96, x1: 1475315139002.98},
          {count: 0, x0: 1475315139002.98, x1: 1475315139003},
          {count: 1, x0: 1475315139003, x1: 1475315139003}
        ],
        step: 0.1
      }
    },
    small: {
      input: [
        '2016-10-01 09:45:39.010',
        '2016-10-01 09:45:39.020',
        '2016-10-01 09:45:39.030'
      ],
      expect: {
        domain: [1475315139010, 1475315139030],
        mappedValue: [1475315139010, 1475315139020, 1475315139030],
        histogram: [],
        enlargedHistogram: [],
        step: 1
      }
    },
    medium: {
      input: [
        '2016-10-01 09:45:39.100',
        '2016-10-01 09:45:39.200',
        '2016-10-01 09:45:39.300'
      ],
      expect: {
        domain: [1475315139100, 1475315139300],
        mappedValue: [1475315139100, 1475315139200, 1475315139300],
        histogram: [],
        enlargedHistogram: [],
        step: 5
      }
    },
    large: {
      input: ['2016-10-01 09:45:39', '2016-10-01 09:45:45'],
      expect: {
        domain: [1475315139000, 1475315145000],
        mappedValue: [1475315139000, 1475315145000],
        histogram: [],
        enlargedHistogram: [],
        step: 1000
      }
    }
  };

  Object.keys(timeData).forEach(key => {
    const tsFieldDomain = getTimestampFieldDomain(
      timeData[key].input,
      valueAccessor
    );
    t.deepEqual(
      Object.keys(tsFieldDomain).sort(),
      Object.keys(timeData[key].expect).sort(),
      'Should domain should have same keys'
    );

    Object.keys(timeData[key].expect).forEach(k => {

      // histogram is created by d3, only need to test they exist
      if (k === 'histogram' || k === 'enlargedHistogram') {
        t.ok(
          tsFieldDomain[k].length,
          `should create ${k}`
        );
      } else {
        t.deepEqual(
          tsFieldDomain[k],
          timeData[key].expect[k],
          `time domain ${k} should be the same`
        );
      }
    });
  });

  t.end();
});

test('filterUtils -> getDatasetIndexForFilter', t => {
  const dataId = 'test-this-id';
  let fieldIndex = getDatasetIndexForFilter({id: dataId}, {dataId: [dataId]});
  t.equal(
    fieldIndex,
    0,
    'FieldIndex should be 0'
  );

  fieldIndex = getDatasetIndexForFilter({id: dataId}, {dataId: ['different-id', dataId]});
  t.equal(
    fieldIndex,
    1,
    'FieldIndex should be 1'
  );

  fieldIndex = getDatasetIndexForFilter({id: dataId}, {dataId: ['different-id']});
  t.equal(
    fieldIndex,
    -1,
    'FieldIndex should be -1'
  );

  t.end();
});

test('filterUtils -> getDatasetIndexForFilter', t => {
  const dataId = 'test-this-id';

  let fieldIndex = getDatasetFieldIndexForFilter({id: dataId}, {
    dataId: [dataId],
    fieldIdx: [3]
  });

  t.equal(
    fieldIndex,
    3,
    'FieldIndex should be 3'
  );

  fieldIndex = getDatasetFieldIndexForFilter({id: dataId}, {
    dataId: ['different-id', dataId],
    fieldIdx: [3, 5]
  });

  t.equal(
    fieldIndex,
    5,
    'FieldIndex should be 5'
  );

  fieldIndex = getDatasetFieldIndexForFilter({id: dataId}, {dataId: ['different-id']});
  t.equal(
    fieldIndex,
    -1,
    'FieldIndex should be -1'
  );

  t.end();
});

/* eslint-enable max-statements */
