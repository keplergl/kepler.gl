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

var Reduce = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Reduce, _Component);

  var _super = _createSuper(Reduce);

  function Reduce() {
    (0, _classCallCheck2["default"])(this, Reduce);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Reduce, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("g", {
        transform: "translate(12.000000, 12.000000)"
      }, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M36.5208333,13.9791667 L31.7291666,9.1875 L37.75,3.2083334 L34.7916666,0.25 L28.8125,6.2708334 L24.0208333,1.4791667 L24.0208333,13.9791667 L36.5208333,13.9791667 Z M13.9791667,1.4791667 L9.1875,6.2708334 L3.2083334,0.25 L0.25,3.2083334 L6.2708334,9.1875 L1.4791667,13.9791667 L13.9791667,13.9791667 L13.9791667,1.4791667 Z M1.4791667,24.0208333 L6.2708334,28.8125 L0.25,34.7916666 L3.2083334,37.75 L9.1875,31.7291666 L13.9791667,36.5208333 L13.9791667,24.0208333 L1.4791667,24.0208333 Z M24.0208333,36.5208333 L28.8125,31.7291666 L34.7916666,37.75 L37.75,34.7916666 L31.7291666,28.8125 L36.5208333,24.0208333 L24.0208333,24.0208333 L24.0208333,36.5208333 Z",
        id: "Shape"
      })));
    }
  }]);
  return Reduce;
}(_react.Component);

exports["default"] = Reduce;
(0, _defineProperty2["default"])(Reduce, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Reduce, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-reduce'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9yZWR1Y2UuanMiXSwibmFtZXMiOlsiUmVkdWNlIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRXFCQSxNOzs7Ozs7Ozs7Ozs7V0FXbkIsa0JBQVM7QUFDUCwwQkFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsZUFDRTtBQUFHLFFBQUEsU0FBUyxFQUFDO0FBQWIsc0JBQ0U7QUFDRSxRQUFBLENBQUMsRUFBQyxtcEJBREo7QUFFRSxRQUFBLEVBQUUsRUFBQztBQUZMLFFBREYsQ0FERixDQURGO0FBVUQ7OztFQXRCaUNDLGdCOzs7aUNBQWZGLE0sZUFDQTtBQUNqQjtBQUNBRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQztBQUZELEM7aUNBREFMLE0sa0JBTUc7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRTtBQUZELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWR1Y2UgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtcmVkdWNlJ1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMTIuMDAwMDAwLCAxMi4wMDAwMDApXCI+XG4gICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIGQ9XCJNMzYuNTIwODMzMywxMy45NzkxNjY3IEwzMS43MjkxNjY2LDkuMTg3NSBMMzcuNzUsMy4yMDgzMzM0IEwzNC43OTE2NjY2LDAuMjUgTDI4LjgxMjUsNi4yNzA4MzM0IEwyNC4wMjA4MzMzLDEuNDc5MTY2NyBMMjQuMDIwODMzMywxMy45NzkxNjY3IEwzNi41MjA4MzMzLDEzLjk3OTE2NjcgWiBNMTMuOTc5MTY2NywxLjQ3OTE2NjcgTDkuMTg3NSw2LjI3MDgzMzQgTDMuMjA4MzMzNCwwLjI1IEwwLjI1LDMuMjA4MzMzNCBMNi4yNzA4MzM0LDkuMTg3NSBMMS40NzkxNjY3LDEzLjk3OTE2NjcgTDEzLjk3OTE2NjcsMTMuOTc5MTY2NyBMMTMuOTc5MTY2NywxLjQ3OTE2NjcgWiBNMS40NzkxNjY3LDI0LjAyMDgzMzMgTDYuMjcwODMzNCwyOC44MTI1IEwwLjI1LDM0Ljc5MTY2NjYgTDMuMjA4MzMzNCwzNy43NSBMOS4xODc1LDMxLjcyOTE2NjYgTDEzLjk3OTE2NjcsMzYuNTIwODMzMyBMMTMuOTc5MTY2NywyNC4wMjA4MzMzIEwxLjQ3OTE2NjcsMjQuMDIwODMzMyBaIE0yNC4wMjA4MzMzLDM2LjUyMDgzMzMgTDI4LjgxMjUsMzEuNzI5MTY2NiBMMzQuNzkxNjY2NiwzNy43NSBMMzcuNzUsMzQuNzkxNjY2NiBMMzEuNzI5MTY2NiwyOC44MTI1IEwzNi41MjA4MzMzLDI0LjAyMDgzMzMgTDI0LjAyMDgzMzMsMjQuMDIwODMzMyBMMjQuMDIwODMzMywzNi41MjA4MzMzIFpcIlxuICAgICAgICAgICAgaWQ9XCJTaGFwZVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==