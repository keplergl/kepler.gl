// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import * as arrow from 'apache-arrow';

import {
  SUPPORTED_DUCKDB_DROP_EXTENSIONS,
  getDuckDBColumnTypesMap,
  castDuckDBTypesForKepler,
  setGeoArrowWKBExtension,
  removeUnsupportedExtensions,
  restoreUnsupportedExtensions,
  isGeoArrowPoint,
  isGeoArrowLineString,
  isGeoArrowPolygon,
  isGeoArrowMultiPoint,
  isGeoArrowMultiLineString,
  isGeoArrowMultiPolygon,
  splitSqlStatements,
  removeSQLComments,
  sanitizeDuckDBTableName,
  quoteTableName
} from '../../../src/duckdb/src/table/duckdb-table-utils';

import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';

// Test getDuckDBColumnTypesMap
test('duckdb-utils -> getDuckDBColumnTypesMap', t => {
  const columns = [
    {name: 'id', type: 'INTEGER'},
    {name: 'name', type: 'VARCHAR'},
    {name: 'location', type: 'GEOMETRY'}
  ];

  const result = getDuckDBColumnTypesMap(columns);

  t.equal(result.id, 'INTEGER', 'should map id to INTEGER');
  t.equal(result.name, 'VARCHAR', 'should map name to VARCHAR');
  t.equal(result.location, 'GEOMETRY', 'should map location to GEOMETRY');
  t.equal(Object.keys(result).length, 3, 'should have correct number of mappings');

  t.end();
});

// Test getDuckDBColumnTypesMap with empty array
test('duckdb-utils -> getDuckDBColumnTypesMap empty', t => {
  const columns = [];
  const result = getDuckDBColumnTypesMap(columns);

  t.deepEqual(result, {}, 'should return empty object for empty array');
  t.end();
});

// Test castDuckDBTypesForKepler
test('duckdb-utils -> castDuckDBTypesForKepler', t => {
  const tableName = 'test_table';
  const columns = [
    {name: 'id', type: 'INTEGER'},
    {name: 'name', type: 'VARCHAR'},
    {name: 'location', type: 'GEOMETRY'},
    {name: 'big_number', type: 'BIGINT'}
  ];

  const result = castDuckDBTypesForKepler(tableName, columns);

  const resultMock = `SELECT "id", "name", ST_AsWKB("location") as "location", CAST("big_number" AS DOUBLE) as "big_number" FROM "test_table"`;
  t.equal(result, resultMock, 'should return correct SQL');

  t.end();
});

// Test castDuckDBTypesForKepler with options
test('duckdb-utils -> castDuckDBTypesForKepler options', t => {
  const tableName = 'test_table';
  const columns = [
    {name: 'location', type: 'GEOMETRY'},
    {name: 'big_number', type: 'BIGINT'}
  ];

  const resultNoGeometry = castDuckDBTypesForKepler(tableName, columns, {
    geometryToWKB: false,
    bigIntToDouble: true
  });
  const resultNoGeometryMock = `SELECT "location", CAST("big_number" AS DOUBLE) as "big_number" FROM "test_table"`;
  t.equal(resultNoGeometry, resultNoGeometryMock, 'should return correct SQL');

  const resultNoBigInt = castDuckDBTypesForKepler(tableName, columns, {
    geometryToWKB: true,
    bigIntToDouble: false
  });
  const resultNoBigIntMock = `SELECT ST_AsWKB("location") as "location", "big_number" FROM "test_table"`;
  t.equal(resultNoBigInt, resultNoBigIntMock, 'should return correct SQL');

  t.end();
});

