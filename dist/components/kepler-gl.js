'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-family: ff-clan-web-pro, \'Helvetica Neue\', Helvetica, sans-serif;\n  font-weight: 400;\n  font-size: .875em;\n  line-height: 1.71429;\n  \n  *,\n  *:before,\n  *:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n  }\n  \n  ul {\n    margin: 0;\n    padding: 0;\n  }\n  \n  li {\n    margin: 0;\n  }\n  \n  a {\n    text-decoration: none;\n  }\n'], ['\n  font-family: ff-clan-web-pro, \'Helvetica Neue\', Helvetica, sans-serif;\n  font-weight: 400;\n  font-size: .875em;\n  line-height: 1.71429;\n  \n  *,\n  *:before,\n  *:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n  }\n  \n  ul {\n    margin: 0;\n    padding: 0;\n  }\n  \n  li {\n    margin: 0;\n  }\n  \n  a {\n    text-decoration: none;\n  }\n']);

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

var _base = require('../styles/base');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// webpack css-loader handles css loading
// import '../stylesheets/kepler.gl.scss';

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
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  KeplerGL.prototype.componentDidMount = function componentDidMount() {
    this._loadMapStyle(this.props.mapStyles);
    this._handleResize(this.props);
  };

  KeplerGL.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      this._handleResize(nextProps);
    }
  };

  KeplerGL.prototype._handleResize = function _handleResize(_ref) {
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
  };

  KeplerGL.prototype._loadMapStyle = function _loadMapStyle() {
    var _this2 = this;

    [].concat(this.props.mapStyles, Object.values(_defaultSettings.DEFAULT_MAP_STYLES)).forEach(function (style) {
      if (style.style) {
        var _MapStyleActions$load;

        _this2.props.dispatch(MapStyleActions.loadMapStyles((_MapStyleActions$load = {}, _MapStyleActions$load[style.id] = style, _MapStyleActions$load)));
      } else {
        _this2._requestMapStyle(style);
      }
    });
  };

  KeplerGL.prototype._requestMapStyle = function _requestMapStyle(mapStyle) {
    var _this3 = this;

    var url = mapStyle.url,
        id = mapStyle.id;

    _d3Request2.default.json(url, function (error, result) {
      var _MapStyleActions$load2;

      if (error) {
        _window.console.warn('Error loading map style ' + mapStyle.url);
      }
      _this3.props.dispatch(MapStyleActions.loadMapStyles((_MapStyleActions$load2 = {}, _MapStyleActions$load2[id] = (0, _extends3.default)({}, mapStyle, { style: result }), _MapStyleActions$load2)));
    });
  };

  KeplerGL.prototype.render = function render() {
    var _this4 = this;

    var _props = this.props,
        id = _props.id,
        buildingData = _props.buildingData,
        editingDataset = _props.editingDataset,
        filters = _props.filters,
        layers = _props.layers,
        splitMaps = _props.splitMaps,
        layerOrder = _props.layerOrder,
        layerBlending = _props.layerBlending,
        interactionConfig = _props.interactionConfig,
        datasets = _props.datasets,
        mapStyle = _props.mapStyle,
        mapState = _props.mapState,
        layerData = _props.layerData,
        hoverInfo = _props.hoverInfo,
        clicked = _props.clicked,
        uiState = _props.uiState,
        buildingDataActions = _props.buildingDataActions,
        visStateActions = _props.visStateActions,
        mapStateActions = _props.mapStateActions,
        mapStyleActions = _props.mapStyleActions,
        uiStateActions = _props.uiStateActions;


    var sideFields = {
      datasets: datasets,
      editingDataset: editingDataset,
      filters: filters,
      layers: layers,
      layerOrder: layerOrder,
      interactionConfig: interactionConfig,
      mapStyle: mapStyle,
      layerBlending: layerBlending,
      uiState: uiState,
      mapStyleActions: mapStyleActions,
      visStateActions: visStateActions,
      uiStateActions: uiStateActions
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

    var mapContainers = !isSplit ? [_react2.default.createElement(_mapContainer2.default, (0, _extends3.default)({
      key: 0,
      index: 0
    }, mapFields, {
      mapLayers: isSplit ? splitMaps[0].layers : null,
      popoverOffset: { left: 0, top: 0 }
    }))] : splitMaps.map(function (settings, index) {
      return _react2.default.createElement(_mapContainer2.default, (0, _extends3.default)({
        key: index,
        index: index
      }, mapFields, {
        mapLayers: splitMaps[index].layers,
        popoverOffset: { left: 0, top: 0 }
      }));
    });

    var containerW = mapState.width * (Number(isSplit) + 1);
    return _react2.default.createElement(
      _styledComponents.ThemeProvider,
      { theme: _base.theme },
      _react2.default.createElement(
        GlobalStyle,
        {
          style: { position: 'relative' },
          className: 'kepler-gl',
          id: 'kepler-gl__' + id,
          ref: function ref(node) {
            _this4.root = node;
          }
        },
        !mapState.isFullScreen && _react2.default.createElement(_sidePanel2.default, (0, _extends3.default)({}, sideFields, {
          width: _defaultSettings.DIMENSIONS.sidePanel.width,
          containerW: containerW,
          containerH: mapState.height,
          height: mapState.height,
          rootNode: this.root
        })),
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
        })
      )
    );
  };

  return KeplerGL;
}(_react.Component);

