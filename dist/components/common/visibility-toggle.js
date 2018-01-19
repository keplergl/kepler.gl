'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('../common/styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VisibilityToggle = function VisibilityToggle(_ref) {
  var id = _ref.id,
      isVisible = _ref.isVisible,
      _onClick = _ref.onClick;
  return _react2.default.createElement(
    'span',
    { className: 'layer--toggle' },
    _react2.default.createElement(
      'a',
      {
        className: 'hover align--middle',
        'data-tip': true,
        'data-for': 'show-' + id,
        onClick: function onClick(e) {
          return _onClick && _onClick(e);
        }
      },
      _react2.default.createElement('i', {
        className: (0, _classnames2.default)('icon visibility', {
          icon_eye: isVisible,
          'icon_eye-closed': !isVisible
        })
      }),
      _react2.default.createElement(
        _styledComponents.Tooltip,
        { id: 'show-' + id, effect: 'solid' },
        _react2.default.createElement(
          'span',
          null,
          isVisible ? 'hide' : 'show'
        )
      )
    )
  );
};

VisibilityToggle.propTypes = {
  id: _react2.default.PropTypes.string,
  isVisible: _react2.default.PropTypes.bool,
  onClick: _react2.default.PropTypes.func
};

exports.default = VisibilityToggle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi92aXNpYmlsaXR5LXRvZ2dsZS5qcyJdLCJuYW1lcyI6WyJWaXNpYmlsaXR5VG9nZ2xlIiwiaWQiLCJpc1Zpc2libGUiLCJvbkNsaWNrIiwiZSIsImljb25fZXllIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiYm9vbCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLG1CQUFtQixTQUFuQkEsZ0JBQW1CO0FBQUEsTUFBRUMsRUFBRixRQUFFQSxFQUFGO0FBQUEsTUFBTUMsU0FBTixRQUFNQSxTQUFOO0FBQUEsTUFBaUJDLFFBQWpCLFFBQWlCQSxPQUFqQjtBQUFBLFNBQ3ZCO0FBQUE7QUFBQSxNQUFNLFdBQVUsZUFBaEI7QUFDRTtBQUFBO0FBQUE7QUFDRSxtQkFBVSxxQkFEWjtBQUVFLHdCQUZGO0FBR0UsOEJBQWtCRixFQUhwQjtBQUlFLGlCQUFTO0FBQUEsaUJBQUtFLFlBQVdBLFNBQVFDLENBQVIsQ0FBaEI7QUFBQTtBQUpYO0FBTUU7QUFDRSxtQkFBVywwQkFBVyxpQkFBWCxFQUE4QjtBQUN2Q0Msb0JBQVVILFNBRDZCO0FBRXZDLDZCQUFtQixDQUFDQTtBQUZtQixTQUE5QjtBQURiLFFBTkY7QUFZRTtBQUFBO0FBQUEsVUFBUyxjQUFZRCxFQUFyQixFQUEyQixRQUFPLE9BQWxDO0FBQ0U7QUFBQTtBQUFBO0FBQU9DLHNCQUFZLE1BQVosR0FBcUI7QUFBNUI7QUFERjtBQVpGO0FBREYsR0FEdUI7QUFBQSxDQUF6Qjs7QUFxQkFGLGlCQUFpQk0sU0FBakIsR0FBNkI7QUFDM0JMLE1BQUksZ0JBQU1NLFNBQU4sQ0FBZ0JDLE1BRE87QUFFM0JOLGFBQVcsZ0JBQU1LLFNBQU4sQ0FBZ0JFLElBRkE7QUFHM0JOLFdBQVMsZ0JBQU1JLFNBQU4sQ0FBZ0JHO0FBSEUsQ0FBN0I7O2tCQU1lVixnQiIsImZpbGUiOiJ2aXNpYmlsaXR5LXRvZ2dsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7VG9vbHRpcH0gZnJvbSAnLi4vY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgVmlzaWJpbGl0eVRvZ2dsZSA9ICh7aWQsIGlzVmlzaWJsZSwgb25DbGlja30pID0+IChcbiAgPHNwYW4gY2xhc3NOYW1lPVwibGF5ZXItLXRvZ2dsZVwiPlxuICAgIDxhXG4gICAgICBjbGFzc05hbWU9XCJob3ZlciBhbGlnbi0tbWlkZGxlXCJcbiAgICAgIGRhdGEtdGlwXG4gICAgICBkYXRhLWZvcj17YHNob3ctJHtpZH1gfVxuICAgICAgb25DbGljaz17ZSA9PiBvbkNsaWNrICYmIG9uQ2xpY2soZSl9XG4gICAgPlxuICAgICAgPGlcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdpY29uIHZpc2liaWxpdHknLCB7XG4gICAgICAgICAgaWNvbl9leWU6IGlzVmlzaWJsZSxcbiAgICAgICAgICAnaWNvbl9leWUtY2xvc2VkJzogIWlzVmlzaWJsZVxuICAgICAgICB9KX1cbiAgICAgIC8+XG4gICAgICA8VG9vbHRpcCBpZD17YHNob3ctJHtpZH1gfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgICA8c3Bhbj57aXNWaXNpYmxlID8gJ2hpZGUnIDogJ3Nob3cnfTwvc3Bhbj5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICA8L2E+XG4gIDwvc3Bhbj5cbik7XG5cblZpc2liaWxpdHlUb2dnbGUucHJvcFR5cGVzID0ge1xuICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgaXNWaXNpYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFZpc2liaWxpdHlUb2dnbGU7XG4iXX0=