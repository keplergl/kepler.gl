// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import moment from 'moment';
import testData, {numericRangesCsv, testFields} from 'test/fixtures/test-csv-data';

import {preciseRound, getFilterFunction} from '@kepler.gl/utils';
import {findPointFieldPairs, KeplerTable, createNewDataEntry} from '@kepler.gl/table';
import {processCsvData} from '@kepler.gl/processors';
import {ALL_FIELD_TYPES, FILTER_TYPES} from '@kepler.gl/constants';
import * as arrow from 'apache-arrow';

import {cmpFields} from '../../helpers/comparison-utils';
import {createNewDataEntryMock} from '../../helpers/table-utils';

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

test('KeplerTable -> getColumnFilterDomain -> time', async t => {
  const expectedFields = testFields;

  const data = processCsvData(testData);
  const dataset = (
    await createNewDataEntryMock({
      info: {id: 'test'},
      data
    })
  ).test;
  cmpFields(t, expectedFields, dataset.fields, dataset.id);
  testGetTimeFieldDomain(dataset, t);
  testGetFilterFunction(dataset, t);

  t.end();
});

test('KeplerTable -> getColumnFilterDomain -> numeric', async t => {
  const data = processCsvData(numericRangesCsv);
  const dataset = (
    await createNewDataEntryMock({
      info: {id: 'test'},
      data
    })
  ).test;

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

test('KeplerTable -> Int64 field accessor converts BigInt to number', async t => {
  const arrowTable = arrow.tableFromArrays({
    count: new BigInt64Array([1n, 9999n]),
    name: ['a', 'b']
  });
  const table = new KeplerTable({info: {id: 'int64'}, color: [0, 0, 0]});
  await table.importData({
    data: {
      fields: [
        {name: 'count', type: ALL_FIELD_TYPES.integer, analyzerType: 'INT'},
        {name: 'name', type: ALL_FIELD_TYPES.string, analyzerType: 'STRING'}
      ],
      cols: [arrowTable.getChildAt(0), arrowTable.getChildAt(1)],
      arrowTable
    }
  });

  t.equal(typeof table.dataContainer.valueAt(0, 0), 'bigint', 'valueAt stays raw BigInt');
  t.equal(table.dataContainer.valueAt(0, 0), 1n);
  t.equal(
    typeof table.fields[0].valueAccessor({index: 0}),
    'number',
    'Int64 valueAccessor returns a JS number'
  );
  t.equal(table.fields[0].valueAccessor({index: 0}), 1);
  t.equal(table.fields[0].valueAccessor({index: 1}), 9999);
  t.equal(table.fields[1].valueAccessor({index: 0}), 'a', 'non-Int64 accessors are unchanged');

  t.end();
});

test('KeplerTable -> update with arrow cols keeps gpu filter state', async t => {
  const first = arrow.tableFromArrays({
    lat: [1, 2],
    lng: [3, 4]
  });
  const table = new KeplerTable({info: {id: 'arrow-inc'}, color: [0, 0, 0]});
  await table.importData({
    data: {
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
        {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
      ],
      rows: [],
      cols: [first.getChildAt(0), first.getChildAt(1)],
      arrowTable: first
    }
  });

  const gpuFilter = table.gpuFilter;
  table.filterRecord = {name: 'keep-me'};

  const next = arrow.tableFromArrays({
    lat: [1, 2, 3],
    lng: [3, 4, 5]
  });
  await table.update({
    fields: [
      {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
      {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
    ],
    rows: [],
    cols: [next.getChildAt(0), next.getChildAt(1)],
    arrowTable: next
  });

  t.equal(table.length, 3, 'arrow incremental update should grow rows');
  t.equal(table.gpuFilter, gpuFilter, 'arrow incremental update should keep gpuFilter');
  t.equal(table.filterRecord?.name, 'keep-me', 'arrow incremental update should keep filterRecord');
  t.equal(table.dataRevision, 1, 'arrow incremental update should bump dataRevision');
  t.end();
});

test('KeplerTable -> update DuckDB cols payload keeps fields and gpuFilter', async t => {
  const first = arrow.tableFromArrays({
    lat: [1, 2],
    lng: [3, 4]
  });
  const table = new KeplerTable({info: {id: 'duckdb-shape'}, color: [0, 0, 0]});
  await table.importData({
    data: {
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
        {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
      ],
      rows: [],
      cols: [first.getChildAt(0), first.getChildAt(1)],
      arrowTable: first
    }
  });
  const gpuFilter = table.gpuFilter;
  const names = table.fields.map(field => field.name);

  const next = arrow.tableFromArrays({
    lat: [1, 2, 3],
    lng: [3, 4, 5]
  });
  // DuckDBTable.update calls super.update({cols, rows: [], fields: []})
  await table.update({
    cols: [next.getChildAt(0), next.getChildAt(1)],
    rows: [],
    fields: []
  });

  t.equal(table.length, 3, 'DuckDB-shaped update should grow rows');
  t.deepEqual(
    table.fields.map(field => field.name),
    names,
    'empty fields must not rebuild schema'
  );
  t.equal(table.gpuFilter, gpuFilter, 'DuckDB-shaped update should keep gpuFilter');
  t.end();
});

test('createNewDataEntry -> existing id updates Arrow table in place', async t => {
  const fields = [
    {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
    {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
  ];
  const batch1 = arrow.tableFromArrays({lat: [1], lng: [2]});
  const datasets = await createNewDataEntryMock({
    info: {id: 'arrow-1'},
    data: {
      fields,
      rows: [],
      cols: [batch1.getChildAt(0), batch1.getChildAt(1)]
    }
  });
  const table = datasets['arrow-1'];
  t.equal(table.length, 1, 'first batch should create the table');
  const gpuFilter = table.gpuFilter;
  const revision = table.dataRevision;

  const batch2 = arrow.tableFromArrays({
    lat: [1, 3],
    lng: [2, 4]
  });
  const task = createNewDataEntry(
    {
      info: {id: 'arrow-1'},
      data: {
        fields,
        rows: [],
        cols: [batch2.getChildAt(0), batch2.getChildAt(1)]
      }
    },
    datasets
  );
  t.equal(task.type, 'UPDATE_TABLE_TASK', 'same id should update instead of creating');

  await task.run(
    async (effectorPrime, success, error) => {
      await effectorPrime(success, error);
    },
    value => {
      t.equal(value, table, 'should return the same table instance');
    }
  );

  t.equal(table.length, 2, 'second batch should replace/grow rows');
  t.equal(table.gpuFilter, gpuFilter, 'incremental createNewDataEntry should keep gpuFilter');
  t.ok(table.dataRevision > revision, 'incremental createNewDataEntry should bump dataRevision');
  t.end();
});

test('KeplerTable -> update rebuilds fields when arrow column names change', async t => {
  const first = arrow.tableFromArrays({
    lat: [1],
    lng: [2]
  });
  const table = new KeplerTable({info: {id: 'arrow-schema'}, color: [0, 0, 0]});
  await table.importData({
    data: {
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
        {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
      ],
      rows: [],
      cols: [first.getChildAt(0), first.getChildAt(1)],
      arrowTable: first
    }
  });

  const next = arrow.tableFromArrays({
    lat: [1],
    lng: [2],
    name: ['a']
  });
  await table.update({
    fields: [
      {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
      {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
      {name: 'name', type: ALL_FIELD_TYPES.string, analyzerType: 'STRING'}
    ],
    rows: [],
    cols: [next.getChildAt(0), next.getChildAt(1), next.getChildAt(2)],
    arrowTable: next
  });

  t.equal(table.fields.length, 3, 'column schema change should rebuild fields');
  t.equal(table.fields[2].name, 'name');
  t.end();
});

test('KeplerTable -> update replaces row snapshots', async t => {
  const table = new KeplerTable({info: {id: 'rows'}, color: [0, 0, 0]});
  await table.importData({
    data: {
      fields: [
        {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
        {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
      ],
      rows: [
        [1, 2],
        [3, 4]
      ]
    }
  });
  t.equal(table.length, 2, 'starts with 2 rows');
  table.filterRecord = {name: 'stale'};

  await table.update({
    fields: [
      {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
      {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
    ],
    rows: [
      [10, 20],
      [30, 40],
      [50, 60]
    ]
  });
  t.equal(table.length, 3, 'should grow to the new snapshot');
  t.equal(table.fields[0].valueAccessor({index: 0}), 10, 'accessors should read new values');
  t.equal(table.filteredIndex.length, 3, 'filtered index should match new length');
  t.equal(table.filterRecord, undefined, 'row snapshot should drop stale filterRecord');

  const leftoverArrow = arrow.tableFromArrays({lat: [0], lng: [0]});
  await table.update({
    fields: [
      {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
      {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}
    ],
    rows: [[7, 8]],
    arrowTable: leftoverArrow
  });
  t.equal(table.length, 1, 'row snapshot should win over leftover arrowTable');
  t.equal(table.fields[0].valueAccessor({index: 0}), 7);

  await table.update({
    fields: [
      {name: 'lat', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
      {name: 'lng', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'},
      {name: 'name', type: ALL_FIELD_TYPES.string, analyzerType: 'STRING'}
    ],
    rows: [['a', 'b', 'c']]
  });
  t.equal(table.fields.length, 3, 'schema change should rebuild fields');
  t.equal(table.length, 1, 'schema change should import the new rows');
  t.end();
});
