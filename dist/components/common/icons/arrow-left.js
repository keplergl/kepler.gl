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

var ArrowLeft = _react2.default.createClass({
  displayName: 'ArrowLeft',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-arrowleft'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z' })
    );
  }
});

exports.default = ArrowLeft;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9hcnJvdy1sZWZ0LmpzIl0sIm5hbWVzIjpbIkFycm93TGVmdCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxnQkFBTUMsV0FBTixDQUFrQjtBQUNsQ0MsZUFBYSxXQURxQjtBQUVsQ0MsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGdUI7QUFNbENDLGlCQU5rQyw2QkFNaEI7QUFDaEIsV0FBTztBQUNMRixjQUFRLE1BREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVhpQztBQVlsQ0MsUUFaa0Msb0JBWXpCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFLDhDQUFNLEdBQUUsb0RBQVI7QUFERixLQURGO0FBS0Q7QUFsQmlDLENBQWxCLENBQWxCOztrQkFxQmVULFMiLCJmaWxlIjoiYXJyb3ctbGVmdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgQXJyb3dMZWZ0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0Fycm93TGVmdCcsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogJzE2cHgnLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtYXJyb3dsZWZ0J1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aCBkPVwiTTE1LjQxIDE2LjA5bC00LjU4LTQuNTkgNC41OC00LjU5TDE0IDUuNWwtNiA2IDYgNnpcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJvd0xlZnQ7XG4iXX0=