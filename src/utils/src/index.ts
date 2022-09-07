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

export {
  hexToRgb,
  isHexColor,
  rgbToHex,
  getColorGroupByName,
  reverseColorRange,
  createLinearGradient,
  isRgbColor
} from './color-utils';
export {errorNotification} from './notifications-utils';

export {createNotification, exportImageError, successNotification} from './notifications-utils';

export {default as domtoimage} from './dom-to-image';
export {getFrequency, getMode, aggregate} from './aggregate-utils';
// eslint-disable-next-line prettier/prettier
export type {FieldFormatter} from './data-utils';
export {
  unique,
  getLatLngBounds,
  clamp,
  getSampleData,
  timeToUnixMilli,
  notNullorUndefined,
  isNumber,
  isPlainObject,
  hasOwnProperty,
  numberSort,
  getSortingFunction,
  preciseRound,
  getRoundingDecimalFromStep,
  snapToMarks,
  normalizeSliderValue,
  roundValToStep,
  defaultFormatter,
  FIELD_DISPLAY_FORMAT,
  parseFieldValue,
  arrayMove,
  getFormatter,
  applyDefaultFormat,
  getBooleanFormatter,
  applyCustomFormat,
  datetimeFormatter
} from './data-utils';
export {
  datasetColorMaker,
  findDefaultColorField,
  ACCEPTED_ANALYZER_TYPES,
  validateInputData,
  getSampleForTypeAnalyze,
  getFieldsFromData,
  renameDuplicateFields,
  analyzerTypeToFieldType
} from './dataset-utils';
export {exportMapToHTML} from './export-map-html';
export {
  DEFAULT_IMAGE_NAME,
  DEFAULT_HTML_NAME,
  DEFAULT_JSON_NAME,
  DEFAULT_DATA_NAME,
  DEFAULT_EXPORT_JSON_SETTINGS,
  isMSEdge,
  getScaleFromImageSize,
  calculateExportImageSize,
  convertToPng,
  dataURItoBlob,
  downloadFile,
  exportImage,
  exportToJsonString,
  getMapJSON,
  exportJson,
  exportHtml,
  exportMap,
  default as exporters
} from './export-utils';
export {
  isValidFilterValue, 
  isValidTimeDomain, 
  getIntervalBins, 
  getTimeWidgetHintFormatter, 
  durationSecond, 
  durationMinute, 
  durationHour, 
  durationDay, 
  durationWeek, 
  durationYear
} from './filter-utils';
export {setLayerBlending} from './gl-utils';
export {flattenMessages, mergeMessages} from './locale-utils';
export type {Dimensions} from './observe-dimensions';
export {
  observeDimensions,
  unobserveDimensions,
  default as useDimensions
} from './observe-dimensions';
export {validateBounds, getCenterAndZoomFromBounds} from './projection-utils';
export {validateToken} from './mapbox-utils';
export {
  getDefaultLayerGroupVisibility,
  editTopMapStyle,
  editBottomMapStyle,
  isValidStyleUrl,
  getStyleDownloadUrl,
  getStyleImageIcon,
  scaleMapStyleByResolution,
  mergeLayerGroupVisibility
} from './map-style-utils/mapbox-gl-style-editor';
export {isValidMapInfo} from './map-info-utils';
export {
  generateHashId,
  isChrome,
  capitalizeFirstLetter,
  camelToTitle,
  camelize,
  toArray,
  insertValue,
  isObject,
  set,
  getError,
  arrayInsert,
  isTest,
  filterObjectByPredicate,
  isFunction
} from './utils';
export {
  addNewLayersToSplitMap,
  removeLayerFromSplitMaps,
  getInitialMapLayersForSplitMap,
  computeSplitMapLayers
} from './split-map-utils';

// Mapbox
export {transformRequest} from './map-style-utils/mapbox-utils';

// Map
export {onViewPortChange, getMapLayersFromSplitMaps} from './map-utils';
