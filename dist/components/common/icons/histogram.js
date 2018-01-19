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
        _react2.default.createElement('path', {
          d: 'M5,40.593203 L16.7666161,40.593203 L16.7666161,10 L5,10 L5,40.593203 L5,40.593203 Z M33.2333839,40.593203 L45,40.593203 L45,10 L33.2333839,10 L33.2333839,40.593203 L33.2333839,40.593203 Z M30.883308,40.5892837 L30.883308,26.4693451 L19.116692,26.4693451 L19.116692,40.5892837 L30.883308,40.5892837 Z',
          id: 'Shape'
        })
      )
    );
  }
});

exports.default = Histogram;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9oaXN0b2dyYW0uanMiXSwibmFtZXMiOlsiSGlzdG9ncmFtIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVksZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDbENDLGVBQWEsV0FEcUI7QUFFbENDLGFBQVc7QUFDVEMsWUFBUSxvQkFBVUM7QUFEVCxHQUZ1QjtBQUtsQ0MsaUJBTGtDLDZCQUtoQjtBQUNoQixXQUFPO0FBQ0xGLGNBQVE7QUFESCxLQUFQO0FBR0QsR0FUaUM7QUFVbENHLFFBVmtDLG9CQVV6QjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRTtBQUFBO0FBQUEsVUFBRyxXQUFVLCtCQUFiO0FBQ0U7QUFDRSxhQUFFLDZTQURKO0FBRUUsY0FBRztBQUZMO0FBREY7QUFERixLQURGO0FBVUQ7QUFyQmlDLENBQWxCLENBQWxCOztrQkF3QmVSLFMiLCJmaWxlIjoiaGlzdG9ncmFtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBIaXN0b2dyYW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnSGlzdG9ncmFtJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDcuNTAwMDAwLCA3LjUwMDAwMClcIj5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk01LDQwLjU5MzIwMyBMMTYuNzY2NjE2MSw0MC41OTMyMDMgTDE2Ljc2NjYxNjEsMTAgTDUsMTAgTDUsNDAuNTkzMjAzIEw1LDQwLjU5MzIwMyBaIE0zMy4yMzMzODM5LDQwLjU5MzIwMyBMNDUsNDAuNTkzMjAzIEw0NSwxMCBMMzMuMjMzMzgzOSwxMCBMMzMuMjMzMzgzOSw0MC41OTMyMDMgTDMzLjIzMzM4MzksNDAuNTkzMjAzIFogTTMwLjg4MzMwOCw0MC41ODkyODM3IEwzMC44ODMzMDgsMjYuNDY5MzQ1MSBMMTkuMTE2NjkyLDI2LjQ2OTM0NTEgTDE5LjExNjY5Miw0MC41ODkyODM3IEwzMC44ODMzMDgsNDAuNTg5MjgzNyBaXCJcbiAgICAgICAgICAgIGlkPVwiU2hhcGVcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9ncmFtO1xuIl19