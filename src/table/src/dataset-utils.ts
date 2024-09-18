// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import uniq from 'lodash.uniq';
import KeplerTable, {Datasets} from './kepler-table';
import {ProtoDataset, RGBColor} from '@kepler.gl/types';
import Task from 'react-palm/tasks';

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

  // check if dataset already exists, and update it when loading data by batches incrementally
  if (info && info.id && datasets[info.id]) {
    // get keplerTable from datasets
    const keplerTable = datasets[info.id];
    // update the data in keplerTable
    return UPDATE_TABLE_TASK({table: keplerTable, data: validatedData});
    // keplerTable.update(validatedData);
    // return {
    //   [keplerTable.id]: keplerTable
    // };
  }

  info = info || {};
  const color = info.color || getNewDatasetColor(datasets);

  // const keplerTable = new KeplerTable({info, data: validatedData, color, ...opts});
  return CREATE_TABLE_TASK({TableClass: KeplerTable, info, color, opts, data: validatedData});
  // return {
  //   [keplerTable.id]: keplerTable
  // };
}

async function updateTable({table, data}) {
  const updated = await table.update(data); // Assuming `table` has an `update` method
  return updated;
}
async function createTable({TableClass, info, color, opts, data}) {
  const keplerTable = await new TableClass({info, data, color, ...opts});

  return keplerTable;
}
const UPDATE_TABLE_TASK = Task.fromPromise(updateTable, 'UPDATE_TABLE_TASK');
const CREATE_TABLE_TASK = Task.fromPromise(createTable, 'CREATE_TABLE_TASK');
