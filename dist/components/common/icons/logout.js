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

var _base = _interopRequireDefault(require("./base"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Logout = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Logout, _Component);

  var _super = _createSuper(Logout);

  function Logout() {
    (0, _classCallCheck2["default"])(this, Logout);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Logout, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("polygon", {
        points: "27.1024306 41.981391 23.3612739 45.7225477 10 32.3612739 23.3612739 19 27.1024306 22.7411567 20.1545681 29.6890191 46.0754395 29.6890191 46.0754395 35.0335286 20.1545681 35.0335286"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M50.7560765,8 L13.3445095,8 C10.4050293,8 8,10.4050293 8,13.3445095 L8,24.0335286 L13.3445095,24.0335286 L13.3445095,13.3445095 L50.7560765,13.3445095 L50.7560765,50.7560765 L13.3445095,50.7560765 L13.3445095,40.0670573 L8,40.0670573 L8,50.7560765 C8,53.6955566 10.4050293,56.1005859 13.3445095,56.1005859 L50.7560765,56.1005859 C53.6955566,56.1005859 56.1005859,53.6955566 56.1005859,50.7560765 L56.1005859,13.3445095 C56.1005859,10.4050293 53.6955566,8 50.7560765,8 Z"
      }));
    }
  }]);
  return Logout;
}(_react.Component);

exports["default"] = Logout;
(0, _defineProperty2["default"])(Logout, "propTypes", {
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Logout, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-logout'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9sb2dvdXQuanMiXSwibmFtZXMiOlsiTG9nb3V0IiwicHJvcHMiLCJDb21wb25lbnQiLCJoZWlnaHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRXFCQSxNOzs7Ozs7Ozs7Ozs7V0FVbkIsa0JBQVM7QUFDUCwwQkFDRSxnQ0FBQyxnQkFBRCxFQUFVLEtBQUtDLEtBQWYsZUFDRTtBQUFTLFFBQUEsTUFBTSxFQUFDO0FBQWhCLFFBREYsZUFFRTtBQUFNLFFBQUEsQ0FBQyxFQUFDO0FBQVIsUUFGRixDQURGO0FBTUQ7OztFQWpCaUNDLGdCOzs7aUNBQWZGLE0sZUFDQTtBQUNqQkcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUM7QUFERCxDO2lDQURBTCxNLGtCQUtHO0FBQ3BCRyxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkcsRUFBQUEsbUJBQW1CLEVBQUU7QUFGRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nb3V0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWxvZ291dCdcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiMjcuMTAyNDMwNiA0MS45ODEzOTEgMjMuMzYxMjczOSA0NS43MjI1NDc3IDEwIDMyLjM2MTI3MzkgMjMuMzYxMjczOSAxOSAyNy4xMDI0MzA2IDIyLjc0MTE1NjcgMjAuMTU0NTY4MSAyOS42ODkwMTkxIDQ2LjA3NTQzOTUgMjkuNjg5MDE5MSA0Ni4wNzU0Mzk1IDM1LjAzMzUyODYgMjAuMTU0NTY4MSAzNS4wMzM1Mjg2XCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk01MC43NTYwNzY1LDggTDEzLjM0NDUwOTUsOCBDMTAuNDA1MDI5Myw4IDgsMTAuNDA1MDI5MyA4LDEzLjM0NDUwOTUgTDgsMjQuMDMzNTI4NiBMMTMuMzQ0NTA5NSwyNC4wMzM1Mjg2IEwxMy4zNDQ1MDk1LDEzLjM0NDUwOTUgTDUwLjc1NjA3NjUsMTMuMzQ0NTA5NSBMNTAuNzU2MDc2NSw1MC43NTYwNzY1IEwxMy4zNDQ1MDk1LDUwLjc1NjA3NjUgTDEzLjM0NDUwOTUsNDAuMDY3MDU3MyBMOCw0MC4wNjcwNTczIEw4LDUwLjc1NjA3NjUgQzgsNTMuNjk1NTU2NiAxMC40MDUwMjkzLDU2LjEwMDU4NTkgMTMuMzQ0NTA5NSw1Ni4xMDA1ODU5IEw1MC43NTYwNzY1LDU2LjEwMDU4NTkgQzUzLjY5NTU1NjYsNTYuMTAwNTg1OSA1Ni4xMDA1ODU5LDUzLjY5NTU1NjYgNTYuMTAwNTg1OSw1MC43NTYwNzY1IEw1Ni4xMDA1ODU5LDEzLjM0NDUwOTUgQzU2LjEwMDU4NTksMTAuNDA1MDI5MyA1My42OTU1NTY2LDggNTAuNzU2MDc2NSw4IFpcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==