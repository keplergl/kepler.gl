// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export {
  default as Layer,
  OVERLAY_TYPE_CONST,
  LAYER_ID_LENGTH,
  colorMaker,
  layerColors
} from './base-layer';
import {default as PointLayer} from './point-layer/point-layer';
import {default as ArcLayer} from './arc-layer/arc-layer';
import {default as LineLayer} from './line-layer/line-layer';
import {default as GridLayer} from './grid-layer/grid-layer';
export {pointToPolygonGeo} from './grid-layer/grid-utils';
import {default as HexagonLayer} from './hexagon-layer/hexagon-layer';
import {default as GeojsonLayer} from './geojson-layer/geojson-layer';
export {
  defaultElevation,
  defaultLineWidth,
  defaultRadius,
  COLUMN_MODE_TABLE
} from './geojson-layer/geojson-layer';
import {default as ClusterLayer} from './cluster-layer/cluster-layer';
import {default as IconLayer} from './icon-layer/icon-layer';
import {default as HeatmapLayer} from './heatmap-layer/heatmap-layer';
export {MAX_ZOOM_LEVEL} from './heatmap-layer/heatmap-layer';
import {default as H3Layer} from './h3-hexagon-layer/h3-hexagon-layer';
export {defaultElevation as h3DefaultElevation} from './h3-hexagon-layer/h3-hexagon-layer';
import {default as ScenegraphLayer} from './scenegraph-layer/scenegraph-layer';
import {default as TripLayer} from './trip-layer/trip-layer';
export {defaultLineWidth as tripDefaultLineWidth} from './trip-layer/trip-layer';
export {
  coordHasLength4,
  containValidTime,
  isTripGeoJsonField,
  parseTripGeoJsonTimestamp,
  getAnimationDomainFromTimestamps
} from './trip-layer/trip-utils';
import {default as S2GeometryLayer} from './s2-geometry-layer/s2-geometry-layer';
export {defaultElevation as s2DefaultElevation} from './s2-geometry-layer/s2-geometry-layer';
export {getS2Center} from './s2-geometry-layer/s2-utils';
export {default as AggregationLayer} from './aggregation-layer';
import {LAYER_TYPES} from '@kepler.gl/constants';
export {parseGeoJsonRawFeature} from './geojson-layer/geojson-utils';
// base layer
// eslint-disable-next-line prettier/prettier
export type {
  LayerBaseConfig,
  VisualChannelDomain,
  VisualChannel,
  VisualChannelDescription,
  FindDefaultLayerPropsReturnValue
} from './base-layer';
export * from './base-layer';

// individual layers
export const KeplerGlLayers = {
  PointLayer,
  ArcLayer,
  LineLayer,
  GridLayer,
  HexagonLayer,
  GeojsonLayer,
  ClusterLayer,
  IconLayer,
  HeatmapLayer,
  H3Layer,
  ScenegraphLayer,
  TripLayer,
  S2GeometryLayer
};

export type LayerClassesType = typeof LayerClasses;
export const LayerClasses = {
  [LAYER_TYPES.point]: PointLayer,
  [LAYER_TYPES.arc]: ArcLayer,
  [LAYER_TYPES.line]: LineLayer,
  [LAYER_TYPES.grid]: GridLayer,
  [LAYER_TYPES.hexagon]: HexagonLayer,
  [LAYER_TYPES.geojson]: GeojsonLayer,
  [LAYER_TYPES.cluster]: ClusterLayer,
  [LAYER_TYPES.icon]: IconLayer,
  [LAYER_TYPES.heatmap]: HeatmapLayer,
  [LAYER_TYPES.hexagonId]: H3Layer,
  [LAYER_TYPES['3D']]: ScenegraphLayer,
  [LAYER_TYPES.trip]: TripLayer,
  [LAYER_TYPES.s2]: S2GeometryLayer
};

export * from './mapbox-utils';
export * from './h3-hexagon-layer';
export {default as Table} from './table';

export {getEditorLayer} from './editor-layer/editor-layer';

export {
  default as ScenegraphLayer,
  scenegraphVisConfigs
} from './scenegraph-layer/scenegraph-layer';
export {default as ScenegraphLayerIcon} from './scenegraph-layer/scenegraph-layer-icon';

import {
  isDrawingActive,
  onClick,
  onHover,
  getTooltip,
  getCursor
} from './editor-layer/editor-layer-utils';
export const EditorLayerUtils = {
  isDrawingActive,
  onClick,
  onHover,
  getTooltip,
  getCursor
};

export {getFilterDataFunc} from './aggregation-layer';

export * from './layer-update';
export * from './layer-utils';
