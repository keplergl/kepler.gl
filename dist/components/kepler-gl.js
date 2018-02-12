'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  font-family: ff-clan-web-pro, \'Helvetica Neue\', Helvetica, sans-serif;\n  font-weight: 400;\n  font-size: 0.875em;\n  line-height: 1.71429;\n\n  *,\n  *:before,\n  *:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n  }\n\n  ul {\n    margin: 0;\n    padding: 0;\n  }\n\n  li {\n    margin: 0;\n  }\n\n  a {\n    text-decoration: none;\n  }\n'], ['\n  font-family: ff-clan-web-pro, \'Helvetica Neue\', Helvetica, sans-serif;\n  font-weight: 400;\n  font-size: 0.875em;\n  line-height: 1.71429;\n\n  *,\n  *:before,\n  *:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n  }\n\n  ul {\n    margin: 0;\n    padding: 0;\n  }\n\n  li {\n    margin: 0;\n  }\n\n  a {\n    text-decoration: none;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _window = require('global/window');

var _redux = require('redux');

var _d3Request = require('d3-request');

var _d3Request2 = _interopRequireDefault(_d3Request);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _keplerglConnect = require('../connect/keplergl-connect');

var _visStateActions = require('../actions/vis-state-actions');

var VisStateActions = _interopRequireWildcard(_visStateActions);

var _mapStateActions = require('../actions/map-state-actions');

var MapStateActions = _interopRequireWildcard(_mapStateActions);

var _mapStyleActions = require('../actions/map-style-actions');

var MapStyleActions = _interopRequireWildcard(_mapStyleActions);

var _buildingDataActions = require('../actions/building-data-actions');

var BuildingDataActions = _interopRequireWildcard(_buildingDataActions);

var _uiStateActions = require('../actions/ui-state-actions');

var UIStateActions = _interopRequireWildcard(_uiStateActions);

var _defaultSettings = require('../constants/default-settings');

var _sidePanel = require('./side-panel');

var _sidePanel2 = _interopRequireDefault(_sidePanel);

var _mapContainer = require('./map-container');

var _mapContainer2 = _interopRequireDefault(_mapContainer);

var _bottomWidget = require('./bottom-widget');

var _bottomWidget2 = _interopRequireDefault(_bottomWidget);

var _modalWrapper = require('./modal-wrapper');

var _modalWrapper2 = _interopRequireDefault(_modalWrapper);

var _base = require('../styles/base');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = {
  mapStyles: [],
  width: 800,
  height: 800
};

var GlobalStyle = _styledComponents2.default.div(_templateObject);

var KeplerGL = function (_Component) {
  (0, _inherits3.default)(KeplerGL, _Component);

  function KeplerGL() {
    (0, _classCallCheck3.default)(this, KeplerGL);
    return (0, _possibleConstructorReturn3.default)(this, (KeplerGL.__proto__ || Object.getPrototypeOf(KeplerGL)).apply(this, arguments));
  }

  (0, _createClass3.default)(KeplerGL, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._loadMapStyle(this.props.mapStyles);
      this._handleResize(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
        this._handleResize(nextProps);
      }
    }
  }, {
    key: '_handleResize',
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
    key: '_loadMapStyle',
    value: function _loadMapStyle() {
      var _this2 = this;

      [].concat((0, _toConsumableArray3.default)(this.props.mapStyles), (0, _toConsumableArray3.default)(Object.values(_defaultSettings.DEFAULT_MAP_STYLES))).forEach(function (style) {
        if (style.style) {
          _this2.props.dispatch(MapStyleActions.loadMapStyles((0, _defineProperty3.default)({}, style.id, style)));
        } else {
          _this2._requestMapStyle(style);
        }
      });
    }
  }, {
    key: '_requestMapStyle',
    value: function _requestMapStyle(mapStyle) {
      var _this3 = this;

      var url = mapStyle.url,
          id = mapStyle.id;

      _d3Request2.default.json(url, function (error, result) {
        if (error) {
          _window.console.warn('Error loading map style ' + mapStyle.url);
        }
        _this3.props.dispatch(MapStyleActions.loadMapStyles((0, _defineProperty3.default)({}, id, (0, _extends3.default)({}, mapStyle, { style: result }))));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          id = _props.id,
          buildingData = _props.buildingData,
          mapStyle = _props.mapStyle,
          mapState = _props.mapState,
          uiState = _props.uiState,
          visState = _props.visState,
          buildingDataActions = _props.buildingDataActions,
          visStateActions = _props.visStateActions,
          mapStateActions = _props.mapStateActions,
          mapStyleActions = _props.mapStyleActions,
          uiStateActions = _props.uiStateActions;
      var filters = visState.filters,
          layers = visState.layers,
          splitMaps = visState.splitMaps,
          layerOrder = visState.layerOrder,
          layerBlending = visState.layerBlending,
          interactionConfig = visState.interactionConfig,
          datasets = visState.datasets,
          layerData = visState.layerData,
          hoverInfo = visState.hoverInfo,
          clicked = visState.clicked;


      var sideFields = {
        datasets: datasets,
        filters: filters,
        layers: layers,
        layerOrder: layerOrder,
        interactionConfig: interactionConfig,
        mapStyle: mapStyle,
        layerBlending: layerBlending,
        uiState: uiState,
        mapStyleActions: mapStyleActions,
        visStateActions: visStateActions,
        uiStateActions: uiStateActions,
        width: _defaultSettings.DIMENSIONS.sidePanel.width
      };

      var mapFields = {
        buildingData: buildingData,
        datasets: datasets,
        mapState: mapState,
        mapStyle: mapStyle,
        layers: layers,
        layerOrder: layerOrder,
        layerData: layerData,
        layerBlending: layerBlending,
        interactionConfig: interactionConfig,
        hoverInfo: hoverInfo,
        clicked: clicked,
        visStateActions: visStateActions,
        mapStateActions: mapStateActions,
        buildingDataActions: buildingDataActions
      };

      var isSplit = splitMaps && splitMaps.length > 1;
      var containerW = mapState.width * (Number(isSplit) + 1);

      var mapContainers = !isSplit ? [_react2.default.createElement(_mapContainer2.default, (0, _extends3.default)({
        key: 0,
        index: 0
      }, mapFields, {
        mapLayers: isSplit ? splitMaps[0].layers : null
      }))] : splitMaps.map(function (settings, index) {
        return _react2.default.createElement(_mapContainer2.default, (0, _extends3.default)({
          key: index,
          index: index
        }, mapFields, {
          mapLayers: splitMaps[index].layers
        }));
      });

      return _react2.default.createElement(
        _styledComponents.ThemeProvider,
        { theme: _base.theme },
        _react2.default.createElement(
          GlobalStyle,
          {
            style: { position: 'relative' },
            className: 'kepler-gl',
            id: 'kepler-gl__' + id,
            innerRef: function innerRef(node) {
              _this4.root = node;
            }
          },
          !mapState.isFullScreen && _react2.default.createElement(_sidePanel2.default, sideFields),
          _react2.default.createElement(
            'div',
            { className: 'maps', style: { display: 'flex' } },
            mapContainers
          ),
          _react2.default.createElement(_bottomWidget2.default, {
            filters: filters,
            datasets: datasets,
            uiState: uiState,
            visStateActions: visStateActions,
            sidePanelWidth: _defaultSettings.DIMENSIONS.sidePanel.width - _defaultSettings.DIMENSIONS.sidePanel.margin,
            containerW: containerW
          }),
          _react2.default.createElement(_modalWrapper2.default, {
            visState: visState,
            uiState: uiState,
            visStateActions: visStateActions,
            uiStateActions: uiStateActions,
            rootNode: this.root,
            containerW: containerW,
            containerH: mapState.height
          })
        )
      );
    }
  }]);
  return KeplerGL;
}(_react.Component);

