'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('../common/styled-components');

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SideNav = function SideNav(itemProps) {
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)('side-navi', { collapsed: itemProps.isCollapsed }) },
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'ul',
        null,
        _defaultSettings.PANELS.map(function (item) {
          return _react2.default.createElement(NavItem, (0, _extends3.default)({}, itemProps, { key: item.id, item: item }));
        })
      )
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'ul',
        null,
        _defaultSettings.PANELS_FOOTER.map(function (item) {
          return _react2.default.createElement(NavItem, (0, _extends3.default)({}, itemProps, { key: item.id, item: item }));
        })
      )
    )
  );
};

var NavItem = function NavItem(_ref) {
  var activePanel = _ref.activePanel,
      item = _ref.item,
      isCollapsed = _ref.isCollapsed,
      togglePanel = _ref.togglePanel;
  return _react2.default.createElement(
    'li',
    {
      className: (0, _classnames2.default)('side-navi__item', { active: activePanel === item.id }),
      onClick: function onClick() {
        return togglePanel(item.id);
      }
    },
    _react2.default.createElement(
      'a',
      { className: 'hover align--middle', 'data-tip': true, 'data-for': item.id + '-nav' },
      _react2.default.createElement('span', { className: 'icon icon_' + item.icon }),
      isCollapsed ? _react2.default.createElement(
        _styledComponents.Tooltip,
        {
          id: item.id + '-nav',
          effect: 'solid',
          delayShow: 500,
          place: 'right'
        },
        _react2.default.createElement(
          'span',
          null,
          item.label
        )
      ) : _react2.default.createElement(
        'span',
        { className: 'side-navi__item__title' },
        item.label
      )
    )
  );
};

