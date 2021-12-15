"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStateToProps = mapStateToProps;
exports["default"] = exports.DEFAULT_KEPLER_GL_PROPS = exports.notificationPanelSelector = exports.geoCoderPanelSelector = exports.modalContainerSelector = exports.bottomWidgetSelector = exports.containerWSelector = exports.isSplitSelector = exports.plotContainerSelector = exports.sidePanelSelector = exports.mapFieldsSelector = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _window = require("global/window");

var _redux = require("redux");

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _reselect = require("reselect");

var _keplerglConnect = require("../connect/keplergl-connect");

var _reactIntl = require("react-intl");

var _localization = require("../localization");

var _context = require("./context");

var VisStateActions = _interopRequireWildcard(require("../actions/vis-state-actions"));

var MapStateActions = _interopRequireWildcard(require("../actions/map-state-actions"));

var MapStyleActions = _interopRequireWildcard(require("../actions/map-style-actions"));

var UIStateActions = _interopRequireWildcard(require("../actions/ui-state-actions"));

var ProviderActions = _interopRequireWildcard(require("../actions/provider-actions"));

var _defaultSettings = require("../constants/default-settings");

var _userFeedbacks = require("../constants/user-feedbacks");

var _sidePanel = _interopRequireDefault(require("./side-panel"));

var _mapContainer = _interopRequireDefault(require("./map-container"));

var _bottomWidget = _interopRequireDefault(require("./bottom-widget"));

var _modalContainer = _interopRequireDefault(require("./modal-container"));

var _plotContainer = _interopRequireDefault(require("./plot-container"));

var _notificationPanel = _interopRequireDefault(require("./notification-panel"));

var _geocoderPanel = _interopRequireDefault(require("./geocoder-panel"));

var _utils = require("../utils/utils");

var _mapboxUtils = require("../utils/mapbox-utils");

var _localeUtils = require("../utils/locale-utils");

var _base = require("../styles/base");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// Maybe we should think about exporting this or creating a variable
// as part of the base.js theme
var GlobalStyle = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  font-family: ", ";\n  font-weight: ", ";\n  font-size: ", ";\n  line-height: ", ";\n\n  *,\n  *:before,\n  *:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n  }\n\n  ul {\n    margin: 0;\n    padding: 0;\n  }\n\n  li {\n    margin: 0;\n  }\n\n  a {\n    text-decoration: none;\n    color: ", ";\n  }\n\n  .mapboxgl-ctrl .mapboxgl-ctrl-logo {\n    display: none;\n  }\n"])), function (props) {
  return props.theme.fontFamily;
}, function (props) {
  return props.theme.fontWeight;
}, function (props) {
  return props.theme.fontSize;
}, function (props) {
  return props.theme.lineHeight;
}, function (props) {
  return props.theme.labelColor;
});

var mapFieldsSelector = function mapFieldsSelector(props) {
  return {
    getMapboxRef: props.getMapboxRef,
    mapboxApiAccessToken: props.mapboxApiAccessToken,
    mapboxApiUrl: props.mapboxApiUrl,
    mapState: props.mapState,
    mapStyle: props.mapStyle,
    onDeckInitialized: props.onDeckInitialized,
    onViewStateChange: props.onViewStateChange,
    deckGlProps: props.deckGlProps,
    uiStateActions: props.uiStateActions,
    visStateActions: props.visStateActions,
    mapStateActions: props.mapStateActions,
    // visState
    editor: props.visState.editor,
    datasets: props.visState.datasets,
    layers: props.visState.layers,
    layerOrder: props.visState.layerOrder,
    layerData: props.visState.layerData,
    layerBlending: props.visState.layerBlending,
    filters: props.visState.filters,
    interactionConfig: props.visState.interactionConfig,
    hoverInfo: props.visState.hoverInfo,
    clicked: props.visState.clicked,
    mousePos: props.visState.mousePos,
    animationConfig: props.visState.animationConfig,
    // uiState
    activeSidePanel: props.uiState.activeSidePanel,
    mapControls: props.uiState.mapControls,
    readOnly: props.uiState.readOnly,
    locale: props.uiState.locale
  };
};

exports.mapFieldsSelector = mapFieldsSelector;

var sidePanelSelector = function sidePanelSelector(props, availableProviders) {
  return {
    appName: props.appName,
    version: props.version,
    appWebsite: props.appWebsite,
    mapStyle: props.mapStyle,
    onSaveMap: props.onSaveMap,
    uiState: props.uiState,
    mapStyleActions: props.mapStyleActions,
    visStateActions: props.visStateActions,
    uiStateActions: props.uiStateActions,
    datasets: props.visState.datasets,
    filters: props.visState.filters,
    layers: props.visState.layers,
    layerOrder: props.visState.layerOrder,
    layerClasses: props.visState.layerClasses,
    interactionConfig: props.visState.interactionConfig,
    mapInfo: props.visState.mapInfo,
    layerBlending: props.visState.layerBlending,
    width: props.sidePanelWidth,
    availableProviders: availableProviders,
    mapSaved: props.providerState.mapSaved
  };
};

exports.sidePanelSelector = sidePanelSelector;

var plotContainerSelector = function plotContainerSelector(props) {
  return {
    width: props.width,
    height: props.height,
    exportImageSetting: props.uiState.exportImage,
    mapFields: mapFieldsSelector(props),
    addNotification: props.uiStateActions.addNotification,
    setExportImageSetting: props.uiStateActions.setExportImageSetting,
    setExportImageDataUri: props.uiStateActions.setExportImageDataUri,
    setExportImageError: props.uiStateActions.setExportImageError,
    splitMaps: props.visState.splitMaps
  };
};

exports.plotContainerSelector = plotContainerSelector;

var isSplitSelector = function isSplitSelector(props) {
  return props.visState.splitMaps && props.visState.splitMaps.length > 1;
};

exports.isSplitSelector = isSplitSelector;

var containerWSelector = function containerWSelector(props) {
  return props.mapState.width * (Number(isSplitSelector(props)) + 1);
};

exports.containerWSelector = containerWSelector;

var bottomWidgetSelector = function bottomWidgetSelector(props, theme) {
  return {
    filters: props.visState.filters,
    datasets: props.visState.datasets,
    uiState: props.uiState,
    layers: props.visState.layers,
    animationConfig: props.visState.animationConfig,
    visStateActions: props.visStateActions,
    sidePanelWidth: props.uiState.readOnly ? 0 : props.sidePanelWidth + theme.sidePanel.margin.left,
    containerW: containerWSelector(props)
  };
};

exports.bottomWidgetSelector = bottomWidgetSelector;

var modalContainerSelector = function modalContainerSelector(props, rootNode) {
  return {
    appName: props.appName,
    mapStyle: props.mapStyle,
    visState: props.visState,
    mapState: props.mapState,
    uiState: props.uiState,
    providerState: props.providerState,
    mapboxApiAccessToken: props.mapboxApiAccessToken,
    mapboxApiUrl: props.mapboxApiUrl,
    visStateActions: props.visStateActions,
    uiStateActions: props.uiStateActions,
    mapStyleActions: props.mapStyleActions,
    providerActions: props.providerActions,
    rootNode: rootNode,
    containerW: containerWSelector(props),
    containerH: props.mapState.height,
    // User defined cloud provider props
    cloudProviders: props.cloudProviders,
    onExportToCloudSuccess: props.onExportToCloudSuccess,
    onLoadCloudMapSuccess: props.onLoadCloudMapSuccess,
    onLoadCloudMapError: props.onLoadCloudMapError,
    onExportToCloudError: props.onExportToCloudError
  };
};

exports.modalContainerSelector = modalContainerSelector;

var geoCoderPanelSelector = function geoCoderPanelSelector(props) {
  return {
    isGeocoderEnabled: props.visState.interactionConfig.geocoder.enabled,
    mapboxApiAccessToken: props.mapboxApiAccessToken,
    mapState: props.mapState,
    updateVisData: props.visStateActions.updateVisData,
    removeDataset: props.visStateActions.removeDataset,
    updateMap: props.mapStateActions.updateMap
  };
};

exports.geoCoderPanelSelector = geoCoderPanelSelector;

var notificationPanelSelector = function notificationPanelSelector(props) {
  return {
    removeNotification: props.uiStateActions.removeNotification,
    notifications: props.uiState.notifications
  };
};

