"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _reactColor = require("react-color");

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

var _reselect = require("reselect");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .sketch-picker {\n    span {\n      color: ", " !important;\n      font-family: ", ";\n    }\n    input {\n      text-align: center;\n      font-family: ", ";\n      color: ", " !important;\n      border-color: ", " !important;\n      box-shadow: none !important;\n      background-color: ", " !important;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

// This was put in because 3rd party library react-color doesn't yet cater for customized color of child component <SketchField> which contains HEX/RGB input text box
// Issue raised: https://github.com/casesandberg/react-color/issues/631
var StyledPicker = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.fontFamily;
}, function (props) {
  return props.theme.fontFamily;
}, function (props) {
  return props.theme.inputColor;
}, function (props) {
  return props.theme.secondaryInputBgd;
}, function (props) {
  return props.theme.inputBgdHover;
});

var PRESET_COLORS = [];

var CustomPicker =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(CustomPicker, _Component);

  function CustomPicker() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, CustomPicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(CustomPicker)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "themeSelector", function (props) {
      return props.theme;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "pickerStyleSelector", (0, _reselect.createSelector)(_this.themeSelector, function (theme) {
      return {
        picker: {
          width: '200px',
          padding: '10px 10px 8px',
          boxSizing: 'initial',
          background: theme.panelBackground
        }
      };
    }));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
      _this.props.onSwatchClose();
    });
    return _this;
  }

  (0, _createClass2["default"])(CustomPicker, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          color = _this$props.color,
          onChange = _this$props.onChange;
      var pickerStyle = this.pickerStyleSelector(this.props);
      return _react["default"].createElement(StyledPicker, null, _react["default"].createElement(_reactColor.SketchPicker, {
        color: color,
        onChange: onChange,
        presetColors: PRESET_COLORS,
        styles: pickerStyle,
        disableAlpha: true
      }));
    }
  }]);
  return CustomPicker;
}(_react.Component);

(0, _defineProperty2["default"])(CustomPicker, "propTypes", {
  color: _propTypes["default"].string,
  onChange: _propTypes["default"].func,
  onSwatchClose: _propTypes["default"].func
});

