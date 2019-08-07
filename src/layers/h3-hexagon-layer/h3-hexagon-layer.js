// Copyright (c) 2019 Uber Technologies, Inc.
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

import memoize from 'lodash.memoize';

import Layer from '../base-layer';
import {GeoJsonLayer, H3HexagonLayer} from 'deck.gl';
import EnhancedColumnLayer from 'deckgl-layers/column-layer/enhanced-column-layer';
import {getVertices, getCentroid, idToPolygonGeo} from './h3-utils';
import H3HexagonLayerIcon from './h3-hexagon-layer-icon';
import {CHANNEL_SCALES, HIGHLIGH_COLOR_3D} from 'constants/default-settings';

export const HEXAGON_ID_FIELDS = {
  hex_id: ['hex_id', 'hexagon_id', 'h3_id']
};

export const hexIdRequiredColumns = ['hex_id'];
export const hexIdAccessor = ({hex_id}) => d => d[hex_id.fieldIdx];
export const hexIdResolver = ({hex_id}) => hex_id.fieldIdx;

export const HexagonIdVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  coverageRange: 'coverageRange',
  elevationScale: 'elevationScale'
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return [r, g, b];
}

export default class HexagonIdLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(HexagonIdVisConfigs);
    this.getHexId = memoize(hexIdAccessor, hexIdResolver);
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

  static findDefaultLayerProps({fields}, foundLayers) {
    const foundColumns = this.findDefaultColumnField(HEXAGON_ID_FIELDS, fields);
    if (!foundColumns || !foundColumns.length) {
      return {props: null, foundLayers};
    }

    return {
      props: foundColumns.map(columns => ({
        isVisible: true,
        label: 'H3 Hexagon',
        columns
      })),
      foundLayers
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

  // TODO: fix complexity
  /* eslint-disable complexity */
  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorDomain,
      colorField,
      color,
      columns,
      sizeField,
      sizeScale,
      sizeDomain,
      coverageField,
      coverageScale,
      coverageDomain,
      visConfig: {sizeRange, colorRange, coverageRange}
    } = this.config;

    // color
    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(c => hexToRgb(c))
      );

    // height
    const sScale =
      sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange, 0);

    // coverage
    const coScale =
      coverageField &&
      this.getVisChannelScale(coverageScale, coverageDomain, coverageRange, 0);

    const getHexId = this.getHexId(columns);

    if (!oldLayerData || oldLayerData.getHexId !== getHexId) {
      this.updateLayerMeta(allData, getHexId);
    }

    let data;
    if (
      oldLayerData &&
      oldLayerData.data &&
      opt.sameData &&
      oldLayerData.getHexId === getHexId
    ) {
      data = oldLayerData.data;
    } else {
      data = filteredIndex.reduce((accu, index, i) => {
        const id = getHexId(allData[index]);
        const centroid = this.dataToFeature.centroids[index];

        if (centroid) {
          accu.push({
            // keep a reference to the original data index
            index: i,
            data: allData[index],
            id,
            centroid
          });
        }

        return accu;
      }, []);
    }

    const getElevation = sScale
      ? d => this.getEncodedChannelValue(sScale, d.data, sizeField, 0)
      : 0;

    const getColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : color;

    const getCoverage = coScale
      ? d => this.getEncodedChannelValue(coScale, d.data, coverageField, 0)
      : 1;

    // const layerData = {
    return {
      data,
      getElevation,
      getColor,
      getHexId,
      getCoverage,
      hexagonVertices: this.dataToFeature.hexagonVertices,
      hexagonCenter: this.dataToFeature.hexagonCenter
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(allData, getHexId) {
    let hexagonVertices;
    let hexagonCenter;
    const centroids = {};

    allData.forEach((d, index) => {
      const id = getHexId(d);
      if (typeof id !== 'string' || !id.length) {
        return;
      }
      // find hexagonVertices
      // only need 1 instance of hexagonVertices
      if (!hexagonVertices) {
        hexagonVertices = id && getVertices({id});
        hexagonCenter = id && getCentroid({id});
      }

      // save a reference of centroids to dataToFeature
      // so we don't have to re calculate it again
      centroids[index] = getCentroid({id});
    });

    const bounds = this.getPointsBounds(Object.values(centroids), d => d);
    const lightSettings = this.getLightSettingsFromBounds(bounds);

    this.dataToFeature = {hexagonVertices, hexagonCenter, centroids};
    this.updateMeta({bounds, lightSettings});
  }

  renderLayer({
    data,
    idx,
    layerInteraction,
    objectHovered,
    mapState,
    interactionConfig
  }) {
    const zoomFactor = this.getZoomFactor(mapState);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const {config} = this;
    const {visConfig} = config;

    const h3HexagonLayerTriggers = {
      getColor: {
        color: config.color,
        colorField: config.colorField,
        colorRange: config.visConfig.colorRange,
        colorScale: config.colorScale
      },
      getElevation: {
        sizeField: config.sizeField,
        sizeRange: config.visConfig.sizeRange
      }
    };

    const columnLayerTriggers = {
      getCoverage: {
        coverageField: config.coverageField,
        coverageRange: config.visConfig.coverageRange
      }
    };

    return [
      new H3HexagonLayer({
        ...layerInteraction,
        ...data,
        id: this.id,
        idx,
        pickable: true,
        getHexagon: x => x.id,

        // coverage
        coverage: config.coverageField ? 1 : visConfig.coverage,

        // parameters
        parameters: {depthTest: Boolean(config.sizeField || mapState.dragRotate)},

        // highlight
        autoHighlight: Boolean(config.sizeField),
        highlightColor: HIGHLIGH_COLOR_3D,

        // elevation
        extruded: Boolean(config.sizeField),
        elevationScale: visConfig.elevationScale * eleZoomFactor,

        // color
        opacity: visConfig.opacity,

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
              id: `${this.id}-hovered`,
              data: [idToPolygonGeo(objectHovered)],
              getLineColor: config.highlightColor,
              lineWidthScale: 8 * zoomFactor
            })
          ]
        : [])
    ];
  }
}
