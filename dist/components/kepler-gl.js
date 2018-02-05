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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2tlcGxlci1nbC5qcyJdLCJuYW1lcyI6WyJWaXNTdGF0ZUFjdGlvbnMiLCJNYXBTdGF0ZUFjdGlvbnMiLCJNYXBTdHlsZUFjdGlvbnMiLCJCdWlsZGluZ0RhdGFBY3Rpb25zIiwiVUlTdGF0ZUFjdGlvbnMiLCJkZWZhdWx0UHJvcHMiLCJtYXBTdHlsZXMiLCJ3aWR0aCIsImhlaWdodCIsIkdsb2JhbFN0eWxlIiwiZGl2IiwiS2VwbGVyR0wiLCJjb21wb25lbnREaWRNb3VudCIsIl9sb2FkTWFwU3R5bGUiLCJwcm9wcyIsIl9oYW5kbGVSZXNpemUiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwibmV4dFByb3BzIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ3YXJuIiwibWFwU3RhdGVBY3Rpb25zIiwidXBkYXRlTWFwIiwibWFwU3RhdGUiLCJpc1NwbGl0IiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsInN0eWxlIiwiZGlzcGF0Y2giLCJsb2FkTWFwU3R5bGVzIiwiaWQiLCJfcmVxdWVzdE1hcFN0eWxlIiwibWFwU3R5bGUiLCJ1cmwiLCJqc29uIiwiZXJyb3IiLCJyZXN1bHQiLCJyZW5kZXIiLCJidWlsZGluZ0RhdGEiLCJlZGl0aW5nRGF0YXNldCIsImZpbHRlcnMiLCJsYXllcnMiLCJzcGxpdE1hcHMiLCJsYXllck9yZGVyIiwibGF5ZXJCbGVuZGluZyIsImludGVyYWN0aW9uQ29uZmlnIiwiZGF0YXNldHMiLCJsYXllckRhdGEiLCJob3ZlckluZm8iLCJjbGlja2VkIiwidWlTdGF0ZSIsImJ1aWxkaW5nRGF0YUFjdGlvbnMiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJtYXBTdHlsZUFjdGlvbnMiLCJ1aVN0YXRlQWN0aW9ucyIsInNpZGVGaWVsZHMiLCJtYXBGaWVsZHMiLCJsZW5ndGgiLCJtYXBDb250YWluZXJzIiwibGVmdCIsInRvcCIsIm1hcCIsInNldHRpbmdzIiwiaW5kZXgiLCJjb250YWluZXJXIiwicG9zaXRpb24iLCJyb290Iiwibm9kZSIsImlzRnVsbFNjcmVlbiIsInNpZGVQYW5lbCIsImRpc3BsYXkiLCJtYXJnaW4iLCJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsInZpc1N0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwib3duUHJvcHMiLCJ1c2VyQWN0aW9ucyIsImFjdGlvbnMiLCJtZXJnZUFjdGlvbnMiLCJvdmVycmlkZXMiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUlBOztJQUFZQSxlOztBQUNaOztJQUFZQyxlOztBQUNaOztJQUFZQyxlOztBQUNaOztJQUFZQyxtQjs7QUFDWjs7SUFBWUMsYzs7QUFFWjs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUMsZUFBZTtBQUNuQkMsYUFBVyxFQURRO0FBRW5CQyxTQUFPLEdBRlk7QUFHbkJDLFVBQVE7QUFIVyxDQUFyQjs7QUFNQSxJQUFNQyxjQUFjLDJCQUFPQyxHQUFyQixpQkFBTjs7SUE0Qk1DLFE7Ozs7Ozs7O3FCQUNKQyxpQixnQ0FBb0I7QUFDbEIsU0FBS0MsYUFBTCxDQUFtQixLQUFLQyxLQUFMLENBQVdSLFNBQTlCO0FBQ0EsU0FBS1MsYUFBTCxDQUFtQixLQUFLRCxLQUF4QjtBQUNELEc7O3FCQUVERSx5QixzQ0FBMEJDLFMsRUFBVztBQUNuQyxRQUNFLEtBQUtILEtBQUwsQ0FBV1AsS0FBWCxLQUFxQlUsVUFBVVYsS0FBL0IsSUFDQSxLQUFLTyxLQUFMLENBQVdOLE1BQVgsS0FBc0JTLFVBQVVULE1BRmxDLEVBR0U7QUFDQSxXQUFLTyxhQUFMLENBQW1CRSxTQUFuQjtBQUNEO0FBQ0YsRzs7cUJBRURGLGEsZ0NBQStCO0FBQUEsUUFBaEJSLEtBQWdCLFFBQWhCQSxLQUFnQjtBQUFBLFFBQVRDLE1BQVMsUUFBVEEsTUFBUzs7QUFDN0IsUUFBSSxDQUFD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QixDQUFuQixFQUF1RGpELFFBQXZELENBREk7QUFBQSxHQU5GLENBVDBDO0FBQUEsTUFJNUN3QixlQUo0QztBQUFBLE1BSzVDaEMsZUFMNEM7QUFBQSxNQU01Q2lDLGVBTjRDO0FBQUEsTUFPNUNGLG1CQVA0QztBQUFBLE1BUTVDRyxjQVI0Qzs7QUFtQjlDLFNBQU87QUFDTEYsb0NBREs7QUFFTGhDLG9DQUZLO0FBR0xpQyxvQ0FISztBQUlMRiw0Q0FKSztBQUtMRyxrQ0FMSztBQU1MMUI7QUFOSyxHQUFQO0FBUUQ7O0FBRUQ7OztBQUdBLFNBQVNtRCxZQUFULENBQXNCRCxPQUF0QixFQUErQkQsV0FBL0IsRUFBNEM7QUFDMUMsTUFBTUcsWUFBWSxFQUFsQjtBQUNBLE9BQUssSUFBTUMsR0FBWCxJQUFrQkosV0FBbEIsRUFBK0I7QUFDN0IsUUFBSUEsWUFBWUssY0FBWixDQUEyQkQsR0FBM0IsS0FBbUNILFFBQVFJLGNBQVIsQ0FBdUJELEdBQXZCLENBQXZDLEVBQW9FO0FBQ2xFRCxnQkFBVUMsR0FBVixJQUFpQkosWUFBWUksR0FBWixDQUFqQjtBQUNEO0FBQ0Y7O0FBRUQsb0NBQVdILE9BQVgsRUFBdUJFLFNBQXZCO0FBQ0Q7O2tCQUVjLDhCQUFnQlIsZUFBaEIsRUFBaUNHLGtCQUFqQyxFQUFxRGpFLFFBQXJELEMiLCJmaWxlIjoia2VwbGVyLWdsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQge2JpbmRBY3Rpb25DcmVhdG9yc30gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnZDMtcmVxdWVzdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Y29ubmVjdCBhcyBrZXBsZXJHbENvbm5lY3R9IGZyb20gJy4uL2Nvbm5lY3Qva2VwbGVyZ2wtY29ubmVjdCc7XG5cbmltcG9ydCB7VGhlbWVQcm92aWRlcn0gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgKiBhcyBWaXNTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy92aXMtc3RhdGUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBNYXBTdGF0ZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9tYXAtc3RhdGUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBNYXBTdHlsZUFjdGlvbnMgZnJvbSAnYWN0aW9ucy9tYXAtc3R5bGUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBCdWlsZGluZ0RhdGFBY3Rpb25zIGZyb20gJ2FjdGlvbnMvYnVpbGRpbmctZGF0YS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIFVJU3RhdGVBY3Rpb25zIGZyb20gJ2FjdGlvbnMvdWktc3RhdGUtYWN0aW9ucyc7XG5cbmltcG9ydCB7RElNRU5TSU9OUywgREVGQVVMVF9NQVBfU1RZTEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmltcG9ydCBTaWRlUGFuZWwgZnJvbSAnLi9zaWRlLXBhbmVsJztcbmltcG9ydCBNYXBDb250YWluZXIgZnJvbSAnLi9tYXAtY29udGFpbmVyJztcbmltcG9ydCBCb3R0b21XaWRnZXQgZnJvbSAnLi9ib3R0b20td2lkZ2V0JztcbmltcG9ydCB7dGhlbWV9IGZyb20gJy4uL3N0eWxlcy9iYXNlJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtYXBTdHlsZXM6IFtdLFxuICB3aWR0aDogODAwLFxuICBoZWlnaHQ6IDgwMFxufTtcblxuY29uc3QgR2xvYmFsU3R5bGUgPSBzdHlsZWQuZGl2YFxuICBmb250LWZhbWlseTogZmYtY2xhbi13ZWItcHJvLCAnSGVsdmV0aWNhIE5ldWUnLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGZvbnQtc2l6ZTogLjg3NWVtO1xuICBsaW5lLWhlaWdodDogMS43MTQyOTtcbiAgXG4gICosXG4gICo6YmVmb3JlLFxuICAqOmFmdGVyIHtcbiAgICAtd2Via2l0LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgLW1vei1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIH1cbiAgXG4gIHVsIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuICBcbiAgbGkge1xuICAgIG1hcmdpbjogMDtcbiAgfVxuICBcbiAgYSB7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB9XG5gO1xuXG5jbGFzcyBLZXBsZXJHTCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX2xvYWRNYXBTdHlsZSh0aGlzLnByb3BzLm1hcFN0eWxlcyk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXplKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLndpZHRoICE9PSBuZXh0UHJvcHMud2lkdGggfHxcbiAgICAgIHRoaXMucHJvcHMuaGVpZ2h0ICE9PSBuZXh0UHJvcHMuaGVpZ2h0XG4gICAgKSB7XG4gICAgICB0aGlzLl9oYW5kbGVSZXNpemUobmV4dFByb3BzKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlUmVzaXplKHt3aWR0aCwgaGVpZ2h0fSkge1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHdpZHRoKSB8fCAhTnVtYmVyLmlzRmluaXRlKGhlaWdodCkpIHtcbiAgICAgIENvbnNvbGUud2Fybignd2lkdGggYW5kIGhlaWdodCBpcyByZXF1aXJlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm1hcFN0YXRlQWN0aW9ucy51cGRhdGVNYXAoe1xuICAgICAgd2lkdGg6IHdpZHRoIC8gKDEgKyBOdW1iZXIodGhpcy5wcm9wcy5tYXBTdGF0ZS5pc1NwbGl0KSksXG4gICAgICBoZWlnaHRcbiAgICB9KTtcbiAgfVxuXG4gIF9sb2FkTWFwU3R5bGUoKSB7XG4gICAgWy4uLnRoaXMucHJvcHMubWFwU3R5bGVzLCAuLi5PYmplY3QudmFsdWVzKERFRkFVTFRfTUFQX1NUWUxFUyldLmZvckVhY2goXG4gICAgICBzdHlsZSA9PiB7XG4gICAgICAgIGlmIChzdHlsZS5zdHlsZSkge1xuICAgICAgICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goXG4gICAgICAgICAgICBNYXBTdHlsZUFjdGlvbnMubG9hZE1hcFN0eWxlcyh7XG4gICAgICAgICAgICAgIFtzdHlsZS5pZF06IHN0eWxlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVxdWVzdE1hcFN0eWxlKHN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBfcmVxdWVzdE1hcFN0eWxlKG1hcFN0eWxlKSB7XG4gICAgY29uc3Qge3VybCwgaWR9ID0gbWFwU3R5bGU7XG4gICAgcmVxdWVzdC5qc29uKHVybCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBDb25zb2xlLndhcm4oYEVycm9yIGxvYWRpbmcgbWFwIHN0eWxlICR7bWFwU3R5bGUudXJsfWApO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaChcbiAgICAgICAgTWFwU3R5bGVBY3Rpb25zLmxvYWRNYXBTdHlsZXMoe1xuICAgICAgICAgIFtpZF06IHsuLi5tYXBTdHlsZSwgc3R5bGU6IHJlc3VsdH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgLy8gcHJvcHNcbiAgICAgIGlkLFxuICAgICAgYnVpbGRpbmdEYXRhLFxuICAgICAgZWRpdGluZ0RhdGFzZXQsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgbGF5ZXJzLFxuICAgICAgc3BsaXRNYXBzLCAvLyB0aGlzIHdpbGwgc3RvcmUgc3VwcG9ydCBmb3Igc3BsaXQgbWFwIHZpZXcgaXMgbmVjZXNzYXJ5XG4gICAgICBsYXllck9yZGVyLFxuICAgICAgbGF5ZXJCbGVuZGluZyxcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgZGF0YXNldHMsXG4gICAgICBtYXBTdHlsZSxcbiAgICAgIG1hcFN0YXRlLFxuICAgICAgbGF5ZXJEYXRhLFxuICAgICAgaG92ZXJJbmZvLFxuICAgICAgY2xpY2tlZCxcbiAgICAgIHVpU3RhdGUsXG5cbiAgICAgIC8vIGFjdGlvbnMsXG4gICAgICBidWlsZGluZ0RhdGFBY3Rpb25zLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgdWlTdGF0ZUFjdGlvbnNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHNpZGVGaWVsZHMgPSB7XG4gICAgICBkYXRhc2V0cyxcbiAgICAgIGVkaXRpbmdEYXRhc2V0LFxuICAgICAgZmlsdGVycyxcbiAgICAgIGxheWVycyxcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIG1hcFN0eWxlLFxuICAgICAgbGF5ZXJCbGVuZGluZyxcbiAgICAgIHVpU3RhdGUsXG4gICAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICB1aVN0YXRlQWN0aW9uc1xuICAgIH07XG5cbiAgICBjb25zdCBtYXBGaWVsZHMgPSB7XG4gICAgICBidWlsZGluZ0RhdGEsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIG1hcFN0YXRlLFxuICAgICAgbWFwU3R5bGUsXG4gICAgICBsYXllcnMsXG4gICAgICBsYXllck9yZGVyLFxuICAgICAgbGF5ZXJEYXRhLFxuICAgICAgbGF5ZXJCbGVuZGluZyxcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgaG92ZXJJbmZvLFxuICAgICAgY2xpY2tlZCxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIG1hcFN0YXRlQWN0aW9ucyxcbiAgICAgIGJ1aWxkaW5nRGF0YUFjdGlvbnNcbiAgICB9O1xuXG4gICAgY29uc3QgaXNTcGxpdCA9IHNwbGl0TWFwcyAmJiBzcGxpdE1hcHMubGVuZ3RoID4gMTtcblxuICAgIGNvbnN0IG1hcENvbnRhaW5lcnMgPSAhaXNTcGxpdFxuICAgICAgPyBbXG4gICAgICAgICAgPE1hcENvbnRhaW5lclxuICAgICAgICAgICAga2V5PXswfVxuICAgICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgICB7Li4ubWFwRmllbGRzfVxuICAgICAgICAgICAgbWFwTGF5ZXJzPXtpc1NwbGl0ID8gc3BsaXRNYXBzWzBdLmxheWVycyA6IG51bGx9XG4gICAgICAgICAgICBwb3BvdmVyT2Zmc2V0PXt7bGVmdDogMCwgdG9wOiAwfX1cbiAgICAgICAgICAvPlxuICAgICAgICBdXG4gICAgICA6IHNwbGl0TWFwcy5tYXAoKHNldHRpbmdzLCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxNYXBDb250YWluZXJcbiAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICB7Li4ubWFwRmllbGRzfVxuICAgICAgICAgICAgbWFwTGF5ZXJzPXtzcGxpdE1hcHNbaW5kZXhdLmxheWVyc31cbiAgICAgICAgICAgIHBvcG92ZXJPZmZzZXQ9e3tsZWZ0OiAwLCB0b3A6IDB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICkpO1xuXG4gICAgY29uc3QgY29udGFpbmVyVyA9IG1hcFN0YXRlLndpZHRoICogKE51bWJlcihpc1NwbGl0KSArIDEpO1xuICAgIHJldHVybiAoXG4gICAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhlbWV9PlxuICAgICAgICA8R2xvYmFsU3R5bGVcbiAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJrZXBsZXItZ2xcIlxuICAgICAgICAgIGlkPXtga2VwbGVyLWdsX18ke2lkfWB9XG4gICAgICAgICAgcmVmPXtub2RlID0+IHtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHshbWFwU3RhdGUuaXNGdWxsU2NyZWVuICYmIChcbiAgICAgICAgICAgIDxTaWRlUGFuZWxcbiAgICAgICAgICAgICAgey4uLnNpZGVGaWVsZHN9XG4gICAgICAgICAgICAgIHdpZHRoPXtESU1FTlNJT05TLnNpZGVQYW5lbC53aWR0aH1cbiAgICAgICAgICAgICAgY29udGFpbmVyVz17Y29udGFpbmVyV31cbiAgICAgICAgICAgICAgY29udGFpbmVySD17bWFwU3RhdGUuaGVpZ2h0fVxuICAgICAgICAgICAgICBoZWlnaHQ9e21hcFN0YXRlLmhlaWdodH1cbiAgICAgICAgICAgICAgcm9vdE5vZGU9e3RoaXMucm9vdH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcHNcIiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4J319PlxuICAgICAgICAgICAge21hcENvbnRhaW5lcnN9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEJvdHRvbVdpZGdldFxuICAgICAgICAgICAgZmlsdGVycz17ZmlsdGVyc31cbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIHVpU3RhdGU9e3VpU3RhdGV9XG4gICAgICAgICAgICB2aXNTdGF0ZUFjdGlvbnM9e3Zpc1N0YXRlQWN0aW9uc31cbiAgICAgICAgICAgIHNpZGVQYW5lbFdpZHRoPXtESU1FTlNJT05TLnNpZGVQYW5lbC53aWR0aCAtIERJTUVOU0lPTlMuc2lkZVBhbmVsLm1hcmdpbn1cbiAgICAgICAgICAgIGNvbnRhaW5lclc9e2NvbnRhaW5lcld9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9HbG9iYWxTdHlsZT5cbiAgICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgICApO1xuICB9XG59XG5cbktlcGxlckdMLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlLCBwcm9wcykge1xuICByZXR1cm4ge1xuICAgIC4uLnByb3BzLFxuICAgIC4uLnN0YXRlLnZpc1N0YXRlLFxuICAgIGJ1aWxkaW5nRGF0YTogc3RhdGUuYnVpbGRpbmdEYXRhLmJ1aWxkaW5nRGF0YSxcbiAgICBtYXBTdHlsZTogc3RhdGUubWFwU3R5bGUsXG4gICAgbWFwU3RhdGU6IHN0YXRlLm1hcFN0YXRlLFxuICAgIHVpU3RhdGU6IHN0YXRlLnVpU3RhdGVcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoLCBvd25Qcm9wcykge1xuICBjb25zdCB1c2VyQWN0aW9ucyA9IG93blByb3BzLmFjdGlvbnMgfHwge307XG5cbiAgY29uc3QgW1xuICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICBtYXBTdGF0ZUFjdGlvbnMsXG4gICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgIGJ1aWxkaW5nRGF0YUFjdGlvbnMsXG4gICAgdWlTdGF0ZUFjdGlvbnNcbiAgXSA9IFtcbiAgICBWaXNTdGF0ZUFjdGlvbnMsXG4gICAgTWFwU3RhdGVBY3Rpb25zLFxuICAgIE1hcFN0eWxlQWN0aW9ucyxcbiAgICBCdWlsZGluZ0RhdGFBY3Rpb25zLFxuICAgIFVJU3RhdGVBY3Rpb25zXG4gIF0ubWFwKGFjdGlvbnMgPT5cbiAgICBiaW5kQWN0aW9uQ3JlYXRvcnMobWVyZ2VBY3Rpb25zKGFjdGlvbnMsIHVzZXJBY3Rpb25zKSwgZGlzcGF0Y2gpXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgbWFwU3RhdGVBY3Rpb25zLFxuICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICBidWlsZGluZ0RhdGFBY3Rpb25zLFxuICAgIHVpU3RhdGVBY3Rpb25zLFxuICAgIGRpc3BhdGNoXG4gIH07XG59XG5cbi8qKlxuICogT3ZlcnJpZGUgZGVmYXVsdCBtYXBzLWdsIGFjdGlvbnMgd2l0aCB1c2VyIGRlZmluZWQgYWN0aW9ucyB1c2luZyB0aGUgc2FtZSBrZXlcbiAqL1xuZnVuY3Rpb24gbWVyZ2VBY3Rpb25zKGFjdGlvbnMsIHVzZXJBY3Rpb25zKSB7XG4gIGNvbnN0IG92ZXJyaWRlcyA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBpbiB1c2VyQWN0aW9ucykge1xuICAgIGlmICh1c2VyQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGFjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgb3ZlcnJpZGVzW2tleV0gPSB1c2VyQWN0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7Li4uYWN0aW9ucywgLi4ub3ZlcnJpZGVzfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQga2VwbGVyR2xDb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShLZXBsZXJHTCk7XG4iXX0=