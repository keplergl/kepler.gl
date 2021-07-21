import {DataContainerInterface} from './data-container-interface';
import {DataRow, SharedRowOptions} from './data-row';

/**
 * A data container wrapper around another data container.
 * You have to pass an array of indices to reference rows in the parent data container.
 * For example indices [3, 4, 6, 8] means that IndexedDataContainer is going to have
 * 4 rows and row(2) points to 6th row in the referenced data container.
 */
export class IndexedDataContainer implements DataContainerInterface {
  constructor(parentDataContainer: DataContainerInterface, indices: number[]);

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