KeplerGL.defaultProps = defaultProps;

function mapStateToProps(state, props) {
  return (0, _extends3.default)({}, props, {
    visState: state.visState,
    buildingData: state.buildingData.buildingData,
    mapStyle: state.mapStyle,
    mapState: state.mapState,
    uiState: state.uiState
  });
}

function mapDispatchToProps(dispatch, ownProps) {
  var userActions = ownProps.actions || {};

  var _map = [VisStateActions, MapStateActions, MapStyleActions, BuildingDataActions, UIStateActions].map(function (actions) {
    return (0, _redux.bindActionCreators)(mergeActions(actions, userActions), dispatch);
  }),
      _map2 = (0, _slicedToArray3.default)(_map, 5),
      visStateActions = _map2[0],
      mapStateActions = _map2[1],
      mapStyleActions = _map2[2],
      buildingDataActions = _map2[3],
      uiStateActions = _map2[4];

  return {
    visStateActions: visStateActions,
    mapStateActions: mapStateActions,
    mapStyleActions: mapStyleActions,
    buildingDataActions: buildingDataActions,
    uiStateActions: uiStateActions,
    dispatch: dispatch
  };
}

/**
 * Override default maps-gl actions with user defined actions using the same key
 */
function mergeActions(actions, userActions) {
  var overrides = {};
  for (var key in userActions) {
    if (userActions.hasOwnProperty(key) && actions.hasOwnProperty(key)) {
      overrides[key] = userActions[key];
    }
  }

  return (0, _extends3.default)({}, actions, overrides);
}

