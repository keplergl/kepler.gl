// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Feature} from 'geojson';
import memoize from 'lodash.memoize';
import uniq from 'lodash.uniq';
import Layer, {LayerBaseConfig, defaultGetFieldValue} from '../base-layer';
import {TripsLayer as DeckGLTripsLayer} from '@deck.gl/geo-layers';

import {GEOJSON_FIELDS, ColorRange, ALL_FIELD_TYPES} from '@kepler.gl/constants';
import TripLayerIcon from './trip-layer-icon';

import {
  getGeojsonDataMaps,
  getGeojsonBounds,
  getGeojsonFeatureTypes,
  GeojsonDataMaps
} from '../geojson-layer/geojson-utils';

import {groupColumnsAsGeoJson, isTripGeoJsonField, parseTripGeoJsonTimestamp} from './trip-utils';
import {assignPointPairToLayerColumn} from '../layer-utils';
import TripInfoModalFactory from './trip-info-modal';
import {bisectRight} from 'd3-array';
import {
  Merge,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  LayerColumn
} from '@kepler.gl/types';
import {default as KeplerTable, Datasets} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';

export type TripLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  thickness: VisConfigNumber;
  colorRange: VisConfigColorRange;
  trailLength: VisConfigNumber;
  sizeRange: VisConfigRange;
};

export type TripLayerColumnsConfig = {
  geojson: LayerColumn;
};

export type TripLayerVisConfig = {
  opacity: number;
  thickness: number;
  colorRange: ColorRange;
  trailLength: number;
  sizeRange: [number, number];
};

export type TripLayerConfig = Merge<
  LayerBaseConfig,
  {columns: TripLayerColumnsConfig; visConfig: TripLayerVisConfig}
>;

export type TripLayerMeta = {
  getFeature: any;
};

const zoomFactorValue = 8;

export const defaultThickness = 0.5;
export const defaultLineWidth = 1;

