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
      _this.props.visStateActions.layerConfigChange(_this.props.layers[idx], { colorDomain: colorDomain });
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
        _this.setState({ mousePosition: [evt.nativeEvent.offsetX, evt.nativeEvent.offsetY] });
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
      // layer is no visible
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
      lngLat: lngLat,
      x: x,
      y: y + popoverOffset.top,
      freezed: Boolean(clicked),
      onClose: this._onCloseMapPopover
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
      {
        style: MAP_STYLE.container,
        onMouseMove: this._onMouseMove },
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
          onClick: onMapClick }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiTUFQX1NUWUxFIiwiY29udGFpbmVyIiwiZGlzcGxheSIsInBvc2l0aW9uIiwidG9wIiwicG9pbnRlckV2ZW50cyIsImdldEdsQ29uc3QiLCJkIiwicHJvcFR5cGVzIiwiZGF0YSIsImFycmF5IiwiaXNSZXF1aXJlZCIsImZpZWxkcyIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVyRGF0YSIsImxheWVycyIsIm1hcFN0YXRlIiwibWFwU3R5bGUiLCJwb3BvdmVyT2Zmc2V0IiwibWFwTGF5ZXJzIiwiUHJvcFR5cGVzIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBDb250YWluZXIiLCJwcm9wcyIsIl9vbkNsb3NlTWFwUG9wb3ZlciIsInZpc1N0YXRlQWN0aW9ucyIsIm9uTGF5ZXJDbGljayIsIl9vbkxheWVyU2V0RG9tYWluIiwiaWR4IiwiY29sb3JEb21haW4iLCJsYXllckNvbmZpZ0NoYW5nZSIsIl9vbldlYkdMSW5pdGlhbGl6ZWQiLCJnbCIsImRyYWdSb3RhdGUiLCJlbmFibGUiLCJERVBUSF9URVNUIiwiZGVwdGhGdW5jIiwiTEVRVUFMIiwiZGlzYWJsZSIsImdldEV4dGVuc2lvbiIsIl90b2dnbGVsYXllckJsZW5kaW5nIiwic2V0U3RhdGUiLCJfb25Nb3VzZU1vdmUiLCJicnVzaCIsImV2dCIsIm5hdGl2ZUV2ZW50IiwiZW5hYmxlZCIsIm1vdXNlUG9zaXRpb24iLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl9oYW5kbGVNYXBUb2dnbGVMYXllciIsImxheWVySWQiLCJpbmRleCIsIm1hcEluZGV4IiwidG9nZ2xlTGF5ZXJGb3JNYXAiLCJibGVuZGluZyIsImJsZW5kRnVuYyIsImJsZW5kRXF1YXRpb24iLCJibGVuZEZ1bmNTZXBhcmF0ZSIsImJsZW5kRXF1YXRpb25TZXBhcmF0ZSIsIkJMRU5EIiwibWFwIiwiX3JlbmRlckxheWVyIiwib3ZlcmxheXMiLCJob3ZlckluZm8iLCJjbGlja2VkIiwic3RhdGUiLCJsYXllciIsImxheWVySW50ZXJhY3Rpb24iLCJvbkhvdmVyIiwib25MYXllckhvdmVyIiwib25DbGljayIsIm9iamVjdEhvdmVyZWQiLCJsYXllckNhbGxiYWNrcyIsIm9uU2V0TGF5ZXJEb21haW4iLCJ2YWwiLCJfc2hvdWxkUmVuZGVyTGF5ZXIiLCJsYXllck92ZXJsYXkiLCJyZW5kZXJMYXllciIsImxlbmd0aCIsImNvbmNhdCIsImhhc0J1aWxkaW5nTGF5ZXIiLCJyZVJlbmRlcktleSIsImxvYWRCdWlsZGluZ1RpbGVzIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsImJ1aWxkaW5nTGF5ZXIiLCJpc1Zpc2libGUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJidWlsZGluZ0RhdGFBY3Rpb25zIiwibG9hZEJ1aWxkaW5nVGlsZSIsIl9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIiLCJkYXRhc2V0cyIsIm9iamVjdEluZm8iLCJ0b29sdGlwIiwicGlja2VkIiwibG5nTGF0Iiwib3ZlcmxheSIsImNvbmZpZyIsImdldEhvdmVyRGF0YSIsImlkIiwiZGF0YUlkIiwiYWxsRGF0YSIsInZpZXdwb3J0IiwiY29udGV4dCIsIl9nZXRIb3ZlclhZIiwieCIsInkiLCJwb3BvdmVyUHJvcHMiLCJmaWVsZHNUb1Nob3ciLCJmcmVlemVkIiwiQm9vbGVhbiIsIm9uQ2xvc2UiLCJzY3JlZW5Db29yZCIsInByb2plY3QiLCJfcmVuZGVyQnVpbGRpbmdMYXllciIsImJ1aWxkaW5nRGF0YSIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiem9vbSIsIndpZHRoIiwiaGVpZ2h0IiwiYmJveCIsImJvdW5kcyIsIk1hdGgiLCJmbG9vciIsImxpZ2h0U2V0dGluZ3MiLCJ0aWxlSWQiLCJmcDY0IiwiZXh0cnVkZWQiLCJnZXRGaWxsQ29sb3IiLCJjb2xvciIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0UG9seWdvbiIsImYiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0RWxldmF0aW9uIiwicHJvcGVydGllcyIsIm9wYWNpdHkiLCJpc0F2YWlsYWJsZUFuZFZpc2libGUiLCJzaG91bGRSZW5kZXJMYXllciIsIl9yZW5kZXJPdmVybGF5IiwibGF5ZXJPcmRlciIsImRlY2tHbExheWVycyIsInNsaWNlIiwicmV2ZXJzZSIsInJlZHVjZSIsInJlbmRlciIsIm1hcFN0YXRlQWN0aW9ucyIsInVwZGF0ZU1hcCIsIm9uTWFwQ2xpY2siLCJib3R0b21NYXBTdHlsZSIsIm1hcFByb3BzIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJvblZpZXdwb3J0Q2hhbmdlIiwiaXNTcGxpdCIsImlzRnVsbFNjcmVlbiIsInRvZ2dsZVBlcnNwZWN0aXZlIiwidG9nZ2xlU3BsaXRNYXAiLCJ0b2dnbGVGdWxsU2NyZWVuIiwidG9wTWFwU3R5bGUiLCJwcm9wc1R5cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFNQTs7QUFNQTs7OztBQVBBO0FBaEJBO0FBeUJBLElBQU1BLFlBQVk7QUFDaEJDLGFBQVc7QUFDVEMsYUFBUyxjQURBO0FBRVRDLGNBQVU7QUFGRCxHQURLO0FBS2hCQyxPQUFLLEVBQUNELFVBQVUsVUFBWCxFQUF1QkMsS0FBSyxLQUE1QixFQUFtQ0MsZUFBZSxNQUFsRDtBQUxXLENBQWxCOztBQUhBOzs7QUFUQTs7O0FBSkE7OztBQXdCQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWE7QUFBQSxTQUFLLFNBQUdDLENBQUgsQ0FBTDtBQUFBLENBQW5COztBQUVBLElBQU1DLFlBQVk7QUFDaEI7QUFDQUMsUUFBTSxvQkFBVUMsS0FBVixDQUFnQkMsVUFGTjtBQUdoQkMsVUFB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RSxvQkFBVTNJLFNBQVNvSjtBQUhyQjtBQURGLE9BMUJKO0FBa0NHLFdBQUt2RSx5QkFBTDtBQWxDSCxLQURGO0FBc0NELEc7Ozs7O2tCQXRVa0J2RSxZOzs7QUF5VXJCQSxhQUFhK0ksVUFBYixHQUEwQmpLLFNBQTFCIiwiZmlsZSI6Im1hcC1jb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWJyYXJpZXNcbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBNYXBib3hHTE1hcCBmcm9tICdyZWFjdC1tYXAtZ2wnO1xuaW1wb3J0IGdlb1ZpZXdwb3J0IGZyb20gJ0BtYXBib3gvZ2VvLXZpZXdwb3J0JztcbmltcG9ydCBEZWNrR0wgZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQge0dMfSBmcm9tICdsdW1hLmdsJztcbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gudGhyb3R0bGUnO1xuXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgTWFwUG9wb3ZlciBmcm9tICdjb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlcic7XG5pbXBvcnQgTWFwQ29udHJvbCBmcm9tICdjb21wb25lbnRzL21hcC1jb250cm9sJztcblxuLy8gZGVja2dsIGxheWVyc1xuaW1wb3J0IHtQb2x5Z29uTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuXG4vLyBkZWZhdWx0LXNldHRpbmdzXG5pbXBvcnQge1xuICBNQVBCT1hfQUNDRVNTX1RPS0VOLFxuICBMQVlFUl9CTEVORElOR1Ncbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG4vLyB1dGlsc1xuaW1wb3J0IHtnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kc30gZnJvbSAndXRpbHMvbGF5ZXItdXRpbHMvbGF5ZXItdXRpbHMnO1xuXG5jb25zdCBNQVBfU1RZTEUgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gIH0sXG4gIHRvcDoge3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICcwcHgnLCBwb2ludGVyRXZlbnRzOiAnbm9uZSd9XG59O1xuXG5jb25zdCBnZXRHbENvbnN0ID0gZCA9PiBHTFtkXTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyByZXF1aXJlZFxuICBkYXRhOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaW50ZXJhY3Rpb25Db25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgbGF5ZXJCbGVuZGluZzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYXllckRhdGE6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBsYXllcnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBtYXBTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBtYXBTdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBwb3BvdmVyT2Zmc2V0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgLy8gb3B0aW9uYWxcbiAgbWFwTGF5ZXJzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBvbk1hcFRvZ2dsZUxheWVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGhhc0J1aWxkaW5nTGF5ZXI6IGZhbHNlLFxuICAgICAgcmVSZW5kZXJLZXk6IDAsXG4gICAgICBnbDogbnVsbCxcbiAgICAgIG1vdXNlUG9zaXRpb246IFswLCAwXVxuICAgIH07XG5cbiAgICB0aGlzLmxvYWRCdWlsZGluZ1RpbGVzID0gdGhyb3R0bGUodGhpcy5sb2FkQnVpbGRpbmdUaWxlcywgMTAwKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubWFwU3RhdGUuZHJhZ1JvdGF0ZSAhPT0gbmV4dFByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgfHxcbiAgICAgIHRoaXMucHJvcHMubGF5ZXJCbGVuZGluZyAhPT0gbmV4dFByb3BzLmxheWVyQmxlbmRpbmcpIHtcbiAgICAgIC8vIGluY3JlbWVudCByZXJlbmRlciBrZXkgdG8gZm9yY2UgZ2wgcmVpbml0aWFsaXplIHdoZW5cbiAgICAgIC8vIHBlcnNwZWN0aXZlIG9yIGxheWVyIGJsZW5kaW5nIGNoYW5nZWRcbiAgICAgIC8vIFRPRE86IGxheWVyIGJsZW5kaW5nIGNhbiBub3cgYmUgaW1wbGVtZW50ZWQgcGVyIGxheWVyIGJhc2VcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZVJlbmRlcktleTogdGhpcy5zdGF0ZS5yZVJlbmRlcktleSArIDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5tYXBTdHlsZSAhPT0gbmV4dFByb3BzLm1hcFN0eWxlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaGFzQnVpbGRpbmdMYXllcjogbmV4dFByb3BzLm1hcFN0eWxlLmJ1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tYXBTdGF0ZS5kcmFnUm90YXRlICYmIHRoaXMuc3RhdGUuaGFzQnVpbGRpbmdMYXllciAmJlxuICAgICAgICB0aGlzLnByb3BzLm1hcFN0YXRlICE9PSBwcmV2UHJvcHMubWFwU3RhdGUpIHtcbiAgICAgIHRoaXMubG9hZEJ1aWxkaW5nVGlsZXModGhpcy5wcm9wcy5tYXBTdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyogY29tcG9uZW50IGFjdGlvbnMgKi9cbiAgbG9hZEJ1aWxkaW5nVGlsZXMobWFwU3RhdGUpIHtcbiAgICB0aGlzLnByb3BzLmJ1aWxkaW5nRGF0YUFjdGlvbnMubG9hZEJ1aWxkaW5nVGlsZShtYXBTdGF0ZSk7XG4gIH1cblxuICAvKiBjb21wb25lbnQgcHJpdmF0ZSBmdW5jdGlvbnMgKi9cblxuICBfb25DbG9zZU1hcFBvcG92ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMub25MYXllckNsaWNrKG51bGwpO1xuICB9O1xuXG4gIF9vbkxheWVyU2V0RG9tYWluID0gKGlkeCwgY29sb3JEb21haW4pID0+IHtcbiAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5sYXllckNvbmZpZ0NoYW5nZShcbiAgICAgIHRoaXMucHJvcHMubGF5ZXJzW2lkeF0sIHtjb2xvckRvbWFpbn1cbiAgICApO1xuICB9O1xuXG4gIF9vbldlYkdMSW5pdGlhbGl6ZWQgPSAoZ2wpID0+IHtcbiAgICAvLyBlbmFibGUgZGVwdGggdGVzdCBmb3IgcGVyc3BlY3RpdmUgbW9kZVxuICAgIGlmICh0aGlzLnByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUpIHtcbiAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcbiAgICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgIH1cblxuICAgIC8vIGFsbG93IFVpbnQzMiBpbmRpY2VzIGluIGJ1aWxkaW5nIGxheWVyXG4gICAgZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfZWxlbWVudF9pbmRleF91aW50Jyk7XG5cbiAgICB0aGlzLl90b2dnbGVsYXllckJsZW5kaW5nKGdsKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe2dsfSk7XG4gIH07XG5cbiAgX29uTW91c2VNb3ZlID0gZXZ0ID0+IHtcbiAgICBjb25zdCB7aW50ZXJhY3Rpb25Db25maWc6IHticnVzaH19ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChldnQubmF0aXZlRXZlbnQgJiYgYnJ1c2guZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VQb3NpdGlvbjogW2V2dC5uYXRpdmVFdmVudC5vZmZzZXRYLCBldnQubmF0aXZlRXZlbnQub2Zmc2V0WV19KTtcbiAgICB9XG4gIH07XG5cbiAgX2hhbmRsZU1hcFRvZ2dsZUxheWVyID0gKGxheWVySWQpID0+IHtcbiAgICBjb25zdCB7aW5kZXg6IG1hcEluZGV4ID0gMCwgdmlzU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUxheWVyRm9yTWFwKG1hcEluZGV4LCBsYXllcklkKTtcbiAgfTtcblxuICAvKiBkZWNrLmdsIGRvZXNuJ3Qgc3VwcG9ydCBibGVuZEZ1bmNTZXBhcmF0ZSB5ZXRcbiAgICogc28gd2UncmUgYXBwbHlpbmcgdGhlIGJsZW5kaW5nIG91cnNlbHZlc1xuICAqL1xuICBfdG9nZ2xlbGF5ZXJCbGVuZGluZyA9IChnbCkgPT4ge1xuICAgIGNvbnN0IGJsZW5kaW5nID0gTEFZRVJfQkxFTkRJTkdTW3RoaXMucHJvcHMubGF5ZXJCbGVuZGluZ107XG4gICAgY29uc3Qge1xuICAgICAgZW5hYmxlLFxuICAgICAgYmxlbmRGdW5jLCBibGVuZEVxdWF0aW9uLFxuICAgICAgYmxlbmRGdW5jU2VwYXJhdGUsIGJsZW5kRXF1YXRpb25TZXBhcmF0ZVxuICAgIH0gPSBibGVuZGluZztcblxuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGdsLmVuYWJsZShHTC5CTEVORCk7XG4gICAgICBpZiAoYmxlbmRGdW5jKSB7XG4gICAgICAgIGdsLmJsZW5kRnVuYyguLi5ibGVuZEZ1bmMubWFwKGdldEdsQ29uc3QpKTtcbiAgICAgICAgZ2wuYmxlbmRFcXVhdGlvbihHTFtibGVuZEVxdWF0aW9uXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZSguLi5ibGVuZEZ1bmNTZXBhcmF0ZS5tYXAoZ2V0R2xDb25zdCkpO1xuICAgICAgICBnbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoLi4uYmxlbmRFcXVhdGlvblNlcGFyYXRlLm1hcChnZXRHbENvbnN0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoR0wuQkxFTkQpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGNvbXBvbmVudCByZW5kZXIgZnVuY3Rpb25zICovXG4gIC8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbiAgX3JlbmRlck9iamVjdExheWVyUG9wb3ZlcigpIHtcblxuICAgIC8vIFRPRE86IG1vdmUgdGhpcyBpbnRvIHJlZHVjZXIgc28gaXQgY2FuIGJlIHRlc3RlZFxuICAgIGNvbnN0IHtob3ZlckluZm8sIGNsaWNrZWQsIGRhdGFzZXRzLCBpbnRlcmFjdGlvbkNvbmZpZywgbGF5ZXJzLCBtYXBMYXllcnMsIHBvcG92ZXJPZmZzZXR9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGlmIGNsaWNrZWQgc29tZXRoaW5nLCBpZ25vcmUgaG92ZXIgYmVoYXZpb3JcbiAgICBjb25zdCBvYmplY3RJbmZvID0gY2xpY2tlZCB8fCBob3ZlckluZm87XG4gICAgaWYgKCFpbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLmVuYWJsZWQgfHwgIW9iamVjdEluZm8gfHwgIW9iamVjdEluZm8ucGlja2VkKSB7XG4gICAgICAvLyBub3RoaW5nIGhvdmVyZWRcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHtsbmdMYXQsIG9iamVjdCwgbGF5ZXI6IG92ZXJsYXl9ID0gb2JqZWN0SW5mbztcblxuICAgIC8vIGRlY2tnbCBsYXllciB0byBrZXBsZXItZ2wgbGF5ZXJcbiAgICBjb25zdCBsYXllciA9IGxheWVyc1tvdmVybGF5LnByb3BzLmlkeF07XG5cbiAgICBpZiAoIWxheWVyIHx8ICFsYXllci5jb25maWcuaXNWaXNpYmxlIHx8ICFvYmplY3QgfHwgIWxheWVyLmdldEhvdmVyRGF0YSB8fFxuICAgIChtYXBMYXllcnMgJiYgIW1hcExheWVyc1tsYXllci5pZF0uaXNWaXNpYmxlKSkge1xuICAgICAgLy8gbGF5ZXIgaXMgbm8gdmlzaWJsZVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge2NvbmZpZzoge2RhdGFJZH19ID0gbGF5ZXI7XG4gICAgY29uc3Qge2FsbERhdGEsIGZpZWxkc30gPSBkYXRhc2V0c1tkYXRhSWRdO1xuICAgIGNvbnN0IGRhdGEgPSBsYXllci5nZXRIb3ZlckRhdGEob2JqZWN0LCBhbGxEYXRhKTtcblxuICAgIC8vIHByb2plY3QgbG5nbGF0IHRvIHNjcmVlbiBzbyB0aGF0IHRvb2x0aXAgZm9sbG93cyB0aGUgb2JqZWN0IG9uIHpvb21cbiAgICBjb25zdCB7dmlld3BvcnR9ID0gb3ZlcmxheS5jb250ZXh0O1xuICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuX2dldEhvdmVyWFkodmlld3BvcnQsIGxuZ0xhdCkgfHwgb2JqZWN0SW5mbztcblxuICAgIGNvbnN0IHBvcG92ZXJQcm9wcyA9IHtcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZHMsXG4gICAgICBmaWVsZHNUb1Nob3c6IGludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdLFxuICAgICAgbGF5ZXIsXG4gICAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgICBsbmdMYXQsXG4gICAgICB4LFxuICAgICAgeTogeSArIHBvcG92ZXJPZmZzZXQudG9wLFxuICAgICAgZnJlZXplZDogQm9vbGVhbihjbGlja2VkKSxcbiAgICAgIG9uQ2xvc2U6IHRoaXMuX29uQ2xvc2VNYXBQb3BvdmVyXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PjxNYXBQb3BvdmVyIHsuLi5wb3BvdmVyUHJvcHN9Lz48L2Rpdj5cbiAgICApO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gIF9nZXRIb3ZlclhZKHZpZXdwb3J0LCBsbmdMYXQpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZCA9ICF2aWV3cG9ydCB8fCAhbG5nTGF0ID8gbnVsbCA6IHZpZXdwb3J0LnByb2plY3QobG5nTGF0KTtcblxuICAgIHJldHVybiBzY3JlZW5Db29yZCAmJiB7eDogc2NyZWVuQ29vcmRbMF0sIHk6IHNjcmVlbkNvb3JkWzFdfTtcbiAgfVxuXG4gIF9yZW5kZXJCdWlsZGluZ0xheWVyKGxheWVyLCBidWlsZGluZ0RhdGEsIG1hcFN0YXRlKSB7XG4gICAgY29uc3Qge2xvbmdpdHVkZSwgbGF0aXR1ZGUsIHpvb20sIHdpZHRoLCBoZWlnaHR9ID0gbWFwU3RhdGU7XG4gICAgY29uc3QgYmJveCA9IGdlb1ZpZXdwb3J0LmJvdW5kcyhbbG9uZ2l0dWRlLCBsYXRpdHVkZV0sIE1hdGguZmxvb3Ioem9vbSksIFt3aWR0aCwgaGVpZ2h0XSk7XG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IGdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJib3gpO1xuXG4gICAgLy8gcmVuZGVyIG9uZSBsYXllciBwZXIgdGlsZVxuICAgIHJldHVybiBidWlsZGluZ0RhdGEubWFwKCh7dGlsZUlkLCBkYXRhfSkgPT4gbmV3IFBvbHlnb25MYXllcih7XG4gICAgICBpZDogdGlsZUlkLFxuICAgICAgZGF0YSxcbiAgICAgIGZwNjQ6IE1hdGguZmxvb3Ioem9vbSkgPj0gMTYsXG4gICAgICBleHRydWRlZDogdHJ1ZSxcbiAgICAgIGdldEZpbGxDb2xvcjogZiA9PiBsYXllci5jb2xvcixcbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgIGdldEZpbGxDb2xvcjogbGF5ZXIuY29sb3JcbiAgICAgIH0sXG4gICAgICBsaWdodFNldHRpbmdzLFxuICAgICAgZ2V0UG9seWdvbjogZiA9PiBmLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgZ2V0RWxldmF0aW9uOiBmID0+IGYucHJvcGVydGllcy5oZWlnaHQsXG4gICAgICBvcGFjaXR5OiBsYXllci5vcGFjaXR5XG4gICAgfSkpO1xuICB9XG5cbiAgX3Nob3VsZFJlbmRlckxheWVyKGxheWVyLCBkYXRhLCBtYXBMYXllcnMpIHtcbiAgICBjb25zdCBpc0F2YWlsYWJsZUFuZFZpc2libGUgPSAhKG1hcExheWVycyAmJiBtYXBMYXllcnNbbGF5ZXIuaWRdKSB8fCBtYXBMYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZTtcbiAgICByZXR1cm4gbGF5ZXIuc2hvdWxkUmVuZGVyTGF5ZXIoZGF0YSkgJiYgaXNBdmFpbGFibGVBbmRWaXNpYmxlO1xuICB9XG5cbiAgX3JlbmRlckxheWVyID0gKG92ZXJsYXlzLCBpZHgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBsYXllcnMsIGxheWVyRGF0YSwgaG92ZXJJbmZvLCBjbGlja2VkLFxuICAgICAgbWFwTGF5ZXJzLCBtYXBTdGF0ZSwgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWdcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7bW91c2VQb3NpdGlvbn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGxheWVyID0gbGF5ZXJzW2lkeF07XG4gICAgY29uc3QgZGF0YSA9IGxheWVyRGF0YVtpZHhdO1xuXG4gICAgY29uc3QgbGF5ZXJJbnRlcmFjdGlvbiA9IHtcbiAgICAgIG9uSG92ZXI6IHZpc1N0YXRlQWN0aW9ucy5vbkxheWVySG92ZXIsXG4gICAgICBvbkNsaWNrOiB2aXNTdGF0ZUFjdGlvbnMub25MYXllckNsaWNrLFxuICAgICAgbW91c2VQb3NpdGlvblxuICAgIH07XG5cbiAgICBjb25zdCBvYmplY3RIb3ZlcmVkID0gY2xpY2tlZCB8fCBob3ZlckluZm87XG4gICAgY29uc3QgbGF5ZXJDYWxsYmFja3MgPSB7XG4gICAgICBvblNldExheWVyRG9tYWluOiB2YWwgPT4gdGhpcy5fb25MYXllclNldERvbWFpbihpZHgsIHZhbClcbiAgICB9O1xuXG4gICAgaWYgKCF0aGlzLl9zaG91bGRSZW5kZXJMYXllcihsYXllciwgZGF0YSwgbWFwTGF5ZXJzKSkge1xuICAgICAgcmV0dXJuIG92ZXJsYXlzO1xuICAgIH1cblxuICAgIGxldCBsYXllck92ZXJsYXkgPSBbXTtcblxuICAgIC8vIExheWVyIGlzIExheWVyIGNsYXNzXG4gICAgaWYgKHR5cGVvZiBsYXllci5yZW5kZXJMYXllciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGF5ZXJPdmVybGF5ID0gbGF5ZXIucmVuZGVyTGF5ZXIoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBpZHgsXG4gICAgICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIG9iamVjdEhvdmVyZWQsXG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgICAgbGF5ZXJDYWxsYmFja3NcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChsYXllck92ZXJsYXkubGVuZ3RoKSB7XG4gICAgICBvdmVybGF5cyA9IG92ZXJsYXlzLmNvbmNhdChsYXllck92ZXJsYXkpO1xuICAgIH1cbiAgICByZXR1cm4gb3ZlcmxheXM7XG4gIH1cblxuICBfcmVuZGVyT3ZlcmxheSgpIHtcbiAgICBjb25zdCB7bWFwU3RhdGUsIG1hcFN0eWxlLCBidWlsZGluZ0RhdGEsIGxheWVyRGF0YSwgbGF5ZXJPcmRlcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtoYXNCdWlsZGluZ0xheWVyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgZGVja0dsTGF5ZXJzID0gW107XG5cbiAgICAvLyB3YWl0IHVudGlsIGRhdGEgaXMgcmVhZHkgYmVmb3JlIHJlbmRlciBkYXRhIGxheWVyc1xuICAgIGlmIChsYXllckRhdGEgJiYgbGF5ZXJEYXRhLmxlbmd0aCkge1xuICAgICAgLy8gbGFzdCBsYXllciByZW5kZXIgZmlyc3RcbiAgICAgIGRlY2tHbExheWVycyA9IGxheWVyT3JkZXIuc2xpY2UoKS5yZXZlcnNlKClcbiAgICAgICAgLnJlZHVjZSh0aGlzLl9yZW5kZXJMYXllciwgW10pO1xuICAgIH1cblxuICAgIC8vIGFkZCAzZCBidWlsZGluZyBsYXllclxuICAgIGlmIChoYXNCdWlsZGluZ0xheWVyKSB7XG4gICAgICBkZWNrR2xMYXllcnMgPSBkZWNrR2xMYXllcnNcbiAgICAgICAgLmNvbmNhdCh0aGlzLl9yZW5kZXJCdWlsZGluZ0xheWVyKG1hcFN0eWxlLmJ1aWxkaW5nTGF5ZXIsIGJ1aWxkaW5nRGF0YSwgbWFwU3RhdGUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPERlY2tHTFxuICAgICAgICB7Li4ubWFwU3RhdGV9XG4gICAgICAgIGlkPVwiZGVmYXVsdC1kZWNrZ2wtb3ZlcmxheVwiXG4gICAgICAgIGxheWVycz17ZGVja0dsTGF5ZXJzfVxuICAgICAgICBrZXk9e3RoaXMuc3RhdGUucmVSZW5kZXJLZXl9XG4gICAgICAgIG9uV2ViR0xJbml0aWFsaXplZD17dGhpcy5fb25XZWJHTEluaXRpYWxpemVkfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXBTdGF0ZSwgbWFwU3R5bGUsIG1hcFN0YXRlQWN0aW9uc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt1cGRhdGVNYXAsIG9uTWFwQ2xpY2t9ID0gbWFwU3RhdGVBY3Rpb25zO1xuXG4gICAgaWYgKCFtYXBTdHlsZS5ib3R0b21NYXBTdHlsZSkge1xuICAgICAgLy8gc3R5bGUgbm90IHlldCBsb2FkZWRcbiAgICAgIHJldHVybiA8ZGl2Lz47XG4gICAgfVxuXG4gICAgY29uc3Qge21hcExheWVycywgbGF5ZXJzLCBkYXRhc2V0cywgaW5kZXh9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IG1hcFByb3BzID0ge1xuICAgICAgLi4ubWFwU3RhdGUsXG4gICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUsXG4gICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogTUFQQk9YX0FDQ0VTU19UT0tFTixcbiAgICAgIG9uVmlld3BvcnRDaGFuZ2U6IHVwZGF0ZU1hcFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17TUFQX1NUWUxFLmNvbnRhaW5lcn1cbiAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuX29uTW91c2VNb3ZlfT5cbiAgICAgICAgPE1hcENvbnRyb2xcbiAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIGRyYWdSb3RhdGU9e21hcFN0YXRlLmRyYWdSb3RhdGV9XG4gICAgICAgICAgaXNTcGxpdD17bWFwU3RhdGUuaXNTcGxpdH1cbiAgICAgICAgICBpc0Z1bGxTY3JlZW49e21hcFN0YXRlLmlzRnVsbFNjcmVlbn1cbiAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICBtYXBJbmRleD17dGhpcy5wcm9wcy5pbmRleH1cbiAgICAgICAgICBtYXBMYXllcnM9e21hcExheWVyc31cbiAgICAgICAgICBvblRvZ2dsZVBlcnNwZWN0aXZlPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlUGVyc3BlY3RpdmV9XG4gICAgICAgICAgb25Ub2dnbGVTcGxpdE1hcD17bWFwU3RhdGVBY3Rpb25zLnRvZ2dsZVNwbGl0TWFwfVxuICAgICAgICAgIG9uTWFwVG9nZ2xlTGF5ZXI9e3RoaXMuX2hhbmRsZU1hcFRvZ2dsZUxheWVyfVxuICAgICAgICAgIG9uVG9nZ2xlRnVsbFNjcmVlbj17bWFwU3RhdGVBY3Rpb25zLnRvZ2dsZUZ1bGxTY3JlZW59XG4gICAgICAgICAgdG9wPXswfVxuICAgICAgICAvPlxuICAgICAgICA8TWFwYm94R0xNYXBcbiAgICAgICAgICB7Li4ubWFwUHJvcHN9XG4gICAgICAgICAga2V5PVwiYm90dG9tXCJcbiAgICAgICAgICBtYXBTdHlsZT17bWFwU3R5bGUuYm90dG9tTWFwU3R5bGV9XG4gICAgICAgICAgb25DbGljaz17b25NYXBDbGlja30+XG4gICAgICAgICAge3RoaXMuX3JlbmRlck92ZXJsYXkoKX1cbiAgICAgICAgPC9NYXBib3hHTE1hcD5cbiAgICAgICAge21hcFN0eWxlLnRvcE1hcFN0eWxlICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtNQVBfU1RZTEUudG9wfT5cbiAgICAgICAgICAgIDxNYXBib3hHTE1hcFxuICAgICAgICAgICAgICB7Li4ubWFwUHJvcHN9XG4gICAgICAgICAgICAgIGtleT1cInRvcFwiXG4gICAgICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS50b3BNYXBTdHlsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLl9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTWFwQ29udGFpbmVyLnByb3BzVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=