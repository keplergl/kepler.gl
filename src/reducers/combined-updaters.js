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

import {
  toggleModalUpdater,
  loadFilesSuccessUpdater as uiStateLoadFilesSuccessUpdater
} from './ui-state-updaters';
import {
  updateVisDataUpdater as visStateUpdateVisDataUpdater,
  setMapInfoUpdater
} from './vis-state-updaters';
import {receiveMapConfigUpdater as stateMapConfigUpdater} from './map-state-updaters';
import {receiveMapConfigUpdater as styleMapConfigUpdater} from './map-style-updaters';
import {findMapBounds} from 'utils/data-utils';
import {isPlainObject} from 'utils/utils';
import {filesToDataPayload} from 'processors/file-handler';
import {payload_, apply_, with_, if_, compose_, merge_, pick_} from './composer-helpers';

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
// @ts-ignore
const combinedUpdaters = null;
/* eslint-enable no-unused-vars */

export const isValidConfig = config =>
  isPlainObject(config) && isPlainObject(config.config) && config.version;

export const defaultAddDataToMapOptions = {
  centerMap: true,
  keepExistingConfig: false,
  autoCreateLayers: true
};

/**
 * Combine data and full configuration update in a single action
 *
 * @memberof combinedUpdaters
 * @param {Object} state kepler.gl instance state, containing all subreducer state
 * @param {Object} action
 * @param {Object} action.payload `{datasets, options, config}`
 * @param action.payload.datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param [action.payload.options] option object `{centerMap: true}`
 * @param [action.payload.config] map config
 * @param [action.payload.info] map info contains title and description
 * @returns nextState
 *
 * @typedef {Object} Dataset
 * @property info -info of a dataset
 * @property info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
 * @property info.label - A display name of this dataset
 * @property data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
 * @property data.fields - ***required** Array of fields,
 * @property data.fields.name - ***required** Name of the field,
 * @property data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
 *
 * @type {typeof import('./combined-updaters').addDataToMapUpdater}
 * @public
 */
export const addDataToMapUpdater = (state, {payload}) => {
  const {datasets, config, info} = payload;

  const options = {
    ...defaultAddDataToMapOptions,
    ...payload.options
  };

  let parsedConfig = config;

  if (isValidConfig(config)) {
    // if passed in saved config
    parsedConfig = state.visState.schema.parseSavedConfig(config);
  }
  const oldLayers = state.visState.layers;
  const filterNewlyAddedLayers = layers => layers.filter(nl => !oldLayers.find(ol => ol === nl));

  // Returns undefined if not found, to make typescript happy
  const findMapBoundsIfCentered = layers => {
    const bounds = options.centerMap && findMapBounds(layers);
    return bounds ? bounds : undefined;
  };

  return compose_([
    pick_('visState')(
      apply_(visStateUpdateVisDataUpdater, {
        datasets,
        options,
        config: parsedConfig
      })
    ),

    if_(info, pick_('visState')(apply_(setMapInfoUpdater, {info}))),

    with_(({visState}) =>
      pick_('mapState')(
        apply_(
          stateMapConfigUpdater,
          payload_({
            config: parsedConfig,
            options,
            bounds: findMapBoundsIfCentered(filterNewlyAddedLayers(visState.layers))
          })
        )
      )
    ),

    pick_('mapStyle')(apply_(styleMapConfigUpdater, payload_({config: parsedConfig, options}))),

    pick_('uiState')(apply_(uiStateLoadFilesSuccessUpdater, payload_(null))),

    pick_('uiState')(apply_(toggleModalUpdater, payload_(null))),

    pick_('uiState')(merge_(options.hasOwnProperty('readOnly') ? {readOnly: options.readOnly} : {}))
  ])(state);
};

/**
 * @type {typeof import('./combined-updaters').loadFilesSuccessUpdater}
 */
export const loadFilesSuccessUpdater = (state, action) => {
  // still more to load
  const payloads = filesToDataPayload(action.result);
  const nextState = compose_([
    pick_('visState')(
      merge_({
        fileLoading: false,
        fileLoadingProgress: {}
      })
    )
  ])(state);
  // make multiple add data to map calls
  const stateWithData = compose_(payloads.map(p => apply_(addDataToMapUpdater, payload_(p))))(
    nextState
  );
  return stateWithData;
};

export const addDataToMapComposed = addDataToMapUpdater;
