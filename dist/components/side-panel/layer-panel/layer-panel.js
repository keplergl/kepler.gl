'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactAnythingSortable = require('react-anything-sortable');

var _layerConfigurator = require('./layer-configurator');

var _layerConfigurator2 = _interopRequireDefault(_layerConfigurator);

var _layerPanelItem = require('../../common/layer-panel-item');

var _layerPanelItem2 = _interopRequireDefault(_layerPanelItem);

var _defaultSettings = require('../../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _propTypes2.default.object.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  idx: _propTypes2.default.number.isRequired,
  panelWidth: _propTypes2.default.number.isRequired,
  layerConfigChange: _propTypes2.default.func.isRequired,
  layerTypeChange: _propTypes2.default.func.isRequired,
  openModal: _propTypes2.default.func.isRequired,
  removeLayer: _propTypes2.default.func.isRequired,
  onCloseConfig: _propTypes2.default.func,

  layerVisConfigChange: _propTypes2.default.func,
  layerVisualChannelConfigChange: _propTypes2.default.func
};

var LayerPanel = (0, _reactAnythingSortable.sortable)(_class = function (_Component) {
  (0, _inherits3.default)(LayerPanel, _Component);

  function LayerPanel() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LayerPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.updateLayerConfig = function (newProp) {
      _this.props.layerConfigChange(_this.props.layer, newProp);
    }, _this.updateLayerType = function (newType) {
      _this.props.layerTypeChange(_this.props.layer, newType);
    }, _this.updateLayerVisConfig = function (newVisConfig) {
      _this.props.layerVisConfigChange(_this.props.layer, newVisConfig);
    }, _this.updateLayerVisualChannelConfig = function (newConfig, channel, scaleKey) {
      _this.props.layerVisualChannelConfigChange(_this.props.layer, newConfig, channel, scaleKey);
    }, _this._updateLayerLabel = function (_ref) {
      var value = _ref.target.value;

      _this.updateLayerConfig({ label: value });
    }, _this._toggleVisibility = function (e) {
      e.stopPropagation();
      var isVisible = !_this.props.layer.config.isVisible;
      _this.updateLayerConfig({ isVisible: isVisible });
    }, _this._toggleEnableConfig = function (event) {
      event.stopPropagation();
      var isConfigActive = _this.props.layer.config.isConfigActive;

      _this.updateLayerConfig({ isConfigActive: !isConfigActive });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  LayerPanel.prototype.render = function render() {
    var _props = this.props,
        layer = _props.layer,
        idx = _props.idx,
        removeLayer = _props.removeLayer,
        datasets = _props.datasets,
        isAdding = _props.isAdding;
    var config = layer.config;
    var isConfigActive = config.isConfigActive;


    return _react2.default.createElement(
      'div',
      { ref: 'container',
        className: (0, _classnames2.default)('layer-panel ' + this.props.className, { active: isConfigActive }),
        style: this.props.style,
        onMouseDown: this.props.onMouseDown,
        onTouchStart: this.props.onTouchStart },
      _react2.default.createElement(_layerPanelItem2.default, {
        isConfigActive: isConfigActive,
        id: layer.id,
        idx: idx,
        isVisible: config.isVisible,
        label: config.label,
        labelRCGColorValues: datasets[config.dataId].color,
        onToggleEnableConfig: this._toggleEnableConfig,
        onToggleVisibility: this._toggleVisibility,
        onUpdateLayerLabel: this._updateLayerLabel,
        removeLayer: removeLayer
      }),
      isConfigActive && _react2.default.createElement(_layerConfigurator2.default, {
        isAdding: isAdding,
        layer: layer,
        datasets: datasets,
        openModal: this.props.openModal,
        panelWidth: this.props.panelWidth - _defaultSettings.DIMENSIONS.layerPanelPadding * 2,
        updateLayerConfig: this.updateLayerConfig,
        updateLayerVisualChannelConfig: this.updateLayerVisualChannelConfig,
        updateLayerType: this.updateLayerType,
        updateLayerVisConfig: this.updateLayerVisConfig
      })
    );
  };

  return LayerPanel;
}(_react.Component)) || _class;

exports.default = LayerPanel;


LayerPanel.propTypes = propTypes;
LayerPanel.displayName = 'LayerPanel';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZGF0YXNldHMiLCJpZHgiLCJudW1iZXIiLCJwYW5lbFdpZHRoIiwibGF5ZXJDb25maWdDaGFuZ2UiLCJmdW5jIiwibGF5ZXJUeXBlQ2hhbmdlIiwib3Blbk1vZGFsIiwicmVtb3ZlTGF5ZXIiLCJvbkNsb3NlQ29uZmlnIiwibGF5ZXJWaXNDb25maWdDaGFuZ2UiLCJsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UiLCJMYXllclBhbmVsIiwidXBkYXRlTGF5ZXJDb25maWciLCJuZXdQcm9wIiwicHJvcHMiLCJ1cGRhdGVMYXllclR5cGUiLCJuZXdUeXBlIiwidXBkYXRlTGF5ZXJWaXNDb25maWciLCJuZXdWaXNDb25maWciLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWciLCJuZXdDb25maWciLCJjaGFubmVsIiwic2NhbGVLZXkiLCJfdXBkYXRlTGF5ZXJMYWJlbCIsInZhbHVlIiwidGFyZ2V0IiwibGFiZWwiLCJfdG9nZ2xlVmlzaWJpbGl0eSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJpc1Zpc2libGUiLCJjb25maWciLCJfdG9nZ2xlRW5hYmxlQ29uZmlnIiwiZXZlbnQiLCJpc0NvbmZpZ0FjdGl2ZSIsInJlbmRlciIsImlzQWRkaW5nIiwiY2xhc3NOYW1lIiwiYWN0aXZlIiwic3R5bGUiLCJvbk1vdXNlRG93biIsIm9uVG91Y2hTdGFydCIsImlkIiwiZGF0YUlkIiwiY29sb3IiLCJsYXllclBhbmVsUGFkZGluZyIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZ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QUFLekIsS0FBTCxDQUFXMEIsV0FIN0I7QUFJSyxzQkFBYyxLQUFLMUIsS0FBTCxDQUFXMkIsWUFKOUI7QUFLRTtBQUNFLHdCQUFnQlAsY0FEbEI7QUFFRSxZQUFJdEMsTUFBTThDLEVBRlo7QUFHRSxhQUFLMUMsR0FIUDtBQUlFLG1CQUFXK0IsT0FBT0QsU0FKcEI7QUFLRSxlQUFPQyxPQUFPTCxLQUxoQjtBQU1FLDZCQUFxQjNCLFNBQVNnQyxPQUFPWSxNQUFoQixFQUF3QkMsS0FOL0M7QUFPRSw4QkFBc0IsS0FBS1osbUJBUDdCO0FBUUUsNEJBQW9CLEtBQUtMLGlCQVIzQjtBQVNFLDRCQUFvQixLQUFLSixpQkFUM0I7QUFVRSxxQkFBYWhCO0FBVmYsUUFMRjtBQWlCRzJCLHdCQUNDO0FBQ0Usa0JBQVVFLFFBRFo7QUFFRSxlQUFPeEMsS0FGVDtBQUdFLGtCQUFVRyxRQUhaO0FBSUUsbUJBQVcsS0FBS2UsS0FBTCxDQUFXUixTQUp4QjtBQUtFLG9CQUFZLEtBQUtRLEtBQUwsQ0FBV1osVUFBWCxHQUF3Qiw0QkFBVzJDLGlCQUFYLEdBQStCLENBTHJFO0FBTUUsMkJBQW1CLEtBQUtqQyxpQkFOMUI7QUFPRSx3Q0FBZ0MsS0FBS08sOEJBUHZDO0FBUUUseUJBQWlCLEtBQUtKLGVBUnhCO0FBU0UsOEJBQXNCLEtBQUtFO0FBVDdCO0FBbEJKLEtBREY7QUFpQ0QsRzs7Ozs7a0JBeEVrQk4sVTs7O0FBMkVyQkEsV0FBV2hCLFNBQVgsR0FBdUJBLFNBQXZCO0FBQ0FnQixXQUFXbUMsV0FBWCxHQUF5QixZQUF6QiIsImZpbGUiOiJsYXllci1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtzb3J0YWJsZX0gZnJvbSAncmVhY3QtYW55dGhpbmctc29ydGFibGUnO1xuXG5pbXBvcnQgTGF5ZXJDb25maWd1cmF0b3IgZnJvbSAnLi9sYXllci1jb25maWd1cmF0b3InO1xuaW1wb3J0IExheWVyUGFuZWxJdGVtIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2xheWVyLXBhbmVsLWl0ZW0nO1xuaW1wb3J0IHtESU1FTlNJT05TfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWR4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHBhbmVsV2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbGF5ZXJDb25maWdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxheWVyVHlwZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb3Blbk1vZGFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZW1vdmVMYXllcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25DbG9zZUNvbmZpZzogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5Ac29ydGFibGVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHVwZGF0ZUxheWVyQ29uZmlnID0gKG5ld1Byb3ApID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyQ29uZmlnQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXIsIG5ld1Byb3ApO1xuICB9O1xuXG4gIHVwZGF0ZUxheWVyVHlwZSA9IChuZXdUeXBlKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5sYXllclR5cGVDaGFuZ2UodGhpcy5wcm9wcy5sYXllciwgbmV3VHlwZSk7XG4gIH07XG5cbiAgdXBkYXRlTGF5ZXJWaXNDb25maWcgPSAobmV3VmlzQ29uZmlnKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5sYXllclZpc0NvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdWaXNDb25maWcpO1xuICB9O1xuXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyA9IChuZXdDb25maWcsIGNoYW5uZWwsIHNjYWxlS2V5KSA9PiB7XG4gICAgdGhpcy5wcm9wcy5sYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UodGhpcy5wcm9wcy5sYXllciwgbmV3Q29uZmlnLCBjaGFubmVsLCBzY2FsZUtleSk7XG4gIH07XG5cbiAgX3VwZGF0ZUxheWVyTGFiZWwgPSAoe3RhcmdldDoge3ZhbHVlfX0pID0+IHtcbiAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtsYWJlbDogdmFsdWV9KTtcbiAgfTtcblxuICBfdG9nZ2xlVmlzaWJpbGl0eSA9IChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBpc1Zpc2libGUgPSAhdGhpcy5wcm9wcy5sYXllci5jb25maWcuaXNWaXNpYmxlO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe2lzVmlzaWJsZX0pO1xuICB9O1xuXG4gIF90b2dnbGVFbmFibGVDb25maWcgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7bGF5ZXI6IHtjb25maWc6IHtpc0NvbmZpZ0FjdGl2ZX19fSA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7aXNDb25maWdBY3RpdmU6ICFpc0NvbmZpZ0FjdGl2ZX0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bGF5ZXIsIGlkeCwgcmVtb3ZlTGF5ZXIsIGRhdGFzZXRzLCBpc0FkZGluZ30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG4gICAgY29uc3Qge2lzQ29uZmlnQWN0aXZlfSA9IGNvbmZpZztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJlZj1cImNvbnRhaW5lclwiXG4gICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhgbGF5ZXItcGFuZWwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZX1gLCB7YWN0aXZlOiBpc0NvbmZpZ0FjdGl2ZX0pfVxuICAgICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX1cbiAgICAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMub25Nb3VzZURvd259XG4gICAgICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5wcm9wcy5vblRvdWNoU3RhcnR9PlxuICAgICAgICA8TGF5ZXJQYW5lbEl0ZW1cbiAgICAgICAgICBpc0NvbmZpZ0FjdGl2ZT17aXNDb25maWdBY3RpdmV9XG4gICAgICAgICAgaWQ9e2xheWVyLmlkfVxuICAgICAgICAgIGlkeD17aWR4fVxuICAgICAgICAgIGlzVmlzaWJsZT17Y29uZmlnLmlzVmlzaWJsZX1cbiAgICAgICAgICBsYWJlbD17Y29uZmlnLmxhYmVsfVxuICAgICAgICAgIGxhYmVsUkNHQ29sb3JWYWx1ZXM9e2RhdGFzZXRzW2NvbmZpZy5kYXRhSWRdLmNvbG9yfVxuICAgICAgICAgIG9uVG9nZ2xlRW5hYmxlQ29uZmlnPXt0aGlzLl90b2dnbGVFbmFibGVDb25maWd9XG4gICAgICAgICAgb25Ub2dnbGVWaXNpYmlsaXR5PXt0aGlzLl90b2dnbGVWaXNpYmlsaXR5fVxuICAgICAgICAgIG9uVXBkYXRlTGF5ZXJMYWJlbD17dGhpcy5fdXBkYXRlTGF5ZXJMYWJlbH1cbiAgICAgICAgICByZW1vdmVMYXllcj17cmVtb3ZlTGF5ZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIHtpc0NvbmZpZ0FjdGl2ZSAmJlxuICAgICAgICAgIDxMYXllckNvbmZpZ3VyYXRvclxuICAgICAgICAgICAgaXNBZGRpbmc9e2lzQWRkaW5nfVxuICAgICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgb3Blbk1vZGFsPXt0aGlzLnByb3BzLm9wZW5Nb2RhbH1cbiAgICAgICAgICAgIHBhbmVsV2lkdGg9e3RoaXMucHJvcHMucGFuZWxXaWR0aCAtIERJTUVOU0lPTlMubGF5ZXJQYW5lbFBhZGRpbmcgKiAyfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJDb25maWc9e3RoaXMudXBkYXRlTGF5ZXJDb25maWd9XG4gICAgICAgICAgICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWc9e3RoaXMudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJUeXBlPXt0aGlzLnVwZGF0ZUxheWVyVHlwZX1cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyVmlzQ29uZmlnPXt0aGlzLnVwZGF0ZUxheWVyVmlzQ29uZmlnfVxuICAgICAgICAgIC8+XG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTGF5ZXJQYW5lbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5MYXllclBhbmVsLmRpc3BsYXlOYW1lID0gJ0xheWVyUGFuZWwnO1xuIl19