// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {
  columnTypeToFieldType,
  consolidateFieldTypes,
  extendFieldsWithDuckDBColumnType,
  fieldTypeToColumnType,
  processCsvRowObject,
  processGeojson,
  processKeplerglJSONforDuckDb
} from './data-processor';

const originalDatabase = getApplicationConfig().database;

function configureSchema(columns: {name: string; type: string}[]) {
  const columnType = new arrow.List(
    new arrow.Field(
      'item',
      new arrow.Struct([
        new arrow.Field('name', new arrow.Utf8()),
        new arrow.Field('type', new arrow.Utf8())
      ])
    )
  );
  const query = jest.fn().mockResolvedValue(
    new arrow.Table({
      Columns: arrow.vectorFromArray([columns], columnType)
    })
  );
  const registerFileText = jest.fn().mockResolvedValue(undefined);
  const connect = jest.fn().mockResolvedValue({query});
  initApplicationConfig({database: {connect, registerFileText} as any});
  return {query, registerFileText, connect};
}

afterEach(() => {
  initApplicationConfig({database: originalDatabase});
  jest.restoreAllMocks();
});

it('does not open a database for missing or empty CSV input', async () => {
  const {connect} = configureSchema([]);
  for (const rows of [null, undefined, [], {}]) {
    expect(await processCsvRowObject(rows as any)).toEqual({fields: [], rows: []});
  }
  expect(connect).not.toHaveBeenCalled();
});

it('normalizes CSV null markers without dropping zero, false or similar text', async () => {
  const {registerFileText, query} = configureSchema([
    {name: 'id', type: 'INTEGER'},
    {name: 'value', type: 'VARCHAR'}
  ]);
  const values = ['null', 'NULL', 'Null', 'NaN', '/N', '', null, '0', 'false', 'null island'];
  const rows = values.map((value, i) => ({id: String(i), value}));
  const result = await processCsvRowObject(rows);
  expect(result.rows).toEqual([
    ...values.slice(0, 7).map((_, i) => ({id: String(i), value: null})),
    {id: '7', value: '0'},
    {id: '8', value: 'false'},
    {id: '9', value: 'null island'}
  ]);
  expect(result.fields.map(field => [field.name, (field as any).duckDBColumnType])).toEqual([
    ['id', 'INTEGER'],
    ['value', 'VARCHAR']
  ]);
  const [filename, contents] = registerFileText.mock.calls[0];
  expect(contents).toContain('id,value\n');
  expect(contents).toMatch(/,0\n/);
  expect(query.mock.calls[0][0]).toContain(filename);
});

it('retains analyzer timestamp semantics while attaching DuckDB inference by column name', () => {
  const fields = [
    {name: 'time', type: 'timestamp', format: 'YYYY-M-D H:m:s', custom: 'kept'},
    {name: 'name', type: 'string'},
    {name: 'unknown', type: 'string'}
  ];
  const snapshot = JSON.parse(JSON.stringify(fields));
  const result = consolidateFieldTypes(fields, {name: 'VARCHAR', time: 'TIMESTAMP'});
  expect(result).toEqual([
    {...fields[0], duckDBColumnType: 'TIMESTAMP'},
    {...fields[1], duckDBColumnType: 'VARCHAR'},
    {...fields[2], duckDBColumnType: undefined}
  ]);
  expect(fields).toEqual(snapshot);
  expect(result[0]).not.toBe(fields[0]);
});

it('propagates schema-query failures rather than returning partially inferred fields', async () => {
  const {query} = configureSchema([{name: 'id', type: 'INTEGER'}]);
  const error = new Error('schema query failed');
  query.mockRejectedValueOnce(error);
  await expect(processCsvRowObject([{id: '1'}])).rejects.toBe(error);
});

