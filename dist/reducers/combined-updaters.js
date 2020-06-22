"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDataToMapComposed = exports.loadFileSuccessUpdater = exports.addDataToMapUpdater = exports.defaultAddDataToMapOptions = exports.isValidConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _uiStateUpdaters = require("./ui-state-updaters");

var _visStateUpdaters = require("./vis-state-updaters");

var _mapStateUpdaters = require("./map-state-updaters");

var _mapStyleUpdaters = require("./map-style-updaters");

var _dataUtils = require("../utils/data-utils");

var _schemas = _interopRequireDefault(require("../schemas"));

var _utils = require("../utils/utils");

var _fileHandler = require("../processors/file-handler");

var _console = _interopRequireDefault(require("global/console"));

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
  keepExistingConfig: false
};
exports.defaultAddDataToMapOptions = defaultAddDataToMapOptions;

var identity = function identity(state) {
  return state;
};
/* eslint-disable no-unused-vars */
// @ts-ignore


function log(text) {
  return function (value) {
    return _console["default"].log(text, value);
  };
}
/* eslint-enable no-unused-vars */


function payload_(p) {
  return {
    payload: p
  };
}

function apply_(updater, payload) {
  return function (state) {
    return updater(state, payload);
  };
}

function with_(fn) {
  return function (state) {
    return fn(state)(state);
  };
}

function if_(pred, fn) {
  return pred ? fn : identity;
}

function compose_(fns) {
  return function (state) {
    return fns.reduce(function (state2, fn) {
      return fn(state2);
    }, state);
  };
}

function merge_(obj) {
  return function (state) {
    return _objectSpread({}, state, {}, obj);
  };
}

function pick_(prop) {
  return function (fn) {
    return function (state) {
      return _objectSpread({}, state, (0, _defineProperty2["default"])({}, prop, fn(state[prop])));
    };
  };
}
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


var addDataToMapUpdater = function addDataToMapUpdater(state, _ref) {
  var payload = _ref.payload;
  var datasets = payload.datasets,
      config = payload.config,
      info = payload.info;

  var options = _objectSpread({}, defaultAddDataToMapOptions, {}, payload.options);

  var parsedConfig = config;

  if (isValidConfig(config)) {
    // if passed in saved config
    parsedConfig = _schemas["default"].parseSavedConfig(config);
  }

  var oldLayers = state.visState.layers;

  var filterNewlyAddedLayers = function filterNewlyAddedLayers(layers) {
    return layers.filter(function (nl) {
      return !oldLayers.find(function (ol) {
        return ol === nl;
      });
    });
  };

  return compose_([pick_('visState')(apply_(_visStateUpdaters.updateVisDataUpdater, {
    datasets: datasets,
    options: options,
    config: parsedConfig
  })), if_(info, pick_('visState')(apply_(_visStateUpdaters.setMapInfoUpdater, {
    info: info
  }))), with_(function (_ref2) {
    var visState = _ref2.visState;
    return pick_('mapState')(apply_(_mapStateUpdaters.receiveMapConfigUpdater, payload_({
      config: parsedConfig,
      options: options,
      bounds: options.centerMap ? (0, _dataUtils.findMapBounds)(filterNewlyAddedLayers(visState.layers)) : null
    })));
  }), pick_('mapStyle')(apply_(_mapStyleUpdaters.receiveMapConfigUpdater, payload_({
    config: parsedConfig,
    options: options
  }))), pick_('uiState')(apply_(_uiStateUpdaters.loadFilesSuccessUpdater)), pick_('uiState')(apply_(_uiStateUpdaters.toggleModalUpdater, payload_(null))), pick_('uiState')(merge_(options.hasOwnProperty('readOnly') ? {
    readOnly: options.readOnly
  } : {}))])(state);
};
/**
 * @type {typeof import('./combined-updaters').loadFileSuccessUpdater}
 */


exports.addDataToMapUpdater = addDataToMapUpdater;

var loadFileSuccessUpdater = function loadFileSuccessUpdater(state, action) {
  // still more to load
  var payloads = (0, _fileHandler.filesToDataPayload)(action.result);
  var nextState = compose_([pick_('visState')(merge_({
    fileLoading: false,
    fileLoadingProgress: 100
  }))])(state); // make multiple add data to map calls

  return compose_(payloads.map(function (p) {
    return apply_(addDataToMapUpdater, payload_(p));
  }))(nextState);
};

