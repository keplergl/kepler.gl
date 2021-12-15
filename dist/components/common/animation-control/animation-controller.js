"use strict";

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

var _react = require("react");

var _d3Array = require("d3-array");

var _window = require("global/window");

var _console = _interopRequireDefault(require("global/console"));

var _defaultSettings = require("../../../constants/default-settings");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function AnimationControllerFactory() {
  /**
   * 4 Animation Window Types
   * 1. free
   *  |->  |->
   * Current time is a fixed range, animate a moving window that calls next animation frames continuously
   * The increment id based on domain / BASE_SPEED * SPEED
   *
   * 2. incremental
   * |    |->
   * Same as free, current time is a growing range, only the max value of range increment during animation.
   * The increment is also based on domain / BASE_SPEED * SPEED
   *
   * 3. point
   * o -> o
   * Current time is a point, animate a moving point calls next animation frame continuously
   * The increment is based on domain / BASE_SPEED * SPEED
   *
   * 4. interval
   * o ~> o
   * Current time is a point. An array of sorted time steps are provided,
   * animate a moving point jumps to the next step
   */
  var AnimationController = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(AnimationController, _Component);

    var _super = _createSuper(AnimationController);

    function AnimationController() {
      var _this;

      (0, _classCallCheck2["default"])(this, AnimationController);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        isAnimating: false
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_timer", null);
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_animate", function (delay) {
        _this._startTime = new Date().getTime();

        var loop = function loop() {
          var current = new Date().getTime(); // @ts-ignore

          var delta = current - _this._startTime;

          if (delta >= delay) {
            _this._nextFrame();

            _this._startTime = new Date().getTime();
          } else {
            _this._timer = (0, _window.requestAnimationFrame)(loop);
          }
        };

        _this._timer = (0, _window.requestAnimationFrame)(loop);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_resetAnimationByDomain", function () {
        var _this$props = _this.props,
            domain = _this$props.domain,
            value = _this$props.value,
            animationWindow = _this$props.animationWindow;

        if (Array.isArray(value)) {
          if (animationWindow === _defaultSettings.ANIMATION_WINDOW.incremental) {
            _this.props.updateAnimation([value[0], value[0] + 1]);
          } else {
            _this.props.updateAnimation([domain[0], domain[0] + value[1] - value[0]]);
          }
        } else {
          _this.props.updateAnimation(domain[0]);
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_resetAnimtionByTimeStep", function () {
        // go to the first steps
        _this.props.updateAnimation([_this.props.steps[0], 0]);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_resetAnimation", function () {
        if (_this.props.animationWindow === _defaultSettings.ANIMATION_WINDOW.interval) {
          _this._resetAnimtionByTimeStep();
        } else {
          _this._resetAnimationByDomain();
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_startAnimation", function () {
        var speed = _this.props.speed;

        _this._clearTimer();

        if (speed > 0) {
          if (_this.props.animationWindow === _defaultSettings.ANIMATION_WINDOW.interval) {
            // animate by interval
            // 30*600
            var steps = _this.props.steps;

            if (!Array.isArray(steps) || !steps.length) {
              _console["default"].warn('animation steps should be an array');

              return;
            } // when speed = 1, animation should loop through 600 frames at 60 FPS
            // calculate delay based on # steps


            var delay = _defaultSettings.BASE_SPEED * (1000 / _defaultSettings.FPS) / steps.length / (speed || 1);

            _this._animate(delay);
          } else {
            _this._timer = (0, _window.requestAnimationFrame)(_this._nextFrame);
          }
        }

        _this.setState({
          isAnimating: true
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_clearTimer", function () {
        if (_this._timer) {
          (0, _window.cancelAnimationFrame)(_this._timer);
          _this._timer = null;
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_pauseAnimation", function () {
        _this._clearTimer();

        _this.setState({
          isAnimating: false
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_nextFrame", function () {
        _this._timer = null;
        var nextValue = _this.props.animationWindow === _defaultSettings.ANIMATION_WINDOW.interval ? _this._nextFrameByTimeStep() : _this._nextFrameByDomain();

        _this.props.updateAnimation(nextValue);
      });
      return _this;
    }

    (0, _createClass2["default"])(AnimationController, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._startOrPauseAnimation();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this._startOrPauseAnimation();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this._timer) {
          (0, _window.cancelAnimationFrame)(this._timer);
        }
      }
    }, {
      key: "_startOrPauseAnimation",
      value: function _startOrPauseAnimation() {
        var _this$props2 = this.props,
            isAnimating = _this$props2.isAnimating,
            speed = _this$props2.speed;

        if (!this._timer && isAnimating && speed > 0) {
          this._startAnimation();
        } else if (this._timer && !isAnimating) {
          this._pauseAnimation();
        }
      }
    }, {
      key: "_nextFrameByDomain",
      value: function _nextFrameByDomain() {
        var _this$props3 = this.props,
            domain = _this$props3.domain,
            value = _this$props3.value,
            speed = _this$props3.speed,
            baseSpeed = _this$props3.baseSpeed,
            animationWindow = _this$props3.animationWindow;
        var delta = (domain[1] - domain[0]) / baseSpeed * speed; // loop when reaches the end
        // current time is a range

        if (Array.isArray(value)) {
          var value0;
          var value1;
          var readEnd = value[1] + delta > domain[1];

          if (animationWindow === _defaultSettings.ANIMATION_WINDOW.incremental) {
            value0 = value[0];
            value1 = readEnd ? value[0] + 1 : value[1] + delta;
          } else {
            value0 = readEnd ? domain[0] : value[0] + delta;
            value1 = value0 + value[1] - value[0];
          }

          return [value0, value1];
        } // current time is a point


        return value + delta > domain[1] ? domain[0] : value + delta;
      }
    }, {
      key: "_nextFrameByTimeStep",
      value: function _nextFrameByTimeStep() {
        var _this$props4 = this.props,
            steps = _this$props4.steps,
            value = _this$props4.value;
        var val = Array.isArray(value) ? value[0] : value;
        var index = (0, _d3Array.bisectLeft)(steps, val);
        var nextIdx = index >= steps.length - 1 ? 0 : index + 1;
        return [steps[nextIdx], nextIdx];
      }
    }, {
      key: "render",
      value: function render() {
        var isAnimating = this.state.isAnimating;
        var children = this.props.children;
        return typeof children === 'function' ? children(isAnimating, this._startAnimation, this._pauseAnimation, this._resetAnimation) : null;
      }
    }]);
    return AnimationController;
  }(_react.Component);

  (0, _defineProperty2["default"])(AnimationController, "defaultProps", {
    baseSpeed: _defaultSettings.BASE_SPEED,
    speed: 1,
    steps: null,
    animationWindow: _defaultSettings.ANIMATION_WINDOW.free
  });
  return AnimationController;
}

