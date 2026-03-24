// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {EnhancedGridLayer} from '@kepler.gl/deckgl-layers';
import AggregationLayer, {AggregationLayerConfig} from '../aggregation-layer';
import GridLayerIcon from './grid-layer-icon';
import {
  ColorRange,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  VisConfigSelection,
  Merge
} from '@kepler.gl/types';
import {AggregationTypes} from '@kepler.gl/constants';

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
  fixedHeight: 'fixedHeight';
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
  fixedHeight: 'fixedHeight',
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
    const {data} = opts;

    const defaultAggregationLayerProps = this.getDefaultAggregationLayerProp(opts);
    const {visConfig} = this.config;
    const cellSize = visConfig.worldUnitSize * 1000;

    return [
      new EnhancedGridLayer({
        ...defaultAggregationLayerProps,
        ...data,
        wrapLongitude: false,
        cellSize
      })
    ];
  }
}
