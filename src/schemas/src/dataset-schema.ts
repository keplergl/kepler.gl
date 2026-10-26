// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import pick from 'es-toolkit/compat/pick';
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
import {ArrowDataContainer, FIELD_DISPLAY_FORMAT} from '@kepler.gl/utils';

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

// Only integer columns containing BigInts use a column-wide encoding. Custom
// columns with strings, fractions or other values keep per-cell conversion.
function shouldStringifyBigIntColumn(rows: any[][], columnIndex: number): boolean {
  let hasBigInt = false;
  let hasUnsafeInteger = false;
  for (const row of rows) {
    const value = row?.[columnIndex];
    if (value == null) continue;
    if (typeof value === 'bigint') {
      hasBigInt = true;
    } else if (!Number.isInteger(value)) {
      return false;
    }
    if (!Number.isSafeInteger(Number(value))) hasUnsafeInteger = true;
  }
  return hasBigInt && hasUnsafeInteger;
}

/**
 * TODO Consider moving this cast to ArrowDataContainer?
 * Prepare a data container for export as part of json / html files.
 * 1) Arrow tables can store Timestamps as BigInts, so convert numbers to ISOStrings compatible with Kepler.gl's TIMESTAMP.
 * 2) Geoarrow binary buffers converted to hex wkb
 * 3) BigInt integer columns use numbers when all values are safe, otherwise exact strings
 * @param dataset The dataset to flatten for saving.
 * @returns Row based data.
 */
const getAllDataForSaving = (dataset: KeplerTable): any[][] => {
  const {dataContainer, fields} = dataset;
  const allData = dataContainer.flattenData();

  if (dataContainer instanceof ArrowDataContainer) {
    const numColumns = dataContainer.numColumns();

    for (let columnIndex = 0; columnIndex < numColumns; ++columnIndex) {
      const column = dataContainer.getColumn(columnIndex);
      const field = dataContainer.getField(columnIndex);

      if (
        arrow.DataType.isTimestamp(column.type) ||
        arrow.DataType.isDate(column.type) ||
        arrow.DataType.isTime(column.type)
      ) {
        allData.forEach(row => {
          const value = row[columnIndex];
          row[columnIndex] = value == null ? null : new Date(value).toISOString();
        });
      } else if (arrow.DataType.isInt(column.type) && column.type.bitWidth === 64) {
        const asString = shouldStringifyBigIntColumn(allData, columnIndex);
        allData.forEach(row => {
          const value = row[columnIndex];
          if (typeof value === 'bigint' || (asString && typeof value === 'number')) {
            const number = Number(value);
            row[columnIndex] =
              asString || !Number.isSafeInteger(number) ? value.toString() : number;
          }
        });
      } else if (field?.type === ALL_FIELD_TYPES.geoarrow) {
        const formatter = FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.geoarrow];
        allData.forEach(row => {
          row[columnIndex] = formatter(row[columnIndex], field);
        });
      }
    }
  } else {
    const stringColumns = (fields || []).map(
      (field, index) =>
        (field.type === ALL_FIELD_TYPES.integer || field.type === ALL_FIELD_TYPES.real) &&
        shouldStringifyBigIntColumn(allData, index)
    );
    // Row containers expose their live backing rows. Copy only when conversion
    // is needed, leaving other rows and exact stored values intact.
    let savedData = allData;
    for (let rowIndex = 0; rowIndex < allData.length; rowIndex++) {
      const row = allData[rowIndex];
      if (row == null) continue;
      let savedRow = row;
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const value = row[columnIndex];
        const asString = stringColumns[columnIndex];
        if (typeof value !== 'bigint' && !(asString && typeof value === 'number')) continue;
        if (savedData === allData) savedData = allData.slice();
        if (savedRow === row) savedRow = savedData[rowIndex] = row.slice();
        const number = Number(value);
        savedRow[columnIndex] =
          asString || !Number.isSafeInteger(number) ? value.toString() : number;
      }
    }
    return savedData;
  }

  return allData;
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
          allData: getAllDataForSaving(dataset),
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
