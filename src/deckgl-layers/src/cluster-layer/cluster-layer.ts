// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CompositeLayer, GetPickingInfoParams, LayersList, PickingInfo} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';

import geoViewport from '@mapbox/geo-viewport';
import CPUAggregator, {
  AggregationType,
  defaultColorDimension,
  DimensionType,
  getDimensionScale
} from '../layer-utils/cpu-aggregator';
import {max} from 'd3-array';

import {SCALE_TYPES, DEFAULT_COLOR_RANGE, LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import ClusterBuilder, {getGeoJSON} from '../layer-utils/cluster-utils';
import {RGBAColor} from '@kepler.gl/types';

const defaultRadius = LAYER_VIS_CONFIGS.clusterRadius.defaultValue;
const defaultRadiusRange = LAYER_VIS_CONFIGS.clusterRadiusRange.defaultValue;
const defaultMinPointCount = LAYER_VIS_CONFIGS.minClusterSize.defaultValue;

const defaultGetColorValue = (points: Record<string, unknown>[]) => points.length;
const defaultGetRadiusValue = (cell: {filteredPoints?: unknown[]; points: unknown[]}) =>
  cell.filteredPoints ? cell.filteredPoints.length : cell.points.length;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function processGeoJSON(this: CPUAggregator, step, props, aggregation, {viewport}) {
  const {data, getPosition, filterData} = props;
  const geoJSON = getGeoJSON(data, getPosition, filterData);
  const clusterBuilder = new ClusterBuilder();

  this.setState({geoJSON, clusterBuilder});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getClusters(this: CPUAggregator, step, props, aggregation, {viewport}) {
  const {geoJSON, clusterBuilder} = this.state;
  const {clusterRadius, zoom, width, height, minPointCount} = props;
  const {longitude, latitude} = viewport;

  // zoom needs to be an integer for the different map utils. Also helps with cache key.
  const bbox = geoViewport.bounds([longitude, latitude], zoom, [width, height]);
  const clusters =
    clusterBuilder?.clustersAtZoom({bbox, clusterRadius, geoJSON, zoom, minPointCount}) ?? [];

  this.setState({
    layerData: {data: clusters}
  });
}

function getSubLayerRadius(
  dimensionState: {scaleFunc: (v: number) => number},
  dimension: DimensionType,
  layerProps: Record<string, any>
) {
  return (cell: Record<string, unknown>): number => {
    const {getRadiusValue} = layerProps;
    const {scaleFunc} = dimensionState;
    return scaleFunc(getRadiusValue(cell));
  };
}

export const clusterAggregation: AggregationType = {
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
        },
        minPointCount: {
          prop: 'minPointCount'
        }
      },
      updater: getClusters
    }
  ]
};

function getRadiusValueDomain(this: CPUAggregator, step, props, dimensionUpdater) {
  const {key} = dimensionUpdater;
  const {getRadiusValue} = props;
  const {layerData} = this.state;

  const valueDomain = [0, max(layerData.data as unknown as number[], getRadiusValue)];
  this._setDimensionState(key, {valueDomain});
}

const clusterLayerDimensions: [DimensionType<RGBAColor>, DimensionType<number>] = [
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
      const {scaleFunc} = dimensionState;
      const scaledRadiusValue = scaleFunc ? scaleFunc(radiusValue) : radiusValue;

      return {radiusValue, scaledRadiusValue};
    }
  }
];

const defaultProps = {
  clusterRadius: defaultRadius,
  minPointCount: defaultMinPointCount,
  colorDomain: null,
  colorRange: DEFAULT_COLOR_RANGE,
  colorScaleType: SCALE_TYPES.quantize,
  radiusScaleType: SCALE_TYPES.sqrt,
  radiusRange: defaultRadiusRange,
  getPosition: {type: 'accessor', value: x => x.position},
  getColorValue: {type: 'accessor', value: defaultGetColorValue},
  getRadiusValue: {type: 'accessor', value: defaultGetRadiusValue},
  // Supplied by kepler's ClusterLayer when a point-count label is on.
  // compare: false so a new callback identity does not recluster.
  renderCountLabels: {type: 'function', value: null, compare: false, optional: true},
  countLabelConfig: {type: 'object', value: null, compare: true, optional: true}
};

