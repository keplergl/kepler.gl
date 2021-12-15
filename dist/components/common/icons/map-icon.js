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

var MapIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(MapIcon, _Component);

  var _super = _createSuper(MapIcon);

  function MapIcon() {
    (0, _classCallCheck2["default"])(this, MapIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(MapIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], (0, _extends2["default"])({}, this.props, {
        viewBox: '0 0 602 602'
      }), /*#__PURE__*/_react["default"].createElement("g", null, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M573.864,323.679l25.6-201.737L409.988,50.046L197.993,151.289L0,67.678l27.935,220.105L2.223,506.009l208.665,39.135 l200.136-38.125l189.865,43.823L573.864,323.679z M210.855,522.625L26.64,488.076l23.732-199.335L26.803,103.007l171.761,72.543 L410.987,74.083l164.331,62.361l-23.755,187.142l23.648,198.602l-163.764-37.782L210.855,522.625z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M506.021,405.449c-5.509,0-10.604,1.596-15.049,4.167c-17.531-12.832-35.583-27.904-36.47-47.735 c-1.217-27.195,15.439-53.227-3.623-78.182c-18.625-24.382-66.301-7.944-84.73-26.264c2.873-4.617,4.593-10.01,4.593-15.844 c0-16.671-13.519-30.192-30.187-30.192c-16.68,0-30.192,13.515-30.192,30.192c0,9.561,4.534,17.98,11.467,23.513 c-2.907,7.358-4.729,15.167-5.048,23.141c-0.496,12.596,3.121,25.126,0.391,37.634c-2.252,10.391-16.875,9.729-24.757,9.788 c-19.875,0.177-48.202-3.57-61.023,10.462c-3.783-2.843-8.207-4.812-13.077-5.621c-2.87-25.848,2.098-51.102-20.824-70.985 c-14.736-12.794-38.846-18.344-52.438-32.719c2.873-4.619,4.61-10.031,4.61-15.871c0-16.674-13.515-30.198-30.189-30.198 c-16.668,0-30.192,13.515-30.192,30.198c0,16.668,13.515,30.183,30.192,30.183c5.562,0,10.707-1.604,15.179-4.229 c10.048,10.083,23.915,16.784,36.892,23.56c16.529,8.627,28.844,19.698,31.108,39.283c1.241,10.734,0.762,21.291,1.46,31.854 c-12.135,3.918-20.978,15.16-20.978,28.602c0,16.681,13.515,30.192,30.195,30.192c16.668,0,30.189-13.512,30.189-30.192 c0-3.942-0.81-7.701-2.189-11.159c10.024-18.063,56.066-5.745,73.423-11.55c12.644-4.238,17.13-16.083,18.247-28.365 c1.063-11.473-2.637-22.757-0.91-34.283c0.686-4.69,1.867-9.224,3.439-13.55c1.644,0.271,3.311,0.502,5.024,0.502 c5.308,0,10.22-1.489,14.559-3.904c18.684,18.713,55.768,6.174,79.328,20.271c28.017,16.754-0.792,64.046,8.051,89.309 c6.123,17.472,22.13,30.499,37.994,42.232c-2.902,4.64-4.664,10.084-4.664,15.953c0,16.681,13.507,30.192,30.198,30.192 c16.657,0,30.192-13.512,30.192-30.192C536.213,418.979,522.689,405.449,506.021,405.449z"
      })));
    }
  }]);
  return MapIcon;
}(_react.Component);

