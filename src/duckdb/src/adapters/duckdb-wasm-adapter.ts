// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import * as duckdb from '@duckdb/duckdb-wasm';
import {AsyncDuckDB, DuckDBConfig, AsyncDuckDBConnection} from '@duckdb/duckdb-wasm';

import {DatabaseAdapter, DatabaseConnection} from '@kepler.gl/utils';

import {logElapsedTime} from '../utils/perf';

class Connection implements DatabaseConnection {
  private connection: AsyncDuckDBConnection;

  constructor(connection: AsyncDuckDBConnection) {
    this.connection = connection;
  }

  async query(statement: string): Promise<arrow.Table> {
    return this.connection.query(statement);
  }

  async insertArrowTable(arrowTable: arrow.Table, params: {name: string}): Promise<void> {
    await this.connection.insertArrowTable(arrowTable, params);
  }

  async close() {
    await this.connection.close();
  }
}

type DuckDBWasmAdapterProps =
  | {
      debug?: boolean;
      config?: DuckDBConfig;
    }
  | Promise<AsyncDuckDB>;

export class DuckDBWasmAdapter implements DatabaseAdapter {
  private duckDB: Promise<AsyncDuckDB>;

  constructor(options: DuckDBWasmAdapterProps) {
    // pass existing AsyncDuckDB object created elsewhere
    if (options instanceof Promise || options instanceof AsyncDuckDB) {
      this.duckDB = options as any;
      return;
    }

    // or create a new AsyncDuckDB object
    const {debug = false, config} = options || {};
    this.duckDB = initializeDuckDbWasm(config, debug);
  }

  async connect() {
    const db = await this.duckDB;
    const c = await db.connect();
    return new Connection(c);
  }

  async registerFileText(filename: string, content) {
    const db = await this.duckDB;
    await db.registerFileText(filename, content);
  }

  async registerFileHandle(
    name: string,
    handle: any,
    protocol: duckdb.DuckDBDataProtocol,
    directIO: boolean
  ): Promise<void> {
    const db = await this.duckDB;
    await db.registerFileHandle(name, handle, protocol, directIO);
  }
}

/**
 * Initialize DuckDB with a browser-specific Wasm bundle.
 */
const initializeDuckDbWasm = async (
  config?: DuckDBConfig,
  debug?: boolean
): Promise<AsyncDuckDB> => {
  const start = performance.now();

  // Select a bundle based on browser checks
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
  if (!bundle.mainWorker) {
    throw new Error('Failed to initialize DuckDB');
  }

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], {
      type: 'text/javascript'
    })
  );

  // Instantiate the async version of DuckDB-wasm
  const worker = new Worker(worker_url);
  const logger = debug ? new duckdb.ConsoleLogger() : new duckdb.VoidLogger();
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

  if (debug) {
    logElapsedTime('DuckDB initialized', start);
    if (config) {
      console.debug(`DuckDbConfig: ${JSON.stringify(config, null, 2)}`);
    }
  }
  return db;
};
