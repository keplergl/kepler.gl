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
          toggleActive: this._toggleSelecting
        }),
        Object.keys(editableLayers).length ? (0, _reactStylematic2.default)(LayerGroupSelector, {
          layers: mapStyle.visibleLayerGroups,
          editableLayers: editableLayers,
          topLayers: mapStyle.topLayerGroups,
          onChange: this._updateConfig
        }) : null
      ),
      (0, _reactStylematic2.default)(BuildingLayer, {
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
        {
          className: (0, _classnames2.default)('map-dropdown-option', {
            collapsed: !isSelecting && mapStyle.styleType !== op
          }),
          key: op,
          onClick: isSelecting ? function () {
            return onChange(op);
          } : toggleActive
        },
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
          onClick: toggleActive
        })
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

                  return _onChange({
                    visibleLayerGroups: (0, _extends5.default)({}, layers, (_extends2 = {}, _extends2[slug] = !layers[slug], _extends2))
                  });
                }
              }),
              (0, _reactStylematic2.default)(BringToTopToggle, {
                slug: slug,
                disabled: !layers[slug],
                topLayers: topLayers,
                onChange: _onChange
              })
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
      {
        className: 'hover',
        'data-tip': true,
        'data-for': slug + '-top',
        onClick: function onClick() {
          var _extends3;

          return onChange({
            topLayerGroups: (0, _extends5.default)({}, topLayers, (_extends3 = {}, _extends3[slug] = !topLayers[slug], _extends3))
          });
        }
      },
      (0, _reactStylematic2.default)('i', {
        className: (0, _classnames2.default)('icon icon_upload', {
          active: topLayers[slug],
          disabled: disabled
        })
      }),
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
        (0, _reactStylematic2.default)(_infoHelper2.default, {
          id: 'building-info',
          description: '3D building only visible when zoom in to an area of the map'
        })
      ),
      (0, _reactStylematic2.default)(_reactSwitch.Switch, {
        checked: buildingLayer.isVisible,
        style: { marginBottom: 0, marginRight: '-10px' },
        id: '3d-building-toggle',
        label: '',
        size: 'small',
        onChange: function onChange() {
          return _onChange2({ isVisible: !buildingLayer.isVisible });
        }
      })
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
        selectedColor: _d3Color.rgb.apply(undefined, buildingLayer.color).toString().toUpperCase()
      }),
      (0, _reactStylematic2.default)(_layerConfigurator.VisConfigSlider, (0, _extends5.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, {
        layer: { config: { visConfig: buildingLayer } },
        onChange: _onChange2
      }))
    ) : null
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiTWFwTWFuYWdlciIsInN0YXRlIiwiaXNTZWxlY3RpbmciLCJfdXBkYXRlQ29uZmlnIiwibmV3Q29uZmlnIiwicHJvcHMiLCJtYXBTdHlsZSIsIm5ld1Byb3AiLCJvbkNvbmZpZ0NoYW5nZSIsIl90b2dnbGVTZWxlY3RpbmciLCJzZXRTdGF0ZSIsIl9zZWxlY3RTdHlsZSIsIm9uU3R5bGVDaGFuZ2UiLCJ2YWwiLCJyZW5kZXIiLCJlZGl0YWJsZUxheWVycyIsInZpc2libGVMYXllckdyb3VwcyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJ0b3BMYXllckdyb3VwcyIsImJ1aWxkaW5nTGF5ZXIiLCJvbkJ1aWxkaW5nQ2hhbmdlIiwicHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJNYXBTdHlsZVNlbGVjdG9yIiwib25DaGFuZ2UiLCJ0b2dnbGVBY3RpdmUiLCJtYXBTdHlsZXMiLCJtYXAiLCJjb2xsYXBzZWQiLCJzdHlsZVR5cGUiLCJvcCIsImljb24iLCJsYWJlbCIsIkxheWVyR3JvdXBTZWxlY3RvciIsImxheWVycyIsInRvcExheWVycyIsInNsdWciLCJtYXJnaW5Cb3R0b20iLCJtYXJnaW5SaWdodCIsIkJyaW5nVG9Ub3BUb2dnbGUiLCJkaXNhYmxlZCIsImFjdGl2ZSIsIkJ1aWxkaW5nTGF5ZXIiLCJpc1Zpc2libGUiLCJjb2xvciIsImhleCIsInRvU3RyaW5nIiwidG9VcHBlckNhc2UiLCJvcGFjaXR5IiwiY29uZmlnIiwidmlzQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFBQTs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0lBRXFCQSxVOzs7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YzBCLFNBRHpCO0FBRUUsZUFBTyxFQUFDTixjQUFjLENBQWYsRUFBa0JDLGFBQWEsT0FBL0IsRUFGVDtBQUdFLGdDQUhGO0FBSUUsZUFBTyxFQUpUO0FBS0UsY0FBSyxPQUxQO0FBTUUsa0JBQVU7QUFBQSxpQkFBTWQsV0FBUyxFQUFDbUIsV0FBVyxDQUFDMUIsY0FBYzBCLFNBQTNCLEVBQVQsQ0FBTjtBQUFBO0FBTlo7QUFSRixLQURGO0FBa0JHMUIsa0JBQWMwQixTQUFkLEdBQ0M7QUFBQTtBQUFBLFFBQUssV0FBVSwrQkFBZjtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FERjtBQUVFO0FBQ0UsZUFBTyxHQURUO0FBRUUsa0JBQVU7QUFBQSxpQkFBT25CLFdBQVMsRUFBQ29CLE9BQU8sMEJBQVNDLEdBQVQsQ0FBUixFQUFULENBQVA7QUFBQSxTQUZaO0FBR0UsdUJBQWUsOEJBQU81QixjQUFjMkIsS0FBckIsRUFDWkUsUUFEWSxHQUVaQyxXQUZZO0FBSGpCLFFBRkY7QUFTRSxvR0FDTSxnQ0FBa0JDLE9BRHhCO0FBRUUsZUFBTyxFQUFDQyxRQUFRLEVBQUNDLFdBQVdqQyxhQUFaLEVBQVQsRUFGVDtBQUdFLGtCQUFVTztBQUhaO0FBVEYsS0FERCxHQWdCRztBQWxDTixHQURvQjtBQUFBLENBQXRCIiwiZmlsZSI6Im1hcC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggY3JlYXRlRWxlbWVudCAqL1xuaW1wb3J0IGNyZWF0ZUVsZW1lbnQgZnJvbSAncmVhY3Qtc3R5bGVtYXRpYyc7XG5cbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtyZ2J9IGZyb20gJ2QzLWNvbG9yJztcbmltcG9ydCB7U3dpdGNofSBmcm9tICdAdWJlci9yZWFjdC1zd2l0Y2gnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBJbmZvSGVscGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2luZm8taGVscGVyJztcbmltcG9ydCB7UGFuZWxMYWJlbCwgVG9vbHRpcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtFbmFibGVDb25maWd9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2xheWVyLXBhbmVsLWl0ZW0nO1xuaW1wb3J0IENvbG9yU2luZ2xlU2VsZWN0b3IgZnJvbSAnLi9sYXllci1wYW5lbC9jb2xvci1zaW5nbGUtc2VsZWN0b3InO1xuaW1wb3J0IHtWaXNDb25maWdTbGlkZXJ9IGZyb20gJy4vbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2tlcGxlcmdsLWxheWVycy9sYXllci1mYWN0b3J5JztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7bWFwU3R5bGVTZWxlY3Rvcn0gZnJvbSAnc3R5bGVzL3NpZGUtcGFuZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXBTdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uU3R5bGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25CdWlsZGluZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIGlzU2VsZWN0aW5nOiBmYWxzZVxuICB9O1xuXG4gIF91cGRhdGVDb25maWcgPSBuZXdQcm9wID0+IHtcbiAgICBjb25zdCBuZXdDb25maWcgPSB7Li4udGhpcy5wcm9wcy5tYXBTdHlsZSwgLi4ubmV3UHJvcH07XG4gICAgdGhpcy5wcm9wcy5vbkNvbmZpZ0NoYW5nZShuZXdDb25maWcpO1xuICB9O1xuXG4gIF90b2dnbGVTZWxlY3RpbmcgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNTZWxlY3Rpbmc6ICF0aGlzLnN0YXRlLmlzU2VsZWN0aW5nfSk7XG4gIH07XG5cbiAgX3NlbGVjdFN0eWxlID0gdmFsID0+IHtcbiAgICB0aGlzLnByb3BzLm9uU3R5bGVDaGFuZ2UodmFsKTtcbiAgICB0aGlzLl90b2dnbGVTZWxlY3RpbmcoKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hcFN0eWxlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZWRpdGFibGVMYXllcnMgPSBtYXBTdHlsZS52aXNpYmxlTGF5ZXJHcm91cHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtc3R5bGVfX3BhbmVsXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItcGFuZWwgYWN0aXZlXCIgc3R5bGU9e21hcFN0eWxlU2VsZWN0b3J9PlxuICAgICAgICAgIDxNYXBTdHlsZVNlbGVjdG9yXG4gICAgICAgICAgICBtYXBTdHlsZT17bWFwU3R5bGV9XG4gICAgICAgICAgICBpc1NlbGVjdGluZz17dGhpcy5zdGF0ZS5pc1NlbGVjdGluZ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9zZWxlY3RTdHlsZX1cbiAgICAgICAgICAgIHRvZ2dsZUFjdGl2ZT17dGhpcy5fdG9nZ2xlU2VsZWN0aW5nfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge09iamVjdC5rZXlzKGVkaXRhYmxlTGF5ZXJzKS5sZW5ndGggPyAoXG4gICAgICAgICAgICA8TGF5ZXJHcm91cFNlbGVjdG9yXG4gICAgICAgICAgICAgIGxheWVycz17bWFwU3R5bGUudmlzaWJsZUxheWVyR3JvdXBzfVxuICAgICAgICAgICAgICBlZGl0YWJsZUxheWVycz17ZWRpdGFibGVMYXllcnN9XG4gICAgICAgICAgICAgIHRvcExheWVycz17bWFwU3R5bGUudG9wTGF5ZXJHcm91cHN9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl91cGRhdGVDb25maWd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEJ1aWxkaW5nTGF5ZXJcbiAgICAgICAgICBidWlsZGluZ0xheWVyPXttYXBTdHlsZS5idWlsZGluZ0xheWVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLm9uQnVpbGRpbmdDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IE1hcFN0eWxlU2VsZWN0b3IgPSAoe21hcFN0eWxlLCBvbkNoYW5nZSwgdG9nZ2xlQWN0aXZlLCBpc1NlbGVjdGluZ30pID0+IChcbiAgPGRpdj5cbiAgICA8UGFuZWxMYWJlbD5CYXNlIG1hcCBzdHlsZTwvUGFuZWxMYWJlbD5cbiAgICB7T2JqZWN0LmtleXMobWFwU3R5bGUubWFwU3R5bGVzKS5tYXAob3AgPT4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ21hcC1kcm9wZG93bi1vcHRpb24nLCB7XG4gICAgICAgICAgY29sbGFwc2VkOiAhaXNTZWxlY3RpbmcgJiYgbWFwU3R5bGUuc3R5bGVUeXBlICE9PSBvcFxuICAgICAgICB9KX1cbiAgICAgICAga2V5PXtvcH1cbiAgICAgICAgb25DbGljaz17aXNTZWxlY3RpbmcgPyAoKSA9PiBvbkNoYW5nZShvcCkgOiB0b2dnbGVBY3RpdmV9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwLXRpdGxlLWJsb2NrXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJtYXAtcHJldmlld1wiIHNyYz17bWFwU3R5bGUubWFwU3R5bGVzW29wXS5pY29ufSAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1hcC1wcmV2aWV3LW5hbWVcIj5cbiAgICAgICAgICAgIHttYXBTdHlsZS5tYXBTdHlsZXNbb3BdLmxhYmVsfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHshaXNTZWxlY3RpbmcgJiYgKFxuICAgICAgICAgIDxFbmFibGVDb25maWdcbiAgICAgICAgICAgIGRpc2FibGVUb29sdGlwPXt0cnVlfVxuICAgICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlQWN0aXZlfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApKX1cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBMYXllckdyb3VwU2VsZWN0b3IgPSAoe2xheWVycywgZWRpdGFibGVMYXllcnMsIG9uQ2hhbmdlLCB0b3BMYXllcnN9KSA9PiAoXG4gIDxkaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1ncm91cF9faGVhZGVyXCI+XG4gICAgICA8UGFuZWxMYWJlbD5NYXAgTGF5ZXJzPC9QYW5lbExhYmVsPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWxcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWxfX2NvbnRlbnRcIj5cbiAgICAgICAge09iamVjdC5rZXlzKGVkaXRhYmxlTGF5ZXJzKS5tYXAoc2x1ZyA9PiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1ncm91cF9fc2VsZWN0XCIga2V5PXtzbHVnfT5cbiAgICAgICAgICAgIDxQYW5lbExhYmVsPntzbHVnfTwvUGFuZWxMYWJlbD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX3N3aXRjaFwiPlxuICAgICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgICAgY2hlY2tlZD17bGF5ZXJzW3NsdWddfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luQm90dG9tOiAwLCBtYXJnaW5SaWdodDogJy0xMHB4J319XG4gICAgICAgICAgICAgICAgaWQ9e2Ake3NsdWd9LXRvZ2dsZWB9XG4gICAgICAgICAgICAgICAgbGFiZWw9eycnfVxuICAgICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgICAgIHZpc2libGVMYXllckdyb3Vwczoge1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmxheWVycyxcbiAgICAgICAgICAgICAgICAgICAgICBbc2x1Z106ICFsYXllcnNbc2x1Z11cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxCcmluZ1RvVG9wVG9nZ2xlXG4gICAgICAgICAgICAgICAgc2x1Zz17c2x1Z31cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyc1tzbHVnXX1cbiAgICAgICAgICAgICAgICB0b3BMYXllcnM9e3RvcExheWVyc31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBCcmluZ1RvVG9wVG9nZ2xlID0gKHt0b3BMYXllcnMsIG9uQ2hhbmdlLCBzbHVnLCBkaXNhYmxlZH0pID0+IChcbiAgPHNwYW4gY2xhc3NOYW1lPVwibGF5ZXItLXRvZ2dsZVwiPlxuICAgIDxhXG4gICAgICBjbGFzc05hbWU9XCJob3ZlclwiXG4gICAgICBkYXRhLXRpcFxuICAgICAgZGF0YS1mb3I9e2Ake3NsdWd9LXRvcGB9XG4gICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgdG9wTGF5ZXJHcm91cHM6IHtcbiAgICAgICAgICAgIC4uLnRvcExheWVycyxcbiAgICAgICAgICAgIFtzbHVnXTogIXRvcExheWVyc1tzbHVnXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICA+XG4gICAgICA8aVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2ljb24gaWNvbl91cGxvYWQnLCB7XG4gICAgICAgICAgYWN0aXZlOiB0b3BMYXllcnNbc2x1Z10sXG4gICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgfSl9XG4gICAgICAvPlxuICAgICAgPFRvb2x0aXAgaWQ9e2Ake3NsdWd9LXRvcGB9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICAgIDxzcGFuPk1vdmUgdG8gdG9wIG9mIGRhdGEgbGF5ZXJzPC9zcGFuPlxuICAgICAgPC9Ub29sdGlwPlxuICAgIDwvYT5cbiAgPC9zcGFuPlxuKTtcblxuY29uc3QgQnVpbGRpbmdMYXllciA9ICh7YnVpbGRpbmdMYXllciwgb25DaGFuZ2V9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItcGFuZWwgYWN0aXZlXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1wYW5lbF9faGVhZGVyIG5vLWhpZ2hsaWdodFwiPlxuICAgICAgPHNwYW4+XG4gICAgICAgIDxQYW5lbExhYmVsPjNEIEJ1aWxkaW5nczwvUGFuZWxMYWJlbD5cbiAgICAgICAgPEluZm9IZWxwZXJcbiAgICAgICAgICBpZD1cImJ1aWxkaW5nLWluZm9cIlxuICAgICAgICAgIGRlc2NyaXB0aW9uPVwiM0QgYnVpbGRpbmcgb25seSB2aXNpYmxlIHdoZW4gem9vbSBpbiB0byBhbiBhcmVhIG9mIHRoZSBtYXBcIlxuICAgICAgICAvPlxuICAgICAgPC9zcGFuPlxuICAgICAgPFN3aXRjaFxuICAgICAgICBjaGVja2VkPXtidWlsZGluZ0xheWVyLmlzVmlzaWJsZX1cbiAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206IDAsIG1hcmdpblJpZ2h0OiAnLTEwcHgnfX1cbiAgICAgICAgaWQ9e2AzZC1idWlsZGluZy10b2dnbGVgfVxuICAgICAgICBsYWJlbD17Jyd9XG4gICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSh7aXNWaXNpYmxlOiAhYnVpbGRpbmdMYXllci5pc1Zpc2libGV9KX1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICAge2J1aWxkaW5nTGF5ZXIuaXNWaXNpYmxlID8gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzb2Z0LXRpbnkgbGF5ZXItcGFuZWxfX2NvbmZpZ1wiPlxuICAgICAgICA8UGFuZWxMYWJlbD5Db2xvcjwvUGFuZWxMYWJlbD5cbiAgICAgICAgPENvbG9yU2luZ2xlU2VsZWN0b3JcbiAgICAgICAgICB3aWR0aD17MjY4fVxuICAgICAgICAgIHNldENvbG9yPXtoZXggPT4gb25DaGFuZ2Uoe2NvbG9yOiBoZXhUb1JnYihoZXgpfSl9XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcj17cmdiKC4uLmJ1aWxkaW5nTGF5ZXIuY29sb3IpXG4gICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgLnRvVXBwZXJDYXNlKCl9XG4gICAgICAgIC8+XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICBsYXllcj17e2NvbmZpZzoge3Zpc0NvbmZpZzogYnVpbGRpbmdMYXllcn19fVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICkgOiBudWxsfVxuICA8L2Rpdj5cbik7XG4iXX0=