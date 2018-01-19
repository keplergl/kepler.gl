'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  right: 0;\n  width: ', 'px;\n  padding: ', 'px;\n  z-index: 1;\n  top: ', 'px;\n  position: absolute;\n'], ['\n  right: 0;\n  width: ', 'px;\n  padding: ', 'px;\n  z-index: 1;\n  top: ', 'px;\n  position: absolute;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 4px 0;\n  display: flex;\n  justify-content: flex-end;\n'], ['\n  padding: 4px 0;\n  display: flex;\n  justify-content: flex-end;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 18px;\n  border: 0;\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  color: ', ';\n  cursor: pointer;\n  display: flex;\n  height: 36px;\n  justify-content: center;\n  margin: 0;\n  outline: none;\n  padding: 0;\n  transition: ', ';\n  width: 36px;\n\n  :focus {\n    outline: none;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 18px;\n  border: 0;\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  color: ', ';\n  cursor: pointer;\n  display: flex;\n  height: 36px;\n  justify-content: center;\n  margin: 0;\n  outline: none;\n  padding: 0;\n  transition: ', ';\n  width: 36px;\n\n  :focus {\n    outline: none;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n'], ['\n  background-color: ', ';\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' max-height: 500px;\n  min-height: 100px;\n  overflow: overlay;\n'], ['\n  ', ' max-height: 500px;\n  min-height: 100px;\n  overflow: overlay;\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: space-between;\n  background-color: ', ';\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ', ';\n\n  button {\n    width: 18px;\n    height: 18px;\n  }\n'], ['\n  display: flex;\n  justify-content: space-between;\n  background-color: ', ';\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ', ';\n\n  button {\n    width: 18px;\n    height: 18px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reselect = require('reselect');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('./common/styled-components');

var _mapLayerSelector = require('./common/map-layer-selector');

var _mapLayerSelector2 = _interopRequireDefault(_mapLayerSelector);

var _mapLegend = require('./map-legend');

var _mapLegend2 = _interopRequireDefault(_mapLegend);

var _icons = require('./common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledMapControl = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.mapControlWidth;
}, function (props) {
  return props.theme.mapControlPadding;
}, function (props) {
  return props.top;
});

var StyledMapControlAction = _styledComponents2.default.div(_templateObject2);

var StyledMapControlButton = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.active ? props.theme.secondaryBtnActBgd : props.theme.secondaryBtnBgd;
}, function (props) {
  return props.active ? props.theme.secondaryBtnActColor : props.theme.secondaryBtnColor;
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.theme.secondaryBtnActBgd;
}, function (props) {
  return props.theme.secondaryBtnActColor;
});

var StyledMapControlPanel = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.mapPanelBackgroundColor;
});

var StyledMapControlPanelContent = _styledComponents2.default.div(_templateObject5, function (props) {
  return props.theme.dropdownScrollBar;
});

var StyledMapControlPanelHeader = _styledComponents2.default.div(_templateObject6, function (props) {
  return props.theme.mapPanelHeaderBackgroundColor;
}, function (props) {
  return props.theme.secondaryBtnColor;
});

var propTypes = {
  dragRotate: _react2.default.PropTypes.bool.isRequired,
  isFullScreen: _react2.default.PropTypes.bool.isRequired,
  isSplit: _react2.default.PropTypes.bool.isRequired,
  onToggleFullScreen: _react2.default.PropTypes.func.isRequired,
  onTogglePerspective: _react2.default.PropTypes.func.isRequired,
  onToggleSplitMap: _react2.default.PropTypes.func.isRequired,
  top: _react2.default.PropTypes.number.isRequired
};

var defaultProps = {
  isFullScreen: false,
  isSplit: false,
  top: 0
};

/**
 * Generates all layers available for the current map
 * TODO: this may be moved into map-container or map-control or even at the reducer level
 * @param layers
 * @param mapLayers
 * @returns {[id, label, isVisible]}
 */
var layerSelector = function layerSelector(layers, mapLayers) {
  var availableItems = Object.keys(layers).reduce(function (availableLayers, currentLayerId) {
    // is available ? if yes add to available list
    var currentLayer = layers[currentLayerId];
    // if maplayers exists we need to make sure currentlayer
    // is contained in mapLayers in order to add onto availableLayers
    // otherwise we add all layers

    var layerConfig = mapLayers ? mapLayers[currentLayer.id] : currentLayer.config;

    var mustBeAdded = mapLayers && mapLayers[currentLayer.id] ? mapLayers[currentLayer.id].isAvailable : layerConfig.isVisible;

    return mustBeAdded ? [].concat(availableLayers, [{
      id: currentLayer.id,
      name: currentLayer.config.label,
      isVisible: mapLayers && mapLayers[currentLayer.id] ? mapLayers[currentLayer.id].isVisible : layerConfig.isVisible,
      layer: currentLayer
    }]) : availableLayers;
  }, []);

  return availableItems;
};

