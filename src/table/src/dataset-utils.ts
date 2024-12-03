// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import uniq from 'lodash.uniq';
import KeplerTable, {Datasets} from './kepler-table';
import {ProtoDataset, RGBColor} from '@kepler.gl/types';
import Task from 'react-palm/tasks';

import {
  hexToRgb,
  validateInputData,
  datasetColorMaker,
  getApplicationConfig
} from '@kepler.gl/utils';

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
  // ! restore
  // const validatedData = validateInputData(data);
  // if (!validatedData) {
  //   return {};
  // }
  const validatedData = data;
  // check if dataset already exists, and update it when loading data by batches incrementally
  if (info && info.id && datasets[info.id]) {
    // get keplerTable from datasets
    const keplerTable = datasets[info.id];
    // update the data in keplerTable
    return UPDATE_TABLE_TASK({table: keplerTable, data: validatedData});
  }

  info = info || {};
  const color = info.color || getNewDatasetColor(datasets);

  return CREATE_TABLE_TASK({
    info,
    color,
    opts,
    data: validatedData
  });
}

async function updateTable({table, data}) {
  const updated = await table.update(data); // Assuming `table` has an `update` method
  return updated;
}

async function createTable({info, color, opts, data}) {
  const TableClass = getApplicationConfig().table ?? KeplerTable;
  const table = new TableClass({info, color, ...opts});
  await table.importData({data});

  return table;
}
const UPDATE_TABLE_TASK = Task.fromPromise(updateTable, 'UPDATE_TABLE_TASK');
const CREATE_TABLE_TASK = Task.fromPromise(createTable, 'CREATE_TABLE_TASK');
