// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// git@github.com:holdenmatt/duckdb-wasm-kit.git
import * as duckdb from '@duckdb/duckdb-wasm';
import {AsyncDuckDB, DuckDBConfig} from '@duckdb/duckdb-wasm';
import {logElapsedTime} from './utils/perf';

export let DEBUG: boolean | undefined;

let DuckDB: Promise<AsyncDuckDB> | undefined;

/**
 * Initialize DuckDB, ensuring we only initialize it once.
 *
 * @param debug If true, log DuckDB logs and elapsed times to the console.
 * @param config An optional DuckDBConfig object.
 */
export async function initializeDuckDb(options?: {
  debug?: boolean;
  config?: DuckDBConfig;
}): Promise<AsyncDuckDB> {
  const {debug = false, config} = options || {};
  DEBUG = debug;

  if (DuckDB === undefined) {
    DuckDB = _initializeDuckDb(config);
  }
  return DuckDB;
}

/**
 * Initialize DuckDB with a browser-specific Wasm bundle.
 */
const _initializeDuckDb = async (config?: DuckDBConfig): Promise<AsyncDuckDB> => {
  const start = performance.now();

  // Select a bundle based on browser checks
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], {
      type: 'text/javascript'
    })
  );

  // Instantiate the async version of DuckDB-wasm
  const worker = new Worker(worker_url);
  const logger = DEBUG ? new duckdb.ConsoleLogger() : new duckdb.VoidLogger();
  const db = new AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  if (config) {
    if (config.path) {
      const res = await fetch(config.path);
      const buffer = await res.arrayBuffer();
      const fileNameMatch = config.path.match(/[^/]*$/);
      if (fileNameMatch) {
        config.path = fileNameMatch[0];
      }
      await db.registerFileBuffer(config.path, new Uint8Array(buffer));
    }
    await db.open(config);
  }

  if (DEBUG) {
    logElapsedTime('DuckDB initialized', start);
    if (config) {
      console.debug(`DuckDbConfig: ${JSON.stringify(config, null, 2)}`);
    }
  }
  return db;
};

/**
 * Get the instance of DuckDB, initializing it if needed.
 *
 * Typically `useDuckDB` is used in React components instead, but this
 * method provides access outside of React contexts.
 */
export const getDuckDB = async (): Promise<AsyncDuckDB> => {
  if (DuckDB) {
    return DuckDB;
  } else {
    return await initializeDuckDb();
  }
};
