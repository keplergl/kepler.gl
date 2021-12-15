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

var HeatmapLayerIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(HeatmapLayerIcon, _Component);

  var _super = _createSuper(HeatmapLayerIcon);

  function HeatmapLayerIcon() {
    (0, _classCallCheck2["default"])(this, HeatmapLayerIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(HeatmapLayerIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M51.87,21C49.55,16.67,43.77,15.29,39,18a11.42,11.42,0,0,0-1.65,1.13c-2.73,2.14-2.12,3-6,4.89-2.27,1.07-3.42,1.08-6.88,1.4l-2.24.21a14,14,0,0,0-2.86.84c-6.64,2.73-10.11,9.86-7.76,15.94s9.63,8.79,16.27,6.07A14,14,0,0,0,31.77,46l0,0,.06-.07c.43-.4.8-.78,1.14-1.14a2.66,2.66,0,0,0,.32-.36l.17-.19c3-3.53,2-5,4.9-7.39,2.38-1.93,5.41-.95,9-3C52.19,31.15,54.19,25.43,51.87,21ZM26,44.59a8.7,8.7,0,0,1-2.26.59A7.16,7.16,0,0,1,16,40.85c-1.44-3.72.68-8.08,4.73-9.74A8.33,8.33,0,0,1,23,30.53a7.15,7.15,0,0,1,7.71,4.32C32.19,38.57,30.06,42.93,26,44.59Z",
        className: "cr2",
        style: {
          opacity: 0.8
        }
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M57,18.18A14.56,14.56,0,0,0,42.25,10.7a16.62,16.62,0,0,0-6.12,2,17.35,17.35,0,0,0-2.39,1.65,20.15,20.15,0,0,0-2.83,2.73,4.52,4.52,0,0,1-2,1.45,5.88,5.88,0,0,1-2.26.63l-1.45.14-1.27.12-2.33.22-.2,0-.18,0a18.88,18.88,0,0,0-4,1.18c-9.6,3.93-14.51,14.57-11,23.71A17.59,17.59,0,0,0,24.81,55.4,20.19,20.19,0,0,0,30,54.05a20,20,0,0,0,5.26-3.19l.82-.71.05-.08,1-1c.21-.22.41-.45.59-.66l.13-.15a20,20,0,0,0,3.39-5.48c.36-.87.36-.87.68-1.14a9.09,9.09,0,0,1,1.56-.32,18.79,18.79,0,0,0,6.69-2.19,16.56,16.56,0,0,0,7.88-9.9A14.93,14.93,0,0,0,57,18.18ZM47.63,34.27a13.93,13.93,0,0,1-5.06,1.61,7.75,7.75,0,0,0-3.86,1.36,7.06,7.06,0,0,0-2.33,3.24,14.17,14.17,0,0,1-2.51,4.09l-.1.11a5.11,5.11,0,0,1-.43.47c-.31.35-.7.73-1.14,1.14l-.09.09-.12.09a14.4,14.4,0,0,1-4,2.44,14.73,14.73,0,0,1-3.84,1c-5.87.69-11.13-2.27-13.08-7.35-2.45-6.32,1.16-13.76,8-16.59a15,15,0,0,1,3-.87l2.29-.22.9-.07,2-.2a10.88,10.88,0,0,0,3.85-1.08,9.43,9.43,0,0,0,3.77-2.76A14.75,14.75,0,0,1,37,18.71a11.5,11.5,0,0,1,1.71-1.17,11.08,11.08,0,0,1,4.16-1.36,9.26,9.26,0,0,1,9.42,4.64C54.75,25.42,52.65,31.47,47.63,34.27Z",
        className: "cr1",
        style: {
          opacity: 0.36
        }
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M33,44.79a9.53,9.53,0,0,1-1.13,1.14C32.3,45.53,32.67,45.15,33,44.79Z",
        className: "cr1",
        style: {
          opacity: 0.36
        }
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M25.83,44.13c-3.82,1.55-8,0-9.33-3.46s.65-7.55,4.45-9.1,8,0,9.33,3.46S29.63,42.57,25.83,44.13Z",
        className: "cr3"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M31.81,46a.09.09,0,0,1,0,0h0Z",
        className: "cr3"
      }));
    }
  }]);
  return HeatmapLayerIcon;
}(_react.Component);

