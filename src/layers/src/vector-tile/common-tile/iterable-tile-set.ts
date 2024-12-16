// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Custom iterator for data in a set of tiles
 */
class TileSetIterator<T extends Iterable<any>> {
  private tileIterator: Iterator<T extends Iterable<infer V> ? V : never> | null = null;
  private tileIndex = -1;

  constructor(private readonly tiles: readonly T[]) {}

  nextTile() {
    if (this.tileIndex < this.tiles.length - 1) {
      this.tileIndex++;
      this.tileIterator = this.tiles[this.tileIndex][Symbol.iterator]();
    } else {
      this.tileIterator = null;
    }
  }

  next(): IteratorResult<T extends Iterable<infer V> ? V : never> {
    // Startup: Get the iterator for the next tile
    if (this.tileIterator === null) this.nextTile();
    // Finish: We have no more tiles, we're done
    if (this.tileIterator === null) return {done: true, value: null};

    const next = this.tileIterator.next();
    // If we have a value for the current tile, return it
    if (!next.done) {
      return next;
    }

    // Otherwise, go on to the next tile
    this.tileIterator = null;
    return this.next();
  }

  [Symbol.iterator]() {
    return this;
  }
}

export type RowCountAccessor<T> = (tile: T) => number;

/**
 * An iterable object that can iterate over all rows
 * in a set of tiles, treat the set as a single iterable
 */
export default class IterableTileSet<T extends Iterable<any>> {
  rowCount = 0;
  private rowCounts: number[] = [];

  constructor(private readonly tiles: readonly T[], getRowCount: RowCountAccessor<T>) {
    for (const tile of tiles) {
      const count = getRowCount(tile);
      this.rowCount += count;
      this.rowCounts.push(count);
    }
  }

  /**
   * Iterate over all values in the set
   */
  [Symbol.iterator](): Iterator<T extends Iterable<infer V> ? V : never> {
    return new TileSetIterator<T>(this.tiles);
  }
}
