// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import memoize from 'lodash.memoize';
import uniq from 'lodash.uniq';
import {DATA_TYPES} from 'type-analyzer';

import Layer, {LayerBaseConfig, defaultGetFieldValue, LayerBaseConfigPartial} from '../base-layer';
import {TripsLayer as DeckGLTripsLayer} from '@deck.gl/geo-layers';
import {containValidTime} from '@kepler.gl/common-utils';

import {GEOJSON_FIELDS, PROJECTED_PIXEL_SIZE_MULTIPLIER} from '@kepler.gl/constants';
import TripLayerIcon from './trip-layer-icon';

import {
  GeojsonDataMaps,
  detectTableColumns,
  applyFiltersToTableColumns,
  getGeojsonLayerMeta,
  fieldIsGeoArrow
} from '../geojson-layer/geojson-utils';
import {getGeojsonLayerMetaFromArrow} from '../layer-utils';

import {
  isTripGeoJsonField,
  parseTripGeoJsonTimestamp,
  parseTripGeoJsonFromGeoArrow
} from './trip-utils';
import TripInfoModalFactory from './trip-info-modal';
import {bisectRight} from 'd3-array';
import {
  ColorRange,
  Merge,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  LayerColumn,
  ProtoDatasetField
} from '@kepler.gl/types';
import {default as KeplerTable, Datasets} from '@kepler.gl/table';
import {DataContainerInterface, ArrowDataContainer} from '@kepler.gl/utils';

const SUPPORTED_ANALYZER_TYPES = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

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
  billboard: boolean;
  fadeTrail: boolean;
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
  fadeTrail: 'fadeTrail';
  billboard: 'billboard';
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
  fadeTrail: 'fadeTrail',
  billboard: 'billboard',
  sizeRange: 'strokeWidthRange'
};

export const featureAccessor =
  ({geojson}: TripLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}) =>
    dc.valueAt(d.index, geojson.fieldIdx);

export const featureResolver = ({geojson}: TripLayerColumnsConfig) => geojson.fieldIdx;

const geoColumnAccessor =
  ({geojson}: TripLayerColumnsConfig) =>
  (dc: DataContainerInterface): arrow.Vector | null =>
    dc.getColumn?.(geojson.fieldIdx) as arrow.Vector;

