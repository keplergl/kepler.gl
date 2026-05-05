// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import sinon from 'sinon';
import {console as Console} from 'global/window';
import {DATA_TYPES} from 'type-analyzer';
import cloneDeep from 'lodash/cloneDeep';

import testData, {
  dataWithNulls,
  parsedDataWithNulls,
  testFields,
  testAllData,
  wktCsv,
  wktCsvFields,
  wktCsvRows
} from 'test/fixtures/test-csv-data';
import {
  geojsonData,
  geoJsonWithStyle,
  geoStyleFields,
  geoStyleRows,
  fields as geojsonFields,
  rows as geojsonRows
} from 'test/fixtures/geojson';
import testCsvObjectData, {objCsvFields, objCsvRows} from 'test/fixtures/test-csv-object';
import testCsvH3Data, {expectedFields as expectedHexFields} from 'test/fixtures/test-hex-id-data';
import {
  parseCsvRowsByFieldType,
  processCsvData,
  processGeojson,
  processRowObject,
  detectDelimiter
} from '@kepler.gl/processors';

import {validateInputData, createDataContainer} from '@kepler.gl/utils';

import {
  ACCEPTED_ANALYZER_TYPES,
  analyzerTypeToFieldType,
  getFieldsFromData,
  getSampleForTypeAnalyze
} from '@kepler.gl/common-utils';

import {formatCsv} from '@kepler.gl/reducers';

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {cmpFields} from '../../helpers/comparison-utils';

test('Processor -> getFieldsFromData', t => {
  const data = [
    {
      time: '2016-09-17 00:09:55',
      trip_epoch: '1472688000000',
      time_str: 'January 1st 2017 11:00pm ',
      value: '4',
      novalue: null,
      surge: '1.2',
      isTrip: 'true',
      zeroOnes: '0',
      h3_9: '89268cd80b3ffff',
      geojson: '{"type":"Point","coordinates":[-122.4194155,37.7749295]}',
      wkt: 'POINT (-122.4194155 37.7749295)',
      wkb: '0101000020E6100000E17A14AE47D25EC0F6F3F6F2F7F94040'
    },
    {
      time: '2016-09-17 00:30:08',
      trip_epoch: '1472860800000',
      time_str: 'January 1st 2017 11:01pm ',
      value: '3',
      novalue: null,
      surge: null,
      isTrip: 'false',
      zeroOnes: '1',
      h3_9: '89268cd8103ffff',
      geojson:
        '{"type":"Polygon","coordinates":[[[-122.4194155,37.7749295],[-122.4194155,37.7749295],[-122.4194155,37.7749295]]]}',
      wkt: 'POLYGON ((-122.4194155 37.7749295, -122.4194155 37.7749295, -122.4194155 37.7749295))',
      wkb: '0103000020E61000000100000005000000E17A14AE47D25EC0F6F3F6F2F7F940400000000E17A14AE47D25EC0F6F3F6F2F7F940400000000E17A14AE47D25EC0F6F3F6F2F7F94040'
    },
    {
      time: null,
      trip_epoch: null,
      time_str: 'January 1st, 2017 11:02pm ',
      value: '2',
      novalue: null,
      surge: '1.3',
      isTrip: null,
      zeroOnes: '1',
      h3_9: '89268cd8107ffff',
      geojson:
        '{"type":"LineString","coordinates":[[-122.4194155,37.7749295],[-122.4194155,37.7749295]]}',
      wkt: 'LINESTRING (-122.4194155 37.7749295, -122.4194155 37.7749295)',
      wkb: '0102000020E610000002000000E17A14AE47D25EC0F6F3F6F2F7F94040E17A14AE47D25EC0F6F3F6F2F7F94040'
    },
    {
      time: null,
      trip_epoch: null,
      time_str: 'January 1st, 2017 11:02pm ',
      value: '0',
      novalue: null,
      surge: '1.4',
      isTrip: null,
      zeroOnes: '0',
      h3_9: '89268cd8113ffff',
      geojson:
        '{"type":"MultiPoint","coordinates":[[-122.4194155,37.7749295],[-122.4194155,37.7749295]]}',
      wkt: 'MULTIPOINT (-122.4194155 37.7749295, -122.4194155 37.7749295)',
      wkb: '0104000020E6100000020000000101000000E17A14AE47D25EC0F6F3F6F2F7F94040101000000E17A14AE47D25EC0F6F3F6F2F7F94040'
    }
  ];

  const headerRow = Object.keys(data[0]);
  const fields = getFieldsFromData(data, headerRow);
  const expectedFieldTypes = [
    'timestamp',
    'timestamp',
    'timestamp',
    'integer',
    'string',
    'real',
    'boolean',
    'integer',
    'h3',
    'geojson',
    'geojson',
    'geojson'
  ];

  fields.forEach((f, i) =>
    t.equal(f.type, expectedFieldTypes[i], `should find field type as ${expectedFieldTypes[i]}`)
  );
  t.end();
});

