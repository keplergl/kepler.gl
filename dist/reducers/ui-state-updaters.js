"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLocaleUpdater = exports.showDatasetTableUpdater = exports.toggleSplitMapUpdater = exports.loadFilesErrUpdater = exports.loadFilesSuccessUpdater = exports.loadFilesUpdater = exports.removeNotificationUpdater = exports.addNotificationUpdater = exports.setExportMapHTMLModeUpdater = exports.setExportMapFormatUpdater = exports.setUserMapboxAccessTokenUpdater = exports.setExportDataUpdater = exports.setExportFilteredUpdater = exports.setExportDataTypeUpdater = exports.setExportSelectedDatasetUpdater = exports.startExportingImageUpdater = exports.cleanupExportImageUpdater = exports.setExportImageErrorUpdater = exports.setExportImageDataUriUpdater = exports.setExportImageSettingUpdater = exports.openDeleteModalUpdater = exports.toggleMapControlUpdater = exports.hideExportDropdownUpdater = exports.showExportDropdownUpdater = exports.toggleModalUpdater = exports.toggleSidePanelUpdater = exports.initUiStateUpdater = exports.INITIAL_UI_STATE = exports.DEFAULT_EXPORT_MAP = exports.DEFAULT_EXPORT_JSON = exports.DEFAULT_EXPORT_HTML = exports.DEFAULT_NOTIFICATIONS = exports.DEFAULT_EXPORT_DATA = exports.DEFAULT_LOAD_FILES = exports.DEFAULT_EXPORT_IMAGE = exports.DEFAULT_MAP_CONTROLS = exports.DEFAULT_MODAL = exports.DEFAULT_ACTIVE_SIDE_PANEL = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _defaultSettings = require("../constants/default-settings");

var _locales = require("../localization/locales");

var _notificationsUtils = require("../utils/notifications-utils");

var _exportUtils = require("../utils/export-utils");

var _composerHelpers = require("./composer-helpers");

var _DEFAULT_EXPORT_MAP;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_ACTIVE_SIDE_PANEL = 'layer';
exports.DEFAULT_ACTIVE_SIDE_PANEL = DEFAULT_ACTIVE_SIDE_PANEL;
var DEFAULT_MODAL = _defaultSettings.ADD_DATA_ID;
/**
 * Updaters for `uiState` reducer. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 *
 * @public
 * @example
 *
 * import keplerGlReducer, {uiStateUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // click button to close side panel
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             uiState: uiStateUpdaters.toggleSidePanelUpdater(
 *               uiState, {payload: null}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */

/* eslint-disable no-unused-vars */

exports.DEFAULT_MODAL = DEFAULT_MODAL;
var uiStateUpdaters = null;
/* eslint-enable no-unused-vars */

var DEFAULT_MAP_CONTROLS_FEATURES = {
  show: true,
  active: false,
  disableClose: false,
  // defines which map index users are interacting with (through map controls)
  activeMapIndex: 0
};
/**
 * A list of map control visibility and whether is it active.
 * @memberof uiStateUpdaters
 * @constant
 * @property visibleLayers Default: `{show: true, active: false}`
 * @property mapLegend Default: `{show: true, active: false}`
 * @property toggle3d Default: `{show: true}`
 * @property splitMap Default: `{show: true}`
 * @property mapDraw Default: `{show: true, active: false}`
 * @property mapLocale Default: `{show: false, active: false}`
 * @type {import('./ui-state-updaters').MapControls}
 * @public
 */

var DEFAULT_MAP_CONTROLS = ['visibleLayers', 'mapLegend', 'toggle3d', 'splitMap', 'mapDraw', 'mapLocale'].reduce(function (_final, current) {
  return _objectSpread(_objectSpread({}, _final), {}, (0, _defineProperty2["default"])({}, current, DEFAULT_MAP_CONTROLS_FEATURES));
}, {});
/**
 * Default image export config
 * @memberof uiStateUpdaters
 * @constant
 * @property ratio Default: `'SCREEN'`,
 * @property resolution Default: `'ONE_X'`,
 * @property legend Default: `false`,
 * @property mapH Default: 0,
 * @property mapW Default: 0,
 * @property imageSize Default: {zoomOffset: 0, scale: 1, imageW: 0, imageH: 0},
 * @property imageDataUri Default: `''`,
 * @property exporting Default: `false`
 * @property error Default: `false`
 * @type {import('./ui-state-updaters').ExportImage}
 * @public
 */

exports.DEFAULT_MAP_CONTROLS = DEFAULT_MAP_CONTROLS;
var DEFAULT_EXPORT_IMAGE = {
  // user options
  ratio: _defaultSettings.EXPORT_IMG_RATIOS.SCREEN,
  resolution: _defaultSettings.RESOLUTIONS.ONE_X,
  legend: false,
  mapH: 0,
  mapW: 0,
  imageSize: {
    zoomOffset: 0,
    scale: 1,
    imageW: 0,
    imageH: 0
  },
  // when this is set to true, the mock map viewport will move to the center of data
  center: false,
  // exporting state
  imageDataUri: '',
  // exporting: used to attach plot-container to dom
  exporting: false,
  // processing: used as loading indicator when export image is being produced
  processing: false,
  error: false
};
exports.DEFAULT_EXPORT_IMAGE = DEFAULT_EXPORT_IMAGE;
var DEFAULT_LOAD_FILES = {
  fileLoading: false
};
/**
 * Default initial `exportData` settings
 * @memberof uiStateUpdaters
 * @constant
 * @property selectedDataset Default: `''`,
 * @property dataType Default: `'csv'`,
 * @property filtered Default: `true`,
 * @type {import('./ui-state-updaters').ExportData}
 * @public
 */

exports.DEFAULT_LOAD_FILES = DEFAULT_LOAD_FILES;
var DEFAULT_EXPORT_DATA = {
  selectedDataset: '',
  dataType: _defaultSettings.EXPORT_DATA_TYPE.CSV,
  filtered: true
};
/**
 * @constant
 */

exports.DEFAULT_EXPORT_DATA = DEFAULT_EXPORT_DATA;
var DEFAULT_NOTIFICATIONS = [];
/**
 * @constant
 * @property exportMapboxAccessToken - Default: null, this is used when we provide a default mapbox token for users to take advantage of
 * @property userMapboxToken - Default: '', mapbox token provided by user through input field
 * @property mode - Default: 'READ', read only or editable
 * @type {import('./ui-state-updaters').ExportHtml}
 * @public
 */

exports.DEFAULT_NOTIFICATIONS = DEFAULT_NOTIFICATIONS;
var DEFAULT_EXPORT_HTML = {
  exportMapboxAccessToken: null,
  userMapboxToken: '',
  mode: _defaultSettings.EXPORT_HTML_MAP_MODES.READ
};
/**
 * @constant
 * @property hasData - Default: 'true',
 * @type {import('./ui-state-updaters').ExportJson}
 * @public
 */

exports.DEFAULT_EXPORT_HTML = DEFAULT_EXPORT_HTML;
var DEFAULT_EXPORT_JSON = {
  hasData: true
};
/**
 * Export Map Config
 * @constant
 * @property HTML - Default: 'DEFAULT_EXPORT_HTML',
 * @property JSON - Default: 'DEFAULT_EXPORT_JSON',
 * @property format - Default: 'HTML',
 * @type {import('./ui-state-updaters').ExportMap}
 * @public
 */

exports.DEFAULT_EXPORT_JSON = DEFAULT_EXPORT_JSON;
var DEFAULT_EXPORT_MAP = (_DEFAULT_EXPORT_MAP = {}, (0, _defineProperty2["default"])(_DEFAULT_EXPORT_MAP, _defaultSettings.EXPORT_MAP_FORMATS.HTML, DEFAULT_EXPORT_HTML), (0, _defineProperty2["default"])(_DEFAULT_EXPORT_MAP, _defaultSettings.EXPORT_MAP_FORMATS.JSON, DEFAULT_EXPORT_JSON), (0, _defineProperty2["default"])(_DEFAULT_EXPORT_MAP, "format", _defaultSettings.EXPORT_MAP_FORMATS.HTML), _DEFAULT_EXPORT_MAP);
/**
 * Default initial `uiState`
 * @memberof uiStateUpdaters
 * @constant
 * @property readOnly Default: `false`
 * @property activeSidePanel Default: `'layer'`
 * @property currentModal Default: `'addData'`
 * @property datasetKeyToRemove Default: `null`
 * @property visibleDropdown Default: `null`
 * @property exportImage Default: [`DEFAULT_EXPORT_IMAGE`](#default_export_image)
 * @property exportData Default: [`DEFAULT_EXPORT_DATA`](#default_export_data)
 * @property exportMap Default: [`DEFAULT_EXPORT_MAP`](#default_export_map)
 * @property mapControls Default: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @property notifications Default: `[]`
 * @property notifications Default: `[]`
 * @property loadFiles
 * @type {import('./ui-state-updaters').UiState}
 * @public
 */

