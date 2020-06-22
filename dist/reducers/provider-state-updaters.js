"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedMapsErrorUpdater = exports.getSavedMapsSuccessUpdater = exports.getSavedMapsUpdater = exports.setCloudProviderUpdater = exports.resetProviderStatusUpdater = exports.loadCloudMapErrorUpdater = exports.loadCloudMapSuccessUpdater = exports.loadCloudMapUpdater = exports.exportFileErrorUpdater = exports.postSaveLoadSuccessUpdater = exports.exportFileSuccessUpdater = exports.exportFileToCloudUpdater = exports.INITIAL_PROVIDER_STATE = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _tasks = require("react-palm/tasks");

var _console = _interopRequireDefault(require("global/console"));

var _utils = require("../utils/utils");

var _tasks2 = require("../tasks/tasks");

var _providerActions = require("../actions/provider-actions");

var _uiStateActions = require("../actions/ui-state-actions");

var _actions = require("../actions/actions");

var _defaultSettings = require("../constants/default-settings");

var _schemas = _interopRequireDefault(require("../schemas"));

var _dataProcessor = require("../processors/data-processor");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var INITIAL_PROVIDER_STATE = {
  isProviderLoading: false,
  isCloudMapLoading: false,
  providerError: null,
  currentProvider: null,
  successInfo: {},
  mapSaved: null,
  visualizations: []
};
exports.INITIAL_PROVIDER_STATE = INITIAL_PROVIDER_STATE;

function createActionTask(action, payload) {
  if (typeof action === 'function') {
    return (0, _tasks2.ACTION_TASK)().map(function (_) {
      return action(payload);
    });
  }

  return null;
}

function _validateProvider(provider, method) {
  if (!provider) {
    _console["default"].error("provider is not defined");

    return false;
  }

  if (typeof provider[method] !== 'function') {
    _console["default"].error("".concat(method, " is not a function of Cloud provider: ").concat(provider.name));

    return false;
  }

  return true;
}
/**
 * @type {typeof import('./provider-state-updaters').createGlobalNotificationTasks}
 */


function createGlobalNotificationTasks(_ref) {
  var type = _ref.type,
      message = _ref.message,
      _ref$delayClose = _ref.delayClose,
      delayClose = _ref$delayClose === void 0 ? true : _ref$delayClose;
  var id = (0, _utils.generateHashId)();
  var successNote = {
    id: id,
    type: _defaultSettings.DEFAULT_NOTIFICATION_TYPES[type] || _defaultSettings.DEFAULT_NOTIFICATION_TYPES.success,
    topic: _defaultSettings.DEFAULT_NOTIFICATION_TOPICS.global,
    message: message
  };
  var task = (0, _tasks2.ACTION_TASK)().map(function (_) {
    return (0, _uiStateActions.addNotification)(successNote);
  });
  return delayClose ? [task, (0, _tasks2.DELAY_TASK)(3000).map(function (_) {
    return (0, _uiStateActions.removeNotification)(id);
  })] : [task];
}
/**
 * This method will export the current kepler config file to the chosen cloud proder
 * add returns a share URL
 *
 * @type {typeof import('./provider-state-updaters').exportFileToCloudUpdater}
 */


var exportFileToCloudUpdater = function exportFileToCloudUpdater(state, action) {
  var _action$payload = action.payload,
      mapData = _action$payload.mapData,
      provider = _action$payload.provider,
      _action$payload$optio = _action$payload.options,
      options = _action$payload$optio === void 0 ? {} : _action$payload$optio,
      onSuccess = _action$payload.onSuccess,
      onError = _action$payload.onError,
      closeModal = _action$payload.closeModal;

  if (!_validateProvider(provider, 'uploadMap')) {
    return state;
  }

  var newState = _objectSpread({}, state, {
    isProviderLoading: true,
    currentProvider: provider.name
  }); // payload called by provider.uploadMap


  var payload = {
    mapData: mapData,
    options: options
  };
  var uploadFileTask = (0, _tasks2.EXPORT_FILE_TO_CLOUD_TASK)({
    provider: provider,
    payload: payload
  }).bimap( // success
  function (response) {
    return (0, _providerActions.exportFileSuccess)({
      response: response,
      provider: provider,
      options: options,
      onSuccess: onSuccess,
      closeModal: closeModal
    });
  }, // error
  function (error) {
    return (0, _providerActions.exportFileError)({
      error: error,
      provider: provider,
      options: options,
      onError: onError
    });
  });
  return (0, _tasks.withTask)(newState, uploadFileTask);
};
/**
 *
 * @type {typeof import('./provider-state-updaters').exportFileSuccessUpdater}
 */


exports.exportFileToCloudUpdater = exportFileToCloudUpdater;

var exportFileSuccessUpdater = function exportFileSuccessUpdater(state, action) {
  var _action$payload2 = action.payload,
      response = _action$payload2.response,
      provider = _action$payload2.provider,
      _action$payload2$opti = _action$payload2.options,
      options = _action$payload2$opti === void 0 ? {} : _action$payload2$opti,
      onSuccess = _action$payload2.onSuccess,
      closeModal = _action$payload2.closeModal;

  var newState = _objectSpread({}, state, {
    isProviderLoading: false,
    // TODO: do we always have to store this?
    successInfo: response
  }, !options.isPublic ? {
    mapSaved: provider.name
  } : {});

  var tasks = [createActionTask(onSuccess, {
    response: response,
    provider: provider,
    options: options
  }), closeModal && (0, _tasks2.ACTION_TASK)().map(function (_) {
    return (0, _providerActions.postSaveLoadSuccess)("Map saved to ".concat(state.currentProvider, "!"));
  })].filter(function (d) {
    return d;
  });
  return tasks.length ? (0, _tasks.withTask)(newState, tasks) : newState;
};
/**
 * Close modal on success and display notification
 * @type {typeof import('./provider-state-updaters').postSaveLoadSuccessUpdater}
 */


exports.exportFileSuccessUpdater = exportFileSuccessUpdater;

