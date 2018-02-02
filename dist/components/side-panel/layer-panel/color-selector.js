'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  width: 32px;\n  height: 18px;\n  border-radius: 1px;\n  background-color: ', ';\n'], ['\n  width: 32px;\n  height: 18px;\n  border-radius: 1px;\n  background-color: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n  height: ', ';\n'], ['\n  ', ';\n  height: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: space-between;\n\n  .color-select__input-group {\n    flex-grow: 1;\n  }\n  .color-select__input-group:nth-child(2) {\n    margin-left: 12px;\n  }\n'], ['\n  display: flex;\n  justify-content: space-between;\n\n  .color-select__input-group {\n    flex-grow: 1;\n  }\n  .color-select__input-group:nth-child(2) {\n    margin-left: 12px;\n  }\n']);

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
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      editing: false
    }, _this.handleClickOutside = function (e) {
      _this._hideDropdown(e);
    }, _this._onSelectColor = function (color, e) {
      e.stopPropagation();
      if (_this.props.colorSets[_this.state.editing]) {
        _this.props.colorSets[_this.state.editing].setColor(color);
      }
    }, _this._showDropdown = function (e, i) {
      e.stopPropagation();
      e.preventDefault();
      _this.setState({ editing: i });
    }, _this._hideDropdown = function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (_this.state.editing !== false) {
        _this.setState({ editing: false });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  ColorSelector.prototype.render = function render() {
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
  };

  return ColorSelector;
}(_react.Component);

ColorSelector.propTypes = propTypes;
ColorSelector.defaultProps = defaultProps;

