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
      height: '16px',
      predefinedClassName: 'data-ex-icons-histogram'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9oaXN0b2dyYW0uanMiXSwibmFtZXMiOlsiSGlzdG9ncmFtIiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImdldERlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJyZW5kZXIiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZLGdCQUFNQyxXQUFOLENBQWtCO0FBQ2xDQyxlQUFhLFdBRHFCO0FBRWxDQyxhQUFXO0FBQ1RDLFlBQVEsb0JBQVVDO0FBRFQsR0FGdUI7QUFLbENDLGlCQUxrQyw2QkFLaEI7QUFDaEIsV0FBTztBQUNMRixjQUFRLE1BREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVZpQztBQVdsQ0MsUUFYa0Msb0JBV3pCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFO0FBQUE7QUFBQSxVQUFHLFdBQVUsK0JBQWI7QUFDRTtBQUNFLGFBQUUsNlNBREo7QUFFRSxjQUFHO0FBRkw7QUFERjtBQURGLEtBREY7QUFVRDtBQXRCaUMsQ0FBbEIsQ0FBbEI7O2tCQXlCZVQsUyIsImZpbGUiOiJoaXN0b2dyYW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IEhpc3RvZ3JhbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdIaXN0b2dyYW0nLFxuICBwcm9wVHlwZXM6IHtcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWhpc3RvZ3JhbSdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDcuNTAwMDAwLCA3LjUwMDAwMClcIj5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk01LDQwLjU5MzIwMyBMMTYuNzY2NjE2MSw0MC41OTMyMDMgTDE2Ljc2NjYxNjEsMTAgTDUsMTAgTDUsNDAuNTkzMjAzIEw1LDQwLjU5MzIwMyBaIE0zMy4yMzMzODM5LDQwLjU5MzIwMyBMNDUsNDAuNTkzMjAzIEw0NSwxMCBMMzMuMjMzMzgzOSwxMCBMMzMuMjMzMzgzOSw0MC41OTMyMDMgTDMzLjIzMzM4MzksNDAuNTkzMjAzIFogTTMwLjg4MzMwOCw0MC41ODkyODM3IEwzMC44ODMzMDgsMjYuNDY5MzQ1MSBMMTkuMTE2NjkyLDI2LjQ2OTM0NTEgTDE5LjExNjY5Miw0MC41ODkyODM3IEwzMC44ODMzMDgsNDAuNTg5MjgzNyBaXCJcbiAgICAgICAgICAgIGlkPVwiU2hhcGVcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9ncmFtO1xuIl19