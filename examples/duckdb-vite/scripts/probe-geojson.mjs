// SPDX-License-Identifier: MIT
import path from 'path';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const duckdbRoot = path.resolve(
  '/Users/ihordykhta/Downloads/kepler.gl/examples/duckdb-vite/node_modules/@duckdb/duckdb-wasm'
);
const duckdb = require(path.join(duckdbRoot, 'dist/duckdb-node-blocking.cjs'));
const DUCKDB_DIST = path.join(duckdbRoot, 'dist');
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

console.log('duckdb-wasm', require(path.join(duckdbRoot, 'package.json')).version);

const logger = new duckdb.VoidLogger();
const db = await duckdb.createDuckDB(bundles, logger, duckdb.NODE_RUNTIME);
await db.instantiate(bundles.mvp.mainModule, bundles.mvp.mainWorker);
const conn = db.connect();

function trySql(label, sql) {
  try {
    conn.query(sql);
    console.log('OK   ', label);
  } catch (e) {
    console.log('FAIL ', label, '->', String(e.message || e).split('\n')[0]);
  }
}

const geojson = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {name: 'A'},
      geometry: {type: 'Point', coordinates: [1, 2]}
    }
  ]
});

console.log('Installing spatial...');
trySql('install+load spatial', `install spatial; load spatial;`);

const fileId = 'abc123hash';
const label = 'random.geojson';
db.registerFileText(fileId, geojson);

console.log('\n--- master style (single quotes everywhere) ---');
trySql(
  'CREATE+ST_READ+ALTER single',
  `
  CREATE TABLE '${label}' AS
  SELECT * FROM ST_READ('${fileId}', keep_wkb = TRUE);
  ALTER TABLE '${label}' RENAME 'wkb_geometry' TO '_geojson';
`
);

const fileId2 = 'abc123hash2';
const label2 = 'random2.geojson';
db.registerFileText(fileId2, geojson);

console.log('\n--- PR #3433 style (double quotes everywhere) ---');
trySql(
  'CREATE+ST_READ+ALTER double',
  `
  CREATE TABLE "${label2}" AS
  SELECT * FROM ST_READ("${fileId2}", keep_wkb = TRUE);
  ALTER TABLE "${label2}" RENAME "wkb_geometry" TO "_geojson";
`
);

const fileId3 = 'abc123hash3';
const label3 = 'random3.geojson';
db.registerFileText(fileId3, geojson);

console.log('\n--- correct hybrid (double identifiers, single path) ---');
trySql(
  'hybrid',
  `
  CREATE TABLE "${label3}" AS
  SELECT * FROM ST_READ('${fileId3}', keep_wkb = TRUE);
  ALTER TABLE "${label3}" RENAME COLUMN "wkb_geometry" TO "_geojson";
`
);

conn.close();
