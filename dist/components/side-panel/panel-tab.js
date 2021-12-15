"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanelTabFactory = PanelTabFactory;
exports["default"] = exports.StyledPanelTab = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styledComponents2 = require("../common/styled-components");

var _localization = require("../../localization");

var _templateObject;

var StyledPanelTab = _styledComponents["default"].div.attrs({
  className: 'side-panel__tab'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: flex-end;\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: ", ";\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  margin-right: ", "px;\n  padding-bottom: ", "px;\n  width: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"])), function (props) {
  return props.active ? props.theme.panelToggleBorderColor : 'transparent';
}, function (props) {
  return props.active ? props.theme.subtextColorActive : props.theme.panelTabColor;
}, function (props) {
  return props.theme.panelToggleMarginRight;
}, function (props) {
  return props.theme.panelToggleBottomPadding;
}, function (props) {
  return props.theme.panelTabWidth;
}, function (props) {
  return props.theme.textColorHl;
});

exports.StyledPanelTab = StyledPanelTab;

function PanelTabFactory() {
  var PanelTab = function PanelTab(_ref) {
    var isActive = _ref.isActive,
        onClick = _ref.onClick,
        panel = _ref.panel;
    return /*#__PURE__*/_react["default"].createElement(StyledPanelTab, {
      "data-tip": true,
      "data-for": "".concat(panel.id, "-nav"),
      active: isActive,
      onClick: onClick
    }, /*#__PURE__*/_react["default"].createElement(panel.iconComponent, {
      height: "20px"
    }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
      id: "".concat(panel.id, "-nav"),
      effect: "solid",
      delayShow: 500,
      place: "bottom"
    }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: panel.label || panel.id
    }))));
  };

  return PanelTab;
}

