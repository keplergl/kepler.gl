"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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

var Copy = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Copy, _Component);

  var _super = _createSuper(Copy);

  function Copy() {
    (0, _classCallCheck2["default"])(this, Copy);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Copy, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], (0, _extends2["default"])({
        viewBox: "0 0 64 64"
      }, this.props), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M37.2402913,45.4271845 L37.2402913,53.2402913 L9.66990291,53.2402913 L9.66990291,25.6699029 L17.4830097,25.6699029 L17.4830097,21 L8.59223301,21 C6.61650485,21 5,22.6165049 5,24.592233 L5,54.407767 C5,56.3834951 6.61650485,58 8.59223301,58 L38.407767,58 C40.3834951,58 42,56.3834951 42,54.407767 L42,45.5169903 L37.2402913,45.5169903 L37.2402913,45.4271845 Z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M52.407767,7 L22.592233,7 C20.6165049,7 19,8.61650485 19,10.592233 L19,40.407767 C19,42.3834951 20.6165049,44 22.592233,44 L52.407767,44 C54.3834951,44 56,42.3834951 56,40.407767 L56,10.592233 C56,8.61650485 54.3834951,7 52.407767,7 Z M51.3300971,39.2402913 L23.7597087,39.2402913 L23.7597087,11.6699029 L51.4199029,11.6699029 L51.4199029,39.2402913 L51.3300971,39.2402913 Z"
      }));
    }
  }]);
  return Copy;
}(_react.Component);

exports["default"] = Copy;
(0, _defineProperty2["default"])(Copy, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Copy, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-copy'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jb3B5LmpzIl0sIm5hbWVzIjpbIkNvcHkiLCJwcm9wcyIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsInByZWRlZmluZWRDbGFzc05hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsSTs7Ozs7Ozs7Ozs7O1dBV25CLGtCQUFTO0FBQ1AsMEJBQ0UsZ0NBQUMsZ0JBQUQ7QUFBTSxRQUFBLE9BQU8sRUFBQztBQUFkLFNBQThCLEtBQUtDLEtBQW5DLGdCQUNFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQURGLGVBRUU7QUFBTSxRQUFBLENBQUMsRUFBQztBQUFSLFFBRkYsQ0FERjtBQU1EOzs7RUFsQitCQyxnQjs7O2lDQUFiRixJLGVBQ0E7QUFDakI7QUFDQUcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUM7QUFGRCxDO2lDQURBTCxJLGtCQU1HO0FBQ3BCRyxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkcsRUFBQUEsbUJBQW1CLEVBQUU7QUFGRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29weSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1jb3B5J1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugdmlld0JveD1cIjAgMCA2NCA2NFwiIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk0zNy4yNDAyOTEzLDQ1LjQyNzE4NDUgTDM3LjI0MDI5MTMsNTMuMjQwMjkxMyBMOS42Njk5MDI5MSw1My4yNDAyOTEzIEw5LjY2OTkwMjkxLDI1LjY2OTkwMjkgTDE3LjQ4MzAwOTcsMjUuNjY5OTAyOSBMMTcuNDgzMDA5NywyMSBMOC41OTIyMzMwMSwyMSBDNi42MTY1MDQ4NSwyMSA1LDIyLjYxNjUwNDkgNSwyNC41OTIyMzMgTDUsNTQuNDA3NzY3IEM1LDU2LjM4MzQ5NTEgNi42MTY1MDQ4NSw1OCA4LjU5MjIzMzAxLDU4IEwzOC40MDc3NjcsNTggQzQwLjM4MzQ5NTEsNTggNDIsNTYuMzgzNDk1MSA0Miw1NC40MDc3NjcgTDQyLDQ1LjUxNjk5MDMgTDM3LjI0MDI5MTMsNDUuNTE2OTkwMyBMMzcuMjQwMjkxMyw0NS40MjcxODQ1IFpcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTUyLjQwNzc2Nyw3IEwyMi41OTIyMzMsNyBDMjAuNjE2NTA0OSw3IDE5LDguNjE2NTA0ODUgMTksMTAuNTkyMjMzIEwxOSw0MC40MDc3NjcgQzE5LDQyLjM4MzQ5NTEgMjAuNjE2NTA0OSw0NCAyMi41OTIyMzMsNDQgTDUyLjQwNzc2Nyw0NCBDNTQuMzgzNDk1MSw0NCA1Niw0Mi4zODM0OTUxIDU2LDQwLjQwNzc2NyBMNTYsMTAuNTkyMjMzIEM1Niw4LjYxNjUwNDg1IDU0LjM4MzQ5NTEsNyA1Mi40MDc3NjcsNyBaIE01MS4zMzAwOTcxLDM5LjI0MDI5MTMgTDIzLjc1OTcwODcsMzkuMjQwMjkxMyBMMjMuNzU5NzA4NywxMS42Njk5MDI5IEw1MS40MTk5MDI5LDExLjY2OTkwMjkgTDUxLjQxOTkwMjksMzkuMjQwMjkxMyBMNTEuMzMwMDk3MSwzOS4yNDAyOTEzIFpcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==