exports.default = (0, _keplerglConnect.connect)(mapStateToProps, mapDispatchToProps)(KeplerGL);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJWaXNTdGF0ZUFjdGlvbnMiLCJNYXBTdGF0ZUFjdGlvbnMiLCJNYXBTdHlsZUFjdGlvbnMiLCJCdWlsZGluZ0RhdGFBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJkZWZhdWx0UHJvcHMiLCJtYXBTdHlsZXMiLCJ3aWR0aCIsImhlaWdodCIsIkdsb2JhbFN0eWxlIiwiZGl2IiwiS2VwbGVyR0wiLCJfbG9hZE1hcFN0eWxlIiwicHJvcHMiLCJfaGFuZGxlUmVzaXplIiwibmV4dFByb3BzIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ3YXJuIiwibWFwU3RhdGVBY3Rpb25zIiwidXBkYXRlTWFwIiwibWFwU3RhdGUiLCJpc1NwbGl0IiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsInN0eWxlIiwiZGlzcGF0Y2giLCJsb2FkTWFwU3R5bGVzIiwiaWQiLCJfcmVxdWVzdE1hcFN0eWxlIiwibWFwU3R5bGUiLCJ1cmwiLCJqc29uIiwiZXJyb3IiLCJyZXN1bHQiLCJidWlsZGluZ0RhdGEiLCJ1aVN0YXRlIiwidmlzU3RhdGUiLCJidWlsZGluZ0RhdGFBY3Rpb25zIiwidmlzU3RhdGVBY3Rpb25zIiwibWFwU3R5bGVBY3Rpb25zIiwidWlTdGF0ZUFjdGlvbnMiLCJmaWx0ZXJzIiwibGF5ZXJzIiwic3BsaXRNYXBzIiwibGF5ZXJPcmRlciIsImxheWVyQmxlbmRpbmciLCJpbnRlcmFjdGlvbkNvbmZpZyIsImRhdGFzZXRzIiwibGF5ZXJEYXRhIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsInNpZGVGaWVsZHMiLCJzaWRlUGFuZWwiLCJtYXBGaWVsZHMiLCJsZW5ndGgiLCJjb250YWluZXJXIiwibWFwQ29udGFpbmVycyIsIm1hcCIsInNldHRpbmdzIiwiaW5kZXgiLCJwb3NpdGlvbiIsInJvb3QiLCJub2RlIiwiaXNGdWxsU2NyZWVuIiwiZGlzcGxheSIsIm1hcmdpbiIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwib3duUHJvcHMiLCJ1c2VyQWN0aW9ucyIsImFjdGlvbnMiLCJtZXJnZUFjdGlvbnMiLCJvdmVycmlkZXMiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFJQTs7SUFBWUEsZTs7QUFDWjs7SUFBWUMsZTs7QUFDWjs7SUFBWUMsZTs7QUFDWjs7SUFBWUMsbUI7O0FBQ1o7O0lBQVlDLGM7O0FBRVo7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRUEsSUFBTUMsZUFBZTtBQUNuQkMsYUFBVyxFQURRO0FBRW5CQyxTQUFPLEdBRlk7QUFHbkJDLFVBQVE7QUFIVyxDQUFyQjs7QUFNQSxJQUFNQyxjQUFjLDJCQUFPQyxHQUFyQixpQkFBTjs7SUE0Qk1DLFE7Ozs7Ozs7Ozs7d0NBQ2dCO0FBQ2xCLFdBQUtDLGFBQUwsQ0FBbUIsS0FBS0MsS0FBTCxDQUFXUCxTQUE5QjtBQUNBLFdBQUtRLGFBQUwsQ0FBbUIsS0FBS0QsS0FBeEI7QUFDRDs7OzhDQUV5QkUsUyxFQUFXO0FBQ25DLFVBQ0UsS0FBS0YsS0FBTCxDQUFXTixLQUFYLEtBQXFCUSxVQUFVUixLQUEvQixJQUNBLEtBQUtNLEtBQUwsQ0FBV0wsTUFBWCxLQUFzQk8sVUFBVVAsTUFGbEMsRUFHRTtBQUNBLGFBQUtNLGFBQUwsQ0FBbUJDLFNBQW5CO0FBQ0Q7QUFDRjs7O3dDQUU4QjtBQUFBLFVBQWhCUixLQUFnQixRQUFoQkEsS0FBZ0I7QUFBQSxVQUFUQyxNQUFTLFFBQVRBLE1BQVM7O0FBQzdCLFVBQUksQ0FBQ1EsT0FBT0MsUUFBUCxDQUFnQlYsS0FBaEIsQ0FBRCxJQUEyQixDQUFDUyxPQUFPQyxRQUFQLENBQWdCVCxNQUFoQixDQUFoQyxFQUF5RDtBQUN2RCx3QkFBUVUs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QUE7QUFBQSxNQUk1Q2EsZUFKNEM7QUFBQSxNQUs1Q3JCLGVBTDRDO0FBQUEsTUFNNUNzQixlQU40QztBQUFBLE1BTzVDRixtQkFQNEM7QUFBQSxNQVE1Q0csY0FSNEM7O0FBbUI5QyxTQUFPO0FBQ0xGLG9DQURLO0FBRUxyQixvQ0FGSztBQUdMc0Isb0NBSEs7QUFJTEYsNENBSks7QUFLTEcsa0NBTEs7QUFNTGY7QUFOSyxHQUFQO0FBUUQ7O0FBRUQ7OztBQUdBLFNBQVMrQyxZQUFULENBQXNCRCxPQUF0QixFQUErQkQsV0FBL0IsRUFBNEM7QUFDMUMsTUFBTUcsWUFBWSxFQUFsQjtBQUNBLE9BQUssSUFBTUMsR0FBWCxJQUFrQkosV0FBbEIsRUFBK0I7QUFDN0IsUUFBSUEsWUFBWUssY0FBWixDQUEyQkQsR0FBM0IsS0FBbUNILFFBQVFJLGNBQVIsQ0FBdUJELEdBQXZCLENBQXZDLEVBQW9FO0FBQ2xFRCxnQkFBVUMsR0FBVixJQUFpQkosWUFBWUksR0FBWixDQUFqQjtBQUNEO0FBQ0Y7O0FBRUQsb0NBQVdILE9BQVgsRUFBdUJFLFNBQXZCO0FBQ0Q7O2tCQUVjLDhCQUFnQlAsZUFBaEIsRUFBaUNFLGtCQUFqQyxFQUFxRDNELFFBQXJELEMiLCJmaWxlIjoia2VwbGVyLWdsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnZDMtcmVxdWVzdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Y29ubmVjdCBhcyBrZXBsZXJHbENvbm5lY3R9IGZyb20gJy4uL2Nvbm5lY3Qva2VwbGVyZ2wtY29ubmVjdCc7XG5cbmltcG9ydCB7VGhlbWVQcm92aWRlcn0gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgKiBhcyBWaXNTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy92aXMtc3RhdGUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBNYXBTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9tYXAtc3RhdGUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBNYXBTdHlsZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9tYXAtc3R5bGUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBCdWlsZGluZ0RhdGFBY3Rpb25zIGZyb20gJ2FjdGlvbnMvYnVpbGRpbmctZGF0YS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIFVJU3RhdGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvdWktc3RhdGUtYWN0aW9ucyc7XG5cbmltcG9ydCB7RElNRU5TSU9OUywgREVGQVVMVF9NQVBfU1RZTEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmltcG9ydCBTaWRlUGFuZWwgZnJvbSAnLi9zaWRlLXBhbmVsJztcbmltcG9ydCBNYXBDb250YWluZXIgZnJvbSAnLi9tYXAtY29udGFpbmVyJztcbmltcG9ydCBCb3R0b21XaWRnZXQgZnJvbSAnLi9ib3R0b20td2lkZ2V0JztcbmltcG9ydCBNb2RhbFdyYXBwZXIgZnJvbSAnLi9tb2RhbC13cmFwcGVyJztcblxuaW1wb3J0IHt0aGVtZX0gZnJvbSAnLi4vc3R5bGVzL2Jhc2UnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG1hcFN0eWxlczogW10sXG4gIHdpZHRoOiA4MDAsXG4gIGhlaWdodDogODAwXG59O1xuXG5jb25zdCBHbG9iYWxTdHlsZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtZmFtaWx5OiBmZi1jbGFuLXdlYi1wcm8sICdIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgZm9udC1zaXplOiAwLjg3NWVtO1xuICBsaW5lLWhlaWdodDogMS43MTQyOTtcblxuICAqLFxuICAqOmJlZm9yZSxcbiAgKjphZnRlciB7XG4gICAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB9XG5cbiAgdWwge1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG5cbiAgbGkge1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gIGEge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgfVxuYDtcblxuY2xhc3MgS2VwbGVyR0wgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9sb2FkTWFwU3R5bGUodGhpcy5wcm9wcy5tYXBTdHlsZXMpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy53aWR0aCAhPT0gbmV4dFByb3BzLndpZHRoIHx8XG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAhPT0gbmV4dFByb3BzLmhlaWdodFxuICAgICkge1xuICAgICAgdGhpcy5faGFuZGxlUmVzaXplKG5leHRQcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZVJlc2l6ZSh7d2lkdGgsIGhlaWdodH0pIHtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh3aWR0aCkgfHwgIU51bWJlci5pc0Zpbml0ZShoZWlnaHQpKSB7XG4gICAgICBDb25zb2xlLndhcm4oJ3dpZHRoIGFuZCBoZWlnaHQgaXMgcmVxdWlyZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5tYXBTdGF0ZUFjdGlvbnMudXBkYXRlTWFwKHtcbiAgICAgIHdpZHRoOiB3aWR0aCAvICgxICsgTnVtYmVyKHRoaXMucHJvcHMubWFwU3RhdGUuaXNTcGxpdCkpLFxuICAgICAgaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICBfbG9hZE1hcFN0eWxlKCkge1xuICAgIFsuLi50aGlzLnByb3BzLm1hcFN0eWxlcywgLi4uT2JqZWN0LnZhbHVlcyhERUZBVUxUX01BUF9TVFlMRVMpXS5mb3JFYWNoKFxuICAgICAgc3R5bGUgPT4ge1xuICAgICAgICBpZiAoc3R5bGUuc3R5bGUpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLmRpc3BhdGNoKFxuICAgICAgICAgICAgTWFwU3R5bGVBY3Rpb25zLmxvYWRNYXBTdHlsZXMoe1xuICAgICAgICAgICAgICBbc3R5bGUuaWRdOiBzdHlsZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcXVlc3RNYXBTdHlsZShzdHlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgX3JlcXVlc3RNYXBTdHlsZShtYXBTdHlsZSkge1xuICAgIGNvbnN0IHt1cmwsIGlkfSA9IG1hcFN0eWxlO1xuICAgIHJlcXVlc3QuanNvbih1cmwsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgQ29uc29sZS53YXJuKGBFcnJvciBsb2FkaW5nIG1hcCBzdHlsZSAke21hcFN0eWxlLnVybH1gKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goXG4gICAgICAgIE1hcFN0eWxlQWN0aW9ucy5sb2FkTWFwU3R5bGVzKHtcbiAgICAgICAgICBbaWRdOiB7Li4ubWFwU3R5bGUsIHN0eWxlOiByZXN1bHR9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIC8vIHByb3BzXG4gICAgICBpZCxcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICB1aVN0YXRlLFxuICAgICAgdmlzU3RhdGUsXG5cbiAgICAgIC8vIGFjdGlvbnMsXG4gICAgICBidWlsZGluZ0RhdGFBY3Rpb25zLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgdWlTdGF0ZUFjdGlvbnNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHtcbiAgICAgIGZpbHRlcnMsXG4gICAgICBsYXllcnMsXG4gICAgICBzcGxpdE1hcHMsIC8vIHRoaXMgd2lsbCBzdG9yZSBzdXBwb3J0IGZvciBzcGxpdCBtYXAgdmlldyBpcyBuZWNlc3NhcnlcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIGxheWVyRGF0YSxcbiAgICAgIGhvdmVySW5mbyxcbiAgICAgIGNsaWNrZWRcbiAgICB9ID0gdmlzU3RhdGU7XG5cbiAgICBjb25zdCBzaWRlRmllbGRzID0ge1xuICAgICAgZGF0YXNldHMsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJPcmRlcixcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgbWFwU3R5bGUsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgdWlTdGF0ZSxcbiAgICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIHVpU3RhdGVBY3Rpb25zLFxuICAgICAgd2lkdGg6IERJTUVOU0lPTlMuc2lkZVBhbmVsLndpZHRoXG4gICAgfTtcblxuICAgIGNvbnN0IG1hcEZpZWxkcyA9IHtcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIGxheWVycyxcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgYnVpbGRpbmdEYXRhQWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCBpc1NwbGl0ID0gc3BsaXRNYXBzICYmIHNwbGl0TWFwcy5sZW5ndGggPiAxO1xuICAgIGNvbnN0IGNvbnRhaW5lclcgPSBtYXBTdGF0ZS53aWR0aCAqIChOdW1iZXIoaXNTcGxpdCkgKyAxKTtcblxuICAgIGNvbnN0IG1hcENvbnRhaW5lcnMgPSAhaXNTcGxpdFxuICAgICAgPyBbXG4gICAgICAgICAgPE1hcENvbnRhaW5lclxuICAgICAgICAgICAga2V5PXswfVxuICAgICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgICB7Li4ubWFwRmllbGRzfVxuICAgICAgICAgICAgbWFwTGF5ZXJzPXtpc1NwbGl0ID8gc3BsaXRNYXBzWzBdLmxheWVycyA6IG51bGx9XG4gICAgICAgICAgLz5cbiAgICAgICAgXVxuICAgICAgOiBzcGxpdE1hcHMubWFwKChzZXR0aW5ncywgaW5kZXgpID0+IChcbiAgICAgICAgICA8TWFwQ29udGFpbmVyXG4gICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgey4uLm1hcEZpZWxkc31cbiAgICAgICAgICAgIG1hcExheWVycz17c3BsaXRNYXBzW2luZGV4XS5sYXllcnN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoZW1lfT5cbiAgICAgICAgPEdsb2JhbFN0eWxlXG4gICAgICAgICAgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319XG4gICAgICAgICAgY2xhc3NOYW1lPVwia2VwbGVyLWdsXCJcbiAgICAgICAgICBpZD17YGtlcGxlci1nbF9fJHtpZH1gfVxuICAgICAgICAgIGlubmVyUmVmPXtub2RlID0+IHtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHshbWFwU3RhdGUuaXNGdWxsU2NyZWVuICYmIDxTaWRlUGFuZWwgey4uLnNpZGVGaWVsZHN9IC8+fVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwc1wiIHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnfX0+XG4gICAgICAgICAgICB7bWFwQ29udGFpbmVyc31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Qm90dG9tV2lkZ2V0XG4gICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgdWlTdGF0ZT17dWlTdGF0ZX1cbiAgICAgICAgICAgIHZpc1N0YXRlQWN0aW9ucz17dmlzU3RhdGVBY3Rpb25zfVxuICAgICAgICAgICAgc2lkZVBhbmVsV2lkdGg9e1xuICAgICAgICAgICAgICBESU1FTlNJT05TLnNpZGVQYW5lbC53aWR0aCAtIERJTUVOU0lPTlMuc2lkZVBhbmVsLm1hcmdpblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyVz17Y29udGFpbmVyV31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxNb2RhbFdyYXBwZXJcbiAgICAgICAgICAgIHZpc1N0YXRlPXt2aXNTdGF0ZX1cbiAgICAgICAgICAgIHVpU3RhdGU9e3VpU3RhdGV9XG4gICAgICAgICAgICB2aXNTdGF0ZUFjdGlvbnM9e3Zpc1N0YXRlQWN0aW9uc31cbiAgICAgICAgICAgIHVpU3RhdGVBY3Rpb25zPXt1aVN0YXRlQWN0aW9uc31cbiAgICAgICAgICAgIHJvb3ROb2RlPXt0aGlzLnJvb3R9XG4gICAgICAgICAgICBjb250YWluZXJXPXtjb250YWluZXJXfVxuICAgICAgICAgICAgY29udGFpbmVySD17bWFwU3RhdGUuaGVpZ2h0fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvR2xvYmFsU3R5bGU+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5LZXBsZXJHTC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSwgcHJvcHMpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wcm9wcyxcbiAgICB2aXNTdGF0ZTogc3RhdGUudmlzU3RhdGUsXG4gICAgYnVpbGRpbmdEYXRhOiBzdGF0ZS5idWlsZGluZ0RhdGEuYnVpbGRpbmdEYXRhLFxuICAgIG1hcFN0eWxlOiBzdGF0ZS5tYXBTdHlsZSxcbiAgICBtYXBTdGF0ZTogc3RhdGUubWFwU3RhdGUsXG4gICAgdWlTdGF0ZTogc3RhdGUudWlTdGF0ZVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gsIG93blByb3BzKSB7XG4gIGNvbnN0IHVzZXJBY3Rpb25zID0gb3duUHJvcHMuYWN0aW9ucyB8fCB7fTtcblxuICBjb25zdCBbXG4gICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICB1aVN0YXRlQWN0aW9uc1xuICBdID0gW1xuICAgIFZpc1N0YXRlQWN0aW9ucyxcbiAgICBNYXBTdGF0ZUFjdGlvbnMsXG4gICAgTWFwU3R5bGVBY3Rpb25zLFxuICAgIEJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgVUlTdGF0ZUFjdGlvbnNcbiAgXS5tYXAoYWN0aW9ucyA9PlxuICAgIGJpbmRBY3Rpb25DcmVhdG9ycyhtZXJnZUFjdGlvbnMoYWN0aW9ucywgdXNlckFjdGlvbnMpLCBkaXNwYXRjaClcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICBtYXBTdGF0ZUFjdGlvbnMsXG4gICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgIGJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgdWlTdGF0ZUFjdGlvbnMsXG4gICAgZGlzcGF0Y2hcbiAgfTtcbn1cblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IG1hcHMtZ2wgYWN0aW9ucyB3aXRoIHVzZXIgZGVmaW5lZCBhY3Rpb25zIHVzaW5nIHRoZSBzYW1lIGtleVxuICovXG5mdW5jdGlvbiBtZXJnZUFjdGlvbnMoYWN0aW9ucywgdXNlckFjdGlvbnMpIHtcbiAgY29uc3Qgb3ZlcnJpZGVzID0ge307XG4gIGZvciAoY29uc3Qga2V5IGluIHVzZXJBY3Rpb25zKSB7XG4gICAgaWYgKHVzZXJBY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkgJiYgYWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBvdmVycmlkZXNba2V5XSA9IHVzZXJBY3Rpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsuLi5hY3Rpb25zLCAuLi5vdmVycmlkZXN9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBrZXBsZXJHbENvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEtlcGxlckdMKTtcbiJdfQ==