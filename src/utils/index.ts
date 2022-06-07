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

// UTILS
export {errorNotification, createNotification} from './notifications-utils';
export {dataURItoBlob, downloadFile, calculateExportImageSize} from './export-utils';

// REDUCER UTILS
export {updateAllLayerDomainData} from '../reducers/vis-state-updaters';
export {getHexFields} from '../layers/h3-hexagon-layer/h3-utils';
export {containValidTime} from '../layers/trip-layer/trip-utils';

export {
  default as KeplerTable,
  findPointFieldPairs,
  copyTableAndUpdate,
  pinTableColumns,
  sortDatasetByColumn,
} from './table-utils/kepler-table';
export type {Field} from './table-utils/kepler-table';
export {createDataContainer, createIndexedDataContainer} from './table-utils/data-container-utils';
export type {DataContainerInterface} from './table-utils/data-container-interface';

export * from './color-utils';
export * from './data-scale-utils';
export * from './data-utils';
export * from './dataset-utils';
export * from './filter-utils';
export * from './gpu-filter-utils';
export * from './interaction-utils';
export * from './layer-utils';
export * from './observe-dimensions';
export * from './projection-utils';
export * from './map-style-utils/mapbox-gl-style-editor';
export * from './map-style-utils/mapbox-utils';
export * from './utils';
export * from './split-map-utils';
