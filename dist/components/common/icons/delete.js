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

var Delete = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Delete, _Component);

  var _super = _createSuper(Delete);

  function Delete() {
    (0, _classCallCheck2["default"])(this, Delete);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Delete, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("g", {
        transform: "translate(8, 8)"
      }, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M31.5059707,24 L47.5987718,7.90719891 C48.1337427,7.37222791 48.1337427,6.50972364 47.5987718,5.97475264 L42.0252474,0.40122825 C41.4902764,-0.13374275 40.6277721,-0.13374275 40.0928011,0.40122825 L24,16.4940293 L7.90719891,0.40122825 C7.37222791,-0.13374275 6.50972364,-0.13374275 5.97475264,0.40122825 L0.40122825,5.97475264 C-0.13374275,6.50972364 -0.13374275,7.37222791 0.40122825,7.90719891 L16.4940293,24 L0.40122825,40.0928011 C-0.13374275,40.6277721 -0.13374275,41.4902764 0.40122825,42.0252474 L5.97475264,47.5987718 C6.50972364,48.1337427 7.37222791,48.1337427 7.90719891,47.5987718 L24,31.5059707 L40.0928011,47.5987718 C40.6277721,48.1337427 41.4902764,48.1337427 42.0252474,47.5987718 L47.5987718,42.0252474 C48.1337427,41.4902764 48.1337427,40.6277721 47.5987718,40.0928011 L31.5059707,24 Z"
      })));
    }
  }]);
  return Delete;
}(_react.Component);

exports["default"] = Delete;
(0, _defineProperty2["default"])(Delete, "propTypes", {
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Delete, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-delete'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9kZWxldGUuanMiXSwibmFtZXMiOlsiRGVsZXRlIiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRXFCQSxNOzs7Ozs7Ozs7Ozs7V0FVbkIsa0JBQVM7QUFDUCwwQkFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsZUFDRTtBQUFHLFFBQUEsU0FBUyxFQUFDO0FBQWIsc0JBQ0U7QUFBTSxRQUFBLENBQUMsRUFBQztBQUFSLFFBREYsQ0FERixDQURGO0FBT0Q7OztFQWxCaUNDLGdCOzs7aUNBQWZGLE0sZUFDQTtBQUNqQkcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUM7QUFERCxDO2lDQURBTCxNLGtCQUtHO0FBQ3BCRyxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkcsRUFBQUEsbUJBQW1CLEVBQUU7QUFGRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVsZXRlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWRlbGV0ZSdcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDgsIDgpXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0zMS41MDU5NzA3LDI0IEw0Ny41OTg3NzE4LDcuOTA3MTk4OTEgQzQ4LjEzMzc0MjcsNy4zNzIyMjc5MSA0OC4xMzM3NDI3LDYuNTA5NzIzNjQgNDcuNTk4NzcxOCw1Ljk3NDc1MjY0IEw0Mi4wMjUyNDc0LDAuNDAxMjI4MjUgQzQxLjQ5MDI3NjQsLTAuMTMzNzQyNzUgNDAuNjI3NzcyMSwtMC4xMzM3NDI3NSA0MC4wOTI4MDExLDAuNDAxMjI4MjUgTDI0LDE2LjQ5NDAyOTMgTDcuOTA3MTk4OTEsMC40MDEyMjgyNSBDNy4zNzIyMjc5MSwtMC4xMzM3NDI3NSA2LjUwOTcyMzY0LC0wLjEzMzc0Mjc1IDUuOTc0NzUyNjQsMC40MDEyMjgyNSBMMC40MDEyMjgyNSw1Ljk3NDc1MjY0IEMtMC4xMzM3NDI3NSw2LjUwOTcyMzY0IC0wLjEzMzc0Mjc1LDcuMzcyMjI3OTEgMC40MDEyMjgyNSw3LjkwNzE5ODkxIEwxNi40OTQwMjkzLDI0IEwwLjQwMTIyODI1LDQwLjA5MjgwMTEgQy0wLjEzMzc0Mjc1LDQwLjYyNzc3MjEgLTAuMTMzNzQyNzUsNDEuNDkwMjc2NCAwLjQwMTIyODI1LDQyLjAyNTI0NzQgTDUuOTc0NzUyNjQsNDcuNTk4NzcxOCBDNi41MDk3MjM2NCw0OC4xMzM3NDI3IDcuMzcyMjI3OTEsNDguMTMzNzQyNyA3LjkwNzE5ODkxLDQ3LjU5ODc3MTggTDI0LDMxLjUwNTk3MDcgTDQwLjA5MjgwMTEsNDcuNTk4NzcxOCBDNDAuNjI3NzcyMSw0OC4xMzM3NDI3IDQxLjQ5MDI3NjQsNDguMTMzNzQyNyA0Mi4wMjUyNDc0LDQ3LjU5ODc3MTggTDQ3LjU5ODc3MTgsNDIuMDI1MjQ3NCBDNDguMTMzNzQyNyw0MS40OTAyNzY0IDQ4LjEzMzc0MjcsNDAuNjI3NzcyMSA0Ny41OTg3NzE4LDQwLjA5MjgwMTEgTDMxLjUwNTk3MDcsMjQgWlwiIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG4iXX0=