'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  padding: 0 16px;\n  display: flex;\n'], ['\n  background-color: ', ';\n  padding: 0 16px;\n  display: flex;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: ', ';\n  color: ', ';\n  display: flex;\n  height: 30px;\n  justify-content: center;\n  margin-right: 12px;\n  width: 30px;\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: ', ';\n  color: ', ';\n  display: flex;\n  height: 30px;\n  justify-content: center;\n  margin-right: 12px;\n  width: 30px;\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('../common/styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  panels: _propTypes2.default.array,
  activePanel: _propTypes2.default.string,
  togglePanel: _propTypes2.default.func
};

var PanelHeaderBottom = _styledComponents2.default.div.attrs({
  className: 'side-side-panel__header__bottom'
})(_templateObject, function (props) {
  return props.theme.sidePanelHeaderBg;
});

var PanelTab = _styledComponents2.default.div.attrs({
  className: 'side-panel__tab'
})(_templateObject2, function (props) {
  return props.active ? props.theme.subtextColorActive : 'transparent';
}, function (props) {
  return props.active ? props.theme.subtextColorActive : props.theme.subtextColor;
}, function (props) {
  return props.theme.textColorHl;
});

var PanelToggle = function PanelToggle(_ref) {
  var panels = _ref.panels,
      activePanel = _ref.activePanel,
      togglePanel = _ref.togglePanel;
  return _react2.default.createElement(
    PanelHeaderBottom,
    null,
    panels.map(function (panel) {
      return _react2.default.createElement(
        PanelTab,
        {
          key: panel.id,
          'data-tip': true,
          'data-for': panel.id + '-nav',
          active: activePanel === panel.id,
          onClick: function onClick() {
            return togglePanel(panel.id);
          }
        },
        _react2.default.createElement(panel.iconComponent, { height: '20px' }),
        _react2.default.createElement(
          _styledComponents3.Tooltip,
          {
            id: panel.id + '-nav',
            effect: 'solid',
            delayShow: 500,
            place: 'bottom'
          },
          _react2.default.createElement(
            'span',
            null,
            panel.label || panel.id
          )
        )
      );
    })
  );
};

PanelToggle.propTypes = propTypes;

