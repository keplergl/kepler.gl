// Copyright (c) 2021 Uber Technologies, Inc.
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

import {hexToRgb} from './color-utils';
import uniq from 'lodash.uniq';
import {ALL_FIELD_TYPES} from 'constants/default-settings';
import {validateInputData} from 'processors/data-processor';
import KeplerTable from './table-utils/kepler-table';

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
 * @return {Generator<import('reducers/types').RGBColor>}
 */
function* generateColor() {
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
export function getNewDatasetColor(datasets) {
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
 * @type {typeof import('./dataset-utils').createNewDataEntry}
 */
export function createNewDataEntry({info, data, ...opts}, datasets = {}) {
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
export function findDefaultColorField({fields, fieldPairs = []}) {
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
    return left.index - right.index;
  });

  if (sortedFields.length) {
    // There was a best match
    return sortedFields[0];
  }
  // No matches
  return null;
}