exports["default"] = HeatmapLayerIcon;
(0, _defineProperty2["default"])(HeatmapLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(HeatmapLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'heatmap-layer-icon',
  totalColor: 3
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaGVhdG1hcC1sYXllci9oZWF0bWFwLWxheWVyLWljb24uanMiXSwibmFtZXMiOlsiSGVhdG1hcExheWVySWNvbiIsInByb3BzIiwib3BhY2l0eSIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsImNvbG9ycyIsImFycmF5T2YiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwidG90YWxDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsZ0I7Ozs7Ozs7Ozs7OztXQWFuQixrQkFBUztBQUNQLDBCQUNFLGdDQUFDLGdCQUFELEVBQVUsS0FBS0MsS0FBZixlQUNFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsNmhCQURKO0FBRUUsUUFBQSxTQUFTLEVBQUMsS0FGWjtBQUdFLFFBQUEsS0FBSyxFQUFFO0FBQUNDLFVBQUFBLE9BQU8sRUFBRTtBQUFWO0FBSFQsUUFERixlQU1FO0FBQ0UsUUFBQSxDQUFDLEVBQUMsaWpDQURKO0FBRUUsUUFBQSxTQUFTLEVBQUMsS0FGWjtBQUdFLFFBQUEsS0FBSyxFQUFFO0FBQUNBLFVBQUFBLE9BQU8sRUFBRTtBQUFWO0FBSFQsUUFORixlQVdFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsc0VBREo7QUFFRSxRQUFBLFNBQVMsRUFBQyxLQUZaO0FBR0UsUUFBQSxLQUFLLEVBQUU7QUFBQ0EsVUFBQUEsT0FBTyxFQUFFO0FBQVY7QUFIVCxRQVhGLGVBZ0JFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsZ0dBREo7QUFFRSxRQUFBLFNBQVMsRUFBQztBQUZaLFFBaEJGLGVBb0JFO0FBQU0sUUFBQSxDQUFDLEVBQUMsK0JBQVI7QUFBd0MsUUFBQSxTQUFTLEVBQUM7QUFBbEQsUUFwQkYsQ0FERjtBQXdCRDs7O0VBdEMyQ0MsZ0I7OztpQ0FBekJILGdCLGVBQ0E7QUFDakI7QUFDQUksRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUMsTUFGRDtBQUdqQkMsRUFBQUEsTUFBTSxFQUFFRixzQkFBVUcsT0FBVixDQUFrQkgsc0JBQVVDLE1BQTVCO0FBSFMsQztpQ0FEQU4sZ0Isa0JBT0c7QUFDcEJJLEVBQUFBLE1BQU0sRUFBRSxNQURZO0FBRXBCSyxFQUFBQSxtQkFBbUIsRUFBRSxvQkFGRDtBQUdwQkMsRUFBQUEsVUFBVSxFQUFFO0FBSFEsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWF0bWFwTGF5ZXJJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY29sb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2hlYXRtYXAtbGF5ZXItaWNvbicsXG4gICAgdG90YWxDb2xvcjogM1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNNTEuODcsMjFDNDkuNTUsMTYuNjcsNDMuNzcsMTUuMjksMzksMThhMTEuNDIsMTEuNDIsMCwwLDAtMS42NSwxLjEzYy0yLjczLDIuMTQtMi4xMiwzLTYsNC44OS0yLjI3LDEuMDctMy40MiwxLjA4LTYuODgsMS40bC0yLjI0LjIxYTE0LDE0LDAsMCwwLTIuODYuODRjLTYuNjQsMi43My0xMC4xMSw5Ljg2LTcuNzYsMTUuOTRzOS42Myw4Ljc5LDE2LjI3LDYuMDdBMTQsMTQsMCwwLDAsMzEuNzcsNDZsMCwwLC4wNi0uMDdjLjQzLS40LjgtLjc4LDEuMTQtMS4xNGEyLjY2LDIuNjYsMCwwLDAsLjMyLS4zNmwuMTctLjE5YzMtMy41MywyLTUsNC45LTcuMzksMi4zOC0xLjkzLDUuNDEtLjk1LDktM0M1Mi4xOSwzMS4xNSw1NC4xOSwyNS40Myw1MS44NywyMVpNMjYsNDQuNTlhOC43LDguNywwLDAsMS0yLjI2LjU5QTcuMTYsNy4xNiwwLDAsMSwxNiw0MC44NWMtMS40NC0zLjcyLjY4LTguMDgsNC43My05Ljc0QTguMzMsOC4zMywwLDAsMSwyMywzMC41M2E3LjE1LDcuMTUsMCwwLDEsNy43MSw0LjMyQzMyLjE5LDM4LjU3LDMwLjA2LDQyLjkzLDI2LDQ0LjU5WlwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IyXCJcbiAgICAgICAgICBzdHlsZT17e29wYWNpdHk6IDAuOH19XG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk01NywxOC4xOEExNC41NiwxNC41NiwwLDAsMCw0Mi4yNSwxMC43YTE2LjYyLDE2LjYyLDAsMCwwLTYuMTIsMiwxNy4zNSwxNy4zNSwwLDAsMC0yLjM5LDEuNjUsMjAuMTUsMjAuMTUsMCwwLDAtMi44MywyLjczLDQuNTIsNC41MiwwLDAsMS0yLDEuNDUsNS44OCw1Ljg4LDAsMCwxLTIuMjYuNjNsLTEuNDUuMTQtMS4yNy4xMi0yLjMzLjIyLS4yLDAtLjE4LDBhMTguODgsMTguODgsMCwwLDAtNCwxLjE4Yy05LjYsMy45My0xNC41MSwxNC41Ny0xMSwyMy43MUExNy41OSwxNy41OSwwLDAsMCwyNC44MSw1NS40LDIwLjE5LDIwLjE5LDAsMCwwLDMwLDU0LjA1YTIwLDIwLDAsMCwwLDUuMjYtMy4xOWwuODItLjcxLjA1LS4wOCwxLTFjLjIxLS4yMi40MS0uNDUuNTktLjY2bC4xMy0uMTVhMjAsMjAsMCwwLDAsMy4zOS01LjQ4Yy4zNi0uODcuMzYtLjg3LjY4LTEuMTRhOS4wOSw5LjA5LDAsMCwxLDEuNTYtLjMyLDE4Ljc5LDE4Ljc5LDAsMCwwLDYuNjktMi4xOSwxNi41NiwxNi41NiwwLDAsMCw3Ljg4LTkuOUExNC45MywxNC45MywwLDAsMCw1NywxOC4xOFpNNDcuNjMsMzQuMjdhMTMuOTMsMTMuOTMsMCwwLDEtNS4wNiwxLjYxLDcuNzUsNy43NSwwLDAsMC0zLjg2LDEuMzYsNy4wNiw3LjA2LDAsMCwwLTIuMzMsMy4yNCwxNC4xNywxNC4xNywwLDAsMS0yLjUxLDQuMDlsLS4xLjExYTUuMTEsNS4xMSwwLDAsMS0uNDMuNDdjLS4zMS4zNS0uNy43My0xLjE0LDEuMTRsLS4wOS4wOS0uMTIuMDlhMTQuNCwxNC40LDAsMCwxLTQsMi40NCwxNC43MywxNC43MywwLDAsMS0zLjg0LDFjLTUuODcuNjktMTEuMTMtMi4yNy0xMy4wOC03LjM1LTIuNDUtNi4zMiwxLjE2LTEzLjc2LDgtMTYuNTlhMTUsMTUsMCwwLDEsMy0uODdsMi4yOS0uMjIuOS0uMDcsMi0uMmExMC44OCwxMC44OCwwLDAsMCwzLjg1LTEuMDgsOS40Myw5LjQzLDAsMCwwLDMuNzctMi43NkExNC43NSwxNC43NSwwLDAsMSwzNywxOC43MWExMS41LDExLjUsMCwwLDEsMS43MS0xLjE3LDExLjA4LDExLjA4LDAsMCwxLDQuMTYtMS4zNiw5LjI2LDkuMjYsMCwwLDEsOS40Miw0LjY0QzU0Ljc1LDI1LjQyLDUyLjY1LDMxLjQ3LDQ3LjYzLDM0LjI3WlwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IxXCJcbiAgICAgICAgICBzdHlsZT17e29wYWNpdHk6IDAuMzZ9fVxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMzMsNDQuNzlhOS41Myw5LjUzLDAsMCwxLTEuMTMsMS4xNEMzMi4zLDQ1LjUzLDMyLjY3LDQ1LjE1LDMzLDQ0Ljc5WlwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IxXCJcbiAgICAgICAgICBzdHlsZT17e29wYWNpdHk6IDAuMzZ9fVxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMjUuODMsNDQuMTNjLTMuODIsMS41NS04LDAtOS4zMy0zLjQ2cy42NS03LjU1LDQuNDUtOS4xLDgsMCw5LjMzLDMuNDZTMjkuNjMsNDIuNTcsMjUuODMsNDQuMTNaXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJjcjNcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aCBkPVwiTTMxLjgxLDQ2YS4wOS4wOSwwLDAsMSwwLDBoMFpcIiBjbGFzc05hbWU9XCJjcjNcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==