"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.UploadAnimation = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _icons = require("../common/icons");

var _styledComponents2 = require("../common/styled-components");

var _errorDisplay = _interopRequireDefault(require("./error-display"));

var _localization = require("../../localization");

var _templateObject, _templateObject2, _templateObject3;

var StyledUploader = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n"])));

var StyledMapIcon = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  margin-right: 16px;\n  margin-top: 4px;\n"])), function (props) {
  return props.theme.textColorLT;
});

var StyledSvg = _styledComponents["default"].svg(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 16px;\n\n  line {\n    stroke: ", ";\n    stroke-width: 4;\n    stroke-linecap: square;\n    stroke-dasharray: 5 12;\n    animation: dash-animation 25s infinite linear;\n  }\n  circle {\n    fill: ", ";\n  }\n\n  @keyframes dash-animation {\n    to {\n      stroke-dashoffset: -1000;\n    }\n  }\n"])), function (props) {
  return props.theme.selectBorderColorLT;
}, function (props) {
  return props.theme.selectBorderColorLT;
});

var Line = function Line() {
  return /*#__PURE__*/_react["default"].createElement(StyledSvg, {
    height: "5px",
    width: "150px"
  }, /*#__PURE__*/_react["default"].createElement("line", {
    x1: "0",
    y1: "4",
    x2: "150",
    y2: "4"
  }));
};

var UploadAnimation = function UploadAnimation(props) {
  return /*#__PURE__*/_react["default"].createElement(StyledUploader, null, /*#__PURE__*/_react["default"].createElement(StyledMapIcon, null, /*#__PURE__*/_react["default"].createElement(_icons.MapIcon, {
    height: "48px"
  })), /*#__PURE__*/_react["default"].createElement(Line, null), props.icon && /*#__PURE__*/_react["default"].createElement(props.icon, {
    height: "64px"
  }));
};

exports.UploadAnimation = UploadAnimation;

var StatusPanel = function StatusPanel(_ref) {
  var error = _ref.error,
      isLoading = _ref.isLoading,
      providerIcon = _ref.providerIcon;
  return /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "description"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "title"
  }, isLoading ? /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'modal.statusPanel.mapUploading'
  }) : error ? /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'modal.statusPanel.error'
  }) : null)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "selection"
  }, isLoading && /*#__PURE__*/_react["default"].createElement(UploadAnimation, {
    icon: providerIcon
  }), error && /*#__PURE__*/_react["default"].createElement(_errorDisplay["default"], {
    error: error
  })));
};

