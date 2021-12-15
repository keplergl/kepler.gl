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

var Rectangle = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Rectangle, _Component);

  var _super = _createSuper(Rectangle);

  function Rectangle() {
    (0, _classCallCheck2["default"])(this, Rectangle);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Rectangle, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("rect", {
        x: "2",
        y: "2",
        width: "18",
        height: "12",
        stroke: "currentColor",
        fill: "transparent",
        strokeWidth: "1.5"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 16C3.10457 16 4 15.1046 4 14C4 12.8954 3.10457 12 2 12C0.89543 12 0 12.8954 0 14C0 15.1046 0.89543 16 2 16Z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M20 16C21.1046 16 22 15.1046 22 14C22 12.8954 21.1046 12 20 12C18.8954 12 18 12.8954 18 14C18 15.1046 18.8954 16 20 16Z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M20 4C21.1046 4 22 3.10457 22 2C22 0.89543 21.1046 0 20 0C18.8954 0 18 0.89543 18 2C18 3.10457 18.8954 4 20 4Z"
      }));
    }
  }]);
  return Rectangle;
}(_react.Component);

exports["default"] = Rectangle;
(0, _defineProperty2["default"])(Rectangle, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  predefinedClassName: _propTypes["default"].string,
  viewBox: _propTypes["default"].string,
  style: _propTypes["default"].object
});
(0, _defineProperty2["default"])(Rectangle, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-rectangle',
  viewBox: '0 0 22 16'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9yZWN0YW5nbGUuanMiXSwibmFtZXMiOlsiUmVjdGFuZ2xlIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwidmlld0JveCIsInN0eWxlIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRXFCQSxTOzs7Ozs7Ozs7Ozs7V0FlbkIsa0JBQVM7QUFDUCwwQkFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsZUFDRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLEdBREo7QUFFRSxRQUFBLENBQUMsRUFBQyxHQUZKO0FBR0UsUUFBQSxLQUFLLEVBQUMsSUFIUjtBQUlFLFFBQUEsTUFBTSxFQUFDLElBSlQ7QUFLRSxRQUFBLE1BQU0sRUFBQyxjQUxUO0FBTUUsUUFBQSxJQUFJLEVBQUMsYUFOUDtBQU9FLFFBQUEsV0FBVyxFQUFDO0FBUGQsUUFERixlQVVFO0FBQ0UsUUFBQSxRQUFRLEVBQUMsU0FEWDtBQUVFLFFBQUEsUUFBUSxFQUFDLFNBRlg7QUFHRSxRQUFBLENBQUMsRUFBQztBQUhKLFFBVkYsZUFlRTtBQUNFLFFBQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxRQUFBLFFBQVEsRUFBQyxTQUZYO0FBR0UsUUFBQSxDQUFDLEVBQUM7QUFISixRQWZGLGVBb0JFO0FBQ0UsUUFBQSxRQUFRLEVBQUMsU0FEWDtBQUVFLFFBQUEsUUFBUSxFQUFDLFNBRlg7QUFHRSxRQUFBLENBQUMsRUFBQztBQUhKLFFBcEJGLGVBeUJFO0FBQ0UsUUFBQSxRQUFRLEVBQUMsU0FEWDtBQUVFLFFBQUEsUUFBUSxFQUFDLFNBRlg7QUFHRSxRQUFBLENBQUMsRUFBQztBQUhKLFFBekJGLENBREY7QUFpQ0Q7OztFQWpEb0NDLGdCOzs7aUNBQWxCRixTLGVBQ0E7QUFDakI7QUFDQUcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUMsTUFGRDtBQUdqQkMsRUFBQUEsbUJBQW1CLEVBQUVGLHNCQUFVQyxNQUhkO0FBSWpCRSxFQUFBQSxPQUFPLEVBQUVILHNCQUFVQyxNQUpGO0FBS2pCRyxFQUFBQSxLQUFLLEVBQUVKLHNCQUFVSztBQUxBLEM7aUNBREFULFMsa0JBU0c7QUFDcEJHLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCRyxFQUFBQSxtQkFBbUIsRUFBRSx5QkFGRDtBQUdwQkMsRUFBQUEsT0FBTyxFQUFFO0FBSFcsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmlld0JveDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtcmVjdGFuZ2xlJyxcbiAgICB2aWV3Qm94OiAnMCAwIDIyIDE2J1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cmVjdFxuICAgICAgICAgIHg9XCIyXCJcbiAgICAgICAgICB5PVwiMlwiXG4gICAgICAgICAgd2lkdGg9XCIxOFwiXG4gICAgICAgICAgaGVpZ2h0PVwiMTJcIlxuICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgZmlsbD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNMiA0QzMuMTA0NTcgNCA0IDMuMTA0NTcgNCAyQzQgMC44OTU0MyAzLjEwNDU3IDAgMiAwQzAuODk1NDMgMCAwIDAuODk1NDMgMCAyQzAgMy4xMDQ1NyAwLjg5NTQzIDQgMiA0WlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNMiAxNkMzLjEwNDU3IDE2IDQgMTUuMTA0NiA0IDE0QzQgMTIuODk1NCAzLjEwNDU3IDEyIDIgMTJDMC44OTU0MyAxMiAwIDEyLjg5NTQgMCAxNEMwIDE1LjEwNDYgMC44OTU0MyAxNiAyIDE2WlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNMjAgMTZDMjEuMTA0NiAxNiAyMiAxNS4xMDQ2IDIyIDE0QzIyIDEyLjg5NTQgMjEuMTA0NiAxMiAyMCAxMkMxOC44OTU0IDEyIDE4IDEyLjg5NTQgMTggMTRDMTggMTUuMTA0NiAxOC44OTU0IDE2IDIwIDE2WlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgIGQ9XCJNMjAgNEMyMS4xMDQ2IDQgMjIgMy4xMDQ1NyAyMiAyQzIyIDAuODk1NDMgMjEuMTA0NiAwIDIwIDBDMTguODk1NCAwIDE4IDAuODk1NDMgMTggMkMxOCAzLjEwNDU3IDE4Ljg5NTQgNCAyMCA0WlwiXG4gICAgICAgIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19