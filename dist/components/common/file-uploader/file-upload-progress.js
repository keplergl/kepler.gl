"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _progressBar = _interopRequireDefault(require("../progress-bar"));

var _styledComponents2 = require("../styled-components");

var _utils = require("../../../utils/utils");

var _templateObject, _templateObject2, _templateObject3;

/** @typedef {import('./file-upload-progress').FileUploadProgressProps} FileUploadProgressProps*/
var StyledFileProgress = _styledComponents["default"].div.attrs({
  className: 'file-upload__progress'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 12px;\n  margin-top: 12px;\n  border-image: initial;\n  padding: 8px 12px;\n\n  .top-row {\n    display: flex;\n    justify-content: space-between;\n  }\n\n  .file-name {\n    font-weight: 500;\n  }\n  .middle-row {\n    margin-top: 6px;\n  }\n  .bottom-row {\n    margin-top: 6px;\n    text-align: start;\n  }\n"])), function (props) {
  return props.theme.textColorLT;
});

var StyledProgressWrapper = _styledComponents["default"].div.attrs({
  className: 'file-upload__progress__wrapper'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 400px;\n"])));

var StyledContainer = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  display: flex;\n  justify-content: center;\n"])));

var formatPercent = function formatPercent(percent) {
  return "".concat(Math.floor(percent * 100), "%");
};
/**
 * @param {object} params
 * @param {string} params.message
 * @param {string} params.fileName
 * @param {number} params.percent
 * @param {any} params.error
 * @param {object} params.theme
 */


var UploadProgress = function UploadProgress(_ref) {
  var message = _ref.message,
      fileName = _ref.fileName,
      percent = _ref.percent,
      error = _ref.error,
      theme = _ref.theme;
  var percentStr = formatPercent(percent);
  var barColor = error ? theme.errorColor : theme.activeColorLT;
  return /*#__PURE__*/_react["default"].createElement(StyledFileProgress, {
    className: "file-upload-progress__message"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "top-row"
  }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.TruncatedTitleText, {
    className: "file-name",
    title: fileName
  }, fileName), /*#__PURE__*/_react["default"].createElement("div", {
    className: "percent"
  }, percentStr)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "middle-row"
  }, /*#__PURE__*/_react["default"].createElement(_progressBar["default"], {
    percent: percentStr,
    barColor: barColor,
    isLoading: true,
    theme: theme
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "bottom-row",
    style: {
      color: error ? theme.errorColor : theme.textColorLT
    }
  }, error ? (0, _utils.getError)(error) : message));
};
/** @type {React.FunctionComponent<FileUploadProgressProps>} */


var FileUploadProgress = function FileUploadProgress(_ref2) {
  var fileLoadingProgress = _ref2.fileLoadingProgress,
      theme = _ref2.theme;
  return /*#__PURE__*/_react["default"].createElement(StyledContainer, null, /*#__PURE__*/_react["default"].createElement(StyledProgressWrapper, null, Object.values(fileLoadingProgress).map(function (item) {
    return /*#__PURE__*/_react["default"].createElement(UploadProgress, (0, _extends2["default"])({}, item, {
      key: item.fileName,
      theme: theme
    }));
  })));
};

