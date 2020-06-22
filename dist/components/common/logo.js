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

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 3px;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: flex-start;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 10px;\n  color: ", ";\n  letter-spacing: 0.83px;\n  line-height: 14px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .logo__link {\n    color: ", ";\n    font-size: 14px;\n    font-weight: 600;\n    letter-spacing: 1.17px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  margin-left: 6px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var LogoTitle = _styledComponents["default"].div(_templateObject());

var LogoName = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.logoColor;
});

var LogoVersion = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.subtextColor;
});

var LogoWrapper = _styledComponents["default"].div(_templateObject4());

var LogoSvgWrapper = _styledComponents["default"].div(_templateObject5());

var LogoSvg = function LogoSvg() {
  return _react["default"].createElement("svg", {
    className: "side-panel-logo__logo",
    width: "22px",
    height: "15px",
    viewBox: "0 0 22 15"
  }, _react["default"].createElement("g", {
    transform: "translate(11, -3) rotate(45.000000)"
  }, _react["default"].createElement("rect", {
    fill: "#535C6C",
    x: "0",
    y: "5",
    width: "10",
    height: "10"
  }), _react["default"].createElement("rect", {
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
  return _react["default"].createElement(LogoWrapper, {
    className: "side-panel-logo"
  }, _react["default"].createElement(LogoSvgWrapper, null, _react["default"].createElement(LogoSvg, null)), _react["default"].createElement(LogoTitle, {
    className: "logo__title"
  }, _react["default"].createElement(LogoName, {
    className: "logo__name"
  }, _react["default"].createElement("a", {
    className: "logo__link",
    target: "_blank",
    rel: "noopener noreferrer",
    href: appWebsite
  }, appName)), version ? _react["default"].createElement(LogoVersion, {
    className: "logo__version"
  }, version) : null));
};

KeplerGlLogo.propTypes = {
  appName: _propTypes["default"].string,
  version: _propTypes["default"].string,
  appWebsite: _propTypes["default"].string
};
KeplerGlLogo.defaultProps = {
  appName: _defaultSettings.KEPLER_GL_NAME,
  version: _defaultSettings.KEPLER_GL_VERSION,
  appWebsite: _defaultSettings.KEPLER_GL_WEBSITE
};
var _default = KeplerGlLogo;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9sb2dvLmpzIl0sIm5hbWVzIjpbIkxvZ29UaXRsZSIsInN0eWxlZCIsImRpdiIsIkxvZ29OYW1lIiwicHJvcHMiLCJ0aGVtZSIsImxvZ29Db2xvciIsIkxvZ29WZXJzaW9uIiwic3VidGV4dENvbG9yIiwiTG9nb1dyYXBwZXIiLCJMb2dvU3ZnV3JhcHBlciIsIkxvZ29TdmciLCJLZXBsZXJHbExvZ28iLCJhcHBOYW1lIiwiYXBwV2Vic2l0ZSIsIktFUExFUl9HTF9XRUJTSVRFIiwidmVyc2lvbiIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImRlZmF1bHRQcm9wcyIsIktFUExFUl9HTF9OQU1FIiwiS0VQTEVSX0dMX1ZFUlNJT04iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHQyw2QkFBT0MsR0FBVixtQkFBZjs7QUFLQSxJQUFNQyxRQUFRLEdBQUdGLDZCQUFPQyxHQUFWLHFCQUVELFVBQUFFLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsU0FBaEI7QUFBQSxDQUZKLENBQWQ7O0FBUUEsSUFBTUMsV0FBVyxHQUFHTiw2QkFBT0MsR0FBVixxQkFFTixVQUFBRSxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlHLFlBQWhCO0FBQUEsQ0FGQyxDQUFqQjs7QUFPQSxJQUFNQyxXQUFXLEdBQUdSLDZCQUFPQyxHQUFWLG9CQUFqQjs7QUFLQSxJQUFNUSxjQUFjLEdBQUdULDZCQUFPQyxHQUFWLG9CQUFwQjs7QUFJQSxJQUFNUyxPQUFPLEdBQUcsU0FBVkEsT0FBVTtBQUFBLFNBQ2Q7QUFBSyxJQUFBLFNBQVMsRUFBQyx1QkFBZjtBQUF1QyxJQUFBLEtBQUssRUFBQyxNQUE3QztBQUFvRCxJQUFBLE1BQU0sRUFBQyxNQUEzRDtBQUFrRSxJQUFBLE9BQU8sRUFBQztBQUExRSxLQUNFO0FBQUcsSUFBQSxTQUFTLEVBQUM7QUFBYixLQUNFO0FBQU0sSUFBQSxJQUFJLEVBQUMsU0FBWDtBQUFxQixJQUFBLENBQUMsRUFBQyxHQUF2QjtBQUEyQixJQUFBLENBQUMsRUFBQyxHQUE3QjtBQUFpQyxJQUFBLEtBQUssRUFBQyxJQUF2QztBQUE0QyxJQUFBLE1BQU0sRUFBQztBQUFuRCxJQURGLEVBRUU7QUFBTSxJQUFBLElBQUksRUFBQyxTQUFYO0FBQXFCLElBQUEsQ0FBQyxFQUFDLEdBQXZCO0FBQTJCLElBQUEsQ0FBQyxFQUFDLEdBQTdCO0FBQWlDLElBQUEsS0FBSyxFQUFDLElBQXZDO0FBQTRDLElBQUEsTUFBTSxFQUFDO0FBQW5ELElBRkYsQ0FERixDQURjO0FBQUEsQ0FBaEI7O0FBU0EsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxNQUFFQyxPQUFGLFFBQUVBLE9BQUY7QUFBQSw2QkFBV0MsVUFBWDtBQUFBLE1BQVdBLFVBQVgsZ0NBQXdCQyxrQ0FBeEI7QUFBQSxNQUEyQ0MsT0FBM0MsUUFBMkNBLE9BQTNDO0FBQUEsU0FDbkIsZ0NBQUMsV0FBRDtBQUFhLElBQUEsU0FBUyxFQUFDO0FBQXZCLEtBQ0UsZ0NBQUMsY0FBRCxRQUNFLGdDQUFDLE9BQUQsT0FERixDQURGLEVBSUUsZ0NBQUMsU0FBRDtBQUFXLElBQUEsU0FBUyxFQUFDO0FBQXJCLEtBQ0UsZ0NBQUMsUUFBRDtBQUFVLElBQUEsU0FBUyxFQUFDO0FBQXBCLEtBQ0U7QUFBRyxJQUFBLFNBQVMsRUFBQyxZQUFiO0FBQTBCLElBQUEsTUFBTSxFQUFDLFFBQWpDO0FBQTBDLElBQUEsR0FBRyxFQUFDLHFCQUE5QztBQUFvRSxJQUFBLElBQUksRUFBRUY7QUFBMUUsS0FDR0QsT0FESCxDQURGLENBREYsRUFNR0csT0FBTyxHQUFHLGdDQUFDLFdBQUQ7QUFBYSxJQUFBLFNBQVMsRUFBQztBQUF2QixLQUF3Q0EsT0FBeEMsQ0FBSCxHQUFvRSxJQU45RSxDQUpGLENBRG1CO0FBQUEsQ0FBckI7O0FBZ0JBSixZQUFZLENBQUNLLFNBQWIsR0FBeUI7QUFDdkJKLEVBQUFBLE9BQU8sRUFBRUssc0JBQVVDLE1BREk7QUFFdkJILEVBQUFBLE9BQU8sRUFBRUUsc0JBQVVDLE1BRkk7QUFHdkJMLEVBQUFBLFVBQVUsRUFBRUksc0JBQVVDO0FBSEMsQ0FBekI7QUFNQVAsWUFBWSxDQUFDUSxZQUFiLEdBQTRCO0FBQzFCUCxFQUFBQSxPQUFPLEVBQUVRLCtCQURpQjtBQUUxQkwsRUFBQUEsT0FBTyxFQUFFTSxrQ0FGaUI7QUFHMUJSLEVBQUFBLFVBQVUsRUFBRUM7QUFIYyxDQUE1QjtlQU1lSCxZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7S0VQTEVSX0dMX05BTUUsIEtFUExFUl9HTF9WRVJTSU9OLCBLRVBMRVJfR0xfV0VCU0lURX0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBMb2dvVGl0bGUgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1hcmdpbi1sZWZ0OiA2cHg7XG5gO1xuXG5jb25zdCBMb2dvTmFtZSA9IHN0eWxlZC5kaXZgXG4gIC5sb2dvX19saW5rIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sb2dvQ29sb3J9O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAxLjE3cHg7XG4gIH1cbmA7XG5jb25zdCBMb2dvVmVyc2lvbiA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuODNweDtcbiAgbGluZS1oZWlnaHQ6IDE0cHg7XG5gO1xuXG5jb25zdCBMb2dvV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuYDtcblxuY29uc3QgTG9nb1N2Z1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tdG9wOiAzcHg7XG5gO1xuXG5jb25zdCBMb2dvU3ZnID0gKCkgPT4gKFxuICA8c3ZnIGNsYXNzTmFtZT1cInNpZGUtcGFuZWwtbG9nb19fbG9nb1wiIHdpZHRoPVwiMjJweFwiIGhlaWdodD1cIjE1cHhcIiB2aWV3Qm94PVwiMCAwIDIyIDE1XCI+XG4gICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDExLCAtMykgcm90YXRlKDQ1LjAwMDAwMClcIj5cbiAgICAgIDxyZWN0IGZpbGw9XCIjNTM1QzZDXCIgeD1cIjBcIiB5PVwiNVwiIHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIxMFwiIC8+XG4gICAgICA8cmVjdCBmaWxsPVwiIzFGQkFENlwiIHg9XCI1XCIgeT1cIjBcIiB3aWR0aD1cIjEwXCIgaGVpZ2h0PVwiMTBcIiAvPlxuICAgIDwvZz5cbiAgPC9zdmc+XG4pO1xuXG5jb25zdCBLZXBsZXJHbExvZ28gPSAoe2FwcE5hbWUsIGFwcFdlYnNpdGUgPSBLRVBMRVJfR0xfV0VCU0lURSwgdmVyc2lvbn0pID0+IChcbiAgPExvZ29XcmFwcGVyIGNsYXNzTmFtZT1cInNpZGUtcGFuZWwtbG9nb1wiPlxuICAgIDxMb2dvU3ZnV3JhcHBlcj5cbiAgICAgIDxMb2dvU3ZnIC8+XG4gICAgPC9Mb2dvU3ZnV3JhcHBlcj5cbiAgICA8TG9nb1RpdGxlIGNsYXNzTmFtZT1cImxvZ29fX3RpdGxlXCI+XG4gICAgICA8TG9nb05hbWUgY2xhc3NOYW1lPVwibG9nb19fbmFtZVwiPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJsb2dvX19saW5rXCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIGhyZWY9e2FwcFdlYnNpdGV9PlxuICAgICAgICAgIHthcHBOYW1lfVxuICAgICAgICA8L2E+XG4gICAgICA8L0xvZ29OYW1lPlxuICAgICAge3ZlcnNpb24gPyA8TG9nb1ZlcnNpb24gY2xhc3NOYW1lPVwibG9nb19fdmVyc2lvblwiPnt2ZXJzaW9ufTwvTG9nb1ZlcnNpb24+IDogbnVsbH1cbiAgICA8L0xvZ29UaXRsZT5cbiAgPC9Mb2dvV3JhcHBlcj5cbik7XG5cbktlcGxlckdsTG9nby5wcm9wVHlwZXMgPSB7XG4gIGFwcE5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZlcnNpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gIGFwcFdlYnNpdGU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbktlcGxlckdsTG9nby5kZWZhdWx0UHJvcHMgPSB7XG4gIGFwcE5hbWU6IEtFUExFUl9HTF9OQU1FLFxuICB2ZXJzaW9uOiBLRVBMRVJfR0xfVkVSU0lPTixcbiAgYXBwV2Vic2l0ZTogS0VQTEVSX0dMX1dFQlNJVEVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEtlcGxlckdsTG9nbztcbiJdfQ==