// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import keyMirror from 'keymirror';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';
import {ascending, extent} from 'd3-array';

import booleanWithin from '@turf/boolean-within';
import {point as turfPoint} from '@turf/helpers';
import {Decimal} from 'decimal.js';
import {
  ALL_FIELD_TYPES,
  FILTER_TYPES,
  ANIMATION_WINDOW,
  PLOT_TYPES,
  LAYER_TYPES,
  FILTER_VIEW_TYPES
} from '@kepler.gl/constants';
import {VisState} from '@kepler.gl/schemas';
import * as ScaleUtils from './data-scale-utils';
import {h3IsValid} from 'h3-js';

import {
  Entries,
  Field,
  ParsedFilter,
  Filter,
  FilterBase,
  PolygonFilter,
  FieldDomain,
  TimeRangeFieldDomain,
  Feature,
  FeatureValue,
  LineChart,
  RangeFilter,
  TimeRangeFilter,
  RangeFieldDomain,
  FilterDatasetOpt,
  FilterRecord,
  AnimationConfig
} from '@kepler.gl/types';

import {DataContainerInterface} from './data-container-interface';
import {generateHashId, set, toArray} from './utils';
import {notNullorUndefined, timeToUnixMilli, unique} from './data-utils';
import {getCentroid} from './h3-utils';
import {updateTimeFilterPlotType, updateRangeFilterPlotType} from './plot';
import {KeplerTableModel} from './types';

export const durationSecond = 1000;
export const durationMinute = durationSecond * 60;
export const durationHour = durationMinute * 60;
export const durationDay = durationHour * 24;
export const durationWeek = durationDay * 7;
export const durationYear = durationDay * 365;

export type FilterResult = {
  filteredIndexForDomain?: number[];
  filteredIndex?: number[];
};

export type FilterChanged = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof FilterRecord]: {
    [key: string]: 'added' | 'deleted' | 'name_changed' | 'value_changed' | 'dataId_changed';
  } | null;
};

export type dataValueAccessor = (data: {index: number}) => number | null;

export const TimestampStepMap = [
  {max: 1, step: 0.05},
  {max: 10, step: 0.1},
  {max: 100, step: 1},
  {max: 500, step: 5},
  {max: 1000, step: 10},
  {max: 5000, step: 50},
  {max: Number.POSITIVE_INFINITY, step: 1000}
];

export const FILTER_UPDATER_PROPS = keyMirror({
  dataId: null,
  name: null,
  layerId: null
});

export const FILTER_COMPONENTS = {
  [FILTER_TYPES.select]: 'SingleSelectFilter',
  [FILTER_TYPES.multiSelect]: 'MultiSelectFilter',
  [FILTER_TYPES.timeRange]: 'TimeRangeFilter',
  [FILTER_TYPES.range]: 'RangeFilter',
  [FILTER_TYPES.polygon]: 'PolygonFilter'
};

export const DEFAULT_FILTER_STRUCTURE = {
  dataId: [], // [string]
  id: null,
  enabled: true,

  // time range filter specific
  fixedDomain: false,
  view: FILTER_VIEW_TYPES.side,
  isAnimating: false,
  animationWindow: ANIMATION_WINDOW.free,
  speed: 1,

  // field specific
  name: [], // string
  type: null,
  fieldIdx: [], // [integer]
  domain: null,
  value: null,

  // plot
  plotType: {
    type: PLOT_TYPES.histogram
  },
  yAxis: null,

  // mode
  gpu: false
};

export const FILTER_ID_LENGTH = 4;

export const LAYER_FILTERS = [FILTER_TYPES.polygon];

/**
 * Generates a filter with a dataset id as dataId
 */
export function getDefaultFilter({
  dataId,
  id
}: {
  dataId?: string | null | string[];
  id?: string;
} = {}): FilterBase<LineChart> {
  return {
    ...DEFAULT_FILTER_STRUCTURE,
    // store it as dataId and it could be one or many
    dataId: dataId ? toArray(dataId) : [],
    id: id || generateHashId(FILTER_ID_LENGTH)
  };
}

/**
 * Check if a filter is valid based on the given dataId
 * @param  filter to validate
 * @param  datasetId id to validate filter against
 * @return true if a filter is valid, false otherwise
 */
export function shouldApplyFilter(filter: Filter, datasetId: string): boolean {
  const dataIds = toArray(filter.dataId);
  return dataIds.includes(datasetId) && filter.value !== null;
}

/**
 * Validates and modifies polygon filter structure
 * @param dataset
 * @param filter
 * @param layers
 * @return - {filter, dataset}
 */
