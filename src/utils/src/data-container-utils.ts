// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ArrowDataContainer} from './arrow-data-container';
import {RowDataContainer} from './row-data-container';
import {IndexedDataContainer} from './indexed-data-container';

import {DataContainerInterface} from './data-container-interface';
import {Field} from '@kepler.gl/types';

export type DataContainerOptions = {
  inputDataFormat?: string; // one of DataForm
  fields?: Field[];
};

export const DataForm = {
  ROWS_ARRAY: 'ROWS_ARRAY',
  COLS_ARRAY: 'COLS_ARRAY'
};

const defaultOptions: DataContainerOptions = {
  inputDataFormat: DataForm.ROWS_ARRAY
};

/**
 * Creates a data container wrapper for the data.
 * @param data Data.
 * @param options Options.
 * @returns A data container object which is based on data and options.
 */
export function createDataContainer(
  data: any[],
  options: DataContainerOptions = defaultOptions
): DataContainerInterface {
  options = {...defaultOptions, ...options};

  if (options.inputDataFormat === DataForm.ROWS_ARRAY) {
    return new RowDataContainer({rows: data, fields: options.fields});
  } else if (options.inputDataFormat === DataForm.COLS_ARRAY) {
    return new ArrowDataContainer({cols: data, fields: options.fields});
  }

  throw Error('Failed to create a data container: not implemented format');
}

/**
 * Creates a data container wrapper around another data container.
 * @param dataContainer Parent data container.
 * @param indices An array of row indices in the parent data container.
 */
export function createIndexedDataContainer(
  dataContainer: DataContainerInterface,
  indices: number[]
): DataContainerInterface {
  return new IndexedDataContainer(dataContainer, indices);
}

/**
 * Get a sample of rows from a data container.
 * @param dataContainer Data container to get samples from.
 * @param sampleSize Max number of samples.
 * @returns A data container which contains samples from the original data container.
 */
export function getSampleData(
  dataContainer: DataContainerInterface,
  sampleSize = 500
): DataContainerInterface {
  const numberOfRows = dataContainer.numRows();
  const sampleStep = Math.max(Math.floor(numberOfRows / sampleSize), 1);

  const indices: number[] = [];
  for (let i = 0; i < numberOfRows; i += sampleStep) {
    indices.push(i);
  }

  return createIndexedDataContainer(dataContainer, indices);
}
