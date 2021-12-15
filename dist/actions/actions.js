"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keplerGlInit = exports.receiveMapConfig = exports.resetMapConfig = exports.addDataToMap = void 0;

var _actionTypes = _interopRequireDefault(require("../constants/action-types"));

var _reduxActions = require("redux-actions");

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

/**
 * Add data to kepler.gl reducer, prepare map with preset configuration if config is passed.
 * Kepler.gl provides a handy set of utils to parse data from different formats to the `data` object required in dataset. You rarely need to manually format the data obejct.
 *
 * Use `KeplerGlSchema.getConfigToSave` to generate a json blob of the currents instance config.
 * The config object value will always have higher precedence than the options properties.
 *
 * Kepler.gl uses `dataId` in the config to match with loaded dataset. If you pass a config object, you need
 * to match the `info.id` of your dataset to the `dataId` in each `layer`, `filter` and `interactionConfig.tooltips.fieldsToShow`
 *
 * @memberof main
 * @param {Object} data
 * @param {Array<Object>|Object} data.datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param {Object} data.datasets.info -info of a dataset
 * @param {string} data.datasets.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
 * @param {string} data.datasets.info.label - A display name of this dataset
 * @param {Object} data.datasets.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
 * @param {Array<Object>} data.datasets.data.fields - ***required** Array of fields,
 * @param {string} data.datasets.data.fields.name - ***required** Name of the field,
 * @param {Array<Array>} data.datasets.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
 *
 * @param {Object} data.options
 * @param {boolean} data.options.centerMap `default: true` if `centerMap` is set to `true` kepler.gl will
 * place the map view within the data points boundaries.  `options.centerMap` will override `config.mapState` if passed in.
 * @param {boolean} data.options.readOnly `default: false` if `readOnly` is set to `true`
 * the left setting panel will be hidden
 * @param {boolean} data.options.keepExistingConfig whether to keep exiting map data and associated layer filter  interaction config `default: false`.
 * @param {Object} data.config this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}
 * @public
 * @example
 *
 * // app.js
 * import {addDataToMap} from 'kepler.gl/actions';
 *
 * const sampleTripData = {
 *  fields: [
 *    {name: 'tpep_pickup_datetime', format: 'YYYY-M-D H:m:s', type: 'timestamp'},
 *    {name: 'pickup_longitude', format: '', type: 'real'},
 *    {name: 'pickup_latitude', format: '', type: 'real'}
 *  ],
 *  rows: [
 *    ['2015-01-15 19:05:39 +00:00', -73.99389648, 40.75011063],
 *    ['2015-01-15 19:05:39 +00:00', -73.97642517, 40.73981094],
 *    ['2015-01-15 19:05:40 +00:00', -73.96870422, 40.75424576],
 *  ]
 * };
 *
 * const sampleConfig = {
 *   visState: {
 *     filters: [
 *       {
 *         id: 'me',
 *         dataId: 'test_trip_data',
 *         name: 'tpep_pickup_datetime',
 *         type: 'timeRange',
 *         enlarged: true
 *       }
 *     ]
 *   }
 * }
 *
 * this.props.dispatch(
 *   addDataToMap({
 *     datasets: {
 *       info: {
 *         label: 'Sample Taxi Trips in New York City',
 *         id: 'test_trip_data'
 *       },
 *       data: sampleTripData
 *     },
 *     options: {
 *       centerMap: true,
 *       readOnly: false,
 *       keepExistingConfig: false
 *     },
 *     info: {
 *       title: 'Taro and Blue',
 *       description: 'This is my map'
 *     },
 *     config: sampleConfig
 *   })
 * );
 */
var addDataToMap = (0, _reduxActions.createAction)(_actionTypes["default"].ADD_DATA_TO_MAP, function (data) {
  return data;
});
/**
 * Reset all sub-reducers to its initial state. This can be used to clear out all configuration in the reducer.
 * @memberof main
 * @public
 */

