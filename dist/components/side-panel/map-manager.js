'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _class, _temp2;

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding-bottom: 12px;\n'], ['\n  padding-bottom: 12px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-top: 1px solid ', ';\n'], ['\n  border-top: 1px solid ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  height: 48px;\n  margin-bottom: 5px;\n  opacity: 1;\n  position: relative;\n  transition: opacity 0.05s ease-in, height 0.25s ease-out;\n  \n  &.collapsed {\n    height: 0;\n    margin-bottom: 0;\n    opacity: 0;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n\n  .map-title-block img {\n    margin-right: 12px;\n  }\n\n  .map-preview {\n    border-radius: 3px;\n    height: 30px;\n    width: 40px;\n  }\n'], ['\n  height: 48px;\n  margin-bottom: 5px;\n  opacity: 1;\n  position: relative;\n  transition: opacity 0.05s ease-in, height 0.25s ease-out;\n  \n  &.collapsed {\n    height: 0;\n    margin-bottom: 0;\n    opacity: 0;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n\n  .map-title-block img {\n    margin-right: 12px;\n  }\n\n  .map-preview {\n    border-radius: 3px;\n    height: 30px;\n    width: 40px;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-bottom: 10px;\n  display: flex;\n  justify-content: space-between;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n\n  .layer-group__visibility-toggle {\n    margin-right: 12px;\n  }\n'], ['\n  margin-bottom: 10px;\n  display: flex;\n  justify-content: space-between;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n\n  .layer-group__visibility-toggle {\n    margin-right: 12px;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n'], ['\n  color: ', ';\n']);

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
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MapManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
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

  MapManager.prototype.render = function render() {
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
  };

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

var MapStyleSelector = function MapStyleSelector(_ref) {
  var mapStyle = _ref.mapStyle,
      onChange = _ref.onChange,
      toggleActive = _ref.toggleActive,
      isSelecting = _ref.isSelecting;
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
var LayerGroupSelector = function LayerGroupSelector(_ref2) {
  var layers = _ref2.layers,
      editableLayers = _ref2.editableLayers,
      onChange = _ref2.onChange,
      topLayers = _ref2.topLayers;
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
                var _extends2;

                return onChange({
                  visibleLayerGroups: (0, _extends5.default)({}, layers, (_extends2 = {}, _extends2[slug] = !layers[slug], _extends2))
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
                var _extends3;

                return onChange({
                  topLayerGroups: (0, _extends5.default)({}, topLayers, (_extends3 = {}, _extends3[slug] = !topLayers[slug], _extends3))
                });
              }
            })
          )
        );
      })
    )
  );
};