exports.default = SideNav;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc2lkZS1uYXYuanMiXSwibmFtZXMiOlsiU2lkZU5hdiIsImNvbGxhcHNlZCIsIml0ZW1Qcm9wcyIsImlzQ29sbGFwc2VkIiwibWFwIiwiaXRlbSIsImlkIiwiTmF2SXRlbSIsImFjdGl2ZVBhbmVsIiwidG9nZ2xlUGFuZWwiLCJhY3RpdmUiLCJpY29uIiwibGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxVQUFVLFNBQVZBLE9BQVU7QUFBQSxTQUNkO0FBQUE7QUFBQSxNQUFLLFdBQVcsMEJBQVcsV0FBWCxFQUF3QixFQUFDQyxXQUFXQyxVQUFVQyxXQUF0QixFQUF4QixDQUFoQjtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNHLGdDQUFPQyxHQUFQLENBQVc7QUFBQSxpQkFDViw4QkFBQyxPQUFELDZCQUFhRixTQUFiLElBQXdCLEtBQUtHLEtBQUtDLEVBQWxDLEVBQXNDLE1BQU1ELElBQTVDLElBRFU7QUFBQSxTQUFYO0FBREg7QUFERixLQURGO0FBUUU7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0csdUNBQWNELEdBQWQsQ0FBa0I7QUFBQSxpQkFDakIsOEJBQUMsT0FBRCw2QkFBYUYsU0FBYixJQUF3QixLQUFLRyxLQUFLQyxFQUFsQyxFQUFzQyxNQUFNRCxJQUE1QyxJQURpQjtBQUFBLFNBQWxCO0FBREg7QUFERjtBQVJGLEdBRGM7QUFBQSxDQUFoQjs7QUFtQkEsSUFBTUUsVUFBVSxTQUFWQSxPQUFVO0FBQUEsTUFBRUMsV0FBRixRQUFFQSxXQUFGO0FBQUEsTUFBZUgsSUFBZixRQUFlQSxJQUFmO0FBQUEsTUFBcUJGLFdBQXJCLFFBQXFCQSxXQUFyQjtBQUFBLE1BQWtDTSxXQUFsQyxRQUFrQ0EsV0FBbEM7QUFBQSxTQUNkO0FBQUE7QUFBQTtBQUNFLGlCQUFXLDBCQUFXLGlCQUFYLEVBQThCLEVBQUNDLFFBQVFGLGdCQUFnQkgsS0FBS0MsRUFBOUIsRUFBOUIsQ0FEYjtBQUVFLGVBQVM7QUFBQSxlQUFNRyxZQUFZSixLQUFLQyxFQUFqQixDQUFOO0FBQUE7QUFGWDtBQUlFO0FBQUE7QUFBQSxRQUFHLFdBQVUscUJBQWIsRUFBbUMsZ0JBQW5DLEVBQTRDLFlBQWFELEtBQUtDLEVBQWxCLFNBQTVDO0FBQ0UsOENBQU0sMEJBQXdCRCxLQUFLTSxJQUFuQyxHQURGO0FBRUdSLG9CQUNDO0FBQUE7QUFBQTtBQUNFLGNBQU9FLEtBQUtDLEVBQVosU0FERjtBQUVFLGtCQUFPLE9BRlQ7QUFHRSxxQkFBVyxHQUhiO0FBSUUsaUJBQU07QUFKUjtBQU1FO0FBQUE7QUFBQTtBQUFPRCxlQUFLTztBQUFaO0FBTkYsT0FERCxHQVVDO0FBQUE7QUFBQSxVQUFNLFdBQVUsd0JBQWhCO0FBQTBDUCxhQUFLTztBQUEvQztBQVpKO0FBSkYsR0FEYztBQUFBLENBQWhCOztrQkF1QmVaLE8iLCJmaWxlIjoic2lkZS1uYXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7UEFORUxTLCBQQU5FTFNfRk9PVEVSfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IFNpZGVOYXYgPSBpdGVtUHJvcHMgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnc2lkZS1uYXZpJywge2NvbGxhcHNlZDogaXRlbVByb3BzLmlzQ29sbGFwc2VkfSl9PlxuICAgIDxkaXY+XG4gICAgICA8dWw+XG4gICAgICAgIHtQQU5FTFMubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgIDxOYXZJdGVtIHsuLi5pdGVtUHJvcHN9IGtleT17aXRlbS5pZH0gaXRlbT17aXRlbX0gLz5cbiAgICAgICAgKSl9XG4gICAgICA8L3VsPlxuICAgIDwvZGl2PlxuICAgIDxkaXY+XG4gICAgICA8dWw+XG4gICAgICAgIHtQQU5FTFNfRk9PVEVSLm1hcChpdGVtID0+IChcbiAgICAgICAgICA8TmF2SXRlbSB7Li4uaXRlbVByb3BzfSBrZXk9e2l0ZW0uaWR9IGl0ZW09e2l0ZW19IC8+XG4gICAgICAgICkpfVxuICAgICAgPC91bD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBOYXZJdGVtID0gKHthY3RpdmVQYW5lbCwgaXRlbSwgaXNDb2xsYXBzZWQsIHRvZ2dsZVBhbmVsfSkgPT4gKFxuICA8bGlcbiAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3NpZGUtbmF2aV9faXRlbScsIHthY3RpdmU6IGFjdGl2ZVBhbmVsID09PSBpdGVtLmlkfSl9XG4gICAgb25DbGljaz17KCkgPT4gdG9nZ2xlUGFuZWwoaXRlbS5pZCl9XG4gID5cbiAgICA8YSBjbGFzc05hbWU9XCJob3ZlciBhbGlnbi0tbWlkZGxlXCIgZGF0YS10aXAgZGF0YS1mb3I9e2Ake2l0ZW0uaWR9LW5hdmB9PlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBpY29uXyR7aXRlbS5pY29ufWB9IC8+XG4gICAgICB7aXNDb2xsYXBzZWQgPyAoXG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgaWQ9e2Ake2l0ZW0uaWR9LW5hdmB9XG4gICAgICAgICAgZWZmZWN0PVwic29saWRcIlxuICAgICAgICAgIGRlbGF5U2hvdz17NTAwfVxuICAgICAgICAgIHBsYWNlPVwicmlnaHRcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+e2l0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICApIDogKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzaWRlLW5hdmlfX2l0ZW1fX3RpdGxlXCI+e2l0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgKX1cbiAgICA8L2E+XG4gIDwvbGk+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBTaWRlTmF2O1xuIl19