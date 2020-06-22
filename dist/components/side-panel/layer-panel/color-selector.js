"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.InputBoxContainer = exports.ColorSelectorInput = exports.ColorBlock = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

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

var _colorUtils = require("../../../utils/color-utils");

var _singleColorPalette = _interopRequireDefault(require("./single-color-palette"));

var _colorRangeSelector = _interopRequireDefault(require("./color-range-selector"));

var _colorPalette = _interopRequireDefault(require("./color-palette"));

var _styledComponents2 = require("../../common/styled-components");

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n\n  .color-select__input-group {\n    flex-grow: 1;\n  }\n  .color-select__input-group:nth-child(2) {\n    margin-left: 12px;\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  height: ", ";\n\n  .color-selector__selector__label {\n    text-transform: capitalize;\n    font-size: 12px;\n    text-align: center;\n    color: ", ";\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 32px;\n  height: 18px;\n  border-radius: 1px;\n  background-color: ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ColorBlock = _styledComponents["default"].div(_templateObject(), function (props) {
  return "rgb(".concat(props.color.slice(0, 3).join(','), ")");
});

exports.ColorBlock = ColorBlock;

var ColorSelectorInput = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.inputTheme === 'secondary' ? props.theme.secondaryInput : props.theme.input;
}, function (props) {
  return props.theme.inputBoxHeight;
}, function (props) {
  return props.theme.inputPlaceholderColor;
});

exports.ColorSelectorInput = ColorSelectorInput;

var InputBoxContainer = _styledComponents["default"].div(_templateObject3());

exports.InputBoxContainer = InputBoxContainer;

var ColorSelector =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ColorSelector, _Component);

  function ColorSelector() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, ColorSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(ColorSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      showDropdown: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "node", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
      if (_this.props.colorUI && _this.props.colorUI.showSketcher) {
        // if sketcher is open, let sketch to close itself first
        return;
      }

      _this._closePanelDropdown();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_getEditing", function () {
      return _this.props.colorUI ? _this.props.colorUI.showDropdown : _this.state.showDropdown;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_closePanelDropdown", function () {
      if (_this._getEditing() === false) {
        return;
      }

      if (_this.props.setColorUI) {
        _this.props.setColorUI({
          showDropdown: false,
          showSketcher: false
        });
      } else {
        _this.setState({
          showDropdown: false
        });
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSelectColor", function (color, e) {
      e.stopPropagation();

      var editing = _this._getEditing();

      if (_this.props.colorSets[editing]) {
        _this.props.colorSets[editing].setColor(color);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_showDropdown", function (e, i) {
      e.stopPropagation();
      e.preventDefault();

      if (_this.props.setColorUI) {
        _this.props.setColorUI({
          showDropdown: i
        });
      } else {
        _this.setState({
          showDropdown: i
        });
      }
    });
    return _this;
  }

  (0, _createClass2["default"])(ColorSelector, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          colorSets = _this$props.colorSets,
          disabled = _this$props.disabled,
          inputTheme = _this$props.inputTheme,
          colorUI = _this$props.colorUI;

      var editing = this._getEditing();

      var currentEditing = colorSets[editing] && (0, _typeof2["default"])(colorSets[editing]) === 'object';
      return _react["default"].createElement("div", {
        className: "color-selector",
        ref: this.node
      }, _react["default"].createElement(InputBoxContainer, null, colorSets.map(function (cSet, i) {
        return _react["default"].createElement("div", {
          className: "color-select__input-group",
          key: i
        }, _react["default"].createElement(ColorSelectorInput, {
          className: "color-selector__selector",
          active: editing === i,
          disabled: disabled,
          inputTheme: inputTheme,
          onMouseDown: function onMouseDown(e) {
            return _this2._showDropdown(e, i);
          }
        }, cSet.isRange ? _react["default"].createElement(_colorPalette["default"], {
          colors: cSet.selectedColor.colors
        }) : _react["default"].createElement(ColorBlock, {
          className: "color-selector__selector__block",
          color: cSet.selectedColor
        }), cSet.label ? _react["default"].createElement("div", {
          className: "color-selector__selector__label"
        }, cSet.label) : null));
      })), currentEditing ? _react["default"].createElement(_styledComponents2.StyledPanelDropdown, {
        className: "color-selector__dropdown"
      }, colorSets[editing].isRange ? _react["default"].createElement(_colorRangeSelector["default"], {
        selectedColorRange: colorSets[editing].selectedColor,
        onSelectColorRange: this._onSelectColor,
        setColorPaletteUI: this.props.setColorUI,
        colorPaletteUI: colorUI
      }) : _react["default"].createElement(_singleColorPalette["default"], {
        selectedColor: (0, _colorUtils.rgbToHex)(colorSets[editing].selectedColor),
        onSelectColor: this._onSelectColor
      })) : null);
    }
  }]);
  return ColorSelector;
}(_react.Component);

