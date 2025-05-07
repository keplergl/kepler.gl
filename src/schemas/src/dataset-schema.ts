// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import pick from 'lodash/pick';
import {console as globalConsole} from 'global/window';
import * as arrow from 'apache-arrow';

import {ALL_FIELD_TYPES, DATASET_FORMATS} from '@kepler.gl/constants';
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

/**
 * TODO Consider moving this cast to ArrowDataContainer?
 * Prepare a data container for export as part of json / html files.
 * 1) Arrow tables can store Timestamps as BigInts, so convert numbers to ISOStrings compatible with Kepler.gl's TIMESTAMP.
 * 2) Geoarrow binary buffers converted to hex wkb
 * @param dataContainer A data container to flatten.
 * @returns Row based data.
 */
const getAllDataForSaving = (dataContainer: DataContainerInterface): any[][] => {
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
          row[columnIndex] = new Date(row[columnIndex]).toISOString();
        });
      } else if (field?.type === ALL_FIELD_TYPES.geoarrow) {
        const formatter = FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.geoarrow];
        allData.forEach(row => {
          row[columnIndex] = formatter(row[columnIndex], field);
        });
      }
    }
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
    const datasetFlattened = dataset.dataContainer
      ? {
          ...dataset,
          allData: getAllDataForSaving(dataset.dataContainer),
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
    return {
      data: {fields: updatedFields, rows: dataset.allData},
      info: pick(dataset, ['id', 'label', 'color', 'type']),
      ...(dataset.metadata ? {metadata: dataset.metadata} : {}),
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
