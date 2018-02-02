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

var DragNDrop = _react2.default.createClass({
  displayName: 'DragNDrop',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-dragndrop'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M53.11,56.13H10.89A3.11,3.11,0,0,1,7.79,53V31.92a1.86,1.86,0,0,1,3.72,0V52.4h41V31.92a1.86,1.86,0,0,1,3.72,0V53A3.11,3.11,0,0,1,53.11,56.13Z' }),
      _react2.default.createElement('path', { d: 'M33.86,33l8-8a1.86,1.86,0,1,1,2.63,2.63L33.32,38.82a1.86,1.86,0,0,1-2.63,0L19.51,27.64A1.86,1.86,0,0,1,22.14,25l8,8V11.43a1.86,1.86,0,0,1,3.72,0Z' })
    );
  }
});

exports.default = DragNDrop;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9kcmFnLW4tZHJvcC5qcyJdLCJuYW1lcyI6WyJEcmFnTkRyb3AiLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZ2V0RGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVksZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDbENDLGVBQWEsV0FEcUI7QUFFbENDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRnVCO0FBTWxDQyxpQkFOa0MsNkJBTWhCO0FBQ2hCLFdBQU87QUFDTEYsY0FBUSxNQURIO0FBRUxHLDJCQUFxQjtBQUZoQixLQUFQO0FBSUQsR0FYaUM7QUFZbENDLFFBWmtDLG9CQVl6QjtBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRSw4Q0FBTSxHQUFFLDhJQUFSLEdBREY7QUFFRSw4Q0FBTSxHQUFFLG1KQUFSO0FBRkYsS0FERjtBQU1EO0FBbkJpQyxDQUFsQixDQUFsQjs7a0JBc0JlVCxTIiwiZmlsZSI6ImRyYWctbi1kcm9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBEcmFnTkRyb3AgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRHJhZ05Ecm9wJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1kcmFnbmRyb3AnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNTMuMTEsNTYuMTNIMTAuODlBMy4xMSwzLjExLDAsMCwxLDcuNzksNTNWMzEuOTJhMS44NiwxLjg2LDAsMCwxLDMuNzIsMFY1Mi40aDQxVjMxLjkyYTEuODYsMS44NiwwLDAsMSwzLjcyLDBWNTNBMy4xMSwzLjExLDAsMCwxLDUzLjExLDU2LjEzWlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMzMuODYsMzNsOC04YTEuODYsMS44NiwwLDEsMSwyLjYzLDIuNjNMMzMuMzIsMzguODJhMS44NiwxLjg2LDAsMCwxLTIuNjMsMEwxOS41MSwyNy42NEExLjg2LDEuODYsMCwwLDEsMjIuMTQsMjVsOCw4VjExLjQzYTEuODYsMS44NiwwLDAsMSwzLjcyLDBaXCIgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRHJhZ05Ecm9wO1xuIl19