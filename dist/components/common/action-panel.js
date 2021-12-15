"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var _templateObject, _templateObject2, _templateObject3;

var StyledItem = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  font-size: 12px;\n  line-height: 14px;\n  padding: 8px;\n  min-height: ", "px;\n  text-transform: capitalize;\n  background-color: ", ";\n  max-width: 200px;\n  position: relative;\n\n  ", " :hover {\n    cursor: pointer;\n    color: ", ";\n    .nested-group {\n      display: block;\n    }\n  }\n\n  .label {\n    margin-left: 8px;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n\n  .label-icon {\n    margin-left: auto;\n  }\n\n  .nested-group {\n    max-width: 200px;\n    overflow: hidden;\n    display: none;\n    color: ", ";\n    position: absolute;\n    left: 100%;\n    top: 0px;\n    padding-left: 4px;\n\n    label {\n      white-space: nowrap;\n      text-overflow: ellipsis;\n    }\n  }\n"])), function (props) {
  return props.theme.actionPanelHeight;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.color ? "border-left: 3px solid rgb(".concat(props.color, ");") : '';
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColor;
});

var StyledCheckedbox = (0, _styledComponents["default"])(_switch["default"])(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  label {\n    margin-bottom: 0;\n    color: ", ";\n    padding-left: 20px;\n    line-height: 12px;\n\n    &:before {\n      width: 12px;\n      height: 12px;\n      background-color: ", ";\n    }\n    &:hover {\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.textColorHl;
});

var renderChildren = function renderChildren(child, index) {
  return /*#__PURE__*/_react["default"].cloneElement(child, {
    onClick: function onClick() {
      if ( /*#__PURE__*/_react["default"].isValidElement(child)) {
        if (child.props.onClick) {
          child.props.onClick(index);
        }
      }
    },
    className: (0, _classnames["default"])('action-panel-item', child.props.className)
  });
};
/** @type {typeof import('./action-panel').ActionPanelItem} */


var ActionPanelItem = /*#__PURE__*/_react["default"].memo(function (_ref) {
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
    onClick === null || onClick === void 0 ? void 0 : onClick();
  }, [onClick]);
  return /*#__PURE__*/_react["default"].createElement(StyledItem, {
    className: className,
    onClick: onClickCallback,
    color: color,
    style: style
  }, Icon ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "icon"
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    height: "16px"
  })) : null, isSelection ? /*#__PURE__*/_react["default"].createElement(StyledCheckedbox, {
    type: "checkbox",
    checked: Boolean(isActive),
    id: "switch-".concat(label),
    secondary: true,
    label: label
  }) : /*#__PURE__*/_react["default"].createElement("span", {
    className: "label"
  }, label), children ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "label-icon"
  }, /*#__PURE__*/_react["default"].createElement(_icons.ArrowRight, {
    height: "16px"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "nested-group"
  }, _react["default"].Children.map(children, renderChildren))) : null);
});

exports.ActionPanelItem = ActionPanelItem;
ActionPanelItem.displayName = 'ActionPanelItem';

var StyledActionPanel = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: ", ";\n  box-shadow: ", ";\n  transition: ", ";\n  color: ", ";\n\n  .action-panel-item {\n    ", " &:last-of-type {\n      border-bottom: 0;\n    }\n  }\n"])), function (props) {
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

/** @type {typeof import('./action-panel').ActionPanel} */


var ActionPanel = function ActionPanel(_ref2) {
  var children = _ref2.children,
      className = _ref2.className,
      _ref2$direction = _ref2.direction,
      direction = _ref2$direction === void 0 ? 'column' : _ref2$direction;
  return /*#__PURE__*/_react["default"].createElement(StyledActionPanel, {
    className: className,
    direction: direction
  }, _react["default"].Children.map(children, renderChildren));
};