(0, _defineProperty2["default"])(ColorSelector, "propTypes", {
  colorSets: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    selectedColor: _propTypes["default"].oneOfType([_propTypes["default"].arrayOf(_propTypes["default"].any), _propTypes["default"].object]),
    setColor: _propTypes["default"].func.isRequired,
    isRange: _propTypes["default"].bool,
    label: _propTypes["default"].string
  })),
  colorUI: _propTypes["default"].shape({
    customPalette: _propTypes["default"].object,
    showSketcher: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].number]),
    showDropdown: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].number]),
    colorRangeConfig: _propTypes["default"].object
  }),
  inputTheme: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  setColorUI: _propTypes["default"].func
});
(0, _defineProperty2["default"])(ColorSelector, "defaultProps", {
  colorSets: []
});

var _default = (0, _reactOnclickoutside["default"])(ColorSelector);

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3Itc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiQ29sb3JCbG9jayIsInN0eWxlZCIsImRpdiIsInByb3BzIiwiY29sb3IiLCJzbGljZSIsImpvaW4iLCJDb2xvclNlbGVjdG9ySW5wdXQiLCJpbnB1dFRoZW1lIiwidGhlbWUiLCJzZWNvbmRhcnlJbnB1dCIsImlucHV0IiwiaW5wdXRCb3hIZWlnaHQiLCJpbnB1dFBsYWNlaG9sZGVyQ29sb3IiLCJJbnB1dEJveENvbnRhaW5lciIsIkNvbG9yU2VsZWN0b3IiLCJzaG93RHJvcGRvd24iLCJlIiwiY29sb3JVSSIsInNob3dTa2V0Y2hlciIsIl9jbG9zZVBhbmVsRHJvcGRvd24iLCJzdGF0ZSIsIl9nZXRFZGl0aW5nIiwic2V0Q29sb3JVSSIsInNldFN0YXRlIiwic3RvcFByb3BhZ2F0aW9uIiwiZWRpdGluZyIsImNvbG9yU2V0cyIsInNldENvbG9yIiwiaSIsInByZXZlbnREZWZhdWx0IiwiZGlzYWJsZWQiLCJjdXJyZW50RWRpdGluZyIsIm5vZGUiLCJtYXAiLCJjU2V0IiwiX3Nob3dEcm9wZG93biIsImlzUmFuZ2UiLCJzZWxlY3RlZENvbG9yIiwiY29sb3JzIiwibGFiZWwiLCJfb25TZWxlY3RDb2xvciIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImFycmF5T2YiLCJzaGFwZSIsIm9uZU9mVHlwZSIsImFueSIsIm9iamVjdCIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYm9vbCIsInN0cmluZyIsImN1c3RvbVBhbGV0dGUiLCJudW1iZXIiLCJjb2xvclJhbmdlQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSxVQUFVLEdBQUdDLDZCQUFPQyxHQUFWLG9CQUlELFVBQUFDLEtBQUs7QUFBQSx1QkFBV0EsS0FBSyxDQUFDQyxLQUFOLENBQVlDLEtBQVosQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0JDLElBQXhCLENBQTZCLEdBQTdCLENBQVg7QUFBQSxDQUpKLENBQWhCOzs7O0FBT0EsSUFBTUMsa0JBQWtCLEdBQUdOLDZCQUFPQyxHQUFWLHFCQUMzQixVQUFBQyxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDSyxVQUFOLEtBQXFCLFdBQXJCLEdBQW1DTCxLQUFLLENBQUNNLEtBQU4sQ0FBWUMsY0FBL0MsR0FBZ0VQLEtBQUssQ0FBQ00sS0FBTixDQUFZRSxLQUFqRjtBQUFBLENBRHNCLEVBRW5CLFVBQUFSLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNNLEtBQU4sQ0FBWUcsY0FBaEI7QUFBQSxDQUZjLEVBUWxCLFVBQUFULEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNNLEtBQU4sQ0FBWUkscUJBQWhCO0FBQUEsQ0FSYSxDQUF4Qjs7OztBQVlBLElBQU1DLGlCQUFpQixHQUFHYiw2QkFBT0MsR0FBVixvQkFBdkI7Ozs7SUFZRGEsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7OEZBeUJJO0FBQ05DLE1BQUFBLFlBQVksRUFBRTtBQURSLEs7NkZBSUQsdUI7MkdBRWMsVUFBQUMsQ0FBQyxFQUFJO0FBQ3hCLFVBQUksTUFBS2QsS0FBTCxDQUFXZSxPQUFYLElBQXNCLE1BQUtmLEtBQUwsQ0FBV2UsT0FBWCxDQUFtQkMsWUFBN0MsRUFBMkQ7QUFDekQ7QUFDQTtBQUNEOztBQUNELFlBQUtDLG1CQUFMO0FBQ0QsSztvR0FFYSxZQUFNO0FBQ2xCLGFBQU8sTUFBS2pCLEtBQUwsQ0FBV2UsT0FBWCxHQUFxQixNQUFLZixLQUFMLENBQVdlLE9BQVgsQ0FBbUJGLFlBQXhDLEdBQXVELE1BQUtLLEtBQUwsQ0FBV0wsWUFBekU7QUFDRCxLOzRHQUVxQixZQUFNO0FBQzFCLFVBQUksTUFBS00sV0FBTCxPQUF1QixLQUEzQixFQUFrQztBQUNoQztBQUNEOztBQUNELFVBQUksTUFBS25CLEtBQUwsQ0FBV29CLFVBQWYsRUFBMkI7QUFDekIsY0FBS3BCLEtBQUwsQ0FBV29CLFVBQVgsQ0FBc0I7QUFBQ1AsVUFBQUEsWUFBWSxFQUFFLEtBQWY7QUFBc0JHLFVBQUFBLFlBQVksRUFBRTtBQUFwQyxTQUF0QjtBQUNELE9BRkQsTUFFTztBQUNMLGNBQUtLLFFBQUwsQ0FBYztBQUFDUixVQUFBQSxZQUFZLEVBQUU7QUFBZixTQUFkO0FBQ0Q7QUFDRixLO3VHQUVnQixVQUFDWixLQUFELEVBQVFhLENBQVIsRUFBYztBQUM3QkEsTUFBQUEsQ0FBQyxDQUFDUSxlQUFGOztBQUNBLFVBQU1DLE9BQU8sR0FBRyxNQUFLSixXQUFMLEVBQWhCOztBQUNBLFVBQUksTUFBS25CLEtBQUwsQ0FBV3dCLFNBQVgsQ0FBcUJELE9BQXJCLENBQUosRUFBbUM7QUFDakMsY0FBS3ZCLEtBQUwsQ0FBV3dCLFNBQVgsQ0FBcUJELE9BQXJCLEVBQThCRSxRQUE5QixDQUF1Q3hCLEtBQXZDO0FBQ0Q7QUFDRixLO3NHQUVlLFVBQUNhLENBQUQsRUFBSVksQ0FBSixFQUFVO0FBQ3hCWixNQUFBQSxDQUFDLENBQUNRLGVBQUY7QUFDQVIsTUFBQUEsQ0FBQyxDQUFDYSxjQUFGOztBQUNBLFVBQUksTUFBSzNCLEtBQUwsQ0FBV29CLFVBQWYsRUFBMkI7QUFDekIsY0FBS3BCLEtBQUwsQ0FBV29CLFVBQVgsQ0FBc0I7QUFBQ1AsVUFBQUEsWUFBWSxFQUFFYTtBQUFmLFNBQXRCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBS0wsUUFBTCxDQUFjO0FBQUNSLFVBQUFBLFlBQVksRUFBRWE7QUFBZixTQUFkO0FBQ0Q7QUFDRixLOzs7Ozs7NkJBRVE7QUFBQTs7QUFBQSx3QkFDNEMsS0FBSzFCLEtBRGpEO0FBQUEsVUFDQXdCLFNBREEsZUFDQUEsU0FEQTtBQUFBLFVBQ1dJLFFBRFgsZUFDV0EsUUFEWDtBQUFBLFVBQ3FCdkIsVUFEckIsZUFDcUJBLFVBRHJCO0FBQUEsVUFDaUNVLE9BRGpDLGVBQ2lDQSxPQURqQzs7QUFHUCxVQUFNUSxPQUFPLEdBQUcsS0FBS0osV0FBTCxFQUFoQjs7QUFDQSxVQUFNVSxjQUFjLEdBQUdMLFNBQVMsQ0FBQ0QsT0FBRCxDQUFULElBQXNCLHlCQUFPQyxTQUFTLENBQUNELE9BQUQsQ0FBaEIsTUFBOEIsUUFBM0U7QUFFQSxhQUNFO0FBQUssUUFBQSxTQUFTLEVBQUMsZ0JBQWY7QUFBZ0MsUUFBQSxHQUFHLEVBQUUsS0FBS087QUFBMUMsU0FDRSxnQ0FBQyxpQkFBRCxRQUNHTixTQUFTLENBQUNPLEdBQVYsQ0FBYyxVQUFDQyxJQUFELEVBQU9OLENBQVA7QUFBQSxlQUNiO0FBQUssVUFBQSxTQUFTLEVBQUMsMkJBQWY7QUFBMkMsVUFBQSxHQUFHLEVBQUVBO0FBQWhELFdBQ0UsZ0NBQUMsa0JBQUQ7QUFDRSxVQUFBLFNBQVMsRUFBQywwQkFEWjtBQUVFLFVBQUEsTUFBTSxFQUFFSCxPQUFPLEtBQUtHLENBRnRCO0FBR0UsVUFBQSxRQUFRLEVBQUVFLFFBSFo7QUFJRSxVQUFBLFVBQVUsRUFBRXZCLFVBSmQ7QUFLRSxVQUFBLFdBQVcsRUFBRSxxQkFBQVMsQ0FBQztBQUFBLG1CQUFJLE1BQUksQ0FBQ21CLGFBQUwsQ0FBbUJuQixDQUFuQixFQUFzQlksQ0FBdEIsQ0FBSjtBQUFBO0FBTGhCLFdBT0dNLElBQUksQ0FBQ0UsT0FBTCxHQUNDLGdDQUFDLHdCQUFEO0FBQWMsVUFBQSxNQUFNLEVBQUVGLElBQUksQ0FBQ0csYUFBTCxDQUFtQkM7QUFBekMsVUFERCxHQUdDLGdDQUFDLFVBQUQ7QUFDRSxVQUFBLFNBQVMsRUFBQyxpQ0FEWjtBQUVFLFVBQUEsS0FBSyxFQUFFSixJQUFJLENBQUNHO0FBRmQsVUFWSixFQWVHSCxJQUFJLENBQUNLLEtBQUwsR0FDQztBQUFLLFVBQUEsU0FBUyxFQUFDO0FBQWYsV0FBa0RMLElBQUksQ0FBQ0ssS0FBdkQsQ0FERCxHQUVHLElBakJOLENBREYsQ0FEYTtBQUFBLE9BQWQsQ0FESCxDQURGLEVBMEJHUixjQUFjLEdBQ2IsZ0NBQUMsc0NBQUQ7QUFBcUIsUUFBQSxTQUFTLEVBQUM7QUFBL0IsU0FDR0wsU0FBUyxDQUFDRCxPQUFELENBQVQsQ0FBbUJXLE9BQW5CLEdBQ0MsZ0NBQUMsOEJBQUQ7QUFDRSxRQUFBLGtCQUFrQixFQUFFVixTQUFTLENBQUNELE9BQUQsQ0FBVCxDQUFtQlksYUFEekM7QUFFRSxRQUFBLGtCQUFrQixFQUFFLEtBQUtHLGNBRjNCO0FBR0UsUUFBQSxpQkFBaUIsRUFBRSxLQUFLdEMsS0FBTCxDQUFXb0IsVUFIaEM7QUFJRSxRQUFBLGNBQWMsRUFBRUw7QUFKbEIsUUFERCxHQVFDLGdDQUFDLDhCQUFEO0FBQ0UsUUFBQSxhQUFhLEVBQUUsMEJBQVNTLFNBQVMsQ0FBQ0QsT0FBRCxDQUFULENBQW1CWSxhQUE1QixDQURqQjtBQUVFLFFBQUEsYUFBYSxFQUFFLEtBQUtHO0FBRnRCLFFBVEosQ0FEYSxHQWdCWCxJQTFDTixDQURGO0FBOENEOzs7RUE1SHlCQyxnQjs7aUNBQXRCM0IsYSxlQUNlO0FBQ2pCWSxFQUFBQSxTQUFTLEVBQUVnQixzQkFBVUMsT0FBVixDQUNURCxzQkFBVUUsS0FBVixDQUFnQjtBQUNkUCxJQUFBQSxhQUFhLEVBQUVLLHNCQUFVRyxTQUFWLENBQW9CLENBQUNILHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUksR0FBNUIsQ0FBRCxFQUFtQ0osc0JBQVVLLE1BQTdDLENBQXBCLENBREQ7QUFFZHBCLElBQUFBLFFBQVEsRUFBRWUsc0JBQVVNLElBQVYsQ0FBZUMsVUFGWDtBQUdkYixJQUFBQSxPQUFPLEVBQUVNLHNCQUFVUSxJQUhMO0FBSWRYLElBQUFBLEtBQUssRUFBRUcsc0JBQVVTO0FBSkgsR0FBaEIsQ0FEUyxDQURNO0FBU2pCbEMsRUFBQUEsT0FBTyxFQUFFeUIsc0JBQVVFLEtBQVYsQ0FBZ0I7QUFDdkJRLElBQUFBLGFBQWEsRUFBRVYsc0JBQVVLLE1BREY7QUFFdkI3QixJQUFBQSxZQUFZLEVBQUV3QixzQkFBVUcsU0FBVixDQUFvQixDQUFDSCxzQkFBVVEsSUFBWCxFQUFpQlIsc0JBQVVXLE1BQTNCLENBQXBCLENBRlM7QUFHdkJ0QyxJQUFBQSxZQUFZLEVBQUUyQixzQkFBVUcsU0FBVixDQUFvQixDQUFDSCxzQkFBVVEsSUFBWCxFQUFpQlIsc0JBQVVXLE1BQTNCLENBQXBCLENBSFM7QUFJdkJDLElBQUFBLGdCQUFnQixFQUFFWixzQkFBVUs7QUFKTCxHQUFoQixDQVRRO0FBZWpCeEMsRUFBQUEsVUFBVSxFQUFFbUMsc0JBQVVTLE1BZkw7QUFnQmpCckIsRUFBQUEsUUFBUSxFQUFFWSxzQkFBVVEsSUFoQkg7QUFpQmpCNUIsRUFBQUEsVUFBVSxFQUFFb0Isc0JBQVVNO0FBakJMLEM7aUNBRGZsQyxhLGtCQXFCa0I7QUFDcEJZLEVBQUFBLFNBQVMsRUFBRTtBQURTLEM7O2VBMEdULHFDQUFlWixhQUFmLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtyZ2JUb0hleH0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IFNpbmdsZUNvbG9yUGFsZXR0ZSBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvc2luZ2xlLWNvbG9yLXBhbGV0dGUnO1xuaW1wb3J0IENvbG9yUmFuZ2VTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2Utc2VsZWN0b3InO1xuaW1wb3J0IENvbG9yUGFsZXR0ZSBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcGFsZXR0ZSc7XG5pbXBvcnQge1N0eWxlZFBhbmVsRHJvcGRvd259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBvbkNsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZSc7XG5cbmV4cG9ydCBjb25zdCBDb2xvckJsb2NrID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMThweDtcbiAgYm9yZGVyLXJhZGl1czogMXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IGByZ2IoJHtwcm9wcy5jb2xvci5zbGljZSgwLCAzKS5qb2luKCcsJyl9KWB9O1xuYDtcblxuZXhwb3J0IGNvbnN0IENvbG9yU2VsZWN0b3JJbnB1dCA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT4gKHByb3BzLmlucHV0VGhlbWUgPT09ICdzZWNvbmRhcnknID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXQgOiBwcm9wcy50aGVtZS5pbnB1dCl9O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHR9O1xuXG4gIC5jb2xvci1zZWxlY3Rvcl9fc2VsZWN0b3JfX2xhYmVsIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGxhY2Vob2xkZXJDb2xvcn07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBJbnB1dEJveENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAuY29sb3Itc2VsZWN0X19pbnB1dC1ncm91cCB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG4gIC5jb2xvci1zZWxlY3RfX2lucHV0LWdyb3VwOm50aC1jaGlsZCgyKSB7XG4gICAgbWFyZ2luLWxlZnQ6IDEycHg7XG4gIH1cbmA7XG5cbmNsYXNzIENvbG9yU2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbG9yU2V0czogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBzZWxlY3RlZENvbG9yOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSwgUHJvcFR5cGVzLm9iamVjdF0pLFxuICAgICAgICBzZXRDb2xvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgaXNSYW5nZTogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgICB9KVxuICAgICksXG4gICAgY29sb3JVSTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGN1c3RvbVBhbGV0dGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICBzaG93U2tldGNoZXI6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5ib29sLCBQcm9wVHlwZXMubnVtYmVyXSksXG4gICAgICBzaG93RHJvcGRvd246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5ib29sLCBQcm9wVHlwZXMubnVtYmVyXSksXG4gICAgICBjb2xvclJhbmdlQ29uZmlnOiBQcm9wVHlwZXMub2JqZWN0XG4gICAgfSksXG4gICAgaW5wdXRUaGVtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgc2V0Q29sb3JVSTogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNvbG9yU2V0czogW11cbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICBzaG93RHJvcGRvd246IGZhbHNlXG4gIH07XG5cbiAgbm9kZSA9IGNyZWF0ZVJlZigpO1xuXG4gIGhhbmRsZUNsaWNrT3V0c2lkZSA9IGUgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbG9yVUkgJiYgdGhpcy5wcm9wcy5jb2xvclVJLnNob3dTa2V0Y2hlcikge1xuICAgICAgLy8gaWYgc2tldGNoZXIgaXMgb3BlbiwgbGV0IHNrZXRjaCB0byBjbG9zZSBpdHNlbGYgZmlyc3RcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fY2xvc2VQYW5lbERyb3Bkb3duKCk7XG4gIH07XG5cbiAgX2dldEVkaXRpbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY29sb3JVSSA/IHRoaXMucHJvcHMuY29sb3JVSS5zaG93RHJvcGRvd24gOiB0aGlzLnN0YXRlLnNob3dEcm9wZG93bjtcbiAgfTtcblxuICBfY2xvc2VQYW5lbERyb3Bkb3duID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLl9nZXRFZGl0aW5nKCkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLnNldENvbG9yVUkpIHtcbiAgICAgIHRoaXMucHJvcHMuc2V0Q29sb3JVSSh7c2hvd0Ryb3Bkb3duOiBmYWxzZSwgc2hvd1NrZXRjaGVyOiBmYWxzZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93RHJvcGRvd246IGZhbHNlfSk7XG4gICAgfVxuICB9O1xuXG4gIF9vblNlbGVjdENvbG9yID0gKGNvbG9yLCBlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBlZGl0aW5nID0gdGhpcy5fZ2V0RWRpdGluZygpO1xuICAgIGlmICh0aGlzLnByb3BzLmNvbG9yU2V0c1tlZGl0aW5nXSkge1xuICAgICAgdGhpcy5wcm9wcy5jb2xvclNldHNbZWRpdGluZ10uc2V0Q29sb3IoY29sb3IpO1xuICAgIH1cbiAgfTtcblxuICBfc2hvd0Ryb3Bkb3duID0gKGUsIGkpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5wcm9wcy5zZXRDb2xvclVJKSB7XG4gICAgICB0aGlzLnByb3BzLnNldENvbG9yVUkoe3Nob3dEcm9wZG93bjogaX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93RHJvcGRvd246IGl9KTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb2xvclNldHMsIGRpc2FibGVkLCBpbnB1dFRoZW1lLCBjb2xvclVJfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBlZGl0aW5nID0gdGhpcy5fZ2V0RWRpdGluZygpO1xuICAgIGNvbnN0IGN1cnJlbnRFZGl0aW5nID0gY29sb3JTZXRzW2VkaXRpbmddICYmIHR5cGVvZiBjb2xvclNldHNbZWRpdGluZ10gPT09ICdvYmplY3QnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3Itc2VsZWN0b3JcIiByZWY9e3RoaXMubm9kZX0+XG4gICAgICAgIDxJbnB1dEJveENvbnRhaW5lcj5cbiAgICAgICAgICB7Y29sb3JTZXRzLm1hcCgoY1NldCwgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1zZWxlY3RfX2lucHV0LWdyb3VwXCIga2V5PXtpfT5cbiAgICAgICAgICAgICAgPENvbG9yU2VsZWN0b3JJbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yX19zZWxlY3RvclwiXG4gICAgICAgICAgICAgICAgYWN0aXZlPXtlZGl0aW5nID09PSBpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgICAgICBpbnB1dFRoZW1lPXtpbnB1dFRoZW1lfVxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMuX3Nob3dEcm9wZG93bihlLCBpKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtjU2V0LmlzUmFuZ2UgPyAoXG4gICAgICAgICAgICAgICAgICA8Q29sb3JQYWxldHRlIGNvbG9ycz17Y1NldC5zZWxlY3RlZENvbG9yLmNvbG9yc30gLz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPENvbG9yQmxvY2tcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY29sb3Itc2VsZWN0b3JfX3NlbGVjdG9yX19ibG9ja1wiXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yPXtjU2V0LnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge2NTZXQubGFiZWwgPyAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yX19zZWxlY3Rvcl9fbGFiZWxcIj57Y1NldC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPC9Db2xvclNlbGVjdG9ySW5wdXQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9JbnB1dEJveENvbnRhaW5lcj5cbiAgICAgICAge2N1cnJlbnRFZGl0aW5nID8gKFxuICAgICAgICAgIDxTdHlsZWRQYW5lbERyb3Bkb3duIGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yX19kcm9wZG93blwiPlxuICAgICAgICAgICAge2NvbG9yU2V0c1tlZGl0aW5nXS5pc1JhbmdlID8gKFxuICAgICAgICAgICAgICA8Q29sb3JSYW5nZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvclJhbmdlPXtjb2xvclNldHNbZWRpdGluZ10uc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICAgICAgICBvblNlbGVjdENvbG9yUmFuZ2U9e3RoaXMuX29uU2VsZWN0Q29sb3J9XG4gICAgICAgICAgICAgICAgc2V0Q29sb3JQYWxldHRlVUk9e3RoaXMucHJvcHMuc2V0Q29sb3JVSX1cbiAgICAgICAgICAgICAgICBjb2xvclBhbGV0dGVVST17Y29sb3JVSX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxTaW5nbGVDb2xvclBhbGV0dGVcbiAgICAgICAgICAgICAgICBzZWxlY3RlZENvbG9yPXtyZ2JUb0hleChjb2xvclNldHNbZWRpdGluZ10uc2VsZWN0ZWRDb2xvcil9XG4gICAgICAgICAgICAgICAgb25TZWxlY3RDb2xvcj17dGhpcy5fb25TZWxlY3RDb2xvcn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TdHlsZWRQYW5lbERyb3Bkb3duPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb25DbGlja091dHNpZGUoQ29sb3JTZWxlY3Rvcik7XG4iXX0=