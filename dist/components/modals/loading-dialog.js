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

var _localization = require("../../localization");

var _templateObject, _templateObject2;

var StyledSpinner = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  text-align: center;\n\n  span {\n    margin: 0 auto;\n  }\n"])));

var StyledLoadingDialog = _styledComponents["default"].div.attrs({
  className: 'data-loading-dialog'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-grow: 1;\n\n  .loading-content {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n\n  .loading-message {\n    margin-left: 32px;\n    color: ", ";\n    font-weight: 500;\n    font-size: 14px;\n  }\n"])), function (props) {
  return props.theme.titleColorLT;
});

var LoadingDialog = function LoadingDialog(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 64 : _ref$size,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? 'modal.loadingDialog.loading' : _ref$message;
  return /*#__PURE__*/_react["default"].createElement(StyledLoadingDialog, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "loading-content"
  }, /*#__PURE__*/_react["default"].createElement(StyledSpinner, null, /*#__PURE__*/_react["default"].createElement(_loadingSpinner["default"], {
    size: size
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "loading-message"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: message
  }))));
};

var _default = LoadingDialog;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9sb2FkaW5nLWRpYWxvZy5qcyJdLCJuYW1lcyI6WyJTdHlsZWRTcGlubmVyIiwic3R5bGVkIiwiZGl2IiwiU3R5bGVkTG9hZGluZ0RpYWxvZyIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsInRpdGxlQ29sb3JMVCIsIkxvYWRpbmdEaWFsb2ciLCJzaXplIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxhQUFhLEdBQUdDLDZCQUFPQyxHQUFWLHFKQUFuQjs7QUFRQSxJQUFNQyxtQkFBbUIsR0FBR0YsNkJBQU9DLEdBQVAsQ0FBV0UsS0FBWCxDQUFpQjtBQUMzQ0MsRUFBQUEsU0FBUyxFQUFFO0FBRGdDLENBQWpCLENBQUgsK1lBZ0JaLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsWUFBaEI7QUFBQSxDQWhCTyxDQUF6Qjs7QUFzQkEsSUFBTUMsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQjtBQUFBLHVCQUFFQyxJQUFGO0FBQUEsTUFBRUEsSUFBRiwwQkFBUyxFQUFUO0FBQUEsMEJBQWFDLE9BQWI7QUFBQSxNQUFhQSxPQUFiLDZCQUF1Qiw2QkFBdkI7QUFBQSxzQkFDcEIsZ0NBQUMsbUJBQUQscUJBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLGtCQUNFLGdDQUFDLGFBQUQscUJBQ0UsZ0NBQUMsMEJBQUQ7QUFBZ0IsSUFBQSxJQUFJLEVBQUVEO0FBQXRCLElBREYsQ0FERixlQUlFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixrQkFDRSxnQ0FBQyw4QkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRUM7QUFBdEIsSUFERixDQUpGLENBREYsQ0FEb0I7QUFBQSxDQUF0Qjs7ZUFhZUYsYSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBMb2FkaW5nU3Bpbm5lciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9sb2FkaW5nLXNwaW5uZXInO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBTdHlsZWRTcGlubmVyID0gc3R5bGVkLmRpdmBcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gIHNwYW4ge1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRMb2FkaW5nRGlhbG9nID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2RhdGEtbG9hZGluZy1kaWFsb2cnXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtZ3JvdzogMTtcblxuICAubG9hZGluZy1jb250ZW50IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIH1cblxuICAubG9hZGluZy1tZXNzYWdlIHtcbiAgICBtYXJnaW4tbGVmdDogMzJweDtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICB9XG5gO1xuXG5jb25zdCBMb2FkaW5nRGlhbG9nID0gKHtzaXplID0gNjQsIG1lc3NhZ2UgPSAnbW9kYWwubG9hZGluZ0RpYWxvZy5sb2FkaW5nJ30pID0+IChcbiAgPFN0eWxlZExvYWRpbmdEaWFsb2c+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsb2FkaW5nLWNvbnRlbnRcIj5cbiAgICAgIDxTdHlsZWRTcGlubmVyPlxuICAgICAgICA8TG9hZGluZ1NwaW5uZXIgc2l6ZT17c2l6ZX0gLz5cbiAgICAgIDwvU3R5bGVkU3Bpbm5lcj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG9hZGluZy1tZXNzYWdlXCI+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXttZXNzYWdlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvU3R5bGVkTG9hZGluZ0RpYWxvZz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRpbmdEaWFsb2c7XG4iXX0=