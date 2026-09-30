// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const assert = require('node:assert/strict');
const {test} = require('node:test');
const path = require('node:path');
const {buildSync} = require('esbuild');
const result = buildSync({
  stdin: {
    contents: `export {queryResultToCsv} from './src/components/sql-export';
      export {tableFromArrays} from 'apache-arrow';
      export {csvParseRows} from 'd3-dsv';`,
    resolveDir: path.resolve(__dirname, '..')
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false
});
const loaded = {exports: {}};
new Function('require', 'module', 'exports', result.outputFiles[0].text)(
  require,
  loaded,
  loaded.exports
);
const {queryResultToCsv, tableFromArrays, csvParseRows} = loaded.exports;

test('exports all result rows, including those beyond the visible page', () => {
  const table = tableFromArrays({id: Array.from({length: 205}, (_, i) => i)});
  const rows = csvParseRows(queryResultToCsv(table));
  assert.equal(rows.length, 206);
  assert.deepEqual(rows.at(-1), ['204']);
});

test('preserves CSV quoting, nulls, and timestamps', () => {
  const table = tableFromArrays({
    'quoted,"header': ['comma, quote" and\nnewline', null],
    timestamp: [new Date('2026-09-14T12:34:56Z'), null]
  });
  assert.deepEqual(csvParseRows(queryResultToCsv(table)), [
    ['quoted,"header', 'timestamp'],
    ['comma, quote" and\nnewline', '2026-09-14T12:34:56.000Z'],
    ['', '']
  ]);
});

test('includes headers for an empty result', () => {
  const table = tableFromArrays({id: new Int32Array(0)});
  assert.equal(queryResultToCsv(table), 'id');
});
