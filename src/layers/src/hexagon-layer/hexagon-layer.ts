// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import AggregationLayer, {AggregationLayerConfig} from '../aggregation-layer';
import {EnhancedHexagonLayer} from '@kepler.gl/deckgl-layers';
import HexagonLayerIcon from './hexagon-layer-icon';
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
  fixedHeight: 'fixedHeight';
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
  fixedHeight: 'fixedHeight',
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
    const {data} = opts;

    const defaultAggregationLayerProps = this.getDefaultAggregationLayerProp(opts);
    const {visConfig} = this.config;
    const radius = visConfig.worldUnitSize * 1000;

    return [
      new EnhancedHexagonLayer({
        ...defaultAggregationLayerProps,
        ...data,
        wrapLongitude: false,
        radius
      })
    ];
  }
}
