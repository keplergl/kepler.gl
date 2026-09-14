// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createDuckDbSlice as createSlice, type CreateDuckDbSliceProps} from '@sqlrooms/duckdb';
import {borrowSqlConnector} from './sql-connector';

export * from '@sqlrooms/duckdb';

// The assistant creates and initializes its singleton store during import.
// Supply the host connector at creation time, before it can start another worker.
// Remove this build adapter when the assistant accepts a host-owned room store.
export function createDuckDbSlice(options: CreateDuckDbSliceProps = {}) {
  return createSlice({...options, connector: options.connector ?? borrowSqlConnector()});
}
