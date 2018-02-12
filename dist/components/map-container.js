'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactMapGl = require('react-map-gl');

var _reactMapGl2 = _interopRequireDefault(_reactMapGl);

var _geoViewport = require('@mapbox/geo-viewport');

var _geoViewport2 = _interopRequireDefault(_geoViewport);

var _deck = require('deck.gl');

var _deck2 = _interopRequireDefault(_deck);

var _luma = require('luma.gl');

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

var _mapPopover = require('./map/map-popover');

var _mapPopover2 = _interopRequireDefault(_mapPopover);

var _mapControl = require('./map/map-control');

var _mapControl2 = _interopRequireDefault(_mapControl);

var _defaultSettings = require('../constants/default-settings');

var _layerUtils = require('../utils/layer-utils/layer-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// default-settings
// libraries
var MAP_STYLE = {
  container: {
    display: 'inline-block',
    position: 'relative'
  },
  top: { position: 'absolute', top: '0px', pointerEvents: 'none' }
};

// utils


// deckgl layers


// components


var getGlConst = function getGlConst(d) {
  return _luma.GL[d];
};

var propTypes = {
  // required
  data: _propTypes2.default.array.isRequired,
  fields: _propTypes2.default.array.isRequired,
  interactionConfig: _propTypes2.default.object.isRequired,
  layerBlending: _propTypes2.default.string.isRequired,
  layerData: _propTypes2.default.array.isRequired,
  layers: _propTypes2.default.array.isRequired,
  mapState: _propTypes2.default.object.isRequired,
  mapStyle: _propTypes2.default.object.isRequired,
  popoverOffset: _propTypes2.default.object.isRequired,

  // optional
  mapLayers: _react2.default.PropTypes.object,
  onMapToggleLayer: _react2.default.PropTypes.func
};

var MapContainer = function (_Component) {
  (0, _inherits3.default)(MapContainer, _Component);

  function MapContainer(props) {
    (0, _classCallCheck3.default)(this, MapContainer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MapContainer.__proto__ || Object.getPrototypeOf(MapContainer)).call(this, props));

    _this._onCloseMapPopover = function () {
      _this.props.visStateActions.onLayerClick(null);
    };

    _this._onLayerSetDomain = function (idx, colorDomain) {
      _this.props.visStateActions.layerConfigChange(_this.props.layers[idx], {
        colorDomain: colorDomain
      });
    };

    _this._onWebGLInitialized = function (gl) {
      // enable depth test for perspective mode
      if (_this.props.mapState.dragRotate) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
      } else {
        gl.disable(gl.DEPTH_TEST);
      }

      // allow Uint32 indices in building layer
      gl.getExtension('OES_element_index_uint');

      _this._togglelayerBlending(gl);

      _this.setState({ gl: gl });
    };

    _this._onMouseMove = function (evt) {
      var brush = _this.props.interactionConfig.brush;


      if (evt.nativeEvent && brush.enabled) {
        _this.setState({
          mousePosition: [evt.nativeEvent.offsetX, evt.nativeEvent.offsetY]
        });
      }
    };

    _this._handleMapToggleLayer = function (layerId) {
      var _this$props = _this.props,
          _this$props$index = _this$props.index,
          mapIndex = _this$props$index === undefined ? 0 : _this$props$index,
          visStateActions = _this$props.visStateActions;

      visStateActions.toggleLayerForMap(mapIndex, layerId);
    };

    _this._togglelayerBlending = function (gl) {
      var blending = _defaultSettings.LAYER_BLENDINGS[_this.props.layerBlending];
      var enable = blending.enable,
          blendFunc = blending.blendFunc,
          blendEquation = blending.blendEquation,
          blendFuncSeparate = blending.blendFuncSeparate,
          blendEquationSeparate = blending.blendEquationSeparate;


      if (enable) {
        gl.enable(_luma.GL.BLEND);
        if (blendFunc) {
          gl.blendFunc.apply(gl, (0, _toConsumableArray3.default)(blendFunc.map(getGlConst)));
          gl.blendEquation(_luma.GL[blendEquation]);
        } else {
          gl.blendFuncSeparate.apply(gl, (0, _toConsumableArray3.default)(blendFuncSeparate.map(getGlConst)));
          gl.blendEquationSeparate.apply(gl, (0, _toConsumableArray3.default)(blendEquationSeparate.map(getGlConst)));
        }
      } else {
        gl.disable(_luma.GL.BLEND);
      }
    };

    _this._renderLayer = function (overlays, idx) {
      var _this$props2 = _this.props,
          layers = _this$props2.layers,
          layerData = _this$props2.layerData,
          hoverInfo = _this$props2.hoverInfo,
          clicked = _this$props2.clicked,
          mapLayers = _this$props2.mapLayers,
          mapState = _this$props2.mapState,
          visStateActions = _this$props2.visStateActions,
          interactionConfig = _this$props2.interactionConfig;
      var mousePosition = _this.state.mousePosition;

      var layer = layers[idx];
      var data = layerData[idx];

      var layerInteraction = {
        onHover: visStateActions.onLayerHover,
        onClick: visStateActions.onLayerClick,
        mousePosition: mousePosition
      };

      var objectHovered = clicked || hoverInfo;
      var layerCallbacks = {
        onSetLayerDomain: function onSetLayerDomain(val) {
          return _this._onLayerSetDomain(idx, val);
        }
      };

      if (!_this._shouldRenderLayer(layer, data, mapLayers)) {
        return overlays;
      }

      var layerOverlay = [];

      // Layer is Layer class
      if (typeof layer.renderLayer === 'function') {
        layerOverlay = layer.renderLayer({
          data: data,
          idx: idx,
          layerInteraction: layerInteraction,
          objectHovered: objectHovered,
          mapState: mapState,
          interactionConfig: interactionConfig,
          layerCallbacks: layerCallbacks
        });
      }

      if (layerOverlay.length) {
        overlays = overlays.concat(layerOverlay);
      }
      return overlays;
    };

    _this.state = {
      hasBuildingLayer: false,
      reRenderKey: 0,
      gl: null,
      mousePosition: [0, 0]
    };

    _this.loadBuildingTiles = (0, _lodash2.default)(_this.loadBuildingTiles, 100);
    return _this;
  }

  (0, _createClass3.default)(MapContainer, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.mapState.dragRotate !== nextProps.mapState.dragRotate || this.props.layerBlending !== nextProps.layerBlending) {
        // increment rerender key to force gl reinitialize when
        // perspective or layer blending changed
        // TODO: layer blending can now be implemented per layer base
        this.setState({
          reRenderKey: this.state.reRenderKey + 1
        });
      }
      if (this.props.mapStyle !== nextProps.mapStyle) {
        this.setState({
          hasBuildingLayer: nextProps.mapStyle.buildingLayer.isVisible
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.mapState.dragRotate && this.state.hasBuildingLayer && this.props.mapState !== prevProps.mapState) {
        this.loadBuildingTiles(this.props.mapState);
      }
    }

    /* component actions */

  }, {
    key: 'loadBuildingTiles',
    value: function loadBuildingTiles(mapState) {
      this.props.buildingDataActions.loadBuildingTile(mapState);
    }

    /* component private functions */

    /* deck.gl doesn't support blendFuncSeparate yet
     * so we're applying the blending ourselves
    */

  }, {
    key: '_renderObjectLayerPopover',


    /* component render functions */
    /* eslint-disable complexity */
    value: function _renderObjectLayerPopover() {
      // TODO: move this into reducer so it can be tested
      var _props = this.props,
          mapState = _props.mapState,
          hoverInfo = _props.hoverInfo,
          clicked = _props.clicked,
          datasets = _props.datasets,
          interactionConfig = _props.interactionConfig,
          layers = _props.layers,
          mapLayers = _props.mapLayers;

      // if clicked something, ignore hover behavior

      var objectInfo = clicked || hoverInfo;
      if (!interactionConfig.tooltip.enabled || !objectInfo || !objectInfo.picked) {
        // nothing hovered
        return null;
      }

      var lngLat = objectInfo.lngLat,
          object = objectInfo.object,
          overlay = objectInfo.layer;

      // deckgl layer to kepler-gl layer

      var layer = layers[overlay.props.idx];

      if (!layer || !layer.config.isVisible || !object || !layer.getHoverData || mapLayers && !mapLayers[layer.id].isVisible) {
        // layer is not visible
        return null;
      }

      var dataId = layer.config.dataId;
      var _datasets$dataId = datasets[dataId],
          allData = _datasets$dataId.allData,
          fields = _datasets$dataId.fields;

      var data = layer.getHoverData(object, allData);

      // project lnglat to screen so that tooltip follows the object on zoom
      var viewport = overlay.context.viewport;

      var _ref = this._getHoverXY(viewport, lngLat) || objectInfo,
          x = _ref.x,
          y = _ref.y;

      var popoverProps = {
        data: data,
        fields: fields,
        fieldsToShow: interactionConfig.tooltip.config.fieldsToShow[dataId],
        layer: layer,
        isVisible: true,
        x: x,
        y: y,
        freezed: Boolean(clicked),
        onClose: this._onCloseMapPopover,
        mapState: mapState
      };

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_mapPopover2.default, popoverProps)
      );
    }
    /* eslint-enable complexity */

  }, {
    key: '_getHoverXY',
    value: function _getHoverXY(viewport, lngLat) {
      var screenCoord = !viewport || !lngLat ? null : viewport.project(lngLat);

      return screenCoord && { x: screenCoord[0], y: screenCoord[1] };
    }
  }, {
    key: '_renderBuildingLayer',
    value: function _renderBuildingLayer(layer, buildingData, mapState) {
      var longitude = mapState.longitude,
          latitude = mapState.latitude,
          zoom = mapState.zoom,
          width = mapState.width,
          height = mapState.height;

      var bbox = _geoViewport2.default.bounds([longitude, latitude], Math.floor(zoom), [width, height]);
      var lightSettings = (0, _layerUtils.getLightSettingsFromBounds)(bbox);

      // render one layer per tile
      return buildingData.map(function (_ref2) {
        var tileId = _ref2.tileId,
            data = _ref2.data;
        return new _deck.PolygonLayer({
          id: tileId,
          data: data,
          fp64: Math.floor(zoom) >= 16,
          extruded: true,
          getFillColor: function getFillColor(f) {
            return layer.color;
          },
          updateTriggers: {
            getFillColor: layer.color
          },
          lightSettings: lightSettings,
          getPolygon: function getPolygon(f) {
            return f.geometry.coordinates;
          },
          getElevation: function getElevation(f) {
            return f.properties.height;
          },
          opacity: layer.opacity
        });
      });
    }
  }, {
    key: '_shouldRenderLayer',
    value: function _shouldRenderLayer(layer, data, mapLayers) {
      var isAvailableAndVisible = !(mapLayers && mapLayers[layer.id]) || mapLayers[layer.id].isVisible;
      return layer.shouldRenderLayer(data) && isAvailableAndVisible;
    }
  }, {
    key: '_renderOverlay',
    value: function _renderOverlay() {
      var _props2 = this.props,
          mapState = _props2.mapState,
          mapStyle = _props2.mapStyle,
          buildingData = _props2.buildingData,
          layerData = _props2.layerData,
          layerOrder = _props2.layerOrder;
      var hasBuildingLayer = this.state.hasBuildingLayer;


      var deckGlLayers = [];

      // wait until data is ready before render data layers
      if (layerData && layerData.length) {
        // last layer render first
        deckGlLayers = layerOrder.slice().reverse().reduce(this._renderLayer, []);
      }

      // add 3d building layer
      if (hasBuildingLayer) {
        deckGlLayers = deckGlLayers.concat(this._renderBuildingLayer(mapStyle.buildingLayer, buildingData, mapState));
      }

      return _react2.default.createElement(_deck2.default, (0, _extends3.default)({}, mapState, {
        id: 'default-deckgl-overlay',
        layers: deckGlLayers,
        key: this.state.reRenderKey,
        onWebGLInitialized: this._onWebGLInitialized
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          mapState = _props3.mapState,
          mapStyle = _props3.mapStyle,
          mapStateActions = _props3.mapStateActions;
      var updateMap = mapStateActions.updateMap,
          onMapClick = mapStateActions.onMapClick;


      if (!mapStyle.bottomMapStyle) {
        // style not yet loaded
        return _react2.default.createElement('div', null);
      }

      var _props4 = this.props,
          mapLayers = _props4.mapLayers,
          layers = _props4.layers,
          datasets = _props4.datasets,
          index = _props4.index;


      var mapProps = (0, _extends3.default)({}, mapState, {
        preserveDrawingBuffer: true,
        mapboxApiAccessToken: _defaultSettings.MAPBOX_ACCESS_TOKEN,
        onViewportChange: updateMap
      });

      return _react2.default.createElement(
        'div',
        { style: MAP_STYLE.container, onMouseMove: this._onMouseMove },
        _react2.default.createElement(_mapControl2.default, {
          index: index,
          datasets: datasets,
          dragRotate: mapState.dragRotate,
          isSplit: mapState.isSplit,
          isFullScreen: mapState.isFullScreen,
          layers: layers,
          mapIndex: this.props.index,
          mapLayers: mapLayers,
          onTogglePerspective: mapStateActions.togglePerspective,
          onToggleSplitMap: mapStateActions.toggleSplitMap,
          onMapToggleLayer: this._handleMapToggleLayer,
          onToggleFullScreen: mapStateActions.toggleFullScreen,
          top: 0
        }),
        _react2.default.createElement(
          _reactMapGl2.default,
          (0, _extends3.default)({}, mapProps, {
            key: 'bottom',
            mapStyle: mapStyle.bottomMapStyle,
            onClick: onMapClick
          }),
          this._renderOverlay()
        ),
        mapStyle.topMapStyle && _react2.default.createElement(
          'div',
          { style: MAP_STYLE.top },
          _react2.default.createElement(_reactMapGl2.default, (0, _extends3.default)({}, mapProps, {
            key: 'top',
            mapStyle: mapStyle.topMapStyle
          }))
        ),
        this._renderObjectLayerPopover()
      );
    }
  }]);
  return MapContainer;
}(_react.Component);

