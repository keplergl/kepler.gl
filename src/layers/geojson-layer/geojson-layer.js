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

import uniq from 'lodash.uniq';
import {DATA_TYPES} from 'type-analyzer';

import Layer, {colorMaker} from '../base-layer';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from '@deck.gl/layers';
import {hexToRgb} from 'utils/color-utils';
import {getGeojsonDataMaps, getGeojsonBounds, getGeojsonFeatureTypes} from './geojson-utils';
import GeojsonLayerIcon from './geojson-layer-icon';
import {GEOJSON_FIELDS, HIGHLIGH_COLOR_3D, CHANNEL_SCALES, DEFAULT_ELEVATION} from 'constants/default-settings';
import {LAYER_VIS_CONFIGS} from 'layers/layer-factory';

const SUPPORTED_ANALYZER_TYPES = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

export const geojsonVisConfigs = {
  opacity: 'opacity',
  strokeOpacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    property: 'strokeOpacity'
  },
  thickness: {
    ...LAYER_VIS_CONFIGS.thickness,
    defaultValue: 0.5
  },
  strokeColor: 'strokeColor',
  colorRange: 'colorRange',
  strokeColorRange: 'strokeColorRange',
  radius: 'radius',

  sizeRange: 'strokeWidthRange',
  radiusRange: 'radiusRange',
  heightRange: 'elevationRange',
  elevationScale: 'elevationScale',
  stroked: 'stroked',
  filled: 'filled',
  enable3d: 'enable3d',
  wireframe: 'wireframe'
};

export const geoJsonRequiredColumns = ['geojson'];
export const featureAccessor = ({geojson}) => d => d[geojson.fieldIdx];
export const defaultLineWidth = 1;
export const defaultRadius = 1;

export default class GeoJsonLayer extends Layer {
  constructor(props) {
    super(props);

    this.dataToFeature = [];
    this.registerVisConfig(geojsonVisConfigs);
    this.getPositionAccessor = () => featureAccessor(this.config.columns);
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
      strokeColor: {
        property: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        key: 'strokeColor',
        channelScaleType: CHANNEL_SCALES.color,
        condition: config => config.visConfig.stroked
      },
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

  getPositionAccessor() {
    return this.getFeature(this.config.columns);
  }

  static findDefaultLayerProps({label, fields = []}) {
    const geojsonColumns = fields
      .filter(f => f.type === 'geojson' && SUPPORTED_ANALYZER_TYPES[f.analyzerType])
      .map(f => f.name);

    const defaultColumns = {
      geojson: uniq([...GEOJSON_FIELDS.geojson, ...geojsonColumns])
    };

    const foundColumns = this.findDefaultColumnField(defaultColumns, fields);
    if (!foundColumns || !foundColumns.length) {
      return {props: []};
    }

    return {
      props: foundColumns.map(columns => ({
        label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || this.type,
        columns,
        isVisible: true
      }))
    };
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
      radiusScale: 'linear',

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile'
    };
  }

  getHoverData(object, allData) {
    // index of allData is saved to feature.properties
    return allData[object.properties.index];
  }

  calculateDataAttribute({allData, filteredIndex}, getPosition) {
    return filteredIndex.map(i => this.dataToFeature[i]).filter(d => d);
  }
  // TODO: fix complexity
  /* eslint-disable complexity */
  formatLayerData(datasets, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorField,
      colorDomain,
      strokeColorField,
      strokeColorScale,
      strokeColorDomain,
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
      visConfig
    } = this.config;

    const {
      enable3d,
      stroked,
      colorRange,
      heightRange,
      sizeRange,
      radiusRange,
      strokeColorRange,
      strokeColor
    } = visConfig;

