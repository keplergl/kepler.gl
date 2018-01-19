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

var Split = _react2.default.createClass({
  displayName: 'Split',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-split'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement(
        'g',
        { transform: 'translate(7.500000, 7.500000)' },
        _react2.default.createElement('path', { d: 'M19.5,47.4137931 C19.5,48.8421157 20.6192881,50 22,50 C23.3807119,50 24.5,48.8421157 24.5,47.4137931 L24.5,2.5862069 C24.5,1.15788427 23.3807119,0 22,0 C20.6192881,0 19.5,1.15788427 19.5,2.5862069 L19.5,47.4137931 Z' }),
        _react2.default.createElement('rect', { x: '0', y: '4', width: '44', height: '5', rx: '2.5' }),
        _react2.default.createElement('rect', {
          transform: 'translate(2.500000, 24.500000) rotate(90.000000) translate(-2.500000, -24.500000) ',
          x: '-18',
          y: '22',
          width: '41',
          height: '5',
          rx: '2.5'
        }),
        _react2.default.createElement('rect', {
          transform: 'translate(41.500000, 25.000000) rotate(90.000000) translate(-41.500000, -25.000000) ',
          x: '20.5',
          y: '22.5',
          width: '42',
          height: '5',
          rx: '2.5'
        }),
        _react2.default.createElement('rect', { x: '0', y: '41', width: '44', height: '5', rx: '2.5' })
      )
    );
  }
});

exports.default = Split;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zcGxpdC5qcyJdLCJuYW1lcyI6WyJTcGxpdCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxnQkFBTUMsV0FBTixDQUFrQjtBQUM5QkMsZUFBYSxPQURpQjtBQUU5QkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGbUI7QUFNOUJDLGlCQU44Qiw2QkFNWjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsSUFESDtBQUVMRywyQkFBcUI7QUFGaEIsS0FBUDtBQUlELEdBWDZCO0FBWTlCQyxRQVo4QixvQkFZckI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQUcsV0FBVSwrQkFBYjtBQUNFLGdEQUFNLEdBQUUseU5BQVIsR0FERjtBQUVFLGdEQUFNLEdBQUUsR0FBUixFQUFZLEdBQUUsR0FBZCxFQUFrQixPQUFNLElBQXhCLEVBQTZCLFFBQU8sR0FBcEMsRUFBd0MsSUFBRyxLQUEzQyxHQUZGO0FBR0U7QUFDRSxxQkFBVSxvRkFEWjtBQUVFLGFBQUUsS0FGSjtBQUdFLGFBQUUsSUFISjtBQUlFLGlCQUFNLElBSlI7QUFLRSxrQkFBTyxHQUxUO0FBTUUsY0FBRztBQU5MLFVBSEY7QUFXRTtBQUNFLHFCQUFVLHNGQURaO0FBRUUsYUFBRSxNQUZKO0FBR0UsYUFBRSxNQUhKO0FBSUUsaUJBQU0sSUFKUjtBQUtFLGtCQUFPLEdBTFQ7QUFNRSxjQUFHO0FBTkwsVUFYRjtBQW1CRSxnREFBTSxHQUFFLEdBQVIsRUFBWSxHQUFFLElBQWQsRUFBbUIsT0FBTSxJQUF6QixFQUE4QixRQUFPLEdBQXJDLEVBQXlDLElBQUcsS0FBNUM7QUFuQkY7QUFERixLQURGO0FBeUJEO0FBdEM2QixDQUFsQixDQUFkOztrQkF5Q2VULEsiLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IFNwbGl0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1NwbGl0JyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBudWxsLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtc3BsaXQnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg3LjUwMDAwMCwgNy41MDAwMDApXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xOS41LDQ3LjQxMzc5MzEgQzE5LjUsNDguODQyMTE1NyAyMC42MTkyODgxLDUwIDIyLDUwIEMyMy4zODA3MTE5LDUwIDI0LjUsNDguODQyMTE1NyAyNC41LDQ3LjQxMzc5MzEgTDI0LjUsMi41ODYyMDY5IEMyNC41LDEuMTU3ODg0MjcgMjMuMzgwNzExOSwwIDIyLDAgQzIwLjYxOTI4ODEsMCAxOS41LDEuMTU3ODg0MjcgMTkuNSwyLjU4NjIwNjkgTDE5LjUsNDcuNDEzNzkzMSBaXCIgLz5cbiAgICAgICAgICA8cmVjdCB4PVwiMFwiIHk9XCI0XCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjVcIiByeD1cIjIuNVwiIC8+XG4gICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgyLjUwMDAwMCwgMjQuNTAwMDAwKSByb3RhdGUoOTAuMDAwMDAwKSB0cmFuc2xhdGUoLTIuNTAwMDAwLCAtMjQuNTAwMDAwKSBcIlxuICAgICAgICAgICAgeD1cIi0xOFwiXG4gICAgICAgICAgICB5PVwiMjJcIlxuICAgICAgICAgICAgd2lkdGg9XCI0MVwiXG4gICAgICAgICAgICBoZWlnaHQ9XCI1XCJcbiAgICAgICAgICAgIHJ4PVwiMi41XCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNDEuNTAwMDAwLCAyNS4wMDAwMDApIHJvdGF0ZSg5MC4wMDAwMDApIHRyYW5zbGF0ZSgtNDEuNTAwMDAwLCAtMjUuMDAwMDAwKSBcIlxuICAgICAgICAgICAgeD1cIjIwLjVcIlxuICAgICAgICAgICAgeT1cIjIyLjVcIlxuICAgICAgICAgICAgd2lkdGg9XCI0MlwiXG4gICAgICAgICAgICBoZWlnaHQ9XCI1XCJcbiAgICAgICAgICAgIHJ4PVwiMi41XCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxyZWN0IHg9XCIwXCIgeT1cIjQxXCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjVcIiByeD1cIjIuNVwiIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU3BsaXQ7XG4iXX0=