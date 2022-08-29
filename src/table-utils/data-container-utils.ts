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

import {RowDataContainer} from './row-data-container';
import {IndexedDataContainer} from './indexed-data-container';

import {DataContainerInterface} from './data-container-interface';
import {Field} from '@kepler.gl/types';

export type DataContainerOptions = {
  inputDataFormat?: string; // one of DataForm
  fields?: Field[];
};

export const DataForm = {
  ROWS_ARRAY: 'ROWS_ARRAY'
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
