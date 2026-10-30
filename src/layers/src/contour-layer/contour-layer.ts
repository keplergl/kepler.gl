// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GeoJsonLayer} from '@deck.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {VisConfigNumber} from '@kepler.gl/types';
import {LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import Layer, {LayerBaseConfigPartial} from '../base-layer';
import {getFilterDataFunc} from '../aggregation-layer';
import ContourLayerIcon from './contour-layer-icon';
import {buildScalarGrid, ContourFeature, generateContours, ScalarSample} from './contour-utils';

const numberConfig = (
  property: string,
  defaultValue: number,
  range: [number, number],
  step: number
): VisConfigNumber => ({
  type: 'number',
  property,
  defaultValue,
  range,
  step,
  isRanged: false,
  group: 'contour',
  label: `layerVisConfigs.contour.${property}`
});

export const contourVisConfigs = {
  opacity: 'opacity',
  levels: numberConfig('levels', 7, [2, 20], 1),
  smoothing: {
    ...numberConfig('smoothing', 1.5, [0, 6], 0.25),
    description: 'layerVisConfigs.contour.smoothingDescription'
  },
  fillOpacity: numberConfig('fillOpacity', 0.075, [0, 0.3], 0.005),
  thickness: numberConfig('thickness', 1.5, [0.5, 5], 0.1),
  filled: {...LAYER_VIS_CONFIGS.filled, defaultValue: true},
  stroked: 'stroked',
  below: {
    type: 'boolean',
    property: 'below',
    defaultValue: true,
    label: 'layerVisConfigs.contour.below'
  },
  customRange: {
    type: 'boolean',
    property: 'customRange',
    defaultValue: false,
    label: 'layerVisConfigs.contour.customRange'
  },
  minimum: {...numberConfig('minimum', 0, [-100, 100], 0.1), allowCustomValue: true},
  maximum: {...numberConfig('maximum', 100, [-100, 100], 0.1), allowCustomValue: true}
};

export default class ContourLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(contourVisConfigs);
  }

  get type() {
    return 'contour';
  }
  get name() {
    return 'Contour';
  }
  get layerIcon() {
    return ContourLayerIcon;
  }
  get isAggregated() {
    return true;
  }
  get visualChannels() {
    return {};
  }
  get columnPairs() {
    return this.defaultPointColumnPairs;
  }
  get columnLabels() {
    return {lat: 'contour.lat', lng: 'contour.lng', value: 'contour.value'};
  }
  get supportedColumnModes() {
    return [{key: 'grid', label: 'Scalar grid', requiredColumns: ['lat', 'lng', 'value']}];
  }
  get noneLayerDataAffectingProps() {
    return [...super.noneLayerDataAffectingProps, 'color', 'fillOpacity', 'filled', 'stroked'];
  }
  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    return {...super.getDefaultLayerConfig(props), color: props.color ?? [36, 218, 211]};
  }

  formatLayerData(datasets: Datasets): {data: ContourFeature[]} {
    this.errorMessage = null;
    const dataset = this.config.dataId ? datasets[this.config.dataId] : null;
    if (!dataset || !this.hasAllColumns()) return {data: []};
    const {dataContainer, gpuFilter, filteredIndex} = dataset;
    const {lat, lng, value} = this.config.columns;
    const selected = new Set(filteredIndex);
    const activeFilter =
      gpuFilter &&
      Object.values(gpuFilter.filterValueUpdateTriggers).some(trigger => trigger !== null);
    const matches = activeFilter
      ? getFilterDataFunc(gpuFilter.filterRange, gpuFilter.filterValueAccessor(dataContainer)())
      : null;
    const samples: ScalarSample[] = [];
    for (let index = 0; index < dataContainer.numRows(); index++) {
      // Keep the source lattice even when filters remove an entire row/column.
      samples.push({
        longitude: dataContainer.valueAt(index, lng.fieldIdx),
        latitude: dataContainer.valueAt(index, lat.fieldIdx),
        value:
          selected.has(index) && (!matches || matches({index}))
            ? dataContainer.valueAt(index, value.fieldIdx)
            : null
      });
    }
    try {
      const grid = buildScalarGrid(samples);
      if (grid)
        this.updateMeta({
          bounds: [
            grid.longitude,
            grid.latitude,
            grid.longitude + (grid.width - 1) * grid.stepLng,
            grid.latitude + (grid.height - 1) * grid.stepLat
          ]
        });
      const {smoothing, levels, below, customRange, minimum, maximum} = this.config.visConfig;
      return {
        data: generateContours(grid, {
          smoothing,
          levels,
          below,
          domain: customRange ? [minimum, maximum] : undefined
        })
      };
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to generate contours.';
      return {data: []};
    }
  }

  getHoverData(object: ContourFeature | null) {
    if (!object) return null;
    const {threshold, below} = object.properties;
    const field = String(this.config.columns.value.value || 'value');
    return {aggregatedData: {[field]: {value: threshold, measure: below ? '≤' : '≥'}}};
  }

  renderLayer(opts) {
    const {data} = opts;
    if (!data?.data?.length || !this.config.isVisible || opts.visible === false) return [];
    const {color, visConfig} = this.config;
    const defaultProps = this.getDefaultDeckLayerProps(opts);
    const shared = {
      ...defaultProps,
      data: data.data,
      extensions: [],
      // Both passes are coplanar; render fills first and outlines above all fills.
      parameters: {...defaultProps.parameters, depthMask: false},
      autoHighlight: false,
      extruded: false
    };
    return [
      ...(visConfig.filled
        ? [
            new GeoJsonLayer<ContourFeature['properties']>({
              ...shared,
              id: `${this.id}-fill`,
              filled: true,
              stroked: false,
              getFillColor: [...color, Math.round(255 * visConfig.fillOpacity)],
              updateTriggers: {getFillColor: [color, visConfig.fillOpacity]}
            })
          ]
        : []),
      ...(visConfig.stroked
        ? [
            new GeoJsonLayer<ContourFeature['properties']>({
              ...shared,
              id: `${this.id}-outline`,
              filled: false,
              stroked: true,
              getLineColor: feature => [
                ...color,
                Math.round(
                  255 * (0.3 + (0.7 * feature.properties.rank) / Math.max(1, data.data.length - 1))
                )
              ],
              getLineWidth: visConfig.thickness,
              lineWidthUnits: 'pixels',
              lineJointRounded: true,
              lineCapRounded: true,
              updateTriggers: {getLineColor: [color, data.data.length]}
            })
          ]
        : [])
    ];
  }
}
