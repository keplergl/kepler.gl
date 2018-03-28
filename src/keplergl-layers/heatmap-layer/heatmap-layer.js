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
import {CHANNEL_SCALES, SCALE_FUNC, SCALE_TYPES} from 'constants/default-settings';
import {hexToRgb} from 'utils/color-utils';
import {geojsonFromPoints} from '../mapbox-utils';
import MapboxGLLayer from '../mapboxgl-layer';
import HeatmapLayerIcon from './heatmap-layer-icon';

const MAX_ZOOM_LEVEL = 18;
const DEFAULT_OPACITY = .8;

export const heatmapVisConfigs = {
  opacity: 'opacity',
  weight: 'weight',
  colorRange: 'colorRange',
  radius: 'heatmapRadius',
  weightRange: 'weight'
};

/**
 *
 * @param colorDomain
 * @param colorScale
 * @param visConfig
 * @return [
 *  0, "rgba(33,102,172,0)",
 *  0.2, "rgb(103,169,207)",
 *  0.4, "rgb(209,229,240)",
 *  0.6, "rgb(253,219,199)",
 *  0.8, "rgb(239,138,98)",
 *  1, "rgb(178,24,43)"
 * ]
 */
const heatmapDensity = (colorDomain, colorScale, visConfig) => {

  // this is work around to deal with ordinal scale type.
  // I checked other aggregate layers and we don't deal with ordinal scales
  const scaleType =  colorScale === SCALE_TYPES.ordinal ?
    SCALE_TYPES.quantize : colorScale;

  const scaleFunction = SCALE_FUNC[scaleType];

  const scale = scaleFunction()
    .domain(colorDomain)
    .range(visConfig.colorRange.colors);

  if (colorScale === SCALE_TYPES.ordinal) {
    scale.domain().map(level => {
      return [
        scale(level),
        `rgb(${hexToRgb(scale(level)).join(',')})` // color
      ];
    })
  }

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
      ...super.visualChannels,
      weight: {
        property: 'weight',
        field: 'weightField',
        scale: 'weightScale',
        domain: 'weightDomain',
        range: 'weightRange',
        key: 'weight',
        channelScaleType: CHANNEL_SCALES.sizeAggr
      }
    };
  }

  get layerIcon() {
    return HeatmapLayerIcon;
  }

  getDefaultLayerConfig(props = {}) {
    return {
      ...super.getDefaultLayerConfig(props),
      // add height visual channel
      weightField: null,
      weightDomain: [0, 1],
      weightRange: [0, 1],
      weightScale: 'linear'
    }
  }

  sameDataSelector = ({allData, filteredIndex, oldLayerData, opt = {}}) => {
    return Boolean(oldLayerData &&
      oldLayerData.data && oldLayerData.columns &&
      opt.sameData
    );
  };

  sameConfigSelector = ({oldLayerData, config}) => {
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

  rebuildSelector = createSelector(
    this.sameDataSelector,
    this.sameConfigSelector,
    (sameData, sameColumns) => !(sameData && sameColumns)
  );

  datasetSelector = config => config.dataId;
  isVisibleSelector = config => config.isVisible;
  visConfigSelector = config => config.visConfig;
  weightFieldSelector = config => config.weightField;
  colorDomainSelector = config => config.colorDomain;
  colorScaleSelector = config => config.colorScale;
  radiusSelector = config => config.visConfig.radius;

  computeHeatmapConfiguration = createSelector(
    this.datasetSelector,
    this.isVisibleSelector,
    this.visConfigSelector,
    this.weightFieldSelector,
    this.colorDomainSelector,
    this.colorScaleSelector,
    this.radiusSelector,
    (datasetId, isVisible, visConfig, weightField, colorDomain, colorScale, radius) => {
      // TODO: improve using setPaintProperty
      return {
        type: 'heatmap',
        source: datasetId,
        layout: {
          visibility: isVisible ? 'visible' : 'none'
        },
        maxzoom: MAX_ZOOM_LEVEL,
        paint: {
          'heatmap-weight': weightField ? [
            'interpolate',
            ['linear'],
            ['get', weightField.name],
            0, 0,
            MAX_ZOOM_LEVEL, visConfig.weight
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
            ...heatmapDensity(colorDomain, colorScale, visConfig)
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            MAX_ZOOM_LEVEL, radius // radius
          ],
          'heatmap-opacity': visConfig.opacity || DEFAULT_OPACITY
        }
      };
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

    const data = !shouldRebuild(this.sameDataSelector(options), this.sameConfigSelector(options)) ?
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
