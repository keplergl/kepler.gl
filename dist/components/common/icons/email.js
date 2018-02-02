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

var Email = _react2.default.createClass({
  displayName: 'Email',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-email'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M23.85,23a1,1,0,0,1,.38.08,1,1,0,0,0-.76,0A1,1,0,0,1,23.85,23Z' }),
      _react2.default.createElement('path', { d: 'M8.35,24.41V47.18a3.37,3.37,0,0,0,3.37,3.37H52.2a3.37,3.37,0,0,0,3.37-3.37V24.41L32,37.9Z' }),
      _react2.default.createElement('path', { d: 'M55.57,16.82a3.37,3.37,0,0,0-3.37-3.37H11.72a3.37,3.37,0,0,0-3.37,3.37L32,30.31Z' })
    );
  }
});

// this export method must be used for generated documentation to work
exports.default = Email;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9lbWFpbC5qcyJdLCJuYW1lcyI6WyJFbWFpbCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxnQkFBTUMsV0FBTixDQUFrQjtBQUM5QkMsZUFBYSxPQURpQjtBQUU5QkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGbUI7QUFNOUJDLGlCQU44Qiw2QkFNWjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsTUFESDtBQUVMRywyQkFBcUI7QUFGaEIsS0FBUDtBQUlELEdBWDZCO0FBWTlCQyxRQVo4QixvQkFZckI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0UsOENBQU0sR0FBRSxnRUFBUixHQURGO0FBRUUsOENBQU0sR0FBRSwyRkFBUixHQUZGO0FBR0UsOENBQU0sR0FBRSxrRkFBUjtBQUhGLEtBREY7QUFPRDtBQXBCNkIsQ0FBbEIsQ0FBZDs7QUF1QkE7a0JBQ2VULEsiLCJmaWxlIjoiZW1haWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IEVtYWlsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0VtYWlsJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1lbWFpbCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk0yMy44NSwyM2ExLDEsMCwwLDEsLjM4LjA4LDEsMSwwLDAsMC0uNzYsMEExLDEsMCwwLDEsMjMuODUsMjNaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk04LjM1LDI0LjQxVjQ3LjE4YTMuMzcsMy4zNywwLDAsMCwzLjM3LDMuMzdINTIuMmEzLjM3LDMuMzcsMCwwLDAsMy4zNy0zLjM3VjI0LjQxTDMyLDM3LjlaXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk01NS41NywxNi44MmEzLjM3LDMuMzcsMCwwLDAtMy4zNy0zLjM3SDExLjcyYTMuMzcsMy4zNywwLDAsMC0zLjM3LDMuMzdMMzIsMzAuMzFaXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuLy8gdGhpcyBleHBvcnQgbWV0aG9kIG11c3QgYmUgdXNlZCBmb3IgZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24gdG8gd29ya1xuZXhwb3J0IGRlZmF1bHQgRW1haWw7XG4iXX0=