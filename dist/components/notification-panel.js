"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = NotificationPanelFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _notificationItem = _interopRequireDefault(require("./notification-panel/notification-item"));

var _defaultSettings = require("../constants/default-settings");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background: transparent;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  padding: 4px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  position: absolute;\n  top: 1em;\n  right: 1em;\n  z-index: 10000;\n  box-sizing: border-box;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var NotificationPanelContent = _styledComponents["default"].div(_templateObject());

NotificationPanelFactory.deps = [_notificationItem["default"]];

function NotificationPanelFactory(NotificationItem) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(NotificationPanel, _Component);

    function NotificationPanel() {
      (0, _classCallCheck2["default"])(this, NotificationPanel);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NotificationPanel).apply(this, arguments));
    }

    (0, _createClass2["default"])(NotificationPanel, [{
      key: "render",
      value: function render() {
        var _this = this;

        var globalNotifications = this.props.notifications.filter(function (n) {
          return n.topic === _defaultSettings.DEFAULT_NOTIFICATION_TOPICS.global;
        });
        return _react["default"].createElement(NotificationPanelContent, {
          className: "notification-panel",
          style: {
            display: globalNotifications.length ? 'block' : 'none'
          }
        }, globalNotifications.map(function (n) {
          return _react["default"].createElement(NotificationItem, {
            key: n.id,
            notification: n,
            removeNotification: _this.props.removeNotification
          });
        }));
      }
    }]);
    return NotificationPanel;
  }(_react.Component), (0, _defineProperty2["default"])(_class, "propTypes", {
    removeNotification: _propTypes["default"].func.isRequired,
    notifications: _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired
  }), _temp;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi1wYW5lbC5qcyJdLCJuYW1lcyI6WyJOb3RpZmljYXRpb25QYW5lbENvbnRlbnQiLCJzdHlsZWQiLCJkaXYiLCJOb3RpZmljYXRpb25QYW5lbEZhY3RvcnkiLCJkZXBzIiwiTm90aWZpY2F0aW9uSXRlbUZhY3RvcnkiLCJOb3RpZmljYXRpb25JdGVtIiwiZ2xvYmFsTm90aWZpY2F0aW9ucyIsInByb3BzIiwibm90aWZpY2F0aW9ucyIsImZpbHRlciIsIm4iLCJ0b3BpYyIsIkRFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUyIsImdsb2JhbCIsImRpc3BsYXkiLCJsZW5ndGgiLCJtYXAiLCJpZCIsInJlbW92ZU5vdGlmaWNhdGlvbiIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsd0JBQXdCLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUE5Qjs7QUFlQUMsd0JBQXdCLENBQUNDLElBQXpCLEdBQWdDLENBQUNDLDRCQUFELENBQWhDOztBQUVlLFNBQVNGLHdCQUFULENBQWtDRyxnQkFBbEMsRUFBb0Q7QUFBQTs7QUFDakU7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLCtCQU1XO0FBQUE7O0FBQ1AsWUFBTUMsbUJBQW1CLEdBQUcsS0FBS0MsS0FBTCxDQUFXQyxhQUFYLENBQXlCQyxNQUF6QixDQUMxQixVQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ0MsS0FBRixLQUFZQyw2Q0FBNEJDLE1BQTVDO0FBQUEsU0FEeUIsQ0FBNUI7QUFHQSxlQUNFLGdDQUFDLHdCQUFEO0FBQ0UsVUFBQSxTQUFTLEVBQUMsb0JBRFo7QUFFRSxVQUFBLEtBQUssRUFBRTtBQUFDQyxZQUFBQSxPQUFPLEVBQUVSLG1CQUFtQixDQUFDUyxNQUFwQixHQUE2QixPQUE3QixHQUF1QztBQUFqRDtBQUZULFdBSUdULG1CQUFtQixDQUFDVSxHQUFwQixDQUF3QixVQUFBTixDQUFDO0FBQUEsaUJBQ3hCLGdDQUFDLGdCQUFEO0FBQ0UsWUFBQSxHQUFHLEVBQUVBLENBQUMsQ0FBQ08sRUFEVDtBQUVFLFlBQUEsWUFBWSxFQUFFUCxDQUZoQjtBQUdFLFlBQUEsa0JBQWtCLEVBQUUsS0FBSSxDQUFDSCxLQUFMLENBQVdXO0FBSGpDLFlBRHdCO0FBQUEsU0FBekIsQ0FKSCxDQURGO0FBY0Q7QUF4Qkg7QUFBQTtBQUFBLElBQXVDQyxnQkFBdkMseURBQ3FCO0FBQ2pCRCxJQUFBQSxrQkFBa0IsRUFBRUUsc0JBQVVDLElBQVYsQ0FBZUMsVUFEbEI7QUFFakJkLElBQUFBLGFBQWEsRUFBRVksc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVSSxNQUE1QixFQUFvQ0Y7QUFGbEMsR0FEckI7QUEwQkQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IE5vdGlmaWNhdGlvbkl0ZW1GYWN0b3J5IGZyb20gJy4vbm90aWZpY2F0aW9uLXBhbmVsL25vdGlmaWNhdGlvbi1pdGVtJztcbmltcG9ydCB7REVGQVVMVF9OT1RJRklDQVRJT05fVE9QSUNTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IE5vdGlmaWNhdGlvblBhbmVsQ29udGVudCA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gIHBhZGRpbmc6IDRweDtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMWVtO1xuICByaWdodDogMWVtO1xuICB6LWluZGV4OiAxMDAwMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbmA7XG5cbk5vdGlmaWNhdGlvblBhbmVsRmFjdG9yeS5kZXBzID0gW05vdGlmaWNhdGlvbkl0ZW1GYWN0b3J5XTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTm90aWZpY2F0aW9uUGFuZWxGYWN0b3J5KE5vdGlmaWNhdGlvbkl0ZW0pIHtcbiAgcmV0dXJuIGNsYXNzIE5vdGlmaWNhdGlvblBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgcmVtb3ZlTm90aWZpY2F0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbm90aWZpY2F0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZFxuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCBnbG9iYWxOb3RpZmljYXRpb25zID0gdGhpcy5wcm9wcy5ub3RpZmljYXRpb25zLmZpbHRlcihcbiAgICAgICAgbiA9PiBuLnRvcGljID09PSBERUZBVUxUX05PVElGSUNBVElPTl9UT1BJQ1MuZ2xvYmFsXG4gICAgICApO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPE5vdGlmaWNhdGlvblBhbmVsQ29udGVudFxuICAgICAgICAgIGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1wYW5lbFwiXG4gICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiBnbG9iYWxOb3RpZmljYXRpb25zLmxlbmd0aCA/ICdibG9jaycgOiAnbm9uZSd9fVxuICAgICAgICA+XG4gICAgICAgICAge2dsb2JhbE5vdGlmaWNhdGlvbnMubWFwKG4gPT4gKFxuICAgICAgICAgICAgPE5vdGlmaWNhdGlvbkl0ZW1cbiAgICAgICAgICAgICAga2V5PXtuLmlkfVxuICAgICAgICAgICAgICBub3RpZmljYXRpb249e259XG4gICAgICAgICAgICAgIHJlbW92ZU5vdGlmaWNhdGlvbj17dGhpcy5wcm9wcy5yZW1vdmVOb3RpZmljYXRpb259XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L05vdGlmaWNhdGlvblBhbmVsQ29udGVudD5cbiAgICAgICk7XG4gICAgfVxuICB9O1xufVxuIl19