// Test castDuckDBTypesForKepler with DECIMAL types
test('duckdb-utils -> castDuckDBTypesForKepler with DECIMAL', t => {
  const tableName = 'test_table';
  const columns = [
    {name: 'id', type: 'INTEGER'},
    {name: 'price', type: 'DECIMAL(18,2)'},
    {name: 'amount', type: 'DECIMAL'},
    {name: 'rate', type: 'DECIMAL(10,5)'}
  ];

  const result = castDuckDBTypesForKepler(tableName, columns);

  const resultMock = `SELECT "id", CAST("price" AS DOUBLE) as "price", CAST("amount" AS DOUBLE) as "amount", CAST("rate" AS DOUBLE) as "rate" FROM "test_table"`;
  t.equal(result, resultMock, 'should cast DECIMAL types to DOUBLE');

  t.end();
});

// Test castDuckDBTypesForKepler
test('duckdb-utils -> castDuckDBTypesForKepler with complex table name', t => {
  const tableName = '"memory"."main"."earthquakes"';
  const columns = [{name: 'id', type: 'INTEGER'}];

  const result = castDuckDBTypesForKepler(tableName, columns);

  const resultMock = `SELECT "id" FROM "memory"."main"."earthquakes"`;
  t.equal(result, resultMock, 'should return correct SQL');

  t.end();
});

// Test setGeoArrowWKBExtension
test('duckdb-utils -> setGeoArrowWKBExtension', t => {
  const columns = [
    {name: 'id', type: 'INTEGER'},
    {name: 'location', type: 'GEOMETRY'}
  ];

  // Create a mock arrow table with schema
  const schema = new arrow.Schema([
    new arrow.Field('id', new arrow.Int32()),
    new arrow.Field('location', new arrow.Binary())
  ]);

  const table = new arrow.Table(schema);

  setGeoArrowWKBExtension(table, columns);

  // Check if the metadata was set for the geometry field
  const locationField = table.schema.fields.find(f => f.name === 'location');
  t.equal(
    locationField.metadata.get(GEOARROW_METADATA_KEY),
    GEOARROW_EXTENSIONS.WKB,
    'should set WKB extension for GEOMETRY fields'
  );

  const idField = table.schema.fields.find(f => f.name === 'id');
  t.equal(
    idField.metadata.get(GEOARROW_METADATA_KEY),
    undefined,
    'should not set extension for non-GEOMETRY fields'
  );

  t.end();
});

// Test removeUnsupportedExtensions
test('duckdb-utils -> removeUnsupportedExtensions', t => {
  const schema = new arrow.Schema([
    new arrow.Field('id', new arrow.Int32()),
    new arrow.Field('location', new arrow.Binary())
  ]);

  const table = new arrow.Table(schema);

  // Add geoarrow extension to location field
  table.schema.fields[1].metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.WKB);

  const removedExtensions = removeUnsupportedExtensions(table);

  t.equal(removedExtensions.location, GEOARROW_EXTENSIONS.WKB, 'should return removed extension');
  t.equal(
    table.schema.fields[1].metadata.get(GEOARROW_METADATA_KEY),
    undefined,
    'should remove extension from field'
  );

  t.end();
});

// Test restoreUnsupportedExtensions
test('duckdb-utils -> restoreUnsupportedExtensions', t => {
  const schema = new arrow.Schema([
    new arrow.Field('id', new arrow.Int32()),
    new arrow.Field('location', new arrow.Binary())
  ]);

  const table = new arrow.Table(schema);

  const removedExtensions = {
    location: GEOARROW_EXTENSIONS.WKB
  };

  restoreUnsupportedExtensions(table, removedExtensions);

  t.equal(
    table.schema.fields[1].metadata.get(GEOARROW_METADATA_KEY),
    GEOARROW_EXTENSIONS.WKB,
    'should restore extension to field'
  );

  t.end();
});

