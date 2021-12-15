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

var _base = _interopRequireDefault(require("../../components/common/icons/base"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var S2LayerIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(S2LayerIcon, _Component);

  var _super = _createSuper(S2LayerIcon);

  function S2LayerIcon() {
    (0, _classCallCheck2["default"])(this, S2LayerIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(S2LayerIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M14.76,58,15,20.54,50.06,6.75V44Zm4-34.86L18.6,52.38l27.66-11V12.33Z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M27.21,38.58a7.38,7.38,0,0,1-3.62-.9l.3-2a6.49,6.49,0,0,0,3.3.9c1.49,0,2.18-.59,2.18-1.63,0-2.26-5.71-1.28-5.71-5.3,0-2,1.26-3.54,4.16-3.54a8.38,8.38,0,0,1,3.28.64l-.29,1.9a8.41,8.41,0,0,0-2.88-.54c-1.63,0-2.14.66-2.14,1.42,0,2.19,5.71,1.18,5.71,5.27C31.5,37.16,29.93,38.58,27.21,38.58Z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M36.17,36.36v0h5.06l0,2H33.32V36.9c3-2.88,5.67-5.09,5.67-7,0-1-.64-1.67-2.19-1.67a5,5,0,0,0-3,1.1l-.53-1.79a6.31,6.31,0,0,1,3.91-1.28c2.66,0,4,1.34,4,3.41C41.21,31.94,39.13,33.89,36.17,36.36Z"
      }));
    }
  }]);
  return S2LayerIcon;
}(_react.Component);

(0, _defineProperty2["default"])(S2LayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(S2LayerIcon, "defaultProps", {
  height: '18px',
  predefinedClassName: 's2-layer-icon'
});
var _default = S2LayerIcon;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvczItZ2VvbWV0cnktbGF5ZXIvczItbGF5ZXItaWNvbi5qcyJdLCJuYW1lcyI6WyJTMkxheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInByZWRlZmluZWRDbGFzc05hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOzs7Ozs7SUFFTUEsVzs7Ozs7Ozs7Ozs7O1dBV0osa0JBQVM7QUFDUCwwQkFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsZUFDRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFERixlQUVFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQUZGLGVBR0U7QUFBTSxRQUFBLENBQUMsRUFBQztBQUFSLFFBSEYsQ0FERjtBQU9EOzs7RUFuQnVCQyxnQjs7aUNBQXBCRixXLGVBQ2U7QUFDakI7QUFDQUcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUMsTUFGRDtBQUdqQkMsRUFBQUEsTUFBTSxFQUFFRixzQkFBVUcsT0FBVixDQUFrQkgsc0JBQVVDLE1BQTVCO0FBSFMsQztpQ0FEZkwsVyxrQkFNa0I7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCSyxFQUFBQSxtQkFBbUIsRUFBRTtBQUZELEM7ZUFnQlRSLFciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlJztcblxuY2xhc3MgUzJMYXllckljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjb2xvcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpXG4gIH07XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMThweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ3MyLWxheWVyLWljb24nXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTQuNzYsNTgsMTUsMjAuNTQsNTAuMDYsNi43NVY0NFptNC0zNC44NkwxOC42LDUyLjM4bDI3LjY2LTExVjEyLjMzWlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjcuMjEsMzguNThhNy4zOCw3LjM4LDAsMCwxLTMuNjItLjlsLjMtMmE2LjQ5LDYuNDksMCwwLDAsMy4zLjljMS40OSwwLDIuMTgtLjU5LDIuMTgtMS42MywwLTIuMjYtNS43MS0xLjI4LTUuNzEtNS4zLDAtMiwxLjI2LTMuNTQsNC4xNi0zLjU0YTguMzgsOC4zOCwwLDAsMSwzLjI4LjY0bC0uMjksMS45YTguNDEsOC40MSwwLDAsMC0yLjg4LS41NGMtMS42MywwLTIuMTQuNjYtMi4xNCwxLjQyLDAsMi4xOSw1LjcxLDEuMTgsNS43MSw1LjI3QzMxLjUsMzcuMTYsMjkuOTMsMzguNTgsMjcuMjEsMzguNThaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0zNi4xNywzNi4zNnYwaDUuMDZsMCwySDMzLjMyVjM2LjljMy0yLjg4LDUuNjctNS4wOSw1LjY3LTcsMC0xLS42NC0xLjY3LTIuMTktMS42N2E1LDUsMCwwLDAtMywxLjFsLS41My0xLjc5YTYuMzEsNi4zMSwwLDAsMSwzLjkxLTEuMjhjMi42NiwwLDQsMS4zNCw0LDMuNDFDNDEuMjEsMzEuOTQsMzkuMTMsMzMuODksMzYuMTcsMzYuMzZaXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFMyTGF5ZXJJY29uO1xuIl19