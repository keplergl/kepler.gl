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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiTUFQX1NUWUxFIiwiY29udGFpbmVyIiwiZGlzcGxheSIsInBvc2l0aW9uIiwidG9wIiwicG9pbnRlckV2ZW50cyIsImdldEdsQ29uc3QiLCJkIiwicHJvcFR5cGVzIiwiZGF0YSIsImFycmF5IiwiaXNSZXF1aXJlZCIsImZpZWxkcyIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVyRGF0YSIsImxheWVycyIsIm1hcFN0YXRlIiwibWFwU3R5bGUiLCJwb3BvdmVyT2Zmc2V0IiwibWFwTGF5ZXJzIiwiUHJvcFR5cGVzIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBDb250YWluZXIiLCJwcm9wcyIsIl9vbkNsb3NlTWFwUG9wb3ZlciIsInZpc1N0YXRlQWN0aW9ucyIsIm9uTGF5ZXJDbGljayIsIl9vbkxheWVyU2V0RG9tYWluIiwiaWR4IiwiY29sb3JEb21haW4iLCJsYXllckNvbmZpZ0NoYW5nZSIsIl9vbldlYkdMSW5pdGlhbGl6ZWQiLCJkcmFnUm90YXRlIiwiZ2wiLCJlbmFibGUiLCJERVBUSF9URVNUIiwiZGVwdGhGdW5jIiwiTEVRVUFMIiwiZGlzYWJsZSIsImdldEV4dGVuc2lvbiIsIl90b2dnbGVsYXllckJsZW5kaW5nIiwic2V0U3RhdGUiLCJfb25Nb3VzZU1vdmUiLCJicnVzaCIsImV2dCIsIm5hdGl2ZUV2ZW50IiwiZW5hYmxlZCIsIm1vdXNlUG9zaXRpb24iLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl9oYW5kbGVNYXBUb2dnbGVMYXllciIsImluZGV4IiwibWFwSW5kZXgiLCJ0b2dnbGVMYXllckZvck1hcCIsImxheWVySWQiLCJibGVuZGluZyIsImJsZW5kRnVuYyIsImJsZW5kRXF1YXRpb24iLCJibGVuZEZ1bmNTZXBhcmF0ZSIsImJsZW5kRXF1YXRpb25TZXBhcmF0ZSIsIkJMRU5EIiwibWFwIiwiX3JlbmRlckxheWVyIiwib3ZlcmxheXMiLCJob3ZlckluZm8iLCJjbGlja2VkIiwic3RhdGUiLCJsYXllciIsImxheWVySW50ZXJhY3Rpb24iLCJvbkhvdmVyIiwib25MYXllckhvdmVyIiwib25DbGljayIsIm9iamVjdEhvdmVyZWQiLCJsYXllckNhbGxiYWNrcyIsIm9uU2V0TGF5ZXJEb21haW4iLCJ2YWwiLCJfc2hvdWxkUmVuZGVyTGF5ZXIiLCJsYXllck92ZXJsYXkiLCJyZW5kZXJMYXllciIsImxlbmd0aCIsImNvbmNhdCIsImhhc0J1aWxkaW5nTGF5ZXIiLCJyZVJlbmRlcktleSIsImxvYWRCdWlsZGluZ1RpbGVzIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsImJ1aWxkaW5nTGF5ZXIiLCJpc1Zpc2libGUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJidWlsZGluZ0RhdGFBY3Rpb25zIiwibG9hZEJ1aWxkaW5nVGlsZSIsIl9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIiLCJkYXRhc2V0cyIsIm9iamVjdEluZm8iLCJ0b29sdGlwIiwicGlja2VkIiwibG5nTGF0Iiwib3ZlcmxheSIsImNvbmZpZyIsImdldEhvdmVyRGF0YSIsImlkIiwiZGF0YUlkIiwiYWxsRGF0YSIsInZpZXdwb3J0IiwiY29udGV4dCIsIl9nZXRIb3ZlclhZIiwieCIsInkiLCJwb3BvdmVyUHJvcHMiLCJmaWVsZHNUb1Nob3ciLCJmcmVlemVkIiwiQm9vbGVhbiIsIm9uQ2xvc2UiLCJzY3JlZW5Db29yZCIsInByb2plY3QiLCJfcmVuZGVyQnVpbGRpbmdMYXllciIsImJ1aWxkaW5nRGF0YSIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiem9vbSIsIndpZHRoIiwiaGVpZ2h0IiwiYmJveCIsImJvdW5kcyIsIk1hdGgiLCJmbG9vciIsImxpZ2h0U2V0dGluZ3MiLCJ0aWxlSWQiLCJmcDY0IiwiZXh0cnVkZWQiLCJnZXRGaWxsQ29sb3IiLCJjb2xvciIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0UG9seWdvbiIsImYiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0RWxldmF0aW9uIiwicHJvcGVydGllcyIsIm9wYWNpdHkiLCJpc0F2YWlsYWJsZUFuZFZpc2libGUiLCJzaG91bGRSZW5kZXJMYXllciIsIl9yZW5kZXJPdmVybGF5IiwibGF5ZXJPcmRlciIsImRlY2tHbExheWVycyIsInNsaWNlIiwicmV2ZXJzZSIsInJlZHVjZSIsInJlbmRlciIsIm1hcFN0YXRlQWN0aW9ucyIsInVwZGF0ZU1hcCIsIm9uTWFwQ2xpY2siLCJib3R0b21NYXBTdHlsZSIsIm1hcFByb3BzIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJvblZpZXdwb3J0Q2hhbmdlIiwiaXNTcGxpdCIsImlzRnVsbFNjcmVlbiIsInRvZ2dsZVBlcnNwZWN0aXZlIiwidG9nZ2xlU3BsaXRNYXAiLCJ0b2dnbGVGdWxsU2NyZWVuIiwidG9wTWFwU3R5bGUiLCJwcm9wc1R5cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFNQTs7QUFHQTs7OztBQUpBO0FBaEJBO0FBc0JBLElBQU1BLFlBQVk7QUFDaEJDLGFBQVc7QUFDVEMsYUFBUyxjQURBO0FBRVRDLGNBQVU7QUFGRCxHQURLO0FBS2hCQyxPQUFLLEVBQUNELFVBQVUsVUFBWCxFQUF1QkMsS0FBSyxLQUE1QixFQUFtQ0MsZUFBZSxNQUFsRDtBQUxXLENBQWxCOztBQUhBOzs7QUFOQTs7O0FBSkE7OztBQXFCQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWE7QUFBQSxTQUFLLFNBQUdDLENBQUgsQ0FBTDtBQUFBLENBQW5COztBQUVBLElBQU1DLFlBQVk7QUFDaEI7QUFDQUMsUUFBTSxvQkFBVUMsS0FBVixDQUFnQkMsVUFGTjtBQUdoQkMsVUFB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V0FBS3ZFLHlCQUFMO0FBakNILEtBREY7QUFxQ0QsRzs7Ozs7a0JBelhrQnZFLFk7OztBQTRYckJBLGFBQWErSSxVQUFiLEdBQTBCakssU0FBMUIiLCJmaWxlIjoibWFwLWNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYnJhcmllc1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IE1hcGJveEdMTWFwIGZyb20gJ3JlYWN0LW1hcC1nbCc7XG5pbXBvcnQgZ2VvVmlld3BvcnQgZnJvbSAnQG1hcGJveC9nZW8tdmlld3BvcnQnO1xuaW1wb3J0IERlY2tHTCBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7R0x9IGZyb20gJ2x1bWEuZ2wnO1xuaW1wb3J0IHRocm90dGxlIGZyb20gJ2xvZGFzaC50aHJvdHRsZSc7XG5cbi8vIGNvbXBvbmVudHNcbmltcG9ydCBNYXBQb3BvdmVyIGZyb20gJ2NvbXBvbmVudHMvbWFwL21hcC1wb3BvdmVyJztcbmltcG9ydCBNYXBDb250cm9sIGZyb20gJ2NvbXBvbmVudHMvbWFwLWNvbnRyb2wnO1xuXG4vLyBkZWNrZ2wgbGF5ZXJzXG5pbXBvcnQge1BvbHlnb25MYXllcn0gZnJvbSAnZGVjay5nbCc7XG5cbi8vIGRlZmF1bHQtc2V0dGluZ3NcbmltcG9ydCB7TUFQQk9YX0FDQ0VTU19UT0tFTiwgTEFZRVJfQkxFTkRJTkdTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8vIHV0aWxzXG5pbXBvcnQge2dldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzfSBmcm9tICd1dGlscy9sYXllci11dGlscy9sYXllci11dGlscyc7XG5cbmNvbnN0IE1BUF9TVFlMRSA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgfSxcbiAgdG9wOiB7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzBweCcsIHBvaW50ZXJFdmVudHM6ICdub25lJ31cbn07XG5cbmNvbnN0IGdldEdsQ29uc3QgPSBkID0+IEdMW2RdO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIC8vIHJlcXVpcmVkXG4gIGRhdGE6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBpbnRlcmFjdGlvbkNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBsYXllckJsZW5kaW5nOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxheWVyRGF0YTogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGxheWVyczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIG1hcFN0YXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIG1hcFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHBvcG92ZXJPZmZzZXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAvLyBvcHRpb25hbFxuICBtYXBMYXllcnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIG9uTWFwVG9nZ2xlTGF5ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaGFzQnVpbGRpbmdMYXllcjogZmFsc2UsXG4gICAgICByZVJlbmRlcktleTogMCxcbiAgICAgIGdsOiBudWxsLFxuICAgICAgbW91c2VQb3NpdGlvbjogWzAsIDBdXG4gICAgfTtcblxuICAgIHRoaXMubG9hZEJ1aWxkaW5nVGlsZXMgPSB0aHJvdHRsZSh0aGlzLmxvYWRCdWlsZGluZ1RpbGVzLCAxMDApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgIT09IG5leHRQcm9wcy5tYXBTdGF0ZS5kcmFnUm90YXRlIHx8XG4gICAgICB0aGlzLnByb3BzLmxheWVyQmxlbmRpbmcgIT09IG5leHRQcm9wcy5sYXllckJsZW5kaW5nXG4gICAgKSB7XG4gICAgICAvLyBpbmNyZW1lbnQgcmVyZW5kZXIga2V5IHRvIGZvcmNlIGdsIHJlaW5pdGlhbGl6ZSB3aGVuXG4gICAgICAvLyBwZXJzcGVjdGl2ZSBvciBsYXllciBibGVuZGluZyBjaGFuZ2VkXG4gICAgICAvLyBUT0RPOiBsYXllciBibGVuZGluZyBjYW4gbm93IGJlIGltcGxlbWVudGVkIHBlciBsYXllciBiYXNlXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVSZW5kZXJLZXk6IHRoaXMuc3RhdGUucmVSZW5kZXJLZXkgKyAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMubWFwU3R5bGUgIT09IG5leHRQcm9wcy5tYXBTdHlsZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGhhc0J1aWxkaW5nTGF5ZXI6IG5leHRQcm9wcy5tYXBTdHlsZS5idWlsZGluZ0xheWVyLmlzVmlzaWJsZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5tYXBTdGF0ZS5kcmFnUm90YXRlICYmXG4gICAgICB0aGlzLnN0YXRlLmhhc0J1aWxkaW5nTGF5ZXIgJiZcbiAgICAgIHRoaXMucHJvcHMubWFwU3RhdGUgIT09IHByZXZQcm9wcy5tYXBTdGF0ZVxuICAgICkge1xuICAgICAgdGhpcy5sb2FkQnVpbGRpbmdUaWxlcyh0aGlzLnByb3BzLm1hcFN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvKiBjb21wb25lbnQgYWN0aW9ucyAqL1xuICBsb2FkQnVpbGRpbmdUaWxlcyhtYXBTdGF0ZSkge1xuICAgIHRoaXMucHJvcHMuYnVpbGRpbmdEYXRhQWN0aW9ucy5sb2FkQnVpbGRpbmdUaWxlKG1hcFN0YXRlKTtcbiAgfVxuXG4gIC8qIGNvbXBvbmVudCBwcml2YXRlIGZ1bmN0aW9ucyAqL1xuXG4gIF9vbkNsb3NlTWFwUG9wb3ZlciA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5vbkxheWVyQ2xpY2sobnVsbCk7XG4gIH07XG5cbiAgX29uTGF5ZXJTZXREb21haW4gPSAoaWR4LCBjb2xvckRvbWFpbikgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLmxheWVyQ29uZmlnQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXJzW2lkeF0sIHtcbiAgICAgIGNvbG9yRG9tYWluXG4gICAgfSk7XG4gIH07XG5cbiAgX29uV2ViR0xJbml0aWFsaXplZCA9IGdsID0+IHtcbiAgICAvLyBlbmFibGUgZGVwdGggdGVzdCBmb3IgcGVyc3BlY3RpdmUgbW9kZVxuICAgIGlmICh0aGlzLnByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUpIHtcbiAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcbiAgICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgIH1cblxuICAgIC8vIGFsbG93IFVpbnQzMiBpbmRpY2VzIGluIGJ1aWxkaW5nIGxheWVyXG4gICAgZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfZWxlbWVudF9pbmRleF91aW50Jyk7XG5cbiAgICB0aGlzLl90b2dnbGVsYXllckJsZW5kaW5nKGdsKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe2dsfSk7XG4gIH07XG5cbiAgX29uTW91c2VNb3ZlID0gZXZ0ID0+IHtcbiAgICBjb25zdCB7aW50ZXJhY3Rpb25Db25maWc6IHticnVzaH19ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChldnQubmF0aXZlRXZlbnQgJiYgYnJ1c2guZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdXNlUG9zaXRpb246IFtldnQubmF0aXZlRXZlbnQub2Zmc2V0WCwgZXZ0Lm5hdGl2ZUV2ZW50Lm9mZnNldFldXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX2hhbmRsZU1hcFRvZ2dsZUxheWVyID0gbGF5ZXJJZCA9PiB7XG4gICAgY29uc3Qge2luZGV4OiBtYXBJbmRleCA9IDAsIHZpc1N0YXRlQWN0aW9uc30gPSB0aGlzLnByb3BzO1xuICAgIHZpc1N0YXRlQWN0aW9ucy50b2dnbGVMYXllckZvck1hcChtYXBJbmRleCwgbGF5ZXJJZCk7XG4gIH07XG5cbiAgLyogZGVjay5nbCBkb2Vzbid0IHN1cHBvcnQgYmxlbmRGdW5jU2VwYXJhdGUgeWV0XG4gICAqIHNvIHdlJ3JlIGFwcGx5aW5nIHRoZSBibGVuZGluZyBvdXJzZWx2ZXNcbiAgKi9cbiAgX3RvZ2dsZWxheWVyQmxlbmRpbmcgPSBnbCA9PiB7XG4gICAgY29uc3QgYmxlbmRpbmcgPSBMQVlFUl9CTEVORElOR1NbdGhpcy5wcm9wcy5sYXllckJsZW5kaW5nXTtcbiAgICBjb25zdCB7XG4gICAgICBlbmFibGUsXG4gICAgICBibGVuZEZ1bmMsXG4gICAgICBibGVuZEVxdWF0aW9uLFxuICAgICAgYmxlbmRGdW5jU2VwYXJhdGUsXG4gICAgICBibGVuZEVxdWF0aW9uU2VwYXJhdGVcbiAgICB9ID0gYmxlbmRpbmc7XG5cbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICBnbC5lbmFibGUoR0wuQkxFTkQpO1xuICAgICAgaWYgKGJsZW5kRnVuYykge1xuICAgICAgICBnbC5ibGVuZEZ1bmMoLi4uYmxlbmRGdW5jLm1hcChnZXRHbENvbnN0KSk7XG4gICAgICAgIGdsLmJsZW5kRXF1YXRpb24oR0xbYmxlbmRFcXVhdGlvbl0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2wuYmxlbmRGdW5jU2VwYXJhdGUoLi4uYmxlbmRGdW5jU2VwYXJhdGUubWFwKGdldEdsQ29uc3QpKTtcbiAgICAgICAgZ2wuYmxlbmRFcXVhdGlvblNlcGFyYXRlKC4uLmJsZW5kRXF1YXRpb25TZXBhcmF0ZS5tYXAoZ2V0R2xDb25zdCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBnbC5kaXNhYmxlKEdMLkJMRU5EKTtcbiAgICB9XG4gIH07XG5cbiAgLyogY29tcG9uZW50IHJlbmRlciBmdW5jdGlvbnMgKi9cbiAgLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuICBfcmVuZGVyT2JqZWN0TGF5ZXJQb3BvdmVyKCkge1xuICAgIC8vIFRPRE86IG1vdmUgdGhpcyBpbnRvIHJlZHVjZXIgc28gaXQgY2FuIGJlIHRlc3RlZFxuICAgIGNvbnN0IHtcbiAgICAgIGhvdmVySW5mbyxcbiAgICAgIGNsaWNrZWQsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgbGF5ZXJzLFxuICAgICAgbWFwTGF5ZXJzLFxuICAgICAgcG9wb3Zlck9mZnNldFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gaWYgY2xpY2tlZCBzb21ldGhpbmcsIGlnbm9yZSBob3ZlciBiZWhhdmlvclxuICAgIGNvbnN0IG9iamVjdEluZm8gPSBjbGlja2VkIHx8IGhvdmVySW5mbztcbiAgICBpZiAoXG4gICAgICAhaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5lbmFibGVkIHx8XG4gICAgICAhb2JqZWN0SW5mbyB8fFxuICAgICAgIW9iamVjdEluZm8ucGlja2VkXG4gICAgKSB7XG4gICAgICAvLyBub3RoaW5nIGhvdmVyZWRcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHtsbmdMYXQsIG9iamVjdCwgbGF5ZXI6IG92ZXJsYXl9ID0gb2JqZWN0SW5mbztcblxuICAgIC8vIGRlY2tnbCBsYXllciB0byBrZXBsZXItZ2wgbGF5ZXJcbiAgICBjb25zdCBsYXllciA9IGxheWVyc1tvdmVybGF5LnByb3BzLmlkeF07XG5cbiAgICBpZiAoXG4gICAgICAhbGF5ZXIgfHxcbiAgICAgICFsYXllci5jb25maWcuaXNWaXNpYmxlIHx8XG4gICAgICAhb2JqZWN0IHx8XG4gICAgICAhbGF5ZXIuZ2V0SG92ZXJEYXRhIHx8XG4gICAgICAobWFwTGF5ZXJzICYmICFtYXBMYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZSlcbiAgICApIHtcbiAgICAgIC8vIGxheWVyIGlzIG5vIHZpc2libGVcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHtjb25maWc6IHtkYXRhSWR9fSA9IGxheWVyO1xuICAgIGNvbnN0IHthbGxEYXRhLCBmaWVsZHN9ID0gZGF0YXNldHNbZGF0YUlkXTtcbiAgICBjb25zdCBkYXRhID0gbGF5ZXIuZ2V0SG92ZXJEYXRhKG9iamVjdCwgYWxsRGF0YSk7XG5cbiAgICAvLyBwcm9qZWN0IGxuZ2xhdCB0byBzY3JlZW4gc28gdGhhdCB0b29sdGlwIGZvbGxvd3MgdGhlIG9iamVjdCBvbiB6b29tXG4gICAgY29uc3Qge3ZpZXdwb3J0fSA9IG92ZXJsYXkuY29udGV4dDtcbiAgICBjb25zdCB7eCwgeX0gPSB0aGlzLl9nZXRIb3ZlclhZKHZpZXdwb3J0LCBsbmdMYXQpIHx8IG9iamVjdEluZm87XG5cbiAgICBjb25zdCBwb3BvdmVyUHJvcHMgPSB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGRzLFxuICAgICAgZmllbGRzVG9TaG93OiBpbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLmNvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXSxcbiAgICAgIGxheWVyLFxuICAgICAgaXNWaXNpYmxlOiB0cnVlLFxuICAgICAgbG5nTGF0LFxuICAgICAgeCxcbiAgICAgIHk6IHkgKyBwb3BvdmVyT2Zmc2V0LnRvcCxcbiAgICAgIGZyZWV6ZWQ6IEJvb2xlYW4oY2xpY2tlZCksXG4gICAgICBvbkNsb3NlOiB0aGlzLl9vbkNsb3NlTWFwUG9wb3ZlclxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPE1hcFBvcG92ZXIgey4uLnBvcG92ZXJQcm9wc30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbiAgX2dldEhvdmVyWFkodmlld3BvcnQsIGxuZ0xhdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkID0gIXZpZXdwb3J0IHx8ICFsbmdMYXQgPyBudWxsIDogdmlld3BvcnQucHJvamVjdChsbmdMYXQpO1xuXG4gICAgcmV0dXJuIHNjcmVlbkNvb3JkICYmIHt4OiBzY3JlZW5Db29yZFswXSwgeTogc2NyZWVuQ29vcmRbMV19O1xuICB9XG5cbiAgX3JlbmRlckJ1aWxkaW5nTGF5ZXIobGF5ZXIsIGJ1aWxkaW5nRGF0YSwgbWFwU3RhdGUpIHtcbiAgICBjb25zdCB7bG9uZ2l0dWRlLCBsYXRpdHVkZSwgem9vbSwgd2lkdGgsIGhlaWdodH0gPSBtYXBTdGF0ZTtcbiAgICBjb25zdCBiYm94ID0gZ2VvVmlld3BvcnQuYm91bmRzKFtsb25naXR1ZGUsIGxhdGl0dWRlXSwgTWF0aC5mbG9vcih6b29tKSwgW1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHRcbiAgICBdKTtcbiAgICBjb25zdCBsaWdodFNldHRpbmdzID0gZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYmJveCk7XG5cbiAgICAvLyByZW5kZXIgb25lIGxheWVyIHBlciB0aWxlXG4gICAgcmV0dXJuIGJ1aWxkaW5nRGF0YS5tYXAoXG4gICAgICAoe3RpbGVJZCwgZGF0YX0pID0+XG4gICAgICAgIG5ldyBQb2x5Z29uTGF5ZXIoe1xuICAgICAgICAgIGlkOiB0aWxlSWQsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBmcDY0OiBNYXRoLmZsb29yKHpvb20pID49IDE2LFxuICAgICAgICAgIGV4dHJ1ZGVkOiB0cnVlLFxuICAgICAgICAgIGdldEZpbGxDb2xvcjogZiA9PiBsYXllci5jb2xvcixcbiAgICAgICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiBsYXllci5jb2xvclxuICAgICAgICAgIH0sXG4gICAgICAgICAgbGlnaHRTZXR0aW5ncyxcbiAgICAgICAgICBnZXRQb2x5Z29uOiBmID0+IGYuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgZ2V0RWxldmF0aW9uOiBmID0+IGYucHJvcGVydGllcy5oZWlnaHQsXG4gICAgICAgICAgb3BhY2l0eTogbGF5ZXIub3BhY2l0eVxuICAgICAgICB9KVxuICAgICk7XG4gIH1cblxuICBfc2hvdWxkUmVuZGVyTGF5ZXIobGF5ZXIsIGRhdGEsIG1hcExheWVycykge1xuICAgIGNvbnN0IGlzQXZhaWxhYmxlQW5kVmlzaWJsZSA9XG4gICAgICAhKG1hcExheWVycyAmJiBtYXBMYXllcnNbbGF5ZXIuaWRdKSB8fCBtYXBMYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZTtcbiAgICByZXR1cm4gbGF5ZXIuc2hvdWxkUmVuZGVyTGF5ZXIoZGF0YSkgJiYgaXNBdmFpbGFibGVBbmRWaXNpYmxlO1xuICB9XG5cbiAgX3JlbmRlckxheWVyID0gKG92ZXJsYXlzLCBpZHgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBsYXllcnMsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgbWFwTGF5ZXJzLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHttb3VzZVBvc2l0aW9ufSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbGF5ZXIgPSBsYXllcnNbaWR4XTtcbiAgICBjb25zdCBkYXRhID0gbGF5ZXJEYXRhW2lkeF07XG5cbiAgICBjb25zdCBsYXllckludGVyYWN0aW9uID0ge1xuICAgICAgb25Ib3ZlcjogdmlzU3RhdGVBY3Rpb25zLm9uTGF5ZXJIb3ZlcixcbiAgICAgIG9uQ2xpY2s6IHZpc1N0YXRlQWN0aW9ucy5vbkxheWVyQ2xpY2ssXG4gICAgICBtb3VzZVBvc2l0aW9uXG4gICAgfTtcblxuICAgIGNvbnN0IG9iamVjdEhvdmVyZWQgPSBjbGlja2VkIHx8IGhvdmVySW5mbztcbiAgICBjb25zdCBsYXllckNhbGxiYWNrcyA9IHtcbiAgICAgIG9uU2V0TGF5ZXJEb21haW46IHZhbCA9PiB0aGlzLl9vbkxheWVyU2V0RG9tYWluKGlkeCwgdmFsKVxuICAgIH07XG5cbiAgICBpZiAoIXRoaXMuX3Nob3VsZFJlbmRlckxheWVyKGxheWVyLCBkYXRhLCBtYXBMYXllcnMpKSB7XG4gICAgICByZXR1cm4gb3ZlcmxheXM7XG4gICAgfVxuXG4gICAgbGV0IGxheWVyT3ZlcmxheSA9IFtdO1xuXG4gICAgLy8gTGF5ZXIgaXMgTGF5ZXIgY2xhc3NcbiAgICBpZiAodHlwZW9mIGxheWVyLnJlbmRlckxheWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsYXllck92ZXJsYXkgPSBsYXllci5yZW5kZXJMYXllcih7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIGlkeCxcbiAgICAgICAgbGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgb2JqZWN0SG92ZXJlZCxcbiAgICAgICAgbWFwU3RhdGUsXG4gICAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgICBsYXllckNhbGxiYWNrc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGxheWVyT3ZlcmxheS5sZW5ndGgpIHtcbiAgICAgIG92ZXJsYXlzID0gb3ZlcmxheXMuY29uY2F0KGxheWVyT3ZlcmxheSk7XG4gICAgfVxuICAgIHJldHVybiBvdmVybGF5cztcbiAgfTtcblxuICBfcmVuZGVyT3ZlcmxheSgpIHtcbiAgICBjb25zdCB7XG4gICAgICBtYXBTdGF0ZSxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgYnVpbGRpbmdEYXRhLFxuICAgICAgbGF5ZXJEYXRhLFxuICAgICAgbGF5ZXJPcmRlclxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtoYXNCdWlsZGluZ0xheWVyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgZGVja0dsTGF5ZXJzID0gW107XG5cbiAgICAvLyB3YWl0IHVudGlsIGRhdGEgaXMgcmVhZHkgYmVmb3JlIHJlbmRlciBkYXRhIGxheWVyc1xuICAgIGlmIChsYXllckRhdGEgJiYgbGF5ZXJEYXRhLmxlbmd0aCkge1xuICAgICAgLy8gbGFzdCBsYXllciByZW5kZXIgZmlyc3RcbiAgICAgIGRlY2tHbExheWVycyA9IGxheWVyT3JkZXJcbiAgICAgICAgLnNsaWNlKClcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAucmVkdWNlKHRoaXMuX3JlbmRlckxheWVyLCBbXSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIDNkIGJ1aWxkaW5nIGxheWVyXG4gICAgaWYgKGhhc0J1aWxkaW5nTGF5ZXIpIHtcbiAgICAgIGRlY2tHbExheWVycyA9IGRlY2tHbExheWVycy5jb25jYXQoXG4gICAgICAgIHRoaXMuX3JlbmRlckJ1aWxkaW5nTGF5ZXIoXG4gICAgICAgICAgbWFwU3R5bGUuYnVpbGRpbmdMYXllcixcbiAgICAgICAgICBidWlsZGluZ0RhdGEsXG4gICAgICAgICAgbWFwU3RhdGVcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPERlY2tHTFxuICAgICAgICB7Li4ubWFwU3RhdGV9XG4gICAgICAgIGlkPVwiZGVmYXVsdC1kZWNrZ2wtb3ZlcmxheVwiXG4gICAgICAgIGxheWVycz17ZGVja0dsTGF5ZXJzfVxuICAgICAgICBrZXk9e3RoaXMuc3RhdGUucmVSZW5kZXJLZXl9XG4gICAgICAgIG9uV2ViR0xJbml0aWFsaXplZD17dGhpcy5fb25XZWJHTEluaXRpYWxpemVkfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXBTdGF0ZSwgbWFwU3R5bGUsIG1hcFN0YXRlQWN0aW9uc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt1cGRhdGVNYXAsIG9uTWFwQ2xpY2t9ID0gbWFwU3RhdGVBY3Rpb25zO1xuXG4gICAgaWYgKCFtYXBTdHlsZS5ib3R0b21NYXBTdHlsZSkge1xuICAgICAgLy8gc3R5bGUgbm90IHlldCBsb2FkZWRcbiAgICAgIHJldHVybiA8ZGl2IC8+O1xuICAgIH1cblxuICAgIGNvbnN0IHttYXBMYXllcnMsIGxheWVycywgZGF0YXNldHMsIGluZGV4fSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBtYXBQcm9wcyA9IHtcbiAgICAgIC4uLm1hcFN0YXRlLFxuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlLFxuICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IE1BUEJPWF9BQ0NFU1NfVE9LRU4sXG4gICAgICBvblZpZXdwb3J0Q2hhbmdlOiB1cGRhdGVNYXBcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e01BUF9TVFlMRS5jb250YWluZXJ9IG9uTW91c2VNb3ZlPXt0aGlzLl9vbk1vdXNlTW92ZX0+XG4gICAgICAgIDxNYXBDb250cm9sXG4gICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICBkcmFnUm90YXRlPXttYXBTdGF0ZS5kcmFnUm90YXRlfVxuICAgICAgICAgIGlzU3BsaXQ9e21hcFN0YXRlLmlzU3BsaXR9XG4gICAgICAgICAgaXNGdWxsU2NyZWVuPXttYXBTdGF0ZS5pc0Z1bGxTY3JlZW59XG4gICAgICAgICAgbGF5ZXJzPXtsYXllcnN9XG4gICAgICAgICAgbWFwSW5kZXg9e3RoaXMucHJvcHMuaW5kZXh9XG4gICAgICAgICAgbWFwTGF5ZXJzPXttYXBMYXllcnN9XG4gICAgICAgICAgb25Ub2dnbGVQZXJzcGVjdGl2ZT17bWFwU3RhdGVBY3Rpb25zLnRvZ2dsZVBlcnNwZWN0aXZlfVxuICAgICAgICAgIG9uVG9nZ2xlU3BsaXRNYXA9e21hcFN0YXRlQWN0aW9ucy50b2dnbGVTcGxpdE1hcH1cbiAgICAgICAgICBvbk1hcFRvZ2dsZUxheWVyPXt0aGlzLl9oYW5kbGVNYXBUb2dnbGVMYXllcn1cbiAgICAgICAgICBvblRvZ2dsZUZ1bGxTY3JlZW49e21hcFN0YXRlQWN0aW9ucy50b2dnbGVGdWxsU2NyZWVufVxuICAgICAgICAgIHRvcD17MH1cbiAgICAgICAgLz5cbiAgICAgICAgPE1hcGJveEdMTWFwXG4gICAgICAgICAgey4uLm1hcFByb3BzfVxuICAgICAgICAgIGtleT1cImJvdHRvbVwiXG4gICAgICAgICAgbWFwU3R5bGU9e21hcFN0eWxlLmJvdHRvbU1hcFN0eWxlfVxuICAgICAgICAgIG9uQ2xpY2s9e29uTWFwQ2xpY2t9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5fcmVuZGVyT3ZlcmxheSgpfVxuICAgICAgICA8L01hcGJveEdMTWFwPlxuICAgICAgICB7bWFwU3R5bGUudG9wTWFwU3R5bGUgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e01BUF9TVFlMRS50b3B9PlxuICAgICAgICAgICAgPE1hcGJveEdMTWFwXG4gICAgICAgICAgICAgIHsuLi5tYXBQcm9wc31cbiAgICAgICAgICAgICAga2V5PVwidG9wXCJcbiAgICAgICAgICAgICAgbWFwU3R5bGU9e21hcFN0eWxlLnRvcE1hcFN0eWxlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge3RoaXMuX3JlbmRlck9iamVjdExheWVyUG9wb3ZlcigpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5NYXBDb250YWluZXIucHJvcHNUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==