interface ClusterLayerState {
  cpuAggregator: CPUAggregator;
  aggregatorState: CPUAggregator['state'];
}

export default class ClusterLayer extends CompositeLayer {
  initializeState() {
    const cpuAggregator = new CPUAggregator({
      aggregation: clusterAggregation,
      dimensions: clusterLayerDimensions
    });

    this.state = {
      cpuAggregator,
      aggregatorState: cpuAggregator.state
    };
  }

  updateState({
    oldProps,
    props,
    changeFlags
  }: {
    oldProps: Record<string, any>;
    props: Record<string, any>;
    changeFlags: Record<string, any>;
  }) {
    this.setState({
      aggregatorState: (this.state as unknown as ClusterLayerState).cpuAggregator.updateState(
        {oldProps, props, changeFlags},
        {
          viewport: this.context.viewport,
          // @ts-expect-error props passed for internal calculation
          numInstances: this.getNumInstances(props)
        }
      )
    });
  }

  getPickingInfo({info}: GetPickingInfoParams): PickingInfo {
    const obj = (this.state as unknown as ClusterLayerState).cpuAggregator.getPickingInfo(
      {info},
      this.props
    );
    if (obj?.object) {
      const distanceScale = this.context.viewport.getDistanceScales();
      const metersPerPixel = distanceScale.metersPerUnit[0] / this.context.viewport.scale;
      obj.object.scaledRadiusValue = obj.object.scaledRadiusValue * metersPerPixel;
    }

    return obj as PickingInfo;
  }

  _getSublayerUpdateTriggers() {
    return (this.state as unknown as ClusterLayerState).cpuAggregator.getUpdateTriggers(this.props);
  }

  _getSubLayerAccessors() {
    return {
      getRadius: (this.state as unknown as ClusterLayerState).cpuAggregator.getAccessor(
        'radius',
        this.props
      ),
      getFillColor: (this.state as unknown as ClusterLayerState).cpuAggregator.getAccessor(
        'fillColor',
        this.props
      )
    };
  }

  renderLayers() {
    const {id, radiusScale, visible, opacity, pickable, autoHighlight, highlightColor} = this
      .props as Record<string, any>;
    const {cpuAggregator} = this.state as unknown as ClusterLayerState;
    const updateTriggers = this._getSublayerUpdateTriggers();
    const accessors = this._getSubLayerAccessors();

    const distanceScale = this.context.viewport.getDistanceScales();
    const metersPerPixel = distanceScale.metersPerUnit[0] / this.context.viewport.scale;

    const clusters = cpuAggregator.state.layerData.data;
    // return props to the sublayer constructor
    const scatterplot = new ScatterplotLayer({
      id: `${id}-cluster`,
      data: clusters,
      radiusScale: metersPerPixel * radiusScale,
      visible,
      opacity,
      pickable,
      autoHighlight,
      highlightColor,
      updateTriggers,
      parameters: {
        depthMask: false
      },
      ...accessors
    });

    const renderCountLabels = (
      this.props as {
        renderCountLabels?: (data: {position: [number, number]; count: number}[]) => LayersList;
      }
    ).renderCountLabels;
    if (typeof renderCountLabels !== 'function') {
      return scatterplot;
    }
    const labelData = clusterCountLabels(clusters);
    const labels = renderCountLabels(labelData) ?? [];
    return labels.length ? [scatterplot, ...labels] : scatterplot;
  }
}

function clusterCountLabels(
  clusters:
    | {points?: unknown[]; filteredPoints?: unknown[] | null; position?: number[]}[]
    | null
    | undefined
): {position: [number, number]; count: number}[] {
  if (!clusters) {
    return [];
  }
  const labels: {position: [number, number]; count: number}[] = [];
  for (const cluster of clusters) {
    const count = cluster.filteredPoints
      ? cluster.filteredPoints.length
      : cluster.points?.length ?? 0;
    const position = cluster.position;
    if (
      count > 0 &&
      Array.isArray(position) &&
      Number.isFinite(position[0]) &&
      Number.isFinite(position[1])
    ) {
      // Ground position only. Extruded columns are not a cluster feature, and
      // GeoJSON labels likewise stay at the feature base.
      labels.push({position: [position[0], position[1]], count});
    }
  }
  return labels;
}

ClusterLayer.layerName = 'ClusterLayer';
ClusterLayer.defaultProps = defaultProps;
