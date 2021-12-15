"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MapContainerFactory;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMapGl = _interopRequireDefault(require("react-map-gl"));

var _react2 = _interopRequireDefault(require("@deck.gl/react"));

var _reselect = require("reselect");

var _viewportMercatorProject = _interopRequireDefault(require("viewport-mercator-project"));

var _notificationsUtils = require("../utils/notifications-utils");

var _mapPopover = _interopRequireDefault(require("./map/map-popover"));

var _mapControl = _interopRequireDefault(require("./map/map-control"));

var _styledComponents = require("./common/styled-components");

var _editor = _interopRequireDefault(require("./editor/editor"));

var _mapboxUtils = require("../layers/mapbox-utils");

var _glUtils = require("../utils/gl-utils");

var _mapboxUtils2 = require("../utils/map-style-utils/mapbox-utils");

var _layerUtils = require("../utils/layer-utils");

var _dBuildingLayer = _interopRequireDefault(require("../deckgl-layers/3d-building-layer/3d-building-layer"));

var _defaultSettings = require("../constants/default-settings");

var _baseLayer = require("../layers/base-layer");

var _errorBoundary = _interopRequireDefault(require("./common/error-boundary"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @type {{[key: string]: React.CSSProperties}} */
var MAP_STYLE = {
  container: {
    display: 'inline-block',
    position: 'relative'
  },
  top: {
    position: 'absolute',
    top: '0px',
    pointerEvents: 'none'
  }
};
var MAPBOXGL_STYLE_UPDATE = 'style.load';
var MAPBOXGL_RENDER = 'render';
var TRANSITION_DURATION = 0;

var Attribution = function Attribution() {
  return /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledAttrbution, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "attrition-logo"
  }, "Basemap by:", /*#__PURE__*/_react["default"].createElement("a", {
    className: "mapboxgl-ctrl-logo",
    target: "_blank",
    rel: "noopener noreferrer",
    href: "https://www.mapbox.com/",
    "aria-label": "Mapbox logo"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "attrition-link"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://kepler.gl/policy/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\xA9 kepler.gl |", ' '), /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://www.mapbox.com/about/maps/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\xA9 Mapbox |", ' '), /*#__PURE__*/_react["default"].createElement("a", {
    href: "http://www.openstreetmap.org/copyright",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\xA9 OpenStreetMap |", ' '), /*#__PURE__*/_react["default"].createElement("a", {
    href: "https://www.mapbox.com/map-feedback/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/_react["default"].createElement("strong", null, "Improve this map"))));
};

MapContainerFactory.deps = [_mapPopover["default"], _mapControl["default"], _editor["default"]];

function MapContainerFactory(MapPopover, MapControl, Editor) {
  var MapContainer = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(MapContainer, _Component);

    var _super = _createSuper(MapContainer);

    function MapContainer(_props) {
      var _this;

      (0, _classCallCheck2["default"])(this, MapContainer);
      _this = _super.call(this, _props);
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layersSelector", function (props) {
        return props.layers;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layerDataSelector", function (props) {
        return props.layerData;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "mapLayersSelector", function (props) {
        return props.mapLayers;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layerOrderSelector", function (props) {
        return props.layerOrder;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layersToRenderSelector", (0, _reselect.createSelector)(_this.layersSelector, _this.layerDataSelector, _this.mapLayersSelector, // {[id]: true \ false}
      function (layers, layerData, mapLayers) {
        return layers.reduce(function (accu, layer, idx) {
          return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, layer.id, layer.id !== _defaultSettings.GEOCODER_LAYER_ID && layer.shouldRenderLayer(layerData[idx]) && _this._isVisibleMapLayer(layer, mapLayers)));
        }, {});
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filtersSelector", function (props) {
        return props.filters;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "polygonFilters", (0, _reselect.createSelector)(_this.filtersSelector, function (filters) {
        return filters.filter(function (f) {
          return f.type === _defaultSettings.FILTER_TYPES.polygon;
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "mapboxLayersSelector", (0, _reselect.createSelector)(_this.layersSelector, _this.layerDataSelector, _this.layerOrderSelector, _this.layersToRenderSelector, _mapboxUtils.generateMapboxLayers));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onCloseMapPopover", function () {
        _this.props.visStateActions.onLayerClick(null);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onLayerSetDomain", function (idx, colorDomain) {
        _this.props.visStateActions.layerConfigChange(_this.props.layers[idx], {
          colorDomain: colorDomain
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleMapToggleLayer", function (layerId) {
        var _this$props = _this.props,
            _this$props$index = _this$props.index,
            mapIndex = _this$props$index === void 0 ? 0 : _this$props$index,
            visStateActions = _this$props.visStateActions;
        visStateActions.toggleLayerForMap(mapIndex, layerId);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onMapboxStyleUpdate", function () {
        // force refresh mapboxgl layers
        _this.previousLayers = {};

        _this._updateMapboxLayers();

        if (typeof _this.props.onMapStyleLoaded === 'function') {
          _this.props.onMapStyleLoaded(_this._map);
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_setMapboxMap", function (mapbox) {
        if (!_this._map && mapbox) {
          _this._map = mapbox.getMap(); // i noticed in certain context we don't access the actual map element

          if (!_this._map) {
            return;
          } // bind mapboxgl event listener


          _this._map.on(MAPBOXGL_STYLE_UPDATE, _this._onMapboxStyleUpdate);

          _this._map.on(MAPBOXGL_RENDER, function () {
            if (typeof _this.props.onMapRender === 'function') {
              _this.props.onMapRender(_this._map);
            }
          });
        }

        if (_this.props.getMapboxRef) {
          // The parent component can gain access to our MapboxGlMap by
          // providing this callback. Note that 'mapbox' will be null when the
          // ref is unset (e.g. when a split map is closed).
          _this.props.getMapboxRef(mapbox, _this.props.index);
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onBeforeRender", function (_ref) {
        var gl = _ref.gl;
        (0, _glUtils.setLayerBlending)(gl, _this.props.layerBlending);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onDeckError", function (error, layer) {
        var errorMessage = "An error in deck.gl: ".concat(error.message, " in ").concat(layer.id);
        var notificationId = "".concat(layer.id, "-").concat(error.message); // Throttle error notifications, as React doesn't like too many state changes from here.

        _this._deckGLErrorsElapsed = _this._deckGLErrorsElapsed || {};
        var lastShown = _this._deckGLErrorsElapsed[notificationId];

        if (!lastShown || lastShown < Date.now() - _defaultSettings.THROTTLE_NOTIFICATION_TIME) {
          _this._deckGLErrorsElapsed[notificationId] = Date.now(); // Create new error notification or update existing one with same id.
          // Update is required to preserve the order of notifications as they probably are going to "jump" based on order of errors.

          var uiStateActions = _this.props.uiStateActions;
          uiStateActions.addNotification((0, _notificationsUtils.errorNotification)({
            message: errorMessage,
            id: notificationId
          }));
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onViewportChange", function (viewState) {
        if (typeof _this.props.onViewStateChange === 'function') {
          _this.props.onViewStateChange(viewState);
        }

        _this.props.mapStateActions.updateMap(viewState);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_toggleMapControl", function (panelId) {
        var _this$props2 = _this.props,
            index = _this$props2.index,
            uiStateActions = _this$props2.uiStateActions;
        uiStateActions.toggleMapControl(panelId, index);
      });
      _this.previousLayers = {// [layers.id]: mapboxLayerConfig
      };
      _this._deck = null;
      return _this;
    }

    (0, _createClass2["default"])(MapContainer, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        // unbind mapboxgl event listener
        if (this._map) {
          this._map.off(MAPBOXGL_STYLE_UPDATE);

          this._map.off(MAPBOXGL_RENDER);
        }
      }
    }, {
      key: "_isVisibleMapLayer",
      value:
      /* component private functions */
      function _isVisibleMapLayer(layer, mapLayers) {
        // if layer.id is not in mapLayers, don't render it
        return !mapLayers || mapLayers && mapLayers[layer.id];
      }
    }, {
      key: "_onDeckInitialized",
      value: function _onDeckInitialized(gl) {
        if (this.props.onDeckInitialized) {
          this.props.onDeckInitialized(this._deck, gl);
        }
      }
    }, {
      key: "_renderMapPopover",
      value:
      /* component render functions */

      /* eslint-disable complexity */
      function _renderMapPopover(layersToRender) {
        // TODO: move this into reducer so it can be tested
        var _this$props3 = this.props,
            mapState = _this$props3.mapState,
            hoverInfo = _this$props3.hoverInfo,
            clicked = _this$props3.clicked,
            datasets = _this$props3.datasets,
            interactionConfig = _this$props3.interactionConfig,
            layers = _this$props3.layers,
            _this$props3$mousePos = _this$props3.mousePos,
            mousePosition = _this$props3$mousePos.mousePosition,
            coordinate = _this$props3$mousePos.coordinate,
            pinned = _this$props3$mousePos.pinned;

        if (!mousePosition || !interactionConfig.tooltip) {
          return null;
        }

        var layerHoverProp = (0, _layerUtils.getLayerHoverProp)({
          interactionConfig: interactionConfig,
          hoverInfo: hoverInfo,
          layers: layers,
          layersToRender: layersToRender,
          datasets: datasets
        });
        var compareMode = interactionConfig.tooltip.config ? interactionConfig.tooltip.config.compareMode : false;
        var pinnedPosition = {};
        var layerPinnedProp = null;

        if (pinned || clicked) {
          // project lnglat to screen so that tooltip follows the object on zoom
          var viewport = new _viewportMercatorProject["default"](mapState);
          var lngLat = clicked ? clicked.lngLat : pinned.coordinate;
          pinnedPosition = this._getHoverXY(viewport, lngLat);
          layerPinnedProp = (0, _layerUtils.getLayerHoverProp)({
            interactionConfig: interactionConfig,
            hoverInfo: clicked,
            layers: layers,
            layersToRender: layersToRender,
            datasets: datasets
          });

          if (layerHoverProp && layerPinnedProp) {
            layerHoverProp.primaryData = layerPinnedProp.data;
            layerHoverProp.compareType = interactionConfig.tooltip.config.compareType;
          }
        }

        var commonProp = {
          onClose: this._onCloseMapPopover,
          mapW: mapState.width,
          mapH: mapState.height,
          zoom: mapState.zoom,
          container: this._deck ? this._deck.canvas : undefined
        };
        return /*#__PURE__*/_react["default"].createElement(_errorBoundary["default"], null, layerPinnedProp && /*#__PURE__*/_react["default"].createElement(MapPopover, (0, _extends2["default"])({}, pinnedPosition, commonProp, {
          layerHoverProp: layerPinnedProp,
          coordinate: interactionConfig.coordinate.enabled && (pinned || {}).coordinate,
          frozen: true,
          isBase: compareMode
        })), layerHoverProp && (!layerPinnedProp || compareMode) && /*#__PURE__*/_react["default"].createElement(MapPopover, (0, _extends2["default"])({
          x: mousePosition[0],
          y: mousePosition[1]
        }, commonProp, {
          layerHoverProp: layerHoverProp,
          frozen: false,
          coordinate: interactionConfig.coordinate.enabled && coordinate
        })));
      }
      /* eslint-enable complexity */

    }, {
      key: "_getHoverXY",
      value: function _getHoverXY(viewport, lngLat) {
        var screenCoord = !viewport || !lngLat ? null : viewport.project(lngLat);
        return screenCoord && {
          x: screenCoord[0],
          y: screenCoord[1]
        };
      }
    }, {
      key: "_renderDeckOverlay",
      value: function _renderDeckOverlay(layersToRender) {
        var _this$props$deckGlPro,
            _this2 = this;

        var _this$props4 = this.props,
            mapState = _this$props4.mapState,
            mapStyle = _this$props4.mapStyle,
            layerData = _this$props4.layerData,
            layerOrder = _this$props4.layerOrder,
            layers = _this$props4.layers,
            visStateActions = _this$props4.visStateActions,
            mapboxApiAccessToken = _this$props4.mapboxApiAccessToken,
            mapboxApiUrl = _this$props4.mapboxApiUrl; // initialise layers from props if exists

        var deckGlLayers = ((_this$props$deckGlPro = this.props.deckGlProps) === null || _this$props$deckGlPro === void 0 ? void 0 : _this$props$deckGlPro.layers) || []; // wait until data is ready before render data layers

        if (layerData && layerData.length) {
          // last layer render first
          var dataLayers = layerOrder.slice().reverse().filter(function (idx) {
            return layers[idx].overlayType === _baseLayer.OVERLAY_TYPE.deckgl && layersToRender[layers[idx].id];
          }).reduce(function (overlays, idx) {
            var layerCallbacks = {
              onSetLayerDomain: function onSetLayerDomain(val) {
                return _this2._onLayerSetDomain(idx, val);
              }
            };
            var layerOverlay = (0, _layerUtils.renderDeckGlLayer)(_this2.props, layerCallbacks, idx);
            return overlays.concat(layerOverlay || []);
          }, []);
          deckGlLayers = deckGlLayers.concat(dataLayers);
        }

        if (mapStyle.visibleLayerGroups['3d building']) {
          deckGlLayers.push(new _dBuildingLayer["default"]({
            id: '_keplergl_3d-building',
            mapboxApiAccessToken: mapboxApiAccessToken,
            mapboxApiUrl: mapboxApiUrl,
            threeDBuildingColor: mapStyle.threeDBuildingColor,
            updateTriggers: {
              getFillColor: mapStyle.threeDBuildingColor
            }
          }));
        }

        return /*#__PURE__*/_react["default"].createElement(_react2["default"], (0, _extends2["default"])({}, this.props.deckGlProps, {
          viewState: mapState,
          id: "default-deckgl-overlay",
          layers: deckGlLayers,
          onBeforeRender: this._onBeforeRender,
          onHover: visStateActions.onLayerHover,
          onClick: visStateActions.onLayerClick,
          onError: this._onDeckError,
          ref: function ref(comp) {
            if (comp && comp.deck && !_this2._deck) {
              _this2._deck = comp.deck;
            }
          },
          onWebGLInitialized: function onWebGLInitialized(gl) {
            return _this2._onDeckInitialized(gl);
          }
        }));
      }
    }, {
      key: "_updateMapboxLayers",
      value: function _updateMapboxLayers() {
        var mapboxLayers = this.mapboxLayersSelector(this.props);

        if (!Object.keys(mapboxLayers).length && !Object.keys(this.previousLayers).length) {
          return;
        }

        (0, _mapboxUtils.updateMapboxLayers)(this._map, mapboxLayers, this.previousLayers);
        this.previousLayers = mapboxLayers;
      }
    }, {
      key: "_renderMapboxOverlays",
      value: function _renderMapboxOverlays() {
        if (this._map && this._map.isStyleLoaded()) {
          this._updateMapboxLayers();
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props5 = this.props,
            mapState = _this$props5.mapState,
            mapStyle = _this$props5.mapStyle,
            mapStateActions = _this$props5.mapStateActions,
            mapLayers = _this$props5.mapLayers,
            layers = _this$props5.layers,
            MapComponent = _this$props5.MapComponent,
            datasets = _this$props5.datasets,
            mapboxApiAccessToken = _this$props5.mapboxApiAccessToken,
            mapboxApiUrl = _this$props5.mapboxApiUrl,
            mapControls = _this$props5.mapControls,
            locale = _this$props5.locale,
            uiStateActions = _this$props5.uiStateActions,
            visStateActions = _this$props5.visStateActions,
            interactionConfig = _this$props5.interactionConfig,
            editor = _this$props5.editor,
            index = _this$props5.index,
            isExport = _this$props5.isExport;
        var layersToRender = this.layersToRenderSelector(this.props);

        if (!mapStyle.bottomMapStyle) {
          // style not yet loaded
          return /*#__PURE__*/_react["default"].createElement("div", null);
        }

        var mapProps = _objectSpread(_objectSpread({}, mapState), {}, {
          preserveDrawingBuffer: true,
          mapboxApiAccessToken: mapboxApiAccessToken,
          mapboxApiUrl: mapboxApiUrl,
          onViewportChange: this._onViewportChange,
          transformRequest: _mapboxUtils2.transformRequest
        });

        var isEdit = (mapControls.mapDraw || {}).active;
        var hasGeocoderLayer = layers.find(function (l) {
          return l.id === _defaultSettings.GEOCODER_LAYER_ID;
        });
        return /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledMapContainer, {
          style: MAP_STYLE.container
        }, /*#__PURE__*/_react["default"].createElement(MapControl, {
          datasets: datasets,
          dragRotate: mapState.dragRotate,
          isSplit: Boolean(mapLayers),
          isExport: isExport,
          layers: layers,
          layersToRender: layersToRender,
          mapIndex: index,
          mapControls: mapControls,
          readOnly: this.props.readOnly,
          scale: mapState.scale || 1,
          top: interactionConfig.geocoder && interactionConfig.geocoder.enabled ? 52 : 0,
          editor: editor,
          locale: locale,
          onTogglePerspective: mapStateActions.togglePerspective,
          onToggleSplitMap: mapStateActions.toggleSplitMap,
          onMapToggleLayer: this._handleMapToggleLayer,
          onToggleMapControl: this._toggleMapControl,
          onSetEditorMode: visStateActions.setEditorMode,
          onSetLocale: uiStateActions.setLocale,
          onToggleEditorVisibility: visStateActions.toggleEditorVisibility
        }), /*#__PURE__*/_react["default"].createElement(MapComponent, (0, _extends2["default"])({}, mapProps, {
          key: "bottom",
          ref: this._setMapboxMap,
          mapStyle: mapStyle.bottomMapStyle,
          getCursor: this.props.hoverInfo ? function () {
            return 'pointer';
          } : undefined,
          transitionDuration: TRANSITION_DURATION,
          onMouseMove: this.props.visStateActions.onMouseMove
        }), this._renderDeckOverlay(layersToRender), this._renderMapboxOverlays(), /*#__PURE__*/_react["default"].createElement(Editor, {
          index: index,
          datasets: datasets,
          editor: editor,
          filters: this.polygonFilters(this.props),
          isEnabled: isEdit,
          layers: layers,
          layersToRender: layersToRender,
          onDeleteFeature: visStateActions.deleteFeature,
          onSelect: visStateActions.setSelectedFeature,
          onUpdate: visStateActions.setFeatures,
          onTogglePolygonFilter: visStateActions.setPolygonFilterLayer,
          style: {
            pointerEvents: isEdit ? 'all' : 'none',
            position: 'absolute',
            display: editor.visible ? 'block' : 'none'
          }
        })), mapStyle.topMapStyle || hasGeocoderLayer ? /*#__PURE__*/_react["default"].createElement("div", {
          style: MAP_STYLE.top
        }, /*#__PURE__*/_react["default"].createElement(MapComponent, (0, _extends2["default"])({}, mapProps, {
          key: "top",
          mapStyle: mapStyle.topMapStyle
        }), this._renderDeckOverlay((0, _defineProperty2["default"])({}, _defaultSettings.GEOCODER_LAYER_ID, true)))) : null, this._renderMapPopover(layersToRender), /*#__PURE__*/_react["default"].createElement(Attribution, null));
      }
    }]);
    return MapContainer;
  }(_react.Component);

  (0, _defineProperty2["default"])(MapContainer, "propTypes", {
    // required
    datasets: _propTypes["default"].object,
    interactionConfig: _propTypes["default"].object.isRequired,
    layerBlending: _propTypes["default"].string.isRequired,
    layerOrder: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    layerData: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    filters: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    mapState: _propTypes["default"].object.isRequired,
    mapControls: _propTypes["default"].object.isRequired,
    mapStyle: _propTypes["default"].object.isRequired,
    mousePos: _propTypes["default"].object.isRequired,
    mapboxApiAccessToken: _propTypes["default"].string.isRequired,
    mapboxApiUrl: _propTypes["default"].string,
    visStateActions: _propTypes["default"].object.isRequired,
    mapStateActions: _propTypes["default"].object.isRequired,
    uiStateActions: _propTypes["default"].object.isRequired,
    // optional
    readOnly: _propTypes["default"].bool,
    isExport: _propTypes["default"].bool,
    clicked: _propTypes["default"].object,
    hoverInfo: _propTypes["default"].object,
    mapLayers: _propTypes["default"].object,
    onMapToggleLayer: _propTypes["default"].func,
    onMapStyleLoaded: _propTypes["default"].func,
    onMapRender: _propTypes["default"].func,
    getMapboxRef: _propTypes["default"].func,
    index: _propTypes["default"].number
  });
  (0, _defineProperty2["default"])(MapContainer, "defaultProps", {
    MapComponent: _reactMapGl["default"],
    deckGlProps: {},
    index: 0
  });
  MapContainer.displayName = 'MapContainer';
  return MapContainer;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiTUFQX1NUWUxFIiwiY29udGFpbmVyIiwiZGlzcGxheSIsInBvc2l0aW9uIiwidG9wIiwicG9pbnRlckV2ZW50cyIsIk1BUEJPWEdMX1NUWUxFX1VQREFURSIsIk1BUEJPWEdMX1JFTkRFUiIsIlRSQU5TSVRJT05fRFVSQVRJT04iLCJBdHRyaWJ1dGlvbiIsIk1hcENvbnRhaW5lckZhY3RvcnkiLCJkZXBzIiwiTWFwUG9wb3ZlckZhY3RvcnkiLCJNYXBDb250cm9sRmFjdG9yeSIsIkVkaXRvckZhY3RvcnkiLCJNYXBQb3BvdmVyIiwiTWFwQ29udHJvbCIsIkVkaXRvciIsIk1hcENvbnRhaW5lciIsInByb3BzIiwibGF5ZXJzIiwibGF5ZXJEYXRhIiwibWFwTGF5ZXJzIiwibGF5ZXJPcmRlciIsImxheWVyc1NlbGVjdG9yIiwibGF5ZXJEYXRhU2VsZWN0b3IiLCJtYXBMYXllcnNTZWxlY3RvciIsInJlZHVjZSIsImFjY3UiLCJsYXllciIsImlkeCIsImlkIiwiR0VPQ09ERVJfTEFZRVJfSUQiLCJzaG91bGRSZW5kZXJMYXllciIsIl9pc1Zpc2libGVNYXBMYXllciIsImZpbHRlcnMiLCJmaWx0ZXJzU2VsZWN0b3IiLCJmaWx0ZXIiLCJmIiwidHlwZSIsIkZJTFRFUl9UWVBFUyIsInBvbHlnb24iLCJsYXllck9yZGVyU2VsZWN0b3IiLCJsYXllcnNUb1JlbmRlclNlbGVjdG9yIiwiZ2VuZXJhdGVNYXBib3hMYXllcnMiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJvbkxheWVyQ2xpY2siLCJjb2xvckRvbWFpbiIsImxheWVyQ29uZmlnQ2hhbmdlIiwibGF5ZXJJZCIsImluZGV4IiwibWFwSW5kZXgiLCJ0b2dnbGVMYXllckZvck1hcCIsInByZXZpb3VzTGF5ZXJzIiwiX3VwZGF0ZU1hcGJveExheWVycyIsIm9uTWFwU3R5bGVMb2FkZWQiLCJfbWFwIiwibWFwYm94IiwiZ2V0TWFwIiwib24iLCJfb25NYXBib3hTdHlsZVVwZGF0ZSIsIm9uTWFwUmVuZGVyIiwiZ2V0TWFwYm94UmVmIiwiZ2wiLCJsYXllckJsZW5kaW5nIiwiZXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJtZXNzYWdlIiwibm90aWZpY2F0aW9uSWQiLCJfZGVja0dMRXJyb3JzRWxhcHNlZCIsImxhc3RTaG93biIsIkRhdGUiLCJub3ciLCJUSFJPVFRMRV9OT1RJRklDQVRJT05fVElNRSIsInVpU3RhdGVBY3Rpb25zIiwiYWRkTm90aWZpY2F0aW9uIiwidmlld1N0YXRlIiwib25WaWV3U3RhdGVDaGFuZ2UiLCJtYXBTdGF0ZUFjdGlvbnMiLCJ1cGRhdGVNYXAiLCJwYW5lbElkIiwidG9nZ2xlTWFwQ29udHJvbCIsIl9kZWNrIiwib2ZmIiwib25EZWNrSW5pdGlhbGl6ZWQiLCJsYXllcnNUb1JlbmRlciIsIm1hcFN0YXRlIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsImRhdGFzZXRzIiwiaW50ZXJhY3Rpb25Db25maWciLCJtb3VzZVBvcyIsIm1vdXNlUG9zaXRpb24iLCJjb29yZGluYXRlIiwicGlubmVkIiwidG9vbHRpcCIsImxheWVySG92ZXJQcm9wIiwiY29tcGFyZU1vZGUiLCJjb25maWciLCJwaW5uZWRQb3NpdGlvbiIsImxheWVyUGlubmVkUHJvcCIsInZpZXdwb3J0IiwiV2ViTWVyY2F0b3JWaWV3cG9ydCIsImxuZ0xhdCIsIl9nZXRIb3ZlclhZIiwicHJpbWFyeURhdGEiLCJkYXRhIiwiY29tcGFyZVR5cGUiLCJjb21tb25Qcm9wIiwib25DbG9zZSIsIl9vbkNsb3NlTWFwUG9wb3ZlciIsIm1hcFciLCJ3aWR0aCIsIm1hcEgiLCJoZWlnaHQiLCJ6b29tIiwiY2FudmFzIiwidW5kZWZpbmVkIiwiZW5hYmxlZCIsInNjcmVlbkNvb3JkIiwicHJvamVjdCIsIngiLCJ5IiwibWFwU3R5bGUiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsIm1hcGJveEFwaVVybCIsImRlY2tHbExheWVycyIsImRlY2tHbFByb3BzIiwibGVuZ3RoIiwiZGF0YUxheWVycyIsInNsaWNlIiwicmV2ZXJzZSIsIm92ZXJsYXlUeXBlIiwiT1ZFUkxBWV9UWVBFIiwiZGVja2dsIiwib3ZlcmxheXMiLCJsYXllckNhbGxiYWNrcyIsIm9uU2V0TGF5ZXJEb21haW4iLCJ2YWwiLCJfb25MYXllclNldERvbWFpbiIsImxheWVyT3ZlcmxheSIsImNvbmNhdCIsInZpc2libGVMYXllckdyb3VwcyIsInB1c2giLCJUaHJlZURCdWlsZGluZ0xheWVyIiwidGhyZWVEQnVpbGRpbmdDb2xvciIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0RmlsbENvbG9yIiwiX29uQmVmb3JlUmVuZGVyIiwib25MYXllckhvdmVyIiwiX29uRGVja0Vycm9yIiwiY29tcCIsImRlY2siLCJfb25EZWNrSW5pdGlhbGl6ZWQiLCJtYXBib3hMYXllcnMiLCJtYXBib3hMYXllcnNTZWxlY3RvciIsIk9iamVjdCIsImtleXMiLCJpc1N0eWxlTG9hZGVkIiwiTWFwQ29tcG9uZW50IiwibWFwQ29udHJvbHMiLCJsb2NhbGUiLCJlZGl0b3IiLCJpc0V4cG9ydCIsImJvdHRvbU1hcFN0eWxlIiwibWFwUHJvcHMiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJvblZpZXdwb3J0Q2hhbmdlIiwiX29uVmlld3BvcnRDaGFuZ2UiLCJ0cmFuc2Zvcm1SZXF1ZXN0IiwiaXNFZGl0IiwibWFwRHJhdyIsImFjdGl2ZSIsImhhc0dlb2NvZGVyTGF5ZXIiLCJmaW5kIiwibCIsImRyYWdSb3RhdGUiLCJCb29sZWFuIiwicmVhZE9ubHkiLCJzY2FsZSIsImdlb2NvZGVyIiwidG9nZ2xlUGVyc3BlY3RpdmUiLCJ0b2dnbGVTcGxpdE1hcCIsIl9oYW5kbGVNYXBUb2dnbGVMYXllciIsIl90b2dnbGVNYXBDb250cm9sIiwic2V0RWRpdG9yTW9kZSIsInNldExvY2FsZSIsInRvZ2dsZUVkaXRvclZpc2liaWxpdHkiLCJfc2V0TWFwYm94TWFwIiwib25Nb3VzZU1vdmUiLCJfcmVuZGVyRGVja092ZXJsYXkiLCJfcmVuZGVyTWFwYm94T3ZlcmxheXMiLCJwb2x5Z29uRmlsdGVycyIsImRlbGV0ZUZlYXR1cmUiLCJzZXRTZWxlY3RlZEZlYXR1cmUiLCJzZXRGZWF0dXJlcyIsInNldFBvbHlnb25GaWx0ZXJMYXllciIsInZpc2libGUiLCJ0b3BNYXBTdHlsZSIsIl9yZW5kZXJNYXBQb3BvdmVyIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImFycmF5T2YiLCJhbnkiLCJib29sIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJudW1iZXIiLCJNYXBib3hHTE1hcCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBS0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLFNBQVMsR0FBRztBQUNoQkMsRUFBQUEsU0FBUyxFQUFFO0FBQ1RDLElBQUFBLE9BQU8sRUFBRSxjQURBO0FBRVRDLElBQUFBLFFBQVEsRUFBRTtBQUZELEdBREs7QUFLaEJDLEVBQUFBLEdBQUcsRUFBRTtBQUNIRCxJQUFBQSxRQUFRLEVBQUUsVUFEUDtBQUVIQyxJQUFBQSxHQUFHLEVBQUUsS0FGRjtBQUdIQyxJQUFBQSxhQUFhLEVBQUU7QUFIWjtBQUxXLENBQWxCO0FBWUEsSUFBTUMscUJBQXFCLEdBQUcsWUFBOUI7QUFDQSxJQUFNQyxlQUFlLEdBQUcsUUFBeEI7QUFDQSxJQUFNQyxtQkFBbUIsR0FBRyxDQUE1Qjs7QUFFQSxJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYztBQUFBLHNCQUNsQixnQ0FBQyxrQ0FBRCxxQkFDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsaUNBRUU7QUFDRSxJQUFBLFNBQVMsRUFBQyxvQkFEWjtBQUVFLElBQUEsTUFBTSxF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QUFZLENBQUNrTSxXQUFiLEdBQTJCLGNBQTNCO0FBRUEsU0FBT2xNLFlBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIGxpYnJhcmllc1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IE1hcGJveEdMTWFwIGZyb20gJ3JlYWN0LW1hcC1nbCc7XG5pbXBvcnQgRGVja0dMIGZyb20gJ0BkZWNrLmdsL3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBXZWJNZXJjYXRvclZpZXdwb3J0IGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuaW1wb3J0IHtlcnJvck5vdGlmaWNhdGlvbn0gZnJvbSAndXRpbHMvbm90aWZpY2F0aW9ucy11dGlscyc7XG5cbi8vIGNvbXBvbmVudHNcbmltcG9ydCBNYXBQb3BvdmVyRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlcic7XG5pbXBvcnQgTWFwQ29udHJvbEZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9tYXAvbWFwLWNvbnRyb2wnO1xuaW1wb3J0IHtTdHlsZWRNYXBDb250YWluZXIsIFN0eWxlZEF0dHJidXRpb259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IEVkaXRvckZhY3RvcnkgZnJvbSAnLi9lZGl0b3IvZWRpdG9yJztcblxuLy8gdXRpbHNcbmltcG9ydCB7Z2VuZXJhdGVNYXBib3hMYXllcnMsIHVwZGF0ZU1hcGJveExheWVyc30gZnJvbSAnbGF5ZXJzL21hcGJveC11dGlscyc7XG5pbXBvcnQge3NldExheWVyQmxlbmRpbmd9IGZyb20gJ3V0aWxzL2dsLXV0aWxzJztcbmltcG9ydCB7dHJhbnNmb3JtUmVxdWVzdH0gZnJvbSAndXRpbHMvbWFwLXN0eWxlLXV0aWxzL21hcGJveC11dGlscyc7XG5pbXBvcnQge2dldExheWVySG92ZXJQcm9wLCByZW5kZXJEZWNrR2xMYXllcn0gZnJvbSAndXRpbHMvbGF5ZXItdXRpbHMnO1xuXG4vLyBkZWZhdWx0LXNldHRpbmdzXG5pbXBvcnQgVGhyZWVEQnVpbGRpbmdMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzLzNkLWJ1aWxkaW5nLWxheWVyLzNkLWJ1aWxkaW5nLWxheWVyJztcbmltcG9ydCB7XG4gIEZJTFRFUl9UWVBFUyxcbiAgR0VPQ09ERVJfTEFZRVJfSUQsXG4gIFRIUk9UVExFX05PVElGSUNBVElPTl9USU1FXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7T1ZFUkxBWV9UWVBFfSBmcm9tICdsYXllcnMvYmFzZS1sYXllcic7XG5cbmltcG9ydCBFcnJvckJvdW5kYXJ5IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2Vycm9yLWJvdW5kYXJ5JztcblxuLyoqIEB0eXBlIHt7W2tleTogc3RyaW5nXTogUmVhY3QuQ1NTUHJvcGVydGllc319ICovXG5jb25zdCBNQVBfU1RZTEUgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gIH0sXG4gIHRvcDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogJzBweCcsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH1cbn07XG5cbmNvbnN0IE1BUEJPWEdMX1NUWUxFX1VQREFURSA9ICdzdHlsZS5sb2FkJztcbmNvbnN0IE1BUEJPWEdMX1JFTkRFUiA9ICdyZW5kZXInO1xuY29uc3QgVFJBTlNJVElPTl9EVVJBVElPTiA9IDA7XG5cbmNvbnN0IEF0dHJpYnV0aW9uID0gKCkgPT4gKFxuICA8U3R5bGVkQXR0cmJ1dGlvbj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImF0dHJpdGlvbi1sb2dvXCI+XG4gICAgICBCYXNlbWFwIGJ5OlxuICAgICAgPGFcbiAgICAgICAgY2xhc3NOYW1lPVwibWFwYm94Z2wtY3RybC1sb2dvXCJcbiAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJNYXBib3ggbG9nb1wiXG4gICAgICAvPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXR0cml0aW9uLWxpbmtcIj5cbiAgICAgIDxhIGhyZWY9XCJodHRwczovL2tlcGxlci5nbC9wb2xpY3kvXCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICDCqSBrZXBsZXIuZ2wgfHsnICd9XG4gICAgICA8L2E+XG4gICAgICA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9hYm91dC9tYXBzL1wiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIj5cbiAgICAgICAgwqkgTWFwYm94IHx7JyAnfVxuICAgICAgPC9hPlxuICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICDCqSBPcGVuU3RyZWV0TWFwIHx7JyAnfVxuICAgICAgPC9hPlxuICAgICAgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vbWFwLWZlZWRiYWNrL1wiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIj5cbiAgICAgICAgPHN0cm9uZz5JbXByb3ZlIHRoaXMgbWFwPC9zdHJvbmc+XG4gICAgICA8L2E+XG4gICAgPC9kaXY+XG4gIDwvU3R5bGVkQXR0cmJ1dGlvbj5cbik7XG5cbk1hcENvbnRhaW5lckZhY3RvcnkuZGVwcyA9IFtNYXBQb3BvdmVyRmFjdG9yeSwgTWFwQ29udHJvbEZhY3RvcnksIEVkaXRvckZhY3RvcnldO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNYXBDb250YWluZXJGYWN0b3J5KE1hcFBvcG92ZXIsIE1hcENvbnRyb2wsIEVkaXRvcikge1xuICBjbGFzcyBNYXBDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICAvLyByZXF1aXJlZFxuICAgICAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJCbGVuZGluZzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJPcmRlcjogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyRGF0YTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICBtYXBTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbWFwQ29udHJvbHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBtb3VzZVBvczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG1hcGJveEFwaVVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHZpc1N0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICB1aVN0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgICAvLyBvcHRpb25hbFxuICAgICAgcmVhZE9ubHk6IFByb3BUeXBlcy5ib29sLFxuICAgICAgaXNFeHBvcnQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgY2xpY2tlZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIGhvdmVySW5mbzogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIG1hcExheWVyczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIG9uTWFwVG9nZ2xlTGF5ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgb25NYXBTdHlsZUxvYWRlZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBvbk1hcFJlbmRlcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBnZXRNYXBib3hSZWY6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgaW5kZXg6IFByb3BUeXBlcy5udW1iZXJcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIE1hcENvbXBvbmVudDogTWFwYm94R0xNYXAsXG4gICAgICBkZWNrR2xQcm9wczoge30sXG4gICAgICBpbmRleDogMFxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICB0aGlzLnByZXZpb3VzTGF5ZXJzID0ge1xuICAgICAgICAvLyBbbGF5ZXJzLmlkXTogbWFwYm94TGF5ZXJDb25maWdcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX2RlY2sgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgLy8gdW5iaW5kIG1hcGJveGdsIGV2ZW50IGxpc3RlbmVyXG4gICAgICBpZiAodGhpcy5fbWFwKSB7XG4gICAgICAgIHRoaXMuX21hcC5vZmYoTUFQQk9YR0xfU1RZTEVfVVBEQVRFKTtcbiAgICAgICAgdGhpcy5fbWFwLm9mZihNQVBCT1hHTF9SRU5ERVIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxheWVyc1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJzO1xuICAgIGxheWVyRGF0YVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJEYXRhO1xuICAgIG1hcExheWVyc1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubWFwTGF5ZXJzO1xuICAgIGxheWVyT3JkZXJTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxheWVyT3JkZXI7XG4gICAgbGF5ZXJzVG9SZW5kZXJTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5sYXllcnNTZWxlY3RvcixcbiAgICAgIHRoaXMubGF5ZXJEYXRhU2VsZWN0b3IsXG4gICAgICB0aGlzLm1hcExheWVyc1NlbGVjdG9yLFxuICAgICAgLy8ge1tpZF06IHRydWUgXFwgZmFsc2V9XG4gICAgICAobGF5ZXJzLCBsYXllckRhdGEsIG1hcExheWVycykgPT5cbiAgICAgICAgbGF5ZXJzLnJlZHVjZShcbiAgICAgICAgICAoYWNjdSwgbGF5ZXIsIGlkeCkgPT4gKHtcbiAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICBbbGF5ZXIuaWRdOlxuICAgICAgICAgICAgICBsYXllci5pZCAhPT0gR0VPQ09ERVJfTEFZRVJfSUQgJiZcbiAgICAgICAgICAgICAgbGF5ZXIuc2hvdWxkUmVuZGVyTGF5ZXIobGF5ZXJEYXRhW2lkeF0pICYmXG4gICAgICAgICAgICAgIHRoaXMuX2lzVmlzaWJsZU1hcExheWVyKGxheWVyLCBtYXBMYXllcnMpXG4gICAgICAgICAgfSksXG4gICAgICAgICAge31cbiAgICAgICAgKVxuICAgICk7XG5cbiAgICBmaWx0ZXJzU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWx0ZXJzO1xuICAgIHBvbHlnb25GaWx0ZXJzID0gY3JlYXRlU2VsZWN0b3IodGhpcy5maWx0ZXJzU2VsZWN0b3IsIGZpbHRlcnMgPT5cbiAgICAgIGZpbHRlcnMuZmlsdGVyKGYgPT4gZi50eXBlID09PSBGSUxURVJfVFlQRVMucG9seWdvbilcbiAgICApO1xuXG4gICAgbWFwYm94TGF5ZXJzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMubGF5ZXJzU2VsZWN0b3IsXG4gICAgICB0aGlzLmxheWVyRGF0YVNlbGVjdG9yLFxuICAgICAgdGhpcy5sYXllck9yZGVyU2VsZWN0b3IsXG4gICAgICB0aGlzLmxheWVyc1RvUmVuZGVyU2VsZWN0b3IsXG4gICAgICBnZW5lcmF0ZU1hcGJveExheWVyc1xuICAgICk7XG5cbiAgICAvKiBjb21wb25lbnQgcHJpdmF0ZSBmdW5jdGlvbnMgKi9cbiAgICBfaXNWaXNpYmxlTWFwTGF5ZXIobGF5ZXIsIG1hcExheWVycykge1xuICAgICAgLy8gaWYgbGF5ZXIuaWQgaXMgbm90IGluIG1hcExheWVycywgZG9uJ3QgcmVuZGVyIGl0XG4gICAgICByZXR1cm4gIW1hcExheWVycyB8fCAobWFwTGF5ZXJzICYmIG1hcExheWVyc1tsYXllci5pZF0pO1xuICAgIH1cblxuICAgIF9vbkNsb3NlTWFwUG9wb3ZlciA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLm9uTGF5ZXJDbGljayhudWxsKTtcbiAgICB9O1xuXG4gICAgX29uTGF5ZXJTZXREb21haW4gPSAoaWR4LCBjb2xvckRvbWFpbikgPT4ge1xuICAgICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMubGF5ZXJDb25maWdDaGFuZ2UodGhpcy5wcm9wcy5sYXllcnNbaWR4XSwge1xuICAgICAgICBjb2xvckRvbWFpblxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9oYW5kbGVNYXBUb2dnbGVMYXllciA9IGxheWVySWQgPT4ge1xuICAgICAgY29uc3Qge2luZGV4OiBtYXBJbmRleCA9IDAsIHZpc1N0YXRlQWN0aW9uc30gPSB0aGlzLnByb3BzO1xuICAgICAgdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUxheWVyRm9yTWFwKG1hcEluZGV4LCBsYXllcklkKTtcbiAgICB9O1xuXG4gICAgX29uTWFwYm94U3R5bGVVcGRhdGUgPSAoKSA9PiB7XG4gICAgICAvLyBmb3JjZSByZWZyZXNoIG1hcGJveGdsIGxheWVyc1xuICAgICAgdGhpcy5wcmV2aW91c0xheWVycyA9IHt9O1xuICAgICAgdGhpcy5fdXBkYXRlTWFwYm94TGF5ZXJzKCk7XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5vbk1hcFN0eWxlTG9hZGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25NYXBTdHlsZUxvYWRlZCh0aGlzLl9tYXApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfc2V0TWFwYm94TWFwID0gbWFwYm94ID0+IHtcbiAgICAgIGlmICghdGhpcy5fbWFwICYmIG1hcGJveCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBtYXBib3guZ2V0TWFwKCk7XG4gICAgICAgIC8vIGkgbm90aWNlZCBpbiBjZXJ0YWluIGNvbnRleHQgd2UgZG9uJ3QgYWNjZXNzIHRoZSBhY3R1YWwgbWFwIGVsZW1lbnRcbiAgICAgICAgaWYgKCF0aGlzLl9tYXApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gYmluZCBtYXBib3hnbCBldmVudCBsaXN0ZW5lclxuICAgICAgICB0aGlzLl9tYXAub24oTUFQQk9YR0xfU1RZTEVfVVBEQVRFLCB0aGlzLl9vbk1hcGJveFN0eWxlVXBkYXRlKTtcblxuICAgICAgICB0aGlzLl9tYXAub24oTUFQQk9YR0xfUkVOREVSLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uTWFwUmVuZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uTWFwUmVuZGVyKHRoaXMuX21hcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJvcHMuZ2V0TWFwYm94UmVmKSB7XG4gICAgICAgIC8vIFRoZSBwYXJlbnQgY29tcG9uZW50IGNhbiBnYWluIGFjY2VzcyB0byBvdXIgTWFwYm94R2xNYXAgYnlcbiAgICAgICAgLy8gcHJvdmlkaW5nIHRoaXMgY2FsbGJhY2suIE5vdGUgdGhhdCAnbWFwYm94JyB3aWxsIGJlIG51bGwgd2hlbiB0aGVcbiAgICAgICAgLy8gcmVmIGlzIHVuc2V0IChlLmcuIHdoZW4gYSBzcGxpdCBtYXAgaXMgY2xvc2VkKS5cbiAgICAgICAgdGhpcy5wcm9wcy5nZXRNYXBib3hSZWYobWFwYm94LCB0aGlzLnByb3BzLmluZGV4KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX29uRGVja0luaXRpYWxpemVkKGdsKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkRlY2tJbml0aWFsaXplZCkge1xuICAgICAgICB0aGlzLnByb3BzLm9uRGVja0luaXRpYWxpemVkKHRoaXMuX2RlY2ssIGdsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25CZWZvcmVSZW5kZXIgPSAoe2dsfSkgPT4ge1xuICAgICAgc2V0TGF5ZXJCbGVuZGluZyhnbCwgdGhpcy5wcm9wcy5sYXllckJsZW5kaW5nKTtcbiAgICB9O1xuXG4gICAgX29uRGVja0Vycm9yID0gKGVycm9yLCBsYXllcikgPT4ge1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYEFuIGVycm9yIGluIGRlY2suZ2w6ICR7ZXJyb3IubWVzc2FnZX0gaW4gJHtsYXllci5pZH1gO1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uSWQgPSBgJHtsYXllci5pZH0tJHtlcnJvci5tZXNzYWdlfWA7XG5cbiAgICAgIC8vIFRocm90dGxlIGVycm9yIG5vdGlmaWNhdGlvbnMsIGFzIFJlYWN0IGRvZXNuJ3QgbGlrZSB0b28gbWFueSBzdGF0ZSBjaGFuZ2VzIGZyb20gaGVyZS5cbiAgICAgIHRoaXMuX2RlY2tHTEVycm9yc0VsYXBzZWQgPSB0aGlzLl9kZWNrR0xFcnJvcnNFbGFwc2VkIHx8IHt9O1xuICAgICAgY29uc3QgbGFzdFNob3duID0gdGhpcy5fZGVja0dMRXJyb3JzRWxhcHNlZFtub3RpZmljYXRpb25JZF07XG4gICAgICBpZiAoIWxhc3RTaG93biB8fCBsYXN0U2hvd24gPCBEYXRlLm5vdygpIC0gVEhST1RUTEVfTk9USUZJQ0FUSU9OX1RJTUUpIHtcbiAgICAgICAgdGhpcy5fZGVja0dMRXJyb3JzRWxhcHNlZFtub3RpZmljYXRpb25JZF0gPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZXJyb3Igbm90aWZpY2F0aW9uIG9yIHVwZGF0ZSBleGlzdGluZyBvbmUgd2l0aCBzYW1lIGlkLlxuICAgICAgICAvLyBVcGRhdGUgaXMgcmVxdWlyZWQgdG8gcHJlc2VydmUgdGhlIG9yZGVyIG9mIG5vdGlmaWNhdGlvbnMgYXMgdGhleSBwcm9iYWJseSBhcmUgZ29pbmcgdG8gXCJqdW1wXCIgYmFzZWQgb24gb3JkZXIgb2YgZXJyb3JzLlxuICAgICAgICBjb25zdCB7dWlTdGF0ZUFjdGlvbnN9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgdWlTdGF0ZUFjdGlvbnMuYWRkTm90aWZpY2F0aW9uKFxuICAgICAgICAgIGVycm9yTm90aWZpY2F0aW9uKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgICAgIGlkOiBub3RpZmljYXRpb25JZFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qIGNvbXBvbmVudCByZW5kZXIgZnVuY3Rpb25zICovXG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG4gICAgX3JlbmRlck1hcFBvcG92ZXIobGF5ZXJzVG9SZW5kZXIpIHtcbiAgICAgIC8vIFRPRE86IG1vdmUgdGhpcyBpbnRvIHJlZHVjZXIgc28gaXQgY2FuIGJlIHRlc3RlZFxuICAgICAgY29uc3Qge1xuICAgICAgICBtYXBTdGF0ZSxcbiAgICAgICAgaG92ZXJJbmZvLFxuICAgICAgICBjbGlja2VkLFxuICAgICAgICBkYXRhc2V0cyxcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAgIGxheWVycyxcbiAgICAgICAgbW91c2VQb3M6IHttb3VzZVBvc2l0aW9uLCBjb29yZGluYXRlLCBwaW5uZWR9XG4gICAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgaWYgKCFtb3VzZVBvc2l0aW9uIHx8ICFpbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsYXllckhvdmVyUHJvcCA9IGdldExheWVySG92ZXJQcm9wKHtcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAgIGhvdmVySW5mbyxcbiAgICAgICAgbGF5ZXJzLFxuICAgICAgICBsYXllcnNUb1JlbmRlcixcbiAgICAgICAgZGF0YXNldHNcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb21wYXJlTW9kZSA9IGludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnXG4gICAgICAgID8gaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuY29tcGFyZU1vZGVcbiAgICAgICAgOiBmYWxzZTtcblxuICAgICAgbGV0IHBpbm5lZFBvc2l0aW9uID0ge307XG4gICAgICBsZXQgbGF5ZXJQaW5uZWRQcm9wID0gbnVsbDtcbiAgICAgIGlmIChwaW5uZWQgfHwgY2xpY2tlZCkge1xuICAgICAgICAvLyBwcm9qZWN0IGxuZ2xhdCB0byBzY3JlZW4gc28gdGhhdCB0b29sdGlwIGZvbGxvd3MgdGhlIG9iamVjdCBvbiB6b29tXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0ID0gbmV3IFdlYk1lcmNhdG9yVmlld3BvcnQobWFwU3RhdGUpO1xuICAgICAgICBjb25zdCBsbmdMYXQgPSBjbGlja2VkID8gY2xpY2tlZC5sbmdMYXQgOiBwaW5uZWQuY29vcmRpbmF0ZTtcbiAgICAgICAgcGlubmVkUG9zaXRpb24gPSB0aGlzLl9nZXRIb3ZlclhZKHZpZXdwb3J0LCBsbmdMYXQpO1xuICAgICAgICBsYXllclBpbm5lZFByb3AgPSBnZXRMYXllckhvdmVyUHJvcCh7XG4gICAgICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAgICAgaG92ZXJJbmZvOiBjbGlja2VkLFxuICAgICAgICAgIGxheWVycyxcbiAgICAgICAgICBsYXllcnNUb1JlbmRlcixcbiAgICAgICAgICBkYXRhc2V0c1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGxheWVySG92ZXJQcm9wICYmIGxheWVyUGlubmVkUHJvcCkge1xuICAgICAgICAgIGxheWVySG92ZXJQcm9wLnByaW1hcnlEYXRhID0gbGF5ZXJQaW5uZWRQcm9wLmRhdGE7XG4gICAgICAgICAgbGF5ZXJIb3ZlclByb3AuY29tcGFyZVR5cGUgPSBpbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLmNvbmZpZy5jb21wYXJlVHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBjb21tb25Qcm9wID0ge1xuICAgICAgICBvbkNsb3NlOiB0aGlzLl9vbkNsb3NlTWFwUG9wb3ZlcixcbiAgICAgICAgbWFwVzogbWFwU3RhdGUud2lkdGgsXG4gICAgICAgIG1hcEg6IG1hcFN0YXRlLmhlaWdodCxcbiAgICAgICAgem9vbTogbWFwU3RhdGUuem9vbSxcbiAgICAgICAgY29udGFpbmVyOiB0aGlzLl9kZWNrID8gdGhpcy5fZGVjay5jYW52YXMgOiB1bmRlZmluZWRcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxFcnJvckJvdW5kYXJ5PlxuICAgICAgICAgIHtsYXllclBpbm5lZFByb3AgJiYgKFxuICAgICAgICAgICAgPE1hcFBvcG92ZXJcbiAgICAgICAgICAgICAgey4uLnBpbm5lZFBvc2l0aW9ufVxuICAgICAgICAgICAgICB7Li4uY29tbW9uUHJvcH1cbiAgICAgICAgICAgICAgbGF5ZXJIb3ZlclByb3A9e2xheWVyUGlubmVkUHJvcH1cbiAgICAgICAgICAgICAgY29vcmRpbmF0ZT17aW50ZXJhY3Rpb25Db25maWcuY29vcmRpbmF0ZS5lbmFibGVkICYmIChwaW5uZWQgfHwge30pLmNvb3JkaW5hdGV9XG4gICAgICAgICAgICAgIGZyb3plbj17dHJ1ZX1cbiAgICAgICAgICAgICAgaXNCYXNlPXtjb21wYXJlTW9kZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7bGF5ZXJIb3ZlclByb3AgJiYgKCFsYXllclBpbm5lZFByb3AgfHwgY29tcGFyZU1vZGUpICYmIChcbiAgICAgICAgICAgIDxNYXBQb3BvdmVyXG4gICAgICAgICAgICAgIHg9e21vdXNlUG9zaXRpb25bMF19XG4gICAgICAgICAgICAgIHk9e21vdXNlUG9zaXRpb25bMV19XG4gICAgICAgICAgICAgIHsuLi5jb21tb25Qcm9wfVxuICAgICAgICAgICAgICBsYXllckhvdmVyUHJvcD17bGF5ZXJIb3ZlclByb3B9XG4gICAgICAgICAgICAgIGZyb3plbj17ZmFsc2V9XG4gICAgICAgICAgICAgIGNvb3JkaW5hdGU9e2ludGVyYWN0aW9uQ29uZmlnLmNvb3JkaW5hdGUuZW5hYmxlZCAmJiBjb29yZGluYXRlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L0Vycm9yQm91bmRhcnk+XG4gICAgICApO1xuICAgIH1cblxuICAgIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gICAgX2dldEhvdmVyWFkodmlld3BvcnQsIGxuZ0xhdCkge1xuICAgICAgY29uc3Qgc2NyZWVuQ29vcmQgPSAhdmlld3BvcnQgfHwgIWxuZ0xhdCA/IG51bGwgOiB2aWV3cG9ydC5wcm9qZWN0KGxuZ0xhdCk7XG4gICAgICByZXR1cm4gc2NyZWVuQ29vcmQgJiYge3g6IHNjcmVlbkNvb3JkWzBdLCB5OiBzY3JlZW5Db29yZFsxXX07XG4gICAgfVxuXG4gICAgX3JlbmRlckRlY2tPdmVybGF5KGxheWVyc1RvUmVuZGVyKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBtYXBTdHlsZSxcbiAgICAgICAgbGF5ZXJEYXRhLFxuICAgICAgICBsYXllck9yZGVyLFxuICAgICAgICBsYXllcnMsXG4gICAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW4sXG4gICAgICAgIG1hcGJveEFwaVVybFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIC8vIGluaXRpYWxpc2UgbGF5ZXJzIGZyb20gcHJvcHMgaWYgZXhpc3RzXG4gICAgICBsZXQgZGVja0dsTGF5ZXJzID0gdGhpcy5wcm9wcy5kZWNrR2xQcm9wcz8ubGF5ZXJzIHx8IFtdO1xuXG4gICAgICAvLyB3YWl0IHVudGlsIGRhdGEgaXMgcmVhZHkgYmVmb3JlIHJlbmRlciBkYXRhIGxheWVyc1xuICAgICAgaWYgKGxheWVyRGF0YSAmJiBsYXllckRhdGEubGVuZ3RoKSB7XG4gICAgICAgIC8vIGxhc3QgbGF5ZXIgcmVuZGVyIGZpcnN0XG4gICAgICAgIGNvbnN0IGRhdGFMYXllcnMgPSBsYXllck9yZGVyXG4gICAgICAgICAgLnNsaWNlKClcbiAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgIGlkeCA9PiBsYXllcnNbaWR4XS5vdmVybGF5VHlwZSA9PT0gT1ZFUkxBWV9UWVBFLmRlY2tnbCAmJiBsYXllcnNUb1JlbmRlcltsYXllcnNbaWR4XS5pZF1cbiAgICAgICAgICApXG4gICAgICAgICAgLnJlZHVjZSgob3ZlcmxheXMsIGlkeCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGF5ZXJDYWxsYmFja3MgPSB7XG4gICAgICAgICAgICAgIG9uU2V0TGF5ZXJEb21haW46IHZhbCA9PiB0aGlzLl9vbkxheWVyU2V0RG9tYWluKGlkeCwgdmFsKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGxheWVyT3ZlcmxheSA9IHJlbmRlckRlY2tHbExheWVyKHRoaXMucHJvcHMsIGxheWVyQ2FsbGJhY2tzLCBpZHgpO1xuICAgICAgICAgICAgcmV0dXJuIG92ZXJsYXlzLmNvbmNhdChsYXllck92ZXJsYXkgfHwgW10pO1xuICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgZGVja0dsTGF5ZXJzID0gZGVja0dsTGF5ZXJzLmNvbmNhdChkYXRhTGF5ZXJzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1hcFN0eWxlLnZpc2libGVMYXllckdyb3Vwc1snM2QgYnVpbGRpbmcnXSkge1xuICAgICAgICBkZWNrR2xMYXllcnMucHVzaChcbiAgICAgICAgICBuZXcgVGhyZWVEQnVpbGRpbmdMYXllcih7XG4gICAgICAgICAgICBpZDogJ19rZXBsZXJnbF8zZC1idWlsZGluZycsXG4gICAgICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgICAgIG1hcGJveEFwaVVybCxcbiAgICAgICAgICAgIHRocmVlREJ1aWxkaW5nQ29sb3I6IG1hcFN0eWxlLnRocmVlREJ1aWxkaW5nQ29sb3IsXG4gICAgICAgICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICAgICAgICBnZXRGaWxsQ29sb3I6IG1hcFN0eWxlLnRocmVlREJ1aWxkaW5nQ29sb3JcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGVja0dMXG4gICAgICAgICAgey4uLnRoaXMucHJvcHMuZGVja0dsUHJvcHN9XG4gICAgICAgICAgdmlld1N0YXRlPXttYXBTdGF0ZX1cbiAgICAgICAgICBpZD1cImRlZmF1bHQtZGVja2dsLW92ZXJsYXlcIlxuICAgICAgICAgIGxheWVycz17ZGVja0dsTGF5ZXJzfVxuICAgICAgICAgIG9uQmVmb3JlUmVuZGVyPXt0aGlzLl9vbkJlZm9yZVJlbmRlcn1cbiAgICAgICAgICBvbkhvdmVyPXt2aXNTdGF0ZUFjdGlvbnMub25MYXllckhvdmVyfVxuICAgICAgICAgIG9uQ2xpY2s9e3Zpc1N0YXRlQWN0aW9ucy5vbkxheWVyQ2xpY2t9XG4gICAgICAgICAgb25FcnJvcj17dGhpcy5fb25EZWNrRXJyb3J9XG4gICAgICAgICAgcmVmPXtjb21wID0+IHtcbiAgICAgICAgICAgIGlmIChjb21wICYmIGNvbXAuZGVjayAmJiAhdGhpcy5fZGVjaykge1xuICAgICAgICAgICAgICB0aGlzLl9kZWNrID0gY29tcC5kZWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25XZWJHTEluaXRpYWxpemVkPXtnbCA9PiB0aGlzLl9vbkRlY2tJbml0aWFsaXplZChnbCl9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIF91cGRhdGVNYXBib3hMYXllcnMoKSB7XG4gICAgICBjb25zdCBtYXBib3hMYXllcnMgPSB0aGlzLm1hcGJveExheWVyc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgICAgaWYgKCFPYmplY3Qua2V5cyhtYXBib3hMYXllcnMpLmxlbmd0aCAmJiAhT2JqZWN0LmtleXModGhpcy5wcmV2aW91c0xheWVycykubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlTWFwYm94TGF5ZXJzKHRoaXMuX21hcCwgbWFwYm94TGF5ZXJzLCB0aGlzLnByZXZpb3VzTGF5ZXJzKTtcblxuICAgICAgdGhpcy5wcmV2aW91c0xheWVycyA9IG1hcGJveExheWVycztcbiAgICB9XG5cbiAgICBfcmVuZGVyTWFwYm94T3ZlcmxheXMoKSB7XG4gICAgICBpZiAodGhpcy5fbWFwICYmIHRoaXMuX21hcC5pc1N0eWxlTG9hZGVkKCkpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlTWFwYm94TGF5ZXJzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVmlld3BvcnRDaGFuZ2UgPSB2aWV3U3RhdGUgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uVmlld1N0YXRlQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25WaWV3U3RhdGVDaGFuZ2Uodmlld1N0YXRlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvcHMubWFwU3RhdGVBY3Rpb25zLnVwZGF0ZU1hcCh2aWV3U3RhdGUpO1xuICAgIH07XG5cbiAgICBfdG9nZ2xlTWFwQ29udHJvbCA9IHBhbmVsSWQgPT4ge1xuICAgICAgY29uc3Qge2luZGV4LCB1aVN0YXRlQWN0aW9uc30gPSB0aGlzLnByb3BzO1xuXG4gICAgICB1aVN0YXRlQWN0aW9ucy50b2dnbGVNYXBDb250cm9sKHBhbmVsSWQsIGluZGV4KTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBtYXBTdGF0ZSxcbiAgICAgICAgbWFwU3R5bGUsXG4gICAgICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICAgICAgbWFwTGF5ZXJzLFxuICAgICAgICBsYXllcnMsXG4gICAgICAgIE1hcENvbXBvbmVudCxcbiAgICAgICAgZGF0YXNldHMsXG4gICAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgICAgICBtYXBib3hBcGlVcmwsXG4gICAgICAgIG1hcENvbnRyb2xzLFxuICAgICAgICBsb2NhbGUsXG4gICAgICAgIHVpU3RhdGVBY3Rpb25zLFxuICAgICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGluZGV4LFxuICAgICAgICBpc0V4cG9ydFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIGNvbnN0IGxheWVyc1RvUmVuZGVyID0gdGhpcy5sYXllcnNUb1JlbmRlclNlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgICBpZiAoIW1hcFN0eWxlLmJvdHRvbU1hcFN0eWxlKSB7XG4gICAgICAgIC8vIHN0eWxlIG5vdCB5ZXQgbG9hZGVkXG4gICAgICAgIHJldHVybiA8ZGl2IC8+O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBQcm9wcyA9IHtcbiAgICAgICAgLi4ubWFwU3RhdGUsXG4gICAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSxcbiAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW4sXG4gICAgICAgIG1hcGJveEFwaVVybCxcbiAgICAgICAgb25WaWV3cG9ydENoYW5nZTogdGhpcy5fb25WaWV3cG9ydENoYW5nZSxcbiAgICAgICAgdHJhbnNmb3JtUmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgY29uc3QgaXNFZGl0ID0gKG1hcENvbnRyb2xzLm1hcERyYXcgfHwge30pLmFjdGl2ZTtcblxuICAgICAgY29uc3QgaGFzR2VvY29kZXJMYXllciA9IGxheWVycy5maW5kKGwgPT4gbC5pZCA9PT0gR0VPQ09ERVJfTEFZRVJfSUQpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTWFwQ29udGFpbmVyIHN0eWxlPXtNQVBfU1RZTEUuY29udGFpbmVyfT5cbiAgICAgICAgICA8TWFwQ29udHJvbFxuICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgZHJhZ1JvdGF0ZT17bWFwU3RhdGUuZHJhZ1JvdGF0ZX1cbiAgICAgICAgICAgIGlzU3BsaXQ9e0Jvb2xlYW4obWFwTGF5ZXJzKX1cbiAgICAgICAgICAgIGlzRXhwb3J0PXtpc0V4cG9ydH1cbiAgICAgICAgICAgIGxheWVycz17bGF5ZXJzfVxuICAgICAgICAgICAgbGF5ZXJzVG9SZW5kZXI9e2xheWVyc1RvUmVuZGVyfVxuICAgICAgICAgICAgbWFwSW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgbWFwQ29udHJvbHM9e21hcENvbnRyb2xzfVxuICAgICAgICAgICAgcmVhZE9ubHk9e3RoaXMucHJvcHMucmVhZE9ubHl9XG4gICAgICAgICAgICBzY2FsZT17bWFwU3RhdGUuc2NhbGUgfHwgMX1cbiAgICAgICAgICAgIHRvcD17aW50ZXJhY3Rpb25Db25maWcuZ2VvY29kZXIgJiYgaW50ZXJhY3Rpb25Db25maWcuZ2VvY29kZXIuZW5hYmxlZCA/IDUyIDogMH1cbiAgICAgICAgICAgIGVkaXRvcj17ZWRpdG9yfVxuICAgICAgICAgICAgbG9jYWxlPXtsb2NhbGV9XG4gICAgICAgICAgICBvblRvZ2dsZVBlcnNwZWN0aXZlPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlUGVyc3BlY3RpdmV9XG4gICAgICAgICAgICBvblRvZ2dsZVNwbGl0TWFwPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlU3BsaXRNYXB9XG4gICAgICAgICAgICBvbk1hcFRvZ2dsZUxheWVyPXt0aGlzLl9oYW5kbGVNYXBUb2dnbGVMYXllcn1cbiAgICAgICAgICAgIG9uVG9nZ2xlTWFwQ29udHJvbD17dGhpcy5fdG9nZ2xlTWFwQ29udHJvbH1cbiAgICAgICAgICAgIG9uU2V0RWRpdG9yTW9kZT17dmlzU3RhdGVBY3Rpb25zLnNldEVkaXRvck1vZGV9XG4gICAgICAgICAgICBvblNldExvY2FsZT17dWlTdGF0ZUFjdGlvbnMuc2V0TG9jYWxlfVxuICAgICAgICAgICAgb25Ub2dnbGVFZGl0b3JWaXNpYmlsaXR5PXt2aXNTdGF0ZUFjdGlvbnMudG9nZ2xlRWRpdG9yVmlzaWJpbGl0eX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxNYXBDb21wb25lbnRcbiAgICAgICAgICAgIHsuLi5tYXBQcm9wc31cbiAgICAgICAgICAgIGtleT1cImJvdHRvbVwiXG4gICAgICAgICAgICByZWY9e3RoaXMuX3NldE1hcGJveE1hcH1cbiAgICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS5ib3R0b21NYXBTdHlsZX1cbiAgICAgICAgICAgIGdldEN1cnNvcj17dGhpcy5wcm9wcy5ob3ZlckluZm8gPyAoKSA9PiAncG9pbnRlcicgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb249e1RSQU5TSVRJT05fRFVSQVRJT059XG4gICAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMub25Nb3VzZU1vdmV9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuX3JlbmRlckRlY2tPdmVybGF5KGxheWVyc1RvUmVuZGVyKX1cbiAgICAgICAgICAgIHt0aGlzLl9yZW5kZXJNYXBib3hPdmVybGF5cygpfVxuICAgICAgICAgICAgPEVkaXRvclxuICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgZWRpdG9yPXtlZGl0b3J9XG4gICAgICAgICAgICAgIGZpbHRlcnM9e3RoaXMucG9seWdvbkZpbHRlcnModGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgIGlzRW5hYmxlZD17aXNFZGl0fVxuICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgbGF5ZXJzVG9SZW5kZXI9e2xheWVyc1RvUmVuZGVyfVxuICAgICAgICAgICAgICBvbkRlbGV0ZUZlYXR1cmU9e3Zpc1N0YXRlQWN0aW9ucy5kZWxldGVGZWF0dXJlfVxuICAgICAgICAgICAgICBvblNlbGVjdD17dmlzU3RhdGVBY3Rpb25zLnNldFNlbGVjdGVkRmVhdHVyZX1cbiAgICAgICAgICAgICAgb25VcGRhdGU9e3Zpc1N0YXRlQWN0aW9ucy5zZXRGZWF0dXJlc31cbiAgICAgICAgICAgICAgb25Ub2dnbGVQb2x5Z29uRmlsdGVyPXt2aXNTdGF0ZUFjdGlvbnMuc2V0UG9seWdvbkZpbHRlckxheWVyfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6IGlzRWRpdCA/ICdhbGwnIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGVkaXRvci52aXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJ1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L01hcENvbXBvbmVudD5cbiAgICAgICAgICB7bWFwU3R5bGUudG9wTWFwU3R5bGUgfHwgaGFzR2VvY29kZXJMYXllciA/IChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e01BUF9TVFlMRS50b3B9PlxuICAgICAgICAgICAgICA8TWFwQ29tcG9uZW50IHsuLi5tYXBQcm9wc30ga2V5PVwidG9wXCIgbWFwU3R5bGU9e21hcFN0eWxlLnRvcE1hcFN0eWxlfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5fcmVuZGVyRGVja092ZXJsYXkoe1tHRU9DT0RFUl9MQVlFUl9JRF06IHRydWV9KX1cbiAgICAgICAgICAgICAgPC9NYXBDb21wb25lbnQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7dGhpcy5fcmVuZGVyTWFwUG9wb3ZlcihsYXllcnNUb1JlbmRlcil9XG4gICAgICAgICAgPEF0dHJpYnV0aW9uIC8+XG4gICAgICAgIDwvU3R5bGVkTWFwQ29udGFpbmVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBNYXBDb250YWluZXIuZGlzcGxheU5hbWUgPSAnTWFwQ29udGFpbmVyJztcblxuICByZXR1cm4gTWFwQ29udGFpbmVyO1xufVxuIl19