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

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _moment = _interopRequireDefault(require("moment"));

var _window = require("global/window");

var _slider = _interopRequireDefault(require("../slider/slider"));

var _styledComponents2 = require("../styled-components");

var _speedControl = _interopRequireDefault(require("./speed-control"));

var _playbackControls = _interopRequireDefault(require("./playback-controls"));

var _floatingTimeDisplay = _interopRequireDefault(require("./floating-time-display"));

var _defaultSettings = require("../../../constants/default-settings");

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-weight: 400;\n  font-size: 10px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  height: 32px;\n\n  .animation-control__speed-control {\n    margin-right: -10px;\n\n    .animation-control__speed-slider {\n      right: calc(0% - 10px);\n    }\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  position: relative;\n  flex-grow: 1;\n  margin-right: 24px;\n  margin-left: 24px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var SliderWrapper = _styledComponents["default"].div(_templateObject());

var AnimationWidgetInner = _styledComponents["default"].div(_templateObject2());

var StyledDomain = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.titleTextColor;
});

var defaultTimeFormat = 'MM/DD/YY hh:mm:ss';
var BUTTON_HEIGHT = '18px';
AnimationControlFactory.deps = [_speedControl["default"], _playbackControls["default"], _floatingTimeDisplay["default"]];

function AnimationControlFactory(SpeedControl, AnimationPlaybacks, FloatingTimeDisplay) {
  var AnimationControl =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(AnimationControl, _Component);

    function AnimationControl(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, AnimationControl);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AnimationControl).call(this, props));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onSlider1Change", function (val) {
        var domain = _this.props.animationConfig.domain;

        if (val >= domain[0] && val <= domain[1]) {
          _this.props.updateAnimationTime(val);
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateAnimationTime", function () {
        var domain = _this.props.animationConfig.domain;

        _this.props.updateAnimationTime(domain[0]);

        _this._startAnimation();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_startAnimation", function () {
        _this._pauseAnimation();

        _this.setState({
          isAnimating: true
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_nextFrame", function () {
        _this._animation = null;
        var _this$props$animation = _this.props.animationConfig,
            currentTime = _this$props$animation.currentTime,
            domain = _this$props$animation.domain,
            _this$props$animation2 = _this$props$animation.speed,
            speed = _this$props$animation2 === void 0 ? 1 : _this$props$animation2;
        var adjustedSpeed = (domain[1] - domain[0]) / _defaultSettings.BASE_SPEED * speed;
        var nextTime = currentTime + speed > domain[1] ? domain[0] : currentTime + adjustedSpeed;

        _this.props.updateAnimationTime(nextTime);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_pauseAnimation", function () {
        if (_this._animation) {
          (0, _window.cancelAnimationFrame)(_this._animation);
          _this._animation = null;
        }

        _this.setState({
          isAnimating: false
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "toggleSpeedControl", function () {
        _this.setState({
          showSpeedControl: !_this.state.showSpeedControl
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onChange", function () {
        _this.toggleSpeedControl();
      });
      _this.state = {
        isAnimating: false,
        width: 288,
        showSpeedControl: false
      };
      _this._animation = null;
      return _this;
    }

    (0, _createClass2["default"])(AnimationControl, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (!this._animation && this.state.isAnimating) {
          this._animation = (0, _window.requestAnimationFrame)(this._nextFrame);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props$animation3 = this.props.animationConfig,
            currentTime = _this$props$animation3.currentTime,
            domain = _this$props$animation3.domain,
            speed = _this$props$animation3.speed;
        var showSpeedControl = this.state.showSpeedControl;
        return _react["default"].createElement(_styledComponents2.BottomWidgetInner, {
          className: "bottom-widget--inner"
        }, _react["default"].createElement(AnimationWidgetInner, {
          className: "animation-widget--inner"
        }, _react["default"].createElement("div", {
          style: {
            marginLeft: '-10px'
          }
        }, _react["default"].createElement(AnimationPlaybacks, {
          className: "animation-control-playpause",
          startAnimation: this._startAnimation,
          isAnimating: this.state.isAnimating,
          pauseAnimation: this._pauseAnimation,
          resetAnimation: this._resetAnimation,
          buttonHeight: BUTTON_HEIGHT,
          buttonStyle: "link"
        })), _react["default"].createElement(StyledDomain, {
          className: "animation-control__time-domain"
        }, _react["default"].createElement("span", null, _moment["default"].utc(domain[0]).format(defaultTimeFormat))), _react["default"].createElement(SliderWrapper, {
          className: "animation-control__slider"
        }, _react["default"].createElement(_slider["default"], {
          showValues: false,
          isRanged: false,
          minValue: domain ? domain[0] : 0,
          maxValue: domain ? domain[1] : 1,
          value1: currentTime,
          onSlider1Change: this.onSlider1Change,
          enableBarDrag: true
        })), _react["default"].createElement(StyledDomain, {
          className: "animation-control__time-domain"
        }, _react["default"].createElement("span", null, _moment["default"].utc(domain[1]).format(defaultTimeFormat))), _react["default"].createElement("div", {
          className: "animation-control__speed-control"
        }, _react["default"].createElement(SpeedControl, {
          onClick: this.toggleSpeedControl,
          showSpeedControl: showSpeedControl,
          updateAnimationSpeed: this.props.updateAnimationSpeed,
          speed: speed,
          buttonHeight: BUTTON_HEIGHT
        }))), _react["default"].createElement(FloatingTimeDisplay, {
          currentTime: currentTime
        }));
      }
    }]);
    return AnimationControl;
  }(_react.Component);

  AnimationControl.defaultProps = {
    sliderHandleWidth: 12,
    onChange: function onChange() {}
  };
  return AnimationControl;
}

var _default = AnimationControlFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hbmltYXRpb24tY29udHJvbC9hbmltYXRpb24tY29udHJvbC5qcyJdLCJuYW1lcyI6WyJTbGlkZXJXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiQW5pbWF0aW9uV2lkZ2V0SW5uZXIiLCJTdHlsZWREb21haW4iLCJwcm9wcyIsInRoZW1lIiwidGl0bGVUZXh0Q29sb3IiLCJkZWZhdWx0VGltZUZvcm1hdCIsIkJVVFRPTl9IRUlHSFQiLCJBbmltYXRpb25Db250cm9sRmFjdG9yeSIsImRlcHMiLCJTcGVlZENvbnRyb2xGYWN0b3J5IiwiQW5pbWF0aW9uUGxheWJhY2tzRmFjdG9yeSIsIkZsb2F0aW5nVGltZURpc3BsYXlGYWN0b3J5IiwiU3BlZWRDb250cm9sIiwiQW5pbWF0aW9uUGxheWJhY2tzIiwiRmxvYXRpbmdUaW1lRGlzcGxheSIsIkFuaW1hdGlvbkNvbnRyb2wiLCJ2YWwiLCJkb21haW4iLCJhbmltYXRpb25Db25maWciLCJ1cGRhdGVBbmltYXRpb25UaW1lIiwiX3N0YXJ0QW5pbWF0aW9uIiwiX3BhdXNlQW5pbWF0aW9uIiwic2V0U3RhdGUiLCJpc0FuaW1hdGluZyIsIl9hbmltYXRpb24iLCJjdXJyZW50VGltZSIsInNwZWVkIiwiYWRqdXN0ZWRTcGVlZCIsIkJBU0VfU1BFRUQiLCJuZXh0VGltZSIsInNob3dTcGVlZENvbnRyb2wiLCJzdGF0ZSIsInRvZ2dsZVNwZWVkQ29udHJvbCIsIndpZHRoIiwiX25leHRGcmFtZSIsIm1hcmdpbkxlZnQiLCJfcmVzZXRBbmltYXRpb24iLCJtb21lbnQiLCJ1dGMiLCJmb3JtYXQiLCJvblNsaWRlcjFDaGFuZ2UiLCJ1cGRhdGVBbmltYXRpb25TcGVlZCIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyIsInNsaWRlckhhbmRsZVdpZHRoIiwib25DaGFuZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxhQUFhLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUFuQjs7QUFRQSxJQUFNQyxvQkFBb0IsR0FBR0YsNkJBQU9DLEdBQVYsb0JBQTFCOztBQWVBLElBQU1FLFlBQVksR0FBR0gsNkJBQU9DLEdBQVYscUJBQ1AsVUFBQUcsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxjQUFoQjtBQUFBLENBREUsQ0FBbEI7O0FBTUEsSUFBTUMsaUJBQWlCLEdBQUcsbUJBQTFCO0FBQ0EsSUFBTUMsYUFBYSxHQUFHLE1BQXRCO0FBRUFDLHVCQUF1QixDQUFDQyxJQUF4QixHQUErQixDQUM3QkMsd0JBRDZCLEVBRTdCQyw0QkFGNkIsRUFHN0JDLCtCQUg2QixDQUEvQjs7QUFNQSxTQUFTSix1QkFBVCxDQUFpQ0ssWUFBakMsRUFBK0NDLGtCQUEvQyxFQUFtRUMsbUJBQW5FLEVBQXdGO0FBQUEsTUFDaEZDLGdCQURnRjtBQUFBO0FBQUE7QUFBQTs7QUFFcEYsOEJBQVliLEtBQVosRUFBbUI7QUFBQTs7QUFBQTtBQUNqQiw4SEFBTUEsS0FBTjtBQURpQiwwR0FnQkQsVUFBQWMsR0FBRyxFQUFJO0FBQUEsWUFDaEJDLE1BRGdCLEdBQ04sTUFBS2YsS0FBTCxDQUFXZ0IsZUFETCxDQUNoQkQsTUFEZ0I7O0FBRXZCLFlBQUlELEdBQUcsSUFBSUMsTUFBTSxDQUFDLENBQUQsQ0FBYixJQUFvQkQsR0FBRyxJQUFJQyxNQUFNLENBQUMsQ0FBRCxDQUFyQyxFQUEwQztBQUN4QyxnQkFBS2YsS0FBTCxDQUFXaUIsbUJBQVgsQ0FBK0JILEdBQS9CO0FBQ0Q7QUFDRixPQXJCa0I7QUFBQSwrR0F1QkksWUFBTTtBQUFBLFlBQ3BCQyxNQURvQixHQUNWLE1BQUtmLEtBQUwsQ0FBV2dCLGVBREQsQ0FDcEJELE1BRG9COztBQUUzQixjQUFLZixLQUFMLENBQVdpQixtQkFBWCxDQUErQkYsTUFBTSxDQUFDLENBQUQsQ0FBckM7O0FBQ0EsY0FBS0csZUFBTDtBQUNELE9BM0JrQjtBQUFBLDBHQTZCRCxZQUFNO0FBQ3RCLGNBQUtDLGVBQUw7O0FBQ0EsY0FBS0MsUUFBTCxDQUFjO0FBQUNDLFVBQUFBLFdBQVcsRUFBRTtBQUFkLFNBQWQ7QUFDRCxPQWhDa0I7QUFBQSxxR0FrQ04sWUFBTTtBQUNqQixjQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBRGlCLG9DQUV3QixNQUFLdEIsS0FBTCxDQUFXZ0IsZUFGbkM7QUFBQSxZQUVWTyxXQUZVLHlCQUVWQSxXQUZVO0FBQUEsWUFFR1IsTUFGSCx5QkFFR0EsTUFGSDtBQUFBLDJEQUVXUyxLQUZYO0FBQUEsWUFFV0EsS0FGWCx1Q0FFbUIsQ0FGbkI7QUFHakIsWUFBTUMsYUFBYSxHQUFJLENBQUNWLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWUEsTUFBTSxDQUFDLENBQUQsQ0FBbkIsSUFBMEJXLDJCQUEzQixHQUF5Q0YsS0FBL0Q7QUFDQSxZQUFNRyxRQUFRLEdBQUdKLFdBQVcsR0FBR0MsS0FBZCxHQUFzQlQsTUFBTSxDQUFDLENBQUQsQ0FBNUIsR0FBa0NBLE1BQU0sQ0FBQyxDQUFELENBQXhDLEdBQThDUSxXQUFXLEdBQUdFLGFBQTdFOztBQUNBLGNBQUt6QixLQUFMLENBQVdpQixtQkFBWCxDQUErQlUsUUFBL0I7QUFDRCxPQXhDa0I7QUFBQSwwR0EwQ0QsWUFBTTtBQUN0QixZQUFJLE1BQUtMLFVBQVQsRUFBcUI7QUFDbkIsNENBQXFCLE1BQUtBLFVBQTFCO0FBQ0EsZ0JBQUtBLFVBQUwsR0FBa0IsSUFBbEI7QUFDRDs7QUFDRCxjQUFLRixRQUFMLENBQWM7QUFBQ0MsVUFBQUEsV0FBVyxFQUFFO0FBQWQsU0FBZDtBQUNELE9BaERrQjtBQUFBLDZHQWtERSxZQUFNO0FBQ3pCLGNBQUtELFFBQUwsQ0FBYztBQUFDUSxVQUFBQSxnQkFBZ0IsRUFBRSxDQUFDLE1BQUtDLEtBQUwsQ0FBV0Q7QUFBL0IsU0FBZDtBQUNELE9BcERrQjtBQUFBLG1HQXNEUixZQUFNO0FBQ2YsY0FBS0Usa0JBQUw7QUFDRCxPQXhEa0I7QUFFakIsWUFBS0QsS0FBTCxHQUFhO0FBQ1hSLFFBQUFBLFdBQVcsRUFBRSxLQURGO0FBRVhVLFFBQUFBLEtBQUssRUFBRSxHQUZJO0FBR1hILFFBQUFBLGdCQUFnQixFQUFFO0FBSFAsT0FBYjtBQUtBLFlBQUtOLFVBQUwsR0FBa0IsSUFBbEI7QUFQaUI7QUFRbEI7O0FBVm1GO0FBQUE7QUFBQSwyQ0FZL0Q7QUFDbkIsWUFBSSxDQUFDLEtBQUtBLFVBQU4sSUFBb0IsS0FBS08sS0FBTCxDQUFXUixXQUFuQyxFQUFnRDtBQUM5QyxlQUFLQyxVQUFMLEdBQWtCLG1DQUFzQixLQUFLVSxVQUEzQixDQUFsQjtBQUNEO0FBQ0Y7QUFoQm1GO0FBQUE7QUFBQSwrQkE0RDNFO0FBQUEscUNBQzhCLEtBQUtoQyxLQUFMLENBQVdnQixlQUR6QztBQUFBLFlBQ0FPLFdBREEsMEJBQ0FBLFdBREE7QUFBQSxZQUNhUixNQURiLDBCQUNhQSxNQURiO0FBQUEsWUFDcUJTLEtBRHJCLDBCQUNxQkEsS0FEckI7QUFBQSxZQUVBSSxnQkFGQSxHQUVvQixLQUFLQyxLQUZ6QixDQUVBRCxnQkFGQTtBQUlQLGVBQ0UsZ0NBQUMsb0NBQUQ7QUFBbUIsVUFBQSxTQUFTLEVBQUM7QUFBN0IsV0FDRSxnQ0FBQyxvQkFBRDtBQUFzQixVQUFBLFNBQVMsRUFBQztBQUFoQyxXQUNFO0FBQUssVUFBQSxLQUFLLEVBQUU7QUFBQ0ssWUFBQUEsVUFBVSxFQUFFO0FBQWI7QUFBWixXQUNFLGdDQUFDLGtCQUFEO0FBQ0UsVUFBQSxTQUFTLEVBQUMsNkJBRFo7QUFFRSxVQUFBLGNBQWMsRUFBRSxLQUFLZixlQUZ2QjtBQUdFLFVBQUEsV0FBVyxFQUFFLEtBQUtXLEtBQUwsQ0FBV1IsV0FIMUI7QUFJRSxVQUFBLGNBQWMsRUFBRSxLQUFLRixlQUp2QjtBQUtFLFVBQUEsY0FBYyxFQUFFLEtBQUtlLGVBTHZCO0FBTUUsVUFBQSxZQUFZLEVBQUU5QixhQU5oQjtBQU9FLFVBQUEsV0FBVyxFQUFDO0FBUGQsVUFERixDQURGLEVBWUUsZ0NBQUMsWUFBRDtBQUFjLFVBQUEsU0FBUyxFQUFDO0FBQXhCLFdBQ0UsOENBQU8rQixtQkFBT0MsR0FBUCxDQUFXckIsTUFBTSxDQUFDLENBQUQsQ0FBakIsRUFBc0JzQixNQUF0QixDQUE2QmxDLGlCQUE3QixDQUFQLENBREYsQ0FaRixFQWVFLGdDQUFDLGFBQUQ7QUFBZSxVQUFBLFNBQVMsRUFBQztBQUF6QixXQUNFLGdDQUFDLGtCQUFEO0FBQ0UsVUFBQSxVQUFVLEVBQUUsS0FEZDtBQUVFLFVBQUEsUUFBUSxFQUFFLEtBRlo7QUFHRSxVQUFBLFFBQVEsRUFBRVksTUFBTSxHQUFHQSxNQUFNLENBQUMsQ0FBRCxDQUFULEdBQWUsQ0FIakM7QUFJRSxVQUFBLFFBQVEsRUFBRUEsTUFBTSxHQUFHQSxNQUFNLENBQUMsQ0FBRCxDQUFULEdBQWUsQ0FKakM7QUFLRSxVQUFBLE1BQU0sRUFBRVEsV0FMVjtBQU1FLFVBQUEsZUFBZSxFQUFFLEtBQUtlLGVBTnhCO0FBT0UsVUFBQSxhQUFhLEVBQUU7QUFQakIsVUFERixDQWZGLEVBMEJFLGdDQUFDLFlBQUQ7QUFBYyxVQUFBLFNBQVMsRUFBQztBQUF4QixXQUNFLDhDQUFPSCxtQkFBT0MsR0FBUCxDQUFXckIsTUFBTSxDQUFDLENBQUQsQ0FBakIsRUFBc0JzQixNQUF0QixDQUE2QmxDLGlCQUE3QixDQUFQLENBREYsQ0ExQkYsRUE2QkU7QUFBSyxVQUFBLFNBQVMsRUFBQztBQUFmLFdBQ0UsZ0NBQUMsWUFBRDtBQUNFLFVBQUEsT0FBTyxFQUFFLEtBQUsyQixrQkFEaEI7QUFFRSxVQUFBLGdCQUFnQixFQUFFRixnQkFGcEI7QUFHRSxVQUFBLG9CQUFvQixFQUFFLEtBQUs1QixLQUFMLENBQVd1QyxvQkFIbkM7QUFJRSxVQUFBLEtBQUssRUFBRWYsS0FKVDtBQUtFLFVBQUEsWUFBWSxFQUFFcEI7QUFMaEIsVUFERixDQTdCRixDQURGLEVBd0NFLGdDQUFDLG1CQUFEO0FBQXFCLFVBQUEsV0FBVyxFQUFFbUI7QUFBbEMsVUF4Q0YsQ0FERjtBQTRDRDtBQTVHbUY7QUFBQTtBQUFBLElBQ3ZEaUIsZ0JBRHVEOztBQStHdEYzQixFQUFBQSxnQkFBZ0IsQ0FBQzRCLFlBQWpCLEdBQWdDO0FBQzlCQyxJQUFBQSxpQkFBaUIsRUFBRSxFQURXO0FBRTlCQyxJQUFBQSxRQUFRLEVBQUUsb0JBQU0sQ0FBRTtBQUZZLEdBQWhDO0FBS0EsU0FBTzlCLGdCQUFQO0FBQ0Q7O2VBRWNSLHVCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7cmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBjYW5jZWxBbmltYXRpb25GcmFtZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCBTbGlkZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vc2xpZGVyL3NsaWRlcic7XG5pbXBvcnQge0JvdHRvbVdpZGdldElubmVyfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgU3BlZWRDb250cm9sRmFjdG9yeSBmcm9tICcuL3NwZWVkLWNvbnRyb2wnO1xuaW1wb3J0IEFuaW1hdGlvblBsYXliYWNrc0ZhY3RvcnkgZnJvbSAnLi9wbGF5YmFjay1jb250cm9scyc7XG5pbXBvcnQgRmxvYXRpbmdUaW1lRGlzcGxheUZhY3RvcnkgZnJvbSAnLi9mbG9hdGluZy10aW1lLWRpc3BsYXknO1xuaW1wb3J0IHtCQVNFX1NQRUVEfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IFNsaWRlcldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGZsZXgtZ3JvdzogMTtcbiAgbWFyZ2luLXJpZ2h0OiAyNHB4O1xuICBtYXJnaW4tbGVmdDogMjRweDtcbmA7XG5cbmNvbnN0IEFuaW1hdGlvbldpZGdldElubmVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDMycHg7XG5cbiAgLmFuaW1hdGlvbi1jb250cm9sX19zcGVlZC1jb250cm9sIHtcbiAgICBtYXJnaW4tcmlnaHQ6IC0xMHB4O1xuXG4gICAgLmFuaW1hdGlvbi1jb250cm9sX19zcGVlZC1zbGlkZXIge1xuICAgICAgcmlnaHQ6IGNhbGMoMCUgLSAxMHB4KTtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZERvbWFpbiA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlVGV4dENvbG9yfTtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgZm9udC1zaXplOiAxMHB4O1xuYDtcblxuY29uc3QgZGVmYXVsdFRpbWVGb3JtYXQgPSAnTU0vREQvWVkgaGg6bW06c3MnO1xuY29uc3QgQlVUVE9OX0hFSUdIVCA9ICcxOHB4JztcblxuQW5pbWF0aW9uQ29udHJvbEZhY3RvcnkuZGVwcyA9IFtcbiAgU3BlZWRDb250cm9sRmFjdG9yeSxcbiAgQW5pbWF0aW9uUGxheWJhY2tzRmFjdG9yeSxcbiAgRmxvYXRpbmdUaW1lRGlzcGxheUZhY3Rvcnlcbl07XG5cbmZ1bmN0aW9uIEFuaW1hdGlvbkNvbnRyb2xGYWN0b3J5KFNwZWVkQ29udHJvbCwgQW5pbWF0aW9uUGxheWJhY2tzLCBGbG9hdGluZ1RpbWVEaXNwbGF5KSB7XG4gIGNsYXNzIEFuaW1hdGlvbkNvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcyk7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBpc0FuaW1hdGluZzogZmFsc2UsXG4gICAgICAgIHdpZHRoOiAyODgsXG4gICAgICAgIHNob3dTcGVlZENvbnRyb2w6IGZhbHNlXG4gICAgICB9O1xuICAgICAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICBpZiAoIXRoaXMuX2FuaW1hdGlvbiAmJiB0aGlzLnN0YXRlLmlzQW5pbWF0aW5nKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9uZXh0RnJhbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9uU2xpZGVyMUNoYW5nZSA9IHZhbCA9PiB7XG4gICAgICBjb25zdCB7ZG9tYWlufSA9IHRoaXMucHJvcHMuYW5pbWF0aW9uQ29uZmlnO1xuICAgICAgaWYgKHZhbCA+PSBkb21haW5bMF0gJiYgdmFsIDw9IGRvbWFpblsxXSkge1xuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZUFuaW1hdGlvblRpbWUodmFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3VwZGF0ZUFuaW1hdGlvblRpbWUgPSAoKSA9PiB7XG4gICAgICBjb25zdCB7ZG9tYWlufSA9IHRoaXMucHJvcHMuYW5pbWF0aW9uQ29uZmlnO1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGVBbmltYXRpb25UaW1lKGRvbWFpblswXSk7XG4gICAgICB0aGlzLl9zdGFydEFuaW1hdGlvbigpO1xuICAgIH07XG5cbiAgICBfc3RhcnRBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgICB0aGlzLl9wYXVzZUFuaW1hdGlvbigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNBbmltYXRpbmc6IHRydWV9KTtcbiAgICB9O1xuXG4gICAgX25leHRGcmFtZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvbiA9IG51bGw7XG4gICAgICBjb25zdCB7Y3VycmVudFRpbWUsIGRvbWFpbiwgc3BlZWQgPSAxfSA9IHRoaXMucHJvcHMuYW5pbWF0aW9uQ29uZmlnO1xuICAgICAgY29uc3QgYWRqdXN0ZWRTcGVlZCA9ICgoZG9tYWluWzFdIC0gZG9tYWluWzBdKSAvIEJBU0VfU1BFRUQpICogc3BlZWQ7XG4gICAgICBjb25zdCBuZXh0VGltZSA9IGN1cnJlbnRUaW1lICsgc3BlZWQgPiBkb21haW5bMV0gPyBkb21haW5bMF0gOiBjdXJyZW50VGltZSArIGFkanVzdGVkU3BlZWQ7XG4gICAgICB0aGlzLnByb3BzLnVwZGF0ZUFuaW1hdGlvblRpbWUobmV4dFRpbWUpO1xuICAgIH07XG5cbiAgICBfcGF1c2VBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fYW5pbWF0aW9uKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc0FuaW1hdGluZzogZmFsc2V9KTtcbiAgICB9O1xuXG4gICAgdG9nZ2xlU3BlZWRDb250cm9sID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1NwZWVkQ29udHJvbDogIXRoaXMuc3RhdGUuc2hvd1NwZWVkQ29udHJvbH0pO1xuICAgIH07XG5cbiAgICBvbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlU3BlZWRDb250cm9sKCk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtjdXJyZW50VGltZSwgZG9tYWluLCBzcGVlZH0gPSB0aGlzLnByb3BzLmFuaW1hdGlvbkNvbmZpZztcbiAgICAgIGNvbnN0IHtzaG93U3BlZWRDb250cm9sfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxCb3R0b21XaWRnZXRJbm5lciBjbGFzc05hbWU9XCJib3R0b20td2lkZ2V0LS1pbm5lclwiPlxuICAgICAgICAgIDxBbmltYXRpb25XaWRnZXRJbm5lciBjbGFzc05hbWU9XCJhbmltYXRpb24td2lkZ2V0LS1pbm5lclwiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkxlZnQ6ICctMTBweCd9fT5cbiAgICAgICAgICAgICAgPEFuaW1hdGlvblBsYXliYWNrc1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFuaW1hdGlvbi1jb250cm9sLXBsYXlwYXVzZVwiXG4gICAgICAgICAgICAgICAgc3RhcnRBbmltYXRpb249e3RoaXMuX3N0YXJ0QW5pbWF0aW9ufVxuICAgICAgICAgICAgICAgIGlzQW5pbWF0aW5nPXt0aGlzLnN0YXRlLmlzQW5pbWF0aW5nfVxuICAgICAgICAgICAgICAgIHBhdXNlQW5pbWF0aW9uPXt0aGlzLl9wYXVzZUFuaW1hdGlvbn1cbiAgICAgICAgICAgICAgICByZXNldEFuaW1hdGlvbj17dGhpcy5fcmVzZXRBbmltYXRpb259XG4gICAgICAgICAgICAgICAgYnV0dG9uSGVpZ2h0PXtCVVRUT05fSEVJR0hUfVxuICAgICAgICAgICAgICAgIGJ1dHRvblN0eWxlPVwibGlua1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxTdHlsZWREb21haW4gY2xhc3NOYW1lPVwiYW5pbWF0aW9uLWNvbnRyb2xfX3RpbWUtZG9tYWluXCI+XG4gICAgICAgICAgICAgIDxzcGFuPnttb21lbnQudXRjKGRvbWFpblswXSkuZm9ybWF0KGRlZmF1bHRUaW1lRm9ybWF0KX08L3NwYW4+XG4gICAgICAgICAgICA8L1N0eWxlZERvbWFpbj5cbiAgICAgICAgICAgIDxTbGlkZXJXcmFwcGVyIGNsYXNzTmFtZT1cImFuaW1hdGlvbi1jb250cm9sX19zbGlkZXJcIj5cbiAgICAgICAgICAgICAgPFNsaWRlclxuICAgICAgICAgICAgICAgIHNob3dWYWx1ZXM9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIGlzUmFuZ2VkPXtmYWxzZX1cbiAgICAgICAgICAgICAgICBtaW5WYWx1ZT17ZG9tYWluID8gZG9tYWluWzBdIDogMH1cbiAgICAgICAgICAgICAgICBtYXhWYWx1ZT17ZG9tYWluID8gZG9tYWluWzFdIDogMX1cbiAgICAgICAgICAgICAgICB2YWx1ZTE9e2N1cnJlbnRUaW1lfVxuICAgICAgICAgICAgICAgIG9uU2xpZGVyMUNoYW5nZT17dGhpcy5vblNsaWRlcjFDaGFuZ2V9XG4gICAgICAgICAgICAgICAgZW5hYmxlQmFyRHJhZz17dHJ1ZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvU2xpZGVyV3JhcHBlcj5cbiAgICAgICAgICAgIDxTdHlsZWREb21haW4gY2xhc3NOYW1lPVwiYW5pbWF0aW9uLWNvbnRyb2xfX3RpbWUtZG9tYWluXCI+XG4gICAgICAgICAgICAgIDxzcGFuPnttb21lbnQudXRjKGRvbWFpblsxXSkuZm9ybWF0KGRlZmF1bHRUaW1lRm9ybWF0KX08L3NwYW4+XG4gICAgICAgICAgICA8L1N0eWxlZERvbWFpbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYW5pbWF0aW9uLWNvbnRyb2xfX3NwZWVkLWNvbnRyb2xcIj5cbiAgICAgICAgICAgICAgPFNwZWVkQ29udHJvbFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlU3BlZWRDb250cm9sfVxuICAgICAgICAgICAgICAgIHNob3dTcGVlZENvbnRyb2w9e3Nob3dTcGVlZENvbnRyb2x9XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5pbWF0aW9uU3BlZWQ9e3RoaXMucHJvcHMudXBkYXRlQW5pbWF0aW9uU3BlZWR9XG4gICAgICAgICAgICAgICAgc3BlZWQ9e3NwZWVkfVxuICAgICAgICAgICAgICAgIGJ1dHRvbkhlaWdodD17QlVUVE9OX0hFSUdIVH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvQW5pbWF0aW9uV2lkZ2V0SW5uZXI+XG4gICAgICAgICAgPEZsb2F0aW5nVGltZURpc3BsYXkgY3VycmVudFRpbWU9e2N1cnJlbnRUaW1lfSAvPlxuICAgICAgICA8L0JvdHRvbVdpZGdldElubmVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBBbmltYXRpb25Db250cm9sLmRlZmF1bHRQcm9wcyA9IHtcbiAgICBzbGlkZXJIYW5kbGVXaWR0aDogMTIsXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9XG4gIH07XG5cbiAgcmV0dXJuIEFuaW1hdGlvbkNvbnRyb2w7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGlvbkNvbnRyb2xGYWN0b3J5O1xuIl19