ActionPanel.displayName = 'ActionPanel';
var _default = ActionPanel;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsiU3R5bGVkSXRlbSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJhY3Rpb25QYW5lbEhlaWdodCIsImRyb3Bkb3duTGlzdEJnZCIsImNvbG9yIiwidGV4dENvbG9ySGwiLCJ0ZXh0Q29sb3IiLCJTdHlsZWRDaGVja2VkYm94IiwiQ2hlY2tib3giLCJyZW5kZXJDaGlsZHJlbiIsImNoaWxkIiwiaW5kZXgiLCJSZWFjdCIsImNsb25lRWxlbWVudCIsIm9uQ2xpY2siLCJpc1ZhbGlkRWxlbWVudCIsImNsYXNzTmFtZSIsIkFjdGlvblBhbmVsSXRlbSIsIm1lbW8iLCJjaGlsZHJlbiIsIkljb24iLCJsYWJlbCIsImlzU2VsZWN0aW9uIiwiaXNBY3RpdmUiLCJzdHlsZSIsIm9uQ2xpY2tDYWxsYmFjayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJCb29sZWFuIiwiQ2hpbGRyZW4iLCJtYXAiLCJkaXNwbGF5TmFtZSIsIlN0eWxlZEFjdGlvblBhbmVsIiwiZGlyZWN0aW9uIiwiZHJvcGRvd25MaXN0U2hhZG93IiwidHJhbnNpdGlvblNsb3ciLCJwYW5lbEhlYWRlckljb24iLCJBY3Rpb25QYW5lbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFVBQVUsR0FBR0MsNkJBQU9DLEdBQVYseTJCQU9BLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsaUJBQWhCO0FBQUEsQ0FQTCxFQVNNLFVBQUFGLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUUsZUFBaEI7QUFBQSxDQVRYLEVBYVosVUFBQUgsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0ksS0FBTix3Q0FBNENKLEtBQUssQ0FBQ0ksS0FBbEQsVUFBOEQsRUFBbkU7QUFBQSxDQWJPLEVBZUgsVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSSxXQUFoQjtBQUFBLENBZkYsRUFtQ0gsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSyxTQUFoQjtBQUFBLENBbkNGLENBQWhCOztBQWdEQSxJQUFNQyxnQkFBZ0IsR0FBRyxrQ0FBT0Msa0JBQVAsQ0FBSCxnVkFHVCxVQUFBUixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlLLFNBQWhCO0FBQUEsQ0FISSxFQVVJLFVBQUFOLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUUsZUFBaEI7QUFBQSxDQVZULEVBYVAsVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSSxXQUFoQjtBQUFBLENBYkUsQ0FBdEI7O0FBa0JBLElBQU1JLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQ0MsS0FBRCxFQUFRQyxLQUFSO0FBQUEsc0JBQ3JCQyxrQkFBTUMsWUFBTixDQUFtQkgsS0FBbkIsRUFBMEI7QUFDeEJJLElBQUFBLE9BQU8sRUFBRSxtQkFBTTtBQUNiLHdCQUFJRixrQkFBTUcsY0FBTixDQUFxQkwsS0FBckIsQ0FBSixFQUFpQztBQUMvQixZQUFJQSxLQUFLLENBQUNWLEtBQU4sQ0FBWWMsT0FBaEIsRUFBeUI7QUFDdkJKLFVBQUFBLEtBQUssQ0FBQ1YsS0FBTixDQUFZYyxPQUFaLENBQW9CSCxLQUFwQjtBQUNEO0FBQ0Y7QUFDRixLQVB1QjtBQVF4QkssSUFBQUEsU0FBUyxFQUFFLDRCQUFXLG1CQUFYLEVBQWdDTixLQUFLLENBQUNWLEtBQU4sQ0FBWWdCLFNBQTVDO0FBUmEsR0FBMUIsQ0FEcUI7QUFBQSxDQUF2QjtBQVlBOzs7QUFDTyxJQUFNQyxlQUFlLGdCQUFHTCxrQkFBTU0sSUFBTixDQUM3QixnQkFBc0Y7QUFBQSxNQUFwRkMsUUFBb0YsUUFBcEZBLFFBQW9GO0FBQUEsTUFBMUVmLEtBQTBFLFFBQTFFQSxLQUEwRTtBQUFBLE1BQW5FWSxTQUFtRSxRQUFuRUEsU0FBbUU7QUFBQSxNQUF4REksSUFBd0QsUUFBeERBLElBQXdEO0FBQUEsTUFBbERDLEtBQWtELFFBQWxEQSxLQUFrRDtBQUFBLE1BQTNDUCxPQUEyQyxRQUEzQ0EsT0FBMkM7QUFBQSxNQUFsQ1EsV0FBa0MsUUFBbENBLFdBQWtDO0FBQUEsTUFBckJDLFFBQXFCLFFBQXJCQSxRQUFxQjtBQUFBLE1BQVhDLEtBQVcsUUFBWEEsS0FBVztBQUNwRixNQUFNQyxlQUFlLEdBQUcsd0JBQ3RCLFVBQUFDLEtBQUssRUFBSTtBQUNQQSxJQUFBQSxLQUFLLENBQUNDLGNBQU47QUFDQUQsSUFBQUEsS0FBSyxDQUFDRSxlQUFOO0FBQ0FkLElBQUFBLE9BQU8sU0FBUCxJQUFBQSxPQUFPLFdBQVAsWUFBQUEsT0FBTztBQUNSLEdBTHFCLEVBTXRCLENBQUNBLE9BQUQsQ0FOc0IsQ0FBeEI7QUFTQSxzQkFDRSxnQ0FBQyxVQUFEO0FBQVksSUFBQSxTQUFTLEVBQUVFLFNBQXZCO0FBQWtDLElBQUEsT0FBTyxFQUFFUyxlQUEzQztBQUE0RCxJQUFBLEtBQUssRUFBRXJCLEtBQW5FO0FBQTBFLElBQUEsS0FBSyxFQUFFb0I7QUFBakYsS0FDR0osSUFBSSxnQkFDSDtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsa0JBQ0UsZ0NBQUMsSUFBRDtBQUFNLElBQUEsTUFBTSxFQUFDO0FBQWIsSUFERixDQURHLEdBSUQsSUFMTixFQU1HRSxXQUFXLGdCQUNWLGdDQUFDLGdCQUFEO0FBQ0UsSUFBQSxJQUFJLEVBQUMsVUFEUDtBQUVFLElBQUEsT0FBTyxFQUFFTyxPQUFPLENBQUNOLFFBQUQsQ0FGbEI7QUFHRSxJQUFBLEVBQUUsbUJBQVlGLEtBQVosQ0FISjtBQUlFLElBQUEsU0FBUyxNQUpYO0FBS0UsSUFBQSxLQUFLLEVBQUVBO0FBTFQsSUFEVSxnQkFTVjtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLEtBQXlCQSxLQUF6QixDQWZKLEVBaUJHRixRQUFRLGdCQUNQLDBEQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixrQkFDRSxnQ0FBQyxpQkFBRDtBQUFZLElBQUEsTUFBTSxFQUFDO0FBQW5CLElBREYsQ0FERixlQUlFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUErQlAsa0JBQU1rQixRQUFOLENBQWVDLEdBQWYsQ0FBbUJaLFFBQW5CLEVBQTZCVixjQUE3QixDQUEvQixDQUpGLENBRE8sR0FPTCxJQXhCTixDQURGO0FBNEJELENBdkM0QixDQUF4Qjs7O0FBMENQUSxlQUFlLENBQUNlLFdBQWhCLEdBQThCLGlCQUE5Qjs7QUFFQSxJQUFNQyxpQkFBaUIsR0FBR25DLDZCQUFPQyxHQUFWLDBSQUVILFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNrQyxTQUFWO0FBQUEsQ0FGRixFQUdQLFVBQUFsQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlrQyxrQkFBaEI7QUFBQSxDQUhFLEVBSVAsVUFBQW5DLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWW1DLGNBQWhCO0FBQUEsQ0FKRSxFQUtaLFVBQUFwQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlLLFNBQWhCO0FBQUEsQ0FMTyxFQVFqQixVQUFBTixLQUFLO0FBQUEsU0FDTEEsS0FBSyxDQUFDa0MsU0FBTixLQUFvQixRQUFwQixzQ0FDZ0NsQyxLQUFLLENBQUNDLEtBQU4sQ0FBWW9DLGVBRDVDLHNDQUUrQnJDLEtBQUssQ0FBQ0MsS0FBTixDQUFZb0MsZUFGM0MsQ0FESztBQUFBLENBUlksQ0FBdkIsQyxDQWlCQTs7QUFDQTs7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWM7QUFBQSxNQUFFbkIsUUFBRixTQUFFQSxRQUFGO0FBQUEsTUFBWUgsU0FBWixTQUFZQSxTQUFaO0FBQUEsOEJBQXVCa0IsU0FBdkI7QUFBQSxNQUF1QkEsU0FBdkIsZ0NBQW1DLFFBQW5DO0FBQUEsc0JBQ2xCLGdDQUFDLGlCQUFEO0FBQW1CLElBQUEsU0FBUyxFQUFFbEIsU0FBOUI7QUFBeUMsSUFBQSxTQUFTLEVBQUVrQjtBQUFwRCxLQUNHdEIsa0JBQU1rQixRQUFOLENBQWVDLEdBQWYsQ0FBbUJaLFFBQW5CLEVBQTZCVixjQUE3QixDQURILENBRGtCO0FBQUEsQ0FBcEI7O0FBTUE2QixXQUFXLENBQUNOLFdBQVosR0FBMEIsYUFBMUI7ZUFFZU0sVyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge3VzZUNhbGxiYWNrfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtBcnJvd1JpZ2h0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgQ2hlY2tib3ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcblxuY29uc3QgU3R5bGVkSXRlbSA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbGluZS1oZWlnaHQ6IDE0cHg7XG4gIHBhZGRpbmc6IDhweDtcbiAgbWluLWhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5hY3Rpb25QYW5lbEhlaWdodH1weDtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgbWF4LXdpZHRoOiAyMDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICR7cHJvcHMgPT4gKHByb3BzLmNvbG9yID8gYGJvcmRlci1sZWZ0OiAzcHggc29saWQgcmdiKCR7cHJvcHMuY29sb3J9KTtgIDogJycpfSA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgLm5lc3RlZC1ncm91cCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gIH1cblxuICAubGFiZWwge1xuICAgIG1hcmdpbi1sZWZ0OiA4cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgfVxuXG4gIC5sYWJlbC1pY29uIHtcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgfVxuXG4gIC5uZXN0ZWQtZ3JvdXAge1xuICAgIG1heC13aWR0aDogMjAwcHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDEwMCU7XG4gICAgdG9wOiAwcHg7XG4gICAgcGFkZGluZy1sZWZ0OiA0cHg7XG5cbiAgICBsYWJlbCB7XG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRDaGVja2VkYm94ID0gc3R5bGVkKENoZWNrYm94KWBcbiAgbGFiZWwge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG4gICAgbGluZS1oZWlnaHQ6IDEycHg7XG5cbiAgICAmOmJlZm9yZSB7XG4gICAgICB3aWR0aDogMTJweDtcbiAgICAgIGhlaWdodDogMTJweDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgICB9XG4gICAgJjpob3ZlciB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCByZW5kZXJDaGlsZHJlbiA9IChjaGlsZCwgaW5kZXgpID0+XG4gIFJlYWN0LmNsb25lRWxlbWVudChjaGlsZCwge1xuICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgaWYgKGNoaWxkLnByb3BzLm9uQ2xpY2spIHtcbiAgICAgICAgICBjaGlsZC5wcm9wcy5vbkNsaWNrKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2xhc3NOYW1lOiBjbGFzc25hbWVzKCdhY3Rpb24tcGFuZWwtaXRlbScsIGNoaWxkLnByb3BzLmNsYXNzTmFtZSlcbiAgfSk7XG5cbi8qKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9hY3Rpb24tcGFuZWwnKS5BY3Rpb25QYW5lbEl0ZW19ICovXG5leHBvcnQgY29uc3QgQWN0aW9uUGFuZWxJdGVtID0gUmVhY3QubWVtbyhcbiAgKHtjaGlsZHJlbiwgY29sb3IsIGNsYXNzTmFtZSwgSWNvbiwgbGFiZWwsIG9uQ2xpY2ssIGlzU2VsZWN0aW9uLCBpc0FjdGl2ZSwgc3R5bGV9KSA9PiB7XG4gICAgY29uc3Qgb25DbGlja0NhbGxiYWNrID0gdXNlQ2FsbGJhY2soXG4gICAgICBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBvbkNsaWNrPy4oKTtcbiAgICAgIH0sXG4gICAgICBbb25DbGlja11cbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRJdGVtIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBvbkNsaWNrPXtvbkNsaWNrQ2FsbGJhY2t9IGNvbG9yPXtjb2xvcn0gc3R5bGU9e3N0eWxlfT5cbiAgICAgICAge0ljb24gPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpY29uXCI+XG4gICAgICAgICAgICA8SWNvbiBoZWlnaHQ9XCIxNnB4XCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIHtpc1NlbGVjdGlvbiA/IChcbiAgICAgICAgICA8U3R5bGVkQ2hlY2tlZGJveFxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIGNoZWNrZWQ9e0Jvb2xlYW4oaXNBY3RpdmUpfVxuICAgICAgICAgICAgaWQ9e2Bzd2l0Y2gtJHtsYWJlbH1gfVxuICAgICAgICAgICAgc2Vjb25kYXJ5XG4gICAgICAgICAgICBsYWJlbD17bGFiZWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsYWJlbFwiPntsYWJlbH08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIHtjaGlsZHJlbiA/IChcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYWJlbC1pY29uXCI+XG4gICAgICAgICAgICAgIDxBcnJvd1JpZ2h0IGhlaWdodD1cIjE2cHhcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5lc3RlZC1ncm91cFwiPntSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIHJlbmRlckNoaWxkcmVuKX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L1N0eWxlZEl0ZW0+XG4gICAgKTtcbiAgfVxuKTtcblxuQWN0aW9uUGFuZWxJdGVtLmRpc3BsYXlOYW1lID0gJ0FjdGlvblBhbmVsSXRlbSc7XG5cbmNvbnN0IFN0eWxlZEFjdGlvblBhbmVsID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246ICR7cHJvcHMgPT4gcHJvcHMuZGlyZWN0aW9ufTtcbiAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RTaGFkb3d9O1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb25TbG93fTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcblxuICAuYWN0aW9uLXBhbmVsLWl0ZW0ge1xuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmRpcmVjdGlvbiA9PT0gJ2NvbHVtbidcbiAgICAgICAgPyBgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR7cHJvcHMudGhlbWUucGFuZWxIZWFkZXJJY29ufWBcbiAgICAgICAgOiBgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgJHtwcm9wcy50aGVtZS5wYW5lbEhlYWRlckljb259YH0gJjpsYXN0LW9mLXR5cGUge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMDtcbiAgICB9XG4gIH1cbmA7XG5cbi8vIFJlYWN0IGNvbXBvdW5kIGVsZW1lbnQgaHR0cHM6Ly9tZWRpdW0uY29tL0BEYW5lX3MvcmVhY3QtanMtY29tcG91bmQtY29tcG9uZW50cy1hNmU1NGI1Yzk5OTJcbi8qKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9hY3Rpb24tcGFuZWwnKS5BY3Rpb25QYW5lbH0gKi9cbmNvbnN0IEFjdGlvblBhbmVsID0gKHtjaGlsZHJlbiwgY2xhc3NOYW1lLCBkaXJlY3Rpb24gPSAnY29sdW1uJ30pID0+IChcbiAgPFN0eWxlZEFjdGlvblBhbmVsIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBkaXJlY3Rpb249e2RpcmVjdGlvbn0+XG4gICAge1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgcmVuZGVyQ2hpbGRyZW4pfVxuICA8L1N0eWxlZEFjdGlvblBhbmVsPlxuKTtcblxuQWN0aW9uUGFuZWwuZGlzcGxheU5hbWUgPSAnQWN0aW9uUGFuZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBBY3Rpb25QYW5lbDtcbiJdfQ==