// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {LayerAnimatableProp} from '@kepler.gl/types';

import {GeoJsonLayer} from '@deck.gl/layers';
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
import {AggregationTypes, PROPERTY_GROUPS, SCALE_TYPES} from '@kepler.gl/constants';

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
  zeroCountHeight: VisConfigBoolean;
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
  zeroCountHeight?: boolean;
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
  zeroCountHeight: VisConfigBoolean;
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
  enable3d: 'enable3d',
  zeroCountHeight: {
    defaultValue: false,
    type: 'boolean',
    label: 'layerVisConfigs.zeroCountHeight',
    description: 'layerVisConfigs.zeroCountHeightDescription',
    group: PROPERTY_GROUPS.height,
    property: 'zeroCountHeight',
    condition: config =>
      config.visConfig.enable3d &&
      !config.visConfig.fixedHeight &&
      !config.sizeField &&
      config.sizeScale === SCALE_TYPES.linear &&
      config.visConfig.sizeRange[0] === 0 &&
      config.visConfig.elevationPercentile[0] === 0
  }
};

export default class HexagonLayer extends AggregationLayer {
  declare visConfigSettings: HexagonLayerVisConfigSettings;
  declare config: HexagonLayerConfig;

  constructor(props) {
    super(props);

    this.registerVisConfig(hexagonVisConfigs);
    this.visConfigSettings.worldUnitSize.label = 'columns.hexagon.worldUnitSize';
  }

  get noneLayerDataAffectingProps() {
    return [...super.noneLayerDataAffectingProps, 'zeroCountHeight'];
  }

  get animatableProps(): readonly LayerAnimatableProp[] {
    const props: LayerAnimatableProp[] = [
      ...super.animatableProps,
      {
        name: 'coverage',
        label: 'Coverage',
        range: this.visConfigSettings.coverage.range,
        step: this.visConfigSettings.coverage.step
      },
      {
        name: 'elevationScale',
        label: 'Elevation scale',
        range: this.visConfigSettings.elevationScale.range,
        step: this.visConfigSettings.elevationScale.step
      }
    ];
    return props.filter(prop => prop.name !== 'elevationScale' || this.config.visConfig.enable3d);
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

    const defaultAggregationLayerProps = this.getDefaultAggregationLayerProp(opts);
    const countLabelProps = this.getCountLabelProps(opts);
    const zoomFactor = this.getZoomFactor(mapState);
    const {visConfig} = this.config;
    const radius = visConfig.worldUnitSize * 1000;
    const hoveredObject = this.hasHoveredObject(objectHovered);

    // Use cellOutline computed in common space by ScaleEnhancedHexagonLayer.getPickingInfo
    // so the outline aligns with rendered cells at all latitudes.
    const outlineCoords = hoveredObject?.cellOutline;

    return [
      new EnhancedHexagonLayer({
        ...defaultAggregationLayerProps,
        ...data,
        wrapLongitude: false,
        radius,
        zeroCountHeight:
          visConfig.zeroCountHeight &&
          this.visConfigSettings.zeroCountHeight.condition?.(this.config),
        ...countLabelProps
      }),

      // render an outline of each hexagon if not extruded
      ...(outlineCoords && !visConfig.enable3d
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              visible: defaultAggregationLayerProps.visible,
              wrapLongitude: false,
              data: [
                {
                  type: 'Feature' as const,
                  properties: {},
                  geometry: {
                    coordinates: outlineCoords,
                    type: 'LineString' as const
                  }
                }
              ],
              getLineColor: this.config.highlightColor,
              lineWidthScale: 8 * zoomFactor
            })
          ]
        : [])
    ];
  }
}
