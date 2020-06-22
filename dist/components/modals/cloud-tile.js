"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _icons = require("../common/icons");

var _styledComponents2 = require("../common/styled-components");

var _loadingSpinner = _interopRequireDefault(require("../common/loading-spinner"));

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 11px;\n  margin-top: 8px;\n  text-align: center;\n  color: ", ";\n  overflow: hidden;\n  width: 100px;\n  text-overflow: ellipsis;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 12px;\n  margin-top: 12px;\n  margin-bottom: 4px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 12px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  display: block;\n  width: 16px;\n  height: 16px;\n  border-top-left-radius: 2px;\n\n  :after {\n    position: absolute;\n    display: table;\n    border: 2px solid #fff;\n    border-top: 0;\n    border-left: 0;\n    transform: rotate(45deg) scale(1) translate(-50%, -50%);\n    opacity: 1;\n    content: ' ';\n    top: 50%;\n    left: 25%;\n    width: 5.7px;\n    height: 9.1px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-start;\n  border-radius: 2px;\n  border: 1px solid\n    ", ";\n  color: ", ";\n  cursor: pointer;\n  font-weight: 500;\n  width: 120px;\n  height: 168px;\n  background-color: #ffffff;\n  transition: ", ";\n  position: relative;\n  :hover {\n    border: 1px solid ", ";\n    color: ", ";\n  }\n\n  .button {\n    margin-top: 20px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledTileWrapper = _styledComponents["default"].div.attrs({
  className: 'provider-tile__wrapper'
})(_templateObject(), function (props) {
  return props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT;
}, function (props) {
  return props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT;
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.primaryBtnBgd;
});

var CheckMark = _styledComponents["default"].span.attrs({
  className: 'checkbox-inner'
})(_templateObject2(), function (props) {
  return props.theme.primaryBtnBgd;
});

var StyledBox = (0, _styledComponents["default"])(_styledComponents2.CenterVerticalFlexbox)(_templateObject3());

var StyledCloudName = _styledComponents["default"].div(_templateObject4());

var StyledUserName = _styledComponents["default"].div(_templateObject5(), function (props) {
  return props.theme.primaryBtnActBgd;
});

var LoginButton = function LoginButton(_ref) {
  var onClick = _ref.onClick;
  return _react["default"].createElement(_styledComponents2.Button, {
    link: true,
    small: true,
    onClick: onClick
  }, _react["default"].createElement(_icons.Login, null), "Login");
};

var LogoutButton = function LogoutButton(_ref2) {
  var onClick = _ref2.onClick;
  return _react["default"].createElement(_styledComponents2.Button, {
    link: true,
    small: true,
    onClick: onClick
  }, _react["default"].createElement(_icons.Logout, null), "Logout");
};

var ActionButton = function ActionButton(_ref3) {
  var isConnected = _ref3.isConnected,
      actionName = _ref3.actionName,
      isReady = _ref3.isReady;
  return isConnected && actionName ? _react["default"].createElement(_styledComponents2.Button, {
    className: "cloud-tile__action",
    small: true,
    secondary: true,
    disabled: !isReady
  }, isReady ? actionName : _react["default"].createElement(_loadingSpinner["default"], {
    size: 12
  })) : null;
};

var CloudTile = function CloudTile(_ref4) {
  var onSelect = _ref4.onSelect,
      onConnect = _ref4.onConnect,
      onLogout = _ref4.onLogout,
      actionName = _ref4.actionName,
      cloudProvider = _ref4.cloudProvider,
      onSetCloudProvider = _ref4.onSetCloudProvider,
      isSelected = _ref4.isSelected,
      isConnected = _ref4.isConnected,
      _ref4$isReady = _ref4.isReady,
      isReady = _ref4$isReady === void 0 ? true : _ref4$isReady;
  var userName = typeof cloudProvider.getUserName === 'function' ? cloudProvider.getUserName() : null;
  var onClickConnect = typeof onConnect === 'function' ? onConnect : function () {
    return cloudProvider.login(function () {
      return onSetCloudProvider(cloudProvider.name);
    });
  };
  var onClickLogout = typeof onLogout === 'function' ? onLogout : function () {
    return cloudProvider.logout(function () {
      return isSelected ? onSetCloudProvider(null) : null;
    });
  };
  return _react["default"].createElement(StyledBox, null, _react["default"].createElement(StyledTileWrapper, {
    onClick: isConnected ? onSelect : onClickConnect,
    selected: isSelected
  }, _react["default"].createElement(StyledCloudName, null, cloudProvider.displayName || cloudProvider.name), cloudProvider.icon ? _react["default"].createElement(cloudProvider.icon, {
    height: "64px"
  }) : null, _react["default"].createElement(ActionButton, {
    isConnected: isConnected,
    actionName: actionName,
    isReady: isReady
  }), userName && _react["default"].createElement(StyledUserName, null, userName), isSelected && _react["default"].createElement(CheckMark, null)), isConnected ? _react["default"].createElement(LogoutButton, {
    className: "logout-button",
    onClick: onClickLogout
  }) : _react["default"].createElement(LoginButton, {
    className: "login-button",
    onClick: onClickConnect
  }));
};

