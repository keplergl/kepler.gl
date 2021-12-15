"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactJsonPretty = _interopRequireDefault(require("react-json-pretty"));

var _userGuides = require("../../../constants/user-guides");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styledComponents2 = require("../../common/styled-components");

var _components = require("./components");

var _localization = require("../../../localization");

var _templateObject;

var StyledJsonExportSection = (0, _styledComponents["default"])(_styledComponents2.StyledExportSection)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .note {\n    color: ", ";\n    font-size: 11px;\n  }\n\n  .viewer {\n    border: 1px solid ", ";\n    background-color: white;\n    border-radius: 2px;\n    display: inline-block;\n    font: inherit;\n    line-height: 1.5em;\n    padding: 0.5em 3.5em 0.5em 1em;\n    margin: 0;\n    box-sizing: border-box;\n    height: 180px;\n    width: 100%;\n    overflow-y: scroll;\n    overflow-x: auto;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n    max-width: 600px;\n  }\n"])), function (props) {
  return props.theme.errorColor;
}, function (props) {
  return props.theme.selectBorderColorLT;
});
var exportJsonPropTypes = {
  options: _propTypes["default"].object
};

var ExportJsonMapUnmemoized = function ExportJsonMapUnmemoized(_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === void 0 ? {} : _ref$config;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_components.StyledExportMapSection, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "description"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "selection"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'modal.exportMap.json.selection'
  }))), /*#__PURE__*/_react["default"].createElement(StyledJsonExportSection, {
    className: "export-map-modal__json-options"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "description"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "title"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'modal.exportMap.json.configTitle'
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "subtitle"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'modal.exportMap.json.configDisclaimer'
  }), /*#__PURE__*/_react["default"].createElement(_components.ExportMapLink, {
    href: _userGuides.ADD_DATA_TO_MAP_DOC
  }, "addDataToMap"), ".")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "selection"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "viewer"
  }, /*#__PURE__*/_react["default"].createElement(_reactJsonPretty["default"], {
    id: "json-pretty",
    json: config
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "disclaimer"
  }, /*#__PURE__*/_react["default"].createElement(_components.StyledWarning, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'modal.exportMap.json.disclaimer'
  }))))));
};

ExportJsonMapUnmemoized.propTypes = exportJsonPropTypes;
ExportJsonMapUnmemoized.displayName = 'ExportJsonMap';

var ExportJsonMap = /*#__PURE__*/_react["default"].memo(ExportJsonMapUnmemoized);

var ExportJsonMapFactory = function ExportJsonMapFactory() {
  return ExportJsonMap;
};

