// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Layer, {LayerBaseConfig, OVERLAY_TYPE_CONST, VisualChannels} from './base-layer';
import {createSelector} from 'reselect';

import {geoJsonFromData, prefixGpuField, gpuFilterToMapboxFilter} from './mapbox-utils';
import {default as KeplerTable} from '@kepler.gl/table';
import {Merge, LayerColumn} from '@kepler.gl/types';

type MapboxLayerGLColumns = {
  lat: LayerColumn;
  lng: LayerColumn;

  // COLUMN_MODE_GEOARROW
  geoarrow?: LayerColumn;
};

export type MapboxLayerGLConfig = Merge<LayerBaseConfig, {columns: MapboxLayerGLColumns}>;

export const COLUMN_MODE_POINTS = 'points';
export const mapboxRequiredColumns = ['lat', 'lng'];
const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Points',
    requiredColumns: mapboxRequiredColumns
  }
];

export const pointColResolver = ({lat, lng, geoarrow}: MapboxLayerGLColumns, columnMode?: string) =>
  `${columnMode}-${lat.fieldIdx}-${lng.fieldIdx}-${geoarrow?.fieldIdx}`;

class MapboxLayerGL extends Layer {
  declare config: MapboxLayerGLConfig;

  get overlayType() {
    return OVERLAY_TYPE_CONST.mapboxgl;
  }

  get type(): string | null {
    return null;
  }

  get isAggregated(): true {
    return true;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get noneLayerDataAffectingProps() {
    return [];
  }

  get visualChannels(): VisualChannels {
    return {};
  }
  datasetSelector = (config: MapboxLayerGLConfig) => config.dataId;
  gpuFilterSelector = (config: MapboxLayerGLConfig, datasets) =>
    ((config.dataId && datasets[config.dataId]) || {}).gpuFilter;
  columnsSelector = (config: MapboxLayerGLConfig) =>
    pointColResolver(config.columns, config.columnMode);

  sourceSelector = createSelector(
    this.datasetSelector,
    this.columnsSelector,
    (datasetId, columns) => `${datasetId}-${columns}`
  );

  filterSelector = createSelector(this.gpuFilterSelector, gpuFilter =>
    gpuFilterToMapboxFilter(gpuFilter)
  );

  isValidFilter(filter) {
    // mapbox will crash if filter is not an array or empty
    return Array.isArray(filter) && filter.length;
  }

  getDataUpdateTriggers({filteredIndex, gpuFilter, id}: KeplerTable): any {
    const {columns} = this.config;

    const visualChannelFields = Object.values(this.visualChannels).reduce(
      (accu, v) => ({
        ...accu,
        ...(this.config[v.field] ? {[v.field]: this.config[v.field].name} : {})
      }),
      {}
    );

    const updateTriggers = {
      getData: {
        datasetId: id,
        columns,
        filteredIndex,
        ...visualChannelFields,
        ...gpuFilter.filterValueUpdateTriggers
      },
      getMeta: {datasetId: id, columns}
    };

    return updateTriggers;
  }

  getGeometry(position) {
    return position.every(Number.isFinite)
      ? {
          type: 'Point',
          coordinates: position
        }
      : null;
  }

  calculateDataAttribute({dataContainer, filteredIndex, gpuFilter}: KeplerTable, getPosition) {
    const getGeometry = d => this.getGeometry(getPosition(d));

    const vcFields = Object.values(this.visualChannels)
      .map(v => this.config[v.field])
      .filter(v => v);

    const getPropertyFromVisualChanel = vcFields.length
      ? d =>
          vcFields.reduce(
            (accu, field) => ({
              ...accu,
              [field.name]: field.valueAccessor(d)
            }),
            {}
          )
      : () => ({});

    const {filterValueUpdateTriggers, filterValueAccessor} = gpuFilter;

    // gpuField To property
    const hasFilter = Object.values(filterValueUpdateTriggers).filter(d => d).length;
    const valueAccessor = filterValueAccessor(dataContainer)();

    const getPropertyFromFilter = hasFilter
      ? d => {
          const filterValue = valueAccessor(d);
          return Object.values(filterValueUpdateTriggers).reduce(
            (accu: any, gpu, i) => ({
              ...accu,
              ...(gpu?.name ? {[prefixGpuField(gpu.name)]: filterValue[i]} : {})
            }),
            {} as {[id: string]: number | number[]}
          );
        }
      : () => ({} as Record<string, number | number[]>);

    const getProperties = d => ({
      ...getPropertyFromVisualChanel(d),
      ...getPropertyFromFilter(d)
    });

    return geoJsonFromData(filteredIndex, getGeometry, getProperties);
  }

  // this layer is rendered at mapbox level
  // todo: maybe need to find a better solution for this one
  shouldRenderLayer() {
    return typeof this.type === 'string' && this.config.isVisible && this.hasAllColumns();
  }
}

export default MapboxLayerGL;
