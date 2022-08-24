import {DataRow, SharedRowOptions} from './data-row';

/**
 * Specifies a range of rows of a data container that should be processed.
 */
export type RangeOptions = {
  start?: number;
  end?: number;
};
export interface DataContainerInterface {
  /**
   * Returns the number of rows in the data container.
   * @returns Number of rows in the data container.
   */
  numRows(): number;

  /**
   * Returns the number of columns in the data container.
   * @returns Number of columns in the data container.
   */
  numColumns(): number;

  /**
   * Returns the value stored at the specified cell in the data container.
   * @param rowIndex Row index.
   * @param columnIndex Column index.
   * @returns Value at the specified cell.
   */
  valueAt(rowIndex: number, columnIndex: number): any;

  /**
   * Returns the row at the specified index.
   * @param rowIndex Row index.
   * @param sharedRow Passed row is filled with contents from the specified index and returned without extra row allocations.
   * @returns A row object.
   */
  row(rowIndex: number, sharedRow?: SharedRowOptions): DataRow;

  /**
   * Returns the specified row of the data container represented as an array.
   * @param rowIndex Row index.
   * @returns The specified row represented as an array.
   */
  rowAsArray(rowIndex: number): any[];

  /**
   * Returns an iterator to sequentially access all rows in the data container.
   * @param sharedRow Indicates that a temporary row object should be used.
   * If enabled, the returned row object is shared between calls
   * and mustn't be stored without cloning.
   * Passed row is filled with contents of the specified row and returned on each iteration.
   * @returns An iterator to sequentially access all rows in the data container.
   */
  rows(sharedRow?: SharedRowOptions): Generator<DataRow, void, any>;

  /**
   * Returns an iterator to sequentially access all values in the specified column of the data container.
   * @param columnIndex Column index.
   * @returns An iterator to all values in the specified column of the data container.
   */
  column(columnIndex: number): Generator<any, void, any>;

  /**
   * Returns contents of the data container as a two-dimensional array.
   * @returns Data.
   */
  flattenData(): any[][];

  /**
   * Generates an array of indices where each index represents a row in the data container.
   * @returns An array of indices.
   */
  getPlainIndex(): number[];

  /**
   * Creates a new array populated with the results of calling the provided callback
   * on every row in the data container.
   * @param func Callback that is called for every row of the data container.
   * The callback is called with the following arguments:
   * - row: The current row being processed in the data container.
   * - index: The index of the current row being processed in the data container.
   * @param sharedRow Truthy value indicates that a shared row object should be used.
   * Make sure the func callback doesn't store the row object in such case,
   * and clone the row in case you need to store it.
   * @param options Specify start and end row indices that should be mapped.
   * @returns A new array with each element being the result of the func callback.
   */
  map(
    func: (row: DataRow, index: number) => any,
    sharedRow?: SharedRowOptions,
    options?: RangeOptions
  ): any[];

  /**
   * Creates a new array populated with the results of calling the provided callback.
   * The callback is called for every row in the dataset, but only {index} object is passed.
   * @param func Callback that is called for every row of the data container.
   * @param options Specify start and end row indices that should be mapped.
   * @returns A new array with each element being the result of the func callback.
   */
  mapIndex(
    func: ({index: number}, dataContainer: DataContainerInterface) => any,
    options?: RangeOptions
  ): any[];

  /**
   * Returns the value of the first row in the provided data container that satisfies the provided testing function.
   * @param func Function to execute on each value in the array.
   * The function is called with the following arguments:
   * - row: The current row being processed in the data container.
   * - index: The index of the current row being processed in the data container.
   * @param sharedRow Truthy value indicates that a shared row object should be used.
   * Make sure the func callback doesn't store the row object in such case,
   * and clone the row in case you need to store it.
   * @returns First matching row or undefined if no rows satisfy the testing function.
   */
  find(
    func: (row: DataRow, index: number) => any,
    sharedRow?: SharedRowOptions
  ): DataRow | undefined;

  /**
   * Executes a reducer function on each element of the data container, resulting in single output value.
   * @param func A function to execute on each row in the data container.
   * The function is called with the following arguments:
   * - acc: The accumulator accumulates func's return values.
   * - row: The current row being processed in the data container.
   * - index: The index of the current row being processed in the data container.
   * @param initialValue A value to use as the first argument to the first call of the func.
   * @param sharedRow Truthy value indicates that a shared row object should be used.
   * Make sure the func callback doesn't store the row object in such case,
   * and clone the row in case you need to store it.
   * @returns The single value that results from the reduction.
   */
  reduce(
    func: (acc: any, row: DataRow, index: number) => any,
    initialValue: any,
    sharedRow?: SharedRowOptions
  ): any;
}
