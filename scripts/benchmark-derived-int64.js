// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Run on either revision with the same Node version and dependencies:
// BENCH_ROWS=100000 BENCH_REPEATS=7 NODE_ENV=debug node --expose-gc -r ./babel-register.js ./scripts/benchmark-derived-int64.js
// JSON output reports medians/ranges and retained heap deltas, not peak memory.
// Run serially on an otherwise idle machine. These are measurements, not timing tests.
const {performance} = require('node:perf_hooks');
const {Int64, Table, vectorFromArray} = require('apache-arrow');
const {KeplerTable, copyTable, joinDatasets} = require('@kepler.gl/table');
const {datasetSchema, VERSIONS} = require('@kepler.gl/schemas');
const {getDefaultFilter} = require('@kepler.gl/utils');

const count = Number(process.env.BENCH_ROWS || 100000);
const repeats = Number(process.env.BENCH_REPEATS || 7);
let retained;

function measure(fn) {
  try {
    for (let i = 0; i < 3; i++) retained = fn();
    const times = [];
    for (let i = 0; i < repeats; i++) {
      retained = undefined;
      global.gc?.();
      const start = performance.now();
      retained = fn();
      times.push(performance.now() - start);
    }
    retained = undefined;
    global.gc?.();
    const before = process.memoryUsage().heapUsed;
    retained = fn();
    global.gc?.();
    const retainedMiB = (process.memoryUsage().heapUsed - before) / 1024 / 1024;
    const sorted = [...times].sort((a, b) => a - b);
    return {
      resultType: typeof retained,
      resultLength: Array.isArray(retained) ? retained.length : undefined,
      medianMs: sorted[Math.floor(sorted.length / 2)],
      minMs: sorted[0],
      maxMs: sorted[sorted.length - 1],
      retainedMiB
    };
  } catch (error) {
    return {error: error.message};
  } finally {
    retained = undefined;
  }
}

function rowTable(id, fields, rows, metadata) {
  return new KeplerTable({info: {id, label: id}, color: [0, 0, 0], metadata}).updateSchema({
    fields,
    rows
  });
}

const fields = [
  {name: 'key', type: 'integer', analyzerType: 'INT'},
  {name: 'value', type: 'integer', analyzerType: 'INT'},
  {name: 'label', type: 'string', analyzerType: 'STRING'},
  {name: 'weight', type: 'real', analyzerType: 'FLOAT'}
];
const results = [];
for (const kind of ['ordinary', 'derived-number', 'derived-int64', 'derived-unsafe-int64']) {
  const big = kind.includes('int64');
  const keys = Array.from({length: count}, (_, i) => i);
  const values = keys.map(i =>
    i % 10 === 0 ? null : big ? BigInt(i) + (kind.includes('unsafe') ? 9007199254740992n : 0n) : i
  );
  const rows = keys.map((key, i) => [key, values[i], `group-${i % 100}`, (i % 100) / 100]);
  let left = rowTable('left', fields, rows);
  if (big) {
    const cols = [
      vectorFromArray(keys),
      vectorFromArray(values, new Int64()),
      vectorFromArray(rows.map(row => row[2])),
      vectorFromArray(rows.map(row => row[3]))
    ];
    left = new KeplerTable({info: {id: 'left'}, color: [0, 0, 0]}).updateSchema({
      fields,
      rows: [],
      cols,
      arrowTable: new Table(Object.fromEntries(fields.map((field, i) => [field.name, cols[i]])))
    });
  }
  const right = rowTable(
    'right',
    fields.slice(0, 1),
    keys.map(key => [key])
  );
  const config = {leftField: 'key', rightField: 'key', type: 'LEFT'};
  const join = measure(() => joinDatasets(left, right, config));
  const proto = joinDatasets(left, right, config);
  const metadata = kind === 'ordinary' ? undefined : proto.metadata;
  const create = () => rowTable('result', proto.data.fields, proto.data.rows, metadata);
  const creation = measure(create);
  const dataset = create();
  const field = dataset.fields[1];
  const access = measure(() => {
    let checksum = 0;
    // Normalize the baseline's raw BigInts too, so every read contributes to
    // the same checksum. This measures access plus checksum, not an isolated call.
    for (let index = 0; index < count; index++)
      checksum += Number(field.valueAccessor({index}) ?? 0);
    return checksum;
  });
  const domain = measure(() => dataset.getColumnFilterDomain(field));
  const offset = kind.includes('unsafe') ? 9007199254740992 : 0;
  const filter = {
    ...getDefaultFilter({dataId: dataset.id, id: 'benchmark'}),
    type: 'range',
    name: ['value'],
    fieldIdx: [1],
    domain: [offset, offset + count],
    value: [offset, offset + Math.floor(count / 2)],
    gpu: false
  };
  // The original table is never filtered: every copy has an empty filterRecord.
  // Supply a range even on baseline, where automatic filter creation throws.
  // Its finite-number predicate rejects raw BigInts; resultLength exposes that
  // unsupported path rather than implying an equivalent successful baseline.
  const cpuFilter = measure(() => copyTable(dataset).filterTable([filter], []).filteredIndex);
  const schemaSave = measure(() => datasetSchema[VERSIONS.v1].save(dataset));
  const jsonSave = measure(() => JSON.stringify(datasetSchema[VERSIONS.v1].save(dataset)));
  results.push({kind, join, creation, access, domain, cpuFilter, schemaSave, jsonSave});
}
process.stdout.write(
  `${JSON.stringify(
    {
      node: process.version,
      rows: count,
      columns: 5,
      repeats,
      warmups: 3,
      gc: Boolean(global.gc),
      results
    },
    null,
    2
  )}\n`
);