exports.default = PanelToggle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtdG9nZ2xlLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsInBhbmVscyIsImFycmF5IiwiYWN0aXZlUGFuZWwiLCJzdHJpbmciLCJ0b2dnbGVQYW5lbCIsImZ1bmMiLCJQYW5lbEhlYWRlckJvdHRvbSIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsInNpZGVQYW5lbEhlYWRlckJnIiwiUGFuZWxUYWIiLCJhY3RpdmUiLCJzdWJ0ZXh0Q29sb3JBY3RpdmUiLCJzdWJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3JIbCIsIlBhbmVsVG9nZ2xlIiwibWFwIiwicGFuZWwiLCJpZCIsImxhYmVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxVQUFRLG9CQUFVQyxLQURGO0FBRWhCQyxlQUFhLG9CQUFVQyxNQUZQO0FBR2hCQyxlQUFhLG9CQUFVQztBQUhQLENBQWxCOztBQU1BLElBQU1DLG9CQUFvQiwyQkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQ3pDQyxhQUFXO0FBRDhCLENBQWpCLENBQXBCLGtCQUdnQjtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsaUJBQXJCO0FBQUEsQ0FIaEIsQ0FBTjs7QUFRQSxJQUFNQyxXQUFXLDJCQUFPTixHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDaENDLGFBQVc7QUFEcUIsQ0FBakIsQ0FBWCxtQkFLbUI7QUFBQSxTQUN2QkMsTUFBTUksTUFBTixHQUFlSixNQUFNQyxLQUFOLENBQVlJLGtCQUEzQixHQUFnRCxhQUR6QjtBQUFBLENBTG5CLEVBT0s7QUFBQSxTQUNUTCxNQUFNSSxNQUFOLEdBQWVKLE1BQU1DLEtBQU4sQ0FBWUksa0JBQTNCLEdBQWdETCxNQUFNQyxLQUFOLENBQVlLLFlBRG5EO0FBQUEsQ0FQTCxFQWlCTztBQUFBLFNBQVNOLE1BQU1DLEtBQU4sQ0FBWU0sV0FBckI7QUFBQSxDQWpCUCxDQUFOOztBQXFCQSxJQUFNQyxjQUFjLFNBQWRBLFdBQWM7QUFBQSxNQUFFbEIsTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUUsV0FBVixRQUFVQSxXQUFWO0FBQUEsTUFBdUJFLFdBQXZCLFFBQXVCQSxXQUF2QjtBQUFBLFNBQ2xCO0FBQUMscUJBQUQ7QUFBQTtBQUNHSixXQUFPbUIsR0FBUCxDQUFXO0FBQUEsYUFDVjtBQUFDLGdCQUFEO0FBQUE7QUFDRSxlQUFLQyxNQUFNQyxFQURiO0FBRUUsMEJBRkY7QUFHRSxzQkFBYUQsTUFBTUMsRUFBbkIsU0FIRjtBQUlFLGtCQUFRbkIsZ0JBQWdCa0IsTUFBTUMsRUFKaEM7QUFLRSxtQkFBUztBQUFBLG1CQUFNakIsWUFBWWdCLE1BQU1DLEVBQWxCLENBQU47QUFBQTtBQUxYO0FBT0Usc0NBQUMsS0FBRCxDQUFPLGFBQVAsSUFBcUIsUUFBTyxNQUE1QixHQVBGO0FBUUU7QUFBQTtBQUFBO0FBQ0UsZ0JBQU9ELE1BQU1DLEVBQWIsU0FERjtBQUVFLG9CQUFPLE9BRlQ7QUFHRSx1QkFBVyxHQUhiO0FBSUUsbUJBQU07QUFKUjtBQU1FO0FBQUE7QUFBQTtBQUFPRCxrQkFBTUUsS0FBTixJQUFlRixNQUFNQztBQUE1QjtBQU5GO0FBUkYsT0FEVTtBQUFBLEtBQVg7QUFESCxHQURrQjtBQUFBLENBQXBCOztBQXdCQUgsWUFBWW5CLFNBQVosR0FBd0JBLFNBQXhCOztrQkFFZW1CLFciLCJmaWxlIjoicGFuZWwtdG9nZ2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7VG9vbHRpcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHBhbmVsczogUHJvcFR5cGVzLmFycmF5LFxuICBhY3RpdmVQYW5lbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdG9nZ2xlUGFuZWw6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBQYW5lbEhlYWRlckJvdHRvbSA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXNpZGUtcGFuZWxfX2hlYWRlcl9fYm90dG9tJ1xufSlgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsSGVhZGVyQmd9O1xuICBwYWRkaW5nOiAwIDE2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG5gO1xuXG5jb25zdCBQYW5lbFRhYiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsX190YWInXG59KWBcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XG4gIGJvcmRlci1ib3R0b20td2lkdGg6IDJweDtcbiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogJHtwcm9wcyA9PlxuICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JBY3RpdmUgOiAndHJhbnNwYXJlbnQnfTtcbiAgY29sb3I6ICR7cHJvcHMgPT5cbiAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yQWN0aXZlIDogcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzMHB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xuICB3aWR0aDogMzBweDtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmNvbnN0IFBhbmVsVG9nZ2xlID0gKHtwYW5lbHMsIGFjdGl2ZVBhbmVsLCB0b2dnbGVQYW5lbH0pID0+IChcbiAgPFBhbmVsSGVhZGVyQm90dG9tPlxuICAgIHtwYW5lbHMubWFwKHBhbmVsID0+IChcbiAgICAgIDxQYW5lbFRhYlxuICAgICAgICBrZXk9e3BhbmVsLmlkfVxuICAgICAgICBkYXRhLXRpcFxuICAgICAgICBkYXRhLWZvcj17YCR7cGFuZWwuaWR9LW5hdmB9XG4gICAgICAgIGFjdGl2ZT17YWN0aXZlUGFuZWwgPT09IHBhbmVsLmlkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB0b2dnbGVQYW5lbChwYW5lbC5pZCl9XG4gICAgICA+XG4gICAgICAgIDxwYW5lbC5pY29uQ29tcG9uZW50IGhlaWdodD1cIjIwcHhcIiAvPlxuICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgIGlkPXtgJHtwYW5lbC5pZH0tbmF2YH1cbiAgICAgICAgICBlZmZlY3Q9XCJzb2xpZFwiXG4gICAgICAgICAgZGVsYXlTaG93PXs1MDB9XG4gICAgICAgICAgcGxhY2U9XCJib3R0b21cIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+e3BhbmVsLmxhYmVsIHx8IHBhbmVsLmlkfTwvc3Bhbj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgPC9QYW5lbFRhYj5cbiAgICApKX1cbiAgPC9QYW5lbEhlYWRlckJvdHRvbT5cbik7XG5cblBhbmVsVG9nZ2xlLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgUGFuZWxUb2dnbGU7XG4iXX0=