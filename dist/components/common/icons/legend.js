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
      height: null,
      size: 'tiny',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9sZWdlbmQuanMiXSwibmFtZXMiOlsiTGVnZW5kIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInNpemUiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxnQkFBTUMsV0FBTixDQUFrQjtBQUMvQkMsZUFBYSxRQURrQjtBQUUvQkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGb0I7QUFNL0JDLGlCQU4rQiw2QkFNYjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsSUFESDtBQUVMRyxZQUFNLE1BRkQ7QUFHTEMsMkJBQXFCO0FBSGhCLEtBQVA7QUFLRCxHQVo4QjtBQWEvQkMsUUFiK0Isb0JBYXRCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUVFLDhDQUFNLEdBQUUscVdBQVI7QUFGRixLQURGO0FBT0Q7QUFyQjhCLENBQWxCLENBQWY7O2tCQXdCZVYsTSIsImZpbGUiOiJsZWdlbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgTGVnZW5kID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0xlZ2VuZCcsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogbnVsbCxcbiAgICAgIHNpemU6ICd0aW55JyxcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWxlZ2VuZCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cblxuICAgICAgICA8cGF0aCBkPVwiTTI5Ljc4LDQ1Ljg5djUuNTZINDYuNDRWNDUuODlabS0xMS4xMSwwdjUuNTZoNS41NlY0NS44OVpNMjkuNzgsMzQuNzh2NS41Nkg0Ni40NFYzNC43OFptLTExLjExLDB2NS41Nmg1LjU2VjM0Ljc4Wk0yOS43OCwyMy42N3Y1LjU2SDQ2LjQ0VjIzLjY3Wm0tMTEuMTEsMHY1LjU2aDUuNTZWMjMuNjdaTTI5Ljc4LDEyLjU2djUuNTZINDYuNDRWMTIuNTZabS0xMS4xMSwwdjUuNTZoNS41NlYxMi41NlpNMTUuODksN0g0OS4yMkEyLjc4LDIuNzgsMCwwLDEsNTIsOS43OFY1NC4yMkEyLjc4LDIuNzgsMCwwLDEsNDkuMjIsNTdIMTUuODlhMi43OCwyLjc4LDAsMCwxLTIuNzgtMi43OFY5Ljc4QTIuNzgsMi43OCwwLDAsMSwxNS44OSw3WlwiLz5cblxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMZWdlbmQ7XG4iXX0=