"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _loadingSpinner = _interopRequireDefault(require("../common/loading-spinner"));

var _reactIntl = require("react-intl");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-grow: 1;\n\n  .loading-content {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n\n  .loading-message {\n    margin-left: 32px;\n    color: ", ";\n    font-weight: 500;\n    font-size: 14px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  text-align: center;\n\n  span {\n    margin: 0 auto;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledSpinner = _styledComponents["default"].div(_templateObject());

var StyledLoadingDialog = _styledComponents["default"].div.attrs({
  className: 'data-loading-dialog'
})(_templateObject2(), function (props) {
  return props.theme.titleColorLT;
});

var LoadingDialog = function LoadingDialog(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 64 : _ref$size,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? 'modal.loadingDialog.loading' : _ref$message;
  return _react["default"].createElement(StyledLoadingDialog, null, _react["default"].createElement("div", {
    className: "loading-content"
  }, _react["default"].createElement(StyledSpinner, null, _react["default"].createElement(_loadingSpinner["default"], {
    size: size
  })), _react["default"].createElement("div", {
    className: "loading-message"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: message
  }))));
};

var _default = LoadingDialog;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9sb2FkaW5nLWRpYWxvZy5qcyJdLCJuYW1lcyI6WyJTdHlsZWRTcGlubmVyIiwic3R5bGVkIiwiZGl2IiwiU3R5bGVkTG9hZGluZ0RpYWxvZyIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsInRpdGxlQ29sb3JMVCIsIkxvYWRpbmdEaWFsb2ciLCJzaXplIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxhQUFhLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUFuQjs7QUFRQSxJQUFNQyxtQkFBbUIsR0FBR0YsNkJBQU9DLEdBQVAsQ0FBV0UsS0FBWCxDQUFpQjtBQUMzQ0MsRUFBQUEsU0FBUyxFQUFFO0FBRGdDLENBQWpCLENBQUgscUJBZ0JaLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsWUFBaEI7QUFBQSxDQWhCTyxDQUF6Qjs7QUFzQkEsSUFBTUMsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQjtBQUFBLHVCQUFFQyxJQUFGO0FBQUEsTUFBRUEsSUFBRiwwQkFBUyxFQUFUO0FBQUEsMEJBQWFDLE9BQWI7QUFBQSxNQUFhQSxPQUFiLDZCQUF1Qiw2QkFBdkI7QUFBQSxTQUNwQixnQ0FBQyxtQkFBRCxRQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFLGdDQUFDLGFBQUQsUUFDRSxnQ0FBQywwQkFBRDtBQUFnQixJQUFBLElBQUksRUFBRUQ7QUFBdEIsSUFERixDQURGLEVBSUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsSUFBQSxFQUFFLEVBQUVDO0FBQXRCLElBREYsQ0FKRixDQURGLENBRG9CO0FBQUEsQ0FBdEI7O2VBYWVGLGEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgTG9hZGluZ1NwaW5uZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vbG9hZGluZy1zcGlubmVyJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IFN0eWxlZFNwaW5uZXIgPSBzdHlsZWQuZGl2YFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgc3BhbiB7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZExvYWRpbmdEaWFsb2cgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnZGF0YS1sb2FkaW5nLWRpYWxvZydcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZmxleC1ncm93OiAxO1xuXG4gIC5sb2FkaW5nLWNvbnRlbnQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuXG4gIC5sb2FkaW5nLW1lc3NhZ2Uge1xuICAgIG1hcmdpbi1sZWZ0OiAzMnB4O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gIH1cbmA7XG5cbmNvbnN0IExvYWRpbmdEaWFsb2cgPSAoe3NpemUgPSA2NCwgbWVzc2FnZSA9ICdtb2RhbC5sb2FkaW5nRGlhbG9nLmxvYWRpbmcnfSkgPT4gKFxuICA8U3R5bGVkTG9hZGluZ0RpYWxvZz5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxvYWRpbmctY29udGVudFwiPlxuICAgICAgPFN0eWxlZFNwaW5uZXI+XG4gICAgICAgIDxMb2FkaW5nU3Bpbm5lciBzaXplPXtzaXplfSAvPlxuICAgICAgPC9TdHlsZWRTcGlubmVyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2FkaW5nLW1lc3NhZ2VcIj5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e21lc3NhZ2V9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9TdHlsZWRMb2FkaW5nRGlhbG9nPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGluZ0RpYWxvZztcbiJdfQ==