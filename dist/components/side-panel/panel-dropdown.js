"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = require("../common/styled-components");

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var ClickOutsideCloseDropdown =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ClickOutsideCloseDropdown, _Component);

  function ClickOutsideCloseDropdown() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, ClickOutsideCloseDropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(ClickOutsideCloseDropdown)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
      if (typeof _this.props.onClose === 'function' && _this.props.show) {
        _this.props.onClose(e);
      }
    });
    return _this;
  }

  (0, _createClass2["default"])(ClickOutsideCloseDropdown, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_styledComponents.StyledPanelDropdown, {
        type: this.props.type,
        className: this.props.className
      }, this.props.children);
    }
  }]);
  return ClickOutsideCloseDropdown;
}(_react.Component);

(0, _defineProperty2["default"])(ClickOutsideCloseDropdown, "propTypes", {
  onClose: _propTypes["default"].func,
  show: _propTypes["default"].bool,
  type: _propTypes["default"].string
});
(0, _defineProperty2["default"])(ClickOutsideCloseDropdown, "defaultProps", {
  show: true,
  type: 'dark'
});

var _default = (0, _reactOnclickoutside["default"])(ClickOutsideCloseDropdown);

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtZHJvcGRvd24uanMiXSwibmFtZXMiOlsiQ2xpY2tPdXRzaWRlQ2xvc2VEcm9wZG93biIsImUiLCJwcm9wcyIsIm9uQ2xvc2UiLCJzaG93IiwidHlwZSIsImNsYXNzTmFtZSIsImNoaWxkcmVuIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiZnVuYyIsImJvb2wiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBT01BLHlCOzs7Ozs7Ozs7Ozs7Ozs7OzsyR0FZaUIsVUFBQUMsQ0FBQyxFQUFJO0FBQ3hCLFVBQUksT0FBTyxNQUFLQyxLQUFMLENBQVdDLE9BQWxCLEtBQThCLFVBQTlCLElBQTRDLE1BQUtELEtBQUwsQ0FBV0UsSUFBM0QsRUFBaUU7QUFDL0QsY0FBS0YsS0FBTCxDQUFXQyxPQUFYLENBQW1CRixDQUFuQjtBQUNEO0FBQ0YsSzs7Ozs7OzZCQUVRO0FBQ1AsYUFDRSxnQ0FBQyxxQ0FBRDtBQUFxQixRQUFBLElBQUksRUFBRSxLQUFLQyxLQUFMLENBQVdHLElBQXRDO0FBQTRDLFFBQUEsU0FBUyxFQUFFLEtBQUtILEtBQUwsQ0FBV0k7QUFBbEUsU0FDRyxLQUFLSixLQUFMLENBQVdLLFFBRGQsQ0FERjtBQUtEOzs7RUF4QnFDQyxnQjs7aUNBQWxDUix5QixlQUNlO0FBQ2pCRyxFQUFBQSxPQUFPLEVBQUVNLHNCQUFVQyxJQURGO0FBRWpCTixFQUFBQSxJQUFJLEVBQUVLLHNCQUFVRSxJQUZDO0FBR2pCTixFQUFBQSxJQUFJLEVBQUVJLHNCQUFVRztBQUhDLEM7aUNBRGZaLHlCLGtCQU9rQjtBQUNwQkksRUFBQUEsSUFBSSxFQUFFLElBRGM7QUFFcEJDLEVBQUFBLElBQUksRUFBRTtBQUZjLEM7O2VBb0JULHFDQUFzQkwseUJBQXRCLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1N0eWxlZFBhbmVsRHJvcGRvd259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBsaXN0ZW5zVG9DbGlja091dHNpZGUgZnJvbSAncmVhY3Qtb25jbGlja291dHNpZGUnO1xuXG5jbGFzcyBDbGlja091dHNpZGVDbG9zZURyb3Bkb3duIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBzaG93OiBQcm9wVHlwZXMuYm9vbCxcbiAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzaG93OiB0cnVlLFxuICAgIHR5cGU6ICdkYXJrJ1xuICB9O1xuXG4gIGhhbmRsZUNsaWNrT3V0c2lkZSA9IGUgPT4ge1xuICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5vbkNsb3NlID09PSAnZnVuY3Rpb24nICYmIHRoaXMucHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5wcm9wcy5vbkNsb3NlKGUpO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRQYW5lbERyb3Bkb3duIHR5cGU9e3RoaXMucHJvcHMudHlwZX0gY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgPC9TdHlsZWRQYW5lbERyb3Bkb3duPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlKENsaWNrT3V0c2lkZUNsb3NlRHJvcGRvd24pO1xuIl19