var _default = PanelTabFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtdGFiLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFBhbmVsVGFiIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsImFjdGl2ZSIsInRoZW1lIiwicGFuZWxUb2dnbGVCb3JkZXJDb2xvciIsInN1YnRleHRDb2xvckFjdGl2ZSIsInBhbmVsVGFiQ29sb3IiLCJwYW5lbFRvZ2dsZU1hcmdpblJpZ2h0IiwicGFuZWxUb2dnbGVCb3R0b21QYWRkaW5nIiwicGFuZWxUYWJXaWR0aCIsInRleHRDb2xvckhsIiwiUGFuZWxUYWJGYWN0b3J5IiwiUGFuZWxUYWIiLCJpc0FjdGl2ZSIsIm9uQ2xpY2siLCJwYW5lbCIsImlkIiwibGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sSUFBTUEsY0FBYyxHQUFHQyw2QkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQzdDQyxFQUFBQSxTQUFTLEVBQUU7QUFEa0MsQ0FBakIsQ0FBSCwwWUFNRixVQUFBQyxLQUFLO0FBQUEsU0FDMUJBLEtBQUssQ0FBQ0MsTUFBTixHQUFlRCxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsc0JBQTNCLEdBQW9ELGFBRDFCO0FBQUEsQ0FOSCxFQVFoQixVQUFBSCxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDQyxNQUFOLEdBQWVELEtBQUssQ0FBQ0UsS0FBTixDQUFZRSxrQkFBM0IsR0FBZ0RKLEtBQUssQ0FBQ0UsS0FBTixDQUFZRyxhQUFqRTtBQUFBLENBUlcsRUFXVCxVQUFBTCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDRSxLQUFOLENBQVlJLHNCQUFoQjtBQUFBLENBWEksRUFZUCxVQUFBTixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDRSxLQUFOLENBQVlLLHdCQUFoQjtBQUFBLENBWkUsRUFhaEIsVUFBQVAsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZTSxhQUFoQjtBQUFBLENBYlcsRUFpQmQsVUFBQVIsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZTyxXQUFoQjtBQUFBLENBakJTLENBQXBCOzs7O0FBcUJBLFNBQVNDLGVBQVQsR0FBMkI7QUFDaEMsTUFBTUMsUUFBUSxHQUFHLFNBQVhBLFFBQVc7QUFBQSxRQUFFQyxRQUFGLFFBQUVBLFFBQUY7QUFBQSxRQUFZQyxPQUFaLFFBQVlBLE9BQVo7QUFBQSxRQUFxQkMsS0FBckIsUUFBcUJBLEtBQXJCO0FBQUEsd0JBQ2YsZ0NBQUMsY0FBRDtBQUFnQixzQkFBaEI7QUFBeUIsNEJBQWFBLEtBQUssQ0FBQ0MsRUFBbkIsU0FBekI7QUFBc0QsTUFBQSxNQUFNLEVBQUVILFFBQTlEO0FBQXdFLE1BQUEsT0FBTyxFQUFFQztBQUFqRixvQkFDRSxnQ0FBQyxLQUFELENBQU8sYUFBUDtBQUFxQixNQUFBLE1BQU0sRUFBQztBQUE1QixNQURGLGVBRUUsZ0NBQUMsMEJBQUQ7QUFBUyxNQUFBLEVBQUUsWUFBS0MsS0FBSyxDQUFDQyxFQUFYLFNBQVg7QUFBZ0MsTUFBQSxNQUFNLEVBQUMsT0FBdkM7QUFBK0MsTUFBQSxTQUFTLEVBQUUsR0FBMUQ7QUFBK0QsTUFBQSxLQUFLLEVBQUM7QUFBckUsb0JBQ0UsMkRBQ0UsZ0NBQUMsOEJBQUQ7QUFBa0IsTUFBQSxFQUFFLEVBQUVELEtBQUssQ0FBQ0UsS0FBTixJQUFlRixLQUFLLENBQUNDO0FBQTNDLE1BREYsQ0FERixDQUZGLENBRGU7QUFBQSxHQUFqQjs7QUFXQSxTQUFPSixRQUFQO0FBQ0Q7O2VBRWNELGUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuZXhwb3J0IGNvbnN0IFN0eWxlZFBhbmVsVGFiID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWxfX3RhYidcbn0pYFxuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xuICBib3JkZXItYm90dG9tLXdpZHRoOiAycHg7XG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS5wYW5lbFRvZ2dsZUJvcmRlckNvbG9yIDogJ3RyYW5zcGFyZW50J307XG4gIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JBY3RpdmUgOiBwcm9wcy50aGVtZS5wYW5lbFRhYkNvbG9yKX07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW4tcmlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxUb2dnbGVNYXJnaW5SaWdodH1weDtcbiAgcGFkZGluZy1ib3R0b206ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxUb2dnbGVCb3R0b21QYWRkaW5nfXB4O1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbFRhYldpZHRofTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBQYW5lbFRhYkZhY3RvcnkoKSB7XG4gIGNvbnN0IFBhbmVsVGFiID0gKHtpc0FjdGl2ZSwgb25DbGljaywgcGFuZWx9KSA9PiAoXG4gICAgPFN0eWxlZFBhbmVsVGFiIGRhdGEtdGlwIGRhdGEtZm9yPXtgJHtwYW5lbC5pZH0tbmF2YH0gYWN0aXZlPXtpc0FjdGl2ZX0gb25DbGljaz17b25DbGlja30+XG4gICAgICA8cGFuZWwuaWNvbkNvbXBvbmVudCBoZWlnaHQ9XCIyMHB4XCIgLz5cbiAgICAgIDxUb29sdGlwIGlkPXtgJHtwYW5lbC5pZH0tbmF2YH0gZWZmZWN0PVwic29saWRcIiBkZWxheVNob3c9ezUwMH0gcGxhY2U9XCJib3R0b21cIj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e3BhbmVsLmxhYmVsIHx8IHBhbmVsLmlkfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgPC9TdHlsZWRQYW5lbFRhYj5cbiAgKTtcblxuICByZXR1cm4gUGFuZWxUYWI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsVGFiRmFjdG9yeTtcbiJdfQ==