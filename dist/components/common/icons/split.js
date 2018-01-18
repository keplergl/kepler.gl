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

var Split = _react2.default.createClass({
  displayName: 'Split',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: null,
      predefinedClassName: 'data-ex-icons-split'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement(
        'g',
        { transform: 'translate(7.500000, 7.500000)' },
        _react2.default.createElement('path', { d: 'M19.5,47.4137931 C19.5,48.8421157 20.6192881,50 22,50 C23.3807119,50 24.5,48.8421157 24.5,47.4137931 L24.5,2.5862069 C24.5,1.15788427 23.3807119,0 22,0 C20.6192881,0 19.5,1.15788427 19.5,2.5862069 L19.5,47.4137931 Z' }),
        _react2.default.createElement('rect', { x: '0', y: '4', width: '44', height: '5', rx: '2.5' }),
        _react2.default.createElement('rect', { transform: 'translate(2.500000, 24.500000) rotate(90.000000) translate(-2.500000, -24.500000) ', x: '-18', y: '22', width: '41', height: '5', rx: '2.5' }),
        _react2.default.createElement('rect', { transform: 'translate(41.500000, 25.000000) rotate(90.000000) translate(-41.500000, -25.000000) ', x: '20.5', y: '22.5', width: '42', height: '5', rx: '2.5' }),
        _react2.default.createElement('rect', { x: '0', y: '41', width: '44', height: '5', rx: '2.5' })
      )
    );
  }
});

exports.default = Split;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zcGxpdC5qcyJdLCJuYW1lcyI6WyJTcGxpdCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxnQkFBTUMsV0FBTixDQUFrQjtBQUM5QkMsZUFBYSxPQURpQjtBQUU5QkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGbUI7QUFNOUJDLGlCQU44Qiw2QkFNWjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsSUFESDtBQUVMRywyQkFBcUI7QUFGaEIsS0FBUDtBQUlELEdBWDZCO0FBWTlCQyxRQVo4QixvQkFZckI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBRUU7QUFBQTtBQUFBLFVBQUcsV0FBVSwrQkFBYjtBQUNFLGdEQUFNLEdBQUUseU5BQVIsR0FERjtBQUVFLGdEQUFNLEdBQUUsR0FBUixFQUFZLEdBQUUsR0FBZCxFQUFrQixPQUFNLElBQXhCLEVBQTZCLFFBQU8sR0FBcEMsRUFBd0MsSUFBRyxLQUEzQyxHQUZGO0FBR0UsZ0RBQU0sV0FBVSxvRkFBaEIsRUFBcUcsR0FBRSxLQUF2RyxFQUE2RyxHQUFFLElBQS9HLEVBQW9ILE9BQU0sSUFBMUgsRUFBK0gsUUFBTyxHQUF0SSxFQUEwSSxJQUFHLEtBQTdJLEdBSEY7QUFJRSxnREFBTSxXQUFVLHNGQUFoQixFQUF1RyxHQUFFLE1BQXpHLEVBQWdILEdBQUUsTUFBbEgsRUFBeUgsT0FBTSxJQUEvSCxFQUFvSSxRQUFPLEdBQTNJLEVBQStJLElBQUcsS0FBbEosR0FKRjtBQUtFLGdEQUFNLEdBQUUsR0FBUixFQUFZLEdBQUUsSUFBZCxFQUFtQixPQUFNLElBQXpCLEVBQThCLFFBQU8sR0FBckMsRUFBeUMsSUFBRyxLQUE1QztBQUxGO0FBRkYsS0FERjtBQWFEO0FBMUI2QixDQUFsQixDQUFkOztrQkE2QmVULEsiLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgU3BsaXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU3BsaXQnLFxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IG51bGwsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1zcGxpdCdcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cblxuICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNy41MDAwMDAsIDcuNTAwMDAwKVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTkuNSw0Ny40MTM3OTMxIEMxOS41LDQ4Ljg0MjExNTcgMjAuNjE5Mjg4MSw1MCAyMiw1MCBDMjMuMzgwNzExOSw1MCAyNC41LDQ4Ljg0MjExNTcgMjQuNSw0Ny40MTM3OTMxIEwyNC41LDIuNTg2MjA2OSBDMjQuNSwxLjE1Nzg4NDI3IDIzLjM4MDcxMTksMCAyMiwwIEMyMC42MTkyODgxLDAgMTkuNSwxLjE1Nzg4NDI3IDE5LjUsMi41ODYyMDY5IEwxOS41LDQ3LjQxMzc5MzEgWlwiLz5cbiAgICAgICAgICA8cmVjdCB4PVwiMFwiIHk9XCI0XCIgd2lkdGg9XCI0NFwiIGhlaWdodD1cIjVcIiByeD1cIjIuNVwiLz5cbiAgICAgICAgICA8cmVjdCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMi41MDAwMDAsIDI0LjUwMDAwMCkgcm90YXRlKDkwLjAwMDAwMCkgdHJhbnNsYXRlKC0yLjUwMDAwMCwgLTI0LjUwMDAwMCkgXCIgeD1cIi0xOFwiIHk9XCIyMlwiIHdpZHRoPVwiNDFcIiBoZWlnaHQ9XCI1XCIgcng9XCIyLjVcIi8+XG4gICAgICAgICAgPHJlY3QgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDQxLjUwMDAwMCwgMjUuMDAwMDAwKSByb3RhdGUoOTAuMDAwMDAwKSB0cmFuc2xhdGUoLTQxLjUwMDAwMCwgLTI1LjAwMDAwMCkgXCIgeD1cIjIwLjVcIiB5PVwiMjIuNVwiIHdpZHRoPVwiNDJcIiBoZWlnaHQ9XCI1XCIgcng9XCIyLjVcIi8+XG4gICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiNDFcIiB3aWR0aD1cIjQ0XCIgaGVpZ2h0PVwiNVwiIHJ4PVwiMi41XCIvPlxuICAgICAgICA8L2c+XG5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU3BsaXQ7XG4iXX0=