var _default = (0, _styledComponents.withTheme)((0, _reactOnclickoutside["default"])(CustomPicker));

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY3VzdG9tLXBpY2tlci5qcyJdLCJuYW1lcyI6WyJTdHlsZWRQaWNrZXIiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwibGFiZWxDb2xvciIsImZvbnRGYW1pbHkiLCJpbnB1dENvbG9yIiwic2Vjb25kYXJ5SW5wdXRCZ2QiLCJpbnB1dEJnZEhvdmVyIiwiUFJFU0VUX0NPTE9SUyIsIkN1c3RvbVBpY2tlciIsInRoZW1lU2VsZWN0b3IiLCJwaWNrZXIiLCJ3aWR0aCIsInBhZGRpbmciLCJib3hTaXppbmciLCJiYWNrZ3JvdW5kIiwicGFuZWxCYWNrZ3JvdW5kIiwiZSIsIm9uU3dhdGNoQ2xvc2UiLCJjb2xvciIsIm9uQ2hhbmdlIiwicGlja2VyU3R5bGUiLCJwaWNrZXJTdHlsZVNlbGVjdG9yIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQyw2QkFBT0MsR0FBVixvQkFHSCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQWhCO0FBQUEsQ0FIRixFQUlHLFVBQUFGLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUUsVUFBaEI7QUFBQSxDQUpSLEVBUUcsVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxVQUFoQjtBQUFBLENBUlIsRUFTSCxVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlHLFVBQWhCO0FBQUEsQ0FURixFQVVJLFVBQUFKLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksaUJBQWhCO0FBQUEsQ0FWVCxFQVlRLFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUssYUFBaEI7QUFBQSxDQVpiLENBQWxCOztBQWlCQSxJQUFNQyxhQUFhLEdBQUcsRUFBdEI7O0lBRU1DLFk7Ozs7Ozs7Ozs7Ozs7Ozs7O3NHQU9ZLFVBQUFSLEtBQUs7QUFBQSxhQUFJQSxLQUFLLENBQUNDLEtBQVY7QUFBQSxLOzRHQUNDLDhCQUFlLE1BQUtRLGFBQXBCLEVBQW1DLFVBQUFSLEtBQUs7QUFBQSxhQUFLO0FBQ2pFUyxRQUFBQSxNQUFNLEVBQUU7QUFDTkMsVUFBQUEsS0FBSyxFQUFFLE9BREQ7QUFFTkMsVUFBQUEsT0FBTyxFQUFFLGVBRkg7QUFHTkMsVUFBQUEsU0FBUyxFQUFFLFNBSEw7QUFJTkMsVUFBQUEsVUFBVSxFQUFFYixLQUFLLENBQUNjO0FBSlo7QUFEeUQsT0FBTDtBQUFBLEtBQXhDLEM7MkdBU0QsVUFBQUMsQ0FBQyxFQUFJO0FBQ3hCLFlBQUtoQixLQUFMLENBQVdpQixhQUFYO0FBQ0QsSzs7Ozs7OzZCQUVRO0FBQUEsd0JBQ21CLEtBQUtqQixLQUR4QjtBQUFBLFVBQ0FrQixLQURBLGVBQ0FBLEtBREE7QUFBQSxVQUNPQyxRQURQLGVBQ09BLFFBRFA7QUFFUCxVQUFNQyxXQUFXLEdBQUcsS0FBS0MsbUJBQUwsQ0FBeUIsS0FBS3JCLEtBQTlCLENBQXBCO0FBQ0EsYUFDRSxnQ0FBQyxZQUFELFFBQ0UsZ0NBQUMsd0JBQUQ7QUFDRSxRQUFBLEtBQUssRUFBRWtCLEtBRFQ7QUFFRSxRQUFBLFFBQVEsRUFBRUMsUUFGWjtBQUdFLFFBQUEsWUFBWSxFQUFFWixhQUhoQjtBQUlFLFFBQUEsTUFBTSxFQUFFYSxXQUpWO0FBS0UsUUFBQSxZQUFZO0FBTGQsUUFERixDQURGO0FBV0Q7OztFQW5Dd0JFLGdCOztpQ0FBckJkLFksZUFDZTtBQUNqQlUsRUFBQUEsS0FBSyxFQUFFSyxzQkFBVUMsTUFEQTtBQUVqQkwsRUFBQUEsUUFBUSxFQUFFSSxzQkFBVUUsSUFGSDtBQUdqQlIsRUFBQUEsYUFBYSxFQUFFTSxzQkFBVUU7QUFIUixDOztlQXFDTixpQ0FBVSxxQ0FBZWpCLFlBQWYsQ0FBVixDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCwge3dpdGhUaGVtZX0gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtTa2V0Y2hQaWNrZXJ9IGZyb20gJ3JlYWN0LWNvbG9yJztcbmltcG9ydCBvbkNsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZSc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG4vLyBUaGlzIHdhcyBwdXQgaW4gYmVjYXVzZSAzcmQgcGFydHkgbGlicmFyeSByZWFjdC1jb2xvciBkb2Vzbid0IHlldCBjYXRlciBmb3IgY3VzdG9taXplZCBjb2xvciBvZiBjaGlsZCBjb21wb25lbnQgPFNrZXRjaEZpZWxkPiB3aGljaCBjb250YWlucyBIRVgvUkdCIGlucHV0IHRleHQgYm94XG4vLyBJc3N1ZSByYWlzZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9jYXNlc2FuZGJlcmcvcmVhY3QtY29sb3IvaXNzdWVzLzYzMVxuXG5jb25zdCBTdHlsZWRQaWNrZXIgPSBzdHlsZWQuZGl2YFxuICAuc2tldGNoLXBpY2tlciB7XG4gICAgc3BhbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfSAhaW1wb3J0YW50O1xuICAgICAgZm9udC1mYW1pbHk6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZm9udEZhbWlseX07XG4gICAgfVxuICAgIGlucHV0IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGZvbnQtZmFtaWx5OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmZvbnRGYW1pbHl9O1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRDb2xvcn0gIWltcG9ydGFudDtcbiAgICAgIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZH0gIWltcG9ydGFudDtcbiAgICAgIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCZ2RIb3Zlcn0gIWltcG9ydGFudDtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IFBSRVNFVF9DT0xPUlMgPSBbXTtcblxuY2xhc3MgQ3VzdG9tUGlja2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25Td2F0Y2hDbG9zZTogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICB0aGVtZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMudGhlbWU7XG4gIHBpY2tlclN0eWxlU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLnRoZW1lU2VsZWN0b3IsIHRoZW1lID0+ICh7XG4gICAgcGlja2VyOiB7XG4gICAgICB3aWR0aDogJzIwMHB4JyxcbiAgICAgIHBhZGRpbmc6ICcxMHB4IDEwcHggOHB4JyxcbiAgICAgIGJveFNpemluZzogJ2luaXRpYWwnLFxuICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFuZWxCYWNrZ3JvdW5kXG4gICAgfVxuICB9KSk7XG5cbiAgaGFuZGxlQ2xpY2tPdXRzaWRlID0gZSA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblN3YXRjaENsb3NlKCk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb2xvciwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBwaWNrZXJTdHlsZSA9IHRoaXMucGlja2VyU3R5bGVTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZFBpY2tlcj5cbiAgICAgICAgPFNrZXRjaFBpY2tlclxuICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgcHJlc2V0Q29sb3JzPXtQUkVTRVRfQ09MT1JTfVxuICAgICAgICAgIHN0eWxlcz17cGlja2VyU3R5bGV9XG4gICAgICAgICAgZGlzYWJsZUFscGhhXG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZFBpY2tlcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhUaGVtZShvbkNsaWNrT3V0c2lkZShDdXN0b21QaWNrZXIpKTtcbiJdfQ==