exports.addDataToMap = addDataToMap;
var resetMapConfig = (0, _reduxActions.createAction)(_actionTypes["default"].RESET_MAP_CONFIG);
/**
 * Pass config to kepler.gl instance, prepare the state with preset configs.
 * Calling `KeplerGlSchema.parseSavedConfig` to convert saved config before passing it in is required.
 *
 * You can call `receiveMapConfig` before passing in any data. The reducer will store layer and filter config, waiting for
 * data to come in. When data arrives, you can call `addDataToMap` without passing any config, and the reducer will try to match
 * preloaded configs. This behavior is designed to allow asynchronous data loading.
 *
 * It is also useful when you want to prepare the kepler.gl instance with some preset layer and filter settings.
 * **Note** Sequence is important, `receiveMapConfig` needs to be called __before__ data is loaded. Currently kepler.gl doesn't allow calling `receiveMapConfig` after data is loaded.
 * It will reset current configuration first then apply config to it.
 * @memberof main
 * @param {Object} config - ***required** The Config Object
 * @param {Object} options - ***optional** The Option object
 * @param {boolean} options.centerMap `default: true` if `centerMap` is set to `true` kepler.gl will
 * place the map view within the data points boundaries
 * @param {boolean} options.readOnly `default: false` if `readOnly` is set to `true`
 * the left setting panel will be hidden
 * @param {boolean} options.keepExistingConfig whether to keep exiting layer filter and interaction config `default: false`.
 * @param {boolean} options.autoCreateLayers whether to automatically create layers based on dataset columns `default: true`.
 * @public
 * @example
 * import {receiveMapConfig} from 'kepler.gl/actions';
 * import KeplerGlSchema from 'kepler.gl/schemas';
 *
 * const parsedConfig = KeplerGlSchema.parseSavedConfig(config);
 * this.props.dispatch(receiveMapConfig(parsedConfig));
 */

exports.resetMapConfig = resetMapConfig;
var receiveMapConfig = (0, _reduxActions.createAction)(_actionTypes["default"].RECEIVE_MAP_CONFIG, function (config, options) {
  return {
    config: config,
    options: options
  };
});
/**
 * Initialize kepler.gl reducer. It is used to pass in `mapboxApiAccessToken` to `mapStyle` reducer.
 * @memberof main
 * @param {object} payload
 * @param payload.mapboxApiAccessToken - mapboxApiAccessToken to be saved to mapStyle reducer
 * @param payload.mapboxApiUrl - mapboxApiUrl to be saved to mapStyle reducer.
 * @param payload.mapStylesReplaceDefault - mapStylesReplaceDefault to be saved to mapStyle reducer
 * @param payload.initialUiState - initial ui state
 * @type {typeof import('./actions').keplerGlInit}
 * @public
 */

exports.receiveMapConfig = receiveMapConfig;
var keplerGlInit = (0, _reduxActions.createAction)(_actionTypes["default"].INIT, // @ts-ignore
function (payload) {
  return payload;
});
/**
 * This declaration is needed to group actions in docs
 */

/**
 * Main kepler.gl actions, these actions handles loading data and config into kepler.gl reducer. These actions
 * is listened by all subreducers,
 * @public
 */

/* eslint-disable no-unused-vars */
// @ts-ignore

