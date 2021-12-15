"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _reactSortableHoc = require("react-sortable-hoc");

var _portaled = _interopRequireDefault(require("../../common/portaled"));

var _styledComponents2 = require("../../common/styled-components");

var _icons = require("../../common/icons");

var _colorPalette = _interopRequireDefault(require("./color-palette"));

var _customPicker = _interopRequireDefault(require("./custom-picker"));

var _dataUtils = require("../../../utils/data-utils");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var dragHandleActive = (0, _styledComponents.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .layer__drag-handle {\n    color: ", ";\n    opacity: 1;\n    cursor: move;\n  }\n"])), function (props) {
  return props.theme.textColorHl;
});

var StyledSortableItem = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  padding-top: 6px;\n  padding-bottom: 6px;\n  z-index: ", ";\n\n  :not(.sorting) {\n    :hover {\n      background-color: ", ";\n      ", ";\n    }\n  }\n\n  &.sorting-colors {\n    background-color: ", ";\n    ", ";\n  }\n"])), function (props) {
  return props.theme.dropdownWrapperZ + 1;
}, function (props) {
  return props.theme.panelBackgroundHover;
}, dragHandleActive, function (props) {
  return props.theme.panelBackgroundHover;
}, dragHandleActive);

var StyledDragHandle = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  opacity: 0;\n"])));

var StyledTrash = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  svg {\n    :hover {\n      color: ", ";\n    }\n  }\n  height: 12px;\n  margin-left: auto;\n  margin-right: 12px;\n  :hover {\n    cursor: pointer;\n  }\n"])), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.subtextColorActive;
});

var StyledLine = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  width: calc(100% - 16px);\n  height: 1px;\n  background-color: ", ";\n  margin-top: 8px;\n  margin-left: 8px;\n"])), function (props) {
  return props.theme.labelColor;
});

var StyledSwatch = _styledComponents["default"].div.attrs({
  className: 'custom-palette__swatch'
})(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  width: 32px;\n  height: 18px;\n  display: inline-block;\n  :hover {\n    box-shadow: ", ";\n    cursor: pointer;\n  }\n"])), function (props) {
  return props.color;
}, function (props) {
  return props.theme.boxShadow;
});

var StyledColorRange = _styledComponents["default"].div(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 0 8px;\n  :hover {\n    background-color: ", ";\n    cursor: pointer;\n  }\n"])), function (props) {
  return props.theme.panelBackgroundHover;
});

var StyledButtonContainer = _styledComponents["default"].div(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 11px;\n  display: flex;\n  direction: rtl;\n"])));

var StyledInlineInput = _styledComponents["default"].div(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: 12px;\n  input {\n    color: ", ";\n    font-size: 10px;\n  }\n"])), function (props) {
  return props.theme.textColorHl;
});

var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref) {
  var children = _ref.children,
      isSorting = _ref.isSorting;
  return /*#__PURE__*/_react["default"].createElement(StyledSortableItem, {
    className: (0, _classnames["default"])('custom-palette__sortable-items', {
      sorting: isSorting
    })
  }, children);
}); // TODO: Should className be applied to the div here?

var WrappedSortableContainer = (0, _reactSortableHoc.SortableContainer)(function (_ref2) {
  var children = _ref2.children,
      className = _ref2.className;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: className
  }, children);
});
var DragHandle = (0, _reactSortableHoc.SortableHandle)(function (_ref3) {
  var className = _ref3.className,
      children = _ref3.children;
  return /*#__PURE__*/_react["default"].createElement(StyledDragHandle, {
    className: className
  }, children);
});

