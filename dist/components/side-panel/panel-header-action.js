"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _styledComponents2 = require("../common/styled-components");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: ", "px;\n  display: flex;\n  align-items: center;\n  color: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n\n  &.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var HeaderActionWrapper = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.flush ? 0 : 8;
}, function (props) {
  return props.active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon;
}, function (props) {
  return props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl;
}); // Need to use react class to access props.component


var PanelHeaderAction =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PanelHeaderAction, _Component);

  function PanelHeaderAction() {
    (0, _classCallCheck2["default"])(this, PanelHeaderAction);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PanelHeaderAction).apply(this, arguments));
  }

  (0, _createClass2["default"])(PanelHeaderAction, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onClick = _this$props.onClick,
          tooltip = _this$props.tooltip,
          id = _this$props.id,
          active = _this$props.active,
          flush = _this$props.flush,
          hoverColor = _this$props.hoverColor,
          tooltipType = _this$props.tooltipType,
          disabled = _this$props.disabled,
          className = _this$props.className;
      return _react["default"].createElement(HeaderActionWrapper, {
        className: (0, _classnames2["default"])('panel--header__action', (0, _defineProperty2["default"])({
          disabled: disabled
        }, className, className)),
        active: active,
        hoverColor: hoverColor,
        flush: flush
      }, _react["default"].createElement(this.props.IconComponent, {
        "data-tip": true,
        "data-for": "".concat(tooltip, "_").concat(id),
        height: "16px",
        onClick: onClick
      }), tooltip ? _react["default"].createElement(_styledComponents2.Tooltip, {
        id: "".concat(tooltip, "_").concat(id),
        effect: "solid",
        delayShow: 500,
        type: tooltipType
      }, _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: tooltip
      }))) : null);
    }
  }]);
  return PanelHeaderAction;
}(_react.Component);

