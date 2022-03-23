// Copyright (c) 2022 Uber Technologies, Inc.
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

import {console as Console} from 'global/console';
import {TRIP_POINT_FIELDS, SORT_ORDER} from 'constants/default-settings';
import {ascending, descending} from 'd3-array';

// import {validateInputData} from 'processors/data-processor';
import {generateHashId} from 'utils/utils';
import {getGpuFilterProps, getDatasetFieldIndexForFilter} from 'utils/gpu-filter-utils';
import {
  getFilterProps,
  getFilterRecord,
  diffFilters,
  getFilterFunction,
  filterDataByFilterTypes,
  getNumericFieldDomain,
  getTimestampFieldDomain,
  FilterResult
} from 'utils/filter-utils';
import {maybeToDate, getSortingFunction} from 'utils/data-utils';
import {
  getQuantileDomain,
  getOrdinalDomain,
  getLogDomain,
  getLinearDomain
} from 'utils/data-scale-utils';

import {ALL_FIELD_TYPES, SCALE_TYPES} from 'constants/default-settings';

import {createDataContainer} from './data-container-utils';

import {RGBColor} from 'reducers/types';
import {Layer} from 'layers';
import {FieldDomain, Filter} from 'reducers/vis-state-updaters';
import {DataContainerInterface} from './data-container-interface';
import {ProtoDataset} from 'actions';

export type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  displayName: string;
  format: string;
  type: string;
  fieldIdx: number;
  valueAccessor(v: {index: number}): any;
  filterProps?: any;
  metadata?: any;
};

export type GpuFilter = {
  filterRange: number[][];
  filterValueUpdateTriggers: any;
  filterValueAccessor: (
    dc: DataContainerInterface
  ) => (
    getIndex?: (any) => number,
    getData?: (dc: DataContainerInterface, d: any, fieldIndex: number) => any
  ) => (d: any) => number;
};

export type FieldPair = {
  defaultName: string;
  pair: {
    [key: string]: {
      fieldIdx: number;
      value: string;
    };
  };
  suffix: string[];
};

export type FilterRecord = {
  dynamicDomain: Filter[];
  fixedDomain: Filter[];
  cpu: Filter[];
  gpu: Filter[];
};

export type FilterDatasetOpt = {
  // only allow cpu filtering
  cpuOnly?: boolean;
  // ignore filter for domain calculation
  ignoreDomain?: boolean;
};

// Unique identifier of each field
const FID_KEY = 'name';

class KeplerTable {
  readonly id: string;

  type?: string;
  label: string;
  color: RGBColor;

  // fields and data
  fields: Field[];

  dataContainer: DataContainerInterface;

  allIndexes: number[];
  filteredIndex: number[];
  filteredIdxCPU?: number[];
  filteredIndexForDomain: number[];
  fieldPairs: FieldPair[];
  gpuFilter: GpuFilter;
  filterRecord?: FilterRecord;
  filterRecordCPU?: FilterRecord;
  changedFilters?: any;

  // table-injected metadata
  sortColumn?: {
    // column name: sorted idx
    [key: string]: string; // ASCENDING | DESCENDING | UNSORT
  };
  sortOrder?: number[] | null;

  pinnedColumns?: string[];
  supportedFilterTypes: string[] | undefined;
  // table-injected metadata
  metadata: object;

