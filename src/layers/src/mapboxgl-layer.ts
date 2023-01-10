// Copyright (c) 2023 Uber Technologies, Inc.
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

import Layer, {
  LayerBaseConfig,
  LayerColumn,
  OVERLAY_TYPE_CONST,
  VisualChannels
} from './base-layer';
import {createSelector} from 'reselect';

import {geoJsonFromData, prefixGpuField, gpuFilterToMapboxFilter} from './mapbox-utils';
import {default as KeplerTable} from '@kepler.gl/table';
import {Merge} from '@kepler.gl/types';

type MapboxLayerGLColumns = {
  lat: LayerColumn;
  lng: LayerColumn;
};

export type MapboxLayerGLConfig = Merge<LayerBaseConfig, {columns: MapboxLayerGLColumns}>;

export const mapboxRequiredColumns: ['lat', 'lng'] = ['lat', 'lng'];

export const pointColResolver = ({lat, lng}: MapboxLayerGLColumns) =>
  `${lat.fieldIdx}-${lng.fieldIdx}`;

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

  get requiredLayerColumns() {
    return mapboxRequiredColumns;
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
  columnsSelector = (config: MapboxLayerGLConfig) => pointColResolver(config.columns);

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
      : d => ({});

    const {filterValueUpdateTriggers, filterValueAccessor} = gpuFilter;

    // gpuField To property
    const hasFilter = Object.values(filterValueUpdateTriggers).filter(d => d).length;
    const valueAccessor = filterValueAccessor(dataContainer)();

    const getPropertyFromFilter = hasFilter
      ? d => {
          const filterValue = valueAccessor(d);
          return Object.values(filterValueUpdateTriggers).reduce(
            (accu: any, name, i) => ({
              ...accu,
              ...(name ? {[prefixGpuField(name)]: filterValue[i]} : {})
            }),
            {}
          ) as any;
        }
      : d => ({} as any);

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
