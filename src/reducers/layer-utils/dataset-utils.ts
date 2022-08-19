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
import KeplerTable, {Datasets} from 'reducers/table-utils/kepler-table';
import {DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';

import {ProtoDataset} from 'actions';
import {RGBColor} from '@kepler.gl/types';

import {hexToRgb, validateInputData, datasetColorMaker} from '@kepler.gl/utils';

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

