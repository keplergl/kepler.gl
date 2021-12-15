"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.InputBoxContainer = exports.ColorSelectorInput = exports.ColorBlock = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

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

var _templateObject, _templateObject2, _templateObject3;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ColorBlock = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  width: 32px;\n  height: 18px;\n  border-radius: 1px;\n  background-color: ", ";\n"])), function (props) {
  return "rgb(".concat(props.color.slice(0, 3).join(','), ")");
});

exports.ColorBlock = ColorBlock;

var ColorSelectorInput = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  height: ", ";\n\n  .color-selector__selector__label {\n    text-transform: capitalize;\n    font-size: 12px;\n    text-align: center;\n    color: ", ";\n  }\n"])), function (props) {
  return props.inputTheme === 'secondary' ? props.theme.secondaryInput : props.theme.input;
}, function (props) {
  return props.theme.inputBoxHeight;
}, function (props) {
  return props.theme.inputPlaceholderColor;
});

exports.ColorSelectorInput = ColorSelectorInput;

var InputBoxContainer = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n\n  .color-select__input-group {\n    flex-grow: 1;\n  }\n  .color-select__input-group:nth-child(2) {\n    margin-left: 12px;\n  }\n"])));

exports.InputBoxContainer = InputBoxContainer;

var ColorSelector = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ColorSelector, _Component);

  var _super = _createSuper(ColorSelector);

  function ColorSelector() {
    var _this;

    (0, _classCallCheck2["default"])(this, ColorSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      showDropdown: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "node", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
      if (_this.props.colorUI && Number.isInteger(_this.props.colorUI.showSketcher)) {
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
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "color-selector",
        ref: this.node
      }, /*#__PURE__*/_react["default"].createElement(InputBoxContainer, null, colorSets.map(function (cSet, i) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "color-select__input-group",
          key: i
        }, /*#__PURE__*/_react["default"].createElement(ColorSelectorInput, {
          className: "color-selector__selector",
          active: editing === i,
          disabled: disabled,
          inputTheme: inputTheme,
          onMouseDown: function onMouseDown(e) {
            return _this2._showDropdown(e, i);
          }
        }, cSet.isRange ? /*#__PURE__*/_react["default"].createElement(_colorPalette["default"], {
          colors: cSet.selectedColor.colors
        }) : /*#__PURE__*/_react["default"].createElement(ColorBlock, {
          className: "color-selector__selector__block",
          color: cSet.selectedColor
        }), cSet.label ? /*#__PURE__*/_react["default"].createElement("div", {
          className: "color-selector__selector__label"
        }, cSet.label) : null));
      })), currentEditing ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledPanelDropdown, {
        className: "color-selector__dropdown"
      }, colorSets[editing].isRange ? /*#__PURE__*/_react["default"].createElement(_colorRangeSelector["default"], {
        selectedColorRange: colorSets[editing].selectedColor,
        onSelectColorRange: this._onSelectColor,
        setColorPaletteUI: this.props.setColorUI,
        colorPaletteUI: colorUI
      }) : /*#__PURE__*/_react["default"].createElement(_singleColorPalette["default"], {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3Itc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiQ29sb3JCbG9jayIsInN0eWxlZCIsImRpdiIsInByb3BzIiwiY29sb3IiLCJzbGljZSIsImpvaW4iLCJDb2xvclNlbGVjdG9ySW5wdXQiLCJpbnB1dFRoZW1lIiwidGhlbWUiLCJzZWNvbmRhcnlJbnB1dCIsImlucHV0IiwiaW5wdXRCb3hIZWlnaHQiLCJpbnB1dFBsYWNlaG9sZGVyQ29sb3IiLCJJbnB1dEJveENvbnRhaW5lciIsIkNvbG9yU2VsZWN0b3IiLCJzaG93RHJvcGRvd24iLCJlIiwiY29sb3JVSSIsIk51bWJlciIsImlzSW50ZWdlciIsInNob3dTa2V0Y2hlciIsIl9jbG9zZVBhbmVsRHJvcGRvd24iLCJzdGF0ZSIsIl9nZXRFZGl0aW5nIiwic2V0Q29sb3JVSSIsInNldFN0YXRlIiwic3RvcFByb3BhZ2F0aW9uIiwiZWRpdGluZyIsImNvbG9yU2V0cyIsInNldENvbG9yIiwiaSIsInByZXZlbnREZWZhdWx0IiwiZGlzYWJsZWQiLCJjdXJyZW50RWRpdGluZyIsIm5vZGUiLCJtYXAiLCJjU2V0IiwiX3Nob3dEcm9wZG93biIsImlzUmFuZ2UiLCJzZWxlY3RlZENvbG9yIiwiY29sb3JzIiwibGFiZWwiLCJfb25TZWxlY3RDb2xvciIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImFycmF5T2YiLCJzaGFwZSIsIm9uZU9mVHlwZSIsImFueSIsIm9iamVjdCIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYm9vbCIsInN0cmluZyIsImN1c3RvbVBhbGV0dGUiLCJudW1iZXIiLCJjb2xvclJhbmdlQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFTyxJQUFNQSxV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c0JBQVVHLFNBQVYsQ0FBb0IsQ0FBQ0gsc0JBQVVRLElBQVgsRUFBaUJSLHNCQUFVVyxNQUEzQixDQUFwQixDQUZTO0FBR3ZCeEMsSUFBQUEsWUFBWSxFQUFFNkIsc0JBQVVHLFNBQVYsQ0FBb0IsQ0FBQ0gsc0JBQVVRLElBQVgsRUFBaUJSLHNCQUFVVyxNQUEzQixDQUFwQixDQUhTO0FBSXZCQyxJQUFBQSxnQkFBZ0IsRUFBRVosc0JBQVVLO0FBSkwsR0FBaEIsQ0FUUTtBQWVqQjFDLEVBQUFBLFVBQVUsRUFBRXFDLHNCQUFVUyxNQWZMO0FBZ0JqQnJCLEVBQUFBLFFBQVEsRUFBRVksc0JBQVVRLElBaEJIO0FBaUJqQjVCLEVBQUFBLFVBQVUsRUFBRW9CLHNCQUFVTTtBQWpCTCxDO2lDQURmcEMsYSxrQkFxQmtCO0FBQ3BCYyxFQUFBQSxTQUFTLEVBQUU7QUFEUyxDOztlQTBHVCxxQ0FBZWQsYUFBZixDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7cmdiVG9IZXh9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCBTaW5nbGVDb2xvclBhbGV0dGUgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL3NpbmdsZS1jb2xvci1wYWxldHRlJztcbmltcG9ydCBDb2xvclJhbmdlU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL2NvbG9yLXJhbmdlLXNlbGVjdG9yJztcbmltcG9ydCBDb2xvclBhbGV0dGUgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2xheWVyLXBhbmVsL2NvbG9yLXBhbGV0dGUnO1xuaW1wb3J0IHtTdHlsZWRQYW5lbERyb3Bkb3dufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgb25DbGlja091dHNpZGUgZnJvbSAncmVhY3Qtb25jbGlja291dHNpZGUnO1xuXG5leHBvcnQgY29uc3QgQ29sb3JCbG9jayA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiAzMnB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBgcmdiKCR7cHJvcHMuY29sb3Iuc2xpY2UoMCwgMykuam9pbignLCcpfSlgfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBDb2xvclNlbGVjdG9ySW5wdXQgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IChwcm9wcy5pbnB1dFRoZW1lID09PSAnc2Vjb25kYXJ5JyA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0IDogcHJvcHMudGhlbWUuaW5wdXQpfTtcbiAgaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Qm94SGVpZ2h0fTtcblxuICAuY29sb3Itc2VsZWN0b3JfX3NlbGVjdG9yX19sYWJlbCB7XG4gICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dFBsYWNlaG9sZGVyQ29sb3J9O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgSW5wdXRCb3hDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgLmNvbG9yLXNlbGVjdF9faW5wdXQtZ3JvdXAge1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgfVxuICAuY29sb3Itc2VsZWN0X19pbnB1dC1ncm91cDpudGgtY2hpbGQoMikge1xuICAgIG1hcmdpbi1sZWZ0OiAxMnB4O1xuICB9XG5gO1xuXG5jbGFzcyBDb2xvclNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb2xvclNldHM6IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgc2VsZWN0ZWRDb2xvcjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSksIFByb3BUeXBlcy5vYmplY3RdKSxcbiAgICAgICAgc2V0Q29sb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICAgIGlzUmFuZ2U6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZ1xuICAgICAgfSlcbiAgICApLFxuICAgIGNvbG9yVUk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjdXN0b21QYWxldHRlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgc2hvd1NrZXRjaGVyOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuYm9vbCwgUHJvcFR5cGVzLm51bWJlcl0pLFxuICAgICAgc2hvd0Ryb3Bkb3duOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuYm9vbCwgUHJvcFR5cGVzLm51bWJlcl0pLFxuICAgICAgY29sb3JSYW5nZUNvbmZpZzogUHJvcFR5cGVzLm9iamVjdFxuICAgIH0pLFxuICAgIGlucHV0VGhlbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIHNldENvbG9yVUk6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjb2xvclNldHM6IFtdXG4gIH07XG5cbiAgc3RhdGUgPSB7XG4gICAgc2hvd0Ryb3Bkb3duOiBmYWxzZVxuICB9O1xuXG4gIG5vZGUgPSBjcmVhdGVSZWYoKTtcblxuICBoYW5kbGVDbGlja091dHNpZGUgPSBlID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb2xvclVJICYmIE51bWJlci5pc0ludGVnZXIodGhpcy5wcm9wcy5jb2xvclVJLnNob3dTa2V0Y2hlcikpIHtcbiAgICAgIC8vIGlmIHNrZXRjaGVyIGlzIG9wZW4sIGxldCBza2V0Y2ggdG8gY2xvc2UgaXRzZWxmIGZpcnN0XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2Nsb3NlUGFuZWxEcm9wZG93bigpO1xuICB9O1xuXG4gIF9nZXRFZGl0aW5nID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbG9yVUkgPyB0aGlzLnByb3BzLmNvbG9yVUkuc2hvd0Ryb3Bkb3duIDogdGhpcy5zdGF0ZS5zaG93RHJvcGRvd247XG4gIH07XG5cbiAgX2Nsb3NlUGFuZWxEcm9wZG93biA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5fZ2V0RWRpdGluZygpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5zZXRDb2xvclVJKSB7XG4gICAgICB0aGlzLnByb3BzLnNldENvbG9yVUkoe3Nob3dEcm9wZG93bjogZmFsc2UsIHNob3dTa2V0Y2hlcjogZmFsc2V9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0Ryb3Bkb3duOiBmYWxzZX0pO1xuICAgIH1cbiAgfTtcblxuICBfb25TZWxlY3RDb2xvciA9IChjb2xvciwgZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgZWRpdGluZyA9IHRoaXMuX2dldEVkaXRpbmcoKTtcbiAgICBpZiAodGhpcy5wcm9wcy5jb2xvclNldHNbZWRpdGluZ10pIHtcbiAgICAgIHRoaXMucHJvcHMuY29sb3JTZXRzW2VkaXRpbmddLnNldENvbG9yKGNvbG9yKTtcbiAgICB9XG4gIH07XG5cbiAgX3Nob3dEcm9wZG93biA9IChlLCBpKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMucHJvcHMuc2V0Q29sb3JVSSkge1xuICAgICAgdGhpcy5wcm9wcy5zZXRDb2xvclVJKHtzaG93RHJvcGRvd246IGl9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0Ryb3Bkb3duOiBpfSk7XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y29sb3JTZXRzLCBkaXNhYmxlZCwgaW5wdXRUaGVtZSwgY29sb3JVSX0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgZWRpdGluZyA9IHRoaXMuX2dldEVkaXRpbmcoKTtcbiAgICBjb25zdCBjdXJyZW50RWRpdGluZyA9IGNvbG9yU2V0c1tlZGl0aW5nXSAmJiB0eXBlb2YgY29sb3JTZXRzW2VkaXRpbmddID09PSAnb2JqZWN0JztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yXCIgcmVmPXt0aGlzLm5vZGV9PlxuICAgICAgICA8SW5wdXRCb3hDb250YWluZXI+XG4gICAgICAgICAge2NvbG9yU2V0cy5tYXAoKGNTZXQsIGkpID0+IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3Itc2VsZWN0X19pbnB1dC1ncm91cFwiIGtleT17aX0+XG4gICAgICAgICAgICAgIDxDb2xvclNlbGVjdG9ySW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjb2xvci1zZWxlY3Rvcl9fc2VsZWN0b3JcIlxuICAgICAgICAgICAgICAgIGFjdGl2ZT17ZWRpdGluZyA9PT0gaX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgaW5wdXRUaGVtZT17aW5wdXRUaGVtZX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZSA9PiB0aGlzLl9zaG93RHJvcGRvd24oZSwgaSl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Y1NldC5pc1JhbmdlID8gKFxuICAgICAgICAgICAgICAgICAgPENvbG9yUGFsZXR0ZSBjb2xvcnM9e2NTZXQuc2VsZWN0ZWRDb2xvci5jb2xvcnN9IC8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxDb2xvckJsb2NrXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNvbG9yLXNlbGVjdG9yX19zZWxlY3Rvcl9fYmxvY2tcIlxuICAgICAgICAgICAgICAgICAgICBjb2xvcj17Y1NldC5zZWxlY3RlZENvbG9yfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHtjU2V0LmxhYmVsID8gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1zZWxlY3Rvcl9fc2VsZWN0b3JfX2xhYmVsXCI+e2NTZXQubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDwvQ29sb3JTZWxlY3RvcklucHV0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvSW5wdXRCb3hDb250YWluZXI+XG4gICAgICAgIHtjdXJyZW50RWRpdGluZyA/IChcbiAgICAgICAgICA8U3R5bGVkUGFuZWxEcm9wZG93biBjbGFzc05hbWU9XCJjb2xvci1zZWxlY3Rvcl9fZHJvcGRvd25cIj5cbiAgICAgICAgICAgIHtjb2xvclNldHNbZWRpdGluZ10uaXNSYW5nZSA/IChcbiAgICAgICAgICAgICAgPENvbG9yUmFuZ2VTZWxlY3RvclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3JSYW5nZT17Y29sb3JTZXRzW2VkaXRpbmddLnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgICAgICAgb25TZWxlY3RDb2xvclJhbmdlPXt0aGlzLl9vblNlbGVjdENvbG9yfVxuICAgICAgICAgICAgICAgIHNldENvbG9yUGFsZXR0ZVVJPXt0aGlzLnByb3BzLnNldENvbG9yVUl9XG4gICAgICAgICAgICAgICAgY29sb3JQYWxldHRlVUk9e2NvbG9yVUl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8U2luZ2xlQ29sb3JQYWxldHRlXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcj17cmdiVG9IZXgoY29sb3JTZXRzW2VkaXRpbmddLnNlbGVjdGVkQ29sb3IpfVxuICAgICAgICAgICAgICAgIG9uU2VsZWN0Q29sb3I9e3RoaXMuX29uU2VsZWN0Q29sb3J9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3R5bGVkUGFuZWxEcm9wZG93bj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9uQ2xpY2tPdXRzaWRlKENvbG9yU2VsZWN0b3IpO1xuIl19