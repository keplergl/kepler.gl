// Copyright (c) 2019 Uber Technologies, Inc.
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

import {fitBoundsUpdater} from './map-state-updaters';
import {toggleModalUpdater} from './ui-state-updaters';
import {
  updateVisDataUpdater as visStateUpdateVisDataUpdater,
  setFeaturesUpdater as visStateFeaturesUpdater,
  deleteFeatureUpdater as visDeleteFeatureUpdater
} from './vis-state-updaters';
import {receiveMapConfigUpdater as stateMapConfigUpdater} from './map-state-updaters';
import {receiveMapConfigUpdater as styleMapConfigUpdater} from './map-style-updaters';
import {
  setFeaturesUpdater as uiStateFeaturesUpdater,
  deleteFeatureUpdater as uiDeleteFeatureUpdater
} from './ui-state-updaters';
import {findMapBounds} from 'utils/data-utils';
import KeplerGlSchema from 'schemas';

// compose action to apply result multiple reducers, with the output of one

/**
 * Some actions will affect the entire kepler.lg instance state.
 * The updaters for these actions is exported as `combinedUpdaters`. These updater take the entire instance state
 * as the first argument. Read more about [Using updaters](../advanced-usage/using-updaters.md)
 * @public
 * @example
 *
 * import keplerGlReducer, {combinedUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // add data to map after receiving data from remote sources
 *    case 'LOAD_REMOTE_RESOURCE_SUCCESS':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          // pass in kepler.gl instance state to combinedUpdaters
 *          map:  combinedUpdaters.addDataToMapUpdater(
 *           state.keplerGl.map,
 *           {
 *             payload: {
 *               datasets: action.datasets,
 *               options: {readOnly: true},
 *               config: action.config
 *              }
 *            }
 *          )
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */
/* eslint-disable no-unused-vars */
const combinedUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * Apply data and config to visState reducer
 * @memberof combinedUpdaters
 * @param {Object} state kepler.gl instance state, containing all subreducer state
 * @param {Object} action
 * @param {Array<Object>|Object} action.datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param {Object} action.datasets.info -info of a dataset
 * @param {string} action.datasets.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
 * @param {string} action.datasets.info.label - A display name of this dataset
 * @param {Object} action.datasets.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
 * @param {Array<Object>} action.datasets.data.fields - ***required** Array of fields,
 * @param {string} action.datasets.data.fields.name - ***required** Name of the field,
 * @param {Array<Array>} action.datasets.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
 * @param {Object} action.options
 * @param {Boolean} action.options.centerMap
 * @param {Boolean} action.options.readOnly
 * @param {Object} action.config
 * @returns {Object} nextState
 * @public
 */
export const updateVisDataUpdater = (state, action) => {
  // keep a copy of oldLayers
  const oldLayers = state.visState.layers;

  const visState = visStateUpdateVisDataUpdater(state.visState, action);

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

export const updateVisDataComposed = updateVisDataUpdater;

/**
 * Combine data and full configuration update in a single action
 *
 * @memberof combinedUpdaters
 * @param {Object} state kepler.gl instance state, containing all subreducer state
 * @param {Object} action
 * @param {Object} action.payload `{datasets, options, config}`
 * @param {Array<Object>|Object} action.payload.datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param {Object} action.payload.datasets.info -info of a dataset
 * @param {string} action.payload.datasets.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
 * @param {string} action.payload.datasets.info.label - A display name of this dataset
 * @param {Object} action.payload.datasets.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
 * @param {Array<Object>} action.payload.datasets.data.fields - ***required** Array of fields,
 * @param {string} action.payload.datasets.data.fields.name - ***required** Name of the field,
 * @param {Array<Array>} action.payload.datasets.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
 * @param {Object} action.payload.options option object `{centerMap: true}`
 * @param {Object} action.payload.config map config
 * @returns {Object} nextState
 * @public
 */
export const addDataToMapUpdater = (state, {payload}) => {

  const {datasets, options, config} = payload;
  let parsedConfig = config;

  if (config && config.config && config.version) {
    // if passed in saved config
    parsedConfig = KeplerGlSchema.parseSavedConfig(config)
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

  return mergedState
};

export const addDataToMapComposed = addDataToMapUpdater;

export const setFeaturesUpdater = (state, payload) => ({
  ...state,
  visState: visStateFeaturesUpdater(state.visState, payload),
  uiState: uiStateFeaturesUpdater(state.uiState, payload)
});

export const setFeaturesComposed = setFeaturesUpdater;

export const deleteFeatureUpdater = (state, payload) => ({
  ...state,
  visState: visDeleteFeatureUpdater(state.visState, payload),
  uiState: uiDeleteFeatureUpdater(state.uiState, payload)
});

export const deleteFeatureComposed = deleteFeatureUpdater;
