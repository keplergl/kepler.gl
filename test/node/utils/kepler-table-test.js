// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import moment from 'moment';
import testData, {numericRangesCsv, testFields} from 'test/fixtures/test-csv-data';

import {preciseRound, getFilterFunction} from '@kepler.gl/utils';
import {createNewDataEntry, findPointFieldPairs} from '@kepler.gl/table';

import {processCsvData} from '@kepler.gl/processors';
import {cmpFields} from '../../helpers/comparison-utils';
import {FILTER_TYPES} from '@kepler.gl/constants';

function testGetTimeFieldDomain(table, t) {
  const test_cases = [
    {
      name: 'default',
      input: table.getColumnFilterDomain(table.fields[0]).domain,
      output: [
        moment.utc('2016-09-17 00:09:55').valueOf(),
        moment.utc('2016-09-17 00:30:08').valueOf()
      ],
      msg: '2016-09-17 00:30:08'
    },
    {
      name: 'epoch',
      input: table.getColumnFilterDomain(table.fields[4]).domain,
      output: [moment.utc(1472688000000).valueOf(), moment.utc(1472774400000).valueOf()],
      msg: 1472688000000
    },
    {
      name: 'T',
      input: table.getColumnFilterDomain(table.fields[7]).domain,
      output: [
        moment.utc('2016-09-23T00:00:00.000Z').valueOf(),
        moment.utc('2016-09-23T08:00:00.000Z').valueOf()
      ],
      msg: '2016-09-23T00:00:00.000Z'
    },
    {
      name: 'UTC',
      input: table.getColumnFilterDomain(table.fields[8]).domain,
      output: [
        moment.utc('2016-10-01 09:41:39+00:00').valueOf(),
        moment.utc('2016-10-01 10:01:54+00:00').valueOf()
      ],
      msg: '2016-10-01 09:41:39+00:00'
    },
    {
      name: 'local',
      input: table.getColumnFilterDomain(table.fields[9]).domain,
      output: [
        moment.utc('2016-10-01 09:41:39+00:00').valueOf(),
        moment.utc('2016-10-01 17:01:54+00:00').valueOf()
      ],
      msg: '2016-10-01 09:41:39+00:00'
    }
  ];

  test_cases.forEach(tc =>
    t.deepEqual(tc.input, tc.output, `should process correct domain for timestamp ${tc.msg}`)
  );
}

function testGetNumericFieldStep(table, t) {
  const test_cases = [
    {
      name: 'smallest',
      input: table.getColumnFilterDomain(table.fields[0]).step,
      output: 0.0000001
    },
    {
      name: 'small',
      input: table.getColumnFilterDomain(table.fields[1]).step,
      output: 0.001
    },
    {
      name: 'negative',
      input: table.getColumnFilterDomain(table.fields[2]).step,
      output: 0.01
    },
    {
      name: 'medium',
      input: table.getColumnFilterDomain(table.fields[3]).step,
      output: 0.01
    },
    {
      name: 'large',
      input: table.getColumnFilterDomain(table.fields[4]).step,
      output: 1
    }
  ];

  test_cases.forEach(tc =>
    t.equal(
      preciseRound(tc.input, 5),
      preciseRound(tc.output, 5),
      `should process correct step for field ${tc.name}`
    )
  );
}

function testGetFilterFunction({fields, dataContainer}, t) {
  const dataId = 'dataset-1';
  const timeStringFilter = {
    fieldIdx: [0],
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-09-17 00:09:55').valueOf(),
      moment.utc('2016-09-17 00:20:08').valueOf()
    ],
    id: 'filter-1',
    dataId: [dataId]
  };

  let field = fields[timeStringFilter.fieldIdx[0]];

  let filterFunction = getFilterFunction(field, dataId, timeStringFilter, [], dataContainer);

  t.equal(
    filterFunction({index: 10}),
    true,
    `${dataContainer.valueAt(10, 0)} should be inside the range`
  );

  t.equal(
    filterFunction({index: 15}),
    false,
    `${dataContainer.valueAt(15, 0)} should be outside the range`
  );

  const epochFilter = {
    fieldIdx: [4],
    type: FILTER_TYPES.timeRange,
    value: [moment.utc(1472688000000).valueOf(), moment.utc(1472734400000).valueOf()],
    id: 'filter-2',
    dataId: [dataId]
  };

  field = fields[epochFilter.fieldIdx[0]];

  filterFunction = getFilterFunction(field, dataId, epochFilter, [], dataContainer);

  t.equal(
    filterFunction({index: 10}),
    true,
    `${dataContainer.valueAt(10, 1)} should be inside the range`
  );

  t.equal(
    filterFunction({index: 15}),
    false,
    `${dataContainer.valueAt(15, 1)} should be outside the range`
  );

  const tzFilter = {
    fieldIdx: [7],
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-09-23T00:00:00.000Z').valueOf(),
      moment.utc('2016-09-23T06:00:00.000Z').valueOf()
    ],
    id: 'filter-3',
    dataId: [dataId]
  };

  field = fields[tzFilter.fieldIdx[0]];

  filterFunction = getFilterFunction(field, dataId, tzFilter, [], dataContainer);

  t.equal(
    filterFunction({index: 10}),
    true,
    `${dataContainer.valueAt(10, 7)} should be inside the range`
  );

  t.equal(
    filterFunction({index: 23}),
    false,
    `${dataContainer.valueAt(23, 7)} should be outside the range`
  );

  const utcFilter = {
    fieldIdx: [8],
    type: FILTER_TYPES.timeRange,
    value: [
      moment.utc('2016-10-01 09:45:39+00:00').valueOf(),
      moment.utc('2016-10-01 10:00:00+00:00').valueOf()
    ],
    id: 'filter-4',
    dataId: [dataId]
  };

  field = fields[utcFilter.fieldIdx[0]];

  filterFunction = getFilterFunction(field, dataId, utcFilter, [], dataContainer);

  t.equal(
    filterFunction({index: 6}),
    false,
    `${dataContainer.valueAt(0, 8)} should be outside the range`
  );

  t.equal(
    filterFunction({index: 4}),
    true,
    `${dataContainer.valueAt(4, 8)} should be inside the range`
  );

  t.equal(
    filterFunction({index: 23}),
    false,
    `${dataContainer.valueAt(23, 8)} should be outside the range`
  );
}

