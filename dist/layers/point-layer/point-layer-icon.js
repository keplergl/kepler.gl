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

var PointLayerIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(PointLayerIcon, _Component);

  var _super = _createSuper(PointLayerIcon);

  function PointLayerIcon() {
    (0, _classCallCheck2["default"])(this, PointLayerIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(PointLayerIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("circle", {
        cx: "29.4",
        cy: "31.6",
        r: "8.4",
        className: "cr1"
      }), /*#__PURE__*/_react["default"].createElement("circle", {
        cx: "48.5",
        cy: "15.7",
        r: "6.5",
        className: "cr2"
      }), /*#__PURE__*/_react["default"].createElement("circle", {
        cx: "11",
        cy: "44.2",
        r: "3",
        className: "cr3"
      }), /*#__PURE__*/_react["default"].createElement("circle", {
        cx: "50",
        cy: "44.2",
        r: "5",
        className: "cr4"
      }), /*#__PURE__*/_react["default"].createElement("circle", {
        cx: "34",
        cy: "54.2",
        r: "3",
        className: "cr5"
      }), /*#__PURE__*/_react["default"].createElement("circle", {
        cx: "14",
        cy: "16.2",
        r: "4",
        className: "cr6"
      }));
    }
  }]);
  return PointLayerIcon;
}(_react.Component);

(0, _defineProperty2["default"])(PointLayerIcon, "propTypes", {
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(PointLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'point-layer-icon',
  totalColor: 6
});
var _default = PointLayerIcon;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXItaWNvbi5qcyJdLCJuYW1lcyI6WyJQb2ludExheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInByZWRlZmluZWRDbGFzc05hbWUiLCJ0b3RhbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRU1BLGM7Ozs7Ozs7Ozs7OztXQVlKLGtCQUFTO0FBQ1AsMEJBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLGVBQ0U7QUFBUSxRQUFBLEVBQUUsRUFBQyxNQUFYO0FBQWtCLFFBQUEsRUFBRSxFQUFDLE1BQXJCO0FBQTRCLFFBQUEsQ0FBQyxFQUFDLEtBQTlCO0FBQW9DLFFBQUEsU0FBUyxFQUFDO0FBQTlDLFFBREYsZUFFRTtBQUFRLFFBQUEsRUFBRSxFQUFDLE1BQVg7QUFBa0IsUUFBQSxFQUFFLEVBQUMsTUFBckI7QUFBNEIsUUFBQSxDQUFDLEVBQUMsS0FBOUI7QUFBb0MsUUFBQSxTQUFTLEVBQUM7QUFBOUMsUUFGRixlQUdFO0FBQVEsUUFBQSxFQUFFLEVBQUMsSUFBWDtBQUFnQixRQUFBLEVBQUUsRUFBQyxNQUFuQjtBQUEwQixRQUFBLENBQUMsRUFBQyxHQUE1QjtBQUFnQyxRQUFBLFNBQVMsRUFBQztBQUExQyxRQUhGLGVBSUU7QUFBUSxRQUFBLEVBQUUsRUFBQyxJQUFYO0FBQWdCLFFBQUEsRUFBRSxFQUFDLE1BQW5CO0FBQTBCLFFBQUEsQ0FBQyxFQUFDLEdBQTVCO0FBQWdDLFFBQUEsU0FBUyxFQUFDO0FBQTFDLFFBSkYsZUFLRTtBQUFRLFFBQUEsRUFBRSxFQUFDLElBQVg7QUFBZ0IsUUFBQSxFQUFFLEVBQUMsTUFBbkI7QUFBMEIsUUFBQSxDQUFDLEVBQUMsR0FBNUI7QUFBZ0MsUUFBQSxTQUFTLEVBQUM7QUFBMUMsUUFMRixlQU1FO0FBQVEsUUFBQSxFQUFFLEVBQUMsSUFBWDtBQUFnQixRQUFBLEVBQUUsRUFBQyxNQUFuQjtBQUEwQixRQUFBLENBQUMsRUFBQyxHQUE1QjtBQUFnQyxRQUFBLFNBQVMsRUFBQztBQUExQyxRQU5GLENBREY7QUFVRDs7O0VBdkIwQkMsZ0I7O2lDQUF2QkYsYyxlQUNlO0FBQ2pCRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQyxNQUREO0FBRWpCQyxFQUFBQSxNQUFNLEVBQUVGLHNCQUFVRyxPQUFWLENBQWtCSCxzQkFBVUMsTUFBNUI7QUFGUyxDO2lDQURmTCxjLGtCQU1rQjtBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJLLEVBQUFBLG1CQUFtQixFQUFFLGtCQUZEO0FBR3BCQyxFQUFBQSxVQUFVLEVBQUU7QUFIUSxDO2VBb0JUVCxjIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvYmFzZSc7XG5cbmNsYXNzIFBvaW50TGF5ZXJJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY29sb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ3BvaW50LWxheWVyLWljb24nLFxuICAgIHRvdGFsQ29sb3I6IDZcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjI5LjRcIiBjeT1cIjMxLjZcIiByPVwiOC40XCIgY2xhc3NOYW1lPVwiY3IxXCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjQ4LjVcIiBjeT1cIjE1LjdcIiByPVwiNi41XCIgY2xhc3NOYW1lPVwiY3IyXCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjExXCIgY3k9XCI0NC4yXCIgcj1cIjNcIiBjbGFzc05hbWU9XCJjcjNcIiAvPlxuICAgICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjQ0LjJcIiByPVwiNVwiIGNsYXNzTmFtZT1cImNyNFwiIC8+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIzNFwiIGN5PVwiNTQuMlwiIHI9XCIzXCIgY2xhc3NOYW1lPVwiY3I1XCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE0XCIgY3k9XCIxNi4yXCIgcj1cIjRcIiBjbGFzc05hbWU9XCJjcjZcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9pbnRMYXllckljb247XG4iXX0=