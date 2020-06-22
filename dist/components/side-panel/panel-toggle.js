"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _styledComponents2 = require("../common/styled-components");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: flex-end;\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: ", ";\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  margin-right: 12px;\n  padding-bottom: 6px;\n  width: 30px;\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 0 16px;\n  display: flex;\n  min-height: 30px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var propTypes = {
  panels: _propTypes["default"].arrayOf(_propTypes["default"].object),
  activePanel: _propTypes["default"].string,
  togglePanel: _propTypes["default"].func
};

var PanelHeaderBottom = _styledComponents["default"].div.attrs({
  className: 'side-side-panel__header__bottom'
})(_templateObject(), function (props) {
  return props.theme.sidePanelHeaderBg;
});

var PanelTab = _styledComponents["default"].div.attrs({
  className: 'side-panel__tab'
})(_templateObject2(), function (props) {
  return props.active ? props.theme.subtextColorActive : 'transparent';
}, function (props) {
  return props.active ? props.theme.subtextColorActive : props.theme.subtextColor;
}, function (props) {
  return props.theme.textColorHl;
});

var PanelToggleFactory = function PanelToggleFactory() {
  var PanelToggle = function PanelToggle(_ref) {
    var panels = _ref.panels,
        activePanel = _ref.activePanel,
        togglePanel = _ref.togglePanel;
    return _react["default"].createElement(PanelHeaderBottom, null, panels.map(function (panel) {
      return _react["default"].createElement(PanelTab, {
        key: panel.id,
        "data-tip": true,
        "data-for": "".concat(panel.id, "-nav"),
        active: activePanel === panel.id,
        onClick: function onClick() {
          return togglePanel(panel.id);
        }
      }, _react["default"].createElement(panel.iconComponent, {
        height: "20px"
      }), _react["default"].createElement(_styledComponents2.Tooltip, {
        id: "".concat(panel.id, "-nav"),
        effect: "solid",
        delayShow: 500,
        place: "bottom"
      }, _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: panel.label || panel.id
      }))));
    }));
  };

  PanelToggle.propTypes = propTypes;
  return PanelToggle;
};

