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

var GridLayerIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(GridLayerIcon, _Component);

  var _super = _createSuper(GridLayerIcon);

  function GridLayerIcon() {
    (0, _classCallCheck2["default"])(this, GridLayerIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(GridLayerIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("rect", {
        x: "11.2",
        y: "11.2",
        className: "cr1",
        width: "13.1",
        height: "13.1",
        style: {
          opacity: 0.8
        }
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "25.4",
        y: "11.2",
        className: "cr2",
        width: "13.1",
        height: "13.1",
        style: {
          opacity: 0.8
        }
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "39.6",
        y: "11.2",
        width: "13.1",
        height: "13.1",
        className: "cr3"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "11.2",
        y: "25.4",
        className: "cr4",
        width: "13.1",
        height: "13.1",
        style: {
          opacity: 0.4
        }
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "25.4",
        y: "25.4",
        className: "cr5",
        width: "13.1",
        height: "13.1"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "39.6",
        y: "25.4",
        className: "cr6",
        width: "13.1",
        height: "13.1",
        style: {
          opacity: 0.8
        }
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "11.2",
        y: "39.6",
        width: "13.1",
        className: "cr1",
        height: "13.1"
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "25.4",
        y: "39.6",
        className: "cr2",
        width: "13.1",
        height: "13.1",
        style: {
          opacity: 0.4
        }
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        x: "39.6",
        y: "39.6",
        className: "cr3",
        width: "13.1",
        height: "13.1",
        style: {
          opacity: 0.4
        }
      }));
    }
  }]);
  return GridLayerIcon;
}(_react.Component);

