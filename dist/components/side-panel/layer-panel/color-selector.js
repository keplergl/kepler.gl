'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  width: 32px;\n  height: 18px;\n  border-radius: 1px;\n  background-color: ', ';\n'], ['\n  width: 32px;\n  height: 18px;\n  border-radius: 1px;\n  background-color: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  ', ';\n  height: ', ';\n'], ['\n  ', ';\n  height: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  justify-content: space-between;\n\n  .color-select__input-group {\n    flex-grow: 1;\n  }\n  .color-select__input-group:nth-child(2) {\n    margin-left: 12px;\n  }\n'], ['\n  display: flex;\n  justify-content: space-between;\n\n  .color-select__input-group {\n    flex-grow: 1;\n  }\n  .color-select__input-group:nth-child(2) {\n    margin-left: 12px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colorUtils = require('../../../utils/color-utils');

var _singleColorPalette = require('./single-color-palette');

var _singleColorPalette2 = _interopRequireDefault(_singleColorPalette);

var _colorRangeSelector = require('./color-range-selector');

var _colorRangeSelector2 = _interopRequireDefault(_colorRangeSelector);

var _colorPalette = require('./color-palette');

var _colorPalette2 = _interopRequireDefault(_colorPalette);

var _styledComponents3 = require('../../common/styled-components');

var _decorator = require('react-onclickoutside/decorator');

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  colorSets: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    selectedColor: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
    setColor: _propTypes2.default.func.isRequired,
    isRange: _propTypes2.default.bool,
    label: _propTypes2.default.string
  })),
  inputTheme: _propTypes2.default.string,
  disabled: _propTypes2.default.bool
};

var defaultProps = {
  colorSets: []
};

var ColorBlock = _styledComponents2.default.div(_templateObject, function (props) {
  return 'rgb(' + props.color.slice(0, 3).join(',') + ')';
});

var ColorSelectorInput = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.inputTheme === 'secondary' ? props.theme.secondaryInput : props.theme.input;
}, function (props) {
  return props.theme.inputBoxHeight;
});

var InputBoxContainer = _styledComponents2.default.div(_templateObject3);

var ColorSelector = function (_Component) {
  (0, _inherits3.default)(ColorSelector, _Component);

  function ColorSelector() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ColorSelector.__proto__ || Object.getPrototypeOf(ColorSelector)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      editing: false
    }, _this.handleClickOutside = function (e) {
      if (_this.state.editing !== false) {
        _this.setState({ editing: false });
      }
    }, _this._onSelectColor = function (color, e) {
      e.stopPropagation();
      if (_this.props.colorSets[_this.state.editing]) {
        _this.props.colorSets[_this.state.editing].setColor(color);
      }
    }, _this._showDropdown = function (e, i) {
      e.stopPropagation();
      e.preventDefault();
      _this.setState({ editing: i });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ColorSelector, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          colorSets = _props.colorSets,
          disabled = _props.disabled,
          inputTheme = _props.inputTheme;
      var editing = this.state.editing;

      var currentEditing = colorSets[editing] && (0, _typeof3.default)(colorSets[editing]) === 'object';

      return _react2.default.createElement(
        'div',
        { className: 'color-selector' },
        _react2.default.createElement(
          InputBoxContainer,
          null,
          colorSets.map(function (cSet, i) {
            return _react2.default.createElement(
              'div',
              { className: 'color-select__input-group', key: i },
              cSet.label ? _react2.default.createElement(
                _styledComponents3.PanelLabel,
                null,
                cSet.label
              ) : null,
              _react2.default.createElement(
                ColorSelectorInput,
                {
                  className: 'color-selector__selector',
                  active: editing === i,
                  disabled: disabled,
                  inputTheme: inputTheme,
                  onMouseDown: function onMouseDown(e) {
                    return _this2._showDropdown(e, i);
                  }
                },
                cSet.isRange ? _react2.default.createElement(_colorPalette2.default, { colors: cSet.selectedColor.colors }) : _react2.default.createElement(ColorBlock, {
                  className: 'color-selector__selector__block',
                  color: cSet.selectedColor
                })
              )
            );
          })
        ),
        currentEditing ? _react2.default.createElement(
          _styledComponents3.StyledPanelDropdown,
          { className: 'color-selector__dropdown' },
          colorSets[editing].isRange ? _react2.default.createElement(_colorRangeSelector2.default, {
            selectedColorRange: colorSets[editing].selectedColor,
            onSelectColorRange: this._onSelectColor
          }) : _react2.default.createElement(_singleColorPalette2.default, {
            selectedColor: (0, _colorUtils.rgbToHex)(colorSets[editing].selectedColor),
            onSelectColor: this._onSelectColor
          })
        ) : null
      );
    }
  }]);
  return ColorSelector;
}(_react.Component);

ColorSelector.propTypes = propTypes;
ColorSelector.defaultProps = defaultProps;