exports.DEFAULT_EXPORT_MAP = DEFAULT_EXPORT_MAP;
var INITIAL_UI_STATE = {
  readOnly: false,
  activeSidePanel: DEFAULT_ACTIVE_SIDE_PANEL,
  currentModal: DEFAULT_MODAL,
  datasetKeyToRemove: null,
  visibleDropdown: null,
  // export image modal ui
  exportImage: DEFAULT_EXPORT_IMAGE,
  // export data modal ui
  exportData: DEFAULT_EXPORT_DATA,
  // html export
  exportMap: DEFAULT_EXPORT_MAP,
  // map control panels
  mapControls: DEFAULT_MAP_CONTROLS,
  // ui notifications
  notifications: DEFAULT_NOTIFICATIONS,
  // load files
  loadFiles: DEFAULT_LOAD_FILES,
  // Locale of the UI
  locale: _locales.LOCALE_CODES.en
};
/* Updaters */

/**
 * @memberof uiStateUpdaters

 */

exports.INITIAL_UI_STATE = INITIAL_UI_STATE;

var initUiStateUpdater = function initUiStateUpdater(state, action) {
  return _objectSpread(_objectSpread({}, state), (action.payload || {}).initialUiState);
};
/**
 * Toggle active side panel
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`. close side panel if `null`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').toggleSidePanelUpdater}
 * @public
 */


exports.initUiStateUpdater = initUiStateUpdater;

var toggleSidePanelUpdater = function toggleSidePanelUpdater(state, _ref) {
  var id = _ref.payload;
  return id === state.activeSidePanel ? state : _objectSpread(_objectSpread({}, state), {}, {
    activeSidePanel: id
  });
};
/**
 * Show and hide modal dialog
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @paramaction.payload id of modal to be shown, null to hide modals. One of:
 *  - [`DATA_TABLE_ID`](../constants/default-settings.md#data_table_id)
 *  - [`DELETE_DATA_ID`](../constants/default-settings.md#delete_data_id)
 *  - [`ADD_DATA_ID`](../constants/default-settings.md#add_data_id)
 *  - [`EXPORT_IMAGE_ID`](../constants/default-settings.md#export_image_id)
 *  - [`EXPORT_DATA_ID`](../constants/default-settings.md#export_data_id)
 *  - [`ADD_MAP_STYLE_ID`](../constants/default-settings.md#add_map_style_id)
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').toggleModalUpdater}
 * @public
 */


exports.toggleSidePanelUpdater = toggleSidePanelUpdater;

var toggleModalUpdater = function toggleModalUpdater(state, _ref2) {
  var id = _ref2.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    currentModal: id
  });
};
/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateUpdaters
 * @type {typeof import('./ui-state-updaters').showExportDropdownUpdater}
 * @public
 */


exports.toggleModalUpdater = toggleModalUpdater;

var showExportDropdownUpdater = function showExportDropdownUpdater(state, _ref3) {
  var id = _ref3.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    visibleDropdown: id
  });
};
/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateUpdaters
 * @type {typeof import('./ui-state-updaters').hideExportDropdownUpdater}
 * @public
 */


exports.showExportDropdownUpdater = showExportDropdownUpdater;

var hideExportDropdownUpdater = function hideExportDropdownUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    visibleDropdown: null
  });
};
/**
 * Toggle active map control panel
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action action
 * @param action.payload map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').toggleMapControlUpdater}
 * @public
 */


exports.hideExportDropdownUpdater = hideExportDropdownUpdater;

var toggleMapControlUpdater = function toggleMapControlUpdater(state, _ref4) {
  var _ref4$payload = _ref4.payload,
      panelId = _ref4$payload.panelId,
      _ref4$payload$index = _ref4$payload.index,
      index = _ref4$payload$index === void 0 ? 0 : _ref4$payload$index;
  return _objectSpread(_objectSpread({}, state), {}, {
    mapControls: _objectSpread(_objectSpread({}, state.mapControls), {}, (0, _defineProperty2["default"])({}, panelId, _objectSpread(_objectSpread({}, state.mapControls[panelId]), {}, {
      // this handles split map interaction
      // Toggling from within the same map will simply toggle the active property
      // Toggling from within different maps we set the active property to true
      active: index === state.mapControls[panelId].activeMapIndex ? !state.mapControls[panelId].active : true,
      activeMapIndex: index
    })))
  });
};
/**
 * Toggle active map control panel
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload dataset id
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').openDeleteModalUpdater}
 * @public
 */


exports.toggleMapControlUpdater = toggleMapControlUpdater;

var openDeleteModalUpdater = function openDeleteModalUpdater(state, _ref5) {
  var datasetKeyToRemove = _ref5.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    currentModal: _defaultSettings.DELETE_DATA_ID,
    datasetKeyToRemove: datasetKeyToRemove
  });
};
/**
 * Set `exportImage.legend` to `true` or `false`
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setExportImageSettingUpdater}
 * @public
 */


exports.openDeleteModalUpdater = openDeleteModalUpdater;

var setExportImageSettingUpdater = function setExportImageSettingUpdater(state, _ref6) {
  var newSetting = _ref6.payload;

  var updated = _objectSpread(_objectSpread({}, state.exportImage), newSetting);

  var imageSize = (0, _exportUtils.calculateExportImageSize)(updated) || state.exportImage.imageSize;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportImage: _objectSpread(_objectSpread({}, updated), {}, {
      imageSize: imageSize
    })
  });
};
/**
 * Set `exportImage.setExportImageDataUri` to a image dataUri
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload export image data uri
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setExportImageDataUriUpdater}
 * @public
 */


exports.setExportImageSettingUpdater = setExportImageSettingUpdater;

var setExportImageDataUriUpdater = function setExportImageDataUriUpdater(state, _ref7) {
  var dataUri = _ref7.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportImage: _objectSpread(_objectSpread({}, state.exportImage), {}, {
      processing: false,
      imageDataUri: dataUri
    })
  });
};
/**
 * @memberof uiStateUpdaters
 * @type {typeof import('./ui-state-updaters').setExportImageErrorUpdater}
 * @public
 */


exports.setExportImageDataUriUpdater = setExportImageDataUriUpdater;

var setExportImageErrorUpdater = function setExportImageErrorUpdater(state, _ref8) {
  var error = _ref8.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportImage: _objectSpread(_objectSpread({}, state.exportImage), {}, {
      processing: false,
      error: error
    })
  });
};
/**
 * Delete cached export image
 * @memberof uiStateUpdaters
 * @type {typeof import('./ui-state-updaters').cleanupExportImageUpdater}
 * @public
 */


exports.setExportImageErrorUpdater = setExportImageErrorUpdater;

var cleanupExportImageUpdater = function cleanupExportImageUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    exportImage: _objectSpread(_objectSpread({}, state.exportImage), {}, {
      exporting: false,
      imageDataUri: '',
      error: false,
      processing: false,
      center: false
    })
  });
};
/**
 * Start image exporting flow
 * @memberof uiStateUpdaters
 * @param state
 * @param options
 * @returns {UiState}
 * @type {typeof import('./ui-state-updaters').startExportingImage}
 * @public
 */


exports.cleanupExportImageUpdater = cleanupExportImageUpdater;

var startExportingImageUpdater = function startExportingImageUpdater(state, _ref9) {
  var _ref9$payload = _ref9.payload,
      options = _ref9$payload === void 0 ? {} : _ref9$payload;

  var imageSettings = _objectSpread(_objectSpread({}, options), {}, {
    exporting: true
  });

  return (0, _composerHelpers.compose_)([cleanupExportImageUpdater, (0, _composerHelpers.apply_)(setExportImageSettingUpdater, (0, _composerHelpers.payload_)(imageSettings))])(state);
};
/**
 * Set selected dataset for export
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload dataset id
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setExportSelectedDatasetUpdater}
 * @public
 */


exports.startExportingImageUpdater = startExportingImageUpdater;

var setExportSelectedDatasetUpdater = function setExportSelectedDatasetUpdater(state, _ref10) {
  var dataset = _ref10.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportData: _objectSpread(_objectSpread({}, state.exportData), {}, {
      selectedDataset: dataset
    })
  });
};
/**
 * Set data format for exporting data
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload one of `'text/csv'`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setExportDataTypeUpdater}
 * @public
 */


exports.setExportSelectedDatasetUpdater = setExportSelectedDatasetUpdater;

var setExportDataTypeUpdater = function setExportDataTypeUpdater(state, _ref11) {
  var dataType = _ref11.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportData: _objectSpread(_objectSpread({}, state.exportData), {}, {
      dataType: dataType
    })
  });
};
/**
 * Whether to export filtered data, `true` or `false`
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setExportFilteredUpdater}
 * @public
 */


exports.setExportDataTypeUpdater = setExportDataTypeUpdater;

var setExportFilteredUpdater = function setExportFilteredUpdater(state, _ref12) {
  var filtered = _ref12.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportData: _objectSpread(_objectSpread({}, state.exportData), {}, {
      filtered: filtered
    })
  });
};
/**
 * Whether to including data in map config, toggle between `true` or `false`
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setExportDataUpdater}
 * @public
 */


exports.setExportFilteredUpdater = setExportFilteredUpdater;

var setExportDataUpdater = function setExportDataUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    exportMap: _objectSpread(_objectSpread({}, state.exportMap), {}, (0, _defineProperty2["default"])({}, _defaultSettings.EXPORT_MAP_FORMATS.JSON, _objectSpread(_objectSpread({}, state.exportMap[_defaultSettings.EXPORT_MAP_FORMATS.JSON]), {}, {
      hasData: !state.exportMap[_defaultSettings.EXPORT_MAP_FORMATS.JSON].hasData
    })))
  });
};
/**
 * whether to export a mapbox access to HTML single page
 * @param state - `uiState`
 * @param action
 * @param action.payload
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setUserMapboxAccessTokenUpdater}
 * @public
 */