export function validatePolygonFilter<K extends KeplerTableModel<K, L>, L extends {id: string}>(
  dataset: K,
  filter: PolygonFilter,
  layers: L[]
): {filter: PolygonFilter | null; dataset: K} {
  const failed = {dataset, filter: null};
  const {value, layerId, type, dataId} = filter;

  if (!layerId || !isValidFilterValue(type, value)) {
    return failed;
  }

  const isValidDataset = dataId.includes(dataset.id);

  if (!isValidDataset) {
    return failed;
  }

  const layer = layers.find(l => layerId.includes(l.id));

  if (!layer) {
    return failed;
  }

  return {
    filter: {
      ...filter,
      fieldIdx: []
    },
    dataset
  };
}

/**
 * Custom filter validators
 */
const filterValidators = {
  [FILTER_TYPES.polygon]: validatePolygonFilter
};

/**
 * Default validate filter function
 * @param dataset
 * @param filter
 * @return - {filter, dataset}
 */
export function validateFilter<K extends KeplerTableModel<K, L>, L>(
  dataset: K,
  filter: ParsedFilter
): {filter: Filter | null; dataset: K} {
  // match filter.dataId
  const failed = {dataset, filter: null};
  const filterDataId = toArray(filter.dataId);

  const filterDatasetIndex = filterDataId.indexOf(dataset.id);
  if (filterDatasetIndex < 0 || !toArray(filter.name)[filterDatasetIndex]) {
    // the current filter is not mapped against the current dataset
    return failed;
  }

  const initializeFilter: Filter = {
    ...getDefaultFilter({dataId: filter.dataId}),
    ...filter,
    dataId: filterDataId,
    name: toArray(filter.name)
  };

  const fieldName = initializeFilter.name[filterDatasetIndex];
  const {filter: updatedFilter, dataset: updatedDataset} = applyFilterFieldName(
    initializeFilter,
    dataset,
    fieldName,
    filterDatasetIndex,
    {mergeDomain: true}
  );

  if (!updatedFilter) {
    return failed;
  }

  // don't adjust value yet before all datasets are loaded
  updatedFilter.view = filter.view ?? updatedFilter.view;

  if (updatedFilter.value === null) {
    // cannot adjust saved value to filter
    return failed;
  }

  return {
    filter: validateFilterYAxis(updatedFilter, updatedDataset),
    dataset: updatedDataset
  };
}

/**
 * Validate saved filter config with new data
 *
 * @param dataset
 * @param filter - filter to be validate
 * @param layers - layers
 * @return validated filter
 */
export function validateFilterWithData<K extends KeplerTableModel<K, L>, L>(
  dataset: K,
  filter: ParsedFilter,
  layers: L[]
): {filter: Filter; dataset: K} {
  return filter.type && Object.prototype.hasOwnProperty.call(filterValidators, filter.type)
    ? filterValidators[filter.type](dataset, filter, layers)
    : validateFilter(dataset, filter);
}

/**
 * Validate YAxis
 * @param filter
 * @param dataset
 * @return {*}
 */
function validateFilterYAxis(filter, dataset) {
  // TODO: validate yAxis against other datasets

  const {fields} = dataset;
  const {yAxis} = filter;
  // TODO: validate yAxis against other datasets
  if (yAxis) {
    const matchedAxis = fields.find(({name, type}) => name === yAxis.name && type === yAxis.type);

    filter = matchedAxis
      ? {
          ...filter,
          yAxis: matchedAxis
        }
      : filter;
  }

  return filter;
}

/**
 * Get default filter prop based on field type
 *
 * @param field
 * @param fieldDomain
 * @returns default filter
 */
export function getFilterProps(
  field: Field,
  fieldDomain: FieldDomain
): Partial<Filter> & {fieldType: string} {
  const filterProps = {
    ...fieldDomain,
    fieldType: field.type,
    view: FILTER_VIEW_TYPES.side
  };

  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      return {
        ...filterProps,
        value: fieldDomain.domain,
        type: FILTER_TYPES.range,
        // @ts-expect-error
        typeOptions: [FILTER_TYPES.range],
        gpu: true
      };

    case ALL_FIELD_TYPES.boolean:
      // @ts-expect-error
      return {
        ...filterProps,
        type: FILTER_TYPES.select,
        value: true,
        gpu: false
      };

    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      // @ts-expect-error
      return {
        ...filterProps,
        type: FILTER_TYPES.multiSelect,
        value: [],
        gpu: false
      };

    case ALL_FIELD_TYPES.timestamp:
      // @ts-expect-error
      return {
        ...filterProps,
        type: FILTER_TYPES.timeRange,
        view: FILTER_VIEW_TYPES.enlarged,
        fixedDomain: true,
        value: filterProps.domain,
        gpu: true,
        plotType: {}
      };

    default:
      // @ts-expect-error
      return {};
  }
}

