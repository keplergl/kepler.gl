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
export const removeLayerDataComposed = (state, action) => {
  // extract mapData
  const {payload: mapData} = action;
  const {key: datasetKey} = mapData;
  const {datasets, layers} = state.visState;
  // check datasetKey matches with current state 
  if (!datasets[datasetKey]) {
    return state;
  }

// get rows from
  const {rows} = mapData.datasets.data;
  // check if rows is present
  if (!rows) {
    return state;
  }

  /* eslint-disable no-unused-vars */
  const {
    datasets: {[datasetKey]: dataset, ...newDatasets}
  } = state.visState;
  /* eslint-enable no-unused-vars */

  // get layer index 
  const indexes = [];
  layers.forEach((layer, index) => {
    if (layer.config.dataId === datasetKey) {
      indexes.push(index);
    }
  });

  function arrayEquals(array1, array2) {
    // if the other array is a falsy value, return
    if (!array2 || !array1)
      return false;
    // check if both are arrays
    if (!Array.isArray(array1) || !Array.isArray(array2))
      return false;
    // compare lengths - can save a lot of time 
    if (array1.length !== array2.length)
      return false;
    for (var i = 0, l = array1.length; i < l; i++) {
      // Check if we have nested arrays
      if (array1[i] instanceof Array && array2[i] instanceof Array) {
        // recurse into the nested arrays
        if (!arrayEquals(array1[i], array2[i]))
          return false;
      } else if (array1[i] !== array2[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  }

  // iterate through layers & remove the data from layers
  indexes.forEach((index) => {
    state.visState.layerData[index].data = state.visState.layerData[index].data.filter((item, idx) => {
      return rows.every((row, pos) => {
        return !arrayEquals(row, item.data);
      });
    });
  });
  return {...state};
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
  [ActionTypes.REMOVE_DATA_ROWS]: removeLayerDataComposed,
  [ActionTypes.APPEND_ROWS_TO_DATASET]: appendRowsToDatasetComposed
};
export default compostedUpdaters;
