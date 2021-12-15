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

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _mouseEvent = _interopRequireDefault(require("./mouse-event"));

var _templateObject, _templateObject2;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledSliderHandle = _styledComponents["default"].span.attrs({
  className: 'kg-range-slider__handle'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  z-index: 10;\n  ", ": -", "px;\n\n  height: ", "px;\n  width: ", "px;\n  box-shadow: ", ";\n  background-color: ", ";\n  color: ", ";\n\n  border-width: 1px;\n  border-radius: ", ";\n  border-style: solid;\n  border-color: ", ";\n\n  :hover {\n    background-color: ", ";\n    cursor: pointer;\n  }\n\n  line-height: 10px;\n  font-size: 6px;\n  padding: 0 3px;\n  letter-spacing: 1px;\n  :after {\n    content: '", "';\n  }\n"])), function (props) {
  return props.vertical ? 'margin-left' : 'margin-top';
}, function (props) {
  return (props.sliderHandleWidth - props.theme.sliderBarHeight) / 2;
}, function (props) {
  return Number.isFinite(props.sliderHandleWidth) ? props.sliderHandleWidth : props.theme.sliderHandleHeight;
}, function (props) {
  return Number.isFinite(props.sliderHandleWidth) ? props.sliderHandleWidth : props.theme.sliderHandleHeight;
}, function (props) {
  return props.theme.sliderHandleShadow;
}, function (props) {
  return props.theme.sliderHandleColor;
}, function (props) {
  return props.theme.sliderHandleTextColor;
}, function (props) {
  return props.theme.sliderBorderRadius;
}, function (props) {
  return props.active ? props.theme.selectBorderColor : props.theme.sliderInactiveBorderColor;
}, function (props) {
  return props.theme.sliderHandleHoverColor;
}, function (props) {
  return props.theme.sliderHandleAfterContent;
});

var StyledSliderTooltip = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  border-radius: 3px;\n  display: inline-block;\n  pointer-events: none;\n  transition: opacity 0.3s ease-out;\n  z-index: 999;\n  margin-left: ", "px;\n  font-size: 9.5px;\n  font-weight: 500;\n  padding: 7px 10px;\n  background-color: ", ";\n  color: ", ";\n  margin-bottom: -6px;\n  width: 50px;\n\n  :before,\n  :after {\n    content: '';\n    width: 0;\n    height: 0;\n    position: absolute;\n  }\n\n  :before {\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n    left: -8px;\n    top: 50%;\n  }\n\n  :after {\n    border-top: 5px solid transparent;\n    border-bottom: 5px solid transparent;\n    left: -6px;\n    top: 50%;\n    margin-top: -4px;\n    border-right-color: ", ";\n    border-right-style: solid;\n    border-right-width: 6px;\n  }\n"])), function (props) {
  return props.sliderHandleWidth + 12;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipColor;
}, function (props) {
  return props.theme.tooltipBg;
});

var SliderTooltip = function SliderTooltip(_ref) {
  var value = _ref.value,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? function (val) {
    return val;
  } : _ref$format,
      style = _ref.style,
      sliderHandleWidth = _ref.sliderHandleWidth;
  return /*#__PURE__*/_react["default"].createElement(StyledSliderTooltip, {
    sliderHandleWidth: sliderHandleWidth,
    style: style
  }, format(value));
};

