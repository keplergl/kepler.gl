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

import uniq from 'lodash.uniq';
import {console as globalConsole} from 'global/window';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import KeplerTable, {Datasets} from './table-utils/kepler-table';
import {Analyzer, DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';
import assert from 'assert';

import {ProtoDataset} from 'actions';
import {ProcessorResult, RGBColor, RowData, Field} from '@kepler.gl/types';

import {hexToRgb} from '@kepler.gl/utils';
import {notNullorUndefined, isPlainObject} from './data-utils';
import {range} from 'd3-array';

// apply a color for each dataset
// to use as label colors
const datasetColors = [
  '#8F2FBF',
  '#005CFF',
  '#C06C84',
  '#F8B195',
  '#547A82',
  '#3EACA8',
  '#A2D4AB'
].map(hexToRgb);

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
  AnalyzerDATA_TYPES.OBJECT
];

const IGNORE_DATA_TYPES = Object.keys(AnalyzerDATA_TYPES).filter(
  type => !ACCEPTED_ANALYZER_TYPES.includes(type)
);

/**
 * Random color generator
 */
function* generateColor(): Generator<RGBColor> {
  let index = 0;
  while (index < datasetColors.length + 1) {
    if (index === datasetColors.length) {
      index = 0;
    }
    yield datasetColors[index++];
  }
}

export const datasetColorMaker = generateColor();

/** @type {typeof import('./dataset-utils').getNewDatasetColor} */
export function getNewDatasetColor(datasets: Datasets): RGBColor {
  const presetColors = datasetColors.map(String);
  const usedColors = uniq(Object.values(datasets).map(d => String(d.color))).filter(c =>
    presetColors.includes(c)
  );

  if (usedColors.length === presetColors.length) {
    // if we already depleted the pool of color
    return datasetColorMaker.next().value;
  }

  let color = datasetColorMaker.next().value;
  while (usedColors.includes(String(color))) {
    color = datasetColorMaker.next().value;
  }

  return color;
}

/**
 * Take datasets payload from addDataToMap, create datasets entry save to visState
 */
export function createNewDataEntry(
  {info, data, ...opts}: ProtoDataset,
  datasets: Datasets = {}
): Datasets {
  const validatedData = validateInputData(data);
  if (!validatedData) {
    return {};
  }

  info = info || {};
  const color = info.color || getNewDatasetColor(datasets);

  const keplerTable = new KeplerTable({info, data: validatedData, color, ...opts});
  return {
    [keplerTable.id]: keplerTable
  };
}

/**
 * Field name prefixes and suffixes which should not be considered
 * as metrics. Fields will still be included if a 'metric word'
 * is found on the field name, however.
 */
const EXCLUDED_DEFAULT_FIELDS = [
  // Serial numbers and identification numbers
  '_id',
  'id',
  'index',
  'uuid',
  'guid',
  'uid',
  'gid',
  'serial',
  // Geographic IDs are unlikely to be interesting to color
  'zip',
  'code',
  'post',
  'region',
  'fips',
  'cbgs',
  'h3',
  's2',
  // Geographic coords (but not z/elevation/altitude
  // since that might be a metric)
  'lat',
  'lon',
  'lng',
  'latitude',
  'longitude',
  '_x',
  '_y'
];

/**
 * Prefixes and suffixes that indicate a field is a metric.
 *
 * Note that these are in order of preference, first being
 * most preferred.
 */
const METRIC_DEFAULT_FIELDS = [
  'metric',
  'value',
  'sum',
  'count',
  'unique',
  'mean',
  'mode',
  'median',
  'max',
  'min',
  'deviation',
  'variance',
  'p99',
  'p95',
  'p75',
  'p50',
  'p25',
  'p05',
  // Abbreviations are less preferred
  'cnt',
  'val'
];

/**
 * Choose a field to use as the default color field of a layer.
 *
 * The heuristic is:
 *
 * First, exclude fields that are on the exclusion list and don't
 * have names that suggest they contain metrics. Also exclude
 * field names that are blank.
 *
 * Next, look for a field that is of real type and contains one
 * of the preferred names (in order of the preferred names).
 *
 * Next, look for a field that is of integer type and contains
 * one of the preferred names (in order of the preferred names).
 *
 * Next, look for the first field that is of real type (in order
 * of field index).
 *
 * Next, look for the first field that is of integer type (in
 * order of field index).
 *
 * It's possible no field will be chosen (i.e. because all fields
 * are strings.)
 *
 * @param dataset
 */
