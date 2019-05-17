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
import {addNotificationUpdater, toggleModalUpdater} from './ui-state-updaters';
import {loadFilesErrUpdater as loadFilesErrVisUpdater, updateVisDataUpdater as visStateUpdateVisDataUpdater} from './vis-state-updaters';
import {receiveMapConfigUpdater as stateMapConfigUpdater} from './map-state-updaters';
import {receiveMapConfigUpdater as styleMapConfigUpdater} from './map-style-updaters';
import {findMapBounds} from 'utils/data-utils';
import KeplerGlSchema from 'schemas';
import Task, {withTask} from 'react-palm/tasks';
import {loadFilesSuccess, loadFilesErr} from 'actions';
import {processFileToLoad} from 'utils/file-utils';
import {LOAD_FILE_TASK} from 'tasks/tasks';
import {successNotification, errorNotification} from 'utils/notifications-utils';
import {DEFAULT_NOTIFICATION_TYPES} from 'constants';

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

/**
 * Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed
 * @memberof combinedUpdaters
 * @param {Object} state kepler.gl instance state, containing all subreducer state
 * @param {Object} action action
 * @param {Array<Object>} action.files array of fileblob
 * @returns {Object} nextState
 * @public
 */
export const loadFilesUpdater = (state, action) => {
  const {files} = action;

  const filesToLoad = files.map(fileBlob => processFileToLoad(fileBlob));

  // reader -> parser -> augment -> receiveVisData
  const loadFileTasks = [
    Task.all(filesToLoad.map(LOAD_FILE_TASK)).bimap(
      results => {
        const data = results.reduce((f, c) => ({
          // using concat here because the current datasets could be an array or a single item
          datasets: f.datasets.concat(c.datasets),
          // we need to deep merge this thing unless we find a better solution
          // this case will only happen if we allow to load multiple keplergl json files
          config: {
            ...f.config,
            ...(c.config || {})
          }
        }), {datasets: [], config: {}, options: {centerMap: true}});
        return loadFilesSuccess(data);
      },
      error => loadFilesErr(error)
    )
  ];

  return withTask(
    {
      ...state,
      visState: {
        ...state.visState,
        fileLoading: true
      }
    },
    loadFileTasks
  );
};

export const loadFilesComposed = loadFilesUpdater;

/**
 * Trigger loading file error
 * @memberof combinedUpdaters
 * @param {Object} state kepler.gl instance state, containing all subreducer state
 * @param {Object} action action
 * @param {*} action.error
 * @returns {Object} nextState
 * @public
 */
export const loadFilesSuccessUpdater = (state, action) => {
  const newState = addDataToMapComposed(state, action);
  const {datasets: loadedFiles} = action.payload;
  const notification = successNotification({
    message: `Loaded Files: ${loadedFiles.length}`,
    topic: DEFAULT_NOTIFICATION_TYPES.file
  });
  return {
    ...newState,
    uiState: addNotificationUpdater(newState.uiState, {payload: notification})
  }
};

export const loadFilesSuccessComposed = loadFilesSuccessUpdater;

/**
 * Trigger loading file error
 * @memberof combinedUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {*} action.error
 * @returns {Object} nextState
 * @public
 */
export const loadFilesErrUpdater = (state, action) => {
  const notification = errorNotification({
    message: `Error loading files`,
    topic: DEFAULT_NOTIFICATION_TYPES.file
  });
  const newUIState = toggleModalUpdater(
    addNotificationUpdater(state.uiState, {payload: notification}),
    {payload: null}
  );
  return {
    ...state,
    visState: loadFilesErrVisUpdater(state.visState, action),
    uiState: newUIState
  }
};

export const loadFilesErrComposed = loadFilesErrUpdater;
