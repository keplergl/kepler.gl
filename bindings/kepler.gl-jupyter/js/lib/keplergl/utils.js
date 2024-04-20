// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {processCsvData, processGeojson} from '@kepler.gl/processors';
import log from '../log';
import console from 'global/console';

function handleJuptyerDataFormat(dataEntry) {
  // This makes passing data between Jupyter the iframe easier
  // detect data type here
  log('handleJuptyerDataFormat');
  const {data, id} = dataEntry;
  let parsed = data;
  let type = 'csv';
  if (typeof data === 'object') {
    if (data.columns && data.data && data.index) {
      // Data is parsed as a Dataframe
      log('data is a dataframe');
      type = 'df';
      // parsed = {fields: data.columns, data: data.data};
    } else {
      // assume is geojson
      type = 'json';
    }
  } else if (typeof data === 'string') {
    try {
      parsed = JSON.parse(data);
      type = 'json';
    } catch (e) {
      // assume it is csv
    }
  }

  return {data: parsed, type, id};
}

function processReceivedData({data, info}) {
  // assume there is only 1 file
  log('processReceivedData');
  let processed;

  try {
    processed =
      info.queryType === 'csv'
        ? processCsvData(data)
        : info.queryType === 'json'
        ? processGeojson(data)
        : info.queryType === 'df'
        ? processDataFrame(data)
        : null;
  } catch (e) {
    console.log(
      `Kepler.gl fails to parse data, detected data
    format is ${info.queryType}`,
      e
    );
  }

  return {data: processed, info};
}

function processDataFrame(data) {
  const fields = data.columns.map(name => ({name}));
  const rows = data.data;

  // kepler.gl will detect field types
  return {fields, rows};
}

export function loadJupyterData(rawData) {
  const dataToLoad = rawData.map(handleJuptyerDataFormat).map(rd => ({
    data: rd.data,
    info: {
      id: rd.id,
      label: rd.id,
      queryType: rd.type,
      queryOption: 'jupyter'
    }
  }));

  return dataToLoad.map(processReceivedData);
}
