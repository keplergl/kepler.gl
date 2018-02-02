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

var Clock = _react2.default.createClass({
  displayName: 'Clock',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-clock'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M41.68,41.16l-11.36-5a3,3,0,0,1-1.74-3L29.86,19h3l1.48,13.29,8.86,5.91Z' }),
      _react2.default.createElement('path', { d: 'M32.21,11.7A20.06,20.06,0,1,1,12.15,31.77,20.09,20.09,0,0,1,32.21,11.7m0-3.65A23.71,23.71,0,1,0,55.92,31.77,23.71,23.71,0,0,0,32.21,8.06Z' })
    );
  }
});

exports.default = Clock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jbG9jay5qcyJdLCJuYW1lcyI6WyJDbG9jayIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxnQkFBTUMsV0FBTixDQUFrQjtBQUM5QkMsZUFBYSxPQURpQjtBQUU5QkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGbUI7QUFNOUJDLGlCQU44Qiw2QkFNWjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsTUFESDtBQUVMRywyQkFBcUI7QUFGaEIsS0FBUDtBQUlELEdBWDZCO0FBWTlCQyxRQVo4QixvQkFZckI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0UsOENBQU0sR0FBRSx5RUFBUixHQURGO0FBRUUsOENBQU0sR0FBRSwySUFBUjtBQUZGLEtBREY7QUFNRDtBQW5CNkIsQ0FBbEIsQ0FBZDs7a0JBc0JlVCxLIiwiZmlsZSI6ImNsb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBDbG9jayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdDbG9jaycsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogJzE2cHgnLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtY2xvY2snXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNDEuNjgsNDEuMTZsLTExLjM2LTVhMywzLDAsMCwxLTEuNzQtM0wyOS44NiwxOWgzbDEuNDgsMTMuMjksOC44Niw1LjkxWlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMzIuMjEsMTEuN0EyMC4wNiwyMC4wNiwwLDEsMSwxMi4xNSwzMS43NywyMC4wOSwyMC4wOSwwLDAsMSwzMi4yMSwxMS43bTAtMy42NUEyMy43MSwyMy43MSwwLDEsMCw1NS45MiwzMS43NywyMy43MSwyMy43MSwwLDAsMCwzMi4yMSw4LjA2WlwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENsb2NrO1xuIl19