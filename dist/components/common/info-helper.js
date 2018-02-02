'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  margin-left: 10px;\n  color: ', ';\n  display: inline-flex;\n\n  .info-helper__content {\n    max-width: 100px;\n  }\n  \n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  align-items: center;\n  margin-left: 10px;\n  color: ', ';\n  display: inline-flex;\n\n  .info-helper__content {\n    max-width: 100px;\n  }\n  \n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('./styled-components');

var _icons = require('./icons');

var _styledComponents2 = require('styled-components');

var _styledComponents3 = _interopRequireDefault(_styledComponents2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledInfoHelper = _styledComponents3.default.div(_templateObject, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.textColorHl;
});

var propTypes = {
  description: _react2.default.PropTypes.string.isRequired,
  containerClass: _react2.default.PropTypes.string
};

var InfoHelper = function InfoHelper(_ref) {
  var description = _ref.description,
      containerClass = _ref.containerClass,
      id = _ref.id;
  return _react2.default.createElement(
    StyledInfoHelper,
    { className: 'info-helper ' + (containerClass || ''), 'data-tip': true, 'data-for': id },
    _react2.default.createElement(_icons.Docs, { height: '16px' }),
    _react2.default.createElement(
      _styledComponents.Tooltip,
      { id: id, effect: 'solid' },
      _react2.default.createElement(
        'div',
        { className: 'info-helper__content' },
        description
      )
    )
  );
};

InfoHelper.propTypes = propTypes;

exports.default = InfoHelper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlci5qcyJdLCJuYW1lcyI6WyJTdHlsZWRJbmZvSGVscGVyIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsImxhYmVsQ29sb3IiLCJ0ZXh0Q29sb3JIbCIsInByb3BUeXBlcyIsImRlc2NyaXB0aW9uIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImNvbnRhaW5lckNsYXNzIiwiSW5mb0hlbHBlciIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxtQkFBbUIsMkJBQU9DLEdBQTFCLGtCQUdLO0FBQUEsU0FBUUMsTUFBTUMsS0FBTixDQUFZQyxVQUFwQjtBQUFBLENBSEwsRUFZTztBQUFBLFNBQVFGLE1BQU1DLEtBQU4sQ0FBWUUsV0FBcEI7QUFBQSxDQVpQLENBQU47O0FBZ0JBLElBQU1DLFlBQVk7QUFDaEJDLGVBQWEsZ0JBQU1DLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQURwQjtBQUVoQkMsa0JBQWdCLGdCQUFNSCxTQUFOLENBQWdCQztBQUZoQixDQUFsQjs7QUFLQSxJQUFNRyxhQUFhLFNBQWJBLFVBQWE7QUFBQSxNQUFFTCxXQUFGLFFBQUVBLFdBQUY7QUFBQSxNQUFlSSxjQUFmLFFBQWVBLGNBQWY7QUFBQSxNQUErQkUsRUFBL0IsUUFBK0JBLEVBQS9CO0FBQUEsU0FDakI7QUFBQyxvQkFBRDtBQUFBLE1BQWtCLDZCQUEwQkYsa0JBQWtCLEVBQTVDLENBQWxCLEVBQW9FLGdCQUFwRSxFQUE2RSxZQUFVRSxFQUF2RjtBQUNFLGlEQUFNLFFBQU8sTUFBYixHQURGO0FBRUU7QUFBQTtBQUFBLFFBQVMsSUFBSUEsRUFBYixFQUFpQixRQUFPLE9BQXhCO0FBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxzQkFBZjtBQUF1Q047QUFBdkM7QUFERjtBQUZGLEdBRGlCO0FBQUEsQ0FBbkI7O0FBU0FLLFdBQVdOLFNBQVgsR0FBdUJBLFNBQXZCOztrQkFFZU0sVSIsImZpbGUiOiJpbmZvLWhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJy4vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtEb2NzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgU3R5bGVkSW5mb0hlbHBlciA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PnByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcblxuICAuaW5mby1oZWxwZXJfX2NvbnRlbnQge1xuICAgIG1heC13aWR0aDogMTAwcHg7XG4gIH1cbiAgXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+cHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGRlc2NyaXB0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNvbnRhaW5lckNsYXNzOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBJbmZvSGVscGVyID0gKHtkZXNjcmlwdGlvbiwgY29udGFpbmVyQ2xhc3MsIGlkfSkgPT4gKFxuICA8U3R5bGVkSW5mb0hlbHBlciBjbGFzc05hbWU9e2BpbmZvLWhlbHBlciAke2NvbnRhaW5lckNsYXNzIHx8ICcnfWB9IGRhdGEtdGlwIGRhdGEtZm9yPXtpZH0+XG4gICAgPERvY3MgaGVpZ2h0PVwiMTZweFwiLz5cbiAgICA8VG9vbHRpcCBpZD17aWR9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm8taGVscGVyX19jb250ZW50XCI+e2Rlc2NyaXB0aW9ufTwvZGl2PlxuICAgIDwvVG9vbHRpcD5cbiAgPC9TdHlsZWRJbmZvSGVscGVyPlxuKTtcblxuSW5mb0hlbHBlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IEluZm9IZWxwZXI7XG4iXX0=