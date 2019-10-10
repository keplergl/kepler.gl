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
import testData, {
  dataWithNulls,
  parsedDataWithNulls,
  testFields,
  testAllData,
  wktCsv,
  wktCsvFields
} from 'test/fixtures/test-csv-data';
import {
  geojsonData,
  fields as geojsonFields,
  rows as geojsonRows
} from 'test/fixtures/geojson';

import {
  getFieldsFromData,
  getSampleForTypeAnalyze,
  parseCsvRowsByFieldType,
  processCsvData,
  processGeojson
} from 'processors/data-processor';

import {ALL_FIELD_TYPES} from 'constants/default-settings';

test('Processor -> getFieldsFromData', t => {
  const data = [
    {
      time: '2016-09-17 00:09:55',
      trip_epoch: '1472688000000',
      time_str: 'January 1st 2017 11:00pm ',
      value: '4',
      surge: '1.2',
      isTrip: 'true',
      zeroOnes: '0'
    },
    {
      time: '2016-09-17 00:30:08',
      trip_epoch: '1472860800000',
      time_str: 'January 1st 2017 11:01pm ',
      value: '3',
      surge: null,
      isTrip: 'false',
      zeroOnes: '1'
    },
    {
      time: null,
      trip_epoch: null,
      time_str: 'January 1st, 2017 11:02pm ',
      value: '2',
      surge: '1.3',
      isTrip: null,
      zeroOnes: '1'
    },
    {
      time: null,
      trip_epoch: null,
      time_str: 'January 1st, 2017 11:02pm ',
      value: '0',
      surge: '1.4',
      isTrip: null,
      zeroOnes: '0'
    }
  ];

  const headerRow = Object.keys(data[0]);
  const fields = getFieldsFromData(data, headerRow);
  const expectedFieldTypes = [
    'timestamp',
    'timestamp',
    'timestamp',
    'integer',
    'real',
    'boolean',
    'integer'
  ];

  fields.forEach((f, i) =>
    t.equal(
      f.type,
      expectedFieldTypes[i],
      `should find field type as ${expectedFieldTypes[i]}`
    )
  );
  t.end();
});

test('Processor -> processCsvData', t => {
  // load sample dataset csv as text
  const {fields, rows} = processCsvData(testData);

  t.equal(
    rows.length,
    testAllData.length,
    `should return ${testAllData.length} rows`
  );

  t.deepEqual(fields, testFields, 'should parse fields correctly');
  t.deepEqual(rows, testAllData, 'should parse rows correctly');

  fields.forEach((f, i) => {
    t.deepEqual(
      f,
      testFields[i],
      `should parse correct field ${testFields[i].name}`
    );
  });

  rows.forEach((r, i) => {
    t.deepEqual(r, testAllData[i], `should parse row ${i} correctly`);
  });

  t.end();
});

test('Processor -> processCsvData: duplicated field name', t => {
  const testData1 = `column1,column1,column2\na,b,c\nc,d,e`;

  // load sample dataset csv as text
  const result = processCsvData(testData1);

  const expectedResult = {
    fields: [
      {name: 'column1', format: '', tableFieldIndex: 1, type: 'string'},
      {name: 'column1-0', format: '', tableFieldIndex: 2, type: 'string'},
      {name: 'column2', format: '', tableFieldIndex: 3, type: 'string'}
    ],
    rows: [['a', 'b', 'c'], ['c', 'd', 'e']]
  };

  t.deepEqual(
    result,
    expectedResult,
    `should return ${testAllData.length} rows`
  );

  t.end();
});

test('Processor -> processCsvData -> with nulls', t => {
  const {fields, rows} = processCsvData(dataWithNulls);
  t.deepEqual(fields, testFields, 'should parse fields correctly');

  fields.forEach((f, i) => {
    t.deepEqual(
      f,
      testFields[i],
      `should parse correct field ${testFields[i].name}`
    );
  });

  t.deepEqual(rows, parsedDataWithNulls, 'should parse rows correctly');
  rows.forEach((r, i) => {
    t.deepEqual(r, parsedDataWithNulls[i], `should parse row ${i} correctly`);
  });
  t.end();
});

test('Processor -> processCsv.wkt', t => {
  const {fields} = processCsvData(wktCsv);

  t.deepEqual(
    fields,
    wktCsvFields,
    'should find geometry fields as type:geojson'
  );

  t.end();
});

test('Processor => processGeojson', t => {
  const {fields, rows} = processGeojson(geojsonData);

  t.deepEqual(fields, geojsonFields, 'should format geojson fields');
  t.deepEqual(rows, geojsonRows, 'should format geojson rows');

  t.end();
});

