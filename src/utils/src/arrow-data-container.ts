// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {console as globalConsole} from 'global/window';
import {DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';
import {Field} from '@kepler.gl/types';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

import {DataRow, SharedRowOptions} from './data-row';
import {DataContainerInterface, RangeOptions} from './data-container-interface';

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
  _numChunks: number;
  // cache column data to make valueAt() faster
  // _colData: any[][];

  /** An arrow table recreated from vectors */
  _arrowTable: arrow.Table;

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
    this._numChunks = data.cols[0].data.length;
    // this._colData = data.cols.map(c => c.toArray());

    this._arrowTable = this._createTable();
  }

  /**
   * Restores internal Arrow table from vectors.
   * TODO: consider using original arrow table, as it could contain extra metadata, not passed to the fields.
   */
  private _createTable() {
    const creaOpts = {};
    this._fields.map((field, index) => {
      creaOpts[field.name] = this._cols[index];
    });
    return new arrow.Table(creaOpts);
  }

  getTable() {
    return this._arrowTable;
  }

  update(updateData: arrow.Vector<any>[]) {
    this._cols = updateData;
    this._numColumns = this._cols.length;
    this._numRows = this._cols[0].length;
    this._numChunks = this._cols[0].data.length;

    this._arrowTable = this._createTable();

    // cache column data to make valueAt() faster
    // this._colData = this._cols.map(c => c.toArray());
  }

  numChunks(): number {
    return this._numChunks;
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

/**
 * Convert arrow data type to kepler.gl field types
 *
 * @param arrowType the arrow data type
 * @returns corresponding type in `ALL_FIELD_TYPES`
 */
export function arrowDataTypeToFieldType(arrowType: arrow.DataType): string {
  // Note: this function doesn't return ALL_FIELD_TYPES.geojson or ALL_FIELD_TYPES.array, which
  // should be further detected by caller
  if (arrow.DataType.isDate(arrowType)) {
    return ALL_FIELD_TYPES.date;
  } else if (arrow.DataType.isTimestamp(arrowType) || arrow.DataType.isTime(arrowType)) {
    return ALL_FIELD_TYPES.timestamp;
  } else if (arrow.DataType.isFloat(arrowType)) {
    return ALL_FIELD_TYPES.real;
  } else if (arrow.DataType.isInt(arrowType)) {
    return ALL_FIELD_TYPES.integer;
  } else if (arrow.DataType.isBool(arrowType)) {
    return ALL_FIELD_TYPES.boolean;
  } else if (arrow.DataType.isUtf8(arrowType) || arrow.DataType.isNull(arrowType)) {
    return ALL_FIELD_TYPES.string;
  } else if (
    arrow.DataType.isBinary(arrowType) ||
    arrow.DataType.isDictionary(arrowType) ||
    arrow.DataType.isFixedSizeBinary(arrowType) ||
    arrow.DataType.isFixedSizeList(arrowType) ||
    arrow.DataType.isList(arrowType) ||
    arrow.DataType.isMap(arrowType) ||
    arrow.DataType.isStruct(arrowType)
  ) {
    return ALL_FIELD_TYPES.object;
  }
  globalConsole.warn(`Unsupported arrow type: ${arrowType}`);
  return ALL_FIELD_TYPES.string;
}

/**
 * Convert arrow data type to analyzer type
 *
 * @param arrowType the arrow data type
 * @returns corresponding type in `AnalyzerDATA_TYPES`
 */
export function arrowDataTypeToAnalyzerDataType(
  arrowType: arrow.DataType
): typeof AnalyzerDATA_TYPES {
  if (arrow.DataType.isDate(arrowType)) {
    return AnalyzerDATA_TYPES.DATE;
  } else if (arrow.DataType.isTimestamp(arrowType) || arrow.DataType.isTime(arrowType)) {
    return AnalyzerDATA_TYPES.DATETIME;
  } else if (arrow.DataType.isFloat(arrowType)) {
    return AnalyzerDATA_TYPES.FLOAT;
  } else if (arrow.DataType.isInt(arrowType)) {
    return AnalyzerDATA_TYPES.INT;
  } else if (arrow.DataType.isBool(arrowType)) {
    return AnalyzerDATA_TYPES.BOOLEAN;
  } else if (arrow.DataType.isUtf8(arrowType) || arrow.DataType.isNull(arrowType)) {
    return AnalyzerDATA_TYPES.STRING;
  } else if (
    arrow.DataType.isBinary(arrowType) ||
    arrow.DataType.isDictionary(arrowType) ||
    arrow.DataType.isFixedSizeBinary(arrowType) ||
    arrow.DataType.isFixedSizeList(arrowType) ||
    arrow.DataType.isList(arrowType) ||
    arrow.DataType.isMap(arrowType) ||
    arrow.DataType.isStruct(arrowType)
  ) {
    return AnalyzerDATA_TYPES.OBJECT;
  }
  globalConsole.warn(`Unsupported arrow type: ${arrowType}`);
  return AnalyzerDATA_TYPES.STRING;
}