var MapControl = function (_Component) {
  (0, _inherits3.default)(MapControl, _Component);

  function MapControl(props) {
    (0, _classCallCheck3.default)(this, MapControl);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _this.layerSelector = function (state) {
      return state.layers;
    };

    _this.mapLayersSelector = function (state) {
      return state.mapLayers;
    };

    _this.initialDataSelector = (0, _reselect.createSelector)(_this.layerSelector, _this.mapLayersSelector, layerSelector);

    _this.state = {
      areLayersVisible: false,
      isLegendVisible: false
    };
    return _this;
  }

  // if one panel is already open and user tries to open a new one well the previous one will be closed
  MapControl.prototype._toggleMenuPanel = function _toggleMenuPanel(panelId) {
    var _setState;

    this.setState((_setState = {
      areLayersVisible: false,
      isLegendVisible: false
    }, _setState[panelId] = !this.state[panelId], _setState));
  };

  MapControl.prototype._renderLayerSelector = function _renderLayerSelector(items) {
    var _this2 = this;

    var onMapToggleLayer = this.props.onMapToggleLayer;
    var areLayersVisible = this.state.areLayersVisible;


    return !areLayersVisible ? _react2.default.createElement(
      StyledMapControlButton,
      {
        key: 1,
        onClick: function onClick(e) {
          e.preventDefault();
          _this2._toggleMenuPanel('areLayersVisible');
        },
        'data-tip': true,
        'data-for': 'toggle-layer'
      },
      _react2.default.createElement(_icons.Layers, { height: '22px' }),
      _react2.default.createElement(MapLegendTooltip, {
        id: 'toggle-layer',
        message: areLayersVisible ? 'Hide layer panel' : 'Show layer panel'
      })
    ) : _react2.default.createElement(
      MapControlPanel,
      {
        header: 'Visible layers',
        onClick: function onClick() {
          return _this2._toggleMenuPanel('areLayersVisible');
        }
      },
      _react2.default.createElement(_mapLayerSelector2.default, { layers: items, onMapToggleLayer: onMapToggleLayer })
    );
  };

  MapControl.prototype._renderLegend = function _renderLegend(items) {
    var _this3 = this;

    var isLegendVisible = this.state.isLegendVisible;

    return !isLegendVisible ? _react2.default.createElement(
      StyledMapControlButton,
      {
        key: 2,
        className: 'legend',
        'data-tip': true,
        'data-for': 'show-legend',
        onClick: function onClick(e) {
          e.preventDefault();
          _this3._toggleMenuPanel('isLegendVisible');
        }
      },
      _react2.default.createElement(_icons.Legend, { height: '22px' }),
      _react2.default.createElement(MapLegendTooltip, { id: 'show-legend', message: 'show legend' })
    ) : _react2.default.createElement(
      MapControlPanel,
      {
        header: 'Layer Legend',
        onClick: function onClick() {
          return _this3._toggleMenuPanel('isLegendVisible');
        }
      },
      _react2.default.createElement(_mapLegend2.default, {
        layers: items.filter(function (item) {
          return item.isVisible;
        }).map(function (item) {
          return item.layer;
        })
      })
    );
  };

  MapControl.prototype.render = function render() {
    var items = this.initialDataSelector(this.props);

    if (!items) {
      return null;
    }

    var _props = this.props,
        dragRotate = _props.dragRotate,
        isFullScreen = _props.isFullScreen,
        isSplit = _props.isSplit,
        mapIndex = _props.mapIndex,
        onToggleFullScreen = _props.onToggleFullScreen,
        onTogglePerspective = _props.onTogglePerspective,
        onToggleSplitMap = _props.onToggleSplitMap;


    return _react2.default.createElement(
      StyledMapControl,
      { className: 'map-control' },
      _react2.default.createElement(
        ActionPanel,
        { key: 0 },
        _react2.default.createElement(
          StyledMapControlButton,
          {
            active: isSplit,
            onClick: function onClick(e) {
              e.preventDefault();
              onToggleSplitMap(isSplit ? mapIndex : undefined);
            },
            'data-tip': true,
            'data-for': 'action-toggle_' + mapIndex
          },
          isSplit ? _react2.default.createElement(_icons.Delete, { height: '18px' }) : _react2.default.createElement(_icons.Split, { height: '18px' }),
          _react2.default.createElement(MapLegendTooltip, {
            id: 'action-toggle_' + mapIndex,
            message: isSplit ? 'Close current panel' : 'Switch to dual map view'
          })
        )
      ),
      isSplit && _react2.default.createElement(
        ActionPanel,
        { key: 1 },
        this._renderLayerSelector(items)
      ),
      _react2.default.createElement(
        ActionPanel,
        { key: 2 },
        _react2.default.createElement(
          StyledMapControlButton,
          {
            onClick: function onClick(e) {
              e.preventDefault();
              onTogglePerspective();
            },
            active: dragRotate,
            'data-tip': true,
            'data-for': 'action-3d'
          },
          _react2.default.createElement(_icons.Cube3d, { height: '22px' }),
          _react2.default.createElement(MapLegendTooltip, {
            id: 'action-3d',
            message: dragRotate ? 'Disable 3D Map' : '3D Map'
          })
        )
      ),
      _react2.default.createElement(
        ActionPanel,
        { key: 3 },
        this._renderLegend(items)
      ),
      _react2.default.createElement(
        ActionPanel,
        { key: 4 },
        _react2.default.createElement(
          StyledMapControlButton,
          {
            onClick: function onClick(e) {
              e.preventDefault();
              onToggleFullScreen();
            },
            active: isFullScreen,
            'data-tip': true,
            'data-for': 'action-fullscreen_' + mapIndex + '_' + isFullScreen
          },
          isFullScreen ? _react2.default.createElement(_icons.Reduce, { height: '22px' }) : _react2.default.createElement(_icons.Expand, { height: '22px' }),
          _react2.default.createElement(MapLegendTooltip, {
            id: 'action-fullscreen_' + mapIndex + '_' + isFullScreen,
            message: !isFullScreen ? 'Go full screen' : 'Exit full screen'
          })
        )
      )
    );
  };

  return MapControl;
}(_react.Component);

