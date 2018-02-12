'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  padding: 12px 16px 0 16px;\n'], ['\n  background-color: ', ';\n  padding: 12px 16px 0 16px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 16px;\n  width: 100%;\n'], ['\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 16px;\n  width: 100%;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n'], ['\n  display: flex;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  align-items: center;\n  border-radius: 2px;\n  color: ', ';\n  display: flex;\n  height: 26px;\n  justify-content: center;\n  margin-left: 4px;\n  width: 26px;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n'], ['\n  align-items: center;\n  border-radius: 2px;\n  color: ', ';\n  display: flex;\n  height: 26px;\n  justify-content: center;\n  margin-left: 4px;\n  width: 26px;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents3 = require('../common/styled-components');

var _logo = require('../common/logo');

var _logo2 = _interopRequireDefault(_logo);

var _icons = require('../common/icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledPanelHeader = _styledComponents2.default.div.attrs({
  className: 'side-side-panel__header'
})(_templateObject, function (props) {
  return props.theme.sidePanelHeaderBg;
});

var StyledPanelHeaderTop = _styledComponents2.default.div.attrs({
  className: 'side-panel__header__top'
})(_templateObject2);

var StyledPanelTopActions = _styledComponents2.default.div.attrs({
  className: 'side-panel__header__actions'
})(_templateObject3);

var StyledPanelAction = _styledComponents2.default.div.attrs({
  className: 'side-panel__header__actions'
})(_templateObject4, function (props) {
  return props.active ? props.theme.textColorHl : props.theme.subtextColor;
}, function (props) {
  return props.theme.secondaryBtnActBgd;
}, function (props) {
  return props.theme.textColorHl;
});

var defaultActionItems = [{
  id: 'email',
  iconComponent: _icons.Email,
  tooltip: 'Email us',
  onClick: function onClick() {}
}, {
  id: 'docs',
  iconComponent: _icons.Docs,
  tooltip: 'Documentation',
  onClick: function onClick() {}
}, {
  id: 'save',
  iconComponent: _icons.Save,
  tooltip: 'Save / Export',
  onClick: function onClick() {}
}];

var defaultProps = {
  logoComponent: _logo2.default,
  actionItems: defaultActionItems
};

var propTypes = {
  logoComponent: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  actionItems: _propTypes2.default.array
};

var PanelAction = function PanelAction(_ref) {
  var item = _ref.item;
  return _react2.default.createElement(
    StyledPanelAction,
    {
      'data-tip': true,
      'data-for': item.id + '-action'
    },
    _react2.default.createElement(item.iconComponent, { height: '20px' }),
    _react2.default.createElement(
      _styledComponents3.Tooltip,
      {
        id: item.id + '-action',
        place: 'bottom',
        delayShow: 500,
        effect: 'solid'
      },
      _react2.default.createElement(
        'span',
        null,
        item.tooltip
      )
    )
  );
};

var PanelHeader = function PanelHeader(props) {
  return _react2.default.createElement(
    StyledPanelHeader,
    null,
    _react2.default.createElement(
      StyledPanelHeaderTop,
      null,
      _react2.default.createElement(props.logoComponent, null),
      _react2.default.createElement(
        StyledPanelTopActions,
        null,
        props.actionItems.map(function (item) {
          return _react2.default.createElement(PanelAction, { key: item.id, item: item });
        })
      )
    )
  );
};

PanelHeader.defaultProps = defaultProps;
PanelHeader.propTypes = propTypes;

exports.default = PanelHeader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLmpzIl0sIm5hbWVzIjpbIlN0eWxlZFBhbmVsSGVhZGVyIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJwcm9wcyIsInRoZW1lIiwic2lkZVBhbmVsSGVhZGVyQmciLCJTdHlsZWRQYW5lbEhlYWRlclRvcCIsIlN0eWxlZFBhbmVsVG9wQWN0aW9ucyIsIlN0eWxlZFBhbmVsQWN0aW9uIiwiYWN0aXZlIiwidGV4dENvbG9ySGwiLCJzdWJ0ZXh0Q29sb3IiLCJzZWNvbmRhcnlCdG5BY3RCZ2QiLCJkZWZhdWx0QWN0aW9uSXRlbXMiLCJpZCIsImljb25Db21wb25lbnQiLCJ0b29sdGlwIiwib25DbGljayIsImRlZmF1bHRQcm9wcyIsImxvZ29Db21wb25lbnQiLCJhY3Rpb25JdGVtcyIsInByb3BUeXBlcyIsIm9uZU9mVHlwZSIsImVsZW1lbnQiLCJmdW5jIiwiYXJyYXkiLCJQYW5lbEFjdGlvbiIsIml0ZW0iLCJQYW5lbEhlYWRlciIsIm1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLG9CQUFvQiwyQkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQ3pDQyxhQUFXO0FBRDhCLENBQWpCLENBQXBCLGtCQUdnQjtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsaUJBQXJCO0FBQUEsQ0FIaEIsQ0FBTjs7QUFPQSxJQUFNQyx1QkFBdUIsMkJBQU9OLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUM1Q0MsYUFBVztBQURpQyxDQUFqQixDQUF2QixrQkFBTjs7QUFTQSxJQUFNSyx3QkFBd0IsMkJBQU9QLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUM3Q0MsYUFBVztBQURrQyxDQUFqQixDQUF4QixrQkFBTjs7QUFNQSxJQUFNTSxvQkFBb0IsMkJBQU9SLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUN6Q0MsYUFBVztBQUQ4QixDQUFqQixDQUFwQixtQkFLSztBQUFBLFNBQ1BDLE1BQU1NLE1BQU4sR0FBZU4sTUFBTUMsS0FBTixDQUFZTSxXQUEzQixHQUF5Q1AsTUFBTUMsS0FBTixDQUFZTyxZQUQ5QztBQUFBLENBTEwsRUFla0I7QUFBQSxTQUFTUixNQUFNQyxLQUFOLENBQVlRLGtCQUFyQjtBQUFBLENBZmxCLEVBZ0JPO0FBQUEsU0FBU1QsTUFBTUMsS0FBTixDQUFZTSxXQUFyQjtBQUFBLENBaEJQLENBQU47O0FBb0JBLElBQU1HLHFCQUFxQixDQUN6QjtBQUNFQyxNQUFJLE9BRE47QUFFRUMsNkJBRkY7QUFHRUMsV0FBUyxVQUhYO0FBSUVDLFdBQVMsbUJBQU0sQ0FBRTtBQUpuQixDQUR5QixFQU96QjtBQUNFSCxNQUFJLE1BRE47QUFFRUMsNEJBRkY7QUFHRUMsV0FBUyxlQUhYO0FBSUVDLFdBQVMsbUJBQU0sQ0FBRTtBQUpuQixDQVB5QixFQWF6QjtBQUNFSCxNQUFJLE1BRE47QUFFRUMsNEJBRkY7QUFHRUMsV0FBUyxlQUhYO0FBSUVDLFdBQVMsbUJBQU0sQ0FBRTtBQUpuQixDQWJ5QixDQUEzQjs7QUFxQkEsSUFBTUMsZUFBZTtBQUNuQkMsK0JBRG1CO0FBRW5CQyxlQUFhUDtBQUZNLENBQXJCOztBQUtBLElBQU1RLFlBQVk7QUFDaEJGLGlCQUFlLG9CQUFVRyxTQUFWLENBQW9CLENBQUMsb0JBQVVDLE9BQVgsRUFBb0Isb0JBQVVDLElBQTlCLENBQXBCLENBREM7QUFFaEJKLGVBQWEsb0JBQVVLO0FBRlAsQ0FBbEI7O0FBS0EsSUFBTUMsY0FBYyxTQUFkQSxXQUFjO0FBQUEsTUFBRUMsSUFBRixRQUFFQSxJQUFGO0FBQUEsU0FDbEI7QUFBQyxxQkFBRDtBQUFBO0FBQ0Usc0JBREY7QUFFRSxrQkFBYUEsS0FBS2IsRUFBbEI7QUFGRjtBQUlFLGtDQUFDLElBQUQsQ0FBTSxhQUFOLElBQW9CLFFBQU8sTUFBM0IsR0FKRjtBQUtFO0FBQUE7QUFBQTtBQUNFLFlBQU9hLEtBQUtiLEVBQVosWUFERjtBQUVFLGVBQU0sUUFGUjtBQUdFLG1CQUFXLEdBSGI7QUFJRSxnQkFBTztBQUpUO0FBTUU7QUFBQTtBQUFBO0FBQU9hLGFBQUtYO0FBQVo7QUFORjtBQUxGLEdBRGtCO0FBQUEsQ0FBcEI7O0FBaUJBLElBQU1ZLGNBQWMsU0FBZEEsV0FBYyxDQUFDekIsS0FBRDtBQUFBLFNBQ2xCO0FBQUMscUJBQUQ7QUFBQTtBQUNFO0FBQUMsMEJBQUQ7QUFBQTtBQUNFLG9DQUFDLEtBQUQsQ0FBTyxhQUFQLE9BREY7QUFFRTtBQUFDLDZCQUFEO0FBQUE7QUFDR0EsY0FBTWlCLFdBQU4sQ0FBa0JTLEdBQWxCLENBQXNCO0FBQUEsaUJBQ3JCLDhCQUFDLFdBQUQsSUFBYSxLQUFLRixLQUFLYixFQUF2QixFQUEyQixNQUFNYSxJQUFqQyxHQURxQjtBQUFBLFNBQXRCO0FBREg7QUFGRjtBQURGLEdBRGtCO0FBQUEsQ0FBcEI7O0FBYUFDLFlBQVlWLFlBQVosR0FBMkJBLFlBQTNCO0FBQ0FVLFlBQVlQLFNBQVosR0FBd0JBLFNBQXhCOztrQkFFZU8sVyIsImZpbGUiOiJwYW5lbC1oZWFkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtUb29sdGlwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgS2VwbGVyR2xMb2dvIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2xvZ28nO1xuaW1wb3J0IHtFbWFpbCwgRG9jcywgU2F2ZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBTdHlsZWRQYW5lbEhlYWRlciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXNpZGUtcGFuZWxfX2hlYWRlcidcbn0pYFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbEhlYWRlckJnfTtcbiAgcGFkZGluZzogMTJweCAxNnB4IDAgMTZweDtcbmA7XG5cbmNvbnN0IFN0eWxlZFBhbmVsSGVhZGVyVG9wID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWxfX2hlYWRlcl9fdG9wJ1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgd2lkdGg6IDEwMCU7XG5gO1xuXG5jb25zdCBTdHlsZWRQYW5lbFRvcEFjdGlvbnMgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbF9faGVhZGVyX19hY3Rpb25zJ1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG5gO1xuXG5jb25zdCBTdHlsZWRQYW5lbEFjdGlvbiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsX19oZWFkZXJfX2FjdGlvbnMnXG59KWBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnRleHRDb2xvckhsIDogcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAyNnB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luLWxlZnQ6IDRweDtcbiAgd2lkdGg6IDI2cHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5BY3RCZ2R9O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuYDtcblxuY29uc3QgZGVmYXVsdEFjdGlvbkl0ZW1zID0gW1xuICB7XG4gICAgaWQ6ICdlbWFpbCcsXG4gICAgaWNvbkNvbXBvbmVudDogRW1haWwsXG4gICAgdG9vbHRpcDogJ0VtYWlsIHVzJyxcbiAgICBvbkNsaWNrOiAoKSA9PiB7fVxuICB9LFxuICB7XG4gICAgaWQ6ICdkb2NzJyxcbiAgICBpY29uQ29tcG9uZW50OiBEb2NzLFxuICAgIHRvb2x0aXA6ICdEb2N1bWVudGF0aW9uJyxcbiAgICBvbkNsaWNrOiAoKSA9PiB7fVxuICB9LFxuICB7XG4gICAgaWQ6ICdzYXZlJyxcbiAgICBpY29uQ29tcG9uZW50OiBTYXZlLFxuICAgIHRvb2x0aXA6ICdTYXZlIC8gRXhwb3J0JyxcbiAgICBvbkNsaWNrOiAoKSA9PiB7fVxuICB9XG5dO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGxvZ29Db21wb25lbnQ6IEtlcGxlckdsTG9nbyxcbiAgYWN0aW9uSXRlbXM6IGRlZmF1bHRBY3Rpb25JdGVtc1xufTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBsb2dvQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgYWN0aW9uSXRlbXM6IFByb3BUeXBlcy5hcnJheVxufTtcblxuY29uc3QgUGFuZWxBY3Rpb24gPSAoe2l0ZW19KSA9PiAoXG4gIDxTdHlsZWRQYW5lbEFjdGlvblxuICAgIGRhdGEtdGlwXG4gICAgZGF0YS1mb3I9e2Ake2l0ZW0uaWR9LWFjdGlvbmB9XG4gID5cbiAgICA8aXRlbS5pY29uQ29tcG9uZW50IGhlaWdodD1cIjIwcHhcIiAvPlxuICAgIDxUb29sdGlwXG4gICAgICBpZD17YCR7aXRlbS5pZH0tYWN0aW9uYH1cbiAgICAgIHBsYWNlPVwiYm90dG9tXCJcbiAgICAgIGRlbGF5U2hvdz17NTAwfVxuICAgICAgZWZmZWN0PVwic29saWRcIlxuICAgID5cbiAgICAgIDxzcGFuPntpdGVtLnRvb2x0aXB9PC9zcGFuPlxuICAgIDwvVG9vbHRpcD5cbiAgPC9TdHlsZWRQYW5lbEFjdGlvbj5cbik7XG5cbmNvbnN0IFBhbmVsSGVhZGVyID0gKHByb3BzKSA9PiAoXG4gIDxTdHlsZWRQYW5lbEhlYWRlcj5cbiAgICA8U3R5bGVkUGFuZWxIZWFkZXJUb3A+XG4gICAgICA8cHJvcHMubG9nb0NvbXBvbmVudC8+XG4gICAgICA8U3R5bGVkUGFuZWxUb3BBY3Rpb25zPlxuICAgICAgICB7cHJvcHMuYWN0aW9uSXRlbXMubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgIDxQYW5lbEFjdGlvbiBrZXk9e2l0ZW0uaWR9IGl0ZW09e2l0ZW19Lz5cbiAgICAgICAgKSl9XG4gICAgICA8L1N0eWxlZFBhbmVsVG9wQWN0aW9ucz5cbiAgICA8L1N0eWxlZFBhbmVsSGVhZGVyVG9wPlxuICA8L1N0eWxlZFBhbmVsSGVhZGVyPlxuKTtcblxuUGFuZWxIZWFkZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuUGFuZWxIZWFkZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBQYW5lbEhlYWRlcjtcbiJdfQ==