exports.keplerGlInit = keplerGlInit;
var main = null;
/* eslint-enable no-unused-vars */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbnMuanMiXSwibmFtZXMiOlsiYWRkRGF0YVRvTWFwIiwiQWN0aW9uVHlwZXMiLCJBRERfREFUQV9UT19NQVAiLCJkYXRhIiwicmVzZXRNYXBDb25maWciLCJSRVNFVF9NQVBfQ09ORklHIiwicmVjZWl2ZU1hcENvbmZpZyIsIlJFQ0VJVkVfTUFQX0NPTkZJRyIsImNvbmZpZyIsIm9wdGlvbnMiLCJrZXBsZXJHbEluaXQiLCJJTklUIiwicGF5bG9hZCIsIm1haW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sSUFBTUEsWUFBWSxHQUFHLGdDQUFhQyx3QkFBWUMsZUFBekIsRUFBMEMsVUFBQUMsSUFBSTtBQUFBLFNBQUlBLElBQUo7QUFBQSxDQUE5QyxDQUFyQjtBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLElBQU1DLGNBQWMsR0FBRyxnQ0FBYUgsd0JBQVlJLGdCQUF6QixDQUF2QjtBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxJQUFNQyxnQkFBZ0IsR0FBRyxnQ0FBYUwsd0JBQVlNLGtCQUF6QixFQUE2QyxVQUFDQyxNQUFELEVBQVNDLE9BQVQ7QUFBQSxTQUFzQjtBQUNqR0QsSUFBQUEsTUFBTSxFQUFOQSxNQURpRztBQUVqR0MsSUFBQUEsT0FBTyxFQUFQQTtBQUZpRyxHQUF0QjtBQUFBLENBQTdDLENBQXpCO0FBS1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sSUFBTUMsWUFBWSxHQUFHLGdDQUMxQlQsd0JBQVlVLElBRGMsRUFFMUI7QUFDQSxVQUFBQyxPQUFPO0FBQUEsU0FBSUEsT0FBSjtBQUFBLENBSG1CLENBQXJCO0FBTVA7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTUMsSUFBSSxHQUFHLElBQWI7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICdjb25zdGFudHMvYWN0aW9uLXR5cGVzJztcbmltcG9ydCB7Y3JlYXRlQWN0aW9ufSBmcm9tICdyZWR1eC1hY3Rpb25zJztcblxuLyoqXG4gKiBBZGQgZGF0YSB0byBrZXBsZXIuZ2wgcmVkdWNlciwgcHJlcGFyZSBtYXAgd2l0aCBwcmVzZXQgY29uZmlndXJhdGlvbiBpZiBjb25maWcgaXMgcGFzc2VkLlxuICogS2VwbGVyLmdsIHByb3ZpZGVzIGEgaGFuZHkgc2V0IG9mIHV0aWxzIHRvIHBhcnNlIGRhdGEgZnJvbSBkaWZmZXJlbnQgZm9ybWF0cyB0byB0aGUgYGRhdGFgIG9iamVjdCByZXF1aXJlZCBpbiBkYXRhc2V0LiBZb3UgcmFyZWx5IG5lZWQgdG8gbWFudWFsbHkgZm9ybWF0IHRoZSBkYXRhIG9iZWpjdC5cbiAqXG4gKiBVc2UgYEtlcGxlckdsU2NoZW1hLmdldENvbmZpZ1RvU2F2ZWAgdG8gZ2VuZXJhdGUgYSBqc29uIGJsb2Igb2YgdGhlIGN1cnJlbnRzIGluc3RhbmNlIGNvbmZpZy5cbiAqIFRoZSBjb25maWcgb2JqZWN0IHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiB0aGUgb3B0aW9ucyBwcm9wZXJ0aWVzLlxuICpcbiAqIEtlcGxlci5nbCB1c2VzIGBkYXRhSWRgIGluIHRoZSBjb25maWcgdG8gbWF0Y2ggd2l0aCBsb2FkZWQgZGF0YXNldC4gSWYgeW91IHBhc3MgYSBjb25maWcgb2JqZWN0LCB5b3UgbmVlZFxuICogdG8gbWF0Y2ggdGhlIGBpbmZvLmlkYCBvZiB5b3VyIGRhdGFzZXQgdG8gdGhlIGBkYXRhSWRgIGluIGVhY2ggYGxheWVyYCwgYGZpbHRlcmAgYW5kIGBpbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwcy5maWVsZHNUb1Nob3dgXG4gKlxuICogQG1lbWJlcm9mIG1haW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD58T2JqZWN0fSBkYXRhLmRhdGFzZXRzIC0gKioqcmVxdWlyZWQqKiBkYXRhc2V0cyBjYW4gYmUgYSBkYXRhc2V0IG9yIGFuIGFycmF5IG9mIGRhdGFzZXRzXG4gKiBFYWNoIGRhdGFzZXQgb2JqZWN0IG5lZWRzIHRvIGhhdmUgYGluZm9gIGFuZCBgZGF0YWAgcHJvcGVydHkuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YS5kYXRhc2V0cy5pbmZvIC1pbmZvIG9mIGEgZGF0YXNldFxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGEuZGF0YXNldHMuaW5mby5pZCAtIGlkIG9mIHRoaXMgZGF0YXNldC4gSWYgY29uZmlnIGlzIGRlZmluZWQsIGBpZGAgc2hvdWxkIG1hdGNoZXMgdGhlIGBkYXRhSWRgIGluIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLmRhdGFzZXRzLmluZm8ubGFiZWwgLSBBIGRpc3BsYXkgbmFtZSBvZiB0aGlzIGRhdGFzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhLmRhdGFzZXRzLmRhdGEgLSAqKipyZXF1aXJlZCoqIFRoZSBkYXRhIG9iamVjdCwgaW4gYSB0YWJ1bGFyIGZvcm1hdCB3aXRoIDIgcHJvcGVydGllcyBgZmllbGRzYCBhbmQgYHJvd3NgXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGRhdGEuZGF0YXNldHMuZGF0YS5maWVsZHMgLSAqKipyZXF1aXJlZCoqIEFycmF5IG9mIGZpZWxkcyxcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLmRhdGFzZXRzLmRhdGEuZmllbGRzLm5hbWUgLSAqKipyZXF1aXJlZCoqIE5hbWUgb2YgdGhlIGZpZWxkLFxuICogQHBhcmFtIHtBcnJheTxBcnJheT59IGRhdGEuZGF0YXNldHMuZGF0YS5yb3dzIC0gKioqcmVxdWlyZWQqKiBBcnJheSBvZiByb3dzLCBpbiBhIHRhYnVsYXIgZm9ybWF0IHdpdGggYGZpZWxkc2AgYW5kIGByb3dzYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhLm9wdGlvbnNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZGF0YS5vcHRpb25zLmNlbnRlck1hcCBgZGVmYXVsdDogdHJ1ZWAgaWYgYGNlbnRlck1hcGAgaXMgc2V0IHRvIGB0cnVlYCBrZXBsZXIuZ2wgd2lsbFxuICogcGxhY2UgdGhlIG1hcCB2aWV3IHdpdGhpbiB0aGUgZGF0YSBwb2ludHMgYm91bmRhcmllcy4gIGBvcHRpb25zLmNlbnRlck1hcGAgd2lsbCBvdmVycmlkZSBgY29uZmlnLm1hcFN0YXRlYCBpZiBwYXNzZWQgaW4uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGRhdGEub3B0aW9ucy5yZWFkT25seSBgZGVmYXVsdDogZmFsc2VgIGlmIGByZWFkT25seWAgaXMgc2V0IHRvIGB0cnVlYFxuICogdGhlIGxlZnQgc2V0dGluZyBwYW5lbCB3aWxsIGJlIGhpZGRlblxuICogQHBhcmFtIHtib29sZWFufSBkYXRhLm9wdGlvbnMua2VlcEV4aXN0aW5nQ29uZmlnIHdoZXRoZXIgdG8ga2VlcCBleGl0aW5nIG1hcCBkYXRhIGFuZCBhc3NvY2lhdGVkIGxheWVyIGZpbHRlciAgaW50ZXJhY3Rpb24gY29uZmlnIGBkZWZhdWx0OiBmYWxzZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YS5jb25maWcgdGhpcyBvYmplY3Qgd2lsbCBjb250YWluIHRoZSBmdWxsIGtlcGxlci5nbCBpbnN0YW5jZSBjb25maWd1cmF0aW9uIHttYXBTdGF0ZSwgbWFwU3R5bGUsIHZpc1N0YXRlfVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBhcHAuanNcbiAqIGltcG9ydCB7YWRkRGF0YVRvTWFwfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKlxuICogY29uc3Qgc2FtcGxlVHJpcERhdGEgPSB7XG4gKiAgZmllbGRzOiBbXG4gKiAgICB7bmFtZTogJ3RwZXBfcGlja3VwX2RhdGV0aW1lJywgZm9ybWF0OiAnWVlZWS1NLUQgSDptOnMnLCB0eXBlOiAndGltZXN0YW1wJ30sXG4gKiAgICB7bmFtZTogJ3BpY2t1cF9sb25naXR1ZGUnLCBmb3JtYXQ6ICcnLCB0eXBlOiAncmVhbCd9LFxuICogICAge25hbWU6ICdwaWNrdXBfbGF0aXR1ZGUnLCBmb3JtYXQ6ICcnLCB0eXBlOiAncmVhbCd9XG4gKiAgXSxcbiAqICByb3dzOiBbXG4gKiAgICBbJzIwMTUtMDEtMTUgMTk6MDU6MzkgKzAwOjAwJywgLTczLjk5Mzg5NjQ4LCA0MC43NTAxMTA2M10sXG4gKiAgICBbJzIwMTUtMDEtMTUgMTk6MDU6MzkgKzAwOjAwJywgLTczLjk3NjQyNTE3LCA0MC43Mzk4MTA5NF0sXG4gKiAgICBbJzIwMTUtMDEtMTUgMTk6MDU6NDAgKzAwOjAwJywgLTczLjk2ODcwNDIyLCA0MC43NTQyNDU3Nl0sXG4gKiAgXVxuICogfTtcbiAqXG4gKiBjb25zdCBzYW1wbGVDb25maWcgPSB7XG4gKiAgIHZpc1N0YXRlOiB7XG4gKiAgICAgZmlsdGVyczogW1xuICogICAgICAge1xuICogICAgICAgICBpZDogJ21lJyxcbiAqICAgICAgICAgZGF0YUlkOiAndGVzdF90cmlwX2RhdGEnLFxuICogICAgICAgICBuYW1lOiAndHBlcF9waWNrdXBfZGF0ZXRpbWUnLFxuICogICAgICAgICB0eXBlOiAndGltZVJhbmdlJyxcbiAqICAgICAgICAgZW5sYXJnZWQ6IHRydWVcbiAqICAgICAgIH1cbiAqICAgICBdXG4gKiAgIH1cbiAqIH1cbiAqXG4gKiB0aGlzLnByb3BzLmRpc3BhdGNoKFxuICogICBhZGREYXRhVG9NYXAoe1xuICogICAgIGRhdGFzZXRzOiB7XG4gKiAgICAgICBpbmZvOiB7XG4gKiAgICAgICAgIGxhYmVsOiAnU2FtcGxlIFRheGkgVHJpcHMgaW4gTmV3IFlvcmsgQ2l0eScsXG4gKiAgICAgICAgIGlkOiAndGVzdF90cmlwX2RhdGEnXG4gKiAgICAgICB9LFxuICogICAgICAgZGF0YTogc2FtcGxlVHJpcERhdGFcbiAqICAgICB9LFxuICogICAgIG9wdGlvbnM6IHtcbiAqICAgICAgIGNlbnRlck1hcDogdHJ1ZSxcbiAqICAgICAgIHJlYWRPbmx5OiBmYWxzZSxcbiAqICAgICAgIGtlZXBFeGlzdGluZ0NvbmZpZzogZmFsc2VcbiAqICAgICB9LFxuICogICAgIGluZm86IHtcbiAqICAgICAgIHRpdGxlOiAnVGFybyBhbmQgQmx1ZScsXG4gKiAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgbXkgbWFwJ1xuICogICAgIH0sXG4gKiAgICAgY29uZmlnOiBzYW1wbGVDb25maWdcbiAqICAgfSlcbiAqICk7XG4gKi9cbmV4cG9ydCBjb25zdCBhZGREYXRhVG9NYXAgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuQUREX0RBVEFfVE9fTUFQLCBkYXRhID0+IGRhdGEpO1xuXG4vKipcbiAqIFJlc2V0IGFsbCBzdWItcmVkdWNlcnMgdG8gaXRzIGluaXRpYWwgc3RhdGUuIFRoaXMgY2FuIGJlIHVzZWQgdG8gY2xlYXIgb3V0IGFsbCBjb25maWd1cmF0aW9uIGluIHRoZSByZWR1Y2VyLlxuICogQG1lbWJlcm9mIG1haW5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlc2V0TWFwQ29uZmlnID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlJFU0VUX01BUF9DT05GSUcpO1xuXG4vKipcbiAqIFBhc3MgY29uZmlnIHRvIGtlcGxlci5nbCBpbnN0YW5jZSwgcHJlcGFyZSB0aGUgc3RhdGUgd2l0aCBwcmVzZXQgY29uZmlncy5cbiAqIENhbGxpbmcgYEtlcGxlckdsU2NoZW1hLnBhcnNlU2F2ZWRDb25maWdgIHRvIGNvbnZlcnQgc2F2ZWQgY29uZmlnIGJlZm9yZSBwYXNzaW5nIGl0IGluIGlzIHJlcXVpcmVkLlxuICpcbiAqIFlvdSBjYW4gY2FsbCBgcmVjZWl2ZU1hcENvbmZpZ2AgYmVmb3JlIHBhc3NpbmcgaW4gYW55IGRhdGEuIFRoZSByZWR1Y2VyIHdpbGwgc3RvcmUgbGF5ZXIgYW5kIGZpbHRlciBjb25maWcsIHdhaXRpbmcgZm9yXG4gKiBkYXRhIHRvIGNvbWUgaW4uIFdoZW4gZGF0YSBhcnJpdmVzLCB5b3UgY2FuIGNhbGwgYGFkZERhdGFUb01hcGAgd2l0aG91dCBwYXNzaW5nIGFueSBjb25maWcsIGFuZCB0aGUgcmVkdWNlciB3aWxsIHRyeSB0byBtYXRjaFxuICogcHJlbG9hZGVkIGNvbmZpZ3MuIFRoaXMgYmVoYXZpb3IgaXMgZGVzaWduZWQgdG8gYWxsb3cgYXN5bmNocm9ub3VzIGRhdGEgbG9hZGluZy5cbiAqXG4gKiBJdCBpcyBhbHNvIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIHByZXBhcmUgdGhlIGtlcGxlci5nbCBpbnN0YW5jZSB3aXRoIHNvbWUgcHJlc2V0IGxheWVyIGFuZCBmaWx0ZXIgc2V0dGluZ3MuXG4gKiAqKk5vdGUqKiBTZXF1ZW5jZSBpcyBpbXBvcnRhbnQsIGByZWNlaXZlTWFwQ29uZmlnYCBuZWVkcyB0byBiZSBjYWxsZWQgX19iZWZvcmVfXyBkYXRhIGlzIGxvYWRlZC4gQ3VycmVudGx5IGtlcGxlci5nbCBkb2Vzbid0IGFsbG93IGNhbGxpbmcgYHJlY2VpdmVNYXBDb25maWdgIGFmdGVyIGRhdGEgaXMgbG9hZGVkLlxuICogSXQgd2lsbCByZXNldCBjdXJyZW50IGNvbmZpZ3VyYXRpb24gZmlyc3QgdGhlbiBhcHBseSBjb25maWcgdG8gaXQuXG4gKiBAbWVtYmVyb2YgbWFpblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtICoqKnJlcXVpcmVkKiogVGhlIENvbmZpZyBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gKioqb3B0aW9uYWwqKiBUaGUgT3B0aW9uIG9iamVjdFxuICogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLmNlbnRlck1hcCBgZGVmYXVsdDogdHJ1ZWAgaWYgYGNlbnRlck1hcGAgaXMgc2V0IHRvIGB0cnVlYCBrZXBsZXIuZ2wgd2lsbFxuICogcGxhY2UgdGhlIG1hcCB2aWV3IHdpdGhpbiB0aGUgZGF0YSBwb2ludHMgYm91bmRhcmllc1xuICogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLnJlYWRPbmx5IGBkZWZhdWx0OiBmYWxzZWAgaWYgYHJlYWRPbmx5YCBpcyBzZXQgdG8gYHRydWVgXG4gKiB0aGUgbGVmdCBzZXR0aW5nIHBhbmVsIHdpbGwgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbnMua2VlcEV4aXN0aW5nQ29uZmlnIHdoZXRoZXIgdG8ga2VlcCBleGl0aW5nIGxheWVyIGZpbHRlciBhbmQgaW50ZXJhY3Rpb24gY29uZmlnIGBkZWZhdWx0OiBmYWxzZWAuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbnMuYXV0b0NyZWF0ZUxheWVycyB3aGV0aGVyIHRvIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGxheWVycyBiYXNlZCBvbiBkYXRhc2V0IGNvbHVtbnMgYGRlZmF1bHQ6IHRydWVgLlxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7cmVjZWl2ZU1hcENvbmZpZ30gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICogaW1wb3J0IEtlcGxlckdsU2NoZW1hIGZyb20gJ2tlcGxlci5nbC9zY2hlbWFzJztcbiAqXG4gKiBjb25zdCBwYXJzZWRDb25maWcgPSBLZXBsZXJHbFNjaGVtYS5wYXJzZVNhdmVkQ29uZmlnKGNvbmZpZyk7XG4gKiB0aGlzLnByb3BzLmRpc3BhdGNoKHJlY2VpdmVNYXBDb25maWcocGFyc2VkQ29uZmlnKSk7XG4gKi9cbmV4cG9ydCBjb25zdCByZWNlaXZlTWFwQ29uZmlnID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlJFQ0VJVkVfTUFQX0NPTkZJRywgKGNvbmZpZywgb3B0aW9ucykgPT4gKHtcbiAgY29uZmlnLFxuICBvcHRpb25zXG59KSk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBrZXBsZXIuZ2wgcmVkdWNlci4gSXQgaXMgdXNlZCB0byBwYXNzIGluIGBtYXBib3hBcGlBY2Nlc3NUb2tlbmAgdG8gYG1hcFN0eWxlYCByZWR1Y2VyLlxuICogQG1lbWJlcm9mIG1haW5cbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gKiBAcGFyYW0gcGF5bG9hZC5tYXBib3hBcGlBY2Nlc3NUb2tlbiAtIG1hcGJveEFwaUFjY2Vzc1Rva2VuIHRvIGJlIHNhdmVkIHRvIG1hcFN0eWxlIHJlZHVjZXJcbiAqIEBwYXJhbSBwYXlsb2FkLm1hcGJveEFwaVVybCAtIG1hcGJveEFwaVVybCB0byBiZSBzYXZlZCB0byBtYXBTdHlsZSByZWR1Y2VyLlxuICogQHBhcmFtIHBheWxvYWQubWFwU3R5bGVzUmVwbGFjZURlZmF1bHQgLSBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCB0byBiZSBzYXZlZCB0byBtYXBTdHlsZSByZWR1Y2VyXG4gKiBAcGFyYW0gcGF5bG9hZC5pbml0aWFsVWlTdGF0ZSAtIGluaXRpYWwgdWkgc3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2FjdGlvbnMnKS5rZXBsZXJHbEluaXR9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBrZXBsZXJHbEluaXQgPSBjcmVhdGVBY3Rpb24oXG4gIEFjdGlvblR5cGVzLklOSVQsXG4gIC8vIEB0cy1pZ25vcmVcbiAgcGF5bG9hZCA9PiBwYXlsb2FkXG4pO1xuXG4vKipcbiAqIFRoaXMgZGVjbGFyYXRpb24gaXMgbmVlZGVkIHRvIGdyb3VwIGFjdGlvbnMgaW4gZG9jc1xuICovXG4vKipcbiAqIE1haW4ga2VwbGVyLmdsIGFjdGlvbnMsIHRoZXNlIGFjdGlvbnMgaGFuZGxlcyBsb2FkaW5nIGRhdGEgYW5kIGNvbmZpZyBpbnRvIGtlcGxlci5nbCByZWR1Y2VyLiBUaGVzZSBhY3Rpb25zXG4gKiBpcyBsaXN0ZW5lZCBieSBhbGwgc3VicmVkdWNlcnMsXG4gKiBAcHVibGljXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5jb25zdCBtYWluID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiJdfQ==