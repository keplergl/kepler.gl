// Copyright (c) 2021 Uber Technologies, Inc.
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

import {DataRow} from './data-row';

/**
 * @param {import('./data-container-interface').DataContainerInterface} dataContainer
 * @param {number[]} indices
 * @param {import('./data-row').SharedRowOptions} sharedRow
 * @returns {Generator<DataRow, void, unknown>}
 */
function* rowsIterator(dataContainer, indices, sharedRow) {
  const numRows = indices.length;
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    const mappedRowIndex = indices[rowIndex];
    yield dataContainer.row(mappedRowIndex, sharedRow);
  }
}

/**
 * @param {import('./data-container-interface').DataContainerInterface} dataContainer
 * @param {number[]} indices
 * @param {number} columnIndex
 * @returns {Generator<any, void, unknown>}
 */
function* columnIterator(dataContainer, indices, columnIndex) {
  const numRows = indices.length;
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    const mappedRowIndex = indices[rowIndex];
    yield dataContainer.valueAt(mappedRowIndex, columnIndex);
  }
}

export class IndexedDataContainer {
  constructor(parentDataContainer, indices) {
    this._parentDataContainer = parentDataContainer;
    this._indices = indices;
  }

  numRows() {
    return this._indices.length;
  }

  numColumns() {
    return this._parentDataContainer.numColumns();
  }

  /**
   * Remaps a local index to an index in the parent dataset
   * @param {number} rowIndex
   * @returns number
   */
  _mappedRowIndex(rowIndex) {
    return this._indices[rowIndex];
  }

  valueAt(rowIndex, columnIndex) {
    return this._parentDataContainer.valueAt(this._mappedRowIndex(rowIndex), columnIndex);
  }

  row(rowIndex, sharedRow) {
    return this._parentDataContainer.row(this._mappedRowIndex(rowIndex), sharedRow);
  }

  rowAsArray(rowIndex) {
    return this._parentDataContainer.rowAsArray(this._mappedRowIndex(rowIndex));
  }

  rows(sharedRow) {
    return rowsIterator(this._parentDataContainer, this._indices, sharedRow);
  }

  column(columnIndex) {
    return columnIterator(this._parentDataContainer, this._indices, columnIndex);
  }

  getPlainIndex() {
    return this._indices.map((_, i) => i);
  }

  flattenData() {
    const tSharedRow = DataRow.createSharedRow(true);

    return this._indices.map((_, i) => {
      return this.row(i, tSharedRow).values();
    }, this);
  }

  map(func, sharedRow, options = {}) {
    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

    const tSharedRow = DataRow.createSharedRow(sharedRow);

    const out = [];
    for (let rowIndex = start; rowIndex < endRow; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      out.push(func(row, rowIndex));
    }
    return out;
  }

  mapIndex(func, options = {}) {
    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

    const out = [];
    for (let rowIndex = start; rowIndex < endRow; ++rowIndex) {
      out.push(func({index: this._mappedRowIndex(rowIndex)}, this._parentDataContainer));
    }
    return out;
  }

  find(func, sharedRow) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this.numRows(); ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      if (func(row, rowIndex)) {
        return row;
      }
    }
    return undefined;
  }

  reduce(func, initialValue, sharedRow) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this._indices.length; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      initialValue = func(initialValue, row, rowIndex);
    }
    return initialValue;
  }
}
