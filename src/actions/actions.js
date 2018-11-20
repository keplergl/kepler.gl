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

import ActionTypes from 'constants/action-types';
import {createAction} from 'redux-actions';

// kepler.gl actions accessible outside component
export * from './vis-state-actions';
export * from './ui-state-actions';
export * from './map-state-actions';
export * from './map-style-actions';
export * from './identity-actions';

  /**
   * Add data to kepler.gl reducer, prepare map with preset configuration if config is passed.
   * Kepler.gl provides a handy set of utils to parse data from different format to the `data` object required in dataset. You rarely need to manually format the data obejct.
   *
   * Use `KeplerGlSchema.getConfigToSave` to generate a json blob of the currents instance config.
   * The config object value will always have higher precedence than the options properties.
   *
   * Kepler.gl uses `dataId` in the config to match with loaded dataset. If you pass a config object, you need
   * to match the `info.id` of your dataset to the `dataId` in eath `layer`, `filter` and `interactionConfig.tooltips.fieldsToShow`
   *
   * @param {Array<Object>|Object} datasets - ***required** datasets can be a dataset or an array of datasets
   * Each dataset object needs to have `info` and `data` property.
   * @param {Object} datasets.info -info of a dataset
   * @param {string} datasets.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
   * @param {string} datasets.info.label - A display name of this dataset
   * @param {Object} datasets.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
   * @param {Array<Object>} datasets.data.fields - ***required** Array of fields,
   * @param {string} datasets.data.fields.name - ***required** Name of the field,
   * @param {Array<Array>} datasets.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
   *
   * @param {Object} options
   * @param {boolean} options.centerMap `default: true` if `centerMap` is set to `true` kepler.gl will
   * place the map view within the data points boundaries
   * @param {boolean} options.readOnly `default: false` if `readOnly` is set to `true`
   * the left setting panel will be hidden
   * @param {Object} config this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}
   * @public
   * @example
   * import {addDataToMap} from 'kepler.gl/actions';
   *
   * this.props.dispatch(
   *   addDataToMap(
   *     // datasets
   *     {
   *       info: {
   *         label: 'Sample Taxi Trips in New York City',
   *         id: 'test_trip_data'
   *       },
   *       data: {
   *         fields: [{
   *           name: 'begintrip_lat',
   *           type: 'real',
   *           format: ''
   *         }, {
   *           name: 'begintrip_lng',
   *           type: 'real',
   *           format: ''
   *         }],
   *         rows: [
   *          [37.1234, -121.20292],
   *          [34.1223, -121.98234]
   *         ]
   *       }
   *     },
   *     // option
   *     {
   *       centerMap: true,
   *       readOnly: false
   *     },
   *     // config
   *     {
   *       mapStyle: {
   *        styleType: 'light'
   *       }
   *     }
   *   )
   * );
   */
export const addDataToMap = createAction(
  ActionTypes.ADD_DATA_TO_MAP,
  (datasets, options, config) => ({datasets, options, config})
);

/**
 * Reset all reducers to its initial state
 * @public
 */
export const resetMapConfig = createAction(
  ActionTypes.RESET_MAP_CONFIG
);

/**
 * Pass config to kepler.gl instance, prepare the state with preset configs.
 * Calling `KeplerGlSchema.parseSavedConfig` to convert saved config before passing it in is required.
 *
 * You can call `receiveMapConfig` before passing in any data. The reducer will store layer and filter config, waiting for
 * data to come in. When data arrives, you can call `addDataToMap` without passing any config, and the reducer will try to match
 * preloaded configs. This behavior is designed to allow asynchronic data loading.
 *
 * It is also useful when you want to prepare the kepler.gl instance with some preset layer and filter settings.
 * **Note** Sequence is important, `receiveMapConfig` needs to be called __before__ data is loaded. Currently kepler.gl doesn't allow callling `receiveMapConfig` after data is loaded.
 * It will reset current configuration first then apply config to it.
 *
 * @param {Object} config - ***required** The Config Object
 * @public
 * @example
 * import {receiveMapConfig} from 'kepler.gl/actions';
 * import KeplerGlSchema from 'kepler.gl/schemas';
 *
 * const parsedConfig = KeplerGlSchema.parseSavedConfig(config);
 * this.props.dispatch(receiveMapConfig(parsedConfig));
 */
export const receiveMapConfig = createAction(
  ActionTypes.RECEIVE_MAP_CONFIG,
  config => config
);

/**
 * Initialize kepler.gl reducer. It is used to pass in `mapboxApiAccessToken` to `mapStyle` reducer
 * @param {Object} payload
 * @param {string} payload.mapboxApiAccessToken - mapboxApiAccessToken to be saved to mapStyle reducer
 * @public
 */
export const keplerGlInit =  createAction(
  ActionTypes.INIT,
  ({mapboxApiAccessToken} = {}) => ({mapboxApiAccessToken})
);
