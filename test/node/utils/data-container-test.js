// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {createDataContainer, createIndexedDataContainer} from '@kepler.gl/utils';

const data = [
  [10, 20], // 0
  [30, 40], // 1
  [50, 60], // 2
  [80, 90], // 3
  [100, 110], // 4
  [120, 130] // 5
];

const indices = [1, 3, 5];

test('RowDataContainer', t => {
  const dc = createDataContainer(data);

  t.deepEqual(dc.numRows(), 6, `RowDataContainer should have expected number of rows`);
  t.deepEqual(dc.numColumns(), 2, `RowDataContainer should have expected number of columns`);
  t.deepEqual(dc.valueAt(2, 1), 60, `RowDataContainer.valueAt should return expected value`);
  t.deepEqual(dc.row(2).valueAt(1), 60, `RowDataContainer.row should return expected value`);
  t.deepEqual(
    dc.rowAsArray(2),
    [50, 60],
    `RowDataContainer.rowAsArray should return expected value`
  );
  t.deepEqual(dc.flattenData(), data, `RowDataContainer.flattenData should return expected data`);
  t.deepEqual(
    dc.getPlainIndex(),
    [0, 1, 2, 3, 4, 5],
    `RowDataContainer.getPlainIndex should return expected indices`
  );

  t.deepEqual(
    dc.map(row => row.valueAt(1)),
    [20, 40, 60, 90, 110, 130],
    `RowDataContainer.map should return expected array`
  );

  t.deepEqual(
    dc.mapIndex(d => d),
    [{index: 0}, {index: 1}, {index: 2}, {index: 3}, {index: 4}, {index: 5}],
    `RowDataContainer.mapIndex should return expected array`
  );

  t.deepEqual(
    dc.find(row => {
      return row.valueAt(1) === 60;
    }),
    dc.row(2),
    `RowDataContainer.find should return expected row`
  );

  t.deepEqual(
    dc.reduce((acc, row) => {
      return acc + row.valueAt(1);
    }, 10),
    460,
    `RowDataContainer.reduce should return expected value`
  );

  t.end();
});

test('IndexedDataContainer', t => {
  const dc = createIndexedDataContainer(createDataContainer(data), indices);

  t.deepEqual(dc.numRows(), 3, `IndexedDataContainer should have expected number of rows`);
  t.deepEqual(dc.numColumns(), 2, `IndexedDataContainer should have expected number of columns`);
  t.deepEqual(dc.valueAt(2, 1), 130, `IndexedDataContainer.valueAt should return expected value`);
  t.deepEqual(dc.row(2).valueAt(1), 130, `IndexedDataContainer.row should return expected value`);
  t.deepEqual(
    dc.rowAsArray(2),
    [120, 130],
    `IndexedDataContainer.rowAsArray should return expected value`
  );

  t.deepEqual(
    dc.flattenData(),
    [data[indices[0]], data[indices[1]], data[indices[2]]],
    `IndexedDataContainer.flattenData should return expected data`
  );
  t.deepEqual(
    dc.getPlainIndex(),
    [0, 1, 2],
    `IndexedDataContainer.getPlainIndex should return expected indices`
  );

  t.deepEqual(
    dc.map(row => row.valueAt(1)),
    [40, 90, 130],
    `IndexedDataContainer.map should return expected array`
  );

  t.deepEqual(
    dc.mapIndex(d => d),
    [{index: 1}, {index: 3}, {index: 5}],
    `IndexedDataContainer.mapIndex should return expected array`
  );

  t.deepEqual(
    dc.find(row => {
      return row.valueAt(1) === 90;
    }),
    dc.row(1),
    `IndexedDataContainer.find should return expected row`
  );

  t.deepEqual(
    dc.reduce((acc, row) => {
      return acc + row.valueAt(1);
    }, 10),
    270,
    `RowDataContainer.reduce should return expected value`
  );

  t.end();
});