KeplerGL.defaultProps = defaultProps;

function mapStateToProps(state, props) {
  return (0, _extends3.default)({}, props, state.visState, {
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
      visStateActions = _map[0],
      mapStateActions = _map[1],
      mapStyleActions = _map[2],
      buildingDataActions = _map[3],
      uiStateActions = _map[4];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJWaXNTdGF0ZUFjdGlvbnMiLCJNYXBTdGF0ZUFjdGlvbnMiLCJNYXBTdHlsZUFjdGlvbnMiLCJCdWlsZGluZ0RhdGFBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJkZWZhdWx0UHJvcHMiLCJtYXBTdHlsZXMiLCJ3aWR0aCIsImhlaWdodCIsIkdsb2JhbFN0eWxlIiwiZGl2IiwiS2VwbGVyR0wiLCJjb21wb25lbnREaWRNb3VudCIsIl9sb2FkTWFwU3R5bGUiLCJwcm9wcyIsIl9oYW5kbGVSZXNpemUiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwibmV4dFByb3BzIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ3YXJuIiwibWFwU3RhdGVBY3Rpb25zIiwidXBkYXRlTWFwIiwibWFwU3RhdGUiLCJpc1NwbGl0IiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsInN0eWxlIiwiZGlzcGF0Y2giLCJsb2FkTWFwU3R5bGVzIiwiaWQiLCJfcmVxdWVzdE1hcFN0eWxlIiwibWFwU3R5bGUiLCJ1cmwiLCJqc29uIiwiZXJyb3IiLCJyZXN1bHQiLCJyZW5kZXIiLCJidWlsZGluZ0RhdGEiLCJlZGl0aW5nRGF0YXNldCIsImZpbHRlcnMiLCJsYXllcnMiLCJzcGxpdE1hcHMiLCJsYXllck9yZGVyIiwibGF5ZXJCbGVuZGluZyIsImludGVyYWN0aW9uQ29uZmlnIiwiZGF0YXNldHMiLCJsYXllckRhdGEiLCJob3ZlckluZm8iLCJjbGlja2VkIiwidWlTdGF0ZSIsImJ1aWxkaW5nRGF0YUFjdGlvbnMiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJtYXBTdHlsZUFjdGlvbnMiLCJ1aVN0YXRlQWN0aW9ucyIsInNpZGVGaWVsZHMiLCJtYXBGaWVsZHMiLCJsZW5ndGgiLCJtYXBDb250YWluZXJzIiwibGVmdCIsInRvcCIsIm1hcCIsInNldHRpbmdzIiwiaW5kZXgiLCJjb250YWluZXJXIiwicG9zaXRpb24iLCJyb290Iiwibm9kZSIsImlzRnVsbFNjcmVlbiIsInNpZGVQYW5lbCIsImRpc3BsYXkiLCJtYXJnaW4iLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsInZpc1N0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwib3duUHJvcHMiLCJ1c2VyQWN0aW9ucyIsImFjdGlvbnMiLCJtZXJnZUFjdGlvbnMiLCJvdmVycmlkZXMiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUlBOztJQUFZQSxlOztBQUNaOztJQUFZQyxlOztBQUNaOztJQUFZQyxlOztBQUNaOztJQUFZQyxtQjs7QUFDWjs7SUFBWUMsYzs7QUFFWjs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQTs7QUFFQSxJQUFNQyxlQUFlO0FBQ25CQyxhQUFXLEVBRFE7QUFFbkJDLFNBQU8sR0FGWTtBQUduQkMsVUFBUTtBQUhXLENBQXJCOztBQU1BLElBQU1DLGNBQWMsMkJBQU9DLEdBQXJCLGlCQUFOOztJQTRCTUMsUTs7Ozs7Ozs7cUJBQ0pDLGlCLGdDQUFvQjtBQUNsQixTQUFLQyxhQUFMLENBQW1CLEtBQUtDLEtBQUwsQ0FBV1IsU0FBOUI7QUFDQSxTQUFLUyxhQUFMLENBQW1CLEtBQUtELEtBQXhCO0FBQ0QsRzs7cUJBRURFLHlCLHNDQUEwQkMsUyxFQUFXO0FBQ25DLFFBQ0UsS0FBS0gsS0FBTCxDQUFXUCxLQUFYLEtBQXFCVSxVQUFVVixLQUEvQixJQUNBLEtBQUtPLEtBQUwsQ0FBV04sTUFBWCxLQUFzQlMsVUFBVVQsTUFGbEMsRUFHRTtBQUNBLFdBQUtPLGFBQUwsQ0FBbUJFLFNBQW5CO0FBQ0Q7QUFDRixHOztxQkFFREYsYSxnQ0FBK0I7QUFBQSxRQUFoQlIsS0FBZ0IsUUFBaEJBLEtBQWdCO0FBQUEsUUFBVEMsTUFBUyxRQUFUQSxNQUFTOztBQUM3QixRQUFJLENBQUNVLE9BQU9DLFFBQVAsQ0FBZ0JaLEtBQWhCLENBQUQsSUFBMkIsQ0FBQ1csT0FBT0MsUUFBUCxDQUFnQlgsTUFBaEIsQ0FBaEMsRUFBeUQ7QUFDdkQsc0JBQVFZLElBQVIsQ0FBYSw4QkFBYjtBQUNBO0FBQ0Q7QUFDRCxTQUFLTixLQUFMLENBQVdPLGVBQVgsQ0FBMkJDLFNBQTNCLENBQXFDO0FBQ25DZixhQUFPQSxTQUFTLElBQUlXLE9BQU8sS0FBS0osS0FBTCxDQUFXUyxRQUFYLENBQW9CQyxPQUEzQixDQUFiLENBRDRCO0FBRW5DaEI7QUFGbUMsS0FBckM7QUFJRCxHOztxQkFFREssYSw0QkFBZ0I7QUFBQTs7QUFDZCxjQUFJLEtBQUtDLEtBQUwsQ0FBV1IsU0FBZixFQUE2Qm1CLE9BQU9DLE1BQVAscUNBQTdCLEVBQWdFQyxPQUFoRSxDQUNFLGlCQUFTO0FBQ1AsVUFBSUMsTUFBTUEsS0FBVixFQUFpQjtBQUFBOztBQUNmLGVBQUtkLEtBQUwsQ0FBV2UsUUFBWCxDQUNFM0IsZ0JBQWdCNEIsYUFBaEIsb0RBQ0dGLE1BQU1HLEVBRFQsSUFDY0gsS0FEZCx5QkFERjtBQUtELE9BTkQsTUFNTztBQUNMLGVBQUtJLGdCQUFMLENBQXNCSixLQUF0QjtBQUNEO0FBQ0YsS0FYSDtBQWFELEc7O3FCQUVESSxnQiw2QkFBaUJDLFEsRUFBVTtBQUFBOztBQUFBLFFBQ2xCQyxHQURrQixHQUNQRCxRQURPLENBQ2xCQyxHQURrQjtBQUFBLFFBQ2JILEVBRGEsR0FDUEUsUUFETyxDQUNiRixFQURhOztBQUV6Qix3QkFBUUksSUFBUixDQUFhRCxHQUFiLEVBQWtCLFVBQUNFLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUFBOztBQUNuQyxVQUFJRCxLQUFKLEVBQVc7QUFDVCx3QkFBUWhCLElBQVIsOEJBQXdDYSxTQUFTQyxHQUFqRDtBQUNEO0FBQ0QsYUFBS3BCLEtBQUwsQ0FBV2UsUUFBWCxDQUNFM0IsZ0JBQWdCNEIsYUFBaEIsc0RBQ0dDLEVBREgsK0JBQ1lFLFFBRFosSUFDc0JMLE9BQU9TLE1BRDdCLDZCQURGO0FBS0QsS0FURDtBQVVELEc7O3FCQUVEQyxNLHFCQUFTO0FBQUE7O0FBQUEsaUJBMEJILEtBQUt4QixLQTFCRjtBQUFBLFFBR0xpQixFQUhLLFVBR0xBLEVBSEs7QUFBQSxRQUlMUSxZQUpLLFVBSUxBLFlBSks7QUFBQSxRQUtMQyxjQUxLLFVBS0xBLGNBTEs7QUFBQSxRQU1MQyxPQU5LLFVBTUxBLE9BTks7QUFBQSxRQU9MQyxNQVBLLFVBT0xBLE1BUEs7QUFBQSxRQVFMQyxTQVJLLFVBUUxBLFNBUks7QUFBQSxRQVNMQyxVQVRLLFVBU0xBLFVBVEs7QUFBQSxRQVVMQyxhQVZLLFVBVUxBLGFBVks7QUFBQSxRQVdMQyxpQkFYSyxVQVdMQSxpQkFYSztBQUFBLFFBWUxDLFFBWkssVUFZTEEsUUFaSztBQUFBLFFBYUxkLFFBYkssVUFhTEEsUUFiSztBQUFBLFFBY0xWLFFBZEssVUFjTEEsUUFkSztBQUFBLFFBZUx5QixTQWZLLFVBZUxBLFNBZks7QUFBQSxRQWdCTEMsU0FoQkssVUFnQkxBLFNBaEJLO0FBQUEsUUFpQkxDLE9BakJLLFVBaUJMQSxPQWpCSztBQUFBLFFBa0JMQyxPQWxCSyxVQWtCTEEsT0FsQks7QUFBQSxRQXFCTEMsbUJBckJLLFVBcUJMQSxtQkFyQks7QUFBQSxRQXNCTEMsZUF0QkssVUFzQkxBLGVBdEJLO0FBQUEsUUF1QkxoQyxlQXZCSyxVQXVCTEEsZUF2Qks7QUFBQSxRQXdCTGlDLGVBeEJLLFVBd0JMQSxlQXhCSztBQUFBLFFBeUJMQyxjQXpCSyxVQXlCTEEsY0F6Qks7OztBQTRCUCxRQUFNQyxhQUFhO0FBQ2pCVCx3QkFEaUI7QUFFakJQLG9DQUZpQjtBQUdqQkMsc0JBSGlCO0FBSWpCQyxvQkFKaUI7QUFLakJFLDRCQUxpQjtBQU1qQkUsMENBTmlCO0FBT2pCYix3QkFQaUI7QUFRakJZLGtDQVJpQjtBQVNqQk0sc0JBVGlCO0FBVWpCRyxzQ0FWaUI7QUFXakJELHNDQVhpQjtBQVlqQkU7QUFaaUIsS0FBbkI7O0FBZUEsUUFBTUUsWUFBWTtBQUNoQmxCLGdDQURnQjtBQUVoQlEsd0JBRmdCO0FBR2hCeEIsd0JBSGdCO0FBSWhCVSx3QkFKZ0I7QUFLaEJTLG9CQUxnQjtBQU1oQkUsNEJBTmdCO0FBT2hCSSwwQkFQZ0I7QUFRaEJILGtDQVJnQjtBQVNoQkMsMENBVGdCO0FBVWhCRywwQkFWZ0I7QUFXaEJDLHNCQVhnQjtBQVloQkcsc0NBWmdCO0FBYWhCaEMsc0NBYmdCO0FBY2hCK0I7QUFkZ0IsS0FBbEI7O0FBaUJBLFFBQU01QixVQUFVbUIsYUFBYUEsVUFBVWUsTUFBVixHQUFtQixDQUFoRDs7QUFFQSxRQUFNQyxnQkFBZ0IsQ0FBQ25DLE9BQUQsR0FDbEIsQ0FDRTtBQUNFLFdBQUssQ0FEUDtBQUVFLGFBQU87QUFGVCxPQUdNaUMsU0FITjtBQUlFLGlCQUFXakMsVUFBVW1CLFVBQVUsQ0FBVixFQUFhRCxNQUF2QixHQUFnQyxJQUo3QztBQUtFLHFCQUFlLEVBQUNrQixNQUFNLENBQVAsRUFBVUMsS0FBSyxDQUFmO0FBTGpCLE9BREYsQ0FEa0IsR0FVbEJsQixVQUFVbUIsR0FBVixDQUFjLFVBQUNDLFFBQUQsRUFBV0MsS0FBWDtBQUFBLGFBQ1o7QUFDRSxhQUFLQSxLQURQO0FBRUUsZUFBT0E7QUFGVCxTQUdNUCxTQUhOO0FBSUUsbUJBQVdkLFVBQVVxQixLQUFWLEVBQWlCdEIsTUFKOUI7QUFLRSx1QkFBZSxFQUFDa0IsTUFBTSxDQUFQLEVBQVVDLEtBQUssQ0FBZjtBQUxqQixTQURZO0FBQUEsS0FBZCxDQVZKOztBQW9CQSxRQUFNSSxhQUFhMUMsU0FBU2hCLEtBQVQsSUFBa0JXLE9BQU9NLE9BQVAsSUFBa0IsQ0FBcEMsQ0FBbkI7QUFDQSxXQUNFO0FBQUE7QUFBQSxRQUFlLGtCQUFmO0FBQ0U7QUFBQyxtQkFBRDtBQUFBO0FBQ0UsaUJBQU8sRUFBQzBDLFVBQVUsVUFBWCxFQURUO0FBRUUscUJBQVUsV0FGWjtBQUdFLDhCQUFrQm5DLEVBSHBCO0FBSUUsZUFBSyxtQkFBUTtBQUNYLG1CQUFLb0MsSUFBTCxHQUFZQyxJQUFaO0FBQ0Q7QUFOSDtBQVFHLFNBQUM3QyxTQUFTOEMsWUFBVixJQUNDLDhFQUNNYixVQUROO0FBRUUsaUJBQU8sNEJBQVdjLFNBQVgsQ0FBcUIvRCxLQUY5QjtBQUdFLHNCQUFZMEQsVUFIZDtBQUlFLHNCQUFZMUMsU0FBU2YsTUFKdkI7QUFLRSxrQkFBUWUsU0FBU2YsTUFMbkI7QUFNRSxvQkFBVSxLQUFLMkQ7QUFOakIsV0FUSjtBQWtCRTtBQUFBO0FBQUEsWUFBSyxXQUFVLE1BQWYsRUFBc0IsT0FBTyxFQUFDSSxTQUFTLE1BQVYsRUFBN0I7QUFDR1o7QUFESCxTQWxCRjtBQXFCRTtBQUNFLG1CQUFTbEIsT0FEWDtBQUVFLG9CQUFVTSxRQUZaO0FBR0UsbUJBQVNJLE9BSFg7QUFJRSwyQkFBaUJFLGVBSm5CO0FBS0UsMEJBQWdCLDRCQUFXaUIsU0FBWCxDQUFxQi9ELEtBQXJCLEdBQTZCLDRCQUFXK0QsU0FBWCxDQUFxQkUsTUFMcEU7QUFNRSxzQkFBWVA7QUFOZDtBQXJCRjtBQURGLEtBREY7QUFrQ0QsRzs7Ozs7QUFHSHRELFNBQVNOLFlBQVQsR0FBd0JBLFlBQXhCOztBQUVBLFNBQVNvRSxlQUFULENBQXlCQyxLQUF6QixFQUFnQzVELEtBQWhDLEVBQXVDO0FBQ3JDLG9DQUNLQSxLQURMLEVBRUs0RCxNQUFNQyxRQUZYO0FBR0VwQyxrQkFBY21DLE1BQU1uQyxZQUFOLENBQW1CQSxZQUhuQztBQUlFTixjQUFVeUMsTUFBTXpDLFFBSmxCO0FBS0VWLGNBQVVtRCxNQUFNbkQsUUFMbEI7QUFNRTRCLGFBQVN1QixNQUFNdkI7QUFOakI7QUFRRDs7QUFFRCxTQUFTeUIsa0JBQVQsQ0FBNEIvQyxRQUE1QixFQUFzQ2dELFFBQXRDLEVBQWdEO0FBQzlDLE1BQU1DLGNBQWNELFNBQVNFLE9BQVQsSUFBb0IsRUFBeEM7O0FBRDhDLGFBUzFDLENBQ0YvRSxlQURFLEVBRUZDLGVBRkUsRUFHRkMsZUFIRSxFQUlGQyxtQkFKRSxFQUtGQyxjQUxFLEVBTUYwRCxHQU5FLENBTUU7QUFBQSxXQUNKLCtCQUFtQmtCLGFBQWFELE9BQWIsRUFBc0JELFdBQXRCLENBQW5CLEVBQXVEakQsUUFBdkQsQ0FESTtBQUFBLEdBTkYsQ0FUMEM7QUFBQSxNQUk1Q3dCLGVBSjRDO0FBQUEsTUFLNUNoQyxlQUw0QztBQUFBLE1BTTVDaUMsZUFONEM7QUFBQSxNQU81Q0YsbUJBUDRDO0FBQUEsTUFRNUNHLGNBUjRDOztBQW1COUMsU0FBTztBQUNMRixvQ0FESztBQUVMaEMsb0NBRks7QUFHTGlDLG9DQUhLO0FBSUxGLDRDQUpLO0FBS0xHLGtDQUxLO0FBTUwxQjtBQU5LLEdBQVA7QUFRRDs7QUFFRDs7O0FBR0EsU0FBU21ELFlBQVQsQ0FBc0JELE9BQXRCLEVBQStCRCxXQUEvQixFQUE0QztBQUMxQyxNQUFNRyxZQUFZLEVBQWxCO0FBQ0EsT0FBSyxJQUFNQyxHQUFYLElBQWtCSixXQUFsQixFQUErQjtBQUM3QixRQUFJQSxZQUFZSyxjQUFaLENBQTJCRCxHQUEzQixLQUFtQ0gsUUFBUUksY0FBUixDQUF1QkQsR0FBdkIsQ0FBdkMsRUFBb0U7QUFDbEVELGdCQUFVQyxHQUFWLElBQWlCSixZQUFZSSxHQUFaLENBQWpCO0FBQ0Q7QUFDRjs7QUFFRCxvQ0FBV0gsT0FBWCxFQUF1QkUsU0FBdkI7QUFDRDs7a0JBRWMsOEJBQWdCUixlQUFoQixFQUFpQ0csa0JBQWpDLEVBQXFEakUsUUFBckQsQyIsImZpbGUiOiJrZXBsZXItZ2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdkMy1yZXF1ZXN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjb25uZWN0IGFzIGtlcGxlckdsQ29ubmVjdH0gZnJvbSAnLi4vY29ubmVjdC9rZXBsZXJnbC1jb25uZWN0JztcblxuaW1wb3J0IHtUaGVtZVByb3ZpZGVyfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCAqIGFzIFZpc1N0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL3Zpcy1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0eWxlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdHlsZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIEJ1aWxkaW5nRGF0YUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9idWlsZGluZy1kYXRhLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgVUlTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy91aS1zdGF0ZS1hY3Rpb25zJztcblxuaW1wb3J0IHtESU1FTlNJT05TLCBERUZBVUxUX01BUF9TVFlMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IFNpZGVQYW5lbCBmcm9tICcuL3NpZGUtcGFuZWwnO1xuaW1wb3J0IE1hcENvbnRhaW5lciBmcm9tICcuL21hcC1jb250YWluZXInO1xuaW1wb3J0IEJvdHRvbVdpZGdldCBmcm9tICcuL2JvdHRvbS13aWRnZXQnO1xuaW1wb3J0IHt0aGVtZX0gZnJvbSAnLi4vc3R5bGVzL2Jhc2UnO1xuXG4vLyB3ZWJwYWNrIGNzcy1sb2FkZXIgaGFuZGxlcyBjc3MgbG9hZGluZ1xuLy8gaW1wb3J0ICcuLi9zdHlsZXNoZWV0cy9rZXBsZXIuZ2wuc2Nzcyc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbWFwU3R5bGVzOiBbXSxcbiAgd2lkdGg6IDgwMCxcbiAgaGVpZ2h0OiA4MDBcbn07XG5cbmNvbnN0IEdsb2JhbFN0eWxlID0gc3R5bGVkLmRpdmBcbiAgZm9udC1mYW1pbHk6IGZmLWNsYW4td2ViLXBybywgJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICBmb250LXdlaWdodDogNDAwO1xuICBmb250LXNpemU6IC44NzVlbTtcbiAgbGluZS1oZWlnaHQ6IDEuNzE0Mjk7XG4gIFxuICAqLFxuICAqOmJlZm9yZSxcbiAgKjphZnRlciB7XG4gICAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB9XG4gIFxuICB1bCB7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gIH1cbiAgXG4gIGxpIHtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgXG4gIGEge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgfVxuYDtcblxuY2xhc3MgS2VwbGVyR0wgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9sb2FkTWFwU3R5bGUodGhpcy5wcm9wcy5tYXBTdHlsZXMpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy53aWR0aCAhPT0gbmV4dFByb3BzLndpZHRoIHx8XG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAhPT0gbmV4dFByb3BzLmhlaWdodFxuICAgICkge1xuICAgICAgdGhpcy5faGFuZGxlUmVzaXplKG5leHRQcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZVJlc2l6ZSh7d2lkdGgsIGhlaWdodH0pIHtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh3aWR0aCkgfHwgIU51bWJlci5pc0Zpbml0ZShoZWlnaHQpKSB7XG4gICAgICBDb25zb2xlLndhcm4oJ3dpZHRoIGFuZCBoZWlnaHQgaXMgcmVxdWlyZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5tYXBTdGF0ZUFjdGlvbnMudXBkYXRlTWFwKHtcbiAgICAgIHdpZHRoOiB3aWR0aCAvICgxICsgTnVtYmVyKHRoaXMucHJvcHMubWFwU3RhdGUuaXNTcGxpdCkpLFxuICAgICAgaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICBfbG9hZE1hcFN0eWxlKCkge1xuICAgIFsuLi50aGlzLnByb3BzLm1hcFN0eWxlcywgLi4uT2JqZWN0LnZhbHVlcyhERUZBVUxUX01BUF9TVFlMRVMpXS5mb3JFYWNoKFxuICAgICAgc3R5bGUgPT4ge1xuICAgICAgICBpZiAoc3R5bGUuc3R5bGUpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLmRpc3BhdGNoKFxuICAgICAgICAgICAgTWFwU3R5bGVBY3Rpb25zLmxvYWRNYXBTdHlsZXMoe1xuICAgICAgICAgICAgICBbc3R5bGUuaWRdOiBzdHlsZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcXVlc3RNYXBTdHlsZShzdHlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgX3JlcXVlc3RNYXBTdHlsZShtYXBTdHlsZSkge1xuICAgIGNvbnN0IHt1cmwsIGlkfSA9IG1hcFN0eWxlO1xuICAgIHJlcXVlc3QuanNvbih1cmwsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgQ29uc29sZS53YXJuKGBFcnJvciBsb2FkaW5nIG1hcCBzdHlsZSAke21hcFN0eWxlLnVybH1gKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goXG4gICAgICAgIE1hcFN0eWxlQWN0aW9ucy5sb2FkTWFwU3R5bGVzKHtcbiAgICAgICAgICBbaWRdOiB7Li4ubWFwU3R5bGUsIHN0eWxlOiByZXN1bHR9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIC8vIHByb3BzXG4gICAgICBpZCxcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIGVkaXRpbmdEYXRhc2V0LFxuICAgICAgZmlsdGVycyxcbiAgICAgIGxheWVycyxcbiAgICAgIHNwbGl0TWFwcywgLy8gdGhpcyB3aWxsIHN0b3JlIHN1cHBvcnQgZm9yIHNwbGl0IG1hcCB2aWV3IGlzIG5lY2Vzc2FyeVxuICAgICAgbGF5ZXJPcmRlcixcbiAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgbWFwU3R5bGUsXG4gICAgICBtYXBTdGF0ZSxcbiAgICAgIGxheWVyRGF0YSxcbiAgICAgIGhvdmVySW5mbyxcbiAgICAgIGNsaWNrZWQsXG4gICAgICB1aVN0YXRlLFxuXG4gICAgICAvLyBhY3Rpb25zLFxuICAgICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICAgIHVpU3RhdGVBY3Rpb25zXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBzaWRlRmllbGRzID0ge1xuICAgICAgZGF0YXNldHMsXG4gICAgICBlZGl0aW5nRGF0YXNldCxcbiAgICAgIGZpbHRlcnMsXG4gICAgICBsYXllcnMsXG4gICAgICBsYXllck9yZGVyLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICB1aVN0YXRlLFxuICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgdWlTdGF0ZUFjdGlvbnNcbiAgICB9O1xuXG4gICAgY29uc3QgbWFwRmllbGRzID0ge1xuICAgICAgYnVpbGRpbmdEYXRhLFxuICAgICAgZGF0YXNldHMsXG4gICAgICBtYXBTdGF0ZSxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJPcmRlcixcbiAgICAgIGxheWVyRGF0YSxcbiAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIGhvdmVySW5mbyxcbiAgICAgIGNsaWNrZWQsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdGF0ZUFjdGlvbnMsXG4gICAgICBidWlsZGluZ0RhdGFBY3Rpb25zXG4gICAgfTtcblxuICAgIGNvbnN0IGlzU3BsaXQgPSBzcGxpdE1hcHMgJiYgc3BsaXRNYXBzLmxlbmd0aCA+IDE7XG5cbiAgICBjb25zdCBtYXBDb250YWluZXJzID0gIWlzU3BsaXRcbiAgICAgID8gW1xuICAgICAgICAgIDxNYXBDb250YWluZXJcbiAgICAgICAgICAgIGtleT17MH1cbiAgICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgICAgey4uLm1hcEZpZWxkc31cbiAgICAgICAgICAgIG1hcExheWVycz17aXNTcGxpdCA/IHNwbGl0TWFwc1swXS5sYXllcnMgOiBudWxsfVxuICAgICAgICAgICAgcG9wb3Zlck9mZnNldD17e2xlZnQ6IDAsIHRvcDogMH19XG4gICAgICAgICAgLz5cbiAgICAgICAgXVxuICAgICAgOiBzcGxpdE1hcHMubWFwKChzZXR0aW5ncywgaW5kZXgpID0+IChcbiAgICAgICAgICA8TWFwQ29udGFpbmVyXG4gICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgey4uLm1hcEZpZWxkc31cbiAgICAgICAgICAgIG1hcExheWVycz17c3BsaXRNYXBzW2luZGV4XS5sYXllcnN9XG4gICAgICAgICAgICBwb3BvdmVyT2Zmc2V0PXt7bGVmdDogMCwgdG9wOiAwfX1cbiAgICAgICAgICAvPlxuICAgICAgICApKTtcblxuICAgIGNvbnN0IGNvbnRhaW5lclcgPSBtYXBTdGF0ZS53aWR0aCAqIChOdW1iZXIoaXNTcGxpdCkgKyAxKTtcbiAgICByZXR1cm4gKFxuICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoZW1lfT5cbiAgICAgICAgPEdsb2JhbFN0eWxlXG4gICAgICAgICAgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319XG4gICAgICAgICAgY2xhc3NOYW1lPVwia2VwbGVyLWdsXCJcbiAgICAgICAgICBpZD17YGtlcGxlci1nbF9fJHtpZH1gfVxuICAgICAgICAgIHJlZj17bm9kZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBub2RlO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7IW1hcFN0YXRlLmlzRnVsbFNjcmVlbiAmJiAoXG4gICAgICAgICAgICA8U2lkZVBhbmVsXG4gICAgICAgICAgICAgIHsuLi5zaWRlRmllbGRzfVxuICAgICAgICAgICAgICB3aWR0aD17RElNRU5TSU9OUy5zaWRlUGFuZWwud2lkdGh9XG4gICAgICAgICAgICAgIGNvbnRhaW5lclc9e2NvbnRhaW5lcld9XG4gICAgICAgICAgICAgIGNvbnRhaW5lckg9e21hcFN0YXRlLmhlaWdodH1cbiAgICAgICAgICAgICAgaGVpZ2h0PXttYXBTdGF0ZS5oZWlnaHR9XG4gICAgICAgICAgICAgIHJvb3ROb2RlPXt0aGlzLnJvb3R9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXBzXCIgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCd9fT5cbiAgICAgICAgICAgIHttYXBDb250YWluZXJzfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxCb3R0b21XaWRnZXRcbiAgICAgICAgICAgIGZpbHRlcnM9e2ZpbHRlcnN9XG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICB1aVN0YXRlPXt1aVN0YXRlfVxuICAgICAgICAgICAgdmlzU3RhdGVBY3Rpb25zPXt2aXNTdGF0ZUFjdGlvbnN9XG4gICAgICAgICAgICBzaWRlUGFuZWxXaWR0aD17RElNRU5TSU9OUy5zaWRlUGFuZWwud2lkdGggLSBESU1FTlNJT05TLnNpZGVQYW5lbC5tYXJnaW59XG4gICAgICAgICAgICBjb250YWluZXJXPXtjb250YWluZXJXfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvR2xvYmFsU3R5bGU+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5LZXBsZXJHTC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSwgcHJvcHMpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wcm9wcyxcbiAgICAuLi5zdGF0ZS52aXNTdGF0ZSxcbiAgICBidWlsZGluZ0RhdGE6IHN0YXRlLmJ1aWxkaW5nRGF0YS5idWlsZGluZ0RhdGEsXG4gICAgbWFwU3R5bGU6IHN0YXRlLm1hcFN0eWxlLFxuICAgIG1hcFN0YXRlOiBzdGF0ZS5tYXBTdGF0ZSxcbiAgICB1aVN0YXRlOiBzdGF0ZS51aVN0YXRlXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCwgb3duUHJvcHMpIHtcbiAgY29uc3QgdXNlckFjdGlvbnMgPSBvd25Qcm9wcy5hY3Rpb25zIHx8IHt9O1xuXG4gIGNvbnN0IFtcbiAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICBidWlsZGluZ0RhdGFBY3Rpb25zLFxuICAgIHVpU3RhdGVBY3Rpb25zXG4gIF0gPSBbXG4gICAgVmlzU3RhdGVBY3Rpb25zLFxuICAgIE1hcFN0YXRlQWN0aW9ucyxcbiAgICBNYXBTdHlsZUFjdGlvbnMsXG4gICAgQnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICBVSVN0YXRlQWN0aW9uc1xuICBdLm1hcChhY3Rpb25zID0+XG4gICAgYmluZEFjdGlvbkNyZWF0b3JzKG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucyksIGRpc3BhdGNoKVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICBkaXNwYXRjaFxuICB9O1xufVxuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgbWFwcy1nbCBhY3Rpb25zIHdpdGggdXNlciBkZWZpbmVkIGFjdGlvbnMgdXNpbmcgdGhlIHNhbWUga2V5XG4gKi9cbmZ1bmN0aW9uIG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucykge1xuICBjb25zdCBvdmVycmlkZXMgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gdXNlckFjdGlvbnMpIHtcbiAgICBpZiAodXNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBhY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG92ZXJyaWRlc1trZXldID0gdXNlckFjdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gey4uLmFjdGlvbnMsIC4uLm92ZXJyaWRlc307XG59XG5cbmV4cG9ydCBkZWZhdWx0IGtlcGxlckdsQ29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoS2VwbGVyR0wpO1xuIl19