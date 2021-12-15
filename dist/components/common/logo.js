"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _defaultSettings = require("../../constants/default-settings");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

var LogoTitle = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  margin-left: 6px;\n"])));

var LogoName = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  .logo__link {\n    color: ", ";\n    font-size: 14px;\n    font-weight: 600;\n    letter-spacing: 1.17px;\n  }\n"])), function (props) {
  return props.theme.logoColor;
});

var LogoVersion = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 10px;\n  color: ", ";\n  letter-spacing: 0.83px;\n  line-height: 14px;\n"])), function (props) {
  return props.theme.subtextColor;
});

var LogoWrapper = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: flex-start;\n"])));

var LogoSvgWrapper = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 3px;\n"])));

var LogoSvg = function LogoSvg() {
  return /*#__PURE__*/_react["default"].createElement("svg", {
    className: "side-panel-logo__logo",
    width: "22px",
    height: "15px",
    viewBox: "0 0 22 15"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(11, -3) rotate(45.000000)"
  }, /*#__PURE__*/_react["default"].createElement("rect", {
    fill: "#535C6C",
    x: "0",
    y: "5",
    width: "10",
    height: "10"
  }), /*#__PURE__*/_react["default"].createElement("rect", {
    fill: "#1FBAD6",
    x: "5",
    y: "0",
    width: "10",
    height: "10"
  })));
};

var KeplerGlLogo = function KeplerGlLogo(_ref) {
  var appName = _ref.appName,
      _ref$appWebsite = _ref.appWebsite,
      appWebsite = _ref$appWebsite === void 0 ? _defaultSettings.KEPLER_GL_WEBSITE : _ref$appWebsite,
      version = _ref.version;
  return /*#__PURE__*/_react["default"].createElement(LogoWrapper, {
    className: "side-panel-logo"
  }, /*#__PURE__*/_react["default"].createElement(LogoSvgWrapper, null, /*#__PURE__*/_react["default"].createElement(LogoSvg, null)), /*#__PURE__*/_react["default"].createElement(LogoTitle, {
    className: "logo__title"
  }, /*#__PURE__*/_react["default"].createElement(LogoName, {
    className: "logo__name"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "logo__link",
    target: "_blank",
    rel: "noopener noreferrer",
    href: appWebsite
  }, appName)), version ? /*#__PURE__*/_react["default"].createElement(LogoVersion, {
    className: "logo__version"
  }, version) : null));
};

