// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createBaseDuckDbConnector} from '@sqlrooms/duckdb';
import {getApplicationConfig} from '@kepler.gl/utils';

// SQLRooms metadata, completions, and table previews use Kepler's database.
export function createSqlConnector() {
  return createBaseDuckDbConnector(
    {},
    {
      async executeQueryInternal(query, signal) {
        signal.throwIfAborted();
        const database = getApplicationConfig().database;
        if (!database) throw new Error('The database is not configured properly.');
        const connection = await database.connect();
        try {
          const result = await connection.query(query);
          signal.throwIfAborted();
          return result;
        } finally {
          await connection.close();
        }
      }
    }
  );
}
