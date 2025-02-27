// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Field as KeplerField} from '@kepler.gl/types';
import {quickInsertionSort} from '@kepler.gl/utils';

import IterableTileSet, {RowCountAccessor} from './iterable-tile-set';
import {pruneQuantiles} from './tile-utils';

export type Datum = number | string | null;

type RowValueAccessor<T> = (
  field: KeplerField,
  row: T extends Iterable<infer V> ? V : never
) => Datum;
type RowValueAccessorFactory<T> = (
  field?: KeplerField,
  indexKey?: number | null
) => RowValueAccessor<T>;

type TileAccessors<T, I extends Iterable<any> = T extends Iterable<any> ? T : never> = {
  getTileId: (tile: T) => string;
  getIterable: (tile: T) => I;
  getRowCount: RowCountAccessor<I>;
  getRowValue: RowValueAccessorFactory<I>;
};

/**
 * Per-tile stats, for caching
 */
type TileFieldStats = {
  extent?: [number, number];
  sample?: Datum[];
  uniqueValues?: Set<Datum>;
};

/**
 * Stateful class offering dataset-style functions for the set of tiles.
 */
export default class TileDataset<T, I extends Iterable<any> = T extends Iterable<any> ? T : never> {
  private accessors: TileAccessors<T, I>;
  private tiles: readonly T[];
  private tileSet: IterableTileSet<I>;
  private tileIds: Set<string> = new Set();

  /** Cache for per-tile field stats: tileId -> fieldId -> stats */
  private tileStats: Map<string, Map<string, TileFieldStats>> = new Map();

  constructor(accessors: TileAccessors<T, I>, tiles?: readonly T[]) {
    this.accessors = accessors;
    this.tiles = [];
    this.tileSet = new IterableTileSet([], accessors.getRowCount);
    if (tiles) {
      this.updateTiles(tiles);
    }
  }

  /**
   * Invalidate the cached data
   */
  invalidateCache(): void {
    // TODO: implement later
  }

  /**
   * Update the set of tiles in the viewport
   */
  updateTiles(tiles: readonly T[]): void {
    const {getTileId, getIterable, getRowCount} = this.accessors;
    const tileIds = new Set<string>(tiles.map(getTileId));
    if (!areEqualSets(tileIds, this.tileIds)) {
      this.invalidateCache();
    }
    this.tiles = tiles;
    this.tileIds = tileIds;
    this.tileSet = new IterableTileSet(tiles.map(getIterable), getRowCount);
  }

  /**
   * Get the min/max domain of a field
   */
  getExtent(field: KeplerField): [number, number] {
    const {getRowValue, getIterable} = this.accessors;
    const accessor = getRowValue(field);
    let min = Infinity;
    let max = -Infinity;

    for (const tile of this.tiles) {
      // Check the cache
      let extent = this.getTileStat(tile, field, 'extent');
      if (!extent) {
        // Cache miss, calculate and cache
        extent = getTileExtent(getIterable(tile), field, accessor);
        this.setTileStat(tile, field, 'extent', extent);
      }
      if (extent) {
        if (extent[0] < min) min = extent[0];
        if (extent[1] > max) max = extent[1];
      }
    }
    return Number.isFinite(min) && Number.isFinite(max) ? [min, max] : [0, 0];
  }

  /**
   * Get a sample of field values to use in estimating quantiles
   */
  getQuantileSample(field: KeplerField, minRowCount = 1000): number[] {
    // TODO: There should be reasonable per-tile caching possible here
    const set = this.tileSet;
    const accessor = this.accessors.getRowValue(field);
    const sample: number[] = [];
    const sampleStep = Math.max(Math.floor(set.rowCount / minRowCount), 1);
    let i = 0;
    for (const row of set) {
      if (++i === sampleStep) {
        const val = accessor(field, row) as number | null;
        if (val !== null) sample.push(val);
        i = 0;
      }
    }
    quickInsertionSort(sample);
    pruneQuantiles(sample);
    return sample;
  }

  /**
   * Get a set of unique values for a field
   */
  getUniqueValues(field: KeplerField): Datum[] {
    const {getRowValue, getIterable} = this.accessors;
    const accessor = getRowValue(field);
    const uniques = new Set<Datum>();

    for (const tile of this.tiles) {
      // Check the cache
      let tileUniques = this.getTileStat(tile, field, 'uniqueValues');
      if (!tileUniques) {
        // Cache miss, calculate and cache
        tileUniques = getTileUniqueValues(getIterable(tile), field, accessor);
        this.setTileStat(tile, field, 'uniqueValues', tileUniques);
      }
      for (const val of tileUniques ?? []) {
        uniques.add(val);
      }
    }
    return [...uniques];
  }

  private getTileStat<K extends keyof TileFieldStats>(
    tile: T,
    field: KeplerField,
    stat: K
  ): TileFieldStats[K] {
    return this.tileStats.get(this.accessors.getTileId(tile))?.get(field.name)?.[stat];
  }

  private setTileStat<K extends keyof TileFieldStats>(
    tile: T,
    field: KeplerField,
    stat: K,
    value: TileFieldStats[K]
  ): void {
    const tileId = this.accessors.getTileId(tile);
    const tileStats = this.tileStats.get(tileId) ?? new Map();
    const tileFieldStats = tileStats.get(field.name) ?? {};
    tileFieldStats[stat] = value;
    tileStats.set(field.name, tileFieldStats);
    this.tileStats.set(tileId, tileStats);
  }
}

/**
 * Get the min/max domain of a field in a given tile
 */
function getTileExtent<I extends Iterable<any>>(
  iterable: I,
  field: KeplerField,
  accessor: RowValueAccessor<I>
): [number, number] | undefined {
  let min = Infinity;
  let max = -Infinity;
  for (const row of iterable) {
    const val = accessor(field, row) as number | null;
    if (val === null) continue;
    if (val < min) min = val;
    if (val > max) max = val;
  }
  return Number.isFinite(min) && Number.isFinite(max) ? [min, max] : undefined;
}

/**
 * Get unique values for a field in a given tile
 */
function getTileUniqueValues<I extends Iterable<any>>(
  iterable: I,
  field: KeplerField,
  accessor: RowValueAccessor<I>,
  maxUniques = 20
): Set<Datum> {
  const uniques = new Set<Datum>();
  for (const row of iterable) {
    if (uniques.size >= maxUniques) return uniques;
    uniques.add(accessor(field, row));
  }
  return uniques;
}

function areEqualSets(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const val of a) {
    if (!b.has(val)) {
      return false;
    }
  }
  return true;
}
