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

var LineChart = _react2.default.createClass({
  displayName: 'LineChart',
  propTypes: {
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M53.4647408,17.8549995L35.8387756,35.4809608L25.5911236,25.2333088L6.607347,44.2427025 l3.6122975,3.6122971l15.371479-15.3714752l10.2476521,10.2476501l21.2638779-21.2382584L53.4647408,17.8549995z' })
    );
  }
});

exports.default = LineChart;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9saW5lLWNoYXJ0LmpzIl0sIm5hbWVzIjpbIkxpbmVDaGFydCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZLGdCQUFNQyxXQUFOLENBQWtCO0FBQ2xDQyxlQUFhLFdBRHFCO0FBRWxDQyxhQUFXO0FBQ1RDLFlBQVEsb0JBQVVDO0FBRFQsR0FGdUI7QUFLbENDLGlCQUxrQyw2QkFLaEI7QUFDaEIsV0FBTztBQUNMRixjQUFRO0FBREgsS0FBUDtBQUdELEdBVGlDO0FBVWxDRyxRQVZrQyxvQkFVekI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0UsOENBQU0sR0FBRSxxTUFBUjtBQURGLEtBREY7QUFNRDtBQWpCaUMsQ0FBbEIsQ0FBbEI7O2tCQW9CZVIsUyIsImZpbGUiOiJsaW5lLWNoYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBMaW5lQ2hhcnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTGluZUNoYXJ0JyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk01My40NjQ3NDA4LDE3Ljg1NDk5OTVMMzUuODM4Nzc1NiwzNS40ODA5NjA4TDI1LjU5MTEyMzYsMjUuMjMzMzA4OEw2LjYwNzM0Nyw0NC4yNDI3MDI1XG5cdGwzLjYxMjI5NzUsMy42MTIyOTcxbDE1LjM3MTQ3OS0xNS4zNzE0NzUybDEwLjI0NzY1MjEsMTAuMjQ3NjUwMWwyMS4yNjM4Nzc5LTIxLjIzODI1ODRMNTMuNDY0NzQwOCwxNy44NTQ5OTk1elwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExpbmVDaGFydDtcbiJdfQ==