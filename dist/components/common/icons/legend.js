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

var Legend = _react2.default.createClass({
  displayName: 'Legend',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-legend'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M29.78,45.89v5.56H46.44V45.89Zm-11.11,0v5.56h5.56V45.89ZM29.78,34.78v5.56H46.44V34.78Zm-11.11,0v5.56h5.56V34.78ZM29.78,23.67v5.56H46.44V23.67Zm-11.11,0v5.56h5.56V23.67ZM29.78,12.56v5.56H46.44V12.56Zm-11.11,0v5.56h5.56V12.56ZM15.89,7H49.22A2.78,2.78,0,0,1,52,9.78V54.22A2.78,2.78,0,0,1,49.22,57H15.89a2.78,2.78,0,0,1-2.78-2.78V9.78A2.78,2.78,0,0,1,15.89,7Z' })
    );
  }
});

exports.default = Legend;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9sZWdlbmQuanMiXSwibmFtZXMiOlsiTGVnZW5kIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLGdCQUFNQyxXQUFOLENBQWtCO0FBQy9CQyxlQUFhLFFBRGtCO0FBRS9CQyxhQUFXO0FBQ1Q7QUFDQUMsWUFBUSxvQkFBVUM7QUFGVCxHQUZvQjtBQU0vQkMsaUJBTitCLDZCQU1iO0FBQ2hCLFdBQU87QUFDTEYsY0FBUSxNQURIO0FBRUxHLDJCQUFxQjtBQUZoQixLQUFQO0FBSUQsR0FYOEI7QUFZL0JDLFFBWitCLG9CQVl0QjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRSw4Q0FBTSxHQUFFLHFXQUFSO0FBREYsS0FERjtBQUtEO0FBbEI4QixDQUFsQixDQUFmOztrQkFxQmVULE0iLCJmaWxlIjoibGVnZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBMZWdlbmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTGVnZW5kJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1sZWdlbmQnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjkuNzgsNDUuODl2NS41Nkg0Ni40NFY0NS44OVptLTExLjExLDB2NS41Nmg1LjU2VjQ1Ljg5Wk0yOS43OCwzNC43OHY1LjU2SDQ2LjQ0VjM0Ljc4Wm0tMTEuMTEsMHY1LjU2aDUuNTZWMzQuNzhaTTI5Ljc4LDIzLjY3djUuNTZINDYuNDRWMjMuNjdabS0xMS4xMSwwdjUuNTZoNS41NlYyMy42N1pNMjkuNzgsMTIuNTZ2NS41Nkg0Ni40NFYxMi41NlptLTExLjExLDB2NS41Nmg1LjU2VjEyLjU2Wk0xNS44OSw3SDQ5LjIyQTIuNzgsMi43OCwwLDAsMSw1Miw5Ljc4VjU0LjIyQTIuNzgsMi43OCwwLDAsMSw0OS4yMiw1N0gxNS44OWEyLjc4LDIuNzgsMCwwLDEtMi43OC0yLjc4VjkuNzhBMi43OCwyLjc4LDAsMCwxLDE1Ljg5LDdaXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTGVnZW5kO1xuIl19