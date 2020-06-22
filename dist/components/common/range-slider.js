"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RangeSliderFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _rangePlot = _interopRequireDefault(require("./range-plot"));

var _slider = _interopRequireDefault(require("./slider/slider"));

var _styledComponents2 = require("./styled-components");

var _dataUtils = require("../../utils/data-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 6px;\n  display: flex;\n  justify-content: space-between;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  position: relative;\n  align-items: center;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: ", "px;\n  margin-left: ", "px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var SliderInput = (0, _styledComponents["default"])(_styledComponents2.Input)(_templateObject(), function (props) {
  return props.theme.sliderInputWidth;
}, function (props) {
  return props.flush ? 0 : props.size === 'tiny' ? 12 : 18;
});

var SliderWrapper = _styledComponents["default"].div(_templateObject2());

var RangeInputWrapper = _styledComponents["default"].div(_templateObject3());

RangeSliderFactory.deps = [_rangePlot["default"]];

function RangeSliderFactory(RangePlot) {
  var RangeSlider =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(RangeSlider, _Component);

    function RangeSlider() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, RangeSlider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(RangeSlider)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        value0: 0,
        value1: 1,
        prevValue0: 0,
        prevValue1: 1,
        width: 288
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "sliderContainer", (0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "inputValue0", (0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "inputValue1", (0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_isVal0InRange", function (val) {
        var _this$props = _this.props,
            value1 = _this$props.value1,
            range = _this$props.range;
        return Boolean(val >= range[0] && val <= value1);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_isVal1InRange", function (val) {
        var _this$props2 = _this.props,
            range = _this$props2.range,
            value0 = _this$props2.value0;
        return Boolean(val <= range[1] && val >= value0);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_roundValToStep", function (val) {
        var _this$props3 = _this.props,
            range = _this$props3.range,
            step = _this$props3.step;
        return (0, _dataUtils.roundValToStep)(range[0], step, val);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_setRangeVal1", function (val) {
        var _this$props4 = _this.props,
            value0 = _this$props4.value0,
            onChange = _this$props4.onChange;
        val = Number(val);

        if (_this._isVal1InRange(val)) {
          onChange([value0, _this._roundValToStep(val)]);
          return true;
        }

        return false;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_setRangeVal0", function (val) {
        var _this$props5 = _this.props,
            value1 = _this$props5.value1,
            onChange = _this$props5.onChange;
        var val0 = Number(val);

        if (_this._isVal0InRange(val0)) {
          onChange([_this._roundValToStep(val0), value1]);
          return true;
        }

        return false;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onChangeInput", function (key, e) {
        _this.setState((0, _defineProperty2["default"])({}, key, e.target.value));
      });
      return _this;
    }

    (0, _createClass2["default"])(RangeSlider, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._resize();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        this._resize();
      }
    }, {
      key: "_resize",
      value: function _resize() {
        var width = this.sliderContainer.current.offsetWidth;

        if (width !== this.state.width) {
          this.setState({
            width: width
          });
        }
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

        return _react["default"].createElement(SliderInput, {
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
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$props6 = this.props,
            isRanged = _this$props6.isRanged,
            showInput = _this$props6.showInput,
            histogram = _this$props6.histogram,
            lineChart = _this$props6.lineChart,
            plotType = _this$props6.plotType,
            isEnlarged = _this$props6.isEnlarged,
            range = _this$props6.range,
            onChange = _this$props6.onChange,
            value0 = _this$props6.value0,
            value1 = _this$props6.value1,
            sliderHandleWidth = _this$props6.sliderHandleWidth,
            step = _this$props6.step;
        var height = isRanged && showInput ? '16px' : '24px';
        var width = this.state.width;
        var plotWidth = Math.max(width - sliderHandleWidth, 0);
        return _react["default"].createElement("div", {
          className: "kg-range-slider",
          style: {
            width: '100%',
            padding: "0 ".concat(sliderHandleWidth / 2, "px")
          },
          ref: this.sliderContainer
        }, histogram && histogram.length ? _react["default"].createElement(RangePlot, {
          histogram: histogram,
          lineChart: lineChart,
          plotType: plotType,
          isEnlarged: isEnlarged,
          onBrush: function onBrush(val0, val1) {
            onChange([_this3._roundValToStep(val0), _this3._roundValToStep(val1)]);
          },
          range: range,
          value: [value0, value1],
          width: plotWidth
        }) : null, _react["default"].createElement(SliderWrapper, {
          style: {
            height: height
          },
          className: "kg-range-slider__slider"
        }, this.props.xAxis ? _react["default"].createElement(this.props.xAxis, {
          width: plotWidth,
          domain: range
        }) : null, _react["default"].createElement(_slider["default"], {
          showValues: false,
          isRanged: isRanged,
          minValue: range[0],
          maxValue: range[1],
          value0: value0,
          value1: value1,
          step: step,
          handleWidth: sliderHandleWidth,
          onSlider0Change: this._setRangeVal0,
          onSlider1Change: this._setRangeVal1,
          onSliderBarChange: function onSliderBarChange(val0, val1) {
            onChange([val0, val1]);
          },
          enableBarDrag: true
        }), !isRanged && showInput ? this._renderInput('value1') : null), isRanged && showInput ? _react["default"].createElement(RangeInputWrapper, {
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
          update = _objectSpread({}, update || {}, {
            value0: value0,
            prevValue0: value0
          });
        }

        if (props.value1 !== state.prevValue1 && !isNaN(value1)) {
          update = _objectSpread({}, update || {}, {
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
    range: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
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
    xAxis: _propTypes["default"].func
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOlsiU2xpZGVySW5wdXQiLCJJbnB1dCIsInByb3BzIiwidGhlbWUiLCJzbGlkZXJJbnB1dFdpZHRoIiwiZmx1c2giLCJzaXplIiwiU2xpZGVyV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIlJhbmdlSW5wdXRXcmFwcGVyIiwiUmFuZ2VTbGlkZXJGYWN0b3J5IiwiZGVwcyIsIlJhbmdlUGxvdEZhY3RvcnkiLCJSYW5nZVBsb3QiLCJSYW5nZVNsaWRlciIsInZhbHVlMCIsInZhbHVlMSIsInByZXZWYWx1ZTAiLCJwcmV2VmFsdWUxIiwid2lkdGgiLCJ2YWwiLCJyYW5nZSIsIkJvb2xlYW4iLCJzdGVwIiwib25DaGFuZ2UiLCJOdW1iZXIiLCJfaXNWYWwxSW5SYW5nZSIsIl9yb3VuZFZhbFRvU3RlcCIsInZhbDAiLCJfaXNWYWwwSW5SYW5nZSIsImtleSIsImUiLCJzZXRTdGF0ZSIsInRhcmdldCIsInZhbHVlIiwiX3Jlc2l6ZSIsInByZXZQcm9wcyIsInByZXZTdGF0ZSIsInNsaWRlckNvbnRhaW5lciIsImN1cnJlbnQiLCJvZmZzZXRXaWR0aCIsInN0YXRlIiwic2V0UmFuZ2UiLCJfc2V0UmFuZ2VWYWwwIiwiX3NldFJhbmdlVmFsMSIsInJlZiIsImlucHV0VmFsdWUwIiwiaW5wdXRWYWx1ZTEiLCJ1cGRhdGUiLCJfb25DaGFuZ2VJbnB1dCIsImJpbmQiLCJibHVyIiwiaW5wdXRTaXplIiwiaW5wdXRUaGVtZSIsImlzUmFuZ2VkIiwic2hvd0lucHV0IiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0IiwicGxvdFR5cGUiLCJpc0VubGFyZ2VkIiwic2xpZGVySGFuZGxlV2lkdGgiLCJoZWlnaHQiLCJwbG90V2lkdGgiLCJNYXRoIiwibWF4IiwicGFkZGluZyIsImxlbmd0aCIsInZhbDEiLCJ4QXhpcyIsIl9yZW5kZXJJbnB1dCIsImlzTmFOIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJmdW5jIiwiYW55IiwiYm9vbCIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxXQUFXLEdBQUcsa0NBQU9DLHdCQUFQLENBQUgsb0JBQ04sVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxnQkFBaEI7QUFBQSxDQURDLEVBRUEsVUFBQUYsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0csS0FBTixHQUFjLENBQWQsR0FBa0JILEtBQUssQ0FBQ0ksSUFBTixLQUFlLE1BQWYsR0FBd0IsRUFBeEIsR0FBNkIsRUFBcEQ7QUFBQSxDQUZMLENBQWpCOztBQUtBLElBQU1DLGFBQWEsR0FBR0MsNkJBQU9DLEdBQVYsb0JBQW5COztBQU1BLElBQU1DLGlCQUFpQixHQUFHRiw2QkFBT0MsR0FBVixvQkFBdkI7O0FBTUFFLGtCQUFrQixDQUFDQyxJQUFuQixHQUEwQixDQUFDQyxxQkFBRCxDQUExQjs7QUFFZSxTQUFTRixrQkFBVCxDQUE0QkcsU0FBNUIsRUFBdUM7QUFBQSxNQUM5Q0MsV0FEOEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxnR0F3QzFDO0FBQ05DLFFBQUFBLE1BQU0sRUFBRSxDQURGO0FBRU5DLFFBQUFBLE1BQU0sRUFBRSxDQUZGO0FBR05DLFFBQUFBLFVBQVUsRUFBRSxDQUhOO0FBSU5DLFFBQUFBLFVBQVUsRUFBRSxDQUpOO0FBS05DLFFBQUFBLEtBQUssRUFBRTtBQUxELE9BeEMwQztBQUFBLDBHQXdEaEMsdUJBeERnQztBQUFBLHNHQXlEcEMsdUJBekRvQztBQUFBLHNHQTBEcEMsdUJBMURvQztBQUFB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O0FBSXBCSyxJQUFBQSxpQkFBaUIsRUFBRSxFQUpDO0FBS3BCUCxJQUFBQSxVQUFVLEVBQUUsRUFMUTtBQU1wQkQsSUFBQUEsU0FBUyxFQUFFLE9BTlM7QUFPcEI1QixJQUFBQSxRQUFRLEVBQUUsb0JBQU0sQ0FBRTtBQVBFLEdBbEI0QjtBQXNOcEQsdUNBQVNWLFdBQVQ7QUFFQSxTQUFPQSxXQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtwb2x5ZmlsbH0gZnJvbSAncmVhY3QtbGlmZWN5Y2xlcy1jb21wYXQnO1xuXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmFuZ2VQbG90RmFjdG9yeSBmcm9tICcuL3JhbmdlLXBsb3QnO1xuaW1wb3J0IFNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyJztcbmltcG9ydCB7SW5wdXR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtyb3VuZFZhbFRvU3RlcH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmNvbnN0IFNsaWRlcklucHV0ID0gc3R5bGVkKElucHV0KWBcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVySW5wdXRXaWR0aH1weDtcbiAgbWFyZ2luLWxlZnQ6ICR7cHJvcHMgPT4gKHByb3BzLmZsdXNoID8gMCA6IHByb3BzLnNpemUgPT09ICd0aW55JyA/IDEyIDogMTgpfXB4O1xuYDtcblxuY29uc3QgU2xpZGVyV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmNvbnN0IFJhbmdlSW5wdXRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLXRvcDogNnB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5gO1xuXG5SYW5nZVNsaWRlckZhY3RvcnkuZGVwcyA9IFtSYW5nZVBsb3RGYWN0b3J5XTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmFuZ2VTbGlkZXJGYWN0b3J5KFJhbmdlUGxvdCkge1xuICBjbGFzcyBSYW5nZVNsaWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIHJhbmdlOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuICAgICAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB2YWx1ZTE6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICAgIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgc2hvd0lucHV0OiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGlucHV0VGhlbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBpbnB1dFNpemU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBzdGVwOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgc2xpZGVySGFuZGxlV2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICB4QXhpczogUHJvcFR5cGVzLmZ1bmNcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIGlzRW5sYXJnZWQ6IGZhbHNlLFxuICAgICAgaXNSYW5nZWQ6IHRydWUsXG4gICAgICBzaG93SW5wdXQ6IHRydWUsXG4gICAgICBzbGlkZXJIYW5kbGVXaWR0aDogMTIsXG4gICAgICBpbnB1dFRoZW1lOiAnJyxcbiAgICAgIGlucHV0U2l6ZTogJ3NtYWxsJyxcbiAgICAgIG9uQ2hhbmdlOiAoKSA9PiB7fVxuICAgIH07XG5cbiAgICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgICAgbGV0IHVwZGF0ZSA9IG51bGw7XG4gICAgICBjb25zdCB7dmFsdWUwLCB2YWx1ZTF9ID0gcHJvcHM7XG4gICAgICBpZiAocHJvcHMudmFsdWUwICE9PSBzdGF0ZS5wcmV2VmFsdWUwICYmICFpc05hTih2YWx1ZTApKSB7XG4gICAgICAgIHVwZGF0ZSA9IHsuLi4odXBkYXRlIHx8IHt9KSwgdmFsdWUwLCBwcmV2VmFsdWUwOiB2YWx1ZTB9O1xuICAgICAgfVxuICAgICAgaWYgKHByb3BzLnZhbHVlMSAhPT0gc3RhdGUucHJldlZhbHVlMSAmJiAhaXNOYU4odmFsdWUxKSkge1xuICAgICAgICB1cGRhdGUgPSB7Li4uKHVwZGF0ZSB8fCB7fSksIHZhbHVlMSwgcHJldlZhbHVlMTogdmFsdWUxfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgfVxuXG4gICAgc3RhdGUgPSB7XG4gICAgICB2YWx1ZTA6IDAsXG4gICAgICB2YWx1ZTE6IDEsXG4gICAgICBwcmV2VmFsdWUwOiAwLFxuICAgICAgcHJldlZhbHVlMTogMSxcbiAgICAgIHdpZHRoOiAyODhcbiAgICB9O1xuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB0aGlzLl9yZXNpemUoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNsaWRlckNvbnRhaW5lciA9IGNyZWF0ZVJlZigpO1xuICAgIGlucHV0VmFsdWUwID0gY3JlYXRlUmVmKCk7XG4gICAgaW5wdXRWYWx1ZTEgPSBjcmVhdGVSZWYoKTtcblxuICAgIF9pc1ZhbDBJblJhbmdlID0gdmFsID0+IHtcbiAgICAgIGNvbnN0IHt2YWx1ZTEsIHJhbmdlfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHJldHVybiBCb29sZWFuKHZhbCA+PSByYW5nZVswXSAmJiB2YWwgPD0gdmFsdWUxKTtcbiAgICB9O1xuXG4gICAgX2lzVmFsMUluUmFuZ2UgPSB2YWwgPT4ge1xuICAgICAgY29uc3Qge3JhbmdlLCB2YWx1ZTB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgcmV0dXJuIEJvb2xlYW4odmFsIDw9IHJhbmdlWzFdICYmIHZhbCA+PSB2YWx1ZTApO1xuICAgIH07XG5cbiAgICBfcm91bmRWYWxUb1N0ZXAgPSB2YWwgPT4ge1xuICAgICAgY29uc3Qge3JhbmdlLCBzdGVwfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHJldHVybiByb3VuZFZhbFRvU3RlcChyYW5nZVswXSwgc3RlcCwgdmFsKTtcbiAgICB9O1xuXG4gICAgX3NldFJhbmdlVmFsMSA9IHZhbCA9PiB7XG4gICAgICBjb25zdCB7dmFsdWUwLCBvbkNoYW5nZX0gPSB0aGlzLnByb3BzO1xuICAgICAgdmFsID0gTnVtYmVyKHZhbCk7XG4gICAgICBpZiAodGhpcy5faXNWYWwxSW5SYW5nZSh2YWwpKSB7XG4gICAgICAgIG9uQ2hhbmdlKFt2YWx1ZTAsIHRoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbCldKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIF9zZXRSYW5nZVZhbDAgPSB2YWwgPT4ge1xuICAgICAgY29uc3Qge3ZhbHVlMSwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHZhbDAgPSBOdW1iZXIodmFsKTtcblxuICAgICAgaWYgKHRoaXMuX2lzVmFsMEluUmFuZ2UodmFsMCkpIHtcbiAgICAgICAgb25DaGFuZ2UoW3RoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbDApLCB2YWx1ZTFdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIF9yZXNpemUoKSB7XG4gICAgICBjb25zdCB3aWR0aCA9IHRoaXMuc2xpZGVyQ29udGFpbmVyLmN1cnJlbnQub2Zmc2V0V2lkdGg7XG4gICAgICBpZiAod2lkdGggIT09IHRoaXMuc3RhdGUud2lkdGgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7d2lkdGh9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgX29uQ2hhbmdlSW5wdXQgPSAoa2V5LCBlKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtba2V5XTogZS50YXJnZXQudmFsdWV9KTtcbiAgICB9O1xuXG4gICAgX3JlbmRlcklucHV0KGtleSkge1xuICAgICAgY29uc3Qgc2V0UmFuZ2UgPSBrZXkgPT09ICd2YWx1ZTAnID8gdGhpcy5fc2V0UmFuZ2VWYWwwIDogdGhpcy5fc2V0UmFuZ2VWYWwxO1xuICAgICAgY29uc3QgcmVmID0ga2V5ID09PSAndmFsdWUwJyA/IHRoaXMuaW5wdXRWYWx1ZTAgOiB0aGlzLmlucHV0VmFsdWUxO1xuICAgICAgY29uc3QgdXBkYXRlID0gZSA9PiB7XG4gICAgICAgIGlmICghc2V0UmFuZ2UoZS50YXJnZXQudmFsdWUpKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7W2tleV06IHRoaXMuc3RhdGVba2V5XX0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHRoaXMuX29uQ2hhbmdlSW5wdXQuYmluZCh0aGlzLCBrZXkpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U2xpZGVySW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJrZy1yYW5nZS1zbGlkZXJfX2lucHV0XCJcbiAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICByZWY9e3JlZn1cbiAgICAgICAgICBpZD17YHNsaWRlci1pbnB1dC0ke2tleX1gfVxuICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlW2tleV19XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIG9uS2V5UHJlc3M9e2UgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZShlKTtcbiAgICAgICAgICAgICAgcmVmLmN1cnJlbnQuYmx1cigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25CbHVyPXt1cGRhdGV9XG4gICAgICAgICAgZmx1c2g9e2tleSA9PT0gJ3ZhbHVlMCd9XG4gICAgICAgICAgc2l6ZT17dGhpcy5wcm9wcy5pbnB1dFNpemV9XG4gICAgICAgICAgc2Vjb25kYXJ5PXt0aGlzLnByb3BzLmlucHV0VGhlbWUgPT09ICdzZWNvbmRhcnknfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGlzUmFuZ2VkLFxuICAgICAgICBzaG93SW5wdXQsXG4gICAgICAgIGhpc3RvZ3JhbSxcbiAgICAgICAgbGluZUNoYXJ0LFxuICAgICAgICBwbG90VHlwZSxcbiAgICAgICAgaXNFbmxhcmdlZCxcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIG9uQ2hhbmdlLFxuICAgICAgICB2YWx1ZTAsXG4gICAgICAgIHZhbHVlMSxcbiAgICAgICAgc2xpZGVySGFuZGxlV2lkdGgsXG4gICAgICAgIHN0ZXBcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCBoZWlnaHQgPSBpc1JhbmdlZCAmJiBzaG93SW5wdXQgPyAnMTZweCcgOiAnMjRweCc7XG4gICAgICBjb25zdCB7d2lkdGh9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGNvbnN0IHBsb3RXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0gc2xpZGVySGFuZGxlV2lkdGgsIDApO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwia2ctcmFuZ2Utc2xpZGVyXCJcbiAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJScsIHBhZGRpbmc6IGAwICR7c2xpZGVySGFuZGxlV2lkdGggLyAyfXB4YH19XG4gICAgICAgICAgcmVmPXt0aGlzLnNsaWRlckNvbnRhaW5lcn1cbiAgICAgICAgPlxuICAgICAgICAgIHtoaXN0b2dyYW0gJiYgaGlzdG9ncmFtLmxlbmd0aCA/IChcbiAgICAgICAgICAgIDxSYW5nZVBsb3RcbiAgICAgICAgICAgICAgaGlzdG9ncmFtPXtoaXN0b2dyYW19XG4gICAgICAgICAgICAgIGxpbmVDaGFydD17bGluZUNoYXJ0fVxuICAgICAgICAgICAgICBwbG90VHlwZT17cGxvdFR5cGV9XG4gICAgICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9XG4gICAgICAgICAgICAgIG9uQnJ1c2g9eyh2YWwwLCB2YWwxKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoW3RoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbDApLCB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwxKV0pO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICByYW5nZT17cmFuZ2V9XG4gICAgICAgICAgICAgIHZhbHVlPXtbdmFsdWUwLCB2YWx1ZTFdfVxuICAgICAgICAgICAgICB3aWR0aD17cGxvdFdpZHRofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8U2xpZGVyV3JhcHBlciBzdHlsZT17e2hlaWdodH19IGNsYXNzTmFtZT1cImtnLXJhbmdlLXNsaWRlcl9fc2xpZGVyXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy54QXhpcyA/IDx0aGlzLnByb3BzLnhBeGlzIHdpZHRoPXtwbG90V2lkdGh9IGRvbWFpbj17cmFuZ2V9IC8+IDogbnVsbH1cbiAgICAgICAgICAgIDxTbGlkZXJcbiAgICAgICAgICAgICAgc2hvd1ZhbHVlcz17ZmFsc2V9XG4gICAgICAgICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgICAgICAgICAgbWluVmFsdWU9e3JhbmdlWzBdfVxuICAgICAgICAgICAgICBtYXhWYWx1ZT17cmFuZ2VbMV19XG4gICAgICAgICAgICAgIHZhbHVlMD17dmFsdWUwfVxuICAgICAgICAgICAgICB2YWx1ZTE9e3ZhbHVlMX1cbiAgICAgICAgICAgICAgc3RlcD17c3RlcH1cbiAgICAgICAgICAgICAgaGFuZGxlV2lkdGg9e3NsaWRlckhhbmRsZVdpZHRofVxuICAgICAgICAgICAgICBvblNsaWRlcjBDaGFuZ2U9e3RoaXMuX3NldFJhbmdlVmFsMH1cbiAgICAgICAgICAgICAgb25TbGlkZXIxQ2hhbmdlPXt0aGlzLl9zZXRSYW5nZVZhbDF9XG4gICAgICAgICAgICAgIG9uU2xpZGVyQmFyQ2hhbmdlPXsodmFsMCwgdmFsMSkgPT4ge1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKFt2YWwwLCB2YWwxXSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGVuYWJsZUJhckRyYWdcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7IWlzUmFuZ2VkICYmIHNob3dJbnB1dCA/IHRoaXMuX3JlbmRlcklucHV0KCd2YWx1ZTEnKSA6IG51bGx9XG4gICAgICAgICAgPC9TbGlkZXJXcmFwcGVyPlxuICAgICAgICAgIHtpc1JhbmdlZCAmJiBzaG93SW5wdXQgPyAoXG4gICAgICAgICAgICA8UmFuZ2VJbnB1dFdyYXBwZXIgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyX19pbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgICB7dGhpcy5fcmVuZGVySW5wdXQoJ3ZhbHVlMCcpfVxuICAgICAgICAgICAgICB7dGhpcy5fcmVuZGVySW5wdXQoJ3ZhbHVlMScpfVxuICAgICAgICAgICAgPC9SYW5nZUlucHV0V3JhcHBlcj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHBvbHlmaWxsKFJhbmdlU2xpZGVyKTtcblxuICByZXR1cm4gUmFuZ2VTbGlkZXI7XG59XG4iXX0=