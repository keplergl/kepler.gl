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

var _sliderHandle = _interopRequireDefault(require("./slider-handle"));

var _sliderBarHandle = _interopRequireDefault(require("./slider-bar-handle"));

var _dataUtils = require("../../../utils/data-utils");

var _templateObject, _templateObject2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function noop() {}

var StyledRangeSlider = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  background-color: ", ";\n  ", ";\n  ", ";\n"])), function (props) {
  return props.theme.sliderBarBgd;
}, function (props) {
  return "".concat(props.vertical ? 'width' : 'height', ": ").concat(props.theme.sliderBarHeight, "px");
}, function (props) {
  return "".concat(props.vertical ? 'height' : 'width', ": 100%");
});

var SliderWrapper = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  flex-grow: 1;\n"])));

var Slider = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Slider, _Component);

  var _super = _createSuper(Slider);

  function Slider() {
    var _this;

    (0, _classCallCheck2["default"])(this, Slider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ref", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "track", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_setAnchor", function (x) {
      // used to calculate delta
      _this._anchor = x;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "slide0Listener", function (x) {
      var _this$props = _this.props,
          value1 = _this$props.value1,
          minValue = _this$props.minValue;

      var val = _this._getValue(minValue, x);

      _this.props.onSlider0Change((0, _dataUtils.clamp)([minValue, value1], val));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "slide1Listener", function (x) {
      var _this$props2 = _this.props,
          minValue = _this$props2.minValue,
          maxValue = _this$props2.maxValue,
          value0 = _this$props2.value0;

      var val = _this._getValue(minValue, x);

      _this.props.onSlider1Change((0, _dataUtils.clamp)([value0, maxValue], val));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sliderBarListener", function (x) {
      var _this$props3 = _this.props,
          value0 = _this$props3.value0,
          value1 = _this$props3.value1,
          minValue = _this$props3.minValue,
          maxValue = _this$props3.maxValue; // for slider bar, we use distance delta

      var anchor = _this._anchor;
      var length = value1 - value0; // the length of the selected range shouldn't change when clamping

      var val0 = (0, _dataUtils.clamp)([minValue, maxValue - length], _this._getValue(value0, x - anchor));
      var val1 = (0, _dataUtils.clamp)([val0 + length, maxValue], _this._getValue(value1, x - anchor));

      var deltaX = _this._getDeltaX(val0 - _this.props.value0);

      _this.props.onSliderBarChange(val0, val1); // update anchor


      _this._anchor = _this._anchor + deltaX;
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
    key: "_getDeltaVal",
    value: function _getDeltaVal(x) {
      var percent = x / this._getBaseDistance();

      var maxDelta = this.props.maxValue - this.props.minValue;
      return percent * maxDelta;
    }
  }, {
    key: "_getDeltaX",
    value: function _getDeltaX(v) {
      var percent = v / (this.props.maxValue - this.props.minValue);

      var maxDelta = this._getBaseDistance();

      return percent * maxDelta;
    }
  }, {
    key: "_getValue",
    value: function _getValue(baseV, offset) {
      // offset is the distance between slider handle and track left
      var rawValue = baseV + this._getDeltaVal(offset);

      return this._normalizeValue(rawValue);
    }
  }, {
    key: "_normalizeValue",
    value: function _normalizeValue(val) {
      var _this$props4 = this.props,
          minValue = _this$props4.minValue,
          step = _this$props4.step,
          marks = _this$props4.marks;
      return (0, _dataUtils.normalizeSliderValue)(val, minValue, step, marks);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          classSet = _this$props5.classSet,
          disabled = _this$props5.disabled,
          isRanged = _this$props5.isRanged,
          maxValue = _this$props5.maxValue,
          minValue = _this$props5.minValue,
          value1 = _this$props5.value1,
          vertical = _this$props5.vertical,
          sliderHandleWidth = _this$props5.sliderHandleWidth,
          showTooltip = _this$props5.showTooltip;
      var value0 = !isRanged && minValue > 0 ? minValue : this.props.value0;
      var currValDelta = value1 - value0;
      var maxDelta = maxValue - minValue;
      var width = currValDelta / maxDelta * 100;
      var v0Left = (value0 - minValue) / maxDelta * 100;
      return /*#__PURE__*/_react["default"].createElement(SliderWrapper, {
        className: (0, _classnames["default"])('kg-slider', _objectSpread(_objectSpread({}, classSet), {}, {
          disabled: disabled
        })),
        ref: this.ref,
        isRanged: isRanged,
        vertical: vertical
      }, /*#__PURE__*/_react["default"].createElement(StyledRangeSlider, {
        className: "kg-range-slider",
        vertical: vertical,
        ref: this.track
      }, /*#__PURE__*/_react["default"].createElement(_sliderHandle["default"], {
        left: this.calcHandleLeft0(width, v0Left),
        valueListener: this.slide0Listener,
        sliderHandleWidth: sliderHandleWidth,
        display: isRanged,
        vertical: vertical,
        showTooltip: showTooltip,
        track: this.track
      }), /*#__PURE__*/_react["default"].createElement(_sliderHandle["default"], {
        left: this.calcHandleLeft1(width, v0Left),
        valueListener: this.slide1Listener,
        sliderHandleWidth: sliderHandleWidth,
        vertical: vertical,
        value: value1,
        showTooltip: showTooltip,
        track: this.track
      }), /*#__PURE__*/_react["default"].createElement(_sliderBarHandle["default"], {
        width: width,
        v0Left: v0Left,
        enableBarDrag: this.props.enableBarDrag,
        sliderBarListener: this.sliderBarListener,
        vertical: vertical,
        track: this.track,
        setAnchor: this._setAnchor
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJTdHlsZWRSYW5nZVNsaWRlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzbGlkZXJCYXJCZ2QiLCJ2ZXJ0aWNhbCIsInNsaWRlckJhckhlaWdodCIsIlNsaWRlcldyYXBwZXIiLCJTbGlkZXIiLCJ4IiwiX2FuY2hvciIsInZhbHVlMSIsIm1pblZhbHVlIiwidmFsIiwiX2dldFZhbHVlIiwib25TbGlkZXIwQ2hhbmdlIiwibWF4VmFsdWUiLCJ2YWx1ZTAiLCJvblNsaWRlcjFDaGFuZ2UiLCJhbmNob3IiLCJsZW5ndGgiLCJ2YWwwIiwidmFsMSIsImRlbHRhWCIsIl9nZXREZWx0YVgiLCJvblNsaWRlckJhckNoYW5nZSIsInciLCJsIiwibnVtIiwic2xpZGVySGFuZGxlV2lkdGgiLCJpc1JhbmdlZCIsInJlZiIsImN1cnJlbnQiLCJvZmZzZXRIZWlnaHQiLCJvZmZzZXRXaWR0aCIsInBlcmNlbnQiLCJfZ2V0QmFzZURpc3RhbmNlIiwibWF4RGVsdGEiLCJ2IiwiYmFzZVYiLCJvZmZzZXQiLCJyYXdWYWx1ZSIsIl9nZXREZWx0YVZhbCIsIl9ub3JtYWxpemVWYWx1ZSIsInN0ZXAiLCJtYXJrcyIsImNsYXNzU2V0IiwiZGlzYWJsZWQiLCJzaG93VG9vbHRpcCIsImN1cnJWYWxEZWx0YSIsIndpZHRoIiwidjBMZWZ0IiwidHJhY2siLCJjYWxjSGFuZGxlTGVmdDAiLCJzbGlkZTBMaXN0ZW5lciIsImNhbGNIYW5kbGVMZWZ0MSIsInNsaWRlMUxpc3RlbmVyIiwiZW5hYmxlQmFyRHJhZyIsInNsaWRlckJhckxpc3RlbmVyIiwiX3NldEFuY2hvciIsIkNvbXBvbmVudCIsInRpdGxlIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiYm9vbCIsIm51bWJlciIsImZ1bmMiLCJvbklucHV0MENoYW5nZSIsIm9uSW5wdXQxQ2hhbmdlIl0s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RXBCL0IsRUFBQUEsUUFBUSxFQUFFLElBRlU7QUFHcEJiLEVBQUFBLE1BQU0sRUFBRSxDQUhZO0FBSXBCTixFQUFBQSxNQUFNLEVBQUUsR0FKWTtBQUtwQkMsRUFBQUEsUUFBUSxFQUFFLENBTFU7QUFNcEJJLEVBQUFBLFFBQVEsRUFBRSxHQU5VO0FBT3BCNEIsRUFBQUEsSUFBSSxFQUFFLENBUGM7QUFRcEJmLEVBQUFBLGlCQUFpQixFQUFFLEVBUkM7QUFTcEI0QixFQUFBQSxhQUFhLEVBQUUsS0FUSztBQVVwQjFDLEVBQUFBLGVBQWUsRUFBRWpCLElBVkc7QUFXcEJxRSxFQUFBQSxjQUFjLEVBQUVyRSxJQVhJO0FBWXBCb0IsRUFBQUEsZUFBZSxFQUFFcEIsSUFaRztBQWFwQnNFLEVBQUFBLGNBQWMsRUFBRXRFLElBYkk7QUFjcEIyQixFQUFBQSxpQkFBaUIsRUFBRTNCLElBZEM7QUFlcEJpRCxFQUFBQSxRQUFRLEVBQUUsS0FmVTtBQWdCcEIxQyxFQUFBQSxRQUFRLEVBQUUsS0FoQlU7QUFpQnBCMkMsRUFBQUEsV0FBVyxFQUFFO0FBakJPLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBTbGlkZXJIYW5kbGUgZnJvbSAnLi9zbGlkZXItaGFuZGxlJztcbmltcG9ydCBTbGlkZXJCYXJIYW5kbGUgZnJvbSAnLi9zbGlkZXItYmFyLWhhbmRsZSc7XG5pbXBvcnQge25vcm1hbGl6ZVNsaWRlclZhbHVlfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcbmltcG9ydCB7Y2xhbXB9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuY29uc3QgU3R5bGVkUmFuZ2VTbGlkZXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVyQmFyQmdkfTtcbiAgJHtwcm9wcyA9PiBgJHtwcm9wcy52ZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0J306ICR7cHJvcHMudGhlbWUuc2xpZGVyQmFySGVpZ2h0fXB4YH07XG4gICR7cHJvcHMgPT4gYCR7cHJvcHMudmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCd9OiAxMDAlYH07XG5gO1xuXG5jb25zdCBTbGlkZXJXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZmxleC1ncm93OiAxO1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpc1JhbmdlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHZhbHVlMTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBtaW5WYWx1ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBtYXhWYWx1ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzbGlkZXJIYW5kbGVXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvblNsaWRlcjBDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSW5wdXQwQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNsaWRlcjFDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSW5wdXQxQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNsaWRlckJhckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgc3RlcDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBlbmFibGVCYXJEcmFnOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzaG93VG9vbHRpcDogUHJvcFR5cGVzLmJvb2xcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHRpdGxlOiAnJyxcbiAgICBpc1JhbmdlZDogdHJ1ZSxcbiAgICB2YWx1ZTA6IDAsXG4gICAgdmFsdWUxOiAxMDAsXG4gICAgbWluVmFsdWU6IDAsXG4gICAgbWF4VmFsdWU6IDEwMCxcbiAgICBzdGVwOiAxLFxuICAgIHNsaWRlckhhbmRsZVdpZHRoOiAxMixcbiAgICBlbmFibGVCYXJEcmFnOiBmYWxzZSxcbiAgICBvblNsaWRlcjBDaGFuZ2U6IG5vb3AsXG4gICAgb25JbnB1dDBDaGFuZ2U6IG5vb3AsXG4gICAgb25TbGlkZXIxQ2hhbmdlOiBub29wLFxuICAgIG9uSW5wdXQxQ2hhbmdlOiBub29wLFxuICAgIG9uU2xpZGVyQmFyQ2hhbmdlOiBub29wLFxuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgc2hvd1Rvb2x0aXA6IGZhbHNlXG4gIH07XG5cbiAgcmVmID0gY3JlYXRlUmVmKCk7XG4gIHRyYWNrID0gY3JlYXRlUmVmKCk7XG5cbiAgX3NldEFuY2hvciA9IHggPT4ge1xuICAgIC8vIHVzZWQgdG8gY2FsY3VsYXRlIGRlbHRhXG4gICAgdGhpcy5fYW5jaG9yID0geDtcbiAgfTtcblxuICBfZ2V0QmFzZURpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnZlcnRpY2FsID8gdGhpcy5yZWYuY3VycmVudC5vZmZzZXRIZWlnaHQgOiB0aGlzLnJlZi5jdXJyZW50Lm9mZnNldFdpZHRoO1xuICB9XG5cbiAgX2dldERlbHRhVmFsKHgpIHtcbiAgICBjb25zdCBwZXJjZW50ID0geCAvIHRoaXMuX2dldEJhc2VEaXN0YW5jZSgpO1xuICAgIGNvbnN0IG1heERlbHRhID0gdGhpcy5wcm9wcy5tYXhWYWx1ZSAtIHRoaXMucHJvcHMubWluVmFsdWU7XG4gICAgcmV0dXJuIHBlcmNlbnQgKiBtYXhEZWx0YTtcbiAgfVxuICBfZ2V0RGVsdGFYKHYpIHtcbiAgICBjb25zdCBwZXJjZW50ID0gdiAvICh0aGlzLnByb3BzLm1heFZhbHVlIC0gdGhpcy5wcm9wcy5taW5WYWx1ZSk7XG4gICAgY29uc3QgbWF4RGVsdGEgPSB0aGlzLl9nZXRCYXNlRGlzdGFuY2UoKTtcbiAgICByZXR1cm4gcGVyY2VudCAqIG1heERlbHRhO1xuICB9XG5cbiAgX2dldFZhbHVlKGJhc2VWLCBvZmZzZXQpIHtcbiAgICAvLyBvZmZzZXQgaXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gc2xpZGVyIGhhbmRsZSBhbmQgdHJhY2sgbGVmdFxuICAgIGNvbnN0IHJhd1ZhbHVlID0gYmFzZVYgKyB0aGlzLl9nZXREZWx0YVZhbChvZmZzZXQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX25vcm1hbGl6ZVZhbHVlKHJhd1ZhbHVlKTtcbiAgfVxuXG4gIF9ub3JtYWxpemVWYWx1ZSh2YWwpIHtcbiAgICBjb25zdCB7bWluVmFsdWUsIHN0ZXAsIG1hcmtzfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZVNsaWRlclZhbHVlKHZhbCwgbWluVmFsdWUsIHN0ZXAsIG1hcmtzKTtcbiAgfVxuXG4gIHNsaWRlMExpc3RlbmVyID0geCA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMSwgbWluVmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB2YWwgPSB0aGlzLl9nZXRWYWx1ZShtaW5WYWx1ZSwgeCk7XG4gICAgdGhpcy5wcm9wcy5vblNsaWRlcjBDaGFuZ2UoY2xhbXAoW21pblZhbHVlLCB2YWx1ZTFdLCB2YWwpKTtcbiAgfTtcblxuICBzbGlkZTFMaXN0ZW5lciA9IHggPT4ge1xuICAgIGNvbnN0IHttaW5WYWx1ZSwgbWF4VmFsdWUsIHZhbHVlMH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuX2dldFZhbHVlKG1pblZhbHVlLCB4KTtcbiAgICB0aGlzLnByb3BzLm9uU2xpZGVyMUNoYW5nZShjbGFtcChbdmFsdWUwLCBtYXhWYWx1ZV0sIHZhbCkpO1xuICB9O1xuXG4gIHNsaWRlckJhckxpc3RlbmVyID0geCA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMCwgdmFsdWUxLCBtaW5WYWx1ZSwgbWF4VmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICAvLyBmb3Igc2xpZGVyIGJhciwgd2UgdXNlIGRpc3RhbmNlIGRlbHRhXG4gICAgY29uc3QgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xuICAgIGNvbnN0IGxlbmd0aCA9IHZhbHVlMSAtIHZhbHVlMDsgLy8gdGhlIGxlbmd0aCBvZiB0aGUgc2VsZWN0ZWQgcmFuZ2Ugc2hvdWxkbid0IGNoYW5nZSB3aGVuIGNsYW1waW5nXG4gICAgY29uc3QgdmFsMCA9IGNsYW1wKFttaW5WYWx1ZSwgbWF4VmFsdWUgLSBsZW5ndGhdLCB0aGlzLl9nZXRWYWx1ZSh2YWx1ZTAsIHggLSBhbmNob3IpKTtcbiAgICBjb25zdCB2YWwxID0gY2xhbXAoW3ZhbDAgKyBsZW5ndGgsIG1heFZhbHVlXSwgdGhpcy5fZ2V0VmFsdWUodmFsdWUxLCB4IC0gYW5jaG9yKSk7XG5cbiAgICBjb25zdCBkZWx0YVggPSB0aGlzLl9nZXREZWx0YVgodmFsMCAtIHRoaXMucHJvcHMudmFsdWUwKTtcbiAgICB0aGlzLnByb3BzLm9uU2xpZGVyQmFyQ2hhbmdlKHZhbDAsIHZhbDEpO1xuICAgIC8vIHVwZGF0ZSBhbmNob3JcbiAgICB0aGlzLl9hbmNob3IgPSB0aGlzLl9hbmNob3IgKyBkZWx0YVg7XG4gIH07XG5cbiAgY2FsY0hhbmRsZUxlZnQwID0gKHcsIGwsIG51bSkgPT4ge1xuICAgIHJldHVybiB3ID09PSAwXG4gICAgICA/IGBjYWxjKCR7bH0lIC0gJHt0aGlzLnByb3BzLnNsaWRlckhhbmRsZVdpZHRoIC8gMn1weClgXG4gICAgICA6IGBjYWxjKCR7bH0lIC0gJHt0aGlzLnByb3BzLnNsaWRlckhhbmRsZVdpZHRoIC8gMn1weClgO1xuICB9O1xuXG4gIGNhbGNIYW5kbGVMZWZ0MSA9ICh3LCBsKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuaXNSYW5nZWQgJiYgdyA9PT0gMFxuICAgICAgPyBgJHtsfSVgXG4gICAgICA6IGBjYWxjKCR7bCArIHd9JSAtICR7dGhpcy5wcm9wcy5zbGlkZXJIYW5kbGVXaWR0aCAvIDJ9cHgpYDtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2xhc3NTZXQsXG4gICAgICBkaXNhYmxlZCxcbiAgICAgIGlzUmFuZ2VkLFxuICAgICAgbWF4VmFsdWUsXG4gICAgICBtaW5WYWx1ZSxcbiAgICAgIHZhbHVlMSxcbiAgICAgIHZlcnRpY2FsLFxuICAgICAgc2xpZGVySGFuZGxlV2lkdGgsXG4gICAgICBzaG93VG9vbHRpcFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHZhbHVlMCA9ICFpc1JhbmdlZCAmJiBtaW5WYWx1ZSA+IDAgPyBtaW5WYWx1ZSA6IHRoaXMucHJvcHMudmFsdWUwO1xuICAgIGNvbnN0IGN1cnJWYWxEZWx0YSA9IHZhbHVlMSAtIHZhbHVlMDtcbiAgICBjb25zdCBtYXhEZWx0YSA9IG1heFZhbHVlIC0gbWluVmFsdWU7XG4gICAgY29uc3Qgd2lkdGggPSAoY3VyclZhbERlbHRhIC8gbWF4RGVsdGEpICogMTAwO1xuXG4gICAgY29uc3QgdjBMZWZ0ID0gKCh2YWx1ZTAgLSBtaW5WYWx1ZSkgLyBtYXhEZWx0YSkgKiAxMDA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFNsaWRlcldyYXBwZXJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdrZy1zbGlkZXInLCB7Li4uY2xhc3NTZXQsIGRpc2FibGVkfSl9XG4gICAgICAgIHJlZj17dGhpcy5yZWZ9XG4gICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgICAgdmVydGljYWw9e3ZlcnRpY2FsfVxuICAgICAgPlxuICAgICAgICA8U3R5bGVkUmFuZ2VTbGlkZXIgY2xhc3NOYW1lPVwia2ctcmFuZ2Utc2xpZGVyXCIgdmVydGljYWw9e3ZlcnRpY2FsfSByZWY9e3RoaXMudHJhY2t9PlxuICAgICAgICAgIDxTbGlkZXJIYW5kbGVcbiAgICAgICAgICAgIGxlZnQ9e3RoaXMuY2FsY0hhbmRsZUxlZnQwKHdpZHRoLCB2MExlZnQpfVxuICAgICAgICAgICAgdmFsdWVMaXN0ZW5lcj17dGhpcy5zbGlkZTBMaXN0ZW5lcn1cbiAgICAgICAgICAgIHNsaWRlckhhbmRsZVdpZHRoPXtzbGlkZXJIYW5kbGVXaWR0aH1cbiAgICAgICAgICAgIGRpc3BsYXk9e2lzUmFuZ2VkfVxuICAgICAgICAgICAgdmVydGljYWw9e3ZlcnRpY2FsfVxuICAgICAgICAgICAgc2hvd1Rvb2x0aXA9e3Nob3dUb29sdGlwfVxuICAgICAgICAgICAgdHJhY2s9e3RoaXMudHJhY2t9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U2xpZGVySGFuZGxlXG4gICAgICAgICAgICBsZWZ0PXt0aGlzLmNhbGNIYW5kbGVMZWZ0MSh3aWR0aCwgdjBMZWZ0KX1cbiAgICAgICAgICAgIHZhbHVlTGlzdGVuZXI9e3RoaXMuc2xpZGUxTGlzdGVuZXJ9XG4gICAgICAgICAgICBzbGlkZXJIYW5kbGVXaWR0aD17c2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgICB2ZXJ0aWNhbD17dmVydGljYWx9XG4gICAgICAgICAgICB2YWx1ZT17dmFsdWUxfVxuICAgICAgICAgICAgc2hvd1Rvb2x0aXA9e3Nob3dUb29sdGlwfVxuICAgICAgICAgICAgdHJhY2s9e3RoaXMudHJhY2t9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U2xpZGVyQmFySGFuZGxlXG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICB2MExlZnQ9e3YwTGVmdH1cbiAgICAgICAgICAgIGVuYWJsZUJhckRyYWc9e3RoaXMucHJvcHMuZW5hYmxlQmFyRHJhZ31cbiAgICAgICAgICAgIHNsaWRlckJhckxpc3RlbmVyPXt0aGlzLnNsaWRlckJhckxpc3RlbmVyfVxuICAgICAgICAgICAgdmVydGljYWw9e3ZlcnRpY2FsfVxuICAgICAgICAgICAgdHJhY2s9e3RoaXMudHJhY2t9XG4gICAgICAgICAgICBzZXRBbmNob3I9e3RoaXMuX3NldEFuY2hvcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0eWxlZFJhbmdlU2xpZGVyPlxuICAgICAgPC9TbGlkZXJXcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==