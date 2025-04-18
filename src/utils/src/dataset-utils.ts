// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {
  ALL_FIELD_TYPES,
  FIELD_OPTS,
  TOOLTIP_FORMATS,
  TOOLTIP_FORMAT_TYPES
} from '@kepler.gl/constants';
import {
  getSampleForTypeAnalyze,
  getSampleForTypeAnalyzeArrow,
  getFieldsFromData
} from '@kepler.gl/common-utils';
import {Analyzer} from 'type-analyzer';
import assert from 'assert';

import {
  ProcessorResult,
  RGBColor,
  Field,
  FieldPair,
  TimeLabelFormat,
  TooltipFields,
  ProtoDataset
} from '@kepler.gl/types';
import {TooltipFormat} from '@kepler.gl/constants';
import {notNullorUndefined, h3IsValid} from '@kepler.gl/common-utils';

import {isPlainObject} from './utils';
import {getFormatter} from './data-utils';
import {getFormatValue} from './format';
import {hexToRgb} from './color-utils';

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
export function findDefaultColorField({
  fields,
  fieldPairs = []
}: {
  fields: Field[];
  fieldPairs: FieldPair[];
}): null | Field {
  const fieldsWithoutExcluded = fields.filter(field => {
    if (field.type !== ALL_FIELD_TYPES.real) {
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
export function validateInputData(data: ProtoDataset['data']): ProcessorResult {
  if (!isPlainObject(data)) {
    assert('addDataToMap Error: dataset.data cannot be null');
    return null;
  } else if (!Array.isArray(data.fields)) {
    assert('addDataToMap Error: expect dataset.data.fields to be an array');
    return null;
  } else if (!Array.isArray(data.rows) && !Array.isArray(data.cols)) {
    assert('addDataToMap Error: expect dataset.data.rows or cols to be an array');
    return null;
  }

  const {fields, rows, cols} = data;

  // check if all fields has name, format and type
  const allValid = fields.every((f, i) => {
    if (!isPlainObject(f)) {
      assert(`fields needs to be an array of object, but find ${typeof f}`);
      fields[i] = {name: `column_${i}`, type: ALL_FIELD_TYPES.string};
    }

    if (!f.name) {
      assert(`field.name is required but missing in ${JSON.stringify(f)}`);
      // assign a name
      fields[i].name = `column_${i}`;
    }

    if (!f.type || !ALL_FIELD_TYPES[f.type]) {
      assert(`unknown field type ${f.type}`);
      return false;
    }

    if (!f.analyzerType) {
      assert(`field ${i} missing analyzerType`);
      return false;
    }

    // check time format is correct based on first 10 not empty element
    if (f.type === ALL_FIELD_TYPES.timestamp) {
      const sample = (
        cols ? findNonEmptyRowsAtFieldArrow(cols, i, 10) : findNonEmptyRowsAtField(rows, i, 10)
      ).map(r => ({ts: r[i]}));
      const analyzedType = Analyzer.computeColMeta(sample)[0];
      return analyzedType && analyzedType.category === 'TIME' && analyzedType.format === f.format;
    }

    // check existing string field is H3 type
    if (f.type === ALL_FIELD_TYPES.string) {
      const sample = (
        cols ? findNonEmptyRowsAtFieldArrow(cols, i, 10) : findNonEmptyRowsAtField(rows, i, 10)
      ).map(r => r[i]);
      return sample.every(item => !h3IsValid(item));
    }

    return true;
  });

  if (allValid) {
    return {rows, fields, cols};
  }

  // if any field has missing type, recalculate it for everyone
  // because we simply lost faith in humanity
  const sampleData = cols
    ? getSampleForTypeAnalyzeArrow(
        cols,
        fields.map(f => f.name)
      )
    : getSampleForTypeAnalyze({
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

  return {fields: updatedFields, rows, ...(cols ? {cols} : {})};
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

function findNonEmptyRowsAtFieldArrow(
  cols: arrow.Vector[],
  fieldIdx: number,
  total: number
): any[] {
  const sample: any[] = [];
  const numRows = cols[fieldIdx].length;
  let i = 0;
  while (sample.length < total && i < numRows) {
    if (notNullorUndefined(cols[fieldIdx].get(i))) {
      const row = cols.map(col => col.get(i));
      sample.push(row);
    }
    i++;
  }
  return sample;
}

const TIME_DISPLAY = '2020-05-11 14:00';

export const addTimeLabel = (formats: TimeLabelFormat[]) =>
  formats.map(f => ({
    ...f,
    label:
      f.type === TOOLTIP_FORMAT_TYPES.DATE_TIME || f.type === TOOLTIP_FORMAT_TYPES.DATE
        ? getFormatter(getFormatValue(f))(TIME_DISPLAY)
        : f.label
  }));

export function getFieldFormatLabels(fieldType?: string): TooltipFormat[] {
  const tooltipTypes = (fieldType && FIELD_OPTS[fieldType].format.tooltip) || [];
  const formatLabels: TimeLabelFormat[] = Object.values(TOOLTIP_FORMATS).filter(t =>
    tooltipTypes.includes(t.type)
  );
  return addTimeLabel(formatLabels);
}

export const getFormatLabels = (fields: TooltipFields[], fieldName: string): TooltipFormat[] => {
  const fieldType = fields.find(f => f.name === fieldName)?.type;
  return getFieldFormatLabels(fieldType);
};
