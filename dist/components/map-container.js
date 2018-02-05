'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

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

var _mapControl = require('./map-control');

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

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

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
          gl.blendFunc.apply(gl, blendFunc.map(getGlConst));
          gl.blendEquation(_luma.GL[blendEquation]);
        } else {
          gl.blendFuncSeparate.apply(gl, blendFuncSeparate.map(getGlConst));
          gl.blendEquationSeparate.apply(gl, blendEquationSeparate.map(getGlConst));
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

  MapContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
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
  };

  MapContainer.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.props.mapState.dragRotate && this.state.hasBuildingLayer && this.props.mapState !== prevProps.mapState) {
      this.loadBuildingTiles(this.props.mapState);
    }
  };

  /* component actions */


  MapContainer.prototype.loadBuildingTiles = function loadBuildingTiles(mapState) {
    this.props.buildingDataActions.loadBuildingTile(mapState);
  };

  /* component private functions */

  /* deck.gl doesn't support blendFuncSeparate yet
   * so we're applying the blending ourselves
  */


  /* component render functions */
  /* eslint-disable complexity */
  MapContainer.prototype._renderObjectLayerPopover = function _renderObjectLayerPopover() {
    // TODO: move this into reducer so it can be tested
    var _props = this.props,
        mapState = _props.mapState,
        hoverInfo = _props.hoverInfo,
        clicked = _props.clicked,
        datasets = _props.datasets,
        interactionConfig = _props.interactionConfig,
        layers = _props.layers,
        mapLayers = _props.mapLayers,
        popoverOffset = _props.popoverOffset;

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
      y: y + popoverOffset.top,
      freezed: Boolean(clicked),
      onClose: this._onCloseMapPopover,
      mapState: mapState
    };

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_mapPopover2.default, popoverProps)
    );
  };
  /* eslint-enable complexity */

  MapContainer.prototype._getHoverXY = function _getHoverXY(viewport, lngLat) {
    var screenCoord = !viewport || !lngLat ? null : viewport.project(lngLat);

    return screenCoord && { x: screenCoord[0], y: screenCoord[1] };
  };

  MapContainer.prototype._renderBuildingLayer = function _renderBuildingLayer(layer, buildingData, mapState) {
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
  };

  MapContainer.prototype._shouldRenderLayer = function _shouldRenderLayer(layer, data, mapLayers) {
    var isAvailableAndVisible = !(mapLayers && mapLayers[layer.id]) || mapLayers[layer.id].isVisible;
    return layer.shouldRenderLayer(data) && isAvailableAndVisible;
  };

  MapContainer.prototype._renderOverlay = function _renderOverlay() {
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
  };

  MapContainer.prototype.render = function render() {
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
  };

  return MapContainer;
}(_react.Component);

exports.default = MapContainer;


