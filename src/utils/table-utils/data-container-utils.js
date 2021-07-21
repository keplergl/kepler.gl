// Copyright (c) 2021 Uber Technologies, Inc.
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

/** @type {import('./data-container-utils').DataForm} */
export const DataForm = {
  ROWS_ARRAY: 'ROWS_ARRAY'
};

/** @type {import('./data-container-utils').DataContainerOptions} */
const defaultOptions = {
  inputDataFormat: DataForm.ROWS_ARRAY
};

/** @type {typeof import('./data-container-utils').createDataContainer} */
export function createDataContainer(data, options = defaultOptions) {
  options = {...defaultOptions, ...options};

  if (options.inputDataFormat === DataForm.ROWS_ARRAY) {
    return new RowDataContainer({rows: data, fields: options.fields});
  }

  throw Error('Failed to create a data container: not implemented format');
}

/** @type {typeof import('./data-container-utils').createIndexedDataContainer} */
export function createIndexedDataContainer(dataContainer, indices) {
  return new IndexedDataContainer(dataContainer, indices);
}

/** @type {typeof import('./data-container-utils').getSampleData} */
export function getSampleData(dataContainer, sampleSize = 500) {
  const numberOfRows = dataContainer.numRows();
  const sampleStep = Math.max(Math.floor(numberOfRows / sampleSize), 1);

  const indices = [];
  for (let i = 0; i < numberOfRows; i += sampleStep) {
    indices.push(i);
  }

  return createIndexedDataContainer(dataContainer, indices);
}
