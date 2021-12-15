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

var TripLayerIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(TripLayerIcon, _Component);

  var _super = _createSuper(TripLayerIcon);

  function TripLayerIcon() {
    (0, _classCallCheck2["default"])(this, TripLayerIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(TripLayerIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("g", {
        clipPath: "url(#clip0)",
        className: "cr1"
      }, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M53.025 4.85005C50.25 2.07505 45.75 2.07505 42.975 4.85005C40.2 7.62505 40.2 12.2 42.975 14.975L48 20L53.025 14.9C55.8 12.2 55.8 7.62505 53.025 4.85005ZM48 11.375C47.175 11.375 46.5 10.7 46.5 9.87505C46.5 9.05005 47.175 8.37505 48 8.37505C48.825 8.37505 49.5 9.05005 49.5 9.87505C49.5 10.7 48.825 11.375 48 11.375Z"
      })), /*#__PURE__*/_react["default"].createElement("g", {
        clipPath: "url(#clip1)",
        className: "cr2"
      }, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M20.025 36.85C17.25 34.075 12.75 34.075 9.97502 36.85C7.20002 39.625 7.20002 44.2 9.97502 46.975L15 52L20.025 46.9C22.8 44.2 22.8 39.625 20.025 36.85ZM15 43.375C14.175 43.375 13.5 42.7 13.5 41.875C13.5 41.05 14.175 40.375 15 40.375C15.825 40.375 16.5 41.05 16.5 41.875C16.5 42.7 15.825 43.375 15 43.375Z"
      })), /*#__PURE__*/_react["default"].createElement("path", {
        className: "cr3",
        d: "M45.9943 19.8697C46.0661 20.6951 45.4552 21.4223 44.6299 21.4941L34.782 22.3504L38.1515 40.1604L17.8748 54.7185C17.2019 55.2016 16.2647 55.0478 15.7815 54.3748C15.2984 53.7019 15.4522 52.7647 16.1252 52.2815L34.8483 38.8389L31.2177 19.6491L44.37 18.5053C45.1953 18.4336 45.9225 19.0444 45.9943 19.8697Z"
      }), /*#__PURE__*/_react["default"].createElement("defs", null, /*#__PURE__*/_react["default"].createElement("clipPath", {
        id: "clip0"
      }, /*#__PURE__*/_react["default"].createElement("rect", {
        width: "18",
        height: "18",
        transform: "translate(39 2)"
      })), /*#__PURE__*/_react["default"].createElement("clipPath", {
        id: "clip1"
      }, /*#__PURE__*/_react["default"].createElement("rect", {
        width: "18",
        height: "18",
        transform: "translate(6 34)"
      }))));
    }
  }]);
  return TripLayerIcon;
}(_react.Component);