var _default = AnimationControllerFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hbmltYXRpb24tY29udHJvbC9hbmltYXRpb24tY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJBbmltYXRpb25Db250cm9sbGVyRmFjdG9yeSIsIkFuaW1hdGlvbkNvbnRyb2xsZXIiLCJpc0FuaW1hdGluZyIsImRlbGF5IiwiX3N0YXJ0VGltZSIsIkRhdGUiLCJnZXRUaW1lIiwibG9vcCIsImN1cnJlbnQiLCJkZWx0YSIsIl9uZXh0RnJhbWUiLCJfdGltZXIiLCJwcm9wcyIsImRvbWFpbiIsInZhbHVlIiwiYW5pbWF0aW9uV2luZG93IiwiQXJyYXkiLCJpc0FycmF5IiwiQU5JTUFUSU9OX1dJTkRPVyIsImluY3JlbWVudGFsIiwidXBkYXRlQW5pbWF0aW9uIiwic3RlcHMiLCJpbnRlcnZhbCIsIl9yZXNldEFuaW10aW9uQnlUaW1lU3RlcCIsIl9yZXNldEFuaW1hdGlvbkJ5RG9tYWluIiwic3BlZWQiLCJfY2xlYXJUaW1lciIsImxlbmd0aCIsIkNvbnNvbGUiLCJ3YXJuIiwiQkFTRV9TUEVFRCIsIkZQUyIsIl9hbmltYXRlIiwic2V0U3RhdGUiLCJuZXh0VmFsdWUiLCJfbmV4dEZyYW1lQnlUaW1lU3RlcCIsIl9uZXh0RnJhbWVCeURvbWFpbiIsIl9zdGFydE9yUGF1c2VBbmltYXRpb24iLCJfc3RhcnRBbmltYXRpb24iLCJfcGF1c2VBbmltYXRpb24iLCJiYXNlU3BlZWQiLCJ2YWx1ZTAiLCJ2YWx1ZTEiLCJyZWFkRW5kIiwidmFsIiwiaW5kZXgiLCJuZXh0SWR4Iiwic3RhdGUiLCJjaGlsZHJlbiIsIl9yZXNldEFuaW1hdGlvbiIsIkNvbXBvbmVudCIsImZyZWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxTQUFTQSwwQkFBVCxHQUFzQztBQUNwQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUVBLGVBQU8sQ0FBQ3hCLEtBQUssQ0FBQ3lCLE9BQUQsQ0FBTixFQUFpQkEsT0FBakIsQ0FBUDtBQUNEO0FBdExpQztBQUFBO0FBQUEsYUF3TGxDLGtCQUFTO0FBQUEsWUFDQTVDLFdBREEsR0FDZSxLQUFLNkMsS0FEcEIsQ0FDQTdDLFdBREE7QUFBQSxZQUVBOEMsUUFGQSxHQUVZLEtBQUtwQyxLQUZqQixDQUVBb0MsUUFGQTtBQUlQLGVBQU8sT0FBT0EsUUFBUCxLQUFvQixVQUFwQixHQUNIQSxRQUFRLENBQUM5QyxXQUFELEVBQWMsS0FBS29DLGVBQW5CLEVBQW9DLEtBQUtDLGVBQXpDLEVBQTBELEtBQUtVLGVBQS9ELENBREwsR0FFSCxJQUZKO0FBR0Q7QUEvTGlDO0FBQUE7QUFBQSxJQXVCRkMsZ0JBdkJFOztBQUFBLG1DQXVCOUJqRCxtQkF2QjhCLGtCQXlCWjtBQUNwQnVDLElBQUFBLFNBQVMsRUFBRVYsMkJBRFM7QUFFcEJMLElBQUFBLEtBQUssRUFBRSxDQUZhO0FBR3BCSixJQUFBQSxLQUFLLEVBQUUsSUFIYTtBQUlwQk4sSUFBQUEsZUFBZSxFQUFFRyxrQ0FBaUJpQztBQUpkLEdBekJZO0FBa01wQyxTQUFPbEQsbUJBQVA7QUFDRDs7ZUFFY0QsMEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtiaXNlY3RMZWZ0fSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge3JlcXVlc3RBbmltYXRpb25GcmFtZSwgY2FuY2VsQW5pbWF0aW9uRnJhbWV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IENvbnNvbGUgZnJvbSAnZ2xvYmFsL2NvbnNvbGUnO1xuaW1wb3J0IHtCQVNFX1NQRUVELCBGUFMsIEFOSU1BVElPTl9XSU5ET1d9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZnVuY3Rpb24gQW5pbWF0aW9uQ29udHJvbGxlckZhY3RvcnkoKSB7XG4gIC8qKlxuICAgKiA0IEFuaW1hdGlvbiBXaW5kb3cgVHlwZXNcbiAgICogMS4gZnJlZVxuICAgKiAgfC0+ICB8LT5cbiAgICogQ3VycmVudCB0aW1lIGlzIGEgZml4ZWQgcmFuZ2UsIGFuaW1hdGUgYSBtb3Zpbmcgd2luZG93IHRoYXQgY2FsbHMgbmV4dCBhbmltYXRpb24gZnJhbWVzIGNvbnRpbnVvdXNseVxuICAgKiBUaGUgaW5jcmVtZW50IGlkIGJhc2VkIG9uIGRvbWFpbiAvIEJBU0VfU1BFRUQgKiBTUEVFRFxuICAgKlxuICAgKiAyLiBpbmNyZW1lbnRhbFxuICAgKiB8ICAgIHwtPlxuICAgKiBTYW1lIGFzIGZyZWUsIGN1cnJlbnQgdGltZSBpcyBhIGdyb3dpbmcgcmFuZ2UsIG9ubHkgdGhlIG1heCB2YWx1ZSBvZiByYW5nZSBpbmNyZW1lbnQgZHVyaW5nIGFuaW1hdGlvbi5cbiAgICogVGhlIGluY3JlbWVudCBpcyBhbHNvIGJhc2VkIG9uIGRvbWFpbiAvIEJBU0VfU1BFRUQgKiBTUEVFRFxuICAgKlxuICAgKiAzLiBwb2ludFxuICAgKiBvIC0+IG9cbiAgICogQ3VycmVudCB0aW1lIGlzIGEgcG9pbnQsIGFuaW1hdGUgYSBtb3ZpbmcgcG9pbnQgY2FsbHMgbmV4dCBhbmltYXRpb24gZnJhbWUgY29udGludW91c2x5XG4gICAqIFRoZSBpbmNyZW1lbnQgaXMgYmFzZWQgb24gZG9tYWluIC8gQkFTRV9TUEVFRCAqIFNQRUVEXG4gICAqXG4gICAqIDQuIGludGVydmFsXG4gICAqIG8gfj4gb1xuICAgKiBDdXJyZW50IHRpbWUgaXMgYSBwb2ludC4gQW4gYXJyYXkgb2Ygc29ydGVkIHRpbWUgc3RlcHMgYXJlIHByb3ZpZGVkLFxuICAgKiBhbmltYXRlIGEgbW92aW5nIHBvaW50IGp1bXBzIHRvIHRoZSBuZXh0IHN0ZXBcbiAgICovXG4gIGNsYXNzIEFuaW1hdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vIFRPRE86IGNvbnZlcnQgdGhlIGVudGlyZSBjb21wb25lbnQgdG8gdXNlIGhvb2tzIGluIHRoZSBuZXh0IFBSXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIGJhc2VTcGVlZDogQkFTRV9TUEVFRCxcbiAgICAgIHNwZWVkOiAxLFxuICAgICAgc3RlcHM6IG51bGwsXG4gICAgICBhbmltYXRpb25XaW5kb3c6IEFOSU1BVElPTl9XSU5ET1cuZnJlZVxuICAgIH07XG5cbiAgICBzdGF0ZSA9IHtcbiAgICAgIGlzQW5pbWF0aW5nOiBmYWxzZVxuICAgIH07XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMuX3N0YXJ0T3JQYXVzZUFuaW1hdGlvbigpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgIHRoaXMuX3N0YXJ0T3JQYXVzZUFuaW1hdGlvbigpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgaWYgKHRoaXMuX3RpbWVyKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RpbWVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfdGltZXIgPSBudWxsO1xuXG4gICAgX3N0YXJ0T3JQYXVzZUFuaW1hdGlvbigpIHtcbiAgICAgIGNvbnN0IHtpc0FuaW1hdGluZywgc3BlZWR9ID0gdGhpcy5wcm9wcztcbiAgICAgIGlmICghdGhpcy5fdGltZXIgJiYgaXNBbmltYXRpbmcgJiYgc3BlZWQgPiAwKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0QW5pbWF0aW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3RpbWVyICYmICFpc0FuaW1hdGluZykge1xuICAgICAgICB0aGlzLl9wYXVzZUFuaW1hdGlvbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9hbmltYXRlID0gZGVsYXkgPT4ge1xuICAgICAgdGhpcy5fc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgIGNvbnN0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBkZWx0YSA9IGN1cnJlbnQgLSB0aGlzLl9zdGFydFRpbWU7XG5cbiAgICAgICAgaWYgKGRlbHRhID49IGRlbGF5KSB7XG4gICAgICAgICAgdGhpcy5fbmV4dEZyYW1lKCk7XG4gICAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX3RpbWVyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH07XG5cbiAgICBfcmVzZXRBbmltYXRpb25CeURvbWFpbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHtkb21haW4sIHZhbHVlLCBhbmltYXRpb25XaW5kb3d9ID0gdGhpcy5wcm9wcztcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uV2luZG93ID09PSBBTklNQVRJT05fV0lORE9XLmluY3JlbWVudGFsKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVBbmltYXRpb24oW3ZhbHVlWzBdLCB2YWx1ZVswXSArIDFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZUFuaW1hdGlvbihbZG9tYWluWzBdLCBkb21haW5bMF0gKyB2YWx1ZVsxXSAtIHZhbHVlWzBdXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlQW5pbWF0aW9uKGRvbWFpblswXSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9yZXNldEFuaW10aW9uQnlUaW1lU3RlcCA9ICgpID0+IHtcbiAgICAgIC8vIGdvIHRvIHRoZSBmaXJzdCBzdGVwc1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGVBbmltYXRpb24oW3RoaXMucHJvcHMuc3RlcHNbMF0sIDBdKTtcbiAgICB9O1xuXG4gICAgX3Jlc2V0QW5pbWF0aW9uID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucHJvcHMuYW5pbWF0aW9uV2luZG93ID09PSBBTklNQVRJT05fV0lORE9XLmludGVydmFsKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0QW5pbXRpb25CeVRpbWVTdGVwKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXNldEFuaW1hdGlvbkJ5RG9tYWluKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9zdGFydEFuaW1hdGlvbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHtzcGVlZH0gPSB0aGlzLnByb3BzO1xuICAgICAgdGhpcy5fY2xlYXJUaW1lcigpO1xuICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5hbmltYXRpb25XaW5kb3cgPT09IEFOSU1BVElPTl9XSU5ET1cuaW50ZXJ2YWwpIHtcbiAgICAgICAgICAvLyBhbmltYXRlIGJ5IGludGVydmFsXG4gICAgICAgICAgLy8gMzAqNjAwXG4gICAgICAgICAgY29uc3Qge3N0ZXBzfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHN0ZXBzKSB8fCAhc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBDb25zb2xlLndhcm4oJ2FuaW1hdGlvbiBzdGVwcyBzaG91bGQgYmUgYW4gYXJyYXknKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gd2hlbiBzcGVlZCA9IDEsIGFuaW1hdGlvbiBzaG91bGQgbG9vcCB0aHJvdWdoIDYwMCBmcmFtZXMgYXQgNjAgRlBTXG4gICAgICAgICAgLy8gY2FsY3VsYXRlIGRlbGF5IGJhc2VkIG9uICMgc3RlcHNcbiAgICAgICAgICBjb25zdCBkZWxheSA9IChCQVNFX1NQRUVEICogKDEwMDAgLyBGUFMpKSAvIHN0ZXBzLmxlbmd0aCAvIChzcGVlZCB8fCAxKTtcbiAgICAgICAgICB0aGlzLl9hbmltYXRlKGRlbGF5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW1lciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9uZXh0RnJhbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc0FuaW1hdGluZzogdHJ1ZX0pO1xuICAgIH07XG5cbiAgICBfY2xlYXJUaW1lciA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl90aW1lcikge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl90aW1lcik7XG4gICAgICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3BhdXNlQW5pbWF0aW9uID0gKCkgPT4ge1xuICAgICAgdGhpcy5fY2xlYXJUaW1lcigpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNBbmltYXRpbmc6IGZhbHNlfSk7XG4gICAgfTtcblxuICAgIF9uZXh0RnJhbWUgPSAoKSA9PiB7XG4gICAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgICBjb25zdCBuZXh0VmFsdWUgPVxuICAgICAgICB0aGlzLnByb3BzLmFuaW1hdGlvbldpbmRvdyA9PT0gQU5JTUFUSU9OX1dJTkRPVy5pbnRlcnZhbFxuICAgICAgICAgID8gdGhpcy5fbmV4dEZyYW1lQnlUaW1lU3RlcCgpXG4gICAgICAgICAgOiB0aGlzLl9uZXh0RnJhbWVCeURvbWFpbigpO1xuXG4gICAgICB0aGlzLnByb3BzLnVwZGF0ZUFuaW1hdGlvbihuZXh0VmFsdWUpO1xuICAgIH07XG5cbiAgICBfbmV4dEZyYW1lQnlEb21haW4oKSB7XG4gICAgICBjb25zdCB7ZG9tYWluLCB2YWx1ZSwgc3BlZWQsIGJhc2VTcGVlZCwgYW5pbWF0aW9uV2luZG93fSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBkZWx0YSA9ICgoZG9tYWluWzFdIC0gZG9tYWluWzBdKSAvIGJhc2VTcGVlZCkgKiBzcGVlZDtcblxuICAgICAgLy8gbG9vcCB3aGVuIHJlYWNoZXMgdGhlIGVuZFxuICAgICAgLy8gY3VycmVudCB0aW1lIGlzIGEgcmFuZ2VcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBsZXQgdmFsdWUwO1xuICAgICAgICBsZXQgdmFsdWUxO1xuICAgICAgICBjb25zdCByZWFkRW5kID0gdmFsdWVbMV0gKyBkZWx0YSA+IGRvbWFpblsxXTtcbiAgICAgICAgaWYgKGFuaW1hdGlvbldpbmRvdyA9PT0gQU5JTUFUSU9OX1dJTkRPVy5pbmNyZW1lbnRhbCkge1xuICAgICAgICAgIHZhbHVlMCA9IHZhbHVlWzBdO1xuICAgICAgICAgIHZhbHVlMSA9IHJlYWRFbmQgPyB2YWx1ZVswXSArIDEgOiB2YWx1ZVsxXSArIGRlbHRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlMCA9IHJlYWRFbmQgPyBkb21haW5bMF0gOiB2YWx1ZVswXSArIGRlbHRhO1xuICAgICAgICAgIHZhbHVlMSA9IHZhbHVlMCArIHZhbHVlWzFdIC0gdmFsdWVbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt2YWx1ZTAsIHZhbHVlMV07XG4gICAgICB9XG5cbiAgICAgIC8vIGN1cnJlbnQgdGltZSBpcyBhIHBvaW50XG4gICAgICByZXR1cm4gdmFsdWUgKyBkZWx0YSA+IGRvbWFpblsxXSA/IGRvbWFpblswXSA6IHZhbHVlICsgZGVsdGE7XG4gICAgfVxuXG4gICAgX25leHRGcmFtZUJ5VGltZVN0ZXAoKSB7XG4gICAgICBjb25zdCB7c3RlcHMsIHZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB2YWwgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlWzBdIDogdmFsdWU7XG4gICAgICBjb25zdCBpbmRleCA9IGJpc2VjdExlZnQoc3RlcHMsIHZhbCk7XG4gICAgICBjb25zdCBuZXh0SWR4ID0gaW5kZXggPj0gc3RlcHMubGVuZ3RoIC0gMSA/IDAgOiBpbmRleCArIDE7XG5cbiAgICAgIHJldHVybiBbc3RlcHNbbmV4dElkeF0sIG5leHRJZHhdO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtpc0FuaW1hdGluZ30gPSB0aGlzLnN0YXRlO1xuICAgICAgY29uc3Qge2NoaWxkcmVufSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHJldHVybiB0eXBlb2YgY2hpbGRyZW4gPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyBjaGlsZHJlbihpc0FuaW1hdGluZywgdGhpcy5fc3RhcnRBbmltYXRpb24sIHRoaXMuX3BhdXNlQW5pbWF0aW9uLCB0aGlzLl9yZXNldEFuaW1hdGlvbilcbiAgICAgICAgOiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBBbmltYXRpb25Db250cm9sbGVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRpb25Db250cm9sbGVyRmFjdG9yeTtcbiJdfQ==