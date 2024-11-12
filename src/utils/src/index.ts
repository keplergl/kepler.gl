// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// UTILS

export {
  colorMaybeToRGB,
  createLinearGradient,
  getColorGroupByName,
  hasColorMap,
  hexToRgb,
  isHexColor,
  isRgbColor,
  normalizeColor,
  reverseColorRange,
  rgbToHex,
  updateColorRange,
  addCustomPaletteColor,
  removeCustomPaletteColor,
  sortCustomPaletteColor,
  updateCustomPaletteColor
} from './color-utils';
export {errorNotification} from './notifications-utils';

export {createNotification, exportImageError, successNotification} from './notifications-utils';

export {setStyleSheetBaseHref} from './dom-utils';
export {default as domtoimage} from './dom-to-image';
export {getFrequency, getMode, aggregate} from './aggregation';
export {
  adjustValueToAnimationWindow,
  getBinThresholds,
  histogramFromThreshold,
  histogramFromDomain,
  runGpuFilterForPlot,
  updateTimeFilterPlotType
} from './plot';
// eslint-disable-next-line prettier/prettier
export * from './data-utils';
export type {FieldFormatter} from './data-utils';
export * from './strings';
export {
  SAMPLE_TIMELINE,
  TIMELINE_MODES,
  TIME_INTERVALS_ORDERED,
  LayerToFilterTimeInterval,
  TileTimeInterval,
  getTimelineFromAnimationConfig,
  getTimelineFromFilter
} from './time';

export {
  ACCEPTED_ANALYZER_TYPES,
  analyzerTypeToFieldType,
  datasetColorMaker,
  findDefaultColorField,
  getFieldFormatLabels,
  getFieldsFromData,
  getFormatLabels,
  getSampleForTypeAnalyze,
  renameDuplicateFields,
  validateInputData
} from './dataset-utils';
export {exportMapToHTML} from './export-map-html';
export {
  calculateExportImageSize,
  convertToPng,
  dataURItoBlob,
  downloadFile,
  exportHtml,
  exportImage,
  exportJson,
  exportMap,
  exportToJsonString,
  default as exporters,
  getMapJSON,
  getScaleFromImageSize,
  isMSEdge
} from './export-utils';
export {getFormatValue, getDefaultTimeFormat} from './format';
export {setLayerBlending} from './gl-utils';
export {flattenMessages, mergeMessages} from './locale-utils';
export {isValidMapInfo} from './map-info-utils';
export {
  editBottomMapStyle,
  editTopMapStyle,
  getDefaultLayerGroupVisibility,
  getStyleDownloadUrl,
  getStyleImageIcon,
  mergeLayerGroupVisibility,
  scaleMapStyleByResolution
} from './map-style-utils/mapbox-gl-style-editor';
export {validateToken} from './mapbox-utils';
export * from './observe-dimensions';
export type {Dimensions} from './observe-dimensions';
export {snapToMarks} from './plot';
export * from './projection-utils';
export * from './split-map-utils';
export * from './utils';

export {
  computeDeckEffects,
  fixEffectOrder,
  reorderEffectOrder,
  validateEffectParameters
} from './effect-utils';

// Mapbox
export {isStyleUsingMapboxTiles, transformRequest} from './map-style-utils/mapbox-utils';

// Map
export * from './map-utils';

export {
  ArrowDataContainer,
  arrowDataTypeToAnalyzerDataType,
  arrowDataTypeToFieldType
} from './arrow-data-container';
export type {DataContainerInterface} from './data-container-interface';
export {
  DataForm,
  createDataContainer,
  createIndexedDataContainer,
  getSampleData as getSampleContainerData
} from './data-container-utils';
export * from './filter-utils';
export type {FilterChanged, FilterResult, dataValueAccessor} from './filter-utils';

export {
  colorMapToColorBreaks,
  getLayerColorScale,
  getLegendOfScale,
  getLinearDomain,
  getLogDomain,
  getOrdinalDomain,
  getQuantileDomain,
  getScaleFunction,
  getVisualChannelScaleByZoom,
  initializeLayerColorMap,
  isNumericColorBreaks
} from './data-scale-utils';
export type {ColorBreak, ColorBreakOrdinal} from './data-scale-utils';

export {DataRow} from './data-row';

export {getCentroid, getHexFields, h3IsValid, idToPolygonGeo} from './h3-utils';
export type {Centroid} from './h3-utils';

// Application config
export {getApplicationConfig, initApplicationConfig} from '../../utils/src/application-config';
export type {KeplerApplicationConfig, MapLibInstance} from '../../utils/src/application-config';