  constructor({
    info = {},
    data,
    color,
    metadata,
    supportedFilterTypes
  }: {
    info?: ProtoDataset['info'];
    data: ProtoDataset['data'];
    color: RGBColor;
    metadata?: ProtoDataset['metadata'];
    supportedFilterTypes?: ProtoDataset['supportedFilterTypes'];
  }) {
    // TODO - what to do if validation fails? Can kepler handle exceptions?
    // const validatedData = validateInputData(data);
    // if (!validatedData) {
    //   return this;
    // }

    // @ts-expect-error
    const dataContainer = createDataContainer(data.rows, {fields: data.fields});

    const datasetInfo = {
      id: generateHashId(4),
      label: 'new dataset',
      ...(info || {})
    };
    const dataId = datasetInfo.id;
    // @ts-expect-error
    const fields: Field[] = data.fields.map((f, i) => ({
      ...f,
      fieldIdx: i,
      id: f.name,
      displayName: f.displayName || f.name,
      // @ts-expect-error
      valueAccessor: maybeToDate.bind(
        null,
        // is time
        f.type === ALL_FIELD_TYPES.timestamp,
        i,
        f.format,
        dataContainer
      )
    }));

    const allIndexes = dataContainer.getPlainIndex();

    this.id = datasetInfo.id;
    this.label = datasetInfo.label;
    this.color = color;
    this.metadata = {
      ...metadata,
      id: datasetInfo.id,
      label: datasetInfo.label
    };

    this.dataContainer = dataContainer;
    this.allIndexes = allIndexes;
    this.filteredIndex = allIndexes;
    this.filteredIndexForDomain = allIndexes;
    this.fieldPairs = findPointFieldPairs(fields);
    this.fields = fields;
    this.gpuFilter = getGpuFilterProps([], dataId, fields);
    if (supportedFilterTypes) {
      this.supportedFilterTypes = supportedFilterTypes;
    }
  }

  /**
   * Get field
   * @param columnName
   */
  getColumnField(columnName: string): Field | undefined {
    const field = this.fields.find(fd => fd[FID_KEY] === columnName);
    this._assetField(columnName, field);
    return field;
  }

  /**
   * Get fieldIdx
   * @param columnName
   */
  getColumnFieldIdx(columnName: string): number {
    const fieldIdx = this.fields.findIndex(fd => fd[FID_KEY] === columnName);
    this._assetField(columnName, Boolean(fieldIdx > -1));
    return fieldIdx;
  }

  /**
   * Get the value of a cell
   */
  getValue(columnName: string, rowIdx: number): any {
    const field = this.getColumnField(columnName);
    return field ? field.valueAccessor({index: rowIdx}) : null;
  }

  /**
   * Updates existing field with a new object
   * @param fieldIdx
   * @param newField
   */
  updateColumnField(fieldIdx: number, newField: Field): void {
    this.fields = Object.assign([...this.fields], {[fieldIdx]: newField});
  }

  /**
   * Update dataset color by custom color
   * @param newColor
   */
  updateTableColor(newColor: RGBColor): void {
    this.color = newColor;
  }

  /**
   * Save filterProps to field and retrieve it
   * @param columnName
   */
  getColumnFilterProps(columnName: string): Field['filterProps'] | null | undefined {
    const fieldIdx = this.getColumnFieldIdx(columnName);
    if (fieldIdx < 0) {
      return null;
    }
    const field = this.fields[fieldIdx];
    if (field.hasOwnProperty('filterProps')) {
      return field.filterProps;
    }

    const fieldDomain = this.getColumnFilterDomain(field);
    if (!fieldDomain) {
      return null;
    }

    const filterProps = getFilterProps(field, fieldDomain);
    const newField = {
      ...field,
      filterProps
    };

    this.updateColumnField(fieldIdx, newField);

    return filterProps;
  }

  /**
   * Apply filters to dataset, return the filtered dataset with updated `gpuFilter`, `filterRecord`, `filteredIndex`, `filteredIndexForDomain`
   * @param filters
   * @param layers
   * @param opt
   */
  filterTable(filters: Filter[], layers: Layer[], opt?: FilterDatasetOpt): KeplerTable {
    const {dataContainer, id: dataId, filterRecord: oldFilterRecord, fields} = this;

    // if there is no filters
    const filterRecord = getFilterRecord(dataId, filters, opt || {});

    this.filterRecord = filterRecord;
    this.gpuFilter = getGpuFilterProps(filters, dataId, fields);

    // const newDataset = set(['filterRecord'], filterRecord, dataset);

    if (!filters.length) {
      this.filteredIndex = this.allIndexes;
      this.filteredIndexForDomain = this.allIndexes;
      return this;
    }

    this.changedFilters = diffFilters(filterRecord, oldFilterRecord);

    // generate 2 sets of filter result
    // filteredIndex used to calculate layer data
    // filteredIndexForDomain used to calculate layer Domain
    const shouldCalDomain = Boolean(this.changedFilters.dynamicDomain);
    const shouldCalIndex = Boolean(this.changedFilters.cpu);

    let filterResult: FilterResult = {};
    if (shouldCalDomain || shouldCalIndex) {
      const dynamicDomainFilters = shouldCalDomain ? filterRecord.dynamicDomain : null;
      const cpuFilters = shouldCalIndex ? filterRecord.cpu : null;

      const filterFuncs = filters.reduce((acc, filter) => {
        const fieldIndex = getDatasetFieldIndexForFilter(this.id, filter);
        const field = fieldIndex !== -1 ? fields[fieldIndex] : null;

        return {
          ...acc,
          [filter.id]: getFilterFunction(field, this.id, filter, layers, dataContainer)
        };
      }, {});

      filterResult = filterDataByFilterTypes(
        {dynamicDomainFilters, cpuFilters, filterFuncs},
        dataContainer
      );
    }

    this.filteredIndex = filterResult.filteredIndex || this.filteredIndex;
    this.filteredIndexForDomain =
      filterResult.filteredIndexForDomain || this.filteredIndexForDomain;

    return this;
  }

