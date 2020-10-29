// Copyright (c) 2020 Uber Technologies, Inc.
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
export {
  maybeToDate,
  roundValToStep,
  timeToUnixMilli,
  defaultFormatter,
  FIELD_DISPLAY_FORMAT
} from './data-utils';
export {findPointFieldPairs, createNewDataEntry, datasetColorMaker} from './dataset-utils';
export {hexToRgb} from './color-utils';
export {errorNotification} from './notifications-utils';
export {DEFAULT_DATA_NAME, dataURItoBlob, downloadFile} from './export-utils';
export {calculateLayerData} from './layer-utils';
export {applyFilterFieldName, applyFiltersToDatasets} from 'utils/filter-utils';

// REDUCER UTILS
export {updateAllLayerDomainData} from '../reducers/vis-state-updaters';
export {
  validateLayerWithData,
  validateSavedVisualChannels,
  mergeLayers
} from '../reducers/vis-state-merger';

// LAYER UTILS
export {getHexFields} from '../layers/h3-hexagon-layer/h3-utils';
export {containValidTime} from '../layers/trip-layer/trip-utils';

// Render
export {renderedSize} from 'components/common/data-table/cell-size';
