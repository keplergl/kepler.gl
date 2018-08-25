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
import uniq from 'lodash.uniq';

import Layer from '../base-layer';
import HighlightPolygonLayer from 'deckgl-layers/geojson-layer/solid-polygon-layer';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from 'deck.gl';

import {hexToRgb} from 'utils/color-utils';
import {
  getGeojsonDataMaps,
  getGeojsonBounds,
  featureToDeckGlGeoType
} from './geojson-utils';
import GeojsonLayerIcon from './geojson-layer-icon';
import {GEOJSON_FIELDS} from 'constants/default-settings';

export const geojsonVisConfigs = {
  opacity: 'opacity',
  thickness: {
    type: 'number',
    defaultValue: 0.5,
    label: 'Stroke Width',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: 'stroke',
    property: 'thickness'
  },
  colorRange: 'colorRange',
  radius: 'radius',

  sizeRange: 'strokeWidthRange',
  radiusRange: 'radiusRange',
  heightRange: 'elevationRange',
  elevationScale: 'elevationScale',

  'hi-precision': 'hi-precision',
  stroked: 'stroked',
  filled: 'filled',
  enable3d: 'enable3d',
  wireframe: 'wireframe'
};

export const geoJsonRequiredColumns = ['geojson'];
export const featureAccessor = ({geojson}) => d => d[geojson.fieldIdx];
export const featureResolver = ({geojson}) => geojson.fieldIdx;

export default class GeoJsonLayer extends Layer {
  constructor(props) {
    super(props);

    this.dataToFeature = {};
    this.registerVisConfig(geojsonVisConfigs);
    this.getFeature = memoize(featureAccessor, featureResolver);
  }

  get type() {
    return 'geojson';
  }

  get name() {
    return 'Polygon';
  }

  get layerIcon() {
    return GeojsonLayerIcon;
  }

  get requiredLayerColumns() {
    return geoJsonRequiredColumns;
  }

  get visualChannels() {
    return {
      ...super.visualChannels,
      size: {
        ...super.visualChannels.size,
        property: 'stroke',
        condition: config => config.visConfig.stroked
      },
      height: {
        property: 'height',
        field: 'heightField',
        scale: 'heightScale',
        domain: 'heightDomain',
        range: 'heightRange',
        key: 'height',
        channelScaleType: 'size',
        condition: config => config.visConfig.enable3d
      },
      radius: {
        property: 'radius',
        field: 'radiusField',
        scale: 'radiusScale',
        domain: 'radiusDomain',
        range: 'radiusRange',
        key: 'radius',
        channelScaleType: 'radius'
      }
    };
  }

  static findDefaultLayerProps({label, fields}) {
    const geojsonColumns = fields
      .filter(f => f.type === 'geojson')
      .map(f => f.name);

    const defaultColumns = {
      geojson: uniq([...GEOJSON_FIELDS.geojson, ...geojsonColumns])
    };

    const foundColumns = this.findDefaultColumnField(defaultColumns, fields);
    if (!foundColumns || !foundColumns.length) {
      return [];
    }

    return foundColumns.map(columns => ({
      label: typeof label === 'string' && label.replace(/\.[^/.]+$/, '') || this.type,
      columns,
      isVisible: true
    }));
  }

  getDefaultLayerConfig(props = {}) {
    return {
      ...super.getDefaultLayerConfig(props),

      // add height visual channel
      heightField: null,
      heightDomain: [0, 1],
      heightScale: 'linear',

      // add radius visual channel
      radiusField: null,
      radiusDomain: [0, 1],
      radiusScale: 'linear'
    };
  }

