"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDataToMapComposed = exports.loadFilesSuccessUpdater = exports.addDataToMapUpdater = exports.defaultAddDataToMapOptions = exports.isValidConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _uiStateUpdaters = require("./ui-state-updaters");

var _visStateUpdaters = require("./vis-state-updaters");

var _mapStateUpdaters = require("./map-state-updaters");

var _mapStyleUpdaters = require("./map-style-updaters");

var _dataUtils = require("../utils/data-utils");

var _utils = require("../utils/utils");

var _fileHandler = require("../processors/file-handler");

var _composerHelpers = require("./composer-helpers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
var combinedUpdaters = null;
/* eslint-enable no-unused-vars */

var isValidConfig = function isValidConfig(config) {
  return (0, _utils.isPlainObject)(config) && (0, _utils.isPlainObject)(config.config) && config.version;
};

exports.isValidConfig = isValidConfig;
var defaultAddDataToMapOptions = {
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

exports.defaultAddDataToMapOptions = defaultAddDataToMapOptions;

var addDataToMapUpdater = function addDataToMapUpdater(state, _ref) {
  var payload = _ref.payload;
  var datasets = payload.datasets,
      config = payload.config,
      info = payload.info;

  var options = _objectSpread(_objectSpread({}, defaultAddDataToMapOptions), payload.options);

  var parsedConfig = config;

  if (isValidConfig(config)) {
    // if passed in saved config
    parsedConfig = state.visState.schema.parseSavedConfig(config);
  }

  var oldLayers = state.visState.layers;

  var filterNewlyAddedLayers = function filterNewlyAddedLayers(layers) {
    return layers.filter(function (nl) {
      return !oldLayers.find(function (ol) {
        return ol === nl;
      });
    });
  }; // Returns undefined if not found, to make typescript happy


  var findMapBoundsIfCentered = function findMapBoundsIfCentered(layers) {
    var bounds = options.centerMap && (0, _dataUtils.findMapBounds)(layers);
    return bounds ? bounds : undefined;
  };

  return (0, _composerHelpers.compose_)([(0, _composerHelpers.pick_)('visState')((0, _composerHelpers.apply_)(_visStateUpdaters.updateVisDataUpdater, {
    datasets: datasets,
    options: options,
    config: parsedConfig
  })), (0, _composerHelpers.if_)(info, (0, _composerHelpers.pick_)('visState')((0, _composerHelpers.apply_)(_visStateUpdaters.setMapInfoUpdater, {
    info: info
  }))), (0, _composerHelpers.with_)(function (_ref2) {
    var visState = _ref2.visState;
    return (0, _composerHelpers.pick_)('mapState')((0, _composerHelpers.apply_)(_mapStateUpdaters.receiveMapConfigUpdater, (0, _composerHelpers.payload_)({
      config: parsedConfig,
      options: options,
      bounds: findMapBoundsIfCentered(filterNewlyAddedLayers(visState.layers))
    })));
  }), (0, _composerHelpers.pick_)('mapStyle')((0, _composerHelpers.apply_)(_mapStyleUpdaters.receiveMapConfigUpdater, (0, _composerHelpers.payload_)({
    config: parsedConfig,
    options: options
  }))), (0, _composerHelpers.pick_)('uiState')((0, _composerHelpers.apply_)(_uiStateUpdaters.loadFilesSuccessUpdater, (0, _composerHelpers.payload_)(null))), (0, _composerHelpers.pick_)('uiState')((0, _composerHelpers.apply_)(_uiStateUpdaters.toggleModalUpdater, (0, _composerHelpers.payload_)(null))), (0, _composerHelpers.pick_)('uiState')((0, _composerHelpers.merge_)(options.hasOwnProperty('readOnly') ? {
    readOnly: options.readOnly
  } : {}))])(state);
};
/**
 * @type {typeof import('./combined-updaters').loadFilesSuccessUpdater}
 */


exports.addDataToMapUpdater = addDataToMapUpdater;

var loadFilesSuccessUpdater = function loadFilesSuccessUpdater(state, action) {
  // still more to load
  var payloads = (0, _fileHandler.filesToDataPayload)(action.result);
  var nextState = (0, _composerHelpers.compose_)([(0, _composerHelpers.pick_)('visState')((0, _composerHelpers.merge_)({
    fileLoading: false,
    fileLoadingProgress: {}
  }))])(state); // make multiple add data to map calls

  var stateWithData = (0, _composerHelpers.compose_)(payloads.map(function (p) {
    return (0, _composerHelpers.apply_)(addDataToMapUpdater, (0, _composerHelpers.payload_)(p));
  }))(nextState);
  return stateWithData;
};

exports.loadFilesSuccessUpdater = loadFilesSuccessUpdater;
var addDataToMapComposed = addDataToMapUpdater;
exports.addDataToMapComposed = addDataToMapComposed;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21iaW5lZC11cGRhdGVycy5qcyJdLCJuYW1lcyI6WyJjb21iaW5lZFVwZGF0ZXJzIiwiaXNWYWxpZENvbmZpZyIsImNvbmZpZyIsInZlcnNpb24iLCJkZWZhdWx0QWRkRGF0YVRvTWFwT3B0aW9ucyIsImNlbnRlck1hcCIsImtlZXBFeGlzdGluZ0NvbmZpZyIsImF1dG9DcmVhdGVMYXllcnMiLCJhZGREYXRhVG9NYXBVcGRhdGVyIiwic3RhdGUiLCJwYXlsb2FkIiwiZGF0YXNldHMiLCJpbmZvIiwib3B0aW9ucyIsInBhcnNlZENvbmZpZyIsInZpc1N0YXRlIiwic2NoZW1hIiwicGFyc2VTYXZlZENvbmZpZyIsIm9sZExheWVycyIsImxheWVycyIsImZpbHRlck5ld2x5QWRkZWRMYXllcnMiLCJmaWx0ZXIiLCJubCIsImZpbmQiLCJvbCIsImZpbmRNYXBCb3VuZHNJZkNlbnRlcmVkIiwiYm91bmRzIiwidW5kZWZpbmVkIiwidmlzU3RhdGVVcGRhdGVWaXNEYXRhVXBkYXRlciIsInNldE1hcEluZm9VcGRhdGVyIiwic3RhdGVNYXBDb25maWdVcGRhdGVyIiwic3R5bGVNYXBDb25maWdVcGRhdGVyIiwidWlTdGF0ZUxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyIiwidG9nZ2xlTW9kYWxVcGRhdGVyIiwiaGFzT3duUHJvcGVydHkiLCJyZWFkT25seSIsImxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyIiwiYWN0aW9uIiwicGF5bG9hZHMiLCJyZXN1bHQiLCJuZXh0U3RhdGUiLCJmaWxlTG9hZGluZyIsImZpbGVMb2FkaW5nUHJvZ3Jlc3MiLCJzdGF0ZVdpdGhEYXRhIiwibWFwIiwicCIsImFkZERhdGFUb01hcENvbXBvc2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFJQTs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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SUFBQUEsbUJBQW1CLEVBQUU7QUFGaEIsR0FBUCxDQURGLENBRHlCLENBQVQsRUFPZmpDLEtBUGUsQ0FBbEIsQ0FId0QsQ0FXeEQ7O0FBQ0EsTUFBTWtDLGFBQWEsR0FBRywrQkFBU0wsUUFBUSxDQUFDTSxHQUFULENBQWEsVUFBQUMsQ0FBQztBQUFBLFdBQUksNkJBQU9yQyxtQkFBUCxFQUE0QiwrQkFBU3FDLENBQVQsQ0FBNUIsQ0FBSjtBQUFBLEdBQWQsQ0FBVCxFQUNwQkwsU0FEb0IsQ0FBdEI7QUFHQSxTQUFPRyxhQUFQO0FBQ0QsQ0FoQk07OztBQWtCQSxJQUFNRyxvQkFBb0IsR0FBR3RDLG1CQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7XG4gIHRvZ2dsZU1vZGFsVXBkYXRlcixcbiAgbG9hZEZpbGVzU3VjY2Vzc1VwZGF0ZXIgYXMgdWlTdGF0ZUxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyXG59IGZyb20gJy4vdWktc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHtcbiAgdXBkYXRlVmlzRGF0YVVwZGF0ZXIgYXMgdmlzU3RhdGVVcGRhdGVWaXNEYXRhVXBkYXRlcixcbiAgc2V0TWFwSW5mb1VwZGF0ZXJcbn0gZnJvbSAnLi92aXMtc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHtyZWNlaXZlTWFwQ29uZmlnVXBkYXRlciBhcyBzdGF0ZU1hcENvbmZpZ1VwZGF0ZXJ9IGZyb20gJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJztcbmltcG9ydCB7cmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgYXMgc3R5bGVNYXBDb25maWdVcGRhdGVyfSBmcm9tICcuL21hcC1zdHlsZS11cGRhdGVycyc7XG5pbXBvcnQge2ZpbmRNYXBCb3VuZHN9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IHtpc1BsYWluT2JqZWN0fSBmcm9tICd1dGlscy91dGlscyc7XG5pbXBvcnQge2ZpbGVzVG9EYXRhUGF5bG9hZH0gZnJvbSAncHJvY2Vzc29ycy9maWxlLWhhbmRsZXInO1xuaW1wb3J0IHtwYXlsb2FkXywgYXBwbHlfLCB3aXRoXywgaWZfLCBjb21wb3NlXywgbWVyZ2VfLCBwaWNrX30gZnJvbSAnLi9jb21wb3Nlci1oZWxwZXJzJztcblxuLy8gY29tcG9zZSBhY3Rpb24gdG8gYXBwbHkgcmVzdWx0IG11bHRpcGxlIHJlZHVjZXJzLCB3aXRoIHRoZSBvdXRwdXQgb2Ygb25lXG5cbi8qKlxuICogU29tZSBhY3Rpb25zIHdpbGwgYWZmZWN0IHRoZSBlbnRpcmUga2VwbGVyLmxnIGluc3RhbmNlIHN0YXRlLlxuICogVGhlIHVwZGF0ZXJzIGZvciB0aGVzZSBhY3Rpb25zIGlzIGV4cG9ydGVkIGFzIGBjb21iaW5lZFVwZGF0ZXJzYC4gVGhlc2UgdXBkYXRlciB0YWtlIHRoZSBlbnRpcmUgaW5zdGFuY2Ugc3RhdGVcbiAqIGFzIHRoZSBmaXJzdCBhcmd1bWVudC4gUmVhZCBtb3JlIGFib3V0IFtVc2luZyB1cGRhdGVyc10oLi4vYWR2YW5jZWQtdXNhZ2UvdXNpbmctdXBkYXRlcnMubWQpXG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICpcbiAqIGltcG9ydCBrZXBsZXJHbFJlZHVjZXIsIHtjb21iaW5lZFVwZGF0ZXJzfSBmcm9tICdrZXBsZXIuZ2wvcmVkdWNlcnMnO1xuICogLy8gUm9vdCBSZWR1Y2VyXG4gKiBjb25zdCByZWR1Y2VycyA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gKiAga2VwbGVyR2w6IGtlcGxlckdsUmVkdWNlcixcbiAqICBhcHA6IGFwcFJlZHVjZXJcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGNvbXBvc2VkUmVkdWNlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gKiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICogICAgLy8gYWRkIGRhdGEgdG8gbWFwIGFmdGVyIHJlY2VpdmluZyBkYXRhIGZyb20gcmVtb3RlIHNvdXJjZXNcbiAqICAgIGNhc2UgJ0xPQURfUkVNT1RFX1JFU09VUkNFX1NVQ0NFU1MnOlxuICogICAgICByZXR1cm4ge1xuICogICAgICAgIC4uLnN0YXRlLFxuICogICAgICAgIGtlcGxlckdsOiB7XG4gKiAgICAgICAgICAuLi5zdGF0ZS5rZXBsZXJHbCxcbiAqICAgICAgICAgIC8vIHBhc3MgaW4ga2VwbGVyLmdsIGluc3RhbmNlIHN0YXRlIHRvIGNvbWJpbmVkVXBkYXRlcnNcbiAqICAgICAgICAgIG1hcDogIGNvbWJpbmVkVXBkYXRlcnMuYWRkRGF0YVRvTWFwVXBkYXRlcihcbiAqICAgICAgICAgICBzdGF0ZS5rZXBsZXJHbC5tYXAsXG4gKiAgICAgICAgICAge1xuICogICAgICAgICAgICAgcGF5bG9hZDoge1xuICogICAgICAgICAgICAgICBkYXRhc2V0czogYWN0aW9uLmRhdGFzZXRzLFxuICogICAgICAgICAgICAgICBvcHRpb25zOiB7cmVhZE9ubHk6IHRydWV9LFxuICogICAgICAgICAgICAgICBjb25maWc6IGFjdGlvbi5jb25maWdcbiAqICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgIH1cbiAqICAgICAgICAgIClcbiAqICAgICAgICB9XG4gKiAgICAgIH07XG4gKiAgfVxuICogIHJldHVybiByZWR1Y2VycyhzdGF0ZSwgYWN0aW9uKTtcbiAqIH07XG4gKlxuICogZXhwb3J0IGRlZmF1bHQgY29tcG9zZWRSZWR1Y2VyO1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5jb25zdCBjb21iaW5lZFVwZGF0ZXJzID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuZXhwb3J0IGNvbnN0IGlzVmFsaWRDb25maWcgPSBjb25maWcgPT5cbiAgaXNQbGFpbk9iamVjdChjb25maWcpICYmIGlzUGxhaW5PYmplY3QoY29uZmlnLmNvbmZpZykgJiYgY29uZmlnLnZlcnNpb247XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0QWRkRGF0YVRvTWFwT3B0aW9ucyA9IHtcbiAgY2VudGVyTWFwOiB0cnVlLFxuICBrZWVwRXhpc3RpbmdDb25maWc6IGZhbHNlLFxuICBhdXRvQ3JlYXRlTGF5ZXJzOiB0cnVlXG59O1xuXG4vKipcbiAqIENvbWJpbmUgZGF0YSBhbmQgZnVsbCBjb25maWd1cmF0aW9uIHVwZGF0ZSBpbiBhIHNpbmdsZSBhY3Rpb25cbiAqXG4gKiBAbWVtYmVyb2YgY29tYmluZWRVcGRhdGVyc1xuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIGtlcGxlci5nbCBpbnN0YW5jZSBzdGF0ZSwgY29udGFpbmluZyBhbGwgc3VicmVkdWNlciBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGFjdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbi5wYXlsb2FkIGB7ZGF0YXNldHMsIG9wdGlvbnMsIGNvbmZpZ31gXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQuZGF0YXNldHMgLSAqKipyZXF1aXJlZCoqIGRhdGFzZXRzIGNhbiBiZSBhIGRhdGFzZXQgb3IgYW4gYXJyYXkgb2YgZGF0YXNldHNcbiAqIEVhY2ggZGF0YXNldCBvYmplY3QgbmVlZHMgdG8gaGF2ZSBgaW5mb2AgYW5kIGBkYXRhYCBwcm9wZXJ0eS5cbiAqIEBwYXJhbSBbYWN0aW9uLnBheWxvYWQub3B0aW9uc10gb3B0aW9uIG9iamVjdCBge2NlbnRlck1hcDogdHJ1ZX1gXG4gKiBAcGFyYW0gW2FjdGlvbi5wYXlsb2FkLmNvbmZpZ10gbWFwIGNvbmZpZ1xuICogQHBhcmFtIFthY3Rpb24ucGF5bG9hZC5pbmZvXSBtYXAgaW5mbyBjb250YWlucyB0aXRsZSBhbmQgZGVzY3JpcHRpb25cbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdGFzZXRcbiAqIEBwcm9wZXJ0eSBpbmZvIC1pbmZvIG9mIGEgZGF0YXNldFxuICogQHByb3BlcnR5IGluZm8uaWQgLSBpZCBvZiB0aGlzIGRhdGFzZXQuIElmIGNvbmZpZyBpcyBkZWZpbmVkLCBgaWRgIHNob3VsZCBtYXRjaGVzIHRoZSBgZGF0YUlkYCBpbiBjb25maWcuXG4gKiBAcHJvcGVydHkgaW5mby5sYWJlbCAtIEEgZGlzcGxheSBuYW1lIG9mIHRoaXMgZGF0YXNldFxuICogQHByb3BlcnR5IGRhdGEgLSAqKipyZXF1aXJlZCoqIFRoZSBkYXRhIG9iamVjdCwgaW4gYSB0YWJ1bGFyIGZvcm1hdCB3aXRoIDIgcHJvcGVydGllcyBgZmllbGRzYCBhbmQgYHJvd3NgXG4gKiBAcHJvcGVydHkgZGF0YS5maWVsZHMgLSAqKipyZXF1aXJlZCoqIEFycmF5IG9mIGZpZWxkcyxcbiAqIEBwcm9wZXJ0eSBkYXRhLmZpZWxkcy5uYW1lIC0gKioqcmVxdWlyZWQqKiBOYW1lIG9mIHRoZSBmaWVsZCxcbiAqIEBwcm9wZXJ0eSBkYXRhLnJvd3MgLSAqKipyZXF1aXJlZCoqIEFycmF5IG9mIHJvd3MsIGluIGEgdGFidWxhciBmb3JtYXQgd2l0aCBgZmllbGRzYCBhbmQgYHJvd3NgXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vY29tYmluZWQtdXBkYXRlcnMnKS5hZGREYXRhVG9NYXBVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgYWRkRGF0YVRvTWFwVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWR9KSA9PiB7XG4gIGNvbnN0IHtkYXRhc2V0cywgY29uZmlnLCBpbmZvfSA9IHBheWxvYWQ7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAuLi5kZWZhdWx0QWRkRGF0YVRvTWFwT3B0aW9ucyxcbiAgICAuLi5wYXlsb2FkLm9wdGlvbnNcbiAgfTtcblxuICBsZXQgcGFyc2VkQ29uZmlnID0gY29uZmlnO1xuXG4gIGlmIChpc1ZhbGlkQ29uZmlnKGNvbmZpZykpIHtcbiAgICAvLyBpZiBwYXNzZWQgaW4gc2F2ZWQgY29uZmlnXG4gICAgcGFyc2VkQ29uZmlnID0gc3RhdGUudmlzU3RhdGUuc2NoZW1hLnBhcnNlU2F2ZWRDb25maWcoY29uZmlnKTtcbiAgfVxuICBjb25zdCBvbGRMYXllcnMgPSBzdGF0ZS52aXNTdGF0ZS5sYXllcnM7XG4gIGNvbnN0IGZpbHRlck5ld2x5QWRkZWRMYXllcnMgPSBsYXllcnMgPT4gbGF5ZXJzLmZpbHRlcihubCA9PiAhb2xkTGF5ZXJzLmZpbmQob2wgPT4gb2wgPT09IG5sKSk7XG5cbiAgLy8gUmV0dXJucyB1bmRlZmluZWQgaWYgbm90IGZvdW5kLCB0byBtYWtlIHR5cGVzY3JpcHQgaGFwcHlcbiAgY29uc3QgZmluZE1hcEJvdW5kc0lmQ2VudGVyZWQgPSBsYXllcnMgPT4ge1xuICAgIGNvbnN0IGJvdW5kcyA9IG9wdGlvbnMuY2VudGVyTWFwICYmIGZpbmRNYXBCb3VuZHMobGF5ZXJzKTtcbiAgICByZXR1cm4gYm91bmRzID8gYm91bmRzIDogdW5kZWZpbmVkO1xuICB9O1xuXG4gIHJldHVybiBjb21wb3NlXyhbXG4gICAgcGlja18oJ3Zpc1N0YXRlJykoXG4gICAgICBhcHBseV8odmlzU3RhdGVVcGRhdGVWaXNEYXRhVXBkYXRlciwge1xuICAgICAgICBkYXRhc2V0cyxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgY29uZmlnOiBwYXJzZWRDb25maWdcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIGlmXyhpbmZvLCBwaWNrXygndmlzU3RhdGUnKShhcHBseV8oc2V0TWFwSW5mb1VwZGF0ZXIsIHtpbmZvfSkpKSxcblxuICAgIHdpdGhfKCh7dmlzU3RhdGV9KSA9PlxuICAgICAgcGlja18oJ21hcFN0YXRlJykoXG4gICAgICAgIGFwcGx5XyhcbiAgICAgICAgICBzdGF0ZU1hcENvbmZpZ1VwZGF0ZXIsXG4gICAgICAgICAgcGF5bG9hZF8oe1xuICAgICAgICAgICAgY29uZmlnOiBwYXJzZWRDb25maWcsXG4gICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgYm91bmRzOiBmaW5kTWFwQm91bmRzSWZDZW50ZXJlZChmaWx0ZXJOZXdseUFkZGVkTGF5ZXJzKHZpc1N0YXRlLmxheWVycykpXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICksXG5cbiAgICBwaWNrXygnbWFwU3R5bGUnKShhcHBseV8oc3R5bGVNYXBDb25maWdVcGRhdGVyLCBwYXlsb2FkXyh7Y29uZmlnOiBwYXJzZWRDb25maWcsIG9wdGlvbnN9KSkpLFxuXG4gICAgcGlja18oJ3VpU3RhdGUnKShhcHBseV8odWlTdGF0ZUxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyLCBwYXlsb2FkXyhudWxsKSkpLFxuXG4gICAgcGlja18oJ3VpU3RhdGUnKShhcHBseV8odG9nZ2xlTW9kYWxVcGRhdGVyLCBwYXlsb2FkXyhudWxsKSkpLFxuXG4gICAgcGlja18oJ3VpU3RhdGUnKShtZXJnZV8ob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgncmVhZE9ubHknKSA/IHtyZWFkT25seTogb3B0aW9ucy5yZWFkT25seX0gOiB7fSkpXG4gIF0pKHN0YXRlKTtcbn07XG5cbi8qKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vY29tYmluZWQtdXBkYXRlcnMnKS5sb2FkRmlsZXNTdWNjZXNzVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gc3RpbGwgbW9yZSB0byBsb2FkXG4gIGNvbnN0IHBheWxvYWRzID0gZmlsZXNUb0RhdGFQYXlsb2FkKGFjdGlvbi5yZXN1bHQpO1xuICBjb25zdCBuZXh0U3RhdGUgPSBjb21wb3NlXyhbXG4gICAgcGlja18oJ3Zpc1N0YXRlJykoXG4gICAgICBtZXJnZV8oe1xuICAgICAgICBmaWxlTG9hZGluZzogZmFsc2UsXG4gICAgICAgIGZpbGVMb2FkaW5nUHJvZ3Jlc3M6IHt9XG4gICAgICB9KVxuICAgIClcbiAgXSkoc3RhdGUpO1xuICAvLyBtYWtlIG11bHRpcGxlIGFkZCBkYXRhIHRvIG1hcCBjYWxsc1xuICBjb25zdCBzdGF0ZVdpdGhEYXRhID0gY29tcG9zZV8ocGF5bG9hZHMubWFwKHAgPT4gYXBwbHlfKGFkZERhdGFUb01hcFVwZGF0ZXIsIHBheWxvYWRfKHApKSkpKFxuICAgIG5leHRTdGF0ZVxuICApO1xuICByZXR1cm4gc3RhdGVXaXRoRGF0YTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGREYXRhVG9NYXBDb21wb3NlZCA9IGFkZERhdGFUb01hcFVwZGF0ZXI7XG4iXX0=