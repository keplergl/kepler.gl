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

var _reactIntl = require("react-intl");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .note {\n    color: ", ";\n    font-size: 11px;\n  }\n\n  .viewer {\n    border: 1px solid ", ";\n    background-color: white;\n    border-radius: 2px;\n    display: inline-block;\n    font: inherit;\n    line-height: 1.5em;\n    padding: 0.5em 3.5em 0.5em 1em;\n    margin: 0;\n    box-sizing: border-box;\n    height: 180px;\n    width: 100%;\n    overflow-y: scroll;\n    overflow-x: auto;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n    max-width: 600px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledJsonExportSection = (0, _styledComponents["default"])(_styledComponents2.StyledExportSection)(_templateObject(), function (props) {
  return props.theme.errorColor;
}, function (props) {
  return props.theme.selectBorderColorLT;
});
var exportJsonPropTypes = {
  options: _propTypes["default"].object
};

var ExportJsonMap = _react["default"].memo(function (_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === void 0 ? {} : _ref$config;
  return _react["default"].createElement("div", null, _react["default"].createElement(_components.StyledExportMapSection, null, _react["default"].createElement("div", {
    className: "description"
  }), _react["default"].createElement("div", {
    className: "selection"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.json.selection'
  }))), _react["default"].createElement(StyledJsonExportSection, {
    className: "export-map-modal__json-options"
  }, _react["default"].createElement("div", {
    className: "description"
  }, _react["default"].createElement("div", {
    className: "title"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.json.configTitle'
  })), _react["default"].createElement("div", {
    className: "subtitle"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.json.configDisclaimer'
  }), _react["default"].createElement(_components.ExportMapLink, {
    href: _userGuides.ADD_DATA_TO_MAP_DOC
  }, "addDataToMap"), ".")), _react["default"].createElement("div", {
    className: "selection"
  }, _react["default"].createElement("div", {
    className: "viewer"
  }, _react["default"].createElement(_reactJsonPretty["default"], {
    id: "json-pretty",
    json: config
  })), _react["default"].createElement("div", {
    className: "disclaimer"
  }, _react["default"].createElement(_components.StyledWarning, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.json.disclaimer'
  }))))));
});

ExportJsonMap.propTypes = exportJsonPropTypes;
ExportJsonMap.displayName = 'ExportJsonMap';

var ExportJsonMapFactory = function ExportJsonMapFactory() {
  return ExportJsonMap;
};

