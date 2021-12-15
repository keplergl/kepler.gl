"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _layerConfigurator = _interopRequireDefault(require("./layer-configurator"));

var _layerPanelHeader = _interopRequireDefault(require("./layer-panel-header"));

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PanelWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 12px;\n  border-radius: 1px;\n  margin-bottom: 8px;\n  z-index: 1000;\n\n  &.dragging {\n    cursor: move;\n  }\n"])));

LayerPanelFactory.deps = [_layerConfigurator["default"], _layerPanelHeader["default"]];

function LayerPanelFactory(LayerConfigurator, LayerPanelHeader) {
  var LayerPanel = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(LayerPanel, _Component);

    var _super = _createSuper(LayerPanel);

    function LayerPanel() {
      var _this;

      (0, _classCallCheck2["default"])(this, LayerPanel);

      for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
        _args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(_args));
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
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_duplicateLayer", function (e) {
        e.stopPropagation();

        _this.props.duplicateLayer(_this.props.idx);
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
        return /*#__PURE__*/_react["default"].createElement(PanelWrapper, {
          active: isConfigActive,
          className: "layer-panel ".concat(this.props.className),
          style: this.props.style,
          onMouseDown: this.props.onMouseDown,
          onTouchStart: this.props.onTouchStart
        }, /*#__PURE__*/_react["default"].createElement(LayerPanelHeader, {
          isConfigActive: isConfigActive,
          layerId: layer.id,
          isVisible: config.isVisible,
          label: config.label,
          labelRCGColorValues: config.dataId ? datasets[config.dataId].color : null,
          layerType: layer.type,
          onToggleEnableConfig: this._toggleEnableConfig,
          onToggleVisibility: this._toggleVisibility,
          onUpdateLayerLabel: this._updateLayerLabel,
          onRemoveLayer: this._removeLayer,
          onDuplicateLayer: this._duplicateLayer
        }), isConfigActive && /*#__PURE__*/_react["default"].createElement(LayerConfigurator, {
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
    duplicateLayer: _propTypes["default"].func.isRequired,
    onCloseConfig: _propTypes["default"].func,
    layerTypeOptions: _propTypes["default"].arrayOf(_propTypes["default"].any),
    layerVisConfigChange: _propTypes["default"].func.isRequired,
    layerVisualChannelConfigChange: _propTypes["default"].func.isRequired,
    layerColorUIChange: _propTypes["default"].func.isRequired,
    setLayerAnimationTime: _propTypes["default"].func,
    updateLayerAnimationSpeed: _propTypes["default"].func
  });
  return LayerPanel;
}

var _default = LayerPanelFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuanMiXSwibmFtZXMiOlsiUGFuZWxXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiTGF5ZXJQYW5lbEZhY3RvcnkiLCJkZXBzIiwiTGF5ZXJDb25maWd1cmF0b3JGYWN0b3J5IiwiTGF5ZXJQYW5lbEhlYWRlckZhY3RvcnkiLCJMYXllckNvbmZpZ3VyYXRvciIsIkxheWVyUGFuZWxIZWFkZXIiLCJMYXllclBhbmVsIiwibmV3UHJvcCIsInByb3BzIiwibGF5ZXJDb25maWdDaGFuZ2UiLCJsYXllciIsIm5ld1R5cGUiLCJsYXllclR5cGVDaGFuZ2UiLCJuZXdWaXNDb25maWciLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsImFyZ3MiLCJsYXllckNvbG9yVUlDaGFuZ2UiLCJsYXllclRleHRMYWJlbENoYW5nZSIsIm5ld0NvbmZpZyIsImNoYW5uZWwiLCJzY2FsZUtleSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsInZhbHVlIiwidGFyZ2V0IiwidXBkYXRlTGF5ZXJDb25maWciLCJsYWJlbCIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJpc1Zpc2libGUiLCJjb25maWciLCJpc0NvbmZpZ0FjdGl2ZSIsInJlbW92ZUxheWVyIiwiaWR4IiwiZHVwbGljYXRlTGF5ZXIiLCJkYXRhc2V0cyIsImxheWVyVHlwZU9wdGlvbnMiLCJjbGFzc05hbWUiLCJzdHlsZSIsIm9uTW91c2VEb3duIiwib25Ub3VjaFN0YXJ0IiwiaWQiLCJkYXRhSWQiLCJjb2xvciIsInR5cGUiLCJfdG9nZ2xlRW5hYmxlQ29uZmlnIiwiX3RvZ2dsZVZpc2liaWxpdHkiLCJfdXBkYXRlTGF5ZXJMYWJlbCIsIl9yZW1vdmVMYXllciIsIl9kdXBsaWNhdGVMYXllciIsIm9wZW5Nb2RhbCIsInVwZGF0ZUxheWVyQ29sb3JVSSIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyIsInVwZGF0ZUxheWVyVHlwZSIsInVwZGF0ZUxheWVyVGV4dExhYmVsIiwidXBkYXRlTGF5ZXJWaXNDb25maWciLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwibnVtYmVyIiwiZnVuYyIsIm9uQ2xvc2VDb25maWciLCJhcnJheU9mIiwiYW55Iiwic2V0TGF5ZXJBbmltYXRpb25UaW1lIiwidXBkYXRlTGF5ZXJBbmltYXRpb25TcGVlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBR0MsNkJBQU9DLEdBQVYsc05BQWxCOztBQVdBQyxpQkFBaUIsQ0FBQ0MsSUFBbEIsR0FBeUIsQ0FBQ0MsNkJBQUQsRUFBMkJDLDRCQUEzQixDQUF6Qjs7QUFFQSxTQUFTSCxpQkFBVCxDQUEyQkksaUJBQTNCLEVBQThDQyxnQkFBOUMsRUFBZ0U7QUFBQSxNQUN4REMsVUFEd0Q7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLDRHQW9CeEMsVUFBQUMsT0FBTyxFQUFJO0FBQzdCLGNBQUtDLEtBQUwsQ0FBV0MsaUJBQVgsQ0FBNkIsTUFBS0QsS0FBTCxDQUFXRSxLQUF4QyxFQUErQ0gsT0FBL0M7QUFDRCxPQXRCMkQ7QUFBQSwwR0F3QjFDLFVBQUFJLE9BQU8sRUFBSTtBQUMzQixjQUFLSCxLQUFMLENBQVdJLGVBQVgsQ0FBMkIsTUFBS0osS0FBTCxDQUFXRSxLQUF0QyxFQUE2Q0MsT0FBN0M7QUFDRCxPQTFCMkQ7QUFBQSwrR0E0QnJDLFVBQUFFLFlBQVksRUFBSTtBQUNyQyxjQUFLTCxLQUFMLENBQVdNLG9CQUFYLENBQWdDLE1BQUtOLEtBQUwsQ0FBV0UsS0FBM0MsRUFBa0RHLFlBQWxEO0FBQ0QsT0E5QjJEO0FBQUEsNkdBZ0N2QyxZQUFhO0FBQUE7O0FBQUEsMkNBQVRFLElBQVM7QUFBVEEsVUFB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aUJDLFVBRlY7QUFHakIxQixJQUFBQSxHQUFHLEVBQUV3QixzQkFBVUcsTUFBVixDQUFpQkQsVUFITDtBQUlqQmpELElBQUFBLGlCQUFpQixFQUFFK0Msc0JBQVVJLElBQVYsQ0FBZUYsVUFKakI7QUFLakI5QyxJQUFBQSxlQUFlLEVBQUU0QyxzQkFBVUksSUFBVixDQUFlRixVQUxmO0FBTWpCVCxJQUFBQSxTQUFTLEVBQUVPLHNCQUFVSSxJQUFWLENBQWVGLFVBTlQ7QUFPakIzQixJQUFBQSxXQUFXLEVBQUV5QixzQkFBVUksSUFBVixDQUFlRixVQVBYO0FBUWpCekIsSUFBQUEsY0FBYyxFQUFFdUIsc0JBQVVJLElBQVYsQ0FBZUYsVUFSZDtBQVNqQkcsSUFBQUEsYUFBYSxFQUFFTCxzQkFBVUksSUFUUjtBQVVqQnpCLElBQUFBLGdCQUFnQixFQUFFcUIsc0JBQVVNLE9BQVYsQ0FBa0JOLHNCQUFVTyxHQUE1QixDQVZEO0FBV2pCakQsSUFBQUEsb0JBQW9CLEVBQUUwQyxzQkFBVUksSUFBVixDQUFlRixVQVhwQjtBQVlqQnJDLElBQUFBLDhCQUE4QixFQUFFbUMsc0JBQVVJLElBQVYsQ0FBZUYsVUFaOUI7QUFhakIxQyxJQUFBQSxrQkFBa0IsRUFBRXdDLHNCQUFVSSxJQUFWLENBQWVGLFVBYmxCO0FBY2pCTSxJQUFBQSxxQkFBcUIsRUFBRVIsc0JBQVVJLElBZGhCO0FBZWpCSyxJQUFBQSx5QkFBeUIsRUFBRVQsc0JBQVVJO0FBZnBCLEdBRnlDO0FBdUg5RCxTQUFPdEQsVUFBUDtBQUNEOztlQUVjTixpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgTGF5ZXJDb25maWd1cmF0b3JGYWN0b3J5IGZyb20gJy4vbGF5ZXItY29uZmlndXJhdG9yJztcbmltcG9ydCBMYXllclBhbmVsSGVhZGVyRmFjdG9yeSBmcm9tICcuL2xheWVyLXBhbmVsLWhlYWRlcic7XG5cbmNvbnN0IFBhbmVsV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgYm9yZGVyLXJhZGl1czogMXB4O1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIHotaW5kZXg6IDEwMDA7XG5cbiAgJi5kcmFnZ2luZyB7XG4gICAgY3Vyc29yOiBtb3ZlO1xuICB9XG5gO1xuXG5MYXllclBhbmVsRmFjdG9yeS5kZXBzID0gW0xheWVyQ29uZmlndXJhdG9yRmFjdG9yeSwgTGF5ZXJQYW5lbEhlYWRlckZhY3RvcnldO1xuXG5mdW5jdGlvbiBMYXllclBhbmVsRmFjdG9yeShMYXllckNvbmZpZ3VyYXRvciwgTGF5ZXJQYW5lbEhlYWRlcikge1xuICBjbGFzcyBMYXllclBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBpZHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJUeXBlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb3Blbk1vZGFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgcmVtb3ZlTGF5ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBkdXBsaWNhdGVMYXllcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9uQ2xvc2VDb25maWc6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgbGF5ZXJUeXBlT3B0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSksXG4gICAgICBsYXllclZpc0NvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyQ29sb3JVSUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHNldExheWVyQW5pbWF0aW9uVGltZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICB1cGRhdGVMYXllckFuaW1hdGlvblNwZWVkOiBQcm9wVHlwZXMuZnVuY1xuICAgIH07XG5cbiAgICB1cGRhdGVMYXllckNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5sYXllckNvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdQcm9wKTtcbiAgICB9O1xuXG4gICAgdXBkYXRlTGF5ZXJUeXBlID0gbmV3VHlwZSA9PiB7XG4gICAgICB0aGlzLnByb3BzLmxheWVyVHlwZUNoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdUeXBlKTtcbiAgICB9O1xuXG4gICAgdXBkYXRlTGF5ZXJWaXNDb25maWcgPSBuZXdWaXNDb25maWcgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5sYXllclZpc0NvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdWaXNDb25maWcpO1xuICAgIH07XG5cbiAgICB1cGRhdGVMYXllckNvbG9yVUkgPSAoLi4uYXJncykgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5sYXllckNvbG9yVUlDaGFuZ2UodGhpcy5wcm9wcy5sYXllciwgLi4uYXJncyk7XG4gICAgfTtcblxuICAgIHVwZGF0ZUxheWVyVGV4dExhYmVsID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgIHRoaXMucHJvcHMubGF5ZXJUZXh0TGFiZWxDaGFuZ2UodGhpcy5wcm9wcy5sYXllciwgLi4uYXJncyk7XG4gICAgfTtcblxuICAgIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyA9IChuZXdDb25maWcsIGNoYW5uZWwsIHNjYWxlS2V5KSA9PiB7XG4gICAgICB0aGlzLnByb3BzLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSh0aGlzLnByb3BzLmxheWVyLCBuZXdDb25maWcsIGNoYW5uZWwsIHNjYWxlS2V5KTtcbiAgICB9O1xuXG4gICAgX3VwZGF0ZUxheWVyTGFiZWwgPSAoe3RhcmdldDoge3ZhbHVlfX0pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe2xhYmVsOiB2YWx1ZX0pO1xuICAgIH07XG5cbiAgICBfdG9nZ2xlVmlzaWJpbGl0eSA9IGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IGlzVmlzaWJsZSA9ICF0aGlzLnByb3BzLmxheWVyLmNvbmZpZy5pc1Zpc2libGU7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtpc1Zpc2libGV9KTtcbiAgICB9O1xuXG4gICAgX3RvZ2dsZUVuYWJsZUNvbmZpZyA9IGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbGF5ZXI6IHtcbiAgICAgICAgICBjb25maWc6IHtpc0NvbmZpZ0FjdGl2ZX1cbiAgICAgICAgfVxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtpc0NvbmZpZ0FjdGl2ZTogIWlzQ29uZmlnQWN0aXZlfSk7XG4gICAgfTtcblxuICAgIF9yZW1vdmVMYXllciA9IGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMucHJvcHMucmVtb3ZlTGF5ZXIodGhpcy5wcm9wcy5pZHgpO1xuICAgIH07XG5cbiAgICBfZHVwbGljYXRlTGF5ZXIgPSBlID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLnByb3BzLmR1cGxpY2F0ZUxheWVyKHRoaXMucHJvcHMuaWR4KTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2xheWVyLCBkYXRhc2V0cywgbGF5ZXJUeXBlT3B0aW9uc30gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge2NvbmZpZ30gPSBsYXllcjtcbiAgICAgIGNvbnN0IHtpc0NvbmZpZ0FjdGl2ZX0gPSBjb25maWc7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQYW5lbFdyYXBwZXJcbiAgICAgICAgICBhY3RpdmU9e2lzQ29uZmlnQWN0aXZlfVxuICAgICAgICAgIGNsYXNzTmFtZT17YGxheWVyLXBhbmVsICR7dGhpcy5wcm9wcy5jbGFzc05hbWV9YH1cbiAgICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX1cbiAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5wcm9wcy5vbk1vdXNlRG93bn1cbiAgICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMucHJvcHMub25Ub3VjaFN0YXJ0fVxuICAgICAgICA+XG4gICAgICAgICAgPExheWVyUGFuZWxIZWFkZXJcbiAgICAgICAgICAgIGlzQ29uZmlnQWN0aXZlPXtpc0NvbmZpZ0FjdGl2ZX1cbiAgICAgICAgICAgIGxheWVySWQ9e2xheWVyLmlkfVxuICAgICAgICAgICAgaXNWaXNpYmxlPXtjb25maWcuaXNWaXNpYmxlfVxuICAgICAgICAgICAgbGFiZWw9e2NvbmZpZy5sYWJlbH1cbiAgICAgICAgICAgIGxhYmVsUkNHQ29sb3JWYWx1ZXM9e2NvbmZpZy5kYXRhSWQgPyBkYXRhc2V0c1tjb25maWcuZGF0YUlkXS5jb2xvciA6IG51bGx9XG4gICAgICAgICAgICBsYXllclR5cGU9e2xheWVyLnR5cGV9XG4gICAgICAgICAgICBvblRvZ2dsZUVuYWJsZUNvbmZpZz17dGhpcy5fdG9nZ2xlRW5hYmxlQ29uZmlnfVxuICAgICAgICAgICAgb25Ub2dnbGVWaXNpYmlsaXR5PXt0aGlzLl90b2dnbGVWaXNpYmlsaXR5fVxuICAgICAgICAgICAgb25VcGRhdGVMYXllckxhYmVsPXt0aGlzLl91cGRhdGVMYXllckxhYmVsfVxuICAgICAgICAgICAgb25SZW1vdmVMYXllcj17dGhpcy5fcmVtb3ZlTGF5ZXJ9XG4gICAgICAgICAgICBvbkR1cGxpY2F0ZUxheWVyPXt0aGlzLl9kdXBsaWNhdGVMYXllcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtpc0NvbmZpZ0FjdGl2ZSAmJiAoXG4gICAgICAgICAgICA8TGF5ZXJDb25maWd1cmF0b3JcbiAgICAgICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgIGxheWVyVHlwZU9wdGlvbnM9e2xheWVyVHlwZU9wdGlvbnN9XG4gICAgICAgICAgICAgIG9wZW5Nb2RhbD17dGhpcy5wcm9wcy5vcGVuTW9kYWx9XG4gICAgICAgICAgICAgIHVwZGF0ZUxheWVyQ29sb3JVST17dGhpcy51cGRhdGVMYXllckNvbG9yVUl9XG4gICAgICAgICAgICAgIHVwZGF0ZUxheWVyQ29uZmlnPXt0aGlzLnVwZGF0ZUxheWVyQ29uZmlnfVxuICAgICAgICAgICAgICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWc9e3RoaXMudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnfVxuICAgICAgICAgICAgICB1cGRhdGVMYXllclR5cGU9e3RoaXMudXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgICAgICB1cGRhdGVMYXllclRleHRMYWJlbD17dGhpcy51cGRhdGVMYXllclRleHRMYWJlbH1cbiAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJWaXNDb25maWc9e3RoaXMudXBkYXRlTGF5ZXJWaXNDb25maWd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZWxXcmFwcGVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTGF5ZXJQYW5lbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGF5ZXJQYW5lbEZhY3Rvcnk7XG4iXX0=