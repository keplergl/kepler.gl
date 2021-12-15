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

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var StyledTileWrapper = _styledComponents["default"].div.attrs({
  className: 'provider-tile__wrapper'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-start;\n  border-radius: 2px;\n  border: 1px solid\n    ", ";\n  color: ", ";\n  cursor: pointer;\n  font-weight: 500;\n  width: 120px;\n  height: 168px;\n  background-color: #ffffff;\n  transition: ", ";\n  position: relative;\n  :hover {\n    border: 1px solid ", ";\n    color: ", ";\n  }\n\n  .button {\n    margin-top: 20px;\n  }\n"])), function (props) {
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

var StyledBox = (0, _styledComponents["default"])(_styledComponents2.CenterVerticalFlexbox)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 12px;\n"])));

var StyledCloudName = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 12px;\n  margin-top: 12px;\n  margin-bottom: 4px;\n"])));

var StyledUserName = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 11px;\n  margin-top: 8px;\n  text-align: center;\n  color: ", ";\n  overflow: hidden;\n  width: 100px;\n  text-overflow: ellipsis;\n"])), function (props) {
  return props.theme.primaryBtnActBgd;
});

var LoginButton = function LoginButton(_ref) {
  var onClick = _ref.onClick;
  return /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
    className: "login-button",
    link: true,
    small: true,
    onClick: onClick
  }, /*#__PURE__*/_react["default"].createElement(_icons.Login, null), "Login");
};

var LogoutButton = function LogoutButton(_ref2) {
  var onClick = _ref2.onClick;
  return /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
    className: "logout-button",
    link: true,
    small: true,
    onClick: onClick
  }, /*#__PURE__*/_react["default"].createElement(_icons.Logout, null), "Logout");
};

var ActionButton = function ActionButton(_ref3) {
  var isConnected = _ref3.isConnected,
      _ref3$actionName = _ref3.actionName,
      actionName = _ref3$actionName === void 0 ? null : _ref3$actionName,
      isReady = _ref3.isReady;
  return isConnected && actionName ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
    className: "cloud-tile__action",
    small: true,
    secondary: true,
    disabled: !isReady
  }, isReady ? actionName : /*#__PURE__*/_react["default"].createElement(_loadingSpinner["default"], {
    size: 12
  })) : null;
};

var CloudTile = function CloudTile(_ref4) {
  var onSelect = _ref4.onSelect,
      _ref4$onConnect = _ref4.onConnect,
      onConnect = _ref4$onConnect === void 0 ? null : _ref4$onConnect,
      _ref4$onLogout = _ref4.onLogout,
      onLogout = _ref4$onLogout === void 0 ? null : _ref4$onLogout,
      _ref4$actionName = _ref4.actionName,
      actionName = _ref4$actionName === void 0 ? null : _ref4$actionName,
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
  return /*#__PURE__*/_react["default"].createElement(StyledBox, null, /*#__PURE__*/_react["default"].createElement(StyledTileWrapper, {
    onClick: isConnected ? onSelect : onClickConnect,
    selected: isSelected
  }, /*#__PURE__*/_react["default"].createElement(StyledCloudName, null, cloudProvider.displayName || cloudProvider.name), cloudProvider.icon ? /*#__PURE__*/_react["default"].createElement(cloudProvider.icon, {
    height: "64px"
  }) : null, /*#__PURE__*/_react["default"].createElement(ActionButton, {
    isConnected: isConnected,
    actionName: actionName,
    isReady: isReady
  }), userName && /*#__PURE__*/_react["default"].createElement(StyledUserName, null, userName), isSelected && /*#__PURE__*/_react["default"].createElement(_styledComponents2.CheckMark, null)), isConnected ? /*#__PURE__*/_react["default"].createElement(LogoutButton, {
    onClick: onClickLogout
  }) : /*#__PURE__*/_react["default"].createElement(LoginButton, {
    onClick: onClickConnect
  }));
};