exports["default"] = PanelHeaderAction;
(0, _defineProperty2["default"])(PanelHeaderAction, "propTypes", {
  id: _propTypes["default"].string,
  flush: _propTypes["default"].bool,
  tooltip: _propTypes["default"].string,
  onClick: _propTypes["default"].func,
  active: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  hoverColor: _propTypes["default"].string,
  className: _propTypes["default"].string,
  tooltipType: _propTypes["default"].string
});
(0, _defineProperty2["default"])(PanelHeaderAction, "defaultProps", {
  onClick: function onClick() {},
  hoverColor: null,
  active: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbi5qcyJdLCJuYW1lcyI6WyJIZWFkZXJBY3Rpb25XcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJmbHVzaCIsImFjdGl2ZSIsInRoZW1lIiwicGFuZWxIZWFkZXJJY29uQWN0aXZlIiwicGFuZWxIZWFkZXJJY29uIiwiaG92ZXJDb2xvciIsInRleHRDb2xvckhsIiwiUGFuZWxIZWFkZXJBY3Rpb24iLCJvbkNsaWNrIiwidG9vbHRpcCIsImlkIiwidG9vbHRpcFR5cGUiLCJkaXNhYmxlZCIsImNsYXNzTmFtZSIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInN0cmluZyIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxtQkFBbUIsR0FBR0MsNkJBQU9DLEdBQVYsb0JBQ1IsVUFBQUMsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0MsS0FBTixHQUFjLENBQWQsR0FBa0IsQ0FBdkI7QUFBQSxDQURHLEVBSWQsVUFBQUQsS0FBSztBQUFBLFNBQ1pBLEtBQUssQ0FBQ0UsTUFBTixHQUFlRixLQUFLLENBQUNHLEtBQU4sQ0FBWUMscUJBQTNCLEdBQW1ESixLQUFLLENBQUNHLEtBQU4sQ0FBWUUsZUFEbkQ7QUFBQSxDQUpTLEVBU1osVUFBQUwsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ00sVUFBTixHQUFtQk4sS0FBSyxDQUFDRyxLQUFOLENBQVlILEtBQUssQ0FBQ00sVUFBbEIsQ0FBbkIsR0FBbUROLEtBQUssQ0FBQ0csS0FBTixDQUFZSSxXQUFwRTtBQUFBLENBVE8sQ0FBekIsQyxDQWtCQTs7O0lBQ3FCQyxpQjs7Ozs7Ozs7Ozs7OzZCQW1CVjtBQUFBLHdCQVdILEtBQUtSLEtBWEY7QUFBQSxVQUVMUyxPQUZLLGVBRUxBLE9BRks7QUFBQSxVQUdMQyxPQUhLLGVBR0xBLE9BSEs7QUFBQSxVQUlMQyxFQUpLLGVBSUxBLEVBSks7QUFBQSxVQUtMVCxNQUxLLGVBS0xBLE1BTEs7QUFBQSxVQU1MRCxLQU5LLGVBTUxBLEtBTks7QUFBQSxVQU9MSyxVQVBLLGVBT0xBLFVBUEs7QUFBQSxVQVFMTSxXQVJLLGVBUUxBLFdBUks7QUFBQSxVQVNMQyxRQVRLLGVBU0xBLFFBVEs7QUFBQSxVQVVMQyxTQVZLLGVBVUxBLFNBVks7QUFZUCxhQUNFLGdDQUFDLG1CQUFEO0FBQ0UsUUFBQSxTQUFTLEVBQUUsNkJBQVcsdUJBQVg7QUFBcUNELFVBQUFBLFFBQVEsRUFBUkE7QUFBckMsV0FBZ0RDLFNBQWhELEVBQTREQSxTQUE1RCxFQURiO0FBRUUsUUFBQSxNQUFNLEVBQUVaLE1BRlY7QUFHRSxRQUFBLFVBQVUsRUFBRUksVUFIZDtBQUlFLFFBQUEsS0FBSyxFQUFFTDtBQUpULFNBTUUscUNBQU0sS0FBTixDQUFZLGFBQVo7QUFDRSx3QkFERjtBQUVFLDhCQUFhUyxPQUFiLGNBQXdCQyxFQUF4QixDQUZGO0FBR0UsUUFBQSxNQUFNLEVBQUMsTUFIVDtBQUlFLFFBQUEsT0FBTyxFQUFFRjtBQUpYLFFBTkYsRUFZR0MsT0FBTyxHQUNOLGdDQUFDLDBCQUFEO0FBQVMsUUFBQSxFQUFFLFlBQUtBLE9BQUwsY0FBZ0JDLEVBQWhCLENBQVg7QUFBaUMsUUFBQSxNQUFNLEVBQUMsT0FBeEM7QUFBZ0QsUUFBQSxTQUFTLEVBQUUsR0FBM0Q7QUFBZ0UsUUFBQSxJQUFJLEVBQUVDO0FBQXRFLFNBQ0UsOENBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsUUFBQSxFQUFFLEVBQUVGO0FBQXRCLFFBREYsQ0FERixDQURNLEdBTUosSUFsQk4sQ0FERjtBQXNCRDs7O0VBckQ0Q0ssZ0I7OztpQ0FBMUJQLGlCLGVBQ0E7QUFDakJHLEVBQUFBLEVBQUUsRUFBRUssc0JBQVVDLE1BREc7QUFFakJoQixFQUFBQSxLQUFLLEVBQUVlLHNCQUFVRSxJQUZBO0FBR2pCUixFQUFBQSxPQUFPLEVBQUVNLHNCQUFVQyxNQUhGO0FBSWpCUixFQUFBQSxPQUFPLEVBQUVPLHNCQUFVRyxJQUpGO0FBS2pCakIsRUFBQUEsTUFBTSxFQUFFYyxzQkFBVUUsSUFMRDtBQU1qQkwsRUFBQUEsUUFBUSxFQUFFRyxzQkFBVUUsSUFOSDtBQU9qQlosRUFBQUEsVUFBVSxFQUFFVSxzQkFBVUMsTUFQTDtBQVFqQkgsRUFBQUEsU0FBUyxFQUFFRSxzQkFBVUMsTUFSSjtBQVNqQkwsRUFBQUEsV0FBVyxFQUFFSSxzQkFBVUM7QUFUTixDO2lDQURBVCxpQixrQkFhRztBQUNwQkMsRUFBQUEsT0FBTyxFQUFFLG1CQUFNLENBQUUsQ0FERztBQUVwQkgsRUFBQUEsVUFBVSxFQUFFLElBRlE7QUFHcEJKLEVBQUFBLE1BQU0sRUFBRTtBQUhZLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCB7VG9vbHRpcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBIZWFkZXJBY3Rpb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWxlZnQ6ICR7cHJvcHMgPT4gKHByb3BzLmZsdXNoID8gMCA6IDgpfXB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnBhbmVsSGVhZGVySWNvbkFjdGl2ZSA6IHByb3BzLnRoZW1lLnBhbmVsSGVhZGVySWNvbn07XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLmhvdmVyQ29sb3IgPyBwcm9wcy50aGVtZVtwcm9wcy5ob3ZlckNvbG9yXSA6IHByb3BzLnRoZW1lLnRleHRDb2xvckhsKX07XG4gIH1cblxuICAmLmRpc2FibGVkIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBvcGFjaXR5OiAwLjM7XG4gIH1cbmA7XG5cbi8vIE5lZWQgdG8gdXNlIHJlYWN0IGNsYXNzIHRvIGFjY2VzcyBwcm9wcy5jb21wb25lbnRcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsSGVhZGVyQWN0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBmbHVzaDogUHJvcFR5cGVzLmJvb2wsXG4gICAgdG9vbHRpcDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBhY3RpdmU6IFByb3BUeXBlcy5ib29sLFxuICAgIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBob3ZlckNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB0b29sdGlwVHlwZTogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25DbGljazogKCkgPT4ge30sXG4gICAgaG92ZXJDb2xvcjogbnVsbCxcbiAgICBhY3RpdmU6IGZhbHNlXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIG9uQ2xpY2ssXG4gICAgICB0b29sdGlwLFxuICAgICAgaWQsXG4gICAgICBhY3RpdmUsXG4gICAgICBmbHVzaCxcbiAgICAgIGhvdmVyQ29sb3IsXG4gICAgICB0b29sdGlwVHlwZSxcbiAgICAgIGRpc2FibGVkLFxuICAgICAgY2xhc3NOYW1lXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxIZWFkZXJBY3Rpb25XcmFwcGVyXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncGFuZWwtLWhlYWRlcl9fYWN0aW9uJywge2Rpc2FibGVkLCBbY2xhc3NOYW1lXTogY2xhc3NOYW1lfSl9XG4gICAgICAgIGFjdGl2ZT17YWN0aXZlfVxuICAgICAgICBob3ZlckNvbG9yPXtob3ZlckNvbG9yfVxuICAgICAgICBmbHVzaD17Zmx1c2h9XG4gICAgICA+XG4gICAgICAgIDx0aGlzLnByb3BzLkljb25Db21wb25lbnRcbiAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgIGRhdGEtZm9yPXtgJHt0b29sdGlwfV8ke2lkfWB9XG4gICAgICAgICAgaGVpZ2h0PVwiMTZweFwiXG4gICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgLz5cbiAgICAgICAge3Rvb2x0aXAgPyAoXG4gICAgICAgICAgPFRvb2x0aXAgaWQ9e2Ake3Rvb2x0aXB9XyR7aWR9YH0gZWZmZWN0PVwic29saWRcIiBkZWxheVNob3c9ezUwMH0gdHlwZT17dG9vbHRpcFR5cGV9PlxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXt0b29sdGlwfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L0hlYWRlckFjdGlvbldyYXBwZXI+XG4gICAgKTtcbiAgfVxufVxuIl19