"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _layerConfigurator = _interopRequireDefault(require("./layer-configurator"));

var _layerPanelHeader = _interopRequireDefault(require("./layer-panel-header"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 12px;\n  border-radius: 1px;\n  margin-bottom: 8px;\n  z-index: 1000;\n\n  &.dragging {\n    cursor: move;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var PanelWrapper = _styledComponents["default"].div(_templateObject());

LayerPanelFactory.deps = [_layerConfigurator["default"], _layerPanelHeader["default"]];

function LayerPanelFactory(LayerConfigurator, LayerPanelHeader) {
  var LayerPanel =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(LayerPanel, _Component);

    function LayerPanel() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, LayerPanel);

      for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
        _args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(LayerPanel)).call.apply(_getPrototypeOf2, [this].concat(_args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateLayerConfig", function (newProp) {
        _this.props.layerConfigChange(_this.props.layer, newProp);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateLayerType", function (newType) {
        _this.props.layerTypeChange(_this.props.layer, newType);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateLayerVisConfig", function (newVisConfig) {
        _this.props.layerVisConfigChange(_this.props.layer, newVisConfig);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateLayerColorUI", function () {
        var _this$props;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        (_this$props = _this.props).layerColorUIChange.apply(_this$props, [_this.props.layer].concat(args));
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateLayerTextLabel", function () {
        var _this$props2;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        (_this$props2 = _this.props).layerTextLabelChange.apply(_this$props2, [_this.props.layer].concat(args));
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateLayerVisualChannelConfig", function (newConfig, channel, scaleKey) {
        _this.props.layerVisualChannelConfigChange(_this.props.layer, newConfig, channel, scaleKey);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateLayerLabel", function (_ref) {
        var value = _ref.target.value;

        _this.updateLayerConfig({
          label: value
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_toggleVisibility", function (e) {
        e.stopPropagation();
        var isVisible = !_this.props.layer.config.isVisible;

        _this.updateLayerConfig({
          isVisible: isVisible
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_toggleEnableConfig", function (e) {
        e.stopPropagation();
        var isConfigActive = _this.props.layer.config.isConfigActive;

        _this.updateLayerConfig({
          isConfigActive: !isConfigActive
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_removeLayer", function (e) {
        e.stopPropagation();

        _this.props.removeLayer(_this.props.idx);
      });
      return _this;
    }

    (0, _createClass2["default"])(LayerPanel, [{
      key: "render",
      value: function render() {
        var _this$props3 = this.props,
            layer = _this$props3.layer,
            datasets = _this$props3.datasets,
            layerTypeOptions = _this$props3.layerTypeOptions;
        var config = layer.config;
        var isConfigActive = config.isConfigActive;
        return _react["default"].createElement(PanelWrapper, {
          active: isConfigActive,
          className: "layer-panel ".concat(this.props.className),
          style: this.props.style,
          onMouseDown: this.props.onMouseDown,
          onTouchStart: this.props.onTouchStart
        }, _react["default"].createElement(LayerPanelHeader, {
          isConfigActive: isConfigActive,
          layerId: layer.id,
          isVisible: config.isVisible,
          label: config.label,
          labelRCGColorValues: datasets[config.dataId].color,
          layerType: layer.type,
          onToggleEnableConfig: this._toggleEnableConfig,
          onToggleVisibility: this._toggleVisibility,
          onUpdateLayerLabel: this._updateLayerLabel,
          onRemoveLayer: this._removeLayer
        }), isConfigActive && _react["default"].createElement(LayerConfigurator, {
          layer: layer,
          datasets: datasets,
          layerTypeOptions: layerTypeOptions,
          openModal: this.props.openModal,
          updateLayerColorUI: this.updateLayerColorUI,
          updateLayerConfig: this.updateLayerConfig,
          updateLayerVisualChannelConfig: this.updateLayerVisualChannelConfig,
          updateLayerType: this.updateLayerType,
          updateLayerTextLabel: this.updateLayerTextLabel,
          updateLayerVisConfig: this.updateLayerVisConfig
        }));
      }
    }]);
    return LayerPanel;
  }(_react.Component);

  (0, _defineProperty2["default"])(LayerPanel, "propTypes", {
    layer: _propTypes["default"].object.isRequired,
    datasets: _propTypes["default"].object.isRequired,
    idx: _propTypes["default"].number.isRequired,
    layerConfigChange: _propTypes["default"].func.isRequired,
    layerTypeChange: _propTypes["default"].func.isRequired,
    openModal: _propTypes["default"].func.isRequired,
    removeLayer: _propTypes["default"].func.isRequired,
    onCloseConfig: _propTypes["default"].func,
    layerTypeOptions: _propTypes["default"].arrayOf(_propTypes["default"].any),
    layerVisConfigChange: _propTypes["default"].func.isRequired,
    layerVisualChannelConfigChange: _propTypes["default"].func.isRequired,
    layerColorUIChange: _propTypes["default"].func.isRequired,
    updateAnimationTime: _propTypes["default"].func,
    updateLayerAnimationSpeed: _propTypes["default"].func
  });
  return LayerPanel;
}

var _default = LayerPanelFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuanMiXSwibmFtZXMiOlsiUGFuZWxXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiTGF5ZXJQYW5lbEZhY3RvcnkiLCJkZXBzIiwiTGF5ZXJDb25maWd1cmF0b3JGYWN0b3J5IiwiTGF5ZXJQYW5lbEhlYWRlckZhY3RvcnkiLCJMYXllckNvbmZpZ3VyYXRvciIsIkxheWVyUGFuZWxIZWFkZXIiLCJMYXllclBhbmVsIiwibmV3UHJvcCIsInByb3BzIiwibGF5ZXJDb25maWdDaGFuZ2UiLCJsYXllciIsIm5ld1R5cGUiLCJsYXllclR5cGVDaGFuZ2UiLCJuZXdWaXNDb25maWciLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsImFyZ3MiLCJsYXllckNvbG9yVUlDaGFuZ2UiLCJsYXllclRleHRMYWJlbENoYW5nZSIsIm5ld0NvbmZpZyIsImNoYW5uZWwiLCJzY2FsZUtleSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsInZhbHVlIiwidGFyZ2V0IiwidXBkYXRlTGF5ZXJDb25maWciLCJsYWJlbCIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJpc1Zpc2libGUiLCJjb25maWciLCJpc0NvbmZpZ0FjdGl2ZSIsInJlbW92ZUxheWVyIiwiaWR4IiwiZGF0YXNldHMiLCJsYXllclR5cGVPcHRpb25zIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJvbk1vdXNlRG93biIsIm9uVG91Y2hTdGFydCIsImlkIiwiZGF0YUlkIiwiY29sb3IiLCJ0eXBlIiwiX3RvZ2dsZUVuYWJsZUNvbmZpZyIsIl90b2dnbGVWaXNpYmlsaXR5IiwiX3VwZGF0ZUxheWVyTGFiZWwiLCJfcmVtb3ZlTGF5ZXIiLCJvcGVuTW9kYWwiLCJ1cGRhdGVMYXllckNvbG9yVUkiLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWciLCJ1cGRhdGVMYXllclR5cGUiLCJ1cGRhdGVMYXllclRleHRMYWJlbCIsInVwZGF0ZUxheWVyVmlzQ29uZmlnIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm51bWJlciIsImZ1bmMiLCJvbkNsb3NlQ29uZmlnIiwiYXJyYXlPZiIsImFueSIsInVwZGF0ZUFuaW1hdGlvblRpbWUiLCJ1cGRhdGVMYXllckFuaW1hdGlvblNwZWVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBR0MsNkJBQU9DLEdBQVYsbUJBQWxCOztBQVdBQyxpQkFBaUIsQ0FBQ0MsSUFBbEIsR0FBeUIsQ0FBQ0MsNkJBQUQsRUFBMkJDLDRCQUEzQixDQUF6Qjs7QUFFQSxTQUFTSCxpQkFBVCxDQUEyQkksaUJBQTNCLEVBQThDQyxnQkFBOUMsRUFBZ0U7QUFBQSxNQUN4REMsVUFEd0Q7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSw0R0FtQnhDLFVBQUFDLE9BQU8sRUFBSTtBQUM3QixjQUFLQyxLQUFMLENBQVdDLGlCQUFYLENBQTZCLE1BQUtELEtBQUwsQ0FBV0UsS0FBeEMsRUFBK0NILE9BQS9DO0FBQ0QsT0FyQjJEO0FBQUEsMEdBdUIxQyxVQUFBSSxPQUFPLEVBQUk7QUFDM0IsY0FBS0gsS0FBTCxDQUFXSSxlQUFYLENBQTJCLE1BQUtKLEtBQUwsQ0FBV0UsS0FBdEMsRUFBNkNDLE9BQTdDO0FBQ0QsT0F6QjJEO0FBQUEsK0dBMkJyQyxVQUFBRSxZQUFZLEVBQUk7QUFDckMsY0FBS0wsS0FBTCxDQUFXTSxvQkFBWCxDQUFnQyxNQUFLTixLQUFMLENBQVdFLEtBQTNDLEVBQWtERyxZQUFsRDtBQUNELE9BN0IyRDtBQUFBLDZHQStCdkMsWUFBYTtBQUFBOztBQUFBLDJDQUFURSxJQUFTO0FBQVRBLFVBQUFBLElBQVM7QUFBQTs7QUFDaEMsNkJB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QixzQkFBVUksSUFBVixDQUFlRixVQVBYO0FBUWpCRyxJQUFBQSxhQUFhLEVBQUVMLHNCQUFVSSxJQVJSO0FBU2pCeEIsSUFBQUEsZ0JBQWdCLEVBQUVvQixzQkFBVU0sT0FBVixDQUFrQk4sc0JBQVVPLEdBQTVCLENBVEQ7QUFVakIvQyxJQUFBQSxvQkFBb0IsRUFBRXdDLHNCQUFVSSxJQUFWLENBQWVGLFVBVnBCO0FBV2pCbkMsSUFBQUEsOEJBQThCLEVBQUVpQyxzQkFBVUksSUFBVixDQUFlRixVQVg5QjtBQVlqQnhDLElBQUFBLGtCQUFrQixFQUFFc0Msc0JBQVVJLElBQVYsQ0FBZUYsVUFabEI7QUFhakJNLElBQUFBLG1CQUFtQixFQUFFUixzQkFBVUksSUFiZDtBQWNqQkssSUFBQUEseUJBQXlCLEVBQUVULHNCQUFVSTtBQWRwQixHQUZ5QztBQWdIOUQsU0FBT3BELFVBQVA7QUFDRDs7ZUFFY04saUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IExheWVyQ29uZmlndXJhdG9yRmFjdG9yeSBmcm9tICcuL2xheWVyLWNvbmZpZ3VyYXRvcic7XG5pbXBvcnQgTGF5ZXJQYW5lbEhlYWRlckZhY3RvcnkgZnJvbSAnLi9sYXllci1wYW5lbC1oZWFkZXInO1xuXG5jb25zdCBQYW5lbFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBmb250LXNpemU6IDEycHg7XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICB6LWluZGV4OiAxMDAwO1xuXG4gICYuZHJhZ2dpbmcge1xuICAgIGN1cnNvcjogbW92ZTtcbiAgfVxuYDtcblxuTGF5ZXJQYW5lbEZhY3RvcnkuZGVwcyA9IFtMYXllckNvbmZpZ3VyYXRvckZhY3RvcnksIExheWVyUGFuZWxIZWFkZXJGYWN0b3J5XTtcblxuZnVuY3Rpb24gTGF5ZXJQYW5lbEZhY3RvcnkoTGF5ZXJDb25maWd1cmF0b3IsIExheWVyUGFuZWxIZWFkZXIpIHtcbiAgY2xhc3MgTGF5ZXJQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgaWR4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBsYXllckNvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyVHlwZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9wZW5Nb2RhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHJlbW92ZUxheWVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb25DbG9zZUNvbmZpZzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBsYXllclR5cGVPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICAgIGxheWVyVmlzQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJDb2xvclVJQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgdXBkYXRlQW5pbWF0aW9uVGltZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICB1cGRhdGVMYXllckFuaW1hdGlvblNwZWVkOiBQcm9wVHlwZXMuZnVuY1xuICAgIH07XG5cbiAgICB1cGRhdGVMYXllckNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5sYXllckNvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdQcm9wKTtcbiAgICB9O1xuXG4gICAgdXBkYXRlTGF5ZXJUeXBlID0gbmV3VHlwZSA9PiB7XG4gICAgICB0aGlzLnByb3BzLmxheWVyVHlwZUNoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdUeXBlKTtcbiAgICB9O1xuXG4gICAgdXBkYXRlTGF5ZXJWaXNDb25maWcgPSBuZXdWaXNDb25maWcgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5sYXllclZpc0NvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdWaXNDb25maWcpO1xuICAgIH07XG5cbiAgICB1cGRhdGVMYXllckNvbG9yVUkgPSAoLi4uYXJncykgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5sYXllckNvbG9yVUlDaGFuZ2UodGhpcy5wcm9wcy5sYXllciwgLi4uYXJncyk7XG4gICAgfTtcblxuICAgIHVwZGF0ZUxheWVyVGV4dExhYmVsID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgIHRoaXMucHJvcHMubGF5ZXJUZXh0TGFiZWxDaGFuZ2UodGhpcy5wcm9wcy5sYXllciwgLi4uYXJncyk7XG4gICAgfTtcblxuICAgIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyA9IChuZXdDb25maWcsIGNoYW5uZWwsIHNjYWxlS2V5KSA9PiB7XG4gICAgICB0aGlzLnByb3BzLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdDb25maWcsIGNoYW5uZWwsIHNjYWxlS2V5KTtcbiAgICB9O1xuXG4gICAgX3VwZGF0ZUxheWVyTGFiZWwgPSAoe3RhcmdldDoge3ZhbHVlfX0pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe2xhYmVsOiB2YWx1ZX0pO1xuICAgIH07XG5cbiAgICBfdG9nZ2xlVmlzaWJpbGl0eSA9IGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9ICF0aGlzLnByb3BzLmxheWVyLmNvbmZpZy5pc1Zpc2libGU7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtpc1Zpc2libGV9KTtcbiAgICB9O1xuXG4gICAgX3RvZ2dsZUVuYWJsZUNvbmZpZyA9IGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbGF5ZXI6IHtcbiAgICAgICAgICBjb25maWc6IHtpc0NvbmZpZ0FjdGl2ZX1cbiAgICAgICAgfVxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtpc0NvbmZpZ0FjdGl2ZTogIWlzQ29uZmlnQWN0aXZlfSk7XG4gICAgfTtcblxuICAgIF9yZW1vdmVMYXllciA9IGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMucHJvcHMucmVtb3ZlTGF5ZXIodGhpcy5wcm9wcy5pZHgpO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7bGF5ZXIsIGRhdGFzZXRzLCBsYXllclR5cGVPcHRpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB7Y29uZmlnfSA9IGxheWVyO1xuICAgICAgY29uc3Qge2lzQ29uZmlnQWN0aXZlfSA9IGNvbmZpZztcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFBhbmVsV3JhcHBlclxuICAgICAgICAgIGFjdGl2ZT17aXNDb25maWdBY3RpdmV9XG4gICAgICAgICAgY2xhc3NOYW1lPXtgbGF5ZXItcGFuZWwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZX1gfVxuICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLm9uTW91c2VEb3dufVxuICAgICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5wcm9wcy5vblRvdWNoU3RhcnR9XG4gICAgICAgID5cbiAgICAgICAgICA8TGF5ZXJQYW5lbEhlYWRlclxuICAgICAgICAgICAgaXNDb25maWdBY3RpdmU9e2lzQ29uZmlnQWN0aXZlfVxuICAgICAgICAgICAgbGF5ZXJJZD17bGF5ZXIuaWR9XG4gICAgICAgICAgICBpc1Zpc2libGU9e2NvbmZpZy5pc1Zpc2libGV9XG4gICAgICAgICAgICBsYWJlbD17Y29uZmlnLmxhYmVsfVxuICAgICAgICAgICAgbGFiZWxSQ0dDb2xvclZhbHVlcz17ZGF0YXNldHNbY29uZmlnLmRhdGFJZF0uY29sb3J9XG4gICAgICAgICAgICBsYXllclR5cGU9e2xheWVyLnR5cGV9XG4gICAgICAgICAgICBvblRvZ2dsZUVuYWJsZUNvbmZpZz17dGhpcy5fdG9nZ2xlRW5hYmxlQ29uZmlnfVxuICAgICAgICAgICAgb25Ub2dnbGVWaXNpYmlsaXR5PXt0aGlzLl90b2dnbGVWaXNpYmlsaXR5fVxuICAgICAgICAgICAgb25VcGRhdGVMYXllckxhYmVsPXt0aGlzLl91cGRhdGVMYXllckxhYmVsfVxuICAgICAgICAgICAgb25SZW1vdmVMYXllcj17dGhpcy5fcmVtb3ZlTGF5ZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7aXNDb25maWdBY3RpdmUgJiYgKFxuICAgICAgICAgICAgPExheWVyQ29uZmlndXJhdG9yXG4gICAgICAgICAgICAgIGxheWVyPXtsYXllcn1cbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBsYXllclR5cGVPcHRpb25zPXtsYXllclR5cGVPcHRpb25zfVxuICAgICAgICAgICAgICBvcGVuTW9kYWw9e3RoaXMucHJvcHMub3Blbk1vZGFsfVxuICAgICAgICAgICAgICB1cGRhdGVMYXllckNvbG9yVUk9e3RoaXMudXBkYXRlTGF5ZXJDb2xvclVJfVxuICAgICAgICAgICAgICB1cGRhdGVMYXllckNvbmZpZz17dGhpcy51cGRhdGVMYXllckNvbmZpZ31cbiAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnPXt0aGlzLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ31cbiAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJUeXBlPXt0aGlzLnVwZGF0ZUxheWVyVHlwZX1cbiAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJUZXh0TGFiZWw9e3RoaXMudXBkYXRlTGF5ZXJUZXh0TGFiZWx9XG4gICAgICAgICAgICAgIHVwZGF0ZUxheWVyVmlzQ29uZmlnPXt0aGlzLnVwZGF0ZUxheWVyVmlzQ29uZmlnfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVsV3JhcHBlcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIExheWVyUGFuZWw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheWVyUGFuZWxGYWN0b3J5O1xuIl19