var _default = (0, _styledComponents.withTheme)(FileUploadProgress);

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkLXByb2dyZXNzLmpzIl0sIm5hbWVzIjpbIlN0eWxlZEZpbGVQcm9ncmVzcyIsInN0eWxlZCIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwiU3R5bGVkUHJvZ3Jlc3NXcmFwcGVyIiwiU3R5bGVkQ29udGFpbmVyIiwiZm9ybWF0UGVyY2VudCIsInBlcmNlbnQiLCJNYXRoIiwiZmxvb3IiLCJVcGxvYWRQcm9ncmVzcyIsIm1lc3NhZ2UiLCJmaWxlTmFtZSIsImVycm9yIiwicGVyY2VudFN0ciIsImJhckNvbG9yIiwiZXJyb3JDb2xvciIsImFjdGl2ZUNvbG9yTFQiLCJjb2xvciIsIkZpbGVVcGxvYWRQcm9ncmVzcyIsImZpbGVMb2FkaW5nUHJvZ3Jlc3MiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJpdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTtBQUVBLElBQU1BLGtCQUFrQixHQUFHQyw2QkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQzFDQyxFQUFBQSxTQUFTLEVBQUU7QUFEK0IsQ0FBakIsQ0FBSCw4YUFHYixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFdBQWhCO0FBQUEsQ0FIUSxDQUF4Qjs7QUEwQkEsSUFBTUMscUJBQXFCLEdBQUdQLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDN0NDLEVBQUFBLFNBQVMsRUFBRTtBQURrQyxDQUFqQixDQUFILDJHQUEzQjs7QUFNQSxJQUFNSyxlQUFlLEdBQUdSLDZCQUFPQyxHQUFWLHdKQUFyQjs7QUFNQSxJQUFNUSxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUFDLE9BQU87QUFBQSxtQkFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVdGLE9BQU8sR0FBRyxHQUFyQixDQUFQO0FBQUEsQ0FBN0I7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNRyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLE9BQWdEO0FBQUEsTUFBOUNDLE9BQThDLFFBQTlDQSxPQUE4QztBQUFBLE1BQXJDQyxRQUFxQyxRQUFyQ0EsUUFBcUM7QUFBQSxNQUEzQkwsT0FBMkIsUUFBM0JBLE9BQTJCO0FBQUEsTUFBbEJNLEtBQWtCLFFBQWxCQSxLQUFrQjtBQUFBLE1BQVhYLEtBQVcsUUFBWEEsS0FBVztBQUNyRSxNQUFNWSxVQUFVLEdBQUdSLGFBQWEsQ0FBQ0MsT0FBRCxDQUFoQztBQUNBLE1BQU1RLFFBQVEsR0FBR0YsS0FBSyxHQUFHWCxLQUFLLENBQUNjLFVBQVQsR0FBc0JkLEtBQUssQ0FBQ2UsYUFBbEQ7QUFFQSxzQkFDRSxnQ0FBQyxrQkFBRDtBQUFvQixJQUFBLFNBQVMsRUFBQztBQUE5QixrQkFDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsa0JBQ0UsZ0NBQUMscUNBQUQ7QUFBb0IsSUFBQSxTQUFTLEVBQUMsV0FBOUI7QUFBMEMsSUFBQSxLQUFLLEVBQUVMO0FBQWpELEtBQ0dBLFFBREgsQ0FERixlQUlFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUEwQkUsVUFBMUIsQ0FKRixDQURGLGVBT0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLGtCQUNFLGdDQUFDLHVCQUFEO0FBQWEsSUFBQSxPQUFPLEVBQUVBLFVBQXRCO0FBQWtDLElBQUEsUUFBUSxFQUFFQyxRQUE1QztBQUFzRCxJQUFBLFNBQVMsTUFBL0Q7QUFBZ0UsSUFBQSxLQUFLLEVBQUViO0FBQXZFLElBREYsQ0FQRixlQVVFO0FBQUssSUFBQSxTQUFTLEVBQUMsWUFBZjtBQUE0QixJQUFBLEtBQUssRUFBRTtBQUFDZ0IsTUFBQUEsS0FBSyxFQUFFTCxLQUFLLEdBQUdYLEtBQUssQ0FBQ2MsVUFBVCxHQUFzQmQsS0FBSyxDQUFDQztBQUF6QztBQUFuQyxLQUNHVSxLQUFLLEdBQUcscUJBQVNBLEtBQVQsQ0FBSCxHQUFxQkYsT0FEN0IsQ0FWRixDQURGO0FBZ0JELENBcEJEO0FBc0JBOzs7QUFDQSxJQUFNUSxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCO0FBQUEsTUFBRUMsbUJBQUYsU0FBRUEsbUJBQUY7QUFBQSxNQUF1QmxCLEtBQXZCLFNBQXVCQSxLQUF2QjtBQUFBLHNCQUN6QixnQ0FBQyxlQUFELHFCQUNFLGdDQUFDLHFCQUFELFFBQ0dtQixNQUFNLENBQUNDLE1BQVAsQ0FBY0YsbUJBQWQsRUFBbUNHLEdBQW5DLENBQXVDLFVBQUFDLElBQUk7QUFBQSx3QkFDMUMsZ0NBQUMsY0FBRCxnQ0FBb0JBLElBQXBCO0FBQTBCLE1BQUEsR0FBRyxFQUFFQSxJQUFJLENBQUNaLFFBQXBDO0FBQThDLE1BQUEsS0FBSyxFQUFFVjtBQUFyRCxPQUQwQztBQUFBLEdBQTNDLENBREgsQ0FERixDQUR5QjtBQUFBLENBQTNCOztlQVVlLGlDQUFVaUIsa0JBQVYsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkLCB7d2l0aFRoZW1lfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvZ3Jlc3NCYXIgZnJvbSAnLi4vcHJvZ3Jlc3MtYmFyJztcbmltcG9ydCB7VHJ1bmNhdGVkVGl0bGVUZXh0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2dldEVycm9yfSBmcm9tICd1dGlscy91dGlscyc7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2ZpbGUtdXBsb2FkLXByb2dyZXNzJykuRmlsZVVwbG9hZFByb2dyZXNzUHJvcHN9IEZpbGVVcGxvYWRQcm9ncmVzc1Byb3BzKi9cblxuY29uc3QgU3R5bGVkRmlsZVByb2dyZXNzID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2ZpbGUtdXBsb2FkX19wcm9ncmVzcydcbn0pYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbWFyZ2luLXRvcDogMTJweDtcbiAgYm9yZGVyLWltYWdlOiBpbml0aWFsO1xuICBwYWRkaW5nOiA4cHggMTJweDtcblxuICAudG9wLXJvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIH1cblxuICAuZmlsZS1uYW1lIHtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG4gIC5taWRkbGUtcm93IHtcbiAgICBtYXJnaW4tdG9wOiA2cHg7XG4gIH1cbiAgLmJvdHRvbS1yb3cge1xuICAgIG1hcmdpbi10b3A6IDZweDtcbiAgICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkUHJvZ3Jlc3NXcmFwcGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2ZpbGUtdXBsb2FkX19wcm9ncmVzc19fd3JhcHBlcidcbn0pYFxuICB3aWR0aDogNDAwcHg7XG5gO1xuXG5jb25zdCBTdHlsZWRDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5gO1xuXG5jb25zdCBmb3JtYXRQZXJjZW50ID0gcGVyY2VudCA9PiBgJHtNYXRoLmZsb29yKHBlcmNlbnQgKiAxMDApfSVgO1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMubWVzc2FnZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5maWxlTmFtZVxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5wZXJjZW50XG4gKiBAcGFyYW0ge2FueX0gcGFyYW1zLmVycm9yXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zLnRoZW1lXG4gKi9cbmNvbnN0IFVwbG9hZFByb2dyZXNzID0gKHttZXNzYWdlLCBmaWxlTmFtZSwgcGVyY2VudCwgZXJyb3IsIHRoZW1lfSkgPT4ge1xuICBjb25zdCBwZXJjZW50U3RyID0gZm9ybWF0UGVyY2VudChwZXJjZW50KTtcbiAgY29uc3QgYmFyQ29sb3IgPSBlcnJvciA/IHRoZW1lLmVycm9yQ29sb3IgOiB0aGVtZS5hY3RpdmVDb2xvckxUO1xuXG4gIHJldHVybiAoXG4gICAgPFN0eWxlZEZpbGVQcm9ncmVzcyBjbGFzc05hbWU9XCJmaWxlLXVwbG9hZC1wcm9ncmVzc19fbWVzc2FnZVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b3Atcm93XCI+XG4gICAgICAgIDxUcnVuY2F0ZWRUaXRsZVRleHQgY2xhc3NOYW1lPVwiZmlsZS1uYW1lXCIgdGl0bGU9e2ZpbGVOYW1lfT5cbiAgICAgICAgICB7ZmlsZU5hbWV9XG4gICAgICAgIDwvVHJ1bmNhdGVkVGl0bGVUZXh0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcmNlbnRcIj57cGVyY2VudFN0cn08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaWRkbGUtcm93XCI+XG4gICAgICAgIDxQcm9ncmVzc0JhciBwZXJjZW50PXtwZXJjZW50U3RyfSBiYXJDb2xvcj17YmFyQ29sb3J9IGlzTG9hZGluZyB0aGVtZT17dGhlbWV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm90dG9tLXJvd1wiIHN0eWxlPXt7Y29sb3I6IGVycm9yID8gdGhlbWUuZXJyb3JDb2xvciA6IHRoZW1lLnRleHRDb2xvckxUfX0+XG4gICAgICAgIHtlcnJvciA/IGdldEVycm9yKGVycm9yKSA6IG1lc3NhZ2V9XG4gICAgICA8L2Rpdj5cbiAgICA8L1N0eWxlZEZpbGVQcm9ncmVzcz5cbiAgKTtcbn07XG5cbi8qKiBAdHlwZSB7UmVhY3QuRnVuY3Rpb25Db21wb25lbnQ8RmlsZVVwbG9hZFByb2dyZXNzUHJvcHM+fSAqL1xuY29uc3QgRmlsZVVwbG9hZFByb2dyZXNzID0gKHtmaWxlTG9hZGluZ1Byb2dyZXNzLCB0aGVtZX0pID0+IChcbiAgPFN0eWxlZENvbnRhaW5lcj5cbiAgICA8U3R5bGVkUHJvZ3Jlc3NXcmFwcGVyPlxuICAgICAge09iamVjdC52YWx1ZXMoZmlsZUxvYWRpbmdQcm9ncmVzcykubWFwKGl0ZW0gPT4gKFxuICAgICAgICA8VXBsb2FkUHJvZ3Jlc3Mgey4uLml0ZW19IGtleT17aXRlbS5maWxlTmFtZX0gdGhlbWU9e3RoZW1lfSAvPlxuICAgICAgKSl9XG4gICAgPC9TdHlsZWRQcm9ncmVzc1dyYXBwZXI+XG4gIDwvU3R5bGVkQ29udGFpbmVyPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgd2l0aFRoZW1lKEZpbGVVcGxvYWRQcm9ncmVzcyk7XG4iXX0=