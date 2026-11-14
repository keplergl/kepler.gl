// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import pick from 'es-toolkit/compat/pick';
import isPlainObject from 'es-toolkit/compat/isPlainObject';
import {console as globalConsole} from 'global/window';
import * as arrow from 'apache-arrow';

import {
  ALL_FIELD_TYPES,
  DATASET_FORMATS,
  DatasetType,
  getRemoteSourceFormat
} from '@kepler.gl/constants';
import {ProtoDataset, RGBColor, JsonObject} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';
import {VERSIONS} from './versions';
import Schema from './schema';
import {getFieldsFromData, getSampleForTypeAnalyze} from '@kepler.gl/common-utils';
import {ArrowDataContainer, DataContainerInterface, FIELD_DISPLAY_FORMAT} from '@kepler.gl/utils';

export type SavedField = {
  name: string;
  type: string;
  format?: string;
  analyzerType?: string;
};

export type ParsedField = {
  name: string;
  type: string;
  format: string;
  analyzerType: string;
};

export type SavedDatasetV1 = {
  version: 'v1';
  data: {
    id: string;
    label: string;
    color: RGBColor;
    allData: any[][];
    fields: SavedField[];
    type?: string;
    metadata?: JsonObject;
    disableDataOperation?: boolean;
  };
};

export type ParsedDataset = {
  data: {
    fields: ParsedField[];
    rows: any[][];
  };
  info: {
    id?: string;
    label?: string;
    color?: RGBColor;
  };
};

// version v0
export const fieldPropertiesV0 = {
  name: null,
  type: null
};

export const fieldPropertiesV1 = {
  name: null,
  type: null,
  format: null,
  analyzerType: null,
  metadata: null
};

export class FieldSchema extends Schema {
  save(fields) {
    return {
      [this.key]: fields.map(f => this.savePropertiesOrApplySchema(f)[this.key])
    };
  }
  load(fields) {
    return {[this.key]: fields};
  }
}

export const propertiesV0 = {
  id: null,
  label: null,
  color: null,
  allData: null,
  fields: new FieldSchema({
    key: 'fields',
    version: VERSIONS.v0,
    properties: fieldPropertiesV0
  })
};

export const propertiesV1 = {
  ...propertiesV0,
  fields: new FieldSchema({
    key: 'fields',
    version: VERSIONS.v1,
    properties: fieldPropertiesV1
  }),
  type: null,
  metadata: null,
  disableDataOperation: null
};

/** Convert nested Arrow lists/structs and BigInts without changing live values. */
function getValueForSaving(value: any, ancestors = new Set<object>()): any {
  if (typeof value === 'bigint') {
    const number = Number(value);
    return Number.isSafeInteger(number) ? number : value.toString();
  }
  // Leave custom JSON representations intact; Arrow wrappers need normalization below.
  if (
    typeof value?.toJSON === 'function' &&
    !(value instanceof arrow.StructRow) &&
    !(value instanceof arrow.Vector)
  ) {
    return value;
  }
  const plain = value instanceof arrow.StructRow ? value.toJSON() : value;
  const isList = Array.isArray(plain) || plain instanceof arrow.Vector;
  if (!isList && !isPlainObject(plain)) return value;
  if (ancestors.has(value)) throw new TypeError('Cannot export circular dataset values');
  ancestors.add(value);
  let saved = plain;
  if (isList) {
    const items = plain instanceof arrow.Vector ? Array.from(plain) : plain;
    saved = items;
    for (let i = 0; i < items.length; i++) {
      const next = getValueForSaving(items[i], ancestors);
      if (next === items[i]) continue;
      if (saved === items) saved = items.slice();
      saved[i] = next;
    }
  } else {
    for (const key of Object.keys(plain)) {
      const next = getValueForSaving(plain[key], ancestors);
      if (next === plain[key]) continue;
      if (saved === plain) saved = {...plain};
      saved[key] = next;
    }
  }
  ancestors.delete(value);
  return saved;
}

/**
 * TODO Consider moving this cast to ArrowDataContainer?
 * Prepare a data container for export as part of json / html files.
 * 1) Arrow tables can store Timestamps as BigInts, so convert numbers to ISOStrings compatible with Kepler.gl's TIMESTAMP.
 * 2) Geoarrow binary buffers converted to hex wkb
 * 3) Int64 values outside the safe integer range saved as exact decimal strings
 * @param dataContainer A data container to flatten.
 * @returns Row based data.
 */
const getAllDataForSaving = (
  dataContainer: DataContainerInterface,
  fields: KeplerTable['fields']
): any[][] => {
  const allData = dataContainer.flattenData();

  if (dataContainer instanceof ArrowDataContainer) {
    const numColumns = dataContainer.numColumns();

    for (let columnIndex = 0; columnIndex < numColumns; ++columnIndex) {
      const column = dataContainer.getColumn(columnIndex);

      if (arrow.DataType.isTime(column.type)) {
        // Arrow Time values are raw units since midnight, unlike Timestamp getters
        // which already return milliseconds. Time64 getters return BigInt.
        const divisor = [0.001, 1, 1000, 1000000][column.type.unit];
        allData.forEach(row => {
          const value = row[columnIndex];
          row[columnIndex] = value == null ? null : new Date(Number(value) / divisor).toISOString();
        });
      } else if (arrow.DataType.isTimestamp(column.type) || arrow.DataType.isDate(column.type)) {
        allData.forEach(row => {
          const value = row[columnIndex];
          row[columnIndex] = value == null ? null : new Date(value).toISOString();
        });
      }
    }
  }

  // Joins produce row containers, but their cells can still contain Arrow geometry.
  const geometryFields = fields.filter(field => field.type === ALL_FIELD_TYPES.geoarrow);
  const savedRows = geometryFields.length
    ? allData.map(row => {
        if (row === null) return row;
        const savedRow = row.slice();
        for (const field of geometryFields) {
          savedRow[field.fieldIdx] = FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.geoarrow](
            row[field.fieldIdx],
            field
          );
        }
        return savedRow;
      })
    : allData;
  // Row containers expose live rows: copy only values that need conversion.
  return getValueForSaving(savedRows);
};