exports["default"] = TripLayerIcon;
(0, _defineProperty2["default"])(TripLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(TripLayerIcon, "defaultProps", {
  size: 'tiny',
  height: '16px',
  predefinedClassName: 'trip-layer-icon'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvdHJpcC1sYXllci90cmlwLWxheWVyLWljb24uanMiXSwibmFtZXMiOlsiVHJpcExheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInNpemUiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRXFCQSxhOzs7Ozs7Ozs7Ozs7V0FhbkIsa0JBQVM7QUFDUCwwQkFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsZUFDRTtBQUFHLFFBQUEsUUFBUSxFQUFDLGFBQVo7QUFBMEIsUUFBQSxTQUFTLEVBQUM7QUFBcEMsc0JBQ0U7QUFBTSxRQUFBLENBQUMsRUFBQztBQUFSLFFBREYsQ0FERixlQUlFO0FBQUcsUUFBQSxRQUFRLEVBQUMsYUFBWjtBQUEwQixRQUFBLFNBQVMsRUFBQztBQUFwQyxzQkFDRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFERixDQUpGLGVBT0U7QUFDRSxRQUFBLFNBQVMsRUFBQyxLQURaO0FBRUUsUUFBQSxDQUFDLEVBQUM7QUFGSixRQVBGLGVBV0UsMkRBQ0U7QUFBVSxRQUFBLEVBQUUsRUFBQztBQUFiLHNCQUNFO0FBQU0sUUFBQSxLQUFLLEVBQUMsSUFBWjtBQUFpQixRQUFBLE1BQU0sRUFBQyxJQUF4QjtBQUE2QixRQUFBLFNBQVMsRUFBQztBQUF2QyxRQURGLENBREYsZUFJRTtBQUFVLFFBQUEsRUFBRSxFQUFDO0FBQWIsc0JBQ0U7QUFBTSxRQUFBLEtBQUssRUFBQyxJQUFaO0FBQWlCLFFBQUEsTUFBTSxFQUFDLElBQXhCO0FBQTZCLFFBQUEsU0FBUyxFQUFDO0FBQXZDLFFBREYsQ0FKRixDQVhGLENBREY7QUFzQkQ7OztFQXBDd0NDLGdCOzs7aUNBQXRCRixhLGVBQ0E7QUFDakI7QUFDQUcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUMsTUFGRDtBQUdqQkMsRUFBQUEsTUFBTSxFQUFFRixzQkFBVUcsT0FBVixDQUFrQkgsc0JBQVVDLE1BQTVCO0FBSFMsQztpQ0FEQUwsYSxrQkFPRztBQUNwQlEsRUFBQUEsSUFBSSxFQUFFLE1BRGM7QUFFcEJMLEVBQUFBLE1BQU0sRUFBRSxNQUZZO0FBR3BCTSxFQUFBQSxtQkFBbUIsRUFBRTtBQUhELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJpcExheWVySWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNvbG9yczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZylcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNpemU6ICd0aW55JyxcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAndHJpcC1sYXllci1pY29uJ1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8ZyBjbGlwUGF0aD1cInVybCgjY2xpcDApXCIgY2xhc3NOYW1lPVwiY3IxXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk01My4wMjUgNC44NTAwNUM1MC4yNSAyLjA3NTA1IDQ1Ljc1IDIuMDc1MDUgNDIuOTc1IDQuODUwMDVDNDAuMiA3LjYyNTA1IDQwLjIgMTIuMiA0Mi45NzUgMTQuOTc1TDQ4IDIwTDUzLjAyNSAxNC45QzU1LjggMTIuMiA1NS44IDcuNjI1MDUgNTMuMDI1IDQuODUwMDVaTTQ4IDExLjM3NUM0Ny4xNzUgMTEuMzc1IDQ2LjUgMTAuNyA0Ni41IDkuODc1MDVDNDYuNSA5LjA1MDA1IDQ3LjE3NSA4LjM3NTA1IDQ4IDguMzc1MDVDNDguODI1IDguMzc1MDUgNDkuNSA5LjA1MDA1IDQ5LjUgOS44NzUwNUM0OS41IDEwLjcgNDguODI1IDExLjM3NSA0OCAxMS4zNzVaXCIgLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8ZyBjbGlwUGF0aD1cInVybCgjY2xpcDEpXCIgY2xhc3NOYW1lPVwiY3IyXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0yMC4wMjUgMzYuODVDMTcuMjUgMzQuMDc1IDEyLjc1IDM0LjA3NSA5Ljk3NTAyIDM2Ljg1QzcuMjAwMDIgMzkuNjI1IDcuMjAwMDIgNDQuMiA5Ljk3NTAyIDQ2Ljk3NUwxNSA1MkwyMC4wMjUgNDYuOUMyMi44IDQ0LjIgMjIuOCAzOS42MjUgMjAuMDI1IDM2Ljg1Wk0xNSA0My4zNzVDMTQuMTc1IDQzLjM3NSAxMy41IDQyLjcgMTMuNSA0MS44NzVDMTMuNSA0MS4wNSAxNC4xNzUgNDAuMzc1IDE1IDQwLjM3NUMxNS44MjUgNDAuMzc1IDE2LjUgNDEuMDUgMTYuNSA0MS44NzVDMTYuNSA0Mi43IDE1LjgyNSA0My4zNzUgMTUgNDMuMzc1WlwiIC8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBjbGFzc05hbWU9XCJjcjNcIlxuICAgICAgICAgIGQ9XCJNNDUuOTk0MyAxOS44Njk3QzQ2LjA2NjEgMjAuNjk1MSA0NS40NTUyIDIxLjQyMjMgNDQuNjI5OSAyMS40OTQxTDM0Ljc4MiAyMi4zNTA0TDM4LjE1MTUgNDAuMTYwNEwxNy44NzQ4IDU0LjcxODVDMTcuMjAxOSA1NS4yMDE2IDE2LjI2NDcgNTUuMDQ3OCAxNS43ODE1IDU0LjM3NDhDMTUuMjk4NCA1My43MDE5IDE1LjQ1MjIgNTIuNzY0NyAxNi4xMjUyIDUyLjI4MTVMMzQuODQ4MyAzOC44Mzg5TDMxLjIxNzcgMTkuNjQ5MUw0NC4zNyAxOC41MDUzQzQ1LjE5NTMgMTguNDMzNiA0NS45MjI1IDE5LjA0NDQgNDUuOTk0MyAxOS44Njk3WlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxkZWZzPlxuICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXAwXCI+XG4gICAgICAgICAgICA8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMzkgMilcIiAvPlxuICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY2xpcDFcIj5cbiAgICAgICAgICAgIDxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg2IDM0KVwiIC8+XG4gICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==