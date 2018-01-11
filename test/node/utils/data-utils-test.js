import test from 'tape';
import testData, {testFields, testAllData, wktCsv, wktCsvFields} from '../../../../../test/fixtures/test-csv-data';
import {geojsonData, fields as geojsonFields, rows as geojsonRows} from '../../../../../test/fixtures/geojson';

import {
  getFieldsFromData,
  getRoundingDecimalFromStep,
  getSampleForTypeAnalyze,
  parseCsvDataByFieldType,
  preciseRound,
  processCsvData,
  processGeoJSONData,
  roundValToStep
} from '../../../src/utils/data-utils';

import {
  ALL_FIELD_TYPES
} from '../../../src/constants/default-settings';

test('dataUtils -> preciseRound', t => {

  t.equal(preciseRound(1.234, 2), '1.23', 'should round 1.234 correctly');
  t.equal(preciseRound(13.234, 0), '13', 'should round 13.234 correctly');
  t.equal(preciseRound(13, 2), '13.00', 'should round 13 correctly');
  t.equal(preciseRound(1.437, 2), '1.44', 'should round 1.437 correctly');
  t.equal(preciseRound(0.09999999999999987, 8), '0.10000000',
    'should round 0.10000000 correctly');
  t.end();
});

test('dataUtils -> getRoundingDecimalFromStep', t => {

  t.equal(getRoundingDecimalFromStep(1), 0, 'decimal of step=int should be 0');
  t.equal(getRoundingDecimalFromStep(0.1), 1,
    'decimal of step=0.1 should be 1');
  t.equal(getRoundingDecimalFromStep(0.01), 2,
    'decimal of step=0.01 should be 2');
  t.equal(getRoundingDecimalFromStep(0.2), 1,
    'decimal of step=0.2 should be 1');
  t.equal(getRoundingDecimalFromStep(0.001), 3,
    'decimal of step=0.001 should be 3');
  t.equal(getRoundingDecimalFromStep(10), 0,
    'decimal of step=10 should be 0');
  t.equal(getRoundingDecimalFromStep(0.5), 1,
    'decimal of step=0.5 should be 0');
  t.equal(getRoundingDecimalFromStep(1.5), 1,
    'decimal of step=1.5 should be 1');
  t.end();

});

test('dataUtils -> getRoundingDecimalFromStep', t => {

  t.equal(roundValToStep(0, 0.1, 0.11), 0.1, 'should round 0.11 to 0.1');
  t.equal(roundValToStep(0, 0.1, 0.1), 0.1, 'should round 0.1 to 0.1');
  t.equal(roundValToStep(1, 0.1, 1.16), 1.2, 'should round 1.16 to 1.2');
  t.equal(roundValToStep(1, 1, 1.6), 2, 'should round 1.6 to 2');
  t.equal(roundValToStep(1, 1, 1.32), 1, 'should round 1.32 to 1');
  t.equal(roundValToStep(1, 0.01, 1.435), 1.44, 'should round 1.435 to 1.44');
  t.equal(roundValToStep(1, 0.001, 1.4357), 1.436,
    'should round 1.4357 to 1.436');
  t.equal(roundValToStep(0, 0.2, 1.5), 1.6, 'should round 1.5 to 1.6');
  t.equal(roundValToStep(0, 0.5, 20.25), 20.5, 'should round 20.25 to 20.5');
  t.equal(roundValToStep(0.3, 0.3, 12.77), 12.9, 'should round 12.77 to 12.9');
  t.equal(roundValToStep(-13, 0.1, -10.77), -10.8,
    'should round -10.77 to -10.8');
  t.equal(roundValToStep(-30, 1, -14.5), -14,
    'should round -14.5 to -14');
  t.end();

});

test('dataUtils -> parseCsvDataByFieldType -> real', t => {

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

test('dataUtils -> parseCsvDataByFieldType -> integer', t => {

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

test('dataUtils -> parseCsvDataByFieldType -> boolean', t => {

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

test('dataUtils -> getFieldsFromData', t => {
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

test('dataUtils -> processCsvData', async t => {

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

test('dataUtils -> processCsv.wkt', async t => {
  const {fields} = await processCsvData(wktCsv);

  t.deepEqual(fields, wktCsvFields, 'should find geometry fields as type:geojson');

  t.end();
});

test('dataUtils => processGeoJSONData', async t => {

  const {fields, rows} = await processGeoJSONData({'test.geo.json': geojsonData});

  t.deepEqual(fields, geojsonFields, 'should format geojson fields');
  t.deepEqual(rows, geojsonRows, 'should format geojson rows');

  t.end();
});

test('dataUtils -> getSampleForTypeAnalyze', t => {
  const fields = [{
    name: 'string'
  }, {
    name: 'int'
  }, {
    name: 'bool'
  }, {
    name: 'time'
  }];

  const allData = [
    ['a', 0, true, null],
    ['b', 2, false, null],
    ['c', 3, true, '2017-01-01'],
    [null, 1, false, '2017-01-02'],
    ['d', 6, false, '2017-01-03'],
    ['e', 4, true, null],
    ['f', 5, true, undefined],
    ['g', null, true, null],
    ['h', undefined, true, '2017-01-04']
  ];

  const sample = getSampleForTypeAnalyze({fields, allData, sampleCount: 5});
  const expected = [{
    string: 'a',
    int: 0,
    bool: true,
    time: '2017-01-01'
  }, {
    string: 'b',
    int: 2,
    bool: false,
    time: '2017-01-02'
  }, {
    string: 'c',
    int: 3,
    bool: true,
    time: '2017-01-03'
  }, {
    string: 'd',
    int: 1,
    bool: false,
    time: '2017-01-04'
  }, {
    string: 'e',
    int: 6,
    bool: false,
    time: null
  }];

  t.deepEqual(sample, expected, 'Should find correct sample for type analyzer');
  t.end();
});
