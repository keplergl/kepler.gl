// Copyright (c) 2019 Uber Technologies, Inc.
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

// base layer
export {default as Layer} from './base-layer';

// individual layers
export const KeplerGlLayers = {
  TripLayer,
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
  ScenegraphLayer
};

export const LayerClasses = {
  point: PointLayer,
  arc: ArcLayer,
  line: LineLayer,
  grid: GridLayer,
  hexagon: HexagonLayer,
  geojson: GeojsonLayer,
  cluster: ClusterLayer,
  icon: IconLayer,
  heatmap: HeatmapLayer,
  hexagonId: H3Layer,
  '3D': ScenegraphLayer,
  trip: TripLayer
};
