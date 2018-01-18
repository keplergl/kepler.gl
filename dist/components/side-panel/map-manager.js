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

var _class, _temp2; /** @jsx createElement */


var _reactStylematic = require('react-stylematic');

var _reactStylematic2 = _interopRequireDefault(_reactStylematic);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Color = require('d3-color');

var _reactSwitch = require('@uber/react-switch');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _infoHelper = require('../common/info-helper');

var _infoHelper2 = _interopRequireDefault(_infoHelper);

var _styledComponents = require('../common/styled-components');

var _layerPanelItem = require('../common/layer-panel-item');

var _colorSingleSelector = require('./layer-panel/color-single-selector');

var _colorSingleSelector2 = _interopRequireDefault(_colorSingleSelector);

var _layerConfigurator = require('./layer-panel/layer-configurator');

var _layerFactory = require('../../keplergl-layers/layer-factory');

var _colorUtils = require('../../utils/color-utils');

var _sidePanel = require('../../styles/side-panel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    return (0, _reactStylematic2.default)(
      'div',
      { className: 'map-style__panel' },
      (0, _reactStylematic2.default)(
        'div',
        { className: 'layer-panel active', style: _sidePanel.mapStyleSelector },
        (0, _reactStylematic2.default)(MapStyleSelector, {
          mapStyle: mapStyle,
          isSelecting: this.state.isSelecting,
          onChange: this._selectStyle,
          toggleActive: this._toggleSelecting }),
        Object.keys(editableLayers).length ? (0, _reactStylematic2.default)(LayerGroupSelector, {
          layers: mapStyle.visibleLayerGroups,
          editableLayers: editableLayers,
          topLayers: mapStyle.topLayerGroups,
          onChange: this._updateConfig }) : null
      ),
      (0, _reactStylematic2.default)(BuildingLayer, {
        buildingLayer: mapStyle.buildingLayer,
        onChange: this.props.onBuildingChange })
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


var MapStyleSelector = function MapStyleSelector(_ref) {
  var mapStyle = _ref.mapStyle,
      onChange = _ref.onChange,
      toggleActive = _ref.toggleActive,
      isSelecting = _ref.isSelecting;
  return (0, _reactStylematic2.default)(
    'div',
    null,
    (0, _reactStylematic2.default)(
      _styledComponents.PanelLabel,
      null,
      'Base map style'
    ),
    Object.keys(mapStyle.mapStyles).map(function (op) {
      return (0, _reactStylematic2.default)(
        'div',
        { className: (0, _classnames2.default)('map-dropdown-option', { collapsed: !isSelecting && mapStyle.styleType !== op }),
          key: op,
          onClick: isSelecting ? function () {
            return onChange(op);
          } : toggleActive },
        (0, _reactStylematic2.default)(
          'div',
          { className: 'map-title-block' },
          (0, _reactStylematic2.default)('img', { className: 'map-preview', src: mapStyle.mapStyles[op].icon }),
          (0, _reactStylematic2.default)(
            'span',
            { className: 'map-preview-name' },
            mapStyle.mapStyles[op].label
          )
        ),
        !isSelecting && (0, _reactStylematic2.default)(_layerPanelItem.EnableConfig, {
          disableTooltip: true,
          isActive: false,
          onClick: toggleActive })
      );
    })
  );
};

var LayerGroupSelector = function LayerGroupSelector(_ref2) {
  var layers = _ref2.layers,
      editableLayers = _ref2.editableLayers,
      _onChange = _ref2.onChange,
      topLayers = _ref2.topLayers;
  return (0, _reactStylematic2.default)(
    'div',
    null,
    (0, _reactStylematic2.default)(
      'div',
      { className: 'layer-group__header' },
      (0, _reactStylematic2.default)(
        _styledComponents.PanelLabel,
        null,
        'Map Layers'
      )
    ),
    (0, _reactStylematic2.default)(
      'div',
      { className: 'panel' },
      (0, _reactStylematic2.default)(
        'div',
        { className: 'panel__content' },
        Object.keys(editableLayers).map(function (slug) {
          return (0, _reactStylematic2.default)(
            'div',
            { className: 'layer-group__select', key: slug },
            (0, _reactStylematic2.default)(
              _styledComponents.PanelLabel,
              null,
              slug
            ),
            (0, _reactStylematic2.default)(
              'div',
              { className: 'layer-group__switch' },
              (0, _reactStylematic2.default)(_reactSwitch.Switch, {
                checked: layers[slug],
                style: { marginBottom: 0, marginRight: '-10px' },
                id: slug + '-toggle',
                label: '',
                size: 'small',
                onChange: function onChange() {
                  var _extends2;

                  return _onChange({ visibleLayerGroups: (0, _extends5.default)({}, layers, (_extends2 = {}, _extends2[slug] = !layers[slug], _extends2)) });
                } }),
              (0, _reactStylematic2.default)(BringToTopToggle, {
                slug: slug,
                disabled: !layers[slug],
                topLayers: topLayers,
                onChange: _onChange })
            )
          );
        })
      )
    )
  );
};

var BringToTopToggle = function BringToTopToggle(_ref3) {
  var topLayers = _ref3.topLayers,
      onChange = _ref3.onChange,
      slug = _ref3.slug,
      disabled = _ref3.disabled;
  return (0, _reactStylematic2.default)(
    'span',
    { className: 'layer--toggle' },
    (0, _reactStylematic2.default)(
      'a',
      { className: 'hover', 'data-tip': true, 'data-for': slug + '-top',
        onClick: function onClick() {
          var _extends3;

          return onChange({ topLayerGroups: (0, _extends5.default)({}, topLayers, (_extends3 = {}, _extends3[slug] = !topLayers[slug], _extends3)) });
        } },
      (0, _reactStylematic2.default)('i', { className: (0, _classnames2.default)('icon icon_upload', {
          active: topLayers[slug],
          disabled: disabled
        }) }),
      (0, _reactStylematic2.default)(
        _styledComponents.Tooltip,
        { id: slug + '-top', effect: 'solid' },
        (0, _reactStylematic2.default)(
          'span',
          null,
          'Move to top of data layers'
        )
      )
    )
  );
};

var BuildingLayer = function BuildingLayer(_ref4) {
  var buildingLayer = _ref4.buildingLayer,
      _onChange2 = _ref4.onChange;
  return (0, _reactStylematic2.default)(
    'div',
    { className: 'layer-panel active' },
    (0, _reactStylematic2.default)(
      'div',
      { className: 'layer-panel__header no-highlight' },
      (0, _reactStylematic2.default)(
        'span',
        null,
        (0, _reactStylematic2.default)(
          _styledComponents.PanelLabel,
          null,
          '3D Buildings'
        ),
        (0, _reactStylematic2.default)(_infoHelper2.default, { id: 'building-info',
          description: '3D building only visible when zoom in to an area of the map' })
      ),
      (0, _reactStylematic2.default)(_reactSwitch.Switch, {
        checked: buildingLayer.isVisible,
        style: { marginBottom: 0, marginRight: '-10px' },
        id: '3d-building-toggle',
        label: '',
        size: 'small',
        onChange: function onChange() {
          return _onChange2({ isVisible: !buildingLayer.isVisible });
        } })
    ),
    buildingLayer.isVisible ? (0, _reactStylematic2.default)(
      'div',
      { className: 'soft-tiny layer-panel__config' },
      (0, _reactStylematic2.default)(
        _styledComponents.PanelLabel,
        null,
        'Color'
      ),
      (0, _reactStylematic2.default)(_colorSingleSelector2.default, {
        width: 268,
        setColor: function setColor(hex) {
          return _onChange2({ color: (0, _colorUtils.hexToRgb)(hex) });
        },
        selectedColor: _d3Color.rgb.apply(undefined, buildingLayer.color).toString().toUpperCase() }),
      (0, _reactStylematic2.default)(_layerConfigurator.VisConfigSlider, (0, _extends5.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, {
        layer: { config: { visConfig: buildingLayer } },
        onChange: _onChange2
      }))
    ) : null
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiTWFwTWFuYWdlciIsInN0YXRlIiwiaXNTZWxlY3RpbmciLCJfdXBkYXRlQ29uZmlnIiwibmV3UHJvcCIsIm5ld0NvbmZpZyIsInByb3BzIiwibWFwU3R5bGUiLCJvbkNvbmZpZ0NoYW5nZSIsIl90b2dnbGVTZWxlY3RpbmciLCJzZXRTdGF0ZSIsIl9zZWxlY3RTdHlsZSIsInZhbCIsIm9uU3R5bGVDaGFuZ2UiLCJyZW5kZXIiLCJlZGl0YWJsZUxheWVycyIsInZpc2libGVMYXllckdyb3VwcyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJ0b3BMYXllckdyb3VwcyIsImJ1aWxkaW5nTGF5ZXIiLCJvbkJ1aWxkaW5nQ2hhbmdlIiwicHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJNYXBTdHlsZVNlbGVjdG9yIiwib25DaGFuZ2UiLCJ0b2dnbGVBY3RpdmUiLCJtYXBTdHlsZXMiLCJtYXAiLCJjb2xsYXBzZWQiLCJzdHlsZVR5cGUiLCJvcCIsImljb24iLCJsYWJlbCIsIkxheWVyR3JvdXBTZWxlY3RvciIsImxheWVycyIsInRvcExheWVycyIsInNsdWciLCJtYXJnaW5Cb3R0b20iLCJtYXJnaW5SaWdodCIsIkJyaW5nVG9Ub3BUb2dnbGUiLCJkaXNhYmxlZCIsImFjdGl2ZSIsIkJ1aWxkaW5nTGF5ZXIiLCJpc1Zpc2libGUiLCJjb2xvciIsImhleCIsInRvU3RyaW5nIiwidG9VcHBlckNhc2UiLCJvcGFjaXR5IiwiY29uZmlnIiwidmlzQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFBQTs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7SUFFcUJBLFU7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LDZEQUR4QjtBQUZGLE9BREY7QUFNRTtBQUNFLGlCQUFTUCxjQUFjMEIsU0FEekI7QUFFRSxlQUFPLEVBQUNOLGNBQWMsQ0FBZixFQUFrQkMsYUFBYSxPQUEvQixFQUZUO0FBR0UsZ0NBSEY7QUFJRSxlQUFPLEVBSlQ7QUFLRSxjQUFLLE9BTFA7QUFNRSxrQkFBVTtBQUFBLGlCQUFNZCxXQUFTLEVBQUNtQixXQUFXLENBQUMxQixjQUFjMEIsU0FBM0IsRUFBVCxDQUFOO0FBQUEsU0FOWjtBQU5GLEtBREY7QUFlRzFCLGtCQUFjMEIsU0FBZCxHQUEwQjtBQUFBO0FBQUEsUUFBSyxXQUFVLCtCQUFmO0FBQ3pCO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FEeUI7QUFFekI7QUFDRSxlQUFPLEdBRFQ7QUFFRSxrQkFBVTtBQUFBLGlCQUFPbkIsV0FBUyxFQUFDb0IsT0FBTywwQkFBU0MsR0FBVCxDQUFSLEVBQVQsQ0FBUDtBQUFBLFNBRlo7QUFHRSx1QkFBZSw4QkFBTzVCLGNBQWMyQixLQUFyQixFQUE0QkUsUUFBNUIsR0FBdUNDLFdBQXZDLEVBSGpCLEdBRnlCO0FBTXpCLG9HQUNNLGdDQUFrQkMsT0FEeEI7QUFFRSxlQUFPLEVBQUNDLFFBQVEsRUFBQ0MsV0FBV2pDLGFBQVosRUFBVCxFQUZUO0FBR0Usa0JBQVVPO0FBSFo7QUFOeUIsS0FBMUIsR0FXUTtBQTFCWCxHQURvQjtBQUFBLENBQXRCIiwiZmlsZSI6Im1hcC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggY3JlYXRlRWxlbWVudCAqL1xuaW1wb3J0IGNyZWF0ZUVsZW1lbnQgZnJvbSAncmVhY3Qtc3R5bGVtYXRpYyc7XG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7cmdifSBmcm9tICdkMy1jb2xvcic7XG5pbXBvcnQge1N3aXRjaH0gZnJvbSAnQHViZXIvcmVhY3Qtc3dpdGNoJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgSW5mb0hlbHBlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlcic7XG5pbXBvcnQge1BhbmVsTGFiZWwsIFRvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7RW5hYmxlQ29uZmlnfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9sYXllci1wYW5lbC1pdGVtJztcbmltcG9ydCBDb2xvclNpbmdsZVNlbGVjdG9yIGZyb20gJy4vbGF5ZXItcGFuZWwvY29sb3Itc2luZ2xlLXNlbGVjdG9yJztcbmltcG9ydCB7VmlzQ29uZmlnU2xpZGVyfSBmcm9tICcuL2xheWVyLXBhbmVsL2xheWVyLWNvbmZpZ3VyYXRvcic7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdrZXBsZXJnbC1sYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge21hcFN0eWxlU2VsZWN0b3J9IGZyb20gJ3N0eWxlcy9zaWRlLXBhbmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwTWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXBTdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uU3R5bGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25CdWlsZGluZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIGlzU2VsZWN0aW5nOiBmYWxzZVxuICB9O1xuXG4gIF91cGRhdGVDb25maWcgPSAobmV3UHJvcCkgPT4ge1xuICAgIGNvbnN0IG5ld0NvbmZpZyA9IHsuLi50aGlzLnByb3BzLm1hcFN0eWxlLCAuLi5uZXdQcm9wfTtcbiAgICB0aGlzLnByb3BzLm9uQ29uZmlnQ2hhbmdlKG5ld0NvbmZpZyk7XG4gIH07XG5cbiAgX3RvZ2dsZVNlbGVjdGluZyA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc1NlbGVjdGluZzogIXRoaXMuc3RhdGUuaXNTZWxlY3Rpbmd9KTtcbiAgfTtcblxuICBfc2VsZWN0U3R5bGUgPSAodmFsKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblN0eWxlQ2hhbmdlKHZhbCk7XG4gICAgdGhpcy5fdG9nZ2xlU2VsZWN0aW5nKCk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXBTdHlsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGVkaXRhYmxlTGF5ZXJzID0gbWFwU3R5bGUudmlzaWJsZUxheWVyR3JvdXBzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwLXN0eWxlX19wYW5lbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxheWVyLXBhbmVsIGFjdGl2ZVwiIHN0eWxlPXttYXBTdHlsZVNlbGVjdG9yfT5cbiAgICAgICAgICA8TWFwU3R5bGVTZWxlY3RvclxuICAgICAgICAgICAgbWFwU3R5bGU9e21hcFN0eWxlfVxuICAgICAgICAgICAgaXNTZWxlY3Rpbmc9e3RoaXMuc3RhdGUuaXNTZWxlY3Rpbmd9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fc2VsZWN0U3R5bGV9XG4gICAgICAgICAgICB0b2dnbGVBY3RpdmU9e3RoaXMuX3RvZ2dsZVNlbGVjdGluZ30vPlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhlZGl0YWJsZUxheWVycykubGVuZ3RoID8gPExheWVyR3JvdXBTZWxlY3RvclxuICAgICAgICAgICAgbGF5ZXJzPXttYXBTdHlsZS52aXNpYmxlTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICBlZGl0YWJsZUxheWVycz17ZWRpdGFibGVMYXllcnN9XG4gICAgICAgICAgICB0b3BMYXllcnM9e21hcFN0eWxlLnRvcExheWVyR3JvdXBzfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX3VwZGF0ZUNvbmZpZ30vPiA6IG51bGx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8QnVpbGRpbmdMYXllclxuICAgICAgICAgIGJ1aWxkaW5nTGF5ZXI9e21hcFN0eWxlLmJ1aWxkaW5nTGF5ZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25CdWlsZGluZ0NoYW5nZX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBNYXBTdHlsZVNlbGVjdG9yID0gKHttYXBTdHlsZSwgb25DaGFuZ2UsIHRvZ2dsZUFjdGl2ZSwgaXNTZWxlY3Rpbmd9KSA9PiAoXG4gIDxkaXY+XG4gICAgPFBhbmVsTGFiZWw+QmFzZSBtYXAgc3R5bGU8L1BhbmVsTGFiZWw+XG4gICAge09iamVjdC5rZXlzKG1hcFN0eWxlLm1hcFN0eWxlcykubWFwKG9wID0+IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdtYXAtZHJvcGRvd24tb3B0aW9uJyxcbiAgICAgICAge2NvbGxhcHNlZDogIWlzU2VsZWN0aW5nICYmIG1hcFN0eWxlLnN0eWxlVHlwZSAhPT0gb3B9KX1cbiAgICAgICAga2V5PXtvcH1cbiAgICAgICAgb25DbGljaz17aXNTZWxlY3RpbmcgPyAoKSA9PiBvbkNoYW5nZShvcCkgOiB0b2dnbGVBY3RpdmV9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC10aXRsZS1ibG9ja1wiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwibWFwLXByZXZpZXdcIiBzcmM9e21hcFN0eWxlLm1hcFN0eWxlc1tvcF0uaWNvbn0vPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1hcC1wcmV2aWV3LW5hbWVcIj57bWFwU3R5bGUubWFwU3R5bGVzW29wXS5sYWJlbH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7IWlzU2VsZWN0aW5nICYmIDxFbmFibGVDb25maWdcbiAgICAgICAgICBkaXNhYmxlVG9vbHRpcD17dHJ1ZX1cbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgb25DbGljaz17dG9nZ2xlQWN0aXZlfS8+fVxuICAgICAgPC9kaXY+XG4gICAgKSl9XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgTGF5ZXJHcm91cFNlbGVjdG9yID0gKHtsYXllcnMsIGVkaXRhYmxlTGF5ZXJzLCBvbkNoYW5nZSwgdG9wTGF5ZXJzfSkgPT4gKFxuICA8ZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX2hlYWRlclwiPlxuICAgICAgPFBhbmVsTGFiZWw+TWFwIExheWVyczwvUGFuZWxMYWJlbD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsX19jb250ZW50XCI+XG4gICAgICAgIHtPYmplY3Qua2V5cyhlZGl0YWJsZUxheWVycykubWFwKHNsdWcgPT4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX3NlbGVjdFwiIGtleT17c2x1Z30+XG4gICAgICAgICAgICA8UGFuZWxMYWJlbD57c2x1Z308L1BhbmVsTGFiZWw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxheWVyLWdyb3VwX19zd2l0Y2hcIj5cbiAgICAgICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2xheWVyc1tzbHVnXX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTogMCwgbWFyZ2luUmlnaHQ6ICctMTBweCd9fVxuICAgICAgICAgICAgICAgIGlkPXtgJHtzbHVnfS10b2dnbGVgfVxuICAgICAgICAgICAgICAgIGxhYmVsPXsnJ31cbiAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSh7dmlzaWJsZUxheWVyR3JvdXBzOiB7XG4gICAgICAgICAgICAgICAgICAuLi5sYXllcnMsXG4gICAgICAgICAgICAgICAgICBbc2x1Z106ICFsYXllcnNbc2x1Z11cbiAgICAgICAgICAgICAgICB9fSl9Lz5cbiAgICAgICAgICAgICAgPEJyaW5nVG9Ub3BUb2dnbGVcbiAgICAgICAgICAgICAgICBzbHVnPXtzbHVnfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXJzW3NsdWddfVxuICAgICAgICAgICAgICAgIHRvcExheWVycz17dG9wTGF5ZXJzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgQnJpbmdUb1RvcFRvZ2dsZSA9ICh7dG9wTGF5ZXJzLCBvbkNoYW5nZSwgc2x1ZywgZGlzYWJsZWR9KSA9PiAoXG4gIDxzcGFuIGNsYXNzTmFtZT1cImxheWVyLS10b2dnbGVcIj5cbiAgICA8YSBjbGFzc05hbWU9XCJob3ZlclwiIGRhdGEtdGlwIGRhdGEtZm9yPXtgJHtzbHVnfS10b3BgfVxuICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKHt0b3BMYXllckdyb3Vwczoge1xuICAgICAgICAgLi4udG9wTGF5ZXJzLFxuICAgICAgICAgW3NsdWddOiAhdG9wTGF5ZXJzW3NsdWddXG4gICAgICAgfX0pfT5cbiAgICAgIDxpIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnaWNvbiBpY29uX3VwbG9hZCcsIHtcbiAgICAgICAgYWN0aXZlOiB0b3BMYXllcnNbc2x1Z10sXG4gICAgICAgIGRpc2FibGVkXG4gICAgICB9KX0vPlxuICAgICAgPFRvb2x0aXAgaWQ9e2Ake3NsdWd9LXRvcGB9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICAgIDxzcGFuPk1vdmUgdG8gdG9wIG9mIGRhdGEgbGF5ZXJzPC9zcGFuPlxuICAgICAgPC9Ub29sdGlwPlxuICAgIDwvYT5cbiAgPC9zcGFuPlxuKTtcblxuY29uc3QgQnVpbGRpbmdMYXllciA9ICh7YnVpbGRpbmdMYXllciwgb25DaGFuZ2V9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItcGFuZWwgYWN0aXZlXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1wYW5lbF9faGVhZGVyIG5vLWhpZ2hsaWdodFwiPlxuICAgICAgPHNwYW4+XG4gICAgICAgIDxQYW5lbExhYmVsPjNEIEJ1aWxkaW5nczwvUGFuZWxMYWJlbD5cbiAgICAgICAgPEluZm9IZWxwZXIgaWQ9XCJidWlsZGluZy1pbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb249XCIzRCBidWlsZGluZyBvbmx5IHZpc2libGUgd2hlbiB6b29tIGluIHRvIGFuIGFyZWEgb2YgdGhlIG1hcFwiLz5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxTd2l0Y2hcbiAgICAgICAgY2hlY2tlZD17YnVpbGRpbmdMYXllci5pc1Zpc2libGV9XG4gICAgICAgIHN0eWxlPXt7bWFyZ2luQm90dG9tOiAwLCBtYXJnaW5SaWdodDogJy0xMHB4J319XG4gICAgICAgIGlkPXtgM2QtYnVpbGRpbmctdG9nZ2xlYH1cbiAgICAgICAgbGFiZWw9eycnfVxuICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICBvbkNoYW5nZT17KCkgPT4gb25DaGFuZ2Uoe2lzVmlzaWJsZTogIWJ1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlfSl9Lz5cbiAgICA8L2Rpdj5cbiAgICB7YnVpbGRpbmdMYXllci5pc1Zpc2libGUgPyA8ZGl2IGNsYXNzTmFtZT1cInNvZnQtdGlueSBsYXllci1wYW5lbF9fY29uZmlnXCI+XG4gICAgICA8UGFuZWxMYWJlbD5Db2xvcjwvUGFuZWxMYWJlbD5cbiAgICAgIDxDb2xvclNpbmdsZVNlbGVjdG9yXG4gICAgICAgIHdpZHRoPXsyNjh9XG4gICAgICAgIHNldENvbG9yPXtoZXggPT4gb25DaGFuZ2Uoe2NvbG9yOiBoZXhUb1JnYihoZXgpfSl9XG4gICAgICAgIHNlbGVjdGVkQ29sb3I9e3JnYiguLi5idWlsZGluZ0xheWVyLmNvbG9yKS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCl9Lz5cbiAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgIGxheWVyPXt7Y29uZmlnOiB7dmlzQ29uZmlnOiBidWlsZGluZ0xheWVyfX19XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgIC8+XG4gICAgPC9kaXY+IDogbnVsbH1cbiAgPC9kaXY+XG4pO1xuIl19