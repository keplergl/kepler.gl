'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _class;

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  font-size: 12px;\n  border-radius: 1px;\n  margin-bottom: 8px;\n  \n  &.dragging {\n    cursor: move;\n  }\n'], ['\n  font-size: 12px;\n  border-radius: 1px;\n  margin-bottom: 8px;\n  \n  &.dragging {\n    cursor: move;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAnythingSortable = require('react-anything-sortable');

var _layerConfigurator = require('./layer-configurator');

var _layerConfigurator2 = _interopRequireDefault(_layerConfigurator);

var _layerPanelHeader = require('./layer-panel-header');

var _layerPanelHeader2 = _interopRequireDefault(_layerPanelHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _propTypes2.default.object.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  idx: _propTypes2.default.number.isRequired,
  layerConfigChange: _propTypes2.default.func.isRequired,
  layerTypeChange: _propTypes2.default.func.isRequired,
  openModal: _propTypes2.default.func.isRequired,
  removeLayer: _propTypes2.default.func.isRequired,
  onCloseConfig: _propTypes2.default.func,

  layerVisConfigChange: _propTypes2.default.func,
  layerVisualChannelConfigChange: _propTypes2.default.func
};

var PanelWrapper = _styledComponents2.default.div(_templateObject);

var LayerPanel = (0, _reactAnythingSortable.sortable)(_class = function (_Component) {
  (0, _inherits3.default)(LayerPanel, _Component);

  function LayerPanel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LayerPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = LayerPanel.__proto__ || Object.getPrototypeOf(LayerPanel)).call.apply(_ref, [this].concat(args))), _this), _this.updateLayerConfig = function (newProp) {
      _this.props.layerConfigChange(_this.props.layer, newProp);
    }, _this.updateLayerType = function (newType) {
      _this.props.layerTypeChange(_this.props.layer, newType);
    }, _this.updateLayerVisConfig = function (newVisConfig) {
      _this.props.layerVisConfigChange(_this.props.layer, newVisConfig);
    }, _this.updateLayerVisualChannelConfig = function (newConfig, channel, scaleKey) {
      _this.props.layerVisualChannelConfigChange(_this.props.layer, newConfig, channel, scaleKey);
    }, _this._updateLayerLabel = function (_ref2) {
      var value = _ref2.target.value;

      _this.updateLayerConfig({ label: value });
    }, _this._toggleVisibility = function (e) {
      e.stopPropagation();
      var isVisible = !_this.props.layer.config.isVisible;
      _this.updateLayerConfig({ isVisible: isVisible });
    }, _this._toggleEnableConfig = function (e) {
      e.stopPropagation();
      var isConfigActive = _this.props.layer.config.isConfigActive;

      _this.updateLayerConfig({ isConfigActive: !isConfigActive });
    }, _this._removeLayer = function (e) {
      e.stopPropagation();
      _this.props.removeLayer(_this.props.idx);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(LayerPanel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          layer = _props.layer,
          idx = _props.idx,
          datasets = _props.datasets;
      var config = layer.config;
      var isConfigActive = config.isConfigActive;


      return _react2.default.createElement(
        PanelWrapper,
        {
          active: isConfigActive,
          className: 'layer-panel ' + this.props.className,
          style: this.props.style,
          onMouseDown: this.props.onMouseDown,
          onTouchStart: this.props.onTouchStart
        },
        _react2.default.createElement(_layerPanelHeader2.default, {
          isConfigActive: isConfigActive,
          id: layer.id,
          idx: idx,
          isVisible: config.isVisible,
          label: config.label,
          labelRCGColorValues: datasets[config.dataId].color,
          layerType: layer.type,
          onToggleEnableConfig: this._toggleEnableConfig,
          onToggleVisibility: this._toggleVisibility,
          onUpdateLayerLabel: this._updateLayerLabel,
          onRemoveLayer: this._removeLayer
        }),
        isConfigActive && _react2.default.createElement(_layerConfigurator2.default, {
          layer: layer,
          datasets: datasets,
          openModal: this.props.openModal,
          updateLayerConfig: this.updateLayerConfig,
          updateLayerVisualChannelConfig: this.updateLayerVisualChannelConfig,
          updateLayerType: this.updateLayerType,
          updateLayerVisConfig: this.updateLayerVisConfig
        })
      );
    }
  }]);
  return LayerPanel;
}(_react.Component)) || _class;

exports.default = LayerPanel;