/**
 * Transforms fields for saving as part of json / html files.
 * @param fields The array of fields from a Kepler table.
 * @returns The transformed fields array with GeoArrow types updated to GeoJSON.
 */
const getFieldsForSaving = (fields: KeplerTable['fields']) => {
  return fields.map(field => {
    if (field.type === ALL_FIELD_TYPES.geoarrow) {
      // geoarrow binary data is transformed to hex wkb in getAllDataForSaving, so update the field accordingly
      return {
        name: field.name,
        type: ALL_FIELD_TYPES.geojson,
        format: '',
        analyzerType: 'GEOMETRY'
      };
    }
    return field;
  });
};

export class DatasetSchema extends Schema {
  key = 'dataset';

  save(dataset: KeplerTable): SavedDatasetV1['data'] {
    if (dataset.type === DatasetType.ZARR && dataset.metadata?.url) {
      // Rebuild variable grids and coordinate lists from the store on load,
      // using the same remote metadata refresh as other tiled datasets.
      return this.savePropertiesOrApplySchema({
        ...dataset,
        allData: [],
        fields: [],
        metadata: pick(dataset.metadata, ['url', 'variable', 'label', 'attribution'])
      })[this.key];
    }

    if (dataset.type === DatasetType.EXTERNALLY_HOSTED && dataset.metadata?.source) {
      // Keep the remote URL instead of inlining rows so shared map configs stay small.
      const sourceFormat = getRemoteSourceFormat(dataset.metadata);
      return this.savePropertiesOrApplySchema({
        id: dataset.id,
        label: dataset.label,
        color: dataset.color,
        type: dataset.type,
        allData: [],
        fields: getFieldsForSaving(dataset.fields || []),
        metadata: {
          source: dataset.metadata.source,
          ...(sourceFormat ? {format: sourceFormat} : {}),
          ...(typeof dataset.metadata.refreshIntervalMs === 'number' &&
          dataset.metadata.refreshIntervalMs > 0
            ? {refreshIntervalMs: dataset.metadata.refreshIntervalMs}
            : {})
        }
      })[this.key];
    }

    const datasetFlattened = dataset.dataContainer
      ? {
          ...dataset,
          allData: getAllDataForSaving(dataset.dataContainer, dataset.fields),
          fields: getFieldsForSaving(dataset.fields),
          // we use flattenData to save arrow tables,
          // but once flattened it's not an arrow file anymore.
          metadata: {
            ...dataset.metadata,
            ...(dataset.metadata.format === DATASET_FORMATS.arrow
              ? {format: DATASET_FORMATS.row}
              : {})
          }
        }
      : dataset;

    return this.savePropertiesOrApplySchema(datasetFlattened)[this.key];
  }
  load(dataset: SavedDatasetV1['data']): ProtoDataset {
    const {fields, allData} = dataset;
    let updatedFields = fields;

    // recalculate field type
    // because we have updated type-analyzer
    // we need to add format to each field
    const needCalculateMeta =
      Array.isArray(allData) &&
      allData.length > 0 &&
      fields[0] &&
      (!Object.prototype.hasOwnProperty.call(fields[0], 'format') ||
        !Object.prototype.hasOwnProperty.call(fields[0], 'analyzerType'));

    if (needCalculateMeta) {
      const fieldOrder = fields.map(f => f.name);

      const sampleData = getSampleForTypeAnalyze({
        fields: fieldOrder,
        rows: allData
      });
      const meta = getFieldsFromData(sampleData, fieldOrder);

      updatedFields = meta.map((f, i) => ({
        ...pick(meta[i], ['name', 'type', 'format']),
        analyzerType: meta[i].analyzerType
      }));

      updatedFields.forEach((f, i) => {
        if (fields[i].type !== f.type) {
          // if newly detected field type is different from saved type
          // we log it but won't update it, cause we don't want to break people's map
          globalConsole.warn(`detect ${f.name} type is now ${f.type} instead of ${fields[i].type}`);
        }
      });
    }

    // get format of all fields
    let metadata = dataset.metadata;
    if (dataset.type === DatasetType.EXTERNALLY_HOSTED && dataset.metadata) {
      const sourceFormat = getRemoteSourceFormat(dataset.metadata);
      metadata = {
        source: dataset.metadata.source,
        ...(sourceFormat ? {sourceFormat} : {}),
        ...(typeof dataset.metadata.size === 'number' ? {size: dataset.metadata.size} : {}),
        ...(typeof dataset.metadata.refreshIntervalMs === 'number' &&
        dataset.metadata.refreshIntervalMs > 0
          ? {refreshIntervalMs: dataset.metadata.refreshIntervalMs}
          : {})
      };
    }

    return {
      data: {fields: updatedFields || [], rows: dataset.allData || []},
      info: pick(dataset, ['id', 'label', 'color', 'type']),
      ...(metadata ? {metadata} : {}),
      ...(dataset.disableDataOperation ? {disableDataOperation: dataset.disableDataOperation} : {})
    };
  }
}

export const datasetSchema = {
  [VERSIONS.v0]: new DatasetSchema({
    key: 'dataset',
    version: VERSIONS.v0,
    properties: propertiesV0
  }),
  [VERSIONS.v1]: new DatasetSchema({
    key: 'dataset',
    version: VERSIONS.v1,
    properties: propertiesV1
  })
};

export default datasetSchema;
