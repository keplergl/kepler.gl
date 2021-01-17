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
export function createNewDataEntry({info, data, metadata}, datasets = {}) {
  const validatedData = validateInputData(data);
  if (!validatedData) {
    return {};
  }

  info = info || {};
  const color = info.color || getNewDatasetColor(datasets);

  const keplerTable = new KeplerTable({info, data: validatedData, color, metadata});
  return {
    [keplerTable.id]: keplerTable
  };
}

/**
 * Choose a field to use as the default color field of a layer.
 *
 * Right now this implements a very simple heuristic looking
 * for a real-type field that is not lat/lon.
 *
 * In the future we could consider other things:
 * Consider integer fields
 * look for highest dynamic range (using a sample of the data)
 * Look for particular names to select ("value", "color", etc)
 * Look for particular names to avoid ("" - the Pandas index column)
 *
 * @param dataset
 */
export function findDefaultColorField({fields, fieldPairs = []}) {
  const defaultField = fields.find(
    f =>
      f.type === ALL_FIELD_TYPES.real &&
      // Do not permit lat, lon fields
      !fieldPairs.find(pair => pair.pair.lat.value === f.name || pair.pair.lng.value === f.name)
  );
  if (!defaultField) {
    return null;
  }
  return defaultField;
}
