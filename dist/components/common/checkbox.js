"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _lodash = _interopRequireDefault(require("lodash.pick"));

var _classnames = _interopRequireDefault(require("classnames"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  min-height: ", ";\n  margin-left: ", "px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  display: none;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function noop() {}

var StyledSwitchInput = _styledComponents["default"].label(_templateObject(), function (props) {
  return props.secondary ? props.theme.secondarySwitch : props.theme.inputSwitch;
});

var StyledCheckboxInput = _styledComponents["default"].label(_templateObject2(), function (props) {
  return props.theme.inputCheckbox;
});

var HiddenInput = _styledComponents["default"].input(_templateObject3());

var StyledCheckbox = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.theme.switchBtnHeight;
}, function (props) {
  return props.theme.switchLabelMargin;
});

var Checkbox =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Checkbox, _Component);

  function Checkbox() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, Checkbox);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(Checkbox)).call.apply(_getPrototypeOf2, [this].concat(_args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      focused: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleFocus", function (args) {
      _this.setState({
        focused: true
      });

      _this.props.onFocus(args);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleBlur", function (args) {
      _this.setState({
        focused: false
      });

      _this.props.onBlur(args);
    });
    return _this;
  }

  (0, _createClass2["default"])(Checkbox, [{
    key: "render",
    value: function render() {
      var inputProps = _objectSpread({}, (0, _lodash["default"])(this.props, ['checked', 'disabled', 'id', 'onChange', 'value']), {
        type: 'checkbox',
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      });

      var labelProps = _objectSpread({}, (0, _lodash["default"])(this.props, ['checked', 'disabled', 'secondary']), {
        htmlFor: this.props.id
      });

      var LabelElement = this.props.type === 'checkbox' ? StyledCheckboxInput : StyledSwitchInput;
      return _react["default"].createElement(StyledCheckbox, {
        className: (0, _classnames["default"])('kg-checkbox', this.props.className)
      }, _react["default"].createElement(HiddenInput, inputProps), _react["default"].createElement(LabelElement, (0, _extends2["default"])({
        className: "kg-checkbox__label"
      }, labelProps), this.props.label));
    }
  }]);
  return Checkbox;
}(_react.Component);

