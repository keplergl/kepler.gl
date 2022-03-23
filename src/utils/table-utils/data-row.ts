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

  /**
   * Creates new DataRow.
   * @param dataContainer Data container where data is stored. Can be initialized with null for shared rows.
   * @param rowIndex Index of a row in the data container.
   */
  constructor(dataContainer: DataContainerInterface | null, rowIndex: number) {
    this._dataContainer = dataContainer;
    this._rowIndex = rowIndex;
  }

  /**
   * Conditionally creates a DataRow object.
   * @param sharedRowDesc Accepts forllowing options:
   * - true indicates that new DataRow should be created.
   * - falsy value or a DataRow object is passed through without any change.
   * @returns A new DataRow object or unchanged input argument.
   */
  static createSharedRow(sharedRowDesc: SharedRowOptions): SharedRowOptionsResult {
    if (sharedRowDesc === true) {
      return new DataRow(null, 0);
    }
    return sharedRowDesc;
  }

  /**
   * Returns the value stored at the specified index in the row.
   * @param columnIndex Index of the requested field in the row.
   * @returns Value at the index.
   */
  valueAt(columnIndex: number): any {
    return this._dataContainer?.valueAt(this._rowIndex, columnIndex);
  }

  /**
   * Returns the row represented as an array.
   * @returns The row represented as an array.
   */
  values(): any[] {
    return this._dataContainer ? this._dataContainer.rowAsArray(this._rowIndex) : [];
  }

  /**
   * Setup a row object. The method is used by shared rows to prevent excessive allocations.
   * @param dataContainer Data container.
   * @param rowIndex Index of a row in the data container.
   */
  setSource(dataContainer: DataContainerInterface, rowIndex: number): void {
    this._dataContainer = dataContainer;
    this._rowIndex = rowIndex;
  }

  /**
   * Creates a new array populated with the results of calling the provided function
   * on every element of the row.
   * @param handler The callback is called with the following arguments:
   * - elem: The current element being processed in the row.
   * - index: The index of the current element being processed in the row.
   * @returns A new array with each element being the result of the func callback.
   */
  map(handler: (elem: any, index: number) => any): any[] {
    const numColumns = this._dataContainer?.numColumns() || 0;
    const out: any[] = [];
    for (let column = 0; column < numColumns; ++column) {
      out[column] = handler(this.valueAt(column), column);
    }
    return out;
  }
}
