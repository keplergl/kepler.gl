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

var VertDots = _react2.default.createClass({
  displayName: 'VertDot',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-vertdot'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('rect', { x: '35.01', y: '48.31', width: '6.44', height: '6.44' }),
      _react2.default.createElement('rect', { x: '35.01', y: '35.43', width: '6.44', height: '6.44' }),
      _react2.default.createElement('rect', { x: '35.01', y: '22.55', width: '6.44', height: '6.44' }),
      _react2.default.createElement('rect', { x: '35.01', y: '9.67', width: '6.44', height: '6.44' }),
      _react2.default.createElement('rect', { x: '22.13', y: '48.31', width: '6.44', height: '6.44' }),
      _react2.default.createElement('rect', { x: '22.13', y: '35.43', width: '6.44', height: '6.44' }),
      _react2.default.createElement('rect', { x: '22.13', y: '22.55', width: '6.44', height: '6.44' }),
      _react2.default.createElement('rect', { x: '22.13', y: '9.67', width: '6.44', height: '6.44' })
    );
  }
});

exports.default = VertDots;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy92ZXJ0LWRvdHMuanMiXSwibmFtZXMiOlsiVmVydERvdHMiLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZ2V0RGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFdBQVcsZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDakNDLGVBQWEsU0FEb0I7QUFFakNDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRnNCO0FBTWpDQyxpQkFOaUMsNkJBTWY7QUFDaEIsV0FBTztBQUNMRixjQUFRLE1BREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVhnQztBQVlqQ0MsUUFaaUMsb0JBWXhCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFLDhDQUFNLEdBQUUsT0FBUixFQUFnQixHQUFFLE9BQWxCLEVBQTBCLE9BQU0sTUFBaEMsRUFBdUMsUUFBTyxNQUE5QyxHQURGO0FBRUUsOENBQU0sR0FBRSxPQUFSLEVBQWdCLEdBQUUsT0FBbEIsRUFBMEIsT0FBTSxNQUFoQyxFQUF1QyxRQUFPLE1BQTlDLEdBRkY7QUFHRSw4Q0FBTSxHQUFFLE9BQVIsRUFBZ0IsR0FBRSxPQUFsQixFQUEwQixPQUFNLE1BQWhDLEVBQXVDLFFBQU8sTUFBOUMsR0FIRjtBQUlFLDhDQUFNLEdBQUUsT0FBUixFQUFnQixHQUFFLE1BQWxCLEVBQXlCLE9BQU0sTUFBL0IsRUFBc0MsUUFBTyxNQUE3QyxHQUpGO0FBS0UsOENBQU0sR0FBRSxPQUFSLEVBQWdCLEdBQUUsT0FBbEIsRUFBMEIsT0FBTSxNQUFoQyxFQUF1QyxRQUFPLE1BQTlDLEdBTEY7QUFNRSw4Q0FBTSxHQUFFLE9BQVIsRUFBZ0IsR0FBRSxPQUFsQixFQUEwQixPQUFNLE1BQWhDLEVBQXVDLFFBQU8sTUFBOUMsR0FORjtBQU9FLDhDQUFNLEdBQUUsT0FBUixFQUFnQixHQUFFLE9BQWxCLEVBQTBCLE9BQU0sTUFBaEMsRUFBdUMsUUFBTyxNQUE5QyxHQVBGO0FBUUUsOENBQU0sR0FBRSxPQUFSLEVBQWdCLEdBQUUsTUFBbEIsRUFBeUIsT0FBTSxNQUEvQixFQUFzQyxRQUFPLE1BQTdDO0FBUkYsS0FERjtBQVlEO0FBekJnQyxDQUFsQixDQUFqQjs7a0JBNEJlVCxRIiwiZmlsZSI6InZlcnQtZG90cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgVmVydERvdHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVmVydERvdCcsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogJzE2cHgnLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtdmVydGRvdCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHJlY3QgeD1cIjM1LjAxXCIgeT1cIjQ4LjMxXCIgd2lkdGg9XCI2LjQ0XCIgaGVpZ2h0PVwiNi40NFwiLz5cbiAgICAgICAgPHJlY3QgeD1cIjM1LjAxXCIgeT1cIjM1LjQzXCIgd2lkdGg9XCI2LjQ0XCIgaGVpZ2h0PVwiNi40NFwiLz5cbiAgICAgICAgPHJlY3QgeD1cIjM1LjAxXCIgeT1cIjIyLjU1XCIgd2lkdGg9XCI2LjQ0XCIgaGVpZ2h0PVwiNi40NFwiLz5cbiAgICAgICAgPHJlY3QgeD1cIjM1LjAxXCIgeT1cIjkuNjdcIiB3aWR0aD1cIjYuNDRcIiBoZWlnaHQ9XCI2LjQ0XCIvPlxuICAgICAgICA8cmVjdCB4PVwiMjIuMTNcIiB5PVwiNDguMzFcIiB3aWR0aD1cIjYuNDRcIiBoZWlnaHQ9XCI2LjQ0XCIvPlxuICAgICAgICA8cmVjdCB4PVwiMjIuMTNcIiB5PVwiMzUuNDNcIiB3aWR0aD1cIjYuNDRcIiBoZWlnaHQ9XCI2LjQ0XCIvPlxuICAgICAgICA8cmVjdCB4PVwiMjIuMTNcIiB5PVwiMjIuNTVcIiB3aWR0aD1cIjYuNDRcIiBoZWlnaHQ9XCI2LjQ0XCIvPlxuICAgICAgICA8cmVjdCB4PVwiMjIuMTNcIiB5PVwiOS42N1wiIHdpZHRoPVwiNi40NFwiIGhlaWdodD1cIjYuNDRcIi8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFZlcnREb3RzO1xuIl19