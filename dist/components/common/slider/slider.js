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

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _sliderHandle = _interopRequireDefault(require("./slider-handle"));

var _sliderBarHandle = _interopRequireDefault(require("./slider-bar-handle"));

var _dataUtils = require("../../../utils/data-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  flex-grow: 1;\n  margin-top: ", "px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  margin-bottom: 12px;\n  background-color: ", ";\n  ", ";\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function noop() {}

var StyledRangeSlider = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.sliderBarBgd;
}, function (props) {
  return "".concat(props.vertical ? 'width' : 'height', ": ").concat(props.theme.sliderBarHeight, "px");
}, function (props) {
  return "".concat(props.vertical ? 'height' : 'width', ": 100%");
});

var SliderWrapper = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.isRanged ? props.theme.sliderMarginTopIsRange : props.theme.sliderMarginTop;
});

var Slider =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Slider, _Component);

  function Slider() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, Slider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(Slider)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ref", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_isVal0InRange", function (val) {
      var _this$props = _this.props,
          value1 = _this$props.value1,
          minValue = _this$props.minValue;
      return Boolean(val >= minValue && val <= value1);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_isVal1InRange", function (val) {
      var _this$props2 = _this.props,
          maxValue = _this$props2.maxValue,
          value0 = _this$props2.value0;
      return Boolean(val <= maxValue && val >= value0);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "slide0Listener", function (x) {
      var val = _this._getValue(_this.props.value0, x);

      if (_this._isVal0InRange(val)) {
        _this.props.onSlider0Change(val);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "slide1Listener", function (x) {
      var val = _this._getValue(_this.props.value1, x);

      if (_this._isVal1InRange(val)) {
        _this.props.onSlider1Change(val);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sliderBarListener", function (x) {
      var val0 = _this._getValue(_this.props.value0, x);

      var val1 = _this._getValue(_this.props.value1, x);

      if (_this._isVal1InRange(val1) && _this._isVal0InRange(val0)) {
        _this.props.onSliderBarChange(val0, val1);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "calcHandleLeft0", function (w, l, num) {
      return w === 0 ? "calc(".concat(l, "% - ").concat(_this.props.sliderHandleWidth / 2, "px)") : "calc(".concat(l, "% - ").concat(_this.props.sliderHandleWidth / 2, "px)");
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "calcHandleLeft1", function (w, l) {
      return _this.props.isRanged && w === 0 ? "".concat(l, "%") : "calc(".concat(l + w, "% - ").concat(_this.props.sliderHandleWidth / 2, "px)");
    });
    return _this;
  }

  (0, _createClass2["default"])(Slider, [{
    key: "_getBaseDistance",
    value: function _getBaseDistance() {
      return this.props.vertical ? this.ref.current.offsetHeight : this.ref.current.offsetWidth;
    }
  }, {
    key: "_getValDelta",
    value: function _getValDelta(x) {
      var percent = x / this._getBaseDistance();

      var maxDelta = this.props.maxValue - this.props.minValue;
      return percent * maxDelta;
    }
  }, {
    key: "_getValue",
    value: function _getValue(val, offset) {
      var delta = this._getValDelta(offset);

      var rawValue = this.props.vertical ? val - delta : val + delta;
      return this._roundValToStep(rawValue);
    }
  }, {
    key: "_roundValToStep",
    value: function _roundValToStep(val) {
      var _this$props3 = this.props,
          minValue = _this$props3.minValue,
          step = _this$props3.step;
      return (0, _dataUtils.roundValToStep)(minValue, step, val);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          classSet = _this$props4.classSet,
          disabled = _this$props4.disabled,
          isRanged = _this$props4.isRanged,
          maxValue = _this$props4.maxValue,
          minValue = _this$props4.minValue,
          value1 = _this$props4.value1,
          vertical = _this$props4.vertical,
          sliderHandleWidth = _this$props4.sliderHandleWidth,
          showTooltip = _this$props4.showTooltip;
      var value0 = !isRanged && minValue > 0 ? minValue : this.props.value0;
      var currValDelta = value1 - value0;
      var maxDelta = maxValue - minValue;
      var width = currValDelta / maxDelta * 100;
      var v0Left = (value0 - minValue) / maxDelta * 100;
      return _react["default"].createElement(SliderWrapper, {
        className: (0, _classnames["default"])('kg-slider', _objectSpread({}, classSet, {
          disabled: disabled
        })),
        ref: this.ref,
        isRanged: isRanged,
        vertical: vertical
      }, _react["default"].createElement(StyledRangeSlider, {
        className: "kg-range-slider",
        vertical: vertical
      }, _react["default"].createElement(_sliderHandle["default"], {
        className: "kg-range-slider__handle",
        left: this.calcHandleLeft0(width, v0Left),
        valueListener: this.slide0Listener,
        sliderHandleWidth: sliderHandleWidth,
        display: isRanged,
        vertical: vertical,
        showTooltip: showTooltip
      }), _react["default"].createElement(_sliderHandle["default"], {
        className: "kg-range-slider__handle",
        left: this.calcHandleLeft1(width, v0Left),
        valueListener: this.slide1Listener,
        sliderHandleWidth: sliderHandleWidth,
        vertical: vertical,
        value: value1,
        showTooltip: showTooltip
      }), _react["default"].createElement(_sliderBarHandle["default"], {
        width: width,
        v0Left: v0Left,
        enableBarDrag: this.props.enableBarDrag,
        sliderBarListener: this.sliderBarListener,
        vertical: vertical
      })));
    }
  }]);
  return Slider;
}(_react.Component);

exports["default"] = Slider;
(0, _defineProperty2["default"])(Slider, "propTypes", {
  title: _propTypes["default"].string,
  isRanged: _propTypes["default"].bool,
  value0: _propTypes["default"].number,
  value1: _propTypes["default"].number,
  minValue: _propTypes["default"].number,
  maxValue: _propTypes["default"].number,
  sliderHandleWidth: _propTypes["default"].number,
  onSlider0Change: _propTypes["default"].func,
  onInput0Change: _propTypes["default"].func,
  onSlider1Change: _propTypes["default"].func,
  onInput1Change: _propTypes["default"].func,
  onSliderBarChange: _propTypes["default"].func,
  step: _propTypes["default"].number,
  enableBarDrag: _propTypes["default"].bool,
  showTooltip: _propTypes["default"].bool
});
(0, _defineProperty2["default"])(Slider, "defaultProps", {
  title: '',
  isRanged: true,
  value0: 0,
  value1: 100,
  minValue: 0,
  maxValue: 100,
  step: 1,
  sliderHandleWidth: 12,
  enableBarDrag: false,
  onSlider0Change: noop,
  onInput0Change: noop,
  onSlider1Change: noop,
  onInput1Change: noop,
  onSliderBarChange: noop,
  disabled: false,
  vertical: false,
  showTooltip: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJTdHlsZWRSYW5nZVNsaWRlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzbGlkZXJCYXJCZ2QiLCJ2ZXJ0aWNhbCIsInNsaWRlckJhckhlaWdodCIsIlNsaWRlcldyYXBwZXIiLCJpc1JhbmdlZCIsInNsaWRlck1hcmdpblRvcElzUmFuZ2UiLCJzbGlkZXJNYXJnaW5Ub3AiLCJTbGlkZXIiLCJ2YWwiLCJ2YWx1ZTEiLCJtaW5WYWx1ZSIsIkJvb2xlYW4iLCJtYXhWYWx1ZSIsInZhbHVlMCIsIngiLCJfZ2V0VmFsdWUiLCJfaXNWYWwwSW5SYW5nZSIsIm9uU2xpZGVyMENoYW5nZSIsIl9pc1ZhbDFJblJhbmdlIiwib25TbGlkZXIxQ2hhbmdlIiwidmFsMCIsInZhbDEiLCJvblNsaWRlckJhckNoYW5nZSIsInciLCJsIiwibnVtIiwic2xpZGVySGFuZGxlV2lkdGgiLCJyZWYiLCJjdXJyZW50Iiwib2Zmc2V0SGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJwZXJjZW50IiwiX2dldEJhc2VEaXN0YW5jZSIsIm1heERlbHRhIiwib2Zmc2V0IiwiZGVsdGEiLCJfZ2V0VmFsRGVsdGEiLCJyYXdWYWx1ZSIsIl9yb3VuZFZhbFRvU3RlcCIsInN0ZXAiLCJjbGFzc1NldCIsImRpc2FibGVkIiwic2hvd1Rvb2x0aXAiLCJjdXJyVmFsRGVsdGEiLCJ3aWR0aCIsInYwTGVmdCIsImNhbGNIYW5kbGVMZWZ0MCIsInNsaWRlMExpc3RlbmVyIiwiY2FsY0hhbmRsZUxlZnQxIiwic2xpZGUxTGlzdGVuZXIiLCJlbmFibGVCYXJEcmFnIiwic2xpZGVyQmFyTGlzdGVuZXIiLCJDb21wb25lbnQiLCJ0aXRsZSIsIlByb3BUeXBlcyIsInN0cmluZyIsImJvb2wiLCJudW1iZXIiLCJmdW5jIiwib25JbnB1dDBDaGFuZ2UiLCJvbklucHV0MUNoYW5n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QWZVO0FBZ0JwQnhDLEVBQUFBLFFBQVEsRUFBRSxLQWhCVTtBQWlCcEJ5QyxFQUFBQSxXQUFXLEVBQUU7QUFqQk8sQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgY3JlYXRlUmVmfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IFNsaWRlckhhbmRsZSBmcm9tICcuL3NsaWRlci1oYW5kbGUnO1xuaW1wb3J0IFNsaWRlckJhckhhbmRsZSBmcm9tICcuL3NsaWRlci1iYXItaGFuZGxlJztcbmltcG9ydCB7cm91bmRWYWxUb1N0ZXB9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuY29uc3QgU3R5bGVkUmFuZ2VTbGlkZXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVyQmFyQmdkfTtcbiAgJHtwcm9wcyA9PiBgJHtwcm9wcy52ZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0J306ICR7cHJvcHMudGhlbWUuc2xpZGVyQmFySGVpZ2h0fXB4YH07XG4gICR7cHJvcHMgPT4gYCR7cHJvcHMudmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCd9OiAxMDAlYH07XG5gO1xuXG5jb25zdCBTbGlkZXJXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZmxleC1ncm93OiAxO1xuICBtYXJnaW4tdG9wOiAke3Byb3BzID0+XG4gICAgcHJvcHMuaXNSYW5nZWQgPyBwcm9wcy50aGVtZS5zbGlkZXJNYXJnaW5Ub3BJc1JhbmdlIDogcHJvcHMudGhlbWUuc2xpZGVyTWFyZ2luVG9wfXB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpc1JhbmdlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHZhbHVlMTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBtaW5WYWx1ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBtYXhWYWx1ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzbGlkZXJIYW5kbGVXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvblNsaWRlcjBDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSW5wdXQwQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNsaWRlcjFDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSW5wdXQxQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNsaWRlckJhckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgc3RlcDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBlbmFibGVCYXJEcmFnOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzaG93VG9vbHRpcDogUHJvcFR5cGVzLmJvb2xcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHRpdGxlOiAnJyxcbiAgICBpc1JhbmdlZDogdHJ1ZSxcbiAgICB2YWx1ZTA6IDAsXG4gICAgdmFsdWUxOiAxMDAsXG4gICAgbWluVmFsdWU6IDAsXG4gICAgbWF4VmFsdWU6IDEwMCxcbiAgICBzdGVwOiAxLFxuICAgIHNsaWRlckhhbmRsZVdpZHRoOiAxMixcbiAgICBlbmFibGVCYXJEcmFnOiBmYWxzZSxcbiAgICBvblNsaWRlcjBDaGFuZ2U6IG5vb3AsXG4gICAgb25JbnB1dDBDaGFuZ2U6IG5vb3AsXG4gICAgb25TbGlkZXIxQ2hhbmdlOiBub29wLFxuICAgIG9uSW5wdXQxQ2hhbmdlOiBub29wLFxuICAgIG9uU2xpZGVyQmFyQ2hhbmdlOiBub29wLFxuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgc2hvd1Rvb2x0aXA6IGZhbHNlXG4gIH07XG5cbiAgcmVmID0gY3JlYXRlUmVmKCk7XG5cbiAgX2dldEJhc2VEaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy52ZXJ0aWNhbCA/IHRoaXMucmVmLmN1cnJlbnQub2Zmc2V0SGVpZ2h0IDogdGhpcy5yZWYuY3VycmVudC5vZmZzZXRXaWR0aDtcbiAgfVxuXG4gIF9nZXRWYWxEZWx0YSh4KSB7XG4gICAgY29uc3QgcGVyY2VudCA9IHggLyB0aGlzLl9nZXRCYXNlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBtYXhEZWx0YSA9IHRoaXMucHJvcHMubWF4VmFsdWUgLSB0aGlzLnByb3BzLm1pblZhbHVlO1xuICAgIHJldHVybiBwZXJjZW50ICogbWF4RGVsdGE7XG4gIH1cblxuICBfZ2V0VmFsdWUodmFsLCBvZmZzZXQpIHtcbiAgICBjb25zdCBkZWx0YSA9IHRoaXMuX2dldFZhbERlbHRhKG9mZnNldCk7XG4gICAgY29uc3QgcmF3VmFsdWUgPSB0aGlzLnByb3BzLnZlcnRpY2FsID8gdmFsIC0gZGVsdGEgOiB2YWwgKyBkZWx0YTtcblxuICAgIHJldHVybiB0aGlzLl9yb3VuZFZhbFRvU3RlcChyYXdWYWx1ZSk7XG4gIH1cblxuICBfaXNWYWwwSW5SYW5nZSA9IHZhbCA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMSwgbWluVmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gQm9vbGVhbih2YWwgPj0gbWluVmFsdWUgJiYgdmFsIDw9IHZhbHVlMSk7XG4gIH07XG5cbiAgX2lzVmFsMUluUmFuZ2UgPSB2YWwgPT4ge1xuICAgIGNvbnN0IHttYXhWYWx1ZSwgdmFsdWUwfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIEJvb2xlYW4odmFsIDw9IG1heFZhbHVlICYmIHZhbCA+PSB2YWx1ZTApO1xuICB9O1xuXG4gIF9yb3VuZFZhbFRvU3RlcCh2YWwpIHtcbiAgICBjb25zdCB7bWluVmFsdWUsIHN0ZXB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gcm91bmRWYWxUb1N0ZXAobWluVmFsdWUsIHN0ZXAsIHZhbCk7XG4gIH1cblxuICBzbGlkZTBMaXN0ZW5lciA9IHggPT4ge1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuX2dldFZhbHVlKHRoaXMucHJvcHMudmFsdWUwLCB4KTtcbiAgICBpZiAodGhpcy5faXNWYWwwSW5SYW5nZSh2YWwpKSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2xpZGVyMENoYW5nZSh2YWwpO1xuICAgIH1cbiAgfTtcblxuICBzbGlkZTFMaXN0ZW5lciA9IHggPT4ge1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuX2dldFZhbHVlKHRoaXMucHJvcHMudmFsdWUxLCB4KTtcbiAgICBpZiAodGhpcy5faXNWYWwxSW5SYW5nZSh2YWwpKSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2xpZGVyMUNoYW5nZSh2YWwpO1xuICAgIH1cbiAgfTtcblxuICBzbGlkZXJCYXJMaXN0ZW5lciA9IHggPT4ge1xuICAgIGNvbnN0IHZhbDAgPSB0aGlzLl9nZXRWYWx1ZSh0aGlzLnByb3BzLnZhbHVlMCwgeCk7XG4gICAgY29uc3QgdmFsMSA9IHRoaXMuX2dldFZhbHVlKHRoaXMucHJvcHMudmFsdWUxLCB4KTtcbiAgICBpZiAodGhpcy5faXNWYWwxSW5SYW5nZSh2YWwxKSAmJiB0aGlzLl9pc1ZhbDBJblJhbmdlKHZhbDApKSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2xpZGVyQmFyQ2hhbmdlKHZhbDAsIHZhbDEpO1xuICAgIH1cbiAgfTtcblxuICBjYWxjSGFuZGxlTGVmdDAgPSAodywgbCwgbnVtKSA9PiB7XG4gICAgcmV0dXJuIHcgPT09IDBcbiAgICAgID8gYGNhbGMoJHtsfSUgLSAke3RoaXMucHJvcHMuc2xpZGVySGFuZGxlV2lkdGggLyAyfXB4KWBcbiAgICAgIDogYGNhbGMoJHtsfSUgLSAke3RoaXMucHJvcHMuc2xpZGVySGFuZGxlV2lkdGggLyAyfXB4KWA7XG4gIH07XG5cbiAgY2FsY0hhbmRsZUxlZnQxID0gKHcsIGwpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5pc1JhbmdlZCAmJiB3ID09PSAwXG4gICAgICA/IGAke2x9JWBcbiAgICAgIDogYGNhbGMoJHtsICsgd30lIC0gJHt0aGlzLnByb3BzLnNsaWRlckhhbmRsZVdpZHRoIC8gMn1weClgO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBjbGFzc1NldCxcbiAgICAgIGRpc2FibGVkLFxuICAgICAgaXNSYW5nZWQsXG4gICAgICBtYXhWYWx1ZSxcbiAgICAgIG1pblZhbHVlLFxuICAgICAgdmFsdWUxLFxuICAgICAgdmVydGljYWwsXG4gICAgICBzbGlkZXJIYW5kbGVXaWR0aCxcbiAgICAgIHNob3dUb29sdGlwXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdmFsdWUwID0gIWlzUmFuZ2VkICYmIG1pblZhbHVlID4gMCA/IG1pblZhbHVlIDogdGhpcy5wcm9wcy52YWx1ZTA7XG4gICAgY29uc3QgY3VyclZhbERlbHRhID0gdmFsdWUxIC0gdmFsdWUwO1xuICAgIGNvbnN0IG1heERlbHRhID0gbWF4VmFsdWUgLSBtaW5WYWx1ZTtcbiAgICBjb25zdCB3aWR0aCA9IChjdXJyVmFsRGVsdGEgLyBtYXhEZWx0YSkgKiAxMDA7XG5cbiAgICBjb25zdCB2MExlZnQgPSAoKHZhbHVlMCAtIG1pblZhbHVlKSAvIG1heERlbHRhKSAqIDEwMDtcblxuICAgIHJldHVybiAoXG4gICAgICA8U2xpZGVyV3JhcHBlclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2tnLXNsaWRlcicsIHsuLi5jbGFzc1NldCwgZGlzYWJsZWR9KX1cbiAgICAgICAgcmVmPXt0aGlzLnJlZn1cbiAgICAgICAgaXNSYW5nZWQ9e2lzUmFuZ2VkfVxuICAgICAgICB2ZXJ0aWNhbD17dmVydGljYWx9XG4gICAgICA+XG4gICAgICAgIDxTdHlsZWRSYW5nZVNsaWRlciBjbGFzc05hbWU9XCJrZy1yYW5nZS1zbGlkZXJcIiB2ZXJ0aWNhbD17dmVydGljYWx9PlxuICAgICAgICAgIDxTbGlkZXJIYW5kbGVcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImtnLXJhbmdlLXNsaWRlcl9faGFuZGxlXCJcbiAgICAgICAgICAgIGxlZnQ9e3RoaXMuY2FsY0hhbmRsZUxlZnQwKHdpZHRoLCB2MExlZnQpfVxuICAgICAgICAgICAgdmFsdWVMaXN0ZW5lcj17dGhpcy5zbGlkZTBMaXN0ZW5lcn1cbiAgICAgICAgICAgIHNsaWRlckhhbmRsZVdpZHRoPXtzbGlkZXJIYW5kbGVXaWR0aH1cbiAgICAgICAgICAgIGRpc3BsYXk9e2lzUmFuZ2VkfVxuICAgICAgICAgICAgdmVydGljYWw9e3ZlcnRpY2FsfVxuICAgICAgICAgICAgc2hvd1Rvb2x0aXA9e3Nob3dUb29sdGlwfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFNsaWRlckhhbmRsZVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwia2ctcmFuZ2Utc2xpZGVyX19oYW5kbGVcIlxuICAgICAgICAgICAgbGVmdD17dGhpcy5jYWxjSGFuZGxlTGVmdDEod2lkdGgsIHYwTGVmdCl9XG4gICAgICAgICAgICB2YWx1ZUxpc3RlbmVyPXt0aGlzLnNsaWRlMUxpc3RlbmVyfVxuICAgICAgICAgICAgc2xpZGVySGFuZGxlV2lkdGg9e3NsaWRlckhhbmRsZVdpZHRofVxuICAgICAgICAgICAgdmVydGljYWw9e3ZlcnRpY2FsfVxuICAgICAgICAgICAgdmFsdWU9e3ZhbHVlMX1cbiAgICAgICAgICAgIHNob3dUb29sdGlwPXtzaG93VG9vbHRpcH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTbGlkZXJCYXJIYW5kbGVcbiAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgIHYwTGVmdD17djBMZWZ0fVxuICAgICAgICAgICAgZW5hYmxlQmFyRHJhZz17dGhpcy5wcm9wcy5lbmFibGVCYXJEcmFnfVxuICAgICAgICAgICAgc2xpZGVyQmFyTGlzdGVuZXI9e3RoaXMuc2xpZGVyQmFyTGlzdGVuZXJ9XG4gICAgICAgICAgICB2ZXJ0aWNhbD17dmVydGljYWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdHlsZWRSYW5nZVNsaWRlcj5cbiAgICAgIDwvU2xpZGVyV3JhcHBlcj5cbiAgICApO1xuICB9XG59XG4iXX0=