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

var LineChart = _react2.default.createClass({
  displayName: 'LineChart',
  propTypes: {
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M53.4647408,17.8549995L35.8387756,35.4809608L25.5911236,25.2333088L6.607347,44.2427025 l3.6122975,3.6122971l15.371479-15.3714752l10.2476521,10.2476501l21.2638779-21.2382584L53.4647408,17.8549995z' })
    );
  }
});

exports.default = LineChart;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9saW5lLWNoYXJ0LmpzIl0sIm5hbWVzIjpbIkxpbmVDaGFydCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZLGdCQUFNQyxXQUFOLENBQWtCO0FBQ2xDQyxlQUFhLFdBRHFCO0FBRWxDQyxhQUFXO0FBQ1RDLFlBQVEsb0JBQVVDO0FBRFQsR0FGdUI7QUFLbENDLGlCQUxrQyw2QkFLaEI7QUFDaEIsV0FBTztBQUNMRixjQUFRO0FBREgsS0FBUDtBQUdELEdBVGlDO0FBVWxDRyxRQVZrQyxvQkFVekI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0UsOENBQU0sR0FBRSxxTUFBUjtBQURGLEtBREY7QUFNRDtBQWpCaUMsQ0FBbEIsQ0FBbEI7O2tCQW9CZVIsUyIsImZpbGUiOiJsaW5lLWNoYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IExpbmVDaGFydCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdMaW5lQ2hhcnQnLFxuICBwcm9wVHlwZXM6IHtcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxNnB4J1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aCBkPVwiTTUzLjQ2NDc0MDgsMTcuODU0OTk5NUwzNS44Mzg3NzU2LDM1LjQ4MDk2MDhMMjUuNTkxMTIzNiwyNS4yMzMzMDg4TDYuNjA3MzQ3LDQ0LjI0MjcwMjVcblx0bDMuNjEyMjk3NSwzLjYxMjI5NzFsMTUuMzcxNDc5LTE1LjM3MTQ3NTJsMTAuMjQ3NjUyMSwxMC4yNDc2NTAxbDIxLjI2Mzg3NzktMjEuMjM4MjU4NEw1My40NjQ3NDA4LDE3Ljg1NDk5OTV6XCIvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMaW5lQ2hhcnQ7XG4iXX0=