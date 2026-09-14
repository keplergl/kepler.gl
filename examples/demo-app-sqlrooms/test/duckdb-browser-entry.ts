// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DuckDBWasmAdapter, KeplerGlDuckDbTable} from '@kepler.gl/duckdb';
import {initApplicationConfig} from '@kepler.gl/utils';
import {roomStore as assistantStore} from '@openassistant/kepler-assistant';
import {borrowSqlConnector, getSqlConnector} from '../src/components/sql-connector';
import {
  executeSql,
  disposeSqlResult,
  readFullSqlResult,
  retainSqlResult
} from '../src/components/sql-query';

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export async function run() {
  const connector = await getSqlConnector();
  const adapter = new DuckDBWasmAdapter(Promise.resolve(connector.getDb()));
  initApplicationConfig({database: adapter});
  const db = connector.getDb();
  const assistantConnector = await assistantStore.getState().db.getConnector();
  check(
    (assistantConnector as typeof connector).getDb() === db,
    'Assistant created a second database'
  );
  await assistantStore.getState().db.destroy();
  await assistantStore.getState().db.initialize();
  await borrowSqlConnector().destroy();
  check(connector.getDb() === db, 'Panel teardown replaced the shared database');

  const result = await executeSql(
    'CREATE TABLE source AS SELECT i FROM range(2500) t(i); SELECT * FROM source'
  );
  check(result && result.table.numRows === 1000, 'Preview must be bounded');
  check((await readFullSqlResult(result)).numRows === 2500, 'Export must include all rows');
  await retainSqlResult(result);
  const before = await connector.query('SELECT count(*) AS n FROM duckdb_tables()');
  const table = new KeplerGlDuckDbTable({
    info: {id: 'snapshot', label: 'snapshot', format: 'arrow'}
  });
  await table.importData({data: {fields: [], rows: [], duckdbTableName: result.tableName}});
  check(table.length === 2500, 'Map must include all rows');
  const after = await connector.query('SELECT count(*) AS n FROM duckdb_tables()');
  check(
    before.getChildAt(0)!.get(0) === after.getChildAt(0)!.get(0),
    'Map re-imported the existing table'
  );
  const originalConnect = adapter.connect.bind(adapter);
  let closedConnections = 0;
  adapter.connect = async () => {
    const connection = await originalConnect();
    const close = connection.close.bind(connection);
    connection.close = async () => {
      closedConnections++;
      await close();
    };
    return connection;
  };
  let failedImport = false;
  try {
    await table.importData({data: {fields: [], rows: [], duckdbTableName: 'missing_relation'}});
  } catch {
    failedImport = true;
  }
  check(failedImport && closedConnections === 1, 'Failed import leaked its connection');
  adapter.connect = originalConnect;
  await disposeSqlResult(result);
  check(
    (await connector.query(`SELECT * FROM "${result.tableName}" LIMIT 1`)).numRows === 1,
    'Mapped snapshot was dropped'
  );

  const spatial = await executeSql(
    "SELECT ST_Point(-122, 37) AS geom, 1700000000000::BIGINT AS t, TIMESTAMP '2025-01-01' AS time"
  );
  check(spatial, 'Missing spatial result');
  check(
    spatial.table.schema.fields[0].metadata.get('ARROW:extension:name') === 'geoarrow.wkb',
    'Lost GeoArrow metadata'
  );
  await disposeSqlResult(spatial);

  const empty = await executeSql('SELECT 1 AS n WHERE false');
  check(empty?.table.numRows === 0 && empty.table.numCols === 1, 'Empty preview lost its schema');
  check((await readFullSqlResult(empty)).numCols === 1, 'Empty export lost its header');
  await disposeSqlResult(empty);

  const controller = new AbortController();
  const cancelled = executeSql(
    'SELECT sum(a.i * b.i) FROM range(10000000) a(i), range(10000000) b(i)',
    controller.signal
  );
  setTimeout(() => controller.abort(), 100);
  let aborted = false;
  try {
    await cancelled;
  } catch {
    aborted = true;
  }
  check(aborted, 'Expensive query was not cancelled');
  check((await connector.query('SELECT 42')).numRows === 1, 'Database unusable after cancellation');
  const remaining = await connector.query(
    "SELECT count(*) FROM duckdb_tables() WHERE starts_with(table_name, '__sqlrooms_kepler_result_')"
  );
  check(Number(remaining.getChildAt(0)!.get(0)) === 0, 'Unretained snapshots leaked');
  return {previewRows: result.table.numRows, mapRows: table.length, version: await db.getVersion()};
}
