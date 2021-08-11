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
 * @param {import('./data-row').SharedRowOptions} sharedRow
 */
function* rowsIterator(dataContainer, sharedRow) {
  const numRows = dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    yield dataContainer.row(rowIndex, sharedRow);
  }
}

/**
 * @param {import('./data-container-interface').DataContainerInterface} dataContainer
 * @param {number} columnIndex
 */
function* columnIterator(dataContainer, columnIndex) {
  const numRows = dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    yield dataContainer.valueAt(rowIndex, columnIndex);
  }
}

export class RowDataContainer {
  constructor(data) {
    if (!data.rows) {
      throw Error('RowDataContainer: no rows provided');
    }

    if (!Array.isArray(data.rows)) {
      throw Error("RowDataContainer: rows object isn't an array");
    }

    this._rows = data.rows;
    this._numColumns = data.rows[0]?.length || 0;
  }

  numRows() {
    return this._rows.length;
  }

  numColumns() {
    return this._numColumns;
  }

  valueAt(rowIndex, columnIndex) {
    if (this._rows[rowIndex] === null) {
      return null;
    }
    return this._rows[rowIndex][columnIndex];
  }

  row(rowIndex, sharedRow) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);
    if (tSharedRow) {
      tSharedRow.setSource(this, rowIndex);
      return tSharedRow;
    }

    return new DataRow(this, rowIndex);
  }

  rowAsArray(rowIndex) {
    return this._rows[rowIndex];
  }

  rows(sharedRow) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);
    return rowsIterator(this, tSharedRow);
  }

  column(columnIndex) {
    return columnIterator(this, columnIndex);
  }

  flattenData() {
    return this._rows;
  }

  getPlainIndex(valid) {
    return this._rows.map((_, i) => i);
  }

  map(func, sharedRow, options = {}) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

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
      out.push(func({index: rowIndex}, this));
    }
    return out;
  }

  find(func, sharedRow) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this._rows.length; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      if (func(row, rowIndex)) {
        return row;
      }
    }
    return undefined;
  }

  reduce(func, initialValue, sharedRow) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this._rows.length; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      initialValue = func(initialValue, row, rowIndex);
    }
    return initialValue;
  }
}
