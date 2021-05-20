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

import {GeoJsonLayer} from '@deck.gl/layers';
import AggregationLayer from '../aggregation-layer';
import EnhancedHexagonLayer from 'deckgl-layers/hexagon-layer/enhanced-hexagon-layer';
import {hexagonToPolygonGeo} from './hexagon-utils';
import HexagonLayerIcon from './hexagon-layer-icon';
import {clamp} from 'utils/data-utils';

export const hexagonVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  resolution: 'resolution',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  percentile: 'percentile',
  elevationPercentile: 'elevationPercentile',
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor',
  colorAggregation: 'aggregation',
  sizeAggregation: 'sizeAggregation',
  enable3d: 'enable3d'
};

export default class HexagonLayer extends AggregationLayer {
  constructor(props) {
    super(props);

    this.registerVisConfig(hexagonVisConfigs);
    this.visConfigSettings.worldUnitSize.label = 'columns.hexagon.worldUnitSize';
  }

  get type() {
    return 'hexagon';
  }

  get name() {
    return 'Hexbin';
  }

  get layerIcon() {
    return HexagonLayerIcon;
  }

  renderLayer(opts) {
    const {data, objectHovered, mapState} = opts;
    const zoomFactor = this.getZoomFactor(mapState);
    const {visConfig} = this.config;
    const radius = visConfig.worldUnitSize * 1000;
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      new EnhancedHexagonLayer({
        ...this.getDefaultAggregationLayerProp(opts),
        ...data,
        wrapLongitude: false,
        radius
      }),

      // render an outline of each hexagon if not extruded
      ...(hoveredObject && !visConfig.enable3d
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              wrapLongitude: false,
              data: [
                hexagonToPolygonGeo(hoveredObject, {}, radius * visConfig.coverage, mapState)
              ].filter(d => d),
              getLineColor: this.config.highlightColor,
              lineWidthScale: clamp([1, 100], radius * 0.1 * zoomFactor)
            })
          ]
        : [])
    ];
  }
}
