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

var CursorClick = _react2.default.createClass({
  displayName: 'CursorClick',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-cursorclick'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement(
        'g',
        { transform: 'scale(1.2, 1.2) translate(0, 2)' },
        _react2.default.createElement('polygon', { points: '22.5,11.1 27.6,43.9 35.3,37.3 43,49 48.8,45 41,33.2 49,28.3 ' }),
        _react2.default.createElement('path', { d: 'M21.2,27.8C14.5,26.6,9.8,20.7,9.8,14c0-7.7,6.3-14,14-14s14,6.3,14,14c0,0.8-0.1,1.5-0.2,2.3l-2.5-0.4 c0.1-0.6,0.2-1.3,0.2-1.8c0-6.4-5.2-11.5-11.5-11.5S12.3,7.7,12.3,14c0,5.5,3.9,10.3,9.4,11.4L21.2,27.8z' })
      )
    );
  }
});

exports.default = CursorClick;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jdXJzb3ItY2xpY2suanMiXSwibmFtZXMiOlsiQ3Vyc29yQ2xpY2siLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZ2V0RGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGNBQWMsZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDcENDLGVBQWEsYUFEdUI7QUFFcENDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRnlCO0FBTXBDQyxpQkFOb0MsNkJBTWxCO0FBQ2hCLFdBQU87QUFDTEYsY0FBUSxNQURIO0FBRUxHLDJCQUFxQjtBQUZoQixLQUFQO0FBSUQsR0FYbUM7QUFZcENDLFFBWm9DLG9CQVkzQjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRTtBQUFBO0FBQUEsVUFBRyxXQUFVLGlDQUFiO0FBQ0UsbURBQVMsUUFBTyw4REFBaEIsR0FERjtBQUVFLGdEQUFNLEdBQUUsMk1BQVI7QUFGRjtBQURGLEtBREY7QUFTRDtBQXRCbUMsQ0FBbEIsQ0FBcEI7O2tCQXlCZVQsVyIsImZpbGUiOiJjdXJzb3ItY2xpY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IEN1cnNvckNsaWNrID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0N1cnNvckNsaWNrJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1jdXJzb3JjbGljaydcbiAgICB9O1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPGcgdHJhbnNmb3JtPVwic2NhbGUoMS4yLCAxLjIpIHRyYW5zbGF0ZSgwLCAyKVwiPlxuICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz1cIjIyLjUsMTEuMSAyNy42LDQzLjkgMzUuMywzNy4zIDQzLDQ5IDQ4LjgsNDUgNDEsMzMuMiA0OSwyOC4zIFwiIC8+XG4gICAgICAgICAgPHBhdGggZD1cIk0yMS4yLDI3LjhDMTQuNSwyNi42LDkuOCwyMC43LDkuOCwxNGMwLTcuNyw2LjMtMTQsMTQtMTRzMTQsNi4zLDE0LDE0YzAsMC44LTAuMSwxLjUtMC4yLDIuM2wtMi41LTAuNFxuXHRjMC4xLTAuNiwwLjItMS4zLDAuMi0xLjhjMC02LjQtNS4yLTExLjUtMTEuNS0xMS41UzEyLjMsNy43LDEyLjMsMTRjMCw1LjUsMy45LDEwLjMsOS40LDExLjRMMjEuMiwyNy44elwiIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ3Vyc29yQ2xpY2s7XG4iXX0=