// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Analyzer, DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';
import {ArrowTableInterface, ApacheVectorInterface, RowData, Field} from '@kepler.gl/types';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {console as globalConsole} from 'global/window';
import {range} from 'd3-array';
import {isHexWkb, notNullorUndefined} from './data';
import {h3IsValid} from './h3-utils';

const H3_ANALYZER_TYPE = 'H3';

export const ACCEPTED_ANALYZER_TYPES = [
  AnalyzerDATA_TYPES.DATE,
  AnalyzerDATA_TYPES.TIME,
  AnalyzerDATA_TYPES.DATETIME,
  AnalyzerDATA_TYPES.NUMBER,
  AnalyzerDATA_TYPES.INT,
  AnalyzerDATA_TYPES.FLOAT,
  AnalyzerDATA_TYPES.BOOLEAN,
  AnalyzerDATA_TYPES.STRING,
  AnalyzerDATA_TYPES.GEOMETRY,
  AnalyzerDATA_TYPES.GEOMETRY_FROM_STRING,
  AnalyzerDATA_TYPES.PAIR_GEOMETRY_FROM_STRING,
  AnalyzerDATA_TYPES.ZIPCODE,
  AnalyzerDATA_TYPES.ARRAY,
  AnalyzerDATA_TYPES.OBJECT,
  H3_ANALYZER_TYPE
];

const IGNORE_DATA_TYPES = Object.keys(AnalyzerDATA_TYPES).filter(
  type => !ACCEPTED_ANALYZER_TYPES.includes(type)
);

/**
 * Getting sample data for analyzing field type.
 */
export function getSampleForTypeAnalyze({
  fields,
  rows,
  sampleCount = 50
}: {
  fields: string[];
  rows: unknown[][] | RowData;
  sampleCount?: number;
}): RowData {
  const total = Math.min(sampleCount, rows.length);
  // const fieldOrder = fields.map(f => f.name);
  const sample = range(0, total, 1).map(() => ({}));

  if (rows.length < 1) {
    return [];
  }
  const isRowObject = !Array.isArray(rows[0]);

  // collect sample data for each field
  fields.forEach((field, fieldIdx) => {
    // row counter
    let i = 0;
    // sample counter
    let j = 0;

    while (j < total) {
      if (i >= rows.length) {
        // if depleted data pool
        sample[j][field] = null;
        j++;
      } else if (notNullorUndefined(rows[i][isRowObject ? field : fieldIdx])) {
        const value = rows[i][isRowObject ? field : fieldIdx];
        sample[j][field] = typeof value === 'string' ? value.trim() : value;
        j++;
        i++;
      } else {
        i++;
      }
    }
  });

  return sample;
}

/**
 * Getting sample data for analyzing field type for Arrow tables.
 * @param table Arrow table or an array of vectors.
 * @param fields Field names.
 * @param sampleCount Number of sample rows to get.
 * @returns Sample rows.
 */
export function getSampleForTypeAnalyzeArrow(
  table: ArrowTableInterface | ApacheVectorInterface[],
  fields: string[],
  sampleCount = 50
): any[] {
  const isTable = !Array.isArray(table);

  const numRows = isTable ? table.numRows : table[0].length;
  const getVector = isTable ? index => table.getChildAt(index) : index => table[index];

  const total = Math.min(sampleCount, numRows);
  const sample = range(0, total, 1).map(() => ({}));

  if (numRows < 1) {
    return [];
  }

  // collect sample data for each field
  fields.forEach((field, fieldIdx) => {
    let rowIndex = 0;
    let sampleIndex = 0;

    while (sampleIndex < total) {
      if (rowIndex >= numRows) {
        // if depleted data pool
        sample[sampleIndex][field] = null;
        sampleIndex++;
      } else if (notNullorUndefined(getVector(fieldIdx)?.get(rowIndex))) {
        const value = getVector(fieldIdx)?.get(rowIndex);
        sample[sampleIndex][field] = typeof value === 'string' ? value.trim() : value;
        sampleIndex++;
        rowIndex++;
      } else {
        rowIndex++;
      }
    }
  });

  return sample;
}

/**
 * Convert type-analyzer output to kepler.gl field types
 *
 * @param aType
 * @returns corresponding type in `ALL_FIELD_TYPES`
 */
/* eslint-disable complexity */
export function analyzerTypeToFieldType(aType: string): string {
  const {
    DATE,
    TIME,
    DATETIME,
    NUMBER,
    INT,
    FLOAT,
    BOOLEAN,
    STRING,
    GEOMETRY,
    GEOMETRY_FROM_STRING,
    PAIR_GEOMETRY_FROM_STRING,
    ZIPCODE,
    ARRAY,
    OBJECT
  } = AnalyzerDATA_TYPES;

  // TODO: un recognized types
  // CURRENCY PERCENT NONE
  switch (aType) {
    case DATE:
      return ALL_FIELD_TYPES.date;
    case TIME:
    case DATETIME:
      return ALL_FIELD_TYPES.timestamp;
    case FLOAT:
      return ALL_FIELD_TYPES.real;
    case INT:
      return ALL_FIELD_TYPES.integer;
    case BOOLEAN:
      return ALL_FIELD_TYPES.boolean;
    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
      return ALL_FIELD_TYPES.geojson;
    case ARRAY:
      return ALL_FIELD_TYPES.array;
    case OBJECT:
      return ALL_FIELD_TYPES.object;
    case NUMBER:
    case STRING:
    case ZIPCODE:
      return ALL_FIELD_TYPES.string;
    case H3_ANALYZER_TYPE:
      return ALL_FIELD_TYPES.h3;
    default:
      globalConsole.warn(`Unsupported analyzer type: ${aType}`);
      return ALL_FIELD_TYPES.string;
  }
}

