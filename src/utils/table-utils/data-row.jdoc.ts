// TODO: Move JDoc to correct place
// @ts-nocheck
import {DataContainerInterface} from './data-container-interface';

export class DataRow {
  /**
   * Creates new DataRow.
   * @param dataContainer Data container where data is stored. Can be initialized with null for shared rows.
   * @param rowIndex Index of a row in the data container.
   */
  constructor(dataContainer: DataContainerInterface | null, rowIndex: number);

  /**
   * Conditionally creates a DataRow object.
   * @param sharedRowDesc Accepts forllowing options:
   * - true indicates that new DataRow should be created.
   * - falsy value or a DataRow object is passed through without any change.
   * @returns A new DataRow object or unchanged input argument.
   */
  static createSharedRow(sharedRowDesc: SharedRowOptions): SharedRowOptionsResult;

  /**
   * Returns the value stored at the specified index in the row.
   * @param index Index of the requested field in the row.
   * @returns Value at the index.
   */
  valueAt(index: number): any;

  /**
   * Returns the row represented as an array.
   * @returns The row represented as an array.
   */
  values(): any[];

  /**
   * Setup a row object. The method is used by shared rows to prevent excessive allocations.
   * @param dataContainer Data container.
   * @param rowIndex Index of a row in the data container.
   */
  setSource(dataContainer: DataContainerInterface, rowIndex: number): void;

  /**
   * Creates a new array populated with the results of calling the provided function
   * on every element of the row.
   * @param func The callback is called with the following arguments:
   * - elem: The current element being processed in the row.
   * - index: The index of the current element being processed in the row.
   * @returns A new array with each element being the result of the func callback.
   */
  map(func: (elem: any, index: number) => any): any[];
}