export const getPolygonFilterFunctor = (layer, filter, dataContainer) => {
  const getPosition = layer.getPositionAccessor(dataContainer);

  switch (layer.type) {
    case LAYER_TYPES.point:
    case LAYER_TYPES.icon:
      return data => {
        const pos = getPosition(data);
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };
    case LAYER_TYPES.arc:
    case LAYER_TYPES.line:
      return data => {
        const pos = getPosition(data);
        return (
          pos.every(Number.isFinite) &&
          [
            [pos[0], pos[1]],
            [pos[3], pos[4]]
          ].every(point => isInPolygon(point, filter.value))
        );
      };
    case LAYER_TYPES.hexagonId:
      if (layer.dataToFeature && layer.dataToFeature.centroids) {
        return data => {
          // null or getCentroid({id})
          const centroid = layer.dataToFeature.centroids[data.index];
          return centroid && isInPolygon(centroid, filter.value);
        };
      }
      return data => {
        const id = getPosition(data);
        if (!h3IsValid(id)) {
          return false;
        }
        const pos = getCentroid({id});
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };
    case LAYER_TYPES.geojson:
      return data => {
        return layer.isInPolygon(data, data.index, filter.value);
      };
    default:
      return () => true;
  }
};

/**
 * Check if a GeoJSON feature filter can be applied to a layer
 */
export function canApplyFeatureFilter(feature: Feature | null): boolean {
  return Boolean(feature?.geometry && ['Polygon', 'MultiPolygon'].includes(feature.geometry.type));
}

/**
 * @param param An object that represents a row record.
 * @param param.index Index of the row in data container.
 * @returns Returns true to keep the element, or false otherwise.
 */
type filterFunction = (data: {index: number}) => boolean;

/**
 * @param field dataset Field
 * @param dataId Dataset id
 * @param filter Filter object
 * @param layers list of layers to filter upon
 * @param dataContainer Data container
 * @return filterFunction
 */
/* eslint-disable complexity */
export function getFilterFunction<L extends {config: {dataId: string | null}; id: string}>(
  field: Field | null,
  dataId: string,
  filter: Filter,
  layers: L[],
  dataContainer: DataContainerInterface
): filterFunction {
  // field could be null in polygon filter
  const valueAccessor = field ? field.valueAccessor : () => null;
  const defaultFunc = () => true;

  if (filter.enabled === false) {
    return defaultFunc;
  }

  switch (filter.type) {
    case FILTER_TYPES.range:
      return data => isInRange(valueAccessor(data), filter.value);
    case FILTER_TYPES.multiSelect:
      return data => filter.value.includes(valueAccessor(data));
    case FILTER_TYPES.select:
      return data => valueAccessor(data) === filter.value;
    case FILTER_TYPES.timeRange: {
      if (!field) {
        return defaultFunc;
      }
      const mappedValue = get(field, ['filterProps', 'mappedValue']);
      const accessor = Array.isArray(mappedValue)
        ? data => mappedValue[data.index]
        : data => timeToUnixMilli(valueAccessor(data), field.format);
      return data => isInRange(accessor(data), filter.value);
    }
    case FILTER_TYPES.polygon: {
      if (!layers || !layers.length || !filter.layerId) {
        return defaultFunc;
      }
      const layerFilterFunctions = filter.layerId
        .map(id => layers.find(l => l.id === id))
        .filter(l => l && l.config.dataId === dataId)
        .map(layer => getPolygonFilterFunctor(layer, filter, dataContainer));

      return data => layerFilterFunctions.every(filterFunc => filterFunc(data));
    }
    default:
      return defaultFunc;
  }
}

export function updateFilterDataId(dataId: string | string[]): FilterBase<LineChart> {
  return getDefaultFilter({dataId});
}

export function filterDataByFilterTypes(
  {
    dynamicDomainFilters,
    cpuFilters,
    filterFuncs
  }: {
    dynamicDomainFilters: Filter[] | null;
    cpuFilters: Filter[] | null;
    filterFuncs: {
      [key: string]: filterFunction;
    };
  },
  dataContainer: DataContainerInterface
): FilterResult {
  const filteredIndexForDomain: number[] = [];
  const filteredIndex: number[] = [];

  const filterContext = {index: -1, dataContainer};
  const filterFuncCaller = (filter: Filter) => filterFuncs[filter.id](filterContext);

  const numRows = dataContainer.numRows();
  for (let i = 0; i < numRows; ++i) {
    filterContext.index = i;

    const matchForDomain = dynamicDomainFilters && dynamicDomainFilters.every(filterFuncCaller);
    if (matchForDomain) {
      filteredIndexForDomain.push(filterContext.index);
    }

    const matchForRender = cpuFilters && cpuFilters.every(filterFuncCaller);
    if (matchForRender) {
      filteredIndex.push(filterContext.index);
    }
  }

  return {
    ...(dynamicDomainFilters ? {filteredIndexForDomain} : {}),
    ...(cpuFilters ? {filteredIndex} : {})
  };
}

