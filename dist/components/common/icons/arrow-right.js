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

var ArrowRight = _react2.default.createClass({
  displayName: 'ArrowRight',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-arrowright'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M26.7,54.7l-4.5-4.4c-0.4-0.4-0.4-1,0-1.4L38.6,33L22.2,17c-0.4-0.4-0.4-1,0-1.5l4.5-4.4c0.4-0.4,1.1-0.4,1.5,0 l17.1,16.7l4.5,4.4c0.4,0.4,0.4,1,0,1.4L45.2,38L28.2,54.7C27.8,55.1,27.1,55.1,26.7,54.7' })
    );
  }
});

exports.default = ArrowRight;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9hcnJvdy1yaWdodC5qcyJdLCJuYW1lcyI6WyJBcnJvd1JpZ2h0IiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLGdCQUFNQyxXQUFOLENBQWtCO0FBQ25DQyxlQUFhLFlBRHNCO0FBRW5DQyxhQUFXO0FBQ1Q7QUFDQUMsWUFBUSxvQkFBVUM7QUFGVCxHQUZ3QjtBQU1uQ0MsaUJBTm1DLDZCQU1qQjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsTUFESDtBQUVMRywyQkFBcUI7QUFGaEIsS0FBUDtBQUlELEdBWGtDO0FBWW5DQyxRQVptQyxvQkFZMUI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0UsOENBQU0sR0FBRSxvTUFBUjtBQURGLEtBREY7QUFNRDtBQW5Ca0MsQ0FBbEIsQ0FBbkI7O2tCQXNCZVQsVSIsImZpbGUiOiJhcnJvdy1yaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgQXJyb3dSaWdodCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdBcnJvd1JpZ2h0JyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1hcnJvd3JpZ2h0J1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aCBkPVwiTTI2LjcsNTQuN2wtNC41LTQuNGMtMC40LTAuNC0wLjQtMSwwLTEuNEwzOC42LDMzTDIyLjIsMTdjLTAuNC0wLjQtMC40LTEsMC0xLjVsNC41LTQuNGMwLjQtMC40LDEuMS0wLjQsMS41LDBcblx0bDE3LjEsMTYuN2w0LjUsNC40YzAuNCwwLjQsMC40LDEsMCwxLjRMNDUuMiwzOEwyOC4yLDU0LjdDMjcuOCw1NS4xLDI3LjEsNTUuMSwyNi43LDU0LjdcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBcnJvd1JpZ2h0O1xuIl19