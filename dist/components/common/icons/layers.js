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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9sYXllcnMuanMiXSwibmFtZXMiOlsiTGF5ZXJzIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLGdCQUFNQyxXQUFOLENBQWtCO0FBQy9CQyxlQUFhLFFBRGtCO0FBRS9CQyxhQUFXO0FBQ1Q7QUFDQUMsWUFBUSxvQkFBVUM7QUFGVCxHQUZvQjtBQU0vQkMsaUJBTitCLDZCQU1iO0FBQ2hCLFdBQU87QUFDTEYsY0FBUSxJQURIO0FBRUxHLDJCQUFxQjtBQUZoQixLQUFQO0FBSUQsR0FYOEI7QUFZL0JDLFFBWitCLG9CQVl0QjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRSw4Q0FBTSxHQUFFLDRqQkFBUjtBQURGLEtBREY7QUFLRDtBQWxCOEIsQ0FBbEIsQ0FBZjs7a0JBcUJlVCxNIiwiZmlsZSI6ImxheWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgTGF5ZXJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0xheWVycycsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogbnVsbCxcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWxheWVycydcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk01MC44OCw0My41MmEzLjIsMy4yLDAsMCwxLDAsNS44NkwzNC41Niw1Ni41MmE2LjQyLDYuNDIsMCwwLDEtNS4xMywwTDEzLjEyLDQ5LjM3YTMuMiwzLjIsMCwwLDEsMC01Ljg2bDQuNjItMmE2LDYsMCwwLDAsMS40OCwxbDIuMTYuOTUtNywzLjA1LDE2LjMyLDcuMTRhMy4xOSwzLjE5LDAsMCwwLDIuNTYsMEw0OS42LDQ2LjQ0bC03LTMuMDUsMi4xNi0uOTVhNiw2LDAsMCwwLDEuNDgtLjk1Wm0wLTE0LjM5YTMuMiwzLjIsMCwwLDEsMCw1Ljg2TDM0LjU2LDQyLjEzYTYuNDIsNi40MiwwLDAsMS01LjEzLDBMMTMuMTIsMzVhMy4yLDMuMiwwLDAsMSwwLTUuODZsNC42Mi0yYTYsNiwwLDAsMCwxLjQ4LDFsMi4xNi45NS03LDMuMDVMMzAuNzIsMzkuMmEzLjE5LDMuMTksMCwwLDAsMi41NiwwTDQ5LjYsMzIuMDZsLTctMy4wNSwyLjE2LS45NWE2LDYsMCwwLDAsMS40OC0uOTVaTTEzLjEyLDIwLjZhMy4yLDMuMiwwLDAsMSwwLTUuODZMMjkuNDQsNy42YTYuMzksNi4zOSwwLDAsMSw1LjEzLDBsMTYuMzIsNy4xNGEzLjIsMy4yLDAsMCwxLDAsNS44NkwzNC41NiwyNy43NGE2LjM5LDYuMzksMCwwLDEtNS4xMywwWlwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExheWVycztcbiJdfQ==