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

var Login = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Login, _Component);

  var _super = _createSuper(Login);

  function Login() {
    (0, _classCallCheck2["default"])(this, Login);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Login, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("polygon", {
        id: "Path",
        points: "26.9730089 40.981391 30.7141656 44.7225477 44.0754395 31.3612739 30.7141656 18 26.9730089 21.7411567 33.9208713 28.6890191 8 28.6890191 8 34.0335286 33.9208713 34.0335286"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M50.7560765,8 L13.3445095,8 C10.4050293,8 8,10.4050293 8,13.3445095 L8,24.0335286 L13.3445095,24.0335286 L13.3445095,13.3445095 L50.7560765,13.3445095 L50.7560765,50.7560765 L13.3445095,50.7560765 L13.3445095,40.0670573 L8,40.0670573 L8,50.7560765 C8,53.6955566 10.4050293,56.1005859 13.3445095,56.1005859 L50.7560765,56.1005859 C53.6955566,56.1005859 56.1005859,53.6955566 56.1005859,50.7560765 L56.1005859,13.3445095 C56.1005859,10.4050293 53.6955566,8 50.7560765,8 Z"
      }));
    }
  }]);
  return Login;
}(_react.Component);

exports["default"] = Login;
(0, _defineProperty2["default"])(Login, "propTypes", {
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Login, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-login'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9sb2dpbi5qcyJdLCJuYW1lcyI6WyJMb2dpbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsSzs7Ozs7Ozs7Ozs7O1dBVW5CLGtCQUFTO0FBQ1AsMEJBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLGVBQ0U7QUFDRSxRQUFBLEVBQUUsRUFBQyxNQURMO0FBRUUsUUFBQSxNQUFNLEVBQUM7QUFGVCxRQURGLGVBS0U7QUFBTSxRQUFBLENBQUMsRUFBQztBQUFSLFFBTEYsQ0FERjtBQVNEOzs7RUFwQmdDQyxnQjs7O2lDQUFkRixLLGVBQ0E7QUFDakJHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDO0FBREQsQztpQ0FEQUwsSyxrQkFLRztBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJHLEVBQUFBLG1CQUFtQixFQUFFO0FBRkQsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWxvZ2luJ1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cG9seWdvblxuICAgICAgICAgIGlkPVwiUGF0aFwiXG4gICAgICAgICAgcG9pbnRzPVwiMjYuOTczMDA4OSA0MC45ODEzOTEgMzAuNzE0MTY1NiA0NC43MjI1NDc3IDQ0LjA3NTQzOTUgMzEuMzYxMjczOSAzMC43MTQxNjU2IDE4IDI2Ljk3MzAwODkgMjEuNzQxMTU2NyAzMy45MjA4NzEzIDI4LjY4OTAxOTEgOCAyOC42ODkwMTkxIDggMzQuMDMzNTI4NiAzMy45MjA4NzEzIDM0LjAzMzUyODZcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aCBkPVwiTTUwLjc1NjA3NjUsOCBMMTMuMzQ0NTA5NSw4IEMxMC40MDUwMjkzLDggOCwxMC40MDUwMjkzIDgsMTMuMzQ0NTA5NSBMOCwyNC4wMzM1Mjg2IEwxMy4zNDQ1MDk1LDI0LjAzMzUyODYgTDEzLjM0NDUwOTUsMTMuMzQ0NTA5NSBMNTAuNzU2MDc2NSwxMy4zNDQ1MDk1IEw1MC43NTYwNzY1LDUwLjc1NjA3NjUgTDEzLjM0NDUwOTUsNTAuNzU2MDc2NSBMMTMuMzQ0NTA5NSw0MC4wNjcwNTczIEw4LDQwLjA2NzA1NzMgTDgsNTAuNzU2MDc2NSBDOCw1My42OTU1NTY2IDEwLjQwNTAyOTMsNTYuMTAwNTg1OSAxMy4zNDQ1MDk1LDU2LjEwMDU4NTkgTDUwLjc1NjA3NjUsNTYuMTAwNTg1OSBDNTMuNjk1NTU2Niw1Ni4xMDA1ODU5IDU2LjEwMDU4NTksNTMuNjk1NTU2NiA1Ni4xMDA1ODU5LDUwLjc1NjA3NjUgTDU2LjEwMDU4NTksMTMuMzQ0NTA5NSBDNTYuMTAwNTg1OSwxMC40MDUwMjkzIDUzLjY5NTU1NjYsOCA1MC43NTYwNzY1LDggWlwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuIl19