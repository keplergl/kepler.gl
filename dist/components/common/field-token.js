'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  background-color: rgba(', ', 0.2);\n  border-radius: 2px;\n  border: 1px solid rgb(', ');\n  color: rgb(', ');\n  display: inline-block;\n  font-size: 10px;\n  font-weight: 400;\n  padding: 0 5px;\n  text-align: center;\n  width: 40px;\n'], ['\n  background-color: rgba(', ', 0.2);\n  border-radius: 2px;\n  border: 1px solid rgb(', ');\n  color: rgb(', ');\n  display: inline-block;\n  font-size: 10px;\n  font-weight: 400;\n  padding: 0 5px;\n  text-align: center;\n  width: 40px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FieldTag = _styledComponents2.default.div(_templateObject, function (props) {
  return props.color;
}, function (props) {
  return props.color;
}, function (props) {
  return props.color;
});

var FieldToken = function FieldToken(_ref) {
  var type = _ref.type;
  return _react2.default.createElement(
    FieldTag,
    {
      color: _defaultSettings.FILED_TYPE_DISPLAY[type] && _defaultSettings.FILED_TYPE_DISPLAY[type].color || _defaultSettings.FIELD_COLORS.default
    },
    _defaultSettings.FILED_TYPE_DISPLAY[type].label
  );
};

exports.default = FieldToken;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWVsZC10b2tlbi5qcyJdLCJuYW1lcyI6WyJGaWVsZFRhZyIsImRpdiIsInByb3BzIiwiY29sb3IiLCJGaWVsZFRva2VuIiwidHlwZSIsImRlZmF1bHQiLCJsYWJlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBS0EsSUFBTUEsV0FBVywyQkFBT0MsR0FBbEIsa0JBQ3FCO0FBQUEsU0FBU0MsTUFBTUMsS0FBZjtBQUFBLENBRHJCLEVBR29CO0FBQUEsU0FBU0QsTUFBTUMsS0FBZjtBQUFBLENBSHBCLEVBSVM7QUFBQSxTQUFTRCxNQUFNQyxLQUFmO0FBQUEsQ0FKVCxDQUFOOztBQWFBLElBQU1DLGFBQWEsU0FBYkEsVUFBYTtBQUFBLE1BQUVDLElBQUYsUUFBRUEsSUFBRjtBQUFBLFNBQ2pCO0FBQUMsWUFBRDtBQUFBO0FBQ0UsYUFDRyxvQ0FBbUJBLElBQW5CLEtBQTRCLG9DQUFtQkEsSUFBbkIsRUFBeUJGLEtBQXRELElBQ0EsOEJBQWFHO0FBSGpCO0FBTUcsd0NBQW1CRCxJQUFuQixFQUF5QkU7QUFONUIsR0FEaUI7QUFBQSxDQUFuQjs7a0JBV2VILFUiLCJmaWxlIjoiZmllbGQtdG9rZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCB7XG4gIEZJTEVEX1RZUEVfRElTUExBWSxcbiAgRklFTERfQ09MT1JTXG59IGZyb20gJy4uLy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgRmllbGRUYWcgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKCR7cHJvcHMgPT4gcHJvcHMuY29sb3J9LCAwLjIpO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigke3Byb3BzID0+IHByb3BzLmNvbG9yfSk7XG4gIGNvbG9yOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvcn0pO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgcGFkZGluZzogMCA1cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDQwcHg7XG5gO1xuXG5jb25zdCBGaWVsZFRva2VuID0gKHt0eXBlfSkgPT4gKFxuICA8RmllbGRUYWdcbiAgICBjb2xvcj17XG4gICAgICAoRklMRURfVFlQRV9ESVNQTEFZW3R5cGVdICYmIEZJTEVEX1RZUEVfRElTUExBWVt0eXBlXS5jb2xvcikgfHxcbiAgICAgIEZJRUxEX0NPTE9SUy5kZWZhdWx0XG4gICAgfVxuICA+XG4gICAge0ZJTEVEX1RZUEVfRElTUExBWVt0eXBlXS5sYWJlbH1cbiAgPC9GaWVsZFRhZz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IEZpZWxkVG9rZW47XG4iXX0=