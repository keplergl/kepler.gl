// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DataRow, SharedRowOptions} from './data-row';
import {ProtoDatasetField} from '@kepler.gl/types';
import {DataContainerInterface, RangeOptions} from './data-container-interface';

type RowDataContainerInput = {
  rows: any[][];
  fields?: ProtoDatasetField[];
};

/**
 * @param dataContainer
 * @param sharedRow
 */
function* rowsIterator(dataContainer: DataContainerInterface, sharedRow: SharedRowOptions) {
  const numRows = dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    yield dataContainer.row(rowIndex, sharedRow);
  }
}

/**
 * @param dataContainer
 * @param columnIndex
 */
function* columnIterator(dataContainer: DataContainerInterface, columnIndex: number) {
  const numRows = dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    yield dataContainer.valueAt(rowIndex, columnIndex);
  }
}

/**
 * A data container where all data is stored internally as a 2D array.
 */
export class RowDataContainer implements DataContainerInterface {
  _rows: any[][];
  _numColumns: number;

  constructor(data: RowDataContainerInput) {
    if (!data.rows) {
      throw Error('RowDataContainer: no rows provided');
    }

    if (!Array.isArray(data.rows)) {
      throw Error("RowDataContainer: rows object isn't an array");
    }

    this._rows = data.rows;
    this._numColumns = data.rows[0]?.length || 0;
  }

  /**
   * Replace all rows. Callers pass the full snapshot (same contract as ArrowDataContainer).
   */
  update(updateData: any[]): void {
    if (!Array.isArray(updateData)) {
      throw Error("RowDataContainer.update: rows object isn't an array");
    }
    this._rows = updateData;
    this._numColumns = updateData[0]?.length || 0;
  }

  /**
   * Append rows without copying the existing table. Rejects the whole batch when
   * any row is not an array of the current column count (empty tables take the
   * width from the first row).
   */
  append(rows: any[][]): boolean {
    if (!Array.isArray(rows) || !rows.length) {
      return false;
    }

    const expected = this._numColumns || (Array.isArray(rows[0]) ? rows[0].length : 0);
    if (!expected) {
      return false;
    }
    for (let i = 0; i < rows.length; i++) {
      if (!Array.isArray(rows[i]) || rows[i].length !== expected) {
        return false;
      }
    }

    this._rows.push(...rows);
    this._numColumns = expected;
    return true;
  }

  /**
   * Overwrite one row. Rejects an out-of-range index or a row of the wrong width.
   */
  replace(index: number, row: any[]): boolean {
    if (!Number.isInteger(index) || index < 0 || index >= this._rows.length) {
      return false;
    }
    if (!Array.isArray(row) || row.length !== this._numColumns) {
      return false;
    }
    this._rows[index] = row;
    return true;
  }

  /**
   * Drop unique valid indexes in one rebuild. Any out-of-range or non-integer
   * index rejects the whole call so callers can no-op instead of shifting twice.
   */
  remove(indexes: number[]): boolean {
    if (!Array.isArray(indexes) || !indexes.length) {
      return false;
    }

    const numRows = this._rows.length;
    const toRemove = new Set<number>();
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i];
      if (!Number.isInteger(index) || index < 0 || index >= numRows) {
        return false;
      }
      toRemove.add(index);
    }

    this._rows = this._rows.filter((_, rowIndex) => !toRemove.has(rowIndex));
    return true;
  }

  numRows(): number {
    return this._rows.length;
  }

  numColumns(): number {
    return this._numColumns;
  }

  valueAt(rowIndex: number, columnIndex: number): any {
    if (this._rows[rowIndex] === null) {
      return null;
    }
    return this._rows[rowIndex][columnIndex];
  }

  row(rowIndex: number, sharedRow?: SharedRowOptions): DataRow {
    const tSharedRow = DataRow.createSharedRow(sharedRow);
    if (tSharedRow) {
      tSharedRow.setSource(this, rowIndex);
      return tSharedRow;
    }

    return new DataRow(this, rowIndex);
  }

  rowAsArray(rowIndex: number): any[] {
    return this._rows[rowIndex];
  }

  rows(sharedRow: SharedRowOptions) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);
    return rowsIterator(this, tSharedRow);
  }

  column(columnIndex: number) {
    return columnIterator(this, columnIndex);
  }

  flattenData(): any[][] {
    return this._rows;
  }

  getPlainIndex(): number[] {
    return this._rows.map((_, i) => i);
  }

  map<T>(
    func: (row: DataRow, index: number) => T,
    sharedRow?: SharedRowOptions,
    options: RangeOptions = {}
  ): T[] {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

    const out: T[] = [];
    for (let rowIndex = start; rowIndex < endRow; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      out.push(func(row, rowIndex));
    }
    return out;
  }

  mapIndex<T>(
    func: ({index}: {index: number}, dc: DataContainerInterface) => T,
    options: RangeOptions = {}
  ): T[] {
    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

    const out: T[] = [];
    for (let rowIndex = start; rowIndex < endRow; ++rowIndex) {
      out.push(func({index: rowIndex}, this));
    }
    return out;
  }

  find(
    func: (row: DataRow, index: number) => boolean,
    sharedRow?: SharedRowOptions
  ): DataRow | undefined {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this._rows.length; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      if (func(row, rowIndex)) {
        return row;
      }
    }
    return undefined;
  }

  reduce<T>(
    func: (acc: T, row: DataRow, index: number) => T,
    initialValue: T,
    sharedRow?: SharedRowOptions
  ): T {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this._rows.length; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      initialValue = func(initialValue, row, rowIndex);
    }
    return initialValue;
  }
}