exports.default = MapContainer;


MapContainer.propsTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiTUFQX1NUWUxFIiwiY29udGFpbmVyIiwiZGlzcGxheSIsInBvc2l0aW9uIiwidG9wIiwicG9pbnRlckV2ZW50cyIsImdldEdsQ29uc3QiLCJkIiwicHJvcFR5cGVzIiwiZGF0YSIsImFycmF5IiwiaXNSZXF1aXJlZCIsImZpZWxkcyIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVyRGF0YSIsImxheWVycyIsIm1hcFN0YXRlIiwibWFwU3R5bGUiLCJwb3BvdmVyT2Zmc2V0IiwibWFwTGF5ZXJzIiwiUHJvcFR5cGVzIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBDb250YWluZXIiLCJwcm9wcyIsIl9vbkNsb3NlTWFwUG9wb3ZlciIsInZpc1N0YXRlQWN0aW9ucyIsIm9uTGF5ZXJDbGljayIsIl9vbkxheWVyU2V0RG9tYWluIiwiaWR4IiwiY29sb3JEb21haW4iLCJsYXllckNvbmZpZ0NoYW5nZSIsIl9vbldlYkdMSW5pdGlhbGl6ZWQiLCJkcmFnUm90YXRlIiwiZ2wiLCJlbmFibGUiLCJERVBUSF9URVNUIiwiZGVwdGhGdW5jIiwiTEVRVUFMIiwiZGlzYWJsZSIsImdldEV4dGVuc2lvbiIsIl90b2dnbGVsYXllckJsZW5kaW5nIiwic2V0U3RhdGUiLCJfb25Nb3VzZU1vdmUiLCJicnVzaCIsImV2dCIsIm5hdGl2ZUV2ZW50IiwiZW5hYmxlZCIsIm1vdXNlUG9zaXRpb24iLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl9oYW5kbGVNYXBUb2dnbGVMYXllciIsImluZGV4IiwibWFwSW5kZXgiLCJ0b2dnbGVMYXllckZvck1hcCIsImxheWVySWQiLCJibGVuZGluZyIsImJsZW5kRnVuYyIsImJsZW5kRXF1YXRpb24iLCJibGVuZEZ1bmNTZXBhcmF0ZSIsImJsZW5kRXF1YXRpb25TZXBhcmF0ZSIsIkJMRU5EIiwibWFwIiwiX3JlbmRlckxheWVyIiwib3ZlcmxheXMiLCJob3ZlckluZm8iLCJjbGlja2VkIiwic3RhdGUiLCJsYXllciIsImxheWVySW50ZXJhY3Rpb24iLCJvbkhvdmVyIiwib25MYXllckhvdmVyIiwib25DbGljayIsIm9iamVjdEhvdmVyZWQiLCJsYXllckNhbGxiYWNrcyIsIm9uU2V0TGF5ZXJEb21haW4iLCJ2YWwiLCJfc2hvdWxkUmVuZGVyTGF5ZXIiLCJsYXllck92ZXJsYXkiLCJyZW5kZXJMYXllciIsImxlbmd0aCIsImNvbmNhdCIsImhhc0J1aWxkaW5nTGF5ZXIiLCJyZVJlbmRlcktleSIsImxvYWRCdWlsZGluZ1RpbGVzIiwibmV4dFByb3BzIiwiYnVpbGRpbmdMYXllciIsImlzVmlzaWJsZSIsInByZXZQcm9wcyIsInByZXZTdGF0ZSIsImJ1aWxkaW5nRGF0YUFjdGlvbnMiLCJsb2FkQnVpbGRpbmdUaWxlIiwiZGF0YXNldHMiLCJvYmplY3RJbmZvIiwidG9vbHRpcCIsInBpY2tlZCIsImxuZ0xhdCIsIm92ZXJsYXkiLCJjb25maWciLCJnZXRIb3ZlckRhdGEiLCJpZCIsImRhdGFJZCIsImFsbERhdGEiLCJ2aWV3cG9ydCIsImNvbnRleHQiLCJfZ2V0SG92ZXJYWSIsIngiLCJ5IiwicG9wb3ZlclByb3BzIiwiZmllbGRzVG9TaG93IiwiZnJlZXplZCIsIkJvb2xlYW4iLCJvbkNsb3NlIiwic2NyZWVuQ29vcmQiLCJwcm9qZWN0IiwiYnVpbGRpbmdEYXRhIiwibG9uZ2l0dWRlIiwibGF0aXR1ZGUiLCJ6b29tIiwid2lkdGgiLCJoZWlnaHQiLCJiYm94IiwiYm91bmRzIiwiTWF0aCIsImZsb29yIiwibGlnaHRTZXR0aW5ncyIsInRpbGVJZCIsImZwNjQiLCJleHRydWRlZCIsImdldEZpbGxDb2xvciIsImNvbG9yIiwidXBkYXRlVHJpZ2dlcnMiLCJnZXRQb2x5Z29uIiwiZiIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJnZXRFbGV2YXRpb24iLCJwcm9wZXJ0aWVzIiwib3BhY2l0eSIsImlzQXZhaWxhYmxlQW5kVmlzaWJsZSIsInNob3VsZFJlbmRlckxheWVyIiwibGF5ZXJPcmRlciIsImRlY2tHbExheWVycyIsInNsaWNlIiwicmV2ZXJzZSIsInJlZHVjZSIsIl9yZW5kZXJCdWlsZGluZ0xheWVyIiwibWFwU3RhdGVBY3Rpb25zIiwidXBkYXRlTWFwIiwib25NYXBDbGljayIsImJvdHRvbU1hcFN0eWxlIiwibWFwUHJvcHMiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsIm9uVmlld3BvcnRDaGFuZ2UiLCJpc1NwbGl0IiwiaXNGdWxsU2NyZWVuIiwidG9nZ2xlUGVyc3BlY3RpdmUiLCJ0b2dnbGVTcGxpdE1hcCIsInRvZ2dsZUZ1bGxTY3JlZW4iLCJfcmVuZGVyT3ZlcmxheSIsInRvcE1hcFN0eWxlIiwiX3JlbmRlck9iamVjdExheWVyUG9wb3ZlciIsInByb3BzVHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBTUE7O0FBR0E7Ozs7QUFKQTtBQWhCQTtBQXNCQSxJQUFNQSxZQUFZO0FBQ2hCQyxhQUFXO0FBQ1RDLGFBQVMsY0FEQTtBQUVUQyxjQUFVO0FBRkQsR0FESztBQUtoQkMsT0FBSyxFQUFDRCxVQUFVLFVBQVgsRUFBdUJDLEtBQUssS0FBNUIsRUFBbUNDLGVBQWUsTUFBbEQ7QUFMVyxDQUFsQjs7QUFIQTs7O0FBTkE7OztBQUpBOzs7QUFxQkEsSUFBTUMsYUFBYSxTQUFiQSxVQUFhO0FBQUEsU0FBSyxTQUFHQyxDQUFILENBQUw7QUFBQSxDQUFuQjs7QUFFQSxJQUFNQyxZQUFZO0FBQ2hCO0FBQ0FDLFFBQU0sb0JBQVVDLEtBQVYsQ0FBZ0JDLFVBRk47QUFHaEJDLFVBQVEsb0JBQVVGLEtBQVYsQ0FBZ0JDLFVBSFI7QUFJaEJFLHFCQUFtQixvQkFBVUMsTUFB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NkJBLEtBVDdCOzs7QUFXUCxVQUFNbUcsc0NBQ0R2SSxRQURDO0FBRUp3SSwrQkFBdUIsSUFGbkI7QUFHSkMsa0VBSEk7QUFJSkMsMEJBQWtCTjtBQUpkLFFBQU47O0FBT0EsYUFDRTtBQUFBO0FBQUEsVUFBSyxPQUFPdkosVUFBVUMsU0FBdEIsRUFBaUMsYUFBYSxLQUFLNkMsWUFBbkQ7QUFDRTtBQUNFLGlCQUFPUyxLQURUO0FBRUUsb0JBQVV3QyxRQUZaO0FBR0Usc0JBQVk1RSxTQUFTaUIsVUFIdkI7QUFJRSxtQkFBU2pCLFNBQVMySSxPQUpwQjtBQUtFLHdCQUFjM0ksU0FBUzRJLFlBTHpCO0FBTUUsa0JBQVE3SSxNQU5WO0FBT0Usb0JBQVUsS0FBS1MsS0FBTCxDQUFXNEIsS0FQdkI7QUFRRSxxQkFBV2pDLFNBUmI7QUFTRSwrQkFBcUJnSSxnQkFBZ0JVLGlCQVR2QztBQVVFLDRCQUFrQlYsZ0JBQWdCVyxjQVZwQztBQVdFLDRCQUFrQixLQUFLM0cscUJBWHpCO0FBWUUsOEJBQW9CZ0csZ0JBQWdCWSxnQkFadEM7QUFhRSxlQUFLO0FBYlAsVUFERjtBQWdCRTtBQUFBO0FBQUEscUNBQ01SLFFBRE47QUFFRSxpQkFBSSxRQUZOO0FBR0Usc0JBQVV0SSxTQUFTcUksY0FIckI7QUFJRSxxQkFBU0Q7QUFKWDtBQU1HLGVBQUtXLGNBQUw7QUFOSCxTQWhCRjtBQXdCRy9JLGlCQUFTZ0osV0FBVCxJQUNDO0FBQUE7QUFBQSxZQUFLLE9BQU9wSyxVQUFVSSxHQUF0QjtBQUNFLHlGQUNNc0osUUFETjtBQUVFLGlCQUFJLEtBRk47QUFHRSxzQkFBVXRJLFNBQVNnSjtBQUhyQjtBQURGLFNBekJKO0FBaUNHLGFBQUtDLHlCQUFMO0FBakNILE9BREY7QUFxQ0Q7Ozs7O2tCQXpYa0IzSSxZOzs7QUE0WHJCQSxhQUFhNEksVUFBYixHQUEwQjlKLFNBQTFCIiwiZmlsZSI6Im1hcC1jb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWJyYXJpZXNcbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBNYXBib3hHTE1hcCBmcm9tICdyZWFjdC1tYXAtZ2wnO1xuaW1wb3J0IGdlb1ZpZXdwb3J0IGZyb20gJ0BtYXBib3gvZ2VvLXZpZXdwb3J0JztcbmltcG9ydCBEZWNrR0wgZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQge0dMfSBmcm9tICdsdW1hLmdsJztcbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gudGhyb3R0bGUnO1xuXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgTWFwUG9wb3ZlciBmcm9tICdjb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlcic7XG5pbXBvcnQgTWFwQ29udHJvbCBmcm9tICdjb21wb25lbnRzL21hcC9tYXAtY29udHJvbCc7XG5cbi8vIGRlY2tnbCBsYXllcnNcbmltcG9ydCB7UG9seWdvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcblxuLy8gZGVmYXVsdC1zZXR0aW5nc1xuaW1wb3J0IHtNQVBCT1hfQUNDRVNTX1RPS0VOLCBMQVlFUl9CTEVORElOR1N9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLy8gdXRpbHNcbmltcG9ydCB7Z2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHN9IGZyb20gJ3V0aWxzL2xheWVyLXV0aWxzL2xheWVyLXV0aWxzJztcblxuY29uc3QgTUFQX1NUWUxFID0ge1xuICBjb250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICB9LFxuICB0b3A6IHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMHB4JywgcG9pbnRlckV2ZW50czogJ25vbmUnfVxufTtcblxuY29uc3QgZ2V0R2xDb25zdCA9IGQgPT4gR0xbZF07XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgLy8gcmVxdWlyZWRcbiAgZGF0YTogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGZpZWxkczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGludGVyYWN0aW9uQ29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxheWVyQmxlbmRpbmc6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGF5ZXJEYXRhOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbWFwU3RhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgcG9wb3Zlck9mZnNldDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIG1hcExheWVyczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25NYXBUb2dnbGVMYXllcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcENvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBoYXNCdWlsZGluZ0xheWVyOiBmYWxzZSxcbiAgICAgIHJlUmVuZGVyS2V5OiAwLFxuICAgICAgZ2w6IG51bGwsXG4gICAgICBtb3VzZVBvc2l0aW9uOiBbMCwgMF1cbiAgICB9O1xuXG4gICAgdGhpcy5sb2FkQnVpbGRpbmdUaWxlcyA9IHRocm90dGxlKHRoaXMubG9hZEJ1aWxkaW5nVGlsZXMsIDEwMCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMubWFwU3RhdGUuZHJhZ1JvdGF0ZSAhPT0gbmV4dFByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgfHxcbiAgICAgIHRoaXMucHJvcHMubGF5ZXJCbGVuZGluZyAhPT0gbmV4dFByb3BzLmxheWVyQmxlbmRpbmdcbiAgICApIHtcbiAgICAgIC8vIGluY3JlbWVudCByZXJlbmRlciBrZXkgdG8gZm9yY2UgZ2wgcmVpbml0aWFsaXplIHdoZW5cbiAgICAgIC8vIHBlcnNwZWN0aXZlIG9yIGxheWVyIGJsZW5kaW5nIGNoYW5nZWRcbiAgICAgIC8vIFRPRE86IGxheWVyIGJsZW5kaW5nIGNhbiBub3cgYmUgaW1wbGVtZW50ZWQgcGVyIGxheWVyIGJhc2VcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZVJlbmRlcktleTogdGhpcy5zdGF0ZS5yZVJlbmRlcktleSArIDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5tYXBTdHlsZSAhPT0gbmV4dFByb3BzLm1hcFN0eWxlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaGFzQnVpbGRpbmdMYXllcjogbmV4dFByb3BzLm1hcFN0eWxlLmJ1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgJiZcbiAgICAgIHRoaXMuc3RhdGUuaGFzQnVpbGRpbmdMYXllciAmJlxuICAgICAgdGhpcy5wcm9wcy5tYXBTdGF0ZSAhPT0gcHJldlByb3BzLm1hcFN0YXRlXG4gICAgKSB7XG4gICAgICB0aGlzLmxvYWRCdWlsZGluZ1RpbGVzKHRoaXMucHJvcHMubWFwU3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGNvbXBvbmVudCBhY3Rpb25zICovXG4gIGxvYWRCdWlsZGluZ1RpbGVzKG1hcFN0YXRlKSB7XG4gICAgdGhpcy5wcm9wcy5idWlsZGluZ0RhdGFBY3Rpb25zLmxvYWRCdWlsZGluZ1RpbGUobWFwU3RhdGUpO1xuICB9XG5cbiAgLyogY29tcG9uZW50IHByaXZhdGUgZnVuY3Rpb25zICovXG5cbiAgX29uQ2xvc2VNYXBQb3BvdmVyID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLm9uTGF5ZXJDbGljayhudWxsKTtcbiAgfTtcblxuICBfb25MYXllclNldERvbWFpbiA9IChpZHgsIGNvbG9yRG9tYWluKSA9PiB7XG4gICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMubGF5ZXJDb25maWdDaGFuZ2UodGhpcy5wcm9wcy5sYXllcnNbaWR4XSwge1xuICAgICAgY29sb3JEb21haW5cbiAgICB9KTtcbiAgfTtcblxuICBfb25XZWJHTEluaXRpYWxpemVkID0gZ2wgPT4ge1xuICAgIC8vIGVuYWJsZSBkZXB0aCB0ZXN0IGZvciBwZXJzcGVjdGl2ZSBtb2RlXG4gICAgaWYgKHRoaXMucHJvcHMubWFwU3RhdGUuZHJhZ1JvdGF0ZSkge1xuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoZ2wuREVQVEhfVEVTVCk7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgVWludDMyIGluZGljZXMgaW4gYnVpbGRpbmcgbGF5ZXJcbiAgICBnbC5nZXRFeHRlbnNpb24oJ09FU19lbGVtZW50X2luZGV4X3VpbnQnKTtcblxuICAgIHRoaXMuX3RvZ2dsZWxheWVyQmxlbmRpbmcoZ2wpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7Z2x9KTtcbiAgfTtcblxuICBfb25Nb3VzZU1vdmUgPSBldnQgPT4ge1xuICAgIGNvbnN0IHtpbnRlcmFjdGlvbkNvbmZpZzoge2JydXNofX0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKGV2dC5uYXRpdmVFdmVudCAmJiBicnVzaC5lbmFibGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW91c2VQb3NpdGlvbjogW2V2dC5uYXRpdmVFdmVudC5vZmZzZXRYLCBldnQubmF0aXZlRXZlbnQub2Zmc2V0WV1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfaGFuZGxlTWFwVG9nZ2xlTGF5ZXIgPSBsYXllcklkID0+IHtcbiAgICBjb25zdCB7aW5kZXg6IG1hcEluZGV4ID0gMCwgdmlzU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUxheWVyRm9yTWFwKG1hcEluZGV4LCBsYXllcklkKTtcbiAgfTtcblxuICAvKiBkZWNrLmdsIGRvZXNuJ3Qgc3VwcG9ydCBibGVuZEZ1bmNTZXBhcmF0ZSB5ZXRcbiAgICogc28gd2UncmUgYXBwbHlpbmcgdGhlIGJsZW5kaW5nIG91cnNlbHZlc1xuICAqL1xuICBfdG9nZ2xlbGF5ZXJCbGVuZGluZyA9IGdsID0+IHtcbiAgICBjb25zdCBibGVuZGluZyA9IExBWUVSX0JMRU5ESU5HU1t0aGlzLnByb3BzLmxheWVyQmxlbmRpbmddO1xuICAgIGNvbnN0IHtcbiAgICAgIGVuYWJsZSxcbiAgICAgIGJsZW5kRnVuYyxcbiAgICAgIGJsZW5kRXF1YXRpb24sXG4gICAgICBibGVuZEZ1bmNTZXBhcmF0ZSxcbiAgICAgIGJsZW5kRXF1YXRpb25TZXBhcmF0ZVxuICAgIH0gPSBibGVuZGluZztcblxuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGdsLmVuYWJsZShHTC5CTEVORCk7XG4gICAgICBpZiAoYmxlbmRGdW5jKSB7XG4gICAgICAgIGdsLmJsZW5kRnVuYyguLi5ibGVuZEZ1bmMubWFwKGdldEdsQ29uc3QpKTtcbiAgICAgICAgZ2wuYmxlbmRFcXVhdGlvbihHTFtibGVuZEVxdWF0aW9uXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZSguLi5ibGVuZEZ1bmNTZXBhcmF0ZS5tYXAoZ2V0R2xDb25zdCkpO1xuICAgICAgICBnbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoLi4uYmxlbmRFcXVhdGlvblNlcGFyYXRlLm1hcChnZXRHbENvbnN0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoR0wuQkxFTkQpO1xuICAgIH1cbiAgfTtcblxuICAvKiBjb21wb25lbnQgcmVuZGVyIGZ1bmN0aW9ucyAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG4gIF9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIoKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0aGlzIGludG8gcmVkdWNlciBzbyBpdCBjYW4gYmUgdGVzdGVkXG4gICAgY29uc3Qge1xuICAgICAgbWFwU3RhdGUsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgZGF0YXNldHMsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIGxheWVycyxcbiAgICAgIG1hcExheWVyc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gaWYgY2xpY2tlZCBzb21ldGhpbmcsIGlnbm9yZSBob3ZlciBiZWhhdmlvclxuICAgIGNvbnN0IG9iamVjdEluZm8gPSBjbGlja2VkIHx8IGhvdmVySW5mbztcbiAgICBpZiAoXG4gICAgICAhaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5lbmFibGVkIHx8XG4gICAgICAhb2JqZWN0SW5mbyB8fFxuICAgICAgIW9iamVjdEluZm8ucGlja2VkXG4gICAgKSB7XG4gICAgICAvLyBub3RoaW5nIGhvdmVyZWRcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHtsbmdMYXQsIG9iamVjdCwgbGF5ZXI6IG92ZXJsYXl9ID0gb2JqZWN0SW5mbztcblxuICAgIC8vIGRlY2tnbCBsYXllciB0byBrZXBsZXItZ2wgbGF5ZXJcbiAgICBjb25zdCBsYXllciA9IGxheWVyc1tvdmVybGF5LnByb3BzLmlkeF07XG5cbiAgICBpZiAoXG4gICAgICAhbGF5ZXIgfHxcbiAgICAgICFsYXllci5jb25maWcuaXNWaXNpYmxlIHx8XG4gICAgICAhb2JqZWN0IHx8XG4gICAgICAhbGF5ZXIuZ2V0SG92ZXJEYXRhIHx8XG4gICAgICAobWFwTGF5ZXJzICYmICFtYXBMYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZSlcbiAgICApIHtcbiAgICAgIC8vIGxheWVyIGlzIG5vdCB2aXNpYmxlXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7Y29uZmlnOiB7ZGF0YUlkfX0gPSBsYXllcjtcbiAgICBjb25zdCB7YWxsRGF0YSwgZmllbGRzfSA9IGRhdGFzZXRzW2RhdGFJZF07XG4gICAgY29uc3QgZGF0YSA9IGxheWVyLmdldEhvdmVyRGF0YShvYmplY3QsIGFsbERhdGEpO1xuXG4gICAgLy8gcHJvamVjdCBsbmdsYXQgdG8gc2NyZWVuIHNvIHRoYXQgdG9vbHRpcCBmb2xsb3dzIHRoZSBvYmplY3Qgb24gem9vbVxuICAgIGNvbnN0IHt2aWV3cG9ydH0gPSBvdmVybGF5LmNvbnRleHQ7XG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5fZ2V0SG92ZXJYWSh2aWV3cG9ydCwgbG5nTGF0KSB8fCBvYmplY3RJbmZvO1xuXG4gICAgY29uc3QgcG9wb3ZlclByb3BzID0ge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGZpZWxkc1RvU2hvdzogaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF0sXG4gICAgICBsYXllcixcbiAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgZnJlZXplZDogQm9vbGVhbihjbGlja2VkKSxcbiAgICAgIG9uQ2xvc2U6IHRoaXMuX29uQ2xvc2VNYXBQb3BvdmVyLFxuICAgICAgbWFwU3RhdGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxNYXBQb3BvdmVyIHsuLi5wb3BvdmVyUHJvcHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gIF9nZXRIb3ZlclhZKHZpZXdwb3J0LCBsbmdMYXQpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZCA9ICF2aWV3cG9ydCB8fCAhbG5nTGF0ID8gbnVsbCA6IHZpZXdwb3J0LnByb2plY3QobG5nTGF0KTtcblxuICAgIHJldHVybiBzY3JlZW5Db29yZCAmJiB7eDogc2NyZWVuQ29vcmRbMF0sIHk6IHNjcmVlbkNvb3JkWzFdfTtcbiAgfVxuXG4gIF9yZW5kZXJCdWlsZGluZ0xheWVyKGxheWVyLCBidWlsZGluZ0RhdGEsIG1hcFN0YXRlKSB7XG4gICAgY29uc3Qge2xvbmdpdHVkZSwgbGF0aXR1ZGUsIHpvb20sIHdpZHRoLCBoZWlnaHR9ID0gbWFwU3RhdGU7XG4gICAgY29uc3QgYmJveCA9IGdlb1ZpZXdwb3J0LmJvdW5kcyhbbG9uZ2l0dWRlLCBsYXRpdHVkZV0sIE1hdGguZmxvb3Ioem9vbSksIFtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0XG4gICAgXSk7XG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IGdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJib3gpO1xuXG4gICAgLy8gcmVuZGVyIG9uZSBsYXllciBwZXIgdGlsZVxuICAgIHJldHVybiBidWlsZGluZ0RhdGEubWFwKFxuICAgICAgKHt0aWxlSWQsIGRhdGF9KSA9PlxuICAgICAgICBuZXcgUG9seWdvbkxheWVyKHtcbiAgICAgICAgICBpZDogdGlsZUlkLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZnA2NDogTWF0aC5mbG9vcih6b29tKSA+PSAxNixcbiAgICAgICAgICBleHRydWRlZDogdHJ1ZSxcbiAgICAgICAgICBnZXRGaWxsQ29sb3I6IGYgPT4gbGF5ZXIuY29sb3IsXG4gICAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICAgIGdldEZpbGxDb2xvcjogbGF5ZXIuY29sb3JcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxpZ2h0U2V0dGluZ3MsXG4gICAgICAgICAgZ2V0UG9seWdvbjogZiA9PiBmLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIGdldEVsZXZhdGlvbjogZiA9PiBmLnByb3BlcnRpZXMuaGVpZ2h0LFxuICAgICAgICAgIG9wYWNpdHk6IGxheWVyLm9wYWNpdHlcbiAgICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgX3Nob3VsZFJlbmRlckxheWVyKGxheWVyLCBkYXRhLCBtYXBMYXllcnMpIHtcbiAgICBjb25zdCBpc0F2YWlsYWJsZUFuZFZpc2libGUgPVxuICAgICAgIShtYXBMYXllcnMgJiYgbWFwTGF5ZXJzW2xheWVyLmlkXSkgfHwgbWFwTGF5ZXJzW2xheWVyLmlkXS5pc1Zpc2libGU7XG4gICAgcmV0dXJuIGxheWVyLnNob3VsZFJlbmRlckxheWVyKGRhdGEpICYmIGlzQXZhaWxhYmxlQW5kVmlzaWJsZTtcbiAgfVxuXG4gIF9yZW5kZXJMYXllciA9IChvdmVybGF5cywgaWR4KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJEYXRhLFxuICAgICAgaG92ZXJJbmZvLFxuICAgICAgY2xpY2tlZCxcbiAgICAgIG1hcExheWVycyxcbiAgICAgIG1hcFN0YXRlLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWdcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7bW91c2VQb3NpdGlvbn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGxheWVyID0gbGF5ZXJzW2lkeF07XG4gICAgY29uc3QgZGF0YSA9IGxheWVyRGF0YVtpZHhdO1xuXG4gICAgY29uc3QgbGF5ZXJJbnRlcmFjdGlvbiA9IHtcbiAgICAgIG9uSG92ZXI6IHZpc1N0YXRlQWN0aW9ucy5vbkxheWVySG92ZXIsXG4gICAgICBvbkNsaWNrOiB2aXNTdGF0ZUFjdGlvbnMub25MYXllckNsaWNrLFxuICAgICAgbW91c2VQb3NpdGlvblxuICAgIH07XG5cbiAgICBjb25zdCBvYmplY3RIb3ZlcmVkID0gY2xpY2tlZCB8fCBob3ZlckluZm87XG4gICAgY29uc3QgbGF5ZXJDYWxsYmFja3MgPSB7XG4gICAgICBvblNldExheWVyRG9tYWluOiB2YWwgPT4gdGhpcy5fb25MYXllclNldERvbWFpbihpZHgsIHZhbClcbiAgICB9O1xuXG4gICAgaWYgKCF0aGlzLl9zaG91bGRSZW5kZXJMYXllcihsYXllciwgZGF0YSwgbWFwTGF5ZXJzKSkge1xuICAgICAgcmV0dXJuIG92ZXJsYXlzO1xuICAgIH1cblxuICAgIGxldCBsYXllck92ZXJsYXkgPSBbXTtcblxuICAgIC8vIExheWVyIGlzIExheWVyIGNsYXNzXG4gICAgaWYgKHR5cGVvZiBsYXllci5yZW5kZXJMYXllciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGF5ZXJPdmVybGF5ID0gbGF5ZXIucmVuZGVyTGF5ZXIoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBpZHgsXG4gICAgICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIG9iamVjdEhvdmVyZWQsXG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgICAgbGF5ZXJDYWxsYmFja3NcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChsYXllck92ZXJsYXkubGVuZ3RoKSB7XG4gICAgICBvdmVybGF5cyA9IG92ZXJsYXlzLmNvbmNhdChsYXllck92ZXJsYXkpO1xuICAgIH1cbiAgICByZXR1cm4gb3ZlcmxheXM7XG4gIH07XG5cbiAgX3JlbmRlck92ZXJsYXkoKSB7XG4gICAgY29uc3Qge1xuICAgICAgbWFwU3RhdGUsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIGxheWVyRGF0YSxcbiAgICAgIGxheWVyT3JkZXJcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7aGFzQnVpbGRpbmdMYXllcn0gPSB0aGlzLnN0YXRlO1xuXG4gICAgbGV0IGRlY2tHbExheWVycyA9IFtdO1xuXG4gICAgLy8gd2FpdCB1bnRpbCBkYXRhIGlzIHJlYWR5IGJlZm9yZSByZW5kZXIgZGF0YSBsYXllcnNcbiAgICBpZiAobGF5ZXJEYXRhICYmIGxheWVyRGF0YS5sZW5ndGgpIHtcbiAgICAgIC8vIGxhc3QgbGF5ZXIgcmVuZGVyIGZpcnN0XG4gICAgICBkZWNrR2xMYXllcnMgPSBsYXllck9yZGVyXG4gICAgICAgIC5zbGljZSgpXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLnJlZHVjZSh0aGlzLl9yZW5kZXJMYXllciwgW10pO1xuICAgIH1cblxuICAgIC8vIGFkZCAzZCBidWlsZGluZyBsYXllclxuICAgIGlmIChoYXNCdWlsZGluZ0xheWVyKSB7XG4gICAgICBkZWNrR2xMYXllcnMgPSBkZWNrR2xMYXllcnMuY29uY2F0KFxuICAgICAgICB0aGlzLl9yZW5kZXJCdWlsZGluZ0xheWVyKFxuICAgICAgICAgIG1hcFN0eWxlLmJ1aWxkaW5nTGF5ZXIsXG4gICAgICAgICAgYnVpbGRpbmdEYXRhLFxuICAgICAgICAgIG1hcFN0YXRlXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEZWNrR0xcbiAgICAgICAgey4uLm1hcFN0YXRlfVxuICAgICAgICBpZD1cImRlZmF1bHQtZGVja2dsLW92ZXJsYXlcIlxuICAgICAgICBsYXllcnM9e2RlY2tHbExheWVyc31cbiAgICAgICAga2V5PXt0aGlzLnN0YXRlLnJlUmVuZGVyS2V5fVxuICAgICAgICBvbldlYkdMSW5pdGlhbGl6ZWQ9e3RoaXMuX29uV2ViR0xJbml0aWFsaXplZH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFwU3RhdGUsIG1hcFN0eWxlLCBtYXBTdGF0ZUFjdGlvbnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dXBkYXRlTWFwLCBvbk1hcENsaWNrfSA9IG1hcFN0YXRlQWN0aW9ucztcblxuICAgIGlmICghbWFwU3R5bGUuYm90dG9tTWFwU3R5bGUpIHtcbiAgICAgIC8vIHN0eWxlIG5vdCB5ZXQgbG9hZGVkXG4gICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICB9XG5cbiAgICBjb25zdCB7bWFwTGF5ZXJzLCBsYXllcnMsIGRhdGFzZXRzLCBpbmRleH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbWFwUHJvcHMgPSB7XG4gICAgICAuLi5tYXBTdGF0ZSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSxcbiAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBNQVBCT1hfQUNDRVNTX1RPS0VOLFxuICAgICAgb25WaWV3cG9ydENoYW5nZTogdXBkYXRlTWFwXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtNQVBfU1RZTEUuY29udGFpbmVyfSBvbk1vdXNlTW92ZT17dGhpcy5fb25Nb3VzZU1vdmV9PlxuICAgICAgICA8TWFwQ29udHJvbFxuICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgZHJhZ1JvdGF0ZT17bWFwU3RhdGUuZHJhZ1JvdGF0ZX1cbiAgICAgICAgICBpc1NwbGl0PXttYXBTdGF0ZS5pc1NwbGl0fVxuICAgICAgICAgIGlzRnVsbFNjcmVlbj17bWFwU3RhdGUuaXNGdWxsU2NyZWVufVxuICAgICAgICAgIGxheWVycz17bGF5ZXJzfVxuICAgICAgICAgIG1hcEluZGV4PXt0aGlzLnByb3BzLmluZGV4fVxuICAgICAgICAgIG1hcExheWVycz17bWFwTGF5ZXJzfVxuICAgICAgICAgIG9uVG9nZ2xlUGVyc3BlY3RpdmU9e21hcFN0YXRlQWN0aW9ucy50b2dnbGVQZXJzcGVjdGl2ZX1cbiAgICAgICAgICBvblRvZ2dsZVNwbGl0TWFwPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlU3BsaXRNYXB9XG4gICAgICAgICAgb25NYXBUb2dnbGVMYXllcj17dGhpcy5faGFuZGxlTWFwVG9nZ2xlTGF5ZXJ9XG4gICAgICAgICAgb25Ub2dnbGVGdWxsU2NyZWVuPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlRnVsbFNjcmVlbn1cbiAgICAgICAgICB0b3A9ezB9XG4gICAgICAgIC8+XG4gICAgICAgIDxNYXBib3hHTE1hcFxuICAgICAgICAgIHsuLi5tYXBQcm9wc31cbiAgICAgICAgICBrZXk9XCJib3R0b21cIlxuICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS5ib3R0b21NYXBTdHlsZX1cbiAgICAgICAgICBvbkNsaWNrPXtvbk1hcENsaWNrfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMuX3JlbmRlck92ZXJsYXkoKX1cbiAgICAgICAgPC9NYXBib3hHTE1hcD5cbiAgICAgICAge21hcFN0eWxlLnRvcE1hcFN0eWxlICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtNQVBfU1RZTEUudG9wfT5cbiAgICAgICAgICAgIDxNYXBib3hHTE1hcFxuICAgICAgICAgICAgICB7Li4ubWFwUHJvcHN9XG4gICAgICAgICAgICAgIGtleT1cInRvcFwiXG4gICAgICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS50b3BNYXBTdHlsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLl9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTWFwQ29udGFpbmVyLnByb3BzVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=