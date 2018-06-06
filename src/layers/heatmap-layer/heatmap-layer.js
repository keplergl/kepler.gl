// Copyright (c) 2018 Uber Technologies, Inc.
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
import {CHANNEL_SCALES, SCALE_FUNC, ALL_FIELD_TYPES} from 'constants/default-settings';
import {hexToRgb} from 'utils/color-utils';
import {geojsonFromPoints} from '../mapbox-utils';
import MapboxGLLayer from '../mapboxgl-layer';
import HeatmapLayerIcon from './heatmap-layer-icon';

const MAX_ZOOM_LEVEL = 18;

export const heatmapVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  radius: 'heatmapRadius'
};

/**
 *
 * @param {Object} colorRange
 * @return {Array} [
 *  0, "rgba(33,102,172,0)",
 *  0.2, "rgb(103,169,207)",
 *  0.4, "rgb(209,229,240)",
 *  0.6, "rgb(253,219,199)",
 *  0.8, "rgb(239,138,98)",
 *  1, "rgb(178,24,43)"
 * ]
 */
const heatmapDensity = (colorRange) => {

  const scaleFunction = SCALE_FUNC.quantize;

  const scale = scaleFunction()
    .domain([0, 1])
    .range(colorRange.colors);

  return scale.range().reduce((bands, level) => {
    const invert = scale.invertExtent(level);
    return [
      ...bands,
      invert[0], // first value in the range
      `rgb(${hexToRgb(level).join(',')})` // color
    ]
  }, []);
};

const shouldRebuild = (sameData, sameConfig) => !(sameData && sameConfig);

class HeatmapLayer extends MapboxGLLayer {
  constructor(props) {
    super(props);
    this.registerVisConfig(heatmapVisConfigs);
  }

  get type() {
    return 'heatmap';
  }

  get visualChannels() {
    return {
      weight: {
        property: 'weight',
        field: 'weightField',
        scale: 'weightScale',
        domain: 'weightDomain',
        key: 'weight',
        // supportedFieldTypes can be determined by channelScaleType
        // or specified here
        defaultMeasure: 'density',
        supportedFieldTypes: [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer],
        channelScaleType: CHANNEL_SCALES.size
      }
    };
  }

  get layerIcon() {
    return HeatmapLayerIcon;
  }

  getVisualChannelDescription(channel) {
    return channel === 'color' ? {
      label: 'color',
      measure: 'Density'
    } : {
      label: 'weight',
      measure: this.config.weightField ? this.config.weightField.name : 'Density'
    }
  }

  getDefaultLayerConfig(props = {}) {

    // mapbox heatmap layer color is always based on density
    // no need to set colorField, colorDomain and colorScale
    /* eslint-disable no-unused-vars */
    const {colorField, colorDomain, colorScale, ...layerConfig} = {
      ...super.getDefaultLayerConfig(props),

      weightField: null,
      weightDomain: [0, 1],
      weightScale: 'linear'
    };
    /* eslint-enable no-unused-vars */

    return layerConfig;
  }

  isSameData = ({allData, filteredIndex, oldLayerData, opt = {}}, config) => {
    return Boolean(oldLayerData && oldLayerData.columns === config.columns &&
      opt.sameData
    );
  };

  isSameConfig = ({oldLayerData, config}) => {
    // columns must use the same filedIdx
    // this is a fast way to compare columns object
    const {
      columns,
      weightField
    } = config;

    if (!oldLayerData) {
      return false;
    }

    const sameColumns = columns === oldLayerData.columns;
    const sameWeightField = weightField === oldLayerData.weightField;
    return sameColumns && sameWeightField;
  };

  datasetSelector = config => config.dataId;
  isVisibleSelector = config => config.isVisible;
  visConfigSelector = config => config.visConfig;
  weightFieldSelector = config => config.weightField ? config.weightField.name : null;
  weightDomainSelector = config => config.weightDomain;

  computeHeatmapConfiguration = createSelector(
    this.datasetSelector,
    this.isVisibleSelector,
    this.visConfigSelector,
    this.weightFieldSelector,
    this.weightDomainSelector,

    (datasetId, isVisible, visConfig, weightField, weightDomain) => {

      const layer = {
        type: 'heatmap',
        id: this.id,
        source: datasetId,
        layout: {
          visibility: isVisible ? 'visible' : 'none'
        },
        maxzoom: MAX_ZOOM_LEVEL,
        paint: {
          'heatmap-weight': weightField ? [
            'interpolate',
            ['linear'],
            ['get', weightField],
            weightDomain[0], 0,
            weightDomain[1], 1
          ] : 1,
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            MAX_ZOOM_LEVEL, 3
          ],
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
            0, 2,
            MAX_ZOOM_LEVEL, visConfig.radius // radius
          ],
          'heatmap-opacity': visConfig.opacity
        }
      };

      return layer;
    }
  );

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const options = {
      allData,
      filteredIndex,
      oldLayerData,
      opt,
      config: this.config
    };

    const {weightField} = this.config;
    const isSameData = this.isSameData(options, this.config);
    const isSameConfig = this.isSameConfig(options);

    const data = !shouldRebuild(isSameData, isSameConfig) ?
      null :
      geojsonFromPoints(
        allData,
        filteredIndex,
        this.config.columns,
        weightField ? [weightField] : []
      );

    const newConfig = this.computeHeatmapConfiguration(this.config);
    newConfig.id = this.id;

    return {
      columns: this.config.columns,
      config: newConfig,
      data,
      weightField
    };
  }
}

export default HeatmapLayer;
