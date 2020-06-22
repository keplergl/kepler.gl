"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ActionPanelItem = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icons = require("./icons");

var _switch = _interopRequireDefault(require("./switch"));

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: ", ";\n  box-shadow: ", ";\n  transition: ", ";\n  color: ", ";\n\n  .action-panel-item {\n    ", "\n\n    &:last-of-type {\n      border-bottom: 0;\n    }\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  label {\n    margin-bottom: 0;\n    color: ", ";\n    padding-left: 20px;\n    line-height: 12px;\n\n    &:before {\n      width: 12px;\n      height: 12px;\n      background-color: ", ";\n    }\n    &:hover {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  font-size: 12px;\n  line-height: 14px;\n  padding: 8px;\n  min-height: ", "px;\n  text-transform: capitalize;\n  background-color: ", ";\n  width: ", "px;\n  position: relative;\n  ", "\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n    .nested-group {\n      display: block;\n    }\n  }\n\n  .label {\n    margin-left: 8px;\n  }\n\n  .label-icon {\n    margin-left: auto;\n  }\n\n  .nested-group {\n    width: 110px;\n    display: none;\n    color: ", ";\n    position: absolute;\n    left: 110px;\n    top: 0px;\n    padding-left: 4px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledItem = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.actionPanelHeight;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.actionPanelWidth;
}, function (props) {
  return props.color ? "border-left: 3px solid rgb(".concat(props.color, ");") : '';
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColor;
});

var StyledCheckedbox = (0, _styledComponents["default"])(_switch["default"])(_templateObject2(), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.textColorHl;
});

var renderChildren = function renderChildren(child, index) {
  return _react["default"].cloneElement(child, {
    onClick: function onClick() {
      if (_react["default"].isValidElement(child)) {
        if (child.props.onClick) {
          child.props.onClick(index);
        }
      }
    },
    className: (0, _classnames["default"])('action-panel-item', child.props.className)
  });
};

var ActionPanelItem = _react["default"].memo(function (_ref) {
  var children = _ref.children,
      color = _ref.color,
      className = _ref.className,
      Icon = _ref.Icon,
      label = _ref.label,
      onClick = _ref.onClick,
      isSelection = _ref.isSelection,
      isActive = _ref.isActive,
      style = _ref.style;
  var onClickCallback = (0, _react.useCallback)(function (event) {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  }, [onClick]);
  return _react["default"].createElement(StyledItem, {
    className: className,
    onClick: onClickCallback,
    color: color,
    style: style
  }, Icon ? _react["default"].createElement("div", {
    className: "icon"
  }, _react["default"].createElement(Icon, {
    height: "16px"
  })) : null, isSelection ? _react["default"].createElement(StyledCheckedbox, {
    type: "checkbox",
    checked: Boolean(isActive),
    id: "switch-".concat(label),
    secondary: true,
    label: label
  }) : _react["default"].createElement("span", {
    className: "label"
  }, label), children && children.length ? _react["default"].createElement("div", null, _react["default"].createElement("div", {
    className: "label-icon"
  }, _react["default"].createElement(_icons.ArrowRight, {
    height: "16px"
  })), _react["default"].createElement("div", {
    className: "nested-group"
  }, _react["default"].Children.map(children, renderChildren))) : null);
});

exports.ActionPanelItem = ActionPanelItem;
ActionPanelItem.displayName = 'ActionPanelItem';

var StyledActionPanel = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.direction;
}, function (props) {
  return props.theme.dropdownListShadow;
}, function (props) {
  return props.theme.transitionSlow;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.direction === 'column' ? "border-bottom: 1px solid ".concat(props.theme.panelHeaderIcon) : "border-right: 1px solid ".concat(props.theme.panelHeaderIcon);
}); // React compound element https://medium.com/@Dane_s/react-js-compound-components-a6e54b5c9992


var ActionPanel = function ActionPanel(_ref2) {
  var children = _ref2.children,
      className = _ref2.className,
      _ref2$direction = _ref2.direction,
      direction = _ref2$direction === void 0 ? 'column' : _ref2$direction;
  return _react["default"].createElement(StyledActionPanel, {
    className: className,
    direction: direction
  }, _react["default"].Children.map(children, renderChildren));
};