exports.default = (0, _decorator2.default)(ColorSelector);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3Itc2VsZWN0b3IuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiY29sb3JTZXRzIiwiYXJyYXlPZiIsInNoYXBlIiwic2VsZWN0ZWRDb2xvciIsIm9uZU9mVHlwZSIsImFycmF5Iiwib2JqZWN0Iiwic2V0Q29sb3IiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImlzUmFuZ2UiLCJib29sIiwibGFiZWwiLCJzdHJpbmciLCJpbnB1dFRoZW1lIiwiZGlzYWJsZWQiLCJkZWZhdWx0UHJvcHMiLCJDb2xvckJsb2NrIiwiZGl2IiwicHJvcHMiLCJjb2xvciIsInNsaWNlIiwiam9pbiIsIkNvbG9yU2VsZWN0b3JJbnB1dCIsInRoZW1lIiwic2Vjb25kYXJ5SW5wdXQiLCJpbnB1dCIsImlucHV0Qm94SGVpZ2h0IiwiSW5wdXRCb3hDb250YWluZXIiLCJDb2xvclNlbGVjdG9yIiwic3RhdGUiLCJlZGl0aW5nIiwiaGFuZGxlQ2xpY2tPdXRzaWRlIiwiX2hpZGVEcm9wZG93biIsImUiLCJfb25TZWxlY3RDb2xvciIsInN0b3BQcm9wYWdhdGlvbiIsIl9zaG93RHJvcGRvd24iLCJpIiwicHJldmVudERlZmF1bHQiLCJzZXRTdGF0ZSIsInJlbmRlciIsImN1cnJlbnRFZGl0aW5nIiwibWFwIiwiY1NldCIsImNvbG9ycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBSUE7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLGFBQVcsb0JBQVVDLE9BQVYsQ0FDVCxvQkFBVUMsS0FBVixDQUFnQjtBQUNkQyxtQkFBZSxvQkFBVUMsU0FBVixDQUFvQixDQUFDLG9CQUFVQyxLQUFYLEVBQWtCLG9CQUFVQyxNQUE1QixDQUFwQixDQUREO0FBRWRD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QixhQUFMLENBQW1CSCxDQUFuQixFQUFzQkksQ0FBdEIsQ0FBTDtBQUFBO0FBTGY7QUFPR00sbUJBQUtsQyxPQUFMLEdBQ0Msd0RBQWMsUUFBUWtDLEtBQUt6QyxhQUFMLENBQW1CMEMsTUFBekMsR0FERCxHQUdDLDhCQUFDLFVBQUQ7QUFDRSwyQkFBVSxpQ0FEWjtBQUVFLHVCQUFPRCxLQUFLekM7QUFGZDtBQVZKO0FBRkYsV0FEYTtBQUFBLFNBQWQ7QUFESCxPQURGO0FBd0JHdUMsdUJBQ0M7QUFBQTtBQUFBLFVBQXFCLFdBQVUsMEJBQS9CO0FBQ0cxQyxrQkFBVStCLE9BQVYsRUFBbUJyQixPQUFuQixHQUNDO0FBQ0UsOEJBQW9CVixVQUFVK0IsT0FBVixFQUFtQjVCLGFBRHpDO0FBRUUsOEJBQW9CLEtBQUtnQztBQUYzQixVQURELEdBTUM7QUFDRSx5QkFBZSwwQkFBU25DLFVBQVUrQixPQUFWLEVBQW1CNUIsYUFBNUIsQ0FEakI7QUFFRSx5QkFBZSxLQUFLZ0M7QUFGdEI7QUFQSixPQURELEdBY0c7QUF0Q04sS0FERjtBQTBDRCxHOzs7OztBQUdITixjQUFjOUIsU0FBZCxHQUEwQkEsU0FBMUI7QUFDQThCLGNBQWNiLFlBQWQsR0FBNkJBLFlBQTdCOztrQkFFZSx5QkFBc0JhLGFBQXRCLEMiLCJmaWxlIjoiY29sb3Itc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7cmdiVG9IZXh9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCBTaW5nbGVDb2xvclBhbGV0dGUgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL3NpbmdsZS1jb2xvci1wYWxldHRlJztcbmltcG9ydCBDb2xvclJhbmdlU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL2NvbG9yLXJhbmdlLXNlbGVjdG9yJztcbmltcG9ydCBDb2xvclBhbGV0dGUgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL2NvbG9yLXBhbGV0dGUnO1xuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgU3R5bGVkUGFuZWxEcm9wZG93blxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlIGZyb20gJ3JlYWN0LW9uY2xpY2tvdXRzaWRlL2RlY29yYXRvcic7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgY29sb3JTZXRzOiBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgc2VsZWN0ZWRDb2xvcjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmFycmF5LCBQcm9wVHlwZXMub2JqZWN0XSksXG4gICAgICBzZXRDb2xvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzUmFuZ2U6IFByb3BUeXBlcy5ib29sLFxuICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9KVxuICApLFxuICBpbnB1dFRoZW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgY29sb3JTZXRzOiBbXVxufTtcblxuY29uc3QgQ29sb3JCbG9jayA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiAzMnB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBgcmdiKCR7cHJvcHMuY29sb3Iuc2xpY2UoMCwgMykuam9pbignLCcpfSlgfTtcbmA7XG5cbmNvbnN0IENvbG9yU2VsZWN0b3JJbnB1dCA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT5cbiAgICBwcm9wcy5pbnB1dFRoZW1lID09PSAnc2Vjb25kYXJ5J1xuICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dFxuICAgICAgOiBwcm9wcy50aGVtZS5pbnB1dH07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodH07XG5gO1xuXG5jb25zdCBJbnB1dEJveENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAuY29sb3Itc2VsZWN0X19pbnB1dC1ncm91cCB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG4gIC5jb2xvci1zZWxlY3RfX2lucHV0LWdyb3VwOm50aC1jaGlsZCgyKSB7XG4gICAgbWFyZ2luLWxlZnQ6IDEycHg7XG4gIH1cbmA7XG5cbmNsYXNzIENvbG9yU2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBlZGl0aW5nOiBmYWxzZVxuICB9O1xuXG4gIGhhbmRsZUNsaWNrT3V0c2lkZSA9IGUgPT4ge1xuICAgIHRoaXMuX2hpZGVEcm9wZG93bihlKTtcbiAgfTtcblxuICBfb25TZWxlY3RDb2xvciA9IChjb2xvciwgZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMucHJvcHMuY29sb3JTZXRzW3RoaXMuc3RhdGUuZWRpdGluZ10pIHtcbiAgICAgIHRoaXMucHJvcHMuY29sb3JTZXRzW3RoaXMuc3RhdGUuZWRpdGluZ10uc2V0Q29sb3IoY29sb3IpO1xuICAgIH1cbiAgfTtcblxuICBfc2hvd0Ryb3Bkb3duID0gKGUsIGkpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBpfSk7XG4gIH07XG5cbiAgX2hpZGVEcm9wZG93biA9IGUgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NvbG9yU2V0cywgZGlzYWJsZWQsIGlucHV0VGhlbWV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7ZWRpdGluZ30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGN1cnJlbnRFZGl0aW5nID1cbiAgICAgIGNvbG9yU2V0c1tlZGl0aW5nXSAmJiB0eXBlb2YgY29sb3JTZXRzW2VkaXRpbmddID09PSAnb2JqZWN0JztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yXCI+XG4gICAgICAgIDxJbnB1dEJveENvbnRhaW5lcj5cbiAgICAgICAgICB7Y29sb3JTZXRzLm1hcCgoY1NldCwgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1zZWxlY3RfX2lucHV0LWdyb3VwXCIga2V5PXtpfT5cbiAgICAgICAgICAgICAge2NTZXQubGFiZWwgPyA8UGFuZWxMYWJlbD57Y1NldC5sYWJlbH08L1BhbmVsTGFiZWw+IDogbnVsbH1cbiAgICAgICAgICAgICAgPENvbG9yU2VsZWN0b3JJbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yX19zZWxlY3RvclwiXG4gICAgICAgICAgICAgICAgYWN0aXZlPXtlZGl0aW5nID09PSBpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgICAgICBpbnB1dFRoZW1lPXtpbnB1dFRoZW1lfVxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMuX3Nob3dEcm9wZG93bihlLCBpKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtjU2V0LmlzUmFuZ2UgPyAoXG4gICAgICAgICAgICAgICAgICA8Q29sb3JQYWxldHRlIGNvbG9ycz17Y1NldC5zZWxlY3RlZENvbG9yLmNvbG9yc30gLz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPENvbG9yQmxvY2tcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY29sb3Itc2VsZWN0b3JfX3NlbGVjdG9yX19ibG9ja1wiXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yPXtjU2V0LnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvQ29sb3JTZWxlY3RvcklucHV0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvSW5wdXRCb3hDb250YWluZXI+XG4gICAgICAgIHtjdXJyZW50RWRpdGluZyA/IChcbiAgICAgICAgICA8U3R5bGVkUGFuZWxEcm9wZG93biBjbGFzc05hbWU9XCJjb2xvci1zZWxlY3Rvcl9fZHJvcGRvd25cIj5cbiAgICAgICAgICAgIHtjb2xvclNldHNbZWRpdGluZ10uaXNSYW5nZSA/IChcbiAgICAgICAgICAgICAgPENvbG9yUmFuZ2VTZWxlY3RvclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3JSYW5nZT17Y29sb3JTZXRzW2VkaXRpbmddLnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgICAgICAgb25TZWxlY3RDb2xvclJhbmdlPXt0aGlzLl9vblNlbGVjdENvbG9yfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFNpbmdsZUNvbG9yUGFsZXR0ZVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3JnYlRvSGV4KGNvbG9yU2V0c1tlZGl0aW5nXS5zZWxlY3RlZENvbG9yKX1cbiAgICAgICAgICAgICAgICBvblNlbGVjdENvbG9yPXt0aGlzLl9vblNlbGVjdENvbG9yfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0eWxlZFBhbmVsRHJvcGRvd24+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5Db2xvclNlbGVjdG9yLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkNvbG9yU2VsZWN0b3IuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5leHBvcnQgZGVmYXVsdCBsaXN0ZW5zVG9DbGlja091dHNpZGUoQ29sb3JTZWxlY3Rvcik7XG4iXX0=