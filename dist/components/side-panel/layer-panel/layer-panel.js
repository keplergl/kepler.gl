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
      {
        ref: 'container',
        className: (0, _classnames2.default)('layer-panel ' + this.props.className, {
          active: isConfigActive
        }),
        style: this.props.style,
        onMouseDown: this.props.onMouseDown,
        onTouchStart: this.props.onTouchStart
      },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZGF0YXNldHMiLCJpZHgiLCJudW1iZXIiLCJwYW5lbFdpZHRoIiwibGF5ZXJDb25maWdDaGFuZ2UiLCJmdW5jIiwibGF5ZXJUeXBlQ2hhbmdlIiwib3Blbk1vZGFsIiwicmVtb3ZlTGF5ZXIiLCJvbkNsb3NlQ29uZmlnIiwibGF5ZXJWaXNDb25maWdDaGFuZ2UiLCJsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UiLCJMYXllclBhbmVsIiwidXBkYXRlTGF5ZXJDb25maWciLCJwcm9wcyIsIm5ld1Byb3AiLCJ1cGRhdGVMYXllclR5cGUiLCJuZXdUeXBlIiwidXBkYXRlTGF5ZXJWaXNDb25maWciLCJuZXdWaXNDb25maWciLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWciLCJuZXdDb25maWciLCJjaGFubmVsIiwic2NhbGVLZXkiLCJfdXBkYXRlTGF5ZXJMYWJlbCIsInZhbHVlIiwidGFyZ2V0IiwibGFiZWwiLCJfdG9nZ2xlVmlzaWJpbGl0eSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJpc1Zpc2libGUiLCJjb25maWciLCJfdG9nZ2xlRW5hYmxlQ29uZmlnIiwiZXZlbnQiLCJpc0NvbmZpZ0FjdGl2ZSIsInJlbmRlciIsImlzQWRkaW5nIiwiY2xhc3NOYW1lIiwiYWN0aXZlIiwic3R5bGUiLCJvbk1vdXNlRG93biIsIm9uVG91Y2hTdGFydCIsImlkIiwiZGF0YUlkIiwiY29sb3IiLCJsYXllclBhbmVsUGFkZGluZyIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZ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O0FBU0U7QUFDRSx3QkFBZ0JQLGNBRGxCO0FBRUUsWUFBSXRDLE1BQU04QyxFQUZaO0FBR0UsYUFBSzFDLEdBSFA7QUFJRSxtQkFBVytCLE9BQU9ELFNBSnBCO0FBS0UsZUFBT0MsT0FBT0wsS0FMaEI7QUFNRSw2QkFBcUIzQixTQUFTZ0MsT0FBT1ksTUFBaEIsRUFBd0JDLEtBTi9DO0FBT0UsOEJBQXNCLEtBQUtaLG1CQVA3QjtBQVFFLDRCQUFvQixLQUFLTCxpQkFSM0I7QUFTRSw0QkFBb0IsS0FBS0osaUJBVDNCO0FBVUUscUJBQWFoQjtBQVZmLFFBVEY7QUFxQkcyQix3QkFDQztBQUNFLGtCQUFVRSxRQURaO0FBRUUsZUFBT3hDLEtBRlQ7QUFHRSxrQkFBVUcsUUFIWjtBQUlFLG1CQUFXLEtBQUtjLEtBQUwsQ0FBV1AsU0FKeEI7QUFLRSxvQkFDRSxLQUFLTyxLQUFMLENBQVdYLFVBQVgsR0FBd0IsNEJBQVcyQyxpQkFBWCxHQUErQixDQU4zRDtBQVFFLDJCQUFtQixLQUFLakMsaUJBUjFCO0FBU0Usd0NBQWdDLEtBQUtPLDhCQVR2QztBQVVFLHlCQUFpQixLQUFLSixlQVZ4QjtBQVdFLDhCQUFzQixLQUFLRTtBQVg3QjtBQXRCSixLQURGO0FBdUNELEc7Ozs7O2tCQWxGa0JOLFU7OztBQXFGckJBLFdBQVdoQixTQUFYLEdBQXVCQSxTQUF2QjtBQUNBZ0IsV0FBV21DLFdBQVgsR0FBeUIsWUFBekIiLCJmaWxlIjoibGF5ZXItcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7c29ydGFibGV9IGZyb20gJ3JlYWN0LWFueXRoaW5nLXNvcnRhYmxlJztcblxuaW1wb3J0IExheWVyQ29uZmlndXJhdG9yIGZyb20gJy4vbGF5ZXItY29uZmlndXJhdG9yJztcbmltcG9ydCBMYXllclBhbmVsSXRlbSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9sYXllci1wYW5lbC1pdGVtJztcbmltcG9ydCB7RElNRU5TSU9OU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBwYW5lbFdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxheWVyQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYXllclR5cGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5Nb2RhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlTGF5ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ2xvc2VDb25maWc6IFByb3BUeXBlcy5mdW5jLFxuXG4gIGxheWVyVmlzQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuQHNvcnRhYmxlXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllclBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgdXBkYXRlTGF5ZXJDb25maWcgPSBuZXdQcm9wID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyQ29uZmlnQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXIsIG5ld1Byb3ApO1xuICB9O1xuXG4gIHVwZGF0ZUxheWVyVHlwZSA9IG5ld1R5cGUgPT4ge1xuICAgIHRoaXMucHJvcHMubGF5ZXJUeXBlQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXIsIG5ld1R5cGUpO1xuICB9O1xuXG4gIHVwZGF0ZUxheWVyVmlzQ29uZmlnID0gbmV3VmlzQ29uZmlnID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyVmlzQ29uZmlnQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXIsIG5ld1Zpc0NvbmZpZyk7XG4gIH07XG5cbiAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnID0gKG5ld0NvbmZpZywgY2hhbm5lbCwgc2NhbGVLZXkpID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZShcbiAgICAgIHRoaXMucHJvcHMubGF5ZXIsXG4gICAgICBuZXdDb25maWcsXG4gICAgICBjaGFubmVsLFxuICAgICAgc2NhbGVLZXlcbiAgICApO1xuICB9O1xuXG4gIF91cGRhdGVMYXllckxhYmVsID0gKHt0YXJnZXQ6IHt2YWx1ZX19KSA9PiB7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7bGFiZWw6IHZhbHVlfSk7XG4gIH07XG5cbiAgX3RvZ2dsZVZpc2liaWxpdHkgPSBlID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9ICF0aGlzLnByb3BzLmxheWVyLmNvbmZpZy5pc1Zpc2libGU7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7aXNWaXNpYmxlfSk7XG4gIH07XG5cbiAgX3RvZ2dsZUVuYWJsZUNvbmZpZyA9IGV2ZW50ID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7bGF5ZXI6IHtjb25maWc6IHtpc0NvbmZpZ0FjdGl2ZX19fSA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7aXNDb25maWdBY3RpdmU6ICFpc0NvbmZpZ0FjdGl2ZX0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bGF5ZXIsIGlkeCwgcmVtb3ZlTGF5ZXIsIGRhdGFzZXRzLCBpc0FkZGluZ30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG4gICAgY29uc3Qge2lzQ29uZmlnQWN0aXZlfSA9IGNvbmZpZztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj1cImNvbnRhaW5lclwiXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhgbGF5ZXItcGFuZWwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZX1gLCB7XG4gICAgICAgICAgYWN0aXZlOiBpc0NvbmZpZ0FjdGl2ZVxuICAgICAgICB9KX1cbiAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMuc3R5bGV9XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLm9uTW91c2VEb3dufVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMucHJvcHMub25Ub3VjaFN0YXJ0fVxuICAgICAgPlxuICAgICAgICA8TGF5ZXJQYW5lbEl0ZW1cbiAgICAgICAgICBpc0NvbmZpZ0FjdGl2ZT17aXNDb25maWdBY3RpdmV9XG4gICAgICAgICAgaWQ9e2xheWVyLmlkfVxuICAgICAgICAgIGlkeD17aWR4fVxuICAgICAgICAgIGlzVmlzaWJsZT17Y29uZmlnLmlzVmlzaWJsZX1cbiAgICAgICAgICBsYWJlbD17Y29uZmlnLmxhYmVsfVxuICAgICAgICAgIGxhYmVsUkNHQ29sb3JWYWx1ZXM9e2RhdGFzZXRzW2NvbmZpZy5kYXRhSWRdLmNvbG9yfVxuICAgICAgICAgIG9uVG9nZ2xlRW5hYmxlQ29uZmlnPXt0aGlzLl90b2dnbGVFbmFibGVDb25maWd9XG4gICAgICAgICAgb25Ub2dnbGVWaXNpYmlsaXR5PXt0aGlzLl90b2dnbGVWaXNpYmlsaXR5fVxuICAgICAgICAgIG9uVXBkYXRlTGF5ZXJMYWJlbD17dGhpcy5fdXBkYXRlTGF5ZXJMYWJlbH1cbiAgICAgICAgICByZW1vdmVMYXllcj17cmVtb3ZlTGF5ZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIHtpc0NvbmZpZ0FjdGl2ZSAmJiAoXG4gICAgICAgICAgPExheWVyQ29uZmlndXJhdG9yXG4gICAgICAgICAgICBpc0FkZGluZz17aXNBZGRpbmd9XG4gICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICBvcGVuTW9kYWw9e3RoaXMucHJvcHMub3Blbk1vZGFsfVxuICAgICAgICAgICAgcGFuZWxXaWR0aD17XG4gICAgICAgICAgICAgIHRoaXMucHJvcHMucGFuZWxXaWR0aCAtIERJTUVOU0lPTlMubGF5ZXJQYW5lbFBhZGRpbmcgKiAyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGVMYXllckNvbmZpZz17dGhpcy51cGRhdGVMYXllckNvbmZpZ31cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZz17dGhpcy51cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWd9XG4gICAgICAgICAgICB1cGRhdGVMYXllclR5cGU9e3RoaXMudXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJWaXNDb25maWc9e3RoaXMudXBkYXRlTGF5ZXJWaXNDb25maWd9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTGF5ZXJQYW5lbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5MYXllclBhbmVsLmRpc3BsYXlOYW1lID0gJ0xheWVyUGFuZWwnO1xuIl19