/**
 * Get a record of filters based on domain type and gpu / cpu
 */
export function getFilterRecord(
  dataId: string,
  filters: Filter[],
  opt: FilterDatasetOpt = {}
): FilterRecord {
  const filterRecord: FilterRecord = {
    dynamicDomain: [],
    fixedDomain: [],
    cpu: [],
    gpu: []
  };

  filters.forEach(f => {
    if (isValidFilterValue(f.type, f.value) && toArray(f.dataId).includes(dataId)) {
      (f.fixedDomain || opt.ignoreDomain
        ? filterRecord.fixedDomain
        : filterRecord.dynamicDomain
      ).push(f);

      (f.gpu && !opt.cpuOnly ? filterRecord.gpu : filterRecord.cpu).push(f);
    }
  });

  return filterRecord;
}

/**
 * Compare filter records to get what has changed
 */
export function diffFilters(
  filterRecord: FilterRecord,
  oldFilterRecord: FilterRecord | Record<string, never> = {}
): FilterChanged {
  let filterChanged: Partial<FilterChanged> = {};

  (Object.entries(filterRecord) as Entries<FilterRecord>).forEach(([record, items]) => {
    items.forEach(filter => {
      const oldFilter: Filter | undefined = (oldFilterRecord[record] || []).find(
        (f: Filter) => f.id === filter.id
      );

      if (!oldFilter) {
        // added
        filterChanged = set([record, filter.id], 'added', filterChanged);
      } else {
        // check  what has changed
        ['name', 'value', 'dataId'].forEach(prop => {
          if (filter[prop] !== oldFilter[prop]) {
            filterChanged = set([record, filter.id], `${prop}_changed`, filterChanged);
          }
        });
      }
    });

    (oldFilterRecord[record] || []).forEach((oldFilter: Filter) => {
      // deleted
      if (!items.find(f => f.id === oldFilter.id)) {
        filterChanged = set([record, oldFilter.id], 'deleted', filterChanged);
      }
    });
  });

  return {...{dynamicDomain: null, fixedDomain: null, cpu: null, gpu: null}, ...filterChanged};
}

/**
 * Call by parsing filters from URL
 * Check if value of filter within filter domain, if not adjust it to match
 * filter domain
 *
 * @returns value - adjusted value to match filter or null to remove filter
 */
// eslint-disable-next-line complexity
export function adjustValueToFilterDomain(value: Filter['value'], {domain, type}) {
  if (!type) {
    return false;
  }
  // if the current filter is a polygon it will not have any domain
  // all other filter types require domain
  if (type !== FILTER_TYPES.polygon && !domain) {
    return false;
  }

  switch (type) {
    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      if (!Array.isArray(value) || value.length !== 2) {
        return domain.map(d => d);
      }

      return value.map((d, i) => (notNullorUndefined(d) && isInRange(d, domain) ? d : domain[i]));

    case FILTER_TYPES.multiSelect: {
      if (!Array.isArray(value)) {
        return [];
      }
      const filteredValue = value.filter(d => domain.includes(d));
      return filteredValue.length ? filteredValue : [];
    }
    case FILTER_TYPES.select:
      return domain.includes(value) ? value : true;
    case FILTER_TYPES.polygon:
      return value;

    default:
      return null;
  }
}

/**
 * Calculate numeric domain and suitable step
 */
export function getNumericFieldDomain(
  dataContainer: DataContainerInterface,
  valueAccessor: dataValueAccessor
): RangeFieldDomain {
  let domain: [number, number] = [0, 1];
  let step = 0.1;

  const mappedValue = dataContainer.mapIndex(valueAccessor);

  if (dataContainer.numRows() > 1) {
    domain = ScaleUtils.getLinearDomain(mappedValue);
    const diff = domain[1] - domain[0];

    // in case equal domain, [96, 96], which will break quantize scale
    if (!diff) {
      domain[1] = domain[0] + 1;
    }

    step = getNumericStepSize(diff) || step;
    domain[0] = formatNumberByStep(domain[0], step, 'floor');
    domain[1] = formatNumberByStep(domain[1], step, 'ceil');
  }

  return {domain, step};
}

/**
 * Calculate step size for range and timerange filter
 */
