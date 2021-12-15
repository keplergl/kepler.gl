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

var Close = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Close, _Component);

  var _super = _createSuper(Close);

  function Close() {
    (0, _classCallCheck2["default"])(this, Close);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Close, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("g", {
        transform: "translate(8,8)"
      }, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M16.127688,49.4434399 L0.686714703,34.0024666 C-0.228904901,33.086847 -0.228904901,31.6023343 0.686714703,30.6867147 C1.12641074,30.2470187 1.72276655,30 2.34459065,30 L17.785564,30 C19.0804456,30 20.1301546,31.049709 20.1301546,32.3445907 L20.1301546,47.785564 C20.1301546,49.0804456 19.0804456,50.1301546 17.785564,50.1301546 C17.1637399,50.1301546 16.5673841,49.883136 16.127688,49.4434399 Z"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M45.127688,19.4434399 L29.6867147,4.0024666 C28.7710951,3.086847 28.7710951,1.60233431 29.6867147,0.686714703 C30.1264107,0.247018663 30.7227665,-8.17124146e-14 31.3445907,-8.17124146e-14 L46.785564,-7.7547585e-14 C48.0804456,-7.7547585e-14 49.1301546,1.04970899 49.1301546,2.34459065 L49.1301546,17.785564 C49.1301546,19.0804456 48.0804456,20.1301546 46.785564,20.1301546 C46.1637399,20.1301546 45.5673841,19.883136 45.127688,19.4434399 Z",
        transform: "translate(39.065077, 10.065077) rotate(-180.000000) translate(-39.065077, -10.065077)"
      })));
    }
  }]);
  return Close;
}(_react.Component);

exports["default"] = Close;
(0, _defineProperty2["default"])(Close, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Close, "defaultProps", {
  height: '16px',
  predefinedClassName: 'data-ex-icons-closewindow'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jbG9zZS5qcyJdLCJuYW1lcyI6WyJDbG9zZSIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsSzs7Ozs7Ozs7Ozs7O1dBV25CLGtCQUFTO0FBQ1AsMEJBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLGVBQ0U7QUFBRyxRQUFBLFNBQVMsRUFBQztBQUFiLHNCQUNFO0FBQU0sUUFBQSxDQUFDLEVBQUM7QUFBUixRQURGLGVBRUU7QUFDRSxRQUFBLENBQUMsRUFBQyx5YkFESjtBQUVFLFFBQUEsU0FBUyxFQUFDO0FBRlosUUFGRixDQURGLENBREY7QUFXRDs7O0VBdkJnQ0MsZ0I7OztpQ0FBZEYsSyxlQUNBO0FBQ2pCO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDO0FBRkQsQztpQ0FEQUwsSyxrQkFNRztBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJHLEVBQUFBLG1CQUFtQixFQUFFO0FBRkQsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsb3NlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWNsb3Nld2luZG93J1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoOCw4KVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTYuMTI3Njg4LDQ5LjQ0MzQzOTkgTDAuNjg2NzE0NzAzLDM0LjAwMjQ2NjYgQy0wLjIyODkwNDkwMSwzMy4wODY4NDcgLTAuMjI4OTA0OTAxLDMxLjYwMjMzNDMgMC42ODY3MTQ3MDMsMzAuNjg2NzE0NyBDMS4xMjY0MTA3NCwzMC4yNDcwMTg3IDEuNzIyNzY2NTUsMzAgMi4zNDQ1OTA2NSwzMCBMMTcuNzg1NTY0LDMwIEMxOS4wODA0NDU2LDMwIDIwLjEzMDE1NDYsMzEuMDQ5NzA5IDIwLjEzMDE1NDYsMzIuMzQ0NTkwNyBMMjAuMTMwMTU0Niw0Ny43ODU1NjQgQzIwLjEzMDE1NDYsNDkuMDgwNDQ1NiAxOS4wODA0NDU2LDUwLjEzMDE1NDYgMTcuNzg1NTY0LDUwLjEzMDE1NDYgQzE3LjE2MzczOTksNTAuMTMwMTU0NiAxNi41NjczODQxLDQ5Ljg4MzEzNiAxNi4xMjc2ODgsNDkuNDQzNDM5OSBaXCIgLz5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk00NS4xMjc2ODgsMTkuNDQzNDM5OSBMMjkuNjg2NzE0Nyw0LjAwMjQ2NjYgQzI4Ljc3MTA5NTEsMy4wODY4NDcgMjguNzcxMDk1MSwxLjYwMjMzNDMxIDI5LjY4NjcxNDcsMC42ODY3MTQ3MDMgQzMwLjEyNjQxMDcsMC4yNDcwMTg2NjMgMzAuNzIyNzY2NSwtOC4xNzEyNDE0NmUtMTQgMzEuMzQ0NTkwNywtOC4xNzEyNDE0NmUtMTQgTDQ2Ljc4NTU2NCwtNy43NTQ3NTg1ZS0xNCBDNDguMDgwNDQ1NiwtNy43NTQ3NTg1ZS0xNCA0OS4xMzAxNTQ2LDEuMDQ5NzA4OTkgNDkuMTMwMTU0NiwyLjM0NDU5MDY1IEw0OS4xMzAxNTQ2LDE3Ljc4NTU2NCBDNDkuMTMwMTU0NiwxOS4wODA0NDU2IDQ4LjA4MDQ0NTYsMjAuMTMwMTU0NiA0Ni43ODU1NjQsMjAuMTMwMTU0NiBDNDYuMTYzNzM5OSwyMC4xMzAxNTQ2IDQ1LjU2NzM4NDEsMTkuODgzMTM2IDQ1LjEyNzY4OCwxOS40NDM0Mzk5IFpcIlxuICAgICAgICAgICAgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDM5LjA2NTA3NywgMTAuMDY1MDc3KSByb3RhdGUoLTE4MC4wMDAwMDApIHRyYW5zbGF0ZSgtMzkuMDY1MDc3LCAtMTAuMDY1MDc3KVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==