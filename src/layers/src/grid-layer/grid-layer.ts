// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GeoJsonLayer} from '@deck.gl/layers';
import {EnhancedGridLayer} from '@kepler.gl/deckgl-layers';
import AggregationLayer, {AggregationLayerConfig} from '../aggregation-layer';
import {pointToPolygonGeo} from './grid-utils';
import GridLayerIcon from './grid-layer-icon';
import {
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  VisConfigSelection,
  Merge
} from '@kepler.gl/types';
import {AggregationTypes, ColorRange} from '@kepler.gl/constants';

export type GridLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  worldUnitSize: VisConfigNumber;
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

export type GridLayerVisConfig = {
  opacity: number;
  worldUnitSize: number;
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

export type GridLayerConfig = Merge<AggregationLayerConfig, {visConfig: GridLayerVisConfig}>;

export const gridVisConfigs: {
  opacity: 'opacity';
  worldUnitSize: 'worldUnitSize';
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

export default class GridLayer extends AggregationLayer {
  declare visConfigSettings: GridLayerVisConfigSettings;
  declare config: GridLayerConfig;

  constructor(props) {
    super(props);

    this.registerVisConfig(gridVisConfigs);
    this.visConfigSettings.worldUnitSize.label = 'columns.grid.worldUnitSize';
  }

  get type(): 'grid' {
    return 'grid';
  }

  get layerIcon() {
    return GridLayerIcon;
  }

  renderLayer(opts) {
    const {data, objectHovered, mapState} = opts;

    const defaultAggregationLayerProps = this.getDefaultAggregationLayerProp(opts);
    const zoomFactor = this.getZoomFactor(mapState);
    const {visConfig} = this.config;
    const cellSize = visConfig.worldUnitSize * 1000;
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      new EnhancedGridLayer({
        ...defaultAggregationLayerProps,
        ...data,
        wrapLongitude: false,
        cellSize
      }),

      // render an outline of each cell if not extruded
      ...(hoveredObject && !visConfig.enable3d
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              visible: defaultAggregationLayerProps.visible,
              wrapLongitude: false,
              data: [
                pointToPolygonGeo({
                  object: hoveredObject,
                  cellSize,
                  coverage: visConfig.coverage,
                  mapState
                })
              ],
              getLineColor: this.config.highlightColor,
              lineWidthScale: 8 * zoomFactor
            })
          ]
        : [])
    ];
  }
}
