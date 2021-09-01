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

import {ScatterplotLayer} from '@deck.gl/layers';
import {_AggregationLayer as AggregationLayer} from '@deck.gl/aggregation-layers';

import geoViewport from '@mapbox/geo-viewport';
import CPUAggregator, {
  defaultColorDimension,
  getDimensionScale
} from '../layer-utils/cpu-aggregator';
import {getDistanceScales} from 'viewport-mercator-project';
import {max} from 'd3-array';

import {LAYER_VIS_CONFIGS} from 'layers/layer-factory';
import {SCALE_TYPES} from 'constants/default-settings';
import {DEFAULT_COLOR_RANGE} from 'constants/color-ranges';
import ClusterBuilder, {getGeoJSON} from '../layer-utils/cluster-utils';

const defaultRadius = LAYER_VIS_CONFIGS.clusterRadius.defaultValue;
const defaultRadiusRange = LAYER_VIS_CONFIGS.clusterRadiusRange.defaultValue;

const defaultGetColorValue = points => points.length;
const defaultGetRadiusValue = cell =>
  cell.filteredPoints ? cell.filteredPoints.length : cell.points.length;

function processGeoJSON(step, props, aggregation, {viewport}) {
  const {data, getPosition, filterData} = props;
  const geoJSON = getGeoJSON(data, getPosition, filterData);
  const clusterBuilder = new ClusterBuilder();

  this.setState({geoJSON, clusterBuilder});
}

function getClusters(step, props, aggregation, {viewport}) {
  const {geoJSON, clusterBuilder} = this.state;
  const {clusterRadius, zoom, width, height} = props;
  const {longitude, latitude} = viewport;

  // zoom needs to be an integer for the different map utils. Also helps with cache key.
  const bbox = geoViewport.bounds([longitude, latitude], zoom, [width, height]);
  const clusters = clusterBuilder.clustersAtZoom({bbox, clusterRadius, geoJSON, zoom});

  this.setState({
    layerData: {data: clusters}
  });
}

function getSubLayerRadius(dimensionState, dimension, layerProps) {
  return cell => {
    const {getRadiusValue} = layerProps;
    const {scaleFunc} = dimensionState;
    return scaleFunc(getRadiusValue(cell));
  };
}

export const clusterAggregation = {
  key: 'position',
  updateSteps: [
    {
      key: 'geojson',
      triggers: {
        position: {
          prop: 'getPosition',
          updateTrigger: 'getPosition'
        },
        filterData: {
          prop: 'filterData',
          updateTrigger: 'filterData'
        }
      },
      updater: processGeoJSON
    },
    {
      key: 'clustering',
      triggers: {
        clusterRadius: {
          prop: 'clusterRadius'
        },
        zoom: {
          prop: 'zoom'
        },
        width: {
          prop: 'width'
        },
        height: {
          prop: 'height'
        }
      },
      updater: getClusters
    }
  ]
};

function getRadiusValueDomain(step, props, dimensionUpdater) {
  const {key} = dimensionUpdater;
  const {getRadiusValue} = props;
  const {layerData} = this.state;

  const valueDomain = [0, max(layerData.data, getRadiusValue)];
  this._setDimensionState(key, {valueDomain});
}

const clusterLayerDimensions = [
  defaultColorDimension,
  {
    key: 'radius',
    accessor: 'getRadius',
    nullValue: 0,
    updateSteps: [
      {
        key: 'getDomain',
        triggers: {
          value: {
            prop: 'getRadiusValue',
            updateTrigger: 'getRadiusValue'
          }
        },
        updater: getRadiusValueDomain
      },
      {
        key: 'getScaleFunc',
        triggers: {
          domain: {prop: 'radiusDomain'},
          range: {prop: 'radiusRange'},
          scaleType: {prop: 'radiusScaleType'}
        },
        updater: getDimensionScale
      }
    ],
    getSubLayerAccessor: getSubLayerRadius,
    getPickingInfo: (dimensionState, cell, layerProps) => {
      const radiusValue = layerProps.getRadiusValue(cell);
      return {radiusValue};
    }
  }
];

const defaultProps = {
  clusterRadius: defaultRadius,
  colorDomain: null,
  colorRange: DEFAULT_COLOR_RANGE,
  colorScaleType: SCALE_TYPES.quantize,
  radiusScaleType: SCALE_TYPES.sqrt,
  radiusRange: defaultRadiusRange,
  getPosition: {type: 'accessor', value: x => x.position},
  getColorValue: {type: 'accessor', value: defaultGetColorValue},
  getRadiusValue: {type: 'accessor', value: defaultGetRadiusValue}
};

export default class ClusterLayer extends AggregationLayer {
  initializeState() {
    const cpuAggregator = new CPUAggregator({
      aggregation: clusterAggregation,
      dimensions: clusterLayerDimensions
    });

    this.state = {
      cpuAggregator,
      aggregatorState: cpuAggregator.state
    };
    const attributeManager = this.getAttributeManager();
    attributeManager.add({
      positions: {size: 3, accessor: 'getPosition'}
    });
  }

  updateState({oldProps, props, changeFlags}) {
    this.setState({
      // make a copy of the internal state of cpuAggregator for testing
      aggregatorState: this.state.cpuAggregator.updateState(
        {oldProps, props, changeFlags},
        {
          viewport: this.context.viewport,
          attributes: this.getAttributes(),
          numInstances: this.getNumInstances(props)
        }
      )
    });
  }

  getPickingInfo({info}) {
    return this.state.cpuAggregator.getPickingInfo({info}, this.props);
  }

  _getSublayerUpdateTriggers() {
    return this.state.cpuAggregator.getUpdateTriggers(this.props);
  }

  _getSubLayerAccessors() {
    return {
      getRadius: this.state.cpuAggregator.getAccessor('radius', this.props),
      getFillColor: this.state.cpuAggregator.getAccessor('fillColor', this.props)
    };
  }

  renderLayers() {
    // for subclassing, override this method to return
    // customized sub layer props
    const {id, radiusScale} = this.props;
    const {cpuAggregator} = this.state;

    // base layer props
    const {visible, opacity, pickable, autoHighlight, highlightColor} = this.props;
    const updateTriggers = this._getSublayerUpdateTriggers();
    const accessors = this._getSubLayerAccessors();

    const distanceScale = getDistanceScales(this.context.viewport);
    const metersPerPixel = distanceScale.metersPerPixel[0];

    // return props to the sublayer constructor
    return new ScatterplotLayer({
      id: `${id}-cluster`,
      data: cpuAggregator.state.layerData.data,
      radiusScale: metersPerPixel * radiusScale,
      visible,
      opacity,
      pickable,
      autoHighlight,
      highlightColor,
      updateTriggers,
      ...accessors
    });
  }
}

ClusterLayer.layerName = 'ClusterLayer';
ClusterLayer.defaultProps = defaultProps;
