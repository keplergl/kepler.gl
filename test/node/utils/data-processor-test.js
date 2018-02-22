import test from 'tape';
import testData, {testFields, testAllData, wktCsv, wktCsvFields} from 'test/fixtures/test-csv-data';
import {geojsonData, fields as geojsonFields, rows as geojsonRows} from 'test/fixtures/geojson';

import {
  getFieldsFromData,
  parseCsvDataByFieldType,
  processCsvData,
  processGeojson
} from 'processors/data-processor';

import {
  ALL_FIELD_TYPES
} from 'constants/default-settings';

test('Processor -> getFieldsFromData', t => {
  const data = [{
    time: '2016-09-17 00:09:55',
    trip_epoch: '1472688000000',
    time_str: 'January 1st 2017 11:00pm ',
    value: '4',
    surge: '1.2',
    isTrip: 'true'
  }, {
    time: '2016-09-17 00:30:08',
    trip_epoch: '1472860800000',
    time_str: 'January 1st 2017 11:01pm ',
    value: '3',
    surge: null,
    isTrip: 'false'
  }, {
    time: null,
    trip_epoch: null,
    time_str: 'January 1st, 2017 11:02pm ',
    value: '2',
    surge: '1.3',
    isTrip: null
  }, {
    time: null,
    trip_epoch: null,
    time_str: 'January 1st, 2017 11:02pm ',
    value: '0',
    surge: '1.4',
    isTrip: null
  }];

  const headerRow = Object.keys(data[0]);
  const fields = getFieldsFromData(data, headerRow);
  const expectedFieldTypes =
    ['timestamp', 'timestamp', 'timestamp', 'integer', 'real', 'boolean'];

  fields.forEach((f, i) =>
    t.equal(f.type, expectedFieldTypes[i],
      `should find field type as ${expectedFieldTypes[i]}`)
  );
  t.end();
});

test('Processor -> processCsvData', async t => {

  // load sample dataset csv as text
  const data = testData;

  const expectedFields = [
    'timestamp',
    'real',
    'real',
    'string',
    'timestamp',
    'boolean',
    'integer',
    'timestamp',
    'timestamp',
    'timestamp',
    'date'
  ];

  const {fields, rows} = await processCsvData(data);

  t.equal(fields.length, testFields.length, `should return ${testFields.length} fields`);
  t.equal(rows.length, testAllData.length, `should return ${testAllData.length} rows`);

  fields.forEach((f, i) => {
    t.equal(f.type, expectedFields[i], `should find field type as ${expectedFields[i]}`);
    t.deepEqual(f, testFields[i], `should find correct field ${testFields[i].label}`);
  });

  rows.forEach((r, i) => {
    t.deepEqual(r, testAllData[i], `should parse row ${i} correctly`);
  });

  t.end();
});

test('Processor -> processCsv.wkt', async t => {
  const {fields} = await processCsvData(wktCsv);

  t.deepEqual(fields, wktCsvFields, 'should find geometry fields as type:geojson');

  t.end();
});

test('Processor => processGeojson', async t => {

  const {fields, rows} = await processGeojson(geojsonData);

  t.deepEqual(fields, geojsonFields, 'should format geojson fields');
  t.deepEqual(rows, geojsonRows, 'should format geojson rows');

  t.end();
});


test('Processor -> parseCsvDataByFieldType -> real', t => {

  const field = {
    type: ALL_FIELD_TYPES.real
  };

  const rows = [
    ['0.0'],
    ['1.0'],
    ['-1.0'],
    ['155.0'],
    ['1.55e3'],
    ['1.55e-3'],
    [' 1.55e-3 '],
    [' 1.55e+3 xyz']
  ];

  const expected = [
    [0.0],
    [1.0],
    [-1.0],
    [155.0],
    [1550.0],
    [0.00155],
    [0.00155],
    [1550.0]
  ];

  parseCsvDataByFieldType(rows, field, 0);
  t.same(rows, expected, 'should parsed reals properly');
  t.end();
});

test('Processor -> parseCsvDataByFieldType -> integer', t => {

  const field = {
    type: ALL_FIELD_TYPES.integer
  };

  const rows = [
    ['0'],
    ['1'],
    ['-1'],
    ['155'],
    [' 155 '],
    [' 155 xyz']
  ];

  const expected = [
    [0],
    [1],
    [-1],
    [155],
    [155],
    [155]
  ];

  parseCsvDataByFieldType(rows, field, 0);
  t.same(rows, expected, 'should parsed ints properly');
  t.end();
});

test('Processor -> parseCsvDataByFieldType -> boolean', t => {

  const field = {
    type: ALL_FIELD_TYPES.boolean
  };

  const rows = [
    [null],
    ['0'],
    ['1'],
    ['True'],
    ['False'],
    [0],
    [1],
    ['true']
  ];

  // is parsing '' meaningful, why not false
  const expected = [
    [null],
    [false],
    [false],
    [true],
    [false],
    [false],
    [false],
    [true]
  ];

  parseCsvDataByFieldType(rows, field, 0);
  t.same(rows, expected, 'should parsed boolean properly');
  t.end();
});
