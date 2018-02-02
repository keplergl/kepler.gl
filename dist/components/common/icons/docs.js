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

var Docs = _react2.default.createClass({
  displayName: 'Docs',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-docs'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M23.62,23.41a1,1,0,0,1,.39.08,1,1,0,0,0-.78,0A1,1,0,0,1,23.62,23.41Z' }),
      _react2.default.createElement('path', { d: 'M32,57.5A24.83,24.83,0,1,1,56.83,32.67,24.86,24.86,0,0,1,32,57.5Zm0-44.86a20,20,0,1,0,20,20A20,20,0,0,0,32,12.64Z' }),
      _react2.default.createElement('rect', {
        x: '28.8',
        y: '29.46',
        width: '6.41',
        height: '16.02',
        rx: '1.6',
        ry: '1.6'
      }),
      _react2.default.createElement('rect', { x: '28.8', y: '19.85', width: '6.41', height: '6.41', rx: '1.6', ry: '1.6' })
    );
  }
});

exports.default = Docs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9kb2NzLmpzIl0sIm5hbWVzIjpbIkRvY3MiLCJjcmVhdGVDbGFzcyIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZ2V0RGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSIsInJlbmRlciIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sZ0JBQU1DLFdBQU4sQ0FBa0I7QUFDN0JDLGVBQWEsTUFEZ0I7QUFFN0JDLGFBQVc7QUFDVDtBQUNBQyxZQUFRLG9CQUFVQztBQUZULEdBRmtCO0FBTTdCQyxpQkFONkIsNkJBTVg7QUFDaEIsV0FBTztBQUNMRixjQUFRLE1BREg7QUFFTEcsMkJBQXFCO0FBRmhCLEtBQVA7QUFJRCxHQVg0QjtBQVk3QkMsUUFaNkIsb0JBWXBCO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFLDhDQUFNLEdBQUUsc0VBQVIsR0FERjtBQUVFLDhDQUFNLEdBQUUsbUhBQVIsR0FGRjtBQUdFO0FBQ0UsV0FBRSxNQURKO0FBRUUsV0FBRSxPQUZKO0FBR0UsZUFBTSxNQUhSO0FBSUUsZ0JBQU8sT0FKVDtBQUtFLFlBQUcsS0FMTDtBQU1FLFlBQUc7QUFOTCxRQUhGO0FBV0UsOENBQU0sR0FBRSxNQUFSLEVBQWUsR0FBRSxPQUFqQixFQUF5QixPQUFNLE1BQS9CLEVBQXNDLFFBQU8sTUFBN0MsRUFBb0QsSUFBRyxLQUF2RCxFQUE2RCxJQUFHLEtBQWhFO0FBWEYsS0FERjtBQWVEO0FBNUI0QixDQUFsQixDQUFiOztrQkErQmVULEkiLCJmaWxlIjoiZG9jcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY29uc3QgRG9jcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdEb2NzJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1kb2NzJ1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aCBkPVwiTTIzLjYyLDIzLjQxYTEsMSwwLDAsMSwuMzkuMDgsMSwxLDAsMCwwLS43OCwwQTEsMSwwLDAsMSwyMy42MiwyMy40MVpcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTMyLDU3LjVBMjQuODMsMjQuODMsMCwxLDEsNTYuODMsMzIuNjcsMjQuODYsMjQuODYsMCwwLDEsMzIsNTcuNVptMC00NC44NmEyMCwyMCwwLDEsMCwyMCwyMEEyMCwyMCwwLDAsMCwzMiwxMi42NFpcIiAvPlxuICAgICAgICA8cmVjdFxuICAgICAgICAgIHg9XCIyOC44XCJcbiAgICAgICAgICB5PVwiMjkuNDZcIlxuICAgICAgICAgIHdpZHRoPVwiNi40MVwiXG4gICAgICAgICAgaGVpZ2h0PVwiMTYuMDJcIlxuICAgICAgICAgIHJ4PVwiMS42XCJcbiAgICAgICAgICByeT1cIjEuNlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxyZWN0IHg9XCIyOC44XCIgeT1cIjE5Ljg1XCIgd2lkdGg9XCI2LjQxXCIgaGVpZ2h0PVwiNi40MVwiIHJ4PVwiMS42XCIgcnk9XCIxLjZcIiAvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBEb2NzO1xuIl19