ActionPanel.displayName = 'ActionPanel';
var _default = ActionPanel;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsiU3R5bGVkSXRlbSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJhY3Rpb25QYW5lbEhlaWdodCIsImRyb3Bkb3duTGlzdEJnZCIsImFjdGlvblBhbmVsV2lkdGgiLCJjb2xvciIsInRleHRDb2xvckhsIiwidGV4dENvbG9yIiwiU3R5bGVkQ2hlY2tlZGJveCIsIkNoZWNrYm94IiwicmVuZGVyQ2hpbGRyZW4iLCJjaGlsZCIsImluZGV4IiwiUmVhY3QiLCJjbG9uZUVsZW1lbnQiLCJvbkNsaWNrIiwiaXNWYWxpZEVsZW1lbnQiLCJjbGFzc05hbWUiLCJBY3Rpb25QYW5lbEl0ZW0iLCJtZW1vIiwiY2hpbGRyZW4iLCJJY29uIiwibGFiZWwiLCJpc1NlbGVjdGlvbiIsImlzQWN0aXZlIiwic3R5bGUiLCJvbkNsaWNrQ2FsbGJhY2siLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiQm9vbGVhbiIsImxlbmd0aCIsIkNoaWxkcmVuIiwibWFwIiwiZGlzcGxheU5hbWUiLCJTdHlsZWRBY3Rpb25QYW5lbCIsImRpcmVjdGlvbiIsImRyb3Bkb3duTGlzdFNoYWRvdyIsInRyYW5zaXRpb25TbG93IiwicGFuZWxIZWFkZXJJY29uIiwiQWN0aW9uUGFuZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsVUFBVSxHQUFHQyw2QkFBT0MsR0FBVixvQkFPQSxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLGlCQUFoQjtBQUFBLENBUEwsRUFTTSxVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLGVBQWhCO0FBQUEsQ0FUWCxFQVVMLFVB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LE1BQVlILFNBQVosU0FBWUEsU0FBWjtBQUFBLDhCQUF1Qm1CLFNBQXZCO0FBQUEsTUFBdUJBLFNBQXZCLGdDQUFtQyxRQUFuQztBQUFBLFNBQ2xCLGdDQUFDLGlCQUFEO0FBQW1CLElBQUEsU0FBUyxFQUFFbkIsU0FBOUI7QUFBeUMsSUFBQSxTQUFTLEVBQUVtQjtBQUFwRCxLQUNHdkIsa0JBQU1tQixRQUFOLENBQWVDLEdBQWYsQ0FBbUJiLFFBQW5CLEVBQTZCVixjQUE3QixDQURILENBRGtCO0FBQUEsQ0FBcEI7O0FBTUE4QixXQUFXLENBQUNOLFdBQVosR0FBMEIsYUFBMUI7ZUFFZU0sVyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge3VzZUNhbGxiYWNrfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtBcnJvd1JpZ2h0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgQ2hlY2tib3ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcblxuY29uc3QgU3R5bGVkSXRlbSA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbGluZS1oZWlnaHQ6IDE0cHg7XG4gIHBhZGRpbmc6IDhweDtcbiAgbWluLWhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5hY3Rpb25QYW5lbEhlaWdodH1weDtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuYWN0aW9uUGFuZWxXaWR0aH1weDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAke3Byb3BzID0+IChwcm9wcy5jb2xvciA/IGBib3JkZXItbGVmdDogM3B4IHNvbGlkIHJnYigke3Byb3BzLmNvbG9yfSk7YCA6ICcnKX1cblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgLm5lc3RlZC1ncm91cCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gIH1cblxuICAubGFiZWwge1xuICAgIG1hcmdpbi1sZWZ0OiA4cHg7XG4gIH1cblxuICAubGFiZWwtaWNvbiB7XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIH1cblxuICAubmVzdGVkLWdyb3VwIHtcbiAgICB3aWR0aDogMTEwcHg7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAxMTBweDtcbiAgICB0b3A6IDBweDtcbiAgICBwYWRkaW5nLWxlZnQ6IDRweDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkQ2hlY2tlZGJveCA9IHN0eWxlZChDaGVja2JveClgXG4gIGxhYmVsIHtcbiAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgcGFkZGluZy1sZWZ0OiAyMHB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxMnB4O1xuXG4gICAgJjpiZWZvcmUge1xuICAgICAgd2lkdGg6IDEycHg7XG4gICAgICBoZWlnaHQ6IDEycHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJnZH07XG4gICAgfVxuICAgICY6aG92ZXIge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgcmVuZGVyQ2hpbGRyZW4gPSAoY2hpbGQsIGluZGV4KSA9PlxuICBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQsIHtcbiAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICBpZiAoUmVhY3QuaXNWYWxpZEVsZW1lbnQoY2hpbGQpKSB7XG4gICAgICAgIGlmIChjaGlsZC5wcm9wcy5vbkNsaWNrKSB7XG4gICAgICAgICAgY2hpbGQucHJvcHMub25DbGljayhpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNsYXNzTmFtZTogY2xhc3NuYW1lcygnYWN0aW9uLXBhbmVsLWl0ZW0nLCBjaGlsZC5wcm9wcy5jbGFzc05hbWUpXG4gIH0pO1xuXG5leHBvcnQgY29uc3QgQWN0aW9uUGFuZWxJdGVtID0gUmVhY3QubWVtbyhcbiAgKHtjaGlsZHJlbiwgY29sb3IsIGNsYXNzTmFtZSwgSWNvbiwgbGFiZWwsIG9uQ2xpY2ssIGlzU2VsZWN0aW9uLCBpc0FjdGl2ZSwgc3R5bGV9KSA9PiB7XG4gICAgY29uc3Qgb25DbGlja0NhbGxiYWNrID0gdXNlQ2FsbGJhY2soXG4gICAgICBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBvbkNsaWNrKCk7XG4gICAgICB9LFxuICAgICAgW29uQ2xpY2tdXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkSXRlbSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gb25DbGljaz17b25DbGlja0NhbGxiYWNrfSBjb2xvcj17Y29sb3J9IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIHtJY29uID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaWNvblwiPlxuICAgICAgICAgICAgPEljb24gaGVpZ2h0PVwiMTZweFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICB7aXNTZWxlY3Rpb24gPyAoXG4gICAgICAgICAgPFN0eWxlZENoZWNrZWRib3hcbiAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICBjaGVja2VkPXtCb29sZWFuKGlzQWN0aXZlKX1cbiAgICAgICAgICAgIGlkPXtgc3dpdGNoLSR7bGFiZWx9YH1cbiAgICAgICAgICAgIHNlY29uZGFyeVxuICAgICAgICAgICAgbGFiZWw9e2xhYmVsfVxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGFiZWxcIj57bGFiZWx9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICB7Y2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoID8gKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsLWljb25cIj5cbiAgICAgICAgICAgICAgPEFycm93UmlnaHQgaGVpZ2h0PVwiMTZweFwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmVzdGVkLWdyb3VwXCI+e1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgcmVuZGVyQ2hpbGRyZW4pfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvU3R5bGVkSXRlbT5cbiAgICApO1xuICB9XG4pO1xuXG5BY3Rpb25QYW5lbEl0ZW0uZGlzcGxheU5hbWUgPSAnQWN0aW9uUGFuZWxJdGVtJztcblxuY29uc3QgU3R5bGVkQWN0aW9uUGFuZWwgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogJHtwcm9wcyA9PiBwcm9wcy5kaXJlY3Rpb259O1xuICBib3gtc2hhZG93OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdFNoYWRvd307XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvblNsb3d9O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuXG4gIC5hY3Rpb24tcGFuZWwtaXRlbSB7XG4gICAgJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuZGlyZWN0aW9uID09PSAnY29sdW1uJ1xuICAgICAgICA/IGBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHtwcm9wcy50aGVtZS5wYW5lbEhlYWRlckljb259YFxuICAgICAgICA6IGBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAke3Byb3BzLnRoZW1lLnBhbmVsSGVhZGVySWNvbn1gfVxuXG4gICAgJjpsYXN0LW9mLXR5cGUge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMDtcbiAgICB9XG4gIH1cbmA7XG5cbi8vIFJlYWN0IGNvbXBvdW5kIGVsZW1lbnQgaHR0cHM6Ly9tZWRpdW0uY29tL0BEYW5lX3MvcmVhY3QtanMtY29tcG91bmQtY29tcG9uZW50cy1hNmU1NGI1Yzk5OTJcbmNvbnN0IEFjdGlvblBhbmVsID0gKHtjaGlsZHJlbiwgY2xhc3NOYW1lLCBkaXJlY3Rpb24gPSAnY29sdW1uJ30pID0+IChcbiAgPFN0eWxlZEFjdGlvblBhbmVsIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBkaXJlY3Rpb249e2RpcmVjdGlvbn0+XG4gICAge1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgcmVuZGVyQ2hpbGRyZW4pfVxuICA8L1N0eWxlZEFjdGlvblBhbmVsPlxuKTtcblxuQWN0aW9uUGFuZWwuZGlzcGxheU5hbWUgPSAnQWN0aW9uUGFuZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBBY3Rpb25QYW5lbDtcbiJdfQ==