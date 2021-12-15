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

var VertDots = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(VertDots, _Component);

  var _super = _createSuper(VertDots);

  function VertDots() {
    (0, _classCallCheck2["default"])(this, VertDots);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(VertDots, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("rect", {
        x: "35.01",
        y: "48.31",
        width: "6.44",
        height: "6.44"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "35.01",
        y: "35.43",
        width: "6.44",
        height: "6.44"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "35.01",
        y: "22.55",
        width: "6.44",
        height: "6.44"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "35.01",
        y: "9.67",
        width: "6.44",
        height: "6.44"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "22.13",
        y: "48.31",
        width: "6.44",
        height: "6.44"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "22.13",
        y: "35.43",
        width: "6.44",
        height: "6.44"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "22.13",
        y: "22.55",
        width: "6.44",
        height: "6.44"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "22.13",
        y: "9.67",
        width: "6.44",
        height: "6.44"
      }));
    }
  }]);
  return VertDots;
}(_react.Component);

exports["default"] = VertDots;
(0, _defineProperty2["default"])(VertDots, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(VertDots, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-vertdot'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy92ZXJ0LWRvdHMuanMiXSwibmFtZXMiOlsiVmVydERvdHMiLCJwcm9wcyIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsInByZWRlZmluZWRDbGFzc05hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOzs7Ozs7SUFFcUJBLFE7Ozs7Ozs7Ozs7OztXQVduQixrQkFBUztBQUNQLDBCQUNFLGdDQUFDLGdCQUFELEVBQVUsS0FBS0MsS0FBZixlQUNFO0FBQU0sUUFBQSxDQUFDLEVBQUMsT0FBUjtBQUFnQixRQUFBLENBQUMsRUFBQyxPQUFsQjtBQUEwQixRQUFBLEtBQUssRUFBQyxNQUFoQztBQUF1QyxRQUFBLE1BQU0sRUFBQztBQUE5QyxRQURGLGVBRUU7QUFBTSxRQUFBLENBQUMsRUFBQyxPQUFSO0FBQWdCLFFBQUEsQ0FBQyxFQUFDLE9BQWxCO0FBQTBCLFFBQUEsS0FBSyxFQUFDLE1BQWhDO0FBQXVDLFFBQUEsTUFBTSxFQUFDO0FBQTlDLFFBRkYsZUFHRTtBQUFNLFFBQUEsQ0FBQyxFQUFDLE9BQVI7QUFBZ0IsUUFBQSxDQUFDLEVBQUMsT0FBbEI7QUFBMEIsUUFBQSxLQUFLLEVBQUMsTUFBaEM7QUFBdUMsUUFBQSxNQUFNLEVBQUM7QUFBOUMsUUFIRixlQUlFO0FBQU0sUUFBQSxDQUFDLEVBQUMsT0FBUjtBQUFnQixRQUFBLENBQUMsRUFBQyxNQUFsQjtBQUF5QixRQUFBLEtBQUssRUFBQyxNQUEvQjtBQUFzQyxRQUFBLE1BQU0sRUFBQztBQUE3QyxRQUpGLGVBS0U7QUFBTSxRQUFBLENBQUMsRUFBQyxPQUFSO0FBQWdCLFFBQUEsQ0FBQyxFQUFDLE9BQWxCO0FBQTBCLFFBQUEsS0FBSyxFQUFDLE1BQWhDO0FBQXVDLFFBQUEsTUFBTSxFQUFDO0FBQTlDLFFBTEYsZUFNRTtBQUFNLFFBQUEsQ0FBQyxFQUFDLE9BQVI7QUFBZ0IsUUFBQSxDQUFDLEVBQUMsT0FBbEI7QUFBMEIsUUFBQSxLQUFLLEVBQUMsTUFBaEM7QUFBdUMsUUFBQSxNQUFNLEVBQUM7QUFBOUMsUUFORixlQU9FO0FBQU0sUUFBQSxDQUFDLEVBQUMsT0FBUjtBQUFnQixRQUFBLENBQUMsRUFBQyxPQUFsQjtBQUEwQixRQUFBLEtBQUssRUFBQyxNQUFoQztBQUF1QyxRQUFBLE1BQU0sRUFBQztBQUE5QyxRQVBGLGVBUUU7QUFBTSxRQUFBLENBQUMsRUFBQyxPQUFSO0FBQWdCLFFBQUEsQ0FBQyxFQUFDLE1BQWxCO0FBQXlCLFFBQUEsS0FBSyxFQUFDLE1BQS9CO0FBQXNDLFFBQUEsTUFBTSxFQUFDO0FBQTdDLFFBUkYsQ0FERjtBQVlEOzs7RUF4Qm1DQyxnQjs7O2lDQUFqQkYsUSxlQUNBO0FBQ2pCO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDO0FBRkQsQztpQ0FEQUwsUSxrQkFNRztBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJHLEVBQUFBLG1CQUFtQixFQUFFO0FBRkQsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlcnREb3RzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLXZlcnRkb3QnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxyZWN0IHg9XCIzNS4wMVwiIHk9XCI0OC4zMVwiIHdpZHRoPVwiNi40NFwiIGhlaWdodD1cIjYuNDRcIiAvPlxuICAgICAgICA8cmVjdCB4PVwiMzUuMDFcIiB5PVwiMzUuNDNcIiB3aWR0aD1cIjYuNDRcIiBoZWlnaHQ9XCI2LjQ0XCIgLz5cbiAgICAgICAgPHJlY3QgeD1cIjM1LjAxXCIgeT1cIjIyLjU1XCIgd2lkdGg9XCI2LjQ0XCIgaGVpZ2h0PVwiNi40NFwiIC8+XG4gICAgICAgIDxyZWN0IHg9XCIzNS4wMVwiIHk9XCI5LjY3XCIgd2lkdGg9XCI2LjQ0XCIgaGVpZ2h0PVwiNi40NFwiIC8+XG4gICAgICAgIDxyZWN0IHg9XCIyMi4xM1wiIHk9XCI0OC4zMVwiIHdpZHRoPVwiNi40NFwiIGhlaWdodD1cIjYuNDRcIiAvPlxuICAgICAgICA8cmVjdCB4PVwiMjIuMTNcIiB5PVwiMzUuNDNcIiB3aWR0aD1cIjYuNDRcIiBoZWlnaHQ9XCI2LjQ0XCIgLz5cbiAgICAgICAgPHJlY3QgeD1cIjIyLjEzXCIgeT1cIjIyLjU1XCIgd2lkdGg9XCI2LjQ0XCIgaGVpZ2h0PVwiNi40NFwiIC8+XG4gICAgICAgIDxyZWN0IHg9XCIyMi4xM1wiIHk9XCI5LjY3XCIgd2lkdGg9XCI2LjQ0XCIgaGVpZ2h0PVwiNi40NFwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19