  /**
   * Apply filters to a dataset all on CPU, assign to `filteredIdxCPU`, `filterRecordCPU`
   * @param filters
   * @param layers
   */
  filterTableCPU(filters: Filter[], layers: Layer[]): KeplerTable {
    const opt = {
      cpuOnly: true,
      ignoreDomain: true
    };

    // no filter
    if (!filters.length) {
      this.filteredIdxCPU = this.allIndexes;
      this.filterRecordCPU = getFilterRecord(this.id, filters, opt);
      return this;
    }

    // no gpu filter
    if (!filters.find(f => f.gpu)) {
      this.filteredIdxCPU = this.filteredIndex;
      this.filterRecordCPU = getFilterRecord(this.id, filters, opt);
      return this;
    }

    // make a copy for cpu filtering
    const copied = copyTable(this);

    copied.filterRecord = this.filterRecordCPU;
    copied.filteredIndex = this.filteredIdxCPU || [];

    const filtered = copied.filterTable(filters, layers, opt);

    this.filteredIdxCPU = filtered.filteredIndex;
    this.filterRecordCPU = filtered.filterRecord;

    return this;
  }

  /**
   * Calculate field domain based on field type and data
   * for Filter
   */
  getColumnFilterDomain(field: Field): FieldDomain {
    const {dataContainer} = this;
    const {valueAccessor} = field;

    let domain;

    switch (field.type) {
      case ALL_FIELD_TYPES.real:
      case ALL_FIELD_TYPES.integer:
        // calculate domain and step
        return getNumericFieldDomain(dataContainer, valueAccessor);

      case ALL_FIELD_TYPES.boolean:
        return {domain: [true, false]};

      case ALL_FIELD_TYPES.string:
      case ALL_FIELD_TYPES.date:
        domain = getOrdinalDomain(dataContainer, valueAccessor);
        return {domain};

      case ALL_FIELD_TYPES.timestamp:
        return getTimestampFieldDomain(dataContainer, valueAccessor);

      default:
        return {domain: getOrdinalDomain(dataContainer, valueAccessor)};
    }
  }

  /**
   *  Get the domain of this column based on scale type
   */
  getColumnLayerDomain(
    field: Field,
    scaleType: string
  ): number[] | string[] | [number, number] | null {
    const {dataContainer, filteredIndexForDomain} = this;

    if (!SCALE_TYPES[scaleType]) {
      Console.error(`scale type ${scaleType} not supported`);
      return null;
    }

    const {valueAccessor} = field;
    const indexValueAccessor = i => valueAccessor({index: i});
    const sortFunction = getSortingFunction(field.type);

    switch (scaleType) {
      case SCALE_TYPES.ordinal:
      case SCALE_TYPES.point:
        // do not recalculate ordinal domain based on filtered data
        // don't need to update ordinal domain every time
        return getOrdinalDomain(dataContainer, valueAccessor);

      case SCALE_TYPES.quantile:
        return getQuantileDomain(filteredIndexForDomain, indexValueAccessor, sortFunction);

      case SCALE_TYPES.log:
        return getLogDomain(filteredIndexForDomain, indexValueAccessor);

      case SCALE_TYPES.quantize:
      case SCALE_TYPES.linear:
      case SCALE_TYPES.sqrt:
      default:
        return getLinearDomain(filteredIndexForDomain, indexValueAccessor);
    }
  }