LayerPanel.propTypes = propTypes;
LayerPanel.displayName = 'LayerPanel';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZGF0YXNldHMiLCJpZHgiLCJudW1iZXIiLCJsYXllckNvbmZpZ0NoYW5nZSIsImZ1bmMiLCJsYXllclR5cGVDaGFuZ2UiLCJvcGVuTW9kYWwiLCJyZW1vdmVMYXllciIsIm9uQ2xvc2VDb25maWciLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsIlBhbmVsV3JhcHBlciIsImRpdiIsIkxheWVyUGFuZWwiLCJ1cGRhdGVMYXllckNvbmZpZyIsInByb3BzIiwibmV3UHJvcCIsInVwZGF0ZUxheWVyVHlwZSIsIm5ld1R5cGUiLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsIm5ld1Zpc0NvbmZpZyIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyIsIm5ld0NvbmZpZyIsImNoYW5uZWwiLCJzY2FsZUtleSIsIl91cGRhdGVMYXllckxhYmVsIiwidmFsdWUiLCJ0YXJnZXQiLCJsYWJlbCIsIl90b2dnbGVWaXNpYmlsaXR5IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsImlzVmlzaWJsZSIsImNvbmZpZyIsIl90b2dnbGVFbmFibGVDb25maWciLCJpc0NvbmZpZ0FjdGl2ZSIsIl9yZW1vdmVMYXllciIsImNsYXNzTmFtZSIsInN0eWxlIiwib25Nb3VzZURvd24iLCJvblRvdWNoU3RhcnQiLCJpZCIsImRhdGFJZCIsImNvbG9yIiwidHlwZSIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsU0FBTyxvQkFBVUMsTUFB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QUVFLGNBQUl0QyxNQUFNNEMsRUFGWjtBQUdFLGVBQUt4QyxHQUhQO0FBSUUscUJBQVdnQyxPQUFPRCxTQUpwQjtBQUtFLGlCQUFPQyxPQUFPTCxLQUxoQjtBQU1FLCtCQUFxQjVCLFNBQVNpQyxPQUFPUyxNQUFoQixFQUF3QkMsS0FOL0M7QUFPRSxxQkFBVzlDLE1BQU0rQyxJQVBuQjtBQVFFLGdDQUFzQixLQUFLVixtQkFSN0I7QUFTRSw4QkFBb0IsS0FBS0wsaUJBVDNCO0FBVUUsOEJBQW9CLEtBQUtKLGlCQVYzQjtBQVdFLHlCQUFlLEtBQUtXO0FBWHRCLFVBUEY7QUFvQkdELDBCQUNDO0FBQ0UsaUJBQU90QyxLQURUO0FBRUUsb0JBQVVHLFFBRlo7QUFHRSxxQkFBVyxLQUFLZSxLQUFMLENBQVdULFNBSHhCO0FBSUUsNkJBQW1CLEtBQUtRLGlCQUoxQjtBQUtFLDBDQUFnQyxLQUFLTyw4QkFMdkM7QUFNRSwyQkFBaUIsS0FBS0osZUFOeEI7QUFPRSxnQ0FBc0IsS0FBS0U7QUFQN0I7QUFyQkosT0FERjtBQWtDRDs7Ozs7a0JBakZrQk4sVTs7O0FBb0ZyQkEsV0FBV2pCLFNBQVgsR0FBdUJBLFNBQXZCO0FBQ0FpQixXQUFXZ0MsV0FBWCxHQUF5QixZQUF6QiIsImZpbGUiOiJsYXllci1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtzb3J0YWJsZX0gZnJvbSAncmVhY3QtYW55dGhpbmctc29ydGFibGUnO1xuXG5pbXBvcnQgTGF5ZXJDb25maWd1cmF0b3IgZnJvbSAnLi9sYXllci1jb25maWd1cmF0b3InO1xuaW1wb3J0IExheWVyUGFuZWxIZWFkZXIgZnJvbSAnLi9sYXllci1wYW5lbC1oZWFkZXInO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXllckNvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbGF5ZXJUeXBlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvcGVuTW9kYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZUxheWVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkNsb3NlQ29uZmlnOiBQcm9wVHlwZXMuZnVuYyxcblxuICBsYXllclZpc0NvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IFBhbmVsV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgYm9yZGVyLXJhZGl1czogMXB4O1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIFxuICAmLmRyYWdnaW5nIHtcbiAgICBjdXJzb3I6IG1vdmU7XG4gIH1cbmA7XG5cbkBzb3J0YWJsZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHVwZGF0ZUxheWVyQ29uZmlnID0gbmV3UHJvcCA9PiB7XG4gICAgdGhpcy5wcm9wcy5sYXllckNvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdQcm9wKTtcbiAgfTtcblxuICB1cGRhdGVMYXllclR5cGUgPSBuZXdUeXBlID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyVHlwZUNoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdUeXBlKTtcbiAgfTtcblxuICB1cGRhdGVMYXllclZpc0NvbmZpZyA9IG5ld1Zpc0NvbmZpZyA9PiB7XG4gICAgdGhpcy5wcm9wcy5sYXllclZpc0NvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdWaXNDb25maWcpO1xuICB9O1xuXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyA9IChuZXdDb25maWcsIGNoYW5uZWwsIHNjYWxlS2V5KSA9PiB7XG4gICAgdGhpcy5wcm9wcy5sYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UoXG4gICAgICB0aGlzLnByb3BzLmxheWVyLFxuICAgICAgbmV3Q29uZmlnLFxuICAgICAgY2hhbm5lbCxcbiAgICAgIHNjYWxlS2V5XG4gICAgKTtcbiAgfTtcblxuICBfdXBkYXRlTGF5ZXJMYWJlbCA9ICh7dGFyZ2V0OiB7dmFsdWV9fSkgPT4ge1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe2xhYmVsOiB2YWx1ZX0pO1xuICB9O1xuXG4gIF90b2dnbGVWaXNpYmlsaXR5ID0gZSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBpc1Zpc2libGUgPSAhdGhpcy5wcm9wcy5sYXllci5jb25maWcuaXNWaXNpYmxlO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe2lzVmlzaWJsZX0pO1xuICB9O1xuXG4gIF90b2dnbGVFbmFibGVDb25maWcgPSBlID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHtsYXllcjoge2NvbmZpZzoge2lzQ29uZmlnQWN0aXZlfX19ID0gdGhpcy5wcm9wcztcbiAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtpc0NvbmZpZ0FjdGl2ZTogIWlzQ29uZmlnQWN0aXZlfSk7XG4gIH07XG5cbiAgX3JlbW92ZUxheWVyID0gZSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLnByb3BzLnJlbW92ZUxheWVyKHRoaXMucHJvcHMuaWR4KTtcbiAgfTtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtsYXllciwgaWR4LCBkYXRhc2V0c30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG4gICAgY29uc3Qge2lzQ29uZmlnQWN0aXZlfSA9IGNvbmZpZztcblxuICAgIHJldHVybiAoXG4gICAgICA8UGFuZWxXcmFwcGVyXG4gICAgICAgIGFjdGl2ZT17aXNDb25maWdBY3RpdmV9XG4gICAgICAgIGNsYXNzTmFtZT17YGxheWVyLXBhbmVsICR7dGhpcy5wcm9wcy5jbGFzc05hbWV9YH1cbiAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMuc3R5bGV9XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLm9uTW91c2VEb3dufVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMucHJvcHMub25Ub3VjaFN0YXJ0fVxuICAgICAgPlxuICAgICAgICA8TGF5ZXJQYW5lbEhlYWRlclxuICAgICAgICAgIGlzQ29uZmlnQWN0aXZlPXtpc0NvbmZpZ0FjdGl2ZX1cbiAgICAgICAgICBpZD17bGF5ZXIuaWR9XG4gICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgaXNWaXNpYmxlPXtjb25maWcuaXNWaXNpYmxlfVxuICAgICAgICAgIGxhYmVsPXtjb25maWcubGFiZWx9XG4gICAgICAgICAgbGFiZWxSQ0dDb2xvclZhbHVlcz17ZGF0YXNldHNbY29uZmlnLmRhdGFJZF0uY29sb3J9XG4gICAgICAgICAgbGF5ZXJUeXBlPXtsYXllci50eXBlfVxuICAgICAgICAgIG9uVG9nZ2xlRW5hYmxlQ29uZmlnPXt0aGlzLl90b2dnbGVFbmFibGVDb25maWd9XG4gICAgICAgICAgb25Ub2dnbGVWaXNpYmlsaXR5PXt0aGlzLl90b2dnbGVWaXNpYmlsaXR5fVxuICAgICAgICAgIG9uVXBkYXRlTGF5ZXJMYWJlbD17dGhpcy5fdXBkYXRlTGF5ZXJMYWJlbH1cbiAgICAgICAgICBvblJlbW92ZUxheWVyPXt0aGlzLl9yZW1vdmVMYXllcn1cbiAgICAgICAgLz5cbiAgICAgICAge2lzQ29uZmlnQWN0aXZlICYmIChcbiAgICAgICAgICA8TGF5ZXJDb25maWd1cmF0b3JcbiAgICAgICAgICAgIGxheWVyPXtsYXllcn1cbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIG9wZW5Nb2RhbD17dGhpcy5wcm9wcy5vcGVuTW9kYWx9XG4gICAgICAgICAgICB1cGRhdGVMYXllckNvbmZpZz17dGhpcy51cGRhdGVMYXllckNvbmZpZ31cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZz17dGhpcy51cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWd9XG4gICAgICAgICAgICB1cGRhdGVMYXllclR5cGU9e3RoaXMudXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJWaXNDb25maWc9e3RoaXMudXBkYXRlTGF5ZXJWaXNDb25maWd9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvUGFuZWxXcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cblxuTGF5ZXJQYW5lbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5MYXllclBhbmVsLmRpc3BsYXlOYW1lID0gJ0xheWVyUGFuZWwnO1xuIl19