test('Processor -> processCsvData', t => {
  t.throws(() => processCsvData(''), 'should throw if csv is empty');

  // load sample dataset csv as text
  const {fields, rows} = processCsvData(cloneDeep(testData));

  t.equal(rows.length, testAllData.length, `should return ${testAllData.length} rows`);

  cmpFields(t, testFields, fields, 'should parse rows correctly');

  t.deepEqual(rows, testAllData, 'should parse rows correctly');

  rows.forEach((r, i) => {
    t.deepEqual(r, testAllData[i], `should parse row ${i} correctly`);
  });

  t.end();
});

test('Processor -> detectDelimiter', t => {
  t.equal(detectDelimiter('a,b,c\n1,2,3'), ',', 'should detect comma delimiter');
  t.equal(detectDelimiter('a\tb\tc\n1\t2\t3'), '\t', 'should detect tab delimiter');
  t.equal(detectDelimiter('a;b;c\n1;2;3'), ';', 'should detect semicolon delimiter');
  t.equal(detectDelimiter('a|b|c\n1|2|3'), '|', 'should detect pipe delimiter');

  t.equal(
    detectDelimiter('single_column\nvalue'),
    ',',
    'should fall back to comma when no delimiter produces multiple columns'
  );
  t.equal(detectDelimiter(''), ',', 'should return comma for empty string');
  t.equal(
    detectDelimiter('a,b,c'),
    ',',
    'should handle input without newline (single line)'
  );

  t.equal(
    detectDelimiter('"a\tb"\tc\td\n1\t2\t3'),
    '\t',
    'should handle quoted fields containing other delimiters'
  );
  t.equal(
    detectDelimiter('"city, state"\tpopulation\tarea\n"New York, NY"\t8000000\t302'),
    '\t',
    'should detect tab even when commas appear inside quoted fields'
  );

  t.equal(
    detectDelimiter('name;age;city\nAlice;30;"Berlin, Germany"'),
    ';',
    'should detect semicolon with quoted fields containing commas'
  );

  t.equal(
    detectDelimiter('a\tb\tc\td\te\n1\t2\t3\t4\t5'),
    '\t',
    'should prefer delimiter that produces more columns'
  );

  t.end();
});

test('Processor -> processCsvData -> tab-separated', t => {
  const tsvData = 'name\tage\tcity\nAlice\t30\tBerlin\nBob\t25\tParis';
  const result = processCsvData(tsvData);

  t.equal(result.fields.length, 3, 'should parse 3 fields from TSV');
  t.equal(result.fields[0].name, 'name', 'first field should be name');
  t.equal(result.fields[1].name, 'age', 'second field should be age');
  t.equal(result.fields[2].name, 'city', 'third field should be city');
  t.equal(result.rows.length, 2, 'should have 2 data rows');
  t.deepEqual(result.rows[0], ['Alice', 30, 'Berlin'], 'should parse first row correctly');
  t.deepEqual(result.rows[1], ['Bob', 25, 'Paris'], 'should parse second row correctly');

  t.end();
});

test('Processor -> processCsvData -> semicolon-separated', t => {
  const ssvData = 'name;value;active\nfoo;100;true\nbar;200;false';
  const result = processCsvData(ssvData);

  t.equal(result.fields.length, 3, 'should parse 3 fields from semicolon-separated data');
  t.equal(result.fields[0].name, 'name', 'first field should be name');
  t.equal(result.fields[1].name, 'value', 'second field should be value');
  t.equal(result.fields[2].name, 'active', 'third field should be active');
  t.equal(result.rows.length, 2, 'should have 2 data rows');
  t.deepEqual(result.rows[0], ['foo', 100, true], 'should parse first row correctly');
  t.deepEqual(result.rows[1], ['bar', 200, false], 'should parse second row correctly');

  t.end();
});