(0, _defineProperty2["default"])(MapIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(MapIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-map-icon',
  totalColor: 1
});
var _default = MapIcon;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9tYXAtaWNvbi5qcyJdLCJuYW1lcyI6WyJNYXBJY29uIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJjb2xvcnMiLCJhcnJheU9mIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInRvdGFsQ29sb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVNQSxPOzs7Ozs7Ozs7Ozs7V0FhSixrQkFBUztBQUNQLDBCQUNFLGdDQUFDLGdCQUFELGdDQUFVLEtBQUtDLEtBQWY7QUFBc0IsUUFBQSxPQUFPLEVBQUU7QUFBL0IsdUJBQ0Usd0RBQ0U7QUFDRSxRQUFBLENBQUMsRUFBQztBQURKLFFBREYsZUFNRTtBQUNFLFFBQUEsQ0FBQyxFQUFDO0FBREosUUFORixDQURGLENBREY7QUEyQkQ7OztFQXpDbUJDLGdCOztpQ0FBaEJGLE8sZUFDZTtBQUNqQjtBQUNBRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQyxNQUZEO0FBR2pCQyxFQUFBQSxNQUFNLEVBQUVGLHNCQUFVRyxPQUFWLENBQWtCSCxzQkFBVUMsTUFBNUI7QUFIUyxDO2lDQURmTCxPLGtCQU9rQjtBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJLLEVBQUFBLG1CQUFtQixFQUFFLHdCQUZEO0FBR3BCQyxFQUFBQSxVQUFVLEVBQUU7QUFIUSxDO2VBcUNUVCxPIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY2xhc3MgTWFwSWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNvbG9yczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZylcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLW1hcC1pY29uJyxcbiAgICB0b3RhbENvbG9yOiAxXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30gdmlld0JveD17JzAgMCA2MDIgNjAyJ30+XG4gICAgICAgIDxnPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTU3My44NjQsMzIzLjY3OWwyNS42LTIwMS43MzdMNDA5Ljk4OCw1MC4wNDZMMTk3Ljk5MywxNTEuMjg5TDAsNjcuNjc4bDI3LjkzNSwyMjAuMTA1TDIuMjIzLDUwNi4wMDlsMjA4LjY2NSwzOS4xMzVcblx0XHRcdGwyMDAuMTM2LTM4LjEyNWwxODkuODY1LDQzLjgyM0w1NzMuODY0LDMyMy42Nzl6IE0yMTAuODU1LDUyMi42MjVMMjYuNjQsNDg4LjA3NmwyMy43MzItMTk5LjMzNUwyNi44MDMsMTAzLjAwN2wxNzEuNzYxLDcyLjU0M1xuXHRcdFx0TDQxMC45ODcsNzQuMDgzbDE2NC4zMzEsNjIuMzYxbC0yMy43NTUsMTg3LjE0MmwyMy42NDgsMTk4LjYwMmwtMTYzLjc2NC0zNy43ODJMMjEwLjg1NSw1MjIuNjI1elwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk01MDYuMDIxLDQwNS40NDljLTUuNTA5LDAtMTAuNjA0LDEuNTk2LTE1LjA0OSw0LjE2N2MtMTcuNTMxLTEyLjgzMi0zNS41ODMtMjcuOTA0LTM2LjQ3LTQ3LjczNVxuXHRcdFx0Yy0xLjIxNy0yNy4xOTUsMTUuNDM5LTUzLjIyNy0zLjYyMy03OC4xODJjLTE4LjYyNS0yNC4zODItNjYuMzAxLTcuOTQ0LTg0LjczLTI2LjI2NGMyLjg3My00LjYxNyw0LjU5My0xMC4wMSw0LjU5My0xNS44NDRcblx0XHRcdGMwLTE2LjY3MS0xMy41MTktMzAuMTkyLTMwLjE4Ny0zMC4xOTJjLTE2LjY4LDAtMzAuMTkyLDEzLjUxNS0zMC4xOTIsMzAuMTkyYzAsOS41NjEsNC41MzQsMTcuOTgsMTEuNDY3LDIzLjUxM1xuXHRcdFx0Yy0yLjkwNyw3LjM1OC00LjcyOSwxNS4xNjctNS4wNDgsMjMuMTQxYy0wLjQ5NiwxMi41OTYsMy4xMjEsMjUuMTI2LDAuMzkxLDM3LjYzNGMtMi4yNTIsMTAuMzkxLTE2Ljg3NSw5LjcyOS0yNC43NTcsOS43ODhcblx0XHRcdGMtMTkuODc1LDAuMTc3LTQ4LjIwMi0zLjU3LTYxLjAyMywxMC40NjJjLTMuNzgzLTIuODQzLTguMjA3LTQuODEyLTEzLjA3Ny01LjYyMWMtMi44Ny0yNS44NDgsMi4wOTgtNTEuMTAyLTIwLjgyNC03MC45ODVcblx0XHRcdGMtMTQuNzM2LTEyLjc5NC0zOC44NDYtMTguMzQ0LTUyLjQzOC0zMi43MTljMi44NzMtNC42MTksNC42MS0xMC4wMzEsNC42MS0xNS44NzFjMC0xNi42NzQtMTMuNTE1LTMwLjE5OC0zMC4xODktMzAuMTk4XG5cdFx0XHRjLTE2LjY2OCwwLTMwLjE5MiwxMy41MTUtMzAuMTkyLDMwLjE5OGMwLDE2LjY2OCwxMy41MTUsMzAuMTgzLDMwLjE5MiwzMC4xODNjNS41NjIsMCwxMC43MDctMS42MDQsMTUuMTc5LTQuMjI5XG5cdFx0XHRjMTAuMDQ4LDEwLjA4MywyMy45MTUsMTYuNzg0LDM2Ljg5MiwyMy41NmMxNi41MjksOC42MjcsMjguODQ0LDE5LjY5OCwzMS4xMDgsMzkuMjgzYzEuMjQxLDEwLjczNCwwLjc2MiwyMS4yOTEsMS40NiwzMS44NTRcblx0XHRcdGMtMTIuMTM1LDMuOTE4LTIwLjk3OCwxNS4xNi0yMC45NzgsMjguNjAyYzAsMTYuNjgxLDEzLjUxNSwzMC4xOTIsMzAuMTk1LDMwLjE5MmMxNi42NjgsMCwzMC4xODktMTMuNTEyLDMwLjE4OS0zMC4xOTJcblx0XHRcdGMwLTMuOTQyLTAuODEtNy43MDEtMi4xODktMTEuMTU5YzEwLjAyNC0xOC4wNjMsNTYuMDY2LTUuNzQ1LDczLjQyMy0xMS41NWMxMi42NDQtNC4yMzgsMTcuMTMtMTYuMDgzLDE4LjI0Ny0yOC4zNjVcblx0XHRcdGMxLjA2My0xMS40NzMtMi42MzctMjIuNzU3LTAuOTEtMzQuMjgzYzAuNjg2LTQuNjksMS44NjctOS4yMjQsMy40MzktMTMuNTVjMS42NDQsMC4yNzEsMy4zMTEsMC41MDIsNS4wMjQsMC41MDJcblx0XHRcdGM1LjMwOCwwLDEwLjIyLTEuNDg5LDE0LjU1OS0zLjkwNGMxOC42ODQsMTguNzEzLDU1Ljc2OCw2LjE3NCw3OS4zMjgsMjAuMjcxYzI4LjAxNywxNi43NTQtMC43OTIsNjQuMDQ2LDguMDUxLDg5LjMwOVxuXHRcdFx0YzYuMTIzLDE3LjQ3MiwyMi4xMywzMC40OTksMzcuOTk0LDQyLjIzMmMtMi45MDIsNC42NC00LjY2NCwxMC4wODQtNC42NjQsMTUuOTUzYzAsMTYuNjgxLDEzLjUwNywzMC4xOTIsMzAuMTk4LDMwLjE5MlxuXHRcdFx0YzE2LjY1NywwLDMwLjE5Mi0xMy41MTIsMzAuMTkyLTMwLjE5MkM1MzYuMjEzLDQxOC45NzksNTIyLjY4OSw0MDUuNDQ5LDUwNi4wMjEsNDA1LjQ0OXpcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEljb247XG4iXX0=