var _default = ExportJsonMapFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtbWFwLW1vZGFsL2V4cG9ydC1qc29uLW1hcC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRKc29uRXhwb3J0U2VjdGlvbiIsIlN0eWxlZEV4cG9ydFNlY3Rpb24iLCJwcm9wcyIsInRoZW1lIiwiZXJyb3JDb2xvciIsInNlbGVjdEJvcmRlckNvbG9yTFQiLCJleHBvcnRKc29uUHJvcFR5cGVzIiwib3B0aW9ucyIsIlByb3BUeXBlcyIsIm9iamVjdCIsIkV4cG9ydEpzb25NYXBVbm1lbW9pemVkIiwiY29uZmlnIiwiQUREX0RBVEFfVE9fTUFQX0RPQyIsInByb3BUeXBlcyIsImRpc3BsYXlOYW1lIiwiRXhwb3J0SnNvbk1hcCIsIlJlYWN0IiwibWVtbyIsIkV4cG9ydEpzb25NYXBGYWN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLHVCQUF1QixHQUFHLGtDQUFPQyxzQ0FBUCxDQUFILHlqQkFFaEIsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxVQUFoQjtBQUFBLENBRlcsRUFPTCxVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLG1CQUFoQjtBQUFBLENBUEEsQ0FBN0I7QUEwQkEsSUFBTUMsbUJBQW1CLEdBQUc7QUFDMUJDLEVBQUFBLE9BQU8sRUFBRUMsc0JBQVVDO0FBRE8sQ0FBNUI7O0FBSUEsSUFBTUMsdUJBQXVCLEdBQUcsU0FBMUJBLHVCQUEwQjtBQUFBLHlCQUFFQyxNQUFGO0FBQUEsTUFBRUEsTUFBRiw0QkFBVyxFQUFYO0FBQUEsc0JBQzlCLDBEQUNFLGdDQUFDLGtDQUFELHFCQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixJQURGLGVBRUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLGtCQUNFLGdDQUFDLDhCQUFEO0FBQWtCLElBQUEsRUFBRSxFQUFFO0FBQXRCLElBREYsQ0FGRixDQURGLGVBT0UsZ0NBQUMsdUJBQUQ7QUFBeUIsSUFBQSxTQUFTLEVBQUM7QUFBbkMsa0JBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLGtCQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixrQkFDRSxnQ0FBQyw4QkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRTtBQUF0QixJQURGLENBREYsZUFJRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsa0JBQ0UsZ0NBQUMsOEJBQUQ7QUFBa0IsSUFBQSxFQUFFLEVBQUU7QUFBdEIsSUFERixlQUVFLGdDQUFDLHlCQUFEO0FBQWUsSUFBQSxJQUFJLEVBQUVDO0FBQXJCLG9CQUZGLE1BSkYsQ0FERixlQVVFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixrQkFDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsa0JBQ0UsZ0NBQUMsMkJBQUQ7QUFBWSxJQUFBLEVBQUUsRUFBQyxhQUFmO0FBQTZCLElBQUEsSUFBSSxFQUFFRDtBQUFuQyxJQURGLENBREYsZUFJRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsa0JBQ0UsZ0NBQUMseUJBQUQscUJBQ0UsZ0NBQUMsOEJBQUQ7QUFBa0IsSUFBQSxFQUFFLEVBQUU7QUFBdEIsSUFERixDQURGLENBSkYsQ0FWRixDQVBGLENBRDhCO0FBQUEsQ0FBaEM7O0FBZ0NBRCx1QkFBdUIsQ0FBQ0csU0FBeEIsR0FBb0NQLG1CQUFwQztBQUVBSSx1QkFBdUIsQ0FBQ0ksV0FBeEIsR0FBc0MsZUFBdEM7O0FBRUEsSUFBTUMsYUFBYSxnQkFBR0Msa0JBQU1DLElBQU4sQ0FBV1AsdUJBQVgsQ0FBdEI7O0FBRUEsSUFBTVEsb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QjtBQUFBLFNBQU1ILGFBQU47QUFBQSxDQUE3Qjs7ZUFFZUcsb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBKU09OUHJldHR5IGZyb20gJ3JlYWN0LWpzb24tcHJldHR5JztcbmltcG9ydCB7QUREX0RBVEFfVE9fTUFQX0RPQ30gZnJvbSAnY29uc3RhbnRzL3VzZXItZ3VpZGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtTdHlsZWRFeHBvcnRTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1N0eWxlZEV4cG9ydE1hcFNlY3Rpb24sIFN0eWxlZFdhcm5pbmcsIEV4cG9ydE1hcExpbmt9IGZyb20gJy4vY29tcG9uZW50cyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5cbmNvbnN0IFN0eWxlZEpzb25FeHBvcnRTZWN0aW9uID0gc3R5bGVkKFN0eWxlZEV4cG9ydFNlY3Rpb24pYFxuICAubm90ZSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZXJyb3JDb2xvcn07XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICB9XG5cbiAgLnZpZXdlciB7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCb3JkZXJDb2xvckxUfTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIGZvbnQ6IGluaGVyaXQ7XG4gICAgbGluZS1oZWlnaHQ6IDEuNWVtO1xuICAgIHBhZGRpbmc6IDAuNWVtIDMuNWVtIDAuNWVtIDFlbTtcbiAgICBtYXJnaW46IDA7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBoZWlnaHQ6IDE4MHB4O1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG92ZXJmbG93LXk6IHNjcm9sbDtcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xuICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbiAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG4gICAgbWF4LXdpZHRoOiA2MDBweDtcbiAgfVxuYDtcblxuY29uc3QgZXhwb3J0SnNvblByb3BUeXBlcyA9IHtcbiAgb3B0aW9uczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuY29uc3QgRXhwb3J0SnNvbk1hcFVubWVtb2l6ZWQgPSAoe2NvbmZpZyA9IHt9fSkgPT4gKFxuICA8ZGl2PlxuICAgIDxTdHlsZWRFeHBvcnRNYXBTZWN0aW9uPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5qc29uLnNlbGVjdGlvbid9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L1N0eWxlZEV4cG9ydE1hcFNlY3Rpb24+XG4gICAgPFN0eWxlZEpzb25FeHBvcnRTZWN0aW9uIGNsYXNzTmFtZT1cImV4cG9ydC1tYXAtbW9kYWxfX2pzb24tb3B0aW9uc1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuanNvbi5jb25maWdUaXRsZSd9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1YnRpdGxlXCI+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuanNvbi5jb25maWdEaXNjbGFpbWVyJ30gLz5cbiAgICAgICAgICA8RXhwb3J0TWFwTGluayBocmVmPXtBRERfREFUQV9UT19NQVBfRE9DfT5hZGREYXRhVG9NYXA8L0V4cG9ydE1hcExpbms+LlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aWV3ZXJcIj5cbiAgICAgICAgICA8SlNPTlByZXR0eSBpZD1cImpzb24tcHJldHR5XCIganNvbj17Y29uZmlnfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaXNjbGFpbWVyXCI+XG4gICAgICAgICAgPFN0eWxlZFdhcm5pbmc+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5qc29uLmRpc2NsYWltZXInfSAvPlxuICAgICAgICAgIDwvU3R5bGVkV2FybmluZz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L1N0eWxlZEpzb25FeHBvcnRTZWN0aW9uPlxuICA8L2Rpdj5cbik7XG5cbkV4cG9ydEpzb25NYXBVbm1lbW9pemVkLnByb3BUeXBlcyA9IGV4cG9ydEpzb25Qcm9wVHlwZXM7XG5cbkV4cG9ydEpzb25NYXBVbm1lbW9pemVkLmRpc3BsYXlOYW1lID0gJ0V4cG9ydEpzb25NYXAnO1xuXG5jb25zdCBFeHBvcnRKc29uTWFwID0gUmVhY3QubWVtbyhFeHBvcnRKc29uTWFwVW5tZW1vaXplZCk7XG5cbmNvbnN0IEV4cG9ydEpzb25NYXBGYWN0b3J5ID0gKCkgPT4gRXhwb3J0SnNvbk1hcDtcblxuZXhwb3J0IGRlZmF1bHQgRXhwb3J0SnNvbk1hcEZhY3Rvcnk7XG4iXX0=