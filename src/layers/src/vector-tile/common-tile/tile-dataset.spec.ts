// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Field} from '@kepler.gl/types';
import TileDataset, {Datum} from './tile-dataset';

type Row = Record<string, Datum>;
type Tile = {id: string; rows: Row[]};
const valueField = {name: 'value', fieldIdx: 0, type: 'real'} as Field;
const categoryField = {name: 'category', fieldIdx: 1, type: 'string'} as Field;
const tile = (id: string, values: Datum[]): Tile => ({
  id,
  rows: values.map(value => ({value}))
});

function createDataset(tiles?: Tile[]) {
  const read = jest.fn((field: Field, row: Row) => row[field.name]);
  const dataset = new TileDataset<Tile, Row[]>(
    {
      getTileId: item => item.id,
      getIterable: item => item.rows,
      getRowCount: rows => rows.length,
      getRowValue: () => read
    },
    tiles
  );
  return {dataset, read};
}

describe('TileDataset domains', () => {
  test('empty tiles and null-only fields have usable empty domains', () => {
    const {dataset} = createDataset();
    expect(dataset.getExtent(valueField)).toEqual([0, 0]);
    expect(dataset.getUniqueValues(valueField)).toEqual([]);
    expect(dataset.getQuantileSample(valueField)).toEqual([]);

    dataset.updateTiles([tile('empty', []), tile('nulls', [null, null])]);
    expect(dataset.getExtent(valueField)).toEqual([0, 0]);
    expect(dataset.getQuantileSample(valueField)).toEqual([]);
  });

  test('combines numeric extents across tiles while preserving zero and negatives', () => {
    const {dataset} = createDataset([
      tile('a', [null, 0, 2.5]),
      tile('empty', []),
      tile('b', [-8, 100, null])
    ]);
    expect(dataset.getExtent(valueField)).toEqual([-8, 100]);
    dataset.updateTiles([tile('zero', [0, 0])]);
    expect(dataset.getExtent(valueField)).toEqual([0, 0]);
  });

  test('keeps numeric statistics separate for each field', () => {
    const {dataset} = createDataset([
      {
        id: 'a',
        rows: [
          {value: -2, other: 50},
          {value: 4, other: 100}
        ]
      }
    ]);
    const otherField = {...valueField, name: 'other', fieldIdx: 1};
    expect(dataset.getExtent(valueField)).toEqual([-2, 4]);
    expect(dataset.getExtent(otherField)).toEqual([50, 100]);
    expect(dataset.getExtent(valueField)).toEqual([-2, 4]);
  });

  test('reuses unchanged tile statistics but excludes removed tiles from the domain', () => {
    const first = tile('a', [-10, 2]);
    const retained = tile('b', [4, 8]);
    const {dataset, read} = createDataset([first, retained]);
    expect(dataset.getExtent(valueField)).toEqual([-10, 8]);
    read.mockClear();
    dataset.updateTiles([retained, first]);
    expect(dataset.getExtent(valueField)).toEqual([-10, 8]);
    expect(read).not.toHaveBeenCalled();

    dataset.updateTiles([retained, tile('c', [20])]);
    expect(dataset.getExtent(valueField)).toEqual([4, 20]);
    expect(read).toHaveBeenCalledTimes(1);
    dataset.updateTiles([]);
    expect(dataset.getExtent(valueField)).toEqual([0, 0]);
  });

  test('merges category values without conflating null, zero or numeric-looking strings', () => {
    const {dataset} = createDataset([
      {id: 'a', rows: [{category: 'road'}, {category: 0}, {category: null}]},
      {id: 'b', rows: [{category: 'road'}, {category: '0'}, {category: 'rail'}]}
    ]);
    expect(dataset.getUniqueValues(categoryField)).toEqual(['road', 0, null, '0', 'rail']);
    // The returned array must not expose the cached category set to callers.
    dataset.getUniqueValues(categoryField).push('external');
    expect(dataset.getUniqueValues(categoryField)).not.toContain('external');
  });

  test('cached category domains follow the active tile set and field', () => {
    const a = {id: 'a', rows: [{category: 'road', value: 1}]};
    const b = {id: 'b', rows: [{category: 'rail', value: 2}]};
    const {dataset, read} = createDataset([a, b]);
    expect(dataset.getUniqueValues(categoryField)).toEqual(['road', 'rail']);
    expect(dataset.getUniqueValues(valueField)).toEqual([1, 2]);
    read.mockClear();
    dataset.updateTiles([b]);
    expect(dataset.getUniqueValues(categoryField)).toEqual(['rail']);
    expect(read).not.toHaveBeenCalled();
  });

  test('bounds category collection per tile without dropping categories from later tiles', () => {
    const values = Array.from({length: 25}, (_, index) => `category-${index}`);
    const {dataset} = createDataset([tile('a', values), tile('b', ['later'])]);
    expect(dataset.getUniqueValues(valueField)).toEqual([...values.slice(0, 20), 'later']);
  });
});

describe('TileDataset quantile samples', () => {
  test('sorts small samples numerically, drops nulls and retains repeated nonzero values', () => {
    const source = [10, null, 2, -3, 2];
    const {dataset} = createDataset([tile('a', source)]);
    expect(dataset.getQuantileSample(valueField)).toEqual([-3, 2, 2, 10]);
    expect(source).toEqual([10, null, 2, -3, 2]);
  });

  test('reduces repeated leading zero values without removing the zero endpoint', () => {
    const {dataset} = createDataset([tile('a', [0, null, 0, 4, 0, 2])]);
    expect(dataset.getQuantileSample(valueField)).toEqual([0, 2, 4]);
  });

  test('samples the combined row stream rather than restarting at tile boundaries', () => {
    const {dataset} = createDataset([
      tile('a', [100, 9, 8]),
      tile('empty', []),
      tile('b', [7, 6, 5, 4]),
      tile('c', [3])
    ]);
    // Eight rows and a target of four select rows 2, 4, 6 and 8 globally.
    expect(dataset.getQuantileSample(valueField, 4)).toEqual([3, 5, 7, 9]);
  });

  test('updates the sampling stride and content when the viewport tiles change', () => {
    const {dataset} = createDataset([tile('a', [8, 7, 6, 5, 4, 3, 2, 1])]);
    expect(dataset.getQuantileSample(valueField, 2)).toEqual([1, 5]);
    const visible = [tile('b', [20, 10])];
    dataset.updateTiles(visible);
    expect(dataset.getTiles()).toEqual(visible);
    expect(dataset.getQuantileSample(valueField, 2)).toEqual([10, 20]);
  });
});
