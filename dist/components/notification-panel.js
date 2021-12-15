"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = NotificationPanelFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _notificationItem = _interopRequireDefault(require("./notification-panel/notification-item"));

var _defaultSettings = require("../constants/default-settings");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var NotificationPanelContent = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  background: transparent;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  padding: 4px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  position: absolute;\n  top: 1em;\n  right: 1em;\n  z-index: 10000;\n  box-sizing: border-box;\n"])));

NotificationPanelFactory.deps = [_notificationItem["default"]];

function NotificationPanelFactory(NotificationItem) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(NotificationPanel, _Component);

    var _super = _createSuper(NotificationPanel);

    function NotificationPanel() {
      (0, _classCallCheck2["default"])(this, NotificationPanel);
      return _super.apply(this, arguments);
    }

    (0, _createClass2["default"])(NotificationPanel, [{
      key: "render",
      value: function render() {
        var _this = this;

        var globalNotifications = this.props.notifications.filter(function (n) {
          return n.topic === _defaultSettings.DEFAULT_NOTIFICATION_TOPICS.global;
        });
        return /*#__PURE__*/_react["default"].createElement(NotificationPanelContent, {
          className: "notification-panel",
          style: {
            display: globalNotifications.length ? 'block' : 'none'
          }
        }, globalNotifications.map(function (n) {
          return /*#__PURE__*/_react["default"].createElement(NotificationItem, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi1wYW5lbC5qcyJdLCJuYW1lcyI6WyJOb3RpZmljYXRpb25QYW5lbENvbnRlbnQiLCJzdHlsZWQiLCJkaXYiLCJOb3RpZmljYXRpb25QYW5lbEZhY3RvcnkiLCJkZXBzIiwiTm90aWZpY2F0aW9uSXRlbUZhY3RvcnkiLCJOb3RpZmljYXRpb25JdGVtIiwiZ2xvYmFsTm90aWZpY2F0aW9ucyIsInByb3BzIiwibm90aWZpY2F0aW9ucyIsImZpbHRlciIsIm4iLCJ0b3BpYyIsIkRFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDUyIsImdsb2JhbCIsImRpc3BsYXkiLCJsZW5ndGgiLCJtYXAiLCJpZCIsInJlbW92ZU5vdGlmaWNhdGlvbiIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSx3QkFBd0IsR0FBR0MsNkJBQU9DLEdBQVYseVZBQTlCOztBQWVBQyx3QkFBd0IsQ0FBQ0MsSUFBekIsR0FBZ0MsQ0FBQ0MsNEJBQUQsQ0FBaEM7O0FBRWUsU0FBU0Ysd0JBQVQsQ0FBa0NHLGdCQUFsQyxFQUFvRDtBQUFBOztBQUNqRTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxhQU1FLGtCQUFTO0FBQUE7O0FBQ1AsWUFBTUMsbUJBQW1CLEdBQUcsS0FBS0MsS0FBTCxDQUFXQyxhQUFYLENBQXlCQyxNQUF6QixDQUMxQixVQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ0MsS0FBRixLQUFZQyw2Q0FBNEJDLE1BQTVDO0FBQUEsU0FEeUIsQ0FBNUI7QUFHQSw0QkFDRSxnQ0FBQyx3QkFBRDtBQUNFLFVBQUEsU0FBUyxFQUFDLG9CQURaO0FBRUUsVUFBQSxLQUFLLEVBQUU7QUFBQ0MsWUFBQUEsT0FBTyxFQUFFUixtQkFBbUIsQ0FBQ1MsTUFBcEIsR0FBNkIsT0FBN0IsR0FBdUM7QUFBakQ7QUFGVCxXQUlHVCxtQkFBbUIsQ0FBQ1UsR0FBcEIsQ0FBd0IsVUFBQU4sQ0FBQztBQUFBLDhCQUN4QixnQ0FBQyxnQkFBRDtBQUNFLFlBQUEsR0FBRyxFQUFFQSxDQUFDLENBQUNPLEVBRFQ7QUFFRSxZQUFBLFlBQVksRUFBRVAsQ0FGaEI7QUFHRSxZQUFBLGtCQUFrQixFQUFFLEtBQUksQ0FBQ0gsS0FBTCxDQUFXVztBQUhqQyxZQUR3QjtBQUFBLFNBQXpCLENBSkgsQ0FERjtBQWNEO0FBeEJIO0FBQUE7QUFBQSxJQUF1Q0MsZ0JBQXZDLHlEQUNxQjtBQUNqQkQsSUFBQUEsa0JBQWtCLEVBQUVFLHNCQUFVQyxJQUFWLENBQWVDLFVBRGxCO0FBRWpCZCxJQUFBQSxhQUFhLEVBQUVZLHNCQUFVRyxPQUFWLENBQWtCSCxzQkFBVUksTUFBNUIsRUFBb0NGO0FBRmxDLEdBRHJCO0FBMEJEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBOb3RpZmljYXRpb25JdGVtRmFjdG9yeSBmcm9tICcuL25vdGlmaWNhdGlvbi1wYW5lbC9ub3RpZmljYXRpb24taXRlbSc7XG5pbXBvcnQge0RFRkFVTFRfTk9USUZJQ0FUSU9OX1RPUElDU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBOb3RpZmljYXRpb25QYW5lbENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICBwYWRkaW5nOiA0cHg7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDFlbTtcbiAgcmlnaHQ6IDFlbTtcbiAgei1pbmRleDogMTAwMDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5gO1xuXG5Ob3RpZmljYXRpb25QYW5lbEZhY3RvcnkuZGVwcyA9IFtOb3RpZmljYXRpb25JdGVtRmFjdG9yeV07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5vdGlmaWNhdGlvblBhbmVsRmFjdG9yeShOb3RpZmljYXRpb25JdGVtKSB7XG4gIHJldHVybiBjbGFzcyBOb3RpZmljYXRpb25QYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIHJlbW92ZU5vdGlmaWNhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWRcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3QgZ2xvYmFsTm90aWZpY2F0aW9ucyA9IHRoaXMucHJvcHMubm90aWZpY2F0aW9ucy5maWx0ZXIoXG4gICAgICAgIG4gPT4gbi50b3BpYyA9PT0gREVGQVVMVF9OT1RJRklDQVRJT05fVE9QSUNTLmdsb2JhbFxuICAgICAgKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxOb3RpZmljYXRpb25QYW5lbENvbnRlbnRcbiAgICAgICAgICBjbGFzc05hbWU9XCJub3RpZmljYXRpb24tcGFuZWxcIlxuICAgICAgICAgIHN0eWxlPXt7ZGlzcGxheTogZ2xvYmFsTm90aWZpY2F0aW9ucy5sZW5ndGggPyAnYmxvY2snIDogJ25vbmUnfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtnbG9iYWxOb3RpZmljYXRpb25zLm1hcChuID0+IChcbiAgICAgICAgICAgIDxOb3RpZmljYXRpb25JdGVtXG4gICAgICAgICAgICAgIGtleT17bi5pZH1cbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uPXtufVxuICAgICAgICAgICAgICByZW1vdmVOb3RpZmljYXRpb249e3RoaXMucHJvcHMucmVtb3ZlTm90aWZpY2F0aW9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9Ob3RpZmljYXRpb25QYW5lbENvbnRlbnQ+XG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==