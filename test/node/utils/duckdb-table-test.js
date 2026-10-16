// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

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
