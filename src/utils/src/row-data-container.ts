// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {DataRow, SharedRowOptions} from './data-row';
import {Field} from '@kepler.gl/types';
import {DataContainerInterface, RangeOptions} from './data-container-interface';

type RowDataContainerInput = {
  rows: any[][];
  fields?: Field[];
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
    func: ({index: number}, dc: DataContainerInterface) => T,
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