KeplerGlLogo.propTypes = {
  appName: _propTypes["default"].string,
  version: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  appWebsite: _propTypes["default"].string
};
KeplerGlLogo.defaultProps = {
  appName: _defaultSettings.KEPLER_GL_NAME,
  version: _defaultSettings.KEPLER_GL_VERSION,
  appWebsite: _defaultSettings.KEPLER_GL_WEBSITE
};
var _default = KeplerGlLogo;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9sb2dvLmpzIl0sIm5hbWVzIjpbIkxvZ29UaXRsZSIsInN0eWxlZCIsImRpdiIsIkxvZ29OYW1lIiwicHJvcHMiLCJ0aGVtZSIsImxvZ29Db2xvciIsIkxvZ29WZXJzaW9uIiwic3VidGV4dENvbG9yIiwiTG9nb1dyYXBwZXIiLCJMb2dvU3ZnV3JhcHBlciIsIkxvZ29TdmciLCJLZXBsZXJHbExvZ28iLCJhcHBOYW1lIiwiYXBwV2Vic2l0ZSIsIktFUExFUl9HTF9XRUJTSVRFIiwidmVyc2lvbiIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsIm9uZU9mVHlwZSIsImJvb2wiLCJkZWZhdWx0UHJvcHMiLCJLRVBMRVJfR0xfTkFNRSIsIktFUExFUl9HTF9WRVJTSU9OIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFNBQVMsR0FBR0MsNkJBQU9DLEdBQVYsdUlBQWY7O0FBS0EsSUFBTUMsUUFBUSxHQUFHRiw2QkFBT0MsR0FBViw2TUFFRCxVQUFBRSxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFNBQWhCO0FBQUEsQ0FGSixDQUFkOztBQVFBLElBQU1DLFdBQVcsR0FBR04sNkJBQU9DLEdBQVYsZ0xBRU4sVUFBQUUsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRyxZQUFoQjtBQUFBLENBRkMsQ0FBakI7O0FBT0EsSUFBTUMsV0FBVyxHQUFHUiw2QkFBT0MsR0FBVix3SUFBakI7O0FBS0EsSUFBTVEsY0FBYyxHQUFHVCw2QkFBT0MsR0FBViw4R0FBcEI7O0FBSUEsSUFBTVMsT0FBTyxHQUFHLFNBQVZBLE9BQVU7QUFBQSxzQkFDZDtBQUFLLElBQUEsU0FBUyxFQUFDLHVCQUFmO0FBQXVDLElBQUEsS0FBSyxFQUFDLE1BQTdDO0FBQW9ELElBQUEsTUFBTSxFQUFDLE1BQTNEO0FBQWtFLElBQUEsT0FBTyxFQUFDO0FBQTFFLGtCQUNFO0FBQUcsSUFBQSxTQUFTLEVBQUM7QUFBYixrQkFDRTtBQUFNLElBQUEsSUFBSSxFQUFDLFNBQVg7QUFBcUIsSUFBQSxDQUFDLEVBQUMsR0FBdkI7QUFBMkIsSUFBQSxDQUFDLEVBQUMsR0FBN0I7QUFBaUMsSUFBQSxLQUFLLEVBQUMsSUFBdkM7QUFBNEMsSUFBQSxNQUFNLEVBQUM7QUFBbkQsSUFERixlQUVFO0FBQU0sSUFBQSxJQUFJLEVBQUMsU0FBWDtBQUFxQixJQUFBLENBQUMsRUFBQyxHQUF2QjtBQUEyQixJQUFBLENBQUMsRUFBQyxHQUE3QjtBQUFpQyxJQUFBLEtBQUssRUFBQyxJQUF2QztBQUE0QyxJQUFBLE1BQU0sRUFBQztBQUFuRCxJQUZGLENBREYsQ0FEYztBQUFBLENBQWhCOztBQVNBLElBQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlO0FBQUEsTUFBRUMsT0FBRixRQUFFQSxPQUFGO0FBQUEsNkJBQVdDLFVBQVg7QUFBQSxNQUFXQSxVQUFYLGdDQUF3QkMsa0NBQXhCO0FBQUEsTUFBMkNDLE9BQTNDLFFBQTJDQSxPQUEzQztBQUFBLHNCQUNuQixnQ0FBQyxXQUFEO0FBQWEsSUFBQSxTQUFTLEVBQUM7QUFBdkIsa0JBQ0UsZ0NBQUMsY0FBRCxxQkFDRSxnQ0FBQyxPQUFELE9BREYsQ0FERixlQUlFLGdDQUFDLFNBQUQ7QUFBVyxJQUFBLFNBQVMsRUFBQztBQUFyQixrQkFDRSxnQ0FBQyxRQUFEO0FBQVUsSUFBQSxTQUFTLEVBQUM7QUFBcEIsa0JBQ0U7QUFBRyxJQUFBLFNBQVMsRUFBQyxZQUFiO0FBQTBCLElBQUEsTUFBTSxFQUFDLFFBQWpDO0FBQTBDLElBQUEsR0FBRyxFQUFDLHFCQUE5QztBQUFvRSxJQUFBLElBQUksRUFBRUY7QUFBMUUsS0FDR0QsT0FESCxDQURGLENBREYsRUFNR0csT0FBTyxnQkFBRyxnQ0FBQyxXQUFEO0FBQWEsSUFBQSxTQUFTLEVBQUM7QUFBdkIsS0FBd0NBLE9BQXhDLENBQUgsR0FBb0UsSUFOOUUsQ0FKRixDQURtQjtBQUFBLENBQXJCOztBQWdCQUosWUFBWSxDQUFDSyxTQUFiLEdBQXlCO0FBQ3ZCSixFQUFBQSxPQUFPLEVBQUVLLHNCQUFVQyxNQURJO0FBRXZCSCxFQUFBQSxPQUFPLEVBQUVFLHNCQUFVRSxTQUFWLENBQW9CLENBQUNGLHNCQUFVQyxNQUFYLEVBQW1CRCxzQkFBVUcsSUFBN0IsQ0FBcEIsQ0FGYztBQUd2QlAsRUFBQUEsVUFBVSxFQUFFSSxzQkFBVUM7QUFIQyxDQUF6QjtBQU1BUCxZQUFZLENBQUNVLFlBQWIsR0FBNEI7QUFDMUJULEVBQUFBLE9BQU8sRUFBRVUsK0JBRGlCO0FBRTFCUCxFQUFBQSxPQUFPLEVBQUVRLGtDQUZpQjtBQUcxQlYsRUFBQUEsVUFBVSxFQUFFQztBQUhjLENBQTVCO2VBTWVILFkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtLRVBMRVJfR0xfTkFNRSwgS0VQTEVSX0dMX1ZFUlNJT04sIEtFUExFUl9HTF9XRUJTSVRFfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IExvZ29UaXRsZSA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luLWxlZnQ6IDZweDtcbmA7XG5cbmNvbnN0IExvZ29OYW1lID0gc3R5bGVkLmRpdmBcbiAgLmxvZ29fX2xpbmsge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxvZ29Db2xvcn07XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDEuMTdweDtcbiAgfVxuYDtcbmNvbnN0IExvZ29WZXJzaW9uID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAxMHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICBsZXR0ZXItc3BhY2luZzogMC44M3B4O1xuICBsaW5lLWhlaWdodDogMTRweDtcbmA7XG5cbmNvbnN0IExvZ29XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG5gO1xuXG5jb25zdCBMb2dvU3ZnV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi10b3A6IDNweDtcbmA7XG5cbmNvbnN0IExvZ29TdmcgPSAoKSA9PiAoXG4gIDxzdmcgY2xhc3NOYW1lPVwic2lkZS1wYW5lbC1sb2dvX19sb2dvXCIgd2lkdGg9XCIyMnB4XCIgaGVpZ2h0PVwiMTVweFwiIHZpZXdCb3g9XCIwIDAgMjIgMTVcIj5cbiAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMTEsIC0zKSByb3RhdGUoNDUuMDAwMDAwKVwiPlxuICAgICAgPHJlY3QgZmlsbD1cIiM1MzVDNkNcIiB4PVwiMFwiIHk9XCI1XCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgLz5cbiAgICAgIDxyZWN0IGZpbGw9XCIjMUZCQUQ2XCIgeD1cIjVcIiB5PVwiMFwiIHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIxMFwiIC8+XG4gICAgPC9nPlxuICA8L3N2Zz5cbik7XG5cbmNvbnN0IEtlcGxlckdsTG9nbyA9ICh7YXBwTmFtZSwgYXBwV2Vic2l0ZSA9IEtFUExFUl9HTF9XRUJTSVRFLCB2ZXJzaW9ufSkgPT4gKFxuICA8TG9nb1dyYXBwZXIgY2xhc3NOYW1lPVwic2lkZS1wYW5lbC1sb2dvXCI+XG4gICAgPExvZ29TdmdXcmFwcGVyPlxuICAgICAgPExvZ29TdmcgLz5cbiAgICA8L0xvZ29TdmdXcmFwcGVyPlxuICAgIDxMb2dvVGl0bGUgY2xhc3NOYW1lPVwibG9nb19fdGl0bGVcIj5cbiAgICAgIDxMb2dvTmFtZSBjbGFzc05hbWU9XCJsb2dvX19uYW1lXCI+XG4gICAgICAgIDxhIGNsYXNzTmFtZT1cImxvZ29fX2xpbmtcIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCIgaHJlZj17YXBwV2Vic2l0ZX0+XG4gICAgICAgICAge2FwcE5hbWV9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvTG9nb05hbWU+XG4gICAgICB7dmVyc2lvbiA/IDxMb2dvVmVyc2lvbiBjbGFzc05hbWU9XCJsb2dvX192ZXJzaW9uXCI+e3ZlcnNpb259PC9Mb2dvVmVyc2lvbj4gOiBudWxsfVxuICAgIDwvTG9nb1RpdGxlPlxuICA8L0xvZ29XcmFwcGVyPlxuKTtcblxuS2VwbGVyR2xMb2dvLnByb3BUeXBlcyA9IHtcbiAgYXBwTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmVyc2lvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmJvb2xdKSxcbiAgYXBwV2Vic2l0ZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuS2VwbGVyR2xMb2dvLmRlZmF1bHRQcm9wcyA9IHtcbiAgYXBwTmFtZTogS0VQTEVSX0dMX05BTUUsXG4gIHZlcnNpb246IEtFUExFUl9HTF9WRVJTSU9OLFxuICBhcHBXZWJzaXRlOiBLRVBMRVJfR0xfV0VCU0lURVxufTtcblxuZXhwb3J0IGRlZmF1bHQgS2VwbGVyR2xMb2dvO1xuIl19