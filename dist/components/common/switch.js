'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  checked: _propTypes2.default.bool,
  id: _propTypes2.default.string.isRequired,
  label: _propTypes2.default.node,
  error: _propTypes2.default.string,
  onBlur: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  value: _propTypes2.default.string
};

var Switch = function Switch(props) {
  var switchProps = (0, _extends3.default)({}, props, {
    switch: true
  });

  return _react2.default.createElement(_checkbox2.default, switchProps);
};

Switch.propTypes = propTypes;

exports.default = Switch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zd2l0Y2guanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiY2hlY2tlZCIsImJvb2wiLCJpZCIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJsYWJlbCIsIm5vZGUiLCJlcnJvciIsIm9uQmx1ciIsImZ1bmMiLCJvbkNoYW5nZSIsIm9uRm9jdXMiLCJ2YWx1ZSIsIlN3aXRjaCIsInByb3BzIiwic3dpdGNoUHJvcHMiLCJzd2l0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFdBQVMsb0JBQVVDLElBREg7QUFFaEJDLE1BQUksb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRkw7QUFHaEJDLFNBQU8sb0JBQVVDLElBSEQ7QUFJaEJDLFNBQU8sb0JBQVVKLE1BSkQ7QUFLaEJLLFVBQVEsb0JBQVVDLElBTEY7QUFNaEJDLFlBQVUsb0JBQVVELElBTko7QUFPaEJFLFdBQVMsb0JBQVVGLElBUEg7QUFRaEJHLFNBQU8sb0JBQVVUO0FBUkQsQ0FBbEI7O0FBV0EsSUFBTVUsU0FBUyxTQUFUQSxNQUFTLENBQUNDLEtBQUQsRUFBVztBQUN4QixNQUFNQyx5Q0FDREQsS0FEQztBQUVKRSxZQUFRO0FBRkosSUFBTjs7QUFLQSxTQUFPLGtEQUFjRCxXQUFkLENBQVA7QUFDRCxDQVBEOztBQVNBRixPQUFPZCxTQUFQLEdBQW1CQSxTQUFuQjs7a0JBRWVjLE0iLCJmaWxlIjoic3dpdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgY2hlY2tlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMubm9kZSxcbiAgZXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Gb2N1czogUHJvcFR5cGVzLmZ1bmMsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBTd2l0Y2ggPSAocHJvcHMpID0+IHtcbiAgY29uc3Qgc3dpdGNoUHJvcHMgPSB7XG4gICAgLi4ucHJvcHMsXG4gICAgc3dpdGNoOiB0cnVlXG4gIH07XG5cbiAgcmV0dXJuIDxDaGVja2JveCB7Li4uc3dpdGNoUHJvcHN9Lz47XG59O1xuXG5Td2l0Y2gucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBTd2l0Y2g7XG4iXX0=