export const tripVisConfigs: {
  opacity: 'opacity';
  thickness: VisConfigNumber;
  colorRange: 'colorRange';
  trailLength: 'trailLength';
  sizeRange: 'strokeWidthRange';
} = {
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

export const featureAccessor =
  ({geojson}: TripLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    dc.valueAt(d.index, geojson.fieldIdx);
export const featureResolver = ({geojson}: TripLayerColumnsConfig) => geojson.fieldIdx;
const getTableModeValueAccessor = f => {
  // Called from gpu-filter-utils.getFilterValueAccessor()
  return field => f.properties.values.map(v => field.valueAccessor(v));
};
const getTableModeFieldValue = (field, data) => {
  let rv;
  if (typeof data === 'function') {
    rv = data(field);
  } else {
    rv = defaultGetFieldValue(field, data);
  }
  return rv;
};

const COLUMN_MODE_GEOJSON = 'geojson';
const COLUMN_MODE_TABLE = 'table';
const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON',
    requiredColumns: ['geojson']
  },
  {
    key: COLUMN_MODE_TABLE,
    label: 'Table columns',
    requiredColumns: ['id', 'lat', 'lng', 'timestamp'],
    optionalColumns: ['altitude']
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_GEOJSON;

export default class TripLayer extends Layer {
  declare visConfigSettings: TripLayerVisConfigSettings;
  declare config: TripLayerConfig;
  declare meta: TripLayerMeta;
  declare dataContainer: DataContainerInterface | null;

  dataToFeature: GeojsonDataMaps;
  dataToTimeStamp: any[];
  getFeature: (columns: TripLayerColumnsConfig) => (dataContainer: DataContainerInterface) => any;
  _layerInfoModal: () => JSX.Element;

  constructor(props) {
    super(props);

    this.dataToFeature = [];
    this.dataToTimeStamp = [];
    this.dataContainer = null;
    this.registerVisConfig(tripVisConfigs);
    this.getFeature = memoize(featureAccessor, featureResolver);
    this._layerInfoModal = TripInfoModalFactory();
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  static get type(): 'trip' {
    return 'trip';
  }
  get type() {
    return TripLayer.type;
  }

  get name(): 'Trip' {
    return 'Trip';
  }

  get layerIcon() {
    return TripLayerIcon;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  accessVSFieldValue(field, indexKey) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return defaultGetFieldValue;
    }
    return getTableModeFieldValue;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;

    return {
      ...visualChannels,
      color: {
        ...visualChannels.color,
        accessor: 'getColor',
        nullValue: visualChannels.color.nullValue,
        getAttributeValue: config => d => d.properties.lineColor || config.color,
        // used this to get updateTriggers
        defaultValue: config => config.color
      },
      size: {
        ...visualChannels.size,
        property: 'stroke',
        accessor: 'getWidth',
        condition: config => config.visConfig.stroked,
        nullValue: 0,
        getAttributeValue: () => d => d.properties.lineWidth || defaultLineWidth
      }
    };
  }

  get animationDomain() {
    return this.config.animation.domain;
  }

  get layerInfoModal() {
    return {
      [COLUMN_MODE_GEOJSON]: {
        id: 'iconInfo',
        template: this._layerInfoModal,
        modalProps: {
          title: 'modal.tripInfo.title'
        }
      }
    };
  }

  getPositionAccessor(dataContainer: DataContainerInterface) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return this.getFeature(this.config.columns)(dataContainer);
    }
    return null;
  }

  static findDefaultLayerProps(
    {label, fieldPairs, fields = [], dataContainer, id}: KeplerTable,
    foundLayers: any[]
  ) {
    const geojsonColumns = fields.filter(f => f.type === 'geojson').map(f => f.name);

    const defaultColumns = {
      geojson: uniq([...GEOJSON_FIELDS.geojson, ...geojsonColumns])
    };

    const geoJsonColumns = this.findDefaultColumnField(defaultColumns, fields);

    const tripGeojsonColumns = (geoJsonColumns || []).filter(col =>
      isTripGeoJsonField(dataContainer, fields[col.geojson.fieldIdx])
    );

    if (tripGeojsonColumns.length) {
      return {
        props: tripGeojsonColumns.map(columns => ({
          label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || this.type,
          columns,
          isVisible: true,
          columnMode: COLUMN_MODE_GEOJSON
        })),

        // if a geojson layer is created from this column, delete it
        foundLayers: foundLayers.filter(
          prop =>
            prop.type !== 'geojson' ||
            prop.dataId !== id ||
            !tripGeojsonColumns.find(c => prop.columns.geojson.name === c.geojson.name)
        )
      };
    }

    // find columns from lat, lng, id, and ts
    if (fieldPairs.length) {
      // find time column
      const timeFieldIdx = fields.findIndex(f => f.type === ALL_FIELD_TYPES.timestamp);
      // find id column
      const idFieldIdx = fields.findIndex(f => f.name?.toLowerCase().match(/^(id|uuid)$/g));

      if (timeFieldIdx > -1 && idFieldIdx > -1) {
        const layerProp = {
          columns: {
            ...assignPointPairToLayerColumn(fieldPairs[0], true),
            id: {
              value: fields[idFieldIdx],
              fieldIdx: idFieldIdx
            },
            timestamp: {
              value: fields[timeFieldIdx],
              fieldIdx: timeFieldIdx
            }
          },
          label: fieldPairs[0].defaultName,
          columnMode: COLUMN_MODE_TABLE
        };

        return {
          props: [layerProp]
        };
      }
    }

    return {props: []};
  }

  getDefaultLayerConfig(props) {
    return {
      ...super.getDefaultLayerConfig(props),
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE,
      animation: {
        enabled: true,
        domain: null
      }
    };
  }

  getHoverData(object, dataContainer: DataContainerInterface, fields, animationConfig) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      // index for dataContainer is saved to feature.properties
      return dataContainer.row(object.properties.index);
    }
    return this._findColumnModeDatumForFeature(object.properties.index, animationConfig.currentTime)
      ?.datum;
  }

  calculateDataAttribute(dataset: KeplerTable, getPosition) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return dataset.filteredIndex
        .map(i => this.dataToFeature[i])
        .filter((d: unknown) => d && (d as Feature).geometry.type === 'LineString');
    }
    if (dataset.filteredIndex.length === dataset.dataContainer.numRows()) {
      // Only apply the filtering when something is to be filtered out
      return this.dataToFeature;
    }

    const filteredIndexSet = new Set(dataset.filteredIndex);
    const filteredFeatures: any[] = [];
    for (const feature of this.dataToFeature) {
      // @ts-expect-error fix type or expected?
      const filteredCoords = feature?.geometry.coordinates.filter(c =>
        // TODO: is it necessary to filter coords, or can we assume they are never filtered?
        filteredIndexSet.has(c.datumIndex)
      );
      if (filteredCoords.length > 0) {
        filteredFeatures.push({
          ...feature,
          geometry: {
            // @ts-expect-error fix type or expected?
            ...feature.geometry,
            coordinates: filteredCoords
          },
          properties: {
            // @ts-expect-error fix type or expected?
            ...feature.properties,
            // @ts-expect-error fix type or expected?
            values: feature.geometry.coordinates.map(c =>
              dataset.dataContainer.rowAsArray(c.datumIndex)
            )
          }
        });
      }
    }
    return filteredFeatures;
  }

  formatLayerData(datasets: Datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    // to-do: parse segment from dataContainer
    const {dataContainer, gpuFilter} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);

    let valueAccessor;
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      valueAccessor = (dc: DataContainerInterface, f, fieldIndex: number) => {
        return dc.valueAt(f.properties.index, fieldIndex);
      };
    } else {
      valueAccessor = getTableModeValueAccessor;
    }
    const indexAccessor = f => f.properties.index;
    const dataAccessor = dc => d => ({index: d.properties.index});
    const accessors = this.getAttributeAccessors({dataAccessor, dataContainer});
    const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)(
      indexAccessor,
      valueAccessor
    );

    return {
      data,
      getFilterValue,
      getPath: d => d.geometry.coordinates,
      getTimestamps: d => this.dataToTimeStamp[d.properties.index],
      ...accessors
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

  updateLayerMeta(dataContainer: DataContainerInterface) {
    let getFeature;
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      getFeature = this.getPositionAccessor(dataContainer);
      if (getFeature === this.meta.getFeature) {
        // TODO: revisit this after gpu filtering
        return;
      }
      this.dataToFeature = getGeojsonDataMaps(dataContainer, getFeature);
    } else {
      this.dataContainer = dataContainer;
      this.dataToFeature = groupColumnsAsGeoJson(dataContainer, this.config.columns);
    }

    const {dataToTimeStamp, animationDomain} = parseTripGeoJsonTimestamp(this.dataToFeature);

    this.dataToTimeStamp = dataToTimeStamp;
    this.updateAnimationDomain(animationDomain);

    // get bounds from features
    const bounds = getGeojsonBounds(this.dataToFeature);

    // keep a record of what type of geometry the collection has
    const featureTypes = getGeojsonFeatureTypes(this.dataToFeature);

    this.updateMeta({bounds, featureTypes, getFeature});
  }

  setInitialLayerConfig({dataContainer}) {
    if (!dataContainer.numRows()) {
      return this;
    }
    this.updateLayerMeta(dataContainer);
    return this;
  }

  renderLayer(opts) {
    const {data, gpuFilter, mapState, animationConfig} = opts;
    const {visConfig} = this.config;
    const zoomFactor = this.getZoomFactor(mapState);
    const isValidTime =
      animationConfig &&
      Array.isArray(animationConfig.domain) &&
      animationConfig.domain.every(Number.isFinite) &&
      Number.isFinite(animationConfig.currentTime);

    if (!isValidTime) {
      return [];
    }

    const domain0 = animationConfig.domain?.[0];

    const gpuFilterUpdateTriggers = {getFilterValue: gpuFilter.filterValueUpdateTriggers};
    const updateTriggers = {
      ...this.getVisualChannelUpdateTriggers(),
      getTimestamps: {
        columns: this.config.columns,
        domain0
      },
      ...gpuFilterUpdateTriggers
    };
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    const layerProps = {
      ...defaultLayerProps,
      ...data,
      getTimestamps: d => (data.getTimestamps(d) || []).map(ts => ts - domain0),
      widthScale: visConfig.thickness * zoomFactor * zoomFactorValue,
      capRounded: true,
      jointRounded: true,
      wrapLongitude: false,
      parameters: {
        depthTest: mapState.dragRotate,
        depthMask: false
      },
      trailLength: visConfig.trailLength * 1000,
      currentTime: animationConfig.currentTime - domain0,
      updateTriggers,
      id: `${defaultLayerProps.id}${mapState.globe?.enabled ? '-globe' : ''}`
    };
    return [new DeckGLTripsLayer(layerProps)];
  }

  /**
   * Finds coordinates and datum at the current animation time by the specified feature index.
   * @param featureIndex
   * @param time
   * @returns {{datum: (null|string|*), idx: *, coords}|{datum: null, idx: number, coords: null}}
   */
  private _findColumnModeDatumForFeature(
    featureIndex: number,
    time: number
  ): {
    idx: number;
    coords: number[] | null;
    datum: any;
  } {
    if (this.config.columnMode === COLUMN_MODE_TABLE) {
      const object = this.dataToFeature[featureIndex];
      const idx = bisectRight(this.dataToTimeStamp[featureIndex], time);
      // @ts-expect-error type geometry?
      const {coordinates} = object?.geometry || {coordinates: []};
      if (idx >= 0 && idx < coordinates.length) {
        const coords = coordinates[idx];
        return {
          idx,
          coords,
          datum: coords?.datum
        };
      }
    }
    return {
      idx: -1,
      coords: null,
      datum: null
    };
  }
}
