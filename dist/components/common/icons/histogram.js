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

var Histogram = _react2.default.createClass({
  displayName: 'Histogram',
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
      _react2.default.createElement(
        'g',
        { transform: 'translate(7.500000, 7.500000)' },
        _react2.default.createElement('path', { d: 'M5,40.593203 L16.7666161,40.593203 L16.7666161,10 L5,10 L5,40.593203 L5,40.593203 Z M33.2333839,40.593203 L45,40.593203 L45,10 L33.2333839,10 L33.2333839,40.593203 L33.2333839,40.593203 Z M30.883308,40.5892837 L30.883308,26.4693451 L19.116692,26.4693451 L19.116692,40.5892837 L30.883308,40.5892837 Z', id: 'Shape' })
      )
    );
  }
});

exports.default = Histogram;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9oaXN0b2dyYW0uanMiXSwibmFtZXMiOlsiSGlzdG9ncmFtIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVksZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDbENDLGVBQWEsV0FEcUI7QUFFbENDLGFBQVc7QUFDVEMsWUFBUSxvQkFBVUM7QUFEVCxHQUZ1QjtBQUtsQ0MsaUJBTGtDLDZCQUtoQjtBQUNoQixXQUFPO0FBQ0xGLGNBQVE7QUFESCxLQUFQO0FBR0QsR0FUaUM7QUFVbENHLFFBVmtDLG9CQVV6QjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRTtBQUFBO0FBQUEsVUFBRyxXQUFVLCtCQUFiO0FBQ0UsZ0RBQU0sR0FBRSw2U0FBUixFQUFzVCxJQUFHLE9BQXpUO0FBREY7QUFERixLQURGO0FBT0Q7QUFsQmlDLENBQWxCLENBQWxCOztrQkFxQmVSLFMiLCJmaWxlIjoiaGlzdG9ncmFtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IEhpc3RvZ3JhbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdIaXN0b2dyYW0nLFxuICBwcm9wVHlwZXM6IHtcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxNnB4J1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNy41MDAwMDAsIDcuNTAwMDAwKVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNSw0MC41OTMyMDMgTDE2Ljc2NjYxNjEsNDAuNTkzMjAzIEwxNi43NjY2MTYxLDEwIEw1LDEwIEw1LDQwLjU5MzIwMyBMNSw0MC41OTMyMDMgWiBNMzMuMjMzMzgzOSw0MC41OTMyMDMgTDQ1LDQwLjU5MzIwMyBMNDUsMTAgTDMzLjIzMzM4MzksMTAgTDMzLjIzMzM4MzksNDAuNTkzMjAzIEwzMy4yMzMzODM5LDQwLjU5MzIwMyBaIE0zMC44ODMzMDgsNDAuNTg5MjgzNyBMMzAuODgzMzA4LDI2LjQ2OTM0NTEgTDE5LjExNjY5MiwyNi40NjkzNDUxIEwxOS4xMTY2OTIsNDAuNTg5MjgzNyBMMzAuODgzMzA4LDQwLjU4OTI4MzcgWlwiIGlkPVwiU2hhcGVcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9ncmFtO1xuIl19