exports["default"] = Checkbox;
(0, _defineProperty2["default"])(Checkbox, "propTypes", {
  id: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].node,
  value: _propTypes["default"].oneOf([true, false, 'indeterminate']),
  checked: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  error: _propTypes["default"].string,
  "switch": _propTypes["default"].bool,
  activeColor: _propTypes["default"].string,
  secondary: _propTypes["default"].bool,
  onBlur: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  onFocus: _propTypes["default"].func
});
(0, _defineProperty2["default"])(Checkbox, "defaultProps", {
  disabled: false,
  checked: false,
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  label: ''
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jaGVja2JveC5qcyJdLCJuYW1lcyI6WyJub29wIiwiU3R5bGVkU3dpdGNoSW5wdXQiLCJzdHlsZWQiLCJsYWJlbCIsInByb3BzIiwic2Vjb25kYXJ5IiwidGhlbWUiLCJzZWNvbmRhcnlTd2l0Y2giLCJpbnB1dFN3aXRjaCIsIlN0eWxlZENoZWNrYm94SW5wdXQiLCJpbnB1dENoZWNrYm94IiwiSGlkZGVuSW5wdXQiLCJpbnB1dCIsIlN0eWxlZENoZWNrYm94IiwiZGl2Iiwic3dpdGNoQnRuSGVpZ2h0Iiwic3dpdGNoTGFiZWxNYXJnaW4iLCJDaGVja2JveCIsImZvY3VzZWQiLCJhcmdzIiwic2V0U3RhdGUiLCJvbkZvY3VzIiwib25CbHVyIiwiaW5wdXRQcm9wcyIsInR5cGUiLCJoYW5kbGVGb2N1cyIsImhhbmRsZUJsdXIiLCJsYWJlbFByb3BzIiwiaHRtbEZvciIsImlkIiwiTGFiZWxFbGVtZW50IiwiY2xhc3NOYW1lIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm5vZGUiLCJ2YWx1ZSIsIm9uZU9mIiwiY2hlY2tlZCIsImJvb2wiLCJkaXNhYmxlZCIsImVycm9yIiwiYWN0aXZlQ29sb3IiLCJmdW5jIiwib25DaGFuZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsU0FBU0EsSUFBVCxHQUFnQixDQUFFOztBQUVsQixJQUFNQyxpQkFBaUIsR0FBR0MsNkJBQU9DLEtBQVYsb0JBQ25CLFVBQUFDLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNDLFNBQU4sR0FBa0JELEtBQUssQ0FBQ0UsS0FBTixDQUFZQyxlQUE5QixHQUFnREgsS0FBSyxDQUFDRSxLQUFOLENBQVlFLFdBQWpFO0FBQUEsQ0FEYyxDQUF2Qjs7QUFJQSxJQUFNQyxtQkFBbUIsR0FBR1AsNkJBQU9DLEtBQVYscUJBQ3JCLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNFLEtBQU4sQ0FBWUksYUFBaEI7QUFBQSxDQURnQixDQUF6Qjs7QUFJQSxJQUFNQyxXQUFXLEdBQUdULDZCQUFPVSxLQUFWLG9CQUFqQjs7QUFLQSxJQUFNQyxjQUFjLEdBQUdYLDZCQUFPWSxHQUFWLHFCQUVKLFVBQUFWLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNFLEtBQU4sQ0FBWVMsZUFBaEI7QUFBQSxDQUZELEVBR0gsVUFBQVgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZVSxpQkFBaEI7QUFBQSxDQUhGLENBQXBCOztJQU1xQkMsUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OEZBMEJYO0FBQ05DLE1BQUFBLE9BQU8sRUFBRTtBQURILEs7b0dBSU0sVUFBQUMsSUFBSSxFQUFJO0FBQ3BCLFlBQUtDLFFBQUwsQ0FBYztBQUFDRixRQUFBQSxPQUFPLEVBQUU7QUFBVixPQUFkOztBQUNBLFlBQUtkLEtBQUwsQ0FBV2lCLE9BQVgsQ0FBbUJGLElBQW5CO0FBQ0QsSzttR0FFWSxVQUFBQSxJQUFJLEVBQUk7QUFDbkIsWUFBS0MsUUFBTCxDQUFjO0FBQUNGLFFBQUFBLE9BQU8sRUFBRTtBQUFWLE9BQWQ7O0FBQ0EsWUFBS2QsS0FBTCxDQUFXa0IsTUFBWCxDQUFrQkgsSUFBbEI7QUFDRCxLOzs7Ozs7NkJBRVE7QUFDUCxVQUFNSSxVQUFVLHFCQUNYLHdCQUFLLEtBQUtuQixLQUFWLEVBQWlCLENBQUMsU0FBRCxFQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFBOEIsVUFBOUIsRUFBMEMsT0FBMUMsQ0FBakIsQ0FEVztBQUVkb0IsUUFBQUEsSUFBSSxFQUFFLFVBRlE7QUFHZEgsUUFBQUEsT0FBTyxFQUFFLEtBQUtJLFdBSEE7QUFJZEgsUUFBQUEsTUFBTSxFQUFFLEtBQUtJO0FBSkMsUUFBaEI7O0FBT0EsVUFBTUMsVUFBVSxxQkFDWCx3QkFBSyxLQUFLdkIsS0FBVixFQUFpQixDQUFDLFNBQUQsRUFBWSxVQUFaLEVBQXdCLFdBQXhCLENBQWpCLENBRFc7QUFFZHdCLFFBQUFBLE9BQU8sRUFBRSxLQUFLeEIsS0FBTCxDQUFXeUI7QUFGTixRQUFoQjs7QUFLQSxVQUFNQyxZQUFZLEdBQUcsS0FBSzFCLEtBQUwsQ0FBV29CLElBQVgsS0FBb0IsVUFBcEIsR0FBaUNmLG1CQUFqQyxHQUF1RFIsaUJBQTVFO0FBQ0EsYUFDRSxnQ0FBQyxjQUFEO0FBQWdCLFFBQUEsU0FBUyxFQUFFLDRCQUFXLGFBQVgsRUFBMEIsS0FBS0csS0FBTCxDQUFXMkIsU0FBckM7QUFBM0IsU0FDRSxnQ0FBQyxXQUFELEVBQWlCUixVQUFqQixDQURGLEVBRUUsZ0NBQUMsWUFBRDtBQUFjLFFBQUEsU0FBUyxFQUFDO0FBQXhCLFNBQWlESSxVQUFqRCxHQUNHLEtBQUt2QixLQUFMLENBQVdELEtBRGQsQ0FGRixDQURGO0FBUUQ7OztFQTlEbUM2QixnQjs7O2lDQUFqQmYsUSxlQUNBO0FBQ2pCWSxFQUFBQSxFQUFFLEVBQUVJLHNCQUFVQyxNQUFWLENBQWlCQyxVQURKO0FBRWpCaEMsRUFBQUEsS0FBSyxFQUFFOEIsc0JBQVVHLElBRkE7QUFHakJDLEVBQUFBLEtBQUssRUFBRUosc0JBQVVLLEtBQVYsQ0FBZ0IsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLGVBQWQsQ0FBaEIsQ0FIVTtBQUlqQkMsRUFBQUEsT0FBTyxFQUFFTixzQkFBVU8sSUFKRjtBQUtqQkMsRUFBQUEsUUFBUSxFQUFFUixzQkFBVU8sSUFMSDtBQU9qQkUsRUFBQUEsS0FBSyxFQUFFVCxzQkFBVUMsTUFQQTtBQVFqQixZQUFRRCxzQkFBVU8sSUFSRDtBQVNqQkcsRUFBQUEsV0FBVyxFQUFFVixzQkFBVUMsTUFUTjtBQVVqQjdCLEVBQUFBLFNBQVMsRUFBRTRCLHNCQUFVTyxJQVZKO0FBV2pCbEIsRUFBQUEsTUFBTSxFQUFFVyxzQkFBVVcsSUFYRDtBQVlqQkMsRUFBQUEsUUFBUSxFQUFFWixzQkFBVVcsSUFaSDtBQWFqQnZCLEVBQUFBLE9BQU8sRUFBRVksc0JBQVVXO0FBYkYsQztpQ0FEQTNCLFEsa0JBaUJHO0FBQ3BCd0IsRUFBQUEsUUFBUSxFQUFFLEtBRFU7QUFFcEJGLEVBQUFBLE9BQU8sRUFBRSxLQUZXO0FBR3BCakIsRUFBQUEsTUFBTSxFQUFFdEIsSUFIWTtBQUlwQjZDLEVBQUFBLFFBQVEsRUFBRTdDLElBSlU7QUFLcEJxQixFQUFBQSxPQUFPLEVBQUVyQixJQUxXO0FBTXBCRyxFQUFBQSxLQUFLLEVBQUU7QUFOYSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgcGljayBmcm9tICdsb2Rhc2gucGljayc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmNvbnN0IFN0eWxlZFN3aXRjaElucHV0ID0gc3R5bGVkLmxhYmVsYFxuICAke3Byb3BzID0+IChwcm9wcy5zZWNvbmRhcnkgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlTd2l0Y2ggOiBwcm9wcy50aGVtZS5pbnB1dFN3aXRjaCl9O1xuYDtcblxuY29uc3QgU3R5bGVkQ2hlY2tib3hJbnB1dCA9IHN0eWxlZC5sYWJlbGBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dENoZWNrYm94fVxuYDtcblxuY29uc3QgSGlkZGVuSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogbm9uZTtcbmA7XG5cbmNvbnN0IFN0eWxlZENoZWNrYm94ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgbWluLWhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5IZWlnaHR9O1xuICBtYXJnaW4tbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hMYWJlbE1hcmdpbn1weDtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZWNrYm94IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGxhYmVsOiBQcm9wVHlwZXMubm9kZSxcbiAgICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mKFt0cnVlLCBmYWxzZSwgJ2luZGV0ZXJtaW5hdGUnXSksXG4gICAgY2hlY2tlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuXG4gICAgZXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc3dpdGNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBhY3RpdmVDb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzZWNvbmRhcnk6IFByb3BUeXBlcy5ib29sLFxuICAgIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRm9jdXM6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgY2hlY2tlZDogZmFsc2UsXG4gICAgb25CbHVyOiBub29wLFxuICAgIG9uQ2hhbmdlOiBub29wLFxuICAgIG9uRm9jdXM6IG5vb3AsXG4gICAgbGFiZWw6ICcnXG4gIH07XG5cbiAgc3RhdGUgPSB7XG4gICAgZm9jdXNlZDogZmFsc2VcbiAgfTtcblxuICBoYW5kbGVGb2N1cyA9IGFyZ3MgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2ZvY3VzZWQ6IHRydWV9KTtcbiAgICB0aGlzLnByb3BzLm9uRm9jdXMoYXJncyk7XG4gIH07XG5cbiAgaGFuZGxlQmx1ciA9IGFyZ3MgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2ZvY3VzZWQ6IGZhbHNlfSk7XG4gICAgdGhpcy5wcm9wcy5vbkJsdXIoYXJncyk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlucHV0UHJvcHMgPSB7XG4gICAgICAuLi5waWNrKHRoaXMucHJvcHMsIFsnY2hlY2tlZCcsICdkaXNhYmxlZCcsICdpZCcsICdvbkNoYW5nZScsICd2YWx1ZSddKSxcbiAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICBvbkZvY3VzOiB0aGlzLmhhbmRsZUZvY3VzLFxuICAgICAgb25CbHVyOiB0aGlzLmhhbmRsZUJsdXJcbiAgICB9O1xuXG4gICAgY29uc3QgbGFiZWxQcm9wcyA9IHtcbiAgICAgIC4uLnBpY2sodGhpcy5wcm9wcywgWydjaGVja2VkJywgJ2Rpc2FibGVkJywgJ3NlY29uZGFyeSddKSxcbiAgICAgIGh0bWxGb3I6IHRoaXMucHJvcHMuaWRcbiAgICB9O1xuXG4gICAgY29uc3QgTGFiZWxFbGVtZW50ID0gdGhpcy5wcm9wcy50eXBlID09PSAnY2hlY2tib3gnID8gU3R5bGVkQ2hlY2tib3hJbnB1dCA6IFN0eWxlZFN3aXRjaElucHV0O1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkQ2hlY2tib3ggY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdrZy1jaGVja2JveCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lKX0+XG4gICAgICAgIDxIaWRkZW5JbnB1dCB7Li4uaW5wdXRQcm9wc30gLz5cbiAgICAgICAgPExhYmVsRWxlbWVudCBjbGFzc05hbWU9XCJrZy1jaGVja2JveF9fbGFiZWxcIiB7Li4ubGFiZWxQcm9wc30+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgIDwvTGFiZWxFbGVtZW50PlxuICAgICAgPC9TdHlsZWRDaGVja2JveD5cbiAgICApO1xuICB9XG59XG4iXX0=