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

import {DataContainerInterface} from './data-container-interface';

/**
 * Setting for shared row optimization.
 * - False/undefined indicates that unique row objects should be used (default).
 * - True indicates that a single temporary row object should be created and used without extra allocations.
 * - A DataRow object indicates that the row should be used as a temporary shared row.
 * When used, the content of the shared row isn't preserved between calls.
 */
export type SharedRowOptions = DataRow | boolean | undefined;

/**
 * Return type for createSharedRow:
 * - DataRow object that should be used as shared row.
 * - Falsy values indicate that shared row object shouldn't be used.
 */
export type SharedRowOptionsResult = DataRow | false | undefined;

export class DataRow {
  _dataContainer: DataContainerInterface | null;

  _rowIndex: number;

  constructor(dataContainer: DataContainerInterface | null, rowIndex: number) {
    this._dataContainer = dataContainer;
    this._rowIndex = rowIndex;
  }

  static createSharedRow(sharedRowDesc: SharedRowOptions): SharedRowOptionsResult {
    if (sharedRowDesc === true) {
      return new DataRow(null, 0);
    }
    return sharedRowDesc;
  }

  valueAt(columnIndex: number): any {
    return this._dataContainer?.valueAt(this._rowIndex, columnIndex);
  }

  values(): any[] {
    return this._dataContainer ? this._dataContainer.rowAsArray(this._rowIndex) : [];
  }

  setSource(dataContainer: DataContainerInterface, rowIndex: number): void {
    this._dataContainer = dataContainer;
    this._rowIndex = rowIndex;
  }

  map(handler: (elem: any, index: number) => any): any[] {
    const numColumns = this._dataContainer?.numColumns() || 0;
    const out: any[] = [];
    for (let column = 0; column < numColumns; ++column) {
      out[column] = handler(this.valueAt(column), column);
    }
    return out;
  }
}