test('KeplerTable -> getColumnFilterDomain -> time', t => {
  const expectedFields = testFields;

  const data = processCsvData(testData);
  const newDataEntry = createNewDataEntry({
    info: {id: 'test'},
    data
  });
  const dataset = newDataEntry.test;
  cmpFields(t, expectedFields, dataset.fields, dataset.id);
  testGetTimeFieldDomain(dataset, t);
  testGetFilterFunction(dataset, t);

  t.end();
});

test('KeplerTable -> getColumnFilterDomain -> numeric', async t => {
  const data = processCsvData(numericRangesCsv);
  const newDataEntry = createNewDataEntry({
    info: {id: 'test'},
    data
  });
  const dataset = newDataEntry.test;

  testGetNumericFieldStep(dataset, t);

  t.end();
});

test('KeplerTable -> findPointFieldPairs', t => {
  const TASE_CASE = [
    {
      fields: [
        'point-lat',
        'point-lng',
        'long',
        'lat',
        'poi_latitude',
        'poi_longitude',
        'latino',
        'lngtino',
        'lat.1',
        'lng.1'
      ],
      expected: [
        {
          defaultName: 'point',
          pair: {
            lat: {
              fieldIdx: 0,
              value: 'point-lat'
            },
            lng: {
              fieldIdx: 1,
              value: 'point-lng'
            }
          },
          suffix: ['lat', 'lng']
        },
        {
          defaultName: 'point',
          pair: {
            lat: {
              fieldIdx: 3,
              value: 'lat'
            },
            lng: {
              fieldIdx: 2,
              value: 'long'
            }
          },
          suffix: ['lat', 'long']
        },
        {
          defaultName: 'poi',
          pair: {
            lat: {
              fieldIdx: 4,
              value: 'poi_latitude'
            },
            lng: {
              fieldIdx: 5,
              value: 'poi_longitude'
            }
          },
          suffix: ['latitude', 'longitude']
        },
        {
          defaultName: '1',
          pair: {
            lat: {
              fieldIdx: 8,
              value: 'lat.1'
            },
            lng: {
              fieldIdx: 9,
              value: 'lng.1'
            }
          },
          suffix: ['lat', 'lng']
        }
      ]
    },
    {
      fields: ['point.lat', 'point.long', 'point.altitude', 'latitude', 'longitude'],
      expected: [
        {
          defaultName: 'point',
          pair: {
            lat: {
              fieldIdx: 0,
              value: 'point.lat'
            },
            lng: {
              fieldIdx: 1,
              value: 'point.long'
            },
            altitude: {
              fieldIdx: 2,
              value: 'point.altitude'
            }
          },
          suffix: ['lat', 'long']
        },
        {
          defaultName: 'point',
          pair: {
            lat: {
              fieldIdx: 3,
              value: 'latitude'
            },
            lng: {
              fieldIdx: 4,
              value: 'longitude'
            }
          },
          suffix: ['latitude', 'longitude']
        }
      ]
    },
    {
      fields: ['point_lat', 'point_lng', 'alt'],
      expected: [
        {
          defaultName: 'point',
          pair: {
            // no matching "alt" altitude found for this pair
            lat: {
              fieldIdx: 0,
              value: 'point_lat'
            },
            lng: {
              fieldIdx: 1,
              value: 'point_lng'
            }
          },
          suffix: ['lat', 'lng']
        }
      ]
    },
    {
      fields: ['point_lat', 'point_lng', 'point_alt'],
      expected: [
        {
          defaultName: 'point',
          pair: {
            // a matching "point_alt" altitude was found for this pair
            lat: {
              fieldIdx: 0,
              value: 'point_lat'
            },
            lng: {
              fieldIdx: 1,
              value: 'point_lng'
            },
            altitude: {
              fieldIdx: 2,
              value: 'point_alt'
            }
          },
          suffix: ['lat', 'lng']
        }
      ]
    }
  ];

  TASE_CASE.forEach(({fields, expected}) => {
    const found = findPointFieldPairs(fields.map(f => ({name: f})));

    t.equal(expected.length, found.length, `should found ${expected.length} pairs`);
    expected.forEach((pair, index) => {
      t.deepEqual(found[index], pair, 'should found correct point pair');
    });
  });

  t.end();
});
