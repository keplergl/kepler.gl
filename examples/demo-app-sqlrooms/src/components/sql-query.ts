// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Table} from 'apache-arrow';
import {splitSqlStatements} from '@sqlrooms/duckdb';
import {getApplicationConfig} from '@kepler.gl/utils';
import {
  castDuckDBTypesForKepler,
  checkIsSelectQuery,
  getDuckDBColumnTypes,
  getDuckDBColumnTypesMap,
  setGeoArrowWKBExtension
} from '@kepler.gl/duckdb';

export type SqlResult = {table: Table; tableDuckDBTypes: Record<string, string>};

// Reuse Kepler's connection so SQL sees the same tables as map imports.
export async function executeSql(sql: string): Promise<SqlResult | null> {
  const statements = splitSqlStatements(sql);
  if (!statements.length) throw new Error('Query is empty');
  const database = getApplicationConfig().database;
  if (!database) throw new Error('The database is not configured properly.');
  const connection = await database.connect();
  const tempTable = `kepler_sql_result_${crypto.randomUUID().replaceAll('-', '')}`;
  let temporaryTableCreated = false;
  try {
    let result: SqlResult | null = null;
    for (const [index, statement] of statements.entries()) {
      if (index === statements.length - 1 && (await checkIsSelectQuery(connection, statement))) {
        await connection.query(`CREATE TEMP TABLE "${tempTable}" AS ${statement}`);
        temporaryTableCreated = true;
        const columns = await getDuckDBColumnTypes(connection, tempTable);
        const table = await connection.query(castDuckDBTypesForKepler(tempTable, columns));
        setGeoArrowWKBExtension(table, columns);
        result = {table, tableDuckDBTypes: getDuckDBColumnTypesMap(columns)};
      } else {
        await connection.query(statement);
      }
    }
    return result;
  } finally {
    try {
      if (temporaryTableCreated) await connection.query(`DROP TABLE IF EXISTS "${tempTable}"`);
    } finally {
      await connection.close();
    }
  }
}
