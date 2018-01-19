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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _window = require('global/window');

var _redux = require('redux');

var _d3Request = require('d3-request');

var _d3Request2 = _interopRequireDefault(_d3Request);

var _keplerglConnect = require('../connect/keplergl-connect');

var _styledComponents = require('styled-components');

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
        'div',
        {
          style: { position: 'relative' },
          className: 'kepler-gl',
          id: 'kepler-gl__' + id,
          ref: function ref(node) {
            _this4.root = node;
          }
        },
        !mapState.isFullScreen && _react2.default.createElement(_sidePanel2.default, (0, _extends3.default)({}, sideFields, {
          width: _defaultSettings.DIMENSIONS.sideBarWidth,
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
          sidePanelWidth: _defaultSettings.DIMENSIONS.sideBarWidth,
          sideNavWidth: _defaultSettings.DIMENSIONS.sideNavC,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJWaXNTdGF0ZUFjdGlvbnMiLCJNYXBTdGF0ZUFjdGlvbnMiLCJNYXBTdHlsZUFjdGlvbnMiLCJCdWlsZGluZ0RhdGFBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJkZWZhdWx0UHJvcHMiLCJtYXBTdHlsZXMiLCJ3aWR0aCIsImhlaWdodCIsIktlcGxlckdMIiwiY29tcG9uZW50RGlkTW91bnQiLCJfbG9hZE1hcFN0eWxlIiwicHJvcHMiLCJfaGFuZGxlUmVzaXplIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsIk51bWJlciIsImlzRmluaXRlIiwid2FybiIsIm1hcFN0YXRlQWN0aW9ucyIsInVwZGF0ZU1hcCIsIm1hcFN0YXRlIiwiaXNTcGxpdCIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJzdHlsZSIsImRpc3BhdGNoIiwibG9hZE1hcFN0eWxlcyIsImlkIiwiX3JlcXVlc3RNYXBTdHlsZSIsIm1hcFN0eWxlIiwidXJsIiwianNvbiIsImVycm9yIiwicmVzdWx0IiwicmVuZGVyIiwiYnVpbGRpbmdEYXRhIiwiZWRpdGluZ0RhdGFzZXQiLCJmaWx0ZXJzIiwibGF5ZXJzIiwic3BsaXRNYXBzIiwibGF5ZXJPcmRlciIsImxheWVyQmxlbmRpbmciLCJpbnRlcmFjdGlvbkNvbmZpZyIsImRhdGFzZXRzIiwibGF5ZXJEYXRhIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsInVpU3RhdGUiLCJidWlsZGluZ0RhdGFBY3Rpb25zIiwidmlzU3RhdGVBY3Rpb25zIiwibWFwU3R5bGVBY3Rpb25zIiwidWlTdGF0ZUFjdGlvbnMiLCJzaWRlRmllbGRzIiwibWFwRmllbGRzIiwibGVuZ3RoIiwibWFwQ29udGFpbmVycyIsImxlZnQiLCJ0b3AiLCJtYXAiLCJzZXR0aW5ncyIsImluZGV4IiwiY29udGFpbmVyVyIsInBvc2l0aW9uIiwicm9vdCIsIm5vZGUiLCJpc0Z1bGxTY3JlZW4iLCJzaWRlQmFyV2lkdGgiLCJkaXNwbGF5Iiwic2lkZU5hdkMiLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsInZpc1N0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwib3duUHJvcHMiLCJ1c2VyQWN0aW9ucyIsImFjdGlvbnMiLCJtZXJnZUFjdGlvbnMiLCJvdmVycmlkZXMiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7QUFFQTs7SUFBWUEsZTs7QUFDWjs7SUFBWUMsZTs7QUFDWjs7SUFBWUMsZTs7QUFDWjs7SUFBWUMsbUI7O0FBQ1o7O0lBQVlDLGM7O0FBRVo7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0E7O0FBRUEsSUFBTUMsZUFBZTtBQUNuQkMsYUFBVyxFQURRO0FBRW5CQyxTQUFPLEdBRlk7QUFHbkJDLFVBQVE7QUFIVyxDQUFyQjs7SUFNTUMsUTs7Ozs7Ozs7cUJBQ0pDLGlCLGdDQUFvQjtBQUNsQixTQUFLQyxhQUFMLENBQW1CLEtBQUtDLEtBQUwsQ0FBV04sU0FBOUI7QUFDQSxTQUFLTyxhQUFMLENBQW1CLEtBQUtELEtBQXhCO0FBQ0QsRzs7cUJBRURFLHlCLHNDQUEwQkMsUyxFQUFXO0FBQ25DLFFBQ0UsS0FBS0gsS0FBTCxDQUFXTCxLQUFYLEtBQXFCUSxVQUFVUixLQUEvQixJQUNBLEtBQUtLLEtBQUwsQ0FBV0osTUFBWCxLQUFzQk8sVUFBVVAsTUFGbEMsRUFHRTtBQUNBLFdBQUtLLGFBQUwsQ0FBbUJFLFNBQW5CO0FBQ0Q7QUFDRixHOztxQkFFREYsYSxnQ0FBK0I7QUFBQSxRQUFoQk4sS0FBZ0IsUUFBaEJBLEtBQWdCO0FBQUEsUUFBVEMsTUFBUyxRQUFUQSxNQUFTOztBQUM3QixRQUFJLENBQUNRLE9BQU9DLFFBQVAsQ0FBZ0JWLEtBQWhCLENBQUQsSUFBMkIsQ0FBQ1MsT0FBT0Ms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QyxlQU40QztBQUFBLE1BTzVDRixtQkFQNEM7QUFBQSxNQVE1Q0csY0FSNEM7O0FBbUI5QyxTQUFPO0FBQ0xGLG9DQURLO0FBRUxoQyxvQ0FGSztBQUdMaUMsb0NBSEs7QUFJTEYsNENBSks7QUFLTEcsa0NBTEs7QUFNTDFCO0FBTkssR0FBUDtBQVFEOztBQUVEOzs7QUFHQSxTQUFTbUQsWUFBVCxDQUFzQkQsT0FBdEIsRUFBK0JELFdBQS9CLEVBQTRDO0FBQzFDLE1BQU1HLFlBQVksRUFBbEI7QUFDQSxPQUFLLElBQU1DLEdBQVgsSUFBa0JKLFdBQWxCLEVBQStCO0FBQzdCLFFBQUlBLFlBQVlLLGNBQVosQ0FBMkJELEdBQTNCLEtBQW1DSCxRQUFRSSxjQUFSLENBQXVCRCxHQUF2QixDQUF2QyxFQUFvRTtBQUNsRUQsZ0JBQVVDLEdBQVYsSUFBaUJKLFlBQVlJLEdBQVosQ0FBakI7QUFDRDtBQUNGOztBQUVELG9DQUFXSCxPQUFYLEVBQXVCRSxTQUF2QjtBQUNEOztrQkFFYyw4QkFBZ0JSLGVBQWhCLEVBQWlDRyxrQkFBakMsRUFBcURqRSxRQUFyRCxDIiwiZmlsZSI6ImtlcGxlci1nbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ2QzLXJlcXVlc3QnO1xuaW1wb3J0IHtjb25uZWN0IGFzIGtlcGxlckdsQ29ubmVjdH0gZnJvbSAnLi4vY29ubmVjdC9rZXBsZXJnbC1jb25uZWN0JztcblxuaW1wb3J0IHtUaGVtZVByb3ZpZGVyfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCAqIGFzIFZpc1N0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL3Zpcy1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0eWxlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdHlsZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIEJ1aWxkaW5nRGF0YUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9idWlsZGluZy1kYXRhLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgVUlTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy91aS1zdGF0ZS1hY3Rpb25zJztcblxuaW1wb3J0IHtESU1FTlNJT05TLCBERUZBVUxUX01BUF9TVFlMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IFNpZGVQYW5lbCBmcm9tICcuL3NpZGUtcGFuZWwnO1xuaW1wb3J0IE1hcENvbnRhaW5lciBmcm9tICcuL21hcC1jb250YWluZXInO1xuaW1wb3J0IEJvdHRvbVdpZGdldCBmcm9tICcuL2JvdHRvbS13aWRnZXQnO1xuaW1wb3J0IHt0aGVtZX0gZnJvbSAnLi4vc3R5bGVzL2Jhc2UnO1xuXG4vLyB3ZWJwYWNrIGNzcy1sb2FkZXIgaGFuZGxlcyBjc3MgbG9hZGluZ1xuLy8gaW1wb3J0ICcuLi9zdHlsZXNoZWV0cy9rZXBsZXIuZ2wuc2Nzcyc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbWFwU3R5bGVzOiBbXSxcbiAgd2lkdGg6IDgwMCxcbiAgaGVpZ2h0OiA4MDBcbn07XG5cbmNsYXNzIEtlcGxlckdMIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fbG9hZE1hcFN0eWxlKHRoaXMucHJvcHMubWFwU3R5bGVzKTtcbiAgICB0aGlzLl9oYW5kbGVSZXNpemUodGhpcy5wcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMud2lkdGggIT09IG5leHRQcm9wcy53aWR0aCB8fFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgIT09IG5leHRQcm9wcy5oZWlnaHRcbiAgICApIHtcbiAgICAgIHRoaXMuX2hhbmRsZVJlc2l6ZShuZXh0UHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVSZXNpemUoe3dpZHRoLCBoZWlnaHR9KSB7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUod2lkdGgpIHx8ICFOdW1iZXIuaXNGaW5pdGUoaGVpZ2h0KSkge1xuICAgICAgQ29uc29sZS53YXJuKCd3aWR0aCBhbmQgaGVpZ2h0IGlzIHJlcXVpcmVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMubWFwU3RhdGVBY3Rpb25zLnVwZGF0ZU1hcCh7XG4gICAgICB3aWR0aDogd2lkdGggLyAoMSArIE51bWJlcih0aGlzLnByb3BzLm1hcFN0YXRlLmlzU3BsaXQpKSxcbiAgICAgIGhlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgX2xvYWRNYXBTdHlsZSgpIHtcbiAgICBbLi4udGhpcy5wcm9wcy5tYXBTdHlsZXMsIC4uLk9iamVjdC52YWx1ZXMoREVGQVVMVF9NQVBfU1RZTEVTKV0uZm9yRWFjaChcbiAgICAgIHN0eWxlID0+IHtcbiAgICAgICAgaWYgKHN0eWxlLnN0eWxlKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaChcbiAgICAgICAgICAgIE1hcFN0eWxlQWN0aW9ucy5sb2FkTWFwU3R5bGVzKHtcbiAgICAgICAgICAgICAgW3N0eWxlLmlkXTogc3R5bGVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9yZXF1ZXN0TWFwU3R5bGUoc3R5bGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIF9yZXF1ZXN0TWFwU3R5bGUobWFwU3R5bGUpIHtcbiAgICBjb25zdCB7dXJsLCBpZH0gPSBtYXBTdHlsZTtcbiAgICByZXF1ZXN0Lmpzb24odXJsLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIENvbnNvbGUud2FybihgRXJyb3IgbG9hZGluZyBtYXAgc3R5bGUgJHttYXBTdHlsZS51cmx9YCk7XG4gICAgICB9XG4gICAgICB0aGlzLnByb3BzLmRpc3BhdGNoKFxuICAgICAgICBNYXBTdHlsZUFjdGlvbnMubG9hZE1hcFN0eWxlcyh7XG4gICAgICAgICAgW2lkXTogey4uLm1hcFN0eWxlLCBzdHlsZTogcmVzdWx0fVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgaWQsXG4gICAgICBidWlsZGluZ0RhdGEsXG4gICAgICBlZGl0aW5nRGF0YXNldCxcbiAgICAgIGZpbHRlcnMsXG4gICAgICBsYXllcnMsXG4gICAgICBzcGxpdE1hcHMsIC8vIHRoaXMgd2lsbCBzdG9yZSBzdXBwb3J0IGZvciBzcGxpdCBtYXAgdmlldyBpcyBuZWNlc3NhcnlcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgdWlTdGF0ZSxcblxuICAgICAgLy8gYWN0aW9ucyxcbiAgICAgIGJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgICB1aVN0YXRlQWN0aW9uc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3Qgc2lkZUZpZWxkcyA9IHtcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgZWRpdGluZ0RhdGFzZXQsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJPcmRlcixcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgbWFwU3R5bGUsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgdWlTdGF0ZSxcbiAgICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIHVpU3RhdGVBY3Rpb25zXG4gICAgfTtcblxuICAgIGNvbnN0IG1hcEZpZWxkcyA9IHtcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIGxheWVycyxcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgYnVpbGRpbmdEYXRhQWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCBpc1NwbGl0ID0gc3BsaXRNYXBzICYmIHNwbGl0TWFwcy5sZW5ndGggPiAxO1xuXG4gICAgY29uc3QgbWFwQ29udGFpbmVycyA9ICFpc1NwbGl0XG4gICAgICA/IFtcbiAgICAgICAgICA8TWFwQ29udGFpbmVyXG4gICAgICAgICAgICBrZXk9ezB9XG4gICAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgICAgICBtYXBMYXllcnM9e2lzU3BsaXQgPyBzcGxpdE1hcHNbMF0ubGF5ZXJzIDogbnVsbH1cbiAgICAgICAgICAgIHBvcG92ZXJPZmZzZXQ9e3tsZWZ0OiAwLCB0b3A6IDB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIF1cbiAgICAgIDogc3BsaXRNYXBzLm1hcCgoc2V0dGluZ3MsIGluZGV4KSA9PiAoXG4gICAgICAgICAgPE1hcENvbnRhaW5lclxuICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgICAgICBtYXBMYXllcnM9e3NwbGl0TWFwc1tpbmRleF0ubGF5ZXJzfVxuICAgICAgICAgICAgcG9wb3Zlck9mZnNldD17e2xlZnQ6IDAsIHRvcDogMH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKSk7XG5cbiAgICBjb25zdCBjb250YWluZXJXID0gbWFwU3RhdGUud2lkdGggKiAoTnVtYmVyKGlzU3BsaXQpICsgMSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGVtZX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJrZXBsZXItZ2xcIlxuICAgICAgICAgIGlkPXtga2VwbGVyLWdsX18ke2lkfWB9XG4gICAgICAgICAgcmVmPXtub2RlID0+IHtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHshbWFwU3RhdGUuaXNGdWxsU2NyZWVuICYmIChcbiAgICAgICAgICAgIDxTaWRlUGFuZWxcbiAgICAgICAgICAgICAgey4uLnNpZGVGaWVsZHN9XG4gICAgICAgICAgICAgIHdpZHRoPXtESU1FTlNJT05TLnNpZGVCYXJXaWR0aH1cbiAgICAgICAgICAgICAgY29udGFpbmVyVz17Y29udGFpbmVyV31cbiAgICAgICAgICAgICAgY29udGFpbmVySD17bWFwU3RhdGUuaGVpZ2h0fVxuICAgICAgICAgICAgICBoZWlnaHQ9e21hcFN0YXRlLmhlaWdodH1cbiAgICAgICAgICAgICAgcm9vdE5vZGU9e3RoaXMucm9vdH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcHNcIiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4J319PlxuICAgICAgICAgICAge21hcENvbnRhaW5lcnN9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEJvdHRvbVdpZGdldFxuICAgICAgICAgICAgZmlsdGVycz17ZmlsdGVyc31cbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIHVpU3RhdGU9e3VpU3RhdGV9XG4gICAgICAgICAgICB2aXNTdGF0ZUFjdGlvbnM9e3Zpc1N0YXRlQWN0aW9uc31cbiAgICAgICAgICAgIHNpZGVQYW5lbFdpZHRoPXtESU1FTlNJT05TLnNpZGVCYXJXaWR0aH1cbiAgICAgICAgICAgIHNpZGVOYXZXaWR0aD17RElNRU5TSU9OUy5zaWRlTmF2Q31cbiAgICAgICAgICAgIGNvbnRhaW5lclc9e2NvbnRhaW5lcld9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5LZXBsZXJHTC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSwgcHJvcHMpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wcm9wcyxcbiAgICAuLi5zdGF0ZS52aXNTdGF0ZSxcbiAgICBidWlsZGluZ0RhdGE6IHN0YXRlLmJ1aWxkaW5nRGF0YS5idWlsZGluZ0RhdGEsXG4gICAgbWFwU3R5bGU6IHN0YXRlLm1hcFN0eWxlLFxuICAgIG1hcFN0YXRlOiBzdGF0ZS5tYXBTdGF0ZSxcbiAgICB1aVN0YXRlOiBzdGF0ZS51aVN0YXRlXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCwgb3duUHJvcHMpIHtcbiAgY29uc3QgdXNlckFjdGlvbnMgPSBvd25Qcm9wcy5hY3Rpb25zIHx8IHt9O1xuXG4gIGNvbnN0IFtcbiAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICBidWlsZGluZ0RhdGFBY3Rpb25zLFxuICAgIHVpU3RhdGVBY3Rpb25zXG4gIF0gPSBbXG4gICAgVmlzU3RhdGVBY3Rpb25zLFxuICAgIE1hcFN0YXRlQWN0aW9ucyxcbiAgICBNYXBTdHlsZUFjdGlvbnMsXG4gICAgQnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICBVSVN0YXRlQWN0aW9uc1xuICBdLm1hcChhY3Rpb25zID0+XG4gICAgYmluZEFjdGlvbkNyZWF0b3JzKG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucyksIGRpc3BhdGNoKVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICBkaXNwYXRjaFxuICB9O1xufVxuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgbWFwcy1nbCBhY3Rpb25zIHdpdGggdXNlciBkZWZpbmVkIGFjdGlvbnMgdXNpbmcgdGhlIHNhbWUga2V5XG4gKi9cbmZ1bmN0aW9uIG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucykge1xuICBjb25zdCBvdmVycmlkZXMgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gdXNlckFjdGlvbnMpIHtcbiAgICBpZiAodXNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBhY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG92ZXJyaWRlc1trZXldID0gdXNlckFjdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gey4uLmFjdGlvbnMsIC4uLm92ZXJyaWRlc307XG59XG5cbmV4cG9ydCBkZWZhdWx0IGtlcGxlckdsQ29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoS2VwbGVyR0wpO1xuIl19