var _default = CloudTile;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9jbG91ZC10aWxlLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFRpbGVXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsInNlbGVjdGVkIiwidGhlbWUiLCJwcmltYXJ5QnRuQmdkIiwic2VsZWN0Qm9yZGVyQ29sb3JMVCIsInRyYW5zaXRpb24iLCJTdHlsZWRCb3giLCJDZW50ZXJWZXJ0aWNhbEZsZXhib3giLCJTdHlsZWRDbG91ZE5hbWUiLCJTdHlsZWRVc2VyTmFtZSIsInByaW1hcnlCdG5BY3RCZ2QiLCJMb2dpbkJ1dHRvbiIsIm9uQ2xpY2siLCJMb2dvdXRCdXR0b24iLCJBY3Rpb25CdXR0b24iLCJpc0Nvbm5lY3RlZCIsImFjdGlvbk5hbWUiLCJpc1JlYWR5IiwiQ2xvdWRUaWxlIiwib25TZWxlY3QiLCJvbkNvbm5lY3QiLCJvbkxvZ291dCIsImNsb3VkUHJvdmlkZXIiLCJvblNldENsb3VkUHJvdmlkZXIiLCJpc1NlbGVjdGVkIiwidXNlck5hbWUiLCJnZXRVc2VyTmFtZSIsIm9uQ2xpY2tDb25uZWN0IiwibG9naW4iLCJuYW1lIiwib25DbGlja0xvZ291dCIsImxvZ291dCIsImRpc3BsYXlOYW1lIiwiaWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxpQkFBaUIsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUN6Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRDhCLENBQWpCLENBQUgsc2dCQVNqQixVQUFBQyxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDQyxRQUFOLEdBQWlCRCxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsYUFBN0IsR0FBNkNILEtBQUssQ0FBQ0UsS0FBTixDQUFZRSxtQkFBOUQ7QUFBQSxDQVRZLEVBVVosVUFBQUosS0FBSztBQUFBLFNBQUtBLEtB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LElBWEosQ0FERjtBQWdCRCxDQWpERDs7ZUFtRGVULFMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0xvZ291dCwgTG9naW59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7Q2VudGVyVmVydGljYWxGbGV4Ym94LCBCdXR0b24sIENoZWNrTWFya30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IExvYWRpbmdTcGlubmVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2xvYWRpbmctc3Bpbm5lcic7XG5cbmNvbnN0IFN0eWxlZFRpbGVXcmFwcGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3Byb3ZpZGVyLXRpbGVfX3dyYXBwZXInXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkXG4gICAgJHtwcm9wcyA9PiAocHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQmdkIDogcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3JMVCl9O1xuICBjb2xvcjogJHtwcm9wcyA9PiAocHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQmdkIDogcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3JMVCl9O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIHdpZHRoOiAxMjBweDtcbiAgaGVpZ2h0OiAxNjhweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICA6aG92ZXIge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gIH1cblxuICAuYnV0dG9uIHtcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRCb3ggPSBzdHlsZWQoQ2VudGVyVmVydGljYWxGbGV4Ym94KWBcbiAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xuYDtcblxuY29uc3QgU3R5bGVkQ2xvdWROYW1lID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAxMnB4O1xuICBtYXJnaW4tdG9wOiAxMnB4O1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRVc2VyTmFtZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgbWFyZ2luLXRvcDogOHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5BY3RCZ2R9O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMTAwcHg7XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuYDtcblxuY29uc3QgTG9naW5CdXR0b24gPSAoe29uQ2xpY2t9KSA9PiAoXG4gIDxCdXR0b24gY2xhc3NOYW1lPVwibG9naW4tYnV0dG9uXCIgbGluayBzbWFsbCBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICA8TG9naW4gLz5cbiAgICBMb2dpblxuICA8L0J1dHRvbj5cbik7XG5cbmNvbnN0IExvZ291dEJ1dHRvbiA9ICh7b25DbGlja30pID0+IChcbiAgPEJ1dHRvbiBjbGFzc05hbWU9XCJsb2dvdXQtYnV0dG9uXCIgbGluayBzbWFsbCBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICA8TG9nb3V0IC8+XG4gICAgTG9nb3V0XG4gIDwvQnV0dG9uPlxuKTtcblxuY29uc3QgQWN0aW9uQnV0dG9uID0gKHtpc0Nvbm5lY3RlZCwgYWN0aW9uTmFtZSA9IG51bGwsIGlzUmVhZHl9KSA9PlxuICBpc0Nvbm5lY3RlZCAmJiBhY3Rpb25OYW1lID8gKFxuICAgIDxCdXR0b24gY2xhc3NOYW1lPVwiY2xvdWQtdGlsZV9fYWN0aW9uXCIgc21hbGwgc2Vjb25kYXJ5IGRpc2FibGVkPXshaXNSZWFkeX0+XG4gICAgICB7aXNSZWFkeSA/IGFjdGlvbk5hbWUgOiA8TG9hZGluZ1NwaW5uZXIgc2l6ZT17MTJ9IC8+fVxuICAgIDwvQnV0dG9uPlxuICApIDogbnVsbDtcblxuY29uc3QgQ2xvdWRUaWxlID0gKHtcbiAgLy8gYWN0aW9uIHdoZW4gY2xpY2sgb24gdGhlIHRpbGVcbiAgb25TZWxlY3QsXG4gIC8vIGRlZmF1bHQgdG8gbG9naW5cbiAgb25Db25uZWN0ID0gbnVsbCxcbiAgLy8gZGVmYXVsdCB0byBsb2dvdXRcbiAgb25Mb2dvdXQgPSBudWxsLFxuICAvLyBhY3Rpb24gbmFtZVxuICBhY3Rpb25OYW1lID0gbnVsbCxcbiAgLy8gY2xvdWQgcHJvdmlkZXIgY2xhc3NcbiAgY2xvdWRQcm92aWRlcixcbiAgLy8gZnVuY3Rpb24gdG8gdGFrZSBhZnRlciBsb2dpbiBvciBsb2dvdXRcbiAgb25TZXRDbG91ZFByb3ZpZGVyLFxuICAvLyB3aGV0aGVyIHByb3ZpZGVyIGlzIHNlbGVjdGVkIGFzIGN1cnJlbnRQcm92aWRlclxuICBpc1NlbGVjdGVkLFxuICAvLyB3aGV0aGVyIHVzZXIgaGFzIGxvZ2dlZCBpblxuICBpc0Nvbm5lY3RlZCxcblxuICBpc1JlYWR5ID0gdHJ1ZVxufSkgPT4ge1xuICBjb25zdCB1c2VyTmFtZSA9XG4gICAgdHlwZW9mIGNsb3VkUHJvdmlkZXIuZ2V0VXNlck5hbWUgPT09ICdmdW5jdGlvbicgPyBjbG91ZFByb3ZpZGVyLmdldFVzZXJOYW1lKCkgOiBudWxsO1xuXG4gIGNvbnN0IG9uQ2xpY2tDb25uZWN0ID1cbiAgICB0eXBlb2Ygb25Db25uZWN0ID09PSAnZnVuY3Rpb24nXG4gICAgICA/IG9uQ29ubmVjdFxuICAgICAgOiAoKSA9PiBjbG91ZFByb3ZpZGVyLmxvZ2luKCgpID0+IG9uU2V0Q2xvdWRQcm92aWRlcihjbG91ZFByb3ZpZGVyLm5hbWUpKTtcblxuICBjb25zdCBvbkNsaWNrTG9nb3V0ID1cbiAgICB0eXBlb2Ygb25Mb2dvdXQgPT09ICdmdW5jdGlvbidcbiAgICAgID8gb25Mb2dvdXRcbiAgICAgIDogKCkgPT4gY2xvdWRQcm92aWRlci5sb2dvdXQoKCkgPT4gKGlzU2VsZWN0ZWQgPyBvblNldENsb3VkUHJvdmlkZXIobnVsbCkgOiBudWxsKSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3R5bGVkQm94PlxuICAgICAgPFN0eWxlZFRpbGVXcmFwcGVyIG9uQ2xpY2s9e2lzQ29ubmVjdGVkID8gb25TZWxlY3QgOiBvbkNsaWNrQ29ubmVjdH0gc2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9PlxuICAgICAgICA8U3R5bGVkQ2xvdWROYW1lPntjbG91ZFByb3ZpZGVyLmRpc3BsYXlOYW1lIHx8IGNsb3VkUHJvdmlkZXIubmFtZX08L1N0eWxlZENsb3VkTmFtZT5cbiAgICAgICAge2Nsb3VkUHJvdmlkZXIuaWNvbiA/IDxjbG91ZFByb3ZpZGVyLmljb24gaGVpZ2h0PVwiNjRweFwiIC8+IDogbnVsbH1cbiAgICAgICAgPEFjdGlvbkJ1dHRvbiBpc0Nvbm5lY3RlZD17aXNDb25uZWN0ZWR9IGFjdGlvbk5hbWU9e2FjdGlvbk5hbWV9IGlzUmVhZHk9e2lzUmVhZHl9IC8+XG4gICAgICAgIHt1c2VyTmFtZSAmJiA8U3R5bGVkVXNlck5hbWU+e3VzZXJOYW1lfTwvU3R5bGVkVXNlck5hbWU+fVxuICAgICAgICB7aXNTZWxlY3RlZCAmJiA8Q2hlY2tNYXJrIC8+fVxuICAgICAgPC9TdHlsZWRUaWxlV3JhcHBlcj5cbiAgICAgIHtpc0Nvbm5lY3RlZCA/IChcbiAgICAgICAgPExvZ291dEJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrTG9nb3V0fSAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPExvZ2luQnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2tDb25uZWN0fSAvPlxuICAgICAgKX1cbiAgICA8L1N0eWxlZEJveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENsb3VkVGlsZTtcbiJdfQ==