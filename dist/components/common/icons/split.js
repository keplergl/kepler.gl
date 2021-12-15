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

var Split = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Split, _Component);

  var _super = _createSuper(Split);

  function Split() {
    (0, _classCallCheck2["default"])(this, Split);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Split, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("g", {
        transform: "translate(7.500000, 7.500000)"
      }, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M19.5,47.4137931 C19.5,48.8421157 20.6192881,50 22,50 C23.3807119,50 24.5,48.8421157 24.5,47.4137931 L24.5,2.5862069 C24.5,1.15788427 23.3807119,0 22,0 C20.6192881,0 19.5,1.15788427 19.5,2.5862069 L19.5,47.4137931 Z"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "0",
        y: "4",
        width: "44",
        height: "5",
        rx: "2.5"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        transform: "translate(2.500000, 24.500000) rotate(90.000000) translate(-2.500000, -24.500000) ",
        x: "-18",
        y: "22",
        width: "41",
        height: "5",
        rx: "2.5"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        transform: "translate(41.500000, 25.000000) rotate(90.000000) translate(-41.500000, -25.000000) ",
        x: "20.5",
        y: "22.5",
        width: "42",
        height: "5",
        rx: "2.5"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "0",
        y: "41",
        width: "44",
        height: "5",
        rx: "2.5"
      })));
    }
  }]);
  return Split;
}(_react.Component);

exports["default"] = Split;
(0, _defineProperty2["default"])(Split, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Split, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-split'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zcGxpdC5qcyJdLCJuYW1lcyI6WyJTcGxpdCIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsSzs7Ozs7Ozs7Ozs7O1dBV25CLGtCQUFTO0FBQ1AsMEJBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLGVBQ0U7QUFBRyxRQUFBLFNBQVMsRUFBQztBQUFiLHNCQUNFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQURGLGVBRUU7QUFBTSxRQUFBLENBQUMsRUFBQyxHQUFSO0FBQVksUUFBQSxDQUFDLEVBQUMsR0FBZDtBQUFrQixRQUFBLEtBQUssRUFBQyxJQUF4QjtBQUE2QixRQUFBLE1BQU0sRUFBQyxHQUFwQztBQUF3QyxRQUFBLEVBQUUsRUFBQztBQUEzQyxRQUZGLGVBR0U7QUFDRSxRQUFBLFNBQVMsRUFBQyxvRkFEWjtBQUVFLFFBQUEsQ0FBQyxFQUFDLEtBRko7QUFHRSxRQUFBLENBQUMsRUFBQyxJQUhKO0FBSUUsUUFBQSxLQUFLLEVBQUMsSUFKUjtBQUtFLFFBQUEsTUFBTSxFQUFDLEdBTFQ7QUFNRSxRQUFBLEVBQUUsRUFBQztBQU5MLFFBSEYsZUFXRTtBQUNFLFFBQUEsU0FBUyxFQUFDLHNGQURaO0FBRUUsUUFBQSxDQUFDLEVBQUMsTUFGSjtBQUdFLFFBQUEsQ0FBQyxFQUFDLE1BSEo7QUFJRSxRQUFBLEtBQUssRUFBQyxJQUpSO0FBS0UsUUFBQSxNQUFNLEVBQUMsR0FMVDtBQU1FLFFBQUEsRUFBRSxFQUFDO0FBTkwsUUFYRixlQW1CRTtBQUFNLFFBQUEsQ0FBQyxFQUFDLEdBQVI7QUFBWSxRQUFBLENBQUMsRUFBQyxJQUFkO0FBQW1CLFFBQUEsS0FBSyxFQUFDLElBQXpCO0FBQThCLFFBQUEsTUFBTSxFQUFDLEdBQXJDO0FBQXlDLFFBQUEsRUFBRSxFQUFDO0FBQTVDLFFBbkJGLENBREYsQ0FERjtBQXlCRDs7O0VBckNnQ0MsZ0I7OztpQ0FBZEYsSyxlQUNBO0FBQ2pCO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDO0FBRkQsQztpQ0FEQUwsSyxrQkFNRztBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJHLEVBQUFBLG1CQUFtQixFQUFFO0FBRkQsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwbGl0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLXNwbGl0J1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNy41MDAwMDAsIDcuNTAwMDAwKVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTkuNSw0Ny40MTM3OTMxIEMxOS41LDQ4Ljg0MjExNTcgMjAuNjE5Mjg4MSw1MCAyMiw1MCBDMjMuMzgwNzExOSw1MCAyNC41LDQ4Ljg0MjExNTcgMjQuNSw0Ny40MTM3OTMxIEwyNC41LDIuNTg2MjA2OSBDMjQuNSwxLjE1Nzg4NDI3IDIzLjM4MDcxMTksMCAyMiwwIEMyMC42MTkyODgxLDAgMTkuNSwxLjE1Nzg4NDI3IDE5LjUsMi41ODYyMDY5IEwxOS41LDQ3LjQxMzc5MzEgWlwiIC8+XG4gICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiNFwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI1XCIgcng9XCIyLjVcIiAvPlxuICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMi41MDAwMDAsIDI0LjUwMDAwMCkgcm90YXRlKDkwLjAwMDAwMCkgdHJhbnNsYXRlKC0yLjUwMDAwMCwgLTI0LjUwMDAwMCkgXCJcbiAgICAgICAgICAgIHg9XCItMThcIlxuICAgICAgICAgICAgeT1cIjIyXCJcbiAgICAgICAgICAgIHdpZHRoPVwiNDFcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiNVwiXG4gICAgICAgICAgICByeD1cIjIuNVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDQxLjUwMDAwMCwgMjUuMDAwMDAwKSByb3RhdGUoOTAuMDAwMDAwKSB0cmFuc2xhdGUoLTQxLjUwMDAwMCwgLTI1LjAwMDAwMCkgXCJcbiAgICAgICAgICAgIHg9XCIyMC41XCJcbiAgICAgICAgICAgIHk9XCIyMi41XCJcbiAgICAgICAgICAgIHdpZHRoPVwiNDJcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiNVwiXG4gICAgICAgICAgICByeD1cIjIuNVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8cmVjdCB4PVwiMFwiIHk9XCI0MVwiIHdpZHRoPVwiNDRcIiBoZWlnaHQ9XCI1XCIgcng9XCIyLjVcIiAvPlxuICAgICAgICA8L2c+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19