var CustomPalette = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(CustomPalette, _Component);

  var _super = _createSuper(CustomPalette);

  function CustomPalette() {
    var _this;

    (0, _classCallCheck2["default"])(this, CustomPalette);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      isSorting: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "root", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onPickerUpdate", function (color) {
      var colors = _this.props.customPalette.colors;
      var newColors = (0, _toConsumableArray2["default"])(colors);
      newColors[_this.props.showSketcher] = color.hex;

      _this._setColorPaletteUI(newColors);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onColorDelete", function (index) {
      var colors = _this.props.customPalette.colors;
      var newColors = (0, _toConsumableArray2["default"])(colors);

      if (newColors.length > 1) {
        newColors.splice(index, 1);
      }

      _this._setColorPaletteUI(newColors);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onColorAdd", function () {
      var colors = _this.props.customPalette.colors; // add the last color

      var newColors = [].concat((0, _toConsumableArray2["default"])(colors), [colors[colors.length - 1]]);

      _this._setColorPaletteUI(newColors);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSwatchClick", function (index) {
      _this.props.onToggleSketcher(index);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSwatchClose", function () {
      _this.props.onToggleSketcher(false);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onApply", function (event) {
      event.stopPropagation();
      event.preventDefault();

      _this.props.onCancel();

      _this.props.onApply(_this.props.customPalette, event);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSortEnd", function (_ref4) {
      var oldIndex = _ref4.oldIndex,
          newIndex = _ref4.newIndex;
      var colors = _this.props.customPalette.colors;
      var newColors = (0, _dataUtils.arrayMove)(colors, oldIndex, newIndex);

      _this._setColorPaletteUI(newColors);

      _this.setState({
        isSorting: false
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSortStart", function () {
      _this.setState({
        isSorting: true
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_inputColorHex", function (index, _ref5) {
      var value = _ref5.target.value;
      var colors = _this.props.customPalette.colors;
      var newColors = (0, _toConsumableArray2["default"])(colors);
      newColors[index] = value.toUpperCase();

      _this._setColorPaletteUI(newColors);
    });
    return _this;
  }

  (0, _createClass2["default"])(CustomPalette, [{
    key: "_setColorPaletteUI",
    value: function _setColorPaletteUI(colors) {
      this.props.setCustomPalette({
        colors: colors
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var colors = this.props.customPalette.colors;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-palette-panel",
        ref: this.root
      }, /*#__PURE__*/_react["default"].createElement(StyledColorRange, null, /*#__PURE__*/_react["default"].createElement(_colorPalette["default"], {
        colors: colors
      })), /*#__PURE__*/_react["default"].createElement(WrappedSortableContainer, {
        className: "custom-palette-container",
        onSortEnd: this._onSortEnd,
        onSortStart: this._onSortStart,
        lockAxis: "y",
        helperClass: "sorting-colors",
        useDragHandle: true
      }, colors.map(function (color, index) {
        return /*#__PURE__*/_react["default"].createElement(SortableItem, {
          key: index,
          index: index,
          isSorting: _this2.state.isSorting
        }, /*#__PURE__*/_react["default"].createElement(DragHandle, {
          className: "layer__drag-handle"
        }, /*#__PURE__*/_react["default"].createElement(_icons.VertDots, {
          height: "20px"
        })), /*#__PURE__*/_react["default"].createElement(StyledSwatch, {
          color: color,
          onClick: function onClick() {
            return _this2._onSwatchClick(index);
          }
        }), /*#__PURE__*/_react["default"].createElement(StyledInlineInput, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.InlineInput, {
          type: "text",
          className: "custom-palette-hex__input",
          value: color.toUpperCase(),
          onClick: function onClick(e) {
            e.stopPropagation();
          },
          onChange: function onChange(e) {
            return _this2._inputColorHex(index, e);
          },
          id: "input-layer-label-".concat(index)
        })), /*#__PURE__*/_react["default"].createElement(StyledTrash, {
          onClick: function onClick() {
            return _this2._onColorDelete(index);
          }
        }, /*#__PURE__*/_react["default"].createElement(_icons.Trash, {
          className: "trashbin"
        })));
      })), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
        className: "add-step__button",
        link: true,
        onClick: this._onColorAdd
      }, "+ Add Step"), /*#__PURE__*/_react["default"].createElement(StyledLine, null), /*#__PURE__*/_react["default"].createElement(StyledButtonContainer, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
        className: "confirm-apply__button",
        link: true,
        onClick: this._onApply
      }, "Confirm"), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
        link: true,
        onClick: this.props.onCancel
      }, "Cancel")), /*#__PURE__*/_react["default"].createElement(_portaled["default"], {
        isOpened: this.props.showSketcher !== false,
        left: 280,
        top: -300
      }, /*#__PURE__*/_react["default"].createElement(_customPicker["default"], {
        color: colors[this.props.showSketcher],
        onChange: this._onPickerUpdate,
        onSwatchClose: this._onSwatchClose
      })));
    }
  }]);
  return CustomPalette;
}(_react.Component);

