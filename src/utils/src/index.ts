// Copyright (c) 2023 Uber Technologies, Inc.
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
  colorMaybeToRGB,
  isRgbColor,
  normalizeColor
} from './color-utils';
export {errorNotification} from './notifications-utils';

export {createNotification, exportImageError, successNotification} from './notifications-utils';

export {setStyleSheetBaseHref} from './dom-utils';
export {default as domtoimage} from './dom-to-image';
export {getFrequency, getMode, aggregate} from './aggregate-utils';
// eslint-disable-next-line prettier/prettier
export type {FieldFormatter} from './data-utils';
export * from './data-utils';
export {getTimelineFromAnimationConfig, getTimelineFromFilter, SAMPLE_TIMELINE, TIMELINE_MODES} from './time';

export {
  datasetColorMaker,
  findDefaultColorField,
  ACCEPTED_ANALYZER_TYPES,
  validateInputData,
  getSampleForTypeAnalyze,
  getFieldsFromData,
  renameDuplicateFields,
  analyzerTypeToFieldType,
  getFormatLabels,
  getFieldFormatLabels
} from './dataset-utils';
export {getFormatValue} from './format';
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
export {setLayerBlending} from './gl-utils';
export {flattenMessages, mergeMessages} from './locale-utils';
export type {Dimensions} from './observe-dimensions';
export * from './observe-dimensions';
export * from './projection-utils';
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
export * from './utils';
export * from './split-map-utils';
export {snapToMarks} from './plot';

export {computeDeckEffects, fixEffectOrder, reorderEffectOrder} from './effect-utils';

// Mapbox
export {transformRequest, isStyleUsingMapboxTiles} from './map-style-utils/mapbox-utils';

// Map
export * from './map-utils';

export {createDataContainer, createIndexedDataContainer, getSampleData as getSampleContainerData, DataForm} from './data-container-utils';
export type { DataContainerInterface } from './data-container-interface';
export {ArrowDataContainer, arrowDataTypeToFieldType, arrowDataTypeToAnalyzerDataType} from './arrow-data-container';
export type {FilterResult, FilterChanged, dataValueAccessor} from './filter-utils'
export * from "./filter-utils";

export {
  getQuantileDomain,
  getOrdinalDomain,
  getLinearDomain,
  getLogDomain
} from "./data-scale-utils";

export {DataRow} from './data-row';

export type {Centroid} from './h3-utils';
export {getCentroid, idToPolygonGeo, h3IsValid, getHexFields} from './h3-utils';