test('Processor -> processCsvData -> pipe-separated', t => {
  const psvData = 'id|name|score\n1|Alice|95.5\n2|Bob|87.3';
  const result = processCsvData(psvData);

  t.equal(result.fields.length, 3, 'should parse 3 fields from pipe-separated data');
  t.equal(result.fields[0].name, 'id', 'first field should be id');
  t.equal(result.fields[1].name, 'name', 'second field should be name');
  t.equal(result.fields[2].name, 'score', 'third field should be score');
  t.equal(result.rows.length, 2, 'should have 2 data rows');

  t.end();
});

test('Processor -> processCsvData -> semicolon with quoted commas', t => {
  const data = '"City, Country";Population;Area\n"Berlin, Germany";3600000;891\n"Paris, France";2100000;105';
  const result = processCsvData(data);

  t.equal(result.fields.length, 3, 'should parse 3 fields');
  t.equal(result.fields[0].name, 'City, Country', 'should preserve comma inside quotes');
  t.equal(result.rows.length, 2, 'should have 2 data rows');
  t.equal(result.rows[0][0], 'Berlin, Germany', 'should preserve quoted value with comma');

  t.end();
});

test('Processor -> detectDelimiter -> Windows line endings (CRLF)', t => {
  t.equal(
    detectDelimiter('a\tb\tc\r\n1\t2\t3\r\n'),
    '\t',
    'should detect tab delimiter with CRLF line endings'
  );
  t.equal(
    detectDelimiter('a;b;c\r\n1;2;3\r\n'),
    ';',
    'should detect semicolon delimiter with CRLF line endings'
  );

  t.end();
});

test('Processor -> detectDelimiter -> ambiguous cases', t => {
  t.equal(
    detectDelimiter('a,b\tc,d\n1,2\t3,4'),
    ',',
    'should prefer comma when comma produces more columns than tab'
  );
  t.equal(
    detectDelimiter('a\tb\tc\td,e\n1\t2\t3\t4,5'),
    '\t',
    'should prefer tab when tab produces more columns than comma'
  );
  t.equal(
    detectDelimiter('a;b;c;d|e\n1;2;3;4|5'),
    ';',
    'should prefer semicolon when it produces more columns than pipe'
  );

  t.end();
});

test('Processor -> detectDelimiter -> trailing and leading whitespace', t => {
  t.equal(
    detectDelimiter('  a\tb\tc  \n  1\t2\t3  '),
    '\t',
    'should detect tab even with surrounding whitespace'
  );
  t.equal(
    detectDelimiter(' a ; b ; c \n 1 ; 2 ; 3 '),
    ';',
    'should detect semicolon even with spaces around values'
  );

  t.end();
});

test('Processor -> processCsvData -> tab-separated with empty fields', t => {
  const tsvData = 'name\tage\tcity\nAlice\t\tBerlin\n\t25\t';
  const result = processCsvData(tsvData);

  t.equal(result.fields.length, 3, 'should parse 3 fields');
  t.equal(result.rows.length, 2, 'should have 2 data rows');
  t.equal(result.rows[0][0], 'Alice', 'first row first value should be Alice');
  t.equal(result.rows[0][1], null, 'first row second value should be null (empty)');
  t.equal(result.rows[0][2], 'Berlin', 'first row third value should be Berlin');
  t.equal(result.rows[1][0], null, 'second row first value should be null (empty)');

  t.end();
});

test('Processor -> processCsvData -> tab-separated with many columns', t => {
  const headers = Array.from({length: 20}, (_, i) => `col${i}`).join('\t');
  const row1 = Array.from({length: 20}, (_, i) => `val${i}`).join('\t');
  const row2 = Array.from({length: 20}, (_, i) => `row2_${i}`).join('\t');
  const tsvData = `${headers}\n${row1}\n${row2}`;
  const result = processCsvData(tsvData);

  t.equal(result.fields.length, 20, 'should parse 20 fields from wide TSV');
  t.equal(result.fields[0].name, 'col0', 'first field should be col0');
  t.equal(result.fields[19].name, 'col19', 'last field should be col19');
  t.equal(result.rows.length, 2, 'should have 2 data rows');
  t.equal(result.rows[0][0], 'val0', 'first cell should be val0');
  t.equal(result.rows[0][19], 'val19', 'last cell should be val19');

  t.end();
});

