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
  getHistogram,
  getTimestampFieldDomain,
  getDefaultFilter,
  diffFilters
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
  testIsTimeDataMatchFilter(rows, t);

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

function testIsTimeDataMatchFilter(rows, t) {
  const timeStringFilter = {
    fieldIdx: 0,
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-09-17 00:09:55').valueOf(),
      moment.utc('2016-09-17 00:20:08').valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[10], timeStringFilter),
    true,
    `${rows[10][0]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[15], timeStringFilter),
    false,
    `${rows[15][0]} should be outside the range`
  );

  const epochFilter = {
    fieldIdx: 4,
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc(1472688000000).valueOf(),
      moment.utc(1472734400000).valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[10], epochFilter),
    true,
    `${rows[10][1]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[15], epochFilter),
    false,
    `${rows[15][1]} should be outside the range`
  );

  const tzFilter = {
    fieldIdx: 7,
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-09-23T00:00:00.000Z').valueOf(),
      moment.utc('2016-09-23T06:00:00.000Z').valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[10], tzFilter),
    true,
    `${rows[10][7]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[23], tzFilter),
    false,
    `${rows[23][7]} should be outside the range`
  );

  const utcFilter = {
    fieldIdx: 8,
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-10-01 09:45:39+00:00').valueOf(),
      moment.utc('2016-10-01 10:00:00+00:00').valueOf()
    ]
  };

  t.equal(
    isDataMatchFilter(rows[6], utcFilter),
    false,
    `${rows[0][8]} should be outside the range`
  );

  t.equal(
    isDataMatchFilter(rows[4], utcFilter),
    true,
    `${rows[4][8]} should be inside the range`
  );

  t.equal(
    isDataMatchFilter(rows[23], utcFilter),
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
        ...getHistogram([0, 1], []),
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
        ...getHistogram(
          [1475315139001, 1475315139003],
          [1475315139001, 1475315139002, 1475315139003]
        ),
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
        t.ok(tsFieldDomain[k].length, `should create ${k}`);
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
/* eslint-enable max-statements */

test('filterUtils -> diffFilters', t => {
  const testCases = [
    {
      filterRecord: {
        dynamicDomain: [],
        fixedDomain: [],
        cpu: [],
        gpu: []
      },
      oldFilterRecord: undefined,
      result: {
        dynamicDomain: null,
        fixedDomain: null,
        cpu: null,
        gpu: null
      }
    },
    {
      filterRecord: {
        dynamicDomain: [],
        fixedDomain: [],
        cpu: [],
        gpu: []
      },
      oldFilterRecord: {
        dynamicDomain: [],
        fixedDomain: [],
        cpu: [],
        gpu: []
      },
      result: {
        dynamicDomain: null,
        fixedDomain: null,
        cpu: null,
        gpu: null
      }
    },
    {
      filterRecord: {
        dynamicDomain: [{id: 'aa', name: 'hello', value: 'bb'}],
        fixedDomain: [{id: 'bb', name: 'ab', value: 'ab'}],
        cpu: [
          {id: 'dd', name: 'hey', value: 'ee'},
          {id: 'ee', name: 'ee', value: 'ff'}
        ],
        gpu: []
      },
      oldFilterRecord: {
        dynamicDomain: [{id: 'aa', name: 'hello', value: 'bb'}],
        fixedDomain: [
          {id: 'bb', name: 'cd', value: 'ab'},
          {id: 'cc', name: 'world', value: 'dd'}
        ],
        cpu: [{id: 'ee', name: 'ee', value: 'gg'}],
        gpu: []
      },
      result: {
        dynamicDomain: null,
        fixedDomain: {bb: 'name_changed', cc: 'deleted'},
        cpu: {dd: 'added', ee: 'value_changed'},
        gpu: null
      }
    }
  ];

  testCases.forEach(({filterRecord, oldFilterRecord, result}) => {
    t.deepEqual(
      diffFilters(filterRecord, oldFilterRecord),
      result,
      'diff filters should be correct'
    );
  });

  t.end();
});
