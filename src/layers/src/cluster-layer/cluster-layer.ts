// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import AggregationLayer, {AggregationLayerConfig} from '../aggregation-layer';
import {ScatterplotLayer} from '@deck.gl/layers';

import {DeckGLClusterLayer} from '@kepler.gl/deckgl-layers';
import ClusterLayerIcon from './cluster-layer-icon';
import {
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  VisConfigSelection,
  Merge
} from '@kepler.gl/types';
import {CHANNEL_SCALES, AggregationTypes, ColorRange} from '@kepler.gl/constants';
import {VisualChannels} from '../base-layer';

export type ClusterLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  clusterRadius: VisConfigNumber;
  colorRange: VisConfigColorRange;
  radiusRange: VisConfigRange;
  colorAggregation: VisConfigSelection;
};

export type ClusterLayerVisConfig = {
  opacity: number;
  clusterRadius: number;
  colorRange: ColorRange;
  radiusRange: [number, number];
  colorAggregation: AggregationTypes;
};

export type ClusterLayerConfig = Merge<AggregationLayerConfig, {visConfig: ClusterLayerVisConfig}>;

export const clusterVisConfigs: {
  opacity: 'opacity';
  clusterRadius: 'clusterRadius';
  colorRange: 'colorRange';
  radiusRange: 'clusterRadiusRange';
  colorAggregation: 'colorAggregation';
} = {
  opacity: 'opacity',
  clusterRadius: 'clusterRadius',
  colorRange: 'colorRange',
  radiusRange: 'clusterRadiusRange',
  colorAggregation: 'colorAggregation'
};

export default class ClusterLayer extends AggregationLayer {
  declare visConfigSettings: ClusterLayerVisConfigSettings;
  declare config: ClusterLayerConfig;

  constructor(props) {
    super(props);
    this.registerVisConfig(clusterVisConfigs);

    // Access data of a point from aggregated clusters, depends on how getClusterer works
    this.getPointData = pt => pt;
  }

  get type(): 'cluster' {
    return 'cluster';
  }

  get layerIcon() {
    return ClusterLayerIcon;
  }

  get visualChannels(): VisualChannels {
    return {
      color: {
        aggregation: 'colorAggregation',
        channelScaleType: CHANNEL_SCALES.colorAggr,
        defaultMeasure: 'property.pointCount',
        domain: 'colorDomain',
        field: 'colorField',
        key: 'color',
        property: 'color',
        range: 'colorRange',
        scale: 'colorScale'
      }
    };
  }

  renderLayer(opts) {
    const {visConfig} = this.config;
    const {data, gpuFilter, objectHovered, mapState, layerCallbacks} = opts;

    const updateTriggers = {
      getColorValue: {
        colorField: this.config.colorField,
        colorAggregation: this.config.visConfig.colorAggregation
      },
      filterData: {
        filterRange: gpuFilter.filterRange,
        ...gpuFilter.filterValueUpdateTriggers
      }
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    const {_filterData: filterData, ...clusterData} = data;
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      new DeckGLClusterLayer({
        ...defaultLayerProps,
        ...clusterData,
        filterData,

        // radius
        radiusScale: 1,
        radiusRange: visConfig.radiusRange,
        clusterRadius: visConfig.clusterRadius,

        // color
        colorRange: this.getColorRange(visConfig.colorRange),
        colorScaleType: this.config.colorScale,
        colorAggregation: visConfig.colorAggregation,

        zoom: Math.round(mapState.zoom),
        width: mapState.width,
        height: mapState.height,

        // updateTriggers
        updateTriggers,

        // call back from layer after calculate clusters
        onSetColorDomain: layerCallbacks.onSetLayerDomain
      }),
      // hover layer
      ...(hoveredObject
        ? [
            new ScatterplotLayer<{radius: number}>({
              id: `${this.id}-hovered`,
              visible: defaultLayerProps.visible,
              data: [hoveredObject],
              getFillColor: this.config.highlightColor,
              getRadius: d => d.radius,
              radiusScale: 1,
              pickable: false
            })
          ]
        : [])
    ];
  }
}