var _default = ExportJsonMapFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtbWFwLW1vZGFsL2V4cG9ydC1qc29uLW1hcC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRKc29uRXhwb3J0U2VjdGlvbiIsIlN0eWxlZEV4cG9ydFNlY3Rpb24iLCJwcm9wcyIsInRoZW1lIiwiZXJyb3JDb2xvciIsInNlbGVjdEJvcmRlckNvbG9yTFQiLCJleHBvcnRKc29uUHJvcFR5cGVzIiwib3B0aW9ucyIsIlByb3BUeXBlcyIsIm9iamVjdCIsIkV4cG9ydEpzb25NYXAiLCJSZWFjdCIsIm1lbW8iLCJjb25maWciLCJBRERfREFUQV9UT19NQVBfRE9DIiwicHJvcFR5cGVzIiwiZGlzcGxheU5hbWUiLCJFeHBvcnRKc29uTWFwRmFjdG9yeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLHVCQUF1QixHQUFHLGtDQUFPQyxzQ0FBUCxDQUFILG9CQUVoQixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQWhCO0FBQUEsQ0FGVyxFQU9MLFVBQUFGLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUUsbUJBQWhCO0FBQUEsQ0FQQSxDQUE3QjtBQTBCQSxJQUFNQyxtQkFBbUIsR0FBRztBQUMxQkMsRUFBQUEsT0FBTyxFQUFFQyxzQkFBVUM7QUFETyxDQUE1Qjs7QUFJQSxJQUFNQyxhQUFhLEdBQUdDLGtCQUFNQyxJQUFOLENBQVc7QUFBQSx5QkFBRUMsTUFBRjtBQUFBLE1BQUVBLE1BQUYsNEJBQVcsRUFBWDtBQUFBLFNBQy9CLDZDQUNFLGdDQUFDLGtDQUFELFFBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLElBREYsRUFFRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRSxnQ0FBQywyQkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRTtBQUF0QixJQURGLENBRkYsQ0FERixFQU9FLGdDQUFDLHVCQUFEO0FBQXlCLElBQUEsU0FBUyxFQUFDO0FBQW5DLEtBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsSUFBQSxFQUFFLEVBQUU7QUFBdEIsSUFERixDQURGLEVBSUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsSUFBQSxFQUFFLEVBQUU7QUFBdEIsSUFERixFQUVFLGdDQUFDLHlCQUFEO0FBQWUsSUFBQSxJQUFJLEVBQUVDO0FBQXJCLG9CQUZGLE1BSkYsQ0FERixFQVVFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFLGdDQUFDLDJCQUFEO0FBQVksSUFBQSxFQUFFLEVBQUMsYUFBZjtBQUE2QixJQUFBLElBQUksRUFBRUQ7QUFBbkMsSUFERixDQURGLEVBSUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0UsZ0NBQUMseUJBQUQsUUFDRSxnQ0FBQywyQkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRTtBQUF0QixJQURGLENBREYsQ0FKRixDQVZGLENBUEYsQ0FEK0I7QUFBQSxDQUFYLENBQXRCOztBQWdDQUgsYUFBYSxDQUFDSyxTQUFkLEdBQTBCVCxtQkFBMUI7QUFFQUksYUFBYSxDQUFDTSxXQUFkLEdBQTRCLGVBQTVCOztBQUVBLElBQU1DLG9CQUFvQixHQUFHLFNBQXZCQSxvQkFBdUI7QUFBQSxTQUFNUCxhQUFOO0FBQUEsQ0FBN0I7O2VBRWVPLG9CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgSlNPTlByZXR0eSBmcm9tICdyZWFjdC1qc29uLXByZXR0eSc7XG5pbXBvcnQge0FERF9EQVRBX1RPX01BUF9ET0N9IGZyb20gJ2NvbnN0YW50cy91c2VyLWd1aWRlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7U3R5bGVkRXhwb3J0U2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtTdHlsZWRFeHBvcnRNYXBTZWN0aW9uLCBTdHlsZWRXYXJuaW5nLCBFeHBvcnRNYXBMaW5rfSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgU3R5bGVkSnNvbkV4cG9ydFNlY3Rpb24gPSBzdHlsZWQoU3R5bGVkRXhwb3J0U2VjdGlvbilgXG4gIC5ub3RlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5lcnJvckNvbG9yfTtcbiAgICBmb250LXNpemU6IDExcHg7XG4gIH1cblxuICAudmlld2VyIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJvcmRlckNvbG9yTFR9O1xuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgZm9udDogaW5oZXJpdDtcbiAgICBsaW5lLWhlaWdodDogMS41ZW07XG4gICAgcGFkZGluZzogMC41ZW0gMy41ZW0gMC41ZW0gMWVtO1xuICAgIG1hcmdpbjogMDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIGhlaWdodDogMTgwcHg7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuICAgIG92ZXJmbG93LXg6IGF1dG87XG4gICAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbiAgICBtYXgtd2lkdGg6IDYwMHB4O1xuICB9XG5gO1xuXG5jb25zdCBleHBvcnRKc29uUHJvcFR5cGVzID0ge1xuICBvcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5jb25zdCBFeHBvcnRKc29uTWFwID0gUmVhY3QubWVtbygoe2NvbmZpZyA9IHt9fSkgPT4gKFxuICA8ZGl2PlxuICAgIDxTdHlsZWRFeHBvcnRNYXBTZWN0aW9uPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5qc29uLnNlbGVjdGlvbid9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L1N0eWxlZEV4cG9ydE1hcFNlY3Rpb24+XG4gICAgPFN0eWxlZEpzb25FeHBvcnRTZWN0aW9uIGNsYXNzTmFtZT1cImV4cG9ydC1tYXAtbW9kYWxfX2pzb24tb3B0aW9uc1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuanNvbi5jb25maWdUaXRsZSd9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1YnRpdGxlXCI+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuanNvbi5jb25maWdEaXNjbGFpbWVyJ30gLz5cbiAgICAgICAgICA8RXhwb3J0TWFwTGluayBocmVmPXtBRERfREFUQV9UT19NQVBfRE9DfT5hZGREYXRhVG9NYXA8L0V4cG9ydE1hcExpbms+LlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aWV3ZXJcIj5cbiAgICAgICAgICA8SlNPTlByZXR0eSBpZD1cImpzb24tcHJldHR5XCIganNvbj17Y29uZmlnfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaXNjbGFpbWVyXCI+XG4gICAgICAgICAgPFN0eWxlZFdhcm5pbmc+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5qc29uLmRpc2NsYWltZXInfSAvPlxuICAgICAgICAgIDwvU3R5bGVkV2FybmluZz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L1N0eWxlZEpzb25FeHBvcnRTZWN0aW9uPlxuICA8L2Rpdj5cbikpO1xuXG5FeHBvcnRKc29uTWFwLnByb3BUeXBlcyA9IGV4cG9ydEpzb25Qcm9wVHlwZXM7XG5cbkV4cG9ydEpzb25NYXAuZGlzcGxheU5hbWUgPSAnRXhwb3J0SnNvbk1hcCc7XG5cbmNvbnN0IEV4cG9ydEpzb25NYXBGYWN0b3J5ID0gKCkgPT4gRXhwb3J0SnNvbk1hcDtcblxuZXhwb3J0IGRlZmF1bHQgRXhwb3J0SnNvbk1hcEZhY3Rvcnk7XG4iXX0=