exports["default"] = GridLayerIcon;
(0, _defineProperty2["default"])(GridLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(GridLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'grid-layer-icon',
  totalColor: 6
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvZ3JpZC1sYXllci9ncmlkLWxheWVyLWljb24uanMiXSwibmFtZXMiOlsiR3JpZExheWVySWNvbiIsInByb3BzIiwib3BhY2l0eSIsIkNvbXBvbmVudCIsImhlaWdodCIsIlByb3BUeXBlcyIsInN0cmluZyIsImNvbG9ycyIsImFycmF5T2YiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwidG90YWxDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsYTs7Ozs7Ozs7Ozs7O1dBYW5CLGtCQUFTO0FBQ1AsMEJBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLGVBQ0U7QUFBTSxRQUFBLENBQUMsRUFBQyxNQUFSO0FBQWUsUUFBQSxDQUFDLEVBQUMsTUFBakI7QUFBd0IsUUFBQSxTQUFTLEVBQUMsS0FBbEM7QUFBd0MsUUFBQSxLQUFLLEVBQUMsTUFBOUM7QUFBcUQsUUFBQSxNQUFNLEVBQUMsTUFBNUQ7QUFBbUUsUUFBQSxLQUFLLEVBQUU7QUFBQ0MsVUFBQUEsT0FBTyxFQUFFO0FBQVY7QUFBMUUsUUFERixlQUVFO0FBQU0sUUFBQSxDQUFDLEVBQUMsTUFBUjtBQUFlLFFBQUEsQ0FBQyxFQUFDLE1BQWpCO0FBQXdCLFFBQUEsU0FBUyxFQUFDLEtBQWxDO0FBQXdDLFFBQUEsS0FBSyxFQUFDLE1BQTlDO0FBQXFELFFBQUEsTUFBTSxFQUFDLE1BQTVEO0FBQW1FLFFBQUEsS0FBSyxFQUFFO0FBQUNBLFVBQUFBLE9BQU8sRUFBRTtBQUFWO0FBQTFFLFFBRkYsZUFHRTtBQUFNLFFBQUEsQ0FBQyxFQUFDLE1BQVI7QUFBZSxRQUFBLENBQUMsRUFBQyxNQUFqQjtBQUF3QixRQUFBLEtBQUssRUFBQyxNQUE5QjtBQUFxQyxRQUFBLE1BQU0sRUFBQyxNQUE1QztBQUFtRCxRQUFBLFNBQVMsRUFBQztBQUE3RCxRQUhGLGVBSUU7QUFBTSxRQUFBLENBQUMsRUFBQyxNQUFSO0FBQWUsUUFBQSxDQUFDLEVBQUMsTUFBakI7QUFBd0IsUUFBQSxTQUFTLEVBQUMsS0FBbEM7QUFBd0MsUUFBQSxLQUFLLEVBQUMsTUFBOUM7QUFBcUQsUUFBQSxNQUFNLEVBQUMsTUFBNUQ7QUFBbUUsUUFBQSxLQUFLLEVBQUU7QUFBQ0EsVUFBQUEsT0FBTyxFQUFFO0FBQVY7QUFBMUUsUUFKRixlQUtFO0FBQU0sUUFBQSxDQUFDLEVBQUMsTUFBUjtBQUFlLFFBQUEsQ0FBQyxFQUFDLE1BQWpCO0FBQXdCLFFBQUEsU0FBUyxFQUFDLEtBQWxDO0FBQXdDLFFBQUEsS0FBSyxFQUFDLE1BQTlDO0FBQXFELFFBQUEsTUFBTSxFQUFDO0FBQTVELFFBTEYsZUFNRTtBQUFNLFFBQUEsQ0FBQyxFQUFDLE1BQVI7QUFBZSxRQUFBLENBQUMsRUFBQyxNQUFqQjtBQUF3QixRQUFBLFNBQVMsRUFBQyxLQUFsQztBQUF3QyxRQUFBLEtBQUssRUFBQyxNQUE5QztBQUFxRCxRQUFBLE1BQU0sRUFBQyxNQUE1RDtBQUFtRSxRQUFBLEtBQUssRUFBRTtBQUFDQSxVQUFBQSxPQUFPLEVBQUU7QUFBVjtBQUExRSxRQU5GLGVBT0U7QUFBTSxRQUFBLENBQUMsRUFBQyxNQUFSO0FBQWUsUUFBQSxDQUFDLEVBQUMsTUFBakI7QUFBd0IsUUFBQSxLQUFLLEVBQUMsTUFBOUI7QUFBcUMsUUFBQSxTQUFTLEVBQUMsS0FBL0M7QUFBcUQsUUFBQSxNQUFNLEVBQUM7QUFBNUQsUUFQRixlQVFFO0FBQU0sUUFBQSxDQUFDLEVBQUMsTUFBUjtBQUFlLFFBQUEsQ0FBQyxFQUFDLE1BQWpCO0FBQXdCLFFBQUEsU0FBUyxFQUFDLEtBQWxDO0FBQXdDLFFBQUEsS0FBSyxFQUFDLE1BQTlDO0FBQXFELFFBQUEsTUFBTSxFQUFDLE1BQTVEO0FBQW1FLFFBQUEsS0FBSyxFQUFFO0FBQUNBLFVBQUFBLE9BQU8sRUFBRTtBQUFWO0FBQTFFLFFBUkYsZUFTRTtBQUFNLFFBQUEsQ0FBQyxFQUFDLE1BQVI7QUFBZSxRQUFBLENBQUMsRUFBQyxNQUFqQjtBQUF3QixRQUFBLFNBQVMsRUFBQyxLQUFsQztBQUF3QyxRQUFBLEtBQUssRUFBQyxNQUE5QztBQUFxRCxRQUFBLE1BQU0sRUFBQyxNQUE1RDtBQUFtRSxRQUFBLEtBQUssRUFBRTtBQUFDQSxVQUFBQSxPQUFPLEVBQUU7QUFBVjtBQUExRSxRQVRGLENBREY7QUFhRDs7O0VBM0J3Q0MsZ0I7OztpQ0FBdEJILGEsZUFDQTtBQUNqQjtBQUNBSSxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQyxNQUZEO0FBR2pCQyxFQUFBQSxNQUFNLEVBQUVGLHNCQUFVRyxPQUFWLENBQWtCSCxzQkFBVUMsTUFBNUI7QUFIUyxDO2lDQURBTixhLGtCQU9HO0FBQ3BCSSxFQUFBQSxNQUFNLEVBQUUsTUFEWTtBQUVwQkssRUFBQUEsbUJBQW1CLEVBQUUsaUJBRkQ7QUFHcEJDLEVBQUFBLFVBQVUsRUFBRTtBQUhRLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZExheWVySWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNvbG9yczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZylcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdncmlkLWxheWVyLWljb24nLFxuICAgIHRvdGFsQ29sb3I6IDZcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHJlY3QgeD1cIjExLjJcIiB5PVwiMTEuMlwiIGNsYXNzTmFtZT1cImNyMVwiIHdpZHRoPVwiMTMuMVwiIGhlaWdodD1cIjEzLjFcIiBzdHlsZT17e29wYWNpdHk6IDAuOH19IC8+XG4gICAgICAgIDxyZWN0IHg9XCIyNS40XCIgeT1cIjExLjJcIiBjbGFzc05hbWU9XCJjcjJcIiB3aWR0aD1cIjEzLjFcIiBoZWlnaHQ9XCIxMy4xXCIgc3R5bGU9e3tvcGFjaXR5OiAwLjh9fSAvPlxuICAgICAgICA8cmVjdCB4PVwiMzkuNlwiIHk9XCIxMS4yXCIgd2lkdGg9XCIxMy4xXCIgaGVpZ2h0PVwiMTMuMVwiIGNsYXNzTmFtZT1cImNyM1wiIC8+XG4gICAgICAgIDxyZWN0IHg9XCIxMS4yXCIgeT1cIjI1LjRcIiBjbGFzc05hbWU9XCJjcjRcIiB3aWR0aD1cIjEzLjFcIiBoZWlnaHQ9XCIxMy4xXCIgc3R5bGU9e3tvcGFjaXR5OiAwLjR9fSAvPlxuICAgICAgICA8cmVjdCB4PVwiMjUuNFwiIHk9XCIyNS40XCIgY2xhc3NOYW1lPVwiY3I1XCIgd2lkdGg9XCIxMy4xXCIgaGVpZ2h0PVwiMTMuMVwiIC8+XG4gICAgICAgIDxyZWN0IHg9XCIzOS42XCIgeT1cIjI1LjRcIiBjbGFzc05hbWU9XCJjcjZcIiB3aWR0aD1cIjEzLjFcIiBoZWlnaHQ9XCIxMy4xXCIgc3R5bGU9e3tvcGFjaXR5OiAwLjh9fSAvPlxuICAgICAgICA8cmVjdCB4PVwiMTEuMlwiIHk9XCIzOS42XCIgd2lkdGg9XCIxMy4xXCIgY2xhc3NOYW1lPVwiY3IxXCIgaGVpZ2h0PVwiMTMuMVwiIC8+XG4gICAgICAgIDxyZWN0IHg9XCIyNS40XCIgeT1cIjM5LjZcIiBjbGFzc05hbWU9XCJjcjJcIiB3aWR0aD1cIjEzLjFcIiBoZWlnaHQ9XCIxMy4xXCIgc3R5bGU9e3tvcGFjaXR5OiAwLjR9fSAvPlxuICAgICAgICA8cmVjdCB4PVwiMzkuNlwiIHk9XCIzOS42XCIgY2xhc3NOYW1lPVwiY3IzXCIgd2lkdGg9XCIxMy4xXCIgaGVpZ2h0PVwiMTMuMVwiIHN0eWxlPXt7b3BhY2l0eTogMC40fX0gLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG4iXX0=