exports.notificationPanelSelector = notificationPanelSelector;
var DEFAULT_KEPLER_GL_PROPS = {
  mapStyles: [],
  mapStylesReplaceDefault: false,
  mapboxApiUrl: _defaultSettings.DEFAULT_MAPBOX_API_URL,
  width: 800,
  height: 800,
  appName: _defaultSettings.KEPLER_GL_NAME,
  version: _defaultSettings.KEPLER_GL_VERSION,
  sidePanelWidth: _defaultSettings.DIMENSIONS.sidePanel.width,
  theme: {},
  cloudProviders: [],
  readOnly: false
};
exports.DEFAULT_KEPLER_GL_PROPS = DEFAULT_KEPLER_GL_PROPS;
KeplerGlFactory.deps = [_bottomWidget["default"], _geocoderPanel["default"], _mapContainer["default"], _modalContainer["default"], _sidePanel["default"], _plotContainer["default"], _notificationPanel["default"]];

function KeplerGlFactory(BottomWidget, GeoCoderPanel, MapContainer, ModalContainer, SidePanel, PlotContainer, NotificationPanel) {
  /** @typedef {import('./kepler-gl').UnconnectedKeplerGlProps} KeplerGlProps */

  /** @augments React.Component<KeplerGlProps> */
  var KeplerGL = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(KeplerGL, _Component);

    var _super = _createSuper(KeplerGL);

    function KeplerGL() {
      var _this;

      (0, _classCallCheck2["default"])(this, KeplerGL);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "root", /*#__PURE__*/(0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "themeSelector", function (props) {
        return props.theme;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "availableThemeSelector", (0, _reselect.createSelector)(_this.themeSelector, function (theme) {
        return (0, _typeof2["default"])(theme) === 'object' ? _objectSpread(_objectSpread({}, _base.theme), theme) : theme === _defaultSettings.THEME.light ? _base.themeLT : theme === _defaultSettings.THEME.base ? _base.themeBS : theme;
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "availableProviders", (0, _reselect.createSelector)(function (props) {
        return props.cloudProviders;
      }, function (providers) {
        return Array.isArray(providers) && providers.length ? {
          hasStorage: providers.some(function (p) {
            return p.hasPrivateStorage();
          }),
          hasShare: providers.some(function (p) {
            return p.hasSharingUrl();
          })
        } : {};
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "localeMessagesSelector", (0, _reselect.createSelector)(function (props) {
        return props.localeMessages;
      }, function (customMessages) {
        return customMessages ? (0, _localeUtils.mergeMessages)(_localization.messages, customMessages) : _localization.messages;
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_loadMapStyle", function () {
        var defaultStyles = Object.values(_this.props.mapStyle.mapStyles); // add id to custom map styles if not given

        var customStyles = (_this.props.mapStyles || []).map(function (ms) {
          return _objectSpread(_objectSpread({}, ms), {}, {
            id: ms.id || (0, _utils.generateHashId)()
          });
        });
        var allStyles = [].concat((0, _toConsumableArray2["default"])(customStyles), (0, _toConsumableArray2["default"])(defaultStyles)).reduce(function (accu, style) {
          var hasStyleObject = style.style && (0, _typeof2["default"])(style.style) === 'object';
          accu[hasStyleObject ? 'toLoad' : 'toRequest'][style.id] = style;
          return accu;
        }, {
          toLoad: {},
          toRequest: {}
        });

        _this.props.mapStyleActions.loadMapStyles(allStyles.toLoad);

        _this.props.mapStyleActions.requestMapStyles(allStyles.toRequest);
      });
      return _this;
    }

    (0, _createClass2["default"])(KeplerGL, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._validateMapboxToken();

        this._loadMapStyle();

        this._handleResize(this.props);

        if (typeof this.props.onKeplerGlInitialized === 'function') {
          this.props.onKeplerGlInitialized();
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if ( // if dimension props has changed
        this.props.height !== prevProps.height || this.props.width !== prevProps.width || // react-map-gl will dispatch updateViewport after this._handleResize is called
        // here we check if this.props.mapState.height is sync with props.height
        this.props.height !== this.props.mapState.height) {
          this._handleResize(this.props);
        }
      }
    }, {
      key: "_validateMapboxToken",
      value:
      /* private methods */
      function _validateMapboxToken() {
        var mapboxApiAccessToken = this.props.mapboxApiAccessToken;

        if (!(0, _mapboxUtils.validateToken)(mapboxApiAccessToken)) {
          _window.console.warn(_userFeedbacks.MISSING_MAPBOX_TOKEN);
        }
      }
    }, {
      key: "_handleResize",
      value: function _handleResize(_ref) {
        var width = _ref.width,
            height = _ref.height;

        if (!Number.isFinite(width) || !Number.isFinite(height)) {
          _window.console.warn('width and height is required');

          return;
        }

        this.props.mapStateActions.updateMap({
          width: width / (1 + Number(this.props.mapState.isSplit)),
          height: height
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            id = _this$props.id,
            width = _this$props.width,
            height = _this$props.height,
            uiState = _this$props.uiState,
            visState = _this$props.visState,
            readOnly = _this$props.readOnly;
        var splitMaps = visState.splitMaps,
            interactionConfig = visState.interactionConfig;
        var isSplit = isSplitSelector(this.props);
        var theme = this.availableThemeSelector(this.props);
        var localeMessages = this.localeMessagesSelector(this.props);
        var isExportingImage = uiState.exportImage.exporting;
        var availableProviders = this.availableProviders(this.props);
        var mapFields = mapFieldsSelector(this.props);
        var sideFields = sidePanelSelector(this.props, availableProviders);
        var plotContainerFields = plotContainerSelector(this.props);
        var bottomWidgetFields = bottomWidgetSelector(this.props, theme);
        var modalContainerFields = modalContainerSelector(this.props, this.root.current);
        var geoCoderPanelFields = geoCoderPanelSelector(this.props);
        var notificationPanelFields = notificationPanelSelector(this.props);
        var mapContainers = !isSplit ? [/*#__PURE__*/_react["default"].createElement(MapContainer, (0, _extends2["default"])({
          key: 0,
          index: 0
        }, mapFields, {
          mapLayers: null
        }))] : splitMaps.map(function (settings, index) {
          return /*#__PURE__*/_react["default"].createElement(MapContainer, (0, _extends2["default"])({
            key: index,
            index: index
          }, mapFields, {
            mapLayers: splitMaps[index].layers
          }));
        });
        return /*#__PURE__*/_react["default"].createElement(_context.RootContext.Provider, {
          value: this.root
        }, /*#__PURE__*/_react["default"].createElement(_reactIntl.IntlProvider, {
          locale: uiState.locale,
          messages: localeMessages[uiState.locale]
        }, /*#__PURE__*/_react["default"].createElement(_styledComponents.ThemeProvider, {
          theme: theme
        }, /*#__PURE__*/_react["default"].createElement(GlobalStyle, {
          className: "kepler-gl",
          id: "kepler-gl__".concat(id),
          style: {
            position: 'relative',
            width: "".concat(width, "px"),
            height: "".concat(height, "px")
          },
          ref: this.root
        }, /*#__PURE__*/_react["default"].createElement(NotificationPanel, notificationPanelFields), !uiState.readOnly && !readOnly && /*#__PURE__*/_react["default"].createElement(SidePanel, sideFields), /*#__PURE__*/_react["default"].createElement("div", {
          className: "maps",
          style: {
            display: 'flex'
          }
        }, mapContainers), isExportingImage && /*#__PURE__*/_react["default"].createElement(PlotContainer, plotContainerFields), interactionConfig.geocoder.enabled && /*#__PURE__*/_react["default"].createElement(GeoCoderPanel, geoCoderPanelFields), /*#__PURE__*/_react["default"].createElement(BottomWidget, bottomWidgetFields), /*#__PURE__*/_react["default"].createElement(ModalContainer, modalContainerFields)))));
      }
    }]);
    return KeplerGL;
  }(_react.Component);

  (0, _defineProperty2["default"])(KeplerGL, "defaultProps", DEFAULT_KEPLER_GL_PROPS);
  (0, _defineProperty2["default"])(KeplerGL, "contextType", _context.RootContext);
  return (0, _keplerglConnect.connect)(mapStateToProps, makeMapDispatchToProps)((0, _styledComponents.withTheme)(KeplerGL));
}

function mapStateToProps() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var props = arguments.length > 1 ? arguments[1] : undefined;
  return _objectSpread(_objectSpread({}, props), {}, {
    visState: state.visState,
    mapStyle: state.mapStyle,
    mapState: state.mapState,
    uiState: state.uiState,
    providerState: state.providerState
  });
}

var defaultUserActions = {};

var getDispatch = function getDispatch(dispatch, props) {
  return dispatch;
};

var getUserActions = function getUserActions(dispatch, props) {
  return props.actions || defaultUserActions;
};
/** @type {() => import('reselect').OutputParametricSelector<any, any, any, any>} */


function makeGetActionCreators() {
  return (0, _reselect.createSelector)([getDispatch, getUserActions], function (dispatch, userActions) {
    var _map = [VisStateActions, MapStateActions, MapStyleActions, UIStateActions, ProviderActions].map(function (actions) {
      return (0, _redux.bindActionCreators)(mergeActions(actions, userActions), dispatch);
    }),
        _map2 = (0, _slicedToArray2["default"])(_map, 5),
        visStateActions = _map2[0],
        mapStateActions = _map2[1],
        mapStyleActions = _map2[2],
        uiStateActions = _map2[3],
        providerActions = _map2[4];

    return {
      visStateActions: visStateActions,
      mapStateActions: mapStateActions,
      mapStyleActions: mapStyleActions,
      uiStateActions: uiStateActions,
      providerActions: providerActions,
      dispatch: dispatch
    };
  });
}

function makeMapDispatchToProps() {
  var getActionCreators = makeGetActionCreators();

  var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
    var groupedActionCreators = getActionCreators(dispatch, ownProps);
    return _objectSpread(_objectSpread({}, groupedActionCreators), {}, {
      dispatch: dispatch
    });
  };

  return mapDispatchToProps;
}
/**
 * Override default kepler.gl actions with user defined actions using the same key
 */


function mergeActions(actions, userActions) {
  var overrides = {};

  for (var key in userActions) {
    if (userActions.hasOwnProperty(key) && actions.hasOwnProperty(key)) {
      overrides[key] = userActions[key];
    }
  }

  return _objectSpread(_objectSpread({}, actions), overrides);
}

var _default = KeplerGlFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJHbG9iYWxTdHlsZSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsImxhYmVsQ29sb3IiLCJtYXBGaWVsZHNTZWxlY3RvciIsImdldE1hcGJveFJlZiIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwibWFwYm94QXBpVXJsIiwibWFwU3RhdGUiLCJtYXBTdHlsZSIsIm9uRGVja0luaXRpYWxpemVkIiwib25WaWV3U3RhdGVDaGFuZ2UiLCJkZWNrR2xQcm9wcyIsInVpU3RhdGVBY3Rpb25zIiwidmlzU3RhdGVBY3Rpb25zIiwibWFwU3RhdGVBY3Rpb25zIiwiZWRpdG9yIiwidmlzU3RhdGUiLCJkYXRhc2V0cyIsImxheWVycyIsImxheWVyT3JkZXIiLCJsYXllckRhdGEiLCJsYXllckJsZW5kaW5nIiwiZmlsdGVycyIsImludGVyYWN0aW9uQ29uZmlnIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsIm1vdXNlUG9zIiwiYW5pbWF0aW9uQ29uZmlnIiwiYWN0aXZlU2lkZVBhbmVsIiwidWlTdGF0ZSIsIm1hcENvbnRyb2xzIiwicmVhZE9ubHkiLCJsb2NhbGUiLCJzaWRlUGFuZWxTZWxlY3RvciIsImF2YWlsYWJsZVByb3ZpZGVycyIsImFwcE5hbWUiLCJ2ZXJzaW9uIiwiYXBwV2Vic2l0ZSIsIm9uU2F2ZU1hcCIsIm1hcFN0eWxlQWN0aW9ucyIsImxheWVyQ2xhc3NlcyIsIm1hcEluZm8iLCJ3aWR0aCIsInNpZGVQYW5lbFdpZHRoIiwibWFwU2F2ZWQiLCJwcm92aWRlclN0YXRlIiwicGxvdENvbnRhaW5lclNlbGVjdG9yIiwiaGVpZ2h0IiwiZXhwb3J0SW1hZ2VTZXR0aW5nIiwiZXhwb3J0SW1hZ2UiLCJtYXBGaWVsZHMiLCJhZGROb3RpZmljYXRpb24iLCJzZXRFeHBvcnRJbWFnZVNldHRpbmciLCJzZXRFeHBvcnRJbWFnZURhdGFVcmkiLCJzZXRFeHBvcnRJbWFnZUVycm9yIiwic3BsaXRNYXBzIiwiaXNTcGxpdFNlbGVjdG9yIiwibGVuZ3RoIiwiY29udGFpbmVyV1NlbGVjdG9yIiwiTnVtYmVyIiwiYm90dG9tV2lkZ2V0U2VsZWN0b3IiLCJzaWRlUGFuZWwiLCJtYXJnaW4iLCJsZWZ0IiwiY29udGFpbmVyVyIsIm1vZGFsQ29udGFpbmVyU2VsZWN0b3IiLCJyb290Tm9kZSIsInByb3ZpZGVyQWN0aW9ucyIsImNvbnRhaW5lckgiLCJjbG91ZFByb3ZpZGVycyIsIm9uRXhwb3J0VG9DbG91ZFN1Y2Nlc3MiLCJvbkxvYWRDbG91ZE1hcFN1Y2Nlc3MiLCJvbkxvYWRDbG91ZE1hcEVycm9yIiwib25FeHBvcnRUb0Nsb3VkRXJyb3IiLCJnZW9Db2RlclBhbmVsU2VsZWN0b3IiLCJpc0dlb2NvZGVyRW5hYmxlZCIsImdlb2NvZGVyIiwiZW5hYmxlZCIsInVwZGF0ZVZpc0RhdGEiLCJyZW1vdmVEYXRhc2V0IiwidXBkYXRlTWFwIiwibm90aWZpY2F0aW9uUGFuZWxTZWxlY3RvciIsInJlbW92ZU5vdGlmaWNhdGlvbiIsIm5vdGlmaWNhdGlvbnMiLCJERUZBVUxUX0tFUExFUl9HTF9QUk9QUyIsIm1hcFN0eWxlcyIsIm1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0IiwiREVGQVVMVF9NQVBCT1hfQVBJX1VSTCIsIktFUExFUl9HTF9OQU1FIiwiS0VQTEVSX0dMX1ZFUlNJT04iLCJESU1FTlNJT05TIiwiS2VwbGVyR2xGYWN0b3J5IiwiZGVwcyIsIkJvdHRvbVdpZGdldEZhY3RvcnkiLCJHZW9Db2RlclBhbmVsRmFjdG9yeSIsIk1hcENvbnRhaW5lckZhY3RvcnkiLCJNb2RhbENvbnRhaW5lckZhY3RvcnkiLCJTaWRlUGFuZWxGYWN0b3J5IiwiUGxvdENvbnRhaW5lckZhY3RvcnkiLCJOb3RpZmljYXRpb25QYW5lbEZhY3RvcnkiLCJCb3R0b21XaWRnZXQiLCJHZW9Db2RlclBhbmVsIiwiTWFwQ29udGFpbmVyIiwiTW9kYWxDb250YWluZXIiLCJTaWRlUGFuZWwiLCJQbG90Q29udGFpbmVyIiwiTm90aWZpY2F0aW9uUGFuZWwiLCJLZXBsZXJHTCIsInRoZW1lU2VsZWN0b3IiLCJiYXNpY1RoZW1lIiwiVEhFTUUiLCJsaWdodCIsInRoZW1lTFQiLCJiYXNlIiwidGhlbWVCUyIsInByb3ZpZGVycyIsIkFycmF5IiwiaXNBcnJheSIsImhhc1N0b3JhZ2UiLCJzb21lIiwicCIsImhhc1ByaXZhdGVTdG9yYWdlIiwiaGFzU2hhcmUiLCJoYXNTaGFyaW5nVXJsIiwibG9jYWxlTWVzc2FnZXMiLCJjdXN0b21NZXNzYWdlcyIsIm1lc3NhZ2VzIiwiZGVmYXVsdFN0eWxlcyIsIk9iamVjdCIsInZhbHVlcyIsImN1c3RvbVN0eWxlcyIsIm1hcCIsIm1zIiwiaWQiLCJhbGxTdHlsZXMiLCJyZWR1Y2UiLCJhY2N1Iiwic3R5bGUiLCJoYXNTdHlsZU9iamVjdCIsInRvTG9hZCIsInRvUmVxdWVzdCIsImxvYWRNYXBTdHlsZXMiLCJyZXF1ZXN0TWFwU3R5bGVzIiwiX3ZhbGlkYXRlTWFwYm94VG9rZW4iLCJfbG9hZE1hcFN0eWxlIiwiX2hhbmRsZVJlc2l6ZSIsIm9uS2VwbGVyR2xJbml0aWFsaXplZCIsInByZXZQcm9wcyIsIkNvbnNvbGUiLCJ3YXJuIiwiTUlTU0lOR19NQVBCT1hfVE9LRU4iLCJpc0Zpbml0ZSIsImlzU3BsaXQiLCJhdmFpbGFibGVUaGVtZVNlbGVjdG9yIiwibG9jYWxlTWVzc2FnZXNTZWxlY3RvciIsImlzRXhwb3J0aW5nSW1hZ2UiLCJleHBvcnRpbmciLCJzaWRlRmllbGRzIiwicGxvdENvbnRhaW5lckZpZWxkcyIsImJvdHRvbVdpZGdldEZpZWxkcyIsIm1vZGFsQ29udGFpbmVyRmllbGRzIiwicm9vdCIsImN1cnJlbnQiLCJnZW9Db2RlclBhbmVsRmllbGRzIiwibm90aWZpY2F0aW9uUGFuZWxGaWVsZHMiLCJtYXBDb250YWluZXJzIiwic2V0dGluZ3MiLCJpbmRleCIsInBvc2l0aW9uIiwiZGlzcGxheSIsIkNvbXBvbmVudCIsIlJvb3RDb250ZXh0IiwibWFwU3RhdGVUb1Byb3BzIiwibWFrZU1hcERpc3BhdGNoVG9Qcm9wcyIsInN0YXRlIiwiZGVmYXVsdFVzZXJBY3Rpb25zIiwiZ2V0RGlzcGF0Y2giLCJkaXNwYXRjaCIsImdldFVzZXJBY3Rpb25zIiwiYWN0aW9ucyIsIm1ha2VHZXRBY3Rpb25DcmVhdG9ycyIsInVzZXJBY3Rpb25zIiwiVmlzU3RhdGVBY3Rpb25zIiwiTWFwU3RhdGVBY3Rpb25zIiwiTWFwU3R5bGVBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJQcm92aWRlckFjdGlvbnMiLCJtZXJnZUFjdGlvbnMiLCJnZXRBY3Rpb25DcmVhdG9ycyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIm93blByb3BzIiwiZ3JvdXBlZEFjdGlvbkNyZWF0b3JzIiwib3ZlcnJpZGVzIiwia2V5IiwiaGFzT3duUHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFPQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBLElBQU1BLFdBQVcsR0FBR0MsNkJBQU9DLEdBQVYsd2dCQUNBLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsVUFBaEI7QUFBQSxDQURMLEVBRUEsVUFBQUYsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxVQUFoQjtBQUFBLENBRkwsRUFHRixVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlHLFFBQWhCO0FBQUEsQ0FISCxFQUlBLFVBQUFKLEtBQUs7QUFBQSxTQUFJ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O0FBQ0x0RCxNQUFBQSxlQUFlLEVBQWZBLGVBREs7QUFFTEMsTUFBQUEsZUFBZSxFQUFmQSxlQUZLO0FBR0x5QixNQUFBQSxlQUFlLEVBQWZBLGVBSEs7QUFJTDNCLE1BQUFBLGNBQWMsRUFBZEEsY0FKSztBQUtMdUQsTUFBQUEsZUFBZSxFQUFmQSxlQUxLO0FBTUw4RyxNQUFBQSxRQUFRLEVBQVJBO0FBTkssS0FBUDtBQVFELEdBakJNLENBQVA7QUFrQkQ7O0FBRUQsU0FBU0osc0JBQVQsR0FBa0M7QUFDaEMsTUFBTWUsaUJBQWlCLEdBQUdSLHFCQUFxQixFQUEvQzs7QUFDQSxNQUFNUyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLENBQUNaLFFBQUQsRUFBV2EsUUFBWCxFQUF3QjtBQUNqRCxRQUFNQyxxQkFBcUIsR0FBR0gsaUJBQWlCLENBQUNYLFFBQUQsRUFBV2EsUUFBWCxDQUEvQztBQUVBLDJDQUNLQyxxQkFETDtBQUVFZCxNQUFBQSxRQUFRLEVBQVJBO0FBRkY7QUFJRCxHQVBEOztBQVNBLFNBQU9ZLGtCQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7OztBQUNBLFNBQVNGLFlBQVQsQ0FBc0JSLE9BQXRCLEVBQStCRSxXQUEvQixFQUE0QztBQUMxQyxNQUFNVyxTQUFTLEdBQUcsRUFBbEI7O0FBQ0EsT0FBSyxJQUFNQyxHQUFYLElBQWtCWixXQUFsQixFQUErQjtBQUM3QixRQUFJQSxXQUFXLENBQUNhLGNBQVosQ0FBMkJELEdBQTNCLEtBQW1DZCxPQUFPLENBQUNlLGNBQVIsQ0FBdUJELEdBQXZCLENBQXZDLEVBQW9FO0FBQ2xFRCxNQUFBQSxTQUFTLENBQUNDLEdBQUQsQ0FBVCxHQUFpQlosV0FBVyxDQUFDWSxHQUFELENBQTVCO0FBQ0Q7QUFDRjs7QUFFRCx5Q0FBV2QsT0FBWCxHQUF1QmEsU0FBdkI7QUFDRDs7ZUFFY3JHLGUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBzdHlsZWQsIHtUaGVtZVByb3ZpZGVyLCB3aXRoVGhlbWV9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7Y29ubmVjdCBhcyBrZXBsZXJHbENvbm5lY3R9IGZyb20gJ2Nvbm5lY3Qva2VwbGVyZ2wtY29ubmVjdCc7XG5pbXBvcnQge0ludGxQcm92aWRlcn0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQge21lc3NhZ2VzfSBmcm9tICcuLi9sb2NhbGl6YXRpb24nO1xuaW1wb3J0IHtSb290Q29udGV4dH0gZnJvbSAnY29tcG9uZW50cy9jb250ZXh0JztcblxuaW1wb3J0ICogYXMgVmlzU3RhdGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgTWFwU3RhdGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvbWFwLXN0YXRlLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgTWFwU3R5bGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvbWFwLXN0eWxlLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgVUlTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy91aS1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIFByb3ZpZGVyQWN0aW9ucyBmcm9tICdhY3Rpb25zL3Byb3ZpZGVyLWFjdGlvbnMnO1xuXG5pbXBvcnQge1xuICBESU1FTlNJT05TLFxuICBLRVBMRVJfR0xfTkFNRSxcbiAgS0VQTEVSX0dMX1ZFUlNJT04sXG4gIFRIRU1FLFxuICBERUZBVUxUX01BUEJPWF9BUElfVVJMXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7TUlTU0lOR19NQVBCT1hfVE9LRU59IGZyb20gJ2NvbnN0YW50cy91c2VyLWZlZWRiYWNrcyc7XG5cbmltcG9ydCBTaWRlUGFuZWxGYWN0b3J5IGZyb20gJy4vc2lkZS1wYW5lbCc7XG5pbXBvcnQgTWFwQ29udGFpbmVyRmFjdG9yeSBmcm9tICcuL21hcC1jb250YWluZXInO1xuaW1wb3J0IEJvdHRvbVdpZGdldEZhY3RvcnkgZnJvbSAnLi9ib3R0b20td2lkZ2V0JztcbmltcG9ydCBNb2RhbENvbnRhaW5lckZhY3RvcnkgZnJvbSAnLi9tb2RhbC1jb250YWluZXInO1xuaW1wb3J0IFBsb3RDb250YWluZXJGYWN0b3J5IGZyb20gJy4vcGxvdC1jb250YWluZXInO1xuaW1wb3J0IE5vdGlmaWNhdGlvblBhbmVsRmFjdG9yeSBmcm9tICcuL25vdGlmaWNhdGlvbi1wYW5lbCc7XG5pbXBvcnQgR2VvQ29kZXJQYW5lbEZhY3RvcnkgZnJvbSAnLi9nZW9jb2Rlci1wYW5lbCc7XG5cbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7dmFsaWRhdGVUb2tlbn0gZnJvbSAndXRpbHMvbWFwYm94LXV0aWxzJztcbmltcG9ydCB7bWVyZ2VNZXNzYWdlc30gZnJvbSAndXRpbHMvbG9jYWxlLXV0aWxzJztcblxuaW1wb3J0IHt0aGVtZSBhcyBiYXNpY1RoZW1lLCB0aGVtZUxULCB0aGVtZUJTfSBmcm9tICdzdHlsZXMvYmFzZSc7XG5cbi8vIE1heWJlIHdlIHNob3VsZCB0aGluayBhYm91dCBleHBvcnRpbmcgdGhpcyBvciBjcmVhdGluZyBhIHZhcmlhYmxlXG4vLyBhcyBwYXJ0IG9mIHRoZSBiYXNlLmpzIHRoZW1lXG5jb25zdCBHbG9iYWxTdHlsZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtZmFtaWx5OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmZvbnRGYW1pbHl9O1xuICBmb250LXdlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mb250V2VpZ2h0fTtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmZvbnRTaXplfTtcbiAgbGluZS1oZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGluZUhlaWdodH07XG5cbiAgKixcbiAgKjpiZWZvcmUsXG4gICo6YWZ0ZXIge1xuICAgIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAtbW96LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuXG4gIHVsIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gIGxpIHtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICBhIHtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIH1cblxuICAubWFwYm94Z2wtY3RybCAubWFwYm94Z2wtY3RybC1sb2dvIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgbWFwRmllbGRzU2VsZWN0b3IgPSBwcm9wcyA9PiAoe1xuICBnZXRNYXBib3hSZWY6IHByb3BzLmdldE1hcGJveFJlZixcbiAgbWFwYm94QXBpQWNjZXNzVG9rZW46IHByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICBtYXBib3hBcGlVcmw6IHByb3BzLm1hcGJveEFwaVVybCxcbiAgbWFwU3RhdGU6IHByb3BzLm1hcFN0YXRlLFxuICBtYXBTdHlsZTogcHJvcHMubWFwU3R5bGUsXG4gIG9uRGVja0luaXRpYWxpemVkOiBwcm9wcy5vbkRlY2tJbml0aWFsaXplZCxcbiAgb25WaWV3U3RhdGVDaGFuZ2U6IHByb3BzLm9uVmlld1N0YXRlQ2hhbmdlLFxuICBkZWNrR2xQcm9wczogcHJvcHMuZGVja0dsUHJvcHMsXG4gIHVpU3RhdGVBY3Rpb25zOiBwcm9wcy51aVN0YXRlQWN0aW9ucyxcbiAgdmlzU3RhdGVBY3Rpb25zOiBwcm9wcy52aXNTdGF0ZUFjdGlvbnMsXG4gIG1hcFN0YXRlQWN0aW9uczogcHJvcHMubWFwU3RhdGVBY3Rpb25zLFxuXG4gIC8vIHZpc1N0YXRlXG4gIGVkaXRvcjogcHJvcHMudmlzU3RhdGUuZWRpdG9yLFxuICBkYXRhc2V0czogcHJvcHMudmlzU3RhdGUuZGF0YXNldHMsXG4gIGxheWVyczogcHJvcHMudmlzU3RhdGUubGF5ZXJzLFxuICBsYXllck9yZGVyOiBwcm9wcy52aXNTdGF0ZS5sYXllck9yZGVyLFxuICBsYXllckRhdGE6IHByb3BzLnZpc1N0YXRlLmxheWVyRGF0YSxcbiAgbGF5ZXJCbGVuZGluZzogcHJvcHMudmlzU3RhdGUubGF5ZXJCbGVuZGluZyxcbiAgZmlsdGVyczogcHJvcHMudmlzU3RhdGUuZmlsdGVycyxcbiAgaW50ZXJhY3Rpb25Db25maWc6IHByb3BzLnZpc1N0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICBob3ZlckluZm86IHByb3BzLnZpc1N0YXRlLmhvdmVySW5mbyxcbiAgY2xpY2tlZDogcHJvcHMudmlzU3RhdGUuY2xpY2tlZCxcbiAgbW91c2VQb3M6IHByb3BzLnZpc1N0YXRlLm1vdXNlUG9zLFxuICBhbmltYXRpb25Db25maWc6IHByb3BzLnZpc1N0YXRlLmFuaW1hdGlvbkNvbmZpZyxcblxuICAvLyB1aVN0YXRlXG4gIGFjdGl2ZVNpZGVQYW5lbDogcHJvcHMudWlTdGF0ZS5hY3RpdmVTaWRlUGFuZWwsXG4gIG1hcENvbnRyb2xzOiBwcm9wcy51aVN0YXRlLm1hcENvbnRyb2xzLFxuICByZWFkT25seTogcHJvcHMudWlTdGF0ZS5yZWFkT25seSxcbiAgbG9jYWxlOiBwcm9wcy51aVN0YXRlLmxvY2FsZVxufSk7XG5cbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxTZWxlY3RvciA9IChwcm9wcywgYXZhaWxhYmxlUHJvdmlkZXJzKSA9PiAoe1xuICBhcHBOYW1lOiBwcm9wcy5hcHBOYW1lLFxuICB2ZXJzaW9uOiBwcm9wcy52ZXJzaW9uLFxuICBhcHBXZWJzaXRlOiBwcm9wcy5hcHBXZWJzaXRlLFxuICBtYXBTdHlsZTogcHJvcHMubWFwU3R5bGUsXG4gIG9uU2F2ZU1hcDogcHJvcHMub25TYXZlTWFwLFxuICB1aVN0YXRlOiBwcm9wcy51aVN0YXRlLFxuICBtYXBTdHlsZUFjdGlvbnM6IHByb3BzLm1hcFN0eWxlQWN0aW9ucyxcbiAgdmlzU3RhdGVBY3Rpb25zOiBwcm9wcy52aXNTdGF0ZUFjdGlvbnMsXG4gIHVpU3RhdGVBY3Rpb25zOiBwcm9wcy51aVN0YXRlQWN0aW9ucyxcblxuICBkYXRhc2V0czogcHJvcHMudmlzU3RhdGUuZGF0YXNldHMsXG4gIGZpbHRlcnM6IHByb3BzLnZpc1N0YXRlLmZpbHRlcnMsXG4gIGxheWVyczogcHJvcHMudmlzU3RhdGUubGF5ZXJzLFxuICBsYXllck9yZGVyOiBwcm9wcy52aXNTdGF0ZS5sYXllck9yZGVyLFxuICBsYXllckNsYXNzZXM6IHByb3BzLnZpc1N0YXRlLmxheWVyQ2xhc3NlcyxcbiAgaW50ZXJhY3Rpb25Db25maWc6IHByb3BzLnZpc1N0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICBtYXBJbmZvOiBwcm9wcy52aXNTdGF0ZS5tYXBJbmZvLFxuICBsYXllckJsZW5kaW5nOiBwcm9wcy52aXNTdGF0ZS5sYXllckJsZW5kaW5nLFxuXG4gIHdpZHRoOiBwcm9wcy5zaWRlUGFuZWxXaWR0aCxcbiAgYXZhaWxhYmxlUHJvdmlkZXJzLFxuICBtYXBTYXZlZDogcHJvcHMucHJvdmlkZXJTdGF0ZS5tYXBTYXZlZFxufSk7XG5cbmV4cG9ydCBjb25zdCBwbG90Q29udGFpbmVyU2VsZWN0b3IgPSBwcm9wcyA9PiAoe1xuICB3aWR0aDogcHJvcHMud2lkdGgsXG4gIGhlaWdodDogcHJvcHMuaGVpZ2h0LFxuICBleHBvcnRJbWFnZVNldHRpbmc6IHByb3BzLnVpU3RhdGUuZXhwb3J0SW1hZ2UsXG4gIG1hcEZpZWxkczogbWFwRmllbGRzU2VsZWN0b3IocHJvcHMpLFxuICBhZGROb3RpZmljYXRpb246IHByb3BzLnVpU3RhdGVBY3Rpb25zLmFkZE5vdGlmaWNhdGlvbixcbiAgc2V0RXhwb3J0SW1hZ2VTZXR0aW5nOiBwcm9wcy51aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnRJbWFnZVNldHRpbmcsXG4gIHNldEV4cG9ydEltYWdlRGF0YVVyaTogcHJvcHMudWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VEYXRhVXJpLFxuICBzZXRFeHBvcnRJbWFnZUVycm9yOiBwcm9wcy51aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnRJbWFnZUVycm9yLFxuICBzcGxpdE1hcHM6IHByb3BzLnZpc1N0YXRlLnNwbGl0TWFwc1xufSk7XG5cbmV4cG9ydCBjb25zdCBpc1NwbGl0U2VsZWN0b3IgPSBwcm9wcyA9PlxuICBwcm9wcy52aXNTdGF0ZS5zcGxpdE1hcHMgJiYgcHJvcHMudmlzU3RhdGUuc3BsaXRNYXBzLmxlbmd0aCA+IDE7XG5leHBvcnQgY29uc3QgY29udGFpbmVyV1NlbGVjdG9yID0gcHJvcHMgPT5cbiAgcHJvcHMubWFwU3RhdGUud2lkdGggKiAoTnVtYmVyKGlzU3BsaXRTZWxlY3Rvcihwcm9wcykpICsgMSk7XG5cbmV4cG9ydCBjb25zdCBib3R0b21XaWRnZXRTZWxlY3RvciA9IChwcm9wcywgdGhlbWUpID0+ICh7XG4gIGZpbHRlcnM6IHByb3BzLnZpc1N0YXRlLmZpbHRlcnMsXG4gIGRhdGFzZXRzOiBwcm9wcy52aXNTdGF0ZS5kYXRhc2V0cyxcbiAgdWlTdGF0ZTogcHJvcHMudWlTdGF0ZSxcbiAgbGF5ZXJzOiBwcm9wcy52aXNTdGF0ZS5sYXllcnMsXG4gIGFuaW1hdGlvbkNvbmZpZzogcHJvcHMudmlzU3RhdGUuYW5pbWF0aW9uQ29uZmlnLFxuICB2aXNTdGF0ZUFjdGlvbnM6IHByb3BzLnZpc1N0YXRlQWN0aW9ucyxcbiAgc2lkZVBhbmVsV2lkdGg6IHByb3BzLnVpU3RhdGUucmVhZE9ubHkgPyAwIDogcHJvcHMuc2lkZVBhbmVsV2lkdGggKyB0aGVtZS5zaWRlUGFuZWwubWFyZ2luLmxlZnQsXG4gIGNvbnRhaW5lclc6IGNvbnRhaW5lcldTZWxlY3Rvcihwcm9wcylcbn0pO1xuXG5leHBvcnQgY29uc3QgbW9kYWxDb250YWluZXJTZWxlY3RvciA9IChwcm9wcywgcm9vdE5vZGUpID0+ICh7XG4gIGFwcE5hbWU6IHByb3BzLmFwcE5hbWUsXG4gIG1hcFN0eWxlOiBwcm9wcy5tYXBTdHlsZSxcbiAgdmlzU3RhdGU6IHByb3BzLnZpc1N0YXRlLFxuICBtYXBTdGF0ZTogcHJvcHMubWFwU3RhdGUsXG4gIHVpU3RhdGU6IHByb3BzLnVpU3RhdGUsXG4gIHByb3ZpZGVyU3RhdGU6IHByb3BzLnByb3ZpZGVyU3RhdGUsXG5cbiAgbWFwYm94QXBpQWNjZXNzVG9rZW46IHByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICBtYXBib3hBcGlVcmw6IHByb3BzLm1hcGJveEFwaVVybCxcbiAgdmlzU3RhdGVBY3Rpb25zOiBwcm9wcy52aXNTdGF0ZUFjdGlvbnMsXG4gIHVpU3RhdGVBY3Rpb25zOiBwcm9wcy51aVN0YXRlQWN0aW9ucyxcbiAgbWFwU3R5bGVBY3Rpb25zOiBwcm9wcy5tYXBTdHlsZUFjdGlvbnMsXG4gIHByb3ZpZGVyQWN0aW9uczogcHJvcHMucHJvdmlkZXJBY3Rpb25zLFxuXG4gIHJvb3ROb2RlLFxuICBjb250YWluZXJXOiBjb250YWluZXJXU2VsZWN0b3IocHJvcHMpLFxuICBjb250YWluZXJIOiBwcm9wcy5tYXBTdGF0ZS5oZWlnaHQsXG4gIC8vIFVzZXIgZGVmaW5lZCBjbG91ZCBwcm92aWRlciBwcm9wc1xuICBjbG91ZFByb3ZpZGVyczogcHJvcHMuY2xvdWRQcm92aWRlcnMsXG4gIG9uRXhwb3J0VG9DbG91ZFN1Y2Nlc3M6IHByb3BzLm9uRXhwb3J0VG9DbG91ZFN1Y2Nlc3MsXG4gIG9uTG9hZENsb3VkTWFwU3VjY2VzczogcHJvcHMub25Mb2FkQ2xvdWRNYXBTdWNjZXNzLFxuICBvbkxvYWRDbG91ZE1hcEVycm9yOiBwcm9wcy5vbkxvYWRDbG91ZE1hcEVycm9yLFxuICBvbkV4cG9ydFRvQ2xvdWRFcnJvcjogcHJvcHMub25FeHBvcnRUb0Nsb3VkRXJyb3Jcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2VvQ29kZXJQYW5lbFNlbGVjdG9yID0gcHJvcHMgPT4gKHtcbiAgaXNHZW9jb2RlckVuYWJsZWQ6IHByb3BzLnZpc1N0YXRlLmludGVyYWN0aW9uQ29uZmlnLmdlb2NvZGVyLmVuYWJsZWQsXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBwcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgbWFwU3RhdGU6IHByb3BzLm1hcFN0YXRlLFxuICB1cGRhdGVWaXNEYXRhOiBwcm9wcy52aXNTdGF0ZUFjdGlvbnMudXBkYXRlVmlzRGF0YSxcbiAgcmVtb3ZlRGF0YXNldDogcHJvcHMudmlzU3RhdGVBY3Rpb25zLnJlbW92ZURhdGFzZXQsXG4gIHVwZGF0ZU1hcDogcHJvcHMubWFwU3RhdGVBY3Rpb25zLnVwZGF0ZU1hcFxufSk7XG5cbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25QYW5lbFNlbGVjdG9yID0gcHJvcHMgPT4gKHtcbiAgcmVtb3ZlTm90aWZpY2F0aW9uOiBwcm9wcy51aVN0YXRlQWN0aW9ucy5yZW1vdmVOb3RpZmljYXRpb24sXG4gIG5vdGlmaWNhdGlvbnM6IHByb3BzLnVpU3RhdGUubm90aWZpY2F0aW9uc1xufSk7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0tFUExFUl9HTF9QUk9QUyA9IHtcbiAgbWFwU3R5bGVzOiBbXSxcbiAgbWFwU3R5bGVzUmVwbGFjZURlZmF1bHQ6IGZhbHNlLFxuICBtYXBib3hBcGlVcmw6IERFRkFVTFRfTUFQQk9YX0FQSV9VUkwsXG4gIHdpZHRoOiA4MDAsXG4gIGhlaWdodDogODAwLFxuICBhcHBOYW1lOiBLRVBMRVJfR0xfTkFNRSxcbiAgdmVyc2lvbjogS0VQTEVSX0dMX1ZFUlNJT04sXG4gIHNpZGVQYW5lbFdpZHRoOiBESU1FTlNJT05TLnNpZGVQYW5lbC53aWR0aCxcbiAgdGhlbWU6IHt9LFxuICBjbG91ZFByb3ZpZGVyczogW10sXG4gIHJlYWRPbmx5OiBmYWxzZVxufTtcblxuS2VwbGVyR2xGYWN0b3J5LmRlcHMgPSBbXG4gIEJvdHRvbVdpZGdldEZhY3RvcnksXG4gIEdlb0NvZGVyUGFuZWxGYWN0b3J5LFxuICBNYXBDb250YWluZXJGYWN0b3J5LFxuICBNb2RhbENvbnRhaW5lckZhY3RvcnksXG4gIFNpZGVQYW5lbEZhY3RvcnksXG4gIFBsb3RDb250YWluZXJGYWN0b3J5LFxuICBOb3RpZmljYXRpb25QYW5lbEZhY3Rvcnlcbl07XG5cbmZ1bmN0aW9uIEtlcGxlckdsRmFjdG9yeShcbiAgQm90dG9tV2lkZ2V0LFxuICBHZW9Db2RlclBhbmVsLFxuICBNYXBDb250YWluZXIsXG4gIE1vZGFsQ29udGFpbmVyLFxuICBTaWRlUGFuZWwsXG4gIFBsb3RDb250YWluZXIsXG4gIE5vdGlmaWNhdGlvblBhbmVsXG4pIHtcbiAgLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4va2VwbGVyLWdsJykuVW5jb25uZWN0ZWRLZXBsZXJHbFByb3BzfSBLZXBsZXJHbFByb3BzICovXG4gIC8qKiBAYXVnbWVudHMgUmVhY3QuQ29tcG9uZW50PEtlcGxlckdsUHJvcHM+ICovXG4gIGNsYXNzIEtlcGxlckdMIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0gREVGQVVMVF9LRVBMRVJfR0xfUFJPUFM7XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlTWFwYm94VG9rZW4oKTtcbiAgICAgIHRoaXMuX2xvYWRNYXBTdHlsZSgpO1xuICAgICAgdGhpcy5faGFuZGxlUmVzaXplKHRoaXMucHJvcHMpO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uS2VwbGVyR2xJbml0aWFsaXplZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnByb3BzLm9uS2VwbGVyR2xJbml0aWFsaXplZCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgLy8gaWYgZGltZW5zaW9uIHByb3BzIGhhcyBjaGFuZ2VkXG4gICAgICAgIHRoaXMucHJvcHMuaGVpZ2h0ICE9PSBwcmV2UHJvcHMuaGVpZ2h0IHx8XG4gICAgICAgIHRoaXMucHJvcHMud2lkdGggIT09IHByZXZQcm9wcy53aWR0aCB8fFxuICAgICAgICAvLyByZWFjdC1tYXAtZ2wgd2lsbCBkaXNwYXRjaCB1cGRhdGVWaWV3cG9ydCBhZnRlciB0aGlzLl9oYW5kbGVSZXNpemUgaXMgY2FsbGVkXG4gICAgICAgIC8vIGhlcmUgd2UgY2hlY2sgaWYgdGhpcy5wcm9wcy5tYXBTdGF0ZS5oZWlnaHQgaXMgc3luYyB3aXRoIHByb3BzLmhlaWdodFxuICAgICAgICB0aGlzLnByb3BzLmhlaWdodCAhPT0gdGhpcy5wcm9wcy5tYXBTdGF0ZS5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9oYW5kbGVSZXNpemUodGhpcy5wcm9wcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBjb250ZXh0VHlwZSA9IFJvb3RDb250ZXh0O1xuXG4gICAgcm9vdCA9IGNyZWF0ZVJlZigpO1xuXG4gICAgLyogc2VsZWN0b3JzICovXG4gICAgdGhlbWVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnRoZW1lO1xuICAgIGF2YWlsYWJsZVRoZW1lU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLnRoZW1lU2VsZWN0b3IsIHRoZW1lID0+XG4gICAgICB0eXBlb2YgdGhlbWUgPT09ICdvYmplY3QnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgLi4uYmFzaWNUaGVtZSxcbiAgICAgICAgICAgIC4uLnRoZW1lXG4gICAgICAgICAgfVxuICAgICAgICA6IHRoZW1lID09PSBUSEVNRS5saWdodFxuICAgICAgICA/IHRoZW1lTFRcbiAgICAgICAgOiB0aGVtZSA9PT0gVEhFTUUuYmFzZVxuICAgICAgICA/IHRoZW1lQlNcbiAgICAgICAgOiB0aGVtZVxuICAgICk7XG5cbiAgICBhdmFpbGFibGVQcm92aWRlcnMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHByb3BzID0+IHByb3BzLmNsb3VkUHJvdmlkZXJzLFxuICAgICAgcHJvdmlkZXJzID0+XG4gICAgICAgIEFycmF5LmlzQXJyYXkocHJvdmlkZXJzKSAmJiBwcm92aWRlcnMubGVuZ3RoXG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIGhhc1N0b3JhZ2U6IHByb3ZpZGVycy5zb21lKHAgPT4gcC5oYXNQcml2YXRlU3RvcmFnZSgpKSxcbiAgICAgICAgICAgICAgaGFzU2hhcmU6IHByb3ZpZGVycy5zb21lKHAgPT4gcC5oYXNTaGFyaW5nVXJsKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiB7fVxuICAgICk7XG5cbiAgICBsb2NhbGVNZXNzYWdlc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICBwcm9wcyA9PiBwcm9wcy5sb2NhbGVNZXNzYWdlcyxcbiAgICAgIGN1c3RvbU1lc3NhZ2VzID0+IChjdXN0b21NZXNzYWdlcyA/IG1lcmdlTWVzc2FnZXMobWVzc2FnZXMsIGN1c3RvbU1lc3NhZ2VzKSA6IG1lc3NhZ2VzKVxuICAgICk7XG5cbiAgICAvKiBwcml2YXRlIG1ldGhvZHMgKi9cbiAgICBfdmFsaWRhdGVNYXBib3hUb2tlbigpIHtcbiAgICAgIGNvbnN0IHttYXBib3hBcGlBY2Nlc3NUb2tlbn0gPSB0aGlzLnByb3BzO1xuICAgICAgaWYgKCF2YWxpZGF0ZVRva2VuKG1hcGJveEFwaUFjY2Vzc1Rva2VuKSkge1xuICAgICAgICBDb25zb2xlLndhcm4oTUlTU0lOR19NQVBCT1hfVE9LRU4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9oYW5kbGVSZXNpemUoe3dpZHRoLCBoZWlnaHR9KSB7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh3aWR0aCkgfHwgIU51bWJlci5pc0Zpbml0ZShoZWlnaHQpKSB7XG4gICAgICAgIENvbnNvbGUud2Fybignd2lkdGggYW5kIGhlaWdodCBpcyByZXF1aXJlZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnByb3BzLm1hcFN0YXRlQWN0aW9ucy51cGRhdGVNYXAoe1xuICAgICAgICB3aWR0aDogd2lkdGggLyAoMSArIE51bWJlcih0aGlzLnByb3BzLm1hcFN0YXRlLmlzU3BsaXQpKSxcbiAgICAgICAgaGVpZ2h0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfbG9hZE1hcFN0eWxlID0gKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFN0eWxlcyA9IE9iamVjdC52YWx1ZXModGhpcy5wcm9wcy5tYXBTdHlsZS5tYXBTdHlsZXMpO1xuICAgICAgLy8gYWRkIGlkIHRvIGN1c3RvbSBtYXAgc3R5bGVzIGlmIG5vdCBnaXZlblxuICAgICAgY29uc3QgY3VzdG9tU3R5bGVzID0gKHRoaXMucHJvcHMubWFwU3R5bGVzIHx8IFtdKS5tYXAobXMgPT4gKHtcbiAgICAgICAgLi4ubXMsXG4gICAgICAgIGlkOiBtcy5pZCB8fCBnZW5lcmF0ZUhhc2hJZCgpXG4gICAgICB9KSk7XG5cbiAgICAgIGNvbnN0IGFsbFN0eWxlcyA9IFsuLi5jdXN0b21TdHlsZXMsIC4uLmRlZmF1bHRTdHlsZXNdLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIHN0eWxlKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFzU3R5bGVPYmplY3QgPSBzdHlsZS5zdHlsZSAmJiB0eXBlb2Ygc3R5bGUuc3R5bGUgPT09ICdvYmplY3QnO1xuICAgICAgICAgIGFjY3VbaGFzU3R5bGVPYmplY3QgPyAndG9Mb2FkJyA6ICd0b1JlcXVlc3QnXVtzdHlsZS5pZF0gPSBzdHlsZTtcblxuICAgICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgICB9LFxuICAgICAgICB7dG9Mb2FkOiB7fSwgdG9SZXF1ZXN0OiB7fX1cbiAgICAgICk7XG5cbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGVBY3Rpb25zLmxvYWRNYXBTdHlsZXMoYWxsU3R5bGVzLnRvTG9hZCk7XG4gICAgICB0aGlzLnByb3BzLm1hcFN0eWxlQWN0aW9ucy5yZXF1ZXN0TWFwU3R5bGVzKGFsbFN0eWxlcy50b1JlcXVlc3QpO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGlkLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICB1aVN0YXRlLFxuICAgICAgICB2aXNTdGF0ZSxcbiAgICAgICAgLy8gcmVhZE9ubHkgb3ZlcnJpZGVcbiAgICAgICAgcmVhZE9ubHlcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIHNwbGl0TWFwcywgLy8gdGhpcyB3aWxsIHN0b3JlIHN1cHBvcnQgZm9yIHNwbGl0IG1hcCB2aWV3IGlzIG5lY2Vzc2FyeVxuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICAgICAgfSA9IHZpc1N0YXRlO1xuXG4gICAgICBjb25zdCBpc1NwbGl0ID0gaXNTcGxpdFNlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgICAgY29uc3QgdGhlbWUgPSB0aGlzLmF2YWlsYWJsZVRoZW1lU2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgICBjb25zdCBsb2NhbGVNZXNzYWdlcyA9IHRoaXMubG9jYWxlTWVzc2FnZXNTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IGlzRXhwb3J0aW5nSW1hZ2UgPSB1aVN0YXRlLmV4cG9ydEltYWdlLmV4cG9ydGluZztcbiAgICAgIGNvbnN0IGF2YWlsYWJsZVByb3ZpZGVycyA9IHRoaXMuYXZhaWxhYmxlUHJvdmlkZXJzKHRoaXMucHJvcHMpO1xuXG4gICAgICBjb25zdCBtYXBGaWVsZHMgPSBtYXBGaWVsZHNTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IHNpZGVGaWVsZHMgPSBzaWRlUGFuZWxTZWxlY3Rvcih0aGlzLnByb3BzLCBhdmFpbGFibGVQcm92aWRlcnMpO1xuICAgICAgY29uc3QgcGxvdENvbnRhaW5lckZpZWxkcyA9IHBsb3RDb250YWluZXJTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IGJvdHRvbVdpZGdldEZpZWxkcyA9IGJvdHRvbVdpZGdldFNlbGVjdG9yKHRoaXMucHJvcHMsIHRoZW1lKTtcbiAgICAgIGNvbnN0IG1vZGFsQ29udGFpbmVyRmllbGRzID0gbW9kYWxDb250YWluZXJTZWxlY3Rvcih0aGlzLnByb3BzLCB0aGlzLnJvb3QuY3VycmVudCk7XG4gICAgICBjb25zdCBnZW9Db2RlclBhbmVsRmllbGRzID0gZ2VvQ29kZXJQYW5lbFNlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uUGFuZWxGaWVsZHMgPSBub3RpZmljYXRpb25QYW5lbFNlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgICBjb25zdCBtYXBDb250YWluZXJzID0gIWlzU3BsaXRcbiAgICAgICAgPyBbPE1hcENvbnRhaW5lciBrZXk9ezB9IGluZGV4PXswfSB7Li4ubWFwRmllbGRzfSBtYXBMYXllcnM9e251bGx9IC8+XVxuICAgICAgICA6IHNwbGl0TWFwcy5tYXAoKHNldHRpbmdzLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPE1hcENvbnRhaW5lclxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgICAgICAgIG1hcExheWVycz17c3BsaXRNYXBzW2luZGV4XS5sYXllcnN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Um9vdENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3RoaXMucm9vdH0+XG4gICAgICAgICAgPEludGxQcm92aWRlciBsb2NhbGU9e3VpU3RhdGUubG9jYWxlfSBtZXNzYWdlcz17bG9jYWxlTWVzc2FnZXNbdWlTdGF0ZS5sb2NhbGVdfT5cbiAgICAgICAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGVtZX0+XG4gICAgICAgICAgICAgIDxHbG9iYWxTdHlsZVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImtlcGxlci1nbFwiXG4gICAgICAgICAgICAgICAgaWQ9e2BrZXBsZXItZ2xfXyR7aWR9YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogYCR7d2lkdGh9cHhgLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9cHhgXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICByZWY9e3RoaXMucm9vdH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxOb3RpZmljYXRpb25QYW5lbCB7Li4ubm90aWZpY2F0aW9uUGFuZWxGaWVsZHN9IC8+XG4gICAgICAgICAgICAgICAgeyF1aVN0YXRlLnJlYWRPbmx5ICYmICFyZWFkT25seSAmJiA8U2lkZVBhbmVsIHsuLi5zaWRlRmllbGRzfSAvPn1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcHNcIiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4J319PlxuICAgICAgICAgICAgICAgICAge21hcENvbnRhaW5lcnN9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge2lzRXhwb3J0aW5nSW1hZ2UgJiYgPFBsb3RDb250YWluZXIgey4uLnBsb3RDb250YWluZXJGaWVsZHN9IC8+fVxuICAgICAgICAgICAgICAgIHtpbnRlcmFjdGlvbkNvbmZpZy5nZW9jb2Rlci5lbmFibGVkICYmIDxHZW9Db2RlclBhbmVsIHsuLi5nZW9Db2RlclBhbmVsRmllbGRzfSAvPn1cbiAgICAgICAgICAgICAgICA8Qm90dG9tV2lkZ2V0IHsuLi5ib3R0b21XaWRnZXRGaWVsZHN9IC8+XG4gICAgICAgICAgICAgICAgPE1vZGFsQ29udGFpbmVyIHsuLi5tb2RhbENvbnRhaW5lckZpZWxkc30gLz5cbiAgICAgICAgICAgICAgPC9HbG9iYWxTdHlsZT5cbiAgICAgICAgICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgICAgICAgICA8L0ludGxQcm92aWRlcj5cbiAgICAgICAgPC9Sb290Q29udGV4dC5Qcm92aWRlcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGtlcGxlckdsQ29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1ha2VNYXBEaXNwYXRjaFRvUHJvcHMpKHdpdGhUaGVtZShLZXBsZXJHTCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlID0ge30sIHByb3BzKSB7XG4gIHJldHVybiB7XG4gICAgLi4ucHJvcHMsXG4gICAgdmlzU3RhdGU6IHN0YXRlLnZpc1N0YXRlLFxuICAgIG1hcFN0eWxlOiBzdGF0ZS5tYXBTdHlsZSxcbiAgICBtYXBTdGF0ZTogc3RhdGUubWFwU3RhdGUsXG4gICAgdWlTdGF0ZTogc3RhdGUudWlTdGF0ZSxcbiAgICBwcm92aWRlclN0YXRlOiBzdGF0ZS5wcm92aWRlclN0YXRlXG4gIH07XG59XG5cbmNvbnN0IGRlZmF1bHRVc2VyQWN0aW9ucyA9IHt9O1xuXG5jb25zdCBnZXREaXNwYXRjaCA9IChkaXNwYXRjaCwgcHJvcHMpID0+IGRpc3BhdGNoO1xuY29uc3QgZ2V0VXNlckFjdGlvbnMgPSAoZGlzcGF0Y2gsIHByb3BzKSA9PiBwcm9wcy5hY3Rpb25zIHx8IGRlZmF1bHRVc2VyQWN0aW9ucztcblxuLyoqIEB0eXBlIHsoKSA9PiBpbXBvcnQoJ3Jlc2VsZWN0JykuT3V0cHV0UGFyYW1ldHJpY1NlbGVjdG9yPGFueSwgYW55LCBhbnksIGFueT59ICovXG5mdW5jdGlvbiBtYWtlR2V0QWN0aW9uQ3JlYXRvcnMoKSB7XG4gIHJldHVybiBjcmVhdGVTZWxlY3RvcihbZ2V0RGlzcGF0Y2gsIGdldFVzZXJBY3Rpb25zXSwgKGRpc3BhdGNoLCB1c2VyQWN0aW9ucykgPT4ge1xuICAgIGNvbnN0IFt2aXNTdGF0ZUFjdGlvbnMsIG1hcFN0YXRlQWN0aW9ucywgbWFwU3R5bGVBY3Rpb25zLCB1aVN0YXRlQWN0aW9ucywgcHJvdmlkZXJBY3Rpb25zXSA9IFtcbiAgICAgIFZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIE1hcFN0YXRlQWN0aW9ucyxcbiAgICAgIE1hcFN0eWxlQWN0aW9ucyxcbiAgICAgIFVJU3RhdGVBY3Rpb25zLFxuICAgICAgUHJvdmlkZXJBY3Rpb25zXG4gICAgXS5tYXAoYWN0aW9ucyA9PiBiaW5kQWN0aW9uQ3JlYXRvcnMobWVyZ2VBY3Rpb25zKGFjdGlvbnMsIHVzZXJBY3Rpb25zKSwgZGlzcGF0Y2gpKTtcblxuICAgIHJldHVybiB7XG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICAgIHByb3ZpZGVyQWN0aW9ucyxcbiAgICAgIGRpc3BhdGNoXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VNYXBEaXNwYXRjaFRvUHJvcHMoKSB7XG4gIGNvbnN0IGdldEFjdGlvbkNyZWF0b3JzID0gbWFrZUdldEFjdGlvbkNyZWF0b3JzKCk7XG4gIGNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCwgb3duUHJvcHMpID0+IHtcbiAgICBjb25zdCBncm91cGVkQWN0aW9uQ3JlYXRvcnMgPSBnZXRBY3Rpb25DcmVhdG9ycyhkaXNwYXRjaCwgb3duUHJvcHMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmdyb3VwZWRBY3Rpb25DcmVhdG9ycyxcbiAgICAgIGRpc3BhdGNoXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gbWFwRGlzcGF0Y2hUb1Byb3BzO1xufVxuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQga2VwbGVyLmdsIGFjdGlvbnMgd2l0aCB1c2VyIGRlZmluZWQgYWN0aW9ucyB1c2luZyB0aGUgc2FtZSBrZXlcbiAqL1xuZnVuY3Rpb24gbWVyZ2VBY3Rpb25zKGFjdGlvbnMsIHVzZXJBY3Rpb25zKSB7XG4gIGNvbnN0IG92ZXJyaWRlcyA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBpbiB1c2VyQWN0aW9ucykge1xuICAgIGlmICh1c2VyQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGFjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgb3ZlcnJpZGVzW2tleV0gPSB1c2VyQWN0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7Li4uYWN0aW9ucywgLi4ub3ZlcnJpZGVzfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgS2VwbGVyR2xGYWN0b3J5O1xuIl19