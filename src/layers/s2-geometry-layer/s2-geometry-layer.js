// Copyright (c) 2020 Uber Technologies, Inc.
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

import {S2Layer} from '@deck.gl/geo-layers';
import {hexToRgb} from 'utils/color-utils';
import {HIGHLIGH_COLOR_3D} from 'constants/default-settings';
import Layer from '../base-layer';
import S2LayerIcon from './s2-layer-icon';
import {getS2Center} from './s2-utils';

export const S2_TOKEN_FIELDS = {
  token: ['s2', 's2_token']
};

export const s2RequiredColumns = ['token'];
export const S2TokenAccessor = ({token}) => d => d[token.fieldIdx];

export const S2VisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  filled: {
    type: 'boolean',
    label: 'Fill Color',
    defaultValue: true,
    property: 'filled'
  },

  // height
  enable3d: 'enable3d',
  elevationScale: 'elevationScale',
  elevationPercentile: 'elevationPercentile',
  sizeRange: 'elevationRange'
};

export default class S2GeometryLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(S2VisConfigs);
    this.getPositionAccessor = () => S2TokenAccessor(this.config.columns);
  }

  get type() {
    return 's2';
  }

  get name() {
    return 'S2';
  }

  get requiredLayerColumns() {
    return s2RequiredColumns;
  }

  get layerIcon() {
    return S2LayerIcon;
  }

  static findDefaultLayerProps({fields = []}) {
    const foundColumns = this.findDefaultColumnField(S2_TOKEN_FIELDS, fields);
    if (!foundColumns || !foundColumns.length) {
      return {props: []};
    }

    return {
      props: foundColumns.map(columns => ({
        isVisible: true,
        label: 'S2',
        columns
      }))
    };
  }

  calculateDataAttribute({allData, filteredIndex}, getS2Token) {
    const data = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const token = getS2Token(allData[index]);

      if (token) {
        data.push({
          // keep a reference to the original data index
          index,
          data: allData[index],
          token
        });
      }
    }
    return data;
  }

  updateLayerMeta(allData, getS2Token) {
    const centroids = allData.reduce((acc, entry) => {
      const s2Token = getS2Token(entry);
      return s2Token ? [...acc, getS2Center(s2Token)] : acc;
    }, []);

    const bounds = this.getPointsBounds(centroids);
    this.dataToFeature = {centroids};
    this.updateMeta({bounds});
  }

  getDefaultLayerConfig(props = {}) {
    return {
      ...super.getDefaultLayerConfig(props),

      // filled
      filled: true
    };
  }

  /* eslint-disable complexity */
  formatLayerData(datasets, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorDomain,
      colorField,
      color,
      sizeField,
      sizeScale,
      sizeDomain,
      visConfig: {sizeRange, colorRange}
    } = this.config;

    const {gpuFilter} = datasets[this.config.dataId];
    const getS2Token = this.getPositionAccessor();
    const {data} = this.updateData(datasets, oldLayerData);

    // color
    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(c => hexToRgb(c))
      );

    // height
    const sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange, 0);

    const getFillColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : color;

    const getElevation = sScale
      ? d => this.getEncodedChannelValue(sScale, d.data, sizeField, 0)
      : 0;

    return {
      data,
      getS2Token,
      getFillColor,
      getElevation,
      getFilterValue: gpuFilter.filterValueAccessor()
    };
  }
  /* eslint-enable complexity */

  renderLayer(opts) {
    const {data, gpuFilter, interactionConfig, mapState} = opts;

    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const {config} = this;
    const {visConfig} = config;

    const updateTriggers = {
      getElevation: {
        sizeField: config.sizeField,
        sizeRange: visConfig.sizeRange
      },
      getFillColor: {
        color: config.color,
        colorField: config.colorField,
        colorRange: config.visConfig.colorRange,
        colorScale: config.colorScale
      },
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    return [
      new S2Layer({
        ...defaultLayerProps,
        ...interactionConfig,
        ...data,
        getS2Token: d => d.token,

        // color
        opacity: visConfig.opacity,
        filled: visConfig.filled,

        // highlight
        autoHighlight: true,
        highlightColor: HIGHLIGH_COLOR_3D,

        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,

        // render
        pickable: true,

        updateTriggers,
        elevationLowerPercentile: visConfig.elevationPercentile[0],
        elevationUpperPercentile: visConfig.elevationPercentile[1]
      })
    ];
  }
}