exports.loadFileSuccessUpdater = loadFileSuccessUpdater;
var addDataToMapComposed = addDataToMapUpdater;
exports.addDataToMapComposed = addDataToMapComposed;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21iaW5lZC11cGRhdGVycy5qcyJdLCJuYW1lcyI6WyJjb21iaW5lZFVwZGF0ZXJzIiwiaXNWYWxpZENvbmZpZyIsImNvbmZpZyIsInZlcnNpb24iLCJkZWZhdWx0QWRkRGF0YVRvTWFwT3B0aW9ucyIsImNlbnRlck1hcCIsImtlZXBFeGlzdGluZ0NvbmZpZyIsImlkZW50aXR5Iiwic3RhdGUiLCJsb2ciLCJ0ZXh0IiwidmFsdWUiLCJDb25zb2xlIiwicGF5bG9hZF8iLCJwIiwicGF5bG9hZCIsImFwcGx5XyIsInVwZGF0ZXIiLCJ3aXRoXyIsImZuIiwiaWZfIiwicHJlZCIsImNvbXBvc2VfIiwiZm5zIiwicmVkdWNlIiwic3RhdGUyIiwibWVyZ2VfIiwib2JqIiwicGlja18iLCJwcm9wIiwiYWRkRGF0YVRvTWFwVXBkYXRlciIsImRhdGFzZXRzIiwiaW5mbyIsIm9wdGlvbnMiLCJwYXJzZWRDb25maWciLCJLZXBsZXJHbFNjaGVtYSIsInBhcnNlU2F2ZWRDb25maWciLCJvbGRMYXllcnMiLCJ2aXNTdGF0ZSIsImxheWVycyIsImZpbHRlck5ld2x5QWRkZWRMYXllcnMiLCJmaWx0ZXIiLCJubCIsImZpbmQiLCJvbCIsInZpc1N0YXRlVXBkYXRlVmlzRGF0YVVwZGF0ZXIiLCJzZXRNYXBJbmZvVXBkYXRlciIsInN0YXRlTWFwQ29uZmlnVXBkYXRlciIsImJvdW5kcyIsInN0eWxlTWFwQ29uZmlnVXBkYXRlciIsImxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyIiwidG9nZ2xlTW9kYWxVcGRhdGVyIiwiaGFzT3duUHJvcGVydHkiLCJyZWFkT25seSIsImxvYWRGaWxlU3VjY2Vzc1VwZGF0ZXIiLCJhY3Rpb24iLCJwYXlsb2FkcyIsInJlc3VsdCIsIm5leHRTdGF0ZSIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdQcm9ncmVzcyIsIm1hcCIsImFkZERhdGFUb01hcENvbXBvc2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztB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QUFtQixFQUFFO0FBRmhCLEdBQUQsQ0FEUixDQUR5QixDQUFELENBQVIsQ0FPZnBELEtBUGUsQ0FBbEIsQ0FIdUQsQ0FZdkQ7O0FBQ0EsU0FBT2MsUUFBUSxDQUFDa0MsUUFBUSxDQUFDSyxHQUFULENBQWEsVUFBQS9DLENBQUM7QUFBQSxXQUFJRSxNQUFNLENBQUNjLG1CQUFELEVBQXNCakIsUUFBUSxDQUFDQyxDQUFELENBQTlCLENBQVY7QUFBQSxHQUFkLENBQUQsQ0FBUixDQUFzRTRDLFNBQXRFLENBQVA7QUFDRCxDQWRNOzs7QUFnQkEsSUFBTUksb0JBQW9CLEdBQUdoQyxtQkFBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge3RvZ2dsZU1vZGFsVXBkYXRlciwgbG9hZEZpbGVzU3VjY2Vzc1VwZGF0ZXJ9IGZyb20gJy4vdWktc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHtcbiAgdXBkYXRlVmlzRGF0YVVwZGF0ZXIgYXMgdmlzU3RhdGVVcGRhdGVWaXNEYXRhVXBkYXRlcixcbiAgc2V0TWFwSW5mb1VwZGF0ZXJcbn0gZnJvbSAnLi92aXMtc3RhdGUtdXBkYXRlcnMnO1xuaW1wb3J0IHtyZWNlaXZlTWFwQ29uZmlnVXBkYXRlciBhcyBzdGF0ZU1hcENvbmZpZ1VwZGF0ZXJ9IGZyb20gJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJztcbmltcG9ydCB7cmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgYXMgc3R5bGVNYXBDb25maWdVcGRhdGVyfSBmcm9tICcuL21hcC1zdHlsZS11cGRhdGVycyc7XG5pbXBvcnQge2ZpbmRNYXBCb3VuZHN9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IEtlcGxlckdsU2NoZW1hIGZyb20gJ3NjaGVtYXMnO1xuaW1wb3J0IHtpc1BsYWluT2JqZWN0fSBmcm9tICd1dGlscy91dGlscyc7XG5pbXBvcnQge2ZpbGVzVG9EYXRhUGF5bG9hZH0gZnJvbSAncHJvY2Vzc29ycy9maWxlLWhhbmRsZXInO1xuaW1wb3J0IENvbnNvbGUgZnJvbSAnZ2xvYmFsL2NvbnNvbGUnO1xuXG4vLyBjb21wb3NlIGFjdGlvbiB0byBhcHBseSByZXN1bHQgbXVsdGlwbGUgcmVkdWNlcnMsIHdpdGggdGhlIG91dHB1dCBvZiBvbmVcblxuLyoqXG4gKiBTb21lIGFjdGlvbnMgd2lsbCBhZmZlY3QgdGhlIGVudGlyZSBrZXBsZXIubGcgaW5zdGFuY2Ugc3RhdGUuXG4gKiBUaGUgdXBkYXRlcnMgZm9yIHRoZXNlIGFjdGlvbnMgaXMgZXhwb3J0ZWQgYXMgYGNvbWJpbmVkVXBkYXRlcnNgLiBUaGVzZSB1cGRhdGVyIHRha2UgdGhlIGVudGlyZSBpbnN0YW5jZSBzdGF0ZVxuICogYXMgdGhlIGZpcnN0IGFyZ3VtZW50LiBSZWFkIG1vcmUgYWJvdXQgW1VzaW5nIHVwZGF0ZXJzXSguLi9hZHZhbmNlZC11c2FnZS91c2luZy11cGRhdGVycy5tZClcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKlxuICogaW1wb3J0IGtlcGxlckdsUmVkdWNlciwge2NvbWJpbmVkVXBkYXRlcnN9IGZyb20gJ2tlcGxlci5nbC9yZWR1Y2Vycyc7XG4gKiAvLyBSb290IFJlZHVjZXJcbiAqIGNvbnN0IHJlZHVjZXJzID0gY29tYmluZVJlZHVjZXJzKHtcbiAqICBrZXBsZXJHbDoga2VwbGVyR2xSZWR1Y2VyLFxuICogIGFwcDogYXBwUmVkdWNlclxuICogfSk7XG4gKlxuICogY29uc3QgY29tcG9zZWRSZWR1Y2VyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAqICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gKiAgICAvLyBhZGQgZGF0YSB0byBtYXAgYWZ0ZXIgcmVjZWl2aW5nIGRhdGEgZnJvbSByZW1vdGUgc291cmNlc1xuICogICAgY2FzZSAnTE9BRF9SRU1PVEVfUkVTT1VSQ0VfU1VDQ0VTUyc6XG4gKiAgICAgIHJldHVybiB7XG4gKiAgICAgICAgLi4uc3RhdGUsXG4gKiAgICAgICAga2VwbGVyR2w6IHtcbiAqICAgICAgICAgIC4uLnN0YXRlLmtlcGxlckdsLFxuICogICAgICAgICAgLy8gcGFzcyBpbiBrZXBsZXIuZ2wgaW5zdGFuY2Ugc3RhdGUgdG8gY29tYmluZWRVcGRhdGVyc1xuICogICAgICAgICAgbWFwOiAgY29tYmluZWRVcGRhdGVycy5hZGREYXRhVG9NYXBVcGRhdGVyKFxuICogICAgICAgICAgIHN0YXRlLmtlcGxlckdsLm1hcCxcbiAqICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gKiAgICAgICAgICAgICAgIGRhdGFzZXRzOiBhY3Rpb24uZGF0YXNldHMsXG4gKiAgICAgICAgICAgICAgIG9wdGlvbnM6IHtyZWFkT25seTogdHJ1ZX0sXG4gKiAgICAgICAgICAgICAgIGNvbmZpZzogYWN0aW9uLmNvbmZpZ1xuICogICAgICAgICAgICAgIH1cbiAqICAgICAgICAgICAgfVxuICogICAgICAgICAgKVxuICogICAgICAgIH1cbiAqICAgICAgfTtcbiAqICB9XG4gKiAgcmV0dXJuIHJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pO1xuICogfTtcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21wb3NlZFJlZHVjZXI7XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IGNvbWJpbmVkVXBkYXRlcnMgPSBudWxsO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5leHBvcnQgY29uc3QgaXNWYWxpZENvbmZpZyA9IGNvbmZpZyA9PlxuICBpc1BsYWluT2JqZWN0KGNvbmZpZykgJiYgaXNQbGFpbk9iamVjdChjb25maWcuY29uZmlnKSAmJiBjb25maWcudmVyc2lvbjtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRBZGREYXRhVG9NYXBPcHRpb25zID0ge1xuICBjZW50ZXJNYXA6IHRydWUsXG4gIGtlZXBFeGlzdGluZ0NvbmZpZzogZmFsc2Vcbn07XG5cbmNvbnN0IGlkZW50aXR5ID0gc3RhdGUgPT4gc3RhdGU7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5mdW5jdGlvbiBsb2codGV4dCkge1xuICByZXR1cm4gdmFsdWUgPT4gQ29uc29sZS5sb2codGV4dCwgdmFsdWUpO1xufVxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5mdW5jdGlvbiBwYXlsb2FkXyhwKSB7XG4gIHJldHVybiB7cGF5bG9hZDogcH07XG59XG5cbmZ1bmN0aW9uIGFwcGx5Xyh1cGRhdGVyLCBwYXlsb2FkKSB7XG4gIHJldHVybiBzdGF0ZSA9PiB1cGRhdGVyKHN0YXRlLCBwYXlsb2FkKTtcbn1cblxuZnVuY3Rpb24gd2l0aF8oZm4pIHtcbiAgcmV0dXJuIHN0YXRlID0+IGZuKHN0YXRlKShzdGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGlmXyhwcmVkLCBmbikge1xuICByZXR1cm4gcHJlZCA/IGZuIDogaWRlbnRpdHk7XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VfKGZucykge1xuICByZXR1cm4gc3RhdGUgPT4gZm5zLnJlZHVjZSgoc3RhdGUyLCBmbikgPT4gZm4oc3RhdGUyKSwgc3RhdGUpO1xufVxuXG5mdW5jdGlvbiBtZXJnZV8ob2JqKSB7XG4gIHJldHVybiBzdGF0ZSA9PiAoey4uLnN0YXRlLCAuLi5vYmp9KTtcbn1cblxuZnVuY3Rpb24gcGlja18ocHJvcCkge1xuICByZXR1cm4gZm4gPT4gc3RhdGUgPT4gKHsuLi5zdGF0ZSwgW3Byb3BdOiBmbihzdGF0ZVtwcm9wXSl9KTtcbn1cblxuLyoqXG4gKiBDb21iaW5lIGRhdGEgYW5kIGZ1bGwgY29uZmlndXJhdGlvbiB1cGRhdGUgaW4gYSBzaW5nbGUgYWN0aW9uXG4gKlxuICogQG1lbWJlcm9mIGNvbWJpbmVkVXBkYXRlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBrZXBsZXIuZ2wgaW5zdGFuY2Ugc3RhdGUsIGNvbnRhaW5pbmcgYWxsIHN1YnJlZHVjZXIgc3RhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24ucGF5bG9hZCBge2RhdGFzZXRzLCBvcHRpb25zLCBjb25maWd9YFxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkLmRhdGFzZXRzIC0gKioqcmVxdWlyZWQqKiBkYXRhc2V0cyBjYW4gYmUgYSBkYXRhc2V0IG9yIGFuIGFycmF5IG9mIGRhdGFzZXRzXG4gKiBFYWNoIGRhdGFzZXQgb2JqZWN0IG5lZWRzIHRvIGhhdmUgYGluZm9gIGFuZCBgZGF0YWAgcHJvcGVydHkuXG4gKiBAcGFyYW0gW2FjdGlvbi5wYXlsb2FkLm9wdGlvbnNdIG9wdGlvbiBvYmplY3QgYHtjZW50ZXJNYXA6IHRydWV9YFxuICogQHBhcmFtIFthY3Rpb24ucGF5bG9hZC5jb25maWddIG1hcCBjb25maWdcbiAqIEBwYXJhbSBbYWN0aW9uLnBheWxvYWQuaW5mb10gbWFwIGluZm8gY29udGFpbnMgdGl0bGUgYW5kIGRlc2NyaXB0aW9uXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRhc2V0XG4gKiBAcHJvcGVydHkgaW5mbyAtaW5mbyBvZiBhIGRhdGFzZXRcbiAqIEBwcm9wZXJ0eSBpbmZvLmlkIC0gaWQgb2YgdGhpcyBkYXRhc2V0LiBJZiBjb25maWcgaXMgZGVmaW5lZCwgYGlkYCBzaG91bGQgbWF0Y2hlcyB0aGUgYGRhdGFJZGAgaW4gY29uZmlnLlxuICogQHByb3BlcnR5IGluZm8ubGFiZWwgLSBBIGRpc3BsYXkgbmFtZSBvZiB0aGlzIGRhdGFzZXRcbiAqIEBwcm9wZXJ0eSBkYXRhIC0gKioqcmVxdWlyZWQqKiBUaGUgZGF0YSBvYmplY3QsIGluIGEgdGFidWxhciBmb3JtYXQgd2l0aCAyIHByb3BlcnRpZXMgYGZpZWxkc2AgYW5kIGByb3dzYFxuICogQHByb3BlcnR5IGRhdGEuZmllbGRzIC0gKioqcmVxdWlyZWQqKiBBcnJheSBvZiBmaWVsZHMsXG4gKiBAcHJvcGVydHkgZGF0YS5maWVsZHMubmFtZSAtICoqKnJlcXVpcmVkKiogTmFtZSBvZiB0aGUgZmllbGQsXG4gKiBAcHJvcGVydHkgZGF0YS5yb3dzIC0gKioqcmVxdWlyZWQqKiBBcnJheSBvZiByb3dzLCBpbiBhIHRhYnVsYXIgZm9ybWF0IHdpdGggYGZpZWxkc2AgYW5kIGByb3dzYFxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2NvbWJpbmVkLXVwZGF0ZXJzJykuYWRkRGF0YVRvTWFwVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGFkZERhdGFUb01hcFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkfSkgPT4ge1xuICBjb25zdCB7ZGF0YXNldHMsIGNvbmZpZywgaW5mb30gPSBwYXlsb2FkO1xuXG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgLi4uZGVmYXVsdEFkZERhdGFUb01hcE9wdGlvbnMsXG4gICAgLi4ucGF5bG9hZC5vcHRpb25zXG4gIH07XG5cbiAgbGV0IHBhcnNlZENvbmZpZyA9IGNvbmZpZztcblxuICBpZiAoaXNWYWxpZENvbmZpZyhjb25maWcpKSB7XG4gICAgLy8gaWYgcGFzc2VkIGluIHNhdmVkIGNvbmZpZ1xuICAgIHBhcnNlZENvbmZpZyA9IEtlcGxlckdsU2NoZW1hLnBhcnNlU2F2ZWRDb25maWcoY29uZmlnKTtcbiAgfVxuICBjb25zdCBvbGRMYXllcnMgPSBzdGF0ZS52aXNTdGF0ZS5sYXllcnM7XG4gIGNvbnN0IGZpbHRlck5ld2x5QWRkZWRMYXllcnMgPSBsYXllcnMgPT4gbGF5ZXJzLmZpbHRlcihubCA9PiAhb2xkTGF5ZXJzLmZpbmQob2wgPT4gb2wgPT09IG5sKSk7XG5cbiAgcmV0dXJuIGNvbXBvc2VfKFtcbiAgICBwaWNrXygndmlzU3RhdGUnKShcbiAgICAgIGFwcGx5Xyh2aXNTdGF0ZVVwZGF0ZVZpc0RhdGFVcGRhdGVyLCB7XG4gICAgICAgIGRhdGFzZXRzLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICBjb25maWc6IHBhcnNlZENvbmZpZ1xuICAgICAgfSlcbiAgICApLFxuXG4gICAgaWZfKGluZm8sIHBpY2tfKCd2aXNTdGF0ZScpKGFwcGx5XyhzZXRNYXBJbmZvVXBkYXRlciwge2luZm99KSkpLFxuXG4gICAgd2l0aF8oKHt2aXNTdGF0ZX0pID0+XG4gICAgICBwaWNrXygnbWFwU3RhdGUnKShcbiAgICAgICAgYXBwbHlfKFxuICAgICAgICAgIHN0YXRlTWFwQ29uZmlnVXBkYXRlcixcbiAgICAgICAgICBwYXlsb2FkXyh7XG4gICAgICAgICAgICBjb25maWc6IHBhcnNlZENvbmZpZyxcbiAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICBib3VuZHM6IG9wdGlvbnMuY2VudGVyTWFwXG4gICAgICAgICAgICAgID8gZmluZE1hcEJvdW5kcyhmaWx0ZXJOZXdseUFkZGVkTGF5ZXJzKHZpc1N0YXRlLmxheWVycykpXG4gICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApLFxuXG4gICAgcGlja18oJ21hcFN0eWxlJykoYXBwbHlfKHN0eWxlTWFwQ29uZmlnVXBkYXRlciwgcGF5bG9hZF8oe2NvbmZpZzogcGFyc2VkQ29uZmlnLCBvcHRpb25zfSkpKSxcblxuICAgIHBpY2tfKCd1aVN0YXRlJykoYXBwbHlfKGxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyKSksXG5cbiAgICBwaWNrXygndWlTdGF0ZScpKGFwcGx5Xyh0b2dnbGVNb2RhbFVwZGF0ZXIsIHBheWxvYWRfKG51bGwpKSksXG5cbiAgICBwaWNrXygndWlTdGF0ZScpKG1lcmdlXyhvcHRpb25zLmhhc093blByb3BlcnR5KCdyZWFkT25seScpID8ge3JlYWRPbmx5OiBvcHRpb25zLnJlYWRPbmx5fSA6IHt9KSlcbiAgXSkoc3RhdGUpO1xufTtcblxuLyoqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9jb21iaW5lZC11cGRhdGVycycpLmxvYWRGaWxlU3VjY2Vzc1VwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkRmlsZVN1Y2Nlc3NVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gc3RpbGwgbW9yZSB0byBsb2FkXG4gIGNvbnN0IHBheWxvYWRzID0gZmlsZXNUb0RhdGFQYXlsb2FkKGFjdGlvbi5yZXN1bHQpO1xuICBjb25zdCBuZXh0U3RhdGUgPSBjb21wb3NlXyhbXG4gICAgcGlja18oJ3Zpc1N0YXRlJykoXG4gICAgICBtZXJnZV8oe1xuICAgICAgICBmaWxlTG9hZGluZzogZmFsc2UsXG4gICAgICAgIGZpbGVMb2FkaW5nUHJvZ3Jlc3M6IDEwMFxuICAgICAgfSlcbiAgICApXG4gIF0pKHN0YXRlKTtcblxuICAvLyBtYWtlIG11bHRpcGxlIGFkZCBkYXRhIHRvIG1hcCBjYWxsc1xuICByZXR1cm4gY29tcG9zZV8ocGF5bG9hZHMubWFwKHAgPT4gYXBwbHlfKGFkZERhdGFUb01hcFVwZGF0ZXIsIHBheWxvYWRfKHApKSkpKG5leHRTdGF0ZSk7XG59O1xuXG5leHBvcnQgY29uc3QgYWRkRGF0YVRvTWFwQ29tcG9zZWQgPSBhZGREYXRhVG9NYXBVcGRhdGVyO1xuIl19