const getTableModeValueAccessor = feature => {
  // Called from gpu-filter-utils.getFilterValueAccessor()
  return field => feature.properties.values.map(v => field.valueAccessor(v));
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

const geoFieldAccessor =
  ({geojson}: TripLayerColumnsConfig) =>
  (dc: DataContainerInterface): ProtoDatasetField | null =>
    dc.getField ? dc.getField(geojson.fieldIdx) : null;

export const COLUMN_MODE_GEOJSON = 'geojson';
export const COLUMN_MODE_TABLE = 'table';
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
  declare geoArrowMode: boolean;

  dataToFeature: GeojsonDataMaps = [];
  dataContainer: DataContainerInterface | null = null;

  filteredIndex: Uint8ClampedArray | null = null;
  filteredIndexTrigger: number[] | null = null;

  dataToTimeStamp: any[] = [];

  _layerInfoModal: {
    [COLUMN_MODE_TABLE]: () => React.JSX.Element;
    [COLUMN_MODE_GEOJSON]: () => React.JSX.Element;
  };

  getFeature: (columns: TripLayerColumnsConfig) => (dataContainer: DataContainerInterface) => any;

  constructor(props) {
    super(props);
    this.registerVisConfig(tripVisConfigs);
    this._layerInfoModal = {
      [COLUMN_MODE_TABLE]: TripInfoModalFactory(COLUMN_MODE_TABLE),
      [COLUMN_MODE_GEOJSON]: TripInfoModalFactory(COLUMN_MODE_GEOJSON)
    };

    this.getFeature = memoize(featureAccessor, featureResolver);

    this.getPositionAccessor = (dataContainer: DataContainerInterface) => {
      if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
        return this.getFeature(this.config.columns)(dataContainer);
      }
      return null;
    };
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

  get layerInfoModal() {
    return {
      [COLUMN_MODE_GEOJSON]: {
        id: 'iconInfo',
        template: this._layerInfoModal[COLUMN_MODE_GEOJSON],
        modalProps: {
          title: 'modal.tripInfo.title'
        }
      },
      [COLUMN_MODE_TABLE]: {
        id: 'iconInfo',
        template: this._layerInfoModal[COLUMN_MODE_TABLE],
        modalProps: {
          title: 'modal.tripInfo.titleTable'
        }
      }
    };
  }

  accessVSFieldValue() {
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

  updateAnimationDomain(domain) {
    this.updateLayerConfig({
      animation: {
        ...this.config.animation,
        domain
      }
    });
  }

  static findDefaultLayerProps(
    {label, fields = [], dataContainer, id}: KeplerTable,
    foundLayers?: any[]
  ) {
    const geojsonColumns = fields
      .filter(
        f =>
          (f.type === 'geojson' || f.type === 'geoarrow') &&
          f.analyzerType &&
          SUPPORTED_ANALYZER_TYPES[f.analyzerType]
      )
      .map(f => f.name);

    const defaultColumns = {
      geojson: uniq([...GEOJSON_FIELDS.geojson, ...geojsonColumns])
    };

    const foundColumns = this.findDefaultColumnField(defaultColumns, fields);

    const tripGeojsonColumns = (foundColumns || []).filter(col => {
      const geoField = fields[col.geojson.fieldIdx];
      if (fieldIsGeoArrow(geoField)) {
        const geoColumn = geoColumnAccessor(col)(dataContainer);
        if (!geoColumn) return false;

        // ! query only small sample of features
        const info = getGeojsonLayerMetaFromArrow({
          dataContainer,
          geoColumn,
          geoField,
          chunkIndex: 0
        });

        // TODO use common check logic from trip-utils
        const NUM_DIMENSIONS_FOR_TRIPS = 3; // TODO should check for 4
        if (
          info.featureTypes.line &&
          // @ts-expect-error
          info.dataToFeature?.[0]?.lines?.positions.size === NUM_DIMENSIONS_FOR_TRIPS
        ) {
          // @ts-expect-error
          const values = info.dataToFeature[0].lines.positions.value;
          const tsHolder: number[] = [];
          values.forEach((value, index) => {
            if (index % NUM_DIMENSIONS_FOR_TRIPS === NUM_DIMENSIONS_FOR_TRIPS - 1)
              tsHolder.push(value);
          });
          return Boolean(containValidTime(tsHolder as any[]));
        }
      } else {
        return isTripGeoJsonField(dataContainer, fields[col.geojson.fieldIdx]);
      }
      return false;
    });

    if (tripGeojsonColumns.length) {
      return {
        props: tripGeojsonColumns.map(columns => ({
          label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || this.type,
          columns,
          isVisible: true,
          columnMode: COLUMN_MODE_GEOJSON
        })),

        // if a geojson layer is created from this column, delete it
        foundLayers: foundLayers?.filter(
          prop =>
            prop.type !== 'geojson' ||
            prop.dataId !== id ||
            !tripGeojsonColumns.find(c => prop.columns.geojson.name === c.geojson.name)
        )
      };
    }

    return {props: []};
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    const defaultLayerConfig = super.getDefaultLayerConfig(props ?? {});
    return {
      ...defaultLayerConfig,
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

  calculateDataAttribute(dataset: KeplerTable) {
    this.geoArrowMode = fieldIsGeoArrow(
      geoFieldAccessor(this.config.columns)(dataset.dataContainer)
    );

    const {dataContainer, filteredIndex} = dataset;
    if (this.geoArrowMode) {
      // filter geojson/arrow table by values and make a partial copy of the raw table is expensive
      // so we will use filteredIndex to create an attribute e.g. filteredIndex [0|1] for GPU filtering
      // in deck.gl layer, see: FilterArrowExtension in @kepler.gl/deckgl-layers
      if (!this.filteredIndex || this.filteredIndex.length !== dataContainer.numRows()) {
        // for incremental data loading, we need to update filteredIndex
        this.filteredIndex = new Uint8ClampedArray(dataContainer.numRows());
        this.filteredIndex.fill(1);
      }

      // check if filteredIndex is a range from 0 to numRows if it is, we don't need to update it
      const isRange = filteredIndex && filteredIndex.length === dataContainer.numRows();
      if (!isRange || this.filteredIndexTrigger !== null) {
        this.filteredIndex.fill(0);
        for (let i = 0; i < filteredIndex.length; ++i) {
          this.filteredIndex[filteredIndex[i]] = 1;
        }
        this.filteredIndexTrigger = filteredIndex;
      }
      // for arrow, always return full dataToFeature instead of a filtered one, so there is no need to update attributes in GPU
      return this.dataToFeature;
    }

    switch (this.config.columnMode) {
      case COLUMN_MODE_GEOJSON: {
        return (
          dataset.filteredIndex
            .map(i => this.dataToFeature[i])
            // TODO d can be BinaryFeatureCollection, fix logic
            .filter(d => d && (d as any).geometry?.type === 'LineString')
        );
      }

      case COLUMN_MODE_TABLE:
        return applyFiltersToTableColumns(dataset, this.dataToFeature);

      default:
        return [];
    }
  }

  formatLayerData(datasets: Datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    // to-do: parse segment from dataContainer

    const {dataContainer, gpuFilter} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);

    let filterValueAccessor;
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      filterValueAccessor = (dc: DataContainerInterface, f, fieldIndex: number) => {
        return dc.valueAt(f.properties.index, fieldIndex);
      };
    } else {
      filterValueAccessor = getTableModeValueAccessor;
    }
    const indexAccessor = f => f.properties.index;
    const dataAccessor = () => d => ({index: d.properties.index});
    const accessors = this.getAttributeAccessors({dataAccessor, dataContainer});

    const isFilteredAccessor = d => {
      return this.filteredIndex ? this.filteredIndex[d.properties.index] : 1;
    };

    const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)(
      indexAccessor,
      filterValueAccessor
    );

    return {
      data,
      getFilterValue,
      getFiltered: isFilteredAccessor,
      getPath: d => d.geometry.coordinates,
      getTimestamps: d => this.dataToTimeStamp[d.properties.index],
      ...accessors
    };
  }

  updateLayerMeta(dataset: KeplerTable) {
    const {dataContainer} = dataset;

    this.dataContainer = dataContainer;

    this.geoArrowMode = fieldIsGeoArrow(
      geoFieldAccessor(this.config.columns)(dataset.dataContainer)
    );

    let getFeature;

    if (this.geoArrowMode && dataContainer instanceof ArrowDataContainer) {
      const geoColumn = geoColumnAccessor(this.config.columns)(dataContainer);
      const geoField = geoFieldAccessor(this.config.columns)(dataContainer);

      // update the latest batch/chunk of geoarrow data when loading data incrementally
      if (geoColumn && geoField && this.dataToFeature.length < dataContainer.numChunks()) {
        // for incrementally loading data, we only load and render the latest batch; otherwise, we will load and render all batches
        const isIncrementalLoad = dataContainer.numChunks() - this.dataToFeature.length === 1;

        // TODO ! sortBy 'timestamp'
        const {dataToFeature, bounds, fixedRadius, featureTypes} = getGeojsonLayerMetaFromArrow({
          dataContainer,
          geoColumn,
          geoField,
          ...(isIncrementalLoad ? {chunkIndex: this.dataToFeature.length} : null)
        });
        // if (centroids) this.centroids = this.centroids.concat(centroids);

        // TODO separate binary and json features
        this.dataToFeature = [...this.dataToFeature, ...dataToFeature];

        const {dataToFeatureOut, dataToTimeStamp, animationDomain} = parseTripGeoJsonFromGeoArrow(
          // @ts-expect-error
          this.dataToFeature
        );

        // @ts-expect-error
        this.dataToFeature = dataToFeatureOut;
        this.dataToTimeStamp = dataToTimeStamp;
        this.updateAnimationDomain(animationDomain);

        this.updateMeta({bounds, fixedRadius, featureTypes});
      }
    } else if (this.dataToFeature.length === 0) {
      getFeature = this.getPositionAccessor(dataContainer);
      if (getFeature === this.meta.getFeature) {
        // TODO: revisit this after gpu filtering
        return;
      }

      const {dataToFeature, bounds, featureTypes} = getGeojsonLayerMeta({
        dataContainer,
        getFeature,
        config: this.config,
        sortByColumn: 'timestamp'
      });
      // if (centroids) this.centroids = centroids;
      this.dataToFeature = dataToFeature;

      const {dataToTimeStamp, animationDomain} = parseTripGeoJsonTimestamp(this.dataToFeature);

      this.dataToTimeStamp = dataToTimeStamp;
      this.updateAnimationDomain(animationDomain);

      this.updateMeta({bounds, featureTypes, getFeature});
    }
  }

  setInitialLayerConfig(dataset: KeplerTable) {
    const {dataContainer} = dataset;
    if (!dataContainer.numRows()) {
      return this;
    }

    // defefaultLayerProps will automatically find geojson column
    // if not found, we try to set it to id / lat /lng /ts
    if (!this.config.columns.geojson.value) {
      // find columns from lat, lng, id, and ts
      const columnConfig = detectTableColumns(dataset, this.config.columns, 'timestamp');
      if (columnConfig) {
        this.updateLayerConfig({
          ...columnConfig,
          columnMode: COLUMN_MODE_TABLE
        });
      } else {
        return this;
      }
    }

    this.updateLayerMeta(dataset);

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

    const billboardWidthFactor = visConfig.billboard ? PROJECTED_PIXEL_SIZE_MULTIPLIER : 1;

    const layerProps = {
      ...defaultLayerProps,
      ...data,
      getTimestamps: d => (data.getTimestamps(d) || []).map(ts => ts - domain0),
      widthScale: visConfig.thickness * zoomFactor * zoomFactorValue * billboardWidthFactor,
      capRounded: true,
      jointRounded: true,
      wrapLongitude: false,
      parameters: {
        depthTest: mapState.dragRotate,
        depthMask: false
      },
      trailLength: visConfig.trailLength * 1000,
      fadeTrail: visConfig.fadeTrail,
      billboard: visConfig.billboard,
      // TODO: giuseppe this values becomes negative
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