// Test isGeoArrowPoint
test('duckdb-utils -> isGeoArrowPoint', t => {
  // Create a valid point type (FixedSizeList of 2 float64s)
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('', new arrow.Float64()));
  t.ok(isGeoArrowPoint(pointType), 'should recognize valid 2D point');

  // Create a valid 3D point type (FixedSizeList of 3 float64s)
  const point3DType = new arrow.FixedSizeList(3, new arrow.Field('', new arrow.Float64()));
  t.ok(isGeoArrowPoint(point3DType), 'should recognize valid 3D point');

  // Create an invalid point type (FixedSizeList of 5 float64s)
  const invalidPointType = new arrow.FixedSizeList(5, new arrow.Field('', new arrow.Float64()));
  t.notOk(isGeoArrowPoint(invalidPointType), 'should not recognize invalid point with size 5');

  // Create a non-FixedSizeList type
  const nonPointType = new arrow.Utf8();
  t.notOk(isGeoArrowPoint(nonPointType), 'should not recognize non-FixedSizeList type');

  // Create a FixedSizeList with non-float child
  const nonFloatPointType = new arrow.FixedSizeList(2, new arrow.Field('', new arrow.Int32()));
  t.notOk(isGeoArrowPoint(nonFloatPointType), 'should not recognize point with non-float child');

  t.end();
});

// Test isGeoArrowLineString
test('duckdb-utils -> isGeoArrowLineString', t => {
  // Create a valid linestring type (List of points)
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('', new arrow.Float64()));
  const lineStringType = new arrow.List(new arrow.Field('', pointType));
  t.ok(isGeoArrowLineString(lineStringType), 'should recognize valid linestring');

  // Create an invalid linestring type (List of non-points)
  const invalidLineStringType = new arrow.List(new arrow.Field('', new arrow.Int32()));
  t.notOk(isGeoArrowLineString(invalidLineStringType), 'should not recognize list of non-points');

  // Create a non-List type
  const nonListType = new arrow.Utf8();
  t.notOk(isGeoArrowLineString(nonListType), 'should not recognize non-List type');

  t.end();
});

// Test isGeoArrowPolygon
test('duckdb-utils -> isGeoArrowPolygon', t => {
  // Create a valid polygon type (List of linestrings)
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('', new arrow.Float64()));
  const lineStringType = new arrow.List(new arrow.Field('', pointType));
  const polygonType = new arrow.List(new arrow.Field('', lineStringType));
  t.ok(isGeoArrowPolygon(polygonType), 'should recognize valid polygon');

  // Create an invalid polygon type (List of non-linestrings)
  const invalidPolygonType = new arrow.List(new arrow.Field('', new arrow.Int32()));
  t.notOk(isGeoArrowPolygon(invalidPolygonType), 'should not recognize list of non-linestrings');

  // Create a non-List type
  const nonListType = new arrow.Utf8();
  t.notOk(isGeoArrowPolygon(nonListType), 'should not recognize non-List type');

  t.end();
});

// Test isGeoArrowMultiPoint
test('duckdb-utils -> isGeoArrowMultiPoint', t => {
  // Create a valid multipoint type (List of points)
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('', new arrow.Float64()));
  const multiPointType = new arrow.List(new arrow.Field('', pointType));
  t.ok(isGeoArrowMultiPoint(multiPointType), 'should recognize valid multipoint');

  // Create an invalid multipoint type (List of non-points)
  const invalidMultiPointType = new arrow.List(new arrow.Field('', new arrow.Int32()));
  t.notOk(isGeoArrowMultiPoint(invalidMultiPointType), 'should not recognize list of non-points');

  // Create a non-List type
  const nonListType = new arrow.Utf8();
  t.notOk(isGeoArrowMultiPoint(nonListType), 'should not recognize non-List type');

  t.end();
});

// Test isGeoArrowMultiLineString
test('duckdb-utils -> isGeoArrowMultiLineString', t => {
  // Create a valid multilinestring type (List of linestrings)
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('', new arrow.Float64()));
  const lineStringType = new arrow.List(new arrow.Field('', pointType));
  const multiLineStringType = new arrow.List(new arrow.Field('', lineStringType));
  t.ok(isGeoArrowMultiLineString(multiLineStringType), 'should recognize valid multilinestring');

  // Create an invalid multilinestring type (List of non-linestrings)
  const invalidMultiLineStringType = new arrow.List(new arrow.Field('', new arrow.Int32()));
  t.notOk(
    isGeoArrowMultiLineString(invalidMultiLineStringType),
    'should not recognize list of non-linestrings'
  );

  // Create a non-List type
  const nonListType = new arrow.Utf8();
  t.notOk(isGeoArrowMultiLineString(nonListType), 'should not recognize non-List type');

  t.end();
});

