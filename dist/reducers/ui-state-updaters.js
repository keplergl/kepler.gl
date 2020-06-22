"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLocaleUpdater = exports.toggleSplitMapUpdater = exports.loadFilesErrUpdater = exports.loadFilesSuccessUpdater = exports.loadFilesUpdater = exports.removeNotificationUpdater = exports.addNotificationUpdater = exports.setExportMapHTMLModeUpdater = exports.setExportMapFormatUpdater = exports.setUserMapboxAccessTokenUpdater = exports.setExportDataUpdater = exports.setExportFilteredUpdater = exports.setExportDataTypeUpdater = exports.setExportSelectedDatasetUpdater = exports.cleanupExportImageUpdater = exports.setExportImageErrorUpdater = exports.setExportImageDataUriUpdater = exports.startExportingImageUpdater = exports.setExportImageSettingUpdater = exports.openDeleteModalUpdater = exports.toggleMapControlUpdater = exports.hideExportDropdownUpdater = exports.showExportDropdownUpdater = exports.toggleModalUpdater = exports.toggleSidePanelUpdater = exports.INITIAL_UI_STATE = exports.DEFAULT_EXPORT_MAP = exports.DEFAULT_EXPORT_JSON = exports.DEFAULT_EXPORT_HTML = exports.DEFAULT_NOTIFICATIONS = exports.DEFAULT_EXPORT_DATA = exports.DEFAULT_LOAD_FILES = exports.DEFAULT_EXPORT_IMAGE = exports.DEFAULT_MAP_CONTROLS = exports.DEFAULT_MODAL = exports.DEFAULT_ACTIVE_SIDE_PANEL = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _defaultSettings = require("../constants/default-settings");

var _locales = require("../localization/locales");

var _notificationsUtils = require("../utils/notifications-utils");