  /**
   * Get a sample of rows to calculate layer boundaries
   */
  // getSampleData(rows)

  /**
   * Parse cell value based on column type and return a string representation
   * Value the field value, type the field type
   */
  // parseFieldValue(value, type)

  // sortDatasetByColumn()

  /**
   * Assert whether field exist
   * @param fieldName
   * @param condition
   */
  _assetField(fieldName: string, condition: any): void {
    if (!condition) {
      Console.error(`${fieldName} doesnt exist in dataset ${this.id}`);
    }
  }
}

// HELPER FUNCTIONS (MAINLY EXPORTED FOR TEST...)

export function removeSuffixAndDelimiters(layerName, suffix) {
  return layerName
    .replace(new RegExp(suffix, 'ig'), '')
    .replace(/[_,.]+/g, ' ')
    .trim();
}

/**
 * Find point fields pairs from fields
 *
 * @param fields
 * @returns found point fields
 */
export function findPointFieldPairs(fields: Field[]): FieldPair[] {
  const allNames = fields.map(f => f.name.toLowerCase());

  // get list of all fields with matching suffixes
  const acc: FieldPair[] = [];
  return allNames.reduce((carry, fieldName, idx) => {
    // This search for pairs will early exit if found.
    for (const suffixPair of TRIP_POINT_FIELDS) {
      // match first suffix```
      if (fieldName.endsWith(suffixPair[0])) {
        // match second suffix
        const otherPattern = new RegExp(`${suffixPair[0]}\$`);
        const partner = fieldName.replace(otherPattern, suffixPair[1]);

        const partnerIdx = allNames.findIndex(d => d === partner);
        if (partnerIdx > -1) {
          const defaultName = removeSuffixAndDelimiters(fieldName, suffixPair[0]);

          carry.push({
            defaultName,
            pair: {
              lat: {
                fieldIdx: idx,
                value: fields[idx].name
              },
              lng: {
                fieldIdx: partnerIdx,
                value: fields[partnerIdx].name
              }
            },
            suffix: suffixPair
          });
          return carry;
        }
      }
    }
    return carry;
  }, acc);
}

/**
 *
 * @param dataset
 * @param column
 * @param mode
 * @type
 */
export function sortDatasetByColumn(
  dataset: KeplerTable,
  column: string,
  mode?: string
): KeplerTable {
  const {allIndexes, fields, dataContainer} = dataset;
  const fieldIndex = fields.findIndex(f => f.name === column);
  if (fieldIndex < 0) {
    return dataset;
  }

  const sortBy = SORT_ORDER[mode || ''] || SORT_ORDER.ASCENDING;

  if (sortBy === SORT_ORDER.UNSORT) {
    dataset.sortColumn = {};
    dataset.sortOrder = null;

    return dataset;
  }

  const sortFunction = sortBy === SORT_ORDER.ASCENDING ? ascending : descending;
  const sortOrder = allIndexes
    .slice()
    .sort((a, b) =>
      sortFunction(dataContainer.valueAt(a, fieldIndex), dataContainer.valueAt(b, fieldIndex))
    );

  dataset.sortColumn = {
    [column]: sortBy
  };
  dataset.sortOrder = sortOrder;

  return dataset;
}

export function pinTableColumns(dataset: KeplerTable, column: string): KeplerTable {
  const field = dataset.getColumnField(column);
  if (!field) {
    return dataset;
  }

  let pinnedColumns;
  if (Array.isArray(dataset.pinnedColumns) && dataset.pinnedColumns.includes(field.name)) {
    // unpin it
    pinnedColumns = dataset.pinnedColumns.filter(co => co !== field.name);
  } else {
    pinnedColumns = (dataset.pinnedColumns || []).concat(field.name);
  }

  // @ts-ignore
  return copyTableAndUpdate(dataset, {pinnedColumns});
}
export function copyTable<T extends {}>(original: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(original)), original);
}

/**
 * @type
 * @returns
 */
export function copyTableAndUpdate<T extends {}>(original: T, options: Partial<T> = {}): T {
  return Object.entries(options).reduce((acc, entry) => {
    acc[entry[0]] = entry[1];
    return acc;
  }, copyTable(original));
}

export default KeplerTable;
