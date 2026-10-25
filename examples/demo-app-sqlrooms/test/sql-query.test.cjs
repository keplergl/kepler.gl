// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const assert = require('node:assert/strict');
const {test} = require('node:test');
const {transformSync} = require('@babel/core');
const fs = require('node:fs');
const path = require('node:path');
const {buildSync} = require('esbuild');

const parserBundle = buildSync({
  stdin: {
    contents:
      "export {escapeVal, joinStatements, makeLimitQuery, splitSqlStatements} from '@sqlrooms/duckdb';",
    resolveDir: path.resolve(__dirname, '..')
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false
});
const parser = {exports: {}};
new Function('require', 'module', 'exports', parserBundle.outputFiles[0].text)(
  require,
  parser,
  parser.exports
);
const filename = path.resolve(__dirname, '../src/components/sql-query.ts');
const {code} = transformSync(fs.readFileSync(filename, 'utf8'), {
  filename,
  babelrc: false,
  configFile: false,
  presets: ['@babel/preset-typescript'],
  plugins: ['@babel/plugin-transform-modules-commonjs']
});

function setup({failPreview = false, controller, isSelect = true} = {}) {
  const queries = [];
  const signals = [];
  const preview = {numRows: 1000};
  const full = {numRows: 2500};
  function query(sql, options) {
    queries.push(sql);
    signals.push(options?.signal);
    const result = Promise.resolve().then(() => {
      if (sql.startsWith('SELECT json_serialize_sql')) {
        return {getChildAt: () => ({get: () => JSON.stringify({error: !isSelect})})};
      }
      if (sql.includes('LIMIT 1000')) {
        if (controller) controller.abort();
        options?.signal?.throwIfAborted();
        if (failPreview) throw new Error('Preview failed');
        return preview;
      }
      return full;
    });
    return Object.assign(result, {result});
  }
  const connector = {query, execute: query};
  const deps = {
    '@sqlrooms/duckdb': parser.exports,
    './sql-connector': {getSqlConnector: async () => connector},
    '@kepler.gl/duckdb': {
      getDuckDBColumnTypes: async () => [{name: 'n', type: 'INTEGER'}],
      getDuckDBColumnTypesMap: () => ({n: 'INTEGER'}),
      castDuckDBTypesForKepler: table => `SELECT n FROM "${table}"`,
      setGeoArrowWKBExtension: () => {}
    }
  };
  const module = {exports: {}};
  new Function('require', 'module', 'exports', 'crypto', code)(
    id => deps[id],
    module,
    module.exports,
    require('node:crypto').webcrypto
  );
  return {...module.exports, queries, signals, preview, full};
}

test('executes writes once and keeps a full snapshot behind a bounded preview', async () => {
  const db = setup();
  const result = await db.executeSql('CREATE TABLE test (n INTEGER); SELECT * FROM test;');
  assert.equal(result.table, db.preview);
  assert.match(db.queries[1], /CREATE TABLE test \(n INTEGER\)[\s\S]*CREATE TABLE "__sqlrooms/);
  assert.match(db.queries[2], /LIMIT 1000/);
  assert.equal(await db.readFullSqlResult(result), db.full);
  assert.equal(db.queries.filter(sql => sql.includes('CREATE TABLE test')).length, 1);
  await db.disposeSqlResult(result);
  assert.match(db.queries.at(-1), /^DROP TABLE IF EXISTS/);
});

test('preserves SQL literals containing comments and semicolons', async () => {
  const db = setup();
  await db.executeSql("-- comment\nSELECT 'a--b;/*c*/' AS value; /* trailing */");
  assert.match(db.queries[1], /SELECT 'a--b;\/\*c\*\/' AS value$/);
});

test('rejects comment-only input before querying', async () => {
  const db = setup();
  await assert.rejects(db.executeSql('-- empty\n/* empty */'), /Query is empty/);
  assert.equal(db.queries.length, 0);
});

test('cleans the snapshot after a preview failure', async () => {
  const db = setup({failPreview: true});
  await assert.rejects(db.executeSql('SELECT 1'), /Preview failed/);
  assert.match(db.queries.at(-1), /^DROP TABLE IF EXISTS/);
});

test('propagates cancellation and cleans up without the aborted signal', async () => {
  const controller = new AbortController();
  const db = setup({controller});
  await assert.rejects(db.executeSql('SELECT 1', controller.signal), {name: 'AbortError'});
  assert.equal(db.signals[2], controller.signal);
  assert.match(db.queries.at(-1), /^DROP TABLE IF EXISTS/);
  assert.equal(db.signals.at(-1), undefined);
});

test('retains mapped snapshots, renames once, and exports from the retained table', async () => {
  const db = setup();
  const result = await db.executeSql('SELECT 1');
  await db.retainSqlResult(result);
  await db.retainSqlResult(result);
  await db.disposeSqlResult(result);
  assert.equal(db.queries.filter(sql => sql.startsWith('ALTER')).length, 1);
  assert.equal(db.queries.filter(sql => sql.startsWith('DROP')).length, 0);
  assert.match(result.tableName, /^query_result_/);
  assert.equal(await db.readFullSqlResult(result), db.full);
  assert.ok(db.queries.at(-1).includes(result.tableName));
});

test('returns no stale preview when the last statement has no result', async () => {
  const db = setup({isSelect: false});
  assert.equal(await db.executeSql('SELECT 1; CREATE TABLE test (n INTEGER)'), null);
  assert.equal(db.queries.length, 2);
});
