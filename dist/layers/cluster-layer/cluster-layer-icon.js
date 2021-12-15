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

var ClusterLayerIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ClusterLayerIcon, _Component);

  var _super = _createSuper(ClusterLayerIcon);

  function ClusterLayerIcon() {
    (0, _classCallCheck2["default"])(this, ClusterLayerIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ClusterLayerIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M13.6,22.7c2.9-3.6,4.4-6.3,4.4-8c0-2.7-2.2-4.9-4.9-4.9S8.2,12,8.2,14.7c0,1.7,1.5,4.4,4.4,8l0,0 C12.8,23,13.2,23,13.6,22.7C13.5,22.8,13.6,22.7,13.6,22.7z",
        className: "cr1"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M22.9,57.4c2.5-3.1,3.8-5.5,3.8-7c0-2.4-2-4.4-4.4-4.4S18,48,18,50.4c0,1.5,1.3,3.8,3.8,7l0,0 c0.3,0.3,0.7,0.4,1,0.1C22.9,57.4,22.9,57.4,22.9,57.4z",
        className: "cr2"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M51.4,22.5c2.8-3.4,4.2-6,4.2-7.6c0-2.6-2.1-4.8-4.8-4.8c-2.6,0-4.8,2.1-4.8,4.8c0,1.6,1.4,4.2,4.2,7.6 l0,0c0.3,0.3,0.8,0.4,1.1,0.1C51.3,22.5,51.4,22.5,51.4,22.5z",
        className: "cr3"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M49.2,53.8c3.7-4.5,5.5-7.8,5.5-9.9c0-3.3-2.7-6.1-6.1-6.1c-3.3,0-6.1,2.7-6.1,6.1 c0,2.1,1.8,5.4,5.5,9.9l0,0c0.3,0.3,0.7,0.4,1.1,0.1C49.1,53.8,49.1,53.8,49.2,53.8z",
        className: "cr4"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M31.4,39.6C36.5,33.5,39,29,39,26.1c0-4.4-3.6-8-8-8s-8,3.6-8,8c0,2.9,2.5,7.4,7.6,13.5l0,0 C30.8,39.8,31.1,39.9,31.4,39.6C31.3,39.7,31.4,39.6,31.4,39.6z",
        className: "cr5"
      }));
    }
  }]);
  return ClusterLayerIcon;
}(_react.Component);

(0, _defineProperty2["default"])(ClusterLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(ClusterLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'cluster-layer-icon',
  totalColor: 5
});
var _default = ClusterLayerIcon;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvY2x1c3Rlci1sYXllci9jbHVzdGVyLWxheWVyLWljb24uanMiXSwibmFtZXMiOlsiQ2x1c3RlckxheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInByZWRlZmluZWRDbGFzc05hbWUiLCJ0b3RhbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRU1BLGdCOzs7Ozs7Ozs7Ozs7V0FhSixrQkFBUztBQUNQLDBCQUNFLGdDQUFDLGdCQUFELEVBQVUsS0FBS0MsS0FBZixlQUNFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsMEpBREo7QUFHRSxRQUFBLFNBQVMsRUFBQztBQUhaLFFBREYsZUFNRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLGtKQURKO0FBR0UsUUFBQSxTQUFTLEVBQUM7QUFIWixRQU5GLGVBV0U7QUFDRSxRQUFBLENBQUMsRUFBQyxpS0FESjtBQUdFLFFBQUEsU0FBUyxFQUFDO0FBSFosUUFYRixlQWdCRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLG1LQURKO0FBR0UsUUFBQSxTQUFTLEVBQUM7QUFIWixRQWhCRixlQXFCRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLHdKQURKO0FBR0UsUUFBQSxTQUFTLEVBQUM7QUFIWixRQXJCRixDQURGO0FBNkJEOzs7RUEzQzRCQyxnQjs7aUNBQXpCRixnQixlQUNlO0FBQ2pCO0FBQ0FHLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDLE1BRkQ7QUFHakJDLEVBQUFBLE1BQU0sRUFBRUYsc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVQyxNQUE1QjtBQUhTLEM7aUNBRGZMLGdCLGtCQU9rQjtBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJLLEVBQUFBLG1CQUFtQixFQUFFLG9CQUZEO0FBR3BCQyxFQUFBQSxVQUFVLEVBQUU7QUFIUSxDO2VBdUNUVCxnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL2Jhc2UnO1xuXG5jbGFzcyBDbHVzdGVyTGF5ZXJJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY29sb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2NsdXN0ZXItbGF5ZXItaWNvbicsXG4gICAgdG90YWxDb2xvcjogNVxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMTMuNiwyMi43YzIuOS0zLjYsNC40LTYuMyw0LjQtOGMwLTIuNy0yLjItNC45LTQuOS00LjlTOC4yLDEyLDguMiwxNC43YzAsMS43LDEuNSw0LjQsNC40LDhsMCwwXG5cdEMxMi44LDIzLDEzLjIsMjMsMTMuNiwyMi43QzEzLjUsMjIuOCwxMy42LDIyLjcsMTMuNiwyMi43elwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IxXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTIyLjksNTcuNGMyLjUtMy4xLDMuOC01LjUsMy44LTdjMC0yLjQtMi00LjQtNC40LTQuNFMxOCw0OCwxOCw1MC40YzAsMS41LDEuMywzLjgsMy44LDdsMCwwXG5cdGMwLjMsMC4zLDAuNywwLjQsMSwwLjFDMjIuOSw1Ny40LDIyLjksNTcuNCwyMi45LDU3LjR6XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJjcjJcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNNTEuNCwyMi41YzIuOC0zLjQsNC4yLTYsNC4yLTcuNmMwLTIuNi0yLjEtNC44LTQuOC00LjhjLTIuNiwwLTQuOCwyLjEtNC44LDQuOGMwLDEuNiwxLjQsNC4yLDQuMiw3LjZcblx0bDAsMGMwLjMsMC4zLDAuOCwwLjQsMS4xLDAuMUM1MS4zLDIyLjUsNTEuNCwyMi41LDUxLjQsMjIuNXpcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyM1wiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk00OS4yLDUzLjhjMy43LTQuNSw1LjUtNy44LDUuNS05LjljMC0zLjMtMi43LTYuMS02LjEtNi4xYy0zLjMsMC02LjEsMi43LTYuMSw2LjFcblx0YzAsMi4xLDEuOCw1LjQsNS41LDkuOWwwLDBjMC4zLDAuMywwLjcsMC40LDEuMSwwLjFDNDkuMSw1My44LDQ5LjEsNTMuOCw0OS4yLDUzLjh6XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJjcjRcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMzEuNCwzOS42QzM2LjUsMzMuNSwzOSwyOSwzOSwyNi4xYzAtNC40LTMuNi04LTgtOHMtOCwzLjYtOCw4YzAsMi45LDIuNSw3LjQsNy42LDEzLjVsMCwwXG5cdEMzMC44LDM5LjgsMzEuMSwzOS45LDMxLjQsMzkuNkMzMS4zLDM5LjcsMzEuNCwzOS42LDMxLjQsMzkuNnpcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyNVwiXG4gICAgICAgIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbHVzdGVyTGF5ZXJJY29uO1xuIl19