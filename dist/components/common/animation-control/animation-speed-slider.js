"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = AnimationSpeedSliderFactory;

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

var _rangeSlider = _interopRequireDefault(require("../range-slider"));

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

var _defaultSettings = require("../../../constants/default-settings");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  bottom: 50px;\n  right: calc(0% - 32px);\n  width: 180px;\n  padding: 2px 8px 2px 12px;\n  background-color: ", ";\n  box-shadow: -2px -2px 0 0 rgba(0, 0, 0, 0.1);\n  .kg-range-slider__input {\n    width: 36px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var SliderWrapper = _styledComponents["default"].div(_templateObject());

var SpeedSliderContainer = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.panelBackground;
});

AnimationSpeedSliderFactory.deps = [_rangeSlider["default"]];

function AnimationSpeedSliderFactory(RangeSlider) {
  var AnimationSpeedSlider =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(AnimationSpeedSlider, _Component);

    function AnimationSpeedSlider() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, AnimationSpeedSlider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(AnimationSpeedSlider)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
        _this.props.onHide();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onChange", function (v) {
        return _this.props.updateAnimationSpeed(v[1]);
      });
      return _this;
    }

    (0, _createClass2["default"])(AnimationSpeedSlider, [{
      key: "render",
      value: function render() {
        return _react["default"].createElement(SpeedSliderContainer, {
          className: "animation-control__speed-slider"
        }, _react["default"].createElement(SliderWrapper, null, _react["default"].createElement(RangeSlider, {
          range: _defaultSettings.SPEED_CONTROL_RANGE,
          step: 0.01,
          value0: 0,
          value1: this.props.speed,
          onChange: this._onChange,
          isRanged: false,
          showTooltip: true,
          showInput: true,
          inputTheme: "secondary",
          inputSize: "tiny"
        })));
      }
    }]);
    return AnimationSpeedSlider;
  }(_react.Component);

  return (0, _reactOnclickoutside["default"])(AnimationSpeedSlider);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hbmltYXRpb24tY29udHJvbC9hbmltYXRpb24tc3BlZWQtc2xpZGVyLmpzIl0sIm5hbWVzIjpbIlNsaWRlcldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJTcGVlZFNsaWRlckNvbnRhaW5lciIsInByb3BzIiwidGhlbWUiLCJwYW5lbEJhY2tncm91bmQiLCJBbmltYXRpb25TcGVlZFNsaWRlckZhY3RvcnkiLCJkZXBzIiwiUmFuZ2VTbGlkZXJGYWN0b3J5IiwiUmFuZ2VTbGlkZXIiLCJBbmltYXRpb25TcGVlZFNsaWRlciIsImUiLCJvbkhpZGUiLCJ2IiwidXBkYXRlQW5pbWF0aW9uU3BlZWQiLCJTUEVFRF9DT05UUk9MX1JBTkdFIiwic3BlZWQiLCJfb25DaGFuZ2UiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGFBQWEsR0FBR0MsNkJBQU9DLEdBQVYsbUJBQW5COztBQUlBLElBQU1DLG9CQUFvQixHQUFHRiw2QkFBT0MsR0FBVixxQkFNSixVQUFBRSxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLGVBQWhCO0FBQUEsQ0FORCxDQUExQjs7QUFhQUMsMkJBQTJCLENBQUNDLElBQTVCLEdBQW1DLENBQUNDLHVCQUFELENBQW5DOztBQUVlLFNBQVNGLDJCQUFULENBQXFDRyxXQUFyQyxFQUFrRDtBQUFBLE1BQ3pEQyxvQkFEeUQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSw2R0FFeEMsVUFBQUMsQ0FBQyxFQUFJO0FBQ3hCLGNBQUtSLEtBQUwsQ0FBV1MsTUFBWDtBQUNELE9BSjREO0FBQUEsb0dBTWpELFVBQUFDLENBQUM7QUFBQSxlQUFJLE1BQUtWLEtBQUwsQ0FBV1csb0JBQVgsQ0FBZ0NELENBQUMsQ0FBQyxDQUFELENBQWpDLENBQUo7QUFBQSxPQU5nRDtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLCtCQVFwRDtBQUNQLGVBQ0UsZ0NBQUMsb0JBQUQ7QUFBc0IsVUFBQSxTQUFTLEVBQUM7QUFBaEMsV0FDRSxnQ0FBQyxhQUFELFFBQ0UsZ0NBQUMsV0FBRDtBQUNFLFVBQUEsS0FBSyxFQUFFRSxvQ0FEVDtBQUVFLFVBQUEsSUFBSSxFQUFFLElBRlI7QUFHRSxVQUFBLE1BQU0sRUFBRSxDQUhWO0FBSUUsVUFBQSxNQUFNLEVBQUUsS0FBS1osS0FBTCxDQUFXYSxLQUpyQjtBQUtFLFVBQUEsUUFBUSxFQUFFLEtBQUtDLFNBTGpCO0FBTUUsVUFBQSxRQUFRLEVBQUUsS0FOWjtBQU9FLFVBQUEsV0FBVyxNQVBiO0FBUUUsVUFBQSxTQUFTLE1BUlg7QUFTRSxVQUFBLFVBQVUsRUFBQyxXQVRiO0FBVUUsVUFBQSxTQUFTLEVBQUM7QUFWWixVQURGLENBREYsQ0FERjtBQWtCRDtBQTNCNEQ7QUFBQTtBQUFBLElBQzVCQyxnQkFENEI7O0FBOEIvRCxTQUFPLHFDQUFlUixvQkFBZixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFJhbmdlU2xpZGVyRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXInO1xuaW1wb3J0IG9uQ2xpY2tPdXRzaWRlIGZyb20gJ3JlYWN0LW9uY2xpY2tvdXRzaWRlJztcbmltcG9ydCB7U1BFRURfQ09OVFJPTF9SQU5HRX0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBTbGlkZXJXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuYDtcblxuY29uc3QgU3BlZWRTbGlkZXJDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogNTBweDtcbiAgcmlnaHQ6IGNhbGMoMCUgLSAzMnB4KTtcbiAgd2lkdGg6IDE4MHB4O1xuICBwYWRkaW5nOiAycHggOHB4IDJweCAxMnB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIGJveC1zaGFkb3c6IC0ycHggLTJweCAwIDAgcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAua2ctcmFuZ2Utc2xpZGVyX19pbnB1dCB7XG4gICAgd2lkdGg6IDM2cHg7XG4gIH1cbmA7XG5cbkFuaW1hdGlvblNwZWVkU2xpZGVyRmFjdG9yeS5kZXBzID0gW1JhbmdlU2xpZGVyRmFjdG9yeV07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFuaW1hdGlvblNwZWVkU2xpZGVyRmFjdG9yeShSYW5nZVNsaWRlcikge1xuICBjbGFzcyBBbmltYXRpb25TcGVlZFNsaWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgaGFuZGxlQ2xpY2tPdXRzaWRlID0gZSA9PiB7XG4gICAgICB0aGlzLnByb3BzLm9uSGlkZSgpO1xuICAgIH07XG5cbiAgICBfb25DaGFuZ2UgPSB2ID0+IHRoaXMucHJvcHMudXBkYXRlQW5pbWF0aW9uU3BlZWQodlsxXSk7XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3BlZWRTbGlkZXJDb250YWluZXIgY2xhc3NOYW1lPVwiYW5pbWF0aW9uLWNvbnRyb2xfX3NwZWVkLXNsaWRlclwiPlxuICAgICAgICAgIDxTbGlkZXJXcmFwcGVyPlxuICAgICAgICAgICAgPFJhbmdlU2xpZGVyXG4gICAgICAgICAgICAgIHJhbmdlPXtTUEVFRF9DT05UUk9MX1JBTkdFfVxuICAgICAgICAgICAgICBzdGVwPXswLjAxfVxuICAgICAgICAgICAgICB2YWx1ZTA9ezB9XG4gICAgICAgICAgICAgIHZhbHVlMT17dGhpcy5wcm9wcy5zcGVlZH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlfVxuICAgICAgICAgICAgICBpc1JhbmdlZD17ZmFsc2V9XG4gICAgICAgICAgICAgIHNob3dUb29sdGlwXG4gICAgICAgICAgICAgIHNob3dJbnB1dFxuICAgICAgICAgICAgICBpbnB1dFRoZW1lPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgaW5wdXRTaXplPVwidGlueVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU2xpZGVyV3JhcHBlcj5cbiAgICAgICAgPC9TcGVlZFNsaWRlckNvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9uQ2xpY2tPdXRzaWRlKEFuaW1hdGlvblNwZWVkU2xpZGVyKTtcbn1cbiJdfQ==