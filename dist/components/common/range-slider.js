"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RangeSliderFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _reselect = require("reselect");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _rangePlot = _interopRequireDefault(require("./range-plot"));

var _slider = _interopRequireDefault(require("./slider/slider"));

var _styledComponents2 = require("./styled-components");

var _dataUtils = require("../../utils/data-utils");

var _templateObject, _templateObject2, _templateObject3;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var SliderInput = (0, _styledComponents["default"])(_styledComponents2.Input)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  width: ", "px;\n  margin-left: ", "px;\n  font-size: ", "; // 10px // 12px;\n  padding: ", "; // 4px 6px; // 6px 12px;\n"])), function (props) {
  return props.theme.sliderInputWidth;
}, function (props) {
  return props.flush ? 0 : props.size === 'tiny' ? 12 : 18;
}, function (props) {
  return props.theme.sliderInputFontSize;
}, function (props) {
  return props.theme.sliderInputPadding;
});

var SliderWrapper = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  position: relative;\n  align-items: ", ";\n"])), function (props) {
  return !props.isRanged && props.showInput ? 'center' : 'flex-start';
});

var RangeInputWrapper = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 12px;\n  display: flex;\n  justify-content: space-between;\n"])));

RangeSliderFactory.deps = [_rangePlot["default"]];