var _default = StatusPanel;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zdGF0dXMtcGFuZWwuanMiXSwibmFtZXMiOlsiU3R5bGVkVXBsb2FkZXIiLCJzdHlsZWQiLCJkaXYiLCJTdHlsZWRNYXBJY29uIiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwiU3R5bGVkU3ZnIiwic3ZnIiwic2VsZWN0Qm9yZGVyQ29sb3JMVCIsIkxpbmUiLCJVcGxvYWRBbmltYXRpb24iLCJpY29uIiwiU3RhdHVzUGFuZWwiLCJlcnJvciIsImlzTG9hZGluZyIsInByb3ZpZGVySWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxjQUFjLEdBQUdDLDZCQUFPQyxHQUFWLGtLQUFwQjs7QUFNQSxJQUFNQyxhQUFhLEdBQUdGLDZCQUFPQyxHQUFWLHNKQUNSLFVBQUFFLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQURHLENBQW5COztBQU1BLElBQU1DLFNBQVMsR0FBR04sNkJBQU9PLEdBQVYsb1pBSUQsVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSSxtQkFBaEI7QUFBQSxDQUpKLEVBV0gsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSSxtQkFBaEI7QUFBQSxDQVhGLENBQWY7O0FBcUJBLElBQU1DLElBQUksR0FBRyxTQUFQQSxJQUFPO0FBQUEsc0JBQ1gsZ0NBQUMsU0FBRDtBQUFXLElBQUEsTUFBTSxFQUFDLEtBQWxCO0FBQXdCLElBQUEsS0FBSyxFQUFDO0FBQTlCLGtCQUNFO0FBQU0sSUFBQSxFQUFFLEVBQUMsR0FBVDtBQUFhLElBQUEsRUFBRSxFQUFDLEdBQWhCO0FBQW9CLElBQUEsRUFBRSxFQUFDLEtBQXZCO0FBQTZCLElBQUEsRUFBRSxFQUFDO0FBQWhDLElBREYsQ0FEVztBQUFBLENBQWI7O0FBTU8sSUFBTUMsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixDQUFBUCxLQUFLO0FBQUEsc0JBQ2xDLGdDQUFDLGNBQUQscUJBQ0UsZ0NBQUMsYUFBRCxxQkFDRSxnQ0FBQyxjQUFEO0FBQVMsSUFBQSxNQUFNLEVBQUM7QUFBaEIsSUFERixDQURGLGVBSUUsZ0NBQUMsSUFBRCxPQUpGLEVBS0dBLEtBQUssQ0FBQ1EsSUFBTixpQkFBYyxnQ0FBQyxLQUFELENBQU8sSUFBUDtBQUFZLElBQUEsTUFBTSxFQUFDO0FBQW5CLElBTGpCLENBRGtDO0FBQUEsQ0FBN0I7Ozs7QUFVUCxJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYztBQUFBLE1BQUVDLEtBQUYsUUFBRUEsS0FBRjtBQUFBLE1BQVNDLFNBQVQsUUFBU0EsU0FBVDtBQUFBLE1BQW9CQyxZQUFwQixRQUFvQkEsWUFBcEI7QUFBQSxzQkFDbEIsZ0NBQUMsc0NBQUQscUJBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLGtCQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNHRCxTQUFTLGdCQUNSLGdDQUFDLDhCQUFEO0FBQWtCLElBQUEsRUFBRSxFQUFFO0FBQXRCLElBRFEsR0FFTkQsS0FBSyxnQkFDUCxnQ0FBQyw4QkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRTtBQUF0QixJQURPLEdBRUwsSUFMTixDQURGLENBREYsZUFVRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDR0MsU0FBUyxpQkFBSSxnQ0FBQyxlQUFEO0FBQWlCLElBQUEsSUFBSSxFQUFFQztBQUF2QixJQURoQixFQUVHRixLQUFLLGlCQUFJLGdDQUFDLHdCQUFEO0FBQWMsSUFBQSxLQUFLLEVBQUVBO0FBQXJCLElBRlosQ0FWRixDQURrQjtBQUFBLENBQXBCOztlQWtCZUQsVyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7TWFwSWNvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtTdHlsZWRFeHBvcnRTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgRXJyb3JEaXNwbGF5IGZyb20gJy4vZXJyb3ItZGlzcGxheSc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5cbmNvbnN0IFN0eWxlZFVwbG9hZGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuYDtcblxuY29uc3QgU3R5bGVkTWFwSWNvbiA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgbWFyZ2luLXJpZ2h0OiAxNnB4O1xuICBtYXJnaW4tdG9wOiA0cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRTdmcgPSBzdHlsZWQuc3ZnYFxuICBtYXJnaW4tcmlnaHQ6IDE2cHg7XG5cbiAgbGluZSB7XG4gICAgc3Ryb2tlOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJvcmRlckNvbG9yTFR9O1xuICAgIHN0cm9rZS13aWR0aDogNDtcbiAgICBzdHJva2UtbGluZWNhcDogc3F1YXJlO1xuICAgIHN0cm9rZS1kYXNoYXJyYXk6IDUgMTI7XG4gICAgYW5pbWF0aW9uOiBkYXNoLWFuaW1hdGlvbiAyNXMgaW5maW5pdGUgbGluZWFyO1xuICB9XG4gIGNpcmNsZSB7XG4gICAgZmlsbDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCb3JkZXJDb2xvckxUfTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgZGFzaC1hbmltYXRpb24ge1xuICAgIHRvIHtcbiAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAtMTAwMDtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IExpbmUgPSAoKSA9PiAoXG4gIDxTdHlsZWRTdmcgaGVpZ2h0PVwiNXB4XCIgd2lkdGg9XCIxNTBweFwiPlxuICAgIDxsaW5lIHgxPVwiMFwiIHkxPVwiNFwiIHgyPVwiMTUwXCIgeTI9XCI0XCIgLz5cbiAgPC9TdHlsZWRTdmc+XG4pO1xuXG5leHBvcnQgY29uc3QgVXBsb2FkQW5pbWF0aW9uID0gcHJvcHMgPT4gKFxuICA8U3R5bGVkVXBsb2FkZXI+XG4gICAgPFN0eWxlZE1hcEljb24+XG4gICAgICA8TWFwSWNvbiBoZWlnaHQ9XCI0OHB4XCIgLz5cbiAgICA8L1N0eWxlZE1hcEljb24+XG4gICAgPExpbmUgLz5cbiAgICB7cHJvcHMuaWNvbiAmJiA8cHJvcHMuaWNvbiBoZWlnaHQ9XCI2NHB4XCIgLz59XG4gIDwvU3R5bGVkVXBsb2FkZXI+XG4pO1xuXG5jb25zdCBTdGF0dXNQYW5lbCA9ICh7ZXJyb3IsIGlzTG9hZGluZywgcHJvdmlkZXJJY29ufSkgPT4gKFxuICA8U3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgIHtpc0xvYWRpbmcgPyAoXG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zdGF0dXNQYW5lbC5tYXBVcGxvYWRpbmcnfSAvPlxuICAgICAgICApIDogZXJyb3IgPyAoXG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zdGF0dXNQYW5lbC5lcnJvcid9IC8+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgIHtpc0xvYWRpbmcgJiYgPFVwbG9hZEFuaW1hdGlvbiBpY29uPXtwcm92aWRlckljb259IC8+fVxuICAgICAge2Vycm9yICYmIDxFcnJvckRpc3BsYXkgZXJyb3I9e2Vycm9yfSAvPn1cbiAgICA8L2Rpdj5cbiAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgU3RhdHVzUGFuZWw7XG4iXX0=