(0, _defineProperty2["default"])(CustomPalette, "propTypes", {
  customPalette: _propTypes["default"].shape({
    name: _propTypes["default"].string,
    type: _propTypes["default"].string,
    category: _propTypes["default"].string,
    colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
  }),
  setCustomPalette: _propTypes["default"].func,
  showSketcher: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].number])
});
var _default = CustomPalette;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY3VzdG9tLXBhbGV0dGUuanMiXSwibmFtZXMiOlsiZHJhZ0hhbmRsZUFjdGl2ZSIsImNzcyIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3JIbCIsIlN0eWxlZFNvcnRhYmxlSXRlbSIsInN0eWxlZCIsImRpdiIsImRyb3Bkb3duV3JhcHBlcloiLCJwYW5lbEJhY2tncm91bmRIb3ZlciIsIlN0eWxlZERyYWdIYW5kbGUiLCJTdHlsZWRUcmFzaCIsInRleHRDb2xvciIsInN1YnRleHRDb2xvckFjdGl2ZSIsIlN0eWxlZExpbmUiLCJsYWJlbENvbG9yIiwiU3R5bGVkU3dhdGNoIiwiYXR0cnMiLCJjbGFzc05hbWUiLCJjb2xvciIsImJveFNoYWRvdyIsIlN0eWxlZENvbG9yUmFuZ2UiLCJTdHlsZWRCdXR0b25Db250YWluZXIiLCJTdHlsZWRJbmxpbmVJbnB1dCIsIlNvcnRhYmxlSXRlbSIsImNoaWxkcmVuIiwiaXNTb3J0aW5nIiwic29ydGluZyIsIldyYXBwZWRTb3J0YWJsZUNvbnRhaW5lciIsIkRyYWdIYW5kbGUiLCJDdXN0b21QYWxldHRlIiwiY29sb3JzIiwiY3VzdG9tUGFsZXR0ZSIsIm5ld0NvbG9ycyIsInNob3dTa2V0Y2hlciIsImhleCIsIl9zZXRDb2xvclBhbGV0dGVVSSIsImluZGV4IiwibGVuZ3RoIiwic3BsaWNlIiwib25Ub2dnbGVTa2V0Y2hlciIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJvbkNhbmNlbCIsIm9uQXBwbHkiLCJvbGRJbmRleCIsIm5ld0luZGV4Iiwic2V0U3RhdGUiLCJ2YWx1ZSIsInRhcmdldCIsInRvVXBwZXJDYXNlIiwic2V0Q3VzdG9tUGFsZXR0ZSIsInJvb3QiLCJfb25Tb3J0RW5kIiwiX29uU29ydFN0YXJ0IiwibWFwIiwic3RhdGUiLCJfb25Td2F0Y2hDbGljayIsImUiLCJfaW5wdXRDb2xvckhleCIsIl9vbkNvbG9yRGVsZXRlIiwiX29uQ29sb3JBZGQiLCJfb25BcHBseSIsIl9vblBpY2tlclVwZGF0ZSIsIl9vblN3YXRjaENsb3NlIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwic2hhcGUiLCJuYW1lIiwic3RyaW5nIiwidHlwZSIsImNhdGVnb3J5IiwiYXJyYXlPZiIsImZ1bmMiLCJvbmVPZlR5cGUiLCJib29sIiwibnVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxnQkFBZ0IsT0FBR0MscUJBQUgsOEtBRVQsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBRkksQ0FBdEI7O0FBUUEsSUFBTUMsa0JBQWtCLEdBQUdDLDZCQUFPQyxHQUFWLHFXQUtYLFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUssZ0JBQVosR0FBK0IsQ0FBbkM7QUFBQSxDQUxNLEVBU0UsVUFBQU4sS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZTSxvQkFBaEI7QUFBQSxDQVRQLEVBVWhCVCxnQkFWZ0IsRUFlQSxVQUFBRSxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlNLG9CQUFoQjtBQUFBLENBZkwsRUFnQmxCVCxnQkFoQmtCLENBQXhCOztBQW9CQSxJQUFNVSxnQkFBZ0IsR0FBR0osNkJBQU9DLEdBQVYsbUpBQXRCOztBQU1BLElBQU1JLFdBQVcsR0FBR0wsNkJBQU9DLEdBQVYsdVFBQ04sVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZUyxTQUFoQjtBQUFBLENBREMsRUFJRixVQUFBVixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlVLGtCQUFoQjtB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IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQsIHtjc3N9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7U29ydGFibGVDb250YWluZXIsIFNvcnRhYmxlRWxlbWVudCwgU29ydGFibGVIYW5kbGV9IGZyb20gJ3JlYWN0LXNvcnRhYmxlLWhvYyc7XG5pbXBvcnQgUG9ydGFsZWQgZnJvbSAnY29tcG9uZW50cy9jb21tb24vcG9ydGFsZWQnO1xuXG5pbXBvcnQge0J1dHRvbiwgSW5saW5lSW5wdXR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7VmVydERvdHMsIFRyYXNofSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgQ29sb3JQYWxldHRlIGZyb20gJy4vY29sb3ItcGFsZXR0ZSc7XG5pbXBvcnQgQ3VzdG9tUGlja2VyIGZyb20gJy4vY3VzdG9tLXBpY2tlcic7XG5pbXBvcnQge2FycmF5TW92ZX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmNvbnN0IGRyYWdIYW5kbGVBY3RpdmUgPSBjc3NgXG4gIC5sYXllcl9fZHJhZy1oYW5kbGUge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICBvcGFjaXR5OiAxO1xuICAgIGN1cnNvcjogbW92ZTtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkU29ydGFibGVJdGVtID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZy10b3A6IDZweDtcbiAgcGFkZGluZy1ib3R0b206IDZweDtcbiAgei1pbmRleDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bldyYXBwZXJaICsgMX07XG5cbiAgOm5vdCguc29ydGluZykge1xuICAgIDpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcbiAgICAgICR7ZHJhZ0hhbmRsZUFjdGl2ZX07XG4gICAgfVxuICB9XG5cbiAgJi5zb3J0aW5nLWNvbG9ycyB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRIb3Zlcn07XG4gICAgJHtkcmFnSGFuZGxlQWN0aXZlfTtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkRHJhZ0hhbmRsZSA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG9wYWNpdHk6IDA7XG5gO1xuXG5jb25zdCBTdHlsZWRUcmFzaCA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIHN2ZyB7XG4gICAgOmhvdmVyIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckFjdGl2ZX07XG4gICAgfVxuICB9XG4gIGhlaWdodDogMTJweDtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIG1hcmdpbi1yaWdodDogMTJweDtcbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZExpbmUgPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogY2FsYygxMDAlIC0gMTZweCk7XG4gIGhlaWdodDogMXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBtYXJnaW4tdG9wOiA4cHg7XG4gIG1hcmdpbi1sZWZ0OiA4cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRTd2F0Y2ggPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnY3VzdG9tLXBhbGV0dGVfX3N3YXRjaCdcbn0pYFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLmNvbG9yfTtcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMThweDtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICA6aG92ZXIge1xuICAgIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuYm94U2hhZG93fTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZENvbG9yUmFuZ2UgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAwIDhweDtcbiAgOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZEJ1dHRvbkNvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi10b3A6IDExcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGRpcmVjdGlvbjogcnRsO1xuYDtcblxuY29uc3QgU3R5bGVkSW5saW5lSW5wdXQgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogMTJweDtcbiAgaW5wdXQge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gIH1cbmA7XG5cbmNvbnN0IFNvcnRhYmxlSXRlbSA9IFNvcnRhYmxlRWxlbWVudCgoe2NoaWxkcmVuLCBpc1NvcnRpbmd9KSA9PiAoXG4gIDxTdHlsZWRTb3J0YWJsZUl0ZW1cbiAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2N1c3RvbS1wYWxldHRlX19zb3J0YWJsZS1pdGVtcycsIHtzb3J0aW5nOiBpc1NvcnRpbmd9KX1cbiAgPlxuICAgIHtjaGlsZHJlbn1cbiAgPC9TdHlsZWRTb3J0YWJsZUl0ZW0+XG4pKTtcblxuLy8gVE9ETzogU2hvdWxkIGNsYXNzTmFtZSBiZSBhcHBsaWVkIHRvIHRoZSBkaXYgaGVyZT9cbmNvbnN0IFdyYXBwZWRTb3J0YWJsZUNvbnRhaW5lciA9IFNvcnRhYmxlQ29udGFpbmVyKCh7Y2hpbGRyZW4sIGNsYXNzTmFtZX0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e2NoaWxkcmVufTwvZGl2PlxuKSk7XG5cbmNvbnN0IERyYWdIYW5kbGUgPSBTb3J0YWJsZUhhbmRsZSgoe2NsYXNzTmFtZSwgY2hpbGRyZW59KSA9PiAoXG4gIDxTdHlsZWREcmFnSGFuZGxlIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57Y2hpbGRyZW59PC9TdHlsZWREcmFnSGFuZGxlPlxuKSk7XG5cbmNsYXNzIEN1c3RvbVBhbGV0dGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGN1c3RvbVBhbGV0dGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGNhdGVnb3J5OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgY29sb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICAgIH0pLFxuICAgIHNldEN1c3RvbVBhbGV0dGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIHNob3dTa2V0Y2hlcjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmJvb2wsIFByb3BUeXBlcy5udW1iZXJdKVxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIGlzU29ydGluZzogZmFsc2VcbiAgfTtcblxuICByb290ID0gY3JlYXRlUmVmKCk7XG5cbiAgX3NldENvbG9yUGFsZXR0ZVVJKGNvbG9ycykge1xuICAgIHRoaXMucHJvcHMuc2V0Q3VzdG9tUGFsZXR0ZSh7XG4gICAgICBjb2xvcnNcbiAgICB9KTtcbiAgfVxuXG4gIF9vblBpY2tlclVwZGF0ZSA9IGNvbG9yID0+IHtcbiAgICBjb25zdCB7Y29sb3JzfSA9IHRoaXMucHJvcHMuY3VzdG9tUGFsZXR0ZTtcbiAgICBjb25zdCBuZXdDb2xvcnMgPSBbLi4uY29sb3JzXTtcbiAgICBuZXdDb2xvcnNbdGhpcy5wcm9wcy5zaG93U2tldGNoZXJdID0gY29sb3IuaGV4O1xuICAgIHRoaXMuX3NldENvbG9yUGFsZXR0ZVVJKG5ld0NvbG9ycyk7XG4gIH07XG5cbiAgX29uQ29sb3JEZWxldGUgPSBpbmRleCA9PiB7XG4gICAgY29uc3Qge2NvbG9yc30gPSB0aGlzLnByb3BzLmN1c3RvbVBhbGV0dGU7XG4gICAgY29uc3QgbmV3Q29sb3JzID0gWy4uLmNvbG9yc107XG4gICAgaWYgKG5ld0NvbG9ycy5sZW5ndGggPiAxKSB7XG4gICAgICBuZXdDb2xvcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgdGhpcy5fc2V0Q29sb3JQYWxldHRlVUkobmV3Q29sb3JzKTtcbiAgfTtcblxuICBfb25Db2xvckFkZCA9ICgpID0+IHtcbiAgICBjb25zdCB7Y29sb3JzfSA9IHRoaXMucHJvcHMuY3VzdG9tUGFsZXR0ZTtcbiAgICAvLyBhZGQgdGhlIGxhc3QgY29sb3JcbiAgICBjb25zdCBuZXdDb2xvcnMgPSBbLi4uY29sb3JzLCBjb2xvcnNbY29sb3JzLmxlbmd0aCAtIDFdXTtcbiAgICB0aGlzLl9zZXRDb2xvclBhbGV0dGVVSShuZXdDb2xvcnMpO1xuICB9O1xuXG4gIF9vblN3YXRjaENsaWNrID0gaW5kZXggPT4ge1xuICAgIHRoaXMucHJvcHMub25Ub2dnbGVTa2V0Y2hlcihpbmRleCk7XG4gIH07XG5cbiAgX29uU3dhdGNoQ2xvc2UgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblRvZ2dsZVNrZXRjaGVyKGZhbHNlKTtcbiAgfTtcblxuICBfb25BcHBseSA9IGV2ZW50ID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMub25DYW5jZWwoKTtcbiAgICB0aGlzLnByb3BzLm9uQXBwbHkodGhpcy5wcm9wcy5jdXN0b21QYWxldHRlLCBldmVudCk7XG4gIH07XG5cbiAgX29uU29ydEVuZCA9ICh7b2xkSW5kZXgsIG5ld0luZGV4fSkgPT4ge1xuICAgIGNvbnN0IHtjb2xvcnN9ID0gdGhpcy5wcm9wcy5jdXN0b21QYWxldHRlO1xuICAgIGNvbnN0IG5ld0NvbG9ycyA9IGFycmF5TW92ZShjb2xvcnMsIG9sZEluZGV4LCBuZXdJbmRleCk7XG4gICAgdGhpcy5fc2V0Q29sb3JQYWxldHRlVUkobmV3Q29sb3JzKTtcbiAgICB0aGlzLnNldFN0YXRlKHtpc1NvcnRpbmc6IGZhbHNlfSk7XG4gIH07XG5cbiAgX29uU29ydFN0YXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzU29ydGluZzogdHJ1ZX0pO1xuICB9O1xuXG4gIF9pbnB1dENvbG9ySGV4ID0gKGluZGV4LCB7dGFyZ2V0OiB7dmFsdWV9fSkgPT4ge1xuICAgIGNvbnN0IHtjb2xvcnN9ID0gdGhpcy5wcm9wcy5jdXN0b21QYWxldHRlO1xuICAgIGNvbnN0IG5ld0NvbG9ycyA9IFsuLi5jb2xvcnNdO1xuICAgIG5ld0NvbG9yc1tpbmRleF0gPSB2YWx1ZS50b1VwcGVyQ2FzZSgpO1xuICAgIHRoaXMuX3NldENvbG9yUGFsZXR0ZVVJKG5ld0NvbG9ycyk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb2xvcnN9ID0gdGhpcy5wcm9wcy5jdXN0b21QYWxldHRlO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3VzdG9tLXBhbGV0dGUtcGFuZWxcIiByZWY9e3RoaXMucm9vdH0+XG4gICAgICAgIDxTdHlsZWRDb2xvclJhbmdlPlxuICAgICAgICAgIDxDb2xvclBhbGV0dGUgY29sb3JzPXtjb2xvcnN9IC8+XG4gICAgICAgIDwvU3R5bGVkQ29sb3JSYW5nZT5cbiAgICAgICAgPFdyYXBwZWRTb3J0YWJsZUNvbnRhaW5lclxuICAgICAgICAgIGNsYXNzTmFtZT1cImN1c3RvbS1wYWxldHRlLWNvbnRhaW5lclwiXG4gICAgICAgICAgb25Tb3J0RW5kPXt0aGlzLl9vblNvcnRFbmR9XG4gICAgICAgICAgb25Tb3J0U3RhcnQ9e3RoaXMuX29uU29ydFN0YXJ0fVxuICAgICAgICAgIGxvY2tBeGlzPVwieVwiXG4gICAgICAgICAgaGVscGVyQ2xhc3M9XCJzb3J0aW5nLWNvbG9yc1wiXG4gICAgICAgICAgdXNlRHJhZ0hhbmRsZVxuICAgICAgICA+XG4gICAgICAgICAge2NvbG9ycy5tYXAoKGNvbG9yLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPFNvcnRhYmxlSXRlbSBrZXk9e2luZGV4fSBpbmRleD17aW5kZXh9IGlzU29ydGluZz17dGhpcy5zdGF0ZS5pc1NvcnRpbmd9PlxuICAgICAgICAgICAgICA8RHJhZ0hhbmRsZSBjbGFzc05hbWU9XCJsYXllcl9fZHJhZy1oYW5kbGVcIj5cbiAgICAgICAgICAgICAgICA8VmVydERvdHMgaGVpZ2h0PVwiMjBweFwiIC8+XG4gICAgICAgICAgICAgIDwvRHJhZ0hhbmRsZT5cbiAgICAgICAgICAgICAgPFN0eWxlZFN3YXRjaCBjb2xvcj17Y29sb3J9IG9uQ2xpY2s9eygpID0+IHRoaXMuX29uU3dhdGNoQ2xpY2soaW5kZXgpfSAvPlxuICAgICAgICAgICAgICA8U3R5bGVkSW5saW5lSW5wdXQ+XG4gICAgICAgICAgICAgICAgPElubGluZUlucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjdXN0b20tcGFsZXR0ZS1oZXhfX2lucHV0XCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtjb2xvci50b1VwcGVyQ2FzZSgpfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gdGhpcy5faW5wdXRDb2xvckhleChpbmRleCwgZSl9XG4gICAgICAgICAgICAgICAgICBpZD17YGlucHV0LWxheWVyLWxhYmVsLSR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L1N0eWxlZElubGluZUlucHV0PlxuICAgICAgICAgICAgICA8U3R5bGVkVHJhc2ggb25DbGljaz17KCkgPT4gdGhpcy5fb25Db2xvckRlbGV0ZShpbmRleCl9PlxuICAgICAgICAgICAgICAgIDxUcmFzaCBjbGFzc05hbWU9XCJ0cmFzaGJpblwiIC8+XG4gICAgICAgICAgICAgIDwvU3R5bGVkVHJhc2g+XG4gICAgICAgICAgICA8L1NvcnRhYmxlSXRlbT5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9XcmFwcGVkU29ydGFibGVDb250YWluZXI+XG4gICAgICAgIHsvKiBBZGQgU3RlcCBCdXR0b24gKi99XG4gICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwiYWRkLXN0ZXBfX2J1dHRvblwiIGxpbmsgb25DbGljaz17dGhpcy5fb25Db2xvckFkZH0+XG4gICAgICAgICAgKyBBZGQgU3RlcFxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPFN0eWxlZExpbmUgLz5cbiAgICAgICAgey8qIENhbmNlbCBvciBDb25maXJtIEJ1dHRvbnMgKi99XG4gICAgICAgIDxTdHlsZWRCdXR0b25Db250YWluZXI+XG4gICAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJjb25maXJtLWFwcGx5X19idXR0b25cIiBsaW5rIG9uQ2xpY2s9e3RoaXMuX29uQXBwbHl9PlxuICAgICAgICAgICAgQ29uZmlybVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gbGluayBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2FuY2VsfT5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0eWxlZEJ1dHRvbkNvbnRhaW5lcj5cblxuICAgICAgICA8UG9ydGFsZWQgaXNPcGVuZWQ9e3RoaXMucHJvcHMuc2hvd1NrZXRjaGVyICE9PSBmYWxzZX0gbGVmdD17MjgwfSB0b3A9ey0zMDB9PlxuICAgICAgICAgIDxDdXN0b21QaWNrZXJcbiAgICAgICAgICAgIGNvbG9yPXtjb2xvcnNbdGhpcy5wcm9wcy5zaG93U2tldGNoZXJdfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uUGlja2VyVXBkYXRlfVxuICAgICAgICAgICAgb25Td2F0Y2hDbG9zZT17dGhpcy5fb25Td2F0Y2hDbG9zZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1BvcnRhbGVkPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXN0b21QYWxldHRlO1xuIl19