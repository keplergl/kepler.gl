// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createWasmDuckDbConnector, type DuckDbConnector} from '@sqlrooms/duckdb';

// The application owns this database for the page's lifetime. Panel stores
// borrow it: closing either panel must not terminate the map's database.
export const sqlConnector = createWasmDuckDbConnector({
  query: {castBigIntToDouble: true},
  initializationQuery: 'INSTALL spatial; LOAD spatial;'
});

export function borrowSqlConnector(connector: DuckDbConnector = sqlConnector): DuckDbConnector {
  return {...connector, destroy: () => Promise.resolve()};
}

export async function getSqlConnector() {
  await sqlConnector.initialize();
  return sqlConnector;
}
