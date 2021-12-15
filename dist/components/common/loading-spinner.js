"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _templateObject, _templateObject2, _templateObject3;

var animationName = (0, _styledComponents.keyframes)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n"])));

var Loader = _styledComponents["default"].span(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n    border-left-color: ", ";\n    animation: _preloader_spin_ 500ms linear infinite;\n    border-radius: 50%;\n    border-top-color: transparent;\n    border-bottom-color: transparent;\n    border-right-color: transparent;\n    cursor: wait;\n    border-style: solid;\n    display: block;\n    animation-name: ", ";\n}"])), function (props) {
  return props.color || props.theme.primaryBtnBgd;
}, animationName);

var LoadingWrapper = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  border-radius: 50%;\n  border: 3px solid ", ";\n  padding: 2px;\n"])), function (props) {
  return props.borderColor || props.theme.borderColorLT;
});

var LoadingSpinner = function LoadingSpinner(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 32 : _ref$size,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? '' : _ref$color,
      _ref$borderColor = _ref.borderColor,
      borderColor = _ref$borderColor === void 0 ? '' : _ref$borderColor,
      _ref$strokeWidth = _ref.strokeWidth,
      strokeWidth = _ref$strokeWidth === void 0 ? 3 : _ref$strokeWidth,
      _ref$gap = _ref.gap,
      gap = _ref$gap === void 0 ? 2 : _ref$gap;
  return /*#__PURE__*/_react["default"].createElement(LoadingWrapper, {
    style: {
      width: "".concat(size, "px"),
      height: "".concat(size, "px"),
      padding: "".concat(gap, "px")
    }
  }, /*#__PURE__*/_react["default"].createElement(Loader, {
    color: color,
    style: {
      width: "".concat(size - strokeWidth * 2 - gap * 2, "px"),
      height: "".concat(size - strokeWidth * 2 - gap * 2, "px")
    }
  }));
};

var _default = LoadingSpinner;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9sb2FkaW5nLXNwaW5uZXIuanMiXSwibmFtZXMiOlsiYW5pbWF0aW9uTmFtZSIsImtleWZyYW1lcyIsIkxvYWRlciIsInN0eWxlZCIsInNwYW4iLCJwcm9wcyIsImNvbG9yIiwidGhlbWUiLCJwcmltYXJ5QnRuQmdkIiwiTG9hZGluZ1dyYXBwZXIiLCJkaXYiLCJib3JkZXJDb2xvciIsImJvcmRlckNvbG9yTFQiLCJMb2FkaW5nU3Bpbm5lciIsInNpemUiLCJzdHJva2VXaWR0aCIsImdhcCIsIndpZHRoIiwiaGVpZ2h0IiwicGFkZGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7OztBQUVBLElBQU1BLGFBQWEsT0FBR0MsMkJBQUgsbUxBQW5COztBQVNBLElBQU1DLE1BQU0sR0FBR0MsNkJBQU9DLElBQVYseVpBQ2EsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixJQUFlRCxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsYUFBL0I7QUFBQSxDQURsQixFQVVVUixhQVZWLENBQVo7O0FBYUEsSUFBTVMsY0FBYyxHQUFHTiw2QkFBT08sR0FBViw4SkFFRSxVQUFBTCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDTSxXQUFOLElBQXFCTixLQUFLLENBQUNFLEtBQU4sQ0FBWUssYUFBckM7QUFBQSxDQUZQLENBQXBCOztBQU1BLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUI7QUFBQSx1QkFBRUMsSUFBRjtBQUFBLE1BQUVBLElBQUYsMEJBQVMsRUFBVDtBQUFBLHdCQUFhUixLQUFiO0FBQUEsTUFBYUEsS0FBYiwyQkFBcUIsRUFBckI7QUFBQSw4QkFBeUJLLFdBQXpCO0FBQUEsTUFBeUJBLFdBQXpCLGlDQUF1QyxFQUF2QztBQUFBLDhCQUEyQ0ksV0FBM0M7QUFBQSxNQUEyQ0EsV0FBM0MsaUNBQXlELENBQXpEO0FBQUEsc0JBQTREQyxHQUE1RDtBQUFBLE1BQTREQSxHQUE1RCx5QkFBa0UsQ0FBbEU7QUFBQSxzQkFDckIsZ0NBQUMsY0FBRDtBQUFnQixJQUFBLEtBQUssRUFBRTtBQUFDQyxNQUFBQSxLQUFLLFlBQUtILElBQUwsT0FBTjtBQUFxQkksTUFBQUEsTUFBTSxZQUFLSixJQUFMLE9BQTNCO0FBQTBDSyxNQUFBQSxPQUFPLFlBQUtILEdBQUw7QUFBakQ7QUFBdkIsa0JBQ0UsZ0NBQUMsTUFBRDtBQUNFLElBQUEsS0FBSyxFQUFFVixLQURUO0FBRUUsSUFBQSxLQUFLLEVBQUU7QUFDTFcsTUFBQUEsS0FBSyxZQUFLSCxJQUFJLEdBQUdDLFdBQVcsR0FBRyxDQUFyQixHQUF5QkMsR0FBRyxHQUFHLENBQXBDLE9BREE7QUFFTEUsTUFBQUEsTUFBTSxZQUFLSixJQUFJLEdBQUdDLFdBQVcsR0FBRyxDQUFyQixHQUF5QkMsR0FBRyxHQUFHLENBQXBDO0FBRkQ7QUFGVCxJQURGLENBRHFCO0FBQUEsQ0FBdkI7O2VBWWVILGMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCwge2tleWZyYW1lc30gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBhbmltYXRpb25OYW1lID0ga2V5ZnJhbWVzYFxuICAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxuYDtcblxuY29uc3QgTG9hZGVyID0gc3R5bGVkLnNwYW5gXG4gICAgYm9yZGVyLWxlZnQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMuY29sb3IgfHwgcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gICAgYW5pbWF0aW9uOiBfcHJlbG9hZGVyX3NwaW5fIDUwMG1zIGxpbmVhciBpbmZpbml0ZTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYm9yZGVyLXRvcC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLWJvdHRvbS1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXJpZ2h0LWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBjdXJzb3I6IHdhaXQ7XG4gICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBhbmltYXRpb24tbmFtZTogJHthbmltYXRpb25OYW1lfTtcbn1gO1xuXG5jb25zdCBMb2FkaW5nV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYm9yZGVyOiAzcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy5ib3JkZXJDb2xvciB8fCBwcm9wcy50aGVtZS5ib3JkZXJDb2xvckxUfTtcbiAgcGFkZGluZzogMnB4O1xuYDtcblxuY29uc3QgTG9hZGluZ1NwaW5uZXIgPSAoe3NpemUgPSAzMiwgY29sb3IgPSAnJywgYm9yZGVyQ29sb3IgPSAnJywgc3Ryb2tlV2lkdGggPSAzLCBnYXAgPSAyfSkgPT4gKFxuICA8TG9hZGluZ1dyYXBwZXIgc3R5bGU9e3t3aWR0aDogYCR7c2l6ZX1weGAsIGhlaWdodDogYCR7c2l6ZX1weGAsIHBhZGRpbmc6IGAke2dhcH1weGB9fT5cbiAgICA8TG9hZGVyXG4gICAgICBjb2xvcj17Y29sb3J9XG4gICAgICBzdHlsZT17e1xuICAgICAgICB3aWR0aDogYCR7c2l6ZSAtIHN0cm9rZVdpZHRoICogMiAtIGdhcCAqIDJ9cHhgLFxuICAgICAgICBoZWlnaHQ6IGAke3NpemUgLSBzdHJva2VXaWR0aCAqIDIgLSBnYXAgKiAyfXB4YFxuICAgICAgfX1cbiAgICAvPlxuICA8L0xvYWRpbmdXcmFwcGVyPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGluZ1NwaW5uZXI7XG4iXX0=