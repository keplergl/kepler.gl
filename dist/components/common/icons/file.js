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

var File = _react2.default.createClass({
  displayName: 'File',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-file'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M49.61,20.51,36.56,7.46a1.36,1.36,0,0,0-.32-.24,1.6,1.6,0,0,0-.39-.14,1.53,1.53,0,0,0-.26,0H15.38A1.39,1.39,0,0,0,14,8.45v47.1a1.39,1.39,0,0,0,1.39,1.39H48.63A1.39,1.39,0,0,0,50,55.55V21.48A1.4,1.4,0,0,0,49.61,20.51Zm-1,35H15.38V8.45h19.4V20.92a1.39,1.39,0,0,0,1.39,1.39H48.63Z' })
    );
  }
});

exports.default = File;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9maWxlLmpzIl0sIm5hbWVzIjpbIkZpbGUiLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZ2V0RGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDN0JDLGVBQWEsTUFEZ0I7QUFFN0JDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRmtCO0FBTTdCQyxpQkFONkIsNkJBTVg7QUFDaEIsV0FBTztBQUNMRixjQUFRLElBREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVg0QjtBQVk3QkMsUUFaNkIsb0JBWXBCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUVFLDhDQUFNLEdBQUUsdVJBQVI7QUFGRixLQURGO0FBT0Q7QUFwQjRCLENBQWxCLENBQWI7O2tCQXVCZVQsSSIsImZpbGUiOiJmaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IEZpbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRmlsZScsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogbnVsbCxcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWZpbGUnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG5cbiAgICAgICAgPHBhdGggZD1cIk00OS42MSwyMC41MSwzNi41Niw3LjQ2YTEuMzYsMS4zNiwwLDAsMC0uMzItLjI0LDEuNiwxLjYsMCwwLDAtLjM5LS4xNCwxLjUzLDEuNTMsMCwwLDAtLjI2LDBIMTUuMzhBMS4zOSwxLjM5LDAsMCwwLDE0LDguNDV2NDcuMWExLjM5LDEuMzksMCwwLDAsMS4zOSwxLjM5SDQ4LjYzQTEuMzksMS4zOSwwLDAsMCw1MCw1NS41NVYyMS40OEExLjQsMS40LDAsMCwwLDQ5LjYxLDIwLjUxWm0tMSwzNUgxNS4zOFY4LjQ1aDE5LjRWMjAuOTJhMS4zOSwxLjM5LDAsMCwwLDEuMzksMS4zOUg0OC42M1pcIi8+XG5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsZTtcbiJdfQ==