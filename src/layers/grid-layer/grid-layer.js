// Copyright (c) 2018 Uber Technologies, Inc.
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

import {GeoJsonLayer} from 'deck.gl';
import AggregationLayer from '../aggregation-layer';
import EnhancedGridLayer from 'deckgl-layers/grid-layer/enhanced-grid-layer';
import {pointToPolygonGeo} from './grid-utils';
import GridLayerIcon from './grid-layer-icon';

export const gridVisConfigs = {
  opacity: 'opacity',
  worldUnitSize: 'worldUnitSize',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  percentile: 'percentile',
  elevationPercentile: 'elevationPercentile',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision',
  colorAggregation: 'aggregation',
  sizeAggregation: 'sizeAggregation',
  enable3d: 'enable3d'
};

export default class GridLayer extends AggregationLayer {
  constructor(props) {
    super(props);

    this.registerVisConfig(gridVisConfigs);
    this.visConfigSettings.worldUnitSize.label = 'Grid Size (km)';
  }

  get type() {
    return 'grid';
  }

  get layerIcon() {
    return GridLayerIcon;
  }

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const formattedData = super.formatLayerData(
      _,
      allData,
      filteredIndex,
      oldLayerData,
      opt
    );

    const {getPosition, data} = formattedData;

    // TODO: fix this in deck.gl layer
    const cleaned = data.filter(d => {
      const pos = getPosition(d);
      return pos.every(Number.isFinite);
    });

    // All data processing is done in deck.gl layer
    return {
      ...formattedData,
      data: cleaned
    };
  }

  renderLayer({
    data,
    idx,
    objectHovered,
    mapState,
    interaction,
    layerCallbacks
  }) {
    const zoomFactor = this.getZoomFactor(mapState);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const {visConfig} = this.config;
    const cellSize = visConfig.worldUnitSize * 1000;

    return [
      new EnhancedGridLayer({
        ...data,
        id: this.id,
        idx,
        cellSize,
        coverage: visConfig.coverage,
        // highlight
        autoHighlight: visConfig.enable3d,

        // color
        colorRange: this.getColorRange(visConfig.colorRange),
        colorScale: this.config.colorScale,
        opacity: visConfig.opacity,
        upperPercentile: visConfig.percentile[1],
        lowerPercentile: visConfig.percentile[0],

        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        elevationLowerPercentile: visConfig.elevationPercentile[0],
        elevationUpperPercentile: visConfig.elevationPercentile[1],
        // parameters
        parameters: {depthTest: Boolean(visConfig.enable3d || mapState.dragRotate)},

        // render
        fp64: visConfig['hi-precision'],
        pickable: true,
        lightSettings: this.meta && this.meta.lightSettings,

        // callbacks
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      }),

      // render an outline of each cell if not extruded
      ...(this.isLayerHovered(objectHovered) && !visConfig.enable3d
        ? [
            new GeoJsonLayer({
              id: `${this.id}-hovered`,
              data: [
                pointToPolygonGeo({
                  object: objectHovered.object,
                  cellSize,
                  coverage: visConfig.coverage,
                  properties: {lineColor: this.config.highlightColor},
                  mapState
                })
              ],
              lineWidthScale: 8 * zoomFactor
            })
          ]
        : [])
    ];
  }
}
