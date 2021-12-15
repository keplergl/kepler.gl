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

var _cloudProviders = require("../cloud-providers");

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
    type: _defaultSettings.DEFAULT_NOTIFICATION_TYPES[type || ''] || _defaultSettings.DEFAULT_NOTIFICATION_TYPES.success,
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
    isProviderLoading: false
  });

  if (isFileConflict(error)) {
    newState.mapSaved = provider.name;
    return (0, _tasks.withTask)(newState, [(0, _tasks2.ACTION_TASK)().map(function (_) {
      return (0, _uiStateActions.toggleModal)(_defaultSettings.OVERWRITE_MAP_ID);
    })]);
  }

  newState.providerError = (0, _utils.getError)(error);
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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

function isFileConflict(error) {
  return error && error.message === _cloudProviders.FILE_CONFLICT_MSG;
}

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

  var info = _objectSpread(_objectSpread({}, map.info), {}, {
    provider: provider.name,
    loadParams: loadParams
  });

  return _objectSpread({
    datasets: parsedDatasets,
    info: info
  }, map.config ? {
    config: map.config
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
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
  return (0, _tasks.withTask)(_objectSpread(_objectSpread({}, state), {}, {
    isProviderLoading: true
  }), getSavedMapsTask);
};
/**
 *
 * @type {typeof import('./provider-state-updaters').getSavedMapsSuccessUpdater}
 */


exports.getSavedMapsUpdater = getSavedMapsUpdater;

var getSavedMapsSuccessUpdater = function getSavedMapsSuccessUpdater(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
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

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9wcm92aWRlci1zdGF0ZS11cGRhdGVycy5qcyJdLCJuYW1lcyI6WyJJTklUSUFMX1BST1ZJREVSX1NUQVRFIiwiaXNQcm92aWRlckxvYWRpbmciLCJpc0Nsb3VkTWFwTG9hZGluZyIsInByb3ZpZGVyRXJyb3IiLCJjdXJyZW50UHJvdmlkZXIiLCJzdWNjZXNzSW5mbyIsIm1hcFNhdmVkIiwidmlzdWFsaXphdGlvbnMiLCJjcmVhdGVBY3Rpb25UYXNrIiwiYWN0aW9uIiwicGF5bG9hZCIsIm1hcCIsIl8iLCJfdmFsaWRhdGVQcm92aWRlciIsInByb3ZpZGVyIiwibWV0aG9kIiwiQ29uc29sZSIsImVycm9yIiwibmFtZSIsImNyZWF0ZUdsb2JhbE5vdGlmaWNhdGlvblRhc2tzIiwidHlwZSIsIm1lc3NhZ2UiLCJkZWxheUNsb3NlIiwiaWQiLCJzdWNjZXNzTm90ZSIsIkRFRkFVTFRfTk9USUZJQ0FUSU9OX1RZUEVTIiwic3VjY2VzcyIsInRvcGljIiwiREVGQVVMVF9OT1RJRklDQVRJT05fVE9QSUNTIiwiZ2xvYmFsIiwidGFzayIsImV4cG9ydEZpbGVUb0Nsb3VkVXBkYXRlciIsInN0YXRlIiwibWFwRGF0YSIsIm9wdGlvbnMiLCJvblN1Y2Nlc3MiLCJvbkVycm9yIiwiY2xvc2VNb2RhbCIsIm5ld1N0YXRlIiwidXBsb2FkRmlsZVRhc2siLCJiaW1hcCIsInJlc3BvbnNlIiwiZXhwb3J0RmlsZVN1Y2Nlc3NVcGRhdGVyIiwiaXNQdWJsaWMiLCJ0YXNrcyIsImZpbHRlciIsImQiLCJsZW5ndGgiLCJwb3N0U2F2ZUxvYWRTdWNjZXNzVXBkYXRlciIsImV4cG9ydEZpbGVFcnJvclVwZGF0ZXIiLCJpc0ZpbGVDb25mbGljdCIsIk9WRVJXUklURV9NQVBfSUQiLCJsb2FkQ2xvdWRNYXBVcGRhdGVyIiwibG9hZFBhcmFtcyIsIndhcm4iLCJGSUxFX0NPTkZMSUNUX01TRyIsImNoZWNrTG9hZE1hcFJlc3BvbnNlRXJyb3IiLCJFcnJvciIsImRhdGFzZXRzIiwiY29uZmlnIiwiZ2V0RGF0YXNldEhhbmRsZXIiLCJmb3JtYXQiLCJkZWZhdWx0SGFuZGxlciIsIkRBVEFTRVRfSEFORExFUlMiLCJEQVRBU0VUX0ZPUk1BVFMiLCJjc3YiLCJzdXBwb3J0ZWRGb3JtYXQiLCJPYmplY3QiLCJrZXlzIiwiayIsImpvaW4iLCJwYXJzZUxvYWRNYXBSZXNwb25zZSIsInByb2Nlc3Nvck1ldGhvZCIsInBhcnNlZERhdGFzZXRzIiwiZHMiLCJpIiwia2VwbGVyZ2wiLCJpbmZvIiwiZGF0YSIsImxvYWRDbG91ZE1hcFN1Y2Nlc3NVcGRhdGVyIiwiZm9ybWF0RXJyb3IiLCJsb2FkQ2xvdWRNYXBFcnJvclVwZGF0ZXIiLCJyZXNldFByb3ZpZGVyU3RhdHVzVXBkYXRlciIsInNldENsb3VkUHJvdmlkZXJVcGRhdGVyIiwiZ2V0U2F2ZWRNYXBzVXBkYXRlciIsImdldFNhdmVkTWFwc1Rhc2siLCJnZXRTYXZlZE1hcHNTdWNjZXNzVXBkYXRlciIsImdldFNhdmVkTWFwc0Vycm9yVXBkYXRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFPQTs7QUFVQTs7QUFDQTs7QUFDQTs7QUFPQTs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsc0JBQXNCLEdBQUc7QUFDcENDLEVBQUFBLGlCQUFpQixFQUFFLEtBRGlCO0FBRXBDQyxFQUFBQSxpQkFBaUIsRUFBRSxLQUZpQjtBQUdwQ0MsRUFBQUEsYUFBYSxFQUFFLElBSHFCO0FBSXBDQyxFQUFBQSxlQUFlLEVBQUUsSUFKbUI7QUFLcENDLEVBQUFBLFdBQVcsRUFBRSxFQUx1QjtBQU1wQ0MsRUFBQUEsUUFBUSxFQUFFLElBTjBCO0FBT3BDQyxFQUFBQSxjQUFjLEVBQUU7QUFQb0IsQ0FBL0I7OztBQVVQLFNBQVNDLGdCQUFULENBQTBCQyxNQUExQixFQUFrQ0MsT0FBbEMsRUFBMkM7QUFDekMsTUFBSSxPQUFPRCxNQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ2hDLFdBQU8s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Ozs7QUFDTyxJQUFNQywwQkFBMEIsR0FBRyxTQUE3QkEsMEJBQTZCLENBQUN0RCxLQUFELEVBQVF2QixNQUFSO0FBQUEseUNBQ3JDdUIsS0FEcUM7QUFFeEMvQixJQUFBQSxpQkFBaUIsRUFBRSxLQUZxQjtBQUd4Q00sSUFBQUEsY0FBYyxFQUFFRSxNQUFNLENBQUNDLE9BQVAsQ0FBZUg7QUFIUztBQUFBLENBQW5DO0FBTVA7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBQ08sSUFBTWdGLHdCQUF3QixHQUFHLFNBQTNCQSx3QkFBMkIsQ0FBQ3ZELEtBQUQsRUFBUXZCLE1BQVIsRUFBbUI7QUFDekQsTUFBTVksT0FBTyxHQUNYLHFCQUFTWixNQUFNLENBQUNDLE9BQVAsQ0FBZU8sS0FBeEIsNkNBQW1FZSxLQUFLLENBQUM1QixlQUF6RSxDQURGOztBQUdBWSxzQkFBUXNDLElBQVIsQ0FBYTdDLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlTyxLQUE1Qjs7QUFFQSxNQUFNcUIsUUFBUSxtQ0FDVE4sS0FEUztBQUVaNUIsSUFBQUEsZUFBZSxFQUFFLElBRkw7QUFHWkgsSUFBQUEsaUJBQWlCLEVBQUU7QUFIUCxJQUFkOztBQU1BLFNBQU8scUJBQ0xxQyxRQURLLEVBRUxuQiw2QkFBNkIsQ0FBQztBQUFDQyxJQUFBQSxJQUFJLEVBQUUsT0FBUDtBQUFnQkMsSUFBQUEsT0FBTyxFQUFQQSxPQUFoQjtBQUF5QkMsSUFBQUEsVUFBVSxFQUFFO0FBQXJDLEdBQUQsQ0FGeEIsQ0FBUDtBQUlELENBaEJNIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHt3aXRoVGFza30gZnJvbSAncmVhY3QtcGFsbS90YXNrcyc7XG5pbXBvcnQge2RlZmF1bHQgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL2NvbnNvbGUnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZCwgZ2V0RXJyb3IsIGlzUGxhaW5PYmplY3R9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7XG4gIEVYUE9SVF9GSUxFX1RPX0NMT1VEX1RBU0ssXG4gIEFDVElPTl9UQVNLLFxuICBERUxBWV9UQVNLLFxuICBMT0FEX0NMT1VEX01BUF9UQVNLLFxuICBHRVRfU0FWRURfTUFQU19UQVNLXG59IGZyb20gJ3Rhc2tzL3Rhc2tzJztcbmltcG9ydCB7XG4gIGV4cG9ydEZpbGVTdWNjZXNzLFxuICBleHBvcnRGaWxlRXJyb3IsXG4gIHBvc3RTYXZlTG9hZFN1Y2Nlc3MsXG4gIGxvYWRDbG91ZE1hcFN1Y2Nlc3MsXG4gIGdldFNhdmVkTWFwc1N1Y2Nlc3MsXG4gIGdldFNhdmVkTWFwc0Vycm9yLFxuICBsb2FkQ2xvdWRNYXBFcnJvcixcbiAgcmVzZXRQcm92aWRlclN0YXR1c1xufSBmcm9tICdhY3Rpb25zL3Byb3ZpZGVyLWFjdGlvbnMnO1xuaW1wb3J0IHtyZW1vdmVOb3RpZmljYXRpb24sIHRvZ2dsZU1vZGFsLCBhZGROb3RpZmljYXRpb259IGZyb20gJ2FjdGlvbnMvdWktc3RhdGUtYWN0aW9ucyc7XG5pbXBvcnQge2FkZERhdGFUb01hcH0gZnJvbSAnYWN0aW9ucy9hY3Rpb25zJztcbmltcG9ydCB7XG4gIERFRkFVTFRfTk9USUZJQ0FUSU9OX1RZUEVTLFxuICBERUZBVUxUX05PVElGSUNBVElPTl9UT1BJQ1MsXG4gIERBVEFTRVRfRk9STUFUUyxcbiAgT1ZFUldSSVRFX01BUF9JRFxufSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge3RvQXJyYXl9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7RklMRV9DT05GTElDVF9NU0d9IGZyb20gJ2Nsb3VkLXByb3ZpZGVycyc7XG5pbXBvcnQge0RBVEFTRVRfSEFORExFUlN9IGZyb20gJ3Byb2Nlc3NvcnMvZGF0YS1wcm9jZXNzb3InO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9QUk9WSURFUl9TVEFURSA9IHtcbiAgaXNQcm92aWRlckxvYWRpbmc6IGZhbHNlLFxuICBpc0Nsb3VkTWFwTG9hZGluZzogZmFsc2UsXG4gIHByb3ZpZGVyRXJyb3I6IG51bGwsXG4gIGN1cnJlbnRQcm92aWRlcjogbnVsbCxcbiAgc3VjY2Vzc0luZm86IHt9LFxuICBtYXBTYXZlZDogbnVsbCxcbiAgdmlzdWFsaXphdGlvbnM6IFtdXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVBY3Rpb25UYXNrKGFjdGlvbiwgcGF5bG9hZCkge1xuICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBQ1RJT05fVEFTSygpLm1hcChfID0+IGFjdGlvbihwYXlsb2FkKSk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gX3ZhbGlkYXRlUHJvdmlkZXIocHJvdmlkZXIsIG1ldGhvZCkge1xuICBpZiAoIXByb3ZpZGVyKSB7XG4gICAgQ29uc29sZS5lcnJvcihgcHJvdmlkZXIgaXMgbm90IGRlZmluZWRgKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIHByb3ZpZGVyW21ldGhvZF0gIT09ICdmdW5jdGlvbicpIHtcbiAgICBDb25zb2xlLmVycm9yKGAke21ldGhvZH0gaXMgbm90IGEgZnVuY3Rpb24gb2YgQ2xvdWQgcHJvdmlkZXI6ICR7cHJvdmlkZXIubmFtZX1gKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9wcm92aWRlci1zdGF0ZS11cGRhdGVycycpLmNyZWF0ZUdsb2JhbE5vdGlmaWNhdGlvblRhc2tzfVxuICovXG5mdW5jdGlvbiBjcmVhdGVHbG9iYWxOb3RpZmljYXRpb25UYXNrcyh7dHlwZSwgbWVzc2FnZSwgZGVsYXlDbG9zZSA9IHRydWV9KSB7XG4gIGNvbnN0IGlkID0gZ2VuZXJhdGVIYXNoSWQoKTtcbiAgY29uc3Qgc3VjY2Vzc05vdGUgPSB7XG4gICAgaWQsXG4gICAgdHlwZTogREVGQVVMVF9OT1RJRklDQVRJT05fVFlQRVNbdHlwZSB8fCAnJ10gfHwgREVGQVVMVF9OT1RJRklDQVRJT05fVFlQRVMuc3VjY2VzcyxcbiAgICB0b3BpYzogREVGQVVMVF9OT1RJRklDQVRJT05fVE9QSUNTLmdsb2JhbCxcbiAgICBtZXNzYWdlXG4gIH07XG4gIGNvbnN0IHRhc2sgPSBBQ1RJT05fVEFTSygpLm1hcChfID0+IGFkZE5vdGlmaWNhdGlvbihzdWNjZXNzTm90ZSkpO1xuICByZXR1cm4gZGVsYXlDbG9zZSA/IFt0YXNrLCBERUxBWV9UQVNLKDMwMDApLm1hcChfID0+IHJlbW92ZU5vdGlmaWNhdGlvbihpZCkpXSA6IFt0YXNrXTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCB3aWxsIGV4cG9ydCB0aGUgY3VycmVudCBrZXBsZXIgY29uZmlnIGZpbGUgdG8gdGhlIGNob3NlbiBjbG91ZCBwcm9kZXJcbiAqIGFkZCByZXR1cm5zIGEgc2hhcmUgVVJMXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5leHBvcnRGaWxlVG9DbG91ZFVwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBleHBvcnRGaWxlVG9DbG91ZFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bWFwRGF0YSwgcHJvdmlkZXIsIG9wdGlvbnMgPSB7fSwgb25TdWNjZXNzLCBvbkVycm9yLCBjbG9zZU1vZGFsfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gIGlmICghX3ZhbGlkYXRlUHJvdmlkZXIocHJvdmlkZXIsICd1cGxvYWRNYXAnKSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGlzUHJvdmlkZXJMb2FkaW5nOiB0cnVlLFxuICAgIGN1cnJlbnRQcm92aWRlcjogcHJvdmlkZXIubmFtZVxuICB9O1xuXG4gIC8vIHBheWxvYWQgY2FsbGVkIGJ5IHByb3ZpZGVyLnVwbG9hZE1hcFxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIG1hcERhdGEsXG4gICAgb3B0aW9uc1xuICB9O1xuICBjb25zdCB1cGxvYWRGaWxlVGFzayA9IEVYUE9SVF9GSUxFX1RPX0NMT1VEX1RBU0soe3Byb3ZpZGVyLCBwYXlsb2FkfSkuYmltYXAoXG4gICAgLy8gc3VjY2Vzc1xuICAgIHJlc3BvbnNlID0+IGV4cG9ydEZpbGVTdWNjZXNzKHtyZXNwb25zZSwgcHJvdmlkZXIsIG9wdGlvbnMsIG9uU3VjY2VzcywgY2xvc2VNb2RhbH0pLFxuICAgIC8vIGVycm9yXG4gICAgZXJyb3IgPT4gZXhwb3J0RmlsZUVycm9yKHtlcnJvciwgcHJvdmlkZXIsIG9wdGlvbnMsIG9uRXJyb3J9KVxuICApO1xuXG4gIHJldHVybiB3aXRoVGFzayhuZXdTdGF0ZSwgdXBsb2FkRmlsZVRhc2spO1xufTtcblxuLyoqXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5leHBvcnRGaWxlU3VjY2Vzc1VwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBleHBvcnRGaWxlU3VjY2Vzc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7cmVzcG9uc2UsIHByb3ZpZGVyLCBvcHRpb25zID0ge30sIG9uU3VjY2VzcywgY2xvc2VNb2RhbH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gICAgLy8gVE9ETzogZG8gd2UgYWx3YXlzIGhhdmUgdG8gc3RvcmUgdGhpcz9cbiAgICBzdWNjZXNzSW5mbzogcmVzcG9uc2UsXG4gICAgLi4uKCFvcHRpb25zLmlzUHVibGljXG4gICAgICA/IHtcbiAgICAgICAgICBtYXBTYXZlZDogcHJvdmlkZXIubmFtZVxuICAgICAgICB9XG4gICAgICA6IHt9KVxuICB9O1xuXG4gIGNvbnN0IHRhc2tzID0gW1xuICAgIGNyZWF0ZUFjdGlvblRhc2sob25TdWNjZXNzLCB7cmVzcG9uc2UsIHByb3ZpZGVyLCBvcHRpb25zfSksXG4gICAgY2xvc2VNb2RhbCAmJlxuICAgICAgQUNUSU9OX1RBU0soKS5tYXAoXyA9PiBwb3N0U2F2ZUxvYWRTdWNjZXNzKGBNYXAgc2F2ZWQgdG8gJHtzdGF0ZS5jdXJyZW50UHJvdmlkZXJ9IWApKVxuICBdLmZpbHRlcihkID0+IGQpO1xuXG4gIHJldHVybiB0YXNrcy5sZW5ndGggPyB3aXRoVGFzayhuZXdTdGF0ZSwgdGFza3MpIDogbmV3U3RhdGU7XG59O1xuXG4vKipcbiAqIENsb3NlIG1vZGFsIG9uIHN1Y2Nlc3MgYW5kIGRpc3BsYXkgbm90aWZpY2F0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9wcm92aWRlci1zdGF0ZS11cGRhdGVycycpLnBvc3RTYXZlTG9hZFN1Y2Nlc3NVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgcG9zdFNhdmVMb2FkU3VjY2Vzc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBtZXNzYWdlID0gYWN0aW9uLnBheWxvYWQgfHwgYFNhdmVkIC8gTG9hZCB0byAke3N0YXRlLmN1cnJlbnRQcm92aWRlcn0gU3VjY2Vzc2A7XG5cbiAgY29uc3QgdGFza3MgPSBbXG4gICAgQUNUSU9OX1RBU0soKS5tYXAoXyA9PiB0b2dnbGVNb2RhbChudWxsKSksXG4gICAgQUNUSU9OX1RBU0soKS5tYXAoXyA9PiByZXNldFByb3ZpZGVyU3RhdHVzKCkpLFxuICAgIC4uLmNyZWF0ZUdsb2JhbE5vdGlmaWNhdGlvblRhc2tzKHttZXNzYWdlfSlcbiAgXTtcblxuICByZXR1cm4gd2l0aFRhc2soc3RhdGUsIHRhc2tzKTtcbn07XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykuZXhwb3J0RmlsZUVycm9yVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGV4cG9ydEZpbGVFcnJvclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7ZXJyb3IsIHByb3ZpZGVyLCBvbkVycm9yfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGlzUHJvdmlkZXJMb2FkaW5nOiBmYWxzZVxuICB9O1xuXG4gIGlmIChpc0ZpbGVDb25mbGljdChlcnJvcikpIHtcbiAgICBuZXdTdGF0ZS5tYXBTYXZlZCA9IHByb3ZpZGVyLm5hbWU7XG4gICAgcmV0dXJuIHdpdGhUYXNrKG5ld1N0YXRlLCBbQUNUSU9OX1RBU0soKS5tYXAoXyA9PiB0b2dnbGVNb2RhbChPVkVSV1JJVEVfTUFQX0lEKSldKTtcbiAgfVxuXG4gIG5ld1N0YXRlLnByb3ZpZGVyRXJyb3IgPSBnZXRFcnJvcihlcnJvcik7XG4gIGNvbnN0IHRhc2sgPSBjcmVhdGVBY3Rpb25UYXNrKG9uRXJyb3IsIHtlcnJvciwgcHJvdmlkZXJ9KTtcblxuICByZXR1cm4gdGFzayA/IHdpdGhUYXNrKG5ld1N0YXRlLCB0YXNrKSA6IG5ld1N0YXRlO1xufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRDbG91ZE1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bG9hZFBhcmFtcywgcHJvdmlkZXIsIG9uU3VjY2Vzcywgb25FcnJvcn0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgaWYgKCFsb2FkUGFyYW1zKSB7XG4gICAgQ29uc29sZS53YXJuKCdsb2FkIG1hcCBlcnJvcjogbG9hZFBhcmFtcyBpcyB1bmRlZmluZWQnKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgaWYgKCFfdmFsaWRhdGVQcm92aWRlcihwcm92aWRlciwgJ2Rvd25sb2FkTWFwJykpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogdHJ1ZSxcbiAgICBpc0Nsb3VkTWFwTG9hZGluZzogdHJ1ZVxuICB9O1xuXG4gIC8vIHBheWxvYWQgY2FsbGVkIGJ5IHByb3ZpZGVyLmRvd25sb2FkTWFwXG4gIGNvbnN0IHVwbG9hZEZpbGVUYXNrID0gTE9BRF9DTE9VRF9NQVBfVEFTSyh7cHJvdmlkZXIsIHBheWxvYWQ6IGxvYWRQYXJhbXN9KS5iaW1hcChcbiAgICAvLyBzdWNjZXNzXG4gICAgcmVzcG9uc2UgPT4gbG9hZENsb3VkTWFwU3VjY2Vzcyh7cmVzcG9uc2UsIGxvYWRQYXJhbXMsIHByb3ZpZGVyLCBvblN1Y2Nlc3MsIG9uRXJyb3J9KSxcbiAgICAvLyBlcnJvclxuICAgIGVycm9yID0+IGxvYWRDbG91ZE1hcEVycm9yKHtlcnJvciwgcHJvdmlkZXIsIG9uRXJyb3J9KVxuICApO1xuXG4gIHJldHVybiB3aXRoVGFzayhuZXdTdGF0ZSwgdXBsb2FkRmlsZVRhc2spO1xufTtcblxuZnVuY3Rpb24gaXNGaWxlQ29uZmxpY3QoZXJyb3IpIHtcbiAgcmV0dXJuIGVycm9yICYmIGVycm9yLm1lc3NhZ2UgPT09IEZJTEVfQ09ORkxJQ1RfTVNHO1xufVxuXG5mdW5jdGlvbiBjaGVja0xvYWRNYXBSZXNwb25zZUVycm9yKHJlc3BvbnNlKSB7XG4gIGlmICghcmVzcG9uc2UgfHwgIWlzUGxhaW5PYmplY3QocmVzcG9uc2UpKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignTG9hZCBtYXAgcmVzcG9uc2UgaXMgZW1wdHknKTtcbiAgfVxuICBpZiAoIWlzUGxhaW5PYmplY3QocmVzcG9uc2UubWFwKSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoYExvYWQgbWFwIHJlc3BvbnNlIHNob3VsZCBiZSBhbiBvYmplY3QgcHJvcGVydHkgXCJtYXBcImApO1xuICB9XG4gIGlmICghcmVzcG9uc2UubWFwLmRhdGFzZXRzIHx8ICFyZXNwb25zZS5tYXAuY29uZmlnKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcihgTG9hZCBtYXAgcmVzcG9uc2UubWFwIHNob3VsZCBiZSBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0eSBkYXRhc2V0cyBvciBjb25maWdgKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXREYXRhc2V0SGFuZGxlcihmb3JtYXQpIHtcbiAgY29uc3QgZGVmYXVsdEhhbmRsZXIgPSBEQVRBU0VUX0hBTkRMRVJTW0RBVEFTRVRfRk9STUFUUy5jc3ZdO1xuICBpZiAoIWZvcm1hdCkge1xuICAgIENvbnNvbGUud2FybignZm9ybWF0IGlzIG5vdCBwcm92aWRlZCBpbiBsb2FkIG1hcCByZXNwb25zZSwgd2lsbCB1c2UgY3N2IGJ5IGRlZmF1bHQnKTtcbiAgICByZXR1cm4gZGVmYXVsdEhhbmRsZXI7XG4gIH1cblxuICBpZiAoIURBVEFTRVRfSEFORExFUlNbZm9ybWF0XSkge1xuICAgIGNvbnN0IHN1cHBvcnRlZEZvcm1hdCA9IE9iamVjdC5rZXlzKERBVEFTRVRfRk9STUFUUylcbiAgICAgIC5tYXAoayA9PiBgJyR7a30nYClcbiAgICAgIC5qb2luKCcsICcpO1xuICAgIENvbnNvbGUud2FybihcbiAgICAgIGB1bmtub3duIGZvcm1hdCAke2Zvcm1hdH0uIFBsZWFzZSB1c2Ugb25lIG9mICR7c3VwcG9ydGVkRm9ybWF0fSwgd2lsbCB1c2UgY3N2IGJ5IGRlZmF1bHRgXG4gICAgKTtcbiAgICByZXR1cm4gZGVmYXVsdEhhbmRsZXI7XG4gIH1cblxuICByZXR1cm4gREFUQVNFVF9IQU5ETEVSU1tmb3JtYXRdO1xufVxuXG5mdW5jdGlvbiBwYXJzZUxvYWRNYXBSZXNwb25zZShyZXNwb25zZSwgbG9hZFBhcmFtcywgcHJvdmlkZXIpIHtcbiAgY29uc3Qge21hcCwgZm9ybWF0fSA9IHJlc3BvbnNlO1xuICBjb25zdCBwcm9jZXNzb3JNZXRob2QgPSBnZXREYXRhc2V0SGFuZGxlcihmb3JtYXQpO1xuXG4gIGNvbnN0IHBhcnNlZERhdGFzZXRzID0gdG9BcnJheShtYXAuZGF0YXNldHMpLm1hcCgoZHMsIGkpID0+IHtcbiAgICBpZiAoZm9ybWF0ID09PSBEQVRBU0VUX0ZPUk1BVFMua2VwbGVyZ2wpIHtcbiAgICAgIC8vIG5vIG5lZWQgdG8gb2J0YWluIGlkLCBkaXJlY3RseSBwYXNzIHRoZW0gaW5cbiAgICAgIHJldHVybiBwcm9jZXNzb3JNZXRob2QoZHMpO1xuICAgIH1cbiAgICBjb25zdCBpbmZvID0gKGRzICYmIGRzLmluZm8pIHx8IHtpZDogZ2VuZXJhdGVIYXNoSWQoNil9O1xuICAgIGNvbnN0IGRhdGEgPSBwcm9jZXNzb3JNZXRob2QoZHMuZGF0YSB8fCBkcyk7XG4gICAgcmV0dXJuIHtpbmZvLCBkYXRhfTtcbiAgfSk7XG5cbiAgY29uc3QgaW5mbyA9IHtcbiAgICAuLi5tYXAuaW5mbyxcbiAgICBwcm92aWRlcjogcHJvdmlkZXIubmFtZSxcbiAgICBsb2FkUGFyYW1zXG4gIH07XG4gIHJldHVybiB7XG4gICAgZGF0YXNldHM6IHBhcnNlZERhdGFzZXRzLFxuICAgIGluZm8sXG4gICAgLi4uKG1hcC5jb25maWcgPyB7Y29uZmlnOiBtYXAuY29uZmlnfSA6IHt9KVxuICB9O1xufVxuXG4vKipcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9wcm92aWRlci1zdGF0ZS11cGRhdGVycycpLmxvYWRDbG91ZE1hcFN1Y2Nlc3NVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgbG9hZENsb3VkTWFwU3VjY2Vzc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7cmVzcG9uc2UsIGxvYWRQYXJhbXMsIHByb3ZpZGVyLCBvblN1Y2Nlc3MsIG9uRXJyb3J9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgY29uc3QgZm9ybWF0RXJyb3IgPSBjaGVja0xvYWRNYXBSZXNwb25zZUVycm9yKHJlc3BvbnNlKTtcbiAgaWYgKGZvcm1hdEVycm9yKSB7XG4gICAgLy8gaWYgcmVzcG9uc2UgZm9ybWF0IGlzIG5vdCBjb3JyZWN0XG4gICAgcmV0dXJuIGV4cG9ydEZpbGVFcnJvclVwZGF0ZXIoc3RhdGUsIHtcbiAgICAgIHBheWxvYWQ6IHtlcnJvcjogZm9ybWF0RXJyb3IsIHByb3ZpZGVyLCBvbkVycm9yfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgbWFwU2F2ZWQ6IHByb3ZpZGVyLm5hbWUsXG4gICAgY3VycmVudFByb3ZpZGVyOiBwcm92aWRlci5uYW1lLFxuICAgIGlzQ2xvdWRNYXBMb2FkaW5nOiBmYWxzZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2VcbiAgfTtcblxuICBjb25zdCBwYXlsb2FkID0gcGFyc2VMb2FkTWFwUmVzcG9uc2UocmVzcG9uc2UsIGxvYWRQYXJhbXMsIHByb3ZpZGVyKTtcblxuICBjb25zdCB0YXNrcyA9IFtcbiAgICBBQ1RJT05fVEFTSygpLm1hcChfID0+IGFkZERhdGFUb01hcChwYXlsb2FkKSksXG4gICAgY3JlYXRlQWN0aW9uVGFzayhvblN1Y2Nlc3MsIHtyZXNwb25zZSwgbG9hZFBhcmFtcywgcHJvdmlkZXJ9KSxcbiAgICBBQ1RJT05fVEFTSygpLm1hcChfID0+IHBvc3RTYXZlTG9hZFN1Y2Nlc3MoYE1hcCBmcm9tICR7cHJvdmlkZXIubmFtZX0gbG9hZGVkYCkpXG4gIF0uZmlsdGVyKGQgPT4gZCk7XG5cbiAgcmV0dXJuIHRhc2tzLmxlbmd0aCA/IHdpdGhUYXNrKG5ld1N0YXRlLCB0YXNrcykgOiBuZXdTdGF0ZTtcbn07XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykubG9hZENsb3VkTWFwRXJyb3JVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgbG9hZENsb3VkTWFwRXJyb3JVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9IGdldEVycm9yKGFjdGlvbi5wYXlsb2FkLmVycm9yKSB8fCBgRXJyb3IgbG9hZGluZyBzYXZlZCBtYXBgO1xuXG4gIENvbnNvbGUud2FybihtZXNzYWdlKTtcblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gICAgaXNDbG91ZE1hcExvYWRpbmc6IGZhbHNlLFxuICAgIHByb3ZpZGVyRXJyb3I6IG51bGxcbiAgfTtcblxuICByZXR1cm4gd2l0aFRhc2soXG4gICAgbmV3U3RhdGUsXG4gICAgY3JlYXRlR2xvYmFsTm90aWZpY2F0aW9uVGFza3Moe3R5cGU6ICdlcnJvcicsIG1lc3NhZ2UsIGRlbGF5Q2xvc2U6IGZhbHNlfSlcbiAgKTtcbn07XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykucmVzZXRQcm92aWRlclN0YXR1c1VwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCByZXNldFByb3ZpZGVyU3RhdHVzVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgaXNQcm92aWRlckxvYWRpbmc6IGZhbHNlLFxuICBwcm92aWRlckVycm9yOiBudWxsLFxuICBpc0Nsb3VkTWFwTG9hZGluZzogZmFsc2UsXG4gIHN1Y2Nlc3NJbmZvOiB7fVxufSk7XG5cbi8qKlxuICogU2V0IGN1cnJlbnQgY2xvdWRQcm92aWRlclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5zZXRDbG91ZFByb3ZpZGVyVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHNldENsb3VkUHJvdmlkZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gIHByb3ZpZGVyRXJyb3I6IG51bGwsXG4gIHN1Y2Nlc3NJbmZvOiB7fSxcbiAgY3VycmVudFByb3ZpZGVyOiBhY3Rpb24ucGF5bG9hZFxufSk7XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykuZ2V0U2F2ZWRNYXBzVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNhdmVkTWFwc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBwcm92aWRlciA9IGFjdGlvbi5wYXlsb2FkO1xuICBpZiAoIV92YWxpZGF0ZVByb3ZpZGVyKHByb3ZpZGVyLCAnbGlzdE1hcHMnKSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IGdldFNhdmVkTWFwc1Rhc2sgPSBHRVRfU0FWRURfTUFQU19UQVNLKHByb3ZpZGVyKS5iaW1hcChcbiAgICAvLyBzdWNjZXNzXG4gICAgdmlzdWFsaXphdGlvbnMgPT4gZ2V0U2F2ZWRNYXBzU3VjY2Vzcyh7dmlzdWFsaXphdGlvbnMsIHByb3ZpZGVyfSksXG4gICAgLy8gZXJyb3JcbiAgICBlcnJvciA9PiBnZXRTYXZlZE1hcHNFcnJvcih7ZXJyb3IsIHByb3ZpZGVyfSlcbiAgKTtcblxuICByZXR1cm4gd2l0aFRhc2soXG4gICAge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBpc1Byb3ZpZGVyTG9hZGluZzogdHJ1ZVxuICAgIH0sXG4gICAgZ2V0U2F2ZWRNYXBzVGFza1xuICApO1xufTtcblxuLyoqXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vcHJvdmlkZXItc3RhdGUtdXBkYXRlcnMnKS5nZXRTYXZlZE1hcHNTdWNjZXNzVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNhdmVkTWFwc1N1Y2Nlc3NVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gIHZpc3VhbGl6YXRpb25zOiBhY3Rpb24ucGF5bG9hZC52aXN1YWxpemF0aW9uc1xufSk7XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Byb3ZpZGVyLXN0YXRlLXVwZGF0ZXJzJykuZ2V0U2F2ZWRNYXBzRXJyb3JVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgZ2V0U2F2ZWRNYXBzRXJyb3JVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9XG4gICAgZ2V0RXJyb3IoYWN0aW9uLnBheWxvYWQuZXJyb3IpIHx8IGBFcnJvciBnZXR0aW5nIHNhdmVkIG1hcHMgZnJvbSAke3N0YXRlLmN1cnJlbnRQcm92aWRlcn1gO1xuXG4gIENvbnNvbGUud2FybihhY3Rpb24ucGF5bG9hZC5lcnJvcik7XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgY3VycmVudFByb3ZpZGVyOiBudWxsLFxuICAgIGlzUHJvdmlkZXJMb2FkaW5nOiBmYWxzZVxuICB9O1xuXG4gIHJldHVybiB3aXRoVGFzayhcbiAgICBuZXdTdGF0ZSxcbiAgICBjcmVhdGVHbG9iYWxOb3RpZmljYXRpb25UYXNrcyh7dHlwZTogJ2Vycm9yJywgbWVzc2FnZSwgZGVsYXlDbG9zZTogZmFsc2V9KVxuICApO1xufTtcbiJdfQ==