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

import AggregationLayer, {AggregationLayerConfig} from '../aggregation-layer';
import {ScatterplotLayer} from '@deck.gl/layers';

import {DeckGLClusterLayer} from '@kepler.gl/deckgl-layers';
import {CHANNEL_SCALES} from '@kepler.gl/constants';
import ClusterLayerIcon from './cluster-layer-icon';
import {
  AggregationTypes,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  VisConfigSelection,
  ColorRange
} from '@kepler.gl/constants';
import {Merge} from '@kepler.gl/types';
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
    const {_filterData: filterData, ...clusterData} = data;
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      new DeckGLClusterLayer({
        ...this.getDefaultDeckLayerProps(opts),
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
