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

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMapGl = _interopRequireDefault(require("react-map-gl"));

var _react2 = _interopRequireDefault(require("@deck.gl/react"));

var _reselect = require("reselect");

var _viewportMercatorProject = _interopRequireDefault(require("viewport-mercator-project"));

var _mapPopover = _interopRequireDefault(require("./map/map-popover"));

var _mapControl = _interopRequireDefault(require("./map/map-control"));

var _styledComponents = require("./common/styled-components");

var _editor = _interopRequireDefault(require("./editor/editor"));

var _mapboxUtils = require("../layers/mapbox-utils");

var _baseLayer = require("../layers/base-layer");

var _glUtils = require("../utils/gl-utils");

var _mapboxUtils2 = require("../utils/map-style-utils/mapbox-utils");

var _dBuildingLayer = _interopRequireDefault(require("../deckgl-layers/3d-building-layer/3d-building-layer"));

var _defaultSettings = require("../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  return _react["default"].createElement(_styledComponents.StyledAttrbution, null, _react["default"].createElement("a", {
    href: "https://kepler.gl/policy/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\xA9 kepler.gl |", ' '), _react["default"].createElement("a", {
    href: "https://www.mapbox.com/about/maps/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\xA9 Mapbox |", ' '), _react["default"].createElement("a", {
    href: "http://www.openstreetmap.org/copyright",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\xA9 OpenStreetMap |", ' '), _react["default"].createElement("a", {
    href: "https://www.mapbox.com/map-feedback/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, _react["default"].createElement("strong", null, "Improve this map")));
};

MapContainerFactory.deps = [_mapPopover["default"], _mapControl["default"], _editor["default"]];

function MapContainerFactory(MapPopover, MapControl, Editor) {
  var MapContainer =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(MapContainer, _Component);

    function MapContainer(_props) {
      var _this;

      (0, _classCallCheck2["default"])(this, MapContainer);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MapContainer).call(this, _props));
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
          return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, layer.id, layer.shouldRenderLayer(layerData[idx]) && _this._isVisibleMapLayer(layer, mapLayers)));
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
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_renderLayer", function (overlays, idx) {
        var _this$props2 = _this.props,
            datasets = _this$props2.datasets,
            layers = _this$props2.layers,
            layerData = _this$props2.layerData,
            hoverInfo = _this$props2.hoverInfo,
            clicked = _this$props2.clicked,
            mapState = _this$props2.mapState,
            interactionConfig = _this$props2.interactionConfig,
            animationConfig = _this$props2.animationConfig;
        var layer = layers[idx];
        var data = layerData[idx];

        var _ref2 = datasets[layer.config.dataId] || {},
            gpuFilter = _ref2.gpuFilter;

        var objectHovered = clicked || hoverInfo;
        var layerCallbacks = {
          onSetLayerDomain: function onSetLayerDomain(val) {
            return _this._onLayerSetDomain(idx, val);
          }
        }; // Layer is Layer class

        var layerOverlay = layer.renderLayer({
          data: data,
          gpuFilter: gpuFilter,
          idx: idx,
          interactionConfig: interactionConfig,
          layerCallbacks: layerCallbacks,
          mapState: mapState,
          animationConfig: animationConfig,
          objectHovered: objectHovered
        });
        return overlays.concat(layerOverlay || []);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onViewportChange", function (viewState) {
        if (typeof _this.props.onViewStateChange === 'function') {
          _this.props.onViewStateChange(viewState);
        }

        _this.props.mapStateActions.updateMap(viewState);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_toggleMapControl", function (panelId) {
        var _this$props3 = _this.props,
            index = _this$props3.index,
            uiStateActions = _this$props3.uiStateActions;
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

      /* component private functions */
      value: function _isVisibleMapLayer(layer, mapLayers) {
        // if layer.id is not in mapLayers, don't render it
        return !mapLayers || mapLayers && mapLayers[layer.id];
      }
    }, {
      key: "_renderMapPopover",

      /* component render functions */

      /* eslint-disable complexity */
      value: function _renderMapPopover(layersToRender) {
        // TODO: move this into reducer so it can be tested
        var _this$props4 = this.props,
            mapState = _this$props4.mapState,
            hoverInfo = _this$props4.hoverInfo,
            clicked = _this$props4.clicked,
            datasets = _this$props4.datasets,
            interactionConfig = _this$props4.interactionConfig,
            layers = _this$props4.layers,
            _this$props4$mousePos = _this$props4.mousePos,
            mousePosition = _this$props4$mousePos.mousePosition,
            coordinate = _this$props4$mousePos.coordinate,
            pinned = _this$props4$mousePos.pinned;

        if (!mousePosition) {
          return null;
        } // if clicked something, ignore hover behavior


        var objectInfo = clicked || hoverInfo;
        var layerHoverProp = null;
        var position = {
          x: mousePosition[0],
          y: mousePosition[1]
        };

        if (interactionConfig.tooltip.enabled && objectInfo && objectInfo.picked) {
          // if anything hovered
          var object = objectInfo.object,
              overlay = objectInfo.layer; // deckgl layer to kepler-gl layer

          var layer = layers[overlay.props.idx];

          if (layer.getHoverData && layersToRender[layer.id]) {
            // if layer is visible and have hovered data
            var dataId = layer.config.dataId;
            var _datasets$dataId = datasets[dataId],
                allData = _datasets$dataId.allData,
                fields = _datasets$dataId.fields;
            var data = layer.getHoverData(object, allData);
            var fieldsToShow = interactionConfig.tooltip.config.fieldsToShow[dataId];
            layerHoverProp = {
              data: data,
              fields: fields,
              fieldsToShow: fieldsToShow,
              layer: layer
            };
          }
        }

        if (pinned || clicked) {
          // project lnglat to screen so that tooltip follows the object on zoom
          var viewport = new _viewportMercatorProject["default"](mapState);
          var lngLat = clicked ? clicked.lngLat : pinned.coordinate;
          position = this._getHoverXY(viewport, lngLat);
        }

        return _react["default"].createElement("div", null, _react["default"].createElement(MapPopover, (0, _extends2["default"])({}, position, {
          layerHoverProp: layerHoverProp,
          coordinate: interactionConfig.coordinate.enabled && ((pinned || {}).coordinate || coordinate),
          freezed: Boolean(clicked || pinned),
          onClose: this._onCloseMapPopover,
          mapW: mapState.width,
          mapH: mapState.height
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
        var _this2 = this;

        var _this$props5 = this.props,
            mapState = _this$props5.mapState,
            mapStyle = _this$props5.mapStyle,
            layerData = _this$props5.layerData,
            layerOrder = _this$props5.layerOrder,
            layers = _this$props5.layers,
            visStateActions = _this$props5.visStateActions,
            mapboxApiAccessToken = _this$props5.mapboxApiAccessToken,
            mapboxApiUrl = _this$props5.mapboxApiUrl;
        var deckGlLayers = []; // wait until data is ready before render data layers

        if (layerData && layerData.length) {
          // last layer render first
          deckGlLayers = layerOrder.slice().reverse().filter(function (idx) {
            return layers[idx].overlayType === _baseLayer.OVERLAY_TYPE.deckgl && layersToRender[layers[idx].id];
          }).reduce(this._renderLayer, []);
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

        return _react["default"].createElement(_react2["default"], (0, _extends2["default"])({}, this.props.deckGlProps, {
          viewState: mapState,
          id: "default-deckgl-overlay",
          layers: deckGlLayers,
          onBeforeRender: this._onBeforeRender,
          onHover: visStateActions.onLayerHover,
          onClick: visStateActions.onLayerClick,
          ref: function ref(comp) {
            if (comp && comp.deck && !_this2._deck) {
              _this2._deck = comp.deck;
            }
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
        var _this$props6 = this.props,
            mapState = _this$props6.mapState,
            mapStyle = _this$props6.mapStyle,
            mapStateActions = _this$props6.mapStateActions,
            mapLayers = _this$props6.mapLayers,
            layers = _this$props6.layers,
            MapComponent = _this$props6.MapComponent,
            datasets = _this$props6.datasets,
            mapboxApiAccessToken = _this$props6.mapboxApiAccessToken,
            mapboxApiUrl = _this$props6.mapboxApiUrl,
            mapControls = _this$props6.mapControls,
            uiState = _this$props6.uiState,
            uiStateActions = _this$props6.uiStateActions,
            visStateActions = _this$props6.visStateActions,
            editor = _this$props6.editor,
            index = _this$props6.index;
        var layersToRender = this.layersToRenderSelector(this.props);

        if (!mapStyle.bottomMapStyle) {
          // style not yet loaded
          return _react["default"].createElement("div", null);
        }

        var mapProps = _objectSpread({}, mapState, {
          preserveDrawingBuffer: true,
          mapboxApiAccessToken: mapboxApiAccessToken,
          mapboxApiUrl: mapboxApiUrl,
          onViewportChange: this._onViewportChange,
          transformRequest: _mapboxUtils2.transformRequest
        });

        var isEdit = uiState.mapControls.mapDraw.active;
        return _react["default"].createElement(_styledComponents.StyledMapContainer, {
          style: MAP_STYLE.container
        }, _react["default"].createElement(MapControl, {
          datasets: datasets,
          dragRotate: mapState.dragRotate,
          isSplit: Boolean(mapLayers),
          isExport: this.props.isExport,
          layers: layers,
          layersToRender: layersToRender,
          mapIndex: index,
          mapControls: mapControls,
          readOnly: this.props.readOnly,
          scale: mapState.scale || 1,
          top: 0,
          editor: editor,
          locale: uiState.locale,
          onTogglePerspective: mapStateActions.togglePerspective,
          onToggleSplitMap: mapStateActions.toggleSplitMap,
          onMapToggleLayer: this._handleMapToggleLayer,
          onToggleMapControl: this._toggleMapControl,
          onSetEditorMode: visStateActions.setEditorMode,
          onSetLocale: uiStateActions.setLocale,
          onToggleEditorVisibility: visStateActions.toggleEditorVisibility
        }), _react["default"].createElement(MapComponent, (0, _extends2["default"])({}, mapProps, {
          key: "bottom",
          ref: this._setMapboxMap,
          mapStyle: mapStyle.bottomMapStyle,
          getCursor: this.props.hoverInfo ? function () {
            return 'pointer';
          } : undefined,
          transitionDuration: TRANSITION_DURATION,
          onMouseMove: this.props.visStateActions.onMouseMove
        }), this._renderDeckOverlay(layersToRender), this._renderMapboxOverlays(layersToRender), _react["default"].createElement(Editor, {
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
        })), mapStyle.topMapStyle && _react["default"].createElement("div", {
          style: MAP_STYLE.top
        }, _react["default"].createElement(MapComponent, (0, _extends2["default"])({}, mapProps, {
          key: "top",
          mapStyle: mapStyle.topMapStyle
        }))), this._renderMapPopover(layersToRender), _react["default"].createElement(Attribution, null));
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
    uiState: _propTypes["default"].object.isRequired,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiTUFQX1NUWUxFIiwiY29udGFpbmVyIiwiZGlzcGxheSIsInBvc2l0aW9uIiwidG9wIiwicG9pbnRlckV2ZW50cyIsIk1BUEJPWEdMX1NUWUxFX1VQREFURSIsIk1BUEJPWEdMX1JFTkRFUiIsIlRSQU5TSVRJT05fRFVSQVRJT04iLCJBdHRyaWJ1dGlvbiIsIk1hcENvbnRhaW5lckZhY3RvcnkiLCJkZXBzIiwiTWFwUG9wb3ZlckZhY3RvcnkiLCJNYXBDb250cm9sRmFjdG9yeSIsIkVkaXRvckZhY3RvcnkiLCJNYXBQb3BvdmVyIiwiTWFwQ29udHJvbCIsIkVkaXRvciIsIk1hcENvbnRhaW5lciIsInByb3BzIiwibGF5ZXJzIiwibGF5ZXJEYXRhIiwibWFwTGF5ZXJzIiwibGF5ZXJPcmRlciIsImxheWVyc1NlbGVjdG9yIiwibGF5ZXJEYXRhU2VsZWN0b3IiLCJtYXBMYXllcnNTZWxlY3RvciIsInJlZHVjZSIsImFjY3UiLCJsYXllciIsImlkeCIsImlkIiwic2hvdWxkUmVuZGVyTGF5ZXIiLCJfaXNWaXNpYmxlTWFwTGF5ZXIiLCJmaWx0ZXJzIiwiZmlsdGVyc1NlbGVjdG9yIiwiZmlsdGVyIiwiZiIsInR5cGUiLCJGSUxURVJfVFlQRVMiLCJwb2x5Z29uIiwibGF5ZXJPcmRlclNlbGVjdG9yIiwibGF5ZXJzVG9SZW5kZXJTZWxlY3RvciIsImdlbmVyYXRlTWFwYm94TGF5ZXJzIiwidmlzU3RhdGVBY3Rpb25zIiwib25MYXllckNsaWNrIiwiY29sb3JEb21haW4iLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVySWQiLCJpbmRleCIsIm1hcEluZGV4IiwidG9nZ2xlTGF5ZXJGb3JNYXAiLCJwcmV2aW91c0xheWVycyIsIl91cGRhdGVNYXBib3hMYXllcnMiLCJvbk1hcFN0eWxlTG9hZGVkIiwiX21hcCIsIm1hcGJveCIsImdldE1hcCIsIm9uIiwiX29uTWFwYm94U3R5bGVVcGRhdGUiLCJvbk1hcFJlbmRlciIsImdldE1hcGJveFJlZiIsImdsIiwibGF5ZXJCbGVuZGluZyIsIm92ZXJsYXlzIiwiZGF0YXNldHMiLCJob3ZlckluZm8iLCJjbGlja2VkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImFuaW1hdGlvbkNvbmZpZyIsImRhdGEiLCJjb25maWciLCJkYXRhSWQiLCJncHVGaWx0ZXIiLCJvYmplY3RIb3ZlcmVkIiwibGF5ZXJDYWxsYmFja3MiLCJvblNldExheWVyRG9tYWluIiwidmFsIiwiX29uTGF5ZXJTZXREb21haW4iLCJsYXllck92ZXJsYXkiLCJyZW5kZXJMYXllciIsImNvbmNhdCIsInZpZXdTdGF0ZSIsIm9uVmlld1N0YXRlQ2hhbmdlIiwibWFwU3RhdGVBY3Rpb25zIiwidXBkYXRlTWFwIiwicGFuZWxJZCIsInVpU3RhdGVBY3Rpb25zIiwidG9nZ2xlTWFwQ29udHJvbCIsIl9kZWNrIiwib2ZmIiwibGF5ZXJzVG9SZW5kZXIiLCJtb3VzZVBvcyIsIm1vdXNlUG9zaXRpb24iLCJjb29yZGluYXRlIiwicGlubmVkIiwib2JqZWN0SW5mbyIsImxheWVySG92ZXJQcm9wIiwieCIsInkiLCJ0b29sdGlwIiwiZW5hYmxlZCIsInBpY2tlZCIsIm9iamVjdCIsIm92ZXJsYXkiLCJnZXRIb3ZlckRhdGEiLCJhbGxEYXRhIiwiZmllbGRzIiwiZmllbGRzVG9TaG93Iiwidmlld3BvcnQiLCJXZWJNZXJjYXRvclZpZXdwb3J0IiwibG5nTGF0IiwiX2dldEhvdmVyWFkiLCJCb29sZWFuIiwiX29uQ2xvc2VNYXBQb3BvdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJzY3JlZW5Db29yZCIsInByb2plY3QiLCJtYXBTdHlsZSIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwibWFwYm94QXBpVXJsIiwiZGVja0dsTGF5ZXJzIiwibGVuZ3RoIiwic2xpY2UiLCJyZXZlcnNlIiwib3ZlcmxheVR5cGUiLCJPVkVSTEFZX1RZUEUiLCJkZWNrZ2wiLCJfcmVuZGVyTGF5ZXIiLCJ2aXNpYmxlTGF5ZXJHcm91cHMiLCJwdXNoIiwiVGhyZWVEQnVpbGRpbmdMYXllciIsInRocmVlREJ1aWxkaW5nQ29sb3IiLCJ1cGRhdGVUcmlnZ2VycyIsImdldEZpbGxDb2xvciIsImRlY2tHbFByb3BzIiwiX29uQmVmb3JlUmVuZGVyIiwib25MYXllckhvdmVyIiwiY29tcCIsImRlY2siLCJtYXBib3hMYXllcnMiLCJtYXBib3hMYXllcnNTZWxlY3RvciIsIk9iamVjdCIsImtleXMiLCJpc1N0eWxlTG9hZGVkIiwiTWFwQ29tcG9uZW50IiwibWFwQ29udHJvbHMiLCJ1aVN0YXRlIiwiZWRpdG9yIiwiYm90dG9tTWFwU3R5bGUiLCJtYXBQcm9wcyIsInByZXNlcnZlRHJhd2luZ0J1ZmZlciIsIm9uVmlld3BvcnRDaGFuZ2UiLCJfb25WaWV3cG9ydENoYW5nZSIsInRyYW5zZm9ybVJlcXVlc3QiLCJpc0VkaXQiLCJtYXBEcmF3IiwiYWN0aXZlIiwiZHJhZ1JvdGF0ZSIsImlzRXhwb3J0IiwicmVhZE9ubHkiLCJzY2FsZSIsImxvY2FsZSIsInRvZ2dsZVBlcnNwZWN0aXZlIiwidG9nZ2xlU3BsaXRNYXAiLCJfaGFuZGxlTWFwVG9nZ2xlTGF5ZXIiLCJfdG9nZ2xlTWFwQ29udHJvbCIsInNldEVkaXRvck1vZGUiLCJzZXRMb2NhbGUiLCJ0b2dnbGVFZGl0b3JWaXNpYmlsaXR5IiwiX3NldE1hcGJveE1hcCIsInVuZGVmaW5lZCIsIm9uTW91c2VNb3ZlIiwiX3JlbmRlckRlY2tPdmVybGF5IiwiX3JlbmRlck1hcGJveE92ZXJsYXlzIiwicG9seWdvbkZpbHRlcnMiLCJkZWxldGVGZWF0dXJlIiwic2V0U2VsZWN0ZWRGZWF0dXJlIiwic2V0RmVhdHVyZXMiLCJzZXRQb2x5Z29uRmlsdGVyTGF5ZXIiLCJ2aXNpYmxlIiwidG9wTWFwU3R5bGUiLCJfcmVuZGVyTWFwUG9wb3ZlciIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJhcnJheU9mIiwiYW55IiwiYm9vbCIsIm9uTWFwVG9nZ2xlTGF5ZXIiLCJmdW5jIiwibnVtYmVyIiwiTWFwYm94R0xNYXAiLCJkaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOztBQUNBOztBQUVBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLFNBQVMsRUFBRTtBQUNUQyxJQUFBQSxPQUFPLEVBQUUsY0FEQTtBQUVUQyxJQUFBQSxRQUFRLEVBQUU7QUFGRCxHQURLO0FBS2hCQyxFQUFBQSxHQUFHLEVBQUU7QUFDSEQsSUFBQUEsUUFBUSxFQUFFLFVBRFA7QUFFSEMsSUFBQUEsR0FBRyxFQUFFLEtBRkY7QUFHSEMsSUFBQUEsYUFBYSxFQUFFO0FBSFo7QUFMVyxDQUFsQjtBQVlBLElBQU1DLHFCQUFxQixHQUFHLFlBQTlCO0FBQ0EsSUFBTUMsZUFBZSxHQUFHLFFBQXhCO0FBQ0EsSUFBTUMsbUJBQW1CLEdBQUcsQ0FBNUI7O0FBRUEsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWM7QUFBQSxTQUNsQixnQ0FBQyxrQ0FBRCxRQUNFO0FBQUcsSUFBQSxJQUFJLEVBQUMsMkJBQVI7QUFBb0MsSUFBQSxNQUFNLEVBQUMsUUFBM0M7QUFBb0QsSUFBQSxHQUFHLEVBQUM7QUFBeEQseUJBQ2dCLEdBRGhCLENBREYsRUFJRTtBQUFHLElBQUEsSUFBSSxFQUFDLG9DQUFSO0FBQTZDLElBQUEsTUFBTSxFQUFDLFFBQXBEO0FBQTZELElBQUEsR0FBRyxFQUFDO0FBQWpFLHNCQUNhLEdBRGIsQ0FKRixFQU9FO0FBQUcsSUFBQSxJQUFJLEVBQUMsd0NBQVI7QUFBaUQsSUFBQSxNQUFNLEVBQUMsUUFBeEQ7QUFBaUUsSUFBQSxHQUFHLEVBQUM7QUFBckUsNkJBQ29CLEdBRHBCLENBUEYsRUFVRTtBQUFHLElBQUEsSUFBSSxFQUFDLHNDQUFS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RyxzQkFBVWxGLE1BQVYsQ0FBaUJtRixVQWxCaEI7QUFvQmpCO0FBQ0F6QixJQUFBQSxRQUFRLEVBQUV3QixzQkFBVUssSUFyQkg7QUFzQmpCOUIsSUFBQUEsUUFBUSxFQUFFeUIsc0JBQVVLLElBdEJIO0FBdUJqQjVILElBQUFBLE9BQU8sRUFBRXVILHNCQUFVbEYsTUF2QkY7QUF3QmpCdEMsSUFBQUEsU0FBUyxFQUFFd0gsc0JBQVVsRixNQXhCSjtBQXlCakJsRixJQUFBQSxTQUFTLEVBQUVvSyxzQkFBVWxGLE1BekJKO0FBMEJqQndGLElBQUFBLGdCQUFnQixFQUFFTixzQkFBVU8sSUExQlg7QUEyQmpCM0ksSUFBQUEsZ0JBQWdCLEVBQUVvSSxzQkFBVU8sSUEzQlg7QUE0QmpCckksSUFBQUEsV0FBVyxFQUFFOEgsc0JBQVVPLElBNUJOO0FBNkJqQnBJLElBQUFBLFlBQVksRUFBRTZILHNCQUFVTyxJQTdCUDtBQThCakJoSixJQUFBQSxLQUFLLEVBQUV5SSxzQkFBVVE7QUE5QkEsR0FGcUQ7QUFBQSxtQ0FDcEVoTCxZQURvRSxrQkFtQ2xEO0FBQ3BCaUksSUFBQUEsWUFBWSxFQUFFZ0Qsc0JBRE07QUFFcEIxRCxJQUFBQSxXQUFXLEVBQUUsRUFGTztBQUdwQnhGLElBQUFBLEtBQUssRUFBRTtBQUhhLEdBbkNrRDtBQXVjMUUvQixFQUFBQSxZQUFZLENBQUNrTCxXQUFiLEdBQTJCLGNBQTNCO0FBRUEsU0FBT2xMLFlBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIGxpYnJhcmllc1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IE1hcGJveEdMTWFwIGZyb20gJ3JlYWN0LW1hcC1nbCc7XG5pbXBvcnQgRGVja0dMIGZyb20gJ0BkZWNrLmdsL3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBXZWJNZXJjYXRvclZpZXdwb3J0IGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgTWFwUG9wb3ZlckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9tYXAvbWFwLXBvcG92ZXInO1xuaW1wb3J0IE1hcENvbnRyb2xGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvbWFwL21hcC1jb250cm9sJztcbmltcG9ydCB7U3R5bGVkTWFwQ29udGFpbmVyLCBTdHlsZWRBdHRyYnV0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBFZGl0b3JGYWN0b3J5IGZyb20gJy4vZWRpdG9yL2VkaXRvcic7XG5cbi8vIHV0aWxzXG5pbXBvcnQge2dlbmVyYXRlTWFwYm94TGF5ZXJzLCB1cGRhdGVNYXBib3hMYXllcnN9IGZyb20gJ2xheWVycy9tYXBib3gtdXRpbHMnO1xuaW1wb3J0IHtPVkVSTEFZX1RZUEV9IGZyb20gJ2xheWVycy9iYXNlLWxheWVyJztcbmltcG9ydCB7c2V0TGF5ZXJCbGVuZGluZ30gZnJvbSAndXRpbHMvZ2wtdXRpbHMnO1xuaW1wb3J0IHt0cmFuc2Zvcm1SZXF1ZXN0fSBmcm9tICd1dGlscy9tYXAtc3R5bGUtdXRpbHMvbWFwYm94LXV0aWxzJztcblxuLy8gZGVmYXVsdC1zZXR0aW5nc1xuaW1wb3J0IFRocmVlREJ1aWxkaW5nTGF5ZXIgZnJvbSAnZGVja2dsLWxheWVycy8zZC1idWlsZGluZy1sYXllci8zZC1idWlsZGluZy1sYXllcic7XG5pbXBvcnQge0ZJTFRFUl9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBNQVBfU1RZTEUgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gIH0sXG4gIHRvcDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogJzBweCcsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH1cbn07XG5cbmNvbnN0IE1BUEJPWEdMX1NUWUxFX1VQREFURSA9ICdzdHlsZS5sb2FkJztcbmNvbnN0IE1BUEJPWEdMX1JFTkRFUiA9ICdyZW5kZXInO1xuY29uc3QgVFJBTlNJVElPTl9EVVJBVElPTiA9IDA7XG5cbmNvbnN0IEF0dHJpYnV0aW9uID0gKCkgPT4gKFxuICA8U3R5bGVkQXR0cmJ1dGlvbj5cbiAgICA8YSBocmVmPVwiaHR0cHM6Ly9rZXBsZXIuZ2wvcG9saWN5L1wiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIj5cbiAgICAgIMKpIGtlcGxlci5nbCB8eycgJ31cbiAgICA8L2E+XG4gICAgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vYWJvdXQvbWFwcy9cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICDCqSBNYXBib3ggfHsnICd9XG4gICAgPC9hPlxuICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIj5cbiAgICAgIMKpIE9wZW5TdHJlZXRNYXAgfHsnICd9XG4gICAgPC9hPlxuICAgIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL21hcC1mZWVkYmFjay9cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICA8c3Ryb25nPkltcHJvdmUgdGhpcyBtYXA8L3N0cm9uZz5cbiAgICA8L2E+XG4gIDwvU3R5bGVkQXR0cmJ1dGlvbj5cbik7XG5cbk1hcENvbnRhaW5lckZhY3RvcnkuZGVwcyA9IFtNYXBQb3BvdmVyRmFjdG9yeSwgTWFwQ29udHJvbEZhY3RvcnksIEVkaXRvckZhY3RvcnldO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNYXBDb250YWluZXJGYWN0b3J5KE1hcFBvcG92ZXIsIE1hcENvbnRyb2wsIEVkaXRvcikge1xuICBjbGFzcyBNYXBDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICAvLyByZXF1aXJlZFxuICAgICAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJCbGVuZGluZzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJPcmRlcjogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyRGF0YTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICBtYXBTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbWFwQ29udHJvbHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIHVpU3RhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBtb3VzZVBvczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG1hcGJveEFwaVVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHZpc1N0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICB1aVN0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgICAvLyBvcHRpb25hbFxuICAgICAgcmVhZE9ubHk6IFByb3BUeXBlcy5ib29sLFxuICAgICAgaXNFeHBvcnQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgY2xpY2tlZDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIGhvdmVySW5mbzogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIG1hcExheWVyczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIG9uTWFwVG9nZ2xlTGF5ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgb25NYXBTdHlsZUxvYWRlZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBvbk1hcFJlbmRlcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBnZXRNYXBib3hSZWY6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgaW5kZXg6IFByb3BUeXBlcy5udW1iZXJcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIE1hcENvbXBvbmVudDogTWFwYm94R0xNYXAsXG4gICAgICBkZWNrR2xQcm9wczoge30sXG4gICAgICBpbmRleDogMFxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICB0aGlzLnByZXZpb3VzTGF5ZXJzID0ge1xuICAgICAgICAvLyBbbGF5ZXJzLmlkXTogbWFwYm94TGF5ZXJDb25maWdcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX2RlY2sgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgLy8gdW5iaW5kIG1hcGJveGdsIGV2ZW50IGxpc3RlbmVyXG4gICAgICBpZiAodGhpcy5fbWFwKSB7XG4gICAgICAgIHRoaXMuX21hcC5vZmYoTUFQQk9YR0xfU1RZTEVfVVBEQVRFKTtcbiAgICAgICAgdGhpcy5fbWFwLm9mZihNQVBCT1hHTF9SRU5ERVIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxheWVyc1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJzO1xuICAgIGxheWVyRGF0YVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJEYXRhO1xuICAgIG1hcExheWVyc1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubWFwTGF5ZXJzO1xuICAgIGxheWVyT3JkZXJTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxheWVyT3JkZXI7XG4gICAgbGF5ZXJzVG9SZW5kZXJTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5sYXllcnNTZWxlY3RvcixcbiAgICAgIHRoaXMubGF5ZXJEYXRhU2VsZWN0b3IsXG4gICAgICB0aGlzLm1hcExheWVyc1NlbGVjdG9yLFxuICAgICAgLy8ge1tpZF06IHRydWUgXFwgZmFsc2V9XG4gICAgICAobGF5ZXJzLCBsYXllckRhdGEsIG1hcExheWVycykgPT5cbiAgICAgICAgbGF5ZXJzLnJlZHVjZShcbiAgICAgICAgICAoYWNjdSwgbGF5ZXIsIGlkeCkgPT4gKHtcbiAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICBbbGF5ZXIuaWRdOlxuICAgICAgICAgICAgICBsYXllci5zaG91bGRSZW5kZXJMYXllcihsYXllckRhdGFbaWR4XSkgJiYgdGhpcy5faXNWaXNpYmxlTWFwTGF5ZXIobGF5ZXIsIG1hcExheWVycylcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgKTtcblxuICAgIGZpbHRlcnNTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlcnM7XG4gICAgcG9seWdvbkZpbHRlcnMgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmZpbHRlcnNTZWxlY3RvciwgZmlsdGVycyA9PlxuICAgICAgZmlsdGVycy5maWx0ZXIoZiA9PiBmLnR5cGUgPT09IEZJTFRFUl9UWVBFUy5wb2x5Z29uKVxuICAgICk7XG5cbiAgICBtYXBib3hMYXllcnNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5sYXllcnNTZWxlY3RvcixcbiAgICAgIHRoaXMubGF5ZXJEYXRhU2VsZWN0b3IsXG4gICAgICB0aGlzLmxheWVyT3JkZXJTZWxlY3RvcixcbiAgICAgIHRoaXMubGF5ZXJzVG9SZW5kZXJTZWxlY3RvcixcbiAgICAgIGdlbmVyYXRlTWFwYm94TGF5ZXJzXG4gICAgKTtcblxuICAgIC8qIGNvbXBvbmVudCBwcml2YXRlIGZ1bmN0aW9ucyAqL1xuICAgIF9pc1Zpc2libGVNYXBMYXllcihsYXllciwgbWFwTGF5ZXJzKSB7XG4gICAgICAvLyBpZiBsYXllci5pZCBpcyBub3QgaW4gbWFwTGF5ZXJzLCBkb24ndCByZW5kZXIgaXRcbiAgICAgIHJldHVybiAhbWFwTGF5ZXJzIHx8IChtYXBMYXllcnMgJiYgbWFwTGF5ZXJzW2xheWVyLmlkXSk7XG4gICAgfVxuXG4gICAgX29uQ2xvc2VNYXBQb3BvdmVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMub25MYXllckNsaWNrKG51bGwpO1xuICAgIH07XG5cbiAgICBfb25MYXllclNldERvbWFpbiA9IChpZHgsIGNvbG9yRG9tYWluKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5sYXllckNvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyc1tpZHhdLCB7XG4gICAgICAgIGNvbG9yRG9tYWluXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX2hhbmRsZU1hcFRvZ2dsZUxheWVyID0gbGF5ZXJJZCA9PiB7XG4gICAgICBjb25zdCB7aW5kZXg6IG1hcEluZGV4ID0gMCwgdmlzU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgICB2aXNTdGF0ZUFjdGlvbnMudG9nZ2xlTGF5ZXJGb3JNYXAobWFwSW5kZXgsIGxheWVySWQpO1xuICAgIH07XG5cbiAgICBfb25NYXBib3hTdHlsZVVwZGF0ZSA9ICgpID0+IHtcbiAgICAgIC8vIGZvcmNlIHJlZnJlc2ggbWFwYm94Z2wgbGF5ZXJzXG4gICAgICB0aGlzLnByZXZpb3VzTGF5ZXJzID0ge307XG4gICAgICB0aGlzLl91cGRhdGVNYXBib3hMYXllcnMoKTtcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uTWFwU3R5bGVMb2FkZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbk1hcFN0eWxlTG9hZGVkKHRoaXMuX21hcCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9zZXRNYXBib3hNYXAgPSBtYXBib3ggPT4ge1xuICAgICAgaWYgKCF0aGlzLl9tYXAgJiYgbWFwYm94KSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG1hcGJveC5nZXRNYXAoKTtcbiAgICAgICAgLy8gaSBub3RpY2VkIGluIGNlcnRhaW4gY29udGV4dCB3ZSBkb24ndCBhY2Nlc3MgdGhlIGFjdHVhbCBtYXAgZWxlbWVudFxuICAgICAgICBpZiAoIXRoaXMuX21hcCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBiaW5kIG1hcGJveGdsIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIHRoaXMuX21hcC5vbihNQVBCT1hHTF9TVFlMRV9VUERBVEUsIHRoaXMuX29uTWFwYm94U3R5bGVVcGRhdGUpO1xuXG4gICAgICAgIHRoaXMuX21hcC5vbihNQVBCT1hHTF9SRU5ERVIsICgpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMub25NYXBSZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25NYXBSZW5kZXIodGhpcy5fbWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wcm9wcy5nZXRNYXBib3hSZWYpIHtcbiAgICAgICAgLy8gVGhlIHBhcmVudCBjb21wb25lbnQgY2FuIGdhaW4gYWNjZXNzIHRvIG91ciBNYXBib3hHbE1hcCBieVxuICAgICAgICAvLyBwcm92aWRpbmcgdGhpcyBjYWxsYmFjay4gTm90ZSB0aGF0ICdtYXBib3gnIHdpbGwgYmUgbnVsbCB3aGVuIHRoZVxuICAgICAgICAvLyByZWYgaXMgdW5zZXQgKGUuZy4gd2hlbiBhIHNwbGl0IG1hcCBpcyBjbG9zZWQpLlxuICAgICAgICB0aGlzLnByb3BzLmdldE1hcGJveFJlZihtYXBib3gsIHRoaXMucHJvcHMuaW5kZXgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfb25CZWZvcmVSZW5kZXIgPSAoe2dsfSkgPT4ge1xuICAgICAgc2V0TGF5ZXJCbGVuZGluZyhnbCwgdGhpcy5wcm9wcy5sYXllckJsZW5kaW5nKTtcbiAgICB9O1xuXG4gICAgLyogY29tcG9uZW50IHJlbmRlciBmdW5jdGlvbnMgKi9cblxuICAgIC8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbiAgICBfcmVuZGVyTWFwUG9wb3ZlcihsYXllcnNUb1JlbmRlcikge1xuICAgICAgLy8gVE9ETzogbW92ZSB0aGlzIGludG8gcmVkdWNlciBzbyBpdCBjYW4gYmUgdGVzdGVkXG4gICAgICBjb25zdCB7XG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBob3ZlckluZm8sXG4gICAgICAgIGNsaWNrZWQsXG4gICAgICAgIGRhdGFzZXRzLFxuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgICAgbGF5ZXJzLFxuICAgICAgICBtb3VzZVBvczoge21vdXNlUG9zaXRpb24sIGNvb3JkaW5hdGUsIHBpbm5lZH1cbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBpZiAoIW1vdXNlUG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICAvLyBpZiBjbGlja2VkIHNvbWV0aGluZywgaWdub3JlIGhvdmVyIGJlaGF2aW9yXG4gICAgICBjb25zdCBvYmplY3RJbmZvID0gY2xpY2tlZCB8fCBob3ZlckluZm87XG4gICAgICBsZXQgbGF5ZXJIb3ZlclByb3AgPSBudWxsO1xuICAgICAgbGV0IHBvc2l0aW9uID0ge3g6IG1vdXNlUG9zaXRpb25bMF0sIHk6IG1vdXNlUG9zaXRpb25bMV19O1xuXG4gICAgICBpZiAoaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5lbmFibGVkICYmIG9iamVjdEluZm8gJiYgb2JqZWN0SW5mby5waWNrZWQpIHtcbiAgICAgICAgLy8gaWYgYW55dGhpbmcgaG92ZXJlZFxuICAgICAgICBjb25zdCB7b2JqZWN0LCBsYXllcjogb3ZlcmxheX0gPSBvYmplY3RJbmZvO1xuXG4gICAgICAgIC8vIGRlY2tnbCBsYXllciB0byBrZXBsZXItZ2wgbGF5ZXJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSBsYXllcnNbb3ZlcmxheS5wcm9wcy5pZHhdO1xuXG4gICAgICAgIGlmIChsYXllci5nZXRIb3ZlckRhdGEgJiYgbGF5ZXJzVG9SZW5kZXJbbGF5ZXIuaWRdKSB7XG4gICAgICAgICAgLy8gaWYgbGF5ZXIgaXMgdmlzaWJsZSBhbmQgaGF2ZSBob3ZlcmVkIGRhdGFcbiAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBjb25maWc6IHtkYXRhSWR9XG4gICAgICAgICAgfSA9IGxheWVyO1xuICAgICAgICAgIGNvbnN0IHthbGxEYXRhLCBmaWVsZHN9ID0gZGF0YXNldHNbZGF0YUlkXTtcbiAgICAgICAgICBjb25zdCBkYXRhID0gbGF5ZXIuZ2V0SG92ZXJEYXRhKG9iamVjdCwgYWxsRGF0YSk7XG4gICAgICAgICAgY29uc3QgZmllbGRzVG9TaG93ID0gaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF07XG5cbiAgICAgICAgICBsYXllckhvdmVyUHJvcCA9IHtcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBmaWVsZHMsXG4gICAgICAgICAgICBmaWVsZHNUb1Nob3csXG4gICAgICAgICAgICBsYXllclxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBpbm5lZCB8fCBjbGlja2VkKSB7XG4gICAgICAgIC8vIHByb2plY3QgbG5nbGF0IHRvIHNjcmVlbiBzbyB0aGF0IHRvb2x0aXAgZm9sbG93cyB0aGUgb2JqZWN0IG9uIHpvb21cbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSBuZXcgV2ViTWVyY2F0b3JWaWV3cG9ydChtYXBTdGF0ZSk7XG4gICAgICAgIGNvbnN0IGxuZ0xhdCA9IGNsaWNrZWQgPyBjbGlja2VkLmxuZ0xhdCA6IHBpbm5lZC5jb29yZGluYXRlO1xuICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX2dldEhvdmVyWFkodmlld3BvcnQsIGxuZ0xhdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxNYXBQb3BvdmVyXG4gICAgICAgICAgICB7Li4ucG9zaXRpb259XG4gICAgICAgICAgICBsYXllckhvdmVyUHJvcD17bGF5ZXJIb3ZlclByb3B9XG4gICAgICAgICAgICBjb29yZGluYXRlPXtcbiAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Db25maWcuY29vcmRpbmF0ZS5lbmFibGVkICYmICgocGlubmVkIHx8IHt9KS5jb29yZGluYXRlIHx8IGNvb3JkaW5hdGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcmVlemVkPXtCb29sZWFuKGNsaWNrZWQgfHwgcGlubmVkKX1cbiAgICAgICAgICAgIG9uQ2xvc2U9e3RoaXMuX29uQ2xvc2VNYXBQb3BvdmVyfVxuICAgICAgICAgICAgbWFwVz17bWFwU3RhdGUud2lkdGh9XG4gICAgICAgICAgICBtYXBIPXttYXBTdGF0ZS5oZWlnaHR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gICAgX2dldEhvdmVyWFkodmlld3BvcnQsIGxuZ0xhdCkge1xuICAgICAgY29uc3Qgc2NyZWVuQ29vcmQgPSAhdmlld3BvcnQgfHwgIWxuZ0xhdCA/IG51bGwgOiB2aWV3cG9ydC5wcm9qZWN0KGxuZ0xhdCk7XG4gICAgICByZXR1cm4gc2NyZWVuQ29vcmQgJiYge3g6IHNjcmVlbkNvb3JkWzBdLCB5OiBzY3JlZW5Db29yZFsxXX07XG4gICAgfVxuXG4gICAgX3JlbmRlckxheWVyID0gKG92ZXJsYXlzLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGF0YXNldHMsXG4gICAgICAgIGxheWVycyxcbiAgICAgICAgbGF5ZXJEYXRhLFxuICAgICAgICBob3ZlckluZm8sXG4gICAgICAgIGNsaWNrZWQsXG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgICAgYW5pbWF0aW9uQ29uZmlnXG4gICAgICB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGxheWVyID0gbGF5ZXJzW2lkeF07XG4gICAgICBjb25zdCBkYXRhID0gbGF5ZXJEYXRhW2lkeF07XG4gICAgICBjb25zdCB7Z3B1RmlsdGVyfSA9IGRhdGFzZXRzW2xheWVyLmNvbmZpZy5kYXRhSWRdIHx8IHt9O1xuXG4gICAgICBjb25zdCBvYmplY3RIb3ZlcmVkID0gY2xpY2tlZCB8fCBob3ZlckluZm87XG4gICAgICBjb25zdCBsYXllckNhbGxiYWNrcyA9IHtcbiAgICAgICAgb25TZXRMYXllckRvbWFpbjogdmFsID0+IHRoaXMuX29uTGF5ZXJTZXREb21haW4oaWR4LCB2YWwpXG4gICAgICB9O1xuXG4gICAgICAvLyBMYXllciBpcyBMYXllciBjbGFzc1xuICAgICAgY29uc3QgbGF5ZXJPdmVybGF5ID0gbGF5ZXIucmVuZGVyTGF5ZXIoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBncHVGaWx0ZXIsXG4gICAgICAgIGlkeCxcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAgIGxheWVyQ2FsbGJhY2tzLFxuICAgICAgICBtYXBTdGF0ZSxcbiAgICAgICAgYW5pbWF0aW9uQ29uZmlnLFxuICAgICAgICBvYmplY3RIb3ZlcmVkXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG92ZXJsYXlzLmNvbmNhdChsYXllck92ZXJsYXkgfHwgW10pO1xuICAgIH07XG5cbiAgICBfcmVuZGVyRGVja092ZXJsYXkobGF5ZXJzVG9SZW5kZXIpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWFwU3RhdGUsXG4gICAgICAgIG1hcFN0eWxlLFxuICAgICAgICBsYXllckRhdGEsXG4gICAgICAgIGxheWVyT3JkZXIsXG4gICAgICAgIGxheWVycyxcbiAgICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgbWFwYm94QXBpVXJsXG4gICAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgbGV0IGRlY2tHbExheWVycyA9IFtdO1xuICAgICAgLy8gd2FpdCB1bnRpbCBkYXRhIGlzIHJlYWR5IGJlZm9yZSByZW5kZXIgZGF0YSBsYXllcnNcbiAgICAgIGlmIChsYXllckRhdGEgJiYgbGF5ZXJEYXRhLmxlbmd0aCkge1xuICAgICAgICAvLyBsYXN0IGxheWVyIHJlbmRlciBmaXJzdFxuICAgICAgICBkZWNrR2xMYXllcnMgPSBsYXllck9yZGVyXG4gICAgICAgICAgLnNsaWNlKClcbiAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgIGlkeCA9PiBsYXllcnNbaWR4XS5vdmVybGF5VHlwZSA9PT0gT1ZFUkxBWV9UWVBFLmRlY2tnbCAmJiBsYXllcnNUb1JlbmRlcltsYXllcnNbaWR4XS5pZF1cbiAgICAgICAgICApXG4gICAgICAgICAgLnJlZHVjZSh0aGlzLl9yZW5kZXJMYXllciwgW10pO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFwU3R5bGUudmlzaWJsZUxheWVyR3JvdXBzWyczZCBidWlsZGluZyddKSB7XG4gICAgICAgIGRlY2tHbExheWVycy5wdXNoKFxuICAgICAgICAgIG5ldyBUaHJlZURCdWlsZGluZ0xheWVyKHtcbiAgICAgICAgICAgIGlkOiAnX2tlcGxlcmdsXzNkLWJ1aWxkaW5nJyxcbiAgICAgICAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgbWFwYm94QXBpVXJsLFxuICAgICAgICAgICAgdGhyZWVEQnVpbGRpbmdDb2xvcjogbWFwU3R5bGUudGhyZWVEQnVpbGRpbmdDb2xvcixcbiAgICAgICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgICAgIGdldEZpbGxDb2xvcjogbWFwU3R5bGUudGhyZWVEQnVpbGRpbmdDb2xvclxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEZWNrR0xcbiAgICAgICAgICB7Li4udGhpcy5wcm9wcy5kZWNrR2xQcm9wc31cbiAgICAgICAgICB2aWV3U3RhdGU9e21hcFN0YXRlfVxuICAgICAgICAgIGlkPVwiZGVmYXVsdC1kZWNrZ2wtb3ZlcmxheVwiXG4gICAgICAgICAgbGF5ZXJzPXtkZWNrR2xMYXllcnN9XG4gICAgICAgICAgb25CZWZvcmVSZW5kZXI9e3RoaXMuX29uQmVmb3JlUmVuZGVyfVxuICAgICAgICAgIG9uSG92ZXI9e3Zpc1N0YXRlQWN0aW9ucy5vbkxheWVySG92ZXJ9XG4gICAgICAgICAgb25DbGljaz17dmlzU3RhdGVBY3Rpb25zLm9uTGF5ZXJDbGlja31cbiAgICAgICAgICByZWY9e2NvbXAgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbXAgJiYgY29tcC5kZWNrICYmICF0aGlzLl9kZWNrKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RlY2sgPSBjb21wLmRlY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZU1hcGJveExheWVycygpIHtcbiAgICAgIGNvbnN0IG1hcGJveExheWVycyA9IHRoaXMubWFwYm94TGF5ZXJzU2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgICBpZiAoIU9iamVjdC5rZXlzKG1hcGJveExheWVycykubGVuZ3RoICYmICFPYmplY3Qua2V5cyh0aGlzLnByZXZpb3VzTGF5ZXJzKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVNYXBib3hMYXllcnModGhpcy5fbWFwLCBtYXBib3hMYXllcnMsIHRoaXMucHJldmlvdXNMYXllcnMpO1xuXG4gICAgICB0aGlzLnByZXZpb3VzTGF5ZXJzID0gbWFwYm94TGF5ZXJzO1xuICAgIH1cblxuICAgIF9yZW5kZXJNYXBib3hPdmVybGF5cygpIHtcbiAgICAgIGlmICh0aGlzLl9tYXAgJiYgdGhpcy5fbWFwLmlzU3R5bGVMb2FkZWQoKSkge1xuICAgICAgICB0aGlzLl91cGRhdGVNYXBib3hMYXllcnMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25WaWV3cG9ydENoYW5nZSA9IHZpZXdTdGF0ZSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMub25WaWV3U3RhdGVDaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vblZpZXdTdGF0ZUNoYW5nZSh2aWV3U3RhdGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5tYXBTdGF0ZUFjdGlvbnMudXBkYXRlTWFwKHZpZXdTdGF0ZSk7XG4gICAgfTtcblxuICAgIF90b2dnbGVNYXBDb250cm9sID0gcGFuZWxJZCA9PiB7XG4gICAgICBjb25zdCB7aW5kZXgsIHVpU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1hcENvbnRyb2wocGFuZWxJZCwgaW5kZXgpO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBtYXBTdHlsZSxcbiAgICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgICBtYXBMYXllcnMsXG4gICAgICAgIGxheWVycyxcbiAgICAgICAgTWFwQ29tcG9uZW50LFxuICAgICAgICBkYXRhc2V0cyxcbiAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW4sXG4gICAgICAgIG1hcGJveEFwaVVybCxcbiAgICAgICAgbWFwQ29udHJvbHMsXG4gICAgICAgIHVpU3RhdGUsXG4gICAgICAgIHVpU3RhdGVBY3Rpb25zLFxuICAgICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICAgIGVkaXRvcixcbiAgICAgICAgaW5kZXhcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCBsYXllcnNUb1JlbmRlciA9IHRoaXMubGF5ZXJzVG9SZW5kZXJTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgICAgaWYgKCFtYXBTdHlsZS5ib3R0b21NYXBTdHlsZSkge1xuICAgICAgICAvLyBzdHlsZSBub3QgeWV0IGxvYWRlZFxuICAgICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFwUHJvcHMgPSB7XG4gICAgICAgIC4uLm1hcFN0YXRlLFxuICAgICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUsXG4gICAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgICAgICBtYXBib3hBcGlVcmwsXG4gICAgICAgIG9uVmlld3BvcnRDaGFuZ2U6IHRoaXMuX29uVmlld3BvcnRDaGFuZ2UsXG4gICAgICAgIHRyYW5zZm9ybVJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGlzRWRpdCA9IHVpU3RhdGUubWFwQ29udHJvbHMubWFwRHJhdy5hY3RpdmU7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRNYXBDb250YWluZXIgc3R5bGU9e01BUF9TVFlMRS5jb250YWluZXJ9PlxuICAgICAgICAgIDxNYXBDb250cm9sXG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICBkcmFnUm90YXRlPXttYXBTdGF0ZS5kcmFnUm90YXRlfVxuICAgICAgICAgICAgaXNTcGxpdD17Qm9vbGVhbihtYXBMYXllcnMpfVxuICAgICAgICAgICAgaXNFeHBvcnQ9e3RoaXMucHJvcHMuaXNFeHBvcnR9XG4gICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgIGxheWVyc1RvUmVuZGVyPXtsYXllcnNUb1JlbmRlcn1cbiAgICAgICAgICAgIG1hcEluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIG1hcENvbnRyb2xzPXttYXBDb250cm9sc31cbiAgICAgICAgICAgIHJlYWRPbmx5PXt0aGlzLnByb3BzLnJlYWRPbmx5fVxuICAgICAgICAgICAgc2NhbGU9e21hcFN0YXRlLnNjYWxlIHx8IDF9XG4gICAgICAgICAgICB0b3A9ezB9XG4gICAgICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgICAgIGxvY2FsZT17dWlTdGF0ZS5sb2NhbGV9XG4gICAgICAgICAgICBvblRvZ2dsZVBlcnNwZWN0aXZlPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlUGVyc3BlY3RpdmV9XG4gICAgICAgICAgICBvblRvZ2dsZVNwbGl0TWFwPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlU3BsaXRNYXB9XG4gICAgICAgICAgICBvbk1hcFRvZ2dsZUxheWVyPXt0aGlzLl9oYW5kbGVNYXBUb2dnbGVMYXllcn1cbiAgICAgICAgICAgIG9uVG9nZ2xlTWFwQ29udHJvbD17dGhpcy5fdG9nZ2xlTWFwQ29udHJvbH1cbiAgICAgICAgICAgIG9uU2V0RWRpdG9yTW9kZT17dmlzU3RhdGVBY3Rpb25zLnNldEVkaXRvck1vZGV9XG4gICAgICAgICAgICBvblNldExvY2FsZT17dWlTdGF0ZUFjdGlvbnMuc2V0TG9jYWxlfVxuICAgICAgICAgICAgb25Ub2dnbGVFZGl0b3JWaXNpYmlsaXR5PXt2aXNTdGF0ZUFjdGlvbnMudG9nZ2xlRWRpdG9yVmlzaWJpbGl0eX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxNYXBDb21wb25lbnRcbiAgICAgICAgICAgIHsuLi5tYXBQcm9wc31cbiAgICAgICAgICAgIGtleT1cImJvdHRvbVwiXG4gICAgICAgICAgICByZWY9e3RoaXMuX3NldE1hcGJveE1hcH1cbiAgICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS5ib3R0b21NYXBTdHlsZX1cbiAgICAgICAgICAgIGdldEN1cnNvcj17dGhpcy5wcm9wcy5ob3ZlckluZm8gPyAoKSA9PiAncG9pbnRlcicgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb249e1RSQU5TSVRJT05fRFVSQVRJT059XG4gICAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMub25Nb3VzZU1vdmV9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuX3JlbmRlckRlY2tPdmVybGF5KGxheWVyc1RvUmVuZGVyKX1cbiAgICAgICAgICAgIHt0aGlzLl9yZW5kZXJNYXBib3hPdmVybGF5cyhsYXllcnNUb1JlbmRlcil9XG4gICAgICAgICAgICA8RWRpdG9yXG4gICAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgICAgICAgZmlsdGVycz17dGhpcy5wb2x5Z29uRmlsdGVycyh0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgaXNFbmFibGVkPXtpc0VkaXR9XG4gICAgICAgICAgICAgIGxheWVycz17bGF5ZXJzfVxuICAgICAgICAgICAgICBsYXllcnNUb1JlbmRlcj17bGF5ZXJzVG9SZW5kZXJ9XG4gICAgICAgICAgICAgIG9uRGVsZXRlRmVhdHVyZT17dmlzU3RhdGVBY3Rpb25zLmRlbGV0ZUZlYXR1cmV9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt2aXNTdGF0ZUFjdGlvbnMuc2V0U2VsZWN0ZWRGZWF0dXJlfVxuICAgICAgICAgICAgICBvblVwZGF0ZT17dmlzU3RhdGVBY3Rpb25zLnNldEZlYXR1cmVzfVxuICAgICAgICAgICAgICBvblRvZ2dsZVBvbHlnb25GaWx0ZXI9e3Zpc1N0YXRlQWN0aW9ucy5zZXRQb2x5Z29uRmlsdGVyTGF5ZXJ9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogaXNFZGl0ID8gJ2FsbCcgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZWRpdG9yLnZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvTWFwQ29tcG9uZW50PlxuICAgICAgICAgIHttYXBTdHlsZS50b3BNYXBTdHlsZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtNQVBfU1RZTEUudG9wfT5cbiAgICAgICAgICAgICAgPE1hcENvbXBvbmVudCB7Li4ubWFwUHJvcHN9IGtleT1cInRvcFwiIG1hcFN0eWxlPXttYXBTdHlsZS50b3BNYXBTdHlsZX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAge3RoaXMuX3JlbmRlck1hcFBvcG92ZXIobGF5ZXJzVG9SZW5kZXIpfVxuICAgICAgICAgIDxBdHRyaWJ1dGlvbiAvPlxuICAgICAgICA8L1N0eWxlZE1hcENvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgTWFwQ29udGFpbmVyLmRpc3BsYXlOYW1lID0gJ01hcENvbnRhaW5lcic7XG5cbiAgcmV0dXJuIE1hcENvbnRhaW5lcjtcbn1cbiJdfQ==