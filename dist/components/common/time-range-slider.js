"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TimeRangeSliderFactory;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

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

var _moment = _interopRequireDefault(require("moment"));

var _window = require("global/window");

var _lodash = _interopRequireDefault(require("lodash.throttle"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reselect = require("reselect");

var _icons = require("./icons");

var _styledComponents2 = require("./styled-components");

var _rangeSlider = _interopRequireDefault(require("./range-slider"));

var _timeSliderMarker = _interopRequireDefault(require("./time-slider-marker"));

var _playbackControls = _interopRequireDefault(require("./animation-control/playback-controls"));

var _defaultSettings = require("../../constants/default-settings");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  font-size: 11px;\n  justify-content: ", ";\n\n  .horizontal-bar {\n    padding: 0 12px;\n    color: ", ";\n  }\n\n  .time-value {\n    display: flex;\n    flex-direction: ", ";\n    align-items: flex-start;\n\n    span {\n      color: ", ";\n    }\n  }\n\n  .time-value:last-child {\n    align-items: flex-end;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: flex-end;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n\n  .time-range-slider__control {\n    margin-bottom: 12px;\n    margin-right: 30px;\n  }\n\n  .playback-control-button {\n    padding: 9px 12px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var animationControlWidth = 140;

var StyledSliderContainer = _styledComponents["default"].div(_templateObject());

TimeRangeSliderFactory.deps = [_playbackControls["default"], _rangeSlider["default"]];

function TimeRangeSliderFactory(PlaybackControls, RangeSlider) {
  var TimeRangeSlider =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(TimeRangeSlider, _Component);

    function TimeRangeSlider(_props) {
      var _this;

      (0, _classCallCheck2["default"])(this, TimeRangeSlider);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TimeRangeSlider).call(this, _props));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "timeSelector", function (props) {
        return props.currentTime;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "formatSelector", function (props) {
        return props.format;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "displayTimeSelector", (0, _reselect.createSelector)(_this.timeSelector, _this.formatSelector, function (currentTime, format) {
        var groupTime = Array.isArray(currentTime) ? currentTime : [currentTime];
        return groupTime.reduce(function (accu, curr) {
          var displayDateTime = _moment["default"].utc(curr).format(format);

          var _displayDateTime$spli = displayDateTime.split(' '),
              _displayDateTime$spli2 = (0, _slicedToArray2["default"])(_displayDateTime$spli, 2),
              displayDate = _displayDateTime$spli2[0],
              displayTime = _displayDateTime$spli2[1];

          if (!accu.displayDate.includes(displayDate)) {
            accu.displayDate.push(displayDate);
          }

          accu.displayTime.push(displayTime);
          return accu;
        }, {
          displayDate: [],
          displayTime: []
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_sliderUpdate", function (args) {
        _this._sliderThrottle.cancel();

        _this._sliderThrottle(args);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_resetAnimation", function () {
        var _this$props = _this.props,
            domain = _this$props.domain,
            value = _this$props.value;
        var value0 = domain[0];
        var value1 = value0 + value[1] - value[0];

        _this.props.onChange([value0, value1]);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_startAnimation", function () {
        _this._pauseAnimation();

        _this.props.toggleAnimation();

        _this.setState({
          isAnimating: true
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_pauseAnimation", function () {
        if (_this._animation) {
          (0, _window.cancelAnimationFrame)(_this._animation);

          _this.props.toggleAnimation();

          _this._animation = null;
        }

        _this.setState({
          isAnimating: false
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_nextFrame", function () {
        _this._animation = null;
        var _this$props2 = _this.props,
            domain = _this$props2.domain,
            value = _this$props2.value;
        var speed = (domain[1] - domain[0]) / _defaultSettings.BASE_SPEED * _this.props.speed; // loop when reaches the end

        var value0 = value[1] + speed > domain[1] ? domain[0] : value[0] + speed;
        var value1 = value0 + value[1] - value[0];

        _this.props.onChange([value0, value1]);
      });
      _this.state = {
        isAnimating: false,
        width: 288
      };
      _this._animation = null;
      _this._sliderThrottle = (0, _lodash["default"])(function () {
        var _this$props3;

        return (_this$props3 = _this.props).onChange.apply(_this$props3, arguments);
      }, 20);
      return _this;
    }

    (0, _createClass2["default"])(TimeRangeSlider, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (!this._animation && this.state.isAnimating) {
          this._animation = (0, _window.requestAnimationFrame)(this._nextFrame);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props4 = this.props,
            domain = _this$props4.domain,
            value = _this$props4.value,
            isEnlarged = _this$props4.isEnlarged,
            hideTimeTitle = _this$props4.hideTimeTitle;
        var isAnimating = this.state.isAnimating;
        return _react["default"].createElement("div", {
          className: "time-range-slider"
        }, !hideTimeTitle ? _react["default"].createElement(TimeTitle, {
          timeFormat: this.props.timeFormat,
          value: value,
          isEnlarged: isEnlarged
        }) : null, _react["default"].createElement(StyledSliderContainer, {
          className: "time-range-slider__container",
          isEnlarged: isEnlarged
        }, isEnlarged ? _react["default"].createElement(PlaybackControls, {
          isAnimatable: this.props.isAnimatable,
          isEnlarged: isEnlarged,
          isAnimating: isAnimating,
          pauseAnimation: this._pauseAnimation,
          resetAnimation: this._resetAnimation,
          startAnimation: this._startAnimation,
          buttonHeight: "12px",
          buttonStyle: "secondary"
        }) : null, _react["default"].createElement("div", {
          style: {
            width: isEnlarged ? "calc(100% - ".concat(animationControlWidth, "px)") : '100%'
          }
        }, _react["default"].createElement(RangeSlider, {
          range: domain,
          value0: value[0],
          value1: value[1],
          histogram: this.props.histogram,
          lineChart: this.props.lineChart,
          plotType: this.props.plotType,
          isEnlarged: isEnlarged,
          showInput: false,
          step: this.props.step,
          onChange: this._sliderUpdate,
          xAxis: _timeSliderMarker["default"]
        }))));
      }
    }]);
    return TimeRangeSlider;
  }(_react.Component);

  (0, _defineProperty2["default"])(TimeRangeSlider, "propTypes", {
    onChange: _propTypes["default"].func.isRequired,
    domain: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
    value: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
    step: _propTypes["default"].number.isRequired,
    plotType: _propTypes["default"].string,
    histogram: _propTypes["default"].arrayOf(_propTypes["default"].any),
    lineChart: _propTypes["default"].object,
    toggleAnimation: _propTypes["default"].func.isRequired,
    isAnimatable: _propTypes["default"].bool,
    isEnlarged: _propTypes["default"].bool,
    speed: _propTypes["default"].number,
    timeFormat: _propTypes["default"].string,
    hideTimeTitle: _propTypes["default"].bool
  });
  TimeRangeSlider.defaultProps = {
    timeFormat: _defaultSettings.DEFAULT_TIME_FORMAT
  };
  return TimeRangeSlider;
}

var TimeValueWrapper = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.isEnlarged ? 'center' : 'space-between';
}, function (props) {
  return props.theme.titleTextColor;
}, function (props) {
  return props.isEnlarged ? 'row' : 'column';
}, function (props) {
  return props.theme.titleTextColor;
});

var TimeTitle = function TimeTitle(_ref) {
  var value = _ref.value,
      isEnlarged = _ref.isEnlarged,
      _ref$timeFormat = _ref.timeFormat,
      timeFormat = _ref$timeFormat === void 0 ? _defaultSettings.DEFAULT_TIME_FORMAT : _ref$timeFormat;
  return _react["default"].createElement(TimeValueWrapper, {
    isEnlarged: isEnlarged,
    className: "time-range-slider__time-title"
  }, _react["default"].createElement(TimeValue, {
    key: 0,
    value: _moment["default"].utc(value[0]).format(timeFormat),
    split: !isEnlarged
  }), isEnlarged ? _react["default"].createElement("div", {
    className: "horizontal-bar"
  }, _react["default"].createElement(_icons.Minus, {
    height: "12px"
  })) : null, _react["default"].createElement(TimeValue, {
    key: 1,
    value: _moment["default"].utc(value[1]).format(timeFormat),
    split: !isEnlarged
  }));
};

var TimeValue = function TimeValue(_ref2) {
  var value = _ref2.value,
      split = _ref2.split;
  return (// render two lines if not enlarged
    _react["default"].createElement("div", {
      className: "time-value"
    }, split ? value.split(' ').map(function (v, i) {
      return _react["default"].createElement("div", {
        key: i
      }, i === 0 ? _react["default"].createElement(_styledComponents2.SelectText, null, v) : _react["default"].createElement(_styledComponents2.SelectTextBold, null, v));
    }) : _react["default"].createElement(_styledComponents2.SelectTextBold, null, value))
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlci5qcyJdLCJuYW1lcyI6WyJhbmltYXRpb25Db250cm9sV2lkdGgiLCJTdHlsZWRTbGlkZXJDb250YWluZXIiLCJzdHlsZWQiLCJkaXYiLCJUaW1lUmFuZ2VTbGlkZXJGYWN0b3J5IiwiZGVwcyIsIlBsYXliYWNrQ29udHJvbHNGYWN0b3J5IiwiUmFuZ2VTbGlkZXJGYWN0b3J5IiwiUGxheWJhY2tDb250cm9scyIsIlJhbmdlU2xpZGVyIiwiVGltZVJhbmdlU2xpZGVyIiwicHJvcHMiLCJjdXJyZW50VGltZSIsImZvcm1hdCIsInRpbWVTZWxlY3RvciIsImZvcm1hdFNlbGVjdG9yIiwiZ3JvdXBUaW1lIiwiQXJyYXkiLCJpc0FycmF5IiwicmVkdWNlIiwiYWNjdSIsImN1cnIiLCJkaXNwbGF5RGF0ZVRpbWUiLCJtb21lbnQiLCJ1dGMiLCJzcGxpdCIsImRpc3BsYXlEYXRlIiwiZGlzcGxheVRpbWUiLCJpbmNsdWRlcyIsInB1c2giLCJhcmdzIiwiX3NsaWRlclRocm90dGxlIiwiY2FuY2VsIiwiZG9tYWluIiwidmFsdWUiLCJ2YWx1ZTAiLCJ2YWx1ZTEiLCJvbkNoYW5nZSIsIl9wYXVzZUFuaW1hdGlvbiIsInRvZ2dsZUFuaW1hdGlvbiIsInNldFN0YXRlIiwiaXNBbmltYXRpbmciLCJfYW5pbWF0aW9uIiwic3BlZWQiLCJCQVNFX1NQRUVEIiwic3RhdGUiLCJ3aWR0aCIsIl9uZXh0RnJhbWUiLCJpc0VubGFyZ2VkIiwiaGlkZVRpbWVUaXRsZSIsInRpbWVGb3JtYXQiLCJpc0FuaW1hdGFibGUiLCJfcmVzZXRBbmltYXRpb24iLCJfc3RhcnRBbmltYXRpb24iLCJoaXN0b2dyYW0iLCJsaW5lQ2hhcnQiLCJwbG90VHlwZSIsInN0ZXAiLCJfc2xpZGVyVXBkYXRlIiwiVGltZVNsaWRlck1hcmtlciIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsIm51bWJlciIsInN0cmluZyIsImFueSIsIm9iamVjdCIsImJvb2wiLCJkZWZhdWx0UHJvcHMiLCJERUZBVUxUX1RJTUVfRk9STUFUIiwiVGltZVZhbHVlV3JhcHBlciIsInRoZW1lIiwidGl0bGVUZXh0Q29sb3IiLCJUaW1lVGl0bGUiLCJUaW1lVmFsdWUiLCJtYXAiLCJ2IiwiaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsR0FBRyxHQUE5Qjs7QUFFQSxJQUFNQyxxQkFBcUIsR0FBR0MsNkJBQU9DLEdBQVYsbUJBQTNCOztBQWdCQUMsc0JBQXNCLENBQUNDLElBQXZCLEdBQThCLENBQUNDLDRCQUFELEVBQTBCQyx1QkFBMUIsQ0FBOUI7O0FBRWUsU0FBU0gsc0JBQVQsQ0FBZ0NJLGdCQUFoQyxFQUFrREMsV0FBbEQsRUFBK0Q7QUFBQSxNQUN0RUMsZUFEc0U7QUFBQTtBQUFBO0FBQUE7O0FBa0IxRSw2QkFBWUMsTUFBWixFQUFtQjtBQUFBOztBQUFBO0FBQ2pCLDZIQUFNQSxNQUFOO0FBRGlCLHVHQWdCSixVQUFBQSxLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDQyxXQUFWO0FBQUEsT0FoQkQ7QUFBQSx5R0FpQkYsVUFBQUQsS0FBSztBQUFBLGVBQUlBLEtBQUssQ0FBQ0UsTUFBVjtBQUFBLE9BakJIO0FBQUEsOEdBa0JHLDhCQUNwQixNQUFLQyxZQURlLEVBRXBCLE1BQUtDLGNBRmUsRUFHcEIsVUFBQ0gsV0FBRCxFQUFjQyxNQUFkLEVBQXlCO0FBQ3ZCLFlBQU1HLFNBQVMsR0FBR0MsS0FBSyxDQUFDQyxPQUFOLENBQWNOLFdBQWQsSUFBNkJBLFdBQTdCLEdBQTJDLENBQUNBLFdBQUQsQ0FBN0Q7QUFDQSxlQUFPSSxTQUFTLENBQUNH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RlQsS0FESCxDQUNTLEdBRFQsRUFFR29ELEdBRkgsQ0FFTyxVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxhQUNIO0FBQUssUUFBQSxHQUFHLEVBQUVBO0FBQVYsU0FDR0EsQ0FBQyxLQUFLLENBQU4sR0FBVSxnQ0FBQyw2QkFBRCxRQUFhRCxDQUFiLENBQVYsR0FBeUMsZ0NBQUMsaUNBQUQsUUFBaUJBLENBQWpCLENBRDVDLENBREc7QUFBQSxLQUZQLENBREksR0FTSixnQ0FBQyxpQ0FBRCxRQUFpQjVDLEtBQWpCLENBVko7QUFGZ0I7QUFBQSxDQUFsQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7cmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBjYW5jZWxBbmltYXRpb25GcmFtZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoLnRocm90dGxlJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuXG5pbXBvcnQge01pbnVzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge1NlbGVjdFRleHRCb2xkLCBTZWxlY3RUZXh0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmFuZ2VTbGlkZXJGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3JhbmdlLXNsaWRlcic7XG5pbXBvcnQgVGltZVNsaWRlck1hcmtlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi90aW1lLXNsaWRlci1tYXJrZXInO1xuaW1wb3J0IFBsYXliYWNrQ29udHJvbHNGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2FuaW1hdGlvbi1jb250cm9sL3BsYXliYWNrLWNvbnRyb2xzJztcbmltcG9ydCB7QkFTRV9TUEVFRCwgREVGQVVMVF9USU1FX0ZPUk1BVH0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBhbmltYXRpb25Db250cm9sV2lkdGggPSAxNDA7XG5cbmNvbnN0IFN0eWxlZFNsaWRlckNvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gIC50aW1lLXJhbmdlLXNsaWRlcl9fY29udHJvbCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgICBtYXJnaW4tcmlnaHQ6IDMwcHg7XG4gIH1cblxuICAucGxheWJhY2stY29udHJvbC1idXR0b24ge1xuICAgIHBhZGRpbmc6IDlweCAxMnB4O1xuICB9XG5gO1xuXG5UaW1lUmFuZ2VTbGlkZXJGYWN0b3J5LmRlcHMgPSBbUGxheWJhY2tDb250cm9sc0ZhY3RvcnksIFJhbmdlU2xpZGVyRmFjdG9yeV07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRpbWVSYW5nZVNsaWRlckZhY3RvcnkoUGxheWJhY2tDb250cm9scywgUmFuZ2VTbGlkZXIpIHtcbiAgY2xhc3MgVGltZVJhbmdlU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBkb21haW46IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gICAgICB2YWx1ZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgICAgIHN0ZXA6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHBsb3RUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICAgIGxpbmVDaGFydDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIHRvZ2dsZUFuaW1hdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzQW5pbWF0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gICAgICBpc0VubGFyZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIHNwZWVkOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgdGltZUZvcm1hdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGhpZGVUaW1lVGl0bGU6IFByb3BUeXBlcy5ib29sXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcyk7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBpc0FuaW1hdGluZzogZmFsc2UsXG4gICAgICAgIHdpZHRoOiAyODhcbiAgICAgIH07XG4gICAgICB0aGlzLl9hbmltYXRpb24gPSBudWxsO1xuICAgICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUgPSB0aHJvdHRsZSgoLi4udmFsdWUpID0+IHRoaXMucHJvcHMub25DaGFuZ2UoLi4udmFsdWUpLCAyMCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgaWYgKCF0aGlzLl9hbmltYXRpb24gJiYgdGhpcy5zdGF0ZS5pc0FuaW1hdGluZykge1xuICAgICAgICB0aGlzLl9hbmltYXRpb24gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbmV4dEZyYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aW1lU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5jdXJyZW50VGltZTtcbiAgICBmb3JtYXRTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZvcm1hdDtcbiAgICBkaXNwbGF5VGltZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICB0aGlzLnRpbWVTZWxlY3RvcixcbiAgICAgIHRoaXMuZm9ybWF0U2VsZWN0b3IsXG4gICAgICAoY3VycmVudFRpbWUsIGZvcm1hdCkgPT4ge1xuICAgICAgICBjb25zdCBncm91cFRpbWUgPSBBcnJheS5pc0FycmF5KGN1cnJlbnRUaW1lKSA/IGN1cnJlbnRUaW1lIDogW2N1cnJlbnRUaW1lXTtcbiAgICAgICAgcmV0dXJuIGdyb3VwVGltZS5yZWR1Y2UoXG4gICAgICAgICAgKGFjY3UsIGN1cnIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpc3BsYXlEYXRlVGltZSA9IG1vbWVudC51dGMoY3VycikuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgICAgICBjb25zdCBbZGlzcGxheURhdGUsIGRpc3BsYXlUaW1lXSA9IGRpc3BsYXlEYXRlVGltZS5zcGxpdCgnICcpO1xuXG4gICAgICAgICAgICBpZiAoIWFjY3UuZGlzcGxheURhdGUuaW5jbHVkZXMoZGlzcGxheURhdGUpKSB7XG4gICAgICAgICAgICAgIGFjY3UuZGlzcGxheURhdGUucHVzaChkaXNwbGF5RGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2N1LmRpc3BsYXlUaW1lLnB1c2goZGlzcGxheVRpbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtkaXNwbGF5RGF0ZTogW10sIGRpc3BsYXlUaW1lOiBbXX1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgX3NsaWRlclVwZGF0ZSA9IGFyZ3MgPT4ge1xuICAgICAgdGhpcy5fc2xpZGVyVGhyb3R0bGUuY2FuY2VsKCk7XG4gICAgICB0aGlzLl9zbGlkZXJUaHJvdHRsZShhcmdzKTtcbiAgICB9O1xuXG4gICAgX3Jlc2V0QW5pbWF0aW9uID0gKCkgPT4ge1xuICAgICAgY29uc3Qge2RvbWFpbiwgdmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHZhbHVlMCA9IGRvbWFpblswXTtcbiAgICAgIGNvbnN0IHZhbHVlMSA9IHZhbHVlMCArIHZhbHVlWzFdIC0gdmFsdWVbMF07XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKFt2YWx1ZTAsIHZhbHVlMV0pO1xuICAgIH07XG5cbiAgICBfc3RhcnRBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgICB0aGlzLl9wYXVzZUFuaW1hdGlvbigpO1xuICAgICAgdGhpcy5wcm9wcy50b2dnbGVBbmltYXRpb24oKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzQW5pbWF0aW5nOiB0cnVlfSk7XG4gICAgfTtcblxuICAgIF9wYXVzZUFuaW1hdGlvbiA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9hbmltYXRpb24pIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5wcm9wcy50b2dnbGVBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzQW5pbWF0aW5nOiBmYWxzZX0pO1xuICAgIH07XG5cbiAgICBfbmV4dEZyYW1lID0gKCkgPT4ge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcblxuICAgICAgY29uc3Qge2RvbWFpbiwgdmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHNwZWVkID0gKChkb21haW5bMV0gLSBkb21haW5bMF0pIC8gQkFTRV9TUEVFRCkgKiB0aGlzLnByb3BzLnNwZWVkO1xuXG4gICAgICAvLyBsb29wIHdoZW4gcmVhY2hlcyB0aGUgZW5kXG4gICAgICBjb25zdCB2YWx1ZTAgPSB2YWx1ZVsxXSArIHNwZWVkID4gZG9tYWluWzFdID8gZG9tYWluWzBdIDogdmFsdWVbMF0gKyBzcGVlZDtcbiAgICAgIGNvbnN0IHZhbHVlMSA9IHZhbHVlMCArIHZhbHVlWzFdIC0gdmFsdWVbMF07XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKFt2YWx1ZTAsIHZhbHVlMV0pO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7ZG9tYWluLCB2YWx1ZSwgaXNFbmxhcmdlZCwgaGlkZVRpbWVUaXRsZX0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge2lzQW5pbWF0aW5nfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGltZS1yYW5nZS1zbGlkZXJcIj5cbiAgICAgICAgICB7IWhpZGVUaW1lVGl0bGUgPyAoXG4gICAgICAgICAgICA8VGltZVRpdGxlIHRpbWVGb3JtYXQ9e3RoaXMucHJvcHMudGltZUZvcm1hdH0gdmFsdWU9e3ZhbHVlfSBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfSAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDxTdHlsZWRTbGlkZXJDb250YWluZXIgY2xhc3NOYW1lPVwidGltZS1yYW5nZS1zbGlkZXJfX2NvbnRhaW5lclwiIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9PlxuICAgICAgICAgICAge2lzRW5sYXJnZWQgPyAoXG4gICAgICAgICAgICAgIDxQbGF5YmFja0NvbnRyb2xzXG4gICAgICAgICAgICAgICAgaXNBbmltYXRhYmxlPXt0aGlzLnByb3BzLmlzQW5pbWF0YWJsZX1cbiAgICAgICAgICAgICAgICBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfVxuICAgICAgICAgICAgICAgIGlzQW5pbWF0aW5nPXtpc0FuaW1hdGluZ31cbiAgICAgICAgICAgICAgICBwYXVzZUFuaW1hdGlvbj17dGhpcy5fcGF1c2VBbmltYXRpb259XG4gICAgICAgICAgICAgICAgcmVzZXRBbmltYXRpb249e3RoaXMuX3Jlc2V0QW5pbWF0aW9ufVxuICAgICAgICAgICAgICAgIHN0YXJ0QW5pbWF0aW9uPXt0aGlzLl9zdGFydEFuaW1hdGlvbn1cbiAgICAgICAgICAgICAgICBidXR0b25IZWlnaHQ9XCIxMnB4XCJcbiAgICAgICAgICAgICAgICBidXR0b25TdHlsZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogaXNFbmxhcmdlZCA/IGBjYWxjKDEwMCUgLSAke2FuaW1hdGlvbkNvbnRyb2xXaWR0aH1weClgIDogJzEwMCUnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxSYW5nZVNsaWRlclxuICAgICAgICAgICAgICAgIHJhbmdlPXtkb21haW59XG4gICAgICAgICAgICAgICAgdmFsdWUwPXt2YWx1ZVswXX1cbiAgICAgICAgICAgICAgICB2YWx1ZTE9e3ZhbHVlWzFdfVxuICAgICAgICAgICAgICAgIGhpc3RvZ3JhbT17dGhpcy5wcm9wcy5oaXN0b2dyYW19XG4gICAgICAgICAgICAgICAgbGluZUNoYXJ0PXt0aGlzLnByb3BzLmxpbmVDaGFydH1cbiAgICAgICAgICAgICAgICBwbG90VHlwZT17dGhpcy5wcm9wcy5wbG90VHlwZX1cbiAgICAgICAgICAgICAgICBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfVxuICAgICAgICAgICAgICAgIHNob3dJbnB1dD17ZmFsc2V9XG4gICAgICAgICAgICAgICAgc3RlcD17dGhpcy5wcm9wcy5zdGVwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9zbGlkZXJVcGRhdGV9XG4gICAgICAgICAgICAgICAgeEF4aXM9e1RpbWVTbGlkZXJNYXJrZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1N0eWxlZFNsaWRlckNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIFRpbWVSYW5nZVNsaWRlci5kZWZhdWx0UHJvcHMgPSB7XG4gICAgdGltZUZvcm1hdDogREVGQVVMVF9USU1FX0ZPUk1BVFxuICB9O1xuXG4gIHJldHVybiBUaW1lUmFuZ2VTbGlkZXI7XG59XG5cbmNvbnN0IFRpbWVWYWx1ZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmb250LXNpemU6IDExcHg7XG4gIGp1c3RpZnktY29udGVudDogJHtwcm9wcyA9PiAocHJvcHMuaXNFbmxhcmdlZCA/ICdjZW50ZXInIDogJ3NwYWNlLWJldHdlZW4nKX07XG5cbiAgLmhvcml6b250YWwtYmFyIHtcbiAgICBwYWRkaW5nOiAwIDEycHg7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVUZXh0Q29sb3J9O1xuICB9XG5cbiAgLnRpbWUtdmFsdWUge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246ICR7cHJvcHMgPT4gKHByb3BzLmlzRW5sYXJnZWQgPyAncm93JyA6ICdjb2x1bW4nKX07XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG5cbiAgICBzcGFuIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlVGV4dENvbG9yfTtcbiAgICB9XG4gIH1cblxuICAudGltZS12YWx1ZTpsYXN0LWNoaWxkIHtcbiAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gIH1cbmA7XG5cbmNvbnN0IFRpbWVUaXRsZSA9ICh7dmFsdWUsIGlzRW5sYXJnZWQsIHRpbWVGb3JtYXQgPSBERUZBVUxUX1RJTUVfRk9STUFUfSkgPT4gKFxuICA8VGltZVZhbHVlV3JhcHBlciBpc0VubGFyZ2VkPXtpc0VubGFyZ2VkfSBjbGFzc05hbWU9XCJ0aW1lLXJhbmdlLXNsaWRlcl9fdGltZS10aXRsZVwiPlxuICAgIDxUaW1lVmFsdWUga2V5PXswfSB2YWx1ZT17bW9tZW50LnV0Yyh2YWx1ZVswXSkuZm9ybWF0KHRpbWVGb3JtYXQpfSBzcGxpdD17IWlzRW5sYXJnZWR9IC8+XG4gICAge2lzRW5sYXJnZWQgPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvcml6b250YWwtYmFyXCI+XG4gICAgICAgIDxNaW51cyBoZWlnaHQ9XCIxMnB4XCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICkgOiBudWxsfVxuICAgIDxUaW1lVmFsdWUga2V5PXsxfSB2YWx1ZT17bW9tZW50LnV0Yyh2YWx1ZVsxXSkuZm9ybWF0KHRpbWVGb3JtYXQpfSBzcGxpdD17IWlzRW5sYXJnZWR9IC8+XG4gIDwvVGltZVZhbHVlV3JhcHBlcj5cbik7XG5cbmNvbnN0IFRpbWVWYWx1ZSA9ICh7dmFsdWUsIHNwbGl0fSkgPT4gKFxuICAvLyByZW5kZXIgdHdvIGxpbmVzIGlmIG5vdCBlbmxhcmdlZFxuICA8ZGl2IGNsYXNzTmFtZT1cInRpbWUtdmFsdWVcIj5cbiAgICB7c3BsaXQgPyAoXG4gICAgICB2YWx1ZVxuICAgICAgICAuc3BsaXQoJyAnKVxuICAgICAgICAubWFwKCh2LCBpKSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2l9PlxuICAgICAgICAgICAge2kgPT09IDAgPyA8U2VsZWN0VGV4dD57dn08L1NlbGVjdFRleHQ+IDogPFNlbGVjdFRleHRCb2xkPnt2fTwvU2VsZWN0VGV4dEJvbGQ+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKVxuICAgICkgOiAoXG4gICAgICA8U2VsZWN0VGV4dEJvbGQ+e3ZhbHVlfTwvU2VsZWN0VGV4dEJvbGQ+XG4gICAgKX1cbiAgPC9kaXY+XG4pO1xuIl19