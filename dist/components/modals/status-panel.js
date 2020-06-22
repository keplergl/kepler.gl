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

var _reactIntl = require("react-intl");

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 16px;\n\n  line {\n    stroke: ", ";\n    stroke-width: 4;\n    stroke-linecap: square;\n    stroke-dasharray: 5 12;\n    animation: dash-animation 25s infinite linear;\n  }\n  circle {\n    fill: ", ";\n  }\n\n  @keyframes dash-animation {\n    to {\n      stroke-dashoffset: -1000;\n    }\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  margin-right: 16px;\n  margin-top: 4px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledUploader = _styledComponents["default"].div(_templateObject());

var StyledMapIcon = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.textColorLT;
});

var StyledSvg = _styledComponents["default"].svg(_templateObject3(), function (props) {
  return props.theme.selectBorderColorLT;
}, function (props) {
  return props.theme.selectBorderColorLT;
});

var Line = function Line() {
  return _react["default"].createElement(StyledSvg, {
    height: "5px",
    width: "150px"
  }, _react["default"].createElement("line", {
    x1: "0",
    y1: "4",
    x2: "150",
    y2: "4"
  }));
};

var UploadAnimation = function UploadAnimation(props) {
  return _react["default"].createElement(StyledUploader, null, _react["default"].createElement(StyledMapIcon, null, _react["default"].createElement(_icons.MapIcon, {
    height: "48px"
  })), _react["default"].createElement(Line, null), props.icon && _react["default"].createElement(props.icon, {
    height: "64px"
  }));
};

exports.UploadAnimation = UploadAnimation;

var StatusPanel = function StatusPanel(_ref) {
  var error = _ref.error,
      isLoading = _ref.isLoading,
      providerIcon = _ref.providerIcon;
  return _react["default"].createElement(_styledComponents2.StyledExportSection, null, _react["default"].createElement("div", {
    className: "description"
  }, _react["default"].createElement("div", {
    className: "title"
  }, isLoading ? _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.statusPanel.mapUploading'
  }) : error ? _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.statusPanel.error'
  }) : null)), _react["default"].createElement("div", {
    className: "selection"
  }, isLoading && _react["default"].createElement(UploadAnimation, {
    icon: providerIcon
  }), error && _react["default"].createElement(_errorDisplay["default"], {
    error: error
  })));
};