exports.default = (0, _decorator2.default)(ColorSelector);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3Itc2VsZWN0b3IuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiY29sb3JTZXRzIiwiYXJyYXlPZiIsInNoYXBlIiwic2VsZWN0ZWRDb2xvciIsIm9uZU9mVHlwZSIsImFycmF5Iiwib2JqZWN0Iiwic2V0Q29sb3IiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImlzUmFuZ2UiLCJib29sIiwibGFiZWwiLCJzdHJpbmciLCJpbnB1dFRoZW1lIiwiZGlzYWJsZWQiLCJkZWZhdWx0UHJvcHMiLCJDb2xvckJsb2NrIiwiZGl2IiwicHJvcHMiLCJjb2xvciIsInNsaWNlIiwiam9pbiIsIkNvbG9yU2VsZWN0b3JJbnB1dCIsInRoZW1lIiwic2Vjb25kYXJ5SW5wdXQiLCJpbnB1dCIsImlucHV0Qm94SGVpZ2h0IiwiSW5wdXRCb3hDb250YWluZXIiLCJDb2xvclNlbGVjdG9yIiwic3RhdGUiLCJlZGl0aW5nIiwiaGFuZGxlQ2xpY2tPdXRzaWRlIiwic2V0U3RhdGUiLCJfb25TZWxlY3RDb2xvciIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJfc2hvd0Ryb3Bkb3duIiwiaSIsInByZXZlbnREZWZhdWx0IiwiY3VycmVudEVkaXRpbmciLCJtYXAiLCJjU2V0IiwiY29sb3JzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBSUE7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLGFBQVcsb0JBQVVDLE9BQVYsQ0FDVCxvQkFBVUMsS0FBVixDQUFnQjtBQUNkQyxtQkFBZSxvQkFBVUMsU0FBVixDQUFvQixDQUFDLG9CQUFVQyxLQUFYLEVBQWtCLG9CQUFVQyxNQUE1QixDQUFwQixDQUREO0FBRWRDLGNBQVUsb0JBQVVDLElBQVYsQ0FB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LEdBR0MsOEJBQUMsVUFBRDtBQUNFLDZCQUFVLGlDQURaO0FBRUUseUJBQU9ELEtBQUt2QztBQUZkO0FBVko7QUFGRixhQURhO0FBQUEsV0FBZDtBQURILFNBREY7QUF3QkdxQyx5QkFDQztBQUFBO0FBQUEsWUFBcUIsV0FBVSwwQkFBL0I7QUFDR3hDLG9CQUFVK0IsT0FBVixFQUFtQnJCLE9BQW5CLEdBQ0M7QUFDRSxnQ0FBb0JWLFVBQVUrQixPQUFWLEVBQW1CNUIsYUFEekM7QUFFRSxnQ0FBb0IsS0FBSytCO0FBRjNCLFlBREQsR0FNQztBQUNFLDJCQUFlLDBCQUFTbEMsVUFBVStCLE9BQVYsRUFBbUI1QixhQUE1QixDQURqQjtBQUVFLDJCQUFlLEtBQUsrQjtBQUZ0QjtBQVBKLFNBREQsR0FjRztBQXRDTixPQURGO0FBMENEOzs7OztBQUdITCxjQUFjOUIsU0FBZCxHQUEwQkEsU0FBMUI7QUFDQThCLGNBQWNiLFlBQWQsR0FBNkJBLFlBQTdCOztrQkFFZSx5QkFBc0JhLGFBQXRCLEMiLCJmaWxlIjoiY29sb3Itc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7cmdiVG9IZXh9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCBTaW5nbGVDb2xvclBhbGV0dGUgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL3NpbmdsZS1jb2xvci1wYWxldHRlJztcbmltcG9ydCBDb2xvclJhbmdlU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL2NvbG9yLXJhbmdlLXNlbGVjdG9yJztcbmltcG9ydCBDb2xvclBhbGV0dGUgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL2NvbG9yLXBhbGV0dGUnO1xuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgU3R5bGVkUGFuZWxEcm9wZG93blxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlIGZyb20gJ3JlYWN0LW9uY2xpY2tvdXRzaWRlL2RlY29yYXRvcic7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgY29sb3JTZXRzOiBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgc2VsZWN0ZWRDb2xvcjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmFycmF5LCBQcm9wVHlwZXMub2JqZWN0XSksXG4gICAgICBzZXRDb2xvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzUmFuZ2U6IFByb3BUeXBlcy5ib29sLFxuICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9KVxuICApLFxuICBpbnB1dFRoZW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgY29sb3JTZXRzOiBbXVxufTtcblxuY29uc3QgQ29sb3JCbG9jayA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiAzMnB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBgcmdiKCR7cHJvcHMuY29sb3Iuc2xpY2UoMCwgMykuam9pbignLCcpfSlgfTtcbmA7XG5cbmNvbnN0IENvbG9yU2VsZWN0b3JJbnB1dCA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT5cbiAgICBwcm9wcy5pbnB1dFRoZW1lID09PSAnc2Vjb25kYXJ5J1xuICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dFxuICAgICAgOiBwcm9wcy50aGVtZS5pbnB1dH07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodH07XG5gO1xuXG5jb25zdCBJbnB1dEJveENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAuY29sb3Itc2VsZWN0X19pbnB1dC1ncm91cCB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG4gIC5jb2xvci1zZWxlY3RfX2lucHV0LWdyb3VwOm50aC1jaGlsZCgyKSB7XG4gICAgbWFyZ2luLWxlZnQ6IDEycHg7XG4gIH1cbmA7XG5cbmNsYXNzIENvbG9yU2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBlZGl0aW5nOiBmYWxzZVxuICB9O1xuXG4gIGhhbmRsZUNsaWNrT3V0c2lkZSA9IGUgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICAgIH0gIH07XG5cbiAgX29uU2VsZWN0Q29sb3IgPSAoY29sb3IsIGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICh0aGlzLnByb3BzLmNvbG9yU2V0c1t0aGlzLnN0YXRlLmVkaXRpbmddKSB7XG4gICAgICB0aGlzLnByb3BzLmNvbG9yU2V0c1t0aGlzLnN0YXRlLmVkaXRpbmddLnNldENvbG9yKGNvbG9yKTtcbiAgICB9XG4gIH07XG5cbiAgX3Nob3dEcm9wZG93biA9IChlLCBpKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZWRpdGluZzogaX0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y29sb3JTZXRzLCBkaXNhYmxlZCwgaW5wdXRUaGVtZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtlZGl0aW5nfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgY3VycmVudEVkaXRpbmcgPVxuICAgICAgY29sb3JTZXRzW2VkaXRpbmddICYmIHR5cGVvZiBjb2xvclNldHNbZWRpdGluZ10gPT09ICdvYmplY3QnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3Itc2VsZWN0b3JcIj5cbiAgICAgICAgPElucHV0Qm94Q29udGFpbmVyPlxuICAgICAgICAgIHtjb2xvclNldHMubWFwKChjU2V0LCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdF9faW5wdXQtZ3JvdXBcIiBrZXk9e2l9PlxuICAgICAgICAgICAgICB7Y1NldC5sYWJlbCA/IDxQYW5lbExhYmVsPntjU2V0LmxhYmVsfTwvUGFuZWxMYWJlbD4gOiBudWxsfVxuICAgICAgICAgICAgICA8Q29sb3JTZWxlY3RvcklucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY29sb3Itc2VsZWN0b3JfX3NlbGVjdG9yXCJcbiAgICAgICAgICAgICAgICBhY3RpdmU9e2VkaXRpbmcgPT09IGl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgICAgIGlucHV0VGhlbWU9e2lucHV0VGhlbWV9XG4gICAgICAgICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gdGhpcy5fc2hvd0Ryb3Bkb3duKGUsIGkpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2NTZXQuaXNSYW5nZSA/IChcbiAgICAgICAgICAgICAgICAgIDxDb2xvclBhbGV0dGUgY29sb3JzPXtjU2V0LnNlbGVjdGVkQ29sb3IuY29sb3JzfSAvPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8Q29sb3JCbG9ja1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjb2xvci1zZWxlY3Rvcl9fc2VsZWN0b3JfX2Jsb2NrXCJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I9e2NTZXQuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9Db2xvclNlbGVjdG9ySW5wdXQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9JbnB1dEJveENvbnRhaW5lcj5cbiAgICAgICAge2N1cnJlbnRFZGl0aW5nID8gKFxuICAgICAgICAgIDxTdHlsZWRQYW5lbERyb3Bkb3duIGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yX19kcm9wZG93blwiPlxuICAgICAgICAgICAge2NvbG9yU2V0c1tlZGl0aW5nXS5pc1JhbmdlID8gKFxuICAgICAgICAgICAgICA8Q29sb3JSYW5nZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvclJhbmdlPXtjb2xvclNldHNbZWRpdGluZ10uc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICAgICAgICBvblNlbGVjdENvbG9yUmFuZ2U9e3RoaXMuX29uU2VsZWN0Q29sb3J9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8U2luZ2xlQ29sb3JQYWxldHRlXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcj17cmdiVG9IZXgoY29sb3JTZXRzW2VkaXRpbmddLnNlbGVjdGVkQ29sb3IpfVxuICAgICAgICAgICAgICAgIG9uU2VsZWN0Q29sb3I9e3RoaXMuX29uU2VsZWN0Q29sb3J9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3R5bGVkUGFuZWxEcm9wZG93bj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkNvbG9yU2VsZWN0b3IucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuQ29sb3JTZWxlY3Rvci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RlbnNUb0NsaWNrT3V0c2lkZShDb2xvclNlbGVjdG9yKTtcbiJdfQ==