/**
 * Analyze field types from data in `string` format, e.g. uploaded csv.
 * Assign `type`, `fieldIdx` and `format` (timestamp only) to each field
 *
 * @param data array of row object
 * @param fieldOrder array of field names as string
 * @returns formatted fields
 * @public
 * @example
 *
 * import {getFieldsFromData} from '@kepler.gl/common-utils';
 * const data = [{
 *   time: '2016-09-17 00:09:55',
 *   value: '4',
 *   surge: '1.2',
 *   isTrip: 'true',
 *   zeroOnes: '0'
 * }, {
 *   time: '2016-09-17 00:30:08',
 *   value: '3',
 *   surge: null,
 *   isTrip: 'false',
 *   zeroOnes: '1'
 * }, {
 *   time: null,
 *   value: '2',
 *   surge: '1.3',
 *   isTrip: null,
 *   zeroOnes: '1'
 * }];
 *
 * const fieldOrder = ['time', 'value', 'surge', 'isTrip', 'zeroOnes'];
 * const fields = getFieldsFromData(data, fieldOrder);
 * // fields = [
 * // {name: 'time', format: 'YYYY-M-D H:m:s', fieldIdx: 1, type: 'timestamp'},
 * // {name: 'value', format: '', fieldIdx: 4, type: 'integer'},
 * // {name: 'surge', format: '', fieldIdx: 5, type: 'real'},
 * // {name: 'isTrip', format: '', fieldIdx: 6, type: 'boolean'},
 * // {name: 'zeroOnes', format: '', fieldIdx: 7, type: 'integer'}];
 *
 */
export function getFieldsFromData(data: RowData, fieldOrder: string[]): Field[] {
  // add a check for epoch timestamp
  const metadata = Analyzer.computeColMeta(
    data,
    [
      {regex: /.*geojson|all_points/g, dataType: 'GEOMETRY'},
      {regex: /.*census/g, dataType: 'STRING'}
    ],
    {ignoredDataTypes: IGNORE_DATA_TYPES}
  );

  const {fieldByIndex} = renameDuplicateFields(fieldOrder);

  const result = fieldOrder.map((field, index) => {
    const name = fieldByIndex[index];

    const fieldMeta = metadata.find(m => m.key === field);

    // fieldMeta could be undefined if the field has no data and Analyzer.computeColMeta
    // will ignore the field. In this case, we will simply assign the field type to STRING
    // since dropping the column in the RowData could be expensive
    let type = fieldMeta?.type || 'STRING';
    const format = fieldMeta?.format || '';

    // quick check if first valid string in column is H3
    if (type === AnalyzerDATA_TYPES.STRING) {
      for (let i = 0, n = data.length; i < n; ++i) {
        if (notNullorUndefined(data[i][name])) {
          type = h3IsValid(data[i][name] || '') ? H3_ANALYZER_TYPE : type;
          break;
        }
      }
    }

    // quick check if string is hex wkb
    if (type === AnalyzerDATA_TYPES.STRING) {
      type = data.some(d => isHexWkb(d[name])) ? AnalyzerDATA_TYPES.GEOMETRY : type;
    }

    return {
      name,
      id: name,
      displayName: name,
      format,
      fieldIdx: index,
      type: analyzerTypeToFieldType(type),
      analyzerType: type,
      valueAccessor: dc => d => {
        return dc.valueAt(d.index, index);
      }
    };
  });

  return result;
}

/**
 * pass in an array of field names, rename duplicated one
 * and return a map from old field index to new name
 *
 * @param fieldOrder
 * @returns new field name by index
 */
export function renameDuplicateFields(fieldOrder: string[]): {
  allNames: string[];
  fieldByIndex: string[];
} {
  return fieldOrder.reduce<{allNames: string[]; fieldByIndex: string[]}>(
    (accu, field, i) => {
      const {allNames} = accu;
      let fieldName = field;

      // add a counter to duplicated names
      if (allNames.includes(field)) {
        let counter = 0;
        while (allNames.includes(`${field}-${counter}`)) {
          counter++;
        }
        fieldName = `${field}-${counter}`;
      }

      accu.fieldByIndex[i] = fieldName;
      accu.allNames.push(fieldName);

      return accu;
    },
    {allNames: [], fieldByIndex: []}
  );
}