  getHoverData(object, allData) {
    // index of allData is saved to feature.properties
    return allData[object.properties.index];
  }

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorField,
      colorDomain,
      color,
      sizeScale,
      sizeDomain,
      sizeField,
      heightField,
      heightDomain,
      heightScale,
      radiusField,
      radiusDomain,
      radiusScale,
      visConfig,
      columns
    } = this.config;

    const {
      enable3d,
      stroked,
      colorRange,
      heightRange,
      sizeRange,
      radiusRange
    } = visConfig;

    const getFeature = this.getFeature(columns);

    // geojson feature are object, if doesn't exists
    // create it and save to layer
    if (!oldLayerData || oldLayerData.getFeature !== getFeature) {
      this.updateLayerMeta(allData, getFeature);
    }

    let geojsonData;

    if (
      oldLayerData &&
      oldLayerData.data &&
      opt.sameData &&
      oldLayerData.getFeature === getFeature
    ) {
      // no need to create a new array of data
      // use updateTriggers to selectively re-calculate attributes
      geojsonData = oldLayerData.data;
    } else {
      // filteredIndex is a reference of index in allData which can map to feature
      geojsonData = filteredIndex
        .map(i => this.dataToFeature[i])
        .filter(d => d);
    }

    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(hexToRgb)
      );

    // calculate stroke scale - if stroked = true
    const sScale =
      sizeField &&
      stroked &&
      this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

    // calculate elevation scale - if extruded = true
    const eScale =
      heightField &&
      enable3d &&
      this.getVisChannelScale(heightScale, heightDomain, heightRange);

    // point radius
    const rScale =
      radiusField &&
      this.getVisChannelScale(radiusScale, radiusDomain, radiusRange);

    return {
      data: geojsonData,
      getFeature,
      getFillColor: d =>
        cScale
          ? this.getEncodedChannelValue(
              cScale,
              allData[d.properties.index],
              colorField
            )
          : d.properties.fillColor || color,
      getLineColor: d =>
        cScale
          ? this.getEncodedChannelValue(
              cScale,
              allData[d.properties.index],
              colorField
            )
          : d.properties.lineColor || color,
      getLineWidth: d =>
        sScale
          ? this.getEncodedChannelValue(
              sScale,
              allData[d.properties.index],
              sizeField,
              0
            )
          : d.properties.lineWidth || 1,
      getElevation: d =>
        eScale
          ? this.getEncodedChannelValue(
              eScale,
              allData[d.properties.index],
              heightField,
              0
            )
          : d.properties.elevation || 500,
      getRadius: d =>
        rScale
          ? this.getEncodedChannelValue(
              rScale,
              allData[d.properties.index],
              radiusField,
              0
            )
          : d.properties.radius || 1
    };
  }

  updateLayerMeta(allData, getFeature) {
    this.dataToFeature = getGeojsonDataMaps(allData, getFeature);

    // calculate layer meta
    const allFeatures = Object.values(this.dataToFeature);

    // get bounds from features
    const bounds = getGeojsonBounds(allFeatures);

    // get lightSettings from points
    const lightSettings = this.getLightSettingsFromBounds(bounds);

    // if any of the feature has properties.hi-precision set to be true
    const fp64 = Boolean(
      allFeatures.find(d => d && d.properties && d.properties['hi-precision'])
    );
    const fixedRadius = Boolean(
      allFeatures.find(d => d && d.properties && d.properties.radius)
    );

    // keep a record of what type of geometry the collection has
    const featureTypes = allFeatures.reduce((accu, f) => {
      const geoType = featureToDeckGlGeoType(
        f && f.geometry && f.geometry.type
      );

      if (geoType) {
        accu[geoType] = true;
      }
      return accu;
    }, {});

    this.updateMeta({bounds, lightSettings, fp64, fixedRadius, featureTypes});
  }

  renderLayer({
    data,
    idx,
    objectHovered,
    mapState,
    interactionConfig
  }) {
    const {fp64, lightSettings, fixedRadius} = this.meta;
    const radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);
    const zoomFactor = this.getZoomFactor(mapState);
    const {visConfig} = this.config;

    const layerProps = {
      // multiplier applied just so it being consistent with previously saved maps
      lineWidthScale: visConfig.thickness * zoomFactor * 8,
      lineWidthMinPixels: 1,
      elevationScale: visConfig.elevationScale,
      pointRadiusScale: radiusScale,
      fp64: fp64 || visConfig['hi-precision'],
      lineMiterLimit: 4
    };

    const updateTriggers = {
      getElevation: {
        heightField: this.config.heightField,
        heightScale: this.config.heightScale,
        heightRange: visConfig.heightRange
      },
      getFillColor: {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: visConfig.colorRange,
        colorScale: this.config.colorScale
      },
      getLineColor: {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: visConfig.colorRange,
        colorScale: this.config.colorScale
      },
      getLineWidth: {
        sizeField: this.config.sizeField,
        sizeRange: visConfig.sizeRange
      },
      getRadius: {
        radiusField: this.config.radiusField,
        radiusRange: visConfig.radiusRange
      }
    };

    return [
      new DeckGLGeoJsonLayer({
        ...layerProps,
        id: this.id,
        idx,
        data: data.data,
        getFillColor: data.getFillColor,
        getLineColor: data.getLineColor,
        getLineWidth: data.getLineWidth,
        getRadius: data.getRadius,
        getElevation: data.getElevation,
        // highlight
        pickable: true,
        // highlightColor: this.config.highlightColor,
        autoHighlight: visConfig.enable3d,
        // parameters
        parameters: {depthTest: Boolean(visConfig.enable3d || mapState.dragRotate)},
        opacity: visConfig.opacity,
        stroked: visConfig.stroked,
        filled: visConfig.filled,
        extruded: visConfig.enable3d,
        wireframe: visConfig.wireframe,
        lightSettings,
        updateTriggers,

        subLayers: {
          ...DeckGLGeoJsonLayer.defaultProps.subLayers,
          PolygonLayer: HighlightPolygonLayer
        }
      }),
      ...(this.isLayerHovered(objectHovered) && !visConfig.enable3d
        ? [
            new DeckGLGeoJsonLayer({
              ...layerProps,
              id: `${this.id}-hovered`,
              data: [
                {
                  ...objectHovered.object,
                  properties: {
                    ...objectHovered.object.properties,
                    lineColor: this.config.highlightColor,
                    fillColor: this.config.highlightColor
                  },
                  getLineWidth: data.getLineWidth,
                  getRadius: data.getRadius,
                  getElevation: data.getElevation
                }
              ],
              updateTriggers,
              stroked: true,
              pickable: false,
              filled: false
            })
          ]
        : [])
    ];
  }
}
