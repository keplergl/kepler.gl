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

import {DataContainerInterface, RangeOptions} from './data-container-interface';
import {DataRow, SharedRowOptions} from './data-row';

/**
 * @param dataContainer
 * @param indices
 * @param sharedRow
 * @returns
 */
function* rowsIterator(
  dataContainer: DataContainerInterface,
  indices: number[],
  sharedRow: SharedRowOptions
): Generator<DataRow> {
  const numRows = indices.length;
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    const mappedRowIndex = indices[rowIndex];
    yield dataContainer.row(mappedRowIndex, sharedRow);
  }
}

/**
 * @param dataContainer
 * @param indices
 * @param columnIndex
 * @returns
 */
function* columnIterator(
  dataContainer: DataContainerInterface,
  indices: number[],
  columnIndex: number
): Generator<any> {
  const numRows = indices.length;
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    const mappedRowIndex = indices[rowIndex];
    yield dataContainer.valueAt(mappedRowIndex, columnIndex);
  }
}

/**
 * A data container wrapper around another data container.
 * You have to pass an array of indices to reference rows in the parent data container.
 * For example indices [3, 4, 6, 8] means that IndexedDataContainer is going to have
 * 4 rows and row(2) points to 6th row in the referenced data container.
 */
export class IndexedDataContainer implements DataContainerInterface {
  _parentDataContainer: DataContainerInterface;
  _indices: number[];

  constructor(parentDataContainer: DataContainerInterface, indices: number[]) {
    this._parentDataContainer = parentDataContainer;
    this._indices = indices;
  }

  numRows(): number {
    return this._indices.length;
  }

  numColumns(): number {
    return this._parentDataContainer.numColumns();
  }

  /**
   * Remaps a local index to an index in the parent dataset
   * @param rowIndex
   * @returns number
   */
  _mappedRowIndex(rowIndex: number): number {
    return this._indices[rowIndex];
  }

  valueAt(rowIndex: number, columnIndex: number): any {
    return this._parentDataContainer.valueAt(this._mappedRowIndex(rowIndex), columnIndex);
  }

  row(rowIndex: number, sharedRow?: SharedRowOptions): DataRow {
    return this._parentDataContainer.row(this._mappedRowIndex(rowIndex), sharedRow);
  }

  rowAsArray(rowIndex: number): any[] {
    return this._parentDataContainer.rowAsArray(this._mappedRowIndex(rowIndex));
  }

  rows(sharedRow?: SharedRowOptions) {
    return rowsIterator(this._parentDataContainer, this._indices, sharedRow);
  }

  column(columnIndex: number) {
    return columnIterator(this._parentDataContainer, this._indices, columnIndex);
  }

  getPlainIndex(): number[] {
    return this._indices.map((_, i) => i);
  }

  flattenData(): any[][] {
    const tSharedRow = DataRow.createSharedRow(true);

    return this._indices.map((_, i) => {
      return this.row(i, tSharedRow).values();
    }, this);
  }

  map<T>(
    func: (row: DataRow, index: number) => T,
    sharedRow?: SharedRowOptions,
    options: RangeOptions = {}
  ): T[] {
    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

    const tSharedRow = DataRow.createSharedRow(sharedRow);

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
      out.push(func({index: this._mappedRowIndex(rowIndex)}, this._parentDataContainer));
    }
    return out;
  }

  find(
    func: (row: DataRow, index: number) => boolean,
    sharedRow?: SharedRowOptions
  ): DataRow | undefined {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this.numRows(); ++rowIndex) {
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

    for (let rowIndex = 0; rowIndex < this._indices.length; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      initialValue = func(initialValue, row, rowIndex);
    }
    return initialValue;
  }
}