    const {allData, gpuFilter} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);

    // fill color
    const cScale =
      colorField &&
      this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(hexToRgb));

    // stroke color
    const scScale =
      strokeColorField &&
      this.getVisChannelScale(
        strokeColorScale,
        strokeColorDomain,
        strokeColorRange.colors.map(hexToRgb)
      );

    // calculate stroke scale - if stroked = true
    const sScale =
      sizeField && stroked && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

    // calculate elevation scale - if extruded = true
    const eScale =
      heightField && enable3d && this.getVisChannelScale(heightScale, heightDomain, heightRange);

    // point radius
    const rScale = radiusField && this.getVisChannelScale(radiusScale, radiusDomain, radiusRange);

    // access feature properties from geojson sub layer
    const getDataForGpuFilter = f => allData[f.properties.index];
    const getIndexForGpuFilter = f => f.properties.index;

    return {
      data,
      getFilterValue: gpuFilter.filterValueAccessor(getIndexForGpuFilter, getDataForGpuFilter),
      getFillColor: d =>
        cScale
          ? this.getEncodedChannelValue(cScale, allData[d.properties.index], colorField)
          : d.properties.fillColor || color,
      getLineColor: d =>
        scScale
          ? this.getEncodedChannelValue(scScale, allData[d.properties.index], strokeColorField)
          : d.properties.lineColor || strokeColor || color,
      getLineWidth: d =>
        sScale
          ? this.getEncodedChannelValue(sScale, allData[d.properties.index], sizeField, 0)
          : d.properties.lineWidth || defaultLineWidth,
      getElevation: d =>
        eScale
          ? this.getEncodedChannelValue(eScale, allData[d.properties.index], heightField, 0)
          : d.properties.elevation || DEFAULT_ELEVATION,
      getRadius: d =>
        rScale
          ? this.getEncodedChannelValue(rScale, allData[d.properties.index], radiusField, 0)
          : d.properties.radius || defaultRadius
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(allData) {
    const getFeature = this.getPositionAccessor();
    this.dataToFeature = getGeojsonDataMaps(allData, getFeature);

    // get bounds from features
    const bounds = getGeojsonBounds(this.dataToFeature);
    // if any of the feature has properties.radius set to be true
    const fixedRadius = Boolean(
      this.dataToFeature.find(d => d && d.properties && d.properties.radius)
    );

    // keep a record of what type of geometry the collection has
    const featureTypes = getGeojsonFeatureTypes(this.dataToFeature);

    this.updateMeta({bounds, fixedRadius, featureTypes});
  }

  setInitialLayerConfig(allData) {
    this.updateLayerMeta(allData);

    const {featureTypes} = this.meta;
    // default settings is stroke: true, filled: false
    if (featureTypes && featureTypes.polygon) {
      // set both fill and stroke to true
      return this.updateLayerVisConfig({
        filled: true,
        stroked: true,
        strokeColor: colorMaker.next().value
      });
    } else if (featureTypes && featureTypes.point) {
      // set fill to true if detect point
      return this.updateLayerVisConfig({filled: true, stroked: false});
    }

    return this;
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState} = opts;

    const {fixedRadius, featureTypes} = this.meta;
    const radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);
    const zoomFactor = this.getZoomFactor(mapState);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);

    const {visConfig} = this.config;

    const layerProps = {
      lineWidthScale: visConfig.thickness * zoomFactor * 8,
      elevationScale: visConfig.elevationScale * eleZoomFactor,
      pointRadiusScale: radiusScale,
      lineMiterLimit: 4
    };

    const updateTriggers = {
      getElevation: {
        heightField: this.config.heightField,
        heightScaleType: this.config.heightScale,
        heightRange: visConfig.heightRange
      },
      getFillColor: {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: visConfig.colorRange,
        colorScale: this.config.colorScale
      },
      getLineColor: {
        color: visConfig.strokeColor,
        colorField: this.config.strokeColorField,
        colorRange: visConfig.strokeColorRange,
        colorScale: this.config.strokeColorScale
      },
      getLineWidth: {
        sizeField: this.config.sizeField,
        sizeRange: visConfig.sizeRange
      },
      getRadius: {
        radiusField: this.config.radiusField,
        radiusRange: visConfig.radiusRange
      },
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const opaOverwrite = {
      opacity: visConfig.strokeOpacity
    };

    return [
      new DeckGLGeoJsonLayer({
        ...defaultLayerProps,
        ...layerProps,
        ...data,
        highlightColor: HIGHLIGH_COLOR_3D,
        autoHighlight: visConfig.enable3d,
        stroked: visConfig.stroked,
        filled: visConfig.filled,
        extruded: visConfig.enable3d,
        wireframe: visConfig.wireframe,
        wrapLongitude: false,
        lineMiterLimit: 2,
        rounded: true,
        updateTriggers,
        _subLayerProps: {
          ...(featureTypes.polygon ? {'polygons-stroke': opaOverwrite} : {}),
          ...(featureTypes.line ? {'line-strings': opaOverwrite} : {}),
          ...(featureTypes.point
            ? {
                points: {
                  lineOpacity: visConfig.strokeOpacity
                }
              }
            : {})
        }
      }),
      ...(this.isLayerHovered(objectHovered) && !visConfig.enable3d
        ? [
            new DeckGLGeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              wrapLongitude: false,
              data: [objectHovered.object],
              getLineWidth: data.getLineWidth,
              getRadius: data.getRadius,
              getElevation: data.getElevation,
              getLineColor: this.config.highlightColor,
              getFillColor: this.config.highlightColor,
              // always draw outline
              stroked: true,
              filled: false
            })
          ]
        : [])
    ];
  }
}