var BuildingLayer = function BuildingLayer(_ref3) {
  var buildingLayer = _ref3.buildingLayer,
      _onChange = _ref3.onChange;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiU3R5bGVkSW50ZXJhY3Rpb25QYW5lbCIsImRpdiIsIlN0eWxlZFBhbmVsQ29udGVudCIsImV4dGVuZCIsInByb3BzIiwidGhlbWUiLCJwYW5lbEJvcmRlckNvbG9yIiwiTWFwTWFuYWdlciIsInN0YXRlIiwiaXNTZWxlY3RpbmciLCJfdXBkYXRlQ29uZmlnIiwibmV3Q29uZmlnIiwibWFwU3R5bGUiLCJuZXdQcm9wIiwib25Db25maWdDaGFuZ2UiLCJfdG9nZ2xlU2VsZWN0aW5nIiwic2V0U3RhdGUiLCJfc2VsZWN0U3R5bGUiLCJvblN0eWxlQ2hhbmdlIiwidmFsIiwicmVuZGVyIiwiZWRpdGFibGVMYXllcnMiLCJ2aXNpYmxlTGF5ZXJHcm91cHMiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwidG9wTGF5ZXJHcm91cHMiLCJidWlsZGluZ0xheWVyIiwib25CdWlsZGluZ0NoYW5nZSIsInByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIiwiU3R5bGVkTWFwRHJvcGRvd24iLCJwYW5lbEJhY2tncm91bmRIb3ZlciIsIk1hcFN0eWxlU2VsZWN0b3IiLCJvbkNoYW5nZSIsInRvZ2dsZUFjdGl2ZSIsIm1hcFN0eWxlcyIsIm1hcCIsImNvbGxhcHNlZCIsInN0eWxlVHlwZSIsIm9wIiwiaWNvbiIsImxhYmVsIiwiU3R5bGVkTGF5ZXJHcm91cEl0ZW0iLCJMYXllckxhYmVsIiwiYWN0aXZlIiwidGV4dENvbG9yIiwibGFiZWxDb2xvciIsIkxheWVyR3JvdXBTZWxlY3RvciIsImxheWVycyIsInRvcExheWVycyIsInNsdWciLCJCdWlsZGluZ0xheWVyIiwiaXNWaXNpYmxlIiwic2VsZWN0ZWRDb2xvciIsImNvbG9yIiwic2V0Q29sb3IiLCJyZ2JWYWx1ZSIsIm9wYWNpdHkiLCJjb25maWciLCJ2aXNDb25maWciXSwibWFwcGluZ3Mi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LFNBQWlCQSxRQUFqQjtBQUFBLFNBQ3BCO0FBQUMsMEJBQUQ7QUFBQSxNQUF3QixXQUFVLDJCQUFsQztBQUNFO0FBQUE7QUFBQSxRQUFtQixXQUFVLG1DQUE3QjtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQ0UsZ0JBQUcsZUFETDtBQUVFLHlCQUFZO0FBRmQ7QUFGRjtBQURGLE9BREY7QUFVRTtBQUNFLGlCQUFTVCxjQUFjNEIsU0FEekI7QUFFRSxnQ0FGRjtBQUdFLGVBQU8sRUFIVDtBQUlFLGtCQUFVO0FBQUEsaUJBQU1uQixVQUFTLEVBQUNtQixXQUFXLENBQUM1QixjQUFjNEIsU0FBM0IsRUFBVCxDQUFOO0FBQUEsU0FKWjtBQUtFO0FBTEY7QUFWRixLQURGO0FBbUJHNUIsa0JBQWM0QixTQUFkLEdBQ0M7QUFBQyx3QkFBRDtBQUFBLFFBQW9CLFdBQVUsb0NBQTlCO0FBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURGO0FBRUU7QUFDRSxxQkFBVyxDQUFDO0FBQ1ZDLDJCQUFlN0IsY0FBYzhCLEtBRG5CO0FBRVZDLHNCQUFVO0FBQUEscUJBQVl0QixVQUFTLEVBQUNxQixPQUFPRSxRQUFSLEVBQVQsQ0FBWjtBQUFBO0FBRkEsV0FBRCxDQURiO0FBS0Usc0JBQVc7QUFMYjtBQUZGLE9BREY7QUFXRTtBQUFBO0FBQUE7QUFDRSw0RkFDTSxnQ0FBa0JDLE9BRHhCO0FBRUUsaUJBQU8sRUFBQ0MsUUFBUSxFQUFDQyxXQUFXbkMsYUFBWixFQUFULEVBRlQ7QUFHRSxzQkFBVyxXQUhiO0FBSUUsb0JBQVVTO0FBSlo7QUFERjtBQVhGLEtBREQsR0FxQkc7QUF4Q04sR0FEb0I7QUFBQSxDQUF0QiIsImZpbGUiOiJtYXAtbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBTd2l0Y2ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcbmltcG9ydCBJbmZvSGVscGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2luZm8taGVscGVyJztcbmltcG9ydCB7XG4gIFBhbmVsTGFiZWwsXG4gIFN0eWxlZFBhbmVsSGVhZGVyLFxuICBQYW5lbEhlYWRlclRpdGxlLFxuICBQYW5lbEhlYWRlckNvbnRlbnQsXG4gIFBhbmVsQ29udGVudCxcbiAgUGFuZWxMYWJlbEJvbGQsXG4gIFBhbmVsTGFiZWxXcmFwcGVyLFxuICBDZW50ZXJGbGV4Ym94LFxuICBTaWRlUGFuZWxTZWN0aW9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQYW5lbEhlYWRlckFjdGlvbiBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbic7XG5pbXBvcnQge0Fycm93RG93biwgRXllU2VlbiwgRXllVW5zZWVuLCBVcGxvYWR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBDb2xvclNlbGVjdG9yIGZyb20gJy4vbGF5ZXItcGFuZWwvY29sb3Itc2VsZWN0b3InO1xuaW1wb3J0IFZpc0NvbmZpZ1NsaWRlciBmcm9tICcuL2xheWVyLXBhbmVsL3Zpcy1jb25maWctc2xpZGVyJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2tlcGxlcmdsLWxheWVycy9sYXllci1mYWN0b3J5JztcblxuY29uc3QgU3R5bGVkSW50ZXJhY3Rpb25QYW5lbCA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmctYm90dG9tOiAxMnB4O1xuYDtcblxuY29uc3QgU3R5bGVkUGFuZWxDb250ZW50ID0gUGFuZWxDb250ZW50LmV4dGVuZGBcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3JkZXJDb2xvcn07XG5gO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwTWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBvbkNvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvblN0eWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uQnVpbGRpbmdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICBpc1NlbGVjdGluZzogZmFsc2VcbiAgfTtcblxuICBfdXBkYXRlQ29uZmlnID0gbmV3UHJvcCA9PiB7XG4gICAgY29uc3QgbmV3Q29uZmlnID0gey4uLnRoaXMucHJvcHMubWFwU3R5bGUsIC4uLm5ld1Byb3B9O1xuICAgIHRoaXMucHJvcHMub25Db25maWdDaGFuZ2UobmV3Q29uZmlnKTtcbiAgfTtcblxuICBfdG9nZ2xlU2VsZWN0aW5nID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzU2VsZWN0aW5nOiAhdGhpcy5zdGF0ZS5pc1NlbGVjdGluZ30pO1xuICB9O1xuXG4gIF9zZWxlY3RTdHlsZSA9IHZhbCA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblN0eWxlQ2hhbmdlKHZhbCk7XG4gICAgdGhpcy5fdG9nZ2xlU2VsZWN0aW5nKCk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXBTdHlsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGVkaXRhYmxlTGF5ZXJzID0gbWFwU3R5bGUudmlzaWJsZUxheWVyR3JvdXBzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwLXN0eWxlLXBhbmVsXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPE1hcFN0eWxlU2VsZWN0b3JcbiAgICAgICAgICAgIG1hcFN0eWxlPXttYXBTdHlsZX1cbiAgICAgICAgICAgIGlzU2VsZWN0aW5nPXt0aGlzLnN0YXRlLmlzU2VsZWN0aW5nfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX3NlbGVjdFN0eWxlfVxuICAgICAgICAgICAgdG9nZ2xlQWN0aXZlPXt0aGlzLl90b2dnbGVTZWxlY3Rpbmd9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7T2JqZWN0LmtleXMoZWRpdGFibGVMYXllcnMpLmxlbmd0aCA/IChcbiAgICAgICAgICAgIDxMYXllckdyb3VwU2VsZWN0b3JcbiAgICAgICAgICAgICAgbGF5ZXJzPXttYXBTdHlsZS52aXNpYmxlTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICAgIGVkaXRhYmxlTGF5ZXJzPXtlZGl0YWJsZUxheWVyc31cbiAgICAgICAgICAgICAgdG9wTGF5ZXJzPXttYXBTdHlsZS50b3BMYXllckdyb3Vwc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX3VwZGF0ZUNvbmZpZ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8QnVpbGRpbmdMYXllclxuICAgICAgICAgIGJ1aWxkaW5nTGF5ZXI9e21hcFN0eWxlLmJ1aWxkaW5nTGF5ZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25CdWlsZGluZ0NoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgU3R5bGVkTWFwRHJvcGRvd24gPSBTdHlsZWRQYW5lbEhlYWRlci5leHRlbmRgXG4gIGhlaWdodDogNDhweDtcbiAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICBvcGFjaXR5OiAxO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4wNXMgZWFzZS1pbiwgaGVpZ2h0IDAuMjVzIGVhc2Utb3V0O1xuICBcbiAgJi5jb2xsYXBzZWQge1xuICAgIGhlaWdodDogMDtcbiAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcbiAgfVxuXG4gIC5tYXAtdGl0bGUtYmxvY2sgaW1nIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDEycHg7XG4gIH1cblxuICAubWFwLXByZXZpZXcge1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBoZWlnaHQ6IDMwcHg7XG4gICAgd2lkdGg6IDQwcHg7XG4gIH1cbmA7XG5cbmNvbnN0IE1hcFN0eWxlU2VsZWN0b3IgPSAoe21hcFN0eWxlLCBvbkNoYW5nZSwgdG9nZ2xlQWN0aXZlLCBpc1NlbGVjdGluZ30pID0+IChcbiAgPGRpdj5cbiAgICA8UGFuZWxMYWJlbD5NYXAgc3R5bGU8L1BhbmVsTGFiZWw+XG4gICAge09iamVjdC5rZXlzKG1hcFN0eWxlLm1hcFN0eWxlcykubWFwKG9wID0+IChcbiAgICAgIDxTdHlsZWRNYXBEcm9wZG93blxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ21hcC1kcm9wZG93bi1vcHRpb24nLCB7XG4gICAgICAgICAgY29sbGFwc2VkOiAhaXNTZWxlY3RpbmcgJiYgbWFwU3R5bGUuc3R5bGVUeXBlICE9PSBvcFxuICAgICAgICB9KX1cbiAgICAgICAga2V5PXtvcH1cbiAgICAgICAgb25DbGljaz17aXNTZWxlY3RpbmcgPyAoKSA9PiBvbkNoYW5nZShvcCkgOiB0b2dnbGVBY3RpdmV9XG4gICAgICA+XG4gICAgICAgIDxQYW5lbEhlYWRlckNvbnRlbnQgY2xhc3NOYW1lPVwibWFwLXRpdGxlLWJsb2NrXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJtYXAtcHJldmlld1wiIHNyYz17bWFwU3R5bGUubWFwU3R5bGVzW29wXS5pY29ufSAvPlxuICAgICAgICAgIDxQYW5lbEhlYWRlclRpdGxlIGNsYXNzTmFtZT1cIm1hcC1wcmV2aWV3LW5hbWVcIj5cbiAgICAgICAgICAgIHttYXBTdHlsZS5tYXBTdHlsZXNbb3BdLmxhYmVsfVxuICAgICAgICAgIDwvUGFuZWxIZWFkZXJUaXRsZT5cbiAgICAgICAgPC9QYW5lbEhlYWRlckNvbnRlbnQ+XG4gICAgICAgIHshaXNTZWxlY3RpbmcgPyAoXG4gICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJtYXAtZHJvcGRvd24tb3B0aW9uX19lbmFibGUtY29uZmlnXCJcbiAgICAgICAgICAgIGlkPVwibWFwLWVuYWJsZS1jb25maWdcIlxuICAgICAgICAgICAgSWNvbkNvbXBvbmVudD17QXJyb3dEb3dufVxuICAgICAgICAgICAgdG9vbHRpcD17J1NlbGVjdCBCYXNlIE1hcCBTdHlsZSd9XG4gICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVBY3RpdmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L1N0eWxlZE1hcERyb3Bkb3duPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IFN0eWxlZExheWVyR3JvdXBJdGVtID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICY6bGFzdC1jaGlsZCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgfVxuXG4gIC5sYXllci1ncm91cF9fdmlzaWJpbGl0eS10b2dnbGUge1xuICAgIG1hcmdpbi1yaWdodDogMTJweDtcbiAgfVxuYDtcblxuY29uc3QgTGF5ZXJMYWJlbCA9IFBhbmVsTGFiZWxCb2xkLmV4dGVuZGBcbiAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3IgOiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbmA7XG5jb25zdCBMYXllckdyb3VwU2VsZWN0b3IgPSAoe2xheWVycywgZWRpdGFibGVMYXllcnMsIG9uQ2hhbmdlLCB0b3BMYXllcnN9KSA9PiAoXG4gIDxTdHlsZWRJbnRlcmFjdGlvblBhbmVsIGNsYXNzTmFtZT1cIm1hcC1zdHlsZV9fbGF5ZXItZ3JvdXBfX3NlbGVjdG9yXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1ncm91cF9faGVhZGVyXCI+XG4gICAgICA8UGFuZWxMYWJlbD5NYXAgTGF5ZXJzPC9QYW5lbExhYmVsPlxuICAgIDwvZGl2PlxuICAgIDxQYW5lbENvbnRlbnQgY2xhc3NOYW1lPVwibWFwLXN0eWxlX19sYXllci1ncm91cFwiPlxuICAgICAge09iamVjdC5rZXlzKGVkaXRhYmxlTGF5ZXJzKS5tYXAoc2x1ZyA9PiAoXG4gICAgICAgIDxTdHlsZWRMYXllckdyb3VwSXRlbSBjbGFzc05hbWU9XCJsYXllci1ncm91cF9fc2VsZWN0XCIga2V5PXtzbHVnfT5cbiAgICAgICAgICA8UGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICAgICAgICA8UGFuZWxIZWFkZXJBY3Rpb25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX3Zpc2liaWxpdHktdG9nZ2xlXCJcbiAgICAgICAgICAgICAgaWQ9e2Ake3NsdWd9LXRvZ2dsZWB9XG4gICAgICAgICAgICAgIHRvb2x0aXA9e2xheWVyc1tzbHVnXSA/ICdoaWRlJyA6ICdzaG93J31cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgICB2aXNpYmxlTGF5ZXJHcm91cHM6IHtcbiAgICAgICAgICAgICAgICAgICAgLi4ubGF5ZXJzLFxuICAgICAgICAgICAgICAgICAgICBbc2x1Z106ICFsYXllcnNbc2x1Z11cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIEljb25Db21wb25lbnQ9e2xheWVyc1tzbHVnXSA/IEV5ZVNlZW4gOiBFeWVVbnNlZW59XG4gICAgICAgICAgICAgIGFjdGl2ZT17bGF5ZXJzW3NsdWddfVxuICAgICAgICAgICAgICBmbHVzaFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxMYXllckxhYmVsIGFjdGl2ZT17bGF5ZXJzW3NsdWddfT57c2x1Z308L0xheWVyTGFiZWw+XG4gICAgICAgICAgPC9QYW5lbExhYmVsV3JhcHBlcj5cbiAgICAgICAgICA8Q2VudGVyRmxleGJveCBjbGFzc05hbWU9XCJsYXllci1ncm91cF9fYnJpbmctdG9wXCI+XG4gICAgICAgICAgICA8UGFuZWxIZWFkZXJBY3Rpb25cbiAgICAgICAgICAgICAgaWQ9e2Ake3NsdWd9LXRvcGB9XG4gICAgICAgICAgICAgIHRvb2x0aXA9XCJNb3ZlIHRvIHRvcCBvZiBkYXRhIGxheWVyc1wiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXJzW3NsdWddfVxuICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXtVcGxvYWR9XG4gICAgICAgICAgICAgIGFjdGl2ZT17dG9wTGF5ZXJzW3NsdWddfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAgIHRvcExheWVyR3JvdXBzOiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRvcExheWVycyxcbiAgICAgICAgICAgICAgICAgICAgW3NsdWddOiAhdG9wTGF5ZXJzW3NsdWddXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0NlbnRlckZsZXhib3g+XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJHcm91cEl0ZW0+XG4gICAgICApKX1cbiAgICA8L1BhbmVsQ29udGVudD5cbiAgPC9TdHlsZWRJbnRlcmFjdGlvblBhbmVsPlxuKTtcblxuY29uc3QgQnVpbGRpbmdMYXllciA9ICh7YnVpbGRpbmdMYXllciwgb25DaGFuZ2V9KSA9PiAoXG4gIDxTdHlsZWRJbnRlcmFjdGlvblBhbmVsIGNsYXNzTmFtZT1cIm1hcC1zdHlsZV9fYnVpbGRpbmctbGF5ZXJcIj5cbiAgICA8U3R5bGVkUGFuZWxIZWFkZXIgY2xhc3NOYW1lPVwibWFwLXN0eWxlX19idWlsZGluZy1sYXllcl9faGVhZGVyXCI+XG4gICAgICA8UGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICA8UGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICAgICAgPFBhbmVsTGFiZWw+M0QgQnVpbGRpbmdzPC9QYW5lbExhYmVsPlxuICAgICAgICAgIDxJbmZvSGVscGVyXG4gICAgICAgICAgICBpZD1cImJ1aWxkaW5nLWluZm9cIlxuICAgICAgICAgICAgZGVzY3JpcHRpb249XCIzRCBidWlsZGluZyBvbmx5IHZpc2libGUgd2hlbiB6b29tIGluIHRvIGFuIGFyZWEgb2YgdGhlIG1hcFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9QYW5lbExhYmVsV3JhcHBlcj5cbiAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgPFN3aXRjaFxuICAgICAgICBjaGVja2VkPXtidWlsZGluZ0xheWVyLmlzVmlzaWJsZX1cbiAgICAgICAgaWQ9e2AzZC1idWlsZGluZy10b2dnbGVgfVxuICAgICAgICBsYWJlbD17Jyd9XG4gICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSh7aXNWaXNpYmxlOiAhYnVpbGRpbmdMYXllci5pc1Zpc2libGV9KX1cbiAgICAgICAgc2Vjb25kYXJ5XG4gICAgICAvPlxuICAgIDwvU3R5bGVkUGFuZWxIZWFkZXI+XG4gICAge2J1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlID8gKFxuICAgICAgPFN0eWxlZFBhbmVsQ29udGVudCBjbGFzc05hbWU9XCJtYXAtc3R5bGVfX2J1aWxkaW5nLWxheWVyX19jb250ZW50XCI+XG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgIDxQYW5lbExhYmVsPkNvbG9yPC9QYW5lbExhYmVsPlxuICAgICAgICAgIDxDb2xvclNlbGVjdG9yXG4gICAgICAgICAgICBjb2xvclNldHM9e1t7XG4gICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IGJ1aWxkaW5nTGF5ZXIuY29sb3IsXG4gICAgICAgICAgICAgIHNldENvbG9yOiByZ2JWYWx1ZSA9PiBvbkNoYW5nZSh7Y29sb3I6IHJnYlZhbHVlfSlcbiAgICAgICAgICAgIH1dfVxuICAgICAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICAgIGxheWVyPXt7Y29uZmlnOiB7dmlzQ29uZmlnOiBidWlsZGluZ0xheWVyfX19XG4gICAgICAgICAgICBpbnB1dFRoZW1lPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICA8L1N0eWxlZFBhbmVsQ29udGVudD5cbiAgICApIDogbnVsbH1cbiAgPC9TdHlsZWRJbnRlcmFjdGlvblBhbmVsPlxuKTtcbiJdfQ==