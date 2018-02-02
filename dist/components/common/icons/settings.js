'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Settings = _react2.default.createClass({
  displayName: 'Settings',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-settings'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement(
        'g',
        { transform: 'translate(3, 4) scale(0.9, 0.9)' },
        _react2.default.createElement('path', { d: 'M32.2,52.32a6.24,6.24,0,0,0,12.09,0h9.56a1.56,1.56,0,0,0,0-3.12H44.29a6.24,6.24,0,0,0-12.09,0h-22a1.56,1.56,0,0,0,0,3.12ZM16.59,33.59a6.24,6.24,0,0,0,12.09,0H53.85a1.56,1.56,0,0,0,0-3.12H28.68a6.24,6.24,0,0,0-12.09,0H10.15a1.56,1.56,0,1,0,0,3.12ZM35.32,11.74H10.15a1.56,1.56,0,1,0,0,3.12H35.32a6.24,6.24,0,0,0,12.09,0h6.44a1.56,1.56,0,0,0,0-3.12H47.41a6.24,6.24,0,0,0-12.09,0Z' })
      )
    );
  }
});

exports.default = Settings;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJTZXR0aW5ncyIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxnQkFBTUMsV0FBTixDQUFrQjtBQUNqQ0MsZUFBYSxVQURvQjtBQUVqQ0MsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGc0I7QUFNakNDLGlCQU5pQyw2QkFNZjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsTUFESDtBQUVMRywyQkFBcUI7QUFGaEIsS0FBUDtBQUlELEdBWGdDO0FBWWpDQyxRQVppQyxvQkFZeEI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQUcsV0FBVSxpQ0FBYjtBQUNFLGdEQUFNLEdBQUUsMFhBQVI7QUFERjtBQURGLEtBREY7QUFPRDtBQXBCZ0MsQ0FBbEIsQ0FBakI7O2tCQXVCZVQsUSIsImZpbGUiOiJzZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgU2V0dGluZ3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2V0dGluZ3MnLFxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLXNldHRpbmdzJ1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMywgNCkgc2NhbGUoMC45LCAwLjkpXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0zMi4yLDUyLjMyYTYuMjQsNi4yNCwwLDAsMCwxMi4wOSwwaDkuNTZhMS41NiwxLjU2LDAsMCwwLDAtMy4xMkg0NC4yOWE2LjI0LDYuMjQsMCwwLDAtMTIuMDksMGgtMjJhMS41NiwxLjU2LDAsMCwwLDAsMy4xMlpNMTYuNTksMzMuNTlhNi4yNCw2LjI0LDAsMCwwLDEyLjA5LDBINTMuODVhMS41NiwxLjU2LDAsMCwwLDAtMy4xMkgyOC42OGE2LjI0LDYuMjQsMCwwLDAtMTIuMDksMEgxMC4xNWExLjU2LDEuNTYsMCwxLDAsMCwzLjEyWk0zNS4zMiwxMS43NEgxMC4xNWExLjU2LDEuNTYsMCwxLDAsMCwzLjEySDM1LjMyYTYuMjQsNi4yNCwwLDAsMCwxMi4wOSwwaDYuNDRhMS41NiwxLjU2LDAsMCwwLDAtMy4xMkg0Ny40MWE2LjI0LDYuMjQsMCwwLDAtMTIuMDksMFpcIiAvPlxuICAgICAgICA8L2c+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzO1xuIl19