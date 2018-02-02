'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _class, _temp2, _initialiseProps;

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n'], ['\n  ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: absolute;\n  display: none;\n'], ['\n  position: absolute;\n  display: none;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  line-height: 0;\n  height: ', ';\n  margin-left: ', 'px;\n'], ['\n  line-height: 0;\n  height: ', ';\n  margin-left: ', 'px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

var propTypes = {
  id: _propTypes2.default.string.isRequired,
  label: _propTypes2.default.node,
  value: _propTypes2.default.oneOf([true, false, 'indeterminate']),
  checked: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,

  error: _propTypes2.default.string,
  switch: _propTypes2.default.bool,
  activeColor: _propTypes2.default.string,
  secondary: _propTypes2.default.bool,
  onBlur: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onFocus: _propTypes2.default.func
};

var defaultProps = {
  disabled: false,
  checked: false,
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  label: ''
};

var StyledLabel = _styledComponents2.default.label(_templateObject, function (props) {
  return props.secondary ? props.theme.secondarySwitch : props.theme.inputSwitch;
});

var HiddenInput = _styledComponents2.default.input(_templateObject2);

var StyledCheckbox = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.switchBtnHeight;
}, function (props) {
  return props.theme.switchLabelMargin;
});

var Checkbox = (_temp2 = _class = function (_React$Component) {
  (0, _inherits3.default)(Checkbox, _React$Component);

  function Checkbox() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Checkbox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  Checkbox.prototype.render = function render() {
    var inputProps = (0, _extends3.default)({}, (0, _lodash2.default)(this.props, ['checked', 'disabled', 'id', 'onChange', 'value']), {
      type: 'checkbox',
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    });

    var labelProps = (0, _extends3.default)({}, (0, _lodash2.default)(this.props, ['checked', 'disabled', 'secondary']), {
      htmlFor: this.props.id
    });
    return _react2.default.createElement(
      StyledCheckbox,
      { className: 'checkbox' },
      _react2.default.createElement(HiddenInput, inputProps),
      _react2.default.createElement(
        StyledLabel,
        (0, _extends3.default)({ chassName: 'checkbox__label' }, labelProps),
        this.props.label
      )
    );
  };

  return Checkbox;
}(_react2.default.Component), _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.state = {
    focused: false
  };

  this.handleFocus = function (args) {
    _this2.setState({ focused: true });
    _this2.props.onFocus(args);
  };

  this.handleBlur = function (args) {
    _this2.setState({ focused: false });
    _this2.props.onBlur(args);
  };
}, _temp2);


Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