test('Processor -> processCsvData -> semicolon-separated with numeric data', t => {
  const data = 'lat;lng;value\n52.52;13.405;1000.5\n48.8566;2.3522;2000.7\n40.4168;-3.7038;1500.3';
  const result = processCsvData(data);

  t.equal(result.fields.length, 3, 'should parse 3 fields');
  t.equal(result.rows.length, 3, 'should have 3 data rows');
  t.equal(result.rows[0][0], 52.52, 'should parse lat as number');
  t.equal(result.rows[0][1], 13.405, 'should parse lng as number');
  t.equal(result.rows[0][2], 1000.5, 'should parse value as number');

  t.end();
});

test('Processor -> processCsvData -> pipe-separated with special characters in values', t => {
  const data = 'id|description|url\n1|"hello, world"|http://example.com\n2|"foo; bar"|http://test.org';
  const result = processCsvData(data);

  t.equal(result.fields.length, 3, 'should parse 3 fields');
  t.equal(result.rows[0][1], 'hello, world', 'should handle commas inside quoted pipe-separated fields');
  t.equal(result.rows[1][1], 'foo; bar', 'should handle semicolons inside quoted pipe-separated fields');

  t.end();
});

test('Processor -> processCsvData -> tab-separated preserves original comma data', t => {
  const csvData = 'a,b,c\n1,2,3\n4,5,6';
  const result = processCsvData(csvData);

  t.equal(result.fields.length, 3, 'regular CSV should still parse correctly');
  t.equal(result.fields[0].name, 'a', 'field name should be a');
  t.deepEqual(result.rows[0], [1, 2, 3], 'first row should be [1,2,3]');
  t.deepEqual(result.rows[1], [4, 5, 6], 'second row should be [4,5,6]');

  t.end();
});

test('Processor -> processCsvData -> trailing newline does not break parsing', t => {
  const tsvData = 'name\tage\nAlice\t30\nBob\t25\n';
  const result = processCsvData(tsvData);

  t.equal(result.fields.length, 2, 'should parse 2 fields');
  t.equal(result.rows.length, 2, 'should have 2 data rows (trailing newline ignored)');

  const ssvData = 'x;y;z\n1;2;3\n4;5;6\n';
  const result2 = processCsvData(ssvData);

  t.equal(result2.fields.length, 3, 'semicolon: should parse 3 fields');
  t.equal(result2.rows.length, 2, 'semicolon: trailing newline should not add empty row');

  t.end();
});

test('Processor -> processCsvData -> single data row (header + 1 row)', t => {
  const tsvData = 'x\ty\tz\n10\t20\t30';
  const result = processCsvData(tsvData);

  t.equal(result.fields.length, 3, 'should parse 3 fields');
  t.equal(result.rows.length, 1, 'should have 1 data row');
  t.deepEqual(result.rows[0], [10, 20, 30], 'should parse the single row correctly');

  t.end();
});

test('Processor -> processCsvData -> timestamps in TSV', t => {
  const tsvData = 'timestamp\tvalue\n2023-01-15 10:30:00\t100\n2023-02-20 14:45:30\t200';
  const result = processCsvData(tsvData);

  t.equal(result.fields.length, 2, 'should parse 2 fields');
  t.equal(result.fields[0].type, 'timestamp', 'should detect timestamp type');
  t.equal(result.rows.length, 2, 'should have 2 rows');

  t.end();
});

test('Processor -> processCsvData -> duplicated field name', t => {
  const testData1 = `column1,column1,column1,column2\na,b,c,d\nc,d,e,f`;

  // load sample dataset csv as text
  const result = processCsvData(testData1);

  const expectedResult = {
    fields: [
      {
        name: 'column1',
        id: 'column1',
        format: '',
        fieldIdx: 0,
        displayName: 'column1',
        type: 'string',
        analyzerType: 'STRING',
        valueAccessor: values => values[0]
      },
      {
        name: 'column1-0',
        id: 'column1-0',
        format: '',
        fieldIdx: 1,
        displayName: 'column1-0',
        type: 'string',
        analyzerType: 'STRING',
        valueAccessor: values => values[1]
      },
      {
        name: 'column1-1',
        id: 'column1-1',
        format: '',
        fieldIdx: 2,
        displayName: 'column1-1',
        type: 'string',
        analyzerType: 'STRING',
        valueAccessor: values => values[2]
      },
      {
        name: 'column2',
        id: 'column2',
        format: '',
        fieldIdx: 3,
        displayName: 'column2',
        type: 'string',
        analyzerType: 'STRING',
        valueAccessor: values => values[3]
      }
    ],
    rows: [
      ['a', 'b', 'c', 'd'],
      ['c', 'd', 'e', 'f']
    ]
  };

  cmpFields(t, result.fields, expectedResult.fields, 'should have created non duplicated fields');
  t.deepEqual(
    result.rows,
    expectedResult.rows,
    'should have computed rows with non duplicated fields'
  );

  t.end();
});