exports.setExportDataUpdater = setExportDataUpdater;

var setUserMapboxAccessTokenUpdater = function setUserMapboxAccessTokenUpdater(state, _ref13) {
  var userMapboxToken = _ref13.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportMap: _objectSpread(_objectSpread({}, state.exportMap), {}, (0, _defineProperty2["default"])({}, _defaultSettings.EXPORT_MAP_FORMATS.HTML, _objectSpread(_objectSpread({}, state.exportMap[_defaultSettings.EXPORT_MAP_FORMATS.HTML]), {}, {
      userMapboxToken: userMapboxToken
    })))
  });
};
/**
 * Sets the export map format
 * @param state - `uiState`
 * @param action
 * @param action.payload format to use to export the map into
 * @return nextState
 * @type {typeof import('./ui-state-updaters').setExportMapFormatUpdater}
 */


exports.setUserMapboxAccessTokenUpdater = setUserMapboxAccessTokenUpdater;

var setExportMapFormatUpdater = function setExportMapFormatUpdater(state, _ref14) {
  var format = _ref14.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportMap: _objectSpread(_objectSpread({}, state.exportMap), {}, {
      format: format
    })
  });
};
/**
 * Set the export html map mode
 * @param state - `uiState`
 * @param action
 * @param action.payload to be set (available modes: EXPORT_HTML_MAP_MODES)
 * @return nextState
 * @type {typeof import('./ui-state-updaters').setExportMapHTMLModeUpdater}
 */


exports.setExportMapFormatUpdater = setExportMapFormatUpdater;

var setExportMapHTMLModeUpdater = function setExportMapHTMLModeUpdater(state, _ref15) {
  var mode = _ref15.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    exportMap: _objectSpread(_objectSpread({}, state.exportMap), {}, (0, _defineProperty2["default"])({}, _defaultSettings.EXPORT_MAP_FORMATS.HTML, _objectSpread(_objectSpread({}, state.exportMap[_defaultSettings.EXPORT_MAP_FORMATS.HTML]), {}, {
      mode: mode
    })))
  });
};
/**
 * Adds a new notification.
 * Updates a notification in case of matching ids.
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload Params of a notification
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').addNotificationUpdater}
 * @public
 */


exports.setExportMapHTMLModeUpdater = setExportMapHTMLModeUpdater;

var addNotificationUpdater = function addNotificationUpdater(state, _ref16) {
  var payload = _ref16.payload;
  var notifications;
  var payloadId = payload === null || payload === void 0 ? void 0 : payload.id;
  var notificationToUpdate = payloadId ? state.notifications.find(function (n) {
    return n.id === payloadId;
  }) : null;

  if (notificationToUpdate) {
    notifications = state.notifications.map(function (n) {
      return n.id === payloadId ? (0, _notificationsUtils.createNotification)(payload) : n;
    });
  } else {
    notifications = [].concat((0, _toConsumableArray2["default"])(state.notifications || []), [(0, _notificationsUtils.createNotification)(payload)]);
  }

  return _objectSpread(_objectSpread({}, state), {}, {
    notifications: notifications
  });
};
/**
 * Remove a notification
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload id of the notification to be removed
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').removeNotificationUpdater}
 * @public
 */


exports.addNotificationUpdater = addNotificationUpdater;

var removeNotificationUpdater = function removeNotificationUpdater(state, _ref17) {
  var id = _ref17.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    notifications: state.notifications.filter(function (n) {
      return n.id !== id;
    })
  });
};
/**
 * Fired when file loading begin
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').loadFilesUpdater}
 * @public
 */


exports.removeNotificationUpdater = removeNotificationUpdater;

var loadFilesUpdater = function loadFilesUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    loadFiles: _objectSpread(_objectSpread({}, state.loadFiles), {}, {
      fileLoading: true
    })
  });
};
/**
 * Handles loading file success and set fileLoading property to false
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').loadFilesSuccessUpdater}
 */


exports.loadFilesUpdater = loadFilesUpdater;

var loadFilesSuccessUpdater = function loadFilesSuccessUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    loadFiles: _objectSpread(_objectSpread({}, state.loadFiles), {}, {
      fileLoading: false
    })
  });
};
/**
 * Handles load file error and set fileLoading property to false
 * @memberof uiStateUpdaters
 * @param state
 * @param action
 * @param action.error
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').loadFilesErrUpdater}
 * @public
 */


exports.loadFilesSuccessUpdater = loadFilesSuccessUpdater;

var loadFilesErrUpdater = function loadFilesErrUpdater(state, _ref18) {
  var error = _ref18.error;
  return addNotificationUpdater(_objectSpread(_objectSpread({}, state), {}, {
    loadFiles: _objectSpread(_objectSpread({}, state.loadFiles), {}, {
      fileLoading: false
    })
  }), {
    payload: (0, _notificationsUtils.errorNotification)({
      message: (error || {}).message || 'Failed to upload files',
      topic: _defaultSettings.DEFAULT_NOTIFICATION_TOPICS.global
    })
  });
};
/**
 * Handles toggle map split and reset all map control index to 0
 * @memberof uiStateUpdaters
 * @param state
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').toggleSplitMapUpdater}
 * @public
 */


exports.loadFilesErrUpdater = loadFilesErrUpdater;

var toggleSplitMapUpdater = function toggleSplitMapUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    mapControls: Object.entries(state.mapControls).reduce(function (acc, entry) {
      return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, entry[0], _objectSpread(_objectSpread({}, entry[1]), {}, {
        activeMapIndex: 0
      })));
    }, {})
  });
};
/**
 * Toggle modal data
 * @memberof uiStateUpdaters
 * @param state
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').showDatasetTableUpdater}
 * @public
 */


exports.toggleSplitMapUpdater = toggleSplitMapUpdater;

var showDatasetTableUpdater = function showDatasetTableUpdater(state) {
  return toggleModalUpdater(state, {
    payload: _defaultSettings.DATA_TABLE_ID
  });
};
/**
 * Set the locale of the UI
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload
 * @param action.payload.locale locale
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').setLocaleUpdater}
 * @public
 */


exports.showDatasetTableUpdater = showDatasetTableUpdater;

var setLocaleUpdater = function setLocaleUpdater(state, _ref19) {
  var locale = _ref19.payload.locale;
  return _objectSpread(_objectSpread({}, state), {}, {
    locale: locale
  });
};