var SliderHandle = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(SliderHandle, _Component);

  var _super = _createSuper(SliderHandle);

  function SliderHandle(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, SliderHandle);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      mouseOver: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ref", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "toggleMouseOver", function () {
      _this.setState({
        mouseOver: !_this.state.mouseOver
      });
    });
    _this.mouseEvent = new _mouseEvent["default"]({
      vertical: props.vertical,
      valueListener: props.valueListener,
      toggleMouseOver: _this.toggleMouseOver,
      track: props.track
    });
    return _this;
  }

  (0, _createClass2["default"])(SliderHandle, [{
    key: "render",
    value: function render() {
      var style = (0, _defineProperty2["default"])({}, this.props.vertical ? 'bottom' : 'left', this.props.left);
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: this.props.display ? 'block' : 'none'
        }
      }, this.props.showTooltip && this.state.mouseOver ? /*#__PURE__*/_react["default"].createElement(SliderTooltip, {
        style: style,
        sliderHandleWidth: this.props.sliderHandleWidth,
        value: Number.isFinite(this.props.value) ? this.props.value : null
      }) : null, /*#__PURE__*/_react["default"].createElement(StyledSliderHandle, {
        className: (0, _classnames["default"])({
          'kg-range-slider__handle--active': this.state.mouseOver
        }),
        ref: this.ref,
        sliderHandleWidth: this.props.sliderHandleWidth,
        active: this.state.mouseOver,
        vertical: this.props.vertical,
        style: style,
        onMouseDown: this.mouseEvent.handleMouseDown,
        onTouchStart: this.mouseEvent.handleTouchStart
      }));
    }
  }]);
  return SliderHandle;
}(_react.Component);

