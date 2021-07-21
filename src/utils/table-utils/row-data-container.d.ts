import {ProcessorResult} from 'processors/data-processor';
import {Field} from './kepler-table';
import {DataContainerInterface, RangeOptions} from './data-container-interface';
import {DataRow, SharedRowOptions} from './data-row';

type RowDataContainerInput = {
  rows: any[][],
  fields?: Field[]
}

/**
 * A data container where all data is stored internally as a 2D array.
 */
export class RowDataContainer implements DataContainerInterface {
  constructor(data: RowDataContainerInput);

  numRows(): number;
  numColumns(): number;
  valueAt(rowIndex: number, columnIndex: number): any;
  row(rowIndex: number, sharedRow?: SharedRowOptions): DataRow;
  rowAsArray(rowIndex: number): any[];
  rows(sharedRow?: SharedRowOptions): Generator<DataRow, void, any>;
  column(columnIndex: number): Generator<any, void, any>;
  flattenData(): any[][];
  getPlainIndex(): number[];
  map(func: (row: DataRow, index: number) => any, sharedRow?: SharedRowOptions, options?: RangeOptions): any[];
  mapIndex(func: ({index: number}, dc: DataContainerInterface) => any, options?: RangeOptions): any[];
  find(func: (row: DataRow, index: number) => any, sharedRow?: SharedRowOptions): DataRow | undefined;
  reduce(func: (acc: any, row: DataRow, index: number) => any, initialValue: any, sharedRow?: SharedRowOptions): any;
}