MapControl.propTypes = propTypes;
MapControl.defaultProps = defaultProps;

exports.default = MapControl;


var MapControlPanel = function MapControlPanel(_ref) {
  var children = _ref.children,
      header = _ref.header,
      onClick = _ref.onClick;
  return _react2.default.createElement(
    StyledMapControlPanel,
    null,
    _react2.default.createElement(
      StyledMapControlPanelHeader,
      { style: { position: 'relative' } },
      _react2.default.createElement(
        'span',
        { style: { verticalAlign: 'middle' } },
        header
      ),
      _react2.default.createElement(
        _styledComponents3.IconRoundSmall,
        null,
        _react2.default.createElement(_icons.Close, { height: '16px', onClick: onClick })
      )
    ),
    _react2.default.createElement(
      StyledMapControlPanelContent,
      null,
      children
    )
  );
};

var ActionPanel = function ActionPanel(_ref2) {
  var children = _ref2.children;
  return _react2.default.createElement(
    StyledMapControlAction,
    null,
    children
  );
};

var MapLegendTooltip = function MapLegendTooltip(_ref3) {
  var id = _ref3.id,
      message = _ref3.message;
  return _react2.default.createElement(
    _styledComponents3.Tooltip,
    { id: id, place: 'left', effect: 'solid' },
    _react2.default.createElement(
      'span',
      null,
      message
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250cm9sLmpzIl0sIm5hbWVzIjpbIlN0eWxlZE1hcENvbnRyb2wiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwibWFwQ29udHJvbFdpZHRoIiwibWFwQ29udHJvbFBhZGRpbmciLCJ0b3AiLCJTdHlsZWRNYXBDb250cm9sQWN0aW9uIiwiU3R5bGVkTWFwQ29udHJvbEJ1dHRvbiIsImFjdGl2ZSIsInNlY29uZGFyeUJ0bkFjdEJnZCIsInNlY29uZGFyeUJ0bkJnZCIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwic2Vjb25kYXJ5QnRuQ29sb3IiLCJ0cmFuc2l0aW9uIiwiU3R5bGVkTWFwQ29udHJvbFBhbmVsIiwibWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3IiLCJTdHlsZWRNYXBDb250cm9sUGFuZWxDb250ZW50IiwiZHJvcGRvd25TY3JvbGxCYXIiLCJTdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXIiLCJtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvciIsInByb3BUeXBlcyIsImRyYWdSb3RhdGUiLCJQcm9wVHlwZXMiLCJib29sIiwiaXNSZXF1aXJlZCIsImlzRnVsbFNjcmVlbiIsImlzU3BsaXQiLCJvblRvZ2dsZUZ1bGxTY3JlZW4iLCJmdW5jIiwib25Ub2dnbGVQZXJzcGVjdGl2ZSIsIm9uVG9nZ2xlU3BsaXRNYXAiLCJudW1iZXIiLCJkZWZhdWx0UHJvcHMiLCJsYXllclNlbGVjdG9yIiwibGF5ZXJzIiwibWFwTGF5ZXJzIiwiYXZhaWxhYmxlSXRlbXMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYXZhaWxhYmxlTGF5ZXJzIiwiY3VycmVudExheWVySWQiLCJjdXJyZW50TGF5ZXIiLCJsYXllckNvbmZpZyIsImlkIiwiY29uZmlnIiwibXVzdEJlQWRkZWQiLCJpc0F2YWlsYWJsZSIsImlzVmlzaWJsZSIsIm5hbWUiLCJsYWJlbCIsImxheWVyIiwiTWFwQ29udHJvbCIsInN0YXRlIiwibWFwTGF5ZXJzU2VsZWN0b3IiLCJpbml0aWFsRGF0YVNlbGVjdG9yIiwiYXJlTGF5ZXJzVmlzaWJsZSIsImlzTGVnZW5kVmlzaWJsZSIsIl90b2dnbGVNZW51UGFuZWwiLCJwYW5lbElkIiwic2V0U3RhdGUiLCJfcmVuZGVyTGF5ZXJTZWxlY3RvciIsIml0ZW1zIiwib25NYXBUb2dnbGVMYXllciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIl9yZW5kZXJMZWdlbmQiLCJmaWx0ZXIiLCJpdGVtIiwibWFwIiwicmVuZGVyIiwibWFwSW5kZXgiLCJ1bmRlZmluZWQiLCJNYXBDb250cm9sUGFuZWwiLCJjaGlsZHJlbiIsImhlYWRlciIsIm9uQ2xpY2siLCJwb3NpdGlvbiIsInZlcnRpY2FsQWxpZ24iLCJBY3Rpb25QYW5lbCIsIk1hcExlZ2VuZFRvb2x0aXAiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFXQSxJQUFNQSxtQkFBbUIsMkJBQU9DLEdBQTFCLGtCQUVLO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxlQUFyQjtBQUFBLENBRkwsRUFHTztBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsaUJBQXJCO0FBQUEsQ0FIUCxFQUtHO0FBQUEsU0FBU0gsTUFBTUksR0FBZjtBQUFBLENBTEgsQ0FBTjs7QUFTQSxJQUFNQyx5QkFBeUIsMkJBQU9OLEdBQWhDLGtCQUFOOztBQU1BLElBQU1PLHlCQUF5QiwyQkFBT1AsR0FBaEMsbUJBRWdCO0FBQUEsU0FDbEJDLE1BQU1PLE1BQU4sR0FDSVAsTUFBTUMsS0FBTixDQUFZTyxrQkFEaEIsR0FFSVIsTUFBTUMsS0FBTixDQUFZUSxlQUhFO0FBQUEsQ0FGaEIsRUFTSztBQUFBLFNBQ1BULE1BQU1PLE1BQU4sR0FDSVAsTUFBTUMsS0FBTixDQUFZUyxvQkFEaEIsR0FFSVYsTUFBTUMsS0FBTixDQUFZVSxpQkFIVDtBQUFBLENBVEws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QUVwQyxFQUFGLFNBQUVBLEVBQUY7QUFBQSxNQUFNcUMsT0FBTixTQUFNQSxPQUFOO0FBQUEsU0FDdkI7QUFBQTtBQUFBLE1BQVMsSUFBSXJDLEVBQWIsRUFBaUIsT0FBTSxNQUF2QixFQUE4QixRQUFPLE9BQXJDO0FBQ0U7QUFBQTtBQUFBO0FBQU9xQztBQUFQO0FBREYsR0FEdUI7QUFBQSxDQUF6QiIsImZpbGUiOiJtYXAtY29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCB7VG9vbHRpcCwgSWNvblJvdW5kU21hbGx9IGZyb20gJy4vY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBNYXBMYXllclNlbGVjdG9yIGZyb20gJy4vY29tbW9uL21hcC1sYXllci1zZWxlY3Rvcic7XG5pbXBvcnQgTWFwTGVnZW5kIGZyb20gJy4vbWFwLWxlZ2VuZCc7XG5pbXBvcnQge1xuICBDbG9zZSxcbiAgUmVkdWNlLFxuICBFeHBhbmQsXG4gIFNwbGl0LFxuICBMZWdlbmQsXG4gIEN1YmUzZCxcbiAgRGVsZXRlLFxuICBMYXllcnNcbn0gZnJvbSAnLi9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBTdHlsZWRNYXBDb250cm9sID0gc3R5bGVkLmRpdmBcbiAgcmlnaHQ6IDA7XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2xXaWR0aH1weDtcbiAgcGFkZGluZzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBDb250cm9sUGFkZGluZ31weDtcbiAgei1pbmRleDogMTtcbiAgdG9wOiAke3Byb3BzID0+IHByb3BzLnRvcH1weDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbEFjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDRweCAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbEJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5hY3RpdmVcbiAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0QmdkXG4gICAgICA6IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkJnZH07XG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gIGJvcmRlcjogMDtcbiAgYm94LXNoYWRvdzogMCA2cHggMTJweCAwIHJnYmEoMCwgMCwgMCwgMC4xNik7XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkFjdENvbG9yXG4gICAgICA6IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW46IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHdpZHRoOiAzNnB4O1xuXG4gIDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0QmdkfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5BY3RDb2xvcn07XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbCA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3J9O1xuICBmbGV4LWdyb3c6IDE7XG4gIHotaW5kZXg6IDE7XG4gIHAge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duU2Nyb2xsQmFyfSBtYXgtaGVpZ2h0OiA1MDBweDtcbiAgbWluLWhlaWdodDogMTAwcHg7XG4gIG92ZXJmbG93OiBvdmVybGF5O1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbFBhbmVsSGVhZGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcFBhbmVsSGVhZGVyQmFja2dyb3VuZENvbG9yfTtcbiAgaGVpZ2h0OiAzMnB4O1xuICBwYWRkaW5nOiA2cHggMTJweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5Db2xvcn07XG5cbiAgYnV0dG9uIHtcbiAgICB3aWR0aDogMThweDtcbiAgICBoZWlnaHQ6IDE4cHg7XG4gIH1cbmA7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZHJhZ1JvdGF0ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgaXNGdWxsU2NyZWVuOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBpc1NwbGl0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvblRvZ2dsZUZ1bGxTY3JlZW46IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uVG9nZ2xlUGVyc3BlY3RpdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uVG9nZ2xlU3BsaXRNYXA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHRvcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlzRnVsbFNjcmVlbjogZmFsc2UsXG4gIGlzU3BsaXQ6IGZhbHNlLFxuICB0b3A6IDBcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGFsbCBsYXllcnMgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBtYXBcbiAqIFRPRE86IHRoaXMgbWF5IGJlIG1vdmVkIGludG8gbWFwLWNvbnRhaW5lciBvciBtYXAtY29udHJvbCBvciBldmVuIGF0IHRoZSByZWR1Y2VyIGxldmVsXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcGFyYW0gbWFwTGF5ZXJzXG4gKiBAcmV0dXJucyB7W2lkLCBsYWJlbCwgaXNWaXNpYmxlXX1cbiAqL1xuY29uc3QgbGF5ZXJTZWxlY3RvciA9IChsYXllcnMsIG1hcExheWVycykgPT4ge1xuICBjb25zdCBhdmFpbGFibGVJdGVtcyA9IE9iamVjdC5rZXlzKGxheWVycykucmVkdWNlKFxuICAgIChhdmFpbGFibGVMYXllcnMsIGN1cnJlbnRMYXllcklkKSA9PiB7XG4gICAgICAvLyBpcyBhdmFpbGFibGUgPyBpZiB5ZXMgYWRkIHRvIGF2YWlsYWJsZSBsaXN0XG4gICAgICBjb25zdCBjdXJyZW50TGF5ZXIgPSBsYXllcnNbY3VycmVudExheWVySWRdO1xuICAgICAgLy8gaWYgbWFwbGF5ZXJzIGV4aXN0cyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSBjdXJyZW50bGF5ZXJcbiAgICAgIC8vIGlzIGNvbnRhaW5lZCBpbiBtYXBMYXllcnMgaW4gb3JkZXIgdG8gYWRkIG9udG8gYXZhaWxhYmxlTGF5ZXJzXG4gICAgICAvLyBvdGhlcndpc2Ugd2UgYWRkIGFsbCBsYXllcnNcblxuICAgICAgY29uc3QgbGF5ZXJDb25maWcgPSBtYXBMYXllcnNcbiAgICAgICAgPyBtYXBMYXllcnNbY3VycmVudExheWVyLmlkXVxuICAgICAgICA6IGN1cnJlbnRMYXllci5jb25maWc7XG5cbiAgICAgIGNvbnN0IG11c3RCZUFkZGVkID1cbiAgICAgICAgbWFwTGF5ZXJzICYmIG1hcExheWVyc1tjdXJyZW50TGF5ZXIuaWRdXG4gICAgICAgICAgPyBtYXBMYXllcnNbY3VycmVudExheWVyLmlkXS5pc0F2YWlsYWJsZVxuICAgICAgICAgIDogbGF5ZXJDb25maWcuaXNWaXNpYmxlO1xuXG4gICAgICByZXR1cm4gbXVzdEJlQWRkZWRcbiAgICAgICAgPyBbXG4gICAgICAgICAgICAuLi5hdmFpbGFibGVMYXllcnMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBjdXJyZW50TGF5ZXIuaWQsXG4gICAgICAgICAgICAgIG5hbWU6IGN1cnJlbnRMYXllci5jb25maWcubGFiZWwsXG4gICAgICAgICAgICAgIGlzVmlzaWJsZTpcbiAgICAgICAgICAgICAgICBtYXBMYXllcnMgJiYgbWFwTGF5ZXJzW2N1cnJlbnRMYXllci5pZF1cbiAgICAgICAgICAgICAgICAgID8gbWFwTGF5ZXJzW2N1cnJlbnRMYXllci5pZF0uaXNWaXNpYmxlXG4gICAgICAgICAgICAgICAgICA6IGxheWVyQ29uZmlnLmlzVmlzaWJsZSxcbiAgICAgICAgICAgICAgbGF5ZXI6IGN1cnJlbnRMYXllclxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgOiBhdmFpbGFibGVMYXllcnM7XG4gICAgfSxcbiAgICBbXVxuICApO1xuXG4gIHJldHVybiBhdmFpbGFibGVJdGVtcztcbn07XG5cbmNsYXNzIE1hcENvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYXJlTGF5ZXJzVmlzaWJsZTogZmFsc2UsXG4gICAgICBpc0xlZ2VuZFZpc2libGU6IGZhbHNlXG4gICAgfTtcbiAgfVxuICBsYXllclNlbGVjdG9yID0gc3RhdGUgPT4gc3RhdGUubGF5ZXJzO1xuICBtYXBMYXllcnNTZWxlY3RvciA9IHN0YXRlID0+IHN0YXRlLm1hcExheWVycztcblxuICBpbml0aWFsRGF0YVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5sYXllclNlbGVjdG9yLFxuICAgIHRoaXMubWFwTGF5ZXJzU2VsZWN0b3IsXG4gICAgbGF5ZXJTZWxlY3RvclxuICApO1xuXG4gIC8vIGlmIG9uZSBwYW5lbCBpcyBhbHJlYWR5IG9wZW4gYW5kIHVzZXIgdHJpZXMgdG8gb3BlbiBhIG5ldyBvbmUgd2VsbCB0aGUgcHJldmlvdXMgb25lIHdpbGwgYmUgY2xvc2VkXG4gIF90b2dnbGVNZW51UGFuZWwocGFuZWxJZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYXJlTGF5ZXJzVmlzaWJsZTogZmFsc2UsXG4gICAgICBpc0xlZ2VuZFZpc2libGU6IGZhbHNlLFxuICAgICAgW3BhbmVsSWRdOiAhdGhpcy5zdGF0ZVtwYW5lbElkXVxuICAgIH0pO1xuICB9XG5cbiAgX3JlbmRlckxheWVyU2VsZWN0b3IoaXRlbXMpIHtcbiAgICBjb25zdCB7b25NYXBUb2dnbGVMYXllcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHthcmVMYXllcnNWaXNpYmxlfSA9IHRoaXMuc3RhdGU7XG5cbiAgICByZXR1cm4gIWFyZUxheWVyc1Zpc2libGUgPyAoXG4gICAgICA8U3R5bGVkTWFwQ29udHJvbEJ1dHRvblxuICAgICAgICBrZXk9ezF9XG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl90b2dnbGVNZW51UGFuZWwoJ2FyZUxheWVyc1Zpc2libGUnKTtcbiAgICAgICAgfX1cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJ0b2dnbGUtbGF5ZXJcIlxuICAgICAgPlxuICAgICAgICA8TGF5ZXJzIGhlaWdodD1cIjIycHhcIiAvPlxuICAgICAgICA8TWFwTGVnZW5kVG9vbHRpcFxuICAgICAgICAgIGlkPVwidG9nZ2xlLWxheWVyXCJcbiAgICAgICAgICBtZXNzYWdlPXthcmVMYXllcnNWaXNpYmxlID8gJ0hpZGUgbGF5ZXIgcGFuZWwnIDogJ1Nob3cgbGF5ZXIgcGFuZWwnfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICkgOiAoXG4gICAgICA8TWFwQ29udHJvbFBhbmVsXG4gICAgICAgIGhlYWRlcj17J1Zpc2libGUgbGF5ZXJzJ31cbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5fdG9nZ2xlTWVudVBhbmVsKCdhcmVMYXllcnNWaXNpYmxlJyl9XG4gICAgICA+XG4gICAgICAgIDxNYXBMYXllclNlbGVjdG9yIGxheWVycz17aXRlbXN9IG9uTWFwVG9nZ2xlTGF5ZXI9e29uTWFwVG9nZ2xlTGF5ZXJ9IC8+XG4gICAgICA8L01hcENvbnRyb2xQYW5lbD5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckxlZ2VuZChpdGVtcykge1xuICAgIGNvbnN0IHtpc0xlZ2VuZFZpc2libGV9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gIWlzTGVnZW5kVmlzaWJsZSA/IChcbiAgICAgIDxTdHlsZWRNYXBDb250cm9sQnV0dG9uXG4gICAgICAgIGtleT17Mn1cbiAgICAgICAgY2xhc3NOYW1lPXsnbGVnZW5kJ31cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJzaG93LWxlZ2VuZFwiXG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl90b2dnbGVNZW51UGFuZWwoJ2lzTGVnZW5kVmlzaWJsZScpO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8TGVnZW5kIGhlaWdodD1cIjIycHhcIiAvPlxuICAgICAgICA8TWFwTGVnZW5kVG9vbHRpcCBpZD1cInNob3ctbGVnZW5kXCIgbWVzc2FnZT17J3Nob3cgbGVnZW5kJ30gLz5cbiAgICAgIDwvU3R5bGVkTWFwQ29udHJvbEJ1dHRvbj5cbiAgICApIDogKFxuICAgICAgPE1hcENvbnRyb2xQYW5lbFxuICAgICAgICBoZWFkZXI9eydMYXllciBMZWdlbmQnfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLl90b2dnbGVNZW51UGFuZWwoJ2lzTGVnZW5kVmlzaWJsZScpfVxuICAgICAgPlxuICAgICAgICA8TWFwTGVnZW5kXG4gICAgICAgICAgbGF5ZXJzPXtpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmlzVmlzaWJsZSkubWFwKGl0ZW0gPT4gaXRlbS5sYXllcil9XG4gICAgICAgIC8+XG4gICAgICA8L01hcENvbnRyb2xQYW5lbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pbml0aWFsRGF0YVNlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgaWYgKCFpdGVtcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgZHJhZ1JvdGF0ZSxcbiAgICAgIGlzRnVsbFNjcmVlbixcbiAgICAgIGlzU3BsaXQsXG4gICAgICBtYXBJbmRleCxcbiAgICAgIG9uVG9nZ2xlRnVsbFNjcmVlbixcbiAgICAgIG9uVG9nZ2xlUGVyc3BlY3RpdmUsXG4gICAgICBvblRvZ2dsZVNwbGl0TWFwXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZE1hcENvbnRyb2wgY2xhc3NOYW1lPXsnbWFwLWNvbnRyb2wnfT5cbiAgICAgICAgey8qIFNwbGl0IE1hcCAqL31cbiAgICAgICAgPEFjdGlvblBhbmVsIGtleT17MH0+XG4gICAgICAgICAgPFN0eWxlZE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAgICAgIGFjdGl2ZT17aXNTcGxpdH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIG9uVG9nZ2xlU3BsaXRNYXAoaXNTcGxpdCA/IG1hcEluZGV4IDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgICAgZGF0YS1mb3I9e2BhY3Rpb24tdG9nZ2xlXyR7bWFwSW5kZXh9YH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNTcGxpdCA/IDxEZWxldGUgaGVpZ2h0PXsnMThweCd9IC8+IDogPFNwbGl0IGhlaWdodD17JzE4cHgnfSAvPn1cbiAgICAgICAgICAgIDxNYXBMZWdlbmRUb29sdGlwXG4gICAgICAgICAgICAgIGlkPXtgYWN0aW9uLXRvZ2dsZV8ke21hcEluZGV4fWB9XG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xuICAgICAgICAgICAgICAgIGlzU3BsaXQgPyAnQ2xvc2UgY3VycmVudCBwYW5lbCcgOiAnU3dpdGNoIHRvIGR1YWwgbWFwIHZpZXcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICB7LyogTWFwIExheWVycyAqL31cbiAgICAgICAge2lzU3BsaXQgJiYgKFxuICAgICAgICAgIDxBY3Rpb25QYW5lbCBrZXk9ezF9Pnt0aGlzLl9yZW5kZXJMYXllclNlbGVjdG9yKGl0ZW1zKX08L0FjdGlvblBhbmVsPlxuICAgICAgICApfVxuICAgICAgICB7LyogM0QgTWFwICovfVxuICAgICAgICA8QWN0aW9uUGFuZWwga2V5PXsyfT5cbiAgICAgICAgICA8U3R5bGVkTWFwQ29udHJvbEJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgb25Ub2dnbGVQZXJzcGVjdGl2ZSgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGFjdGl2ZT17ZHJhZ1JvdGF0ZX1cbiAgICAgICAgICAgIGRhdGEtdGlwXG4gICAgICAgICAgICBkYXRhLWZvcj1cImFjdGlvbi0zZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEN1YmUzZCBoZWlnaHQ9eycyMnB4J30gLz5cbiAgICAgICAgICAgIHsvKiBObyBpY29uIHNpbmNlIHdlIGFyZSBpbmplY3RpbmcgdGhyb3VnaCBjc3MgLnRocmVlRC1tYXAgY2xhc3MqL31cbiAgICAgICAgICAgIDxNYXBMZWdlbmRUb29sdGlwXG4gICAgICAgICAgICAgIGlkPVwiYWN0aW9uLTNkXCJcbiAgICAgICAgICAgICAgbWVzc2FnZT17ZHJhZ1JvdGF0ZSA/ICdEaXNhYmxlIDNEIE1hcCcgOiAnM0QgTWFwJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICB7LyogTWFwIExlZ2VuZCAqL31cbiAgICAgICAgPEFjdGlvblBhbmVsIGtleT17M30+e3RoaXMuX3JlbmRlckxlZ2VuZChpdGVtcyl9PC9BY3Rpb25QYW5lbD5cbiAgICAgICAgey8qIEZ1bGwgU2NyZWVuICovfVxuICAgICAgICA8QWN0aW9uUGFuZWwga2V5PXs0fT5cbiAgICAgICAgICA8U3R5bGVkTWFwQ29udHJvbEJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgb25Ub2dnbGVGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgYWN0aXZlPXtpc0Z1bGxTY3JlZW59XG4gICAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgICAgZGF0YS1mb3I9e2BhY3Rpb24tZnVsbHNjcmVlbl8ke21hcEluZGV4fV8ke2lzRnVsbFNjcmVlbn1gfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpc0Z1bGxTY3JlZW4gPyAoXG4gICAgICAgICAgICAgIDxSZWR1Y2UgaGVpZ2h0PXsnMjJweCd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8RXhwYW5kIGhlaWdodD17JzIycHgnfSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxNYXBMZWdlbmRUb29sdGlwXG4gICAgICAgICAgICAgIGlkPXtgYWN0aW9uLWZ1bGxzY3JlZW5fJHttYXBJbmRleH1fJHtpc0Z1bGxTY3JlZW59YH1cbiAgICAgICAgICAgICAgbWVzc2FnZT17IWlzRnVsbFNjcmVlbiA/ICdHbyBmdWxsIHNjcmVlbicgOiAnRXhpdCBmdWxsIHNjcmVlbid9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3R5bGVkTWFwQ29udHJvbEJ1dHRvbj5cbiAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgIDwvU3R5bGVkTWFwQ29udHJvbD5cbiAgICApO1xuICB9XG59XG5cbk1hcENvbnRyb2wucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuTWFwQ29udHJvbC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcENvbnRyb2w7XG5cbmNvbnN0IE1hcENvbnRyb2xQYW5lbCA9ICh7Y2hpbGRyZW4sIGhlYWRlciwgb25DbGlja30pID0+IChcbiAgPFN0eWxlZE1hcENvbnRyb2xQYW5lbD5cbiAgICA8U3R5bGVkTWFwQ29udHJvbFBhbmVsSGVhZGVyIHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgIDxzcGFuIHN0eWxlPXt7dmVydGljYWxBbGlnbjogJ21pZGRsZSd9fT57aGVhZGVyfTwvc3Bhbj5cbiAgICAgIDxJY29uUm91bmRTbWFsbD5cbiAgICAgICAgPENsb3NlIGhlaWdodD1cIjE2cHhcIiBvbkNsaWNrPXtvbkNsaWNrfSAvPlxuICAgICAgPC9JY29uUm91bmRTbWFsbD5cbiAgICA8L1N0eWxlZE1hcENvbnRyb2xQYW5lbEhlYWRlcj5cbiAgICA8U3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudD57Y2hpbGRyZW59PC9TdHlsZWRNYXBDb250cm9sUGFuZWxDb250ZW50PlxuICA8L1N0eWxlZE1hcENvbnRyb2xQYW5lbD5cbik7XG5cbmNvbnN0IEFjdGlvblBhbmVsID0gKHtjaGlsZHJlbn0pID0+IChcbiAgPFN0eWxlZE1hcENvbnRyb2xBY3Rpb24+e2NoaWxkcmVufTwvU3R5bGVkTWFwQ29udHJvbEFjdGlvbj5cbik7XG5cbmNvbnN0IE1hcExlZ2VuZFRvb2x0aXAgPSAoe2lkLCBtZXNzYWdlfSkgPT4gKFxuICA8VG9vbHRpcCBpZD17aWR9IHBsYWNlPVwibGVmdFwiIGVmZmVjdD1cInNvbGlkXCI+XG4gICAgPHNwYW4+e21lc3NhZ2V9PC9zcGFuPlxuICA8L1Rvb2x0aXA+XG4pO1xuIl19