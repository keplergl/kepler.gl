"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = NotificationItemFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _icons = require("../common/icons");

var _reactMarkdown = _interopRequireDefault(require("react-markdown"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var NotificationItemContent = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  color: #fff;\n  display: flex;\n  flex-direction: row;\n  width: ", "px;\n  height: ", "px;\n  font-size: 11px;\n  margin-bottom: 1rem;\n  padding: 1em;\n  border-radius: 4px;\n  box-shadow: ", ";\n  cursor: pointer;\n"])), function (props) {
  return props.theme.notificationColors[props.type] || '#000';
}, function (props) {
  return props.theme.notificationPanelItemWidth * (1 + Number(props.isExpanded));
}, function (props) {
  return props.theme.notificationPanelItemHeight * (1 + Number(props.isExpanded));
}, function (props) {
  return props.theme.boxShadow;
});

var DeleteIcon = (0, _styledComponents["default"])(_icons.Delete)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  cursor: pointer;\n"])));

var NotificationMessage = _styledComponents["default"].div.attrs({
  className: 'notification-item--message'
})(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  flex-grow: 2;\n  width: ", "px;\n  margin: 0 1em;\n  overflow: ", ";\n  padding-right: ", ";\n\n  p {\n    margin-top: 0;\n    a {\n      color: #fff;\n      text-decoration: underline;\n    }\n  }\n"])), function (props) {
  return props.theme.notificationPanelItemWidth;
}, function (props) {
  return props.isExpanded ? 'auto' : 'hidden';
}, function (props) {
  return props.isExpanded ? '1em' : 0;
});

var NotificationIcon = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  svg {\n    vertical-align: text-top;\n  }\n"])));

var icons = {
  info: /*#__PURE__*/_react["default"].createElement(_icons.Info, null),
  warning: /*#__PURE__*/_react["default"].createElement(_icons.Warning, null),
  error: /*#__PURE__*/_react["default"].createElement(_icons.Warning, null),
  success: /*#__PURE__*/_react["default"].createElement(_icons.Checkmark, null)
};

var LinkRenderer = function LinkRenderer(props) {
  return /*#__PURE__*/_react["default"].createElement("a", {
    href: props.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, props.children);
};

function NotificationItemFactory() {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(NotificationItem, _Component);

    var _super = _createSuper(NotificationItem);

    function NotificationItem() {
      var _this;

      (0, _classCallCheck2["default"])(this, NotificationItem);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        isExpanded: false
      });
      return _this;
    }

    (0, _createClass2["default"])(NotificationItem, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.props.isExpanded) {
          this.setState({
            isExpanded: true
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            notification = _this$props.notification,
            removeNotification = _this$props.removeNotification;
        var isExpanded = this.state.isExpanded;
        return /*#__PURE__*/_react["default"].createElement(NotificationItemContent, {
          className: "notification-item",
          type: notification.type,
          isExpanded: isExpanded,
          onClick: function onClick() {
            return _this2.setState({
              isExpanded: !isExpanded
            });
          }
        }, /*#__PURE__*/_react["default"].createElement(NotificationIcon, {
          className: "notification-item--icon"
        }, icons[notification.type]), /*#__PURE__*/_react["default"].createElement(NotificationMessage, {
          isExpanded: isExpanded,
          theme: this.props.theme
        }, /*#__PURE__*/_react["default"].createElement(_reactMarkdown["default"], {
          source: notification.message,
          renderers: {
            link: LinkRenderer
          }
        })), typeof removeNotification === 'function' ? /*#__PURE__*/_react["default"].createElement("div", {
          className: "notification-item--action"
        }, /*#__PURE__*/_react["default"].createElement(DeleteIcon, {
          height: "10px",
          onClick: function onClick() {
            return removeNotification(notification.id);
          }
        })) : null);
      }
    }]);
    return NotificationItem;
  }(_react.Component), (0, _defineProperty2["default"])(_class, "propTypes", {
    notification: _propTypes["default"].shape({
      id: _propTypes["default"].string.isRequired,
      type: _propTypes["default"].string.isRequired,
      message: _propTypes["default"].string.isRequired
    }).isRequired,
    isExpanded: _propTypes["default"].bool
  }), _temp;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi1wYW5lbC9ub3RpZmljYXRpb24taXRlbS5qcyJdLCJuYW1lcyI6WyJOb3RpZmljYXRpb25JdGVtQ29udGVudCIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJub3RpZmljYXRpb25Db2xvcnMiLCJ0eXBlIiwibm90aWZpY2F0aW9uUGFuZWxJdGVtV2lkdGgiLCJOdW1iZXIiLCJpc0V4cGFuZGVkIiwibm90aWZpY2F0aW9uUGFuZWxJdGVtSGVpZ2h0IiwiYm94U2hhZG93IiwiRGVsZXRlSWNvbiIsIkRlbGV0ZSIsIk5vdGlmaWNhdGlvbk1lc3NhZ2UiLCJhdHRycyIsImNsYXNzTmFtZSIsIk5vdGlmaWNhdGlvbkljb24iLCJpY29ucyIsImluZm8iLCJ3YXJuaW5nIiwiZXJyb3IiLCJzdWNjZXNzIiwiTGlua1JlbmRlcmVyIiwiaHJlZiIsImNoaWxkcmVuIiwiTm90aWZpY2F0aW9uSXRlbUZhY3RvcnkiLCJzZXRTdGF0ZSIsIm5vdGlmaWNhdGlvbiIsInJlbW92ZU5vdGlmaWNhdGlvbiIsInN0YXRlIiwibWVzc2FnZSIsImxpbmsiLCJpZCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsR0FBR0MsNkJBQU9DLEdBQVYsZ1ZBQ1AsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxrQkFBWixDQUErQkYsS0FBSyxDQUFDRyxJQUFyQyxLQUE4QyxNQUFsRDtBQUFBLENBREUsRUFLbEIsVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRywwQkFBWixJQUEwQyxJQUFJQyxNQUFNLENBQUNMLEtBQUss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NkMsVUFBQSxLQUFLLEVBQUUsS0FBS04sS0FBTCxDQUFXQztBQUEvRCx3QkFDRSxnQ0FBQyx5QkFBRDtBQUFlLFVBQUEsTUFBTSxFQUFFd0IsWUFBWSxDQUFDRyxPQUFwQztBQUE2QyxVQUFBLFNBQVMsRUFBRTtBQUFDQyxZQUFBQSxJQUFJLEVBQUVUO0FBQVA7QUFBeEQsVUFERixDQVRGLEVBWUcsT0FBT00sa0JBQVAsS0FBOEIsVUFBOUIsZ0JBQ0M7QUFBSyxVQUFBLFNBQVMsRUFBQztBQUFmLHdCQUNFLGdDQUFDLFVBQUQ7QUFBWSxVQUFBLE1BQU0sRUFBQyxNQUFuQjtBQUEwQixVQUFBLE9BQU8sRUFBRTtBQUFBLG1CQUFNQSxrQkFBa0IsQ0FBQ0QsWUFBWSxDQUFDSyxFQUFkLENBQXhCO0FBQUE7QUFBbkMsVUFERixDQURELEdBSUcsSUFoQk4sQ0FERjtBQW9CRDtBQTVDSDtBQUFBO0FBQUEsSUFBc0NDLGdCQUF0Qyx5REFDcUI7QUFDakJOLElBQUFBLFlBQVksRUFBRU8sc0JBQVVDLEtBQVYsQ0FBZ0I7QUFDNUJILE1BQUFBLEVBQUUsRUFBRUUsc0JBQVVFLE1BQVYsQ0FBaUJDLFVBRE87QUFFNUJoQyxNQUFBQSxJQUFJLEVBQUU2QixzQkFBVUUsTUFBVixDQUFpQkMsVUFGSztBQUc1QlAsTUFBQUEsT0FBTyxFQUFFSSxzQkFBVUUsTUFBVixDQUFpQkM7QUFIRSxLQUFoQixFQUlYQSxVQUxjO0FBTWpCN0IsSUFBQUEsVUFBVSxFQUFFMEIsc0JBQVVJO0FBTkwsR0FEckI7QUE4Q0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7RGVsZXRlLCBJbmZvLCBXYXJuaW5nLCBDaGVja21hcmt9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBSZWFjdE1hcmtkb3duIGZyb20gJ3JlYWN0LW1hcmtkb3duJztcblxuY29uc3QgTm90aWZpY2F0aW9uSXRlbUNvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm5vdGlmaWNhdGlvbkNvbG9yc1twcm9wcy50eXBlXSB8fCAnIzAwMCd9O1xuICBjb2xvcjogI2ZmZjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubm90aWZpY2F0aW9uUGFuZWxJdGVtV2lkdGggKiAoMSArIE51bWJlcihwcm9wcy5pc0V4cGFuZGVkKSl9cHg7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ub3RpZmljYXRpb25QYW5lbEl0ZW1IZWlnaHQgKiAoMSArIE51bWJlcihwcm9wcy5pc0V4cGFuZGVkKSl9cHg7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgcGFkZGluZzogMWVtO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuYm94U2hhZG93fTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuYDtcblxuY29uc3QgRGVsZXRlSWNvbiA9IHN0eWxlZChEZWxldGUpYFxuICBjdXJzb3I6IHBvaW50ZXI7XG5gO1xuXG5jb25zdCBOb3RpZmljYXRpb25NZXNzYWdlID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ25vdGlmaWNhdGlvbi1pdGVtLS1tZXNzYWdlJ1xufSlgXG4gIGZsZXgtZ3JvdzogMjtcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubm90aWZpY2F0aW9uUGFuZWxJdGVtV2lkdGh9cHg7XG4gIG1hcmdpbjogMCAxZW07XG4gIG92ZXJmbG93OiAke3Byb3BzID0+IChwcm9wcy5pc0V4cGFuZGVkID8gJ2F1dG8nIDogJ2hpZGRlbicpfTtcbiAgcGFkZGluZy1yaWdodDogJHtwcm9wcyA9PiAocHJvcHMuaXNFeHBhbmRlZCA/ICcxZW0nIDogMCl9O1xuXG4gIHAge1xuICAgIG1hcmdpbi10b3A6IDA7XG4gICAgYSB7XG4gICAgICBjb2xvcjogI2ZmZjtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgTm90aWZpY2F0aW9uSWNvbiA9IHN0eWxlZC5kaXZgXG4gIHN2ZyB7XG4gICAgdmVydGljYWwtYWxpZ246IHRleHQtdG9wO1xuICB9XG5gO1xuXG5jb25zdCBpY29ucyA9IHtcbiAgaW5mbzogPEluZm8gLz4sXG4gIHdhcm5pbmc6IDxXYXJuaW5nIC8+LFxuICBlcnJvcjogPFdhcm5pbmcgLz4sXG4gIHN1Y2Nlc3M6IDxDaGVja21hcmsgLz5cbn07XG5cbmNvbnN0IExpbmtSZW5kZXJlciA9IHByb3BzID0+IHtcbiAgcmV0dXJuIChcbiAgICA8YSBocmVmPXtwcm9wcy5ocmVmfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgPC9hPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTm90aWZpY2F0aW9uSXRlbUZhY3RvcnkoKSB7XG4gIHJldHVybiBjbGFzcyBOb3RpZmljYXRpb25JdGVtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgbm90aWZpY2F0aW9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIGlzRXhwYW5kZWQ6IFByb3BUeXBlcy5ib29sXG4gICAgfTtcblxuICAgIHN0YXRlID0ge1xuICAgICAgaXNFeHBhbmRlZDogZmFsc2VcbiAgICB9O1xuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc0V4cGFuZGVkKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzRXhwYW5kZWQ6IHRydWV9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7bm90aWZpY2F0aW9uLCByZW1vdmVOb3RpZmljYXRpb259ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHtpc0V4cGFuZGVkfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxOb3RpZmljYXRpb25JdGVtQ29udGVudFxuICAgICAgICAgIGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1pdGVtXCJcbiAgICAgICAgICB0eXBlPXtub3RpZmljYXRpb24udHlwZX1cbiAgICAgICAgICBpc0V4cGFuZGVkPXtpc0V4cGFuZGVkfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe2lzRXhwYW5kZWQ6ICFpc0V4cGFuZGVkfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Tm90aWZpY2F0aW9uSWNvbiBjbGFzc05hbWU9XCJub3RpZmljYXRpb24taXRlbS0taWNvblwiPlxuICAgICAgICAgICAge2ljb25zW25vdGlmaWNhdGlvbi50eXBlXX1cbiAgICAgICAgICA8L05vdGlmaWNhdGlvbkljb24+XG4gICAgICAgICAgPE5vdGlmaWNhdGlvbk1lc3NhZ2UgaXNFeHBhbmRlZD17aXNFeHBhbmRlZH0gdGhlbWU9e3RoaXMucHJvcHMudGhlbWV9PlxuICAgICAgICAgICAgPFJlYWN0TWFya2Rvd24gc291cmNlPXtub3RpZmljYXRpb24ubWVzc2FnZX0gcmVuZGVyZXJzPXt7bGluazogTGlua1JlbmRlcmVyfX0gLz5cbiAgICAgICAgICA8L05vdGlmaWNhdGlvbk1lc3NhZ2U+XG4gICAgICAgICAge3R5cGVvZiByZW1vdmVOb3RpZmljYXRpb24gPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbi1pdGVtLS1hY3Rpb25cIj5cbiAgICAgICAgICAgICAgPERlbGV0ZUljb24gaGVpZ2h0PVwiMTBweFwiIG9uQ2xpY2s9eygpID0+IHJlbW92ZU5vdGlmaWNhdGlvbihub3RpZmljYXRpb24uaWQpfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvTm90aWZpY2F0aW9uSXRlbUNvbnRlbnQ+XG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==