// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import pick from 'lodash.pick';
import {console as globalConsole} from 'global/window';
import {Type as ArrowTypes} from 'apache-arrow';

import {DATASET_FORMATS} from '@kepler.gl/constants';
import {ProtoDataset, RGBColor, JsonObject} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';
import {VERSIONS} from './versions';
import Schema from './schema';
import {getFieldsFromData, getSampleForTypeAnalyze} from '@kepler.gl/common-utils';
import {ArrowDataContainer, DataContainerInterface} from '@kepler.gl/utils';

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
 * Prepare a data container for export as part of json / html.
 * 1) Arrow tables can store Timestamps as BigInts, so convert numbers to ISOStrings compatible with Kepler.gl's TIMESTAMP.
 * @param dataContainer A data container to flatten.
 * @returns Row based data.
 */
const getAllDataForSaving = (dataContainer: DataContainerInterface): any[][] => {
  const allData = dataContainer.flattenData();

  if (dataContainer instanceof ArrowDataContainer) {
    const numColumns = dataContainer.numColumns();

    for (let columnIndex = 0; columnIndex < numColumns; ++columnIndex) {
      const column = dataContainer.getColumn(columnIndex);
      const typeId = column.type?.typeId;
      if (
        typeId === ArrowTypes.Timestamp ||
        typeId === ArrowTypes.Date ||
        typeId === ArrowTypes.Time
      ) {
        allData.forEach(row => {
          row[columnIndex] = new Date(row[columnIndex]).toISOString();
        });
      }
    }
  }

  return allData;
};

export class DatasetSchema extends Schema {
  key = 'dataset';

  save(dataset: KeplerTable): SavedDatasetV1['data'] {
    const datasetFlattened = dataset.dataContainer
      ? {
          ...dataset,
          allData: getAllDataForSaving(dataset.dataContainer),
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
