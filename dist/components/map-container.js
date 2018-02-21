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

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n.mapboxgl-map .mapboxgl-missing-css {\n  display: none;\n}\n'], ['\n.mapboxgl-map .mapboxgl-missing-css {\n  display: none;\n}\n']); // libraries


// components


// deckgl layers


// default-settings


// utils


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

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

var MAP_STYLE = {
  container: {
    display: 'inline-block',
    position: 'relative'
  },
  top: {
    position: 'absolute', top: '0px', pointerEvents: 'none'
  }
};

var StyledMapContainer = _styledComponents2.default.div(_templateObject);

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
    key: '_renderMapboxLayers',
    value: function _renderMapboxLayers() {
      var _props3 = this.props,
          layers = _props3.layers,
          layerData = _props3.layerData,
          layerOrder = _props3.layerOrder;


      var mapboxLayers = [];

      // wait until data is ready before render data layers
      if (layerData && layerData.length) {
        // last layer render first
        mapboxLayers = layerOrder.slice().reverse().reduce(function (overlays, idx) {
          var layer = layers[idx];
          // TODO: this should be type !== mapbox
          return layer.type !== 'heatmap' ? overlays : [].concat((0, _toConsumableArray3.default)(overlays), [{
            id: layer.id,
            data: layerData[idx].data,
            config: layerData[idx].config,
            datasetId: layer.config.dataId
          }]);
        }, []);
      }

      return mapboxLayers;
    }
  }, {
    key: '_renderMapboxOverlays',
    value: function _renderMapboxOverlays() {
      if (this.refs.mapbox) {
        var map = this.refs.mapbox.getMap();
        if (map.isStyleLoaded()) {
          var mapboxLayers = this._renderMapboxLayers();
          if (mapboxLayers.length === 0) {
            return;
          }

          mapboxLayers.forEach(function (overlay) {
            var layerId = overlay.id,
                config = overlay.config,
                data = overlay.data,
                datasetId = overlay.datasetId;

            if (!data || !config) {
              return;
            }

            // checking if source already exists
            var source = map.getSource(datasetId);
            if (!source) {
              map.addSource(datasetId, {
                type: 'geojson',
                data: data
              });
            } else {
              source.setData(data);
            }

            // check if layer already is set
            var layerConfig = map.getLayer(layerId);
            if (layerConfig) {
              map.removeLayer(layerId);
            }
            map.addLayer(config);

            // TODO: decide how to handle updates to data and config
          });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          mapState = _props4.mapState,
          mapStyle = _props4.mapStyle,
          mapStateActions = _props4.mapStateActions;
      var updateMap = mapStateActions.updateMap,
          onMapClick = mapStateActions.onMapClick;


      if (!mapStyle.bottomMapStyle) {
        // style not yet loaded
        return _react2.default.createElement('div', null);
      }

      var _props5 = this.props,
          mapLayers = _props5.mapLayers,
          layers = _props5.layers,
          datasets = _props5.datasets,
          index = _props5.index;


      var mapProps = (0, _extends3.default)({}, mapState, {
        preserveDrawingBuffer: true,
        mapboxApiAccessToken: _defaultSettings.MAPBOX_ACCESS_TOKEN,
        onViewportChange: updateMap
      });

      return _react2.default.createElement(
        StyledMapContainer,
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
            ref: 'mapbox',
            mapStyle: mapStyle.bottomMapStyle,
            onClick: onMapClick
          }),
          this._renderOverlay(),
          this._renderMapboxOverlays()
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiTUFQX1NUWUxFIiwiY29udGFpbmVyIiwiZGlzcGxheSIsInBvc2l0aW9uIiwidG9wIiwicG9pbnRlckV2ZW50cyIsIlN0eWxlZE1hcENvbnRhaW5lciIsImRpdiIsImdldEdsQ29uc3QiLCJkIiwicHJvcFR5cGVzIiwiZGF0YSIsImFycmF5IiwiaXNSZXF1aXJlZCIsImZpZWxkcyIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVyRGF0YSIsImxheWVycyIsIm1hcFN0YXRlIiwibWFwU3R5bGUiLCJwb3BvdmVyT2Zmc2V0IiwibWFwTGF5ZXJzIiwiUHJvcFR5cGVzIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBDb250YWluZXIiLCJwcm9wcyIsIl9vbkNsb3NlTWFwUG9wb3ZlciIsInZpc1N0YXRlQWN0aW9ucyIsIm9uTGF5ZXJDbGljayIsIl9vbkxheWVyU2V0RG9tYWluIiwiaWR4IiwiY29sb3JEb21haW4iLCJsYXllckNvbmZpZ0NoYW5nZSIsIl9vbldlYkdMSW5pdGlhbGl6ZWQiLCJkcmFnUm90YXRlIiwiZ2wiLCJlbmFibGUiLCJERVBUSF9URVNUIiwiZGVwdGhGdW5jIiwiTEVRVUFMIiwiZGlzYWJsZSIsImdldEV4dGVuc2lvbiIsIl90b2dnbGVsYXllckJsZW5kaW5nIiwic2V0U3RhdGUiLCJfb25Nb3VzZU1vdmUiLCJicnVzaCIsImV2dCIsIm5hdGl2ZUV2ZW50IiwiZW5hYmxlZCIsIm1vdXNlUG9zaXRpb24iLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl9oYW5kbGVNYXBUb2dnbGVMYXllciIsImluZGV4IiwibWFwSW5kZXgiLCJ0b2dnbGVMYXllckZvck1hcCIsImxheWVySWQiLCJibGVuZGluZyIsImJsZW5kRnVuYyIsImJsZW5kRXF1YXRpb24iLCJibGVuZEZ1bmNTZXBhcmF0ZSIsImJsZW5kRXF1YXRpb25TZXBhcmF0ZSIsIkJMRU5EIiwibWFwIiwiX3JlbmRlckxheWVyIiwib3ZlcmxheXMiLCJob3ZlckluZm8iLCJjbGlja2VkIiwic3RhdGUiLCJsYXllciIsImxheWVySW50ZXJhY3Rpb24iLCJvbkhvdmVyIiwib25MYXllckhvdmVyIiwib25DbGljayIsIm9iamVjdEhvdmVyZWQiLCJsYXllckNhbGxiYWNrcyIsIm9uU2V0TGF5ZXJEb21haW4iLCJ2YWwiLCJfc2hvdWxkUmVuZGVyTGF5ZXIiLCJsYXllck92ZXJsYXkiLCJyZW5kZXJMYXllciIsImxlbmd0aCIsImNvbmNhdCIsImhhc0J1aWxkaW5nTGF5ZXIiLCJyZVJlbmRlcktleSIsImxvYWRCdWlsZGluZ1RpbGVzIiwibmV4dFByb3BzIiwiYnVpbGRpbmdMYXllciIsImlzVmlzaWJsZSIsInByZXZQcm9wcyIsInByZXZTdGF0ZSIsImJ1aWxkaW5nRGF0YUFjdGlvbnMiLCJsb2FkQnVpbGRpbmdUaWxlIiwiZGF0YXNldHMiLCJvYmplY3RJbmZvIiwidG9vbHRpcCIsInBpY2tlZCIsImxuZ0xhdCIsIm92ZXJsYXkiLCJjb25maWciLCJnZXRIb3ZlckRhdGEiLCJpZCIsImRhdGFJZCIsImFsbERhdGEiLCJ2aWV3cG9ydCIsImNvbnRleHQiLCJfZ2V0SG92ZXJYWSIsIngiLCJ5IiwicG9wb3ZlclByb3BzIiwiZmllbGRzVG9TaG93IiwiZnJlZXplZCIsIkJvb2xlYW4iLCJvbkNsb3NlIiwic2NyZWVuQ29vcmQiLCJwcm9qZWN0IiwiYnVpbGRpbmdEYXRhIiwibG9uZ2l0dWRlIiwibGF0aXR1ZGUiLCJ6b29tIiwid2lkdGgiLCJoZWlnaHQiLCJiYm94IiwiYm91bmRzIiwiTWF0aCIsImZsb29yIiwibGlnaHRTZXR0aW5ncyIsInRpbGVJZCIsImZwNjQiLCJleHRydWRlZCIsImdldEZpbGxDb2xvciIsImNvbG9yIiwidXBkYXRlVHJpZ2dlcnMiLCJnZXRQb2x5Z29uIiwiZiIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJnZXRFbGV2YXRpb24iLCJwcm9wZXJ0aWVzIiwib3BhY2l0eSIsImlzQXZhaWxhYmxlQW5kVmlzaWJsZSIsInNob3VsZFJlbmRlckxheWVyIiwibGF5ZXJPcmRlciIsImRlY2tHbExheWVycyIsInNsaWNlIiwicmV2ZXJzZSIsInJlZHVjZSIsIl9yZW5kZXJCdWlsZGluZ0xheWVyIiwibWFwYm94TGF5ZXJzIiwidHlwZSIsImRhdGFzZXRJZCIsInJlZnMiLCJtYXBib3giLCJnZXRNYXAiLCJpc1N0eWxlTG9hZGVkIiwiX3JlbmRlck1hcGJveExheWVycyIsImZvckVhY2giLCJzb3VyY2UiLCJnZXRTb3VyY2UiLCJhZGRTb3VyY2UiLCJzZXREYXRhIiwibGF5ZXJDb25maWciLCJnZXRMYXllciIsInJlbW92ZUxheWVyIiwiYWRkTGF5ZXIiLCJtYXBTdGF0ZUFjdGlvbnMiLCJ1cGRhdGVNYXAiLCJvbk1hcENsaWNrIiwiYm90dG9tTWFwU3R5bGUiLCJtYXBQcm9wcyIsInByZXNlcnZlRHJhd2luZ0J1ZmZlciIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwib25WaWV3cG9ydENoYW5nZSIsImlzU3BsaXQiLCJpc0Z1bGxTY3JlZW4iLCJ0b2dnbGVQZXJzcGVjdGl2ZSIsInRvZ2dsZVNwbGl0TWFwIiwidG9nZ2xlRnVsbFNjcmVlbiIsIl9yZW5kZXJPdmVybGF5IiwiX3JlbmRlck1hcGJveE92ZXJsYXlzIiwidG9wTWFwU3R5bGUiLCJfcmVuZGVyT2JqZWN0TGF5ZXJQb3BvdmVyIiwicHJvcHNUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b01BQUE7OztBQVVBOzs7QUFJQTs7O0FBR0E7OztBQUdBOzs7QUFuQkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBTUE7O0FBR0E7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxhQUFXO0FBQ1RDLGFBQVMsY0FEQTtBQUVUQyxjQUFVO0FB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YnJhcmllc1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTWFwYm94R0xNYXAgZnJvbSAncmVhY3QtbWFwLWdsJztcbmltcG9ydCBnZW9WaWV3cG9ydCBmcm9tICdAbWFwYm94L2dlby12aWV3cG9ydCc7XG5pbXBvcnQgRGVja0dMIGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtHTH0gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoLnRocm90dGxlJztcblxuLy8gY29tcG9uZW50c1xuaW1wb3J0IE1hcFBvcG92ZXIgZnJvbSAnY29tcG9uZW50cy9tYXAvbWFwLXBvcG92ZXInO1xuaW1wb3J0IE1hcENvbnRyb2wgZnJvbSAnY29tcG9uZW50cy9tYXAvbWFwLWNvbnRyb2wnO1xuXG4vLyBkZWNrZ2wgbGF5ZXJzXG5pbXBvcnQge1BvbHlnb25MYXllcn0gZnJvbSAnZGVjay5nbCc7XG5cbi8vIGRlZmF1bHQtc2V0dGluZ3NcbmltcG9ydCB7TUFQQk9YX0FDQ0VTU19UT0tFTiwgTEFZRVJfQkxFTkRJTkdTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8vIHV0aWxzXG5pbXBvcnQge2dldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzfSBmcm9tICd1dGlscy9sYXllci11dGlscy9sYXllci11dGlscyc7XG5cbmNvbnN0IE1BUF9TVFlMRSA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgfSxcbiAgdG9wOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzBweCcsIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9XG59O1xuXG5jb25zdCBTdHlsZWRNYXBDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuLm1hcGJveGdsLW1hcCAubWFwYm94Z2wtbWlzc2luZy1jc3Mge1xuICBkaXNwbGF5OiBub25lO1xufVxuYDtcblxuY29uc3QgZ2V0R2xDb25zdCA9IGQgPT4gR0xbZF07XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgLy8gcmVxdWlyZWRcbiAgZGF0YTogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGZpZWxkczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGludGVyYWN0aW9uQ29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxheWVyQmxlbmRpbmc6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGF5ZXJEYXRhOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbWFwU3RhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgcG9wb3Zlck9mZnNldDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIG1hcExheWVyczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25NYXBUb2dnbGVMYXllcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcENvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBoYXNCdWlsZGluZ0xheWVyOiBmYWxzZSxcbiAgICAgIHJlUmVuZGVyS2V5OiAwLFxuICAgICAgZ2w6IG51bGwsXG4gICAgICBtb3VzZVBvc2l0aW9uOiBbMCwgMF1cbiAgICB9O1xuXG4gICAgdGhpcy5sb2FkQnVpbGRpbmdUaWxlcyA9IHRocm90dGxlKHRoaXMubG9hZEJ1aWxkaW5nVGlsZXMsIDEwMCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMubWFwU3RhdGUuZHJhZ1JvdGF0ZSAhPT0gbmV4dFByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgfHxcbiAgICAgIHRoaXMucHJvcHMubGF5ZXJCbGVuZGluZyAhPT0gbmV4dFByb3BzLmxheWVyQmxlbmRpbmdcbiAgICApIHtcbiAgICAgIC8vIGluY3JlbWVudCByZXJlbmRlciBrZXkgdG8gZm9yY2UgZ2wgcmVpbml0aWFsaXplIHdoZW5cbiAgICAgIC8vIHBlcnNwZWN0aXZlIG9yIGxheWVyIGJsZW5kaW5nIGNoYW5nZWRcbiAgICAgIC8vIFRPRE86IGxheWVyIGJsZW5kaW5nIGNhbiBub3cgYmUgaW1wbGVtZW50ZWQgcGVyIGxheWVyIGJhc2VcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZVJlbmRlcktleTogdGhpcy5zdGF0ZS5yZVJlbmRlcktleSArIDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5tYXBTdHlsZSAhPT0gbmV4dFByb3BzLm1hcFN0eWxlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaGFzQnVpbGRpbmdMYXllcjogbmV4dFByb3BzLm1hcFN0eWxlLmJ1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLm1hcFN0YXRlLmRyYWdSb3RhdGUgJiZcbiAgICAgIHRoaXMuc3RhdGUuaGFzQnVpbGRpbmdMYXllciAmJlxuICAgICAgdGhpcy5wcm9wcy5tYXBTdGF0ZSAhPT0gcHJldlByb3BzLm1hcFN0YXRlXG4gICAgKSB7XG4gICAgICB0aGlzLmxvYWRCdWlsZGluZ1RpbGVzKHRoaXMucHJvcHMubWFwU3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGNvbXBvbmVudCBhY3Rpb25zICovXG4gIGxvYWRCdWlsZGluZ1RpbGVzKG1hcFN0YXRlKSB7XG4gICAgdGhpcy5wcm9wcy5idWlsZGluZ0RhdGFBY3Rpb25zLmxvYWRCdWlsZGluZ1RpbGUobWFwU3RhdGUpO1xuICB9XG5cbiAgLyogY29tcG9uZW50IHByaXZhdGUgZnVuY3Rpb25zICovXG5cbiAgX29uQ2xvc2VNYXBQb3BvdmVyID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLm9uTGF5ZXJDbGljayhudWxsKTtcbiAgfTtcblxuICBfb25MYXllclNldERvbWFpbiA9IChpZHgsIGNvbG9yRG9tYWluKSA9PiB7XG4gICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMubGF5ZXJDb25maWdDaGFuZ2UodGhpcy5wcm9wcy5sYXllcnNbaWR4XSwge1xuICAgICAgY29sb3JEb21haW5cbiAgICB9KTtcbiAgfTtcblxuICBfb25XZWJHTEluaXRpYWxpemVkID0gZ2wgPT4ge1xuICAgIC8vIGVuYWJsZSBkZXB0aCB0ZXN0IGZvciBwZXJzcGVjdGl2ZSBtb2RlXG4gICAgaWYgKHRoaXMucHJvcHMubWFwU3RhdGUuZHJhZ1JvdGF0ZSkge1xuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoZ2wuREVQVEhfVEVTVCk7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgVWludDMyIGluZGljZXMgaW4gYnVpbGRpbmcgbGF5ZXJcbiAgICBnbC5nZXRFeHRlbnNpb24oJ09FU19lbGVtZW50X2luZGV4X3VpbnQnKTtcblxuICAgIHRoaXMuX3RvZ2dsZWxheWVyQmxlbmRpbmcoZ2wpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7Z2x9KTtcbiAgfTtcblxuICBfb25Nb3VzZU1vdmUgPSBldnQgPT4ge1xuICAgIGNvbnN0IHtpbnRlcmFjdGlvbkNvbmZpZzoge2JydXNofX0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKGV2dC5uYXRpdmVFdmVudCAmJiBicnVzaC5lbmFibGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW91c2VQb3NpdGlvbjogW2V2dC5uYXRpdmVFdmVudC5vZmZzZXRYLCBldnQubmF0aXZlRXZlbnQub2Zmc2V0WV1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfaGFuZGxlTWFwVG9nZ2xlTGF5ZXIgPSBsYXllcklkID0+IHtcbiAgICBjb25zdCB7aW5kZXg6IG1hcEluZGV4ID0gMCwgdmlzU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUxheWVyRm9yTWFwKG1hcEluZGV4LCBsYXllcklkKTtcbiAgfTtcblxuICAvKiBkZWNrLmdsIGRvZXNuJ3Qgc3VwcG9ydCBibGVuZEZ1bmNTZXBhcmF0ZSB5ZXRcbiAgICogc28gd2UncmUgYXBwbHlpbmcgdGhlIGJsZW5kaW5nIG91cnNlbHZlc1xuICAqL1xuICBfdG9nZ2xlbGF5ZXJCbGVuZGluZyA9IGdsID0+IHtcbiAgICBjb25zdCBibGVuZGluZyA9IExBWUVSX0JMRU5ESU5HU1t0aGlzLnByb3BzLmxheWVyQmxlbmRpbmddO1xuICAgIGNvbnN0IHtcbiAgICAgIGVuYWJsZSxcbiAgICAgIGJsZW5kRnVuYyxcbiAgICAgIGJsZW5kRXF1YXRpb24sXG4gICAgICBibGVuZEZ1bmNTZXBhcmF0ZSxcbiAgICAgIGJsZW5kRXF1YXRpb25TZXBhcmF0ZVxuICAgIH0gPSBibGVuZGluZztcblxuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGdsLmVuYWJsZShHTC5CTEVORCk7XG4gICAgICBpZiAoYmxlbmRGdW5jKSB7XG4gICAgICAgIGdsLmJsZW5kRnVuYyguLi5ibGVuZEZ1bmMubWFwKGdldEdsQ29uc3QpKTtcbiAgICAgICAgZ2wuYmxlbmRFcXVhdGlvbihHTFtibGVuZEVxdWF0aW9uXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZSguLi5ibGVuZEZ1bmNTZXBhcmF0ZS5tYXAoZ2V0R2xDb25zdCkpO1xuICAgICAgICBnbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoLi4uYmxlbmRFcXVhdGlvblNlcGFyYXRlLm1hcChnZXRHbENvbnN0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoR0wuQkxFTkQpO1xuICAgIH1cbiAgfTtcblxuICAvKiBjb21wb25lbnQgcmVuZGVyIGZ1bmN0aW9ucyAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG4gIF9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIoKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0aGlzIGludG8gcmVkdWNlciBzbyBpdCBjYW4gYmUgdGVzdGVkXG4gICAgY29uc3Qge1xuICAgICAgbWFwU3RhdGUsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgZGF0YXNldHMsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIGxheWVycyxcbiAgICAgIG1hcExheWVyc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gaWYgY2xpY2tlZCBzb21ldGhpbmcsIGlnbm9yZSBob3ZlciBiZWhhdmlvclxuICAgIGNvbnN0IG9iamVjdEluZm8gPSBjbGlja2VkIHx8IGhvdmVySW5mbztcbiAgICBpZiAoXG4gICAgICAhaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5lbmFibGVkIHx8XG4gICAgICAhb2JqZWN0SW5mbyB8fFxuICAgICAgIW9iamVjdEluZm8ucGlja2VkXG4gICAgKSB7XG4gICAgICAvLyBub3RoaW5nIGhvdmVyZWRcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHtsbmdMYXQsIG9iamVjdCwgbGF5ZXI6IG92ZXJsYXl9ID0gb2JqZWN0SW5mbztcblxuICAgIC8vIGRlY2tnbCBsYXllciB0byBrZXBsZXItZ2wgbGF5ZXJcbiAgICBjb25zdCBsYXllciA9IGxheWVyc1tvdmVybGF5LnByb3BzLmlkeF07XG5cbiAgICBpZiAoXG4gICAgICAhbGF5ZXIgfHxcbiAgICAgICFsYXllci5jb25maWcuaXNWaXNpYmxlIHx8XG4gICAgICAhb2JqZWN0IHx8XG4gICAgICAhbGF5ZXIuZ2V0SG92ZXJEYXRhIHx8XG4gICAgICAobWFwTGF5ZXJzICYmICFtYXBMYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZSlcbiAgICApIHtcbiAgICAgIC8vIGxheWVyIGlzIG5vdCB2aXNpYmxlXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7Y29uZmlnOiB7ZGF0YUlkfX0gPSBsYXllcjtcbiAgICBjb25zdCB7YWxsRGF0YSwgZmllbGRzfSA9IGRhdGFzZXRzW2RhdGFJZF07XG4gICAgY29uc3QgZGF0YSA9IGxheWVyLmdldEhvdmVyRGF0YShvYmplY3QsIGFsbERhdGEpO1xuXG4gICAgLy8gcHJvamVjdCBsbmdsYXQgdG8gc2NyZWVuIHNvIHRoYXQgdG9vbHRpcCBmb2xsb3dzIHRoZSBvYmplY3Qgb24gem9vbVxuICAgIGNvbnN0IHt2aWV3cG9ydH0gPSBvdmVybGF5LmNvbnRleHQ7XG4gICAgY29uc3Qge3gsIHl9ID0gdGhpcy5fZ2V0SG92ZXJYWSh2aWV3cG9ydCwgbG5nTGF0KSB8fCBvYmplY3RJbmZvO1xuXG4gICAgY29uc3QgcG9wb3ZlclByb3BzID0ge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGZpZWxkc1RvU2hvdzogaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF0sXG4gICAgICBsYXllcixcbiAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgZnJlZXplZDogQm9vbGVhbihjbGlja2VkKSxcbiAgICAgIG9uQ2xvc2U6IHRoaXMuX29uQ2xvc2VNYXBQb3BvdmVyLFxuICAgICAgbWFwU3RhdGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxNYXBQb3BvdmVyIHsuLi5wb3BvdmVyUHJvcHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4gIF9nZXRIb3ZlclhZKHZpZXdwb3J0LCBsbmdMYXQpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZCA9ICF2aWV3cG9ydCB8fCAhbG5nTGF0ID8gbnVsbCA6IHZpZXdwb3J0LnByb2plY3QobG5nTGF0KTtcblxuICAgIHJldHVybiBzY3JlZW5Db29yZCAmJiB7eDogc2NyZWVuQ29vcmRbMF0sIHk6IHNjcmVlbkNvb3JkWzFdfTtcbiAgfVxuXG4gIF9yZW5kZXJCdWlsZGluZ0xheWVyKGxheWVyLCBidWlsZGluZ0RhdGEsIG1hcFN0YXRlKSB7XG4gICAgY29uc3Qge2xvbmdpdHVkZSwgbGF0aXR1ZGUsIHpvb20sIHdpZHRoLCBoZWlnaHR9ID0gbWFwU3RhdGU7XG4gICAgY29uc3QgYmJveCA9IGdlb1ZpZXdwb3J0LmJvdW5kcyhbbG9uZ2l0dWRlLCBsYXRpdHVkZV0sIE1hdGguZmxvb3Ioem9vbSksIFtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0XG4gICAgXSk7XG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IGdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJib3gpO1xuXG4gICAgLy8gcmVuZGVyIG9uZSBsYXllciBwZXIgdGlsZVxuICAgIHJldHVybiBidWlsZGluZ0RhdGEubWFwKFxuICAgICAgKHt0aWxlSWQsIGRhdGF9KSA9PlxuICAgICAgICBuZXcgUG9seWdvbkxheWVyKHtcbiAgICAgICAgICBpZDogdGlsZUlkLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZnA2NDogTWF0aC5mbG9vcih6b29tKSA+PSAxNixcbiAgICAgICAgICBleHRydWRlZDogdHJ1ZSxcbiAgICAgICAgICBnZXRGaWxsQ29sb3I6IGYgPT4gbGF5ZXIuY29sb3IsXG4gICAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICAgIGdldEZpbGxDb2xvcjogbGF5ZXIuY29sb3JcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxpZ2h0U2V0dGluZ3MsXG4gICAgICAgICAgZ2V0UG9seWdvbjogZiA9PiBmLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIGdldEVsZXZhdGlvbjogZiA9PiBmLnByb3BlcnRpZXMuaGVpZ2h0LFxuICAgICAgICAgIG9wYWNpdHk6IGxheWVyLm9wYWNpdHlcbiAgICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgX3Nob3VsZFJlbmRlckxheWVyKGxheWVyLCBkYXRhLCBtYXBMYXllcnMpIHtcbiAgICBjb25zdCBpc0F2YWlsYWJsZUFuZFZpc2libGUgPVxuICAgICAgIShtYXBMYXllcnMgJiYgbWFwTGF5ZXJzW2xheWVyLmlkXSkgfHwgbWFwTGF5ZXJzW2xheWVyLmlkXS5pc1Zpc2libGU7XG4gICAgcmV0dXJuIGxheWVyLnNob3VsZFJlbmRlckxheWVyKGRhdGEpICYmIGlzQXZhaWxhYmxlQW5kVmlzaWJsZTtcbiAgfVxuXG4gIF9yZW5kZXJMYXllciA9IChvdmVybGF5cywgaWR4KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJEYXRhLFxuICAgICAgaG92ZXJJbmZvLFxuICAgICAgY2xpY2tlZCxcbiAgICAgIG1hcExheWVycyxcbiAgICAgIG1hcFN0YXRlLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWdcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7bW91c2VQb3NpdGlvbn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGxheWVyID0gbGF5ZXJzW2lkeF07XG5cbiAgICBjb25zdCBkYXRhID0gbGF5ZXJEYXRhW2lkeF07XG5cbiAgICBjb25zdCBsYXllckludGVyYWN0aW9uID0ge1xuICAgICAgb25Ib3ZlcjogdmlzU3RhdGVBY3Rpb25zLm9uTGF5ZXJIb3ZlcixcbiAgICAgIG9uQ2xpY2s6IHZpc1N0YXRlQWN0aW9ucy5vbkxheWVyQ2xpY2ssXG4gICAgICBtb3VzZVBvc2l0aW9uXG4gICAgfTtcblxuICAgIGNvbnN0IG9iamVjdEhvdmVyZWQgPSBjbGlja2VkIHx8IGhvdmVySW5mbztcbiAgICBjb25zdCBsYXllckNhbGxiYWNrcyA9IHtcbiAgICAgIG9uU2V0TGF5ZXJEb21haW46IHZhbCA9PiB0aGlzLl9vbkxheWVyU2V0RG9tYWluKGlkeCwgdmFsKVxuICAgIH07XG5cbiAgICBpZiAoIXRoaXMuX3Nob3VsZFJlbmRlckxheWVyKGxheWVyLCBkYXRhLCBtYXBMYXllcnMpKSB7XG4gICAgICByZXR1cm4gb3ZlcmxheXM7XG4gICAgfVxuXG4gICAgbGV0IGxheWVyT3ZlcmxheSA9IFtdO1xuXG4gICAgLy8gTGF5ZXIgaXMgTGF5ZXIgY2xhc3NcbiAgICBpZiAodHlwZW9mIGxheWVyLnJlbmRlckxheWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsYXllck92ZXJsYXkgPSBsYXllci5yZW5kZXJMYXllcih7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIGlkeCxcbiAgICAgICAgbGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgb2JqZWN0SG92ZXJlZCxcbiAgICAgICAgbWFwU3RhdGUsXG4gICAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgICBsYXllckNhbGxiYWNrc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGxheWVyT3ZlcmxheS5sZW5ndGgpIHtcbiAgICAgIG92ZXJsYXlzID0gb3ZlcmxheXMuY29uY2F0KGxheWVyT3ZlcmxheSk7XG4gICAgfVxuICAgIHJldHVybiBvdmVybGF5cztcbiAgfTtcblxuICBfcmVuZGVyT3ZlcmxheSgpIHtcbiAgICBjb25zdCB7XG4gICAgICBtYXBTdGF0ZSxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgYnVpbGRpbmdEYXRhLFxuICAgICAgbGF5ZXJEYXRhLFxuICAgICAgbGF5ZXJPcmRlclxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtoYXNCdWlsZGluZ0xheWVyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgZGVja0dsTGF5ZXJzID0gW107XG5cbiAgICAvLyB3YWl0IHVudGlsIGRhdGEgaXMgcmVhZHkgYmVmb3JlIHJlbmRlciBkYXRhIGxheWVyc1xuICAgIGlmIChsYXllckRhdGEgJiYgbGF5ZXJEYXRhLmxlbmd0aCkge1xuICAgICAgLy8gbGFzdCBsYXllciByZW5kZXIgZmlyc3RcbiAgICAgIGRlY2tHbExheWVycyA9IGxheWVyT3JkZXJcbiAgICAgICAgLnNsaWNlKClcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAucmVkdWNlKHRoaXMuX3JlbmRlckxheWVyLCBbXSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIDNkIGJ1aWxkaW5nIGxheWVyXG4gICAgaWYgKGhhc0J1aWxkaW5nTGF5ZXIpIHtcbiAgICAgIGRlY2tHbExheWVycyA9IGRlY2tHbExheWVycy5jb25jYXQoXG4gICAgICAgIHRoaXMuX3JlbmRlckJ1aWxkaW5nTGF5ZXIoXG4gICAgICAgICAgbWFwU3R5bGUuYnVpbGRpbmdMYXllcixcbiAgICAgICAgICBidWlsZGluZ0RhdGEsXG4gICAgICAgICAgbWFwU3RhdGVcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPERlY2tHTFxuICAgICAgICB7Li4ubWFwU3RhdGV9XG4gICAgICAgIGlkPVwiZGVmYXVsdC1kZWNrZ2wtb3ZlcmxheVwiXG4gICAgICAgIGxheWVycz17ZGVja0dsTGF5ZXJzfVxuICAgICAgICBrZXk9e3RoaXMuc3RhdGUucmVSZW5kZXJLZXl9XG4gICAgICAgIG9uV2ViR0xJbml0aWFsaXplZD17dGhpcy5fb25XZWJHTEluaXRpYWxpemVkfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlck1hcGJveExheWVycygpIHtcbiAgICBjb25zdCB7XG4gICAgICBsYXllcnMsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBsYXllck9yZGVyXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgbWFwYm94TGF5ZXJzID0gW107XG5cbiAgICAvLyB3YWl0IHVudGlsIGRhdGEgaXMgcmVhZHkgYmVmb3JlIHJlbmRlciBkYXRhIGxheWVyc1xuICAgIGlmIChsYXllckRhdGEgJiYgbGF5ZXJEYXRhLmxlbmd0aCkge1xuICAgICAgLy8gbGFzdCBsYXllciByZW5kZXIgZmlyc3RcbiAgICAgIG1hcGJveExheWVycyA9IGxheWVyT3JkZXJcbiAgICAgICAgLnNsaWNlKClcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAucmVkdWNlKChvdmVybGF5cywgaWR4KSA9PiB7XG4gICAgICAgICAgY29uc3QgbGF5ZXIgPSBsYXllcnNbaWR4XTtcbiAgICAgICAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSB0eXBlICE9PSBtYXBib3hcbiAgICAgICAgICByZXR1cm4gbGF5ZXIudHlwZSAhPT0gJ2hlYXRtYXAnID9cbiAgICAgICAgICAgIG92ZXJsYXlzXG4gICAgICAgICAgICA6IFtcbiAgICAgICAgICAgICAgLi4ub3ZlcmxheXMsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogbGF5ZXIuaWQsXG4gICAgICAgICAgICAgICAgZGF0YTogbGF5ZXJEYXRhW2lkeF0uZGF0YSxcbiAgICAgICAgICAgICAgICBjb25maWc6IGxheWVyRGF0YVtpZHhdLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkYXRhc2V0SWQ6IGxheWVyLmNvbmZpZy5kYXRhSWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcGJveExheWVycztcbiAgfVxuXG4gIF9yZW5kZXJNYXBib3hPdmVybGF5cygpIHtcbiAgICBpZiAodGhpcy5yZWZzLm1hcGJveCkge1xuICAgICAgY29uc3QgbWFwID0gdGhpcy5yZWZzLm1hcGJveC5nZXRNYXAoKTtcbiAgICAgIGlmIChtYXAuaXNTdHlsZUxvYWRlZCgpKSB7XG4gICAgICAgIGNvbnN0IG1hcGJveExheWVycyA9IHRoaXMuX3JlbmRlck1hcGJveExheWVycygpO1xuICAgICAgICBpZiAobWFwYm94TGF5ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hcGJveExheWVycy5mb3JFYWNoKG92ZXJsYXkgPT4ge1xuICAgICAgICAgIGNvbnN0IHtpZDogbGF5ZXJJZCwgY29uZmlnLCBkYXRhLCBkYXRhc2V0SWR9ID0gb3ZlcmxheTtcbiAgICAgICAgICBpZiAoIWRhdGEgfHwgIWNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNoZWNraW5nIGlmIHNvdXJjZSBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IG1hcC5nZXRTb3VyY2UoZGF0YXNldElkKTtcbiAgICAgICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICAgICAgbWFwLmFkZFNvdXJjZShkYXRhc2V0SWQsIHtcbiAgICAgICAgICAgICAgdHlwZTogJ2dlb2pzb24nLFxuICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzb3VyY2Uuc2V0RGF0YShkYXRhKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjaGVjayBpZiBsYXllciBhbHJlYWR5IGlzIHNldFxuICAgICAgICAgIGNvbnN0IGxheWVyQ29uZmlnID0gbWFwLmdldExheWVyKGxheWVySWQpO1xuICAgICAgICAgIGlmIChsYXllckNvbmZpZykge1xuICAgICAgICAgICAgbWFwLnJlbW92ZUxheWVyKGxheWVySWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXAuYWRkTGF5ZXIoY29uZmlnKTtcblxuICAgICAgICAgIC8vIFRPRE86IGRlY2lkZSBob3cgdG8gaGFuZGxlIHVwZGF0ZXMgdG8gZGF0YSBhbmQgY29uZmlnXG5cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hcFN0YXRlLCBtYXBTdHlsZSwgbWFwU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3VwZGF0ZU1hcCwgb25NYXBDbGlja30gPSBtYXBTdGF0ZUFjdGlvbnM7XG5cbiAgICBpZiAoIW1hcFN0eWxlLmJvdHRvbU1hcFN0eWxlKSB7XG4gICAgICAvLyBzdHlsZSBub3QgeWV0IGxvYWRlZFxuICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgfVxuXG4gICAgY29uc3Qge21hcExheWVycywgbGF5ZXJzLCBkYXRhc2V0cywgaW5kZXh9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IG1hcFByb3BzID0ge1xuICAgICAgLi4ubWFwU3RhdGUsXG4gICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUsXG4gICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogTUFQQk9YX0FDQ0VTU19UT0tFTixcbiAgICAgIG9uVmlld3BvcnRDaGFuZ2U6IHVwZGF0ZU1hcFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZE1hcENvbnRhaW5lciBzdHlsZT17TUFQX1NUWUxFLmNvbnRhaW5lcn0gb25Nb3VzZU1vdmU9e3RoaXMuX29uTW91c2VNb3ZlfT5cbiAgICAgICAgPE1hcENvbnRyb2xcbiAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIGRyYWdSb3RhdGU9e21hcFN0YXRlLmRyYWdSb3RhdGV9XG4gICAgICAgICAgaXNTcGxpdD17bWFwU3RhdGUuaXNTcGxpdH1cbiAgICAgICAgICBpc0Z1bGxTY3JlZW49e21hcFN0YXRlLmlzRnVsbFNjcmVlbn1cbiAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICBtYXBJbmRleD17dGhpcy5wcm9wcy5pbmRleH1cbiAgICAgICAgICBtYXBMYXllcnM9e21hcExheWVyc31cbiAgICAgICAgICBvblRvZ2dsZVBlcnNwZWN0aXZlPXttYXBTdGF0ZUFjdGlvbnMudG9nZ2xlUGVyc3BlY3RpdmV9XG4gICAgICAgICAgb25Ub2dnbGVTcGxpdE1hcD17bWFwU3RhdGVBY3Rpb25zLnRvZ2dsZVNwbGl0TWFwfVxuICAgICAgICAgIG9uTWFwVG9nZ2xlTGF5ZXI9e3RoaXMuX2hhbmRsZU1hcFRvZ2dsZUxheWVyfVxuICAgICAgICAgIG9uVG9nZ2xlRnVsbFNjcmVlbj17bWFwU3RhdGVBY3Rpb25zLnRvZ2dsZUZ1bGxTY3JlZW59XG4gICAgICAgICAgdG9wPXswfVxuICAgICAgICAvPlxuICAgICAgICA8TWFwYm94R0xNYXBcbiAgICAgICAgICB7Li4ubWFwUHJvcHN9XG4gICAgICAgICAga2V5PVwiYm90dG9tXCJcbiAgICAgICAgICByZWY9XCJtYXBib3hcIlxuICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS5ib3R0b21NYXBTdHlsZX1cbiAgICAgICAgICBvbkNsaWNrPXtvbk1hcENsaWNrfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMuX3JlbmRlck92ZXJsYXkoKX1cbiAgICAgICAgICB7dGhpcy5fcmVuZGVyTWFwYm94T3ZlcmxheXMoKX1cbiAgICAgICAgPC9NYXBib3hHTE1hcD5cbiAgICAgICAge21hcFN0eWxlLnRvcE1hcFN0eWxlICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtNQVBfU1RZTEUudG9wfT5cbiAgICAgICAgICAgIDxNYXBib3hHTE1hcFxuICAgICAgICAgICAgICB7Li4ubWFwUHJvcHN9XG4gICAgICAgICAgICAgIGtleT1cInRvcFwiXG4gICAgICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZS50b3BNYXBTdHlsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLl9yZW5kZXJPYmplY3RMYXllclBvcG92ZXIoKX1cbiAgICAgIDwvU3R5bGVkTWFwQ29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cblxuTWFwQ29udGFpbmVyLnByb3BzVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=