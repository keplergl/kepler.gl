"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents2 = require("../styled-components");

var _icons = require("../icons");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 6px 4px;\n  svg {\n    margin: 0 6px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  margin-right: 12px;\n\n  &.disabled {\n    opacity: 0.4;\n    pointer-events: none;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledAnimationControls = _styledComponents["default"].div(_templateObject());

var IconButton = (0, _styledComponents["default"])(_styledComponents2.Button)(_templateObject2());

function nop() {}

var DEFAULT_BUTTON_HEIGHT = '18px';

function AnimationPlaybacksFactory() {
  var AnimationPlaybacks = function AnimationPlaybacks(_ref) {
    var isAnimatable = _ref.isAnimatable,
        isAnimating = _ref.isAnimating,
        buttonStyle = _ref.buttonStyle,
        _ref$pauseAnimation = _ref.pauseAnimation,
        pauseAnimation = _ref$pauseAnimation === void 0 ? nop : _ref$pauseAnimation,
        _ref$updateAnimationT = _ref.updateAnimationTime,
        updateAnimationTime = _ref$updateAnimationT === void 0 ? nop : _ref$updateAnimationT,
        _ref$startAnimation = _ref.startAnimation,
        startAnimation = _ref$startAnimation === void 0 ? nop : _ref$startAnimation,
        _ref$buttonHeight = _ref.buttonHeight,
        buttonHeight = _ref$buttonHeight === void 0 ? DEFAULT_BUTTON_HEIGHT : _ref$buttonHeight;
    var btnStyle = buttonStyle ? (0, _defineProperty2["default"])({}, buttonStyle, true) : {};
    return _react["default"].createElement(StyledAnimationControls, {
      className: (0, _classnames["default"])('time-range-slider__control', {
        disabled: !isAnimatable
      })
    }, _react["default"].createElement(_styledComponents2.ButtonGroup, null, _react["default"].createElement(IconButton, (0, _extends2["default"])({
      className: "playback-control-button"
    }, btnStyle, {
      onClick: updateAnimationTime
    }), _react["default"].createElement(_icons.Reset, {
      height: buttonHeight
    })), _react["default"].createElement(IconButton, (0, _extends2["default"])({}, btnStyle, {
      className: (0, _classnames["default"])('playback-control-button', {
        active: isAnimating
      }),
      onClick: isAnimating ? pauseAnimation : startAnimation
    }), isAnimating ? _react["default"].createElement(_icons.Pause, {
      height: buttonHeight
    }) : _react["default"].createElement(_icons.Play, {
      height: buttonHeight
    }))));
  };

  return AnimationPlaybacks;
}

var _default = AnimationPlaybacksFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hbmltYXRpb24tY29udHJvbC9wbGF5YmFjay1jb250cm9scy5qcyJdLCJuYW1lcyI6WyJTdHlsZWRBbmltYXRpb25Db250cm9scyIsInN0eWxlZCIsImRpdiIsIkljb25CdXR0b24iLCJCdXR0b24iLCJub3AiLCJERUZBVUxUX0JVVFRPTl9IRUlHSFQiLCJBbmltYXRpb25QbGF5YmFja3NGYWN0b3J5IiwiQW5pbWF0aW9uUGxheWJhY2tzIiwiaXNBbmltYXRhYmxlIiwiaXNBbmltYXRpbmciLCJidXR0b25TdHlsZSIsInBhdXNlQW5pbWF0aW9uIiwidXBkYXRlQW5pbWF0aW9uVGltZSIsInN0YXJ0QW5pbWF0aW9uIiwiYnV0dG9uSGVpZ2h0IiwiYnRuU3R5bGUiLCJkaXNhYmxlZCIsImFjdGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsdUJBQXVCLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUE3Qjs7QUFVQSxJQUFNQyxVQUFVLEdBQUcsa0NBQU9DLHlCQUFQLENBQUgsb0JBQWhCOztBQU9BLFNBQVNDLEdBQVQsR0FBZSxDQUFFOztBQUNqQixJQUFNQyxxQkFBcUIsR0FBRyxNQUE5Qjs7QUFFQSxTQUFTQyx5QkFBVCxHQUFxQztBQUNuQyxNQUFNQyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLE9BUXJCO0FBQUEsUUFQSkMsWUFPSSxRQVBKQSxZQU9JO0FBQUEsUUFOSkMsV0FNSSxRQU5KQSxXQU1JO0FBQUEsUUFMSkMsV0FLSSxRQUxKQSxXQUtJO0FBQUEsbUNBSkpDLGNBSUk7QUFBQSxRQUpKQSxjQUlJLG9DQUphUCxHQUliO0FBQUEscUNBSEpRLG1CQUdJO0FBQUEsUUFISkEsbUJBR0ksc0NBSGtCUixHQUdsQjtBQUFBLG1DQUZKUyxjQUVJO0FBQUEsUUFGSkEsY0FFSSxvQ0FGYVQsR0FFYjtBQUFBLGlDQURKVSxZQUNJO0FBQUEsUUFESkEsWUFDSSxrQ0FEV1QscUJBQ1g7QUFDSixRQUFNVSxRQUFRLEdBQUdMLFdBQVcsd0NBQUtBLFdBQUwsRUFBbUIsSUFBbkIsSUFBMkIsRUFBdkQ7QUFDQSxXQUNFLGdDQUFDLHVCQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUUsNEJBQVcsNEJBQVgsRUFBeUM7QUFDbERNLFFBQUFBLFFBQVEsRUFBRSxDQUFDUjtBQUR1QyxPQUF6QztBQURiLE9BS0UsZ0NBQUMsOEJBQUQsUUFDRSxnQ0FBQyxVQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUM7QUFEWixPQUVNTyxRQUZOO0FBR0UsTUFBQSxPQUFPLEVBQUVIO0FBSFgsUUFLRSxnQ0FBQyxZQUFEO0FBQU8sTUFBQSxNQUFNLEVBQUVFO0FBQWYsTUFMRixDQURGLEVBUUUsZ0NBQUMsVUFBRCxnQ0FDTUMsUUFETjtBQUVFLE1BQUEsU0FBUyxFQUFFLDRCQUFXLHlCQUFYLEVBQXNDO0FBQUNFLFFBQUFBLE1BQU0sRUFBRVI7QUFBVCxPQUF0QyxDQUZiO0FBR0UsTUFBQSxPQUFPLEVBQUVBLFdBQVcsR0FBR0UsY0FBSCxHQUFvQkU7QUFIMUMsUUFLR0osV0FBVyxHQUFHLGdDQUFDLFlBQUQ7QUFBTyxNQUFBLE1BQU0sRUFBRUs7QUFBZixNQUFILEdBQXFDLGdDQUFDLFdBQUQ7QUFBTSxNQUFBLE1BQU0sRUFBRUE7QUFBZCxNQUxuRCxDQVJGLENBTEYsQ0FERjtBQXdCRCxHQWxDRDs7QUFtQ0EsU0FBT1Asa0JBQVA7QUFDRDs7ZUFFY0QseUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHtCdXR0b25Hcm91cCwgQnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1BsYXksIFJlc2V0LCBQYXVzZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBTdHlsZWRBbmltYXRpb25Db250cm9scyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIG1hcmdpbi1yaWdodDogMTJweDtcblxuICAmLmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwLjQ7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbmA7XG5cbmNvbnN0IEljb25CdXR0b24gPSBzdHlsZWQoQnV0dG9uKWBcbiAgcGFkZGluZzogNnB4IDRweDtcbiAgc3ZnIHtcbiAgICBtYXJnaW46IDAgNnB4O1xuICB9XG5gO1xuXG5mdW5jdGlvbiBub3AoKSB7fVxuY29uc3QgREVGQVVMVF9CVVRUT05fSEVJR0hUID0gJzE4cHgnO1xuXG5mdW5jdGlvbiBBbmltYXRpb25QbGF5YmFja3NGYWN0b3J5KCkge1xuICBjb25zdCBBbmltYXRpb25QbGF5YmFja3MgPSAoe1xuICAgIGlzQW5pbWF0YWJsZSxcbiAgICBpc0FuaW1hdGluZyxcbiAgICBidXR0b25TdHlsZSxcbiAgICBwYXVzZUFuaW1hdGlvbiA9IG5vcCxcbiAgICB1cGRhdGVBbmltYXRpb25UaW1lID0gbm9wLFxuICAgIHN0YXJ0QW5pbWF0aW9uID0gbm9wLFxuICAgIGJ1dHRvbkhlaWdodCA9IERFRkFVTFRfQlVUVE9OX0hFSUdIVFxuICB9KSA9PiB7XG4gICAgY29uc3QgYnRuU3R5bGUgPSBidXR0b25TdHlsZSA/IHtbYnV0dG9uU3R5bGVdOiB0cnVlfSA6IHt9O1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkQW5pbWF0aW9uQ29udHJvbHNcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCd0aW1lLXJhbmdlLXNsaWRlcl9fY29udHJvbCcsIHtcbiAgICAgICAgICBkaXNhYmxlZDogIWlzQW5pbWF0YWJsZVxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvbkdyb3VwPlxuICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwbGF5YmFjay1jb250cm9sLWJ1dHRvblwiXG4gICAgICAgICAgICB7Li4uYnRuU3R5bGV9XG4gICAgICAgICAgICBvbkNsaWNrPXt1cGRhdGVBbmltYXRpb25UaW1lfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSZXNldCBoZWlnaHQ9e2J1dHRvbkhlaWdodH0gLz5cbiAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgIHsuLi5idG5TdHlsZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncGxheWJhY2stY29udHJvbC1idXR0b24nLCB7YWN0aXZlOiBpc0FuaW1hdGluZ30pfVxuICAgICAgICAgICAgb25DbGljaz17aXNBbmltYXRpbmcgPyBwYXVzZUFuaW1hdGlvbiA6IHN0YXJ0QW5pbWF0aW9ufVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpc0FuaW1hdGluZyA/IDxQYXVzZSBoZWlnaHQ9e2J1dHRvbkhlaWdodH0gLz4gOiA8UGxheSBoZWlnaHQ9e2J1dHRvbkhlaWdodH0gLz59XG4gICAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICA8L0J1dHRvbkdyb3VwPlxuICAgICAgPC9TdHlsZWRBbmltYXRpb25Db250cm9scz5cbiAgICApO1xuICB9O1xuICByZXR1cm4gQW5pbWF0aW9uUGxheWJhY2tzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRpb25QbGF5YmFja3NGYWN0b3J5O1xuIl19