test('Processor -> processCsvData -> with nulls', t => {
  const {fields, rows} = processCsvData(dataWithNulls);
  cmpFields(t, fields, testFields, 'should parse fields correctly');

  t.deepEqual(rows, parsedDataWithNulls, 'should parse rows correctly');
  rows.forEach((r, i) => {
    t.deepEqual(r, parsedDataWithNulls[i], `should parse row ${i} correctly`);
  });
  t.end();
});

test('Processor -> processCsvData -> wkt', t => {
  const {fields, rows} = processCsvData(wktCsv);

  cmpFields(t, fields, wktCsvFields, 'should find geometry fields as type:geojson');

  rows.forEach((r, i) => {
    t.deepEqual(r, wktCsvRows[i], `should process wkt rows[${i}] correctly`);
  });
  t.deepEqual(rows, wktCsvRows, 'should process wkt rows correctly');

  t.end();
});

test('Processor -> processCsvData -> w/ array and object', t => {
  const {fields, rows} = processCsvData(testCsvObjectData);
  cmpFields(t, fields, objCsvFields, 'should find csv object fields as type:object');

  t.equal(rows.length, objCsvRows.length, 'should have same row length');
  rows.forEach((r, i) => {
    t.deepEqual(r, objCsvRows[i], 'should format correct csv object rows');
  });
  t.end();
});

test('Processor -> processCsvData -> w/ hex id', t => {
  const {fields, rows} = processCsvData(testCsvH3Data);
  cmpFields(t, fields, expectedHexFields, 'should find csv object fields as h3');

  t.equal(rows.length, 22, 'should have same row length');
  t.end();
});

test('Processor => processGeojson', t => {
  const {fields, rows} = processGeojson(cloneDeep(geojsonData));

  cmpFields(t, fields, geojsonFields, 'should have same field length');

  t.equal(rows.length, geojsonRows.length, 'should have same row length');
  rows.forEach((r, i) => {
    t.deepEqual(r, geojsonRows[i], 'should format correct geojson rows');
  });
  t.end();
});

test('Processor => processGeojson: with style property', t => {
  const {fields, rows} = processGeojson(cloneDeep(geoJsonWithStyle));

  cmpFields(t, fields, geoStyleFields, 'should preserve objects in geojson properties');
  t.deepEqual(rows, geoStyleRows, 'should preserve objects in geojson properties');
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
        properties: {TRIPS: '11', RATE: 'a', TIME: '1570749707'},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      },
      {
        type: 'Feature',
        properties: {TRIPS: '10', RATE: 'b', TIME: '1570749707'},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      },
      {
        type: 'Feature',
        properties: {TRIPS: '9', RATE: 'b', TIME: '1570749707'},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      }
    ]
  };

  const expectedFields = [
    {
      name: '_geojson',
      id: '_geojson',
      displayName: '_geojson',
      format: '',
      fieldIdx: 0,
      type: 'geojson',
      analyzerType: 'GEOMETRY',
      valueAccessor: values => values[0]
    },
    {
      name: 'TRIPS',
      id: 'TRIPS',
      displayName: 'TRIPS',
      format: '',
      fieldIdx: 1,
      type: 'integer',
      analyzerType: 'INT',
      valueAccessor: values => values[1]
    },
    {
      name: 'RATE',
      id: 'RATE',
      displayName: 'RATE',
      format: '',
      fieldIdx: 2,
      type: 'string',
      analyzerType: 'STRING',
      valueAccessor: values => values[2]
    },
    {
      name: 'TIME',
      id: 'TIME',
      displayName: 'TIME',
      format: 'x',
      fieldIdx: 3,
      type: 'timestamp',
      analyzerType: 'TIME',
      valueAccessor: values => values[3]
    }
  ];

  const expectedRows = [
    [
      {
        type: 'Feature',
        properties: {TRIPS: 11, RATE: 'a', TIME: 1570749707},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      },
      11,
      'a',
      1570749707
    ],
    [
      {
        type: 'Feature',
        properties: {TRIPS: 10, RATE: 'b', TIME: 1570749707},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      },
      10,
      'b',
      1570749707
    ],
    [
      {
        type: 'Feature',
        properties: {TRIPS: 9, RATE: 'b', TIME: 1570749707},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      },
      9,
      'b',
      1570749707
    ]
  ];
  const result = processGeojson(testGeoData);

  t.deepEqual(Object.keys(result), ['fields', 'rows'], 'should contain fields and rows');
  cmpFields(
    t,
    result.fields,
    expectedFields,
    'should parse correct fields when geojson input contain string'
  );

  t.deepEqual(
    result.rows,
    expectedRows,
    'should parse correct rows when geojson input contain string'
  );

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

  const expected = [[0.0], [1.0], [-1.0], [155.0], [1550.0], [0.00155], [0.00155], [1550.0]];

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
    ['true'],
    ['yes'],
    ['Yes'],
    ['YES'],
    ['no'],
    ['No'],
    ['NO'],
    ['TRUE'],
    ['false'],
    ['FALSE']
  ];

  const expected = [
    [null],
    [false],
    [true],
    [true],
    [false],
    [false],
    [true],
    [true],
    [true],
    [true],
    [true],
    [false],
    [false],
    [false],
    [true],
    [false],
    [false]
  ];

  parseCsvRowsByFieldType(rows, -1, field, 0);
  t.same(rows, expected, 'should parsed boolean properly');
  t.end();
});

