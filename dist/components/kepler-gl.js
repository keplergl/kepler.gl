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
        { style: { position: 'relative' }, className: 'kepler-gl', id: 'kepler-gl__' + id,
          ref: function ref(node) {
            _this4.root = node;
          } },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJWaXNTdGF0ZUFjdGlvbnMiLCJNYXBTdGF0ZUFjdGlvbnMiLCJNYXBTdHlsZUFjdGlvbnMiLCJCdWlsZGluZ0RhdGFBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJkZWZhdWx0UHJvcHMiLCJtYXBTdHlsZXMiLCJ3aWR0aCIsImhlaWdodCIsIktlcGxlckdMIiwiY29tcG9uZW50RGlkTW91bnQiLCJfbG9hZE1hcFN0eWxlIiwicHJvcHMiLCJfaGFuZGxlUmVzaXplIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsIk51bWJlciIsImlzRmluaXRlIiwid2FybiIsIm1hcFN0YXRlQWN0aW9ucyIsInVwZGF0ZU1hcCIsIm1hcFN0YXRlIiwiaXNTcGxpdCIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJzdHlsZSIsImRpc3BhdGNoIiwibG9hZE1hcFN0eWxlcyIsImlkIiwiX3JlcXVlc3RNYXBTdHlsZSIsIm1hcFN0eWxlIiwidXJsIiwianNvbiIsImVycm9yIiwicmVzdWx0IiwicmVuZGVyIiwiYnVpbGRpbmdEYXRhIiwiZWRpdGluZ0RhdGFzZXQiLCJmaWx0ZXJzIiwibGF5ZXJzIiwic3BsaXRNYXBzIiwibGF5ZXJPcmRlciIsImxheWVyQmxlbmRpbmciLCJpbnRlcmFjdGlvbkNvbmZpZyIsImRhdGFzZXRzIiwibGF5ZXJEYXRhIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsInVpU3RhdGUiLCJidWlsZGluZ0RhdGFBY3Rpb25zIiwidmlzU3RhdGVBY3Rpb25zIiwibWFwU3R5bGVBY3Rpb25zIiwidWlTdGF0ZUFjdGlvbnMiLCJzaWRlRmllbGRzIiwibWFwRmllbGRzIiwibGVuZ3RoIiwibWFwQ29udGFpbmVycyIsImxlZnQiLCJ0b3AiLCJtYXAiLCJzZXR0aW5ncyIsImluZGV4IiwiY29udGFpbmVyVyIsInBvc2l0aW9uIiwicm9vdCIsIm5vZGUiLCJpc0Z1bGxTY3JlZW4iLCJzaWRlQmFyV2lkdGgiLCJkaXNwbGF5Iiwic2lkZU5hdkMiLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsInZpc1N0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwib3duUHJvcHMiLCJ1c2VyQWN0aW9ucyIsImFjdGlvbnMiLCJtZXJnZUFjdGlvbnMiLCJvdmVycmlkZXMiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7QUFFQTs7SUFBWUEsZTs7QUFDWjs7SUFBWUMsZTs7QUFDWjs7SUFBWUMsZTs7QUFDWjs7SUFBWUMsbUI7O0FBQ1o7O0lBQVlDLGM7O0FBRVo7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0E7O0FBRUEsSUFBTUMsZUFBZTtBQUNuQkMsYUFBVyxFQURRO0FBRW5CQyxTQUFPLEdBRlk7QUFHbkJDLFVBQVE7QUFIVyxDQUFyQjs7SUFNTUMsUTs7Ozs7Ozs7cUJBQ0pDLGlCLGdDQUFvQjtBQUNsQixTQUFLQyxhQUFMLENBQW1CLEtBQUtDLEtBQUwsQ0FBV04sU0FBOUI7QUFDQSxTQUFLTyxhQUFMLENBQW1CLEtBQUtELEtBQXhCO0FBQ0QsRzs7cUJBRURFLHlCLHNDQUEwQkMsUyxFQUFXO0FBQ25DLFFBQUksS0FBS0gsS0FBTCxDQUFXTCxLQUFYLEtBQXFCUSxVQUFVUixLQUEvQixJQUF3QyxLQUFLSyxLQUFMLENBQVdKLE1BQVgsS0FBc0JPLFVBQVVQLE1BQTVFLEVBQW9GO0FBQ2xGLFdBQUtLLGFBQUwsQ0FBbUJFLFNBQW5CO0FBQ0Q7QUFDRixHOztxQkFFREYsYSxnQ0FBK0I7QUFBQSxRQUFoQk4sS0FBZ0IsUUFBaEJBLEtBQWdCO0FBQUEsUUFBVEMsTUFBUyxRQUFUQSxNQUFTOztBQUM3QixRQUFJLENBQUNRLE9BQU9DLFFBQVAsQ0FBZ0JWLEtBQWhCLENBQUQsSUFBMkIsQ0FBQ1MsT0FB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QSxNQU01Q2lDLGVBTjRDO0FBQUEsTUFPNUNGLG1CQVA0QztBQUFBLE1BUTVDRyxjQVI0Qzs7QUFrQjlDLFNBQU87QUFDTEYsb0NBREs7QUFFTGhDLG9DQUZLO0FBR0xpQyxvQ0FISztBQUlMRiw0Q0FKSztBQUtMRyxrQ0FMSztBQU1MMUI7QUFOSyxHQUFQO0FBUUQ7O0FBRUQ7OztBQUdBLFNBQVNtRCxZQUFULENBQXNCRCxPQUF0QixFQUErQkQsV0FBL0IsRUFBNEM7QUFDMUMsTUFBTUcsWUFBWSxFQUFsQjtBQUNBLE9BQUssSUFBTUMsR0FBWCxJQUFrQkosV0FBbEIsRUFBK0I7QUFDN0IsUUFBSUEsWUFBWUssY0FBWixDQUEyQkQsR0FBM0IsS0FBbUNILFFBQVFJLGNBQVIsQ0FBdUJELEdBQXZCLENBQXZDLEVBQW9FO0FBQ2xFRCxnQkFBVUMsR0FBVixJQUFpQkosWUFBWUksR0FBWixDQUFqQjtBQUNEO0FBQ0Y7O0FBRUQsb0NBQVdILE9BQVgsRUFBdUJFLFNBQXZCO0FBQ0Q7O2tCQUVjLDhCQUNiUixlQURhLEVBRWJHLGtCQUZhLEVBR2JqRSxRQUhhLEMiLCJmaWxlIjoia2VwbGVyLWdsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdydcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCdcbmltcG9ydCByZXF1ZXN0IGZyb20gJ2QzLXJlcXVlc3QnO1xuaW1wb3J0IHtjb25uZWN0IGFzIGtlcGxlckdsQ29ubmVjdH0gZnJvbSAnLi4vY29ubmVjdC9rZXBsZXJnbC1jb25uZWN0JztcblxuaW1wb3J0IHtUaGVtZVByb3ZpZGVyfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCAqIGFzIFZpc1N0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL3Zpcy1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdGF0ZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIE1hcFN0eWxlQWN0aW9ucyBmcm9tICdhY3Rpb25zL21hcC1zdHlsZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIEJ1aWxkaW5nRGF0YUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9idWlsZGluZy1kYXRhLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgVUlTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy91aS1zdGF0ZS1hY3Rpb25zJztcblxuaW1wb3J0IHtESU1FTlNJT05TLCBERUZBVUxUX01BUF9TVFlMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IFNpZGVQYW5lbCBmcm9tICcuL3NpZGUtcGFuZWwnO1xuaW1wb3J0IE1hcENvbnRhaW5lciBmcm9tICcuL21hcC1jb250YWluZXInO1xuaW1wb3J0IEJvdHRvbVdpZGdldCBmcm9tICcuL2JvdHRvbS13aWRnZXQnO1xuaW1wb3J0IHt0aGVtZX0gZnJvbSAnLi4vc3R5bGVzL2Jhc2UnO1xuXG4vLyB3ZWJwYWNrIGNzcy1sb2FkZXIgaGFuZGxlcyBjc3MgbG9hZGluZ1xuLy8gaW1wb3J0ICcuLi9zdHlsZXNoZWV0cy9rZXBsZXIuZ2wuc2Nzcyc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbWFwU3R5bGVzOiBbXSxcbiAgd2lkdGg6IDgwMCxcbiAgaGVpZ2h0OiA4MDBcbn07XG5cbmNsYXNzIEtlcGxlckdMIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fbG9hZE1hcFN0eWxlKHRoaXMucHJvcHMubWFwU3R5bGVzKTtcbiAgICB0aGlzLl9oYW5kbGVSZXNpemUodGhpcy5wcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLnByb3BzLndpZHRoICE9PSBuZXh0UHJvcHMud2lkdGggfHwgdGhpcy5wcm9wcy5oZWlnaHQgIT09IG5leHRQcm9wcy5oZWlnaHQpIHtcbiAgICAgIHRoaXMuX2hhbmRsZVJlc2l6ZShuZXh0UHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVSZXNpemUoe3dpZHRoLCBoZWlnaHR9KSB7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUod2lkdGgpIHx8ICFOdW1iZXIuaXNGaW5pdGUoaGVpZ2h0KSkge1xuICAgICAgQ29uc29sZS53YXJuKCd3aWR0aCBhbmQgaGVpZ2h0IGlzIHJlcXVpcmVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMubWFwU3RhdGVBY3Rpb25zLnVwZGF0ZU1hcCh7XG4gICAgICB3aWR0aDogd2lkdGggLyAoMSArIE51bWJlcih0aGlzLnByb3BzLm1hcFN0YXRlLmlzU3BsaXQpKSxcbiAgICAgIGhlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgX2xvYWRNYXBTdHlsZSgpIHtcbiAgICBbLi4udGhpcy5wcm9wcy5tYXBTdHlsZXMsIC4uLk9iamVjdC52YWx1ZXMoREVGQVVMVF9NQVBfU1RZTEVTKV1cbiAgICAgIC5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICAgIGlmIChzdHlsZS5zdHlsZSkge1xuICAgICAgICB0aGlzLnByb3BzLmRpc3BhdGNoKE1hcFN0eWxlQWN0aW9ucy5sb2FkTWFwU3R5bGVzKHtcbiAgICAgICAgICBbc3R5bGUuaWRdOiBzdHlsZVxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0TWFwU3R5bGUoc3R5bGUpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBfcmVxdWVzdE1hcFN0eWxlKG1hcFN0eWxlKSB7XG4gICAgY29uc3Qge3VybCwgaWR9ID0gbWFwU3R5bGU7XG4gICAgcmVxdWVzdC5qc29uKHVybCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBDb25zb2xlLndhcm4oYEVycm9yIGxvYWRpbmcgbWFwIHN0eWxlICR7bWFwU3R5bGUudXJsfWApO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaChNYXBTdHlsZUFjdGlvbnMubG9hZE1hcFN0eWxlcyh7XG4gICAgICAgIFtpZF06IHsuLi5tYXBTdHlsZSwgc3R5bGU6IHJlc3VsdH1cbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgaWQsXG4gICAgICBidWlsZGluZ0RhdGEsXG4gICAgICBlZGl0aW5nRGF0YXNldCxcbiAgICAgIGZpbHRlcnMsXG4gICAgICBsYXllcnMsXG4gICAgICBzcGxpdE1hcHMsIC8vIHRoaXMgd2lsbCBzdG9yZSBzdXBwb3J0IGZvciBzcGxpdCBtYXAgdmlldyBpcyBuZWNlc3NhcnlcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgdWlTdGF0ZSxcblxuICAgICAgLy8gYWN0aW9ucyxcbiAgICAgIGJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgICB1aVN0YXRlQWN0aW9uc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3Qgc2lkZUZpZWxkcyA9IHtcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgZWRpdGluZ0RhdGFzZXQsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJPcmRlcixcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgbWFwU3R5bGUsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgdWlTdGF0ZSxcbiAgICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIHVpU3RhdGVBY3Rpb25zXG4gICAgfTtcblxuICAgIGNvbnN0IG1hcEZpZWxkcyA9IHtcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIGxheWVycyxcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgYnVpbGRpbmdEYXRhQWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCBpc1NwbGl0ID0gc3BsaXRNYXBzICYmIHNwbGl0TWFwcy5sZW5ndGggPiAxO1xuXG4gICAgY29uc3QgbWFwQ29udGFpbmVycyA9ICFpc1NwbGl0ID8gW1xuICAgICAgKFxuICAgICAgICA8TWFwQ29udGFpbmVyXG4gICAgICAgICAga2V5PXswfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgICAgbWFwTGF5ZXJzPXtpc1NwbGl0ID8gc3BsaXRNYXBzWzBdLmxheWVycyA6IG51bGx9XG4gICAgICAgICAgcG9wb3Zlck9mZnNldD17e2xlZnQ6IDAsIHRvcDogMH19XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgXSA6IHNwbGl0TWFwcy5tYXAoKHNldHRpbmdzLCBpbmRleCkgPT4gKFxuICAgICAgPE1hcENvbnRhaW5lclxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgIG1hcExheWVycz17c3BsaXRNYXBzW2luZGV4XS5sYXllcnN9XG4gICAgICAgIHBvcG92ZXJPZmZzZXQ9e3tsZWZ0OiAwLCB0b3A6IDB9fVxuICAgICAgLz5cbiAgICApKTtcblxuICAgIGNvbnN0IGNvbnRhaW5lclcgPSBtYXBTdGF0ZS53aWR0aCAqIChOdW1iZXIoaXNTcGxpdCkgKyAxKTtcbiAgICByZXR1cm4gKFxuICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoZW1lfT5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0gY2xhc3NOYW1lPVwia2VwbGVyLWdsXCIgaWQ9e2BrZXBsZXItZ2xfXyR7aWR9YH1cbiAgICAgICAgICAgICByZWY9e25vZGUgPT4ge1xuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gbm9kZTtcbiAgICAgICAgICAgICB9fT5cbiAgICAgICAgICB7IW1hcFN0YXRlLmlzRnVsbFNjcmVlbiAmJiAoXG4gICAgICAgICAgICA8U2lkZVBhbmVsXG4gICAgICAgICAgICAgIHsuLi5zaWRlRmllbGRzfVxuICAgICAgICAgICAgICB3aWR0aD17RElNRU5TSU9OUy5zaWRlQmFyV2lkdGh9XG4gICAgICAgICAgICAgIGNvbnRhaW5lclc9e2NvbnRhaW5lcld9XG4gICAgICAgICAgICAgIGNvbnRhaW5lckg9e21hcFN0YXRlLmhlaWdodH1cbiAgICAgICAgICAgICAgaGVpZ2h0PXttYXBTdGF0ZS5oZWlnaHR9XG4gICAgICAgICAgICAgIHJvb3ROb2RlPXt0aGlzLnJvb3R9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXBzXCIgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCd9fT5cbiAgICAgICAgICAgIHttYXBDb250YWluZXJzfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxCb3R0b21XaWRnZXRcbiAgICAgICAgICAgIGZpbHRlcnM9e2ZpbHRlcnN9XG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICB1aVN0YXRlPXt1aVN0YXRlfVxuICAgICAgICAgICAgdmlzU3RhdGVBY3Rpb25zPXt2aXNTdGF0ZUFjdGlvbnN9XG4gICAgICAgICAgICBzaWRlUGFuZWxXaWR0aD17RElNRU5TSU9OUy5zaWRlQmFyV2lkdGh9XG4gICAgICAgICAgICBzaWRlTmF2V2lkdGg9e0RJTUVOU0lPTlMuc2lkZU5hdkN9XG4gICAgICAgICAgICBjb250YWluZXJXPXtjb250YWluZXJXfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICk7XG4gIH1cbn1cblxuS2VwbGVyR0wuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUsIHByb3BzKSB7XG4gIHJldHVybiB7XG4gICAgLi4ucHJvcHMsXG4gICAgLi4uc3RhdGUudmlzU3RhdGUsXG4gICAgYnVpbGRpbmdEYXRhOiBzdGF0ZS5idWlsZGluZ0RhdGEuYnVpbGRpbmdEYXRhLFxuICAgIG1hcFN0eWxlOiBzdGF0ZS5tYXBTdHlsZSxcbiAgICBtYXBTdGF0ZTogc3RhdGUubWFwU3RhdGUsXG4gICAgdWlTdGF0ZTogc3RhdGUudWlTdGF0ZVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gsIG93blByb3BzKSB7XG4gIGNvbnN0IHVzZXJBY3Rpb25zID0gb3duUHJvcHMuYWN0aW9ucyB8fCB7fTtcblxuICBjb25zdCBbXG4gICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICB1aVN0YXRlQWN0aW9uc1xuICBdID0gW1xuICAgIFZpc1N0YXRlQWN0aW9ucyxcbiAgICBNYXBTdGF0ZUFjdGlvbnMsXG4gICAgTWFwU3R5bGVBY3Rpb25zLFxuICAgIEJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgVUlTdGF0ZUFjdGlvbnNcbiAgXS5tYXAoYWN0aW9ucyA9PlxuICAgIGJpbmRBY3Rpb25DcmVhdG9ycyhtZXJnZUFjdGlvbnMoYWN0aW9ucywgdXNlckFjdGlvbnMpLCBkaXNwYXRjaCkpO1xuXG4gIHJldHVybiB7XG4gICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICBkaXNwYXRjaFxuICB9O1xufVxuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgbWFwcy1nbCBhY3Rpb25zIHdpdGggdXNlciBkZWZpbmVkIGFjdGlvbnMgdXNpbmcgdGhlIHNhbWUga2V5XG4gKi9cbmZ1bmN0aW9uIG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucykge1xuICBjb25zdCBvdmVycmlkZXMgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gdXNlckFjdGlvbnMpIHtcbiAgICBpZiAodXNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBhY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG92ZXJyaWRlc1trZXldID0gdXNlckFjdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gey4uLmFjdGlvbnMsIC4uLm92ZXJyaWRlc307XG59XG5cbmV4cG9ydCBkZWZhdWx0IGtlcGxlckdsQ29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoS2VwbGVyR0wpO1xuIl19