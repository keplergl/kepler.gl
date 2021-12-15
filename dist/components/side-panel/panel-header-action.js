"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PanelHeaderActionFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _localization = require("../../localization");

var _styledComponents2 = require("../common/styled-components");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var HeaderActionWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: ", "px;\n  display: flex;\n  align-items: center;\n  color: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n\n  &.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n  }\n"])), function (props) {
  return props.flush ? 0 : 8;
}, function (props) {
  return props.active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon;
}, function (props) {
  return props.hoverColor ? props.theme[props.hoverColor] : props.theme.panelHeaderIconHover;
});

PanelHeaderActionFactory.deps = []; // Need to use react class to access props.component

function PanelHeaderActionFactory() {
  var PanelHeaderAction = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(PanelHeaderAction, _Component);

    var _super = _createSuper(PanelHeaderAction);

    function PanelHeaderAction() {
      (0, _classCallCheck2["default"])(this, PanelHeaderAction);
      return _super.apply(this, arguments);
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
        return /*#__PURE__*/_react["default"].createElement(HeaderActionWrapper, {
          className: (0, _classnames2["default"])('panel--header__action', (0, _defineProperty2["default"])({
            disabled: disabled
          }, className, className)),
          active: active,
          hoverColor: hoverColor,
          flush: flush
        }, /*#__PURE__*/_react["default"].createElement(this.props.IconComponent, {
          "data-tip": true,
          "data-for": "".concat(tooltip, "_").concat(id),
          height: "16px",
          onClick: onClick
        }), tooltip ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
          id: "".concat(tooltip, "_").concat(id),
          effect: "solid",
          delayShow: 500,
          type: tooltipType
        }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: tooltip
        }))) : null);
      }
    }]);
    return PanelHeaderAction;
  }(_react.Component);

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
  return PanelHeaderAction;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbi5qcyJdLCJuYW1lcyI6WyJIZWFkZXJBY3Rpb25XcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJmbHVzaCIsImFjdGl2ZSIsInRoZW1lIiwicGFuZWxIZWFkZXJJY29uQWN0aXZlIiwicGFuZWxIZWFkZXJJY29uIiwiaG92ZXJDb2xvciIsInBhbmVsSGVhZGVySWNvbkhvdmVyIiwiUGFuZWxIZWFkZXJBY3Rpb25GYWN0b3J5IiwiZGVwcyIsIlBhbmVsSGVhZGVyQWN0aW9uIiwib25DbGljayIsInRvb2x0aXAiLCJpZCIsInRvb2x0aXBUeXBlIiwiZGlzYWJsZWQiLCJjbGFzc05hbWUiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxtQkFBbUIsR0FBR0MsNkJBQU9DLEdBQVYsMlNBQ1IsVUFBQUMsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0MsS0FBTixHQUFjLENBQWQsR0FBa0IsQ0FBdkI7QUFBQSxDQURHLEVBSWQsVUFBQUQsS0FBSztBQUFBLFNBQ1pBLEtBQUssQ0FBQ0UsTUFBTixHQUFlRixLQUFLLENBQUNHLEtBQU4sQ0FBWUMscUJBQTNCLEdBQW1ESixLQUFLLENBQUNHLEtBQU4sQ0FBWUUsZUFEbkQ7QUFBQSxDQUpTLEVBU1osVUFBQUwsS0FBSztBQUFBLFNBQ1pBLEtBQUssQ0FBQ00sVUFBTixHQUFtQk4sS0FBSyxDQUFDRyxLQUFOLENBQVlILEtBQUssQ0FBQ00sVUFBbEIsQ0FBbkIsR0FBbUROLEtBQUssQ0FBQ0csS0FBTixDQUFZSSxvQkFEbkQ7QUFBQSxDQVRPLENBQXpCOztBQW1CQUMsd0JBQXdCLENBQUNDLElBQXpCLEdBQWdDLEVBQWhDLEMsQ0FDQTs7QUFDZSxTQUFTRCx3QkFBVCxHQUFvQztBQUFBLE1BQzNDRSxpQkFEMkM7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsYUFvQi9DLGtCQUFTO0FBQUEsMEJBV0gsS0FBS1YsS0FYRjtBQUFBLFlBRUxXLE9BRkssZUFFTEEsT0FGSztBQUFBLFlBR0xDLE9BSEssZUFHTEEsT0FISztBQUFBLFlBSUxDLEVBSkssZUFJTEEsRUFKSztBQUFBLFlBS0xYLE1BTEssZUFLTEEsTUFMSztBQUFBLFlBTUxELEtBTkssZUFNTEEsS0FOSztBQUFBLFlBT0xLLFVBUEssZUFPTEEsVUFQSztBQUFBLFlBUUxRLFdBUkssZUFRTEEsV0FSSztBQUFBLFlBU0xDLFFBVEssZUFTTEEsUUFUSztBQUFBLFlBVUxDLFNBVkssZUFVTEEsU0FWSztBQVlQLDRCQUNFLGdDQUFDLG1CQUFEO0FBQ0UsVUFBQSxTQUFTLEVBQUUsNkJBQVcsdUJBQVg7QUFBcUNELFlBQUFBLFFBQVEsRUFBUkE7QUFBckMsYUFBZ0RDLFNBQWhELEVBQTREQSxTQUE1RCxFQURiO0FBRUUsVUFBQSxNQUFNLEVBQUVkLE1BRlY7QUFHRSxVQUFBLFVBQVUsRUFBRUksVUFIZDtBQUlFLFVBQUEsS0FBSyxFQUFFTDtBQUpULHdCQU1FLHFDQUFNLEtBQU4sQ0FBWSxhQUFaO0FBQ0UsMEJBREY7QUFFRSxnQ0FBYVcsT0FBYixjQUF3QkMsRUFBeEIsQ0FGRjtBQUdFLFVBQUEsTUFBTSxFQUFDLE1BSFQ7QUFJRSxVQUFBLE9BQU8sRUFBRUY7QUFKWCxVQU5GLEVBWUdDLE9BQU8sZ0JBQ04sZ0NBQUMsMEJBQUQ7QUFBUyxVQUFBLEVBQUUsWUFBS0EsT0FBTCxjQUFnQkMsRUFBaEIsQ0FBWDtBQUFpQyxVQUFBLE1BQU0sRUFBQyxPQUF4QztBQUFnRCxVQUFBLFNBQVMsRUFBRSxHQUEzRDtBQUFnRSxVQUFBLElBQUksRUFBRUM7QUFBdEUsd0JBQ0UsMkRBQ0UsZ0NBQUMsOEJBQUQ7QUFBa0IsVUFBQSxFQUFFLEVBQUVGO0FBQXRCLFVBREYsQ0FERixDQURNLEdBTUosSUFsQk4sQ0FERjtBQXNCRDtBQXREOEM7QUFBQTtBQUFBLElBQ2pCSyxnQkFEaUI7O0FBQUEsbUNBQzNDUCxpQkFEMkMsZUFFNUI7QUFDakJHLElBQUFBLEVBQUUsRUFBRUssc0JBQVVDLE1BREc7QUFFakJsQixJQUFBQSxLQUFLLEVBQUVpQixzQkFBVUUsSUFGQTtBQUdqQlIsSUFBQUEsT0FBTyxFQUFFTSxzQkFBVUMsTUFIRjtBQUlqQlIsSUFBQUEsT0FBTyxFQUFFTyxzQkFBVUcsSUFKRjtBQUtqQm5CLElBQUFBLE1BQU0sRUFBRWdCLHNCQUFVRSxJQUxEO0FBTWpCTCxJQUFBQSxRQUFRLEVBQUVHLHNCQUFVRSxJQU5IO0FBT2pCZCxJQUFBQSxVQUFVLEVBQUVZLHNCQUFVQyxNQVBMO0FBUWpCSCxJQUFBQSxTQUFTLEVBQUVFLHNCQUFVQyxNQVJKO0FBU2pCTCxJQUFBQSxXQUFXLEVBQUVJLHNCQUFVQztBQVROLEdBRjRCO0FBQUEsbUNBQzNDVCxpQkFEMkMsa0JBY3pCO0FBQ3BCQyxJQUFBQSxPQUFPLEVBQUUsbUJBQU0sQ0FBRSxDQURHO0FBRXBCTCxJQUFBQSxVQUFVLEVBQUUsSUFGUTtBQUdwQkosSUFBQUEsTUFBTSxFQUFFO0FBSFksR0FkeUI7QUF3RGpELFNBQU9RLGlCQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuaW1wb3J0IHtUb29sdGlwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IEhlYWRlckFjdGlvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogJHtwcm9wcyA9PiAocHJvcHMuZmx1c2ggPyAwIDogOCl9cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUucGFuZWxIZWFkZXJJY29uQWN0aXZlIDogcHJvcHMudGhlbWUucGFuZWxIZWFkZXJJY29ufTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuaG92ZXJDb2xvciA/IHByb3BzLnRoZW1lW3Byb3BzLmhvdmVyQ29sb3JdIDogcHJvcHMudGhlbWUucGFuZWxIZWFkZXJJY29uSG92ZXJ9O1xuICB9XG5cbiAgJi5kaXNhYmxlZCB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgb3BhY2l0eTogMC4zO1xuICB9XG5gO1xuXG5QYW5lbEhlYWRlckFjdGlvbkZhY3RvcnkuZGVwcyA9IFtdO1xuLy8gTmVlZCB0byB1c2UgcmVhY3QgY2xhc3MgdG8gYWNjZXNzIHByb3BzLmNvbXBvbmVudFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFuZWxIZWFkZXJBY3Rpb25GYWN0b3J5KCkge1xuICBjbGFzcyBQYW5lbEhlYWRlckFjdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgZmx1c2g6IFByb3BUeXBlcy5ib29sLFxuICAgICAgdG9vbHRpcDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgYWN0aXZlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGhvdmVyQ29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB0b29sdGlwVHlwZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgb25DbGljazogKCkgPT4ge30sXG4gICAgICBob3ZlckNvbG9yOiBudWxsLFxuICAgICAgYWN0aXZlOiBmYWxzZVxuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG9uQ2xpY2ssXG4gICAgICAgIHRvb2x0aXAsXG4gICAgICAgIGlkLFxuICAgICAgICBhY3RpdmUsXG4gICAgICAgIGZsdXNoLFxuICAgICAgICBob3ZlckNvbG9yLFxuICAgICAgICB0b29sdGlwVHlwZSxcbiAgICAgICAgZGlzYWJsZWQsXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8SGVhZGVyQWN0aW9uV3JhcHBlclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncGFuZWwtLWhlYWRlcl9fYWN0aW9uJywge2Rpc2FibGVkLCBbY2xhc3NOYW1lXTogY2xhc3NOYW1lfSl9XG4gICAgICAgICAgYWN0aXZlPXthY3RpdmV9XG4gICAgICAgICAgaG92ZXJDb2xvcj17aG92ZXJDb2xvcn1cbiAgICAgICAgICBmbHVzaD17Zmx1c2h9XG4gICAgICAgID5cbiAgICAgICAgICA8dGhpcy5wcm9wcy5JY29uQ29tcG9uZW50XG4gICAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgICAgZGF0YS1mb3I9e2Ake3Rvb2x0aXB9XyR7aWR9YH1cbiAgICAgICAgICAgIGhlaWdodD1cIjE2cHhcIlxuICAgICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0b29sdGlwID8gKFxuICAgICAgICAgICAgPFRvb2x0aXAgaWQ9e2Ake3Rvb2x0aXB9XyR7aWR9YH0gZWZmZWN0PVwic29saWRcIiBkZWxheVNob3c9ezUwMH0gdHlwZT17dG9vbHRpcFR5cGV9PlxuICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17dG9vbHRpcH0gLz5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0hlYWRlckFjdGlvbldyYXBwZXI+XG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gUGFuZWxIZWFkZXJBY3Rpb247XG59XG4iXX0=