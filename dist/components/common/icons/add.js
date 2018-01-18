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
      height: null,
      size: 'tiny',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9hZGQuanMiXSwibmFtZXMiOlsiQWRkIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInNpemUiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxnQkFBTUMsV0FBTixDQUFrQjtBQUM1QkMsZUFBYSxLQURlO0FBRTVCQyxhQUFXO0FBQ1Q7QUFDQUMsWUFBUSxvQkFBVUM7QUFGVCxHQUZpQjtBQU01QkMsaUJBTjRCLDZCQU1WO0FBQ2hCLFdBQU87QUFDTEYsY0FBUSxJQURIO0FBRUxHLFlBQU0sTUFGRDtBQUdMQywyQkFBcUI7QUFIaEIsS0FBUDtBQUtELEdBWjJCO0FBYTVCQyxRQWI0QixvQkFhbkI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBRUYsOENBQU0sR0FBRSx5TEFBUjtBQUZFLEtBREY7QUFPRDtBQXJCMkIsQ0FBbEIsQ0FBWjs7a0JBd0JlVixHIiwiZmlsZSI6ImFkZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBBZGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQWRkJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBudWxsLFxuICAgICAgc2l6ZTogJ3RpbnknLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtYWRkJ1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuXG4gICAgPHBhdGggZD1cIk0zNS45MywyOC41N1Y5Ljg5YTEsMSwwLDAsMC0xLTFoLTUuOWExLDEsMCwwLDAtMSwxVjI4LjU3SDkuMzlhMSwxLDAsMCwwLTEsMXY1LjlhMSwxLDAsMCwwLDEsMUgyOC4wN1Y1NS4xMWExLDEsMCwwLDAsMSwxaDUuOWExLDEsMCwwLDAsMS0xVjM2LjQzSDU0LjYxYTEsMSwwLDAsMCwxLTF2LTUuOWExLDEsMCwwLDAtMS0xWlwiLz5cblxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBZGQ7XG4iXX0=