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

var FilterFunnel = _react2.default.createClass({
  displayName: 'FilterFunnel',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-filterfunnel'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M52.5,19.67l-16,20h0a6.24,6.24,0,0,0-1.37,3.9V57L30.6,54.74a3.12,3.12,0,0,1-1.73-2.79V43.58h0a6.24,6.24,0,0,0-1.37-3.9l-16-20a5,5,0,0,1-1.35-3.24c0-5.17,9.78-9.36,21.85-9.36s21.85,4.19,21.85,9.36A5,5,0,0,1,52.5,19.67Zm-20.5,3c8.62,0,15.61-2.79,15.61-6.24s-7-6.24-15.61-6.24S16.39,13,16.39,16.43,23.38,22.67,32,22.67Z' })
    );
  }
});

// this export method must be used for generated documentation to work
exports.default = FilterFunnel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9maWx0ZXItZnVubmVsLmpzIl0sIm5hbWVzIjpbIkZpbHRlckZ1bm5lbCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsZUFBZSxnQkFBTUMsV0FBTixDQUFrQjtBQUNyQ0MsZUFBYSxjQUR3QjtBQUVyQ0MsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGMEI7QUFNckNDLGlCQU5xQyw2QkFNbkI7QUFDaEIsV0FBTztBQUNMRixjQUFRLE1BREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVhvQztBQVlyQ0MsUUFacUMsb0JBWTVCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFLDhDQUFNLEdBQUUsOFRBQVI7QUFERixLQURGO0FBS0Q7QUFsQm9DLENBQWxCLENBQXJCOztBQXFCQTtrQkFDZVQsWSIsImZpbGUiOiJmaWx0ZXItZnVubmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBGaWx0ZXJGdW5uZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRmlsdGVyRnVubmVsJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1maWx0ZXJmdW5uZWwnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNTIuNSwxOS42N2wtMTYsMjBoMGE2LjI0LDYuMjQsMCwwLDAtMS4zNywzLjlWNTdMMzAuNiw1NC43NGEzLjEyLDMuMTIsMCwwLDEtMS43My0yLjc5VjQzLjU4aDBhNi4yNCw2LjI0LDAsMCwwLTEuMzctMy45bC0xNi0yMGE1LDUsMCwwLDEtMS4zNS0zLjI0YzAtNS4xNyw5Ljc4LTkuMzYsMjEuODUtOS4zNnMyMS44NSw0LjE5LDIxLjg1LDkuMzZBNSw1LDAsMCwxLDUyLjUsMTkuNjdabS0yMC41LDNjOC42MiwwLDE1LjYxLTIuNzksMTUuNjEtNi4yNHMtNy02LjI0LTE1LjYxLTYuMjRTMTYuMzksMTMsMTYuMzksMTYuNDMsMjMuMzgsMjIuNjcsMzIsMjIuNjdaXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuLy8gdGhpcyBleHBvcnQgbWV0aG9kIG11c3QgYmUgdXNlZCBmb3IgZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24gdG8gd29ya1xuZXhwb3J0IGRlZmF1bHQgRmlsdGVyRnVubmVsO1xuIl19