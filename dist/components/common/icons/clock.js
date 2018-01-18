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

var Clock = _react2.default.createClass({
  displayName: 'Clock',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: null,
      size: 'tiny',
      predefinedClassName: 'data-ex-icons-clock'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M41.68,41.16l-11.36-5a3,3,0,0,1-1.74-3L29.86,19h3l1.48,13.29,8.86,5.91Z' }),
      _react2.default.createElement('path', { d: 'M32.21,11.7A20.06,20.06,0,1,1,12.15,31.77,20.09,20.09,0,0,1,32.21,11.7m0-3.65A23.71,23.71,0,1,0,55.92,31.77,23.71,23.71,0,0,0,32.21,8.06Z' })
    );
  }
});

exports.default = Clock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jbG9jay5qcyJdLCJuYW1lcyI6WyJDbG9jayIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJzaXplIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFFBQVEsZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDOUJDLGVBQWEsT0FEaUI7QUFFOUJDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRm1CO0FBTTlCQyxpQkFOOEIsNkJBTVo7QUFDaEIsV0FBTztBQUNMRixjQUFRLElBREg7QUFFTEcsWUFBTSxNQUZEO0FBR0xDLDJCQUFxQjtBQUhoQixLQUFQO0FBS0QsR0FaNkI7QUFhOUJDLFFBYjhCLG9CQWFyQjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRSw4Q0FBTSxHQUFFLHlFQUFSLEdBREY7QUFFRSw4Q0FBTSxHQUFFLDJJQUFSO0FBRkYsS0FERjtBQU1EO0FBcEI2QixDQUFsQixDQUFkOztrQkF1QmVWLEsiLCJmaWxlIjoiY2xvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgQ2xvY2sgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQ2xvY2snLFxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IG51bGwsXG4gICAgICBzaXplOiAndGlueScsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1jbG9jaydcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk00MS42OCw0MS4xNmwtMTEuMzYtNWEzLDMsMCwwLDEtMS43NC0zTDI5Ljg2LDE5aDNsMS40OCwxMy4yOSw4Ljg2LDUuOTFaXCIvPlxuICAgICAgICA8cGF0aCBkPVwiTTMyLjIxLDExLjdBMjAuMDYsMjAuMDYsMCwxLDEsMTIuMTUsMzEuNzcsMjAuMDksMjAuMDksMCwwLDEsMzIuMjEsMTEuN20wLTMuNjVBMjMuNzEsMjMuNzEsMCwxLDAsNTUuOTIsMzEuNzcsMjMuNzEsMjMuNzEsMCwwLDAsMzIuMjEsOC4wNlpcIi8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENsb2NrO1xuIl19