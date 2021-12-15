"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _base = _interopRequireDefault(require("./base"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Clipboard = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Clipboard, _Component);

  var _super = _createSuper(Clipboard);

  function Clipboard() {
    (0, _classCallCheck2["default"])(this, Clipboard);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Clipboard, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("path", {
        transform: "translate(6.000000, 0.000000)",
        d: "M46.8184484,5.81818182 L34.5871288,5.81818182 C33.3581445,2.44363636 30.1393762,7.10542736e-15 26.3353772,7.10542736e-15 C22.5313783,7.10542736e-15 19.31261,2.44363636 18.0836257,5.81818182 L5.85230605,5.81818182 C2.63353772,5.81818182 0,8.43636364 0,11.6363636 L0,58.1818182 C0,61.3818182 2.63353772,64 5.85230605,64 L46.8184484,64 C50.0372167,64 52.6707545,61.3818182 52.6707545,58.1818182 L52.6707545,11.6363636 C52.6707545,8.43636364 50.0372167,5.81818182 46.8184484,5.81818182 L46.8184484,5.81818182 Z M26.3353772,5.81818182 C27.9447614,5.81818182 29.2615303,7.12727273 29.2615303,8.72727273 C29.2615303,10.3272727 27.9447614,11.6363636 26.3353772,11.6363636 C24.7259931,11.6363636 23.4092242,10.3272727 23.4092242,8.72727273 C23.4092242,7.12727273 24.7259931,5.81818182 26.3353772,5.81818182 L26.3353772,5.81818182 Z M46.8184484,58.1818182 L5.85230605,58.1818182 L5.85230605,11.6363636 L11.7046121,11.6363636 L11.7046121,20.3636364 L40.9661424,20.3636364 L40.9661424,11.6363636 L46.8184484,11.6363636 L46.8184484,58.1818182 L46.8184484,58.1818182 Z"
      }));
    }
  }]);
  return Clipboard;
}(_react.Component);

exports["default"] = Clipboard;
(0, _defineProperty2["default"])(Clipboard, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Clipboard, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-clipboard'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jbGlwYm9hcmQuanMiXSwibmFtZXMiOlsiQ2xpcGJvYXJkIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRXFCQSxTOzs7Ozs7Ozs7Ozs7V0FXbkIsa0JBQVM7QUFDUCwwQkFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsZUFDRTtBQUNFLFFBQUEsU0FBUyxFQUFDLCtCQURaO0FBRUUsUUFBQSxDQUFDLEVBQUM7QUFGSixRQURGLENBREY7QUFRRDs7O0VBcEJvQ0MsZ0I7OztpQ0FBbEJGLFMsZUFDQTtBQUNqQjtBQUNBRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQztBQUZELEM7aUNBREFMLFMsa0JBTUc7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRTtBQUZELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGlwYm9hcmQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtY2xpcGJvYXJkJ1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg2LjAwMDAwMCwgMC4wMDAwMDApXCJcbiAgICAgICAgICBkPVwiTTQ2LjgxODQ0ODQsNS44MTgxODE4MiBMMzQuNTg3MTI4OCw1LjgxODE4MTgyIEMzMy4zNTgxNDQ1LDIuNDQzNjM2MzYgMzAuMTM5Mzc2Miw3LjEwNTQyNzM2ZS0xNSAyNi4zMzUzNzcyLDcuMTA1NDI3MzZlLTE1IEMyMi41MzEzNzgzLDcuMTA1NDI3MzZlLTE1IDE5LjMxMjYxLDIuNDQzNjM2MzYgMTguMDgzNjI1Nyw1LjgxODE4MTgyIEw1Ljg1MjMwNjA1LDUuODE4MTgxODIgQzIuNjMzNTM3NzIsNS44MTgxODE4MiAwLDguNDM2MzYzNjQgMCwxMS42MzYzNjM2IEwwLDU4LjE4MTgxODIgQzAsNjEuMzgxODE4MiAyLjYzMzUzNzcyLDY0IDUuODUyMzA2MDUsNjQgTDQ2LjgxODQ0ODQsNjQgQzUwLjAzNzIxNjcsNjQgNTIuNjcwNzU0NSw2MS4zODE4MTgyIDUyLjY3MDc1NDUsNTguMTgxODE4MiBMNTIuNjcwNzU0NSwxMS42MzYzNjM2IEM1Mi42NzA3NTQ1LDguNDM2MzYzNjQgNTAuMDM3MjE2Nyw1LjgxODE4MTgyIDQ2LjgxODQ0ODQsNS44MTgxODE4MiBMNDYuODE4NDQ4NCw1LjgxODE4MTgyIFogTTI2LjMzNTM3NzIsNS44MTgxODE4MiBDMjcuOTQ0NzYxNCw1LjgxODE4MTgyIDI5LjI2MTUzMDMsNy4xMjcyNzI3MyAyOS4yNjE1MzAzLDguNzI3MjcyNzMgQzI5LjI2MTUzMDMsMTAuMzI3MjcyNyAyNy45NDQ3NjE0LDExLjYzNjM2MzYgMjYuMzM1Mzc3MiwxMS42MzYzNjM2IEMyNC43MjU5OTMxLDExLjYzNjM2MzYgMjMuNDA5MjI0MiwxMC4zMjcyNzI3IDIzLjQwOTIyNDIsOC43MjcyNzI3MyBDMjMuNDA5MjI0Miw3LjEyNzI3MjczIDI0LjcyNTk5MzEsNS44MTgxODE4MiAyNi4zMzUzNzcyLDUuODE4MTgxODIgTDI2LjMzNTM3NzIsNS44MTgxODE4MiBaIE00Ni44MTg0NDg0LDU4LjE4MTgxODIgTDUuODUyMzA2MDUsNTguMTgxODE4MiBMNS44NTIzMDYwNSwxMS42MzYzNjM2IEwxMS43MDQ2MTIxLDExLjYzNjM2MzYgTDExLjcwNDYxMjEsMjAuMzYzNjM2NCBMNDAuOTY2MTQyNCwyMC4zNjM2MzY0IEw0MC45NjYxNDI0LDExLjYzNjM2MzYgTDQ2LjgxODQ0ODQsMTEuNjM2MzYzNiBMNDYuODE4NDQ4NCw1OC4xODE4MTgyIEw0Ni44MTg0NDg0LDU4LjE4MTgxODIgWlwiXG4gICAgICAgIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19