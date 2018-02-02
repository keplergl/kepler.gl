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

var Add = _react2.default.createClass({
  displayName: 'Add',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-add'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M35.93,28.57V9.89a1,1,0,0,0-1-1h-5.9a1,1,0,0,0-1,1V28.57H9.39a1,1,0,0,0-1,1v5.9a1,1,0,0,0,1,1H28.07V55.11a1,1,0,0,0,1,1h5.9a1,1,0,0,0,1-1V36.43H54.61a1,1,0,0,0,1-1v-5.9a1,1,0,0,0-1-1Z' })
    );
  }
});

exports.default = Add;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9hZGQuanMiXSwibmFtZXMiOlsiQWRkIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNLGdCQUFNQyxXQUFOLENBQWtCO0FBQzVCQyxlQUFhLEtBRGU7QUFFNUJDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRmlCO0FBTTVCQyxpQkFONEIsNkJBTVY7QUFDaEIsV0FBTztBQUNMRixjQUFRLE1BREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVgyQjtBQVk1QkMsUUFaNEIsb0JBWW5CO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFLDhDQUFNLEdBQUUseUxBQVI7QUFERixLQURGO0FBS0Q7QUFsQjJCLENBQWxCLENBQVo7O2tCQXFCZVQsRyIsImZpbGUiOiJhZGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IEFkZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdBZGQnLFxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWFkZCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk0zNS45MywyOC41N1Y5Ljg5YTEsMSwwLDAsMC0xLTFoLTUuOWExLDEsMCwwLDAtMSwxVjI4LjU3SDkuMzlhMSwxLDAsMCwwLTEsMXY1LjlhMSwxLDAsMCwwLDEsMUgyOC4wN1Y1NS4xMWExLDEsMCwwLDAsMSwxaDUuOWExLDEsMCwwLDAsMS0xVjM2LjQzSDU0LjYxYTEsMSwwLDAsMCwxLTF2LTUuOWExLDEsMCwwLDAtMS0xWlwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFkZDtcbiJdfQ==