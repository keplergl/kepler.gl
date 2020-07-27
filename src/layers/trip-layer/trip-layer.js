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

import memoize from 'lodash.memoize';
import uniq from 'lodash.uniq';
import Layer from '../base-layer';
import {TripsLayer as DeckGLTripsLayer} from '@deck.gl/geo-layers';

import {GEOJSON_FIELDS} from 'constants/default-settings';
import TripLayerIcon from './trip-layer-icon';

import {
  getGeojsonDataMaps,
  getGeojsonBounds,
  getGeojsonFeatureTypes
} from 'layers/geojson-layer/geojson-utils';

import {isTripGeoJsonField, parseTripGeoJsonTimestamp} from './trip-utils';

import {hexToRgb} from 'utils/color-utils';
import TripInfoModalFactory from './trip-info-modal';

const zoomFactorValue = 8;

export const defaultThickness = 0.5;
export const defaultWidth = 1;

export const tripVisConfigs = {
  opacity: 'opacity',
  thickness: {
    type: 'number',
    defaultValue: defaultThickness,
    label: 'Stroke Width',
    isRanged: false,
    range: [0, 100],
    step: 0.1,
    group: 'stroke',
    property: 'thickness'
  },
  colorRange: 'colorRange',
  trailLength: 'trailLength',
  sizeRange: 'strokeWidthRange'
};

export const geoJsonRequiredColumns = ['geojson'];
export const featureAccessor = ({geojson}) => d => d[geojson.fieldIdx];
export const featureResolver = ({geojson}) => geojson.fieldIdx;

export default class TripLayer extends Layer {
  constructor(props) {
    super(props);

    this.dataToFeature = [];
    this.dataToTimeStamp = [];
    this.registerVisConfig(tripVisConfigs);
    this.getFeature = memoize(featureAccessor, featureResolver);
    this._layerInfoModal = TripInfoModalFactory();
  }

  get type() {
    return 'trip';
  }

  get name() {
    return 'Trip';
  }

  get layerIcon() {
    return TripLayerIcon;
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
      }
    };
  }

  get animationDomain() {
    return this.config.animation.domain;
  }

  get layerInfoModal() {
    return {
      id: 'iconInfo',
      template: this._layerInfoModal,
      modalProps: {
        title: 'modal.tripInfo.title'
      }
    };
  }

  getPositionAccessor() {
    return this.getFeature(this.config.columns);
  }

  static findDefaultLayerProps({label, fields = [], allData = [], id}, foundLayers) {
    const geojsonColumns = fields.filter(f => f.type === 'geojson').map(f => f.name);

    const defaultColumns = {
      geojson: uniq([...GEOJSON_FIELDS.geojson, ...geojsonColumns])
    };

    const geoJsonColumns = this.findDefaultColumnField(defaultColumns, fields);

    const tripColumns = (geoJsonColumns || []).filter(col =>
      isTripGeoJsonField(allData, fields[col.geojson.fieldIdx])
    );

    if (!tripColumns.length) {
      return {props: []};
    }

    return {
      props: tripColumns.map(columns => ({
        label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || this.type,
        columns,
        isVisible: true
      })),

      // if a geojson layer is created from this column, delete it
      foundLayers: foundLayers.filter(
        prop =>
          prop.type !== 'geojson' ||
          prop.dataId !== id ||
          !tripColumns.find(c => prop.columns.geojson.name === c.geojson.name)
      )
    };
  }

  getDefaultLayerConfig(props) {
    return {
      ...super.getDefaultLayerConfig(props),
      animation: {
        enabled: true,
        domain: null
      }
    };
  }

  getHoverData(object, allData) {
    // index of allData is saved to feature.properties
    return allData[object.properties.index];
  }

  calculateDataAttribute({allData, filteredIndex}, getPosition) {
    return filteredIndex
      .map(i => this.dataToFeature[i])
      .filter(d => d && d.geometry.type === 'LineString');
  }

  formatLayerData(datasets, oldLayerData) {
    // to-do: parse segment from allData

    const {
      colorScale,
      colorField,
      colorDomain,
      color,
      sizeScale,
      sizeDomain,
      sizeField,
      visConfig
    } = this.config;

    const {colorRange, sizeRange} = visConfig;
    const {allData, gpuFilter} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);

    // color
    const cScale =
      colorField &&
      this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(hexToRgb));
    // calculate stroke scale - if stroked = true
    const sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);
    // access feature properties from geojson sub layer
    const getDataForGpuFilter = f => allData[f.properties.index];
    const getIndexForGpuFilter = f => f.properties.index;

    return {
      data,
      getFilterValue: gpuFilter.filterValueAccessor(getIndexForGpuFilter, getDataForGpuFilter),
      getPath: d => d.geometry.coordinates,
      getTimestamps: d => this.dataToTimeStamp[d.properties.index],
      getColor: d =>
        cScale
          ? this.getEncodedChannelValue(cScale, allData[d.properties.index], colorField)
          : d.properties.fillColor || color,
      getWidth: d =>
        sScale
          ? this.getEncodedChannelValue(sScale, allData[d.properties.index], sizeField, 0)
          : d.properties.lineWidth || defaultWidth
    };
  }

  updateAnimationDomain(domain) {
    this.updateLayerConfig({
      animation: {
        ...this.config.animation,
        domain
      }
    });
  }

  updateLayerMeta(allData) {
    const getFeature = this.getPositionAccessor();
    if (getFeature === this.meta.getFeature) {
      // TODO: revisit this after gpu filtering
      return;
    }

    this.dataToFeature = getGeojsonDataMaps(allData, getFeature);

    const {dataToTimeStamp, animationDomain} = parseTripGeoJsonTimestamp(this.dataToFeature);

    this.dataToTimeStamp = dataToTimeStamp;
    this.updateAnimationDomain(animationDomain);

    // get bounds from features
    const bounds = getGeojsonBounds(this.dataToFeature);

    // keep a record of what type of geometry the collection has
    const featureTypes = getGeojsonFeatureTypes(this.dataToFeature);

    this.updateMeta({bounds, featureTypes, getFeature});
  }

  setInitialLayerConfig(allData) {
    this.updateLayerMeta(allData);
    return this;
  }

  renderLayer(opts) {
    const {data, gpuFilter, mapState, animationConfig} = opts;
    const {visConfig} = this.config;
    const zoomFactor = this.getZoomFactor(mapState);

    const updateTriggers = {
      getColor: {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: visConfig.colorRange,
        colorScale: this.config.colorScale
      },
      getWidth: {
        sizeField: this.config.sizeField,
        sizeRange: visConfig.sizeRange
      },
      getTimestamps: {
        columns: this.config.columns,
        domain0: animationConfig.domain[0]
      },
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    return [
      new DeckGLTripsLayer({
        ...defaultLayerProps,
        ...data,
        getTimestamps: d => data.getTimestamps(d).map(ts => ts - animationConfig.domain[0]),
        widthScale: this.config.visConfig.thickness * zoomFactor * zoomFactorValue,
        rounded: true,
        wrapLongitude: false,
        parameters: {
          depthTest: mapState.dragRotate,
          depthMask: false
        },
        trailLength: visConfig.trailLength * 1000,
        currentTime: animationConfig.currentTime - animationConfig.domain[0],
        updateTriggers
      })
    ];
  }
}
