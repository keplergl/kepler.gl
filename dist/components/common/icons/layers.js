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

var Layers = _react2.default.createClass({
  displayName: 'Layers',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-layers'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z' })
    );
  }
});

exports.default = Layers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9sYXllcnMuanMiXSwibmFtZXMiOlsiTGF5ZXJzIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLGdCQUFNQyxXQUFOLENBQWtCO0FBQy9CQyxlQUFhLFFBRGtCO0FBRS9CQyxhQUFXO0FBQ1Q7QUFDQUMsWUFBUSxvQkFBVUM7QUFGVCxHQUZvQjtBQU0vQkMsaUJBTitCLDZCQU1iO0FBQ2hCLFdBQU87QUFDTEYsY0FBUSxJQURIO0FBRUxHLDJCQUFxQjtBQUZoQixLQUFQO0FBSUQsR0FYOEI7QUFZL0JDLFFBWitCLG9CQVl0QjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFFRSw4Q0FBTSxHQUFFLDRqQkFBUjtBQUZGLEtBREY7QUFPRDtBQXBCOEIsQ0FBbEIsQ0FBZjs7a0JBd0JlVCxNIiwiZmlsZSI6ImxheWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBMYXllcnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTGF5ZXJzJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBudWxsLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtbGF5ZXJzJ1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuXG4gICAgICAgIDxwYXRoIGQ9XCJNNTAuODgsNDMuNTJhMy4yLDMuMiwwLDAsMSwwLDUuODZMMzQuNTYsNTYuNTJhNi40Miw2LjQyLDAsMCwxLTUuMTMsMEwxMy4xMiw0OS4zN2EzLjIsMy4yLDAsMCwxLDAtNS44Nmw0LjYyLTJhNiw2LDAsMCwwLDEuNDgsMWwyLjE2Ljk1LTcsMy4wNSwxNi4zMiw3LjE0YTMuMTksMy4xOSwwLDAsMCwyLjU2LDBMNDkuNiw0Ni40NGwtNy0zLjA1LDIuMTYtLjk1YTYsNiwwLDAsMCwxLjQ4LS45NVptMC0xNC4zOWEzLjIsMy4yLDAsMCwxLDAsNS44NkwzNC41Niw0Mi4xM2E2LjQyLDYuNDIsMCwwLDEtNS4xMywwTDEzLjEyLDM1YTMuMiwzLjIsMCwwLDEsMC01Ljg2bDQuNjItMmE2LDYsMCwwLDAsMS40OCwxbDIuMTYuOTUtNywzLjA1TDMwLjcyLDM5LjJhMy4xOSwzLjE5LDAsMCwwLDIuNTYsMEw0OS42LDMyLjA2bC03LTMuMDUsMi4xNi0uOTVhNiw2LDAsMCwwLDEuNDgtLjk1Wk0xMy4xMiwyMC42YTMuMiwzLjIsMCwwLDEsMC01Ljg2TDI5LjQ0LDcuNmE2LjM5LDYuMzksMCwwLDEsNS4xMywwbDE2LjMyLDcuMTRhMy4yLDMuMiwwLDAsMSwwLDUuODZMMzQuNTYsMjcuNzRhNi4zOSw2LjM5LDAsMCwxLTUuMTMsMFpcIi8+XG5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuXG5leHBvcnQgZGVmYXVsdCBMYXllcnM7XG4iXX0=