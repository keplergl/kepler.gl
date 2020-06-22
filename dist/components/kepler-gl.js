"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

var _base = require("../styles/base");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-family: ", ";\n  font-weight: ", ";\n  font-size: ", ";\n  line-height: ", ";\n\n  *,\n  *:before,\n  *:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n  }\n\n  ul {\n    margin: 0;\n    padding: 0;\n  }\n\n  li {\n    margin: 0;\n  }\n\n  a {\n    text-decoration: none;\n    color: ", ";\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

// Maybe we should think about exporting this or creating a variable
// as part of the base.js theme
var GlobalStyle = _styledComponents["default"].div(_templateObject(), function (props) {
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

KeplerGlFactory.deps = [_bottomWidget["default"], _geocoderPanel["default"], _mapContainer["default"], _modalContainer["default"], _sidePanel["default"], _plotContainer["default"], _notificationPanel["default"]];

function KeplerGlFactory(BottomWidget, GeoCoderPanel, MapContainer, ModalContainer, SidePanel, PlotContainer, NotificationPanel) {
  var KeplerGL =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(KeplerGL, _Component);

    function KeplerGL() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, KeplerGL);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(KeplerGL)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "root", (0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "themeSelector", function (props) {
        return props.theme;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "availableThemeSelector", (0, _reselect.createSelector)(_this.themeSelector, function (theme) {
        return (0, _typeof2["default"])(theme) === 'object' ? _objectSpread({}, _base.theme, {}, theme) : theme === _defaultSettings.THEME.light ? _base.themeLT : theme === _defaultSettings.THEME.base ? _base.themeBS : theme;
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
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_loadMapStyle", function () {
        var defaultStyles = Object.values(_this.props.mapStyle.mapStyles); // add id to custom map styles if not given

        var customStyles = (_this.props.mapStyles || []).map(function (ms) {
          return _objectSpread({}, ms, {
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

        this._loadMapStyle(this.props.mapStyles);

        this._handleResize(this.props);
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

      /* private methods */
      value: function _validateMapboxToken() {
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
            appName = _this$props.appName,
            version = _this$props.version,
            appWebsite = _this$props.appWebsite,
            onSaveMap = _this$props.onSaveMap,
            onViewStateChange = _this$props.onViewStateChange,
            width = _this$props.width,
            height = _this$props.height,
            mapboxApiAccessToken = _this$props.mapboxApiAccessToken,
            mapboxApiUrl = _this$props.mapboxApiUrl,
            getMapboxRef = _this$props.getMapboxRef,
            mapStyle = _this$props.mapStyle,
            mapState = _this$props.mapState,
            uiState = _this$props.uiState,
            visState = _this$props.visState,
            providerState = _this$props.providerState,
            visStateActions = _this$props.visStateActions,
            mapStateActions = _this$props.mapStateActions,
            mapStyleActions = _this$props.mapStyleActions,
            uiStateActions = _this$props.uiStateActions,
            providerActions = _this$props.providerActions,
            dispatch = _this$props.dispatch;
        var availableProviders = this.availableProviders(this.props);
        var filters = visState.filters,
            layers = visState.layers,
            splitMaps = visState.splitMaps,
            layerOrder = visState.layerOrder,
            layerBlending = visState.layerBlending,
            layerClasses = visState.layerClasses,
            interactionConfig = visState.interactionConfig,
            datasets = visState.datasets,
            layerData = visState.layerData,
            hoverInfo = visState.hoverInfo,
            clicked = visState.clicked,
            mousePos = visState.mousePos,
            animationConfig = visState.animationConfig,
            mapInfo = visState.mapInfo;
        var notificationPanelFields = {
          removeNotification: uiStateActions.removeNotification,
          notifications: uiState.notifications
        };
        var sideFields = {
          appName: appName,
          version: version,
          appWebsite: appWebsite,
          datasets: datasets,
          filters: filters,
          layers: layers,
          layerOrder: layerOrder,
          layerClasses: layerClasses,
          interactionConfig: interactionConfig,
          mapStyle: mapStyle,
          mapInfo: mapInfo,
          layerBlending: layerBlending,
          onSaveMap: onSaveMap,
          uiState: uiState,
          mapStyleActions: mapStyleActions,
          visStateActions: visStateActions,
          uiStateActions: uiStateActions,
          width: this.props.sidePanelWidth,
          availableProviders: availableProviders,
          mapSaved: providerState.mapSaved
        };
        var mapFields = {
          datasets: datasets,
          getMapboxRef: getMapboxRef,
          mapboxApiAccessToken: mapboxApiAccessToken,
          mapboxApiUrl: mapboxApiUrl,
          mapState: mapState,
          uiState: uiState,
          editor: visState.editor,
          mapStyle: mapStyle,
          mapControls: uiState.mapControls,
          layers: layers,
          layerOrder: layerOrder,
          layerData: layerData,
          layerBlending: layerBlending,
          filters: filters,
          interactionConfig: interactionConfig,
          hoverInfo: hoverInfo,
          clicked: clicked,
          mousePos: mousePos,
          readOnly: uiState.readOnly,
          onViewStateChange: onViewStateChange,
          uiStateActions: uiStateActions,
          visStateActions: visStateActions,
          mapStateActions: mapStateActions,
          animationConfig: animationConfig
        };
        var isSplit = splitMaps && splitMaps.length > 1;
        var containerW = mapState.width * (Number(isSplit) + 1);
        var mapContainers = !isSplit ? [_react["default"].createElement(MapContainer, (0, _extends2["default"])({
          key: 0,
          index: 0
        }, mapFields, {
          mapLayers: null
        }))] : splitMaps.map(function (settings, index) {
          return _react["default"].createElement(MapContainer, (0, _extends2["default"])({
            key: index,
            index: index
          }, mapFields, {
            mapLayers: splitMaps[index].layers
          }));
        });
        var isExporting = uiState.currentModal === _defaultSettings.EXPORT_IMAGE_ID || uiState.currentModal === _defaultSettings.SAVE_MAP_ID || uiState.currentModal === _defaultSettings.SHARE_MAP_ID || uiState.currentModal === _defaultSettings.OVERWRITE_MAP_ID;
        var theme = this.availableThemeSelector(this.props);
        return _react["default"].createElement(_context.RootContext.Provider, {
          value: this.root
        }, _react["default"].createElement(_reactIntl.IntlProvider, {
          locale: uiState.locale,
          messages: _localization.messages[uiState.locale]
        }, _react["default"].createElement(_styledComponents.ThemeProvider, {
          theme: theme
        }, _react["default"].createElement(GlobalStyle, {
          width: width,
          height: height,
          className: "kepler-gl",
          id: "kepler-gl__".concat(id),
          ref: this.root
        }, _react["default"].createElement(NotificationPanel, notificationPanelFields), !uiState.readOnly && _react["default"].createElement(SidePanel, sideFields), _react["default"].createElement("div", {
          className: "maps",
          style: {
            display: 'flex'
          }
        }, mapContainers), isExporting && _react["default"].createElement(PlotContainer, {
          width: width,
          height: height,
          exportImageSetting: uiState.exportImage,
          mapFields: mapFields,
          addNotification: uiStateActions.addNotification,
          startExportingImage: uiStateActions.startExportingImage,
          setExportImageDataUri: uiStateActions.setExportImageDataUri,
          setExportImageError: uiStateActions.setExportImageError
        }), !uiState.readOnly && interactionConfig.geocoder.enabled && _react["default"].createElement(GeoCoderPanel, {
          isGeocoderEnabled: interactionConfig.geocoder.enabled,
          mapboxApiAccessToken: mapboxApiAccessToken,
          dispatch: dispatch
        }), _react["default"].createElement(BottomWidget, {
          filters: filters,
          datasets: datasets,
          uiState: uiState,
          layers: layers,
          animationConfig: animationConfig,
          visStateActions: visStateActions,
          sidePanelWidth: uiState.readOnly ? 0 : this.props.sidePanelWidth + theme.sidePanel.margin.left,
          containerW: containerW
        }), _react["default"].createElement(ModalContainer, {
          mapStyle: mapStyle,
          visState: visState,
          mapState: mapState,
          uiState: uiState,
          mapboxApiAccessToken: mapboxApiAccessToken,
          mapboxApiUrl: mapboxApiUrl,
          visStateActions: visStateActions,
          uiStateActions: uiStateActions,
          mapStyleActions: mapStyleActions,
          providerActions: providerActions,
          rootNode: this.root.current,
          containerW: containerW,
          containerH: mapState.height,
          providerState: this.props.providerState // User defined cloud provider props
          ,
          cloudProviders: this.props.cloudProviders,
          onExportToCloudSuccess: this.props.onExportToCloudSuccess,
          onLoadCloudMapSuccess: this.props.onLoadCloudMapSuccess,
          onLoadCloudMapError: this.props.onLoadCloudMapError,
          onExportToCloudError: this.props.onExportToCloudError
        })))));
      }
    }]);
    return KeplerGL;
  }(_react.Component);

  (0, _defineProperty2["default"])(KeplerGL, "defaultProps", {
    mapStyles: [],
    mapStylesReplaceDefault: false,
    mapboxApiUrl: _defaultSettings.DEFAULT_MAPBOX_API_URL,
    width: 800,
    height: 800,
    appName: _defaultSettings.KEPLER_GL_NAME,
    version: _defaultSettings.KEPLER_GL_VERSION,
    sidePanelWidth: _defaultSettings.DIMENSIONS.sidePanel.width,
    theme: {},
    cloudProviders: []
  });
  (0, _defineProperty2["default"])(KeplerGL, "contextType", _context.RootContext);
  return (0, _keplerglConnect.connect)(mapStateToProps, makeMapDispatchToProps)((0, _styledComponents.withTheme)(KeplerGL));
}

function mapStateToProps() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var props = arguments.length > 1 ? arguments[1] : undefined;
  return _objectSpread({}, props, {
    visState: state.visState,
    mapStyle: state.mapStyle,
    mapState: state.mapState,
    uiState: state.uiState,
    providerState: state.providerState
  });
}

var defaultUserActions = {};

var getDispatch = function getDispatch(dispatch) {
  return dispatch;
};

var getUserActions = function getUserActions(dispatch, props) {
  return props.actions || defaultUserActions;
};

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
    return _objectSpread({}, groupedActionCreators, {
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

  return _objectSpread({}, actions, {}, overrides);
}

var _default = KeplerGlFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJHbG9iYWxTdHlsZSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsImxhYmVsQ29sb3IiLCJLZXBsZXJHbEZhY3RvcnkiLCJkZXBzIiwiQm90dG9tV2lkZ2V0RmFjdG9yeSIsIkdlb0NvZGVyUGFuZWxGYWN0b3J5IiwiTWFwQ29udGFpbmVyRmFjdG9yeSIsIk1vZGFsQ29udGFpbmVyRmFjdG9yeSIsIlNpZGVQYW5lbEZhY3RvcnkiLCJQbG90Q29udGFpbmVyRmFjdG9yeSIsIk5vdGlmaWNhdGlvblBhbmVsRmFjdG9yeSIsIkJvdHRvbVdpZGdldCIsIkdlb0NvZGVyUGFuZWwiLCJNYXBDb250YWluZXIiLCJNb2RhbENvbnRhaW5lciIsIlNpZGVQYW5lbCIsIlBsb3RDb250YWluZXIiLCJOb3RpZmljYXRpb25QYW5lbCIsIktlcGxlckdMIiwidGhlbWVTZWxlY3RvciIsImJhc2ljVGhlbWUiLCJUSEVNRSIsImxpZ2h0IiwidGhlbWVMVCIsImJhc2UiLCJ0aGVtZUJTIiwiY2xvdWRQcm92aWRlcnMiLCJwcm92aWRlcnMiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJoYXNTdG9yYWdlIiwic29tZSIsInAiLCJoYXNQcml2YXRlU3RvcmFnZSIsImhhc1NoYXJlIiwiaGFzU2hhcmluZ1VybCIsImRlZmF1bHRTdHlsZXMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXBTdHlsZSIsIm1hcFN0eWxlcyIsImN1c3RvbVN0eWxlcyIsIm1hcCIsIm1zIiwiaWQiLCJhbGxTdHlsZXMiLCJyZWR1Y2UiLCJhY2N1Iiwic3R5bGUiLCJoYXNTdHlsZU9iamVjdCIsInRvTG9hZCIsInRvUmVxdWVzdCIsIm1hcFN0eWxlQWN0aW9ucyIsImxvYWRNYXBTdHlsZXMiLCJyZXF1ZXN0TWFwU3R5bGVzIiwiX3ZhbGlkYXRlTWFwYm94VG9rZW4iLCJfbG9hZE1hcFN0eWxlIiwiX2hhbmRsZVJlc2l6ZSIsInByZXZQcm9wcyIsImhlaWdodCIsIndpZHRoIiwibWFwU3RhdGUiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsIkNvbnNvbGUiLCJ3YXJuIiwiTUlTU0lOR19NQVBCT1hfVE9LRU4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIm1hcFN0YXRlQWN0aW9ucyIsInVwZGF0ZU1hcCIsImlzU3BsaXQiLCJhcHBOYW1lIiwidmVyc2lvbiIsImFwcFdlYnNpdGUiLCJvblNhdmVNYXAiLCJvblZpZXdTdGF0ZUNoYW5nZSIsIm1hcGJveEFwaVVybCIsImdldE1hcGJveFJlZiIsInVpU3RhdGUiLCJ2aXNTdGF0ZSIsInByb3ZpZGVyU3RhdGUiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJ1aVN0YXRlQWN0aW9ucyIsInByb3ZpZGVyQWN0aW9ucyIsImRpc3BhdGNoIiwiYXZhaWxhYmxlUHJvdmlkZXJzIiwiZmlsdGVycyIsImxheWVycyIsInNwbGl0TWFwcyIsImxheWVyT3JkZXIiLCJsYXllckJsZW5kaW5nIiwibGF5ZXJDbGFzc2VzIiwiaW50ZXJhY3Rpb25Db25maWciLCJkYXRhc2V0cyIsImxheWVyRGF0YSIsImhvdmVySW5mbyIsImNsaWNrZWQiLCJtb3VzZVBvcyIsImFuaW1hdGlvbkNvbmZpZyIsIm1hcEluZm8iLCJub3RpZmljYXRpb25QYW5lbEZpZWxkcyIsInJlbW92ZU5vdGlmaWNhdGlvbiIsIm5vdGlmaWNhdGlvbnMiLCJzaWRlRmllbGRzIiwic2lkZVBhbmVsV2lkdGgiLCJtYXBTYXZlZCIsIm1hcEZpZWxkcyIsImVkaXRvciIsIm1hcENvbnRyb2xzIiwicmVhZE9ubHkiLCJjb250YWluZXJXIiwibWFwQ29udGFpbmVycyIsInNldHRpbmdzIiwiaW5kZXgiLCJpc0V4cG9ydGluZyIsImN1cnJlbnRNb2RhbCIsIkVYUE9SVF9JTUFHRV9JRCIsIlNBVkVfTUFQX0lEIiwiU0hBUkVfTUFQX0lEIiwiT1ZFUldSSVRFX01BUF9JRCIsImF2YWlsYWJsZVRoZW1lU2VsZWN0b3IiLCJyb290IiwibG9jYWxlIiwibWVzc2FnZXMiLCJkaXNwbGF5IiwiZXhwb3J0SW1hZ2UiLCJhZGROb3RpZmljYXRpb24iLCJzdGFydEV4cG9ydGluZ0ltYWdlIiwic2V0RXhwb3J0SW1hZ2VEYXRhVXJpIiwic2V0RXhwb3J0SW1hZ2VFcnJvciIsImdlb2NvZGVyIiwiZW5hYmxlZCIsInNpZGVQYW5lbCIsIm1hcmdpbiIsImxlZnQiLCJjdXJyZW50Iiwib25FeHBvcnRUb0Nsb3VkU3VjY2VzcyIsIm9uTG9hZENsb3VkTWFwU3VjY2VzcyIsIm9uTG9hZENsb3VkTWFwRXJyb3IiLCJvbkV4cG9ydFRvQ2xvdWRFcnJvciIsIkNvbXBvbmVudCIsIm1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0IiwiREVGQVVMVF9NQVBCT1hfQVBJX1VSTCIsIktFUExFUl9HTF9OQU1FIiwiS0VQTEVSX0dMX1ZFUlNJT04iLCJESU1FTlNJT05TIiwiUm9vdENvbnRleHQiLCJtYXBTdGF0ZVRvUHJvcHMiLCJtYWtlTWFwRGlzcGF0Y2hUb1Byb3BzIiwic3RhdGUiLCJkZWZhdWx0VXNlckFjdGlvbnMiLCJnZXREaXNwYXRjaCIsImdldFVzZXJBY3Rpb25zIiwiYWN0aW9ucyIsIm1ha2VHZXRBY3Rpb25DcmVhdG9ycyIsInVzZXJBY3Rpb25zIiwiVmlzU3RhdGVBY3Rpb25zIiwiTWFwU3RhdGVBY3Rpb25zIiwiTWFwU3R5bGVBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJQcm92aWRlckFjdGlvbnMiLCJtZXJnZUFjdGlvbnMiLCJnZXRBY3Rpb25DcmVhdG9ycyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIm93blByb3BzIiwiZ3JvdXBlZEFjdGlvbkNyZWF0b3JzIiwib3ZlcnJpZGVzIiwia2V5IiwiaGFzT3duUHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztB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O0FBSUw4QixNQUFBQSxjQUFjLEVBQWRBLGNBSks7QUFLTEMsTUFBQUEsZUFBZSxFQUFmQSxlQUxLO0FBTUxDLE1BQUFBLFFBQVEsRUFBUkE7QUFOSyxLQUFQO0FBUUQsR0FqQk0sQ0FBUDtBQWtCRDs7QUFFRCxTQUFTZ0Usc0JBQVQsR0FBa0M7QUFDaEMsTUFBTWMsaUJBQWlCLEdBQUdSLHFCQUFxQixFQUEvQzs7QUFDQSxNQUFNUyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLENBQUMvRSxRQUFELEVBQVdnRixRQUFYLEVBQXdCO0FBQ2pELFFBQU1DLHFCQUFxQixHQUFHSCxpQkFBaUIsQ0FBQzlFLFFBQUQsRUFBV2dGLFFBQVgsQ0FBL0M7QUFFQSw2QkFDS0MscUJBREw7QUFFRWpGLE1BQUFBLFFBQVEsRUFBUkE7QUFGRjtBQUlELEdBUEQ7O0FBU0EsU0FBTytFLGtCQUFQO0FBQ0Q7QUFFRDs7Ozs7QUFHQSxTQUFTRixZQUFULENBQXNCUixPQUF0QixFQUErQkUsV0FBL0IsRUFBNEM7QUFDMUMsTUFBTVcsU0FBUyxHQUFHLEVBQWxCOztBQUNBLE9BQUssSUFBTUMsR0FBWCxJQUFrQlosV0FBbEIsRUFBK0I7QUFDN0IsUUFBSUEsV0FBVyxDQUFDYSxjQUFaLENBQTJCRCxHQUEzQixLQUFtQ2QsT0FBTyxDQUFDZSxjQUFSLENBQXVCRCxHQUF2QixDQUF2QyxFQUFvRTtBQUNsRUQsTUFBQUEsU0FBUyxDQUFDQyxHQUFELENBQVQsR0FBaUJaLFdBQVcsQ0FBQ1ksR0FBRCxDQUE1QjtBQUNEO0FBQ0Y7O0FBRUQsMkJBQVdkLE9BQVgsTUFBdUJhLFNBQXZCO0FBQ0Q7O2VBRWNySyxlIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgc3R5bGVkLCB7VGhlbWVQcm92aWRlciwgd2l0aFRoZW1lfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge2Nvbm5lY3QgYXMga2VwbGVyR2xDb25uZWN0fSBmcm9tICdjb25uZWN0L2tlcGxlcmdsLWNvbm5lY3QnO1xuaW1wb3J0IHtJbnRsUHJvdmlkZXJ9IGZyb20gJ3JlYWN0LWludGwnO1xuaW1wb3J0IHttZXNzYWdlc30gZnJvbSAnLi4vbG9jYWxpemF0aW9uJztcbmltcG9ydCB7Um9vdENvbnRleHR9IGZyb20gJ2NvbXBvbmVudHMvY29udGV4dCc7XG5cbmltcG9ydCAqIGFzIFZpc1N0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL3Zpcy1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0eWxlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdHlsZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIFVJU3RhdGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvdWktc3RhdGUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBQcm92aWRlckFjdGlvbnMgZnJvbSAnYWN0aW9ucy9wcm92aWRlci1hY3Rpb25zJztcblxuaW1wb3J0IHtcbiAgRVhQT1JUX0lNQUdFX0lELFxuICBESU1FTlNJT05TLFxuICBLRVBMRVJfR0xfTkFNRSxcbiAgS0VQTEVSX0dMX1ZFUlNJT04sXG4gIFRIRU1FLFxuICBERUZBVUxUX01BUEJPWF9BUElfVVJMLFxuICBTQVZFX01BUF9JRCxcbiAgU0hBUkVfTUFQX0lELFxuICBPVkVSV1JJVEVfTUFQX0lEXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7TUlTU0lOR19NQVBCT1hfVE9LRU59IGZyb20gJ2NvbnN0YW50cy91c2VyLWZlZWRiYWNrcyc7XG5cbmltcG9ydCBTaWRlUGFuZWxGYWN0b3J5IGZyb20gJy4vc2lkZS1wYW5lbCc7XG5pbXBvcnQgTWFwQ29udGFpbmVyRmFjdG9yeSBmcm9tICcuL21hcC1jb250YWluZXInO1xuaW1wb3J0IEJvdHRvbVdpZGdldEZhY3RvcnkgZnJvbSAnLi9ib3R0b20td2lkZ2V0JztcbmltcG9ydCBNb2RhbENvbnRhaW5lckZhY3RvcnkgZnJvbSAnLi9tb2RhbC1jb250YWluZXInO1xuaW1wb3J0IFBsb3RDb250YWluZXJGYWN0b3J5IGZyb20gJy4vcGxvdC1jb250YWluZXInO1xuaW1wb3J0IE5vdGlmaWNhdGlvblBhbmVsRmFjdG9yeSBmcm9tICcuL25vdGlmaWNhdGlvbi1wYW5lbCc7XG5pbXBvcnQgR2VvQ29kZXJQYW5lbEZhY3RvcnkgZnJvbSAnLi9nZW9jb2Rlci1wYW5lbCc7XG5cbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7dmFsaWRhdGVUb2tlbn0gZnJvbSAndXRpbHMvbWFwYm94LXV0aWxzJztcblxuaW1wb3J0IHt0aGVtZSBhcyBiYXNpY1RoZW1lLCB0aGVtZUxULCB0aGVtZUJTfSBmcm9tICdzdHlsZXMvYmFzZSc7XG5cbi8vIE1heWJlIHdlIHNob3VsZCB0aGluayBhYm91dCBleHBvcnRpbmcgdGhpcyBvciBjcmVhdGluZyBhIHZhcmlhYmxlXG4vLyBhcyBwYXJ0IG9mIHRoZSBiYXNlLmpzIHRoZW1lXG5jb25zdCBHbG9iYWxTdHlsZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtZmFtaWx5OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmZvbnRGYW1pbHl9O1xuICBmb250LXdlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mb250V2VpZ2h0fTtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmZvbnRTaXplfTtcbiAgbGluZS1oZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGluZUhlaWdodH07XG5cbiAgKixcbiAgKjpiZWZvcmUsXG4gICo6YWZ0ZXIge1xuICAgIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAtbW96LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuXG4gIHVsIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gIGxpIHtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICBhIHtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIH1cbmA7XG5cbktlcGxlckdsRmFjdG9yeS5kZXBzID0gW1xuICBCb3R0b21XaWRnZXRGYWN0b3J5LFxuICBHZW9Db2RlclBhbmVsRmFjdG9yeSxcbiAgTWFwQ29udGFpbmVyRmFjdG9yeSxcbiAgTW9kYWxDb250YWluZXJGYWN0b3J5LFxuICBTaWRlUGFuZWxGYWN0b3J5LFxuICBQbG90Q29udGFpbmVyRmFjdG9yeSxcbiAgTm90aWZpY2F0aW9uUGFuZWxGYWN0b3J5XG5dO1xuXG5mdW5jdGlvbiBLZXBsZXJHbEZhY3RvcnkoXG4gIEJvdHRvbVdpZGdldCxcbiAgR2VvQ29kZXJQYW5lbCxcbiAgTWFwQ29udGFpbmVyLFxuICBNb2RhbENvbnRhaW5lcixcbiAgU2lkZVBhbmVsLFxuICBQbG90Q29udGFpbmVyLFxuICBOb3RpZmljYXRpb25QYW5lbFxuKSB7XG4gIGNsYXNzIEtlcGxlckdMIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgbWFwU3R5bGVzOiBbXSxcbiAgICAgIG1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0OiBmYWxzZSxcbiAgICAgIG1hcGJveEFwaVVybDogREVGQVVMVF9NQVBCT1hfQVBJX1VSTCxcbiAgICAgIHdpZHRoOiA4MDAsXG4gICAgICBoZWlnaHQ6IDgwMCxcbiAgICAgIGFwcE5hbWU6IEtFUExFUl9HTF9OQU1FLFxuICAgICAgdmVyc2lvbjogS0VQTEVSX0dMX1ZFUlNJT04sXG4gICAgICBzaWRlUGFuZWxXaWR0aDogRElNRU5TSU9OUy5zaWRlUGFuZWwud2lkdGgsXG4gICAgICB0aGVtZToge30sXG4gICAgICBjbG91ZFByb3ZpZGVyczogW11cbiAgICB9O1xuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB0aGlzLl92YWxpZGF0ZU1hcGJveFRva2VuKCk7XG4gICAgICB0aGlzLl9sb2FkTWFwU3R5bGUodGhpcy5wcm9wcy5tYXBTdHlsZXMpO1xuICAgICAgdGhpcy5faGFuZGxlUmVzaXplKHRoaXMucHJvcHMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgLy8gaWYgZGltZW5zaW9uIHByb3BzIGhhcyBjaGFuZ2VkXG4gICAgICAgIHRoaXMucHJvcHMuaGVpZ2h0ICE9PSBwcmV2UHJvcHMuaGVpZ2h0IHx8XG4gICAgICAgIHRoaXMucHJvcHMud2lkdGggIT09IHByZXZQcm9wcy53aWR0aCB8fFxuICAgICAgICAvLyByZWFjdC1tYXAtZ2wgd2lsbCBkaXNwYXRjaCB1cGRhdGVWaWV3cG9ydCBhZnRlciB0aGlzLl9oYW5kbGVSZXNpemUgaXMgY2FsbGVkXG4gICAgICAgIC8vIGhlcmUgd2UgY2hlY2sgaWYgdGhpcy5wcm9wcy5tYXBTdGF0ZS5oZWlnaHQgaXMgc3luYyB3aXRoIHByb3BzLmhlaWdodFxuICAgICAgICB0aGlzLnByb3BzLmhlaWdodCAhPT0gdGhpcy5wcm9wcy5tYXBTdGF0ZS5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9oYW5kbGVSZXNpemUodGhpcy5wcm9wcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcm9vdCA9IGNyZWF0ZVJlZigpO1xuICAgIHN0YXRpYyBjb250ZXh0VHlwZSA9IFJvb3RDb250ZXh0O1xuXG4gICAgLyogc2VsZWN0b3JzICovXG4gICAgdGhlbWVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnRoZW1lO1xuICAgIGF2YWlsYWJsZVRoZW1lU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLnRoZW1lU2VsZWN0b3IsIHRoZW1lID0+XG4gICAgICB0eXBlb2YgdGhlbWUgPT09ICdvYmplY3QnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgLi4uYmFzaWNUaGVtZSxcbiAgICAgICAgICAgIC4uLnRoZW1lXG4gICAgICAgICAgfVxuICAgICAgICA6IHRoZW1lID09PSBUSEVNRS5saWdodFxuICAgICAgICA/IHRoZW1lTFRcbiAgICAgICAgOiB0aGVtZSA9PT0gVEhFTUUuYmFzZVxuICAgICAgICA/IHRoZW1lQlNcbiAgICAgICAgOiB0aGVtZVxuICAgICk7XG5cbiAgICBhdmFpbGFibGVQcm92aWRlcnMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHByb3BzID0+IHByb3BzLmNsb3VkUHJvdmlkZXJzLFxuICAgICAgcHJvdmlkZXJzID0+XG4gICAgICAgIEFycmF5LmlzQXJyYXkocHJvdmlkZXJzKSAmJiBwcm92aWRlcnMubGVuZ3RoXG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIGhhc1N0b3JhZ2U6IHByb3ZpZGVycy5zb21lKHAgPT4gcC5oYXNQcml2YXRlU3RvcmFnZSgpKSxcbiAgICAgICAgICAgICAgaGFzU2hhcmU6IHByb3ZpZGVycy5zb21lKHAgPT4gcC5oYXNTaGFyaW5nVXJsKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiB7fVxuICAgICk7XG5cbiAgICAvKiBwcml2YXRlIG1ldGhvZHMgKi9cbiAgICBfdmFsaWRhdGVNYXBib3hUb2tlbigpIHtcbiAgICAgIGNvbnN0IHttYXBib3hBcGlBY2Nlc3NUb2tlbn0gPSB0aGlzLnByb3BzO1xuICAgICAgaWYgKCF2YWxpZGF0ZVRva2VuKG1hcGJveEFwaUFjY2Vzc1Rva2VuKSkge1xuICAgICAgICBDb25zb2xlLndhcm4oTUlTU0lOR19NQVBCT1hfVE9LRU4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9oYW5kbGVSZXNpemUoe3dpZHRoLCBoZWlnaHR9KSB7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh3aWR0aCkgfHwgIU51bWJlci5pc0Zpbml0ZShoZWlnaHQpKSB7XG4gICAgICAgIENvbnNvbGUud2Fybignd2lkdGggYW5kIGhlaWdodCBpcyByZXF1aXJlZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnByb3BzLm1hcFN0YXRlQWN0aW9ucy51cGRhdGVNYXAoe1xuICAgICAgICB3aWR0aDogd2lkdGggLyAoMSArIE51bWJlcih0aGlzLnByb3BzLm1hcFN0YXRlLmlzU3BsaXQpKSxcbiAgICAgICAgaGVpZ2h0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfbG9hZE1hcFN0eWxlID0gKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFN0eWxlcyA9IE9iamVjdC52YWx1ZXModGhpcy5wcm9wcy5tYXBTdHlsZS5tYXBTdHlsZXMpO1xuICAgICAgLy8gYWRkIGlkIHRvIGN1c3RvbSBtYXAgc3R5bGVzIGlmIG5vdCBnaXZlblxuICAgICAgY29uc3QgY3VzdG9tU3R5bGVzID0gKHRoaXMucHJvcHMubWFwU3R5bGVzIHx8IFtdKS5tYXAobXMgPT4gKHtcbiAgICAgICAgLi4ubXMsXG4gICAgICAgIGlkOiBtcy5pZCB8fCBnZW5lcmF0ZUhhc2hJZCgpXG4gICAgICB9KSk7XG5cbiAgICAgIGNvbnN0IGFsbFN0eWxlcyA9IFsuLi5jdXN0b21TdHlsZXMsIC4uLmRlZmF1bHRTdHlsZXNdLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIHN0eWxlKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFzU3R5bGVPYmplY3QgPSBzdHlsZS5zdHlsZSAmJiB0eXBlb2Ygc3R5bGUuc3R5bGUgPT09ICdvYmplY3QnO1xuICAgICAgICAgIGFjY3VbaGFzU3R5bGVPYmplY3QgPyAndG9Mb2FkJyA6ICd0b1JlcXVlc3QnXVtzdHlsZS5pZF0gPSBzdHlsZTtcblxuICAgICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgICB9LFxuICAgICAgICB7dG9Mb2FkOiB7fSwgdG9SZXF1ZXN0OiB7fX1cbiAgICAgICk7XG5cbiAgICAgIHRoaXMucHJvcHMubWFwU3R5bGVBY3Rpb25zLmxvYWRNYXBTdHlsZXMoYWxsU3R5bGVzLnRvTG9hZCk7XG4gICAgICB0aGlzLnByb3BzLm1hcFN0eWxlQWN0aW9ucy5yZXF1ZXN0TWFwU3R5bGVzKGFsbFN0eWxlcy50b1JlcXVlc3QpO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIC8vIHByb3BzXG4gICAgICAgIGlkLFxuICAgICAgICBhcHBOYW1lLFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICBhcHBXZWJzaXRlLFxuICAgICAgICBvblNhdmVNYXAsXG4gICAgICAgIG9uVmlld1N0YXRlQ2hhbmdlLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgbWFwYm94QXBpVXJsLFxuICAgICAgICBnZXRNYXBib3hSZWYsXG5cbiAgICAgICAgLy8gcmVkdXggc3RhdGVcbiAgICAgICAgbWFwU3R5bGUsXG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICB1aVN0YXRlLFxuICAgICAgICB2aXNTdGF0ZSxcbiAgICAgICAgcHJvdmlkZXJTdGF0ZSxcblxuICAgICAgICAvLyBhY3Rpb25zLFxuICAgICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICAgICAgcHJvdmlkZXJBY3Rpb25zLFxuICAgICAgICBkaXNwYXRjaFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIGNvbnN0IGF2YWlsYWJsZVByb3ZpZGVycyA9IHRoaXMuYXZhaWxhYmxlUHJvdmlkZXJzKHRoaXMucHJvcHMpO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIGZpbHRlcnMsXG4gICAgICAgIGxheWVycyxcbiAgICAgICAgc3BsaXRNYXBzLCAvLyB0aGlzIHdpbGwgc3RvcmUgc3VwcG9ydCBmb3Igc3BsaXQgbWFwIHZpZXcgaXMgbmVjZXNzYXJ5XG4gICAgICAgIGxheWVyT3JkZXIsXG4gICAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICAgIGxheWVyQ2xhc3NlcyxcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAgIGRhdGFzZXRzLFxuICAgICAgICBsYXllckRhdGEsXG4gICAgICAgIGhvdmVySW5mbyxcbiAgICAgICAgY2xpY2tlZCxcbiAgICAgICAgbW91c2VQb3MsXG4gICAgICAgIGFuaW1hdGlvbkNvbmZpZyxcbiAgICAgICAgbWFwSW5mb1xuICAgICAgfSA9IHZpc1N0YXRlO1xuXG4gICAgICBjb25zdCBub3RpZmljYXRpb25QYW5lbEZpZWxkcyA9IHtcbiAgICAgICAgcmVtb3ZlTm90aWZpY2F0aW9uOiB1aVN0YXRlQWN0aW9ucy5yZW1vdmVOb3RpZmljYXRpb24sXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6IHVpU3RhdGUubm90aWZpY2F0aW9uc1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgc2lkZUZpZWxkcyA9IHtcbiAgICAgICAgYXBwTmFtZSxcbiAgICAgICAgdmVyc2lvbixcbiAgICAgICAgYXBwV2Vic2l0ZSxcbiAgICAgICAgZGF0YXNldHMsXG4gICAgICAgIGZpbHRlcnMsXG4gICAgICAgIGxheWVycyxcbiAgICAgICAgbGF5ZXJPcmRlcixcbiAgICAgICAgbGF5ZXJDbGFzc2VzLFxuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgICAgbWFwU3R5bGUsXG4gICAgICAgIG1hcEluZm8sXG4gICAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICAgIG9uU2F2ZU1hcCxcbiAgICAgICAgdWlTdGF0ZSxcbiAgICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICAgIHVpU3RhdGVBY3Rpb25zLFxuICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaWRlUGFuZWxXaWR0aCxcbiAgICAgICAgYXZhaWxhYmxlUHJvdmlkZXJzLFxuICAgICAgICBtYXBTYXZlZDogcHJvdmlkZXJTdGF0ZS5tYXBTYXZlZFxuICAgICAgfTtcblxuICAgICAgY29uc3QgbWFwRmllbGRzID0ge1xuICAgICAgICBkYXRhc2V0cyxcbiAgICAgICAgZ2V0TWFwYm94UmVmLFxuICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgbWFwYm94QXBpVXJsLFxuICAgICAgICBtYXBTdGF0ZSxcbiAgICAgICAgdWlTdGF0ZSxcbiAgICAgICAgZWRpdG9yOiB2aXNTdGF0ZS5lZGl0b3IsXG4gICAgICAgIG1hcFN0eWxlLFxuICAgICAgICBtYXBDb250cm9sczogdWlTdGF0ZS5tYXBDb250cm9scyxcbiAgICAgICAgbGF5ZXJzLFxuICAgICAgICBsYXllck9yZGVyLFxuICAgICAgICBsYXllckRhdGEsXG4gICAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICAgIGZpbHRlcnMsXG4gICAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgICBob3ZlckluZm8sXG4gICAgICAgIGNsaWNrZWQsXG4gICAgICAgIG1vdXNlUG9zLFxuICAgICAgICByZWFkT25seTogdWlTdGF0ZS5yZWFkT25seSxcbiAgICAgICAgb25WaWV3U3RhdGVDaGFuZ2UsXG4gICAgICAgIHVpU3RhdGVBY3Rpb25zLFxuICAgICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICAgICAgYW5pbWF0aW9uQ29uZmlnXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBpc1NwbGl0ID0gc3BsaXRNYXBzICYmIHNwbGl0TWFwcy5sZW5ndGggPiAxO1xuICAgICAgY29uc3QgY29udGFpbmVyVyA9IG1hcFN0YXRlLndpZHRoICogKE51bWJlcihpc1NwbGl0KSArIDEpO1xuXG4gICAgICBjb25zdCBtYXBDb250YWluZXJzID0gIWlzU3BsaXRcbiAgICAgICAgPyBbPE1hcENvbnRhaW5lciBrZXk9ezB9IGluZGV4PXswfSB7Li4ubWFwRmllbGRzfSBtYXBMYXllcnM9e251bGx9IC8+XVxuICAgICAgICA6IHNwbGl0TWFwcy5tYXAoKHNldHRpbmdzLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPE1hcENvbnRhaW5lclxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgICAgICAgIG1hcExheWVycz17c3BsaXRNYXBzW2luZGV4XS5sYXllcnN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpO1xuXG4gICAgICBjb25zdCBpc0V4cG9ydGluZyA9XG4gICAgICAgIHVpU3RhdGUuY3VycmVudE1vZGFsID09PSBFWFBPUlRfSU1BR0VfSUQgfHxcbiAgICAgICAgdWlTdGF0ZS5jdXJyZW50TW9kYWwgPT09IFNBVkVfTUFQX0lEIHx8XG4gICAgICAgIHVpU3RhdGUuY3VycmVudE1vZGFsID09PSBTSEFSRV9NQVBfSUQgfHxcbiAgICAgICAgdWlTdGF0ZS5jdXJyZW50TW9kYWwgPT09IE9WRVJXUklURV9NQVBfSUQ7XG5cbiAgICAgIGNvbnN0IHRoZW1lID0gdGhpcy5hdmFpbGFibGVUaGVtZVNlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Um9vdENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3RoaXMucm9vdH0+XG4gICAgICAgICAgPEludGxQcm92aWRlciBsb2NhbGU9e3VpU3RhdGUubG9jYWxlfSBtZXNzYWdlcz17bWVzc2FnZXNbdWlTdGF0ZS5sb2NhbGVdfT5cbiAgICAgICAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGVtZX0+XG4gICAgICAgICAgICAgIDxHbG9iYWxTdHlsZVxuICAgICAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJrZXBsZXItZ2xcIlxuICAgICAgICAgICAgICAgIGlkPXtga2VwbGVyLWdsX18ke2lkfWB9XG4gICAgICAgICAgICAgICAgcmVmPXt0aGlzLnJvb3R9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8Tm90aWZpY2F0aW9uUGFuZWwgey4uLm5vdGlmaWNhdGlvblBhbmVsRmllbGRzfSAvPlxuICAgICAgICAgICAgICAgIHshdWlTdGF0ZS5yZWFkT25seSAmJiA8U2lkZVBhbmVsIHsuLi5zaWRlRmllbGRzfSAvPn1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcHNcIiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4J319PlxuICAgICAgICAgICAgICAgICAge21hcENvbnRhaW5lcnN9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge2lzRXhwb3J0aW5nICYmIChcbiAgICAgICAgICAgICAgICAgIDxQbG90Q29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydEltYWdlU2V0dGluZz17dWlTdGF0ZS5leHBvcnRJbWFnZX1cbiAgICAgICAgICAgICAgICAgICAgbWFwRmllbGRzPXttYXBGaWVsZHN9XG4gICAgICAgICAgICAgICAgICAgIGFkZE5vdGlmaWNhdGlvbj17dWlTdGF0ZUFjdGlvbnMuYWRkTm90aWZpY2F0aW9ufVxuICAgICAgICAgICAgICAgICAgICBzdGFydEV4cG9ydGluZ0ltYWdlPXt1aVN0YXRlQWN0aW9ucy5zdGFydEV4cG9ydGluZ0ltYWdlfVxuICAgICAgICAgICAgICAgICAgICBzZXRFeHBvcnRJbWFnZURhdGFVcmk9e3VpU3RhdGVBY3Rpb25zLnNldEV4cG9ydEltYWdlRGF0YVVyaX1cbiAgICAgICAgICAgICAgICAgICAgc2V0RXhwb3J0SW1hZ2VFcnJvcj17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VFcnJvcn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7IXVpU3RhdGUucmVhZE9ubHkgJiYgaW50ZXJhY3Rpb25Db25maWcuZ2VvY29kZXIuZW5hYmxlZCAmJiAoXG4gICAgICAgICAgICAgICAgICA8R2VvQ29kZXJQYW5lbFxuICAgICAgICAgICAgICAgICAgICBpc0dlb2NvZGVyRW5hYmxlZD17aW50ZXJhY3Rpb25Db25maWcuZ2VvY29kZXIuZW5hYmxlZH1cbiAgICAgICAgICAgICAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW49e21hcGJveEFwaUFjY2Vzc1Rva2VufVxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaD17ZGlzcGF0Y2h9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPEJvdHRvbVdpZGdldFxuICAgICAgICAgICAgICAgICAgZmlsdGVycz17ZmlsdGVyc31cbiAgICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICAgIHVpU3RhdGU9e3VpU3RhdGV9XG4gICAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNvbmZpZz17YW5pbWF0aW9uQ29uZmlnfVxuICAgICAgICAgICAgICAgICAgdmlzU3RhdGVBY3Rpb25zPXt2aXNTdGF0ZUFjdGlvbnN9XG4gICAgICAgICAgICAgICAgICBzaWRlUGFuZWxXaWR0aD17XG4gICAgICAgICAgICAgICAgICAgIHVpU3RhdGUucmVhZE9ubHkgPyAwIDogdGhpcy5wcm9wcy5zaWRlUGFuZWxXaWR0aCArIHRoZW1lLnNpZGVQYW5lbC5tYXJnaW4ubGVmdFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY29udGFpbmVyVz17Y29udGFpbmVyV31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxNb2RhbENvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgbWFwU3R5bGU9e21hcFN0eWxlfVxuICAgICAgICAgICAgICAgICAgdmlzU3RhdGU9e3Zpc1N0YXRlfVxuICAgICAgICAgICAgICAgICAgbWFwU3RhdGU9e21hcFN0YXRlfVxuICAgICAgICAgICAgICAgICAgdWlTdGF0ZT17dWlTdGF0ZX1cbiAgICAgICAgICAgICAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuPXttYXBib3hBcGlBY2Nlc3NUb2tlbn1cbiAgICAgICAgICAgICAgICAgIG1hcGJveEFwaVVybD17bWFwYm94QXBpVXJsfVxuICAgICAgICAgICAgICAgICAgdmlzU3RhdGVBY3Rpb25zPXt2aXNTdGF0ZUFjdGlvbnN9XG4gICAgICAgICAgICAgICAgICB1aVN0YXRlQWN0aW9ucz17dWlTdGF0ZUFjdGlvbnN9XG4gICAgICAgICAgICAgICAgICBtYXBTdHlsZUFjdGlvbnM9e21hcFN0eWxlQWN0aW9uc31cbiAgICAgICAgICAgICAgICAgIHByb3ZpZGVyQWN0aW9ucz17cHJvdmlkZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgICAgcm9vdE5vZGU9e3RoaXMucm9vdC5jdXJyZW50fVxuICAgICAgICAgICAgICAgICAgY29udGFpbmVyVz17Y29udGFpbmVyV31cbiAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckg9e21hcFN0YXRlLmhlaWdodH1cbiAgICAgICAgICAgICAgICAgIHByb3ZpZGVyU3RhdGU9e3RoaXMucHJvcHMucHJvdmlkZXJTdGF0ZX1cbiAgICAgICAgICAgICAgICAgIC8vIFVzZXIgZGVmaW5lZCBjbG91ZCBwcm92aWRlciBwcm9wc1xuICAgICAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcnM9e3RoaXMucHJvcHMuY2xvdWRQcm92aWRlcnN9XG4gICAgICAgICAgICAgICAgICBvbkV4cG9ydFRvQ2xvdWRTdWNjZXNzPXt0aGlzLnByb3BzLm9uRXhwb3J0VG9DbG91ZFN1Y2Nlc3N9XG4gICAgICAgICAgICAgICAgICBvbkxvYWRDbG91ZE1hcFN1Y2Nlc3M9e3RoaXMucHJvcHMub25Mb2FkQ2xvdWRNYXBTdWNjZXNzfVxuICAgICAgICAgICAgICAgICAgb25Mb2FkQ2xvdWRNYXBFcnJvcj17dGhpcy5wcm9wcy5vbkxvYWRDbG91ZE1hcEVycm9yfVxuICAgICAgICAgICAgICAgICAgb25FeHBvcnRUb0Nsb3VkRXJyb3I9e3RoaXMucHJvcHMub25FeHBvcnRUb0Nsb3VkRXJyb3J9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9HbG9iYWxTdHlsZT5cbiAgICAgICAgICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgICAgICAgICA8L0ludGxQcm92aWRlcj5cbiAgICAgICAgPC9Sb290Q29udGV4dC5Qcm92aWRlcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGtlcGxlckdsQ29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1ha2VNYXBEaXNwYXRjaFRvUHJvcHMpKHdpdGhUaGVtZShLZXBsZXJHTCkpO1xufVxuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUgPSB7fSwgcHJvcHMpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wcm9wcyxcbiAgICB2aXNTdGF0ZTogc3RhdGUudmlzU3RhdGUsXG4gICAgbWFwU3R5bGU6IHN0YXRlLm1hcFN0eWxlLFxuICAgIG1hcFN0YXRlOiBzdGF0ZS5tYXBTdGF0ZSxcbiAgICB1aVN0YXRlOiBzdGF0ZS51aVN0YXRlLFxuICAgIHByb3ZpZGVyU3RhdGU6IHN0YXRlLnByb3ZpZGVyU3RhdGVcbiAgfTtcbn1cblxuY29uc3QgZGVmYXVsdFVzZXJBY3Rpb25zID0ge307XG5jb25zdCBnZXREaXNwYXRjaCA9IGRpc3BhdGNoID0+IGRpc3BhdGNoO1xuY29uc3QgZ2V0VXNlckFjdGlvbnMgPSAoZGlzcGF0Y2gsIHByb3BzKSA9PiBwcm9wcy5hY3Rpb25zIHx8IGRlZmF1bHRVc2VyQWN0aW9ucztcblxuZnVuY3Rpb24gbWFrZUdldEFjdGlvbkNyZWF0b3JzKCkge1xuICByZXR1cm4gY3JlYXRlU2VsZWN0b3IoW2dldERpc3BhdGNoLCBnZXRVc2VyQWN0aW9uc10sIChkaXNwYXRjaCwgdXNlckFjdGlvbnMpID0+IHtcbiAgICBjb25zdCBbdmlzU3RhdGVBY3Rpb25zLCBtYXBTdGF0ZUFjdGlvbnMsIG1hcFN0eWxlQWN0aW9ucywgdWlTdGF0ZUFjdGlvbnMsIHByb3ZpZGVyQWN0aW9uc10gPSBbXG4gICAgICBWaXNTdGF0ZUFjdGlvbnMsXG4gICAgICBNYXBTdGF0ZUFjdGlvbnMsXG4gICAgICBNYXBTdHlsZUFjdGlvbnMsXG4gICAgICBVSVN0YXRlQWN0aW9ucyxcbiAgICAgIFByb3ZpZGVyQWN0aW9uc1xuICAgIF0ubWFwKGFjdGlvbnMgPT4gYmluZEFjdGlvbkNyZWF0b3JzKG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucyksIGRpc3BhdGNoKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgdWlTdGF0ZUFjdGlvbnMsXG4gICAgICBwcm92aWRlckFjdGlvbnMsXG4gICAgICBkaXNwYXRjaFxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtYWtlTWFwRGlzcGF0Y2hUb1Byb3BzKCkge1xuICBjb25zdCBnZXRBY3Rpb25DcmVhdG9ycyA9IG1ha2VHZXRBY3Rpb25DcmVhdG9ycygpO1xuICBjb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gsIG93blByb3BzKSA9PiB7XG4gICAgY29uc3QgZ3JvdXBlZEFjdGlvbkNyZWF0b3JzID0gZ2V0QWN0aW9uQ3JlYXRvcnMoZGlzcGF0Y2gsIG93blByb3BzKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5ncm91cGVkQWN0aW9uQ3JlYXRvcnMsXG4gICAgICBkaXNwYXRjaFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIG1hcERpc3BhdGNoVG9Qcm9wcztcbn1cblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IGtlcGxlci5nbCBhY3Rpb25zIHdpdGggdXNlciBkZWZpbmVkIGFjdGlvbnMgdXNpbmcgdGhlIHNhbWUga2V5XG4gKi9cbmZ1bmN0aW9uIG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucykge1xuICBjb25zdCBvdmVycmlkZXMgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gdXNlckFjdGlvbnMpIHtcbiAgICBpZiAodXNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBhY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG92ZXJyaWRlc1trZXldID0gdXNlckFjdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gey4uLmFjdGlvbnMsIC4uLm92ZXJyaWRlc307XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtlcGxlckdsRmFjdG9yeTtcbiJdfQ==