var _default = CloudTile;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9jbG91ZC10aWxlLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFRpbGVXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsInNlbGVjdGVkIiwidGhlbWUiLCJwcmltYXJ5QnRuQmdkIiwic2VsZWN0Qm9yZGVyQ29sb3JMVCIsInRyYW5zaXRpb24iLCJDaGVja01hcmsiLCJzcGFuIiwiU3R5bGVkQm94IiwiQ2VudGVyVmVydGljYWxGbGV4Ym94IiwiU3R5bGVkQ2xvdWROYW1lIiwiU3R5bGVkVXNlck5hbWUiLCJwcmltYXJ5QnRuQWN0QmdkIiwiTG9naW5CdXR0b24iLCJvbkNsaWNrIiwiTG9nb3V0QnV0dG9uIiwiQWN0aW9uQnV0dG9uIiwiaXNDb25uZWN0ZWQiLCJhY3Rpb25OYW1lIiwiaXNSZWFkeSIsIkNsb3VkVGlsZSIsIm9uU2VsZWN0Iiwib25Db25uZWN0Iiwib25Mb2dvdXQiLCJjbG91ZFByb3ZpZGVyIiwib25TZXRDbG91ZFByb3ZpZGVyIiwiaXNTZWxlY3RlZCIsInVzZXJOYW1lIiwiZ2V0VXNlck5hbWUiLCJvbkNsaWNrQ29ubmVjdCIsImxvZ2luIiwibmFtZSIsIm9uQ2xpY2tMb2dvdXQiLCJsb2dvdXQiLCJkaXNwbGF5TmFtZSIsImljb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUdDLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDekNDLEVBQUFBLFNBQVMsRUFBRTtBQUQ4QixDQUFqQixDQUFILG9CQVNqQixVQUFBQyxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDQyxRQUFOLEdBQWlCRCxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsYUFBN0IsR0FBNkNILEtB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VixnQ0FBQyxZQUFEO0FBQWMsSUFBQSxTQUFTLEVBQUMsZUFBeEI7QUFBd0MsSUFBQSxPQUFPLEVBQUVlO0FBQWpELElBRFUsR0FHVixnQ0FBQyxXQUFEO0FBQWEsSUFBQSxTQUFTLEVBQUMsY0FBdkI7QUFBc0MsSUFBQSxPQUFPLEVBQUVIO0FBQS9DLElBWEosQ0FERjtBQWdCRCxDQWpERDs7ZUFtRGVULFMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0xvZ291dCwgTG9naW59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7Q2VudGVyVmVydGljYWxGbGV4Ym94LCBCdXR0b259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBMb2FkaW5nU3Bpbm5lciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9sb2FkaW5nLXNwaW5uZXInO1xuXG5jb25zdCBTdHlsZWRUaWxlV3JhcHBlciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdwcm92aWRlci10aWxlX193cmFwcGVyJ1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZCA6IHByb3BzLnRoZW1lLnNlbGVjdEJvcmRlckNvbG9yTFQpfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZCA6IHByb3BzLnRoZW1lLnNlbGVjdEJvcmRlckNvbG9yTFQpfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250LXdlaWdodDogNTAwO1xuICB3aWR0aDogMTIwcHg7XG4gIGhlaWdodDogMTY4cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgOmhvdmVyIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuICB9XG5cbiAgLmJ1dHRvbiB7XG4gICAgbWFyZ2luLXRvcDogMjBweDtcbiAgfVxuYDtcblxuY29uc3QgQ2hlY2tNYXJrID0gc3R5bGVkLnNwYW4uYXR0cnMoe1xuICBjbGFzc05hbWU6ICdjaGVja2JveC1pbm5lcidcbn0pYFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogMDtcbiAgcmlnaHQ6IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTZweDtcbiAgaGVpZ2h0OiAxNnB4O1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAycHg7XG5cbiAgOmFmdGVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgZGlzcGxheTogdGFibGU7XG4gICAgYm9yZGVyOiAycHggc29saWQgI2ZmZjtcbiAgICBib3JkZXItdG9wOiAwO1xuICAgIGJvcmRlci1sZWZ0OiAwO1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKSBzY2FsZSgxKSB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgb3BhY2l0eTogMTtcbiAgICBjb250ZW50OiAnICc7XG4gICAgdG9wOiA1MCU7XG4gICAgbGVmdDogMjUlO1xuICAgIHdpZHRoOiA1LjdweDtcbiAgICBoZWlnaHQ6IDkuMXB4O1xuICB9XG5gO1xuY29uc3QgU3R5bGVkQm94ID0gc3R5bGVkKENlbnRlclZlcnRpY2FsRmxleGJveClgXG4gIG1hcmdpbi1yaWdodDogMTJweDtcbmA7XG5cbmNvbnN0IFN0eWxlZENsb3VkTmFtZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbWFyZ2luLXRvcDogMTJweDtcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xuYDtcblxuY29uc3QgU3R5bGVkVXNlck5hbWUgPSBzdHlsZWQuZGl2YFxuICBmb250LXNpemU6IDExcHg7XG4gIG1hcmdpbi10b3A6IDhweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQWN0QmdkfTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMHB4O1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbmA7XG5cbmNvbnN0IExvZ2luQnV0dG9uID0gKHtvbkNsaWNrfSkgPT4gKFxuICA8QnV0dG9uIGxpbmsgc21hbGwgb25DbGljaz17b25DbGlja30+XG4gICAgPExvZ2luIC8+XG4gICAgTG9naW5cbiAgPC9CdXR0b24+XG4pO1xuXG5jb25zdCBMb2dvdXRCdXR0b24gPSAoe29uQ2xpY2t9KSA9PiAoXG4gIDxCdXR0b24gbGluayBzbWFsbCBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICA8TG9nb3V0IC8+XG4gICAgTG9nb3V0XG4gIDwvQnV0dG9uPlxuKTtcblxuY29uc3QgQWN0aW9uQnV0dG9uID0gKHtpc0Nvbm5lY3RlZCwgYWN0aW9uTmFtZSwgaXNSZWFkeX0pID0+XG4gIGlzQ29ubmVjdGVkICYmIGFjdGlvbk5hbWUgPyAoXG4gICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJjbG91ZC10aWxlX19hY3Rpb25cIiBzbWFsbCBzZWNvbmRhcnkgZGlzYWJsZWQ9eyFpc1JlYWR5fT5cbiAgICAgIHtpc1JlYWR5ID8gYWN0aW9uTmFtZSA6IDxMb2FkaW5nU3Bpbm5lciBzaXplPXsxMn0gLz59XG4gICAgPC9CdXR0b24+XG4gICkgOiBudWxsO1xuXG5jb25zdCBDbG91ZFRpbGUgPSAoe1xuICAvLyBhY3Rpb24gd2hlbiBjbGljayBvbiB0aGUgdGlsZVxuICBvblNlbGVjdCxcbiAgLy8gZGVmYXVsdCB0byBsb2dpblxuICBvbkNvbm5lY3QsXG4gIC8vIGRlZmF1bHQgdG8gbG9nb3V0XG4gIG9uTG9nb3V0LFxuICAvLyBhY3Rpb24gbmFtZVxuICBhY3Rpb25OYW1lLFxuICAvLyBjbG91ZCBwcm92aWRlciBjbGFzc1xuICBjbG91ZFByb3ZpZGVyLFxuICAvLyBmdW5jdGlvbiB0byB0YWtlIGFmdGVyIGxvZ2luIG9yIGxvZ291dFxuICBvblNldENsb3VkUHJvdmlkZXIsXG4gIC8vIHdoZXRoZXIgcHJvdmlkZXIgaXMgc2VsZWN0ZWQgYXMgY3VycmVudFByb3ZpZGVyXG4gIGlzU2VsZWN0ZWQsXG4gIC8vIHdoZXRoZXIgdXNlciBoYXMgbG9nZ2VkIGluXG4gIGlzQ29ubmVjdGVkLFxuXG4gIGlzUmVhZHkgPSB0cnVlXG59KSA9PiB7XG4gIGNvbnN0IHVzZXJOYW1lID1cbiAgICB0eXBlb2YgY2xvdWRQcm92aWRlci5nZXRVc2VyTmFtZSA9PT0gJ2Z1bmN0aW9uJyA/IGNsb3VkUHJvdmlkZXIuZ2V0VXNlck5hbWUoKSA6IG51bGw7XG5cbiAgY29uc3Qgb25DbGlja0Nvbm5lY3QgPVxuICAgIHR5cGVvZiBvbkNvbm5lY3QgPT09ICdmdW5jdGlvbidcbiAgICAgID8gb25Db25uZWN0XG4gICAgICA6ICgpID0+IGNsb3VkUHJvdmlkZXIubG9naW4oKCkgPT4gb25TZXRDbG91ZFByb3ZpZGVyKGNsb3VkUHJvdmlkZXIubmFtZSkpO1xuXG4gIGNvbnN0IG9uQ2xpY2tMb2dvdXQgPVxuICAgIHR5cGVvZiBvbkxvZ291dCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBvbkxvZ291dFxuICAgICAgOiAoKSA9PiBjbG91ZFByb3ZpZGVyLmxvZ291dCgoKSA9PiAoaXNTZWxlY3RlZCA/IG9uU2V0Q2xvdWRQcm92aWRlcihudWxsKSA6IG51bGwpKTtcblxuICByZXR1cm4gKFxuICAgIDxTdHlsZWRCb3g+XG4gICAgICA8U3R5bGVkVGlsZVdyYXBwZXIgb25DbGljaz17aXNDb25uZWN0ZWQgPyBvblNlbGVjdCA6IG9uQ2xpY2tDb25uZWN0fSBzZWxlY3RlZD17aXNTZWxlY3RlZH0+XG4gICAgICAgIDxTdHlsZWRDbG91ZE5hbWU+e2Nsb3VkUHJvdmlkZXIuZGlzcGxheU5hbWUgfHwgY2xvdWRQcm92aWRlci5uYW1lfTwvU3R5bGVkQ2xvdWROYW1lPlxuICAgICAgICB7Y2xvdWRQcm92aWRlci5pY29uID8gPGNsb3VkUHJvdmlkZXIuaWNvbiBoZWlnaHQ9XCI2NHB4XCIgLz4gOiBudWxsfVxuICAgICAgICA8QWN0aW9uQnV0dG9uIGlzQ29ubmVjdGVkPXtpc0Nvbm5lY3RlZH0gYWN0aW9uTmFtZT17YWN0aW9uTmFtZX0gaXNSZWFkeT17aXNSZWFkeX0gLz5cbiAgICAgICAge3VzZXJOYW1lICYmIDxTdHlsZWRVc2VyTmFtZT57dXNlck5hbWV9PC9TdHlsZWRVc2VyTmFtZT59XG4gICAgICAgIHtpc1NlbGVjdGVkICYmIDxDaGVja01hcmsgLz59XG4gICAgICA8L1N0eWxlZFRpbGVXcmFwcGVyPlxuICAgICAge2lzQ29ubmVjdGVkID8gKFxuICAgICAgICA8TG9nb3V0QnV0dG9uIGNsYXNzTmFtZT1cImxvZ291dC1idXR0b25cIiBvbkNsaWNrPXtvbkNsaWNrTG9nb3V0fSAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPExvZ2luQnV0dG9uIGNsYXNzTmFtZT1cImxvZ2luLWJ1dHRvblwiIG9uQ2xpY2s9e29uQ2xpY2tDb25uZWN0fSAvPlxuICAgICAgKX1cbiAgICA8L1N0eWxlZEJveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENsb3VkVGlsZTtcbiJdfQ==