'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  font-weight: 500;\n  font-size: 12px;\n  color: ', ';\n'], ['\n  font-weight: 500;\n  font-size: 12px;\n  color: ', ';\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('./styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DatasetName = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.titleColorLT;
});

var DatasetLabel = function DatasetLabel(_ref) {
  var dataset = _ref.dataset;
  return _react2.default.createElement(
    _styledComponents3.CenterFlexbox,
    null,
    _react2.default.createElement(_styledComponents3.DatasetSquare, { className: 'dataset-clolor', color: dataset.color }),
    _react2.default.createElement(
      DatasetName,
      { className: 'dataset-name' },
      dataset.label
    )
  );
};

exports.default = DatasetLabel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9kYXRhc2V0LWxhYmVsLmpzIl0sIm5hbWVzIjpbIkRhdGFzZXROYW1lIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRpdGxlQ29sb3JMVCIsIkRhdGFzZXRMYWJlbCIsImRhdGFzZXQiLCJjb2xvciIsImxhYmVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxjQUFjLDJCQUFPQyxHQUFyQixrQkFHSztBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsWUFBckI7QUFBQSxDQUhMLENBQU47O0FBTUEsSUFBTUMsZUFBZSxTQUFmQSxZQUFlO0FBQUEsTUFBRUMsT0FBRixRQUFFQSxPQUFGO0FBQUEsU0FDbkI7QUFBQTtBQUFBO0FBQ0Usc0VBQWUsV0FBVSxnQkFBekIsRUFBMEMsT0FBT0EsUUFBUUMsS0FBekQsR0FERjtBQUVFO0FBQUMsaUJBQUQ7QUFBQSxRQUFhLFdBQVUsY0FBdkI7QUFBdUNELGNBQVFFO0FBQS9DO0FBRkYsR0FEbUI7QUFBQSxDQUFyQjs7a0JBT2VILFkiLCJmaWxlIjoiZGF0YXNldC1sYWJlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Q2VudGVyRmxleGJveCwgRGF0YXNldFNxdWFyZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBEYXRhc2V0TmFtZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVDb2xvckxUfTtcbmA7XG5cbmNvbnN0IERhdGFzZXRMYWJlbCA9ICh7ZGF0YXNldH0pID0+IChcbiAgPENlbnRlckZsZXhib3g+XG4gICAgPERhdGFzZXRTcXVhcmUgY2xhc3NOYW1lPVwiZGF0YXNldC1jbG9sb3JcIiBjb2xvcj17ZGF0YXNldC5jb2xvcn0gLz5cbiAgICA8RGF0YXNldE5hbWUgY2xhc3NOYW1lPVwiZGF0YXNldC1uYW1lXCI+e2RhdGFzZXQubGFiZWx9PC9EYXRhc2V0TmFtZT5cbiAgPC9DZW50ZXJGbGV4Ym94PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgRGF0YXNldExhYmVsO1xuIl19