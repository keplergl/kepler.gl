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

import {GeoJsonLayer} from '@deck.gl/layers';
import AggregationLayer, {AggregationLayerConfig} from '../aggregation-layer';
import {EnhancedHexagonLayer} from '@kepler.gl/deckgl-layers';
import {hexagonToPolygonGeo} from './hexagon-utils';
import HexagonLayerIcon from './hexagon-layer-icon';
import {clamp} from '@kepler.gl/utils';
import {
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  VisConfigSelection,
  Merge
} from '@kepler.gl/types';
import {AggregationTypes, ColorRange} from '@kepler.gl/constants';

export type HexagonLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  worldUnitSize: VisConfigNumber;
  resolution: VisConfigNumber;
  colorRange: VisConfigColorRange;
  coverage: VisConfigNumber;
  sizeRange: VisConfigRange;
  percentile: VisConfigRange;
  elevationPercentile: VisConfigRange;
  elevationScale: VisConfigNumber;
  enableElevationZoomFactor: VisConfigBoolean;
  colorAggregation: VisConfigSelection;
  sizeAggregation: VisConfigSelection;
  enable3d: VisConfigBoolean;
};

export type HexagonLayerVisConfig = {
  opacity: number;
  worldUnitSize: number;
  resolution: number;
  colorRange: ColorRange;
  coverage: number;
  sizeRange: [number, number];
  percentile: [number, number];
  elevationPercentile: [number, number];
  elevationScale: number;
  enableElevationZoomFactor: boolean;
  colorAggregation: AggregationTypes;
  sizeAggregation: AggregationTypes;
  enable3d: boolean;
};

export type HexagonLayerConfig = Merge<AggregationLayerConfig, {visConfig: HexagonLayerVisConfig}>;

export const hexagonVisConfigs: {
  opacity: 'opacity';
  worldUnitSize: 'worldUnitSize';
  resolution: 'resolution';
  colorRange: 'colorRange';
  coverage: 'coverage';
  sizeRange: 'elevationRange';
  percentile: 'percentile';
  elevationPercentile: 'elevationPercentile';
  elevationScale: 'elevationScale';
  enableElevationZoomFactor: 'enableElevationZoomFactor';
  colorAggregation: 'colorAggregation';
  sizeAggregation: 'sizeAggregation';
  enable3d: 'enable3d';
} = {
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
  colorAggregation: 'colorAggregation',
  sizeAggregation: 'sizeAggregation',
  enable3d: 'enable3d'
};

export default class HexagonLayer extends AggregationLayer {
  declare visConfigSettings: HexagonLayerVisConfigSettings;
  declare config: HexagonLayerConfig;

  constructor(props) {
    super(props);

    this.registerVisConfig(hexagonVisConfigs);
    this.visConfigSettings.worldUnitSize.label = 'columns.hexagon.worldUnitSize';
  }

  get type(): 'hexagon' {
    return 'hexagon';
  }

  get name(): 'Hexbin' {
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