var postSaveLoadSuccessUpdater = function postSaveLoadSuccessUpdater(state, action) {
  var message = action.payload || "Saved / Load to ".concat(state.currentProvider, " Success");
  var tasks = [(0, _tasks2.ACTION_TASK)().map(function (_) {
    return (0, _uiStateActions.toggleModal)(null);
  }), (0, _tasks2.ACTION_TASK)().map(function (_) {
    return (0, _providerActions.resetProviderStatus)();
  })].concat((0, _toConsumableArray2["default"])(createGlobalNotificationTasks({
    message: message
  })));
  return (0, _tasks.withTask)(state, tasks);
};
/**
 *
 * @type {typeof import('./provider-state-updaters').exportFileErrorUpdater}
 */


exports.postSaveLoadSuccessUpdater = postSaveLoadSuccessUpdater;

var exportFileErrorUpdater = function exportFileErrorUpdater(state, action) {
  var _action$payload3 = action.payload,
      error = _action$payload3.error,
      provider = _action$payload3.provider,
      onError = _action$payload3.onError;

  var newState = _objectSpread({}, state, {
    isProviderLoading: false,
    providerError: (0, _utils.getError)(error)
  });

  var task = createActionTask(onError, {
    error: error,
    provider: provider
  });
  return task ? (0, _tasks.withTask)(newState, task) : newState;
};

exports.exportFileErrorUpdater = exportFileErrorUpdater;

var loadCloudMapUpdater = function loadCloudMapUpdater(state, action) {
  var _action$payload4 = action.payload,
      loadParams = _action$payload4.loadParams,
      provider = _action$payload4.provider,
      onSuccess = _action$payload4.onSuccess,
      onError = _action$payload4.onError;

  if (!loadParams) {
    _console["default"].warn('load map error: loadParams is undefined');

    return state;
  }

  if (!_validateProvider(provider, 'downloadMap')) {
    return state;
  }

  var newState = _objectSpread({}, state, {
    isProviderLoading: true,
    isCloudMapLoading: true
  }); // payload called by provider.downloadMap


  var uploadFileTask = (0, _tasks2.LOAD_CLOUD_MAP_TASK)({
    provider: provider,
    payload: loadParams
  }).bimap( // success
  function (response) {
    return (0, _providerActions.loadCloudMapSuccess)({
      response: response,
      loadParams: loadParams,
      provider: provider,
      onSuccess: onSuccess,
      onError: onError
    });
  }, // error
  function (error) {
    return (0, _providerActions.loadCloudMapError)({
      error: error,
      provider: provider,
      onError: onError
    });
  });
  return (0, _tasks.withTask)(newState, uploadFileTask);
};

exports.loadCloudMapUpdater = loadCloudMapUpdater;

function checkLoadMapResponseError(response) {
  if (!response || !(0, _utils.isPlainObject)(response)) {
    return new Error('Load map response is empty');
  }

  if (!(0, _utils.isPlainObject)(response.map)) {
    return new Error("Load map response should be an object property \"map\"");
  }

  if (!response.map.datasets || !response.map.config) {
    return new Error("Load map response.map should be an object with property datasets or config");
  }

  return null;
}

function getDatasetHandler(format) {
  var defaultHandler = _dataProcessor.DATASET_HANDLERS[_defaultSettings.DATASET_FORMATS.csv];

  if (!format) {
    _console["default"].warn('format is not provided in load map response, will use csv by default');

    return defaultHandler;
  }

  if (!_dataProcessor.DATASET_HANDLERS[format]) {
    var supportedFormat = Object.keys(_defaultSettings.DATASET_FORMATS).map(function (k) {
      return "'".concat(k, "'");
    }).join(', ');

    _console["default"].warn("unknown format ".concat(format, ". Please use one of ").concat(supportedFormat, ", will use csv by default"));

    return defaultHandler;
  }

  return _dataProcessor.DATASET_HANDLERS[format];
}

function parseLoadMapResponse(response, loadParams, provider) {
  var map = response.map,
      format = response.format;
  var processorMethod = getDatasetHandler(format);
  var parsedDatasets = (0, _utils.toArray)(map.datasets).map(function (ds, i) {
    if (format === _defaultSettings.DATASET_FORMATS.keplergl) {
      // no need to obtain id, directly pass them in
      return processorMethod(ds);
    }

    var info = ds && ds.info || {
      id: (0, _utils.generateHashId)(6)
    };
    var data = processorMethod(ds.data || ds);
    return {
      info: info,
      data: data
    };
  });

  var parsedConfig = map.config && _schemas["default"].parseSavedConfig(map.config);

  var info = _objectSpread({}, map.info, {
    provider: provider.name,
    loadParams: loadParams
  });

  return _objectSpread({
    datasets: parsedDatasets,
    info: info
  }, parsedConfig ? {
    config: parsedConfig
  } : {});
}
/**
 *
 * @type {typeof import('./provider-state-updaters').loadCloudMapSuccessUpdater}
 */


var loadCloudMapSuccessUpdater = function loadCloudMapSuccessUpdater(state, action) {
  var _action$payload5 = action.payload,
      response = _action$payload5.response,
      loadParams = _action$payload5.loadParams,
      provider = _action$payload5.provider,
      onSuccess = _action$payload5.onSuccess,
      onError = _action$payload5.onError;
  var formatError = checkLoadMapResponseError(response);

  if (formatError) {
    // if response format is not correct
    return exportFileErrorUpdater(state, {
      payload: {
        error: formatError,
        provider: provider,
        onError: onError
      }
    });
  }

  var newState = _objectSpread({}, state, {
    mapSaved: provider.name,
    currentProvider: provider.name,
    isCloudMapLoading: false,
    isProviderLoading: false
  });

  var payload = parseLoadMapResponse(response, loadParams, provider);
  var tasks = [(0, _tasks2.ACTION_TASK)().map(function (_) {
    return (0, _actions.addDataToMap)(payload);
  }), createActionTask(onSuccess, {
    response: response,
    loadParams: loadParams,
    provider: provider
  }), (0, _tasks2.ACTION_TASK)().map(function (_) {
    return (0, _providerActions.postSaveLoadSuccess)("Map from ".concat(provider.name, " loaded"));
  })].filter(function (d) {
    return d;
  });
  return tasks.length ? (0, _tasks.withTask)(newState, tasks) : newState;
};
/**
 *
 * @type {typeof import('./provider-state-updaters').loadCloudMapErrorUpdater}
 */


