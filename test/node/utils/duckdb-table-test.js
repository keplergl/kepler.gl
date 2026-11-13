// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import * as arrow from 'apache-arrow';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';

import {KeplerGlDuckDbTable} from '../../../src/duckdb/src/table/duckdb-table';

const importRowData = (data, {db, c}) =>
  KeplerGlDuckDbTable.prototype.importRowData.call(
    {id: 'sample-data', label: 'Sample Data'},
    {data, db, c}
  );

test('KeplerGlDuckDbTable -> importRowData maps ordinary Kepler field types', async t => {
  let registeredFile;
  let query;
  const db = {
    registerFileText: async (name, contents) => {
      registeredFile = {name, contents};
    }
  };
  const c = {
    query: async sql => {
      query = sql;
    }
  };
  const data = {
    fields: [
      {name: 'id', type: 'integer'},
      {name: 'label', type: 'string'},
      {name: 'pickup_time', type: 'timestamp', format: 'YYYY-M-D H:m:s'},
      {name: 'epoch_seconds', type: 'timestamp', format: 'x', duckDBColumnType: 'INTEGER'},
      {name: 'metadata', type: 'string', duckDBColumnType: 'JSON'}
    ],
    rows: [[1, 'one', '2015-01-15 19:05:40 +00:00', 1477647118, {source: 'sample'}]]
  };

  await importRowData(data, {db, c});

  t.deepEqual(
    registeredFile,
    {
      name: 'sample-data',
      contents: JSON.stringify([
        {
          id: 1,
          label: 'one',
          pickup_time: '2015-01-15T19:05:40.000Z',
          epoch_seconds: 1477647118,
          metadata: {source: 'sample'}
        }
      ])
    },
    'registers row arrays as objects with normalized timestamps'
  );
  t.ok(query.includes("'id': 'INTEGER'"), 'maps integer fields to DuckDB INTEGER');
  t.ok(query.includes("'label': 'VARCHAR'"), 'maps string fields to DuckDB VARCHAR');
  t.ok(query.includes("'pickup_time': 'TIMESTAMP'"), 'maps timestamp fields to TIMESTAMP');
  t.ok(query.includes("'epoch_seconds': 'INTEGER'"), 'preserves a numeric timestamp column type');
  t.ok(query.includes("'metadata': 'JSON'"), 'preserves an explicit DuckDB column type');
  t.notOk(query.includes('undefined'), 'does not interpolate an undefined column type');
  t.end();
});

test('KeplerGlDuckDbTable -> importRowData rejects unsupported field types', async t => {
  let queried = false;
  const db = {registerFileText: async () => {}};
  const c = {
    query: async () => {
      queried = true;
    }
  };

  try {
    await importRowData(
      {
        fields: [{name: 'value', type: 'unsupported'}],
        rows: [{value: 'one'}]
      },
      {db, c}
    );
    t.fail('should reject an unsupported field type');
  } catch (error) {
    t.equal(
      error.message,
      'Unsupported field type "unsupported" for DuckDB column "value"',
      'reports the unsupported field and column'
    );
  }

  t.notOk(queried, 'does not run invalid SQL');
  t.end();
});

test('KeplerGlDuckDbTable -> GeoJSON import retains geometry metadata and quoted label', async t => {
  const rows = {type: 'FeatureCollection', features: []};
  const registered = [];
  const queries = [];
  const result = await KeplerGlDuckDbTable.prototype.importGeoJsonData.call(
    {id: 'geo-file', label: 'My "places"'},
    {
      data: {rows},
      db: {registerFileText: async (...args) => registered.push(args)},
      c: {query: async sql => queries.push(sql)}
    }
  );
  t.deepEqual(registered, [['geo-file', JSON.stringify(rows)]], 'registers original GeoJSON');
  t.ok(queries[0].includes('CREATE TABLE "My ""places"""'), 'quotes the table identifier');
  t.ok(queries[0].includes('keep_wkb = TRUE'), 'requests binary geometry');
  t.deepEqual(result.geoarrowMetadata, {_geojson: 'geoarrow.wkb'}, 'restores WKB field metadata');
  t.end();
});

test('KeplerGlDuckDbTable -> row import preserves object values and propagates failures', async t => {
  const original = [{id: 0, enabled: false, time: null, extra: 'keep'}];
  const fields = [
    {name: 'id', type: 'integer'},
    {name: 'enabled', type: 'boolean'},
    {name: 'time', type: 'timestamp', format: 'x'}
  ];
  let stored;
  const error = new Error('database unavailable');
  try {
    await importRowData(
      {fields, rows: original},
      {
        db: {
          registerFileText: async (name, text) => {
            stored = JSON.parse(text);
          }
        },
        c: {
          query: async () => {
            throw error;
          }
        }
      }
    );
    t.fail('failed import should reject');
  } catch (caught) {
    t.equal(caught, error, 'does not swallow the database failure');
  }
  t.deepEqual(stored, original, 'retains falsy and extra object values');
  t.deepEqual(
    original,
    [{id: 0, enabled: false, time: null, extra: 'keep'}],
    'source remains intact'
  );
  t.end();
});