test('Processor -> getSampleForTypeAnalyze', t => {
  const fields = ['string', 'int', 'bool', 'time'];

  const rows = [
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

  const sample = getSampleForTypeAnalyze({fields, rows, sampleCount: 5});
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

test('Processor -> validateInputData', t => {
  t.equal(validateInputData(null), null, 'Should throw error if data is null');
  t.equal(validateInputData({rows: 'hello'}), null, 'Should throw error if data.rows is null');
  t.equal(
    validateInputData({rows: [], fields: null}),
    null,
    'Should throw error if data.fields is null'
  );

  const cases = [
    {
      input: {
        rows: [[1], [2], [3]],
        fields: ['a']
      },
      expected: {
        rows: [[1], [2], [3]],
        fields: [{type: ALL_FIELD_TYPES.integer, format: '', name: 'column_0', analyzerType: 'INT'}]
      },
      msg: 'should re generate field if not an object'
    },
    {
      input: {
        rows: [[1], [2], [3]],
        fields: [{type: ALL_FIELD_TYPES.integer, format: ''}]
      },
      expected: {
        rows: [[1], [2], [3]],
        fields: [{type: ALL_FIELD_TYPES.integer, format: '', name: 'column_0', analyzerType: 'INT'}]
      },
      msg: 'should reassign field name'
    },
    {
      input: {
        rows: [[1], [2], [3]],
        fields: [{type: 'hello', format: '', name: 'taro'}]
      },
      expected: {
        rows: [[1], [2], [3]],
        fields: [
          {
            type: ALL_FIELD_TYPES.integer,
            format: '',
            name: 'taro',
            analyzerType: 'INT'
          }
        ]
      },
      msg: 'should reassign field type'
    },
    {
      input: {
        rows: [['2018-09-01 00:00'], ['2018-09-01 01:00'], ['2018-09-01 02:00']],
        fields: [{type: ALL_FIELD_TYPES.timestamp, format: '', name: 'taro'}]
      },
      expected: {
        rows: [['2018-09-01 00:00'], ['2018-09-01 01:00'], ['2018-09-01 02:00']],
        fields: [
          {
            type: ALL_FIELD_TYPES.timestamp,
            format: 'YYYY-M-D H:m',
            name: 'taro',
            analyzerType: 'DATETIME'
          }
        ]
      },
      msg: 'should reassign field type'
    }
  ];

  cases.forEach(({input, expected, msg}) => {
    t.deepEqual(validateInputData(input), expected, msg);
  });

  t.end();
});

test('Processor -> processRowObject', t => {
  t.equal(processRowObject({}), null, 'Should return null when rawData is empty');

  const cases = [
    {
      input: [
        {a: 1, b: 'c', c: true, d: '1.2'},
        {a: 2, b: 'c', c: false, d: '1.3'},
        {a: 3, b: 'd', c: true, d: '1.4'}
      ],
      expected: {
        rows: [
          [1, 'c', true, 1.2],
          [2, 'c', false, 1.3],
          [3, 'd', true, 1.4]
        ],
        fields: [
          {
            name: 'a',
            id: 'a',
            displayName: 'a',
            type: 'integer',
            format: '',
            fieldIdx: 0,
            analyzerType: 'INT',
            valueAccessor: values => values[0]
          },
          {
            name: 'b',
            id: 'b',
            displayName: 'b',
            type: 'string',
            format: '',
            fieldIdx: 1,
            analyzerType: 'STRING',
            valueAccessor: values => values[1]
          },
          {
            name: 'c',
            id: 'c',
            displayName: 'c',
            type: 'boolean',
            format: '',
            fieldIdx: 2,
            analyzerType: 'BOOLEAN',
            valueAccessor: values => values[2]
          },
          {
            name: 'd',
            id: 'd',
            displayName: 'd',
            type: 'real',
            format: '',
            fieldIdx: 3,
            analyzerType: 'FLOAT',
            valueAccessor: values => values[3]
          }
        ]
      },
      msg: 'should parse correct row objects'
    }
  ];

  cases.forEach(({input, expected, msg}) => {
    const {fields, rows} = processRowObject(input);
    cmpFields(t, fields, expected.fields, `${msg} fields`);
    t.deepEqual(rows, expected.rows, msg);
  });
  t.end();
});

test('Processor -> formatCsv', t => {
  const geojsonFc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {TRIPS: '11'},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      },
      {
        type: 'Feature',
        properties: {TRIPS: '10'},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      },
      {
        type: 'Feature',
        properties: {TRIPS: '9'},
        geometry: {type: 'Point', coordinates: [[-122, 37]]}
      }
    ]
  };

  const cases = [
    {
      input:
        `gps_data.lat,gps_data.types,epoch,has_result,id,begintrip_ts_local,date\n` +
        `29.9900937,driver_analytics,1472688000000,False,1,2016-10-01 09:41:39+00:00,2016-09-23\n` +
        `29.9927699,driver_analytics,1472688000000,False,2,2016-10-01 16:46:37+00:00,2016-09-23\n` +
        `29.9907261,driver_analytics,1472688000000,False,3,,2016-09-23`,
      expected:
        `gps_data.lat,gps_data.types,epoch,has_result,id,begintrip_ts_local,date\n` +
        `29.9900937,driver_analytics,1472688000000,false,1,2016-10-01 09:41:39+00:00,2016-09-23\n` +
        `29.9927699,driver_analytics,1472688000000,false,2,2016-10-01 16:46:37+00:00,2016-09-23\n` +
        `29.9907261,driver_analytics,1472688000000,false,3,,2016-09-23`,
      processor: processCsvData,
      msg: 'should format correct csv'
    },
    {
      input: geojsonFc,
      expected:
        '_geojson,TRIPS\n"{""type"":""Feature"",""properties"":{""TRIPS"":11},""geometry"":{""type"":""Point"",""coordinates"":[[-122,37]]}}",11\n"{""type"":""Feature"",""properties"":{""TRIPS"":10},""geometry"":{""type"":""Point"",""coordinates"":[[-122,37]]}}",10\n"{""type"":""Feature"",""properties"":{""TRIPS"":9},""geometry"":{""type"":""Point"",""coordinates"":[[-122,37]]}}",9',
      processor: processGeojson,
      msg: 'should format correct csv from geojsonInput'
    }
  ];

  cases.forEach(({input, expected, msg, processor}) => {
    const {fields, rows} = processor(input);
    const dataContainer = createDataContainer(rows, {fields});

    t.deepEqual(formatCsv(dataContainer, fields), expected, msg);
  });
  t.end();
});

test('Processor -> analyzerTypeToFieldType', t => {
  Object.keys(DATA_TYPES).forEach(atype => {
    const spy = sinon.spy(Console, 'warn');

    if (!ACCEPTED_ANALYZER_TYPES.includes(atype)) {
      t.equal(
        analyzerTypeToFieldType(atype),
        'string',
        'should return string if type not recognized'
      );
      t.ok(spy.calledOnce, `should warn when pass unrecognized type ${atype}`);
    } else {
      const fieldType = analyzerTypeToFieldType(atype);
      t.ok(ALL_FIELD_TYPES[fieldType], `should assign ${atype} to one of ALL_FIELD_TYPES`);
    }

    spy.restore();
  });

  t.end();
});