exports.default = Checkbox;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jaGVja2JveC5qcyJdLCJuYW1lcyI6WyJub29wIiwicHJvcFR5cGVzIiwiaWQiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibGFiZWwiLCJub2RlIiwidmFsdWUiLCJvbmVPZiIsImNoZWNrZWQiLCJib29sIiwiZGlzYWJsZWQiLCJlcnJvciIsInN3aXRjaCIsImFjdGl2ZUNvbG9yIiwic2Vjb25kYXJ5Iiwib25CbHVyIiwiZnVuYyIsIm9uQ2hhbmdlIiwib25Gb2N1cyIsImRlZmF1bHRQcm9wcyIsIlN0eWxlZExhYmVsIiwicHJvcHMiLCJ0aGVtZSIsInNlY29uZGFyeVN3aXRjaCIsImlucHV0U3dpdGNoIiwiSGlkZGVuSW5wdXQiLCJpbnB1dCIsIlN0eWxlZENoZWNrYm94IiwiZGl2Iiwic3dpdGNoQnRuSGVpZ2h0Iiwic3dpdGNoTGFiZWxNYXJnaW4iLCJDaGVja2JveCIsInJlbmRlciIsImlucHV0UHJvcHMiLCJ0eXBlIiwiaGFuZGxlRm9jdXMiLCJoYW5kbGVCbHVyIiwibGFiZWxQcm9wcyIsImh0bWxGb3IiLCJDb21wb25lbnQiLCJzdGF0ZSIsImZvY3VzZWQiLCJzZXRTdGF0ZSIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEIsSUFBTUMsWUFBWTtBQUNoQkMsTUFBSSxvQkFBVUMsTUFBVixDQUFpQkMsVUFETDtBQUVoQkMsU0FBTyxvQkFBVUMsSUFGRDtBQUdoQkMsU0FBTyxvQkFBVUMsS0FBVixDQUFnQixDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsZUFBZCxDQUFoQixDQUhTO0FBSWhCQyxXQUFTLG9CQUFVQyxJQUpIO0FBS2hCQyxZQUFVLG9CQUFVRCxJQUxKOztBQU9oQkUsU0FBTyxvQkFBVVQsTUFQRDtBQVFoQlUsVUFBUSxvQkFBVUgsSUFSRjtBQVNoQkksZUFBYSxvQkFBVVgsTUFUUDtBQVVoQlksYUFBVyxvQkFBVUwsSUFWTDtBQVdoQk0sVUFBUSxvQkFBVUMsSUFYRjtBQVloQkMsWUFBVSxvQkFBVUQsSUFaSjtBQWFoQkUsV0FBUyxvQkFBVUY7QUFiSCxDQUFsQjs7QUFnQkEsSUFBTUcsZUFBZTtBQUNuQlQsWUFBVSxLQURTO0FBRW5CRixXQUFTLEtBRlU7QUFHbkJPLFVBQVFoQixJQUhXO0FBSW5Ca0IsWUFBVWxCLElBSlM7QUFLbkJtQixXQUFTbkIsSUFMVTtBQU1uQkssU0FBTztBQU5ZLENBQXJCOztBQVNBLElBQU1nQixjQUFjLDJCQUFPaEIsS0FBckIsa0JBQ0Y7QUFBQSxTQUNBaUIsTUFBTVAsU0FBTixHQUFrQk8sTUFBTUMsS0FBTixDQUFZQyxlQUE5QixHQUFnREYsTUFBTUMsS0FBTixDQUFZRSxXQUQ1RDtBQUFBLENBREUsQ0FBTjs7QUFLQSxJQUFNQyxjQUFjLDJCQUFPQyxLQUFyQixrQkFBTjs7QUFLQSxJQUFNQyxpQkFBaUIsMkJBQU9DLEdBQXhCLG1CQUVNO0FBQUEsU0FBU1AsTUFBTUMsS0FBTixDQUFZTyxlQUFyQjtBQUFBLENBRk4sRUFHVztBQUFBLFNBQVNSLE1BQU1DLEtBQU4sQ0FBWVEsaUJBQXJCO0FBQUEsQ0FIWCxDQUFOOztJQU1NQyxROzs7Ozs7Ozs7Ozs7Ozs7cUJBZUpDLE0scUJBQVM7QUFDUCxRQUFNQyx3Q0FDRCxzQkFBSyxLQUFLWixLQUFWLEVBQWlCLENBQUMsU0FBRCxFQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFBOEIsVUFBOUIsRUFBMEMsT0FBMUMsQ0FBakIsQ0FEQztBQUVKYSxZQUFNLFVBRkY7QUFHSmhCLGVBQVMsS0FBS2lCLFdBSFY7QUFJSnBCLGNBQVEsS0FBS3FCO0FBSlQsTUFBTjs7QUFPQSxRQUFNQyx3Q0FDRCxzQkFBSyxLQUFLaEIsS0FBVixFQUFpQixDQUFDLFNBQUQsRUFBWSxVQUFaLEVBQXdCLFdBQXhCLENBQWpCLENBREM7QUFFSmlCLGVBQVMsS0FBS2pCLEtBQUwsQ0FBV3BCO0FBRmhCLE1BQU47QUFJQSxXQUNFO0FBQUMsb0JBQUQ7QUFBQSxRQUFnQixXQUFVLFVBQTFCO0FBQ0Usb0NBQUMsV0FBRCxFQUFpQmdDLFVBQWpCLENBREY7QUFFRTtBQUFDLG1CQUFEO0FBQUEsaUNBQWEsV0FBVSxpQkFBdkIsSUFBNkNJLFVBQTdDO0FBQ0csYUFBS2hCLEtBQUwsQ0FBV2pCO0FBRGQ7QUFGRixLQURGO0FBUUQsRzs7O0VBbkNvQixnQkFBTW1DLFM7OztPQUMzQkMsSyxHQUFRO0FBQ05DLGFBQVM7QUFESCxHOztPQUlSTixXLEdBQWMsZ0JBQVE7QUFDcEIsV0FBS08sUUFBTCxDQUFjLEVBQUNELFNBQVMsSUFBVixFQUFkO0FBQ0EsV0FBS3BCLEtBQUwsQ0FBV0gsT0FBWCxDQUFtQnlCLElBQW5CO0FBQ0QsRzs7T0FFRFAsVSxHQUFhLGdCQUFRO0FBQ25CLFdBQUtNLFFBQUwsQ0FBYyxFQUFDRCxTQUFTLEtBQVYsRUFBZDtBQUNBLFdBQUtwQixLQUFMLENBQVdOLE1BQVgsQ0FBa0I0QixJQUFsQjtBQUNELEc7Ozs7QUF5QkhaLFNBQVMvQixTQUFULEdBQXFCQSxTQUFyQjtBQUNBK0IsU0FBU1osWUFBVCxHQUF3QkEsWUFBeEI7O2tCQUVlWSxRIiwiZmlsZSI6ImNoZWNrYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBwaWNrIGZyb20gJ2xvZGFzaC5waWNrJztcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5ub2RlLFxuICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mKFt0cnVlLCBmYWxzZSwgJ2luZGV0ZXJtaW5hdGUnXSksXG4gIGNoZWNrZWQ6IFByb3BUeXBlcy5ib29sLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgZXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHN3aXRjaDogUHJvcFR5cGVzLmJvb2wsXG4gIGFjdGl2ZUNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzZWNvbmRhcnk6IFByb3BUeXBlcy5ib29sLFxuICBvbkJsdXI6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uRm9jdXM6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgY2hlY2tlZDogZmFsc2UsXG4gIG9uQmx1cjogbm9vcCxcbiAgb25DaGFuZ2U6IG5vb3AsXG4gIG9uRm9jdXM6IG5vb3AsXG4gIGxhYmVsOiAnJ1xufTtcblxuY29uc3QgU3R5bGVkTGFiZWwgPSBzdHlsZWQubGFiZWxgXG4gICR7cHJvcHMgPT5cbiAgICBwcm9wcy5zZWNvbmRhcnkgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlTd2l0Y2ggOiBwcm9wcy50aGVtZS5pbnB1dFN3aXRjaH07XG5gO1xuXG5jb25zdCBIaWRkZW5JbnB1dCA9IHN0eWxlZC5pbnB1dGBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBub25lO1xuYDtcblxuY29uc3QgU3R5bGVkQ2hlY2tib3ggPSBzdHlsZWQuZGl2YFxuICBsaW5lLWhlaWdodDogMDtcbiAgaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaEJ0bkhlaWdodH07XG4gIG1hcmdpbi1sZWZ0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaExhYmVsTWFyZ2lufXB4O1xuYDtcblxuY2xhc3MgQ2hlY2tib3ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBmb2N1c2VkOiBmYWxzZVxuICB9O1xuXG4gIGhhbmRsZUZvY3VzID0gYXJncyA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Zm9jdXNlZDogdHJ1ZX0pO1xuICAgIHRoaXMucHJvcHMub25Gb2N1cyhhcmdzKTtcbiAgfTtcblxuICBoYW5kbGVCbHVyID0gYXJncyA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Zm9jdXNlZDogZmFsc2V9KTtcbiAgICB0aGlzLnByb3BzLm9uQmx1cihhcmdzKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaW5wdXRQcm9wcyA9IHtcbiAgICAgIC4uLnBpY2sodGhpcy5wcm9wcywgWydjaGVja2VkJywgJ2Rpc2FibGVkJywgJ2lkJywgJ29uQ2hhbmdlJywgJ3ZhbHVlJ10pLFxuICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgIG9uRm9jdXM6IHRoaXMuaGFuZGxlRm9jdXMsXG4gICAgICBvbkJsdXI6IHRoaXMuaGFuZGxlQmx1clxuICAgIH07XG5cbiAgICBjb25zdCBsYWJlbFByb3BzID0ge1xuICAgICAgLi4ucGljayh0aGlzLnByb3BzLCBbJ2NoZWNrZWQnLCAnZGlzYWJsZWQnLCAnc2Vjb25kYXJ5J10pLFxuICAgICAgaHRtbEZvcjogdGhpcy5wcm9wcy5pZFxuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRDaGVja2JveCBjbGFzc05hbWU9XCJjaGVja2JveFwiPlxuICAgICAgICA8SGlkZGVuSW5wdXQgey4uLmlucHV0UHJvcHN9IC8+XG4gICAgICAgIDxTdHlsZWRMYWJlbCBjaGFzc05hbWU9XCJjaGVja2JveF9fbGFiZWxcIiB7Li4ubGFiZWxQcm9wc30+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgIDwvU3R5bGVkTGFiZWw+XG4gICAgICA8L1N0eWxlZENoZWNrYm94PlxuICAgICk7XG4gIH1cbn1cblxuQ2hlY2tib3gucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuQ2hlY2tib3guZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5leHBvcnQgZGVmYXVsdCBDaGVja2JveDtcbiJdfQ==