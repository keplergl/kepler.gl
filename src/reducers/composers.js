// Copyright (c) 2018 Uber Technologies, Inc.
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

import ActionTypes from 'constants/action-types';
import {fitBoundsUpdater} from './map-state-updaters';
import {toggleModalUpdater} from './ui-state-updaters';
import {updateVisDataUpdater} from './vis-state-updaters';
import {receiveMapConfigUpdater as stateMapConfigUpdater} from './map-state-updaters';
import {receiveMapConfigUpdater as styleMapConfigUpdater} from './map-style-updaters';
import {findMapBounds} from 'utils/data-utils';
import KeplerGlSchema from 'schemas';
import {pruneRows} from '../processors/data-processor';
// compose action to apply result multiple reducers, with the output of one

/**
 * Apply data and config to visState reducer
 * @param {object} state
 * @param {object} action
 * @returns state new reducer state
 */
export const updateVisDataComposed = (state, action) => {
// keep a copy of oldLayers
  const oldLayers = state.visState.layers;
  const visState = updateVisDataUpdater(state.visState, action);
  const defaultOptions = {
    centerMap: true
  };
  const options = {
    ...defaultOptions,
    ...action.options
  };
  let bounds;
  if (options.centerMap) {
// find map bounds for new layers
    const newLayers = visState.layers.filter(nl => !oldLayers.find(ol => ol === nl));
    bounds = findMapBounds(newLayers);
  }

  return {
    ...state,
    visState,
    mapState: bounds
      ? fitBoundsUpdater(state.mapState, {
        payload: bounds
      })
      : state.mapState,
    uiState: {
      ...toggleModalUpdater(state.uiState, {payload: null}),
      ...(options.hasOwnProperty('readOnly') ? {readOnly: options.readOnly} : {})
    }
  };
};
/**
 * Combine data and full configuration update in a single action
 * @param state
 * @param action {datasets, options, config}
 * @returns state
 */
export const addDataToMapComposed = (state, action) => {

  const {datasets, options, config} = action.payload;
  let parsedConfig = config;
  if (config && config.config && config.version) {
// if passed in saved config
    parsedConfig = KeplerGlSchema.parseSavedConfig(config);
  }
// Update visState store
  let mergedState = updateVisDataComposed(state, {datasets, options, config: parsedConfig && parsedConfig.visState});
  // Update mapState store
  mergedState = {
    ...mergedState,
    mapState: stateMapConfigUpdater(mergedState.mapState, {payload: {mapState: parsedConfig && parsedConfig.mapState}})
  };
  // Update mapStyle store
  mergedState = {
    ...mergedState,
    mapStyle: styleMapConfigUpdater(mergedState.mapStyle, {payload: {mapStyle: parsedConfig && parsedConfig.mapStyle}})
  };

  return mergedState;
};
/**
 * Remove layer data from layer data
 * @param state
 * @param action {datasets, options, config}
 * @returns state
 */
export const removeRowsFromDatasetComposed = (state, action) => {
  // extract mapData
  const {payload: mapData} = action;
  const {key: datasetKey, config, options} = mapData;
  const {datasets} = state.visState;

  // check datasetKey matches with current state
  if (!datasets[datasetKey]) {
    return state;
  }

  // get rows & fields
  const {rows, fields} = mapData.datasets.data;

  // check if rows & fields are not empty
  if (!Array.isArray(rows) || !rows.length || !Array.isArray(fields) || !fields.length) {
    return state;
  }

  // check fields have corresponding row values
  if (rows[0].length !== fields.length) {
    return state;
  }

  // check fields exists in previous state
  const fieldTabIndexes = fields.reduce((acc, newField) => {
    let tabIndex = -1;
    const exists = datasets[datasetKey].fields.some((oldField) => {
      // collect tabIndexes of the fields
      tabIndex = oldField.tableFieldIndex;
      return newField.name === oldField.name;
    });
    return (exists === true && tabIndex !== -1) ? [...acc, tabIndex] : acc;
  }, []);

  // return if new fields doesn't match with old ones
  if (!fieldTabIndexes.length) {
    return state;
  }

  // filter new rows from old one
  const newRows = datasets[datasetKey].allData.reduce((acc, row, index) => {
    // extract filed indexed values
    let oldRow = row;

    // extract row values when all row values are not supplied
    if (datasets[datasetKey].fields.length !== fieldTabIndexes.length) {
      oldRow = row.filter((r, i) => {
        return fieldTabIndexes.indexOf(i + 1) !== -1 ? r : null;
      });
    }

    // compare indexed fields are given for removal
    const exists = rows.some((rw, idx) => {
      return rw.every(re => oldRow.includes(re));
    });

    return exists === false ? [...acc, row] : acc;
  }, []);

  // build datasets
  const newDatasets = {
    data: {
      fields: [...datasets[datasetKey].fields],
      rows: [...newRows]
    },
    info: {id: datasets[datasetKey].id, label: datasets[datasetKey].label}
  };

  return addDataToMapComposed(state, {payload: {datasets: newDatasets, config, key: datasetKey, options}});
};
/**
 * Combine new layer data and full configuration update in a single action
 * @param state
 * @param action {datasets, options, config}
 * @returns state
 */
export const appendRowsToDatasetComposed = (state, action) => {
  // check if dataset rows are present
  const {key: datasetKey, options, datasets: newDatasets, config} = action.payload;
  const {datasets: oldDatasets} = state.visState;

  // check datasetKey matches with current state 
  if (!oldDatasets[datasetKey]) {
    return state;
  }

  // check new dataset has rows
  if (!newDatasets.data.rows.length) {
    return state;
  }

  // prune rows before merging with datasets
  const newDataRows = pruneRows(newDatasets.data.rows, oldDatasets[datasetKey].data[0].length);

  // merge old  and new datasets
  const datasets = {
    data: {
      fields: [...oldDatasets[datasetKey].fields],
      rows: [...newDataRows, ...oldDatasets[datasetKey].data]
    },
    info: {id: oldDatasets[datasetKey].id, label: oldDatasets[datasetKey].label}
  };

  return addDataToMapComposed(state, {payload: {datasets, config, key: datasetKey, options}});
};
const compostedUpdaters = {
  [ActionTypes.UPDATE_VIS_DATA]: updateVisDataComposed,
  [ActionTypes.ADD_DATA_TO_MAP]: addDataToMapComposed,
  [ActionTypes.REMOVE_ROWS_FROM_DATASET]: removeRowsFromDatasetComposed,
  [ActionTypes.APPEND_ROWS_TO_DATASET]: appendRowsToDatasetComposed
};
export default compostedUpdaters;
