"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactIntl = require("react-intl");

var _styledComponents = require("../../common/styled-components");

var _infoHelper = _interopRequireDefault(require("../../common/info-helper"));

var _dimensionScaleSelector = _interopRequireDefault(require("./dimension-scale-selector"));

var _utils = require("../../../utils/utils");

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

VisConfigByFieldSelectorFactory.deps = [_infoHelper["default"], _fieldSelector["default"]];

function VisConfigByFieldSelectorFactory(InfoHelper, FieldSelector) {
  var VisConfigByFieldSelector = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(VisConfigByFieldSelector, _Component);

    var _super = _createSuper(VisConfigByFieldSelector);

    function VisConfigByFieldSelector() {
      var _this;

      (0, _classCallCheck2["default"])(this, VisConfigByFieldSelector);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateVisByField", function (val) {
        _this.props.updateField(val);
      });
      return _this;
    }

    (0, _createClass2["default"])(VisConfigByFieldSelector, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            property = _this$props.property,
            showScale = _this$props.showScale,
            selectedField = _this$props.selectedField,
            description = _this$props.description,
            label = _this$props.label,
            intl = _this$props.intl,
            _this$props$scaleOpti = _this$props.scaleOptions,
            scaleOptions = _this$props$scaleOpti === void 0 ? [] : _this$props$scaleOpti;
        return /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabelWrapper, null, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabel, null, label && /*#__PURE__*/_react["default"].createElement(_reactIntl.FormattedMessage, {
          id: label
        }) || /*#__PURE__*/_react["default"].createElement(_reactIntl.FormattedMessage, {
          id: "layer.propertyBasedOn",
          values: {
            property: intl.formatMessage({
              id: "property.".concat((0, _utils.camelize)(property)),
              defaultMessage: property
            })
          }
        })), description && /*#__PURE__*/_react["default"].createElement(InfoHelper, {
          description: description,
          property: property,
          id: "".concat(this.props.id, "-").concat(property)
        })), /*#__PURE__*/_react["default"].createElement(FieldSelector, {
          fields: this.props.fields,
          value: selectedField && selectedField.name,
          placeholder: this.props.placeholder,
          onSelect: this._updateVisByField,
          erasable: true
        })), /*#__PURE__*/_react["default"].createElement("div", null, showScale ? /*#__PURE__*/_react["default"].createElement(_dimensionScaleSelector["default"], {
          scaleType: this.props.scaleType,
          options: scaleOptions,
          label: "".concat(property, " scale"),
          onSelect: this.props.updateScale,
          disabled: scaleOptions.length < 2
        }) : null));
      }
    }]);
    return VisConfigByFieldSelector;
  }(_react.Component);

  (0, _defineProperty2["default"])(VisConfigByFieldSelector, "propTypes", {
    channel: _propTypes["default"].string.isRequired,
    fields: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    id: _propTypes["default"].string.isRequired,
    property: _propTypes["default"].string.isRequired,
    showScale: _propTypes["default"].bool.isRequired,
    updateField: _propTypes["default"].func.isRequired,
    updateScale: _propTypes["default"].func.isRequired,
    // optional
    scaleType: _propTypes["default"].string,
    selectedField: _propTypes["default"].object,
    description: _propTypes["default"].string,
    label: _propTypes["default"].string,
    placeholder: _propTypes["default"].string
  });
  return (0, _reactIntl.injectIntl)(VisConfigByFieldSelector);
}

var _default = VisConfigByFieldSelectorFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJWaXNDb25maWdCeUZpZWxkU2VsZWN0b3JGYWN0b3J5IiwiZGVwcyIsIkluZm9IZWxwZXJGYWNvdHJ5IiwiRmllbGRTZWxlY3RvckZhY3RvcnkiLCJJbmZvSGVscGVyIiwiRmllbGRTZWxlY3RvciIsIlZpc0NvbmZpZ0J5RmllbGRTZWxlY3RvciIsInZhbCIsInByb3BzIiwidXBkYXRlRmllbGQiLCJwcm9wZXJ0eSIsInNob3dTY2FsZSIsInNlbGVjdGVkRmllbGQiLCJkZXNjcmlwdGlvbiIsImxhYmVsIiwiaW50bCIsInNjYWxlT3B0aW9ucyIsImZvcm1hdE1lc3NhZ2UiLCJpZCIsImRlZmF1bHRNZXNzYWdlIiwiZmllbGRzIiwibmFtZSIsInBsYWNlaG9sZGVyIiwiX3VwZGF0ZVZpc0J5RmllbGQiLCJzY2FsZVR5cGUiLCJ1cGRhdGVTY2FsZSIsImxlbmd0aCIsIkNvbXBvbmVudCIsImNoYW5uZWwiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsImFueSIsImJvb2wiLCJmdW5jIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQUEsK0JBQStCLENBQUNDLElBQWhDLEdBQXVDLENBQUNDLHNCQUFELEVBQW9CQyx5QkFBcEIsQ0FBdkM7O0FBQ0EsU0FBU0gsK0JBQVQsQ0FBeUNJLFVBQXpDLEVBQXFEQyxhQUFyRCxFQUFvRTtBQUFBLE1BQzVEQyx3QkFENEQ7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLDRHQW1CNUMsVUFBQUMsR0FBRyxFQUFJO0FBQ3pCLGNBQUtD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LFdBQVcsRUFBRWdCLHNCQUFVQyxNQVpOO0FBYWpCaEIsSUFBQUEsS0FBSyxFQUFFZSxzQkFBVUMsTUFiQTtBQWNqQlIsSUFBQUEsV0FBVyxFQUFFTyxzQkFBVUM7QUFkTixHQUY2QztBQWtGbEUsU0FBTywyQkFBV3hCLHdCQUFYLENBQVA7QUFDRDs7ZUFFY04sK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2UsIGluamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5pbXBvcnQge1BhbmVsTGFiZWwsIFBhbmVsTGFiZWxXcmFwcGVyLCBTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgSW5mb0hlbHBlckZhY290cnkgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaW5mby1oZWxwZXInO1xuaW1wb3J0IERpbWVuc2lvblNjYWxlU2VsZWN0b3IgZnJvbSAnLi9kaW1lbnNpb24tc2NhbGUtc2VsZWN0b3InO1xuaW1wb3J0IHtjYW1lbGl6ZX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IEZpZWxkU2VsZWN0b3JGYWN0b3J5IGZyb20gJy4uLy4uL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5cblZpc0NvbmZpZ0J5RmllbGRTZWxlY3RvckZhY3RvcnkuZGVwcyA9IFtJbmZvSGVscGVyRmFjb3RyeSwgRmllbGRTZWxlY3RvckZhY3RvcnldO1xuZnVuY3Rpb24gVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yRmFjdG9yeShJbmZvSGVscGVyLCBGaWVsZFNlbGVjdG9yKSB7XG4gIGNsYXNzIFZpc0NvbmZpZ0J5RmllbGRTZWxlY3RvciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGNoYW5uZWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGZpZWxkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBwcm9wZXJ0eTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgc2hvd1NjYWxlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgdXBkYXRlRmllbGQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB1cGRhdGVTY2FsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgICAgLy8gb3B0aW9uYWxcbiAgICAgIHNjYWxlVHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHNlbGVjdGVkRmllbGQ6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9O1xuXG4gICAgX3VwZGF0ZVZpc0J5RmllbGQgPSB2YWwgPT4ge1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGVGaWVsZCh2YWwpO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHByb3BlcnR5LFxuICAgICAgICBzaG93U2NhbGUsXG4gICAgICAgIHNlbGVjdGVkRmllbGQsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBsYWJlbCxcbiAgICAgICAgaW50bCxcbiAgICAgICAgc2NhbGVPcHRpb25zID0gW11cbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICAgIDxQYW5lbExhYmVsV3JhcHBlcj5cbiAgICAgICAgICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgICAgICAgICAgeyhsYWJlbCAmJiA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17bGFiZWx9IC8+KSB8fCAoXG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICBpZD1cImxheWVyLnByb3BlcnR5QmFzZWRPblwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcz17e1xuICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBpbnRsLmZvcm1hdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGBwcm9wZXJ0eS4ke2NhbWVsaXplKHByb3BlcnR5KX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdE1lc3NhZ2U6IHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9QYW5lbExhYmVsPlxuICAgICAgICAgICAgICB7ZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICAgICAgICAgIDxJbmZvSGVscGVyXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgICAgICBpZD17YCR7dGhpcy5wcm9wcy5pZH0tJHtwcm9wZXJ0eX1gfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1BhbmVsTGFiZWxXcmFwcGVyPlxuICAgICAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICAgICAgZmllbGRzPXt0aGlzLnByb3BzLmZpZWxkc31cbiAgICAgICAgICAgICAgdmFsdWU9e3NlbGVjdGVkRmllbGQgJiYgc2VsZWN0ZWRGaWVsZC5uYW1lfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMuX3VwZGF0ZVZpc0J5RmllbGR9XG4gICAgICAgICAgICAgIGVyYXNhYmxlXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3Nob3dTY2FsZSA/IChcbiAgICAgICAgICAgICAgPERpbWVuc2lvblNjYWxlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBzY2FsZVR5cGU9e3RoaXMucHJvcHMuc2NhbGVUeXBlfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e3NjYWxlT3B0aW9uc31cbiAgICAgICAgICAgICAgICBsYWJlbD17YCR7cHJvcGVydHl9IHNjYWxlYH1cbiAgICAgICAgICAgICAgICBvblNlbGVjdD17dGhpcy5wcm9wcy51cGRhdGVTY2FsZX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17c2NhbGVPcHRpb25zLmxlbmd0aCA8IDJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluamVjdEludGwoVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yRmFjdG9yeTtcbiJdfQ==