it('maps supported field types and applies overrides without mutating field descriptors', async () => {
  const pairs = [
    ['boolean', 'BOOLEAN'],
    ['date', 'DATE'],
    ['integer', 'INTEGER'],
    ['real', 'FLOAT'],
    ['string', 'VARCHAR'],
    ['timestamp', 'TIMESTAMP'],
    ['geojson', 'GEOMETRY']
  ];
  const fields = pairs.map(([type], index) => ({name: `field${index}`, type}));
  for (const [type, columnType] of pairs) {
    expect(fieldTypeToColumnType(type)).toBe(columnType);
    expect(columnTypeToFieldType(columnType)).toBe(type);
  }
  const result = await extendFieldsWithDuckDBColumnType(fields as any, {FLOAT: 'DOUBLE'});
  expect(result.map(field => (field as any).duckDBColumnType)).toEqual(
    pairs.map(([, columnType]) => (columnType === 'FLOAT' ? 'DOUBLE' : columnType))
  );
  expect(fields.every(field => !('duckDBColumnType' in field))).toBe(true);
});

it('returns null for unsupported type mappings rather than inventing a database type', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  expect(fieldTypeToColumnType('unsupported')).toBeNull();
  expect(columnTypeToFieldType('unsupported')).toBeNull();
});

it('normalizes geometry and features into GeoJSON collections without flattening properties', () => {
  const geometry = {type: 'Point', coordinates: [12, 34, 56]};
  const feature = {type: 'Feature', geometry, properties: {name: 'place', value: 0}};
  for (const input of [geometry, feature, {type: 'FeatureCollection', features: [feature]}]) {
    const result = processGeojson(input);
    expect(result.rows).toMatchObject({type: 'FeatureCollection', features: [{geometry}]});
    expect(result).not.toHaveProperty('fields');
  }
  expect(processGeojson(feature).rows).toMatchObject({
    features: [{properties: feature.properties}]
  });
});

it('rejects invalid GeoJSON and accepts an empty collection', () => {
  expect(() => processGeojson({hello: 'world'})).toThrow('not a valid GeoJSON');
  expect(processGeojson({type: 'FeatureCollection', features: []}).rows).toEqual({
    type: 'FeatureCollection',
    features: []
  });
});

it('adds DuckDB schema to saved maps without changing saved field semantics', async () => {
  const {query} = configureSchema([{name: 'time', type: 'VARCHAR'}]);
  const result = await processKeplerglJSONforDuckDb({
    datasets: [
      {
        version: 'v1',
        data: {
          id: 'saved',
          label: 'Saved',
          color: [1, 2, 3],
          fields: [{name: 'time', type: 'timestamp', format: 'YYYY-M-D H:m:s'}],
          allData: [['2020-01-01 00:00:00']]
        }
      }
    ],
    config: {version: 'v1', config: {}}
  });
  expect(query).toHaveBeenCalledTimes(1);
  expect(result?.datasets?.[0].data.fields[0]).toMatchObject({
    name: 'time',
    type: 'timestamp',
    format: 'YYYY-M-D H:m:s',
    duckDBColumnType: 'VARCHAR'
  });
  expect(result?.datasets?.[0].data.rows).toEqual([['2020-01-01 00:00:00']]);
});

it('uses saved types for empty maps and does not query the database', async () => {
  const {connect} = configureSchema([]);
  const result = await processKeplerglJSONforDuckDb({
    datasets: [
      {
        version: 'v1',
        data: {
          id: 'empty',
          label: 'Empty',
          color: [1, 2, 3],
          fields: [{name: 'id', type: 'integer'}],
          allData: []
        }
      }
    ],
    config: {version: 'v1', config: {}}
  });
  expect(result?.datasets?.[0].data.fields[0]).toMatchObject({
    name: 'id',
    type: 'integer',
    duckDBColumnType: 'INTEGER'
  });
  expect(connect).not.toHaveBeenCalled();
  expect(await processKeplerglJSONforDuckDb(null)).toBeNull();
});
