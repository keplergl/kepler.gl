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

import {createSelector} from 'reselect';
import memoize from 'lodash.memoize';
import {CHANNEL_SCALES, SCALE_FUNC, ALL_FIELD_TYPES} from 'constants/default-settings';
import {hexToRgb} from 'utils/color-utils';
import MapboxGLLayer, {MapboxLayerGLConfig} from '../mapboxgl-layer';
import HeatmapLayerIcon from './heatmap-layer-icon';
import {LayerColumn, LayerWeightConfig, VisualChannels} from '../base-layer';
import {DataContainerInterface} from 'utils/table-utils/data-container-interface';
import {VisConfigColorRange, VisConfigNumber} from '../layer-factory';
import {ColorRange} from 'constants/color-ranges';
import {HexColor, Merge} from 'reducers';

export type HeatmapLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  radius: VisConfigNumber;
};

export type HeatmapLayerColumnsConfig = {lat: LayerColumn; lng: LayerColumn};

export type HeatmapLayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
  radius: number;
};

export type HeatmapLayerVisualChannelConfig = LayerWeightConfig;
export type HeatmapLayerConfig = Merge<
  MapboxLayerGLConfig,
  {columns: HeatmapLayerColumnsConfig; visConfig: HeatmapLayerVisConfig}
> &
  HeatmapLayerVisualChannelConfig;

export const MAX_ZOOM_LEVEL = 18;

export const pointPosAccessor = ({lat, lng}: HeatmapLayerColumnsConfig) => (
  dc: DataContainerInterface
) => d => [dc.valueAt(d.index, lng.fieldIdx), dc.valueAt(d.index, lat.fieldIdx)];

export const pointColResolver = ({lat, lng}: HeatmapLayerColumnsConfig) =>
  `${lat.fieldIdx}-${lng.fieldIdx}`;

export const heatmapVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  radius: 'heatmapRadius'
};

/**
 *
 * @param colorRange
 * @return [
 *  0, "rgba(33,102,172,0)",
 *  0.2, "rgb(103,169,207)",
 *  0.4, "rgb(209,229,240)",
 *  0.6, "rgb(253,219,199)",
 *  0.8, "rgb(239,138,98)",
 *  1, "rgb(178,24,43)"
 * ]
 */
const heatmapDensity = (colorRange: ColorRange): string[] => {
  const scaleFunction = SCALE_FUNC.quantize;

  const colors: HexColor[] = ['#000000', ...colorRange.colors];

  const scale = scaleFunction<HexColor>()
    .domain([0, 1])
    .range(colors);

  const colorDensity = scale.range().reduce((bands, level) => {
    const invert = scale.invertExtent(level);
    return [
      ...bands,
      invert[0], // first value in the range
      `rgb(${hexToRgb(level).join(',')})` // color
    ];
  }, []);
  colorDensity[1] = 'rgba(0,0,0,0)';
  return colorDensity;
};

class HeatmapLayer extends MapboxGLLayer {
  declare visConfigSettings: HeatmapLayerVisConfigSettings;
  declare config: HeatmapLayerConfig;

  getPosition: (config: HeatmapLayerColumnsConfig) => any;

  constructor(props) {
    super(props);
    this.registerVisConfig(heatmapVisConfigs);
    this.getPosition = memoize(pointPosAccessor, pointColResolver);
  }

  get type(): 'heatmap' {
    return 'heatmap';
  }

  get visualChannels(): VisualChannels {
    return {
      // @ts-expect-error
      weight: {
        property: 'weight',
        field: 'weightField',
        scale: 'weightScale',
        domain: 'weightDomain',
        key: 'weight',
        // supportedFieldTypes can be determined by channelScaleType
        // or specified here
        defaultMeasure: 'property.density',
        supportedFieldTypes: [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer],
        channelScaleType: CHANNEL_SCALES.size
      }
    };
  }

  get layerIcon() {
    return HeatmapLayerIcon;
  }

  getVisualChannelDescription(channel) {
    return channel === 'color'
      ? {
          label: 'property.color',
          measure: 'property.density'
        }
      : {
          label: 'property.weight',
          measure: this.config.weightField ? this.config.weightField.name : 'property.density'
        };
  }

  getDefaultLayerConfig(props = {}): HeatmapLayerConfig {
    // mapbox heatmap layer color is always based on density
    // no need to set colorField, colorDomain and colorScale
    const {colorField, colorDomain, colorScale, ...layerConfig} = {
      ...super.getDefaultLayerConfig(props),

      weightField: null,
      weightDomain: [0, 1],
      weightScale: 'linear'
    };

    return layerConfig;
  }

  getPositionAccessor(dataContainer) {
    return this.getPosition(this.config.columns)(dataContainer);
  }

  updateLayerMeta(dataContainer) {
    const getPosition = this.getPositionAccessor(dataContainer);
    const bounds = this.getPointsBounds(dataContainer, getPosition);
    this.updateMeta({bounds});
  }

  columnsSelector = config => pointColResolver(config.columns);
  visConfigSelector = config => config.visConfig;
  weightFieldSelector = config => (config.weightField ? config.weightField.name : null);
  weightDomainSelector = config => config.weightDomain;

  paintSelector = createSelector(
    this.visConfigSelector,
    this.weightFieldSelector,
    this.weightDomainSelector,
    (visConfig, weightField, weightDomain) => ({
      'heatmap-weight': weightField
        ? ['interpolate', ['linear'], ['get', weightField], weightDomain[0], 0, weightDomain[1], 1]
        : 1,
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        ...heatmapDensity(visConfig.colorRange)
      ],
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        2,
        MAX_ZOOM_LEVEL,
        visConfig.radius // radius
      ],
      'heatmap-opacity': visConfig.opacity
    })
  );

  computeHeatmapConfiguration = createSelector(
    this.sourceSelector,
    this.filterSelector,
    this.paintSelector,
    (source, filter, paint) => {
      return {
        type: 'heatmap',
        id: this.id,
        source,
        layout: {
          visibility: 'visible'
        },
        maxzoom: MAX_ZOOM_LEVEL,
        paint,
        ...(this.isValidFilter(filter) ? {filter} : {})
      };
    }
  );

  formatLayerData(datasets, oldLayerData) {
    const {weightField} = this.config;
    const {dataContainer} = datasets[this.config.dataId];
    const getPosition = this.getPositionAccessor(dataContainer);
    const {data} = this.updateData(datasets, oldLayerData);

    const newConfig = this.computeHeatmapConfiguration(this.config, datasets);
    newConfig.id = this.id;

    return {
      columns: this.config.columns,
      config: newConfig,
      data,
      weightField,
      getPosition
    };
  }
}

export default HeatmapLayer;