var _exportUtils = require("../utils/export-utils");

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
  return _objectSpread({}, _final, (0, _defineProperty2["default"])({}, current, DEFAULT_MAP_CONTROLS_FEATURES));
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
  // exporting state
  imageDataUri: '',
  exporting: false,
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
 * Toggle active side panel
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`. close side panel if `null`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').toggleSidePanelUpdater}
 * @public
 */

exports.INITIAL_UI_STATE = INITIAL_UI_STATE;

var toggleSidePanelUpdater = function toggleSidePanelUpdater(state, _ref) {
  var id = _ref.payload;
  return id === state.activeSidePanel ? state : _objectSpread({}, state, {
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
  return _objectSpread({}, state, {
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
  return _objectSpread({}, state, {
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
  return _objectSpread({}, state, {
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
  return _objectSpread({}, state, {
    mapControls: _objectSpread({}, state.mapControls, (0, _defineProperty2["default"])({}, panelId, _objectSpread({}, state.mapControls[panelId], {
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
  return _objectSpread({}, state, {
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

  var updated = _objectSpread({}, state.exportImage, {}, newSetting);

  var imageSize = (0, _exportUtils.calculateExportImageSize)(updated) || state.exportImage.imageSize;
  return _objectSpread({}, state, {
    exportImage: _objectSpread({}, updated, {
      imageSize: imageSize
    })
  });
};
/**
 * Set `exportImage.exporting` to `true`
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').startExportingImageUpdater}
 * @public
 */


exports.setExportImageSettingUpdater = setExportImageSettingUpdater;

var startExportingImageUpdater = function startExportingImageUpdater(state) {
  return _objectSpread({}, state, {
    exportImage: _objectSpread({}, state.exportImage, {
      exporting: true,
      imageDataUri: ''
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


exports.startExportingImageUpdater = startExportingImageUpdater;

var setExportImageDataUriUpdater = function setExportImageDataUriUpdater(state, _ref7) {
  var dataUri = _ref7.payload;
  return _objectSpread({}, state, {
    exportImage: _objectSpread({}, state.exportImage, {
      exporting: false,
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
  return _objectSpread({}, state, {
    exportImage: _objectSpread({}, state.exportImage, {
      exporting: false,
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
  return _objectSpread({}, state, {
    exportImage: _objectSpread({}, state.exportImage, {
      exporting: false,
      imageDataUri: '',
      error: false
    })
  });
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


exports.cleanupExportImageUpdater = cleanupExportImageUpdater;

var setExportSelectedDatasetUpdater = function setExportSelectedDatasetUpdater(state, _ref9) {
  var dataset = _ref9.payload;
  return _objectSpread({}, state, {
    exportData: _objectSpread({}, state.exportData, {
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

var setExportDataTypeUpdater = function setExportDataTypeUpdater(state, _ref10) {
  var dataType = _ref10.payload;
  return _objectSpread({}, state, {
    exportData: _objectSpread({}, state.exportData, {
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

var setExportFilteredUpdater = function setExportFilteredUpdater(state, _ref11) {
  var filtered = _ref11.payload;
  return _objectSpread({}, state, {
    exportData: _objectSpread({}, state.exportData, {
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
  return _objectSpread({}, state, {
    exportMap: _objectSpread({}, state.exportMap, (0, _defineProperty2["default"])({}, _defaultSettings.EXPORT_MAP_FORMATS.JSON, _objectSpread({}, state.exportMap[_defaultSettings.EXPORT_MAP_FORMATS.JSON], {
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

var setUserMapboxAccessTokenUpdater = function setUserMapboxAccessTokenUpdater(state, _ref12) {
  var userMapboxToken = _ref12.payload;
  return _objectSpread({}, state, {
    exportMap: _objectSpread({}, state.exportMap, (0, _defineProperty2["default"])({}, _defaultSettings.EXPORT_MAP_FORMATS.HTML, _objectSpread({}, state.exportMap[_defaultSettings.EXPORT_MAP_FORMATS.HTML], {
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

var setExportMapFormatUpdater = function setExportMapFormatUpdater(state, _ref13) {
  var format = _ref13.payload;
  return _objectSpread({}, state, {
    exportMap: _objectSpread({}, state.exportMap, {
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

var setExportMapHTMLModeUpdater = function setExportMapHTMLModeUpdater(state, _ref14) {
  var mode = _ref14.payload;
  return _objectSpread({}, state, {
    exportMap: _objectSpread({}, state.exportMap, (0, _defineProperty2["default"])({}, _defaultSettings.EXPORT_MAP_FORMATS.HTML, _objectSpread({}, state.exportMap[_defaultSettings.EXPORT_MAP_FORMATS.HTML], {
      mode: mode
    })))
  });
};
/**
 * Add a notification to be displayed
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload
 * @returns nextState
 * @type {typeof import('./ui-state-updaters').addNotificationUpdater}
 * @public
 */


exports.setExportMapHTMLModeUpdater = setExportMapHTMLModeUpdater;

var addNotificationUpdater = function addNotificationUpdater(state, _ref15) {
  var payload = _ref15.payload;
  return _objectSpread({}, state, {
    notifications: [].concat((0, _toConsumableArray2["default"])(state.notifications || []), [(0, _notificationsUtils.createNotification)(payload)])
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

var removeNotificationUpdater = function removeNotificationUpdater(state, _ref16) {
  var id = _ref16.payload;
  return _objectSpread({}, state, {
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
  return _objectSpread({}, state, {
    loadFiles: _objectSpread({}, state.loadFiles, {
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
  return _objectSpread({}, state, {
    loadFiles: _objectSpread({}, state.loadFiles, {
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

var loadFilesErrUpdater = function loadFilesErrUpdater(state, _ref17) {
  var error = _ref17.error;
  return addNotificationUpdater(_objectSpread({}, state, {
    loadFiles: _objectSpread({}, state.loadFiles, {
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
  return _objectSpread({}, state, {
    mapControls: Object.entries(state.mapControls).reduce(function (acc, entry) {
      return _objectSpread({}, acc, (0, _defineProperty2["default"])({}, entry[0], _objectSpread({}, entry[1], {
        activeMapIndex: 0
      })));
    }, {})
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


exports.toggleSplitMapUpdater = toggleSplitMapUpdater;

var setLocaleUpdater = function setLocaleUpdater(state, _ref18) {
  var locale = _ref18.payload.locale;
  return _objectSpread({}, state, {
    locale: locale
  });
};

exports.setLocaleUpdater = setLocaleUpdater;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy91aS1zdGF0ZS11cGRhdGVycy5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0FDVElWRV9TSURFX1BBTkVMIiwiREVGQVVMVF9NT0RBTCIsIkFERF9EQVRBX0lEIiwidWlTdGF0ZVVwZGF0ZXJzIiwiREVGQVVMVF9NQVBfQ09OVFJPTFNfRkVBVFVSRVMiLCJzaG93IiwiYWN0aXZlIiwiYWN0aXZlTWFwSW5kZXgiLCJERUZBVUxUX01BUF9DT05UUk9MUyIsInJlZHVjZSIsImZpbmFsIiwiY3VycmVudCIsIkRFRkFVTFRfRVhQT1JUX0lNQUdFIiwicmF0aW8iLCJFWFBPUlRfSU1HX1JBVElPUyIsIlNDUkVFTiIsInJlc29sdXRpb24iLCJSRVNPTFVUSU9OUyIsIk9ORV9YIiwibGVnZW5kIiwibWFwSCIsIm1hcFciLCJpbWFnZVNpemUiLCJ6b29tT2Zmc2V0Iiwic2NhbGUiLCJpbWFnZVciLCJpbWFnZUgiLCJpbWFnZURhdGFVcmkiLCJleHBvcnRpbmciLCJlcnJvciIsIkRFRkFVTFRfTE9BRF9GSUxFUyIsImZpbGVMb2FkaW5nIiwiREVGQVVMVF9FWFBPUlRfREFUQSIsInNlbGVjdGVkRGF0YXNldCIsImRhdGFUeXBlIiwiRVhQT1JUX0RBVEFfVFlQRSIsIkNTViIsImZpbHRlcmVkIiwiREVGQVVMVF9OT1RJRklDQVRJT05TIiwiREVGQVVMVF9FWFBPUlRfSFRNTCIsImV4cG9ydE1hcGJveEFjY2Vzc1Rva2VuIiwidXNlck1hcGJveFRva2VuIiwibW9kZSIsIkVYUE9SVF9IVE1MX01BUF9NT0RFUyIsIlJFQUQiLCJERUZBVUxUX0VYUE9SVF9KU09OIiwiaGFzRGF0YSIsIkRFRkFVTFRfRVhQT1JUX01BUCIsIkVYUE9SVF9NQVBfRk9STUFUUyIsIkhUTUwiLCJKU09OIiwiSU5JVElBTF9VSV9TVEFURSIsInJlYWRPbmx5IiwiYWN0aXZlU2lkZVBhbmVsIiwiY3VycmVudE1vZGFsIiwiZGF0YXNldEtleVRvUmVtb3ZlIiwidmlzaWJsZURyb3Bkb3duIiwiZXhwb3J0SW1hZ2UiLCJleHBvcnREYXRhIiwiZXhwb3J0TWFwIiwibWFwQ29udHJvbHMiLCJub3RpZmljYXRpb25zIiwibG9hZEZpbGVzIiwibG9jYWxlIiwiTE9DQUxFX0NPREVTIiwiZW4iLCJ0b2dnbGVTaWRlUGFuZWxVcGRhdGVyIiwic3RhdGUiLCJpZCIsInBheWxvYWQiLCJ0b2dnbGVNb2RhbFVwZGF0ZXIiLCJzaG93RXhwb3J0RHJvcGRvd25VcGRhdGVyIiwiaGlkZUV4cG9ydERyb3Bkb3duVXBkYXRlciIsInRvZ2dsZU1hcENvbnRyb2xVcGRhdGVyIiwicGFuZWxJZCIsImluZGV4Iiwib3BlbkRlbGV0ZU1vZGFsVXBkYXRlciIsIkRFTEVURV9EQVRBX0lEIiwic2V0RXhwb3J0SW1hZ2VTZXR0aW5nVXBkYXRlciIsIm5ld1NldHRpbmciLCJ1cGRhdGVkIiwic3RhcnRFeHBvcnRpbmdJbWFnZVVwZGF0ZXIiLCJzZXRFeHBvcnRJbWFnZURhdGFVcmlVcGRhdGVyIiwiZGF0YVVyaSIsInNldEV4cG9ydEltYWdlRXJyb3JVcGRhdGVyIiwiY2xlYW51cEV4cG9ydEltYWdlVXBkYXRlciIsInNldEV4cG9ydFNlbGVjdGVkRGF0YXNldFVwZGF0ZXIiLCJkYXRhc2V0Iiwic2V0RXhwb3J0RGF0YVR5cGVVcGRhdGVyIiwic2V0RXhwb3J0RmlsdGVyZWRVcGRhdGVyIiwic2V0RXhwb3J0RGF0YVVwZGF0ZXIiLCJzZXRVc2VyTWFwYm94QWNjZXNzVG9rZW5VcGRhdGVyIiwic2V0RXhwb3J0TWFwRm9ybWF0VXBkYXRlciIsImZvcm1hdCIsInNldEV4cG9ydE1hcEhUTUxNb2RlVXBkYXRlciIsImFkZE5vdGlmaWNhdGlvblVwZGF0ZXIiLCJyZW1vdmVOb3RpZmljYXRpb25VcGRhdGVyIiwiZmlsdGVyIiwibiIsImxvYWRGaWxlc1VwZGF0ZXIiLCJsb2FkRmlsZXNTdWNjZXNzVXBkYXRlciIsImxvYWRGaWxlc0VyclVwZGF0ZXIiLCJtZXNzYWdlIiwidG9waWMiLCJERUZBVUxUX05PVElGSUNBVElPTl9UT1BJQ1MiLCJnbG9iYWwiLCJ0b2dnbGVTcGxpdE1hcFVwZGF0ZXIiLCJPYmplY3QiLCJlbnRyaWVzIiwiYWNjIiwiZW50cnkiLCJzZXRMb2NhbGVVcGRhdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBcUJBOztBQVVBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVPLElBQU1BLHlCQUF5QixHQUFHLE9BQWxDOztBQUNBLElBQU1DLGFBQWEsR0FBR0MsNEJBQXRCO0FBRVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQ0E7OztBQUNBLElBQU1DLGVBQWUsR0FBRyxJQUF4QjtBQUNBOztBQUVBLElBQU1DLDZCQUE2QixHQUFHO0FBQ3BDQyxFQUFBQSxJQUFJLEVBQUUsSUFEOEI7QUFFcENDLEVBQUFBLE1BQU0sRUFBRSxLQUY0QjtBQUdwQztBQUNBQyxFQUFBQSxjQUFjLEVBQUU7QUFKb0IsQ0FBdEM7QUFPQTs7Ozs7Ozs7Ozs7Ozs7QUFhTyxJQUFNQyxvQkFBb0IsR0FBRyxDQUNsQyxlQURrQyxFQUVsQyxXQUZrQyxFQUdsQyxVQUhrQyxFQUlsQyxVQUprQyxFQUtsQyxTQUxrQyxFQU1sQyxXQU5rQyxFQU9sQ0MsTUFQa0MsQ0FRbEMsVUFBQ0MsTUFBRCxFQUFRQyxPQUFSO0FBQUEsMkJBQ0tELE1BREwsdUNBRUdDLE9BRkgsRUFFYVAsNkJBRmI7QUFBQSxDQVJrQyxFQVlsQyxFQVprQyxDQUE3QjtBQWVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQk8sSUFBTVEsb0JBQW9CLEdBQUc7QUFDbEM7QUFDQUMsRUFBQUEsS0FBSyxFQUFFQyxtQ0FBa0JDLE1BRlM7QUFHbENDLEVBQUFBLFVBQVUsRUFBRUMsNkJBQVlDLEtBSFU7QUFJbENDLEVBQUFBLE1BQU0sRUFBRSxLQUowQjtBQUtsQ0MsRUFBQUEsSUFBSSxFQUFFLENBTDRCO0FBTWxDQyxFQUFBQSxJQUFJLEVBQUUsQ0FONEI7QUFPbENDLEVBQUFBLFNBQVMsRUFBRTtBQUNUQyxJQUFBQSxVQUFVLEVBQUUs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QUFBLE1BQVN0QyxLQUFULFVBQVNBLEtBQVQ7QUFBQSxTQUNqQ2tFLHNCQUFzQixtQkFFZjVCLEtBRmU7QUFHbEJMLElBQUFBLFNBQVMsb0JBQ0pLLEtBQUssQ0FBQ0wsU0FERjtBQUVQL0IsTUFBQUEsV0FBVyxFQUFFO0FBRk47QUFIUyxNQVFwQjtBQUNFc0MsSUFBQUEsT0FBTyxFQUFFLDJDQUFrQjtBQUN6QmlDLE1BQUFBLE9BQU8sRUFBRSxDQUFDekUsS0FBSyxJQUFJLEVBQVYsRUFBY3lFLE9BQWQsSUFBeUIsd0JBRFQ7QUFFekJDLE1BQUFBLEtBQUssRUFBRUMsNkNBQTRCQztBQUZWLEtBQWxCO0FBRFgsR0FSb0IsQ0FEVztBQUFBLENBQTVCO0FBaUJQOzs7Ozs7Ozs7Ozs7QUFRTyxJQUFNQyxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLENBQUF2QyxLQUFLO0FBQUEsMkJBQ3JDQSxLQURxQztBQUV4Q1AsSUFBQUEsV0FBVyxFQUFFK0MsTUFBTSxDQUFDQyxPQUFQLENBQWV6QyxLQUFLLENBQUNQLFdBQXJCLEVBQWtDbkQsTUFBbEMsQ0FDWCxVQUFDb0csR0FBRCxFQUFNQyxLQUFOO0FBQUEsK0JBQ0tELEdBREwsdUNBRUdDLEtBQUssQ0FBQyxDQUFELENBRlIsb0JBR09BLEtBQUssQ0FBQyxDQUFELENBSFo7QUFJSXZHLFFBQUFBLGNBQWMsRUFBRTtBQUpwQjtBQUFBLEtBRFcsRUFRWCxFQVJXO0FBRjJCO0FBQUEsQ0FBbkM7QUFjUDs7Ozs7Ozs7Ozs7Ozs7O0FBV08sSUFBTXdHLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQzVDLEtBQUQ7QUFBQSxNQUFtQkosTUFBbkIsVUFBU00sT0FBVCxDQUFtQk4sTUFBbkI7QUFBQSwyQkFDM0JJLEtBRDJCO0FBRTlCSixJQUFBQSxNQUFNLEVBQU5BO0FBRjhCO0FBQUEsQ0FBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vLyBAdHMtbm9jaGVja1xuaW1wb3J0IHtcbiAgQUREX0RBVEFfSUQsXG4gIERFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUyxcbiAgREVMRVRFX0RBVEFfSUQsXG4gIEVYUE9SVF9EQVRBX1RZUEUsXG4gIEVYUE9SVF9IVE1MX01BUF9NT0RFUyxcbiAgRVhQT1JUX0lNR19SQVRJT1MsXG4gIEVYUE9SVF9NQVBfRk9STUFUUyxcbiAgUkVTT0xVVElPTlNcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtMT0NBTEVfQ09ERVN9IGZyb20gJ2xvY2FsaXphdGlvbi9sb2NhbGVzJztcbmltcG9ydCB7Y3JlYXRlTm90aWZpY2F0aW9uLCBlcnJvck5vdGlmaWNhdGlvbn0gZnJvbSAndXRpbHMvbm90aWZpY2F0aW9ucy11dGlscyc7XG5pbXBvcnQge2NhbGN1bGF0ZUV4cG9ydEltYWdlU2l6ZX0gZnJvbSAndXRpbHMvZXhwb3J0LXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQUNUSVZFX1NJREVfUEFORUwgPSAnbGF5ZXInO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTU9EQUwgPSBBRERfREFUQV9JRDtcblxuLyoqXG4gKiBVcGRhdGVycyBmb3IgYHVpU3RhdGVgIHJlZHVjZXIuIENhbiBiZSB1c2VkIGluIHlvdXIgcm9vdCByZWR1Y2VyIHRvIGRpcmVjdGx5IG1vZGlmeSBrZXBsZXIuZ2wncyBzdGF0ZS5cbiAqIFJlYWQgbW9yZSBhYm91dCBbVXNpbmcgdXBkYXRlcnNdKC4uL2FkdmFuY2VkLXVzYWdlL3VzaW5nLXVwZGF0ZXJzLm1kKVxuICpcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKlxuICogaW1wb3J0IGtlcGxlckdsUmVkdWNlciwge3VpU3RhdGVVcGRhdGVyc30gZnJvbSAna2VwbGVyLmdsL3JlZHVjZXJzJztcbiAqIC8vIFJvb3QgUmVkdWNlclxuICogY29uc3QgcmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xuICogIGtlcGxlckdsOiBrZXBsZXJHbFJlZHVjZXIsXG4gKiAgYXBwOiBhcHBSZWR1Y2VyXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBjb21wb3NlZFJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICogIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAqICAgIC8vIGNsaWNrIGJ1dHRvbiB0byBjbG9zZSBzaWRlIHBhbmVsXG4gKiAgICBjYXNlICdDTElDS19CVVRUT04nOlxuICogICAgICByZXR1cm4ge1xuICogICAgICAgIC4uLnN0YXRlLFxuICogICAgICAgIGtlcGxlckdsOiB7XG4gKiAgICAgICAgICAuLi5zdGF0ZS5rZXBsZXJHbCxcbiAqICAgICAgICAgIGZvbzoge1xuICogICAgICAgICAgICAgLi4uc3RhdGUua2VwbGVyR2wuZm9vLFxuICogICAgICAgICAgICAgdWlTdGF0ZTogdWlTdGF0ZVVwZGF0ZXJzLnRvZ2dsZVNpZGVQYW5lbFVwZGF0ZXIoXG4gKiAgICAgICAgICAgICAgIHVpU3RhdGUsIHtwYXlsb2FkOiBudWxsfVxuICogICAgICAgICAgICAgKVxuICogICAgICAgICAgfVxuICogICAgICAgIH1cbiAqICAgICAgfTtcbiAqICB9XG4gKiAgcmV0dXJuIHJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pO1xuICogfTtcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21wb3NlZFJlZHVjZXI7XG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5jb25zdCB1aVN0YXRlVXBkYXRlcnMgPSBudWxsO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5jb25zdCBERUZBVUxUX01BUF9DT05UUk9MU19GRUFUVVJFUyA9IHtcbiAgc2hvdzogdHJ1ZSxcbiAgYWN0aXZlOiBmYWxzZSxcbiAgLy8gZGVmaW5lcyB3aGljaCBtYXAgaW5kZXggdXNlcnMgYXJlIGludGVyYWN0aW5nIHdpdGggKHRocm91Z2ggbWFwIGNvbnRyb2xzKVxuICBhY3RpdmVNYXBJbmRleDogMFxufTtcblxuLyoqXG4gKiBBIGxpc3Qgb2YgbWFwIGNvbnRyb2wgdmlzaWJpbGl0eSBhbmQgd2hldGhlciBpcyBpdCBhY3RpdmUuXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAY29uc3RhbnRcbiAqIEBwcm9wZXJ0eSB2aXNpYmxlTGF5ZXJzIERlZmF1bHQ6IGB7c2hvdzogdHJ1ZSwgYWN0aXZlOiBmYWxzZX1gXG4gKiBAcHJvcGVydHkgbWFwTGVnZW5kIERlZmF1bHQ6IGB7c2hvdzogdHJ1ZSwgYWN0aXZlOiBmYWxzZX1gXG4gKiBAcHJvcGVydHkgdG9nZ2xlM2QgRGVmYXVsdDogYHtzaG93OiB0cnVlfWBcbiAqIEBwcm9wZXJ0eSBzcGxpdE1hcCBEZWZhdWx0OiBge3Nob3c6IHRydWV9YFxuICogQHByb3BlcnR5IG1hcERyYXcgRGVmYXVsdDogYHtzaG93OiB0cnVlLCBhY3RpdmU6IGZhbHNlfWBcbiAqIEBwcm9wZXJ0eSBtYXBMb2NhbGUgRGVmYXVsdDogYHtzaG93OiBmYWxzZSwgYWN0aXZlOiBmYWxzZX1gXG4gKiBAdHlwZSB7aW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuTWFwQ29udHJvbHN9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX01BUF9DT05UUk9MUyA9IFtcbiAgJ3Zpc2libGVMYXllcnMnLFxuICAnbWFwTGVnZW5kJyxcbiAgJ3RvZ2dsZTNkJyxcbiAgJ3NwbGl0TWFwJyxcbiAgJ21hcERyYXcnLFxuICAnbWFwTG9jYWxlJ1xuXS5yZWR1Y2UoXG4gIChmaW5hbCwgY3VycmVudCkgPT4gKHtcbiAgICAuLi5maW5hbCxcbiAgICBbY3VycmVudF06IERFRkFVTFRfTUFQX0NPTlRST0xTX0ZFQVRVUkVTXG4gIH0pLFxuICB7fVxuKTtcblxuLyoqXG4gKiBEZWZhdWx0IGltYWdlIGV4cG9ydCBjb25maWdcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHJhdGlvIERlZmF1bHQ6IGAnU0NSRUVOJ2AsXG4gKiBAcHJvcGVydHkgcmVzb2x1dGlvbiBEZWZhdWx0OiBgJ09ORV9YJ2AsXG4gKiBAcHJvcGVydHkgbGVnZW5kIERlZmF1bHQ6IGBmYWxzZWAsXG4gKiBAcHJvcGVydHkgbWFwSCBEZWZhdWx0OiAwLFxuICogQHByb3BlcnR5IG1hcFcgRGVmYXVsdDogMCxcbiAqIEBwcm9wZXJ0eSBpbWFnZVNpemUgRGVmYXVsdDoge3pvb21PZmZzZXQ6IDAsIHNjYWxlOiAxLCBpbWFnZVc6IDAsIGltYWdlSDogMH0sXG4gKiBAcHJvcGVydHkgaW1hZ2VEYXRhVXJpIERlZmF1bHQ6IGAnJ2AsXG4gKiBAcHJvcGVydHkgZXhwb3J0aW5nIERlZmF1bHQ6IGBmYWxzZWBcbiAqIEBwcm9wZXJ0eSBlcnJvciBEZWZhdWx0OiBgZmFsc2VgXG4gKiBAdHlwZSB7aW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuRXhwb3J0SW1hZ2V9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VYUE9SVF9JTUFHRSA9IHtcbiAgLy8gdXNlciBvcHRpb25zXG4gIHJhdGlvOiBFWFBPUlRfSU1HX1JBVElPUy5TQ1JFRU4sXG4gIHJlc29sdXRpb246IFJFU09MVVRJT05TLk9ORV9YLFxuICBsZWdlbmQ6IGZhbHNlLFxuICBtYXBIOiAwLFxuICBtYXBXOiAwLFxuICBpbWFnZVNpemU6IHtcbiAgICB6b29tT2Zmc2V0OiAwLFxuICAgIHNjYWxlOiAxLFxuICAgIGltYWdlVzogMCxcbiAgICBpbWFnZUg6IDBcbiAgfSxcbiAgLy8gZXhwb3J0aW5nIHN0YXRlXG4gIGltYWdlRGF0YVVyaTogJycsXG4gIGV4cG9ydGluZzogZmFsc2UsXG4gIGVycm9yOiBmYWxzZVxufTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTE9BRF9GSUxFUyA9IHtcbiAgZmlsZUxvYWRpbmc6IGZhbHNlXG59O1xuXG4vKipcbiAqIERlZmF1bHQgaW5pdGlhbCBgZXhwb3J0RGF0YWAgc2V0dGluZ3NcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHNlbGVjdGVkRGF0YXNldCBEZWZhdWx0OiBgJydgLFxuICogQHByb3BlcnR5IGRhdGFUeXBlIERlZmF1bHQ6IGAnY3N2J2AsXG4gKiBAcHJvcGVydHkgZmlsdGVyZWQgRGVmYXVsdDogYHRydWVgLFxuICogQHR5cGUge2ltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLkV4cG9ydERhdGF9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VYUE9SVF9EQVRBID0ge1xuICBzZWxlY3RlZERhdGFzZXQ6ICcnLFxuICBkYXRhVHlwZTogRVhQT1JUX0RBVEFfVFlQRS5DU1YsXG4gIGZpbHRlcmVkOiB0cnVlXG59O1xuXG4vKipcbiAqIEBjb25zdGFudFxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9OT1RJRklDQVRJT05TID0gW107XG5cbi8qKlxuICogQGNvbnN0YW50XG4gKiBAcHJvcGVydHkgZXhwb3J0TWFwYm94QWNjZXNzVG9rZW4gLSBEZWZhdWx0OiBudWxsLCB0aGlzIGlzIHVzZWQgd2hlbiB3ZSBwcm92aWRlIGEgZGVmYXVsdCBtYXBib3ggdG9rZW4gZm9yIHVzZXJzIHRvIHRha2UgYWR2YW50YWdlIG9mXG4gKiBAcHJvcGVydHkgdXNlck1hcGJveFRva2VuIC0gRGVmYXVsdDogJycsIG1hcGJveCB0b2tlbiBwcm92aWRlZCBieSB1c2VyIHRocm91Z2ggaW5wdXQgZmllbGRcbiAqIEBwcm9wZXJ0eSBtb2RlIC0gRGVmYXVsdDogJ1JFQUQnLCByZWFkIG9ubHkgb3IgZWRpdGFibGVcbiAqIEB0eXBlIHtpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5FeHBvcnRIdG1sfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9FWFBPUlRfSFRNTCA9IHtcbiAgZXhwb3J0TWFwYm94QWNjZXNzVG9rZW46IG51bGwsXG4gIHVzZXJNYXBib3hUb2tlbjogJycsXG4gIG1vZGU6IEVYUE9SVF9IVE1MX01BUF9NT0RFUy5SRUFEXG59O1xuXG4vKipcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IGhhc0RhdGEgLSBEZWZhdWx0OiAndHJ1ZScsXG4gKiBAdHlwZSB7aW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuRXhwb3J0SnNvbn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfRVhQT1JUX0pTT04gPSB7XG4gIGhhc0RhdGE6IHRydWVcbn07XG5cbi8qKlxuICogRXhwb3J0IE1hcCBDb25maWdcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IEhUTUwgLSBEZWZhdWx0OiAnREVGQVVMVF9FWFBPUlRfSFRNTCcsXG4gKiBAcHJvcGVydHkgSlNPTiAtIERlZmF1bHQ6ICdERUZBVUxUX0VYUE9SVF9KU09OJyxcbiAqIEBwcm9wZXJ0eSBmb3JtYXQgLSBEZWZhdWx0OiAnSFRNTCcsXG4gKiBAdHlwZSB7aW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuRXhwb3J0TWFwfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9FWFBPUlRfTUFQID0ge1xuICBbRVhQT1JUX01BUF9GT1JNQVRTLkhUTUxdOiBERUZBVUxUX0VYUE9SVF9IVE1MLFxuICBbRVhQT1JUX01BUF9GT1JNQVRTLkpTT05dOiBERUZBVUxUX0VYUE9SVF9KU09OLFxuICBmb3JtYXQ6IEVYUE9SVF9NQVBfRk9STUFUUy5IVE1MXG59O1xuXG4vKipcbiAqIERlZmF1bHQgaW5pdGlhbCBgdWlTdGF0ZWBcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHJlYWRPbmx5IERlZmF1bHQ6IGBmYWxzZWBcbiAqIEBwcm9wZXJ0eSBhY3RpdmVTaWRlUGFuZWwgRGVmYXVsdDogYCdsYXllcidgXG4gKiBAcHJvcGVydHkgY3VycmVudE1vZGFsIERlZmF1bHQ6IGAnYWRkRGF0YSdgXG4gKiBAcHJvcGVydHkgZGF0YXNldEtleVRvUmVtb3ZlIERlZmF1bHQ6IGBudWxsYFxuICogQHByb3BlcnR5IHZpc2libGVEcm9wZG93biBEZWZhdWx0OiBgbnVsbGBcbiAqIEBwcm9wZXJ0eSBleHBvcnRJbWFnZSBEZWZhdWx0OiBbYERFRkFVTFRfRVhQT1JUX0lNQUdFYF0oI2RlZmF1bHRfZXhwb3J0X2ltYWdlKVxuICogQHByb3BlcnR5IGV4cG9ydERhdGEgRGVmYXVsdDogW2BERUZBVUxUX0VYUE9SVF9EQVRBYF0oI2RlZmF1bHRfZXhwb3J0X2RhdGEpXG4gKiBAcHJvcGVydHkgZXhwb3J0TWFwIERlZmF1bHQ6IFtgREVGQVVMVF9FWFBPUlRfTUFQYF0oI2RlZmF1bHRfZXhwb3J0X21hcClcbiAqIEBwcm9wZXJ0eSBtYXBDb250cm9scyBEZWZhdWx0OiBbYERFRkFVTFRfTUFQX0NPTlRST0xTYF0oI2RlZmF1bHRfbWFwX2NvbnRyb2xzKVxuICogQHByb3BlcnR5IG5vdGlmaWNhdGlvbnMgRGVmYXVsdDogYFtdYFxuICogQHByb3BlcnR5IG5vdGlmaWNhdGlvbnMgRGVmYXVsdDogYFtdYFxuICogQHByb3BlcnR5IGxvYWRGaWxlc1xuICogQHR5cGUge2ltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLlVpU3RhdGV9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBJTklUSUFMX1VJX1NUQVRFID0ge1xuICByZWFkT25seTogZmFsc2UsXG4gIGFjdGl2ZVNpZGVQYW5lbDogREVGQVVMVF9BQ1RJVkVfU0lERV9QQU5FTCxcbiAgY3VycmVudE1vZGFsOiBERUZBVUxUX01PREFMLFxuICBkYXRhc2V0S2V5VG9SZW1vdmU6IG51bGwsXG4gIHZpc2libGVEcm9wZG93bjogbnVsbCxcbiAgLy8gZXhwb3J0IGltYWdlIG1vZGFsIHVpXG4gIGV4cG9ydEltYWdlOiBERUZBVUxUX0VYUE9SVF9JTUFHRSxcbiAgLy8gZXhwb3J0IGRhdGEgbW9kYWwgdWlcbiAgZXhwb3J0RGF0YTogREVGQVVMVF9FWFBPUlRfREFUQSxcbiAgLy8gaHRtbCBleHBvcnRcbiAgZXhwb3J0TWFwOiBERUZBVUxUX0VYUE9SVF9NQVAsXG4gIC8vIG1hcCBjb250cm9sIHBhbmVsc1xuICBtYXBDb250cm9sczogREVGQVVMVF9NQVBfQ09OVFJPTFMsXG4gIC8vIHVpIG5vdGlmaWNhdGlvbnNcbiAgbm90aWZpY2F0aW9uczogREVGQVVMVF9OT1RJRklDQVRJT05TLFxuICAvLyBsb2FkIGZpbGVzXG4gIGxvYWRGaWxlczogREVGQVVMVF9MT0FEX0ZJTEVTLFxuICAvLyBMb2NhbGUgb2YgdGhlIFVJXG4gIGxvY2FsZTogTE9DQUxFX0NPREVTLmVuXG59O1xuXG4vKiBVcGRhdGVycyAqL1xuLyoqXG4gKiBUb2dnbGUgYWN0aXZlIHNpZGUgcGFuZWxcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZCBpZCBvZiBzaWRlIHBhbmVsIHRvIGJlIHNob3duLCBvbmUgb2YgYGxheWVyYCwgYGZpbHRlcmAsIGBpbnRlcmFjdGlvbmAsIGBtYXBgLiBjbG9zZSBzaWRlIHBhbmVsIGlmIGBudWxsYFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZVNpZGVQYW5lbFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVTaWRlUGFuZWxVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogaWR9KSA9PiB7XG4gIHJldHVybiBpZCA9PT0gc3RhdGUuYWN0aXZlU2lkZVBhbmVsXG4gICAgPyBzdGF0ZVxuICAgIDoge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgYWN0aXZlU2lkZVBhbmVsOiBpZFxuICAgICAgfTtcbn07XG5cbi8qKlxuICogU2hvdyBhbmQgaGlkZSBtb2RhbCBkaWFsb2dcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbWFjdGlvbi5wYXlsb2FkIGlkIG9mIG1vZGFsIHRvIGJlIHNob3duLCBudWxsIHRvIGhpZGUgbW9kYWxzLiBPbmUgb2Y6XG4gKiAgLSBbYERBVEFfVEFCTEVfSURgXSguLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5tZCNkYXRhX3RhYmxlX2lkKVxuICogIC0gW2BERUxFVEVfREFUQV9JRGBdKC4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzLm1kI2RlbGV0ZV9kYXRhX2lkKVxuICogIC0gW2BBRERfREFUQV9JRGBdKC4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzLm1kI2FkZF9kYXRhX2lkKVxuICogIC0gW2BFWFBPUlRfSU1BR0VfSURgXSguLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5tZCNleHBvcnRfaW1hZ2VfaWQpXG4gKiAgLSBbYEVYUE9SVF9EQVRBX0lEYF0oLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MubWQjZXhwb3J0X2RhdGFfaWQpXG4gKiAgLSBbYEFERF9NQVBfU1RZTEVfSURgXSguLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5tZCNhZGRfbWFwX3N0eWxlX2lkKVxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZU1vZGFsVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZU1vZGFsVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IGlkfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGN1cnJlbnRNb2RhbDogaWRcbn0pO1xuXG4vKipcbiAqIEhpZGUgYW5kIHNob3cgc2lkZSBwYW5lbCBoZWFkZXIgZHJvcGRvd24sIGFjdGl2YXRlZCBieSBjbGlja2luZyB0aGUgc2hhcmUgbGluayBvbiB0b3Agb2YgdGhlIHNpZGUgcGFuZWxcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc2hvd0V4cG9ydERyb3Bkb3duVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNob3dFeHBvcnREcm9wZG93blVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBpZH0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICB2aXNpYmxlRHJvcGRvd246IGlkXG59KTtcblxuLyoqXG4gKiBIaWRlIHNpZGUgcGFuZWwgaGVhZGVyIGRyb3Bkb3duLCBhY3RpdmF0ZWQgYnkgY2xpY2tpbmcgdGhlIHNoYXJlIGxpbmsgb24gdG9wIG9mIHRoZSBzaWRlIHBhbmVsXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLmhpZGVFeHBvcnREcm9wZG93blVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBoaWRlRXhwb3J0RHJvcGRvd25VcGRhdGVyID0gc3RhdGUgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIHZpc2libGVEcm9wZG93bjogbnVsbFxufSk7XG5cbi8qKlxuICogVG9nZ2xlIGFjdGl2ZSBtYXAgY29udHJvbCBwYW5lbFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvbiBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZCBtYXAgY29udHJvbCBwYW5lbCBpZCwgb25lIG9mIHRoZSBrZXlzIG9mOiBbYERFRkFVTFRfTUFQX0NPTlRST0xTYF0oI2RlZmF1bHRfbWFwX2NvbnRyb2xzKVxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZU1hcENvbnRyb2xVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlTWFwQ29udHJvbFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiB7cGFuZWxJZCwgaW5kZXggPSAwfX0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBtYXBDb250cm9sczoge1xuICAgIC4uLnN0YXRlLm1hcENvbnRyb2xzLFxuICAgIFtwYW5lbElkXToge1xuICAgICAgLi4uc3RhdGUubWFwQ29udHJvbHNbcGFuZWxJZF0sXG4gICAgICAvLyB0aGlzIGhhbmRsZXMgc3BsaXQgbWFwIGludGVyYWN0aW9uXG4gICAgICAvLyBUb2dnbGluZyBmcm9tIHdpdGhpbiB0aGUgc2FtZSBtYXAgd2lsbCBzaW1wbHkgdG9nZ2xlIHRoZSBhY3RpdmUgcHJvcGVydHlcbiAgICAgIC8vIFRvZ2dsaW5nIGZyb20gd2l0aGluIGRpZmZlcmVudCBtYXBzIHdlIHNldCB0aGUgYWN0aXZlIHByb3BlcnR5IHRvIHRydWVcbiAgICAgIGFjdGl2ZTpcbiAgICAgICAgaW5kZXggPT09IHN0YXRlLm1hcENvbnRyb2xzW3BhbmVsSWRdLmFjdGl2ZU1hcEluZGV4XG4gICAgICAgICAgPyAhc3RhdGUubWFwQ29udHJvbHNbcGFuZWxJZF0uYWN0aXZlXG4gICAgICAgICAgOiB0cnVlLFxuICAgICAgYWN0aXZlTWFwSW5kZXg6IGluZGV4XG4gICAgfVxuICB9XG59KTtcblxuLyoqXG4gKiBUb2dnbGUgYWN0aXZlIG1hcCBjb250cm9sIHBhbmVsXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQgZGF0YXNldCBpZFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLm9wZW5EZWxldGVNb2RhbFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBvcGVuRGVsZXRlTW9kYWxVcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogZGF0YXNldEtleVRvUmVtb3ZlfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGN1cnJlbnRNb2RhbDogREVMRVRFX0RBVEFfSUQsXG4gIGRhdGFzZXRLZXlUb1JlbW92ZVxufSk7XG5cbi8qKlxuICogU2V0IGBleHBvcnRJbWFnZS5sZWdlbmRgIHRvIGB0cnVlYCBvciBgZmFsc2VgXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc2V0RXhwb3J0SW1hZ2VTZXR0aW5nVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEV4cG9ydEltYWdlU2V0dGluZ1VwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBuZXdTZXR0aW5nfSkgPT4ge1xuICBjb25zdCB1cGRhdGVkID0gey4uLnN0YXRlLmV4cG9ydEltYWdlLCAuLi5uZXdTZXR0aW5nfTtcbiAgY29uc3QgaW1hZ2VTaXplID0gY2FsY3VsYXRlRXhwb3J0SW1hZ2VTaXplKHVwZGF0ZWQpIHx8IHN0YXRlLmV4cG9ydEltYWdlLmltYWdlU2l6ZTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGV4cG9ydEltYWdlOiB7XG4gICAgICAuLi51cGRhdGVkLFxuICAgICAgaW1hZ2VTaXplXG4gICAgfVxuICB9O1xufTtcblxuLyoqXG4gKiBTZXQgYGV4cG9ydEltYWdlLmV4cG9ydGluZ2AgdG8gYHRydWVgXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc3RhcnRFeHBvcnRpbmdJbWFnZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzdGFydEV4cG9ydGluZ0ltYWdlVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRJbWFnZToge1xuICAgIC4uLnN0YXRlLmV4cG9ydEltYWdlLFxuICAgIGV4cG9ydGluZzogdHJ1ZSxcbiAgICBpbWFnZURhdGFVcmk6ICcnXG4gIH1cbn0pO1xuXG4vKipcbiAqIFNldCBgZXhwb3J0SW1hZ2Uuc2V0RXhwb3J0SW1hZ2VEYXRhVXJpYCB0byBhIGltYWdlIGRhdGFVcmlcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZCBleHBvcnQgaW1hZ2UgZGF0YSB1cmlcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zZXRFeHBvcnRJbWFnZURhdGFVcmlVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0SW1hZ2VEYXRhVXJpVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IGRhdGFVcml9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZXhwb3J0SW1hZ2U6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnRJbWFnZSxcbiAgICBleHBvcnRpbmc6IGZhbHNlLFxuICAgIGltYWdlRGF0YVVyaTogZGF0YVVyaVxuICB9XG59KTtcblxuLyoqXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldEV4cG9ydEltYWdlRXJyb3JVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0SW1hZ2VFcnJvclVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBlcnJvcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRJbWFnZToge1xuICAgIC4uLnN0YXRlLmV4cG9ydEltYWdlLFxuICAgIGV4cG9ydGluZzogZmFsc2UsXG4gICAgZXJyb3JcbiAgfVxufSk7XG5cbi8qKlxuICogRGVsZXRlIGNhY2hlZCBleHBvcnQgaW1hZ2VcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuY2xlYW51cEV4cG9ydEltYWdlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGNsZWFudXBFeHBvcnRJbWFnZVVwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZXhwb3J0SW1hZ2U6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnRJbWFnZSxcbiAgICBleHBvcnRpbmc6IGZhbHNlLFxuICAgIGltYWdlRGF0YVVyaTogJycsXG4gICAgZXJyb3I6IGZhbHNlXG4gIH1cbn0pO1xuXG4vKipcbiAqIFNldCBzZWxlY3RlZCBkYXRhc2V0IGZvciBleHBvcnRcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZCBkYXRhc2V0IGlkXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc2V0RXhwb3J0U2VsZWN0ZWREYXRhc2V0VXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEV4cG9ydFNlbGVjdGVkRGF0YXNldFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBkYXRhc2V0fSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGV4cG9ydERhdGE6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnREYXRhLFxuICAgIHNlbGVjdGVkRGF0YXNldDogZGF0YXNldFxuICB9XG59KTtcblxuLyoqXG4gKiBTZXQgZGF0YSBmb3JtYXQgZm9yIGV4cG9ydGluZyBkYXRhXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQgb25lIG9mIGAndGV4dC9jc3YnYFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldEV4cG9ydERhdGFUeXBlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEV4cG9ydERhdGFUeXBlVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IGRhdGFUeXBlfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGV4cG9ydERhdGE6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnREYXRhLFxuICAgIGRhdGFUeXBlXG4gIH1cbn0pO1xuXG4vKipcbiAqIFdoZXRoZXIgdG8gZXhwb3J0IGZpbHRlcmVkIGRhdGEsIGB0cnVlYCBvciBgZmFsc2VgXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWRcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zZXRFeHBvcnRGaWx0ZXJlZFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRGaWx0ZXJlZFVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBmaWx0ZXJlZH0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnREYXRhOiB7XG4gICAgLi4uc3RhdGUuZXhwb3J0RGF0YSxcbiAgICBmaWx0ZXJlZFxuICB9XG59KTtcblxuLyoqXG4gKiBXaGV0aGVyIHRvIGluY2x1ZGluZyBkYXRhIGluIG1hcCBjb25maWcsIHRvZ2dsZSBiZXR3ZWVuIGB0cnVlYCBvciBgZmFsc2VgXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuc2V0RXhwb3J0RGF0YVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnREYXRhVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRNYXA6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnRNYXAsXG4gICAgW0VYUE9SVF9NQVBfRk9STUFUUy5KU09OXToge1xuICAgICAgLi4uc3RhdGUuZXhwb3J0TWFwW0VYUE9SVF9NQVBfRk9STUFUUy5KU09OXSxcbiAgICAgIGhhc0RhdGE6ICFzdGF0ZS5leHBvcnRNYXBbRVhQT1JUX01BUF9GT1JNQVRTLkpTT05dLmhhc0RhdGFcbiAgICB9XG4gIH1cbn0pO1xuXG4vKipcbiAqIHdoZXRoZXIgdG8gZXhwb3J0IGEgbWFwYm94IGFjY2VzcyB0byBIVE1MIHNpbmdsZSBwYWdlXG4gKiBAcGFyYW0gc3RhdGUgLSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnNldFVzZXJNYXBib3hBY2Nlc3NUb2tlblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRVc2VyTWFwYm94QWNjZXNzVG9rZW5VcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogdXNlck1hcGJveFRva2VufSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGV4cG9ydE1hcDoge1xuICAgIC4uLnN0YXRlLmV4cG9ydE1hcCxcbiAgICBbRVhQT1JUX01BUF9GT1JNQVRTLkhUTUxdOiB7XG4gICAgICAuLi5zdGF0ZS5leHBvcnRNYXBbRVhQT1JUX01BUF9GT1JNQVRTLkhUTUxdLFxuICAgICAgdXNlck1hcGJveFRva2VuXG4gICAgfVxuICB9XG59KTtcblxuLyoqXG4gKiBTZXRzIHRoZSBleHBvcnQgbWFwIGZvcm1hdFxuICogQHBhcmFtIHN0YXRlIC0gYHVpU3RhdGVgXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcGFyYW0gYWN0aW9uLnBheWxvYWQgZm9ybWF0IHRvIHVzZSB0byBleHBvcnQgdGhlIG1hcCBpbnRvXG4gKiBAcmV0dXJuIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zZXRFeHBvcnRNYXBGb3JtYXRVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0TWFwRm9ybWF0VXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IGZvcm1hdH0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBleHBvcnRNYXA6IHtcbiAgICAuLi5zdGF0ZS5leHBvcnRNYXAsXG4gICAgZm9ybWF0XG4gIH1cbn0pO1xuXG4vKipcbiAqIFNldCB0aGUgZXhwb3J0IGh0bWwgbWFwIG1vZGVcbiAqIEBwYXJhbSBzdGF0ZSAtIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkIHRvIGJlIHNldCAoYXZhaWxhYmxlIG1vZGVzOiBFWFBPUlRfSFRNTF9NQVBfTU9ERVMpXG4gKiBAcmV0dXJuIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zZXRFeHBvcnRNYXBIVE1MTW9kZVVwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRNYXBIVE1MTW9kZVVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiBtb2RlfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGV4cG9ydE1hcDoge1xuICAgIC4uLnN0YXRlLmV4cG9ydE1hcCxcbiAgICBbRVhQT1JUX01BUF9GT1JNQVRTLkhUTUxdOiB7XG4gICAgICAuLi5zdGF0ZS5leHBvcnRNYXBbRVhQT1JUX01BUF9GT1JNQVRTLkhUTUxdLFxuICAgICAgbW9kZVxuICAgIH1cbiAgfVxufSk7XG5cbi8qKlxuICogQWRkIGEgbm90aWZpY2F0aW9uIHRvIGJlIGRpc3BsYXllZFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykuYWRkTm90aWZpY2F0aW9uVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGFkZE5vdGlmaWNhdGlvblVwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIG5vdGlmaWNhdGlvbnM6IFsuLi4oc3RhdGUubm90aWZpY2F0aW9ucyB8fCBbXSksIGNyZWF0ZU5vdGlmaWNhdGlvbihwYXlsb2FkKV1cbn0pO1xuXG4vKipcbiAqIFJlbW92ZSBhIG5vdGlmaWNhdGlvblxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHBhcmFtIGFjdGlvblxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkIGlkIG9mIHRoZSBub3RpZmljYXRpb24gdG8gYmUgcmVtb3ZlZFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLnJlbW92ZU5vdGlmaWNhdGlvblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVOb3RpZmljYXRpb25VcGRhdGVyID0gKHN0YXRlLCB7cGF5bG9hZDogaWR9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbm90aWZpY2F0aW9uczogc3RhdGUubm90aWZpY2F0aW9ucy5maWx0ZXIobiA9PiBuLmlkICE9PSBpZClcbn0pO1xuXG4vKipcbiAqIEZpcmVkIHdoZW4gZmlsZSBsb2FkaW5nIGJlZ2luXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGUgYHVpU3RhdGVgXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykubG9hZEZpbGVzVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGxvYWRGaWxlc1VwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbG9hZEZpbGVzOiB7XG4gICAgLi4uc3RhdGUubG9hZEZpbGVzLFxuICAgIGZpbGVMb2FkaW5nOiB0cnVlXG4gIH1cbn0pO1xuXG4vKipcbiAqIEhhbmRsZXMgbG9hZGluZyBmaWxlIHN1Y2Nlc3MgYW5kIHNldCBmaWxlTG9hZGluZyBwcm9wZXJ0eSB0byBmYWxzZVxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlIGB1aVN0YXRlYFxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS11cGRhdGVycycpLmxvYWRGaWxlc1N1Y2Nlc3NVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgbG9hZEZpbGVzU3VjY2Vzc1VwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbG9hZEZpbGVzOiB7XG4gICAgLi4uc3RhdGUubG9hZEZpbGVzLFxuICAgIGZpbGVMb2FkaW5nOiBmYWxzZVxuICB9XG59KTtcblxuLyoqXG4gKiBIYW5kbGVzIGxvYWQgZmlsZSBlcnJvciBhbmQgc2V0IGZpbGVMb2FkaW5nIHByb3BlcnR5IHRvIGZhbHNlXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24uZXJyb3JcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5sb2FkRmlsZXNFcnJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbG9hZEZpbGVzRXJyVXBkYXRlciA9IChzdGF0ZSwge2Vycm9yfSkgPT5cbiAgYWRkTm90aWZpY2F0aW9uVXBkYXRlcihcbiAgICB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGxvYWRGaWxlczoge1xuICAgICAgICAuLi5zdGF0ZS5sb2FkRmlsZXMsXG4gICAgICAgIGZpbGVMb2FkaW5nOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgcGF5bG9hZDogZXJyb3JOb3RpZmljYXRpb24oe1xuICAgICAgICBtZXNzYWdlOiAoZXJyb3IgfHwge30pLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byB1cGxvYWQgZmlsZXMnLFxuICAgICAgICB0b3BpYzogREVGQVVMVF9OT1RJRklDQVRJT05fVE9QSUNTLmdsb2JhbFxuICAgICAgfSlcbiAgICB9XG4gICk7XG5cbi8qKlxuICogSGFuZGxlcyB0b2dnbGUgbWFwIHNwbGl0IGFuZCByZXNldCBhbGwgbWFwIGNvbnRyb2wgaW5kZXggdG8gMFxuICogQG1lbWJlcm9mIHVpU3RhdGVVcGRhdGVyc1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLXVwZGF0ZXJzJykudG9nZ2xlU3BsaXRNYXBVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlU3BsaXRNYXBVcGRhdGVyID0gc3RhdGUgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIG1hcENvbnRyb2xzOiBPYmplY3QuZW50cmllcyhzdGF0ZS5tYXBDb250cm9scykucmVkdWNlKFxuICAgIChhY2MsIGVudHJ5KSA9PiAoe1xuICAgICAgLi4uYWNjLFxuICAgICAgW2VudHJ5WzBdXToge1xuICAgICAgICAuLi5lbnRyeVsxXSxcbiAgICAgICAgYWN0aXZlTWFwSW5kZXg6IDBcbiAgICAgIH1cbiAgICB9KSxcbiAgICB7fVxuICApXG59KTtcblxuLyoqXG4gKiBTZXQgdGhlIGxvY2FsZSBvZiB0aGUgVUlcbiAqIEBtZW1iZXJvZiB1aVN0YXRlVXBkYXRlcnNcbiAqIEBwYXJhbSBzdGF0ZSBgdWlTdGF0ZWBcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEBwYXJhbSBhY3Rpb24ucGF5bG9hZFxuICogQHBhcmFtIGFjdGlvbi5wYXlsb2FkLmxvY2FsZSBsb2NhbGVcbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtdXBkYXRlcnMnKS5zZXRMb2NhbGVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0TG9jYWxlVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IHtsb2NhbGV9fSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGxvY2FsZVxufSk7XG4iXX0=