// Test isGeoArrowMultiPolygon
test('duckdb-utils -> isGeoArrowMultiPolygon', t => {
  // Create a valid multipolygon type (List of polygons)
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('', new arrow.Float64()));
  const lineStringType = new arrow.List(new arrow.Field('', pointType));
  const polygonType = new arrow.List(new arrow.Field('', lineStringType));
  const multiPolygonType = new arrow.List(new arrow.Field('', polygonType));
  t.ok(isGeoArrowMultiPolygon(multiPolygonType), 'should recognize valid multipolygon');

  // Create an invalid multipolygon type (List of non-polygons)
  const invalidMultiPolygonType = new arrow.List(new arrow.Field('', new arrow.Int32()));
  t.notOk(
    isGeoArrowMultiPolygon(invalidMultiPolygonType),
    'should not recognize list of non-polygons'
  );

  // Create a non-List type
  const nonListType = new arrow.Utf8();
  t.notOk(isGeoArrowMultiPolygon(nonListType), 'should not recognize non-List type');

  t.end();
});

// Test splitSqlStatements
test('duckdb-utils -> splitSqlStatements', t => {
  // Test simple case
  const simpleSQL = 'SELECT * FROM table1; SELECT * FROM table2;';
  const simpleResult = splitSqlStatements(simpleSQL);
  t.equal(simpleResult.length, 2, 'should split simple statements');
  t.equal(simpleResult[0], 'SELECT * FROM table1', 'should trim semicolon');
  t.equal(simpleResult[1], 'SELECT * FROM table2', 'should trim semicolon');

  // Test with quoted strings
  const quotedSQL = 'SELECT \'hello;world\' FROM table1; SELECT "col;name" FROM table2;';
  const quotedResult = splitSqlStatements(quotedSQL);
  t.equal(quotedResult.length, 2, 'should handle quoted semicolons');
  t.ok(quotedResult[0].includes('hello;world'), 'should preserve semicolon in single quotes');
  t.ok(quotedResult[1].includes('col;name'), 'should preserve semicolon in double quotes');

  // Test with comments
  const commentSQL = 'SELECT * FROM table1; -- comment with ; semicolon\nSELECT * FROM table2;';
  const commentResult = splitSqlStatements(commentSQL);
  t.equal(commentResult.length, 2, 'should handle line comments');

  // Test with block comments
  const blockCommentSQL =
    'SELECT * FROM table1 /* block comment ; with semicolon */ SELECT * FROM table2;';
  const blockCommentResult = splitSqlStatements(blockCommentSQL);
  t.equal(blockCommentResult.length, 1, 'should handle block comments');

  // Test with escaped quotes
  const escapedSQL =
    'SELECT \'it\'\'s working\' FROM table1; SELECT "he said ""hello""" FROM table2;';
  const escapedResult = splitSqlStatements(escapedSQL);
  t.equal(escapedResult.length, 2, 'should handle escaped quotes');

  // Test empty statements
  const emptySQL = ';;; SELECT * FROM table1;; ; SELECT * FROM table2;;;';
  const emptyResult = splitSqlStatements(emptySQL);
  t.equal(emptyResult.length, 2, 'should filter out empty statements');

  // Test single statement without semicolon
  const singleSQL = 'SELECT * FROM table1';
  const singleResult = splitSqlStatements(singleSQL);
  t.equal(singleResult.length, 1, 'should handle single statement without semicolon');
  t.equal(singleResult[0], 'SELECT * FROM table1', 'should return trimmed statement');

  // Test empty string
  const emptyString = '';
  const emptyStringResult = splitSqlStatements(emptyString);
  t.equal(emptyStringResult.length, 0, 'should return empty array for empty string');

  t.end();
});

