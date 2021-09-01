import {Field} from './kepler-table';
import {DataContainerInterface} from './data-container-interface';

type DataForm = {
  ROWS_ARRAY: string;
};

export type DataContainerOptions = {
  inputDataFormat?: string; // one of DataForm
  fields?: Field[];
};

/**
 * Creates a data container wrapper for the data.
 * @param data Data.
 * @param options Options.
 * @returns A data container object which is based on data and options.
 */
export function createDataContainer(
  data: any[],
  options?: DataContainerOptions
): DataContainerInterface;

/**
 * Creates a data container wrapper around another data container.
 * @param dataContainer Parent data container.
 * @param indices An array of row indices in the parent data container.
 */
export function createIndexedDataContainer(
  dataContainer: DataContainerInterface,
  indices: number[]
): DataContainerInterface;

/**
 * Get a sample of rows from a data container.
 * @param dataContainer Data container to get samples from.
 * @param sampleSize Max number of samples.
 * @returns A data container which contains samples from the original data container.
 */
export function getSampleData(
  dataContainer: DataContainerInterface,
  sampleSize?: number
): DataContainerInterface;