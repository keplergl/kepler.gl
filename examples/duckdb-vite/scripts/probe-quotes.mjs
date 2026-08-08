// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project
//
// Probe DuckDB identifier vs string-literal quoting (re: PR #3433).
// Run from repo root:
//   node examples/duckdb-vite/scripts/probe-quotes.mjs

import path from 'path';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const candidates = [
  path.resolve(__dirname, '../../demo-app/node_modules/@duckdb/duckdb-wasm'),
  path.resolve(__dirname, '../node_modules/@duckdb/duckdb-wasm'),
  path.resolve(__dirname, '../../../node_modules/@duckdb/duckdb-wasm')
];

const duckdbRoot = candidates.find(p => {
  try {
    require.resolve(path.join(p, 'package.json'));
    return true;
  } catch {
    return false;
  }
});

if (!duckdbRoot) {
  console.error('Could not find @duckdb/duckdb-wasm. Install example deps first.');
  process.exit(1);
}

const duckdb = require(path.join(duckdbRoot, 'dist/duckdb-node-blocking.cjs'));
const DUCKDB_DIST = path.join(duckdbRoot, 'dist');

console.log('Using DuckDB wasm from', duckdbRoot);

const bundles = {
  mvp: {
    mainModule: path.join(DUCKDB_DIST, 'duckdb-mvp.wasm'),
    mainWorker: path.join(DUCKDB_DIST, 'duckdb-node-mvp.worker.cjs')
  },
  eh: {
    mainModule: path.join(DUCKDB_DIST, 'duckdb-eh.wasm'),
    mainWorker: path.join(DUCKDB_DIST, 'duckdb-node-eh.worker.cjs')
  }
};

const logger = new duckdb.VoidLogger();
const db = await duckdb.createDuckDB(bundles, logger, duckdb.NODE_RUNTIME);
await db.instantiate(bundles.mvp.mainModule, bundles.mvp.mainWorker);

const conn = db.connect();

function trySql(label, sql) {
  try {
    conn.query(sql);
    console.log('OK   ', label);
    return true;
  } catch (e) {
    console.log('FAIL ', label, '->', String(e.message || e).split('\n')[0]);
    return false;
  }
}

console.log('\n--- CREATE TABLE quoting ---');
trySql('single-quote simple', `CREATE TABLE 'foo' AS SELECT 1 AS x`);
trySql('double-quote simple', `CREATE TABLE "foo2" AS SELECT 1 AS x`);
trySql('unquoted simple', `CREATE TABLE foo3 AS SELECT 1 AS x`);
trySql('single-quote dotted (file-like)', `CREATE TABLE 'cities.geojson' AS SELECT 1 AS x`);
trySql('double-quote dotted (file-like)', `CREATE TABLE "cities.geojson" AS SELECT 1 AS x`);
trySql('unquoted dotted (file-like)', `CREATE TABLE cities.json AS SELECT 1 AS x`);

console.log('\n--- path args for table functions ---');
db.registerFileText('sample.json', JSON.stringify([{a: 1}, {a: 2}]));
trySql(
  'read_json_auto path single quotes',
  `CREATE TABLE "t1" AS SELECT * FROM read_json_auto('sample.json')`
);
trySql(
  'read_json_auto path double quotes',
  `CREATE TABLE "t2" AS SELECT * FROM read_json_auto("sample.json")`
);

console.log('\n--- DROP (current kepler helper style) ---');
trySql('DROP double-quote', `DROP TABLE IF EXISTS "foo2"`);
trySql('DROP single-quote', `DROP TABLE IF EXISTS 'foo3'`);

conn.close();