exports["default"] = SliderHandle;
(0, _defineProperty2["default"])(SliderHandle, "propTypes", {
  sliderHandleWidth: _propTypes["default"].number,
  left: _propTypes["default"].string,
  display: _propTypes["default"].bool,
  valueListener: _propTypes["default"].func,
  vertical: _propTypes["default"].bool
});
(0, _defineProperty2["default"])(SliderHandle, "defaultProps", {
  sliderHandleWidth: 12,
  left: '50%',
  display: true,
  vertical: false,
  valueListener: function valueListenerFn() {},
  showTooltip: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLWhhbmRsZS5qcyJdLCJuYW1lcyI6WyJTdHlsZWRTbGlkZXJIYW5kbGUiLCJzdHlsZWQiLCJzcGFuIiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsInZlcnRpY2FsIiwic2xpZGVySGFuZGxlV2lkdGgiLCJ0aGVtZSIsInNsaWRlckJhckhlaWdodCIsIk51bWJlciIsImlzRmluaXRlIiwic2xpZGVySGFuZGxlSGVpZ2h0Iiwic2xpZGVySGFuZGxlU2hhZG93Iiwic2xpZGVySGFuZGxlQ29sb3IiLCJzbGlkZXJIYW5kbGVUZXh0Q29sb3IiLCJzbGlkZXJCb3JkZXJSYWRpdXMiLCJhY3RpdmUiLCJzZWxlY3RCb3JkZXJDb2xvciIsInNsaWRlckluYWN0aXZlQm9yZGVyQ29sb3IiLCJzbGlkZXJIYW5kbGVIb3ZlckNvbG9yIiwic2xpZGVySGFuZGxlQWZ0ZXJDb250ZW50IiwiU3R5bGVkU2xpZGVyVG9vbHRpcCIsImRpdiIsInRvb2x0aXBCZyIsInRvb2x0aXBDb2xvciIsIlNsaWRlclRvb2x0aXAiLCJ2YWx1ZSIsImZvcm1hdCIsInZhbCIsInN0eWxlIiwiU2xpZGVySGFuZGxlIiwibW91c2VPdmVyIiwic2V0U3RhdGUiLCJzdGF0ZSIsIm1vdXNlRXZlbnQiLCJNb3VzZUV2ZW50SGFuZGxlciIsInZhbHVlTGlzdGVuZXIiLCJ0b2dnbGVNb3VzZU92ZXIiLCJ0cmFjayIsImxlZnQiLCJkaXNwbGF5Iiwic2hvd1Rvb2x0aXAiLCJyZWYiLCJoYW5kbGVNb3VzZURvd24iLCJoYW5kbGVUb3VjaFN0YXJ0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwibnVtYmVyIiwic3RyaW5nIiwiYm9vbCIsImZ1bmMiLCJ2YWx1ZUxpc3RlbmVyRm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7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LlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgY3JlYXRlUmVmfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBNb3VzZUV2ZW50SGFuZGxlciBmcm9tICcuL21vdXNlLWV2ZW50JztcblxuY29uc3QgU3R5bGVkU2xpZGVySGFuZGxlID0gc3R5bGVkLnNwYW4uYXR0cnMoe1xuICBjbGFzc05hbWU6ICdrZy1yYW5nZS1zbGlkZXJfX2hhbmRsZSdcbn0pYFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDEwO1xuICAke3Byb3BzID0+IChwcm9wcy52ZXJ0aWNhbCA/ICdtYXJnaW4tbGVmdCcgOiAnbWFyZ2luLXRvcCcpfTogLSR7cHJvcHMgPT5cbiAgKHByb3BzLnNsaWRlckhhbmRsZVdpZHRoIC0gcHJvcHMudGhlbWUuc2xpZGVyQmFySGVpZ2h0KSAvIDJ9cHg7XG5cbiAgaGVpZ2h0OiAke3Byb3BzID0+XG4gICAgTnVtYmVyLmlzRmluaXRlKHByb3BzLnNsaWRlckhhbmRsZVdpZHRoKVxuICAgICAgPyBwcm9wcy5zbGlkZXJIYW5kbGVXaWR0aFxuICAgICAgOiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVIZWlnaHR9cHg7XG4gIHdpZHRoOiAke3Byb3BzID0+XG4gICAgTnVtYmVyLmlzRmluaXRlKHByb3BzLnNsaWRlckhhbmRsZVdpZHRoKVxuICAgICAgPyBwcm9wcy5zbGlkZXJIYW5kbGVXaWR0aFxuICAgICAgOiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVIZWlnaHR9cHg7XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVySGFuZGxlU2hhZG93fTtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVDb2xvcn07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZVRleHRDb2xvcn07XG5cbiAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVyQm9yZGVyUmFkaXVzfTtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3IgOiBwcm9wcy50aGVtZS5zbGlkZXJJbmFjdGl2ZUJvcmRlckNvbG9yfTtcblxuICA6aG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVySGFuZGxlSG92ZXJDb2xvcn07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5cbiAgbGluZS1oZWlnaHQ6IDEwcHg7XG4gIGZvbnQtc2l6ZTogNnB4O1xuICBwYWRkaW5nOiAwIDNweDtcbiAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgOmFmdGVyIHtcbiAgICBjb250ZW50OiAnJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVBZnRlckNvbnRlbnR9JztcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkU2xpZGVyVG9vbHRpcCA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZS1vdXQ7XG4gIHotaW5kZXg6IDk5OTtcbiAgbWFyZ2luLWxlZnQ6ICR7cHJvcHMgPT4gcHJvcHMuc2xpZGVySGFuZGxlV2lkdGggKyAxMn1weDtcbiAgZm9udC1zaXplOiA5LjVweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgcGFkZGluZzogN3B4IDEwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcENvbG9yfTtcbiAgbWFyZ2luLWJvdHRvbTogLTZweDtcbiAgd2lkdGg6IDUwcHg7XG5cbiAgOmJlZm9yZSxcbiAgOmFmdGVyIHtcbiAgICBjb250ZW50OiAnJztcbiAgICB3aWR0aDogMDtcbiAgICBoZWlnaHQ6IDA7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICB9XG5cbiAgOmJlZm9yZSB7XG4gICAgYm9yZGVyLXRvcDogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgIGJvcmRlci1ib3R0b206IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgICBsZWZ0OiAtOHB4O1xuICAgIHRvcDogNTAlO1xuICB9XG5cbiAgOmFmdGVyIHtcbiAgICBib3JkZXItdG9wOiA1cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLWJvdHRvbTogNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgIGxlZnQ6IC02cHg7XG4gICAgdG9wOiA1MCU7XG4gICAgbWFyZ2luLXRvcDogLTRweDtcbiAgICBib3JkZXItcmlnaHQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICBib3JkZXItcmlnaHQtc3R5bGU6IHNvbGlkO1xuICAgIGJvcmRlci1yaWdodC13aWR0aDogNnB4O1xuICB9XG5gO1xuXG5jb25zdCBTbGlkZXJUb29sdGlwID0gKHt2YWx1ZSwgZm9ybWF0ID0gdmFsID0+IHZhbCwgc3R5bGUsIHNsaWRlckhhbmRsZVdpZHRofSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxTdHlsZWRTbGlkZXJUb29sdGlwIHNsaWRlckhhbmRsZVdpZHRoPXtzbGlkZXJIYW5kbGVXaWR0aH0gc3R5bGU9e3N0eWxlfT5cbiAgICAgIHtmb3JtYXQodmFsdWUpfVxuICAgIDwvU3R5bGVkU2xpZGVyVG9vbHRpcD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNsaWRlckhhbmRsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2xpZGVySGFuZGxlV2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgbGVmdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkaXNwbGF5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICB2YWx1ZUxpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB2ZXJ0aWNhbDogUHJvcFR5cGVzLmJvb2xcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNsaWRlckhhbmRsZVdpZHRoOiAxMixcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICBkaXNwbGF5OiB0cnVlLFxuICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICB2YWx1ZUxpc3RlbmVyOiBmdW5jdGlvbiB2YWx1ZUxpc3RlbmVyRm4oKSB7fSxcbiAgICBzaG93VG9vbHRpcDogZmFsc2VcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMubW91c2VFdmVudCA9IG5ldyBNb3VzZUV2ZW50SGFuZGxlcih7XG4gICAgICB2ZXJ0aWNhbDogcHJvcHMudmVydGljYWwsXG4gICAgICB2YWx1ZUxpc3RlbmVyOiBwcm9wcy52YWx1ZUxpc3RlbmVyLFxuICAgICAgdG9nZ2xlTW91c2VPdmVyOiB0aGlzLnRvZ2dsZU1vdXNlT3ZlcixcbiAgICAgIHRyYWNrOiBwcm9wcy50cmFja1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGUgPSB7bW91c2VPdmVyOiBmYWxzZX07XG4gIHJlZiA9IGNyZWF0ZVJlZigpO1xuXG4gIHRvZ2dsZU1vdXNlT3ZlciA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHttb3VzZU92ZXI6ICF0aGlzLnN0YXRlLm1vdXNlT3Zlcn0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzdHlsZSA9IHtbdGhpcy5wcm9wcy52ZXJ0aWNhbCA/ICdib3R0b20nIDogJ2xlZnQnXTogdGhpcy5wcm9wcy5sZWZ0fTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogdGhpcy5wcm9wcy5kaXNwbGF5ID8gJ2Jsb2NrJyA6ICdub25lJ319PlxuICAgICAgICB7dGhpcy5wcm9wcy5zaG93VG9vbHRpcCAmJiB0aGlzLnN0YXRlLm1vdXNlT3ZlciA/IChcbiAgICAgICAgICA8U2xpZGVyVG9vbHRpcFxuICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgc2xpZGVySGFuZGxlV2lkdGg9e3RoaXMucHJvcHMuc2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgICB2YWx1ZT17TnVtYmVyLmlzRmluaXRlKHRoaXMucHJvcHMudmFsdWUpID8gdGhpcy5wcm9wcy52YWx1ZSA6IG51bGx9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxTdHlsZWRTbGlkZXJIYW5kbGVcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe1xuICAgICAgICAgICAgJ2tnLXJhbmdlLXNsaWRlcl9faGFuZGxlLS1hY3RpdmUnOiB0aGlzLnN0YXRlLm1vdXNlT3ZlclxuICAgICAgICAgIH0pfVxuICAgICAgICAgIHJlZj17dGhpcy5yZWZ9XG4gICAgICAgICAgc2xpZGVySGFuZGxlV2lkdGg9e3RoaXMucHJvcHMuc2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgYWN0aXZlPXt0aGlzLnN0YXRlLm1vdXNlT3Zlcn1cbiAgICAgICAgICB2ZXJ0aWNhbD17dGhpcy5wcm9wcy52ZXJ0aWNhbH1cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMubW91c2VFdmVudC5oYW5kbGVNb3VzZURvd259XG4gICAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLm1vdXNlRXZlbnQuaGFuZGxlVG91Y2hTdGFydH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==