export function getNumericStepSize(diff: number): number {
  diff = Math.abs(diff);

  if (diff > 100) {
    return 1;
  } else if (diff > 3) {
    return 0.01;
  } else if (diff > 1) {
    return 0.001;
  }
  // Try to get at least 1000 steps - and keep the step size below that of
  // the (diff > 1) case.
  const x = diff / 1000;
  // Find the exponent and truncate to 10 to the power of that exponent

  const exponentialForm = x.toExponential();
  const exponent = parseFloat(exponentialForm.split('e')[1]);

  // Getting ready for node 12
  // this is why we need decimal.js
  // Math.pow(10, -5) = 0.000009999999999999999
  // the above result shows in browser and node 10
  // node 12 behaves correctly
  return new Decimal(10).pow(exponent).toNumber();
}

/**
 * Calculate timestamp domain and suitable step
 */
export function getTimestampFieldDomain(
  dataContainer: DataContainerInterface,
  valueAccessor: dataValueAccessor
): TimeRangeFieldDomain {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain
  const mappedValue = dataContainer.mapIndex(valueAccessor);

  const domain = ScaleUtils.getLinearDomain(mappedValue);
  const defaultTimeFormat = getTimeWidgetTitleFormatter(domain);

  let step = 0.01;

  const diff = domain[1] - domain[0];
  // in case equal timestamp add 1 second padding to prevent break
  if (!diff) {
    domain[1] = domain[0] + 1000;
  }
  const entry = TimestampStepMap.find(f => f.max >= diff);
  if (entry) {
    step = entry.step;
  }

  return {
    domain,
    step,
    mappedValue,
    defaultTimeFormat
  };
}

/**
 * round number based on step
 *
 * @param {Number} val
 * @param {Number} step
 * @param {string} bound
 * @returns {Number} rounded number
 */
export function formatNumberByStep(val: number, step: number, bound: 'floor' | 'ceil'): number {
  if (bound === 'floor') {
    return Math.floor(val * (1 / step)) / (1 / step);
  }

  return Math.ceil(val * (1 / step)) / (1 / step);
}

export function isInRange(val: any, domain: number[]): boolean {
  if (!Array.isArray(domain)) {
    return false;
  }

  return val >= domain[0] && val <= domain[1];
}

/**
 * Determines whether a point is within the provided polygon
 *
 * @param point as input search [lat, lng]
 * @param polygon Points must be within these (Multi)Polygon(s)
 * @return {boolean}
 */
export function isInPolygon(point: number[], polygon: any): boolean {
  return booleanWithin(turfPoint(point), polygon);
}
export function getTimeWidgetTitleFormatter(domain: [number, number]): string | null {
  if (!isValidTimeDomain(domain)) {
    return null;
  }

  const diff = domain[1] - domain[0];

  // Local aware formats
  // https://momentjs.com/docs/#/parsing/string-format
  return diff > durationYear ? 'L' : diff > durationDay ? 'L LT' : 'L LTS';
}

/**
 * Sanity check on filters to prepare for save
 * @type {typeof import('./filter-utils').isFilterValidToSave}
 */
export function isFilterValidToSave(filter: any): boolean {
  return (
    filter?.type && Array.isArray(filter?.name) && (filter?.name.length || filter?.layerId.length)
  );
}

/**
 * Sanity check on filters to prepare for save
 * @type {typeof import('./filter-utils').isValidFilterValue}
 */
/* eslint-disable complexity */
export function isValidFilterValue(type: string | null, value: any): boolean {
  if (!type) {
    return false;
  }
  switch (type) {
    case FILTER_TYPES.select:
      return value === true || value === false;

    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      return Array.isArray(value) && value.every(v => v !== null && !isNaN(v));

    case FILTER_TYPES.multiSelect:
      return Array.isArray(value) && Boolean(value.length);

    case FILTER_TYPES.input:
      return Boolean(value.length);

    case FILTER_TYPES.polygon: {
      const coordinates = get(value, ['geometry', 'coordinates']);
      return Boolean(value && value.id && coordinates);
    }
    default:
      return true;
  }
}