test('KeplerGlDuckDbTable -> Arrow import removes extensions only during insertion', async t => {
  const table = new arrow.Table({
    geometry: arrow.vectorFromArray([new Uint8Array([1, 2])], new arrow.Binary())
  });
  const metadata = table.schema.fields[0].metadata;
  metadata.set('ARROW:extension:name', 'geoarrow.wkb');
  metadata.set('source', 'fixture');
  const operations = [];
  const result = await KeplerGlDuckDbTable.prototype.importArrowData.call(
    {label: 'Arrow Data'},
    {
      data: {rows: table},
      c: {
        query: async sql => operations.push(sql),
        insertArrowTable: async (inserted, options) => {
          t.equal(inserted, table, 'passes the Arrow table to the database');
          t.deepEqual(options, {name: 'Arrow Data'}, 'uses the destination label');
          t.notOk(
            metadata.has('ARROW:extension:name'),
            'unsupported extension is absent during insertion'
          );
          t.equal(metadata.get('source'), 'fixture', 'other metadata is preserved');
        }
      }
    }
  );
  t.ok(operations[0].includes('load spatial'), 'sets up spatial support before insertion');
  t.equal(
    metadata.get('ARROW:extension:name'),
    'geoarrow.wkb',
    'restores original extension after success'
  );
  t.equal(
    result.geoarrowMetadata.geometry,
    'geoarrow.wkb',
    'returns geometry metadata for query output'
  );
  t.equal(result.useNewFields, true, 'uses fields from the imported table');
  t.end();
});

async function withDatabase(db, run) {
  const original = getApplicationConfig().database;
  initApplicationConfig({database: db});
  try {
    return await run();
  } finally {
    initApplicationConfig({database: original});
  }
}

function queryFixture(failSelect) {
  const queries = [];
  let closed = 0;
  const values = new arrow.Table({value: arrow.vectorFromArray([0, 2], new arrow.Int32())});
  const connection = {
    query: async sql => {
      queries.push(sql);
      if (sql.startsWith('PRAGMA')) {
        return arrow.tableFromArrays({name: ['value'], type: ['INTEGER']});
      }
      if (sql.startsWith('SELECT')) {
        if (failSelect) throw failSelect;
        return values;
      }
      return new arrow.Table();
    },
    close: async () => {
      closed++;
    }
  };
  return {queries, connection, getClosed: () => closed};
}

test('KeplerGlDuckDbTable -> existing query tables are read without replacing them', async t => {
  const fixture = queryFixture();
  await withDatabase({connect: async () => fixture.connection}, async () => {
    const result = await KeplerGlDuckDbTable.prototype.createTableAndGetArrow.call(
      {label: 'Display label', metadata: {}},
      {duckdbTableName: 'query result', fields: [{name: 'stale', type: 'string'}]}
    );
    t.notOk(
      fixture.queries.some(sql => /DROP|CREATE|read_json/.test(sql)),
      'does not replace existing table'
    );
    t.ok(
      fixture.queries.every(sql => sql.includes('"query result"')),
      'queries database name rather than display label'
    );
    t.equal(
      result.fields[0].name,
      'value',
      'rebuilds fields from query result, not stale descriptors'
    );
    t.deepEqual(
      Array.from(result.cols[0]),
      [0, 2],
      'returns original ordered values including zero'
    );
  });
  t.equal(fixture.getClosed(), 1, 'closes the connection on success');
  t.end();
});

test('KeplerGlDuckDbTable -> row-table creation preserves provided field semantics', async t => {
  const fixture = queryFixture();
  const fields = [{name: 'value', type: 'real', format: '', displayName: 'Measurement'}];
  let imported;
  await withDatabase({connect: async () => fixture.connection}, async () => {
    const result = await KeplerGlDuckDbTable.prototype.createTableAndGetArrow.call(
      {
        label: 'Measurements',
        metadata: {},
        importRowData: async args => {
          imported = args.data;
        }
      },
      {rows: [[0], [2]], fields}
    );
    t.equal(imported.fields, fields, 'infers row format and passes provided data to importer');
    t.ok(fixture.queries[0].startsWith('DROP TABLE IF EXISTS'), 'replaces an imported table');
    t.equal(result.fields, fields, 'preserves field types and display metadata for row imports');
    t.deepEqual(Array.from(result.cols[0]), [0, 2], 'returns imported values');
  });
  t.equal(fixture.getClosed(), 1, 'closes connection after import');
  t.end();
});

test('KeplerGlDuckDbTable -> failed query closes connection and propagates failure', async t => {
  const error = new Error('query failed');
  const fixture = queryFixture(error);
  await withDatabase({connect: async () => fixture.connection}, async () => {
    try {
      await KeplerGlDuckDbTable.prototype.createTableAndGetArrow.call(
        {label: 'Data', metadata: {}},
        {duckdbTableName: 'existing'}
      );
      t.fail('query failure should reject');
    } catch (caught) {
      t.equal(caught, error, 'preserves the query error');
    }
  });
  t.equal(fixture.getClosed(), 1, 'closes connection after failure');
  t.end();
});