MapContainer.propsTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiTUFQX1NUWUxFIiwiY29udGFpbmVyIiwiZGlzcGxheSIsInBvc2l0aW9uIiwidG9wIiwicG9pbnRlckV2ZW50cyIsImdldEdsQ29uc3QiLCJkIiwicHJvcFR5cGVzIiwiZGF0YSIsImFycmF5IiwiaXNSZXF1aXJlZCIsImZpZWxkcyIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVyRGF0YSIsImxheWVycyIsIm1hcFN0YXRlIiwibWFwU3R5bGUiLCJwb3BvdmVyT2Zmc2V0IiwibWFwTGF5ZXJzIiwiUHJvcFR5cGVzIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBDb250YWluZXIiLCJwcm9wcyIsIl9vbkNsb3NlTWFwUG9wb3ZlciIsInZpc1N0YXRlQWN0aW9ucyIsIm9uTGF5ZXJDbGljayIsIl9vbkxheWVyU2V0RG9tYWluIiwiaWR4IiwiY29sb3JEb21haW4iLCJsYXllckNvbmZpZ0NoYW5nZSIsIl9vbldlYkdMSW5pdGlhbGl6ZWQiLCJkcmFnUm90YXRlIiwiZ2wiLCJlbmFibGUiLCJERVBUSF9URVNUIiwiZGVwdGhGdW5jIiwiTEVRVUFMIiwiZGlzYWJsZSIsImdldEV4dGVuc2lvbiIsIl90b2dnbGVsYXllckJsZW5kaW5nIiwic2V0U3RhdGUiLCJfb25Nb3VzZU1vdmUiLCJicnVzaCIsImV2dCIsIm5hdGl2ZUV2ZW50IiwiZW5hYmxlZCIsIm1vdXNlUG9zaXRpb24iLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl9oYW5kbGVNYXBUb2dnbGVMYXllciIsImluZGV4IiwibWFwSW5kZXgiLCJ0b2dnbGVMYXllckZvck1hcCIsImxheWVySWQiLCJibGVuZGluZyIsImJsZW5kRnVuYyIsImJsZW5kRXF1YXRpb24iLCJibGVuZEZ1bmNTZXBhcmF0ZSIsImJsZW5kRXF1YXRpb25TZXBhcmF0ZSIsIkJMRU5EIiwibWFwIiwiX3JlbmRlckxheWVyIiwib3ZlcmxheXMiLCJob3ZlckluZm8iLCJjbGlja2VkIiwic3RhdGUiLCJsYXllciIsImxheWVySW50ZXJhY3Rpb24iLCJvbkhvdmVyIiwib25MYXllckhvdmVyIiwib25DbGljayIsIm9iamVjdEhvdmVyZWQiLCJsYXllckNhbGxiYWNrcyIsIm9uU2V0TGF5ZXJEb21haW4iLCJ2YWwiLCJfc2hvdWxkUmVuZGVyTGF5ZXIiLCJsYXllck92ZXJsYXkiLCJyZW5kZXJMYXllciIsImxlbmd0aCIsImNvbmNhdCIsImhhc0J1aWxkaW5nTGF5ZXIiLCJyZVJlbmRlcktleSIsImxvYWRCdWlsZGluZ1RpbGVzIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsImJ1aWxkaW5nTGF5ZXIiLCJpc1Zpc2libGUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJidWlsZGluZ0RhdGFBY3Rpb25zIiwibG9hZEJ1aWxkaW5nVGlsZSIsIl9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIiLCJkYXRhc2V0cyIsIm9iamVjdEluZm8iLCJ0b29sdGlwIiwicGlja2VkIiwibG5nTGF0Iiwib3ZlcmxheSIsImNvbmZpZyIsImdldEhvdmVyRGF0YSIsImlkIiwiZGF0YUlkIiwiYWxsRGF0YSIsInZpZXdwb3J0IiwiY29udGV4dCIsIl9nZXRIb3ZlclhZIiwieCIsInkiLCJwb3BvdmVyUHJvcHMiLCJmaWVsZHNUb1Nob3ciLCJmcmVlemVkIiwiQm9vbGVhbiIsIm9uQ2xvc2UiLCJzY3JlZW5Db29yZCIsInByb2plY3QiLCJfcmVuZGVyQnVpbGRpbmdMYXllciIsImJ1aWxkaW5nRGF0YSIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiem9vbSIsIndpZHRoIiwiaGVpZ2h0IiwiYmJveCIsImJvdW5kcyIsIk1hdGgiLCJmbG9vciIsImxpZ2h0U2V0dGluZ3MiLCJ0aWxlSWQiLCJmcDY0IiwiZXh0cnVkZWQiLCJnZXRGaWxsQ29sb3IiLCJjb2xvciIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0UG9seWdvbiIsImYiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0RWxldmF0aW9uIiwicHJvcGVydGllcyIsIm9wYWNpdHkiLCJpc0F2YWlsYWJsZUFuZFZpc2libGUiLCJzaG91bGRSZW5kZXJMYXllciIsIl9yZW5kZXJPdmVybGF5IiwibGF5ZXJPcmRlciIsImRlY2tHbExheWVycyIsInNsaWNlIiwicmV2ZXJzZSIsInJlZHVjZSIsInJlbmRlciIsIm1hcFN0YXRlQWN0aW9ucyIsInVwZGF0ZU1hcCIsIm9uTWFwQ2xpY2siLCJib3R0b21NYXBTdHlsZSIsIm1hcFByb3BzIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJvblZpZXdwb3J0Q2hhbmdlIiwiaXNTcGxpdCIsImlzRnVsbFNjcmVlbiIsInRvZ2dsZVBlcnNwZWN0aXZlIiwidG9nZ2xlU3BsaXRNYXAiLCJ0b2dnbGVGdWxsU2NyZWVuIiwidG9wTWFwU3R5bGUiLCJwcm9wc1R5cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFNQTs7QUFHQTs7OztBQUpBO0FBaEJBO0FBc0JBLElBQU1BLFlBQVk7QUFDaEJDLGFBQVc7QUFDVEMsYUFBUyxjQURBO0FBRVRDLGNBQVU7QUFGRCxHQURLO0FBS2hCQyxPQUFLLEVBQUNELFVBQVUsVUFBWCxFQUF1QkMsS0FBSyxLQUE1QixFQUFtQ0MsZUFBZSxNQUFsRDtBQUxXLENBQWxCOztBQUhBOzs7QUFOQTs7O0FBSkE7OztBQXFCQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWE7QUFBQSxTQUFLLFNBQUdDLENBQUgsQ0FBTDtBQUFBLENBQW5COztBQUVBLElBQU1DLFlBQVk7QUFDaEI7QUFDQUMsUUFBTSxvQkFBVUMsS0FBVixDQUFnQkMsVUFGTjtBQUdoQkMsVUFB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SSxTQUFTb0o7QUFIckI7QUFERixPQXpCSjtBQWlDRyxXQUFLdkUseUJBQUw7QUFqQ0gsS0FERjtBQXFDRCxHOzs7OztrQkExWGtCdkUsWTs7O0FBNlhyQkEsYUFBYStJLFVBQWIsR0FBMEJqSyxTQUExQiIsImZpbGUiOiJtYXAtY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGlicmFyaWVzXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTWFwYm94R0xNYXAgZnJvbSAncmVhY3QtbWFwLWdsJztcbmltcG9ydCBnZW9WaWV3cG9ydCBmcm9tICdAbWFwYm94L2dlby12aWV3cG9ydCc7XG5pbXBvcnQgRGVja0dMIGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtHTH0gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoLnRocm90dGxlJztcblxuLy8gY29tcG9uZW50c1xuaW1wb3J0IE1hcFBvcG92ZXIgZnJvbSAnY29tcG9uZW50cy9tYXAvbWFwLXBvcG92ZXInO1xuaW1wb3J0IE1hcENvbnRyb2wgZnJvbSAnY29tcG9uZW50cy9tYXAtY29udHJvbCc7XG5cbi8vIGRlY2tnbCBsYXllcnNcbmltcG9ydCB7UG9seWdvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcblxuLy8gZGVmYXVsdC1zZXR0aW5nc1xuaW1wb3J0IHtNQVBCT1hfQUNDRVNTX1RPS0VOLCBMQVlFUl9CTEVORElOR1N9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLy8gdXRpbHNcbmltcG9ydCB7Z2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHN9IGZyb20gJ3V0aWxzL2xheWVyLXV0aWxzL2xheWVyLXV0aWxzJztcblxuY29uc3QgTUFQX1NUWUxFID0ge1xuICBjb250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICB9LFxuICB0b3A6IHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMHB4JywgcG9pbnRlckV2ZW50czogJ25vbmUnfVxufTtcblxuY29uc3QgZ2V0R2xDb25zdCA9IGQgPT4gR0xbZF07XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgLy8gcmVxdWlyZWRcbiAgZGF0YTogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGZpZWxkczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGludGVyYWN0aW9uQ29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxheWVyQmxlbmRpbmc6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGF5ZXJEYXRhOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbWFwU3RhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgcG9wb3Zlck9mZnNldDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIG1hcExheWVyczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25NYXBUb2dnbGVMYXllcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcENvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBoYXNCdWlsZGluZ0xheWVyOiBmYWxzZSxcbiAgICAgIHJlUmVuZGVyS2V5OiAwLFxuICAgICAgZ2w6IG51bGwsXG4gICAgICBtb3VzZVBvc2l0aW9uOiBbMCwgMF1cbiAgICB9O1xuXG4gICAgdGhpcy5sb2FkQnVpbGRpbmdUaWxlcyA9IHRocm90dGxlKHRoaXMubG9hZEJ1aWxkaW5nVGlsZXMsIDEwMCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMubWFwU3RhdGUuZHJhZ1JvdGF0ZSAhPT0gbmV4dFByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgfHxcbiAgICAgIHRoaXMucHJvcHMubGF5ZXJCbGVuZGluZyAhPT0gbmV4dFByb3BzLmxheWVyQmxlbmRpbmdcbiAgICApIHtcbiAgICAgIC8vIGluY3JlbWVudCByZXJlbmRlciBrZXkgdG8gZm9yY2UgZ2wgcmVpbml0aWFsaXplIHdoZW5cbiAgICAgIC8vIHBlcnNwZWN0aXZlIG9yIGxheWVyIGJsZW5kaW5nIGNoYW5nZWRcbiAgICAgIC8vIFRPRE86IGxheWVyIGJsZW5kaW5nIGNhbiBub3cgYmUgaW1wbGVtZW50ZWQgcGVyIGxheWVyIGJhc2VcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZVJlbmRlcktleTogdGhpcy5zdGF0ZS5yZVJlbmRlcktleSArIDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5tYXBTdHlsZSAhPT0gbmV4dFByb3BzLm1hcFN0eWxlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaGFzQnVpbGRpbmdMYXllcjogbmV4dFByb3BzLm1hcFN0eWxlLmJ1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgJiZcbiAgICAgIHRoaXMuc3RhdGUuaGFzQnVpbGRpbmdMYXllciAmJlxuICAgICAgdGhpcy5wcm9wcy5tYXBTdGF0ZSAhPT0gcHJldlByb3BzLm1hcFN0YXRlXG4gICAgKSB7XG4gICAgICB0aGlzLmxvYWRCdWlsZGluZ1RpbGVzKHRoaXMucHJvcHMubWFwU3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGNvbXBvbmVudCBhY3Rpb25zICovXG4gIGxvYWRCdWlsZGluZ1RpbGVzKG1hcFN0YXRlKSB7XG4gICAgdGhpcy5wcm9wcy5idWlsZGluZ0RhdGFBY3Rpb25zLmxvYWRCdWlsZGluZ1RpbGUobWFwU3RhdGUpO1xuICB9XG5cbiAgLyogY29tcG9uZW50IHByaXZhdGUgZnVuY3Rpb25zICovXG5cbiAgX29uQ2xvc2VNYXBQb3BvdmVyID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLm9uTGF5ZXJDbGljayhudWxsKTtcbiAgfTtcblxuICBfb25MYXllclNldERvbWFpbiA9IChpZHgsIGNvbG9yRG9tYWluKSA9PiB7XG4gICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMubGF5ZXJDb25maWdDaGFuZ2UodGhpcy5wcm9wcy5sYXllcnNbaWR4XSwge1xuICAgICAgY29sb3JEb21haW5cbiAgICB9KTtcbiAgfTtcblxuICBfb25XZWJHTEluaXRpYWxpemVkID0gZ2wgPT4ge1xuICAgIC8vIGVuYWJsZSBkZXB0aCB0ZXN0IGZvciBwZXJzcGVjdGl2ZSBtb2RlXG4gICAgaWYgKHRoaXMucHJvcHMubWFwU3RhdGUuZHJhZ1JvdGF0ZSkge1xuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoZ2wuREVQVEhfVEVTVCk7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgVWludDMyIGluZGljZXMgaW4gYnVpbGRpbmcgbGF5ZXJcbiAgICBnbC5nZXRFeHRlbnNpb24oJ09FU19lbGVtZW50X2luZGV4X3VpbnQnKTtcblxuICAgIHRoaXMuX3RvZ2dsZWxheWVyQmxlbmRpbmcoZ2wpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7Z2x9KTtcbiAgfTtcblxuICBfb25Nb3VzZU1vdmUgPSBldnQgPT4ge1xuICAgIGNvbnN0IHtpbnRlcmFjdGlvbkNvbmZpZzoge2JydXNofX0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKGV2dC5uYXRpdmVFdmVudCAmJiBicnVzaC5lbmFibGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW91c2VQb3NpdGlvbjogW2V2dC5uYXRpdmVFdmVudC5vZmZzZXRYLCBldnQubmF0aXZlRXZlbnQub2Zmc2V0WV1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfaGFuZGxlTWFwVG9nZ2xlTGF5ZXIgPSBsYXllcklkID0+IHtcbiAgICBjb25zdCB7aW5kZXg6IG1hcEluZGV4ID0gMCwgdmlzU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUxheWVyRm9yTWFwKG1hcEluZGV4LCBsYXllcklkKTtcbiAgfTtcblxuICAvKiBkZWNrLmdsIGRvZXNuJ3Qgc3VwcG9ydCBibGVuZEZ1bmNTZXBhcmF0ZSB5ZXRcbiAgICogc28gd2UncmUgYXBwbHlpbmcgdGhlIGJsZW5kaW5nIG91cnNlbHZlc1xuICAqL1xuICBfdG9nZ2xlbGF5ZXJCbGVuZGluZyA9IGdsID0+IHtcbiAgICBjb25zdCBibGVuZGluZyA9IExBWUVSX0JMRU5ESU5HU1t0aGlzLnByb3BzLmxheWVyQmxlbmRpbmddO1xuICAgIGNvbnN0IHtcbiAgICAgIGVuYWJsZSxcbiAgICAgIGJsZW5kRnVuYyxcbiAgICAgIGJsZW5kRXF1YXRpb24sXG4gICAgICBibGVuZEZ1bmNTZXBhcmF0ZSxcbiAgICAgIGJsZW5kRXF1YXRpb25TZXBhcmF0ZVxuICAgIH0gPSBibGVuZGluZztcblxuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGdsLmVuYWJsZShHTC5CTEVORCk7XG4gICAgICBpZiAoYmxlbmRGdW5jKSB7XG4gICAgICAgIGdsLmJsZW5kRnVuYyguLi5ibGVuZEZ1bmMubWFwKGdldEdsQ29uc3QpKTtcbiAgICAgICAgZ2wuYmxlbmRFcXVhdGlvbihHTFtibGVuZEVxdWF0aW9uXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZSguLi5ibGVuZEZ1bmNTZXBhcmF0ZS5tYXAoZ2V0R2xDb25zdCkpO1xuICAgICAgICBnbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoLi4uYmxlbmRFcXVhdGlvblNlcGFyYXRlLm1hcChnZXRHbENvbnN0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoR0wuQkxFTkQpO1xuICAgIH1cbiAgfTtcblxuICAvKiBjb21wb25lbnQgcmVuZGVyIGZ1bmN0aW9ucyAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG4gIF9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIoKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0aGlzIGludG8gcmVkdWNlciBzbyBpdCBjYW4gYmUgdGVzdGVkXG4gICAgY29uc3Qge1xuICAgICAgbWFwU3RhdGUsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgZGF0YXNldHMsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIGxheWVycyxcbiAgICAgIG1hcExheWVycyxcbiAgICAgIHBvcG92ZXJPZmZzZXRcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGlmIGNsaWNrZWQgc29tZXRoaW5nLCBpZ25vcmUgaG92ZXIgYmVoYXZpb3JcbiAgICBjb25zdCBvYmplY3RJbmZvID0gY2xpY2tlZCB8fCBob3ZlckluZm87XG4gICAgaWYgKFxuICAgICAgIWludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuZW5hYmxlZCB8fFxuICAgICAgIW9iamVjdEluZm8gfHxcbiAgICAgICFvYmplY3RJbmZvLnBpY2tlZFxuICAgICkge1xuICAgICAgLy8gbm90aGluZyBob3ZlcmVkXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7bG5nTGF0LCBvYmplY3QsIGxheWVyOiBvdmVybGF5fSA9IG9iamVjdEluZm87XG5cbiAgICAvLyBkZWNrZ2wgbGF5ZXIgdG8ga2VwbGVyLWdsIGxheWVyXG4gICAgY29uc3QgbGF5ZXIgPSBsYXllcnNbb3ZlcmxheS5wcm9wcy5pZHhdO1xuXG4gICAgaWYgKFxuICAgICAgIWxheWVyIHx8XG4gICAgICAhbGF5ZXIuY29uZmlnLmlzVmlzaWJsZSB8fFxuICAgICAgIW9iamVjdCB8fFxuICAgICAgIWxheWVyLmdldEhvdmVyRGF0YSB8fFxuICAgICAgKG1hcExheWVycyAmJiAhbWFwTGF5ZXJzW2xheWVyLmlkXS5pc1Zpc2libGUpXG4gICAgKSB7XG4gICAgICAvLyBsYXllciBpcyBub3QgdmlzaWJsZVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge2NvbmZpZzoge2RhdGFJZH19ID0gbGF5ZXI7XG4gICAgY29uc3Qge2FsbERhdGEsIGZpZWxkc30gPSBkYXRhc2V0c1tkYXRhSWRdO1xuICAgIGNvbnN0IGRhdGEgPSBsYXllci5nZXRIb3ZlckRhdGEob2JqZWN0LCBhbGxEYXRhKTtcblxuICAgIC8vIHByb2plY3QgbG5nbGF0IHRvIHNjcmVlbiBzbyB0aGF0IHRvb2x0aXAgZm9sbG93cyB0aGUgb2JqZWN0IG9uIHpvb21cbiAgICBjb25zdCB7dmlld3BvcnR9ID0gb3ZlcmxheS5jb250ZXh0O1xuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2dldEhvdmVyWFkodmlld3BvcnQsIGxuZ0xhdCkgfHwgb2JqZWN0SW5mbztcblxuICAgIGNvbnN0IHBvcG92ZXJQcm9wcyA9IHtcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZHMsXG4gICAgICBmaWVsZHNUb1Nob3c6IGludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdLFxuICAgICAgbGF5ZXIsXG4gICAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgICB4LFxuICAgICAgeTogeSArIHBvcG92ZXJPZmZzZXQudG9wLFxuICAgICAgZnJlZXplZDogQm9vbGVhbihjbGlja2VkKSxcbiAgICAgIG9uQ2xvc2U6IHRoaXMuX29uQ2xvc2VNYXBQb3BvdmVyLFxuICAgICAgbWFwU3RhdGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxNYXBQb3BvdmVyIHsuLi5wb3BvdmVyUHJvcHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gIF9nZXRIb3ZlclhZKHZpZXdwb3J0LCBsbmdMYXQpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZCA9ICF2aWV3cG9ydCB8fCAhbG5nTGF0ID8gbnVsbCA6IHZpZXdwb3J0LnByb2plY3QobG5nTGF0KTtcblxuICAgIHJldHVybiBzY3JlZW5Db29yZCAmJiB7eDogc2NyZWVuQ29vcmRbMF0sIHk6IHNjcmVlbkNvb3JkWzFdfTtcbiAgfVxuXG4gIF9yZW5kZXJCdWlsZGluZ0xheWVyKGxheWVyLCBidWlsZGluZ0RhdGEsIG1hcFN0YXRlKSB7XG4gICAgY29uc3Qge2xvbmdpdHVkZSwgbGF0aXR1ZGUsIHpvb20sIHdpZHRoLCBoZWlnaHR9ID0gbWFwU3RhdGU7XG4gICAgY29uc3QgYmJveCA9IGdlb1ZpZXdwb3J0LmJvdW5kcyhbbG9uZ2l0dWRlLCBsYXRpdHVkZV0sIE1hdGguZmxvb3Ioem9vbSksIFtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0XG4gICAgXSk7XG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IGdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJib3gpO1xuXG4gICAgLy8gcmVuZGVyIG9uZSBsYXllciBwZXIgdGlsZVxuICAgIHJldHVybiBidWlsZGluZ0RhdGEubWFwKFxuICAgICAgKHt0aWxlSWQsIGRhdGF9KSA9PlxuICAgICAgICBuZXcgUG9seWdvbkxheWVyKHtcbiAgICAgICAgICBpZDogdGlsZUlkLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZnA2NDogTWF0aC5mbG9vcih6b29tKSA+PSAxNixcbiAgICAgICAgICBleHRydWRlZDogdHJ1ZSxcbiAgICAgICAgICBnZXRGaWxsQ29sb3I6IGYgPT4gbGF5ZXIuY29sb3IsXG4gICAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICAgIGdldEZpbGxDb2xvcjogbGF5ZXIuY29sb3JcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxpZ2h0U2V0dGluZ3MsXG4gICAgICAgICAgZ2V0UG9seWdvbjogZiA9PiBmLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIGdldEVsZXZhdGlvbjogZiA9PiBmLnByb3BlcnRpZXMuaGVpZ2h0LFxuICAgICAgICAgIG9wYWNpdHk6IGxheWVyLm9wYWNpdHlcbiAgICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgX3Nob3VsZFJlbmRlckxheWVyKGxheWVyLCBkYXRhLCBtYXBMYXllcnMpIHtcbiAgICBjb25zdCBpc0F2YWlsYWJsZUFuZFZpc2libGUgPVxuICAgICAgIShtYXBMYXllcnMgJiYgbWFwTGF5ZXJzW2xheWVyLmlkXSkgfHwgbWFwTGF5ZXJzW2xheWVyLmlkXS5pc1Zpc2libGU7XG4gICAgcmV0dXJuIGxheWVyLnNob3VsZFJlbmRlckxheWVyKGRhdGEpICYmIGlzQXZhaWxhYmxlQW5kVmlzaWJsZTtcbiAgfVxuXG4gIF9yZW5kZXJMYXllciA9IChvdmVybGF5cywgaWR4KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJEYXRhLFxuICAgICAgaG92ZXJJbmZvLFxuICAgICAgY2xpY2tlZCxcbiAgICAgIG1hcExheWVycyxcbiAgICAgIG1hcFN0YXRlLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWdcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7bW91c2VQb3NpdGlvbn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGxheWVyID0gbGF5ZXJzW2lkeF07XG4gICAgY29uc3QgZGF0YSA9IGxheWVyRGF0YVtpZHhdO1xuXG4gICAgY29uc3QgbGF5ZXJJbnRlcmFjdGlvbiA9IHtcbiAgICAgIG9uSG92ZXI6IHZpc1N0YXRlQWN0aW9ucy5vbkxheWVySG92ZXIsXG4gICAgICBvbkNsaWNrOiB2aXNTdGF0ZUFjdGlvbnMub25MYXllckNsaWNrLFxuICAgICAgbW91c2VQb3NpdGlvblxuICAgIH07XG5cbiAgICBjb25zdCBvYmplY3RIb3ZlcmVkID0gY2xpY2tlZCB8fCBob3ZlckluZm87XG4gICAgY29uc3QgbGF5ZXJDYWxsYmFja3MgPSB7XG4gICAgICBvblNldExheWVyRG9tYWluOiB2YWwgPT4gdGhpcy5fb25MYXllclNldERvbWFpbihpZHgsIHZhbClcbiAgICB9O1xuXG4gICAgaWYgKCF0aGlzLl9zaG91bGRSZW5kZXJMYXllcihsYXllciwgZGF0YSwgbWFwTGF5ZXJzKSkge1xuICAgICAgcmV0dXJuIG92ZXJsYXlzO1xuICAgIH1cblxuICAgIGxldCBsYXllck92ZXJsYXkgPSBbXTtcblxuICAgIC8vIExheWVyIGlzIExheWVyIGNsYXNzXG4gICAgaWYgKHR5cGVvZiBsYXllci5yZW5kZXJMYXllciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGF5ZXJPdmVybGF5ID0gbGF5ZXIucmVuZGVyTGF5ZXIoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBpZHgsXG4gICAgICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIG9iamVjdEhvdmVyZWQsXG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgICAgbGF5ZXJDYWxsYmFja3NcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChsYXllck92ZXJsYXkubGVuZ3RoKSB7XG4gICAgICBvdmVybGF5cyA9IG92ZXJsYXlzLmNvbmNhdChsYXllck92ZXJsYXkpO1xuICAgIH1cbiAgICByZXR1cm4gb3ZlcmxheXM7XG4gIH07XG5cbiAgX3JlbmRlck92ZXJsYXkoKSB7XG4gICAgY29uc3Qge1xuICAgICAgbWFwU3RhdGUsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIGxheWVyRGF0YSxcbiAgICAgIGxheWVyT3JkZXJcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7aGFzQnVpbGRpbmdMYXllcn0gPSB0aGlzLnN0YXRlO1xuXG4gICAgbGV0IGRlY2tHbExheWVycyA9IFtdO1xuXG4gICAgLy8gd2FpdCB1bnRpbCBkYXRhIGlzIHJlYWR5IGJlZm9yZSByZW5kZXIgZGF0YSBsYXllcnNcbiAgICBpZiAobGF5ZXJEYXRhICYmIGxheWVyRGF0YS5sZW5ndGgpIHtcbiAgICAgIC8vIGxhc3QgbGF5ZXIgcmVuZGVyIGZpcnN0XG4gICAgICBkZWNrR2xMYXllcnMgPSBsYXllck9yZGVyXG4gICAgICAgIC5zbGljZSgpXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLnJlZHVjZSh0aGlzLl9yZW5kZXJMYXllciwgW10pO1xuICAgIH1cblxuICAgIC8vIGFkZCAzZCBidWlsZGluZyBsYXllclxuICAgIGlmIChoYXNCdWlsZGluZ0xheWVyKSB7XG4gICAgICBkZWNrR2xMYXllcnMgPSBkZWNrR2xMYXllcnMuY29uY2F0KFxuICAgICAgICB0aGlzLl9yZW5kZXJCdWlsZGluZ0xheWVyKFxuICAgICAgICAgIG1hcFN0eWxlLmJ1aWxkaW5nTGF5ZXIsXG4gICAgICAgICAgYnVpbGRpbmdEYXRhLFxuICAgICAgICAgIG1hcFN0YXRlXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEZWNrR0xcbiAgICAgICAgey4uLm1hcFN0YXRlfVxuICAgICAgICBpZD1cImRlZmF1bHQtZGVja2dsLW92ZXJsYXlcIlxuICAgICAgICBsYXllcnM9e2RlY2tHbExheWVyc31cbiAgICAgICAga2V5PXt0aGlzLnN0YXRlLnJlUmVuZGVyS2V5fVxuICAgICAgICBvbldlYkdMSW5pdGlhbGl6ZWQ9e3RoaXMuX29uV2ViR0xJbml0aWFsaXplZH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFwU3RhdGUsIG1hcFN0eWxlLCBtYXBTdGF0ZUFjdGlvbnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dXBkYXRlTWFwLCBvbk1hcENsaWNrfSA9IG1hcFN0YXRlQWN0aW9ucztcblxuICAgIGlmICghbWFwU3R5bGUuYm90dG9tTWFwU3R5bGUpIHtcbiAgICAgIC8vIHN0eWxlIG5vdCB5ZXQgbG9hZGVkXG4gICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICB9XG5cbiAgICBjb25zdCB7bWFwTGF5ZXJzLCBsYXllcnMsIGRhdGFzZXRzLCBpbmRleH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbWFwUHJvcHMgPSB7XG4gICAgICAuLi5tYXBTdGF0ZSxcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSxcbiAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBNQVBCT1hfQUNDRVNTX1RPS0VOLFxuICAgICAgb25WaWV3cG9ydENoYW5nZTogdXBkYXRlTWFwXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtNQVBfU1RZTEUuY29udGFpbmVyfSBvbk1vdXNlTW92ZT17dGhpcy5fb25Nb3VzZU1vdmV9PlxuICAgICAgICA8TWFwQ29udHJvbFxuICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgZHJhZ1JvdGF0ZT17bWFwU3RhdGUuZHJhZ1JvdGF0ZX1cbiAgICAgICAgICBpc1NwbGl0PXttYXBTdGF0ZS5pc1NwbGl0fVxuICAgICAgICAgIGlzRnVsbFNjcmVlbj17bWFwU3RhdGUuaXNGdWxsU2NyZWVufVxuICAgICAgICAgIGxheWVycz17bGF5ZXJzfVxuICAgICAgICAgIG1hcEluZGV4PXt0aGlzLnByb3BzLmluZGV4fVxuICAgICAgICAgIG1hcExheWVycz17bWFwTGF5ZXJzfVxuICAgICAgICAgIG9uVG9nZ2xlUGVyc3BlY3RpdmU9e21hcFN0YXRlQWN0aW9ucy50b2dnbGVQZXJzcGVjdGl2ZX1cbiAgICAgICAgICBvblRvZ2dsZVNwbGl0TWFwPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlU3BsaXRNYXB9XG4gICAgICAgICAgb25NYXBUb2dnbGVMYXllcj17dGhpcy5faGFuZGxlTWFwVG9nZ2xlTGF5ZXJ9XG4gICAgICAgICAgb25Ub2dnbGVGdWxsU2NyZWVuPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlRnVsbFNjcmVlbn1cbiAgICAgICAgICB0b3A9ezB9XG4gICAgICAgIC8+XG4gICAgICAgIDxNYXBib3hHTE1hcFxuICAgICAgICAgIHsuLi5tYXBQcm9wc31cbiAgICAgICAgICBrZXk9XCJib3R0b21cIlxuICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS5ib3R0b21NYXBTdHlsZX1cbiAgICAgICAgICBvbkNsaWNrPXtvbk1hcENsaWNrfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMuX3JlbmRlck92ZXJsYXkoKX1cbiAgICAgICAgPC9NYXBib3hHTE1hcD5cbiAgICAgICAge21hcFN0eWxlLnRvcE1hcFN0eWxlICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtNQVBfU1RZTEUudG9wfT5cbiAgICAgICAgICAgIDxNYXBib3hHTE1hcFxuICAgICAgICAgICAgICB7Li4ubWFwUHJvcHN9XG4gICAgICAgICAgICAgIGtleT1cInRvcFwiXG4gICAgICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS50b3BNYXBTdHlsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLl9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTWFwQ29udGFpbmVyLnByb3BzVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=