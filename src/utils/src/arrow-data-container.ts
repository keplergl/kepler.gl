// MIT license, Copyright (c) 2023 Uber Technologies, Inc.

import * as arrow from 'apache-arrow';
import {DataRow, SharedRowOptions} from './data-row';
import {DataContainerInterface, RangeOptions} from './data-container-interface';
import {Field} from '@kepler.gl/types';

type ArrowDataContainerInput = {
  cols: arrow.Vector[];
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
 * A data container where all data is stored in raw Arrow table
 */
export class ArrowDataContainer implements DataContainerInterface {
  _cols: arrow.Vector[];
  _numColumns: number;
  _numRows: number;
  _fields: Field[];
  // cache column data to make valueAt() faster
  // _colData: any[][];

  constructor(data: ArrowDataContainerInput) {
    if (!data.cols) {
      throw Error('ArrowDataContainer: no columns provided');
    }

    if (!Array.isArray(data.cols)) {
      throw Error("ArrowDataContainer: columns object isn't an array");
    }

    this._cols = data.cols;
    this._numColumns = data.cols.length;
    this._numRows = data.cols[0].length;
    this._fields = data.fields || [];

    // this._colData = data.cols.map(c => c.toArray());
  }

  numRows(): number {
    return this._numRows;
  }

  numColumns(): number {
    return this._numColumns;
  }

  valueAt(rowIndex: number, columnIndex: number): any {
    // return this._colData[columnIndex][rowIndex];
    return this._cols[columnIndex].get(rowIndex);
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
    // return this._colData.map(col => col[rowIndex]);
    return this._cols.map(col => col.get(rowIndex));
  }

  rows(sharedRow: SharedRowOptions) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);
    return rowsIterator(this, tSharedRow);
  }

  column(columnIndex: number) {
    return columnIterator(this, columnIndex);
  }

  getColumn(columnIndex: number): arrow.Vector {
    return this._cols[columnIndex];
  }

  getField(columnIndex: number): Field {
    return this._fields[columnIndex];
  }

  flattenData(): any[][] {
    const data: any[][] = [];
    for (let i = 0; i < this._numRows; ++i) {
      data.push(this.rowAsArray(i));
    }
    return data;
  }

  getPlainIndex(): number[] {
    return [...Array(this._numRows).keys()];
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

  mapIndex<T>(func: ({index}, dc: DataContainerInterface) => T, options: RangeOptions = {}): T[] {
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

    for (let rowIndex = 0; rowIndex < this._numRows; ++rowIndex) {
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

    for (let rowIndex = 0; rowIndex < this._numRows; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      initialValue = func(initialValue, row, rowIndex);
    }
    return initialValue;
  }
}