var _default = PanelToggleFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtdG9nZ2xlLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsInBhbmVscyIsIlByb3BUeXBlcyIsImFycmF5T2YiLCJvYmplY3QiLCJhY3RpdmVQYW5lbCIsInN0cmluZyIsInRvZ2dsZVBhbmVsIiwiZnVuYyIsIlBhbmVsSGVhZGVyQm90dG9tIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsInRoZW1lIiwic2lkZVBhbmVsSGVhZGVyQmciLCJQYW5lbFRhYiIsImFjdGl2ZSIsInN1YnRleHRDb2xvckFjdGl2ZSIsInN1YnRleHRDb2xvciIsInRleHRDb2xvckhsIiwiUGFuZWxUb2dnbGVGYWN0b3J5IiwiUGFuZWxUb2dnbGUiLCJtYXAiLCJwYW5lbCIsImlkIiwibGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHO0FBQ2hCQyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUUsTUFBNUIsQ0FEUTtBQUVoQkMsRUFBQUEsV0FBVyxFQUFFSCxzQkFBVUksTUFGUDtBQUdoQkMsRUFBQUEsV0FBVyxFQUFFTCxzQkFBVU07QUFIUCxDQUFsQjs7QUFNQSxJQUFNQyxpQkFBaUIsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUN6Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRDhCLENBQWpCLENBQUgsb0JBR0QsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxpQkFBaEI7QUFBQSxDQUhKLENBQXZCOztBQVNBLElBQU1DLFFBQVEsR0FBR1AsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUNoQ0MsRUFBQUEsU0FBUyxFQUFFO0FBRHFCLENBQWpCLENBQUgscUJBTVcsVUFBQUMsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0ksTUFBTixHQUFlSixLQUFLLENBQUNDLEtBQU4sQ0FBWUksa0JBQTNCLEdBQWdELGFBQXJEO0FBQUEsQ0FOaEIsRUFPSCxVQUFBTCxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDSSxNQUFOLEdBQWVKLEtBQUssQ0FBQ0MsS0FBTixDQUFZSSxrQkFBM0IsR0FBZ0RMLEtBQUssQ0FBQ0MsS0FBTixDQUFZSyxZQUFqRTtBQUFBLENBUEYsRUFnQkQsVUFBQU4sS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZTSxXQUFoQjtBQUFBLENBaEJKLENBQWQ7O0FBb0JBLElBQU1DLGtCQUFrQixHQUFHLFNBQXJCQSxrQkFBcUIsR0FBTTtBQUMvQixNQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYztBQUFBLFFBQUV0QixNQUFGLFFBQUVBLE1BQUY7QUFBQSxRQUFVSSxXQUFWLFFBQVVBLFdBQVY7QUFBQSxRQUF1QkUsV0FBdkIsUUFBdUJBLFdBQXZCO0FBQUEsV0FDbEIsZ0NBQUMsaUJBQUQsUUFDR04sTUFBTSxDQUFDdUIsR0FBUCxDQUFXLFVBQUFDLEtBQUs7QUFBQSxhQUNmLGdDQUFDLFFBQUQ7QUFDRSxRQUFBLEdBQUcsRUFBRUEsS0FBSyxDQUFDQyxFQURiO0FBRUUsd0JBRkY7QUFHRSw4QkFBYUQsS0FBSyxDQUFDQyxFQUFuQixTQUhGO0FBSUUsUUFBQSxNQUFNLEVBQUVyQixXQUFXLEtBQUtvQixLQUFLLENBQUNDLEVBSmhDO0FBS0UsUUFBQSxPQUFPLEVBQUU7QUFBQSxpQkFBTW5CLFdBQVcsQ0FBQ2tCLEtBQUssQ0FBQ0MsRUFBUCxDQUFqQjtBQUFBO0FBTFgsU0FPRSxnQ0FBQyxLQUFELENBQU8sYUFBUDtBQUFxQixRQUFBLE1BQU0sRUFBQztBQUE1QixRQVBGLEVBUUUsZ0NBQUMsMEJBQUQ7QUFBUyxRQUFBLEVBQUUsWUFBS0QsS0FBSyxDQUFDQyxFQUFYLFNBQVg7QUFBZ0MsUUFBQSxNQUFNLEVBQUMsT0FBdkM7QUFBK0MsUUFBQSxTQUFTLEVBQUUsR0FBMUQ7QUFBK0QsUUFBQSxLQUFLLEVBQUM7QUFBckUsU0FDRSw4Q0FDRSxnQ0FBQywyQkFBRDtBQUFrQixRQUFBLEVBQUUsRUFBRUQsS0FBSyxDQUFDRSxLQUFOLElBQWVGLEtBQUssQ0FBQ0M7QUFBM0MsUUFERixDQURGLENBUkYsQ0FEZTtBQUFBLEtBQWhCLENBREgsQ0FEa0I7QUFBQSxHQUFwQjs7QUFxQkFILEVBQUFBLFdBQVcsQ0FBQ3ZCLFNBQVosR0FBd0JBLFNBQXhCO0FBQ0EsU0FBT3VCLFdBQVA7QUFDRCxDQXhCRDs7ZUEwQmVELGtCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBwYW5lbHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICBhY3RpdmVQYW5lbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdG9nZ2xlUGFuZWw6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBQYW5lbEhlYWRlckJvdHRvbSA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXNpZGUtcGFuZWxfX2hlYWRlcl9fYm90dG9tJ1xufSlgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsSGVhZGVyQmd9O1xuICBwYWRkaW5nOiAwIDE2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIG1pbi1oZWlnaHQ6IDMwcHg7XG5gO1xuXG5jb25zdCBQYW5lbFRhYiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsX190YWInXG59KWBcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWJvdHRvbS13aWR0aDogMnB4O1xuICBib3JkZXItYm90dG9tLWNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JBY3RpdmUgOiAndHJhbnNwYXJlbnQnKX07XG4gIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JBY3RpdmUgOiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3IpfTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbi1yaWdodDogMTJweDtcbiAgcGFkZGluZy1ib3R0b206IDZweDtcbiAgd2lkdGg6IDMwcHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5gO1xuXG5jb25zdCBQYW5lbFRvZ2dsZUZhY3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IFBhbmVsVG9nZ2xlID0gKHtwYW5lbHMsIGFjdGl2ZVBhbmVsLCB0b2dnbGVQYW5lbH0pID0+IChcbiAgICA8UGFuZWxIZWFkZXJCb3R0b20+XG4gICAgICB7cGFuZWxzLm1hcChwYW5lbCA9PiAoXG4gICAgICAgIDxQYW5lbFRhYlxuICAgICAgICAgIGtleT17cGFuZWwuaWR9XG4gICAgICAgICAgZGF0YS10aXBcbiAgICAgICAgICBkYXRhLWZvcj17YCR7cGFuZWwuaWR9LW5hdmB9XG4gICAgICAgICAgYWN0aXZlPXthY3RpdmVQYW5lbCA9PT0gcGFuZWwuaWR9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlUGFuZWwocGFuZWwuaWQpfVxuICAgICAgICA+XG4gICAgICAgICAgPHBhbmVsLmljb25Db21wb25lbnQgaGVpZ2h0PVwiMjBweFwiIC8+XG4gICAgICAgICAgPFRvb2x0aXAgaWQ9e2Ake3BhbmVsLmlkfS1uYXZgfSBlZmZlY3Q9XCJzb2xpZFwiIGRlbGF5U2hvdz17NTAwfSBwbGFjZT1cImJvdHRvbVwiPlxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtwYW5lbC5sYWJlbCB8fCBwYW5lbC5pZH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgIDwvUGFuZWxUYWI+XG4gICAgICApKX1cbiAgICA8L1BhbmVsSGVhZGVyQm90dG9tPlxuICApO1xuXG4gIFBhbmVsVG9nZ2xlLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiAgcmV0dXJuIFBhbmVsVG9nZ2xlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGFuZWxUb2dnbGVGYWN0b3J5O1xuIl19