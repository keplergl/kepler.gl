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
      console.log(style);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJWaXNTdGF0ZUFjdGlvbnMiLCJNYXBTdGF0ZUFjdGlvbnMiLCJNYXBTdHlsZUFjdGlvbnMiLCJCdWlsZGluZ0RhdGFBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJkZWZhdWx0UHJvcHMiLCJtYXBTdHlsZXMiLCJ3aWR0aCIsImhlaWdodCIsIktlcGxlckdMIiwiY29tcG9uZW50RGlkTW91bnQiLCJfbG9hZE1hcFN0eWxlIiwicHJvcHMiLCJfaGFuZGxlUmVzaXplIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsIk51bWJlciIsImlzRmluaXRlIiwid2FybiIsIm1hcFN0YXRlQWN0aW9ucyIsInVwZGF0ZU1hcCIsIm1hcFN0YXRlIiwiaXNTcGxpdCIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJjb25zb2xlIiwibG9nIiwic3R5bGUiLCJkaXNwYXRjaCIsImxvYWRNYXBTdHlsZXMiLCJpZCIsIl9yZXF1ZXN0TWFwU3R5bGUiLCJtYXBTdHlsZSIsInVybCIsImpzb24iLCJlcnJvciIsInJlc3VsdCIsInJlbmRlciIsImJ1aWxkaW5nRGF0YSIsImVkaXRpbmdEYXRhc2V0IiwiZmlsdGVycyIsImxheWVycyIsInNwbGl0TWFwcyIsImxheWVyT3JkZXIiLCJsYXllckJsZW5kaW5nIiwiaW50ZXJhY3Rpb25Db25maWciLCJkYXRhc2V0cyIsImxheWVyRGF0YSIsImhvdmVySW5mbyIsImNsaWNrZWQiLCJ1aVN0YXRlIiwiYnVpbGRpbmdEYXRhQWN0aW9ucyIsInZpc1N0YXRlQWN0aW9ucyIsIm1hcFN0eWxlQWN0aW9ucyIsInVpU3RhdGVBY3Rpb25zIiwic2lkZUZpZWxkcyIsIm1hcEZpZWxkcyIsImxlbmd0aCIsIm1hcENvbnRhaW5lcnMiLCJsZWZ0IiwidG9wIiwibWFwIiwic2V0dGluZ3MiLCJpbmRleCIsImNvbnRhaW5lclciLCJwb3NpdGlvbiIsInJvb3QiLCJub2RlIiwiaXNGdWxsU2NyZWVuIiwic2lkZUJhcldpZHRoIiwiZGlzcGxheSIsInNpZGVOYXZDIiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJ2aXNTdGF0ZSIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIm93blByb3BzIiwidXNlckFjdGlvbnMiLCJhY3Rpb25zIiwibWVyZ2VBY3Rpb25zIiwib3ZlcnJpZGVzIiwia2V5IiwiaGFzT3duUHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBRUE7O0lBQVlBLGU7O0FBQ1o7O0lBQVlDLGU7O0FBQ1o7O0lBQVlDLGU7O0FBQ1o7O0lBQVlDLG1COztBQUNaOztJQUFZQyxjOztBQUVaOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBOztBQUVBLElBQU1DLGVBQWU7QUFDbkJDLGFBQVcsRUFEUTtBQUVuQkMsU0FBTyxHQUZZO0FBR25CQyxVQUFRO0FBSFcsQ0FBckI7O0lBTU1DLFE7Ozs7Ozs7O3FCQUNKQyxpQixnQ0FBb0I7QUFDbEIsU0FBS0MsYUFBTCxDQUFtQixLQUFLQyxLQUFMLENBQVdOLFNBQTlCO0FBQ0EsU0FBS08sYUFBTCxDQUFtQixLQUFLRCxLQUF4QjtBQUNELEc7O3FCQUVERSx5QixzQ0FBMEJDLFMsRUFBVztBQUNuQyxRQUFJLEtBQUtILEtBQUwsQ0FBV0wsS0FBWCxLQUFxQlEsVUFBVVIsS0FBL0IsSUFBd0MsS0FBS0ssS0FBTCxDQUFXSixNQUFYLEtBQXNCTyxVQUFVUCxNQUE1RSxFQUFvRjtBQUNsRixXQUFLSyxhQUFMLENBQW1CRSxTQUFuQjtBQUNEO0FBQ0YsRzs7cUJBRURGLGEsZ0NBQStCO0FBQUEsUUFBaEJOLEtBQWdCLFFBQWhCQSxLQUFnQjtBQUFBLFFBQVRDLE1BQVMsUUFBVEEsTUFBUzs7QUFDN0IsUUFBSSxDQUFDUSxPQUFPQyxRQUFQLENBQWdCVixLQUFoQixDQUFE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Q0FUMEM7QUFBQSxNQUk1Q3dCLGVBSjRDO0FBQUEsTUFLNUNsQyxlQUw0QztBQUFBLE1BTTVDbUMsZUFONEM7QUFBQSxNQU81Q0YsbUJBUDRDO0FBQUEsTUFRNUNHLGNBUjRDOztBQWtCOUMsU0FBTztBQUNMRixvQ0FESztBQUVMbEMsb0NBRks7QUFHTG1DLG9DQUhLO0FBSUxGLDRDQUpLO0FBS0xHLGtDQUxLO0FBTUwxQjtBQU5LLEdBQVA7QUFRRDs7QUFFRDs7O0FBR0EsU0FBU21ELFlBQVQsQ0FBc0JELE9BQXRCLEVBQStCRCxXQUEvQixFQUE0QztBQUMxQyxNQUFNRyxZQUFZLEVBQWxCO0FBQ0EsT0FBSyxJQUFNQyxHQUFYLElBQWtCSixXQUFsQixFQUErQjtBQUM3QixRQUFJQSxZQUFZSyxjQUFaLENBQTJCRCxHQUEzQixLQUFtQ0gsUUFBUUksY0FBUixDQUF1QkQsR0FBdkIsQ0FBdkMsRUFBb0U7QUFDbEVELGdCQUFVQyxHQUFWLElBQWlCSixZQUFZSSxHQUFaLENBQWpCO0FBQ0Q7QUFDRjs7QUFFRCxvQ0FBV0gsT0FBWCxFQUF1QkUsU0FBdkI7QUFDRDs7a0JBRWMsOEJBQ2JSLGVBRGEsRUFFYkcsa0JBRmEsRUFHYm5FLFFBSGEsQyIsImZpbGUiOiJrZXBsZXItZ2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93J1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4J1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnZDMtcmVxdWVzdCc7XG5pbXBvcnQge2Nvbm5lY3QgYXMga2VwbGVyR2xDb25uZWN0fSBmcm9tICcuLi9jb25uZWN0L2tlcGxlcmdsLWNvbm5lY3QnO1xuXG5pbXBvcnQge1RoZW1lUHJvdmlkZXJ9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0ICogYXMgVmlzU3RhdGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgTWFwU3RhdGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvbWFwLXN0YXRlLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgTWFwU3R5bGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvbWFwLXN0eWxlLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgQnVpbGRpbmdEYXRhQWN0aW9ucyBmcm9tICdhY3Rpb25zL2J1aWxkaW5nLWRhdGEtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBVSVN0YXRlQWN0aW9ucyBmcm9tICdhY3Rpb25zL3VpLXN0YXRlLWFjdGlvbnMnO1xuXG5pbXBvcnQge0RJTUVOU0lPTlMsIERFRkFVTFRfTUFQX1NUWUxFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQgU2lkZVBhbmVsIGZyb20gJy4vc2lkZS1wYW5lbCc7XG5pbXBvcnQgTWFwQ29udGFpbmVyIGZyb20gJy4vbWFwLWNvbnRhaW5lcic7XG5pbXBvcnQgQm90dG9tV2lkZ2V0IGZyb20gJy4vYm90dG9tLXdpZGdldCc7XG5pbXBvcnQge3RoZW1lfSBmcm9tICcuLi9zdHlsZXMvYmFzZSc7XG5cbi8vIHdlYnBhY2sgY3NzLWxvYWRlciBoYW5kbGVzIGNzcyBsb2FkaW5nXG4vLyBpbXBvcnQgJy4uL3N0eWxlc2hlZXRzL2tlcGxlci5nbC5zY3NzJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtYXBTdHlsZXM6IFtdLFxuICB3aWR0aDogODAwLFxuICBoZWlnaHQ6IDgwMFxufTtcblxuY2xhc3MgS2VwbGVyR0wgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9sb2FkTWFwU3R5bGUodGhpcy5wcm9wcy5tYXBTdHlsZXMpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMud2lkdGggIT09IG5leHRQcm9wcy53aWR0aCB8fCB0aGlzLnByb3BzLmhlaWdodCAhPT0gbmV4dFByb3BzLmhlaWdodCkge1xuICAgICAgdGhpcy5faGFuZGxlUmVzaXplKG5leHRQcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZVJlc2l6ZSh7d2lkdGgsIGhlaWdodH0pIHtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh3aWR0aCkgfHwgIU51bWJlci5pc0Zpbml0ZShoZWlnaHQpKSB7XG4gICAgICBDb25zb2xlLndhcm4oJ3dpZHRoIGFuZCBoZWlnaHQgaXMgcmVxdWlyZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5tYXBTdGF0ZUFjdGlvbnMudXBkYXRlTWFwKHtcbiAgICAgIHdpZHRoOiB3aWR0aCAvICgxICsgTnVtYmVyKHRoaXMucHJvcHMubWFwU3RhdGUuaXNTcGxpdCkpLFxuICAgICAgaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICBfbG9hZE1hcFN0eWxlKCkge1xuICAgIFsuLi50aGlzLnByb3BzLm1hcFN0eWxlcywgLi4uT2JqZWN0LnZhbHVlcyhERUZBVUxUX01BUF9TVFlMRVMpXVxuICAgICAgLmZvckVhY2goc3R5bGUgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhzdHlsZSlcbiAgICAgIGlmIChzdHlsZS5zdHlsZSkge1xuICAgICAgICB0aGlzLnByb3BzLmRpc3BhdGNoKE1hcFN0eWxlQWN0aW9ucy5sb2FkTWFwU3R5bGVzKHtcbiAgICAgICAgICBbc3R5bGUuaWRdOiBzdHlsZVxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0TWFwU3R5bGUoc3R5bGUpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBfcmVxdWVzdE1hcFN0eWxlKG1hcFN0eWxlKSB7XG4gICAgY29uc3Qge3VybCwgaWR9ID0gbWFwU3R5bGU7XG4gICAgcmVxdWVzdC5qc29uKHVybCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBDb25zb2xlLndhcm4oYEVycm9yIGxvYWRpbmcgbWFwIHN0eWxlICR7bWFwU3R5bGUudXJsfWApO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaChNYXBTdHlsZUFjdGlvbnMubG9hZE1hcFN0eWxlcyh7XG4gICAgICAgIFtpZF06IHsuLi5tYXBTdHlsZSwgc3R5bGU6IHJlc3VsdH1cbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgaWQsXG4gICAgICBidWlsZGluZ0RhdGEsXG4gICAgICBlZGl0aW5nRGF0YXNldCxcbiAgICAgIGZpbHRlcnMsXG4gICAgICBsYXllcnMsXG4gICAgICBzcGxpdE1hcHMsIC8vIHRoaXMgd2lsbCBzdG9yZSBzdXBwb3J0IGZvciBzcGxpdCBtYXAgdmlldyBpcyBuZWNlc3NhcnlcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgdWlTdGF0ZSxcblxuICAgICAgLy8gYWN0aW9ucyxcbiAgICAgIGJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgICB1aVN0YXRlQWN0aW9uc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3Qgc2lkZUZpZWxkcyA9IHtcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgZWRpdGluZ0RhdGFzZXQsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJPcmRlcixcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgbWFwU3R5bGUsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgdWlTdGF0ZSxcbiAgICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIHVpU3RhdGVBY3Rpb25zXG4gICAgfTtcblxuICAgIGNvbnN0IG1hcEZpZWxkcyA9IHtcbiAgICAgIGJ1aWxkaW5nRGF0YSxcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgbWFwU3RhdGUsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIGxheWVycyxcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBsYXllckRhdGEsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICBob3ZlckluZm8sXG4gICAgICBjbGlja2VkLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgYnVpbGRpbmdEYXRhQWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCBpc1NwbGl0ID0gc3BsaXRNYXBzICYmIHNwbGl0TWFwcy5sZW5ndGggPiAxO1xuXG4gICAgY29uc3QgbWFwQ29udGFpbmVycyA9ICFpc1NwbGl0ID8gW1xuICAgICAgKFxuICAgICAgICA8TWFwQ29udGFpbmVyXG4gICAgICAgICAga2V5PXswfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgICAgbWFwTGF5ZXJzPXtpc1NwbGl0ID8gc3BsaXRNYXBzWzBdLmxheWVycyA6IG51bGx9XG4gICAgICAgICAgcG9wb3Zlck9mZnNldD17e2xlZnQ6IDAsIHRvcDogMH19XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgXSA6IHNwbGl0TWFwcy5tYXAoKHNldHRpbmdzLCBpbmRleCkgPT4gKFxuICAgICAgPE1hcENvbnRhaW5lclxuICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgIHsuLi5tYXBGaWVsZHN9XG4gICAgICAgIG1hcExheWVycz17c3BsaXRNYXBzW2luZGV4XS5sYXllcnN9XG4gICAgICAgIHBvcG92ZXJPZmZzZXQ9e3tsZWZ0OiAwLCB0b3A6IDB9fVxuICAgICAgLz5cbiAgICApKTtcblxuICAgIGNvbnN0IGNvbnRhaW5lclcgPSBtYXBTdGF0ZS53aWR0aCAqIChOdW1iZXIoaXNTcGxpdCkgKyAxKTtcbiAgICByZXR1cm4gKFxuICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoZW1lfT5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0gY2xhc3NOYW1lPVwia2VwbGVyLWdsXCIgaWQ9e2BrZXBsZXItZ2xfXyR7aWR9YH1cbiAgICAgICAgICAgICByZWY9e25vZGUgPT4ge1xuICAgICAgICAgICAgICAgdGhpcy5yb290ID0gbm9kZTtcbiAgICAgICAgICAgICB9fT5cbiAgICAgICAgICB7IW1hcFN0YXRlLmlzRnVsbFNjcmVlbiAmJiAoXG4gICAgICAgICAgICA8U2lkZVBhbmVsXG4gICAgICAgICAgICAgIHsuLi5zaWRlRmllbGRzfVxuICAgICAgICAgICAgICB3aWR0aD17RElNRU5TSU9OUy5zaWRlQmFyV2lkdGh9XG4gICAgICAgICAgICAgIGNvbnRhaW5lclc9e2NvbnRhaW5lcld9XG4gICAgICAgICAgICAgIGNvbnRhaW5lckg9e21hcFN0YXRlLmhlaWdodH1cbiAgICAgICAgICAgICAgaGVpZ2h0PXttYXBTdGF0ZS5oZWlnaHR9XG4gICAgICAgICAgICAgIHJvb3ROb2RlPXt0aGlzLnJvb3R9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXBzXCIgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCd9fT5cbiAgICAgICAgICAgIHttYXBDb250YWluZXJzfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxCb3R0b21XaWRnZXRcbiAgICAgICAgICAgIGZpbHRlcnM9e2ZpbHRlcnN9XG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICB1aVN0YXRlPXt1aVN0YXRlfVxuICAgICAgICAgICAgdmlzU3RhdGVBY3Rpb25zPXt2aXNTdGF0ZUFjdGlvbnN9XG4gICAgICAgICAgICBzaWRlUGFuZWxXaWR0aD17RElNRU5TSU9OUy5zaWRlQmFyV2lkdGh9XG4gICAgICAgICAgICBzaWRlTmF2V2lkdGg9e0RJTUVOU0lPTlMuc2lkZU5hdkN9XG4gICAgICAgICAgICBjb250YWluZXJXPXtjb250YWluZXJXfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICk7XG4gIH1cbn1cblxuS2VwbGVyR0wuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUsIHByb3BzKSB7XG4gIHJldHVybiB7XG4gICAgLi4ucHJvcHMsXG4gICAgLi4uc3RhdGUudmlzU3RhdGUsXG4gICAgYnVpbGRpbmdEYXRhOiBzdGF0ZS5idWlsZGluZ0RhdGEuYnVpbGRpbmdEYXRhLFxuICAgIG1hcFN0eWxlOiBzdGF0ZS5tYXBTdHlsZSxcbiAgICBtYXBTdGF0ZTogc3RhdGUubWFwU3RhdGUsXG4gICAgdWlTdGF0ZTogc3RhdGUudWlTdGF0ZVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gsIG93blByb3BzKSB7XG4gIGNvbnN0IHVzZXJBY3Rpb25zID0gb3duUHJvcHMuYWN0aW9ucyB8fCB7fTtcblxuICBjb25zdCBbXG4gICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICB1aVN0YXRlQWN0aW9uc1xuICBdID0gW1xuICAgIFZpc1N0YXRlQWN0aW9ucyxcbiAgICBNYXBTdGF0ZUFjdGlvbnMsXG4gICAgTWFwU3R5bGVBY3Rpb25zLFxuICAgIEJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgVUlTdGF0ZUFjdGlvbnNcbiAgXS5tYXAoYWN0aW9ucyA9PlxuICAgIGJpbmRBY3Rpb25DcmVhdG9ycyhtZXJnZUFjdGlvbnMoYWN0aW9ucywgdXNlckFjdGlvbnMpLCBkaXNwYXRjaCkpO1xuXG4gIHJldHVybiB7XG4gICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgYnVpbGRpbmdEYXRhQWN0aW9ucyxcbiAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICBkaXNwYXRjaFxuICB9O1xufVxuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgbWFwcy1nbCBhY3Rpb25zIHdpdGggdXNlciBkZWZpbmVkIGFjdGlvbnMgdXNpbmcgdGhlIHNhbWUga2V5XG4gKi9cbmZ1bmN0aW9uIG1lcmdlQWN0aW9ucyhhY3Rpb25zLCB1c2VyQWN0aW9ucykge1xuICBjb25zdCBvdmVycmlkZXMgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gdXNlckFjdGlvbnMpIHtcbiAgICBpZiAodXNlckFjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBhY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG92ZXJyaWRlc1trZXldID0gdXNlckFjdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gey4uLmFjdGlvbnMsIC4uLm92ZXJyaWRlc307XG59XG5cbmV4cG9ydCBkZWZhdWx0IGtlcGxlckdsQ29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoS2VwbGVyR0wpO1xuIl19