exports.setLocaleUpdater = setLocaleUpdater;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy91aS1zdGF0ZS11cGRhdGVycy5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0FDVElWRV9TSURFX1BBTkVMIiwiREVGQVVMVF9NT0RBTCIsIkFERF9EQVRBX0lEIiwidWlTdGF0ZVVwZGF0ZXJzIiwiREVGQVVMVF9NQVBfQ09OVFJPTFNfRkVBVFVSRVMiLCJzaG93IiwiYWN0aXZlIiwiZGlzYWJsZUNsb3NlIiwiYWN0aXZlTWFwSW5kZXgiLCJERUZBVUxUX01BUF9DT05UUk9MUyIsInJlZHVjZSIsImZpbmFsIiwiY3VycmVudCIsIkRFRkFVTFRfRVhQT1JUX0lNQUdFIiwicmF0aW8iLCJFWFBPUlRfSU1HX1JBVElPUyIsIlNDUkVFTiIsInJlc29sdXRpb24iLCJSRVNPTFVUSU9OUyIsIk9ORV9YIiwibGVnZW5kIiwibWFwSCIsIm1hcFciLCJpbWFnZVNpemUiLCJ6b29tT2Zmc2V0Iiwic2NhbGUiLCJpbWFnZVciLCJpbWFnZUgiLCJjZW50ZXIiLCJpbWFnZURhdGFVcmkiLCJleHBvcnRpbmciLCJwcm9jZXNzaW5nIiwiZXJyb3IiLCJERUZBVUxUX0xPQURfRklMRVMiLCJmaWxlTG9hZGluZyIsIkRFRkFVTFRfRVhQT1JUX0RBVEEiLCJzZWxlY3RlZERhdGFzZXQiLCJkYXRhVHlwZSIsIkVYUE9SVF9EQVRBX1RZUEUiLCJDU1YiLCJmaWx0ZXJlZCIsIkRFRkFVTFRfTk9USUZJQ0FUSU9OUyIsIkRFRkFVTFRfRVhQT1JUX0hUTUwiLCJleHBvcnRNYXBib3hBY2Nlc3NUb2tlbiIsInVzZXJNYXBib3hUb2tlbiIsIm1vZGUiLCJFWFBPUlRfSFRNTF9NQVBfTU9ERVMiLCJSRUFEIiwiREVGQVVMVF9FWFBPUlRfSlNPTiIsImhhc0RhdGEiLCJERUZBVUxUX0VYUE9SVF9NQVAiLCJFWFBPUlRfTUFQX0ZPUk1BVFMiLCJIVE1MIiwiSlNPTiIsIklOSVRJQUxfVUlfU1RBVEUiLCJyZWFkT25seSIsImFjdGl2ZVNpZGVQYW5lbCIsImN1cnJlbnRNb2RhbCIsImRhdGFzZXRLZXlUb1JlbW92ZSIsInZpc2libGVEcm9wZG93biIsImV4cG9ydEltYWdlIiwiZXhwb3J0RGF0YSIsImV4cG9ydE1hcCIsIm1hcENvbnRyb2xzIiwibm90aWZpY2F0aW9ucyIsImxvYWRGaWxlcyIsImxvY2FsZSIsIkxPQ0FMRV9DT0RFUyIsImVuIiwiaW5pdFVpU3RhdGVVcGRhdGVyIiwic3RhdGUiLCJhY3Rpb24iLCJwYXlsb2FkIiwiaW5pdGlhbFVpU3RhdGUiLCJ0b2dnbGVTaWRlUGFuZWxVcGRhdGVyIiwiaWQiLCJ0b2dnbGVNb2RhbFVwZGF0ZXIiLCJzaG93RXhwb3J0RHJvcGRvd25VcGRhdGVyIiwiaGlkZUV4cG9ydERyb3Bkb3duVXBkYXRlciIsInRvZ2dsZU1hcENvbnRyb2xVcGRhdGVyIiwicGFuZWxJZCIsImluZGV4Iiwib3BlbkRlbGV0ZU1vZGFsVXBkYXRlciIsIkRFTEVURV9EQVRBX0lEIiwic2V0RXhwb3J0SW1hZ2VTZXR0aW5nVXBkYXRlciIsIm5ld1NldHRpbmciLCJ1cGRhdGVkIiwic2V0RXhwb3J0SW1hZ2VEYXRhVXJpVXBkYXRlciIsImRhdGFVcmkiLCJzZXRFeHBvcnRJbWFnZUVycm9yVXBkYXRlciIsImNsZWFudXBFeHBvcnRJbWFnZVVwZGF0ZXIiLCJzdGFydEV4cG9ydGluZ0ltYWdlVXBkYXRlciIsIm9wdGlvbnMiLCJpbWFnZVNldHRpbmdzIiwic2V0RXhwb3J0U2VsZWN0ZWREYXRhc2V0VXBkYXRlciIsImRhdGFzZXQiLCJzZXRFeHBvcnREYXRhVHlwZVVwZGF0ZXIiLCJzZXRFeHBvcnRGaWx0ZXJlZFVwZGF0ZXIiLCJzZXRFeHBvcnREYXRhVXBkYXRlciIsInNldFVzZXJNYXBib3hBY2Nlc3NUb2tlblVwZGF0ZXIiLCJzZXRFeHBvcnRNYXBGb3JtYXRVcGRhdGVyIiwiZm9ybWF0Iiwic2V0RXhwb3J0TWFwSFRNTE1vZGVVcGRhdGVyIiwiYWRkTm90aWZpY2F0aW9uVXBkYXRlciIsInBheWxvYWRJZCIsIm5vdGlmaWNhdGlvblRvVXBkYXRlIiwiZmluZCIsIm4iLCJtYXAiLCJyZW1vdmVOb3RpZmljYXRpb25VcGRhdGVyIiwiZmlsdGVyIiwibG9hZEZpbGVzVXBkYXRlciIsImxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyIiwibG9hZEZpbGVzRXJyVXBkYXRlciIsIm1lc3NhZ2UiLCJ0b3BpYyIsIkRFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUyIsImdsb2JhbCIsInRvZ2dsZVNwbGl0TWFwVXBkYXRlciIsIk9iamVjdCIsImVudHJpZXMiLCJhY2MiLCJlbnRyeSIsInNob3dEYXRhc2V0VGFibGVVcGRhdGVyIiwiREFUQV9UQUJMRV9JRCIsInNldExvY2FsZVVwZGF0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFxQkE7O0FBV0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRU8sSUFBTUEseUJBQXlCLEdBQUcsT0FBbEM7O0FBQ0EsSUFBTUMsYUFBYSxHQUFHQyw0QkFBdEI7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7OztBQUNBLElBQU1DLGVBQWUsR0FBRyxJQUF4QjtBQUNBOztBQUVBLElBQU1DLDZCQUE2QixHQUFHO0FBQ3BDQyxFQUFBQSxJQUFJLEVBQUUsSUFEOEI7QUFFcENDLEVBQUFBLE1BQU0sRUFBRSxLQUY0QjtBQUdwQ0MsRUFBQUEsWUFBWSxFQUFFLEtBSHNCO0FBSXBDO0FBQ0FDLEVBQUFBLGNBQWMsRUFBRTtBQUxvQixDQUF0QztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNPLElBQU1DLG9CQUFvQixHQUFHLENBQ2xDLGVBRGtDLEVBRWxD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LHlDQUNyQ0EsS0FEcUM7QUFFeENQLElBQUFBLFdBQVcsRUFBRXdELE1BQU0sQ0FBQ0MsT0FBUCxDQUFlbEQsS0FBSyxDQUFDUCxXQUFyQixFQUFrQ3JELE1BQWxDLENBQ1gsVUFBQytHLEdBQUQsRUFBTUMsS0FBTjtBQUFBLDZDQUNLRCxHQURMLDRDQUVHQyxLQUFLLENBQUMsQ0FBRCxDQUZSLGtDQUdPQSxLQUFLLENBQUMsQ0FBRCxDQUhaO0FBSUlsSCxRQUFBQSxjQUFjLEVBQUU7QUFKcEI7QUFBQSxLQURXLEVBUVgsRUFSVztBQUYyQjtBQUFBLENBQW5DO0FBY1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxJQUFNbUgsdUJBQXVCLEdBQUcsU0FBMUJBLHVCQUEwQixDQUFBckQsS0FBSztBQUFBLFNBQUlNLGtCQUFrQixDQUFDTixLQUFELEVBQVE7QUFBQ0UsSUFBQUEsT0FBTyxFQUFFb0Q7QUFBVixHQUFSLENBQXRCO0FBQUEsQ0FBckM7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUNPLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQ3ZELEtBQUQ7QUFBQSxNQUFtQkosTUFBbkIsVUFBU00sT0FBVCxDQUFtQk4sTUFBbkI7QUFBQSx5Q0FDM0JJLEtBRDJCO0FBRTlCSixJQUFBQSxNQUFNLEVBQU5BO0FBRjhCO0FBQUEsQ0FBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vLyBAdHMtbm9jaGVja1xuaW1wb3J0IHtcbiAgQUREX0RBVEFfSUQsXG4gIERBVEFfVEFCTEVfSUQsXG4gIERFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUyxcbiAgREVMRVRFX0RBVEFfSUQsXG4gIEVYUE9SVF9EQVRBX1RZUEUsXG4gIEVYUE9SVF9IVE1MX01BUF9NT0RFUyxcbiAgRVhQT1JUX0lNR19SQVRJT1MsXG4gIEVYUE9SVF9NQVBfRk9STUFUUyxcbiAgUkVTT0xVVElPTlNcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtMT0NBTEVfQ09ERVN9IGZyb20gJ2xvY2FsaXphdGlvbi9sb2NhbGVzJztcbmltcG9ydCB7Y3JlYXRlTm90aWZpY2F0aW9uLCBlcnJvck5vdGlmaWNhdGlvbn0gZnJvbSAndXRpbHMvbm90aWZpY2F0aW9ucy11dGlscyc7XG5pbXBvcnQge2NhbGN1bGF0ZUV4cG9ydEltYWdlU2l6ZX0gZnJvbSAndXRpbHMvZXhwb3J0LXV0aWxzJztcbmltcG9ydCB7cGF5bG9hZF8sIGFwcGx5XywgY29tcG9zZV99IGZyb20gJy4vY29tcG9zZXItaGVscGVycyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0FDVElWRV9TSURFX1BBTkVMID0gJ2xheWVyJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX01PREFMID0gQUREX0RBVEFfSUQ7XG5cbi8qKlxuICogVXBkYXRlcnMgZm9yIGB1aVN0YXRlYCByZWR1Y2VyLiBDYW4gYmUgdXNlZCBpbiB5b3VyIHJvb3QgcmVkdWNlciB0byBkaXJlY3RseSBtb2RpZnkga2VwbGVyLmdsJ3Mgc3RhdGUuXG4gKiBSZWFkIG1vcmUgYWJvdXQgW1VzaW5nIHVwZGF0ZXJzXSguLi9hZHZhbmNlZC11c2FnZS91c2luZy11cGRhdGVycy5tZClcbiAqXG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICpcbiAqIGltcG9ydCBrZXBsZXJHbFJlZHVjZXIsIHt1aVN0YXRlVXBkYXRlcnN9IGZyb20gJ2tlcGxlci5nbC9yZWR1Y2Vycyc7XG4gKiAvLyBSb290IFJlZHVjZXJcbiAqIGNvbnN0IHJlZHVjZXJzID0gY29tYmluZVJlZHVjZXJzKHtcbiAqICBrZXBsZXJHbDoga2VwbGVyR2xSZWR1Y2VyLFxuICogIGFwcDogYXBwUmVkdWNlclxuICogfSk7XG4gKlxuICogY29uc3QgY29tcG9zZWRSZWR1Y2VyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAqICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gKiAgICAvLyBjbGljayBidXR0b24gdG8gY2xvc2Ugc2lkZSBwYW5lbFxuICogICAgY2FzZSAnQ0xJQ0tfQlVUVE9OJzpcbiAqICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAuLi5zdGF0ZSxcbiAqICAgICAgICBrZXBsZXJHbDoge1xuICogICAgICAgICAgLi4uc3RhdGUua2VwbGVyR2wsXG4gKiAgICAgICAgICBmb286IHtcbiAqICAgICAgICAgICAgIC4uLnN0YXRlLmtlcGxlckdsLmZvbyxcbiAqICAgICAgICAgICAgIHVpU3RhdGU6IHVpU3RhdGVVcGRhdGVycy50b2dnbGVTaWRlUGFuZWxVcGRhdGVyKFxuICogICAgICAgICAgICAgICB1aVN0YXRlLCB7cGF5bG9hZDogbnVsbH1cbiAqICAgICAgICAgICAgIClcbiAqICAgICAgICAgIH1cbiAqICAgICAgICB9XG4gKiAgICAgIH07XG4gKiAgfVxuICogIHJldHVybiByZWR1Y2VycyhzdGF0ZSwgYWN0aW9uKTtcbiAqIH07XG4gKlxuICogZXhwb3J0IGRlZmF1bHQgY29tcG9zZWRSZWR1Y2VyO1xuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuY29uc3QgdWlTdGF0ZVVwZGF0ZXJzID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuY29uc3QgREVGQVVMVF9NQVBfQ09OVFJPTFNfRkVBVFVSRVMgPSB7XG4gIHNob3c6IHRydWUsXG4gIGFjdGl2ZTogZmFsc2UsXG4gIGRpc2FibGVDbG9zZTogZmFsc2UsXG4gIC8vIGRlZmluZXMgd2hpY2ggbWFwIGluZGV4IHVzZXJzIGFyZSBpbnRlcmFjdGluZyB3aXRoICh0aHJvdWdoIG1hcCBjb250cm9scylcbiAgYWN0aXZlTWFwSW5kZXg6IDBcbn07XG5cbi8qKlxuICogQSBsaXN0IG9mIG1hcCBjb250cm9sIHZpc2liaWxpdHkgYW5kIHdoZXRoZXIgaXMgaXQgYWN0aXZlLlxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQGNvbnN0YW50XG4gKiBAcHJvcGVydHkgdmlzaWJsZUxheWVycyBEZWZhdWx0OiBge3Nob3c6IHRydWUsIGFjdGl2ZTogZmFsc2V9YFxuICogQHByb3BlcnR5IG1hcExlZ2VuZCBEZWZhdWx0OiBge3Nob3c6IHRydWUsIGFjdGl2ZTogZmFsc2V9YFxuICogQHByb3BlcnR5IHRvZ2dsZTNkIERlZmF1bHQ6IGB7c2hvdzogdHJ1ZX1gXG4gKiBAcHJvcGVydHkgc3BsaXRNYXAgRGVmYXVsdDogYHtzaG93OiB0cnVlfWBcbiAqIEBwcm9wZXJ0eSBtYXBEcmF3IERlZmF1bHQ6IGB7c2hvdzogdHJ1ZSwgYWN0aXZlOiBmYWxzZX1gXG4gKiBAcHJvcGVydHkgbWFwTG9jYWxlIERlZmF1bHQ6IGB7c2hvdzogZmFsc2UsIGFjdGl2ZTogZmFsc2V9YFxuICogQHR5cGUge2ltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLk1hcENvbnRyb2xzfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9NQVBfQ09OVFJPTFMgPSBbXG4gICd2aXNpYmxlTGF5ZXJzJyxcbiAgJ21hcExlZ2VuZCcsXG4gICd0b2dnbGUzZCcsXG4gICdzcGxpdE1hcCcsXG4gICdtYXBEcmF3JyxcbiAgJ21hcExvY2FsZSdcbl0ucmVkdWNlKFxuICAoZmluYWwsIGN1cnJlbnQpID0+ICh7XG4gICAgLi4uZmluYWwsXG4gICAgW2N1cnJlbnRdOiBERUZBVUxUX01BUF9DT05UUk9MU19GRUFUVVJFU1xuICB9KSxcbiAge31cbik7XG5cbi8qKlxuICogRGVmYXVsdCBpbWFnZSBleHBvcnQgY29uZmlnXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAY29uc3RhbnRcbiAqIEBwcm9wZXJ0eSByYXRpbyBEZWZhdWx0OiBgJ1NDUkVFTidgLFxuICogQHByb3BlcnR5IHJlc29sdXRpb24gRGVmYXVsdDogYCdPTkVfWCdgLFxuICogQHByb3BlcnR5IGxlZ2VuZCBEZWZhdWx0OiBgZmFsc2VgLFxuICogQHByb3BlcnR5IG1hcEggRGVmYXVsdDogMCxcbiAqIEBwcm9wZXJ0eSBtYXBXIERlZmF1bHQ6IDAsXG4gKiBAcHJvcGVydHkgaW1hZ2VTaXplIERlZmF1bHQ6IHt6b29tT2Zmc2V0OiAwLCBzY2FsZTogMSwgaW1hZ2VXOiAwLCBpbWFnZUg6IDB9LFxuICogQHByb3BlcnR5IGltYWdlRGF0YVVyaSBEZWZhdWx0OiBgJydgLFxuICogQHByb3BlcnR5IGV4cG9ydGluZyBEZWZhdWx0OiBgZmFsc2VgXG4gKiBAcHJvcGVydHkgZXJyb3IgRGVmYXVsdDogYGZhbHNlYFxuICogQHR5cGUge2ltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLkV4cG9ydEltYWdlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9FWFBPUlRfSU1BR0UgPSB7XG4gIC8vIHVzZXIgb3B0aW9uc1xuICByYXRpbzogRVhQT1JUX0lNR19SQVRJT1MuU0NSRUVOLFxuICByZXNvbHV0aW9uOiBSRVNPTFVUSU9OUy5PTkVfWCxcbiAgbGVnZW5kOiBmYWxzZSxcbiAgbWFwSDogMCxcbiAgbWFwVzogMCxcbiAgaW1hZ2VTaXplOiB7XG4gICAgem9vbU9mZnNldDogMCxcbiAgICBzY2FsZTogMSxcbiAgICBpbWFnZVc6IDAsXG4gICAgaW1hZ2VIOiAwXG4gIH0sXG4gIC8vIHdoZW4gdGhpcyBpcyBzZXQgdG8gdHJ1ZSwgdGhlIG1vY2sgbWFwIHZpZXdwb3J0IHdpbGwgbW92ZSB0byB0aGUgY2VudGVyIG9mIGRhdGFcbiAgY2VudGVyOiBmYWxzZSxcbiAgLy8gZXhwb3J0aW5nIHN0YXRlXG4gIGltYWdlRGF0YVVyaTogJycsXG4gIC8vIGV4cG9ydGluZzogdXNlZCB0byBhdHRhY2ggcGxvdC1jb250YWluZXIgdG8gZG9tXG4gIGV4cG9ydGluZzogZmFsc2UsXG4gIC8vIHByb2Nlc3Npbmc6IHVzZWQgYXMgbG9hZGluZyBpbmRpY2F0b3Igd2hlbiBleHBvcnQgaW1hZ2UgaXMgYmVpbmcgcHJvZHVjZWRcbiAgcHJvY2Vzc2luZzogZmFsc2UsXG4gIGVycm9yOiBmYWxzZVxufTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTE9BRF9GSUxFUyA9IHtcbiAgZmlsZUxvYWRpbmc6IGZhbHNlXG59O1xuXG4vKipcbiAqIERlZmF1bHQgaW5pdGlhbCBgZXhwb3J0RGF0YWAgc2V0dGluZ3NcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHNlbGVjdGVkRGF0YXNldCBEZWZhdWx0OiBgJydgLFxuICogQHByb3BlcnR5IGRhdGFUeXBlIERlZmF1bHQ6IGAnY3N2J2AsXG4gKiBAcHJvcGVydHkgZmlsdGVyZWQgRGVmYXVsdDogYHRydWVgLFxuICogQHR5cGUge2ltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLkV4cG9ydERhdGF9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VYUE9SVF9EQVRBID0ge1xuICBzZWxlY3RlZERhdGFzZXQ6ICcnLFxuICBkYXRhVHlwZTogRVhQT1JUX0RBVEFfVFlQRS5DU1YsXG4gIGZpbHRlcmVkOiB0cnVlXG59O1xuXG4vKipcbiAqIEBjb25zdGFudFxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9OT1RJRklDQVRJT05TID0gW107XG5cbi8qKlxuICogQGNvbnN0YW50XG4gKiBAcHJvcGVydHkgZXhwb3J0TWFwYm94QWNjZXNzVG9rZW4gLSBEZWZhdWx0OiBudWxsLCB0aGlzIGlzIHVzZWQgd2hlbiB3ZSBwcm92aWRlIGEgZGVmYXVsdCBtYXBib3ggdG9rZW4gZm9yIHVzZXJzIHRvIHRha2UgYWR2YW50YWdlIG9mXG4gKiBAcHJvcGVydHkgdXNlck1hcGJveFRva2VuIC0gRGVmYXVsdDogJycsIG1hcGJveCB0b2tlbiBwcm92aWRlZCBieSB1c2VyIHRocm91Z2ggaW5wdXQgZmllbGRcbiAqIEBwcm9wZXJ0eSBtb2RlIC0gRGVmYXVsdDogJ1JFQUQnLCByZWFkIG9ubHkgb3IgZWRpdGFibGVcbiAqIEB0eXBlIHtpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5FeHBvcnRIdG1sfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9FWFBPUlRfSFRNTCA9IHtcbiAgZXhwb3J0TWFwYm94QWNjZXNzVG9rZW46IG51bGwsXG4gIHVzZXJNYXBib3hUb2tlbjogJycsXG4gIG1vZGU6IEVYUE9SVF9IVE1MX01BUF9NT0RFUy5SRUFEXG59O1xuXG4vKipcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IGhhc0RhdGEgLSBEZWZhdWx0OiAndHJ1ZScsXG4gKiBAdHlwZSB7aW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuRXhwb3J0SnNvbn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfRVhQT1JUX0pTT04gPSB7XG4gIGhhc0RhdGE6IHRydWVcbn07XG5cbi8qKlxuICogRXhwb3J0IE1hcCBDb25maWdcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IEhUTUwgLSBEZWZhdWx0OiAnREVGQVVMVF9FWFBPUlRfSFRNTCcsXG4gKiBAcHJvcGVydHkgSlNPTiAtIERlZmF1bHQ6ICdERUZBVUxUX0VYUE9SVF9KU09OJyxcbiAqIEBwcm9wZXJ0eSBmb3JtYXQgLSBEZWZhdWx0OiAnSFRNTCcsXG4gKiBAdHlwZSB7aW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuRXhwb3J0TWFwfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9FWFBPUlRfTUFQID0ge1xuICBbRVhQT1JUX01BUF9GT1JNQVRTLkhUTUxdOiBERUZBVUxUX0VYUE9SVF9IVE1MLFxuICBbRVhQT1JUX01BUF9GT1JNQVRTLkpTT05dOiBERUZBVUxUX0VYUE9SVF9KU09OLFxuICBmb3JtYXQ6IEVYUE9SVF9NQVBfRk9STUFUUy5IVE1MXG59O1xuXG4vKipcbiAqIERlZmF1bHQgaW5pdGlhbCBgdWlTdGF0ZWBcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHJlYWRPbmx5IERlZmF1bHQ6IGBmYWxzZWBcbiAqIEBwcm9wZXJ0eSBhY3RpdmVTaWRlUGFuZWwgRGVmYXVsdDogYCdsYXllcidgXG4gKiBAcHJvcGVydHkgY3VycmVudE1vZGFsIERlZmF1bHQ6IGAnYWRkRGF0YSdgXG4gKiBAcHJvcGVydHkgZGF0YXNldEtleVRvUmVtb3ZlIERlZmF1bHQ6IGBudWxsYFxuICogQHByb3BlcnR5IHZpc2libGVEcm9wZG93biBEZWZhdWx0OiBgbnVsbGBcbiAqIEBwcm9wZXJ0eSBleHBvcnRJbWFnZSBEZWZhdWx0OiBbYERFRkFVTFRfRVhQT1JUX0lNQUdFYF0oI2RlZmF1bHRfZXhwb3J0X2ltYWdlKVxuICogQHByb3BlcnR5IGV4cG9ydERhdGEgRGVmYXVsdDogW2BERUZBVUxUX0VYUE9SVF9EQVRBYF0oI2RlZmF1bHRfZXhwb3J0X2RhdGEpXG4gKiBAcHJvcGVydHkgZXhwb3J0TWFwIERlZmF1bHQ6IFtgREVGQVVMVF9FWFBPUlRfTUFQYF0oI2RlZmF1bHRfZXhwb3J0X21hcClcbiAqIEBwcm9wZXJ0eSBtYXBDb250cm9scyBEZWZhdWx0OiBbYERFRkFVTFRfTUFQX0NPTlRST0xTYF0oI2RlZmF1bHRfbWFwX2NvbnRyb2xzKVxuICogQHByb3BlcnR5IG5vdGlmaWNhdGlvbnMgRGVmYXVsdDogYFtdYFxuICogQHByb3BlcnR5IG5vdGlmaWNhdGlvbnMgRGVmYXVsdDogYFtdYFxuICogQHByb3BlcnR5IGxvYWRGaWxlc1xuICogQHR5cGUge2ltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLlVpU3RhdGV9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBJTklUSUFMX1VJX1NUQVRFID0ge1xuICByZWFkT25seTogZmFsc2UsXG4gIGFjdGl2ZVNpZGVQYW5lbDogREVGQVVMVF9BQ1RJVkVfU0lERV9QQU5FTCxcbiAgY3VycmVudE1vZGFsOiBERUZBVUxUX01PREFMLFxuICBkYXRhc2V0S2V5VG9SZW1vdmU6IG51bGwsXG4gIHZpc2libGVEcm9wZG93bjogbnVsbCxcbiAgLy8gZXhwb3J0IGltYWdlIG1vZGFsIHVpXG4gIGV4cG9ydEltYWdlOiBERUZBVUxUX0VYUE9SVF9JTUFHRSxcbiAgLy8gZXhwb3J0IGRhdGEgbW9kYWwgdWlcbiAgZXhwb3J0RGF0YTogREVGQVVMVF9FWFBPUlRfREFUQSxcbiAgLy8gaHRtbCBleHBvcnRcbiAgZXhwb3J0TWFwOiBERUZBVUxUX0VYUE9SVF9NQVAsXG4gIC8vIG1hcCBjb250cm9sIHBhbmVsc1xuICBtYXBDb250cm9sczogREVGQVVMVF9NQVBfQ09OVFJPTFMsXG4gIC8vIHVpIG5vdGlmaWNhdGlvbnNcbiAgbm90aWZpY2F0aW9uczogREVGQVVMVF9OT1RJRklDQVRJT05TLFxuICAvLyBsb2FkIGZpbGVzXG4gIGxvYWRGaWxlczogREVGQVVMVF9MT0FEX0ZJTEVTLFxuICAvLyBMb2NhbGUgb2YgdGhlIFVJXG4gIGxvY2FsZTogTE9DQUxFX0NPREVTLmVuXG59O1xuXG4vKiBVcGRhdGVycyAqL1xuLyoqXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG5cbiAqL1xuZXhwb3J0IGNvbnN0IGluaXRVaVN0YXRlVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgLi4uKGFjdGlvbi5wYXlsb2FkIHx8IHt9KS5pbml0aWFsVWlTdGF0ZVxufSk7XG5cbi8qKlxuICogVG9nZ2xlIGFjdGl2ZSBzaWRlIHBhbmVsXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQgaWQgb2Ygc2lkZSBwYW5lbCB0byBiZSBzaG93biwgb25lIG9mIGBsYXllcmAsIGBmaWx0ZXJgLCBgaW50ZXJhY3Rpb25gLCBgbWFwYC4gY2xvc2Ugc2lkZSBwYW5lbCBpZiBgbnVsbGBcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVTaWRlUGFuZWxVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlU2lkZVBhbmVsVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IGlkfSkgPT4ge1xuICByZXR1cm4gaWQgPT09IHN0YXRlLmFjdGl2ZVNpZGVQYW5lbFxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGFjdGl2ZVNpZGVQYW5lbDogaWRcbiAgICAgIH07XG59O1xuXG4vKipcbiAqIFNob3cgYW5kIGhpZGUgbW9kYWwgZGlhbG9nXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW1hY3Rpb24ucGF5bG9hZCBpZCBvZiBtb2RhbCB0byBiZSBzaG93biwgbnVsbCB0byBoaWRlIG1vZGFscy4gT25lIG9mOlxuICogIC0gW2BEQVRBX1RBQkxFX0lEYF0oLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MubWQjZGF0YV90YWJsZV9pZClcbiAqICAtIFtgREVMRVRFX0RBVEFfSURgXSguLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5tZCNkZWxldGVfZGF0YV9pZClcbiAqICAtIFtgQUREX0RBVEFfSURgXSguLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5tZCNhZGRfZGF0YV9pZClcbiAqICAtIFtgRVhQT1JUX0lNQUdFX0lEYF0oLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MubWQjZXhwb3J0X2ltYWdlX2lkKVxuICogIC0gW2BFWFBPUlRfREFUQV9JRGBdKC4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzLm1kI2V4cG9ydF9kYXRhX2lkKVxuICogIC0gW2BBRERfTUFQX1NUWUxFX0lEYF0oLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MubWQjYWRkX21hcF9zdHlsZV9pZClcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVNb2RhbFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVNb2RhbFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBpZH0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjdXJyZW50TW9kYWw6IGlkXG59KTtcblxuLyoqXG4gKiBIaWRlIGFuZCBzaG93IHNpZGUgcGFuZWwgaGVhZGVyIGRyb3Bkb3duLCBhY3RpdmF0ZWQgYnkgY2xpY2tpbmcgdGhlIHNoYXJlIGxpbmsgb24gdG9wIG9mIHRoZSBzaWRlIHBhbmVsXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNob3dFeHBvcnREcm9wZG93blVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzaG93RXhwb3J0RHJvcGRvd25VcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogaWR9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgdmlzaWJsZURyb3Bkb3duOiBpZFxufSk7XG5cbi8qKlxuICogSGlkZSBzaWRlIHBhbmVsIGhlYWRlciBkcm9wZG93biwgYWN0aXZhdGVkIGJ5IGNsaWNraW5nIHRoZSBzaGFyZSBsaW5rIG9uIHRvcCBvZiB0aGUgc2lkZSBwYW5lbFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5oaWRlRXhwb3J0RHJvcGRvd25VcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgaGlkZUV4cG9ydERyb3Bkb3duVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICB2aXNpYmxlRHJvcGRvd246IG51bGxcbn0pO1xuXG4vKipcbiAqIFRvZ2dsZSBhY3RpdmUgbWFwIGNvbnRyb2wgcGFuZWxcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb24gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQgbWFwIGNvbnRyb2wgcGFuZWwgaWQsIG9uZSBvZiB0aGUga2V5cyBvZjogW2BERUZBVUxUX01BUF9DT05UUk9MU2BdKCNkZWZhdWx0X21hcF9jb250cm9scylcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVNYXBDb250cm9sVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZU1hcENvbnRyb2xVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDoge3BhbmVsSWQsIGluZGV4ID0gMH19KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbWFwQ29udHJvbHM6IHtcbiAgICAuLi5zdGF0ZS5tYXBDb250cm9scyxcbiAgICBbcGFuZWxJZF06IHtcbiAgICAgIC4uLnN0YXRlLm1hcENvbnRyb2xzW3BhbmVsSWRdLFxuICAgICAgLy8gdGhpcyBoYW5kbGVzIHNwbGl0IG1hcCBpbnRlcmFjdGlvblxuICAgICAgLy8gVG9nZ2xpbmcgZnJvbSB3aXRoaW4gdGhlIHNhbWUgbWFwIHdpbGwgc2ltcGx5IHRvZ2dsZSB0aGUgYWN0aXZlIHByb3BlcnR5XG4gICAgICAvLyBUb2dnbGluZyBmcm9tIHdpdGhpbiBkaWZmZXJlbnQgbWFwcyB3ZSBzZXQgdGhlIGFjdGl2ZSBwcm9wZXJ0eSB0byB0cnVlXG4gICAgICBhY3RpdmU6XG4gICAgICAgIGluZGV4ID09PSBzdGF0ZS5tYXBDb250cm9sc1twYW5lbElkXS5hY3RpdmVNYXBJbmRleFxuICAgICAgICAgID8gIXN0YXRlLm1hcENvbnRyb2xzW3BhbmVsSWRdLmFjdGl2ZVxuICAgICAgICAgIDogdHJ1ZSxcbiAgICAgIGFjdGl2ZU1hcEluZGV4OiBpbmRleFxuICAgIH1cbiAgfVxufSk7XG5cbi8qKlxuICogVG9nZ2xlIGFjdGl2ZSBtYXAgY29udHJvbCBwYW5lbFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkIGRhdGFzZXQgaWRcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5vcGVuRGVsZXRlTW9kYWxVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgb3BlbkRlbGV0ZU1vZGFsVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IGRhdGFzZXRLZXlUb1JlbW92ZX0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjdXJyZW50TW9kYWw6IERFTEVURV9EQVRBX0lELFxuICBkYXRhc2V0S2V5VG9SZW1vdmVcbn0pO1xuXG4vKipcbiAqIFNldCBgZXhwb3J0SW1hZ2UubGVnZW5kYCB0byBgdHJ1ZWAgb3IgYGZhbHNlYFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldEV4cG9ydEltYWdlU2V0dGluZ1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRJbWFnZVNldHRpbmdVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogbmV3U2V0dGluZ30pID0+IHtcbiAgY29uc3QgdXBkYXRlZCA9IHsuLi5zdGF0ZS5leHBvcnRJbWFnZSwgLi4ubmV3U2V0dGluZ307XG4gIGNvbnN0IGltYWdlU2l6ZSA9IGNhbGN1bGF0ZUV4cG9ydEltYWdlU2l6ZSh1cGRhdGVkKSB8fCBzdGF0ZS5leHBvcnRJbWFnZS5pbWFnZVNpemU7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgLi4udXBkYXRlZCxcbiAgICAgIGltYWdlU2l6ZVxuICAgIH1cbiAgfTtcbn07XG5cbi8qKlxuICogU2V0IGBleHBvcnRJbWFnZS5zZXRFeHBvcnRJbWFnZURhdGFVcmlgIHRvIGEgaW1hZ2UgZGF0YVVyaVxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkIGV4cG9ydCBpbWFnZSBkYXRhIHVyaVxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldEV4cG9ydEltYWdlRGF0YVVyaVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRJbWFnZURhdGFVcmlVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogZGF0YVVyaX0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRJbWFnZToge1xuICAgIC4uLnN0YXRlLmV4cG9ydEltYWdlLFxuICAgIHByb2Nlc3Npbmc6IGZhbHNlLFxuICAgIGltYWdlRGF0YVVyaTogZGF0YVVyaVxuICB9XG59KTtcblxuLyoqXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldEV4cG9ydEltYWdlRXJyb3JVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0SW1hZ2VFcnJvclVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBlcnJvcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRJbWFnZToge1xuICAgIC4uLnN0YXRlLmV4cG9ydEltYWdlLFxuICAgIHByb2Nlc3Npbmc6IGZhbHNlLFxuICAgIGVycm9yXG4gIH1cbn0pO1xuXG4vKipcbiAqIERlbGV0ZSBjYWNoZWQgZXhwb3J0IGltYWdlXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLmNsZWFudXBFeHBvcnRJbWFnZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhbnVwRXhwb3J0SW1hZ2VVcGRhdGVyID0gc3RhdGUgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGV4cG9ydEltYWdlOiB7XG4gICAgLi4uc3RhdGUuZXhwb3J0SW1hZ2UsXG4gICAgZXhwb3J0aW5nOiBmYWxzZSxcbiAgICBpbWFnZURhdGFVcmk6ICcnLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBwcm9jZXNzaW5nOiBmYWxzZSxcbiAgICBjZW50ZXI6IGZhbHNlXG4gIH1cbn0pO1xuXG4vKipcbiAqIFN0YXJ0IGltYWdlIGV4cG9ydGluZyBmbG93XG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV0dXJucyB7VWlTdGF0ZX1cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc3RhcnRFeHBvcnRpbmdJbWFnZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHN0YXJ0RXhwb3J0aW5nSW1hZ2VVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogb3B0aW9ucyA9IHt9fSkgPT4ge1xuICBjb25zdCBpbWFnZVNldHRpbmdzID0ge1xuICAgIC4uLm9wdGlvbnMsXG4gICAgZXhwb3J0aW5nOiB0cnVlXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvc2VfKFtcbiAgICBjbGVhbnVwRXhwb3J0SW1hZ2VVcGRhdGVyLFxuICAgIGFwcGx5XyhzZXRFeHBvcnRJbWFnZVNldHRpbmdVcGRhdGVyLCBwYXlsb2FkXyhpbWFnZVNldHRpbmdzKSlcbiAgXSkoc3RhdGUpO1xufTtcblxuLyoqXG4gKiBTZXQgc2VsZWN0ZWQgZGF0YXNldCBmb3IgZXhwb3J0XG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQgZGF0YXNldCBpZFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldEV4cG9ydFNlbGVjdGVkRGF0YXNldFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRTZWxlY3RlZERhdGFzZXRVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogZGF0YXNldH0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnREYXRhOiB7XG4gICAgLi4uc3RhdGUuZXhwb3J0RGF0YSxcbiAgICBzZWxlY3RlZERhdGFzZXQ6IGRhdGFzZXRcbiAgfVxufSk7XG5cbi8qKlxuICogU2V0IGRhdGEgZm9ybWF0IGZvciBleHBvcnRpbmcgZGF0YVxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkIG9uZSBvZiBgJ3RleHQvY3N2J2BcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zZXRFeHBvcnREYXRhVHlwZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnREYXRhVHlwZVVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBkYXRhVHlwZX0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnREYXRhOiB7XG4gICAgLi4uc3RhdGUuZXhwb3J0RGF0YSxcbiAgICBkYXRhVHlwZVxuICB9XG59KTtcblxuLyoqXG4gKiBXaGV0aGVyIHRvIGV4cG9ydCBmaWx0ZXJlZCBkYXRhLCBgdHJ1ZWAgb3IgYGZhbHNlYFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc2V0RXhwb3J0RmlsdGVyZWRVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0RmlsdGVyZWRVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogZmlsdGVyZWR9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZXhwb3J0RGF0YToge1xuICAgIC4uLnN0YXRlLmV4cG9ydERhdGEsXG4gICAgZmlsdGVyZWRcbiAgfVxufSk7XG5cbi8qKlxuICogV2hldGhlciB0byBpbmNsdWRpbmcgZGF0YSBpbiBtYXAgY29uZmlnLCB0b2dnbGUgYmV0d2VlbiBgdHJ1ZWAgb3IgYGZhbHNlYFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldEV4cG9ydERhdGFVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0RGF0YVVwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZXhwb3J0TWFwOiB7XG4gICAgLi4uc3RhdGUuZXhwb3J0TWFwLFxuICAgIFtFWFBPUlRfTUFQX0ZPUk1BVFMuSlNPTl06IHtcbiAgICAgIC4uLnN0YXRlLmV4cG9ydE1hcFtFWFBPUlRfTUFQX0ZPUk1BVFMuSlNPTl0sXG4gICAgICBoYXNEYXRhOiAhc3RhdGUuZXhwb3J0TWFwW0VYUE9SVF9NQVBfRk9STUFUUy5KU09OXS5oYXNEYXRhXG4gICAgfVxuICB9XG59KTtcblxuLyoqXG4gKiB3aGV0aGVyIHRvIGV4cG9ydCBhIG1hcGJveCBhY2Nlc3MgdG8gSFRNTCBzaW5nbGUgcGFnZVxuICogQHBhcmFtIHN0YXRlIC0gYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWRcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zZXRVc2VyTWFwYm94QWNjZXNzVG9rZW5VcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0VXNlck1hcGJveEFjY2Vzc1Rva2VuVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IHVzZXJNYXBib3hUb2tlbn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRNYXA6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnRNYXAsXG4gICAgW0VYUE9SVF9NQVBfRk9STUFUUy5IVE1MXToge1xuICAgICAgLi4uc3RhdGUuZXhwb3J0TWFwW0VYUE9SVF9NQVBfRk9STUFUUy5IVE1MXSxcbiAgICAgIHVzZXJNYXBib3hUb2tlblxuICAgIH1cbiAgfVxufSk7XG5cbi8qKlxuICogU2V0cyB0aGUgZXhwb3J0IG1hcCBmb3JtYXRcbiAqIEBwYXJhbSBzdGF0ZSAtIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkIGZvcm1hdCB0byB1c2UgdG8gZXhwb3J0IHRoZSBtYXAgaW50b1xuICogQHJldHVybiBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc2V0RXhwb3J0TWFwRm9ybWF0VXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHNldEV4cG9ydE1hcEZvcm1hdFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBmb3JtYXR9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZXhwb3J0TWFwOiB7XG4gICAgLi4uc3RhdGUuZXhwb3J0TWFwLFxuICAgIGZvcm1hdFxuICB9XG59KTtcblxuLyoqXG4gKiBTZXQgdGhlIGV4cG9ydCBodG1sIG1hcCBtb2RlXG4gKiBAcGFyYW0gc3RhdGUgLSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZCB0byBiZSBzZXQgKGF2YWlsYWJsZSBtb2RlczogRVhQT1JUX0hUTUxfTUFQX01PREVTKVxuICogQHJldHVybiBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc2V0RXhwb3J0TWFwSFRNTE1vZGVVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0TWFwSFRNTE1vZGVVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogbW9kZX0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRNYXA6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnRNYXAsXG4gICAgW0VYUE9SVF9NQVBfRk9STUFUUy5IVE1MXToge1xuICAgICAgLi4uc3RhdGUuZXhwb3J0TWFwW0VYUE9SVF9NQVBfRk9STUFUUy5IVE1MXSxcbiAgICAgIG1vZGVcbiAgICB9XG4gIH1cbn0pO1xuXG4vKipcbiAqIEFkZHMgYSBuZXcgbm90aWZpY2F0aW9uLlxuICogVXBkYXRlcyBhIG5vdGlmaWNhdGlvbiBpbiBjYXNlIG9mIG1hdGNoaW5nIGlkcy5cbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZCBQYXJhbXMgb2YgYSBub3RpZmljYXRpb25cbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5hZGROb3RpZmljYXRpb25VcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgYWRkTm90aWZpY2F0aW9uVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWR9KSA9PiB7XG4gIGxldCBub3RpZmljYXRpb25zO1xuXG4gIGNvbnN0IHBheWxvYWRJZCA9IHBheWxvYWQ/LmlkO1xuICBjb25zdCBub3RpZmljYXRpb25Ub1VwZGF0ZSA9IHBheWxvYWRJZCA/IHN0YXRlLm5vdGlmaWNhdGlvbnMuZmluZChuID0+IG4uaWQgPT09IHBheWxvYWRJZCkgOiBudWxsO1xuICBpZiAobm90aWZpY2F0aW9uVG9VcGRhdGUpIHtcbiAgICBub3RpZmljYXRpb25zID0gc3RhdGUubm90aWZpY2F0aW9ucy5tYXAobiA9PlxuICAgICAgbi5pZCA9PT0gcGF5bG9hZElkID8gY3JlYXRlTm90aWZpY2F0aW9uKHBheWxvYWQpIDogblxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbm90aWZpY2F0aW9ucyA9IFsuLi4oc3RhdGUubm90aWZpY2F0aW9ucyB8fCBbXSksIGNyZWF0ZU5vdGlmaWNhdGlvbihwYXlsb2FkKV07XG4gIH1cblxuICByZXR1cm4gey4uLnN0YXRlLCBub3RpZmljYXRpb25zfTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgbm90aWZpY2F0aW9uXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQgaWQgb2YgdGhlIG5vdGlmaWNhdGlvbiB0byBiZSByZW1vdmVkXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykucmVtb3ZlTm90aWZpY2F0aW9uVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZU5vdGlmaWNhdGlvblVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBpZH0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBub3RpZmljYXRpb25zOiBzdGF0ZS5ub3RpZmljYXRpb25zLmZpbHRlcihuID0+IG4uaWQgIT09IGlkKVxufSk7XG5cbi8qKlxuICogRmlyZWQgd2hlbiBmaWxlIGxvYWRpbmcgYmVnaW5cbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5sb2FkRmlsZXNVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbG9hZEZpbGVzVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsb2FkRmlsZXM6IHtcbiAgICAuLi5zdGF0ZS5sb2FkRmlsZXMsXG4gICAgZmlsZUxvYWRpbmc6IHRydWVcbiAgfVxufSk7XG5cbi8qKlxuICogSGFuZGxlcyBsb2FkaW5nIGZpbGUgc3VjY2VzcyBhbmQgc2V0IGZpbGVMb2FkaW5nIHByb3BlcnR5IHRvIGZhbHNlXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykubG9hZEZpbGVzU3VjY2Vzc1VwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNTdWNjZXNzVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsb2FkRmlsZXM6IHtcbiAgICAuLi5zdGF0ZS5sb2FkRmlsZXMsXG4gICAgZmlsZUxvYWRpbmc6IGZhbHNlXG4gIH1cbn0pO1xuXG4vKipcbiAqIEhhbmRsZXMgbG9hZCBmaWxlIGVycm9yIGFuZCBzZXQgZmlsZUxvYWRpbmcgcHJvcGVydHkgdG8gZmFsc2VcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5lcnJvclxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLmxvYWRGaWxlc0VyclVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNFcnJVcGRhdGVyID0gKHN0YXRlLCB7ZXJyb3J9KSA9PlxuICBhZGROb3RpZmljYXRpb25VcGRhdGVyKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbG9hZEZpbGVzOiB7XG4gICAgICAgIC4uLnN0YXRlLmxvYWRGaWxlcyxcbiAgICAgICAgZmlsZUxvYWRpbmc6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBwYXlsb2FkOiBlcnJvck5vdGlmaWNhdGlvbih7XG4gICAgICAgIG1lc3NhZ2U6IChlcnJvciB8fCB7fSkubWVzc2FnZSB8fCAnRmFpbGVkIHRvIHVwbG9hZCBmaWxlcycsXG4gICAgICAgIHRvcGljOiBERUZBVUxUX05PVElGSUNBVElPTl9UT1BJQ1MuZ2xvYmFsXG4gICAgICB9KVxuICAgIH1cbiAgKTtcblxuLyoqXG4gKiBIYW5kbGVzIHRvZ2dsZSBtYXAgc3BsaXQgYW5kIHJlc2V0IGFsbCBtYXAgY29udHJvbCBpbmRleCB0byAwXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVTcGxpdE1hcFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVTcGxpdE1hcFVwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbWFwQ29udHJvbHM6IE9iamVjdC5lbnRyaWVzKHN0YXRlLm1hcENvbnRyb2xzKS5yZWR1Y2UoXG4gICAgKGFjYywgZW50cnkpID0+ICh7XG4gICAgICAuLi5hY2MsXG4gICAgICBbZW50cnlbMF1dOiB7XG4gICAgICAgIC4uLmVudHJ5WzFdLFxuICAgICAgICBhY3RpdmVNYXBJbmRleDogMFxuICAgICAgfVxuICAgIH0pLFxuICAgIHt9XG4gIClcbn0pO1xuXG4vKipcbiAqIFRvZ2dsZSBtb2RhbCBkYXRhXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zaG93RGF0YXNldFRhYmxlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNob3dEYXRhc2V0VGFibGVVcGRhdGVyID0gc3RhdGUgPT4gdG9nZ2xlTW9kYWxVcGRhdGVyKHN0YXRlLCB7cGF5bG9hZDogREFUQV9UQUJMRV9JRH0pO1xuXG4vKipcbiAqIFNldCB0aGUgbG9jYWxlIG9mIHRoZSBVSVxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQubG9jYWxlIGxvY2FsZVxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldExvY2FsZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRMb2NhbGVVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDoge2xvY2FsZX19KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbG9jYWxlXG59KTtcbiJdfQ==