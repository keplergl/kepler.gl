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

var Save = _react2.default.createClass({
  displayName: 'Save',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-save'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M49.26,56.17H14.74a6.91,6.91,0,0,1-6.91-6.91V32a3.45,3.45,0,1,1,6.91,0V49.26H49.26V32a3.45,3.45,0,1,1,6.91,0V49.26A6.91,6.91,0,0,1,49.26,56.17Z' }),
      _react2.default.createElement('path', { d: 'M44.81,24.08a3.5,3.5,0,0,1-4.9,0l-4.45-4.45V35.44a3.45,3.45,0,0,1-6.91,0V19.62l-4.45,4.45a3.5,3.5,0,0,1-4.9,0,3.44,3.44,0,0,1,0-4.87L29.55,8.85a6,6,0,0,1,.52-.45,2.61,2.61,0,0,1,.62-.31,3.45,3.45,0,0,1,2.62,0,2.61,2.61,0,0,1,.62.31,6,6,0,0,1,.52.45L44.81,19.21A3.44,3.44,0,0,1,44.81,24.08Z' })
    );
  }
});

exports.default = Save;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zYXZlLmpzIl0sIm5hbWVzIjpbIlNhdmUiLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZ2V0RGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDN0JDLGVBQWEsTUFEZ0I7QUFFN0JDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRmtCO0FBTTdCQyxpQkFONkIsNkJBTVg7QUFDaEIsV0FBTztBQUNMRixjQUFRLE1BREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVg0QjtBQVk3QkMsUUFaNkIsb0JBWXBCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFLDhDQUFNLEdBQUUsaUpBQVIsR0FERjtBQUVFLDhDQUFNLEdBQUUsbVNBQVI7QUFGRixLQURGO0FBTUQ7QUFuQjRCLENBQWxCLENBQWI7O2tCQXNCZVQsSSIsImZpbGUiOiJzYXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBTYXZlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1NhdmUnLFxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLXNhdmUnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNDkuMjYsNTYuMTdIMTQuNzRhNi45MSw2LjkxLDAsMCwxLTYuOTEtNi45MVYzMmEzLjQ1LDMuNDUsMCwxLDEsNi45MSwwVjQ5LjI2SDQ5LjI2VjMyYTMuNDUsMy40NSwwLDEsMSw2LjkxLDBWNDkuMjZBNi45MSw2LjkxLDAsMCwxLDQ5LjI2LDU2LjE3WlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNNDQuODEsMjQuMDhhMy41LDMuNSwwLDAsMS00LjksMGwtNC40NS00LjQ1VjM1LjQ0YTMuNDUsMy40NSwwLDAsMS02LjkxLDBWMTkuNjJsLTQuNDUsNC40NWEzLjUsMy41LDAsMCwxLTQuOSwwLDMuNDQsMy40NCwwLDAsMSwwLTQuODdMMjkuNTUsOC44NWE2LDYsMCwwLDEsLjUyLS40NSwyLjYxLDIuNjEsMCwwLDEsLjYyLS4zMSwzLjQ1LDMuNDUsMCwwLDEsMi42MiwwLDIuNjEsMi42MSwwLDAsMSwuNjIuMzEsNiw2LDAsMCwxLC41Mi40NUw0NC44MSwxOS4yMUEzLjQ0LDMuNDQsMCwwLDEsNDQuODEsMjQuMDhaXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2F2ZTtcbiJdfQ==