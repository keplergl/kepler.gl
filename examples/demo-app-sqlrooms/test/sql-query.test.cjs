// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const assert = require('node:assert/strict');
const {test} = require('node:test');
const {transformSync} = require('@babel/core');
const fs = require('node:fs');
const path = require('node:path');
const {buildSync} = require('esbuild');

// Use the actual SQLRooms parser, with a controlled database connection to
// exercise failures and cleanup without downloading a browser WASM runtime.
const parserBundle = buildSync({
  stdin: {
    contents: "export {splitSqlStatements} from '@sqlrooms/duckdb';",
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

function setup({failPreview = false, failDrop = false} = {}) {
  const queries = [];
  let closed = false;
  const table = {numRows: 1};
  const connection = {
    query: async query => {
      queries.push(query);
      if (failPreview && query === 'preview') throw new Error('Preview failed');
      if (failDrop && query.startsWith('DROP')) throw new Error('Cleanup failed');
      return table;
    },
    close: async () => {
      closed = true;
    }
  };
  const deps = {
    '@sqlrooms/duckdb': parser.exports,
    '@kepler.gl/utils': {
      getApplicationConfig: () => ({database: {connect: async () => connection}})
    },
    '@kepler.gl/duckdb': {
      checkIsSelectQuery: async (_connection, query) => /^select/i.test(query),
      getDuckDBColumnTypes: async () => [],
      getDuckDBColumnTypesMap: () => ({}),
      castDuckDBTypesForKepler: () => 'preview',
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
  return {run: module.exports.executeSql, queries, table, isClosed: () => closed};
}

test('runs preceding statements and previews only the last result', async () => {
  const db = setup();
  const result = await db.run('CREATE TABLE test (n INTEGER); SELECT 1;');
  assert.equal(db.queries[0], 'CREATE TABLE test (n INTEGER)');
  assert.equal(result.table, db.table);
  assert.match(db.queries[1], /^CREATE TEMP TABLE/);
  assert.match(db.queries.at(-1), /^DROP TABLE IF EXISTS/);
  assert.equal(db.isClosed(), true);
});

test('preserves SQL literals containing comments and semicolons', async () => {
  const db = setup();
  await db.run("-- comment\nSELECT 'a--b;/*c*/' AS value; /* trailing */");
  assert.match(db.queries[0], /SELECT 'a--b;\/\*c\*\/' AS value$/);
});

test('rejects comment-only input before connecting', async () => {
  const db = setup();
  await assert.rejects(db.run('-- empty\n/* empty */'), /Query is empty/);
  assert.equal(db.queries.length, 0);
});

test('cleans temporary results and closes after a preview failure', async () => {
  const db = setup({failPreview: true});
  await assert.rejects(db.run('SELECT 1'), /Preview failed/);
  assert.match(db.queries.at(-1), /^DROP TABLE IF EXISTS/);
  assert.equal(db.isClosed(), true);
});

test('closes even if temporary table cleanup fails', async () => {
  const db = setup({failDrop: true});
  await assert.rejects(db.run('SELECT 1'), /Cleanup failed/);
  assert.equal(db.isClosed(), true);
});

test('returns no stale preview when the last statement has no result', async () => {
  const db = setup();
  assert.equal(await db.run('SELECT 1; CREATE TABLE test (n INTEGER)'), null);
  assert.equal(db.isClosed(), true);
});