exports.loadCloudMapSuccessUpdater = loadCloudMapSuccessUpdater;

var loadCloudMapErrorUpdater = function loadCloudMapErrorUpdater(state, action) {
  var message = (0, _utils.getError)(action.payload.error) || "Error loading saved map";

  _console["default"].warn(message);

  var newState = _objectSpread({}, state, {
    isProviderLoading: false,
    isCloudMapLoading: false,
    providerError: null
  });

  return (0, _tasks.withTask)(newState, createGlobalNotificationTasks({
    type: 'error',
    message: message,
    delayClose: false
  }));
};
/**
 *
 * @type {typeof import('./provider-state-updaters').resetProviderStatusUpdater}
 */


exports.loadCloudMapErrorUpdater = loadCloudMapErrorUpdater;

var resetProviderStatusUpdater = function resetProviderStatusUpdater(state, action) {
  return _objectSpread({}, state, {
    isProviderLoading: false,
    providerError: null,
    isCloudMapLoading: false,
    successInfo: {}
  });
};
/**
 * Set current cloudProvider
 * @type {typeof import('./provider-state-updaters').setCloudProviderUpdater}
 */


exports.resetProviderStatusUpdater = resetProviderStatusUpdater;

var setCloudProviderUpdater = function setCloudProviderUpdater(state, action) {
  return _objectSpread({}, state, {
    isProviderLoading: false,
    providerError: null,
    successInfo: {},
    currentProvider: action.payload
  });
};
/**
 *
 * @type {typeof import('./provider-state-updaters').getSavedMapsUpdater}
 */


exports.setCloudProviderUpdater = setCloudProviderUpdater;

var getSavedMapsUpdater = function getSavedMapsUpdater(state, action) {
  var provider = action.payload;

  if (!_validateProvider(provider, 'listMaps')) {
    return state;
  }

  var getSavedMapsTask = (0, _tasks2.GET_SAVED_MAPS_TASK)(provider).bimap( // success
  function (visualizations) {
    return (0, _providerActions.getSavedMapsSuccess)({
      visualizations: visualizations,
      provider: provider
    });
  }, // error
  function (error) {
    return (0, _providerActions.getSavedMapsError)({
      error: error,
      provider: provider
    });
  });
  return (0, _tasks.withTask)(_objectSpread({}, state, {
    isProviderLoading: true
  }), getSavedMapsTask);
};
/**
 *
 * @type {typeof import('./provider-state-updaters').getSavedMapsSuccessUpdater}
 */


exports.getSavedMapsUpdater = getSavedMapsUpdater;

var getSavedMapsSuccessUpdater = function getSavedMapsSuccessUpdater(state, action) {
  return _objectSpread({}, state, {
    isProviderLoading: false,
    visualizations: action.payload.visualizations
  });
};
/**
 *
 * @type {typeof import('./provider-state-updaters').getSavedMapsErrorUpdater}
 */


exports.getSavedMapsSuccessUpdater = getSavedMapsSuccessUpdater;

var getSavedMapsErrorUpdater = function getSavedMapsErrorUpdater(state, action) {
  var message = (0, _utils.getError)(action.payload.error) || "Error getting saved maps from ".concat(state.currentProvider);

  _console["default"].warn(action.payload.error);

  var newState = _objectSpread({}, state, {
    currentProvider: null,
    isProviderLoading: false
  });

  return (0, _tasks.withTask)(newState, createGlobalNotificationTasks({
    type: 'error',
    message: message,
    delayClose: false
  }));
};

