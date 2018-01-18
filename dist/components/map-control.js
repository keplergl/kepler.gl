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
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 18px;\n  border: 0;\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  color: ', ';\n  cursor: pointer;\n  display: flex;\n  height: 36px;\n  justify-content: center;\n  margin: 0;\n  outline: none;\n  padding: 0;\n  transition: ', ';\n  width: 36px;\n\n  :focus {\n    outline: none;\n  }\n  \n  :hover {\n    cursor: pointer;\n    background-color:  ', ';\n    color:  ', ';\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 18px;\n  border: 0;\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  color: ', ';\n  cursor: pointer;\n  display: flex;\n  height: 36px;\n  justify-content: center;\n  margin: 0;\n  outline: none;\n  padding: 0;\n  transition: ', ';\n  width: 36px;\n\n  :focus {\n    outline: none;\n  }\n  \n  :hover {\n    cursor: pointer;\n    background-color:  ', ';\n    color:  ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n'], ['\n  background-color: ', ';\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', '\n  max-height: 500px;\n  min-height: 100px;\n  overflow: overlay;\n'], ['\n  ', '\n  max-height: 500px;\n  min-height: 100px;\n  overflow: overlay;\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: space-between;\n  background-color: ', ';\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ', ';\n  \n  button {\n    width: 18px;\n    height: 18px;\n  }\n'], ['\n  display: flex;\n  justify-content: space-between;\n  background-color: ', ';\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ', ';\n  \n  button {\n    width: 18px;\n    height: 18px;\n  }\n']);

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
          e.preventDefault();_this2._toggleMenuPanel('areLayersVisible');
        },
        'data-tip': true, 'data-for': 'toggle-layer' },
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
        } },
      _react2.default.createElement(_mapLayerSelector2.default, {
        layers: items,
        onMapToggleLayer: onMapToggleLayer
      })
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
        'data-tip': true, 'data-for': 'show-legend',
        onClick: function onClick(e) {
          e.preventDefault();_this3._toggleMenuPanel('isLegendVisible');
        } },
      _react2.default.createElement(_icons.Legend, { height: '22px' }),
      _react2.default.createElement(MapLegendTooltip, {
        id: 'show-legend',
        message: 'show legend'
      })
    ) : _react2.default.createElement(
      MapControlPanel,
      {
        header: 'Layer Legend',
        onClick: function onClick() {
          return _this3._toggleMenuPanel('isLegendVisible');
        } },
      _react2.default.createElement(_mapLegend2.default, { layers: items.filter(function (item) {
          return item.isVisible;
        }).map(function (item) {
          return item.layer;
        }) })
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
              e.preventDefault();onToggleSplitMap(isSplit ? mapIndex : undefined);
            },
            'data-tip': true, 'data-for': 'action-toggle_' + mapIndex },
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
              e.preventDefault();onTogglePerspective();
            },
            active: dragRotate,
            'data-tip': true, 'data-for': 'action-3d' },
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
        {
          key: 4 },
        _react2.default.createElement(
          StyledMapControlButton,
          {
            onClick: function onClick(e) {
              e.preventDefault();onToggleFullScreen();
            },
            active: isFullScreen,
            'data-tip': true, 'data-for': 'action-fullscreen_' + mapIndex + '_' + isFullScreen },
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
    {
      id: id,
      place: 'left',
      effect: 'solid' },
    _react2.default.createElement(
      'span',
      null,
      message
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1jb250cm9sLmpzIl0sIm5hbWVzIjpbIlN0eWxlZE1hcENvbnRyb2wiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwibWFwQ29udHJvbFdpZHRoIiwibWFwQ29udHJvbFBhZGRpbmciLCJ0b3AiLCJTdHlsZWRNYXBDb250cm9sQWN0aW9uIiwiU3R5bGVkTWFwQ29udHJvbEJ1dHRvbiIsImFjdGl2ZSIsInNlY29uZGFyeUJ0bkFjdEJnZCIsInNlY29uZGFyeUJ0bkJnZCIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwic2Vjb25kYXJ5QnRuQ29sb3IiLCJ0cmFuc2l0aW9uIiwiU3R5bGVkTWFwQ29udHJvbFBhbmVsIiwibWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3IiLCJTdHlsZWRNYXBDb250cm9sUGFuZWxDb250ZW50IiwiZHJvcGRvd25TY3JvbGxCYXIiLCJTdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXIiLCJtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvciIsInByb3BUeXBlcyIsImRyYWdSb3RhdGUiLCJQcm9wVHlwZXMiLCJib29sIiwiaXNSZXF1aXJlZCIsImlzRnVsbFNjcmVlbiIsImlzU3BsaXQiLCJvblRvZ2dsZUZ1bGxTY3JlZW4iLCJmdW5jIiwib25Ub2dnbGVQZXJzcGVjdGl2ZSIsIm9uVG9nZ2xlU3BsaXRNYXAiLCJudW1iZXIiLCJkZWZhdWx0UHJvcHMiLCJsYXllclNlbGVjdG9yIiwibGF5ZXJzIiwibWFwTGF5ZXJzIiwiYXZhaWxhYmxlSXRlbXMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYXZhaWxhYmxlTGF5ZXJzIiwiY3VycmVudExheWVySWQiLCJjdXJyZW50TGF5ZXIiLCJsYXllckNvbmZpZyIsImlkIiwiY29uZmlnIiwibXVzdEJlQWRkZWQiLCJpc0F2YWlsYWJsZSIsImlzVmlzaWJsZSIsIm5hbWUiLCJsYWJlbCIsImxheWVyIiwiTWFwQ29udHJvbCIsInN0YXRlIiwibWFwTGF5ZXJzU2VsZWN0b3IiLCJpbml0aWFsRGF0YVNlbGVjdG9yIiwiYXJlTGF5ZXJzVmlzaWJsZSIsImlzTGVnZW5kVmlzaWJsZSIsIl90b2dnbGVNZW51UGFuZWwiLCJwYW5lbElkIiwic2V0U3RhdGUiLCJfcmVuZGVyTGF5ZXJTZWxlY3RvciIsIml0ZW1zIiwib25NYXBUb2dnbGVMYXllciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIl9yZW5kZXJMZWdlbmQiLCJmaWx0ZXIiLCJpdGVtIiwibWFwIiwicmVuZGVyIiwibWFwSW5kZXgiLCJ1bmRlZmluZWQiLCJNYXBDb250cm9sUGFuZWwiLCJjaGlsZHJlbiIsImhlYWRlciIsIm9uQ2xpY2siLCJwb3NpdGlvbiIsInZlcnRpY2FsQWxpZ24iLCJBY3Rpb25QYW5lbCIsIk1hcExlZ2VuZFRvb2x0aXAiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxtQkFBbUIsMkJBQU9DLEdBQTFCLGtCQUVLO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxlQUFyQjtBQUFBLENBRkwsRUFHTztBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsaUJBQXJCO0FBQUEsQ0FIUCxFQUtHO0FBQUEsU0FBU0gsTUFBTUksR0FBZjtBQUFBLENBTEgsQ0FBTjs7QUFTQSxJQUFNQyx5QkFBeUIsMkJBQU9OLEdBQWhDLGtCQUFOOztBQU1BLElBQU1PLHlCQUF5QiwyQkFBT1AsR0FBaEMsbUJBRWdCO0FBQUEsU0FBU0MsTUFBTU8sTUFBTixHQUFlUCxNQUFNQyxLQUFOLENBQVlPLGtCQUEzQixHQUFnRFIsTUFBTUMsS0FBTixDQUFZUSxlQUFyRTtBQUFBLENBRmhCLEVBTUs7QUFBQSxTQUFTVCxNQUFNTyxNQUFOLEdBQWVQLE1BQU1DLEtBQU4sQ0FBWVMsb0JBQTNCLEdBQWtEVixNQUFNQyxLQUFOLENBQVlVLGlCQUF2RTtBQUFBLENB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QUFtQjtBQUFBLE1BQUVwQyxFQUFGLFNBQUVBLEVBQUY7QUFBQSxNQUFNcUMsT0FBTixTQUFNQSxPQUFOO0FBQUEsU0FDdkI7QUFBQTtBQUFBO0FBQ0UsVUFBSXJDLEVBRE47QUFFRSxhQUFNLE1BRlI7QUFHRSxjQUFPLE9BSFQ7QUFJRTtBQUFBO0FBQUE7QUFBT3FDO0FBQVA7QUFKRixHQUR1QjtBQUFBLENBQXpCIiwiZmlsZSI6Im1hcC1jb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtUb29sdGlwLCBJY29uUm91bmRTbWFsbH0gZnJvbSAnLi9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IE1hcExheWVyU2VsZWN0b3IgZnJvbSAnLi9jb21tb24vbWFwLWxheWVyLXNlbGVjdG9yJztcbmltcG9ydCBNYXBMZWdlbmQgZnJvbSAnLi9tYXAtbGVnZW5kJztcbmltcG9ydCB7Q2xvc2UsIFJlZHVjZSwgRXhwYW5kLCBTcGxpdCwgTGVnZW5kLCBDdWJlM2QsIERlbGV0ZSwgTGF5ZXJzfSAgZnJvbSAnLi9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBTdHlsZWRNYXBDb250cm9sID0gc3R5bGVkLmRpdmBcbiAgcmlnaHQ6IDA7XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2xXaWR0aH1weDtcbiAgcGFkZGluZzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBDb250cm9sUGFkZGluZ31weDtcbiAgei1pbmRleDogMTtcbiAgdG9wOiAke3Byb3BzID0+IHByb3BzLnRvcH1weDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbEFjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDRweCAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbEJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0QmdkIDogcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkfTtcbiAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgYm9yZGVyOiAwO1xuICBib3gtc2hhZG93OiAwIDZweCAxMnB4IDAgcmdiYSgwLCAwLCAwLCAwLjE2KTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0Q29sb3IgOiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5Db2xvcn07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzNnB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBwYWRkaW5nOiAwO1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICB3aWR0aDogMzZweDtcblxuICA6Zm9jdXMge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cbiAgXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkFjdEJnZH07XG4gICAgY29sb3I6ICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkFjdENvbG9yfTtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbFBhbmVsID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBQYW5lbEJhY2tncm91bmRDb2xvcn07XG4gIGZsZXgtZ3JvdzogMTtcbiAgei1pbmRleDogMTtcbiAgcCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudCA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25TY3JvbGxCYXJ9XG4gIG1heC1oZWlnaHQ6IDUwMHB4O1xuICBtaW4taGVpZ2h0OiAxMDBweDtcbiAgb3ZlcmZsb3c6IG92ZXJsYXk7XG5gO1xuXG5jb25zdCBTdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3J9O1xuICBoZWlnaHQ6IDMycHg7XG4gIHBhZGRpbmc6IDZweCAxMnB4O1xuICBmb250LXNpemU6IDExcHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yfTtcbiAgXG4gIGJ1dHRvbiB7XG4gICAgd2lkdGg6IDE4cHg7XG4gICAgaGVpZ2h0OiAxOHB4O1xuICB9XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGRyYWdSb3RhdGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGlzRnVsbFNjcmVlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgaXNTcGxpdDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgb25Ub2dnbGVGdWxsU2NyZWVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblRvZ2dsZVBlcnNwZWN0aXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblRvZ2dsZVNwbGl0TWFwOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB0b3A6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBpc0Z1bGxTY3JlZW46IGZhbHNlLFxuICBpc1NwbGl0OiBmYWxzZSxcbiAgdG9wOiAwXG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbGwgbGF5ZXJzIGF2YWlsYWJsZSBmb3IgdGhlIGN1cnJlbnQgbWFwXG4gKiBUT0RPOiB0aGlzIG1heSBiZSBtb3ZlZCBpbnRvIG1hcC1jb250YWluZXIgb3IgbWFwLWNvbnRyb2wgb3IgZXZlbiBhdCB0aGUgcmVkdWNlciBsZXZlbFxuICogQHBhcmFtIGxheWVyc1xuICogQHBhcmFtIG1hcExheWVyc1xuICogQHJldHVybnMge1tpZCwgbGFiZWwsIGlzVmlzaWJsZV19XG4gKi9cbmNvbnN0IGxheWVyU2VsZWN0b3IgPSAobGF5ZXJzLCBtYXBMYXllcnMpID0+IHtcbiAgY29uc3QgYXZhaWxhYmxlSXRlbXMgPSBPYmplY3Qua2V5cyhsYXllcnMpXG4gICAgLnJlZHVjZSgoYXZhaWxhYmxlTGF5ZXJzLCBjdXJyZW50TGF5ZXJJZCkgPT4ge1xuICAgICAgLy8gaXMgYXZhaWxhYmxlID8gaWYgeWVzIGFkZCB0byBhdmFpbGFibGUgbGlzdFxuICAgICAgY29uc3QgY3VycmVudExheWVyID0gbGF5ZXJzW2N1cnJlbnRMYXllcklkXTtcbiAgICAgIC8vIGlmIG1hcGxheWVycyBleGlzdHMgd2UgbmVlZCB0byBtYWtlIHN1cmUgY3VycmVudGxheWVyXG4gICAgICAvLyBpcyBjb250YWluZWQgaW4gbWFwTGF5ZXJzIGluIG9yZGVyIHRvIGFkZCBvbnRvIGF2YWlsYWJsZUxheWVyc1xuICAgICAgLy8gb3RoZXJ3aXNlIHdlIGFkZCBhbGwgbGF5ZXJzXG5cbiAgICAgIGNvbnN0IGxheWVyQ29uZmlnID0gbWFwTGF5ZXJzID8gbWFwTGF5ZXJzW2N1cnJlbnRMYXllci5pZF0gOiBjdXJyZW50TGF5ZXIuY29uZmlnO1xuXG4gICAgICBjb25zdCBtdXN0QmVBZGRlZCA9IG1hcExheWVycyAmJiBtYXBMYXllcnNbY3VycmVudExheWVyLmlkXSA/IG1hcExheWVyc1tjdXJyZW50TGF5ZXIuaWRdLmlzQXZhaWxhYmxlIDogbGF5ZXJDb25maWcuaXNWaXNpYmxlO1xuXG4gICAgICByZXR1cm4gbXVzdEJlQWRkZWQgPyBbXG4gICAgICAgIC4uLmF2YWlsYWJsZUxheWVycyxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBjdXJyZW50TGF5ZXIuaWQsXG4gICAgICAgICAgbmFtZTogY3VycmVudExheWVyLmNvbmZpZy5sYWJlbCxcbiAgICAgICAgICBpc1Zpc2libGU6IG1hcExheWVycyAmJiBtYXBMYXllcnNbY3VycmVudExheWVyLmlkXSA/IG1hcExheWVyc1tjdXJyZW50TGF5ZXIuaWRdLmlzVmlzaWJsZSA6IGxheWVyQ29uZmlnLmlzVmlzaWJsZSxcbiAgICAgICAgICBsYXllcjogY3VycmVudExheWVyXG4gICAgICAgIH1cbiAgICAgIF0gOiBhdmFpbGFibGVMYXllcnM7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhdmFpbGFibGVJdGVtcztcbn07XG5cbmNsYXNzIE1hcENvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYXJlTGF5ZXJzVmlzaWJsZTogZmFsc2UsXG4gICAgICBpc0xlZ2VuZFZpc2libGU6IGZhbHNlXG4gICAgfTtcbiAgfVxuICBsYXllclNlbGVjdG9yID0gc3RhdGUgPT4gc3RhdGUubGF5ZXJzO1xuICBtYXBMYXllcnNTZWxlY3RvciA9IHN0YXRlID0+IHN0YXRlLm1hcExheWVycztcblxuICBpbml0aWFsRGF0YVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5sYXllclNlbGVjdG9yLFxuICAgIHRoaXMubWFwTGF5ZXJzU2VsZWN0b3IsXG4gICAgbGF5ZXJTZWxlY3RvclxuICApO1xuXG4gIC8vIGlmIG9uZSBwYW5lbCBpcyBhbHJlYWR5IG9wZW4gYW5kIHVzZXIgdHJpZXMgdG8gb3BlbiBhIG5ldyBvbmUgd2VsbCB0aGUgcHJldmlvdXMgb25lIHdpbGwgYmUgY2xvc2VkXG4gIF90b2dnbGVNZW51UGFuZWwocGFuZWxJZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYXJlTGF5ZXJzVmlzaWJsZTogZmFsc2UsXG4gICAgICBpc0xlZ2VuZFZpc2libGU6IGZhbHNlLFxuICAgICAgW3BhbmVsSWRdOiAhdGhpcy5zdGF0ZVtwYW5lbElkXVxuICAgIH0pO1xuICB9O1xuXG4gIF9yZW5kZXJMYXllclNlbGVjdG9yKGl0ZW1zKSB7XG4gICAgY29uc3Qge29uTWFwVG9nZ2xlTGF5ZXJ9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7YXJlTGF5ZXJzVmlzaWJsZX0gPSB0aGlzLnN0YXRlO1xuXG4gICAgcmV0dXJuICFhcmVMYXllcnNWaXNpYmxlID8gKFxuICAgICAgPFN0eWxlZE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAga2V5PXsxfVxuICAgICAgICBvbkNsaWNrPXtlID0+IHtlLnByZXZlbnREZWZhdWx0KCk7IHRoaXMuX3RvZ2dsZU1lbnVQYW5lbCgnYXJlTGF5ZXJzVmlzaWJsZScpfX1cbiAgICAgICAgZGF0YS10aXAgZGF0YS1mb3I9XCJ0b2dnbGUtbGF5ZXJcIj5cbiAgICAgICAgPExheWVycyBoZWlnaHQ9XCIyMnB4XCIvPlxuICAgICAgICA8TWFwTGVnZW5kVG9vbHRpcFxuICAgICAgICAgIGlkPVwidG9nZ2xlLWxheWVyXCJcbiAgICAgICAgICBtZXNzYWdlPXthcmVMYXllcnNWaXNpYmxlID8gJ0hpZGUgbGF5ZXIgcGFuZWwnIDogJ1Nob3cgbGF5ZXIgcGFuZWwnfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICkgOiAoXG4gICAgICA8TWFwQ29udHJvbFBhbmVsXG4gICAgICAgIGhlYWRlcj17J1Zpc2libGUgbGF5ZXJzJ31cbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5fdG9nZ2xlTWVudVBhbmVsKCdhcmVMYXllcnNWaXNpYmxlJyl9PlxuICAgICAgICA8TWFwTGF5ZXJTZWxlY3RvclxuICAgICAgICAgIGxheWVycz17aXRlbXN9XG4gICAgICAgICAgb25NYXBUb2dnbGVMYXllcj17b25NYXBUb2dnbGVMYXllcn1cbiAgICAgICAgLz5cbiAgICAgIDwvTWFwQ29udHJvbFBhbmVsPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyTGVnZW5kKGl0ZW1zKSB7XG4gICAgY29uc3Qge2lzTGVnZW5kVmlzaWJsZX0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiAhaXNMZWdlbmRWaXNpYmxlID8gKFxuICAgICAgPFN0eWxlZE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAga2V5PXsyfVxuICAgICAgICBjbGFzc05hbWU9eydsZWdlbmQnfVxuICAgICAgICBkYXRhLXRpcCBkYXRhLWZvcj1cInNob3ctbGVnZW5kXCJcbiAgICAgICAgb25DbGljaz17ZSA9PiB7ZS5wcmV2ZW50RGVmYXVsdCgpOyB0aGlzLl90b2dnbGVNZW51UGFuZWwoJ2lzTGVnZW5kVmlzaWJsZScpfX0+XG4gICAgICAgIDxMZWdlbmQgaGVpZ2h0PVwiMjJweFwiLz5cbiAgICAgICAgPE1hcExlZ2VuZFRvb2x0aXBcbiAgICAgICAgICBpZD1cInNob3ctbGVnZW5kXCJcbiAgICAgICAgICBtZXNzYWdlPXsnc2hvdyBsZWdlbmQnfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICkgOiAoXG4gICAgICA8TWFwQ29udHJvbFBhbmVsXG4gICAgICAgIGhlYWRlcj17J0xheWVyIExlZ2VuZCd9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuX3RvZ2dsZU1lbnVQYW5lbCgnaXNMZWdlbmRWaXNpYmxlJyl9PlxuICAgICAgICA8TWFwTGVnZW5kIGxheWVycz17aXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pc1Zpc2libGUpLm1hcChpdGVtID0+IGl0ZW0ubGF5ZXIpfS8+XG4gICAgICA8L01hcENvbnRyb2xQYW5lbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pbml0aWFsRGF0YVNlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgaWYgKCFpdGVtcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgZHJhZ1JvdGF0ZSwgaXNGdWxsU2NyZWVuLCBpc1NwbGl0LCBtYXBJbmRleCxcbiAgICAgIG9uVG9nZ2xlRnVsbFNjcmVlbiwgb25Ub2dnbGVQZXJzcGVjdGl2ZSwgb25Ub2dnbGVTcGxpdE1hcFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRNYXBDb250cm9sIGNsYXNzTmFtZT17J21hcC1jb250cm9sJ30+XG4gICAgICAgIHsvKiBTcGxpdCBNYXAgKi99XG4gICAgICAgIDxBY3Rpb25QYW5lbCBrZXk9ezB9PlxuICAgICAgICAgIDxTdHlsZWRNYXBDb250cm9sQnV0dG9uXG4gICAgICAgICAgICBhY3RpdmU9e2lzU3BsaXR9XG4gICAgICAgICAgICBvbkNsaWNrPXtlID0+IHtlLnByZXZlbnREZWZhdWx0KCk7IG9uVG9nZ2xlU3BsaXRNYXAoaXNTcGxpdCA/IG1hcEluZGV4IDogdW5kZWZpbmVkKX19XG4gICAgICAgICAgICBkYXRhLXRpcCBkYXRhLWZvcj17YGFjdGlvbi10b2dnbGVfJHttYXBJbmRleH1gfT5cbiAgICAgICAgICAgIHtpc1NwbGl0ID8gPERlbGV0ZSBoZWlnaHQ9eycxOHB4J30vPiA6IDxTcGxpdCBoZWlnaHQ9eycxOHB4J30vPn1cbiAgICAgICAgICAgIDxNYXBMZWdlbmRUb29sdGlwXG4gICAgICAgICAgICAgIGlkPXtgYWN0aW9uLXRvZ2dsZV8ke21hcEluZGV4fWB9XG4gICAgICAgICAgICAgIG1lc3NhZ2U9e2lzU3BsaXQgPyAnQ2xvc2UgY3VycmVudCBwYW5lbCcgOiAnU3dpdGNoIHRvIGR1YWwgbWFwIHZpZXcnfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N0eWxlZE1hcENvbnRyb2xCdXR0b24+XG4gICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgIHsvKiBNYXAgTGF5ZXJzICovfVxuICAgICAgICB7aXNTcGxpdCAmJiAoXG4gICAgICAgICAgPEFjdGlvblBhbmVsIGtleT17MX0+XG4gICAgICAgICAgICB7dGhpcy5fcmVuZGVyTGF5ZXJTZWxlY3RvcihpdGVtcyl9XG4gICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgKX1cbiAgICAgICAgey8qIDNEIE1hcCAqL31cbiAgICAgICAgPEFjdGlvblBhbmVsIGtleT17Mn0+XG4gICAgICAgICAgPFN0eWxlZE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4ge2UucHJldmVudERlZmF1bHQoKTsgb25Ub2dnbGVQZXJzcGVjdGl2ZSgpfX1cbiAgICAgICAgICAgIGFjdGl2ZT17ZHJhZ1JvdGF0ZX1cbiAgICAgICAgICAgIGRhdGEtdGlwIGRhdGEtZm9yPVwiYWN0aW9uLTNkXCI+XG4gICAgICAgICAgICA8Q3ViZTNkIGhlaWdodD17JzIycHgnfS8+XG4gICAgICAgICAgICB7LyogTm8gaWNvbiBzaW5jZSB3ZSBhcmUgaW5qZWN0aW5nIHRocm91Z2ggY3NzIC50aHJlZUQtbWFwIGNsYXNzKi99XG4gICAgICAgICAgICA8TWFwTGVnZW5kVG9vbHRpcFxuICAgICAgICAgICAgICBpZD1cImFjdGlvbi0zZFwiXG4gICAgICAgICAgICAgIG1lc3NhZ2U9e2RyYWdSb3RhdGUgPyAnRGlzYWJsZSAzRCBNYXAnIDogJzNEIE1hcCd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3R5bGVkTWFwQ29udHJvbEJ1dHRvbj5cbiAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgey8qIE1hcCBMZWdlbmQgKi99XG4gICAgICAgIDxBY3Rpb25QYW5lbCBrZXk9ezN9PlxuICAgICAgICAgIHt0aGlzLl9yZW5kZXJMZWdlbmQoaXRlbXMpfVxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICB7LyogRnVsbCBTY3JlZW4gKi99XG4gICAgICAgIDxBY3Rpb25QYW5lbFxuICAgICAgICAgIGtleT17NH0+XG4gICAgICAgICAgPFN0eWxlZE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4ge2UucHJldmVudERlZmF1bHQoKTsgb25Ub2dnbGVGdWxsU2NyZWVuKCl9fVxuICAgICAgICAgICAgYWN0aXZlPXtpc0Z1bGxTY3JlZW59XG4gICAgICAgICAgICBkYXRhLXRpcCBkYXRhLWZvcj17YGFjdGlvbi1mdWxsc2NyZWVuXyR7bWFwSW5kZXh9XyR7aXNGdWxsU2NyZWVufWB9PlxuICAgICAgICAgICAge2lzRnVsbFNjcmVlbiA/ICg8UmVkdWNlIGhlaWdodD17JzIycHgnfSAvPikgOiAoPEV4cGFuZCBoZWlnaHQ9eycyMnB4J30gLz4pfVxuICAgICAgICAgICAgPE1hcExlZ2VuZFRvb2x0aXBcbiAgICAgICAgICAgICAgaWQ9e2BhY3Rpb24tZnVsbHNjcmVlbl8ke21hcEluZGV4fV8ke2lzRnVsbFNjcmVlbn1gfVxuICAgICAgICAgICAgICBtZXNzYWdlPXshaXNGdWxsU2NyZWVuID8gJ0dvIGZ1bGwgc2NyZWVuJyA6ICdFeGl0IGZ1bGwgc2NyZWVuJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgPC9TdHlsZWRNYXBDb250cm9sPlxuICAgICk7XG4gIH1cbn1cblxuTWFwQ29udHJvbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5NYXBDb250cm9sLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgTWFwQ29udHJvbDtcblxuY29uc3QgTWFwQ29udHJvbFBhbmVsID0gKHtjaGlsZHJlbiwgaGVhZGVyLCBvbkNsaWNrfSkgPT4gKFxuICA8U3R5bGVkTWFwQ29udHJvbFBhbmVsPlxuICAgIDxTdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXIgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgPHNwYW4gc3R5bGU9e3t2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJ319PntoZWFkZXJ9PC9zcGFuPlxuICAgICAgPEljb25Sb3VuZFNtYWxsPlxuICAgICAgICA8Q2xvc2UgaGVpZ2h0PVwiMTZweFwiIG9uQ2xpY2s9e29uQ2xpY2t9Lz5cbiAgICAgIDwvSWNvblJvdW5kU21hbGw+XG4gICAgPC9TdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXI+XG4gICAgPFN0eWxlZE1hcENvbnRyb2xQYW5lbENvbnRlbnQ+XG4gICAge2NoaWxkcmVufVxuICAgIDwvU3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudD5cbiAgPC9TdHlsZWRNYXBDb250cm9sUGFuZWw+XG4pO1xuXG5jb25zdCBBY3Rpb25QYW5lbCA9ICh7Y2hpbGRyZW59KSA9PiAoXG4gIDxTdHlsZWRNYXBDb250cm9sQWN0aW9uPlxuICAgIHtjaGlsZHJlbn1cbiAgPC9TdHlsZWRNYXBDb250cm9sQWN0aW9uPlxuKTtcblxuY29uc3QgTWFwTGVnZW5kVG9vbHRpcCA9ICh7aWQsIG1lc3NhZ2V9KSA9PiAoXG4gIDxUb29sdGlwXG4gICAgaWQ9e2lkfVxuICAgIHBsYWNlPVwibGVmdFwiXG4gICAgZWZmZWN0PVwic29saWRcIj5cbiAgICA8c3Bhbj57bWVzc2FnZX08L3NwYW4+XG4gIDwvVG9vbHRpcD5cbik7XG4iXX0=