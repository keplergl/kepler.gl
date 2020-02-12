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

import Layer from '../base-layer';
import {GeoJsonLayer} from '@deck.gl/layers';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import EnhancedColumnLayer from 'deckgl-layers/column-layer/enhanced-column-layer';
import {getCentroid, idToPolygonGeo, h3IsValid} from './h3-utils';
import H3HexagonLayerIcon from './h3-hexagon-layer-icon';
import {CHANNEL_SCALES, HIGHLIGH_COLOR_3D} from 'constants/default-settings';
import {hexToRgb} from 'utils/color-utils';

const DEFAULT_LINE_SCALE_VALUE = 8;

export const HEXAGON_ID_FIELDS = {
  hex_id: ['hex_id', 'hexagon_id', 'h3_id']
};

export const hexIdRequiredColumns = ['hex_id'];
export const hexIdAccessor = ({hex_id}) => d => d.data[hex_id.fieldIdx];
export const defaultElevation = 500;
export const defaultCoverage = 1;

export const HexagonIdVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  coverageRange: 'coverageRange',
  elevationScale: 'elevationScale'
};

export default class HexagonIdLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(HexagonIdVisConfigs);
    this.getPositionAccessor = () => hexIdAccessor(this.config.columns);
  }

  get type() {
    return 'hexagonId';
  }

  get name() {
    return 'H3';
  }

  get requiredLayerColumns() {
    return hexIdRequiredColumns;
  }

  get layerIcon() {
    // use hexagon layer icon for now
    return H3HexagonLayerIcon;
  }

  get visualChannels() {
    return {
      ...super.visualChannels,
      size: {
        ...super.visualChannels.size,
        property: 'height'
      },
      coverage: {
        property: 'coverage',
        field: 'coverageField',
        scale: 'coverageScale',
        domain: 'coverageDomain',
        range: 'coverageRange',
        key: 'coverage',
        channelScaleType: CHANNEL_SCALES.radius
      }
    };
  }

  static findDefaultLayerProps({fields = []}) {
    const foundColumns = this.findDefaultColumnField(HEXAGON_ID_FIELDS, fields);
    if (!foundColumns || !foundColumns.length) {
      return {props: []};
    }

    return {
      props: foundColumns.map(columns => ({
        isVisible: true,
        label: 'H3 Hexagon',
        columns
      }))
    };
  }

  getDefaultLayerConfig(props = {}) {
    return {
      ...super.getDefaultLayerConfig(props),

      // add height visual channel
      coverageField: null,
      coverageDomain: [0, 1],
      coverageScale: 'linear'
    };
  }

  calculateDataAttribute({allData, filteredIndex}, getHexId) {
    const data = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const id = getHexId({data: allData[index]});
      const centroid = this.dataToFeature.centroids[index];

      if (centroid) {
        data.push({
          // keep a reference to the original data index
          index,
          data: allData[index],
          id,
          centroid
        });
      }
    }
    return data;
  }

  // TODO: fix complexity
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
      coverageField,
      coverageScale,
      coverageDomain,
      visConfig: {sizeRange, colorRange, coverageRange}
    } = this.config;

    const {gpuFilter} = datasets[this.config.dataId];
    const getHexId = this.getPositionAccessor();
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

    // coverage
    const coScale =
      coverageField && this.getVisChannelScale(coverageScale, coverageDomain, coverageRange, 0);

    const getElevation = sScale
      ? d => this.getEncodedChannelValue(sScale, d.data, sizeField, 0)
      : defaultElevation;

    const getFillColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : color;

    const getCoverage = coScale
      ? d => this.getEncodedChannelValue(coScale, d.data, coverageField, 0)
      : defaultCoverage;

    return {
      data,
      getElevation,
      getFillColor,
      getHexId,
      getCoverage,
      getFilterValue: gpuFilter.filterValueAccessor()
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(allData, getHexId) {
    const centroids = allData.map((d, index) => {
      const id = getHexId({data: d});
      if (!h3IsValid(id)) {
        return null;
      }
      // save a reference of centroids to dataToFeature
      // so we don't have to re calculate it again
      return getCentroid({id});
    });

    const bounds = this.getPointsBounds(centroids);
    this.dataToFeature = {centroids};
    this.updateMeta({bounds});
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState} = opts;

    const zoomFactor = this.getZoomFactor(mapState);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const {config} = this;
    const {visConfig} = config;

    const h3HexagonLayerTriggers = {
      getFillColor: {
        color: config.color,
        colorField: config.colorField,
        colorRange: visConfig.colorRange,
        colorScale: config.colorScale
      },
      getElevation: {
        sizeField: config.sizeField,
        sizeRange: visConfig.sizeRange,
        sizeScale: config.sizeScale
      },
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    const columnLayerTriggers = {
      getCoverage: {
        coverageField: config.coverageField,
        coverageRange: visConfig.coverageRange
      }
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    return [
      new H3HexagonLayer({
        ...defaultLayerProps,
        ...data,
        wrapLongitude: false,

        getHexagon: x => x.id,

        // coverage
        coverage: config.coverageField ? 1 : visConfig.coverage,

        // highlight
        autoHighlight: Boolean(config.sizeField),
        highlightColor: HIGHLIGH_COLOR_3D,

        // elevation
        extruded: Boolean(config.sizeField),
        elevationScale: visConfig.elevationScale * eleZoomFactor,

        // render
        updateTriggers: h3HexagonLayerTriggers,
        _subLayerProps: {
          'hexagon-cell': {
            type: EnhancedColumnLayer,
            getCoverage: data.getCoverage,
            updateTriggers: columnLayerTriggers
          }
        }
      }),
      ...(this.isLayerHovered(objectHovered) && !config.sizeField
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              data: [idToPolygonGeo(objectHovered)],
              getLineColor: config.highlightColor,
              lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
              wrapLongitude: false
            })
          ]
        : [])
    ];
  }
}