exports.getSavedMapsErrorUpdater = getSavedMapsErrorUpdater;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9wcm92aWRlci1zdGF0ZS11cGRhdGVycy5qcyJdLCJuYW1lcyI6WyJJTklUSUFMX1BST1ZJREVSX1NUQVRFIiwiaXNQcm92aWRlckxvYWRpbmciLCJpc0Nsb3VkTWFwTG9hZGluZyIsInByb3ZpZGVyRXJyb3IiLCJjdXJyZW50UHJvdmlkZXIiLCJzdWNjZXNzSW5mbyIsIm1hcFNhdmVkIiwidmlzdWFsaXphdGlvbnMiLCJjcmVhdGVBY3Rpb25UYXNrIiwiYWN0aW9uIiwicGF5bG9hZCIsIm1hcCIsIl8iLCJfdmFsaWRhdGVQcm92aWRlciIsInByb3ZpZGVyIiwibWV0aG9kIiwiQ29uc29sZSIsImVycm9yIiwibmFtZSIsImNyZWF0ZUdsb2JhbE5vdGlmaWNhdGlvblRhc2tzIiwidHlwZSIsIm1lc3NhZ2UiLCJkZWxheUNsb3NlIiwiaWQiLCJzdWNjZXNzTm90ZSIsIkRFRkFVTFRfTk9USUZJQ0FUSU9OX1RZUEVTIiwic3VjY2VzcyIsInRvcGljIiwiREVGQVVMVF9OT1RJRklDQVRJT05fVE9QSUNTIiwiZ2xvYmFsIiwidGFzayIsImV4cG9ydEZpbGVUb0Nsb3VkVXBkYXRlciIsInN0YXRlIiwibWFwRGF0YSIsIm9wdGlvbnMiLCJvblN1Y2Nlc3MiLCJvbkVycm9yIiwiY2xvc2VNb2RhbCIsIm5ld1N0YXRlIiwidXBsb2FkRmlsZVRhc2siLCJiaW1hcCIsInJlc3BvbnNlIiwiZXhwb3J0RmlsZVN1Y2Nlc3NVcGRhdGVyIiwiaXNQdWJsaWMiLCJ0YXNrcyIsImZpbHRlciIsImQiLCJsZW5ndGgiLCJwb3N0U2F2ZUxvYWRTdWNjZXNzVXBkYXRlciIsImV4cG9ydEZpbGVFcnJvclVwZGF0ZXIiLCJsb2FkQ2xvdWRNYXBVcGRhdGVyIiwibG9hZFBhcmFtcyIsIndhcm4iLCJjaGVja0xvYWRNYXBSZXNwb25zZUVycm9yIiwiRXJyb3IiLCJkYXRhc2V0cyIsImNvbmZpZyIsImdldERhdGFzZXRIYW5kbGVyIiwiZm9ybWF0IiwiZGVmYXVsdEhhbmRsZXIiLCJEQVRBU0VUX0hBTkRMRVJTIiwiREFUQVNFVF9GT1JNQVRTIiwiY3N2Iiwic3VwcG9ydGVkRm9ybWF0IiwiT2JqZWN0Iiwia2V5cyIsImsiLCJqb2luIiwicGFyc2VMb2FkTWFwUmVzcG9uc2UiLCJwcm9jZXNzb3JNZXRob2QiLCJwYXJzZWREYXRhc2V0cyIsImRzIiwiaSIsImtlcGxlcmdsIiwiaW5mbyIsImRhdGEiLCJwYXJzZWRDb25maWciLCJLZXBsZXJHbFNjaGVtYSIsInBhcnNlU2F2ZWRDb25maWciLCJsb2FkQ2xvdWRNYXBTdWNjZXNzVXBkYXRlciIsImZvcm1hdEVycm9yIiwibG9hZENsb3VkTWFwRXJyb3JVcGRhdGVyIiwicmVzZXRQcm92aWRlclN0YXR1c1VwZGF0ZXIiLCJzZXRDbG91ZFByb3ZpZGVyVXBkYXRlciIsImdldFNhdmVkTWFwc1VwZGF0ZXIiLCJnZXRTYXZlZE1hcHNUYXNrIiwiZ2V0U2F2ZWRNYXBzU3VjY2Vzc1VwZGF0ZXIiLCJnZXRTYXZlZE1hcHNFcnJvclVwZGF0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBT0E7O0FBVUE7O0FBQ0E7O0FBQ0E7O0FBTUE7O0FBV0E7Ozs7OztBQVRPLElBQU1BLHNCQUFzQixHQUFHO0FBQ3BDQyxFQUFBQSxpQkFBaUIsRUFBRSxLQURpQjtBQUVwQ0MsRUFBQUEsaUJBQWlCLEVBQUUsS0FGaUI7QUFHcENDLEVBQUFBLGFBQWEsRUFBRSxJQUhxQjtBQUlwQ0MsRUFBQUEsZUFBZSxFQUFFLElBSm1CO0FBS3BDQyxFQUFBQSxXQUFXLEVBQUUsRUFMdUI7QUFNcENDLEVBQUFBLFFBQVEsRUFBRSxJQU4wQjtBQU9wQ0MsRUFBQUEsY0FBYyxFQUFFO0FBUG9CLENBQS9COzs7QUFXUCxTQUFTQyxnQkFBVCxDQUEwQkMsTUFBMUIsRUFBa0NDLE9BQWxDLEVBQTJDO0FBQ3pDLE1BQUksT0FBT0QsTUFBUCxLQUFrQixVQUF0QixFQUFrQztBQUNoQyxXQUFPLDJCQUFj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QUNUTixLQURTO0FBRVo1QixJQUFBQSxlQUFlLEVBQUUsSUFGTDtBQUdaSCxJQUFBQSxpQkFBaUIsRUFBRTtBQUhQLElBQWQ7O0FBTUEsU0FBTyxxQkFDTHFDLFFBREssRUFFTG5CLDZCQUE2QixDQUFDO0FBQUNDLElBQUFBLElBQUksRUFBRSxPQUFQO0FBQWdCQyxJQUFBQSxPQUFPLEVBQVBBLE9BQWhCO0FBQXlCQyxJQUFBQSxVQUFVLEVBQUU7QUFBckMsR0FBRCxDQUZ4QixDQUFQO0FBSUQsQ0FoQk0iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge3dpdGhUYXNrfSBmcm9tICdyZWFjdC1wYWxtL3Rhc2tzJztcbmltcG9ydCB7ZGVmYXVsdCBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvY29uc29sZSc7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkLCBnZXRFcnJvciwgaXNQbGFpbk9iamVjdH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtcbiAgRVhQT1JUX0ZJTEVfVE9fQ0xPVURfVEFTSyxcbiAgQUNUSU9OX1RBU0ssXG4gIERFTEFZX1RBU0ssXG4gIExPQURfQ0xPVURfTUFQX1RBU0ssXG4gIEdFVF9TQVZFRF9NQVBTX1RBU0tcbn0gZnJvbSAndGFza3MvdGFza3MnO1xuaW1wb3J0IHtcbiAgZXhwb3J0RmlsZVN1Y2Nlc3MsXG4gIGV4cG9ydEZpbGVFcnJvcixcbiAgcG9zdFNhdmVMb2FkU3VjY2VzcyxcbiAgbG9hZENsb3VkTWFwU3VjY2VzcyxcbiAgZ2V0U2F2ZWRNYXBzU3VjY2VzcyxcbiAgZ2V0U2F2ZWRNYXBzRXJyb3IsXG4gIGxvYWRDbG91ZE1hcEVycm9yLFxuICByZXNldFByb3ZpZGVyU3RhdHVzXG59IGZyb20gJ2FjdGlvbnMvcHJvdmlkZXItYWN0aW9ucyc7XG5pbXBvcnQge3JlbW92ZU5vdGlmaWNhdGlvbiwgdG9nZ2xlTW9kYWwsIGFkZE5vdGlmaWNhdGlvbn0gZnJvbSAnYWN0aW9ucy91aS1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCB7YWRkRGF0YVRvTWFwfSBmcm9tICdhY3Rpb25zL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9OT1RJRklDQVRJT05fVFlQRVMsXG4gIERFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUyxcbiAgREFUQVNFVF9GT1JNQVRTXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7dG9BcnJheX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IEtlcGxlckdsU2NoZW1hIGZyb20gJ3NjaGVtYXMnO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9QUk9WSURFUl9TVEFURSA9IHtcbiAgaXNQcm92aWRlckxvYWRpbmc6IGZhbHNlLFxuICBpc0Nsb3VkTWFwTG9hZGluZzogZmFsc2UsXG4gIHByb3ZpZGVyRXJyb3I6IG51bGwsXG4gIGN1cnJlbnRQcm92aWRlcjogbnVsbCxcbiAgc3VjY2Vzc0luZm86IHt9LFxuICBtYXBTYXZlZDogbnVsbCxcbiAgdmlzdWFsaXphdGlvbnM6IFtdXG59O1xuaW1wb3J0IHtEQVRBU0VUX0hBTkRMRVJTfSBmcm9tICdwcm9jZXNzb3JzL2RhdGEtcHJvY2Vzc29yJztcblxuZnVuY3Rpb24gY3JlYXRlQWN0aW9uVGFzayhhY3Rpb24sIHBheWxvYWQpIHtcbiAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQUNUSU9OX1RBU0soKS5tYXAoXyA9PiBhY3Rpb24ocGF5bG9hZCkpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIF92YWxpZGF0ZVByb3ZpZGVyKHByb3ZpZGVyLCBtZXRob2QpIHtcbiAgaWYgKCFwcm92aWRlcikge1xuICAgIENvbnNvbGUuZXJyb3IoYHByb3ZpZGVyIGlzIG5vdCBkZWZpbmVkYCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBwcm92aWRlclttZXRob2RdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgQ29uc29sZS5lcnJvcihgJHttZXRob2R9IGlzIG5vdCBhIGZ1bmN0aW9uIG9mIENsb3VkIHByb3ZpZGVyOiAke3Byb3ZpZGVyLm5hbWV9YCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5jcmVhdGVHbG9iYWxOb3RpZmljYXRpb25UYXNrc31cbiAqL1xuZnVuY3Rpb24gY3JlYXRlR2xvYmFsTm90aWZpY2F0aW9uVGFza3Moe3R5cGUsIG1lc3NhZ2UsIGRlbGF5Q2xvc2UgPSB0cnVlfSkge1xuICBjb25zdCBpZCA9IGdlbmVyYXRlSGFzaElkKCk7XG4gIGNvbnN0IHN1Y2Nlc3NOb3RlID0ge1xuICAgIGlkLFxuICAgIHR5cGU6IERFRkFVTFRfTk9USUZJQ0FUSU9OX1RZUEVTW3R5cGVdIHx8IERFRkFVTFRfTk9USUZJQ0FUSU9OX1RZUEVTLnN1Y2Nlc3MsXG4gICAgdG9waWM6IERFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUy5nbG9iYWwsXG4gICAgbWVzc2FnZVxuICB9O1xuICBjb25zdCB0YXNrID0gQUNUSU9OX1RBU0soKS5tYXAoXyA9PiBhZGROb3RpZmljYXRpb24oc3VjY2Vzc05vdGUpKTtcbiAgcmV0dXJuIGRlbGF5Q2xvc2UgPyBbdGFzaywgREVMQVlfVEFTSygzMDAwKS5tYXAoXyA9PiByZW1vdmVOb3RpZmljYXRpb24oaWQpKV0gOiBbdGFza107XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgd2lsbCBleHBvcnQgdGhlIGN1cnJlbnQga2VwbGVyIGNvbmZpZyBmaWxlIHRvIHRoZSBjaG9zZW4gY2xvdWQgcHJvZGVyXG4gKiBhZGQgcmV0dXJucyBhIHNoYXJlIFVSTFxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykuZXhwb3J0RmlsZVRvQ2xvdWRVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgZXhwb3J0RmlsZVRvQ2xvdWRVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge21hcERhdGEsIHByb3ZpZGVyLCBvcHRpb25zID0ge30sIG9uU3VjY2Vzcywgb25FcnJvciwgY2xvc2VNb2RhbH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICBpZiAoIV92YWxpZGF0ZVByb3ZpZGVyKHByb3ZpZGVyLCAndXBsb2FkTWFwJykpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogdHJ1ZSxcbiAgICBjdXJyZW50UHJvdmlkZXI6IHByb3ZpZGVyLm5hbWVcbiAgfTtcblxuICAvLyBwYXlsb2FkIGNhbGxlZCBieSBwcm92aWRlci51cGxvYWRNYXBcbiAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICBtYXBEYXRhLFxuICAgIG9wdGlvbnNcbiAgfTtcbiAgY29uc3QgdXBsb2FkRmlsZVRhc2sgPSBFWFBPUlRfRklMRV9UT19DTE9VRF9UQVNLKHtwcm92aWRlciwgcGF5bG9hZH0pLmJpbWFwKFxuICAgIC8vIHN1Y2Nlc3NcbiAgICByZXNwb25zZSA9PiBleHBvcnRGaWxlU3VjY2Vzcyh7cmVzcG9uc2UsIHByb3ZpZGVyLCBvcHRpb25zLCBvblN1Y2Nlc3MsIGNsb3NlTW9kYWx9KSxcbiAgICAvLyBlcnJvclxuICAgIGVycm9yID0+IGV4cG9ydEZpbGVFcnJvcih7ZXJyb3IsIHByb3ZpZGVyLCBvcHRpb25zLCBvbkVycm9yfSlcbiAgKTtcblxuICByZXR1cm4gd2l0aFRhc2sobmV3U3RhdGUsIHVwbG9hZEZpbGVUYXNrKTtcbn07XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykuZXhwb3J0RmlsZVN1Y2Nlc3NVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgZXhwb3J0RmlsZVN1Y2Nlc3NVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge3Jlc3BvbnNlLCBwcm92aWRlciwgb3B0aW9ucyA9IHt9LCBvblN1Y2Nlc3MsIGNsb3NlTW9kYWx9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgaXNQcm92aWRlckxvYWRpbmc6IGZhbHNlLFxuICAgIC8vIFRPRE86IGRvIHdlIGFsd2F5cyBoYXZlIHRvIHN0b3JlIHRoaXM/XG4gICAgc3VjY2Vzc0luZm86IHJlc3BvbnNlLFxuICAgIC4uLighb3B0aW9ucy5pc1B1YmxpY1xuICAgICAgPyB7XG4gICAgICAgICAgbWFwU2F2ZWQ6IHByb3ZpZGVyLm5hbWVcbiAgICAgICAgfVxuICAgICAgOiB7fSlcbiAgfTtcblxuICBjb25zdCB0YXNrcyA9IFtcbiAgICBjcmVhdGVBY3Rpb25UYXNrKG9uU3VjY2Vzcywge3Jlc3BvbnNlLCBwcm92aWRlciwgb3B0aW9uc30pLFxuICAgIGNsb3NlTW9kYWwgJiZcbiAgICAgIEFDVElPTl9UQVNLKCkubWFwKF8gPT4gcG9zdFNhdmVMb2FkU3VjY2VzcyhgTWFwIHNhdmVkIHRvICR7c3RhdGUuY3VycmVudFByb3ZpZGVyfSFgKSlcbiAgXS5maWx0ZXIoZCA9PiBkKTtcblxuICByZXR1cm4gdGFza3MubGVuZ3RoID8gd2l0aFRhc2sobmV3U3RhdGUsIHRhc2tzKSA6IG5ld1N0YXRlO1xufTtcblxuLyoqXG4gKiBDbG9zZSBtb2RhbCBvbiBzdWNjZXNzIGFuZCBkaXNwbGF5IG5vdGlmaWNhdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5wb3N0U2F2ZUxvYWRTdWNjZXNzVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHBvc3RTYXZlTG9hZFN1Y2Nlc3NVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9IGFjdGlvbi5wYXlsb2FkIHx8IGBTYXZlZCAvIExvYWQgdG8gJHtzdGF0ZS5jdXJyZW50UHJvdmlkZXJ9IFN1Y2Nlc3NgO1xuXG4gIGNvbnN0IHRhc2tzID0gW1xuICAgIEFDVElPTl9UQVNLKCkubWFwKF8gPT4gdG9nZ2xlTW9kYWwobnVsbCkpLFxuICAgIEFDVElPTl9UQVNLKCkubWFwKF8gPT4gcmVzZXRQcm92aWRlclN0YXR1cygpKSxcbiAgICAuLi5jcmVhdGVHbG9iYWxOb3RpZmljYXRpb25UYXNrcyh7bWVzc2FnZX0pXG4gIF07XG5cbiAgcmV0dXJuIHdpdGhUYXNrKHN0YXRlLCB0YXNrcyk7XG59O1xuXG4vKipcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9wcm92aWRlci1zdGF0ZS11cGRhdGVycycpLmV4cG9ydEZpbGVFcnJvclVwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBleHBvcnRGaWxlRXJyb3JVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge2Vycm9yLCBwcm92aWRlciwgb25FcnJvcn0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgaXNQcm92aWRlckxvYWRpbmc6IGZhbHNlLFxuICAgIHByb3ZpZGVyRXJyb3I6IGdldEVycm9yKGVycm9yKVxuICB9O1xuXG4gIGNvbnN0IHRhc2sgPSBjcmVhdGVBY3Rpb25UYXNrKG9uRXJyb3IsIHtlcnJvciwgcHJvdmlkZXJ9KTtcblxuICByZXR1cm4gdGFzayA/IHdpdGhUYXNrKG5ld1N0YXRlLCB0YXNrKSA6IG5ld1N0YXRlO1xufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRDbG91ZE1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bG9hZFBhcmFtcywgcHJvdmlkZXIsIG9uU3VjY2Vzcywgb25FcnJvcn0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgaWYgKCFsb2FkUGFyYW1zKSB7XG4gICAgQ29uc29sZS53YXJuKCdsb2FkIG1hcCBlcnJvcjogbG9hZFBhcmFtcyBpcyB1bmRlZmluZWQnKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgaWYgKCFfdmFsaWRhdGVQcm92aWRlcihwcm92aWRlciwgJ2Rvd25sb2FkTWFwJykpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogdHJ1ZSxcbiAgICBpc0Nsb3VkTWFwTG9hZGluZzogdHJ1ZVxuICB9O1xuXG4gIC8vIHBheWxvYWQgY2FsbGVkIGJ5IHByb3ZpZGVyLmRvd25sb2FkTWFwXG4gIGNvbnN0IHVwbG9hZEZpbGVUYXNrID0gTE9BRF9DTE9VRF9NQVBfVEFTSyh7cHJvdmlkZXIsIHBheWxvYWQ6IGxvYWRQYXJhbXN9KS5iaW1hcChcbiAgICAvLyBzdWNjZXNzXG4gICAgcmVzcG9uc2UgPT4gbG9hZENsb3VkTWFwU3VjY2Vzcyh7cmVzcG9uc2UsIGxvYWRQYXJhbXMsIHByb3ZpZGVyLCBvblN1Y2Nlc3MsIG9uRXJyb3J9KSxcbiAgICAvLyBlcnJvclxuICAgIGVycm9yID0+IGxvYWRDbG91ZE1hcEVycm9yKHtlcnJvciwgcHJvdmlkZXIsIG9uRXJyb3J9KVxuICApO1xuXG4gIHJldHVybiB3aXRoVGFzayhuZXdTdGF0ZSwgdXBsb2FkRmlsZVRhc2spO1xufTtcblxuZnVuY3Rpb24gY2hlY2tMb2FkTWFwUmVzcG9uc2VFcnJvcihyZXNwb25zZSkge1xuICBpZiAoIXJlc3BvbnNlIHx8ICFpc1BsYWluT2JqZWN0KHJlc3BvbnNlKSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0xvYWQgbWFwIHJlc3BvbnNlIGlzIGVtcHR5Jyk7XG4gIH1cbiAgaWYgKCFpc1BsYWluT2JqZWN0KHJlc3BvbnNlLm1hcCkpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKGBMb2FkIG1hcCByZXNwb25zZSBzaG91bGQgYmUgYW4gb2JqZWN0IHByb3BlcnR5IFwibWFwXCJgKTtcbiAgfVxuICBpZiAoIXJlc3BvbnNlLm1hcC5kYXRhc2V0cyB8fCAhcmVzcG9uc2UubWFwLmNvbmZpZykge1xuICAgIHJldHVybiBuZXcgRXJyb3IoYExvYWQgbWFwIHJlc3BvbnNlLm1hcCBzaG91bGQgYmUgYW4gb2JqZWN0IHdpdGggcHJvcGVydHkgZGF0YXNldHMgb3IgY29uZmlnYCk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0RGF0YXNldEhhbmRsZXIoZm9ybWF0KSB7XG4gIGNvbnN0IGRlZmF1bHRIYW5kbGVyID0gREFUQVNFVF9IQU5ETEVSU1tEQVRBU0VUX0ZPUk1BVFMuY3N2XTtcbiAgaWYgKCFmb3JtYXQpIHtcbiAgICBDb25zb2xlLndhcm4oJ2Zvcm1hdCBpcyBub3QgcHJvdmlkZWQgaW4gbG9hZCBtYXAgcmVzcG9uc2UsIHdpbGwgdXNlIGNzdiBieSBkZWZhdWx0Jyk7XG4gICAgcmV0dXJuIGRlZmF1bHRIYW5kbGVyO1xuICB9XG5cbiAgaWYgKCFEQVRBU0VUX0hBTkRMRVJTW2Zvcm1hdF0pIHtcbiAgICBjb25zdCBzdXBwb3J0ZWRGb3JtYXQgPSBPYmplY3Qua2V5cyhEQVRBU0VUX0ZPUk1BVFMpXG4gICAgICAubWFwKGsgPT4gYCcke2t9J2ApXG4gICAgICAuam9pbignLCAnKTtcbiAgICBDb25zb2xlLndhcm4oXG4gICAgICBgdW5rbm93biBmb3JtYXQgJHtmb3JtYXR9LiBQbGVhc2UgdXNlIG9uZSBvZiAke3N1cHBvcnRlZEZvcm1hdH0sIHdpbGwgdXNlIGNzdiBieSBkZWZhdWx0YFxuICAgICk7XG4gICAgcmV0dXJuIGRlZmF1bHRIYW5kbGVyO1xuICB9XG5cbiAgcmV0dXJuIERBVEFTRVRfSEFORExFUlNbZm9ybWF0XTtcbn1cblxuZnVuY3Rpb24gcGFyc2VMb2FkTWFwUmVzcG9uc2UocmVzcG9uc2UsIGxvYWRQYXJhbXMsIHByb3ZpZGVyKSB7XG4gIGNvbnN0IHttYXAsIGZvcm1hdH0gPSByZXNwb25zZTtcbiAgY29uc3QgcHJvY2Vzc29yTWV0aG9kID0gZ2V0RGF0YXNldEhhbmRsZXIoZm9ybWF0KTtcblxuICBjb25zdCBwYXJzZWREYXRhc2V0cyA9IHRvQXJyYXkobWFwLmRhdGFzZXRzKS5tYXAoKGRzLCBpKSA9PiB7XG4gICAgaWYgKGZvcm1hdCA9PT0gREFUQVNFVF9GT1JNQVRTLmtlcGxlcmdsKSB7XG4gICAgICAvLyBubyBuZWVkIHRvIG9idGFpbiBpZCwgZGlyZWN0bHkgcGFzcyB0aGVtIGluXG4gICAgICByZXR1cm4gcHJvY2Vzc29yTWV0aG9kKGRzKTtcbiAgICB9XG4gICAgY29uc3QgaW5mbyA9IChkcyAmJiBkcy5pbmZvKSB8fCB7aWQ6IGdlbmVyYXRlSGFzaElkKDYpfTtcbiAgICBjb25zdCBkYXRhID0gcHJvY2Vzc29yTWV0aG9kKGRzLmRhdGEgfHwgZHMpO1xuICAgIHJldHVybiB7aW5mbywgZGF0YX07XG4gIH0pO1xuXG4gIGNvbnN0IHBhcnNlZENvbmZpZyA9IG1hcC5jb25maWcgJiYgS2VwbGVyR2xTY2hlbWEucGFyc2VTYXZlZENvbmZpZyhtYXAuY29uZmlnKTtcblxuICBjb25zdCBpbmZvID0ge1xuICAgIC4uLm1hcC5pbmZvLFxuICAgIHByb3ZpZGVyOiBwcm92aWRlci5uYW1lLFxuICAgIGxvYWRQYXJhbXNcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBkYXRhc2V0czogcGFyc2VkRGF0YXNldHMsXG4gICAgaW5mbyxcbiAgICAuLi4ocGFyc2VkQ29uZmlnID8ge2NvbmZpZzogcGFyc2VkQ29uZmlnfSA6IHt9KVxuICB9O1xufVxuXG4vKipcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9wcm92aWRlci1zdGF0ZS11cGRhdGVycycpLmxvYWRDbG91ZE1hcFN1Y2Nlc3NVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgbG9hZENsb3VkTWFwU3VjY2Vzc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7cmVzcG9uc2UsIGxvYWRQYXJhbXMsIHByb3ZpZGVyLCBvblN1Y2Nlc3MsIG9uRXJyb3J9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgY29uc3QgZm9ybWF0RXJyb3IgPSBjaGVja0xvYWRNYXBSZXNwb25zZUVycm9yKHJlc3BvbnNlKTtcbiAgaWYgKGZvcm1hdEVycm9yKSB7XG4gICAgLy8gaWYgcmVzcG9uc2UgZm9ybWF0IGlzIG5vdCBjb3JyZWN0XG4gICAgcmV0dXJuIGV4cG9ydEZpbGVFcnJvclVwZGF0ZXIoc3RhdGUsIHtcbiAgICAgIHBheWxvYWQ6IHtlcnJvcjogZm9ybWF0RXJyb3IsIHByb3ZpZGVyLCBvbkVycm9yfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgbWFwU2F2ZWQ6IHByb3ZpZGVyLm5hbWUsXG4gICAgY3VycmVudFByb3ZpZGVyOiBwcm92aWRlci5uYW1lLFxuICAgIGlzQ2xvdWRNYXBMb2FkaW5nOiBmYWxzZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2VcbiAgfTtcblxuICBjb25zdCBwYXlsb2FkID0gcGFyc2VMb2FkTWFwUmVzcG9uc2UocmVzcG9uc2UsIGxvYWRQYXJhbXMsIHByb3ZpZGVyKTtcblxuICBjb25zdCB0YXNrcyA9IFtcbiAgICBBQ1RJT05fVEFTSygpLm1hcChfID0+IGFkZERhdGFUb01hcChwYXlsb2FkKSksXG4gICAgY3JlYXRlQWN0aW9uVGFzayhvblN1Y2Nlc3MsIHtyZXNwb25zZSwgbG9hZFBhcmFtcywgcHJvdmlkZXJ9KSxcbiAgICBBQ1RJT05fVEFTSygpLm1hcChfID0+IHBvc3RTYXZlTG9hZFN1Y2Nlc3MoYE1hcCBmcm9tICR7cHJvdmlkZXIubmFtZX0gbG9hZGVkYCkpXG4gIF0uZmlsdGVyKGQgPT4gZCk7XG5cbiAgcmV0dXJuIHRhc2tzLmxlbmd0aCA/IHdpdGhUYXNrKG5ld1N0YXRlLCB0YXNrcykgOiBuZXdTdGF0ZTtcbn07XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykubG9hZENsb3VkTWFwRXJyb3JVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgbG9hZENsb3VkTWFwRXJyb3JVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9IGdldEVycm9yKGFjdGlvbi5wYXlsb2FkLmVycm9yKSB8fCBgRXJyb3IgbG9hZGluZyBzYXZlZCBtYXBgO1xuXG4gIENvbnNvbGUud2FybihtZXNzYWdlKTtcblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gICAgaXNDbG91ZE1hcExvYWRpbmc6IGZhbHNlLFxuICAgIHByb3ZpZGVyRXJyb3I6IG51bGxcbiAgfTtcblxuICByZXR1cm4gd2l0aFRhc2soXG4gICAgbmV3U3RhdGUsXG4gICAgY3JlYXRlR2xvYmFsTm90aWZpY2F0aW9uVGFza3Moe3R5cGU6ICdlcnJvcicsIG1lc3NhZ2UsIGRlbGF5Q2xvc2U6IGZhbHNlfSlcbiAgKTtcbn07XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykucmVzZXRQcm92aWRlclN0YXR1c1VwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCByZXNldFByb3ZpZGVyU3RhdHVzVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgaXNQcm92aWRlckxvYWRpbmc6IGZhbHNlLFxuICBwcm92aWRlckVycm9yOiBudWxsLFxuICBpc0Nsb3VkTWFwTG9hZGluZzogZmFsc2UsXG4gIHN1Y2Nlc3NJbmZvOiB7fVxufSk7XG5cbi8qKlxuICogU2V0IGN1cnJlbnQgY2xvdWRQcm92aWRlclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5zZXRDbG91ZFByb3ZpZGVyVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHNldENsb3VkUHJvdmlkZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gIHByb3ZpZGVyRXJyb3I6IG51bGwsXG4gIHN1Y2Nlc3NJbmZvOiB7fSxcbiAgY3VycmVudFByb3ZpZGVyOiBhY3Rpb24ucGF5bG9hZFxufSk7XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykuZ2V0U2F2ZWRNYXBzVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNhdmVkTWFwc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBwcm92aWRlciA9IGFjdGlvbi5wYXlsb2FkO1xuICBpZiAoIV92YWxpZGF0ZVByb3ZpZGVyKHByb3ZpZGVyLCAnbGlzdE1hcHMnKSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IGdldFNhdmVkTWFwc1Rhc2sgPSBHRVRfU0FWRURfTUFQU19UQVNLKHByb3ZpZGVyKS5iaW1hcChcbiAgICAvLyBzdWNjZXNzXG4gICAgdmlzdWFsaXphdGlvbnMgPT4gZ2V0U2F2ZWRNYXBzU3VjY2Vzcyh7dmlzdWFsaXphdGlvbnMsIHByb3ZpZGVyfSksXG4gICAgLy8gZXJyb3JcbiAgICBlcnJvciA9PiBnZXRTYXZlZE1hcHNFcnJvcih7ZXJyb3IsIHByb3ZpZGVyfSlcbiAgKTtcblxuICByZXR1cm4gd2l0aFRhc2soXG4gICAge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBpc1Byb3ZpZGVyTG9hZGluZzogdHJ1ZVxuICAgIH0sXG4gICAgZ2V0U2F2ZWRNYXBzVGFza1xuICApO1xufTtcblxuLyoqXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5nZXRTYXZlZE1hcHNTdWNjZXNzVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNhdmVkTWFwc1N1Y2Nlc3NVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gIHZpc3VhbGl6YXRpb25zOiBhY3Rpb24ucGF5bG9hZC52aXN1YWxpemF0aW9uc1xufSk7XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykuZ2V0U2F2ZWRNYXBzRXJyb3JVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgZ2V0U2F2ZWRNYXBzRXJyb3JVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9XG4gICAgZ2V0RXJyb3IoYWN0aW9uLnBheWxvYWQuZXJyb3IpIHx8IGBFcnJvciBnZXR0aW5nIHNhdmVkIG1hcHMgZnJvbSAke3N0YXRlLmN1cnJlbnRQcm92aWRlcn1gO1xuXG4gIENvbnNvbGUud2FybihhY3Rpb24ucGF5bG9hZC5lcnJvcik7XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgY3VycmVudFByb3ZpZGVyOiBudWxsLFxuICAgIGlzUHJvdmlkZXJMb2FkaW5nOiBmYWxzZVxuICB9O1xuXG4gIHJldHVybiB3aXRoVGFzayhcbiAgICBuZXdTdGF0ZSxcbiAgICBjcmVhdGVHbG9iYWxOb3RpZmljYXRpb25UYXNrcyh7dHlwZTogJ2Vycm9yJywgbWVzc2FnZSwgZGVsYXlDbG9zZTogZmFsc2V9KVxuICApO1xufTtcbiJdfQ==