test('Processor => processGeojson:invalid geojson', t => {
  t.throws(
    () => processGeojson({fields: [], rows: []}),
    'Should throw error with invalid geojson type'
  );

  t.end();
});

test('Processor => processGeojson: parse rows', t => {
  const testGeoData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {TRIPS: '11',RATE: 'a',TIME: '1570749707'},
        geometry: {type: 'Point',coordinates: [[-122, 37]]}
      },
      {
        type: 'Feature',
        properties: {TRIPS: '10',RATE: 'b',TIME: '1570749707'},
        geometry: {type: 'Point',coordinates: [[-122, 37]]}
      },
      {
        type: 'Feature',
        properties: {TRIPS: '9',RATE: 'b',TIME: '1570749707'},
        geometry: {type: 'Point',coordinates: [[-122, 37]]}
      }
    ]
  };

  const expectedFields = [
    {name: '_geojson', format: '', tableFieldIndex: 1, type: 'geojson'},
    {name: 'TRIPS', format: '', tableFieldIndex: 2, type: 'integer'},
    {name: 'RATE', format: '', tableFieldIndex: 3, type: 'string'},
    {name: 'TIME', format: 'x', tableFieldIndex: 4, type: 'timestamp'}
  ];

  const expectedRows = [
    [
      {
        type: 'Feature',
        properties: {TRIPS: 11,RATE: 'a',TIME: 1570749707},
        geometry: {type: 'Point',coordinates: [[-122, 37]]}
      }, 11, 'a', 1570749707
    ],
    [
      {
        type: 'Feature',
        properties: {TRIPS: 10,RATE: 'b',TIME: 1570749707},
        geometry: {type: 'Point',coordinates: [[-122, 37]]}
      }, 10, 'b', 1570749707
    ],
    [
      {
        type: 'Feature',
        properties: {TRIPS: 9,RATE: 'b',TIME: 1570749707},
        geometry: {type: 'Point',coordinates: [[-122, 37]]}
      }, 9, 'b', 1570749707
    ]
  ];
  const result = processGeojson(testGeoData);

  t.deepEqual(Object.keys(result), ['fields', 'rows'], 'should contain fields and rows');
  t.deepEqual(result.fields, expectedFields, 'should parse correct fields when geojson input contain string');
  t.deepEqual(result.rows, expectedRows, 'should parse correct rows when geojson input contain string');

  t.end();
});

test('Processor -> parseCsvRowsByFieldType -> real', t => {
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

  parseCsvRowsByFieldType(rows, -1, field, 0);
  t.same(rows, expected, 'should parsed reals properly');
  t.end();
});

test('Processor -> parseCsvRowsByFieldType -> integer', t => {
  const field = {
    type: ALL_FIELD_TYPES.integer
  };

  const rows = [['0'], ['1'], ['-1'], ['155'], [' 155 '], [' 155 xyz']];

  const expected = [[0], [1], [-1], [155], [155], [155]];

  parseCsvRowsByFieldType(rows, -1, field, 0);
  t.same(rows, expected, 'should parsed ints properly');
  t.end();
});

test('Processor -> parseCsvRowsByFieldType -> boolean', t => {
  const field = {
    type: ALL_FIELD_TYPES.boolean
  };

  const rows = [
    [null],
    ['0'],
    ['1'],
    ['True'],
    ['False'],
    ['0'],
    ['1'],
    ['true']
  ];

  // is parsing '' meaningful, why not false
  const expected = [
    [null],
    [false],
    [true],
    [true],
    [false],
    [false],
    [true],
    [true]
  ];

  parseCsvRowsByFieldType(rows, -1, field, 0);
  t.same(rows, expected, 'should parsed boolean properly');
  t.end();
});

test('dataUtils -> getSampleForTypeAnalyze', t => {
  const fields = ['string', 'int', 'bool', 'time'];

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
  const expected = [
    {
      string: 'a',
      int: 0,
      bool: true,
      time: '2017-01-01'
    },
    {
      string: 'b',
      int: 2,
      bool: false,
      time: '2017-01-02'
    },
    {
      string: 'c',
      int: 3,
      bool: true,
      time: '2017-01-03'
    },
    {
      string: 'd',
      int: 1,
      bool: false,
      time: '2017-01-04'
    },
    {
      string: 'e',
      int: 6,
      bool: false,
      time: null
    }
  ];

  t.deepEqual(sample, expected, 'Should find correct sample for type analyzer');
  t.end();
});
