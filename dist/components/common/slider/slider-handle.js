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

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _mouseEvent = _interopRequireDefault(require("./mouse-event"));

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  border-radius: 3px;\n  display: inline-block;\n  pointer-events: none;\n  transition: opacity 0.3s ease-out;\n  z-index: 999;\n  margin-left: ", "px;\n  font-size: 9.5px;\n  font-weight: 500;\n  padding: 7px 10px;\n  background-color: ", ";\n  color: ", ";\n  margin-bottom: -6px;\n  width: 50px;\n\n  :before,\n  :after {\n    content: '';\n    width: 0;\n    height: 0;\n    position: absolute;\n  }\n\n  :before {\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n    left: -8px;\n    top: 50%;\n  }\n\n  :after {\n    border-top: 5px solid transparent;\n    border-bottom: 5px solid transparent;\n    left: -6px;\n    top: 50%;\n    margin-top: -4px;\n    border-right-color: ", ";\n    border-right-style: solid;\n    border-right-width: 6px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  z-index: 10;\n  margin-", ": -", "px;\n  height: ", "px;\n  width: ", "px;\n  box-shadow: ", ";\n  background-color: ", ";\n  border-width: 1px;\n  border-style: solid;\n  border-color: ", ";\n\n  :hover {\n    background-color: ", ";\n    cursor: pointer;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledSliderHandle = _styledComponents["default"].span(_templateObject(), function (props) {
  return props.vertical ? 'left' : 'top';
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
  return props.active ? props.theme.selectBorderColor : props.theme.sliderHandleColor;
}, function (props) {
  return props.theme.sliderHandleHoverColor;
});

var StyledSliderTooltip = _styledComponents["default"].div(_templateObject2(), function (props) {
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
  return _react["default"].createElement(StyledSliderTooltip, {
    sliderHandleWidth: sliderHandleWidth,
    style: style
  }, format(value));
};

var SliderHandle =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(SliderHandle, _Component);

  function SliderHandle(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, SliderHandle);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SliderHandle).call(this, props));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      mouseOver: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "toggleMouseOver", function () {
      _this.setState({
        mouseOver: !_this.state.mouseOver
      });
    });
    _this.mouseEvent = new _mouseEvent["default"]({
      vertical: props.vertical,
      valueListener: props.valueListener,
      toggleMouseOver: _this.toggleMouseOver
    });
    return _this;
  }

  (0, _createClass2["default"])(SliderHandle, [{
    key: "render",
    value: function render() {
      var style = (0, _defineProperty2["default"])({}, this.props.vertical ? 'bottom' : 'left', this.props.left);
      return _react["default"].createElement("div", {
        style: {
          display: this.props.display ? 'block' : 'none'
        }
      }, this.props.showTooltip && this.state.mouseOver ? _react["default"].createElement(SliderTooltip, {
        style: style,
        sliderHandleWidth: this.props.sliderHandleWidth,
        value: Number.isFinite(this.props.value) ? this.props.value : null
      }) : null, _react["default"].createElement(StyledSliderHandle, {
        className: (0, _classnames["default"])('kg-range-slider__handle', {
          'kg-range-slider__handle--active': this.state.mouseOver
        }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLWhhbmRsZS5qcyJdLCJuYW1lcyI6WyJTdHlsZWRTbGlkZXJIYW5kbGUiLCJzdHlsZWQiLCJzcGFuIiwicHJvcHMiLCJ2ZXJ0aWNhbCIsInNsaWRlckhhbmRsZVdpZHRoIiwidGhlbWUiLCJzbGlkZXJCYXJIZWlnaHQiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInNsaWRlckhhbmRsZUhlaWdodCIsInNsaWRlckhhbmRsZVNoYWRvdyIsInNsaWRlckhhbmRsZUNvbG9yIiwiYWN0aXZlIiwic2VsZWN0Qm9yZGVyQ29sb3IiLCJzbGlkZXJIYW5kbGVIb3ZlckNvbG9yIiwiU3R5bGVkU2xpZGVyVG9vbHRpcCIsImRpdiIsInRvb2x0aXBCZyIsInRvb2x0aXBDb2xvciIsIlNsaWRlclRvb2x0aXAiLCJ2YWx1ZSIsImZvcm1hdCIsInZhbCIsInN0eWxlIiwiU2xpZGVySGFuZGxlIiwibW91c2VPdmVyIiwic2V0U3RhdGUiLCJzdGF0ZSIsIm1vdXNlRXZlbnQiLCJNb3VzZUV2ZW50SGFuZGxlciIsInZhbHVlTGlzdGVuZXIiLCJ0b2dnbGVNb3VzZU92ZXIiLCJsZWZ0IiwiZGlzcGxheSIsInNob3dUb29sdGlwIiwiaGFuZGxlTW91c2VEb3duIiwiaGFuZGxlVG91Y2hTdGFydCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIm51bWJlciIsInN0cmluZyIsImJvb2wiLCJmdW5jIiwidmFsdWVMaXN0ZW5lckZuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBR0MsNkJBQU9DLElBQVYsb0JBR2IsVUFBQUMsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0MsUUFBTixHQUFpQixNQUFqQixHQUEwQixLQUEvQjtBQUFBLENBSFEsRUFHbUMs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QUFBLElBQUksRUFBRU0sc0JBQVVFLE1BRkM7QUFHakJQLEVBQUFBLE9BQU8sRUFBRUssc0JBQVVHLElBSEY7QUFJakJYLEVBQUFBLGFBQWEsRUFBRVEsc0JBQVVJLElBSlI7QUFLakJ2QyxFQUFBQSxRQUFRLEVBQUVtQyxzQkFBVUc7QUFMSCxDO2lDQURBakIsWSxrQkFTRztBQUNwQnBCLEVBQUFBLGlCQUFpQixFQUFFLEVBREM7QUFFcEI0QixFQUFBQSxJQUFJLEVBQUUsS0FGYztBQUdwQkMsRUFBQUEsT0FBTyxFQUFFLElBSFc7QUFJcEI5QixFQUFBQSxRQUFRLEVBQUUsS0FKVTtBQUtwQjJCLEVBQUFBLGFBQWEsRUFBRSxTQUFTYSxlQUFULEdBQTJCLENBQUUsQ0FMeEI7QUFNcEJULEVBQUFBLFdBQVcsRUFBRTtBQU5PLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IE1vdXNlRXZlbnRIYW5kbGVyIGZyb20gJy4vbW91c2UtZXZlbnQnO1xuXG5jb25zdCBTdHlsZWRTbGlkZXJIYW5kbGUgPSBzdHlsZWQuc3BhbmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxMDtcbiAgbWFyZ2luLSR7cHJvcHMgPT4gKHByb3BzLnZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcpfTogLSR7cHJvcHMgPT5cbiAgKHByb3BzLnNsaWRlckhhbmRsZVdpZHRoIC0gcHJvcHMudGhlbWUuc2xpZGVyQmFySGVpZ2h0KSAvIDJ9cHg7XG4gIGhlaWdodDogJHtwcm9wcyA9PlxuICAgIE51bWJlci5pc0Zpbml0ZShwcm9wcy5zbGlkZXJIYW5kbGVXaWR0aClcbiAgICAgID8gcHJvcHMuc2xpZGVySGFuZGxlV2lkdGhcbiAgICAgIDogcHJvcHMudGhlbWUuc2xpZGVySGFuZGxlSGVpZ2h0fXB4O1xuICB3aWR0aDogJHtwcm9wcyA9PlxuICAgIE51bWJlci5pc0Zpbml0ZShwcm9wcy5zbGlkZXJIYW5kbGVXaWR0aClcbiAgICAgID8gcHJvcHMuc2xpZGVySGFuZGxlV2lkdGhcbiAgICAgIDogcHJvcHMudGhlbWUuc2xpZGVySGFuZGxlSGVpZ2h0fXB4O1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZVNoYWRvd307XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVySGFuZGxlQ29sb3J9O1xuICBib3JkZXItd2lkdGg6IDFweDtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3IgOiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVDb2xvcn07XG5cbiAgOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZUhvdmVyQ29sb3J9O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkU2xpZGVyVG9vbHRpcCA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZS1vdXQ7XG4gIHotaW5kZXg6IDk5OTtcbiAgbWFyZ2luLWxlZnQ6ICR7cHJvcHMgPT4gcHJvcHMuc2xpZGVySGFuZGxlV2lkdGggKyAxMn1weDtcbiAgZm9udC1zaXplOiA5LjVweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgcGFkZGluZzogN3B4IDEwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcENvbG9yfTtcbiAgbWFyZ2luLWJvdHRvbTogLTZweDtcbiAgd2lkdGg6IDUwcHg7XG5cbiAgOmJlZm9yZSxcbiAgOmFmdGVyIHtcbiAgICBjb250ZW50OiAnJztcbiAgICB3aWR0aDogMDtcbiAgICBoZWlnaHQ6IDA7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICB9XG5cbiAgOmJlZm9yZSB7XG4gICAgYm9yZGVyLXRvcDogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgIGJvcmRlci1ib3R0b206IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgICBsZWZ0OiAtOHB4O1xuICAgIHRvcDogNTAlO1xuICB9XG5cbiAgOmFmdGVyIHtcbiAgICBib3JkZXItdG9wOiA1cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLWJvdHRvbTogNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgIGxlZnQ6IC02cHg7XG4gICAgdG9wOiA1MCU7XG4gICAgbWFyZ2luLXRvcDogLTRweDtcbiAgICBib3JkZXItcmlnaHQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICBib3JkZXItcmlnaHQtc3R5bGU6IHNvbGlkO1xuICAgIGJvcmRlci1yaWdodC13aWR0aDogNnB4O1xuICB9XG5gO1xuXG5jb25zdCBTbGlkZXJUb29sdGlwID0gKHt2YWx1ZSwgZm9ybWF0ID0gdmFsID0+IHZhbCwgc3R5bGUsIHNsaWRlckhhbmRsZVdpZHRofSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxTdHlsZWRTbGlkZXJUb29sdGlwIHNsaWRlckhhbmRsZVdpZHRoPXtzbGlkZXJIYW5kbGVXaWR0aH0gc3R5bGU9e3N0eWxlfT5cbiAgICAgIHtmb3JtYXQodmFsdWUpfVxuICAgIDwvU3R5bGVkU2xpZGVyVG9vbHRpcD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNsaWRlckhhbmRsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2xpZGVySGFuZGxlV2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgbGVmdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkaXNwbGF5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICB2YWx1ZUxpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB2ZXJ0aWNhbDogUHJvcFR5cGVzLmJvb2xcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNsaWRlckhhbmRsZVdpZHRoOiAxMixcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICBkaXNwbGF5OiB0cnVlLFxuICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICB2YWx1ZUxpc3RlbmVyOiBmdW5jdGlvbiB2YWx1ZUxpc3RlbmVyRm4oKSB7fSxcbiAgICBzaG93VG9vbHRpcDogZmFsc2VcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMubW91c2VFdmVudCA9IG5ldyBNb3VzZUV2ZW50SGFuZGxlcih7XG4gICAgICB2ZXJ0aWNhbDogcHJvcHMudmVydGljYWwsXG4gICAgICB2YWx1ZUxpc3RlbmVyOiBwcm9wcy52YWx1ZUxpc3RlbmVyLFxuICAgICAgdG9nZ2xlTW91c2VPdmVyOiB0aGlzLnRvZ2dsZU1vdXNlT3ZlclxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGUgPSB7bW91c2VPdmVyOiBmYWxzZX07XG5cbiAgdG9nZ2xlTW91c2VPdmVyID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlT3ZlcjogIXRoaXMuc3RhdGUubW91c2VPdmVyfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0ge1t0aGlzLnByb3BzLnZlcnRpY2FsID8gJ2JvdHRvbScgOiAnbGVmdCddOiB0aGlzLnByb3BzLmxlZnR9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiB0aGlzLnByb3BzLmRpc3BsYXkgPyAnYmxvY2snIDogJ25vbmUnfX0+XG4gICAgICAgIHt0aGlzLnByb3BzLnNob3dUb29sdGlwICYmIHRoaXMuc3RhdGUubW91c2VPdmVyID8gKFxuICAgICAgICAgIDxTbGlkZXJUb29sdGlwXG4gICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICBzbGlkZXJIYW5kbGVXaWR0aD17dGhpcy5wcm9wcy5zbGlkZXJIYW5kbGVXaWR0aH1cbiAgICAgICAgICAgIHZhbHVlPXtOdW1iZXIuaXNGaW5pdGUodGhpcy5wcm9wcy52YWx1ZSkgPyB0aGlzLnByb3BzLnZhbHVlIDogbnVsbH1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPFN0eWxlZFNsaWRlckhhbmRsZVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygna2ctcmFuZ2Utc2xpZGVyX19oYW5kbGUnLCB7XG4gICAgICAgICAgICAna2ctcmFuZ2Utc2xpZGVyX19oYW5kbGUtLWFjdGl2ZSc6IHRoaXMuc3RhdGUubW91c2VPdmVyXG4gICAgICAgICAgfSl9XG4gICAgICAgICAgc2xpZGVySGFuZGxlV2lkdGg9e3RoaXMucHJvcHMuc2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgYWN0aXZlPXt0aGlzLnN0YXRlLm1vdXNlT3Zlcn1cbiAgICAgICAgICB2ZXJ0aWNhbD17dGhpcy5wcm9wcy52ZXJ0aWNhbH1cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMubW91c2VFdmVudC5oYW5kbGVNb3VzZURvd259XG4gICAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLm1vdXNlRXZlbnQuaGFuZGxlVG91Y2hTdGFydH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==