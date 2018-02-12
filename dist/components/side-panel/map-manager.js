'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

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

var _class, _temp2;

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  padding-bottom: 12px;\n'], ['\n  padding-bottom: 12px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  border-top: 1px solid ', ';\n'], ['\n  border-top: 1px solid ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  height: 48px;\n  margin-bottom: 5px;\n  opacity: 1;\n  position: relative;\n  transition: opacity 0.05s ease-in, height 0.25s ease-out;\n  \n  &.collapsed {\n    height: 0;\n    margin-bottom: 0;\n    opacity: 0;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n\n  .map-title-block img {\n    margin-right: 12px;\n  }\n\n  .map-preview {\n    border-radius: 3px;\n    height: 30px;\n    width: 40px;\n  }\n'], ['\n  height: 48px;\n  margin-bottom: 5px;\n  opacity: 1;\n  position: relative;\n  transition: opacity 0.05s ease-in, height 0.25s ease-out;\n  \n  &.collapsed {\n    height: 0;\n    margin-bottom: 0;\n    opacity: 0;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n\n  .map-title-block img {\n    margin-right: 12px;\n  }\n\n  .map-preview {\n    border-radius: 3px;\n    height: 30px;\n    width: 40px;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  margin-bottom: 10px;\n  display: flex;\n  justify-content: space-between;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n\n  .layer-group__visibility-toggle {\n    margin-right: 12px;\n  }\n'], ['\n  margin-bottom: 10px;\n  display: flex;\n  justify-content: space-between;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n\n  .layer-group__visibility-toggle {\n    margin-right: 12px;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n'], ['\n  color: ', ';\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _switch = require('../common/switch');

var _switch2 = _interopRequireDefault(_switch);

var _infoHelper = require('../common/info-helper');

var _infoHelper2 = _interopRequireDefault(_infoHelper);

var _styledComponents3 = require('../common/styled-components');

var _panelHeaderAction = require('./panel-header-action');

var _panelHeaderAction2 = _interopRequireDefault(_panelHeaderAction);

var _icons = require('../common/icons');

var _colorSelector = require('./layer-panel/color-selector');

var _colorSelector2 = _interopRequireDefault(_colorSelector);

var _visConfigSlider = require('./layer-panel/vis-config-slider');

var _visConfigSlider2 = _interopRequireDefault(_visConfigSlider);

var _layerFactory = require('../../keplergl-layers/layer-factory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledInteractionPanel = _styledComponents2.default.div(_templateObject);

var StyledPanelContent = _styledComponents3.PanelContent.extend(_templateObject2, function (props) {
  return props.theme.panelBorderColor;
});
var MapManager = (_temp2 = _class = function (_Component) {
  (0, _inherits3.default)(MapManager, _Component);

  function MapManager() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MapManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MapManager.__proto__ || Object.getPrototypeOf(MapManager)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isSelecting: false
    }, _this._updateConfig = function (newProp) {
      var newConfig = (0, _extends5.default)({}, _this.props.mapStyle, newProp);
      _this.props.onConfigChange(newConfig);
    }, _this._toggleSelecting = function () {
      _this.setState({ isSelecting: !_this.state.isSelecting });
    }, _this._selectStyle = function (val) {
      _this.props.onStyleChange(val);
      _this._toggleSelecting();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(MapManager, [{
    key: 'render',
    value: function render() {
      var mapStyle = this.props.mapStyle;

      var editableLayers = mapStyle.visibleLayerGroups;

      return _react2.default.createElement(
        'div',
        { className: 'map-style-panel' },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(MapStyleSelector, {
            mapStyle: mapStyle,
            isSelecting: this.state.isSelecting,
            onChange: this._selectStyle,
            toggleActive: this._toggleSelecting
          }),
          Object.keys(editableLayers).length ? _react2.default.createElement(LayerGroupSelector, {
            layers: mapStyle.visibleLayerGroups,
            editableLayers: editableLayers,
            topLayers: mapStyle.topLayerGroups,
            onChange: this._updateConfig
          }) : null
        ),
        _react2.default.createElement(BuildingLayer, {
          buildingLayer: mapStyle.buildingLayer,
          onChange: this.props.onBuildingChange
        })
      );
    }
  }]);
  return MapManager;
}(_react.Component), _class.propTypes = {
  mapStyle: _propTypes2.default.object.isRequired,
  onConfigChange: _propTypes2.default.func.isRequired,
  onStyleChange: _propTypes2.default.func.isRequired,
  onBuildingChange: _propTypes2.default.func.isRequired
}, _temp2);
exports.default = MapManager;


var StyledMapDropdown = _styledComponents3.StyledPanelHeader.extend(_templateObject3, function (props) {
  return props.theme.panelBackgroundHover;
});

var MapStyleSelector = function MapStyleSelector(_ref2) {
  var mapStyle = _ref2.mapStyle,
      onChange = _ref2.onChange,
      toggleActive = _ref2.toggleActive,
      isSelecting = _ref2.isSelecting;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
      null,
      'Map style'
    ),
    Object.keys(mapStyle.mapStyles).map(function (op) {
      return _react2.default.createElement(
        StyledMapDropdown,
        {
          className: (0, _classnames2.default)('map-dropdown-option', {
            collapsed: !isSelecting && mapStyle.styleType !== op
          }),
          key: op,
          onClick: isSelecting ? function () {
            return onChange(op);
          } : toggleActive
        },
        _react2.default.createElement(
          _styledComponents3.PanelHeaderContent,
          { className: 'map-title-block' },
          _react2.default.createElement('img', { className: 'map-preview', src: mapStyle.mapStyles[op].icon }),
          _react2.default.createElement(
            _styledComponents3.PanelHeaderTitle,
            { className: 'map-preview-name' },
            mapStyle.mapStyles[op].label
          )
        ),
        !isSelecting ? _react2.default.createElement(_panelHeaderAction2.default, {
          className: 'map-dropdown-option__enable-config',
          id: 'map-enable-config',
          IconComponent: _icons.ArrowDown,
          tooltip: 'Select Base Map Style',
          onClick: toggleActive
        }) : null
      );
    })
  );
};

var StyledLayerGroupItem = _styledComponents2.default.div(_templateObject4);

var LayerLabel = _styledComponents3.PanelLabelBold.extend(_templateObject5, function (props) {
  return props.active ? props.theme.textColor : props.theme.labelColor;
});
var LayerGroupSelector = function LayerGroupSelector(_ref3) {
  var layers = _ref3.layers,
      editableLayers = _ref3.editableLayers,
      onChange = _ref3.onChange,
      topLayers = _ref3.topLayers;
  return _react2.default.createElement(
    StyledInteractionPanel,
    { className: 'map-style__layer-group__selector' },
    _react2.default.createElement(
      'div',
      { className: 'layer-group__header' },
      _react2.default.createElement(
        _styledComponents3.PanelLabel,
        null,
        'Map Layers'
      )
    ),
    _react2.default.createElement(
      _styledComponents3.PanelContent,
      { className: 'map-style__layer-group' },
      Object.keys(editableLayers).map(function (slug) {
        return _react2.default.createElement(
          StyledLayerGroupItem,
          { className: 'layer-group__select', key: slug },
          _react2.default.createElement(
            _styledComponents3.PanelLabelWrapper,
            null,
            _react2.default.createElement(_panelHeaderAction2.default, {
              className: 'layer-group__visibility-toggle',
              id: slug + '-toggle',
              tooltip: layers[slug] ? 'hide' : 'show',
              onClick: function onClick() {
                return onChange({
                  visibleLayerGroups: (0, _extends5.default)({}, layers, (0, _defineProperty3.default)({}, slug, !layers[slug]))
                });
              },
              IconComponent: layers[slug] ? _icons.EyeSeen : _icons.EyeUnseen,
              active: layers[slug],
              flush: true
            }),
            _react2.default.createElement(
              LayerLabel,
              { active: layers[slug] },
              slug
            )
          ),
          _react2.default.createElement(
            _styledComponents3.CenterFlexbox,
            { className: 'layer-group__bring-top' },
            _react2.default.createElement(_panelHeaderAction2.default, {
              id: slug + '-top',
              tooltip: 'Move to top of data layers',
              disabled: !layers[slug],
              IconComponent: _icons.Upload,
              active: topLayers[slug],
              onClick: function onClick() {
                return onChange({
                  topLayerGroups: (0, _extends5.default)({}, topLayers, (0, _defineProperty3.default)({}, slug, !topLayers[slug]))
                });
              }
            })
          )
        );
      })
    )
  );
};

var BuildingLayer = function BuildingLayer(_ref4) {
  var buildingLayer = _ref4.buildingLayer,
      _onChange = _ref4.onChange;
  return _react2.default.createElement(
    StyledInteractionPanel,
    { className: 'map-style__building-layer' },
    _react2.default.createElement(
      _styledComponents3.StyledPanelHeader,
      { className: 'map-style__building-layer__header' },
      _react2.default.createElement(
        _styledComponents3.PanelHeaderContent,
        null,
        _react2.default.createElement(
          _styledComponents3.PanelLabelWrapper,
          null,
          _react2.default.createElement(
            _styledComponents3.PanelLabel,
            null,
            '3D Buildings'
          ),
          _react2.default.createElement(_infoHelper2.default, {
            id: 'building-info',
            description: '3D building only visible when zoom in to an area of the map'
          })
        )
      ),
      _react2.default.createElement(_switch2.default, {
        checked: buildingLayer.isVisible,
        id: '3d-building-toggle',
        label: '',
        onChange: function onChange() {
          return _onChange({ isVisible: !buildingLayer.isVisible });
        },
        secondary: true
      })
    ),
    buildingLayer.isVisible ? _react2.default.createElement(
      StyledPanelContent,
      { className: 'map-style__building-layer__content' },
      _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        null,
        _react2.default.createElement(
          _styledComponents3.PanelLabel,
          null,
          'Color'
        ),
        _react2.default.createElement(_colorSelector2.default, {
          colorSets: [{
            selectedColor: buildingLayer.color,
            setColor: function setColor(rgbValue) {
              return _onChange({ color: rgbValue });
            }
          }],
          inputTheme: 'secondary'
        })
      ),
      _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        null,
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends5.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, {
          layer: { config: { visConfig: buildingLayer } },
          inputTheme: 'secondary',
          onChange: _onChange
        }))
      )
    ) : null
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiU3R5bGVkSW50ZXJhY3Rpb25QYW5lbCIsImRpdiIsIlN0eWxlZFBhbmVsQ29udGVudCIsImV4dGVuZCIsInByb3BzIiwidGhlbWUiLCJwYW5lbEJvcmRlckNvbG9yIiwiTWFwTWFuYWdlciIsInN0YXRlIiwiaXNTZWxlY3RpbmciLCJfdXBkYXRlQ29uZmlnIiwibmV3Q29uZmlnIiwibWFwU3R5bGUiLCJuZXdQcm9wIiwib25Db25maWdDaGFuZ2UiLCJfdG9nZ2xlU2VsZWN0aW5nIiwic2V0U3RhdGUiLCJfc2VsZWN0U3R5bGUiLCJvblN0eWxlQ2hhbmdlIiwidmFsIiwiZWRpdGFibGVMYXllcnMiLCJ2aXNpYmxlTGF5ZXJHcm91cHMiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwidG9wTGF5ZXJHcm91cHMiLCJidWlsZGluZ0xheWVyIiwib25CdWlsZGluZ0NoYW5nZSIsInByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIiwiU3R5bGVkTWFwRHJvcGRvd24iLCJwYW5lbEJhY2tncm91bmRIb3ZlciIsIk1hcFN0eWxlU2VsZWN0b3IiLCJvbkNoYW5nZSIsInRvZ2dsZUFjdGl2ZSIsIm1hcFN0eWxlcyIsIm1hcCIsImNvbGxhcHNlZCIsInN0eWxlVHlwZSIsIm9wIiwiaWNvbiIsImxhYmVsIiwiU3R5bGVkTGF5ZXJHcm91cEl0ZW0iLCJMYXllckxhYmVsIiwiYWN0aXZlIiwidGV4dENvbG9yIiwibGFiZWxDb2xvciIsIkxheWVyR3JvdXBTZWxlY3RvciIsImxheWVycyIsInRvcExheWVycyIsInNsdWciLCJCdWlsZGluZ0xheWVyIiwiaXNWaXNpYmxlIiwic2VsZWN0ZWRDb2xvciIsImNvbG9yIiwic2V0Q29sb3IiLCJyZ2JWYWx1ZSIsIm9wYWNpdHkiLCJjb25maWciLCJ2aXNDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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QUNwQjtBQUFDLDBCQUFEO0FBQUEsTUFBd0IsV0FBVSwyQkFBbEM7QUFDRTtBQUFBO0FBQUEsUUFBbUIsV0FBVSxtQ0FBN0I7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUNFLGdCQUFHLGVBREw7QUFFRSx5QkFBWTtBQUZkO0FBRkY7QUFERixPQURGO0FBVUU7QUFDRSxpQkFBU1QsY0FBYzRCLFNBRHpCO0FBRUUsZ0NBRkY7QUFHRSxlQUFPLEVBSFQ7QUFJRSxrQkFBVTtBQUFBLGlCQUFNbkIsVUFBUyxFQUFDbUIsV0FBVyxDQUFDNUIsY0FBYzRCLFNBQTNCLEVBQVQsQ0FBTjtBQUFBLFNBSlo7QUFLRTtBQUxGO0FBVkYsS0FERjtBQW1CRzVCLGtCQUFjNEIsU0FBZCxHQUNDO0FBQUMsd0JBQUQ7QUFBQSxRQUFvQixXQUFVLG9DQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERjtBQUVFO0FBQ0UscUJBQVcsQ0FBQztBQUNWQywyQkFBZTdCLGNBQWM4QixLQURuQjtBQUVWQyxzQkFBVTtBQUFBLHFCQUFZdEIsVUFBUyxFQUFDcUIsT0FBT0UsUUFBUixFQUFULENBQVo7QUFBQTtBQUZBLFdBQUQsQ0FEYjtBQUtFLHNCQUFXO0FBTGI7QUFGRixPQURGO0FBV0U7QUFBQTtBQUFBO0FBQ0UsNEZBQ00sZ0NBQWtCQyxPQUR4QjtBQUVFLGlCQUFPLEVBQUNDLFFBQVEsRUFBQ0MsV0FBV25DLGFBQVosRUFBVCxFQUZUO0FBR0Usc0JBQVcsV0FIYjtBQUlFLG9CQUFVUztBQUpaO0FBREY7QUFYRixLQURELEdBcUJHO0FBeENOLEdBRG9CO0FBQUEsQ0FBdEIiLCJmaWxlIjoibWFwLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQgSW5mb0hlbHBlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlcic7XG5pbXBvcnQge1xuICBQYW5lbExhYmVsLFxuICBTdHlsZWRQYW5lbEhlYWRlcixcbiAgUGFuZWxIZWFkZXJUaXRsZSxcbiAgUGFuZWxIZWFkZXJDb250ZW50LFxuICBQYW5lbENvbnRlbnQsXG4gIFBhbmVsTGFiZWxCb2xkLFxuICBQYW5lbExhYmVsV3JhcHBlcixcbiAgQ2VudGVyRmxleGJveCxcbiAgU2lkZVBhbmVsU2VjdGlvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUGFuZWxIZWFkZXJBY3Rpb24gZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL3BhbmVsLWhlYWRlci1hY3Rpb24nO1xuaW1wb3J0IHtBcnJvd0Rvd24sIEV5ZVNlZW4sIEV5ZVVuc2VlbiwgVXBsb2FkfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgQ29sb3JTZWxlY3RvciBmcm9tICcuL2xheWVyLXBhbmVsL2NvbG9yLXNlbGVjdG9yJztcbmltcG9ydCBWaXNDb25maWdTbGlkZXIgZnJvbSAnLi9sYXllci1wYW5lbC92aXMtY29uZmlnLXNsaWRlcic7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdrZXBsZXJnbC1sYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5cbmNvbnN0IFN0eWxlZEludGVyYWN0aW9uUGFuZWwgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWJvdHRvbTogMTJweDtcbmA7XG5cbmNvbnN0IFN0eWxlZFBhbmVsQ29udGVudCA9IFBhbmVsQ29udGVudC5leHRlbmRgXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm9yZGVyQ29sb3J9O1xuYDtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcE1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1hcFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb25Db25maWdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25TdHlsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkJ1aWxkaW5nQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH07XG5cbiAgc3RhdGUgPSB7XG4gICAgaXNTZWxlY3Rpbmc6IGZhbHNlXG4gIH07XG5cbiAgX3VwZGF0ZUNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgIGNvbnN0IG5ld0NvbmZpZyA9IHsuLi50aGlzLnByb3BzLm1hcFN0eWxlLCAuLi5uZXdQcm9wfTtcbiAgICB0aGlzLnByb3BzLm9uQ29uZmlnQ2hhbmdlKG5ld0NvbmZpZyk7XG4gIH07XG5cbiAgX3RvZ2dsZVNlbGVjdGluZyA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc1NlbGVjdGluZzogIXRoaXMuc3RhdGUuaXNTZWxlY3Rpbmd9KTtcbiAgfTtcblxuICBfc2VsZWN0U3R5bGUgPSB2YWwgPT4ge1xuICAgIHRoaXMucHJvcHMub25TdHlsZUNoYW5nZSh2YWwpO1xuICAgIHRoaXMuX3RvZ2dsZVNlbGVjdGluZygpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFwU3R5bGV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBlZGl0YWJsZUxheWVycyA9IG1hcFN0eWxlLnZpc2libGVMYXllckdyb3VwcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1zdHlsZS1wYW5lbFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxNYXBTdHlsZVNlbGVjdG9yXG4gICAgICAgICAgICBtYXBTdHlsZT17bWFwU3R5bGV9XG4gICAgICAgICAgICBpc1NlbGVjdGluZz17dGhpcy5zdGF0ZS5pc1NlbGVjdGluZ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9zZWxlY3RTdHlsZX1cbiAgICAgICAgICAgIHRvZ2dsZUFjdGl2ZT17dGhpcy5fdG9nZ2xlU2VsZWN0aW5nfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge09iamVjdC5rZXlzKGVkaXRhYmxlTGF5ZXJzKS5sZW5ndGggPyAoXG4gICAgICAgICAgICA8TGF5ZXJHcm91cFNlbGVjdG9yXG4gICAgICAgICAgICAgIGxheWVycz17bWFwU3R5bGUudmlzaWJsZUxheWVyR3JvdXBzfVxuICAgICAgICAgICAgICBlZGl0YWJsZUxheWVycz17ZWRpdGFibGVMYXllcnN9XG4gICAgICAgICAgICAgIHRvcExheWVycz17bWFwU3R5bGUudG9wTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl91cGRhdGVDb25maWd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEJ1aWxkaW5nTGF5ZXJcbiAgICAgICAgICBidWlsZGluZ0xheWVyPXttYXBTdHlsZS5idWlsZGluZ0xheWVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLm9uQnVpbGRpbmdDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFN0eWxlZE1hcERyb3Bkb3duID0gU3R5bGVkUGFuZWxIZWFkZXIuZXh0ZW5kYFxuICBoZWlnaHQ6IDQ4cHg7XG4gIG1hcmdpbi1ib3R0b206IDVweDtcbiAgb3BhY2l0eTogMTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMDVzIGVhc2UtaW4sIGhlaWdodCAwLjI1cyBlYXNlLW91dDtcbiAgXG4gICYuY29sbGFwc2VkIHtcbiAgICBoZWlnaHQ6IDA7XG4gICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRIb3Zlcn07XG4gIH1cblxuICAubWFwLXRpdGxlLWJsb2NrIGltZyB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xuICB9XG5cbiAgLm1hcC1wcmV2aWV3IHtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgaGVpZ2h0OiAzMHB4O1xuICAgIHdpZHRoOiA0MHB4O1xuICB9XG5gO1xuXG5jb25zdCBNYXBTdHlsZVNlbGVjdG9yID0gKHttYXBTdHlsZSwgb25DaGFuZ2UsIHRvZ2dsZUFjdGl2ZSwgaXNTZWxlY3Rpbmd9KSA9PiAoXG4gIDxkaXY+XG4gICAgPFBhbmVsTGFiZWw+TWFwIHN0eWxlPC9QYW5lbExhYmVsPlxuICAgIHtPYmplY3Qua2V5cyhtYXBTdHlsZS5tYXBTdHlsZXMpLm1hcChvcCA9PiAoXG4gICAgICA8U3R5bGVkTWFwRHJvcGRvd25cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdtYXAtZHJvcGRvd24tb3B0aW9uJywge1xuICAgICAgICAgIGNvbGxhcHNlZDogIWlzU2VsZWN0aW5nICYmIG1hcFN0eWxlLnN0eWxlVHlwZSAhPT0gb3BcbiAgICAgICAgfSl9XG4gICAgICAgIGtleT17b3B9XG4gICAgICAgIG9uQ2xpY2s9e2lzU2VsZWN0aW5nID8gKCkgPT4gb25DaGFuZ2Uob3ApIDogdG9nZ2xlQWN0aXZlfVxuICAgICAgPlxuICAgICAgICA8UGFuZWxIZWFkZXJDb250ZW50IGNsYXNzTmFtZT1cIm1hcC10aXRsZS1ibG9ja1wiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwibWFwLXByZXZpZXdcIiBzcmM9e21hcFN0eWxlLm1hcFN0eWxlc1tvcF0uaWNvbn0gLz5cbiAgICAgICAgICA8UGFuZWxIZWFkZXJUaXRsZSBjbGFzc05hbWU9XCJtYXAtcHJldmlldy1uYW1lXCI+XG4gICAgICAgICAgICB7bWFwU3R5bGUubWFwU3R5bGVzW29wXS5sYWJlbH1cbiAgICAgICAgICA8L1BhbmVsSGVhZGVyVGl0bGU+XG4gICAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICB7IWlzU2VsZWN0aW5nID8gKFxuICAgICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibWFwLWRyb3Bkb3duLW9wdGlvbl9fZW5hYmxlLWNvbmZpZ1wiXG4gICAgICAgICAgICBpZD1cIm1hcC1lbmFibGUtY29uZmlnXCJcbiAgICAgICAgICAgIEljb25Db21wb25lbnQ9e0Fycm93RG93bn1cbiAgICAgICAgICAgIHRvb2x0aXA9eydTZWxlY3QgQmFzZSBNYXAgU3R5bGUnfVxuICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlQWN0aXZlfVxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9TdHlsZWRNYXBEcm9wZG93bj5cbiAgICApKX1cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBTdHlsZWRMYXllckdyb3VwSXRlbSA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAmOmxhc3QtY2hpbGQge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gIH1cblxuICAubGF5ZXItZ3JvdXBfX3Zpc2liaWxpdHktdG9nZ2xlIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDEycHg7XG4gIH1cbmA7XG5cbmNvbnN0IExheWVyTGFiZWwgPSBQYW5lbExhYmVsQm9sZC5leHRlbmRgXG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUudGV4dENvbG9yIDogcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG5gO1xuY29uc3QgTGF5ZXJHcm91cFNlbGVjdG9yID0gKHtsYXllcnMsIGVkaXRhYmxlTGF5ZXJzLCBvbkNoYW5nZSwgdG9wTGF5ZXJzfSkgPT4gKFxuICA8U3R5bGVkSW50ZXJhY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJtYXAtc3R5bGVfX2xheWVyLWdyb3VwX19zZWxlY3RvclwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX2hlYWRlclwiPlxuICAgICAgPFBhbmVsTGFiZWw+TWFwIExheWVyczwvUGFuZWxMYWJlbD5cbiAgICA8L2Rpdj5cbiAgICA8UGFuZWxDb250ZW50IGNsYXNzTmFtZT1cIm1hcC1zdHlsZV9fbGF5ZXItZ3JvdXBcIj5cbiAgICAgIHtPYmplY3Qua2V5cyhlZGl0YWJsZUxheWVycykubWFwKHNsdWcgPT4gKFxuICAgICAgICA8U3R5bGVkTGF5ZXJHcm91cEl0ZW0gY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX3NlbGVjdFwiIGtleT17c2x1Z30+XG4gICAgICAgICAgPFBhbmVsTGFiZWxXcmFwcGVyPlxuICAgICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxheWVyLWdyb3VwX192aXNpYmlsaXR5LXRvZ2dsZVwiXG4gICAgICAgICAgICAgIGlkPXtgJHtzbHVnfS10b2dnbGVgfVxuICAgICAgICAgICAgICB0b29sdGlwPXtsYXllcnNbc2x1Z10gPyAnaGlkZScgOiAnc2hvdyd9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgb25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgICAgdmlzaWJsZUxheWVyR3JvdXBzOiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmxheWVycyxcbiAgICAgICAgICAgICAgICAgICAgW3NsdWddOiAhbGF5ZXJzW3NsdWddXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXtsYXllcnNbc2x1Z10gPyBFeWVTZWVuIDogRXllVW5zZWVufVxuICAgICAgICAgICAgICBhY3RpdmU9e2xheWVyc1tzbHVnXX1cbiAgICAgICAgICAgICAgZmx1c2hcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8TGF5ZXJMYWJlbCBhY3RpdmU9e2xheWVyc1tzbHVnXX0+e3NsdWd9PC9MYXllckxhYmVsPlxuICAgICAgICAgIDwvUGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICAgICAgPENlbnRlckZsZXhib3ggY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX2JyaW5nLXRvcFwiPlxuICAgICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICAgIGlkPXtgJHtzbHVnfS10b3BgfVxuICAgICAgICAgICAgICB0b29sdGlwPVwiTW92ZSB0byB0b3Agb2YgZGF0YSBsYXllcnNcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyc1tzbHVnXX1cbiAgICAgICAgICAgICAgSWNvbkNvbXBvbmVudD17VXBsb2FkfVxuICAgICAgICAgICAgICBhY3RpdmU9e3RvcExheWVyc1tzbHVnXX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgICB0b3BMYXllckdyb3Vwczoge1xuICAgICAgICAgICAgICAgICAgICAuLi50b3BMYXllcnMsXG4gICAgICAgICAgICAgICAgICAgIFtzbHVnXTogIXRvcExheWVyc1tzbHVnXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9DZW50ZXJGbGV4Ym94PlxuICAgICAgICA8L1N0eWxlZExheWVyR3JvdXBJdGVtPlxuICAgICAgKSl9XG4gICAgPC9QYW5lbENvbnRlbnQ+XG4gIDwvU3R5bGVkSW50ZXJhY3Rpb25QYW5lbD5cbik7XG5cbmNvbnN0IEJ1aWxkaW5nTGF5ZXIgPSAoe2J1aWxkaW5nTGF5ZXIsIG9uQ2hhbmdlfSkgPT4gKFxuICA8U3R5bGVkSW50ZXJhY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJtYXAtc3R5bGVfX2J1aWxkaW5nLWxheWVyXCI+XG4gICAgPFN0eWxlZFBhbmVsSGVhZGVyIGNsYXNzTmFtZT1cIm1hcC1zdHlsZV9fYnVpbGRpbmctbGF5ZXJfX2hlYWRlclwiPlxuICAgICAgPFBhbmVsSGVhZGVyQ29udGVudD5cbiAgICAgICAgPFBhbmVsTGFiZWxXcmFwcGVyPlxuICAgICAgICAgIDxQYW5lbExhYmVsPjNEIEJ1aWxkaW5nczwvUGFuZWxMYWJlbD5cbiAgICAgICAgICA8SW5mb0hlbHBlclxuICAgICAgICAgICAgaWQ9XCJidWlsZGluZy1pbmZvXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uPVwiM0QgYnVpbGRpbmcgb25seSB2aXNpYmxlIHdoZW4gem9vbSBpbiB0byBhbiBhcmVhIG9mIHRoZSBtYXBcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvUGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICA8L1BhbmVsSGVhZGVyQ29udGVudD5cbiAgICAgIDxTd2l0Y2hcbiAgICAgICAgY2hlY2tlZD17YnVpbGRpbmdMYXllci5pc1Zpc2libGV9XG4gICAgICAgIGlkPXtgM2QtYnVpbGRpbmctdG9nZ2xlYH1cbiAgICAgICAgbGFiZWw9eycnfVxuICAgICAgICBvbkNoYW5nZT17KCkgPT4gb25DaGFuZ2Uoe2lzVmlzaWJsZTogIWJ1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlfSl9XG4gICAgICAgIHNlY29uZGFyeVxuICAgICAgLz5cbiAgICA8L1N0eWxlZFBhbmVsSGVhZGVyPlxuICAgIHtidWlsZGluZ0xheWVyLmlzVmlzaWJsZSA/IChcbiAgICAgIDxTdHlsZWRQYW5lbENvbnRlbnQgY2xhc3NOYW1lPVwibWFwLXN0eWxlX19idWlsZGluZy1sYXllcl9fY29udGVudFwiPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8UGFuZWxMYWJlbD5Db2xvcjwvUGFuZWxMYWJlbD5cbiAgICAgICAgICA8Q29sb3JTZWxlY3RvclxuICAgICAgICAgICAgY29sb3JTZXRzPXtbe1xuICAgICAgICAgICAgICBzZWxlY3RlZENvbG9yOiBidWlsZGluZ0xheWVyLmNvbG9yLFxuICAgICAgICAgICAgICBzZXRDb2xvcjogcmdiVmFsdWUgPT4gb25DaGFuZ2Uoe2NvbG9yOiByZ2JWYWx1ZX0pXG4gICAgICAgICAgICB9XX1cbiAgICAgICAgICAgIGlucHV0VGhlbWU9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICBsYXllcj17e2NvbmZpZzoge3Zpc0NvbmZpZzogYnVpbGRpbmdMYXllcn19fVxuICAgICAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgPC9TdHlsZWRQYW5lbENvbnRlbnQ+XG4gICAgKSA6IG51bGx9XG4gIDwvU3R5bGVkSW50ZXJhY3Rpb25QYW5lbD5cbik7XG4iXX0=