// Test removeSQLComments
test('duckdb-utils -> removeSQLComments', t => {
  // Test line comments
  const lineComment = 'SELECT * FROM table1; -- this is a comment';
  const lineResult = removeSQLComments(lineComment);
  t.equal(lineResult, 'SELECT * FROM table1;', 'should remove line comments');

  // Test block comments
  const blockComment = 'SELECT * FROM table1 /* this is a block comment */ WHERE id = 1;';
  const blockResult = removeSQLComments(blockComment);
  t.equal(blockResult, 'SELECT * FROM table1  WHERE id = 1;', 'should remove block comments');

  // Test multiple line comments
  const multiLineComment = 'SELECT * FROM table1; -- comment 1\nSELECT * FROM table2; -- comment 2';
  const multiLineResult = removeSQLComments(multiLineComment);
  t.equal(
    multiLineResult,
    'SELECT * FROM table1; \nSELECT * FROM table2;',
    'should remove multiple line comments'
  );

  // Test multiline block comments
  const multiBlockComment =
    'SELECT * FROM table1 /* this is a\nmultiline\nblock comment */ WHERE id = 1;';
  const multiBlockResult = removeSQLComments(multiBlockComment);
  t.equal(
    multiBlockResult,
    'SELECT * FROM table1  WHERE id = 1;',
    'should remove multiline block comments'
  );

  // Test mixed comments
  const mixedComment = 'SELECT * FROM table1 /* block */ WHERE id = 1; -- line comment';
  const mixedResult = removeSQLComments(mixedComment);
  t.equal(mixedResult, 'SELECT * FROM table1  WHERE id = 1;', 'should remove mixed comments');

  // Test no comments
  const noComment = 'SELECT * FROM table1 WHERE id = 1;';
  const noCommentResult = removeSQLComments(noComment);
  t.equal(
    noCommentResult,
    'SELECT * FROM table1 WHERE id = 1;',
    'should leave SQL without comments unchanged'
  );

  t.end();
});

// Test sanitizeDuckDBTableName
test('duckdb-utils -> sanitizeDuckDBTableName', t => {
  // Test valid name
  const validName = 'valid_table_name';
  t.equal(sanitizeDuckDBTableName(validName), validName, 'should keep valid name unchanged');

  // Test name with spaces
  const spaceName = 'table name with spaces';
  t.equal(
    sanitizeDuckDBTableName(spaceName),
    'table_name_with_spaces',
    'should replace spaces with underscores'
  );

  // Test name with special characters
  const specialName = 'table-name.with@special#chars';
  t.equal(
    sanitizeDuckDBTableName(specialName),
    'table_name_with_special_chars',
    'should replace special characters with underscores'
  );

  // Test name starting with number
  const numberName = '123table';
  t.equal(
    sanitizeDuckDBTableName(numberName),
    't_123table',
    'should prepend t_ to names starting with number'
  );

  // Test empty string
  const emptyName = '';
  t.equal(
    sanitizeDuckDBTableName(emptyName),
    'default_table',
    'should return default_table for empty string'
  );

  // Test file extensions
  const csvFile = 'data.csv';
  t.equal(sanitizeDuckDBTableName(csvFile), 'data_csv', 'should handle file extensions');

  // Test complex case
  const complexName = '123-data file.csv';
  t.equal(
    sanitizeDuckDBTableName(complexName),
    't_123_data_file_csv',
    'should handle complex cases'
  );

  t.end();
});

