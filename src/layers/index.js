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

import {default as PointLayer} from './point-layer/point-layer';
import {default as ArcLayer} from './arc-layer/arc-layer';
import {default as LineLayer} from './line-layer/line-layer';
import {default as GridLayer} from './grid-layer/grid-layer';
import {default as HexagonLayer} from './hexagon-layer/hexagon-layer';
import {default as GeojsonLayer} from './geojson-layer/geojson-layer';
import {default as ClusterLayer} from './cluster-layer/cluster-layer';
import {default as IconLayer} from './icon-layer/icon-layer';
import {default as HeatmapLayer} from './heatmap-layer/heatmap-layer';
import {default as H3Layer} from './h3-hexagon-layer/h3-hexagon-layer';
import {default as ScenegraphLayer} from './scenegraph-layer/scenegraph-layer';
import {default as TripLayer} from './trip-layer/trip-layer';
import {default as S2GeometryLayer} from './s2-geometry-layer/s2-geometry-layer';
import {LAYER_TYPES} from './types';

// base layer
export {default as Layer, OVERLAY_TYPE, LAYER_ID_LENGTH, colorMaker} from './base-layer';

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

export {LAYER_VIS_CONFIGS} from './layer-factory';