var _default = StatusPanel;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zdGF0dXMtcGFuZWwuanMiXSwibmFtZXMiOlsiU3R5bGVkVXBsb2FkZXIiLCJzdHlsZWQiLCJkaXYiLCJTdHlsZWRNYXBJY29uIiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwiU3R5bGVkU3ZnIiwic3ZnIiwic2VsZWN0Qm9yZGVyQ29sb3JMVCIsIkxpbmUiLCJVcGxvYWRBbmltYXRpb24iLCJpY29uIiwiU3RhdHVzUGFuZWwiLCJlcnJvciIsImlzTG9hZGluZyIsInByb3ZpZGVySWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsY0FBYyxHQUFHQyw2QkFBT0MsR0FBVixtQkFBcEI7O0FBTUEsSUFBTUMsYUFBYSxHQUFHRiw2QkFBT0MsR0FBVixxQkFDUixVQUFBRSxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFdBQWhCO0FBQUEsQ0FERyxDQUFuQjs7QUFNQSxJQUFNQyxTQUFTLEdBQUdOLDZCQUFPTyxHQUFWLHFCQUlELFVBQUFKLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksbUJBQWhCO0FBQUEsQ0FKSixFQVdILFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksbUJBQWhCO0FBQUEsQ0FYRixDQUFmOztBQXFCQSxJQUFNQyxJQUFJLEdBQUcsU0FBUEEsSUFBTztBQUFBLFNBQ1gsZ0NBQUMsU0FBRDtBQUFXLElBQUEsTUFBTSxFQUFDLEtBQWxCO0FBQXdCLElBQUEsS0FBSyxFQUFDO0FBQTlCLEtBQ0U7QUFBTSxJQUFBLEVBQUUsRUFBQyxHQUFUO0FBQWEsSUFBQSxFQUFFLEVBQUMsR0FBaEI7QUFBb0IsSUFBQSxFQUFFLEVBQUMsS0FBdkI7QUFBNkIsSUFBQSxFQUFFLEVBQUM7QUFBaEMsSUFERixDQURXO0FBQUEsQ0FBYjs7QUFNTyxJQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUFQLEtBQUs7QUFBQSxTQUNsQyxnQ0FBQyxjQUFELFFBQ0UsZ0NBQUMsYUFBRCxRQUNFLGdDQUFDLGNBQUQ7QUFBUyxJQUFBLE1BQU0sRUFBQztBQUFoQixJQURGLENBREYsRUFJRSxnQ0FBQyxJQUFELE9BSkYsRUFLR0EsS0FBSyxDQUFDUSxJQUFOLElBQWMsZ0NBQUMsS0FBRCxDQUFPLElBQVA7QUFBWSxJQUFBLE1BQU0sRUFBQztBQUFuQixJQUxqQixDQURrQztBQUFBLENBQTdCOzs7O0FBVVAsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWM7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxNQUFTQyxTQUFULFFBQVNBLFNBQVQ7QUFBQSxNQUFvQkMsWUFBcEIsUUFBb0JBLFlBQXBCO0FBQUEsU0FDbEIsZ0NBQUMsc0NBQUQsUUFDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDR0QsU0FBUyxHQUNSLGdDQUFDLDJCQUFEO0FBQWtCLElBQUEsRUFBRSxFQUFFO0FBQXRCLElBRFEsR0FFTkQsS0FBSyxHQUNQLGdDQUFDLDJCQUFEO0FBQWtCLElBQUEsRUFBRSxFQUFFO0FBQXRCLElBRE8sR0FFTCxJQUxOLENBREYsQ0FERixFQVVFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNHQyxTQUFTLElBQUksZ0NBQUMsZUFBRDtBQUFpQixJQUFBLElBQUksRUFBRUM7QUFBdkIsSUFEaEIsRUFFR0YsS0FBSyxJQUFJLGdDQUFDLHdCQUFEO0FBQWMsSUFBQSxLQUFLLEVBQUVBO0FBQXJCLElBRlosQ0FWRixDQURrQjtBQUFBLENBQXBCOztlQWtCZUQsVyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7TWFwSWNvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtTdHlsZWRFeHBvcnRTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgRXJyb3JEaXNwbGF5IGZyb20gJy4vZXJyb3ItZGlzcGxheSc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5jb25zdCBTdHlsZWRVcGxvYWRlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbmA7XG5cbmNvbnN0IFN0eWxlZE1hcEljb24gPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gIG1hcmdpbi1yaWdodDogMTZweDtcbiAgbWFyZ2luLXRvcDogNHB4O1xuYDtcblxuY29uc3QgU3R5bGVkU3ZnID0gc3R5bGVkLnN2Z2BcbiAgbWFyZ2luLXJpZ2h0OiAxNnB4O1xuXG4gIGxpbmUge1xuICAgIHN0cm9rZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCb3JkZXJDb2xvckxUfTtcbiAgICBzdHJva2Utd2lkdGg6IDQ7XG4gICAgc3Ryb2tlLWxpbmVjYXA6IHNxdWFyZTtcbiAgICBzdHJva2UtZGFzaGFycmF5OiA1IDEyO1xuICAgIGFuaW1hdGlvbjogZGFzaC1hbmltYXRpb24gMjVzIGluZmluaXRlIGxpbmVhcjtcbiAgfVxuICBjaXJjbGUge1xuICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3JMVH07XG4gIH1cblxuICBAa2V5ZnJhbWVzIGRhc2gtYW5pbWF0aW9uIHtcbiAgICB0byB7XG4gICAgICBzdHJva2UtZGFzaG9mZnNldDogLTEwMDA7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBMaW5lID0gKCkgPT4gKFxuICA8U3R5bGVkU3ZnIGhlaWdodD1cIjVweFwiIHdpZHRoPVwiMTUwcHhcIj5cbiAgICA8bGluZSB4MT1cIjBcIiB5MT1cIjRcIiB4Mj1cIjE1MFwiIHkyPVwiNFwiIC8+XG4gIDwvU3R5bGVkU3ZnPlxuKTtcblxuZXhwb3J0IGNvbnN0IFVwbG9hZEFuaW1hdGlvbiA9IHByb3BzID0+IChcbiAgPFN0eWxlZFVwbG9hZGVyPlxuICAgIDxTdHlsZWRNYXBJY29uPlxuICAgICAgPE1hcEljb24gaGVpZ2h0PVwiNDhweFwiIC8+XG4gICAgPC9TdHlsZWRNYXBJY29uPlxuICAgIDxMaW5lIC8+XG4gICAge3Byb3BzLmljb24gJiYgPHByb3BzLmljb24gaGVpZ2h0PVwiNjRweFwiIC8+fVxuICA8L1N0eWxlZFVwbG9hZGVyPlxuKTtcblxuY29uc3QgU3RhdHVzUGFuZWwgPSAoe2Vycm9yLCBpc0xvYWRpbmcsIHByb3ZpZGVySWNvbn0pID0+IChcbiAgPFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICB7aXNMb2FkaW5nID8gKFxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuc3RhdHVzUGFuZWwubWFwVXBsb2FkaW5nJ30gLz5cbiAgICAgICAgKSA6IGVycm9yID8gKFxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuc3RhdHVzUGFuZWwuZXJyb3InfSAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uXCI+XG4gICAgICB7aXNMb2FkaW5nICYmIDxVcGxvYWRBbmltYXRpb24gaWNvbj17cHJvdmlkZXJJY29ufSAvPn1cbiAgICAgIHtlcnJvciAmJiA8RXJyb3JEaXNwbGF5IGVycm9yPXtlcnJvcn0gLz59XG4gICAgPC9kaXY+XG4gIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1BhbmVsO1xuIl19