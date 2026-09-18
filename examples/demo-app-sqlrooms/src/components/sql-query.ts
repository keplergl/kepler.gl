// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Table} from 'apache-arrow';
import {escapeVal, joinStatements, makeLimitQuery, splitSqlStatements} from '@sqlrooms/duckdb';
import {
  castDuckDBTypesForKepler,
  getDuckDBColumnTypes,
  getDuckDBColumnTypesMap,
  setGeoArrowWKBExtension,
  type DuckDBColumnDesc
} from '@kepler.gl/duckdb';
import {getSqlConnector} from './sql-connector';

export const SQL_PREVIEW_LIMIT = 1000;

export type SqlResult = {
  table: Table;
  tableDuckDBTypes: Record<string, string>;
  tableName: string;
  // A map keeps the snapshot alive after the SQL panel moves on to another query.
  retained: boolean;
};

export async function disposeSqlResult(result: SqlResult | null) {
  if (result && !result.retained) {
    const connector = await getSqlConnector();
    await connector.execute(`DROP TABLE IF EXISTS "${result.tableName}"`);
  }
}

// SQLRooms owns execution and cancellation. A database-scoped snapshot survives
// its per-query connections; TEMP tables would disappear between these calls.
// It also lets Add to Map / export read all rows without rerunning user writes.
export async function executeSql(sql: string, signal?: AbortSignal): Promise<SqlResult | null> {
  const statements = splitSqlStatements(sql);
  const lastStatement = statements.pop();
  if (!lastStatement) throw new Error('Query is empty');
  const connector = await getSqlConnector();
  signal?.throwIfAborted();
  const parsed = await connector.query(`SELECT json_serialize_sql(${escapeVal(lastStatement)})`, {
    signal
  });
  const serialized = parsed.getChildAt(0)?.get(0);
  if (typeof serialized !== 'string') throw new Error('DuckDB did not return a SQL parse result');
  const isSelect = !JSON.parse(serialized).error;
  if (!isSelect) {
    await connector.execute(sql, {signal});
    return null;
  }

  const tableName = `__sqlrooms_kepler_result_${crypto.randomUUID().replace(/-/g, '')}`;
  try {
    await connector.execute(
      joinStatements(statements, `CREATE TABLE "${tableName}" AS ${lastStatement}`),
      {signal}
    );
    const connection = {query: (query: string) => connector.query(query, {signal}).result};
    const columns = await getDuckDBColumnTypes(connection, tableName);
    const table = await readResultTable(tableName, columns, SQL_PREVIEW_LIMIT, signal);
    return {table, tableDuckDBTypes: getDuckDBColumnTypesMap(columns), tableName, retained: false};
  } catch (error) {
    // Cleanup must run even when the user's query signal has been aborted.
    await connector.execute(`DROP TABLE IF EXISTS "${tableName}"`);
    throw error;
  }
}

export async function readFullSqlResult(result: SqlResult): Promise<Table> {
  const columns = Object.entries(result.tableDuckDBTypes).map(([name, type]) => ({name, type}));
  return readResultTable(result.tableName, columns);
}

async function readResultTable(
  tableName: string,
  columns: DuckDBColumnDesc[],
  limit?: number,
  signal?: AbortSignal
): Promise<Table> {
  const connector = await getSqlConnector();
  const sql = castDuckDBTypesForKepler(tableName, columns);
  let table = await connector.query(limit === undefined ? sql : makeLimitQuery(sql, {limit}), {
    signal
  });
  // SQLRooms 0.29 discards the schema when its stream has no nonempty batches.
  // Read only the schema through WASM so empty results keep their CSV headers.
  if (table.numCols === 0) {
    signal?.throwIfAborted();
    const connection = await connector.getDb().connect();
    try {
      table = await connection.query(makeLimitQuery(sql, {limit: 0}));
    } finally {
      await connection.close();
    }
  }
  signal?.throwIfAborted();
  setGeoArrowWKBExtension(table, columns);
  return table;
}

export async function retainSqlResult(result: SqlResult) {
  if (result.retained) return;
  const connector = await getSqlConnector();
  const tableName = result.tableName.replace('__sqlrooms_kepler_result_', 'query_result_');
  await connector.execute(`ALTER TABLE "${result.tableName}" RENAME TO "${tableName}"`);
  result.tableName = tableName;
  result.retained = true;
}