export function findDefaultColorField({fields, fieldPairs = []}: KeplerTable): null | Field {
  const fieldsWithoutExcluded = fields.filter(field => {
    if (field.type !== ALL_FIELD_TYPES.real && field.type !== ALL_FIELD_TYPES.integer) {
      // Only select numeric fields.
      return false;
    }
    if (
      fieldPairs.find(
        pair => pair.pair.lat.value === field.name || pair.pair.lng.value === field.name
      )
    ) {
      // Do not permit lat, lon fields
      return false;
    }

    const normalizedFieldName = field.name.toLowerCase();
    if (normalizedFieldName === '') {
      // Special case excluded name when the name is blank.
      return false;
    }
    const hasExcluded = EXCLUDED_DEFAULT_FIELDS.find(
      f => normalizedFieldName.startsWith(f) || normalizedFieldName.endsWith(f)
    );
    const hasInclusion = METRIC_DEFAULT_FIELDS.find(
      f => normalizedFieldName.startsWith(f) || normalizedFieldName.endsWith(f)
    );
    return !hasExcluded || hasInclusion;
  });

  const sortedFields = fieldsWithoutExcluded.sort((left, right) => {
    const normalizedLeft = left.name.toLowerCase();
    const normalizedRight = right.name.toLowerCase();
    const leftHasInclusion = METRIC_DEFAULT_FIELDS.findIndex(
      f => normalizedLeft.startsWith(f) || normalizedLeft.endsWith(f)
    );
    const rightHasInclusion = METRIC_DEFAULT_FIELDS.findIndex(
      f => normalizedRight.startsWith(f) || normalizedRight.endsWith(f)
    );
    if (leftHasInclusion !== rightHasInclusion) {
      if (leftHasInclusion === -1) {
        // Elements that do not have the inclusion list should go after those that do.
        return 1;
      } else if (rightHasInclusion === -1) {
        // Elements that do have the inclusion list should go before those that don't.
        return -1;
      }
      // Compare based on order in the inclusion list
      return leftHasInclusion - rightHasInclusion;
    }

    // Compare based on type
    if (left.type !== right.type) {
      if (left.type === ALL_FIELD_TYPES.real) {
        return -1;
      }
      // left is an integer and right is not
      // and reals come before integers
      return 1;
    }

    // Finally, order based on the order in the datasets columns
    // @ts-expect-error
    return left.index - right.index;
  });

  if (sortedFields.length) {
    // There was a best match
    return sortedFields[0];
  }
  // No matches
  return null;
}

/**
 * Validate input data, adding missing field types, rename duplicate columns
 */
export function validateInputData(data: Record<string, unknown>): ProcessorResult {
  if (!isPlainObject(data)) {
    assert('addDataToMap Error: dataset.data cannot be null');
    return null;
  } else if (!Array.isArray(data.fields)) {
    assert('addDataToMap Error: expect dataset.data.fields to be an array');
    return null;
  } else if (!Array.isArray(data.rows)) {
    assert('addDataToMap Error: expect dataset.data.rows to be an array');
    return null;
  }

  const {fields, rows} = data;

  // check if all fields has name, format and type
  const allValid = fields.every((f, i) => {
    if (!isPlainObject(f)) {
      assert(`fields needs to be an array of object, but find ${typeof f}`);
      fields[i] = {};
    }

    if (!f.name) {
      assert(`field.name is required but missing in ${JSON.stringify(f)}`);
      // assign a name
      fields[i].name = `column_${i}`;
    }

    if (!ALL_FIELD_TYPES[f.type]) {
      assert(`unknown field type ${f.type}`);
      return false;
    }

    if (!fields.every(field => field.analyzerType)) {
      assert('field missing analyzerType');
      return false;
    }

    // check time format is correct based on first 10 not empty element
    if (f.type === ALL_FIELD_TYPES.timestamp) {
      const sample = findNonEmptyRowsAtField(rows, i, 10).map(r => ({ts: r[i]}));
      const analyzedType = Analyzer.computeColMeta(sample)[0];
      return analyzedType && analyzedType.category === 'TIME' && analyzedType.format === f.format;
    }

    return true;
  });

  if (allValid) {
    return {rows, fields};
  }

  // if any field has missing type, recalculate it for everyone
  // because we simply lost faith in humanity
  const sampleData = getSampleForTypeAnalyze({
    fields: fields.map(f => f.name),
    rows
  });
  const fieldOrder = fields.map(f => f.name);
  const meta = getFieldsFromData(sampleData, fieldOrder);
  const updatedFields = fields.map((f, i) => ({
    ...f,
    type: meta[i].type,
    format: meta[i].format,
    analyzerType: meta[i].analyzerType
  }));

  return {fields: updatedFields, rows};
}

function findNonEmptyRowsAtField(rows: unknown[][], fieldIdx: number, total: number): any[] {
  const sample: any[] = [];
  let i = 0;
  while (sample.length < total && i < rows.length) {
    if (notNullorUndefined(rows[i]?.[fieldIdx])) {
      sample.push(rows[i]);
    }
    i++;
  }
  return sample;
}
/**
 * Getting sample data for analyzing field type.
 */
export function getSampleForTypeAnalyze({
  fields,
  rows,
  sampleCount = 50
}: {
  fields: string[];
  rows: unknown[][];
  sampleCount?: number;
}): RowData {
  const total = Math.min(sampleCount, rows.length);
  // const fieldOrder = fields.map(f => f.name);
  const sample = range(0, total, 1).map(d => ({}));

  // collect sample data for each field
  fields.forEach((field, fieldIdx) => {
    // data counter
    let i = 0;
    // sample counter
    let j = 0;

    while (j < total) {
      if (i >= rows.length) {
        // if depleted data pool
        sample[j][field] = null;
        j++;
      } else if (notNullorUndefined(rows[i][fieldIdx])) {
        const value = rows[i][fieldIdx];
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
 * Analyze field types from data in `string` format, e.g. uploaded csv.
 * Assign `type`, `fieldIdx` and `format` (timestamp only) to each field
 *
 * @param data array of row object
 * @param fieldOrder array of field names as string
 * @returns formatted fields
 * @public
 * @example
 *
 * import {getFieldsFromData} from 'kepler.gl/processors';
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
    const {type, format} = fieldMeta || {};

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
export function renameDuplicateFields(
  fieldOrder: string[]
): {allNames: string[]; fieldByIndex: string[]} {
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
    case ARRAY:
    case OBJECT:
      // TODO: create a new data type for objects and arrays
      return ALL_FIELD_TYPES.geojson;
    case NUMBER:
    case STRING:
    case ZIPCODE:
      return ALL_FIELD_TYPES.string;
    default:
      globalConsole.warn(`Unsupported analyzer type: ${aType}`);
      return ALL_FIELD_TYPES.string;
  }
}