// Test quoteTableName
test('duckdb-utils -> quoteTableName', t => {
  // Test simple table names (should get quoted)
  t.equal(quoteTableName('simple_table'), '"simple_table"', 'should quote simple table name');
  t.equal(quoteTableName('table'), '"table"', 'should quote single word table name');

  // Test table names with special characters (should get quoted)
  t.equal(quoteTableName('table name'), '"table name"', 'should quote table name with spaces');
  t.equal(quoteTableName('table-name'), '"table-name"', 'should quote table name with hyphens');
  t.equal(
    quoteTableName('table@name'),
    '"table@name"',
    'should quote table name with special chars'
  );

  // Test already quoted simple names (should get quoted again with proper escaping)
  t.equal(
    quoteTableName('already"quoted'),
    '"already""quoted"',
    'should escape quotes in table name'
  );
  t.equal(quoteTableName('"quoted"'), '"quoted"', 'should preserve already quoted table name');
  t.equal(
    quoteTableName('"table with spaces"'),
    '"table with spaces"',
    'should preserve already quoted table name with spaces'
  );
  t.equal(
    quoteTableName('"table-with-hyphens"'),
    '"table-with-hyphens"',
    'should preserve already quoted table name with hyphens'
  );

  t.equal(
    quoteTableName('"memory"."main"."earthquakes"'),
    '"memory"."main"."earthquakes"',
    'should preserve complex qualified name'
  );

  t.equal(
    quoteTableName('"my schema"."db-name"."schema_name"."table-name"'),
    '"my schema"."db-name"."schema_name"."table-name"',
    'should preserve qualified name with special chars'
  );

  // Test qualified names with dots inside quotes (would break old parsing logic)
  t.equal(
    quoteTableName('"my.schema"."table.name"'),
    '"my.schema"."table.name"',
    'should preserve qualified name with dots inside quotes'
  );

  // Test invalid fully qualified names (should get quoted)
  t.equal(quoteTableName('schema.table'), '"schema.table"', 'should quote unquoted qualified name');
  t.equal(
    quoteTableName('"schema".table'),
    '"schema".table',
    'should preserve partially quoted name (trust user intent)'
  );
  t.equal(
    quoteTableName('schema."table"'),
    'schema."table"',
    'should preserve partially quoted name (trust user intent)'
  );
  t.equal(
    quoteTableName('bad."format'),
    'bad."format',
    'should preserve name with dots and quotes (trust user intent)'
  );

  // Test edge cases
  t.equal(quoteTableName(''), '""', 'should handle empty string');
  t.equal(quoteTableName('123table'), '"123table"', 'should quote name starting with number');
  t.equal(quoteTableName('table.'), '"table."', 'should quote name ending with dot');
  t.equal(quoteTableName('.table'), '".table"', 'should quote name starting with dot');

  // Test cases that should NOT be treated as qualified names
  t.equal(
    quoteTableName('table.with.dots'),
    '"table.with.dots"',
    'should quote name with dots but no quotes'
  );
  t.equal(
    quoteTableName('"single.quoted.name"'),
    '"single.quoted.name"',
    'should preserve single quoted name with dots as simple identifier'
  );

  t.end();
});

// Test SUPPORTED_DUCKDB_DROP_EXTENSIONS constant
test('duckdb-utils -> SUPPORTED_DUCKDB_DROP_EXTENSIONS', t => {
  t.ok(Array.isArray(SUPPORTED_DUCKDB_DROP_EXTENSIONS), 'should be an array');
  t.ok(SUPPORTED_DUCKDB_DROP_EXTENSIONS.includes('csv'), 'should include csv');
  t.ok(SUPPORTED_DUCKDB_DROP_EXTENSIONS.includes('json'), 'should include json');
  t.ok(SUPPORTED_DUCKDB_DROP_EXTENSIONS.includes('parquet'), 'should include parquet');
  t.ok(SUPPORTED_DUCKDB_DROP_EXTENSIONS.includes('geojson'), 'should include geojson');
  t.ok(SUPPORTED_DUCKDB_DROP_EXTENSIONS.includes('arrow'), 'should include arrow');
  t.equal(SUPPORTED_DUCKDB_DROP_EXTENSIONS.length, 5, 'should have 5 supported extensions');

  t.end();
});