export function getColumnFilterProps<K extends KeplerTableModel<K, L>, L>(
  filter: Filter,
  dataset: K
): {lineChart: LineChart; yAxs: Field} | Record<string, any> {
  if (filter.plotType?.type === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  const {mappedValue = []} = filter;
  const {yAxis} = filter;
  const fieldIdx = dataset.getColumnFieldIdx(yAxis.name);
  if (fieldIdx < 0) {
    // Console.warn(`yAxis ${yAxis.name} does not exist in dataset`);
    return {lineChart: {}, yAxis};
  }

  // return lineChart
  const series = dataset.dataContainer
    .map(
      (row, rowIndex) => ({
        x: mappedValue[rowIndex],
        y: row.valueAt(fieldIdx)
      }),
      true
    )
    .filter(({x, y}) => Number.isFinite(x) && Number.isFinite(y))
    .sort((a, b) => ascending(a.x, b.x));

  const yDomain = extent(series, d => d.y) as [number, number];
  const xDomain = [series[0].x, series[series.length - 1].x] as [number, number];

  return {lineChart: {series, yDomain, xDomain}, yAxis};
}

export function updateFilterPlot<K extends KeplerTableModel<K, any>>(
  datasets: {[id: string]: K},
  filter: Filter,
  dataId: string | undefined = undefined
) {
  if (dataId) {
    filter = removeFilterPlot(filter, dataId);
  }

  if (filter.type === FILTER_TYPES.timeRange) {
    return updateTimeFilterPlotType(filter as TimeRangeFilter, filter.plotType, datasets);
  } else if (filter.type === FILTER_TYPES.range) {
    return updateRangeFilterPlotType(filter as RangeFilter, filter.plotType, datasets);
  }
  return filter;
}

/**
 *
 * @param datasetIds list of dataset ids to be filtered
 * @param datasets all datasets
 * @param filters all filters to be applied to datasets
 * @return datasets - new updated datasets
 */
export function applyFiltersToDatasets<
  K extends KeplerTableModel<K, L>,
  L extends {config: {dataId: string | null}}
>(
  datasetIds: string[],
  datasets: {[id: string]: K},
  filters: Filter[],
  layers?: L[]
): {[id: string]: K} {
  const dataIds = toArray(datasetIds);
  return dataIds.reduce((acc, dataId) => {
    const layersToFilter = (layers || []).filter(l => l.config.dataId === dataId);
    const appliedFilters = filters.filter(d => shouldApplyFilter(d, dataId));
    const table = datasets[dataId];

    return {
      ...acc,
      [dataId]: table.filterTable(appliedFilters, layersToFilter, {})
    };
  }, datasets);
}

/**
 * Applies a new field name value to filter and update both filter and dataset
 * @param filter - to be applied the new field name on
 * @param dataset - dataset the field belongs to
 * @param fieldName - field.name
 * @param filterDatasetIndex - field.name
 * @param option
 * @return - {filter, datasets}
 */
export function applyFilterFieldName<K extends KeplerTableModel<K, L>, L>(
  filter: Filter,
  dataset: K,
  fieldName: string,
  filterDatasetIndex = 0,
  option?: {mergeDomain: boolean}
): {
  filter: Filter | null;
  dataset: K;
} {
  // using filterDatasetIndex we can filter only the specified dataset
  const mergeDomain =
    option && Object.prototype.hasOwnProperty.call(option, 'mergeDomain')
      ? option.mergeDomain
      : false;

  const fieldIndex = dataset.getColumnFieldIdx(fieldName);
  // if no field with same name is found, move to the next datasets
  if (fieldIndex === -1) {
    // throw new Error(`fieldIndex not found. Dataset must contain a property with name: ${fieldName}`);
    return {filter: null, dataset};
  }

  // TODO: validate field type
  const filterProps = dataset.getColumnFilterProps(fieldName);

  let newFilter = {
    ...(mergeDomain ? mergeFilterDomainStep(filter, filterProps) : {...filter, ...filterProps}),
    name: Object.assign([...toArray(filter.name)], {[filterDatasetIndex]: fieldName}),
    fieldIdx: Object.assign([...toArray(filter.fieldIdx)], {
      [filterDatasetIndex]: fieldIndex
    }),
    // Make sure plotType is not overwritten by the default empty plotType
    ...(filter.plotType ? {plotType: filter.plotType} : {})
  };

  // TODO: if we don't set filter value in filterProps, we don't need to do this
  if (filterDatasetIndex > 0) {
    // don't reset the filter value if we are just adding a synced dataset
    newFilter = {
      ...newFilter,
      value: filter.value
    };
  }

  return {
    filter: newFilter,
    dataset
  };
}

/**
 * Merge one filter with other filter prop domain
 */
/* eslint-disable complexity */
export function mergeFilterDomainStep(
  filter: Filter,
  filterProps?: Partial<Filter>
): (Filter & {step?: number}) | null {
  if (!filter) {
    return null;
  }

  if (!filterProps) {
    return filter;
  }

  if ((filter.fieldType && filter.fieldType !== filterProps.fieldType) || !filterProps.domain) {
    return filter;
  }

  const sortedDomain = !filter.domain
    ? filterProps.domain
    : [...(filter.domain || []), ...(filterProps.domain || [])].sort((a, b) => a - b);

  const newFilter = {
    ...filter,
    ...filterProps,
    // use min max as default domain
    domain: [sortedDomain[0], sortedDomain[sortedDomain.length - 1]]
  };

  switch (filterProps.fieldType) {
    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
      return {
        ...newFilter,
        domain: unique(sortedDomain)
      };

    case ALL_FIELD_TYPES.timestamp: {
      const step =
        (filter as TimeRangeFilter).step < (filterProps as TimeRangeFieldDomain).step
          ? (filter as TimeRangeFilter).step
          : (filterProps as TimeRangeFieldDomain).step;

      return {
        ...newFilter,
        step
      };
    }
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
    default:
      return newFilter;
  }
}
/* eslint-enable complexity */

/**
 * Generates polygon filter
 */
export const featureToFilterValue = (
  feature: Feature,
  filterId: string,
  properties?: Record<string, any>
): FeatureValue => ({
  ...feature,
  id: feature.id,
  properties: {
    ...feature.properties,
    ...properties,
    filterId
  }
});

export const getFilterIdInFeature = (f: FeatureValue): string => get(f, ['properties', 'filterId']);

/**
 * Generates polygon filter
 */
export function generatePolygonFilter<
  L extends {config: {dataId: string | null; label: string}; id: string}
>(layers: L[], feature: Feature): PolygonFilter {
  const dataId = layers.map(l => l.config.dataId).filter(notNullorUndefined);
  const layerId = layers.map(l => l.id);
  const name = layers.map(l => l.config.label);
  const filter = getDefaultFilter({dataId});
  return {
    ...filter,
    fixedDomain: true,
    type: FILTER_TYPES.polygon,
    name,
    layerId,
    value: featureToFilterValue(feature, filter.id, {isVisible: true})
  };
}

/**
 * Run filter entirely on CPU
 */
interface StateType<K extends KeplerTableModel<K, L>, L> {
  layers: L[];
  filters: Filter[];
  datasets: {[id: string]: K};
}

export function filterDatasetCPU<T extends StateType<K, L>, K extends KeplerTableModel<K, L>, L>(
  state: T,
  dataId: string
): T {
  const datasetFilters = state.filters.filter(f => f.dataId.includes(dataId));
  const dataset = state.datasets[dataId];

  if (!dataset) {
    return state;
  }

  const cpuFilteredDataset = dataset.filterTableCPU(datasetFilters, state.layers);

  return set(['datasets', dataId], cpuFilteredDataset, state);
}

/**
 * Validate parsed filters with datasets and add filterProps to field
 */
type MinVisStateForFilter = Pick<VisState, 'layers' | 'datasets' | 'isMergingDatasets'>;
export function validateFiltersUpdateDatasets<
  S extends MinVisStateForFilter,
  K extends KeplerTableModel<K, L>,
  L extends {config: {dataId: string | null; label: string}; id: string}
>(
  state: S,
  filtersToValidate: ParsedFilter[] = []
): {
  validated: Filter[];
  failed: Filter[];
  updatedDatasets: S['datasets'];
} {
  // TODO Better Typings here
  const validated: any[] = [];
  const failed: any[] = [];
  const {datasets} = state;
  let updatedDatasets = datasets;

  // merge filters
  filtersToValidate.forEach(filterToValidate => {
    // we can only look for datasets define in the filter dataId
    const datasetIds = toArray(filterToValidate.dataId);

    // we can merge a filter only if all datasets in filter.dataId are loaded
    if (datasetIds.every(d => datasets[d] && !state.isMergingDatasets[d])) {
      // all datasetIds in filter must be present the state datasets
      const {validatedFilter, applyToDatasets, augmentedDatasets} = datasetIds.reduce<{
        validatedFilter: Filter | null;
        applyToDatasets: string[];
        augmentedDatasets: {[datasetId: string]: any};
      }>(
        (acc, datasetId, idx) => {
          const dataset = updatedDatasets[datasetId];
          const layers = state.layers.filter(l => l.config.dataId === dataset.id);
          const toValidate = acc.validatedFilter || filterToValidate;

          const {filter: updatedFilter, dataset: updatedDataset} = validateFilterWithData(
            acc.augmentedDatasets[datasetId] || dataset,
            toValidate,
            layers
          );

          if (updatedFilter) {
            // merge filter domain step
            return {
              validatedFilter: updatedFilter,

              applyToDatasets: [...acc.applyToDatasets, datasetId],

              augmentedDatasets: {
                ...acc.augmentedDatasets,
                [datasetId]: updatedDataset
              }
            };
          }

          return acc;
        },
        {
          validatedFilter: null,
          applyToDatasets: [],
          augmentedDatasets: {}
        }
      );

      if (validatedFilter && isEqual(datasetIds, applyToDatasets)) {
        validatedFilter.value = adjustValueToFilterDomain(filterToValidate.value, validatedFilter);
        validated.push(updateFilterPlot(datasets, validatedFilter));
        updatedDatasets = {
          ...updatedDatasets,
          ...augmentedDatasets
        };
      } else {
        failed.push(filterToValidate);
      }
    } else {
      failed.push(filterToValidate);
    }
  });

  return {validated, failed, updatedDatasets};
}

export function removeFilterPlot(filter: Filter, dataId: string) {
  let nextFilter = filter;

  const rangeFilter = filter as RangeFilter;
  if (rangeFilter.bins && rangeFilter.bins[dataId]) {
    const {[dataId]: _delete, ...nextBins} = rangeFilter.bins;
    nextFilter = {
      ...rangeFilter,
      bins: nextBins
    };
  }

  const timeFilter = filter as TimeRangeFilter;
  if (timeFilter.timeBins && timeFilter.timeBins[dataId]) {
    const {[dataId]: __delete, ...nextTimeBins} = timeFilter.timeBins;
    nextFilter = {
      ...nextFilter,
      timeBins: nextTimeBins
    } as Filter;
  }

  return nextFilter;
}

export function isValidTimeDomain(domain) {
  return Array.isArray(domain) && domain.every(Number.isFinite);
}

export function getTimeWidgetHintFormatter(domain: [number, number]): string | undefined {
  if (!isValidTimeDomain(domain)) {
    return undefined;
  }

  const diff = domain[1] - domain[0];
  return diff > durationWeek
    ? 'L'
    : diff > durationDay
    ? 'L LT'
    : diff > durationHour
    ? 'LT'
    : 'LTS';
}

export function isSideFilter(filter: Filter): boolean {
  return filter.view === FILTER_VIEW_TYPES.side;
}

export function mergeTimeDomains(domains: ([number, number] | null)[]): [number, number] {
  return domains.reduce(
    (acc: [number, number], domain) => [
      Math.min(acc[0], domain?.[0] ?? Infinity),
      Math.max(acc[1], domain?.[1] ?? -Infinity)
    ],
    [Number(Infinity), -Infinity]
  ) as [number, number];
}

/**
 * @param {Layer} layer
 */
export function isLayerAnimatable(layer: any): boolean {
  return layer.config.animation?.enabled && Array.isArray(layer.config.animation.domain);
}

/**
 * @param {Layer[]} layers
 * @returns {Layer[]}
 */
export function getAnimatableVisibleLayers(layers: any[]): any[] {
  return layers.filter(l => isLayerAnimatable(l) && l.config.isVisible);
}

/**
 * @param {Layer[]} layers
 * @param {string} type
 * @returns {Layer[]}
 */
export function getAnimatableVisibleLayersByType(layers: any[], type: string): any[] {
  return getAnimatableVisibleLayers(layers).filter(l => l.type === type);
}

/**
 * @param {Layer[]} layers
 * @returns {Layer[]}
 */
export function getIntervalBasedAnimationLayers(layers: any[]): any[] {
  // @ts-ignore
  return getAnimatableVisibleLayers(layers).filter(l => l.config.animation?.timeSteps);
}

export function mergeFilterWithTimeline(
  filter: TimeRangeFilter,
  animationConfig: AnimationConfig
): {filter: TimeRangeFilter; animationConfig: AnimationConfig} {
  if (
    filter?.type === FILTER_TYPES.timeRange &&
    filter.syncedWithLayerTimeline &&
    animationConfig &&
    Array.isArray(animationConfig.domain)
  ) {
    const domain = mergeTimeDomains([filter.domain, animationConfig.domain as [number, number]]);
    return {
      filter: {
        ...filter,
        domain
      },
      animationConfig: {
        ...animationConfig,
        domain
      }
    };
  }
  return {filter, animationConfig};
}

export function scaleSourceDomainToDestination(
  sourceDomain: [number, number],
  destinationDomain: [number, number]
): [number, number] {
  // 0 -> 100: merged domains t1 - t0 === 100% filter may already have this info which is good
  const sourceDomainSize = sourceDomain[1] - sourceDomain[0];
  // 10 -> 20: animationConfig domain d1 - d0 === animationConfig size
  const destinationDomainSize = destinationDomain[1] - destinationDomain[0];
  // scale animationConfig size using domain size
  const scaledSourceDomainSize = (sourceDomainSize / destinationDomainSize) * 100;
  // scale d0 - t0 using domain size to find starting point
  const offset = sourceDomain[0] - destinationDomain[0];
  const scaledOffset = (offset / destinationDomainSize) * 100;
  return [scaledOffset, scaledSourceDomainSize + scaledOffset];
}

export function getFilterScaledTimeline(filter, animationConfig): [number, number] | [] {
  if (!(filter.syncedWithLayerTimeline && animationConfig?.domain)) {
    return [];
  }

  return scaleSourceDomainToDestination(animationConfig.domain, filter.domain);
}