function RangeSliderFactory(RangePlot) {
  var RangeSlider = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(RangeSlider, _Component);

    var _super = _createSuper(RangeSlider);

    function RangeSlider() {
      var _this;

      (0, _classCallCheck2["default"])(this, RangeSlider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        value0: 0,
        value1: 1,
        prevValue0: 0,
        prevValue1: 1,
        width: 288
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sliderContainer", null);
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setSliderContainer", function (element) {
        _this.sliderContainer = element;

        _this._resize();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "inputValue0", /*#__PURE__*/(0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "inputValue1", /*#__PURE__*/(0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "value0Selector", function (props) {
        return props.value0;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "value1Selector", function (props) {
        return props.value1;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filterValueSelector", (0, _reselect.createSelector)(_this.value0Selector, _this.value1Selector, function (value0, value1) {
        return [value0, value1];
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_roundValToStep", function (val) {
        var _this$props = _this.props,
            range = _this$props.range,
            step = _this$props.step;
        return (0, _dataUtils.roundValToStep)(range[0], step, val);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_setRangeVal1", function (val) {
        var _this$props2 = _this.props,
            value0 = _this$props2.value0,
            range = _this$props2.range,
            onChange = _this$props2.onChange;
        var val1 = Number(val);
        onChange([value0, (0, _dataUtils.clamp)([value0, range[1]], _this._roundValToStep(val1))]);
        return true;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_setRangeVal0", function (val) {
        var _this$props3 = _this.props,
            value1 = _this$props3.value1,
            range = _this$props3.range,
            onChange = _this$props3.onChange;
        var val0 = Number(val);
        onChange([(0, _dataUtils.clamp)([range[0], value1], _this._roundValToStep(val0)), value1]);
        return true;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_resize", function () {
        if (_this.sliderContainer) {
          var width = _this.sliderContainer.offsetWidth;

          if (width !== _this.state.width) {
            _this.setState({
              width: width
            });
          }
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onChangeInput", function (key, e) {
        _this.setState((0, _defineProperty2["default"])({}, key, e.target.value));
      });
      return _this;
    }

    (0, _createClass2["default"])(RangeSlider, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this._resize();
      }
    }, {
      key: "_renderInput",
      value: function _renderInput(key) {
        var _this2 = this;

        var setRange = key === 'value0' ? this._setRangeVal0 : this._setRangeVal1;
        var ref = key === 'value0' ? this.inputValue0 : this.inputValue1;

        var update = function update(e) {
          if (!setRange(e.target.value)) {
            _this2.setState((0, _defineProperty2["default"])({}, key, _this2.state[key]));
          }
        };

        var onChange = this._onChangeInput.bind(this, key);

        return /*#__PURE__*/_react["default"].createElement(SliderInput, {
          className: "kg-range-slider__input",
          type: "number",
          ref: ref,
          id: "slider-input-".concat(key),
          key: key,
          value: this.state[key],
          onChange: onChange,
          onKeyPress: function onKeyPress(e) {
            if (e.key === 'Enter') {
              update(e);
              ref.current.blur();
            }
          },
          onBlur: update,
          flush: key === 'value0',
          size: this.props.inputSize,
          secondary: this.props.inputTheme === 'secondary'
        });
      } // eslint-disable-next-line complexity

    }, {
      key: "render",
      value: function render() {
        var _this$props4 = this.props,
            isRanged = _this$props4.isRanged,
            showInput = _this$props4.showInput,
            histogram = _this$props4.histogram,
            lineChart = _this$props4.lineChart,
            range = _this$props4.range,
            onChange = _this$props4.onChange,
            sliderHandleWidth = _this$props4.sliderHandleWidth,
            step = _this$props4.step,
            timezone = _this$props4.timezone,
            timeFormat = _this$props4.timeFormat,
            playbackControlWidth = _this$props4.playbackControlWidth;
        var width = this.state.width;
        var plotWidth = Math.max(width - sliderHandleWidth, 0);
        var renderPlot = histogram && histogram.length || lineChart;

        if (!Array.isArray(range) || !range.every(Number.isFinite)) {
          return null;
        }

        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "kg-range-slider",
          style: {
            width: '100%',
            padding: "0 ".concat(sliderHandleWidth / 2, "px")
          },
          ref: this.setSliderContainer
        }, renderPlot ? /*#__PURE__*/_react["default"].createElement(RangePlot, {
          histogram: histogram,
          lineChart: this.props.lineChart,
          plotType: this.props.plotType,
          isEnlarged: this.props.isEnlarged,
          onBrush: function onBrush(val0, val1) {
            return onChange([val0, val1]);
          },
          marks: this.props.marks,
          range: range,
          value: this.props.plotValue || this.filterValueSelector(this.props),
          width: plotWidth,
          isRanged: isRanged,
          step: step,
          timezone: timezone,
          timeFormat: timeFormat,
          playbackControlWidth: playbackControlWidth
        }) : null, /*#__PURE__*/_react["default"].createElement(SliderWrapper, {
          className: "kg-range-slider__slider",
          isRanged: isRanged,
          showInput: showInput
        }, this.props.xAxis ? /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            height: '30px'
          }
        }, /*#__PURE__*/_react["default"].createElement(this.props.xAxis, {
          width: plotWidth,
          timezone: timezone,
          domain: range,
          isEnlarged: this.props.isEnlarged
        })) : null, /*#__PURE__*/_react["default"].createElement(_slider["default"], {
          marks: this.props.marks,
          showValues: false,
          isRanged: isRanged,
          minValue: range[0],
          maxValue: range[1],
          value0: this.props.value0,
          value1: this.props.value1,
          step: step,
          handleWidth: sliderHandleWidth,
          onSlider0Change: this._setRangeVal0,
          onSlider1Change: this._setRangeVal1,
          onSliderBarChange: function onSliderBarChange(val0, val1) {
            onChange([val0, val1]);
          },
          enableBarDrag: true
        }), !isRanged && showInput ? this._renderInput('value1') : null), isRanged && showInput ? /*#__PURE__*/_react["default"].createElement(RangeInputWrapper, {
          className: "range-slider__input-group"
        }, this._renderInput('value0'), this._renderInput('value1')) : null);
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        var update = null;
        var value0 = props.value0,
            value1 = props.value1;

        if (props.value0 !== state.prevValue0 && !isNaN(value0)) {
          update = _objectSpread(_objectSpread({}, update || {}), {}, {
            value0: value0,
            prevValue0: value0
          });
        }

        if (props.value1 !== state.prevValue1 && !isNaN(value1)) {
          update = _objectSpread(_objectSpread({}, update || {}), {}, {
            value1: value1,
            prevValue1: value1
          });
        }

        return update;
      }
    }]);
    return RangeSlider;
  }(_react.Component);

  (0, _defineProperty2["default"])(RangeSlider, "propTypes", {
    range: _propTypes["default"].arrayOf(_propTypes["default"].number),
    value0: _propTypes["default"].number.isRequired,
    value1: _propTypes["default"].number.isRequired,
    onChange: _propTypes["default"].func.isRequired,
    histogram: _propTypes["default"].arrayOf(_propTypes["default"].any),
    isRanged: _propTypes["default"].bool,
    isEnlarged: _propTypes["default"].bool,
    showInput: _propTypes["default"].bool,
    inputTheme: _propTypes["default"].string,
    inputSize: _propTypes["default"].string,
    step: _propTypes["default"].number,
    sliderHandleWidth: _propTypes["default"].number,
    xAxis: _propTypes["default"].elementType
  });
  (0, _defineProperty2["default"])(RangeSlider, "defaultProps", {
    isEnlarged: false,
    isRanged: true,
    showInput: true,
    sliderHandleWidth: 12,
    inputTheme: '',
    inputSize: 'small',
    onChange: function onChange() {}
  });
  (0, _reactLifecyclesCompat.polyfill)(RangeSlider);
  return RangeSlider;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOlsiU2xpZGVySW5wdXQiLCJJbnB1dCIsInByb3BzIiwidGhlbWUiLCJzbGlkZXJJbnB1dFdpZHRoIiwiZmx1c2giLCJzaXplIiwic2xpZGVySW5wdXRGb250U2l6ZSIsInNsaWRlcklucHV0UGFkZGluZyIsIlNsaWRlcldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJpc1JhbmdlZCIsInNob3dJbnB1dCIsIlJhbmdlSW5wdXRXcmFwcGVyIiwiUmFuZ2VTbGlkZXJGYWN0b3J5IiwiZGVwcyIsIlJhbmdlUGxvdEZhY3RvcnkiLCJSYW5nZVBsb3QiLCJSYW5nZVNsaWRlciIsInZhbHVlMCIsInZhbHVlMSIsInByZXZWYWx1ZTAiLCJwcmV2VmFsdWUxIiwid2lkdGgiLCJlbGVtZW50Iiwic2xpZGVyQ29udGFpbmVyIiwiX3Jlc2l6ZSIsInZhbHVlMFNlbGVjdG9yIiwidmFsdWUxU2VsZWN0b3IiLCJ2YWwiLCJyYW5nZSIsInN0ZXAiLCJvbkNoYW5nZSIsInZhbDEiLCJOdW1iZXIiLCJfcm91bmRWYWxUb1N0ZXAiLCJ2YWwwIiwib2Zmc2V0V2lkdGgiLCJzdGF0ZSIsInNldFN0YXRlIiwia2V5IiwiZSIsInRhcmdldCIsInZhbHVlIiwic2V0UmFuZ2UiLCJfc2V0UmFuZ2VWYWwwIiwiX3NldFJhbmdlVmFsMSIsInJlZiIsImlucHV0VmFsdWUwIiwiaW5wdXRWYWx1ZTEiLCJ1cGRhdGUiLCJfb25DaGFuZ2VJbnB1dCIsImJpbmQiLCJjdXJyZW50IiwiYmx1ciIsImlucHV0U2l6ZSIsImlucHV0VGhlbWUiLCJoaXN0b2dyYW0iLCJsaW5lQ2hhcnQiLCJzbGlkZXJIYW5kbGVXaWR0aCIsInRpbWV6b25lIiwidGltZUZvcm1hdCIsInBsYXliYWNrQ29udHJvbFdpZHRoIiwicGxvdFdpZHRoIiwiTWF0aCIsIm1heCIsInJlbmRlclBsb3QiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJldmVyeSIsImlzRmluaXRlIiwicGFkZGluZyIsInNldFNsaWRlckNvbnRhaW5lciIsInBsb3RUeXBlIiwiaXNFbmxhcmdlZCIsIm1hcmtzIiwicGxvdFZhbHVlIiwiZmlsdGVyVmFsdWVTZWxlY3RvciIsInhBeGlzIiwiaGVpZ2h0IiwiX3JlbmRlcklucHV0IiwiaXNOYU4iLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJhbnkiLCJib29sIiwic3RyaW5nIiwiZWxlbWVudFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxHQUFHLGtDQUFPQyx3QkFBUCxDQUFILG1OQUNOLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsZ0JBQWhCO0FBQUEsQ0FEQyxFQUVBLFVBQUFGLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNHLEtBQU4sR0FBYyxDQUFkLEdBQWtCSCxLQUFLLENBQUNJLElBQU4sS0FBZSxNQUFmLEdBQXdCLEVBQXhCLEdBQTZCLEVBQXBEO0FBQUEsQ0FGTCxFQUdGLFVBQUFKLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksbUJBQWhCO0FBQUEsQ0FISCxFQUlKLFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUssa0JBQWhCO0FBQUEsQ0FKRCxDQUFqQjs7QUFPQSxJQUFNQyxhQUFhLEdBQUdDLDZCQUFPQyxHQUFWLDBKQUdGLFVBQUFULEtBQUs7QUFBQSxTQUFLLENBQUNBLEtBQUssQ0FBQ1UsUUFBUCxJQUFtQlYsS0FBSyxDQUFDVyxTQUF6QixHQUFxQyxRQUFyQyxHQUFnRCxZQUFyRDtBQUFBLENBSEgsQ0FBbkI7O0FBTUEsSUFBTUMsaUJBQWlC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QUFBLFVBQVUsRUFBRSxFQUxRO0FBTXBCRCxJQUFBQSxTQUFTLEVBQUUsT0FOUztBQU9wQnZCLElBQUFBLFFBQVEsRUFBRSxvQkFBTSxDQUFFO0FBUEUsR0FsQjRCO0FBaU9wRCx1Q0FBU2QsV0FBVDtBQUVBLFNBQU9BLFdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgY3JlYXRlUmVmfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3BvbHlmaWxsfSBmcm9tICdyZWFjdC1saWZlY3ljbGVzLWNvbXBhdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmFuZ2VQbG90RmFjdG9yeSBmcm9tICcuL3JhbmdlLXBsb3QnO1xuaW1wb3J0IFNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyJztcbmltcG9ydCB7SW5wdXR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtyb3VuZFZhbFRvU3RlcCwgY2xhbXB9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5jb25zdCBTbGlkZXJJbnB1dCA9IHN0eWxlZChJbnB1dClgXG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlcklucHV0V2lkdGh9cHg7XG4gIG1hcmdpbi1sZWZ0OiAke3Byb3BzID0+IChwcm9wcy5mbHVzaCA/IDAgOiBwcm9wcy5zaXplID09PSAndGlueScgPyAxMiA6IDE4KX1weDtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlcklucHV0Rm9udFNpemV9OyAvLyAxMHB4IC8vIDEycHg7XG4gIHBhZGRpbmc6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVySW5wdXRQYWRkaW5nfTsgLy8gNHB4IDZweDsgLy8gNnB4IDEycHg7XG5gO1xuXG5jb25zdCBTbGlkZXJXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBhbGlnbi1pdGVtczogJHtwcm9wcyA9PiAoIXByb3BzLmlzUmFuZ2VkICYmIHByb3BzLnNob3dJbnB1dCA/ICdjZW50ZXInIDogJ2ZsZXgtc3RhcnQnKX07XG5gO1xuXG5jb25zdCBSYW5nZUlucHV0V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi10b3A6IDEycHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbmA7XG5cblJhbmdlU2xpZGVyRmFjdG9yeS5kZXBzID0gW1JhbmdlUGxvdEZhY3RvcnldO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSYW5nZVNsaWRlckZhY3RvcnkoUmFuZ2VQbG90KSB7XG4gIGNsYXNzIFJhbmdlU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgcmFuZ2U6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLFxuICAgICAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB2YWx1ZTE6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICAgIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgc2hvd0lucHV0OiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGlucHV0VGhlbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBpbnB1dFNpemU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBzdGVwOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgc2xpZGVySGFuZGxlV2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICB4QXhpczogUHJvcFR5cGVzLmVsZW1lbnRUeXBlXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBpc0VubGFyZ2VkOiBmYWxzZSxcbiAgICAgIGlzUmFuZ2VkOiB0cnVlLFxuICAgICAgc2hvd0lucHV0OiB0cnVlLFxuICAgICAgc2xpZGVySGFuZGxlV2lkdGg6IDEyLFxuICAgICAgaW5wdXRUaGVtZTogJycsXG4gICAgICBpbnB1dFNpemU6ICdzbWFsbCcsXG4gICAgICBvbkNoYW5nZTogKCkgPT4ge31cbiAgICB9O1xuXG4gICAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICAgIGxldCB1cGRhdGUgPSBudWxsO1xuICAgICAgY29uc3Qge3ZhbHVlMCwgdmFsdWUxfSA9IHByb3BzO1xuICAgICAgaWYgKHByb3BzLnZhbHVlMCAhPT0gc3RhdGUucHJldlZhbHVlMCAmJiAhaXNOYU4odmFsdWUwKSkge1xuICAgICAgICB1cGRhdGUgPSB7Li4uKHVwZGF0ZSB8fCB7fSksIHZhbHVlMCwgcHJldlZhbHVlMDogdmFsdWUwfTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wcy52YWx1ZTEgIT09IHN0YXRlLnByZXZWYWx1ZTEgJiYgIWlzTmFOKHZhbHVlMSkpIHtcbiAgICAgICAgdXBkYXRlID0gey4uLih1cGRhdGUgfHwge30pLCB2YWx1ZTEsIHByZXZWYWx1ZTE6IHZhbHVlMX07XG4gICAgICB9XG4gICAgICByZXR1cm4gdXBkYXRlO1xuICAgIH1cblxuICAgIHN0YXRlID0ge1xuICAgICAgdmFsdWUwOiAwLFxuICAgICAgdmFsdWUxOiAxLFxuICAgICAgcHJldlZhbHVlMDogMCxcbiAgICAgIHByZXZWYWx1ZTE6IDEsXG4gICAgICB3aWR0aDogMjg4XG4gICAgfTtcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNsaWRlckNvbnRhaW5lciA9IG51bGw7XG4gICAgc2V0U2xpZGVyQ29udGFpbmVyID0gZWxlbWVudCA9PiB7XG4gICAgICB0aGlzLnNsaWRlckNvbnRhaW5lciA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLl9yZXNpemUoKTtcbiAgICB9O1xuICAgIGlucHV0VmFsdWUwID0gY3JlYXRlUmVmKCk7XG4gICAgaW5wdXRWYWx1ZTEgPSBjcmVhdGVSZWYoKTtcbiAgICB2YWx1ZTBTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnZhbHVlMDtcbiAgICB2YWx1ZTFTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnZhbHVlMTtcbiAgICBmaWx0ZXJWYWx1ZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICB0aGlzLnZhbHVlMFNlbGVjdG9yLFxuICAgICAgdGhpcy52YWx1ZTFTZWxlY3RvcixcbiAgICAgICh2YWx1ZTAsIHZhbHVlMSkgPT4gW3ZhbHVlMCwgdmFsdWUxXVxuICAgICk7XG5cbiAgICBfcm91bmRWYWxUb1N0ZXAgPSB2YWwgPT4ge1xuICAgICAgY29uc3Qge3JhbmdlLCBzdGVwfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHJldHVybiByb3VuZFZhbFRvU3RlcChyYW5nZVswXSwgc3RlcCwgdmFsKTtcbiAgICB9O1xuXG4gICAgX3NldFJhbmdlVmFsMSA9IHZhbCA9PiB7XG4gICAgICBjb25zdCB7dmFsdWUwLCByYW5nZSwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHZhbDEgPSBOdW1iZXIodmFsKTtcbiAgICAgIG9uQ2hhbmdlKFt2YWx1ZTAsIGNsYW1wKFt2YWx1ZTAsIHJhbmdlWzFdXSwgdGhpcy5fcm91bmRWYWxUb1N0ZXAodmFsMSkpXSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgX3NldFJhbmdlVmFsMCA9IHZhbCA9PiB7XG4gICAgICBjb25zdCB7dmFsdWUxLCByYW5nZSwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHZhbDAgPSBOdW1iZXIodmFsKTtcbiAgICAgIG9uQ2hhbmdlKFtjbGFtcChbcmFuZ2VbMF0sIHZhbHVlMV0sIHRoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbDApKSwgdmFsdWUxXSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgX3Jlc2l6ZSA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNsaWRlckNvbnRhaW5lcikge1xuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuc2xpZGVyQ29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgICAgICBpZiAod2lkdGggIT09IHRoaXMuc3RhdGUud2lkdGgpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHt3aWR0aH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9vbkNoYW5nZUlucHV0ID0gKGtleSwgZSkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7W2tleV06IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgfTtcblxuICAgIF9yZW5kZXJJbnB1dChrZXkpIHtcbiAgICAgIGNvbnN0IHNldFJhbmdlID0ga2V5ID09PSAndmFsdWUwJyA/IHRoaXMuX3NldFJhbmdlVmFsMCA6IHRoaXMuX3NldFJhbmdlVmFsMTtcbiAgICAgIGNvbnN0IHJlZiA9IGtleSA9PT0gJ3ZhbHVlMCcgPyB0aGlzLmlucHV0VmFsdWUwIDogdGhpcy5pbnB1dFZhbHVlMTtcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IGUgPT4ge1xuICAgICAgICBpZiAoIXNldFJhbmdlKGUudGFyZ2V0LnZhbHVlKSkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1trZXldOiB0aGlzLnN0YXRlW2tleV19KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB0aGlzLl9vbkNoYW5nZUlucHV0LmJpbmQodGhpcywga2V5KTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFNsaWRlcklucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwia2ctcmFuZ2Utc2xpZGVyX19pbnB1dFwiXG4gICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgcmVmPXtyZWZ9XG4gICAgICAgICAgaWQ9e2BzbGlkZXItaW5wdXQtJHtrZXl9YH1cbiAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZVtrZXldfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICBvbktleVByZXNzPXtlID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICB1cGRhdGUoZSk7XG4gICAgICAgICAgICAgIHJlZi5jdXJyZW50LmJsdXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQmx1cj17dXBkYXRlfVxuICAgICAgICAgIGZsdXNoPXtrZXkgPT09ICd2YWx1ZTAnfVxuICAgICAgICAgIHNpemU9e3RoaXMucHJvcHMuaW5wdXRTaXplfVxuICAgICAgICAgIHNlY29uZGFyeT17dGhpcy5wcm9wcy5pbnB1dFRoZW1lID09PSAnc2Vjb25kYXJ5J31cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGlzUmFuZ2VkLFxuICAgICAgICBzaG93SW5wdXQsXG4gICAgICAgIGhpc3RvZ3JhbSxcbiAgICAgICAgbGluZUNoYXJ0LFxuICAgICAgICByYW5nZSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICAgIHNsaWRlckhhbmRsZVdpZHRoLFxuICAgICAgICBzdGVwLFxuICAgICAgICB0aW1lem9uZSxcbiAgICAgICAgdGltZUZvcm1hdCxcbiAgICAgICAgcGxheWJhY2tDb250cm9sV2lkdGhcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCB7d2lkdGh9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGNvbnN0IHBsb3RXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0gc2xpZGVySGFuZGxlV2lkdGgsIDApO1xuICAgICAgY29uc3QgcmVuZGVyUGxvdCA9IChoaXN0b2dyYW0gJiYgaGlzdG9ncmFtLmxlbmd0aCkgfHwgbGluZUNoYXJ0O1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJhbmdlKSB8fCAhcmFuZ2UuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJrZy1yYW5nZS1zbGlkZXJcIlxuICAgICAgICAgIHN0eWxlPXt7d2lkdGg6ICcxMDAlJywgcGFkZGluZzogYDAgJHtzbGlkZXJIYW5kbGVXaWR0aCAvIDJ9cHhgfX1cbiAgICAgICAgICByZWY9e3RoaXMuc2V0U2xpZGVyQ29udGFpbmVyfVxuICAgICAgICA+XG4gICAgICAgICAge3JlbmRlclBsb3QgPyAoXG4gICAgICAgICAgICA8UmFuZ2VQbG90XG4gICAgICAgICAgICAgIGhpc3RvZ3JhbT17aGlzdG9ncmFtfVxuICAgICAgICAgICAgICBsaW5lQ2hhcnQ9e3RoaXMucHJvcHMubGluZUNoYXJ0fVxuICAgICAgICAgICAgICBwbG90VHlwZT17dGhpcy5wcm9wcy5wbG90VHlwZX1cbiAgICAgICAgICAgICAgaXNFbmxhcmdlZD17dGhpcy5wcm9wcy5pc0VubGFyZ2VkfVxuICAgICAgICAgICAgICBvbkJydXNoPXsodmFsMCwgdmFsMSkgPT4gb25DaGFuZ2UoW3ZhbDAsIHZhbDFdKX1cbiAgICAgICAgICAgICAgbWFya3M9e3RoaXMucHJvcHMubWFya3N9XG4gICAgICAgICAgICAgIHJhbmdlPXtyYW5nZX1cbiAgICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMucGxvdFZhbHVlIHx8IHRoaXMuZmlsdGVyVmFsdWVTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAgd2lkdGg9e3Bsb3RXaWR0aH1cbiAgICAgICAgICAgICAgaXNSYW5nZWQ9e2lzUmFuZ2VkfVxuICAgICAgICAgICAgICBzdGVwPXtzdGVwfVxuICAgICAgICAgICAgICB0aW1lem9uZT17dGltZXpvbmV9XG4gICAgICAgICAgICAgIHRpbWVGb3JtYXQ9e3RpbWVGb3JtYXR9XG4gICAgICAgICAgICAgIHBsYXliYWNrQ29udHJvbFdpZHRoPXtwbGF5YmFja0NvbnRyb2xXaWR0aH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPFNsaWRlcldyYXBwZXJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImtnLXJhbmdlLXNsaWRlcl9fc2xpZGVyXCJcbiAgICAgICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgICAgICAgIHNob3dJbnB1dD17c2hvd0lucHV0fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnhBeGlzID8gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAnMzBweCd9fT5cbiAgICAgICAgICAgICAgICA8dGhpcy5wcm9wcy54QXhpc1xuICAgICAgICAgICAgICAgICAgd2lkdGg9e3Bsb3RXaWR0aH1cbiAgICAgICAgICAgICAgICAgIHRpbWV6b25lPXt0aW1lem9uZX1cbiAgICAgICAgICAgICAgICAgIGRvbWFpbj17cmFuZ2V9XG4gICAgICAgICAgICAgICAgICBpc0VubGFyZ2VkPXt0aGlzLnByb3BzLmlzRW5sYXJnZWR9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDxTbGlkZXJcbiAgICAgICAgICAgICAgbWFya3M9e3RoaXMucHJvcHMubWFya3N9XG4gICAgICAgICAgICAgIHNob3dWYWx1ZXM9e2ZhbHNlfVxuICAgICAgICAgICAgICBpc1JhbmdlZD17aXNSYW5nZWR9XG4gICAgICAgICAgICAgIG1pblZhbHVlPXtyYW5nZVswXX1cbiAgICAgICAgICAgICAgbWF4VmFsdWU9e3JhbmdlWzFdfVxuICAgICAgICAgICAgICB2YWx1ZTA9e3RoaXMucHJvcHMudmFsdWUwfVxuICAgICAgICAgICAgICB2YWx1ZTE9e3RoaXMucHJvcHMudmFsdWUxfVxuICAgICAgICAgICAgICBzdGVwPXtzdGVwfVxuICAgICAgICAgICAgICBoYW5kbGVXaWR0aD17c2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgICAgIG9uU2xpZGVyMENoYW5nZT17dGhpcy5fc2V0UmFuZ2VWYWwwfVxuICAgICAgICAgICAgICBvblNsaWRlcjFDaGFuZ2U9e3RoaXMuX3NldFJhbmdlVmFsMX1cbiAgICAgICAgICAgICAgb25TbGlkZXJCYXJDaGFuZ2U9eyh2YWwwLCB2YWwxKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoW3ZhbDAsIHZhbDFdKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZW5hYmxlQmFyRHJhZ1xuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHshaXNSYW5nZWQgJiYgc2hvd0lucHV0ID8gdGhpcy5fcmVuZGVySW5wdXQoJ3ZhbHVlMScpIDogbnVsbH1cbiAgICAgICAgICA8L1NsaWRlcldyYXBwZXI+XG4gICAgICAgICAge2lzUmFuZ2VkICYmIHNob3dJbnB1dCA/IChcbiAgICAgICAgICAgIDxSYW5nZUlucHV0V3JhcHBlciBjbGFzc05hbWU9XCJyYW5nZS1zbGlkZXJfX2lucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICAgIHt0aGlzLl9yZW5kZXJJbnB1dCgndmFsdWUwJyl9XG4gICAgICAgICAgICAgIHt0aGlzLl9yZW5kZXJJbnB1dCgndmFsdWUxJyl9XG4gICAgICAgICAgICA8L1JhbmdlSW5wdXRXcmFwcGVyPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcG9seWZpbGwoUmFuZ2VTbGlkZXIpO1xuXG4gIHJldHVybiBSYW5nZVNsaWRlcjtcbn1cbiJdfQ==