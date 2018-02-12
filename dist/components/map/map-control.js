'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  right: 0;\n  width: ', 'px;\n  padding: ', 'px;\n  z-index: 1;\n  top: ', 'px;\n  position: absolute;\n'], ['\n  right: 0;\n  width: ', 'px;\n  padding: ', 'px;\n  z-index: 1;\n  top: ', 'px;\n  position: absolute;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  padding: 4px 0;\n  display: flex;\n  justify-content: flex-end;\n'], ['\n  padding: 4px 0;\n  display: flex;\n  justify-content: flex-end;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 18px;\n  border: 0;\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  color: ', ';\n  cursor: pointer;\n  display: flex;\n  height: 36px;\n  justify-content: center;\n  margin: 0;\n  outline: none;\n  padding: 0;\n  transition: ', ';\n  width: 36px;\n\n  :focus {\n    outline: none;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 18px;\n  border: 0;\n  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);\n  color: ', ';\n  cursor: pointer;\n  display: flex;\n  height: 36px;\n  justify-content: center;\n  margin: 0;\n  outline: none;\n  padding: 0;\n  transition: ', ';\n  width: 36px;\n\n  :focus {\n    outline: none;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n'], ['\n  background-color: ', ';\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  ', ' max-height: 500px;\n  min-height: 100px;\n  overflow: overlay;\n'], ['\n  ', ' max-height: 500px;\n  min-height: 100px;\n  overflow: overlay;\n']),
    _templateObject6 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  justify-content: space-between;\n  background-color: ', ';\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ', ';\n\n  button {\n    width: 18px;\n    height: 18px;\n  }\n'], ['\n  display: flex;\n  justify-content: space-between;\n  background-color: ', ';\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ', ';\n\n  button {\n    width: 18px;\n    height: 18px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reselect = require('reselect');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('../common/styled-components');

var _mapLayerSelector = require('../common/map-layer-selector');

var _mapLayerSelector2 = _interopRequireDefault(_mapLayerSelector);

var _mapLegend = require('./map-legend');

var _mapLegend2 = _interopRequireDefault(_mapLegend);

var _icons = require('../common/icons');

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

    return mustBeAdded ? [].concat((0, _toConsumableArray3.default)(availableLayers), [{
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

    var _this = (0, _possibleConstructorReturn3.default)(this, (MapControl.__proto__ || Object.getPrototypeOf(MapControl)).call(this, props));

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

  (0, _createClass3.default)(MapControl, [{
    key: '_toggleMenuPanel',


    // if one panel is already open and user tries to open a new one well the previous one will be closed
    value: function _toggleMenuPanel(panelId) {
      this.setState((0, _defineProperty3.default)({
        areLayersVisible: false,
        isLegendVisible: false
      }, panelId, !this.state[panelId]));
    }
  }, {
    key: '_renderLayerSelector',
    value: function _renderLayerSelector(items) {
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
    }
  }, {
    key: '_renderLegend',
    value: function _renderLegend(items) {
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
    }
  }, {
    key: 'render',
    value: function render() {
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
    }
  }]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtY29udHJvbC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRNYXBDb250cm9sIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsIm1hcENvbnRyb2xXaWR0aCIsIm1hcENvbnRyb2xQYWRkaW5nIiwidG9wIiwiU3R5bGVkTWFwQ29udHJvbEFjdGlvbiIsIlN0eWxlZE1hcENvbnRyb2xCdXR0b24iLCJhY3RpdmUiLCJzZWNvbmRhcnlCdG5BY3RCZ2QiLCJzZWNvbmRhcnlCdG5CZ2QiLCJzZWNvbmRhcnlCdG5BY3RDb2xvciIsInNlY29uZGFyeUJ0bkNvbG9yIiwidHJhbnNpdGlvbiIsIlN0eWxlZE1hcENvbnRyb2xQYW5lbCIsIm1hcFBhbmVsQmFja2dyb3VuZENvbG9yIiwiU3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudCIsImRyb3Bkb3duU2Nyb2xsQmFyIiwiU3R5bGVkTWFwQ29udHJvbFBhbmVsSGVhZGVyIiwibWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IiLCJwcm9wVHlwZXMiLCJkcmFnUm90YXRlIiwiUHJvcFR5cGVzIiwiYm9vbCIsImlzUmVxdWlyZWQiLCJpc0Z1bGxTY3JlZW4iLCJpc1NwbGl0Iiwib25Ub2dnbGVGdWxsU2NyZWVuIiwiZnVuYyIsIm9uVG9nZ2xlUGVyc3BlY3RpdmUiLCJvblRvZ2dsZVNwbGl0TWFwIiwibnVtYmVyIiwiZGVmYXVsdFByb3BzIiwibGF5ZXJTZWxlY3RvciIsImxheWVycyIsIm1hcExheWVycyIsImF2YWlsYWJsZUl0ZW1zIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImF2YWlsYWJsZUxheWVycyIsImN1cnJlbnRMYXllcklkIiwiY3VycmVudExheWVyIiwibGF5ZXJDb25maWciLCJpZCIsImNvbmZpZyIsIm11c3RCZUFkZGVkIiwiaXNBdmFpbGFibGUiLCJpc1Zpc2libGUiLCJuYW1lIiwibGFiZWwiLCJsYXllciIsIk1hcENvbnRyb2wiLCJzdGF0ZSIsIm1hcExheWVyc1NlbGVjdG9yIiwiaW5pdGlhbERhdGFTZWxlY3RvciIsImFyZUxheWVyc1Zpc2libGUiLCJpc0xlZ2VuZFZpc2libGUiLCJwYW5lbElkIiwic2V0U3RhdGUiLCJpdGVtcyIsIm9uTWFwVG9nZ2xlTGF5ZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJfdG9nZ2xlTWVudVBhbmVsIiwiZmlsdGVyIiwiaXRlbSIsIm1hcCIsIm1hcEluZGV4IiwidW5kZWZpbmVkIiwiX3JlbmRlckxheWVyU2VsZWN0b3IiLCJfcmVuZGVyTGVnZW5kIiwiTWFwQ29udHJvbFBhbmVsIiwiY2hpbGRyZW4iLCJoZWFkZXIiLCJvbkNsaWNrIiwicG9zaXRpb24iLCJ2ZXJ0aWNhbEFsaWduIiwiQWN0aW9uUGFuZWwiLCJNYXBMZWdlbmRUb29sdGlwIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBV0EsSUFBTUEsbUJBQW1CLDJCQUFPQyxHQUExQixrQkFFSztBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsZUFBckI7QUFBQSxDQUZMLEVBR087QUFBQSxTQUFTRixNQUFNQyxLQUFOLENBQVlFLGlCQUFyQjtBQUFBLENBSFAsRUFLRztBQUFBLFNBQVNILE1BQU1JLEdBQWY7QUFBQSxDQUxILENBQU47O0FBU0EsSUFBTUMseUJBQXlCLDJCQUFPTixHQUFoQyxrQkFBTjs7QUFNQSxJQUFNTyx5QkFBeUIsMkJBQU9QLEdBQWhDLG1CQUVnQjtBQUFBLFNBQ2xCQyxNQUFNTyxNQUFOLEdBQ0lQLE1BQU1DLEtBQU4sQ0FBWU8sa0JBRGhCLEdBRUlSLE1BQU1DLEtBQU4sQ0FBWVEsZUFIRTtBQUFBLENBRmhCLEVBU0s7QUFBQSxTQUNQVCxNQUFNTyxNQUFOLEdBQ0lQLE1BQU1DLEtBQU4sQ0FBWVMsb0JBRGhCLEdBRUlWLE1BQU1DLEtBQU4sQ0FBWVUsaUJBSFQ7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QUEsU0FDdkI7QUFBQTtBQUFBLE1BQVMsSUFBSXBDLEVBQWIsRUFBaUIsT0FBTSxNQUF2QixFQUE4QixRQUFPLE9BQXJDO0FBQ0U7QUFBQTtBQUFBO0FBQU9vQztBQUFQO0FBREYsR0FEdUI7QUFBQSxDQUF6QiIsImZpbGUiOiJtYXAtY29udHJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCB7VG9vbHRpcCwgSWNvblJvdW5kU21hbGx9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBNYXBMYXllclNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL21hcC1sYXllci1zZWxlY3Rvcic7XG5pbXBvcnQgTWFwTGVnZW5kIGZyb20gJy4vbWFwLWxlZ2VuZCc7XG5pbXBvcnQge1xuICBDbG9zZSxcbiAgUmVkdWNlLFxuICBFeHBhbmQsXG4gIFNwbGl0LFxuICBMZWdlbmQsXG4gIEN1YmUzZCxcbiAgRGVsZXRlLFxuICBMYXllcnNcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBTdHlsZWRNYXBDb250cm9sID0gc3R5bGVkLmRpdmBcbiAgcmlnaHQ6IDA7XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2xXaWR0aH1weDtcbiAgcGFkZGluZzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBDb250cm9sUGFkZGluZ31weDtcbiAgei1pbmRleDogMTtcbiAgdG9wOiAke3Byb3BzID0+IHByb3BzLnRvcH1weDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbEFjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDRweCAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbEJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5hY3RpdmVcbiAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0QmdkXG4gICAgICA6IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkJnZH07XG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gIGJvcmRlcjogMDtcbiAgYm94LXNoYWRvdzogMCA2cHggMTJweCAwIHJnYmEoMCwgMCwgMCwgMC4xNik7XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkFjdENvbG9yXG4gICAgICA6IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW46IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHdpZHRoOiAzNnB4O1xuXG4gIDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0QmdkfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5BY3RDb2xvcn07XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbCA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3J9O1xuICBmbGV4LWdyb3c6IDE7XG4gIHotaW5kZXg6IDE7XG4gIHAge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duU2Nyb2xsQmFyfSBtYXgtaGVpZ2h0OiA1MDBweDtcbiAgbWluLWhlaWdodDogMTAwcHg7XG4gIG92ZXJmbG93OiBvdmVybGF5O1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbFBhbmVsSGVhZGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcFBhbmVsSGVhZGVyQmFja2dyb3VuZENvbG9yfTtcbiAgaGVpZ2h0OiAzMnB4O1xuICBwYWRkaW5nOiA2cHggMTJweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5Db2xvcn07XG5cbiAgYnV0dG9uIHtcbiAgICB3aWR0aDogMThweDtcbiAgICBoZWlnaHQ6IDE4cHg7XG4gIH1cbmA7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZHJhZ1JvdGF0ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgaXNGdWxsU2NyZWVuOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBpc1NwbGl0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvblRvZ2dsZUZ1bGxTY3JlZW46IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uVG9nZ2xlUGVyc3BlY3RpdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uVG9nZ2xlU3BsaXRNYXA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHRvcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlzRnVsbFNjcmVlbjogZmFsc2UsXG4gIGlzU3BsaXQ6IGZhbHNlLFxuICB0b3A6IDBcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGFsbCBsYXllcnMgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBtYXBcbiAqIFRPRE86IHRoaXMgbWF5IGJlIG1vdmVkIGludG8gbWFwLWNvbnRhaW5lciBvciBtYXAtY29udHJvbCBvciBldmVuIGF0IHRoZSByZWR1Y2VyIGxldmVsXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcGFyYW0gbWFwTGF5ZXJzXG4gKiBAcmV0dXJucyB7W2lkLCBsYWJlbCwgaXNWaXNpYmxlXX1cbiAqL1xuY29uc3QgbGF5ZXJTZWxlY3RvciA9IChsYXllcnMsIG1hcExheWVycykgPT4ge1xuICBjb25zdCBhdmFpbGFibGVJdGVtcyA9IE9iamVjdC5rZXlzKGxheWVycykucmVkdWNlKFxuICAgIChhdmFpbGFibGVMYXllcnMsIGN1cnJlbnRMYXllcklkKSA9PiB7XG4gICAgICAvLyBpcyBhdmFpbGFibGUgPyBpZiB5ZXMgYWRkIHRvIGF2YWlsYWJsZSBsaXN0XG4gICAgICBjb25zdCBjdXJyZW50TGF5ZXIgPSBsYXllcnNbY3VycmVudExheWVySWRdO1xuICAgICAgLy8gaWYgbWFwbGF5ZXJzIGV4aXN0cyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSBjdXJyZW50bGF5ZXJcbiAgICAgIC8vIGlzIGNvbnRhaW5lZCBpbiBtYXBMYXllcnMgaW4gb3JkZXIgdG8gYWRkIG9udG8gYXZhaWxhYmxlTGF5ZXJzXG4gICAgICAvLyBvdGhlcndpc2Ugd2UgYWRkIGFsbCBsYXllcnNcblxuICAgICAgY29uc3QgbGF5ZXJDb25maWcgPSBtYXBMYXllcnNcbiAgICAgICAgPyBtYXBMYXllcnNbY3VycmVudExheWVyLmlkXVxuICAgICAgICA6IGN1cnJlbnRMYXllci5jb25maWc7XG5cbiAgICAgIGNvbnN0IG11c3RCZUFkZGVkID1cbiAgICAgICAgbWFwTGF5ZXJzICYmIG1hcExheWVyc1tjdXJyZW50TGF5ZXIuaWRdXG4gICAgICAgICAgPyBtYXBMYXllcnNbY3VycmVudExheWVyLmlkXS5pc0F2YWlsYWJsZVxuICAgICAgICAgIDogbGF5ZXJDb25maWcuaXNWaXNpYmxlO1xuXG4gICAgICByZXR1cm4gbXVzdEJlQWRkZWRcbiAgICAgICAgPyBbXG4gICAgICAgICAgICAuLi5hdmFpbGFibGVMYXllcnMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBjdXJyZW50TGF5ZXIuaWQsXG4gICAgICAgICAgICAgIG5hbWU6IGN1cnJlbnRMYXllci5jb25maWcubGFiZWwsXG4gICAgICAgICAgICAgIGlzVmlzaWJsZTpcbiAgICAgICAgICAgICAgICBtYXBMYXllcnMgJiYgbWFwTGF5ZXJzW2N1cnJlbnRMYXllci5pZF1cbiAgICAgICAgICAgICAgICAgID8gbWFwTGF5ZXJzW2N1cnJlbnRMYXllci5pZF0uaXNWaXNpYmxlXG4gICAgICAgICAgICAgICAgICA6IGxheWVyQ29uZmlnLmlzVmlzaWJsZSxcbiAgICAgICAgICAgICAgbGF5ZXI6IGN1cnJlbnRMYXllclxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgOiBhdmFpbGFibGVMYXllcnM7XG4gICAgfSxcbiAgICBbXVxuICApO1xuXG4gIHJldHVybiBhdmFpbGFibGVJdGVtcztcbn07XG5cbmNsYXNzIE1hcENvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYXJlTGF5ZXJzVmlzaWJsZTogZmFsc2UsXG4gICAgICBpc0xlZ2VuZFZpc2libGU6IGZhbHNlXG4gICAgfTtcbiAgfVxuICBsYXllclNlbGVjdG9yID0gc3RhdGUgPT4gc3RhdGUubGF5ZXJzO1xuICBtYXBMYXllcnNTZWxlY3RvciA9IHN0YXRlID0+IHN0YXRlLm1hcExheWVycztcblxuICBpbml0aWFsRGF0YVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5sYXllclNlbGVjdG9yLFxuICAgIHRoaXMubWFwTGF5ZXJzU2VsZWN0b3IsXG4gICAgbGF5ZXJTZWxlY3RvclxuICApO1xuXG4gIC8vIGlmIG9uZSBwYW5lbCBpcyBhbHJlYWR5IG9wZW4gYW5kIHVzZXIgdHJpZXMgdG8gb3BlbiBhIG5ldyBvbmUgd2VsbCB0aGUgcHJldmlvdXMgb25lIHdpbGwgYmUgY2xvc2VkXG4gIF90b2dnbGVNZW51UGFuZWwocGFuZWxJZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYXJlTGF5ZXJzVmlzaWJsZTogZmFsc2UsXG4gICAgICBpc0xlZ2VuZFZpc2libGU6IGZhbHNlLFxuICAgICAgW3BhbmVsSWRdOiAhdGhpcy5zdGF0ZVtwYW5lbElkXVxuICAgIH0pO1xuICB9XG5cbiAgX3JlbmRlckxheWVyU2VsZWN0b3IoaXRlbXMpIHtcbiAgICBjb25zdCB7b25NYXBUb2dnbGVMYXllcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHthcmVMYXllcnNWaXNpYmxlfSA9IHRoaXMuc3RhdGU7XG5cbiAgICByZXR1cm4gIWFyZUxheWVyc1Zpc2libGUgPyAoXG4gICAgICA8U3R5bGVkTWFwQ29udHJvbEJ1dHRvblxuICAgICAgICBrZXk9ezF9XG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl90b2dnbGVNZW51UGFuZWwoJ2FyZUxheWVyc1Zpc2libGUnKTtcbiAgICAgICAgfX1cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJ0b2dnbGUtbGF5ZXJcIlxuICAgICAgPlxuICAgICAgICA8TGF5ZXJzIGhlaWdodD1cIjIycHhcIiAvPlxuICAgICAgICA8TWFwTGVnZW5kVG9vbHRpcFxuICAgICAgICAgIGlkPVwidG9nZ2xlLWxheWVyXCJcbiAgICAgICAgICBtZXNzYWdlPXthcmVMYXllcnNWaXNpYmxlID8gJ0hpZGUgbGF5ZXIgcGFuZWwnIDogJ1Nob3cgbGF5ZXIgcGFuZWwnfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICkgOiAoXG4gICAgICA8TWFwQ29udHJvbFBhbmVsXG4gICAgICAgIGhlYWRlcj17J1Zpc2libGUgbGF5ZXJzJ31cbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5fdG9nZ2xlTWVudVBhbmVsKCdhcmVMYXllcnNWaXNpYmxlJyl9XG4gICAgICA+XG4gICAgICAgIDxNYXBMYXllclNlbGVjdG9yIGxheWVycz17aXRlbXN9IG9uTWFwVG9nZ2xlTGF5ZXI9e29uTWFwVG9nZ2xlTGF5ZXJ9IC8+XG4gICAgICA8L01hcENvbnRyb2xQYW5lbD5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckxlZ2VuZChpdGVtcykge1xuICAgIGNvbnN0IHtpc0xlZ2VuZFZpc2libGV9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gIWlzTGVnZW5kVmlzaWJsZSA/IChcbiAgICAgIDxTdHlsZWRNYXBDb250cm9sQnV0dG9uXG4gICAgICAgIGtleT17Mn1cbiAgICAgICAgY2xhc3NOYW1lPXsnbGVnZW5kJ31cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJzaG93LWxlZ2VuZFwiXG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl90b2dnbGVNZW51UGFuZWwoJ2lzTGVnZW5kVmlzaWJsZScpO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8TGVnZW5kIGhlaWdodD1cIjIycHhcIiAvPlxuICAgICAgICA8TWFwTGVnZW5kVG9vbHRpcCBpZD1cInNob3ctbGVnZW5kXCIgbWVzc2FnZT17J3Nob3cgbGVnZW5kJ30gLz5cbiAgICAgIDwvU3R5bGVkTWFwQ29udHJvbEJ1dHRvbj5cbiAgICApIDogKFxuICAgICAgPE1hcENvbnRyb2xQYW5lbFxuICAgICAgICBoZWFkZXI9eydMYXllciBMZWdlbmQnfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLl90b2dnbGVNZW51UGFuZWwoJ2lzTGVnZW5kVmlzaWJsZScpfVxuICAgICAgPlxuICAgICAgICA8TWFwTGVnZW5kXG4gICAgICAgICAgbGF5ZXJzPXtpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmlzVmlzaWJsZSkubWFwKGl0ZW0gPT4gaXRlbS5sYXllcil9XG4gICAgICAgIC8+XG4gICAgICA8L01hcENvbnRyb2xQYW5lbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pbml0aWFsRGF0YVNlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgaWYgKCFpdGVtcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgZHJhZ1JvdGF0ZSxcbiAgICAgIGlzRnVsbFNjcmVlbixcbiAgICAgIGlzU3BsaXQsXG4gICAgICBtYXBJbmRleCxcbiAgICAgIG9uVG9nZ2xlRnVsbFNjcmVlbixcbiAgICAgIG9uVG9nZ2xlUGVyc3BlY3RpdmUsXG4gICAgICBvblRvZ2dsZVNwbGl0TWFwXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZE1hcENvbnRyb2wgY2xhc3NOYW1lPXsnbWFwLWNvbnRyb2wnfT5cbiAgICAgICAgey8qIFNwbGl0IE1hcCAqL31cbiAgICAgICAgPEFjdGlvblBhbmVsIGtleT17MH0+XG4gICAgICAgICAgPFN0eWxlZE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAgICAgIGFjdGl2ZT17aXNTcGxpdH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIG9uVG9nZ2xlU3BsaXRNYXAoaXNTcGxpdCA/IG1hcEluZGV4IDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgICAgZGF0YS1mb3I9e2BhY3Rpb24tdG9nZ2xlXyR7bWFwSW5kZXh9YH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNTcGxpdCA/IDxEZWxldGUgaGVpZ2h0PXsnMThweCd9IC8+IDogPFNwbGl0IGhlaWdodD17JzE4cHgnfSAvPn1cbiAgICAgICAgICAgIDxNYXBMZWdlbmRUb29sdGlwXG4gICAgICAgICAgICAgIGlkPXtgYWN0aW9uLXRvZ2dsZV8ke21hcEluZGV4fWB9XG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xuICAgICAgICAgICAgICAgIGlzU3BsaXQgPyAnQ2xvc2UgY3VycmVudCBwYW5lbCcgOiAnU3dpdGNoIHRvIGR1YWwgbWFwIHZpZXcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICB7LyogTWFwIExheWVycyAqL31cbiAgICAgICAge2lzU3BsaXQgJiYgKFxuICAgICAgICAgIDxBY3Rpb25QYW5lbCBrZXk9ezF9Pnt0aGlzLl9yZW5kZXJMYXllclNlbGVjdG9yKGl0ZW1zKX08L0FjdGlvblBhbmVsPlxuICAgICAgICApfVxuICAgICAgICB7LyogM0QgTWFwICovfVxuICAgICAgICA8QWN0aW9uUGFuZWwga2V5PXsyfT5cbiAgICAgICAgICA8U3R5bGVkTWFwQ29udHJvbEJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgb25Ub2dnbGVQZXJzcGVjdGl2ZSgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGFjdGl2ZT17ZHJhZ1JvdGF0ZX1cbiAgICAgICAgICAgIGRhdGEtdGlwXG4gICAgICAgICAgICBkYXRhLWZvcj1cImFjdGlvbi0zZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEN1YmUzZCBoZWlnaHQ9eycyMnB4J30gLz5cbiAgICAgICAgICAgIHsvKiBObyBpY29uIHNpbmNlIHdlIGFyZSBpbmplY3RpbmcgdGhyb3VnaCBjc3MgLnRocmVlRC1tYXAgY2xhc3MqL31cbiAgICAgICAgICAgIDxNYXBMZWdlbmRUb29sdGlwXG4gICAgICAgICAgICAgIGlkPVwiYWN0aW9uLTNkXCJcbiAgICAgICAgICAgICAgbWVzc2FnZT17ZHJhZ1JvdGF0ZSA/ICdEaXNhYmxlIDNEIE1hcCcgOiAnM0QgTWFwJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sQnV0dG9uPlxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICB7LyogTWFwIExlZ2VuZCAqL31cbiAgICAgICAgPEFjdGlvblBhbmVsIGtleT17M30+e3RoaXMuX3JlbmRlckxlZ2VuZChpdGVtcyl9PC9BY3Rpb25QYW5lbD5cbiAgICAgICAgey8qIEZ1bGwgU2NyZWVuICovfVxuICAgICAgICA8QWN0aW9uUGFuZWwga2V5PXs0fT5cbiAgICAgICAgICA8U3R5bGVkTWFwQ29udHJvbEJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgb25Ub2dnbGVGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgYWN0aXZlPXtpc0Z1bGxTY3JlZW59XG4gICAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgICAgZGF0YS1mb3I9e2BhY3Rpb24tZnVsbHNjcmVlbl8ke21hcEluZGV4fV8ke2lzRnVsbFNjcmVlbn1gfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpc0Z1bGxTY3JlZW4gPyAoXG4gICAgICAgICAgICAgIDxSZWR1Y2UgaGVpZ2h0PXsnMjJweCd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8RXhwYW5kIGhlaWdodD17JzIycHgnfSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxNYXBMZWdlbmRUb29sdGlwXG4gICAgICAgICAgICAgIGlkPXtgYWN0aW9uLWZ1bGxzY3JlZW5fJHttYXBJbmRleH1fJHtpc0Z1bGxTY3JlZW59YH1cbiAgICAgICAgICAgICAgbWVzc2FnZT17IWlzRnVsbFNjcmVlbiA/ICdHbyBmdWxsIHNjcmVlbicgOiAnRXhpdCBmdWxsIHNjcmVlbid9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3R5bGVkTWFwQ29udHJvbEJ1dHRvbj5cbiAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgIDwvU3R5bGVkTWFwQ29udHJvbD5cbiAgICApO1xuICB9XG59XG5cbk1hcENvbnRyb2wucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuTWFwQ29udHJvbC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcENvbnRyb2w7XG5cbmNvbnN0IE1hcENvbnRyb2xQYW5lbCA9ICh7Y2hpbGRyZW4sIGhlYWRlciwgb25DbGlja30pID0+IChcbiAgPFN0eWxlZE1hcENvbnRyb2xQYW5lbD5cbiAgICA8U3R5bGVkTWFwQ29udHJvbFBhbmVsSGVhZGVyIHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgIDxzcGFuIHN0eWxlPXt7dmVydGljYWxBbGlnbjogJ21pZGRsZSd9fT57aGVhZGVyfTwvc3Bhbj5cbiAgICAgIDxJY29uUm91bmRTbWFsbD5cbiAgICAgICAgPENsb3NlIGhlaWdodD1cIjE2cHhcIiBvbkNsaWNrPXtvbkNsaWNrfSAvPlxuICAgICAgPC9JY29uUm91bmRTbWFsbD5cbiAgICA8L1N0eWxlZE1hcENvbnRyb2xQYW5lbEhlYWRlcj5cbiAgICA8U3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudD57Y2hpbGRyZW59PC9TdHlsZWRNYXBDb250cm9sUGFuZWxDb250ZW50PlxuICA8L1N0eWxlZE1hcENvbnRyb2xQYW5lbD5cbik7XG5cbmNvbnN0IEFjdGlvblBhbmVsID0gKHtjaGlsZHJlbn0pID0+IChcbiAgPFN0eWxlZE1hcENvbnRyb2xBY3Rpb24+e2NoaWxkcmVufTwvU3R5bGVkTWFwQ29udHJvbEFjdGlvbj5cbik7XG5cbmNvbnN0IE1hcExlZ2VuZFRvb2x0aXAgPSAoe2lkLCBtZXNzYWdlfSkgPT4gKFxuICA8VG9vbHRpcCBpZD17aWR9IHBsYWNlPVwibGVmdFwiIGVmZmVjdD1cInNvbGlkXCI+XG4gICAgPHNwYW4+e21lc3NhZ2V9PC9zcGFuPlxuICA8L1Rvb2x0aXA+XG4pO1xuIl19