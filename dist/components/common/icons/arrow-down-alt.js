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

var ArrowDownAlt = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ArrowDownAlt, _Component);

  var _super = _createSuper(ArrowDownAlt);

  function ArrowDownAlt() {
    (0, _classCallCheck2["default"])(this, ArrowDownAlt);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ArrowDownAlt, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M30.9874294,23.8822323 L21.4022168,35.7397323 L21.4022168,3.80585729 C21.4022168,2.11829479 20.0731075,0.750419792 18.4333707,0.750419792 C16.7936338,0.750419792 15.4645245,2.11829479 15.4645245,3.80585729 L15.4645245,35.7397323 L5.87742937,23.8822323 C4.82882614,22.5802323 2.95282411,22.4077948 1.69713585,23.4869823 C0.433917229,24.5661698 0.26260144,26.4920448 1.31308727,27.789201 L16.1516703,46.1479823 C16.7155063,46.846451 17.552318,47.2504198 18.4333707,47.2504198 C19.3144233,47.2504198 20.151235,46.846451 20.7150711,46.1479823 L35.556478,27.789201 C36.6041399,26.4920448 36.4309415,24.5661698 35.1724294,23.4869823 C33.9007391,22.4077948 32.0407391,22.5802323 30.9874294,23.8822323 Z"
      }));
    }
  }]);
  return ArrowDownAlt;
}(_react.Component);

exports["default"] = ArrowDownAlt;
(0, _defineProperty2["default"])(ArrowDownAlt, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(ArrowDownAlt, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-arrow_down_alt'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9hcnJvdy1kb3duLWFsdC5qcyJdLCJuYW1lcyI6WyJBcnJvd0Rvd25BbHQiLCJwcm9wcyIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsInByZWRlZmluZWRDbGFzc05hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOzs7Ozs7SUFFcUJBLFk7Ozs7Ozs7Ozs7OztXQVduQixrQkFBUztBQUNQLDBCQUNFLGdDQUFDLGdCQUFELEVBQVUsS0FBS0MsS0FBZixlQUNFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQURGLENBREY7QUFLRDs7O0VBakJ1Q0MsZ0I7OztpQ0FBckJGLFksZUFDQTtBQUNqQjtBQUNBRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQztBQUZELEM7aUNBREFMLFksa0JBTUc7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRTtBQUZELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnJvd0Rvd25BbHQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtYXJyb3dfZG93bl9hbHQnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNMzAuOTg3NDI5NCwyMy44ODIyMzIzIEwyMS40MDIyMTY4LDM1LjczOTczMjMgTDIxLjQwMjIxNjgsMy44MDU4NTcyOSBDMjEuNDAyMjE2OCwyLjExODI5NDc5IDIwLjA3MzEwNzUsMC43NTA0MTk3OTIgMTguNDMzMzcwNywwLjc1MDQxOTc5MiBDMTYuNzkzNjMzOCwwLjc1MDQxOTc5MiAxNS40NjQ1MjQ1LDIuMTE4Mjk0NzkgMTUuNDY0NTI0NSwzLjgwNTg1NzI5IEwxNS40NjQ1MjQ1LDM1LjczOTczMjMgTDUuODc3NDI5MzcsMjMuODgyMjMyMyBDNC44Mjg4MjYxNCwyMi41ODAyMzIzIDIuOTUyODI0MTEsMjIuNDA3Nzk0OCAxLjY5NzEzNTg1LDIzLjQ4Njk4MjMgQzAuNDMzOTE3MjI5LDI0LjU2NjE2OTggMC4yNjI2MDE0NCwyNi40OTIwNDQ4IDEuMzEzMDg3MjcsMjcuNzg5MjAxIEwxNi4xNTE2NzAzLDQ2LjE0Nzk4MjMgQzE2LjcxNTUwNjMsNDYuODQ2NDUxIDE3LjU1MjMxOCw0Ny4yNTA0MTk4IDE4LjQzMzM3MDcsNDcuMjUwNDE5OCBDMTkuMzE0NDIzMyw0Ny4yNTA0MTk4IDIwLjE1MTIzNSw0Ni44NDY0NTEgMjAuNzE1MDcxMSw0Ni4xNDc5ODIzIEwzNS41NTY0NzgsMjcuNzg5MjAxIEMzNi42MDQxMzk5LDI2LjQ5MjA0NDggMzYuNDMwOTQxNSwyNC41NjYxNjk4IDM1LjE3MjQyOTQsMjMuNDg2OTgyMyBDMzMuOTAwNzM5MSwyMi40MDc3OTQ4IDMyLjA0MDczOTEsMjIuNTgwMjMyMyAzMC45ODc0Mjk0LDIzLjg4MjIzMjMgWlwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19