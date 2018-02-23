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

import memoize from 'lodash.memoize';

import Layer from '../base-layer';
import {HexagonCellLayer, GeoJsonLayer} from 'deck.gl';
import {hexToRgb} from 'utils/color-utils';
import {getVertices, getCentroid, idToPolygonGeo} from './h3-utils';

export const hexIdRequiredColumns = ['hex_id'];
export const hexIdAccessor = ({hex_id}) => d => d[hex_id.fieldIdx];
export const hexIdResolver = ({hex_id}) => hex_id.fieldIdx;

export const HexagonIdVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  sizeRange: 'elevationRange',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision'
};

export default class HexagonIdLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(HexagonIdVisConfigs);
    this.getHexId = memoize(hexIdAccessor, hexIdResolver);
  }

  get type() {
    return 'hexagonId';
  }

  get requiredLayerColumns() {
    return hexIdRequiredColumns;
  }

  get visualChannels() {
    return {
      ...super.visualChannels,
      size: {
        ...super.visualChannels.size,
        property: 'height'
      }
    };
  }

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
      visConfig: {sizeRange, colorRange}
    } = this.config;

    // color
    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(hexToRgb)
      );

    // height
    const sScale =
      sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

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

    const getElevation = d =>
      sScale ? this.getEncodedChannelValue(sScale, d.data, sizeField, 0) : 0;

    const getColor = d =>
      cScale ? this.getEncodedChannelValue(cScale, d.data, colorField) : color;

    // const layerData = {
    return {
      data,
      getElevation,
      getColor,
      getHexId,
      hexagonVertices: this.dataToFeature.vertices
    };

    // return {layerData, layer: this};
  }

  updateLayerMeta(allData, getHexId) {
    let vertices;
    const centroids = {};

    allData.forEach((d, index) => {
      const id = getHexId(d);
      if (typeof id !== 'string' || !id.length) {
        return;
      }
      // find vertices
      // only need 1 instance of vertices
      if (!vertices) {
        vertices = id && getVertices({id});
      }

      // save a reference of centroids to dataToFeature
      // so we don't have to re calculate it again
      centroids[index] = getCentroid({id});
    });

    const bounds = this.getPointsBounds(Object.values(centroids), d => d);
    const lightSettings = this.getLightSettingsFromBounds(bounds);

    this.dataToFeature = {vertices, centroids};
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
    const zoomFactor = this.getZoomFactor(mapState.zoom);
    const eleZoomFactor = this.getElevationZoomFactor(mapState.zoom);
    const {config, meta} = this;
    const {visConfig} = config;

    const updateTriggers = {
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

    return [
      new HexagonCellLayer({
        ...layerInteraction,
        ...data,
        id: this.id,
        idx,
        pickable: true,
        extruded: Boolean(config.sizeField),
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        opacity: visConfig.opacity,
        lightSettings: meta.lightSettings,
        updateTriggers
      }),
      ...(this.isLayerHovered(objectHovered) && !config.sizeField
        ? [
            new GeoJsonLayer({
              id: `${this.id}-hovered`,
              data: [
                idToPolygonGeo(objectHovered, {
                  lineColor: config.highlightColor
                })
              ],
              lineWidthScale: 8 * zoomFactor
            })
          ]
        : [])
    ];
  }
}
